'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  BookOpen,
  Target,
  Users,
  Building,
  TrendingUp,
  Download,
  Save,
  RefreshCw,
  ChevronRight,
  Award,
  Sparkles,
  Info,
  FileText,
  Settings,
  BarChart3,
  Eye,
  Edit,
  Copy
} from 'lucide-react';
import {
  corporateEvaluationItems,
  facilitySpecificItems,
  trainingPrograms,
  recommendedItemSets,
  getRecommendedSet,
  calculateTotalPoints,
  getTrainingsByItem,
  type EvaluationItem,
  type TrainingProgram
} from '@/data/evaluationItemBank';

export default function EvaluationItemBankV2() {
  const [selectedFacility, setSelectedFacility] = useState('acute');
  const [selectedRole, setSelectedRole] = useState('nurse');
  const [selectedLevel, setSelectedLevel] = useState('midlevel');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [savedSets, setSavedSets] = useState<Array<{
    id: string;
    name: string;
    items: string[];
    facility: string;
    role: string;
    level: string;
    date: string;
  }>>([]);

  // 推奨セットの取得
  const recommendedSet = getRecommendedSet(selectedFacility, selectedRole, selectedLevel);
  
  // フィルタリング
  const filteredCorporateItems = corporateEvaluationItems.filter(item =>
    (item.targetRoles.includes(selectedRole) || item.targetRoles.includes('all')) &&
    (item.targetLevels.includes(selectedLevel) || item.targetLevels.includes('all')) &&
    (searchTerm === '' || item.name.includes(searchTerm) || item.description.includes(searchTerm))
  );

  const filteredFacilityItems = facilitySpecificItems.filter(item =>
    (item.targetRoles.includes(selectedRole) || item.targetRoles.includes('all')) &&
    (item.targetLevels.includes(selectedLevel) || item.targetLevels.includes('all')) &&
    (searchTerm === '' || item.name.includes(searchTerm) || item.description.includes(searchTerm))
  );

  const totalPoints = calculateTotalPoints(selectedItems);
  const corporatePoints = selectedItems
    .filter(id => corporateEvaluationItems.some(item => item.id === id))
    .reduce((sum, id) => {
      const item = corporateEvaluationItems.find(i => i.id === id);
      return sum + (item?.points || 0);
    }, 0);
  const facilityPoints = totalPoints - corporatePoints;

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      }
      // 点数上限チェック
      const item = [...corporateEvaluationItems, ...facilitySpecificItems].find(i => i.id === itemId);
      if (item) {
        const isCorporate = corporateEvaluationItems.some(i => i.id === itemId);
        const currentPoints = isCorporate ? corporatePoints : facilityPoints;
        const maxPoints = isCorporate ? 30 : 20;
        if (currentPoints + item.points > maxPoints) {
          alert(`${isCorporate ? '法人統一項目' : '施設特化項目'}の上限（${maxPoints}点）を超えます`);
          return prev;
        }
      }
      return [...prev, itemId];
    });
  };

  const handleApplyRecommendedSet = () => {
    if (recommendedSet) {
      setSelectedItems([...recommendedSet.corporateItems, ...recommendedSet.facilityItems]);
    }
  };

  const handleSaveSet = () => {
    const name = prompt('セット名を入力してください');
    if (name) {
      const newSet = {
        id: Date.now().toString(),
        name,
        items: selectedItems,
        facility: selectedFacility,
        role: selectedRole,
        level: selectedLevel,
        date: new Date().toLocaleDateString()
      };
      setSavedSets([...savedSets, newSet]);
      alert('保存しました');
    }
  };

  const facilityLabels: Record<string, string> = {
    acute: '急性期病院',
    chronic: '慢性期病院',
    recovery: '回復期リハビリ病院',
    nursingHome: '介護老人保健施設',
    groupHome: 'グループホーム'
  };

  const roleLabels: Record<string, string> = {
    nurse: '看護師',
    assistantNurse: '准看護師',
    nursingAide: '看護補助者',
    careWorker: '介護職員',
    doctor: '医師'
  };

  const levelLabels: Record<string, string> = {
    new: '新人（1年目）',
    junior: '初級（2-3年目）',
    midlevel: '中級（4-7年目）',
    veteran: 'ベテラン（8年目以上）',
    chief: '主任・リーダー',
    manager: '管理職'
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Award className="w-10 h-10" />
              評価項目バンク管理システム
            </h1>
            <p className="mt-2 text-blue-100">
              教育研修と人事評価を連動させた戦略的人材育成プラットフォーム
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="lg">
              <Download className="w-5 h-5 mr-2" />
              エクスポート
            </Button>
            <Button variant="secondary" size="lg">
              <Settings className="w-5 h-5 mr-2" />
              設定
            </Button>
          </div>
        </div>
      </div>

      {/* 統計サマリー */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">登録項目数</p>
                <p className="text-2xl font-bold">
                  {corporateEvaluationItems.length + facilitySpecificItems.length}
                </p>
              </div>
              <FileText className="w-10 h-10 text-blue-500" />
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
              <BookOpen className="w-10 h-10 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">推奨セット数</p>
                <p className="text-2xl font-bold">{recommendedItemSets.length}</p>
              </div>
              <Sparkles className="w-10 h-10 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">保存済みセット</p>
                <p className="text-2xl font-bold">{savedSets.length}</p>
              </div>
              <Save className="w-10 h-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* メインコンテンツ */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            概要
          </TabsTrigger>
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            項目検索
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
                <CardTitle>システム概要</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">評価構成（100点満点）</h4>
                    <ul className="mt-2 space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        技術評価（50点）= 法人統一（30点）+ 施設特化（20点）
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        施設評価（25点）
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        法人評価（25点）
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">運用フロー</h4>
                  <div className="space-y-2">
                    {['項目選択', '研修実施', '評価実施', '改善計画'].map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold">
                          {idx + 1}
                        </div>
                        <span className="text-sm">{step}</span>
                        {idx < 3 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>クイックアクション</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('select')}>
                  <Target className="w-4 h-4 mr-2" />
                  新規評価セットを作成
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={handleApplyRecommendedSet}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  推奨セットを適用
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Copy className="w-4 h-4 mr-2" />
                  既存セットを複製
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  評価結果を分析
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 最近の活動 */}
          <Card>
            <CardHeader>
              <CardTitle>最近の更新</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge>新規</Badge>
                    <span className="text-sm">急性期病院 看護師向けセットを作成</span>
                  </div>
                  <span className="text-sm text-muted-foreground">2時間前</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">更新</Badge>
                    <span className="text-sm">慢性期病院 介護職向けセットを修正</span>
                  </div>
                  <span className="text-sm text-muted-foreground">昨日</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 項目選択タブ */}
        <TabsContent value="select" className="space-y-6">
          {/* フィルター */}
          <Card>
            <CardHeader>
              <CardTitle>フィルター設定</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>施設種別</Label>
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
                <div>
                  <Label>職種</Label>
                  <select 
                    className="w-full mt-1 p-2 border rounded-md"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    {Object.entries(roleLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>経験レベル</Label>
                  <select 
                    className="w-full mt-1 p-2 border rounded-md"
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                  >
                    {Object.entries(levelLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 選択状況 */}
          <div className="grid grid-cols-3 gap-4">
            <Card className={corporatePoints > 30 ? 'border-red-500' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">法人統一項目</span>
                  <span className={`text-lg font-bold ${corporatePoints > 30 ? 'text-red-500' : ''}`}>
                    {corporatePoints} / 30点
                  </span>
                </div>
                <Progress value={(corporatePoints / 30) * 100} className="h-2" />
              </CardContent>
            </Card>
            <Card className={facilityPoints > 20 ? 'border-red-500' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">施設特化項目</span>
                  <span className={`text-lg font-bold ${facilityPoints > 20 ? 'text-red-500' : ''}`}>
                    {facilityPoints} / 20点
                  </span>
                </div>
                <Progress value={(facilityPoints / 20) * 100} className="h-2" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">合計</span>
                  <span className="text-lg font-bold text-green-600">
                    {totalPoints} / 50点
                  </span>
                </div>
                <Progress value={(totalPoints / 50) * 100} className="h-2" />
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
                  法人統一項目（必須）
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredCorporateItems.map(item => (
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

            {/* 施設特化項目 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  施設特化項目（選択）
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
            <Button onClick={handleSaveSet}>
              <Save className="w-4 h-4 mr-2" />
              セットを保存
            </Button>
          </div>
        </TabsContent>

        {/* 研修連携タブ */}
        <TabsContent value="mapping" className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>研修マッピング</AlertTitle>
            <AlertDescription>
              選択した評価項目に必要な研修プログラムが自動的に表示されます。
              各研修の受講により、対応する評価項目の達成度が向上します。
            </AlertDescription>
          </Alert>

          {selectedItems.length > 0 ? (
            <div className="space-y-4">
              {selectedItems.map(itemId => {
                const item = [...corporateEvaluationItems, ...facilitySpecificItems]
                  .find(i => i.id === itemId);
                const trainings = getTrainingsByItem(itemId);
                
                if (!item) return null;
                
                return (
                  <Card key={itemId}>
                    <CardHeader>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {trainings.map(training => (
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
                            <Badge variant={training.mandatory ? "default" : "secondary"}>
                              {training.mandatory ? "必須" : "推奨"}
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
                <CardTitle>項目選択傾向</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>医療安全</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>感染対策</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>身体拘束適正化</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>研修実施状況</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">法定研修完了率</span>
                    <span className="text-2xl font-bold text-green-600">94%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">選択研修参加率</span>
                    <span className="text-2xl font-bold text-blue-600">67%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">平均理解度</span>
                    <span className="text-2xl font-bold text-purple-600">82%</span>
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