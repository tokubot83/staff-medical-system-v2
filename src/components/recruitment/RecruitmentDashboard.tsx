'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

// 効果的プレゼン指示書準拠のカラーパレット
const CHART_COLORS = {
  // 基本色（1-2色限定原則）
  primary: '#2563eb',       // 青 - 主要データ
  success: '#16a34a',       // 緑 - 成功・良好
  warning: '#f59e0b',       // オレンジ - 注意・改善必要
  danger: '#dc2626',        // 赤 - 問題・重要
  neutral: '#6b7280',       // グレー - その他
  
  // ステータス別色分け
  current: '#2563eb',       // 青 - 現在
  completed: '#16a34a',     // 緑 - 完了
  probation: '#f59e0b',     // オレンジ - 試用期間
  planning: '#8b5cf6',      // 紫 - 計画中
  
  // 背景色
  primaryBg: 'rgba(37, 99, 235, 0.1)',
  successBg: 'rgba(22, 163, 74, 0.1)',
  warningBg: 'rgba(245, 158, 11, 0.1)',
  neutralBg: 'rgba(107, 114, 128, 0.05)'
}

interface RecruitmentData {
  staffId: string;
  staffName: string;
  recruitmentInfo: {
    hireDate: string;
    recruitmentSource: string;
    initialPosition: string;
    probationPeriod: string;
    probationResult: string;
    recruiterId: string;
    recruiterName: string;
  };
  placementHistory: Array<{
    id: string;
    startDate: string;
    endDate: string | null;
    facility: string;
    department: string;
    position: string;
    reason: string;
    performance: string;
    status: 'current' | 'completed' | 'planned';
  }>;
  aptitudeAssessment: {
    technicalAptitude: number;
    communicationSkills: number;
    teamwork: number;
    adaptability: number;
    leadership: number;
    overallFit: number;
  };
  careerPath: {
    preferredSpecialty: string;
    careerGoals: string[];
    mentorshipNeeds: string[];
    nextPlacementRecommendation: string;
  };
  onboardingProgress: {
    orientation: boolean;
    mentorAssigned: boolean;
    skillAssessment: boolean;
    probationReview: boolean;
    completionRate: number;
  };
}

interface RecruitmentDashboardProps {
  data: RecruitmentData
}

export default function RecruitmentDashboard({ data }: RecruitmentDashboardProps) {
  
  // 勤続期間計算
  const calculateTenure = (hireDate: string) => {
    const hire = new Date(hireDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - hire.getTime());
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    return `${diffYears}年${diffMonths}ヶ月`;
  };

  // パフォーマンスグレードの色取得
  const getPerformanceColor = (grade: string) => {
    if (grade.startsWith('A')) return CHART_COLORS.success;
    if (grade.startsWith('B')) return CHART_COLORS.primary;
    if (grade.startsWith('C')) return CHART_COLORS.warning;
    return CHART_COLORS.neutral;
  };

  // 採用・オンボーディング概要
  const RecruitmentOverview = () => {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            👋 採用・オンボーディング概要
            <Badge 
              style={{ 
                backgroundColor: data.onboardingProgress.completionRate >= 100 ? CHART_COLORS.success : CHART_COLORS.warning,
                color: 'white'
              }}
            >
              {data.onboardingProgress.completionRate >= 100 ? '完了' : '進行中'}
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
              <strong>採用ストーリー:</strong> 
              {data.recruitmentInfo.hireDate}に{data.recruitmentInfo.recruitmentSource}として入職。
              現在の勤続期間は{calculateTenure(data.recruitmentInfo.hireDate)}、
              <span style={{ color: CHART_COLORS.success, fontWeight: 'bold' }}>
                総合適性{data.aptitudeAssessment.overallFit}点
              </span>
              で組織への適応が良好です。
            </p>
          </div>

          {/* 基本情報グリッド */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div 
              className="p-4 rounded-lg border-l-4"
              style={{ 
                borderLeftColor: CHART_COLORS.primary,
                backgroundColor: CHART_COLORS.primaryBg 
              }}
            >
              <h4 className="font-medium mb-3">📋 採用基本情報</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">採用日:</span>
                  <span className="font-medium">{data.recruitmentInfo.hireDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">採用区分:</span>
                  <span className="font-medium">{data.recruitmentInfo.recruitmentSource}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">勤続期間:</span>
                  <span className="font-medium">{calculateTenure(data.recruitmentInfo.hireDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">試用期間:</span>
                  <span className="font-medium">
                    {data.recruitmentInfo.probationPeriod} 
                    <Badge 
                      className="ml-2 text-xs"
                      style={{ 
                        backgroundColor: CHART_COLORS.success,
                        color: 'white'
                      }}
                    >
                      {data.recruitmentInfo.probationResult}
                    </Badge>
                  </span>
                </div>
              </div>
            </div>

            <div 
              className="p-4 rounded-lg border-l-4"
              style={{ 
                borderLeftColor: CHART_COLORS.success,
                backgroundColor: CHART_COLORS.successBg 
              }}
            >
              <h4 className="font-medium mb-3">🎯 オンボーディング進捗</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">全体進捗</span>
                    <span className="text-lg font-bold" style={{ color: CHART_COLORS.success }}>
                      {data.onboardingProgress.completionRate}%
                    </span>
                  </div>
                  <Progress value={data.onboardingProgress.completionRate} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className={`w-3 h-3 rounded-full ${data.onboardingProgress.orientation ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span>オリエンテーション</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-3 h-3 rounded-full ${data.onboardingProgress.mentorAssigned ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span>メンター配置</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-3 h-3 rounded-full ${data.onboardingProgress.skillAssessment ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span>スキル評価</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-3 h-3 rounded-full ${data.onboardingProgress.probationReview ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span>試用期間評価</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 配属履歴タイムライン
  const PlacementTimeline = () => {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📍 配属履歴・キャリアパス
            <Badge 
              style={{ 
                backgroundColor: CHART_COLORS.primary,
                color: 'white'
              }}
            >
              {data.placementHistory.length}部署経験
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
              <strong>キャリア発展:</strong> 
              計画的なローテーションにより多部署経験を積み、
              <span style={{ color: CHART_COLORS.success, fontWeight: 'bold' }}>
                {data.careerPath.preferredSpecialty}
              </span>
              での専門性を深めています。次期昇進に向けた準備が整っています。
            </p>
          </div>

          {/* タイムライン表示 */}
          <div className="space-y-4">
            {data.placementHistory.map((placement, index) => {
              const isCurrentPlacement = placement.status === 'current';
              const statusColor = isCurrentPlacement ? CHART_COLORS.current : CHART_COLORS.completed;
              
              return (
                <div key={placement.id} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: statusColor }}
                    >
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div 
                      className="p-4 rounded-lg border-l-4 mb-2"
                      style={{ 
                        borderLeftColor: statusColor,
                        backgroundColor: isCurrentPlacement ? CHART_COLORS.primaryBg : CHART_COLORS.neutralBg 
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {placement.department} ({placement.facility})
                          </h4>
                          <p className="text-sm text-gray-600">{placement.position}</p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            style={{ 
                              backgroundColor: getPerformanceColor(placement.performance),
                              color: 'white'
                            }}
                          >
                            {placement.performance}評価
                          </Badge>
                          {isCurrentPlacement && (
                            <Badge className="ml-2 bg-blue-100 text-blue-800">現在</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                          {placement.startDate} 〜 {placement.endDate || '現在'}
                        </span>
                        <span className="text-gray-600">{placement.reason}</span>
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

  // 適性評価レーダーチャート（横棒グラフ版）
  const AptitudeAssessment = () => {
    const aptitudeItems = [
      { label: '技術適性', value: data.aptitudeAssessment.technicalAptitude, key: 'technicalAptitude' },
      { label: 'コミュニケーション', value: data.aptitudeAssessment.communicationSkills, key: 'communicationSkills' },
      { label: 'チームワーク', value: data.aptitudeAssessment.teamwork, key: 'teamwork' },
      { label: '適応性', value: data.aptitudeAssessment.adaptability, key: 'adaptability' },
      { label: 'リーダーシップ', value: data.aptitudeAssessment.leadership, key: 'leadership' }
    ].sort((a, b) => b.value - a.value); // 重要度順（スコア順）

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎯 適性評価・職務適合度
            <Badge 
              style={{ 
                backgroundColor: data.aptitudeAssessment.overallFit >= 80 ? CHART_COLORS.success : CHART_COLORS.warning,
                color: 'white'
              }}
            >
              総合適性 {data.aptitudeAssessment.overallFit}点
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
              <strong>適性分析:</strong> 
              <span style={{ color: CHART_COLORS.success, fontWeight: 'bold' }}>
                {aptitudeItems[0].label}({aptitudeItems[0].value}点)
              </span>
              が最も優れており、組織への適合度も高く評価されています。
              継続的な成長により昇進候補として有望です。
            </p>
          </div>

          {/* 横棒グラフ表示 */}
          <div className="space-y-3 mb-6">
            {aptitudeItems.map((item, index) => {
              const isTop = index === 0;
              const percentage = item.value;
              const barColor = isTop ? CHART_COLORS.success : CHART_COLORS.primary;
              
              return (
                <div key={item.key} className="relative">
                  <div 
                    className="h-12 rounded-lg border flex items-center relative overflow-hidden"
                    style={{ backgroundColor: isTop ? CHART_COLORS.successBg : CHART_COLORS.primaryBg }}
                  >
                    {/* 実績バー */}
                    <div 
                      className="h-full rounded-lg transition-all duration-300"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: barColor
                      }}
                    />
                    
                    {/* ラベルとスコア */}
                    <div className="absolute inset-0 flex items-center justify-between px-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ backgroundColor: barColor }}
                        >
                          {index + 1}
                        </div>
                        <span 
                          className={`text-sm ${isTop ? 'font-bold' : 'font-medium'}`}
                          style={{ color: isTop ? CHART_COLORS.success : '#374151' }}
                        >
                          {item.label}
                        </span>
                      </div>
                      
                      <div className="text-right">
                        <div 
                          className="text-lg font-bold"
                          style={{ color: barColor }}
                        >
                          {item.value}
                        </div>
                        <div className="text-xs text-gray-500">100点満点</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* キャリア開発計画 */}
          <div 
            className="p-4 rounded-lg border-l-4"
            style={{ 
              borderLeftColor: CHART_COLORS.primary,
              backgroundColor: CHART_COLORS.primaryBg 
            }}
          >
            <h4 className="font-medium mb-3">🚀 キャリア開発計画</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium mb-2">希望専門分野</h5>
                <p className="text-sm text-gray-700">{data.careerPath.preferredSpecialty}</p>
              </div>
              <div>
                <h5 className="text-sm font-medium mb-2">キャリア目標</h5>
                <ul className="text-sm text-gray-700">
                  {data.careerPath.careerGoals.map((goal, index) => (
                    <li key={index} className="flex items-center gap-1">
                      <span className="text-blue-500">•</span>
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-medium mb-2">メンターシップニーズ</h5>
                <ul className="text-sm text-gray-700">
                  {data.careerPath.mentorshipNeeds.map((need, index) => (
                    <li key={index} className="flex items-center gap-1">
                      <span className="text-orange-500">•</span>
                      {need}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-medium mb-2">次期配属推奨</h5>
                <p className="text-sm font-medium" style={{ color: CHART_COLORS.primary }}>
                  {data.careerPath.nextPlacementRecommendation}
                </p>
              </div>
            </div>
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
            👋 採用から現在までの統合分析
          </h3>
          <p className="text-gray-700">
            {data.staffName}さんの採用から現在までの配属履歴、適性評価、キャリア開発を統合分析。
            <span style={{ color: CHART_COLORS.success, fontWeight: 'bold' }}>
              総合適性{data.aptitudeAssessment.overallFit}点
            </span>
            の高い職務適合度で、計画的なキャリア発展が進行中です。
          </p>
        </CardContent>
      </Card>

      <RecruitmentOverview />
      <PlacementTimeline />
      <AptitudeAssessment />
    </div>
  );
}