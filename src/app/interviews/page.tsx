'use client'

import React, { useState, useEffect } from 'react'
import CommonHeader from '@/components/CommonHeader'
import DashboardButton from '@/components/DashboardButton'
import Link from 'next/link'
import { staffDatabase } from '../data/staffData.js'
import styles from './Interviews.module.css'
import { Interview, InterviewType, InterviewStatus } from '@/types/interview'
import { mockInterviews, getUpcomingInterviews } from '@/data/mockInterviews'
import InterviewModal from '@/components/InterviewModal'
import InterviewSheetSelector from '@/components/interview/InterviewSheetSelector'
import InterviewSheetWrapper from '@/components/interview/InterviewSheetWrapper'
import { getExperienceCategory } from '@/utils/experienceUtils'
import RoleSelectionModal from '@/components/RoleSelectionModal'
import ImprovedInterviewFlow from '@/components/interview/ImprovedInterviewFlow'

// 第1段階実装: タブ順序を業務フローに合わせて修正
const tabs = [
  { id: 'dashboard', label: 'ダッシュボード', icon: '🏠', badge: '', isNew: true },
  { id: 'schedule', label: '面談予定', icon: '📅' },
  { id: 'sheets', label: '面談実施', icon: '📄' },
  { id: 'record', label: '結果記録', icon: '📝' },
  { id: 'history', label: '履歴・分析', icon: '📊' },
  { id: 'guide', label: 'ガイド', icon: '❓', isNew: true },
  { id: 'settings', label: '設定', icon: '⚙️' },
]


export default function InterviewsPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showGuideModal, setShowGuideModal] = useState(false)
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFacility, setSelectedFacility] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null)
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  })
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [selectedInterviewType, setSelectedInterviewType] = useState<string>('')

  useEffect(() => {
    setInterviews(mockInterviews)
  }, [])

  const handleInterviewSelect = (interview: Interview) => {
    setSelectedInterview(interview)
    setActiveTab('record') // フィードバック→結果記録に変更
  }

  const handleSaveInterview = (interviewData: Partial<Interview>) => {
    if (editingInterview) {
      // 編集の場合
      setInterviews(interviews.map(i => 
        i.id === editingInterview.id 
          ? { ...editingInterview, ...interviewData } 
          : i
      ))
    } else {
      // 新規作成の場合
      const newInterview: Interview = {
        id: `INT${Date.now()}`,
        employeeId: interviewData.employeeId || '',
        employeeName: interviewData.employeeName || '',
        employeeEmail: interviewData.employeeEmail || 'test@example.com',
        facility: '小原病院',
        department: interviewData.department || '内科',
        position: interviewData.position || '看護師',
        bookingDate: interviewData.bookingDate || new Date().toISOString().split('T')[0],
        startTime: interviewData.startTime || '10:00',
        endTime: interviewData.endTime || '11:00',
        interviewType: interviewData.interviewType || 'individual_consultation',
        interviewCategory: interviewData.interviewCategory || 'other',
        requestedTopics: interviewData.requestedTopics || [],
        description: interviewData.description || '',
        urgencyLevel: interviewData.urgencyLevel || 'medium',
        status: interviewData.status || 'scheduled',
        interviewerId: interviewData.interviewerId || 'M001',
        interviewerName: interviewData.interviewerName || '田中管理者',
        createdAt: new Date().toISOString(),
        createdBy: 'system',
        duration: interviewData.duration,
        adminNotes: interviewData.adminNotes,
        employeeNotes: interviewData.employeeNotes
      }
      setInterviews([...interviews, newInterview])
    }
    setShowAddModal(false)
    setEditingInterview(null)
  }

  const handleInterviewTypeClick = (type: string) => {
    if (type === 'new-employee') {
      setSelectedInterviewType(type)
      setShowRoleModal(true)
    } else if (type === 'regular-annual') {
      setSelectedInterviewType(type)
      setShowRoleModal(true)
    } else if (type === 'management') {
      setSelectedInterviewType(type)
      setShowRoleModal(true)
    } else if (type === 'exit-interview') {
      setSelectedInterviewType(type)
      setShowRoleModal(true)
    } else {
      window.location.href = `/interview-sheets-viewer?type=${type}`
    }
  }

  const handleRoleSelect = (role: string) => {
    window.location.href = `/interview-sheets-viewer?type=${selectedInterviewType}&role=${role}`
  }

  const getRoleOptions = (type: string) => {
    if (type === 'new-employee') {
      return [
        { value: 'nurse', label: '看護師（新人）', description: '1年目の看護師' },
        { value: 'assistant-nurse', label: '准看護師（新人）', description: '1年目の准看護師' },
        { value: 'nursing-aide', label: '看護補助者（新人）', description: '1年目の看護補助者' }
      ]
    } else if (type === 'regular-annual') {
      return [
        { value: 'nurse', label: '看護師', description: '2年目以降の看護師' },
        { value: 'assistant-nurse', label: '准看護師', description: '2年目以降の准看護師' },
        { value: 'nursing-aide', label: '看護補助者', description: '2年目以降の看護補助者' }
      ]
    } else if (type === 'management') {
      return [
        { value: 'leader-nurse', label: '主任看護師', description: '主任職' },
        { value: 'chief-nurse', label: '病棟師長', description: '師長職' }
      ]
    } else if (type === 'exit-interview') {
      return [
        { value: 'probation-staff', label: '試用期間職員', description: '試用期間中の職員' },
        { value: 'general-staff', label: '一般職員', description: '正職員・契約職員' },
        { value: 'manager-veteran', label: '管理職・ベテラン', description: '管理職・長期勤務者' }
      ]
    }
    return []
  }

  const filteredInterviews = interviews.filter((interview) => {
    const matchesSearch = interview.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         interview.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFacility = selectedFacility === 'all' || interview.department === selectedFacility
    const matchesDepartment = selectedDepartment === 'all' || interview.department === selectedDepartment
    
    // 日付フィルター
    const matchesDateRange = (() => {
      if (!dateRange.start && !dateRange.end) return true
      const interviewDate = new Date(interview.bookingDate)
      if (dateRange.start && interviewDate < new Date(dateRange.start)) return false
      if (dateRange.end && interviewDate > new Date(dateRange.end)) return false
      return true
    })()
    
    return matchesSearch && matchesFacility && matchesDepartment && matchesDateRange
  })

  return (
    <div>
      <div className="print:hidden">
        <CommonHeader title="面談管理" />
      </div>
      
      <div className={styles.container}>
        <div className={`${styles.tabNavigation} print:hidden`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>
                {tab.label}
                {tab.isNew && <span className={styles.newBadge}>New</span>}
              </span>
              {tab.badge && <span className={styles.tabBadge}>{tab.badge}</span>}
            </button>
          ))}
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'schedule' && (
            <ScheduleTab 
              interviews={filteredInterviews.filter(i => i.status === 'scheduled')}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedFacility={selectedFacility}
              setSelectedFacility={setSelectedFacility}
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={setSelectedDepartment}
              onInterviewSelect={handleInterviewSelect}
              onAddClick={() => setShowAddModal(true)}
              onEditClick={(interview) => {
                setEditingInterview(interview)
                setShowAddModal(true)
              }}
            />
          )}
          {activeTab === 'history' && (
            <HistoryTab 
              interviews={filteredInterviews.filter(i => i.status === 'completed')}
              onInterviewSelect={handleInterviewSelect}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          )}
          {activeTab === 'sheets' && <InterviewSheetsTab />}
          {activeTab === 'record' && <RecordTab selectedInterview={selectedInterview} />}
          {activeTab === 'guide' && <GuideTab onInterviewTypeClick={handleInterviewTypeClick} />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
      
      <InterviewModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setEditingInterview(null)
        }}
        onSave={handleSaveInterview}
        interview={editingInterview}
      />
      <RoleSelectionModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onSelect={handleRoleSelect}
        title={
          selectedInterviewType === 'new-employee' ? '新入職員月次面談 - 職種選択' :
          selectedInterviewType === 'regular-annual' ? '一般職員年次面談 - 職種選択' :
          selectedInterviewType === 'management' ? '管理職半年面談 - 職種選択' :
          selectedInterviewType === 'exit-interview' ? '退職面談 - 職員区分選択' :
          '職種選択'
        }
        roles={getRoleOptions(selectedInterviewType)}
      />
      <DashboardButton />
    </div>
  )
}

// 第1段階実装: 新規追加 - ダッシュボードタブ
function DashboardTab(): React.ReactElement {
  // 面談タイプのデータ（実際の統計に置き換え予定）
  const interviewTypes = [
    { type: 'new_employee_monthly', label: '新入職員月次面談', count: 12, required: 15, rate: 80 },
    { type: 'regular_annual', label: '一般職員年次面談', count: 45, required: 60, rate: 75 },
    { type: 'management_biannual', label: '管理職半年面談', count: 8, required: 10, rate: 80 },
    { type: 'incident_followup', label: 'インシデント後面談', count: 2, urgent: true },
    { type: 'return_to_work', label: '復職面談', count: 1, scheduled: 2 },
    { type: 'feedback', label: 'フィードバック面談', count: 30, required: 50, rate: 60 },
    { type: 'career_support', label: 'キャリア系面談', count: 5, pending: 3 },
    { type: 'workplace_support', label: '職場環境系面談', count: 5, pending: 2 },
    { type: 'exit_interview', label: '退職面談', count: 1, scheduled: 1 },
    { type: 'individual_consultation', label: '個別相談面談', count: 7, available: true },
  ]

  const todayTasks = [
    { time: '09:00', type: '新入職員月次面談', name: '山田花子', location: '面談室A' },
    { time: '14:00', type: 'キャリア系面談', name: '佐藤太郎', location: '面談室B' },
    { time: '16:00', type: '職場環境系面談', name: '鈴木一郎', location: 'オンライン' },
  ]

  return (
    <div className={styles.dashboardContainer}>
      <h2>面談管理ダッシュボード</h2>
      
      <div className={styles.dashboardGrid}>
        {/* 本日のタスク */}
        <div className={styles.dashboardCard}>
          <h3>📅 本日の面談予定</h3>
          <div className={styles.todaysList}>
            {todayTasks.map((task, index) => (
              <div key={index} className={styles.todayItem}>
                <span className={styles.todayTime}>{task.time}</span>
                <span className={styles.todayType}>{task.type}</span>
                <span className={styles.todayName}>{task.name}</span>
                <span className={styles.todayLocation}>{task.location}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 緊急対応 */}
        <div className={styles.dashboardCard}>
          <h3>⚠️ 要対応・緊急</h3>
          <div className={styles.urgentList}>
            <div className={styles.urgentItem}>
              <span className={styles.urgentBadge}>緊急</span>
              インシデント後面談: 2件
            </div>
            <div className={styles.urgentItem}>
              <span className={styles.urgentBadge}>期限切れ</span>
              年次面談未実施: 15名
            </div>
            <div className={styles.urgentItem}>
              <span className={styles.urgentBadge}>要確認</span>
              ストレスケア面談: 3件
            </div>
          </div>
        </div>
      </div>

      {/* 面談タイプ別状況 */}
      <div className={styles.typeGrid}>
        <h3>面談タイプ別実施状況</h3>
        <div className={styles.typeCards}>
          {interviewTypes.map((item, index) => (
            <div key={index} className={styles.typeCard}>
              <div className={styles.typeHeader}>
                <span className={styles.typeName}>{item.label}</span>
                {item.urgent && <span className={styles.urgentTag}>緊急</span>}
              </div>
              <div className={styles.typeStats}>
                {item.rate !== undefined && (
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill} 
                      style={{ width: `${item.rate}%` }}
                    />
                    <span className={styles.progressText}>{item.rate}%</span>
                  </div>
                )}
                {item.required && (
                  <div className={styles.typeCount}>
                    実施: {item.count} / 対象: {item.required}
                  </div>
                )}
                {item.pending && (
                  <div className={styles.typePending}>
                    申込待ち: {item.pending}件
                  </div>
                )}
                {item.scheduled && (
                  <div className={styles.typeScheduled}>
                    予定: {item.scheduled}件
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 第1段階実装: 新規追加 - ガイドタブ
interface GuideTabProps {
  onInterviewTypeClick: (type: string) => void
}

function GuideTab({ onInterviewTypeClick }: GuideTabProps): React.ReactElement {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">面談管理システム ガイド</h2>
      
      {/* システム概要 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📖 システム概要</h3>
        <div className="prose max-w-none text-gray-600">
          <p>このシステムは、医療法人厚生会の面談制度を総合的に管理するためのシステムです。</p>
          <p>3つの分類（定期・特別・サポート）による10種類の面談タイプと13種類の相談カテゴリに対応し、職員と人事部の両方から利用できます。</p>
        </div>
      </div>

      {/* 3分類・10種類の面談体系 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">3分類・10種類の面談体系</h3>
        <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded-r-lg mb-4">
          <p className="text-sm font-semibold text-orange-800 mb-1">⚠️ 実装状況のお知らせ</p>
          <p className="text-xs text-gray-700">
            現在、定期面談の3種類（新入職員月次、一般職員年次、管理職半年）が利用可能です。
            特別面談とサポート面談は順次実装予定です。
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* 定期面談 */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <span className="text-xl">📅</span>
              定期面談（必須）
            </h4>
            <div className="space-y-2 text-sm">
              <div className="bg-white/80 rounded p-2">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-blue-800">新入職員月次面談</span>
                  <div className="flex gap-1">
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">実装済</span>
                    <span className="text-xs bg-blue-200 px-2 py-1 rounded">月1回</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-1">入職1年未満の職員対象</p>
              </div>
              <div className="bg-white/80 rounded p-2">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-blue-800">一般職員年次面談</span>
                  <div className="flex gap-1">
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">実装済</span>
                    <span className="text-xs bg-blue-200 px-2 py-1 rounded">年1回</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-1">全職員対象</p>
              </div>
              <div className="bg-white/80 rounded p-2">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-blue-800">管理職半年面談</span>
                  <div className="flex gap-1">
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">実装済</span>
                    <span className="text-xs bg-blue-200 px-2 py-1 rounded">年2回</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-1">管理職対象</p>
              </div>
            </div>
          </div>
          
          {/* 特別面談 */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
            <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
              <span className="text-xl">🔶</span>
              特別面談（状況に応じて）
            </h4>
            <div className="space-y-2 text-sm">
              <div className="bg-white/80 rounded p-2">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-orange-800">復職面談</span>
                  <span className="text-xs bg-gray-400 text-white px-2 py-1 rounded">開発中</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">休職からの復職時</p>
              </div>
              <div className="bg-white/80 rounded p-2">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-orange-800">インシデント後面談</span>
                  <span className="text-xs bg-gray-400 text-white px-2 py-1 rounded">開発中</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">インシデント発生後</p>
              </div>
              <div className="bg-white/80 rounded p-2">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-orange-800">退職面談</span>
                  <span className="text-xs bg-gray-400 text-white px-2 py-1 rounded">開発中</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">退職前のヒアリング</p>
              </div>
            </div>
          </div>
          
          {/* サポート面談 */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 md:col-span-2">
            <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
              <span className="text-xl">💬</span>
              サポート面談（任意）
            </h4>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              <div className="bg-white/80 rounded p-2">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-green-800">フィードバック面談</span>
                  <span className="text-xs bg-gray-400 text-white px-2 py-1 rounded">開発中</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">人事評価後の結果共有</p>
              </div>
              <div className="bg-white/80 rounded p-2">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-green-800">キャリア系面談</span>
                  <span className="text-xs bg-gray-400 text-white px-2 py-1 rounded">開発中</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">キャリアパス、スキル開発、昇進・異動</p>
              </div>
              <div className="bg-white/80 rounded p-2">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-green-800">職場環境系面談</span>
                  <span className="text-xs bg-gray-400 text-white px-2 py-1 rounded">開発中</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">職場環境、人間関係、業務負荷</p>
              </div>
              <div className="bg-white/80 rounded p-2">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-green-800">個別相談面談</span>
                  <span className="text-xs bg-gray-400 text-white px-2 py-1 rounded">開発中</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">パフォーマンス、給与、研修、その他</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <p className="text-sm font-semibold text-yellow-800 mb-1">💡 重要なポイント</p>
          <p className="text-xs text-gray-700">
            全ての面談は「評価」ではなく「支援」が目的です。人事評価とは完全に切り離されており、職員の成長と働きやすさの向上を目指しています。
          </p>
        </div>
      </div>

      {/* サポート面談のカテゴリ選択 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">サポート面談のカテゴリ選択</h3>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg mb-4">
          <p className="text-sm font-semibold text-blue-800 mb-1">📢 カテゴリ選択について</p>
          <p className="text-xs text-gray-700">
            サポート面談（フィードバック面談を除く）では、予約時に相談内容のカテゴリを選択していただきます。
            これにより、面談担当者が事前に準備をして、より充実した面談を実施できます。
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-3">
          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="font-semibold text-blue-800 text-sm mb-2">🎯 キャリア系面談</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• キャリアパス（将来の目標）</li>
              <li>• スキル開発（研修・資格）</li>
              <li>• 昇進・昇格</li>
              <li>• 異動・転勤</li>
            </ul>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3">
            <h4 className="font-semibold text-green-800 text-sm mb-2">🏢 職場環境系面談</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• 職場環境（設備・制度）</li>
              <li>• 人間関係（チームワーク）</li>
              <li>• 業務負荷・ワークライフバランス</li>
              <li>• 健康・安全</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-3">
            <h4 className="font-semibold text-purple-800 text-sm mb-2">📦 個別相談面談</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• パフォーマンス（業務改善）</li>
              <li>• 給与・待遇</li>
              <li>• 研修・教育</li>
              <li>• コンプライアンス</li>
              <li>• その他の相談</li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.guideSection}>
        <h3>🔄 業務フロー</h3>
        <ol className={styles.flowList}>
          <li><strong>ダッシュボード</strong>で全体状況を確認</li>
          <li><strong>面談予定</strong>で予約管理</li>
          <li><strong>面談実施</strong>で適切な面談シートを選択・記入</li>
          <li><strong>結果記録</strong>で面談結果とアクションプランを記録</li>
          <li><strong>履歴・分析</strong>で過去の面談を確認・分析</li>
        </ol>
      </div>

      <div className={styles.guideSection}>
        <h3>📄 実装済み面談シート</h3>
        <div className={styles.sheetList}>
          <h4>看護師用面談シート（v4統合版）</h4>
          <ul>
            <li>新人看護師（1年目）: 15分/30分/45分</li>
            <li>一般看護師（2-3年目）: 15分/30分/45分</li>
            <li>中堅看護師（4-10年目）: 15分/30分/45分</li>
            <li>ベテラン看護師（11年以上）: 15分/30分/45分</li>
            <li>主任看護師: 15分/30分/45分</li>
            <li>病棟師長: 15分/30分/45分</li>
          </ul>
          <h4>看護補助者用面談シート（v4統合版）</h4>
          <ul>
            <li>新人看護補助者（1年目）: 15分/30分/45分</li>
            <li>一般看護補助者（2-3年目）: 15分/30分/45分</li>
            <li>ベテラン看護補助者（11年以上）: 15分/30分/45分</li>
            <li>リーダー看護補助者: 15分/30分/45分</li>
          </ul>
          <h4>准看護師用面談シート（v4統合版）</h4>
          <ul>
            <li>新人准看護師（1年目）: 15分/30分/45分</li>
            <li>一般准看護師（2-3年目）: 15分/30分/45分</li>
            <li>中堅准看護師（4-10年目）: 15分/30分/45分</li>
            <li>ベテラン准看護師（11年以上）: 15分/30分/45分</li>
          </ul>
          <div className={styles.sheetViewButton}>
            <button 
              onClick={() => window.location.href = '/interview-sheets-viewer'}
              className={styles.viewButton}
            >
              面談シートを閲覧 →
            </button>
          </div>
        </div>
      </div>

      <div className={styles.guideSection}>
        <h3>⚠️ 重要：職員階層定義について（開発メモ）</h3>
        <div className={styles.developerNote}>
          <h4>面談システムと評価システムの階層対応</h4>
          <p className={styles.warningText}>
            <strong>注意：面談システムと評価システムでは階層定義が異なります</strong>
          </p>
          
          <h5>看護師の役職階層</h5>
          <table className={styles.hierarchyTable}>
            <thead>
              <tr>
                <th>役職</th>
                <th>面談システム</th>
                <th>評価システム</th>
                <th>設計思想</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>主任看護師</td>
                <td><code>leader-nurse</code></td>
                <td><code>ward-chief</code></td>
                <td rowSpan={2}>面談は共通シート<br/>評価は将来細分化</td>
              </tr>
              <tr>
                <td>病棟師長</td>
                <td><code>chief-nurse</code></td>
                <td><code>ward-manager</code></td>
              </tr>
            </tbody>
          </table>
          
          <h5>システム設計の違い</h5>
          <ul className={styles.systemDifference}>
            <li><strong>面談システム（本システム）</strong>: 
              <ul>
                <li>病棟・外来で共通の面談シートを使用</li>
                <li>主任看護師用: <code>leader-nurse-unified-[15/30/45]min</code></li>
                <li>病棟師長用: <code>chief-nurse-unified-[15/30/45]min</code></li>
                <li>メンテナンス性と一貫性を重視した設計</li>
              </ul>
            </li>
            <li><strong>評価システム</strong>: 
              <ul>
                <li>将来的に病棟・外来で異なる評価項目を想定</li>
                <li>病棟主任: <code>ward-chief-evaluation</code></li>
                <li>外来主任: <code>outpatient-chief-evaluation</code>（今後）</li>
                <li>専門性と詳細度を重視した設計</li>
              </ul>
            </li>
          </ul>
          
          <div className={styles.importantNote}>
            <h5>⚠️ ファイル名の注意事項</h5>
            <p>
              <strong>leader-nurse</strong> = 主任看護師（リーダー看護師ではない）<br/>
              <strong>chief-nurse</strong> = 病棟師長（主任看護師ではない）
            </p>
            <p className={styles.highlightText}>
              ※ 新規開発時は必ずこの対応関係を確認してください
            </p>
          </div>
          
          <div className={styles.referenceLink}>
            <p>📚 詳細は階層定義ドキュメントを参照:</p>
            <code>docs/STAFF_HIERARCHY_DEFINITION.md</code>
          </div>
        </div>
      </div>

      <div className={styles.implementationNote}>
        <h3>🚀 今後の実装予定</h3>
        
        <div className={styles.phaseCard}>
          <h4>第2段階実装（VoiceDrive連携準備）</h4>
          <ul>
            <li>予約管理機能の強化（カレンダービュー、承認フロー）</li>
            <li>権限別表示の実装（人事部/一般職員の切り替え）</li>
            <li>API エンドポイントの実装</li>
            <li>通知システムの基盤構築</li>
          </ul>
          <div className={styles.implementationCommand}>
            <code>
              {`// 実装指示（Claude用）:
// 1. 予約管理タブに月/週/日のカレンダービューを追加
// 2. userRole に基づく条件分岐を実装
// 3. /api/v1/interview/bookings のCRUD APIを実装
// 4. WebSocket または Server-Sent Events で通知機能を実装`}
            </code>
          </div>
        </div>

        <div className={styles.phaseCard}>
          <h4>第3段階実装（VoiceDrive連携）</h4>
          <ul>
            <li>VoiceDrive との双方向API連携</li>
            <li>共通データベースの同期機能</li>
            <li>スマホからの予約対応（VoiceDrive経由）</li>
            <li>リアルタイム同期ステータス表示</li>
          </ul>
          <div className={styles.implementationCommand}>
            <code>
              {`// 実装指示（Claude用）:
// 1. docs/interview-api-design.md に基づくAPI実装
// 2. JWT認証の実装（docs/interview-api-design.md 参照）
// 3. Webhook によるイベント駆動型同期
// 4. 同期ステータス監視ダッシュボードの追加
// 参照: docs/INTEGRATION_ARCHITECTURE.md`}
            </code>
          </div>
        </div>

        <div className={styles.phaseCard}>
          <h4>参考ドキュメント</h4>
          <ul>
            <li><code>docs/interview-system-overview.md</code> - 面談制度の詳細仕様</li>
            <li><code>docs/interview-api-design.md</code> - API設計書</li>
            <li><code>docs/INTEGRATION_ARCHITECTURE.md</code> - VoiceDrive連携アーキテクチャ</li>
            <li><code>src/types/interview.ts</code> - 型定義ファイル</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

interface ScheduleTabProps {
  interviews: Interview[]
  searchTerm: string
  setSearchTerm: (value: string) => void
  selectedFacility: string
  setSelectedFacility: (value: string) => void
  selectedDepartment: string
  setSelectedDepartment: (value: string) => void
  onInterviewSelect: (interview: Interview) => void
  onAddClick: () => void
  onEditClick?: (interview: Interview) => void
}

function ScheduleTab({ interviews, searchTerm, setSearchTerm, selectedFacility, setSelectedFacility, selectedDepartment, setSelectedDepartment, onInterviewSelect, onAddClick, onEditClick }: ScheduleTabProps) {
  return (
    <div className={styles.listContainer}>
      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="職員名または職員IDで検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filters}>
          <select 
            value={selectedFacility} 
            onChange={(e) => setSelectedFacility(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">全施設</option>
            <option value="小原病院">小原病院</option>
            <option value="立神リハビリテーション温泉病院">立神リハビリテーション温泉病院</option>
          </select>
          <select 
            value={selectedDepartment} 
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">全部署</option>
            <option value="外科病棟">外科病棟</option>
            <option value="内科病棟">内科病棟</option>
            <option value="救急科">救急科</option>
            <option value="地域包括ケア病棟">地域包括ケア病棟</option>
            <option value="外来">外来</option>
            <option value="緩和ケア病棟">緩和ケア病棟</option>
          </select>
        </div>
      </div>

      <div className={styles.listHeader}>
        <h2>面談予定 ({interviews.length}件)</h2>
        <button className={styles.addButton} onClick={onAddClick}>
          + 新規面談を追加
        </button>
      </div>

      <div className={styles.interviewGrid}>
        {interviews.map((interview) => (
          <div key={interview.id} className={styles.interviewCard} onClick={() => onInterviewSelect(interview)}>
            <div className={styles.cardHeader}>
              <div className={styles.cardDate}>
                <div className={styles.dateDay}>{new Date(interview.bookingDate).getDate()}</div>
                <div className={styles.dateMonth}>{new Date(interview.bookingDate).toLocaleDateString('ja-JP', { month: 'short' })}</div>
              </div>
              <div className={styles.cardInfo}>
                <h3>{interview.employeeName}</h3>
                <p className={styles.staffId}>{interview.employeeId}</p>
                <p className={styles.interviewTime}>{interview.startTime} - {interview.interviewType}</p>
                <p className={styles.interviewPurpose}>{interview.description}</p>
              </div>
              <div className={styles.cardActions}>
                <button 
                  className={styles.actionButton} 
                  onClick={(e) => { 
                    e.stopPropagation();
                    if (onEditClick) onEditClick(interview);
                  }}
                >
                  編集
                </button>
                <button className={styles.actionButton} onClick={(e) => { e.stopPropagation(); }}>
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface HistoryTabProps {
  interviews: Interview[]
  onInterviewSelect: (interview: Interview) => void
  dateRange?: { start: string; end: string }
  onDateRangeChange?: (range: { start: string; end: string }) => void
}

function HistoryTab({ interviews, onInterviewSelect, dateRange, onDateRangeChange }: HistoryTabProps) {
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'staff'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  
  const sortedInterviews = [...interviews].sort((a, b) => {
    let comparison = 0
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime()
        break
      case 'type':
        comparison = a.interviewType.localeCompare(b.interviewType)
        break
      case 'staff':
        comparison = a.employeeName.localeCompare(b.employeeName)
        break
    }
    return sortOrder === 'asc' ? comparison : -comparison
  })
  
  return (
    <div className={styles.historyContainer}>
      <div className={styles.historyHeader}>
        <h2>面談履歴 ({interviews.length}件)</h2>
        <div className={styles.historyControls}>
          <div className={styles.dateRangeFilter}>
            <input
              type="date"
              value={dateRange?.start || ''}
              onChange={(e) => onDateRangeChange?.({ ...dateRange || { start: '', end: '' }, start: e.target.value })}
              className={styles.dateInput}
              placeholder="開始日"
            />
            <span className={styles.dateRangeSeparator}>〜</span>
            <input
              type="date"
              value={dateRange?.end || ''}
              onChange={(e) => onDateRangeChange?.({ ...dateRange || { start: '', end: '' }, end: e.target.value })}
              className={styles.dateInput}
              placeholder="終了日"
            />
          </div>
          <div className={styles.sortControls}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'type' | 'staff')}
              className={styles.sortSelect}
            >
              <option value="date">日付順</option>
              <option value="type">種別順</option>
              <option value="staff">職員順</option>
            </select>
            <button
              className={styles.sortOrderButton}
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              title={sortOrder === 'asc' ? '昇順' : '降順'}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.historyList}>
        {sortedInterviews.map((interview) => (
          <div key={interview.id} className={styles.historyItem} onClick={() => onInterviewSelect(interview)}>
            <div className={styles.historyDate}>
              <div className={styles.historyDateText}>{new Date(interview.bookingDate).toLocaleDateString('ja-JP')}</div>
              <div className={styles.historyTime}>{interview.startTime}</div>
            </div>
            <div className={styles.historyInfo}>
              <h4>{interview.employeeName} - {interview.interviewType}</h4>
              <p className={styles.historyPurpose}>{interview.description}</p>
              {interview.outcomeSummary && (
                <p className={styles.historyFeedback}>{interview.outcomeSummary}</p>
              )}
            </div>
            <div className={styles.historyStatus}>
              <span className={styles.statusCompleted}>完了</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 第1段階実装: RecordTab（旧FeedbackTab）
interface RecordTabProps {
  selectedInterview: Interview | null
}

function RecordTab({ selectedInterview }: RecordTabProps) {
  if (!selectedInterview) {
    return (
      <div className={styles.noSelection}>
        <p>面談を選択してください</p>
      </div>
    )
  }

  return (
    <div className={styles.feedbackContainer}>
      <div className={styles.feedbackHeader}>
        <h2>面談結果記録</h2>
        <div className={styles.interviewMeta}>
          <span>{selectedInterview.employeeName}</span>
          <span>{new Date(selectedInterview.bookingDate).toLocaleDateString('ja-JP')}</span>
          <span>{selectedInterview.interviewType}</span>
        </div>
      </div>

      <div className={styles.feedbackForm}>
        <div className={styles.formSection}>
          <h3>面談概要</h3>
          <textarea 
            className={styles.textArea}
            placeholder="面談の概要を入力してください"
            rows={4}
            defaultValue={selectedInterview.employeeNotes}
          />
        </div>

        <div className={styles.formSection}>
          <h3>主な相談内容と対応</h3>
          <textarea 
            className={styles.textArea}
            placeholder="相談内容と対応を入力してください"
            rows={6}
            defaultValue={selectedInterview.outcomeActionItems?.join('\n') || ''}
          />
        </div>

        <div className={styles.formSection}>
          <h3>今後のアクションプラン</h3>
          <textarea 
            className={styles.textArea}
            placeholder="今後のアクションプランを入力してください"
            rows={4}
          />
        </div>

        <div className={styles.formSection}>
          <h3>フォローアップ</h3>
          <label>
            <input type="checkbox" /> フォローアップが必要
          </label>
        </div>

        <div className={styles.formActions}>
          <button className={styles.saveButton}>保存</button>
          <button className={styles.cancelButton}>キャンセル</button>
        </div>
      </div>
    </div>
  )
}

function InterviewSheetsTab(): React.ReactElement {
  return <ImprovedInterviewFlow />
}

function ReportTab(): React.ReactElement {
  return (
    <div className={styles.reportContainer}>
      <h2>面談レポート</h2>
      <div className={styles.comingSoon}>
        <p>面談レポート機能は現在開発中です</p>
      </div>
    </div>
  )
}

function SettingsTab(): React.ReactElement {
  return (
    <div className={styles.settingsContainer}>
      <h2>面談設定</h2>
      <div className={styles.comingSoon}>
        <p>面談設定機能は現在開発中です</p>
      </div>
    </div>
  )
}