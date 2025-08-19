'use client';

import React, { useState } from 'react';
import CommonHeader from '@/components/CommonHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import styles from './EvaluationDesign.module.css';
import { 
  ArrowLeft, 
  Target, 
  Building, 
  Users, 
  Award,
  Settings,
  FlaskConical,
  BarChart3,
  Info,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Sparkles,
  Rocket,
  ChevronRight,
  PlayCircle,
  Edit3,
  Save,
  FileCheck,
  AlertTriangle,
  TrendingUp,
  Zap,
  BookOpen,
  HelpCircle,
  Shield,
  Database,
  Layers
} from 'lucide-react';
import Link from 'next/link';

export default function EvaluationDesignPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showGuide, setShowGuide] = useState(true);

  // 評価設計のステップ
  const designSteps = [
    { id: 1, title: '配点設定', status: 'completed', icon: BarChart3 },
    { id: 2, title: '項目選定', status: 'current', icon: Settings },
    { id: 3, title: 'シミュレーション', status: 'upcoming', icon: FlaskConical },
    { id: 4, title: '承認', status: 'upcoming', icon: FileCheck }
  ];

  // 施設別の設定進捗（モックデータ）
  const facilityProgress = [
    { 
      name: '小原病院', 
      type: '急性期',
      technical: 80, 
      contribution: 100,
      status: 'reviewing',
      lastUpdated: '2024-12-20'
    },
    { 
      name: '立神リハビリテーション温泉病院', 
      type: '慢性期',
      technical: 60, 
      contribution: 100,
      status: 'draft',
      lastUpdated: '2024-12-18'
    },
    { 
      name: 'エスポワール立神', 
      type: '老健',
      technical: 100, 
      contribution: 100,
      status: 'approved',
      lastUpdated: '2024-12-15'
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">承認済み</Badge>;
      case 'reviewing':
        return <Badge className="bg-blue-100 text-blue-800">レビュー中</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">下書き</Badge>;
      default:
        return <Badge>未作成</Badge>;
    }
  };

  return (
    <div>
      <CommonHeader title="評価制度設計" />
      <div className={styles.container}>
        {/* 設計フローガイド */}
        {showGuide && (
          <Card className="mb-6 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-purple-600" />
                  <CardTitle className="text-lg">評価設計フロー</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowGuide(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                {designSteps.map((step, index) => (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center flex-1">
                      <div className={`
                        p-3 rounded-full mb-2 transition-all
                        ${step.status === 'completed' ? 'bg-green-100' : ''}
                        ${step.status === 'current' ? 'bg-purple-100 ring-4 ring-purple-200' : ''}
                        ${step.status === 'upcoming' ? 'bg-gray-100' : ''}
                      `}>
                        <step.icon className={`
                          h-5 w-5
                          ${step.status === 'completed' ? 'text-green-600' : ''}
                          ${step.status === 'current' ? 'text-purple-600' : ''}
                          ${step.status === 'upcoming' ? 'text-gray-400' : ''}
                        `} />
                      </div>
                      <span className={`
                        text-sm font-medium
                        ${step.status === 'current' ? 'text-purple-600' : 'text-gray-600'}
                      `}>
                        {step.title}
                      </span>
                    </div>
                    {index < designSteps.length - 1 && (
                      <ChevronRight className="h-5 w-5 text-gray-400 mb-8" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <Alert className="border-purple-200 bg-purple-50">
                <Zap className="h-4 w-4 text-purple-600" />
                <AlertDescription className="text-purple-800">
                  <strong>現在のタスク：</strong> 各施設の技術評価項目を選定してください。
                  残り<strong className="text-red-600">2施設</strong>の設定が必要です。
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* メイン機能へのアクセス */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            評価管理メニュー
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {/* 年間スケジュール管理 - 新機能 */}
            <Link href="/evaluation-design/timeline">
              <Card className="hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-purple-400 bg-gradient-to-br from-purple-50 to-indigo-100">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-500 rounded-full">
                      <Calendar className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-purple-900 text-lg mb-1">年間スケジュール管理</h3>
                      <p className="text-sm text-purple-700 mb-2">月別タスクで評価業務を管理</p>
                      <Badge className="bg-purple-100 text-purple-800">推奨</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            {/* 設計ウィザード - 新機能 */}
            <Link href="/evaluation-design/wizard">
              <Card className="hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-blue-400 bg-gradient-to-br from-blue-50 to-cyan-100">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500 rounded-full">
                      <Settings className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-blue-900 text-lg mb-1">評価設計ウィザード</h3>
                      <p className="text-sm text-blue-700 mb-2">ステップごとに評価制度を設計</p>
                      <Badge className="bg-blue-100 text-blue-800">簡単設定</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
          
          {/* 従来機能（小さく表示） */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            <Link href="/evaluation-design/questions">
              <Card className="hover:shadow-lg transition-all cursor-pointer border border-gray-200">
                <CardContent className="p-3 text-center">
                  <Sparkles className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-700">AI動的設問</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/evaluation-design/simulation">
              <Card className="hover:shadow-lg transition-all cursor-pointer border border-gray-200">
                <CardContent className="p-3 text-center">
                  <FlaskConical className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-700">シミュレーション</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/evaluation-design/technical/corporate">
              <Card className="hover:shadow-lg transition-all cursor-pointer border border-gray-200">
                <CardContent className="p-3 text-center">
                  <Shield className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-700">法人統一項目</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/evaluation-design/technical/facility">
              <Card className="hover:shadow-lg transition-all cursor-pointer border border-gray-200">
                <CardContent className="p-3 text-center">
                  <Building className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-700">施設特化項目</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <div className={styles.tabNavigation}>
          {[
            { id: 'overview', label: '概要', icon: '📋' },
            { id: 'technical', label: '技術評価設計', icon: '🔧' },
            { id: 'facility', label: '施設特化設計', icon: '🏢' },
            { id: 'contribution', label: '貢献度設計', icon: '🌟' },
            { id: 'simulation', label: 'シミュレーション', icon: '🧪' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'overview' && (
            <div className="space-y-6 p-6">
            {/* 重要なアラート */}
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertTitle>設定が必要な項目があります</AlertTitle>
              <AlertDescription className="mt-2">
                <div className="flex items-center justify-between">
                  <span>小原病院と立神リハビリの技術評価項目が未完成です。</span>
                  <Link href="/evaluation-design/technical">
                    <Button size="sm" className="ml-4">
                      今すぐ設定
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </AlertDescription>
            </Alert>

            {/* 現在の配分 */}
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  現在の評価配分（100点満点）
                </CardTitle>
                <CardDescription>
                  技術評価と貢献度評価の配分バランス
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">技術評価</span>
                        <span className="text-2xl font-bold text-blue-600">50点</span>
                      </div>
                      <Progress value={50} className="h-3" />
                      <div className="mt-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">法人統一項目</span>
                          <span className="font-medium">30点</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">施設特化項目</span>
                          <span className="font-medium">20点</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">貢献度評価</span>
                        <span className="text-2xl font-bold text-green-600">50点</span>
                      </div>
                      <Progress value={50} className="h-3 bg-green-100" />
                      <div className="mt-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">施設貢献度</span>
                          <span className="font-medium">25点</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">法人貢献度</span>
                          <span className="font-medium">25点</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 施設別進捗 */}
            <Card className="border-2 border-gray-200">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-gray-700" />
                  施設別設定進捗
                </CardTitle>
                <CardDescription>
                  各施設の評価設計の進捗状況
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {facilityProgress.map((facility) => (
                    <div key={facility.name} className="border-2 rounded-lg p-4 hover:shadow-lg transition-shadow
                      ${facility.status === 'approved' ? 'border-green-200 bg-green-50' : ''}
                      ${facility.status === 'reviewing' ? 'border-blue-200 bg-blue-50' : ''}
                      ${facility.status === 'draft' ? 'border-yellow-200 bg-yellow-50' : ''}
                    ">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg
                            ${facility.status === 'approved' ? 'bg-green-100' : ''}
                            ${facility.status === 'reviewing' ? 'bg-blue-100' : ''}
                            ${facility.status === 'draft' ? 'bg-yellow-100' : ''}
                          `}>
                            <Building className={`h-5 w-5
                              ${facility.status === 'approved' ? 'text-green-600' : ''}
                              ${facility.status === 'reviewing' ? 'text-blue-600' : ''}
                              ${facility.status === 'draft' ? 'text-yellow-600' : ''}
                            `} />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">{facility.name}</h4>
                            <p className="text-sm text-gray-600">{facility.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500">
                            最終更新: {facility.lastUpdated}
                          </span>
                          {getStatusBadge(facility.status)}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">技術評価設計</span>
                            <span className="font-bold">{facility.technical}%</span>
                          </div>
                          <Progress value={facility.technical} className="h-3" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">貢献度評価設計</span>
                            <span className="font-bold">{facility.contribution}%</span>
                          </div>
                          <Progress value={facility.contribution} className="h-3" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/evaluation-design/facility/${facility.name}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Edit3 className="w-4 h-4 mr-2" />
                            設定を編集
                          </Button>
                        </Link>
                        {facility.status === 'draft' && (
                          <Button variant="default" size="sm">
                            <Save className="w-4 h-4 mr-2" />
                            保存
                          </Button>
                        )}
                        {facility.status === 'reviewing' && (
                          <Button variant="secondary" size="sm">
                            <FileCheck className="w-4 h-4 mr-2" />
                            承認待ち
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* スケジュール */}
            <Card className="border-2 border-indigo-200">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  年度スケジュール
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 via-blue-400 to-gray-300 rounded-full"></div>
                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg z-10">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                      <div className="flex-1 bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-green-900">評価設計フェーズ</h4>
                          <Badge className="bg-green-100 text-green-800">進行中</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">12月〜1月</p>
                        <p className="text-sm mt-2">各施設で評価項目と配分を決定</p>
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" variant="outline" className="text-xs">
                            <BookOpen className="h-3 w-3 mr-1" />
                            ガイドを見る
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg z-10">
                        <Clock className="w-8 h-8" />
                      </div>
                      <div className="flex-1 bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-blue-900">承認・調整フェーズ</h4>
                          <Badge className="bg-blue-100 text-blue-800">予定</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">2月</p>
                        <p className="text-sm mt-2">法人での承認と最終調整</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center text-white shadow-lg z-10">
                        <AlertCircle className="w-8 h-8" />
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-lg p-4 border-l-4 border-gray-400">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-gray-700">実施フェーズ</h4>
                          <Badge className="bg-gray-100 text-gray-600">未開始</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">3月〜</p>
                        <p className="text-sm mt-2">新年度評価の開始</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          )}

          {activeTab === 'technical' && (
            <div className="space-y-6 p-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>技術評価（50点）の設計</AlertTitle>
              <AlertDescription>
                法人統一項目（30点）と施設特化項目（20点）の詳細設計を行います
              </AlertDescription>
            </Alert>

            {/* 動的設問管理 */}
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  動的設問管理
                </CardTitle>
                <CardDescription>
                  研修履歴と経験レベルに応じて設問を自動選定
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/evaluation-design/questions">
                  <Button className="w-full" variant="default">
                    <Sparkles className="w-4 h-4 mr-2" />
                    動的設問を管理
                  </Button>
                </Link>
                <p className="text-xs text-gray-600 mt-3">
                  ✓ 研修完了状況に基づく設問推奨<br />
                  ✓ 経験レベル別の難易度調整<br />
                  ✓ 年度ごとの設問自動更新
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-6">
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-blue-600" />
                    法人統一項目（30点）
                  </CardTitle>
                  <CardDescription>
                    全施設共通の評価項目
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Link href="/evaluation-design/technical/corporate">
                      <Button className="w-full justify-start" variant="outline">
                        <Settings className="w-4 h-4 mr-2" />
                        法人統一項目を設計
                      </Button>
                    </Link>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span>C01: 専門技術・スキル</span>
                        <span className="font-medium">10点</span>
                      </div>
                      <div className="flex justify-between">
                        <span>C02: 対人関係・ケア</span>
                        <span className="font-medium">10点</span>
                      </div>
                      <div className="flex justify-between">
                        <span>C03: 安全・品質管理</span>
                        <span className="font-medium">10点</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    施設特化項目（20点）
                  </CardTitle>
                  <CardDescription>
                    各施設で選択する評価項目
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Link href="/evaluation-design/technical/facility">
                      <Button className="w-full justify-start" variant="outline">
                        <Settings className="w-4 h-4 mr-2" />
                        施設特化項目を設計
                      </Button>
                    </Link>
                    <div className="text-sm space-y-2">
                      <p className="text-gray-600">
                        項目バンクから各施設の特性に応じて選択
                      </p>
                      <ul className="list-disc list-inside text-gray-600">
                        <li>急性期：救急対応、高度医療</li>
                        <li>慢性期：リハビリ、在宅復帰</li>
                        <li>老健：生活支援、認知症ケア</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            </div>
          )}

          {activeTab === 'facility' && (
            <div className="space-y-6 p-6">
            <Card>
              <CardHeader>
                <CardTitle>施設別の特化項目設計</CardTitle>
                <CardDescription>
                  各施設の特性に応じた20点分の評価項目を選択・設定します
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {facilityProgress.map((facility) => (
                    <div key={facility.name} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{facility.name}</h4>
                          <p className="text-sm text-gray-600">{facility.type}</p>
                        </div>
                        <Link href={`/evaluation-design/facility/${facility.name}`}>
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4 mr-2" />
                            設計する
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            </div>
          )}

          {activeTab === 'contribution' && (
            <div className="space-y-6 p-6">
            <Card>
              <CardHeader>
                <CardTitle>貢献度評価（50点）の設計</CardTitle>
                <CardDescription>
                  施設貢献度と法人貢献度の評価基準を設定します
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      夏季評価（7月実施）
                    </h4>
                    <Link href="/evaluation-design/contribution/summer">
                      <Button className="w-full" variant="outline">
                        夏季評価基準を設計
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      冬季評価（12月実施）
                    </h4>
                    <Link href="/evaluation-design/contribution/winter">
                      <Button className="w-full" variant="outline">
                        冬季評価基準を設計
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          )}

          {activeTab === 'simulation' && (
            <div className="space-y-6 p-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5" />
                  評価シミュレーション
                </CardTitle>
                <CardDescription>
                  設計した評価制度の影響をシミュレーションで確認します
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Link href="/evaluation-design/simulation">
                    <Button className="w-full" size="lg">
                      <FlaskConical className="w-5 h-5 mr-2" />
                      シミュレーションを開始
                    </Button>
                  </Link>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      What-if分析により、評価配分の変更が職員に与える影響を事前に確認できます
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}