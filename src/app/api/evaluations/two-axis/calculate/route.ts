import { NextRequest, NextResponse } from 'next/server'
import { twoAxisEvaluationService } from '@/services/twoAxisEvaluationService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { employeeId, evaluationId, period, score } = body

    if (!employeeId || !evaluationId || !period || score === undefined) {
      return NextResponse.json(
        { error: '必須パラメータが不足しています' },
        { status: 400 }
      )
    }

    if (score < 0 || score > 100) {
      return NextResponse.json(
        { error: 'スコアは0〜100の範囲で指定してください' },
        { status: 400 }
      )
    }

    const twoAxisEvaluation = await twoAxisEvaluationService.calculateAndSaveTwoAxisEvaluation(
      employeeId,
      evaluationId,
      period,
      score
    )

    return NextResponse.json({
      success: true,
      data: twoAxisEvaluation,
    })
  } catch (error) {
    console.error('Error calculating two-axis evaluation:', error)
    return NextResponse.json(
      { error: '2軸評価の計算中にエラーが発生しました' },
      { status: 500 }
    )
  }
}