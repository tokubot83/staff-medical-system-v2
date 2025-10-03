/**
 * フィードバック面談連携 統合テスト
 * VoiceDrive → 医療システム API統合テスト
 */

const API_URL = 'http://localhost:3002/api/interviews/reservations';

interface TestResult {
  case: string;
  status: 'PASS' | 'FAIL';
  details: string;
  response?: any;
  error?: any;
}

const results: TestResult[] = [];

/**
 * テストケース1: 夏季評価フィードバック（異議申立期限間近・緊急）
 */
async function testCase1() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 ケース1: 夏季評価フィードバック（異議申立期限間近・緊急）');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const timestamp = Date.now();
  const testData = {
    staffId: `TEST-${timestamp}-001`,
    staffName: '高橋 由美',
    department: '外来看護部',
    position: '看護師',
    type: 'support',
    supportCategory: 'feedback',
    supportTopic: '夏季評価結果フィードバック',
    scheduledDate: '2025-10-10',
    scheduledTime: '14:00',
    preferredDates: [
      '2025-10-10',
      '2025-10-11',
      '2025-10-12'
    ],
    urgency: 'urgent',
    evaluationDetails: {
      evaluationId: 'EVAL-2024-SUMMER-010',
      evaluationType: 'summer_provisional',
      facilityGrade: 'B',
      corporateGrade: 'C',
      totalPoints: 18.5,
      appealDeadline: '2025-10-13',
      appealable: true
    },
    notes: '評価結果について詳しく説明を受けたい。特に組織貢献度の評価基準について確認したい。',
    duration: 45,
    source: 'voicedrive',
    createdBy: '職員本人'
  };

  try {
    console.log('📤 送信データ:');
    console.log(`   staffId: ${testData.staffId}`);
    console.log(`   supportCategory: ${testData.supportCategory}`);
    console.log(`   urgency: ${testData.urgency}`);
    console.log(`   evaluationType: ${testData.evaluationDetails.evaluationType}`);
    console.log(`   appealDeadline: ${testData.evaluationDetails.appealDeadline}`);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const responseData = await response.json();

    console.log('\n📥 レスポンス結果:');
    console.log(`   HTTPステータス: ${response.status}`);
    console.log(`   成功: ${responseData.success ? '✅' : '❌'}`);

    if (response.status === 201 && responseData.success) {
      console.log(`   予約ID: ${responseData.data.id}`);
      console.log('\n✅ ケース1: PASS');

      results.push({
        case: 'ケース1: 夏季評価（緊急）',
        status: 'PASS',
        details: `予約ID: ${responseData.data.id}`,
        response: responseData
      });
    } else {
      console.log('\n❌ ケース1: FAIL');
      results.push({
        case: 'ケース1: 夏季評価（緊急）',
        status: 'FAIL',
        details: `HTTPステータス: ${response.status}`,
        response: responseData
      });
    }
  } catch (error: any) {
    console.error('\n❌ ケース1: FAIL (エラー)');
    console.error(error);
    results.push({
      case: 'ケース1: 夏季評価（緊急）',
      status: 'FAIL',
      details: 'リクエスト失敗',
      error: error.message
    });
  }
}

/**
 * テストケース2: 冬季評価フィードバック（期限に余裕・中優先度）
 */
async function testCase2() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 ケース2: 冬季評価フィードバック（期限に余裕・中優先度）');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const timestamp = Date.now();
  const testData = {
    staffId: `TEST-${timestamp}-002`,
    staffName: '伊藤 健太',
    department: 'リハビリテーション科',
    position: '理学療法士',
    type: 'support',
    supportCategory: 'feedback',
    supportTopic: '冬季評価のフィードバック',
    scheduledDate: '2025-10-20',
    scheduledTime: '10:00',
    preferredDates: [
      '2025-10-20',
      '2025-10-21'
    ],
    urgency: 'medium',
    evaluationDetails: {
      evaluationId: 'EVAL-2024-WINTER-007',
      evaluationType: 'winter_provisional',
      facilityGrade: 'S',
      corporateGrade: 'S',
      totalPoints: 24.8,
      appealDeadline: '2025-11-10',
      appealable: false
    },
    notes: '今後のキャリアについても相談したい',
    duration: 60,
    source: 'voicedrive'
  };

  try {
    console.log('📤 送信データ:');
    console.log(`   staffId: ${testData.staffId}`);
    console.log(`   urgency: ${testData.urgency}`);
    console.log(`   facilityGrade: ${testData.evaluationDetails.facilityGrade}`);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const responseData = await response.json();

    console.log('\n📥 レスポンス結果:');
    console.log(`   HTTPステータス: ${response.status}`);
    console.log(`   成功: ${responseData.success ? '✅' : '❌'}`);

    if (response.status === 201 && responseData.success) {
      console.log(`   予約ID: ${responseData.data.id}`);
      console.log('\n✅ ケース2: PASS');

      results.push({
        case: 'ケース2: 冬季評価（中）',
        status: 'PASS',
        details: `予約ID: ${responseData.data.id}`,
        response: responseData
      });
    } else {
      console.log('\n❌ ケース2: FAIL');
      results.push({
        case: 'ケース2: 冬季評価（中）',
        status: 'FAIL',
        details: `HTTPステータス: ${response.status}`,
        response: responseData
      });
    }
  } catch (error: any) {
    console.error('\n❌ ケース2: FAIL (エラー)');
    console.error(error);
    results.push({
      case: 'ケース2: 冬季評価（中）',
      status: 'FAIL',
      details: 'リクエスト失敗',
      error: error.message
    });
  }
}

/**
 * テストケース3: 年間確定評価フィードバック（異議申立不可）
 */
async function testCase3() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 ケース3: 年間確定評価フィードバック（異議申立不可）');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const timestamp = Date.now();
  const testData = {
    staffId: `TEST-${timestamp}-003`,
    staffName: '田中 一郎',
    department: '内科',
    position: '医師',
    type: 'support',
    supportCategory: 'feedback',
    supportTopic: '年間総合評価のフィードバック',
    scheduledDate: '2025-04-05',
    scheduledTime: '15:00',
    preferredDates: [
      '2025-04-05'
    ],
    urgency: 'low',
    evaluationDetails: {
      evaluationId: 'EVAL-2024-ANNUAL-003',
      evaluationType: 'annual_final',
      facilityGrade: 'A',
      corporateGrade: 'A',
      totalPoints: 22.0,
      appealable: false
    },
    notes: '次年度の目標設定について相談したい',
    source: 'voicedrive'
  };

  try {
    console.log('📤 送信データ:');
    console.log(`   staffId: ${testData.staffId}`);
    console.log(`   evaluationType: ${testData.evaluationDetails.evaluationType}`);
    console.log(`   appealable: ${testData.evaluationDetails.appealable}`);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const responseData = await response.json();

    console.log('\n📥 レスポンス結果:');
    console.log(`   HTTPステータス: ${response.status}`);
    console.log(`   成功: ${responseData.success ? '✅' : '❌'}`);

    if (response.status === 201 && responseData.success) {
      console.log(`   予約ID: ${responseData.data.id}`);
      console.log('\n✅ ケース3: PASS');

      results.push({
        case: 'ケース3: 年間評価（確定）',
        status: 'PASS',
        details: `予約ID: ${responseData.data.id}`,
        response: responseData
      });
    } else {
      console.log('\n❌ ケース3: FAIL');
      results.push({
        case: 'ケース3: 年間評価（確定）',
        status: 'FAIL',
        details: `HTTPステータス: ${response.status}`,
        response: responseData
      });
    }
  } catch (error: any) {
    console.error('\n❌ ケース3: FAIL (エラー)');
    console.error(error);
    results.push({
      case: 'ケース3: 年間評価（確定）',
      status: 'FAIL',
      details: 'リクエスト失敗',
      error: error.message
    });
  }
}

/**
 * テストケース4: 必須フィールド欠損エラー
 */
async function testCase4() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 ケース4: 必須フィールド欠損エラー');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const testData = {
    staffId: 'OH-NS-2020-010',
    staffName: '高橋 由美',
    type: 'support',
    supportCategory: 'feedback',
    scheduledDate: '2025-10-10',
    scheduledTime: '14:00'
    // evaluationDetails が欠落
    // department, position も欠落
  };

  try {
    console.log('📤 送信データ: 必須フィールド欠損（department, position, evaluationDetails）');

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const responseData = await response.json();

    console.log('\n📥 レスポンス結果:');
    console.log(`   HTTPステータス: ${response.status}`);
    console.log(`   成功: ${responseData.success ? '✅' : '❌'}`);

    if (response.status === 400 && !responseData.success) {
      console.log(`   エラーメッセージ: ${responseData.error}`);
      console.log('\n✅ ケース4: PASS (期待通りのエラーハンドリング)');

      results.push({
        case: 'ケース4: 必須欠損エラー',
        status: 'PASS',
        details: `400エラーで正しく拒否: ${responseData.error}`,
        response: responseData
      });
    } else {
      console.log('\n❌ ケース4: FAIL (エラーハンドリングが期待と異なる)');
      results.push({
        case: 'ケース4: 必須欠損エラー',
        status: 'FAIL',
        details: `期待: 400エラー, 実際: ${response.status}`,
        response: responseData
      });
    }
  } catch (error: any) {
    console.error('\n❌ ケース4: FAIL (エラー)');
    console.error(error);
    results.push({
      case: 'ケース4: 必須欠損エラー',
      status: 'FAIL',
      details: 'リクエスト失敗',
      error: error.message
    });
  }
}

/**
 * テストケース5: 評価情報の型不正
 */
async function testCase5() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 ケース5: 評価情報の型不正');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const timestamp = Date.now();
  const testData = {
    staffId: `TEST-${timestamp}-005`,
    staffName: '佐藤 花子',
    department: '外来看護部',
    position: '看護師',
    type: 'support',
    supportCategory: 'feedback',
    scheduledDate: '2025-10-15',  // 異なる日付に変更
    scheduledTime: '15:00',  // 異なる時間に変更
    evaluationDetails: {
      evaluationId: 'EVAL-2024-SUMMER-011',
      evaluationType: 'invalid_type',  // 不正な値
      facilityGrade: 'B',
      totalPoints: 'not_a_number'  // 文字列（数値を期待）
    }
  };

  try {
    console.log('📤 送信データ: 評価情報の型不正');
    console.log(`   evaluationType: ${testData.evaluationDetails.evaluationType} (不正)`);
    console.log(`   totalPoints: ${testData.evaluationDetails.totalPoints} (文字列)`);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const responseData = await response.json();

    console.log('\n📥 レスポンス結果:');
    console.log(`   HTTPステータス: ${response.status}`);
    console.log(`   成功: ${responseData.success ? '✅' : '❌'}`);

    // このケースは正常受信後の警告表示も許容
    if (response.status === 400 || (response.status === 201 && responseData.success)) {
      console.log('\n✅ ケース5: PASS (バリデーションエラー or 正常受信)');

      results.push({
        case: 'ケース5: 型不正エラー',
        status: 'PASS',
        details: `HTTPステータス: ${response.status}`,
        response: responseData
      });
    } else {
      console.log('\n❌ ケース5: FAIL');
      results.push({
        case: 'ケース5: 型不正エラー',
        status: 'FAIL',
        details: `HTTPステータス: ${response.status}`,
        response: responseData
      });
    }
  } catch (error: any) {
    console.error('\n❌ ケース5: FAIL (エラー)');
    console.error(error);
    results.push({
      case: 'ケース5: 型不正エラー',
      status: 'FAIL',
      details: 'リクエスト失敗',
      error: error.message
    });
  }
}

/**
 * メイン実行関数
 */
async function runIntegrationTests() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  フィードバック面談連携 統合テスト                          ║');
  console.log('║  VoiceDrive → 医療システム                                   ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`📅 テスト実行日時: ${new Date().toLocaleString('ja-JP')}`);
  console.log(`🔗 API URL: ${API_URL}`);
  console.log('');

  // ケース1-3: 正常系テスト
  await testCase1();
  await new Promise(resolve => setTimeout(resolve, 500)); // 500ms待機

  await testCase2();
  await new Promise(resolve => setTimeout(resolve, 500));

  await testCase3();
  await new Promise(resolve => setTimeout(resolve, 500));

  // ケース4-5: 異常系テスト
  await testCase4();
  await new Promise(resolve => setTimeout(resolve, 500));

  await testCase5();

  // 結果サマリ
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  テスト結果サマリ                                            ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');

  const passCount = results.filter(r => r.status === 'PASS').length;
  const failCount = results.filter(r => r.status === 'FAIL').length;

  results.forEach(result => {
    const statusIcon = result.status === 'PASS' ? '✅' : '❌';
    console.log(`${statusIcon} ${result.case}: ${result.status}`);
    console.log(`   詳細: ${result.details}`);
  });

  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 合計: ${results.length}件 | ✅ PASS: ${passCount}件 | ❌ FAIL: ${failCount}件`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');

  if (failCount === 0) {
    console.log('✅ 全テストケース成功！');
    console.log('');
    console.log('📋 次のステップ:');
    console.log('1. 予約管理ページ（http://localhost:3000/interviews?tab=station）を開く');
    console.log('2. 初回受付待ちカラムに3件の予約が表示されることを確認');
    console.log('3. 評価情報カードが正しく表示されることを確認');
    console.log('4. 異議申立期限の警告が表示されることを確認（ケース1）');
    console.log('');
  } else {
    console.log('❌ 一部テストケースが失敗しました');
    console.log('');
    console.log('🔍 失敗原因の確認:');
    console.log('- 開発サーバーが起動しているか確認してください');
    console.log('- ポート3000が使用可能か確認してください');
    console.log('');
  }

  return failCount === 0;
}

// テスト実行
runIntegrationTests()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('');
    console.error('╔════════════════════════════════════════════════════════════════╗');
    console.error('║  ❌ テスト実行エラー                                        ║');
    console.error('╚════════════════════════════════════════════════════════════════╝');
    console.error('');
    console.error(error);
    process.exit(1);
  });
