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

export default function NewCareAssistantEvaluationV3() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            老健 新人介護士（1年目） 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            入所・通所サービス両部門対応 基礎習得期評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              介護の基本技術習得と職場適応、介護福祉士からの指導への姿勢を重点評価します
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
                  <Label htmlFor="eval-period">評価時期</Label>
                  <Input type="text" id="eval-period" placeholder="入職3ヶ月 / 6ヶ月 / 12ヶ月" />
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
                    <Label htmlFor="mentor">指導担当介護福祉士</Label>
                    <Input type="text" id="mentor" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（指導担当者）</Label>
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
                  チーム内での協調性と職場適応を中心に評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 職場適応と協調性</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="adapt-s" />
                        <Label htmlFor="adapt-s" className="font-normal">
                          <span className="font-semibold">S：</span> 職場に完全に適応し、積極的にチームに貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="adapt-a" />
                        <Label htmlFor="adapt-a" className="font-normal">
                          <span className="font-semibold">A：</span> 良好な人間関係を築き、チームワークを大切にする
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="adapt-b" />
                        <Label htmlFor="adapt-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本的な職場適応ができている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="adapt-c" />
                        <Label htmlFor="adapt-c" className="font-normal">
                          <span className="font-semibold">C：</span> 適応に時間を要し、サポートが必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="adapt-d" />
                        <Label htmlFor="adapt-d" className="font-normal">
                          <span className="font-semibold">D：</span> 職場適応に大きな課題がある
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 介護福祉士からの指導への姿勢</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="guidance-s" />
                        <Label htmlFor="guidance-s" className="font-normal">
                          <span className="font-semibold">S：</span> 積極的に指導を求め、学んだことを即座に実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="guidance-a" />
                        <Label htmlFor="guidance-a" className="font-normal">
                          <span className="font-semibold">A：</span> 素直に指導を受け入れ、確実に習得している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="guidance-b" />
                        <Label htmlFor="guidance-b" className="font-normal">
                          <span className="font-semibold">B：</span> 指導を受け入れ、基本的な習得ができている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="guidance-c" />
                        <Label htmlFor="guidance-c" className="font-normal">
                          <span className="font-semibold">C：</span> 指導の受け入れに消極的で、習得が遅い
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="guidance-d" />
                        <Label htmlFor="guidance-d" className="font-normal">
                          <span className="font-semibold">D：</span> 指導を拒む傾向があり、成長が見られない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 在宅復帰支援への理解・関心</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="discharge-s" />
                        <Label htmlFor="discharge-s" className="font-normal">
                          <span className="font-semibold">S：</span> 老健の目的を深く理解し、自立支援を意識したケアを実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="discharge-a" />
                        <Label htmlFor="discharge-a" className="font-normal">
                          <span className="font-semibold">A：</span> 在宅復帰支援に関心を持ち、積極的に学習
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="discharge-b" />
                        <Label htmlFor="discharge-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本的な在宅復帰支援の概念を理解
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="discharge-c" />
                        <Label htmlFor="discharge-c" className="font-normal">
                          <span className="font-semibold">C：</span> 在宅復帰支援への理解・関心が不足
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="discharge-d" />
                        <Label htmlFor="discharge-d" className="font-normal">
                          <span className="font-semibold">D：</span> 老健の理念を理解していない
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
                  <Label htmlFor="facility-comment">具体的な適応状況・評価コメント</Label>
                  <Textarea
                    id="facility-comment"
                    placeholder="職場での協調性、指導への姿勢、チームへの貢献など"
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
                  基本的介護技術の習得と生活支援能力を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 基本的介護技術の習得</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="basic-s" />
                        <Label htmlFor="basic-s" className="font-normal">
                          <span className="font-semibold">S：</span> 予定より早く基本技術を習得し、応用も始めている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="basic-a" />
                        <Label htmlFor="basic-a" className="font-normal">
                          <span className="font-semibold">A：</span> 基本技術を確実に習得し、安全に実施できる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="basic-b" />
                        <Label htmlFor="basic-b" className="font-normal">
                          <span className="font-semibold">B：</span> 計画通りに基本技術を習得している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="basic-c" />
                        <Label htmlFor="basic-c" className="font-normal">
                          <span className="font-semibold">C：</span> 技術習得が遅れており、継続的な指導が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="basic-d" />
                        <Label htmlFor="basic-d" className="font-normal">
                          <span className="font-semibold">D：</span> 基本技術の習得が困難で、安全性に課題
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 利用者とのコミュニケーション</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="comm-s" />
                        <Label htmlFor="comm-s" className="font-normal">
                          <span className="font-semibold">S：</span> 利用者の気持ちを深く理解し、個別性に応じた関わりができる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="comm-a" />
                        <Label htmlFor="comm-a" className="font-normal">
                          <span className="font-semibold">A：</span> 利用者と良好な関係を築き、丁寧な対応ができる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="comm-b" />
                        <Label htmlFor="comm-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本的なコミュニケーションが取れている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="comm-c" />
                        <Label htmlFor="comm-c" className="font-normal">
                          <span className="font-semibold">C：</span> コミュニケーションに不安があり、改善が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="comm-d" />
                        <Label htmlFor="comm-d" className="font-normal">
                          <span className="font-semibold">D：</span> 利用者との関係構築が困難
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 観察・記録・報告の基本</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="record-s" />
                        <Label htmlFor="record-s" className="font-normal">
                          <span className="font-semibold">S：</span> 的確な観察で重要な変化を見逃さず、適切に記録・報告
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="record-a" />
                        <Label htmlFor="record-a" className="font-normal">
                          <span className="font-semibold">A：</span> 観察力があり、必要な情報を正確に記録・報告
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="record-b" />
                        <Label htmlFor="record-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本的な観察・記録・報告ができている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="record-c" />
                        <Label htmlFor="record-c" className="font-normal">
                          <span className="font-semibold">C：</span> 観察・記録が不十分で、見落としがある
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="record-d" />
                        <Label htmlFor="record-d" className="font-normal">
                          <span className="font-semibold">D：</span> 観察・記録・報告に大きな課題
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
                  <Label htmlFor="corporate-comment">技術習得の具体例・評価コメント</Label>
                  <Textarea
                    id="corporate-comment"
                    placeholder="優れた実践例、利用者・家族からの評価、技術習得の進捗など"
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
                    <p className="text-sm text-gray-600">職場適応・協調性</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">法人内評価</h4>
                    <p className="text-2xl font-bold text-green-600">B</p>
                    <p className="text-sm text-gray-600">基本技術・コミュニケーション</p>
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
                  <h4 className="font-semibold mb-3">成長タイプ</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="rapid" id="type-rapid" />
                        <Label htmlFor="type-rapid" className="font-normal">
                          急成長型（両軸でA以上、期待を上回る成長）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="steady" id="type-steady" />
                        <Label htmlFor="type-steady" className="font-normal">
                          着実型（両軸でB、順調な成長）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="technical" id="type-technical" />
                        <Label htmlFor="type-technical" className="font-normal">
                          技術重視型（法人評価が高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="social" id="type-social" />
                        <Label htmlFor="type-social" className="font-normal">
                          人間関係重視型（施設評価が高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="support" id="type-support" />
                        <Label htmlFor="type-support" className="font-normal">
                          継続支援型（さらなる指導・サポートが必要）
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="overall-assessment">総合所見</Label>
                  <Textarea
                    id="overall-assessment"
                    placeholder="新人介護士としての成長度、強み、今後の可能性など"
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
                    placeholder="コミュニケーション力、学習意欲、利用者への接し方など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="growth-areas">今後の成長課題</Label>
                  <Textarea
                    id="growth-areas"
                    placeholder="技術面での課題、観察力の向上、記録の充実など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="next-goals">次期（3ヶ月後）の目標</Label>
                  <Textarea
                    id="next-goals"
                    placeholder="・基本介護技術の自立実施\n・利用者との信頼関係構築\n・在宅復帰支援の基本理解"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="support-plan">必要なサポート・教育計画</Label>
                  <Textarea
                    id="support-plan"
                    placeholder="・介護福祉士による継続指導\n・基礎研修の受講\n・他部門見学実習"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="career-development">将来のキャリア発展</Label>
                  <Textarea
                    id="career-development"
                    placeholder="介護福祉士資格取得への支援、専門分野への興味など"
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