'use client'

import React, { useState, useEffect } from 'react'
import CommonHeader from '@/components/CommonHeader'
import DashboardButton from '@/components/DashboardButton'
import Link from 'next/link'
import styles from './Evaluation.module.css'
import { 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Calendar,
  TrendingUp,
  Users,
  FileText,
  Settings,
  ChevronRight,
  Bell,
  BarChart3,
  Target,
  Award,
  BookOpen,
  ClipboardCheck,
  Download,
  Activity,
  Building,
  UserCheck,
  FileSpreadsheet,
  Calculator,
  ArrowRight
} from 'lucide-react'

// タスクの型定義
interface Task {
  type: 'urgent' | 'normal'
  title: string
  description: string
  link: string
  deadline: string
}

// 通知の型定義
interface Notification {
  id: number
  type: 'warning' | 'info' | 'success'
  message: string
  time: string
}

// タブ定義 - 2大評価フローを中心に再構成
const tabs = [
  { id: 'overview', label: '評価概要', icon: '🏠' },
  { id: 'technical', label: '技術評価フロー', icon: '🎯', badge: '50点' },
  { id: 'contribution', label: '貢献度評価フロー', icon: '🤝', badge: '50点' },
  { id: 'integration', label: '総合評価フロー', icon: '📊' },
  { id: 'settings', label: '設定・管理', icon: '⚙️' },
]

// 現在の月から評価タスクを判定
const getCurrentTasks = (): Task[] => {
  const currentMonth = new Date().getMonth() + 1
  const tasks: Task[] = []
  
  if (currentMonth === 3) {
    tasks.push({
      type: 'urgent',
      title: '技術評価実施',
      description: '年度末技術評価の入力期限が近づいています',
      link: '/evaluation/technical',
      deadline: '3月31日'
    })
    tasks.push({
      type: 'urgent',
      title: '総合評価準備',
      description: '年度末総合評価の準備を開始してください',
      link: '/evaluation/integrated',
      deadline: '3月末'
    })
  } else if (currentMonth === 7 || currentMonth === 8) {
    tasks.push({
      type: 'normal',
      title: '夏季賞与査定',
      description: '12～5月実績の組織貢献度評価を実施',
      link: '/evaluation/contribution',
      deadline: '8月15日'
    })
  } else if (currentMonth === 11 || currentMonth === 12) {
    tasks.push({
      type: 'normal',
      title: '冬季賞与査定',
      description: '6～11月実績の組織貢献度評価を実施',
      link: '/evaluation/contribution',
      deadline: '12月15日'
    })
  }
  
  return tasks
}

export default function EvaluationManagement() {
  const [activeTab, setActiveTab] = useState('overview')
  const [currentTasks, setCurrentTasks] = useState<Task[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [progressData, setProgressData] = useState({
    technical: 65,
    contribution: 80,
    integrated: 0
  })

  useEffect(() => {
    // 現在のタスクを設定
    setCurrentTasks(getCurrentTasks())
    
    // 通知を設定（モックデータ）
    setNotifications([
      { id: 1, type: 'warning', message: '技術評価の入力期限まであと5日です', time: '2時間前' },
      { id: 2, type: 'info', message: '新しい評価シートがアップロードされました', time: '昨日' },
      { id: 3, type: 'success', message: '看護部の評価が完了しました', time: '3日前' }
    ])
  }, [])

  return (
    <div>
      <CommonHeader title="評価管理" />
      
      <div className={styles.tabContainer}>
        {/* タブナビゲーション */}
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
              {tab.badge && <span className={styles.tabBadge}>{tab.badge}</span>}
            </button>
          ))}
        </div>

        {/* タブコンテンツ */}
        <div className={styles.tabContent}>
          {/* 評価概要タブ */}
          {activeTab === 'overview' && (
            <div className={styles.overviewContent}>
              {/* 2大評価フローの概要 */}
              <div className={styles.flowOverview}>
                <h2 className={styles.flowTitle}>年間評価フロー</h2>
                <div className={styles.flowCards}>
                  {/* 技術評価フロー */}
                  <div className={styles.flowCard}>
                    <div className={styles.flowHeader}>
                      <Target className={styles.flowIcon} />
                      <h3>技術評価（50点）</h3>
                    </div>
                    <div className={styles.flowTimeline}>
                      <div className={styles.timelineStep}>
                        <span className={styles.stepMonth}>3月</span>
                        <span className={styles.stepDesc}>年度末評価実施</span>
                      </div>
                    </div>
                    <div className={styles.flowDetails}>
                      <p>職種別の専門技術・スキルを評価</p>
                      <ul>
                        <li>上司評価（60%）</li>
                        <li>自己評価（40%）</li>
                        <li>360度評価（管理職）</li>
                      </ul>
                    </div>
                    <Link href="/evaluation/technical" className={styles.flowAction}>
                      評価を開始 <ChevronRight size={16} />
                    </Link>
                  </div>

                  {/* 貢献度評価フロー */}
                  <div className={styles.flowCard}>
                    <div className={styles.flowHeader}>
                      <Users className={styles.flowIcon} />
                      <h3>貢献度評価（50点）</h3>
                    </div>
                    <div className={styles.flowTimeline}>
                      <div className={styles.timelineStep}>
                        <span className={styles.stepMonth}>8月</span>
                        <span className={styles.stepDesc}>夏季査定</span>
                      </div>
                      <div className={styles.timelineStep}>
                        <span className={styles.stepMonth}>12月</span>
                        <span className={styles.stepDesc}>冬季査定</span>
                      </div>
                    </div>
                    <div className={styles.flowDetails}>
                      <p>組織への貢献度を相対評価</p>
                      <ul>
                        <li>施設貢献（25点）</li>
                        <li>法人貢献（25点）</li>
                        <li>年2回の査定で評価</li>
                      </ul>
                    </div>
                    <Link href="/evaluation/contribution" className={styles.flowAction}>
                      評価を開始 <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* 現在のタスクと進捗 */}
              <div className={styles.overviewGrid}>
                <div className={styles.taskWidget}>
                  <h3><Clock size={20} /> 今月のタスク</h3>
                  {currentTasks.length > 0 ? (
                    <div className={styles.taskList}>
                      {currentTasks.map((task, index) => (
                        <Link key={index} href={task.link} className={styles.taskItem}>
                          <span className={styles.taskTitle}>{task.title}</span>
                          <span className={styles.taskDeadline}>{task.deadline}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.noTasks}>現在のタスクはありません</p>
                  )}
                </div>

                <div className={styles.progressWidget}>
                  <h3><BarChart3 size={20} /> 評価進捗</h3>
                  <div className={styles.progressItems}>
                    <div className={styles.progressItem}>
                      <span>技術評価</span>
                      <div className={styles.progressBar}>
                        <div style={{ width: `${progressData.technical}%` }} />
                      </div>
                      <span>{progressData.technical}%</span>
                    </div>
                    <div className={styles.progressItem}>
                      <span>貢献度評価</span>
                      <div className={styles.progressBar}>
                        <div style={{ width: `${progressData.contribution}%` }} />
                      </div>
                      <span>{progressData.contribution}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 技術評価フロータブ */}
          {activeTab === 'technical' && (
            <div className={styles.technicalContent}>
              <div className={styles.flowSection}>
                <h2>技術評価フロー（年間50点）</h2>
                <p className={styles.flowDescription}>
                  3月に実施する年度末評価。職種別の専門技術・スキルを評価します。
                </p>

                {/* プロセスフロー */}
                <div className={styles.processFlow}>
                  <div className={styles.processStep}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                      <h4>評価シート選択</h4>
                      <p>職種・経験年数に応じた評価シートを選択</p>
                      <Link href="/evaluation-sheets" className={styles.stepLink}>
                        シート一覧へ <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>

                  <div className={styles.processStep}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                      <h4>自己評価入力</h4>
                      <p>本人による自己評価（配点の40%）</p>
                      <Link href="/evaluation/technical/self" className={styles.stepLink}>
                        入力画面へ <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>

                  <div className={styles.processStep}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                      <h4>上司評価入力</h4>
                      <p>上司による評価（配点の60%）</p>
                      <Link href="/evaluation/technical/supervisor" className={styles.stepLink}>
                        入力画面へ <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>

                  <div className={styles.processStep}>
                    <div className={styles.stepNumber}>4</div>
                    <div className={styles.stepContent}>
                      <h4>評価確定</h4>
                      <p>評価内容の確認と確定処理</p>
                      <Link href="/evaluation/technical/confirm" className={styles.stepLink}>
                        確認画面へ <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* 関連機能 */}
                <div className={styles.relatedFeatures}>
                  <h3>関連機能</h3>
                  <div className={styles.featureGrid}>
                    <Link href="/evaluation/config" className={styles.featureCard}>
                      <Settings size={24} />
                      <span>評価項目設定</span>
                    </Link>
                    <Link href="/evaluation/analytics" className={styles.featureCard}>
                      <BarChart3 size={24} />
                      <span>評価分析</span>
                    </Link>
                    <Link href="/evaluation/history" className={styles.featureCard}>
                      <FileText size={24} />
                      <span>過去の評価</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 貢献度評価フロータブ */}
          {activeTab === 'contribution' && (
            <div className={styles.contributionContent}>
              <div className={styles.flowSection}>
                <h2>貢献度評価フロー（年間50点）</h2>
                <p className={styles.flowDescription}>
                  年2回の賞与査定時に実施。施設・法人への貢献度を相対評価します。
                </p>

                {/* 年間スケジュール */}
                <div className={styles.yearSchedule}>
                  <div className={styles.scheduleCard}>
                    <div className={styles.scheduleHeader} style={{ backgroundColor: '#e3f2fd' }}>
                      <Calendar size={24} />
                      <h3>夏季賞与査定（8月）</h3>
                    </div>
                    <div className={styles.scheduleBody}>
                      <p className={styles.schedulePeriod}>評価対象期間：12月～5月</p>
                      <div className={styles.scoreBreakdown}>
                        <div className={styles.scoreItem}>
                          <Building size={18} />
                          <span>施設貢献度：12.5点</span>
                        </div>
                        <div className={styles.scoreItem}>
                          <Users size={18} />
                          <span>法人貢献度：12.5点</span>
                        </div>
                      </div>
                      <Link href="/evaluation/contribution" className={styles.scheduleAction}>
                        査定入力へ <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>

                  <div className={styles.scheduleCard}>
                    <div className={styles.scheduleHeader} style={{ backgroundColor: '#e8f5e9' }}>
                      <Calendar size={24} />
                      <h3>冬季賞与査定（12月）</h3>
                    </div>
                    <div className={styles.scheduleBody}>
                      <p className={styles.schedulePeriod}>評価対象期間：6月～11月</p>
                      <div className={styles.scoreBreakdown}>
                        <div className={styles.scoreItem}>
                          <Building size={18} />
                          <span>施設貢献度：12.5点</span>
                        </div>
                        <div className={styles.scoreItem}>
                          <Users size={18} />
                          <span>法人貢献度：12.5点</span>
                        </div>
                      </div>
                      <Link href="/evaluation/contribution" className={styles.scheduleAction}>
                        査定入力へ <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* 評価項目 */}
                <div className={styles.evaluationItems}>
                  <h3>評価項目</h3>
                  <div className={styles.itemsGrid}>
                    <div className={styles.itemCategory}>
                      <h4><Building size={20} /> 施設貢献（年間25点）</h4>
                      <ul>
                        <li>委員会活動</li>
                        <li>研修参加・講師</li>
                        <li>改善提案・QC活動</li>
                        <li>新人指導・プリセプター</li>
                        <li>時間外協力</li>
                      </ul>
                    </div>
                    <div className={styles.itemCategory}>
                      <h4><Users size={20} /> 法人貢献（年間25点）</h4>
                      <ul>
                        <li>法人行事参加</li>
                        <li>他施設応援</li>
                        <li>法人プロジェクト参加</li>
                        <li>採用活動協力</li>
                        <li>広報活動協力</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 相対評価の説明 */}
                <div className={styles.relativeEvaluation}>
                  <h3>相対評価の仕組み</h3>
                  <p>各施設・職種内で順位付けを行い、パーセンタイルに基づいて配点します。</p>
                  <div className={styles.percentileTable}>
                    <table>
                      <thead>
                        <tr>
                          <th>順位</th>
                          <th>配点（12.5点満点）</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>上位10%</td>
                          <td>12.5点</td>
                        </tr>
                        <tr>
                          <td>上位20%</td>
                          <td>11.25点</td>
                        </tr>
                        <tr>
                          <td>上位30%</td>
                          <td>10点</td>
                        </tr>
                        <tr>
                          <td>上位50%</td>
                          <td>7.5点</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 総合評価フロータブ */}
          {activeTab === 'integration' && (
            <div className={styles.integrationContent}>
              <div className={styles.integrationSection}>
                <h2>統合評価（3月末実施）</h2>
                <p className={styles.integrationDescription}>
                  技術評価と貢献度評価を統合し、最終的な評価グレードを決定します。
                </p>

                {/* 統合プロセス */}
                <div className={styles.integrationProcess}>
                  <div className={styles.scoreComponents}>
                    <div className={styles.componentCard}>
                      <h3>技術評価</h3>
                      <div className={styles.componentScore}>50点</div>
                      <p>3月実施</p>
                    </div>
                    <div className={styles.plusSign}>+</div>
                    <div className={styles.componentCard}>
                      <h3>施設貢献</h3>
                      <div className={styles.componentScore}>25点</div>
                      <p>夏12.5 + 冬12.5</p>
                    </div>
                    <div className={styles.plusSign}>+</div>
                    <div className={styles.componentCard}>
                      <h3>法人貢献</h3>
                      <div className={styles.componentScore}>25点</div>
                      <p>夏12.5 + 冬12.5</p>
                    </div>
                    <div className={styles.equalsSign}>=</div>
                    <div className={styles.componentCard} style={{ backgroundColor: '#f5f5f5' }}>
                      <h3>総合評価</h3>
                      <div className={styles.componentScore}>100点</div>
                      <p>最終グレード</p>
                    </div>
                  </div>
                </div>

                {/* 2軸評価判定 */}
                <div className={styles.gradeMatrix}>
                  <h3>2軸評価システム</h3>
                  <div className={styles.evaluationSteps}>
                    <div className={styles.stepCard}>
                      <div className={styles.stepNumber}>1</div>
                      <h4>100点満点で集計</h4>
                      <p>技術50点 + 施設貢献25点 + 法人貢献25点</p>
                    </div>
                    <div className={styles.stepArrow}>→</div>
                    <div className={styles.stepCard}>
                      <div className={styles.stepNumber}>2</div>
                      <h4>同職種内で順位化</h4>
                      <p>施設内・法人内それぞれで相対評価</p>
                    </div>
                    <div className={styles.stepArrow}>→</div>
                    <div className={styles.stepCard}>
                      <div className={styles.stepNumber}>3</div>
                      <h4>5段階評価</h4>
                      <p>S(上位10%) A(11-30%) B(31-70%) C(71-90%) D(下位10%)</p>
                    </div>
                  </div>
                  
                  <h4 style={{ marginTop: '20px' }}>最終評価マトリックス</h4>
                  <table className={styles.matrixTable}>
                    <thead>
                      <tr>
                        <th>法人内＼施設内</th>
                        <th>D</th>
                        <th>C</th>
                        <th>B</th>
                        <th>A</th>
                        <th>S</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className={styles.gradeS}>S</td>
                        <td className={styles.gradeA}>A</td>
                        <td className={styles.gradeAPlus}>A+</td>
                        <td className={styles.gradeS}>S</td>
                        <td className={styles.gradeS}>S</td>
                        <td className={styles.gradeSPlus}>S+</td>
                      </tr>
                      <tr>
                        <td className={styles.gradeA}>A</td>
                        <td className={styles.gradeB}>B</td>
                        <td className={styles.gradeA}>A</td>
                        <td className={styles.gradeA}>A</td>
                        <td className={styles.gradeAPlus}>A+</td>
                        <td className={styles.gradeS}>S</td>
                      </tr>
                      <tr>
                        <td className={styles.gradeB}>B</td>
                        <td className={styles.gradeC}>C</td>
                        <td className={styles.gradeB}>B</td>
                        <td className={styles.gradeB}>B</td>
                        <td className={styles.gradeA}>A</td>
                        <td className={styles.gradeAPlus}>A+</td>
                      </tr>
                      <tr>
                        <td className={styles.gradeC}>C</td>
                        <td className={styles.gradeD}>D</td>
                        <td className={styles.gradeC}>C</td>
                        <td className={styles.gradeC}>C</td>
                        <td className={styles.gradeB}>B</td>
                        <td className={styles.gradeA}>A</td>
                      </tr>
                      <tr>
                        <td className={styles.gradeD}>D</td>
                        <td className={styles.gradeD}>D</td>
                        <td className={styles.gradeD}>D</td>
                        <td className={styles.gradeC}>C</td>
                        <td className={styles.gradeC}>C</td>
                        <td className={styles.gradeB}>B</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className={styles.matrixNote}>
                    最終評価：7段階（S+, S, A+, A, B, C, D）
                  </p>
                </div>

                {/* 実行ボタン */}
                <div className={styles.integrationActions}>
                  <Link href="/evaluation/batch" className={styles.primaryAction}>
                    <Calculator size={20} />
                    バッチ処理実行
                  </Link>
                  <Link href="/evaluation/reports" className={styles.secondaryAction}>
                    <Download size={20} />
                    レポート出力
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* 設定・管理タブ */}
          {activeTab === 'settings' && (
            <div className={styles.settingsContent}>
              <div className={styles.settingsGrid}>
                <Link href="/evaluation/config" className={styles.settingsCard}>
                  <div className={styles.settingsIcon}>
                    <Settings size={36} color="#1976d2" />
                  </div>
                  <div className={styles.settingsInfo}>
                    <h3>評価項目管理</h3>
                    <p>大項目・中項目・小項目の設定</p>
                    <span className={styles.settingsAction}>設定する →</span>
                  </div>
                </Link>

                <Link href="/evaluation/config" className={styles.settingsCard}>
                  <div className={styles.settingsIcon}>
                    <Target size={36} color="#388e3c" />
                  </div>
                  <div className={styles.settingsInfo}>
                    <h3>配点設定</h3>
                    <p>評価項目の配点と重み付け</p>
                    <span className={styles.settingsAction}>設定する →</span>
                  </div>
                </Link>

                <Link href="/evaluation/config" className={styles.settingsCard}>
                  <div className={styles.settingsIcon}>
                    <FileText size={36} color="#f57c00" />
                  </div>
                  <div className={styles.settingsInfo}>
                    <h3>Excel管理</h3>
                    <p>Excelテンプレートのインポート・エクスポート</p>
                    <span className={styles.settingsAction}>管理する →</span>
                  </div>
                </Link>

                <Link href="/evaluation/config" className={styles.settingsCard}>
                  <div className={styles.settingsIcon}>
                    <Users size={36} color="#7b1fa2" />
                  </div>
                  <div className={styles.settingsInfo}>
                    <h3>権限管理</h3>
                    <p>評価入力・閲覧権限の設定</p>
                    <span className={styles.settingsAction}>設定する →</span>
                  </div>
                </Link>

                <Link href="/education" className={styles.settingsCard}>
                  <div className={styles.settingsIcon}>
                    <BookOpen size={36} color="#00796b" />
                  </div>
                  <div className={styles.settingsInfo}>
                    <h3>教育連携</h3>
                    <p>評価と教育研修の連携設定</p>
                    <span className={styles.settingsAction}>設定する →</span>
                  </div>
                </Link>

                <Link href="/evaluation/analytics" className={styles.settingsCard}>
                  <div className={styles.settingsIcon}>
                    <BarChart3 size={36} color="#c2185b" />
                  </div>
                  <div className={styles.settingsInfo}>
                    <h3>分析・レポート</h3>
                    <p>評価データの分析とレポート出力</p>
                    <span className={styles.settingsAction}>分析する →</span>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <DashboardButton />
    </div>
  )
}