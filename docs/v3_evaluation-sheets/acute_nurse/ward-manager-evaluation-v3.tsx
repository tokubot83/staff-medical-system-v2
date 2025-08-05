'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, TrendingUp, Target } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function WardManagerEvaluationV3() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            病棟師長 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            経営貢献と戦略的病棟運営を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              病棟師長は病棟経営の責任者として、業績達成・人材育成・戦略実行を総合的に評価します
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="facility">施設内評価</TabsTrigger>
              <TabsTrigger value="corporate">法人内評価</TabsTrigger>
              <TabsTrigger value="kpi">経営指標</TabsTrigger>
              <TabsTrigger value="strategy">戦略実行</TabsTrigger>
              <TabsTrigger value="matrix">総合判定</TabsTrigger>
              <TabsTrigger value="development">育成計画</TabsTrigger>
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
                    <Label htmlFor="department">管理病棟</Label>
                    <Input type="text" id="department" />
                  </div>
                  <div>
                    <Label htmlFor="manager-years">師長経験年数</Label>
                    <Input type="text" id="manager-years" placeholder="5年" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="staff-count">管理職員数</Label>
                    <Input type="text" id="staff-count" placeholder="45名" />
                  </div>
                  <div>
                    <Label htmlFor="bed-count">病床数</Label>
                    <Input type="text" id="bed-count" placeholder="50床" />
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

            {/* 施設内評価タブ */}
            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設内評価（相対評価）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  病棟経営力と施設運営への貢献を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 病棟経営・業績達成</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="business-s" />
                        <Label htmlFor="business-s" className="font-normal">
                          <span className="font-semibold">S：</span> 卓越した経営手腕で病棟業績を大幅に向上させ、施設収益に大きく貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="business-a" />
                        <Label htmlFor="business-a" className="font-normal">
                          <span className="font-semibold">A：</span> 優れた病棟経営で目標を上回る成果を達成
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="business-b" />
                        <Label htmlFor="business-b" className="font-normal">
                          <span className="font-semibold">B：</span> 目標を達成し、安定した病棟運営を実現
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="business-c" />
                        <Label htmlFor="business-c" className="font-normal">
                          <span className="font-semibold">C：</span> 目標達成に課題があり、改善が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="business-d" />
                        <Label htmlFor="business-d" className="font-normal">
                          <span className="font-semibold">D：</span> 経営目標が未達成で、抜本的な改革が必要
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 人材マネジメント・組織開発</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="talent-s" />
                        <Label htmlFor="talent-s" className="font-normal">
                          <span className="font-semibold">S：</span> 革新的な人材育成で次世代リーダーを多数輩出し、組織力を大幅に向上
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="talent-a" />
                        <Label htmlFor="talent-a" className="font-normal">
                          <span className="font-semibold">A：</span> 優れた人材マネジメントで高い職員満足度と低い離職率を実現
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="talent-b" />
                        <Label htmlFor="talent-b" className="font-normal">
                          <span className="font-semibold">B：</span> 適切な人材管理で安定した組織運営を維持
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="talent-c" />
                        <Label htmlFor="talent-c" className="font-normal">
                          <span className="font-semibold">C：</span> 人材管理に課題があり、組織力が低下傾向
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="talent-d" />
                        <Label htmlFor="talent-d" className="font-normal">
                          <span className="font-semibold">D：</span> 人材流出が深刻で、組織崩壊のリスクがある
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 施設運営・部門間連携</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="collaboration-s" />
                        <Label htmlFor="collaboration-s" className="font-normal">
                          <span className="font-semibold">S：</span> 部門横断的なリーダーシップで施設全体の変革を主導
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="collaboration-a" />
                        <Label htmlFor="collaboration-a" className="font-normal">
                          <span className="font-semibold">A：</span> 優れた調整力で他部門との協働を促進し、施設運営に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="collaboration-b" />
                        <Label htmlFor="collaboration-b" className="font-normal">
                          <span className="font-semibold">B：</span> 他部門と適切に連携し、円滑な施設運営に協力
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="collaboration-c" />
                        <Label htmlFor="collaboration-c" className="font-normal">
                          <span className="font-semibold">C：</span> 部門間連携が不十分で、施設運営に支障
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="collaboration-d" />
                        <Label htmlFor="collaboration-d" className="font-normal">
                          <span className="font-semibold">D：</span> 他部門との対立が多く、施設運営の障害となっている
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <Label htmlFor="facility-score" className="text-lg font-semibold">施設内評価スコア</Label>
                  <RadioGroup className="flex space-x-4 mt-2">
                    <div className="flex items-center">
                      <RadioGroupItem value="s" id="facility-s" />
                      <Label htmlFor="facility-s" className="ml-2 font-bold">S</Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="a" id="facility-a" />
                      <Label htmlFor="facility-a" className="ml-2 font-bold">A</Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="b" id="facility-b" />
                      <Label htmlFor="facility-b" className="ml-2 font-bold">B</Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="c" id="facility-c" />
                      <Label htmlFor="facility-c" className="ml-2 font-bold">C</Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="d" id="facility-d" />
                      <Label htmlFor="facility-d" className="ml-2 font-bold">D</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="facility-comment">経営・組織運営の具体例</Label>
                  <Textarea 
                    id="facility-comment" 
                    placeholder="業績改善の実績、人材育成の成果、組織変革の事例など"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 法人内評価タブ */}
            <TabsContent value="corporate" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">法人内評価（絶対評価）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  看護管理の専門性と法人戦略への貢献を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 看護の質・安全管理</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="quality-s" />
                        <Label htmlFor="quality-s" className="font-normal">
                          <span className="font-semibold">S：</span> 法人内トップクラスの看護の質を実現し、外部からも高評価
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="quality-a" />
                        <Label htmlFor="quality-a" className="font-normal">
                          <span className="font-semibold">A：</span> 高い看護の質と安全性を維持し、法人基準を上回る
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="quality-b" />
                        <Label htmlFor="quality-b" className="font-normal">
                          <span className="font-semibold">B：</span> 法人基準を満たす適切な看護管理を実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="quality-c" />
                        <Label htmlFor="quality-c" className="font-normal">
                          <span className="font-semibold">C：</span> 看護の質に課題があり、改善が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="quality-d" />
                        <Label htmlFor="quality-d" className="font-normal">
                          <span className="font-semibold">D：</span> 重大な質・安全上の問題が発生している
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 法人戦略の理解と実行</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="strategy-s" />
                        <Label htmlFor="strategy-s" className="font-normal">
                          <span className="font-semibold">S：</span> 法人戦略を深く理解し、先進的な取り組みで法人をリード
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="strategy-a" />
                        <Label htmlFor="strategy-a" className="font-normal">
                          <span className="font-semibold">A：</span> 法人戦略を的確に実行し、他施設の模範となる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="strategy-b" />
                        <Label htmlFor="strategy-b" className="font-normal">
                          <span className="font-semibold">B：</span> 法人方針に沿った適切な病棟運営を実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="strategy-c" />
                        <Label htmlFor="strategy-c" className="font-normal">
                          <span className="font-semibold">C：</span> 法人戦略の理解・実行が不十分
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="strategy-d" />
                        <Label htmlFor="strategy-d" className="font-normal">
                          <span className="font-semibold">D：</span> 法人戦略と病棟運営が乖離している
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 法人貢献・外部活動</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="contribution-s" />
                        <Label htmlFor="contribution-s" className="font-normal">
                          <span className="font-semibold">S：</span> 法人代表として外部活動を行い、ブランド価値向上に大きく貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="contribution-a" />
                        <Label htmlFor="contribution-a" className="font-normal">
                          <span className="font-semibold">A：</span> 法人プロジェクトをリードし、組織横断的に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="contribution-b" />
                        <Label htmlFor="contribution-b" className="font-normal">
                          <span className="font-semibold">B：</span> 法人活動に積極的に参加し、貢献している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="contribution-c" />
                        <Label htmlFor="contribution-c" className="font-normal">
                          <span className="font-semibold">C：</span> 法人活動への参加が限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="contribution-d" />
                        <Label htmlFor="contribution-d" className="font-normal">
                          <span className="font-semibold">D：</span> 病棟内に閉じこもり、法人貢献がない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <Label htmlFor="corporate-score" className="text-lg font-semibold">法人内評価スコア</Label>
                  <RadioGroup className="flex space-x-4 mt-2">
                    <div className="flex items-center">
                      <RadioGroupItem value="s" id="corporate-s" />
                      <Label htmlFor="corporate-s" className="ml-2 font-bold">S</Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="a" id="corporate-a" />
                      <Label htmlFor="corporate-a" className="ml-2 font-bold">A</Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="b" id="corporate-b" />
                      <Label htmlFor="corporate-b" className="ml-2 font-bold">B</Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="c" id="corporate-c" />
                      <Label htmlFor="corporate-c" className="ml-2 font-bold">C</Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="d" id="corporate-d" />
                      <Label htmlFor="corporate-d" className="ml-2 font-bold">D</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="corporate-comment">法人貢献の具体例</Label>
                  <Textarea 
                    id="corporate-comment" 
                    placeholder="看護の質向上実績、法人戦略への貢献、外部活動での成果など"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 経営指標タブ */}
            <TabsContent value="kpi" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">重要経営指標（KPI）達成状況</h3>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader className="bg-purple-50">
                    <CardTitle className="text-lg flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      病棟運営指標
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>病床稼働率</Label>
                        <div className="flex items-center gap-2">
                          <Input type="text" placeholder="目標: 95%" className="w-32" />
                          <span>→</span>
                          <Input type="text" placeholder="実績: 97.5%" className="w-32" />
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <Label>平均在院日数</Label>
                        <div className="flex items-center gap-2">
                          <Input type="text" placeholder="目標: 14日" className="w-32" />
                          <span>→</span>
                          <Input type="text" placeholder="実績: 12.8日" className="w-32" />
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <Label>看護必要度達成率</Label>
                        <div className="flex items-center gap-2">
                          <Input type="text" placeholder="目標: 35%" className="w-32" />
                          <span>→</span>
                          <Input type="text" placeholder="実績: 38.2%" className="w-32" />
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <Label>病棟収益（対予算比）</Label>
                        <div className="flex items-center gap-2">
                          <Input type="text" placeholder="目標: 100%" className="w-32" />
                          <span>→</span>
                          <Input type="text" placeholder="実績: 105%" className="w-32" />
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="bg-orange-50">
                    <CardTitle className="text-lg flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      質・安全指標
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>インシデント発生率</Label>
                        <div className="flex items-center gap-2">
                          <Input type="text" placeholder="目標: <1.0%" className="w-32" />
                          <span>→</span>
                          <Input type="text" placeholder="実績: 0.6%" className="w-32" />
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <Label>患者満足度</Label>
                        <div className="flex items-center gap-2">
                          <Input type="text" placeholder="目標: 4.0" className="w-32" />
                          <span>→</span>
                          <Input type="text" placeholder="実績: 4.6/5.0" className="w-32" />
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <Label>褥瘡発生率</Label>
                        <div className="flex items-center gap-2">
                          <Input type="text" placeholder="目標: <1.5%" className="w-32" />
                          <span>→</span>
                          <Input type="text" placeholder="実績: 0.8%" className="w-32" />
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <Label>転倒転落率</Label>
                        <div className="flex items-center gap-2">
                          <Input type="text" placeholder="目標: <2.0‰" className="w-32" />
                          <span>→</span>
                          <Input type="text" placeholder="実績: 1.2‰" className="w-32" />
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="bg-blue-50">
                    <CardTitle className="text-lg flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      人材管理指標
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>離職率</Label>
                        <div className="flex items-center gap-2">
                          <Input type="text" placeholder="目標: <8%" className="w-32" />
                          <span>→</span>
                          <Input type="text" placeholder="実績: 4.5%" className="w-32" />
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <Label>職員満足度</Label>
                        <div className="flex items-center gap-2">
                          <Input type="text" placeholder="目標: 3.5" className="w-32" />
                          <span>→</span>
                          <Input type="text" placeholder="実績: 4.2/5.0" className="w-32" />
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <Label>時間外勤務（平均）</Label>
                        <div className="flex items-center gap-2">
                          <Input type="text" placeholder="目標: 10h" className="w-32" />
                          <span>→</span>
                          <Input type="text" placeholder="実績: 7.5h/月" className="w-32" />
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <Label>有給取得率</Label>
                        <div className="flex items-center gap-2">
                          <Input type="text" placeholder="目標: 70%" className="w-32" />
                          <span>→</span>
                          <Input type="text" placeholder="実績: 78%" className="w-32" />
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 戦略実行タブ */}
            <TabsContent value="strategy" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">戦略実行・組織貢献</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">重点施策の実行状況</h4>
                  <Textarea 
                    placeholder="DX推進、地域連携強化、新規事業開発など、法人重点施策への取り組みと成果"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3">イノベーション・改革実績</h4>
                  <Textarea 
                    placeholder="新たな看護モデルの開発、業務プロセスの革新、先進的な取り組みなど"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3">部門横断プロジェクト</h4>
                  <Textarea 
                    placeholder="リーダーとして参画したプロジェクト、他部門との協働成果など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3">外部連携・地域貢献</h4>
                  <Textarea 
                    placeholder="地域医療機関との連携、行政との協働、学会・研究活動など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3">人材育成・後継者育成</h4>
                  <Textarea 
                    placeholder="次期師長候補の育成、管理者研修の企画・実施、メンタリング実績など"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 総合判定タブ */}
            <TabsContent value="matrix" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">総合評価マトリックス</h3>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">施設内評価</h4>
                    <p className="text-2xl font-bold text-blue-600">A</p>
                    <p className="text-sm text-gray-600">病棟経営・組織運営</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">法人内評価</h4>
                    <p className="text-2xl font-bold text-green-600">A</p>
                    <p className="text-sm text-gray-600">看護管理・戦略実行</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <h4 className="font-semibold mb-2">総合評価</h4>
                  <p className="text-3xl font-bold text-orange-600">A+</p>
                  <p className="text-sm text-gray-600 mt-2">
                    施設内評価A × 法人内評価A = 総合評価A+
                  </p>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">評価タイプ</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="executive" id="type-executive" />
                        <Label htmlFor="type-executive" className="font-normal">
                          経営幹部候補型（両軸でS/A、戦略的思考）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="turnaround" id="type-turnaround" />
                        <Label htmlFor="type-turnaround" className="font-normal">
                          変革リーダー型（業績改善・組織変革実績）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="stable" id="type-stable" />
                        <Label htmlFor="type-stable" className="font-normal">
                          安定経営型（両軸でB以上、着実な運営）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="specialist" id="type-specialist" />
                        <Label htmlFor="type-specialist" className="font-normal">
                          専門特化型（特定分野で卓越した成果）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="support" id="type-support" />
                        <Label htmlFor="type-support" className="font-normal">
                          支援必要型（いずれかC以下）
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="overall-assessment">総合所見</Label>
                  <Textarea 
                    id="overall-assessment" 
                    placeholder="管理者としての成熟度、経営貢献、組織への影響力、今後の可能性など"
                    className="min-h-[120px]"
                  />
                </div>

                <div>
                  <Label htmlFor="final-grade">最終評価等級</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="等級を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="s-plus">S+ (特別優秀・経営幹部候補)</SelectItem>
                      <SelectItem value="s">S (極めて優秀)</SelectItem>
                      <SelectItem value="a-plus">A+ (非常に優秀)</SelectItem>
                      <SelectItem value="a">A (優秀)</SelectItem>
                      <SelectItem value="b-plus">B+ (良好)</SelectItem>
                      <SelectItem value="b">B (標準)</SelectItem>
                      <SelectItem value="c">C (要改善)</SelectItem>
                      <SelectItem value="d">D (問題あり)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* 育成計画タブ */}
            <TabsContent value="development" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">管理者育成・キャリア開発計画</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="strengths">経営管理者としての強み</Label>
                  <Textarea 
                    id="strengths" 
                    placeholder="戦略的思考、リーダーシップ、経営感覚、人材育成力など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="challenges">今後の課題・成長領域</Label>
                  <Textarea 
                    id="challenges" 
                    placeholder="より高度な経営スキル、法人全体視点、外部ネットワーク構築など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="next-career">次期キャリアプラン</Label>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="deputy-director" id="career-deputy" />
                        <Label htmlFor="career-deputy">副看護部長への昇進</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="facility-manager" id="career-facility" />
                        <Label htmlFor="career-facility">施設管理職への転向</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="corporate" id="career-corporate" />
                        <Label htmlFor="career-corporate">法人本部での活躍</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="specialist-manager" id="career-specialist" />
                        <Label htmlFor="career-specialist">専門分野での上級管理職</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="development-actions">具体的な育成アクション</Label>
                  <Textarea 
                    id="development-actions" 
                    placeholder="MBA取得支援、経営幹部研修、他施設研修、プロジェクトリーダー任命など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="succession-risk">後継者リスク・育成計画</Label>
                  <Textarea 
                    id="succession-risk" 
                    placeholder="後継候補者の有無、育成状況、引き継ぎ計画など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="retention-strategy">リテンション戦略</Label>
                  <Textarea 
                    id="retention-strategy" 
                    placeholder="処遇改善、新たな権限付与、キャリア支援など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="next-review">次回評価予定日</Label>
                  <Input type="date" id="next-review" />
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