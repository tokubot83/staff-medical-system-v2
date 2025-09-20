// Phase 2: サブカテゴリ・配信対象テスト
// 2025年9月20日 医療システムチーム

const fetch = require('node-fetch');

// テスト環境設定
const VOICEDRIVE_API_URL = 'http://localhost:3002/api';
const VOICEDRIVE_TOKEN = 'test_vd_token_2025_0920';

// Phase 2-A: アンケートサブカテゴリテスト（7種類）
const surveySubCategoryTests = {
  test2a_1_satisfaction: {
    name: 'TEST-2A-1: 満足度調査',
    data: {
      category: 'survey',
      surveySubCategory: 'satisfaction',
      priority: 'medium',
      title: '【満足度調査】職場環境アンケート',
      content: '職場環境改善のため、満足度調査を実施いたします。',
      targetType: 'all',
      targetDepartments: [],
      surveyEndDate: '2025-10-15T23:59:59',
      surveyAnonymous: true,
      surveyQuestions: [
        {
          id: 'q1',
          type: 'single',
          title: '現在の職場環境に満足していますか？',
          required: true,
          options: ['非常に満足', '満足', '普通', '不満', '非常に不満']
        }
      ]
    }
  },

  test2a_2_workenv: {
    name: 'TEST-2A-2: 職場環境調査',
    data: {
      category: 'survey',
      surveySubCategory: 'workenv',
      priority: 'medium',
      title: '【職場環境調査】働き方に関するアンケート',
      content: 'より良い職場環境づくりのため、アンケートを実施いたします。',
      targetType: 'departments',
      targetDepartments: ['看護部'],
      surveyEndDate: '2025-10-20T23:59:59',
      surveyAnonymous: true,
      surveyQuestions: [
        {
          id: 'q1',
          type: 'multiple',
          title: '改善を希望する項目を選択してください',
          required: true,
          options: ['勤務時間', '休暇取得', '設備', '安全管理']
        }
      ]
    }
  },

  test2a_3_education: {
    name: 'TEST-2A-3: 教育・研修調査',
    data: {
      category: 'survey',
      surveySubCategory: 'education',
      priority: 'low',
      title: '【研修・教育】スキルアップニーズ調査',
      content: '来年度の研修計画策定に向けて、スキルアップニーズ調査を実施いたします。',
      targetType: 'all',
      targetDepartments: [],
      surveyEndDate: '2025-10-25T23:59:59',
      surveyAnonymous: false,
      surveyQuestions: [
        {
          id: 'q1',
          type: 'text',
          title: '希望する研修テーマを教えてください',
          required: false
        }
      ]
    }
  },

  test2a_4_welfare: {
    name: 'TEST-2A-4: 福利厚生調査',
    data: {
      category: 'survey',
      surveySubCategory: 'welfare',
      priority: 'low',
      title: '【福利厚生】制度利用状況アンケート',
      content: '福利厚生制度の充実のため、利用状況アンケートを実施いたします。',
      targetType: 'all',
      targetDepartments: [],
      surveyEndDate: '2025-10-30T23:59:59',
      surveyAnonymous: true,
      surveyQuestions: [
        {
          id: 'q1',
          type: 'single',
          title: '最もよく利用する福利厚生制度は？',
          required: true,
          options: ['健康診断', '保養施設', '食堂補助', 'その他']
        }
      ]
    }
  },

  test2a_5_system: {
    name: 'TEST-2A-5: システム改善調査',
    data: {
      category: 'survey',
      surveySubCategory: 'system',
      priority: 'medium',
      title: '【システム改善】ITツール利用状況調査',
      content: '業務システム改善のため、ITツールの利用状況を調査いたします。',
      targetType: 'departments',
      targetDepartments: ['事務部', '医療安全管理室'],
      surveyEndDate: '2025-11-01T23:59:59',
      surveyAnonymous: false,
      surveyQuestions: [
        {
          id: 'q1',
          type: 'number',
          title: '1日あたりのシステム利用時間（時間）',
          required: true
        }
      ]
    }
  },

  test2a_6_event: {
    name: 'TEST-2A-6: イベント企画調査',
    data: {
      category: 'survey',
      surveySubCategory: 'event',
      priority: 'low',
      title: '【イベント企画】参加希望調査',
      content: '職場交流イベントの企画にあたり、参加希望をお伺いします。',
      targetType: 'positions',
      targetPositions: ['主任', '師長'],
      surveyEndDate: '2025-11-05T23:59:59',
      surveyAnonymous: false,
      surveyQuestions: [
        {
          id: 'q1',
          type: 'date',
          title: '参加可能な日程を選択してください',
          required: true
        }
      ]
    }
  },

  test2a_7_other: {
    name: 'TEST-2A-7: その他のアンケート',
    data: {
      category: 'survey',
      surveySubCategory: 'other',
      priority: 'medium',
      title: '【アンケートご協力のお願い】',
      content: '下記のアンケートにご協力をお願いいたします。',
      targetType: 'individuals',
      targetIndividuals: ['EMP001', 'EMP002', 'EMP003'],
      surveyEndDate: '2025-11-10T23:59:59',
      surveyAnonymous: true,
      surveyQuestions: [
        {
          id: 'q1',
          type: 'scale',
          title: '総合満足度を5段階で評価してください',
          required: true,
          scaleMin: 1,
          scaleMax: 5,
          scaleMinLabel: '不満',
          scaleMaxLabel: '満足'
        }
      ]
    }
  }
};

// Phase 2-B: 配信対象パターンテスト
const targetPatternTests = {
  test2b_1_all: {
    name: 'TEST-2B-1: 全職員配信',
    data: {
      category: 'announcement',
      priority: 'high',
      title: '【全職員】重要なお知らせ',
      content: '全職員を対象とした重要なお知らせです。',
      targetType: 'all',
      targetDepartments: [],
      targetIndividuals: [],
      targetPositions: []
    }
  },

  test2b_2_departments: {
    name: 'TEST-2B-2: 複数部署配信',
    data: {
      category: 'announcement',
      priority: 'medium',
      title: '【部署連絡】合同会議のお知らせ',
      content: '関係部署合同会議を開催いたします。',
      targetType: 'departments',
      targetDepartments: ['看護部', '薬剤科', 'リハビリテーション科'],
      targetIndividuals: [],
      targetPositions: []
    }
  },

  test2b_3_individuals: {
    name: 'TEST-2B-3: 個人選択配信（5名）',
    data: {
      category: 'interview',
      priority: 'high',
      title: '【個別面談】緊急面談のご案内',
      content: '個別に面談を実施させていただきます。',
      targetType: 'individuals',
      targetDepartments: [],
      targetIndividuals: ['EMP001', 'EMP002', 'EMP003', 'EMP004', 'EMP005'],
      targetPositions: []
    }
  },

  test2b_4_positions: {
    name: 'TEST-2B-4: 役職別配信（管理職）',
    data: {
      category: 'training',
      priority: 'high',
      title: '【管理職研修】リーダーシップ研修',
      content: '管理職を対象としたリーダーシップ研修を開催します。',
      targetType: 'positions',
      targetDepartments: [],
      targetIndividuals: [],
      targetPositions: ['部長', '課長', '科長', '師長', '副師長']
    }
  }
};

// テスト実行関数
async function executeTest(testCase) {
  console.log(`\n========================================`);
  console.log(`実行中: ${testCase.name}`);
  console.log(`========================================`);

  try {
    const startTime = Date.now();

    const response = await fetch(`${VOICEDRIVE_API_URL}/notifications/receive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${VOICEDRIVE_TOKEN}`,
        'X-Request-ID': `test_${Date.now()}`,
        'X-Source-System': 'medical-system'
      },
      body: JSON.stringify(testCase.data)
    });

    const responseTime = Date.now() - startTime;
    const responseData = await response.json();

    const result = {
      testName: testCase.name,
      timestamp: new Date().toISOString(),
      status: response.status,
      success: response.status === 200,
      response: responseData,
      responseTime: responseTime,
      testData: {
        category: testCase.data.category,
        subCategory: testCase.data.surveySubCategory,
        targetType: testCase.data.targetType,
        targetCount: testCase.data.targetDepartments?.length ||
                    testCase.data.targetIndividuals?.length ||
                    testCase.data.targetPositions?.length ||
                    'all'
      }
    };

    if (result.success) {
      console.log(`✅ 成功: ${testCase.name}`);
      console.log(`   カテゴリ: ${testCase.data.category}${testCase.data.surveySubCategory ? `/${testCase.data.surveySubCategory}` : ''}`);
      console.log(`   対象: ${testCase.data.targetType}`);
      console.log(`   応答時間: ${responseTime}ms`);
    } else {
      console.log(`❌ 失敗: ${testCase.name}`);
      console.log(`   ステータス: ${response.status}`);
      console.log(`   エラー:`, responseData);
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

// Phase 2実行
async function runPhase2Tests() {
  console.log(`
╔════════════════════════════════════════╗
║    Phase 2: サブカテゴリ・配信対象    ║
║           統合テスト開始               ║
╠════════════════════════════════════════╣
║  日時: ${new Date().toISOString()}
║  環境: VoiceDrive Test API            ║
╚════════════════════════════════════════╝
  `);

  const results = [];

  // Phase 2-A: アンケートサブカテゴリテスト
  console.log('\n【Phase 2-A: アンケートサブカテゴリテスト】');
  console.log('=====================================');

  for (const [key, testCase] of Object.entries(surveySubCategoryTests)) {
    const result = await executeTest(testCase);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Phase 2-B: 配信対象パターンテスト
  console.log('\n【Phase 2-B: 配信対象パターンテスト】');
  console.log('=====================================');

  for (const [key, testCase] of Object.entries(targetPatternTests)) {
    const result = await executeTest(testCase);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // 結果サマリー
  console.log(`\n========================================`);
  console.log(`Phase 2 テスト結果サマリー`);
  console.log(`========================================`);

  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  const successRate = (successCount / totalCount * 100).toFixed(1);

  console.log(`\n総合結果: ${successCount}/${totalCount} (${successRate}%)`);

  // サブカテゴリテスト結果
  console.log(`\n【アンケートサブカテゴリ】`);
  const subCategoryResults = results.slice(0, 7);
  subCategoryResults.forEach(result => {
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} ${result.testName}`);
  });

  // 配信対象テスト結果
  console.log(`\n【配信対象パターン】`);
  const targetResults = results.slice(7, 11);
  targetResults.forEach(result => {
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} ${result.testName}`);
  });

  // パフォーマンス統計
  const avgResponseTime = results
    .filter(r => r.responseTime)
    .reduce((sum, r) => sum + r.responseTime, 0) / results.filter(r => r.responseTime).length;

  console.log(`\n【パフォーマンス】`);
  console.log(`平均応答時間: ${avgResponseTime.toFixed(0)}ms`);

  // レポート保存
  const fs = require('fs');
  const reportPath = `mcp-shared/logs/integration-test-phase2-${Date.now()}.json`;

  fs.writeFileSync(reportPath, JSON.stringify({
    phase: 'Phase 2: サブカテゴリ・配信対象テスト',
    timestamp: new Date().toISOString(),
    results: results,
    summary: {
      total: totalCount,
      success: successCount,
      failed: totalCount - successCount,
      successRate: successRate,
      avgResponseTime: avgResponseTime,
      subCategoryTests: {
        total: 7,
        success: subCategoryResults.filter(r => r.success).length
      },
      targetPatternTests: {
        total: 4,
        success: targetResults.filter(r => r.success).length
      }
    }
  }, null, 2));

  console.log(`\n📄 レポート保存先: ${reportPath}`);
}

// エラーハンドリング
process.on('unhandledRejection', (error) => {
  console.error('未処理のエラー:', error);
  process.exit(1);
});

// テスト実行
if (require.main === module) {
  runPhase2Tests()
    .then(() => {
      console.log('\n✨ Phase 2テスト完了');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ テスト実行エラー:', error);
      process.exit(1);
    });
}

module.exports = { surveySubCategoryTests, targetPatternTests, executeTest };