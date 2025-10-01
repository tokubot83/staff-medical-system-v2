'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp, Building2, Users, Moon, Award, DollarSign,
  Info, Calendar, AlertCircle
} from 'lucide-react'
import type { CareerCourseSelection, CareerCourseCode } from '@/types/staff'

interface CareerCourseCardProps {
  careerCourse?: CareerCourseSelection
  staffId?: string
  canEdit?: boolean
}

/**
 * Phase 5-2: 職員カルテ内のキャリアコース表示カード
 *
 * 機能:
 * - 現在のコース表示（A/B/C/D）
 * - 条件・待遇の表示
 * - 次回変更可能日の表示
 * - コース変更申請ボタン（将来実装）
 */
export default function CareerCourseCard({
  careerCourse,
  staffId,
  canEdit = false
}: CareerCourseCardProps) {
  // モックデータ（実際は careerCourse から取得）
  const courseCode: CareerCourseCode = careerCourse?.courseCode || 'B'
  const courseName = careerCourse?.courseName || 'Bコース（施設内協力型）'
  const effectiveFrom = careerCourse?.effectiveFrom || '2025-04-01'
  const nextChangeAvailableDate = careerCourse?.nextChangeAvailableDate || '2026-03-01'

  // コースごとの設定（マスターデータから取得すべきだが、ここでは簡略化）
  const courseConfig = {
    A: {
      name: 'Aコース（全面協力型）',
      color: 'blue',
      departmentTransfer: true,
      facilityTransfer: 'full',
      nightShift: 'required',
      managementTrack: true,
      multiplier: 1.2
    },
    B: {
      name: 'Bコース（施設内協力型）',
      color: 'green',
      departmentTransfer: true,
      facilityTransfer: 'none',
      nightShift: 'required',
      managementTrack: true,
      multiplier: 1.1
    },
    C: {
      name: 'Cコース（専門職型）',
      color: 'purple',
      departmentTransfer: false,
      facilityTransfer: 'none',
      nightShift: 'selectable',
      managementTrack: false,
      multiplier: 1.0
    },
    D: {
      name: 'Dコース（時短・制約あり型）',
      color: 'orange',
      departmentTransfer: false,
      facilityTransfer: 'none',
      nightShift: 'none',
      managementTrack: false,
      multiplier: 0.9
    }
  }

  const config = courseConfig[courseCode]

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        badge: 'bg-blue-100 text-blue-700'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-700',
        badge: 'bg-green-100 text-green-700'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-700',
        badge: 'bg-purple-100 text-purple-700'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-700',
        badge: 'bg-orange-100 text-orange-700'
      }
    }
    return colorMap[color] || colorMap.blue
  }

  const colors = getColorClasses(config.color)

  const getFacilityTransferLabel = (level: string) => {
    switch (level) {
      case 'full': return '全施設対象'
      case 'limited': return 'エリア限定（未使用）'
      case 'none': return '施設内のみ'
      default: return level
    }
  }

  const getNightShiftLabel = (level: string) => {
    switch (level) {
      case 'required': return '必須'
      case 'selectable': return '選択可'
      case 'none': return 'なし'
      default: return level
    }
  }

  // 次回変更可能日までの日数計算
  const daysUntilChange = Math.floor(
    (new Date(nextChangeAvailableDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <Card className={`border-2 ${colors.border} ${colors.bg}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className={`w-5 h-5 ${colors.text}`} />
          <span className={colors.text}>キャリアコース</span>
          <Badge className={colors.badge}>
            Phase 5
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 現在のコース */}
        <div className={`p-4 rounded-lg border-2 ${colors.border} bg-white`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className={`text-3xl font-bold ${colors.text}`}>
                {courseCode}
              </span>
              <div>
                <div className={`font-semibold ${colors.text}`}>
                  {config.name}
                </div>
                <div className="text-sm text-gray-600">
                  適用開始: {effectiveFrom}
                </div>
              </div>
            </div>
          </div>

          {/* コース条件 */}
          <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">部署異動:</span>
              <span className="font-medium">
                {config.departmentTransfer ? '可' : '不可'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">施設間異動:</span>
              <span className="font-medium">
                {getFacilityTransferLabel(config.facilityTransfer)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">夜勤:</span>
              <span className="font-medium">
                {getNightShiftLabel(config.nightShift)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">管理職登用:</span>
              <span className="font-medium">
                {config.managementTrack ? '対象' : '対象外'}
              </span>
            </div>

            <div className="flex items-center gap-2 col-span-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">基本給係数:</span>
              <span className="font-bold">
                {config.multiplier.toFixed(2)}倍
              </span>
              <span className="text-xs text-gray-500 ml-2">
                （給与体系は人事部にお問い合わせください）
              </span>
            </div>
          </div>
        </div>

        {/* 次回変更可能日 */}
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              次回変更可能日
            </span>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {nextChangeAvailableDate}
            <span className="text-sm text-gray-600 ml-2">
              （あと{daysUntilChange}日）
            </span>
          </div>
          {daysUntilChange < 60 && (
            <div className="mt-2 text-xs text-gray-600">
              年1回の定期変更期間が近づいています
            </div>
          )}
        </div>

        {/* 情報・注意事項 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">コース変更について</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>年1回の定期変更が可能です（通常3月申請→4月適用）</li>
                <li>妊娠・育児・介護等の特例事由の場合は即時変更可能</li>
                <li>変更には人事部の承認が必要です</li>
              </ul>
            </div>
          </div>
        </div>

        {/* コース変更申請ボタン（将来実装） */}
        {canEdit && (
          <button
            disabled
            className="w-full py-2 px-4 bg-gray-100 text-gray-400 rounded-lg border border-gray-300 cursor-not-allowed"
          >
            コース変更申請（今後実装予定）
          </button>
        )}

        {/* 特例変更の場合の表示 */}
        {careerCourse?.specialChangeReason && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">特例変更</p>
                <p className="mt-1">
                  事由: {careerCourse.specialChangeReason === 'pregnancy' ? '妊娠・出産' :
                         careerCourse.specialChangeReason === 'caregiving' ? '介護' :
                         careerCourse.specialChangeReason === 'illness' ? '疾病' : ''}
                </p>
                {careerCourse.specialChangeNote && (
                  <p className="mt-1 text-xs">{careerCourse.specialChangeNote}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}