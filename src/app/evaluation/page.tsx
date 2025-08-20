'use client';

import React, { useState, useEffect } from 'react';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import Link from 'next/link';
import styles from './Evaluation.module.css';
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
  ArrowRight,
  Badge,
  MessageSquare,
  FileCheck
} from 'lucide-react';

// タスクの型定義
interface Task {
  type: 'urgent' | 'normal';
  title: string;
  description: string;
  link: string;
  deadline: string;
}

// 通知の型定義
interface Notification {
  id: number;
  type: 'warning' | 'info' | 'success';
  message: string;
  time: string;
}

// タブ定義
const tabs = [
  { id: 'overview', label: '評価概要', icon: '🏠' },
  { id: 'guide', label: 'ガイド', icon: '❓', isNew: true },
  { id: 'review', label: '評価確認', icon: '👁️', isNew: true },
  { id: 'settings', label: '設定・管理', icon: '⚙️' },
];

// 現在の月から評価タスクを判定
const getCurrentTasks = (): Task[] => {
  const currentMonth = new Date().getMonth() + 1;
  const tasks: Task[] = [];
  
  if (currentMonth === 3) {
    tasks.push({
      type: 'urgent',
      title: '技術評価実施',
      description: '年度末技術評価の入力期限が近づいています',
      link: '/evaluation/technical',
      deadline: '3月31日'
    });
  }
  
  return tasks;
};

export default function EvaluationManagement() {
  const [activeTab, setActiveTab] = useState('guide');
  const [currentTasks, setCurrentTasks] = useState<Task[]>([]);
  const [progressData, setProgressData] = useState({
    technical: 65,
    contribution: 80,
    integrated: 0
  });

  useEffect(() => {
    setCurrentTasks(getCurrentTasks());
  }, []);

  return (
    <div>
      <CommonHeader title="評価管理" />
      
      <div className={styles.container}>
        {/* タブナビゲーション */}
        <div className={styles.tabNavigation}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>
                {tab.label}
                {tab.isNew && <span className={styles.newBadge}>New</span>}
              </span>
            </button>
          ))}
        </div>

        {/* タブコンテンツ */}
        <div className={styles.tabContent}>
          {/* 評価概要タブ */}
          {activeTab === 'overview' && (
            <div className={styles.overviewContent}>
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
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ガイドタブ */}
          {activeTab === 'guide' && (
            <div className={styles.guideContent}>
              {/* ヒーローセクション：1年目職員でも一目で分かる全体像 */}
              <section className={styles.heroSection}>
                <div className={styles.heroHeader}>
                  <h1 className={styles.heroTitle}>
                    <span className={styles.heroEmoji}>🌟</span>
                    新人さん必見！あなたの評価はこう決まる
                  </h1>
                  <p className={styles.heroSubtitle}>
                    1年目でもわかる！人事評価の全てをストーリーで解説
                  </p>
                </div>
                
                {/* アニメーション付き年間タイムライン */}
                <div className={styles.annualTimeline}>
                  <h2 className={styles.timelineTitle}>📅 1年間の評価スケジュール</h2>
                  <div className={styles.timelineContainer}>
                    <div className={styles.timelineTrack}>
                      <div className={styles.timelineItem} data-month="4月">
                        <div className={styles.timelineMarker}></div>
                        <div className={styles.timelineContent}>
                          <h3>入職・目標設定</h3>
                          <p>あなたの成長目標を決めます</p>
                        </div>
                      </div>
                      <div className={styles.timelineItem} data-month="9月">
                        <div className={styles.timelineMarker}></div>
                        <div className={styles.timelineContent}>
                          <h3>中間評価</h3>
                          <p>組織貢献度を確認</p>
                        </div>
                      </div>
                      <div className={styles.timelineItem} data-month="3月">
                        <div className={styles.timelineMarker}></div>
                        <div className={styles.timelineContent}>
                          <h3>年度末評価</h3>
                          <p>技術評価＋最終結果</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* インタラクティブシミュレーター */}
              <section className={styles.simulatorSection}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.sectionEmoji}>🎯</span>
                  あなたの評価点をシミュレーション
                </h2>
                <div className={styles.simulatorContainer}>
                  <div className={styles.simulatorInputs}>
                    <div className={styles.inputGroup}>
                      <label>技術評価（50点満点）</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="50" 
                        defaultValue="35"
                        className={styles.rangeSlider}
                        id="technicalScore"
                      />
                      <span className={styles.scoreDisplay}>35点</span>
                    </div>
                    <div className={styles.inputGroup}>
                      <label>組織貢献度（50点満点）</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="50" 
                        defaultValue="30"
                        className={styles.rangeSlider}
                        id="contributionScore"
                      />
                      <span className={styles.scoreDisplay}>30点</span>
                    </div>
                  </div>
                  <div className={styles.simulatorResult}>
                    <div className={styles.totalScore}>
                      <span className={styles.scoreNumber}>65</span>
                      <span className={styles.scoreLabel}>点 / 100点</span>
                    </div>
                    <div className={styles.scoreGrade}>B評価</div>
                  </div>
                </div>
              </section>

              {/* 配点ロジックの視覚的説明 */}
              <section className={styles.scoringLogicSection}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.sectionEmoji}>📊</span>
                  点数の決まり方を理解しよう
                </h2>
                
                <div className={styles.scoringCards}>
                  <div className={styles.scoringCard}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardIcon}>🎯</span>
                      <h3>技術評価（50点）</h3>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.scoreBreakdown}>
                        <div className={styles.breakdownItem}>
                          <span className={styles.itemLabel}>法人統一項目</span>
                          <span className={styles.itemScore}>30点</span>
                        </div>
                        <div className={styles.breakdownItem}>
                          <span className={styles.itemLabel}>施設特有項目</span>
                          <span className={styles.itemScore}>20点</span>
                        </div>
                      </div>
                      <div className={styles.whyExplanation}>
                        <h4>なぜ？</h4>
                        <p>どの施設でも必要なスキル（30点）と、あなたの職場特有のスキル（20点）で評価します</p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.scoringCard}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardIcon}>🤝</span>
                      <h3>組織貢献度（50点）</h3>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.scoreBreakdown}>
                        <div className={styles.breakdownItem}>
                          <span className={styles.itemLabel}>上司評価</span>
                          <span className={styles.itemScore}>70%</span>
                        </div>
                        <div className={styles.breakdownItem}>
                          <span className={styles.itemLabel}>自己評価</span>
                          <span className={styles.itemScore}>30%</span>
                        </div>
                      </div>
                      <div className={styles.whyExplanation}>
                        <h4>なぜ？</h4>
                        <p>客観的な視点（上司）と主観的な振り返り（自分）のバランスを取ります</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* FAQ セクション - 1年目職員の疑問に答える */}
              <section className={styles.faqSection}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.sectionEmoji}>❓</span>
                  新人さんからよくある質問
                </h2>
                
                <div className={styles.faqContainer}>
                  <details className={styles.faqItem}>
                    <summary className={styles.faqQuestion}>
                      Q1. 入職1年目でも他の職員と同じ評価基準ですか？
                    </summary>
                    <div className={styles.faqAnswer}>
                      <p><strong>A.</strong> いえ、経験年数に応じて評価基準は調整されます。1年目は「基本的な業務ができる」レベルが求められ、ベテランと比較されることはありません。</p>
                    </div>
                  </details>

                  <details className={styles.faqItem}>
                    <summary className={styles.faqQuestion}>
                      Q2. 自己評価が低すぎると総合評価に悪影響しますか？
                    </summary>
                    <div className={styles.faqAnswer}>
                      <p><strong>A.</strong> 謙遜しすぎる必要はありません。自己評価は30%の重みですし、正直な自己分析が成長につながります。</p>
                    </div>
                  </details>

                  <details className={styles.faqItem}>
                    <summary className={styles.faqQuestion}>
                      Q3. 評価結果はいつ、どのように知らされますか？
                    </summary>
                    <div className={styles.faqAnswer}>
                      <p><strong>A.</strong> 年度末評価は4月中旬、中間評価は10月中旬に個人面談で結果をお伝えします。その後、希望者にはフィードバック面談も実施します。</p>
                    </div>
                  </details>

                  <details className={styles.faqItem}>
                    <summary className={styles.faqQuestion}>
                      Q4. 評価に納得がいかない場合はどうすればいいですか？
                    </summary>
                    <div className={styles.faqAnswer}>
                      <p><strong>A.</strong> 評価開示後2週間以内であれば異議申し立てが可能です。人事部に相談してください。透明性を重視していますので、遠慮なくお声かけください。</p>
                    </div>
                  </details>

                  <details className={styles.faqItem}>
                    <summary className={styles.faqQuestion}>
                      Q5. 他の職員の評価結果と比較されますか？
                    </summary>
                    <div className={styles.faqAnswer}>
                      <p><strong>A.</strong> 基本的には絶対評価（決められた基準との比較）ですが、賞与査定時には一部相対評価も行います。ただし、同期入職者同士での比較が中心で、ベテランとは比較されません。</p>
                    </div>
                  </details>
                </div>
              </section>
            </div>
          )}

          {/* 評価確認タブ */}
          {activeTab === 'review' && (
            <div className={styles.reviewContent}>
              <div className={styles.reviewHeader}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.sectionEmoji}>👁️</span>
                  評価確認（Review）
                </h2>
                <p className={styles.sectionDescription}>
                  上司評価と自己評価を比較し、評価の妥当性を確認します
                </p>
              </div>

              <div className={styles.reviewActions}>
                <Link href="/evaluation-review" className={styles.reviewCard}>
                  <div className={styles.reviewIcon}>
                    <UserCheck size={36} color="#1976d2" />
                  </div>
                  <div className={styles.reviewInfo}>
                    <h3>評価確認画面へ</h3>
                    <p>上司評価と自己評価の比較・確認</p>
                    <span className={styles.reviewBadge}>NEW</span>
                  </div>
                  <ChevronRight className={styles.chevronIcon} />
                </Link>

                <div className={styles.reviewFeatures}>
                  <h3>主な機能</h3>
                  <ul className={styles.featureList}>
                    <li>
                      <CheckCircle size={20} className={styles.featureIcon} />
                      <span>上司評価と自己評価の並列表示</span>
                    </li>
                    <li>
                      <BarChart3 size={20} className={styles.featureIcon} />
                      <span>評価差異の可視化とアラート</span>
                    </li>
                    <li>
                      <MessageSquare size={20} className={styles.featureIcon} />
                      <span>評価に関するコメント機能</span>
                    </li>
                    <li>
                      <FileCheck size={20} className={styles.featureIcon} />
                      <span>評価確認と承認フロー</span>
                    </li>
                  </ul>
                </div>

                <div className={styles.reviewStats}>
                  <h3>現在の状況</h3>
                  <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                      <div className={styles.statNumber}>12</div>
                      <div className={styles.statLabel}>確認待ち</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statNumber}>5</div>
                      <div className={styles.statLabel}>大幅差あり</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statNumber}>8</div>
                      <div className={styles.statLabel}>承認済み</div>
                    </div>
                  </div>
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
              </div>
            </div>
          )}
        </div>
      </div>
      
      <DashboardButton />
    </div>
  );
}
