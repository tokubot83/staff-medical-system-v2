/**
 * 実職員データ検証テスト
 * Phase 3 Week 2 準備 - 小原病院実証実験対応
 *
 * 実際の職員シナリオでの権限レベル計算・Webhook通知テスト
 */

const http = require('http');

// 小原病院実職員シナリオデータ
const REAL_SCENARIOS = [
  {
    scenario: '新人看護師の成長パターン',
    description: '入職から1年間の権限レベル変化',
    staffId: 'STAFF001',
    expectedLevel: 1.0,
    testCases: [
      {
        month: '入職時(4月)',
        experienceYears: 0.0,
        canPerformLeaderDuty: false,
        expectedLevel: 1.0,
        voiceActivity: '少なめ（慣れるまで）'
      },
      {
        month: '6ヶ月後(10月)',
        experienceYears: 0.5,
        canPerformLeaderDuty: false,
        expectedLevel: 1.0,
        voiceActivity: '改善提案開始'
      }
    ]
  },
  {
    scenario: 'リーダー昇格パターン',
    description: '若手看護師のリーダー昇格シナリオ',
    staffId: 'STAFF004',
    expectedLevel: 2.5,
    testCases: [
      {
        month: '昇格前',
        experienceYears: 2.5,
        canPerformLeaderDuty: false,
        expectedLevel: 2.0,
        voiceActivity: '積極的な提案'
      },
      {
        month: '昇格後',
        experienceYears: 2.5,
        canPerformLeaderDuty: true,
        expectedLevel: 2.5,
        voiceActivity: 'チーム課題の提案'
      }
    ]
  },
  {
    scenario: '中堅看護師の専門性向上',
    description: '経験豊富な看護師の権限レベル',
    staffId: 'STAFF005',
    expectedLevel: 3.5,
    testCases: [
      {
        month: '現在',
        experienceYears: 6.5,
        canPerformLeaderDuty: true,
        expectedLevel: 3.5,
        voiceActivity: 'プリセプター業務改善'
      }
    ]
  },
  {
    scenario: '管理職への昇進',
    description: 'スタッフから管理職への昇進パターン',
    staffId: 'STAFF007',
    expectedLevel: 5.0,
    testCases: [
      {
        month: '副主任就任',
        position: '副主任',
        experienceYears: 13.5,
        expectedLevel: 5.0,
        voiceActivity: '部署全体の改善提案'
      }
    ]
  },
  {
    scenario: '師長レベルの権限',
    description: '看護師長の高権限での活動',
    staffId: 'STAFF009',
    expectedLevel: 8.0,
    testCases: [
      {
        month: '師長就任',
        position: '師長',
        experienceYears: 20.5,
        expectedLevel: 8.0,
        voiceActivity: '施設レベルの政策提案'
      }
    ]
  },
  {
    scenario: '法人本部戦略企画',
    description: '最高権限での戦略的提案',
    staffId: 'STAFF010',
    expectedLevel: 16.0,
    testCases: [
      {
        month: '現在',
        position: '戦略企画部門員',
        experienceYears: 25.5,
        expectedLevel: 16.0,
        voiceActivity: '法人全体の戦略提案'
      }
    ]
  }
];

// VoiceDrive議題レベル判定
function getExpectedAgendaLevel(permissionLevel) {
  if (permissionLevel >= 16) return '法人議題レベル（600点以上で法人理事会提出）';
  if (permissionLevel >= 8) return '施設議題レベル（100点以上で委員会提出可能）';
  if (permissionLevel >= 5) return '部署議題レベル（50点以上で部署課題として扱われます）';
  if (permissionLevel >= 3) return '部署検討レベル（30点以上で部署内検討対象）';
  return '検討中レベル（まずは関係者から意見を集めます）';
}

// API権限レベル取得
function testStaffPermission(staffId) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({ staffId });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/calculate-level',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test_token_12345',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 5000
    };

    const startTime = Date.now();
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        try {
          const parsed = JSON.parse(data);
          resolve({
            success: true,
            responseTime,
            statusCode: res.statusCode,
            data: parsed
          });
        } catch (e) {
          resolve({
            success: false,
            responseTime,
            error: 'JSON Parse Error'
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({
        success: false,
        responseTime: Date.now() - startTime,
        error: error.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        success: false,
        responseTime: 5000,
        error: 'Timeout'
      });
    });

    req.write(postData);
    req.end();
  });
}

// Webhook提案作成シミュレーション
function simulateProposalCreation(staffId, permissionLevel, scenario) {
  return new Promise((resolve) => {
    const proposalTitles = {
      1.0: '休憩室の清掃改善について',
      1.5: '新人研修スケジュールの見直し',
      2.0: '患者さんへの説明方法改善',
      2.5: 'チーム内連携の効率化',
      3.5: 'プリセプター制度の改善提案',
      4.5: 'ベテラン職員の知識共有システム',
      5.0: '部署全体のワークフロー改善',
      6.0: '主任業務の効率化',
      8.0: '看護部全体の業務改善',
      16.0: '法人全体の人材育成戦略'
    };

    const testData = {
      event: 'proposal.created',
      timestamp: new Date().toISOString(),
      data: {
        proposalId: `REAL_PROP_${staffId}_${Date.now()}`,
        title: proposalTitles[permissionLevel] || '業務改善提案',
        submittedBy: staffId,
        department: '看護部',
        permissionLevel: permissionLevel,
        expectedAgendaLevel: getExpectedAgendaLevel(permissionLevel)
      }
    };

    const postData = JSON.stringify(testData);

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/webhook/voicedrive',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 5000
    };

    const startTime = Date.now();
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        try {
          const parsed = JSON.parse(data);
          resolve({
            success: true,
            responseTime,
            statusCode: res.statusCode,
            data: parsed,
            proposalData: testData.data
          });
        } catch (e) {
          resolve({
            success: false,
            responseTime,
            error: 'JSON Parse Error'
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({
        success: false,
        responseTime: Date.now() - startTime,
        error: error.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        success: false,
        responseTime: 5000,
        error: 'Timeout'
      });
    });

    req.write(postData);
    req.end();
  });
}

// シナリオテスト実行
async function runScenarioTest(scenario) {
  console.log(`\n📋 シナリオ: ${scenario.scenario}`);
  console.log(`   ${scenario.description}`);
  console.log(`   対象職員: ${scenario.staffId}`);

  // 権限レベル取得
  const permissionResult = await testStaffPermission(scenario.staffId);

  if (!permissionResult.success) {
    console.log(`   ❌ 権限レベル取得失敗: ${permissionResult.error}`);
    return { success: false, scenario: scenario.scenario };
  }

  const actualLevel = permissionResult.data.accountLevel;
  const expectedLevel = scenario.expectedLevel;

  console.log(`   📊 権限レベル: ${actualLevel} (期待値: ${expectedLevel})`);
  console.log(`   ⏱️  API応答時間: ${permissionResult.responseTime}ms`);

  // レベル一致確認
  const levelMatch = actualLevel === expectedLevel;
  console.log(`   ${levelMatch ? '✅' : '❌'} レベル判定: ${levelMatch ? '正確' : '不一致'}`);

  // 議題レベル判定
  const agendaLevel = getExpectedAgendaLevel(actualLevel);
  console.log(`   🎯 期待される議題レベル: ${agendaLevel}`);

  // Webhook提案作成シミュレーション
  const proposalResult = await simulateProposalCreation(scenario.staffId, actualLevel, scenario.scenario);

  if (!proposalResult.success) {
    console.log(`   ❌ 提案作成シミュレーション失敗: ${proposalResult.error}`);
    return { success: false, scenario: scenario.scenario };
  }

  console.log(`   📝 提案作成成功: "${proposalResult.proposalData.title}"`);
  console.log(`   📡 Webhook応答時間: ${proposalResult.responseTime}ms`);
  console.log(`   🆔 提案ID: ${proposalResult.proposalData.proposalId}`);

  // テストケース詳細
  for (const testCase of scenario.testCases) {
    console.log(`   📅 ${testCase.month}:`);
    console.log(`      - 経験年数: ${testCase.experienceYears}年`);
    if (testCase.position) {
      console.log(`      - 役職: ${testCase.position}`);
    }
    console.log(`      - リーダー業務: ${testCase.canPerformLeaderDuty ? '可能' : '不可'}`);
    console.log(`      - 期待レベル: ${testCase.expectedLevel}`);
    console.log(`      - 活動内容: ${testCase.voiceActivity}`);
  }

  return {
    success: true,
    scenario: scenario.scenario,
    actualLevel,
    expectedLevel,
    levelMatch,
    apiResponseTime: permissionResult.responseTime,
    webhookResponseTime: proposalResult.responseTime,
    proposalId: proposalResult.proposalData.proposalId
  };
}

// メイン実行
async function main() {
  console.log('🏥 小原病院実証実験対応 - 実職員データ検証テスト');
  console.log('📅 Phase 3 Week 2 準備');
  console.log('');
  console.log('🎯 検証目的:');
  console.log('   - 実職員シナリオでの権限レベル計算精度');
  console.log('   - VoiceDrive議題レベル判定の適切性');
  console.log('   - 職員成長パターンでの権限変化対応');
  console.log('   - 各職階での提案内容の妥当性');
  console.log('');

  const startTime = Date.now();
  const results = [];

  // 全シナリオ実行
  for (const scenario of REAL_SCENARIOS) {
    const result = await runScenarioTest(scenario);
    results.push(result);

    // 少し間隔を空ける
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  const endTime = Date.now();
  const totalDuration = endTime - startTime;

  // 結果サマリー
  console.log('\n');
  console.log('📊 実職員データ検証結果サマリー');
  console.log('='.repeat(50));

  const successCount = results.filter(r => r.success).length;
  const levelMatchCount = results.filter(r => r.success && r.levelMatch).length;

  console.log(`テスト時間: ${(totalDuration / 1000).toFixed(2)}秒`);
  console.log(`実行シナリオ数: ${REAL_SCENARIOS.length}`);
  console.log(`成功したシナリオ: ${successCount}/${REAL_SCENARIOS.length}`);
  console.log(`レベル判定正確性: ${levelMatchCount}/${successCount}`);

  // パフォーマンス統計
  const successResults = results.filter(r => r.success);
  if (successResults.length > 0) {
    const apiTimes = successResults.map(r => r.apiResponseTime);
    const webhookTimes = successResults.map(r => r.webhookResponseTime);

    const apiAvg = apiTimes.reduce((a, b) => a + b, 0) / apiTimes.length;
    const webhookAvg = webhookTimes.reduce((a, b) => a + b, 0) / webhookTimes.length;

    console.log('');
    console.log('⚡ パフォーマンス統計:');
    console.log(`API平均応答時間: ${Math.round(apiAvg)}ms`);
    console.log(`Webhook平均応答時間: ${Math.round(webhookAvg)}ms`);
    console.log(`API最大応答時間: ${Math.max(...apiTimes)}ms`);
    console.log(`Webhook最大応答時間: ${Math.max(...webhookTimes)}ms`);
  }

  // 詳細結果
  console.log('');
  console.log('📝 シナリオ別結果詳細:');
  console.log('-'.repeat(50));
  for (const result of results) {
    if (result.success) {
      console.log(`✅ ${result.scenario}`);
      console.log(`   権限レベル: ${result.actualLevel} ${result.levelMatch ? '(正確)' : '(不一致)'}、API: ${result.apiResponseTime}ms、Webhook: ${result.webhookResponseTime}ms`);
    } else {
      console.log(`❌ ${result.scenario}: テスト失敗`);
    }
  }

  // 小原病院実証実験準備状況
  console.log('');
  console.log('🏥 小原病院実証実験準備状況');
  console.log('='.repeat(50));

  const readinessChecks = [
    { item: '新人看護師対応', passed: results.some(r => r.scenario.includes('新人') && r.success && r.levelMatch) },
    { item: 'リーダー昇格対応', passed: results.some(r => r.scenario.includes('リーダー') && r.success && r.levelMatch) },
    { item: '中堅職員対応', passed: results.some(r => r.scenario.includes('中堅') && r.success && r.levelMatch) },
    { item: '管理職対応', passed: results.some(r => r.scenario.includes('管理職') && r.success && r.levelMatch) },
    { item: '師長レベル対応', passed: results.some(r => r.scenario.includes('師長') && r.success && r.levelMatch) },
    { item: '法人本部対応', passed: results.some(r => r.scenario.includes('法人') && r.success && r.levelMatch) },
    { item: 'API性能要件', passed: successResults.every(r => r.apiResponseTime <= 100) },
    { item: 'Webhook性能要件', passed: successResults.every(r => r.webhookResponseTime <= 500) }
  ];

  for (const check of readinessChecks) {
    console.log(`${check.passed ? '✅' : '❌'} ${check.item}: ${check.passed ? '準備完了' : '要対応'}`);
  }

  const allPassed = readinessChecks.every(c => c.passed);

  console.log('');
  if (allPassed) {
    console.log('🎉 小原病院実証実験準備完了！');
    console.log('   全職員パターンでの動作確認済み');
    console.log('   実証実験（95名対象）の開始準備が整いました');
  } else {
    console.log('⚠️  実証実験準備に課題があります');
    console.log('   失敗した項目の修正が必要です');
  }
}

// 実行
main().catch(console.error);