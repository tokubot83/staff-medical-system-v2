'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import CommonHeader from '@/components/CommonHeader'
import Link from 'next/link'
import { staffDatabase } from '../../data/staffData.js'
import styles from '../StaffCards.module.css'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Bar, Radar, Scatter, Doughnut } from 'react-chartjs-2'
import { 
  AnalyticsTab, 
  EvaluationTab, 
  RecruitmentTab, 
  InterviewTab, 
  DevelopmentTab, 
  EducationTab 
} from '../staff-tabs'

// Chart.jsの登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
)

const tabs = [
  { id: 'basic', label: '基本情報', icon: '📋' },
  { id: 'career', label: '経歴・キャリア', icon: '💼' },
  { id: 'qualification', label: '資格・専門性', icon: '📜' },
  { id: 'achievement', label: '実績・表彰', icon: '📊' },
  { id: 'attendance', label: '勤務状況', icon: '⏰' },
  { id: 'wellbeing', label: '健康・ウェルビーイング', icon: '💚' },
  { id: 'development', label: '能力開発', icon: '🚀' },
  { id: 'interview', label: '面談・指導', icon: '💬' },
  { id: 'evaluation', label: '人事評価', icon: '📊' },
  { id: 'analytics', label: '総合分析', icon: '📈' },
  { id: 'recruitment', label: '採用・配属', icon: '👥' },
  { id: 'education', label: '教育・研修', icon: '🎓' },
  { id: 'links', label: '統合管理リンク', icon: '🔗' },
]

interface Staff {
  id: string
  name: string
  age: number
  gender: string
  position: string
  department: string
  facility: string
  experience: number
  certifications: string[]
  qualifications: string[]
  averageScore: number
  mentalHealth: string
  physicalHealth: string
  trainings: Array<{
    name: string
    date: string
    status: string
  }>
  nameInitial?: string
  joinDate?: string
  evaluation?: string
  healthScore?: number
  stressLevel?: number
  engagement?: number
  riskLevel?: string
  avatar?: string
  skills?: Array<{
    name: string
    level: number
  }>
}

export default function StaffDetailPage() {
  const params = useParams()
  const staffId = params.staffId as string
  const [activeTab, setActiveTab] = useState('basic')
  
  const selectedStaff = staffDatabase[staffId] as Staff | undefined

  if (!selectedStaff) {
    return (
      <div>
        <CommonHeader 
          title="職員カルテ" 
          showBackButton={true} 
          backUrl="/staff-cards"
          backText="職員一覧に戻る"
        />
        <div className={styles.container}>
          <div className={styles.noSelection}>
            <p>職員が見つかりません</p>
            <Link href="/staff-cards" className={styles.backButton}>
              職員一覧に戻る
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <CommonHeader 
        title={`${selectedStaff.name} - 職員カルテ`}
        showBackButton={true} 
        backUrl="/staff-cards"
        backText="職員一覧に戻る"
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
          {activeTab === 'basic' && <BasicInfoTab selectedStaff={selectedStaff} />}
          {activeTab === 'career' && <CareerTab selectedStaff={selectedStaff} />}
          {activeTab === 'qualification' && <QualificationTab selectedStaff={selectedStaff} />}
          {activeTab === 'achievement' && <AchievementTab selectedStaff={selectedStaff} />}
          {activeTab === 'attendance' && <AttendanceTab selectedStaff={selectedStaff} />}
          {activeTab === 'wellbeing' && <WellbeingTab selectedStaff={selectedStaff} />}
          {activeTab === 'links' && <ManagementLinksTab selectedStaff={selectedStaff} />}
          {activeTab === 'analytics' && <AnalyticsTab selectedStaff={selectedStaff} />}
          {activeTab === 'evaluation' && <EvaluationTab selectedStaff={selectedStaff} />}
          {activeTab === 'recruitment' && <RecruitmentTab selectedStaff={selectedStaff} />}
          {activeTab === 'interview' && <InterviewTab selectedStaff={selectedStaff} />}
          {activeTab === 'development' && <DevelopmentTab selectedStaff={selectedStaff} />}
          {activeTab === 'education' && <EducationTab selectedStaff={selectedStaff} />}
        </div>
      </div>
    </div>
  )
}

function BasicInfoTab({ selectedStaff }: { selectedStaff: Staff }) {
  return (
    <div className={styles.detailContainer}>
      <div className={styles.profileSection}>
        <div className={styles.profileHeader}>
          <div className={`${styles.profileAvatar} ${selectedStaff.avatar}`}>
            {selectedStaff.nameInitial}
          </div>
          <div className={styles.profileInfo}>
            <h2>{selectedStaff.name}</h2>
            <p className={styles.profileTitle}>{selectedStaff.facility} / {selectedStaff.department} / {selectedStaff.position}</p>
            <div className={styles.profileMeta}>
              <span>ID: {selectedStaff.id}</span>
              <span>入職: {selectedStaff.joinDate}</span>
              <span>年齢: {selectedStaff.age}歳</span>
            </div>
          </div>
          <div className={styles.profileStatus}>
            <div className={`${styles.statusBadge} ${
              selectedStaff.evaluation === 'S' ? styles.statusExcellent :
              selectedStaff.evaluation === 'A' ? styles.statusGood :
              styles.statusNormal
            }`}>
              {selectedStaff.evaluation === 'S' ? '優秀職員' :
               selectedStaff.evaluation === 'A' ? '高評価' :
               '標準'}
            </div>
          </div>
        </div>

        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <h3>総合評価</h3>
            <div className={styles.metricValue}>{selectedStaff.evaluation}</div>
            <p className={styles.metricLabel}>最新評価</p>
          </div>
          <div className={styles.metricCard}>
            <h3>健康スコア</h3>
            <div className={styles.metricValue}>{selectedStaff.healthScore}</div>
            <p className={styles.metricLabel}>ストレス指数: {selectedStaff.stressLevel || 48}</p>
          </div>
          <div className={styles.metricCard}>
            <h3>エンゲージメント</h3>
            <div className={styles.metricValue}>{selectedStaff.engagement}%</div>
            <p className={styles.metricLabel}>組織への貢献度</p>
          </div>
          <div className={styles.metricCard}>
            <h3>離職リスク</h3>
            <div className={`${styles.metricValue} ${
              selectedStaff.riskLevel === '低' ? styles.textGreen :
              selectedStaff.riskLevel === '中' ? styles.textYellow :
              styles.textRed
            }`}>
              {selectedStaff.riskLevel}
            </div>
            <p className={styles.metricLabel}>要注意度</p>
          </div>
        </div>

        <div className={styles.detailSections}>
          <div className={styles.sectionCard}>
            <h3>スキル・資格</h3>
            <div className={styles.skillGrid}>
              {selectedStaff.skills?.map((skill: any, index: number) => (
                <div key={index} className={styles.skillItem}>
                  <span className={styles.skillName}>{skill.name}</span>
                  <div className={styles.skillBar}>
                    <div 
                      className={styles.skillProgress} 
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                  <span className={styles.skillLevel}>{skill.level}%</span>
                </div>
              )) || (
                <div className={styles.skillItem}>
                  <span className={styles.skillName}>看護技術</span>
                  <div className={styles.skillBar}>
                    <div className={styles.skillProgress} style={{ width: '85%' }}></div>
                  </div>
                  <span className={styles.skillLevel}>85%</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.sectionCard}>
            <h3>最近の評価コメント</h3>
            <div className={styles.commentList}>
              <div className={styles.commentItem}>
                <p className={styles.commentDate}>2024年上期評価</p>
                <p className={styles.commentText}>
                  患者様への対応が丁寧で、チーム内でのコミュニケーションも良好。
                  新人指導にも積極的に取り組んでいる。
                </p>
              </div>
            </div>
          </div>

          <div className={styles.sectionCard}>
            <h3>アクションプラン</h3>
            <div className={styles.actionList}>
              <div className={styles.actionItem}>
                <span className={styles.actionPriority}>優先度: 高</span>
                <p className={styles.actionTitle}>リーダーシップ研修の受講</p>
                <p className={styles.actionDetail}>
                  次期主任候補として、マネジメントスキルの向上が必要
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CareerTab({ selectedStaff }: { selectedStaff: Staff }): React.ReactElement {
  return (
    <div className={styles.careerContainer}>
      <h2>経歴・キャリア</h2>
      <div className={styles.sectionCard}>
        <h3>学歴</h3>
        <div className={styles.timelineList}>
          <div className={styles.timelineItem}>
            <span className={styles.timelineDate}>2012年3月</span>
            <span className={styles.timelineContent}>〇〇大学 医学部 看護学科 卒業</span>
          </div>
        </div>
      </div>
      <div className={styles.sectionCard}>
        <h3>職歴</h3>
        <div className={styles.timelineList}>
          <div className={styles.timelineItem}>
            <span className={styles.timelineDate}>{selectedStaff.joinDate}</span>
            <span className={styles.timelineContent}>{selectedStaff.facility} 入職</span>
          </div>
        </div>
      </div>
      <div className={styles.sectionCard}>
        <h3>異動歴</h3>
        <div className={styles.timelineList}>
          <div className={styles.timelineItem}>
            <span className={styles.timelineDate}>2023年4月</span>
            <span className={styles.timelineContent}>{selectedStaff.department} 配属</span>
          </div>
        </div>
      </div>
      <div className={styles.sectionCard}>
        <h3>キャリア志向・目標</h3>
        <p>認定看護師資格取得を目指している</p>
      </div>
    </div>
  )
}

function QualificationTab({ selectedStaff }: { selectedStaff: Staff }): React.ReactElement {
  return (
    <div className={styles.qualificationContainer}>
      <h2>資格・専門性</h2>
      <div className={styles.sectionCard}>
        <h3>専門資格・上位資格</h3>
        <ul className={styles.qualificationList}>
          {selectedStaff.qualifications?.map((qual: string, index: number) => (
            <li key={index}>{qual}</li>
          )) || <li>看護師免許</li>}
        </ul>
      </div>
      <div className={styles.sectionCard}>
        <h3>その他の資格</h3>
        <ul className={styles.qualificationList}>
          {selectedStaff.certifications?.map((cert: string, index: number) => (
            <li key={index}>{cert}</li>
          )) || <li>BLS（一次救命処置）</li>}
        </ul>
      </div>
      <div className={styles.sectionCard}>
        <h3>所属学会</h3>
        <p>日本看護協会</p>
      </div>
      <div className={styles.sectionCard}>
        <h3>学会発表実績</h3>
        <p>2023年度 看護研究発表会 優秀賞</p>
      </div>
      <div className={styles.sectionCard}>
        <h3>研修受講歴</h3>
        <div className={styles.timelineList}>
          <div className={styles.timelineItem}>
            <span className={styles.timelineDate}>2024年3月</span>
            <span className={styles.timelineContent}>感染対策研修 修了</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function AchievementTab({ selectedStaff }: { selectedStaff: Staff }): React.ReactElement {
  return (
    <div className={styles.achievementContainer}>
      <h2>実績・表彰</h2>
      <div className={styles.sectionCard}>
        <h3>職員表彰歴</h3>
        <div className={styles.achievementList}>
          <div className={styles.achievementItem}>
            <span className={styles.achievementDate}>2023年12月</span>
            <span className={styles.achievementTitle}>年間MVP賞</span>
            <p className={styles.achievementDetail}>患者満足度向上への貢献</p>
          </div>
        </div>
      </div>
      <div className={styles.sectionCard}>
        <h3>業務実績</h3>
        <p>患者満足度: 95%以上を3年連続達成</p>
      </div>
      <div className={styles.sectionCard}>
        <h3>組織貢献度</h3>
        <div className={styles.metricValue}>{selectedStaff.engagement}%</div>
      </div>
      <div className={styles.sectionCard}>
        <h3>プロジェクト参加歴</h3>
        <ul>
          <li>2024年 電子カルテ導入プロジェクト メンバー</li>
          <li>2023年 患者満足度向上委員会 リーダー</li>
        </ul>
      </div>
    </div>
  )
}

function AttendanceTab({ selectedStaff }: { selectedStaff: Staff }): React.ReactElement {
  return (
    <div className={styles.attendanceContainer}>
      <h2>勤務状況</h2>
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <h3>遅刻回数</h3>
          <div className={styles.metricValue}>0回</div>
          <p className={styles.metricLabel}>過去1年間</p>
        </div>
        <div className={styles.metricCard}>
          <h3>早退回数</h3>
          <div className={styles.metricValue}>2回</div>
          <p className={styles.metricLabel}>過去1年間</p>
        </div>
        <div className={styles.metricCard}>
          <h3>平均残業時間</h3>
          <div className={styles.metricValue}>15.5時間</div>
          <p className={styles.metricLabel}>月平均</p>
        </div>
        <div className={styles.metricCard}>
          <h3>有給取得率</h3>
          <div className={styles.metricValue}>75%</div>
          <p className={styles.metricLabel}>今年度</p>
        </div>
      </div>
      <div className={styles.sectionCard}>
        <h3>シフト履歴</h3>
        <p>日勤: 60% / 夜勤: 40%</p>
      </div>
      <div className={styles.sectionCard}>
        <h3>業務出張履歴</h3>
        <div className={styles.timelineList}>
          <div className={styles.timelineItem}>
            <span className={styles.timelineDate}>2024年2月</span>
            <span className={styles.timelineContent}>東京研修センター 3日間</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function WellbeingTab({ selectedStaff }: { selectedStaff: Staff }): React.ReactElement {
  return (
    <div className={styles.wellbeingContainer}>
      <h2>健康・ウェルビーイング</h2>
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <h3>健康スコア</h3>
          <div className={styles.metricValue}>{selectedStaff.healthScore}</div>
          <p className={styles.metricLabel}>総合評価</p>
        </div>
        <div className={styles.metricCard}>
          <h3>ストレス指数</h3>
          <div className={styles.metricValue}>{selectedStaff.stressLevel || 48}</div>
          <p className={styles.metricLabel}>要注意: 50以上</p>
        </div>
      </div>
      <div className={styles.sectionCard}>
        <h3>ストレスチェック結果</h3>
        <p>前回実施: 2024年3月</p>
        <p>結果: 良好（要経過観察項目なし）</p>
      </div>
      <div className={styles.sectionCard}>
        <h3>健康診断記録</h3>
        <div className={styles.timelineList}>
          <div className={styles.timelineItem}>
            <span className={styles.timelineDate}>2024年4月</span>
            <span className={styles.timelineContent}>定期健康診断 A判定</span>
          </div>
        </div>
      </div>
      <div className={styles.sectionCard}>
        <h3>メンタルヘルス相談履歴</h3>
        <p>相談実績なし</p>
      </div>
      <div className={styles.sectionCard}>
        <h3>家族構成（参考情報）</h3>
        <p>配偶者あり、子供2人</p>
      </div>
    </div>
  )
}

function ManagementLinksTab({ selectedStaff }: { selectedStaff: Staff }): React.ReactElement {
  return (
    <div className={styles.linksContainer}>
      <h2>統合管理リンク</h2>
      <div className={styles.linksGrid}>
        <a href="/evaluation" className={styles.linkCard}>
          <div className={styles.linkIcon}>📊</div>
          <h3>評価管理システム</h3>
          <p>人事評価の詳細確認・管理</p>
          <div className={styles.linkInfo}>
            現在の評価: {selectedStaff.evaluation}
          </div>
        </a>
        <a href="/training" className={styles.linkCard}>
          <div className={styles.linkIcon}>🎓</div>
          <h3>教育研修システム</h3>
          <p>研修計画・受講履歴の管理</p>
          <div className={styles.linkInfo}>
            未受講研修: 2件
          </div>
        </a>
        <a href="/interviews" className={styles.linkCard}>
          <div className={styles.linkIcon}>💬</div>
          <h3>面談管理システム</h3>
          <p>面談記録・フィードバック管理</p>
          <div className={styles.linkInfo}>
            次回面談: 2024年5月
          </div>
        </a>
        <div className={styles.linkCard}>
          <div className={styles.linkIcon}>🎯</div>
          <h3>目標管理機能</h3>
          <p>個人目標の設定・評価</p>
          <div className={styles.linkInfo}>
            進行中の目標: 3件
          </div>
        </div>
      </div>
    </div>
  )
}