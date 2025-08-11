'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Users, 
  Shield,
  BookOpen,
  Calculator,
  Info
} from 'lucide-react';
import { 
  coreEvaluationCategories, 
  evaluationGrades,
  calculateCoreEvaluation,
  checkTrainingCompletion,
  trainingMaster
} from '@/data/evaluationMasterDataV2';

interface Props {
  evaluatorType: 'superior' | 'self';
  employeeId?: string;
  employeeName?: string;
  onSubmit?: (data: any) => void;
}

export default function CoreEvaluationFormV2({ 
  evaluatorType, 
  employeeId = '001',
  employeeName = '評価対象者',
  onSubmit 
}: Props) {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [completedTrainings, setCompletedTrainings] = useState<string[]>([
    'TR_BASIC_001', 'TR_SAFETY_001', 'TR_INFECTION_001', 'TR_ABUSE_001'
  ]);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('C01');

  // 評価点数を計算
  useEffect(() => {
    if (Object.keys(scores).length === 3) {
      const superiorScores = evaluatorType === 'superior' ? scores : {};
      const selfScores = evaluatorType === 'self' ? scores : {};
      const result = calculateCoreEvaluation(superiorScores, selfScores);
      setEvaluationResult(result);
    }
  }, [scores, evaluatorType]);

  const handleScoreChange = (categoryId: string, grade: string) => {
    const gradeValue = evaluationGrades[grade as keyof typeof evaluationGrades].value;
    setScores(prev => ({
      ...prev,
      [categoryId]: gradeValue
    }));
  };

  const handleCommentChange = (categoryId: string, comment: string) => {
    setComments(prev => ({
      ...prev,
      [categoryId]: comment
    }));
  };

  const getScoreDisplay = (categoryId: string) => {
    const category = coreEvaluationCategories.find(c => c.id === categoryId);
    if (!category || !scores[categoryId]) return { superior: 0, self: 0 };

    const score = scores[categoryId];
    if (evaluatorType === 'superior') {
      return { 
        superior: Math.round(score * category.superiorScore * 10) / 10,
        self: 0 
      };
    } else {
      return { 
        superior: 0,
        self: Math.round(score * category.selfScore * 10) / 10
      };
    }
  };

  const renderCategoryTab = (category: typeof coreEvaluationCategories[0]) => {
    const scoreDisplay = getScoreDisplay(category.id);
    const currentScore = scores[category.id];
    const currentGrade = Object.entries(evaluationGrades).find(
      ([_, grade]) => grade.value === currentScore
    )?.[0] || '';

    return (
      <TabsContent key={category.id} value={category.id} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{category.name}</span>
              <div className="flex items-center gap-4">
                <Badge variant="outline">
                  配点: {evaluatorType === 'superior' ? category.superiorScore : category.selfScore}点
                </Badge>
                {currentScore && (
                  <Badge variant="default">
                    現在: {evaluatorType === 'superior' ? scoreDisplay.superior : scoreDisplay.self}点
                  </Badge>
                )}
              </div>
            </CardTitle>
            <p className="text-sm text-muted-foreground">{category.description}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* サブカテゴリーと評価基準 */}
            {category.subcategories.map((sub) => (
              <div key={sub.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{sub.name}</h4>
                  <Badge variant="secondary">{sub.points}点</Badge>
                </div>
                
                {/* 必須研修の表示 */}
                {sub.requiredTrainings.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {sub.requiredTrainings.map(trainingId => {
                      const training = trainingMaster[trainingId as keyof typeof trainingMaster];
                      const isCompleted = completedTrainings.includes(trainingId);
                      return (
                        <Badge 
                          key={trainingId}
                          variant={isCompleted ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {isCompleted ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                          {training?.name}
                          {training?.legal && " (法定)"}
                        </Badge>
                      );
                    })}
                  </div>
                )}

                {/* 評価基準 */}
                <ul className="text-sm space-y-1 ml-4">
                  {sub.evaluationCriteria.map((criteria, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-muted-foreground mr-2">•</span>
                      <span>{criteria}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* 評価グレード選択 */}
            <div className="space-y-3 pt-4 border-t">
              <Label>評価グレード</Label>
              <RadioGroup value={currentGrade} onValueChange={(value) => handleScoreChange(category.id, value)}>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {Object.entries(evaluationGrades).map(([grade, info]) => (
                    <div key={grade} className="flex items-start space-x-2">
                      <RadioGroupItem value={grade} id={`${category.id}-${grade}`} />
                      <Label htmlFor={`${category.id}-${grade}`} className="cursor-pointer">
                        <div>
                          <div className="font-medium">{grade}: {info.label}</div>
                          <div className="text-xs text-muted-foreground">{info.description}</div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* コメント欄 */}
            <div className="space-y-2">
              <Label htmlFor={`comment-${category.id}`}>
                評価コメント（具体的な事例や改善点を記載）
              </Label>
              <Textarea
                id={`comment-${category.id}`}
                value={comments[category.id] || ''}
                onChange={(e) => handleCommentChange(category.id, e.target.value)}
                placeholder={`${category.name}に関する具体的な評価内容を記載してください`}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            法人統一項目評価（30点）- {evaluatorType === 'superior' ? '上司評価' : '本人評価'}
          </CardTitle>
          <p className="text-muted-foreground">
            パターン2: 項目別差別化型評価方式
          </p>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>評価配分</AlertTitle>
            <AlertDescription>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div>
                  <strong>C01 専門技術：</strong>
                  上司7点・本人3点
                </div>
                <div>
                  <strong>C02 対人関係：</strong>
                  上司5点・本人5点
                </div>
                <div>
                  <strong>C03 安全管理：</strong>
                  上司8点・本人2点
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* 評価入力フォーム */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="C01" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                専門技術・スキル
              </TabsTrigger>
              <TabsTrigger value="C02" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                対人関係・ケア
              </TabsTrigger>
              <TabsTrigger value="C03" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                安全・品質管理
              </TabsTrigger>
            </TabsList>

            {coreEvaluationCategories.map(category => renderCategoryTab(category))}
          </Tabs>
        </CardContent>
      </Card>

      {/* 評価サマリー */}
      {Object.keys(scores).length === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>評価サマリー</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {coreEvaluationCategories.map(category => {
                const scoreDisplay = getScoreDisplay(category.id);
                return (
                  <div key={category.id} className="space-y-2">
                    <div className="font-medium">{category.name}</div>
                    <Progress 
                      value={(scores[category.id] || 0) * 100} 
                      className="h-2"
                    />
                    <div className="text-sm text-muted-foreground">
                      {evaluatorType === 'superior' 
                        ? `上司評価: ${scoreDisplay.superior}/${category.superiorScore}点`
                        : `本人評価: ${scoreDisplay.self}/${category.selfScore}点`
                      }
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <Button 
                onClick={() => {
                  if (onSubmit) {
                    onSubmit({
                      evaluatorType,
                      scores,
                      comments,
                      completedTrainings
                    });
                  }
                }}
                size="lg"
              >
                <Calculator className="w-4 h-4 mr-2" />
                評価を確定
              </Button>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">現在の合計点</div>
                <div className="text-2xl font-bold">
                  {Object.values(scores).reduce((sum, score) => {
                    const category = coreEvaluationCategories.find(c => scores[c.id] === score);
                    if (!category) return sum;
                    return sum + score * (evaluatorType === 'superior' ? category.superiorScore : category.selfScore);
                  }, 0).toFixed(1)}点
                  / {evaluatorType === 'superior' ? '20点' : '10点'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}