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
import { Info } from 'lucide-react';

export default function JuniorCareAssistantEvaluationV3() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            老健 2・3年目介護士 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            入所・通所サービス両部門対応 実践向上期評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              技術の応用力、新人指導への関わり、在宅復帰支援への理解深化を重点評価します
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
                  <Label htmlFor="experience">経験年数</Label>
                  <Input type="text" id="experience" placeholder="2年目 / 3年目" />
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
                    <Label htmlFor="department">配属部門</Label>
                    <select id="department" className="w-full border rounded-md px-3 py-2">
                      <option value="">選択してください</option>
                      <option value="admission">入所サービス</option>
                      <option value="daycare">通所サービス</option>
                      <option value="both">入所・通所兼務</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="mentor-role">新人指導役割</Label>
                    <select id="mentor-role" className="w-full border rounded-md px-3 py-2">
                      <option value="">選択してください</option>
                      <option value="yes">あり（補助的）</option>
                      <option value="no">なし</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（介護福祉士）</Label>
                    <Input type="text" id="evaluator1" />
                  </div>
                  <div>
                    <Label htmlFor="evaluator2">2次評価者（介護主任）</Label>
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
                  チーム内での積極性と後輩への配慮を中心に評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. チーム内での積極性・責任感</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="proactive-s" />
                        <Label htmlFor="proactive-s" className="font-normal">
                          <span className="font-semibold">S：</span> リーダーシップを発揮し、チーム運営に積極的に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="proactive-a" />
                        <Label htmlFor="proactive-a" className="font-normal">
                          <span className="font-semibold">A：</span> 主体的に行動し、責任を持って業務を遂行
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="proactive-b" />
                        <Label htmlFor="proactive-b" className="font-normal">
                          <span className="font-semibold">B：</span> 与えられた役割を適切に果たしている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="proactive-c" />
                        <Label htmlFor="proactive-c" className="font-normal">
                          <span className="font-semibold">C：</span> 受動的で、積極性に欠ける
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="proactive-d" />
                        <Label htmlFor="proactive-d" className="font-normal">
                          <span className="font-semibold">D：</span> 責任感が不足し、チームに負担をかける
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 新人・後輩への指導・サポート</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="support-s" />
                        <Label htmlFor="support-s" className="font-normal">
                          <span className="font-semibold">S：</span> 新人の良き手本となり、積極的にサポート・指導
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="support-a" />
                        <Label htmlFor="support-a" className="font-normal">
                          <span className="font-semibold">A：</span> 後輩への配慮があり、適切なアドバイスを提供
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="support-b" />
                        <Label htmlFor="support-b" className="font-normal">
                          <span className="font-semibold">B：</span> 求められれば後輩をサポートする
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="support-c" />
                        <Label htmlFor="support-c" className="font-normal">
                          <span className="font-semibold">C：</span> 後輩への関心・配慮が不足
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="support-d" />
                        <Label htmlFor="support-d" className="font-normal">
                          <span className="font-semibold">D：</span> 後輩に対して否定的な態度を取る
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 業務改善への取り組み</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="improve-s" />
                        <Label htmlFor="improve-s" className="font-normal">
                          <span className="font-semibold">S：</span> 問題を発見し、具体的な改善提案を実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="improve-a" />
                        <Label htmlFor="improve-a" className="font-normal">
                          <span className="font-semibold">A：</span> 改善点を見つけ、上司に提案する
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="improve-b" />
                        <Label htmlFor="improve-b" className="font-normal">
                          <span className="font-semibold">B：</span> 改善活動に参加し、協力している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="improve-c" />
                        <Label htmlFor="improve-c" className="font-normal">
                          <span className="font-semibold">C：</span> 現状維持にとどまり、改善意識が低い
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="improve-d" />
                        <Label htmlFor="improve-d" className="font-normal">
                          <span className="font-semibold">D：</span> 変化を嫌い、改善に消極的
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
                    placeholder="チームでの積極性、後輩指導の状況、改善提案の内容など"
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
                  応用的介護技術と自立支援の実践力を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 応用的介護技術の実践</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="advanced-s" />
                        <Label htmlFor="advanced-s" className="font-normal">
                          <span className="font-semibold">S：</span> 個別性を考慮した創造的なケアを実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="advanced-a" />
                        <Label htmlFor="advanced-a" className="font-normal">
                          <span className="font-semibold">A：</span> 応用的な技術を身につけ、質の高いケアを提供
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="advanced-b" />
                        <Label htmlFor="advanced-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本技術を確実に実施し、応用も始めている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="advanced-c" />
                        <Label htmlFor="advanced-c" className="font-normal">
                          <span className="font-semibold">C：</span> 基本技術に不安があり、応用が困難
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="advanced-d" />
                        <Label htmlFor="advanced-d" className="font-normal">
                          <span className="font-semibold">D：</span> 技術の向上が見られず、指導が必要
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 自立支援・機能訓練への理解</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="rehab-s" />
                        <Label htmlFor="rehab-s" className="font-normal">
                          <span className="font-semibold">S：</span> 自立支援の視点を深く理解し、創意工夫でケアを実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="rehab-a" />
                        <Label htmlFor="rehab-a" className="font-normal">
                          <span className="font-semibold">A：</span> 残存機能を活かすケアを意識的に実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="rehab-b" />
                        <Label htmlFor="rehab-b" className="font-normal">
                          <span className="font-semibold">B：</span> 自立支援の基本的な考え方を理解し実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="rehab-c" />
                        <Label htmlFor="rehab-c" className="font-normal">
                          <span className="font-semibold">C：</span> 自立支援への理解が不十分
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="rehab-d" />
                        <Label htmlFor="rehab-d" className="font-normal">
                          <span className="font-semibold">D：</span> 介護依存的なケアになりがち
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 家族・多職種との連携</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="collab-s" />
                        <Label htmlFor="collab-s" className="font-normal">
                          <span className="font-semibold">S：</span> 家族の気持ちを理解し、多職種と効果的に連携
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="collab-a" />
                        <Label htmlFor="collab-a" className="font-normal">
                          <span className="font-semibold">A：</span> 適切な家族対応と多職種連携ができる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="collab-b" />
                        <Label htmlFor="collab-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本的な連携・情報共有を行っている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="collab-c" />
                        <Label htmlFor="collab-c" className="font-normal">
                          <span className="font-semibold">C：</span> 連携に消極的で、情報共有が不十分
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="collab-d" />
                        <Label htmlFor="collab-d" className="font-normal">
                          <span className="font-semibold">D：</span> 連携を避け、独りよがりなケアになる
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
                  <Label htmlFor="corporate-comment">技術向上の具体例・評価コメント</Label>
                  <Textarea
                    id="corporate-comment"
                    placeholder="応用技術の習得、自立支援の実践例、連携の成功事例など"
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
                    <p className="text-sm text-gray-600">積極性・後輩支援</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">法人内評価</h4>
                    <p className="text-2xl font-bold text-green-600">B</p>
                    <p className="text-sm text-gray-600">応用技術・連携力</p>
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
                  <h4 className="font-semibold mb-3">成長段階評価</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="accelerated" id="stage-accelerated" />
                        <Label htmlFor="stage-accelerated" className="font-normal">
                          加速成長型（両軸でA以上、中堅レベルに到達）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="standard-progress" id="stage-standard" />
                        <Label htmlFor="stage-standard" className="font-normal">
                          標準成長型（両軸でB、順調な発達）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="technical-focus" id="stage-technical" />
                        <Label htmlFor="stage-technical" className="font-normal">
                          技術重視型（法人評価が高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="team-focus" id="stage-team" />
                        <Label htmlFor="stage-team" className="font-normal">
                          チーム貢献型（施設評価が高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="gradual" id="stage-gradual" />
                        <Label htmlFor="stage-gradual" className="font-normal">
                          段階的成長型（時間をかけて着実に成長）
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="overall-assessment">総合所見</Label>
                  <Textarea
                    id="overall-assessment"
                    placeholder="2・3年目としての成長度、強み、今後の可能性など"
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 育成計画タブ */}
            <TabsContent value="development" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">個別育成計画</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="achievements">この1年間の主な成長</Label>
                  <Textarea
                    id="achievements"
                    placeholder="技術向上、チーム貢献、後輩支援の成果など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="strengths">特に優れている点・強み</Label>
                  <Textarea
                    id="strengths"
                    placeholder="応用力、協調性、学習意欲、リーダーシップなど"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="growth-areas">今後の成長課題</Label>
                  <Textarea
                    id="growth-areas"
                    placeholder="専門知識の深化、指導力の向上、連携スキルなど"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="next-goals">次期（6ヶ月後）の目標</Label>
                  <Textarea
                    id="next-goals"
                    placeholder="・新人の主指導者役割\n・応用技術の完全習得\n・家族対応スキルの向上"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="support-plan">必要なサポート・教育計画</Label>
                  <Textarea
                    id="support-plan"
                    placeholder="・専門研修の受講\n・他部門との交流研修\n・リーダーシップ研修"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="career-development">キャリア発展の方向性</Label>
                  <Textarea
                    id="career-development"
                    placeholder="介護福祉士取得、専門分野の選択、リーダー候補など"
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