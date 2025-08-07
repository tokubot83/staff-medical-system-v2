'use client'

import React, { useState } from 'react'
import CommonHeader from '@/components/CommonHeader'
import Link from 'next/link'
import styles from './Evaluation.module.css'

const tabs = [
  { id: 'overview', label: '評価概要', icon: '📊' },
  { id: 'newSystem', label: '新評価システム', icon: '🆕' },
  { id: 'education', label: '教育・研修連携', icon: '📚' },
]

export default function EvaluationPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div>
      <CommonHeader title="人事評価管理" />
      
      <div className={styles.container}>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.content}>
          {activeTab === 'overview' && (
            <div className={styles.overview}>
              <h2>年間評価スケジュール</h2>
              <div className={styles.scheduleGrid}>
                <div className={styles.scheduleCard}>
                  <h3>📅 3月 - 技術評価</h3>
                  <p>年度末の技術評価実施</p>
                  <ul>
                    <li>専門技術・スキル（10点）</li>
                    <li>対人関係・ケア（10点）</li>
                    <li>安全・品質管理（10点）</li>
                    <li>施設特化項目（20点）</li>
                  </ul>
                </div>
                <div className={styles.scheduleCard}>
                  <h3>💰 8月 - 夏季賞与査定</h3>
                  <p>12～5月実績の組織貢献度評価</p>
                  <ul>
                    <li>施設貢献度（12.5点）</li>
                    <li>法人貢献度（12.5点）</li>
                  </ul>
                </div>
                <div className={styles.scheduleCard}>
                  <h3>💰 12月 - 冬季賞与査定</h3>
                  <p>6～11月実績の組織貢献度評価</p>
                  <ul>
                    <li>施設貢献度（12.5点）</li>
                    <li>法人貢献度（12.5点）</li>
                  </ul>
                </div>
                <div className={styles.scheduleCard}>
                  <h3>🎯 3月末 - 総合評価</h3>
                  <p>年度末の最終評価判定</p>
                  <ul>
                    <li>技術評価（50点）</li>
                    <li>年間組織貢献度（50点）</li>
                    <li>相対評価による最終判定</li>
                  </ul>
                </div>
              </div>

              <div className={styles.evaluationSystem}>
                <h2>評価体系</h2>
                <div className={styles.systemInfo}>
                  <div className={styles.infoCard}>
                    <h4>5段階評価</h4>
                    <p>S, A, B, C, D（拡張グレード: S+, A+）</p>
                  </div>
                  <div className={styles.infoCard}>
                    <h4>2軸評価マトリクス</h4>
                    <p>施設評価 × 法人評価</p>
                  </div>
                  <div className={styles.infoCard}>
                    <h4>相対評価</h4>
                    <p>職種別・施設別のパーセンタイル順位</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'newSystem' && (
            <div className={styles.newSystemContent}>
              <h2>新評価システム</h2>
              <div className={styles.navigationGrid}>
                <Link href="/evaluation/technical" className={styles.navCard}>
                  <div className={styles.navIcon}>📝</div>
                  <h3>技術評価入力</h3>
                  <p>年次技術評価の実施</p>
                </Link>
                
                <Link href="/evaluation/contribution" className={styles.navCard}>
                  <div className={styles.navIcon}>🏢</div>
                  <h3>組織貢献度入力</h3>
                  <p>半期ごとの貢献度査定</p>
                </Link>
                
                <Link href="/evaluation/integrated" className={styles.navCard}>
                  <div className={styles.navIcon}>🎯</div>
                  <h3>統合評価</h3>
                  <p>年度末総合評価</p>
                </Link>
                
                <Link href="/evaluation/batch" className={styles.navCard}>
                  <div className={styles.navIcon}>⚙️</div>
                  <h3>バッチ処理</h3>
                  <p>年度末一括計算処理</p>
                </Link>
                
                <Link href="/evaluation/analytics" className={styles.navCard}>
                  <div className={styles.navIcon}>📊</div>
                  <h3>分析・レポート</h3>
                  <p>評価結果の分析</p>
                </Link>
                
                <Link href="/evaluation/history" className={styles.navCard}>
                  <div className={styles.navIcon}>📚</div>
                  <h3>評価履歴</h3>
                  <p>過去の評価記録</p>
                </Link>
                
                <Link href="/evaluation/config" className={styles.navCard}>
                  <div className={styles.navIcon}>⚙️</div>
                  <h3>評価項目設定</h3>
                  <p>評価基準の管理</p>
                </Link>
                
                <Link href="/evaluation/reports" className={styles.navCard}>
                  <div className={styles.navIcon}>📄</div>
                  <h3>レポート出力</h3>
                  <p>Excel/PDF出力</p>
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className={styles.educationContent}>
              <h2>教育・研修連携</h2>
              <div className={styles.navigationGrid}>
                <Link href="/education" className={styles.navCard}>
                  <div className={styles.navIcon}>🎓</div>
                  <h3>教育研修管理</h3>
                  <p>研修プログラムの管理</p>
                </Link>
                
                <Link href="/education/planning" className={styles.navCard}>
                  <div className={styles.navIcon}>📅</div>
                  <h3>年間研修計画</h3>
                  <p>研修スケジュール管理</p>
                </Link>
                
                <Link href="/education/tracking" className={styles.navCard}>
                  <div className={styles.navIcon}>👥</div>
                  <h3>受講管理</h3>
                  <p>個人別研修履歴</p>
                </Link>
                
                <Link href="/evaluation/config" className={styles.navCard}>
                  <div className={styles.navIcon}>🔗</div>
                  <h3>評価項目マッピング</h3>
                  <p>評価と研修の連携設定</p>
                </Link>
              </div>

              <div className={styles.integrationInfo}>
                <h3>システム連携の特徴</h3>
                <ul>
                  <li>評価結果に基づく自動研修推奨</li>
                  <li>研修受講履歴の評価への反映</li>
                  <li>スキルギャップ分析と育成計画</li>
                  <li>教育師長による統合管理</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}