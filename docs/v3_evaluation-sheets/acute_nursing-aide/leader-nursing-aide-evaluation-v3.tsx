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

export default function LeaderNursingAideEvaluationV3() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            看護補助者リーダー 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            管理能力と補助者チームの統括を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              看護補助者リーダーは管理能力とチーム統括力、組織運営への貢献を評価します
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="facility">施設内評価</TabsTrigger>
              <TabsTrigger value="corporate">法人内評価</TabsTrigger>
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
                  <Label htmlFor="leader-experience">リーダー経験年数</Label>
                  <Input type="text" id="leader-experience" placeholder="例：3年目" />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">職員情報</h3>
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
                    <Label htmlFor="department">配属病棟</Label>
                    <Input type="text" id="department" />
                  </div>
                  <div>
                    <Label htmlFor="team-size">管理補助者数</Label>
                    <Input type="number" id="team-size" placeholder="例：20名" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（師長）</Label>
                    <Input type="text" id="evaluator1" />
                  </div>
                  <div>
                    <Label htmlFor="evaluator2">2次評価者（看護部長）</Label>
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
                  チーム管理と病棟運営への貢献を中心に評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 補助者チームの管理・統括</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="team-mgmt-s" />
                        <Label htmlFor="team-mgmt-s" className="font-normal">
                          <span className="font-semibold">S：</span> 卓越した管理能力でチームを統括し、高い成果を達成
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="team-mgmt-a" />
                        <Label htmlFor="team-mgmt-a" className="font-normal">
                          <span className="font-semibold">A：</span> 効果的にチームを管理し、期待以上の成果
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="team-mgmt-b" />
                        <Label htmlFor="team-mgmt-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的な管理を行い、チームを適切に運営
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="team-mgmt-c" />
                        <Label htmlFor="team-mgmt-c" className="font-normal">
                          <span className="font-semibold">C：</span> チーム管理に課題があり、支援が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="team-mgmt-d" />
                        <Label htmlFor="team-mgmt-d" className="font-normal">
                          <span className="font-semibold">D：</span> チーム管理が不適切で、問題が頻発
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 人材育成・スキル向上</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="hr-dev-s" />
                        <Label htmlFor="hr-dev-s" className="font-normal">
                          <span className="font-semibold">S：</span> 体系的な育成システムを構築し、チーム全体のレベルを向上
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="hr-dev-a" />
                        <Label htmlFor="hr-dev-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的に人材育成に取り組み、メンバーの成長を支援
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="hr-dev-b" />
                        <Label htmlFor="hr-dev-b" className="font-normal">
                          <span className="font-semibold">B：</span> 必要な指導・育成を適切に実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="hr-dev-c" />
                        <Label htmlFor="hr-dev-c" className="font-normal">
                          <span className="font-semibold">C：</span> 育成への取り組みが不十分
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="hr-dev-d" />
                        <Label htmlFor="hr-dev-d" className="font-normal">
                          <span className="font-semibold">D：</span> 人材育成を軽視している
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 病棟運営への参画</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="ward-ops-s" />
                        <Label htmlFor="ward-ops-s" className="font-normal">
                          <span className="font-semibold">S：</span> 補助者業務の効率化を主導し、病棟運営の改革に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="ward-ops-a" />
                        <Label htmlFor="ward-ops-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的に病棟運営に参画し、改善を推進
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="ward-ops-b" />
                        <Label htmlFor="ward-ops-b" className="font-normal">
                          <span className="font-semibold">B：</span> 求められる運営業務を適切に遂行
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="ward-ops-c" />
                        <Label htmlFor="ward-ops-c" className="font-normal">
                          <span className="font-semibold">C：</span> 病棟運営への参画が限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="ward-ops-d" />
                        <Label htmlFor="ward-ops-d" className="font-normal">
                          <span className="font-semibold">D：</span> 病棟運営への貢献がほとんどない
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
                    placeholder="チーム管理の成果、人材育成実績、病棟運営への貢献など"
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
                  リーダーとしての能力と法人運営への貢献を中心に評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. リーダーシップの実践</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="leadership-s" />
                        <Label htmlFor="leadership-s" className="font-normal">
                          <span className="font-semibold">S：</span> 模範的なリーダーシップで他のリーダーの手本となる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="leadership-a" />
                        <Label htmlFor="leadership-a" className="font-normal">
                          <span className="font-semibold">A：</span> 高いリーダーシップを発揮し、成果を上げる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="leadership-b" />
                        <Label htmlFor="leadership-b" className="font-normal">
                          <span className="font-semibold">B：</span> リーダーとして期待される役割を果たす
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="leadership-c" />
                        <Label htmlFor="leadership-c" className="font-normal">
                          <span className="font-semibold">C：</span> リーダーシップに改善の余地がある
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="leadership-d" />
                        <Label htmlFor="leadership-d" className="font-normal">
                          <span className="font-semibold">D：</span> リーダーとして不適格な実践
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. サービス品質の管理</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="quality-mgmt-s" />
                        <Label htmlFor="quality-mgmt-s" className="font-normal">
                          <span className="font-semibold">S：</span> 法人最高水準のサービス品質を実現し、標準化に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="quality-mgmt-a" />
                        <Label htmlFor="quality-mgmt-a" className="font-normal">
                          <span className="font-semibold">A：</span> 高いサービス品質を維持し、継続的改善を実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="quality-mgmt-b" />
                        <Label htmlFor="quality-mgmt-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的なサービス品質を管理
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="quality-mgmt-c" />
                        <Label htmlFor="quality-mgmt-c" className="font-normal">
                          <span className="font-semibold">C：</span> サービス品質管理に課題がある
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="quality-mgmt-d" />
                        <Label htmlFor="quality-mgmt-d" className="font-normal">
                          <span className="font-semibold">D：</span> サービス品質が低下している
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 組織運営・業務改善</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="org-improve-s" />
                        <Label htmlFor="org-improve-s" className="font-normal">
                          <span className="font-semibold">S：</span> 革新的な改善を実現し、法人全体の補助者業務を変革
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="org-improve-a" />
                        <Label htmlFor="org-improve-a" className="font-normal">
                          <span className="font-semibold">A：</span> 継続的に業務改善を推進し、組織に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="org-improve-b" />
                        <Label htmlFor="org-improve-b" className="font-normal">
                          <span className="font-semibold">B：</span> 必要な改善活動を実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="org-improve-c" />
                        <Label htmlFor="org-improve-c" className="font-normal">
                          <span className="font-semibold">C：</span> 改善活動への取り組みが消極的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="org-improve-d" />
                        <Label htmlFor="org-improve-d" className="font-normal">
                          <span className="font-semibold">D：</span> 改善・革新に抵抗する
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
                  <Label htmlFor="corporate-comment">管理実践の具体例・評価コメント</Label>
                  <Textarea 
                    id="corporate-comment" 
                    placeholder="リーダーシップの成果、サービス品質管理、組織改善への貢献など"
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
                    <p className="text-sm text-gray-600">チーム管理・病棟運営</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">法人内評価</h4>
                    <p className="text-2xl font-bold text-green-600">B</p>
                    <p className="text-sm text-gray-600">リーダーシップ・組織貢献</p>
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
                        <RadioGroupItem value="executive-ready" id="type-executive" />
                        <Label htmlFor="type-executive" className="font-normal">
                          上級管理職候補型（両軸でS・A）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="solid-leader" id="type-solid" />
                        <Label htmlFor="type-solid" className="font-normal">
                          堅実リーダー型（両軸でB）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="operations-focused" id="type-ops" />
                        <Label htmlFor="type-ops" className="font-normal">
                          現場重視型（施設評価が高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="strategic" id="type-strategic" />
                        <Label htmlFor="type-strategic" className="font-normal">
                          戦略的リーダー型（法人評価が高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="development-needed" id="type-develop" />
                        <Label htmlFor="type-develop" className="font-normal">
                          リーダー能力開発必要型（両軸でC以下）
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="overall-assessment">総合所見</Label>
                  <Textarea 
                    id="overall-assessment" 
                    placeholder="看護補助者リーダーとしての総合評価、管理能力、今後の展望など"
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 育成計画タブ */}
            <TabsContent value="development" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">リーダー育成計画</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="strengths">リーダーとしての強み</Label>
                  <Textarea 
                    id="strengths" 
                    placeholder="チーム管理力、コミュニケーション力、業務改善力など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="development-areas">強化すべきリーダー能力</Label>
                  <Textarea 
                    id="development-areas" 
                    placeholder="戦略的思考、問題解決力、調整力、財務管理など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="leadership-goals">リーダーとしての目標（1年）</Label>
                  <Textarea 
                    id="leadership-goals" 
                    placeholder="チーム業績向上、サービス品質向上、業務効率化など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="training-plan">リーダー研修・教育計画</Label>
                  <Textarea 
                    id="training-plan" 
                    placeholder="管理職研修、外部セミナー、他施設視察など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="career-path">キャリアパス（3-5年）</Label>
                  <Textarea 
                    id="career-path" 
                    placeholder="主任職、看護部スタッフ、他部門管理職など"
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