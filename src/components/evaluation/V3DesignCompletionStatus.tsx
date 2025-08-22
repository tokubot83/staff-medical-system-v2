'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Settings,
  Users,
  Calendar,
  TrendingUp,
  RefreshCw,
  Eye,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import {
  validateEvaluationDesign,
  getCurrentScheduleControl
} from '@/services/evaluationValidationService';
import {
  V3EvaluationDesignValidation,
  V3ScheduleControl
} from '@/types/evaluation-validation-v3';

interface V3DesignCompletionStatusProps {
  facilityType?: 'acute' | 'chronic' | 'roken' | 'grouphome' | 'outpatient';
  showActions?: boolean;
  onStatusChange?: (isComplete: boolean) => void;
}

export default function V3DesignCompletionStatus({
  facilityType = 'acute',
  showActions = true,
  onStatusChange
}: V3DesignCompletionStatusProps) {
  const [designValidation, setDesignValidation] = useState<V3EvaluationDesignValidation | null>(null);
  const [scheduleControl, setScheduleControl] = useState<V3ScheduleControl | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ステータス更新
  const updateStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [validation, schedule] = await Promise.all([
        validateEvaluationDesign(facilityType, new Date().getFullYear()),
        Promise.resolve(getCurrentScheduleControl())
      ]);

      setDesignValidation(validation);
      setScheduleControl(schedule);
      onStatusChange?.(validation.canStartPersonalEvaluation);

    } catch (err) {
      setError('制度設計状況の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    updateStatus();
  }, [facilityType]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            <span className="ml-2 text-sm text-gray-600">状況を確認中...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-700">
          {error}
          <Button size="sm" variant="outline" onClick={updateStatus} className="ml-2">
            再試行
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!designValidation || !scheduleControl) return null;

  return (
    <div className="space-y-4">
      {/* メインステータスカード */}
      <Card className={`border-2 ${
        designValidation.canStartPersonalEvaluation 
          ? 'border-green-200 bg-green-50' 
          : 'border-orange-200 bg-orange-50'
      }`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {designValidation.canStartPersonalEvaluation ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <Clock className="h-5 w-5 text-orange-600" />
              )}
              <span>V3制度設計状況</span>
            </div>
            <Badge className={
              designValidation.canStartPersonalEvaluation 
                ? 'bg-green-100 text-green-800' 
                : 'bg-orange-100 text-orange-800'
            }>
              {designValidation.status === 'approved' ? '承認済み' : 
               designValidation.status === 'reviewing' ? '審査中' :
               designValidation.status === 'active' ? '運用中' : 'ドラフト'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 完了率 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">設計完了率</span>
              <span className="text-2xl font-bold text-blue-600">
                {designValidation.technicalEvaluation.completionRate}%
              </span>
            </div>
            <Progress value={designValidation.technicalEvaluation.completionRate} className="h-3" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>
                {designValidation.technicalEvaluation.totalConfigured} / {designValidation.technicalEvaluation.totalRequired} 項目完了
              </span>
              <span>
                {designValidation.canStartPersonalEvaluation ? '個人評価実行可能' : '設定継続が必要'}
              </span>
            </div>
          </div>

          {/* 施設情報 */}
          <div className="grid grid-cols-2 gap-4 text-sm border-t pt-3">
            <div>
              <span className="text-gray-600">施設タイプ:</span>
              <span className="ml-2 font-medium">{designValidation.facilityName}</span>
            </div>
            <div>
              <span className="text-gray-600">対象年度:</span>
              <span className="ml-2 font-medium">{designValidation.year}年度</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 詳細ステータス */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 技術評価設定 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="h-4 w-4" />
              技術評価設定（50点）
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">法人統一項目</span>
              {designValidation.technicalEvaluation.coreItemsComplete ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <Clock className="h-4 w-4 text-orange-600" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">施設特化項目</span>
              {designValidation.technicalEvaluation.facilityItemsComplete ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <Clock className="h-4 w-4 text-orange-600" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* 貢献度評価設定 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              貢献度評価設定（50点）
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">施設貢献度</span>
              {designValidation.contributionEvaluation.facilityContributionComplete ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <Clock className="h-4 w-4 text-orange-600" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">法人貢献度</span>
              {designValidation.contributionEvaluation.corporateContributionComplete ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <Clock className="h-4 w-4 text-orange-600" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* スケジュール制約アラート */}
      {!scheduleControl.allowedActions.canDesignEvaluation && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <Calendar className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700">
            現在のスケジュールフェーズ（{scheduleControl.currentPhase}）では制度設計の変更ができません。
            変更可能時期: {scheduleControl.restrictions.find(r => r.action === '制度設計変更')?.availableFrom || '要確認'}
          </AlertDescription>
        </Alert>
      )}

      {/* ブロッキング問題 */}
      {designValidation.blockingIssues.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            <div className="space-y-2">
              <p className="font-medium">完了が必要な項目:</p>
              <ul className="list-disc list-inside space-y-1">
                {designValidation.blockingIssues.map((issue, index) => (
                  <li key={index} className="text-sm">{issue}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* アクションボタン */}
      {showActions && (
        <div className="flex gap-2">
          {designValidation.status === 'draft' && scheduleControl.allowedActions.canDesignEvaluation && (
            <Link href="/evaluation-design/wizard">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Settings className="h-4 w-4 mr-2" />
                設計を続行
              </Button>
            </Link>
          )}
          
          {designValidation.canStartPersonalEvaluation && (
            <Link href="/evaluation-execution">
              <Button className="bg-green-600 hover:bg-green-700">
                <Users className="h-4 w-4 mr-2" />
                個人評価を実行
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          )}
          
          <Link href="/evaluation-design/timeline">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              年間スケジュール確認
            </Button>
          </Link>
          
          <Button variant="outline" onClick={updateStatus}>
            <RefreshCw className="h-4 w-4 mr-2" />
            状況更新
          </Button>
        </div>
      )}
    </div>
  );
}