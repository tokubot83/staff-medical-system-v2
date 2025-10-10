/**
 * VoiceDrive Analytics データ取得バッチ処理
 *
 * 実行タイミング: 毎日 02:00 JST
 * 処理内容:
 * 1. VoiceDriveから過去7日間の集計データを取得
 * 2. K-匿名性チェック（K≥5）
 * 3. データを保存して次の処理（LLM分析）へ
 *
 * 実行方法:
 * node --loader ts-node/esm src/batch/voicedrive-analytics-fetch.ts
 * または
 * npx tsx src/batch/voicedrive-analytics-fetch.ts
 */

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';
import { VoiceDriveAnalyticsClient } from '../services/VoiceDriveAnalyticsClient';
import type { AggregatedStatsRequest } from '../../mcp-shared/interfaces/voicedrive-analytics-api.interface';

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
 * データ取得バッチ処理のメイン関数
 */
async function fetchAnalyticsData() {
  log('INFO', '='.repeat(60));
  log('INFO', 'VoiceDrive Analytics データ取得バッチ開始');
  log('INFO', '='.repeat(60));

  const startTime = Date.now();

  try {
    // ディレクトリ作成
    await fs.mkdir(LOG_DIR, { recursive: true });
    await fs.mkdir(DATA_DIR, { recursive: true });

    // クライアント初期化
    log('INFO', 'VoiceDriveAnalyticsClient初期化中...');
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
    const result = await client.getAggregatedStats(request);

    if (!result.success) {
      throw new Error(`データ取得失敗: ${result.error?.message || '不明なエラー'}`);
    }

    log('INFO', '✅ 集計データ取得成功');

    // データ検証
    if (!result.data) {
      throw new Error('データが空です');
    }

    const { stats, privacyMetadata, period } = result.data;

    // K-匿名性チェック
    log('INFO', 'K-匿名性チェック中...');
    const kAnonymityCheck = checkKAnonymity(
      privacyMetadata?.consentedUsers || 0,
      5
    );

    if (!kAnonymityCheck.compliant) {
      log('ERROR', kAnonymityCheck.message);
      throw new Error('K-匿名性要件を満たしていません');
    }

    log('INFO', '✅ ' + kAnonymityCheck.message);

    // データサマリー表示
    log('INFO', 'データサマリー:', {
      期間: `${period?.startDate} 〜 ${period?.endDate}`,
      総投稿数: stats?.totalPosts || 0,
      総ユーザー数: stats?.totalUsers || 0,
      参加率: `${stats?.participationRate || 0}%`,
      同意済みユーザー数: privacyMetadata?.consentedUsers || 0,
      'K-匿名性準拠': privacyMetadata?.kAnonymityCompliant || false
    });

    // カテゴリ別内訳
    if (stats?.byCategory && stats.byCategory.length > 0) {
      log('INFO', 'カテゴリ別内訳:');
      stats.byCategory.forEach((cat: any) => {
        console.log(`  - ${cat.category}: ${cat.count}件 (${cat.percentage}%)`);
      });
    }

    // 部署別内訳
    if (stats?.byDepartment && stats.byDepartment.length > 0) {
      log('INFO', '部署別内訳:');
      stats.byDepartment.forEach((dept: any) => {
        console.log(`  - ${dept.department}: ${dept.postCount}件（参加率${dept.participationRate}%）`);
      });
    }

    // データ保存
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `aggregated-stats-${timestamp}.json`;
    const filepath = path.join(DATA_DIR, filename);

    const saveData = {
      fetchedAt: new Date().toISOString(),
      request,
      response: result.data,
      rateLimit: result.rateLimit,
      processingTime: Date.now() - startTime
    };

    await fs.writeFile(filepath, JSON.stringify(saveData, null, 2));
    log('INFO', `✅ データ保存完了: ${filepath}`);

    // レート制限情報
    if (result.rateLimit) {
      log('INFO', 'レート制限情報:', {
        制限値: `${result.rateLimit.limit} リクエスト/時間`,
        残り: `${result.rateLimit.remaining} リクエスト`,
        リセット: new Date(result.rateLimit.reset * 1000).toISOString()
      });
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    log('INFO', '='.repeat(60));
    log('INFO', `✅ データ取得バッチ完了（処理時間: ${duration}秒）`);
    log('INFO', '='.repeat(60));

    // 正常終了
    process.exit(0);

  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    log('ERROR', '='.repeat(60));
    log('ERROR', `❌ データ取得バッチ失敗（処理時間: ${duration}秒）`);
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
  fetchAnalyticsData();
}

export { fetchAnalyticsData };
