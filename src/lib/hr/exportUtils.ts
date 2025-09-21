/**
 * HR Station CSV Export Utilities
 */

import { generatePhaseData } from './heatmapData';

interface ExportData {
  filters: {
    facility: string;
    position: string;
    phase: number;
  };
}

/**
 * Export heatmap data to CSV format
 */
export function exportHeatmapToCSV(data: ExportData) {
  const { filters } = data;
  const phaseData = generatePhaseData(filters.phase, filters);

  // Create CSV headers
  const headers = [
    'パフォーマンス層',
    'コース',
    '人数',
    'ポイント平均',
    '推奨アクション'
  ];

  // Create CSV rows
  const rows: string[][] = [];
  const layers = [
    { key: 'top', label: '上位20%' },
    { key: 'middle', label: '中間60%' },
    { key: 'low', label: '要支援20%' }
  ];
  const courses = ['A', 'B', 'C', 'D'];

  layers.forEach(layer => {
    courses.forEach(course => {
      const cellData = phaseData.data[layer.key]?.[course];
      if (cellData) {
        rows.push([
          layer.label,
          `${course}コース`,
          cellData.count.toString(),
          cellData.avgPoints ? cellData.avgPoints.toFixed(1) : 'N/A',
          cellData.action || ''
        ]);
      }
    });
  });

  // Convert to CSV string
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Create download
  downloadCSV(csvContent, `hr-heatmap-phase${filters.phase}-${Date.now()}.csv`);
}

/**
 * Export staff list to CSV format
 */
export function exportStaffListToCSV(
  layer: string,
  course: string,
  staffList: Array<{
    id: string;
    name: string;
    department: string;
    position: string;
    points?: number;
    grade?: number;
    evaluation?: string;
  }>
) {
  const headers = [
    '職員ID',
    '氏名',
    '部署',
    '職種',
    'ポイント',
    '等級',
    '評価'
  ];

  const rows = staffList.map(staff => [
    staff.id,
    staff.name,
    staff.department,
    staff.position,
    staff.points?.toString() || '',
    staff.grade?.toString() || '',
    staff.evaluation || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const layerLabels: Record<string, string> = {
    top: '上位20%',
    middle: '中間60%',
    low: '要支援20%'
  };

  downloadCSV(
    csvContent,
    `staff-list-${layerLabels[layer]}-${course}コース-${Date.now()}.csv`
  );
}

/**
 * Export action plan to CSV format
 */
export function exportActionPlanToCSV(
  actionPlans: Array<{
    layer: string;
    course: string;
    count: number;
    actions: string[];
    timeline: string;
    kpi: string[];
  }>
) {
  const headers = [
    'パフォーマンス層',
    'コース',
    '対象人数',
    'アクション',
    'タイムライン',
    'KPI'
  ];

  const rows = actionPlans.map(plan => [
    plan.layer,
    plan.course,
    plan.count.toString(),
    plan.actions.join('、'),
    plan.timeline,
    plan.kpi.join('、')
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  downloadCSV(csvContent, `action-plan-${Date.now()}.csv`);
}

/**
 * Helper function to download CSV file
 */
function downloadCSV(content: string, filename: string) {
  // Add BOM for proper Japanese character encoding in Excel
  const bom = '\uFEFF';
  const blob = new Blob([bom + content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Export full report as CSV
 */
export function exportFullReportToCSV(data: {
  filters: any;
  phaseData: any;
  summary: {
    totalStaff: number;
    topPerformers: number;
    needsSupport: number;
    avgPoints: number;
  };
}) {
  const lines: string[] = [];

  // Add header
  lines.push('人事ステーション - ヒートマップレポート');
  lines.push(`生成日時: ${new Date().toLocaleString('ja-JP')}`);
  lines.push('');

  // Add filters
  lines.push('フィルター条件');
  lines.push(`フェーズ: 第${data.filters.phase}段階`);
  lines.push(`施設: ${data.filters.facility === 'all' ? '全施設' : data.filters.facility}`);
  lines.push(`職種: ${data.filters.position === 'all' ? '全職種' : data.filters.position}`);
  lines.push('');

  // Add summary
  lines.push('サマリー');
  lines.push(`総職員数: ${data.summary.totalStaff}名`);
  lines.push(`上位パフォーマー: ${data.summary.topPerformers}名`);
  lines.push(`要支援対象: ${data.summary.needsSupport}名`);
  lines.push(`平均ポイント: ${data.summary.avgPoints.toFixed(1)}`);
  lines.push('');

  // Add detailed data
  lines.push('詳細データ');
  lines.push('パフォーマンス層,コース,人数,平均ポイント,推奨アクション');

  const layers = [
    { key: 'top', label: '上位20%' },
    { key: 'middle', label: '中間60%' },
    { key: 'low', label: '要支援20%' }
  ];
  const courses = ['A', 'B', 'C', 'D'];

  layers.forEach(layer => {
    courses.forEach(course => {
      const cellData = data.phaseData.data[layer.key]?.[course];
      if (cellData) {
        lines.push([
          layer.label,
          `${course}コース`,
          cellData.count,
          cellData.avgPoints?.toFixed(1) || 'N/A',
          `"${cellData.action || ''}"`
        ].join(','));
      }
    });
  });

  const csvContent = lines.join('\n');
  downloadCSV(csvContent, `hr-report-full-${Date.now()}.csv`);
}