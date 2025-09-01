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
import InterviewInterpretationComments from '@/components/interview/InterviewInterpretationComments'
import { CrossTabAnalysisService } from '@/services/crossTabAnalysisService'
import ComprehensiveGrowthTrend from '@/components/charts/ComprehensiveGrowthTrend'
import StaffPortfolioAnalysis from '@/components/charts/StaffPortfolioAnalysis'
import StrengthsWeaknessesMap from '@/components/charts/StrengthsWeaknessesMap'
import GrowthPredictionDashboard from '@/components/charts/GrowthPredictionDashboard'
import { RecruitmentAnalysisService } from '@/services/recruitmentAnalysisService'
import RecruitmentDashboard from '@/components/recruitment/RecruitmentDashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Target, Award, Calendar, BarChart3, Users, FileText, GitCompare } from 'lucide-react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip, Legend as RechartsLegend } from 'recharts'
import styles from './StaffCards.module.css'
import InterviewSheetModal from '@/components/InterviewSheetModal'
import SectionTrendAnalysis from '@/components/interview/SectionTrendAnalysis'
import PersonalizedEducationDashboard from '@/components/personalized/PersonalizedEducationDashboard'

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

// 職員の職階を判定する関数
function getStaffRole(staff: any): string {
  if (!staff) return 'general-nurse';
  
  const title = (staff.title || staff.position || '').toLowerCase();
  const name = (staff.name || '').toLowerCase();
  const experienceYears = staff.experienceYears || 0;
  
  // 病棟師長・師長
  if (title.includes('師長') || title.includes('manager')) {
    return 'ward-manager';
  }
  
  // 主任・チーフ
  if (title.includes('主任') || title.includes('chief') || title.includes('チーフ')) {
    return 'chief-nurse';
  }
  
  // 先輩看護師（経験5年以上）
  if (experienceYears >= 5 || title.includes('先輩') || title.includes('senior')) {
    return 'senior-nurse';
  }
  
  // デフォルトは一般看護師
  return 'general-nurse';
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
          {/* 統合評価サマリー（冒頭表示） */}
          <Card className="border-l-4 mb-8" style={{ borderLeftColor: CHART_COLORS.highlight }}>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                🏆 V3評価システム 統合サマリー（2024年3月確定）
              </CardTitle>
              {/* メタ情報 */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 bg-gray-50 px-4 py-3 rounded-lg mt-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">📅 評価確定日:</span>
                  <span>2024年3月31日</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">👤 経験レベル:</span>
                  <span>{v3Evaluation?.experienceLabel || '中堅'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">📋 評価期間:</span>
                  <span>2023年4月〜2024年3月</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* 統合3軸評価表示 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 総合判定（7段階） */}
                <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <h5 className="font-bold text-lg mb-2 text-gray-800">⭐ 総合判定</h5>
                  <p className="text-sm text-gray-600 mb-3">(7段階評価)</p>
                  <div 
                    className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl font-bold mb-3"
                    style={{
                      backgroundColor: getGradeDisplay('A', '7stage').bg,
                      color: getGradeDisplay('A', '7stage').color,
                      border: `4px solid ${getGradeDisplay('A', '7stage').color}`
                    }}
                  >
                    A
                  </div>
                  <div className="text-2xl font-bold mb-2" style={{ color: CHART_COLORS.highlight }}>
                    {v3Evaluation?.totalScore || 81.25}点
                  </div>
                  <p className="text-sm font-medium text-gray-700">優秀</p>
                </div>

                {/* 施設内評価（5段階） */}
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <h5 className="font-bold text-lg mb-2 text-gray-800">🏢 施設内評価</h5>
                  <p className="text-sm text-gray-600 mb-3">(5段階評価)</p>
                  <div 
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl font-bold mb-3"
                    style={{
                      backgroundColor: getGradeDisplay('A', '5stage').bg,
                      color: getGradeDisplay('A', '5stage').color,
                      border: `3px solid ${getGradeDisplay('A', '5stage').color}`
                    }}
                  >
                    A
                  </div>
                  <div className="space-y-1 mb-3">
                    <div className="text-sm font-medium text-gray-800">
                      {getRelativeRanking('facility').rank}位 / {getRelativeRanking('facility').total}人中
                    </div>
                    <Badge style={{ backgroundColor: CHART_COLORS.success, color: 'white' }}>
                      上位{100 - getRelativeRanking('facility').percentile}%
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-gray-700">優秀</p>
                </div>

                {/* 法人内評価（5段階） */}
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <h5 className="font-bold text-lg mb-2 text-gray-800">🌐 法人内評価</h5>
                  <p className="text-sm text-gray-600 mb-3">(5段階評価)</p>
                  <div 
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl font-bold mb-3"
                    style={{
                      backgroundColor: getGradeDisplay('B', '5stage').bg,
                      color: getGradeDisplay('B', '5stage').color,
                      border: `3px solid ${getGradeDisplay('B', '5stage').color}`
                    }}
                  >
                    B
                  </div>
                  <div className="space-y-1 mb-3">
                    <div className="text-sm font-medium text-gray-800">
                      {getRelativeRanking('corporate').rank}位 / {getRelativeRanking('corporate').total}人中
                    </div>
                    <Badge style={{ backgroundColor: CHART_COLORS.warning, color: 'white' }}>
                      上位{100 - getRelativeRanking('corporate').percentile}%
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-gray-700">良好</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* レーダーチャート比較セクション - 評価制度の本質を反映 */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold flex items-center gap-2 mb-6">
              📊 評価項目レーダーチャート分析
              <Badge variant="outline" className="text-xs">技術評価50点 ＋ 組織貢献度50点</Badge>
            </h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 技術評価レーダーチャート（法人統一＋施設特化統合版） */}
              <Card className="border-l-4" style={{ borderLeftColor: CHART_COLORS.primary }}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    🎉 技術評価項目（50点満点）
                    <Badge className="bg-blue-100 text-blue-700 text-xs">法人統一＋施設特化</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        data={[
                          { category: 'C01\n専門技術\nスキル', current: 8.2, average: 7.5, target: 8.5, max: 10 },
                          { category: 'C02\n対人関係\nケア', current: 8.5, average: 7.8, target: 9.0, max: 10 },
                          { category: 'C03\n安全\n品質管理', current: 7.3, average: 7.2, target: 8.0, max: 10 },
                          { category: 'F01\n施設特化\n専門性', current: 8.0, average: 7.3, target: 8.5, max: 10 },
                          { category: 'F02\n多職種連携\nチームケア', current: 8.0, average: 7.8, target: 8.5, max: 10 }
                        ]}
                      >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="category" tick={{ fontSize: 10, textAnchor: 'middle' }} />
                        <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fontSize: 10 }} />
                        <Radar
                          name="本人評価"
                          dataKey="current"
                          stroke={CHART_COLORS.primary}
                          fill={CHART_COLORS.primary}
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                        <Radar
                          name="施設平均"
                          dataKey="average"
                          stroke="#6b7280"
                          fill="#6b7280"
                          fillOpacity={0.1}
                          strokeWidth={1}
                          strokeDasharray="5 5"
                        />
                        <Radar
                          name="目標値"
                          dataKey="target"
                          stroke={CHART_COLORS.success}
                          fill={CHART_COLORS.success}
                          fillOpacity={0}
                          strokeWidth={1.5}
                          strokeDasharray="3 3"
                        />
                        <RechartsTooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white p-4 border rounded-lg shadow-lg">
                                  <p className="font-semibold mb-2">{label}</p>
                                  {payload.map((entry: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between mb-1">
                                      <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}/>
                                        <span className="text-sm">{entry.name}</span>
                                      </div>
                                      <span className="font-bold" style={{ color: entry.color }}>
                                        {entry.value}点
                                      </span>
                                    </div>
                                  ))}
                                  <div className="mt-2 pt-2 border-t text-xs text-gray-500">
                                    満点: 10点
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <RechartsLegend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">技術評価合計:</span> 40.0点 / 50点 (80.0%)
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-500">
                      <div>法人統一: 24.0点/30点</div>
                      <div>施設特化: 16.0点/20点</div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      技術・ケア・安全管理・施設専門性の統合評価
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 組織貢献度レーダーチャート（夏季・冬季×施設・法人） */}
              <Card className="border-l-4" style={{ borderLeftColor: CHART_COLORS.success }}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    🎯 組織貢献度評価（50点満点）
                    <Badge className="bg-green-100 text-green-700 text-xs">夏季・冬季評価</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        data={[
                          { category: '夏季\n施設貢献', current: 10.3, average: 9.5, target: 11.0, max: 12.5 },
                          { category: '夏季\n法人貢献', current: 9.8, average: 9.2, target: 10.5, max: 12.5 },
                          { category: '冬季\n施設貢献', current: 11.2, average: 10.0, target: 11.5, max: 12.5 },
                          { category: '冬季\n法人貢献', current: 10.0, average: 9.5, target: 11.0, max: 12.5 }
                        ]}
                      >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="category" tick={{ fontSize: 10, textAnchor: 'middle' }} />
                        <PolarRadiusAxis angle={90} domain={[0, 12.5]} tick={{ fontSize: 10 }} />
                        <Radar
                          name="実績値"
                          dataKey="current"
                          stroke={CHART_COLORS.success}
                          fill={CHART_COLORS.success}
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                        <Radar
                          name="施設平均"
                          dataKey="average"
                          stroke="#6b7280"
                          fill="#6b7280"
                          fillOpacity={0.1}
                          strokeWidth={1}
                          strokeDasharray="5 5"
                        />
                        <Radar
                          name="目標値"
                          dataKey="target"
                          stroke={CHART_COLORS.warning}
                          fill={CHART_COLORS.warning}
                          fillOpacity={0}
                          strokeWidth={1.5}
                          strokeDasharray="3 3"
                        />
                        <RechartsTooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white p-3 border rounded-lg shadow-lg text-sm max-w-48">
                                  <p className="font-medium mb-2 text-xs">{label}</p>
                                  {payload.map((entry: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between mb-1">
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}/>
                                        <span className="text-xs">{entry.name}</span>
                                      </div>
                                      <span className="font-medium text-xs" style={{ color: entry.color }}>
                                        {entry.value}点
                                      </span>
                                    </div>
                                  ))}
                                  <div className="mt-2 pt-2 border-t text-xs text-gray-500">
                                    各項目満点: 12.5点
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <RechartsLegend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">組織貢献度合計:</span> 41.3点 / 50点 (82.6%)
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-500">
                      <div>夏季評価: 20.1点/25点</div>
                      <div>冬季評価: 21.2点/25点</div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      <span className="font-medium">パターン分析:</span> 冬季の施設貢献が特に高い傾向
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 比較分析サマリー */}
            <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
              <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                🔍 レーダーチャート分析
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>法人統一項目:</strong> 対人関係・ケア(8.5点)が特に優秀で、施設平均を大幅に上回っています。</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>施設特化項目:</strong> 両項目とも8.0点で安定しており、施設の専門性に適応できています。</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold">⚠</span>
                    <span><strong>改善点:</strong> 安全・品質管理(7.3点)は他項目と比べやや低めで、継続的な向上が期待されます。</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">💡</span>
                    <span><strong>強み活用:</strong> 高いケア力と専門性を活かし、チーム内のメンター役としても活躍可能です。</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI人事指導支援コメント */}
            <div className="mt-6">
              <div className="border-l-4 border-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <span className="text-purple-600 text-xl">🤖</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-lg text-gray-800">
                        AI人事指導支援アドバイス
                      </h5>
                      <p className="text-sm text-gray-600">
                        レーダーチャート分析に基づく個別指導提案
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-purple-200 text-purple-800 text-xs rounded-full font-medium">
                      ローカルLLM対応予定
                    </div>
                    <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors">
                      解釈生成
                    </button>
                  </div>
                </div>

                {/* AI解釈コメント表示エリア */}
                <div className="space-y-4">
                  {/* 技術評価解釈 */}
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-blue-600 text-lg">🎉</span>
                      <h6 className="font-semibold text-blue-800">技術評価（50点）解釈</h6>
                      <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                        40.0点 (80.0%)
                      </div>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
                        <p className="font-medium text-green-800 mb-1">🌟 優秀な領域</p>
                        <p className="text-green-700">
                          対人関係・ケア能力(8.5点)は施設平均を大幅に上回る優秀な成果です。
                          患者・家族からの信頼が厚く、チーム内でも頼りにされる存在となっています。
                        </p>
                      </div>
                      <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                        <p className="font-medium text-yellow-800 mb-1">⚡ 重点改善領域</p>
                        <p className="text-yellow-700">
                          安全・品質管理(7.3点)の向上が優先課題です。インシデント予防研修の受講と
                          日常業務でのダブルチェック体制の徹底をお勧めします。
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 組織貢献度解釈 */}
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-green-600 text-lg">🎯</span>
                      <h6 className="font-semibold text-green-800">組織貢献度（50点）解釈</h6>
                      <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">
                        41.3点 (82.6%)
                      </div>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                        <p className="font-medium text-blue-800 mb-1">📈 成長パターン</p>
                        <p className="text-blue-700">
                          冬季の施設貢献(11.2点)が夏季を上回っており、経験を積むにつれて
                          貢献度が向上する良好な成長パターンを示しています。
                        </p>
                      </div>
                      <div className="p-3 bg-purple-50 border-l-4 border-purple-400 rounded">
                        <p className="font-medium text-purple-800 mb-1">🎯 次期目標</p>
                        <p className="text-purple-700">
                          法人横断プロジェクトへの参加や他施設での研修経験を通じて、
                          法人内での認知度向上と更なる貢献度アップを目指しましょう。
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 統合指導アドバイス */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-indigo-600 text-lg">💡</span>
                      <h6 className="font-semibold text-indigo-800">統合指導アドバイス</h6>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-800 mb-2">📋 短期アクション（1-3ヶ月）</p>
                        <ul className="space-y-1 text-gray-700">
                          <li className="flex items-start gap-2">
                            <span className="text-orange-500">•</span>
                            <span>安全管理研修の優先受講</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-500">•</span>
                            <span>インシデント予防チェックリスト活用</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-500">•</span>
                            <span>月次1on1面談での進捗確認</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 mb-2">🚀 中長期目標（3-12ヶ月）</p>
                        <ul className="space-y-1 text-gray-700">
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500">•</span>
                            <span>新人指導メンター役の任命</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500">•</span>
                            <span>法人内事例発表会での講師役</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500">•</span>
                            <span>主任昇進への準備・育成プラン</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* LLM実装準備メッセージ */}
                  <div className="mt-4 p-3 bg-gray-100 rounded-lg border">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-yellow-600">⚡</span>
                      <span>
                        <strong>開発予定:</strong> ローカルLLM (Ollama + Llama 3.2) 統合により、
                        より高度で個別最適化された指導アドバイスを自動生成します。
                        職員の経験年数・職種・過去の成長パターンを考慮したパーソナライズド解釈が可能になります。
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

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

// NotebookLM連携用の型定義
interface NotebookLMLink {
  url: string
  noteId: string
  title: string
  linkedInterview: {
    id: string
    date: string
    type: 'regular' | 'special' | 'support'
    category?: string
  }
  createdAt: string
  features: {
    hasAudioSummary: boolean
    hasMindMap: boolean
    hasTranscript: boolean
  }
}

export function InterviewTab({ selectedStaff, onShowNotebookModal }: { 
  selectedStaff: any; 
  onShowNotebookModal?: (interviewData: { id: string; date: string; type: string; subtype?: string }) => void 
}) {
  const router = useRouter()
  const { handleError, clearError } = useErrorHandler()
  const [interviewData, setInterviewData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeSubTab, setActiveSubTab] = useState('overview')
  const [showNotebookLinkModal, setShowNotebookLinkModal] = useState(true)
  const [editingInterviewId, setEditingInterviewId] = useState<string | null>(null)
  const [currentInterviewType, setCurrentInterviewType] = useState<'regular' | 'special' | 'support'>('regular')
  const [currentInterviewDate, setCurrentInterviewDate] = useState<string>('')
  const [currentInterviewCategory, setCurrentInterviewCategory] = useState<string | undefined>(undefined)
  const [notebookLinks, setNotebookLinks] = useState<Record<string, NotebookLMLink>>({})
  const [notebookLinkForm, setNotebookLinkForm] = useState({
    url: ''
  })

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
            totalInterviews: 12,
            latestDate: '2024年3月15日',
            latestType: '定期面談（月次）',
            latestFeedback: 'キャリア目標達成に向けて順調に進展。法人内での貢献度をより高める機会を模索中。',
            nextScheduled: '2024年4月15日',
            nextType: '定期面談（月次）'
          },
          // 定期面談データ（詳細デモデータ付き）
          regular: {
            summary: {
              total: 8,
              lastDate: '2024年3月15日',
              avgScore: 'A',
              trend: 'improving'
            },
            interviews: [
              {
                id: 'reg_001',
                date: '2024年3月15日',
                subtypeLabel: '月次定期面談',
                interviewer: '看護部長',
                overallScore: 'A',
                summary: 'キャリア目標の進捗が順調。特に法人内プロジェクトへの参加意欲が高く、チームリーダーとしての素質を発揮している。技術面での成長も著しく、後輩指導にも積極的に取り組んでいる。',
                keyTopics: ['キャリア開発', 'リーダーシップ', '技術向上', '後輩指導'],
                nextActions: [
                  '法人横断プロジェクトへの参加検討',
                  '主任昇進に向けた研修受講計画の策定',
                  '専門分野のスペシャリスト認定取得準備'
                ],
                notebookLmLink: {
                  url: 'https://notebooklm.google.com/notebook/demo-001',
                  noteId: 'note_reg_001',
                  title: '2024年3月月次面談_田中看護師',
                  createdAt: '2024-03-15T14:30:00Z',
                  features: {
                    hasAudioSummary: true,
                    hasMindMap: true,
                    hasTranscript: true
                  }
                }
              },
              {
                id: 'reg_002',
                date: '2024年2月15日',
                subtypeLabel: '月次定期面談',
                interviewer: '主任看護師',
                overallScore: 'B+',
                summary: '業務習熟度が向上し、患者対応においても安定した成果を示している。チームワークも良好で、同僚からの信頼も厚い。',
                keyTopics: ['業務習熟', '患者対応', 'チームワーク'],
                nextActions: [
                  '専門スキルのさらなる向上',
                  'リーダーシップ研修への参加検討'
                ]
              }
            ]
          },
          // 特別面談データ
          special: {
            summary: {
              total: 2,
              lastDate: '2024年1月20日',
              mainReason: 'キャリア相談',
              outcome: 'resolved'
            },
            interviews: [
              {
                id: 'spc_001',
                date: '2024年1月20日',
                subtypeLabel: 'キャリア相談面談',
                interviewer: 'キャリア支援担当',
                outcome: 'action-plan-created',
                reason: '昇進に向けたキャリアパス相談',
                summary: '主任昇進に向けた具体的なロードマップを作成。必要なスキル習得と実務経験について詳細に検討。',
                nextActions: [
                  '管理職研修への参加申込',
                  'メンタリングスキル向上プログラムの受講',
                  '部署間連携プロジェクトでのリーダー経験積み重ね'
                ]
              }
            ]
          },
          // サポート面談データ
          support: {
            summary: {
              total: 2,
              lastDate: '2024年2月10日',
              mainCategory: 'skill-development',
              supportLevel: 'active'
            },
            interviews: [
              {
                id: 'sup_001',
                date: '2024年2月10日',
                subtypeLabel: 'スキル開発支援面談',
                interviewer: '教育担当者',
                supportType: 'training',
                category: '専門技術向上',
                summary: '新しい医療技術の習得支援。実践的なトレーニングプログラムの進捗確認と今後の学習計画の調整。',
                nextActions: [
                  '専門認定資格の受験準備',
                  '実技研修への継続参加',
                  '学習成果の定期的な評価実施'
                ]
              }
            ]
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

  // NotebookLMリンク管理ハンドラー
  const handleAddNotebookLink = (interviewId: string, type: 'regular' | 'special' | 'support', date: string, category?: string) => {
    setEditingInterviewId(interviewId)
    setCurrentInterviewType(type)
    setCurrentInterviewDate(date)
    setCurrentInterviewCategory(category)
    setNotebookLinkForm({ url: '' })
    setShowNotebookLinkModal(true)
  }

  const handleRemoveNotebookLink = (interviewId: string) => {
    const newLinks = { ...notebookLinks }
    delete newLinks[interviewId]
    setNotebookLinks(newLinks)
  }

  const handleSaveNotebookLink = () => {
    if (!editingInterviewId || !notebookLinkForm.url) return

    // URLからnoteIdを抽出（例: notebook/xxxxx の部分）
    const noteIdMatch = notebookLinkForm.url.match(/notebook\/([^/?]+)/)
    const noteId = noteIdMatch ? noteIdMatch[1] : `note_${Date.now()}`

    const newLink: NotebookLMLink = {
      url: notebookLinkForm.url,
      noteId,
      title: `${currentInterviewDate}_${currentInterviewType}面談`,
      linkedInterview: {
        id: editingInterviewId,
        date: currentInterviewDate,
        type: currentInterviewType,
        category: currentInterviewCategory
      },
      createdAt: new Date().toISOString(),
      features: {
        hasAudioSummary: true,
        hasMindMap: false,
        hasTranscript: false
      }
    }

    setNotebookLinks({
      ...notebookLinks,
      [editingInterviewId]: newLink
    })
    setShowNotebookLinkModal(false)
    setEditingInterviewId(null)
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
            <div className="space-y-6">
              {/* データストーリーのメインメッセージ - 評価タブと統一 */}
              <Card className="border-l-4" style={{ borderLeftColor: CHART_COLORS.primary }}>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">
                    💬 面談データサマリー
                  </h3>
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 bg-gray-50 px-4 py-3 rounded-lg mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">📅 最終更新:</span>
                      <span>{interviewData?.overview?.latestDate || '未実施'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">📊 総実施回数:</span>
                      <span>{interviewData?.overview?.totalInterviews || 0}回</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">📝 最新評価:</span>
                      <span>{interviewData?.regular?.summary?.avgScore || '未設定'}</span>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    {(interviewData?.overview?.totalInterviews || 0) >= 10 
                      ? `面談への積極的な参加で実施回数${interviewData?.overview?.totalInterviews || 0}回。継続的な成長支援を実施中。`
                      : (interviewData?.overview?.totalInterviews || 0) >= 5
                      ? `面談実施は良好で${interviewData?.overview?.totalInterviews || 0}回実施。さらなる面談機会の活用をお勧めします。`
                      : `面談機会の拡充が必要。実施回数${interviewData?.overview?.totalInterviews || 0}回、重点的な面談支援をお勧めします。`
                    }
                    最新面談種別: {interviewData?.overview?.latestType || '未実施'}
                  </p>
                </CardContent>
              </Card>

              {/* 面談回答状況分析ダッシュボード */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    📝 面談回答状況分析
                    <Badge variant="outline" style={{ backgroundColor: CHART_COLORS.primary, color: 'white' }}>
                      総合的分析
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    {/* 回答完了率 */}
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <div className="text-2xl font-bold mb-1" style={{ color: CHART_COLORS.success }}>
                        92%
                      </div>
                      <div className="text-sm text-gray-600">全面談回答率</div>
                      <Badge style={{ backgroundColor: CHART_COLORS.success, color: 'white', marginTop: '4px' }}>
                        優秀
                      </Badge>
                    </div>
                    
                    {/* 積極性スコア */}
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <div className="text-2xl font-bold mb-1" style={{ color: CHART_COLORS.primary }}>
                        4.2
                      </div>
                      <div className="text-sm text-gray-600">回答積極性</div>
                      <div className="flex items-center justify-center mt-1 text-xs text-gray-500">
                        <span>🔥 高い関心度</span>
                      </div>
                    </div>
                    
                    {/* 回答品質 */}
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                      <div className="text-2xl font-bold mb-1" style={{ color: '#8b5cf6' }}>
                        A-
                      </div>
                      <div className="text-sm text-gray-600">回答品質</div>
                      <div className="flex items-center justify-center mt-1 text-xs text-gray-500">
                        <span>📝 詳細かつ具体的</span>
                      </div>
                    </div>
                    
                    {/* 最新更新 */}
                    <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                      <div className="text-lg font-bold mb-1" style={{ color: CHART_COLORS.warning }}>
                        3日前
                      </div>
                      <div className="text-sm text-gray-600">最新回答日</div>
                      <div className="flex items-center justify-center mt-1 text-xs text-gray-500">
                        <span>🔄 定期的な更新</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 回答カテゴリ別分析 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">🎯 目標設定回答</span>
                        <span className="text-lg font-bold" style={{ color: CHART_COLORS.success }}>95%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ width: '95%', backgroundColor: CHART_COLORS.success }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">📈 成長領域回答</span>
                        <span className="text-lg font-bold" style={{ color: CHART_COLORS.warning }}>88%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ width: '88%', backgroundColor: CHART_COLORS.warning }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">🤝 サポート要望</span>
                        <span className="text-lg font-bold" style={{ color: CHART_COLORS.primary }}>92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ width: '92%', backgroundColor: CHART_COLORS.primary }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 回答トレンドインサイト */}
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      💡 回答トレンド分析
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-green-600">✓</span>
                          <span>目標設定の具体性が3ヶ月連続で向上</span>
                        </div>
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-green-600">✓</span>
                          <span>キャリア計画への関心が高まっている</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-orange-600">△</span>
                          <span>ストレス管理に関する回答が簡略化傾向</span>
                        </div>
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-orange-600">△</span>
                          <span>チームワーク項目でより詳細な回答が欲しい</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 3分類面談サマリー - 評価タブと統一したスタイル */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* 定期面談 */}
                <Card className="border-l-4" style={{ borderLeftColor: CHART_COLORS.success }}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      📅 定期面談
                      <Badge style={{ backgroundColor: CHART_COLORS.success, color: 'white' }}>
                        {interviewData?.regular?.summary?.total || 0}回
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">最新実施日</span>
                        <span className="text-sm">{interviewData?.regular?.summary?.lastDate || '未実施'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">平均評価</span>
                        <span className="text-sm">{interviewData?.regular?.summary?.avgScore || '未設定'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">傾向</span>
                        <Badge style={{ 
                          backgroundColor: interviewData?.regular?.summary?.trend === 'improving' ? CHART_COLORS.success : CHART_COLORS.neutral, 
                          color: 'white' 
                        }}>
                          {interviewData?.regular?.summary?.trend === 'improving' ? '📈 向上中' : '➡️ 安定'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">回答完了率</span>
                        <Badge style={{ backgroundColor: CHART_COLORS.success, color: 'white' }}>
                          95%
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">次回予定</span>
                        <span className="text-sm text-blue-600">{interviewData?.overview?.nextScheduled || '未設定'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 特別面談 */}
                <Card className="border-l-4" style={{ borderLeftColor: CHART_COLORS.warning }}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      ⚡ 特別面談
                      <Badge style={{ backgroundColor: CHART_COLORS.warning, color: 'white' }}>
                        {interviewData?.special?.summary?.total || 0}回
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">最新実施日</span>
                        <span className="text-sm">{interviewData?.special?.summary?.lastDate || '未実施'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">主な理由</span>
                        <span className="text-sm">
                          {interviewData?.special?.summary?.mainReason === 'career-consultation' ? 'キャリア相談' : 
                           interviewData?.special?.summary?.mainReason === 'incident-follow' ? 'インシデント後' :
                           interviewData?.special?.summary?.mainReason || '未設定'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">結果状況</span>
                        <Badge style={{ 
                          backgroundColor: interviewData?.special?.summary?.outcome === 'resolved' ? CHART_COLORS.success : CHART_COLORS.danger, 
                          color: 'white' 
                        }}>
                          {interviewData?.special?.summary?.outcome === 'resolved' ? '✅ 解決済' : '⏳ 対応中'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">回答完了率</span>
                        <Badge style={{ backgroundColor: CHART_COLORS.warning, color: 'white' }}>
                          85%
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">継続フォロー</span>
                        <span className="text-sm font-bold" style={{ 
                          color: interviewData?.special?.summary?.outcome === 'resolved' ? CHART_COLORS.success : CHART_COLORS.warning 
                        }}>
                          {interviewData?.special?.summary?.outcome === 'resolved' ? '完了' : '要継続'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* サポート面談 */}
                <Card className="border-l-4" style={{ borderLeftColor: CHART_COLORS.primary }}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      🤝 サポート面談
                      <Badge style={{ backgroundColor: CHART_COLORS.primary, color: 'white' }}>
                        {interviewData?.support?.summary?.total || 0}回
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">最新実施日</span>
                        <span className="text-sm">{interviewData?.support?.summary?.lastDate || '未実施'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">主要分野</span>
                        <Badge variant="outline">
                          {interviewData?.support?.summary?.mainCategory === 'skill-development' ? 'スキル開発' : 
                           interviewData?.support?.summary?.mainCategory === 'career-path' ? 'キャリアパス' :
                           interviewData?.support?.summary?.mainCategory || '未設定'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">支援レベル</span>
                        <span className="text-sm font-bold" style={{ color: CHART_COLORS.primary }}>
                          {interviewData?.support?.summary?.supportLevel || '未設定'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">回答完了率</span>
                        <Badge style={{ backgroundColor: CHART_COLORS.primary, color: 'white' }}>
                          92%
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">利用状況</span>
                        <Badge style={{ 
                          backgroundColor: (interviewData?.support?.summary?.total || 0) > 0 ? CHART_COLORS.success : CHART_COLORS.neutral, 
                          color: 'white' 
                        }}>
                          {(interviewData?.support?.summary?.total || 0) > 0 ? '積極活用' : '未活用'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* インサイト分析ダッシュボード - 評価タブと統一 */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {/* 面談での強み */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      💪 面談での強み
                      <Badge style={{ backgroundColor: CHART_COLORS.success, color: 'white' }}>
                        3項目
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm">
                        <div 
                          className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                          style={{ backgroundColor: CHART_COLORS.success }}
                        />
                        定期面談への積極的参加
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <div 
                          className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                          style={{ backgroundColor: CHART_COLORS.success }}
                        />
                        面談後のフォローアップ実行力
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <div 
                          className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                          style={{ backgroundColor: CHART_COLORS.success }}
                        />
                        キャリア開発への高い関心
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* 改善・成長点 */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      🎯 改善・成長点
                      <Badge style={{ backgroundColor: CHART_COLORS.warning, color: 'white' }}>
                        3項目
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm">
                        <div 
                          className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                          style={{ backgroundColor: CHART_COLORS.warning }}
                        />
                        特別面談後のメンタルケア継続
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <div 
                          className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                          style={{ backgroundColor: CHART_COLORS.warning }}
                        />
                        職場環境改善への具体的アクション
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <div 
                          className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                          style={{ backgroundColor: CHART_COLORS.warning }}
                        />
                        同僚との協力関係強化
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* 面談トレンド */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      📊 面談トレンド
                      <Badge style={{ backgroundColor: CHART_COLORS.primary, color: 'white' }}>
                        分析結果
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm">
                        <div 
                          className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                          style={{ backgroundColor: CHART_COLORS.primary }}
                        />
                        面談満足度が継続的に向上
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <div 
                          className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                          style={{ backgroundColor: CHART_COLORS.primary }}
                        />
                        キャリア系面談の利用頻度増加
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <div 
                          className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                          style={{ backgroundColor: CHART_COLORS.primary }}
                        />
                        業務改善提案の積極性向上
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
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

              {/* セクション別トレンド分析ダッシュボード */}
              <div className="mb-6">
                <SectionTrendAnalysis 
                  staffRole={getStaffRole(selectedStaff)}
                  staffId={selectedStaff.id}
                />
              </div>

              {/* その他の分析データ */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* 成長軸跡分析 */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      📈 成長軸跡分析
                      <Badge style={{ backgroundColor: CHART_COLORS.success, color: 'white' }}>
                        継続成長
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* スキル進歩グラフ */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>技術スキル</span>
                          <span className="font-medium text-green-600">↑ +15%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-green-500" 
                            style={{ width: '85%' }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>リーダーシップ</span>
                          <span className="font-medium text-green-600">↑ +22%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-500" 
                            style={{ width: '78%' }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>コミュニケーション</span>
                          <span className="font-medium text-green-600">↑ +8%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-yellow-500" 
                            style={{ width: '92%' }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="mt-3 p-2 bg-green-50 rounded text-xs text-green-800">
                        🎆 直近3回の面談で全領域で進歩を確認。特にリーダーシップ領域での成長が顕著です。
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 空のカード（将来の拡張用） */}
                <div></div>
              </div>

              {/* 面談効果測定ダッシュボード */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    📊 面談効果測定ダッシュボード
                    <Badge variant="outline" style={{ backgroundColor: CHART_COLORS.highlight, color: 'white' }}>
                      データ駆動型分析
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* モチベーション向上 */}
                    <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                      <div className="text-xl font-bold mb-1" style={{ color: CHART_COLORS.success }}>+18%</div>
                      <div className="text-xs text-gray-600">モチベーション向上</div>
                      <div className="text-xs text-green-600 mt-1">面談前後比較</div>
                    </div>
                    
                    {/* 目標達成率 */}
                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                      <div className="text-xl font-bold mb-1" style={{ color: CHART_COLORS.primary }}>87%</div>
                      <div className="text-xs text-gray-600">目標達成率</div>
                      <div className="text-xs text-blue-600 mt-1">面談設定目標</div>
                    </div>
                    
                    {/* スキル向上速度 */}
                    <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg">
                      <div className="text-xl font-bold mb-1" style={{ color: '#8b5cf6' }}>+24%</div>
                      <div className="text-xs text-gray-600">スキル向上速度</div>
                      <div className="text-xs text-purple-600 mt-1">前回比較</div>
                    </div>
                    
                    {/* 継続意欲 */}
                    <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg">
                      <div className="text-xl font-bold mb-1" style={{ color: CHART_COLORS.highlight }}>4.6</div>
                      <div className="text-xs text-gray-600">継続意欲スコア</div>
                      <div className="text-xs text-amber-600 mt-1">5点満点</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">🔍 面談効果分析サマリー</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="flex items-start gap-2 mb-1">
                          <span className="text-green-600">✓</span>
                          <span>面談後の目標設定が明確化し、アクションプランの実行率が向上</span>
                        </div>
                        <div className="flex items-start gap-2 mb-1">
                          <span className="text-green-600">✓</span>
                          <span>キャリア開発に対する能動的な取り組みが增加</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-start gap-2 mb-1">
                          <span className="text-blue-600">▶</span>
                          <span>チームリーダーとしての成長をNotebookLMで継続トラッキング</span>
                        </div>
                        <div className="flex items-start gap-2 mb-1">
                          <span className="text-blue-600">▶</span>
                          <span>次回面談では法人プロジェクト参加の進捗確認予定</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI面談支援分析 */}
              {interviewData?.regular?.interviews?.length > 0 && (
                <div className="space-y-6">
                  {/* AI面談効果分析 - 冒頭配置 */}
                  <InterviewInterpretationComments
                    staffId={selectedStaff.id}
                    interviewData={interviewData.regular.interviews}
                    staffInfo={selectedStaff}
                    category="regular"
                  />
                  
                  {/* 面談グラフ群 - AI分析後に配置 */}
                  <div className="space-y-6">
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
                </div>
              )}

              {/* 定期面談履歴詳細 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">📋 定期面談履歴</h3>
                <div className="grid grid-cols-1 gap-4">
                  {interviewData?.regular?.interviews?.map((interview: any) => (
                    <Card key={interview.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-sm font-medium text-blue-600">{interview.date}</div>
                            <Badge variant="outline">{interview.subtypeLabel}</Badge>
                            <div className="text-sm text-gray-600">面談者: {interview.interviewer}</div>
                          </div>
                          <Badge 
                            style={{
                              backgroundColor: interview.overallScore === 'A' ? '#10b981' : '#f59e0b',
                              color: 'white'
                            }}
                          >
                            {interview.overallScore}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-sm text-gray-700">
                          {interview.summary}
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium text-gray-800 mb-2">主要テーマ:</div>
                          <div className="flex flex-wrap gap-2">
                            {interview.keyTopics?.map((topic: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium text-gray-800 mb-2">次回アクション:</div>
                          <ul className="text-sm text-gray-700 space-y-1 ml-4">
                            {interview.nextActions?.map((action: string, index: number) => (
                              <li key={index} className="list-disc">{action}</li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* NotebookLMボタン - 定期面談 */}
                        <div className="pt-3 border-t border-gray-100">
                          {interview.notebookLmLink ? (
                            <div className="flex items-center gap-2">
                              <a 
                                href={interview.notebookLmLink.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                              >
                                <span>📖</span>
                                NotebookLMで開く
                              </a>
                              <span className="text-xs text-gray-500">
                                登録済み ({new Date(interview.notebookLmLink.createdAt || Date.now()).toLocaleDateString('ja-JP')})
                              </span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onMouseOver={() => console.log('ボタンにマウスオーバー:', interview.id)}
                              onMouseDown={() => console.log('ボタンマウスダウン:', interview.id)}
                              onClick={() => {
                                console.log('定期面談NotebookLM登録ボタンクリック:', interview.id);
                                onShowNotebookModal?.({
                                  id: interview.id,
                                  date: interview.date,
                                  type: '定期面談',
                                  subtype: interview.subtypeLabel
                                });
                              }}
                              className="inline-flex items-center gap-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                              style={{
                                pointerEvents: 'auto',
                                zIndex: 1000,
                                position: 'relative'
                              }}
                            >
                              <span>📝</span>
                              NotebookLMリンク登録
                            </button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
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

              {/* リスク分析ダッシュボード */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🚨 リスク分析ダッシュボード
                    <Badge style={{ backgroundColor: CHART_COLORS.danger, color: 'white' }}>
                      重点管理
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 現在のリスクレベル */}
                    <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-800">リスクレベル</h4>
                        <Badge style={{ backgroundColor: CHART_COLORS.warning, color: 'white' }}>
                          中程度
                        </Badge>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl mb-2">🟡</div>
                        <div className="text-sm text-gray-600">継続的なフォローが必要</div>
                        <div className="mt-2 text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded">
                          最終更新: 2024/01/20
                        </div>
                      </div>
                    </div>
                    
                    {/* インシデント対応状況 */}
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-800">インシデント対応</h4>
                        <Badge style={{ backgroundColor: CHART_COLORS.success, color: 'white' }}>
                          対策完了
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>再発防止率</span>
                          <span className="font-medium text-green-600">100%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>フォローアップ</span>
                          <span className="font-medium">3回実施</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>改善状況</span>
                          <span className="font-medium text-green-600">良好</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* 予防的介入推奨 */}
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-800">予防的介入</h4>
                        <Badge variant="outline">推奨中</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="text-purple-600">●</span>
                          <span>ストレスマネジメント研修</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-purple-600">●</span>
                          <span>メンターサポート体制強化</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-purple-600">●</span>
                          <span>定期面談頻度の調整</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* リスク要因分析 */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                      🔍 リスク要因分析
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">⚙️ 内部要因</h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>業務負荷</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-1">
                                <div className="h-1 rounded-full bg-orange-400" style={{ width: '60%' }}></div>
                              </div>
                              <span className="text-xs text-orange-600">中</span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span>スキル不足</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-1">
                                <div className="h-1 rounded-full bg-yellow-400" style={{ width: '30%' }}></div>
                              </div>
                              <span className="text-xs text-yellow-600">低</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">🌍 外部要因</h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>チーム環境</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-1">
                                <div className="h-1 rounded-full bg-green-400" style={{ width: '80%' }}></div>
                              </div>
                              <span className="text-xs text-green-600">良好</span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span>サポート体制</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-1">
                                <div className="h-1 rounded-full bg-blue-400" style={{ width: '70%' }}></div>
                              </div>
                              <span className="text-xs text-blue-600">充実</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 特別面談効果測定ダッシュボード */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* 対応効果測定 */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      🎯 対応効果測定
                      <Badge style={{ backgroundColor: CHART_COLORS.success, color: 'white' }}>
                        効果的
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                        <div className="text-2xl font-bold mb-1" style={{ color: CHART_COLORS.success }}>92%</div>
                        <div className="text-sm text-gray-600">問題解決率</div>
                        <div className="text-xs text-green-600 mt-1">目標: 85%以上</div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>メンタルケア改善</span>
                            <span className="font-medium text-green-600">+25%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full bg-green-400" style={{ width: '85%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>業務パフォーマンス</span>
                            <span className="font-medium text-blue-600">+18%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full bg-blue-400" style={{ width: '78%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* フォローアップ状況 */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      🔄 フォローアップ状況
                      <Badge style={{ backgroundColor: CHART_COLORS.primary, color: 'white' }}>
                        継続中
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* フォローアップタイムライン */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">1週間後フォロー</div>
                            <div className="text-xs text-gray-500">2024/01/27 - 完了</div>
                          </div>
                          <Badge style={{ backgroundColor: CHART_COLORS.success, color: 'white', fontSize: '10px' }}>
                            完了
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">1ヶ月後フォロー</div>
                            <div className="text-xs text-gray-500">2024/02/20 - 完了</div>
                          </div>
                          <Badge style={{ backgroundColor: CHART_COLORS.success, color: 'white', fontSize: '10px' }}>
                            完了
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">3ヶ月後フォロー</div>
                            <div className="text-xs text-gray-500">2024/04/20 - 予定</div>
                          </div>
                          <Badge style={{ backgroundColor: CHART_COLORS.primary, color: 'white', fontSize: '10px' }}>
                            予定
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
                        📝 キャリア相談でのアクションプランが順調に進行。次回は進捗確認と新たな目標設定を行います。
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 特別面談履歴詳細 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">📋 特別面談履歴</h3>
                {interviewData?.special?.interviews?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {interviewData.special.interviews.map((interview: any) => (
                      <Card key={interview.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="text-sm font-medium text-blue-600">{interview.date}</div>
                              <Badge variant="outline">{interview.subtypeLabel}</Badge>
                              <div className="text-sm text-gray-600">面談者: {interview.interviewer}</div>
                            </div>
                            <Badge 
                              style={{
                                backgroundColor: interview.outcome === 'action-plan-created' ? '#10b981' : '#f59e0b',
                                color: 'white'
                              }}
                            >
                              {interview.outcome === 'action-plan-created' ? '対策完了' : '対応中'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-sm">
                            <span className="font-medium text-gray-800">面談理由:</span> <span className="text-gray-700">{interview.reason}</span>
                          </div>
                          <div className="text-sm text-gray-700">
                            {interview.summary}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-800 mb-2">対応策:</div>
                            <ul className="text-sm text-gray-700 space-y-1 ml-4">
                              {interview.nextActions?.map((action: string, index: number) => (
                                <li key={index} className="list-disc">{action}</li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* NotebookLMボタン - 特別面談 */}
                          <div className="pt-3 border-t border-gray-100">
                            {interview.notebookLmLink ? (
                              <div className="flex items-center gap-2">
                                <a 
                                  href={interview.notebookLmLink.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                >
                                  <span>📖</span>
                                  NotebookLMで開く
                                </a>
                                <span className="text-xs text-gray-500">
                                  登録済み ({new Date(interview.notebookLmLink.createdAt || Date.now()).toLocaleDateString('ja-JP')})
                                </span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  console.log('特別面談NotebookLM登録ボタンクリック:', interview.id);
                                  onShowNotebookModal?.({
                                    id: interview.id,
                                    date: interview.date,
                                    type: '特別面談',
                                    subtype: interview.subtypeLabel
                                  });
                                }}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                              >
                                <span>📝</span>
                                NotebookLMリンク登録
                              </button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
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

              {/* キャリア開発進捗ダッシュボード */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🚀 キャリア開発進捗ダッシュボード
                    <Badge style={{ backgroundColor: CHART_COLORS.primary, color: 'white' }}>
                      成長支援中
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* キャリア目標達成率 */}
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-800">目標達成率</h4>
                        <Badge style={{ backgroundColor: CHART_COLORS.success, color: 'white' }}>
                          順調
                        </Badge>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-2" style={{ color: CHART_COLORS.primary }}>73%</div>
                        <div className="text-sm text-gray-600 mb-2">キャリアプラン進捗</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500" style={{ width: '73%' }}></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">目標日: 2024年12月</div>
                      </div>
                    </div>
                    
                    {/* スキル習得状況 */}
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-800">スキル習得</h4>
                        <Badge style={{ backgroundColor: CHART_COLORS.warning, color: 'white' }}>
                          進行中
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>専門資格</span>
                          <span className="font-medium text-green-600">2/3完了</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>研修受講</span>
                          <span className="font-medium text-blue-600">5/6完了</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>実務経験</span>
                          <span className="font-medium text-purple-600">継続中</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-2 p-2 bg-green-100 rounded">
                          次回目標: リーダーシップ研修受講
                        </div>
                      </div>
                    </div>
                    
                    {/* メンタリング効果 */}
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-800">メンタリング効果</h4>
                        <Badge style={{ backgroundColor: CHART_COLORS.highlight, color: 'white' }}>
                          高効果
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>自信度向上</span>
                          <span className="font-medium text-green-600">+22%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>スキル向上速度</span>
                          <span className="font-medium text-blue-600">+15%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>目標明確化</span>
                          <span className="font-medium text-purple-600">+35%</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-2 p-2 bg-purple-100 rounded">
                          満足度: 4.8/5.0点
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* スキルマップ可視化 */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                      🧩 スキルマップ & 成長計画
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* 現在のスキルレベル */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-3">📊 現在のスキルレベル</h5>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>リーダーシップ</span>
                              <span className="text-blue-600 font-medium">Level 3</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div className="h-1.5 rounded-full bg-blue-400" style={{ width: '60%' }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>コミュニケーション</span>
                              <span className="text-green-600 font-medium">Level 4</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div className="h-1.5 rounded-full bg-green-400" style={{ width: '80%' }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>問題解決</span>
                              <span className="text-purple-600 font-medium">Level 3</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div className="h-1.5 rounded-full bg-purple-400" style={{ width: '60%' }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>技術スキル</span>
                              <span className="text-orange-600 font-medium">Level 4</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div className="h-1.5 rounded-full bg-orange-400" style={{ width: '85%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 次のステップ */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-3">🎯 次の成長ステップ</h5>
                        <div className="space-y-3">
                          <div className="p-3 bg-blue-50 rounded-lg border-l-2 border-blue-400">
                            <div className="text-sm font-medium text-blue-800">リーダーシップ向上</div>
                            <div className="text-xs text-blue-600 mt-1">管理職研修受講予定 (4月)</div>
                          </div>
                          
                          <div className="p-3 bg-green-50 rounded-lg border-l-2 border-green-400">
                            <div className="text-sm font-medium text-green-800">専門資格取得</div>
                            <div className="text-xs text-green-600 mt-1">スペシャリスト認定試験 (6月)</div>
                          </div>
                          
                          <div className="p-3 bg-purple-50 rounded-lg border-l-2 border-purple-400">
                            <div className="text-sm font-medium text-purple-800">メンタリングスキル</div>
                            <div className="text-xs text-purple-600 mt-1">新人指導担当開始 (7月)</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* サポート効果測定 & 個別最適化提案 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* サポート効果測定 */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      📊 サポート効果測定
                      <Badge style={{ backgroundColor: CHART_COLORS.success, color: 'white' }}>
                        高効果
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* ROI測定 */}
                      <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                        <div className="text-2xl font-bold mb-1" style={{ color: CHART_COLORS.success }}>285%</div>
                        <div className="text-sm text-gray-600">ROI (投資収益率)</div>
                        <div className="text-xs text-green-600 mt-1">サポート投資対効果</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>モチベーション向上</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-1">
                              <div className="h-1 rounded-full bg-green-400" style={{ width: '90%' }}></div>
                            </div>
                            <span className="font-medium text-green-600">+45%</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span>業務パフォーマンス</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-1">
                              <div className="h-1 rounded-full bg-blue-400" style={{ width: '75%' }}></div>
                            </div>
                            <span className="font-medium text-blue-600">+32%</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span>キャリア継続意欲</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-1">
                              <div className="h-1 rounded-full bg-purple-400" style={{ width: '85%' }}></div>
                            </div>
                            <span className="font-medium text-purple-600">+38%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* 個別最適化提案 */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      🧠 AI個別最適化提案
                      <Badge style={{ backgroundColor: CHART_COLORS.highlight, color: 'white' }}>
                        新提案
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* 推奨アクション */}
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="font-medium text-sm text-blue-800">高優先度</span>
                        </div>
                        <div className="text-sm text-blue-700 mb-1">リーダーシップスタイルの個別カスタマイズ</div>
                        <div className="text-xs text-blue-600">既存のコミュニケーション能力を活かし、ファシリテーター型リーダーシップを開発</div>
                      </div>
                      
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="font-medium text-sm text-green-800">中優先度</span>
                        </div>
                        <div className="text-sm text-green-700 mb-1">デジタルスキル強化プログラム</div>
                        <div className="text-xs text-green-600">データ分析スキルを習得し、エビデンスベースの意思決定能力を向上</div>
                      </div>
                      
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          <span className="font-medium text-sm text-purple-800">長期計画</span>
                        </div>
                        <div className="text-sm text-purple-700 mb-1">専門領域横断プロジェクト参加</div>
                        <div className="text-xs text-purple-600">複数部署を統括するプロジェクトリーダーとしての経験積む</div>
                      </div>
                      
                      <div className="mt-3 p-2 bg-yellow-50 rounded text-xs text-yellow-800">
                        ℹ️ これらの提案は面談データとNotebookLM分析に基づいてAIが生成した個別最適化プランです。
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* サポート面談履歴詳細 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">📋 サポート面談履歴</h3>
                {interviewData?.support?.interviews?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {interviewData.support.interviews.map((interview: any) => (
                      <Card key={interview.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="text-sm font-medium text-blue-600">{interview.date}</div>
                              <Badge variant="outline">{interview.subtypeLabel}</Badge>
                              <div className="text-sm text-gray-600">担当者: {interview.interviewer}</div>
                            </div>
                            <Badge 
                              style={{
                                backgroundColor: interview.supportType === 'training' ? '#10b981' : '#3b82f6',
                                color: 'white'
                              }}
                            >
                              {interview.supportType === 'training' ? '研修支援' : '個別指導'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-sm">
                            <span className="font-medium text-gray-800">支援カテゴリ:</span> <span className="text-gray-700">{interview.category}</span>
                          </div>
                          <div className="text-sm text-gray-700">
                            {interview.summary}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-800 mb-2">今後の支援策:</div>
                            <ul className="text-sm text-gray-700 space-y-1 ml-4">
                              {interview.nextActions?.map((action: string, index: number) => (
                                <li key={index} className="list-disc">{action}</li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* NotebookLMボタン - サポート面談 */}
                          <div className="pt-3 border-t border-gray-100">
                            {interview.notebookLmLink ? (
                              <div className="flex items-center gap-2">
                                <a 
                                  href={interview.notebookLmLink.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                >
                                  <span>📖</span>
                                  NotebookLMで開く
                                </a>
                                <span className="text-xs text-gray-500">
                                  登録済み ({new Date(interview.notebookLmLink.createdAt || Date.now()).toLocaleDateString('ja-JP')})
                                </span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  console.log('サポート面談NotebookLM登録ボタンクリック:', interview.id);
                                  onShowNotebookModal?.({
                                    id: interview.id,
                                    date: interview.date,
                                    type: 'サポート面談',
                                    subtype: interview.category
                                  });
                                }}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                              >
                                <span>📝</span>
                                NotebookLMリンク登録
                              </button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
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

export function GrowthDevelopmentTab({ selectedStaff }: { selectedStaff: any }) {
  const router = useRouter()
  const [growthData, setGrowthData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadGrowthData = async () => {
      try {
        setIsLoading(true)
        
        // 統合データ（実績 + 能力開発）
        const mockGrowthData = {
          // 過去の実績データ（ブルー系：信頼性・安定性を表現）
          pastAchievements: {
            majorProjects: [
              { year: 2023, project: '看護部インシデント削減プロジェクト', impact: 'インシデント30%減', role: 'プロジェクトリーダー', v3Score: 85, category: '業務改善' },
              { year: 2022, project: '新人研修プログラム改善', impact: '新人定着率15%向上', role: 'メンター責任者', v3Score: 82, category: '教育指導' },
              { year: 2021, project: '患者満足度向上取組み', impact: '満足度4.2→4.6', role: '改善チーム', v3Score: 78, category: 'サービス向上' }
            ],
            awards: [
              { year: 2023, award: '法人優秀職員賞', category: '業務改善', points: 10, impact: '病院全体への貢献' },
              { year: 2022, award: '病棟功労賞', category: 'チーム貢献', points: 8, impact: '病棟運営の安定化' },
              { year: 2021, award: '新人指導優秀賞', category: '教育指導', points: 6, impact: '新人育成への貢献' }
            ],
            v3GradeHistory: [
              { year: 2020, grade: 'C', score: 68 },
              { year: 2021, grade: 'B', score: 74 },
              { year: 2022, grade: 'B+', score: 78 },
              { year: 2023, grade: 'A', score: 82 },
              { year: 2024, grade: 'A', score: 85 }
            ],
            totalAchievementPoints: 24,
            yearlyGrowthRate: '+4.25%'
          },
          // 現在の能力状況（中間色：現在の位置づけ）
          currentCapabilities: {
            experienceLevel: 'midlevel',
            experienceLevelLabel: '中堅',
            yearsExperience: 3.8,
            currentV3Grade: 'A',
            currentV3Score: 85,
            skillAssessment: {
              technical: { score: 80, level: '熟練', trend: '+5' },
              leadership: { score: 72, level: '発展中', trend: '+8' },
              contribution: { score: 78, level: '良好', trend: '+3' }
            }
          },
          // 未来の成長計画（グリーン系：成長・発展を表現）
          futureGrowthPlan: {
            targetLevel: 'senior',
            targetLevelLabel: 'シニア/主任候補',
            targetTimeframe: '18ヶ月',
            v3GradeTarget: 'S',
            v3ScoreTarget: 90,
            developmentGoals: [
              {
                area: 'V3評価向上',
                current: 85,
                target: 90,
                actions: ['法人規模プロジェクト参加', 'イノベーション創出', '業界リーダーシップ発揮'],
                deadline: '2025-12-31',
                priority: 'high',
                progressPercent: 65
              },
              {
                area: 'キャリア昇進',
                current: 45,
                target: 80,
                actions: ['管理職研修受講', 'チーム運営経験', '人事評価スキル習得'],
                deadline: '2026-04-01',
                priority: 'high',
                progressPercent: 45
              },
              {
                area: '専門資格取得',
                current: 30,
                target: 100,
                actions: ['受験資格確認', '研修プログラム選択', '学習計画策定'],
                deadline: '2025-09-30',
                priority: 'medium',
                progressPercent: 30
              }
            ],
            mentorshipPlan: {
              as_mentor: { target: 3, current: 2, expansion: '+1名' },
              as_mentee: { completionTarget: '2025-06', currentProgress: 75 }
            }
          }
        }
        
        setGrowthData(mockGrowthData)
      } catch (error) {
        console.error('Growth data loading failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (selectedStaff?.id) {
      loadGrowthData()
    }
  }, [selectedStaff?.id])

  if (!selectedStaff) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">職員を選択してください</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">成長データを読み込み中...</p>
      </div>
    )
  }

  const calculateGrowthTrend = (history: any[]) => {
    if (history.length < 2) return '0%'
    const recent = history.slice(-2)
    const growth = ((recent[1].score - recent[0].score) / recent[0].score * 100).toFixed(1)
    return growth > 0 ? `+${growth}%` : `${growth}%`
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* 統合ヘッダー - 過去実績と未来成長の二分割デザイン */}
      <div className="relative">
        {/* 左側: 過去実績（ブルー系グラデーション） */}
        <div className="grid grid-cols-2 gap-0 rounded-lg overflow-hidden shadow-lg">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">過去の実績</h2>
                <p className="text-blue-100 mt-1">Achievement History</p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="secondary" className="bg-white bg-opacity-20 text-white border-0">
                    総獲得ポイント: {growthData?.pastAchievements?.totalAchievementPoints}pt
                  </Badge>
                  <Badge variant="secondary" className="bg-white bg-opacity-20 text-white border-0">
                    成長率: {calculateGrowthTrend(growthData?.pastAchievements?.v3GradeHistory || [])}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          {/* 右側: 未来開発計画（グリーン系グラデーション） */}
          <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">未来の成長計画</h2>
                <p className="text-green-100 mt-1">Future Development Plan</p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="secondary" className="bg-white bg-opacity-20 text-white border-0">
                    目標レベル: {growthData?.futureGrowthPlan?.targetLevelLabel}
                  </Badge>
                  <Badge variant="secondary" className="bg-white bg-opacity-20 text-white border-0">
                    達成期限: {growthData?.futureGrowthPlan?.targetTimeframe}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ：3列レイアウト */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 左列: 過去の実績詳細 */}
        <div className="space-y-6">
          {/* 主要プロジェクト実績 */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <BarChart3 className="h-5 w-5" />
                主要プロジェクト実績
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {growthData?.pastAchievements?.majorProjects?.map((project: any, index: number) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-sm text-blue-900">{project.year}年</span>
                    <Badge variant="outline" className="text-xs">
                      V3スコア: {project.v3Score}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-blue-800 mb-1">{project.project}</h4>
                  <p className="text-sm text-blue-600 mb-1">役割: {project.role}</p>
                  <p className="text-sm font-semibold text-green-700">成果: {project.impact}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 受賞歴 */}
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <Award className="h-5 w-5" />
                表彰・受賞歴
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {growthData?.pastAchievements?.awards?.map((award: any, index: number) => (
                <div key={index} className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-sm text-yellow-900">{award.year}年</span>
                    <Badge className="bg-yellow-600 text-white text-xs">
                      {award.points}pt
                    </Badge>
                  </div>
                  <h4 className="font-medium text-yellow-800">{award.award}</h4>
                  <p className="text-sm text-yellow-600">{award.impact}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* 中央列: 現在の能力状況 */}
        <div className="space-y-6">
          {/* 現在の評価状況 */}
          <Card className="border-2 border-orange-300 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Calendar className="h-5 w-5" />
                現在の能力状況
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-800 mb-2">
                  {growthData?.currentCapabilities?.currentV3Grade}グレード
                </div>
                <div className="text-xl text-orange-600 mb-1">
                  {growthData?.currentCapabilities?.currentV3Score}点 / 100点
                </div>
                <Badge className="bg-orange-600 text-white">
                  {growthData?.currentCapabilities?.experienceLevelLabel} • {growthData?.currentCapabilities?.yearsExperience}年
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-3 mt-4">
                {Object.entries(growthData?.currentCapabilities?.skillAssessment || {}).map(([key, skill]: [string, any]) => (
                  <div key={key} className="p-3 bg-white rounded-lg border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {key === 'technical' ? '技術力' : key === 'leadership' ? 'リーダーシップ' : '組織貢献'}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{skill.score}点</span>
                        <Badge variant="outline" className="text-xs">
                          {skill.trend}
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min(skill.score, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{skill.level}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* V3グレード推移チャート */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                V3評価推移
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end h-32 px-2">
                {growthData?.pastAchievements?.v3GradeHistory?.map((item: any, index: number) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-8 mb-2 rounded-t"
                      style={{ 
                        height: `${Math.min(item.score * 1.2, 100)}px`,
                        backgroundColor: v3Grades[item.grade as keyof typeof v3Grades]?.color || '#808080'
                      }}
                    />
                    <div className="text-xs font-bold text-white px-1 py-0.5 rounded" 
                         style={{ backgroundColor: v3Grades[item.grade as keyof typeof v3Grades]?.color || '#808080' }}>
                      {item.grade}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{item.year}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右列: 未来の成長計画 */}
        <div className="space-y-6">
          {/* 成長目標 */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Target className="h-5 w-5" />
                成長目標
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {growthData?.futureGrowthPlan?.developmentGoals?.map((goal: any, index: number) => (
                <div key={index} className="p-4 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-green-800">{goal.area}</h4>
                    <Badge className={`text-xs ${getPriorityColor(goal.priority)}`}>
                      {goal.priority === 'high' ? '高優先度' : goal.priority === 'medium' ? '中優先度' : '低優先度'}
                    </Badge>
                  </div>
                  
                  {/* プログレスバー */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>進捗</span>
                      <span>{goal.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${goal.progressPercent}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* 目標値 */}
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">現在: {goal.current}点</span>
                    <span className="font-semibold text-green-700">目標: {goal.target}点</span>
                  </div>
                  
                  <p className="text-xs text-green-600 mb-2">期限: {goal.deadline}</p>
                  
                  {/* アクション項目 */}
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-green-800">主要アクション:</p>
                    {goal.actions.slice(0, 2).map((action: string, actionIndex: number) => (
                      <div key={actionIndex} className="flex items-center text-xs text-green-700">
                        <div className="w-1 h-1 bg-green-500 rounded-full mr-2" />
                        {action}
                      </div>
                    ))}
                    {goal.actions.length > 2 && (
                      <div className="text-xs text-green-600">他 {goal.actions.length - 2}項目</div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* メンタリング計画 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                メンタリング計画
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">メンター活動</h4>
                  <div className="flex justify-between text-sm">
                    <span>指導予定:</span>
                    <span className="font-semibold">
                      {growthData?.futureGrowthPlan?.mentorshipPlan?.as_mentor?.current} → 
                      {growthData?.futureGrowthPlan?.mentorshipPlan?.as_mentor?.target}名
                      <Badge variant="outline" className="ml-2 text-xs">
                        {growthData?.futureGrowthPlan?.mentorshipPlan?.as_mentor?.expansion}
                      </Badge>
                    </span>
                  </div>
                </div>
                
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <h4 className="font-semibold text-indigo-800 mb-2">メンティー活動</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>完了目標:</span>
                      <span className="font-semibold">{growthData?.futureGrowthPlan?.mentorshipPlan?.as_mentee?.completionTarget}</span>
                    </div>
                    <div className="w-full bg-indigo-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-500 h-2 rounded-full" 
                        style={{ width: `${growthData?.futureGrowthPlan?.mentorshipPlan?.as_mentee?.currentProgress}%` }}
                      />
                    </div>
                    <div className="text-xs text-indigo-600">
                      現在の進捗: {growthData?.futureGrowthPlan?.mentorshipPlan?.as_mentee?.currentProgress}%
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex justify-center gap-4 pt-4">
        <button 
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => router.push(`/evaluation?tab=guide&staffId=${selectedStaff.id}`)}
        >
          評価目標設定
        </button>
        <button 
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          onClick={() => router.push(`/training?tab=planning&staffId=${selectedStaff.id}`)}
        >
          成長プラン作成
        </button>
        <button
          type="button"
          onClick={() => {
            console.log('テストボタンクリック');
            setShowNotebookLinkModal(true);
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          テスト: モーダル表示
        </button>
      </div>
      
    </div>
  )
}

export function EducationTab({ selectedStaff }: { selectedStaff: any }) {
  const router = useRouter()
  const { handleError, clearError } = useErrorHandler()
  const [trainingData, setTrainingData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeEducationTab, setActiveEducationTab] = useState('personal')

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
    { id: 'personal', label: 'パーソナル', icon: '👤' },
    { id: 'progress', label: '進捗状況', icon: '📊' },
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
          {activeEducationTab === 'personal' && (
            <PersonalizedEducationDashboard 
              staffProfile={{
                id: selectedStaff.id,
                name: selectedStaff.name || '未設定',
                experienceLevel: selectedStaff.experienceLevel || 'midlevel',
                jobType: selectedStaff.jobType || 'nurse',
                facility: selectedStaff.facility || 'acute',
                experienceYears: selectedStaff.experienceYears || 5,
                currentGrade: selectedStaff.currentGrade || 'B',
                careerGoals: selectedStaff.careerGoals || ['専門性向上', 'チーム貢献'],
                evaluationScores: {
                  technical: selectedStaff.evaluationScores?.technical || 75,
                  contribution: selectedStaff.evaluationScores?.contribution || 70,
                  total: selectedStaff.evaluationScores?.total || 
                    ((selectedStaff.evaluationScores?.technical || 75) + 
                     (selectedStaff.evaluationScores?.contribution || 70)) / 2
                }
              }}
            />
          )}

          {activeEducationTab === 'progress' && (
            <div className="space-y-6">
              {/* データストーリーのメインメッセージ - 面談タブと統一 */}
              <Card className="border-l-4" style={{ borderLeftColor: CHART_COLORS.primary }}>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">
                    📊 研修進捗サマリー
                  </h3>
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 bg-gray-50 px-4 py-3 rounded-lg mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">⏱️ 総受講時間:</span>
                      <span>{trainingData?.progressSummary?.totalHours || 0}時間</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">🎯 達成率:</span>
                      <span>{trainingData?.progressSummary?.completionRate || 0}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">📚 受講中:</span>
                      <span>{trainingData?.progressSummary?.ongoingPrograms || 0}プログラム</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">✅ 完了済み:</span>
                      <span>{trainingData?.progressSummary?.completedPrograms || 0}プログラム</span>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    {(trainingData?.progressSummary?.completionRate || 0) >= 90 
                      ? `優秀な進捗状況で達成率${trainingData?.progressSummary?.completionRate}%。継続的な学習姿勢が評価されます。`
                      : (trainingData?.progressSummary?.completionRate || 0) >= 70
                      ? `良好な進捗で達成率${trainingData?.progressSummary?.completionRate}%。期限内完了に向けて順調に進行中。`
                      : `進捗率${trainingData?.progressSummary?.completionRate}%。重点的なフォローアップをお勧めします。`
                    }
                    {trainingData?.progressSummary?.upcomingDeadlines > 0 && 
                      ` 📅 ${trainingData.progressSummary.upcomingDeadlines}件の期限が迫っています。`
                    }
                  </p>
                </CardContent>
              </Card>

              {/* 研修進捗ダッシュボード */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    📈 研修進捗状況分析
                    <Badge variant="outline" style={{ backgroundColor: CHART_COLORS.primary, color: 'white' }}>
                      リアルタイム
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    {/* 総受講時間 */}
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <div className="text-2xl font-bold mb-1" style={{ color: CHART_COLORS.primary }}>
                        {trainingData?.progressSummary?.totalHours || 0}h
                      </div>
                      <div className="text-sm text-gray-600">総受講時間</div>
                      <div className="text-xs text-gray-500 mt-1">
                        目標: 200h
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                        <div 
                          className="h-1 rounded-full" 
                          style={{ 
                            width: `${Math.min(100, (trainingData?.progressSummary?.totalHours || 0) / 200 * 100)}%`,
                            backgroundColor: CHART_COLORS.primary 
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* 達成率 */}
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <div className="text-2xl font-bold mb-1" style={{ color: CHART_COLORS.success }}>
                        {trainingData?.progressSummary?.completionRate || 0}%
                      </div>
                      <div className="text-sm text-gray-600">達成率</div>
                      <Badge style={{ 
                        backgroundColor: trainingData?.progressSummary?.completionRate >= 80 ? CHART_COLORS.success : CHART_COLORS.warning, 
                        color: 'white', 
                        marginTop: '4px' 
                      }}>
                        {trainingData?.progressSummary?.completionRate >= 80 ? '優秀' : '継続中'}
                      </Badge>
                    </div>
                    
                    {/* 受講中プログラム */}
                    <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                      <div className="text-2xl font-bold mb-1" style={{ color: CHART_COLORS.warning }}>
                        {trainingData?.progressSummary?.ongoingPrograms || 0}
                      </div>
                      <div className="text-sm text-gray-600">受講中</div>
                      <div className="flex items-center justify-center mt-1 text-xs text-gray-500">
                        <span>📚 アクティブ</span>
                      </div>
                    </div>
                    
                    {/* 完了プログラム */}
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                      <div className="text-2xl font-bold mb-1" style={{ color: '#8b5cf6' }}>
                        {trainingData?.progressSummary?.completedPrograms || 0}
                      </div>
                      <div className="text-sm text-gray-600">完了済み</div>
                      <div className="flex items-center justify-center mt-1 text-xs text-gray-500">
                        <span>✅ 達成</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* プログラム別進捗 */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800 flex items-center gap-2">
                      📚 現在の研修プログラム
                    </h4>
                    {trainingData?.currentPrograms?.map((program: any) => (
                      <div key={program.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-gray-800">{program.name}</span>
                            <Badge variant="outline">{program.category}</Badge>
                            <Badge style={{ 
                              backgroundColor: program.status === 'completed' ? CHART_COLORS.success : CHART_COLORS.primary,
                              color: 'white'
                            }}>
                              {program.status === 'completed' ? '完了' : '受講中'}
                            </Badge>
                          </div>
                          <span className="text-lg font-bold" style={{ 
                            color: program.progress === 100 ? CHART_COLORS.success : CHART_COLORS.primary 
                          }}>
                            {program.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300" 
                            style={{ 
                              width: `${program.progress}%`,
                              backgroundColor: program.progress === 100 ? CHART_COLORS.success : 
                                              program.progress >= 75 ? CHART_COLORS.primary :
                                              program.progress >= 50 ? CHART_COLORS.warning : CHART_COLORS.danger
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          {program.status === 'completed' ? (
                            <span>✅ 完了日: {program.completedDate}</span>
                          ) : (
                            <>
                              <span>📅 期限: {program.deadline}</span>
                              {program.nextSession && (
                                <span>🔜 次回: {program.nextSession}</span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 取得資格・認定 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🏆 取得資格・認定
                    <Badge style={{ backgroundColor: CHART_COLORS.success, color: 'white' }}>
                      {trainingData?.certifications?.length || 0}件
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trainingData?.certifications?.map((cert: any, index: number) => (
                      <div key={index} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-800">{cert.name}</span>
                          <Badge style={{ 
                            backgroundColor: cert.status === 'valid' ? CHART_COLORS.success : CHART_COLORS.danger,
                            color: 'white'
                          }}>
                            {cert.status === 'valid' ? '有効' : '期限切れ'}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>🎓 取得: {cert.obtainedDate}</span>
                          <span>📅 期限: {cert.expiryDate}</span>
                        </div>
                        {cert.status === 'valid' && (
                          <div className="mt-2 text-xs text-green-600">
                            ✓ 有効期限まであと{Math.floor((new Date(cert.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}日
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* 進捗インサイト */}
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      💡 進捗インサイト
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-green-600">✓</span>
                          <span>必須研修の達成率が目標を上回っています</span>
                        </div>
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-green-600">✓</span>
                          <span>計画通りのペースで学習が進行中</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-orange-600">△</span>
                          <span>リーダーシップ開発研修の進捗に注意</span>
                        </div>
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-blue-600">ℹ</span>
                          <span>次回の更新研修まで3ヶ月</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}


          {activeEducationTab === 'v3alignment' && (
            <div className="space-y-6">
              {/* V3評価システム連動サマリー */}
              <Card className="border-l-4" style={{ borderLeftColor: CHART_COLORS.primary }}>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">
                    🔗 V3評価システム連動
                  </h3>
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 bg-gray-50 px-4 py-3 rounded-lg mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">🎯 評価連動度:</span>
                      <span>{trainingData?.v3Integration?.evaluationAlignment || 0}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">📊 改善領域:</span>
                      <span>{trainingData?.v3Integration?.skillGapAnalysis?.length || 0}項目</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">🎓 推奨研修:</span>
                      <span>{trainingData?.v3Integration?.skillGapAnalysis?.length || 0}プログラム</span>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    V3評価システムの結果と連動した個人向け学習プランが効果的に実行されています。
                    評価で特定されたスキルギャップに基づく研修推奨により、効率的な能力向上を実現しています。
                  </p>
                </CardContent>
              </Card>

              {/* スキル統合ダッシュボード */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🎯 統合スキル分析
                    <Badge variant="outline" style={{ backgroundColor: CHART_COLORS.primary, color: 'white' }}>
                      評価連動
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* 技術スキルとソフトスキルの統合表示 */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* 技術スキル */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-800 flex items-center gap-2">
                        🛠️ 技術スキル
                      </h4>
                      {trainingData?.skillDevelopment?.technicalSkills?.map((skill: any, index: number) => (
                        <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-800">{skill.skill}</span>
                            <span className="text-lg font-bold" style={{ color: CHART_COLORS.primary }}>
                              {skill.level}/{skill.target}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-300" 
                              style={{ 
                                width: `${skill.level}%`,
                                backgroundColor: skill.level >= skill.target ? CHART_COLORS.success : 
                                                skill.level >= skill.target * 0.8 ? CHART_COLORS.primary :
                                                skill.level >= skill.target * 0.6 ? CHART_COLORS.warning : CHART_COLORS.danger
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>現在レベル: {skill.level}</span>
                            <span>目標: {skill.target}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* ソフトスキル */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-800 flex items-center gap-2">
                        🤝 ソフトスキル
                      </h4>
                      {trainingData?.skillDevelopment?.softSkills?.map((skill: any, index: number) => (
                        <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-800">{skill.skill}</span>
                            <span className="text-lg font-bold" style={{ color: CHART_COLORS.success }}>
                              {skill.level}/{skill.target}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-300" 
                              style={{ 
                                width: `${skill.level}%`,
                                backgroundColor: skill.level >= skill.target ? CHART_COLORS.success : 
                                                skill.level >= skill.target * 0.8 ? CHART_COLORS.primary :
                                                skill.level >= skill.target * 0.6 ? CHART_COLORS.warning : CHART_COLORS.danger
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>現在レベル: {skill.level}</span>
                            <span>目標: {skill.target}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* V3評価ギャップ分析 */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800 flex items-center gap-2">
                      📈 V3評価ギャップ分析
                    </h4>
                    {trainingData?.v3Integration?.skillGapAnalysis?.map((gap: any, index: number) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-gray-800">{gap.area}</span>
                            <Badge style={{ 
                              backgroundColor: gap.currentLevel >= gap.targetLevel * 0.9 ? CHART_COLORS.success : 
                                              gap.currentLevel >= gap.targetLevel * 0.7 ? CHART_COLORS.warning : CHART_COLORS.danger,
                              color: 'white'
                            }}>
                              ギャップ: {gap.targetLevel - gap.currentLevel}
                            </Badge>
                          </div>
                          <span className="text-lg font-bold" style={{ color: '#8b5cf6' }}>
                            {gap.currentLevel} → {gap.targetLevel}
                          </span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-3 relative">
                          <div 
                            className="h-3 rounded-full transition-all duration-300" 
                            style={{ 
                              width: `${gap.currentLevel}%`,
                              backgroundColor: '#8b5cf6'
                            }}
                          />
                          <div 
                            className="absolute top-0 h-3 w-1 bg-red-500" 
                            style={{ left: `${gap.targetLevel}%` }}
                          />
                          <div 
                            className="absolute -top-6 text-xs text-red-600 font-medium"
                            style={{ left: `${gap.targetLevel}%`, transform: 'translateX(-50%)' }}
                          >
                            目標
                          </div>
                        </div>
                        
                        <div className="bg-white p-3 rounded border">
                          <div className="flex items-start gap-2">
                            <span className="text-purple-600">🎓</span>
                            <div>
                              <span className="font-medium text-gray-800">推奨研修: </span>
                              <span className="text-gray-700">{gap.trainingPlan}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 統合インサイト */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      💡 統合スキル分析インサイト
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-green-600">✓</span>
                          <span>技術スキルの平均達成度: {Math.round((trainingData?.skillDevelopment?.technicalSkills?.reduce((sum: number, skill: any) => sum + skill.level, 0) || 0) / (trainingData?.skillDevelopment?.technicalSkills?.length || 1))}%</span>
                        </div>
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-green-600">✓</span>
                          <span>ソフトスキルの平均達成度: {Math.round((trainingData?.skillDevelopment?.softSkills?.reduce((sum: number, skill: any) => sum + skill.level, 0) || 0) / (trainingData?.skillDevelopment?.softSkills?.length || 1))}%</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-orange-600">△</span>
                          <span>V3評価での重点改善領域に集中した学習が効果的</span>
                        </div>
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-blue-600">ℹ</span>
                          <span>評価と研修の連動により効率的なスキル向上を実現</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  )
}