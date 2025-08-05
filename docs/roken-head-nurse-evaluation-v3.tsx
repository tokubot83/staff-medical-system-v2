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
import { Building2, TrendingUp, Target } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RokenHeadNurseEvaluationV3() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            介護老人保健施設 看護師長 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            経営貢献と戦略的施設運営を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Building2 className="h-4 w-4" />
            <AlertDescription>
              老健看護師長は在宅復帰率向上の責任者として、業績達成・人材育成・戦略実行を総合的に評価します
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
                    <Label htmlFor="department">管理部門</Label>
                    <Input type="text" id="department" placeholder="看護部" />
                  </div>
                  <div>
                    <Label htmlFor="manager-years">師長経験年数</Label>
                    <Input type="text" id="manager-years" placeholder="5年" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="staff-count">管理職員数</Label>
                    <Input type="text" id="staff-count" placeholder="看護師25名、介護士30名" />
                  </div>
                  <div>
                    <Label htmlFor="service-types">管理サービス</Label>
                    <Input type="text" id="service-types" placeholder="入所・通所リハ・訪問看護" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（看護部長/施設長）</Label>
                    <Input type="text" id="evaluator1" />
                  </div>
                  <div>
                    <Label htmlFor="evaluator2">2次評価者（理事長/事務長）</Label>
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
                  管理職としてのリーダーシップと組織運営を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 看護部門の統括とリーダーシップ</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="leadership-s" />
                        <Label htmlFor="leadership-s" className="font-normal">
                          <span className="font-semibold">S：</span> 卓越したリーダーシップで全職員を統率し、組織を変革
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="leadership-a" />
                        <Label htmlFor="leadership-a" className="font-normal">
                          <span className="font-semibold">A：</span> 効果的なリーダーシップで高い組織力を実現
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="leadership-b" />
                        <Label htmlFor="leadership-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的な管理で部門を運営
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="leadership-c" />
                        <Label htmlFor="leadership-c" className="font-normal">
                          <span className="font-semibold">C：</span> 管理能力に課題があり、改善が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="leadership-d" />
                        <Label htmlFor="leadership-d" className="font-normal">
                          <span className="font-semibold">D：</span> 管理職としての役割を果たせていない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 人材育成と組織開発</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="development-s" />
                        <Label htmlFor="development-s" className="font-normal">
                          <span className="font-semibold">S：</span> 革新的な育成システムを構築し、優秀な人材を多数輩出
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="development-a" />
                        <Label htmlFor="development-a" className="font-normal">
                          <span className="font-semibold">A：</span> 体系的な育成で職員の能力を大幅に向上
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="development-b" />
                        <Label htmlFor="development-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本的な人材育成を実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="development-c" />
                        <Label htmlFor="development-c" className="font-normal">
                          <span className="font-semibold">C：</span> 育成への取り組みが不十分
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="development-d" />
                        <Label htmlFor="development-d" className="font-normal">
                          <span className="font-semibold">D：</span> 人材育成が機能していない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 多職種協働と施設全体への貢献</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="collaboration-s" />
                        <Label htmlFor="collaboration-s" className="font-normal">
                          <span className="font-semibold">S：</span> 全部門を巻き込んだ革新的な協働体制を構築
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="collaboration-a" />
                        <Label htmlFor="collaboration-a" className="font-normal">
                          <span className="font-semibold">A：</span> 効果的な多職種連携で施設全体の質を向上
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="collaboration-b" />
                        <Label htmlFor="collaboration-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的な部門間連携を維持
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="collaboration-c" />
                        <Label htmlFor="collaboration-c" className="font-normal">
                          <span className="font-semibold">C：</span> 連携に課題があり、改善が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="collaboration-d" />
                        <Label htmlFor="collaboration-d" className="font-normal">
                          <span className="font-semibold">D：</span> 部門間の壁を解消できていない
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
                  <Label htmlFor="facility-comment">具体的な貢献事例・評価コメント</Label>
                  <Textarea 
                    id="facility-comment" 
                    placeholder="リーダーシップの発揮例、人材育成の成果、多職種協働での実績など"
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
                  老健機能の最大化と経営への貢献を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 在宅復帰率向上への戦略的取り組み</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="home-strategy-s" />
                        <Label htmlFor="home-strategy-s" className="font-normal">
                          <span className="font-semibold">S：</span> 革新的な戦略により在宅復帰率を業界トップレベルに向上
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="home-strategy-a" />
                        <Label htmlFor="home-strategy-a" className="font-normal">
                          <span className="font-semibold">A：</span> 効果的な施策で在宅復帰率を大幅に改善
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="home-strategy-b" />
                        <Label htmlFor="home-strategy-b" className="font-normal">
                          <span className="font-semibold">B：</span> 目標とする在宅復帰率を達成
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="home-strategy-c" />
                        <Label htmlFor="home-strategy-c" className="font-normal">
                          <span className="font-semibold">C：</span> 在宅復帰率が目標に達していない
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="home-strategy-d" />
                        <Label htmlFor="home-strategy-d" className="font-normal">
                          <span className="font-semibold">D：</span> 在宅復帰への取り組みが不足
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 看護サービスの質向上と業務革新</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="quality-innovation-s" />
                        <Label htmlFor="quality-innovation-s" className="font-normal">
                          <span className="font-semibold">S：</span> 革新的な取り組みで老健看護の新たなモデルを確立
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="quality-innovation-a" />
                        <Label htmlFor="quality-innovation-a" className="font-normal">
                          <span className="font-semibold">A：</span> 質向上施策により利用者満足度を大幅に向上
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="quality-innovation-b" />
                        <Label htmlFor="quality-innovation-b" className="font-normal">
                          <span className="font-semibold">B：</span> 安定した質の高いサービスを提供
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="quality-innovation-c" />
                        <Label htmlFor="quality-innovation-c" className="font-normal">
                          <span className="font-semibold">C：</span> サービスの質に改善の余地がある
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="quality-innovation-d" />
                        <Label htmlFor="quality-innovation-d" className="font-normal">
                          <span className="font-semibold">D：</span> 質の向上が見られない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 地域包括ケアシステムへの貢献</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="community-care-s" />
                        <Label htmlFor="community-care-s" className="font-normal">
                          <span className="font-semibold">S：</span> 地域の中核として革新的な連携モデルを構築・主導
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="community-care-a" />
                        <Label htmlFor="community-care-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的な地域連携により老健の価値を大きく向上
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="community-care-b" />
                        <Label htmlFor="community-care-b" className="font-normal">
                          <span className="font-semibold">B：</span> 地域連携を適切に推進
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="community-care-c" />
                        <Label htmlFor="community-care-c" className="font-normal">
                          <span className="font-semibold">C：</span> 地域連携への取り組みが不十分
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="community-care-d" />
                        <Label htmlFor="community-care-d" className="font-normal">
                          <span className="font-semibold">D：</span> 地域での存在感がない
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
                  <Label htmlFor="corporate-comment">実績の具体例・評価コメント</Label>
                  <Textarea 
                    id="corporate-comment" 
                    placeholder="在宅復帰率の改善実績、質向上の成果、地域連携での貢献など"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 経営指標タブ */}
            <TabsContent value="kpi" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">
                  <TrendingUp className="inline mr-2" />
                  経営指標達成状況
                </h3>
              </div>

              <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">在宅復帰関連指標</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="home-return-rate">在宅復帰率</Label>
                      <div className="flex items-center space-x-2">
                        <Input type="number" id="home-return-rate" placeholder="35" />
                        <span>%</span>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="home-return-target">目標値</Label>
                      <div className="flex items-center space-x-2">
                        <Input type="number" id="home-return-target" placeholder="30" />
                        <span>%</span>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="home-return-achievement">達成率</Label>
                      <div className="flex items-center space-x-2">
                        <Input type="number" id="home-return-achievement" placeholder="117" />
                        <span>%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">運営効率指標</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="bed-occupancy">ベッド稼働率</Label>
                      <div className="flex items-center space-x-2">
                        <Input type="number" id="bed-occupancy" placeholder="95" />
                        <span>%</span>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="avg-stay">平均在所日数</Label>
                      <div className="flex items-center space-x-2">
                        <Input type="number" id="avg-stay" placeholder="90" />
                        <span>日</span>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="staff-turnover">職員定着率</Label>
                      <div className="flex items-center space-x-2">
                        <Input type="number" id="staff-turnover" placeholder="92" />
                        <span>%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">質的指標</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="user-satisfaction">利用者満足度</Label>
                      <Select>
                        <SelectTrigger id="user-satisfaction">
                          <SelectValue placeholder="評価を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">非常に高い（90%以上）</SelectItem>
                          <SelectItem value="good">高い（80-89%）</SelectItem>
                          <SelectItem value="average">普通（70-79%）</SelectItem>
                          <SelectItem value="below">低い（70%未満）</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="incident-rate">インシデント発生率</Label>
                      <Select>
                        <SelectTrigger id="incident-rate">
                          <SelectValue placeholder="評価を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="very-low">非常に低い（前年比20%以上減）</SelectItem>
                          <SelectItem value="low">低い（前年比10-19%減）</SelectItem>
                          <SelectItem value="same">前年同等</SelectItem>
                          <SelectItem value="high">高い（前年比増）</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="kpi-analysis">経営指標分析・改善計画</Label>
                  <Textarea 
                    id="kpi-analysis" 
                    placeholder="指標の達成状況分析、改善施策、今後の目標など"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 戦略実行タブ */}
            <TabsContent value="strategy" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">
                  <Target className="inline mr-2" />
                  戦略実行状況
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">重点戦略の推進状況</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span>在宅復帰支援体制の強化</span>
                      <Select defaultValue="">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="進捗を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="completed">完了</SelectItem>
                          <SelectItem value="on-track">順調に進行中</SelectItem>
                          <SelectItem value="delayed">遅延あり</SelectItem>
                          <SelectItem value="not-started">未着手</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span>リハビリテーション機能の充実</span>
                      <Select defaultValue="">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="進捗を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="completed">完了</SelectItem>
                          <SelectItem value="on-track">順調に進行中</SelectItem>
                          <SelectItem value="delayed">遅延あり</SelectItem>
                          <SelectItem value="not-started">未着手</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span>地域連携ネットワークの拡大</span>
                      <Select defaultValue="">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="進捗を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="completed">完了</SelectItem>
                          <SelectItem value="on-track">順調に進行中</SelectItem>
                          <SelectItem value="delayed">遅延あり</SelectItem>
                          <SelectItem value="not-started">未着手</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span>職員の専門性向上プログラム</span>
                      <Select defaultValue="">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="進捗を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="completed">完了</SelectItem>
                          <SelectItem value="on-track">順調に進行中</SelectItem>
                          <SelectItem value="delayed">遅延あり</SelectItem>
                          <SelectItem value="not-started">未着手</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="innovation-initiatives">革新的な取り組み・新規事業</Label>
                  <Textarea 
                    id="innovation-initiatives" 
                    placeholder="新たに開始した取り組み、独自のサービス開発、業界初の試みなど"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="strategic-challenges">戦略実行上の課題と対策</Label>
                  <Textarea 
                    id="strategic-challenges" 
                    placeholder="直面している課題、解決に向けた施策、必要な支援など"
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
                    <p className="text-2xl font-bold text-blue-600">B</p>
                    <p className="text-sm text-gray-600">管理能力・人材育成・組織運営</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">法人内評価</h4>
                    <p className="text-2xl font-bold text-green-600">B</p>
                    <p className="text-sm text-gray-600">経営貢献・戦略実行・革新</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <h4 className="font-semibold mb-2">総合評価</h4>
                  <p className="text-3xl font-bold text-orange-600">B</p>
                  <p className="text-sm text-gray-600 mt-2">
                    施設内評価B × 法人内評価B = 総合評価B
                  </p>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">評価タイプ</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="transformational" id="type-transformational" />
                        <Label htmlFor="type-transformational" className="font-normal">
                          変革型リーダー（両軸でS・組織を革新）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="strategic" id="type-strategic" />
                        <Label htmlFor="type-strategic" className="font-normal">
                          戦略型リーダー（経営貢献に特化）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="operational" id="type-operational" />
                        <Label htmlFor="type-operational" className="font-normal">
                          運営型リーダー（組織管理に特化）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="balanced" id="type-balanced" />
                        <Label htmlFor="type-balanced" className="font-normal">
                          バランス型リーダー（両軸でB以上）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="developing" id="type-developing" />
                        <Label htmlFor="type-developing" className="font-normal">
                          成長期リーダー（更なる向上が必要）
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="overall-assessment">総合所見</Label>
                  <Textarea 
                    id="overall-assessment" 
                    placeholder="老健看護師長としての強み、経営への貢献度、今後の期待など"
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 育成計画タブ */}
            <TabsContent value="development" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">管理職育成計画</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="executive-strengths">経営者としての強み</Label>
                  <Textarea 
                    id="executive-strengths" 
                    placeholder="リーダーシップスタイル、戦略立案力、実行力、人材育成力など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="development-areas">今後の成長課題</Label>
                  <Textarea 
                    id="development-areas" 
                    placeholder="経営視点の強化、イノベーション力、外部ネットワーク構築など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="next-career">キャリアビジョン</Label>
                  <Textarea 
                    id="next-career" 
                    placeholder="施設長への昇格、法人本部での役割、地域での要職など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="executive-training">推奨する研修・教育</Label>
                  <Textarea 
                    id="executive-training" 
                    placeholder="経営管理研修、MBA、老健協会の管理者研修など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="succession-planning">後継者育成計画</Label>
                  <Textarea 
                    id="succession-planning" 
                    placeholder="次期師長候補の育成状況、引き継ぎ計画など"
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