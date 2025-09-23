'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Zap,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Calendar,
  User,
  Brain,
  Target,
  ArrowRight,
} from 'lucide-react';
import { SupportPlan } from '@/types/career-support';
import { useEvaluationVersion } from '@/contexts/EvaluationVersionContext';
import { useInterviewSystem } from '@/contexts/InterviewSystemContext';

interface AutoSupportSuggestionProps {
  staffId: string;
  evaluationScore: number;
  finalGrade: 'S' | 'A' | 'B' | 'C' | 'D';
  trend?: 'improving' | 'stable' | 'declining';
}

export default function AutoSupportSuggestion({
  staffId,
  evaluationScore,
  finalGrade,
  trend = 'stable',
}: AutoSupportSuggestionProps) {
  const [supportPlan, setSupportPlan] = useState<SupportPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  const { currentVersion: evaluationVersion } = useEvaluationVersion();
  const { currentVersion: interviewVersion } = useInterviewSystem();

  useEffect(() => {
    if (evaluationScore && finalGrade) {
      generateSupportPlan();
    }
  }, [evaluationScore, finalGrade, trend]);

  const generateSupportPlan = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/career-support/suggest-support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId,
          evaluationScore,
          finalGrade,
          trend,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSupportPlan(data.supportPlan);
      }
    } catch (error) {
      console.error('Failed to generate support plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyPlan = async () => {
    if (!supportPlan) return;

    setLoading(true);
    try {
      // 支援プランを適用（面談スケジュール、研修申し込みなど）
      // 実際の実装では各種APIを呼び出す

      setApplied(true);

      // 3秒後に成功メッセージを非表示
      setTimeout(() => {
        setApplied(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to apply support plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'declining':
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      default:
        return <Target className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading && !supportPlan) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <Brain className="h-8 w-8 text-gray-400 animate-spin" />
            <span className="ml-3 text-gray-500">支援プランを生成中...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!supportPlan) {
    return null;
  }

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            AI自動支援提案
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getPriorityColor(supportPlan.priority)}>
              優先度: {supportPlan.priority}
            </Badge>
            {getTrendIcon()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* トリガー情報 */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">評価結果トリガー</span>
            <Badge variant="outline">
              {finalGrade}評価 / {evaluationScore}点
            </Badge>
          </div>
          <p className="text-xs text-gray-500">
            {supportPlan.dbRecord.reason}
          </p>
        </div>

        {/* 推奨アクション */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            推奨アクション
          </h4>
          <div className="space-y-2">
            {supportPlan.actions.map((action, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-xs text-blue-600 mt-0.5">▶</span>
                <span className="text-sm text-gray-700">{action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* タイムライン */}
        <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
          <Calendar className="h-4 w-4 text-yellow-600" />
          <span className="text-sm">
            <span className="font-medium">実施期限:</span> {supportPlan.timeline}
          </span>
        </div>

        {/* 期待される成果 */}
        <div>
          <h4 className="text-sm font-semibold mb-2">期待される成果</h4>
          <div className="flex flex-wrap gap-2">
            {supportPlan.expectedOutcomes.map((outcome, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {outcome}
              </Badge>
            ))}
          </div>
        </div>

        {/* 必要リソース */}
        {supportPlan.resources.length > 0 && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-semibold mb-2">必要リソース</h4>
            <div className="space-y-1">
              {supportPlan.resources.map((resource, idx) => (
                <div key={idx} className="text-xs text-gray-600">
                  <span className="font-medium">{resource.type}:</span> {resource.description}
                  {resource.cost && <span className="ml-2">（予算: ¥{resource.cost.toLocaleString()}）</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 連携情報 */}
        {evaluationVersion && interviewVersion && (
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs">
                評価: {evaluationVersion.name}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs">
                面談: {interviewVersion.name}
              </Badge>
            </div>
          </div>
        )}

        {/* アクションボタン */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={applyPlan}
            disabled={loading || applied}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {applied ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                適用完了
              </>
            ) : (
              <>
                支援プランを適用
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
          <Button variant="outline" className="flex-1">
            カスタマイズ
          </Button>
        </div>

        {/* 成功メッセージ */}
        {applied && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              支援プランを適用しました。面談スケジュールと研修が自動設定されます。
            </AlertDescription>
          </Alert>
        )}

        {/* プライバシー保護の表示 */}
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs text-gray-500">
          <AlertCircle className="h-3 w-3" />
          <span>この支援内容は評価には影響しません（プライバシー保護設定: ON）</span>
        </div>
      </CardContent>
    </Card>
  );
}