// HR戦略ページ用のモックデータ

import { TwoAxisEvaluation, JobCategory, EvaluationPattern } from '@/types/hr-strategy';
import { determineEvaluationPattern } from '@/utils/evaluationPatternAnalyzer';

// モック職員データの生成
export const generateMockTwoAxisEvaluations = (): TwoAxisEvaluation[] => {
  const departments = ['内科', '外科', 'ICU', '小児科', 'リハビリテーション科', '看護部', '介護部', '事務部'];
  const jobCategories: JobCategory[] = ['看護師', '介護職', '医師', 'セラピスト', '事務職', 'その他'];
  
  const evaluations: TwoAxisEvaluation[] = [];
  
  // 各パターンのサンプルデータを生成
  const samplePatterns: Array<{
    name: string;
    jobCategory: JobCategory;
    facilityEval: 'S' | 'A' | 'B' | 'C' | 'D';
    corporateEval: 'S' | 'A' | 'B' | 'C' | 'D';
    yearsOfService: number;
  }> = [
    // 高評価パターン
    { name: '田中 美和', jobCategory: '看護師', facilityEval: 'S', corporateEval: 'B', yearsOfService: 5 },
    { name: '山田 健太', jobCategory: '看護師', facilityEval: 'B', corporateEval: 'A', yearsOfService: 7 },
    { name: '佐藤 理恵', jobCategory: '医師', facilityEval: 'A', corporateEval: 'S', yearsOfService: 10 },
    { name: '鈴木 大輔', jobCategory: 'セラピスト', facilityEval: 'A', corporateEval: 'A', yearsOfService: 6 },
    
    // 中間評価パターン
    { name: '高橋 明子', jobCategory: '看護師', facilityEval: 'B', corporateEval: 'B', yearsOfService: 4 },
    { name: '伊藤 健一', jobCategory: '事務職', facilityEval: 'B', corporateEval: 'A', yearsOfService: 8 },
    { name: '渡辺 由美', jobCategory: '介護職', facilityEval: 'A', corporateEval: 'C', yearsOfService: 3 },
    
    // 低評価パターン
    { name: '佐藤 一郎', jobCategory: '介護職', facilityEval: 'D', corporateEval: 'B', yearsOfService: 3 },
    { name: '鈴木 花子', jobCategory: '看護師', facilityEval: 'C', corporateEval: 'D', yearsOfService: 2 },
    { name: '田村 花子', jobCategory: '看護師', facilityEval: 'D', corporateEval: 'D', yearsOfService: 4 },
    
    // 特殊パターン
    { name: '中村 太郎', jobCategory: '看護師', facilityEval: 'S', corporateEval: 'D', yearsOfService: 6 },
    { name: '小林 美咲', jobCategory: '介護職', facilityEval: 'S', corporateEval: 'C', yearsOfService: 5 },
    { name: '加藤 次郎', jobCategory: '事務職', facilityEval: 'C', corporateEval: 'A', yearsOfService: 12 },
  ];

  // 追加のランダムデータを生成
  const firstNames = ['田中', '山田', '佐藤', '鈴木', '高橋', '伊藤', '渡辺', '中村', '小林', '加藤'];
  const lastNames = ['太郎', '花子', '健太', '美和', '理恵', '大輔', '明子', '健一', '由美', '一郎'];
  const grades: Array<'S' | 'A' | 'B' | 'C' | 'D'> = ['S', 'A', 'B', 'C', 'D'];

  // サンプルパターンを追加
  samplePatterns.forEach((pattern, index) => {
    const evaluation = {
      employeeId: `EMP${String(index + 1).padStart(3, '0')}`,
      employeeName: pattern.name,
      department: departments[index % departments.length],
      jobCategory: pattern.jobCategory,
      facilityEval: pattern.facilityEval,
      facilityRank: Math.floor(Math.random() * 20) + 1,
      facilityTotal: Math.floor(Math.random() * 50) + 20,
      corporateEval: pattern.corporateEval,
      corporateRank: Math.floor(Math.random() * 100) + 1,
      corporateTotal: 280,
      finalEval: getFinalEval(pattern.facilityEval, pattern.corporateEval),
      evaluationPattern: 'growth-potential' as EvaluationPattern, // 後で計算
      yearsOfService: pattern.yearsOfService,
      lastEvaluationDate: '2024-12-01'
    };
    
    // パターンを正しく判定
    evaluation.evaluationPattern = determineEvaluationPattern(evaluation);
    evaluations.push(evaluation);
  });

  // 追加のランダムデータ
  for (let i = samplePatterns.length; i < 100; i++) {
    const facilityEval = grades[Math.floor(Math.random() * grades.length)];
    const corporateEval = grades[Math.floor(Math.random() * grades.length)];
    const jobCategory = jobCategories[Math.floor(Math.random() * jobCategories.length)];
    const yearsOfService = Math.floor(Math.random() * 15) + 1;
    
    const evaluation = {
      employeeId: `EMP${String(i + 1).padStart(3, '0')}`,
      employeeName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      department: departments[Math.floor(Math.random() * departments.length)],
      jobCategory,
      facilityEval,
      facilityRank: Math.floor(Math.random() * 50) + 1,
      facilityTotal: Math.floor(Math.random() * 100) + 50,
      corporateEval,
      corporateRank: Math.floor(Math.random() * 200) + 1,
      corporateTotal: 280,
      finalEval: getFinalEval(facilityEval, corporateEval),
      evaluationPattern: 'growth-potential' as EvaluationPattern, // 後で計算
      yearsOfService,
      lastEvaluationDate: '2024-12-01'
    };
    
    // パターンを正しく判定
    evaluation.evaluationPattern = determineEvaluationPattern(evaluation);
    evaluations.push(evaluation);
  }

  return evaluations;
};

// 総合評価の計算
function getFinalEval(facility: string, corporate: string): 'S+' | 'S' | 'A+' | 'A' | 'B' | 'C' | 'D' {
  const mapping: Record<string, 'S+' | 'S' | 'A+' | 'A' | 'B' | 'C' | 'D'> = {
    'S-S': 'S+', 'S-A': 'S', 'S-B': 'A+', 'S-C': 'A', 'S-D': 'A',
    'A-S': 'S', 'A-A': 'A+', 'A-B': 'A', 'A-C': 'A', 'A-D': 'B',
    'B-S': 'A+', 'B-A': 'A', 'B-B': 'B', 'B-C': 'B', 'B-D': 'C',
    'C-S': 'A', 'C-A': 'A', 'C-B': 'B', 'C-C': 'C', 'C-D': 'D',
    'D-S': 'B', 'D-A': 'B', 'D-B': 'C', 'D-C': 'C', 'D-D': 'D'
  };
  return mapping[`${corporate}-${facility}`] || 'B';
}