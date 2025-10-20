import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { ExpiredEscalationDecision, DecisionHistoryResponse } from '@/services/voicedrive/types';

type ExpiredEscalationSummary = DecisionHistoryResponse['summary'];

interface ChartImages {
  achievementRate: string;  // Base64 PNG
  decisionType: string;     // Base64 PNG
  timeSeries: string;       // Base64 PNG
}

interface GeneratePDFOptions {
  decisions: ExpiredEscalationDecision[];
  summary: ExpiredEscalationSummary;
  chartImages: ChartImages;
  onProgress?: (progress: number) => void;
}

/**
 * グラフ要素をPNG画像にキャプチャ
 */
export async function captureChartImages(): Promise<ChartImages> {
  const achievementRateChart = document.querySelector('[data-chart="achievement-rate"]') as HTMLElement;
  const decisionTypeChart = document.querySelector('[data-chart="decision-type"]') as HTMLElement;
  const timeSeriesChart = document.querySelector('[data-chart="time-series"]') as HTMLElement;

  if (!achievementRateChart || !decisionTypeChart || !timeSeriesChart) {
    throw new Error('グラフ要素が見つかりません。ページを再読み込みしてください。');
  }

  const [achievementRateCanvas, decisionTypeCanvas, timeSeriesCanvas] = await Promise.all([
    html2canvas(achievementRateChart, { scale: 2, backgroundColor: '#ffffff' }),
    html2canvas(decisionTypeChart, { scale: 2, backgroundColor: '#ffffff' }),
    html2canvas(timeSeriesChart, { scale: 2, backgroundColor: '#ffffff' }),
  ]);

  return {
    achievementRate: achievementRateCanvas.toDataURL('image/png', 0.92),
    decisionType: decisionTypeCanvas.toDataURL('image/png', 0.92),
    timeSeries: timeSeriesCanvas.toDataURL('image/png', 0.92),
  };
}

/**
 * PDFドキュメント生成
 */
export async function generatePDF(options: GeneratePDFOptions): Promise<jsPDF> {
  const { decisions, summary, chartImages, onProgress } = options;

  // A4サイズ、縦向き、mm単位
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210; // A4幅
  const pageHeight = 297; // A4高さ
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // ページ1: カバーページ
  onProgress?.(0.1);
  addCoverPage(pdf, summary, margin, contentWidth, pageWidth);

  // ページ2-3: グラフページ
  onProgress?.(0.3);
  pdf.addPage();
  await addChartsPage(pdf, chartImages, margin, contentWidth, pageWidth);

  // ページ4-N: データテーブルページ
  onProgress?.(0.5);
  await addDataTablePages(pdf, decisions, margin, contentWidth, pageWidth, pageHeight, onProgress);

  onProgress?.(1.0);
  return pdf;
}

/**
 * カバーページ追加
 */
function addCoverPage(
  pdf: jsPDF,
  summary: ExpiredEscalationSummary,
  margin: number,
  contentWidth: number,
  pageWidth: number
) {
  // タイトル
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('判断履歴レポート', pageWidth / 2, 60, { align: 'center' });

  // サブタイトル
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text('期限到達提案の判断履歴と統計', pageWidth / 2, 75, { align: 'center' });

  // エクスポート情報
  pdf.setFontSize(12);
  const exportDate = new Date().toLocaleString('ja-JP');
  pdf.text(`エクスポート日時: ${exportDate}`, margin, 100);

  // サマリー統計
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('サマリー統計', margin, 120);

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  const stats = [
    `総判断件数: ${summary.totalDecisions}件`,
    `承認: ${summary.approvalCount}件 (${((summary.approvalCount / summary.totalDecisions) * 100).toFixed(1)}%)`,
    `ダウングレード: ${summary.downgradeCount}件 (${((summary.downgradeCount / summary.totalDecisions) * 100).toFixed(1)}%)`,
    `不採用: ${summary.rejectCount}件 (${((summary.rejectCount / summary.totalDecisions) * 100).toFixed(1)}%)`,
    `平均到達率: ${summary.averageAchievementRate.toFixed(1)}%`,
    `平均期限超過日数: ${summary.averageDaysOverdue.toFixed(1)}日`,
  ];

  let y = 135;
  stats.forEach((stat) => {
    pdf.text(stat, margin + 10, y);
    y += 10;
  });

  // フッター
  pdf.setFontSize(10);
  pdf.setTextColor(128);
  pdf.text('医療職員管理システム - Phase 6 期限到達判断履歴機能', pageWidth / 2, 280, { align: 'center' });
  pdf.setTextColor(0);
}

/**
 * グラフページ追加
 */
async function addChartsPage(
  pdf: jsPDF,
  chartImages: ChartImages,
  margin: number,
  contentWidth: number,
  pageWidth: number
) {
  // タイトル
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('統計グラフ', margin, 30);

  // 到達率分布グラフ
  const chartHeight1 = 80;
  pdf.addImage(chartImages.achievementRate, 'PNG', margin, 40, contentWidth / 2 - 5, chartHeight1);

  // 判断タイプ分布グラフ
  pdf.addImage(chartImages.decisionType, 'PNG', pageWidth / 2 + 5, 40, contentWidth / 2 - 5, chartHeight1);

  // 時系列推移グラフ（次のページ）
  pdf.addPage();
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('時系列推移', margin, 30);

  const chartHeight2 = 100;
  pdf.addImage(chartImages.timeSeries, 'PNG', margin, 40, contentWidth, chartHeight2);
}

/**
 * データテーブルページ追加
 */
async function addDataTablePages(
  pdf: jsPDF,
  decisions: ExpiredEscalationDecision[],
  margin: number,
  contentWidth: number,
  pageWidth: number,
  pageHeight: number,
  onProgress?: (progress: number) => void
) {
  pdf.addPage();

  // タイトル
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('判断履歴詳細', margin, 30);

  // テーブルヘッダー
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  const headers = ['No.', '判断日時', '判断結果', '到達率', '超過日数', '判断者'];
  const colWidths = [15, 40, 30, 25, 25, 35];

  let x = margin;
  let y = 45;

  // ヘッダー描画
  headers.forEach((header, i) => {
    pdf.text(header, x, y);
    x += colWidths[i];
  });

  // ヘッダー下線
  pdf.line(margin, y + 2, pageWidth - margin, y + 2);

  // データ行
  pdf.setFont('helvetica', 'normal');
  y += 10;

  decisions.forEach((decision, index) => {
    if (y > pageHeight - 30) {
      // 新しいページ
      pdf.addPage();
      y = 30;

      // ヘッダー再描画
      pdf.setFont('helvetica', 'bold');
      x = margin;
      headers.forEach((header, i) => {
        pdf.text(header, x, y);
        x += colWidths[i];
      });
      pdf.line(margin, y + 2, pageWidth - margin, y + 2);
      pdf.setFont('helvetica', 'normal');
      y += 10;
    }

    x = margin;
    const row = [
      (index + 1).toString(),
      new Date(decision.createdAt).toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' }) + ' ' +
      new Date(decision.createdAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
      getDecisionTypeLabel(decision.decision),
      `${decision.achievementRate.toFixed(1)}%`,
      `${decision.daysOverdue}日`,
      decision.deciderName,
    ];

    row.forEach((cell, i) => {
      pdf.text(cell, x, y);
      x += colWidths[i];
    });

    y += 8;

    // 進捗更新
    onProgress?.(0.5 + (index / decisions.length) * 0.5);
  });

  // フッター（ページ番号）
  const totalPages = (pdf as any).internal.pages.length - 1; // -1 for the first empty page
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(10);
    pdf.setTextColor(128);
    pdf.text(`ページ ${i}/${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    pdf.setTextColor(0);
  }
}

/**
 * 判断タイプラベル取得
 */
function getDecisionTypeLabel(decision: string): string {
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
