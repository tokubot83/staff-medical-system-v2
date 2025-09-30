'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  AlertTriangle,
  Heart,
  TrendingUp,
  FileText,
  Send,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import {
  assessOverallHealthRisk,
  generatePersonalizedRecommendations,
  type HealthData,
  type OverallRiskAssessment,
  type RiskScore
} from '@/lib/health/risk-assessment';

interface RiskAssessmentPanelProps {
  staffId: string;
  healthData?: HealthData;
  onNotificationSend?: (data: any) => void;
}

export const RiskAssessmentPanel: React.FC<RiskAssessmentPanelProps> = ({
  staffId,
  healthData,
  onNotificationSend
}) => {
  const [assessment, setAssessment] = useState<OverallRiskAssessment | null>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);

  useEffect(() => {
    if (healthData) {
      performAssessment();
    }
  }, [healthData]);

  const performAssessment = () => {
    if (!healthData) return;

    setLoading(true);
    try {
      const result = assessOverallHealthRisk(healthData);
      const recs = generatePersonalizedRecommendations(result, healthData);

      setAssessment(result);
      setRecommendations(recs);
    } catch (error) {
      console.error('Risk assessment failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'very-high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevelIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle2 className="w-4 h-4" />;
      case 'medium': return <TrendingUp className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'very-high': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const sendNotificationToVoiceDrive = async () => {
    if (!assessment) return;

    const notificationData = {
      type: 'health_risk_assessment',
      staffId,
      timestamp: new Date().toISOString(),
      assessment: {
        overallScore: assessment.overallScore,
        overallLevel: assessment.overallLevel,
        highRiskCategories: assessment.riskScores
          .filter(s => s.level === 'high' || s.level === 'very-high')
          .map(s => ({
            category: s.category,
            score: s.score,
            level: s.level
          })),
        priorityActions: assessment.priorityActions,
        nextCheckup: assessment.nextCheckupRecommendation
      },
      recommendations,
      metadata: {
        source: 'staff-medical-system',
        version: '1.0.0'
      }
    };

    try {
      // MCP共有フォルダに通知データを保存
      const response = await fetch('/api/health/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationData)
      });

      if (response.ok) {
        setNotificationSent(true);
        if (onNotificationSend) {
          onNotificationSend(notificationData);
        }

        // 3秒後に通知済みフラグをリセット
        setTimeout(() => setNotificationSent(false), 3000);
      }
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">リスク評価を実行中...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!assessment) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>健康データが不足しています</AlertTitle>
            <AlertDescription>
              リスク評価を実行するには、最新の健康診断データが必要です。
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 総合リスクスコア */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            健康リスク総合評価
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{assessment.overallScore}点</div>
                <div className="text-sm text-gray-500">総合リスクスコア</div>
              </div>
              <Badge className={getRiskLevelColor(assessment.overallLevel)}>
                {getRiskLevelIcon(assessment.overallLevel)}
                <span className="ml-1">
                  {assessment.overallLevel === 'low' ? '低リスク' :
                   assessment.overallLevel === 'medium' ? '中リスク' :
                   assessment.overallLevel === 'high' ? '高リスク' : '要注意'}
                </span>
              </Badge>
            </div>

            <Progress value={assessment.overallScore} className="h-2" />

            <Alert className={
              assessment.overallLevel === 'very-high' ? 'border-red-200 bg-red-50' :
              assessment.overallLevel === 'high' ? 'border-orange-200 bg-orange-50' :
              assessment.overallLevel === 'medium' ? 'border-yellow-200 bg-yellow-50' :
              'border-green-200 bg-green-50'
            }>
              <AlertTitle>次回健診推奨</AlertTitle>
              <AlertDescription>{assessment.nextCheckupRecommendation}</AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* カテゴリ別リスク評価 */}
      <Card>
        <CardHeader>
          <CardTitle>カテゴリ別リスク評価</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {assessment.riskScores.map((score: RiskScore) => (
              <div key={score.category} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{score.category}</h4>
                  <Badge className={getRiskLevelColor(score.level)} variant="outline">
                    {score.score}点
                  </Badge>
                </div>
                <Progress value={score.score} className="h-1 mb-2" />
                {score.factors.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-600 mb-1">リスク要因:</div>
                    <ul className="text-xs space-y-1">
                      {score.factors.slice(0, 3).map((factor, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-gray-400">•</span>
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 個別推奨事項 */}
      {recommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              個人別健康改善プラン
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="priority" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="priority">優先事項</TabsTrigger>
                <TabsTrigger value="lifestyle">生活習慣</TabsTrigger>
                <TabsTrigger value="diet">食事</TabsTrigger>
                <TabsTrigger value="exercise">運動</TabsTrigger>
                <TabsTrigger value="medical">医療</TabsTrigger>
              </TabsList>

              <TabsContent value="priority" className="space-y-2">
                <h4 className="font-medium text-sm mb-2">今すぐ取り組むべき事項</h4>
                {assessment.priorityActions.map((action, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 bg-red-50 rounded">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                    <span className="text-sm">{action}</span>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="lifestyle" className="space-y-2">
                <h4 className="font-medium text-sm mb-2">生活習慣の改善</h4>
                {recommendations.lifestyle.map((rec: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                    <Activity className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="diet" className="space-y-2">
                <h4 className="font-medium text-sm mb-2">食事の改善</h4>
                {recommendations.diet.map((rec: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 p-2 bg-green-50 rounded">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="exercise" className="space-y-2">
                <h4 className="font-medium text-sm mb-2">運動の推奨</h4>
                {recommendations.exercise.map((rec: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 p-2 bg-purple-50 rounded">
                    <Activity className="w-4 h-4 text-purple-600 mt-0.5" />
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="medical" className="space-y-2">
                <h4 className="font-medium text-sm mb-2">医療フォローアップ</h4>
                {recommendations.medicalFollowUp.map((rec: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 p-2 bg-orange-50 rounded">
                    <Heart className="w-4 h-4 text-orange-600 mt-0.5" />
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* VoiceDrive通知ボタン */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">VoiceDriveへの通知</h4>
              <p className="text-sm text-gray-500">
                評価結果と推奨事項をVoiceDriveシステムに送信します
              </p>
            </div>
            <Button
              onClick={sendNotificationToVoiceDrive}
              disabled={notificationSent}
              className="min-w-[120px]"
            >
              {notificationSent ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  送信済み
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  通知を送信
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};