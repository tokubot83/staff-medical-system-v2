'use client';

import React, { useState, useMemo } from 'react';
import { ArrowLeft, Save, Search, Plus, Trash2, Info, Filter, Award, Heart, Brain, Shield, Users, Briefcase, Building, Sparkles, Target, CheckCircle, BarChart3, Settings, AlertCircle } from 'lucide-react';
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

        {/* メインヘッダーカード */}
        <Card className="mb-6 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500 rounded-lg">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">施設特化評価項目の設計</CardTitle>
                  <CardDescription className="mt-1">
                    各施設の特性に合わせた評価項目（20点満点）を選択します
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-purple-100 text-purple-800" variant="secondary">カスタマイズ可能</Badge>
                <Badge className="bg-yellow-100 text-yellow-800" variant="secondary">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI推奨
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">急性期</span>
                </div>
                <p className="text-xl font-bold text-blue-600">6項目</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">リハビリ</span>
                </div>
                <p className="text-xl font-bold text-green-600">5項目</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">慢性期</span>
                </div>
                <p className="text-xl font-bold text-purple-600">4項目</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-700">認知症</span>
                </div>
                <p className="text-xl font-bold text-orange-600">3項目</p>
              </div>
            </div>
            <Alert className="mt-4 border-purple-200 bg-purple-50/50">
              <Info className="h-4 w-4 text-purple-600" />
              <AlertDescription className="text-purple-800">
                職種・経験レベルに応じた推奨項目が自動表示されます。項目バンクから柔軟に選択できます。
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左側：施設選択 */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-br from-gray-50 to-gray-100">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="h-5 w-5 text-gray-700" />
                  施設一覧
                </CardTitle>
                <CardDescription>設定する施設を選択</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeFacility} onValueChange={setActiveFacility} orientation="vertical">
                  <TabsList className="flex flex-col h-full w-full">
                    {Object.entries(facilityConfigs).map(([name, config]) => (
                      <TabsTrigger
                        key={name}
                        value={name}
                        className="w-full justify-start px-4 py-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-50 data-[state=active]:to-indigo-50 data-[state=active]:border-l-4 data-[state=active]:border-purple-500 hover:bg-gray-50 transition-all"
                      >
                        <div className="w-full">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 rounded-lg ${
                              name.includes('小原') ? 'bg-blue-100' : 
                              name.includes('リハビリ') ? 'bg-green-100' : 
                              'bg-purple-100'
                            }`}>
                              <Building className={`h-4 w-4 ${
                                name.includes('小原') ? 'text-blue-600' : 
                                name.includes('リハビリ') ? 'text-green-600' : 
                                'text-purple-600'
                              }`} />
                            </div>
                            <div className="text-left flex-1">
                              <div className="font-bold text-gray-800">{name}</div>
                              <div className="text-sm text-gray-600">
                                {facilityTypes[config.facilityType as keyof typeof facilityTypes] || config.facilityType}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">設定進捗</span>
                              <span className="text-xs font-bold">{Math.round((config.totalPoints / 20) * 100)}%</span>
                            </div>
                            <Progress 
                              value={(config.totalPoints / 20) * 100} 
                              className={`h-3 ${
                                config.totalPoints === 20 ? 'bg-green-100' : 
                                config.totalPoints > 10 ? 'bg-blue-100' : 
                                'bg-gray-100'
                              }`}
                            />
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-gray-700">
                                {config.totalPoints} / 20点
                              </span>
                              {config.totalPoints === 20 && (
                                <Badge className="bg-green-100 text-green-700 text-xs">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  完了
                                </Badge>
                              )}
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
            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  選択済み項目
                </CardTitle>
                <CardDescription>
                  <div className="flex items-center justify-between mt-2">
                    <span>配点合計</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-600">{facilityConfigs[activeFacility].totalPoints}</span>
                      <span className="text-sm text-gray-600">/ 20点</span>
                    </div>
                  </div>
                  <Progress 
                    value={(facilityConfigs[activeFacility].totalPoints / 20) * 100} 
                    className="h-2 bg-green-100 mt-2"
                  />
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {facilityConfigs[activeFacility].selectedItems.length === 0 ? (
                  <p className="text-sm text-gray-500">項目が選択されていません</p>
                ) : (
                  facilityConfigs[activeFacility].selectedItems.map(selected => {
                    const item = facilitySpecificItems.find(i => i.id === selected.itemId);
                    if (!item) return null;
                    const category = getItemCategory(item.id);
                    const categoryInfo = categories[category as keyof typeof categories];
                    const CategoryIcon = categoryInfo?.icon || Award;
                    
                    return (
                      <div key={selected.itemId} className="p-3 bg-white rounded-lg border border-green-200 hover:shadow-sm transition-shadow">
                        <div className="flex items-start gap-2">
                          <CategoryIcon className={`w-4 h-4 mt-0.5 text-${categoryInfo?.color || 'gray'}-600`} />
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">{item.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className="bg-green-100 text-green-700 text-xs">{selected.points}点</Badge>
                              <span className="text-xs text-gray-500">{categoryInfo?.name}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleItemToggle(selected.itemId, selected.points)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          {/* 右側：項目バンク */}
          <div className="lg:col-span-3">
            <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-500 rounded-lg">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">評価項目バンク</CardTitle>
                      <CardDescription className="mt-1">
                        AIが推奨する項目を含む、豊富な項目から選択できます
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-indigo-100 text-indigo-800">
                      <BarChart3 className="w-3 h-3 mr-1" />
                      {filteredItems.length} 項目
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* フィルター */}
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Filter className="h-4 w-4 text-gray-600" />
                      <span className="font-medium text-gray-700">項目を絞り込み</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="キーワードで検索..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 border-gray-300"
                        />
                      </div>
                    </div>
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
                      <div key={categoryKey} className="p-5 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-${category.color}-100`}>
                              <CategoryIcon className={`w-5 h-5 text-${category.color}-600`} />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-800">{category.name}</h3>
                              <p className="text-sm text-gray-600">このカテゴリの評価項目</p>
                            </div>
                          </div>
                          <Badge className={`bg-${category.color}-100 text-${category.color}-800`}>
                            {items.length} 項目
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {items.map(item => {
                            const selected = isItemSelected(item.id);
                            const trainings = getRelatedTrainings(item.id);
                            
                            return (
                              <div 
                                key={item.id} 
                                className={`border-2 rounded-lg p-4 hover:shadow-md transition-all ${
                                  selected ? 
                                  'border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50' : 
                                  'border-gray-200 hover:border-purple-300 bg-white'
                                }`}
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
                                      <Badge className={`${
                                        selected ? 
                                        'bg-purple-500 text-white' : 
                                        'bg-gray-100 text-gray-700'
                                      }`}>
                                        {item.points}点
                                      </Badge>
                                    </div>
                                    
                                    {/* 評価基準 */}
                                    <div className="p-2 bg-gray-50 rounded-lg">
                                      <p className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        評価基準
                                      </p>
                                      <ul className="space-y-1">
                                        {item.evaluationCriteria.slice(0, 2).map((criteria, idx) => (
                                          <li key={idx} className="flex items-start gap-1">
                                            <span className="text-purple-500 mt-1">•</span>
                                            <span className="text-xs text-gray-600">{criteria}</span>
                                          </li>
                                        ))}
                                        {item.evaluationCriteria.length > 2 && (
                                          <li className="text-xs text-gray-400 ml-3">他{item.evaluationCriteria.length - 2}項目</li>
                                        )}
                                      </ul>
                                    </div>
                                    
                                    {/* 必須研修 */}
                                    {trainings.length > 0 && (
                                      <div className="p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                                        <p className="text-xs font-bold text-yellow-800 mb-2 flex items-center gap-1">
                                          <AlertCircle className="w-3 h-3" />
                                          必須研修
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                          {trainings.map(training => (
                                            <Badge key={training.id} className="bg-yellow-100 text-yellow-800 text-xs border border-yellow-300">
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