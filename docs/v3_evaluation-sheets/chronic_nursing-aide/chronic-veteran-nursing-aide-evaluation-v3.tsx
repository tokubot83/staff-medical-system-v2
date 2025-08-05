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
import { Award } from 'lucide-react';

export default function ChronicVeteranNursingAideEvaluationV3() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            慢性期医療 ベテラン看護補助者（11年目以上） 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            療養ケアのエキスパートとして知識伝承と質向上への貢献を評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Award className="h-4 w-4" />
            <AlertDescription>
              長年の経験を活かした専門的ケアの実践と、組織全体への貢献を重視した評価を行います
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
                  <Label htmlFor="eval-period">評価期</Label>
                  <Input type="text" id="eval-period" placeholder="2024年度 上期/下期" />
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
                    <Label htmlFor="department">配属施設・病棟</Label>
                    <Input type="text" id="department" placeholder="医療療養病棟 / 介護医療院" />
                  </div>
                  <div>
                    <Label htmlFor="experience">経験年数</Label>
                    <Input type="text" id="experience" placeholder="15年（慢性期12年）" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（リーダー・主任）</Label>
                    <Input type="text" id="evaluator1" />
                  </div>
                  <div>
                    <Label htmlFor="evaluator2">2次評価者（師長）</Label>
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
                  療養チームの精神的支柱としての役割と組織貢献を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 療養ケアの模範とリーダーシップ</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="role-model-s" />
                        <Label htmlFor="role-model-s" className="font-normal">
                          <span className="font-semibold">S：</span> 療養ケアの最高峰として、組織全体の質向上を牽引
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="role-model-a" />
                        <Label htmlFor="role-model-a" className="font-normal">
                          <span className="font-semibold">A：</span> 優れた実践で他職員の模範となり、積極的に指導
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="role-model-b" />
                        <Label htmlFor="role-model-b" className="font-normal">
                          <span className="font-semibold">B：</span> ベテランとして期待される役割を果たしている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="role-model-c" />
                        <Label htmlFor="role-model-c" className="font-normal">
                          <span className="font-semibold">C：</span> 経験に見合うリーダーシップが不足
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="role-model-d" />
                        <Label htmlFor="role-model-d" className="font-normal">
                          <span className="font-semibold">D：</span> 模範としての役割を果たしていない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 知識・技術の伝承と教育</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="knowledge-transfer-s" />
                        <Label htmlFor="knowledge-transfer-s" className="font-normal">
                          <span className="font-semibold">S：</span> 体系的な教育プログラムを構築し、多くの人材を育成
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="knowledge-transfer-a" />
                        <Label htmlFor="knowledge-transfer-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的に知識・技術を伝承し、後輩の成長に大きく貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="knowledge-transfer-b" />
                        <Label htmlFor="knowledge-transfer-b" className="font-normal">
                          <span className="font-semibold">B：</span> 求められれば適切に指導・教育を実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="knowledge-transfer-c" />
                        <Label htmlFor="knowledge-transfer-c" className="font-normal">
                          <span className="font-semibold">C：</span> 知識伝承への関与が限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="knowledge-transfer-d" />
                        <Label htmlFor="knowledge-transfer-d" className="font-normal">
                          <span className="font-semibold">D：</span> 教育・指導への意欲が低い
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 療養文化の醸成と改革</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="culture-s" />
                        <Label htmlFor="culture-s" className="font-normal">
                          <span className="font-semibold">S：</span> 革新的な取り組みで療養ケアの文化を変革
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="culture-a" />
                        <Label htmlFor="culture-a" className="font-normal">
                          <span className="font-semibold">A：</span> 良い療養文化の醸成に積極的に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="culture-b" />
                        <Label htmlFor="culture-b" className="font-normal">
                          <span className="font-semibold">B：</span> 経験を活かして建設的な提案を行う
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="culture-c" />
                        <Label htmlFor="culture-c" className="font-normal">
                          <span className="font-semibold">C：</span> 文化醸成への貢献が不足
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="culture-d" />
                        <Label htmlFor="culture-d" className="font-normal">
                          <span className="font-semibold">D：</span> 現状維持的で改革意識が低い
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
                    placeholder="模範的な実践例、教育・指導の成果、文化醸成への貢献など"
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
                  慢性期ケアのエキスパートとしての専門性を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 最高水準の療養生活援助</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="expert-care-s" />
                        <Label htmlFor="expert-care-s" className="font-normal">
                          <span className="font-semibold">S：</span> 芸術的とも言える援助技術で、患者の尊厳と安楽を最大化
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="expert-care-a" />
                        <Label htmlFor="expert-care-a" className="font-normal">
                          <span className="font-semibold">A：</span> 卓越した技術と判断力で、質の高いケアを安定提供
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="expert-care-b" />
                        <Label htmlFor="expert-care-b" className="font-normal">
                          <span className="font-semibold">B：</span> ベテランとして期待される水準のケアを提供
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="expert-care-c" />
                        <Label htmlFor="expert-care-c" className="font-normal">
                          <span className="font-semibold">C：</span> 技術の更新が遅れている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="expert-care-d" />
                        <Label htmlFor="expert-care-d" className="font-normal">
                          <span className="font-semibold">D：</span> 経験年数に見合う技術レベルに達していない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 複雑事例への対応力</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="complex-cases-s" />
                        <Label htmlFor="complex-cases-s" className="font-normal">
                          <span className="font-semibold">S：</span> 最困難事例でも的確に対応し、解決策を導き出す
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="complex-cases-a" />
                        <Label htmlFor="complex-cases-a" className="font-normal">
                          <span className="font-semibold">A：</span> 豊富な経験を活かし、困難事例にも適切に対応
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="complex-cases-b" />
                        <Label htmlFor="complex-cases-b" className="font-normal">
                          <span className="font-semibold">B：</span> 通常の複雑事例には対応できる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="complex-cases-c" />
                        <Label htmlFor="complex-cases-c" className="font-normal">
                          <span className="font-semibold">C：</span> 複雑事例への対応に消極的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="complex-cases-d" />
                        <Label htmlFor="complex-cases-d" className="font-normal">
                          <span className="font-semibold">D：</span> 困難事例を避ける傾向がある
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 患者・家族との深い信頼関係</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="trust-s" />
                        <Label htmlFor="trust-s" className="font-normal">
                          <span className="font-semibold">S：</span> 圧倒的な信頼を得て、施設の顔として評価される
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="trust-a" />
                        <Label htmlFor="trust-a" className="font-normal">
                          <span className="font-semibold">A：</span> 深い信頼関係を築き、満足度向上に大きく貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="trust-b" />
                        <Label htmlFor="trust-b" className="font-normal">
                          <span className="font-semibold">B：</span> 良好な関係を維持している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="trust-c" />
                        <Label htmlFor="trust-c" className="font-normal">
                          <span className="font-semibold">C：</span> 関係構築が表面的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="trust-d" />
                        <Label htmlFor="trust-d" className="font-normal">
                          <span className="font-semibold">D：</span> 信頼関係の構築に課題がある
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
                  <Label htmlFor="corporate-comment">エキスパートとしての実績・評価コメント</Label>
                  <Textarea 
                    id="corporate-comment" 
                    placeholder="卓越した援助の実例、困難事例での対応、患者・家族からの評価など"
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
                    <p className="text-sm text-gray-600">模範・教育・文化醸成</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">法人内評価</h4>
                    <p className="text-2xl font-bold text-green-600">A</p>
                    <p className="text-sm text-gray-600">専門性・信頼関係</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <h4 className="font-semibold mb-2">総合評価</h4>
                  <p className="text-3xl font-bold text-purple-600">A</p>
                  <p className="text-sm text-gray-600 mt-2">
                    施設内評価A × 法人内評価A = 総合評価A
                  </p>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">評価タイプ</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="master" id="type-master" />
                        <Label htmlFor="type-master" className="font-normal">
                          療養ケアマスター型（両軸で高評価）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="educator" id="type-educator" />
                        <Label htmlFor="type-educator" className="font-normal">
                          教育者型（施設評価が特に高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="craftsman" id="type-craftsman" />
                        <Label htmlFor="type-craftsman" className="font-normal">
                          職人型（法人評価が特に高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="stable-veteran" id="type-stable" />
                        <Label htmlFor="type-stable" className="font-normal">
                          安定ベテラン型（両軸でB）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="renewal-needed" id="type-renewal" />
                        <Label htmlFor="type-renewal" className="font-normal">
                          活性化必要型（更なる貢献が期待される）
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="overall-assessment">総合所見</Label>
                  <Textarea 
                    id="overall-assessment" 
                    placeholder="ベテランとしての価値、組織への貢献度、今後期待される役割など"
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 育成計画タブ */}
            <TabsContent value="development" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">キャリア総括と今後の活躍</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="career-achievements">キャリアの成果と強み</Label>
                  <Textarea 
                    id="career-achievements" 
                    placeholder="長年の実績、培った専門性、組織への貢献など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="current-value">現在の組織における価値</Label>
                  <Textarea 
                    id="current-value" 
                    placeholder="精神的支柱としての役割、専門知識の宝庫、信頼の象徴など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="legacy-planning">知識・技術の継承計画</Label>
                  <Textarea 
                    id="legacy-planning" 
                    placeholder="マニュアル作成、研修講師、メンター活動など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="future-roles">今後期待される役割</Label>
                  <Textarea 
                    id="future-roles" 
                    placeholder="教育専任、相談役、特別プロジェクト参画など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="work-life-balance">ワークライフバランスへの配慮</Label>
                  <Textarea 
                    id="work-life-balance" 
                    placeholder="体力面での配慮、勤務形態の調整、得意分野への集中など"
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