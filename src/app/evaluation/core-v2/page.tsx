'use client';

import React, { useState } from 'react';
import CoreEvaluationFormV2 from '@/components/evaluation/CoreEvaluationFormV2';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
  Calculator, 
  FileCheck, 
  Users, 
  User,
  TrendingUp,
  Award
} from 'lucide-react';
import { calculateCoreEvaluation } from '@/data/evaluationMasterDataV2';

export default function CoreEvaluationV2Page() {
  const [superiorData, setSuperiorData] = useState<any>(null);
  const [selfData, setSelfData] = useState<any>(null);
  const [finalResult, setFinalResult] = useState<any>(null);

  const handleSuperiorSubmit = (data: any) => {
    setSuperiorData(data);
    console.log('上司評価データ:', data);
    
    // 両方のデータが揃ったら統合計算
    if (selfData) {
      calculateFinalScore(data, selfData);
    }
  };

  const handleSelfSubmit = (data: any) => {
    setSelfData(data);
    console.log('本人評価データ:', data);
    
    // 両方のデータが揃ったら統合計算
    if (superiorData) {
      calculateFinalScore(superiorData, data);
    }
  };

  const calculateFinalScore = (superior: any, self: any) => {
    const result = calculateCoreEvaluation(superior.scores, self.scores);
    setFinalResult(result);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* ヘッダー */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-2">
            <Award className="w-8 h-8" />
            法人統一項目評価システム V2
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            パターン2（項目別差別化型）による評価 - 3大項目構造と法定研修の統合
          </p>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              <strong>新評価構造の特徴：</strong>
              <ul className="mt-2 space-y-1">
                <li>• C01 専門技術・スキル（記録・報告を含む）：上司重視（7:3）</li>
                <li>• C02 対人関係・ケア（権利擁護を含む）：均等配分（5:5）</li>
                <li>• C03 安全・品質管理（全法定研修を網羅）：上司重視（8:2）</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* 評価入力タブ */}
      <Tabs defaultValue="superior" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="superior" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            上司評価
            {superiorData && <FileCheck className="w-4 h-4 ml-2 text-green-600" />}
          </TabsTrigger>
          <TabsTrigger value="self" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            本人評価
            {selfData && <FileCheck className="w-4 h-4 ml-2 text-green-600" />}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="superior">
          <CoreEvaluationFormV2 
            evaluatorType="superior"
            employeeName="評価対象職員"
            onSubmit={handleSuperiorSubmit}
          />
        </TabsContent>

        <TabsContent value="self">
          <CoreEvaluationFormV2 
            evaluatorType="self"
            employeeName="評価対象職員"
            onSubmit={handleSelfSubmit}
          />
        </TabsContent>
      </Tabs>

      {/* 統合結果 */}
      {finalResult && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-6 h-6" />
              統合評価結果
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(finalResult.categoryScores).map(([categoryId, scores]: [string, any]) => (
                <Card key={categoryId}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {categoryId === 'C01' && '専門技術・スキル'}
                      {categoryId === 'C02' && '対人関係・ケア'}
                      {categoryId === 'C03' && '安全・品質管理'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>上司評価：</span>
                        <span className="font-medium">{scores.superior}点</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>本人評価：</span>
                        <span className="font-medium">{scores.self}点</span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between">
                          <span className="font-medium">小計：</span>
                          <span className="font-bold text-lg">{scores.total}点</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex items-center justify-center pt-4 border-t">
              <div className="text-center">
                <div className="text-muted-foreground">法人統一項目 合計点</div>
                <div className="text-4xl font-bold text-primary mt-2">
                  {finalResult.totalScore} / 30点
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  達成率: {Math.round((finalResult.totalScore / 30) * 100)}%
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <Button variant="outline" onClick={() => window.print()}>
                評価シートを印刷
              </Button>
              <Button>
                <TrendingUp className="w-4 h-4 mr-2" />
                詳細分析を表示
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}