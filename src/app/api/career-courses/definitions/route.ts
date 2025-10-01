import { NextRequest, NextResponse } from 'next/server'
// import { createClient } from '@/lib/supabase'

/**
 * Phase 5-3 API: キャリアコース定義一覧取得
 * GET /api/career-courses/definitions
 *
 * 機能:
 * - アクティブなコース定義（A～D）を取得
 * - コース変更申請フォームで選択肢として使用
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: 実際のDB取得処理を実装
    // const supabase = createClient()
    // const { data, error } = await supabase
    //   .from('course_definitions')
    //   .select('*')
    //   .eq('is_active', true)
    //   .order('display_order', { ascending: true })

    // モックデータ（開発用）
    const mockDefinitions = [
      {
        id: 'course-def-a',
        courseCode: 'A',
        courseName: 'Aコース（全面協力型）',
        description: '部署・施設間異動に全面協力し、管理職候補として育成対象。転居を伴う転勤も受諾。夜勤あり。',
        departmentTransferAvailable: true,
        facilityTransferAvailable: 'full',
        relocationRequired: true,
        nightShiftAvailable: 'required',
        managementTrack: true,
        baseSalaryMultiplier: 1.2,
        salaryGrade: null,
        salaryNotes: '基本給係数1.2倍適用',
        isActive: true,
        displayOrder: 1,
        createdAt: '2025-09-01T00:00:00Z',
        updatedAt: '2025-09-01T00:00:00Z'
      },
      {
        id: 'course-def-b',
        courseCode: 'B',
        courseName: 'Bコース（施設内協力型）',
        description: '同一施設内の部署異動（病棟移動等）に対応。施設間異動なし。管理職登用対象。夜勤あり。',
        departmentTransferAvailable: true,
        facilityTransferAvailable: 'none',
        relocationRequired: false,
        nightShiftAvailable: 'required',
        managementTrack: true,
        baseSalaryMultiplier: 1.1,
        salaryGrade: null,
        salaryNotes: '基本給係数1.1倍適用',
        isActive: true,
        displayOrder: 2,
        createdAt: '2025-09-01T00:00:00Z',
        updatedAt: '2025-09-01T00:00:00Z'
      },
      {
        id: 'course-def-c',
        courseCode: 'C',
        courseName: 'Cコース（専門職型）',
        description: '現在の部署・施設で専門性を発揮。プライベート優先。管理職登用なし。夜勤選択可。',
        departmentTransferAvailable: false,
        facilityTransferAvailable: 'none',
        relocationRequired: false,
        nightShiftAvailable: 'selectable',
        managementTrack: false,
        baseSalaryMultiplier: 1.0,
        salaryGrade: null,
        salaryNotes: '基本給係数1.0倍（基準）',
        isActive: true,
        displayOrder: 3,
        createdAt: '2025-09-01T00:00:00Z',
        updatedAt: '2025-09-01T00:00:00Z'
      },
      {
        id: 'course-def-d',
        courseCode: 'D',
        courseName: 'Dコース（時短・制約あり型）',
        description: '育児・介護等の制約により勤務条件に配慮が必要。夜勤なし。異動なし。',
        departmentTransferAvailable: false,
        facilityTransferAvailable: 'none',
        relocationRequired: false,
        nightShiftAvailable: 'none',
        managementTrack: false,
        baseSalaryMultiplier: 0.9,
        salaryGrade: null,
        salaryNotes: '基本給係数0.9倍適用',
        isActive: true,
        displayOrder: 4,
        createdAt: '2025-09-01T00:00:00Z',
        updatedAt: '2025-09-01T00:00:00Z'
      }
    ]

    return NextResponse.json(mockDefinitions, { status: 200 })
  } catch (error) {
    console.error('コース定義取得エラー:', error)
    return NextResponse.json(
      { error: 'データ取得に失敗しました' },
      { status: 500 }
    )
  }
}