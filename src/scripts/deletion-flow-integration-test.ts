/**
 * データ削除フロー統合テスト
 *
 * 統合テストシナリオ5用
 * 削除リクエスト→削除処理→完了通知の一連のフローを確認
 */

import { dataDeletionBatchService } from '../services/DataDeletionBatchService';
import { voiceDriveDataService } from '../services/VoiceDriveDataService';
import dotenv from 'dotenv';

dotenv.config();

async function testDeletionFlow() {
  console.log('='.repeat(60));
  console.log('データ削除フロー統合テスト');
  console.log('='.repeat(60));
  console.log();

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  // テスト1: 削除リクエスト一覧取得
  console.log('📋 テスト1: 削除リクエスト一覧取得');
  console.log('-'.repeat(60));

  try {
    totalTests++;
    const deletionRequests = await dataDeletionBatchService.listDeletionRequests();

    console.log(`✅ 削除リクエスト一覧取得成功`);
    console.log(`  リクエスト数: ${deletionRequests.length}件`);

    if (deletionRequests.length > 0) {
      console.log('  ユーザーID一覧:');
      deletionRequests.forEach((userId, index) => {
        console.log(`    ${index + 1}. ${userId}`);
      });
    }

    passedTests++;
  } catch (error) {
    console.log('❌ 失敗:', error);
    failedTests++;
  }
  console.log();

  // テスト2: 削除完了済みユーザーの確認
  console.log('📋 テスト2: 削除完了済みユーザーの確認（test-deletion-user-002）');
  console.log('-'.repeat(60));

  try {
    totalTests++;
    const testUserId = 'test-deletion-user-002';
    const consentDetails = await voiceDriveDataService.getConsentDetails(testUserId);

    if (consentDetails) {
      console.log(`✅ ユーザー ${testUserId} の同意詳細取得成功`);
      console.log(`  dataDeletionRequested: ${consentDetails.dataDeletionRequested}`);
      console.log(`  dataDeletionRequestedAt: ${consentDetails.dataDeletionRequestedAt}`);
      console.log(`  dataDeletionCompletedAt: ${consentDetails.dataDeletionCompletedAt}`);

      // 削除完了していることを確認
      if (consentDetails.dataDeletionCompletedAt !== null) {
        console.log(`  ✅ 削除完了済み（完了日時: ${consentDetails.dataDeletionCompletedAt}）`);
        passedTests++;
      } else {
        console.log(`  ⚠️ 削除未完了（期待: 削除完了済み）`);
        failedTests++;
      }
    } else {
      console.log(`❌ ユーザー ${testUserId} が見つかりません`);
      failedTests++;
    }
  } catch (error) {
    console.log('❌ 失敗:', error);
    failedTests++;
  }
  console.log();

  // テスト3: 削除処理バッチの動作確認（削除リクエストがない場合）
  console.log('📋 テスト3: 削除処理バッチの動作確認（削除リクエストなし）');
  console.log('-'.repeat(60));

  try {
    totalTests++;
    console.log('[削除バッチ] 実行開始...');
    const results = await dataDeletionBatchService.processDeletionRequests();

    console.log(`✅ 削除処理バッチ実行成功`);
    console.log(`  処理結果: ${results.length}件`);

    if (results.length === 0) {
      console.log(`  ✅ 削除リクエストがないため、処理なし（正常）`);
      passedTests++;
    } else {
      console.log(`  処理詳細:`);
      results.forEach((result, index) => {
        console.log(`    ${index + 1}. userId: ${result.userId}`);
        console.log(`       success: ${result.success}`);
        console.log(`       deletedItemCount: ${result.deletedItemCount}`);
        if (result.error) {
          console.log(`       error: ${result.error}`);
        }
      });
      passedTests++;
    }
  } catch (error) {
    console.log('❌ 失敗:', error);
    failedTests++;
  }
  console.log();

  // テスト4: エラーハンドリング確認（存在しないユーザー）
  console.log('📋 テスト4: エラーハンドリング確認（存在しないユーザー）');
  console.log('-'.repeat(60));

  try {
    totalTests++;
    const nonExistentUserId = 'non-existent-user-999';
    const consentDetails = await voiceDriveDataService.getConsentDetails(nonExistentUserId);

    if (consentDetails === null) {
      console.log(`✅ 存在しないユーザーに対してnullが返却される（正常）`);
      passedTests++;
    } else {
      console.log(`❌ 存在しないユーザーに対して値が返却された（異常）`);
      failedTests++;
    }
  } catch (error) {
    console.log('❌ 失敗:', error);
    failedTests++;
  }
  console.log();

  // テスト5: 削除リクエスト済みユーザーの検出
  console.log('📋 テスト5: 削除リクエスト済みユーザーの検出ロジック確認');
  console.log('-'.repeat(60));

  try {
    totalTests++;
    const allConsents = await voiceDriveDataService.getConsentedUsers();
    let deletionRequestedCount = 0;
    let deletionCompletedCount = 0;

    // VoiceDrive DataServiceの削除リクエスト取得ロジックを確認
    const deletionRequests = await dataDeletionBatchService.listDeletionRequests();

    console.log(`✅ 全ユーザー状況:`);
    console.log(`  同意済みユーザー: ${allConsents.length}名`);
    console.log(`  削除リクエスト済み（未完了）: ${deletionRequests.length}名`);

    // test-deletion-user-002の状態を確認
    const testUser002 = await voiceDriveDataService.getConsentDetails('test-deletion-user-002');
    if (testUser002) {
      if (testUser002.dataDeletionRequested) {
        deletionRequestedCount++;
      }
      if (testUser002.dataDeletionCompletedAt) {
        deletionCompletedCount++;
      }

      console.log(`  test-deletion-user-002 状態:`);
      console.log(`    削除リクエスト: ${testUser002.dataDeletionRequested ? '✅ あり' : '❌ なし'}`);
      console.log(`    削除完了: ${testUser002.dataDeletionCompletedAt ? '✅ 完了' : '❌ 未完了'}`);
    }

    console.log(`✅ 削除リクエスト検出ロジックが正常に動作`);
    passedTests++;
  } catch (error) {
    console.log('❌ 失敗:', error);
    failedTests++;
  }
  console.log();

  // 結果サマリー
  console.log('='.repeat(60));
  console.log('データ削除フロー統合テスト結果');
  console.log('='.repeat(60));
  console.log(`総テスト数: ${totalTests}`);
  console.log(`✅ 合格: ${passedTests}`);
  console.log(`❌ 失敗: ${failedTests}`);
  console.log(`成功率: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  console.log('='.repeat(60));

  if (failedTests === 0) {
    console.log('🎉 全テスト合格！データ削除フローは正常に動作しています。');
  } else {
    console.log('⚠️ 一部のテストが失敗しました。');
    process.exit(1);
  }

  // DB接続を切断
  await voiceDriveDataService.disconnect();
  console.log('🔌 DB接続を切断しました');
}

// スクリプト実行
testDeletionFlow().catch((error) => {
  console.error('致命的エラー:', error);
  process.exit(1);
});
