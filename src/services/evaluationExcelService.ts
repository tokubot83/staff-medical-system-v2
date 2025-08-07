import * as XLSX from 'xlsx';
import { 
  MajorEvaluationItem, 
  MiddleEvaluationItem,
  FacilityEvaluationConfig,
  FacilityType,
  JobCategory
} from '@/types/evaluation-config';
import { 
  coreEvaluationItems, 
  facilitySpecificItems,
  facilityTypeNames,
  jobCategoryNames,
  experienceLevelNames
} from '@/data/evaluationMasterData';

export interface ExcelTemplateData {
  facilityType: FacilityType;
  facilityName: string;
  configuredBy: string;
  configuredAt: Date;
}

export interface EvaluationConfigSheet {
  '施設種別': string;
  '施設名': string;
  '項目ID': string;
  '項目カテゴリ': string;
  '大項目名': string;
  '説明': string;
  '配点': number;
  'コア項目': string;
  '適用職種': string;
  '推奨経験レベル': string;
}

export interface MiddleItemSheet {
  '大項目ID': string;
  '中項目ID': string;
  '中項目名': string;
  '説明': string;
  '配点': number;
  '新人基準': string;
  '一般基準': string;
  '中堅基準': string;
  'ベテラン基準': string;
}

export interface MinorItemSheet {
  '中項目ID': string;
  '小項目ID': string;
  '小項目名': string;
  '説明': string;
  '評価例1': string;
  '評価例2': string;
  '評価例3': string;
}

export class EvaluationExcelService {
  static generateConfigTemplate(templateData: ExcelTemplateData): Blob {
    const wb = XLSX.utils.book_new();
    
    // 1. 設定情報シート
    const configInfo = [
      ['施設評価項目設定テンプレート'],
      [''],
      ['施設種別:', facilityTypeNames[templateData.facilityType]],
      ['施設名:', templateData.facilityName],
      ['設定者:', templateData.configuredBy],
      ['設定日:', templateData.configuredAt.toLocaleDateString('ja-JP')],
      [''],
      ['バージョン:', '2024.1'],
      [''],
      ['使用方法:'],
      ['1. 「大項目設定」シートで施設特化項目を選択し、配点を設定してください（合計20点）'],
      ['2. 「中項目設定」シートで各大項目の中項目を定義してください'],
      ['3. 「小項目設定」シートで評価の具体例を記載してください'],
      ['4. 設定完了後、システムにインポートしてください'],
    ];
    const wsInfo = XLSX.utils.aoa_to_sheet(configInfo);
    XLSX.utils.book_append_sheet(wb, wsInfo, '設定情報');
    
    // 2. 大項目設定シート
    const majorItemsData: EvaluationConfigSheet[] = [];
    
    // コア項目（固定）
    coreEvaluationItems.forEach(item => {
      majorItemsData.push({
        '施設種別': facilityTypeNames[templateData.facilityType],
        '施設名': templateData.facilityName,
        '項目ID': item.id,
        '項目カテゴリ': item.category,
        '大項目名': item.name,
        '説明': item.description,
        '配点': item.maxScore,
        'コア項目': '○',
        '適用職種': item.applicableJobs?.map(job => jobCategoryNames[job]).join(', ') || '全職種',
        '推奨経験レベル': item.experienceLevels?.map(level => experienceLevelNames[level]).join(', ') || '全レベル'
      });
    });
    
    // 施設特化項目（選択可能）
    const availableItems = facilitySpecificItems.filter(item => 
      !item.applicableFacilities || item.applicableFacilities.includes(templateData.facilityType)
    );
    
    availableItems.forEach(item => {
      majorItemsData.push({
        '施設種別': facilityTypeNames[templateData.facilityType],
        '施設名': templateData.facilityName,
        '項目ID': item.id,
        '項目カテゴリ': item.category,
        '大項目名': item.name,
        '説明': item.description,
        '配点': 0, // 施設で設定
        'コア項目': '',
        '適用職種': item.applicableJobs?.map(job => jobCategoryNames[job]).join(', ') || '全職種',
        '推奨経験レベル': item.experienceLevels?.map(level => experienceLevelNames[level]).join(', ') || '全レベル'
      });
    });
    
    const wsMajor = XLSX.utils.json_to_sheet(majorItemsData);
    
    // 列幅設定
    const majorColWidths = [
      { wch: 15 }, // 施設種別
      { wch: 20 }, // 施設名
      { wch: 10 }, // 項目ID
      { wch: 15 }, // 項目カテゴリ
      { wch: 20 }, // 大項目名
      { wch: 30 }, // 説明
      { wch: 8 },  // 配点
      { wch: 10 }, // コア項目
      { wch: 25 }, // 適用職種
      { wch: 30 }, // 推奨経験レベル
    ];
    wsMajor['!cols'] = majorColWidths;
    
    XLSX.utils.book_append_sheet(wb, wsMajor, '大項目設定');
    
    // 3. 中項目設定シート（テンプレート）
    const middleItemsTemplate: MiddleItemSheet[] = [
      {
        '大項目ID': 'C01',
        '中項目ID': 'C01-M01',
        '中項目名': '基本技術',
        '説明': '職種に応じた基本的な技術の習得',
        '配点': 5,
        '新人基準': '基本技術を指導下で実施できる',
        '一般基準': '基本技術を独立して実施できる',
        '中堅基準': '基本技術を応用し、効率的に実施できる',
        'ベテラン基準': '基本技術を完璧に実施し、他者に指導できる'
      },
      {
        '大項目ID': 'C01',
        '中項目ID': 'C01-M02',
        '中項目名': '専門技術',
        '説明': '専門的な技術や特殊手技の習得',
        '配点': 5,
        '新人基準': '専門技術を学習中',
        '一般基準': '専門技術を部分的に実施できる',
        '中堅基準': '専門技術を独立して実施できる',
        'ベテラン基準': '専門技術を高度なレベルで実施し、改善提案できる'
      }
    ];
    
    const wsMiddle = XLSX.utils.json_to_sheet(middleItemsTemplate);
    
    // 列幅設定
    const middleColWidths = [
      { wch: 10 }, // 大項目ID
      { wch: 12 }, // 中項目ID
      { wch: 20 }, // 中項目名
      { wch: 30 }, // 説明
      { wch: 8 },  // 配点
      { wch: 30 }, // 新人基準
      { wch: 30 }, // 一般基準
      { wch: 30 }, // 中堅基準
      { wch: 30 }, // ベテラン基準
    ];
    wsMiddle['!cols'] = middleColWidths;
    
    XLSX.utils.book_append_sheet(wb, wsMiddle, '中項目設定');
    
    // 4. 小項目設定シート（テンプレート）
    const minorItemsTemplate: MinorItemSheet[] = [
      {
        '中項目ID': 'C01-M01',
        '小項目ID': 'C01-M01-S01',
        '小項目名': 'バイタルサイン測定',
        '説明': '正確なバイタルサイン測定と記録',
        '評価例1': '測定手順を正しく実施している',
        '評価例2': '異常値を適切に判断できる',
        '評価例3': '測定結果を正確に記録している'
      },
      {
        '中項目ID': 'C01-M01',
        '小項目ID': 'C01-M01-S02',
        '小項目名': '清潔ケア',
        '説明': '患者の清潔保持に関する技術',
        '評価例1': '清拭を適切に実施できる',
        '評価例2': '入浴介助を安全に行える',
        '評価例3': '口腔ケアを効果的に実施できる'
      }
    ];
    
    const wsMinor = XLSX.utils.json_to_sheet(minorItemsTemplate);
    
    // 列幅設定
    const minorColWidths = [
      { wch: 12 }, // 中項目ID
      { wch: 15 }, // 小項目ID
      { wch: 20 }, // 小項目名
      { wch: 30 }, // 説明
      { wch: 30 }, // 評価例1
      { wch: 30 }, // 評価例2
      { wch: 30 }, // 評価例3
    ];
    wsMinor['!cols'] = minorColWidths;
    
    XLSX.utils.book_append_sheet(wb, wsMinor, '小項目設定');
    
    // 5. 配点ガイドシート
    const scoringGuide = [
      ['配点ガイドライン'],
      [''],
      ['【コア項目（30点固定）】'],
      ['C01: 専門技術・スキル - 10点'],
      ['C02: 対人関係・ケア - 10点'],
      ['C03: 安全・品質管理 - 10点'],
      [''],
      ['【施設特化項目（20点を配分）】'],
      ['以下の項目から選択し、合計20点になるよう配点してください：'],
      [''],
      ['知識系項目:'],
      ['- F01: 知識・判断力（最大10点）'],
      [''],
      ['教育系項目:'],
      ['- F02: 教育・指導（最大10点）'],
      [''],
      ['リーダーシップ系項目:'],
      ['- F03: リーダーシップ（最大10点）'],
      [''],
      ['成長系項目:'],
      ['- F04: 成長・学習（最大10点）'],
      [''],
      ['施設特有スキル:'],
      ...availableItems.map(item => `- ${item.id}: ${item.name}（最大${item.maxScore}点）`),
      [''],
      ['【配点の考え方】'],
      ['1. 施設の特性に応じて重要度の高い項目に配点'],
      ['2. 職種や経験レベルに応じた項目選択'],
      ['3. 教育研修計画との連動を考慮'],
      ['4. 必ず合計20点になるよう調整']
    ];
    
    const wsGuide = XLSX.utils.aoa_to_sheet(scoringGuide);
    XLSX.utils.book_append_sheet(wb, wsGuide, '配点ガイド');
    
    // Excelファイル生成
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
  
  static async parseConfigFile(file: File): Promise<FacilityEvaluationConfig> {
    const data = await file.arrayBuffer();
    const wb = XLSX.read(data, { type: 'array' });
    
    // 大項目設定シートの読み込み
    const majorSheet = wb.Sheets['大項目設定'];
    const majorData: EvaluationConfigSheet[] = XLSX.utils.sheet_to_json(majorSheet);
    
    // 中項目設定シートの読み込み
    const middleSheet = wb.Sheets['中項目設定'];
    const middleData: MiddleItemSheet[] = XLSX.utils.sheet_to_json(middleSheet);
    
    // 小項目設定シートの読み込み
    const minorSheet = wb.Sheets['小項目設定'];
    const minorData: MinorItemSheet[] = XLSX.utils.sheet_to_json(minorSheet);
    
    // データの整形
    const facilityType = Object.entries(facilityTypeNames).find(
      ([_, name]) => name === majorData[0]['施設種別']
    )?.[0] as FacilityType;
    
    const facilityName = majorData[0]['施設名'];
    
    // コア項目の抽出
    const coreItems = majorData
      .filter(item => item['コア項目'] === '○')
      .map(item => {
        const original = coreEvaluationItems.find(core => core.id === item['項目ID']);
        return original!;
      });
    
    // 施設特化項目の抽出
    const facilityItems = majorData
      .filter(item => item['コア項目'] !== '○' && item['配点'] > 0)
      .map(item => {
        const original = facilitySpecificItems.find(spec => spec.id === item['項目ID']);
        return {
          item: original!,
          allocatedScore: item['配点']
        };
      });
    
    // 合計点数の計算
    const totalScore = 30 + facilityItems.reduce((sum, item) => sum + item.allocatedScore, 0);
    
    return {
      facilityId: `${facilityType}-${Date.now()}`,
      facilityType,
      facilityName,
      coreItems,
      facilityItems,
      totalScore,
      configuredBy: '管理者',
      configuredAt: new Date()
    };
  }
  
  static generateEvaluationSheet(
    config: FacilityEvaluationConfig,
    jobCategory: JobCategory,
    employeeId: string,
    employeeName: string
  ): Blob {
    const wb = XLSX.utils.book_new();
    
    // 評価シート情報
    const sheetInfo = [
      ['技術評価シート'],
      [''],
      ['評価期間:', `${new Date().getFullYear()}年度`],
      ['施設名:', config.facilityName],
      ['職種:', jobCategoryNames[jobCategory]],
      ['職員ID:', employeeId],
      ['氏名:', employeeName],
      [''],
      ['評価実施日:', ''],
      ['評価者:', ''],
      [''],
    ];
    
    const wsInfo = XLSX.utils.aoa_to_sheet(sheetInfo);
    XLSX.utils.book_append_sheet(wb, wsInfo, '基本情報');
    
    // 評価項目シート
    const evaluationData: any[] = [];
    let rowIndex = 0;
    
    // コア項目
    evaluationData.push(['【コア項目（30点）】', '', '', '', '']);
    rowIndex++;
    
    config.coreItems.forEach(item => {
      evaluationData.push([
        item.id,
        item.name,
        item.description,
        item.maxScore,
        '' // 評価点入力欄
      ]);
      rowIndex++;
    });
    
    evaluationData.push(['', '', '', '', '']);
    rowIndex++;
    
    // 施設特化項目
    evaluationData.push(['【施設特化項目（20点）】', '', '', '', '']);
    rowIndex++;
    
    config.facilityItems.forEach(({ item, allocatedScore }) => {
      evaluationData.push([
        item.id,
        item.name,
        item.description,
        allocatedScore,
        '' // 評価点入力欄
      ]);
      rowIndex++;
    });
    
    evaluationData.push(['', '', '', '', '']);
    rowIndex++;
    evaluationData.push(['', '', '合計', '50', '']);
    
    // ヘッダー追加
    const headers = ['項目ID', '評価項目', '説明', '配点', '評価点'];
    evaluationData.unshift(headers);
    
    const wsEval = XLSX.utils.aoa_to_sheet(evaluationData);
    
    // 列幅設定
    const colWidths = [
      { wch: 10 }, // 項目ID
      { wch: 25 }, // 評価項目
      { wch: 40 }, // 説明
      { wch: 8 },  // 配点
      { wch: 8 },  // 評価点
    ];
    wsEval['!cols'] = colWidths;
    
    XLSX.utils.book_append_sheet(wb, wsEval, '評価項目');
    
    // コメントシート
    const comments = [
      ['評価コメント'],
      [''],
      ['強み:'],
      [''],
      [''],
      ['改善点:'],
      [''],
      [''],
      ['今後の育成方針:'],
      [''],
      [''],
    ];
    
    const wsComments = XLSX.utils.aoa_to_sheet(comments);
    XLSX.utils.book_append_sheet(wb, wsComments, 'コメント');
    
    // Excelファイル生成
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
}