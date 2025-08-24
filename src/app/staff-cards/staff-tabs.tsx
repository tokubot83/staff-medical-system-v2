// V3評価システム対応版
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PersonalEvaluationService } from '@/services/evaluationV3Service'
import { V3PersonalEvaluation } from '@/types/evaluation-v3'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { AppError, ErrorLevel } from '@/lib/error/AppError'
import { StaffCardInterviewService } from '@/services/staffCardInterviewService'
import InterviewDataVisualization from '@/components/charts/InterviewDataVisualization'
import { CrossTabAnalysisService } from '@/services/crossTabAnalysisService'
import ComprehensiveGrowthTrend from '@/components/charts/ComprehensiveGrowthTrend'
import StaffPortfolioAnalysis from '@/components/charts/StaffPortfolioAnalysis'
import StrengthsWeaknessesMap from '@/components/charts/StrengthsWeaknessesMap'
import GrowthPredictionDashboard from '@/components/charts/GrowthPredictionDashboard'
import { RecruitmentAnalysisService } from '@/services/recruitmentAnalysisService'
import RecruitmentDashboard from '@/components/recruitment/RecruitmentDashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  const { handleError, clearError } = useErrorHandler()
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [crossTabData, setCrossTabData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeAnalysisTab, setActiveAnalysisTab] = useState('comprehensive')

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
        
        // 横断分析データを生成
        const crossTabAnalysis = await CrossTabAnalysisService.generateCrossTabAnalysis(selectedStaff.id)
        setCrossTabData(crossTabAnalysis)
        
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
        const appError = new AppError(
          'ANALYTICS_DATA_LOAD_FAILED',
          '分析データの取得に失敗しました',
          ErrorLevel.ERROR,
          { staffId: selectedStaff?.id, error }
        )
        handleError(appError)
      } finally {
        setIsLoading(false)
      }
    }

    if (selectedStaff?.id) {
      loadAnalyticsData()
    }
  }, [selectedStaff?.id])

  const analysisSubTabs = [
    { id: 'comprehensive', label: '横断的統合分析', icon: '🔮' },
    { id: 'growth', label: '成長トレンド', icon: '📈' },
    { id: 'portfolio', label: 'ポートフォリオ', icon: '🎯' },
    { id: 'strengths', label: '強み・課題', icon: '💪' },
    { id: 'prediction', label: '成長予測', icon: '🚀' }
  ]

  return (
    <div className={styles.tabContentSection}>
      <div className={styles.sectionHeader}>
        <h2>🔮 横断的統合分析・成長ストーリー</h2>
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
          {activeAnalysisTab === 'comprehensive' && crossTabData && (
            <div className={styles.comprehensiveAnalysis}>
              {/* 横断的統合分析の概要メッセージ */}
              <div style={{ 
                marginBottom: '24px', 
                padding: '16px', 
                backgroundColor: '#f8fafc', 
                border: '1px solid #e2e8f0', 
                borderRadius: '8px' 
              }}>
                <h3 style={{ 
                  margin: '0 0 12px 0', 
                  color: '#1e293b', 
                  fontSize: '16px', 
                  fontWeight: '600' 
                }}>
                  🔮 統合分析ダッシュボード
                </h3>
                <p style={{ 
                  margin: 0, 
                  color: '#475569', 
                  fontSize: '14px', 
                  lineHeight: '1.5' 
                }}>
                  評価・面談・研修・成長の全システムを横断分析し、統一された視点で職員の総合的な成長ストーリーをお伝えします。
                  効果的プレゼン指示書の原則に従い、重要なポイントを色と配置で強調表示しています。
                </p>
              </div>
              
              {/* 各コンポーネントを統合表示 */}
              <ComprehensiveGrowthTrend data={crossTabData} />
              <StaffPortfolioAnalysis data={crossTabData} />
              <StrengthsWeaknessesMap data={crossTabData} />
              <GrowthPredictionDashboard data={crossTabData} />
            </div>
          )}

          {activeAnalysisTab === 'growth' && crossTabData && (
            <ComprehensiveGrowthTrend data={crossTabData} />
          )}

          {activeAnalysisTab === 'portfolio' && crossTabData && (
            <StaffPortfolioAnalysis data={crossTabData} />
          )}

          {activeAnalysisTab === 'strengths' && crossTabData && (
            <StrengthsWeaknessesMap data={crossTabData} />
          )}

          {activeAnalysisTab === 'prediction' && crossTabData && (
            <GrowthPredictionDashboard data={crossTabData} />
          )}

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

// 効果的プレゼン指示書準拠のカラーパレット
const CHART_COLORS = {
  // 基本色（1-2色限定）
  primary: '#2563eb',    // 青 - 主要データ
  success: '#16a34a',    // 緑 - 成功・向上
  warning: '#f59e0b',    // オレンジ - 注意・改善必要
  danger: '#dc2626',     // 赤 - 減少・問題
  neutral: '#6b7280',    // グレー - 基準線・その他
  highlight: '#fbbf24',  // 黄 - ハイライト
  
  // 背景色（エリア塗りつぶし用）
  successBg: 'rgba(22, 163, 74, 0.1)',
  warningBg: 'rgba(245, 158, 11, 0.1)',
  neutralBg: 'rgba(107, 114, 128, 0.05)'
}

export function EvaluationTab({ selectedStaff }: { selectedStaff: any }) {
  const router = useRouter()
  const { handleError, clearError } = useErrorHandler()
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
            title: '今年度評価状況（暫定）',
            facilityScore: 82,
            corporateScore: 76,
            status: 'provisional'
          }
        } else if (currentMonth >= 12 || currentMonth <= 2) {
          // 冬季組織貢献度評価期間
          provisionalEvaluation = {
            type: 'winter',
            title: '今年度評価状況（暫定）',
            facilityScore: 78,
            corporateScore: 80,
            status: 'provisional'
          }
        }
        
        setV3Evaluation(mockV3Evaluation)
        setCurrentProvisionalEvaluation(provisionalEvaluation)
        
      } catch (error) {
        const appError = new AppError(
          'V3_EVALUATION_LOAD_FAILED',
          'V3評価データの取得に失敗しました',
          ErrorLevel.ERROR,
          { staffId: selectedStaff?.id, error }
        )
        handleError(appError)
      } finally {
        setIsLoading(false)
      }
    }

    if (selectedStaff?.id) {
      loadV3Evaluation()
    }
  }, [selectedStaff?.id])


  // グレード表示用の関数
  const getGradeDisplay = (grade: string, type: '5stage' | '7stage') => {
    if (type === '5stage') {
      const gradeColors = {
        'S': { color: '#ff0000', bg: '#fff0f0' },
        'A': { color: '#ff4500', bg: '#fff5f0' },
        'B': { color: '#32cd32', bg: '#f0fff0' },
        'C': { color: '#1e90ff', bg: '#f0f8ff' },
        'D': { color: '#808080', bg: '#f8f8f8' }
      }
      return gradeColors[grade as keyof typeof gradeColors] || gradeColors['B']
    } else {
      const gradeColors = {
        'S+': { color: '#8B0000', bg: '#fff0f0' },
        'S': { color: '#FF0000', bg: '#fff0f0' },
        'A+': { color: '#FF4500', bg: '#fff5f0' },
        'A': { color: '#FFA500', bg: '#fff8f0' },
        'B': { color: '#32CD32', bg: '#f0fff0' },
        'C': { color: '#1E90FF', bg: '#f0f8ff' },
        'D': { color: '#808080', bg: '#f8f8f8' }
      }
      return gradeColors[grade as keyof typeof gradeColors] || gradeColors['B']
    }
  }

  // モック相対評価データ
  const getRelativeRanking = (type: 'facility' | 'corporate') => {
    if (type === 'facility') {
      return { rank: 12, total: 120, percentile: 90 } // 施設内12位/120人中（上位10%）
    } else {
      return { rank: 89, total: 850, percentile: 89 } // 法人内89位/850人中（上位11%）
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-l-4" style={{ borderLeftColor: CHART_COLORS.primary }}>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              📊 人事評価・成長分析（V3システム）
            </CardTitle>
            <div className="flex gap-2">
              <Link 
                href="/dashboard" 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                評価管理へ
              </Link>
            </div>
          </div>
        </CardHeader>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-gray-600">評価データを読み込み中...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="border-l-4" style={{ borderLeftColor: CHART_COLORS.success }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span>🏆</span>
                2024年3月確定評価（最新）
              </CardTitle>
            </CardHeader>
            <CardContent>
              
              {/* メイン評価表示 - 5段階・7段階を強調 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span>🏢</span>
                    <span className="font-medium text-gray-700">施設内評価</span>
                  </div>
                  <div className="space-y-3">
                    <div 
                      className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl font-bold"
                      style={{
                        backgroundColor: getGradeDisplay('A', '5stage').bg,
                        color: getGradeDisplay('A', '5stage').color,
                        border: `3px solid ${getGradeDisplay('A', '5stage').color}`
                      }}
                    >
                      A
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-800">
                        {getRelativeRanking('facility').rank}位 / {getRelativeRanking('facility').total}人中
                      </div>
                      <Badge style={{ backgroundColor: CHART_COLORS.success, color: 'white' }}>
                        上位{100 - getRelativeRanking('facility').percentile}%
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span>🌐</span>
                    <span className="font-medium text-gray-700">法人内評価</span>
                  </div>
                  <div className="space-y-3">
                    <div 
                      className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl font-bold"
                      style={{
                        backgroundColor: getGradeDisplay('B', '5stage').bg,
                        color: getGradeDisplay('B', '5stage').color,
                        border: `3px solid ${getGradeDisplay('B', '5stage').color}`
                      }}
                    >
                      B
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-800">
                        {getRelativeRanking('corporate').rank}位 / {getRelativeRanking('corporate').total}人中
                      </div>
                      <Badge style={{ backgroundColor: CHART_COLORS.warning, color: 'white' }}>
                        上位{100 - getRelativeRanking('corporate').percentile}%
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span>⭐</span>
                    <span className="font-medium text-gray-700">総合判定</span>
                  </div>
                  <div className="space-y-3">
                    <div 
                      className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl font-bold"
                      style={{
                        backgroundColor: getGradeDisplay('A', '7stage').bg,
                        color: getGradeDisplay('A', '7stage').color,
                        border: `4px solid ${getGradeDisplay('A', '7stage').color}`
                      }}
                    >
                      A
                    </div>
                    <div className="space-y-1">
                      <div className="text-lg font-bold" style={{ color: CHART_COLORS.primary }}>
                        {v3Evaluation?.totalScore || 81.25}点 / 100点
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {v3Evaluation?.experienceLabel || '中堅'} 7段階判定
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 暫定評価表示 */}
          {currentProvisionalEvaluation && (
            <Card className="border-l-4" style={{ borderLeftColor: CHART_COLORS.warning }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span>⚡</span>
                  {currentProvisionalEvaluation.title}
                  <Badge style={{ backgroundColor: CHART_COLORS.warning, color: 'white' }}>暫定</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">施設貢献</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">12.3点 / 12.5点</span>
                        <Badge 
                          style={{
                            backgroundColor: getGradeDisplay('A', '5stage').bg,
                            color: getGradeDisplay('A', '5stage').color
                          }}
                        >
                          A
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">法人貢献</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">11.8点 / 12.5点</span>
                        <Badge 
                          style={{
                            backgroundColor: getGradeDisplay('B', '5stage').bg,
                            color: getGradeDisplay('B', '5stage').color
                          }}
                        >
                          B
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-center gap-3">
                    <span className="font-medium text-gray-700">暫定総合</span>
                    <Badge 
                      className="text-lg px-3 py-1"
                      style={{
                        backgroundColor: getGradeDisplay('A', '7stage').bg,
                        color: getGradeDisplay('A', '7stage').color
                      }}
                    >
                      A
                    </Badge>
                    <span className="font-bold text-gray-800">24.1点 / 25点</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 補足情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📋 評価補足情報</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">評価確定日</div>
                  <div className="font-medium">2024年3月31日</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">経験レベル</div>
                  <div className="font-medium">{v3Evaluation?.experienceLabel || '中堅'}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">評価期間</div>
                  <div className="font-medium">2023年4月〜2024年3月</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 詳細評価内訳エリア */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📋 評価項目詳細（V3システム構成）</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
            
                {/* 技術評価の詳細 */}
                <div className="border rounded-lg p-4" style={{ borderLeftColor: CHART_COLORS.primary, borderLeftWidth: '4px' }}>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                      🔧 技術評価（50点満点）
                    </h4>
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-bold" style={{ color: CHART_COLORS.primary }}>
                        {v3Evaluation?.technicalScore?.total || 40}点
                      </span>
                      <span className="text-gray-500">/ 50点</span>
                    </div>
                  </div>
                  
                  <div className={styles.breakdownItems}>
                  <div className={styles.breakdownCategory}>
                    <div className={styles.categoryHeader}>
                      <span className={styles.categoryIcon}>🏢</span>
                      <span className={styles.categoryTitle}>法人統一項目（30点）</span>
                      <span className={styles.categoryScore}>{v3Evaluation?.technicalScore?.coreItems || 24}点</span>
                    </div>
                    <div className={styles.categoryItems}>
                      <div className={styles.evaluationItem}>
                        <span className={styles.itemCode}>C01</span>
                        <span className={styles.itemName}>専門技術・スキル</span>
                        <div className={styles.itemScore}>
                          <span className={styles.score}>8.2点</span>
                          <span className={styles.maxScore}>/ 10点</span>
                        </div>
                        <div className={styles.itemDistribution}>
                          上司評価: 6.0点 | 本人評価: 2.2点
                        </div>
                      </div>
                      <div className={styles.evaluationItem}>
                        <span className={styles.itemCode}>C02</span>
                        <span className={styles.itemName}>対人関係・ケア</span>
                        <div className={styles.itemScore}>
                          <span className={styles.score}>8.5点</span>
                          <span className={styles.maxScore}>/ 10点</span>
                        </div>
                        <div className={styles.itemDistribution}>
                          上司評価: 4.8点 | 本人評価: 3.7点
                        </div>
                      </div>
                      <div className={styles.evaluationItem}>
                        <span className={styles.itemCode}>C03</span>
                        <span className={styles.itemName}>安全・品質管理</span>
                        <div className={styles.itemScore}>
                          <span className={styles.score}>7.3点</span>
                          <span className={styles.maxScore}>/ 10点</span>
                        </div>
                        <div className={styles.itemDistribution}>
                          上司評価: 6.1点 | 本人評価: 1.2点
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.breakdownCategory}>
                    <div className={styles.categoryHeader}>
                      <span className={styles.categoryIcon}>🎯</span>
                      <span className={styles.categoryTitle}>施設特化項目（20点）</span>
                      <span className={styles.categoryScore}>{v3Evaluation?.technicalScore?.facilityItems || 16}点</span>
                    </div>
                    <div className={styles.categoryItems}>
                      <div className={styles.evaluationItem}>
                        <span className={styles.itemCode}>F01</span>
                        <span className={styles.itemName}>回復期リハビリテーション専門性</span>
                        <div className={styles.itemScore}>
                          <span className={styles.score}>8.0点</span>
                          <span className={styles.maxScore}>/ 10点</span>
                        </div>
                      </div>
                      <div className={styles.evaluationItem}>
                        <span className={styles.itemCode}>F02</span>
                        <span className={styles.itemName}>多職種連携・チームケア</span>
                        <div className={styles.itemScore}>
                          <span className={styles.score}>8.0点</span>
                          <span className={styles.maxScore}>/ 10点</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

                {/* 組織貢献度評価の詳細 */}
                <div className="border rounded-lg p-4" style={{ borderLeftColor: CHART_COLORS.success, borderLeftWidth: '4px' }}>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                      🌟 組織貢献度評価（50点満点）
                    </h4>
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-bold" style={{ color: CHART_COLORS.success }}>
                        {v3Evaluation?.contributionScore?.total || 41}点
                      </span>
                      <span className="text-gray-500">/ 50点</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <span>🏢</span>
                          <span className="font-medium">施設内貢献度（25点）</span>
                        </div>
                        <Badge style={{ backgroundColor: CHART_COLORS.success, color: 'white' }}>
                          {v3Evaluation?.contributionScore?.facility || 22}点
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">夏季・冬季の相対評価を統合した年間評価</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex justify-between items-center p-2 bg-white rounded border">
                          <span className="text-sm font-medium">夏季評価</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">12.3点 / 12.5点</span>
                            <Badge 
                              style={{
                                backgroundColor: getGradeDisplay('A', '5stage').bg,
                                color: getGradeDisplay('A', '5stage').color
                              }}
                            >
                              A
                            </Badge>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-white rounded border">
                          <span className="text-sm font-medium">冬季評価</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">12.0点 / 12.5点</span>
                            <Badge 
                              style={{
                                backgroundColor: getGradeDisplay('A', '5stage').bg,
                                color: getGradeDisplay('A', '5stage').color
                              }}
                            >
                              A
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <span>🌐</span>
                          <span className="font-medium">法人内貢献度（25点）</span>
                        </div>
                        <Badge style={{ backgroundColor: CHART_COLORS.warning, color: 'white' }}>
                          {v3Evaluation?.contributionScore?.corporate || 19}点
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">法人全体での相対評価（全850名中89位）</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex justify-between items-center p-2 bg-white rounded border">
                          <span className="text-sm font-medium">夏季評価</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">11.8点 / 12.5点</span>
                            <Badge 
                              style={{
                                backgroundColor: getGradeDisplay('B', '5stage').bg,
                                color: getGradeDisplay('B', '5stage').color
                              }}
                            >
                              B
                            </Badge>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-white rounded border">
                          <span className="text-sm font-medium">冬季評価</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">11.5点 / 12.5点</span>
                            <Badge 
                              style={{
                                backgroundColor: getGradeDisplay('B', '5stage').bg,
                                color: getGradeDisplay('B', '5stage').color
                              }}
                            >
                              B
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 総合判定の詳細 */}
                <div className="border rounded-lg p-4" style={{ borderLeftColor: CHART_COLORS.highlight, borderLeftWidth: '4px' }}>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                      ⭐ 総合判定（7段階評価）
                    </h4>
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-bold" style={{ color: CHART_COLORS.highlight }}>
                        {v3Evaluation?.totalScore || 81}点
                      </span>
                      <span className="text-gray-500">/ 100点</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h5 className="font-medium mb-3">📊 グレード基準</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <Badge style={{ backgroundColor: '#fff0f0', color: '#8B0000' }}>S+</Badge>
                        <span className="text-sm">95-100点</span>
                        <span className="text-sm font-medium">超優秀</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <Badge style={{ backgroundColor: '#fff0f0', color: '#FF0000' }}>S</Badge>
                        <span className="text-sm">90-94点</span>
                        <span className="text-sm font-medium">卓越</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <Badge style={{ backgroundColor: '#fff5f0', color: '#FF4500' }}>A+</Badge>
                        <span className="text-sm">85-89点</span>
                        <span className="text-sm font-medium">優秀+</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-yellow-50 rounded border-2 border-yellow-200">
                        <Badge style={{ backgroundColor: '#fff8f0', color: '#FFA500' }} className="font-bold">A</Badge>
                        <span className="text-sm font-bold">80-84点</span>
                        <span className="text-sm font-bold text-yellow-700">優秀 ← 現在</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <Badge style={{ backgroundColor: '#f0fff0', color: '#32CD32' }}>B</Badge>
                        <span className="text-sm">70-79点</span>
                        <span className="text-sm font-medium">良好</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <Badge style={{ backgroundColor: '#f0f8ff', color: '#1E90FF' }}>C</Badge>
                        <span className="text-sm">60-69点</span>
                        <span className="text-sm font-medium">普通</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <Badge style={{ backgroundColor: '#f8f8f8', color: '#808080' }}>D</Badge>
                        <span className="text-sm">0-59点</span>
                        <span className="text-sm font-medium">要改善</span>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            </CardContent>
          </Card>

          {/* 総合成長分析 - SWOT分析アプローチ */}
          <div className={styles.evaluationRecommendations}>
            <h3 className={styles.recommendationTitle}>🎯 総合成長分析</h3>
            <div className={styles.recommendationGrid}>
              <div className={styles.recommendationCard}>
                <div className={styles.recommendationIcon}>💪</div>
                <div className={styles.recommendationContent}>
                  <h4>強み・優位性</h4>
                  <p>施設内貢献度が法人内より高く、現場での活躍が顕著です。専門技術とケア提供力、チームワーク力に優れ、患者・家族からの信頼も厚い状況です。</p>
                </div>
              </div>
              <div className={styles.recommendationCard}>
                <div className={styles.recommendationIcon}>⚠️</div>
                <div className={styles.recommendationContent}>
                  <h4>課題・改善点</h4>
                  <p>法人規模での認知度が不足しており、横断的なネットワーク構築が課題です。また、リーダーシップスキルと法人全体への貢献度向上が必要な領域です。</p>
                </div>
              </div>
              <div className={styles.recommendationCard}>
                <div className={styles.recommendationIcon}>🚀</div>
                <div className={styles.recommendationContent}>
                  <h4>成長目標</h4>
                  <p>Sグレード（90点以上）到達に向け、強みを活かしつつ課題を克服する。施設横断プロジェクトへの参加や法人内での存在感向上を目指してください。</p>
                </div>
              </div>
              <div className={styles.recommendationCard}>
                <div className={styles.recommendationIcon}>📋</div>
                <div className={styles.recommendationContent}>
                  <h4>行動計画</h4>
                  <p>1) 法人内勉強会での発表・事例共有　2) 施設横断プロジェクトへの積極参加　3) 新人指導制度でのメンター役　4) 安全・品質管理スキル向上研修受講</p>
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
  const { handleError, clearError } = useErrorHandler()
  const [recruitmentData, setRecruitmentData] = useState<any>(null)
  const [recruitmentAnalysisData, setRecruitmentAnalysisData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeRecruitmentTab, setActiveRecruitmentTab] = useState('dashboard')

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
        
        // 採用分析データを生成
        const analysisData = await RecruitmentAnalysisService.generateRecruitmentAnalysis(selectedStaff.id)
        setRecruitmentAnalysisData(analysisData)
        
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
          },
          onboardingProgress: {
            orientation: true,
            mentorAssigned: true,
            skillAssessment: true,
            probationReview: true,
            completionRate: 100
          }
        }

        setRecruitmentData(mockRecruitmentData)
      } catch (error) {
        const appError = new AppError(
          'RECRUITMENT_DATA_LOAD_FAILED',
          '採用データの取得に失敗しました',
          ErrorLevel.ERROR,
          { staffId: selectedStaff?.id, error }
        )
        handleError(appError)
      } finally {
        setIsLoading(false)
      }
    }

    if (selectedStaff?.id) {
      loadRecruitmentData()
    }
  }, [selectedStaff?.id])

  const recruitmentSubTabs = [
    { id: 'dashboard', label: '統合ダッシュボード', icon: '🔮' },
    { id: 'overview', label: '採用概要', icon: '📋' },
    { id: 'placement', label: '配属履歴', icon: '🏢' },
    { id: 'aptitude', label: '適性評価', icon: '🎯' },
    { id: 'career', label: 'キャリア計画', icon: '🚀' }
  ]

  return (
    <div className={styles.tabContentSection}>
      <div className={styles.sectionHeader}>
        <h2>👋 採用・配属統合分析</h2>
        <div className={styles.sectionActions}>
          <button className={styles.actionButton} onClick={() => router.push('/recruitment-management')}>
            採用管理詳細
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
          {activeRecruitmentTab === 'dashboard' && recruitmentAnalysisData && (
            <RecruitmentDashboard data={recruitmentAnalysisData} />
          )}

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

          {activeRecruitmentTab === 'career' && recruitmentAnalysisData && (
            <div className={styles.careerPlanSection}>
              {/* キャリア開発計画の概要 */}
              <div 
                className="mb-4 p-3 rounded-lg border-l-4"
                style={{ 
                  borderLeftColor: '#2563eb',
                  backgroundColor: 'rgba(37, 99, 235, 0.1)' 
                }}
              >
                <h3 className="text-lg font-semibold mb-2">
                  🚀 キャリア開発計画
                </h3>
                <p className="text-gray-700">
                  {recruitmentAnalysisData.staffName}さんの希望専門分野
                  <span style={{ color: '#16a34a', fontWeight: 'bold' }}>
                    「{recruitmentAnalysisData.careerPath.preferredSpecialty}」
                  </span>
                  での成長を支援。昇進準備度
                  <span style={{ color: '#2563eb', fontWeight: 'bold' }}>
                    {recruitmentAnalysisData.careerPath.promotionReadiness}%
                  </span>
                  で順調に進捗中です。
                </p>
              </div>

              {/* キャリア目標 */}
              <div className={styles.careerGoalsCard}>
                <h4>🎯 キャリア目標</h4>
                <div className={styles.goalsList}>
                  {recruitmentAnalysisData.careerPath.careerGoals.map((goal: string, index: number) => (
                    <div key={index} className={styles.goalItem}>
                      <span className={styles.goalIcon}>•</span>
                      <span className={styles.goalText}>{goal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 能力開発計画 */}
              <div className={styles.developmentPlanCard}>
                <h4>📈 能力開発計画</h4>
                <div className={styles.developmentGrid}>
                  {recruitmentAnalysisData.careerPath.developmentPlan.map((plan: any, index: number) => (
                    <div key={index} className={styles.developmentItem}>
                      <div className={styles.developmentHeader}>
                        <span className={styles.skillName}>{plan.skill}</span>
                        <span className={styles.timeline}>{plan.timeline}</span>
                      </div>
                      <div className={styles.skillProgress}>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill}
                            style={{ width: `${(plan.currentLevel / plan.targetLevel) * 100}%` }}
                          />
                        </div>
                        <span className={styles.progressText}>
                          {plan.currentLevel} → {plan.targetLevel}
                        </span>
                      </div>
                      <div className={styles.method}>{plan.method}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* メンターシップニーズ */}
              <div className={styles.mentorshipCard}>
                <h4>🤝 メンターシップニーズ</h4>
                <div className={styles.mentorshipList}>
                  {recruitmentAnalysisData.careerPath.mentorshipNeeds.map((need: string, index: number) => (
                    <div key={index} className={styles.mentorshipItem}>
                      <span className={styles.needIcon}>🎓</span>
                      <span className={styles.needText}>{need}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 昇進予測 */}
              <div 
                className="p-4 rounded-lg border-l-4"
                style={{ 
                  borderLeftColor: '#16a34a',
                  backgroundColor: 'rgba(22, 163, 74, 0.1)' 
                }}
              >
                <h4 className="font-medium mb-2">📊 昇進予測分析</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">次期配属推奨:</span>
                    <div className="font-medium text-blue-700">
                      {recruitmentAnalysisData.careerPath.nextPlacementRecommendation}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">予想昇進時期:</span>
                    <div className="font-medium text-green-700">
                      {recruitmentAnalysisData.careerPath.estimatedPromotionTimeframe}
                    </div>
                  </div>
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
  const { handleError, clearError } = useErrorHandler()
  const [interviewData, setInterviewData] = useState<any>(null)
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
        
        // StaffCardInterviewServiceを使用してデータ取得
        const interviewSummaryData = await StaffCardInterviewService.generateSummaryData(selectedStaff.id)
        const regularData = await StaffCardInterviewService.generateCategorySummaryData(selectedStaff.id, 'regular')
        const specialData = await StaffCardInterviewService.generateCategorySummaryData(selectedStaff.id, 'special')
        const supportData = await StaffCardInterviewService.generateCategorySummaryData(selectedStaff.id, 'support')

        const mockInterviewData = {
          // 概要サマリー
          overview: {
            totalInterviews: interviewSummaryData.totalInterviews,
            latestDate: interviewSummaryData.latestInterviewDate,
            latestType: interviewSummaryData.latestInterviewType,
            latestFeedback: interviewSummaryData.latestFeedback,
            nextScheduled: interviewSummaryData.nextScheduledDate,
            nextType: interviewSummaryData.nextScheduledType
          },
          // 定期面談データ
          regular: {
            summary: {
              total: regularData.totalCount,
              lastDate: regularData.latestDate,
              avgScore: regularData.avgScore,
              trend: regularData.trend
            },
            interviews: regularData.recentInterviews || []
          },
          // 特別面談データ
          special: {
            summary: {
              total: specialData.totalCount,
              lastDate: specialData.latestDate,
              mainReason: specialData.mainReason,
              outcome: specialData.outcome
            },
            interviews: specialData.recentInterviews || []
          },
          // サポート面談データ
          support: {
            summary: {
              total: supportData.totalCount,
              lastDate: supportData.latestDate,
              mainCategory: supportData.mainCategory,
              supportLevel: supportData.supportLevel
            },
            interviews: supportData.recentInterviews || []
          }
        }

        setInterviewData(mockInterviewData)
      } catch (error) {
        const appError = new AppError(
          'INTERVIEW_DATA_LOAD_FAILED',
          '面談データの取得に失敗しました',
          ErrorLevel.ERROR,
          { staffId: selectedStaff?.id, error }
        )
        handleError(appError)
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
    { id: 'regular', label: '定期面談', icon: '📅' },
    { id: 'special', label: '特別面談', icon: '⚡' },
    { id: 'support', label: 'サポート面談', icon: '🤝' }
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
              {/* 概要サマリーエリア */}
              <div className={styles.interviewSummaryEnhanced}>
                <div className={styles.summaryMainCard}>
                  <div className={styles.summaryCardHeader}>
                    <span className={styles.summaryIcon}>💬</span>
                    <h3>面談・指導状況サマリー</h3>
                  </div>
                  
                  <div className={styles.summaryStats}>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{interviewData?.overview?.totalInterviews || 0}</span>
                      <span className={styles.statLabel}>総面談回数</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{interviewData?.overview?.latestDate || '未実施'}</span>
                      <span className={styles.statLabel}>最新実施日</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{interviewData?.regular?.summary?.avgScore || '-'}</span>
                      <span className={styles.statLabel}>最新評価</span>
                    </div>
                  </div>

                  <div className={styles.latestInterviewInfo}>
                    <div className={styles.latestType}>
                      最新面談: {interviewData?.overview?.latestType}
                    </div>
                    <div className={styles.latestFeedback}>
                      {interviewData?.overview?.latestFeedback}
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
                        {interviewData?.overview?.nextScheduled || '未設定'}
                      </div>
                      <div className={styles.cardSubInfo}>
                        {interviewData?.overview?.nextType || '面談スケジュール未設定'}
                      </div>
                      <button className={styles.cardAction} onClick={handleNewInterview}>
                        面談開始
                      </button>
                    </div>
                  </div>

                  <div className={styles.categoryStatsCard}>
                    <div className={styles.cardIconWrapper}>
                      <span className={styles.cardIcon}>📊</span>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.cardTitle}>カテゴリ別実績</div>
                      <div className={styles.categoryStats}>
                        <div className={styles.categoryStat}>
                          <span className={styles.categoryLabel}>定期</span>
                          <span className={styles.categoryValue}>{interviewData?.regular?.summary?.total || 0}回</span>
                        </div>
                        <div className={styles.categoryStat}>
                          <span className={styles.categoryLabel}>特別</span>
                          <span className={styles.categoryValue}>{interviewData?.special?.summary?.total || 0}回</span>
                        </div>
                        <div className={styles.categoryStat}>
                          <span className={styles.categoryLabel}>サポート</span>
                          <span className={styles.categoryValue}>{interviewData?.support?.summary?.total || 0}回</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 横断的な面談履歴概要 */}
              <div className={styles.crossCategoryOverview}>
                <h3>📋 全カテゴリ横断履歴</h3>
                <div className={styles.overviewCards}>
                  <div className={styles.overviewCard}>
                    <div className={styles.overviewCardHeader}>
                      <span className={styles.categoryIcon}>📅</span>
                      <span className={styles.categoryTitle}>定期面談</span>
                    </div>
                    <div className={styles.overviewStats}>
                      <span>実施回数: {interviewData?.regular?.summary?.total}回</span>
                      <span>最新: {interviewData?.regular?.summary?.lastDate}</span>
                      <span>評価傾向: {interviewData?.regular?.summary?.trend === 'improving' ? '向上中 📈' : '安定 ➡️'}</span>
                    </div>
                  </div>
                  <div className={styles.overviewCard}>
                    <div className={styles.overviewCardHeader}>
                      <span className={styles.categoryIcon}>⚡</span>
                      <span className={styles.categoryTitle}>特別面談</span>
                    </div>
                    <div className={styles.overviewStats}>
                      <span>実施回数: {interviewData?.special?.summary?.total}回</span>
                      <span>最新: {interviewData?.special?.summary?.lastDate || '未実施'}</span>
                      <span>結果: {interviewData?.special?.summary?.outcome === 'resolved' ? '解決済 ✅' : '対応中 ⏳'}</span>
                    </div>
                  </div>
                  <div className={styles.overviewCard}>
                    <div className={styles.overviewCardHeader}>
                      <span className={styles.categoryIcon}>🤝</span>
                      <span className={styles.categoryTitle}>サポート面談</span>
                    </div>
                    <div className={styles.overviewStats}>
                      <span>実施回数: {interviewData?.support?.summary?.total}回</span>
                      <span>最新: {interviewData?.support?.summary?.lastDate || '未実施'}</span>
                      <span>支援レベル: {interviewData?.support?.summary?.supportLevel || '未設定'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {activeSubTab === 'regular' && (
        <div className={styles.regularInterviewTab}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <p>定期面談データを読み込み中...</p>
            </div>
          ) : (
            <>
              {/* 定期面談サマリーエリア */}
              <div className={styles.categoryTabSummary}>
                <div className={styles.categorySummaryCard}>
                  <div className={styles.summaryCardHeader}>
                    <span className={styles.summaryIcon}>📅</span>
                    <h3>定期面談サマリー</h3>
                  </div>
                  <div className={styles.summaryContent}>
                    <div className={styles.summaryMetrics}>
                      <div className={styles.metricItem}>
                        <span className={styles.metricValue}>{interviewData?.regular?.summary?.total || 0}</span>
                        <span className={styles.metricLabel}>実施回数</span>
                      </div>
                      <div className={styles.metricItem}>
                        <span className={styles.metricValue}>{interviewData?.regular?.summary?.lastDate || '未実施'}</span>
                        <span className={styles.metricLabel}>最新実施</span>
                      </div>
                      <div className={styles.metricItem}>
                        <span className={styles.metricValue}>{interviewData?.regular?.summary?.avgScore || '-'}</span>
                        <span className={styles.metricLabel}>平均評価</span>
                      </div>
                      <div className={styles.metricItem}>
                        <span className={styles.metricValue}>
                          {interviewData?.regular?.summary?.trend === 'improving' ? '📈 向上' : '➡️ 安定'}
                        </span>
                        <span className={styles.metricLabel}>傾向</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* データ可視化セクション */}
              {interviewData?.regular?.interviews?.length > 0 && (
                <div className={styles.dataVisualizationSection}>
                  <InterviewDataVisualization
                    staffId={selectedStaff.id}
                    category="regular"
                    data={{
                      trends: {
                        scores: interviewData.regular.interviews.map((i: any) => 
                          i.overallScore === 'A' ? 85 : i.overallScore === 'B+' ? 80 : i.overallScore === 'B' ? 75 : 70
                        ),
                        dates: interviewData.regular.interviews.map((i: any) => i.date),
                        avgScore: 81
                      },
                      responsePatterns: [
                        {
                          questionId: 'career_goal',
                          question: 'キャリア目標について教えてください',
                          responses: interviewData.regular.interviews.map((i: any) => ({
                            date: i.date,
                            response: i.summary,
                            score: i.overallScore === 'A' ? 85 : 80
                          }))
                        }
                      ],
                      insights: {
                        strengths: ['V3評価システムでの安定した成果', '技術評価80点台維持'],
                        improvements: ['法人規模での貢献度向上', 'リーダーシップスキル強化'],
                        keyTrends: ['継続的な成長傾向', '組織貢献度の向上余地あり']
                      }
                    }}
                  />
                </div>
              )}

              {/* 定期面談履歴詳細 */}
              <div className={styles.interviewHistoryDetail}>
                <h3>📋 定期面談履歴</h3>
                <div className={styles.interviewsList}>
                  {interviewData?.regular?.interviews?.map((interview: any) => (
                    <div key={interview.id} className={styles.detailedInterviewCard}>
                      <div className={styles.interviewCardHeader}>
                        <div className={styles.interviewBasicInfo}>
                          <span className={styles.interviewDate}>{interview.date}</span>
                          <span className={styles.interviewSubtype}>{interview.subtypeLabel}</span>
                          <span className={styles.interviewer}>面談者: {interview.interviewer}</span>
                        </div>
                        <div className={styles.interviewScore}>
                          <span className={`${styles.scoreBadge} ${styles[interview.overallScore?.toLowerCase()]}`}>
                            {interview.overallScore}
                          </span>
                        </div>
                      </div>
                      <div className={styles.interviewCardContent}>
                        <div className={styles.interviewSummary}>
                          {interview.summary}
                        </div>
                        <div className={styles.keyTopics}>
                          <strong>主要テーマ:</strong>
                          {interview.keyTopics?.map((topic: string, index: number) => (
                            <span key={index} className={styles.topicChip}>{topic}</span>
                          ))}
                        </div>
                        <div className={styles.nextActionsDetail}>
                          <strong>次回アクション:</strong>
                          <ul>
                            {interview.nextActions?.map((action: string, index: number) => (
                              <li key={index}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {activeSubTab === 'special' && (
        <div className={styles.specialInterviewTab}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <p>特別面談データを読み込み中...</p>
            </div>
          ) : (
            <>
              {/* 特別面談サマリーエリア */}
              <div className={styles.categoryTabSummary}>
                <div className={styles.categorySummaryCard}>
                  <div className={styles.summaryCardHeader}>
                    <span className={styles.summaryIcon}>⚡</span>
                    <h3>特別面談サマリー</h3>
                  </div>
                  <div className={styles.summaryContent}>
                    <div className={styles.summaryMetrics}>
                      <div className={styles.metricItem}>
                        <span className={styles.metricValue}>{interviewData?.special?.summary?.total || 0}</span>
                        <span className={styles.metricLabel}>実施回数</span>
                      </div>
                      <div className={styles.metricItem}>
                        <span className={styles.metricValue}>{interviewData?.special?.summary?.lastDate || '未実施'}</span>
                        <span className={styles.metricLabel}>最新実施</span>
                      </div>
                      <div className={styles.metricItem}>
                        <span className={styles.metricValue}>
                          {interviewData?.special?.summary?.mainReason === 'career-consultation' ? 'キャリア相談' : '其他'}
                        </span>
                        <span className={styles.metricLabel}>主な理由</span>
                      </div>
                      <div className={styles.metricItem}>
                        <span className={styles.metricValue}>
                          {interviewData?.special?.summary?.outcome === 'resolved' ? '✅ 解決' : '⏳ 継続'}
                        </span>
                        <span className={styles.metricLabel}>結果</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 特別面談履歴詳細 */}
              <div className={styles.interviewHistoryDetail}>
                <h3>📋 特別面談履歴</h3>
                {interviewData?.special?.interviews?.length > 0 ? (
                  <div className={styles.interviewsList}>
                    {interviewData.special.interviews.map((interview: any) => (
                      <div key={interview.id} className={styles.detailedInterviewCard}>
                        <div className={styles.interviewCardHeader}>
                          <div className={styles.interviewBasicInfo}>
                            <span className={styles.interviewDate}>{interview.date}</span>
                            <span className={styles.interviewSubtype}>{interview.subtypeLabel}</span>
                            <span className={styles.interviewer}>面談者: {interview.interviewer}</span>
                          </div>
                          <div className={styles.interviewOutcome}>
                            <span className={`${styles.outcomeBadge} ${styles[interview.outcome]}`}>
                              {interview.outcome === 'action-plan-created' ? '対策完了' : '対応中'}
                            </span>
                          </div>
                        </div>
                        <div className={styles.interviewCardContent}>
                          <div className={styles.interviewReason}>
                            <strong>面談理由:</strong> {interview.reason}
                          </div>
                          <div className={styles.interviewSummary}>
                            {interview.summary}
                          </div>
                          <div className={styles.nextActionsDetail}>
                            <strong>対応策:</strong>
                            <ul>
                              {interview.nextActions?.map((action: string, index: number) => (
                                <li key={index}>{action}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.noDataMessage}>
                    <p>特別面談の実施記録はありません</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {activeSubTab === 'support' && (
        <div className={styles.supportInterviewTab}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <p>サポート面談データを読み込み中...</p>
            </div>
          ) : (
            <>
              {/* サポート面談サマリーエリア */}
              <div className={styles.categoryTabSummary}>
                <div className={styles.categorySummaryCard}>
                  <div className={styles.summaryCardHeader}>
                    <span className={styles.summaryIcon}>🤝</span>
                    <h3>サポート面談サマリー</h3>
                  </div>
                  <div className={styles.summaryContent}>
                    <div className={styles.summaryMetrics}>
                      <div className={styles.metricItem}>
                        <span className={styles.metricValue}>{interviewData?.support?.summary?.total || 0}</span>
                        <span className={styles.metricLabel}>実施回数</span>
                      </div>
                      <div className={styles.metricItem}>
                        <span className={styles.metricValue}>{interviewData?.support?.summary?.lastDate || '未実施'}</span>
                        <span className={styles.metricLabel}>最新実施</span>
                      </div>
                      <div className={styles.metricItem}>
                        <span className={styles.metricValue}>
                          {interviewData?.support?.summary?.mainCategory === 'skill-development' ? 'スキル開発' : '其他'}
                        </span>
                        <span className={styles.metricLabel}>主要カテゴリ</span>
                      </div>
                      <div className={styles.metricItem}>
                        <span className={styles.metricValue}>
                          {interviewData?.support?.summary?.supportLevel || '未設定'}
                        </span>
                        <span className={styles.metricLabel}>支援レベル</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* サポート面談履歴詳細 */}
              <div className={styles.interviewHistoryDetail}>
                <h3>📋 サポート面談履歴</h3>
                {interviewData?.support?.interviews?.length > 0 ? (
                  <div className={styles.interviewsList}>
                    {interviewData.support.interviews.map((interview: any) => (
                      <div key={interview.id} className={styles.detailedInterviewCard}>
                        <div className={styles.interviewCardHeader}>
                          <div className={styles.interviewBasicInfo}>
                            <span className={styles.interviewDate}>{interview.date}</span>
                            <span className={styles.interviewSubtype}>{interview.subtypeLabel}</span>
                            <span className={styles.interviewer}>担当者: {interview.interviewer}</span>
                          </div>
                          <div className={styles.supportType}>
                            <span className={`${styles.supportBadge} ${styles[interview.supportType]}`}>
                              {interview.supportType === 'training' ? '研修支援' : '個別指導'}
                            </span>
                          </div>
                        </div>
                        <div className={styles.interviewCardContent}>
                          <div className={styles.supportCategory}>
                            <strong>支援カテゴリ:</strong> {interview.category}
                          </div>
                          <div className={styles.interviewSummary}>
                            {interview.summary}
                          </div>
                          <div className={styles.nextActionsDetail}>
                            <strong>今後の支援策:</strong>
                            <ul>
                              {interview.nextActions?.map((action: string, index: number) => (
                                <li key={index}>{action}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.noDataMessage}>
                    <p>サポート面談の実施記録はありません</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export function DevelopmentTab({ selectedStaff }: { selectedStaff: any }) {
  const router = useRouter()
  const { handleError, clearError } = useErrorHandler()
  const [developmentData, setDevelopmentData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeDevelopmentTab, setActiveDevelopmentTab] = useState('growth')

  if (!selectedStaff) {
    return (
      <div className={styles.noDataContainer}>
        <p>職員を選択してください</p>
      </div>
    )
  }

  useEffect(() => {
    const loadDevelopmentData = async () => {
      try {
        setIsLoading(true)
        
        // V3評価システム連動の成長データ（モック）
        const mockDevelopmentData = {
          growthOverview: {
            currentLevel: 'midlevel',
            currentLevelLabel: '中堅',
            nextLevel: 'senior',
            nextLevelLabel: 'シニア/主任候補',
            progressToNext: 65,
            totalExperience: '3年10ヶ月',
            keyAchievements: 3,
            v3GradeProgression: ['C', 'B', 'B+', 'A', 'A']
          },
          skillGrowthData: {
            technical: {
              current: 80,
              target: 90,
              yearlyProgress: [65, 70, 75, 78, 80],
              areas: [
                { skill: '専門看護技術', current: 85, target: 90, growth: '+8' },
                { skill: '医療機器操作', current: 80, target: 85, growth: '+5' },
                { skill: '急変対応', current: 75, target: 85, growth: '+12' }
              ]
            },
            leadership: {
              current: 72,
              target: 80,
              yearlyProgress: [50, 58, 65, 68, 72],
              areas: [
                { skill: 'チーム指導', current: 75, target: 85, growth: '+10' },
                { skill: '新人メンター', current: 80, target: 85, growth: '+8' },
                { skill: 'プロジェクト管理', current: 60, target: 75, growth: '+15' }
              ]
            }
          },
          developmentGoals: [
            {
              id: 'DG001',
              category: 'V3評価向上',
              goal: 'Sグレード達成（90点以上）',
              targetDate: '2025-12-31',
              progress: 65,
              status: 'in_progress',
              keyActions: ['法人規模プロジェクト参加', 'イノベーション創出', '業界リーダーシップ発揮']
            },
            {
              id: 'DG002',
              category: 'キャリア発展',
              goal: '主任昇進準備',
              targetDate: '2026-04-01',
              progress: 45,
              status: 'in_progress',
              keyActions: ['管理職研修受講', 'チーム運営経験', '人事評価スキル習得']
            },
            {
              id: 'DG003',
              category: '専門性向上',
              goal: '認定看護師資格取得',
              targetDate: '2025-09-30',
              progress: 30,
              status: 'planning',
              keyActions: ['受験資格確認', '研修プログラム選択', '学習計画策定']
            }
          ],
          mentorshipData: {
            as_mentor: {
              mentees: 2,
              sessions: 12,
              satisfaction: 4.8,
              areas: ['新人指導', '技術スキル向上']
            },
            as_mentee: {
              mentor: '田中師長',
              sessions: 8,
              focus: ['リーダーシップ開発', '法人貢献度向上'],
              progress: 75
            }
          },
          v3AlignedDevelopment: {
            technicalAlignment: 85,
            contributionAlignment: 78,
            overallAlignment: 81.5,
            improvementAreas: [
              { area: '法人規模での影響力', currentScore: 78, targetScore: 85, developmentPlan: 'クロスファンクショナルプロジェクト参加' },
              { area: '業界トレンド対応', currentScore: 70, targetScore: 80, developmentPlan: '外部研修・学会参加' }
            ]
          }
        }

        setDevelopmentData(mockDevelopmentData)
      } catch (error) {
        const appError = new AppError(
          'DEVELOPMENT_DATA_LOAD_FAILED',
          '成長データの取得に失敗しました',
          ErrorLevel.ERROR,
          { staffId: selectedStaff?.id, error }
        )
        handleError(appError)
      } finally {
        setIsLoading(false)
      }
    }

    if (selectedStaff?.id) {
      loadDevelopmentData()
    }
  }, [selectedStaff?.id])

  const handleDevelopmentPlan = () => {
    router.push(`/training?tab=planning&staffId=${selectedStaff.id}`)
  }

  const handleGoalSetting = () => {
    router.push(`/evaluation?tab=guide&staffId=${selectedStaff.id}`)
  }

  const developmentSubTabs = [
    { id: 'dashboard', label: '教育研修統合', icon: '🎓' },
    { id: 'growth', label: '成長概要', icon: '📈' },
    { id: 'skills', label: 'スキル成長', icon: '🎯' },
    { id: 'goals', label: '成長目標', icon: '🚀' },
    { id: 'mentorship', label: 'メンタリング', icon: '🤝' }
  ]

  return (
    <div className={styles.tabContentSection}>
      <div className={styles.sectionHeader}>
        <h2>🎓 教育・研修統合分析</h2>
        <div className={styles.sectionActions}>
          <button className={styles.actionButton} onClick={handleGoalSetting}>
            目標設定
          </button>
          <button className={styles.actionButtonSecondary} onClick={handleDevelopmentPlan}>
            成長プラン
          </button>
        </div>
      </div>

      {/* サブタブ */}
      <div className={styles.tabNavigation} style={{ marginBottom: '20px' }}>
        {developmentSubTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveDevelopmentTab(tab.id)}
            className={`${styles.tabButton} ${activeDevelopmentTab === tab.id ? styles.active : ''}`}
            style={{ fontSize: '14px', padding: '8px 16px' }}
          >
            <span style={{ marginRight: '4px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <p>成長データを読み込み中...</p>
        </div>
      ) : (
        <>
          {activeDevelopmentTab === 'dashboard' && trainingAnalysisData && (
            <TrainingDashboard data={trainingAnalysisData} />
          )}

          {activeDevelopmentTab === 'growth' && (
            <div className={styles.growthOverview}>
              <div className={styles.growthSummaryCard}>
                <h3>📊 成長概要</h3>
                <div className={styles.growthStats}>
                  <div className={styles.growthStatItem}>
                    <span className={styles.statLabel}>現在レベル</span>
                    <span className={styles.statValue}>{developmentData?.growthOverview?.currentLevelLabel}</span>
                  </div>
                  <div className={styles.growthStatItem}>
                    <span className={styles.statLabel}>次段階進捗</span>
                    <span className={styles.statValue}>{developmentData?.growthOverview?.progressToNext}%</span>
                  </div>
                  <div className={styles.growthStatItem}>
                    <span className={styles.statLabel}>経験年数</span>
                    <span className={styles.statValue}>{developmentData?.growthOverview?.totalExperience}</span>
                  </div>
                  <div className={styles.growthStatItem}>
                    <span className={styles.statLabel}>主要成果</span>
                    <span className={styles.statValue}>{developmentData?.growthOverview?.keyAchievements}件</span>
                  </div>
                </div>
              </div>

              <div className={styles.v3GradeProgressionCard}>
                <h3>📈 V3評価グレード推移</h3>
                <div className={styles.gradeProgression}>
                  {developmentData?.growthOverview?.v3GradeProgression?.map((grade: string, index: number) => (
                    <div key={index} className={styles.gradeItem}>
                      <div className={styles.gradeYear}>{2020 + index}年度</div>
                      <div 
                        className={styles.gradeBadge} 
                        style={{ 
                          backgroundColor: v3Grades[grade as keyof typeof v3Grades]?.color || '#808080',
                          color: 'white'
                        }}
                      >
                        {grade}
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.progressionInsight}>
                  <span className={styles.trendIcon}>📈</span>
                  <span>継続的な成長を維持。現在Aグレードから次段階Sグレードへの準備段階</span>
                </div>
              </div>

              <div className={styles.v3AlignmentCard}>
                <h3>🔗 V3評価システム成長連動度</h3>
                <div className={styles.alignmentMetrics}>
                  <div className={styles.alignmentItem}>
                    <span className={styles.alignmentLabel}>技術評価連動</span>
                    <span className={styles.alignmentScore}>{developmentData?.v3AlignedDevelopment?.technicalAlignment}%</span>
                  </div>
                  <div className={styles.alignmentItem}>
                    <span className={styles.alignmentLabel}>組織貢献連動</span>
                    <span className={styles.alignmentScore}>{developmentData?.v3AlignedDevelopment?.contributionAlignment}%</span>
                  </div>
                  <div className={styles.alignmentItem}>
                    <span className={styles.alignmentLabel}>総合連動度</span>
                    <span className={styles.alignmentScore}>{developmentData?.v3AlignedDevelopment?.overallAlignment}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeDevelopmentTab === 'skills' && (
            <div className={styles.skillsGrowth}>
              <div className={styles.technicalGrowthCard}>
                <h3>🛠️ 技術スキル成長</h3>
                <div className={styles.skillGrowthChart}>
                  <div className={styles.chartHeader}>
                    <span>現在: {developmentData?.skillGrowthData?.technical?.current}点</span>
                    <span>目標: {developmentData?.skillGrowthData?.technical?.target}点</span>
                  </div>
                  <div className={styles.yearlyProgressBar}>
                    {developmentData?.skillGrowthData?.technical?.yearlyProgress?.map((score: number, index: number) => (
                      <div key={index} className={styles.yearBar}>
                        <div className={styles.barLabel}>{2020 + index}</div>
                        <div className={styles.barContainer}>
                          <div 
                            className={styles.barFill} 
                            style={{ height: `${score}%` }}
                          />
                          <span className={styles.barValue}>{score}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.skillAreas}>
                  {developmentData?.skillGrowthData?.technical?.areas?.map((area: any, index: number) => (
                    <div key={index} className={styles.skillAreaItem}>
                      <div className={styles.skillAreaHeader}>
                        <span className={styles.skillName}>{area.skill}</span>
                        <span className={styles.skillGrowth}>+{area.growth}</span>
                      </div>
                      <div className={styles.skillProgress}>
                        <div 
                          className={styles.skillBar} 
                          style={{ width: `${area.current}%` }}
                        />
                        <span className={styles.skillScore}>{area.current}/{area.target}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.leadershipGrowthCard}>
                <h3>👥 リーダーシップ成長</h3>
                <div className={styles.skillGrowthChart}>
                  <div className={styles.chartHeader}>
                    <span>現在: {developmentData?.skillGrowthData?.leadership?.current}点</span>
                    <span>目標: {developmentData?.skillGrowthData?.leadership?.target}点</span>
                  </div>
                  <div className={styles.yearlyProgressBar}>
                    {developmentData?.skillGrowthData?.leadership?.yearlyProgress?.map((score: number, index: number) => (
                      <div key={index} className={styles.yearBar}>
                        <div className={styles.barLabel}>{2020 + index}</div>
                        <div className={styles.barContainer}>
                          <div 
                            className={styles.barFill} 
                            style={{ height: `${score}%` }}
                          />
                          <span className={styles.barValue}>{score}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.skillAreas}>
                  {developmentData?.skillGrowthData?.leadership?.areas?.map((area: any, index: number) => (
                    <div key={index} className={styles.skillAreaItem}>
                      <div className={styles.skillAreaHeader}>
                        <span className={styles.skillName}>{area.skill}</span>
                        <span className={styles.skillGrowth}>+{area.growth}</span>
                      </div>
                      <div className={styles.skillProgress}>
                        <div 
                          className={styles.skillBar} 
                          style={{ width: `${area.current}%` }}
                        />
                        <span className={styles.skillScore}>{area.current}/{area.target}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeDevelopmentTab === 'goals' && (
            <div className={styles.developmentGoals}>
              <h3>🎯 成長目標</h3>
              <div className={styles.goalsList}>
                {developmentData?.developmentGoals?.map((goal: any) => (
                  <div key={goal.id} className={styles.goalCard}>
                    <div className={styles.goalHeader}>
                      <div className={styles.goalInfo}>
                        <span className={styles.goalCategory}>{goal.category}</span>
                        <span className={styles.goalTitle}>{goal.goal}</span>
                      </div>
                      <div className={styles.goalStatus}>
                        <span className={`${styles.statusBadge} ${goal.status}`}>
                          {goal.status === 'in_progress' ? '進行中' : '計画中'}
                        </span>
                      </div>
                    </div>
                    <div className={styles.goalProgress}>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill} 
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      <span className={styles.progressText}>{goal.progress}%</span>
                    </div>
                    <div className={styles.goalDetails}>
                      <div className={styles.targetDate}>目標期限: {goal.targetDate}</div>
                      <div className={styles.keyActions}>
                        <strong>主要アクション:</strong>
                        <ul>
                          {goal.keyActions.map((action: string, index: number) => (
                            <li key={index}>{action}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeDevelopmentTab === 'mentorship' && (
            <div className={styles.mentorshipSection}>
              <div className={styles.mentorCard}>
                <h3>🤝 メンタリング状況</h3>
                <div className={styles.mentorshipGrid}>
                  <div className={styles.mentorshipItem}>
                    <h4>メンター活動</h4>
                    <div className={styles.mentorStats}>
                      <div className={styles.mentorStat}>
                        <span className={styles.statValue}>{developmentData?.mentorshipData?.as_mentor?.mentees}</span>
                        <span className={styles.statLabel}>指導中の後輩</span>
                      </div>
                      <div className={styles.mentorStat}>
                        <span className={styles.statValue}>{developmentData?.mentorshipData?.as_mentor?.sessions}</span>
                        <span className={styles.statLabel}>指導セッション</span>
                      </div>
                      <div className={styles.mentorStat}>
                        <span className={styles.statValue}>{developmentData?.mentorshipData?.as_mentor?.satisfaction}</span>
                        <span className={styles.statLabel}>満足度</span>
                      </div>
                    </div>
                    <div className={styles.mentorAreas}>
                      <strong>指導分野:</strong>
                      {developmentData?.mentorshipData?.as_mentor?.areas?.map((area: string, index: number) => (
                        <span key={index} className={styles.areaTag}>{area}</span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.mentorshipItem}>
                    <h4>メンティー活動</h4>
                    <div className={styles.menteeInfo}>
                      <div className={styles.mentorName}>
                        指導者: {developmentData?.mentorshipData?.as_mentee?.mentor}
                      </div>
                      <div className={styles.sessionCount}>
                        セッション数: {developmentData?.mentorshipData?.as_mentee?.sessions}回
                      </div>
                      <div className={styles.progressIndicator}>
                        <span>進捗: {developmentData?.mentorshipData?.as_mentee?.progress}%</span>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill} 
                            style={{ width: `${developmentData?.mentorshipData?.as_mentee?.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className={styles.focusAreas}>
                        <strong>重点分野:</strong>
                        {developmentData?.mentorshipData?.as_mentee?.focus?.map((focus: string, index: number) => (
                          <span key={index} className={styles.focusTag}>{focus}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export function EducationTab({ selectedStaff }: { selectedStaff: any }) {
  const router = useRouter()
  const { handleError, clearError } = useErrorHandler()
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
        const appError = new AppError(
          'TRAINING_DATA_LOAD_FAILED',
          '研修データの取得に失敗しました',
          ErrorLevel.ERROR,
          { staffId: selectedStaff?.id, error }
        )
        handleError(appError)
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