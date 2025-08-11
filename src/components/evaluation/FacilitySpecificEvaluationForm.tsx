'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle2, 
  AlertCircle, 
  Target,
  Building,
  Users,
  Sparkles,
  Save,
  RefreshCw
} from 'lucide-react';
import {
  facilitySpecificItemsV2,
  isItemSelectable,
  getRecommendedFacilityItems,
  calculateSelectedPoints,
  getRemainingPoints,
  type FacilitySpecificItem
} from '@/data/facilitySpecificItemsV2';

interface Props {
  facilityType: string;
  jobCategory: string;
  experienceLevel: string;
  employeeId: string;
  employeeName: string;
  evaluationPeriod: string;
}

export default function FacilitySpecificEvaluationForm({
  facilityType,
  jobCategory,
  experienceLevel,
  employeeId,
  employeeName,
  evaluationPeriod
}: Props) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [evaluationScores, setEvaluationScores] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState('select');
  const [saved, setSaved] = useState(false);

  // 選択可能な項目をフィルタリング
  const selectableItems = facilitySpecificItemsV2.filter(item =>
    isItemSelectable(item, facilityType, jobCategory, experienceLevel)
  );

  // 推奨セットの取得
  const recommendedItems = getRecommendedFacilityItems(facilityType, jobCategory, experienceLevel);

  // カテゴリ別に項目を整理
  const itemsByCategory = selectableItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, FacilitySpecificItem[]>);

  // 現在の合計点数と残り点数
  const currentPoints = calculateSelectedPoints(selectedItems);
  const remainingPoints = getRemainingPoints(selectedItems);

  // 項目選択の処理
  const handleItemSelection = (itemId: string) => {
    const item = facilitySpecificItemsV2.find(i => i.id === itemId);
    if (!item) return;

    if (selectedItems.includes(itemId)) {
      // 選択解除
      setSelectedItems(prev => prev.filter(id => id !== itemId));
      setEvaluationScores(prev => {
        const newScores = { ...prev };
        delete newScores[itemId];
        return newScores;
      });
    } else {
      // 選択（点数上限チェック）
      if (currentPoints + item.points <= 20) {
        setSelectedItems(prev => [...prev, itemId]);
        setEvaluationScores(prev => ({
          ...prev,
          [itemId]: 0 // 初期スコア
        }));
      } else {
        alert(`選択すると20点を超えてしまいます。現在: ${currentPoints}点、追加: ${item.points}点`);
      }
    }
  };

  // 推奨セットの適用
  const applyRecommendedSet = () => {
    const totalPoints = recommendedItems.reduce((sum, itemId) => {
      const item = facilitySpecificItemsV2.find(i => i.id === itemId);
      return sum + (item?.points || 0);
    }, 0);

    if (totalPoints === 20) {
      setSelectedItems(recommendedItems);
      const initialScores: Record<string, number> = {};
      recommendedItems.forEach(itemId => {
        initialScores[itemId] = 0;
      });
      setEvaluationScores(initialScores);
    } else {
      alert('推奨セットの合計点数が20点になりません。手動で選択してください。');
    }
  };

  // 評価スコアの更新
  const handleScoreChange = (itemId: string, score: number) => {
    setEvaluationScores(prev => ({
      ...prev,
      [itemId]: score
    }));
  };

  // 評価の保存
  const handleSave = () => {
    if (currentPoints !== 20) {
      alert('評価項目の合計が20点になるよう選択してください。');
      return;
    }

    // 全項目に評価が入力されているかチェック
    const allScored = selectedItems.every(itemId => 
      evaluationScores[itemId] !== undefined && evaluationScores[itemId] > 0
    );

    if (!allScored) {
      alert('選択した全ての項目に評価を入力してください。');
      return;
    }

    // 保存処理（実際にはAPIコール）
    console.log('施設特化項目評価を保存:', {
      employeeId,
      evaluationPeriod,
      selectedItems,
      evaluationScores,
      totalScore: Object.values(evaluationScores).reduce((sum, score) => sum + score, 0)
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // カテゴリ名のマッピング
  const categoryNames: Record<string, string> = {
    emergency: '救急・急性期',
    specialized: '専門技術',
    care: 'ケア技術',
    rehabilitation: 'リハビリテーション',
    management: 'マネジメント'
  };

  // 施設タイプ名のマッピング
  const facilityTypeNames: Record<string, string> = {
    acute: '急性期病院',
    chronic: '慢性期病院',
    recovery: '回復期リハビリ病院',
    roken: '介護老人保健施設',
    grouphome: 'グループホーム'
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-6 h-6" />
            施設特化項目評価（20点）
          </CardTitle>
          <CardDescription>
            {employeeName} - {evaluationPeriod} - {facilityTypeNames[facilityType] || facilityType}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">選択済み項目</p>
              <p className="text-2xl font-bold">{selectedItems.length}個</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">現在の合計点</p>
              <p className={`text-2xl font-bold ${currentPoints === 20 ? 'text-green-600' : 'text-orange-600'}`}>
                {currentPoints} / 20点
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">残り選択可能</p>
              <p className="text-2xl font-bold">{remainingPoints}点</p>
            </div>
          </div>
          <Progress value={(currentPoints / 20) * 100} className="mt-4" />
        </CardContent>
      </Card>

      {/* 推奨セット */}
      {recommendedItems.length > 0 && (
        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              あなたの職種・経験レベルに応じた推奨セットがあります。
            </span>
            <Button onClick={applyRecommendedSet} size="sm" variant="outline">
              推奨セットを適用
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* タブコンテンツ */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="select">項目選択</TabsTrigger>
          <TabsTrigger value="evaluate">評価入力</TabsTrigger>
        </TabsList>

        {/* 項目選択タブ */}
        <TabsContent value="select" className="space-y-4">
          {Object.entries(itemsByCategory).map(([category, items]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {categoryNames[category] || category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {items.map(item => {
                    const isSelected = selectedItems.includes(item.id);
                    const canSelect = remainingPoints >= item.points || isSelected;

                    return (
                      <div
                        key={item.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-blue-50 border-blue-500' 
                            : canSelect
                            ? 'hover:bg-gray-50'
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                        onClick={() => canSelect && handleItemSelection(item.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                              <h4 className="font-medium">{item.name}</h4>
                              <Badge variant="secondary">{item.points}点</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.description}
                            </p>
                            <div className="mt-2">
                              <p className="text-xs font-medium mb-1">評価基準:</p>
                              <ul className="text-xs text-muted-foreground space-y-1">
                                {item.evaluationCriteria.slice(0, 2).map((criteria, idx) => (
                                  <li key={idx}>・{criteria}</li>
                                ))}
                                {item.evaluationCriteria.length > 2 && (
                                  <li className="text-gray-400">
                                    他{item.evaluationCriteria.length - 2}項目...
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* 評価入力タブ */}
        <TabsContent value="evaluate" className="space-y-4">
          {selectedItems.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                まず「項目選択」タブで評価項目を選択してください。
              </AlertDescription>
            </Alert>
          ) : currentPoints !== 20 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                評価項目の合計が20点になるよう選択してください。現在: {currentPoints}点
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {selectedItems.map(itemId => {
                const item = facilitySpecificItemsV2.find(i => i.id === itemId);
                if (!item) return null;

                return (
                  <Card key={itemId}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        {item.name}
                        <Badge>{item.points}点</Badge>
                      </CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* 評価基準表示 */}
                        <div>
                          <h4 className="text-sm font-medium mb-2">評価基準</h4>
                          <ul className="text-sm space-y-1">
                            {item.evaluationCriteria.map((criteria, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-muted-foreground">{idx + 1}.</span>
                                <span>{criteria}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* 評価入力 */}
                        <div>
                          <label className="text-sm font-medium">評価点（{item.points}点満点）</label>
                          <div className="flex gap-2 mt-2">
                            {[...Array(item.points)].map((_, i) => (
                              <Button
                                key={i}
                                variant={evaluationScores[itemId] === i + 1 ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleScoreChange(itemId, i + 1)}
                              >
                                {i + 1}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* 合計と保存 */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">評価合計</p>
                      <p className="text-2xl font-bold">
                        {Object.values(evaluationScores).reduce((sum, score) => sum + score, 0)} / 20点
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => {
                        setSelectedItems([]);
                        setEvaluationScores({});
                      }}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        リセット
                      </Button>
                      <Button onClick={handleSave}>
                        <Save className="w-4 h-4 mr-2" />
                        保存
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {saved && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    評価が正常に保存されました。
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}