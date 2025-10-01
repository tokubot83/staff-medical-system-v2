'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  User, Building2, Calendar, TrendingUp, FileText,
  Bell, Settings, ChevronRight, Clock, Award
} from 'lucide-react'
import CareerCourseCard from '@/components/career-course/CareerCourseCard'
import type { CareerCourseSelection, StaffDetail } from '@/types/staff'

/**
 * Phase 5-3: 職員向けマイページ
 *
 * 機能:
 * - 基本情報表示
 * - キャリアコース情報表示
 * - コース変更申請へのリンク
 * - 申請状況確認
 */
export default function MyPage() {
  const [staffData, setStaffData] = useState<StaffDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyData()
  }, [])

  const fetchMyData = async () => {
    setLoading(true)
    try {
      // TODO: 実際のAPI呼び出しに置き換え
      // const response = await fetch('/api/my-page')
      // const data = await response.json()

      // モックデータ
      setStaffData({
        id: 'OH-NS-2021-001',
        name: '山田 花子',
        nameInitial: 'YH',
        position: '看護師',
        department: '3階病棟',
        facility: '小原病院',
        employeeId: 'OH-NS-2021-001',
        joinDate: '2021-04-01',
        tenure: '3年6ヶ月',
        age: 29,
        birthDate: '1995-03-15',
        evaluation: 'A',
        evaluationPeriod: '2024年度',
        nextMeeting: '2025-10-15',
        healthStatus: '良好',
        stressIndex: 35,
        engagement: 82,
        overtime: 15,
        paidLeaveRate: 75,
        avatar: '/avatars/default.png',
        email: 'yamada.hanako@example.com',
        phone: '090-1234-5678',
        emergencyContact: '090-9876-5432',
        address: '鹿児島県出水市',
        evaluationHistory: [],
        skills: [],

        // キャリアコース情報（Phase 5-3）
        careerCourse: {
          id: 'cc-001',
          staffId: 'OH-NS-2021-001',
          courseCode: 'B',
          courseName: 'Bコース（施設内協力型）',
          effectiveFrom: '2025-04-01',
          effectiveTo: null,
          nextChangeAvailableDate: '2026-03-01',
          specialChangeReason: null,
          specialChangeNote: null,
          changeRequestedAt: null,
          changeRequestedBy: null,
          approvedAt: '2025-03-25T10:00:00Z',
          approvedBy: 'HR-001',
          approvalStatus: 'approved',
          rejectionReason: null,
          createdAt: '2025-03-01T09:00:00Z',
          updatedAt: '2025-03-25T10:00:00Z'
        }
      })
    } catch (error) {
      console.error('データ取得エラー:', error)
    } finally {
      setLoading(false)
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

  if (!staffData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">データを取得できませんでした</p>
        </div>
      </div>
    )
  }

  // 勤続年数計算
  const calculateTenure = (joinDate: string) => {
    const join = new Date(joinDate)
    const today = new Date()
    const diffTime = today.getTime() - join.getTime()
    const years = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365))
    const months = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))
    return `${years}年${months}ヶ月`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
                {staffData.nameInitial}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{staffData.name}</h1>
                <p className="text-blue-100 mt-1">
                  {staffData.facility} {staffData.department} / {staffData.position}
                </p>
              </div>
            </div>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左カラム: 基本情報 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 基本情報カード */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  基本情報
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">所属:</span>
                  <span className="font-medium">{staffData.facility}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">部署:</span>
                  <span className="font-medium">{staffData.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">職種:</span>
                  <span className="font-medium">{staffData.position}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">入職日:</span>
                  <span className="font-medium">{staffData.joinDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">勤続年数:</span>
                  <span className="font-medium">{calculateTenure(staffData.joinDate)}</span>
                </div>
              </CardContent>
            </Card>

            {/* クイックアクションカード */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  クイックアクション
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button
                  onClick={() => window.location.href = '/my-page/career-course/change-request'}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">コース変更申請</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button
                  onClick={() => window.location.href = '/my-page/career-course/my-requests'}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-green-600" />
                    <span className="font-medium">申請状況確認</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-orange-600" />
                    <span className="font-medium">通知設定</span>
                    <Badge variant="outline" className="text-xs">
                      準備中
                    </Badge>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </CardContent>
            </Card>
          </div>

          {/* 右カラム: キャリアコース情報 */}
          <div className="lg:col-span-2">
            <CareerCourseCard
              careerCourse={staffData.careerCourse}
              staffId={staffData.id}
              canEdit={true}
            />

            {/* コース比較カード（将来実装） */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  他のコースと比較
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    他のコースの詳細情報や、自分に合ったコースの診断機能は今後実装予定です。
                  </p>
                  <button
                    disabled
                    className="mt-3 px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm cursor-not-allowed"
                  >
                    コース診断を開始（準備中）
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}