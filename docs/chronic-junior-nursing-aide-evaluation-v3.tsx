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
import { HandHeart } from 'lucide-react';

export default function ChronicJuniorNursingAideEvaluationV3() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            慢性期医療 2・3年目看護補助者 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            療養ケアの実践力向上と自立した業務遂行を評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <HandHeart className="h-4 w-4" />
            <AlertDescription>
              療養生活支援の確実な実践と、新人指導への参加を重視した評価を行います
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
                    <Input type="text" id="experience" placeholder="2年3ヶ月" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（主任・リーダー）</Label>
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
                  療養チームでの役割拡大と貢献度を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 自立した業務遂行と効率性</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="autonomy-s" />
                        <Label htmlFor="autonomy-s" className="font-normal">
                          <span className="font-semibold">S：</span> 完全に自立し、効率的な業務で他の模範となっている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="autonomy-a" />
                        <Label htmlFor="autonomy-a" className="font-normal">
                          <span className="font-semibold">A：</span> 指導なしで業務を遂行し、時間管理も優秀
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="autonomy-b" />
                        <Label htmlFor="autonomy-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本的に自立し、標準的な効率で業務遂行
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="autonomy-c" />
                        <Label htmlFor="autonomy-c" className="font-normal">
                          <span className="font-semibold">C：</span> まだ指導を要する場面があり、効率に課題
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="autonomy-d" />
                        <Label htmlFor="autonomy-d" className="font-normal">
                          <span className="font-semibold">D：</span> 自立が不十分で、継続的な支援が必要
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 新人指導への参加と協力</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="mentoring-s" />
                        <Label htmlFor="mentoring-s" className="font-normal">
                          <span className="font-semibold">S：</span> 積極的に新人指導に参加し、優れた指導力を発揮
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="mentoring-a" />
                        <Label htmlFor="mentoring-a" className="font-normal">
                          <span className="font-semibold">A：</span> 新人の良き相談相手となり、成長を支援
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="mentoring-b" />
                        <Label htmlFor="mentoring-b" className="font-normal">
                          <span className="font-semibold">B：</span> 求められれば適切に新人をサポート
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="mentoring-c" />
                        <Label htmlFor="mentoring-c" className="font-normal">
                          <span className="font-semibold">C：</span> 新人指導への関与が消極的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="mentoring-d" />
                        <Label htmlFor="mentoring-d" className="font-normal">
                          <span className="font-semibold">D：</span> 新人指導への協力が不足
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 療養活動の企画と実施</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="activities-s" />
                        <Label htmlFor="activities-s" className="font-normal">
                          <span className="font-semibold">S：</span> 独創的なレクリエーションを企画し、患者のQOLを大幅に向上
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="activities-a" />
                        <Label htmlFor="activities-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的に活動を提案・実施し、患者から高評価
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="activities-b" />
                        <Label htmlFor="activities-b" className="font-normal">
                          <span className="font-semibold">B：</span> 計画された活動を適切に実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="activities-c" />
                        <Label htmlFor="activities-c" className="font-normal">
                          <span className="font-semibold">C：</span> 活動への参加は受動的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="activities-d" />
                        <Label htmlFor="activities-d" className="font-normal">
                          <span className="font-semibold">D：</span> 療養活動への関与が不足
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
                    placeholder="自立した業務遂行の例、新人指導での成果、療養活動での工夫など"
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
                  療養ケアの実践力と専門性の向上を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 療養生活援助の実践力</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="practice-s" />
                        <Label htmlFor="practice-s" className="font-normal">
                          <span className="font-semibold">S：</span> 高度な援助技術で、患者の個別ニーズに完璧に対応
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="practice-a" />
                        <Label htmlFor="practice-a" className="font-normal">
                          <span className="font-semibold">A：</span> 確実で丁寧な援助により、患者の安楽を実現
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="practice-b" />
                        <Label htmlFor="practice-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的な援助技術を安全に実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="practice-c" />
                        <Label htmlFor="practice-c" className="font-normal">
                          <span className="font-semibold">C：</span> 援助技術に改善の余地がある
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="practice-d" />
                        <Label htmlFor="practice-d" className="font-normal">
                          <span className="font-semibold">D：</span> 基本的な援助に課題があり、指導が必要
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 認知症・重度要介護者への対応</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="dementia-s" />
                        <Label htmlFor="dementia-s" className="font-normal">
                          <span className="font-semibold">S：</span> 専門的知識を活用し、困難事例にも適切に対応
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="dementia-a" />
                        <Label htmlFor="dementia-a" className="font-normal">
                          <span className="font-semibold">A：</span> 認知症の特性を理解し、個別性のある関わりを実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="dementia-b" />
                        <Label htmlFor="dementia-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本的な対応方法を身につけている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="dementia-c" />
                        <Label htmlFor="dementia-c" className="font-normal">
                          <span className="font-semibold">C：</span> 対応に戸惑うことがある
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="dementia-d" />
                        <Label htmlFor="dementia-d" className="font-normal">
                          <span className="font-semibold">D：</span> 適切な対応ができず、支援が必要
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 観察力と報告・連絡・相談</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="observation-s" />
                        <Label htmlFor="observation-s" className="font-normal">
                          <span className="font-semibold">S：</span> 鋭い観察力で異常を早期発見し、的確に報告
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="observation-a" />
                        <Label htmlFor="observation-a" className="font-normal">
                          <span className="font-semibold">A：</span> 細やかな観察と適切なタイミングでの報告を実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="observation-b" />
                        <Label htmlFor="observation-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本的な観察と報告ができる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="observation-c" />
                        <Label htmlFor="observation-c" className="font-normal">
                          <span className="font-semibold">C：</span> 観察や報告に漏れがある
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="observation-d" />
                        <Label htmlFor="observation-d" className="font-normal">
                          <span className="font-semibold">D：</span> 観察・報告が不十分で改善が必要
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
                    placeholder="優れた援助技術の例、認知症対応での成果、観察・報告の的確さなど"
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
                    <p className="text-sm text-gray-600">自立性・指導力</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">法人内評価</h4>
                    <p className="text-2xl font-bold text-green-600">B</p>
                    <p className="text-sm text-gray-600">実践力・専門性</p>
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
                        <RadioGroupItem value="leader-track" id="type-leader" />
                        <Label htmlFor="type-leader" className="font-normal">
                          リーダー候補型（両軸でA以上）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="balanced" id="type-balanced" />
                        <Label htmlFor="type-balanced" className="font-normal">
                          バランス成長型（両軸でB）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="specialist" id="type-specialist" />
                        <Label htmlFor="type-specialist" className="font-normal">
                          ケア専門型（法人評価が高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="team-player" id="type-team" />
                        <Label htmlFor="type-team" className="font-normal">
                          チーム貢献型（施設評価が高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="developing" id="type-developing" />
                        <Label htmlFor="type-developing" className="font-normal">
                          成長途上型（更なる向上が必要）
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
                  <Label htmlFor="strengths">強みと優れている点</Label>
                  <Textarea 
                    id="strengths" 
                    placeholder="確実な援助技術、患者への温かい関わり、チームワークなど"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="growth-areas">今後の成長課題</Label>
                  <Textarea 
                    id="growth-areas" 
                    placeholder="専門知識の深化、リーダーシップの発揮、新人指導力など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="next-goals">次期の目標</Label>
                  <Textarea 
                    id="next-goals" 
                    placeholder="認知症ケアの専門性向上、療養活動の企画力強化、後輩指導の充実など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="training-plan">推奨する研修・教育</Label>
                  <Textarea 
                    id="training-plan" 
                    placeholder="認知症ケア研修、リーダーシップ研修、介護技術向上研修など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="career-path">中堅職員への展望</Label>
                  <Textarea 
                    id="career-path" 
                    placeholder="4年目以降の役割、専門分野の確立、リーダーとしての活躍など"
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