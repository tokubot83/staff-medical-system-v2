import {
  TwoAxisEvaluation,
  EvaluationGrade,
  FinalEvaluationGrade,
  EmployeeEvaluationProfile,
  EvaluationAnalysis,
  calculateEvaluationGrade,
  calculatePercentile,
  formatPercentile,
  getFinalEvaluation,
  generateRecommendation,
} from '@/types/two-axis-evaluation'
import {
  demoEmployeeProfiles,
  demoEvaluationAnalyses,
} from '@/data/twoAxisEvaluationDemoData'

export class TwoAxisEvaluationService {
  // 2軸評価を計算して保存（モック実装）
  async calculateAndSaveTwoAxisEvaluation(
    employeeId: string,
    evaluationId: string,
    period: string,
    score: number
  ): Promise<TwoAxisEvaluation> {
    // デモ用の計算ロジック
    const facilityRank = Math.floor(Math.random() * 15) + 1
    const facilityTotal = 15
    const corporateRank = Math.floor(Math.random() * 280) + 1
    const corporateTotal = 280

    const facilityEvaluation = calculateEvaluationGrade(facilityRank, facilityTotal)
    const corporateEvaluation = calculateEvaluationGrade(corporateRank, corporateTotal)
    const { grade: finalEvaluation } = getFinalEvaluation(corporateEvaluation, facilityEvaluation)

    // モックレスポンスを返す
    const mockEvaluation: TwoAxisEvaluation = {
      id: Math.random().toString(36).substr(2, 9),
      employeeId,
      evaluationId,
      evaluationPeriod: period,
      score,
      facilityRank,
      facilityTotal,
      facilityEvaluation,
      facilityPercentile: calculatePercentile(facilityRank, facilityTotal),
      corporateRank,
      corporateTotal,
      corporateEvaluation,
      corporatePercentile: calculatePercentile(corporateRank, corporateTotal),
      finalEvaluation,
      jobCategory: '看護職',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return mockEvaluation
  }

  // 職員評価プロファイルを取得
  async getEmployeeEvaluationProfile(
    employeeId: string
  ): Promise<EmployeeEvaluationProfile | null> {
    // デモデータから取得
    return demoEmployeeProfiles[employeeId] || null
  }

  // 評価分析を取得
  async getEvaluationAnalysis(employeeId: string): Promise<EvaluationAnalysis | null> {
    // デモデータから取得
    return demoEvaluationAnalyses[employeeId] || null
  }
}

export const twoAxisEvaluationService = new TwoAxisEvaluationService()