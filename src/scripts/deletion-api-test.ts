/**
 * VoiceDrive削除完了API接続テストスクリプト
 *
 * 実行方法:
 * npm run test:deletion-api
 */

import dotenv from 'dotenv';

dotenv.config();

const VOICEDRIVE_API_URL = process.env.VOICEDRIVE_API_URL || 'http://localhost:5173';

interface DeletionCompletionResponse {
  success: boolean;
  message: string;
  userId: string;
  completedAt: string;
}

async function testDeletionAPI() {
  console.log('='.repeat(60));
  console.log('VoiceDrive削除完了API接続テスト');
  console.log('='.repeat(60));
  console.log();

  console.log('📋 テスト設定:');
  console.log(`  API URL: ${VOICEDRIVE_API_URL}`);
  console.log(`  エンドポイント: /api/consent/deletion-completed`);
  console.log();

  // テストデータ
  const testUserId = 'test-deletion-user-002';
  const testData = {
    userId: testUserId,
    deletedAt: new Date().toISOString(),
    deletedItemCount: 42
  };

  console.log('📤 送信データ:');
  console.log(JSON.stringify(testData, null, 2));
  console.log();

  try {
    // API呼び出し
    console.log('🔄 API呼び出し中...');
    const apiUrl = `${VOICEDRIVE_API_URL}/api/consent/deletion-completed`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    console.log(`  ステータスコード: ${response.status} ${response.statusText}`);
    console.log();

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API呼び出しエラー:');
      console.error(`  ステータス: ${response.status}`);
      console.error(`  レスポンス: ${errorText}`);
      console.log();
      console.log('='.repeat(60));
      console.log('❌ 削除完了API接続テスト失敗');
      console.log('='.repeat(60));
      process.exit(1);
    }

    // レスポンス解析
    const result: DeletionCompletionResponse = await response.json();

    console.log('✅ API呼び出し成功');
    console.log();
    console.log('📥 レスポンス:');
    console.log(JSON.stringify(result, null, 2));
    console.log();

    // 結果検証
    console.log('🔍 結果検証:');
    const validations = [
      { name: 'success', expected: true, actual: result.success },
      { name: 'userId', expected: testUserId, actual: result.userId },
      { name: 'message', expected: 'あり', actual: result.message ? 'あり' : 'なし' },
      { name: 'completedAt', expected: 'あり', actual: result.completedAt ? 'あり' : 'なし' }
    ];

    let allPassed = true;
    validations.forEach((validation) => {
      const passed = validation.expected === validation.actual;
      const icon = passed ? '✅' : '❌';
      console.log(`  ${icon} ${validation.name}: 期待=${validation.expected}, 実際=${validation.actual}`);
      if (!passed) allPassed = false;
    });
    console.log();

    if (allPassed) {
      console.log('='.repeat(60));
      console.log('✅ VoiceDrive削除完了API接続テスト完了');
      console.log('='.repeat(60));
    } else {
      console.log('='.repeat(60));
      console.log('⚠️ VoiceDrive削除完了API接続テスト完了（一部検証失敗）');
      console.log('='.repeat(60));
    }

  } catch (error) {
    console.error('❌ テスト実行エラー:');
    console.error(error);
    console.log();

    // エラー詳細
    if (error instanceof Error) {
      console.log('エラー詳細:');
      console.log(`  名前: ${error.name}`);
      console.log(`  メッセージ: ${error.message}`);
      if (error.stack) {
        console.log('  スタックトレース:');
        console.log(error.stack);
      }
    }

    console.log();
    console.log('💡 トラブルシューティング:');
    console.log('  1. VoiceDriveサーバーが起動しているか確認してください');
    console.log(`     → ${VOICEDRIVE_API_URL} にアクセス可能か確認`);
    console.log('  2. .env ファイルの VOICEDRIVE_API_URL が正しいか確認してください');
    console.log('  3. VoiceDrive側で削除完了APIが実装されているか確認してください');
    console.log();

    console.log('='.repeat(60));
    console.log('❌ VoiceDrive削除完了API接続テスト失敗');
    console.log('='.repeat(60));
    process.exit(1);
  }
}

// スクリプト実行
testDeletionAPI().catch((error) => {
  console.error('致命的エラー:', error);
  process.exit(1);
});
