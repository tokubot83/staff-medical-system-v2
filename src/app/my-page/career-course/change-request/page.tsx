'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp, AlertCircle, CheckCircle, X, Upload,
  Calendar, FileText, ChevronLeft, Info
} from 'lucide-react'
import type { CareerCourseCode, CourseDefinition, CourseChangeReason } from '@/types/staff'

/**
 * Phase 5-3: コース変更申請フォーム
 *
 * 機能:
 * - 現在のコース表示
 * - 変更先コース選択
 * - 変更理由選択（定期/特例）
 * - 希望適用日選択
 * - 添付ファイルアップロード（特例時）
 */
export default function CareerCourseChangeRequestPage() {
  const [loading, setLoading] = useState(false)
  const [currentCourse, setCurrentCourse] = useState<CareerCourseCode>('B')
  const [requestedCourse, setRequestedCourse] = useState<CareerCourseCode | null>(null)
  const [changeReason, setChangeReason] = useState<CourseChangeReason>('annual')
  const [reasonDetail, setReasonDetail] = useState('')
  const [requestedEffectiveDate, setRequestedEffectiveDate] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)

  // コース定義（実際はAPIから取得）
  const courses: CourseDefinition[] = [
    {
      id: '1',
      courseCode: 'A',
      courseName: 'Aコース（全面協力型）',
      description: '部署・施設間異動に全面協力。管理職候補。基本給×1.2',
      departmentTransferAvailable: true,
      facilityTransferAvailable: 'full',
      relocationRequired: true,
      nightShiftAvailable: 'required',
      managementTrack: true,
      baseSalaryMultiplier: 1.2,
      salaryGrade: null,
      salaryNotes: null,
      isActive: true,
      displayOrder: 1,
      createdAt: '',
      updatedAt: ''
    },
    {
      id: '2',
      courseCode: 'B',
      courseName: 'Bコース（施設内協力型）',
      description: '施設内の部署異動に対応。管理職候補。基本給×1.1',
      departmentTransferAvailable: true,
      facilityTransferAvailable: 'none',
      relocationRequired: false,
      nightShiftAvailable: 'required',
      managementTrack: true,
      baseSalaryMultiplier: 1.1,
      salaryGrade: null,
      salaryNotes: null,
      isActive: true,
      displayOrder: 2,
      createdAt: '',
      updatedAt: ''
    },
    {
      id: '3',
      courseCode: 'C',
      courseName: 'Cコース（専門職型）',
      description: '異動なし。専門性重視。基本給×1.0',
      departmentTransferAvailable: false,
      facilityTransferAvailable: 'none',
      relocationRequired: false,
      nightShiftAvailable: 'selectable',
      managementTrack: false,
      baseSalaryMultiplier: 1.0,
      salaryGrade: null,
      salaryNotes: null,
      isActive: true,
      displayOrder: 3,
      createdAt: '',
      updatedAt: ''
    },
    {
      id: '4',
      courseCode: 'D',
      courseName: 'Dコース（時短・制約あり型）',
      description: '育児・介護等の制約に配慮。基本給×0.9',
      departmentTransferAvailable: false,
      facilityTransferAvailable: 'none',
      relocationRequired: false,
      nightShiftAvailable: 'none',
      managementTrack: false,
      baseSalaryMultiplier: 0.9,
      salaryGrade: null,
      salaryNotes: null,
      isActive: true,
      displayOrder: 4,
      createdAt: '',
      updatedAt: ''
    }
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowConfirmation(true)
  }

  const confirmSubmit = async () => {
    setLoading(true)
    try {
      // TODO: 実際のAPI呼び出しに置き換え
      // const formData = new FormData()
      // formData.append('currentCourse', currentCourse)
      // formData.append('requestedCourse', requestedCourse!)
      // formData.append('changeReason', changeReason)
      // formData.append('reasonDetail', reasonDetail)
      // formData.append('requestedEffectiveDate', requestedEffectiveDate)
      // attachments.forEach((file) => formData.append('attachments', file))
      // const response = await fetch('/api/career-course/change-request', {
      //   method: 'POST',
      //   body: formData
      // })

      // モック: 2秒待機
      await new Promise((resolve) => setTimeout(resolve, 2000))

      alert('コース変更申請を送信しました。承認をお待ちください。')
      window.location.href = '/my-page'
    } catch (error) {
      console.error('申請送信エラー:', error)
      alert('申請の送信に失敗しました。もう一度お試しください。')
    } finally {
      setLoading(false)
      setShowConfirmation(false)
    }
  }

  const getCourseColorClass = (courseCode: CareerCourseCode) => {
    switch (courseCode) {
      case 'A': return 'bg-blue-50 border-blue-200 text-blue-700'
      case 'B': return 'bg-green-50 border-green-200 text-green-700'
      case 'C': return 'bg-purple-50 border-purple-200 text-purple-700'
      case 'D': return 'bg-orange-50 border-orange-200 text-orange-700'
      default: return 'bg-gray-50 border-gray-200 text-gray-700'
    }
  }

  const isSpecialReason = changeReason.startsWith('special_')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-2"
          >
            <ChevronLeft className="w-5 h-5" />
            マイページに戻る
          </button>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-7 h-7" />
            キャリアコース変更申請
          </h1>
          <p className="mt-1 text-gray-600">
            希望するコースを選択し、変更理由を入力してください
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 注意事項 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">コース変更について</p>
              <ul className="list-disc list-inside space-y-1">
                <li>年1回の定期変更が可能です（通常3月申請→4月適用）</li>
                <li>妊娠・育児・介護等の特例事由の場合は即時変更が可能です</li>
                <li>変更には人事部の承認が必要です（審査期間: 約1～2週間）</li>
                <li>承認後、指定した適用日からコースが変更されます</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 現在のコース */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">現在のコース</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`p-4 rounded-lg border-2 ${getCourseColorClass(currentCourse)}`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold">{currentCourse}</span>
                  <div>
                    <div className="font-semibold">
                      {courses.find((c) => c.courseCode === currentCourse)?.courseName}
                    </div>
                    <div className="text-sm opacity-80">
                      {courses.find((c) => c.courseCode === currentCourse)?.description}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 変更先コース選択 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">変更先コースを選択</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {courses
                .filter((course) => course.courseCode !== currentCourse)
                .map((course) => (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => setRequestedCourse(course.courseCode)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      requestedCourse === course.courseCode
                        ? `${getCourseColorClass(course.courseCode)} border-4`
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold">{course.courseCode}</span>
                      <div className="flex-1">
                        <div className="font-semibold">{course.courseName}</div>
                        <div className="text-sm text-gray-600 mt-1">{course.description}</div>
                      </div>
                      {requestedCourse === course.courseCode && (
                        <CheckCircle className="w-6 h-6 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
            </CardContent>
          </Card>

          {requestedCourse && (
            <>
              {/* 変更理由選択 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">変更理由</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="changeReason"
                        value="annual"
                        checked={changeReason === 'annual'}
                        onChange={(e) => setChangeReason(e.target.value as CourseChangeReason)}
                        className="w-4 h-4"
                      />
                      <div>
                        <div className="font-medium">年次定期変更</div>
                        <div className="text-sm text-gray-600">
                          通常の年1回の変更期間内での申請
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="changeReason"
                        value="special_pregnancy"
                        checked={changeReason === 'special_pregnancy'}
                        onChange={(e) => setChangeReason(e.target.value as CourseChangeReason)}
                        className="w-4 h-4"
                      />
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          特例: 妊娠・出産
                          <Badge variant="outline" className="text-xs">即時対応</Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          妊娠により勤務条件の変更が必要な場合
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="changeReason"
                        value="special_caregiving"
                        checked={changeReason === 'special_caregiving'}
                        onChange={(e) => setChangeReason(e.target.value as CourseChangeReason)}
                        className="w-4 h-4"
                      />
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          特例: 介護
                          <Badge variant="outline" className="text-xs">即時対応</Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          家族の介護により勤務条件の変更が必要な場合
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="changeReason"
                        value="special_illness"
                        checked={changeReason === 'special_illness'}
                        onChange={(e) => setChangeReason(e.target.value as CourseChangeReason)}
                        className="w-4 h-4"
                      />
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          特例: 疾病
                          <Badge variant="outline" className="text-xs">即時対応</Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          疾病により勤務条件の変更が必要な場合
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* 詳細理由入力 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      詳細理由（任意）
                    </label>
                    <textarea
                      value={reasonDetail}
                      onChange={(e) => setReasonDetail(e.target.value)}
                      placeholder="変更を希望する詳しい理由があれば記入してください"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 希望適用日 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">希望適用日</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <input
                      type="date"
                      value={requestedEffectiveDate}
                      onChange={(e) => setRequestedEffectiveDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {isSpecialReason && (
                    <p className="mt-2 text-sm text-gray-600">
                      ※ 特例変更の場合、最短で申請翌日から適用可能です
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* 添付ファイル（特例時のみ） */}
              {isSpecialReason && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      添付ファイル
                      <Badge variant="destructive" className="text-xs">必須</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                      <p className="text-sm text-yellow-800">
                        特例変更の場合、診断書や介護認定書等の証明書類の添付が必要です
                      </p>
                    </div>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    {attachments.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">
                          添付ファイル ({attachments.length}件):
                        </p>
                        <ul className="space-y-1">
                          {attachments.map((file, index) => (
                            <li key={index} className="text-sm text-gray-700">
                              • {file.name} ({(file.size / 1024).toFixed(1)} KB)
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* 送信ボタン */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={!requestedEffectiveDate || (isSpecialReason && attachments.length === 0)}
                  className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  申請を送信
                </button>
              </div>
            </>
          )}
        </form>
      </div>

      {/* 確認モーダル */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
                申請内容の確認
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">現在のコース:</span>
                  <span className="font-medium">{currentCourse}コース</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">変更先コース:</span>
                  <span className="font-medium">{requestedCourse}コース</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">変更理由:</span>
                  <span className="font-medium">
                    {changeReason === 'annual' ? '年次定期変更' :
                     changeReason === 'special_pregnancy' ? '特例: 妊娠・出産' :
                     changeReason === 'special_caregiving' ? '特例: 介護' :
                     changeReason === 'special_illness' ? '特例: 疾病' : ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">希望適用日:</span>
                  <span className="font-medium">{requestedEffectiveDate}</span>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  この内容で申請を送信してもよろしいですか？<br />
                  送信後、人事部の承認をお待ちください。
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  disabled={loading}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  キャンセル
                </button>
                <button
                  onClick={confirmSubmit}
                  disabled={loading}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      送信中...
                    </>
                  ) : (
                    '送信する'
                  )}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}