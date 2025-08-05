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

export default function ChronicJuniorNurseEvaluationV3() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            【慢性期医療】2・3年目看護師 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            慢性期ケアの深化と後輩指導を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              2・3年目看護師は慢性期ケアの実践能力向上と後輩指導への関わりを評価します
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
                    <Label htmlFor="department">配属病棟</Label>
                    <Input type="text" id="department" />
                  </div>
                  <div>
                    <Label htmlFor="mentor-count">指導した新人数</Label>
                    <Input type="number" id="mentor-count" placeholder="0" />
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
                  慢性期病棟での実践能力と後輩指導を中心に評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 慢性期チーム内での役割遂行</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="role-s" />
                        <Label htmlFor="role-s" className="font-normal">
                          <span className="font-semibold">S：</span> 療養チームの中心として、病棟運営に大きく貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="role-a" />
                        <Label htmlFor="role-a" className="font-normal">
                          <span className="font-semibold">A：</span> 期待以上の役割を果たし、チームに貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="role-b" />
                        <Label htmlFor="role-b" className="font-normal">
                          <span className="font-semibold">B：</span> 与えられた役割を確実に遂行
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="role-c" />
                        <Label htmlFor="role-c" className="font-normal">
                          <span className="font-semibold">C：</span> 役割遂行に支援が必要な場面がある
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="role-d" />
                        <Label htmlFor="role-d" className="font-normal">
                          <span className="font-semibold">D：</span> 役割遂行が不十分で、改善が必要
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 後輩指導・慢性期ケアの伝承</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="mentor-s" />
                        <Label htmlFor="mentor-s" className="font-normal">
                          <span className="font-semibold">S：</span> 効果的な指導で後輩の慢性期ケア理解を深める
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="mentor-a" />
                        <Label htmlFor="mentor-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的に後輩指導に関わり、良い影響を与える
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="mentor-b" />
                        <Label htmlFor="mentor-b" className="font-normal">
                          <span className="font-semibold">B：</span> 求められれば適切な指導ができる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="mentor-c" />
                        <Label htmlFor="mentor-c" className="font-normal">
                          <span className="font-semibold">C：</span> 後輩指導に消極的または不慣れ
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="mentor-d" />
                        <Label htmlFor="mentor-d" className="font-normal">
                          <span className="font-semibold">D：</span> 後輩指導を避ける傾向がある
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 療養環境改善への参画</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="improve-s" />
                        <Label htmlFor="improve-s" className="font-normal">
                          <span className="font-semibold">S：</span> 主体的に療養環境改善を提案・実行し、成果を上げる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="improve-a" />
                        <Label htmlFor="improve-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的に改善活動に参加し、貢献している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="improve-b" />
                        <Label htmlFor="improve-b" className="font-normal">
                          <span className="font-semibold">B：</span> 改善活動に協力的に参加
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="improve-c" />
                        <Label htmlFor="improve-c" className="font-normal">
                          <span className="font-semibold">C：</span> 改善活動への参加が消極的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="improve-d" />
                        <Label htmlFor="improve-d" className="font-normal">
                          <span className="font-semibold">D：</span> 改善活動に関心がない
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
                    placeholder="病棟での役割遂行、後輩指導の具体例、療養環境改善提案など"
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
                  慢性期看護実践能力の深化と専門性を中心に評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 慢性期看護実践能力の向上</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="practice-s" />
                        <Label htmlFor="practice-s" className="font-normal">
                          <span className="font-semibold">S：</span> 高度な慢性期ケアを実践し、複雑な状況にも対応可能
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="practice-a" />
                        <Label htmlFor="practice-a" className="font-normal">
                          <span className="font-semibold">A：</span> 幅広い実践能力を身につけ、自立して業務遂行
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="practice-b" />
                        <Label htmlFor="practice-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的な実践能力を有し、安全に業務遂行
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="practice-c" />
                        <Label htmlFor="practice-c" className="font-normal">
                          <span className="font-semibold">C：</span> 実践能力に不安定さがあり、時々支援が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="practice-d" />
                        <Label htmlFor="practice-d" className="font-normal">
                          <span className="font-semibold">D：</span> 実践能力が不十分で、継続的な指導が必要
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 認知症ケア・終末期ケアの実践</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="special-s" />
                        <Label htmlFor="special-s" className="font-normal">
                          <span className="font-semibold">S：</span> 専門的な認知症・終末期ケアを実践し、家族支援も優れる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="special-a" />
                        <Label htmlFor="special-a" className="font-normal">
                          <span className="font-semibold">A：</span> 個別性を考慮した適切なケアを実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="special-b" />
                        <Label htmlFor="special-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的なケアを安全に提供
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="special-c" />
                        <Label htmlFor="special-c" className="font-normal">
                          <span className="font-semibold">C：</span> ケアに課題があり、時々問題が生じる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="special-d" />
                        <Label htmlFor="special-d" className="font-normal">
                          <span className="font-semibold">D：</span> 専門的ケアの理解・実践が不十分
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 生活リハビリ・レクリエーション</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="rehab-s" />
                        <Label htmlFor="rehab-s" className="font-normal">
                          <span className="font-semibold">S：</span> 創造的な生活リハビリを企画・実施し、QOL向上に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="rehab-a" />
                        <Label htmlFor="rehab-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的にリハビリ・レクを企画し、患者の意欲を引き出す
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="rehab-b" />
                        <Label htmlFor="rehab-b" className="font-normal">
                          <span className="font-semibold">B：</span> 計画に沿ってリハビリ・レクを実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="rehab-c" />
                        <Label htmlFor="rehab-c" className="font-normal">
                          <span className="font-semibold">C：</span> リハビリ・レクへの関わりが消極的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="rehab-d" />
                        <Label htmlFor="rehab-d" className="font-normal">
                          <span className="font-semibold">D：</span> 生活支援の視点が不足している
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
                    placeholder="優れた慢性期ケア実践例、認知症ケアの工夫、生活リハビリの成果など"
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
                    <p className="text-sm text-gray-600">チーム貢献・後輩指導</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">法人内評価</h4>
                    <p className="text-2xl font-bold text-green-600">B</p>
                    <p className="text-sm text-gray-600">慢性期実践能力・専門性</p>
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
                        <RadioGroupItem value="leader-candidate" id="type-leader" />
                        <Label htmlFor="type-leader" className="font-normal">
                          リーダー候補型（両軸でA以上）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="steady-growth" id="type-steady" />
                        <Label htmlFor="type-steady" className="font-normal">
                          着実成長型（両軸でB）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="practice-specialist" id="type-practice" />
                        <Label htmlFor="type-practice" className="font-normal">
                          実践スペシャリスト型（法人評価が高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="team-builder" id="type-team" />
                        <Label htmlFor="type-team" className="font-normal">
                          チームビルダー型（施設評価が高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="development-needed" id="type-develop" />
                        <Label htmlFor="type-develop" className="font-normal">
                          育成強化必要型（両軸でC以下）
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="overall-assessment">総合所見</Label>
                  <Textarea 
                    id="overall-assessment" 
                    placeholder="2・3年目として慢性期ケアの成長度、強み、今後の可能性など"
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
                    placeholder="慢性期ケアの実践力、認知症ケア、生活支援の視点など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="growth-areas">今後の成長課題</Label>
                  <Textarea 
                    id="growth-areas" 
                    placeholder="リーダーシップ、終末期ケアの深化、家族支援力など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="next-goals">次期（6ヶ月後）の目標</Label>
                  <Textarea 
                    id="next-goals" 
                    placeholder="認知症ケア専門性向上、レクリエーション企画力、指導力向上など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="support-plan">必要なサポート・教育計画</Label>
                  <Textarea 
                    id="support-plan" 
                    placeholder="認知症ケア専門研修、終末期ケア研修、リーダーシップ研修など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="career-vision">中堅看護師に向けての展望</Label>
                  <Textarea 
                    id="career-vision" 
                    placeholder="慢性期ケアのスペシャリスト、認知症ケアのエキスパートなど"
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