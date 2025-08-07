'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User,
  Award,
  Building,
  Users,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface IntegratedEvaluationFormProps {
  staffId: string;
  staffName: string;
  facility: string;
  department: string;
  jobCategory: string;
  year: number;
  onSubmit: (evaluation: EvaluationData) => void;
  onCancel: () => void;
}

export interface EvaluationData {
  staffId: string;
  year: number;
  technical: {
    score: number;
    comments: string;
  };
  facilityContribution: {
    summer: number;
    winter: number;
    yearTotal: number;
    finalScore?: number;
  };
  corporateContribution: {
    summer: number;
    winter: number;
    yearTotal: number;
    finalScore?: number;
  };
  totalScore: number;
  facilityGrade?: string;
  corporateGrade?: string;
  finalGrade?: string;
  overallComments: string;
}

export function IntegratedEvaluationForm({
  staffId,
  staffName,
  facility,
  department,
  jobCategory,
  year,
  onSubmit,
  onCancel
}: IntegratedEvaluationFormProps) {
  const [evaluationData, setEvaluationData] = useState<EvaluationData>({
    staffId,
    year,
    technical: {
      score: 0,
      comments: ''
    },
    facilityContribution: {
      summer: 0,
      winter: 0,
      yearTotal: 0
    },
    corporateContribution: {
      summer: 0,
      winter: 0,
      yearTotal: 0
    },
    totalScore: 0,
    overallComments: ''
  });

  const [activeTab, setActiveTab] = useState('overview');

  // 技術評価スコアの取得（実際はAPIから取得）
  const fetchTechnicalScore = async () => {
    // TODO: API実装
    const mockScore = 42.5;
    setEvaluationData(prev => ({
      ...prev,
      technical: {
        ...prev.technical,
        score: mockScore
      }
    }));
  };

  // 組織貢献度スコアの取得（実際はAPIから取得）
  const fetchContributionScores = async () => {
    // TODO: API実装
    const mockData = {
      facility: { summer: 35, winter: 30, yearTotal: 65 },
      corporate: { summer: 25, winter: 20, yearTotal: 45 }
    };
    
    setEvaluationData(prev => ({
      ...prev,
      facilityContribution: mockData.facility,
      corporateContribution: mockData.corporate
    }));
  };

  // 総合スコア計算
  const calculateTotalScore = () => {
    const technical = evaluationData.technical.score;
    const facility = evaluationData.facilityContribution.finalScore || 0;
    const corporate = evaluationData.corporateContribution.finalScore || 0;
    return technical + facility + corporate;
  };

  // データ読み込み
  React.useEffect(() => {
    fetchTechnicalScore();
    fetchContributionScores();
  }, [staffId, year]);

  // 総合スコア更新
  React.useEffect(() => {
    setEvaluationData(prev => ({
      ...prev,
      totalScore: calculateTotalScore()
    }));
  }, [
    evaluationData.technical.score,
    evaluationData.facilityContribution.finalScore,
    evaluationData.corporateContribution.finalScore
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(evaluationData);
  };

  const getGradeColor = (grade?: string) => {
    const colors: Record<string, string> = {
      'S+': 'bg-red-500',
      'S': 'bg-orange-500',
      'A+': 'bg-yellow-500',
      'A': 'bg-green-500',
      'B': 'bg-blue-500',
      'C': 'bg-indigo-500',
      'D': 'bg-gray-500'
    };
    return colors[grade || ''] || 'bg-gray-400';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">統合評価フォーム</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {year}年度 年間評価
            </p>
          </div>
          <Badge variant="outline" className="text-lg px-3 py-1">
            {staffName}
          </Badge>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Building className="h-4 w-4" />
            {facility}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {department}
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {jobCategory}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">概要</TabsTrigger>
              <TabsTrigger value="technical">技術評価</TabsTrigger>
              <TabsTrigger value="contribution">組織貢献</TabsTrigger>
              <TabsTrigger value="summary">総合評価</TabsTrigger>
            </TabsList>

            {/* 概要タブ */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Award className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <p className="text-sm text-gray-600">技術評価</p>
                      <p className="text-2xl font-bold">
                        {evaluationData.technical.score.toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-600">/ 50点</p>
                      <Progress 
                        value={(evaluationData.technical.score / 50) * 100} 
                        className="mt-2 h-2" 
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Building className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <p className="text-sm text-gray-600">施設貢献</p>
                      <p className="text-2xl font-bold">
                        {evaluationData.facilityContribution.finalScore || '-'}
                      </p>
                      <p className="text-xs text-gray-600">/ 25点</p>
                      <Progress 
                        value={((evaluationData.facilityContribution.finalScore || 0) / 25) * 100} 
                        className="mt-2 h-2" 
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Users className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                      <p className="text-sm text-gray-600">法人貢献</p>
                      <p className="text-2xl font-bold">
                        {evaluationData.corporateContribution.finalScore || '-'}
                      </p>
                      <p className="text-xs text-gray-600">/ 25点</p>
                      <Progress 
                        value={((evaluationData.corporateContribution.finalScore || 0) / 25) * 100} 
                        className="mt-2 h-2" 
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">総合スコア</p>
                    <p className="text-4xl font-bold text-primary">
                      {evaluationData.totalScore.toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-600">/ 100点</p>
                    <Progress value={evaluationData.totalScore} className="mt-4 h-3" />
                  </div>
                </CardContent>
              </Card>

              {evaluationData.finalGrade && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>最終評価グレード：</strong>
                    <Badge className={`ml-2 ${getGradeColor(evaluationData.finalGrade)}`}>
                      {evaluationData.finalGrade}
                    </Badge>
                    <span className="ml-2">
                      （施設内: {evaluationData.facilityGrade} / 法人内: {evaluationData.corporateGrade}）
                    </span>
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {/* 技術評価タブ */}
            <TabsContent value="technical" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">技術評価詳細</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>評価スコア</Label>
                      <div className="text-3xl font-bold mt-2">
                        {evaluationData.technical.score.toFixed(1)} / 50点
                      </div>
                    </div>
                    
                    <div>
                      <Label>評価コメント</Label>
                      <Textarea
                        value={evaluationData.technical.comments}
                        onChange={(e) => setEvaluationData(prev => ({
                          ...prev,
                          technical: {
                            ...prev.technical,
                            comments: e.target.value
                          }
                        }))}
                        placeholder="技術評価に関するコメントを入力"
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 組織貢献タブ */}
            <TabsContent value="contribution" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      施設貢献度
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">8月賞与時</span>
                        <span className="font-semibold">{evaluationData.facilityContribution.summer}点</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">12月賞与時</span>
                        <span className="font-semibold">{evaluationData.facilityContribution.winter}点</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between">
                        <span className="font-semibold">年間合計</span>
                        <span className="font-bold text-lg">{evaluationData.facilityContribution.yearTotal}点</span>
                      </div>
                      {evaluationData.facilityContribution.finalScore !== undefined && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">相対評価配点</span>
                            <Badge variant="outline">
                              {evaluationData.facilityContribution.finalScore} / 25点
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      法人貢献度
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">8月賞与時</span>
                        <span className="font-semibold">{evaluationData.corporateContribution.summer}点</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">12月賞与時</span>
                        <span className="font-semibold">{evaluationData.corporateContribution.winter}点</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between">
                        <span className="font-semibold">年間合計</span>
                        <span className="font-bold text-lg">{evaluationData.corporateContribution.yearTotal}点</span>
                      </div>
                      {evaluationData.corporateContribution.finalScore !== undefined && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">相対評価配点</span>
                            <Badge variant="outline">
                              {evaluationData.corporateContribution.finalScore} / 25点
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 総合評価タブ */}
            <TabsContent value="summary" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">総合評価</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">施設内評価</p>
                        <Badge variant="outline" className="text-lg px-3 py-1">
                          {evaluationData.facilityGrade || '-'}
                        </Badge>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">法人内評価</p>
                        <Badge variant="outline" className="text-lg px-3 py-1">
                          {evaluationData.corporateGrade || '-'}
                        </Badge>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">最終グレード</p>
                        <Badge className={`text-lg px-3 py-1 ${getGradeColor(evaluationData.finalGrade)}`}>
                          {evaluationData.finalGrade || '-'}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <Label>総合所見</Label>
                      <Textarea
                        value={evaluationData.overallComments}
                        onChange={(e) => setEvaluationData(prev => ({
                          ...prev,
                          overallComments: e.target.value
                        }))}
                        placeholder="年間を通じた総合的な評価所見を入力"
                        className="min-h-[150px]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  この評価は確定後、4月の昇給・昇格・人事異動の判断材料として使用されます。
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              キャンセル
            </Button>
            <Button type="submit">
              評価を確定
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}