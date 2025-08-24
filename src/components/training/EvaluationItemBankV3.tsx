'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  CheckCircle2, 
  AlertCircle,
  BookOpen,
  Target,
  Building,
  Download,
  Save,
  RefreshCw,
  Award,
  Info,
  FileText,
  BarChart3,
  Eye,
  Users
} from 'lucide-react';
import { TrainingIntegrationService } from '@/services/trainingIntegrationService';

// V3評価システム対応の評価項目定義
const v3EvaluationItems = {
  coreItems: [
    {
      id: 'v3_core_001',
      name: '医療安全管理',
      description: 'インシデント報告・分析・改善活動への参加',
      points: 8,
      category: 'safety',
      requiredTrainings: ['medical_safety']
    },
    {
      id: 'v3_core_002', 
      name: '感染制御',
      description: '標準予防策の実践・感染対策の遵守',
      points: 8,
      category: 'infection_control',
      requiredTrainings: ['infection_control']
    },
    {
      id: 'v3_core_003',
      name: '業務手順遵守',
      description: '施設の標準業務手順書に基づく業務実施',
      points: 6,
      category: 'procedure',
      requiredTrainings: ['procedure_training']
    },
    {
      id: 'v3_core_004',
      name: 'チーム医療',
      description: '多職種連携・チームワークの発揮',
      points: 8,
      category: 'teamwork',
      requiredTrainings: ['team_medicine']
    },
    {
      id: 'v3_core_005',
      name: '患者対応',
      description: '患者・家族への適切なコミュニケーション',
      points: 6,
      category: 'communication',
      requiredTrainings: ['communication']
    },
    {
      id: 'v3_core_006',
      name: '継続学習',
      description: '自己研鑽・スキルアップへの取り組み',
      points: 6,
      category: 'learning',
      requiredTrainings: ['self_development']
    },
    {
      id: 'v3_core_007',
      name: '法令遵守',
      description: '医療関連法規・倫理規範の遵守',
      points: 8,
      category: 'compliance',
      requiredTrainings: ['legal_compliance']
    }
  ],
  facilityItems: [
    {
      id: 'v3_facility_001',
      name: '救急対応',
      description: '緊急時の迅速・適切な対応',
      points: 10,
      category: 'emergency',
      facilityType: 'acute',
      requiredTrainings: ['emergency_response']
    },
    {
      id: 'v3_facility_002',
      name: 'リハビリ支援',
      description: 'ADL向上・機能訓練の支援',
      points: 10,
      category: 'rehabilitation',
      facilityType: 'recovery',
      requiredTrainings: ['rehabilitation_support']
    },
    {
      id: 'v3_facility_003',
      name: '認知症ケア',
      description: '認知症患者への専門的ケア',
      points: 10,
      category: 'dementia_care',
      facilityType: 'chronic',
      requiredTrainings: ['dementia_care']
    },
    {
      id: 'v3_facility_004',
      name: '生活支援',
      description: '日常生活支援・介護サービス提供',
      points: 8,
      category: 'life_support',
      facilityType: 'nursingHome',
      requiredTrainings: ['life_support']
    }
  ]
};

// 研修プログラム定義
const trainingPrograms = [
  { id: 'medical_safety', name: '医療安全研修', duration: '2時間', frequency: '年2回', type: 'mandatory' },
  { id: 'infection_control', name: '感染制御研修', duration: '2時間', frequency: '年2回', type: 'mandatory' },
  { id: 'emergency_response', name: '救急対応研修', duration: '4時間', frequency: '年1回', type: 'mandatory' },
  { id: 'team_medicine', name: 'チーム医療研修', duration: '3時間', frequency: '年1回', type: 'recommended' },
  { id: 'communication', name: 'コミュニケーション研修', duration: '2時間', frequency: '年1回', type: 'recommended' },
  { id: 'dementia_care', name: '認知症ケア研修', duration: '4時間', frequency: '年1回', type: 'specialized' }
];

export default function EvaluationItemBankV3() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedFacility, setSelectedFacility] = useState('acute');
  const [activeTab, setActiveTab] = useState('overview');

  // 施設種別に応じた項目フィルタリング
  const filteredFacilityItems = v3EvaluationItems.facilityItems.filter(
    item => item.facilityType === selectedFacility
  );

  // 選択された項目の点数計算
  const corePoints = selectedItems
    .filter(id => v3EvaluationItems.coreItems.some(item => item.id === id))
    .reduce((sum, id) => {
      const item = v3EvaluationItems.coreItems.find(i => i.id === id);
      return sum + (item?.points || 0);
    }, 0);

  const facilityPoints = selectedItems
    .filter(id => filteredFacilityItems.some(item => item.id === id))
    .reduce((sum, id) => {
      const item = filteredFacilityItems.find(i => i.id === id);
      return sum + (item?.points || 0);
    }, 0);

  const totalTechnicalPoints = corePoints + facilityPoints;

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      }
      
      // V3システムの制限チェック（技術評価50点まで）
      const item = [...v3EvaluationItems.coreItems, ...filteredFacilityItems]
        .find(i => i.id === itemId);
      if (item && totalTechnicalPoints + item.points > 50) {
        alert('技術評価の上限（50点）を超えます');
        return prev;
      }
      
      return [...prev, itemId];
    });
  };

  const getTrainingsByItem = (itemId: string) => {
    const item = [...v3EvaluationItems.coreItems, ...filteredFacilityItems]
      .find(i => i.id === itemId);
    return item?.requiredTrainings?.map(trainingId => 
      trainingPrograms.find(t => t.id === trainingId)
    ).filter(Boolean) || [];
  };

  const facilityLabels: Record<string, string> = {
    acute: '急性期病院',
    chronic: '慢性期病院', 
    recovery: '回復期リハビリ病院',
    nursingHome: '介護老人保健施設'
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Award className="w-10 h-10" />
              評価項目バンク（研修連携）
            </h1>
            <p className="mt-2 text-green-100">
              評価システム（100点満点制）対応の評価項目管理
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="lg">
              <Download className="w-5 h-5 mr-2" />
              エクスポート
            </Button>
          </div>
        </div>
      </div>

      {/* V3システム概要 */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>評価システム（100点満点制）</AlertTitle>
        <AlertDescription>
          技術評価50点（法人統一30点+施設固有20点）+ 施設内貢献25点 + 法人内貢献25点 = 総合100点
        </AlertDescription>
      </Alert>

      {/* 統計サマリー */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">法人統一項目</p>
                <p className="text-2xl font-bold">{v3EvaluationItems.coreItems.length}</p>
              </div>
              <Building className="w-10 h-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">施設固有項目</p>
                <p className="text-2xl font-bold">{filteredFacilityItems.length}</p>
              </div>
              <Target className="w-10 h-10 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">連携研修数</p>
                <p className="text-2xl font-bold">{trainingPrograms.length}</p>
              </div>
              <BookOpen className="w-10 h-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">選択済み項目</p>
                <p className="text-2xl font-bold">{selectedItems.length}</p>
              </div>
              <CheckCircle2 className="w-10 h-10 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* メインコンテンツ */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            概要
          </TabsTrigger>
          <TabsTrigger value="select" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            項目選択
          </TabsTrigger>
          <TabsTrigger value="mapping" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            研修連携
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            分析
          </TabsTrigger>
        </TabsList>

        {/* 概要タブ */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>V3システム技術評価</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">技術評価構成（50点満点）</h4>
                    <ul className="mt-2 space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        法人統一項目（最大30点）
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        施設固有項目（最大20点）
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>施設設定</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="text-sm font-medium">施設種別</label>
                  <select 
                    className="w-full mt-1 p-2 border rounded-md"
                    value={selectedFacility}
                    onChange={(e) => setSelectedFacility(e.target.value)}
                  >
                    {Object.entries(facilityLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 項目選択タブ */}
        <TabsContent value="select" className="space-y-6">
          {/* 選択状況 */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">法人統一項目</span>
                  <span className="text-lg font-bold">{corePoints} / 30点</span>
                </div>
                <Progress value={(corePoints / 30) * 100} className="h-2" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">施設固有項目</span>
                  <span className="text-lg font-bold">{facilityPoints} / 20点</span>
                </div>
                <Progress value={(facilityPoints / 20) * 100} className="h-2" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">技術評価合計</span>
                  <span className="text-lg font-bold text-green-600">{totalTechnicalPoints} / 50点</span>
                </div>
                <Progress value={(totalTechnicalPoints / 50) * 100} className="h-2" />
              </CardContent>
            </Card>
          </div>

          {/* 項目リスト */}
          <div className="grid grid-cols-2 gap-6">
            {/* 法人統一項目 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  法人統一項目
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {v3EvaluationItems.coreItems.map(item => (
                    <div 
                      key={item.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedItems.includes(item.id) 
                          ? 'bg-blue-50 border-blue-500' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleItemSelect(item.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {selectedItems.includes(item.id) && 
                              <CheckCircle2 className="w-4 h-4 text-blue-500" />
                            }
                            <span className="font-medium">{item.name}</span>
                            <Badge variant="secondary">{item.points}点</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.description}
                          </p>
                          {item.requiredTrainings && item.requiredTrainings.length > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                              <BookOpen className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                研修: {item.requiredTrainings.length}件
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 施設固有項目 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  施設固有項目（{facilityLabels[selectedFacility]}）
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredFacilityItems.map(item => (
                    <div 
                      key={item.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedItems.includes(item.id) 
                          ? 'bg-green-50 border-green-500' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleItemSelect(item.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {selectedItems.includes(item.id) && 
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            }
                            <span className="font-medium">{item.name}</span>
                            <Badge variant="secondary">{item.points}点</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.description}
                          </p>
                          {item.requiredTrainings && item.requiredTrainings.length > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                              <BookOpen className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                研修: {item.requiredTrainings.length}件
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* アクションボタン */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setSelectedItems([])}>
              <RefreshCw className="w-4 h-4 mr-2" />
              リセット
            </Button>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              セットを保存
            </Button>
          </div>
        </TabsContent>

        {/* 研修連携タブ */}
        <TabsContent value="mapping" className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>V3研修マッピング</AlertTitle>
            <AlertDescription>
              選択した評価項目に必要な研修プログラムが自動的に表示されます。
              V3システムでは技術評価と研修実績が直接連動します。
            </AlertDescription>
          </Alert>

          {selectedItems.length > 0 ? (
            <div className="space-y-4">
              {selectedItems.map(itemId => {
                const item = [...v3EvaluationItems.coreItems, ...filteredFacilityItems]
                  .find(i => i.id === itemId);
                const trainings = getTrainingsByItem(itemId);
                
                if (!item) return null;
                
                return (
                  <Card key={itemId}>
                    <CardHeader>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <div className="text-sm text-muted-foreground">
                        {item.description} ({item.points}点)
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {trainings.map((training: any) => (
                          <div key={training.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <BookOpen className="w-4 h-4 text-blue-500" />
                              <div>
                                <p className="font-medium text-sm">{training.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {training.duration} | {training.frequency}
                                </p>
                              </div>
                            </div>
                            <Badge variant={training.type === 'mandatory' ? "default" : "secondary"}>
                              {training.type === 'mandatory' ? "必須" : 
                               training.type === 'recommended' ? "推奨" : "専門"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Target className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-muted-foreground">
                  評価項目を選択すると、必要な研修が表示されます
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 分析タブ */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>V3項目カテゴリ分析</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>医療安全</span>
                      <span>90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>感染制御</span>
                      <span>95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>チーム医療</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>V3研修連携状況</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">法定研修完了率</span>
                    <span className="text-2xl font-bold text-green-600">98%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">推奨研修参加率</span>
                    <span className="text-2xl font-bold text-blue-600">72%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">専門研修参加率</span>
                    <span className="text-2xl font-bold text-purple-600">58%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}