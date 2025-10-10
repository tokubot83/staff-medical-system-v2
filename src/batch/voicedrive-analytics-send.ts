/**
 * VoiceDrive Analytics データ送信バッチ処理
 *
 * 実行タイミング: データ取得→分析完了後
 * 処理内容:
 * 1. 分析済みデータを読み込み
 * 2. VoiceDriveへ送信（HMAC署名付き）
 * 3. リトライ機構（最大3回）
 *
 * 実行方法:
 * npx tsx src/batch/voicedrive-analytics-send.ts [data-file-path]
 */

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';
import { VoiceDriveAnalyticsClient } from '../services/VoiceDriveAnalyticsClient';
import { VoiceDriveAnalyticsProcessor } from '../services/VoiceDriveAnalyticsProcessor';
import type {
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
 * 最新のデータファイルを取得
 */
async function getLatestDataFile(): Promise<string | null> {
  try {
    const files = await fs.readdir(DATA_DIR);
    const aggregatedFiles = files
      .filter((f) => f.startsWith('aggregated-stats-') && f.endsWith('.json'))
      .sort()
      .reverse();

    if (aggregatedFiles.length === 0) {
      return null;
    }

    return path.join(DATA_DIR, aggregatedFiles[0]);
  } catch (error) {
    return null;
  }
}

/**
 * データ送信バッチ処理のメイン関数
 */
async function sendAnalyticsData(dataFilePath?: string) {
  log('INFO', '='.repeat(60));
  log('INFO', 'VoiceDrive Analytics データ送信バッチ開始');
  log('INFO', '='.repeat(60));

  const startTime = Date.now();

  try {
    // ディレクトリ作成
    await fs.mkdir(LOG_DIR, { recursive: true });

    // データファイルパス決定
    let filepath = dataFilePath;
    if (!filepath) {
      log('INFO', '最新のデータファイルを検索中...');
      filepath = await getLatestDataFile();
      if (!filepath) {
        throw new Error('送信するデータファイルが見つかりません');
      }
    }

    log('INFO', `データファイル: ${filepath}`);

    // データ読み込み
    const fileContent = await fs.readFile(filepath, 'utf-8');
    const fetchedData = JSON.parse(fileContent);

    if (!fetchedData.response) {
      throw new Error('データファイルの形式が不正です');
    }

    log('INFO', 'データ読み込み完了');

    // クライアント初期化
    log('INFO', 'VoiceDriveAnalyticsClient初期化中...');
    const client = new VoiceDriveAnalyticsClient({
      debug: process.env.VOICEDRIVE_DEBUG_MODE === 'true'
    });

    // プロセッサー初期化
    log('INFO', 'VoiceDriveAnalyticsProcessor初期化中...');
    const processor = new VoiceDriveAnalyticsProcessor({
      debug: process.env.VOICEDRIVE_DEBUG_MODE === 'true'
    });

    // データ分析
    log('INFO', 'データ分析中...');
    const analysisResult = await processor.processAnalytics(fetchedData.response);

    log('INFO', '✅ データ分析完了');
    log('INFO', '分析結果サマリー:', {
      期間: `${analysisResult.period.startDate} 〜 ${analysisResult.period.endDate}`,
      総投稿数: analysisResult.postingTrends.totalPosts,
      感情分析: {
        ポジティブ: analysisResult.sentimentAnalysis?.positive || 0,
        ニュートラル: analysisResult.sentimentAnalysis?.neutral || 0,
        ネガティブ: analysisResult.sentimentAnalysis?.negative || 0,
        平均信頼度: analysisResult.sentimentAnalysis?.averageConfidence || 0
      },
      トップキーワード数: analysisResult.topicAnalysis?.topKeywords.length || 0
    });

    // メタデータ追加
    const sendData: GroupAnalyticsRequest = {
      ...analysisResult,
      metadata: {
        sourceSystem: 'medical-staff-system',
        version: '1.0.0',
        generatedBy: 'voicedrive-analytics-send-batch',
        generatedAt: new Date().toISOString(),
        processingTime: (Date.now() - startTime) / 1000,
        llmModel: 'Llama 3.2 8B Instruct (Mock)' // 実際のLLM統合後に変更
      }
    };

    // データ送信
    log('INFO', 'VoiceDriveへデータ送信中...');
    const sendResult = await client.sendGroupAnalytics(sendData);

    if (!sendResult.success) {
      throw new Error(`データ送信失敗: ${sendResult.error?.message || '不明なエラー'}`);
    }

    log('INFO', '✅ データ送信成功');

    if (sendResult.data) {
      log('INFO', '送信結果:', {
        受信日時: sendResult.data.receivedAt,
        メッセージ: sendResult.data.message
      });
    }

    // レート制限情報
    if (sendResult.rateLimit) {
      log('INFO', 'レート制限情報:', {
        制限値: `${sendResult.rateLimit.limit} リクエスト/時間`,
        残り: `${sendResult.rateLimit.remaining} リクエスト`,
        リセット: new Date(sendResult.rateLimit.reset * 1000).toISOString()
      });
    }

    // 送信ログ保存
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const logFilename = `send-log-${timestamp}.json`;
    const logFilepath = path.join(LOG_DIR, logFilename);

    const logData = {
      sentAt: new Date().toISOString(),
      dataFile: filepath,
      request: sendData,
      response: sendResult.data,
      rateLimit: sendResult.rateLimit,
      processingTime: Date.now() - startTime
    };

    await fs.writeFile(logFilepath, JSON.stringify(logData, null, 2));
    log('INFO', `✅ 送信ログ保存完了: ${logFilepath}`);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    log('INFO', '='.repeat(60));
    log('INFO', `✅ データ送信バッチ完了（処理時間: ${duration}秒）`);
    log('INFO', '='.repeat(60));

    // 正常終了
    process.exit(0);

  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    log('ERROR', '='.repeat(60));
    log('ERROR', `❌ データ送信バッチ失敗（処理時間: ${duration}秒）`);
    log('ERROR', error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    log('ERROR', '='.repeat(60));

    // エラー終了
    process.exit(1);
  }
}

// バッチ実行
if (require.main === module) {
  const dataFilePath = process.argv[2]; // コマンドライン引数からファイルパス取得
  sendAnalyticsData(dataFilePath);
}

export { sendAnalyticsData };
