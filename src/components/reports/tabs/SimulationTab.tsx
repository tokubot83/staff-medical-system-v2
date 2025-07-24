'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Calculator, TrendingUp, Users, DollarSign, AlertTriangle, Settings } from 'lucide-react';
import { obaraStaffDatabase, tachigamiStaffDatabase } from '@/app/data/staffData';
import { StaffDetail } from '@/types/staff';

interface SimulationTabProps {
  selectedFacility: string;
}

interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  type: 'hiring' | 'retention' | 'organization' | 'cost';
}

interface SimulationResult {
  metric: string;
  current: number;
  projected: number;
  change: number;
  impact: 'positive' | 'negative' | 'neutral';
}

export default function SimulationTab({ selectedFacility }: SimulationTabProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>('hiring');
  const [simulationParams, setSimulationParams] = useState({
    hiringCount: 10,
    retentionImprovement: 5,
    salaryIncrease: 3,
    trainingBudget: 20,
    workFromHomeDays: 2,
    overtimeReduction: 10
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // 施設に応じたスタッフデータを取得
  const staffData = useMemo(() => {
    if (selectedFacility === '小原病院') {
      return Object.values(obaraStaffDatabase);
    } else if (selectedFacility === '立神リハビリテーション温泉病院') {
      return Object.values(tachigamiStaffDatabase);
    } else {
      return [...Object.values(obaraStaffDatabase), ...Object.values(tachigamiStaffDatabase)];
    }
  }, [selectedFacility]);

  // シミュレーションシナリオ
  const scenarios: SimulationScenario[] = [
    {
      id: 'hiring',
      name: '採用計画シミュレーション',
      description: '新規採用による組織への影響を予測',
      type: 'hiring'
    },
    {
      id: 'retention',
      name: 'リテンション施策効果',
      description: '各種施策による定着率改善を予測',
      type: 'retention'
    },
    {
      id: 'organization',
      name: '組織改編シミュレーション',
      description: '部署再編による効率化を検証',
      type: 'organization'
    },
    {
      id: 'cost',
      name: '人件費最適化',
      description: '給与・福利厚生変更の影響分析',
      type: 'cost'
    }
  ];

  // シミュレーション実行
  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setShowResults(true);
    }, 1500);
  };

  // シミュレーション結果の計算
  const simulationResults = useMemo(() => {
    if (!showResults) return [];

    const results: SimulationResult[] = [];
    const currentStaffCount = staffData.length;
    const currentTurnoverRate = 15.2;
    const currentEngagement = 72.5;
    const currentProductivity = 85.3;
    const currentCostPerEmployee = 5500000;

    switch (selectedScenario) {
      case 'hiring':
        results.push({
          metric: '総従業員数',
          current: currentStaffCount,
          projected: currentStaffCount + simulationParams.hiringCount,
          change: simulationParams.hiringCount,
          impact: 'positive'
        });
        results.push({
          metric: '人件費総額（百万円）',
          current: Math.round(currentStaffCount * currentCostPerEmployee / 1000000),
          projected: Math.round((currentStaffCount + simulationParams.hiringCount) * currentCostPerEmployee / 1000000),
          change: Math.round(simulationParams.hiringCount * currentCostPerEmployee / 1000000),
          impact: 'negative'
        });
        results.push({
          metric: '平均勤続年数',
          current: 5.8,
          projected: 5.2,
          change: -0.6,
          impact: 'negative'
        });
        results.push({
          metric: '教育コスト（百万円）',
          current: 0,
          projected: simulationParams.hiringCount * 0.5,
          change: simulationParams.hiringCount * 0.5,
          impact: 'negative'
        });
        break;

      case 'retention':
        const improvedTurnover = currentTurnoverRate - simulationParams.retentionImprovement;
        const improvedEngagement = currentEngagement + (simulationParams.workFromHomeDays * 2);
        results.push({
          metric: '離職率（%）',
          current: currentTurnoverRate,
          projected: improvedTurnover,
          change: -simulationParams.retentionImprovement,
          impact: 'positive'
        });
        results.push({
          metric: 'エンゲージメント（%）',
          current: currentEngagement,
          projected: improvedEngagement,
          change: simulationParams.workFromHomeDays * 2,
          impact: 'positive'
        });
        results.push({
          metric: '採用コスト削減（百万円/年）',
          current: 0,
          projected: simulationParams.retentionImprovement * 2.5,
          change: simulationParams.retentionImprovement * 2.5,
          impact: 'positive'
        });
        results.push({
          metric: '生産性向上（%）',
          current: currentProductivity,
          projected: currentProductivity + simulationParams.retentionImprovement * 0.8,
          change: simulationParams.retentionImprovement * 0.8,
          impact: 'positive'
        });
        break;

      case 'cost':
        const newCostPerEmployee = currentCostPerEmployee * (1 + simulationParams.salaryIncrease / 100);
        const totalCostIncrease = currentStaffCount * (newCostPerEmployee - currentCostPerEmployee) / 1000000;
        results.push({
          metric: '平均人件費（万円）',
          current: Math.round(currentCostPerEmployee / 10000),
          projected: Math.round(newCostPerEmployee / 10000),
          change: Math.round((newCostPerEmployee - currentCostPerEmployee) / 10000),
          impact: 'negative'
        });
        results.push({
          metric: '人件費総額増加（百万円）',
          current: 0,
          projected: Math.round(totalCostIncrease),
          change: Math.round(totalCostIncrease),
          impact: 'negative'
        });
        results.push({
          metric: '予想離職率改善（%）',
          current: currentTurnoverRate,
          projected: currentTurnoverRate - simulationParams.salaryIncrease * 0.5,
          change: -simulationParams.salaryIncrease * 0.5,
          impact: 'positive'
        });
        results.push({
          metric: 'ROI（投資対効果）',
          current: 100,
          projected: 100 + simulationParams.salaryIncrease * 3,
          change: simulationParams.salaryIncrease * 3,
          impact: 'positive'
        });
        break;

      default:
        break;
    }

    return results;
  }, [selectedScenario, simulationParams, showResults, staffData]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">What-if シミュレーション</h2>
          <p className="text-gray-600">各種施策の影響を事前に予測・検証</p>
        </div>
      </div>

      {/* シナリオ選択 */}
      <Card>
        <CardHeader>
          <CardTitle>シミュレーションシナリオ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {scenarios.map(scenario => (
              <button
                key={scenario.id}
                onClick={() => {
                  setSelectedScenario(scenario.id);
                  setShowResults(false);
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedScenario === scenario.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h4 className="font-semibold text-sm mb-1">{scenario.name}</h4>
                <p className="text-xs text-gray-600">{scenario.description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* パラメータ設定 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            シミュレーションパラメータ
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedScenario === 'hiring' && (
            <div className="space-y-4">
              <div>
                <Label>新規採用人数</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Slider
                    value={[simulationParams.hiringCount]}
                    onValueChange={([value]) => setSimulationParams({...simulationParams, hiringCount: value})}
                    max={50}
                    min={1}
                    step={1}
                    className="flex-1"
                  />
                  <span className="w-12 text-right font-medium">{simulationParams.hiringCount}名</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>採用職種</Label>
                  <Select defaultValue="nurse">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nurse">看護師</SelectItem>
                      <SelectItem value="doctor">医師</SelectItem>
                      <SelectItem value="therapist">セラピスト</SelectItem>
                      <SelectItem value="admin">事務職</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>採用時期</Label>
                  <Select defaultValue="q1">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="q1">第1四半期</SelectItem>
                      <SelectItem value="q2">第2四半期</SelectItem>
                      <SelectItem value="q3">第3四半期</SelectItem>
                      <SelectItem value="q4">第4四半期</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {selectedScenario === 'retention' && (
            <div className="space-y-4">
              <div>
                <Label>在宅勤務日数（週）</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Slider
                    value={[simulationParams.workFromHomeDays]}
                    onValueChange={([value]) => setSimulationParams({...simulationParams, workFromHomeDays: value})}
                    max={5}
                    min={0}
                    step={1}
                    className="flex-1"
                  />
                  <span className="w-12 text-right font-medium">{simulationParams.workFromHomeDays}日</span>
                </div>
              </div>
              <div>
                <Label>残業時間削減（%）</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Slider
                    value={[simulationParams.overtimeReduction]}
                    onValueChange={([value]) => setSimulationParams({...simulationParams, overtimeReduction: value})}
                    max={50}
                    min={0}
                    step={5}
                    className="flex-1"
                  />
                  <span className="w-12 text-right font-medium">{simulationParams.overtimeReduction}%</span>
                </div>
              </div>
              <div>
                <Label>研修予算増加（%）</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Slider
                    value={[simulationParams.trainingBudget]}
                    onValueChange={([value]) => setSimulationParams({...simulationParams, trainingBudget: value})}
                    max={100}
                    min={0}
                    step={10}
                    className="flex-1"
                  />
                  <span className="w-12 text-right font-medium">{simulationParams.trainingBudget}%</span>
                </div>
              </div>
            </div>
          )}

          {selectedScenario === 'cost' && (
            <div className="space-y-4">
              <div>
                <Label>給与改定率（%）</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Slider
                    value={[simulationParams.salaryIncrease]}
                    onValueChange={([value]) => setSimulationParams({...simulationParams, salaryIncrease: value})}
                    max={10}
                    min={-5}
                    step={0.5}
                    className="flex-1"
                  />
                  <span className="w-16 text-right font-medium">
                    {simulationParams.salaryIncrease > 0 ? '+' : ''}{simulationParams.salaryIncrease}%
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>対象職種</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全職種</SelectItem>
                      <SelectItem value="nurse">看護職のみ</SelectItem>
                      <SelectItem value="medical">医療職のみ</SelectItem>
                      <SelectItem value="admin">事務職のみ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>実施時期</Label>
                  <Select defaultValue="april">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="april">4月</SelectItem>
                      <SelectItem value="october">10月</SelectItem>
                      <SelectItem value="january">1月</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button onClick={runSimulation} disabled={isSimulating}>
              {isSimulating ? (
                <>
                  <Calculator className="h-4 w-4 mr-2 animate-spin" />
                  シミュレーション中...
                </>
              ) : (
                <>
                  <Calculator className="h-4 w-4 mr-2" />
                  シミュレーション実行
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* シミュレーション結果 */}
      {showResults && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                シミュレーション結果
              </CardTitle>
              <CardDescription>
                現在の状態と施策実施後の予測値
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {simulationResults.map((result, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{result.metric}</h4>
                      <Badge variant={result.impact === 'positive' ? 'default' : result.impact === 'negative' ? 'destructive' : 'secondary'}>
                        {result.change > 0 ? '+' : ''}{result.change}
                      </Badge>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">現在</p>
                        <p className="font-semibold">{result.current}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">予測値</p>
                        <p className="font-semibold">{result.projected}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">変化</p>
                        <p className={`font-semibold ${getImpactColor(result.impact)}`}>
                          {result.change > 0 ? '+' : ''}{result.change}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>推奨アクション</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedScenario === 'hiring' && (
                  <>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="font-medium">段階的な採用を推奨</p>
                        <p className="text-sm text-gray-600">
                          一度に大量採用すると教育負荷が高まります。四半期ごとに分散させることを検討してください。
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">メンター制度の導入</p>
                        <p className="text-sm text-gray-600">
                          新入社員の早期定着のため、メンター制度の導入を推奨します。
                        </p>
                      </div>
                    </div>
                  </>
                )}
                {selectedScenario === 'retention' && (
                  <>
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">段階的な導入を推奨</p>
                        <p className="text-sm text-gray-600">
                          まず一部の部署でパイロット運用を行い、効果を検証してから全社展開することを推奨します。
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* 過去のシミュレーション履歴 */}
      <Card>
        <CardHeader>
          <CardTitle>シミュレーション履歴</CardTitle>
          <CardDescription>
            過去に実施したシミュレーションと実際の結果
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="border rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-sm">2024年10月 - リテンション施策</span>
                <Badge variant="default">実施済み</Badge>
              </div>
              <p className="text-sm text-gray-600">
                予測: 離職率3%減少 → 実績: 3.5%減少（予測精度: 117%）
              </p>
            </div>
            <div className="border rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-sm">2024年4月 - 新卒採用15名</span>
                <Badge variant="default">実施済み</Badge>
              </div>
              <p className="text-sm text-gray-600">
                予測: 定着率80% → 実績: 86.7%（予測精度: 108%）
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}