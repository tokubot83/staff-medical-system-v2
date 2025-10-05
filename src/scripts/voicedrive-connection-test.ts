/**
 * VoiceDrive DB接続テストスクリプト
 *
 * 実行方法:
 * npm run test:voicedrive-connection
 */

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const VOICEDRIVE_DATABASE_URL = process.env.VOICEDRIVE_DATABASE_URL || 'file:../voicedrive/prisma/dev.db';

async function testVoiceDriveConnection() {
  console.log('='.repeat(60));
  console.log('VoiceDrive DB接続テスト');
  console.log('='.repeat(60));
  console.log();

  console.log('📋 接続情報:');
  console.log(`  DATABASE_URL: ${VOICEDRIVE_DATABASE_URL}`);
  console.log();

  let prisma: PrismaClient | null = null;

  try {
    // VoiceDrive DBへの接続
    console.log('🔌 VoiceDrive DBに接続中...');
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: VOICEDRIVE_DATABASE_URL
        }
      },
      log: ['error', 'warn']
    });

    // 接続確認（DataConsentテーブルのカウント取得）
    console.log('📊 DataConsentテーブルを確認中...');

    const count = await prisma.$queryRaw<Array<{ count: number }>>`
      SELECT COUNT(*) as count FROM DataConsent
    `;

    const totalCount = count[0]?.count || 0;
    console.log(`✅ 接続成功！ DataConsentテーブルのレコード数: ${totalCount}件`);
    console.log();

    // テーブル構造確認（SQLiteの場合）
    if (VOICEDRIVE_DATABASE_URL.includes('file:')) {
      console.log('📋 DataConsentテーブル構造:');
      const tableInfo = await prisma.$queryRaw<Array<any>>`
        PRAGMA table_info(DataConsent)
      `;

      console.log('  カラム一覧:');
      tableInfo.forEach((col: any) => {
        console.log(`    - ${col.name} (${col.type})`);
      });
      console.log();
    }

    // サンプルデータ確認
    console.log('📄 サンプルデータ（最初の3件）:');
    const samples = await prisma.$queryRaw<Array<any>>`
      SELECT * FROM DataConsent LIMIT 3
    `;

    if (samples.length === 0) {
      console.log('  ⚠️ データなし');
    } else {
      samples.forEach((record: any, index: number) => {
        console.log(`  [${index + 1}] userId: ${record.userId}`);
        console.log(`      analyticsConsent: ${record.analyticsConsent}`);
        console.log(`      revokeDate: ${record.revokeDate || 'null'}`);
        console.log(`      dataDeletionRequested: ${record.dataDeletionRequested}`);
        console.log();
      });
    }

    console.log('='.repeat(60));
    console.log('✅ VoiceDrive DB接続テスト完了');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ 接続エラー:');
    console.error(error);
    console.log();
    console.log('='.repeat(60));
    console.log('❌ VoiceDrive DB接続テスト失敗');
    console.log('='.repeat(60));
    process.exit(1);

  } finally {
    if (prisma) {
      await prisma.$disconnect();
      console.log('🔌 DB接続を切断しました');
    }
  }
}

// スクリプト実行
testVoiceDriveConnection().catch((error) => {
  console.error('致命的エラー:', error);
  process.exit(1);
});
