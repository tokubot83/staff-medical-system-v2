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
import { Users2 } from 'lucide-react';

export default function ChronicMidlevelNursingAideEvaluationV3() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            慢性期医療 中堅看護補助者（4-10年目） 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            療養ケアの専門性とチームリーダーシップを評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Users2 className="h-4 w-4" />
            <AlertDescription>
              療養チームの中核として、専門的ケアの実践と後輩育成を重視した評価を行います
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
                    <Input type="text" id="experience" placeholder="7年（慢性期5年）" />
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
                  療養チームでのリーダーシップと組織貢献を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. チームリーダーシップと調整力</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="leadership-s" />
                        <Label htmlFor="leadership-s" className="font-normal">
                          <span className="font-semibold">S：</span> 卓越したリーダーシップで、チーム全体のケア水準を向上
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="leadership-a" />
                        <Label htmlFor="leadership-a" className="font-normal">
                          <span className="font-semibold">A：</span> リーダーとして積極的に活動し、チームをまとめる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="leadership-b" />
                        <Label htmlFor="leadership-b" className="font-normal">
                          <span className="font-semibold">B：</span> 中堅として期待される役割を果たしている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="leadership-c" />
                        <Label htmlFor="leadership-c" className="font-normal">
                          <span className="font-semibold">C：</span> リーダーシップの発揮が不足
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="leadership-d" />
                        <Label htmlFor="leadership-d" className="font-normal">
                          <span className="font-semibold">D：</span> チーム内での影響力が低い
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 後輩指導と育成</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="mentoring-s" />
                        <Label htmlFor="mentoring-s" className="font-normal">
                          <span className="font-semibold">S：</span> 体系的な指導プログラムを実施し、多くの後輩を育成
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="mentoring-a" />
                        <Label htmlFor="mentoring-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的に後輩指導を行い、成長を支援
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="mentoring-b" />
                        <Label htmlFor="mentoring-b" className="font-normal">
                          <span className="font-semibold">B：</span> 必要に応じて適切な指導を実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="mentoring-c" />
                        <Label htmlFor="mentoring-c" className="font-normal">
                          <span className="font-semibold">C：</span> 指導への取り組みが消極的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="mentoring-d" />
                        <Label htmlFor="mentoring-d" className="font-normal">
                          <span className="font-semibold">D：</span> 後輩育成への関与が不足
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 業務改善と効率化への貢献</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="improvement-s" />
                        <Label htmlFor="improvement-s" className="font-normal">
                          <span className="font-semibold">S：</span> 革新的な改善提案により、療養ケアの質と効率を大幅に向上
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="improvement-a" />
                        <Label htmlFor="improvement-a" className="font-normal">
                          <span className="font-semibold">A：</span> 継続的に改善提案を行い、実現に向けて主導
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="improvement-b" />
                        <Label htmlFor="improvement-b" className="font-normal">
                          <span className="font-semibold">B：</span> 経験を活かした建設的な提案ができる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="improvement-c" />
                        <Label htmlFor="improvement-c" className="font-normal">
                          <span className="font-semibold">C：</span> 改善への積極性が不足
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="improvement-d" />
                        <Label htmlFor="improvement-d" className="font-normal">
                          <span className="font-semibold">D：</span> 現状維持的で改善意識が低い
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
                    placeholder="リーダーシップの発揮例、後輩育成の成果、業務改善の具体例など"
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
                  慢性期ケアの専門性と実践力を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 高度な療養生活援助の実践</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="advanced-care-s" />
                        <Label htmlFor="advanced-care-s" className="font-normal">
                          <span className="font-semibold">S：</span> 最高水準の援助技術で、複雑なケースにも完璧に対応
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="advanced-care-a" />
                        <Label htmlFor="advanced-care-a" className="font-normal">
                          <span className="font-semibold">A：</span> 高度な技術と判断力で、質の高いケアを提供
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="advanced-care-b" />
                        <Label htmlFor="advanced-care-b" className="font-normal">
                          <span className="font-semibold">B：</span> 中堅として期待される技術水準を維持
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="advanced-care-c" />
                        <Label htmlFor="advanced-care-c" className="font-normal">
                          <span className="font-semibold">C：</span> 技術の向上が停滞している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="advanced-care-d" />
                        <Label htmlFor="advanced-care-d" className="font-normal">
                          <span className="font-semibold">D：</span> 経験年数に見合う技術レベルに達していない
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
                        <RadioGroupItem value="s" id="specialized-s" />
                        <Label htmlFor="specialized-s" className="font-normal">
                          <span className="font-semibold">S：</span> 専門家レベルの知識と技術で、他職員の模範となる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="specialized-a" />
                        <Label htmlFor="specialized-a" className="font-normal">
                          <span className="font-semibold">A：</span> 深い理解と実践力で、困難事例にも適切に対応
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="specialized-b" />
                        <Label htmlFor="specialized-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的な認知症・終末期ケアを安定して提供
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="specialized-c" />
                        <Label htmlFor="specialized-c" className="font-normal">
                          <span className="font-semibold">C：</span> 専門的対応に課題がある
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="specialized-d" />
                        <Label htmlFor="specialized-d" className="font-normal">
                          <span className="font-semibold">D：</span> 専門性の向上が必要
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 家族支援と多職種連携</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="family-support-s" />
                        <Label htmlFor="family-support-s" className="font-normal">
                          <span className="font-semibold">S：</span> 家族との信頼関係構築と多職種連携の中心的役割
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="family-support-a" />
                        <Label htmlFor="family-support-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的な家族支援と円滑な多職種連携を実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="family-support-b" />
                        <Label htmlFor="family-support-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本的な家族対応と連携ができる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="family-support-c" />
                        <Label htmlFor="family-support-c" className="font-normal">
                          <span className="font-semibold">C：</span> 家族支援や連携に消極的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="family-support-d" />
                        <Label htmlFor="family-support-d" className="font-normal">
                          <span className="font-semibold">D：</span> 支援や連携が不十分
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
                  <Label htmlFor="corporate-comment">専門性発揮の具体例・評価コメント</Label>
                  <Textarea 
                    id="corporate-comment" 
                    placeholder="高度な援助技術の実践例、専門的ケアでの成果、家族支援の実績など"
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
                    <p className="text-sm text-gray-600">リーダーシップ・組織貢献</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">法人内評価</h4>
                    <p className="text-2xl font-bold text-green-600">B</p>
                    <p className="text-sm text-gray-600">専門性・実践力</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <h4 className="font-semibold mb-2">総合評価</h4>
                  <p className="text-3xl font-bold text-purple-600">A-</p>
                  <p className="text-sm text-gray-600 mt-2">
                    施設内評価A × 法人内評価B = 総合評価A-
                  </p>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">評価タイプ</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="next-leader" id="type-leader" />
                        <Label htmlFor="type-leader" className="font-normal">
                          次期リーダー型（両軸で高評価）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="management" id="type-management" />
                        <Label htmlFor="type-management" className="font-normal">
                          マネジメント型（施設評価が高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="expert" id="type-expert" />
                        <Label htmlFor="type-expert" className="font-normal">
                          専門実践型（法人評価が高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="veteran" id="type-veteran" />
                        <Label htmlFor="type-veteran" className="font-normal">
                          安定ベテラン型（両軸でB）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="plateau" id="type-plateau" />
                        <Label htmlFor="type-plateau" className="font-normal">
                          成長停滞型（更なる向上が必要）
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="overall-assessment">総合所見</Label>
                  <Textarea 
                    id="overall-assessment" 
                    placeholder="中堅職員としての価値、強み、組織への貢献度など"
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 育成計画タブ */}
            <TabsContent value="development" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">キャリア開発計画</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="strengths">専門性と強み</Label>
                  <Textarea 
                    id="strengths" 
                    placeholder="療養ケアの専門知識、リーダーシップ、後輩指導力など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="development-needs">更なる成長課題</Label>
                  <Textarea 
                    id="development-needs" 
                    placeholder="管理能力の向上、新しいケア手法の習得、組織運営への参画など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="next-goals">次期目標</Label>
                  <Textarea 
                    id="next-goals" 
                    placeholder="リーダー職への挑戦、専門分野の確立、教育プログラムの開発など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="recommended-training">推奨研修・資格</Label>
                  <Textarea 
                    id="recommended-training" 
                    placeholder="介護福祉士資格、認知症ケア専門士、リーダー研修など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="career-path">今後のキャリアパス</Label>
                  <Textarea 
                    id="career-path" 
                    placeholder="リーダー昇格の可能性、専門分野での活躍、教育担当など"
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