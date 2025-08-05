'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, Calculator, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ChiefNurseEvaluationV2() {
  // 評価点数の状態管理
  const [scores, setScores] = useState({
    facility: {},
    corporate: {}
  });

  // 合計点数の計算
  const calculateTotal = (type: 'facility' | 'corporate') => {
    const typeScores = scores[type];
    return Object.values(typeScores).reduce((sum: number, score: any) => sum + (parseInt(score) || 0), 0);
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            看護師長 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            管理職用2軸評価方式
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              管理職評価は施設運営・法人戦略への貢献度を重視し、1-5点で採点します
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="facility-items">評価項目（施設）</TabsTrigger>
              <TabsTrigger value="corporate-items">評価項目（法人）</TabsTrigger>
              <TabsTrigger value="management">管理実績</TabsTrigger>
              <TabsTrigger value="kpi">業績指標</TabsTrigger>
              <TabsTrigger value="result">評価結果</TabsTrigger>
              <TabsTrigger value="feedback">フィードバック</TabsTrigger>
            </TabsList>

            {/* 基本情報タブ */}
            <TabsContent value="basic" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eval-date">評価日</Label>
                  <Input type="date" id="eval-date" />
                </div>
                <div>
                  <Label htmlFor="eval-period">評価期間</Label>
                  <Input type="text" id="eval-period" placeholder="2025年度" />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">管理職情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">氏名</Label>
                    <Input type="text" id="name" />
                  </div>
                  <div>
                    <Label htmlFor="employee-id">職員番号</Label>
                    <Input type="text" id="employee-id" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="facility">所属施設</Label>
                    <Input type="text" id="facility" />
                  </div>
                  <div>
                    <Label htmlFor="department">管理部署</Label>
                    <Input type="text" id="department" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="management-years">管理職経験年数</Label>
                    <Input type="text" id="management-years" placeholder="5年" />
                  </div>
                  <div>
                    <Label htmlFor="staff-count">管理職員数</Label>
                    <Input type="text" id="staff-count" placeholder="45名" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（看護部長）</Label>
                    <Input type="text" id="evaluator1" />
                  </div>
                  <div>
                    <Label htmlFor="evaluator2">2次評価者（施設長）</Label>
                    <Input type="text" id="evaluator2" />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 評価項目（施設）タブ */}
            <TabsContent value="facility-items" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設内評価項目</h3>
                <p className="text-sm text-gray-600 mb-4">
                  施設運営・部署管理の実績を評価（各項目1-5点）
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-4">1. 部署運営管理（20点満点）</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f1-1" className="flex-1">人員配置の最適化</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, facility: {...scores.facility, 'f1-1': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`f1-1-${n}`} />
                            <Label htmlFor={`f1-1-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f1-2" className="flex-1">業務効率化の推進</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, facility: {...scores.facility, 'f1-2': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`f1-2-${n}`} />
                            <Label htmlFor={`f1-2-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f1-3" className="flex-1">部署内調整・問題解決</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, facility: {...scores.facility, 'f1-3': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`f1-3-${n}`} />
                            <Label htmlFor={`f1-3-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f1-4" className="flex-1">他部門との連携構築</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, facility: {...scores.facility, 'f1-4': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`f1-4-${n}`} />
                            <Label htmlFor={`f1-4-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-4">2. 人材育成・労務管理（15点満点）</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f2-1" className="flex-1">スタッフ育成計画の実行</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, facility: {...scores.facility, 'f2-1': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`f2-1-${n}`} />
                            <Label htmlFor={`f2-1-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f2-2" className="flex-1">離職防止・定着率向上</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, facility: {...scores.facility, 'f2-2': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`f2-2-${n}`} />
                            <Label htmlFor={`f2-2-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f2-3" className="flex-1">労務管理の適正化</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, facility: {...scores.facility, 'f2-3': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`f2-3-${n}`} />
                            <Label htmlFor={`f2-3-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-4">3. 施設経営への貢献（15点満点）</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f3-1" className="flex-1">収益改善への取り組み</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, facility: {...scores.facility, 'f3-1': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`f3-1-${n}`} />
                            <Label htmlFor={`f3-1-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f3-2" className="flex-1">コスト管理の実績</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, facility: {...scores.facility, 'f3-2': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`f3-2-${n}`} />
                            <Label htmlFor={`f3-2-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f3-3" className="flex-1">施設運営への提言・実行</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, facility: {...scores.facility, 'f3-3': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`f3-3-${n}`} />
                            <Label htmlFor={`f3-3-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-lg">施設内評価 合計点</h4>
                    <div className="flex items-center space-x-2">
                      <Calculator className="h-5 w-5" />
                      <span className="text-2xl font-bold text-blue-600">
                        {calculateTotal('facility')} / 50点
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 評価項目（法人）タブ */}
            <TabsContent value="corporate-items" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">法人内評価項目</h3>
                <p className="text-sm text-gray-600 mb-4">
                  看護管理の専門性・法人戦略への貢献を評価（各項目1-5点）
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-4">1. 看護管理の専門性（20点満点）</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="c1-1" className="flex-1">看護の質向上への取り組み</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, corporate: {...scores.corporate, 'c1-1': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`c1-1-${n}`} />
                            <Label htmlFor={`c1-1-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="c1-2" className="flex-1">医療安全管理の実績</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, corporate: {...scores.corporate, 'c1-2': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`c1-2-${n}`} />
                            <Label htmlFor={`c1-2-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="c1-3" className="flex-1">看護体制の構築・改善</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, corporate: {...scores.corporate, 'c1-3': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`c1-3-${n}`} />
                            <Label htmlFor={`c1-3-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="c1-4" className="flex-1">看護基準・手順の整備</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, corporate: {...scores.corporate, 'c1-4': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`c1-4-${n}`} />
                            <Label htmlFor={`c1-4-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-4">2. 法人戦略への貢献（20点満点）</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="c2-1" className="flex-1">法人方針の理解と実践</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, corporate: {...scores.corporate, 'c2-1': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`c2-1-${n}`} />
                            <Label htmlFor={`c2-1-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="c2-2" className="flex-1">法人内プロジェクト参画</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, corporate: {...scores.corporate, 'c2-2': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`c2-2-${n}`} />
                            <Label htmlFor={`c2-2-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="c2-3" className="flex-1">新規事業・改革への貢献</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, corporate: {...scores.corporate, 'c2-3': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`c2-3-${n}`} />
                            <Label htmlFor={`c2-3-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="c2-4" className="flex-1">地域連携・渉外活動</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, corporate: {...scores.corporate, 'c2-4': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`c2-4-${n}`} />
                            <Label htmlFor={`c2-4-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-4">3. 管理者間連携・影響力（10点満点）</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="c3-1" className="flex-1">師長会での発言・提案</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, corporate: {...scores.corporate, 'c3-1': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`c3-1-${n}`} />
                            <Label htmlFor={`c3-1-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="c3-2" className="flex-1">他施設との協力・支援</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, corporate: {...scores.corporate, 'c3-2': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`c3-2-${n}`} />
                            <Label htmlFor={`c3-2-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                <div className="bg-green-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-lg">法人内評価 合計点</h4>
                    <div className="flex items-center space-x-2">
                      <Calculator className="h-5 w-5" />
                      <span className="text-2xl font-bold text-green-600">
                        {calculateTotal('corporate')} / 50点
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 管理実績タブ */}
            <TabsContent value="management" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">管理実績・成果</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">人材管理実績</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="staff-retention">職員定着率</Label>
                      <Input type="text" id="staff-retention" placeholder="95%" />
                    </div>
                    <div>
                      <Label htmlFor="staff-satisfaction">職員満足度</Label>
                      <Input type="text" id="staff-satisfaction" placeholder="4.2/5.0" />
                    </div>
                    <div>
                      <Label htmlFor="new-hires">新規採用実績</Label>
                      <Input type="text" id="new-hires" placeholder="8名" />
                    </div>
                    <div>
                      <Label htmlFor="promotion-count">昇進・昇格者数</Label>
                      <Input type="text" id="promotion-count" placeholder="3名" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">業務改善実績</h4>
                  <Textarea 
                    placeholder="実施した業務改善の具体例、効果測定結果など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3">教育・研修実績</h4>
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="training-plans">年間教育計画の達成率</Label>
                      <Input type="text" id="training-plans" placeholder="98%" />
                    </div>
                    <div>
                      <Label htmlFor="staff-certifications">職員の資格取得支援実績</Label>
                      <Textarea 
                        id="staff-certifications"
                        placeholder="認定看護師2名、専門看護師1名など"
                        className="min-h-[60px]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">経営貢献実績</h4>
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="revenue-contribution">収益改善への貢献</Label>
                      <Textarea 
                        id="revenue-contribution"
                        placeholder="病床稼働率向上、加算取得など"
                        className="min-h-[60px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cost-reduction">コスト削減実績</Label>
                      <Textarea 
                        id="cost-reduction"
                        placeholder="残業時間削減、物品管理の効率化など"
                        className="min-h-[60px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 業績指標タブ */}
            <TabsContent value="kpi" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">重要業績評価指標（KPI）</h3>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader className="bg-purple-50">
                    <CardTitle className="text-lg flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      部署運営指標
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>病床稼働率</Label>
                        <div className="flex items-center gap-2">
                          <Input type="text" placeholder="目標: 95%" className="w-32" />
                          <span>→</span>
                          <Input type="text" placeholder="実績: 97%" className="w-32" />
                        </div>
                      </div>
                      <div>
                        <Label>平均在院日数</Label>
                        <div className="flex items-center gap-2">
                          <Input type="text" placeholder="目標: 14日" className="w-32" />
                          <span>→</span>
                          <Input type="text" placeholder="実績: 12.5日" className="w-32" />
                        </div>
                      </div>
                      <div>
                        <Label>看護必要度達成率</Label>
                        <div className="flex items-center gap-2">
                          <Input type="text" placeholder="目標: 35%" className="w-32" />
                          <span>→</span>
                          <Input type="text" placeholder="実績: 38%" className="w-32" />
                        </div>
                      </div>
                      <div>
                        <Label>インシデント発生率</Label>
                        <div className="flex items-center gap-2">
                          <Input type="text" placeholder="目標: <1.0%" className="w-32" />
                          <span>→</span>
                          <Input type="text" placeholder="実績: 0.8%" className="w-32" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="bg-orange-50">
                    <CardTitle className="text-lg flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      人材管理指標
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>離職率</Label>
                        <div className="flex items-center gap-2">
                          <Input type="text" placeholder="目標: <10%" className="w-32" />
                          <span>→</span>
                          <Input type="text" placeholder="実績: 5%" className="w-32" />
                        </div>
                      </div>
                      <div>
                        <Label>時間外勤務時間</Label>
                        <div className="flex items-center gap-2">
                          <Input type="text" placeholder="目標: 10h/月" className="w-32" />
                          <span>→</span>
                          <Input type="text" placeholder="実績: 8.5h/月" className="w-32" />
                        </div>
                      </div>
                      <div>
                        <Label>有給取得率</Label>
                        <div className="flex items-center gap-2">
                          <Input type="text" placeholder="目標: 70%" className="w-32" />
                          <span>→</span>
                          <Input type="text" placeholder="実績: 75%" className="w-32" />
                        </div>
                      </div>
                      <div>
                        <Label>研修参加率</Label>
                        <div className="flex items-center gap-2">
                          <Input type="text" placeholder="目標: 90%" className="w-32" />
                          <span>→</span>
                          <Input type="text" placeholder="実績: 92%" className="w-32" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <Label htmlFor="kpi-summary">KPI達成に関する総評</Label>
                  <Textarea 
                    id="kpi-summary"
                    placeholder="目標達成状況の分析、改善施策の効果など"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 評価結果タブ */}
            <TabsContent value="result" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">評価結果</h3>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="bg-blue-50">
                    <CardTitle className="text-lg">施設内評価</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">合計点数</p>
                      <p className="text-2xl font-bold">{calculateTotal('facility')} / 50点</p>
                      <p className="text-sm text-gray-600 mt-4">施設内順位</p>
                      <p className="text-lg font-semibold">看護師長 5名中 2位</p>
                      <div className="mt-4 p-3 bg-gray-100 rounded">
                        <p className="font-bold text-center text-xl">判定：A</p>
                        <p className="text-xs text-center text-gray-600 mt-1">（上位40%）</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="bg-green-50">
                    <CardTitle className="text-lg">法人内評価</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">合計点数</p>
                      <p className="text-2xl font-bold">{calculateTotal('corporate')} / 50点</p>
                      <p className="text-sm text-gray-600 mt-4">法人内順位</p>
                      <p className="text-lg font-semibold">看護師長 28名中 8位</p>
                      <div className="mt-4 p-3 bg-gray-100 rounded">
                        <p className="font-bold text-center text-xl">判定：A</p>
                        <p className="text-xs text-center text-gray-600 mt-1">（上位29%）</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-6">
                <CardHeader className="bg-orange-50">
                  <CardTitle className="text-center">総合評価</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-orange-600 mb-2">A+</p>
                    <p className="text-sm text-gray-600">
                      施設内評価 A × 法人内評価 A = 総合評価 A+
                    </p>
                    <div className="mt-4 p-4 bg-gray-50 rounded">
                      <p className="font-semibold mb-2">評価の解釈</p>
                      <p className="text-sm text-gray-700">
                        管理職として高い成果を上げており、次期上級管理職候補として期待されます。
                        経営視点を持った看護管理者として、さらなる活躍が見込まれます。
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <Label htmlFor="special-adjustments">特別調整事項</Label>
                <Textarea 
                  id="special-adjustments" 
                  placeholder="特別功績（+1.0）、重大事故（-1.0）など"
                  className="min-h-[60px]"
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">最終評価等級</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="等級を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="s-plus">S+ (特別優秀)</SelectItem>
                      <SelectItem value="s">S (極めて優秀)</SelectItem>
                      <SelectItem value="a-plus">A+ (非常に優秀)</SelectItem>
                      <SelectItem value="a">A (優秀)</SelectItem>
                      <SelectItem value="b-plus">B+ (良好)</SelectItem>
                      <SelectItem value="b">B (標準)</SelectItem>
                      <SelectItem value="c">C (要改善)</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </TabsContent>

            {/* フィードバックタブ */}
            <TabsContent value="feedback" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">フィードバック</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="strengths">管理職としての強み・優れた実績</Label>
                  <Textarea 
                    id="strengths" 
                    placeholder="部署運営、人材育成、経営貢献など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="challenges">今後の課題・成長が期待される領域</Label>
                  <Textarea 
                    id="challenges" 
                    placeholder="経営感覚の更なる向上、法人全体視点での活動など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="next-career">次期キャリアプラン</Label>
                  <Textarea 
                    id="next-career" 
                    placeholder="副看護部長候補、法人本部での活動など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="development-needs">必要な育成・支援</Label>
                  <Textarea 
                    id="development-needs" 
                    placeholder="上級管理職研修、MBA取得支援など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="evaluator-comment">評価者総評</Label>
                  <Textarea 
                    id="evaluator-comment" 
                    placeholder="看護師長としての総合評価、組織への貢献度、将来への期待など"
                    className="min-h-[120px]"
                  />
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="next-evaluation">次回評価予定日</Label>
                      <Input type="date" id="next-evaluation" />
                    </div>
                    <div>
                      <Label htmlFor="salary-recommendation">昇給・賞与推薦</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="推薦区分を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="special">特別昇給推薦</SelectItem>
                          <SelectItem value="high">高評価昇給</SelectItem>
                          <SelectItem value="standard">標準昇給</SelectItem>
                          <SelectItem value="none">昇給なし</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* 保存ボタン */}
          <div className="flex justify-end space-x-4 pt-6 border-t mt-6">
            <Button variant="outline">下書き保存</Button>
            <Button>評価を確定</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}