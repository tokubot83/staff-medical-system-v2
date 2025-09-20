// Phase 3: エラーハンドリングテスト
// 2025年9月20日 医療システムチーム

const fetch = require('node-fetch');

// テスト環境設定
const VOICEDRIVE_API_URL = 'http://localhost:3002/api';
const VALID_TOKEN = 'test_vd_token_2025_0920';
const INVALID_TOKEN = 'invalid_token_xyz';
const EXPIRED_TOKEN = 'expired_token_2024_0101';

// Phase 3-A: 認証エラーテスト
const authErrorTests = {
  test3a_1_invalid_token: {
    name: 'TEST-3A-1: 無効なトークン',
    expectedStatus: 401,
    expectedError: 'Invalid authentication token',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${INVALID_TOKEN}`,
      'X-Request-ID': `test_auth_${Date.now()}_1`,
      'X-Source-System': 'medical-system'
    },
    data: {
      category: 'announcement',
      priority: 'high',
      title: 'テスト通知',
      content: '認証エラーテスト',
      targetType: 'all'
    }
  },

  test3a_2_missing_token: {
    name: 'TEST-3A-2: トークン未送信',
    expectedStatus: 401,
    expectedError: 'Authorization header missing',
    headers: {
      'Content-Type': 'application/json',
      'X-Request-ID': `test_auth_${Date.now()}_2`,
      'X-Source-System': 'medical-system'
    },
    data: {
      category: 'announcement',
      priority: 'high',
      title: 'テスト通知',
      content: '認証ヘッダー欠如テスト',
      targetType: 'all'
    }
  },

  test3a_3_expired_token: {
    name: 'TEST-3A-3: 期限切れトークン',
    expectedStatus: 401,
    expectedError: 'Token has expired',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${EXPIRED_TOKEN}`,
      'X-Request-ID': `test_auth_${Date.now()}_3`,
      'X-Source-System': 'medical-system'
    },
    data: {
      category: 'announcement',
      priority: 'high',
      title: 'テスト通知',
      content: '期限切れトークンテスト',
      targetType: 'all'
    }
  }
};

// Phase 3-B: データバリデーションエラーテスト
const validationErrorTests = {
  test3b_1_invalid_category: {
    name: 'TEST-3B-1: 不正なカテゴリ',
    expectedStatus: 400,
    expectedError: 'Invalid category',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${VALID_TOKEN}`,
      'X-Request-ID': `test_val_${Date.now()}_1`,
      'X-Source-System': 'medical-system'
    },
    data: {
      category: 'invalid_category',
      priority: 'high',
      title: '不正カテゴリテスト',
      content: 'カテゴリバリデーションテスト',
      targetType: 'all'
    }
  },

  test3b_2_missing_required: {
    name: 'TEST-3B-2: 必須項目欠如（title）',
    expectedStatus: 400,
    expectedError: 'Missing required field: title',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${VALID_TOKEN}`,
      'X-Request-ID': `test_val_${Date.now()}_2`,
      'X-Source-System': 'medical-system'
    },
    data: {
      category: 'announcement',
      priority: 'high',
      // title欠如
      content: '必須項目欠如テスト',
      targetType: 'all'
    }
  },

  test3b_3_missing_content: {
    name: 'TEST-3B-3: 必須項目欠如（content）',
    expectedStatus: 400,
    expectedError: 'Missing required field: content',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${VALID_TOKEN}`,
      'X-Request-ID': `test_val_${Date.now()}_3`,
      'X-Source-System': 'medical-system'
    },
    data: {
      category: 'announcement',
      priority: 'high',
      title: 'コンテンツ欠如テスト',
      // content欠如
      targetType: 'all'
    }
  },

  test3b_4_invalid_target_type: {
    name: 'TEST-3B-4: 不正なtargetType',
    expectedStatus: 400,
    expectedError: 'Invalid targetType',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${VALID_TOKEN}`,
      'X-Request-ID': `test_val_${Date.now()}_4`,
      'X-Source-System': 'medical-system'
    },
    data: {
      category: 'announcement',
      priority: 'high',
      title: '不正ターゲットタイプテスト',
      content: 'targetTypeバリデーションテスト',
      targetType: 'invalid_target'
    }
  },

  test3b_5_invalid_priority: {
    name: 'TEST-3B-5: 不正な優先度',
    expectedStatus: 400,
    expectedError: 'Invalid priority',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${VALID_TOKEN}`,
      'X-Request-ID': `test_val_${Date.now()}_5`,
      'X-Source-System': 'medical-system'
    },
    data: {
      category: 'announcement',
      priority: 'super_urgent', // 不正な優先度
      title: '不正優先度テスト',
      content: '優先度バリデーションテスト',
      targetType: 'all'
    }
  }
};

// Phase 3-C: レート制限テスト
const rateLimitTests = {
  test3c_1_rate_limit: {
    name: 'TEST-3C-1: レート制限（100リクエスト/分）',
    expectedStatus: 429,
    expectedError: 'Rate limit exceeded',
    requestCount: 101, // 100を超える
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${VALID_TOKEN}`,
      'X-Source-System': 'medical-system'
    },
    data: {
      category: 'announcement',
      priority: 'low',
      title: 'レート制限テスト',
      content: 'レート制限確認',
      targetType: 'all'
    }
  }
};

// エラーテスト実行関数
async function executeErrorTest(testCase) {
  console.log(`\n========================================`);
  console.log(`実行中: ${testCase.name}`);
  console.log(`========================================`);

  try {
    const startTime = Date.now();

    const response = await fetch(`${VOICEDRIVE_API_URL}/notifications/receive`, {
      method: 'POST',
      headers: testCase.headers,
      body: JSON.stringify(testCase.data)
    });

    const responseTime = Date.now() - startTime;
    const responseData = await response.json();

    const result = {
      testName: testCase.name,
      timestamp: new Date().toISOString(),
      status: response.status,
      expectedStatus: testCase.expectedStatus,
      success: response.status === testCase.expectedStatus,
      expectedError: testCase.expectedError,
      actualError: responseData.error || responseData.message,
      response: responseData,
      responseTime: responseTime
    };

    if (result.success) {
      console.log(`✅ 期待通りのエラー: ${testCase.name}`);
      console.log(`   ステータス: ${response.status} (期待値: ${testCase.expectedStatus})`);
      console.log(`   エラー: ${responseData.error || responseData.message}`);
      console.log(`   応答時間: ${responseTime}ms`);
    } else {
      console.log(`❌ 予期しない結果: ${testCase.name}`);
      console.log(`   期待ステータス: ${testCase.expectedStatus}`);
      console.log(`   実際のステータス: ${response.status}`);
      console.log(`   応答:`, responseData);
    }

    return result;

  } catch (error) {
    console.log(`❌ エラー: ${testCase.name}`);
    console.log(`   詳細:`, error.message);

    return {
      testName: testCase.name,
      timestamp: new Date().toISOString(),
      status: 'error',
      success: false,
      error: error.message
    };
  }
}

// レート制限テスト実行関数
async function executeRateLimitTest(testCase) {
  console.log(`\n========================================`);
  console.log(`実行中: ${testCase.name}`);
  console.log(`========================================`);

  const results = [];
  let rateLimitHit = false;
  let successCount = 0;
  let rateLimitCount = 0;

  console.log(`\n📊 ${testCase.requestCount}リクエストを送信中...`);

  for (let i = 1; i <= testCase.requestCount; i++) {
    try {
      const response = await fetch(`${VOICEDRIVE_API_URL}/notifications/receive`, {
        method: 'POST',
        headers: {
          ...testCase.headers,
          'X-Request-ID': `test_rate_${Date.now()}_${i}`
        },
        body: JSON.stringify(testCase.data)
      });

      const responseData = await response.json();

      if (response.status === 429) {
        rateLimitCount++;
        if (!rateLimitHit) {
          rateLimitHit = true;
          console.log(`\n🚫 レート制限到達: リクエスト #${i}`);
          console.log(`   エラー: ${responseData.error || responseData.message}`);

          // Retry-Afterヘッダーチェック
          const retryAfter = response.headers.get('Retry-After');
          if (retryAfter) {
            console.log(`   Retry-After: ${retryAfter}秒`);
          }
        }
      } else if (response.status === 200) {
        successCount++;
      }

      // 進捗表示
      if (i % 20 === 0 || i === testCase.requestCount) {
        console.log(`   進捗: ${i}/${testCase.requestCount} (成功: ${successCount}, 制限: ${rateLimitCount})`);
      }

    } catch (error) {
      console.log(`   リクエスト #${i} エラー: ${error.message}`);
    }

    // 高速送信（レート制限をトリガーするため）
    if (i < 100) {
      await new Promise(resolve => setTimeout(resolve, 10)); // 10msごと
    }
  }

  const result = {
    testName: testCase.name,
    timestamp: new Date().toISOString(),
    totalRequests: testCase.requestCount,
    successfulRequests: successCount,
    rateLimitedRequests: rateLimitCount,
    rateLimitHit: rateLimitHit,
    success: rateLimitHit,
    expectedStatus: 429,
    message: rateLimitHit
      ? `レート制限正常動作（${rateLimitCount}リクエストが制限）`
      : 'レート制限が発動しませんでした'
  };

  if (result.success) {
    console.log(`\n✅ レート制限テスト成功`);
    console.log(`   成功リクエスト: ${successCount}`);
    console.log(`   制限リクエスト: ${rateLimitCount}`);
  } else {
    console.log(`\n❌ レート制限テスト失敗`);
  }

  return result;
}

// Phase 3実行
async function runPhase3Tests() {
  console.log(`
╔════════════════════════════════════════╗
║     Phase 3: エラーハンドリング        ║
║           統合テスト開始               ║
╠════════════════════════════════════════╣
║  日時: ${new Date().toISOString()}
║  環境: VoiceDrive Test API            ║
╚════════════════════════════════════════╝
  `);

  const results = [];

  // Phase 3-A: 認証エラーテスト
  console.log('\n【Phase 3-A: 認証エラーテスト】');
  console.log('=====================================');

  for (const [key, testCase] of Object.entries(authErrorTests)) {
    const result = await executeErrorTest(testCase);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Phase 3-B: データバリデーションエラーテスト
  console.log('\n【Phase 3-B: データバリデーションエラーテスト】');
  console.log('=====================================');

  for (const [key, testCase] of Object.entries(validationErrorTests)) {
    const result = await executeErrorTest(testCase);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Phase 3-C: レート制限テスト
  console.log('\n【Phase 3-C: レート制限テスト】');
  console.log('=====================================');

  for (const [key, testCase] of Object.entries(rateLimitTests)) {
    const result = await executeRateLimitTest(testCase);
    results.push(result);
  }

  // 結果サマリー
  console.log(`\n========================================`);
  console.log(`Phase 3 テスト結果サマリー`);
  console.log(`========================================`);

  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  const successRate = (successCount / totalCount * 100).toFixed(1);

  console.log(`\n総合結果: ${successCount}/${totalCount} (${successRate}%)`);

  // 認証エラーテスト結果
  console.log(`\n【認証エラーテスト】`);
  const authResults = results.slice(0, 3);
  authResults.forEach(result => {
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} ${result.testName}`);
  });

  // バリデーションエラーテスト結果
  console.log(`\n【データバリデーションテスト】`);
  const validationResults = results.slice(3, 8);
  validationResults.forEach(result => {
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} ${result.testName}`);
  });

  // レート制限テスト結果
  console.log(`\n【レート制限テスト】`);
  const rateLimitResults = results.slice(8, 9);
  rateLimitResults.forEach(result => {
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} ${result.testName}`);
  });

  // レポート保存
  const fs = require('fs');
  const reportPath = `mcp-shared/logs/integration-test-phase3-${Date.now()}.json`;

  fs.writeFileSync(reportPath, JSON.stringify({
    phase: 'Phase 3: エラーハンドリングテスト',
    timestamp: new Date().toISOString(),
    results: results,
    summary: {
      total: totalCount,
      success: successCount,
      failed: totalCount - successCount,
      successRate: successRate,
      authErrorTests: {
        total: 3,
        success: authResults.filter(r => r.success).length
      },
      validationTests: {
        total: 5,
        success: validationResults.filter(r => r.success).length
      },
      rateLimitTests: {
        total: 1,
        success: rateLimitResults.filter(r => r.success).length
      }
    }
  }, null, 2));

  console.log(`\n📄 レポート保存先: ${reportPath}`);

  // 最終メッセージ
  if (successRate === '100.0') {
    console.log('\n🎉 Phase 3エラーハンドリングテスト完全成功！');
    console.log('システムの堅牢性が確認されました。');
  } else {
    console.log(`\n⚠️ Phase 3テスト完了（成功率: ${successRate}%）`);
    console.log('一部のエラーハンドリングに問題がある可能性があります。');
  }
}

// エラーハンドリング
process.on('unhandledRejection', (error) => {
  console.error('未処理のエラー:', error);
  process.exit(1);
});

// テスト実行
if (require.main === module) {
  runPhase3Tests()
    .then(() => {
      console.log('\n✨ Phase 3エラーハンドリングテスト完了');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ テスト実行エラー:', error);
      process.exit(1);
    });
}

module.exports = { authErrorTests, validationErrorTests, rateLimitTests };