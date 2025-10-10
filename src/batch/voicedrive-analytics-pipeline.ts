/**
 * VoiceDrive Analytics 統合パイプライン
 *
 * 実行タイミング: 毎日 02:00 JST（自動実行）
 * 処理フロー:
 * 1. VoiceDriveから集計データ取得
 * 2. LLM分析実施（感情分析 + トピック分析）
 * 3. VoiceDriveへ分析結果送信
 *
 * 実行方法:
 * npx tsx src/batch/voicedrive-analytics-pipeline.ts
 */

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';
import { VoiceDriveAnalyticsClient } from '../services/VoiceDriveAnalyticsClient';
import { VoiceDriveAnalyticsProcessor } from '../services/VoiceDriveAnalyticsProcessor';
import { sendSuccessNotification, sendErrorNotification } from '../utils/voicedrive-notifier';
import type {
  AggregatedStatsRequest,
  GroupAnalyticsRequest
} from '../../mcp-shared/interfaces/voicedrive-analytics-api.interface';

// 環境変数読み込み
const envPath = process.env.NODE_ENV === 'production'
  ? path.resolve(process.cwd(), '.env.production')
  : path.resolve(process.cwd(), '.env.voicedrive.test');

dotenv.config({ path: envPath });

// ログディレクトリ
const LOG_DIR = path.resolve(process.cwd(), 'logs/analytics');
const DATA_DIR = path.resolve(process.cwd(), 'data/analytics');

/**
 * ログ出力
 */
function log(level: 'INFO' | 'WARN' | 'ERROR', message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}`;
  console.log(logMessage);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
}

/**
 * K-匿名性チェック
 */
function checkKAnonymity(consentedUsers: number, minimumK: number = 5): {
  compliant: boolean;
  message: string;
} {
  if (consentedUsers < minimumK) {
    return {
      compliant: false,
      message: `K-匿名性違反: 同意済みユーザー数 ${consentedUsers} < 最小値 ${minimumK}`
    };
  }
  return {
    compliant: true,
    message: `K-匿名性準拠: 同意済みユーザー数 ${consentedUsers} ≥ 最小値 ${minimumK}`
  };
}

/**
 * 統合パイプライン実行
 */
async function runPipeline() {
  log('INFO', '='.repeat(80));
  log('INFO', 'VoiceDrive Analytics 統合パイプライン開始');
  log('INFO', '='.repeat(80));

  const pipelineStartTime = Date.now();

  try {
    // ディレクトリ作成
    await fs.mkdir(LOG_DIR, { recursive: true });
    await fs.mkdir(DATA_DIR, { recursive: true });

    // ==============================================
    // Step 1: データ取得
    // ==============================================
    log('INFO', '\n' + '='.repeat(80));
    log('INFO', 'Step 1: VoiceDriveからデータ取得');
    log('INFO', '='.repeat(80));

    const fetchStartTime = Date.now();

    // クライアント初期化
    const client = new VoiceDriveAnalyticsClient({
      debug: process.env.VOICEDRIVE_DEBUG_MODE === 'true'
    });

    // ヘルスチェック
    log('INFO', 'VoiceDriveサーバーへの接続確認中...');
    const isHealthy = await client.healthCheck();
    if (!isHealthy) {
      throw new Error('VoiceDriveサーバーに接続できません');
    }
    log('INFO', '✅ VoiceDriveサーバー接続成功');

    // 日付範囲計算（過去7日間）
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const request: AggregatedStatsRequest = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };

    log('INFO', '集計データ取得中...', {
      startDate: request.startDate,
      endDate: request.endDate,
      days: 7
    });

    // データ取得
    const fetchResult = await client.getAggregatedStats(request);

    if (!fetchResult.success || !fetchResult.data) {
      throw new Error(`データ取得失敗: ${fetchResult.error?.message || '不明なエラー'}`);
    }

    const aggregatedData = fetchResult.data;

    log('INFO', '✅ 集計データ取得成功', {
      総投稿数: aggregatedData.stats?.totalPosts || 0,
      総ユーザー数: aggregatedData.stats?.totalUsers || 0,
      参加率: `${aggregatedData.stats?.participationRate || 0}%`,
      処理時間: `${((Date.now() - fetchStartTime) / 1000).toFixed(2)}秒`
    });

    // K-匿名性チェック
    log('INFO', 'K-匿名性チェック中...');
    const kAnonymityCheck = checkKAnonymity(
      aggregatedData.privacyMetadata?.consentedUsers || 0,
      5
    );

    if (!kAnonymityCheck.compliant) {
      log('ERROR', kAnonymityCheck.message);
      throw new Error('K-匿名性要件を満たしていません');
    }

    log('INFO', '✅ ' + kAnonymityCheck.message);

    // ==============================================
    // Step 2: データ分析
    // ==============================================
    log('INFO', '\n' + '='.repeat(80));
    log('INFO', 'Step 2: LLM分析実施');
    log('INFO', '='.repeat(80));

    const analysisStartTime = Date.now();

    // プロセッサー初期化
    const processor = new VoiceDriveAnalyticsProcessor({
      debug: process.env.VOICEDRIVE_DEBUG_MODE === 'true'
    });

    // データ分析
    const analysisResult = await processor.processAnalytics(aggregatedData);

    log('INFO', '✅ データ分析完了', {
      感情分析: {
        ポジティブ: analysisResult.sentimentAnalysis?.positive || 0,
        ニュートラル: analysisResult.sentimentAnalysis?.neutral || 0,
        ネガティブ: analysisResult.sentimentAnalysis?.negative || 0,
        平均信頼度: analysisResult.sentimentAnalysis?.averageConfidence || 0
      },
      トピック分析: {
        キーワード数: analysisResult.topicAnalysis?.topKeywords.length || 0,
        新出トピック数: analysisResult.topicAnalysis?.emergingTopics.length || 0
      },
      処理時間: `${((Date.now() - analysisStartTime) / 1000).toFixed(2)}秒`
    });

    // ==============================================
    // Step 3: データ送信
    // ==============================================
    log('INFO', '\n' + '='.repeat(80));
    log('INFO', 'Step 3: VoiceDriveへ分析結果送信');
    log('INFO', '='.repeat(80));

    const sendStartTime = Date.now();

    // メタデータ追加
    const sendData: GroupAnalyticsRequest = {
      ...analysisResult,
      metadata: {
        sourceSystem: 'medical-staff-system',
        version: '1.0.0',
        generatedBy: 'voicedrive-analytics-pipeline',
        generatedAt: new Date().toISOString(),
        processingTime: (Date.now() - pipelineStartTime) / 1000,
        llmModel: 'Llama 3.2 8B Instruct (Mock)' // 実際のLLM統合後に変更
      }
    };

    // データ送信
    const sendResult = await client.sendGroupAnalytics(sendData);

    if (!sendResult.success) {
      throw new Error(`データ送信失敗: ${sendResult.error?.message || '不明なエラー'}`);
    }

    log('INFO', '✅ データ送信成功', {
      受信日時: sendResult.data?.receivedAt || '',
      メッセージ: sendResult.data?.message || '',
      処理時間: `${((Date.now() - sendStartTime) / 1000).toFixed(2)}秒`
    });

    // レート制限情報
    if (sendResult.rateLimit) {
      log('INFO', 'レート制限情報:', {
        制限値: `${sendResult.rateLimit.limit} リクエスト/時間`,
        残り: `${sendResult.rateLimit.remaining} リクエスト`,
        リセット: new Date(sendResult.rateLimit.reset * 1000).toISOString()
      });
    }

    // ==============================================
    // パイプライン完了
    // ==============================================
    const totalDuration = ((Date.now() - pipelineStartTime) / 1000).toFixed(2);

    log('INFO', '\n' + '='.repeat(80));
    log('INFO', `✅ VoiceDrive Analytics 統合パイプライン完了（総処理時間: ${totalDuration}秒）`);
    log('INFO', '='.repeat(80));

    log('INFO', '\n処理サマリー:');
    log('INFO', `  - 期間: ${request.startDate} 〜 ${request.endDate}`);
    log('INFO', `  - 総投稿数: ${aggregatedData.stats?.totalPosts || 0}件`);
    log('INFO', `  - ポジティブ: ${analysisResult.sentimentAnalysis?.positive || 0}件`);
    log('INFO', `  - ニュートラル: ${analysisResult.sentimentAnalysis?.neutral || 0}件`);
    log('INFO', `  - ネガティブ: ${analysisResult.sentimentAnalysis?.negative || 0}件`);
    log('INFO', `  - トップキーワード: ${(analysisResult.topicAnalysis?.topKeywords || []).map(k => k.keyword).slice(0, 3).join(', ')}`);
    log('INFO', `  - 総処理時間: ${totalDuration}秒\n`);

    // パイプラインログ保存
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const logFilename = `pipeline-log-${timestamp}.json`;
    const logFilepath = path.join(LOG_DIR, logFilename);

    const logData = {
      executedAt: new Date().toISOString(),
      pipeline: {
        fetchDuration: (Date.now() - fetchStartTime) / 1000,
        analysisDuration: (Date.now() - analysisStartTime) / 1000,
        sendDuration: (Date.now() - sendStartTime) / 1000,
        totalDuration: (Date.now() - pipelineStartTime) / 1000
      },
      request,
      aggregatedData,
      analysisResult,
      sendResult: sendResult.data,
      rateLimit: sendResult.rateLimit
    };

    await fs.writeFile(logFilepath, JSON.stringify(logData, null, 2));
    log('INFO', `✅ パイプラインログ保存完了: ${logFilepath}\n`);

    // ==============================================
    // VoiceDrive通知送信（アカウントレベル99）
    // ==============================================
    log('INFO', 'VoiceDriveアカウントレベル99へ成功通知を送信中...');

    const topKeywords = (analysisResult.topicAnalysis?.topKeywords || [])
      .slice(0, 3)
      .map(k => k.keyword)
      .join(', ');

    await sendSuccessNotification(
      '✅ 職員カルテ分析データ送信完了',
      `期間: ${request.startDate} 〜 ${request.endDate}\n総投稿数: ${aggregatedData.stats?.totalPosts || 0}件`,
      {
        period: {
          startDate: request.startDate,
          endDate: request.endDate
        },
        summary: {
          totalPosts: aggregatedData.stats?.totalPosts || 0,
          totalUsers: aggregatedData.stats?.totalUsers || 0,
          participationRate: `${aggregatedData.stats?.participationRate || 0}%`
        },
        sentiment: {
          positive: analysisResult.sentimentAnalysis?.positive || 0,
          neutral: analysisResult.sentimentAnalysis?.neutral || 0,
          negative: analysisResult.sentimentAnalysis?.negative || 0,
          confidence: analysisResult.sentimentAnalysis?.averageConfidence || 0
        },
        topics: {
          topKeywords,
          emergingTopicsCount: analysisResult.topicAnalysis?.emergingTopics.length || 0
        },
        performance: {
          processingTime: `${totalDuration}秒`,
          rateLimit: sendResult.rateLimit ? {
            remaining: sendResult.rateLimit.remaining,
            limit: sendResult.rateLimit.limit
          } : null
        }
      }
    );

    log('INFO', '✅ VoiceDrive通知送信完了\n');

    // 正常終了
    process.exit(0);

  } catch (error) {
    const duration = ((Date.now() - pipelineStartTime) / 1000).toFixed(2);
    log('ERROR', '\n' + '='.repeat(80));
    log('ERROR', `❌ VoiceDrive Analytics 統合パイプライン失敗（処理時間: ${duration}秒）`);
    log('ERROR', error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    log('ERROR', '='.repeat(80) + '\n');

    // ==============================================
    // VoiceDrive通知送信（エラー通知）
    // ==============================================
    log('ERROR', 'VoiceDriveアカウントレベル99へエラー通知を送信中...');

    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error && error.stack ? error.stack : undefined;

    await sendErrorNotification(
      '❌ 職員カルテ分析データ送信失敗',
      `エラーが発生しました。至急ご対応ください。\nエラー内容: ${errorMessage}`,
      {
        error: {
          message: errorMessage,
          stack: errorStack,
          timestamp: new Date().toISOString()
        },
        performance: {
          processingTime: `${duration}秒`,
          failedAt: new Date().toISOString()
        },
        actionRequired: '管理者による対応が必要です。ログファイルを確認してください。'
      }
    );

    log('ERROR', '✅ VoiceDriveエラー通知送信完了\n');

    // エラー終了
    process.exit(1);
  }
}

// パイプライン実行
if (require.main === module) {
  runPipeline();
}

export { runPipeline };
