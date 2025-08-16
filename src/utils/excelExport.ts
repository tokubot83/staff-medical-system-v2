import * as XLSX from 'xlsx';

export interface ExcelExportOptions {
  title: string;
  facility?: string;
  dateRange?: string;
  sheets: ExcelSheet[];
}

export interface ExcelSheet {
  name: string;
  data: any[];
  chartData?: ChartDataForExcel;
}

export interface ChartDataForExcel {
  type: 'line' | 'bar' | 'pie' | 'doughnut';
  labels: string[];
  datasets: any[];
}

export const exportToExcel = (options: ExcelExportOptions) => {
  try {
    const workbook = XLSX.utils.book_new();

    // サマリー情報シートの作成
    const summaryData = [
      ['レポート名', options.title],
      ['施設名', options.facility || '全施設'],
      ['期間', options.dateRange || ''],
      ['出力日', new Date().toLocaleDateString('ja-JP')],
      [''],
      ['シート一覧'],
      ...options.sheets.map(sheet => [sheet.name, `${sheet.data.length}件のデータ`])
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'サマリー');

    // 各データシートの作成
    options.sheets.forEach(sheetInfo => {
      if (sheetInfo.data.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(sheetInfo.data);
        
        // チャートデータがある場合は追加
        if (sheetInfo.chartData) {
          addChartDataToSheet(worksheet, sheetInfo.chartData);
        }
        
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetInfo.name);
      }
    });

    // ファイル名の生成
    const filename = `${options.title}_${options.facility?.replace(/[\s\/]/g, '_') || '全施設'}_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // ファイルのダウンロード
    XLSX.writeFile(workbook, filename);
    
  } catch (error) {
    console.error('Excel出力エラー:', error);
    alert('Excelファイルの生成に失敗しました。');
  }
};

// チャートデータをワークシートに追加
const addChartDataToSheet = (worksheet: XLSX.WorkSheet, chartData: ChartDataForExcel) => {
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  let currentRow = range.e.r + 3; // 空行を入れて配置

  // チャート情報のヘッダー
  XLSX.utils.sheet_add_aoa(worksheet, [
    ['チャートデータ'],
    ['タイプ', chartData.type],
    [''],
    ['ラベル', ...chartData.datasets.map(ds => ds.label || 'データ')]
  ], { origin: `A${currentRow}` });

  currentRow += 4;

  // データ行の作成
  const chartRows = chartData.labels.map((label, index) => {
    const row = [label];
    chartData.datasets.forEach(dataset => {
      row.push(dataset.data[index] || 0);
    });
    return row;
  });

  XLSX.utils.sheet_add_aoa(worksheet, chartRows, { origin: `A${currentRow}` });

  // 範囲の更新
  const newRange = XLSX.utils.encode_range({
    s: { c: 0, r: 0 },
    e: { c: Math.max(range.e.c, chartData.datasets.length), r: currentRow + chartRows.length }
  });
  worksheet['!ref'] = newRange;
};

// 面談統計データのExcelエクスポート専用関数
export const exportInterviewStatistics = () => {
  // 月次実施率データ
  const monthlyRateData = [
    { 月: '1月', 定期面談: 85, 特別面談: 100, サポート面談: 70 },
    { 月: '2月', 定期面談: 88, 特別面談: 95, サポート面談: 75 },
    { 月: '3月', 定期面談: 92, 特別面談: 100, サポート面談: 80 },
    { 月: '4月', 定期面談: 90, 特別面談: 100, サポート面談: 78 },
    { 月: '5月', 定期面談: 87, 特別面談: 90, サポート面談: 82 },
    { 月: '6月', 定期面談: 91, 特別面談: 95, サポート面談: 85 },
    { 月: '7月', 定期面談: 89, 特別面談: 100, サポート面談: 83 },
    { 月: '8月', 定期面談: 93, 特別面談: 100, サポート面談: 87 },
    { 月: '9月', 定期面談: 95, 特別面談: 95, サポート面談: 88 },
    { 月: '10月', 定期面談: 92, 特別面談: 100, サポート面談: 85 },
    { 月: '11月', 定期面談: 90, 特別面談: 100, サポート面談: 83 },
    { 月: '12月', 定期面談: 94, 特別面談: 95, サポート面談: 86 }
  ];

  // 部署別実施状況データ
  const departmentData = [
    { 部署: '内科病棟', 実施済み: 45, 予定: 15, 未実施: 5, 合計: 65 },
    { 部署: '外科病棟', 実施済み: 38, 予定: 12, 未実施: 3, 合計: 53 },
    { 部署: '救急科', 実施済み: 22, 予定: 8, 未実施: 2, 合計: 32 },
    { 部署: '地域包括ケア', 実施済み: 35, 予定: 10, 未実施: 3, 合計: 48 },
    { 部署: '緩和ケア', 実施済み: 28, 予定: 7, 未実施: 2, 合計: 37 },
    { 部署: '外来', 実施済み: 42, 予定: 8, 未実施: 4, 合計: 54 },
    { 部署: 'リハビリ', 実施済み: 30, 予定: 10, 未実施: 3, 合計: 43 },
    { 部署: '医事課', 実施済み: 25, 予定: 5, 未実施: 2, 合計: 32 }
  ];

  // 面談タイプ別実施数
  const typeData = [
    { 面談タイプ: '新入職員月次', 実施数: 120, 割合: '25.5%' },
    { 面談タイプ: '一般年次', 実施数: 180, 割合: '38.3%' },
    { 面談タイプ: '管理職半年', 実施数: 45, 割合: '9.6%' },
    { 面談タイプ: '退職', 実施数: 12, 割合: '2.6%' },
    { 面談タイプ: '復職', 実施数: 8, 割合: '1.7%' },
    { 面談タイプ: 'キャリア', 実施数: 35, 割合: '7.4%' },
    { 面談タイプ: '職場環境', 実施数: 28, 割合: '6.0%' },
    { 面談タイプ: '個別相談', 実施数: 42, 割合: '8.9%' }
  ];

  // 職種別実施率
  const positionData = [
    { 職種: '看護師', 対象者数: 320, 実施数: 294, 実施率: '92%' },
    { 職種: '准看護師', 対象者数: 150, 実施数: 132, 実施率: '88%' },
    { 職種: '看護補助者', 対象者数: 180, 実施数: 153, 実施率: '85%' },
    { 職種: '医事課', 対象者数: 80, 実施数: 72, 実施率: '90%' },
    { 職種: 'リハビリ', 対象者数: 95, 実施数: 83, 実施率: '87%' },
    { 職種: '管理職', 対象者数: 31, 実施数: 29, 実施率: '95%' }
  ];

  // 詳細面談記録
  const detailData = [
    { 日付: '2024-03-15', 職員名: '山田太郎', 部署: '内科病棟', 職種: '看護師', 種別: '年次面談', 実施者: '田中師長', ステータス: '完了', 評価: 'A' },
    { 日付: '2024-03-14', 職員名: '佐藤花子', 部署: '外科病棟', 職種: '看護師', 種別: '新入職員', 実施者: '鈴木主任', ステータス: '完了', 評価: 'B' },
    { 日付: '2024-03-13', 職員名: '高橋一郎', 部署: '救急科', 職種: '准看護師', 種別: 'キャリア', 実施者: '伊藤部長', ステータス: '実施中', 評価: '-' },
    { 日付: '2024-03-12', 職員名: '田中美咲', 部署: '地域包括ケア', 職種: '看護補助者', 種別: '年次面談', 実施者: '渡辺主任', ステータス: '完了', 評価: 'A' },
    { 日付: '2024-03-11', 職員名: '鈴木健太', 部署: 'リハビリ', 職種: '理学療法士', 種別: '職場環境', 実施者: '岩田課長', ステータス: '完了', 評価: 'B' },
    { 日付: '2024-03-10', 職員名: '伊藤まり', 部署: '外来', 職種: '看護師', 種別: '個別相談', 実施者: '佐々木師長', ステータス: '予定', 評価: '-' }
  ];

  // サマリー統計
  const summaryStats = [
    { 項目: '総面談数', 値: 1234, 単位: '件', 前月比: '+12%' },
    { 項目: '実施率', 値: 92.5, 単位: '%', 前月比: '+3.2%' },
    { 項目: '対象職員数', 値: 856, 単位: '人', 前月比: '+5人' },
    { 項目: '今月予定', 値: 45, 単位: '件', 前月比: '-8件' },
    { 項目: '平均面談時間', 値: 45, 単位: '分', 前月比: '+2分' },
    { 項目: '満足度平均', 値: 4.2, 単位: '点', 前月比: '+0.1点' }
  ];

  const exportOptions: ExcelExportOptions = {
    title: '面談統計レポート',
    facility: '医療法人厚生会',
    dateRange: `${new Date().getFullYear()}年度`,
    sheets: [
      {
        name: 'サマリー統計',
        data: summaryStats
      },
      {
        name: '月次実施率推移',
        data: monthlyRateData,
        chartData: {
          type: 'line',
          labels: monthlyRateData.map(d => d.月),
          datasets: [
            { label: '定期面談', data: monthlyRateData.map(d => d.定期面談) },
            { label: '特別面談', data: monthlyRateData.map(d => d.特別面談) },
            { label: 'サポート面談', data: monthlyRateData.map(d => d.サポート面談) }
          ]
        }
      },
      {
        name: '部署別実施状況',
        data: departmentData,
        chartData: {
          type: 'bar',
          labels: departmentData.map(d => d.部署),
          datasets: [
            { label: '実施済み', data: departmentData.map(d => d.実施済み) },
            { label: '予定', data: departmentData.map(d => d.予定) },
            { label: '未実施', data: departmentData.map(d => d.未実施) }
          ]
        }
      },
      {
        name: '面談タイプ別実施数',
        data: typeData,
        chartData: {
          type: 'pie',
          labels: typeData.map(d => d.面談タイプ),
          datasets: [
            { label: '実施数', data: typeData.map(d => d.実施数) }
          ]
        }
      },
      {
        name: '職種別実施率',
        data: positionData,
        chartData: {
          type: 'doughnut',
          labels: positionData.map(d => d.職種),
          datasets: [
            { label: '実施率', data: positionData.map(d => parseInt(d.実施率)) }
          ]
        }
      },
      {
        name: '詳細面談記録',
        data: detailData
      }
    ]
  };

  exportToExcel(exportOptions);
};

// 面談タイプ別の詳細統計エクスポート
export const exportDetailedInterviewStatistics = (selectedPeriod: string, selectedDepartment: string) => {
  const periodText = selectedPeriod === 'month' ? '月次' : selectedPeriod === 'quarter' ? '四半期' : '年次';
  const departmentText = selectedDepartment === 'all' ? '全部署' : selectedDepartment;

  // より詳細なデータ（期間とフィルターに基づいて）
  const detailedData = [
    { 期間: '2024年3月', 部署: '内科病棟', 職種: '看護師', 面談タイプ: '年次面談', 実施数: 15, 目標数: 18, 達成率: '83%', 平均時間: '42分', 満足度: 4.3 },
    { 期間: '2024年3月', 部署: '外科病棟', 職種: '看護師', 面談タイプ: '年次面談', 実施数: 12, 目標数: 15, 達成率: '80%', 平均時間: '38分', 満足度: 4.1 },
    { 期間: '2024年3月', 部署: '救急科', 職種: '准看護師', 面談タイプ: 'キャリア面談', 実施数: 8, 目標数: 10, 達成率: '80%', 平均時間: '35分', 満足度: 4.0 }
  ];

  const exportOptions: ExcelExportOptions = {
    title: `面談統計詳細レポート（${periodText}・${departmentText}）`,
    facility: '医療法人厚生会',
    dateRange: `${new Date().getFullYear()}年${new Date().getMonth() + 1}月`,
    sheets: [
      {
        name: '詳細統計',
        data: detailedData
      }
    ]
  };

  exportToExcel(exportOptions);
};