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
import { InfoIcon } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";

export default function ChiefNurseEvaluation() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            看護師長 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            管理職向け2軸評価方式
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              管理職は部署運営・人材育成・経営貢献の観点から総合的に評価します
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="facility">施設内評価</TabsTrigger>
              <TabsTrigger value="corporate">法人内評価</TabsTrigger>
              <TabsTrigger value="management">管理実績</TabsTrigger>
              <TabsTrigger value="matrix">総合判定</TabsTrigger>
              <TabsTrigger value="development">次年度計画</TabsTrigger>
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
                    <Label htmlFor="department">管理部署</Label>
                    <Input type="text" id="department" placeholder="〇〇病棟" />
                  </div>
                  <div>
                    <Label htmlFor="management-years">管理職経験年数</Label>
                    <Input type="text" id="management-years" placeholder="5年" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="staff-count">部署職員数</Label>
                    <Input type="text" id="staff-count" placeholder="25名" />
                  </div>
                  <div>
                    <Label htmlFor="bed-count">病床数（該当する場合）</Label>
                    <Input type="text" id="bed-count" placeholder="45床" />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 施設内評価タブ */}
            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設内評価（管理職としての相対評価）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  施設内の管理職の中での相対的な評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 部署運営力</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="operation-s" />
                        <Label htmlFor="operation-s" className="font-normal">
                          <span className="font-semibold">S：</span> 施設内で最も優れた部署運営、他部署の模範
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="operation-a" />
                        <Label htmlFor="operation-a" className="font-normal">
                          <span className="font-semibold">A：</span> 安定した部署運営、高い成果を継続
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="operation-b" />
                        <Label htmlFor="operation-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的な部署運営
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="operation-c" />
                        <Label htmlFor="operation-c" className="font-normal">
                          <span className="font-semibold">C：</span> 部署運営に課題あり
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="operation-d" />
                        <Label htmlFor="operation-d" className="font-normal">
                          <span className="font-semibold">D：</span> 部署運営に重大な問題
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. リーダーシップ</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="leader-s" />
                        <Label htmlFor="leader-s" className="font-normal">
                          <span className="font-semibold">S：</span> 卓越したリーダーシップで組織を牽引
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="leader-a" />
                        <Label htmlFor="leader-a" className="font-normal">
                          <span className="font-semibold">A：</span> 強いリーダーシップを発揮
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="leader-b" />
                        <Label htmlFor="leader-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的なリーダーシップ
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="leader-c" />
                        <Label htmlFor="leader-c" className="font-normal">
                          <span className="font-semibold">C：</span> リーダーシップに改善余地
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="leader-d" />
                        <Label htmlFor="leader-d" className="font-normal">
                          <span className="font-semibold">D：</span> リーダーシップ不足
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 施設への貢献度</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="contrib-s" />
                        <Label htmlFor="contrib-s" className="font-normal">
                          <span className="font-semibold">S：</span> 施設経営に極めて重要な貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="contrib-a" />
                        <Label htmlFor="contrib-a" className="font-normal">
                          <span className="font-semibold">A：</span> 施設全体の発展に大きく貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="contrib-b" />
                        <Label htmlFor="contrib-b" className="font-normal">
                          <span className="font-semibold">B：</span> 期待される貢献を果たす
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="contrib-c" />
                        <Label htmlFor="contrib-c" className="font-normal">
                          <span className="font-semibold">C：</span> 貢献度が期待を下回る
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="contrib-d" />
                        <Label htmlFor="contrib-d" className="font-normal">
                          <span className="font-semibold">D：</span> 貢献が不十分
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
              </div>
            </TabsContent>

            {/* 法人内評価タブ */}
            <TabsContent value="corporate" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">法人内評価（管理能力の絶対評価）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  法人全体での管理職としての能力・実績を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 経営指標達成度</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="kpi-s" />
                        <Label htmlFor="kpi-s" className="font-normal">
                          <span className="font-semibold">S：</span> 全指標で目標を大幅に上回る
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="kpi-a" />
                        <Label htmlFor="kpi-a" className="font-normal">
                          <span className="font-semibold">A：</span> 主要指標で目標を上回る
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="kpi-b" />
                        <Label htmlFor="kpi-b" className="font-normal">
                          <span className="font-semibold">B：</span> 目標を概ね達成
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="kpi-c" />
                        <Label htmlFor="kpi-c" className="font-normal">
                          <span className="font-semibold">C：</span> 一部指標で目標未達
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="kpi-d" />
                        <Label htmlFor="kpi-d" className="font-normal">
                          <span className="font-semibold">D：</span> 多くの指標で目標未達
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 人材育成・マネジメント</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="hr-s" />
                        <Label htmlFor="hr-s" className="font-normal">
                          <span className="font-semibold">S：</span> 法人内トップクラスの人材育成実績
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="hr-a" />
                        <Label htmlFor="hr-a" className="font-normal">
                          <span className="font-semibold">A：</span> 優れた人材育成・低離職率
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="hr-b" />
                        <Label htmlFor="hr-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的な人材マネジメント
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="hr-c" />
                        <Label htmlFor="hr-c" className="font-normal">
                          <span className="font-semibold">C：</span> 人材育成に課題あり
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="hr-d" />
                        <Label htmlFor="hr-d" className="font-normal">
                          <span className="font-semibold">D：</span> 人材流出など重大な問題
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 品質・安全管理</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="quality-s" />
                        <Label htmlFor="quality-s" className="font-normal">
                          <span className="font-semibold">S：</span> 模範的な品質・安全管理体制
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="quality-a" />
                        <Label htmlFor="quality-a" className="font-normal">
                          <span className="font-semibold">A：</span> 高い品質・安全実績
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="quality-b" />
                        <Label htmlFor="quality-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的な品質・安全管理
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="quality-c" />
                        <Label htmlFor="quality-c" className="font-normal">
                          <span className="font-semibold">C：</span> 品質・安全に改善必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="quality-d" />
                        <Label htmlFor="quality-d" className="font-normal">
                          <span className="font-semibold">D：</span> 重大なインシデント発生
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
              </div>
            </TabsContent>

            {/* 管理実績タブ */}
            <TabsContent value="management" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">年度管理実績</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">1. 定量的実績</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bed-rate">病床稼働率</Label>
                      <Input type="text" id="bed-rate" placeholder="95.5%" />
                    </div>
                    <div>
                      <Label htmlFor="avg-stay">平均在院日数</Label>
                      <Input type="text" id="avg-stay" placeholder="12.3日" />
                    </div>
                    <div>
                      <Label htmlFor="patient-satisfaction">患者満足度</Label>
                      <Input type="text" id="patient-satisfaction" placeholder="4.5/5.0" />
                    </div>
                    <div>
                      <Label htmlFor="staff-retention">職員定着率</Label>
                      <Input type="text" id="staff-retention" placeholder="92%" />
                    </div>
                    <div>
                      <Label htmlFor="overtime">時間外勤務削減率</Label>
                      <Input type="text" id="overtime" placeholder="-15%" />
                    </div>
                    <div>
                      <Label htmlFor="incident">インシデント件数</Label>
                      <Input type="text" id="incident" placeholder="前年比-20%" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 重点取組と成果</h4>
                  <Textarea 
                    placeholder="今年度の重点取組項目と具体的な成果を記入"
                    className="min-h-[120px]"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 人材育成実績</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox id="cert-nurse" />
                      <Label htmlFor="cert-nurse" className="ml-2">認定看護師育成（ 名）</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="leader-dev" />
                      <Label htmlFor="leader-dev" className="ml-2">リーダー育成（ 名）</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="new-grad" />
                      <Label htmlFor="new-grad" className="ml-2">新人教育プログラム完遂率（ %）</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="career-support" />
                      <Label htmlFor="career-support" className="ml-2">キャリア支援面談実施率（ %）</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">4. 課題と改善活動</h4>
                  <Textarea 
                    placeholder="直面した課題と実施した改善活動"
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
                    <p className="text-sm text-gray-600">管理職相対評価</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">法人内評価</h4>
                    <p className="text-2xl font-bold text-green-600">A</p>
                    <p className="text-sm text-gray-600">管理能力絶対評価</p>
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
                  <Label htmlFor="comprehensive-assessment">経営層からの総合評価</Label>
                  <Textarea 
                    id="comprehensive-assessment" 
                    placeholder="管理職としての総合的な評価、今後への期待など"
                    className="min-h-[120px]"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3">昇進・異動の推奨</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="promote" id="rec-promote" />
                        <Label htmlFor="rec-promote">上位職への昇進を強く推奨</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="expand" id="rec-expand" />
                        <Label htmlFor="rec-expand">より大規模部署への異動を推奨</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="continue" id="rec-continue" />
                        <Label htmlFor="rec-continue">現職での継続を推奨</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="support" id="rec-support" />
                        <Label htmlFor="rec-support">サポート体制強化が必要</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </TabsContent>

            {/* 次年度計画タブ */}
            <TabsContent value="development" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">次年度目標・育成計画</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="next-year-goals">次年度重点目標</Label>
                  <Textarea 
                    id="next-year-goals" 
                    placeholder="経営目標、品質目標、人材育成目標など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="skill-development">管理能力向上計画</Label>
                  <Textarea 
                    id="skill-development" 
                    placeholder="参加予定の研修、取得予定の資格、自己研鑽計画など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="org-contribution">組織貢献計画</Label>
                  <Textarea 
                    id="org-contribution" 
                    placeholder="委員会活動、プロジェクト参画、後進育成など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label>経営層からの期待・要望</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center">
                      <Checkbox id="expect-1" />
                      <Label htmlFor="expect-1" className="ml-2">法人全体の看護部運営への参画</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="expect-2" />
                      <Label htmlFor="expect-2" className="ml-2">新規事業・プロジェクトのリード</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="expect-3" />
                      <Label htmlFor="expect-3" className="ml-2">次世代管理職の育成強化</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="expect-4" />
                      <Label htmlFor="expect-4" className="ml-2">経営改善への積極的な提言</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="support-needs">必要な支援・リソース</Label>
                  <Textarea 
                    id="support-needs" 
                    placeholder="人員、予算、設備、研修機会など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="next-evaluation-date">次回評価予定日</Label>
                  <Input type="date" id="next-evaluation-date" />
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