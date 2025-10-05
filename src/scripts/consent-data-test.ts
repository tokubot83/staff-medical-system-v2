/**
 * VoiceDrive同意データ取得テストスクリプト
 *
 * 実行方法:
 * npm run test:consent-data
 */

import { voiceDriveDataService } from '../services/VoiceDriveDataService';
import { voiceDriveAnalyticsService } from '../services/VoiceDriveAnalyticsService';
import dotenv from 'dotenv';

dotenv.config();

async function testConsentData() {
  console.log('='.repeat(60));
  console.log('VoiceDrive同意データ取得テスト');
  console.log('='.repeat(60));
  console.log();

  try {
    // テスト1: 同意済みユーザー取得
    console.log('📋 テスト1: 同意済みユーザー取得');
    console.log('-'.repeat(60));

    const consentedUsers = await voiceDriveDataService.getConsentedUsers();

    console.log(`✅ 同意済みユーザー数: ${consentedUsers.length}名`);
    console.log('  ユーザーID一覧:');
    consentedUsers.forEach((userId, index) => {
      console.log(`    ${index + 1}. ${userId}`);
    });
    console.log();

    // テスト2: 特定ユーザーの同意状態確認
    if (consentedUsers.length > 0) {
      console.log('📋 テスト2: 特定ユーザーの同意状態確認');
      console.log('-'.repeat(60));

      const testUserId = consentedUsers[0];
      console.log(`  対象ユーザー: ${testUserId}`);

      const hasConsent = await voiceDriveDataService.hasConsent(testUserId);
      console.log(`  同意状態: ${hasConsent ? '✅ 同意済み' : '❌ 未同意'}`);

      const consentDetails = await voiceDriveDataService.getConsentDetails(testUserId);
      if (consentDetails) {
        console.log('  詳細情報:');
        console.log(`    - analyticsConsent: ${consentDetails.analyticsConsent}`);
        console.log(`    - analyticsConsentDate: ${consentDetails.analyticsConsentDate}`);
        console.log(`    - personalFeedbackConsent: ${consentDetails.personalFeedbackConsent}`);
        console.log(`    - revokeDate: ${consentDetails.revokeDate || 'null'}`);
        console.log(`    - dataDeletionRequested: ${consentDetails.dataDeletionRequested}`);
      }
      console.log();
    }

    // テスト3: 同意済みユーザー数取得
    console.log('📋 テスト3: 同意済みユーザー数取得');
    console.log('-'.repeat(60));

    const count = await voiceDriveDataService.getConsentedUserCount();
    console.log(`✅ 同意済みユーザー数: ${count}名`);
    console.log();

    // テスト4: 削除リクエスト取得
    console.log('📋 テスト4: 削除リクエスト取得');
    console.log('-'.repeat(60));

    const deletionRequests = await voiceDriveDataService.getDeletionRequests();
    console.log(`✅ 削除リクエスト数: ${deletionRequests.length}件`);
    if (deletionRequests.length > 0) {
      console.log('  ユーザーID一覧:');
      deletionRequests.forEach((userId, index) => {
        console.log(`    ${index + 1}. ${userId}`);
      });
    }
    console.log();

    // テスト5: K-匿名性チェック
    console.log('📋 テスト5: K-匿名性チェック');
    console.log('-'.repeat(60));

    const analysisResult = await voiceDriveAnalyticsService.analyzeVoiceDriveData({});

    console.log(`  K-匿名性チェック: ${analysisResult.kAnonymityCheck.passed ? '✅ 合格' : '❌ 不合格'}`);
    console.log(`  対象ユーザー数: ${analysisResult.kAnonymityCheck.userCount}名`);
    console.log(`  最小必要人数: ${analysisResult.kAnonymityCheck.minimumRequired}名`);

    const message = voiceDriveAnalyticsService.getKAnonymityMessage(analysisResult);
    console.log(`  メッセージ: ${message.split('\n')[0]}`);

    if (analysisResult.analysis) {
      console.log('  分析結果:');
      console.log(`    - 投稿数: ${analysisResult.analysis.postCount}件`);
      console.log(`    - 投票数: ${analysisResult.analysis.voteCount}件`);
      console.log(`    - コメント数: ${analysisResult.analysis.commentCount}件`);
    }
    console.log();

    // サマリー
    console.log('='.repeat(60));
    console.log('✅ VoiceDrive同意データ取得テスト完了');
    console.log('='.repeat(60));
    console.log();
    console.log('📊 テスト結果サマリー:');
    console.log(`  - 同意済みユーザー: ${consentedUsers.length}名`);
    console.log(`  - 削除リクエスト: ${deletionRequests.length}件`);
    console.log(`  - K-匿名性チェック: ${analysisResult.kAnonymityCheck.passed ? '✅ 合格' : '❌ 不合格'}`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ テスト実行エラー:');
    console.error(error);
    console.log();
    console.log('='.repeat(60));
    console.log('❌ VoiceDrive同意データ取得テスト失敗');
    console.log('='.repeat(60));
    process.exit(1);

  } finally {
    await voiceDriveDataService.disconnect();
    console.log('🔌 DB接続を切断しました');
  }
}

// スクリプト実行
testConsentData().catch((error) => {
  console.error('致命的エラー:', error);
  process.exit(1);
});
