import { NextRequest, NextResponse } from 'next/server'
import { twoAxisEvaluationService } from '@/services/twoAxisEvaluationService'

export async function GET(
  request: NextRequest,
  { params }: { params: { employeeId: string } }
) {
  try {
    const { employeeId } = params

    if (!employeeId) {
      return NextResponse.json(
        { error: '職員IDが指定されていません' },
        { status: 400 }
      )
    }

    const analysis = await twoAxisEvaluationService.getEvaluationAnalysis(
      employeeId
    )

    if (!analysis) {
      return NextResponse.json(
        { error: '職員が見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error fetching evaluation analysis:', error)
    return NextResponse.json(
      { error: '評価分析の取得中にエラーが発生しました' },
      { status: 500 }
    )
  }
}