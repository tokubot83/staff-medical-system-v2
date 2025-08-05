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

export default function ChronicMidlevelNurseEvaluationV3() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            【慢性期医療】中堅看護師（4-10年目） 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            慢性期ケアのリーダーシップと専門性を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              中堅看護師は慢性期ケアのリーダーシップ発揮と専門性の深化を評価します
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
                  <Input type="text" id="experience" placeholder="例：7年目" />
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
                    <Label htmlFor="roles">担当役割</Label>
                    <Input type="text" id="roles" placeholder="例：チームリーダー、認知症ケア担当" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（主任）</Label>
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
                  慢性期ケアのリーダーシップと病棟運営への貢献を中心に評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 慢性期ケアリーダーシップの発揮</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="leadership-s" />
                        <Label htmlFor="leadership-s" className="font-normal">
                          <span className="font-semibold">S：</span> 卓越したリーダーシップで慢性期ケアの質を向上させ、変革を推進
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="leadership-a" />
                        <Label htmlFor="leadership-a" className="font-normal">
                          <span className="font-semibold">A：</span> 効果的なリーダーシップでチームを導く
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="leadership-b" />
                        <Label htmlFor="leadership-b" className="font-normal">
                          <span className="font-semibold">B：</span> 求められる場面でリーダーシップを発揮
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="leadership-c" />
                        <Label htmlFor="leadership-c" className="font-normal">
                          <span className="font-semibold">C：</span> リーダーシップの発揮が限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="leadership-d" />
                        <Label htmlFor="leadership-d" className="font-normal">
                          <span className="font-semibold">D：</span> リーダーシップの発揮が不十分
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 慢性期ケア教育・人材育成</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="education-s" />
                        <Label htmlFor="education-s" className="font-normal">
                          <span className="font-semibold">S：</span> 体系的な慢性期ケア教育プログラムを構築し、多くの人材を育成
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="education-a" />
                        <Label htmlFor="education-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的に後輩育成に取り組み、成果を上げる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="education-b" />
                        <Label htmlFor="education-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的な指導・教育を実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="education-c" />
                        <Label htmlFor="education-c" className="font-normal">
                          <span className="font-semibold">C：</span> 教育への関わりが消極的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="education-d" />
                        <Label htmlFor="education-d" className="font-normal">
                          <span className="font-semibold">D：</span> 人材育成への貢献がほとんどない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 療養病棟運営・マネジメント</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="management-s" />
                        <Label htmlFor="management-s" className="font-normal">
                          <span className="font-semibold">S：</span> 主任級の役割を担い、病棟運営の中核として機能
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="management-a" />
                        <Label htmlFor="management-a" className="font-normal">
                          <span className="font-semibold">A：</span> 病棟運営に積極的に参画し、改善を推進
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="management-b" />
                        <Label htmlFor="management-b" className="font-normal">
                          <span className="font-semibold">B：</span> 求められる管理的業務を適切に遂行
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="management-c" />
                        <Label htmlFor="management-c" className="font-normal">
                          <span className="font-semibold">C：</span> 管理的業務への関わりが限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="management-d" />
                        <Label htmlFor="management-d" className="font-normal">
                          <span className="font-semibold">D：</span> 病棟運営への貢献が不十分
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
                    placeholder="リーダーシップの発揮例、人材育成の成果、病棟運営への貢献など"
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
                  高度な慢性期ケア実践能力と専門性を中心に評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 慢性期ケアの専門的実践</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="expertise-s" />
                        <Label htmlFor="expertise-s" className="font-normal">
                          <span className="font-semibold">S：</span> 慢性期ケアのエキスパートとして最高レベルの実践を行い、模範となる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="expertise-a" />
                        <Label htmlFor="expertise-a" className="font-normal">
                          <span className="font-semibold">A：</span> 高度な実践能力を持ち、困難事例にも対応可能
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="expertise-b" />
                        <Label htmlFor="expertise-b" className="font-normal">
                          <span className="font-semibold">B：</span> 期待される実践能力を有している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="expertise-c" />
                        <Label htmlFor="expertise-c" className="font-normal">
                          <span className="font-semibold">C：</span> 実践能力に改善の余地がある
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="expertise-d" />
                        <Label htmlFor="expertise-d" className="font-normal">
                          <span className="font-semibold">D：</span> 中堅として期待される実践能力に達していない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 認知症・終末期ケアの専門性</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="special-expertise-s" />
                        <Label htmlFor="special-expertise-s" className="font-normal">
                          <span className="font-semibold">S：</span> 認知症・終末期ケアの専門家として組織をリード
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="special-expertise-a" />
                        <Label htmlFor="special-expertise-a" className="font-normal">
                          <span className="font-semibold">A：</span> 高度な専門知識を持ち、質の高いケアを実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="special-expertise-b" />
                        <Label htmlFor="special-expertise-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的な専門ケアを適切に実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="special-expertise-c" />
                        <Label htmlFor="special-expertise-c" className="font-normal">
                          <span className="font-semibold">C：</span> 専門性の向上が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="special-expertise-d" />
                        <Label htmlFor="special-expertise-d" className="font-normal">
                          <span className="font-semibold">D：</span> 専門ケアの実践に課題がある
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 法人への貢献・慢性期ケアの発展</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="contribution-s" />
                        <Label htmlFor="contribution-s" className="font-normal">
                          <span className="font-semibold">S：</span> 法人の慢性期ケア方針策定に参画し、質向上をリード
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="contribution-a" />
                        <Label htmlFor="contribution-a" className="font-normal">
                          <span className="font-semibold">A：</span> 施設を超えた活動に参加し、法人に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="contribution-b" />
                        <Label htmlFor="contribution-b" className="font-normal">
                          <span className="font-semibold">B：</span> 施設内で期待される役割を果たす
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="contribution-c" />
                        <Label htmlFor="contribution-c" className="font-normal">
                          <span className="font-semibold">C：</span> 貢献が限定的である
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="contribution-d" />
                        <Label htmlFor="contribution-d" className="font-normal">
                          <span className="font-semibold">D：</span> 法人への貢献がほとんどない
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
                  <Label htmlFor="corporate-comment">実践能力の具体例・評価コメント</Label>
                  <Textarea 
                    id="corporate-comment" 
                    placeholder="専門的実践の具体例、認知症・終末期ケアの成果、法人への貢献など"
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
                    <p className="text-sm text-gray-600">リーダーシップ・病棟運営</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">法人内評価</h4>
                    <p className="text-2xl font-bold text-green-600">B</p>
                    <p className="text-sm text-gray-600">慢性期専門性・法人貢献</p>
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
                        <RadioGroupItem value="management-track" id="type-management" />
                        <Label htmlFor="type-management" className="font-normal">
                          管理職候補型（両軸でA以上）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="balanced" id="type-balanced" />
                        <Label htmlFor="type-balanced" className="font-normal">
                          バランス型（両軸でB以上）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="specialist" id="type-specialist" />
                        <Label htmlFor="type-specialist" className="font-normal">
                          慢性期スペシャリスト型（法人評価が高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="site-leader" id="type-site" />
                        <Label htmlFor="type-site" className="font-normal">
                          現場リーダー型（施設評価が高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="plateau" id="type-plateau" />
                        <Label htmlFor="type-plateau" className="font-normal">
                          成長停滞型（両軸でC以下）
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="overall-assessment">総合所見</Label>
                  <Textarea 
                    id="overall-assessment" 
                    placeholder="中堅看護師としての慢性期ケア実践、強み、今後の方向性など"
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
                  <Label htmlFor="strengths">特に優れている点・強み</Label>
                  <Textarea 
                    id="strengths" 
                    placeholder="慢性期ケアのリーダーシップ、専門性、人材育成力など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="growth-areas">今後の成長課題</Label>
                  <Textarea 
                    id="growth-areas" 
                    placeholder="管理能力、認知症ケアの更なる専門化、組織への影響力など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="next-goals">次期（1年後）の目標</Label>
                  <Textarea 
                    id="next-goals" 
                    placeholder="認知症ケア指導者、終末期ケアチームリーダー、教育体制の構築など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="support-plan">必要なサポート・教育計画</Label>
                  <Textarea 
                    id="support-plan" 
                    placeholder="認知症ケア指導者研修、管理者研修、外部専門研修など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="career-vision">キャリアビジョン（3-5年後）</Label>
                  <Textarea 
                    id="career-vision" 
                    placeholder="慢性期ケア専門看護師、主任職、認知症ケアエキスパートなど"
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