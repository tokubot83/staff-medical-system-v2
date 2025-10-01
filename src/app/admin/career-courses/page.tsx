'use client'

import React, { useState, useEffect } from 'react'
import {
  Users, TrendingUp, AlertCircle, CheckCircle,
  Clock, Edit, Plus, Eye, Settings, BarChart3,
  FileText, User, Calendar, Building2, XCircle
} from 'lucide-react'
import type {
  CourseDefinitionWithCount,
  CareerCourseStatistics,
  CareerCourseCode,
  CareerCourseChangeRequest
} from '@/types/staff'

/**
 * Phase 5-2: キャリアコース管理画面（人事部向け）
 *
 * 機能:
 * 1. コース定義一覧・編集
 * 2. コース別職員数・割合表示
 * 3. 統計情報ダッシュボード
 * 4. 変更申請審査（Phase 5-3連携）
 */
export default function CareerCoursesAdminPage() {
  const [courses, setCourses] = useState<CourseDefinitionWithCount[]>([])
  const [statistics, setStatistics] = useState<CareerCourseStatistics | null>(null)
  const [requests, setRequests] = useState<CareerCourseChangeRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'definitions' | 'statistics'>('overview')

  useEffect(() => {
    fetchData()
    fetchRequests()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // TODO: 実際のAPI呼び出しに置き換え
      // const response = await fetch('/api/career-courses/admin')
      // const data = await response.json()

      // モックデータ
      setCourses([
        {
          id: '1',
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
          salaryNotes: null,
          isActive: true,
          displayOrder: 1,
          createdAt: '2025-09-30T00:00:00Z',
          updatedAt: '2025-09-30T00:00:00Z',
          currentStaffCount: 0,
          percentage: 0
        },
        {
          id: '2',
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
          salaryNotes: null,
          isActive: true,
          displayOrder: 2,
          createdAt: '2025-09-30T00:00:00Z',
          updatedAt: '2025-09-30T00:00:00Z',
          currentStaffCount: 0,
          percentage: 0
        },
        {
          id: '3',
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
          salaryNotes: null,
          isActive: true,
          displayOrder: 3,
          createdAt: '2025-09-30T00:00:00Z',
          updatedAt: '2025-09-30T00:00:00Z',
          currentStaffCount: 0,
          percentage: 0
        },
        {
          id: '4',
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
          salaryNotes: null,
          isActive: true,
          displayOrder: 4,
          createdAt: '2025-09-30T00:00:00Z',
          updatedAt: '2025-09-30T00:00:00Z',
          currentStaffCount: 0,
          percentage: 0
        }
      ])

      setStatistics({
        totalStaff: 0,
        byCourse: [],
        pendingChangeRequests: 3,
        recentChanges: []
      })
    } catch (error) {
      console.error('データ取得エラー:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRequests = async () => {
    try {
      // TODO: 実際のAPI呼び出しに置き換え
      // const response = await fetch('/api/admin/career-course/requests')
      // const data = await response.json()

      // モックデータ（VoiceDriveから送信される申請データ）
      setRequests([
        {
          id: 'req-004',
          staffId: 'OH-NS-2023-005',
          staffName: '佐藤 美咲',
          facility: '小原病院',
          department: '2階病棟',
          position: '看護師',
          currentCourseCode: 'C',
          requestedCourseCode: 'B',
          changeReason: 'annual',
          reasonDetail: '管理職候補として、部署異動に対応可能なBコースへの変更を希望します。',
          requestedEffectiveDate: '2026-04-01',
          hrReviewerId: null,
          hrReviewerName: null,
          reviewedAt: null,
          reviewComment: null,
          approvalStatus: 'pending',
          rejectionReason: null,
          withdrawnAt: null,
          attachments: [],
          createdAt: '2025-09-28T14:20:00Z',
          updatedAt: '2025-09-28T14:20:00Z'
        },
        {
          id: 'req-005',
          staffId: 'TG-PT-2022-012',
          staffName: '田中 健太',
          facility: '立神リハビリテーション温泉病院',
          department: 'リハビリテーション科',
          position: '理学療法士',
          currentCourseCode: 'B',
          requestedCourseCode: 'A',
          changeReason: 'annual',
          reasonDetail: '施設間異動を含む全面協力型コースへ変更し、複数施設での経験を積みたい。',
          requestedEffectiveDate: '2026-04-01',
          hrReviewerId: null,
          hrReviewerName: null,
          reviewedAt: null,
          reviewComment: null,
          approvalStatus: 'pending',
          rejectionReason: null,
          withdrawnAt: null,
          attachments: [],
          createdAt: '2025-09-27T09:15:00Z',
          updatedAt: '2025-09-27T09:15:00Z'
        },
        {
          id: 'req-006',
          staffId: 'OH-NS-2020-018',
          staffName: '鈴木 花子',
          facility: '小原病院',
          department: '4階病棟',
          position: '看護師',
          currentCourseCode: 'C',
          requestedCourseCode: 'D',
          changeReason: 'special_pregnancy',
          reasonDetail: '第一子妊娠のため、夜勤なしのDコースへの変更を申請します。',
          requestedEffectiveDate: '2025-11-01',
          hrReviewerId: null,
          hrReviewerName: null,
          reviewedAt: null,
          reviewComment: null,
          approvalStatus: 'pending',
          rejectionReason: null,
          withdrawnAt: null,
          attachments: ['妊娠診断書.pdf'],
          createdAt: '2025-09-26T16:40:00Z',
          updatedAt: '2025-09-26T16:40:00Z'
        }
      ])
    } catch (error) {
      console.error('申請データ取得エラー:', error)
    }
  }

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

  const getCourseColorClass = (courseCode: CareerCourseCode) => {
    switch (courseCode) {
      case 'A': return 'bg-blue-50 border-blue-200 text-blue-700'
      case 'B': return 'bg-green-50 border-green-200 text-green-700'
      case 'C': return 'bg-purple-50 border-purple-200 text-purple-700'
      case 'D': return 'bg-orange-50 border-orange-200 text-orange-700'
      default: return 'bg-gray-50 border-gray-200 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">データを読み込んでいます...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* ヘッダー */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-7 h-7" />
          キャリアコース選択制度 管理
        </h1>
        <p className="mt-2 text-gray-600">
          A～D 4コースの定義管理、職員の所属状況、変更申請の承認を行います
        </p>
      </div>

      {/* 統計サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">総職員数</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {statistics?.totalStaff || 0}名
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">承認待ち申請</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                {statistics?.pendingChangeRequests || 0}件
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
          {(statistics?.pendingChangeRequests || 0) > 0 && (
            <button className="mt-2 text-sm text-blue-600 hover:underline">
              承認画面を開く →
            </button>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">アクティブコース</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {courses.filter(c => c.isActive).length}種類
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">今月の変更</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {statistics?.recentChanges?.[0]?.count || 0}件
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Eye className="w-4 h-4 inline-block mr-2" />
              コース概要
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors relative ${
                activeTab === 'requests'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 inline-block mr-2" />
              変更申請審査
              {requests.filter(r => r.approvalStatus === 'pending').length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-orange-500 rounded-full">
                  {requests.filter(r => r.approvalStatus === 'pending').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('definitions')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'definitions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Settings className="w-4 h-4 inline-block mr-2" />
              コース定義管理
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'statistics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline-block mr-2" />
              統計情報
            </button>
          </nav>
        </div>

        {/* タブコンテンツ */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                コース一覧
              </h2>
              {courses.map((course) => (
                <div
                  key={course.id}
                  className={`p-4 rounded-lg border-2 ${getCourseColorClass(course.courseCode)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold">
                          {course.courseCode}
                        </span>
                        <h3 className="text-lg font-semibold">
                          {course.courseName}
                        </h3>
                        {course.isActive && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            有効
                          </span>
                        )}
                      </div>
                      <p className="text-sm mb-3">
                        {course.description}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">部署異動:</span>
                          <span className="ml-2 font-medium">
                            {course.departmentTransferAvailable ? '可' : '不可'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">施設間異動:</span>
                          <span className="ml-2 font-medium">
                            {getFacilityTransferLabel(course.facilityTransferAvailable)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">夜勤:</span>
                          <span className="ml-2 font-medium">
                            {getNightShiftLabel(course.nightShiftAvailable)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">管理職登用:</span>
                          <span className="ml-2 font-medium">
                            {course.managementTrack ? '対象' : '対象外'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">基本給係数:</span>
                          <span className="ml-2 font-bold">
                            {course.baseSalaryMultiplier.toFixed(2)}倍
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">所属職員数:</span>
                          <span className="ml-2 font-bold">
                            {course.currentStaffCount}名
                            <span className="text-xs ml-1">
                              ({course.percentage.toFixed(1)}%)
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="ml-4 p-2 hover:bg-white/50 rounded-lg transition-colors">
                      <Edit className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* 新規コース追加ボタン */}
              <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-gray-600 hover:text-blue-600 flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                新しいコースを追加（E/Fコース等）
              </button>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  変更申請審査
                </h2>
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-sm bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors">
                    承認待ちのみ ({requests.filter(r => r.approvalStatus === 'pending').length})
                  </button>
                  <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    すべて表示 ({requests.length})
                  </button>
                </div>
              </div>

              {/* VoiceDriveからの申請通知 */}
              {requests.filter(r => r.approvalStatus === 'pending').length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-orange-800 font-medium">
                        VoiceDriveから {requests.filter(r => r.approvalStatus === 'pending').length} 件の申請が届いています
                      </p>
                      <p className="text-sm text-orange-700 mt-1">
                        職員が「キャリアステーション」から申請したコース変更の審査をお願いします。
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 申請一覧 */}
              {requests.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">申請はありません</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => {
                    const isPending = request.approvalStatus === 'pending'
                    const isSpecial = request.changeReason.startsWith('special_')

                    return (
                      <div
                        key={request.id}
                        className={`border rounded-lg p-4 ${
                          isPending
                            ? isSpecial
                              ? 'border-red-300 bg-red-50'
                              : 'border-orange-300 bg-orange-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        {/* ヘッダー部分 */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-500" />
                                <span className="font-semibold text-gray-900">
                                  {request.staffName || '職員名未設定'}
                                </span>
                              </div>
                              <span className="text-sm text-gray-600">
                                ({request.staffId})
                              </span>
                              {isSpecial && (
                                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                  特例変更
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                <span>{request.facility || '施設未設定'} / {request.department || '部署未設定'}</span>
                              </div>
                              <span>{request.position || '職種未設定'}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            {isPending ? (
                              <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
                                <Clock className="w-4 h-4 mr-1" />
                                承認待ち
                              </span>
                            ) : request.approvalStatus === 'approved' ? (
                              <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                承認済み
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                                <XCircle className="w-4 h-4 mr-1" />
                                却下
                              </span>
                            )}
                          </div>
                        </div>

                        {/* コース変更内容 */}
                        <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3">
                          <div className="flex items-center justify-center gap-4">
                            <div className="text-center">
                              <div className={`text-2xl font-bold ${
                                request.currentCourseCode === 'A' ? 'text-blue-600' :
                                request.currentCourseCode === 'B' ? 'text-green-600' :
                                request.currentCourseCode === 'C' ? 'text-purple-600' :
                                'text-orange-600'
                              }`}>
                                {request.currentCourseCode}
                              </div>
                              <div className="text-xs text-gray-600 mt-1">現在</div>
                            </div>
                            <div className="text-2xl text-gray-400">→</div>
                            <div className="text-center">
                              <div className={`text-2xl font-bold ${
                                request.requestedCourseCode === 'A' ? 'text-blue-600' :
                                request.requestedCourseCode === 'B' ? 'text-green-600' :
                                request.requestedCourseCode === 'C' ? 'text-purple-600' :
                                'text-orange-600'
                              }`}>
                                {request.requestedCourseCode}
                              </div>
                              <div className="text-xs text-gray-600 mt-1">希望</div>
                            </div>
                          </div>
                        </div>

                        {/* 変更理由 */}
                        <div className="mb-3">
                          <div className="text-sm text-gray-600 mb-1">変更理由:</div>
                          <div className="text-sm bg-white border border-gray-200 rounded p-2">
                            <span className="font-medium">
                              {request.changeReason === 'annual' ? '年1回定期変更' :
                               request.changeReason === 'special_pregnancy' ? '特例変更（妊娠・出産）' :
                               request.changeReason === 'special_caregiving' ? '特例変更（介護）' :
                               request.changeReason === 'special_illness' ? '特例変更（疾病）' : request.changeReason}
                            </span>
                            {request.reasonDetail && (
                              <p className="mt-2 text-gray-700">{request.reasonDetail}</p>
                            )}
                          </div>
                        </div>

                        {/* 添付ファイル */}
                        {request.attachments && request.attachments.length > 0 && (
                          <div className="mb-3">
                            <div className="text-sm text-gray-600 mb-1">添付ファイル:</div>
                            <div className="flex flex-wrap gap-2">
                              {request.attachments.map((file, index) => (
                                <span key={index} className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded border border-blue-200">
                                  <FileText className="w-4 h-4 mr-1" />
                                  {file}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 申請日時・希望適用日 */}
                        <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>申請日: {new Date(request.createdAt).toLocaleDateString('ja-JP')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>希望適用日: {new Date(request.requestedEffectiveDate).toLocaleDateString('ja-JP')}</span>
                          </div>
                        </div>

                        {/* アクションボタン */}
                        {isPending && (
                          <div className="flex gap-2 pt-3 border-t border-gray-200">
                            <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                              <CheckCircle className="w-4 h-4 inline-block mr-2" />
                              承認する
                            </button>
                            <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                              <XCircle className="w-4 h-4 inline-block mr-2" />
                              却下する
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'definitions' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                コース定義管理
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-800 font-medium">
                      コース定義の変更は慎重に行ってください
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      基本給係数や異動条件の変更は、既存職員の労働条件に影響します。
                      理事会承認と労基署への届出が必要になる場合があります。
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                コース定義の編集機能は今後実装予定です。
              </p>
            </div>
          )}

          {activeTab === 'statistics' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                統計情報
              </h2>
              <p className="text-gray-600">
                コース別の詳細統計、変更履歴の分析機能は今後実装予定です。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}