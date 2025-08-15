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
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function EvaluationDesignPage() {
  const [activeTab, setActiveTab] = useState('overview');

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
            {/* 現在の配分 */}
            <Card>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  施設別設定進捗
                </CardTitle>
                <CardDescription>
                  各施設の評価設計の進捗状況
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {facilityProgress.map((facility) => (
                    <div key={facility.name} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{facility.name}</h4>
                          <p className="text-sm text-gray-600">{facility.type}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500">
                            最終更新: {facility.lastUpdated}
                          </span>
                          {getStatusBadge(facility.status)}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>技術評価設計</span>
                            <span>{facility.technical}%</span>
                          </div>
                          <Progress value={facility.technical} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>貢献度評価設計</span>
                            <span>{facility.contribution}%</span>
                          </div>
                          <Progress value={facility.contribution} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* スケジュール */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  年度スケジュール
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">評価設計フェーズ</h4>
                        <p className="text-sm text-gray-600">12月〜1月</p>
                        <p className="text-sm mt-1">各施設で評価項目と配分を決定</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">承認・調整フェーズ</h4>
                        <p className="text-sm text-gray-600">2月</p>
                        <p className="text-sm mt-1">法人での承認と最終調整</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">実施フェーズ</h4>
                        <p className="text-sm text-gray-600">3月〜</p>
                        <p className="text-sm mt-1">新年度評価の開始</p>
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