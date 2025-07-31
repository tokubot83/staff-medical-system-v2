export type EvaluationGrade = 'S' | 'A' | 'B' | 'C' | 'D'
export type FinalEvaluationGrade = 'S+' | 'S' | 'A+' | 'A' | 'B' | 'C' | 'D'

export interface TwoAxisEvaluation {
  id: string
  employeeId: string
  evaluationId: string
  evaluationPeriod: string // 2024-H2等
  score: number // 評価シート点数 (0-100)
  facilityRank: number // 施設内順位
  facilityTotal: number // 施設内総数
  facilityEvaluation: EvaluationGrade // S,A,B,C,D
  facilityPercentile: number // 施設内パーセンタイル
  corporateRank: number // 法人内順位
  corporateTotal: number // 法人内総数
  corporateEvaluation: EvaluationGrade // S,A,B,C,D
  corporatePercentile: number // 法人内パーセンタイル
  finalEvaluation: FinalEvaluationGrade // S+,S,A+,A,B,C,D
  jobCategory: string // 職種（看護職、介護職等）
  createdAt: string
  updatedAt: string
}

export interface EvaluationMatrix {
  corporateEval: EvaluationGrade
  facilityEval: EvaluationGrade
  finalEval: FinalEvaluationGrade
  description?: string
}

export interface EmployeeEvaluationProfile {
  employee: {
    id: string
    employeeCode: string
    name: string
    position: string
    jobCategory: string
    facility: {
      id: string
      name: string
      type: string
    }
    hireDate: string
  }
  currentEvaluation?: {
    period: string
    score: number
    facilityEvaluation: {
      grade: EvaluationGrade
      rank: number
      total: number
      percentile: string
    }
    corporateEvaluation: {
      grade: EvaluationGrade
      rank: number
      total: number
      percentile: string
    }
    finalEvaluation: {
      grade: FinalEvaluationGrade
      description: string
      recommendation: string
    }
  }
}

export interface EvaluationAnalysis {
  employeeBasic: {
    id: string
    name: string
    position: string
  }
  evaluationHistory: {
    period: string
    score: number
    facilityEval: EvaluationGrade
    corporateEval: EvaluationGrade
    finalEval: FinalEvaluationGrade
  }[]
  growthAnalysis: {
    scoreTrend: string
    strengthArea: string
    improvementArea: string
    careerPath: string
  }
  transferAnalysis: {
    currentFit: string
    recommendedAction: string
    alternativePaths: string[]
  }
}

// 評価グレード計算関数
export function calculateEvaluationGrade(rank: number, total: number): EvaluationGrade {
  const percentile = (rank / total) * 100
  
  if (percentile <= 10) return 'S' // 上位10%
  if (percentile <= 30) return 'A' // 上位11-30%
  if (percentile <= 70) return 'B' // 上位31-70%
  if (percentile <= 90) return 'C' // 上位71-90%
  return 'D' // 下位10%
}

// パーセンタイル計算関数
export function calculatePercentile(rank: number, total: number): number {
  return Math.round((rank / total) * 100 * 10) / 10
}

// パーセンタイル表示文字列
export function formatPercentile(rank: number, total: number): string {
  const percentile = calculatePercentile(rank, total)
  return `上位${percentile}%`
}

// 評価グレードの色
export function getEvaluationGradeColor(grade: EvaluationGrade | FinalEvaluationGrade): string {
  const colors: Record<string, string> = {
    'S+': '#e91e63',
    'S': '#ff5722',
    'A+': '#ff9800',
    'A': '#ffc107',
    'B': '#4caf50',
    'C': '#2196f3',
    'D': '#9e9e9e'
  }
  return colors[grade] || '#9e9e9e'
}

// 評価グレードのラベル
export function getEvaluationGradeLabel(grade: FinalEvaluationGrade): string {
  const labels: Record<FinalEvaluationGrade, string> = {
    'S+': '最優秀',
    'S': '卓越',
    'A+': '極めて優秀',
    'A': '優秀',
    'B': '良好',
    'C': '標準',
    'D': '要改善'
  }
  return labels[grade]
}

// 評価マトリクス
export const EVALUATION_MATRIX: EvaluationMatrix[] = [
  // S行
  { corporateEval: 'S', facilityEval: 'S', finalEval: 'S+', description: '最優秀：法人全体のトップパフォーマー' },
  { corporateEval: 'S', facilityEval: 'A', finalEval: 'S', description: '卓越：法人レベルで高い実績' },
  { corporateEval: 'S', facilityEval: 'B', finalEval: 'S', description: '卓越：より大きな環境での活躍が期待' },
  { corporateEval: 'S', facilityEval: 'C', finalEval: 'A', description: '優秀：施設内での成長余地あり' },
  { corporateEval: 'S', facilityEval: 'D', finalEval: 'B', description: '良好：施設内でのサポートが必要' },
  
  // A行
  { corporateEval: 'A', facilityEval: 'S', finalEval: 'S', description: '卓越：小規模施設のリーダー' },
  { corporateEval: 'A', facilityEval: 'A', finalEval: 'A+', description: '極めて優秀：バランスの取れた人材' },
  { corporateEval: 'A', facilityEval: 'B', finalEval: 'A', description: '優秀：安定した実力者' },
  { corporateEval: 'A', facilityEval: 'C', finalEval: 'B', description: '良好：成長の機会が必要' },
  { corporateEval: 'A', facilityEval: 'D', finalEval: 'C', description: '標準：基礎スキルの向上が必要' },
  
  // B行
  { corporateEval: 'B', facilityEval: 'S', finalEval: 'A', description: '優秀：施設内で際立つ存在' },
  { corporateEval: 'B', facilityEval: 'A', finalEval: 'A', description: '優秀：施設の中核人材' },
  { corporateEval: 'B', facilityEval: 'B', finalEval: 'B', description: '良好：期待通りのパフォーマンス' },
  { corporateEval: 'B', facilityEval: 'C', finalEval: 'C', description: '標準：継続的な育成が必要' },
  { corporateEval: 'B', facilityEval: 'D', finalEval: 'D', description: '要改善：重点的な支援が必要' },
  
  // C行
  { corporateEval: 'C', facilityEval: 'S', finalEval: 'B', description: '良好：施設内での強みを活かす' },
  { corporateEval: 'C', facilityEval: 'A', finalEval: 'B', description: '良好：施設環境に適合' },
  { corporateEval: 'C', facilityEval: 'B', finalEval: 'C', description: '標準：基本業務の習熟が必要' },
  { corporateEval: 'C', facilityEval: 'C', finalEval: 'C', description: '標準：継続的な指導が必要' },
  { corporateEval: 'C', facilityEval: 'D', finalEval: 'D', description: '要改善：根本的な改善が必要' },
  
  // D行
  { corporateEval: 'D', facilityEval: 'S', finalEval: 'C', description: '標準：施設の特性を活かす' },
  { corporateEval: 'D', facilityEval: 'A', finalEval: 'C', description: '標準：施設内での役割を明確化' },
  { corporateEval: 'D', facilityEval: 'B', finalEval: 'D', description: '要改善：基礎からの育成が必要' },
  { corporateEval: 'D', facilityEval: 'C', finalEval: 'D', description: '要改善：適性の再評価が必要' },
  { corporateEval: 'D', facilityEval: 'D', finalEval: 'D', description: '要改善：抜本的な対策が必要' },
]

// マトリクスから最終評価を取得
export function getFinalEvaluation(
  corporateEval: EvaluationGrade,
  facilityEval: EvaluationGrade
): { grade: FinalEvaluationGrade; description: string } {
  const matrix = EVALUATION_MATRIX.find(
    item => item.corporateEval === corporateEval && item.facilityEval === facilityEval
  )
  
  if (!matrix) {
    throw new Error(`評価マトリクスに該当する組み合わせが見つかりません: ${corporateEval}/${facilityEval}`)
  }
  
  return {
    grade: matrix.finalEval,
    description: matrix.description || ''
  }
}

// 推奨アクション生成
export function generateRecommendation(
  corporateEval: EvaluationGrade,
  facilityEval: EvaluationGrade,
  finalEval: FinalEvaluationGrade
): string {
  // 施設内評価が高く、法人内評価が低い場合
  if (facilityEval === 'S' && ['B', 'C', 'D'].includes(corporateEval)) {
    return '法人レベルでの活躍機会を検討'
  }
  
  // 法人内評価が高く、施設内評価が低い場合
  if (corporateEval === 'S' && ['C', 'D'].includes(facilityEval)) {
    return '施設内でのリーダーシップ強化が必要'
  }
  
  // 両方高評価
  if (['S+', 'S', 'A+'].includes(finalEval)) {
    return '次世代リーダー候補として育成'
  }
  
  // 両方低評価
  if (finalEval === 'D') {
    return '基礎スキルの向上と適性評価が必要'
  }
  
  // その他のケース
  return '現在のポジションでの成長を支援'
}