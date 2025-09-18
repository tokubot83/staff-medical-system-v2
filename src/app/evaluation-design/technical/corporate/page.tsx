'use client';

import React, { useState } from 'react';
import { ArrowLeft, Save, Info, Settings, Award, Shield, Users, ListChecks, BarChart3, CheckCircle, BookOpen, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface CoreItemConfig {
  itemCode: string;
  itemName: string;
  totalPoints: number;
  superiorRatio: number;
  selfRatio: number;
  subItems: SubItemConfig[];
}

interface SubItemConfig {
  id: string;
  name: string;
  points: number;
  criteria: string[];
  requiredTrainings?: string[];
}

export default function CorporateTechnicalPage() {
  const [coreItems, setCoreItems] = useState<CoreItemConfig[]>([
    {
      itemCode: 'C01',
      itemName: '専門技術・スキル',
      totalPoints: 10,
      superiorRatio: 70,
      selfRatio: 30,
      subItems: [
        {
          id: 'C01-1',
          name: '基本技術',
          points: 4,
          criteria: [
            '職種別基本手技の習得と実践',
            '標準手順の理解と遵守',
            '必要な資格・認定の取得'
          ],
          requiredTrainings: ['基礎技術研修', '基本手技研修']
        },
        {
          id: 'C01-2',
          name: '応用技術',
          points: 3,
          criteria: [
            '経験レベルに応じた高度技術の習得',
            '困難事例への対応力',
            '技術改善の提案と実践'
          ],
          requiredTrainings: ['応用技術研修']
        },
        {
          id: 'C01-3',
          name: '記録・報告',
          points: 3,
          criteria: [
            '看護記録・カルテの正確な記載',
            'インシデント報告の適切な実施',
            '申し送り・情報共有の質',
            '書類作成の迅速性と正確性'
          ],
          requiredTrainings: ['記録管理研修']
        }
      ]
    },
    {
      itemCode: 'C02',
      itemName: '対人関係・ケア',
      totalPoints: 10,
      superiorRatio: 50,
      selfRatio: 50,
      subItems: [
        {
          id: 'C02-1',
          name: '基本的対応',
          points: 5,
          criteria: [
            '丁寧な接遇とコミュニケーション',
            '傾聴と共感的理解',
            '患者・家族への適切な説明',
            'チーム内での円滑な連携'
          ],
          requiredTrainings: ['コミュニケーション研修']
        },
        {
          id: 'C02-2',
          name: '権利擁護',
          points: 5,
          criteria: [
            '尊厳を守る声かけと対応',
            '虐待防止への意識と実践',
            'プライバシーの保護',
            '意思決定支援の実施'
          ],
          requiredTrainings: ['虐待防止研修（法定・年1回必須）']
        }
      ]
    },
    {
      itemCode: 'C03',
      itemName: '安全・品質管理',
      totalPoints: 10,
      superiorRatio: 80,
      selfRatio: 20,
      subItems: [
        {
          id: 'C03-1',
          name: '医療安全',
          points: 3,
          criteria: [
            '医療安全研修の受講（年2回必須）',
            'KYT（危険予知トレーニング）の実践',
            '安全確認行動（指差呼称等）の実施',
            'ヒヤリハット事例の共有'
          ],
          requiredTrainings: ['医療安全研修（法定・年2回必須）']
        },
        {
          id: 'C03-2',
          name: '感染対策',
          points: 3,
          criteria: [
            '感染対策研修の受講（年2回必須）',
            '標準予防策の確実な実施',
            '手指衛生5つのタイミングの遵守',
            'PPE（個人防護具）の適切な使用'
          ],
          requiredTrainings: ['感染対策研修（法定・年2回必須）']
        },
        {
          id: 'C03-3',
          name: '身体拘束適正化',
          points: 2,
          criteria: [
            '身体拘束適正化研修の受講（年2回必須）',
            '身体拘束の3原則の理解',
            '代替ケアの提案と実践',
            '適切な記録の作成'
          ],
          requiredTrainings: ['身体拘束適正化研修（法定・年2回必須）']
        },
        {
          id: 'C03-4',
          name: '情報管理・BCP',
          points: 2,
          criteria: [
            '個人情報保護研修の受講（年1回必須）',
            '守秘義務の遵守',
            'BCP訓練への参加',
            '災害時対応の理解'
          ],
          requiredTrainings: ['個人情報保護研修（法定・年1回必須）', 'BCP研修']
        }
      ]
    }
  ]);

  const [activeTab, setActiveTab] = useState('C01');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleRatioChange = (itemCode: string, value: number[]) => {
    setCoreItems(prev => prev.map(item => {
      if (item.itemCode === itemCode) {
        return {
          ...item,
          superiorRatio: value[0],
          selfRatio: 100 - value[0]
        };
      }
      return item;
    }));
  };

  const handleSave = () => {
    setSaveStatus('saving');
    // ここで実際の保存処理を実装
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const getActiveItem = () => coreItems.find(item => item.itemCode === activeTab);

  return (
    <div>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6">
          <Link href="/evaluation-design">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              評価制度設計に戻る
            </Button>
          </Link>
        </div>

        {/* メインヘッダーカード */}
        <Card className="mb-6 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">法人統一評価項目の設計</CardTitle>
                  <CardDescription className="mt-1">
                    全施設共通の評価基準（30点満点）を設定します
                  </CardDescription>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-800" variant="secondary">必須設定</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">専門技術</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">10点</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">対人関係</span>
                </div>
                <p className="text-2xl font-bold text-green-600">10点</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-medium text-gray-700">安全管理</span>
                </div>
                <p className="text-2xl font-bold text-red-600">10点</p>
              </div>
            </div>
            <Alert className="mt-4 border-blue-200 bg-blue-50/50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                上司評価と本人評価の配分比率を項目ごとに調整できます。法定研修の受講状況も評価に反映されます。
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左側：項目リスト */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-br from-gray-50 to-gray-100">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-gray-700" />
                  評価項目一覧
                </CardTitle>
                <CardDescription>項目を選択して詳細を設定</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical">
                  <TabsList className="flex flex-col h-full w-full">
                    {coreItems.map((item) => (
                      <TabsTrigger
                        key={item.itemCode}
                        value={item.itemCode}
                        className="w-full justify-start px-4 py-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-50 data-[state=active]:to-indigo-50 data-[state=active]:border-l-4 data-[state=active]:border-blue-500 hover:bg-gray-50 transition-all"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              item.itemCode === 'C01' ? 'bg-blue-100' : 
                              item.itemCode === 'C02' ? 'bg-green-100' : 
                              'bg-red-100'
                            }`}>
                              {item.itemCode === 'C01' && <Award className="w-5 h-5 text-blue-600" />}
                              {item.itemCode === 'C02' && <Users className="w-5 h-5 text-green-600" />}
                              {item.itemCode === 'C03' && <Shield className="w-5 h-5 text-red-600" />}
                            </div>
                            <div className="text-left">
                              <div className="font-bold text-gray-800">{item.itemCode}</div>
                              <div className="text-sm text-gray-600">{item.itemName}</div>
                            </div>
                          </div>
                          <Badge className={`${
                            item.itemCode === 'C01' ? 'bg-blue-100 text-blue-800' : 
                            item.itemCode === 'C02' ? 'bg-green-100 text-green-800' : 
                            'bg-red-100 text-red-800'
                          }`} variant="secondary">{item.totalPoints}点</Badge>
                        </div>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  配点サマリー
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {coreItems.map((item) => (
                  <div key={item.itemCode} className="p-3 bg-white rounded-lg border border-purple-100">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        {item.itemCode === 'C01' && <Award className="w-4 h-4 text-blue-600" />}
                        {item.itemCode === 'C02' && <Users className="w-4 h-4 text-green-600" />}
                        {item.itemCode === 'C03' && <Shield className="w-4 h-4 text-red-600" />}
                        <span className="font-medium text-gray-700">{item.itemName}</span>
                      </div>
                      <span className="font-bold text-gray-900">{item.totalPoints}点</span>
                    </div>
                    <Progress value={(item.totalPoints / 30) * 100} className={`h-3 ${
                      item.itemCode === 'C01' ? 'bg-blue-100' : 
                      item.itemCode === 'C02' ? 'bg-green-100' : 
                      'bg-red-100'
                    }`} />
                    <div className="flex justify-between text-xs text-gray-600 mt-2">
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        上司: {(item.totalPoints * item.superiorRatio / 100).toFixed(1)}点
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        本人: {(item.totalPoints * item.selfRatio / 100).toFixed(1)}点
                      </span>
                    </div>
                  </div>
                ))}
                <div className="pt-3 mt-3 border-t-2 border-purple-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-purple-800">合計配点</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-purple-600">30</span>
                      <span className="text-sm text-purple-600">点</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右側：詳細設定 */}
          <div className="lg:col-span-2">
            {getActiveItem() && (
              <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className={`${
                  activeTab === 'C01' ? 'bg-gradient-to-r from-blue-50 to-blue-100' : 
                  activeTab === 'C02' ? 'bg-gradient-to-r from-green-50 to-green-100' : 
                  'bg-gradient-to-r from-red-50 to-red-100'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${
                        activeTab === 'C01' ? 'bg-blue-500' : 
                        activeTab === 'C02' ? 'bg-green-500' : 
                        'bg-red-500'
                      }`}>
                        {activeTab === 'C01' && <Award className="w-6 h-6 text-white" />}
                        {activeTab === 'C02' && <Users className="w-6 h-6 text-white" />}
                        {activeTab === 'C03' && <Shield className="w-6 h-6 text-white" />}
                      </div>
                      <div>
                        <CardTitle className="text-xl">
                          {getActiveItem()?.itemCode}: {getActiveItem()?.itemName}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          この項目の詳細設定を行います
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={`text-lg px-4 py-2 ${
                      activeTab === 'C01' ? 'bg-blue-500 text-white' : 
                      activeTab === 'C02' ? 'bg-green-500 text-white' : 
                      'bg-red-500 text-white'
                    }`} variant="secondary">
                      {getActiveItem()?.totalPoints}点
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 評価者配分 */}
                  <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                      <Settings className="w-5 h-5 text-gray-700" />
                      評価者配分設定
                    </h3>
                    <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>上司評価</span>
                          <span className="font-medium">
                            {getActiveItem()?.superiorRatio}% 
                            ({(getActiveItem()!.totalPoints * getActiveItem()!.superiorRatio / 100).toFixed(1)}点)
                          </span>
                        </div>
                        <Slider
                          value={[getActiveItem()!.superiorRatio]}
                          onValueChange={(value) => handleRatioChange(activeTab, value)}
                          max={100}
                          min={0}
                          step={10}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>本人評価</span>
                          <span className="font-medium">
                            {getActiveItem()?.selfRatio}%
                            ({(getActiveItem()!.totalPoints * getActiveItem()!.selfRatio / 100).toFixed(1)}点)
                          </span>
                        </div>
                        <Progress value={getActiveItem()?.selfRatio} className="h-2" />
                      </div>
                    </div>
                  </div>

                  {/* 中項目 */}
                  <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                      <ListChecks className="w-5 h-5 text-gray-700" />
                      評価項目詳細
                    </h3>
                    <div className="space-y-4">
                      {getActiveItem()?.subItems.map((subItem, index) => (
                        <div key={subItem.id} className={`bg-white rounded-lg p-5 border-2 hover:shadow-md transition-shadow ${
                          activeTab === 'C01' ? 'border-blue-200 hover:border-blue-300' : 
                          activeTab === 'C02' ? 'border-green-200 hover:border-green-300' : 
                          'border-red-200 hover:border-red-300'
                        }`}>
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${
                                activeTab === 'C01' ? 'bg-blue-100' : 
                                activeTab === 'C02' ? 'bg-green-100' : 
                                'bg-red-100'
                              }`}>
                                <span className={`text-lg font-bold ${
                                  activeTab === 'C01' ? 'text-blue-600' : 
                                  activeTab === 'C02' ? 'text-green-600' : 
                                  'text-red-600'
                                }`}>{index + 1}</span>
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-800">{subItem.name}</h4>
                                <span className="text-sm text-gray-500">{subItem.id}</span>
                              </div>
                            </div>
                            <Badge className={`text-lg px-3 py-1 ${
                              activeTab === 'C01' ? 'bg-blue-100 text-blue-800' : 
                              activeTab === 'C02' ? 'bg-green-100 text-green-800' : 
                              'bg-red-100 text-red-800'
                            }`} variant="secondary">{subItem.points}点</Badge>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <h5 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-gray-600" />
                                評価基準
                              </h5>
                              <ul className="space-y-2">
                                {subItem.criteria.map((criterion, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                                      activeTab === 'C01' ? 'bg-blue-500' : 
                                      activeTab === 'C02' ? 'bg-green-500' : 
                                      'bg-red-500'
                                    }`}></div>
                                    <span className="text-sm text-gray-700">{criterion}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            {subItem.requiredTrainings && (
                              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <h5 className="text-sm font-bold text-yellow-800 mb-3 flex items-center gap-2">
                                  <BookOpen className="w-4 h-4" />
                                  必須研修
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {subItem.requiredTrainings.map((training, idx) => (
                                    <Badge key={idx} className="bg-yellow-100 text-yellow-800 border border-yellow-300">
                                      {training.includes('法定') && <AlertCircle className="w-3 h-3 mr-1" />}
                                      {training}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* 保存ボタン */}
        <div className="fixed bottom-6 right-6">
          <Button 
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            size="lg"
            className="shadow-lg"
          >
            {saveStatus === 'saving' ? (
              <>保存中...</>
            ) : saveStatus === 'saved' ? (
              <>✓ 保存しました</>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                設定を保存
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}