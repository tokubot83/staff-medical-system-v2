/**
 * 健康レポート自動生成システム
 * 定期的な健康レポートの自動生成と送信
 */

import { OverallRiskAssessment, HealthData } from './risk-assessment';

export interface HealthReport {
  reportId: string;
  type: 'monthly' | 'quarterly' | 'annual' | 'alert';
  generatedAt: string;
  period: {
    start: string;
    end: string;
  };
  staffInfo: {
    staffId: string;
    name: string;
    department: string;
    facility: string;
  };
  summary: {
    overallHealthScore: number;
    riskLevel: string;
    keyFindings: string[];
    improvements: string[];
    concerns: string[];
  };
  sections: ReportSection[];
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  nextActions: string[];
  metadata: {
    version: string;
    generatedBy: string;
    format: 'html' | 'pdf' | 'markdown';
  };
}

export interface ReportSection {
  title: string;
  type: 'text' | 'chart' | 'table' | 'alert';
  content: any;
  importance: 'low' | 'medium' | 'high' | 'critical';
}

interface HealthTrend {
  metric: string;
  current: number;
  previous: number;
  change: number;
  trend: 'improving' | 'stable' | 'worsening';
}

/**
 * 月次健康レポートの生成
 */
export function generateMonthlyHealthReport(
  staffInfo: any,
  currentData: HealthData,
  previousData: HealthData | null,
  assessment: OverallRiskAssessment
): HealthReport {
  const reportId = `HEALTH_REPORT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // 健康トレンドの分析
  const trends = analyzeHealthTrends(currentData, previousData);

  // キーファインディングスの生成
  const keyFindings = generateKeyFindings(assessment, trends);

  // 改善点と懸念事項の特定
  const improvements = identifyImprovements(trends);
  const concerns = identifyConcerns(assessment, trends);

  // レポートセクションの生成
  const sections: ReportSection[] = [
    generateSummarySection(assessment, trends),
    generateRiskAssessmentSection(assessment),
    generateTrendsSection(trends),
    generateRecommendationsSection(assessment),
    generateActionPlanSection(assessment, staffInfo)
  ];

  return {
    reportId,
    type: 'monthly',
    generatedAt: now.toISOString(),
    period: {
      start: lastMonth.toISOString(),
      end: now.toISOString()
    },
    staffInfo,
    summary: {
      overallHealthScore: 100 - assessment.overallScore,
      riskLevel: assessment.overallLevel,
      keyFindings,
      improvements,
      concerns
    },
    sections,
    recommendations: categorizeRecommendations(assessment),
    nextActions: generateNextActions(assessment, concerns),
    metadata: {
      version: '1.0.0',
      generatedBy: 'staff-medical-system',
      format: 'markdown'
    }
  };
}

/**
 * 健康トレンドの分析
 */
function analyzeHealthTrends(
  current: HealthData,
  previous: HealthData | null
): HealthTrend[] {
  if (!previous) {
    return [];
  }

  const trends: HealthTrend[] = [];

  // BMIトレンド
  if (current.bmi && previous.bmi) {
    const change = ((current.bmi - previous.bmi) / previous.bmi) * 100;
    trends.push({
      metric: 'BMI',
      current: current.bmi,
      previous: previous.bmi,
      change,
      trend: Math.abs(change) < 2 ? 'stable' :
             current.bmi > 25 && change > 0 ? 'worsening' :
             current.bmi > 25 && change < 0 ? 'improving' : 'stable'
    });
  }

  // 血圧トレンド
  if (current.bloodPressureSystolic && previous.bloodPressureSystolic) {
    const change = current.bloodPressureSystolic - previous.bloodPressureSystolic;
    trends.push({
      metric: '収縮期血圧',
      current: current.bloodPressureSystolic,
      previous: previous.bloodPressureSystolic,
      change,
      trend: change > 10 ? 'worsening' :
             change < -10 ? 'improving' : 'stable'
    });
  }

  // HbA1cトレンド
  if (current.hba1c && previous.hba1c) {
    const change = current.hba1c - previous.hba1c;
    trends.push({
      metric: 'HbA1c',
      current: current.hba1c,
      previous: previous.hba1c,
      change,
      trend: change > 0.3 ? 'worsening' :
             change < -0.3 ? 'improving' : 'stable'
    });
  }

  return trends;
}

/**
 * キーファインディングスの生成
 */
function generateKeyFindings(
  assessment: OverallRiskAssessment,
  trends: HealthTrend[]
): string[] {
  const findings: string[] = [];

  // リスクレベルに基づくファインディング
  if (assessment.overallLevel === 'very-high') {
    findings.push('複数の健康指標で要注意レベルに達しています');
  } else if (assessment.overallLevel === 'high') {
    findings.push('健康リスクが高い状態です。早期の対策が必要です');
  }

  // 高リスクカテゴリの特定
  assessment.riskScores.forEach(score => {
    if (score.level === 'very-high' || score.level === 'high') {
      findings.push(`${score.category}リスクが${score.level === 'very-high' ? '非常に高い' : '高い'}状態です`);
    }
  });

  // トレンドに基づくファインディング
  const worseningTrends = trends.filter(t => t.trend === 'worsening');
  if (worseningTrends.length > 0) {
    findings.push(`${worseningTrends.map(t => t.metric).join('、')}が悪化傾向にあります`);
  }

  const improvingTrends = trends.filter(t => t.trend === 'improving');
  if (improvingTrends.length > 0) {
    findings.push(`${improvingTrends.map(t => t.metric).join('、')}に改善が見られます`);
  }

  return findings.slice(0, 5);
}

/**
 * 改善点の特定
 */
function identifyImprovements(trends: HealthTrend[]): string[] {
  const improvements: string[] = [];

  trends.forEach(trend => {
    if (trend.trend === 'improving') {
      if (trend.metric === 'BMI') {
        improvements.push(`体重管理に改善が見られます（BMI ${trend.change.toFixed(1)}%改善）`);
      } else if (trend.metric === '収縮期血圧') {
        improvements.push(`血圧が改善しています（${Math.abs(trend.change)}mmHg低下）`);
      } else if (trend.metric === 'HbA1c') {
        improvements.push(`血糖コントロールが改善しています（HbA1c ${Math.abs(trend.change).toFixed(1)}%改善）`);
      }
    }
  });

  return improvements;
}

/**
 * 懸念事項の特定
 */
function identifyConcerns(
  assessment: OverallRiskAssessment,
  trends: HealthTrend[]
): string[] {
  const concerns: string[] = [];

  // 高リスク要因
  assessment.riskScores.forEach(score => {
    if (score.level === 'very-high') {
      concerns.push(`${score.category}が要注意レベルです（スコア: ${score.score}）`);
    }
  });

  // 悪化トレンド
  trends.forEach(trend => {
    if (trend.trend === 'worsening') {
      concerns.push(`${trend.metric}が前回から${Math.abs(trend.change).toFixed(1)}${trend.metric.includes('率') ? '%' : ''}悪化`);
    }
  });

  // 優先対応事項
  if (assessment.priorityActions.length > 0) {
    concerns.push(`緊急対応が必要: ${assessment.priorityActions[0]}`);
  }

  return concerns.slice(0, 5);
}

/**
 * サマリーセクションの生成
 */
function generateSummarySection(
  assessment: OverallRiskAssessment,
  trends: HealthTrend[]
): ReportSection {
  const healthScore = 100 - assessment.overallScore;
  const trendSummary = trends.length > 0
    ? `前回検査と比較して、${trends.filter(t => t.trend === 'improving').length}項目が改善、${trends.filter(t => t.trend === 'worsening').length}項目が悪化しています。`
    : '前回データがないため、トレンド分析はできません。';

  return {
    title: '健康状態サマリー',
    type: 'text',
    importance: assessment.overallLevel === 'very-high' ? 'critical' :
                assessment.overallLevel === 'high' ? 'high' : 'medium',
    content: {
      healthScore,
      riskLevel: assessment.overallLevel,
      description: `あなたの現在の健康スコアは${healthScore}点です（100点満点）。${trendSummary}`,
      nextCheckup: assessment.nextCheckupRecommendation
    }
  };
}

/**
 * リスク評価セクションの生成
 */
function generateRiskAssessmentSection(assessment: OverallRiskAssessment): ReportSection {
  return {
    title: 'カテゴリ別リスク評価',
    type: 'table',
    importance: 'high',
    content: {
      headers: ['カテゴリ', 'スコア', 'レベル', '主なリスク要因'],
      rows: assessment.riskScores.map(score => [
        score.category,
        `${score.score}点`,
        score.level,
        score.factors.slice(0, 2).join('、')
      ])
    }
  };
}

/**
 * トレンドセクションの生成
 */
function generateTrendsSection(trends: HealthTrend[]): ReportSection {
  if (trends.length === 0) {
    return {
      title: '健康指標の推移',
      type: 'text',
      importance: 'low',
      content: {
        message: '前回データがないため、トレンド分析はできません。'
      }
    };
  }

  return {
    title: '健康指標の推移',
    type: 'chart',
    importance: 'medium',
    content: {
      chartType: 'trend',
      data: trends.map(t => ({
        metric: t.metric,
        previous: t.previous,
        current: t.current,
        change: `${t.change > 0 ? '+' : ''}${t.change.toFixed(1)}`,
        trend: t.trend,
        trendIcon: t.trend === 'improving' ? '↗️' :
                   t.trend === 'worsening' ? '↘️' : '→'
      }))
    }
  };
}

/**
 * 推奨事項セクションの生成
 */
function generateRecommendationsSection(assessment: OverallRiskAssessment): ReportSection {
  const recommendations = categorizeRecommendations(assessment);

  return {
    title: '健康改善のための推奨事項',
    type: 'text',
    importance: 'high',
    content: {
      immediate: recommendations.immediate,
      shortTerm: recommendations.shortTerm,
      longTerm: recommendations.longTerm
    }
  };
}

/**
 * アクションプランセクションの生成
 */
function generateActionPlanSection(
  assessment: OverallRiskAssessment,
  staffInfo: any
): ReportSection {
  const actions = generateNextActions(assessment, []);

  return {
    title: '次のアクションプラン',
    type: 'text',
    importance: assessment.overallLevel === 'very-high' ? 'critical' : 'high',
    content: {
      timeline: '今後30日間',
      actions: actions.map((action, index) => ({
        priority: index + 1,
        action,
        deadline: getActionDeadline(index)
      }))
    }
  };
}

/**
 * 推奨事項のカテゴリ分け
 */
function categorizeRecommendations(assessment: OverallRiskAssessment): {
  immediate: string[];
  shortTerm: string[];
  longTerm: string[];
} {
  const allRecommendations: string[] = [];

  assessment.riskScores.forEach(score => {
    allRecommendations.push(...score.recommendations);
  });

  // 重複を除去
  const uniqueRecommendations = [...new Set(allRecommendations)];

  // 優先度でカテゴリ分け
  const immediate: string[] = [];
  const shortTerm: string[] = [];
  const longTerm: string[] = [];

  uniqueRecommendations.forEach(rec => {
    if (rec.includes('緊急') || rec.includes('直ちに') || rec.includes('専門医')) {
      immediate.push(rec);
    } else if (rec.includes('検討') || rec.includes('改善')) {
      shortTerm.push(rec);
    } else {
      longTerm.push(rec);
    }
  });

  return {
    immediate: immediate.slice(0, 3),
    shortTerm: shortTerm.slice(0, 3),
    longTerm: longTerm.slice(0, 3)
  };
}

/**
 * 次のアクションの生成
 */
function generateNextActions(
  assessment: OverallRiskAssessment,
  concerns: string[]
): string[] {
  const actions: string[] = [];

  // 高リスクカテゴリに対するアクション
  if (assessment.overallLevel === 'very-high' || assessment.overallLevel === 'high') {
    actions.push('産業医との面談を予約する');
  }

  // 優先対応事項からアクション生成
  assessment.priorityActions.slice(0, 2).forEach(priority => {
    actions.push(priority);
  });

  // 懸念事項に基づくアクション
  if (concerns.some(c => c.includes('血圧'))) {
    actions.push('家庭血圧測定を開始し、記録をつける');
  }

  if (concerns.some(c => c.includes('糖'))) {
    actions.push('食事記録をつけ、糖質摂取量を把握する');
  }

  return actions.slice(0, 5);
}

/**
 * アクション期限の取得
 */
function getActionDeadline(priority: number): string {
  const now = new Date();
  const deadline = new Date();

  switch (priority) {
    case 0:
      deadline.setDate(now.getDate() + 7);
      break;
    case 1:
      deadline.setDate(now.getDate() + 14);
      break;
    default:
      deadline.setDate(now.getDate() + 30);
  }

  return deadline.toLocaleDateString('ja-JP');
}

/**
 * レポートのMarkdown形式へのエクスポート
 */
export function exportReportToMarkdown(report: HealthReport): string {
  let markdown = `# 健康レポート

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
${report.summary.improvements.length > 0
  ? report.summary.improvements.map(i => `- ✅ ${i}`).join('\n')
  : '- 前回データがないため比較できません'}

### 懸念事項
${report.summary.concerns.length > 0
  ? report.summary.concerns.map(c => `- ⚠️ ${c}`).join('\n')
  : '- 特になし'}

`;

  // セクションの追加
  report.sections.forEach(section => {
    markdown += `\n## ${section.title}\n\n`;

    if (section.type === 'text') {
      if (typeof section.content === 'string') {
        markdown += section.content;
      } else {
        markdown += JSON.stringify(section.content, null, 2);
      }
    } else if (section.type === 'table' && section.content.headers && section.content.rows) {
      markdown += `| ${section.content.headers.join(' | ')} |\n`;
      markdown += `| ${section.content.headers.map(() => '---').join(' | ')} |\n`;
      section.content.rows.forEach((row: any[]) => {
        markdown += `| ${row.join(' | ')} |\n`;
      });
    } else {
      markdown += '```json\n' + JSON.stringify(section.content, null, 2) + '\n```';
    }

    markdown += '\n';
  });

  // 推奨事項
  markdown += `\n## 推奨事項\n\n`;
  markdown += `### 緊急対応\n${report.recommendations.immediate.map(r => `- 🔴 ${r}`).join('\n')}\n\n`;
  markdown += `### 短期目標（1-3ヶ月）\n${report.recommendations.shortTerm.map(r => `- 🟡 ${r}`).join('\n')}\n\n`;
  markdown += `### 長期目標（3ヶ月以上）\n${report.recommendations.longTerm.map(r => `- 🟢 ${r}`).join('\n')}\n\n`;

  // 次のアクション
  markdown += `\n## 次のアクション\n\n`;
  report.nextActions.forEach((action, index) => {
    markdown += `${index + 1}. ${action}\n`;
  });

  return markdown;
}