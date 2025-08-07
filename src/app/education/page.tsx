'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  BarChart3
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
        <Link href="/education/planning">
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
        </Link>

        <Link href="/education/tracking">
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
        </Link>

        <Link href="/evaluation/config">
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

      <Tabs defaultValue="programs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="programs">研修プログラム</TabsTrigger>
          <TabsTrigger value="mapping">評価項目マッピング</TabsTrigger>
          <TabsTrigger value="analytics">分析・レポート</TabsTrigger>
        </TabsList>

        {/* 研修プログラムタブ */}
        <TabsContent value="programs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                研修プログラム一覧
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* フィルター */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">施設種別</label>
                  <select 
                    className="w-full px-3 py-2 border rounded-md"
                    value={selectedFacility}
                    onChange={(e) => setSelectedFacility(e.target.value)}
                  >
                    {Object.entries(facilityTypeNames).map(([key, name]) => (
                      <option key={key} value={key}>{name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">職種</label>
                  <select 
                    className="w-full px-3 py-2 border rounded-md"
                    value={selectedJob}
                    onChange={(e) => setSelectedJob(e.target.value)}
                  >
                    {Object.entries(jobCategoryNames).map(([key, name]) => (
                      <option key={key} value={key}>{name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">経験レベル</label>
                  <select 
                    className="w-full px-3 py-2 border rounded-md"
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                  >
                    {Object.entries(experienceLevelNames).map(([key, name]) => (
                      <option key={key} value={key}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* プログラムリスト */}
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
                          <Badge className={getTypeColor(program.type)}>
                            {program.type}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{program.duration}時間</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{program.schedule}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{program.participants}名</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            <span>完了率: {program.completionRate}%</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">関連評価項目: </span>
                          {program.requiredFor.map(item => (
                            <Badge key={item} variant="outline" className="text-xs ml-1">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        詳細
                      </Button>
                    </div>
                    {program.status === 'ongoing' && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${program.completionRate}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 評価項目マッピングタブ */}
        <TabsContent value="mapping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                評価項目と研修プログラムのマッピング
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  評価項目の達成に必要な研修を設定することで、評価結果に基づいた自動的な研修推奨が可能になります。
                </AlertDescription>
              </Alert>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">評価項目</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">必須研修</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">推奨研修</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">対象者数</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">受講率</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-blue-500" />
                          専門技術・スキル
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="outline">基礎看護技術研修</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="outline">専門技術研修</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-center">45</td>
                      <td className="px-4 py-3 text-sm text-center">
                        <span className="text-green-600 font-medium">100%</span>
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-green-500" />
                          安全・品質管理
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="outline">医療安全管理研修</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="outline">感染対策研修</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-center">120</td>
                      <td className="px-4 py-3 text-sm text-center">
                        <span className="text-yellow-600 font-medium">85%</span>
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-purple-500" />
                          教育・指導
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="outline">プリセプター養成研修</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="outline">コーチング研修</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-center">15</td>
                      <td className="px-4 py-3 text-sm text-center">
                        <span className="text-gray-600 font-medium">0%</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-end">
                <Button className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  マッピング設定を編集
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 分析・レポートタブ */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">年間研修実施率</span>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold">78.5%</div>
                <div className="text-sm text-green-600">+5.2% 前年比</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">受講完了者数</span>
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
                <div className="text-2xl font-bold">342名</div>
                <div className="text-sm text-gray-600">全職員の68%</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">研修効果測定</span>
                  <BarChart3 className="h-4 w-4 text-purple-500" />
                </div>
                <div className="text-2xl font-bold">4.2/5.0</div>
                <div className="text-sm text-gray-600">満足度スコア</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>施設別研修進捗</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(facilityTypeNames).map(([key, name]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{name}</span>
                      <span className="text-sm text-gray-600">75%</span>
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