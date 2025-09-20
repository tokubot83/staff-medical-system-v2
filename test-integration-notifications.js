// お知らせ配信機能統合テストスクリプト
// 2025年9月20日 医療システムチーム

const fetch = require('node-fetch');

// テスト環境設定
const VOICEDRIVE_API_URL = 'http://localhost:3002/api';
const VOICEDRIVE_TOKEN = 'test_vd_token_2025_0920';
const MEDICAL_SYSTEM_URL = 'http://localhost:3000';

// テストケース定義
const testCases = {
  // Phase 1: 基本機能テスト
  test1_announcement_normal: {
    name: 'TEST-001: お知らせ配信（通常優先度）',
    data: {
      category: 'announcement',
      priority: 'medium',
      title: '【テスト】システムメンテナンスのお知らせ',
      content: `お疲れ様です。

10月1日（火）22:00～24:00の間、システムメンテナンスを実施いたします。
メンテナンス中はシステムが利用できませんので、ご了承ください。

ご不便をおかけしますが、よろしくお願いいたします。`,
      targetType: 'all',
      targetDepartments: [],
      targetIndividuals: [],
      targetPositions: [],
      scheduledDate: null
    }
  },

  test2_announcement_high: {
    name: 'TEST-002: お知らせ配信（高優先度/緊急）',
    data: {
      category: 'announcement',
      priority: 'high',
      title: '【緊急】院内感染防止対策の強化について',
      content: `緊急連絡です。

本日より、院内感染防止対策を強化いたします。
全職員は以下の対応を徹底してください：

1. マスクの常時着用
2. 手指消毒の徹底
3. 体温測定と記録

詳細は追ってご連絡いたします。`,
      targetType: 'all',
      targetDepartments: [],
      targetIndividuals: [],
      targetPositions: [],
      scheduledDate: null
    }
  },

  test3_interview: {
    name: 'TEST-003: 面談案内配信',
    data: {
      category: 'interview',
      priority: 'medium',
      title: '定期面談のご案内',
      content: `今期の定期面談を実施いたします。

実施期間：10月15日（水）～10月31日（金）
所要時間：30分程度
場所：各部署面談室

面談予約システムからご希望の日時をご予約ください。`,
      targetType: 'departments',
      targetDepartments: ['看護部', '医師'],
      targetIndividuals: [],
      targetPositions: [],
      hasActionButton: true,
      actionButtonType: 'interview_reservation',
      actionButtonLabel: '面談予約する'
    }
  },

  test4_training: {
    name: 'TEST-004: 研修案内配信',
    data: {
      category: 'training',
      priority: 'medium',
      title: '【研修案内】医療安全研修会',
      content: `お疲れ様です。

下記の研修を実施いたしますので、ご案内申し上げます。

【研修概要】
■研修名：医療安全研修会2025秋
■日時：10月20日（月）14:00～16:00
■場所：第1会議室
■対象者：全職員
■定員：50名

【申込期限】
10月10日（金）17:00まで

ご不明な点は人事部までお問い合わせください。`,
      targetType: 'all',
      targetDepartments: [],
      targetIndividuals: [],
      targetPositions: [],
      trainingEnableRegistration: true,
      trainingCapacity: 50,
      trainingRegistrationDeadline: '2025-10-10T17:00:00',
      trainingLocation: '第1会議室',
      trainingDuration: '2時間'
    }
  },

  test5_survey: {
    name: 'TEST-005: アンケート配信（満足度調査）',
    data: {
      category: 'survey',
      surveySubCategory: 'satisfaction',
      priority: 'low',
      title: '【満足度調査】職場環境アンケート',
      content: `お疲れ様です。

職場環境改善のため、満足度調査を実施いたします。

【調査内容】
■現在の職場環境の満足度
■業務内容・負担感
■チームワーク・人間関係
■改善要望

回答期限：10月15日（金）
所要時間：約5分

回答は匿名で取り扱います。率直なご意見をお聞かせください。`,
      targetType: 'all',
      targetDepartments: [],
      targetIndividuals: [],
      targetPositions: [],
      surveyEndDate: '2025-10-15T23:59:59',
      surveyAnonymous: true,
      surveyAllowMultipleResponses: false,
      surveyQuestions: [
        {
          id: 'q1',
          type: 'single',
          title: '現在の職場環境に満足していますか？',
          required: true,
          options: ['非常に満足', '満足', '普通', '不満', '非常に不満']
        },
        {
          id: 'q2',
          type: 'text',
          title: '職場環境の改善点があれば教えてください',
          required: false
        }
      ]
    }
  }
};

// テスト実行関数
async function executeTest(testCase) {
  console.log(`\n========================================`);
  console.log(`実行中: ${testCase.name}`);
  console.log(`========================================`);

  try {
    // VoiceDrive APIにリクエスト送信
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

    const responseData = await response.json();

    // 結果記録
    const result = {
      testName: testCase.name,
      timestamp: new Date().toISOString(),
      status: response.status,
      success: response.status === 200,
      response: responseData,
      responseTime: null // タイミング計測用
    };

    if (result.success) {
      console.log(`✅ 成功: ${testCase.name}`);
      console.log(`   レスポンス:`, responseData);
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

// メイン実行関数
async function runIntegrationTests() {
  console.log(`
╔════════════════════════════════════════╗
║    お知らせ配信機能 統合テスト開始     ║
╠════════════════════════════════════════╣
║  日時: ${new Date().toISOString()}
║  環境: VoiceDrive Test API            ║
║  Phase 1: 基本機能テスト               ║
╚════════════════════════════════════════╝
  `);

  const results = [];

  // Phase 1テスト実行
  for (const [key, testCase] of Object.entries(testCases)) {
    const result = await executeTest(testCase);
    results.push(result);

    // 各テスト間に2秒待機（レート制限対策）
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // 結果サマリー
  console.log(`\n========================================`);
  console.log(`テスト結果サマリー`);
  console.log(`========================================`);

  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  const successRate = (successCount / totalCount * 100).toFixed(1);

  console.log(`成功: ${successCount}/${totalCount} (${successRate}%)`);

  results.forEach(result => {
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} ${result.testName}`);
  });

  // 結果をファイルに保存
  const fs = require('fs');
  const reportPath = `mcp-shared/logs/integration-test-phase1-${Date.now()}.json`;

  fs.writeFileSync(reportPath, JSON.stringify({
    phase: 'Phase 1: 基本機能テスト',
    timestamp: new Date().toISOString(),
    environment: {
      voiceDriveUrl: VOICEDRIVE_API_URL,
      medicalSystemUrl: MEDICAL_SYSTEM_URL
    },
    results: results,
    summary: {
      total: totalCount,
      success: successCount,
      failed: totalCount - successCount,
      successRate: successRate
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
  runIntegrationTests()
    .then(() => {
      console.log('\n✨ Phase 1テスト完了');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ テスト実行エラー:', error);
      process.exit(1);
    });
}

module.exports = { testCases, executeTest, runIntegrationTests };