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
        interviewType: interviewData.interviewType || 'ad_hoc',
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
          {activeTab === 'guide' && <GuideTab />}
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
    { type: 'career_development', label: 'キャリア開発面談', count: 5, pending: 3 },
    { type: 'stress_care', label: 'ストレスケア面談', count: 3, urgent: true },
    { type: 'performance_review', label: '人事評価面談', count: 30, required: 50, rate: 60 },
    { type: 'grievance', label: '苦情・相談面談', count: 2, pending: 1 },
    { type: 'exit_interview', label: '退職面談', count: 1, scheduled: 1 },
    { type: 'ad_hoc', label: '随時面談', count: 7, available: true },
  ]

  const todayTasks = [
    { time: '09:00', type: '新入職員月次面談', name: '山田花子', location: '面談室A' },
    { time: '14:00', type: 'キャリア開発面談', name: '佐藤太郎', location: '面談室B' },
    { time: '16:00', type: 'ストレスケア面談', name: '鈴木一郎', location: 'オンライン' },
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
function GuideTab(): React.ReactElement {
  return (
    <div className={styles.guideContainer}>
      <h2>面談管理システム ガイド</h2>
      
      <div className={styles.guideSection}>
        <h3>📖 システム概要</h3>
        <div className={styles.guideContent}>
          <p>このシステムは、医療法人厚生会の面談制度を総合的に管理するためのシステムです。</p>
          <p>11種類の面談タイプと13種類の相談カテゴリに対応し、職員と人事部の両方から利用できます。</p>
        </div>
      </div>

      <div className={styles.guideSection}>
        <h3>🎯 面談の種類（11種類）</h3>
        <ul className={styles.guideList}>
          <li><strong>新入職員月次面談</strong> - 入職1年未満の職員に月1回実施（必須）</li>
          <li><strong>一般職員年次面談</strong> - 全職員対象、年1回実施（必須）</li>
          <li><strong>管理職半年面談</strong> - 管理職対象、半年に1回実施（必須）</li>
          <li><strong>インシデント後面談</strong> - インシデント発生後の職員フォロー</li>
          <li><strong>復職面談</strong> - 休職からの復職時に実施</li>
          <li><strong>キャリア開発面談</strong> - キャリア形成の相談（随時）</li>
          <li><strong>ストレスケア面談</strong> - メンタルヘルスケア（随時）</li>
          <li><strong>人事評価面談</strong> - 評価フィードバック（年2回）</li>
          <li><strong>苦情・相談面談</strong> - 職場の問題相談（随時）</li>
          <li><strong>退職面談</strong> - 退職予定者との面談</li>
          <li><strong>随時面談</strong> - その他の相談（随時）</li>
        </ul>
      </div>

      <div className={styles.guideSection}>
        <h3>📝 相談カテゴリ（13種類）</h3>
        <div className={styles.categoryGrid}>
          <div className={styles.categoryItem}>キャリアパス</div>
          <div className={styles.categoryItem}>スキル開発</div>
          <div className={styles.categoryItem}>職場環境</div>
          <div className={styles.categoryItem}>業務負荷・ワークライフバランス</div>
          <div className={styles.categoryItem}>人間関係</div>
          <div className={styles.categoryItem}>パフォーマンス</div>
          <div className={styles.categoryItem}>給与・待遇</div>
          <div className={styles.categoryItem}>研修・教育</div>
          <div className={styles.categoryItem}>昇進・昇格</div>
          <div className={styles.categoryItem}>異動・転勤</div>
          <div className={styles.categoryItem}>健康・安全</div>
          <div className={styles.categoryItem}>コンプライアンス</div>
          <div className={styles.categoryItem}>その他</div>
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
            <li>リーダー看護師: 15分/30分/45分</li>
            <li>主任看護師: 15分/30分/45分</li>
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
  const [selectedStaff, setSelectedStaff] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSheetDuration, setSelectedSheetDuration] = useState<number | null>(null)
  const [showSheet, setShowSheet] = useState(false)
  
  const filteredStaff = Object.values(staffDatabase).filter(staff => 
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectSheet = (sheetPath: string) => {
    // パスから時間を抽出 (例: /interview-sheets/new/30 -> 30)
    const duration = parseInt(sheetPath.split('/').pop() || '30')
    setSelectedSheetDuration(duration)
    setShowSheet(true)
  }

  return (
    <div className={styles.sheetsContainer}>
      <h2>面談シート選択</h2>
      
      {!showSheet ? (
        <div className={styles.sheetSelectionArea}>
          <div className={styles.staffSearchSection}>
            <h3>職員を選択</h3>
            <input
              type="text"
              placeholder="職員名または職員IDで検索"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            
            <div className={styles.staffList}>
              {filteredStaff.slice(0, 10).map((staff) => (
                <div
                  key={staff.id}
                  className={`${styles.staffItem} ${selectedStaff?.id === staff.id ? styles.selected : ''}`}
                  onClick={() => setSelectedStaff(staff)}
                >
                  <div className={styles.staffInfo}>
                    <span className={styles.staffName}>{staff.name}</span>
                    <span className={styles.staffId}>ID: {staff.id}</span>
                  </div>
                  <span className={styles.staffExperience}>経験年数: {staff.経験年数}年</span>
                </div>
              ))}
            </div>
          </div>
          
          {selectedStaff && (
            <div className={styles.sheetSelectorSection}>
              <InterviewSheetSelector
                staffId={selectedStaff.id}
                staffName={selectedStaff.name}
                yearsOfExperience={selectedStaff.経験年数}
                onSelectSheet={handleSelectSheet}
              />
            </div>
          )}
        </div>
      ) : (
        <div className={styles.sheetViewerSection}>
          <button
            onClick={() => setShowSheet(false)}
            className={`${styles.backButton} print:hidden`}
          >
            ← 職員選択に戻る
          </button>
          {selectedStaff && selectedSheetDuration && (
            <InterviewSheetWrapper
              experienceCategory={getExperienceCategory(selectedStaff.経験年数)}
              duration={selectedSheetDuration}
              staffName={selectedStaff.name}
              yearsOfExperience={selectedStaff.経験年数}
            />
          )}
        </div>
      )}
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