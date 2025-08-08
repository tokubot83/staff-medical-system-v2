'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  User,
  Save,
  AlertCircle,
  Target,
  BookOpen,
  Heart,
  Users,
  Shield,
  TrendingUp,
  Star,
  Award,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import EvaluationNavigation from '@/components/evaluation/EvaluationNavigation';
import DashboardButton from '@/components/DashboardButton';

interface SelfEvaluationScores {
  basicSkills: number;
  expertise: number;
  patientCare: number;
  teamwork: number;
  safety: number;
  problemSolving: number;
  growth: number;
  leadership: number;
}

export default function TechnicalSelfEvaluationPage() {
  const [evaluationYear, setEvaluationYear] = useState(2024);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [scores, setScores] = useState<SelfEvaluationScores>({
    basicSkills: 0,
    expertise: 0,
    patientCare: 0,
    teamwork: 0,
    safety: 0,
    problemSolving: 0,
    growth: 0,
    leadership: 0
  });

  const [comments, setComments] = useState({
    achievements: '',
    challenges: '',
    goals: '',
    requests: ''
  });

  const evaluationItems = [
    { 
      key: 'basicSkills' as keyof SelfEvaluationScores, 
      label: '基本技術', 
      icon: Target, 
      description: '職務遂行に必要な基本的な技術・スキル',
      examples: '医療機器の操作、基本的な処置技術、記録・文書作成など'
    },
    { 
      key: 'expertise' as keyof SelfEvaluationScores, 
      label: '専門知識', 
      icon: BookOpen, 
      description: '専門分野における知識の深さと応用力',
      examples: '疾患理解、薬剤知識、最新治療法の把握など'
    },
    { 
      key: 'patientCare' as keyof SelfEvaluationScores, 
      label: '患者対応', 
      icon: Heart, 
      description: '患者・家族への接遇、コミュニケーション',
      examples: '患者説明、傾聴姿勢、家族対応、クレーム対応など'
    },
    { 
      key: 'teamwork' as keyof SelfEvaluationScores, 
      label: 'チームワーク', 
      icon: Users, 
      description: '多職種連携、同僚との協調性',
      examples: '情報共有、引き継ぎ、協力姿勢、職種間連携など'
    },
    { 
      key: 'safety' as keyof SelfEvaluationScores, 
      label: '安全管理', 
      icon: Shield, 
      description: '医療安全、感染対策の実践',
      examples: 'インシデント防止、感染対策実施、リスク予測など'
    },
    { 
      key: 'problemSolving' as keyof SelfEvaluationScores, 
      label: '問題解決', 
      icon: TrendingUp, 
      description: '課題発見と改善への取り組み',
      examples: '業務改善提案、効率化、問題分析、解決策実行など'
    },
    { 
      key: 'growth' as keyof SelfEvaluationScores, 
      label: '成長意欲', 
      icon: Star, 
      description: '学習意欲、自己研鑽への姿勢',
      examples: '研修参加、資格取得、自主学習、知識更新など'
    },
    { 
      key: 'leadership' as keyof SelfEvaluationScores, 
      label: 'リーダーシップ', 
      icon: Award, 
      description: '後輩指導、チームリード能力',
      examples: '新人指導、プリセプター、リーダー業務、委員会活動など'
    }
  ];

  const calculateTotalScore = (): number => {
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    return (total / 40) * 50;
  };

  const getCompletionRate = (): number => {
    const filledItems = Object.values(scores).filter(score => score > 0).length;
    return (filledItems / 8) * 100;
  };

  const handleSave = async (isSubmit: boolean = false) => {
    setIsSaving(true);
    try {
      console.log('自己評価保存:', {
        year: evaluationYear,
        scores,
        totalScore: calculateTotalScore(),
        comments,
        isSubmit
      });
      
      if (isSubmit) {
        setIsSubmitted(true);
      }
      
      alert(isSubmit ? '自己評価を提出しました' : '一時保存しました');
    } catch (error) {
      console.error('Save failed:', error);
      alert('保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  const updateScore = (key: keyof SelfEvaluationScores, value: number) => {
    setScores(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-4xl">
        <Card>
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-4">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold">自己評価を提出しました</h2>
              <p className="text-gray-600">
                {evaluationYear}年度の自己評価が正常に提出されました。<br />
                上司評価が完了次第、結果をお知らせします。
              </p>
              <div className="pt-4 space-x-4">
                <Link href="/evaluation">
                  <Button variant="outline">評価管理へ戻る</Button>
                </Link>
                <Link href="/dashboard">
                  <Button>ダッシュボードへ</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <EvaluationNavigation />
      
      <div className="mb-6">
        <Link href="/evaluation/technical" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          技術評価フローへ戻る
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">自己評価入力</h1>
        <p className="text-gray-600">
          {evaluationYear}年度（{evaluationYear}年4月～{evaluationYear + 1}年3月）の技術面での自己評価を入力してください
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">入力完了率</p>
              <p className="text-3xl font-bold">{getCompletionRate().toFixed(0)}%</p>
              <p className="text-sm text-gray-600">8項目中 {Object.values(scores).filter(s => s > 0).length}項目</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">自己評価点</p>
              <p className="text-3xl font-bold">{calculateTotalScore().toFixed(1)}</p>
              <p className="text-sm text-gray-600">/ 50点（配点40%）</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">提出期限</p>
              <p className="text-lg font-semibold">2025年3月15日</p>
              <Badge variant="outline" className="mt-1">残り7日</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>自己評価項目</CardTitle>
          <CardDescription>
            各項目について、この1年間の自己の成果・達成度を5段階で評価してください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {evaluationItems.map((item) => {
              const Icon = item.icon;
              
              return (
                <div key={item.key} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Icon className="h-5 w-5 text-gray-600 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.label}</h4>
                      <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                      <p className="text-xs text-gray-500">例：{item.examples}</p>
                    </div>
                    {scores[item.key] > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        評価: {scores[item.key]}
                      </Badge>
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-sm mb-2 block">自己評価</Label>
                    <RadioGroup
                      value={scores[item.key].toString()}
                      onValueChange={(value) => updateScore(item.key, parseInt(value))}
                      className="flex gap-4"
                    >
                      {[5, 4, 3, 2, 1].map((value) => (
                        <div key={value} className="flex flex-col items-center">
                          <RadioGroupItem value={value.toString()} id={`${item.key}-${value}`} />
                          <Label htmlFor={`${item.key}-${value}`} className="mt-1 cursor-pointer text-xs">
                            {value === 5 ? '卓越' :
                             value === 4 ? '優秀' :
                             value === 3 ? '良好' :
                             value === 2 ? '標準' : '要改善'}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>自己評価コメント</CardTitle>
          <CardDescription>
            1年間の振り返りと今後の目標を記入してください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>今年度の成果・達成したこと</Label>
              <Textarea
                placeholder="今年度特に成果を上げた業務、達成した目標、身につけたスキルなどを具体的に記入してください"
                value={comments.achievements}
                onChange={(e) => setComments(prev => ({ ...prev, achievements: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>
            
            <div>
              <Label>課題・改善が必要な点</Label>
              <Textarea
                placeholder="今年度の反省点、改善が必要と感じた点、スキル不足を感じた場面などを記入してください"
                value={comments.challenges}
                onChange={(e) => setComments(prev => ({ ...prev, challenges: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>
            
            <div>
              <Label>次年度の目標・取り組みたいこと</Label>
              <Textarea
                placeholder="次年度に挑戦したいこと、身につけたいスキル、改善したい点などを記入してください"
                value={comments.goals}
                onChange={(e) => setComments(prev => ({ ...prev, goals: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>
            
            <div>
              <Label>組織への要望・相談事項（任意）</Label>
              <Textarea
                placeholder="研修希望、環境改善要望、キャリア相談など、組織に伝えたいことがあれば記入してください"
                value={comments.requests}
                onChange={(e) => setComments(prev => ({ ...prev, requests: e.target.value }))}
                className="min-h-[80px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>自己評価の入力について</AlertTitle>
        <AlertDescription className="mt-2 space-y-1">
          <p>• 自己評価は技術評価全体の40%の配点となります</p>
          <p>• 提出後は修正できませんので、内容をよく確認してから提出してください</p>
          <p>• 一時保存機能を使用して、後から編集することも可能です</p>
          <p>• コメント欄は上司との面談時の参考資料となります</p>
        </AlertDescription>
      </Alert>

      <div className="flex justify-between">
        <Button 
          variant="outline"
          onClick={() => handleSave(false)}
          disabled={isSaving}
        >
          一時保存
        </Button>
        
        <div className="space-x-4">
          <Link href="/evaluation/technical">
            <Button variant="outline">
              キャンセル
            </Button>
          </Link>
          <Button 
            onClick={() => {
              if (getCompletionRate() < 100) {
                alert('すべての評価項目を入力してください');
                return;
              }
              if (window.confirm('自己評価を提出します。提出後は修正できません。よろしいですか？')) {
                handleSave(true);
              }
            }}
            disabled={isSaving || getCompletionRate() < 100}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            提出する
          </Button>
        </div>
      </div>
      
      <DashboardButton />
    </div>
  );
}