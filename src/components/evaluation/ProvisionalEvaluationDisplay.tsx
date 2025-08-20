// 暫定評価表示コンポーネント
// 職員カルテの人事評価タブで年間途中経過を表示

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Info,
  Target
} from 'lucide-react';

export interface ProvisionalEvaluationData {
  staffId: string;
  staffName: string;
  currentYear: number;
  
  // 確定済み評価データ
  confirmed: {
    summerContribution?: {
      facilityPoints: number;
      corporatePoints: number;
      total: number;
      confirmedDate: string;
      facilityGrade: 'S' | 'A' | 'B' | 'C' | 'D';
      corporateGrade: 'S' | 'A' | 'B' | 'C' | 'D';
    };
    
    annualContribution?: {
      facilityPoints: number;
      corporatePoints: number;
      total: number;
      confirmedDate: string;
      facilityGrade: 'S' | 'A' | 'B' | 'C' | 'D';
      corporateGrade: 'S' | 'A' | 'B' | 'C' | 'D';
    };
    
    technicalEvaluation?: {
      coreItemsScore: number;
      facilityItemsScore: number;
      total: number;
      confirmedDate: string;
    };
  };
  
  // 暫定評価データ
  provisional: {
    estimatedTotalScore?: {
      min: number;
      max: number;
      current: number;
    };
    facilityRanking?: {
      currentRank: string;
      confidence: 'low' | 'medium' | 'high';
    };
    corporateRanking?: {
      currentRank: string;
      confidence: 'low' | 'medium' | 'high';
    };
    estimatedGrade?: {
      grade: string;
      confidence: 'low' | 'medium' | 'high';
    };
  };
  
  // 前年度参考データ
  lastYear?: {
    totalScore: number;
    finalGrade: string;
    confirmedDate: string;
  };
}

export interface ProvisionalEvaluationDisplayProps {
  data: ProvisionalEvaluationData;
  showLastYear?: boolean;
}

export default function ProvisionalEvaluationDisplay({ 
  data, 
  showLastYear = true 
}: ProvisionalEvaluationDisplayProps) {
  
  // 評価フェーズの判定
  const getCurrentPhase = () => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    
    if (data.confirmed.technicalEvaluation) {
      return 'completed'; // 年度評価完了
    } else if (data.confirmed.annualContribution) {
      return 'technical_pending'; // 技術評価待ち
    } else if (data.confirmed.summerContribution) {
      return 'winter_pending'; // 冬季評価待ち
    } else {
      return 'summer_pending'; // 夏季評価待ち
    }
  };
  
  const currentPhase = getCurrentPhase();
  
  // 確信度に応じた色とラベル
  const getConfidenceStyle = (confidence: 'low' | 'medium' | 'high') => {
    switch (confidence) {
      case 'high':
        return { color: 'text-green-700', bg: 'bg-green-100', label: '高' };
      case 'medium':
        return { color: 'text-yellow-700', bg: 'bg-yellow-100', label: '中' };
      case 'low':
        return { color: 'text-red-700', bg: 'bg-red-100', label: '低' };
    }
  };
  
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            {data.currentYear}年度 人事評価
          </CardTitle>
          <CardDescription>
            {data.staffName}の評価状況・途中経過
          </CardDescription>
        </CardHeader>
      </Card>

      {/* 現在の評価進行状況 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            評価進行状況
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 進行状況バー */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>年間評価進捗</span>
                <span>
                  {currentPhase === 'completed' && '100%'}
                  {currentPhase === 'technical_pending' && '66%'}
                  {currentPhase === 'winter_pending' && '33%'}
                  {currentPhase === 'summer_pending' && '0%'}
                </span>
              </div>
              <Progress 
                value={
                  currentPhase === 'completed' ? 100 :
                  currentPhase === 'technical_pending' ? 66 :
                  currentPhase === 'winter_pending' ? 33 : 0
                }
                className="h-3"
              />
            </div>
            
            {/* 各フェーズの状況 */}
            <div className="grid grid-cols-3 gap-3">
              <div className={`p-3 rounded-lg ${data.confirmed.summerContribution ? 'bg-green-100' : 'bg-gray-100'}`}>
                <div className="flex items-center gap-2">
                  {data.confirmed.summerContribution ? 
                    <CheckCircle2 className="h-4 w-4 text-green-600" /> :
                    <Clock className="h-4 w-4 text-gray-400" />
                  }
                  <span className="text-sm font-medium">6月夏季評価</span>
                </div>
                {data.confirmed.summerContribution && (
                  <div className="text-xs text-gray-600 mt-1">
                    {data.confirmed.summerContribution.total.toFixed(1)}/25点
                  </div>
                )}
              </div>
              
              <div className={`p-3 rounded-lg ${data.confirmed.annualContribution ? 'bg-green-100' : 'bg-gray-100'}`}>
                <div className="flex items-center gap-2">
                  {data.confirmed.annualContribution ? 
                    <CheckCircle2 className="h-4 w-4 text-green-600" /> :
                    <Clock className="h-4 w-4 text-gray-400" />
                  }
                  <span className="text-sm font-medium">12月年間貢献</span>
                </div>
                {data.confirmed.annualContribution && (
                  <div className="text-xs text-gray-600 mt-1">
                    {data.confirmed.annualContribution.total.toFixed(1)}/50点
                  </div>
                )}
              </div>
              
              <div className={`p-3 rounded-lg ${data.confirmed.technicalEvaluation ? 'bg-green-100' : 'bg-gray-100'}`}>
                <div className="flex items-center gap-2">
                  {data.confirmed.technicalEvaluation ? 
                    <CheckCircle2 className="h-4 w-4 text-green-600" /> :
                    <Clock className="h-4 w-4 text-gray-400" />
                  }
                  <span className="text-sm font-medium">3月技術評価</span>
                </div>
                {data.confirmed.technicalEvaluation && (
                  <div className="text-xs text-gray-600 mt-1">
                    {data.confirmed.technicalEvaluation.total.toFixed(1)}/50点
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 確定済み評価詳細 */}
      {(data.confirmed.summerContribution || data.confirmed.annualContribution || data.confirmed.technicalEvaluation) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              確定済み評価
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* 夏季組織貢献度 */}
            {data.confirmed.summerContribution && (
              <div className="border rounded-lg p-4 bg-blue-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">夏季組織貢献度（6月確定）</h4>
                  <Badge variant="outline" className="bg-blue-100">
                    {data.confirmed.summerContribution.total.toFixed(1)}/25点
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">施設貢献: </span>
                    <span className="font-medium">
                      {data.confirmed.summerContribution.facilityPoints.toFixed(1)}/12.5点
                    </span>
                    <Badge size="sm" className="ml-2">
                      {data.confirmed.summerContribution.facilityGrade}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-600">法人貢献: </span>
                    <span className="font-medium">
                      {data.confirmed.summerContribution.corporatePoints.toFixed(1)}/12.5点
                    </span>
                    <Badge size="sm" className="ml-2">
                      {data.confirmed.summerContribution.corporateGrade}
                    </Badge>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  確定日: {data.confirmed.summerContribution.confirmedDate}
                </div>
              </div>
            )}

            {/* 年間組織貢献度 */}
            {data.confirmed.annualContribution && (
              <div className="border rounded-lg p-4 bg-green-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">年間組織貢献度（12月確定）</h4>
                  <Badge variant="outline" className="bg-green-100">
                    {data.confirmed.annualContribution.total.toFixed(1)}/50点
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">施設貢献年間: </span>
                    <span className="font-medium">
                      {data.confirmed.annualContribution.facilityPoints.toFixed(1)}/25点
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">法人貢献年間: </span>
                    <span className="font-medium">
                      {data.confirmed.annualContribution.corporatePoints.toFixed(1)}/25点
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  確定日: {data.confirmed.annualContribution.confirmedDate}
                </div>
              </div>
            )}

            {/* 技術評価 */}
            {data.confirmed.technicalEvaluation && (
              <div className="border rounded-lg p-4 bg-orange-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">技術評価（3月確定）</h4>
                  <Badge variant="outline" className="bg-orange-100">
                    {data.confirmed.technicalEvaluation.total.toFixed(1)}/50点
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">法人統一項目: </span>
                    <span className="font-medium">
                      {data.confirmed.technicalEvaluation.coreItemsScore.toFixed(1)}/30点
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">施設特化項目: </span>
                    <span className="font-medium">
                      {data.confirmed.technicalEvaluation.facilityItemsScore.toFixed(1)}/20点
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  確定日: {data.confirmed.technicalEvaluation.confirmedDate}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 暫定評価 */}
      {data.provisional && (currentPhase !== 'completed') && (
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              暫定評価・予測
            </CardTitle>
            <CardDescription>
              現在確定している評価に基づく推定値
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <Alert className="bg-purple-50 border-purple-200">
              <AlertCircle className="h-4 w-4 text-purple-600" />
              <AlertDescription>
                <strong>注意:</strong> 暫定評価は推定値であり、最終確定まで変動する可能性があります
              </AlertDescription>
            </Alert>

            {/* 推定総合スコア */}
            {data.provisional.estimatedTotalScore && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-3">推定総合スコア</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">現時点推定</span>
                    <span className="font-bold text-lg">
                      {data.provisional.estimatedTotalScore.current.toFixed(1)}/100点
                    </span>
                  </div>
                  <Progress 
                    value={data.provisional.estimatedTotalScore.current}
                    className="h-3"
                  />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>最低推定: {data.provisional.estimatedTotalScore.min.toFixed(1)}点</span>
                    <span>最高推定: {data.provisional.estimatedTotalScore.max.toFixed(1)}点</span>
                  </div>
                </div>
              </div>
            )}

            {/* 暫定順位 */}
            <div className="grid grid-cols-2 gap-4">
              {data.provisional.facilityRanking && (
                <div className="border rounded-lg p-3">
                  <div className="text-sm font-medium mb-1">施設内暫定順位</div>
                  <div className="flex items-center gap-2">
                    <Badge className={getConfidenceStyle(data.provisional.facilityRanking.confidence).bg}>
                      {data.provisional.facilityRanking.currentRank}
                    </Badge>
                    <span className={`text-xs ${getConfidenceStyle(data.provisional.facilityRanking.confidence).color}`}>
                      信頼度: {getConfidenceStyle(data.provisional.facilityRanking.confidence).label}
                    </span>
                  </div>
                </div>
              )}

              {data.provisional.corporateRanking && (
                <div className="border rounded-lg p-3">
                  <div className="text-sm font-medium mb-1">法人内暫定順位</div>
                  <div className="flex items-center gap-2">
                    <Badge className={getConfidenceStyle(data.provisional.corporateRanking.confidence).bg}>
                      {data.provisional.corporateRanking.currentRank}
                    </Badge>
                    <span className={`text-xs ${getConfidenceStyle(data.provisional.corporateRanking.confidence).color}`}>
                      信頼度: {getConfidenceStyle(data.provisional.corporateRanking.confidence).label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 暫定総合評価 */}
            {data.provisional.estimatedGrade && (
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">暫定総合評価</div>
                <div className="flex items-center justify-center gap-3">
                  <Badge 
                    size="lg"
                    className={`text-lg px-4 py-2 ${getConfidenceStyle(data.provisional.estimatedGrade.confidence).bg}`}
                  >
                    {data.provisional.estimatedGrade.grade}
                  </Badge>
                  <span className={`text-sm ${getConfidenceStyle(data.provisional.estimatedGrade.confidence).color}`}>
                    信頼度: {getConfidenceStyle(data.provisional.estimatedGrade.confidence).label}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 前年度参考データ */}
      {showLastYear && data.lastYear && (
        <Card className="border-gray-200 bg-gray-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-gray-600" />
              {data.currentYear - 1}年度 確定評価（参考）
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">総合評価: {data.lastYear.finalGrade}</div>
                <div className="text-sm text-gray-600">
                  {data.lastYear.totalScore.toFixed(1)}/100点
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  確定日: {data.lastYear.confirmedDate}
                </div>
              </div>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {data.lastYear.finalGrade}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 次回評価予定 */}
      {currentPhase !== 'completed' && (
        <Alert className="bg-blue-50 border-blue-200">
          <Calendar className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <strong>次回評価予定:</strong>
            <br />
            {currentPhase === 'summer_pending' && '6月末までに夏季組織貢献度評価を実施予定'}
            {currentPhase === 'winter_pending' && '12月末までに冬季組織貢献度評価で年間50点確定予定'}
            {currentPhase === 'technical_pending' && '3月中旬までに技術評価50点を実施し、最終評価確定予定'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}