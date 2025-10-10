/**
 * VoiceDriveAnalyticsClient
 *
 * VoiceDrive Analytics API クライアント
 * 集団分析データの取得・送信を担当
 *
 * 機能:
 * - GET /api/v1/analytics/aggregated-stats: 集計データ取得
 * - POST /api/v1/analytics/group-data: 分析データ送信
 * - JWT認証
 * - HMAC-SHA256署名
 * - リトライ処理
 * - レート制限対応
 *
 * 参照:
 * - mcp-shared/docs/Meeting_Minutes_20251009.md
 * - mcp-shared/interfaces/voicedrive-analytics-api.interface.ts
 */

import crypto from 'crypto';
import {
  VoiceDriveAnalyticsConfig,
  AggregatedStatsRequest,
  AggregatedStatsResponse,
  GroupAnalyticsRequest,
  GroupAnalyticsResponse,
  VoiceDriveApiError,
  HmacSignaturePayload,
  RateLimitInfo,
  ApiCallResult,
} from '../../mcp-shared/interfaces/voicedrive-analytics-api.interface';

export class VoiceDriveAnalyticsClient {
  private config: VoiceDriveAnalyticsConfig;

  constructor(config?: Partial<VoiceDriveAnalyticsConfig>) {
    // 環境変数 + デフォルト値
    this.config = {
      apiUrl: config?.apiUrl || process.env.VOICEDRIVE_ANALYTICS_API_URL || 'http://localhost:4000',
      apiBasePath: config?.apiBasePath || process.env.VOICEDRIVE_ANALYTICS_API_BASE_PATH || '/api/v1/analytics',
      jwtToken: config?.jwtToken || process.env.VOICEDRIVE_JWT_TOKEN || '',
      hmacSecret: config?.hmacSecret || process.env.VOICEDRIVE_HMAC_SECRET || '',
      timeout: config?.timeout || 30000,  // 30秒
      retryCount: config?.retryCount || parseInt(process.env.VOICEDRIVE_API_RETRY_COUNT || '3'),
      retryInterval: config?.retryInterval || parseInt(process.env.VOICEDRIVE_API_RETRY_INTERVAL_MINUTES || '30') * 60 * 1000,
      debug: config?.debug || process.env.VOICEDRIVE_DEBUG_MODE === 'true',
    };

    if (!this.config.jwtToken) {
      console.warn('[VoiceDriveAnalyticsClient] JWT token not configured');
    }
    if (!this.config.hmacSecret) {
      console.warn('[VoiceDriveAnalyticsClient] HMAC secret not configured');
    }
  }

  /**
   * 集計データ取得
   * GET /api/v1/analytics/aggregated-stats
   *
   * @param request 集計データ取得リクエスト
   * @returns 集計データ
   */
  async getAggregatedStats(
    request: AggregatedStatsRequest
  ): Promise<ApiCallResult<AggregatedStatsResponse>> {
    const startTime = Date.now();

    // バリデーション
    const validationError = this.validateDateRange(request.startDate, request.endDate);
    if (validationError) {
      return {
        success: false,
        error: validationError,
        responseTime: Date.now() - startTime,
      };
    }

    // URLパラメータ構築
    const params = new URLSearchParams({
      startDate: request.startDate,
      endDate: request.endDate,
    });

    const url = `${this.config.apiUrl}${this.config.apiBasePath}/aggregated-stats?${params}`;

    this.debugLog('GET', url, { params: request });

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.jwtToken}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(this.config.timeout),
      });

      const data = await response.json();
      const rateLimit = this.extractRateLimitInfo(response);

      if (!response.ok) {
        return {
          success: false,
          error: data.error || {
            code: 'INTERNAL_ERROR',
            message: `HTTP ${response.status}: ${response.statusText}`,
          },
          rateLimit,
          responseTime: Date.now() - startTime,
        };
      }

      this.debugLog('GET', url, { status: response.status, data });

      return {
        success: true,
        data: data as AggregatedStatsResponse,
        rateLimit,
        responseTime: Date.now() - startTime,
      };

    } catch (error) {
      console.error('[VoiceDriveAnalyticsClient] GET /aggregated-stats error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        responseTime: Date.now() - startTime,
      };
    }
  }

  /**
   * グループ分析データ送信（リトライ付き）
   * POST /api/v1/analytics/group-data
   *
   * @param request グループ分析データ
   * @returns 送信結果
   */
  async sendGroupAnalytics(
    request: GroupAnalyticsRequest
  ): Promise<ApiCallResult<GroupAnalyticsResponse>> {
    let lastError: VoiceDriveApiError | undefined;

    for (let attempt = 1; attempt <= this.config.retryCount; attempt++) {
      console.log(`[VoiceDriveAnalyticsClient] 送信試行 ${attempt}/${this.config.retryCount}`);

      const result = await this.sendGroupAnalyticsOnce(request);

      if (result.success) {
        console.log(`[VoiceDriveAnalyticsClient] 送信成功（試行 ${attempt}回目）`);
        return result;
      }

      lastError = result.error;

      // レート制限エラーの場合、リトライしない
      if (result.error?.code === 'RATE_LIMIT_EXCEEDED' || result.error?.code === 'ANOMALY_DETECTED') {
        console.error('[VoiceDriveAnalyticsClient] レート制限エラー、リトライしません');
        return result;
      }

      // 最終試行でない場合、待機してリトライ
      if (attempt < this.config.retryCount) {
        console.warn(
          `[VoiceDriveAnalyticsClient] 送信失敗、${this.config.retryInterval / 1000 / 60}分後にリトライします`,
          result.error
        );
        await this.sleep(this.config.retryInterval);
      }
    }

    console.error(`[VoiceDriveAnalyticsClient] 送信失敗（${this.config.retryCount}回試行）`);
    return {
      success: false,
      error: lastError || {
        code: 'INTERNAL_ERROR',
        message: '送信に失敗しました（リトライ回数超過）',
      },
      responseTime: 0,
    };
  }

  /**
   * グループ分析データ送信（1回のみ）
   * POST /api/v1/analytics/group-data
   *
   * @param request グループ分析データ
   * @returns 送信結果
   */
  private async sendGroupAnalyticsOnce(
    request: GroupAnalyticsRequest
  ): Promise<ApiCallResult<GroupAnalyticsResponse>> {
    const startTime = Date.now();
    const url = `${this.config.apiUrl}${this.config.apiBasePath}/group-data`;

    // HMAC署名生成
    const timestamp = Math.floor(Date.now() / 1000);
    const body = JSON.stringify(request);
    const signature = this.generateHmacSignature({
      timestamp,
      method: 'POST',
      path: `${this.config.apiBasePath}/group-data`,
      body,
    });

    this.debugLog('POST', url, { request, signature, timestamp });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.jwtToken}`,
          'Content-Type': 'application/json',
          'X-VoiceDrive-Signature': signature,
          'X-VoiceDrive-Timestamp': timestamp.toString(),
        },
        body,
        signal: AbortSignal.timeout(this.config.timeout),
      });

      const data = await response.json();
      const rateLimit = this.extractRateLimitInfo(response);

      if (!response.ok) {
        return {
          success: false,
          error: data.error || {
            code: 'INTERNAL_ERROR',
            message: `HTTP ${response.status}: ${response.statusText}`,
          },
          rateLimit,
          responseTime: Date.now() - startTime,
        };
      }

      this.debugLog('POST', url, { status: response.status, data });

      return {
        success: true,
        data: data as GroupAnalyticsResponse,
        rateLimit,
        responseTime: Date.now() - startTime,
      };

    } catch (error) {
      console.error('[VoiceDriveAnalyticsClient] POST /group-data error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        responseTime: Date.now() - startTime,
      };
    }
  }

  /**
   * HMAC-SHA256署名生成
   *
   * @param payload 署名ペイロード
   * @returns HMAC-SHA256署名（hex形式）
   */
  private generateHmacSignature(payload: HmacSignaturePayload): string {
    // 署名文字列: timestamp:method:path:body
    const signatureString = `${payload.timestamp}:${payload.method}:${payload.path}:${payload.body}`;

    const hmac = crypto.createHmac('sha256', this.config.hmacSecret);
    hmac.update(signatureString);
    return hmac.digest('hex');
  }

  /**
   * 日付範囲バリデーション
   *
   * @param startDate 開始日（YYYY-MM-DD）
   * @param endDate 終了日（YYYY-MM-DD）
   * @returns エラー（問題なければundefined）
   */
  private validateDateRange(startDate: string, endDate: string): VoiceDriveApiError | undefined {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    // 日付フォーマットチェック
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return {
        code: 'INVALID_DATE_FORMAT',
        message: '日付フォーマットが不正です（YYYY-MM-DD形式で指定してください）',
        details: { expected: 'YYYY-MM-DD', received: `${startDate} ~ ${endDate}` },
      };
    }

    // 未来の日付チェック
    if (start > now || end > now) {
      return {
        code: 'FUTURE_DATE_NOT_ALLOWED',
        message: '未来の日付は指定できません',
      };
    }

    // 6ヶ月前チェック
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    if (start < sixMonthsAgo) {
      return {
        code: 'DATE_TOO_OLD',
        message: '6ヶ月以上前の日付は指定できません',
        details: { expected: `>= ${sixMonthsAgo.toISOString().split('T')[0]}` },
      };
    }

    // 期間長チェック（最大90日 = 3ヶ月）
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 90) {
      return {
        code: 'DATE_RANGE_TOO_LONG',
        message: '期間は最大90日（3ヶ月）以内で指定してください',
        details: { expected: '<= 90 days', received: `${diffDays} days` },
      };
    }

    return undefined;
  }

  /**
   * レート制限情報抽出
   *
   * @param response Fetchレスポンス
   * @returns レート制限情報
   */
  private extractRateLimitInfo(response: Response): RateLimitInfo | undefined {
    const limit = response.headers.get('X-RateLimit-Limit');
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const reset = response.headers.get('X-RateLimit-Reset');

    if (limit && remaining && reset) {
      return {
        limit: parseInt(limit),
        remaining: parseInt(remaining),
        reset: parseInt(reset),
      };
    }

    return undefined;
  }

  /**
   * スリープ
   *
   * @param ms ミリ秒
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * デバッグログ
   *
   * @param method HTTPメソッド
   * @param url URL
   * @param data ログデータ
   */
  private debugLog(method: string, url: string, data: any): void {
    if (this.config.debug) {
      console.log(`[VoiceDriveAnalyticsClient] ${method} ${url}`, JSON.stringify(data, null, 2));
    }
  }

  /**
   * 設定取得
   *
   * @returns 現在の設定
   */
  getConfig(): VoiceDriveAnalyticsConfig {
    return { ...this.config };
  }

  /**
   * 設定更新
   *
   * @param config 更新する設定
   */
  updateConfig(config: Partial<VoiceDriveAnalyticsConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * ヘルスチェック
   * 集計APIに対して軽量なリクエストを送信し、接続確認
   *
   * @returns 接続OK: true, NG: false
   */
  async healthCheck(): Promise<boolean> {
    try {
      // 直近7日間のデータを取得（軽量なリクエスト）
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      const result = await this.getAggregatedStats({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      });

      return result.success;
    } catch (error) {
      console.error('[VoiceDriveAnalyticsClient] Health check failed:', error);
      return false;
    }
  }
}

// シングルトンインスタンス（開発環境用）
export const voiceDriveAnalyticsClient = new VoiceDriveAnalyticsClient();
