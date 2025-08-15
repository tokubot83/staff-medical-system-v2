'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  FlaskConical,
  Play,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Info,
  Download,
  BarChart3,
  Target,
  Users,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';
import { SimulationService, SimulationScenario, SimulationResults } from '@/services/simulationService';

export default function SimulationPage() {
  const [activeTab, setActiveTab] = useState('setup');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<SimulationResults | null>(null);
  
  // シミュレーションパラメータ
  const [parameters, setParameters] = useState({
    targetStaffCount: 100,
    experienceLevelDistribution: {
      new: 15,
      young: 20,
      midlevel: 30,
      veteran: 25,
      'ward-chief': 7,
      'ward-manager': 3
    },
    trainingCompletionRate: 0.75,
    facilityType: 'acute'
  });

  // シミュレーション実行
  const runSimulation = async () => {
    setIsRunning(true);
    try {
      const scenario: SimulationScenario = {
        id: `sim_${Date.now()}`,
        name: 'カスタムシミュレーション',
        description: '評価制度の影響分析',
        design: {}, // 実際の設計データを使用
        parameters,
        createdAt: new Date(),
        createdBy: 'current_user'
      };
      
      const result = await SimulationService.runSimulation(scenario);
      setResults(result);
      setActiveTab('results');
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  // リスクレベルのバッジ色
  const getRiskBadgeColor = (type: string) => {
    switch (type) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return '';
    }
  };

  // 優先度のバッジ色
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/evaluation-design">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  評価制度設計に戻る
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <FlaskConical className="w-7 h-7 text-purple-600" />
                  評価制度シミュレーション
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  評価設計の妥当性を検証し、改善点を発見します
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="setup">設定</TabsTrigger>
            <TabsTrigger value="results" disabled={!results}>結果</TabsTrigger>
            <TabsTrigger value="comparison" disabled={!results}>比較分析</TabsTrigger>
          </TabsList>

          {/* 設定タブ */}
          <TabsContent value="setup" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>シミュレーション条件</CardTitle>
                <CardDescription>
                  評価制度の影響を分析するための条件を設定します
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 対象人数 */}
                <div>
                  <Label>対象職員数</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      value={[parameters.targetStaffCount]}
                      onValueChange={(value) => 
                        setParameters({...parameters, targetStaffCount: value[0]})
                      }
                      min={50}
                      max={500}
                      step={10}
                      className="flex-1"
                    />
                    <span className="w-16 text-right font-medium">
                      {parameters.targetStaffCount}名
                    </span>
                  </div>
                </div>

                {/* 経験レベル分布 */}
                <div>
                  <Label>経験レベル分布</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <div>
                      <span className="text-sm text-gray-600">新人</span>
                      <Input
                        type="number"
                        value={parameters.experienceLevelDistribution.new}
                        onChange={(e) => setParameters({
                          ...parameters,
                          experienceLevelDistribution: {
                            ...parameters.experienceLevelDistribution,
                            new: parseInt(e.target.value) || 0
                          }
                        })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">若手</span>
                      <Input
                        type="number"
                        value={parameters.experienceLevelDistribution.young}
                        onChange={(e) => setParameters({
                          ...parameters,
                          experienceLevelDistribution: {
                            ...parameters.experienceLevelDistribution,
                            young: parseInt(e.target.value) || 0
                          }
                        })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">中堅</span>
                      <Input
                        type="number"
                        value={parameters.experienceLevelDistribution.midlevel}
                        onChange={(e) => setParameters({
                          ...parameters,
                          experienceLevelDistribution: {
                            ...parameters.experienceLevelDistribution,
                            midlevel: parseInt(e.target.value) || 0
                          }
                        })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* 研修完了率 */}
                <div>
                  <Label>法定研修完了率</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      value={[parameters.trainingCompletionRate * 100]}
                      onValueChange={(value) => 
                        setParameters({...parameters, trainingCompletionRate: value[0] / 100})
                      }
                      min={0}
                      max={100}
                      step={5}
                      className="flex-1"
                    />
                    <span className="w-16 text-right font-medium">
                      {Math.round(parameters.trainingCompletionRate * 100)}%
                    </span>
                  </div>
                </div>

                {/* 施設タイプ */}
                <div>
                  <Label>施設タイプ</Label>
                  <Select
                    value={parameters.facilityType}
                    onValueChange={(value) => 
                      setParameters({...parameters, facilityType: value})
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="acute">急性期病院</SelectItem>
                      <SelectItem value="rehab">回復期リハビリ</SelectItem>
                      <SelectItem value="elderly">介護老人保健施設</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 実行ボタン */}
                <Button
                  onClick={runSimulation}
                  disabled={isRunning}
                  size="lg"
                  className="w-full"
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      シミュレーション実行中...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      シミュレーションを実行
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 結果タブ */}
          <TabsContent value="results" className="space-y-6 mt-6">
            {results && (
              <>
                {/* サマリーカード */}
                <div className="grid grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">公平性指標</p>
                          <p className="text-2xl font-bold">{results.fairnessIndex}%</p>
                        </div>
                        <Target className="w-8 h-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">平均スコア</p>
                          <p className="text-2xl font-bold">
                            {results.scoreDistribution.mean.toFixed(1)}
                          </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">標準偏差</p>
                          <p className="text-2xl font-bold">
                            {results.scoreDistribution.standardDeviation.toFixed(1)}
                          </p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">リスク要因</p>
                          <p className="text-2xl font-bold">
                            {results.riskFactors.filter(r => r.type === 'high').length}
                          </p>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* スコア分布 */}
                <Card>
                  <CardHeader>
                    <CardTitle>スコア分布</CardTitle>
                    <CardDescription>
                      評価スコアの分布状況を確認します
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.scoreDistribution.histogram.map((bin) => (
                        <div key={bin.range} className="flex items-center gap-3">
                          <span className="w-20 text-sm font-medium">{bin.range}</span>
                          <div className="flex-1">
                            <Progress value={bin.percentage} className="h-6" />
                          </div>
                          <span className="w-16 text-right text-sm">
                            {bin.count}名 ({bin.percentage}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* リスク要因 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      リスク要因分析
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.riskFactors.map((risk, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={getRiskBadgeColor(risk.type)}>
                                  {risk.type === 'high' ? '高' : risk.type === 'medium' ? '中' : '低'}
                                </Badge>
                                <span className="font-medium">{risk.category}</span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{risk.description}</p>
                              <div className="space-y-1">
                                <p className="text-sm">
                                  <span className="font-medium">影響: </span>
                                  {risk.impact}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">対策: </span>
                                  {risk.mitigation}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 改善提案 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      改善提案
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.improvementSuggestions.map((suggestion, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <Badge className={getPriorityBadgeColor(suggestion.priority)}>
                              {suggestion.priority === 'high' ? '優先度高' : 
                               suggestion.priority === 'medium' ? '優先度中' : '優先度低'}
                            </Badge>
                            <div className="flex-1">
                              <h4 className="font-medium mb-2">{suggestion.area}</h4>
                              <div className="space-y-2 text-sm">
                                <p>
                                  <span className="text-gray-600">現状: </span>
                                  {suggestion.currentState}
                                </p>
                                <p>
                                  <span className="text-gray-600">提案: </span>
                                  {suggestion.suggestedChange}
                                </p>
                                <p>
                                  <span className="text-gray-600">期待効果: </span>
                                  {suggestion.expectedImpact}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 推奨事項 */}
                <Card>
                  <CardHeader>
                    <CardTitle>推奨事項</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {results.recommendations.map((rec, index) => (
                        <Alert key={index}>
                          <CheckCircle2 className="h-4 w-4" />
                          <AlertDescription>{rec}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* 比較分析タブ */}
          <TabsContent value="comparison" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>シナリオ比較分析</CardTitle>
                <CardDescription>
                  複数の評価設計案を比較して最適な選択を支援します
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>比較分析機能</AlertTitle>
                  <AlertDescription>
                    異なる評価配分や基準での結果を比較し、最適な設計を見つけることができます
                  </AlertDescription>
                </Alert>
                <Button className="w-full mt-4" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  シミュレーション結果をエクスポート
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}