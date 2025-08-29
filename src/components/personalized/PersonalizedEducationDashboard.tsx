'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen,
  Target,
  TrendingUp,
  Award,
  Calendar,
  Clock,
  User,
  Settings,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Star,
  Zap,
  Trophy,
  Brain,
  Users,
  ArrowRight,
  Download,
  RefreshCw,
  Eye
} from 'lucide-react';

interface StaffProfile {
  id: string;
  name: string;
  experienceLevel: 'new' | 'junior' | 'midlevel' | 'veteran' | 'expert';
  jobType: 'nurse' | 'assistant-nurse' | 'pt' | 'ot' | 'care-worker';
  facility: 'acute' | 'chronic' | 'roken';
  experienceYears: number;
  currentGrade: string;
  careerGoals: string[];
  evaluationScores: {
    technical: number;
    contribution: number;
    total: number;
  };
}

interface PersonalizedWidget {
  id: string;
  type: 'progress-summary' | 'upcoming-deadlines' | 'recommendations' | 'skill-radar' | 'peer-comparison' | 'career-path' | 'certifications' | 'analytics' | 'mentor-feedback';
  title: string;
  priority: 'high' | 'medium' | 'low';
  enabled: boolean;
  position: { x: number; y: number; width: number; height: number };
}

interface TrainingRecommendation {
  id: string;
  title: string;
  category: 'skill-gap' | 'career-development' | 'evaluation-improvement' | 'trending';
  priority: 'critical' | 'high' | 'medium' | 'low';
  expectedImpact: {
    skillImprovement: number;
    evaluationBoost: number;
    careerProgress: number;
  };
  estimatedHours: number;
  deadline?: string;
  reason: string;
  basedOn: 'evaluation-data' | 'peer-analysis' | 'career-goal' | 'industry-trend';
}

export default function PersonalizedEducationDashboard({ staffProfile }: { staffProfile: StaffProfile }) {
  const [viewMode, setViewMode] = useState<'dashboard' | 'analytics' | 'settings'>('dashboard');
  const [customWidgets, setCustomWidgets] = useState<PersonalizedWidget[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<TrainingRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // パーソナライゼーション設定の初期化
  useEffect(() => {
    initializePersonalizedView();
  }, [staffProfile]);

  const initializePersonalizedView = async () => {
    setIsLoading(true);
    
    // 役職・経験年数に基づくデフォルトウィジェット配置
    const defaultWidgets = getDefaultWidgetLayout(staffProfile.experienceLevel, staffProfile.jobType);
    setCustomWidgets(defaultWidgets);
    
    // AI駆動の個別推奨生成
    const recommendations = await generatePersonalizedRecommendations(staffProfile);
    setAiRecommendations(recommendations);
    
    setIsLoading(false);
  };

  const getDefaultWidgetLayout = (experienceLevel: string, jobType: string): PersonalizedWidget[] => {
    const baseWidgets: PersonalizedWidget[] = [
      {
        id: 'progress-summary',
        type: 'progress-summary',
        title: '研修進捗サマリー',
        priority: 'high',
        enabled: true,
        position: { x: 0, y: 0, width: 12, height: 3 }  // 横幅を広げて高さを抑える
      },
      {
        id: 'recommendations',
        type: 'recommendations',
        title: 'AI推奨研修',
        priority: 'high',
        enabled: true,
        position: { x: 0, y: 3, width: 8, height: 4 }  // 左側に配置
      },
      {
        id: 'upcoming-deadlines',
        type: 'upcoming-deadlines',
        title: '締切・予定',
        priority: 'high',
        enabled: true,
        position: { x: 8, y: 3, width: 4, height: 4 }  // 右側に配置
      }
    ];

    // 経験レベル別の追加ウィジェット
    if (experienceLevel === 'new') {
      baseWidgets.push({
        id: 'mentor-feedback',
        type: 'mentor-feedback',
        title: 'メンター評価',
        priority: 'high',
        enabled: true,
        position: { x: 4, y: 4, width: 4, height: 3 }
      });
    } else if (experienceLevel === 'veteran' || experienceLevel === 'expert') {
      baseWidgets.push({
        id: 'peer-comparison',
        type: 'peer-comparison',
        title: '同期比較',
        priority: 'medium',
        enabled: true,
        position: { x: 4, y: 4, width: 4, height: 3 }
      });
    } else {
      baseWidgets.push({
        id: 'career-path',
        type: 'career-path',
        title: 'キャリアパス',
        priority: 'medium',
        enabled: true,
        position: { x: 4, y: 4, width: 4, height: 3 }
      });
    }

    baseWidgets.push({
      id: 'skill-radar',
      type: 'skill-radar',
      title: 'スキルレーダー',
      priority: 'medium',
      enabled: true,
      position: { x: 8, y: 4, width: 4, height: 3 }
    });

    return baseWidgets;
  };

  const generatePersonalizedRecommendations = async (profile: StaffProfile): Promise<TrainingRecommendation[]> => {
    // 評価データに基づく推奨
    const evaluationBasedRecommendations: TrainingRecommendation[] = [];
    
    if (profile.evaluationScores.technical < 80) {
      evaluationBasedRecommendations.push({
        id: 'tech-improvement',
        title: '専門技術スキル向上研修',
        category: 'evaluation-improvement',
        priority: 'high',
        expectedImpact: {
          skillImprovement: 85,
          evaluationBoost: 12,
          careerProgress: 15
        },
        estimatedHours: 20,
        deadline: '2025-03-31',
        reason: '技術評価スコア向上のため',
        basedOn: 'evaluation-data'
      });
    }

    if (profile.evaluationScores.contribution < 75) {
      evaluationBasedRecommendations.push({
        id: 'leadership-development',
        title: 'リーダーシップ開発プログラム',
        category: 'evaluation-improvement', 
        priority: 'high',
        expectedImpact: {
          skillImprovement: 70,
          evaluationBoost: 18,
          careerProgress: 25
        },
        estimatedHours: 32,
        deadline: '2025-06-30',
        reason: '組織貢献度スコア向上のため',
        basedOn: 'evaluation-data'
      });
    }

    // 経験レベル別推奨
    const experienceBasedRecommendations: TrainingRecommendation[] = [];
    
    if (profile.experienceLevel === 'new') {
      experienceBasedRecommendations.push({
        id: 'foundation-skills',
        title: '基礎スキル強化コース',
        category: 'skill-gap',
        priority: 'critical',
        expectedImpact: {
          skillImprovement: 95,
          evaluationBoost: 15,
          careerProgress: 20
        },
        estimatedHours: 40,
        deadline: '2025-02-28',
        reason: '新人必須スキルの確実な定着',
        basedOn: 'career-goal'
      });
    } else if (profile.experienceLevel === 'veteran') {
      experienceBasedRecommendations.push({
        id: 'mentoring-skills',
        title: '指導スキル開発研修',
        category: 'career-development',
        priority: 'medium',
        expectedImpact: {
          skillImprovement: 80,
          evaluationBoost: 10,
          careerProgress: 30
        },
        estimatedHours: 24,
        deadline: '2025-09-30',
        reason: '後進指導によるキャリアアップ',
        basedOn: 'career-goal'
      });
    }

    return [...evaluationBasedRecommendations, ...experienceBasedRecommendations];
  };

  const getExperienceLevelConfig = (level: string) => {
    const configs = {
      new: { label: '新人', color: 'bg-green-100 text-green-800', icon: '🌱' },
      junior: { label: '初級', color: 'bg-blue-100 text-blue-800', icon: '🌿' },
      midlevel: { label: '中堅', color: 'bg-purple-100 text-purple-800', icon: '🌳' },
      veteran: { label: 'ベテラン', color: 'bg-orange-100 text-orange-800', icon: '🎋' },
      expert: { label: '専門家', color: 'bg-red-100 text-red-800', icon: '👑' }
    };
    return configs[level as keyof typeof configs] || configs.midlevel;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-300',
      high: 'bg-orange-100 text-orange-800 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      low: 'bg-green-100 text-green-800 border-green-300'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const renderWidget = (widget: PersonalizedWidget) => {
    if (!widget.enabled) return null;

    switch (widget.type) {
      case 'progress-summary':
        return (
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                {widget.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="text-center p-4 bg-blue-50 rounded-lg transition-all hover:shadow-md">
                  <div className="text-3xl font-bold text-blue-600">88%</div>
                  <div className="text-sm text-gray-600 mt-1">完了率</div>
                  <Progress value={88} className="mt-2 h-1" />
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg transition-all hover:shadow-md">
                  <div className="text-3xl font-bold text-green-600">245h</div>
                  <div className="text-sm text-gray-600 mt-1">履修時間</div>
                  <div className="text-xs text-green-600 mt-2">目標: 300h</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg transition-all hover:shadow-md">
                  <div className="text-3xl font-bold text-purple-600">3</div>
                  <div className="text-sm text-gray-600 mt-1">進行中</div>
                  <div className="flex justify-center gap-1 mt-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-150"></div>
                  </div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg transition-all hover:shadow-md">
                  <div className="text-3xl font-bold text-orange-600">2</div>
                  <div className="text-sm text-gray-600 mt-1">締切間近</div>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <AlertCircle className="h-3 w-3 text-orange-500" />
                    <span className="text-xs text-orange-600">要確認</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'recommendations':
        return (
          <Card className="h-full overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="h-5 w-5 text-purple-600" />
                {widget.title}
                <Badge className="bg-purple-100 text-purple-800 text-xs">AI</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {aiRecommendations.slice(0, 3).map((rec) => (
                  <div key={rec.id} className={`p-4 rounded-lg border ${getPriorityColor(rec.priority)} transition-all hover:shadow-md`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm line-clamp-2">{rec.title}</h4>
                      <Badge className={`text-xs flex-shrink-0 ml-2 ${rec.priority === 'critical' ? 'bg-red-600 text-white' : rec.priority === 'high' ? 'bg-orange-600 text-white' : 'bg-yellow-600 text-white'}`}>
                        {rec.priority === 'critical' ? '緊急' : rec.priority === 'high' ? '高' : '中'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        評価 +{rec.expectedImpact.evaluationBoost}pts
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {rec.estimatedHours}時間
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">{rec.reason}</p>
                    {rec.deadline && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
                        <Calendar className="h-3 w-3" />
                        期限: {rec.deadline}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {aiRecommendations.length > 3 && (
                <Button variant="ghost" size="sm" className="w-full mt-3">
                  さらに{aiRecommendations.length - 3}件を表示
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              )}
            </CardContent>
          </Card>
        );

      case 'upcoming-deadlines':
        return (
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-orange-600" />
                {widget.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                <div className="flex flex-col gap-2 p-3 bg-red-50 rounded-lg border-l-4 border-red-500 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between">
                    <div className="font-medium text-sm">医療安全研修</div>
                    <Badge className="bg-red-600 text-white text-xs flex-shrink-0">5日後</Badge>
                  </div>
                  <div className="text-xs text-gray-600">2025-02-15</div>
                  <Progress value={75} className="h-1 mt-1" />
                </div>
                <div className="flex flex-col gap-2 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between">
                    <div className="font-medium text-sm">リーダーシップ研修</div>
                    <Badge className="bg-orange-600 text-white text-xs flex-shrink-0">10日後</Badge>
                  </div>
                  <div className="text-xs text-gray-600">2025-02-20</div>
                  <Progress value={40} className="h-1 mt-1" />
                </div>
                <div className="flex flex-col gap-2 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between">
                    <div className="font-medium text-sm">感染管理研修</div>
                    <Badge className="bg-yellow-600 text-white text-xs flex-shrink-0">15日後</Badge>
                  </div>
                  <div className="text-xs text-gray-600">2025-02-25</div>
                  <Progress value={20} className="h-1 mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'skill-radar':
        return (
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-indigo-600" />
                {widget.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-2xl">🎯</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>技術力: 82%</div>
                  <div>リーダーシップ: 65%</div>
                  <div>コミュニケーション: 88%</div>
                  <div>問題解決: 75%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card className="h-full">
            <CardContent className="p-6 text-center text-gray-500">
              <div className="text-4xl mb-2">🔧</div>
              <div className="text-sm">開発中のウィジェット</div>
            </CardContent>
          </Card>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <RefreshCw className="h-12 w-12 mx-auto mb-4 text-gray-300 animate-spin" />
        <p className="text-gray-500 mb-2">個人専用ダッシュボードを準備中...</p>
        <p className="text-xs text-gray-400">あなた専用の研修プランを生成しています</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* パーソナライズヘッダー */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {staffProfile.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{staffProfile.name} さん専用ダッシュボード</h2>
              <div className="flex items-center gap-3 mt-2">
                <Badge className={getExperienceLevelConfig(staffProfile.experienceLevel).color}>
                  {getExperienceLevelConfig(staffProfile.experienceLevel).icon} {getExperienceLevelConfig(staffProfile.experienceLevel).label}
                </Badge>
                <Badge variant="outline">{staffProfile.jobType}</Badge>
                <Badge variant="outline">経験{staffProfile.experienceYears}年</Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{staffProfile.evaluationScores.total}点</div>
            <div className="text-sm text-gray-600">最新評価スコア</div>
          </div>
        </div>
      </div>

      {/* ビューモード切替 */}
      <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">パーソナルダッシュボード</TabsTrigger>
          <TabsTrigger value="analytics">詳細分析</TabsTrigger>
          <TabsTrigger value="settings">カスタマイズ</TabsTrigger>
        </TabsList>

        {/* ダッシュボードビュー */}
        <TabsContent value="dashboard">
          <div className="space-y-4" style={{ minHeight: '600px' }}>
            {/* 研修進捗サマリー（全幅表示） */}
            {customWidgets.find(w => w.id === 'progress-summary' && w.enabled) && (
              <div className="w-full">
                {renderWidget(customWidgets.find(w => w.id === 'progress-summary')!)}
              </div>
            )}
            
            {/* その他のウィジェット（グリッドレイアウト） */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* AI推奨研修（2/3幅） */}
              {customWidgets.find(w => w.id === 'recommendations' && w.enabled) && (
                <div className="lg:col-span-2">
                  {renderWidget(customWidgets.find(w => w.id === 'recommendations')!)}
                </div>
              )}
              
              {/* 締切・予定（1/3幅） */}
              {customWidgets.find(w => w.id === 'upcoming-deadlines' && w.enabled) && (
                <div className="lg:col-span-1">
                  {renderWidget(customWidgets.find(w => w.id === 'upcoming-deadlines')!)}
                </div>
              )}
            </div>
            
            {/* 追加ウィジェット */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customWidgets.filter(w => 
                w.enabled && 
                !['progress-summary', 'recommendations', 'upcoming-deadlines'].includes(w.id)
              ).map((widget) => (
                <div key={widget.id}>
                  {renderWidget(widget)}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* 詳細分析ビュー */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>学習効果分析</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>技術スキル向上率</span>
                    <div className="flex items-center gap-2">
                      <Progress value={85} className="w-24" />
                      <span className="text-sm font-medium">+12%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>リーダーシップ開発</span>
                    <div className="flex items-center gap-2">
                      <Progress value={65} className="w-24" />
                      <span className="text-sm font-medium">+8%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>組織貢献度改善</span>
                    <div className="flex items-center gap-2">
                      <Progress value={78} className="w-24" />
                      <span className="text-sm font-medium">+15%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>キャリア予測</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="h-5 w-5 text-green-600" />
                      <span className="font-medium">次の昇進予測</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">2026年4月</div>
                    <div className="text-sm text-gray-600">主任職への昇進可能性 78%</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">推奨キャリアパス</span>
                    </div>
                    <div className="text-sm text-gray-600">リーダーシップ開発 → 専門性強化 → 管理職候補</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* カスタマイズビュー */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>ダッシュボードのカスタマイズ</CardTitle>
              <CardDescription>
                表示するウィジェットをカスタマイズして、あなた専用のダッシュボードを作成できます。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customWidgets.map((widget) => (
                  <div key={widget.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={widget.enabled}
                        onChange={(e) => {
                          setCustomWidgets(widgets => 
                            widgets.map(w => 
                              w.id === widget.id ? { ...w, enabled: e.target.checked } : w
                            )
                          );
                        }}
                        className="rounded"
                      />
                      <div>
                        <div className="font-medium">{widget.title}</div>
                        <div className="text-sm text-gray-600">{widget.type}</div>
                      </div>
                    </div>
                    <Badge className={widget.priority === 'high' ? 'bg-orange-100 text-orange-800' : widget.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                      {widget.priority === 'high' ? '重要' : widget.priority === 'medium' ? '普通' : '低'}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  設定を保存
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}