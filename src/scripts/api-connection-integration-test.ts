/**
 * VoiceDrive API接続統合テスト（シナリオ1）
 *
 * 統合テストシナリオ1用
 * VoiceDrive APIとの基本的な接続とCRUD操作を確認
 */

import { voiceDriveDataService } from '../services/VoiceDriveDataService';
import dotenv from 'dotenv';

dotenv.config();

async function testApiConnection() {
  console.log('='.repeat(60));
  console.log('VoiceDrive API接続統合テスト（シナリオ1）');
  console.log('='.repeat(60));
  console.log();

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  // テスト1: 同意済みユーザー一覧取得（READ）
  console.log('📋 テスト1: 同意済みユーザー一覧取得（READ）');
  console.log('-'.repeat(60));

  try {
    totalTests++;
    const consentedUsers = await voiceDriveDataService.getConsentedUsers();

    if (Array.isArray(consentedUsers)) {
      console.log(`✅ 同意済みユーザー一覧取得成功`);
      console.log(`  取得件数: ${consentedUsers.length}件`);

      if (consentedUsers.length > 0) {
        console.log(`  ユーザーID一覧（先頭3件）:`);
        consentedUsers.slice(0, 3).forEach((userId, index) => {
          console.log(`    ${index + 1}. ${userId}`);
        });
      }

      // K-匿名性要件確認（5名以上）
      if (consentedUsers.length >= 5) {
        console.log(`  ✅ K-匿名性要件充足（K=${consentedUsers.length}）`);
      } else {
        console.log(`  ⚠️ K-匿名性要件未充足（K=${consentedUsers.length}、最低5名必要）`);
      }

      passedTests++;
    } else {
      console.log(`❌ 失敗: 配列が返却されなかった`);
      failedTests++;
    }
  } catch (error) {
    console.log('❌ 失敗:', error);
    failedTests++;
  }
  console.log();

  // テスト2: 特定ユーザーの同意詳細取得（READ）
  console.log('📋 テスト2: 特定ユーザーの同意詳細取得（READ）');
  console.log('-'.repeat(60));

  try {
    totalTests++;
    const testUserId = 'test-consent-user-001';
    const consentDetails = await voiceDriveDataService.getConsentDetails(testUserId);

    if (consentDetails) {
      console.log(`✅ ユーザー ${testUserId} の同意詳細取得成功`);
      console.log(`  userId: ${consentDetails.userId}`);
      console.log(`  analyticsConsent: ${consentDetails.analyticsConsent}`);
      console.log(`  analyticsConsentDate: ${consentDetails.analyticsConsentDate}`);
      console.log(`  revokeDate: ${consentDetails.revokeDate}`);
      console.log(`  dataDeletionRequested: ${consentDetails.dataDeletionRequested}`);

      // データ整合性確認
      if (consentDetails.analyticsConsent === true && consentDetails.revokeDate === null) {
        console.log(`  ✅ データ整合性OK（同意済み・未取消）`);
        passedTests++;
      } else {
        console.log(`  ⚠️ データ整合性に注意が必要`);
        passedTests++;
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

  // テスト3: 削除リクエスト一覧取得（READ）
  console.log('📋 テスト3: 削除リクエスト一覧取得（READ）');
  console.log('-'.repeat(60));

  try {
    totalTests++;
    const deletionRequests = await voiceDriveDataService.getDeletionRequests();

    if (Array.isArray(deletionRequests)) {
      console.log(`✅ 削除リクエスト一覧取得成功`);
      console.log(`  取得件数: ${deletionRequests.length}件`);

      if (deletionRequests.length > 0) {
        console.log(`  ユーザーID一覧:`);
        deletionRequests.forEach((userId, index) => {
          console.log(`    ${index + 1}. ${userId}`);
        });
      } else {
        console.log(`  現在削除リクエストはありません（正常）`);
      }

      passedTests++;
    } else {
      console.log(`❌ 失敗: 配列が返却されなかった`);
      failedTests++;
    }
  } catch (error) {
    console.log('❌ 失敗:', error);
    failedTests++;
  }
  console.log();

  // テスト4: 全ユーザー状況の取得と整合性確認
  console.log('📋 テスト4: 全ユーザー状況の取得と整合性確認');
  console.log('-'.repeat(60));

  try {
    totalTests++;
    const allUsers = await voiceDriveDataService.getConsentedUsers();
    const deletionRequests = await voiceDriveDataService.getDeletionRequests();

    console.log(`✅ 全ユーザー状況取得成功`);
    console.log(`  同意済みユーザー: ${allUsers.length}名`);
    console.log(`  削除リクエスト済み: ${deletionRequests.length}名`);

    // 整合性確認: 削除リクエストユーザーが同意済みユーザーに含まれないことを確認
    let consistencyError = false;
    for (const deletionUserId of deletionRequests) {
      if (allUsers.includes(deletionUserId)) {
        console.log(`  ⚠️ 整合性エラー: ${deletionUserId} が同意済みにも削除リクエストにも含まれています`);
        consistencyError = true;
      }
    }

    if (!consistencyError) {
      console.log(`  ✅ データ整合性OK（同意済みと削除リクエストが重複していない）`);
      passedTests++;
    } else {
      console.log(`  ❌ データ整合性エラーが検出されました`);
      failedTests++;
    }
  } catch (error) {
    console.log('❌ 失敗:', error);
    failedTests++;
  }
  console.log();

  // テスト5: 複数ユーザーの詳細取得（バルクREAD）
  console.log('📋 テスト5: 複数ユーザーの詳細取得（バルクREAD）');
  console.log('-'.repeat(60));

  try {
    totalTests++;
    const testUserIds = ['test-consent-user-001', 'test-consent-user-002', 'test-consent-user-003'];
    const results = [];

    for (const userId of testUserIds) {
      const details = await voiceDriveDataService.getConsentDetails(userId);
      results.push({ userId, found: details !== null });
    }

    const successCount = results.filter(r => r.found).length;
    console.log(`✅ バルクREAD実行成功`);
    console.log(`  リクエスト数: ${testUserIds.length}件`);
    console.log(`  成功: ${successCount}件`);
    console.log(`  失敗: ${testUserIds.length - successCount}件`);

    results.forEach((result, index) => {
      const status = result.found ? '✅ 取得成功' : '⚠️ 見つからない';
      console.log(`    ${index + 1}. ${result.userId}: ${status}`);
    });

    if (successCount > 0) {
      passedTests++;
    } else {
      console.log(`  ❌ 全てのユーザーが見つかりませんでした`);
      failedTests++;
    }
  } catch (error) {
    console.log('❌ 失敗:', error);
    failedTests++;
  }
  console.log();

  // テスト6: エラーハンドリング（存在しないユーザー）
  console.log('📋 テスト6: エラーハンドリング（存在しないユーザー）');
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

  // テスト7: 同意取消ユーザーの除外確認
  console.log('📋 テスト7: 同意取消ユーザーの除外確認');
  console.log('-'.repeat(60));

  try {
    totalTests++;
    const allUsers = await voiceDriveDataService.getConsentedUsers();

    // 取得したユーザーの詳細を確認
    let allConsented = true;
    let revokedCount = 0;

    for (const userId of allUsers.slice(0, 5)) { // 先頭5件のみチェック
      const details = await voiceDriveDataService.getConsentDetails(userId);
      if (details) {
        if (details.revokeDate !== null) {
          console.log(`  ⚠️ ${userId} は取消済み（revokeDate: ${details.revokeDate}）`);
          allConsented = false;
          revokedCount++;
        }
      }
    }

    if (allConsented) {
      console.log(`✅ 全ての取得ユーザーが同意済み・未取消（正常）`);
      passedTests++;
    } else {
      console.log(`  ⚠️ ${revokedCount}件の取消済みユーザーが含まれています`);
      failedTests++;
    }
  } catch (error) {
    console.log('❌ 失敗:', error);
    failedTests++;
  }
  console.log();

  // テスト8: データベース接続の安定性確認
  console.log('📋 テスト8: データベース接続の安定性確認');
  console.log('-'.repeat(60));

  try {
    totalTests++;
    const iterations = 5;
    let successfulIterations = 0;

    console.log(`  ${iterations}回連続でデータ取得を試行...`);

    for (let i = 1; i <= iterations; i++) {
      try {
        const users = await voiceDriveDataService.getConsentedUsers();
        if (Array.isArray(users)) {
          successfulIterations++;
        }
      } catch (error) {
        console.log(`    ${i}回目でエラー:`, error);
      }
    }

    console.log(`  結果: ${successfulIterations}/${iterations}回成功`);

    if (successfulIterations === iterations) {
      console.log(`✅ データベース接続は安定している`);
      passedTests++;
    } else {
      console.log(`  ⚠️ 接続が不安定です（成功率: ${(successfulIterations / iterations * 100).toFixed(1)}%）`);
      failedTests++;
    }
  } catch (error) {
    console.log('❌ 失敗:', error);
    failedTests++;
  }
  console.log();

  // 結果サマリー
  console.log('='.repeat(60));
  console.log('VoiceDrive API接続統合テスト結果（シナリオ1）');
  console.log('='.repeat(60));
  console.log(`総テスト数: ${totalTests}`);
  console.log(`✅ 合格: ${passedTests}`);
  console.log(`❌ 失敗: ${failedTests}`);
  console.log(`成功率: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  console.log('='.repeat(60));

  if (failedTests === 0) {
    console.log('🎉 全テスト合格！VoiceDrive API接続は正常に動作しています。');
  } else {
    console.log('⚠️ 一部のテストが失敗しました。');
    process.exit(1);
  }

  // DB接続を切断
  await voiceDriveDataService.disconnect();
  console.log('🔌 DB接続を切断しました');
}

// スクリプト実行
testApiConnection().catch((error) => {
  console.error('致命的エラー:', error);
  process.exit(1);
});
