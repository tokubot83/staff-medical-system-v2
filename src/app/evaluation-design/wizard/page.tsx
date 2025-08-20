'use client';

import React, { useState, useEffect } from 'react';
import CommonHeader from '@/components/CommonHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  ChevronRight,
  ChevronLeft,
  Check,
  Info,
  Settings,
  Users,
  Building,
  BarChart3,
  Eye,
  Save,
  HelpCircle,
  Calendar,
  Award,
  Target,
  Shield,
  Heart,
  AlertTriangle,
  BookOpen,
  FileCheck
} from 'lucide-react';
import { 
  corporateEvaluationItems, 
  facilitySpecificItems,
  facilityTypes,
  roles,
  experienceLevels,
  type EvaluationItem 
} from '@/data/evaluationItemBank';
import EvaluationDesignSupport from '@/components/evaluation/EvaluationDesignSupport';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

interface SavedConfig {
  id: string;
  name: string;
  facilityType: string;
  role: string;
  level: string;
  coreItems: any;
  facilityItems: any;
  contributionSettings: any;
  createdAt: string;
  lastModified: string;
}

export default function EvaluationWizardPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFacilityType, setSelectedFacilityType] = useState('acute');
  const [selectedRole, setSelectedRole] = useState('nurse');
  const [selectedLevel, setSelectedLevel] = useState('midlevel');
  const [savedConfigs, setSavedConfigs] = useState<SavedConfig[]>([]);
  const [configName, setConfigName] = useState('');
  const [showDesignSupport, setShowDesignSupport] = useState(false);
  
  const [designData, setDesignData] = useState({
    // 法人統一項目の配分（実データから初期化）
    coreItems: {
      C01: { superior: 7, self: 3, name: '専門技術・スキル', itemId: 'CORP_TECH_001' },
      C02: { superior: 5, self: 5, name: '対人関係・ケア', itemId: 'CORP_CARE_001' },
      C03: { superior: 8, self: 2, name: '安全・品質管理', itemId: 'CORP_SAFETY_001' }
    },
    // 施設特化項目（動的に選択）
    facilityItems: {
      selected: [] as string[],
      allocation: {} as Record<string, number>
    },
    // 貢献度評価設定（固定50点）
    contributionSettings: {
      summerFacility: 12.5,    // 夏季施設貢献
      summerCorporate: 12.5,   // 夏季法人貢献
      winterFacility: 12.5,    // 冬季施設貢献
      winterCorporate: 12.5,   // 冬季法人貢献
      evaluationAxes: {
        facility: ['組織貢献度ポイント', '部署内協力', '業務改善', '施設行事参加'],
        corporate: ['法人活動参画', '法人研修参加', '法人間連携', '法人理念実践']
      }
    }
  });

  // ローカルストレージから保存済み設定を読み込み
  useEffect(() => {
    const saved = localStorage.getItem('evaluationConfigs');
    if (saved) {
      setSavedConfigs(JSON.parse(saved));
    }
  }, []);

  // 設定の保存
  const saveConfiguration = () => {
    if (!configName) {
      alert('設定名を入力してください');
      return;
    }

    const newConfig: SavedConfig = {
      id: `config_${Date.now()}`,
      name: configName,
      facilityType: selectedFacilityType,
      role: selectedRole,
      level: selectedLevel,
      coreItems: designData.coreItems,
      facilityItems: designData.facilityItems,
      contributionSettings: designData.contributionSettings,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    const updatedConfigs = [...savedConfigs, newConfig];
    setSavedConfigs(updatedConfigs);
    localStorage.setItem('evaluationConfigs', JSON.stringify(updatedConfigs));
    alert('設定を保存しました');
  };

  // 保存済み設定の読み込み
  const loadConfiguration = (config: SavedConfig) => {
    setSelectedFacilityType(config.facilityType);
    setSelectedRole(config.role);
    setSelectedLevel(config.level);
    setDesignData(prev => ({
      ...prev,
      coreItems: config.coreItems,
      facilityItems: config.facilityItems,
      contributionSettings: config.contributionSettings
    }));
  };

  // 施設タイプに応じた推奨項目をフィルタリング
  const getRecommendedFacilityItems = () => {
    return facilitySpecificItems.filter(item => {
      // 施設タイプに合致するものを優先
      const facilityMatch = item.description?.includes(
        selectedFacilityType === 'acute' ? '急性期' :
        selectedFacilityType === 'recovery' ? '回復期' :
        selectedFacilityType === 'chronic' ? '慢性期' :
        '老健'
      );
      
      // 職種とレベルに合致するものを選択
      const roleMatch = item.targetRoles.includes(selectedRole) || item.targetRoles.includes('all');
      const levelMatch = item.targetLevels.includes(selectedLevel);
      
      return facilityMatch || (roleMatch && levelMatch);
    });
  };

  const wizardSteps: WizardStep[] = [
    {
      id: 'facility-info',
      title: '施設情報の設定',
      description: '施設タイプと対象職種を選択',
      icon: Building
    },
    {
      id: 'core-allocation',
      title: '法人統一項目の確認',
      description: '30点の配分を確認・調整',
      icon: Shield
    },
    {
      id: 'facility-selection',
      title: '施設特化項目の選定',
      description: '20点分の項目を選択',
      icon: Target
    },
    {
      id: 'contribution-setup',
      title: '貢献度評価の確認',
      description: '50点の評価構成を確認',
      icon: Users
    },
    {
      id: 'simulation',
      title: 'シミュレーション',
      description: '設定内容の影響を確認',
      icon: BarChart3
    },
    {
      id: 'confirmation',
      title: '確認と保存',
      description: '設定内容を最終確認',
      icon: Check
    }
  ];

  const currentStepData = wizardSteps[currentStep];

  const handleNext = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSliderChange = (category: string, type: 'superior' | 'self', value: number[]) => {
    const newValue = value[0];
    const otherType = type === 'superior' ? 'self' : 'superior';
    const total = 10;
    
    setDesignData(prev => ({
      ...prev,
      coreItems: {
        ...prev.coreItems,
        [category]: {
          ...prev.coreItems[category as keyof typeof prev.coreItems],
          [type]: newValue,
          [otherType]: total - newValue
        }
      }
    }));
  };

  const handleFacilityItemToggle = (itemId: string, points: number) => {
    setDesignData(prev => {
      const newSelected = prev.facilityItems.selected.includes(itemId)
        ? prev.facilityItems.selected.filter(id => id !== itemId)
        : [...prev.facilityItems.selected, itemId];
      
      const newAllocation = { ...prev.facilityItems.allocation };
      if (newSelected.includes(itemId)) {
        newAllocation[itemId] = points;
      } else {
        delete newAllocation[itemId];
      }
      
      return {
        ...prev,
        facilityItems: {
          selected: newSelected,
          allocation: newAllocation
        }
      };
    });
  };

  const totalFacilityPoints = Object.values(designData.facilityItems.allocation).reduce((sum, points) => sum + points, 0);

  // 法人統一項目のカテゴリーアイコン取得
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'C01': return Settings;
      case 'C02': return Heart;
      case 'C03': return Shield;
      default: return Settings;
    }
  };

  return (
    <div>
      <CommonHeader title="評価制度設計ウィザード" />
      
      <div className="max-w-6xl mx-auto p-6">
        {/* プログレスバー */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-4">
              {wizardSteps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-semibold
                      ${index < currentStep ? 'bg-green-500 text-white' : ''}
                      ${index === currentStep ? 'bg-blue-500 text-white ring-4 ring-blue-200' : ''}
                      ${index > currentStep ? 'bg-gray-200 text-gray-500' : ''}
                    `}>
                      {index < currentStep ? <Check className="h-5 w-5" /> : index + 1}
                    </div>
                    <span className={`text-xs mt-2 text-center ${
                      index === currentStep ? 'font-semibold' : ''
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < wizardSteps.length - 1 && (
                    <div className={`h-1 flex-1 mx-2 ${
                      index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <Progress value={(currentStep + 1) / wizardSteps.length * 100} className="h-2" />
          </CardContent>
        </Card>

        {/* メインコンテンツ */}
        <Card className="min-h-[500px]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <currentStepData.icon className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle>{currentStepData.title}</CardTitle>
                <CardDescription>{currentStepData.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Step 0: 施設情報の設定 */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    施設タイプと主な対象職種を選択してください。この情報に基づいて最適な評価項目を提案します。
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">施設タイプ</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup value={selectedFacilityType} onValueChange={setSelectedFacilityType}>
                        {Object.entries(facilityTypes).map(([key, name]) => (
                          <div key={key} className="flex items-center space-x-2 mb-3">
                            <RadioGroupItem value={key} id={key} />
                            <Label htmlFor={key} className="cursor-pointer">{name}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">主な対象職種</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label>職種</Label>
                          <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(roles).map(([key, name]) => (
                                <SelectItem key={key} value={key}>{name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>経験レベル</Label>
                          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(experienceLevels).map(([key, name]) => (
                                <SelectItem key={key} value={key}>{name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">選択内容に基づいて、次のステップで最適な評価項目を提案します</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 1: 法人統一項目の確認 */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    法人統一項目（30点）は全施設共通です。上司評価と本人評価の配分を確認・調整してください。
                  </AlertDescription>
                </Alert>

                {/* 実際の法人統一項目を表示 */}
                <div className="space-y-4">
                  {corporateEvaluationItems.slice(0, 3).map((item, index) => {
                    const categoryKey = `C0${index + 1}` as keyof typeof designData.coreItems;
                    const CategoryIcon = getCategoryIcon(categoryKey);
                    
                    return (
                      <Card key={item.id}>
                        <CardHeader>
                          <div className="flex items-start gap-3">
                            <CategoryIcon className="h-5 w-5 text-blue-600 mt-1" />
                            <div className="flex-1">
                              <CardTitle className="text-lg">{categoryKey}: {item.name}（10点）</CardTitle>
                              <CardDescription>{item.description}</CardDescription>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {item.evaluationCriteria.slice(0, 2).map((criteria, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {criteria}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">上司評価</span>
                              <span className="text-2xl font-bold text-blue-600">
                                {designData.coreItems[categoryKey].superior}点
                              </span>
                            </div>
                            <Slider
                              value={[designData.coreItems[categoryKey].superior]}
                              onValueChange={(value) => handleSliderChange(categoryKey, 'superior', value)}
                              max={10}
                              min={0}
                              step={1}
                              className="w-full"
                            />
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">本人評価</span>
                              <span className="text-2xl font-bold text-green-600">
                                {designData.coreItems[categoryKey].self}点
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    <strong>配分パターン例:</strong>
                    <br />• 技術重視型（7:3）- 客観的評価が可能な項目
                    <br />• バランス型（5:5）- 上司と本人の視点を均等に
                    <br />• 管理重視型（8:2）- 組織管理の観点を重視
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Step 2: 施設特化項目の選定 */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    {facilityTypes[selectedFacilityType as keyof typeof facilityTypes]}の特性に応じた評価項目を選択してください。
                    合計20点になるよう配分します。
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 gap-4">
                  {getRecommendedFacilityItems().map((item) => {
                    const isSelected = designData.facilityItems.selected.includes(item.id);
                    
                    return (
                      <Card 
                        key={item.id} 
                        className={`cursor-pointer transition-all ${
                          isSelected ? 'border-2 border-blue-500 bg-blue-50' : 'hover:shadow-lg'
                        }`}
                        onClick={() => handleFacilityItemToggle(item.id, item.points)}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Checkbox 
                                  checked={isSelected}
                                  onCheckedChange={() => {}}
                                />
                                <CardTitle className="text-base">{item.name}</CardTitle>
                              </div>
                              <CardDescription className="text-xs mt-2">
                                {item.description}
                              </CardDescription>
                            </div>
                            <Badge variant={isSelected ? "default" : "secondary"}>
                              {item.points}点
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-600">評価基準:</p>
                            {item.evaluationCriteria.slice(0, 2).map((criteria, idx) => (
                              <div key={idx} className="flex items-start gap-1">
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-600">{criteria}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <Card className={`border-2 ${
                  totalFacilityPoints === 20 ? 'bg-green-50 border-green-200' : 
                  totalFacilityPoints > 20 ? 'bg-red-50 border-red-200' : 
                  'bg-blue-50 border-blue-200'
                }`}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">合計配分</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl font-bold ${
                          totalFacilityPoints === 20 ? 'text-green-600' : 
                          totalFacilityPoints > 20 ? 'text-red-600' : 
                          'text-blue-600'
                        }`}>
                          {totalFacilityPoints} / 20点
                        </span>
                        {totalFacilityPoints === 20 && <Check className="h-5 w-5 text-green-600" />}
                        {totalFacilityPoints > 20 && <AlertTriangle className="h-5 w-5 text-red-600" />}
                      </div>
                    </div>
                    {totalFacilityPoints !== 20 && (
                      <p className="text-sm text-gray-600 mt-2">
                        {totalFacilityPoints < 20 
                          ? `あと${20 - totalFacilityPoints}点選択してください`
                          : `${totalFacilityPoints - 20}点超過しています。項目を調整してください`}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: 貢献度評価の確認 */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    貢献度評価（50点）は年2回の評価で構成されます。相対評価により最終スコアが決定されます。
                  </AlertDescription>
                </Alert>

                {/* 年間スケジュール */}
                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      年間評価スケジュール
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-white rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">6月</div>
                        <div className="text-sm font-medium mt-1">夏季貢献度評価</div>
                        <div className="mt-2 space-y-1">
                          <div className="text-xs">施設貢献: {designData.contributionSettings.summerFacility}点</div>
                          <div className="text-xs">法人貢献: {designData.contributionSettings.summerCorporate}点</div>
                        </div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg">
                        <div className="text-2xl font-bold text-green-600">12月</div>
                        <div className="text-sm font-medium mt-1">冬季貢献度評価</div>
                        <div className="mt-2 space-y-1">
                          <div className="text-xs">施設貢献: {designData.contributionSettings.winterFacility}点</div>
                          <div className="text-xs">法人貢献: {designData.contributionSettings.winterCorporate}点</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 評価軸 */}
                <div className="grid grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        施設貢献度（25点）
                      </CardTitle>
                      <CardDescription>施設内での活動と貢献を評価</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {designData.contributionSettings.evaluationAxes.facility.map((axis, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{axis}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        法人貢献度（25点）
                      </CardTitle>
                      <CardDescription>法人全体での活動と貢献を評価</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {designData.contributionSettings.evaluationAxes.corporate.map((axis, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{axis}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 相対評価の説明 */}
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-orange-600" />
                      4軸独立相対評価システム
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">評価分布（パーセンタイル）</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>上位10%</span>
                            <Badge className="bg-purple-600">S</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>上位11-30%</span>
                            <Badge className="bg-blue-600">A</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>中位31-70%</span>
                            <Badge className="bg-green-600">B</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>下位71-90%</span>
                            <Badge className="bg-yellow-600">C</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>下位91-100%</span>
                            <Badge className="bg-red-600">D</Badge>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">評価の独立性</h4>
                        <div className="space-y-2 text-sm">
                          <div className="p-2 bg-white rounded">
                            <span className="font-medium">夏季施設</span>
                            <Progress value={25} className="mt-1 h-2" />
                          </div>
                          <div className="p-2 bg-white rounded">
                            <span className="font-medium">夏季法人</span>
                            <Progress value={25} className="mt-1 h-2" />
                          </div>
                          <div className="p-2 bg-white rounded">
                            <span className="font-medium">冬季施設</span>
                            <Progress value={25} className="mt-1 h-2" />
                          </div>
                          <div className="p-2 bg-white rounded">
                            <span className="font-medium">冬季法人</span>
                            <Progress value={25} className="mt-1 h-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 4: シミュレーション */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    設定した評価制度でのシミュレーション結果を確認してください。
                  </AlertDescription>
                </Alert>

                {/* シミュレーションパラメータ */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      シミュレーションパラメータ
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>想定成績レベル</Label>
                        <Select defaultValue="average">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excellent">優秀（上位10%）</SelectItem>
                            <SelectItem value="good">良好（上位30%）</SelectItem>
                            <SelectItem value="average">平均（中位50%）</SelectItem>
                            <SelectItem value="below">課題あり（下位30%）</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>職員数</Label>
                        <Select defaultValue="100">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="50">50名</SelectItem>
                            <SelectItem value="100">100名</SelectItem>
                            <SelectItem value="200">200名</SelectItem>
                            <SelectItem value="500">500名</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>分布パターン</Label>
                        <Select defaultValue="normal">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">正規分布</SelectItem>
                            <SelectItem value="skewed-high">高得点寄り</SelectItem>
                            <SelectItem value="skewed-low">低得点寄り</SelectItem>
                            <SelectItem value="bimodal">二山分布</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>評価シミュレーション</CardTitle>
                    <CardDescription>
                      {facilityTypes[selectedFacilityType as keyof typeof facilityTypes]} - 
                      {roles[selectedRole as keyof typeof roles]} - 
                      {experienceLevels[selectedLevel as keyof typeof experienceLevels]}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* 技術評価の内訳 */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          技術評価（50点）
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <Card className="bg-blue-50">
                            <CardContent className="py-3">
                              <div className="space-y-2">
                                <div className="text-sm font-medium">法人統一項目（30点）</div>
                                {Object.entries(designData.coreItems).map(([key, item]) => (
                                  <div key={key} className="flex justify-between text-xs">
                                    <span>{key}: {item.name}</span>
                                    <span>上司{item.superior}点 + 本人{item.self}点</span>
                                  </div>
                                ))}
                                <div className="pt-2 border-t flex justify-between font-bold">
                                  <span>想定スコア</span>
                                  <span className="text-blue-600">26/30点</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-green-50">
                            <CardContent className="py-3">
                              <div className="space-y-2">
                                <div className="text-sm font-medium">施設特化項目（20点）</div>
                                {Object.entries(designData.facilityItems.allocation).map(([itemId, points]) => {
                                  const item = facilitySpecificItems.find(i => i.id === itemId);
                                  return (
                                    <div key={itemId} className="flex justify-between text-xs">
                                      <span>{item?.name}</span>
                                      <span>{points}点</span>
                                    </div>
                                  );
                                })}
                                <div className="pt-2 border-t flex justify-between font-bold">
                                  <span>想定スコア</span>
                                  <span className="text-green-600">17/20点</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* 貢献度評価の内訳 */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          貢献度評価（50点）
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <Card className="bg-purple-50">
                            <CardContent className="py-3">
                              <div className="space-y-2">
                                <div className="text-sm font-medium">施設貢献度（25点）</div>
                                <div className="flex justify-between text-xs">
                                  <span>夏季評価</span>
                                  <span>10/12.5点</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span>冬季評価</span>
                                  <span>11/12.5点</span>
                                </div>
                                <div className="pt-2 border-t flex justify-between font-bold">
                                  <span>小計</span>
                                  <span className="text-purple-600">21/25点</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-orange-50">
                            <CardContent className="py-3">
                              <div className="space-y-2">
                                <div className="text-sm font-medium">法人貢献度（25点）</div>
                                <div className="flex justify-between text-xs">
                                  <span>夏季評価</span>
                                  <span>9/12.5点</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span>冬季評価</span>
                                  <span>10/12.5点</span>
                                </div>
                                <div className="pt-2 border-t flex justify-between font-bold">
                                  <span>小計</span>
                                  <span className="text-orange-600">19/25点</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* 最終評価 */}
                      <Card className="border-2 border-purple-200">
                        <CardContent className="py-4">
                          <div className="grid grid-cols-4 gap-4 text-center">
                            <div>
                              <div className="text-sm text-gray-600">総合スコア</div>
                              <div className="text-3xl font-bold text-purple-600 mt-1">83</div>
                              <div className="text-xs text-gray-500">/ 100点</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">施設内評価</div>
                              <div className="text-2xl font-bold text-blue-600 mt-1">A</div>
                              <div className="text-xs text-gray-500">上位20%</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">法人内評価</div>
                              <div className="text-2xl font-bold text-green-600 mt-1">B</div>
                              <div className="text-xs text-gray-500">中位40%</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">最終評価</div>
                              <div className="text-3xl font-bold text-purple-600 mt-1">A</div>
                              <div className="text-xs text-gray-500">7段階評価</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                {/* 詳細分析 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      影響度分析
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">評価項目の影響度</h4>
                        <div className="space-y-2">
                          {Object.entries(designData.coreItems).map(([key, item]) => (
                            <div key={key} className="flex items-center justify-between">
                              <span className="text-sm">{item.name}</span>
                              <div className="flex items-center gap-2">
                                <Progress value={(item.superior + item.self) * 10} className="w-32 h-2" />
                                <span className="text-xs text-gray-500">
                                  {((item.superior + item.self) / 50 * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">職員層別適合度</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-3 bg-green-50 rounded">
                            <div className="text-sm font-medium text-green-700">新人・若手</div>
                            <div className="text-2xl font-bold text-green-600 mt-1">85%</div>
                            <div className="text-xs text-gray-600">基礎項目重視の配点</div>
                          </div>
                          <div className="p-3 bg-blue-50 rounded">
                            <div className="text-sm font-medium text-blue-700">中堅</div>
                            <div className="text-2xl font-bold text-blue-600 mt-1">92%</div>
                            <div className="text-xs text-gray-600">バランス型配点</div>
                          </div>
                          <div className="p-3 bg-purple-50 rounded">
                            <div className="text-sm font-medium text-purple-700">ベテラン</div>
                            <div className="text-2xl font-bold text-purple-600 mt-1">88%</div>
                            <div className="text-xs text-gray-600">専門性重視の配点</div>
                          </div>
                          <div className="p-3 bg-orange-50 rounded">
                            <div className="text-sm font-medium text-orange-700">管理職</div>
                            <div className="text-2xl font-bold text-orange-600 mt-1">90%</div>
                            <div className="text-xs text-gray-600">マネジメント重視</div>
                          </div>
                        </div>
                      </div>

                      <Alert className="border-blue-200 bg-blue-50">
                        <Lightbulb className="h-4 w-4 text-blue-600" />
                        <AlertDescription>
                          <strong>最適化提案:</strong>
                          <br />• 新人向けに基礎技術項目の配点を+2点増やすことを推奨
                          <br />• 中堅層のリーダーシップ項目を強化すると組織力向上に寄与
                          <br />• 貢献度評価とのバランスは適切です
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full"
                    onClick={() => {
                      alert('シミュレーションパラメータを変更して再計算します');
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    条件を変更して再シミュレーション
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full"
                    onClick={() => {
                      alert('分布グラフを表示します（グラフコンポーネント実装予定）');
                    }}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    詳細分布グラフを表示
                  </Button>
                </div>
              </div>
            )}

            {/* Step 5: 確認と保存 */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <Alert className="border-green-200 bg-green-50">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    設定内容を確認し、保存してください。保存後は各施設への通知と承認プロセスに進みます。
                  </AlertDescription>
                </Alert>

                {/* 設定名入力 */}
                <Card>
                  <CardHeader>
                    <CardTitle>設定名</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="例: 2025年度急性期病院看護職評価基準"
                        value={configName}
                        onChange={(e) => setConfigName(e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-md"
                      />
                      <Button onClick={saveConfiguration}>
                        <Save className="h-4 w-4 mr-2" />
                        保存
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* 保存済み設定 */}
                {savedConfigs.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>保存済み設定</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {savedConfigs.map((config) => (
                          <div key={config.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                            <div>
                              <div className="font-medium">{config.name}</div>
                              <div className="text-sm text-gray-500">
                                {facilityTypes[config.facilityType as keyof typeof facilityTypes]} - 
                                {roles[config.role as keyof typeof roles]} - 
                                {experienceLevels[config.level as keyof typeof experienceLevels]}
                              </div>
                              <div className="text-xs text-gray-400">
                                作成: {new Date(config.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => loadConfiguration(config)}
                            >
                              読み込み
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>設定内容サマリー</CardTitle>
                    <CardDescription>
                      {facilityTypes[selectedFacilityType as keyof typeof facilityTypes]} - 
                      {roles[selectedRole as keyof typeof roles]} - 
                      {experienceLevels[selectedLevel as keyof typeof experienceLevels]}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* 技術評価サマリー */}
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <FileCheck className="h-4 w-4" />
                          技術評価（50点）
                        </h4>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium">法人統一項目（30点）</span>
                            <div className="ml-4 mt-1 space-y-1 text-sm text-gray-600">
                              {Object.entries(designData.coreItems).map(([key, item]) => (
                                <div key={key} className="flex justify-between">
                                  <span>{key}: {item.name}</span>
                                  <span>上司{item.superior}点 / 本人{item.self}点</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm font-medium">施設特化項目（20点）</span>
                            <div className="ml-4 mt-1 space-y-1 text-sm text-gray-600">
                              {Object.entries(designData.facilityItems.allocation).map(([itemId, points]) => {
                                const item = facilitySpecificItems.find(i => i.id === itemId);
                                return (
                                  <div key={itemId} className="flex justify-between">
                                    <span>{item?.name}</span>
                                    <span>{points}点</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 貢献度評価サマリー */}
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          貢献度評価（50点）
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">夏季評価（6月）</span>
                            <div className="mt-1 space-y-1 text-gray-600">
                              <div className="flex justify-between">
                                <span>施設貢献</span>
                                <span>{designData.contributionSettings.summerFacility}点</span>
                              </div>
                              <div className="flex justify-between">
                                <span>法人貢献</span>
                                <span>{designData.contributionSettings.summerCorporate}点</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">冬季評価（12月）</span>
                            <div className="mt-1 space-y-1 text-gray-600">
                              <div className="flex justify-between">
                                <span>施設貢献</span>
                                <span>{designData.contributionSettings.winterFacility}点</span>
                              </div>
                              <div className="flex justify-between">
                                <span>法人貢献</span>
                                <span>{designData.contributionSettings.winterCorporate}点</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 最終評価方式 */}
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          最終評価決定方式
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>• 施設内相対評価（同職種内順位）→ 5段階評価</div>
                          <div>• 法人内相対評価（全施設同職種順位）→ 5段階評価</div>
                          <div>• 2軸マトリクスによる7段階総合評価決定</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button 
                    size="lg" 
                    className="flex-1"
                    onClick={() => {
                      saveConfiguration();
                      alert('設定を保存し、承認申請プロセスを開始しました');
                    }}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    設定を保存して承認申請
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => setShowDesignSupport(!showDesignSupport)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    詳細設計支援ツール
                  </Button>
                </div>

                {/* EvaluationDesignSupport統合 */}
                {showDesignSupport && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>評価設計支援ツール</CardTitle>
                      <CardDescription>
                        評価シートの体系的設計知見を活用した詳細な設計支援
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <EvaluationDesignSupport 
                        onConfigChange={(config) => {
                          console.log('Design support config changed:', config);
                          // 設計支援ツールからの変更を反映
                          if (config.facilityItems && config.facilityItems.length > 0) {
                            const newFacilityItems = config.facilityItems.reduce((acc: any, item) => {
                              acc.selected.push(item.id);
                              acc.allocation[item.id] = item.points;
                              return acc;
                            }, { selected: [], allocation: {} });
                            
                            setDesignData(prev => ({
                              ...prev,
                              facilityItems: newFacilityItems
                            }));
                          }
                        }}
                      />
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ナビゲーションボタン */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            前へ
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <HelpCircle className="h-4 w-4 mr-2" />
              ヘルプ
            </Button>
          </div>

          <Button
            onClick={handleNext}
            disabled={
              currentStep === wizardSteps.length - 1 ||
              (currentStep === 2 && totalFacilityPoints !== 20)
            }
          >
            {currentStep === wizardSteps.length - 1 ? '完了' : '次へ'}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}