'use client';

import React, { useState } from 'react';
import CommonHeader from '@/components/CommonHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
  HelpCircle
} from 'lucide-react';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

export default function EvaluationWizardPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [designData, setDesignData] = useState({
    // 法人統一項目の配分
    coreItems: {
      C01: { superior: 7, self: 3 }, // 専門技術
      C02: { superior: 5, self: 5 }, // 対人関係
      C03: { superior: 8, self: 2 }  // 安全管理
    },
    // 施設特化項目
    facilityItems: {
      selected: [] as string[],
      allocation: {} as Record<string, number>
    },
    // 貢献度評価設定
    contributionSettings: {
      facilityWeight: 50,
      corporateWeight: 50,
      evaluationCriteria: [] as string[]
    }
  });

  const wizardSteps: WizardStep[] = [
    {
      id: 'core-allocation',
      title: '法人統一項目の配分設計',
      description: '30点の評価者配分を設定',
      icon: Settings
    },
    {
      id: 'facility-selection',
      title: '施設特化項目の選定',
      description: '20点分の項目を選択',
      icon: Building
    },
    {
      id: 'contribution-setup',
      title: '貢献度評価の設定',
      description: '評価軸と基準を確認',
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
    const total = 10; // 各カテゴリーは10点固定
    
    setDesignData(prev => ({
      ...prev,
      coreItems: {
        ...prev.coreItems,
        [category]: {
          [type]: newValue,
          [otherType]: total - newValue
        }
      }
    }));
  };

  // 施設特化項目のサンプルデータ
  const facilityItemOptions = [
    { id: 'F01', name: '救急対応スキル', maxPoints: 10, description: '急性期病院向け' },
    { id: 'F02', name: 'リハビリテーション看護', maxPoints: 10, description: '回復期病院向け' },
    { id: 'F03', name: '認知症ケア', maxPoints: 10, description: '慢性期・老健向け' },
    { id: 'F04', name: '褥瘡ケア', maxPoints: 5, description: '慢性期病院向け' },
    { id: 'F05', name: '在宅復帰支援', maxPoints: 5, description: '回復期・老健向け' },
    { id: 'F06', name: '高度医療機器操作', maxPoints: 5, description: '急性期病院向け' }
  ];

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
            {/* Step 1: 法人統一項目の配分 */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    法人統一項目（30点）の各カテゴリーで、上司評価と本人評価の配分を設定します。
                    項目の特性に応じて適切な比率を選択してください。
                  </AlertDescription>
                </Alert>

                <div className="space-y-6">
                  {/* C01: 専門技術・スキル */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">C01: 専門技術・スキル（10点）</CardTitle>
                      <CardDescription>
                        客観的に評価しやすい技術面は上司評価の比重を高めに設定
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">上司評価</span>
                          <span className="text-2xl font-bold text-blue-600">
                            {designData.coreItems.C01.superior}点
                          </span>
                        </div>
                        <Slider
                          value={[designData.coreItems.C01.superior]}
                          onValueChange={(value) => handleSliderChange('C01', 'superior', value)}
                          max={10}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">本人評価</span>
                          <span className="text-2xl font-bold text-green-600">
                            {designData.coreItems.C01.self}点
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* C02: 対人関係・ケア */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">C02: 対人関係・ケア（10点）</CardTitle>
                      <CardDescription>
                        対人スキルは上司と本人の視点を均等に評価
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">上司評価</span>
                          <span className="text-2xl font-bold text-blue-600">
                            {designData.coreItems.C02.superior}点
                          </span>
                        </div>
                        <Slider
                          value={[designData.coreItems.C02.superior]}
                          onValueChange={(value) => handleSliderChange('C02', 'superior', value)}
                          max={10}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">本人評価</span>
                          <span className="text-2xl font-bold text-green-600">
                            {designData.coreItems.C02.self}点
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* C03: 安全・品質管理 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">C03: 安全・品質管理（10点）</CardTitle>
                      <CardDescription>
                        組織の安全管理は上司の客観的評価を重視
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">上司評価</span>
                          <span className="text-2xl font-bold text-blue-600">
                            {designData.coreItems.C03.superior}点
                          </span>
                        </div>
                        <Slider
                          value={[designData.coreItems.C03.superior]}
                          onValueChange={(value) => handleSliderChange('C03', 'superior', value)}
                          max={10}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">本人評価</span>
                          <span className="text-2xl font-bold text-green-600">
                            {designData.coreItems.C03.self}点
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    <strong>推奨パターン:</strong> 技術重視型（7:3）、バランス型（5:5）、管理重視型（8:2）
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Step 2: 施設特化項目の選定 */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    施設の特性に応じて評価項目を選択し、合計20点になるよう配分してください。
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 gap-4">
                  {facilityItemOptions.map((item) => (
                    <Card key={item.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{item.name}</CardTitle>
                            <CardDescription className="text-xs mt-1">
                              {item.description}
                            </CardDescription>
                          </div>
                          <Badge variant="secondary">最大{item.maxPoints}点</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Label className="text-sm">配分点数</Label>
                          <Slider
                            value={[designData.facilityItems.allocation[item.id] || 0]}
                            onValueChange={(value) => {
                              setDesignData(prev => ({
                                ...prev,
                                facilityItems: {
                                  ...prev.facilityItems,
                                  allocation: {
                                    ...prev.facilityItems.allocation,
                                    [item.id]: value[0]
                                  }
                                }
                              }));
                            }}
                            max={item.maxPoints}
                            min={0}
                            step={5}
                            className="w-full"
                          />
                          <div className="text-right">
                            <span className="text-xl font-bold">
                              {designData.facilityItems.allocation[item.id] || 0}点
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">合計配分</span>
                      <span className={`text-2xl font-bold ${
                        Object.values(designData.facilityItems.allocation).reduce((a, b) => a + b, 0) === 20
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {Object.values(designData.facilityItems.allocation).reduce((a, b) => a + b, 0)} / 20点
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: 貢献度評価の設定 */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    貢献度評価（50点）は相対評価で決定されます。評価軸と基準を確認してください。
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">施設貢献度（25点）</CardTitle>
                      <CardDescription>施設内での活動と貢献を評価</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">組織貢献度ポイント</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">部署内協力・チームワーク</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">業務改善提案・実施</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">施設行事・委員会参加</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">法人貢献度（25点）</CardTitle>
                      <CardDescription>法人全体での活動と貢献を評価</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">法人活動参画</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">法人研修・勉強会参加</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">法人間連携・支援</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">法人理念の実践</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader>
                    <CardTitle className="text-lg">相対評価の仕組み</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="font-medium">上位10%</span>
                        <Badge className="bg-purple-600">S評価</Badge>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="font-medium">上位11-30%</span>
                        <Badge className="bg-blue-600">A評価</Badge>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="font-medium">中位31-70%</span>
                        <Badge className="bg-green-600">B評価</Badge>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="font-medium">下位71-90%</span>
                        <Badge className="bg-yellow-600">C評価</Badge>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="font-medium">下位91-100%</span>
                        <Badge className="bg-red-600">D評価</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 4: シミュレーション */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    設定した評価制度でのシミュレーション結果を確認してください。
                  </AlertDescription>
                </Alert>

                <Card>
                  <CardHeader>
                    <CardTitle>サンプル職員での評価シミュレーション</CardTitle>
                    <CardDescription>中堅看護師（5年目）の場合</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">技術評価（50点）</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>法人統一項目</span>
                              <span className="font-bold">28/30点</span>
                            </div>
                            <div className="flex justify-between">
                              <span>施設特化項目</span>
                              <span className="font-bold">17/20点</span>
                            </div>
                            <div className="flex justify-between font-bold text-blue-600">
                              <span>小計</span>
                              <span>45/50点</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">貢献度評価（50点）</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>施設貢献度</span>
                              <span className="font-bold">20/25点</span>
                            </div>
                            <div className="flex justify-between">
                              <span>法人貢献度</span>
                              <span className="font-bold">18/25点</span>
                            </div>
                            <div className="flex justify-between font-bold text-green-600">
                              <span>小計</span>
                              <span>38/50点</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold">総合評価</span>
                          <span className="text-2xl font-bold text-purple-600">83/100点</span>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                          <div>
                            <span className="text-sm text-gray-600">施設内評価</span>
                            <div className="text-xl font-bold text-blue-600 mt-1">A</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">法人内評価</span>
                            <div className="text-xl font-bold text-green-600 mt-1">B</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">最終評価</span>
                            <div className="text-2xl font-bold text-purple-600 mt-1">A</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" size="lg" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    他の職種でシミュレーション
                  </Button>
                  <Button variant="outline" size="lg" className="w-full">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    分布グラフを表示
                  </Button>
                </div>
              </div>
            )}

            {/* Step 5: 確認と保存 */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <Alert className="border-green-200 bg-green-50">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    設定内容を確認し、保存してください。保存後は各施設への通知と承認プロセスに進みます。
                  </AlertDescription>
                </Alert>

                <Card>
                  <CardHeader>
                    <CardTitle>設定内容サマリー</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">法人統一項目（30点）</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>C01: 専門技術・スキル</span>
                            <span>上司{designData.coreItems.C01.superior}点 / 本人{designData.coreItems.C01.self}点</span>
                          </div>
                          <div className="flex justify-between">
                            <span>C02: 対人関係・ケア</span>
                            <span>上司{designData.coreItems.C02.superior}点 / 本人{designData.coreItems.C02.self}点</span>
                          </div>
                          <div className="flex justify-between">
                            <span>C03: 安全・品質管理</span>
                            <span>上司{designData.coreItems.C03.superior}点 / 本人{designData.coreItems.C03.self}点</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">施設特化項目（20点）</h4>
                        <div className="space-y-1 text-sm">
                          {Object.entries(designData.facilityItems.allocation)
                            .filter(([_, points]) => points > 0)
                            .map(([itemId, points]) => {
                              const item = facilityItemOptions.find(opt => opt.id === itemId);
                              return (
                                <div key={itemId} className="flex justify-between">
                                  <span>{item?.name}</span>
                                  <span>{points}点</span>
                                </div>
                              );
                            })}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">貢献度評価（50点）</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>施設貢献度</span>
                            <span>25点（相対評価）</span>
                          </div>
                          <div className="flex justify-between">
                            <span>法人貢献度</span>
                            <span>25点（相対評価）</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button size="lg" className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    設定を保存して承認申請
                  </Button>
                  <Button size="lg" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    プレビュー
                  </Button>
                </div>
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
            disabled={currentStep === wizardSteps.length - 1}
          >
            次へ
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}