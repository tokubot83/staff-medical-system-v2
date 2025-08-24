'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import CommonHeader from '@/components/CommonHeader'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { staffDatabase } from '../../data/staffData.js'
import styles from '../StaffCards.module.css'
import DashboardButton from '@/components/DashboardButton'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import BackToStaffCardsButton from '@/components/BackToStaffCardsButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motivationTypes } from '@/components/interview/MotivationTypeSection'
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
import PersonalDashboard from '@/components/dashboard/PersonalDashboard'
import PersonalAnalysisReport from '@/components/evaluation/PersonalAnalysisReport'
import StrengthWeaknessRadar from '@/components/evaluation/StrengthWeaknessRadar'
import TrainingEffectAnalysis from '@/components/evaluation/TrainingEffectAnalysis'

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
  { id: 'achievement', label: '実績・表彰', icon: '🏆' },
  { id: 'attendance', label: '勤務状況', icon: '⏰' },
  { id: 'wellbeing', label: '健康・ウェルビーイング', icon: '💚' },
  { id: 'development', label: '能力開発', icon: '🚀' },
  { id: 'interview', label: '面談・指導', icon: '💬' },
  { id: 'evaluation', label: '最新評価', icon: '📈' },
  { id: 'evaluation-history', label: '評価履歴', icon: '📋', isNew: true },
  { id: 'evaluation-report', label: '評価分析レポート', icon: '📊', isNew: true },
  { id: 'analytics', label: '総合分析', icon: '📊' },
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
          {activeTab === 'basic' && (
            <div style={{ margin: '-20px' }}>
              <PersonalDashboard 
                employeeId={selectedStaff.id} 
                employeeName={selectedStaff.name}
                selectedStaff={selectedStaff}
              />
            </div>
          )}
          {activeTab === 'career' && <CareerTab selectedStaff={selectedStaff} />}
          {activeTab === 'mindset' && <MindsetTab selectedStaff={selectedStaff} />}
          {activeTab === 'qualification' && <QualificationTab selectedStaff={selectedStaff} />}
          {activeTab === 'achievement' && <AchievementTab selectedStaff={selectedStaff} />}
          {activeTab === 'attendance' && <AttendanceTab selectedStaff={selectedStaff} />}
          {activeTab === 'wellbeing' && <WellbeingTab selectedStaff={selectedStaff} />}
          {activeTab === 'links' && <ManagementLinksTab selectedStaff={selectedStaff} />}
          {activeTab === 'analytics' && <AnalyticsTab selectedStaff={selectedStaff} />}
          {activeTab === 'evaluation' && <EvaluationTab selectedStaff={selectedStaff} />}
          {activeTab === 'evaluation-history' && <EvaluationHistoryTab selectedStaff={selectedStaff} />}
          {activeTab === 'evaluation-report' && <EvaluationReportTab selectedStaff={selectedStaff} />}
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
  const [motivationType, setMotivationType] = useState<any>(null)
  const [isLoadingMotivation, setIsLoadingMotivation] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  
  // 動機タイプデータの取得
  useEffect(() => {
    const fetchMotivationType = async () => {
      if (!selectedStaff?.id) return
      
      setIsLoadingMotivation(true)
      try {
        const response = await fetch(`/api/motivation/history/${selectedStaff.id}`)
        if (response.ok) {
          const data = await response.json()
          if (data.history && data.history.length > 0) {
            // 最新の動機タイプを設定
            const latest = data.history[0]
            setMotivationType(latest)
          }
        }
      } catch (error) {
        console.error('Failed to fetch motivation type:', error)
      } finally {
        setIsLoadingMotivation(false)
      }
    }
    
    fetchMotivationType()
  }, [selectedStaff?.id])
  
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

  const careerTypeLabels: Record<string, string> = {
    management: '管理職志向',
    specialist: '専門職志向',
    frontline: '現場志向',
    balanced: 'バランス型'
  }

  const workStyleLabels: Record<string, string> = {
    team: 'チーム重視',
    individual: '個人重視',
    flexible: '柔軟'
  }

  const valueLabels: Record<string, string> = {
    patientCare: '患者ケア',
    efficiency: '効率性',
    innovation: '革新性',
    quality: '品質',
    education: '教育'
  }

  const motivationLabels: Record<string, string> = {
    achievement: '達成感',
    recognition: '承認',
    growth: '成長',
    contribution: '貢献',
    stability: '安定'
  }
  
  // 動機タイプに基づく具体的なモチベーション源を取得
  const getMotivationSourcesForType = (typeId: string): string[] => {
    const typeSourcesMap: Record<string, string[]> = {
      growth: ['新しいスキルの習得', '挑戦的な業務への参加', '研修・学習機会', '成長実感'],
      recognition: ['上司からの評価', '同僚からの感謝', '表彰・昇進', '成果の可視化'],
      stability: ['明確な業務手順', '予測可能な環境', '安定した評価', '段階的な変化'],
      teamwork: ['チーム協働', '後輩指導', '相互支援', '良好な人間関係'],
      efficiency: ['業務改善', 'プロセス最適化', 'DX推進', '無駄の削減'],
      compensation: ['昇給機会', '福利厚生', '資格手当', 'インセンティブ'],
      creativity: ['独自のアプローチ', '裁量権', '創造的な問題解決', '柔軟な働き方']
    }
    return typeSourcesMap[typeId] || ['成長機会', '評価・承認', '貢献実感']
  }

  return (
    <div className={styles.tabContentSection}>
      <div className={styles.sectionHeader}>
        <h2>🧠 マインド・志向性</h2>
        <div className={styles.sectionActions}>
          <button 
            onClick={() => setShowGuide(!showGuide)}
            className={styles.actionButtonGuide}
          >
            {showGuide ? '活用ガイドを閉じる' : '📖 活用ガイド'}
          </button>
          <button className={styles.actionButton}>編集</button>
          <button className={styles.actionButtonSecondary}>面談で確認</button>
        </div>
      </div>

      {/* 人事部向け活用ガイド */}
      {showGuide && (
        <div className={styles.usageGuide}>
          <div className={styles.guideHeader}>
            <h3>🎯 人事部向け活用ガイド</h3>
            <p>各項目の重要度と具体的な活用方法</p>
          </div>
          <div className={styles.guideGrid}>
            <div className={styles.guideCard}>
              <div className={styles.guidePriority}>優先度 1</div>
              <h4>動機タイプ（V5判定）</h4>
              <p className={styles.guidePurpose}>
                <strong>把握目的:</strong> モチベーション源の科学的理解
              </p>
              <ul className={styles.guideActions}>
                <li>個別の動機付け戦略立案</li>
                <li>適切な業務配置の決定</li>
                <li>離職リスクの早期発見</li>
              </ul>
            </div>
            <div className={styles.guideCard}>
              <div className={styles.guidePriority}>優先度 2</div>
              <h4>キャリア志向</h4>
              <p className={styles.guidePurpose}>
                <strong>把握目的:</strong> 中長期的な人材育成計画
              </p>
              <ul className={styles.guideActions}>
                <li>後継者育成計画の策定</li>
                <li>専門性強化の投資判断</li>
                <li>昇進・異動の適性判断</li>
              </ul>
            </div>
            <div className={styles.guideCard}>
              <div className={styles.guidePriority}>優先度 3</div>
              <h4>組織貢献意欲</h4>
              <p className={styles.guidePurpose}>
                <strong>把握目的:</strong> 組織力強化のキーパーソン特定
              </p>
              <ul className={styles.guideActions}>
                <li>リーダー候補の選定</li>
                <li>教育担当者の適任者選出</li>
                <li>プロジェクトメンバー選定</li>
              </ul>
            </div>
            <div className={styles.guideCard}>
              <div className={styles.guidePriority}>優先度 4</div>
              <h4>モチベーション源</h4>
              <p className={styles.guidePurpose}>
                <strong>把握目的:</strong> エンゲージメント向上策の立案
              </p>
              <ul className={styles.guideActions}>
                <li>報酬制度の個別最適化</li>
                <li>表彰プログラムの設計</li>
                <li>業務環境の改善</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 全体サマリーカード - この職員の特徴を一目で把握 */}
      <div className={styles.mindsetOverview}>
        <div className={styles.mindsetQuickSummary}>
          <h3 className={styles.quickSummaryTitle}>📊 {selectedStaff.name}さんの特性サマリー</h3>
          <div className={styles.quickSummaryGrid}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>動機タイプ</span>
              <span className={styles.summaryValue}>
                {motivationType ? motivationType.typeName : '未判定'}
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>キャリア志向</span>
              <span className={styles.summaryValue}>
                {careerTypeLabels[mindset.careerOrientation.type]}
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>ワークスタイル</span>
              <span className={styles.summaryValue}>
                {workStyleLabels[mindset.workApproach.style]}
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>組織貢献</span>
              <span className={styles.summaryValue}>
                {mindset.organizationalCommitment.mentorshipInterest === 'high' ? '高意欲' :
                 mindset.organizationalCommitment.mentorshipInterest === 'medium' ? '中程度' : '低意欲'}
              </span>
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
          <div className={styles.sectionCardHeader}>
            <h3>キャリア志向</h3>
            <div className={styles.priorityIndicator}>
              <span className={styles.priorityDot} style={{ backgroundColor: '#ef4444' }}></span>
              <span>優先度 2</span>
            </div>
          </div>
          
          {/* 現在のタイプを大きく表示 */}
          <div className={styles.currentTypeHighlight}>
            <div className={styles.typeLabel}>現在のタイプ</div>
            <div className={styles.typeBadgeLarge}>
              <span className={styles.typeIconLarge}>
                {mindset.careerOrientation.type === 'management' ? '👔' :
                 mindset.careerOrientation.type === 'specialist' ? '🎯' :
                 mindset.careerOrientation.type === 'frontline' ? '💉' : '⚖️'}
              </span>
              <span className={styles.typeNameLarge}>
                {careerTypeLabels[mindset.careerOrientation.type]}
              </span>
            </div>
          </div>
          
          {/* タイプ別の具体的な対応方法 */}
          <div className={styles.typeSpecificActions}>
            <div className={styles.actionHeader}>
              <span className={styles.actionIcon}>🎯</span>
              <span className={styles.actionTitle}>
                {careerTypeLabels[mindset.careerOrientation.type]}への推奨アプローチ
              </span>
            </div>
            <div className={styles.actionContent}>
              {mindset.careerOrientation.type === 'management' && (
                <>
                  <div className={styles.actionDescription}>
                    管理職を目指す職員には、段階的にマネジメント経験を積ませることが重要です。
                  </div>
                  <ul className={styles.actionList}>
                    <li>📌 プロジェクトリーダーへの任命</li>
                    <li>📌 マネジメント研修の優先受講</li>
                    <li>📌 部下指導・メンタリング機会の提供</li>
                    <li>📌 経営層との対話機会の創出</li>
                  </ul>
                </>
              )}
              {mindset.careerOrientation.type === 'specialist' && (
                <>
                  <div className={styles.actionDescription}>
                    専門職志向の職員には、深い専門性を追求できる環境を整備することが重要です。
                  </div>
                  <ul className={styles.actionList}>
                    <li>📌 専門資格取得の支援</li>
                    <li>📌 学会参加・発表機会の提供</li>
                    <li>📌 専門分野での権限委譲</li>
                    <li>📌 エキスパートとしての社内認定</li>
                  </ul>
                </>
              )}
              {mindset.careerOrientation.type === 'frontline' && (
                <>
                  <div className={styles.actionDescription}>
                    現場志向の職員には、実務スキルの向上と現場での活躍を支援することが重要です。
                  </div>
                  <ul className={styles.actionList}>
                    <li>📌 実務スキル向上研修の提供</li>
                    <li>📌 現場改善提案の奨励</li>
                    <li>📌 ベストプラクティスの共有機会</li>
                    <li>📌 現場リーダーとしての役割付与</li>
                  </ul>
                </>
              )}
              {mindset.careerOrientation.type === 'balanced' && (
                <>
                  <div className={styles.actionDescription}>
                    バランス型の職員には、多様な経験を積みながら適性を見極めることが重要です。
                  </div>
                  <ul className={styles.actionList}>
                    <li>📌 ジョブローテーションの実施</li>
                    <li>📌 複数分野のプロジェクト参加</li>
                    <li>📌 キャリア相談の定期実施</li>
                    <li>📌 幅広いスキル開発の支援</li>
                  </ul>
                </>
              )}
            </div>
          </div>
          
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
          <div className={styles.sectionCardHeader}>
            <h3>仕事への向き合い方</h3>
            <div className={styles.priorityIndicator}>
              <span className={styles.priorityDot} style={{ backgroundColor: '#f59e0b' }}></span>
              <span>優先度 4</span>
            </div>
          </div>
          <div className={styles.hrPurpose}>
            <div className={styles.purposeIcon}>💡</div>
            <div className={styles.purposeContent}>
              <strong>人事部の把握目的:</strong>
              <span>エンゲージメント向上策の立案、個別最適な動機付け方法の選定</span>
            </div>
          </div>
          <div className={styles.workApproachGrid}>
            <div className={styles.approachItem}>
              <h4>ワークスタイル</h4>
              <div className={styles.currentTypeHighlight}>
                <div className={styles.typeBadgeMedium}>
                  <span className={styles.typeIconMedium}>
                    {mindset.workApproach.style === 'team' ? '👥' : 
                     mindset.workApproach.style === 'individual' ? '👤' : '🔄'}
                  </span>
                  <span className={styles.typeNameMedium}>
                    {workStyleLabels[mindset.workApproach.style]}
                  </span>
                </div>
              </div>
              <div className={styles.typeDescription}>
                {mindset.workApproach.style === 'team' && '他者との協働で最高のパフォーマンスを発揮'}
                {mindset.workApproach.style === 'individual' && '集中できる環境で高い成果を出す'}
                {mindset.workApproach.style === 'flexible' && '状況に応じて柔軟に対応可能'}
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
            
            {/* 動機タイプ（V5判定結果） - 最重要項目 */}
            <div className={`${styles.approachItem} ${styles.highlightedItem}`}>
              <div className={styles.itemHeader}>
                <h4>動機タイプ（V5判定）</h4>
                <div className={styles.priorityBadgeSmall}>
                  <span>🔥 最重要</span>
                </div>
              </div>
              {isLoadingMotivation ? (
                <div className={styles.loadingIndicator}>読み込み中...</div>
              ) : motivationType ? (
                <>
                  {/* 現在のタイプを大きく表示 */}
                  <div className={styles.currentTypeHighlight}>
                    <div className={styles.typeBadgeLarge} style={{ background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)' }}>
                      <span className={styles.typeOptionLabel}>
                        {motivationType.optionLabel || 'A'}
                      </span>
                      <span className={styles.typeNameLarge}>
                        {motivationType.typeName}
                      </span>
                    </div>
                  </div>
                  
                  {/* タイプ別の詳細説明と対応 */}
                  <div className={styles.typeSpecificActions}>
                    <div className={styles.actionHeader}>
                      <span className={styles.actionIcon}>💡</span>
                      <span className={styles.actionTitle}>
                        {motivationType.typeName}型の特徴と対応方法
                      </span>
                    </div>
                    <div className={styles.actionContent}>
                      {motivationType.typeId === 'growth' && (
                        <>
                          <div className={styles.actionDescription}>
                            成長追求型の職員は、新しい挑戦と学習機会に強くモチベートされます。停滞は離職リスクに直結します。
                          </div>
                          <ul className={styles.actionList}>
                            <li>🚀 新規プロジェクトへの積極的アサイン</li>
                            <li>🚀 スキル向上研修の優先提供</li>
                            <li>🚀 チャレンジングな目標設定</li>
                            <li>🚀 キャリアアップの道筋明示</li>
                          </ul>
                          <div className={styles.warningBox}>
                            ⚠️ 注意: ルーティン業務のみでは満足度が低下します
                          </div>
                        </>
                      )}
                      {motivationType.typeId === 'recognition' && (
                        <>
                          <div className={styles.actionDescription}>
                            承認重視型の職員は、成果への評価と認知を強く求めます。フィードバック不足は深刻なモチベーション低下を招きます。
                          </div>
                          <ul className={styles.actionList}>
                            <li>🏆 定期的な成果フィードバック（月1回以上）</li>
                            <li>🏆 表彰制度への積極的推薦</li>
                            <li>🏆 成果の可視化と全体共有</li>
                            <li>🏆 上司からの直接的な評価伝達</li>
                          </ul>
                          <div className={styles.warningBox}>
                            ⚠️ 注意: 成果を認められないと離職リスクが高まります
                          </div>
                        </>
                      )}
                      {motivationType.typeId === 'stability' && (
                        <>
                          <div className={styles.actionDescription}>
                            安定志向型の職員は、予測可能な環境と明確な役割を好みます。急激な変化は強いストレスとなります。
                          </div>
                          <ul className={styles.actionList}>
                            <li>🛡️ 明確な業務手順とロールの提示</li>
                            <li>🛡️ 段階的で計画的な変化管理</li>
                            <li>🛡️ 長期的な雇用安定性の保証</li>
                            <li>🛡️ 予測可能なキャリアパスの提示</li>
                          </ul>
                          <div className={styles.warningBox}>
                            ⚠️ 注意: 突然の組織変更や役割変更は避けるべきです
                          </div>
                        </>
                      )}
                      {motivationType.typeId === 'teamwork' && (
                        <>
                          <div className={styles.actionDescription}>
                            チーム協調型の職員は、仲間との協働と相互支援に喜びを感じます。孤立した環境では能力を発揮できません。
                          </div>
                          <ul className={styles.actionList}>
                            <li>👥 チームプロジェクトへの優先配置</li>
                            <li>👥 メンター・教育担当への任命</li>
                            <li>👥 部門間連携業務の推進役</li>
                            <li>👥 チームビルディング活動への参加</li>
                          </ul>
                          <div className={styles.warningBox}>
                            ⚠️ 注意: 個人作業中心の配置は避けるべきです
                          </div>
                        </>
                      )}
                      {!['growth', 'recognition', 'stability', 'teamwork'].includes(motivationType.typeId) && (
                        <>
                          <div className={styles.actionDescription}>
                            このタイプの詳細な特性は個別確認が必要です。
                          </div>
                          <ul className={styles.actionList}>
                            <li>📋 個別面談による詳細確認</li>
                            <li>📋 カスタマイズされた育成計画</li>
                            <li>📋 定期的なモチベーション確認</li>
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                  <div className={styles.motivationTypeDetails}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>判定日:</span>
                      <span className={styles.detailValue}>
                        {new Date(motivationType.assessmentDate).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>信頼度:</span>
                      <span className={`${styles.detailValue} ${styles[`confidence-${motivationType.confidenceLevel}`]}`}>
                        {motivationType.confidenceLevel === 'high' ? '高' :
                         motivationType.confidenceLevel === 'medium' ? '中' : '低'}
                      </span>
                    </div>
                  </div>
                  {motivationType.keywords && (
                    <div className={styles.motivationKeywords}>
                      {motivationType.keywords.map((keyword: string, index: number) => (
                        <span key={index} className={styles.keywordTag}>
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.noMotivationType}>
                  <p>V5面談による判定結果がありません</p>
                  <Link href={`/interviews?staffId=${selectedStaff.id}&type=v5`} className={styles.linkButton}>
                    V5面談を実施する
                  </Link>
                </div>
              )}
            </div>
            
            {/* モチベーション源（動機タイプに基づく具体例） */}
            <div className={styles.approachItem}>
              <h4>モチベーション源
                {motivationType && <span className={styles.subLabel}>（{motivationType.typeName}型の特徴）</span>}
              </h4>
              <div className={styles.motivationList}>
                {motivationType ? (
                  // 動機タイプに基づく具体的なモチベーション源を表示
                  <>
                    {getMotivationSourcesForType(motivationType.typeId).map((source: string, index: number) => (
                      <span key={index} className={styles.motivationTag}>
                        {source}
                      </span>
                    ))}
                  </>
                ) : (
                  // 既存のモチベーション源を表示
                  mindset.workApproach.motivationSources.map((source: string, index: number) => (
                    <span key={index} className={styles.motivationTag}>
                      {motivationLabels[source as keyof typeof motivationLabels]}
                    </span>
                  ))
                )}
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
          <div className={styles.sectionCardHeader}>
            <h3>働き方の希望</h3>
            <div className={styles.priorityIndicator}>
              <span className={styles.priorityDot} style={{ backgroundColor: '#10b981' }}></span>
              <span>優先度 5</span>
            </div>
          </div>
          <div className={styles.hrPurpose}>
            <div className={styles.purposeIcon}>⚙️</div>
            <div className={styles.purposeContent}>
              <strong>人事部の把握目的:</strong>
              <span>実務的な配置計画、シフト編成、異動可能性の判断</span>
            </div>
          </div>
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
          <div className={styles.sectionCardHeader}>
            <h3>組織への貢献意欲</h3>
            <div className={styles.priorityIndicator}>
              <span className={styles.priorityDot} style={{ backgroundColor: '#f59e0b' }}></span>
              <span>優先度 3</span>
            </div>
          </div>
          <div className={styles.hrPurpose}>
            <div className={styles.purposeIcon}>🚀</div>
            <div className={styles.purposeContent}>
              <strong>人事部の把握目的:</strong>
              <span>組織力強化のキーパーソン特定、リーダー候補選定、教育体制構築</span>
            </div>
          </div>
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

function EvaluationHistoryTab({ selectedStaff }: { selectedStaff: any }): React.ReactElement {
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [displayYears, setDisplayYears] = useState(10);
  
  // 効果的プレゼン指示書準拠のカラーパレット
  const CHART_COLORS = {
    primary: '#2563eb',    // 青 - 主要データ
    success: '#16a34a',    // 緑 - 成功・向上
    warning: '#f59e0b',    // オレンジ - 注意・改善必要
    danger: '#dc2626',     // 赤 - 減少・問題
    neutral: '#6b7280',    // グレー - 基準線・その他
    highlight: '#fbbf24',  // 黄 - ハイライト
  };
  
  // 勤続年数に基づく表示年数の決定（実際は selectedStaff から取得）
  const yearsOfService = selectedStaff?.yearsOfService || 7; // 仮で7年とする
  const defaultDisplayYears = yearsOfService >= 10 ? 10 : yearsOfService;
  
  // モック履歴データ（実際には全履歴をAPIから取得）
  const fullEvaluationHistory = [
    {
      year: '2024年度',
      period: '2023/4-2024/3',
      facilityGrade: 'A',
      corporateGrade: 'B',
      finalGrade: 'A',
      totalScore: 81.25,
      technicalScore: 40,
      contributionScore: 41.25,
      facilityRank: { rank: 12, total: 120, percentile: 90 },
      corporateRank: { rank: 89, total: 850, percentile: 89 },
      status: 'confirmed'
    },
    {
      year: '2023年度',
      period: '2022/4-2023/3',
      facilityGrade: 'B',
      corporateGrade: 'B',
      finalGrade: 'B',
      totalScore: 78.5,
      technicalScore: 38,
      contributionScore: 40.5,
      facilityRank: { rank: 18, total: 118, percentile: 85 },
      corporateRank: { rank: 127, total: 820, percentile: 85 },
      status: 'confirmed'
    },
    {
      year: '2022年度',
      period: '2021/4-2022/3',
      facilityGrade: 'B',
      corporateGrade: 'C',
      finalGrade: 'B',
      totalScore: 75.8,
      technicalScore: 36,
      contributionScore: 39.8,
      facilityRank: { rank: 22, total: 115, percentile: 81 },
      corporateRank: { rank: 189, total: 800, percentile: 76 },
      status: 'confirmed'
    },
    {
      year: '2021年度',
      period: '2020/4-2021/3',
      facilityGrade: 'C',
      corporateGrade: 'C',
      finalGrade: 'C',
      totalScore: 68.2,
      technicalScore: 32,
      contributionScore: 36.2,
      facilityRank: { rank: 35, total: 112, percentile: 69 },
      corporateRank: { rank: 298, total: 785, percentile: 62 },
      status: 'confirmed'
    },
    {
      year: '2020年度',
      period: '2019/4-2020/3',
      facilityGrade: 'C',
      corporateGrade: 'D',
      finalGrade: 'C',
      totalScore: 64.1,
      technicalScore: 30,
      contributionScore: 34.1,
      facilityRank: { rank: 42, total: 110, percentile: 62 },
      corporateRank: { rank: 456, total: 770, percentile: 41 },
      status: 'confirmed'
    },
    {
      year: '2019年度',
      period: '2018/4-2019/3',
      facilityGrade: 'D',
      corporateGrade: 'D',
      finalGrade: 'D',
      totalScore: 58.5,
      technicalScore: 26,
      contributionScore: 32.5,
      facilityRank: { rank: 68, total: 105, percentile: 35 },
      corporateRank: { rank: 598, total: 750, percentile: 20 },
      status: 'confirmed'
    },
    {
      year: '2018年度',
      period: '2017/4-2018/3',
      facilityGrade: 'D',
      corporateGrade: 'D',
      finalGrade: 'D',
      totalScore: 52.8,
      technicalScore: 22,
      contributionScore: 30.8,
      facilityRank: { rank: 78, total: 102, percentile: 24 },
      corporateRank: { rank: 642, total: 730, percentile: 12 },
      status: 'confirmed'
    }
  ]

  // 表示する履歴を決定
  const evaluationHistory = showAllHistory ? fullEvaluationHistory : fullEvaluationHistory.slice(0, defaultDisplayYears)

  const getGradeColor = (grade: string) => {
    const colors = {
      'S+': '#8B0000', 'S': '#FF0000', 'A+': '#FF4500', 'A': '#FFA500',
      'B': '#32CD32', 'C': '#1E90FF', 'D': '#808080'
    }
    return colors[grade as keyof typeof colors] || colors['B']
  }

  return (
    <div className={styles.evaluationHistoryContainer}>
      <div className={styles.sectionHeader}>
        <h2>📋 評価履歴（V3システム）</h2>
        <div className={styles.sectionActions}>
          <button className={styles.actionButton}>CSV出力（全履歴）</button>
          <button className={styles.actionButtonSecondary}>推移分析</button>
          {fullEvaluationHistory.length > defaultDisplayYears && (
            <button 
              className={styles.actionButtonSecondary}
              onClick={() => setShowAllHistory(!showAllHistory)}
            >
              {showAllHistory ? `最新${defaultDisplayYears}年に戻す` : `全${fullEvaluationHistory.length}年表示`}
            </button>
          )}
        </div>
      </div>

      {/* 総合評価推移 - レポートセンタースタイル */}
      <Card className="border-l-4" style={{ borderLeftColor: CHART_COLORS.primary }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            📈 総合評価点数の推移
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* グラフエリア（左側 2/3） */}
            <div className="lg:col-span-2">
              <div className="h-96 bg-gradient-to-br from-blue-50 to-white rounded-lg p-6 relative border shadow-inner hover:shadow-lg transition-shadow duration-300">
                <svg width="100%" height="100%" viewBox="0 0 600 320" className="overflow-visible" style={{ cursor: 'crosshair' }}>
                  {/* グリッドライン */}
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity="0.3"/>
                      <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity="0.1"/>
                    </linearGradient>
                  </defs>
                  
                  {/* 基準線（90点） */}
                  <line x1="90" y1="80" x2="550" y2="80" stroke="#10b981" strokeWidth="3" strokeDasharray="8,5" opacity="0.8"/>
                  <text x="560" y="85" fill="#10b981" fontSize="16" fontWeight="bold">S級（90点）</text>
                  
                  {/* Y軸 */}
                  <line x1="70" y1="30" x2="70" y2="250" stroke="#9ca3af" strokeWidth="2"/>
                  <text x="50" y="35" fill="#6b7280" fontSize="14" fontWeight="medium">100</text>
                  <text x="55" y="80" fill="#6b7280" fontSize="14" fontWeight="medium">80</text>
                  <text x="55" y="125" fill="#6b7280" fontSize="14" fontWeight="medium">60</text>
                  <text x="55" y="170" fill="#6b7280" fontSize="14" fontWeight="medium">40</text>
                  <text x="55" y="215" fill="#6b7280" fontSize="14" fontWeight="medium">20</text>
                  <text x="60" y="260" fill="#6b7280" fontSize="14" fontWeight="medium">0</text>
                  
                  {/* X軸 */}
                  <line x1="70" y1="250" x2="550" y2="250" stroke="#9ca3af" strokeWidth="2"/>
                  
                  {/* データライン（面グラフ） */}
                  <polygon
                    points="90,200 210,150 330,140 450,95 570,80 570,250 90,250"
                    fill="url(#gradient)"
                  />
                  
                  {/* データライン */}
                  <polyline
                    points="90,200 210,150 330,140 450,95 570,80"
                    fill="none"
                    stroke={CHART_COLORS.primary}
                    strokeWidth="6"
                    style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.15))' }}
                  />
                  
                  {/* データポイント（インタラクティブ） */}
                  {[200, 150, 140, 95, 80].map((y, i) => {
                    const scores = [52.3, 65.8, 68.2, 78.4, 81.25];
                    const score = scores[i];
                    const year = 2020 + i;
                    const color = score >= 80 ? CHART_COLORS.primary : score >= 70 ? CHART_COLORS.success : score >= 60 ? CHART_COLORS.warning : CHART_COLORS.danger;
                    return (
                      <g key={i} className="group">
                        <circle
                          cx={90 + i * 120}
                          cy={y}
                          r={i === 4 ? "12" : "9"}
                          fill={color}
                          stroke="#fff"
                          strokeWidth="4"
                          className="transition-all duration-300 group-hover:r-15 cursor-pointer"
                          style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}
                        />
                        <circle
                          cx={90 + i * 120}
                          cy={y}
                          r="18"
                          fill={color}
                          fillOpacity="0"
                          className="transition-all duration-300 group-hover:fill-opacity-25"
                        />
                        <text
                          x={90 + i * 120}
                          y={y - 18}
                          fill="#fff"
                          fontSize={i === 4 ? "16" : "14"}
                          fontWeight="bold"
                          textAnchor="middle"
                          className="transition-all duration-300 group-hover:text-lg"
                          style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))' }}
                        >
                          {score}
                        </text>
                        {/* ホバー時のツールチップ */}
                        <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <rect
                            x={90 + i * 120 - 60}
                            y={y - 75}
                            width="120"
                            height="40"
                            rx="8"
                            fill="rgba(15, 23, 42, 0.95)"
                            style={{ filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.4))' }}
                          />
                          <text
                            x={90 + i * 120}
                            y={y - 60}
                            textAnchor="middle"
                            className="text-base fill-white font-semibold"
                          >
                            {year}年
                          </text>
                          <text
                            x={90 + i * 120}
                            y={y - 40}
                            textAnchor="middle"
                            className="text-sm fill-white font-medium"
                          >
                            総合: {score}点
                          </text>
                        </g>
                      </g>
                    );
                  })}
                  
                  {/* X軸ラベル */}
                  {[2020, 2021, 2022, 2023, 2024].map((year, i) => (
                    <text
                      key={year}
                      x={90 + i * 120}
                      y={275}
                      fill="#6b7280"
                      fontSize="16"
                      fontWeight={i === 4 ? "bold" : "medium"}
                      textAnchor="middle"
                    >
                      {year}
                    </text>
                  ))}
                </svg>
              </div>
            </div>
            
            {/* 解釈・補足エリア（右側 1/3） */}
            <div className="space-y-4">
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r">
                <h4 className="font-bold text-green-800 mb-2">📊 トレンド分析</h4>
                <div className="space-y-2 text-sm text-green-700">
                  <p className="font-medium">継続的な成長軌道</p>
                  <p>• 年平均 +7.2点の安定向上</p>
                  <p>• 2022年以降は成長加速</p>
                  <p>• 目標90点まで残り8.75点</p>
                </div>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r">
                <h4 className="font-bold text-blue-800 mb-2">🎯 キーポイント</h4>
                <div className="space-y-1 text-sm text-blue-700">
                  <p>• C→B→A の段階的向上</p>
                  <p>• 技術・組織両面で成長</p>
                  <p>• 2024年にAグレード到達</p>
                </div>
              </div>
              
              <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r">
                <h4 className="font-bold text-orange-800 mb-2">🚀 次のステップ</h4>
                <div className="space-y-1 text-sm text-orange-700">
                  <p>• Sグレード挑戦フェーズ</p>
                  <p>• リーダーシップ強化</p>
                  <p>• 指導力向上研修</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 法人内評価推移 */}
      <Card className="border-l-4" style={{ borderLeftColor: CHART_COLORS.success }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            🌐 法人内順位推移
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* グラフエリア */}
            <div className="lg:col-span-2">
              <div className="h-96 bg-gradient-to-br from-green-50 to-white rounded-lg p-6 relative border shadow-inner hover:shadow-lg transition-shadow duration-300">
                <svg width="100%" height="100%" viewBox="0 0 600 320" className="overflow-visible" style={{ cursor: 'crosshair' }}>
                  {/* 上位10%ライン */}
                  <line x1="80" y1="100" x2="550" y2="100" stroke="#10b981" strokeWidth="4" strokeDasharray="10,5" opacity="0.8"/>
                  <text x="560" y="95" fill="#10b981" fontSize="16" fontWeight="bold">上位10%</text>
                  
                  {/* Y軸（順位は逆転） */}
                  <line x1="80" y1="50" x2="80" y2="280" stroke="#9ca3af" strokeWidth="2"/>
                  <text x="60" y="55" fill="#6b7280" fontSize="15" fontWeight="medium">1位</text>
                  <text x="50" y="110" fill="#6b7280" fontSize="15" fontWeight="medium">25位</text>
                  <text x="50" y="165" fill="#6b7280" fontSize="15" fontWeight="medium">50位</text>
                  <text x="50" y="220" fill="#6b7280" fontSize="15" fontWeight="medium">75位</text>
                  <text x="40" y="275" fill="#6b7280" fontSize="15" fontWeight="medium">100位</text>
                  
                  {/* データライン */}
                  <polyline
                    points="100,260 220,210 340,175 460,125 580,105"
                    fill="none"
                    stroke={CHART_COLORS.success}
                    strokeWidth="6"
                    style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.15))' }}
                  />
                  
                  {/* データポイント（インタラクティブ） */}
                  {[260, 210, 175, 125, 105].map((y, i) => {
                    const ranks = [89, 65, 42, 22, 12];
                    const rank = ranks[i];
                    const year = 2020 + i;
                    const color = rank <= 10 ? CHART_COLORS.primary : rank <= 25 ? CHART_COLORS.success : rank <= 50 ? CHART_COLORS.warning : CHART_COLORS.danger;
                    return (
                      <g key={i} className="group">
                        <circle
                          cx={100 + i * 120}
                          cy={y}
                          r={i === 4 ? "14" : "11"}
                          fill={color}
                          stroke="#fff"
                          strokeWidth="4"
                          className="transition-all duration-300 group-hover:r-17 cursor-pointer"
                          style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}
                        />
                        <circle
                          cx={100 + i * 120}
                          cy={y}
                          r="20"
                          fill={color}
                          fillOpacity="0"
                          className="transition-all duration-300 group-hover:fill-opacity-25"
                        />
                        <text
                          x={100 + i * 120}
                          y={y + 7}
                          fill="#fff"
                          fontSize={i === 4 ? "17" : "15"}
                          fontWeight="bold"
                          textAnchor="middle"
                          className="transition-all duration-300 group-hover:text-lg"
                          style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))' }}
                        >
                          {rank}位
                        </text>
                        {/* ホバー時のツールチップ */}
                        <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <rect
                            x={100 + i * 120 - 75}
                            y={y - 80}
                            width="150"
                            height="45"
                            rx="8"
                            fill="rgba(15, 23, 42, 0.95)"
                            style={{ filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.4))' }}
                          />
                          <text
                            x={100 + i * 120}
                            y={y - 65}
                            textAnchor="middle"
                            className="text-base fill-white font-semibold"
                          >
                            {year}年 法人内順位
                          </text>
                          <text
                            x={100 + i * 120}
                            y={y - 45}
                            textAnchor="middle"
                            className="text-sm fill-white font-medium"
                          >
                            {rank}位 / 200人中
                          </text>
                        </g>
                      </g>
                    );
                  })}
                  
                  {/* X軸ラベル */}
                  {[2020, 2021, 2022, 2023, 2024].map((year, i) => (
                    <text
                      key={year}
                      x={100 + i * 120}
                      y={305}
                      fill="#6b7280"
                      fontSize="16"
                      fontWeight={i === 4 ? "bold" : "medium"}
                      textAnchor="middle"
                    >
                      {year}
                    </text>
                  ))}
                </svg>
              </div>
            </div>
            
            {/* 解釈エリア */}
            <div className="space-y-4">
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r">
                <h4 className="font-bold text-green-800 mb-2">🏆 順位向上</h4>
                <div className="space-y-2 text-sm text-green-700">
                  <p className="font-medium">劇的な改善を実現</p>
                  <p>• 89位→12位（77位向上）</p>
                  <p>• 全法人850名中上位1.4%</p>
                  <p>• 継続的な右肩上がり</p>
                </div>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r">
                <h4 className="font-bold text-blue-800 mb-2">📈 成長要因</h4>
                <div className="space-y-1 text-sm text-blue-700">
                  <p>• 法人研修積極参加</p>
                  <p>• 横断プロジェクト参画</p>
                  <p>• メンター制度活用</p>
                </div>
              </div>
              
              <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r">
                <h4 className="font-bold text-purple-800 mb-2">⭐ 評価</h4>
                <div className="space-y-1 text-sm text-purple-700">
                  <p>• エクセレント達成</p>
                  <p>• 昇進候補筆頭</p>
                  <p>• ロールモデル認定</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 施設内評価推移 */}
      <Card className="border-l-4" style={{ borderLeftColor: CHART_COLORS.warning }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            🏢 施設内順位推移
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* グラフエリア */}
            <div className="lg:col-span-2">
              <div className="h-96 bg-gradient-to-br from-orange-50 to-white rounded-lg p-6 relative border shadow-inner hover:shadow-lg transition-shadow duration-300">
                <svg width="100%" height="100%" viewBox="0 0 600 320" className="overflow-visible" style={{ cursor: 'crosshair' }}>
                  {/* 上位10%ライン */}
                  <line x1="80" y1="85" x2="550" y2="85" stroke="#f59e0b" strokeWidth="4" strokeDasharray="10,5" opacity="0.8"/>
                  <text x="560" y="80" fill="#f59e0b" fontSize="16" fontWeight="bold">上位10%</text>
                  
                  {/* データライン */}
                  <polyline
                    points="100,240 220,195 340,175 460,145 580,115"
                    fill="none"
                    stroke={CHART_COLORS.warning}
                    strokeWidth="6"
                    style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.15))' }}
                  />
                  
                  {/* データポイント（インタラクティブ） */}
                  {[240, 195, 175, 145, 115].map((y, i) => {
                    const ranks = [35, 22, 18, 15, 8];
                    const rank = ranks[i];
                    const year = 2020 + i;
                    const color = rank <= 5 ? CHART_COLORS.primary : rank <= 15 ? CHART_COLORS.success : rank <= 25 ? CHART_COLORS.warning : CHART_COLORS.danger;
                    return (
                      <g key={i} className="group">
                        <circle
                          cx={100 + i * 120}
                          cy={y}
                          r={i === 4 ? "14" : "11"}
                          fill={color}
                          stroke="#fff"
                          strokeWidth="4"
                          className="transition-all duration-300 group-hover:r-17 cursor-pointer"
                          style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}
                        />
                        <circle
                          cx={100 + i * 120}
                          cy={y}
                          r="20"
                          fill={color}
                          fillOpacity="0"
                          className="transition-all duration-300 group-hover:fill-opacity-25"
                        />
                        <text
                          x={100 + i * 120}
                          y={y + 7}
                          fill="#fff"
                          fontSize={i === 4 ? "17" : "15"}
                          fontWeight="bold"
                          textAnchor="middle"
                          className="transition-all duration-300 group-hover:text-lg"
                          style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))' }}
                        >
                          {rank}位
                        </text>
                        {/* ホバー時のツールチップ */}
                        <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <rect
                            x={100 + i * 120 - 75}
                            y={y - 80}
                            width="150"
                            height="45"
                            rx="8"
                            fill="rgba(15, 23, 42, 0.95)"
                            style={{ filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.4))' }}
                          />
                          <text
                            x={100 + i * 120}
                            y={y - 65}
                            textAnchor="middle"
                            className="text-base fill-white font-semibold"
                          >
                            {year}年 施設内順位
                          </text>
                          <text
                            x={100 + i * 120}
                            y={y - 45}
                            textAnchor="middle"
                            className="text-sm fill-white font-medium"
                          >
                            {rank}位 / 80人中
                          </text>
                        </g>
                      </g>
                    );
                  })}
                  
                  {/* X軸ラベル */}
                  {[2020, 2021, 2022, 2023, 2024].map((year, i) => (
                    <text
                      key={year}
                      x={100 + i * 120}
                      y={305}
                      fill="#6b7280"
                      fontSize="16"
                      fontWeight={i === 4 ? "bold" : "medium"}
                      textAnchor="middle"
                    >
                      {year}
                    </text>
                  ))}
                </svg>
              </div>
            </div>
            
            {/* 解釈エリア */}
            <div className="space-y-4">
              <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r">
                <h4 className="font-bold text-orange-800 mb-2">🎯 現場評価</h4>
                <div className="space-y-2 text-sm text-orange-700">
                  <p className="font-medium">現場での高い評価</p>
                  <p>• 35位→8位（27位向上）</p>
                  <p>• 施設120名中上位6.7%</p>
                  <p>• 同期では最高位</p>
                </div>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r">
                <h4 className="font-bold text-blue-800 mb-2">💪 強み</h4>
                <div className="space-y-1 text-sm text-blue-700">
                  <p>• 患者・家族からの信頼</p>
                  <p>• チームワーク力</p>
                  <p>• 現場改善提案</p>
                </div>
              </div>
              
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r">
                <h4 className="font-bold text-green-800 mb-2">🏆 今後の展開</h4>
                <div className="space-y-1 text-sm text-green-700">
                  <p>• 主任候補として期待</p>
                  <p>• 新人指導担当</p>
                  <p>• 委員会リーダー</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 年度別詳細履歴 - Card style */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📋 年度別評価詳細履歴
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="space-y-3">
              {evaluationHistory.map((history, index) => (
                <Card 
                  key={history.year} 
                  className={`${index === 0 ? 'border-2 border-blue-200 shadow-lg' : ''} overflow-hidden`}
                >
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {/* 年度・期間 */}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg font-bold text-gray-800">{history.year}</span>
                          {index === 0 && (
                            <Badge style={{ backgroundColor: CHART_COLORS.primary, color: 'white', fontSize: '10px' }}>
                              最新
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{history.period}</div>
                      </div>

                      {/* 総合判定 - メイン表示 */}
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-xs text-gray-500 mb-1">総合判定</div>
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold mb-1"
                          style={{ backgroundColor: getGradeColor(history.finalGrade) }}
                        >
                          {history.finalGrade}
                        </div>
                        <div className="text-sm font-medium text-gray-700">
                          {history.totalScore}点
                        </div>
                      </div>

                      {/* 施設内・法人内評価 */}
                      <div className="flex flex-col">
                        <div className="text-xs text-gray-500 mb-2">詳細評価</div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-600">施設内</span>
                          <Badge 
                            style={{ 
                              backgroundColor: `${getGradeColor(history.facilityGrade)}20`,
                              color: getGradeColor(history.facilityGrade),
                              border: `1px solid ${getGradeColor(history.facilityGrade)}40`
                            }}
                          >
                            {history.facilityGrade}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">法人内</span>
                          <Badge 
                            style={{ 
                              backgroundColor: `${getGradeColor(history.corporateGrade)}20`,
                              color: getGradeColor(history.corporateGrade),
                              border: `1px solid ${getGradeColor(history.corporateGrade)}40`
                            }}
                          >
                            {history.corporateGrade}
                          </Badge>
                        </div>
                      </div>

                      {/* スコア詳細 */}
                      <div className="flex flex-col">
                        <div className="text-xs text-gray-500 mb-2">得点内訳</div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">技術</span>
                            <span className="text-sm font-medium">{history.technicalScore}点</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">組織</span>
                            <span className="text-sm font-medium">{history.contributionScore}点</span>
                          </div>
                        </div>
                      </div>

                      {/* 施設内順位 */}
                      <div className="flex flex-col">
                        <div className="text-xs text-gray-500 mb-2">施設内順位</div>
                        <div className="text-center">
                          <div className="text-lg font-bold" style={{ color: CHART_COLORS.primary }}>
                            {history.facilityRank.rank}位
                          </div>
                          <div className="text-xs text-gray-600">
                            / {history.facilityRank.total}人中
                          </div>
                          <Badge 
                            style={{ 
                              backgroundColor: history.facilityRank.percentile >= 90 ? CHART_COLORS.success : 
                                              history.facilityRank.percentile >= 70 ? CHART_COLORS.warning : CHART_COLORS.neutral,
                              color: 'white',
                              fontSize: '10px'
                            }}
                          >
                            上位{100-history.facilityRank.percentile}%
                          </Badge>
                        </div>
                      </div>

                      {/* 法人内順位 */}
                      <div className="flex flex-col">
                        <div className="text-xs text-gray-500 mb-2">法人内順位</div>
                        <div className="text-center">
                          <div className="text-lg font-bold" style={{ color: CHART_COLORS.primary }}>
                            {history.corporateRank.rank}位
                          </div>
                          <div className="text-xs text-gray-600">
                            / {history.corporateRank.total}人中
                          </div>
                          <Badge 
                            style={{ 
                              backgroundColor: history.corporateRank.percentile >= 90 ? CHART_COLORS.success : 
                                              history.corporateRank.percentile >= 70 ? CHART_COLORS.warning : CHART_COLORS.neutral,
                              color: 'white',
                              fontSize: '10px'
                            }}
                          >
                            上位{100-history.corporateRank.percentile}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 成長分析 - Card style */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎯 成長分析・特徴
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4" style={{ borderLeftColor: CHART_COLORS.success }}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📈</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-2">継続的成長</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {evaluationHistory[evaluationHistory.length - 1].year}の{evaluationHistory[evaluationHistory.length - 1].finalGrade}評価から{evaluationHistory.length}年間で着実にランクアップ。
                      特に直近の成長が顕著で、施設内での評価向上が目立つ。
                    </p>
                    <Badge 
                      className="mt-2"
                      style={{ backgroundColor: CHART_COLORS.success, color: 'white' }}
                    >
                      着実な向上傾向
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4" style={{ borderLeftColor: CHART_COLORS.primary }}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🏢</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-2">現場力の強さ</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      施設内評価が法人内評価を常に上回る傾向。
                      現場での実践力と同僚・患者からの信頼が高い証拠と考えられる。
                    </p>
                    <Badge 
                      className="mt-2"
                      style={{ backgroundColor: CHART_COLORS.primary, color: 'white' }}
                    >
                      現場評価○
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4" style={{ borderLeftColor: CHART_COLORS.warning }}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🚀</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-2">今後の展望</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      法人規模での活動により一層注力することで、
                      S評価到達も十分に期待できるレベルに成長している。
                    </p>
                    <Badge 
                      className="mt-2"
                      style={{ backgroundColor: CHART_COLORS.warning, color: 'white' }}
                    >
                      S評価期待
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 総合評価トレンド */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">📊 評価トレンド分析</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-2">技術評価の推移</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(evaluationHistory[0].technicalScore / 50) * 100}%`,
                        backgroundColor: CHART_COLORS.success
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">{evaluationHistory[0].technicalScore}/50点</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-2">組織貢献の推移</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(evaluationHistory[0].contributionScore / 50) * 100}%`,
                        backgroundColor: CHART_COLORS.primary
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">{evaluationHistory[0].contributionScore}/50点</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function EvaluationReportTab({ selectedStaff }: { selectedStaff: any }): React.ReactElement {
  return (
    <div className={styles.evaluationReportContainer}>
      <div className={styles.reportSection}>
        <h2>評価分析レポート</h2>
        <div className={styles.reportTabs}>
          <div className={styles.reportTabContent}>
            <PersonalAnalysisReport />
          </div>
          <div className={styles.radarChartSection}>
            <h3>スキル評価レーダーチャート</h3>
            <StrengthWeaknessRadar />
          </div>
          <div className={styles.trainingEffectSection}>
            <h3>研修効果分析</h3>
            <TrainingEffectAnalysis />
          </div>
        </div>
      </div>
    </div>
  )
}

function ManagementLinksTab({ selectedStaff }: { selectedStaff: any }): React.ReactElement {
  return (
    <div className={styles.linksContainer}>
      <h2>統合管理リンク</h2>
      <div className={styles.linksGrid}>
        <a href="/dashboard" className={styles.linkCard}>
          <div className={styles.linkIcon}>📊</div>
          <h3>V3評価管理システム</h3>
          <p>統合評価システムでの詳細確認・管理</p>
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