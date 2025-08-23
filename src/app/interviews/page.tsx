'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
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
import UnifiedInterviewDashboard from '@/components/interview/UnifiedInterviewDashboard'
import UnifiedInterviewBankSystem from '@/components/interview/UnifiedInterviewBankSystem'
import InterviewManualSimulator from '@/components/interview/InterviewManualSimulator'

// タブ順序を業務フローに合わせて修正
const tabs = [
  { id: 'station', label: '面談ステーション', icon: '🚉', badge: '', isNew: false },
  { id: 'bank-system', label: 'バンク', icon: '🏦', badge: '', isNew: false },
  { id: 'overview-guide', label: 'ガイド', icon: '📖', badge: '', isNew: false },
  { id: 'simulator', label: 'シュミレーター', icon: '🎯', badge: '', isNew: false },
  { id: 'record', label: '結果記録', icon: '📝', badge: '', isNew: false },
  { id: 'analytics', label: '履歴・分析', icon: '📊', badge: '', isNew: false },
  { id: 'settings', label: '設定', icon: '⚙️', badge: '', isNew: false },
]


function InterviewsPageContent() {
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'station')
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

  // URLパラメータが変更されたときにタブを更新
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam && tabParam !== activeTab) {
      console.log('Setting active tab from URL:', tabParam)
      
      // 有効なタブIDかチェック
      const validTabIds = tabs.map(tab => tab.id)
      if (validTabIds.includes(tabParam)) {
        setActiveTab(tabParam)
      } else {
        console.warn(`Invalid tab '${tabParam}' detected. Falling back to 'station'`)
        setActiveTab('station') // 面談開始時の適切なフォールバック先
      }
    }
  }, [searchParams])

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
        { value: 'nursing-aide', label: '看護補助者（新人）', description: '1年目の看護補助者' },
        { value: 'medical-affairs', label: '医事課職員（新人）', description: '1年目の医事課職員' }
      ]
    } else if (type === 'regular-annual') {
      return [
        { value: 'nurse', label: '看護師', description: '2年目以降の看護師' },
        { value: 'assistant-nurse', label: '准看護師', description: '2年目以降の准看護師' },
        { value: 'nursing-aide', label: '看護補助者', description: '2年目以降の看護補助者' },
        { value: 'medical-affairs', label: '医事課職員', description: '2年目以降の医事課職員' }
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
          {activeTab === 'station' && <UnifiedInterviewDashboard />}
          {activeTab === 'bank-system' && <UnifiedInterviewBankSystem />}
          {activeTab === 'record' && <RecordTab selectedInterview={selectedInterview} />}
          {activeTab === 'analytics' && <HistoryAnalysisTab interviews={interviews} />}
          {activeTab === 'overview-guide' && <OverviewGuideTab onInterviewTypeClick={handleInterviewTypeClick} />}
          {activeTab === 'simulator' && <InterviewManualSimulator />}
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

// 概要・ガイド統合タブコンポーネント
interface OverviewGuideTabProps {
  onInterviewTypeClick: (type: string) => void
}

function OverviewGuideTab({ onInterviewTypeClick }: OverviewGuideTabProps): React.ReactElement {
  const [activeGuideTab, setActiveGuideTab] = useState('overview');

  const guideTabs = [
    { id: 'overview', label: '面談制度概要', icon: '📖' },
    { id: 'regular', label: '定期面談ガイド', icon: '📅' },
    { id: 'special', label: '特別面談ガイド', icon: '⚠️' },
    { id: 'support', label: 'サポート面談ガイド', icon: '💬' },
  ];

  return (
    <div className={styles.overviewContent}>
      {/* ガイドタブナビゲーション */}
      <div className="mb-6">
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          {guideTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveGuideTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                activeGuideTab === tab.id
                  ? 'bg-white shadow-sm text-blue-600 border-2 border-blue-200'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* タブコンテンツ */}
      {activeGuideTab === 'overview' && <OverviewTabContent />}
      {activeGuideTab === 'regular' && <RegularInterviewGuide />}
      {activeGuideTab === 'special' && <SpecialInterviewGuide />}
      {activeGuideTab === 'support' && <SupportInterviewGuide />}
    </div>
  );
}

// 面談制度概要タブ
function OverviewTabContent(): React.ReactElement {
  return (
    <div className="space-y-6">
      {/* 面談システム概要 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-500 rounded-full">
            <span className="text-2xl">❤️</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-blue-900">面談管理システム概要</h2>
            <p className="text-blue-700">職員一人ひとりの成長と組織の発展を支援する継続的な対話プロセス</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/80 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">🎯 面談の目的</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 職員の成長支援</li>
              <li>• 組織との連携強化</li>
              <li>• 早期課題発見・解決</li>
            </ul>
          </div>
          <div className="bg-white/80 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">📋 3つの分類</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 定期面談（必須）</li>
              <li>• 特別面談（状況対応）</li>
              <li>• サポート面談（任意）</li>
            </ul>
          </div>
          <div className="bg-white/80 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">🔄 継続サイクル</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 事前準備</li>
              <li>• 面談実施</li>
              <li>• フォローアップ</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 面談体系一覧 */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">面談体系一覧</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="border border-green-200 rounded-lg p-4 bg-green-50">
            <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
              <span>📅</span> 定期面談（必須）
            </h4>
            <div className="space-y-2 text-sm">
              <div className="bg-white/80 rounded p-2">新入職員月次面談</div>
              <div className="bg-white/80 rounded p-2">一般職員年次面談</div>
              <div className="bg-white/80 rounded p-2">管理職半年面談</div>
            </div>
          </div>
          <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
            <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
              <span>⚠️</span> 特別面談（状況対応）
            </h4>
            <div className="space-y-2 text-sm">
              <div className="bg-white/80 rounded p-2">復職面談</div>
              <div className="bg-white/80 rounded p-2">インシデント後面談</div>
              <div className="bg-white/80 rounded p-2">退職面談</div>
            </div>
          </div>
          <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
            <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
              <span>💬</span> サポート面談（任意）
            </h4>
            <div className="space-y-2 text-sm">
              <div className="bg-white/80 rounded p-2">フィードバック面談</div>
              <div className="bg-white/80 rounded p-2">キャリア相談面談</div>
              <div className="bg-white/80 rounded p-2">個別サポート面談</div>
            </div>
          </div>
        </div>
      </div>

      {/* 効果的な面談の進め方 */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">効果的な面談の進め方</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">1</div>
            <h4 className="font-semibold text-gray-800 mb-2">事前準備</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>面談シートの準備</li>
              <li>過去の記録確認</li>
              <li>目標・課題の整理</li>
            </ul>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">2</div>
            <h4 className="font-semibold text-gray-800 mb-2">面談実施</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>傾聴と共感</li>
              <li>具体的なフィードバック</li>
              <li>建設的な対話</li>
            </ul>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">3</div>
            <h4 className="font-semibold text-gray-800 mb-2">アクション設定</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>具体的な目標設定</li>
              <li>支援内容の明確化</li>
              <li>次回までの課題</li>
            </ul>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">4</div>
            <h4 className="font-semibold text-gray-800 mb-2">フォローアップ</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>面談記録の作成</li>
              <li>進捗確認</li>
              <li>継続的な支援</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// 定期面談ガイドタブ - ストーリー仕立て
function RegularInterviewGuide(): React.ReactElement {
  return (
    <div className="space-y-8">
      {/* 定期面談の基本方針 */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-green-900 mb-4 flex items-center gap-3">
          <span className="text-3xl">📅</span>
          定期面談ガイド
        </h2>
        <p className="text-green-800 text-lg mb-4">
          定期面談は、職員の成長段階に応じた継続的な支援を行う重要な機会です。
          以下のストーリーを通じて、それぞれの立場における面談の特性を理解しましょう。
        </p>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white/80 rounded-lg p-3">
            <h4 className="font-semibold text-green-900 text-sm">新入職員月次面談</h4>
            <p className="text-xs text-green-700 mt-1">入職1年未満・月1回</p>
          </div>
          <div className="bg-white/80 rounded-lg p-3">
            <h4 className="font-semibold text-green-900 text-sm">一般職員年次面談</h4>
            <p className="text-xs text-green-700 mt-1">全職員対象・年1回</p>
          </div>
          <div className="bg-white/80 rounded-lg p-3">
            <h4 className="font-semibold text-green-900 text-sm">管理職半年面談</h4>
            <p className="text-xs text-green-700 mt-1">管理職対象・年2回</p>
          </div>
        </div>
      </div>

      {/* 新人職員のストーリー */}
      <div className="bg-white border border-blue-200 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-500 rounded-full">
            <span className="text-2xl">👨‍⚕️</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-blue-900">新人職員の成長ストーリー</h3>
            <p className="text-blue-700">入職から1年間の月次面談を通じた成長プロセス</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">📖 田中さん（看護師・入職3ヶ月）のケース</h4>
              <div className="text-sm text-blue-800 space-y-2">
                <p><strong>入職時の不安：</strong>「医療現場は初めてで、ミスをしないか心配です」</p>
                <p><strong>1ヶ月目面談：</strong>基本業務への適応状況を確認。先輩とのペア制での指導体制を調整。</p>
                <p><strong>3ヶ月目面談：</strong>「最初は緊張していましたが、先輩方が優しく教えてくださり、少しずつ慣れてきました。患者さんとのコミュニケーションにもやりがいを感じています」</p>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">🎯 面談で重視するポイント</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• <strong>適応状況：</strong>職場環境に慣れているか</li>
                <li>• <strong>技術習得：</strong>基本技術の理解度と実践力</li>
                <li>• <strong>人間関係：</strong>同僚・先輩との関係構築</li>
                <li>• <strong>不安解消：</strong>疑問や心配事の早期発見</li>
                <li>• <strong>目標設定：</strong>次月までの具体的な成長目標</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">💡 面談の進め方</h4>
              <div className="text-sm text-yellow-800 space-y-2">
                <div><strong>開始時（5分）：</strong>リラックスした雰囲気作り、近況確認</div>
                <div><strong>中盤（15-20分）：</strong>業務習得状況、困りごと、良かった点の振り返り</div>
                <div><strong>終盤（5-10分）：</strong>次月の目標設定、必要な支援の確認</div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2">📈 成長の軌跡</h4>
              <div className="text-sm text-purple-800 space-y-1">
                <div className="flex justify-between"><span>1-3ヶ月:</span><span>基本適応期</span></div>
                <div className="flex justify-between"><span>4-6ヶ月:</span><span>技術習得期</span></div>
                <div className="flex justify-between"><span>7-9ヶ月:</span><span>自立実践期</span></div>
                <div className="flex justify-between"><span>10-12ヶ月:</span><span>安定成長期</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 一般職員のストーリー */}
      <div className="bg-white border border-green-200 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-green-500 rounded-full">
            <span className="text-2xl">👩‍⚕️</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-green-900">一般職員の成長ストーリー</h3>
            <p className="text-green-700">中堅職員としての年次面談における目標達成と課題解決</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">📖 佐藤さん（看護師・勤続5年）のケース</h4>
              <div className="text-sm text-green-800 space-y-2">
                <p><strong>昨年の目標振り返り：</strong>「新人指導担当として3名の新人をサポートしました。最初は指導方法に戸惑いましたが、研修を受けて成長できました」</p>
                <p><strong>今年の挑戦：</strong>「チームリーダーとしてのスキルを身につけ、病棟の業務改善プロジェクトにも参加したいです」</p>
                <p><strong>キャリア展望：</strong>「将来的には主任看護師として、後輩の成長を支援する立場になりたいです」</p>
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <h4 className="font-semibold text-orange-900 mb-2">🎯 面談で重視するポイント</h4>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• <strong>目標達成度：</strong>前年度目標の振り返りと評価</li>
                <li>• <strong>専門性向上：</strong>技術・知識のレベルアップ状況</li>
                <li>• <strong>チームへの貢献：</strong>組織への積極的な関わり</li>
                <li>• <strong>キャリア展望：</strong>中長期的なキャリアプラン</li>
                <li>• <strong>ワークライフバランス：</strong>仕事と私生活の調和</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">💡 面談の進め方</h4>
              <div className="text-sm text-blue-800 space-y-2">
                <div><strong>開始時（5分）：</strong>一年間の総括、印象的な出来事の共有</div>
                <div><strong>前半（15分）：</strong>目標達成状況の詳細確認、成功要因の分析</div>
                <div><strong>中盤（15分）：</strong>課題や困難の振り返り、今後の改善策</div>
                <div><strong>終盤（10分）：</strong>来年度の目標設定、キャリア相談</div>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-lg p-4">
              <h4 className="font-semibold text-indigo-900 mb-2">🌟 成長の指標</h4>
              <div className="text-sm text-indigo-800 space-y-1">
                <div className="flex justify-between"><span>専門技術:</span><span>高度な技術習得</span></div>
                <div className="flex justify-between"><span>指導力:</span><span>後輩指導の実践</span></div>
                <div className="flex justify-between"><span>リーダーシップ:</span><span>チーム貢献度</span></div>
                <div className="flex justify-between"><span>継続学習:</span><span>自己研鑽の姿勢</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 管理職のストーリー */}
      <div className="bg-white border border-orange-200 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-orange-500 rounded-full">
            <span className="text-2xl">👔</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-orange-900">管理職の成長ストーリー</h3>
            <p className="text-orange-700">組織運営と人材育成に焦点を当てた半年面談</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-orange-50 rounded-lg p-4">
              <h4 className="font-semibold text-orange-900 mb-2">📖 山田師長（看護師長・勤続15年）のケース</h4>
              <div className="text-sm text-orange-800 space-y-2">
                <p><strong>組織運営の成果：</strong>「今期は病棟の看護師不足が課題でしたが、新人教育プログラムの見直しにより定着率が20%向上しました」</p>
                <p><strong>人材育成の取り組み：</strong>「中堅職員のリーダーシップ研修を企画し、5名が主任候補として成長してくれています」</p>
                <p><strong>今後の展望：</strong>「次期は多職種連携の強化と、働き方改革の推進に取り組みたいです」</p>
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-semibold text-red-900 mb-2">🎯 面談で重視するポイント</h4>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• <strong>組織目標達成：</strong>部署の目標達成状況と課題</li>
                <li>• <strong>人材育成成果：</strong>部下の成長促進と定着率</li>
                <li>• <strong>業務改善提案：</strong>効率化や質の向上施策</li>
                <li>• <strong>多職種連携：</strong>他部署との協働関係構築</li>
                <li>• <strong>戦略的視点：</strong>中長期的な組織運営構想</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2">💡 面談の進め方</h4>
              <div className="text-sm text-purple-800 space-y-2">
                <div><strong>開始時（10分）：</strong>半年間の部署運営概況、主要な成果報告</div>
                <div><strong>前半（20分）：</strong>目標達成状況の詳細分析、成功要因の検証</div>
                <div><strong>中盤（15分）：</strong>課題や困難の分析、解決策の検討</div>
                <div><strong>終盤（15分）：</strong>次期目標設定、組織改善提案の具体化</div>
              </div>
            </div>

            <div className="bg-teal-50 rounded-lg p-4">
              <h4 className="font-semibold text-teal-900 mb-2">📊 管理職の評価軸</h4>
              <div className="text-sm text-teal-800 space-y-1">
                <div className="flex justify-between"><span>業績達成:</span><span>部署目標の達成度</span></div>
                <div className="flex justify-between"><span>人材育成:</span><span>部下の成長と定着</span></div>
                <div className="flex justify-between"><span>改善提案:</span><span>業務効率化の実現</span></div>
                <div className="flex justify-between"><span>戦略立案:</span><span>将来構想の具体性</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* まとめ */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">💫 定期面談の成功の秘訣</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">新人職員面談</h4>
            <p className="text-sm text-gray-700">「安心感」と「成長実感」を重視し、小さな成功を積み重ねる支援</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">一般職員面談</h4>
            <p className="text-sm text-gray-700">「達成感」と「将来性」を重視し、自律的な成長を促進する対話</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-orange-900 mb-2">管理職面談</h4>
            <p className="text-sm text-gray-700">「組織貢献」と「戦略思考」を重視し、リーダーシップの発揮を支援</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 特別面談ガイドタブ - ストーリー仕立て  
function SpecialInterviewGuide(): React.ReactElement {
  return (
    <div className="space-y-8">
      {/* 特別面談の基本方針 */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-orange-900 mb-4 flex items-center gap-3">
          <span className="text-3xl">⚠️</span>
          特別面談ガイド
        </h2>
        <p className="text-orange-800 text-lg mb-4">
          特別面談は、職員の特別な状況に応じて実施する重要な支援面談です。
          センシティブな状況に配慮しながら、適切なサポートを提供することが求められます。
        </p>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white/80 rounded-lg p-3">
            <h4 className="font-semibold text-orange-900 text-sm">復職面談</h4>
            <p className="text-xs text-orange-700 mt-1">休職からの復帰時</p>
          </div>
          <div className="bg-white/80 rounded-lg p-3">
            <h4 className="font-semibold text-orange-900 text-sm">インシデント後面談</h4>
            <p className="text-xs text-orange-700 mt-1">事故発生後の緊急対応</p>
          </div>
          <div className="bg-white/80 rounded-lg p-3">
            <h4 className="font-semibold text-orange-900 text-sm">退職面談</h4>
            <p className="text-xs text-orange-700 mt-1">退職前の最終確認</p>
          </div>
        </div>
      </div>

      {/* 復職面談のストーリー */}
      <div className="bg-white border border-green-200 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-green-500 rounded-full">
            <span className="text-2xl">🏥</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-green-900">復職支援のストーリー</h3>
            <p className="text-green-700">休職からの復帰を温かくサポートする面談プロセス</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">📖 鈴木さん（看護師・メンタルヘルス休職からの復職）のケース</h4>
              <div className="text-sm text-green-800 space-y-2">
                <p><strong>復職前の不安：</strong>「3ヶ月間休職していたので、仕事についていけるか心配です。同僚に迷惑をかけたという罪悪感もあります」</p>
                <p><strong>復職面談での対話：</strong>「まずは体調管理を最優先に、無理のないペースで復帰しましょう。チーム全体であなたの復帰を歓迎しています」</p>
                <p><strong>段階的復帰計画：</strong>「最初の1ヶ月は日勤のみ、2ヶ月目から夜勤も段階的に。何か不安があればいつでも相談してください」</p>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">🎯 復職面談で重視するポイント</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>健康状態確認：</strong>体調とメンタル面の回復状況</li>
                <li>• <strong>復帰意欲：</strong>仕事への意欲と準備状況</li>
                <li>• <strong>不安の把握：</strong>復職に対する心配事や懸念</li>
                <li>• <strong>段階的計画：</strong>無理のない復帰スケジュール</li>
                <li>• <strong>継続支援：</strong>復職後のフォロー体制</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">💡 復職面談の進め方</h4>
              <div className="text-sm text-yellow-800 space-y-2">
                <div><strong>導入（10分）：</strong>温かい雰囲気作り、休職期間の労い</div>
                <div><strong>現状確認（15分）：</strong>体調回復状況、医師の診断書確認</div>
                <div><strong>復帰計画（20分）：</strong>段階的復帰スケジュールの相談</div>
                <div><strong>サポート体制（10分）：</strong>必要な配慮事項の確認</div>
                <div><strong>まとめ（5分）：</strong>次回フォロー面談の約束</div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2">🤝 サポート体制</h4>
              <div className="text-sm text-purple-800 space-y-1">
                <div className="flex justify-between"><span>初期サポート:</span><span>メンター制度</span></div>
                <div className="flex justify-between"><span>業務調整:</span><span>段階的負荷増加</span></div>
                <div className="flex justify-between"><span>定期面談:</span><span>週1回→月1回</span></div>
                <div className="flex justify-between"><span>医療連携:</span><span>産業医との協働</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 退職面談のストーリー */}
      <div className="bg-white border border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-red-500 rounded-full">
            <span className="text-2xl">👋</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-900">退職面談のストーリー</h3>
            <p className="text-red-700">感謝とともに新たな門出を支援する最終面談</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-semibold text-red-900 mb-2">📖 田中さん（看護師・キャリアアップのための転職）のケース</h4>
              <div className="text-sm text-red-800 space-y-2">
                <p><strong>退職理由：</strong>「5年間お世話になりましたが、専門看護師を目指して大学病院に転職することにしました」</p>
                <p><strong>組織への感謝：</strong>「この病院で基礎をしっかり学べました。特に新人時代の温かいサポートは忘れません」</p>
                <p><strong>改善提案：</strong>「後輩のために、プリセプター制度をもう少し体系化できればと思います」</p>
                <p><strong>引継ぎ状況：</strong>「担当患者の引継ぎは完了し、マニュアルも更新しています」</p>
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4">
              <h4 className="font-semibold text-orange-900 mb-2">🎯 退職面談で重視するポイント</h4>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• <strong>退職理由確認：</strong>本当の退職理由と改善可能性</li>
                <li>• <strong>業務引継ぎ：</strong>完全な引継ぎ状況の確認</li>
                <li>• <strong>改善提案：</strong>組織改善への貴重な意見聴取</li>
                <li>• <strong>感謝の表明：</strong>貢献への感謝と良好な関係維持</li>
                <li>• <strong>将来の関係：</strong>OBとしての継続的な関係性</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-indigo-50 rounded-lg p-4">
              <h4 className="font-semibold text-indigo-900 mb-2">💡 退職面談の進め方</h4>
              <div className="text-sm text-indigo-800 space-y-2">
                <div><strong>開始（5分）：</strong>これまでの労いと感謝の表明</div>
                <div><strong>退職理由（15分）：</strong>詳細な理由と改善可能性の確認</div>
                <div><strong>振り返り（15分）：</strong>在職期間の成果と学びの共有</div>
                <div><strong>改善提案（10分）：</strong>組織への建設的な意見聴取</div>
                <div><strong>引継ぎ確認（10分）：</strong>業務引継ぎ完了状況の最終確認</div>
                <div><strong>お別れ（5分）：</strong>今後の活躍祈願と関係継続の約束</div>
              </div>
            </div>

            <div className="bg-teal-50 rounded-lg p-4">
              <h4 className="font-semibold text-teal-900 mb-2">📋 退職タイプ別対応</h4>
              <div className="text-sm text-teal-800 space-y-1">
                <div className="flex justify-between"><span>キャリアアップ:</span><span>応援・推奨</span></div>
                <div className="flex justify-between"><span>家庭の事情:</span><span>理解・配慮</span></div>
                <div className="flex justify-between"><span>職場不満:</span><span>改善検討</span></div>
                <div className="flex justify-between"><span>健康問題:</span><span>労い・支援</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* まとめ */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">⭐ 特別面談の成功の秘訣</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">復職面談</h4>
            <p className="text-sm text-gray-700">「安心感」と「段階的サポート」で、無理のない職場復帰を実現</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-red-900 mb-2">退職面談</h4>
            <p className="text-sm text-gray-700">「感謝」と「建設的対話」で、良好な関係を保ちながら改善に活用</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// サポート面談ガイドタブ - ストーリー仕立て
function SupportInterviewGuide(): React.ReactElement {
  return (
    <div className="space-y-8">
      {/* サポート面談の基本方針 */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-purple-900 mb-4 flex items-center gap-3">
          <span className="text-3xl">💬</span>
          サポート面談ガイド
        </h2>
        <p className="text-purple-800 text-lg mb-4">
          サポート面談は、職員からの相談申込に基づいて実施する任意の支援面談です。
          職員の主体性を尊重し、具体的な問題解決や成長支援を行います。
        </p>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white/80 rounded-lg p-3">
            <h4 className="font-semibold text-purple-900 text-sm">キャリア相談面談</h4>
            <p className="text-xs text-purple-700 mt-1">将来設計・スキル開発</p>
          </div>
          <div className="bg-white/80 rounded-lg p-3">
            <h4 className="font-semibold text-purple-900 text-sm">職場環境相談面談</h4>
            <p className="text-xs text-purple-700 mt-1">人間関係・業務負荷</p>
          </div>
          <div className="bg-white/80 rounded-lg p-3">
            <h4 className="font-semibold text-purple-900 text-sm">個別支援面談</h4>
            <p className="text-xs text-purple-700 mt-1">個人的な課題・悩み</p>
          </div>
        </div>
      </div>

      {/* まとめ */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🌟 サポート面談の特徴</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">職員主導の相談システム</h4>
            <p className="text-sm text-gray-700">職員自身が必要を感じた時に申込む任意の面談制度</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">VoiceDrive連携</h4>
            <p className="text-sm text-gray-700">VoiceDriveシステムとの連携により、24時間いつでも相談申込が可能</p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <h4 className="font-semibold text-indigo-900 mb-2">📋 実装予定の詳細ストーリー</h4>
          <p className="text-sm text-indigo-800">
            サポート面談の具体的なストーリーコンテンツは、VoiceDriveシステムとの連携機能実装後に、
            実際の相談事例を基に作成予定です。各カテゴリ別の対応パターンやベストプラクティスを
            ストーリー形式で提供します。
          </p>
        </div>
      </div>
    </div>
  );
}
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
      <div className={styles.dashboardHeader}>
        <h2>面談管理ダッシュボード</h2>
        <div className={styles.dashboardActions}>
          <Link href="/interview-bank" className={styles.primaryButton}>
            🏦 面談バンクシステムへ
          </Link>
          <Link href="/interview-bank/create" className={styles.secondaryButton}>
            ✨ AI面談作成
          </Link>
        </div>
      </div>
      
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

// ガイドセクション（概要・ガイドタブに統合済み）
function GuideSection({ onInterviewTypeClick }: { onInterviewTypeClick: (type: string) => void }): React.ReactElement {
  return (
    <div className="max-w-7xl mx-auto space-y-6 mt-8">
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
          <h4>医事課職員用面談シート（v5版）</h4>
          <ul>
            <li>医事課職員: 15分/30分/45分</li>
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

// 面談バンク質問管理タブ
// 削除済み - 統合バンクシステムに置き換え
function BankSystemTab_Deleted(): React.ReactElement {
  return (
    <div className="p-6 text-center">
      <p className="text-muted-foreground">このタブは統合バンクシステムに置き換えられました。</p>
    </div>
  );
}

// 元のBankSystemTab実装（削除済み）
function BankSystemTab_Original(): React.ReactElement {
  const [activeSection, setActiveSection] = useState<string>('basic_info')
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [questions, setQuestions] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  // セクション定義
  const sections = [
    { id: 'basic_info', label: '基本情報', icon: '👤', color: 'blue', count: 12 },
    { id: 'career_development', label: 'キャリア・成長', icon: '📈', color: 'green', count: 18 },
    { id: 'work_environment', label: '職場環境', icon: '🏢', color: 'purple', count: 15 },
    { id: 'skills_performance', label: 'スキル・パフォーマンス', icon: '⭐', color: 'orange', count: 22 },
    { id: 'team_collaboration', label: 'チーム・連携', icon: '🤝', color: 'teal', count: 14 },
    { id: 'work_life_balance', label: 'ワークライフバランス', icon: '⚖️', color: 'indigo', count: 10 },
    { id: 'future_goals', label: '今後の目標', icon: '🎯', color: 'red', count: 16 },
    { id: 'feedback_improvement', label: 'フィードバック・改善', icon: '💡', color: 'yellow', count: 13 }
  ]

  // モックデータ
  useEffect(() => {
    const mockQuestions = [
      {
        id: 'q001',
        section: 'basic_info',
        text: '現在の業務内容について教えてください',
        type: 'textarea',
        category: 'regular',
        priority: 1,
        usageCount: 245,
        isRequired: true,
        tags: ['基本', '業務内容'],
        createdAt: '2024-01-15',
        createdBy: '田中師長'
      },
      {
        id: 'q002',
        section: 'basic_info',
        text: '職場環境についてどう感じていますか？',
        type: 'scale',
        category: 'regular',
        priority: 2,
        usageCount: 198,
        isRequired: true,
        options: ['非常に良い', '良い', '普通', '改善が必要', '不満'],
        tags: ['職場環境', '満足度'],
        createdAt: '2024-02-01',
        createdBy: '鈴木主任'
      },
      {
        id: 'q003',
        section: 'career_development',
        text: '今後のキャリアプランについて教えてください',
        type: 'textarea',
        category: 'regular',
        priority: 1,
        usageCount: 156,
        isRequired: false,
        tags: ['キャリア', '将来'],
        createdAt: '2024-02-10',
        createdBy: '佐々木師長'
      }
    ]
    setQuestions(mockQuestions)
  }, [])

  const filteredQuestions = questions.filter(q => 
    q.section === activeSection && 
    (searchTerm === '' || q.text.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            🏦 面談バンク質問管理
          </h2>
          <p className="text-gray-600 mt-1">質問テンプレートの確認・編集・追加</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            📊 総質問数: {questions.length}
          </span>
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            ➕ 新規質問追加
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* 左サイドバー - セクション一覧 */}
        <div className="w-80 bg-white rounded-xl shadow-sm border">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900 mb-3">質問セクション</h3>
            <input
              type="text"
              placeholder="質問を検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          
          <div className="p-2 max-h-96 overflow-y-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors mb-1 ${
                  activeSection === section.id
                    ? `bg-${section.color}-50 text-${section.color}-700 border border-${section.color}-200`
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{section.icon}</span>
                  <div>
                    <div className="font-medium text-sm">{section.label}</div>
                    <div className="text-xs text-gray-500">{section.count}問</div>
                  </div>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {section.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 中央エリア - 質問リスト */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                {sections.find(s => s.id === activeSection)?.label || ''}の質問一覧
              </h3>
              <span className="text-sm text-gray-500">
                {filteredQuestions.length}件の質問
              </span>
            </div>
          </div>
          
          <div className="divide-y max-h-96 overflow-y-auto">
            {filteredQuestions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-2">📝</div>
                <p>該当する質問がありません</p>
                <p className="text-sm">新しい質問を追加してください</p>
              </div>
            ) : (
              filteredQuestions.map((question) => (
                <div
                  key={question.id}
                  onClick={() => setSelectedQuestion(question)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedQuestion?.id === question.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {question.text}
                        </span>
                        {question.isRequired && (
                          <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                            必須
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>形式: {question.type}</span>
                        <span>使用回数: {question.usageCount}</span>
                        <span>優先度: {question.priority}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {question.tags.map((tag: string) => (
                          <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-right text-xs text-gray-500">
                      <div>{question.createdAt}</div>
                      <div>{question.createdBy}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 右パネル - 質問詳細・編集 */}
        <div className="w-80 bg-white rounded-xl shadow-sm border">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900">質問詳細</h3>
          </div>
          
          <div className="p-4">
            {selectedQuestion ? (
              <QuestionDetailPanel
                question={selectedQuestion}
                onEdit={() => setIsEditing(true)}
                onDelete={(id) => {
                  setQuestions(questions.filter(q => q.id !== id))
                  setSelectedQuestion(null)
                }}
              />
            ) : (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-2">👈</div>
                <p>質問を選択してください</p>
                <p className="text-sm">詳細情報と編集機能が表示されます</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 質問編集モーダル */}
      {isEditing && (
        <QuestionEditModal
          question={selectedQuestion}
          sections={sections}
          onSave={(questionData) => {
            if (selectedQuestion) {
              // 編集
              setQuestions(questions.map(q => 
                q.id === selectedQuestion.id ? { ...q, ...questionData } : q
              ))
            } else {
              // 新規追加
              const newQuestion = {
                id: `q${String(questions.length + 1).padStart(3, '0')}`,
                ...questionData,
                usageCount: 0,
                createdAt: new Date().toISOString().split('T')[0],
                createdBy: '現在のユーザー'
              }
              setQuestions([...questions, newQuestion])
            }
            setIsEditing(false)
            setSelectedQuestion(null)
          }}
          onCancel={() => {
            setIsEditing(false)
            setSelectedQuestion(null)
          }}
        />
      )}
    </div>
  )
}

// 質問詳細パネル
interface QuestionDetailPanelProps {
  question: any
  onEdit: () => void
  onDelete: (id: string) => void
}

function QuestionDetailPanel({ question, onEdit, onDelete }: QuestionDetailPanelProps): React.ReactElement {
  const handleDelete = () => {
    if (window.confirm('この質問を削除しますか？この操作は元に戻すことができません。')) {
      onDelete(question.id)
    }
  }

  return (
    <div className="space-y-4">
      {/* 質問内容 */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">質問文</label>
        <div className="bg-gray-50 p-3 rounded-lg text-sm">
          {question.text}
        </div>
      </div>

      {/* 基本情報 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">回答形式</label>
          <div className="text-sm text-gray-600">{question.type}</div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">優先度</label>
          <div className="text-sm text-gray-600">{question.priority}</div>
        </div>
      </div>

      {/* 選択肢（該当する場合） */}
      {question.options && (
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">選択肢</label>
          <div className="space-y-1">
            {question.options.map((option: string, index: number) => (
              <div key={index} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                {index + 1}. {option}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 使用統計 */}
      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-900 mb-3">使用統計</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">使用回数:</span>
            <span className="font-medium ml-2">{question.usageCount}回</span>
          </div>
          <div>
            <span className="text-gray-600">必須項目:</span>
            <span className="font-medium ml-2">{question.isRequired ? 'はい' : 'いいえ'}</span>
          </div>
        </div>
      </div>

      {/* タグ */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">タグ</label>
        <div className="flex flex-wrap gap-1">
          {question.tags.map((tag: string) => (
            <span key={tag} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 作成情報 */}
      <div className="border-t pt-4 text-xs text-gray-500">
        <div>作成日: {question.createdAt}</div>
        <div>作成者: {question.createdBy}</div>
      </div>

      {/* アクションボタン */}
      <div className="flex gap-2 pt-4">
        <button
          onClick={onEdit}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm"
        >
          📝 編集
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm"
        >
          🗑️ 削除
        </button>
      </div>
    </div>
  )
}

// 質問編集モーダル
interface QuestionEditModalProps {
  question: any | null
  sections: any[]
  onSave: (questionData: any) => void
  onCancel: () => void
}

function QuestionEditModal({ question, sections, onSave, onCancel }: QuestionEditModalProps): React.ReactElement {
  const [formData, setFormData] = useState({
    text: question?.text || '',
    type: question?.type || 'textarea',
    section: question?.section || 'basic_info',
    category: question?.category || 'regular',
    priority: question?.priority || 1,
    isRequired: question?.isRequired || false,
    tags: question?.tags?.join(', ') || '',
    options: question?.options?.join('\n') || ''
  })

  const questionTypes = [
    { value: 'textarea', label: 'テキストエリア（長文）' },
    { value: 'text', label: 'テキスト（短文）' },
    { value: 'scale', label: '評価スケール' },
    { value: 'single_choice', label: '単一選択' },
    { value: 'multiple_choice', label: '複数選択' },
    { value: 'rating', label: '評点' },
    { value: 'date', label: '日付' }
  ]

  const categories = [
    { value: 'regular', label: '定期面談' },
    { value: 'special', label: '特別面談' },
    { value: 'support', label: 'サポート面談' }
  ]

  const handleSave = () => {
    if (!formData.text.trim()) {
      alert('質問文を入力してください')
      return
    }

    const questionData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      options: formData.options ? formData.options.split('\n').map(opt => opt.trim()).filter(opt => opt) : undefined
    }

    onSave(questionData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold">
            {question ? '質問を編集' : '新しい質問を追加'}
          </h3>
        </div>

        <div className="p-6 space-y-6">
          {/* 質問文 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              質問文 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
              rows={3}
              placeholder="面談で聞きたい質問を入力してください"
            />
          </div>

          {/* 基本設定 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">回答形式</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {questionTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">セクション</label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {sections.map(section => (
                  <option key={section.id} value={section.id}>{section.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">面談カテゴリ</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">優先度</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value={1}>高 (1)</option>
                <option value={2}>中 (2)</option>
                <option value={3}>低 (3)</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isRequired}
                  onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">必須項目</span>
              </label>
            </div>
          </div>

          {/* 選択肢（該当する場合） */}
          {(formData.type === 'scale' || formData.type === 'single_choice' || formData.type === 'multiple_choice' || formData.type === 'rating') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                選択肢（1行に1つずつ入力）
              </label>
              <textarea
                value={formData.options}
                onChange={(e) => setFormData({ ...formData, options: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
                rows={4}
                placeholder="選択肢1&#10;選択肢2&#10;選択肢3"
              />
            </div>
          )}

          {/* タグ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タグ（カンマ区切り）
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="基本, 業務内容, 重要"
            />
          </div>
        </div>

        {/* フッター */}
        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            {question ? '更新' : '追加'}
          </button>
        </div>
      </div>
    </div>
  )
}

// 統合概要コンテンツ
function BankOverviewContent(): React.ReactElement {
  return (
    <div className="space-y-6">
      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              📊
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">総面談数</h3>
              <p className="text-2xl font-bold text-blue-700">1,247</p>
              <p className="text-sm text-blue-600">全バンク合計</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              ✅
            </div>
            <div>
              <h3 className="font-semibold text-green-900">完了率</h3>
              <p className="text-2xl font-bold text-green-700">94.3%</p>
              <p className="text-sm text-green-600">今月実績</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              ⚡
            </div>
            <div>
              <h3 className="font-semibold text-purple-900">平均時間</h3>
              <p className="text-2xl font-bold text-purple-700">32分</p>
              <p className="text-sm text-purple-600">面談あたり</p>
            </div>
          </div>
        </div>
      </div>

      {/* バンク別状況 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            📅 定期面談バンク
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>実施数</span>
              <span className="font-bold">892</span>
            </div>
            <div className="flex justify-between">
              <span>完了</span>
              <span className="font-bold text-green-600">847</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            ⚠️ 特別面談バンク
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>実施数</span>
              <span className="font-bold">187</span>
            </div>
            <div className="flex justify-between">
              <span>重要案件</span>
              <span className="font-bold text-red-600">12</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: '82%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            💬 サポート面談バンク
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>申込数</span>
              <span className="font-bold">168</span>
            </div>
            <div className="flex justify-between">
              <span>解決率</span>
              <span className="font-bold text-green-600">89%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '89%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* クイックアクセス */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-4">クイックアクセス</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button 
            onClick={() => window.open('/interview-bank/create', '_blank')}
            className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-3 text-left transition-colors"
          >
            <div className="text-2xl mb-1">✨</div>
            <div className="font-medium text-sm">AI面談作成</div>
          </button>
          <button 
            onClick={() => window.open('/interview-bank', '_blank')}
            className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-3 text-left transition-colors"
          >
            <div className="text-2xl mb-1">📊</div>
            <div className="font-medium text-sm">統計ダッシュボード</div>
          </button>
          <button 
            onClick={() => window.open('/interview-bank/history', '_blank')}
            className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-3 text-left transition-colors"
          >
            <div className="text-2xl mb-1">📋</div>
            <div className="font-medium text-sm">面談履歴</div>
          </button>
          <button 
            onClick={() => window.open('/admin/interview-bank', '_blank')}
            className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-3 text-left transition-colors"
          >
            <div className="text-2xl mb-1">⚙️</div>
            <div className="font-medium text-sm">バンク管理</div>
          </button>
        </div>
      </div>
    </div>
  )
}

// 定期面談バンクコンテンツ
function RegularBankContent(): React.ReactElement {
  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
          📅 定期面談バンク - 動的質問生成システム
        </h3>
        <p className="text-green-700 text-sm mb-4">
          職員の経験年数・職種・部署に応じて最適な面談シートを自動生成
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-green-900 mb-2">対応職種</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• 看護師（新人～ベテラン、主任、師長）</li>
              <li>• 准看護師（新人～ベテラン）</li>
              <li>• 看護補助者（新人～ベテラン、リーダー）</li>
              <li>• 医事課職員（全レベル）</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-green-900 mb-2">生成される時間</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• 15分面談: 8-12問</li>
              <li>• 30分面談: 16-24問</li>
              <li>• 45分面談: 24-36問</li>
            </ul>
          </div>
        </div>
        <button 
          onClick={() => window.open('/interview-bank/create?type=regular', '_blank')}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          定期面談シート生成
        </button>
      </div>
    </div>
  )
}

// 特別面談バンクコンテンツ
function SpecialBankContent(): React.ReactElement {
  return (
    <div className="space-y-4">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
          ⚠️ 特別面談バンク - 状況別対応システム
        </h3>
        <p className="text-orange-700 text-sm mb-4">
          退職・異動・復職・昇進・懲戒など特別な状況に応じた専門質問バンク
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-orange-900 mb-2">対応面談タイプ</h4>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• 退職面談（試用期間、一般、自己都合、会社都合）</li>
              <li>• 異動面談（部署異動、配置転換）</li>
              <li>• 復職面談（休職からの復帰）</li>
              <li>• 昇進面談（昇進・昇格対応）</li>
              <li>• 懲戒面談（規律違反対応）</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-orange-900 mb-2">特徴</h4>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• 状況別専門質問（597問収録）</li>
              <li>• 機密度レベル管理</li>
              <li>• 法的コンプライアンス対応</li>
              <li>• フォローアップ機能</li>
            </ul>
          </div>
        </div>
        <button 
          onClick={() => window.open('/interview-bank/create?type=special', '_blank')}
          className="mt-4 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          特別面談シート生成
        </button>
      </div>
    </div>
  )
}

// サポート面談バンクコンテンツ
function SupportBankContent(): React.ReactElement {
  return (
    <div className="space-y-4">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
          💬 サポート面談バンク - VoiceDrive連携システム
        </h3>
        <p className="text-purple-700 text-sm mb-4">
          職員からの相談申込を受けて、カテゴリ別に最適化された面談シートを生成
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-purple-900 mb-2">相談カテゴリ</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• キャリア相談（昇進、スキル、異動）</li>
              <li>• 職場環境（設備、人間関係、業務負荷）</li>
              <li>• 個別相談（給与、研修、コンプライアンス）</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-purple-900 mb-2">VoiceDrive連携</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• SNS申込システム連携</li>
              <li>• リアルタイム通知</li>
              <li>• 自動優先度判定</li>
              <li>• 匿名相談対応</li>
            </ul>
          </div>
        </div>
        <button 
          onClick={() => window.open('/interview-bank/create?type=support', '_blank')}
          className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          サポート面談シート生成
        </button>
      </div>

      {/* VoiceDrive連携状況 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
          🔗 VoiceDrive連携状況
        </h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-700">24</div>
            <div className="text-sm text-blue-600">未処理申込</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-700">156</div>
            <div className="text-sm text-green-600">今月完了</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-700">2.3h</div>
            <div className="text-sm text-purple-600">平均応答時間</div>
          </div>
        </div>
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

// 履歴・分析タブコンポーネント
interface HistoryAnalysisTabProps {
  interviews: Interview[]
}

function HistoryAnalysisTab({ interviews }: HistoryAnalysisTabProps): React.ReactElement {
  return (
    <div className={styles.historyContainer}>
      <h2>面談履歴・分析</h2>
      <div className={styles.analysisContent}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>実施済み面談</h3>
            <p className={styles.statValue}>{interviews.filter(i => i.status === 'completed').length}</p>
          </div>
          <div className={styles.statCard}>
            <h3>予定面談</h3>
            <p className={styles.statValue}>{interviews.filter(i => i.status === 'scheduled').length}</p>
          </div>
          <div className={styles.statCard}>
            <h3>総面談数</h3>
            <p className={styles.statValue}>{interviews.length}</p>
          </div>
        </div>
        <div className={styles.comingSoon}>
          <p>詳細な分析機能は現在開発中です</p>
        </div>
      </div>
    </div>
  )
}

export default function InterviewsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InterviewsPageContent />
    </Suspense>
  )
}// Force rebuild: 1755915257
