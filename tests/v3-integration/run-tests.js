// VoiceDrive統合テスト実行スクリプト
// Node.jsで直接実行可能なテストランナー

const http = require('http');
const https = require('https');

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const VOICEDRIVE_API_KEY = process.env.VOICEDRIVE_API_KEY || 'vd_dev_key_12345';

// カラー出力用
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// HTTPリクエストヘルパー
async function makeRequest(path, options = {}) {
  const url = new URL(path, BASE_URL);
  const isHttps = url.protocol === 'https:';
  const client = isHttps ? https : http;
  
  return new Promise((resolve, reject) => {
    const req = client.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${VOICEDRIVE_API_KEY}`,
        ...options.headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

// テストデータ
const testData = {
  validAppeal: {
    employeeId: 'EMP001',
    employeeName: '山田太郎',
    evaluationPeriod: '2025年度上期',
    conversationId: 'conv_test_' + Date.now(),
    appealReason: '技術評価の施設固有項目について再評価を希望します',
    appealDetails: '新規導入した医療機器の操作習得において、他職員への指導実績が評価に反映されていないと考えています。',
    scoreDetails: {
      technical: {
        corporate: 20,
        facility: 15,
        total: 35
      },
      contribution: {
        summerCorporate: 10,
        summerFacility: 8,
        winterCorporate: 0,
        winterFacility: 0,
        total: 18
      },
      overall: 53
    },
    relativeGrade: 'B',
    submittedAt: new Date().toISOString(),
    voiceDriveUserId: 'vd_user_001'
  }
};

let testResults = {
  passed: 0,
  failed: 0,
  errors: []
};

let appealIds = [];

// テスト実行
async function runTests() {
  console.log(`${colors.cyan}╔═══════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║     VoiceDrive統合テスト - V3異議申立システム        ║${colors.reset}`);
  console.log(`${colors.cyan}╚═══════════════════════════════════════════════════════╝${colors.reset}\n`);
  
  console.log(`${colors.blue}設定:${colors.reset}`);
  console.log(`  BASE_URL: ${BASE_URL}`);
  console.log(`  API_KEY: ${VOICEDRIVE_API_KEY.substring(0, 10)}...`);
  console.log('');
  
  // ========== 1. 異議申立フロー全体テスト ==========
  console.log(`${colors.yellow}━━━ 1. 異議申立フロー全体テスト ━━━${colors.reset}`);
  
  // 1.1 正常な異議申立の送信
  try {
    console.log('📝 1.1 正常な異議申立の送信...');
    const response = await makeRequest('/api/v3/appeals/submit', {
      method: 'POST',
      body: testData.validAppeal
    });
    
    if (response.status === 200 && response.data.success) {
      appealIds.push(response.data.appealId);
      console.log(`${colors.green}✅ 成功${colors.reset} - Appeal ID: ${response.data.appealId}`);
      testResults.passed++;
    } else {
      console.log(`${colors.red}❌ 失敗${colors.reset} - Status: ${response.status}`);
      testResults.failed++;
      testResults.errors.push('正常な異議申立送信失敗');
    }
  } catch (error) {
    console.log(`${colors.red}❌ エラー${colors.reset} - ${error.message}`);
    testResults.failed++;
    testResults.errors.push(error.message);
  }
  
  // 1.2 異議申立一覧取得
  try {
    console.log('📋 1.2 異議申立一覧取得...');
    const response = await makeRequest('/api/v3/appeals/list', {
      method: 'GET'
    });
    
    if (response.status === 200 && Array.isArray(response.data.appeals)) {
      console.log(`${colors.green}✅ 成功${colors.reset} - ${response.data.appeals.length}件取得`);
      testResults.passed++;
    } else {
      console.log(`${colors.red}❌ 失敗${colors.reset} - Status: ${response.status}`);
      testResults.failed++;
    }
  } catch (error) {
    console.log(`${colors.red}❌ エラー${colors.reset} - ${error.message}`);
    testResults.failed++;
  }
  
  // 1.3 ステータス更新
  if (appealIds.length > 0) {
    try {
      console.log('🔄 1.3 ステータス更新...');
      const response = await makeRequest('/api/v3/appeals/list', {
        method: 'PATCH',
        body: {
          appealId: appealIds[0],
          status: 'in_review',
          reviewerComment: '技術評価の再確認を開始します'
        }
      });
      
      if (response.status === 200 && response.data.success) {
        console.log(`${colors.green}✅ 成功${colors.reset} - ステータス更新完了`);
        testResults.passed++;
      } else {
        console.log(`${colors.red}❌ 失敗${colors.reset} - Status: ${response.status}`);
        testResults.failed++;
      }
    } catch (error) {
      console.log(`${colors.red}❌ エラー${colors.reset} - ${error.message}`);
      testResults.failed++;
    }
  }
  
  console.log('');
  
  // ========== 2. エラーハンドリング検証 ==========
  console.log(`${colors.yellow}━━━ 2. エラーハンドリング検証 ━━━${colors.reset}`);
  
  // 2.1 認証なしリクエスト
  try {
    console.log('🔒 2.1 認証なしリクエスト拒否テスト...');
    const response = await makeRequest('/api/v3/appeals/submit', {
      method: 'POST',
      headers: { 'Authorization': '' },
      body: testData.validAppeal
    });
    
    if (response.status === 401) {
      console.log(`${colors.green}✅ 成功${colors.reset} - 401エラー正常返却`);
      testResults.passed++;
    } else {
      console.log(`${colors.red}❌ 失敗${colors.reset} - 予期しないステータス: ${response.status}`);
      testResults.failed++;
    }
  } catch (error) {
    console.log(`${colors.red}❌ エラー${colors.reset} - ${error.message}`);
    testResults.failed++;
  }
  
  // 2.2 不正トークン
  try {
    console.log('🔑 2.2 不正トークン拒否テスト...');
    const response = await makeRequest('/api/v3/appeals/submit', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer invalid_token' },
      body: testData.validAppeal
    });
    
    if (response.status === 401) {
      console.log(`${colors.green}✅ 成功${colors.reset} - 不正トークン拒否`);
      testResults.passed++;
    } else {
      console.log(`${colors.red}❌ 失敗${colors.reset} - Status: ${response.status}`);
      testResults.failed++;
    }
  } catch (error) {
    console.log(`${colors.red}❌ エラー${colors.reset} - ${error.message}`);
    testResults.failed++;
  }
  
  // 2.3 必須フィールド欠落
  try {
    console.log('📄 2.3 必須フィールド欠落検証...');
    const response = await makeRequest('/api/v3/appeals/submit', {
      method: 'POST',
      body: { evaluationPeriod: '2025年度上期' }
    });
    
    if (response.status === 400) {
      console.log(`${colors.green}✅ 成功${colors.reset} - バリデーションエラー検出`);
      testResults.passed++;
    } else {
      console.log(`${colors.red}❌ 失敗${colors.reset} - Status: ${response.status}`);
      testResults.failed++;
    }
  } catch (error) {
    console.log(`${colors.red}❌ エラー${colors.reset} - ${error.message}`);
    testResults.failed++;
  }
  
  console.log('');
  
  // ========== 3. パフォーマンステスト ==========
  console.log(`${colors.yellow}━━━ 3. パフォーマンステスト ━━━${colors.reset}`);
  
  // 3.1 レスポンス時間測定
  try {
    console.log('⚡ 3.1 単一リクエストレスポンス時間...');
    const startTime = Date.now();
    
    const response = await makeRequest('/api/v3/appeals/submit', {
      method: 'POST',
      body: {
        ...testData.validAppeal,
        conversationId: 'conv_perf_' + Date.now()
      }
    });
    
    const responseTime = Date.now() - startTime;
    
    if (response.status === 200 && responseTime < 3000) {
      console.log(`${colors.green}✅ 成功${colors.reset} - ${responseTime}ms (< 3000ms)`);
      testResults.passed++;
      if (response.data.appealId) {
        appealIds.push(response.data.appealId);
      }
    } else {
      console.log(`${colors.red}❌ 失敗${colors.reset} - ${responseTime}ms`);
      testResults.failed++;
    }
  } catch (error) {
    console.log(`${colors.red}❌ エラー${colors.reset} - ${error.message}`);
    testResults.failed++;
  }
  
  // 3.2 並行リクエスト
  try {
    console.log('🚀 3.2 並行リクエスト処理（5件）...');
    const startTime = Date.now();
    const promises = [];
    
    for (let i = 0; i < 5; i++) {
      promises.push(
        makeRequest('/api/v3/appeals/submit', {
          method: 'POST',
          body: {
            ...testData.validAppeal,
            employeeId: `EMP_CONCURRENT_${i}`,
            conversationId: `conv_concurrent_${Date.now()}_${i}`
          }
        })
      );
    }
    
    const results = await Promise.all(promises);
    const responseTime = Date.now() - startTime;
    const allSuccess = results.every(r => r.status === 200);
    
    if (allSuccess && responseTime < 5000) {
      console.log(`${colors.green}✅ 成功${colors.reset} - 5件並行処理 ${responseTime}ms`);
      testResults.passed++;
    } else {
      console.log(`${colors.red}❌ 失敗${colors.reset} - ${responseTime}ms`);
      testResults.failed++;
    }
  } catch (error) {
    console.log(`${colors.red}❌ エラー${colors.reset} - ${error.message}`);
    testResults.failed++;
  }
  
  console.log('');
  
  // ========== テスト結果サマリー ==========
  console.log(`${colors.cyan}╔═══════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║                    テスト結果サマリー                  ║${colors.reset}`);
  console.log(`${colors.cyan}╚═══════════════════════════════════════════════════════╝${colors.reset}\n`);
  
  const total = testResults.passed + testResults.failed;
  const passRate = total > 0 ? Math.round((testResults.passed / total) * 100) : 0;
  
  console.log(`${colors.green}✅ 成功: ${testResults.passed}件${colors.reset}`);
  console.log(`${colors.red}❌ 失敗: ${testResults.failed}件${colors.reset}`);
  console.log(`📊 成功率: ${passRate}%`);
  
  if (testResults.errors.length > 0) {
    console.log(`\n${colors.red}エラー詳細:${colors.reset}`);
    testResults.errors.forEach((error, i) => {
      console.log(`  ${i + 1}. ${error}`);
    });
  }
  
  if (appealIds.length > 0) {
    console.log(`\n${colors.blue}作成された異議申立ID:${colors.reset}`);
    appealIds.forEach(id => {
      console.log(`  - ${id}`);
    });
  }
  
  console.log('\n' + '═'.repeat(60));
  console.log(`テスト完了時刻: ${new Date().toLocaleString('ja-JP')}`);
  console.log('═'.repeat(60));
  
  // Exit code
  process.exit(testResults.failed > 0 ? 1 : 0);
}

// サーバー起動確認とテスト実行
async function checkServerAndRun() {
  console.log(`${colors.blue}サーバー接続確認中...${colors.reset}`);
  
  try {
    const response = await makeRequest('/api/health', { 
      method: 'GET',
      headers: {} 
    });
    
    console.log(`${colors.green}サーバー接続成功${colors.reset}\n`);
    await runTests();
  } catch (error) {
    console.log(`${colors.red}サーバーに接続できません${colors.reset}`);
    console.log(`URL: ${BASE_URL}`);
    console.log(`エラー: ${error.message}`);
    console.log('\nサーバーが起動していることを確認してください:');
    console.log('  npm run dev');
    process.exit(1);
  }
}

// 実行
checkServerAndRun();