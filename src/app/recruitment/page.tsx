'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'


// コンポーネントのインポート
import TalentPipelineDashboard from '@/components/recruitment/TalentPipelineDashboard'
import VisitorManagementNew from '@/components/recruitment/VisitorManagementNew'
import ApplicantManagementNew from '@/components/recruitment/ApplicantManagementNew'
import TalentSearchPanel from '@/components/recruitment/TalentSearchPanel'

// 型定義のインポート
import {
  TalentProfile,
  TalentStatus,
  PipelineMetrics,
  VisitReservation,
  DuplicateCheckResult,
  TalentSearchQuery
} from '@/types/talentPipeline'
import {
  JobPosting,
  Applicant,
  InterviewSchedule
} from '@/types/recruitment'

// アイコン
import {
  Users, Eye, UserCheck, BarChart3, Search, TrendingUp
} from 'lucide-react'

export default function RecruitmentPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  // サンプルデータ
  const [talents] = useState<TalentProfile[]>([
    {
      id: '1',
      basicInfo: {
        lastName: '山田',
        firstName: '太郎',
        lastNameKana: 'ヤマダ',
        firstNameKana: 'タロウ',
        email: 'yamada@example.com',
        phone: '090-1234-5678',
        birthDate: '1990-01-01',
        gender: '男性',
        firstContactDate: '2024-01-15',
        lastContactDate: '2024-01-20',
        source: '求人サイト'
      },
      currentStatus: 'visitor-scheduled' as TalentStatus,
      currentStage: 'visitor',
      tags: ['新卒', '高評価'],
      visitorInfo: {
        scheduledVisitDate: '2024-02-01',
        interestedDepartments: ['看護部', '内科'],
        interestedPositions: ['看護師'],
        visitPurpose: '施設見学・職場体験'
      },
      contactHistory: [],
      flags: {
        isDuplicate: false,
        hasMultipleFacilityApplications: false,
        isPreviousEmployee: false,
        isBlacklisted: false
      },
      metadata: {
        createdAt: '2024-01-15',
        createdBy: 'admin',
        updatedAt: '2024-01-20',
        updatedBy: 'admin',
        viewCount: 5
      }
    },
    {
      id: '2',
      basicInfo: {
        lastName: '佐藤',
        firstName: '花子',
        lastNameKana: 'サトウ',
        firstNameKana: 'ハナコ',
        email: 'sato@example.com',
        phone: '090-2345-6789',
        birthDate: '1988-05-15',
        gender: '女性',
        firstContactDate: '2024-01-10',
        lastContactDate: '2024-01-25',
        source: '紹介'
      },
      currentStatus: 'applicant-interview' as TalentStatus,
      currentStage: 'applicant',
      tags: ['経験者', '即戦力'],
      applicantInfo: {
        desiredPosition: '看護師',
        desiredSalary: { min: 400, max: 500 },
        availableStartDate: '2024-03-01',
        currentEmployment: '他院勤務中',
        documents: { resume: { fileName: 'resume.pdf', uploadedAt: '2024-01-20', version: 1 } },
        qualifications: ['正看護師', '認定看護師'],
        licenses: [],
        skills: [],
        experience: [{
          company: 'A病院',
          position: '看護師',
          startDate: '2015-04-01',
          endDate: '2024-01-31',
          isCurrent: true,
          responsibilities: '病棟看護業務'
        }],
        education: [{
          institution: 'B看護専門学校',
          degree: '看護学',
          major: '看護',
          graduationDate: '2015-03'
        }]
      },
      contactHistory: [],
      flags: {
        isDuplicate: false,
        hasMultipleFacilityApplications: false,
        isPreviousEmployee: false,
        isBlacklisted: false
      },
      metadata: {
        createdAt: '2024-01-10',
        createdBy: 'admin',
        updatedAt: '2024-01-25',
        updatedBy: 'admin',
        viewCount: 10
      }
    },
    {
      id: '3',
      basicInfo: {
        lastName: '鈴木',
        firstName: '次郎',
        lastNameKana: 'スズキ',
        firstNameKana: 'ジロウ',
        email: 'suzuki@example.com',
        phone: '090-3456-7890',
        birthDate: '1985-10-20',
        gender: '男性',
        firstContactDate: '2023-12-01',
        lastContactDate: '2024-01-15',
        source: '直接応募'
      },
      currentStatus: 'talent-pool' as TalentStatus,
      currentStage: 'inactive',
      tags: ['高評価', '将来候補'],
      talentPoolInfo: {
        addedDate: '2024-01-15',
        addedBy: 'HR部長',
        category: 'future-fit',
        potentialPositions: ['理学療法士', 'リハビリ主任'],
        recontactDate: '2024-04-01',
        priority: 'high',
        notes: '経験豊富で優秀だが、現在のポジションに空きなし。次期昇進候補として保持。'
      },
      contactHistory: [],
      flags: {
        isDuplicate: false,
        hasMultipleFacilityApplications: false,
        isPreviousEmployee: false,
        isBlacklisted: false
      },
      metadata: {
        createdAt: '2023-12-01',
        createdBy: 'admin',
        updatedAt: '2024-01-15',
        updatedBy: 'admin',
        viewCount: 15
      }
    }
  ])

  const [visitReservations] = useState<VisitReservation[]>([
    {
      id: 'v1',
      talentId: '1',
      scheduledDate: '2024-02-01',
      scheduledTime: '14:00',
      facility: '小原病院',
      departments: ['看護部', '内科'],
      visitType: 'individual',
      coordinator: {
        id: 'c1',
        name: '田中 美智子',
        department: '人事部'
      },
      guides: [{
        id: 'g1',
        name: '看護部長',
        department: '看護部',
        timeSlot: '14:00-15:00'
      }],
      agenda: [{
        time: '14:00',
        activity: '施設案内',
        location: '本館',
        responsible: '人事部'
      }],
      status: 'confirmed'
    }
  ])

  const [jobPostings] = useState<JobPosting[]>([
    {
      id: 'j1',
      title: '看護師（病棟）',
      department: '看護部',
      facility: 'obara-hospital',
      employmentType: '正社員',
      requiredQualifications: ['正看護師免許', '病棟経験3年以上'],
      desiredQualifications: ['認定看護師資格', '管理経験'],
      jobDescription: '病棟での看護業務全般を担当していただきます。',
      numberOfPositions: 3,
      salary: { min: 400, max: 600 },
      benefits: ['社会保険完備', '退職金制度', '研修制度充実'],
      workLocation: '鹿児島県鹿児島市',
      workHours: '8:30-17:30（シフト制）',
      postingDate: '2024-01-01',
      closingDate: '2024-02-28',
      status: 'active',
      createdBy: 'admin',
      updatedAt: '2024-01-20'
    },
    {
      id: 'j2',
      title: '理学療法士',
      department: 'リハビリテーション科',
      facility: 'tachigami-hospital',
      employmentType: '正社員',
      requiredQualifications: ['理学療法士免許'],
      desiredQualifications: ['リハビリ施設経験3年以上', '温泉療法知識'],
      jobDescription: 'リハビリテーション業務および温泉療法を組み合わせた治療を行います。',
      numberOfPositions: 2,
      salary: { min: 350, max: 500 },
      benefits: ['社会保険完備', '退職金制度', '温泉施設利用可'],
      workLocation: '鹿児島県指宿市',
      workHours: '8:30-17:30',
      postingDate: '2024-01-10',
      closingDate: '2024-03-15',
      status: 'active',
      createdBy: 'admin',
      updatedAt: '2024-01-22'
    },
    {
      id: 'j3',
      title: '介護職員',
      department: '介護部',
      facility: 'espoir-tachigami',
      employmentType: '正社員',
      requiredQualifications: ['介護福祉士または初任者研修修了'],
      desiredQualifications: ['特別養護老人ホーム経験', '認知症ケア経験'],
      jobDescription: '特別養護老人ホームでの介護業務全般を担当していただきます。',
      numberOfPositions: 5,
      salary: { min: 280, max: 400 },
      benefits: ['社会保険完備', '退職金制度', '資格取得支援'],
      workLocation: '鹿児島県指宿市',
      workHours: '7:00-16:00/10:00-19:00/16:00-翌9:00（シフト制）',
      postingDate: '2024-01-05',
      closingDate: '2024-02-20',
      status: 'active',
      createdBy: 'admin',
      updatedAt: '2024-01-18'
    },
    {
      id: 'j4',
      title: 'ケアスタッフ',
      department: '介護部',
      facility: 'hojuan',
      employmentType: 'パート',
      requiredQualifications: ['介護職員初任者研修修了以上'],
      desiredQualifications: ['有料老人ホーム経験'],
      jobDescription: '有料老人ホームでのケア業務を担当していただきます。',
      numberOfPositions: 3,
      salary: { min: 1200, max: 1500 },
      benefits: ['交通費支給', '昇給制度あり'],
      workLocation: '鹿児島県鹿児島市',
      workHours: '9:00-18:00（週3日〜）',
      postingDate: '2024-01-15',
      closingDate: '2024-02-25',
      status: 'active',
      createdBy: 'admin',
      updatedAt: '2024-01-20'
    }
  ])

  const [applicants] = useState<Applicant[]>([
    {
      id: 'a1',
      jobPostingId: 'j1',
      firstName: '花子',
      lastName: '佐藤',
      firstNameKana: 'ハナコ',
      lastNameKana: 'サトウ',
      email: 'sato@example.com',
      phone: '090-2345-6789',
      birthDate: '1988-05-15',
      gender: '女性',
      currentEmployment: '他院勤務中',
      desiredSalary: 450,
      availableStartDate: '2024-03-01',
      resume: { fileName: 'resume.pdf', uploadedAt: '2024-01-20' },
      qualifications: ['正看護師'],
      experience: [{
        company: 'A病院',
        position: '看護師',
        duration: '5年',
        description: '病棟勤務'
      }],
      education: [{
        school: 'B看護専門学校',
        degree: '看護学',
        graduationYear: '2015'
      }],
      applicationDate: '2024-01-20',
      status: 'first-interview',
      evaluations: [],
      notes: []
    }
  ])

  const [interviewSchedules] = useState<InterviewSchedule[]>([
    {
      id: 'i1',
      applicantId: 'a1',
      jobPostingId: 'j1',
      interviewType: 'first',
      scheduledDate: '2024-02-05',
      scheduledTime: '10:00',
      duration: 60,
      location: '本館3F会議室A',
      interviewers: [{
        id: 'int1',
        name: '人事部長',
        position: '部長',
        department: '人事部'
      }],
      status: 'scheduled'
    }
  ])

  const [metrics] = useState<PipelineMetrics>({
    stageDistribution: {
      visitors: 15,
      applicants: 25,
      offerHolders: 5,
      employees: 3,
      talentPool: 12,
      inactive: 8
    },
    conversionRates: {
      visitorToApplicant: 65,
      applicantToInterview: 80,
      interviewToOffer: 40,
      offerToEmployee: 85
    },
    averageDuration: {
      visitToApplication: 7,
      applicationToInterview: 5,
      interviewToOffer: 10,
      offerToEmployment: 14
    },
    sourceEffectiveness: [
      { source: '求人サイト', visitors: 30, applicants: 20, hires: 5, conversionRate: 25, averageQuality: 4 },
      { source: '紹介', visitors: 10, applicants: 8, hires: 3, conversionRate: 37.5, averageQuality: 4.5 }
    ],
    facilityMetrics: [
      {
        facility: '小原病院',
        activeVisitors: 8,
        activeApplicants: 12,
        pendingOffers: 3,
        monthlyHires: 2
      },
      {
        facility: '立神リハビリテーション温泉病院',
        activeVisitors: 7,
        activeApplicants: 13,
        pendingOffers: 2,
        monthlyHires: 1
      },
      {
        facility: 'エスポワール立神',
        activeVisitors: 5,
        activeApplicants: 8,
        pendingOffers: 1,
        monthlyHires: 2
      },
      {
        facility: '宝寿庵',
        activeVisitors: 3,
        activeApplicants: 5,
        pendingOffers: 1,
        monthlyHires: 1
      }
    ],
    monthlyTrends: [
      { month: '2024-01', visitors: 15, applications: 10, interviews: 8, offers: 3, hires: 2 }
    ]
  })


  // ハンドラー関数
  const handleDuplicateCheck = async (email: string, phone: string): Promise<DuplicateCheckResult> => {
    // 実装: 重複チェックロジック
    return {
      isDuplicate: false,
      matchType: 'none',
      matchedProfiles: [],
      suggestions: []
    }
  }

  const handleTalentSearch = async (query: TalentSearchQuery): Promise<TalentProfile[]> => {
    // 実装: 検索ロジック
    return talents.filter(t => {
      if (query.keyword) {
        const keyword = query.keyword.toLowerCase()
        return t.basicInfo.lastName.toLowerCase().includes(keyword) ||
               t.basicInfo.firstName.toLowerCase().includes(keyword) ||
               t.basicInfo.email.toLowerCase().includes(keyword)
      }
      return true
    })
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        {/* メインヘッダーカード */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <Users className="h-8 w-8" />
                  採用管理システム
                </CardTitle>
                <p className="text-blue-100 mt-2">統合人材パイプライン管理</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{talents.length}</div>
                <div className="text-blue-100 text-sm">総登録人材</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* タブナビゲーション */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-2">
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="h-5 w-5" />
                <span>ダッシュボード</span>
              </button>

              <button
                onClick={() => setActiveTab('visitors')}
                className={`py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'visitors'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Eye className="h-5 w-5" />
                <span>見学者</span>
              </button>

              <button
                onClick={() => setActiveTab('applicants')}
                className={`py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'applicants'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <UserCheck className="h-5 w-5" />
                <span>応募者</span>
              </button>

              <button
                onClick={() => setActiveTab('search')}
                className={`py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'search'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Search className="h-5 w-5" />
                <span>検索</span>
              </button>
            </div>
          </div>
        </div>

        {/* タブコンテンツ */}
        <div className="min-h-[600px]">
          {activeTab === 'dashboard' && (
            <div className="animate-fadeIn">
              <TalentPipelineDashboard
                talents={talents}
                metrics={metrics}
                onDuplicateCheck={handleDuplicateCheck}
              />
            </div>
          )}

          {activeTab === 'visitors' && (
            <div className="animate-fadeIn">
              <VisitorManagementNew
                visitors={talents.filter(t => t.currentStage === 'visitor')}
                reservations={visitReservations}
              />
            </div>
          )}

          {activeTab === 'applicants' && (
            <div className="animate-fadeIn">
              <ApplicantManagementNew
                applicants={applicants}
              />
            </div>
          )}

          {activeTab === 'search' && (
            <div className="animate-fadeIn">
              <TalentSearchPanel
                onSearch={handleTalentSearch}
                onCheckDuplicate={handleDuplicateCheck}
                totalRecords={talents.length}
              />
            </div>
          )}
        </div>
      </div>

    </div>
  )
}