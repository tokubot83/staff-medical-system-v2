'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  FileText, Calendar, User, TrendingUp, AlertCircle,
  CheckCircle, XCircle, Clock, ChevronLeft, Eye
} from 'lucide-react'
import type { CareerCourseChangeRequest, CareerCourseCode } from '@/types/staff'

/**
 * Phase 5-3: キャリアコース変更申請状況確認画面
 *
 * 機能:
 * - 自分の申請履歴一覧表示
 * - 申請状況（承認待ち/承認済み/却下/取下げ）表示
 * - 申請詳細表示
 * - 承認待ち申請の取下げ（将来実装）
 */
export default function MyRequestsPage() {
  const [requests, setRequests] = useState<CareerCourseChangeRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<CareerCourseChangeRequest | null>(null)

  useEffect(() => {
    fetchMyRequests()
  }, [])

  const fetchMyRequests = async () => {
    setLoading(true)
    try {
      // TODO: 実際のAPI呼び出しに置き換え
      // const response = await fetch('/api/career-course/my-requests')
      // const data = await response.json()

      // モックデータ
      setRequests([
        {
          id: 'req-003',
          staffId: 'OH-NS-2021-001',
          currentCourseCode: 'B',
          requestedCourseCode: 'A',
          changeReason: 'annual',
          reasonDetail: '管理職候補として、施設間異動を含む全面協力型コースへの変更を希望します。転居を伴う異動も受諾可能です。',
          requestedEffectiveDate: '2025-04-01',
          hrReviewerId: null,
          hrReviewerName: null,
          reviewedAt: null,
          reviewComment: null,
          approvalStatus: 'pending',
          rejectionReason: null,
          withdrawnAt: null,
          attachments: [],
          createdAt: '2025-09-25T10:30:00Z',
          updatedAt: '2025-09-25T10:30:00Z'
        },
        {
          id: 'req-002',
          staffId: 'OH-NS-2021-001',
          currentCourseCode: 'C',
          requestedCourseCode: 'B',
          changeReason: 'annual',
          reasonDetail: '部署異動に対応可能となったため、Bコースへの変更を希望します。',
          requestedEffectiveDate: '2025-04-01',
          hrReviewerId: 'HR-001',
          hrReviewerName: '人事部長',
          reviewedAt: '2024-03-20T15:00:00Z',
          reviewComment: '職務能力を評価し、承認します。',
          approvalStatus: 'approved',
          rejectionReason: null,
          withdrawnAt: null,
          attachments: [],
          createdAt: '2024-03-01T09:00:00Z',
          updatedAt: '2024-03-20T15:00:00Z'
        },
        {
          id: 'req-001',
          staffId: 'OH-NS-2021-001',
          currentCourseCode: 'C',
          requestedCourseCode: 'D',
          changeReason: 'special_caregiving',
          reasonDetail: '親の介護のため、夜勤なしのDコースへの変更を希望します。',
          requestedEffectiveDate: '2023-10-01',
          hrReviewerId: 'HR-001',
          hrReviewerName: '人事部長',
          reviewedAt: '2023-09-15T14:00:00Z',
          reviewComment: '介護事由を確認し、特例として却下します。勤務調整で対応可能と判断。',
          approvalStatus: 'rejected',
          rejectionReason: '現在の勤務シフト調整で対応可能なため。',
          withdrawnAt: null,
          attachments: ['介護状況証明書.pdf'],
          createdAt: '2023-09-10T10:00:00Z',
          updatedAt: '2023-09-15T14:00:00Z'
        }
      ])
    } catch (error) {
      console.error('申請データ取得エラー:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            承認待ち
          </Badge>
        )
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            承認済み
          </Badge>
        )
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-700 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            却下
          </Badge>
        )
      case 'withdrawn':
        return (
          <Badge className="bg-gray-100 text-gray-700 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            取下げ
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getCourseLabel = (code: CareerCourseCode) => {
    const courseMap = {
      A: { name: 'Aコース', color: 'text-blue-600' },
      B: { name: 'Bコース', color: 'text-green-600' },
      C: { name: 'Cコース', color: 'text-purple-600' },
      D: { name: 'Dコース', color: 'text-orange-600' }
    }
    return courseMap[code] || { name: code, color: 'text-gray-600' }
  }

  const getChangeReasonLabel = (reason: string) => {
    switch (reason) {
      case 'annual':
        return '年1回定期変更'
      case 'special_pregnancy':
        return '特例変更（妊娠・出産）'
      case 'special_caregiving':
        return '特例変更（介護）'
      case 'special_illness':
        return '特例変更（疾病）'
      default:
        return reason
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">データを読み込んでいます...</p>
        </div>
      </div>
    )
  }

  // 詳細表示モード
  if (selectedRequest) {
    const fromCourse = getCourseLabel(selectedRequest.currentCourseCode)
    const toCourse = getCourseLabel(selectedRequest.requestedCourseCode)

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 戻るボタン */}
          <button
            onClick={() => setSelectedRequest(null)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            申請一覧に戻る
          </button>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  申請詳細
                </span>
                {getStatusBadge(selectedRequest.approvalStatus)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 申請ID・日時 */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">申請ID:</span>
                  <span className="font-mono text-gray-900">{selectedRequest.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">申請日時:</span>
                  <span className="text-gray-900">{formatDateTime(selectedRequest.createdAt)}</span>
                </div>
              </div>

              {/* コース変更内容 */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  変更内容
                </h3>
                <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${fromCourse.color}`}>
                      {selectedRequest.currentCourseCode}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{fromCourse.name}</div>
                  </div>
                  <div className="text-gray-400 text-2xl">→</div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${toCourse.color}`}>
                      {selectedRequest.requestedCourseCode}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{toCourse.name}</div>
                  </div>
                </div>
              </div>

              {/* 変更事由 */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">変更事由</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">事由区分:</span>
                    <span className="font-medium text-gray-900">
                      {getChangeReasonLabel(selectedRequest.changeReason)}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-900">
                    {selectedRequest.reasonDetail}
                  </div>
                </div>
              </div>

              {/* 希望適用日 */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  希望適用日
                </h3>
                <div className="text-lg font-semibold text-gray-900">
                  {formatDate(selectedRequest.requestedEffectiveDate)}
                </div>
              </div>

              {/* 添付ファイル */}
              {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">添付ファイル</h3>
                  <ul className="space-y-2">
                    {selectedRequest.attachments.map((filename, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-blue-600 hover:underline cursor-pointer">
                          {filename}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 審査結果（承認済み・却下の場合） */}
              {selectedRequest.approvalStatus !== 'pending' && selectedRequest.approvalStatus !== 'withdrawn' && (
                <div className={`p-4 rounded-lg border-2 ${
                  selectedRequest.approvalStatus === 'approved'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    {selectedRequest.approvalStatus === 'approved' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    審査結果
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">審査者:</span>
                      <span className="font-medium text-gray-900">
                        {selectedRequest.hrReviewerName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">審査日時:</span>
                      <span className="text-gray-900">
                        {selectedRequest.reviewedAt && formatDateTime(selectedRequest.reviewedAt)}
                      </span>
                    </div>
                    {selectedRequest.reviewComment && (
                      <div className="mt-2 bg-white p-3 rounded border border-gray-200">
                        <div className="text-gray-600 text-xs mb-1">コメント:</div>
                        <div className="text-gray-900">{selectedRequest.reviewComment}</div>
                      </div>
                    )}
                    {selectedRequest.rejectionReason && (
                      <div className="mt-2 bg-white p-3 rounded border border-red-200">
                        <div className="text-red-600 text-xs mb-1">却下理由:</div>
                        <div className="text-gray-900">{selectedRequest.rejectionReason}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 承認待ちの場合の取下げボタン（将来実装） */}
              {selectedRequest.approvalStatus === 'pending' && (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    disabled
                    className="w-full py-2 px-4 bg-gray-100 text-gray-400 rounded-lg border border-gray-300 cursor-not-allowed text-sm"
                  >
                    申請を取り下げる（今後実装予定）
                  </button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    申請の取下げ機能は今後実装予定です
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // 一覧表示モード
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-7 h-7" />
            コース変更申請状況
          </h1>
          <p className="text-gray-600 mt-2">
            あなたのキャリアコース変更申請の履歴と現在の状況を確認できます。
          </p>
        </div>

        {/* 統計サマリー */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {requests.length}
                  </div>
                  <div className="text-sm text-gray-600">総申請数</div>
                </div>
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {requests.filter(r => r.approvalStatus === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-600">承認待ち</div>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {requests.filter(r => r.approvalStatus === 'approved').length}
                  </div>
                  <div className="text-sm text-gray-600">承認済み</div>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {requests.filter(r => r.approvalStatus === 'rejected').length}
                  </div>
                  <div className="text-sm text-gray-600">却下</div>
                </div>
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 申請一覧 */}
        <Card>
          <CardHeader>
            <CardTitle>申請履歴</CardTitle>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">申請履歴がありません</p>
                <button
                  onClick={() => window.location.href = '/my-page/career-course/change-request'}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  新しい申請を作成
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => {
                  const fromCourse = getCourseLabel(request.currentCourseCode)
                  const toCourse = getCourseLabel(request.requestedCourseCode)

                  return (
                    <div
                      key={request.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => setSelectedRequest(request)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${fromCourse.color}`}>
                              {request.currentCourseCode}
                            </span>
                            <span className="text-gray-400">→</span>
                            <span className={`font-bold ${toCourse.color}`}>
                              {request.requestedCourseCode}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {getChangeReasonLabel(request.changeReason)}
                          </div>
                        </div>
                        {getStatusBadge(request.approvalStatus)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>申請日:</span>
                          <span className="text-gray-900">{formatDate(request.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>希望適用日:</span>
                          <span className="text-gray-900">{formatDate(request.requestedEffectiveDate)}</span>
                        </div>
                      </div>

                      {request.reasonDetail && (
                        <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {request.reasonDetail.length > 100
                            ? request.reasonDetail.substring(0, 100) + '...'
                            : request.reasonDetail}
                        </div>
                      )}

                      <div className="mt-3 flex items-center justify-end">
                        <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          詳細を見る
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 新規申請ボタン */}
        {requests.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => window.location.href = '/my-page/career-course/change-request'}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              新しい申請を作成
            </button>
          </div>
        )}
      </div>
    </div>
  )
}