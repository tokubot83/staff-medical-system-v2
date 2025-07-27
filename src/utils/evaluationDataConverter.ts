import { StaffDetail } from '@/types/staff'
import { 
  StaffEvaluation, 
  EvaluationHistory, 
  EvaluationGrade,
  EvaluationScores,
  calculateGradeFromScore,
  calculateTotalScore
} from '@/types/evaluation'

/**
 * 旧形式の評価データから新形式の評価データに変換
 */
export function convertToNewEvaluationFormat(staff: StaffDetail): StaffEvaluation | undefined {
  if (!staff.evaluationHistory || staff.evaluationHistory.length === 0) {
    return undefined
  }

  // 評価履歴を新形式に変換
  const history: EvaluationHistory[] = staff.evaluationHistory.map((oldEval, index) => {
    const scores: EvaluationScores = {
      performance: oldEval.performance,
      skill: oldEval.skills,
      teamwork: oldEval.teamwork,
      leadership: 3.5, // デフォルト値
      growth: oldEval.growth
    }

    const totalScore = calculateTotalScore(scores)
    const grade = oldEval.overall as EvaluationGrade || calculateGradeFromScore(totalScore)

    // 期間をパース
    const [year, period] = oldEval.period.split(' ')
    const periodMap: Record<string, 'H1' | 'H2'> = {
      '上期': 'H1',
      '下期': 'H2'
    }

    return {
      id: `eval_${staff.id}_${index}`,
      staffId: staff.id,
      period: {
        id: `period_${year}_${periodMap[period] || 'H1'}`,
        year: parseInt(year),
        period: periodMap[period] || 'H1',
        startDate: periodMap[period] === 'H1' ? `${year}-04-01` : `${year}-10-01`,
        endDate: periodMap[period] === 'H1' ? `${year}-09-30` : `${parseInt(year) + 1}-03-31`
      },
      grade,
      scores,
      totalScore,
      evaluatorId: `evaluator_${index}`,
      evaluatorName: oldEval.evaluator,
      evaluatorRole: '部門長',
      comments: {
        strengths: '優れた業務遂行能力を発揮しています。',
        improvements: '更なる成長が期待されます。',
        goals: '次期はリーダーシップスキルの向上を目指しましょう。'
      },
      status: 'finalized' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      finalizedAt: new Date().toISOString()
    }
  })

  // 最新の評価を取得
  const latestEval = history[0]
  const previousEval = history[1]

  // トレンドを計算
  let trend: 'up' | 'down' | 'stable' = 'stable'
  if (previousEval) {
    if (latestEval.totalScore > previousEval.totalScore) trend = 'up'
    else if (latestEval.totalScore < previousEval.totalScore) trend = 'down'
  }

  // JNAラダーの情報（看護師の場合）
  const jnaLadder = staff.department.includes('看護') ? {
    level: 'III' as const,
    certificationDate: '2023-04-01',
    nextTargetLevel: 'IV' as const
  } : undefined

  return {
    currentGrade: latestEval.grade,
    currentScores: latestEval.scores,
    previousGrade: previousEval?.grade,
    trend,
    history,
    nextEvaluationDate: staff.nextMeeting,
    jnaLadder
  }
}

/**
 * 評価グレードから数値スコアに変換（旧形式との互換性のため）
 */
export function gradeToScore(grade: EvaluationGrade): number {
  const scoreMap: Record<EvaluationGrade, number> = {
    S: 5.0,
    A: 4.5,
    B: 3.5,
    C: 2.5,
    D: 1.5
  }
  return scoreMap[grade]
}