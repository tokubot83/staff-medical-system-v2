'use client'

import React, { useState, useEffect, useMemo, Suspense } from 'react'
import CommonHeader from '@/components/CommonHeader'
import DashboardButton from '@/components/DashboardButton'
import Link from 'next/link'
import styles from './Training.module.css'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js'
import { Doughnut, Bar, Line } from 'react-chartjs-2'
import { useSearchParams } from 'next/navigation'
import LegalTrainingGuide from '@/components/education/LegalTrainingGuide'
import EvaluationItemBank from '@/components/training/EvaluationItemBank'
import TrainingPlanGenerator from '@/components/training/TrainingPlanGenerator'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
)

const tabs = [
  { id: 'programs', label: '研修プログラム', icon: '📚' },
  { id: 'planning', label: '研修計画', icon: '📅' },
  { id: 'schedule', label: 'スケジュール', icon: '📅' },
  { id: 'progress', label: '進捗管理', icon: '📊' },
  { id: 'individual', label: '個人管理', icon: '👤' },
  { id: 'history', label: '受講履歴', icon: '📝' },
  { id: 'analytics', label: '分析', icon: '📈' },
  { id: 'itembank', label: '項目バンク', icon: '📋' },
  { id: 'guide', label: 'ガイド', icon: '📖' },
  { id: 'settings', label: '設定', icon: '⚙️' },
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

interface Staff {
  id: string
  name: string
  department: string
  position: string
  trainingHours: number
  completionRate: number
  understandingScore: number
  isNurse: boolean
  jnaLevel?: string
  continuingEducationUnits?: number
}

function TrainingPageContent() {
  const searchParams = useSearchParams()
  const staffIdFromUrl = searchParams.get('staffId')
  const tabFromUrl = searchParams.get('tab')
  
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'programs')
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null)
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFacility, setSelectedFacility] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedRole, setSelectedRole] = useState('all')

  const mockPrograms = useMemo<TrainingProgram[]>(() => [
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
  ], [])

  const mockStaff = useMemo<Staff[]>(() => [
    {
      id: 'ST001',
      name: '田中美咲',
      department: '地域包括ケア病棟',
      position: '看護師',
      trainingHours: 156,
      completionRate: 95,
      understandingScore: 4.5,
      isNurse: true,
      jnaLevel: 'レベルⅣ',
      continuingEducationUnits: 48
    },
    {
      id: 'ST002',
      name: '山田太郎',
      department: '外科病棟',
      position: '医師',
      trainingHours: 120,
      completionRate: 88,
      understandingScore: 4.2,
      isNurse: false
    },
    {
      id: 'ST003',
      name: '佐藤花子',
      department: 'ICU',
      position: '看護師',
      trainingHours: 180,
      completionRate: 98,
      understandingScore: 4.8,
      isNurse: true,
      jnaLevel: 'レベルⅤ',
      continuingEducationUnits: 56
    }
  ], [])

  // URLパラメータからスタッフIDが渡された場合の処理
  useEffect(() => {
    if (staffIdFromUrl) {
      // TODO: スタッフ情報を取得
      const staff = mockStaff.find(s => s.id === staffIdFromUrl)
      if (staff) {
        setSelectedStaff(staff)
        // 個人管理タブが指定されていない場合は、個人管理タブに切り替え
        if (tabFromUrl === 'history' || tabFromUrl === 'individual') {
          setActiveTab(tabFromUrl)
        }
      }
    }
  }, [staffIdFromUrl, tabFromUrl, mockStaff])

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
      <CommonHeader title="教育・研修管理" />
      
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
          {activeTab === 'planning' && <TrainingPlanningTab />}
          {activeTab === 'schedule' && <ScheduleTab />}
          {activeTab === 'progress' && <ProgressTab selectedProgram={selectedProgram} />}
          {activeTab === 'individual' && <IndividualTab staff={mockStaff} selectedStaff={selectedStaff} setSelectedStaff={setSelectedStaff} />}
          {activeTab === 'history' && <HistoryTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'itembank' && <ItemBankTab />}
          {activeTab === 'guide' && <GuideTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
      <DashboardButton />
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
            <option value="立神リハビリテーション温泉病院">立神リハビリテーション温泉病院</option>
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

interface IndividualTabProps {
  staff: Staff[]
  selectedStaff: Staff | null
  setSelectedStaff: (staff: Staff | null) => void
}

function IndividualTab({ staff, selectedStaff, setSelectedStaff }: IndividualTabProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className={styles.individualContainer}>
      <div className={styles.individualLayout}>
        <div className={styles.staffListSection}>
          <div className={styles.searchSection}>
            <input
              type="text"
              placeholder="職員名・部署で検索"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.staffList}>
            {filteredStaff.map((s) => (
              <div
                key={s.id}
                className={`${styles.staffItem} ${selectedStaff?.id === s.id ? styles.selected : ''}`}
                onClick={() => setSelectedStaff(s)}
              >
                <div className={styles.staffAvatar}>
                  {s.name.charAt(0)}
                </div>
                <div className={styles.staffInfo}>
                  <h4>{s.name}</h4>
                  <p>{s.department} - {s.position}</p>
                </div>
                <div className={styles.staffStats}>
                  <span className={styles.completionBadge}>{s.completionRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.staffDetailSection}>
          {selectedStaff ? (
            <StaffTrainingDetail staff={selectedStaff} />
          ) : (
            <div className={styles.noSelection}>
              <p>職員を選択してください</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StaffTrainingDetail({ staff }: { staff: Staff }) {
  const trainingParticipationData = {
    labels: ['必須研修', '専門研修', 'リーダー研修', '外部研修', 'eラーニング'],
    datasets: [{
      label: '参加時間',
      data: [48, 36, 24, 16, 32],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)'
      ]
    }]
  }

  const trainingEffectData = {
    labels: ['知識習得', '実践応用', '行動変容', '成果創出'],
    datasets: [{
      label: '達成度',
      data: [90, 85, 78, 82],
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  }

  const annualTrainingPlanData = {
    labels: ['4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '1月', '2月', '3月'],
    datasets: [{
      label: '計画',
      data: [2, 1, 2, 1, 0, 2, 1, 2, 1, 1, 2, 1],
      backgroundColor: 'rgba(220, 53, 69, 0.5)'
    }, {
      label: '実施済み',
      data: [2, 1, 2, 1, 0, 2, 1, 2, 1, 1, 0, 0],
      backgroundColor: 'rgba(40, 167, 69, 0.5)'
    }]
  }

  const trainingGrowthByAreaData = {
    labels: ['専門技術', '管理・指導', '安全管理', '多職種連携', '法令・倫理'],
    datasets: [{
      label: '研修前',
      data: [65, 50, 70, 60, 55],
      backgroundColor: 'rgba(255, 99, 132, 0.5)'
    }, {
      label: '研修後',
      data: [88, 75, 90, 85, 78],
      backgroundColor: 'rgba(75, 192, 192, 0.5)'
    }]
  }

  if (staff.isNurse) {
    const jnaTrainingData = {
      labels: ['基礎看護技術', '専門看護実践', '看護管理', '看護教育', '看護研究', '倫理実践'],
      datasets: [{
        label: '修了率',
        data: [100, 95, 85, 88, 75, 90],
        backgroundColor: 'rgba(155, 124, 203, 0.5)',
        borderColor: 'rgba(155, 124, 203, 1)',
        borderWidth: 1
      }]
    }

    const jnaLadderProgressData = {
      labels: ['2020年', '2021年', '2022年', '2023年', '2024年', '2025年(現在)'],
      datasets: [{
        label: 'JNAラダーレベル',
        data: [1, 2, 2, 3, 4, 4],
        borderColor: 'rgba(155, 124, 182, 1)',
        backgroundColor: 'rgba(155, 124, 182, 0.2)',
        fill: true,
        tension: 0.4
      }]
    }

    return (
      <div className={styles.staffDetail}>
        <div className={styles.detailHeader}>
          <h2>🎓 {staff.name} - 看護師教育・研修（JNAキャリアラダー）</h2>
          <Link href={`/staff-cards/${staff.id}`} className={styles.backToCardLink}>
            職員カルテに戻る →
          </Link>
        </div>

        <div className={styles.jnaSection}>
          <div className={styles.jnaHeader}>
            <h3>JNAキャリアラダー進捗</h3>
            <div className={styles.currentLevel}>{staff.jnaLevel}</div>
          </div>
          
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{staff.trainingHours}時間</div>
              <div className={styles.statLabel}>年間研修時間</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{staff.continuingEducationUnits}単位</div>
              <div className={styles.statLabel}>継続教育単位</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{staff.completionRate}%</div>
              <div className={styles.statLabel}>研修修了率</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{staff.understandingScore}/5.0</div>
              <div className={styles.statLabel}>理解度評価</div>
            </div>
          </div>
        </div>

        <div className={styles.chartsGrid}>
          <div className={styles.chartCard}>
            <h4>JNAキャリアラダーレベル経過</h4>
            <div className={styles.chartWrapper}>
              <Line data={jnaLadderProgressData} options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    min: 0,
                    max: 5,
                    ticks: {
                      stepSize: 1,
                      callback: function(value: string | number) {
                        const levels = ['', 'レベルⅠ', 'レベルⅡ', 'レベルⅢ', 'レベルⅣ', 'レベルⅤ'];
                        return levels[Number(value)] || '';
                      }
                    }
                  }
                }
              }} />
            </div>
          </div>
          <div className={styles.chartCard}>
            <h4>JNA領域別研修進捗</h4>
            <div className={styles.chartWrapper}>
              <Bar data={jnaTrainingData} options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    min: 0,
                    max: 100
                  }
                }
              }} />
            </div>
          </div>
          <div className={styles.chartCard}>
            <h4>研修カテゴリ別実績</h4>
            <div className={styles.chartWrapper}>
              <Doughnut data={trainingParticipationData} options={{
                responsive: true,
                maintainAspectRatio: false
              }} />
            </div>
          </div>
          <div className={styles.chartCard}>
            <h4>研修効果測定</h4>
            <div className={styles.chartWrapper}>
              <Bar data={trainingEffectData} options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    min: 0,
                    max: 100
                  }
                }
              }} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.staffDetail}>
      <div className={styles.detailHeader}>
        <h2>🎓 {staff.name} - 教育・研修管理</h2>
        <Link href={`/staff-cards/${staff.id}`} className={styles.backToCardLink}>
          職員カルテに戻る →
        </Link>
      </div>

      <div className={styles.summarySection}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{staff.trainingHours}時間</div>
          <div className={styles.summaryLabel}>年間研修時間</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{staff.completionRate}%</div>
          <div className={styles.summaryLabel}>修了率</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{staff.understandingScore}/5.0</div>
          <div className={styles.summaryLabel}>理解度評価</div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h4>研修参加実績</h4>
          <div className={styles.chartWrapper}>
            <Doughnut data={trainingParticipationData} options={{
              responsive: true,
              maintainAspectRatio: false
            }} />
          </div>
        </div>
        <div className={styles.chartCard}>
          <h4>研修効果測定</h4>
          <div className={styles.chartWrapper}>
            <Bar data={trainingEffectData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  min: 0,
                  max: 100
                }
              }
            }} />
          </div>
        </div>
        <div className={styles.chartCard}>
          <h4>年間研修計画進捗</h4>
          <div className={styles.chartWrapper}>
            <Bar data={annualTrainingPlanData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 3
                }
              }
            }} />
          </div>
        </div>
        <div className={styles.chartCard}>
          <h4>研修分野別成長度</h4>
          <div className={styles.chartWrapper}>
            <Bar data={trainingGrowthByAreaData} options={{
              responsive: true,
              maintainAspectRatio: false,
              indexAxis: 'y',
              scales: {
                x: {
                  min: 0,
                  max: 100
                }
              }
            }} />
          </div>
        </div>
      </div>

      <div className={styles.upcomingTraining}>
        <h3>今後の研修予定</h3>
        <div className={styles.trainingList}>
          <div className={styles.trainingItem}>
            <div className={styles.trainingDate}>2025年2月15日</div>
            <div className={styles.trainingInfo}>
              <div className={styles.trainingTitle}>管理職基礎研修</div>
              <div className={styles.trainingDescription}>マネジメントの基本スキル習得</div>
            </div>
          </div>
          <div className={styles.trainingItem}>
            <div className={styles.trainingDate}>2025年3月20日</div>
            <div className={styles.trainingInfo}>
              <div className={styles.trainingTitle}>コミュニケーション研修</div>
              <div className={styles.trainingDescription}>効果的な対話とフィードバック技法</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AnalyticsTab(): React.ReactElement {
  const roleCompletionData = {
    labels: ['看護師', '医師', '薬剤師', '検査技師', '事務職'],
    datasets: [{
      label: '受講率',
      data: [92, 85, 88, 78, 82],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)'
      ]
    }]
  }

  const monthlyTrainingData = {
    labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    datasets: [{
      label: '受講者数',
      data: [120, 135, 140, 155, 130, 125, 140, 150, 145, 160, 155, 170],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1
    }]
  }

  const trainingEffectivenesData = {
    labels: ['医療安全研修', '感染対策研修', 'BLS研修', 'リーダーシップ研修', '新人研修'],
    datasets: [{
      label: '理解度',
      data: [88, 92, 85, 78, 90],
      backgroundColor: 'rgba(255, 99, 132, 0.5)'
    }, {
      label: '実践度',
      data: [82, 89, 90, 72, 85],
      backgroundColor: 'rgba(54, 162, 235, 0.5)'
    }]
  }

  return (
    <div className={styles.analyticsContainer}>
      <h2>研修分析</h2>
      <div className={styles.analyticsGrid}>
        <div className={styles.analyticsCard}>
          <h3>職種別受講率</h3>
          <div className={styles.chartWrapper}>
            <Bar data={roleCompletionData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100
                }
              }
            }} />
          </div>
        </div>
        
        <div className={styles.analyticsCard}>
          <h3>月別受講者数推移</h3>
          <div className={styles.chartWrapper}>
            <Line data={monthlyTrainingData} options={{
              responsive: true,
              maintainAspectRatio: false
            }} />
          </div>
        </div>
        
        <div className={styles.analyticsCard}>
          <h3>研修効果測定</h3>
          <div className={styles.chartWrapper}>
            <Bar data={trainingEffectivenesData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100
                }
              }
            }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function TrainingPlanningTab(): React.ReactElement {
  return (
    <div className={styles.planningTabContainer}>
      <TrainingPlanGenerator />
    </div>
  )
}

function ItemBankTab(): React.ReactElement {
  return (
    <div className={styles.itemBankTabContainer}>
      <EvaluationItemBank />
    </div>
  )
}

function GuideTab(): React.ReactElement {
  return (
    <div className={styles.guideContainer}>
      <LegalTrainingGuide />
    </div>
  )
}

function SettingsTab(): React.ReactElement {
  const [settingsData, setSettingsData] = useState({
    notifications: {
      reminderDays: 7,
      reminderEnabled: true,
      deadlineAlertEnabled: true,
      completionReportEnabled: true
    },
    categories: [
      { id: 1, name: '必須研修', color: '#ff6b6b' },
      { id: 2, name: '新人研修', color: '#4ecdc4' },
      { id: 3, name: 'スキルアップ', color: '#45b7d1' },
      { id: 4, name: '専門研修', color: '#96ceb4' },
      { id: 5, name: 'eラーニング', color: '#daa520' }
    ],
    evaluationCriteria: {
      passingScore: 80,
      retakeAllowed: true,
      maxRetakes: 3,
      certificateAutoIssue: true
    },
    defaultValues: {
      duration: '2時間',
      maxParticipants: 30,
      reminderFrequency: 'weekly'
    }
  })

  const handleNotificationChange = (field: string, value: boolean | number) => {
    setSettingsData({
      ...settingsData,
      notifications: {
        ...settingsData.notifications,
        [field]: value
      }
    })
  }

  const handleEvaluationChange = (field: string, value: boolean | number) => {
    setSettingsData({
      ...settingsData,
      evaluationCriteria: {
        ...settingsData.evaluationCriteria,
        [field]: value
      }
    })
  }

  return (
    <div className={styles.settingsContainer}>
      <h2>研修設定</h2>
      
      <div className={styles.settingsSection}>
        <h3>通知設定</h3>
        <div className={styles.settingsGroup}>
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>
              <input
                type="checkbox"
                checked={settingsData.notifications.reminderEnabled}
                onChange={(e) => handleNotificationChange('reminderEnabled', e.target.checked)}
              />
              リマインダー通知を有効にする
            </label>
          </div>
          
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>
              リマインダー送信日数（研修前）
              <input
                type="number"
                min="1"
                max="30"
                value={settingsData.notifications.reminderDays}
                onChange={(e) => handleNotificationChange('reminderDays', parseInt(e.target.value))}
                className={styles.numberInput}
              />
              日前
            </label>
          </div>
          
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>
              <input
                type="checkbox"
                checked={settingsData.notifications.deadlineAlertEnabled}
                onChange={(e) => handleNotificationChange('deadlineAlertEnabled', e.target.checked)}
              />
              期限アラートを有効にする
            </label>
          </div>
          
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>
              <input
                type="checkbox"
                checked={settingsData.notifications.completionReportEnabled}
                onChange={(e) => handleNotificationChange('completionReportEnabled', e.target.checked)}
              />
              完了レポートを自動送信する
            </label>
          </div>
        </div>
      </div>

      <div className={styles.settingsSection}>
        <h3>研修カテゴリー設定</h3>
        <div className={styles.categoryList}>
          {settingsData.categories.map(category => (
            <div key={category.id} className={styles.categoryItem}>
              <div 
                className={styles.categoryColor} 
                style={{ backgroundColor: category.color }}
              ></div>
              <span className={styles.categoryName}>{category.name}</span>
              <button className={styles.editButton}>編集</button>
            </div>
          ))}
          <button className={styles.addCategoryButton}>+ カテゴリーを追加</button>
        </div>
      </div>

      <div className={styles.settingsSection}>
        <h3>評価基準設定</h3>
        <div className={styles.settingsGroup}>
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>
              合格点
              <input
                type="number"
                min="0"
                max="100"
                value={settingsData.evaluationCriteria.passingScore}
                onChange={(e) => handleEvaluationChange('passingScore', parseInt(e.target.value))}
                className={styles.numberInput}
              />
              点以上
            </label>
          </div>
          
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>
              <input
                type="checkbox"
                checked={settingsData.evaluationCriteria.retakeAllowed}
                onChange={(e) => handleEvaluationChange('retakeAllowed', e.target.checked)}
              />
              再受講を許可する
            </label>
          </div>
          
          {settingsData.evaluationCriteria.retakeAllowed && (
            <div className={styles.settingItem}>
              <label className={styles.settingLabel}>
                最大再受講回数
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={settingsData.evaluationCriteria.maxRetakes}
                  onChange={(e) => handleEvaluationChange('maxRetakes', parseInt(e.target.value))}
                  className={styles.numberInput}
                />
                回まで
              </label>
            </div>
          )}
          
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>
              <input
                type="checkbox"
                checked={settingsData.evaluationCriteria.certificateAutoIssue}
                onChange={(e) => handleEvaluationChange('certificateAutoIssue', e.target.checked)}
              />
              修了証を自動発行する
            </label>
          </div>
        </div>
      </div>

      <div className={styles.settingsSection}>
        <h3>アクセス権限設定</h3>
        <div className={styles.permissionGrid}>
          <div className={styles.permissionItem}>
            <h4>研修管理者</h4>
            <p>すべての研修の作成・編集・削除が可能</p>
            <button className={styles.manageButton}>管理者を設定</button>
          </div>
          <div className={styles.permissionItem}>
            <h4>研修担当者</h4>
            <p>担当研修の編集・受講者管理が可能</p>
            <button className={styles.manageButton}>担当者を設定</button>
          </div>
          <div className={styles.permissionItem}>
            <h4>一般ユーザー</h4>
            <p>研修の受講・履歴確認が可能</p>
            <button className={styles.manageButton}>権限を確認</button>
          </div>
        </div>
      </div>

      <div className={styles.settingsActions}>
        <button className={styles.saveButton}>設定を保存</button>
        <button className={styles.cancelButton}>キャンセル</button>
      </div>
    </div>
  )
}

export default function TrainingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TrainingPageContent />
    </Suspense>
  )
}