/**
 * VoiceDrive Analytics API インターフェース
 * 職員カルテシステム ⇔ VoiceDrive 間の集団分析データ通信用
 *
 * 参照:
 * - mcp-shared/docs/Response_To_VoiceDrive_Confirmation_Items_20251007.md
 * - mcp-shared/docs/Meeting_Minutes_20251009.md
 * - mcp-shared/docs/Reply_To_VoiceDrive_Voice_Analytics_API_Inquiry_20251007.md
 *
 * Version: 1.0.0
 * Created: 2025-10-09
 */

// =====================================
// GET /api/v1/analytics/aggregated-stats
// 職員カルテ → VoiceDrive（集計データ取得）
// =====================================

/**
 * 集計データ取得リクエスト（クエリパラメータ）
 */
export interface AggregatedStatsRequest {
  startDate: string;  // YYYY-MM-DD形式（必須）
  endDate: string;    // YYYY-MM-DD形式（必須）
}

/**
 * 集計データ取得レスポンス
 */
export interface AggregatedStatsResponse {
  success: boolean;
  data?: {
    period: {
      startDate: string;  // YYYY-MM-DD
      endDate: string;    // YYYY-MM-DD
    };

    // 投稿トレンド
    postingTrends: {
      totalPosts: number;           // 総投稿数
      totalUsers: number;           // 総ユーザー数
      totalEligibleUsers: number;   // 同意済みユーザー数
      participationRate: number;    // 参加率（%）
      dailyAveragePosts: number;    // 1日あたり平均投稿数
    };

    // 投票・コメント統計
    engagement: {
      totalVotes: number;           // 総投票数
      totalComments: number;        // 総コメント数
      averageVotesPerPost: number;  // 投稿あたり平均投票数
      averageCommentsPerPost: number; // 投稿あたり平均コメント数
    };

    // 部門別統計
    byDepartment: Array<{
      department: string;           // 部門名
      postCount: number;            // 投稿数
      userCount: number;            // ユーザー数
      participationRate: number;    // 参加率（%）
    }>;

    // プライバシーメタデータ
    privacyMetadata: {
      totalConsentedUsers: number;  // 同意済みユーザー総数
      minimumGroupSize: number;     // K-匿名性最小サイズ（K=5）
      kAnonymityCompliant: boolean; // K-匿名性準拠フラグ
    };

    // 投稿内容サンプル（匿名化済み、トップ10）
    topPosts?: Array<{
      id: string;                   // 投稿ID（匿名化済み）
      content: string;              // 投稿内容（個人情報削除済み）
      voteCount: number;            // 投票数
      commentCount: number;         // コメント数
      createdAt: string;            // 作成日時（ISO 8601）
    }>;
  };
  message?: string;
  error?: VoiceDriveApiError;
}

// =====================================
// POST /api/v1/analytics/group-data
// 職員カルテ → VoiceDrive（分析データ送信）
// =====================================

/**
 * グループ分析データ送信リクエスト
 */
export interface GroupAnalyticsRequest {
  // 分析日
  analysisDate: string;  // YYYY-MM-DD形式

  // 期間
  period: {
    startDate: string;   // YYYY-MM-DD
    endDate: string;     // YYYY-MM-DD
  };

  // 投稿トレンド（基本統計）
  postingTrends: {
    totalPosts: number;
    totalUsers: number;
    totalEligibleUsers: number;
    participationRate: number;
  };

  // 感情分析（オプション）
  sentimentAnalysis?: {
    positive: number;       // ポジティブ投稿数
    neutral: number;        // 中立投稿数
    negative: number;       // ネガティブ投稿数
    averageConfidence: number; // 平均信頼度（0.0-1.0）
    distribution: {
      byDepartment: Array<{
        department: string;
        positive: number;
        neutral: number;
        negative: number;
      }>;
    };
  };

  // トピック分析（オプション）
  topicAnalysis?: {
    // トップキーワード（TOP 20）
    topKeywords: Array<{
      keyword: string;      // キーワード
      count: number;        // 出現回数
      category: 'work' | 'environment' | 'welfare' | 'education' | 'communication' | 'other';
      tfidfScore: number;   // TF-IDFスコア
    }>;

    // 新興トピック（TOP 10）
    emergingTopics: Array<{
      topic: string;        // トピック
      growthRate: number;   // 増加率（%）
      firstSeenDate: string; // 初出日（YYYY-MM-DD）
      recentCount: number;  // 直近7日間の出現回数
      previousCount: number; // その前7日間の出現回数
    }>;

    // 部門別トピック（TOP 3 per 部門）
    byDepartment: Array<{
      department: string;
      topTopics: string[];  // トップ3トピック
    }>;
  };

  // プライバシーメタデータ
  privacyMetadata: {
    totalConsentedUsers: number;
    minimumGroupSize: number;  // K=5
    kAnonymityCompliant: boolean;
  };

  // メタデータ
  metadata: {
    sourceSystem: 'medical-staff-system';  // 固定値
    version: string;                       // バージョン（例: "1.0.0"）
    generatedBy: string;                   // 生成者ID
    generatedAt: string;                   // 生成日時（ISO 8601）
    processingTime: number;                // 処理時間（秒）
    llmModel?: string;                     // 使用LLMモデル（例: "Llama 3.2 8B"）
  };
}

/**
 * グループ分析データ送信レスポンス
 */
export interface GroupAnalyticsResponse {
  success: boolean;
  data?: {
    id: string;                 // VoiceDrive側の受信ID
    receivedAt: string;         // 受信日時（ISO 8601）
    status: 'processed' | 'pending' | 'failed';
    validationResult: {
      kAnonymityCheck: boolean;
      dataIntegrityCheck: boolean;
      signatureVerified: boolean;
    };
  };
  message?: string;
  error?: VoiceDriveApiError;
}

// =====================================
// エラーレスポンス
// =====================================

/**
 * VoiceDrive APIエラー
 */
export interface VoiceDriveApiError {
  code: VoiceDriveErrorCode;
  message: string;
  details?: {
    field?: string;
    expected?: string;
    received?: string;
    additionalInfo?: string;
  };
}

/**
 * VoiceDrive APIエラーコード
 */
export type VoiceDriveErrorCode =
  // 認証エラー
  | 'UNAUTHORIZED'              // 401: JWT認証失敗
  | 'FORBIDDEN'                 // 403: IPホワイトリスト外
  | 'INVALID_SIGNATURE'         // 403: HMAC署名検証失敗

  // バリデーションエラー
  | 'VALIDATION_ERROR'          // 400: リクエストフォーマットエラー
  | 'MISSING_REQUIRED_FIELD'    // 400: 必須フィールド欠落
  | 'INVALID_DATE_FORMAT'       // 400: 日付フォーマット不正
  | 'DATE_TOO_OLD'              // 400: 6ヶ月以上前の日付
  | 'DATE_RANGE_TOO_LONG'       // 400: 期間が3ヶ月を超える
  | 'FUTURE_DATE_NOT_ALLOWED'   // 400: 未来の日付は不可

  // K-匿名性エラー
  | 'K_ANONYMITY_VIOLATION'     // 400: K-匿名性要件違反（K<5）

  // レート制限エラー
  | 'RATE_LIMIT_EXCEEDED'       // 429: レート制限超過
  | 'ANOMALY_DETECTED'          // 429: 異常アクセス検知

  // サーバーエラー
  | 'INTERNAL_ERROR'            // 500: VoiceDrive側の内部エラー
  | 'DATABASE_ERROR'            // 500: DB接続エラー
  | 'SERVICE_UNAVAILABLE';      // 503: サービス一時停止

// =====================================
// HMAC署名
// =====================================

/**
 * HMAC署名ヘッダー
 */
export interface HmacSignatureHeaders {
  'X-VoiceDrive-Signature': string;     // HMAC-SHA256署名
  'X-VoiceDrive-Timestamp': string;     // Unix timestamp（秒）
}

/**
 * HMAC署名生成用ペイロード
 */
export interface HmacSignaturePayload {
  timestamp: number;        // Unix timestamp（秒）
  method: 'POST';          // HTTPメソッド
  path: string;            // APIパス（例: "/api/v1/analytics/group-data"）
  body: string;            // JSONリクエストボディ（文字列）
}

// =====================================
// ヘルパー型
// =====================================

/**
 * VoiceDrive Analytics API設定
 */
export interface VoiceDriveAnalyticsConfig {
  // APIエンドポイント
  apiUrl: string;                      // 例: "http://localhost:4000"
  apiBasePath: string;                 // 例: "/api/v1/analytics"

  // 認証
  jwtToken: string;                    // JWT Bearer token
  hmacSecret: string;                  // HMAC共有シークレット

  // タイムアウト設定
  timeout: number;                     // タイムアウト（ミリ秒、デフォルト: 30000）

  // リトライ設定
  retryCount: number;                  // リトライ回数（デフォルト: 3）
  retryInterval: number;               // リトライ間隔（ミリ秒、デフォルト: 1800000 = 30分）

  // デバッグ
  debug: boolean;                      // デバッグログ有効化
}

/**
 * レート制限情報
 */
export interface RateLimitInfo {
  limit: number;           // 制限値（リクエスト数/時間）
  remaining: number;       // 残りリクエスト数
  reset: number;           // リセット時刻（Unix timestamp）
}

/**
 * API呼び出し結果
 */
export interface ApiCallResult<T> {
  success: boolean;
  data?: T;
  error?: VoiceDriveApiError;
  rateLimit?: RateLimitInfo;
  responseTime: number;    // レスポンス時間（ミリ秒）
}

// =====================================
// K-匿名性チェック
// =====================================

/**
 * K-匿名性チェック結果
 */
export interface KAnonymityCheckResult {
  passed: boolean;
  userCount: number;
  minimumRequired: number;  // K=5
  message?: string;
}
