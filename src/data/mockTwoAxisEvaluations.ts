import { TwoAxisEvaluationData } from '@/types/staff'
import { TwoAxisEvaluationGrade } from '@/types/two-axis-evaluation'

// 施設別の評価分布設定
const facilityDistribution: Record<string, { S: number, A: number, B: number, C: number, D: number }> = {
  '小原病院': { S: 10, A: 35, B: 45, C: 8, D: 2 },
  '立神リハビリテーション温泉病院': { S: 12, A: 38, B: 42, C: 6, D: 2 }
}

// 法人全体の評価分布
const corporateDistribution = { S: 11, A: 36, B: 44, C: 7, D: 2 }

// 従来評価と2軸評価のマッピングルール
const evaluationMapping: Record<string, { facility: TwoAxisEvaluationGrade[], corporate: TwoAxisEvaluationGrade[] }> = {
  'S': { facility: ['S+', 'S'], corporate: ['S+', 'S', 'A+'] },
  'A': { facility: ['S', 'A+', 'A'], corporate: ['A+', 'A', 'B'] },
  'B': { facility: ['A', 'B'], corporate: ['B', 'C'] },
  'C': { facility: ['B', 'C'], corporate: ['C', 'D'] },
  '': { facility: ['C', 'D'], corporate: ['C', 'D'] }
}

// ランダムな順位を生成
function generateRank(score: TwoAxisEvaluationGrade, total: number): number {
  const scoreRanks: Record<TwoAxisEvaluationGrade, [number, number]> = {
    'S+': [1, Math.floor(total * 0.02)],
    'S': [Math.floor(total * 0.02) + 1, Math.floor(total * 0.10)],
    'A+': [Math.floor(total * 0.10) + 1, Math.floor(total * 0.25)],
    'A': [Math.floor(total * 0.25) + 1, Math.floor(total * 0.45)],
    'B': [Math.floor(total * 0.45) + 1, Math.floor(total * 0.80)],
    'C': [Math.floor(total * 0.80) + 1, Math.floor(total * 0.95)],
    'D': [Math.floor(total * 0.95) + 1, total]
  }
  
  const [min, max] = scoreRanks[score] || [1, total]
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 総合評価を計算
function calculateOverallScore(facilityScore: TwoAxisEvaluationGrade, corporateScore: TwoAxisEvaluationGrade): TwoAxisEvaluationGrade {
  const scoreMap: Record<TwoAxisEvaluationGrade, number> = {
    'S+': 8, 'S': 7, 'A+': 6, 'A': 5, 'B': 4, 'C': 3, 'D': 2
  }
  const reverseMap: Record<number, TwoAxisEvaluationGrade> = {
    8: 'S+', 7: 'S', 6: 'A+', 5: 'A', 4: 'B', 3: 'C', 2: 'D'
  }

  const facilityNum = scoreMap[facilityScore]
  const corporateNum = scoreMap[corporateScore]
  
  // 両方が高評価の場合は高い方を採用
  if (facilityNum >= 7 && corporateNum >= 7) {
    return facilityNum > corporateNum ? facilityScore : corporateScore
  }
  
  // それ以外は平均値
  const average = Math.round((facilityNum + corporateNum) / 2)
  return reverseMap[average] || 'B'
}

// スタッフの2軸評価データを生成
export function generateTwoAxisEvaluation(
  staffName: string,
  facility: string,
  department: string,
  currentEvaluation: string
): TwoAxisEvaluationData {
  // 従来評価に基づいて2軸評価の範囲を決定
  const mapping = evaluationMapping[currentEvaluation] || evaluationMapping['B']
  
  // ランダムに評価を選択
  const facilityScore = mapping.facility[Math.floor(Math.random() * mapping.facility.length)]
  const corporateScore = mapping.corporate[Math.floor(Math.random() * mapping.corporate.length)]
  
  // 施設の総職員数を設定
  const facilityTotal = facility === '小原病院' ? 200 : 300
  const corporateTotal = 500
  
  // 順位を生成
  const facilityRank = generateRank(facilityScore, facilityTotal)
  const corporateRank = generateRank(corporateScore, corporateTotal)
  
  // 総合評価を計算
  const overallScore = calculateOverallScore(facilityScore, corporateScore)
  
  return {
    facilityScore,
    facilityRank,
    facilityTotal,
    corporateScore,
    corporateRank,
    corporateTotal,
    overallScore,
    evaluationDate: '2024-12-01',
    evaluator: '人事評価委員会',
    comments: `${staffName}さんは${department}において優れたパフォーマンスを示しています。`
  }
}

// 特定のスタッフの2軸評価データ（固定値）
export const fixedTwoAxisEvaluations: Record<string, TwoAxisEvaluationData> = {
  'OH-NS-2021-001': { // 田中美咲
    facilityScore: 'B',
    facilityRank: 45,
    facilityTotal: 200,
    corporateScore: 'A',
    corporateRank: 120,
    corporateTotal: 500,
    overallScore: 'A',
    evaluationDate: '2024-12-01',
    evaluator: '3階病棟 師長',
    comments: '施設内での安定した業務遂行能力を示し、法人全体でも高い評価を得ています。'
  },
  'OH-NS-2021-002': { // 佐藤花子
    facilityScore: 'A',
    facilityRank: 15,
    facilityTotal: 200,
    corporateScore: 'A',
    corporateRank: 85,
    corporateTotal: 500,
    overallScore: 'A+',
    evaluationDate: '2024-12-01',
    evaluator: '内科 部長',
    comments: '施設内でトップクラスの評価を維持し、法人全体でも優秀な成績です。'
  },
  'OH-NS-2021-003': { // 中村恵子
    facilityScore: 'C',
    facilityRank: 150,
    facilityTotal: 200,
    corporateScore: 'C',
    corporateRank: 380,
    corporateTotal: 500,
    overallScore: 'C',
    evaluationDate: '2024-12-01',
    evaluator: '第１病棟 師長',
    comments: '基本的な業務は遂行できていますが、更なる成長の余地があります。'
  },
  'TG-NS-2022-001': { // 伊藤由美
    facilityScore: 'S',
    facilityRank: 5,
    facilityTotal: 300,
    corporateScore: 'A',
    corporateRank: 95,
    corporateTotal: 500,
    overallScore: 'S',
    evaluationDate: '2024-12-01',
    evaluator: '緩和ケア病棟 師長',
    comments: '施設内で圧倒的なパフォーマンスを発揮し、法人全体でも高評価です。'
  },
  'TG-DR-2020-003': { // 木村洋子
    facilityScore: 'A',
    facilityRank: 25,
    facilityTotal: 300,
    corporateScore: 'S',
    corporateRank: 15,
    corporateTotal: 500,
    overallScore: 'S',
    evaluationDate: '2024-12-01',
    evaluator: 'リハビリテーション科 部長',
    comments: '専門性の高さが法人全体で高く評価されています。'
  }
}

// スタッフIDから2軸評価データを取得
export function getTwoAxisEvaluationByStaffId(staffId: string, staffData: any): TwoAxisEvaluationData {
  // 固定データがある場合はそれを返す
  if (fixedTwoAxisEvaluations[staffId]) {
    return fixedTwoAxisEvaluations[staffId]
  }
  
  // なければ生成
  return generateTwoAxisEvaluation(
    staffData.name,
    staffData.facility,
    staffData.department,
    staffData.evaluation
  )
}