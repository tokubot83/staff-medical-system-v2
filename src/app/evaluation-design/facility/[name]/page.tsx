'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, Building, Users, Target, Settings, CheckCircle2, 
  AlertTriangle, Info, Save, Plus, Trash2, Copy, BarChart3,
  Shield, Heart, Zap, Award, TrendingUp, BookOpen
} from 'lucide-react';
import Link from 'next/link';
import { 
  facilitySpecificItems, 
  corporateEvaluationItems,
  type EvaluationItem,
  facilityTypes,
  roles,
  experienceLevels
} from '@/data/evaluationItemBank';

interface FacilityConfiguration {
  facilityName: string;
  facilityType: 'acute' | 'recovery' | 'chronic' | 'geriatric';
  staffCount: number;
  departments: string[];
  evaluationItems: {
    corporate: { itemId: string; weight: number; customization?: string }[];
    facility: { itemId: string; points: number; required: boolean }[];
  };
  targetProfiles: {
    role: string;
    level: string;
    count: number;
    specificItems?: string[];
  }[];
}

// 施設プリセット設定
const facilityPresets: Record<string, Partial<FacilityConfiguration>> = {
  'エスポワール立神': {
    facilityType: 'geriatric',
    departments: ['介護部', '看護部', 'リハビリテーション部', '栄養部'],
    staffCount: 120,
    targetProfiles: [
      { role: 'nurse', level: 'midlevel', count: 30 },
      { role: 'caregiver', level: 'midlevel', count: 50 },
      { role: 'rehabilitation', level: 'veteran', count: 15 }
    ]
  },
  '小原病院': {
    facilityType: 'acute',
    departments: ['看護部', '医局', '医療技術部', '事務部'],
    staffCount: 350,
    targetProfiles: [
      { role: 'nurse', level: 'midlevel', count: 150 },
      { role: 'doctor', level: 'veteran', count: 50 },
      { role: 'technician', level: 'midlevel', count: 80 }
    ]
  },
  '立神リハビリテーション温泉病院': {
    facilityType: 'chronic',
    departments: ['看護部', 'リハビリテーション部', '温泉療法部'],
    staffCount: 180,
    targetProfiles: [
      { role: 'nurse', level: 'veteran', count: 60 },
      { role: 'rehabilitation', level: 'midlevel', count: 40 },
      { role: 'therapist', level: 'veteran', count: 20 }
    ]
  }
};

export default function FacilityDesignPage() {
  const params = useParams();
  const router = useRouter();
  const facilityName = decodeURIComponent(params.name as string);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [configuration, setConfiguration] = useState<FacilityConfiguration>({
    facilityName,
    facilityType: 'acute',
    staffCount: 100,
    departments: [],
    evaluationItems: {
      corporate: [],
      facility: []
    },
    targetProfiles: []
  });

  // 施設プリセットの適用
  useEffect(() => {
    const preset = facilityPresets[facilityName];
    if (preset) {
      setConfiguration(prev => ({
        ...prev,
        ...preset,
        facilityName
      }));
    }
  }, [facilityName]);

  // 推奨評価項目の取得
  const getRecommendedItems = () => {
    return facilitySpecificItems.filter(item => {
      // 施設タイプマッチ
      const facilityMatch = item.description?.toLowerCase().includes(
        configuration.facilityType === 'acute' ? '急性期' :
        configuration.facilityType === 'recovery' ? '回復期' :
        configuration.facilityType === 'chronic' ? '慢性期' :
        '老健'
      );
      
      // 選択された職種・レベルにマッチ
      const roleMatch = selectedRole === 'all' || 
                       item.targetRoles.includes(selectedRole) || 
                       item.targetRoles.includes('all');
      const levelMatch = selectedLevel === 'all' || 
                        item.targetLevels.includes(selectedLevel);
      
      return facilityMatch && roleMatch && levelMatch;
    });
  };

  // 評価項目の追加・削除
  const toggleFacilityItem = (item: EvaluationItem) => {
    setConfiguration(prev => {
      const existing = prev.evaluationItems.facility.find(fi => fi.itemId === item.id);
      
      if (existing) {
        // 削除
        return {
          ...prev,
          evaluationItems: {
            ...prev.evaluationItems,
            facility: prev.evaluationItems.facility.filter(fi => fi.itemId !== item.id)
          }
        };
      } else {
        // 追加
        return {
          ...prev,
          evaluationItems: {
            ...prev.evaluationItems,
            facility: [...prev.evaluationItems.facility, {
              itemId: item.id,
              points: item.points,
              required: item.type === 'required'
            }]
          }
        };
      }
    });
  };

  // 配点調整
  const adjustItemPoints = (itemId: string, points: number) => {
    setConfiguration(prev => ({
      ...prev,
      evaluationItems: {
        ...prev.evaluationItems,
        facility: prev.evaluationItems.facility.map(item =>
          item.itemId === itemId ? { ...item, points } : item
        )
      }
    }));
  };

  // 現在の配点合計
  const totalPoints = configuration.evaluationItems.facility.reduce(
    (sum, item) => sum + item.points, 0
  );

  // 設定の保存
  const saveConfiguration = () => {
    const configs = JSON.parse(localStorage.getItem('facilityConfigurations') || '{}');
    configs[facilityName] = configuration;
    localStorage.setItem('facilityConfigurations', JSON.stringify(configs));
    alert('施設設定を保存しました');
  };

  return (
    <div>
      <CommonHeader title={`${facilityName} - 施設評価設計`} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Link href="/evaluation-design">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              評価制度設計に戻る
            </Button>
          </Link>
        </div>

        {/* 施設概要カード */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {facilityName}
                </CardTitle>
                <CardDescription>
                  {facilityTypes[configuration.facilityType]} | 職員数: {configuration.staffCount}名
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-lg px-3 py-1">
                施設特化項目: {totalPoints}/20点
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {configuration.departments.map((dept, idx) => (
                <div key={idx} className="text-center p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">{dept}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">概要</TabsTrigger>
            <TabsTrigger value="items">評価項目選定</TabsTrigger>
            <TabsTrigger value="profiles">職種別設定</TabsTrigger>
            <TabsTrigger value="simulation">シミュレーション</TabsTrigger>
          </TabsList>

          {/* 概要タブ */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>施設特性</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">重点評価領域</h4>
                    {configuration.facilityType === 'geriatric' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span>生活支援・介護ケア</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span>認知症対応</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-green-500" />
                          <span>レクリエーション企画</span>
                        </div>
                      </div>
                    )}
                    {configuration.facilityType === 'acute' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          <span>救急・急性期対応</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-purple-500" />
                          <span>高度医療技術</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-orange-500" />
                          <span>チーム医療連携</span>
                        </div>
                      </div>
                    )}
                    {configuration.facilityType === 'chronic' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-indigo-500" />
                          <span>リハビリテーション</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-pink-500" />
                          <span>長期療養ケア</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-teal-500" />
                          <span>在宅復帰支援</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">職員構成</h4>
                    <div className="space-y-2">
                      {configuration.targetProfiles.map((profile, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>
                            {roles[profile.role as keyof typeof roles]} - 
                            {experienceLevels[profile.level as keyof typeof experienceLevels]}
                          </span>
                          <Badge variant="secondary">{profile.count}名</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                この施設は{facilityTypes[configuration.facilityType]}として、
                特有の評価項目を20点分設定する必要があります。
                職員構成と施設特性に応じて最適な項目を選択してください。
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* 評価項目選定タブ */}
          <TabsContent value="items" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>フィルター設定</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">対象職種</label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全職種</SelectItem>
                        {Object.entries(roles).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">経験レベル</label>
                    <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全レベル</SelectItem>
                        {Object.entries(experienceLevels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              {getRecommendedItems().map((item) => {
                const isSelected = configuration.evaluationItems.facility.some(
                  fi => fi.itemId === item.id
                );
                const currentItem = configuration.evaluationItems.facility.find(
                  fi => fi.itemId === item.id
                );

                return (
                  <Card 
                    key={item.id}
                    className={`cursor-pointer transition-all ${
                      isSelected ? 'border-2 border-blue-500 bg-blue-50' : 'hover:shadow-lg'
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              checked={isSelected}
                              onCheckedChange={() => toggleFacilityItem(item)}
                            />
                            <CardTitle className="text-base">{item.name}</CardTitle>
                          </div>
                          <CardDescription className="text-xs mt-2">
                            {item.description}
                          </CardDescription>
                        </div>
                        <Badge variant={isSelected ? "default" : "secondary"}>
                          {currentItem?.points || item.points}点
                        </Badge>
                      </div>
                    </CardHeader>
                    {isSelected && (
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-medium">配点調整</label>
                            <Slider
                              value={[currentItem?.points || item.points]}
                              onValueChange={(value) => adjustItemPoints(item.id, value[0])}
                              max={10}
                              min={1}
                              step={1}
                              className="mt-2"
                            />
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-600">評価基準:</p>
                            {item.evaluationCriteria.map((criteria, idx) => (
                              <div key={idx} className="flex items-start gap-1">
                                <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5" />
                                <span className="text-xs">{criteria}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>

            <Card className={`border-2 ${
              totalPoints === 20 ? 'bg-green-50 border-green-200' : 
              totalPoints > 20 ? 'bg-red-50 border-red-200' : 
              'bg-blue-50 border-blue-200'
            }`}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">施設特化項目 合計配点</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${
                      totalPoints === 20 ? 'text-green-600' : 
                      totalPoints > 20 ? 'text-red-600' : 
                      'text-blue-600'
                    }`}>
                      {totalPoints} / 20点
                    </span>
                    {totalPoints === 20 && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                    {totalPoints > 20 && <AlertTriangle className="h-5 w-5 text-red-600" />}
                  </div>
                </div>
                {totalPoints !== 20 && (
                  <p className="text-sm text-gray-600 mt-2">
                    {totalPoints < 20 
                      ? `あと${20 - totalPoints}点選択してください`
                      : `${totalPoints - 20}点超過しています。項目を調整してください`}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 職種別設定タブ */}
          <TabsContent value="profiles" className="space-y-6">
            {configuration.targetProfiles.map((profile, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {roles[profile.role as keyof typeof roles]} - 
                    {experienceLevels[profile.level as keyof typeof experienceLevels]}
                  </CardTitle>
                  <CardDescription>対象人数: {profile.count}名</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">推奨評価項目</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {getRecommendedItems()
                          .filter(item => 
                            item.targetRoles.includes(profile.role) &&
                            item.targetLevels.includes(profile.level)
                          )
                          .slice(0, 4)
                          .map(item => (
                            <div key={item.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                              <Target className="h-4 w-4 text-blue-500" />
                              <span className="text-sm">{item.name}</span>
                              <Badge variant="outline" className="ml-auto">{item.points}点</Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* シミュレーションタブ */}
          <TabsContent value="simulation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>評価配点シミュレーション</CardTitle>
                <CardDescription>
                  現在の設定での評価スコア分布予測
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">技術評価（50点）内訳</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">法人統一項目</span>
                        <span className="font-bold">30点</span>
                      </div>
                      <Progress value={60} className="h-2" />
                      
                      <div className="flex justify-between mt-4">
                        <span className="text-sm">施設特化項目</span>
                        <span className="font-bold">{totalPoints}点</span>
                      </div>
                      <Progress value={totalPoints * 5} className="h-2" />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">予想スコア分布</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-purple-600">S (90-100)</Badge>
                        <span className="text-sm">約{Math.round(configuration.staffCount * 0.1)}名</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-blue-600">A (80-89)</Badge>
                        <span className="text-sm">約{Math.round(configuration.staffCount * 0.2)}名</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-green-600">B (70-79)</Badge>
                        <span className="text-sm">約{Math.round(configuration.staffCount * 0.4)}名</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-yellow-600">C (60-69)</Badge>
                        <span className="text-sm">約{Math.round(configuration.staffCount * 0.2)}名</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-red-600">D (0-59)</Badge>
                        <span className="text-sm">約{Math.round(configuration.staffCount * 0.1)}名</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    この施設の特性を考慮すると、
                    {configuration.facilityType === 'geriatric' && '介護・生活支援系の項目を重視した配点が効果的です。'}
                    {configuration.facilityType === 'acute' && '救急対応・高度医療技術の項目を重視した配点が効果的です。'}
                    {configuration.facilityType === 'chronic' && 'リハビリ・長期ケアの項目を重視した配点が効果的です。'}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="flex-1"
                onClick={saveConfiguration}
                disabled={totalPoints !== 20}
              >
                <Save className="h-4 w-4 mr-2" />
                設定を保存
              </Button>
              <Button size="lg" variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                他施設にコピー
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}