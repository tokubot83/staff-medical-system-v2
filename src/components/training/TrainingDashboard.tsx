'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

// 効果的プレゼン指示書準拠のカラーパレット
const CHART_COLORS = {
  // 基本色（1-2色限定原則）
  primary: '#2563eb',       // 青 - 主要データ
  success: '#16a34a',       // 緑 - 完了・成功
  warning: '#f59e0b',       // オレンジ - 進行中・注意
  danger: '#dc2626',        // 赤 - 未完了・問題
  neutral: '#6b7280',       // グレー - その他
  highlight: '#fbbf24',     // 黄 - ハイライト
  
  // 研修タイプ別色分け
  mandatory: '#dc2626',     // 赤 - 必須研修
  recommended: '#f59e0b',   // オレンジ - 推奨研修
  optional: '#2563eb',      // 青 - 任意研修
  certification: '#8b5cf6', // 紫 - 資格研修
  
  // 進捗・レベル別色分け
  beginner: '#94a3b8',      // グレー - 初級
  intermediate: '#3b82f6',  // 青 - 中級
  advanced: '#16a34a',      // 緑 - 上級
  expert: '#7c3aed',        // 紫 - エキスパート
  
  // 背景色
  primaryBg: 'rgba(37, 99, 235, 0.1)',
  successBg: 'rgba(22, 163, 74, 0.1)',
  warningBg: 'rgba(245, 158, 11, 0.1)',
  neutralBg: 'rgba(107, 114, 128, 0.05)'
}

interface TrainingData {
  staffId: string;
  staffName: string;
  
  // 研修受講状況サマリー
  trainingSummary: {
    totalHours: number;
    completedCourses: number;
    inProgressCourses: number;
    upcomingCourses: number;
    completionRate: number;
    averageScore: number;
    lastTrainingDate: string;
  };
  
  // 研修履歴（時系列）
  trainingHistory: Array<{
    id: string;
    title: string;
    category: 'technical' | 'safety' | 'communication' | 'leadership' | 'compliance';
    type: 'mandatory' | 'recommended' | 'optional' | 'certification';
    startDate: string;
    endDate: string;
    duration: number; // 時間
    status: 'completed' | 'in_progress' | 'scheduled' | 'overdue';
    score?: number;
    instructor: string;
    location: string;
    feedback?: string;
  }>;
  
  // スキル成長マップ
  skillGrowth: {
    technical: Array<{
      skill: string;
      currentLevel: number;
      targetLevel: number;
      growth: number;
      trend: 'improving' | 'stable' | 'declining';
      relatedTrainings: string[];
    }>;
    behavioral: Array<{
      skill: string;
      currentLevel: number;
      targetLevel: number;
      growth: number;
      trend: 'improving' | 'stable' | 'declining';
      relatedTrainings: string[];
    }>;
  };
  
  // 資格・認定状況
  certifications: Array<{
    id: string;
    name: string;
    category: 'professional' | 'safety' | 'technical' | 'management';
    status: 'obtained' | 'in_progress' | 'expired' | 'planned';
    obtainedDate?: string;
    expiryDate?: string;
    renewalRequired: boolean;
    priority: 'high' | 'medium' | 'low';
  }>;
  
  // 研修計画・推奨
  trainingPlan: {
    nextQuarter: Array<{
      title: string;
      category: string;
      priority: 'high' | 'medium' | 'low';
      reason: string;
      estimatedDuration: number;
      prerequisite?: string;
    }>;
    annualGoal: {
      targetHours: number;
      currentHours: number;
      keyFocusAreas: string[];
      expectedOutcomes: string[];
    };
  };
  
  // 学習効果測定
  learningEffectiveness: {
    knowledgeRetention: number;     // 知識定着率
    skillApplication: number;       // スキル適用率
    performanceImprovement: number; // パフォーマンス改善度
    behaviorChange: number;         // 行動変化度
    overallEffectiveness: number;   // 総合効果
  };
}

interface TrainingDashboardProps {
  data: TrainingData
}

export default function TrainingDashboard({ data }: TrainingDashboardProps) {
  
  // 研修タイプの色とラベル取得
  const getTrainingTypeInfo = (type: string) => {
    const typeMap = {
      mandatory: { color: CHART_COLORS.mandatory, label: '必須', icon: '🚨' },
      recommended: { color: CHART_COLORS.recommended, label: '推奨', icon: '⭐' },
      optional: { color: CHART_COLORS.optional, label: '任意', icon: '💡' },
      certification: { color: CHART_COLORS.certification, label: '資格', icon: '🏆' }
    };
    return typeMap[type as keyof typeof typeMap] || { color: CHART_COLORS.neutral, label: type, icon: '📚' };
  };

  // スキルレベルの色取得
  const getSkillLevelColor = (level: number) => {
    if (level >= 90) return CHART_COLORS.expert;
    if (level >= 75) return CHART_COLORS.advanced;
    if (level >= 60) return CHART_COLORS.intermediate;
    return CHART_COLORS.beginner;
  };

  // 研修概要ダッシュボード
  const TrainingOverview = () => {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎓 教育・研修統合ダッシュボード
            <Badge 
              style={{ 
                backgroundColor: data.trainingSummary.completionRate >= 90 ? CHART_COLORS.success : 
                                data.trainingSummary.completionRate >= 70 ? CHART_COLORS.warning : CHART_COLORS.danger,
                color: 'white'
              }}
            >
              受講完了率 {data.trainingSummary.completionRate}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* メインメッセージ */}
          <div 
            className="mb-4 p-3 rounded-lg border-l-4"
            style={{ 
              borderLeftColor: CHART_COLORS.primary,
              backgroundColor: CHART_COLORS.primaryBg 
            }}
          >
            <p className="text-sm font-medium">
              <strong>研修成果ストーリー:</strong> 
              年間{data.trainingSummary.totalHours}時間の計画的な学習により、
              <span style={{ color: CHART_COLORS.success, fontWeight: 'bold' }}>
                {data.trainingSummary.completedCourses}コース完了
              </span>。
              平均スコア{data.trainingSummary.averageScore}点で、
              継続的なスキル向上と専門性強化を実現しています。
            </p>
          </div>

          {/* 研修サマリーグリッド */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div 
              className="p-4 rounded-lg text-center border-l-4"
              style={{ 
                borderLeftColor: CHART_COLORS.success,
                backgroundColor: CHART_COLORS.successBg 
              }}
            >
              <div className="text-2xl font-bold" style={{ color: CHART_COLORS.success }}>
                {data.trainingSummary.totalHours}
              </div>
              <div className="text-sm text-gray-600">総研修時間</div>
            </div>
            
            <div 
              className="p-4 rounded-lg text-center border-l-4"
              style={{ 
                borderLeftColor: CHART_COLORS.primary,
                backgroundColor: CHART_COLORS.primaryBg 
              }}
            >
              <div className="text-2xl font-bold" style={{ color: CHART_COLORS.primary }}>
                {data.trainingSummary.completedCourses}
              </div>
              <div className="text-sm text-gray-600">完了コース</div>
            </div>
            
            <div 
              className="p-4 rounded-lg text-center border-l-4"
              style={{ 
                borderLeftColor: CHART_COLORS.warning,
                backgroundColor: CHART_COLORS.warningBg 
              }}
            >
              <div className="text-2xl font-bold" style={{ color: CHART_COLORS.warning }}>
                {data.trainingSummary.inProgressCourses}
              </div>
              <div className="text-sm text-gray-600">進行中</div>
            </div>
            
            <div 
              className="p-4 rounded-lg text-center border-l-4"
              style={{ 
                borderLeftColor: CHART_COLORS.highlight,
                backgroundColor: 'rgba(251, 191, 36, 0.1)' 
              }}
            >
              <div className="text-2xl font-bold" style={{ color: CHART_COLORS.highlight }}>
                {data.trainingSummary.averageScore}
              </div>
              <div className="text-sm text-gray-600">平均スコア</div>
            </div>
          </div>

          {/* 全体進捗バー */}
          <div 
            className="p-4 rounded-lg"
            style={{ backgroundColor: CHART_COLORS.neutralBg }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">年間研修計画進捗</span>
              <span className="text-lg font-bold" style={{ color: CHART_COLORS.primary }}>
                {data.trainingSummary.completionRate}%
              </span>
            </div>
            <Progress value={data.trainingSummary.completionRate} className="h-3" />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>完了 {data.trainingSummary.completedCourses}コース</span>
              <span>予定 {data.trainingSummary.upcomingCourses}コース</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 研修履歴タイムライン
  const TrainingTimeline = () => {
    // 最近の研修を時系列順に表示
    const recentTrainings = data.trainingHistory
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .slice(0, 8);

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📚 研修受講履歴・タイムライン
            <Badge 
              style={{ 
                backgroundColor: CHART_COLORS.primary,
                color: 'white'
              }}
            >
              直近8件
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* メインメッセージ */}
          <div 
            className="mb-4 p-3 rounded-lg border-l-4"
            style={{ 
              borderLeftColor: CHART_COLORS.success,
              backgroundColor: CHART_COLORS.successBg 
            }}
          >
            <p className="text-sm font-medium">
              <strong>学習継続性:</strong> 
              体系的な研修計画により、技術・安全・コミュニケーション等の
              多角的なスキル開発を実施。最新の研修は
              <span style={{ color: CHART_COLORS.primary, fontWeight: 'bold' }}>
                {data.trainingSummary.lastTrainingDate}
              </span>
              で継続的な学習姿勢を維持しています。
            </p>
          </div>

          {/* タイムライン表示 */}
          <div className="space-y-4">
            {recentTrainings.map((training, index) => {
              const typeInfo = getTrainingTypeInfo(training.type);
              const isRecent = index < 3;
              
              return (
                <div key={training.id} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg shadow-lg"
                      style={{ backgroundColor: typeInfo.color }}
                    >
                      {typeInfo.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div 
                      className="p-4 rounded-lg border-l-4"
                      style={{ 
                        borderLeftColor: typeInfo.color,
                        backgroundColor: isRecent ? CHART_COLORS.primaryBg : CHART_COLORS.neutralBg 
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-800">{training.title}</h4>
                          <p className="text-sm text-gray-600">{training.category} • {training.duration}時間</p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            style={{ 
                              backgroundColor: typeInfo.color,
                              color: 'white'
                            }}
                          >
                            {typeInfo.label}
                          </Badge>
                          {training.score && (
                            <div className="mt-1">
                              <Badge variant="outline" className="bg-white">
                                {training.score}点
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                          {training.startDate} 〜 {training.endDate}
                        </span>
                        <span className="text-gray-600">
                          講師: {training.instructor}
                        </span>
                      </div>
                      
                      {training.feedback && (
                        <div className="mt-2 text-xs text-gray-600 italic">
                          💬 {training.feedback}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  // スキル成長マップ
  const SkillGrowthMap = () => {
    const allSkills = [
      ...data.skillGrowth.technical.map(s => ({ ...s, category: 'technical' })),
      ...data.skillGrowth.behavioral.map(s => ({ ...s, category: 'behavioral' }))
    ].sort((a, b) => b.growth - a.growth); // 成長度順

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📈 スキル成長マップ
            <Badge 
              style={{ 
                backgroundColor: CHART_COLORS.success,
                color: 'white'
              }}
            >
              {allSkills.filter(s => s.trend === 'improving').length}スキル向上中
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* メインメッセージ */}
          <div 
            className="mb-4 p-3 rounded-lg border-l-4"
            style={{ 
              borderLeftColor: CHART_COLORS.success,
              backgroundColor: CHART_COLORS.successBg 
            }}
          >
            <p className="text-sm font-medium">
              <strong>スキル成長分析:</strong> 
              <span style={{ color: CHART_COLORS.success, fontWeight: 'bold' }}>
                {allSkills[0]?.skill}
              </span>
              が最も成長（+{allSkills[0]?.growth}ポイント）。
              研修効果が着実にスキル向上につながり、目標達成に向けて順調に進捗しています。
            </p>
          </div>

          {/* スキル横棒グラフ */}
          <div className="space-y-3">
            {allSkills.slice(0, 8).map((skill, index) => {
              const isTop = index === 0;
              const progressPercentage = (skill.currentLevel / skill.targetLevel) * 100;
              const skillLevelColor = getSkillLevelColor(skill.currentLevel);
              
              return (
                <div key={`${skill.category}-${skill.skill}`} className="relative">
                  <div 
                    className="h-14 rounded-lg border flex items-center relative overflow-hidden"
                    style={{ backgroundColor: isTop ? CHART_COLORS.successBg : CHART_COLORS.neutralBg }}
                  >
                    {/* 現在レベルバー */}
                    <div 
                      className="h-full rounded-lg transition-all duration-300"
                      style={{ 
                        width: `${progressPercentage}%`,
                        backgroundColor: skillLevelColor,
                        opacity: 0.8
                      }}
                    />
                    
                    {/* ラベルとデータ */}
                    <div className="absolute inset-0 flex items-center justify-between px-4">
                      <div className="flex items-center gap-3 flex-1">
                        {/* 成長アイコン */}
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                          style={{ backgroundColor: skillLevelColor }}
                        >
                          {skill.trend === 'improving' ? '📈' : 
                           skill.trend === 'stable' ? '➡️' : '📉'}
                        </div>
                        
                        {/* スキル情報 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span 
                              className={`text-sm ${isTop ? 'font-bold' : 'font-medium'} truncate`}
                              style={{ color: isTop ? CHART_COLORS.success : '#374151' }}
                            >
                              {skill.skill}
                            </span>
                            <Badge 
                              variant="outline"
                              className="text-xs"
                              style={{ 
                                borderColor: skill.category === 'technical' ? CHART_COLORS.primary : CHART_COLORS.highlight,
                                color: skill.category === 'technical' ? CHART_COLORS.primary : CHART_COLORS.highlight
                              }}
                            >
                              {skill.category === 'technical' ? '技術' : '行動'}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-600 truncate">
                            関連研修: {skill.relatedTrainings.join(', ')}
                          </div>
                        </div>
                      </div>
                      
                      {/* スコアと成長 */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <div 
                            className="text-lg font-bold"
                            style={{ color: skillLevelColor }}
                          >
                            {skill.currentLevel}
                          </div>
                          <div className="text-xs text-gray-500">
                            目標{skill.targetLevel}
                          </div>
                        </div>
                        
                        <Badge 
                          style={{ 
                            backgroundColor: CHART_COLORS.success,
                            color: 'white',
                            fontSize: '11px'
                          }}
                        >
                          +{skill.growth}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  // 学習効果測定
  const LearningEffectiveness = () => {
    const effectivenessItems = [
      { label: '知識定着率', value: data.learningEffectiveness.knowledgeRetention, icon: '🧠' },
      { label: 'スキル適用率', value: data.learningEffectiveness.skillApplication, icon: '⚡' },
      { label: 'パフォーマンス改善', value: data.learningEffectiveness.performanceImprovement, icon: '📊' },
      { label: '行動変化度', value: data.learningEffectiveness.behaviorChange, icon: '🔄' }
    ].sort((a, b) => b.value - a.value);

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎯 学習効果測定・ROI分析
            <Badge 
              style={{ 
                backgroundColor: data.learningEffectiveness.overallEffectiveness >= 80 ? CHART_COLORS.success : 
                                data.learningEffectiveness.overallEffectiveness >= 60 ? CHART_COLORS.warning : CHART_COLORS.danger,
                color: 'white'
              }}
            >
              総合効果 {data.learningEffectiveness.overallEffectiveness}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* メインメッセージ */}
          <div 
            className="mb-4 p-3 rounded-lg border-l-4"
            style={{ 
              borderLeftColor: CHART_COLORS.primary,
              backgroundColor: CHART_COLORS.primaryBg 
            }}
          >
            <p className="text-sm font-medium">
              <strong>研修投資効果:</strong> 
              <span style={{ color: CHART_COLORS.success, fontWeight: 'bold' }}>
                {effectivenessItems[0].label}{effectivenessItems[0].value}%
              </span>
              が最も高く、研修内容が実務に効果的に活用されています。
              継続的な学習により組織パフォーマンス向上に貢献しています。
            </p>
          </div>

          {/* 効果測定メトリクス */}
          <div className="grid grid-cols-2 gap-4">
            {effectivenessItems.map((item, index) => {
              const isTop = index === 0;
              const color = item.value >= 80 ? CHART_COLORS.success : 
                           item.value >= 60 ? CHART_COLORS.warning : CHART_COLORS.danger;
              
              return (
                <div 
                  key={item.label}
                  className="p-4 rounded-lg border-l-4"
                  style={{ 
                    borderLeftColor: color,
                    backgroundColor: isTop ? CHART_COLORS.successBg : CHART_COLORS.neutralBg 
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <span 
                        className={`text-sm ${isTop ? 'font-bold' : 'font-medium'}`}
                        style={{ color: isTop ? CHART_COLORS.success : '#374151' }}
                      >
                        {item.label}
                      </span>
                    </div>
                    <div 
                      className="text-xl font-bold"
                      style={{ color: color }}
                    >
                      {item.value}%
                    </div>
                  </div>
                  <Progress value={item.value} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* データストーリーのメインメッセージ */}
      <Card 
        className="border-l-4"
        style={{ borderLeftColor: CHART_COLORS.primary }}
      >
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">
            🎓 教育・研修統合分析結果
          </h3>
          <p className="text-gray-700">
            {data.staffName}さんの研修受講履歴と学習効果を統合分析。
            年間{data.trainingSummary.totalHours}時間の計画的学習により、
            <span style={{ color: CHART_COLORS.success, fontWeight: 'bold' }}>
              総合学習効果{data.learningEffectiveness.overallEffectiveness}%
            </span>
            を達成し、継続的なスキル向上と専門性強化を実現しています。
          </p>
        </CardContent>
      </Card>

      <TrainingOverview />
      <TrainingTimeline />
      <SkillGrowthMap />
      <LearningEffectiveness />
    </div>
  );
}