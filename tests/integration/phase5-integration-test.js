/**
 * Phase 5-3 統合テスト実行スクリプト
 *
 * 実行コマンド: node tests/integration/phase5-integration-test.js
 */

const https = require('https');
const http = require('http');

// テスト設定
const BASE_URL = 'http://localhost:3000';
const TEST_TOKEN = 'vd_prod_key_A8B9C2D3E4F5G6H7I8J9K0L1M2N3O4P5';

// テスト結果
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  tests: []
};

// カラー出力
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60) + '\n');
}

// HTTPリクエストヘルパー
function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : null;
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: parsed
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data
          });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

// テスト実行関数
async function runTest(testId, testName, testFn) {
  testResults.total++;

  try {
    log(`[${testId}] ${testName}`, 'blue');
    const startTime = Date.now();
    await testFn();
    const duration = Date.now() - startTime;

    testResults.passed++;
    testResults.tests.push({
      id: testId,
      name: testName,
      result: 'PASS',
      duration,
      error: null
    });

    log(`✓ PASS (${duration}ms)`, 'green');
  } catch (error) {
    testResults.failed++;
    testResults.tests.push({
      id: testId,
      name: testName,
      result: 'FAIL',
      duration: 0,
      error: error.message
    });

    log(`✗ FAIL: ${error.message}`, 'red');
  }

  console.log('');
}

// アサーション関数
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message} - Expected: ${expected}, Actual: ${actual}`);
  }
}

function assertExists(value, fieldName) {
  if (value === undefined || value === null) {
    throw new Error(`${fieldName} が存在しません`);
  }
}

// ==================== Phase 1: API接続テスト ====================

async function testAPI01() {
  const response = await makeRequest('GET', '/api/my-page');

  assertEqual(response.status, 200, 'ステータスコードが200であること');
  assertExists(response.body.name, 'name');
  assertExists(response.body.careerCourse, 'careerCourse');
  assertEqual(response.body.careerCourse.courseCode, 'B', 'courseCodeがBであること');
  assertExists(response.body.careerCourse.nextChangeAvailableDate, 'nextChangeAvailableDate');

  log(`  職員名: ${response.body.name}`, 'yellow');
  log(`  現在のコース: ${response.body.careerCourse.courseCode}`, 'yellow');
  log(`  次回変更可能日: ${response.body.careerCourse.nextChangeAvailableDate}`, 'yellow');
}

async function testAPI02() {
  const response = await makeRequest('GET', '/api/career-courses/definitions');

  assertEqual(response.status, 200, 'ステータスコードが200であること');
  assert(Array.isArray(response.body), 'レスポンスが配列であること');
  assertEqual(response.body.length, 4, 'コース定義が4つあること');

  const courseCodes = response.body.map(c => c.courseCode);
  assert(courseCodes.includes('A'), 'Aコースが含まれること');
  assert(courseCodes.includes('B'), 'Bコースが含まれること');
  assert(courseCodes.includes('C'), 'Cコースが含まれること');
  assert(courseCodes.includes('D'), 'Dコースが含まれること');

  response.body.forEach(course => {
    assertExists(course.baseSalaryMultiplier, `${course.courseCode}コースのbaseSalaryMultiplier`);
  });

  log(`  取得コース数: ${response.body.length}`, 'yellow');
}

async function testAPI03() {
  const requestData = {
    currentCourseCode: 'B',
    requestedCourseCode: 'A',
    changeReason: 'annual',
    reasonDetail: '管理職候補として全面協力型への変更を希望します。',
    requestedEffectiveDate: '2026-04-01',
    attachments: []
  };

  const response = await makeRequest('POST', '/api/career-course/change-request', requestData);

  assertEqual(response.status, 201, 'ステータスコードが201であること');
  assertExists(response.body.id, 'id');
  assertEqual(response.body.approvalStatus, 'pending', 'approvalStatusがpendingであること');
  assertExists(response.body.message, 'message');

  log(`  申請ID: ${response.body.id}`, 'yellow');
  log(`  ステータス: ${response.body.approvalStatus}`, 'yellow');
}

async function testAPI04() {
  const response = await makeRequest('GET', '/api/career-course/my-requests');

  assertEqual(response.status, 200, 'ステータスコードが200であること');
  assert(Array.isArray(response.body), 'レスポンスが配列であること');
  assert(response.body.length >= 3, '申請履歴が3件以上あること');

  const firstRequest = response.body[0];
  assertExists(firstRequest.id, 'id');
  assertExists(firstRequest.approvalStatus, 'approvalStatus');
  assertExists(firstRequest.createdAt, 'createdAt');

  log(`  申請履歴数: ${response.body.length}`, 'yellow');
  log(`  最新申請: ${firstRequest.id} (${firstRequest.approvalStatus})`, 'yellow');
}

// ==================== Phase 2: Webhook通知テスト ====================

async function testWebhook01() {
  const payload = {
    type: 'course_change_approved',
    staffId: 'OH-NS-2021-001',
    requestId: 'req-003',
    approvedCourse: 'A',
    effectiveDate: '2026-04-01',
    reviewComment: '管理職候補として適性を認めます。'
  };

  // 内部APIキーで認証
  const internalApiKey = process.env.INTERNAL_API_KEY || 'internal-secret-key-change-in-production';

  const url = new URL('/api/career-course/notify-voicedrive', BASE_URL);
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${internalApiKey}`,
      'Content-Type': 'application/json'
    }
  };

  const response = await new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: data
          });
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(payload));
    req.end();
  });

  assertEqual(response.status, 200, 'ステータスコードが200であること');
  assertExists(response.body.success, 'success');

  log(`  通知送信結果: ${response.body.success ? '成功' : '失敗'}`, 'yellow');
}

async function testWebhook02() {
  const payload = {
    type: 'course_change_rejected',
    staffId: 'OH-NS-2021-001',
    requestId: 'req-003',
    rejectionReason: '現在の勤務状況から、来年度の変更が望ましいと判断しました。',
    reviewComment: '再度、2027年4月での変更申請をご検討ください。'
  };

  const internalApiKey = process.env.INTERNAL_API_KEY || 'internal-secret-key-change-in-production';

  const url = new URL('/api/career-course/notify-voicedrive', BASE_URL);
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${internalApiKey}`,
      'Content-Type': 'application/json'
    }
  };

  const response = await new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: data
          });
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(payload));
    req.end();
  });

  assertEqual(response.status, 200, 'ステータスコードが200であること');
  assertExists(response.body.success, 'success');

  log(`  通知送信結果: ${response.body.success ? '成功' : '失敗'}`, 'yellow');
}

// ==================== Phase 3: エラーハンドリングテスト ====================

async function testError01() {
  const url = new URL('/api/my-page', BASE_URL);
  const options = {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer invalid-token',
      'Content-Type': 'application/json'
    }
  };

  const response = await new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: data
          });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });

  assertEqual(response.status, 401, 'ステータスコードが401であること');
  log(`  認証エラーが正しく処理されました`, 'yellow');
}

async function testError02() {
  const requestData = {
    // currentCourseCode を意図的に省略
    requestedCourseCode: 'A',
    changeReason: 'annual',
    reasonDetail: 'テスト',
    requestedEffectiveDate: '2026-04-01'
  };

  const response = await makeRequest('POST', '/api/career-course/change-request', requestData);

  assertEqual(response.status, 400, 'ステータスコードが400であること');
  log(`  バリデーションエラーが正しく処理されました`, 'yellow');
}

async function testError03() {
  const requestData = {
    currentCourseCode: 'B',
    requestedCourseCode: 'D',
    changeReason: 'special_pregnancy',  // 特例変更
    reasonDetail: '妊娠のため',
    requestedEffectiveDate: '2026-04-01',
    attachments: []  // 添付ファイルなし（エラーとなるべき）
  };

  const response = await makeRequest('POST', '/api/career-course/change-request', requestData);

  assertEqual(response.status, 400, 'ステータスコードが400であること');
  assert(response.body.error.includes('添付') || response.body.error.includes('証明'),
         '添付ファイルに関するエラーメッセージであること');
  log(`  特例変更の添付ファイルチェックが動作しました`, 'yellow');
}

// ==================== メイン実行 ====================

async function main() {
  console.clear();
  log('Phase 5-3 統合テスト開始', 'cyan');
  log('実行日時: ' + new Date().toLocaleString('ja-JP'), 'cyan');

  // サーバー起動待機
  log('\nサーバー起動を確認中...', 'yellow');
  let serverReady = false;
  let retries = 0;

  while (!serverReady && retries < 10) {
    try {
      await makeRequest('GET', '/api/my-page');
      serverReady = true;
      log('✓ サーバー起動完了', 'green');
    } catch (e) {
      retries++;
      if (retries < 10) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        log('✗ サーバー起動タイムアウト', 'red');
        process.exit(1);
      }
    }
  }

  // Phase 1: API接続テスト
  logSection('Phase 1: API接続テスト');
  await runTest('TC-API-01', 'マイページデータ取得', testAPI01);
  await runTest('TC-API-02', 'コース定義一覧取得', testAPI02);
  await runTest('TC-API-03', 'コース変更申請送信', testAPI03);
  await runTest('TC-API-04', '申請履歴取得', testAPI04);

  // Phase 2: Webhook通知テスト
  logSection('Phase 2: Webhook通知テスト');
  await runTest('TC-WEBHOOK-01', '承認通知送信', testWebhook01);
  await runTest('TC-WEBHOOK-02', '却下通知送信', testWebhook02);

  // Phase 3: エラーハンドリングテスト
  logSection('Phase 3: エラーハンドリングテスト');
  await runTest('TC-ERROR-01', '無効なトークン', testError01);
  await runTest('TC-ERROR-02', '必須項目未入力', testError02);
  await runTest('TC-ERROR-03', '特例変更で添付ファイルなし', testError03);

  // 結果サマリー
  logSection('テスト結果サマリー');
  log(`総テスト数: ${testResults.total}`, 'cyan');
  log(`成功: ${testResults.passed}`, 'green');
  log(`失敗: ${testResults.failed}`, testResults.failed > 0 ? 'red' : 'green');
  log(`成功率: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`,
      testResults.failed === 0 ? 'green' : 'yellow');

  // 失敗したテストの詳細
  if (testResults.failed > 0) {
    console.log('\n--- 失敗したテスト ---');
    testResults.tests
      .filter(t => t.result === 'FAIL')
      .forEach(t => {
        log(`[${t.id}] ${t.name}`, 'red');
        log(`  エラー: ${t.error}`, 'red');
      });
  }

  console.log('\n');

  // テスト結果をファイルに保存
  const fs = require('fs');
  const resultFile = 'tests/integration/phase5-test-results.json';
  fs.writeFileSync(resultFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      total: testResults.total,
      passed: testResults.passed,
      failed: testResults.failed,
      successRate: ((testResults.passed / testResults.total) * 100).toFixed(1) + '%'
    },
    tests: testResults.tests
  }, null, 2));

  log(`テスト結果を保存しました: ${resultFile}`, 'cyan');

  process.exit(testResults.failed === 0 ? 0 : 1);
}

main().catch(error => {
  log(`\nテスト実行エラー: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
