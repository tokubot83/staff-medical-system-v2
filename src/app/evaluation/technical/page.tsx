'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar,
  User,
  Award,
  TrendingUp,
  Save,
  AlertCircle,
  CheckCircle2,
  Star,
  Target,
  Users,
  BookOpen,
  Shield,
  Heart
} from 'lucide-react';
import EvaluationNavigation from '@/components/evaluation/EvaluationNavigation';
import DashboardButton from '@/components/DashboardButton';

interface TechnicalScores {
  // 基本技術
  basicSkills: { superior: number; self: number };
  // 専門知識
  expertise: { superior: number; self: number };
  // 患者対応
  patientCare: { superior: number; self: number };
  // チームワーク
  teamwork: { superior: number; self: number };
  // 安全管理
  safety: { superior: number; self: number };
  // 問題解決
  problemSolving: { superior: number; self: number };
  // 成長意欲
  growth: { superior: number; self: number };
  // リーダーシップ
  leadership: { superior: number; self: number };
}

export default function TechnicalEvaluationPage() {
  const [selectedStaff, setSelectedStaff] = useState('');
  const [evaluationYear, setEvaluationYear] = useState(2024);
  const [isSaving, setIsSaving] = useState(false);
  
  // 評価スコア（各項目5段階評価）
  const [scores, setScores] = useState<TechnicalScores>({
    basicSkills: { superior: 0, self: 0 },
    expertise: { superior: 0, self: 0 },
    patientCare: { superior: 0, self: 0 },
    teamwork: { superior: 0, self: 0 },
    safety: { superior: 0, self: 0 },
    problemSolving: { superior: 0, self: 0 },
    growth: { superior: 0, self: 0 },
    leadership: { superior: 0, self: 0 }
  });

  // コメント
  const [comments, setComments] = useState({
    strengths: '',
    improvements: '',
    goals: '',
    overall: ''
  });

  // スコア計算（上司60% + 自己40%）
  const calculateWeightedScore = (superior: number, self: number): number => {
    return superior * 0.6 + self * 0.4;
  };

  // 総合技術スコア計算（50点満点）
  const calculateTotalScore = (): number => {
    const items = Object.values(scores);
    const totalWeighted = items.reduce((sum, item) => {
      return sum + calculateWeightedScore(item.superior, item.self);
    }, 0);
    
    // 8項目×5点満点 = 40点を50点満点に換算
    return (totalWeighted / 40) * 50;
  };

  const totalScore = calculateTotalScore();

  // グレード判定
  const getGrade = (score: number): string => {
    if (score >= 45) return 'S';
    if (score >= 40) return 'A';
    if (score >= 30) return 'B';
    if (score >= 20) return 'C';
    return 'D';
  };

  // スコア更新
  const updateScore = (
    category: keyof TechnicalScores,
    evaluator: 'superior' | 'self',
    value: number
  ) => {
    setScores(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [evaluator]: value
      }
    }));
  };

  // 保存処理
  const handleSave = async () => {
    if (!selectedStaff) {
      alert('職員を選択してください');
      return;
    }
    
    setIsSaving(true);
    try {
      // TODO: API呼び出し
      console.log('技術評価保存:', {
        staffId: selectedStaff,
        year: evaluationYear,
        scores,
        totalScore,
        grade: getGrade(totalScore),
        comments
      });
      alert('保存しました');
    } catch (error) {
      console.error('Save failed:', error);
      alert('保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  const evaluationItems = [
    { key: 'basicSkills' as keyof TechnicalScores, label: '基本技術', icon: Target, description: '職務遂行に必要な基本的な技術・スキル' },
    { key: 'expertise' as keyof TechnicalScores, label: '専門知識', icon: BookOpen, description: '専門分野における知識の深さと応用力' },
    { key: 'patientCare' as keyof TechnicalScores, label: '患者対応', icon: Heart, description: '患者・家族への接遇、コミュニケーション' },
    { key: 'teamwork' as keyof TechnicalScores, label: 'チームワーク', icon: Users, description: '多職種連携、同僚との協調性' },
    { key: 'safety' as keyof TechnicalScores, label: '安全管理', icon: Shield, description: '医療安全、感染対策の実践' },
    { key: 'problemSolving' as keyof TechnicalScores, label: '問題解決', icon: TrendingUp, description: '課題発見と改善への取り組み' },
    { key: 'growth' as keyof TechnicalScores, label: '成長意欲', icon: Star, description: '学習意欲、自己研鑽への姿勢' },
    { key: 'leadership' as keyof TechnicalScores, label: 'リーダーシップ', icon: Award, description: '後輩指導、チームリード能力' }
  ];

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <EvaluationNavigation />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">技術評価（年間評価）</h1>
        <p className="text-gray-600">3月実施 - 4月～3月の年間技術評価</p>
      </div>

      {/* 評価対象選択 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            評価対象職員
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>評価年度</Label>
              <select 
                className="w-full px-3 py-2 border rounded-md"
                value={evaluationYear}
                onChange={(e) => setEvaluationYear(parseInt(e.target.value))}
              >
                <option value={2024}>2024年度（2024年4月～2025年3月）</option>
                <option value={2023}>2023年度（2023年4月～2024年3月）</option>
              </select>
            </div>
            
            <div>
              <Label>対象職員</Label>
              <Input 
                placeholder="職員番号または氏名"
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
              />
            </div>
            
            <div>
              <Label>評価実施日</Label>
              <Input 
                type="date"
                defaultValue="2025-03-15"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* スコアサマリー */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">技術評価スコア</p>
              <p className="text-3xl font-bold">{totalScore.toFixed(1)}</p>
              <p className="text-sm text-gray-600">/ 50点</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">評価グレード</p>
              <Badge className="text-2xl px-4 py-2" variant={
                getGrade(totalScore) === 'S' ? 'destructive' :
                getGrade(totalScore) === 'A' ? 'default' :
                getGrade(totalScore) === 'B' ? 'secondary' :
                'outline'
              }>
                {getGrade(totalScore)}
              </Badge>
              <p className="text-sm text-gray-600 mt-2">
                {getGrade(totalScore) === 'S' ? '卓越' :
                 getGrade(totalScore) === 'A' ? '優秀' :
                 getGrade(totalScore) === 'B' ? '良好' :
                 getGrade(totalScore) === 'C' ? '標準' : '要改善'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">評価配分</p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>上司評価</span>
                  <span className="font-semibold">60%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>自己評価</span>
                  <span className="font-semibold">40%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 評価入力 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>技術評価項目</CardTitle>
          <CardDescription>
            各項目を5段階で評価してください（5:卓越 4:優秀 3:良好 2:標準 1:要改善）
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {evaluationItems.map((item) => {
              const Icon = item.icon;
              const weighted = calculateWeightedScore(
                scores[item.key].superior,
                scores[item.key].self
              );
              
              return (
                <div key={item.key} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Icon className="h-5 w-5 text-gray-600 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.label}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{weighted.toFixed(1)}</p>
                      <p className="text-xs text-gray-600">加重平均</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">上司評価（60%）</Label>
                      <RadioGroup
                        value={scores[item.key].superior.toString()}
                        onValueChange={(value) => updateScore(item.key, 'superior', parseInt(value))}
                        className="flex gap-3 mt-2"
                      >
                        {[5, 4, 3, 2, 1].map((value) => (
                          <div key={value} className="flex items-center">
                            <RadioGroupItem value={value.toString()} id={`${item.key}-superior-${value}`} />
                            <Label htmlFor={`${item.key}-superior-${value}`} className="ml-1 cursor-pointer">
                              {value}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <Label className="text-sm">自己評価（40%）</Label>
                      <RadioGroup
                        value={scores[item.key].self.toString()}
                        onValueChange={(value) => updateScore(item.key, 'self', parseInt(value))}
                        className="flex gap-3 mt-2"
                      >
                        {[5, 4, 3, 2, 1].map((value) => (
                          <div key={value} className="flex items-center">
                            <RadioGroupItem value={value.toString()} id={`${item.key}-self-${value}`} />
                            <Label htmlFor={`${item.key}-self-${value}`} className="ml-1 cursor-pointer">
                              {value}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* コメント入力 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>総合評価コメント</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>強み・優れている点</Label>
              <Textarea
                placeholder="技術面での強みや、特に優れている点を記入"
                value={comments.strengths}
                onChange={(e) => setComments(prev => ({ ...prev, strengths: e.target.value }))}
                className="min-h-[80px]"
              />
            </div>
            
            <div>
              <Label>改善が必要な点</Label>
              <Textarea
                placeholder="今後改善が必要な技術面での課題を記入"
                value={comments.improvements}
                onChange={(e) => setComments(prev => ({ ...prev, improvements: e.target.value }))}
                className="min-h-[80px]"
              />
            </div>
            
            <div>
              <Label>次年度の目標</Label>
              <Textarea
                placeholder="次年度に向けた技術面での目標を記入"
                value={comments.goals}
                onChange={(e) => setComments(prev => ({ ...prev, goals: e.target.value }))}
                className="min-h-[80px]"
              />
            </div>
            
            <div>
              <Label>総合所見</Label>
              <Textarea
                placeholder="年間を通じた総合的な評価所見を記入"
                value={comments.overall}
                onChange={(e) => setComments(prev => ({ ...prev, overall: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 保存ボタン */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">
          キャンセル
        </Button>
        <Button 
          onClick={handleSave}
          disabled={isSaving || !selectedStaff}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <>処理中...</>
          ) : (
            <>
              <Save className="h-4 w-4" />
              保存
            </>
          )}
        </Button>
      </div>

      {/* 評価基準の説明 */}
      <Alert className="mt-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>技術評価の実施について</AlertTitle>
        <AlertDescription className="mt-2 space-y-1">
          <p>• 年1回、3月に実施（4月～3月の年間評価）</p>
          <p>• 上司評価60%、自己評価40%の配分で加重平均を算出</p>
          <p>• 8項目×5点満点の評価を50点満点に換算</p>
          <p>• この技術評価（50点）と組織貢献度評価（50点）を合わせて100点満点で総合評価</p>
        </AlertDescription>
      </Alert>
      
      <DashboardButton />
    </div>
  );
}