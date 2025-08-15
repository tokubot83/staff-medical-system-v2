'use client';

import React, { useState } from 'react';
import { ArrowLeft, Save, Info, Settings, Award, Shield, Users } from 'lucide-react';
import Link from 'next/link';
import CommonHeader from '@/components/CommonHeader';
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
      <CommonHeader title="法人統一項目設計" />
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6">
          <Link href="/evaluation-design">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              評価制度設計に戻る
            </Button>
          </Link>
        </div>

        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            法人統一項目（30点）は全施設共通の評価項目です。上司評価と本人評価の配分比率を調整できます。
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左側：項目リスト */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">評価項目（30点）</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical">
                  <TabsList className="flex flex-col h-full w-full">
                    {coreItems.map((item) => (
                      <TabsTrigger
                        key={item.itemCode}
                        value={item.itemCode}
                        className="w-full justify-start px-4 py-3 data-[state=active]:bg-blue-50"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            {item.itemCode === 'C01' && <Award className="w-4 h-4 text-blue-600" />}
                            {item.itemCode === 'C02' && <Users className="w-4 h-4 text-green-600" />}
                            {item.itemCode === 'C03' && <Shield className="w-4 h-4 text-red-600" />}
                            <div className="text-left">
                              <div className="font-medium">{item.itemCode}</div>
                              <div className="text-xs text-gray-600">{item.itemName}</div>
                            </div>
                          </div>
                          <Badge variant="secondary">{item.totalPoints}点</Badge>
                        </div>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">配点サマリー</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {coreItems.map((item) => (
                  <div key={item.itemCode} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{item.itemCode}: {item.itemName}</span>
                      <span className="font-medium">{item.totalPoints}点</span>
                    </div>
                    <Progress value={(item.totalPoints / 30) * 100} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>上司: {(item.totalPoints * item.superiorRatio / 100).toFixed(1)}点</span>
                      <span>本人: {(item.totalPoints * item.selfRatio / 100).toFixed(1)}点</span>
                    </div>
                  </div>
                ))}
                <div className="pt-3 border-t">
                  <div className="flex justify-between font-medium">
                    <span>合計</span>
                    <span>30点</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右側：詳細設定 */}
          <div className="lg:col-span-2">
            {getActiveItem() && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {activeTab === 'C01' && <Award className="w-5 h-5 text-blue-600" />}
                    {activeTab === 'C02' && <Users className="w-5 h-5 text-green-600" />}
                    {activeTab === 'C03' && <Shield className="w-5 h-5 text-red-600" />}
                    {getActiveItem()?.itemCode}: {getActiveItem()?.itemName}
                  </CardTitle>
                  <CardDescription>
                    配点: {getActiveItem()?.totalPoints}点
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 評価者配分 */}
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      評価者配分
                    </h3>
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
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
                  <div className="space-y-4">
                    <h3 className="font-medium">評価項目詳細</h3>
                    <div className="space-y-4">
                      {getActiveItem()?.subItems.map((subItem) => (
                        <div key={subItem.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium">{subItem.id}: {subItem.name}</h4>
                              <Badge variant="outline" className="mt-1">{subItem.points}点</Badge>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-2">評価基準</h5>
                              <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
                                {subItem.criteria.map((criterion, idx) => (
                                  <li key={idx}>{criterion}</li>
                                ))}
                              </ul>
                            </div>
                            
                            {subItem.requiredTrainings && (
                              <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-2">必須研修</h5>
                                <div className="flex flex-wrap gap-2">
                                  {subItem.requiredTrainings.map((training, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
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