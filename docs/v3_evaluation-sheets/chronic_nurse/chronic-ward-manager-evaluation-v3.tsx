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

export default function ChronicWardManagerEvaluationV3() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            【慢性期医療】師長看護師 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            慢性期病棟の経営管理と戦略的運営を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              師長看護師は慢性期病棟の経営管理能力と戦略的リーダーシップを評価します
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
                  <Label htmlFor="manager-experience">師長経験年数</Label>
                  <Input type="text" id="manager-experience" placeholder="例：5年目" />
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
                    <Label htmlFor="department">管理病棟</Label>
                    <Input type="text" id="department" placeholder="例：療養病棟50床" />
                  </div>
                  <div>
                    <Label htmlFor="staff-size">管理職員数</Label>
                    <Input type="number" id="staff-size" placeholder="例：45名" />
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
                    <Label htmlFor="evaluator2">2次評価者（病院長）</Label>
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
                  慢性期病棟の経営成果と組織運営を中心に評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 慢性期病棟の経営成果</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="management-s" />
                        <Label htmlFor="management-s" className="font-normal">
                          <span className="font-semibold">S：</span> 卓越した経営成果で、病床稼働率・収益性で法人トップクラス
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="management-a" />
                        <Label htmlFor="management-a" className="font-normal">
                          <span className="font-semibold">A：</span> 目標を上回る経営成果を達成
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="management-b" />
                        <Label htmlFor="management-b" className="font-normal">
                          <span className="font-semibold">B：</span> 目標通りの経営成果を達成
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="management-c" />
                        <Label htmlFor="management-c" className="font-normal">
                          <span className="font-semibold">C：</span> 経営成果が目標を下回る
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="management-d" />
                        <Label htmlFor="management-d" className="font-normal">
                          <span className="font-semibold">D：</span> 経営成果が著しく低い
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 慢性期ケアチームの組織力</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="team-s" />
                        <Label htmlFor="team-s" className="font-normal">
                          <span className="font-semibold">S：</span> 最高水準の慢性期ケアチームを構築し、他病棟の模範
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="team-a" />
                        <Label htmlFor="team-a" className="font-normal">
                          <span className="font-semibold">A：</span> 高い組織力を持つチームを育成
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="team-b" />
                        <Label htmlFor="team-b" className="font-normal">
                          <span className="font-semibold">B：</span> 安定した組織運営を維持
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="team-c" />
                        <Label htmlFor="team-c" className="font-normal">
                          <span className="font-semibold">C：</span> 組織力に課題がある
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="team-d" />
                        <Label htmlFor="team-d" className="font-normal">
                          <span className="font-semibold">D：</span> 組織運営に重大な問題がある
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 施設経営への貢献</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="facility-contrib-s" />
                        <Label htmlFor="facility-contrib-s" className="font-normal">
                          <span className="font-semibold">S：</span> 施設経営の中核として戦略立案・実行をリード
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="facility-contrib-a" />
                        <Label htmlFor="facility-contrib-a" className="font-normal">
                          <span className="font-semibold">A：</span> 施設経営に積極的に参画し、貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="facility-contrib-b" />
                        <Label htmlFor="facility-contrib-b" className="font-normal">
                          <span className="font-semibold">B：</span> 求められる役割を適切に果たす
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="facility-contrib-c" />
                        <Label htmlFor="facility-contrib-c" className="font-normal">
                          <span className="font-semibold">C：</span> 施設経営への参画が限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="facility-contrib-d" />
                        <Label htmlFor="facility-contrib-d" className="font-normal">
                          <span className="font-semibold">D：</span> 施設経営への貢献がない
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
                    placeholder="経営成果の具体例、組織運営の成果、施設経営への貢献など"
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
                  慢性期ケアの戦略的リーダーシップと法人貢献を中心に評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 慢性期ケアの戦略的リーダーシップ</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="leadership-s" />
                        <Label htmlFor="leadership-s" className="font-normal">
                          <span className="font-semibold">S：</span> 法人の慢性期ケア戦略を主導し、革新的な成果を創出
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="leadership-a" />
                        <Label htmlFor="leadership-a" className="font-normal">
                          <span className="font-semibold">A：</span> 優れたリーダーシップで慢性期ケアを発展させる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="leadership-b" />
                        <Label htmlFor="leadership-b" className="font-normal">
                          <span className="font-semibold">B：</span> 期待されるリーダーシップを発揮
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
                          <span className="font-semibold">D：</span> リーダーシップが不十分
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 慢性期ケアの質保証・標準化</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="quality-assurance-s" />
                        <Label htmlFor="quality-assurance-s" className="font-normal">
                          <span className="font-semibold">S：</span> 法人全体の慢性期ケア標準を確立し、質保証システムを構築
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="quality-assurance-a" />
                        <Label htmlFor="quality-assurance-a" className="font-normal">
                          <span className="font-semibold">A：</span> 高い質保証体制を構築し、継続的改善を実現
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="quality-assurance-b" />
                        <Label htmlFor="quality-assurance-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的な質保証活動を実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="quality-assurance-c" />
                        <Label htmlFor="quality-assurance-c" className="font-normal">
                          <span className="font-semibold">C：</span> 質保証活動が不十分
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="quality-assurance-d" />
                        <Label htmlFor="quality-assurance-d" className="font-normal">
                          <span className="font-semibold">D：</span> 質に問題があり、改善が必要
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 法人戦略への貢献・外部連携</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="strategy-s" />
                        <Label htmlFor="strategy-s" className="font-normal">
                          <span className="font-semibold">S：</span> 法人の慢性期医療戦略を立案し、地域連携をリード
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="strategy-a" />
                        <Label htmlFor="strategy-a" className="font-normal">
                          <span className="font-semibold">A：</span> 法人戦略に積極的に参画し、外部連携を推進
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="strategy-b" />
                        <Label htmlFor="strategy-b" className="font-normal">
                          <span className="font-semibold">B：</span> 法人方針に沿って適切に活動
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="strategy-c" />
                        <Label htmlFor="strategy-c" className="font-normal">
                          <span className="font-semibold">C：</span> 法人戦略への関与が限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="strategy-d" />
                        <Label htmlFor="strategy-d" className="font-normal">
                          <span className="font-semibold">D：</span> 法人戦略への貢献がない
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
                  <Label htmlFor="corporate-comment">戦略的実践の具体例・評価コメント</Label>
                  <Textarea 
                    id="corporate-comment" 
                    placeholder="戦略的リーダーシップの成果、質保証の実績、法人貢献の具体例など"
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
                    <p className="text-sm text-gray-600">経営成果・組織運営</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">法人内評価</h4>
                    <p className="text-2xl font-bold text-green-600">B</p>
                    <p className="text-sm text-gray-600">戦略的リーダーシップ・法人貢献</p>
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
                        <RadioGroupItem value="executive" id="type-executive" />
                        <Label htmlFor="type-executive" className="font-normal">
                          経営幹部型（両軸でS・A）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="balanced-leader" id="type-balanced" />
                        <Label htmlFor="type-balanced" className="font-normal">
                          バランス経営型（両軸でB以上）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="operational" id="type-operational" />
                        <Label htmlFor="type-operational" className="font-normal">
                          現場運営型（施設評価が高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="strategic-leader" id="type-strategic" />
                        <Label htmlFor="type-strategic" className="font-normal">
                          戦略推進型（法人評価が高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="improvement-needed" id="type-improve" />
                        <Label htmlFor="type-improve" className="font-normal">
                          経営力強化必要型（両軸でC以下）
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="overall-assessment">総合所見</Label>
                  <Textarea 
                    id="overall-assessment" 
                    placeholder="師長として慢性期病棟経営の総合評価、強み、今後の展望など"
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 育成計画タブ */}
            <TabsContent value="development" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">経営幹部育成計画</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="strengths">経営管理者としての強み</Label>
                  <Textarea 
                    id="strengths" 
                    placeholder="慢性期ケア経営力、戦略的思考、組織運営力など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="development-areas">強化すべき経営能力</Label>
                  <Textarea 
                    id="development-areas" 
                    placeholder="財務戦略、地域連携、イノベーション推進など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="strategic-goals">戦略的目標（1-2年）</Label>
                  <Textarea 
                    id="strategic-goals" 
                    placeholder="慢性期医療の新モデル構築、地域包括ケアへの貢献、収益性向上など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="executive-training">経営幹部研修計画</Label>
                  <Textarea 
                    id="executive-training" 
                    placeholder="経営管理研修、医療政策セミナー、MBA取得支援など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="career-vision">キャリアビジョン（5年後）</Label>
                  <Textarea 
                    id="career-vision" 
                    placeholder="看護部長、慢性期医療統括責任者、病院経営幹部など"
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