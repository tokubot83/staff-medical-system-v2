'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft,
  Sparkles,
  Brain,
  Zap,
  Eye,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  User,
  Star,
  Settings,
  PlayCircle,
  Loader2,
  Wand2,
  Target,
  TrendingUp,
  Clock,
  Award,
  FileText,
  Edit3,
  Send,
  Bot,
  Lightbulb,
  Activity,
  ChevronRight,
  Database
} from 'lucide-react';
import Link from 'next/link';

interface StaffProfile {
  id: string;
  name: string;
  department: string;
  jobCategory: string;
  experienceYears: number;
  experienceLevel: string;
  experienceLabel: string;
  facilityType: string;
  specializedTrainings: string[];
  recentPerformance: string[];
  careerGoals: string[];
  learningHistory: string[];
}

interface AIGeneratedQuestion {
  id: string;
  question: string;
  category: string;
  evaluator: 'superior' | 'self';
  points: number;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  reason: string;
  keywords: string[];
  trainingConnection?: string;
}

interface DynamicEvaluationSheet {
  staffId: string;
  generatedAt: Date;
  aiVersion: string;
  customizationLevel: 'standard' | 'personalized' | 'expert';
  technicalQuestions: AIGeneratedQuestion[];
  contributionQuestions: AIGeneratedQuestion[];
  totalQuestions: number;
  estimatedTime: number;
  personalizedInsights: string[];
}

export default function DynamicEvaluationPage() {
  const params = useParams();
  const router = useRouter();
  const staffId = params.id as string;

  // State定義
  const [staffProfile, setStaffProfile] = useState<StaffProfile | null>(null);
  const [evaluationSheet, setEvaluationSheet] = useState<DynamicEvaluationSheet | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [customizationLevel, setCustomizationLevel] = useState<'standard' | 'personalized' | 'expert'>('personalized');
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [additionalRequirements, setAdditionalRequirements] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);

  // モックスタッフデータ
  useEffect(() => {
    // 実際のAPIからスタッフデータを取得
    const mockStaffData: Record<string, StaffProfile> = {
      '3': {
        id: '3',
        name: '鈴木 美咲',
        department: 'ICU',
        jobCategory: '看護師',
        experienceYears: 8,
        experienceLevel: 'midlevel',
        experienceLabel: '中堅',
        facilityType: 'acute',
        specializedTrainings: ['感染対策', '医療安全', 'BLS', 'ACLS', 'ICU専門'],
        recentPerformance: ['重症患者管理優秀', 'チームリーダー経験', '新人指導実績'],
        careerGoals: ['病棟主任候補', 'ICU専門性向上', '指導力強化'],
        learningHistory: ['クリティカルケア研修2024', '感染管理認定2023', 'リーダーシップ研修2023']
      },
      '6': {
        id: '6',
        name: '中村 健太',
        department: '外科病棟',
        jobCategory: '看護師',
        experienceYears: 5,
        experienceLevel: 'midlevel',
        experienceLabel: '中堅',
        facilityType: 'acute',
        specializedTrainings: ['外科看護', '術前術後管理', '医療安全'],
        recentPerformance: ['手術室連携良好', '患者家族対応優秀'],
        careerGoals: ['手術看護認定', '外科エキスパート'],
        learningHistory: ['周術期看護研修2024', '外科看護学会参加2024']
      }
    };

    const staff = mockStaffData[staffId];
    if (staff) {
      setStaffProfile(staff);
    } else {
      // デフォルトプロファイル
      setStaffProfile({
        id: staffId,
        name: '職員名不明',
        department: '不明',
        jobCategory: '看護師',
        experienceYears: 3,
        experienceLevel: 'young',
        experienceLabel: '若手',
        facilityType: 'acute',
        specializedTrainings: [],
        recentPerformance: [],
        careerGoals: [],
        learningHistory: []
      });
    }
  }, [staffId]);

  const handleGenerateEvaluation = async () => {
    if (!staffProfile) return;

    setIsGenerating(true);
    setGenerationStep('プロファイル分析中...');

    // AIによる評価シート生成のシミュレーション
    const steps = [
      'プロファイル分析中...',
      '経験レベル評価中...',
      '研修履歴解析中...',
      '個別設問生成中...',
      '評価基準調整中...',
      '最適化処理中...',
      '評価シート完成！'
    ];

    for (let i = 0; i < steps.length; i++) {
      setGenerationStep(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 生成された評価シートのモックデータ
    const generatedSheet: DynamicEvaluationSheet = {
      staffId: staffProfile.id,
      generatedAt: new Date(),
      aiVersion: 'Claude-V3-2025',
      customizationLevel,
      technicalQuestions: generateTechnicalQuestions(staffProfile),
      contributionQuestions: generateContributionQuestions(staffProfile),
      totalQuestions: 0,
      estimatedTime: 0,
      personalizedInsights: generatePersonalizedInsights(staffProfile)
    };

    generatedSheet.totalQuestions = generatedSheet.technicalQuestions.length + generatedSheet.contributionQuestions.length;
    generatedSheet.estimatedTime = Math.ceil(generatedSheet.totalQuestions * 2.5); // 1問あたり2.5分

    setEvaluationSheet(generatedSheet);
    setIsGenerating(false);
    setShowPreview(true);
  };

  const generateTechnicalQuestions = (profile: StaffProfile): AIGeneratedQuestion[] => {
    const baseQuestions: Omit<AIGeneratedQuestion, 'id'>[] = [];

    // 経験レベル別の基本問題
    if (profile.experienceLevel === 'midlevel') {
      baseQuestions.push({
        question: `${profile.department}での${profile.experienceYears}年の経験を活かし、複雑な症例に対する看護判断を適切に行えているか？`,
        category: '専門判断力',
        evaluator: 'superior',
        points: 8,
        difficulty: 'intermediate',
        reason: '中堅看護師として期待される判断力を評価',
        keywords: ['複雑症例', '看護判断', '経験活用'],
        trainingConnection: profile.specializedTrainings[0]
      });

      baseQuestions.push({
        question: '後輩看護師への技術指導や相談対応を積極的に行っているか？',
        category: '指導・教育',
        evaluator: 'superior',
        points: 6,
        difficulty: 'intermediate',
        reason: 'リーダー候補としての指導力評価',
        keywords: ['後輩指導', '技術指導', 'リーダーシップ']
      });
    }

    // 部署特化問題
    if (profile.department === 'ICU') {
      baseQuestions.push({
        question: '重症患者の状態変化を早期に察知し、適切な対応を行えているか？',
        category: 'ICU専門技術',
        evaluator: 'superior',
        points: 10,
        difficulty: 'advanced',
        reason: 'ICU看護師の核心的能力',
        keywords: ['重症患者', '状態変化', '早期発見']
      });

      baseQuestions.push({
        question: '人工呼吸器管理や持続血液濾過などの高度医療機器を安全に操作できているか？',
        category: '高度医療技術',
        evaluator: 'superior',
        points: 8,
        difficulty: 'advanced',
        reason: 'ICU特有の高度技術習得度',
        keywords: ['人工呼吸器', '医療機器', '安全操作']
      });
    } else if (profile.department === '外科病棟') {
      baseQuestions.push({
        question: '術前・術後の患者管理を計画的に実施できているか？',
        category: '周術期看護',
        evaluator: 'superior',
        points: 8,
        difficulty: 'intermediate',
        reason: '外科病棟の中核的業務',
        keywords: ['術前管理', '術後管理', '周術期']
      });

      baseQuestions.push({
        question: '手術室との連携を円滑に行い、患者の安全確保に貢献しているか？',
        category: '多職種連携',
        evaluator: 'superior',
        points: 6,
        difficulty: 'intermediate',
        reason: '外科病棟特有の連携業務',
        keywords: ['手術室連携', '患者安全', 'チーム医療']
      });
    }

    // 研修履歴に基づく問題
    profile.specializedTrainings.forEach((training, index) => {
      if (training.includes('感染対策')) {
        baseQuestions.push({
          question: '感染対策研修で学んだ知識を実践に活かし、院内感染防止に貢献しているか？',
          category: '感染管理',
          evaluator: 'superior',
          points: 6,
          difficulty: 'basic',
          reason: '法定研修の実践的活用度',
          keywords: ['感染対策', '院内感染防止', '研修活用'],
          trainingConnection: training
        });
      }
      if (training.includes('医療安全')) {
        baseQuestions.push({
          question: '医療安全研修の内容を踏まえ、インシデント防止のための行動を実践しているか？',
          category: '安全管理',
          evaluator: 'self',
          points: 5,
          difficulty: 'basic',
          reason: '医療安全意識の実践度',
          keywords: ['医療安全', 'インシデント防止', '実践行動'],
          trainingConnection: training
        });
      }
    });

    // キャリア目標に基づく発展的問題
    if (profile.careerGoals.includes('主任候補') || profile.careerGoals.includes('リーダー')) {
      baseQuestions.push({
        question: '病棟の運営改善や業務効率化に向けた提案や取り組みを行っているか？',
        category: '管理・改善',
        evaluator: 'superior',
        points: 7,
        difficulty: 'advanced',
        reason: '管理職候補としての問題解決能力',
        keywords: ['運営改善', '業務効率化', '提案力']
      });
    }

    // 自己評価項目も追加
    baseQuestions.push({
      question: '自己の看護実践を振り返り、継続的な改善に取り組んでいるか？',
      category: '自己研鑽',
      evaluator: 'self',
      points: 4,
      difficulty: 'basic',
      reason: '継続的成長への意識評価',
      keywords: ['自己省察', '継続改善', 'プロフェッショナリズム']
    });

    return baseQuestions.map((q, index) => ({
      id: `TQ${Date.now()}_${index}`,
      ...q
    }));
  };

  const generateContributionQuestions = (profile: StaffProfile): AIGeneratedQuestion[] => {
    const baseQuestions: Omit<AIGeneratedQuestion, 'id'>[] = [
      {
        question: `${profile.department}の目標達成に向けて積極的に貢献しているか？`,
        category: '施設貢献',
        evaluator: 'superior',
        points: 8,
        difficulty: 'intermediate',
        reason: '部署貢献度の基本評価',
        keywords: ['部署目標', '積極的貢献', 'チーム成果']
      },
      {
        question: '委員会活動や院内プロジェクトに積極的に参加し、法人の発展に寄与しているか？',
        category: '法人貢献',
        evaluator: 'superior',
        points: 6,
        difficulty: 'intermediate',
        reason: '組織全体への貢献意識',
        keywords: ['委員会活動', 'プロジェクト参加', '法人発展']
      },
      {
        question: '同僚との協力関係を良好に維持し、職場の雰囲気向上に努めているか？',
        category: '職場環境',
        evaluator: 'superior',
        points: 5,
        difficulty: 'basic',
        reason: '職場協調性と環境改善',
        keywords: ['協力関係', '職場雰囲気', 'コミュニケーション']
      }
    ];

    // 経験レベル別の追加問題
    if (profile.experienceLevel === 'midlevel' || profile.experienceLevel === 'veteran') {
      baseQuestions.push({
        question: '新人や若手職員の成長支援を通じて、組織の人材育成に貢献しているか？',
        category: '人材育成',
        evaluator: 'superior',
        points: 7,
        difficulty: 'intermediate',
        reason: '中堅として期待される育成責任',
        keywords: ['人材育成', '新人指導', '組織貢献']
      });
    }

    return baseQuestions.map((q, index) => ({
      id: `CQ${Date.now()}_${index}`,
      ...q
    }));
  };

  const generatePersonalizedInsights = (profile: StaffProfile): string[] => {
    const insights = [];

    insights.push(`${profile.experienceYears}年の経験を持つ${profile.experienceLabel}として、専門性の深化と指導力の向上が期待されます。`);

    if (profile.department === 'ICU') {
      insights.push('ICUでの経験を活かし、高度な看護技術と判断力を評価項目に重点的に含めました。');
    }

    if (profile.specializedTrainings.length > 0) {
      insights.push(`${profile.specializedTrainings.join('、')}の研修履歴を考慮し、実践的な応用力を評価項目に反映しています。`);
    }

    if (profile.careerGoals.some(goal => goal.includes('主任') || goal.includes('リーダー'))) {
      insights.push('管理職候補として、リーダーシップと組織運営に関する評価項目を強化しました。');
    }

    insights.push('AI分析により、個人の成長段階と施設のニーズに最適化された評価項目を生成しています。');

    return insights;
  };

  const handleStartEvaluation = () => {
    if (evaluationSheet) {
      // 実際の評価入力画面にリダイレクト
      router.push(`/evaluation-execution?staff=${staffId}&dynamic=true`);
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    const styles = {
      basic: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      basic: '基本',
      intermediate: '中級',
      advanced: '上級'
    };
    
    return (
      <Badge className={styles[difficulty as keyof typeof styles]}>
        {labels[difficulty as keyof typeof labels]}
      </Badge>
    );
  };

  if (!staffProfile) {
    return (
      <div>
        <div className="container mx-auto p-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              職員情報が見つかりませんでした。
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container mx-auto p-6">
        {/* ヘッダー */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AI動的評価シート生成</h1>
              <p className="text-gray-600">個人特性に最適化された評価項目を自動生成</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Link href="/evaluation-execution">
                <ArrowLeft className="h-4 w-4 mr-2" />
                評価一覧に戻る
              </Link>
            </Button>
          </div>
        </div>

        {/* スタッフプロファイル */}
        <Card className="mb-6 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6 text-blue-600" />
              評価対象者プロファイル
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-2xl font-bold text-blue-900">{staffProfile.name}</h3>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{staffProfile.department}</Badge>
                      <Badge variant="outline">{staffProfile.jobCategory}</Badge>
                      <Badge className="bg-purple-100 text-purple-800">{staffProfile.experienceLabel}</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-gray-600">経験年数</Label>
                      <div className="font-semibold">{staffProfile.experienceYears}年</div>
                    </div>
                    <div>
                      <Label className="text-gray-600">施設タイプ</Label>
                      <div className="font-semibold">
                        {staffProfile.facilityType === 'acute' ? '急性期' : '慢性期'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-gray-600">専門研修履歴</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {staffProfile.specializedTrainings.map((training, index) => (
                        <Badge key={index} className="bg-green-100 text-green-800 text-xs">
                          {training}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-600">キャリア目標</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {staffProfile.careerGoals.map((goal, index) => (
                        <Badge key={index} className="bg-orange-100 text-orange-800 text-xs">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {!showPreview ? (
          <>
            {/* 生成設定 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  AI生成設定
                </CardTitle>
                <CardDescription>
                  個人特性に応じた評価項目の生成レベルを選択してください
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">カスタマイゼーションレベル</Label>
                    <div className="grid grid-cols-3 gap-4 mt-3">
                      {[
                        {
                          id: 'standard',
                          label: 'スタンダード',
                          description: '基本的な評価項目',
                          icon: FileText,
                          time: '5-10分'
                        },
                        {
                          id: 'personalized',
                          label: 'パーソナライズ',
                          description: '個人特性を反映',
                          icon: Sparkles,
                          time: '10-15分'
                        },
                        {
                          id: 'expert',
                          label: 'エキスパート',
                          description: '高度な個別最適化',
                          icon: Brain,
                          time: '15-20分'
                        }
                      ].map((level) => (
                        <Card 
                          key={level.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            customizationLevel === level.id ? 'border-2 border-purple-500 bg-purple-50' : ''
                          }`}
                          onClick={() => setCustomizationLevel(level.id as any)}
                        >
                          <CardContent className="p-4 text-center">
                            <level.icon className={`h-8 w-8 mx-auto mb-2 ${
                              customizationLevel === level.id ? 'text-purple-600' : 'text-gray-600'
                            }`} />
                            <h4 className="font-bold mb-1">{level.label}</h4>
                            <p className="text-xs text-gray-600 mb-2">{level.description}</p>
                            <Badge variant="outline" className="text-xs">生成時間: {level.time}</Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="focus">重点評価領域（オプション）</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {[
                        '臨床技術', '対人コミュニケーション', '安全管理', 
                        'チームワーク', '指導・教育', '問題解決能力',
                        'リーダーシップ', '専門性向上'
                      ].map((area) => (
                        <Badge
                          key={area}
                          variant={focusAreas.includes(area) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            setFocusAreas(prev => 
                              prev.includes(area) 
                                ? prev.filter(a => a !== area)
                                : [...prev, area]
                            );
                          }}
                        >
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="additional">追加要求事項</Label>
                    <Textarea
                      id="additional"
                      placeholder="特別に評価したい項目や考慮すべき事項があれば記入してください..."
                      value={additionalRequirements}
                      onChange={(e) => setAdditionalRequirements(e.target.value)}
                      rows={3}
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 生成ボタン */}
            <Card className="text-center">
              <CardContent className="p-8">
                {!isGenerating ? (
                  <div>
                    <Brain className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">AIによる個別最適化評価シートを生成</h3>
                    <p className="text-gray-600 mb-6">
                      {staffProfile.name}さんの経験・研修履歴・キャリア目標を分析し、<br/>
                      最適な評価項目を自動生成します
                    </p>
                    <Button 
                      size="lg"
                      onClick={handleGenerateEvaluation}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-8"
                    >
                      <Wand2 className="h-5 w-5 mr-2" />
                      AI評価シートを生成
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-center mb-4">
                      <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">AI分析中...</h3>
                    <p className="text-purple-600 font-medium mb-4">{generationStep}</p>
                    <Progress value={(generationStep.includes('完成') ? 100 : Math.random() * 90)} className="w-1/2 mx-auto" />
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          /* 生成結果プレビュー */
          evaluationSheet && (
            <div className="space-y-6">
              {/* 生成完了アラート */}
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">AI評価シート生成完了</AlertTitle>
                <AlertDescription className="text-green-700">
                  {staffProfile.name}さん専用の評価項目を{evaluationSheet.totalQuestions}問生成しました。
                  予想評価時間: 約{evaluationSheet.estimatedTime}分
                </AlertDescription>
              </Alert>

              {/* パーソナライゼーション分析結果 */}
              <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-purple-600" />
                    AI分析結果・カスタマイゼーション内容
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {evaluationSheet.personalizedInsights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Bot className="h-4 w-4 text-purple-600 mt-1 flex-shrink-0" />
                        <p className="text-sm text-purple-800">{insight}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 生成された評価項目プレビュー */}
              <div className="grid grid-cols-2 gap-6">
                {/* 技術評価項目 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      技術評価項目 ({evaluationSheet.technicalQuestions.length}問)
                    </CardTitle>
                    <CardDescription>
                      専門技術・ケア提供能力の評価
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {evaluationSheet.technicalQuestions.map((question, index) => (
                        <div key={question.id} className="border rounded-lg p-3 bg-blue-50">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex gap-2 mb-1">
                                <Badge className="bg-blue-100 text-blue-800 text-xs">{question.category}</Badge>
                                {getDifficultyBadge(question.difficulty)}
                                <Badge variant="outline" className="text-xs">{question.points}点</Badge>
                              </div>
                              <p className="text-sm font-medium">{question.question}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span>評価者:</span>
                            <Badge variant="outline" className="text-xs">
                              {question.evaluator === 'superior' ? '上司評価' : '自己評価'}
                            </Badge>
                            {question.trainingConnection && (
                              <>
                                <span>・研修連動:</span>
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  {question.trainingConnection}
                                </Badge>
                              </>
                            )}
                          </div>
                          <div className="mt-2 text-xs text-gray-600">
                            <strong>生成理由:</strong> {question.reason}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 貢献度評価項目 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-green-600" />
                      組織貢献度評価項目 ({evaluationSheet.contributionQuestions.length}問)
                    </CardTitle>
                    <CardDescription>
                      チームワーク・施設貢献度の評価
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {evaluationSheet.contributionQuestions.map((question, index) => (
                        <div key={question.id} className="border rounded-lg p-3 bg-green-50">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex gap-2 mb-1">
                                <Badge className="bg-green-100 text-green-800 text-xs">{question.category}</Badge>
                                {getDifficultyBadge(question.difficulty)}
                                <Badge variant="outline" className="text-xs">{question.points}点</Badge>
                              </div>
                              <p className="text-sm font-medium">{question.question}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span>評価者:</span>
                            <Badge variant="outline" className="text-xs">
                              {question.evaluator === 'superior' ? '上司評価' : '自己評価'}
                            </Badge>
                          </div>
                          <div className="mt-2 text-xs text-gray-600">
                            <strong>生成理由:</strong> {question.reason}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* アクション */}
              <div className="flex justify-center gap-4">
                <Button
                  size="lg"
                  onClick={handleStartEvaluation}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 px-8"
                >
                  <PlayCircle className="h-5 w-5 mr-2" />
                  この評価シートで評価開始
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowPreview(false)}
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  再生成
                </Button>
                <Button variant="outline" size="lg">
                  <Save className="h-5 w-5 mr-2" />
                  テンプレート保存
                </Button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}