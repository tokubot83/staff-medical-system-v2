// V3評価システム対応版のEvaluationTab
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PersonalEvaluationService } from '@/services/evaluationV3Service'
import { V3PersonalEvaluation } from '@/types/evaluation-v3'
import styles from './StaffCards.module.css'

// V3評価システム用のカラーパレット
const v3Colors = {
  technical: {
    main: '#007bff',
    light: '#6cb2ff',
    dark: '#0056b3'
  },
  contribution: {
    main: '#28a745', 
    light: '#71dd7a',
    dark: '#1e7e34'
  },
  combined: {
    main: '#dc3545',
    light: '#ff6b7a',
    dark: '#a71e2a'
  },
  provisional: {
    main: '#ffc107',
    light: '#ffd43b',
    dark: '#d39e00'
  }
}

// V3グレード定義
const v3Grades = {
  'S+': { color: '#8B0000', label: 'S+（超優秀）', min: 95 },
  'S': { color: '#FF0000', label: 'S（卓越）', min: 90 },
  'A+': { color: '#FF4500', label: 'A+（優秀+）', min: 85 },
  'A': { color: '#FFA500', label: 'A（優秀）', min: 80 },
  'B': { color: '#32CD32', label: 'B（良好）', min: 70 },
  'C': { color: '#1E90FF', label: 'C（普通）', min: 60 },
  'D': { color: '#808080', label: 'D（要改善）', min: 0 }
}

export function EvaluationTab({ selectedStaff }: { selectedStaff: any }) {
  const router = useRouter()
  const [activeEvaluationTab, setActiveEvaluationTab] = useState('overview')
  const [v3Evaluation, setV3Evaluation] = useState<V3PersonalEvaluation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentProvisionalEvaluation, setCurrentProvisionalEvaluation] = useState<any>(null)
  
  if (!selectedStaff) {
    return (
      <div className={styles.noDataContainer}>
        <p>職員を選択してください</p>
      </div>
    )
  }

  // V3評価データの取得
  useEffect(() => {
    const loadV3Evaluation = async () => {
      try {
        setIsLoading(true)
        
        // 最新の評価データを取得（モック実装）
        const mockV3Evaluation: V3PersonalEvaluation = {
          id: `eval_${selectedStaff.id}_2024`,
          staffId: selectedStaff.id,
          staffName: selectedStaff.name,
          evaluationPeriod: '2024年度',
          experienceLevel: 'midlevel',
          experienceLabel: '中堅',
          technicalScore: {
            coreItems: 42,
            facilityItems: 38,
            total: 80
          },
          contributionScore: {
            facility: 85,
            corporate: 78,
            total: 81.5
          },
          totalScore: 81.25,
          grade: 'A',
          status: 'completed'
        }
        
        // 現在の時期に応じた暫定評価を設定
        const currentMonth = new Date().getMonth() + 1
        let provisionalEvaluation = null
        
        if (currentMonth >= 6 && currentMonth <= 8) {
          // 夏季組織貢献度評価期間
          provisionalEvaluation = {
            type: 'summer',
            title: '夏季組織貢献度評価（暫定）',
            facilityScore: 82,
            corporateScore: 76,
            status: 'provisional'
          }
        } else if (currentMonth >= 12 || currentMonth <= 2) {
          // 冬季組織貢献度評価期間
          provisionalEvaluation = {
            type: 'winter',
            title: '冬季組織貢献度評価（暫定）',
            facilityScore: 78,
            corporateScore: 80,
            status: 'provisional'
          }
        }
        
        setV3Evaluation(mockV3Evaluation)
        setCurrentProvisionalEvaluation(provisionalEvaluation)
        
      } catch (error) {
        console.error('V3評価データの取得に失敗:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (selectedStaff?.id) {
      loadV3Evaluation()
    }
  }, [selectedStaff?.id])

  const handleEvaluationInput = () => {
    router.push(`/evaluation?tab=execution&staffId=${selectedStaff.id}`)
  }
  
  // タブの定義
  const evaluationTabs = [
    { id: 'overview', label: '概要', icon: '📊' }
  ]

  return (
    <div className={styles.tabContentSection}>
      <div className={styles.sectionHeader}>
        <h2>📊 人事評価・成長分析（V3システム）</h2>
        <div className={styles.sectionActions}>
          <button className={styles.actionButton} onClick={handleEvaluationInput}>評価入力</button>
          <button className={styles.actionButtonSecondary}>評価履歴</button>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className={styles.tabNavigation} style={{ marginBottom: '20px' }}>
        {evaluationTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveEvaluationTab(tab.id)}
            className={`${styles.tabButton} ${activeEvaluationTab === tab.id ? styles.active : ''}`}
            style={{ fontSize: '14px', padding: '8px 16px' }}
          >
            <span style={{ marginRight: '4px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* タブコンテンツ */}
      {activeEvaluationTab === 'overview' && (
        <div>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <p>評価データを読み込み中...</p>
            </div>
          ) : (
            <>
              <div className={styles.interviewSummaryEnhanced}>
                <div className={styles.summaryMainCard}>
                  <div className={styles.summaryCardHeader}>
                    <span className={styles.summaryIcon}>📊</span>
                    <h3>最新人事評価（V3システム）</h3>
                    <div className={styles.evaluationSystem}>
                      <span className={styles.systemBadge}>100点満点制</span>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '24px' }}>
                    <div className={styles.evaluationSummary}>
                      <div className={styles.evaluationScores}>
                        <div className={styles.scoreItemV3}>
                          <span className={styles.scoreLabel}>技術評価</span>
                          <div className={styles.scoreBreakdown}>
                            <span className={styles.scoreValue}>{v3Evaluation?.technicalScore?.total || 80}点</span>
                            <span className={styles.scoreDetail}>
                              （法人統一 {v3Evaluation?.technicalScore?.coreItems || 42}点 + 施設固有 {v3Evaluation?.technicalScore?.facilityItems || 38}点）
                            </span>
                          </div>
                        </div>
                        <div className={styles.scoreItemV3}>
                          <span className={styles.scoreLabel}>組織貢献度</span>
                          <div className={styles.scoreBreakdown}>
                            <span className={styles.scoreValue}>{v3Evaluation?.contributionScore?.total || 81.5}点</span>
                            <span className={styles.scoreDetail}>
                              （施設内 {v3Evaluation?.contributionScore?.facility || 85}点 + 法人内 {v3Evaluation?.contributionScore?.corporate || 78}点の平均）
                            </span>
                          </div>
                        </div>
                        <div className={styles.scoreItemV3}>
                          <span className={styles.scoreLabel}>総合評価</span>
                          <div className={styles.totalScoreV3}>
                            <span className={styles.scoreValue} style={{fontSize: '1.8em', fontWeight: 'bold', color: v3Grades[v3Evaluation?.grade || 'A'].color}}>
                              {v3Evaluation?.totalScore || 81.25}点
                            </span>
                            <span className={styles.gradeV3} style={{backgroundColor: v3Grades[v3Evaluation?.grade || 'A'].color}}>
                              {v3Grades[v3Evaluation?.grade || 'A'].label}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={styles.evaluationComments}>
                        <p>V3評価システムによる総合判定：{v3Evaluation?.experienceLabel || '中堅'}レベルとして優秀な成果を上げています。</p>
                        <div className={styles.recommendations}>
                          <div className={styles.recommendItem}>
                            <strong>強み:</strong> 技術評価80点で安定した専門性を発揮
                          </div>
                          <div className={styles.recommendItem}>
                            <strong>特徴:</strong> 施設内組織貢献度が法人内より高く、現場での活躍が顕著
                          </div>
                          <div className={styles.recommendItem}>
                            <strong>次段階目標:</strong> Sグレード（90点以上）到達に向けた法人規模での貢献強化
                          </div>
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
                      <div className={styles.cardTitle}>次回評価</div>
                      <div className={styles.cardMainInfo}>2025年3月</div>
                      <div className={styles.cardSubInfo}>2024年度 最終評価</div>
                      <button className={styles.cardAction}>評価実施</button>
                    </div>
                  </div>
                  
                  {currentProvisionalEvaluation && (
                    <div className={styles.provisionalEvaluationCard}>
                      <div className={styles.cardIconWrapper}>
                        <span className={styles.cardIcon} style={{color: v3Colors.provisional.main}}>⏱️</span>
                      </div>
                      <div className={styles.cardContent}>
                        <div className={styles.cardTitle}>{currentProvisionalEvaluation.title}</div>
                        <div className={styles.provisionalScores}>
                          <div className={styles.provisionalScore}>
                            <span>施設内: {currentProvisionalEvaluation.facilityScore}点</span>
                          </div>
                          <div className={styles.provisionalScore}>
                            <span>法人内: {currentProvisionalEvaluation.corporateScore}点</span>
                          </div>
                        </div>
                        <div className={styles.cardSubInfo}>現在実施中の評価</div>
                      </div>
                    </div>
                  )}
                  
                  <div className={styles.recentTopicsCard}>
                    <div className={styles.cardIconWrapper}>
                      <span className={styles.cardIcon}>🎯</span>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.cardTitle}>S+グレード達成への課題</div>
                      <div className={styles.topicsList}>
                        <span className={styles.topicTag}>法人規模貢献</span>
                        <span className={styles.topicTag}>業界リーダーシップ</span>
                        <span className={styles.topicTag}>イノベーション創出</span>
                      </div>
                      <div className={styles.cardSubInfo}>95点以上の卓越した成果が必要</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.evaluationComments}>
                <h3>評価コメント</h3>
                <div className={styles.commentCard}>
                  <div className={styles.commentHeader}>
                    <span className={styles.commentAuthor}>直属上司</span>
                    <span className={styles.commentDate}>2025年1月</span>
                  </div>
                  <div className={styles.commentBody}>
                    V3評価システムにおいて優れた業務遂行力とチーム協調性を発揮。技術評価80点、組織貢献度81.5点という安定した成果を評価します。次期主任候補として期待しています。
                  </div>
                </div>
              </div>

              {/* V3評価マトリックス */}
              <div className={styles.sectionCard} style={{ marginTop: '24px' }}>
                <h3>V3評価マトリックス</h3>
                <div className={styles.matrixContainer}>
                  <div className={styles.matrixGrid}>
                    <div className={styles.matrixCell}>
                      <strong>技術評価:</strong> {v3Evaluation?.technicalScore?.total || 80}点
                    </div>
                    <div className={styles.matrixCell}>
                      <strong>組織貢献度:</strong> {v3Evaluation?.contributionScore?.total || 81.5}点
                    </div>
                  </div>
                  <div className={styles.matrixResult}>
                    総合グレード: <span className={styles.gradeLabel}>{v3Grades[v3Evaluation?.grade || 'A'].label}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}