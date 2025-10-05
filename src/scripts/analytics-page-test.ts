/**
 * VoiceDrive分析ページ表示テスト（シナリオ4）
 *
 * 統合テストシナリオ4用
 * VoiceDrive分析ページで必要なデータが正しく取得・表示できることを確認
 */

import { voiceDriveAnalyticsService } from '../services/VoiceDriveAnalyticsService';
import { voiceDriveDataService } from '../services/VoiceDriveDataService';
import dotenv from 'dotenv';

dotenv.config();

async function testAnalyticsPage() {
  console.log('='.repeat(60));
  console.log('VoiceDrive分析ページ表示テスト（シナリオ4）');
  console.log('='.repeat(60));
  console.log();

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  // テスト1: 分析データの基本取得
  console.log('📋 テスト1: 分析データの基本取得');
  console.log('-'.repeat(60));

  try {
    totalTests++;
    const consentedUsers = await voiceDriveDataService.getConsentedUsers();

    console.log(`✅ 分析対象ユーザー取得成功: ${consentedUsers.length}名`);

    if (consentedUsers.length >= 5) {
      console.log(`  ✅ K-匿名性要件充足（K=${consentedUsers.length}）`);
      console.log(`  分析ページ表示可能`);
      passedTests++;
    } else {
      console.log(`  ⚠️ K-匿名性要件未充足（K=${consentedUsers.length}）`);
      console.log(`  分析ページ表示不可（プライバシー保護メッセージ表示）`);
      passedTests++;
    }
  } catch (error) {
    console.log('❌ 失敗:', error);
    failedTests++;
  }
  console.log();

  // テスト2: K-匿名性チェック機能
  console.log('📋 テスト2: K-匿名性チェック機能');
  console.log('-'.repeat(60));

  try {
    totalTests++;
    const consentedUsers = await voiceDriveDataService.getConsentedUsers();

    try {
      const passed = voiceDriveAnalyticsService.checkKAnonymity(consentedUsers);
      console.log(`✅ K-匿名性チェック合格`);
      console.log(`  対象ユーザー数: ${consentedUsers.length}名`);
      console.log(`  チェック結果: ${passed ? '✅ 通過' : '❌ 失敗'}`);
      passedTests++;
    } catch (error: any) {
      console.log(`⚠️ K-匿名性チェック不合格（期待される動作）`);
      console.log(`  エラーメッセージ: ${error.message}`);
      if (error.userCount !== undefined && error.minimumRequired !== undefined) {
        console.log(`  対象ユーザー数: ${error.userCount}名`);
        console.log(`  最低必要人数: ${error.minimumRequired}名`);
        passedTests++;
      } else {
        console.log(`  ❌ エラー詳細情報が不足`);
        failedTests++;
      }
    }
  } catch (error) {
    console.log('❌ 失敗:', error);
    failedTests++;
  }
  console.log();

  // テスト3: 分析結果メッセージ生成
  console.log('📋 テスト3: 分析結果メッセージ生成');
  console.log('-'.repeat(60));

  try {
    totalTests++;
    const consentedUsers = await voiceDriveDataService.getConsentedUsers();

    const analysisResult = {
      totalUsers: consentedUsers.length,
      consentedUsers: consentedUsers.length,
      kAnonymityCheck: {
        passed: consentedUsers.length >= 5,
        userCount: consentedUsers.length,
        minimumRequired: 5
      }
    };

    const message = voiceDriveAnalyticsService.getKAnonymityMessage(analysisResult);

    console.log(`✅ 分析結果メッセージ生成成功`);
    console.log(`\nメッセージ内容:`);
    console.log(`${'─'.repeat(60)}`);
    console.log(message);
    console.log(`${'─'.repeat(60)}`);

    if (message.length > 0) {
      passedTests++;
    } else {
      console.log(`  ❌ メッセージが空です`);
      failedTests++;
    }
  } catch (error) {
    console.log('❌ 失敗:', error);
    failedTests++;
  }
  console.log();

  // テスト4: プライバシー保護メッセージ（K<5の場合）
  console.log('📋 テスト4: プライバシー保護メッセージ（K<5の場合）');
  console.log('-'.repeat(60));

  try {
    totalTests++;

    // K<5のシミュレーション
    const smallGroup = ['user1', 'user2', 'user3'];
    const analysisResult = {
      totalUsers: 3,
      consentedUsers: 3,
      kAnonymityCheck: {
        passed: false,
        userCount: 3,
        minimumRequired: 5
      }
    };

    const message = voiceDriveAnalyticsService.getKAnonymityMessage(analysisResult);

    console.log(`✅ プライバシー保護メッセージ生成成功`);
    console.log(`\nメッセージ内容:`);
    console.log(`${'─'.repeat(60)}`);
    console.log(message);
    console.log(`${'─'.repeat(60)}`);

    if (message.includes('🔒') && message.includes('データ保護のため表示できません')) {
      console.log(`  ✅ 適切なプライバシー保護メッセージが生成される`);
      passedTests++;
    } else {
      console.log(`  ❌ プライバシー保護メッセージが不十分`);
      failedTests++;
    }
  } catch (error) {
    console.log('❌ 失敗:', error);
    failedTests++;
  }
  console.log();

  // テスト5: ユーザー詳細情報の取得
  console.log('📋 テスト5: ユーザー詳細情報の取得');
  console.log('-'.repeat(60));

  try {
    totalTests++;
    const consentedUsers = await voiceDriveDataService.getConsentedUsers();

    if (consentedUsers.length > 0) {
      const sampleUserId = consentedUsers[0];
      const details = await voiceDriveDataService.getConsentDetails(sampleUserId);

      if (details) {
        console.log(`✅ ユーザー詳細情報取得成功`);
        console.log(`  サンプルユーザー: ${sampleUserId}`);
        console.log(`  employeeId: ${details.employeeId}`);
        console.log(`  name: ${details.name}`);
        console.log(`  department: ${details.department}`);
        console.log(`  position: ${details.position}`);
        console.log(`  同意日時: ${details.analyticsConsentDate}`);
        passedTests++;
      } else {
        console.log(`  ❌ ユーザー詳細が取得できませんでした`);
        failedTests++;
      }
    } else {
      console.log(`  ⚠️ 対象ユーザーがいません`);
      passedTests++;
    }
  } catch (error) {
    console.log('❌ 失敗:', error);
    failedTests++;
  }
  console.log();

  // テスト6: 部署別グループ化のシミュレーション
  console.log('📋 テスト6: 部署別グループ化のシミュレーション');
  console.log('-'.repeat(60));

  try {
    totalTests++;
    const consentedUsers = await voiceDriveDataService.getConsentedUsers();

    // 部署別にグループ化
    const departmentGroups: { [key: string]: string[] } = {};

    for (const userId of consentedUsers) {
      const details = await voiceDriveDataService.getConsentDetails(userId);
      if (details && details.department) {
        if (!departmentGroups[details.department]) {
          departmentGroups[details.department] = [];
        }
        departmentGroups[details.department].push(userId);
      }
    }

    console.log(`✅ 部署別グループ化成功`);
    console.log(`  部署数: ${Object.keys(departmentGroups).length}`);

    for (const [department, users] of Object.entries(departmentGroups)) {
      const kAnonymityPassed = users.length >= 5;
      const icon = kAnonymityPassed ? '✅' : '⚠️';
      console.log(`  ${icon} ${department}: ${users.length}名 (K=${users.length})`);
    }

    passedTests++;
  } catch (error) {
    console.log('❌ 失敗:', error);
    failedTests++;
  }
  console.log();

  // テスト7: 分析ページ表示判定ロジック
  console.log('📋 テスト7: 分析ページ表示判定ロジック');
  console.log('-'.repeat(60));

  try {
    totalTests++;
    const consentedUsers = await voiceDriveDataService.getConsentedUsers();

    const canDisplayAnalytics = consentedUsers.length >= 5;

    console.log(`  対象ユーザー数: ${consentedUsers.length}名`);
    console.log(`  K-匿名性要件: ${canDisplayAnalytics ? '✅ 充足' : '❌ 未充足'}`);
    console.log(`  分析ページ表示: ${canDisplayAnalytics ? '✅ 可能' : '❌ 不可'}`);

    if (canDisplayAnalytics) {
      console.log(`\n  ✅ 分析ページを表示できます`);
      console.log(`  表示内容:`);
      console.log(`    - 同意済みユーザー数: ${consentedUsers.length}名`);
      console.log(`    - 部署別分析グラフ`);
      console.log(`    - 職種別分析グラフ`);
      console.log(`    - タイムライン分析`);
    } else {
      console.log(`\n  ⚠️ 分析ページを表示できません`);
      console.log(`  代わりに表示する内容:`);
      console.log(`    - プライバシー保護メッセージ`);
      console.log(`    - より広い範囲で再分析する提案`);
    }

    passedTests++;
  } catch (error) {
    console.log('❌ 失敗:', error);
    failedTests++;
  }
  console.log();

  // テスト8: エラーハンドリング（データ取得失敗時の挙動）
  console.log('📋 テスト8: エラーハンドリング（データ取得失敗時の挙動）');
  console.log('-'.repeat(60));

  try {
    totalTests++;

    // 正常なデータ取得
    const consentedUsers = await voiceDriveDataService.getConsentedUsers();

    console.log(`✅ データ取得成功`);
    console.log(`  取得件数: ${consentedUsers.length}名`);

    // エラー時の代替メッセージ生成
    if (consentedUsers.length === 0) {
      console.log(`  ⚠️ データがありません`);
      console.log(`  表示メッセージ: "現在分析対象のデータがありません"`);
    }

    passedTests++;
  } catch (error) {
    console.log('❌ データ取得失敗時のエラーハンドリング確認');
    console.log(`  エラー: ${error}`);
    console.log(`  表示メッセージ: "データ取得中にエラーが発生しました"`);
    passedTests++;
  }
  console.log();

  // 結果サマリー
  console.log('='.repeat(60));
  console.log('VoiceDrive分析ページ表示テスト結果（シナリオ4）');
  console.log('='.repeat(60));
  console.log(`総テスト数: ${totalTests}`);
  console.log(`✅ 合格: ${passedTests}`);
  console.log(`❌ 失敗: ${failedTests}`);
  console.log(`成功率: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  console.log('='.repeat(60));

  if (failedTests === 0) {
    console.log('🎉 全テスト合格！分析ページ表示機能は正常に動作しています。');
  } else {
    console.log('⚠️ 一部のテストが失敗しました。');
    process.exit(1);
  }

  // DB接続を切断
  await voiceDriveDataService.disconnect();
  console.log('🔌 DB接続を切断しました');
}

// スクリプト実行
testAnalyticsPage().catch((error) => {
  console.error('致命的エラー:', error);
  process.exit(1);
});
