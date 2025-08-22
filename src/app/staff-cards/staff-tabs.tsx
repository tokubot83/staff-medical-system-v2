// V3評価システム対応版
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PersonalEvaluationService } from '@/services/evaluationV3Service'
import { V3PersonalEvaluation } from '@/types/evaluation-v3'
import styles from './StaffCards.module.css'

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

export function AnalyticsTab({ selectedStaff }: { selectedStaff: any }) {
  const router = useRouter()
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeAnalysisTab, setActiveAnalysisTab] = useState('performance')

  if (!selectedStaff) {
    return (
      <div className={styles.noDataContainer}>
        <p>職員を選択してください</p>
      </div>
    )
  }

  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        setIsLoading(true)
        
        // V3評価データに基づく分析データ（モック）
        const mockAnalytics = {
          performanceTrend: {
            technical: [78, 79, 80, 82, 80],
            contribution: [75, 78, 81, 83, 81.5],
            overall: [76.5, 78.5, 80.5, 82.5, 81.25],
            periods: ['2020年度', '2021年度', '2022年度', '2023年度', '2024年度']
          },
          competencyAnalysis: {
            strengths: [
              { area: '専門技術・スキル', score: 85, trend: 'improving' },
              { area: '対人関係・ケア', score: 80, trend: 'stable' },
              { area: '安全・品質管理', score: 75, trend: 'improving' }
            ],
            growthAreas: [
              { area: '法人貢献度', score: 78, potential: 85, gap: 7 },
              { area: 'リーダーシップ', score: 72, potential: 80, gap: 8 }
            ]
          },
          peerComparison: {
            rankInLevel: 12,
            totalInLevel: 45,
            percentile: 75,
            levelLabel: '中堅'
          },
          careerProgression: {
            currentLevel: 'midlevel',
            nextLevel: 'senior',
            progressToNext: 65,
            estimatedTimeToPromotion: '1.5年',
            requiredSkills: ['法人規模プロジェクト参加', 'チームリーダー経験', '後輩指導実績']
          }
        }

        setAnalyticsData(mockAnalytics)
      } catch (error) {
        console.error('分析データの取得に失敗:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (selectedStaff?.id) {
      loadAnalyticsData()
    }
  }, [selectedStaff?.id])

  const analysisSubTabs = [
    { id: 'performance', label: '成果分析', icon: '📈' },
    { id: 'competency', label: 'スキル分析', icon: '🎯' },
    { id: 'career', label: 'キャリア分析', icon: '🚀' }
  ]

  return (
    <div className={styles.tabContentSection}>
      <div className={styles.sectionHeader}>
        <h2>📊 総合分析・成長トレンド</h2>
        <div className={styles.sectionActions}>
          <button className={styles.actionButton} onClick={() => router.push('/evaluation?tab=review')}>
            詳細レポート
          </button>
        </div>
      </div>

      {/* 分析サブタブ */}
      <div className={styles.tabNavigation} style={{ marginBottom: '20px' }}>
        {analysisSubTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAnalysisTab(tab.id)}
            className={`${styles.tabButton} ${activeAnalysisTab === tab.id ? styles.active : ''}`}
            style={{ fontSize: '14px', padding: '8px 16px' }}
          >
            <span style={{ marginRight: '4px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <p>分析データを読み込み中...</p>
        </div>
      ) : (
        <>
          {activeAnalysisTab === 'performance' && (
            <div className={styles.performanceAnalysis}>
              <div className={styles.trendCard}>
                <h3>📈 V3評価トレンド（5年間）</h3>
                <div className={styles.trendChart}>
                  <div className={styles.chartLegend}>
                    <span className={styles.legendItem} style={{color: '#007bff'}}>■ 技術評価</span>
                    <span className={styles.legendItem} style={{color: '#28a745'}}>■ 組織貢献度</span>
                    <span className={styles.legendItem} style={{color: '#dc3545'}}>■ 総合評価</span>
                  </div>
                  <div className={styles.trendData}>
                    {analyticsData?.performanceTrend?.periods.map((period: string, index: number) => (
                      <div key={period} className={styles.trendPeriod}>
                        <div className={styles.periodLabel}>{period}</div>
                        <div className={styles.scoreBar}>
                          <div className={styles.scoreSegment} style={{
                            width: `${analyticsData.performanceTrend.technical[index]}%`,
                            backgroundColor: '#007bff'
                          }}>
                            {analyticsData.performanceTrend.technical[index]}
                          </div>
                        </div>
                        <div className={styles.scoreBar}>
                          <div className={styles.scoreSegment} style={{
                            width: `${analyticsData.performanceTrend.contribution[index]}%`,
                            backgroundColor: '#28a745'
                          }}>
                            {analyticsData.performanceTrend.contribution[index]}
                          </div>
                        </div>
                        <div className={styles.scoreBar}>
                          <div className={styles.scoreSegment} style={{
                            width: `${analyticsData.performanceTrend.overall[index]}%`,
                            backgroundColor: '#dc3545'
                          }}>
                            {analyticsData.performanceTrend.overall[index]}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.peerComparisonCard}>
                <h3>👥 同レベル職員との比較</h3>
                <div className={styles.comparisonStats}>
                  <div className={styles.comparisonItem}>
                    <span className={styles.comparisonLabel}>レベル内順位</span>
                    <span className={styles.comparisonValue}>
                      {analyticsData?.peerComparison?.rankInLevel}位 / {analyticsData?.peerComparison?.totalInLevel}人
                    </span>
                  </div>
                  <div className={styles.comparisonItem}>
                    <span className={styles.comparisonLabel}>上位パーセンタイル</span>
                    <span className={styles.comparisonValue}>{analyticsData?.peerComparison?.percentile}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeAnalysisTab === 'competency' && (
            <div className={styles.competencyAnalysis}>
              <div className={styles.strengthsCard}>
                <h3>💪 強み分野</h3>
                {analyticsData?.competencyAnalysis?.strengths.map((strength: any, index: number) => (
                  <div key={index} className={styles.competencyItem}>
                    <div className={styles.competencyHeader}>
                      <span className={styles.competencyArea}>{strength.area}</span>
                      <span className={styles.competencyScore}>{strength.score}点</span>
                    </div>
                    <div className={styles.competencyBar}>
                      <div 
                        className={styles.competencyProgress} 
                        style={{ width: `${strength.score}%`, backgroundColor: '#28a745' }}
                      />
                    </div>
                    <div className={styles.trendIndicator}>
                      {strength.trend === 'improving' ? '📈 向上中' : '➡️ 安定'}
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.growthCard}>
                <h3>🎯 成長ポテンシャル分野</h3>
                {analyticsData?.competencyAnalysis?.growthAreas.map((area: any, index: number) => (
                  <div key={index} className={styles.growthItem}>
                    <div className={styles.growthHeader}>
                      <span className={styles.growthArea}>{area.area}</span>
                      <span className={styles.growthGap}>ギャップ: {area.gap}点</span>
                    </div>
                    <div className={styles.growthProgress}>
                      <div className={styles.currentProgress} style={{ width: `${area.score}%` }}>
                        現在 {area.score}点
                      </div>
                      <div className={styles.potentialLine} style={{ left: `${area.potential}%` }}>
                        目標 {area.potential}点
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeAnalysisTab === 'career' && (
            <div className={styles.careerAnalysis}>
              <div className={styles.careerPathCard}>
                <h3>🚀 キャリア進路分析</h3>
                <div className={styles.careerStatus}>
                  <div className={styles.careerLevel}>
                    <span className={styles.currentLevel}>現在: {analyticsData?.careerProgression?.levelLabel || '中堅'}</span>
                    <span className={styles.nextLevel}>次段階: シニア/主任候補</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill} 
                      style={{ width: `${analyticsData?.careerProgression?.progressToNext}%` }}
                    >
                      {analyticsData?.careerProgression?.progressToNext}%
                    </div>
                  </div>
                  <div className={styles.timeEstimate}>
                    昇進予想時期: {analyticsData?.careerProgression?.estimatedTimeToPromotion}
                  </div>
                </div>
              </div>

              <div className={styles.requiredSkillsCard}>
                <h3>📋 昇進に必要なスキル</h3>
                <div className={styles.skillsList}>
                  {analyticsData?.careerProgression?.requiredSkills.map((skill: string, index: number) => (
                    <div key={index} className={styles.skillItem}>
                      <span className={styles.skillIcon}>🎯</span>
                      <span className={styles.skillText}>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export function EvaluationTab({ selectedStaff }: { selectedStaff: any }) {
  const router = useRouter()
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

  return (
    <div className={styles.tabContentSection}>
      <div className={styles.sectionHeader}>
        <h2>📊 人事評価・成長分析（V3システム）</h2>
        <div className={styles.sectionActions}>
          <button className={styles.actionButton} onClick={handleEvaluationInput}>評価入力</button>
        </div>
      </div>

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
                <h3>最新人事評価（V3システム - 100点満点制）</h3>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <div className={styles.evaluationSummary}>
                  <div className={styles.evaluationScores}>
                    <div className={styles.scoreItem}>
                      <span className={styles.scoreLabel}>技術評価</span>
                      <span className={styles.scoreValue}>{v3Evaluation?.technicalScore?.total || 80}点</span>
                      <span className={styles.scoreDetail}>
                        （法人統一 {v3Evaluation?.technicalScore?.coreItems || 42}点 + 施設固有 {v3Evaluation?.technicalScore?.facilityItems || 38}点）
                      </span>
                    </div>
                    <div className={styles.scoreItem}>
                      <span className={styles.scoreLabel}>組織貢献度</span>
                      <span className={styles.scoreValue}>{v3Evaluation?.contributionScore?.total || 81.5}点</span>
                      <span className={styles.scoreDetail}>
                        （施設内 {v3Evaluation?.contributionScore?.facility || 85}点 + 法人内 {v3Evaluation?.contributionScore?.corporate || 78}点の平均）
                      </span>
                    </div>
                    <div className={styles.scoreItem}>
                      <span className={styles.scoreLabel}>総合評価</span>
                      <span className={styles.scoreValue} style={{fontSize: '1.8em', fontWeight: 'bold', color: v3Grades[v3Evaluation?.grade || 'A'].color}}>
                        {v3Evaluation?.totalScore || 81.25}点
                      </span>
                      <span className={styles.scoreRank} style={{backgroundColor: v3Grades[v3Evaluation?.grade || 'A'].color, color: 'white', padding: '4px 8px', borderRadius: '4px'}}>
                        {v3Grades[v3Evaluation?.grade || 'A'].label}
                      </span>
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
          </div>

          {currentProvisionalEvaluation && (
            <div className={styles.sectionCard} style={{ marginTop: '24px', backgroundColor: '#fff3cd', border: '1px solid #ffc107' }}>
              <h3 style={{ color: '#856404' }}>🕐 {currentProvisionalEvaluation.title}</h3>
              <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
                <div>
                  <strong>施設内評価:</strong> {currentProvisionalEvaluation.facilityScore}点
                </div>
                <div>
                  <strong>法人内評価:</strong> {currentProvisionalEvaluation.corporateScore}点
                </div>
              </div>
              <p style={{ marginTop: '8px', fontSize: '14px', color: '#856404' }}>
                現在実施中の評価期間です。最終結果は期間終了後に反映されます。
              </p>
            </div>
          )}

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
        </>
      )}
    </div>
  )
}

export function RecruitmentTab({ selectedStaff }: { selectedStaff: any }) {
  const router = useRouter()
  const [recruitmentData, setRecruitmentData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeRecruitmentTab, setActiveRecruitmentTab] = useState('overview')

  if (!selectedStaff) {
    return (
      <div className={styles.noDataContainer}>
        <p>職員を選択してください</p>
      </div>
    )
  }

  useEffect(() => {
    const loadRecruitmentData = async () => {
      try {
        setIsLoading(true)
        
        // 採用・配属履歴データ（モック）
        const mockRecruitmentData = {
          recruitmentInfo: {
            hireDate: '2021-04-01',
            recruitmentSource: '新卒採用',
            initialPosition: '看護師',
            probationPeriod: '6ヶ月',
            probationResult: '合格',
            recruiterId: 'HR001',
            recruiterName: '人事部 佐藤'
          },
          placementHistory: [
            {
              id: 'PL001',
              startDate: '2024-04-01',
              endDate: null,
              facility: '小原病院',
              department: '内科病棟',
              position: '看護師',
              reason: '経験年数による配置転換',
              performance: 'A',
              status: 'current'
            },
            {
              id: 'PL002',
              startDate: '2022-04-01',
              endDate: '2024-03-31',
              facility: '小原病院',
              department: '外科病棟',
              position: '看護師',
              reason: 'ローテーション',
              performance: 'B+',
              status: 'completed'
            },
            {
              id: 'PL003',
              startDate: '2021-04-01',
              endDate: '2022-03-31',
              facility: '小原病院',
              department: '内科病棟',
              position: '看護師（新人）',
              reason: '新人配属',
              performance: 'B',
              status: 'completed'
            }
          ],
          aptitudeAssessment: {
            technicalAptitude: 85,
            communicationSkills: 90,
            teamwork: 88,
            adaptability: 80,
            leadership: 75,
            overallFit: 85
          },
          careerPath: {
            preferredSpecialty: '内科・慢性期ケア',
            careerGoals: ['主任昇進', '専門分野のスペシャリスト'],
            mentorshipNeeds: ['リーダーシップ開発', '法人規模プロジェクト経験'],
            nextPlacementRecommendation: '内科系リーダー候補ポジション'
          }
        }

        setRecruitmentData(mockRecruitmentData)
      } catch (error) {
        console.error('採用データの取得に失敗:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (selectedStaff?.id) {
      loadRecruitmentData()
    }
  }, [selectedStaff?.id])

  const recruitmentSubTabs = [
    { id: 'overview', label: '概要', icon: '📋' },
    { id: 'placement', label: '配属履歴', icon: '🏢' },
    { id: 'aptitude', label: '適性評価', icon: '🎯' }
  ]

  return (
    <div className={styles.tabContentSection}>
      <div className={styles.sectionHeader}>
        <h2>🏢 採用・配属管理</h2>
        <div className={styles.sectionActions}>
          <button className={styles.actionButtonSecondary}>
            配属履歴詳細
          </button>
        </div>
      </div>

      {/* サブタブ */}
      <div className={styles.tabNavigation} style={{ marginBottom: '20px' }}>
        {recruitmentSubTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveRecruitmentTab(tab.id)}
            className={`${styles.tabButton} ${activeRecruitmentTab === tab.id ? styles.active : ''}`}
            style={{ fontSize: '14px', padding: '8px 16px' }}
          >
            <span style={{ marginRight: '4px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <p>採用データを読み込み中...</p>
        </div>
      ) : (
        <>
          {activeRecruitmentTab === 'overview' && (
            <div className={styles.recruitmentOverview}>
              <div className={styles.recruitmentSummaryCard}>
                <h3>📊 採用・配属サマリー</h3>
                <div className={styles.recruitmentBasicInfo}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>採用日:</span>
                    <span className={styles.infoValue}>{recruitmentData?.recruitmentInfo?.hireDate}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>採用区分:</span>
                    <span className={styles.infoValue}>{recruitmentData?.recruitmentInfo?.recruitmentSource}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>勤続年数:</span>
                    <span className={styles.infoValue}>3年10ヶ月</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>現在の配属:</span>
                    <span className={styles.infoValue}>
                      {recruitmentData?.placementHistory?.[0]?.department} ({recruitmentData?.placementHistory?.[0]?.facility})
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.currentPlacementCard}>
                <h3>🏢 現在の配属状況</h3>
                <div className={styles.currentPlacement}>
                  <div className={styles.placementDetail}>
                    <div className={styles.placementHeader}>
                      <span className={styles.placementDepartment}>
                        {recruitmentData?.placementHistory?.[0]?.department}
                      </span>
                      <span className={styles.placementPerformance}>
                        評価: {recruitmentData?.placementHistory?.[0]?.performance}
                      </span>
                    </div>
                    <div className={styles.placementInfo}>
                      <span>配属期間: {recruitmentData?.placementHistory?.[0]?.startDate} ～ 現在</span>
                    </div>
                    <div className={styles.placementReason}>
                      {recruitmentData?.placementHistory?.[0]?.reason}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.careerPathCard}>
                <h3>🚀 キャリアパス・配属方針</h3>
                <div className={styles.careerPathInfo}>
                  <div className={styles.careerGoal}>
                    <strong>キャリア目標:</strong>
                    <div className={styles.goalsList}>
                      {recruitmentData?.careerPath?.careerGoals?.map((goal: string, index: number) => (
                        <span key={index} className={styles.goalTag}>{goal}</span>
                      ))}
                    </div>
                  </div>
                  <div className={styles.preferredSpecialty}>
                    <strong>希望専門分野:</strong> {recruitmentData?.careerPath?.preferredSpecialty}
                  </div>
                  <div className={styles.nextRecommendation}>
                    <strong>次期配属推奨:</strong> {recruitmentData?.careerPath?.nextPlacementRecommendation}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeRecruitmentTab === 'placement' && (
            <div className={styles.placementHistory}>
              <h3>📅 配属履歴</h3>
              <div className={styles.placementTimeline}>
                {recruitmentData?.placementHistory?.map((placement: any, index: number) => (
                  <div key={placement.id} className={styles.placementTimelineItem}>
                    <div className={styles.timelineDot} />
                    <div className={styles.placementCard}>
                      <div className={styles.placementCardHeader}>
                        <div className={styles.placementPeriod}>
                          {placement.startDate} {placement.endDate ? `～ ${placement.endDate}` : '～ 現在'}
                        </div>
                        <div className={styles.placementStatus}>
                          <span className={`${styles.statusBadge} ${placement.status}`}>
                            {placement.status === 'current' ? '現在' : '完了'}
                          </span>
                        </div>
                      </div>
                      <div className={styles.placementCardContent}>
                        <div className={styles.placementLocation}>
                          <strong>{placement.facility}</strong> - {placement.department}
                        </div>
                        <div className={styles.placementPosition}>
                          役職: {placement.position}
                        </div>
                        <div className={styles.placementReason}>
                          配属理由: {placement.reason}
                        </div>
                        <div className={styles.placementPerformance}>
                          評価: <span className={styles.performanceGrade}>{placement.performance}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeRecruitmentTab === 'aptitude' && (
            <div className={styles.aptitudeAssessment}>
              <h3>🎯 適性評価</h3>
              <div className={styles.aptitudeGrid}>
                {recruitmentData?.aptitudeAssessment && Object.entries(recruitmentData.aptitudeAssessment)
                  .filter(([key]) => key !== 'overallFit')
                  .map(([key, value]: [string, any]) => {
                    const labels: { [key: string]: string } = {
                      technicalAptitude: '技術適性',
                      communicationSkills: 'コミュニケーション',
                      teamwork: 'チームワーク',
                      adaptability: '適応力',
                      leadership: 'リーダーシップ'
                    }
                    
                    return (
                      <div key={key} className={styles.aptitudeItem}>
                        <div className={styles.aptitudeLabel}>{labels[key]}</div>
                        <div className={styles.aptitudeBar}>
                          <div 
                            className={styles.aptitudeProgress} 
                            style={{ width: `${value}%` }}
                          />
                          <span className={styles.aptitudeScore}>{value}</span>
                        </div>
                      </div>
                    )
                  })}
              </div>
              
              <div className={styles.overallFitCard}>
                <h4>総合適性評価</h4>
                <div className={styles.overallScore}>
                  {recruitmentData?.aptitudeAssessment?.overallFit}点
                </div>
                <div className={styles.fitAssessment}>
                  現在の配属における適性度が高く、継続的な成長が期待できます。
                  V3評価システムとの相関性も良好です。
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export function InterviewTab({ selectedStaff }: { selectedStaff: any }) {
  const router = useRouter()
  const [interviewHistory, setInterviewHistory] = useState<any[]>([])
  const [upcomingInterviews, setUpcomingInterviews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeSubTab, setActiveSubTab] = useState('overview')

  if (!selectedStaff) {
    return (
      <div className={styles.noDataContainer}>
        <p>職員を選択してください</p>
      </div>
    )
  }

  useEffect(() => {
    const loadInterviewData = async () => {
      try {
        setIsLoading(true)
        
        // モック面談履歴データ
        const mockHistory = [
          {
            id: 'INT_001',
            date: '2024-12-15',
            type: 'regular-annual',
            typeLabel: '定期面談',
            interviewer: '田中師長',
            topics: ['業務評価', 'キャリア相談', '職場環境'],
            status: 'completed',
            summary: 'V3評価システムでAグレード評価。次期主任候補として期待。',
            nextAction: '法人規模での貢献機会の提供'
          },
          {
            id: 'INT_002',
            date: '2024-09-20',
            type: 'performance-feedback',
            typeLabel: '評価フィードバック',
            interviewer: '山田主任',
            topics: ['夏季評価結果', '改善点確認'],
            status: 'completed',
            summary: '技術評価80点で安定した成果。組織貢献度の向上が課題。',
            nextAction: 'チームリーダー業務への参加'
          }
        ]

        // モック予定面談データ
        const mockUpcoming = [
          {
            id: 'INT_003',
            date: '2025-03-15',
            type: 'year-end-review',
            typeLabel: '年度末評価面談',
            interviewer: '田中師長',
            status: 'scheduled',
            purpose: '2024年度総合評価の確認と2025年度目標設定'
          }
        ]

        setInterviewHistory(mockHistory)
        setUpcomingInterviews(mockUpcoming)
      } catch (error) {
        console.error('面談データの取得に失敗:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (selectedStaff?.id) {
      loadInterviewData()
    }
  }, [selectedStaff?.id])

  const handleNewInterview = () => {
    router.push(`/interviews?tab=station&staffId=${selectedStaff.id}`)
  }

  const handleInterviewHistory = () => {
    router.push(`/interviews?tab=analytics&staffId=${selectedStaff.id}`)
  }

  const subTabs = [
    { id: 'overview', label: '概要', icon: '📋' },
    { id: 'feedback', label: '指導記録', icon: '💬' }
  ]

  return (
    <div className={styles.tabContentSection}>
      <div className={styles.sectionHeader}>
        <h2>💬 面談・指導記録</h2>
        <div className={styles.sectionActions}>
          <button className={styles.actionButton} onClick={handleNewInterview}>
            面談開始
          </button>
          <button className={styles.actionButtonSecondary} onClick={handleInterviewHistory}>
            履歴詳細
          </button>
        </div>
      </div>

      {/* サブタブナビゲーション */}
      <div className={styles.tabNavigation} style={{ marginBottom: '20px' }}>
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`${styles.tabButton} ${activeSubTab === tab.id ? styles.active : ''}`}
            style={{ fontSize: '14px', padding: '8px 16px' }}
          >
            <span style={{ marginRight: '4px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeSubTab === 'overview' && (
        <div>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <p>面談データを読み込み中...</p>
            </div>
          ) : (
            <>
              <div className={styles.interviewSummaryEnhanced}>
                <div className={styles.summaryMainCard}>
                  <div className={styles.summaryCardHeader}>
                    <span className={styles.summaryIcon}>📊</span>
                    <h3>面談・指導状況サマリー</h3>
                  </div>
                  
                  <div className={styles.summaryStats}>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{interviewHistory.length}</span>
                      <span className={styles.statLabel}>実施済み面談</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{upcomingInterviews.length}</span>
                      <span className={styles.statLabel}>予定面談</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>A</span>
                      <span className={styles.statLabel}>最新評価</span>
                    </div>
                  </div>
                </div>

                <div className={styles.summarySubCards}>
                  <div className={styles.nextSessionCard}>
                    <div className={styles.cardIconWrapper}>
                      <span className={styles.cardIcon}>📅</span>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.cardTitle}>次回予定</div>
                      <div className={styles.cardMainInfo}>
                        {upcomingInterviews.length > 0 
                          ? upcomingInterviews[0].date 
                          : '未定'}
                      </div>
                      <div className={styles.cardSubInfo}>
                        {upcomingInterviews.length > 0 
                          ? upcomingInterviews[0].typeLabel 
                          : '面談スケジュール未設定'}
                      </div>
                      <button className={styles.cardAction} onClick={handleNewInterview}>
                        面談実施
                      </button>
                    </div>
                  </div>

                  <div className={styles.recentTopicsCard}>
                    <div className={styles.cardIconWrapper}>
                      <span className={styles.cardIcon}>💡</span>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.cardTitle}>最近の指導ポイント</div>
                      <div className={styles.topicsList}>
                        <span className={styles.topicTag}>法人規模貢献</span>
                        <span className={styles.topicTag}>リーダーシップ</span>
                        <span className={styles.topicTag}>後輩指導</span>
                      </div>
                      <div className={styles.cardSubInfo}>V3評価連動の成長支援</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 最近の面談記録 */}
              <div className={styles.recentInterviews}>
                <h3>最近の面談記録</h3>
                {interviewHistory.slice(0, 3).map((interview) => (
                  <div key={interview.id} className={styles.interviewCard}>
                    <div className={styles.interviewHeader}>
                      <div className={styles.interviewInfo}>
                        <span className={styles.interviewDate}>{interview.date}</span>
                        <span className={styles.interviewType}>{interview.typeLabel}</span>
                        <span className={styles.interviewer}>面談者: {interview.interviewer}</span>
                      </div>
                      <div className={styles.interviewStatus}>
                        <span className={`${styles.statusBadge} ${styles[interview.status]}`}>
                          完了
                        </span>
                      </div>
                    </div>
                    <div className={styles.interviewContent}>
                      <p>{interview.summary}</p>
                      <div className={styles.interviewTopics}>
                        {interview.topics.map((topic: string, index: number) => (
                          <span key={index} className={styles.topicChip}>{topic}</span>
                        ))}
                      </div>
                      {interview.nextAction && (
                        <div className={styles.nextAction}>
                          <strong>次回アクション:</strong> {interview.nextAction}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {activeSubTab === 'feedback' && (
        <div className={styles.feedbackSection}>
          <div className={styles.feedbackCard}>
            <h3>継続的指導記録</h3>
            <div className={styles.feedbackTimeline}>
              <div className={styles.feedbackItem}>
                <div className={styles.feedbackDate}>2024-12-20</div>
                <div className={styles.feedbackContent}>
                  <strong>スキル向上指導:</strong> V3評価でのSグレード達成に向けて、法人規模でのプロジェクト参加を推奨。
                </div>
                <div className={styles.feedbackAuthor}>指導者: 田中師長</div>
              </div>
              <div className={styles.feedbackItem}>
                <div className={styles.feedbackDate}>2024-11-15</div>
                <div className={styles.feedbackContent}>
                  <strong>チーム貢献:</strong> 新人指導において優れた成果。後輩からの評価も高い。
                </div>
                <div className={styles.feedbackAuthor}>指導者: 山田主任</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function DevelopmentTab({ selectedStaff }: { selectedStaff: any }) {
  return (
    <div>
      <h3>成長タブ（一時的に無効化中）</h3>
      <p>このタブは現在メンテナンス中です。</p>
    </div>
  );
}

export function EducationTab({ selectedStaff }: { selectedStaff: any }) {
  const router = useRouter()
  const [trainingData, setTrainingData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeEducationTab, setActiveEducationTab] = useState('progress')

  if (!selectedStaff) {
    return (
      <div className={styles.noDataContainer}>
        <p>職員を選択してください</p>
      </div>
    )
  }

  useEffect(() => {
    const loadTrainingData = async () => {
      try {
        setIsLoading(true)
        
        // 研修・教育データ（モック）
        const mockTrainingData = {
          progressSummary: {
            totalHours: 245,
            requiredHours: 200,
            completionRate: 88,
            ongoingPrograms: 3,
            completedPrograms: 12,
            upcomingDeadlines: 2
          },
          currentPrograms: [
            {
              id: 'TR001',
              name: '医療安全研修',
              category: '必須研修',
              progress: 75,
              deadline: '2025-03-31',
              status: 'in_progress',
              nextSession: '2025-02-15'
            },
            {
              id: 'TR002',
              name: 'リーダーシップ開発',
              category: '任意研修',
              progress: 40,
              deadline: '2025-06-30',
              status: 'in_progress',
              nextSession: '2025-02-20'
            },
            {
              id: 'TR003',
              name: 'V3評価システム研修',
              category: '制度研修',
              progress: 100,
              deadline: '2024-12-31',
              status: 'completed',
              completedDate: '2024-12-10'
            }
          ],
          skillDevelopment: {
            technicalSkills: [
              { skill: '専門看護技術', level: 85, target: 90 },
              { skill: '医療機器操作', level: 80, target: 85 },
              { skill: '感染防止対策', level: 90, target: 95 }
            ],
            softSkills: [
              { skill: 'チームワーク', level: 88, target: 90 },
              { skill: 'コミュニケーション', level: 85, target: 90 },
              { skill: 'リーダーシップ', level: 70, target: 80 }
            ]
          },
          certifications: [
            {
              name: '普通救命講習',
              obtainedDate: '2023-04-15',
              expiryDate: '2026-04-15',
              status: 'valid'
            },
            {
              name: '感染管理認定',
              obtainedDate: '2024-02-20',
              expiryDate: '2027-02-20',
              status: 'valid'
            }
          ],
          v3Integration: {
            evaluationAlignment: 85,
            skillGapAnalysis: [
              { area: '法人規模貢献', currentLevel: 78, targetLevel: 85, trainingPlan: 'プロジェクトマネジメント研修' },
              { area: 'イノベーション', currentLevel: 72, targetLevel: 80, trainingPlan: '創造性開発ワークショップ' }
            ]
          }
        }

        setTrainingData(mockTrainingData)
      } catch (error) {
        console.error('研修データの取得に失敗:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (selectedStaff?.id) {
      loadTrainingData()
    }
  }, [selectedStaff?.id])

  const handleTrainingDashboard = () => {
    router.push(`/training?tab=dashboard&staffId=${selectedStaff.id}`)
  }

  const handleTrainingPlan = () => {
    router.push(`/training?tab=planning&staffId=${selectedStaff.id}`)
  }

  const educationSubTabs = [
    { id: 'progress', label: '進捗状況', icon: '📊' },
    { id: 'skills', label: 'スキル開発', icon: '🎯' },
    { id: 'v3alignment', label: 'V3評価連動', icon: '🔗' }
  ]

  return (
    <div className={styles.tabContentSection}>
      <div className={styles.sectionHeader}>
        <h2>📚 教育・研修管理</h2>
        <div className={styles.sectionActions}>
          <button className={styles.actionButton} onClick={handleTrainingPlan}>
            研修計画
          </button>
          <button className={styles.actionButtonSecondary} onClick={handleTrainingDashboard}>
            詳細ダッシュボード
          </button>
        </div>
      </div>

      {/* サブタブ */}
      <div className={styles.tabNavigation} style={{ marginBottom: '20px' }}>
        {educationSubTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveEducationTab(tab.id)}
            className={`${styles.tabButton} ${activeEducationTab === tab.id ? styles.active : ''}`}
            style={{ fontSize: '14px', padding: '8px 16px' }}
          >
            <span style={{ marginRight: '4px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <p>研修データを読み込み中...</p>
        </div>
      ) : (
        <>
          {activeEducationTab === 'progress' && (
            <div className={styles.trainingProgress}>
              <div className={styles.progressSummaryCard}>
                <h3>📊 研修進捗サマリー</h3>
                <div className={styles.progressStats}>
                  <div className={styles.progressStatItem}>
                    <span className={styles.statValue}>{trainingData?.progressSummary?.totalHours}h</span>
                    <span className={styles.statLabel}>受講時間</span>
                  </div>
                  <div className={styles.progressStatItem}>
                    <span className={styles.statValue}>{trainingData?.progressSummary?.completionRate}%</span>
                    <span className={styles.statLabel}>達成率</span>
                  </div>
                  <div className={styles.progressStatItem}>
                    <span className={styles.statValue}>{trainingData?.progressSummary?.ongoingPrograms}</span>
                    <span className={styles.statLabel}>受講中</span>
                  </div>
                  <div className={styles.progressStatItem}>
                    <span className={styles.statValue}>{trainingData?.progressSummary?.completedPrograms}</span>
                    <span className={styles.statLabel}>完了済み</span>
                  </div>
                </div>
              </div>

              <div className={styles.currentProgramsCard}>
                <h3>📚 現在の研修プログラム</h3>
                <div className={styles.programsList}>
                  {trainingData?.currentPrograms?.map((program: any) => (
                    <div key={program.id} className={styles.programCard}>
                      <div className={styles.programHeader}>
                        <div className={styles.programInfo}>
                          <span className={styles.programName}>{program.name}</span>
                          <span className={styles.programCategory}>{program.category}</span>
                        </div>
                        <div className={styles.programStatus}>
                          <span className={`${styles.statusBadge} ${program.status}`}>
                            {program.status === 'completed' ? '完了' : '受講中'}
                          </span>
                        </div>
                      </div>
                      <div className={styles.programProgress}>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill} 
                            style={{ width: `${program.progress}%` }}
                          />
                        </div>
                        <span className={styles.progressText}>{program.progress}%</span>
                      </div>
                      <div className={styles.programDetails}>
                        {program.status === 'completed' ? (
                          <span>完了日: {program.completedDate}</span>
                        ) : (
                          <>
                            <span>期限: {program.deadline}</span>
                            {program.nextSession && (
                              <span>次回: {program.nextSession}</span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.certificationsCard}>
                <h3>🏆 取得資格・認定</h3>
                <div className={styles.certificationsList}>
                  {trainingData?.certifications?.map((cert: any, index: number) => (
                    <div key={index} className={styles.certificationItem}>
                      <div className={styles.certificationInfo}>
                        <span className={styles.certificationName}>{cert.name}</span>
                        <span className={styles.certificationStatus}>{cert.status === 'valid' ? '有効' : '期限切れ'}</span>
                      </div>
                      <div className={styles.certificationDates}>
                        <span>取得: {cert.obtainedDate}</span>
                        <span>期限: {cert.expiryDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeEducationTab === 'skills' && (
            <div className={styles.skillDevelopment}>
              <div className={styles.technicalSkillsCard}>
                <h3>🛠️ 技術スキル</h3>
                <div className={styles.skillsList}>
                  {trainingData?.skillDevelopment?.technicalSkills?.map((skill: any, index: number) => (
                    <div key={index} className={styles.skillItem}>
                      <div className={styles.skillHeader}>
                        <span className={styles.skillName}>{skill.skill}</span>
                        <span className={styles.skillScore}>{skill.level} / {skill.target}</span>
                      </div>
                      <div className={styles.skillProgress}>
                        <div className={styles.skillBar}>
                          <div 
                            className={styles.currentLevel} 
                            style={{ width: `${skill.level}%` }}
                          />
                          <div 
                            className={styles.targetLine} 
                            style={{ left: `${skill.target}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.softSkillsCard}>
                <h3>🤝 ソフトスキル</h3>
                <div className={styles.skillsList}>
                  {trainingData?.skillDevelopment?.softSkills?.map((skill: any, index: number) => (
                    <div key={index} className={styles.skillItem}>
                      <div className={styles.skillHeader}>
                        <span className={styles.skillName}>{skill.skill}</span>
                        <span className={styles.skillScore}>{skill.level} / {skill.target}</span>
                      </div>
                      <div className={styles.skillProgress}>
                        <div className={styles.skillBar}>
                          <div 
                            className={styles.currentLevel} 
                            style={{ width: `${skill.level}%` }}
                          />
                          <div 
                            className={styles.targetLine} 
                            style={{ left: `${skill.target}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeEducationTab === 'v3alignment' && (
            <div className={styles.v3AlignmentCard}>
              <h3>🔗 V3評価システム連動</h3>
              <div className={styles.alignmentSummary}>
                <div className={styles.alignmentScore}>
                  <span className={styles.scoreValue}>{trainingData?.v3Integration?.evaluationAlignment}%</span>
                  <span className={styles.scoreLabel}>評価連動度</span>
                </div>
                <div className={styles.alignmentDescription}>
                  V3評価システムの成果向上に向けた研修計画が効果的に実行されています。
                </div>
              </div>

              <div className={styles.skillGapAnalysis}>
                <h4>📈 スキルギャップ分析</h4>
                {trainingData?.v3Integration?.skillGapAnalysis?.map((gap: any, index: number) => (
                  <div key={index} className={styles.gapAnalysisItem}>
                    <div className={styles.gapHeader}>
                      <span className={styles.gapArea}>{gap.area}</span>
                      <span className={styles.gapScore}>
                        {gap.currentLevel} → {gap.targetLevel} (ギャップ: {gap.targetLevel - gap.currentLevel})
                      </span>
                    </div>
                    <div className={styles.gapProgress}>
                      <div className={styles.currentBar} style={{ width: `${gap.currentLevel}%` }} />
                      <div className={styles.targetMarker} style={{ left: `${gap.targetLevel}%` }} />
                    </div>
                    <div className={styles.trainingPlan}>
                      <strong>推奨研修:</strong> {gap.trainingPlan}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}