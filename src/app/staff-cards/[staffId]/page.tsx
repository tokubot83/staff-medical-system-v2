'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import CommonHeader from '@/components/CommonHeader'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { staffDatabase } from '../../data/staffData.js'
import styles from '../StaffCards.module.css'
import DashboardButton from '@/components/DashboardButton'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import BackToStaffCardsButton from '@/components/BackToStaffCardsButton'
import { TwoAxisEvaluationSummaryCompact } from '@/components/evaluation/TwoAxisEvaluationSummaryCompact'
import { estimateTwoAxisEvaluation } from '@/utils/twoAxisEvaluationUtils'
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
  { id: 'mindset', label: 'マインド・志向性', icon: '🧠' },
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

// staffData.tsのStaffDetailインターフェースを使用

export default function StaffDetailPage() {
  const params = useParams()
  const staffId = params.staffId as string
  const [activeTab, setActiveTab] = useState('basic')
  
  const selectedStaff = staffDatabase[staffId]

  if (!selectedStaff) {
    return (
      <div>
        <CommonHeader title="職員カルテ" />
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
      <CommonHeader title={`${selectedStaff.name} - 職員カルテ`} />
      
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
          {activeTab === 'mindset' && <MindsetTab selectedStaff={selectedStaff} />}
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
      <ScrollToTopButton />
      <BackToStaffCardsButton />
      <DashboardButton />
    </div>
  )
}

function BasicInfoTab({ selectedStaff }: { selectedStaff: any }) {
  // 2軸評価データの取得または推定
  const twoAxisEvaluation = selectedStaff.twoAxisEvaluation || estimateTwoAxisEvaluation(
    selectedStaff.evaluation,
    Math.floor(Math.random() * 50) + 1, // デモ用の仮の順位
    200, // デモ用の仮の総数
    Math.floor(Math.random() * 100) + 1, // デモ用の仮の順位
    500 // デモ用の仮の総数
  )

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
              twoAxisEvaluation.overallScore === 'S+' || twoAxisEvaluation.overallScore === 'S' ? styles.statusExcellent :
              twoAxisEvaluation.overallScore === 'A+' || twoAxisEvaluation.overallScore === 'A' ? styles.statusGood :
              styles.statusNormal
            }`}>
              {twoAxisEvaluation.overallScore === 'S+' ? '最優秀' :
               twoAxisEvaluation.overallScore === 'S' ? '優秀' :
               twoAxisEvaluation.overallScore === 'A+' || twoAxisEvaluation.overallScore === 'A' ? '高評価' :
               '標準'}
            </div>
          </div>
        </div>

        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <h3>総合評価</h3>
            <div className={styles.metricValue}>{twoAxisEvaluation.overallScore}</div>
            <p className={styles.metricLabel}>最新総合人事評価</p>
          </div>
          <div className={styles.metricCard}>
            <h3>健康スコア</h3>
            <div className={styles.metricValue}>{selectedStaff.stressIndex ? 100 - selectedStaff.stressIndex : 75}</div>
            <p className={styles.metricLabel}>ストレス指数: {selectedStaff.stressIndex || 48}</p>
          </div>
          <div className={styles.metricCard}>
            <h3>エンゲージメント</h3>
            <div className={styles.metricValue}>{selectedStaff.engagement}%</div>
            <p className={styles.metricLabel}>組織への貢献度</p>
          </div>
          <div className={styles.metricCard}>
            <h3>離職リスク</h3>
            <div className={`${styles.metricValue} ${
              selectedStaff.stressIndex < 40 ? styles.textGreen :
              selectedStaff.stressIndex < 60 ? styles.textYellow :
              styles.textRed
            }`}>
              {selectedStaff.stressIndex < 40 ? '低' :
               selectedStaff.stressIndex < 60 ? '中' : '高'}
            </div>
            <p className={styles.metricLabel}>要注意度</p>
          </div>
        </div>

        <div style={{ marginTop: '24px', marginBottom: '24px' }}>
          <TwoAxisEvaluationSummaryCompact
            facilityScore={twoAxisEvaluation.facilityScore}
            facilityRank={twoAxisEvaluation.facilityRank}
            facilityTotal={twoAxisEvaluation.facilityTotal}
            corporateScore={twoAxisEvaluation.corporateScore}
            corporateRank={twoAxisEvaluation.corporateRank}
            corporateTotal={twoAxisEvaluation.corporateTotal}
            overallScore={twoAxisEvaluation.overallScore}
            description={twoAxisEvaluation.description || '優秀な職員'}
            recommendation={twoAxisEvaluation.recommendation || '継続的な成長を支援'}
          />
        </div>

        <div className={styles.detailSections}>
          <div className={styles.sectionCard}>
            <h3>スキル・資格</h3>
            <div className={styles.skillGrid}>
              {selectedStaff.skills?.length > 0 ? selectedStaff.skills.map((skill: any, index: number) => (
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
              )) : (
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

function CareerTab({ selectedStaff }: { selectedStaff: any }): React.ReactElement {
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

function QualificationTab({ selectedStaff }: { selectedStaff: any }): React.ReactElement {
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

function AchievementTab({ selectedStaff }: { selectedStaff: any }): React.ReactElement {
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

function AttendanceTab({ selectedStaff }: { selectedStaff: any }): React.ReactElement {
  const router = useRouter()
  
  return (
    <div className={styles.tabContentSection}>
      <div className={styles.sectionHeader}>
        <h2>⏰ 勤務状況</h2>
        <div className={styles.sectionActions}>
          <Link href={`/attendance-management?staffId=${selectedStaff.id}`} className={styles.actionButton}>勤怠詳細</Link>
          <button className={styles.actionButtonSecondary}>シフト表</button>
        </div>
      </div>

      <div className={styles.interviewSummaryEnhanced}>
        <div className={styles.summaryMainCard}>
          <div className={styles.summaryCardHeader}>
            <span className={styles.summaryIcon}>📊</span>
            <h3>勤務実績サマリー</h3>
          </div>
          <div className={styles.summaryMainMetrics}>
            <div className={styles.workPatternSection}>
              <div className={styles.patternDisplay}>
                <div className={styles.patternBars}>
                  <div className={styles.patternBar}>
                    <div className={styles.barFill} style={{ height: '60%', backgroundColor: '#3b82f6' }}></div>
                    <div className={styles.barLabel}>日勤</div>
                    <div className={styles.barValue}>60%</div>
                  </div>
                  <div className={styles.patternBar}>
                    <div className={styles.barFill} style={{ height: '35%', backgroundColor: '#8b5cf6' }}></div>
                    <div className={styles.barLabel}>夜勤</div>
                    <div className={styles.barValue}>35%</div>
                  </div>
                  <div className={styles.patternBar}>
                    <div className={styles.barFill} style={{ height: '5%', backgroundColor: '#10b981' }}></div>
                    <div className={styles.barLabel}>休出</div>
                    <div className={styles.barValue}>5%</div>
                  </div>
                </div>
                <div className={styles.patternSummary}>
                  <div className={styles.balanceIndicator}>
                    <div className={styles.balanceScore}>A+</div>
                    <div className={styles.balanceLabel}>ワークライフバランス</div>
                  </div>
                  <div className={styles.balanceDetails}>
                    <div className={styles.balanceItem}>
                      <span className={styles.balanceIcon}>⏰</span>
                      <span className={styles.balanceText}>定時退社率 85%</span>
                    </div>
                    <div className={styles.balanceItem}>
                      <span className={styles.balanceIcon}>📅</span>
                      <span className={styles.balanceText}>連続勤務 最大5日</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.attendanceReliability}>
                <div className={styles.reliabilityScore}>
                  <div className={styles.scoreGrade}>S</div>
                  <div className={styles.scoreLabel}>勤務安定性</div>
                </div>
                <div className={styles.reliabilityMetrics}>
                  <div className={styles.reliabilityItem}>
                    <span className={styles.itemIcon}>✅</span>
                    <span className={styles.itemLabel}>出勤率</span>
                    <span className={styles.itemValue}>98%</span>
                  </div>
                  <div className={styles.reliabilityItem}>
                    <span className={styles.itemIcon}>🚫</span>
                    <span className={styles.itemLabel}>遅刻</span>
                    <span className={styles.itemValue}>0回</span>
                  </div>
                  <div className={styles.reliabilityItem}>
                    <span className={styles.itemIcon}>⚡</span>
                    <span className={styles.itemLabel}>早退</span>
                    <span className={styles.itemValue}>2回</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.metricsGrid}>
              <div className={styles.metricCardEnhanced}>
                <div className={styles.metricHeader}>
                  <span className={styles.metricIcon}>⏱️</span>
                  <span className={styles.metricTrend}>-2.5h</span>
                </div>
                <div className={styles.metricValue}>15.5時間</div>
                <div className={styles.metricLabel}>月平均残業</div>
                <div className={styles.metricProgress}>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: '38.75%' }}></div>
                  </div>
                  <span className={styles.progressText}>適正範囲内</span>
                </div>
              </div>
              <div className={styles.metricCardEnhanced}>
                <div className={styles.metricHeader}>
                  <span className={styles.metricIcon}>🏖️</span>
                  <span className={styles.metricTrend}>+10%</span>
                </div>
                <div className={styles.metricValue}>75%</div>
                <div className={styles.metricLabel}>有給取得率</div>
                <div className={styles.ratingStars}>
                  <span className={styles.starFilled}>15日/20日</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.summarySubCards}>
          <div className={styles.nextSessionCard}>
            <div className={styles.cardIconWrapper}>
              <span className={styles.cardIcon}>📅</span>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardTitle}>シフト情報</div>
              <div className={styles.cardMainInfo}>日勤中心</div>
              <div className={styles.cardSubInfo}>日勤60% / 夜勤40%</div>
              <button className={styles.cardAction}>シフト確認</button>
            </div>
          </div>
          
          <div className={styles.recentTopicsCard}>
            <div className={styles.cardIconWrapper}>
              <span className={styles.cardIcon}>📊</span>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardTitle}>勤務パターン</div>
              <div className={styles.topicsList}>
                <span className={styles.topicTag}>定時退社多</span>
                <span className={styles.topicTag}>遅刻なし</span>
                <span className={styles.topicTag}>安定勤務</span>
              </div>
              <div className={styles.cardSubInfo}>ワークライフバランス良好</div>
            </div>
          </div>
        </div>
      </div>

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
          <h3>欠勤日数</h3>
          <div className={styles.metricValue}>3日</div>
          <p className={styles.metricLabel}>過去1年間</p>
        </div>
        <div className={styles.metricCard}>
          <h3>休日出勤</h3>
          <div className={styles.metricValue}>5日</div>
          <p className={styles.metricLabel}>過去1年間</p>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <h3>月別勤務状況</h3>
        <div className={styles.monthlyAttendance}>
          <table className={styles.attendanceTable}>
            <thead>
              <tr>
                <th>月</th>
                <th>出勤日数</th>
                <th>残業時間</th>
                <th>有給使用</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1月</td>
                <td>20日</td>
                <td>12.5時間</td>
                <td>1日</td>
              </tr>
              <tr>
                <td>12月</td>
                <td>21日</td>
                <td>18.0時間</td>
                <td>2日</td>
              </tr>
              <tr>
                <td>11月</td>
                <td>22日</td>
                <td>15.5時間</td>
                <td>0日</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <h3>業務出張履歴</h3>
        <div className={styles.timelineList}>
          <div className={styles.timelineItem}>
            <span className={styles.timelineDate}>2024年2月</span>
            <span className={styles.timelineContent}>東京研修センター 3日間</span>
          </div>
          <div className={styles.timelineItem}>
            <span className={styles.timelineDate}>2023年11月</span>
            <span className={styles.timelineContent}>大阪本部 2日間</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function WellbeingTab({ selectedStaff }: { selectedStaff: any }): React.ReactElement {
  const stressIndex = selectedStaff.stressIndex || 48
  const stressLevel = stressIndex < 40 ? '良好' : stressIndex < 50 ? '注意' : '要対応'
  const stressColor = stressIndex < 40 ? '#10b981' : stressIndex < 50 ? '#f59e0b' : '#ef4444'
  
  return (
    <div className={styles.tabContentSection}>
      <div className={styles.sectionHeader}>
        <h2>🌿 健康・ウェルビーイング</h2>
        <div className={styles.sectionActions}>
          <Link href="/health" className={styles.actionButton}>組織全体の健康状況</Link>
          <button className={styles.actionButton}>健康診断履歴</button>
          <button className={styles.actionButtonSecondary}>相談予約</button>
        </div>
      </div>

      <div className={styles.interviewSummaryEnhanced}>
        <div className={styles.summaryMainCard}>
          <div className={styles.summaryCardHeader}>
            <span className={styles.summaryIcon}>💗</span>
            <h3>ウェルビーイングサマリー</h3>
          </div>
          <div className={styles.summaryMainMetrics}>
            <div className={styles.wellbeingThermometer}>
              <div className={styles.thermometerContainer}>
                <div className={styles.thermometerScale}>
                  <div className={styles.scaleLabel} style={{ top: '0%' }}>100</div>
                  <div className={styles.scaleLabel} style={{ top: '20%' }}>80</div>
                  <div className={styles.scaleLabel} style={{ top: '40%' }}>60</div>
                  <div className={styles.scaleLabel} style={{ top: '60%' }}>40</div>
                  <div className={styles.scaleLabel} style={{ top: '80%' }}>20</div>
                  <div className={styles.scaleLabel} style={{ top: '100%' }}>0</div>
                </div>
                <div className={styles.thermometerTrack}>
                  <div className={styles.dangerZone}>
                    <span className={styles.zoneLabel}>危険域</span>
                  </div>
                  <div className={styles.cautionZone}>
                    <span className={styles.zoneLabel}>注意域</span>
                  </div>
                  <div className={styles.safeZone}>
                    <span className={styles.zoneLabel}>良好域</span>
                  </div>
                  <div 
                    className={styles.thermometerFill} 
                    style={{ 
                      height: `${stressIndex}%`,
                      backgroundColor: stressColor
                    }}
                  >
                    <div className={styles.currentValue}>
                      <span className={styles.valueNumber}>{stressIndex}</span>
                      <span className={styles.valueLabel}>ストレス指数</span>
                    </div>
                  </div>
                </div>
                <div className={styles.thermometerBase}>
                  <div className={styles.overallRating}>
                    <div className={styles.ratingGrade}>{stressIndex < 40 ? 'A' : stressIndex < 50 ? 'B' : stressIndex < 70 ? 'C' : 'D'}</div>
                    <div className={styles.ratingLabel}>総合評価</div>
                  </div>
                </div>
              </div>
              <div className={styles.wellbeingStatus}>
                <div className={styles.statusIndicator}>
                  <div className={styles.statusIcon}>
                    {stressIndex < 40 ? '😊' : stressIndex < 50 ? '😐' : stressIndex < 70 ? '😟' : '😰'}
                  </div>
                  <div className={styles.statusText}>
                    <div className={styles.statusLevel}>{stressLevel}</div>
                    <div className={styles.statusMessage}>
                      {stressIndex < 40 ? '心理状態は良好です' : 
                       stressIndex < 50 ? '軽度のストレスがあります' :
                       stressIndex < 70 ? 'ストレスケアが必要です' :
                       '早急な対応が必要です'}
                    </div>
                  </div>
                </div>
                <div className={styles.stressFactors}>
                  <h4>主なストレス要因</h4>
                  <div className={styles.factorsList}>
                    <div className={styles.factorItem}>
                      <span className={styles.factorIcon}>⏰</span>
                      <span className={styles.factorText}>残業時間</span>
                      <span className={styles.factorLevel}>中</span>
                    </div>
                    <div className={styles.factorItem}>
                      <span className={styles.factorIcon}>👥</span>
                      <span className={styles.factorText}>人間関係</span>
                      <span className={styles.factorLevel}>低</span>
                    </div>
                    <div className={styles.factorItem}>
                      <span className={styles.factorIcon}>💼</span>
                      <span className={styles.factorText}>業務負荷</span>
                      <span className={styles.factorLevel}>中</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.metricsGrid}>
              <div className={styles.metricCardEnhanced}>
                <div className={styles.metricHeader}>
                  <span className={styles.metricIcon}>❤️</span>
                  <span className={styles.metricTrend}>+5pt</span>
                </div>
                <div className={styles.metricValue}>{selectedStaff.healthScore}</div>
                <div className={styles.metricLabel}>健康スコア</div>
                <div className={styles.metricProgress}>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${selectedStaff.healthScore}%` }}></div>
                  </div>
                  <span className={styles.progressText}>総合評価 A</span>
                </div>
              </div>
              <div className={styles.metricCardEnhanced}>
                <div className={styles.metricHeader}>
                  <span className={styles.metricIcon}>🏃</span>
                  <span className={styles.metricTrend}>維持</span>
                </div>
                <div className={styles.metricValue}>3回/週</div>
                <div className={styles.metricLabel}>運動習慣</div>
                <div className={styles.ratingStars}>
                  <span className={styles.starFilled}>定期的な運動実施</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.summarySubCards}>
          <div className={styles.nextSessionCard}>
            <div className={styles.cardIconWrapper}>
              <span className={styles.cardIcon}>🩺</span>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardTitle}>次回健康診断</div>
              <div className={styles.cardMainInfo}>2024年10月</div>
              <div className={styles.cardSubInfo}>定期健康診断</div>
              <button className={styles.cardAction}>詳細確認</button>
            </div>
          </div>
          
          <div className={styles.recentTopicsCard}>
            <div className={styles.cardIconWrapper}>
              <span className={styles.cardIcon}>🎯</span>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardTitle}>健康改善ポイント</div>
              <div className={styles.topicsList}>
                <span className={styles.topicTag}>睡眠改善</span>
                <span className={styles.topicTag}>運動習慣継続</span>
                <span className={styles.topicTag}>ストレス管理</span>
              </div>
              <div className={styles.cardSubInfo}>前回チェックより改善傾向</div>
            </div>
          </div>
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

function MindsetTab({ selectedStaff }: { selectedStaff: any }): React.ReactElement {
  const mindset = selectedStaff.mindset || {
    careerOrientation: {
      type: 'balanced',
      vision: '患者様に寄り添える看護師として成長し続ける',
      goals: ['認定看護師資格取得', 'チームリーダーとしてのスキル向上'],
      desiredGrowthAreas: ['緩和ケア', 'リーダーシップ', '教育指導']
    },
    workApproach: {
      style: 'team',
      values: ['patientCare', 'quality', 'education'],
      motivationSources: ['growth', 'contribution', 'recognition'],
      strengths: ['コミュニケーション能力', '忍耐力', '共感力'],
      developmentAreas: ['時間管理', 'デジタルスキル']
    },
    workPreferences: {
      workStyle: 'fulltime',
      nightShift: 'yes',
      workLifeBalance: 'medium',
      relocationWillingness: 'negotiable',
      preferredDepartments: ['緩和ケア病棟', '一般病棟']
    },
    organizationalCommitment: {
      mentorshipInterest: 'high',
      projectParticipation: 'selective',
      improvementProposals: 'occasional',
      leadershipAspiration: true,
      teamBuildingInterest: 'high'
    },
    personalInterests: ['医療倫理', '患者心理学', '音楽療法'],
    specialCircumstances: '',
    lastUpdated: '2024-01-15',
    updatedBy: '人事部'
  }

  const careerTypeLabels = {
    management: '管理職志向',
    specialist: '専門職志向',
    frontline: '現場志向',
    balanced: 'バランス型'
  }

  const workStyleLabels = {
    team: 'チーム重視',
    individual: '個人重視',
    flexible: '柔軟'
  }

  const valueLabels = {
    patientCare: '患者ケア',
    efficiency: '効率性',
    innovation: '革新性',
    quality: '品質',
    education: '教育'
  }

  const motivationLabels = {
    achievement: '達成感',
    recognition: '承認',
    growth: '成長',
    contribution: '貢献',
    stability: '安定'
  }

  return (
    <div className={styles.tabContentSection}>
      <div className={styles.sectionHeader}>
        <h2>🧠 マインド・志向性</h2>
        <div className={styles.sectionActions}>
          <button className={styles.actionButton}>編集</button>
          <button className={styles.actionButtonSecondary}>面談で確認</button>
        </div>
      </div>

      <div className={styles.mindsetOverview}>
        <div className={styles.mindsetSummaryCard}>
          <div className={styles.mindsetType}>
            <div className={styles.typeIcon}>
              {mindset.careerOrientation.type === 'management' ? '👔' :
               mindset.careerOrientation.type === 'specialist' ? '🎯' :
               mindset.careerOrientation.type === 'frontline' ? '💉' : '⚖️'}
            </div>
            <div className={styles.typeInfo}>
              <h3>{careerTypeLabels[mindset.careerOrientation.type]}</h3>
              <p>{mindset.careerOrientation.vision}</p>
            </div>
          </div>
          <div className={styles.lastUpdateInfo}>
            <span>最終更新: {mindset.lastUpdated}</span>
            <span>更新者: {mindset.updatedBy}</span>
          </div>
        </div>
      </div>

      <div className={styles.mindsetSections}>
        <div className={styles.sectionCard}>
          <h3>キャリア志向</h3>
          <div className={styles.careerInfo}>
            <div className={styles.infoItem}>
              <h4>キャリアビジョン</h4>
              <p>{mindset.careerOrientation.vision}</p>
            </div>
            <div className={styles.infoItem}>
              <h4>中長期目標</h4>
              <ul className={styles.goalsList}>
                {mindset.careerOrientation.goals.map((goal: string, index: number) => (
                  <li key={index}>{goal}</li>
                ))}
              </ul>
            </div>
            <div className={styles.infoItem}>
              <h4>希望する成長分野</h4>
              <div className={styles.tagsList}>
                {mindset.careerOrientation.desiredGrowthAreas.map((area: string, index: number) => (
                  <span key={index} className={styles.tag}>{area}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.sectionCard}>
          <h3>仕事への向き合い方</h3>
          <div className={styles.workApproachGrid}>
            <div className={styles.approachItem}>
              <h4>ワークスタイル</h4>
              <div className={styles.styleIndicator}>
                <span className={styles.styleIcon}>
                  {mindset.workApproach.style === 'team' ? '👥' : 
                   mindset.workApproach.style === 'individual' ? '👤' : '🔄'}
                </span>
                <span>{workStyleLabels[mindset.workApproach.style]}</span>
              </div>
            </div>
            <div className={styles.approachItem}>
              <h4>重視する価値観</h4>
              <div className={styles.valuesList}>
                {mindset.workApproach.values.map((value: string, index: number) => (
                  <span key={index} className={styles.valueTag}>
                    {valueLabels[value as keyof typeof valueLabels]}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.approachItem}>
              <h4>モチベーション源</h4>
              <div className={styles.motivationList}>
                {mindset.workApproach.motivationSources.map((source: string, index: number) => (
                  <span key={index} className={styles.motivationTag}>
                    {motivationLabels[source as keyof typeof motivationLabels]}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.strengthsWeaknesses}>
            <div className={styles.strengthsSection}>
              <h4>強み</h4>
              <ul>
                {mindset.workApproach.strengths.map((strength: string, index: number) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            <div className={styles.developmentSection}>
              <h4>改善したい領域</h4>
              <ul>
                {mindset.workApproach.developmentAreas.map((area: string, index: number) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.sectionCard}>
          <h3>働き方の希望</h3>
          <div className={styles.preferencesGrid}>
            <div className={styles.preferenceItem}>
              <span className={styles.preferenceLabel}>勤務形態</span>
              <span className={styles.preferenceValue}>
                {mindset.workPreferences.workStyle === 'fulltime' ? 'フルタイム' :
                 mindset.workPreferences.workStyle === 'parttime' ? 'パートタイム' : '柔軟対応可'}
              </span>
            </div>
            <div className={styles.preferenceItem}>
              <span className={styles.preferenceLabel}>夜勤</span>
              <span className={styles.preferenceValue}>
                {mindset.workPreferences.nightShift === 'yes' ? '可能' :
                 mindset.workPreferences.nightShift === 'no' ? '不可' : '限定的に可'}
              </span>
            </div>
            <div className={styles.preferenceItem}>
              <span className={styles.preferenceLabel}>ワークライフバランス</span>
              <span className={styles.preferenceValue}>
                {mindset.workPreferences.workLifeBalance === 'high' ? '重視' :
                 mindset.workPreferences.workLifeBalance === 'medium' ? '普通' : '仕事優先'}
              </span>
            </div>
            <div className={styles.preferenceItem}>
              <span className={styles.preferenceLabel}>転勤・異動</span>
              <span className={styles.preferenceValue}>
                {mindset.workPreferences.relocationWillingness === 'yes' ? '可能' :
                 mindset.workPreferences.relocationWillingness === 'no' ? '不可' : '要相談'}
              </span>
            </div>
          </div>
          {mindset.workPreferences.preferredDepartments && (
            <div className={styles.preferredDepts}>
              <h4>希望部署</h4>
              <div className={styles.deptsList}>
                {mindset.workPreferences.preferredDepartments.map((dept: string, index: number) => (
                  <span key={index} className={styles.deptTag}>{dept}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.sectionCard}>
          <h3>組織への貢献意欲</h3>
          <div className={styles.commitmentGrid}>
            <div className={styles.commitmentItem}>
              <h4>メンター・指導役</h4>
              <div className={styles.commitmentLevel}>
                <div className={styles.levelBar}>
                  <div 
                    className={styles.levelFill} 
                    style={{ 
                      width: mindset.organizationalCommitment.mentorshipInterest === 'high' ? '100%' :
                             mindset.organizationalCommitment.mentorshipInterest === 'medium' ? '60%' : '30%'
                    }}
                  ></div>
                </div>
                <span>{mindset.organizationalCommitment.mentorshipInterest === 'high' ? '高' :
                       mindset.organizationalCommitment.mentorshipInterest === 'medium' ? '中' : '低'}</span>
              </div>
            </div>
            <div className={styles.commitmentItem}>
              <h4>プロジェクト参加</h4>
              <p>{mindset.organizationalCommitment.projectParticipation === 'proactive' ? '積極的' :
                  mindset.organizationalCommitment.projectParticipation === 'selective' ? '選択的' : '受動的'}</p>
            </div>
            <div className={styles.commitmentItem}>
              <h4>改善提案</h4>
              <p>{mindset.organizationalCommitment.improvementProposals === 'frequent' ? '頻繁' :
                  mindset.organizationalCommitment.improvementProposals === 'occasional' ? '時々' : 'まれ'}</p>
            </div>
            <div className={styles.commitmentItem}>
              <h4>リーダーシップ志向</h4>
              <p>{mindset.organizationalCommitment.leadershipAspiration ? 'あり' : 'なし'}</p>
            </div>
          </div>
        </div>

        {(mindset.personalInterests || mindset.specialCircumstances) && (
          <div className={styles.sectionCard}>
            <h3>その他の情報</h3>
            {mindset.personalInterests && mindset.personalInterests.length > 0 && (
              <div className={styles.infoItem}>
                <h4>個人的な興味・関心</h4>
                <div className={styles.interestsList}>
                  {mindset.personalInterests.map((interest: string, index: number) => (
                    <span key={index} className={styles.interestTag}>{interest}</span>
                  ))}
                </div>
              </div>
            )}
            {mindset.specialCircumstances && (
              <div className={styles.infoItem}>
                <h4>特別な事情</h4>
                <p>{mindset.specialCircumstances}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ManagementLinksTab({ selectedStaff }: { selectedStaff: any }): React.ReactElement {
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