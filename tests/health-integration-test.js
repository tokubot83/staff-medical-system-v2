/**
 * 健康データ連携統合テスト
 * VoiceDriveシステムとの連携をテストする
 */

const fs = require('fs');
const path = require('path');

// カラー出力用
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString('ja-JP');
  let color = colors.reset;
  let prefix = 'INFO';

  switch (type) {
    case 'success':
      color = colors.green;
      prefix = '✓ SUCCESS';
      break;
    case 'error':
      color = colors.red;
      prefix = '✗ ERROR';
      break;
    case 'test':
      color = colors.cyan;
      prefix = '▶ TEST';
      break;
    case 'result':
      color = colors.yellow;
      prefix = '◆ RESULT';
      break;
  }

  console.log(`${color}[${timestamp}] ${prefix}:${colors.reset} ${message}`);
}

// テスト用健康データ
const testHealthData = {
  bmi: 26.5,
  bloodPressureSystolic: 145,
  bloodPressureDiastolic: 92,
  ldlCholesterol: 150,
  hdlCholesterol: 38,
  triglycerides: 180,
  bloodGlucose: 115,
  hba1c: 6.2,
  ast: 45,
  alt: 52,
  gammaGtp: 68,
  age: 48,
  gender: 'male',
  smokingStatus: 'current',
  drinkingFrequency: 'regular'
};

// MCP共有フォルダのパス
const MCP_SHARED_PATH = path.join(process.cwd(), 'mcp-shared');
const NOTIFICATIONS_PATH = path.join(MCP_SHARED_PATH, 'notifications');
const REPORTS_PATH = path.join(MCP_SHARED_PATH, 'reports', 'health');
const LOGS_PATH = path.join(MCP_SHARED_PATH, 'logs');

// ディレクトリの初期化
function ensureDirectories() {
  [NOTIFICATIONS_PATH, REPORTS_PATH, LOGS_PATH].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log(`Created directory: ${dir}`, 'success');
    }
  });
}

// 通知データの作成と保存
function createNotification(type, priority, staffId = 'TEST001') {
  const notification = {
    type,
    staffId,
    timestamp: new Date().toISOString(),
    metadata: {
      source: 'staff-medical-system',
      version: '1.0.0',
      priority
    }
  };

  // タイプ別のデータ追加
  switch (type) {
    case 'health_risk_assessment':
      notification.assessment = {
        overallScore: priority === 'urgent' ? 85 : priority === 'high' ? 65 : priority === 'medium' ? 45 : 25,
        overallLevel: priority === 'urgent' ? 'very-high' : priority === 'high' ? 'high' : priority === 'medium' ? 'medium' : 'low',
        highRiskCategories: priority === 'urgent' || priority === 'high' ? [
          { category: '心血管疾患', score: 75, level: 'high' },
          { category: '糖尿病', score: 68, level: 'high' }
        ] : [],
        priorityActions: priority === 'urgent' ? [
          '緊急：循環器内科受診',
          '緊急：血圧管理開始'
        ] : priority === 'high' ? [
          '禁煙外来の受診',
          '減塩食の開始'
        ] : [
          '運動習慣の確立'
        ],
        nextCheckup: priority === 'urgent' ? '1ヶ月後' : priority === 'high' ? '3ヶ月後' : '6ヶ月後'
      };
      notification.recommendations = {
        lifestyle: ['禁煙', 'ストレス管理'],
        diet: ['減塩', '野菜摂取増加'],
        exercise: ['有酸素運動週150分'],
        medicalFollowUp: priority === 'urgent' ? ['専門医受診'] : []
      };
      break;

    case 'reexamination_required':
      notification.data = {
        abnormalItems: ['血圧', 'HbA1c', 'LDLコレステロール'],
        deadline: '2025年10月15日',
        urgency: priority
      };
      break;
  }

  return notification;
}

// テスト1: 通知ファイルの生成
async function testNotificationCreation() {
  log('Test 1: 通知ファイル生成テスト', 'test');

  const priorities = ['urgent', 'high', 'medium', 'low'];
  const results = [];

  for (const priority of priorities) {
    const notification = createNotification('health_risk_assessment', priority, `TEST_${priority.toUpperCase()}_001`);
    const notificationId = `health_notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fileName = `${notificationId}.json`;
    const filePath = path.join(NOTIFICATIONS_PATH, fileName);

    try {
      fs.writeFileSync(filePath, JSON.stringify(notification, null, 2));
      log(`Created ${priority} priority notification: ${fileName}`, 'success');
      results.push({ priority, status: 'success', file: fileName });

      // 通知間隔を空ける
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      log(`Failed to create ${priority} notification: ${error.message}`, 'error');
      results.push({ priority, status: 'failed', error: error.message });
    }
  }

  return results;
}

// テスト2: 通知APIのテスト
async function testNotificationAPI() {
  log('Test 2: 通知API送信テスト', 'test');

  const apiUrl = process.env.API_URL || 'http://localhost:3000';
  const testData = {
    type: 'health_risk_assessment',
    staffId: 'API_TEST_001',
    assessment: {
      overallScore: 65,
      overallLevel: 'high',
      priorityActions: ['禁煙外来の受診', '減塩食の開始']
    }
  };

  try {
    const response = await fetch(`${apiUrl}/api/health/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Source': 'staff-medical-system',
        'X-Test-Mode': 'true'
      },
      body: JSON.stringify(testData)
    });

    if (response.ok) {
      const result = await response.json();
      log(`API test successful: ${JSON.stringify(result)}`, 'success');
      return { status: 'success', result };
    } else {
      const error = await response.text();
      log(`API test failed: ${response.status} - ${error}`, 'error');
      return { status: 'failed', error };
    }
  } catch (error) {
    log(`API connection failed: ${error.message}`, 'error');
    log('Note: APIサーバーが起動していない可能性があります', 'info');
    return { status: 'skipped', reason: 'API not available' };
  }
}

// テスト3: レポート生成テスト
async function testReportGeneration() {
  log('Test 3: レポート生成テスト', 'test');

  const reportData = {
    reportId: `HEALTH_REPORT_TEST_${Date.now()}`,
    type: 'monthly',
    generatedAt: new Date().toISOString(),
    period: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date().toISOString()
    },
    staffInfo: {
      staffId: 'REPORT_TEST_001',
      name: 'テスト太郎',
      department: 'システム開発部',
      facility: 'テスト病院'
    },
    summary: {
      overallHealthScore: 35,
      riskLevel: 'high',
      keyFindings: [
        '複数の健康指標で要注意レベル',
        '心血管疾患リスクが高い状態',
        '血圧が悪化傾向'
      ],
      improvements: ['運動習慣の定着'],
      concerns: ['血圧管理', '体重増加']
    },
    sections: [
      {
        title: '健康状態サマリー',
        type: 'text',
        importance: 'high',
        content: {
          healthScore: 35,
          riskLevel: 'high',
          description: '健康スコアは35点です。早期の対策が必要です。'
        }
      }
    ],
    recommendations: {
      immediate: ['専門医受診', '血圧測定開始'],
      shortTerm: ['減塩食', '有酸素運動'],
      longTerm: ['体重5kg減量', '禁煙']
    },
    nextActions: ['産業医面談予約', '家庭血圧測定開始'],
    metadata: {
      version: '1.0.0',
      generatedBy: 'staff-medical-system',
      format: 'json'
    }
  };

  try {
    // JSONファイルとして保存
    const jsonPath = path.join(REPORTS_PATH, `${reportData.reportId}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(reportData, null, 2));
    log(`Report JSON saved: ${reportData.reportId}.json`, 'success');

    // Markdownファイルとして保存
    const markdownContent = generateMarkdownReport(reportData);
    const mdPath = path.join(REPORTS_PATH, `${reportData.reportId}.md`);
    fs.writeFileSync(mdPath, markdownContent);
    log(`Report Markdown saved: ${reportData.reportId}.md`, 'success');

    return { status: 'success', reportId: reportData.reportId };
  } catch (error) {
    log(`Report generation failed: ${error.message}`, 'error');
    return { status: 'failed', error: error.message };
  }
}

// Markdownレポートの生成
function generateMarkdownReport(report) {
  return `# 健康レポート

**レポートID**: ${report.reportId}
**作成日時**: ${new Date(report.generatedAt).toLocaleString('ja-JP')}
**期間**: ${new Date(report.period.start).toLocaleDateString('ja-JP')} 〜 ${new Date(report.period.end).toLocaleDateString('ja-JP')}

## 職員情報
- **職員ID**: ${report.staffInfo.staffId}
- **氏名**: ${report.staffInfo.name}
- **部署**: ${report.staffInfo.department}
- **施設**: ${report.staffInfo.facility}

## サマリー
- **健康スコア**: ${report.summary.overallHealthScore}点 / 100点
- **リスクレベル**: ${report.summary.riskLevel}

### 主な所見
${report.summary.keyFindings.map(f => `- ${f}`).join('\n')}

### 改善点
${report.summary.improvements.map(i => `- ✅ ${i}`).join('\n')}

### 懸念事項
${report.summary.concerns.map(c => `- ⚠️ ${c}`).join('\n')}

## 推奨事項

### 緊急対応
${report.recommendations.immediate.map(r => `- 🔴 ${r}`).join('\n')}

### 短期目標（1-3ヶ月）
${report.recommendations.shortTerm.map(r => `- 🟡 ${r}`).join('\n')}

### 長期目標（3ヶ月以上）
${report.recommendations.longTerm.map(r => `- 🟢 ${r}`).join('\n')}

## 次のアクション
${report.nextActions.map((action, i) => `${i + 1}. ${action}`).join('\n')}

---
*このレポートは統合テスト用に生成されました*
`;
}

// テスト4: ログ機能のテスト
async function testLogging() {
  log('Test 4: ログ機能テスト', 'test');

  const logFile = path.join(LOGS_PATH, 'health-notifications.log');
  const logEntries = [];

  // テストログエントリの作成
  for (let i = 0; i < 5; i++) {
    logEntries.push({
      notificationId: `test_log_${i}`,
      type: 'health_risk_assessment',
      staffId: `LOG_TEST_${i}`,
      timestamp: new Date().toISOString(),
      priority: ['urgent', 'high', 'medium', 'low', 'low'][i],
      status: 'processed',
      createdAt: new Date().toISOString()
    });
  }

  try {
    fs.writeFileSync(logFile, JSON.stringify(logEntries, null, 2));
    log(`Log file created with ${logEntries.length} entries`, 'success');
    return { status: 'success', entries: logEntries.length };
  } catch (error) {
    log(`Logging test failed: ${error.message}`, 'error');
    return { status: 'failed', error: error.message };
  }
}

// テスト結果のサマリー生成
function generateTestSummary(results) {
  const summaryPath = path.join(MCP_SHARED_PATH, 'docs', 'integration-test-results.md');
  const timestamp = new Date().toLocaleString('ja-JP');

  const summary = `# 健康データ連携 統合テスト結果

**実行日時**: ${timestamp}
**実行環境**: 医療職員管理システム

## テスト結果サマリー

### Test 1: 通知ファイル生成
${results.notification.map(r => `- ${r.priority}: ${r.status === 'success' ? '✅ 成功' : '❌ 失敗'}`).join('\n')}

### Test 2: 通知API送信
- ステータス: ${results.api.status === 'success' ? '✅ 成功' : results.api.status === 'skipped' ? '⏭️ スキップ' : '❌ 失敗'}
${results.api.reason ? `- 理由: ${results.api.reason}` : ''}

### Test 3: レポート生成
- ステータス: ${results.report.status === 'success' ? '✅ 成功' : '❌ 失敗'}
${results.report.reportId ? `- レポートID: ${results.report.reportId}` : ''}

### Test 4: ログ機能
- ステータス: ${results.logging.status === 'success' ? '✅ 成功' : '❌ 失敗'}
${results.logging.entries ? `- ログエントリ数: ${results.logging.entries}` : ''}

## 生成されたファイル

### 通知ファイル
\`\`\`
mcp-shared/notifications/
${results.notification.filter(r => r.status === 'success').map(r => `  - ${r.file}`).join('\n')}
\`\`\`

### レポートファイル
\`\`\`
mcp-shared/reports/health/
${results.report.reportId ? `  - ${results.report.reportId}.json\n  - ${results.report.reportId}.md` : '  なし'}
\`\`\`

### ログファイル
\`\`\`
mcp-shared/logs/
  - health-notifications.log
\`\`\`

## VoiceDriveチームへの確認事項

1. **通知受信確認**
   - 各優先度の通知ファイルが正しく検出されているか
   - 優先度別の処理が適切に動作しているか

2. **レポート表示確認**
   - JSONレポートが正しく読み込めるか
   - Markdownレポートが正しく表示されるか

3. **ログ確認**
   - ログファイルが正しく記録されているか

## 次のステップ

1. VoiceDriveシステム側でファイル監視が動作していることを確認
2. 管理者通知機能のテスト
3. 双方向通信のテスト

---
*このレポートは統合テストによって自動生成されました*
`;

  fs.writeFileSync(summaryPath, summary);
  log(`Test summary saved to: ${summaryPath}`, 'success');
}

// メインテスト実行
async function runIntegrationTests() {
  console.log(`${colors.bright}${colors.cyan}
╔════════════════════════════════════════════════╗
║     健康データ連携 統合テスト開始              ║
╚════════════════════════════════════════════════╝${colors.reset}`);

  // ディレクトリの準備
  ensureDirectories();

  const results = {
    notification: [],
    api: {},
    report: {},
    logging: {}
  };

  try {
    // テスト1: 通知ファイル生成
    results.notification = await testNotificationCreation();
    await new Promise(resolve => setTimeout(resolve, 2000));

    // テスト2: API送信（オプション）
    results.api = await testNotificationAPI();
    await new Promise(resolve => setTimeout(resolve, 2000));

    // テスト3: レポート生成
    results.report = await testReportGeneration();
    await new Promise(resolve => setTimeout(resolve, 2000));

    // テスト4: ログ機能
    results.logging = await testLogging();

    // サマリー生成
    generateTestSummary(results);

    console.log(`${colors.bright}${colors.green}
╔════════════════════════════════════════════════╗
║     統合テスト完了                             ║
╚════════════════════════════════════════════════╝${colors.reset}`);

    // 結果の表示
    log('テスト結果:', 'result');
    console.log(JSON.stringify(results, null, 2));

    log('詳細なレポートは以下を参照:', 'info');
    log('mcp-shared/docs/integration-test-results.md', 'info');

  } catch (error) {
    log(`テスト実行中にエラーが発生しました: ${error.message}`, 'error');
    console.error(error);
  }
}

// 実行
if (require.main === module) {
  runIntegrationTests().catch(console.error);
}

module.exports = {
  runIntegrationTests,
  testNotificationCreation,
  testNotificationAPI,
  testReportGeneration,
  testLogging
};