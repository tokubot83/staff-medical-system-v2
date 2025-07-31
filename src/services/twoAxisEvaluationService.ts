import { PrismaClient } from '@prisma/client'
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

const prisma = new PrismaClient()

export class TwoAxisEvaluationService {
  // 2軸評価を計算して保存
  async calculateAndSaveTwoAxisEvaluation(
    employeeId: string,
    evaluationId: string,
    period: string,
    score: number
  ): Promise<TwoAxisEvaluation> {
    // 職員情報を取得
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        facility: true,
        position: true,
      },
    })

    if (!employee) {
      throw new Error('職員が見つかりません')
    }

    // 職種を決定（簡易的な実装）
    const jobCategory = this.determineJobCategory(employee.position.name)

    // 施設内の同職種の評価を取得
    const facilityEvaluations = await prisma.evaluation.findMany({
      where: {
        period,
        employee: {
          facilityId: employee.facilityId,
          position: {
            name: {
              contains: jobCategory,
            },
          },
        },
      },
      select: {
        employeeId: true,
        performanceScore: true,
        skillScore: true,
        teamworkScore: true,
        leadershipScore: true,
        growthScore: true,
      },
    })

    // 法人内の同職種の評価を取得
    const corporateEvaluations = await prisma.evaluation.findMany({
      where: {
        period,
        employee: {
          position: {
            name: {
              contains: jobCategory,
            },
          },
        },
      },
      select: {
        employeeId: true,
        performanceScore: true,
        skillScore: true,
        teamworkScore: true,
        leadershipScore: true,
        growthScore: true,
      },
    })

    // スコアを計算（リーダーシップスコアは役職者のみ）
    const calculateTotalScore = (evaluation: any) => {
      const scores = [
        evaluation.performanceScore,
        evaluation.skillScore,
        evaluation.teamworkScore,
        evaluation.growthScore,
      ]
      if (evaluation.leadershipScore !== null) {
        scores.push(evaluation.leadershipScore)
      }
      return scores.reduce((sum, score) => sum + score, 0) / scores.length
    }

    // 施設内でのランキングを計算
    const facilityScores = facilityEvaluations.map(e => ({
      employeeId: e.employeeId,
      score: calculateTotalScore(e),
    }))
    facilityScores.sort((a, b) => b.score - a.score)
    const facilityRank = facilityScores.findIndex(e => e.employeeId === employeeId) + 1
    const facilityTotal = facilityScores.length
    const facilityEvaluation = calculateEvaluationGrade(facilityRank, facilityTotal)
    const facilityPercentile = calculatePercentile(facilityRank, facilityTotal)

    // 法人内でのランキングを計算
    const corporateScores = corporateEvaluations.map(e => ({
      employeeId: e.employeeId,
      score: calculateTotalScore(e),
    }))
    corporateScores.sort((a, b) => b.score - a.score)
    const corporateRank = corporateScores.findIndex(e => e.employeeId === employeeId) + 1
    const corporateTotal = corporateScores.length
    const corporateEvaluation = calculateEvaluationGrade(corporateRank, corporateTotal)
    const corporatePercentile = calculatePercentile(corporateRank, corporateTotal)

    // 最終評価を決定
    const { grade: finalEvaluation } = getFinalEvaluation(corporateEvaluation, facilityEvaluation)

    // 2軸評価を保存
    const twoAxisEvaluation = await prisma.twoAxisEvaluation.upsert({
      where: {
        employeeId_evaluationPeriod: {
          employeeId,
          evaluationPeriod: period,
        },
      },
      update: {
        evaluationId,
        score,
        facilityRank,
        facilityTotal,
        facilityEvaluation,
        facilityPercentile,
        corporateRank,
        corporateTotal,
        corporateEvaluation,
        corporatePercentile,
        finalEvaluation,
        jobCategory,
      },
      create: {
        employeeId,
        evaluationId,
        evaluationPeriod: period,
        score,
        facilityRank,
        facilityTotal,
        facilityEvaluation,
        facilityPercentile,
        corporateRank,
        corporateTotal,
        corporateEvaluation,
        corporatePercentile,
        finalEvaluation,
        jobCategory,
      },
    })

    return twoAxisEvaluation as TwoAxisEvaluation
  }

  // 職員評価プロファイルを取得
  async getEmployeeEvaluationProfile(
    employeeId: string
  ): Promise<EmployeeEvaluationProfile | null> {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        facility: true,
        position: true,
        twoAxisEvaluations: {
          orderBy: { evaluationPeriod: 'desc' },
          take: 1,
        },
      },
    })

    if (!employee) {
      return null
    }

    const profile: EmployeeEvaluationProfile = {
      employee: {
        id: employee.id,
        employeeCode: employee.employeeCode,
        name: employee.name,
        position: employee.position.name,
        jobCategory: this.determineJobCategory(employee.position.name),
        facility: {
          id: employee.facility.id,
          name: employee.facility.name,
          type: employee.facility.type,
        },
        hireDate: employee.hireDate.toISOString(),
      },
    }

    // 最新の2軸評価がある場合
    if (employee.twoAxisEvaluations.length > 0) {
      const latestEval = employee.twoAxisEvaluations[0]
      const { description } = getFinalEvaluation(
        latestEval.corporateEvaluation as EvaluationGrade,
        latestEval.facilityEvaluation as EvaluationGrade
      )
      const recommendation = generateRecommendation(
        latestEval.corporateEvaluation as EvaluationGrade,
        latestEval.facilityEvaluation as EvaluationGrade,
        latestEval.finalEvaluation as FinalEvaluationGrade
      )

      profile.currentEvaluation = {
        period: latestEval.evaluationPeriod,
        score: latestEval.score,
        facilityEvaluation: {
          grade: latestEval.facilityEvaluation as EvaluationGrade,
          rank: latestEval.facilityRank,
          total: latestEval.facilityTotal,
          percentile: formatPercentile(latestEval.facilityRank, latestEval.facilityTotal),
        },
        corporateEvaluation: {
          grade: latestEval.corporateEvaluation as EvaluationGrade,
          rank: latestEval.corporateRank,
          total: latestEval.corporateTotal,
          percentile: formatPercentile(latestEval.corporateRank, latestEval.corporateTotal),
        },
        finalEvaluation: {
          grade: latestEval.finalEvaluation as FinalEvaluationGrade,
          description,
          recommendation,
        },
      }
    }

    return profile
  }

  // 評価分析を取得
  async getEvaluationAnalysis(employeeId: string): Promise<EvaluationAnalysis | null> {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        position: true,
        twoAxisEvaluations: {
          orderBy: { evaluationPeriod: 'desc' },
          take: 10, // 最新10期分
        },
      },
    })

    if (!employee) {
      return null
    }

    const evaluationHistory = employee.twoAxisEvaluations.map(eval => ({
      period: eval.evaluationPeriod,
      score: eval.score,
      facilityEval: eval.facilityEvaluation as EvaluationGrade,
      corporateEval: eval.corporateEvaluation as EvaluationGrade,
      finalEval: eval.finalEvaluation as FinalEvaluationGrade,
    }))

    // 成長分析
    const growthAnalysis = this.analyzeGrowth(evaluationHistory)

    // 異動分析
    const transferAnalysis = this.analyzeTransferSuitability(
      evaluationHistory,
      employee.position.name
    )

    return {
      employeeBasic: {
        id: employee.id,
        name: employee.name,
        position: employee.position.name,
      },
      evaluationHistory,
      growthAnalysis,
      transferAnalysis,
    }
  }

  // 職種を判定する（簡易的な実装）
  private determineJobCategory(positionName: string): string {
    if (positionName.includes('看護')) return '看護職'
    if (positionName.includes('介護')) return '介護職'
    if (positionName.includes('リハビリ') || positionName.includes('療法士')) return 'リハビリ職'
    if (positionName.includes('事務')) return '事務職'
    if (positionName.includes('医師')) return '医師'
    return 'その他'
  }

  // 成長分析
  private analyzeGrowth(history: any[]): any {
    if (history.length < 2) {
      return {
        scoreTrend: 'データ不足',
        strengthArea: '評価データが蓄積されていません',
        improvementArea: '継続的な評価が必要です',
        careerPath: '今後の評価結果を基に判定',
      }
    }

    const latestScore = history[0].score
    const previousScore = history[1].score
    const scoreDiff = latestScore - previousScore

    let scoreTrend = '横ばい'
    if (scoreDiff > 3) scoreTrend = `上昇傾向（+${scoreDiff.toFixed(1)}点）`
    else if (scoreDiff < -3) scoreTrend = `下降傾向（${scoreDiff.toFixed(1)}点）`

    // 強みと改善点を判定
    const latestEval = history[0]
    let strengthArea = ''
    let improvementArea = ''

    if (latestEval.facilityEval === 'S' || latestEval.facilityEval === 'A') {
      strengthArea = '施設内リーダーシップ'
    } else if (latestEval.corporateEval === 'S' || latestEval.corporateEval === 'A') {
      strengthArea = '専門性・技術力'
    } else {
      strengthArea = '安定した業務遂行'
    }

    if (latestEval.corporateEval === 'C' || latestEval.corporateEval === 'D') {
      improvementArea = '法人全体での専門性向上'
    } else if (latestEval.facilityEval === 'C' || latestEval.facilityEval === 'D') {
      improvementArea = '施設内でのチームワーク強化'
    } else {
      improvementArea = '次のステップへの準備'
    }

    // キャリアパス提案
    let careerPath = ''
    if (latestEval.finalEval === 'S+' || latestEval.finalEval === 'S') {
      careerPath = '管理職候補、専門分野リーダー'
    } else if (latestEval.finalEval === 'A+' || latestEval.finalEval === 'A') {
      careerPath = '主任候補、教育担当者'
    } else if (latestEval.finalEval === 'B') {
      careerPath = '現職での専門性向上、チームリーダー候補'
    } else {
      careerPath = '基礎スキル向上、メンター制度活用'
    }

    return {
      scoreTrend,
      strengthArea,
      improvementArea,
      careerPath,
    }
  }

  // 異動適性分析
  private analyzeTransferSuitability(history: any[], currentPosition: string): any {
    if (history.length === 0) {
      return {
        currentFit: 'データ不足',
        recommendedAction: '評価データ蓄積後に判定',
        alternativePaths: [],
      }
    }

    const latestEval = history[0]
    let currentFit = ''
    let recommendedAction = ''
    const alternativePaths: string[] = []

    // 施設内評価と法人内評価のギャップを分析
    const facilityGrade = ['S', 'A', 'B', 'C', 'D'].indexOf(latestEval.facilityEval)
    const corporateGrade = ['S', 'A', 'B', 'C', 'D'].indexOf(latestEval.corporateEval)
    const gradeGap = Math.abs(facilityGrade - corporateGrade)

    if (gradeGap >= 2) {
      // 大きなギャップがある場合
      if (facilityGrade < corporateGrade) {
        currentFit = '施設特性に非常に適合'
        recommendedAction = '現施設での継続的な活躍を推奨'
        alternativePaths.push('同規模施設での管理職')
      } else {
        currentFit = '能力を十分に発揮できていない可能性'
        recommendedAction = 'より大規模施設への異動を検討'
        alternativePaths.push('大規模施設でのチャレンジ')
        alternativePaths.push('専門性を活かせる部署への異動')
      }
    } else {
      // バランスが取れている場合
      currentFit = '適性良好'
      if (latestEval.finalEval === 'S+' || latestEval.finalEval === 'S') {
        recommendedAction = '昇進・昇格の検討'
        alternativePaths.push('管理職としての登用')
        alternativePaths.push('法人本部での専門職')
      } else if (latestEval.finalEval === 'A+' || latestEval.finalEval === 'A') {
        recommendedAction = '現職継続＋スキル向上支援'
        alternativePaths.push('教育担当者としての育成')
        alternativePaths.push('専門分野でのリーダー職')
      } else {
        recommendedAction = '現職での成長を支援'
        alternativePaths.push('メンター制度の活用')
        alternativePaths.push('研修プログラムへの参加')
      }
    }

    return {
      currentFit,
      recommendedAction,
      alternativePaths,
    }
  }
}

export const twoAxisEvaluationService = new TwoAxisEvaluationService()