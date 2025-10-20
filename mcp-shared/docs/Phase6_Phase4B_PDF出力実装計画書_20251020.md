# Phase 6 Phase 4B PDF出力機能 実装計画書

**作成日**: 2025年10月20日（日）22:00
**バージョン**: 1.0.0
**担当**: 医療職員管理システム開発チーム
**対象**: Phase 6 期限到達判断履歴機能 - Phase 4B

---

## 1. Phase 4B 実装概要

### 1.1 目的
Phase 3で実装したグラフ表示機能に、PDF出力機能を追加し、LEVEL_14-18の管理者が判断履歴レポートをPDF形式で保存・共有できるようにする。

### 1.2 実装スコープ
- ✅ **jsPDF/html2canvas依存関係追加**
- ✅ **グラフのPNG変換機能**
- ✅ **PDFテンプレート作成**（A4サイズ、日本語対応）
- ✅ **PDFエクスポートボタン実装**
- ✅ **進捗表示**（ダウンロード中表示）

### 1.3 使用技術
- **PDFライブラリ**: jsPDF 2.x
- **画像変換**: html2canvas 1.x
- **フォント**: NotoSansJP（日本語対応）
- **言語**: TypeScript
- **フレームワーク**: Next.js 14（App Router）

---

## 2. PDF出力仕様

### 2.1 PDF構成

#### ページ1: カバーページ
```
┌─────────────────────────────────────┐
│                                     │
│         ⚖️ 判断履歴レポート          │
│                                     │
│       期限到達提案の判断履歴と統計    │
│                                     │
│  エクスポート日時: 2025-10-20 22:00  │
│  対象期間: 2025-09-20 〜 2025-10-20  │
│                                     │
│  総判断件数: 10件                    │
│  承認率: 60.0%                       │
│  平均到達率: 224.5%                  │
│  平均超過日数: 11.9日                │
│                                     │
└─────────────────────────────────────┘
```

#### ページ2-3: グラフページ
```
┌─────────────────────────────────────┐
│  統計グラフ                          │
│                                     │
│  [到達率分布グラフの画像]            │
│                                     │
│  [判断タイプ分布グラフの画像]        │
│                                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  時系列推移                          │
│                                     │
│  [時系列推移グラフの画像]            │
│                                     │
└─────────────────────────────────────┘
```

#### ページ4-N: データテーブルページ
```
┌─────────────────────────────────────┐
│  判断履歴詳細                        │
│                                     │
│  No. | 判断日時 | 判断結果 | ...     │
│  ──┼─────────┼─────────┼───      │
│  1  | 10/15... | 承認     | ...     │
│  2  | 10/12... | 承認     | ...     │
│  ... | ...     | ...      | ...     │
│                                     │
│  ページ 4/10                         │
└─────────────────────────────────────┘
```

### 2.2 PDF設定

| 項目 | 設定値 |
|------|--------|
| **用紙サイズ** | A4（210mm × 297mm） |
| **向き** | 縦（Portrait） |
| **マージン** | 上下左右: 20mm |
| **フォント** | NotoSansJP Regular/Bold |
| **フォントサイズ** | タイトル: 20pt、見出し: 14pt、本文: 10pt |
| **カラー** | RGB（グラフは元の色を維持） |
| **圧縮** | 画像圧縮ON（JPEG品質: 0.92） |

---

## 3. コンポーネント設計

### 3.1 ファイル構成
```
src/app/reports/decision-history/
├── components/
│   ├── AchievementRateChart.tsx        - ✅ Phase 3で実装済み
│   ├── DecisionTypeChart.tsx           - ✅ Phase 3で実装済み
│   ├── TimeSeriesChart.tsx             - ✅ Phase 3で実装済み
│   ├── ChartsContainer.tsx             - ✅ Phase 3で実装済み
│   └── PDFExportButton.tsx             - ⭐ NEW: PDFエクスポートボタン
├── utils/
│   └── exportPDF.ts                    - ⭐ NEW: PDF生成ユーティリティ
└── page.tsx                            - 更新: PDFエクスポートボタン追加
```

### 3.2 コンポーネント詳細

#### 3.2.1 PDFExportButton.tsx
```typescript
interface PDFExportButtonProps {
  decisions: ExpiredEscalationDecision[];
  summary: ExpiredEscalationSummary;
  onExportStart?: () => void;
  onExportComplete?: () => void;
  onExportError?: (error: Error) => void;
}

export function PDFExportButton({
  decisions,
  summary,
  onExportStart,
  onExportComplete,
  onExportError,
}: PDFExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExportPDF = async () => {
    setIsExporting(true);
    setProgress(0);
    onExportStart?.();

    try {
      // ステップ1: グラフをPNG化（30%）
      setProgress(10);
      const chartImages = await captureChartImages();
      setProgress(30);

      // ステップ2: PDFドキュメント生成（60%）
      setProgress(40);
      const pdf = await generatePDF({
        decisions,
        summary,
        chartImages,
        onProgress: (p) => setProgress(40 + p * 0.2),
      });
      setProgress(60);

      // ステップ3: PDFダウンロード（100%）
      setProgress(80);
      await pdf.save(`判断履歴レポート_${new Date().toISOString().split('T')[0]}.pdf`);
      setProgress(100);

      onExportComplete?.();
    } catch (error) {
      onExportError?.(error as Error);
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleExportPDF}
        disabled={isExporting || decisions.length === 0}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isExporting ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>PDF生成中... {progress}%</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>PDFエクスポート</span>
          </>
        )}
      </button>

      {/* 進捗バー */}
      {isExporting && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-red-600 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
```

#### 3.2.2 exportPDF.ts
```typescript
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
    throw new Error('グラフ要素が見つかりません');
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
  addCoverPage(pdf, summary, margin, contentWidth);

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
  contentWidth: number
) {
  const pageWidth = 210;

  // タイトル
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('⚖️ 判断履歴レポート', pageWidth / 2, 60, { align: 'center' });

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
      new Date(decision.createdAt).toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
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
  const totalPages = pdf.internal.pages.length - 1; // -1 for the first empty page
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
```

---

## 4. 実装スケジュール

### 4.1 Phase 4Bタイムライン（1営業日）

| 時間 | タスク | 担当 | 完了条件 |
|------|--------|------|---------|
| **10/20 22:00-22:15** | jsPDF/html2canvas依存関係インストール | 開発チーム | package.json更新 |
| **10/20 22:15-22:45** | グラフPNG変換機能実装 | 開発チーム | captureChartImages完成 |
| **10/20 22:45-23:30** | PDFテンプレート作成 | 開発チーム | exportPDF.ts完成 |
| **10/20 23:30-00:00** | PDFエクスポートボタン実装 | 開発チーム | PDFExportButton.tsx完成 |
| **10/21 00:00-00:30** | 動作確認・テスト | QA | PDF出力成功 |
| **10/21 00:30** | GitHubプッシュ | 開発チーム | main/preview両方 |

---

## 5. 依存関係

### 5.1 追加パッケージ
```json
{
  "dependencies": {
    "jspdf": "^2.5.1",
    "html2canvas": "^1.4.1"
  },
  "devDependencies": {
    "@types/jspdf": "^2.0.0"
  }
}
```

### 5.2 インストールコマンド
```bash
npm install jspdf html2canvas
npm install -D @types/jspdf
```

---

## 6. テストケース

### 6.1 PDF出力テスト

| # | テストケース | 期待結果 |
|---|-------------|---------|
| 1 | PDFエクスポートボタンクリック | PDF生成開始、進捗表示 |
| 2 | PDF生成完了 | ダウンロードダイアログ表示 |
| 3 | PDFファイル名 | `判断履歴レポート_YYYY-MM-DD.pdf` |
| 4 | PDFページ数 | カバー1 + グラフ2 + データN |
| 5 | グラフ画像品質 | 高解像度（scale: 2） |
| 6 | 日本語表示 | 文字化けなし |
| 7 | データなし時 | ボタン無効化 |
| 8 | PDF生成中の再クリック | ボタン無効化 |

### 6.2 グラフキャプチャテスト

| # | テストケース | 期待結果 |
|---|-------------|---------|
| 1 | 到達率分布グラフキャプチャ | PNG形式、Base64エンコード |
| 2 | 判断タイプ円グラフキャプチャ | 色が正しく再現される |
| 3 | 時系列推移グラフキャプチャ | 凡例が含まれる |
| 4 | グラフ背景色 | 白色（透明でない） |

---

## 7. UI/UXガイドライン

### 7.1 ボタンデザイン

#### 通常状態
- **背景色**: `#dc2626` (赤)
- **ホバー**: `#b91c1c`
- **アイコン**: PDFアイコン（白）
- **テキスト**: "PDFエクスポート"（白）

#### ローディング状態
- **背景色**: `#dc2626` (赤、50%透明度)
- **アイコン**: スピナー（回転アニメーション）
- **テキスト**: "PDF生成中... N%"
- **進捗バー**: ボタン下部に赤色プログレスバー

#### 無効状態
- **背景色**: `#dc2626` (赤、50%透明度)
- **カーソル**: `not-allowed`

### 7.2 エラーハンドリング

| エラータイプ | 表示メッセージ | 対処法 |
|-------------|---------------|--------|
| グラフ要素未検出 | グラフが読み込まれていません。ページを再読み込みしてください。 | ページリロード推奨 |
| PDF生成失敗 | PDF生成に失敗しました。もう一度お試しください。 | リトライ推奨 |
| ブラウザ非対応 | お使いのブラウザではPDF出力がサポートされていません。 | Chrome/Firefox推奨 |

---

## 8. パフォーマンス最適化

### 8.1 画像圧縮
```typescript
// JPEG品質: 0.92（高品質）
canvas.toDataURL('image/png', 0.92);
```

### 8.2 並列処理
```typescript
// 3つのグラフを並列でキャプチャ
await Promise.all([
  html2canvas(chart1),
  html2canvas(chart2),
  html2canvas(chart3),
]);
```

### 8.3 進捗フィードバック
- 10%刻みで進捗更新
- ユーザーに処理状況を視覚的にフィードバック

---

## 9. 既知の制限事項

### 9.1 ブラウザ対応
- **推奨**: Chrome 90+, Firefox 88+, Safari 14+
- **非対応**: IE11
- **制限**: モバイルブラウザでは大きなPDFのダウンロードが遅い場合あり

### 9.2 データ件数
- **最大推奨件数**: 500件（PDFサイズ約5MB）
- **1000件以上**: ページネーション推奨

### 9.3 日本語フォント
- jsPDF標準フォントは日本語非対応のため、基本的なヘルベチカを使用
- 日本語テキストは画像としてキャプチャされる

---

## 10. 次のフェーズ

### 10.1 Phase 5: 詳細機能（2営業日）
- グラフ拡大表示モーダル（0.5日）
- カスタム日付範囲フィルタ（0.5日）
- グラフダウンロード（PNG/SVG）（0.5日）
- Excelエクスポート詳細版（0.5日）

---

## 11. 関連ドキュメント

- `Phase6_Phase3_グラフ実装計画書_20251020.md` - Phase 3グラフ実装
- `Phase6_判断履歴機能_最終実装計画書_20251020.md` - 全体実装計画
- `mcp-shared/logs/phase6-test-data-20251020.json` - テストデータ

---

**Phase 4B実装計画書 v1.0.0**
**作成日**: 2025年10月20日（日）22:00
**医療職員管理システム開発チーム**
