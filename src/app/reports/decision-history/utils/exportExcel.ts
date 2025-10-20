import * as XLSX from 'xlsx';
import { format, parseISO } from 'date-fns';
import type { ExpiredEscalationDecision, DecisionHistoryResponse } from '@/services/voicedrive/types';

type ExpiredEscalationSummary = DecisionHistoryResponse['summary'];

/**
 * Excelファイルを生成してダウンロード
 */
export async function generateExcel(
  decisions: ExpiredEscalationDecision[],
  summary: ExpiredEscalationSummary
): Promise<void> {
  const workbook = XLSX.utils.book_new();

  // Sheet 1: サマリー統計
  const summarySheet = createSummarySheet(summary);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'サマリー統計');

  // Sheet 2: 判断履歴詳細
  const detailSheet = createDetailSheet(decisions);
  XLSX.utils.book_append_sheet(workbook, detailSheet, '判断履歴詳細');

  // Sheet 3: 月次集計
  const monthlySheet = createMonthlySheet(decisions);
  XLSX.utils.book_append_sheet(workbook, monthlySheet, '月次集計');

  // ファイル保存
  const filename = `判断履歴詳細_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
  XLSX.writeFile(workbook, filename);
}

/**
 * サマリー統計シート作成
 */
function createSummarySheet(summary: ExpiredEscalationSummary): XLSX.WorkSheet {
  const data = [
    ['項目', '値'],
    ['エクスポート日時', format(new Date(), 'yyyy-MM-dd HH:mm')],
    ['総判断件数', summary.totalDecisions],
    [
      '承認件数',
      `${summary.approvalCount} (${((summary.approvalCount / summary.totalDecisions) * 100).toFixed(1)}%)`,
    ],
    [
      'ダウングレード件数',
      `${summary.downgradeCount} (${((summary.downgradeCount / summary.totalDecisions) * 100).toFixed(1)}%)`,
    ],
    [
      '不採用件数',
      `${summary.rejectCount} (${((summary.rejectCount / summary.totalDecisions) * 100).toFixed(1)}%)`,
    ],
    ['平均到達率', `${summary.averageAchievementRate.toFixed(1)}%`],
    ['平均期限超過日数', `${summary.averageDaysOverdue.toFixed(1)}日`],
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);

  // 列幅設定
  ws['!cols'] = [
    { wch: 25 }, // 項目列
    { wch: 30 }, // 値列
  ];

  return ws;
}

/**
 * 判断履歴詳細シート作成
 */
function createDetailSheet(decisions: ExpiredEscalationDecision[]): XLSX.WorkSheet {
  const data: any[][] = [
    [
      'No.',
      '判断日時',
      '判断結果',
      '到達率',
      '超過日数',
      '判断者',
      'スタッフ名',
      '等級',
      '部署',
      '判断理由',
    ],
    ...decisions.map((d, i) => [
      i + 1,
      format(parseISO(d.createdAt), 'yyyy-MM-dd HH:mm'),
      getDecisionLabel(d.decision),
      `${d.achievementRate.toFixed(1)}%`,
      `${d.daysOverdue}日`,
      d.deciderName,
      d.staffName || '',
      d.grade || '',
      d.department || '',
      d.reason || '',
    ]),
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);

  // 列幅設定
  ws['!cols'] = [
    { wch: 5 },  // No.
    { wch: 18 }, // 判断日時
    { wch: 15 }, // 判断結果
    { wch: 10 }, // 到達率
    { wch: 10 }, // 超過日数
    { wch: 12 }, // 判断者
    { wch: 12 }, // スタッフ名
    { wch: 8 },  // 等級
    { wch: 12 }, // 部署
    { wch: 40 }, // 判断理由
  ];

  // ヘッダー行固定
  ws['!freeze'] = { xSplit: 0, ySplit: 1 };

  return ws;
}

/**
 * 月次集計シート作成
 */
function createMonthlySheet(decisions: ExpiredEscalationDecision[]): XLSX.WorkSheet {
  // 月ごとにグループ化
  const monthlyData = new Map<
    string,
    {
      count: number;
      approved: number;
      downgraded: number;
      rejected: number;
      totalAchievementRate: number;
      totalDaysOverdue: number;
    }
  >();

  decisions.forEach((d) => {
    const month = format(parseISO(d.createdAt), 'yyyy-MM');
    if (!monthlyData.has(month)) {
      monthlyData.set(month, {
        count: 0,
        approved: 0,
        downgraded: 0,
        rejected: 0,
        totalAchievementRate: 0,
        totalDaysOverdue: 0,
      });
    }

    const entry = monthlyData.get(month)!;
    entry.count++;
    entry.totalAchievementRate += d.achievementRate;
    entry.totalDaysOverdue += d.daysOverdue;

    if (d.decision === 'approve_at_current_level') entry.approved++;
    else if (d.decision === 'downgrade') entry.downgraded++;
    else if (d.decision === 'reject') entry.rejected++;
  });

  // ソートして配列に変換
  const sortedMonths = Array.from(monthlyData.entries()).sort((a, b) =>
    b[0].localeCompare(a[0])
  ); // 新しい月が上

  const data: any[][] = [
    ['年月', '判断件数', '承認', 'ダウングレード', '不採用', '平均到達率', '平均超過日数'],
    ...sortedMonths.map(([month, stats]) => [
      month,
      stats.count,
      stats.approved,
      stats.downgraded,
      stats.rejected,
      `${(stats.totalAchievementRate / stats.count).toFixed(1)}%`,
      `${(stats.totalDaysOverdue / stats.count).toFixed(1)}日`,
    ]),
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);

  // 列幅設定
  ws['!cols'] = [
    { wch: 10 }, // 年月
    { wch: 10 }, // 判断件数
    { wch: 8 },  // 承認
    { wch: 15 }, // ダウングレード
    { wch: 8 },  // 不採用
    { wch: 12 }, // 平均到達率
    { wch: 14 }, // 平均超過日数
  ];

  // ヘッダー行固定
  ws['!freeze'] = { xSplit: 0, ySplit: 1 };

  return ws;
}

/**
 * 判断タイプラベル取得
 */
function getDecisionLabel(decision: string): string {
  switch (decision) {
    case 'approve_at_current_level':
      return '承認';
    case 'downgrade':
      return 'ダウングレード';
    case 'reject':
      return '不採用';
    default:
      return decision;
  }
}
