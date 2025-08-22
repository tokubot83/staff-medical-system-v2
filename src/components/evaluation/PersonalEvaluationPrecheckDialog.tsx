'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  AlertTriangle,
  User,
  FileText,
  Calendar,
  UserCheck,
  RefreshCw,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import {
  checkPersonalEvaluationPrerequisites
} from '@/services/evaluationValidationService';
import {
  PersonalEvaluationPrecheck,
  V3ValidationError
} from '@/types/evaluation-validation-v3';

interface PersonalEvaluationPrecheckDialogProps {
  isOpen: boolean;
  onClose: () => void;
  staffId: string;
  staffName: string;
  onConfirm: () => void;
}

export default function PersonalEvaluationPrecheckDialog({
  isOpen,
  onClose,
  staffId,
  staffName,
  onConfirm
}: PersonalEvaluationPrecheckDialogProps) {
  const [precheckResult, setPrecheckResult] = useState<PersonalEvaluationPrecheck | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 前提条件チェック実行
  const performPrecheck = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await checkPersonalEvaluationPrerequisites(staffId);
      setPrecheckResult(result);
      
    } catch (err) {
      if (err instanceof V3ValidationError) {
        setError(err.message);
      } else {
        setError('前提条件チェックに失敗しました');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ダイアログが開かれた時にチェック実行
  React.useEffect(() => {
    if (isOpen && staffId) {
      performPrecheck();
    }
  }, [isOpen, staffId]);

  // 前提条件アイコン取得
  const getPrerequisiteIcon = (status: boolean) => {
    return status ? (
      <CheckCircle2 className="h-4 w-4 text-green-600" />
    ) : (
      <AlertTriangle className="h-4 w-4 text-red-600" />
    );
  };

  // 前提条件カラー取得
  const getPrerequisiteColor = (status: boolean) => {
    return status ? 'text-green-800' : 'text-red-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            個人評価開始前チェック
          </DialogTitle>
          <DialogDescription>
            {staffName} の評価を開始する前に、必要な前提条件を確認します。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* ローディング */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-sm text-gray-600">前提条件を確認中...</p>
              </div>
            </div>
          )}

          {/* エラー */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* チェック結果 */}
          {precheckResult && (
            <div className="space-y-4">
              {/* 総合結果 */}
              <div className={`rounded-lg border-2 p-4 ${
                precheckResult.canStartEvaluation 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getPrerequisiteIcon(precheckResult.canStartEvaluation)}
                    <span className={`font-semibold ${
                      precheckResult.canStartEvaluation ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {precheckResult.canStartEvaluation ? '評価開始可能' : '評価開始不可'}
                    </span>
                  </div>
                  <Badge className={
                    precheckResult.canStartEvaluation 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }>
                    {precheckResult.canStartEvaluation ? 'READY' : 'BLOCKED'}
                  </Badge>
                </div>
              </div>

              {/* 職員情報 */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">施設タイプ:</span>
                  <span className="ml-2 font-medium">{precheckResult.facilityType}</span>
                </div>
                <div>
                  <span className="text-gray-600">職種:</span>
                  <span className="ml-2 font-medium">{precheckResult.jobCategory}</span>
                </div>
                <div>
                  <span className="text-gray-600">経験レベル:</span>
                  <span className="ml-2 font-medium">{precheckResult.experienceLevel}</span>
                </div>
                <div>
                  <span className="text-gray-600">総配点:</span>
                  <span className="ml-2 font-medium">{precheckResult.availableItems.totalPoints}点</span>
                </div>
              </div>

              {/* 前提条件チェック詳細 */}
              <div>
                <h4 className="font-medium mb-3">前提条件チェック</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 rounded border">
                    {getPrerequisiteIcon(precheckResult.prerequisites.designApproved)}
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className={`flex-1 ${getPrerequisiteColor(precheckResult.prerequisites.designApproved)}`}>
                      制度設計承認済み
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 rounded border">
                    {getPrerequisiteIcon(precheckResult.prerequisites.schedulePhaseValid)}
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className={`flex-1 ${getPrerequisiteColor(precheckResult.prerequisites.schedulePhaseValid)}`}>
                      適切なスケジュールフェーズ
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 rounded border">
                    {getPrerequisiteIcon(precheckResult.prerequisites.itemsConfigured)}
                    <AlertCircle className="h-4 w-4 text-gray-500" />
                    <span className={`flex-1 ${getPrerequisiteColor(precheckResult.prerequisites.itemsConfigured)}`}>
                      評価項目設定済み
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 rounded border">
                    {getPrerequisiteIcon(precheckResult.prerequisites.evaluatorAssigned)}
                    <UserCheck className="h-4 w-4 text-gray-500" />
                    <span className={`flex-1 ${getPrerequisiteColor(precheckResult.prerequisites.evaluatorAssigned)}`}>
                      評価者割当済み
                    </span>
                  </div>
                </div>
              </div>

              {/* 利用可能項目情報 */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-medium mb-2 text-sm">利用可能な評価項目</h4>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{precheckResult.availableItems.coreItems}</div>
                    <div className="text-xs text-gray-600">法人統一項目</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{precheckResult.availableItems.facilityItems}</div>
                    <div className="text-xs text-gray-600">施設特化項目</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{precheckResult.availableItems.totalPoints}</div>
                    <div className="text-xs text-gray-600">総配点</div>
                  </div>
                </div>
              </div>

              {/* ブロッキング問題 */}
              {precheckResult.blockingIssues.length > 0 && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium text-red-800">解決が必要な問題:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {precheckResult.blockingIssues.map((issue, index) => (
                          <li key={index} className="text-sm text-red-700">
                            <span className="font-medium">{issue.message}</span>
                            {issue.resolution && (
                              <span className="block ml-4 text-xs mt-1 text-red-600">
                                解決方法: {issue.resolution}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            キャンセル
          </Button>
          
          {precheckResult && !precheckResult.canStartEvaluation && (
            <Button variant="outline" onClick={performPrecheck}>
              <RefreshCw className="h-4 w-4 mr-2" />
              再チェック
            </Button>
          )}
          
          <Button 
            onClick={onConfirm}
            disabled={!precheckResult?.canStartEvaluation}
            className={precheckResult?.canStartEvaluation ? '' : 'opacity-50'}
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            評価を開始
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}