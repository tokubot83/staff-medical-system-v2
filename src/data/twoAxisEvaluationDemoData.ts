import {
  TwoAxisEvaluation,
  EmployeeEvaluationProfile,
  EvaluationAnalysis,
} from '@/types/two-axis-evaluation'

// デモ用職員プロファイルデータ
export const demoEmployeeProfiles: Record<string, EmployeeEvaluationProfile> = {
  '1': {
    employee: {
      id: '1',
      employeeCode: 'EMP001',
      name: '田中花子',
      position: '看護師',
      jobCategory: '看護職',
      facility: {
        id: 'F001',
        name: '○○病院',
        type: 'hospital',
      },
      hireDate: '2020-04-01',
    },
    currentEvaluation: {
      period: '2024-H2',
      score: 85.5,
      facilityEvaluation: {
        grade: 'S',
        rank: 1,
        total: 15,
        percentile: '上位7%',
      },
      corporateEvaluation: {
        grade: 'B',
        rank: 100,
        total: 280,
        percentile: '上位36%',
      },
      finalEvaluation: {
        grade: 'A',
        description: '良好：小規模施設のリーダー',
        recommendation: '法人レベルでの活躍機会を検討',
      },
    },
  },
  '2': {
    employee: {
      id: '2',
      employeeCode: 'EMP002',
      name: '山田太郎',
      position: '看護師',
      jobCategory: '看護職',
      facility: {
        id: 'F002',
        name: '△△クリニック',
        type: 'clinic',
      },
      hireDate: '2019-04-01',
    },
    currentEvaluation: {
      period: '2024-H2',
      score: 82.0,
      facilityEvaluation: {
        grade: 'B',
        rank: 35,
        total: 80,
        percentile: '上位44%',
      },
      corporateEvaluation: {
        grade: 'A',
        rank: 40,
        total: 280,
        percentile: '上位14%',
      },
      finalEvaluation: {
        grade: 'A',
        description: '優秀：安定した実力者',
        recommendation: '現職継続＋スキル向上支援',
      },
    },
  },
  '3': {
    employee: {
      id: '3',
      employeeCode: 'EMP003',
      name: '佐藤美咲',
      position: '介護福祉士',
      jobCategory: '介護職',
      facility: {
        id: 'F001',
        name: '○○病院',
        type: 'hospital',
      },
      hireDate: '2021-04-01',
    },
    currentEvaluation: {
      period: '2024-H2',
      score: 78.5,
      facilityEvaluation: {
        grade: 'A',
        rank: 3,
        total: 12,
        percentile: '上位25%',
      },
      corporateEvaluation: {
        grade: 'B',
        rank: 150,
        total: 180,
        percentile: '上位83%',
      },
      finalEvaluation: {
        grade: 'A',
        description: '優秀：施設の中核人材',
        recommendation: '教育担当者としての育成',
      },
    },
  },
  '4': {
    employee: {
      id: '4',
      employeeCode: 'EMP004',
      name: '鈴木一郎',
      position: '理学療法士',
      jobCategory: 'リハビリ職',
      facility: {
        id: 'F002',
        name: '△△クリニック',
        type: 'clinic',
      },
      hireDate: '2020-04-01',
    },
    currentEvaluation: {
      period: '2024-H2',
      score: 88.0,
      facilityEvaluation: {
        grade: 'A',
        rank: 2,
        total: 25,
        percentile: '上位8%',
      },
      corporateEvaluation: {
        grade: 'A',
        rank: 15,
        total: 120,
        percentile: '上位13%',
      },
      finalEvaluation: {
        grade: 'A+',
        description: '極めて優秀：バランスの取れた人材',
        recommendation: '次世代リーダー候補として育成',
      },
    },
  },
  '5': {
    employee: {
      id: '5',
      employeeCode: 'EMP005',
      name: '高橋理恵',
      position: '看護師',
      jobCategory: '看護職',
      facility: {
        id: 'F001',
        name: '○○病院',
        type: 'hospital',
      },
      hireDate: '2018-04-01',
    },
    currentEvaluation: {
      period: '2024-H2',
      score: 90.2,
      facilityEvaluation: {
        grade: 'S',
        rank: 1,
        total: 15,
        percentile: '上位7%',
      },
      corporateEvaluation: {
        grade: 'A',
        rank: 25,
        total: 280,
        percentile: '上位9%',
      },
      finalEvaluation: {
        grade: 'S',
        description: '卓越：小規模施設のリーダー',
        recommendation: '管理職候補、専門分野リーダー',
      },
    },
  },
}

// デモ用評価分析データ
export const demoEvaluationAnalyses: Record<string, EvaluationAnalysis> = {
  '1': {
    employeeBasic: {
      id: '1',
      name: '田中花子',
      position: '看護師',
    },
    evaluationHistory: [
      {
        period: '2024-H2',
        score: 85.5,
        facilityEval: 'S',
        corporateEval: 'B',
        finalEval: 'A',
      },
      {
        period: '2024-H1',
        score: 82.0,
        facilityEval: 'A',
        corporateEval: 'B',
        finalEval: 'A',
      },
      {
        period: '2023-H2',
        score: 78.5,
        facilityEval: 'A',
        corporateEval: 'C',
        finalEval: 'B',
      },
      {
        period: '2023-H1',
        score: 75.0,
        facilityEval: 'B',
        corporateEval: 'C',
        finalEval: 'C',
      },
    ],
    growthAnalysis: {
      scoreTrend: '上昇傾向（+3.5点）',
      strengthArea: '施設内リーダーシップ',
      improvementArea: '法人全体での専門性向上',
      careerPath: '主任候補、教育担当者',
    },
    transferAnalysis: {
      currentFit: '施設特性に非常に適合',
      recommendedAction: '現施設での継続的な活躍を推奨',
      alternativePaths: [
        '同規模施設での管理職',
        '教育担当者としての専門化',
      ],
    },
  },
  '2': {
    employeeBasic: {
      id: '2',
      name: '山田太郎',
      position: '看護師',
    },
    evaluationHistory: [
      {
        period: '2024-H2',
        score: 82.0,
        facilityEval: 'B',
        corporateEval: 'A',
        finalEval: 'A',
      },
      {
        period: '2024-H1',
        score: 83.5,
        facilityEval: 'B',
        corporateEval: 'A',
        finalEval: 'A',
      },
      {
        period: '2023-H2',
        score: 81.0,
        facilityEval: 'B',
        corporateEval: 'A',
        finalEval: 'A',
      },
    ],
    growthAnalysis: {
      scoreTrend: '横ばい',
      strengthArea: '専門性・技術力',
      improvementArea: '施設内でのチームワーク強化',
      careerPath: '専門分野でのリーダー職',
    },
    transferAnalysis: {
      currentFit: '能力を十分に発揮できていない可能性',
      recommendedAction: 'より大規模施設への異動を検討',
      alternativePaths: [
        '大規模施設でのチャレンジ',
        '専門性を活かせる部署への異動',
        '法人本部での専門職',
      ],
    },
  },
  '3': {
    employeeBasic: {
      id: '3',
      name: '佐藤美咲',
      position: '介護福祉士',
    },
    evaluationHistory: [
      {
        period: '2024-H2',
        score: 78.5,
        facilityEval: 'A',
        corporateEval: 'B',
        finalEval: 'A',
      },
      {
        period: '2024-H1',
        score: 76.0,
        facilityEval: 'A',
        corporateEval: 'C',
        finalEval: 'B',
      },
      {
        period: '2023-H2',
        score: 73.5,
        facilityEval: 'B',
        corporateEval: 'C',
        finalEval: 'C',
      },
    ],
    evaluationHistory: [
      {
        period: '2024-H2',
        score: 78.5,
        facilityEval: 'A',
        corporateEval: 'B',
        finalEval: 'A',
      },
      {
        period: '2024-H1',
        score: 76.0,
        facilityEval: 'A',
        corporateEval: 'C',
        finalEval: 'B',
      },
      {
        period: '2023-H2',
        score: 73.5,
        facilityEval: 'B',
        corporateEval: 'C',
        finalEval: 'C',
      },
    ],
    growthAnalysis: {
      scoreTrend: '上昇傾向（+2.5点）',
      strengthArea: '安定した業務遂行',
      improvementArea: '次のステップへの準備',
      careerPath: '現職での専門性向上、チームリーダー候補',
    },
    transferAnalysis: {
      currentFit: '適性良好',
      recommendedAction: '現職継続＋スキル向上支援',
      alternativePaths: [
        '教育担当者としての育成',
        'メンター制度の活用',
      ],
    },
  },
  '4': {
    employeeBasic: {
      id: '4',
      name: '鈴木一郎',
      position: '理学療法士',
    },
    evaluationHistory: [
      {
        period: '2024-H2',
        score: 88.0,
        facilityEval: 'A',
        corporateEval: 'A',
        finalEval: 'A+',
      },
      {
        period: '2024-H1',
        score: 86.5,
        facilityEval: 'A',
        corporateEval: 'A',
        finalEval: 'A+',
      },
      {
        period: '2023-H2',
        score: 84.0,
        facilityEval: 'A',
        corporateEval: 'B',
        finalEval: 'A',
      },
      {
        period: '2023-H1',
        score: 82.5,
        facilityEval: 'B',
        corporateEval: 'B',
        finalEval: 'B',
      },
    ],
    growthAnalysis: {
      scoreTrend: '上昇傾向（+1.5点）',
      strengthArea: '専門性・技術力',
      improvementArea: '次のステップへの準備',
      careerPath: '管理職候補、専門分野リーダー',
    },
    transferAnalysis: {
      currentFit: '適性良好',
      recommendedAction: '昇進・昇格の検討',
      alternativePaths: [
        '管理職としての登用',
        '法人本部での専門職',
        '専門分野でのリーダー職',
      ],
    },
  },
  '5': {
    employeeBasic: {
      id: '5',
      name: '高橋理恵',
      position: '看護師',
    },
    evaluationHistory: [
      {
        period: '2024-H2',
        score: 90.2,
        facilityEval: 'S',
        corporateEval: 'A',
        finalEval: 'S',
      },
      {
        period: '2024-H1',
        score: 89.0,
        facilityEval: 'S',
        corporateEval: 'A',
        finalEval: 'S',
      },
      {
        period: '2023-H2',
        score: 87.5,
        facilityEval: 'S',
        corporateEval: 'B',
        finalEval: 'A',
      },
      {
        period: '2023-H1',
        score: 85.0,
        facilityEval: 'A',
        corporateEval: 'B',
        finalEval: 'A',
      },
      {
        period: '2022-H2',
        score: 82.5,
        facilityEval: 'A',
        corporateEval: 'B',
        finalEval: 'A',
      },
    ],
    growthAnalysis: {
      scoreTrend: '上昇傾向（+1.2点）',
      strengthArea: '施設内リーダーシップ',
      improvementArea: '法人全体での活躍機会',
      careerPath: '管理職候補、専門分野リーダー',
    },
    transferAnalysis: {
      currentFit: '施設特性に非常に適合',
      recommendedAction: '昇進・昇格の検討',
      alternativePaths: [
        '管理職としての登用',
        '法人本部での専門職',
        '他施設での管理職',
      ],
    },
  },
}

// APIモックハンドラー
export function getMockEmployeeProfile(employeeId: string): EmployeeEvaluationProfile | null {
  return demoEmployeeProfiles[employeeId] || null
}

export function getMockEvaluationAnalysis(employeeId: string): EvaluationAnalysis | null {
  return demoEvaluationAnalyses[employeeId] || null
}