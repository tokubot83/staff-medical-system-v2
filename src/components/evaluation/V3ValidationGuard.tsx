'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Settings,
  Calendar,
  Lock,
  Unlock,
  Clock,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import {
  getCurrentScheduleControl,
  validateEvaluationDesign,
  checkPersonalEvaluationPrerequisites
} from '@/services/evaluationValidationService';
import {
  V3EvaluationDesignValidation,
  V3ScheduleControl,
  PersonalEvaluationPrecheck,
  V3ValidationError
} from '@/types/evaluation-validation-v3';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { AppError, ErrorLevel } from '@/lib/error/AppError';

interface V3ValidationGuardProps {
  children: React.ReactNode;
  facilityType?: 'acute' | 'chronic' | 'roken' | 'grouphome' | 'outpatient';
  showValidationDetails?: boolean;
  onValidationComplete?: (isValid: boolean) => void;
}

export default function V3ValidationGuard({
  children,
  facilityType = 'acute',
  showValidationDetails = true,
  onValidationComplete
}: V3ValidationGuardProps) {
  const { handleError } = useErrorHandler();
  
  // 状態管理
  const [isLoading, setIsLoading] = useState(true);
  const [scheduleControl, setScheduleControl] = useState<V3ScheduleControl | null>(null);
  const [designValidation, setDesignValidation] = useState<V3EvaluationDesignValidation | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSystemValid, setIsSystemValid] = useState(false);

  // システム検証処理
  const validateSystem = async () => {
    try {
      setIsLoading(true);
      setValidationError(null);
      
      // スケジュール制御チェック
      const schedule = getCurrentScheduleControl();
      setScheduleControl(schedule);
      
      // 制度設計完了チェック
      const design = await validateEvaluationDesign(facilityType, new Date().getFullYear());
      setDesignValidation(design);
      
      // 総合判定
      const systemValid = 
        schedule.allowedActions.canStartPersonalEvaluation && 
        design.canStartPersonalEvaluation;
      
      setIsSystemValid(systemValid);
      onValidationComplete?.(systemValid);
      
    } catch (error) {
      if (error instanceof V3ValidationError) {
        setValidationError(error.message);
      } else {
        const appError = new AppError(
          'V3_SYSTEM_VALIDATION_FAILED',
          'V3システム検証に失敗しました',
          ErrorLevel.ERROR,
          { facilityType, error }
        );
        handleError(appError);
      }
      setIsSystemValid(false);
      onValidationComplete?.(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 初期検証
  useEffect(() => {
    validateSystem();
  }, [facilityType]);

  // ローディング中
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-sm text-gray-600">V3評価システムを検証中...</p>
        </div>
      </div>
    );
  }

  // バリデーション詳細表示
  const ValidationDetails = () => (
    <div className="space-y-4 mb-6">
      {/* システム状態サマリー */}
      <Card className={`border-2 ${isSystemValid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            {isSystemValid ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <Lock className="h-5 w-5 text-red-600" />
            )}
            V3評価システム状態
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium">
              {isSystemValid ? '個人評価実行可能' : '個人評価実行不可'}
            </span>
            <Badge className={isSystemValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {isSystemValid ? 'READY' : 'BLOCKED'}
            </Badge>
          </div>
          
          {scheduleControl && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">現在フェーズ:</span>
                <span className="font-medium ml-2">{scheduleControl.currentPhase}</span>
              </div>
              <div>
                <span className="text-gray-600">次の期限:</span>
                <span className="font-medium ml-2">{scheduleControl.nextMilestone.dueDate}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* スケジュール制御アラート */}
      {scheduleControl && !scheduleControl.allowedActions.canStartPersonalEvaluation && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <Clock className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">スケジュール制約</AlertTitle>
          <AlertDescription className="text-yellow-700">
            <div className="space-y-2">
              <p>現在のフェーズ（{scheduleControl.currentPhase}）では個人評価を実行できません。</p>
              <p>
                <strong>次回実行可能:</strong> {scheduleControl.nextMilestone.phase} 
                （{scheduleControl.nextMilestone.dueDate}）
              </p>
              <div className="mt-3">
                <Link href="/evaluation-design/timeline">
                  <Button size="sm" variant="outline" className="border-yellow-300">
                    <Calendar className="h-4 w-4 mr-2" />
                    年間スケジュールを確認
                  </Button>
                </Link>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* 制度設計完了アラート */}
      {designValidation && !designValidation.canStartPersonalEvaluation && (
        <Alert className="border-orange-200 bg-orange-50">
          <Settings className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-800">制度設計未完了</AlertTitle>
          <AlertDescription className="text-orange-700">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>設計完了率:</span>
                <span className="font-bold">{designValidation.technicalEvaluation.completionRate}%</span>
              </div>
              <Progress 
                value={designValidation.technicalEvaluation.completionRate} 
                className="h-2" 
              />
              
              <div>
                <p className="font-medium mb-2">未完了項目:</p>
                <ul className="list-disc list-inside space-y-1">
                  {designValidation.blockingIssues.map((issue, index) => (
                    <li key={index} className="text-sm">{issue}</li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 mt-3">
                <Link href="/evaluation-design">
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                    <Settings className="h-4 w-4 mr-2" />
                    制度設計を完了
                  </Button>
                </Link>
                <Button size="sm" variant="outline" onClick={validateSystem}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  状態を再検証
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* 検証エラー */}
      {validationError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">検証エラー</AlertTitle>
          <AlertDescription className="text-red-700">
            <p>{validationError}</p>
            <Button size="sm" variant="outline" onClick={validateSystem} className="mt-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              再試行
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  return (
    <div>
      {showValidationDetails && <ValidationDetails />}
      
      {/* メインコンテンツ */}
      <div className={isSystemValid ? '' : 'opacity-50 pointer-events-none'}>
        {children}
      </div>
      
      {/* システム無効時のオーバーレイメッセージ */}
      {!isSystemValid && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 pointer-events-none">
          <Card className="max-w-md mx-4 pointer-events-auto">
            <CardContent className="p-6 text-center">
              <Lock className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                個人評価実行不可
              </h3>
              <p className="text-sm text-red-700 mb-4">
                V3評価システムの前提条件が満たされていません。
              </p>
              <Button onClick={validateSystem} size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                再検証
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}