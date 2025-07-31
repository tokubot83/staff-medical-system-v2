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

    const profile = await twoAxisEvaluationService.getEmployeeEvaluationProfile(
      employeeId
    )

    if (!profile) {
      return NextResponse.json(
        { error: '職員が見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching employee profile:', error)
    return NextResponse.json(
      { error: 'プロファイルの取得中にエラーが発生しました' },
      { status: 500 }
    )
  }
}