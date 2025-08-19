/**
 * 評価シート選択コンポーネント
 * 職員の属性に基づいて最適な評価シートを自動選択・表示
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User, Building, Target, Users, Calculator, CheckCircle2,
  AlertTriangle, Lightbulb, FileCheck, BarChart3, Clock, Zap
} from 'lucide-react';

// 型定義のインポート
import { 
  EvaluationItem, 
  corporateEvaluationItems, 
  facilitySpecificItems,
  experienceLevels,
  roles,
  facilityTypes
} from '@/data/evaluationItemBank';

interface StaffProfile {
  id: string;
  name: string;
  department: string;
  jobCategory: string;
  facilityType: string;
  experienceYears: number;
  experienceLevel: string;
  experienceLabel: string;
}

interface EvaluationSheetSelectorProps {
  staff: StaffProfile;
  onEvaluationSubmit: (evaluationData: EvaluationResult) => void;
  mode?: 'input' | 'review' | 'view';
}

interface EvaluationResult {
  staffId: string;
  corporateEvaluation: {
    items: { itemId: string; score: number; comment?: string }[];
    total: number;
  };
  facilityEvaluation: {
    items: { itemId: string; score: number; comment?: string }[];
    total: number;
  };
  technicalTotal: number;
  overallComment?: string;
  submittedAt: Date;
}

interface EvaluationScore {
  [itemId: string]: {
    score: number;
    comment?: string;
  };
}

export default function EvaluationSheetSelector({ 
  staff, 
  onEvaluationSubmit, 
  mode = 'input' 
}: EvaluationSheetSelectorProps) {
  const [evaluationScores, setEvaluationScores] = useState<EvaluationScore>({});
  const [overallComment, setOverallComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 職員属性に基づく適用項目の選択
  const getApplicableCorporateItems = (): EvaluationItem[] => {
    return corporateEvaluationItems.filter(item => {
      // 全職種対象 or 該当職種
      const roleMatch = item.targetRoles.includes('all') || 
                       item.targetRoles.includes(mapJobCategoryToRole(staff.jobCategory));
      
      // 経験レベルマッチ
      const levelMatch = item.targetLevels.includes(staff.experienceLevel);
      
      return roleMatch && levelMatch;
    });
  };

  const getApplicableFacilityItems = (): EvaluationItem[] => {
    return facilitySpecificItems.filter(item => {
      // 職種マッチ
      const roleMatch = item.targetRoles.includes(mapJobCategoryToRole(staff.jobCategory));
      
      // 経験レベルマッチ  
      const levelMatch = item.targetLevels.includes(staff.experienceLevel);
      
      // 施設種別マッチ（項目IDから施設種別を判定）
      const facilityMatch = item.id.toLowerCase().includes(staff.facilityType.toLowerCase()) ||
                           item.targetRoles.includes('all');
      
      return roleMatch && levelMatch && facilityMatch;
    });
  };

  // 職種マッピング
  const mapJobCategoryToRole = (jobCategory: string): string => {
    const mapping: Record<string, string> = {
      '看護師': 'nurse',
      '准看護師': 'assistantNurse', 
      '看護補助者': 'nursingAide',
      '介護職': 'careWorker',
      'リハビリ職': 'therapist',
      '医師': 'doctor',
      '薬剤師': 'pharmacist',
      '栄養士': 'nutritionist',
      '事務職': 'clerk'
    };
    return mapping[jobCategory] || 'nurse';
  };

  const corporateItems = getApplicableCorporateItems();
  const facilityItems = getApplicableFacilityItems();

  // スコア計算
  const calculateTotals = () => {
    const corporateTotal = corporateItems.reduce((sum, item) => {
      const score = evaluationScores[item.id]?.score || 0;
      return sum + (score / 5) * item.points; // 5段階評価を配点に換算
    }, 0);

    const facilityTotal = facilityItems.reduce((sum, item) => {
      const score = evaluationScores[item.id]?.score || 0;
      return sum + (score / 5) * item.points;
    }, 0);

    const technicalTotal = corporateTotal + facilityTotal;

    return {
      corporateTotal: Math.round(corporateTotal * 10) / 10,
      facilityTotal: Math.round(facilityTotal * 10) / 10,
      technicalTotal: Math.round(technicalTotal * 10) / 10
    };
  };

  const { corporateTotal, facilityTotal, technicalTotal } = calculateTotals();

  // スコア更新
  const updateScore = (itemId: string, score: number, comment?: string) => {
    setEvaluationScores(prev => ({
      ...prev,
      [itemId]: { score, comment }
    }));
  };

  // 評価提出
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const evaluationResult: EvaluationResult = {
        staffId: staff.id,
        corporateEvaluation: {
          items: corporateItems.map(item => ({
            itemId: item.id,
            score: evaluationScores[item.id]?.score || 0,
            comment: evaluationScores[item.id]?.comment
          })),
          total: corporateTotal
        },
        facilityEvaluation: {
          items: facilityItems.map(item => ({
            itemId: item.id,
            score: evaluationScores[item.id]?.score || 0,
            comment: evaluationScores[item.id]?.comment
          })),
          total: facilityTotal
        },
        technicalTotal,
        overallComment,
        submittedAt: new Date()
      };

      await onEvaluationSubmit(evaluationResult);
    } catch (error) {
      console.error('評価提出エラー:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // グレード判定
  const getGrade = (score: number): { grade: string; color: string; description: string } => {
    if (score >= 45) return { grade: 'S', color: 'bg-red-100 text-red-800', description: '卓越' };
    if (score >= 40) return { grade: 'A', color: 'bg-orange-100 text-orange-800', description: '優秀' };
    if (score >= 30) return { grade: 'B', color: 'bg-green-100 text-green-800', description: '良好' };
    if (score >= 20) return { grade: 'C', color: 'bg-blue-100 text-blue-800', description: '標準' };
    return { grade: 'D', color: 'bg-gray-100 text-gray-800', description: '要改善' };
  };

  const currentGrade = getGrade(technicalTotal);

  return (
    <div className="space-y-6">
      {/* 職員情報ヘッダー */}
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center gap-3">
            <User className="h-6 w-6 text-blue-600" />
            {staff.name} の技術評価
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">所属:</span>
                <Badge variant="outline">{staff.department}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">職種:</span>
                <Badge variant="outline">{staff.jobCategory}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">経験:</span>
                <Badge className="bg-purple-100 text-purple-800">{staff.experienceLabel}</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-800">{technicalTotal}</div>
              <div className="text-sm text-gray-600">/ 50点（技術評価）</div>
              <div className="mt-2">
                <Badge className={currentGrade.color}>
                  {currentGrade.grade}評価 - {currentGrade.description}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* スコアサマリー */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">法人統一項目</p>
                <p className="text-2xl font-bold text-blue-600">{corporateTotal}</p>
                <p className="text-xs text-gray-500">/ 30点</p>
              </div>
              <Building className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">施設特化項目</p>
                <p className="text-2xl font-bold text-green-600">{facilityTotal}</p>
                <p className="text-xs text-gray-500">/ 20点</p>
              </div>
              <Target className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 評価項目タブ */}
      <Tabs defaultValue="corporate" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="corporate">法人統一項目 ({corporateItems.length}項目)</TabsTrigger>
          <TabsTrigger value="facility">施設特化項目 ({facilityItems.length}項目)</TabsTrigger>
        </TabsList>

        {/* 法人統一項目タブ */}
        <TabsContent value="corporate" className="space-y-4">
          <Alert>
            <Building className="h-4 w-4" />
            <AlertDescription>
              法人全体で統一された評価項目です。法定研修の受講状況も考慮してください。
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            {corporateItems.map((item) => (
              <Card key={item.id} className="border-blue-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building className="h-5 w-5 text-blue-600" />
                        {item.name}
                        <Badge className="bg-blue-500">{item.points}点</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {((evaluationScores[item.id]?.score || 0) / 5 * item.points).toFixed(1)}点
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* 評価基準 */}
                    <div>
                      <h5 className="font-medium mb-2">評価基準:</h5>
                      <div className="space-y-1">
                        {item.evaluationCriteria.map((criteria, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            {criteria}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 評価入力 */}
                    {mode === 'input' && (
                      <div className="space-y-3">
                        <div>
                          <label className="font-medium text-sm mb-2 block">評価スコア (5段階評価)</label>
                          <div className="flex gap-2">
                            {[5, 4, 3, 2, 1].map((score) => (
                              <button
                                key={score}
                                onClick={() => updateScore(item.id, score)}
                                className={`px-4 py-2 rounded-md border text-sm font-medium transition-all
                                  ${evaluationScores[item.id]?.score === score 
                                    ? 'bg-blue-500 text-white border-blue-500' 
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                  }`}
                              >
                                {score}
                              </button>
                            ))}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            5:優秀 4:良好 3:標準 2:要改善 1:不十分
                          </div>
                        </div>

                        <div>
                          <label className="font-medium text-sm mb-2 block">コメント（任意）</label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            rows={2}
                            placeholder="特記事項があれば記入してください"
                            value={evaluationScores[item.id]?.comment || ''}
                            onChange={(e) => updateScore(
                              item.id, 
                              evaluationScores[item.id]?.score || 0, 
                              e.target.value
                            )}
                          />
                        </div>
                      </div>
                    )}

                    {/* 評価結果表示（レビューモード） */}
                    {mode !== 'input' && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">評価スコア:</span>
                          <Badge className="bg-blue-500">
                            {evaluationScores[item.id]?.score || 0}/5
                          </Badge>
                        </div>
                        {evaluationScores[item.id]?.comment && (
                          <div className="mt-2">
                            <span className="font-medium text-sm">コメント:</span>
                            <p className="text-sm text-gray-600 mt-1">
                              {evaluationScores[item.id]?.comment}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 施設特化項目タブ */}
        <TabsContent value="facility" className="space-y-4">
          <Alert>
            <Target className="h-4 w-4" />
            <AlertDescription>
              {staff.experienceLabel}・{staff.jobCategory}に特化した評価項目です。
              施設の特性を考慮した専門技術を評価してください。
            </AlertDescription>
          </Alert>

          {facilityItems.length === 0 ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                この職員の属性に該当する施設特化項目が見つかりません。
                評価項目バンクの設定を確認してください。
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {facilityItems.map((item) => (
                <Card key={item.id} className="border-green-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Target className="h-5 w-5 text-green-600" />
                          {item.name}
                          <Badge className="bg-green-500">{item.points}点</Badge>
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          {((evaluationScores[item.id]?.score || 0) / 5 * item.points).toFixed(1)}点
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* 評価基準 */}
                      <div>
                        <h5 className="font-medium mb-2">評価基準:</h5>
                        <div className="space-y-1">
                          {item.evaluationCriteria.map((criteria, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                              {criteria}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 評価入力 */}
                      {mode === 'input' && (
                        <div className="space-y-3">
                          <div>
                            <label className="font-medium text-sm mb-2 block">評価スコア (5段階評価)</label>
                            <div className="flex gap-2">
                              {[5, 4, 3, 2, 1].map((score) => (
                                <button
                                  key={score}
                                  onClick={() => updateScore(item.id, score)}
                                  className={`px-4 py-2 rounded-md border text-sm font-medium transition-all
                                    ${evaluationScores[item.id]?.score === score 
                                      ? 'bg-green-500 text-white border-green-500' 
                                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                  {score}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="font-medium text-sm mb-2 block">コメント（任意）</label>
                            <textarea
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                              rows={2}
                              placeholder="特記事項があれば記入してください"
                              value={evaluationScores[item.id]?.comment || ''}
                              onChange={(e) => updateScore(
                                item.id, 
                                evaluationScores[item.id]?.score || 0, 
                                e.target.value
                              )}
                            />
                          </div>
                        </div>
                      )}

                      {/* 評価結果表示 */}
                      {mode !== 'input' && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">評価スコア:</span>
                            <Badge className="bg-green-500">
                              {evaluationScores[item.id]?.score || 0}/5
                            </Badge>
                          </div>
                          {evaluationScores[item.id]?.comment && (
                            <div className="mt-2">
                              <span className="font-medium text-sm">コメント:</span>
                              <p className="text-sm text-gray-600 mt-1">
                                {evaluationScores[item.id]?.comment}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* 総合コメント */}
      {mode === 'input' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              総合評価コメント
            </CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={4}
              placeholder="年間を通じた総合的な評価コメントを記入してください"
              value={overallComment}
              onChange={(e) => setOverallComment(e.target.value)}
            />
          </CardContent>
        </Card>
      )}

      {/* 提出ボタン */}
      {mode === 'input' && (
        <div className="flex justify-end gap-4">
          <Button variant="outline" disabled={isSubmitting}>
            下書き保存
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || technicalTotal === 0}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            {isSubmitting ? (
              <>処理中...</>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                評価提出
              </>
            )}
          </Button>
        </div>
      )}

      {/* 評価ガイダンス */}
      <Alert>
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <strong>評価のポイント:</strong> 
          技術評価（50点）は年間を通じた実績を総合的に評価してください。
          この後、組織貢献度評価（50点）と合わせて100点満点で最終評価が決定されます。
        </AlertDescription>
      </Alert>
    </div>
  );
}