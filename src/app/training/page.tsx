'use client'

import React, { useState } from 'react'
import CommonHeader from '@/components/CommonHeader'
import Link from 'next/link'
import styles from './Training.module.css'

const tabs = [
  { id: 'programs', label: '📚 研修プログラム', icon: '📚' },
  { id: 'schedule', label: '📅 スケジュール', icon: '📅' },
  { id: 'progress', label: '📊 進捗管理', icon: '📊' },
  { id: 'history', label: '📝 受講履歴', icon: '📝' },
  { id: 'analytics', label: '📈 分析', icon: '📈' },
]

interface TrainingProgram {
  id: string
  name: string
  category: string
  targetRole: string[]
  type: 'mandatory' | 'optional'
  duration: string
  completionRate: number
  totalParticipants: number
  completedParticipants: number
  nextSession: string
  status: 'active' | 'upcoming' | 'completed'
}

export default function TrainingPage() {
  const [activeTab, setActiveTab] = useState('programs')
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFacility, setSelectedFacility] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedRole, setSelectedRole] = useState('all')

  const mockPrograms: TrainingProgram[] = [
    {
      id: 'TR001',
      name: '医療安全研修',
      category: '必須研修',
      targetRole: ['医師', '看護師', '薬剤師', '検査技師'],
      type: 'mandatory',
      duration: '2時間',
      completionRate: 85,
      totalParticipants: 250,
      completedParticipants: 213,
      nextSession: '2024-08-05',
      status: 'active'
    },
    {
      id: 'TR002',
      name: '感染対策基礎研修',
      category: '必須研修',
      targetRole: ['全職種'],
      type: 'mandatory',
      duration: '3時間',
      completionRate: 92,
      totalParticipants: 350,
      completedParticipants: 322,
      nextSession: '2024-08-10',
      status: 'active'
    },
    {
      id: 'TR003',
      name: 'リーダーシップ研修',
      category: 'スキルアップ',
      targetRole: ['看護師', '管理職候補'],
      type: 'optional',
      duration: '1日',
      completionRate: 65,
      totalParticipants: 40,
      completedParticipants: 26,
      nextSession: '2024-08-15',
      status: 'upcoming'
    },
    {
      id: 'TR004',
      name: '新人看護師オリエンテーション',
      category: '新人研修',
      targetRole: ['看護師'],
      type: 'mandatory',
      duration: '3日間',
      completionRate: 100,
      totalParticipants: 15,
      completedParticipants: 15,
      nextSession: '2024-09-01',
      status: 'completed'
    }
  ]

  const handleProgramSelect = (program: TrainingProgram) => {
    setSelectedProgram(program)
    setActiveTab('progress')
  }

  const filteredPrograms = mockPrograms.filter((program) => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || program.category === selectedCategory
    const matchesRole = selectedRole === 'all' || program.targetRole.includes(selectedRole) || program.targetRole.includes('全職種')
    return matchesSearch && matchesCategory && matchesRole
  })

  return (
    <div>
      <CommonHeader 
        title="教育・研修管理" 
        showBackButton={true} 
        backUrl="/"
        backText="ダッシュボードに戻る"
      />
      
      <div className={styles.container}>
        <div className={styles.tabNavigation}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'programs' && (
            <ProgramsTab 
              programs={filteredPrograms}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedFacility={selectedFacility}
              setSelectedFacility={setSelectedFacility}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
              onProgramSelect={handleProgramSelect}
            />
          )}
          {activeTab === 'schedule' && <ScheduleTab />}
          {activeTab === 'progress' && <ProgressTab selectedProgram={selectedProgram} />}
          {activeTab === 'history' && <HistoryTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
        </div>
      </div>
    </div>
  )
}

interface ProgramsTabProps {
  programs: TrainingProgram[]
  searchTerm: string
  setSearchTerm: (value: string) => void
  selectedFacility: string
  setSelectedFacility: (value: string) => void
  selectedCategory: string
  setSelectedCategory: (value: string) => void
  selectedRole: string
  setSelectedRole: (value: string) => void
  onProgramSelect: (program: TrainingProgram) => void
}

function ProgramsTab({ programs, searchTerm, setSearchTerm, selectedFacility, setSelectedFacility, selectedCategory, setSelectedCategory, selectedRole, setSelectedRole, onProgramSelect }: ProgramsTabProps) {
  return (
    <div className={styles.listContainer}>
      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="研修名で検索"
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
            <option value="立髪診療所">立髪診療所</option>
          </select>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">全カテゴリー</option>
            <option value="必須研修">必須研修</option>
            <option value="新人研修">新人研修</option>
            <option value="スキルアップ">スキルアップ</option>
            <option value="専門研修">専門研修</option>
          </select>
          <select 
            value={selectedRole} 
            onChange={(e) => setSelectedRole(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">全職種</option>
            <option value="医師">医師</option>
            <option value="看護師">看護師</option>
            <option value="薬剤師">薬剤師</option>
            <option value="検査技師">検査技師</option>
            <option value="事務職">事務職</option>
          </select>
        </div>
      </div>

      <div className={styles.listHeader}>
        <h2>研修プログラム一覧 ({programs.length}件)</h2>
        <button className={styles.addButton}>
          + 新規研修を追加
        </button>
      </div>

      <div className={styles.programGrid}>
        {programs.map((program) => (
          <div key={program.id} className={styles.programCard} onClick={() => onProgramSelect(program)}>
            <div className={styles.cardHeader}>
              <div className={styles.cardInfo}>
                <h3>{program.name}</h3>
                <p className={styles.programCategory}>{program.category}</p>
                <p className={styles.programTarget}>対象: {program.targetRole.join(', ')}</p>
                <p className={styles.programDuration}>所要時間: {program.duration}</p>
              </div>
              <div className={styles.cardStatus}>
                <span className={`${styles.typeBadge} ${program.type === 'mandatory' ? styles.mandatory : styles.optional}`}>
                  {program.type === 'mandatory' ? '必須' : '任意'}
                </span>
                <span className={`${styles.statusBadge} ${
                  program.status === 'active' ? styles.statusActive : 
                  program.status === 'upcoming' ? styles.statusUpcoming : 
                  styles.statusCompleted
                }`}>
                  {program.status === 'active' ? '実施中' : 
                   program.status === 'upcoming' ? '予定' : 
                   '完了'}
                </span>
              </div>
            </div>
            <div className={styles.cardProgress}>
              <div className={styles.progressInfo}>
                <span>進捗率</span>
                <span className={styles.progressValue}>{program.completionRate}%</span>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${program.completionRate}%` }}
                ></div>
              </div>
              <p className={styles.progressDetail}>
                {program.completedParticipants}/{program.totalParticipants}名 完了
              </p>
            </div>
            <div className={styles.cardFooter}>
              <div className={styles.nextSession}>
                <span className={styles.nextLabel}>次回開催</span>
                <span className={styles.nextDate}>{new Date(program.nextSession).toLocaleDateString('ja-JP')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ScheduleTab(): React.ReactElement {
  return (
    <div className={styles.scheduleContainer}>
      <h2>研修スケジュール</h2>
      <div className={styles.calendarView}>
        <div className={styles.monthHeader}>
          <button className={styles.navButton}>←</button>
          <h3>2024年8月</h3>
          <button className={styles.navButton}>→</button>
        </div>
        <div className={styles.calendarGrid}>
          <div className={styles.calendarDay}>
            <div className={styles.dayNumber}>5</div>
            <div className={styles.dayEvents}>
              <div className={styles.eventItem}>医療安全研修</div>
            </div>
          </div>
          <div className={styles.calendarDay}>
            <div className={styles.dayNumber}>10</div>
            <div className={styles.dayEvents}>
              <div className={styles.eventItem}>感染対策基礎研修</div>
            </div>
          </div>
          <div className={styles.calendarDay}>
            <div className={styles.dayNumber}>15</div>
            <div className={styles.dayEvents}>
              <div className={styles.eventItem}>リーダーシップ研修</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ProgressTabProps {
  selectedProgram: TrainingProgram | null
}

function ProgressTab({ selectedProgram }: ProgressTabProps) {
  if (!selectedProgram) {
    return (
      <div className={styles.noSelection}>
        <p>研修プログラムを選択してください</p>
      </div>
    )
  }

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressHeader}>
        <h2>{selectedProgram.name} - 進捗管理</h2>
      </div>

      <div className={styles.progressOverview}>
        <div className={styles.overviewCard}>
          <h3>全体進捗</h3>
          <div className={styles.bigProgressBar}>
            <div 
              className={styles.bigProgressFill} 
              style={{ width: `${selectedProgram.completionRate}%` }}
            ></div>
          </div>
          <p className={styles.overviewStats}>
            {selectedProgram.completedParticipants} / {selectedProgram.totalParticipants} 名完了 ({selectedProgram.completionRate}%)
          </p>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h4>未受講者</h4>
            <p className={styles.statNumber}>{selectedProgram.totalParticipants - selectedProgram.completedParticipants}名</p>
          </div>
          <div className={styles.statCard}>
            <h4>期限超過</h4>
            <p className={styles.statNumber}>5名</p>
          </div>
          <div className={styles.statCard}>
            <h4>平均完了時間</h4>
            <p className={styles.statNumber}>2.5時間</p>
          </div>
        </div>
      </div>

      <div className={styles.participantsList}>
        <h3>部署別進捗状況</h3>
        <div className={styles.departmentGrid}>
          <div className={styles.departmentItem}>
            <div className={styles.departmentName}>外科病棟</div>
            <div className={styles.departmentProgress}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: '90%' }}></div>
              </div>
              <span className={styles.departmentRate}>90%</span>
            </div>
          </div>
          <div className={styles.departmentItem}>
            <div className={styles.departmentName}>内科病棟</div>
            <div className={styles.departmentProgress}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: '85%' }}></div>
              </div>
              <span className={styles.departmentRate}>85%</span>
            </div>
          </div>
          <div className={styles.departmentItem}>
            <div className={styles.departmentName}>救急科</div>
            <div className={styles.departmentProgress}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: '75%' }}></div>
              </div>
              <span className={styles.departmentRate}>75%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function HistoryTab(): React.ReactElement {
  return (
    <div className={styles.historyContainer}>
      <h2>受講履歴</h2>
      <div className={styles.historyFilters}>
        <input 
          type="text" 
          placeholder="職員名で検索" 
          className={styles.searchInput}
        />
        <select className={styles.filterSelect}>
          <option value="all">全期間</option>
          <option value="1month">過去1ヶ月</option>
          <option value="3months">過去3ヶ月</option>
          <option value="1year">過去1年</option>
        </select>
      </div>
      <div className={styles.historyTable}>
        <table>
          <thead>
            <tr>
              <th>受講日</th>
              <th>職員名</th>
              <th>研修名</th>
              <th>評価</th>
              <th>修了証</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2024-07-15</td>
              <td>山田太郎</td>
              <td>医療安全研修</td>
              <td>合格</td>
              <td><button className={styles.downloadButton}>ダウンロード</button></td>
            </tr>
            <tr>
              <td>2024-07-14</td>
              <td>佐藤花子</td>
              <td>感染対策基礎研修</td>
              <td>合格</td>
              <td><button className={styles.downloadButton}>ダウンロード</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AnalyticsTab(): React.ReactElement {
  return (
    <div className={styles.analyticsContainer}>
      <h2>研修分析</h2>
      <div className={styles.analyticsGrid}>
        <div className={styles.analyticsCard}>
          <h3>職種別受講率</h3>
          <div className={styles.chartContainer}>
            <div className={styles.chartBar}>
              <span className={styles.chartLabel}>看護師</span>
              <div className={styles.chartProgress}>
                <div className={styles.chartFill} style={{ width: '92%' }}></div>
              </div>
              <span className={styles.chartValue}>92%</span>
            </div>
            <div className={styles.chartBar}>
              <span className={styles.chartLabel}>医師</span>
              <div className={styles.chartProgress}>
                <div className={styles.chartFill} style={{ width: '85%' }}></div>
              </div>
              <span className={styles.chartValue}>85%</span>
            </div>
            <div className={styles.chartBar}>
              <span className={styles.chartLabel}>薬剤師</span>
              <div className={styles.chartProgress}>
                <div className={styles.chartFill} style={{ width: '88%' }}></div>
              </div>
              <span className={styles.chartValue}>88%</span>
            </div>
          </div>
        </div>
        
        <div className={styles.analyticsCard}>
          <h3>月別受講者数推移</h3>
          <div className={styles.comingSoon}>
            <p>グラフ表示機能は開発中です</p>
          </div>
        </div>
        
        <div className={styles.analyticsCard}>
          <h3>研修効果測定</h3>
          <div className={styles.comingSoon}>
            <p>効果測定機能は開発中です</p>
          </div>
        </div>
      </div>
    </div>
  )
}