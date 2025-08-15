'use client';

import React, { useState, useMemo } from 'react';
import { ArrowLeft, Save, Search, Plus, Trash2, Info, Filter, Award, Heart, Brain, Shield, Users, Briefcase } from 'lucide-react';
import Link from 'next/link';
import CommonHeader from '@/components/CommonHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { facilitySpecificItems, facilityTypes, roles, experienceLevels, trainingPrograms } from '@/data/evaluationItemBank';

interface SelectedItem {
  itemId: string;
  points: number;
}

interface FacilityConfig {
  facilityType: string;
  selectedItems: SelectedItem[];
  totalPoints: number;
}

export default function FacilitySpecificPage() {
  const [facilityConfigs, setFacilityConfigs] = useState<Record<string, FacilityConfig>>({
    '小原病院': {
      facilityType: 'acute',
      selectedItems: [],
      totalPoints: 0
    },
    '立神リハビリテーション温泉病院': {
      facilityType: 'chronic',
      selectedItems: [],
      totalPoints: 0
    },
    'エスポワール立神': {
      facilityType: 'nursingHome',
      selectedItems: [],
      totalPoints: 0
    }
  });

  const [activeFacility, setActiveFacility] = useState('小原病院');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // カテゴリー定義
  const categories = {
    emergency: { name: '救急・急性期', icon: Shield, color: 'red' },
    rehabilitation: { name: 'リハビリ・回復期', icon: Brain, color: 'blue' },
    chronic: { name: '慢性期・長期療養', icon: Heart, color: 'green' },
    dementia: { name: '認知症ケア', icon: Users, color: 'purple' },
    management: { name: '管理・リーダーシップ', icon: Briefcase, color: 'orange' },
    specialty: { name: '専門技術', icon: Award, color: 'indigo' }
  };

  // 項目のカテゴリー分類
  const getItemCategory = (itemId: string): string => {
    if (itemId.includes('ACUTE') || itemId.includes('EMERGENCY')) return 'emergency';
    if (itemId.includes('RECOVERY') || itemId.includes('REHAB')) return 'rehabilitation';
    if (itemId.includes('CHRONIC') || itemId.includes('PRESSURE')) return 'chronic';
    if (itemId.includes('DEMENTIA') || itemId.includes('CARE_CW')) return 'dementia';
    if (itemId.includes('MANAGE') || itemId.includes('CHIEF')) return 'management';
    return 'specialty';
  };

  // フィルタリングされた項目
  const filteredItems = useMemo(() => {
    return facilitySpecificItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'all' || 
                         item.targetRoles.includes(filterRole) || 
                         item.targetRoles.includes('all');
      const matchesLevel = filterLevel === 'all' || 
                          item.targetLevels.includes(filterLevel) || 
                          item.targetLevels.includes('all');
      const matchesCategory = filterCategory === 'all' || 
                             getItemCategory(item.id) === filterCategory;
      
      return matchesSearch && matchesRole && matchesLevel && matchesCategory;
    });
  }, [searchTerm, filterRole, filterLevel, filterCategory]);

  // グループ化された項目
  const groupedItems = useMemo(() => {
    const grouped: Record<string, typeof facilitySpecificItems> = {};
    filteredItems.forEach(item => {
      const category = getItemCategory(item.id);
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(item);
    });
    return grouped;
  }, [filteredItems]);

  const handleItemToggle = (itemId: string, points: number) => {
    setFacilityConfigs(prev => {
      const config = prev[activeFacility];
      const existingIndex = config.selectedItems.findIndex(item => item.itemId === itemId);
      
      let newSelectedItems: SelectedItem[];
      if (existingIndex >= 0) {
        // 項目を削除
        newSelectedItems = config.selectedItems.filter((_, index) => index !== existingIndex);
      } else {
        // 項目を追加（20点を超えないようチェック）
        const currentTotal = config.selectedItems.reduce((sum, item) => sum + item.points, 0);
        if (currentTotal + points > 20) {
          alert('施設特化項目の合計は20点までです。');
          return prev;
        }
        newSelectedItems = [...config.selectedItems, { itemId, points }];
      }
      
      const totalPoints = newSelectedItems.reduce((sum, item) => sum + item.points, 0);
      
      return {
        ...prev,
        [activeFacility]: {
          ...config,
          selectedItems: newSelectedItems,
          totalPoints
        }
      };
    });
  };

  const isItemSelected = (itemId: string) => {
    return facilityConfigs[activeFacility].selectedItems.some(item => item.itemId === itemId);
  };

  const handleSave = () => {
    setSaveStatus('saving');
    // 実際の保存処理
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const getRelatedTrainings = (itemId: string) => {
    const item = facilitySpecificItems.find(i => i.id === itemId);
    if (!item?.requiredTrainings) return [];
    return trainingPrograms.filter(t => item.requiredTrainings?.includes(t.id));
  };

  return (
    <div>
      <CommonHeader title="施設特化項目設計" />
      <div className="container mx-auto px-4 py-6 max-w-7xl">
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
            施設特化項目（20点）は、各施設の特性に応じて項目バンクから選択します。
            施設種別・職種・経験レベルに応じた推奨項目が表示されます。
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左側：施設選択 */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">施設選択</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeFacility} onValueChange={setActiveFacility} orientation="vertical">
                  <TabsList className="flex flex-col h-full w-full">
                    {Object.entries(facilityConfigs).map(([name, config]) => (
                      <TabsTrigger
                        key={name}
                        value={name}
                        className="w-full justify-start px-4 py-3 data-[state=active]:bg-blue-50"
                      >
                        <div className="w-full">
                          <div className="flex justify-between items-center">
                            <div className="text-left">
                              <div className="font-medium">{name}</div>
                              <div className="text-xs text-gray-600">
                                {facilityTypes[config.facilityType as keyof typeof facilityTypes] || config.facilityType}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2">
                            <Progress 
                              value={(config.totalPoints / 20) * 100} 
                              className="h-2"
                            />
                            <div className="text-xs text-gray-600 mt-1">
                              {config.totalPoints} / 20点
                            </div>
                          </div>
                        </div>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            {/* 選択済み項目 */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">選択済み項目</CardTitle>
                <CardDescription>
                  合計: {facilityConfigs[activeFacility].totalPoints} / 20点
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {facilityConfigs[activeFacility].selectedItems.length === 0 ? (
                  <p className="text-sm text-gray-500">項目が選択されていません</p>
                ) : (
                  facilityConfigs[activeFacility].selectedItems.map(selected => {
                    const item = facilitySpecificItems.find(i => i.id === selected.itemId);
                    if (!item) return null;
                    return (
                      <div key={selected.itemId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div className="flex-1">
                          <div className="text-sm font-medium">{item.name}</div>
                          <Badge variant="secondary" className="text-xs">{selected.points}点</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleItemToggle(selected.itemId, selected.points)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          {/* 右側：項目バンク */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>項目バンク</CardTitle>
                <CardDescription>
                  施設特化項目を選択してください（最大20点）
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* フィルター */}
                <div className="space-y-4 mb-6">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        placeholder="項目を検索..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="カテゴリー" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">すべてのカテゴリー</SelectItem>
                        {Object.entries(categories).map(([key, cat]) => (
                          <SelectItem key={key} value={key}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={filterRole} onValueChange={setFilterRole}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="職種" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">すべての職種</SelectItem>
                        {Object.entries(roles).map(([key, name]) => (
                          <SelectItem key={key} value={key}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={filterLevel} onValueChange={setFilterLevel}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="経験レベル" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">すべてのレベル</SelectItem>
                        {Object.entries(experienceLevels).map(([key, name]) => (
                          <SelectItem key={key} value={key}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 項目リスト */}
                <div className="space-y-6">
                  {Object.entries(groupedItems).map(([categoryKey, items]) => {
                    const category = categories[categoryKey as keyof typeof categories];
                    if (!category || items.length === 0) return null;
                    
                    const CategoryIcon = category.icon;
                    
                    return (
                      <div key={categoryKey}>
                        <div className="flex items-center gap-2 mb-3">
                          <CategoryIcon className={`w-5 h-5 text-${category.color}-600`} />
                          <h3 className="font-medium">{category.name}</h3>
                          <Badge variant="outline">{items.length}項目</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {items.map(item => {
                            const selected = isItemSelected(item.id);
                            const trainings = getRelatedTrainings(item.id);
                            
                            return (
                              <div 
                                key={item.id} 
                                className={`border rounded-lg p-4 ${selected ? 'border-blue-500 bg-blue-50' : ''}`}
                              >
                                <div className="flex items-start gap-3">
                                  <Checkbox
                                    checked={selected}
                                    onCheckedChange={() => handleItemToggle(item.id, item.points)}
                                    className="mt-1"
                                  />
                                  <div className="flex-1 space-y-2">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h4 className="font-medium">{item.name}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                      </div>
                                      <Badge variant={selected ? 'default' : 'outline'}>
                                        {item.points}点
                                      </Badge>
                                    </div>
                                    
                                    {/* 評価基準 */}
                                    <div className="space-y-1">
                                      <p className="text-xs font-medium text-gray-700">評価基準:</p>
                                      <ul className="text-xs text-gray-600 space-y-1">
                                        {item.evaluationCriteria.slice(0, 2).map((criteria, idx) => (
                                          <li key={idx}>• {criteria}</li>
                                        ))}
                                        {item.evaluationCriteria.length > 2 && (
                                          <li className="text-gray-400">他{item.evaluationCriteria.length - 2}項目</li>
                                        )}
                                      </ul>
                                    </div>
                                    
                                    {/* 必須研修 */}
                                    {trainings.length > 0 && (
                                      <div className="pt-2 border-t">
                                        <p className="text-xs font-medium text-gray-700 mb-1">必須研修:</p>
                                        <div className="flex flex-wrap gap-1">
                                          {trainings.map(training => (
                                            <Badge key={training.id} variant="secondary" className="text-xs">
                                              {training.name}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* 対象 */}
                                    <div className="flex gap-4 text-xs text-gray-500">
                                      <span>対象職種: {item.targetRoles.join(', ')}</span>
                                      <span>レベル: {item.targetLevels.join(', ')}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredItems.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>該当する項目が見つかりません</p>
                    <p className="text-sm mt-2">フィルター条件を変更してください</p>
                  </div>
                )}
              </CardContent>
            </Card>
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