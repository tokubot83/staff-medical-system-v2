#!/usr/bin/env node

/**
 * VoiceDrive統合テスト実行スクリプト
 *
 * 医療システムのcalculate-level APIに対して
 * VoiceDriveチームが用意した11件のテストデータでテストを実行
 */

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';
const JWT_TOKEN = process.env.JWT_TOKEN || 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2b2ljZWRyaXZlLWludGVncmF0aW9uIiwicm9sZSI6ImFwaS1jbGllbnQiLCJpYXQiOjE3Mjc5NTIwMDAsImV4cCI6MTczMDU0NDAwMH0.test-integration-token-for-voicedrive-medical-api';
const FACILITY_ID = process.env.FACILITY_ID || 'obara-hospital';

// テストケース定義（VoiceDriveチームの依頼書に基づく）
const testCases = [
  {
    id: 'TC-001',
    staffId: 'TEST_STAFF_001',
    expectedLevel: 1,
    description: '新人（1年目）',
    category: '基本レベル'
  },
  {
    id: 'TC-002',
    staffId: 'TEST_STAFF_002',
    expectedLevel: 1.5,
    description: '新人リーダー（1年目・リーダー可）',
    category: '0.5刻みレベル'
  },
  {
    id: 'TC-003',
    staffId: 'TEST_STAFF_003',
    expectedLevel: 3,
    description: '中堅（5年目）',
    category: '基本レベル'
  },
  {
    id: 'TC-004',
    staffId: 'TEST_STAFF_004',
    expectedLevel: 4,
    description: 'ベテラン（15年目）',
    category: '基本レベル'
  },
  {
    id: 'TC-005',
    staffId: 'TEST_STAFF_005',
    expectedLevel: 4.5,
    description: 'ベテランリーダー（15年目・リーダー可）',
    category: '0.5刻みレベル'
  },
  {
    id: 'TC-006',
    staffId: 'TEST_STAFF_006',
    expectedLevel: 10,
    description: '部長・医局長',
    category: '役職レベル'
  },
  {
    id: 'TC-007',
    staffId: 'TEST_STAFF_007',
    expectedLevel: 15,
    description: '人事各部門長',
    category: '役職レベル'
  },
  {
    id: 'TC-008',
    staffId: 'TEST_STAFF_008',
    expectedLevel: 18,
    description: '理事長（最高レベル）',
    category: '役職レベル'
  },
  {
    id: 'TC-097',
    staffId: 'TEST_STAFF_097',
    expectedLevel: 97,
    description: '健診担当者',
    category: '特別権限レベル'
  },
  {
    id: 'TC-098',
    staffId: 'TEST_STAFF_098',
    expectedLevel: 98,
    description: '産業医',
    category: '特別権限レベル'
  },
  {
    id: 'TC-099',
    staffId: 'TEST_STAFF_099',
    expectedLevel: 99,
    description: 'システム管理者（最高権限）',
    category: '特別権限レベル'
  }
];

// テスト結果格納
const testResults = {
  total: testCases.length,
  passed: 0,
  failed: 0,
  errors: 0,
  details: []
};

// カラーコード
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// ヘルパー関数
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// APIリクエスト関数
async function callCalculateLevelAPI(staffId) {
  const startTime = Date.now();

  try {
    const response = await fetch(`${API_BASE_URL}/calculate-level`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': JWT_TOKEN
      },
      body: JSON.stringify({
        staffId,
        facilityId: FACILITY_ID
      })
    });

    const responseTime = Date.now() - startTime;
    const data = await response.json();

    return {
      success: response.ok,
      status: response.status,
      data,
      responseTime
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      responseTime: Date.now() - startTime
    };
  }
}

// テスト実行
async function runTest(testCase) {
  log(`\n[${testCase.id}] ${testCase.description}`, 'cyan');
  log(`  カテゴリ: ${testCase.category}`);
  log(`  期待レベル: ${testCase.expectedLevel}`);

  const result = await callCalculateLevelAPI(testCase.staffId);

  if (!result.success) {
    log(`  ❌ FAILED: API呼び出しエラー`, 'red');
    log(`     エラー: ${result.error || `HTTP ${result.status}`}`, 'red');
    testResults.errors++;
    testResults.details.push({
      ...testCase,
      result: 'ERROR',
      error: result.error || `HTTP ${result.status}`,
      responseTime: result.responseTime
    });
    return;
  }

  const actualLevel = result.data.accountLevel;
  const responseTime = result.responseTime;

  if (actualLevel === testCase.expectedLevel) {
    log(`  ✅ PASSED: Level ${actualLevel} (${responseTime}ms)`, 'green');
    testResults.passed++;
    testResults.details.push({
      ...testCase,
      result: 'PASS',
      actualLevel,
      responseTime
    });
  } else {
    log(`  ❌ FAILED: Level ${actualLevel} (期待: ${testCase.expectedLevel})`, 'red');
    testResults.failed++;
    testResults.details.push({
      ...testCase,
      result: 'FAIL',
      actualLevel,
      expectedLevel: testCase.expectedLevel,
      responseTime
    });
  }

  log(`  レスポンスタイム: ${responseTime}ms`);
}

// ヘルスチェック
async function healthCheck() {
  log('\n🔍 ヘルスチェック開始...', 'blue');

  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();

    if (response.ok) {
      log(`✅ API稼働中 (${data.status})`, 'green');
      log(`   バージョン: ${data.version || 'N/A'}`);
      log(`   タイムスタンプ: ${data.timestamp || 'N/A'}`);
      return true;
    } else {
      log(`❌ APIエラー (HTTP ${response.status})`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ API接続エラー: ${error.message}`, 'red');
    log(`   接続先: ${API_BASE_URL}/health`, 'yellow');
    log(`   医療システムが起動しているか確認してください`, 'yellow');
    return false;
  }
}

// サマリー表示
function printSummary() {
  log('\n' + '='.repeat(60), 'blue');
  log('📊 統合テスト結果サマリー', 'blue');
  log('='.repeat(60), 'blue');

  log(`\n総テスト数: ${testResults.total}`);
  log(`✅ 合格: ${testResults.passed}`, 'green');
  log(`❌ 不合格: ${testResults.failed}`, 'red');
  log(`⚠️  エラー: ${testResults.errors}`, 'yellow');

  const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
  log(`\n成功率: ${successRate}%`, successRate === '100.0' ? 'green' : 'yellow');

  // レスポンスタイム統計
  const responseTimes = testResults.details
    .filter(d => d.responseTime)
    .map(d => d.responseTime);

  if (responseTimes.length > 0) {
    const avgResponseTime = (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(0);
    const maxResponseTime = Math.max(...responseTimes);
    const minResponseTime = Math.min(...responseTimes);

    log(`\nレスポンスタイム統計:`);
    log(`  平均: ${avgResponseTime}ms`);
    log(`  最大: ${maxResponseTime}ms`);
    log(`  最小: ${minResponseTime}ms`);

    if (avgResponseTime < 500) {
      log(`  評価: ✅ 良好（< 500ms）`, 'green');
    } else {
      log(`  評価: ⚠️  要改善（≥ 500ms）`, 'yellow');
    }
  }

  // カテゴリ別集計
  log(`\nカテゴリ別結果:`);
  const categories = {};
  testResults.details.forEach(detail => {
    if (!categories[detail.category]) {
      categories[detail.category] = { passed: 0, total: 0 };
    }
    categories[detail.category].total++;
    if (detail.result === 'PASS') {
      categories[detail.category].passed++;
    }
  });

  Object.entries(categories).forEach(([category, stats]) => {
    const rate = ((stats.passed / stats.total) * 100).toFixed(0);
    const icon = rate === '100' ? '✅' : '⚠️';
    log(`  ${icon} ${category}: ${stats.passed}/${stats.total} (${rate}%)`,
        rate === '100' ? 'green' : 'yellow');
  });

  // 失敗したテストの詳細
  const failures = testResults.details.filter(d => d.result === 'FAIL' || d.result === 'ERROR');
  if (failures.length > 0) {
    log(`\n⚠️  失敗したテストの詳細:`, 'yellow');
    failures.forEach(f => {
      log(`  [${f.id}] ${f.description}`, 'red');
      if (f.result === 'FAIL') {
        log(`     期待: Level ${f.expectedLevel}, 実際: Level ${f.actualLevel}`, 'red');
      } else {
        log(`     エラー: ${f.error}`, 'red');
      }
    });
  }

  log('\n' + '='.repeat(60), 'blue');

  // 総合評価
  if (testResults.passed === testResults.total) {
    log('\n🎉 統合テスト成功！すべてのテストが合格しました。', 'green');
    return 0; // 成功
  } else {
    log('\n⚠️  統合テストに失敗したケースがあります。上記の詳細を確認してください。', 'yellow');
    return 1; // 失敗
  }
}

// メイン処理
async function main() {
  log('='.repeat(60), 'blue');
  log('🚀 VoiceDrive統合テスト開始', 'blue');
  log('='.repeat(60), 'blue');

  log(`\n設定情報:`);
  log(`  API Base URL: ${API_BASE_URL}`);
  log(`  Facility ID: ${FACILITY_ID}`);
  log(`  総テスト数: ${testCases.length}`);

  // ヘルスチェック
  const isHealthy = await healthCheck();
  if (!isHealthy) {
    log('\n❌ ヘルスチェック失敗。テストを中止します。', 'red');
    process.exit(1);
  }

  // 各テスト実行
  log('\n' + '='.repeat(60), 'blue');
  log('📝 テスト実行中...', 'blue');
  log('='.repeat(60), 'blue');

  for (const testCase of testCases) {
    await runTest(testCase);
    // 連続リクエストを避けるため少し待機
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // サマリー表示
  const exitCode = printSummary();

  log('\n統合テスト完了。', 'blue');
  process.exit(exitCode);
}

// 実行
main().catch(error => {
  log(`\n❌ 予期しないエラー: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
