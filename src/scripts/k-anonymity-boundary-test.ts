/**
 * K-匿名性チェック境界値テスト
 *
 * 統合テストシナリオ3用
 * 5名以上：合格、5名未満：失敗を確認
 */

import { voiceDriveAnalyticsService, KAnonymityError } from '../services/VoiceDriveAnalyticsService';

async function testKAnonymityBoundary() {
  console.log('='.repeat(60));
  console.log('K-匿名性チェック境界値テスト（統合テスト）');
  console.log('='.repeat(60));
  console.log();

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  // テストケース1: 5名（境界値・合格）
  console.log('📋 テストケース1: 5名（境界値・合格）');
  console.log('-'.repeat(60));

  try {
    totalTests++;
    const testUsers5 = ['user1', 'user2', 'user3', 'user4', 'user5'];
    const result = voiceDriveAnalyticsService.checkKAnonymity(testUsers5);

    if (result === true) {
      console.log('✅ 合格: 5名でK-匿名性チェック通過');
      passedTests++;
    } else {
      console.log('❌ 失敗: 5名でK-匿名性チェックが通過しなかった');
      failedTests++;
    }
  } catch (error) {
    console.log('❌ 失敗: 予期しないエラー', error);
    failedTests++;
  }
  console.log();

  // テストケース2: 6名（合格）
  console.log('📋 テストケース2: 6名（合格）');
  console.log('-'.repeat(60));

  try {
    totalTests++;
    const testUsers6 = ['user1', 'user2', 'user3', 'user4', 'user5', 'user6'];
    const result = voiceDriveAnalyticsService.checkKAnonymity(testUsers6);

    if (result === true) {
      console.log('✅ 合格: 6名でK-匿名性チェック通過');
      passedTests++;
    } else {
      console.log('❌ 失敗: 6名でK-匿名性チェックが通過しなかった');
      failedTests++;
    }
  } catch (error) {
    console.log('❌ 失敗: 予期しないエラー', error);
    failedTests++;
  }
  console.log();

  // テストケース3: 4名（境界値・失敗）
  console.log('📋 テストケース3: 4名（境界値・失敗）');
  console.log('-'.repeat(60));

  try {
    totalTests++;
    const testUsers4 = ['user1', 'user2', 'user3', 'user4'];
    voiceDriveAnalyticsService.checkKAnonymity(testUsers4);

    console.log('❌ 失敗: 4名でK-匿名性チェックが通過してしまった（本来は失敗すべき）');
    failedTests++;
  } catch (error) {
    if (error instanceof KAnonymityError) {
      console.log('✅ 合格: 4名で正しくエラーが発生');
      console.log(`  エラーメッセージ: ${error.message}`);
      console.log(`  ユーザー数: ${error.userCount}`);
      console.log(`  最小必要人数: ${error.minimumRequired}`);
      passedTests++;
    } else {
      console.log('❌ 失敗: 予期しないエラー', error);
      failedTests++;
    }
  }
  console.log();

  // テストケース4: 3名（失敗）
  console.log('📋 テストケース4: 3名（失敗）');
  console.log('-'.repeat(60));

  try {
    totalTests++;
    const testUsers3 = ['user1', 'user2', 'user3'];
    voiceDriveAnalyticsService.checkKAnonymity(testUsers3);

    console.log('❌ 失敗: 3名でK-匿名性チェックが通過してしまった（本来は失敗すべき）');
    failedTests++;
  } catch (error) {
    if (error instanceof KAnonymityError) {
      console.log('✅ 合格: 3名で正しくエラーが発生');
      console.log(`  エラーメッセージ: ${error.message}`);
      passedTests++;
    } else {
      console.log('❌ 失敗: 予期しないエラー', error);
      failedTests++;
    }
  }
  console.log();

  // テストケース5: 1名（失敗）
  console.log('📋 テストケース5: 1名（失敗）');
  console.log('-'.repeat(60));

  try {
    totalTests++;
    const testUsers1 = ['user1'];
    voiceDriveAnalyticsService.checkKAnonymity(testUsers1);

    console.log('❌ 失敗: 1名でK-匿名性チェックが通過してしまった（本来は失敗すべき）');
    failedTests++;
  } catch (error) {
    if (error instanceof KAnonymityError) {
      console.log('✅ 合格: 1名で正しくエラーが発生');
      console.log(`  エラーメッセージ: ${error.message}`);
      passedTests++;
    } else {
      console.log('❌ 失敗: 予期しないエラー', error);
      failedTests++;
    }
  }
  console.log();

  // テストケース6: 0名（失敗）
  console.log('📋 テストケース6: 0名（失敗）');
  console.log('-'.repeat(60));

  try {
    totalTests++;
    const testUsers0: string[] = [];
    voiceDriveAnalyticsService.checkKAnonymity(testUsers0);

    console.log('❌ 失敗: 0名でK-匿名性チェックが通過してしまった（本来は失敗すべき）');
    failedTests++;
  } catch (error) {
    if (error instanceof KAnonymityError) {
      console.log('✅ 合格: 0名で正しくエラーが発生');
      console.log(`  エラーメッセージ: ${error.message}`);
      passedTests++;
    } else {
      console.log('❌ 失敗: 予期しないエラー', error);
      failedTests++;
    }
  }
  console.log();

  // テストケース7: エラーメッセージの確認
  console.log('📋 テストケース7: ユーザーフレンドリーなエラーメッセージ確認');
  console.log('-'.repeat(60));

  try {
    totalTests++;
    const testUsers3 = ['user1', 'user2', 'user3'];

    try {
      voiceDriveAnalyticsService.checkKAnonymity(testUsers3);
    } catch (error) {
      if (error instanceof KAnonymityError) {
        const analysisResult = {
          totalUsers: 3,
          consentedUsers: 3,
          kAnonymityCheck: {
            passed: false,
            userCount: error.userCount,
            minimumRequired: error.minimumRequired
          }
        };

        const userMessage = voiceDriveAnalyticsService.getKAnonymityMessage(analysisResult);
        console.log('ユーザー向けメッセージ:');
        console.log(userMessage);
        console.log();

        if (userMessage.includes('🔒') && userMessage.includes('データ保護のため表示できません')) {
          console.log('✅ 合格: ユーザーフレンドリーなエラーメッセージが生成される');
          passedTests++;
        } else {
          console.log('❌ 失敗: エラーメッセージが不十分');
          failedTests++;
        }
      }
    }
  } catch (error) {
    console.log('❌ 失敗: 予期しないエラー', error);
    failedTests++;
  }
  console.log();

  // 結果サマリー
  console.log('='.repeat(60));
  console.log('K-匿名性チェック境界値テスト結果');
  console.log('='.repeat(60));
  console.log(`総テスト数: ${totalTests}`);
  console.log(`✅ 合格: ${passedTests}`);
  console.log(`❌ 失敗: ${failedTests}`);
  console.log(`成功率: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  console.log('='.repeat(60));

  if (failedTests === 0) {
    console.log('🎉 全テスト合格！K-匿名性チェック機能は正常に動作しています。');
  } else {
    console.log('⚠️ 一部のテストが失敗しました。');
    process.exit(1);
  }
}

// スクリプト実行
testKAnonymityBoundary().catch((error) => {
  console.error('致命的エラー:', error);
  process.exit(1);
});
