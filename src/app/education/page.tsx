'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BookOpen,
  Calendar,
  Users,
  Award,
  ChevronRight,
  Clock,
  Target,
  TrendingUp,
  User,
  Building,
  FileText,
  CheckCircle,
  AlertCircle,
  BarChart3,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import {
  facilityTypeNames,
  jobCategoryNames,
  experienceLevelNames
} from '@/data/evaluationMasterData';

interface TrainingProgram {
  id: string;
  name: string;
  category: 'basic' | 'specialty' | 'management' | 'safety';
  type: 'OJT' | 'OffJT' | 'e-learning';
  targetJobs: string[];
  targetLevels: string[];
  duration: number;
  requiredFor: string[];
  schedule: string;
  status: 'planned' | 'ongoing' | 'completed';
  participants: number;
  completionRate: number;
}

// 月の現在ステータスを取得する関数
const currentMonth = new Date().getMonth() + 1;

const trainingPrograms: TrainingProgram[] = [
  {
    id: 'TR001',
    name: '基礎看護技術研修',
    category: 'basic',
    type: 'OJT',
    targetJobs: ['nurse', 'assistantNurse'],
    targetLevels: ['new', 'junior'],
    duration: 40,
    requiredFor: ['C01'],
    schedule: '4月',
    status: 'completed',
    participants: 25,
    completionRate: 100
  },
  {
    id: 'TR002',
    name: '医療安全管理研修',
    category: 'safety',
    type: 'OffJT',
    targetJobs: ['nurse', 'assistantNurse', 'nursingAide'],
    targetLevels: ['new', 'junior', 'midlevel', 'veteran'],
    duration: 8,
    requiredFor: ['C03'],
    schedule: '4月、10月',
    status: 'ongoing',
    participants: 120,
    completionRate: 85
  },
  {
    id: 'TR003',
    name: 'プリセプター養成研修',
    category: 'management',
    type: 'OffJT',
    targetJobs: ['nurse'],
    targetLevels: ['midlevel', 'veteran'],
    duration: 16,
    requiredFor: ['F02'],
    schedule: '2月',
    status: 'planned',
    participants: 15,
    completionRate: 0
  },
  {
    id: 'TR004',
    name: '認知症ケア研修',
    category: 'specialty',
    type: 'e-learning',
    targetJobs: ['nurse', 'careWorker', 'careAssistant'],
    targetLevels: ['junior', 'midlevel'],
    duration: 12,
    requiredFor: ['F06'],
    schedule: '随時',
    status: 'ongoing',
    participants: 45,
    completionRate: 60
  }
];

export default function EducationPage() {
  const [selectedFacility, setSelectedFacility] = useState('acute');
  const [selectedJob, setSelectedJob] = useState('nurse');
  const [selectedLevel, setSelectedLevel] = useState('junior');
  const [activeTab, setActiveTab] = useState('station');

  const getCategoryColor = (category: string) => {
    const colors = {
      basic: 'bg-blue-100 text-blue-800',
      specialty: 'bg-purple-100 text-purple-800',
      management: 'bg-orange-100 text-orange-800',
      safety: 'bg-red-100 text-red-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      OJT: 'bg-green-100 text-green-800',
      OffJT: 'bg-yellow-100 text-yellow-800',
      'e-learning': 'bg-indigo-100 text-indigo-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'ongoing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'planned':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  // フィルタリング
  const filteredPrograms = trainingPrograms.filter(program => {
    const jobMatch = program.targetJobs.includes(selectedJob);
    const levelMatch = program.targetLevels.includes(selectedLevel);
    return jobMatch && levelMatch;
  });

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">教育・研修管理システム</h1>
        <p className="text-gray-600">教育師長管理画面 - 研修プログラムと評価項目の連携</p>
      </div>

      {/* ナビゲーションカード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div 
          onClick={() => setActiveTab('planning')}
          className="cursor-pointer"
        >
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Calendar className="h-8 w-8 text-blue-500 mb-2" />
                  <h3 className="font-semibold">年間研修計画</h3>
                  <p className="text-sm text-gray-600">研修スケジュール管理</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div 
          onClick={() => setActiveTab('management')}
          className="cursor-pointer"
        >
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Users className="h-8 w-8 text-green-500 mb-2" />
                  <h3 className="font-semibold">受講管理</h3>
                  <p className="text-sm text-gray-600">個人別研修履歴</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Link href="/evaluation-design">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Award className="h-8 w-8 text-purple-500 mb-2" />
                  <h3 className="font-semibold">評価連携</h3>
                  <p className="text-sm text-gray-600">評価項目との紐付け</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="station">研修ステーション</TabsTrigger>
          <TabsTrigger value="planning">年間計画</TabsTrigger>
          <TabsTrigger value="management">受講管理</TabsTrigger>
          <TabsTrigger value="analytics">分析・効果測定</TabsTrigger>
        </TabsList>

        {/* 研修ステーションタブ */}
        <TabsContent value="station" className="space-y-6">
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* 研修計画カード */}
            <Card className="border-2 border-blue-500 shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-blue-600 to-blue-700 text-white relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <Badge className="bg-yellow-400 text-yellow-900">計画必須</Badge>
              </div>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 rounded-lg backdrop-blur">
                      <Calendar className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-white">研修計画</CardTitle>
                      <CardDescription className="text-blue-100 mt-1">
                        評価連動型年間研修スケジュール
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-white/10 rounded-lg backdrop-blur">
                  <h4 className="text-sm font-bold text-blue-100 mb-3">計画可能な項目：</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-300" />
                      <span className="text-sm">年間研修計画</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-300" />
                      <span className="text-sm">評価連動設定</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-300" />
                      <span className="text-sm">ROI分析</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-300" />
                      <span className="text-sm">効果測定</span>
                    </div>
                  </div>
                </div>
                <Button 
                  className="w-full bg-white text-blue-600 hover:bg-blue-50" 
                  size="lg"
                  onClick={() => setActiveTab('planning')}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  年間計画を開く
                </Button>
              </CardContent>
            </Card>

            {/* 受講管理カード */}
            <Card className="border-2 border-purple-500 shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-purple-600 to-purple-700 text-white relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <Badge className="bg-orange-400 text-orange-900">進行中</Badge>
              </div>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 rounded-lg backdrop-blur">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-white">受講管理</CardTitle>
                      <CardDescription className="text-purple-100 mt-1">
                        個人別研修履歴と進捗管理
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white/10 rounded-lg backdrop-blur">
                    <p className="text-purple-100 text-sm mb-1">受講完了</p>
                    <p className="text-2xl font-bold">78%</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-lg backdrop-blur">
                    <p className="text-purple-100 text-sm mb-1">未受講者</p>
                    <p className="text-2xl font-bold">25名</p>
                  </div>
                </div>
                <Button 
                  className="w-full bg-white text-purple-600 hover:bg-purple-50" 
                  size="lg"
                  onClick={() => setActiveTab('management')}
                >
                  <Users className="mr-2 h-5 w-5" />
                  受講管理を開く
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 今月の重点タスク（動的表示） */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                今月の重点タスク（8月）
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">研修実施強化</h4>
                  <p className="text-sm text-gray-600 mb-3">第2四半期の研修を集中実施</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">医療安全</Badge>
                    <Badge variant="outline" className="text-xs">感染対策</Badge>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">個別フォローアップ</h4>
                  <p className="text-sm text-gray-600 mb-3">未受講者への個別対応</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800">要対応 25名</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 年間計画タブ - 2列表示実装 */}
        <TabsContent value="planning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                2列表示年間計画
                <Badge className="bg-green-100 text-green-800">New</Badge>
              </CardTitle>
              <CardDescription>研修計画と評価管理の連携表示 - リアルタイム同期</CardDescription>
            </CardHeader>
            <CardContent>
              {/* 月別2列表示 */}
              <div className="space-y-4">
                {/* 4月 */}
                <Card className={`border-2 ${currentMonth === 4 ? 'border-blue-500 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 shadow-2xl' : 'border-gray-200'}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-bold text-lg ${currentMonth === 4 ? 'text-blue-800' : 'text-gray-800'}`}>4月</h3>
                      {currentMonth === 4 && <Badge className="bg-blue-600 text-white animate-pulse">実施中</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      {/* 左側：研修スケジュール */}
                      <div className="border-r pr-4">
                        <h4 className="text-md font-semibold mb-3 text-blue-800 flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          教育研修タスク
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-green-700">基礎看護技術研修 完了</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-green-700">個別研修計画の確定・通知</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-green-700">第1四半期必須研修の予約開始</span>
                          </div>
                        </div>
                      </div>
                      {/* 右側：評価スケジュール */}
                      <div className="pl-4">
                        <h4 className="text-md font-semibold mb-3 text-purple-800 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          評価管理タスク
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-green-700">前年度評価結果フィードバック</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-green-700">昇給・賞与への反映</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded">
                            💡 研修効果が前年評価に反映済み
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 6月（重要月） */}
                <Card className={`border-2 ${currentMonth === 6 ? 'border-blue-500 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 shadow-2xl' : 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg'}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-bold text-lg ${currentMonth === 6 ? 'text-blue-800' : 'text-purple-800'}`}>6月</h3>
                        <Badge className={`${currentMonth === 6 ? 'bg-blue-600 text-white animate-pulse' : 'bg-purple-600 text-white'}`}>
                          {currentMonth === 6 ? '実施中' : '夏季貢献度評価'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      {/* 左側：研修スケジュール */}
                      <div className="border-r pr-4">
                        <h4 className="text-md font-semibold mb-3 text-blue-800 flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          教育研修タスク
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-green-700">第1四半期研修効果測定</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-green-700">貢献度スコアと研修受講の相関分析</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                            <Clock className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium text-yellow-700">下半期研修計画の調整</span>
                          </div>
                        </div>
                      </div>
                      {/* 右側：評価スケジュール */}
                      <div className="pl-4">
                        <h4 className="text-md font-semibold mb-3 text-purple-800 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          評価管理タスク
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-green-700">各施設から評価データ収集</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-green-700">相対評価ランキング作成</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-purple-100 rounded-lg border border-purple-300">
                            <Award className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-bold text-purple-800">夏季貢献度評価（25点）</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-semibold text-gray-700">連携効果:</span>
                        <span className="text-sm text-green-700">研修受講者の貢献度評価が平均+3点向上</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 8月（現在月） */}
                <Card className={`border-4 border-blue-500 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 shadow-2xl ring-2 ring-blue-200`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-blue-800">8月</h3>
                        <Badge className="bg-blue-600 text-white animate-pulse">🎯 実施中</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      {/* 左側：研修スケジュール */}
                      <div className="border-r pr-4">
                        <h4 className="text-md font-semibold mb-3 text-blue-800 flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          教育研修タスク
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 p-2 bg-orange-100 rounded-lg border border-orange-300">
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-800">医療安全研修 集中実施</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                            <Clock className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium text-yellow-700">未受講者への個別対応（25名）</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                            <BarChart3 className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium text-blue-700">第2四半期進捗レビュー</span>
                          </div>
                        </div>
                      </div>
                      {/* 右側：評価スケジュール */}
                      <div className="pl-4">
                        <h4 className="text-md font-semibold mb-3 text-purple-800 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          評価管理タスク
                        </h4>
                        <div className="space-y-2">
                          <div className="text-center p-3 bg-gray-100 rounded-lg">
                            <span className="text-sm text-gray-600">通常の評価業務はありません</span>
                          </div>
                          <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
                            💡 研修強化期間中
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-semibold text-gray-700">重要:</span>
                        <span className="text-sm text-orange-700">12月評価前の必須研修完了が必要</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 12月（重要月） */}
                <Card className="border-2 border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-purple-800">12月</h3>
                        <Badge className="bg-purple-600 text-white">冬季貢献度評価</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      {/* 左側：研修スケジュール */}
                      <div className="border-r pr-4">
                        <h4 className="text-md font-semibold mb-3 text-blue-800 flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          教育研修タスク
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                            <BarChart3 className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium text-blue-700">年間研修ROI分析</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                            <Target className="h-4 w-4 text-purple-500" />
                            <span className="text-sm font-medium text-purple-700">高成果者の研修パターン分析</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                            <Clock className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium text-yellow-700">次年度研修プログラム改善提案</span>
                          </div>
                        </div>
                      </div>
                      {/* 右側：評価スケジュール */}
                      <div className="pl-4">
                        <h4 className="text-md font-semibold mb-3 text-purple-800 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          評価管理タスク
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                            <Clock className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium text-yellow-700">各施設から評価データ収集</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                            <Clock className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium text-yellow-700">年間貢献度スコア確定</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-purple-100 rounded-lg border border-purple-300">
                            <Award className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-bold text-purple-800">冬季貢献度評価（25点）</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-semibold text-gray-700">年間成果予測:</span>
                        <span className="text-sm text-green-700">研修ROI 125%達成見込み</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 3月（年度末・技術評価月） */}
                <Card className="border-2 border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-purple-800">3月</h3>
                        <Badge className="bg-purple-600 text-white">技術評価実施</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      {/* 左側：研修スケジュール */}
                      <div className="border-r pr-4">
                        <h4 className="text-md font-semibold mb-3 text-blue-800 flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          教育研修タスク
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-green-700">評価結果即時分析→個別研修計画生成</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                            <Target className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium text-blue-700">スコアギャップ基づく優先研修リスト</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                            <BarChart3 className="h-4 w-4 text-purple-500" />
                            <span className="text-sm font-medium text-purple-700">新年度研修予算配分提案</span>
                          </div>
                        </div>
                      </div>
                      {/* 右側：評価スケジュール */}
                      <div className="pl-4">
                        <h4 className="text-md font-semibold mb-3 text-purple-800 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          評価管理タスク
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                            <Clock className="h-4 w-4 text-yellow-500 animate-pulse" />
                            <span className="text-sm font-medium text-yellow-700">評価シート配布</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                            <Clock className="h-4 w-4 text-yellow-500 animate-pulse" />
                            <span className="text-sm font-medium text-yellow-700">上司評価・本人評価の実施</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-purple-100 rounded-lg border border-purple-300">
                            <Award className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-bold text-purple-800">技術評価実施（50点）</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-green-100 rounded-lg border border-green-300">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-bold text-green-800">年間総合評価決定</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-green-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-semibold text-gray-700">完成:</span>
                        <span className="text-sm text-purple-700">研修効果が技術評価に反映、平均+5点向上見込み</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* サマリーカード */}
              <Card className="mt-6 border-2 border-green-400 bg-gradient-to-r from-green-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    年間連携サマリー
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <div className="text-2xl font-bold text-blue-600">18</div>
                      <div className="text-xs text-gray-600">年間研修プログラム</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <div className="text-2xl font-bold text-purple-600">4回</div>
                      <div className="text-xs text-gray-600">評価実施タイミング</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <div className="text-2xl font-bold text-green-600">100%</div>
                      <div className="text-xs text-gray-600">研修・評価連携率</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <div className="text-2xl font-bold text-yellow-600">+8.5点</div>
                      <div className="text-xs text-gray-600">年間スコア向上予測</div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-white rounded-lg border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">年間ROI予測</span>
                      <span className="text-lg font-bold text-green-600">125%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                      <div className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full" style={{width: '125%', maxWidth: '100%'}}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 受講管理タブ */}
        <TabsContent value="management" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 研修プログラム一覧 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  研修プログラム一覧
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPrograms.map(program => (
                    <div key={program.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(program.status)}
                            <span className="font-semibold">{program.name}</span>
                            <Badge className={getCategoryColor(program.category)}>
                              {program.category}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{program.duration}時間</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Target className="h-4 w-4" />
                              <span>完了率: {program.completionRate}%</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          管理
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 個人別受講状況 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  個人別受講状況
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">山田太郎</p>
                      <p className="text-sm text-gray-600">看護師・中堅</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">95%完了</p>
                      <Badge variant="outline" className="text-xs">評価対象</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">佐藤花子</p>
                      <p className="text-sm text-gray-600">介護士・新人</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-orange-600">60%完了</p>
                      <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800">要フォロー</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">田中一郎</p>
                      <p className="text-sm text-gray-600">理学療法士・ベテラン</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">100%完了</p>
                      <Badge variant="outline" className="text-xs bg-green-100 text-green-800">模範</Badge>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  全件表示
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 未受講者アラート */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                未受講者アラート
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-700">
                    医療安全研修の未受講者が25名います。評価実施前に受講完了が必要です。
                  </AlertDescription>
                </Alert>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                    個別通知送信
                  </Button>
                  <Button size="sm" variant="outline">
                    詳細確認
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>


        {/* 分析・効果測定タブ */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">研修ROI</span>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold">125%</div>
                <div className="text-sm text-green-600">+5% 前期比</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">評価スコア向上</span>
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
                <div className="text-2xl font-bold">+7.2点</div>
                <div className="text-sm text-gray-600">研修受講者平均</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">研修完了率</span>
                  <BarChart3 className="h-4 w-4 text-purple-500" />
                </div>
                <div className="text-2xl font-bold">78.5%</div>
                <div className="text-sm text-gray-600">年間目標達成</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">評価連携率</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm text-green-600">システム連携完了</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 研修効果と評価スコアの相関分析 */}
            <Card>
              <CardHeader>
                <CardTitle>研修効果と評価スコアの相関</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg bg-green-50">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">医療安全研修</span>
                      <Badge className="bg-green-100 text-green-800">効果大</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">受講者の技術評価が平均+8.5点向上</p>
                  </div>
                  <div className="p-3 border rounded-lg bg-blue-50">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">リーダーシップ研修</span>
                      <Badge className="bg-blue-100 text-blue-800">効果中</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">受講者の貢献度評価が平均+5.2点向上</p>
                  </div>
                  <div className="p-3 border rounded-lg bg-yellow-50">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">専門技術研修</span>
                      <Badge className="bg-yellow-100 text-yellow-800">要改善</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">効果が限定的（+2.1点）。内容の見直しが必要</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 効果予測シミュレーション */}
            <Card>
              <CardHeader>
                <CardTitle>効果予測シミュレーション</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert className="border-blue-200 bg-blue-50">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-700">
                      <strong>来期予測:</strong> 現在の研修計画で平均評価スコアが82.3点に向上見込み
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Sグレード到達予測</span>
                      <span className="font-medium">18% → 25%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Aグレード到達予測</span>
                      <span className="font-medium">35% → 42%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>C・Dグレード削減予測</span>
                      <span className="font-medium">25% → 15%</span>
                    </div>
                  </div>
                  <Button className="w-full" size="sm">
                    詳細シミュレーション
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 施設別進捗 */}
          <Card>
            <CardHeader>
              <CardTitle>施設別研修進捗と評価連携状況</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(facilityTypeNames).map(([key, name]) => (
                  <div key={key} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{name}</span>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">研修75%</Badge>
                        <Badge variant="outline" className="text-xs bg-green-100 text-green-800">連携OK</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: '75%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}