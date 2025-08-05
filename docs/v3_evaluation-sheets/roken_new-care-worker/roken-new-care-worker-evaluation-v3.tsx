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

export default function NewCareWorkerEvaluationV3() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            老健 新人介護福祉士（1年目） 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            入所・通所サービス両部門対応 生活支援専門職評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              介護老人保健施設の理念「在宅復帰・在宅支援」を踏まえ、生活支援の専門性と多職種連携能力を評価します
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
                    <Label htmlFor="preceptor">指導担当者</Label>
                    <Input type="text" id="preceptor" />
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
                    <Label htmlFor="evaluator2">2次評価者（介護主任・管理者）</Label>
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
                  老健のチーム貢献・在宅復帰支援への関わりを中心に評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 多職種連携とチームケア</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="team-s" />
                        <Label htmlFor="team-s" className="font-normal">
                          <span className="font-semibold">S：</span> 医師・看護師・リハビリ職と積極的に連携し、ケアの質向上に大きく貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="team-a" />
                        <Label htmlFor="team-a" className="font-normal">
                          <span className="font-semibold">A：</span> 多職種との情報共有を適切に行い、チームケアに貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="team-b" />
                        <Label htmlFor="team-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本的な連携・報告を行い、チームの一員として機能
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="team-c" />
                        <Label htmlFor="team-c" className="font-normal">
                          <span className="font-semibold">C：</span> 連携に消極的で、情報共有が不十分
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="team-d" />
                        <Label htmlFor="team-d" className="font-normal">
                          <span className="font-semibold">D：</span> 多職種連携に課題があり、チームケアに支障
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 在宅復帰・在宅支援への貢献</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="home-s" />
                        <Label htmlFor="home-s" className="font-normal">
                          <span className="font-semibold">S：</span> 利用者の在宅復帰を常に意識し、自立支援に向けた創意工夫を実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="home-a" />
                        <Label htmlFor="home-a" className="font-normal">
                          <span className="font-semibold">A：</span> 在宅復帰を目標にケアを実践し、機能維持・向上に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="home-b" />
                        <Label htmlFor="home-b" className="font-normal">
                          <span className="font-semibold">B：</span> 指導を受けながら在宅復帰支援のケアを実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="home-c" />
                        <Label htmlFor="home-c" className="font-normal">
                          <span className="font-semibold">C：</span> 在宅復帰の視点が不足し、日常ケアに終始
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="home-d" />
                        <Label htmlFor="home-d" className="font-normal">
                          <span className="font-semibold">D：</span> 在宅復帰支援の理解が不足し、改善が必要
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 部門間連携・協力姿勢</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="dept-s" />
                        <Label htmlFor="dept-s" className="font-normal">
                          <span className="font-semibold">S：</span> 入所・通所両部門の業務を理解し、柔軟に協力・支援
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="dept-a" />
                        <Label htmlFor="dept-a" className="font-normal">
                          <span className="font-semibold">A：</span> 所属部門を超えて積極的に協力し、施設全体に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="dept-b" />
                        <Label htmlFor="dept-b" className="font-normal">
                          <span className="font-semibold">B：</span> 求められれば他部門への協力を行う
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="dept-c" />
                        <Label htmlFor="dept-c" className="font-normal">
                          <span className="font-semibold">C：</span> 自部門の業務に限定的で、協力姿勢が不足
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="dept-d" />
                        <Label htmlFor="dept-d" className="font-normal">
                          <span className="font-semibold">D：</span> 部門間協力に消極的で、施設運営に支障
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
                    placeholder="多職種連携の具体例、在宅復帰支援への取り組み、部門間協力の事例など"
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
                  介護福祉士としての専門性と生活支援能力を中心に評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 基本的介護技術と自立支援</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="skill-s" />
                        <Label htmlFor="skill-s" className="font-normal">
                          <span className="font-semibold">S：</span> 利用者の残存機能を最大限活かした自立支援を実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="skill-a" />
                        <Label htmlFor="skill-a" className="font-normal">
                          <span className="font-semibold">A：</span> 個別性を考慮した適切な介護技術を安全に実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="skill-b" />
                        <Label htmlFor="skill-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本的な介護技術を習得し、指導下で実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="skill-c" />
                        <Label htmlFor="skill-c" className="font-normal">
                          <span className="font-semibold">C：</span> 技術習得に時間を要し、継続的な指導が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="skill-d" />
                        <Label htmlFor="skill-d" className="font-normal">
                          <span className="font-semibold">D：</span> 基本技術の習得が不十分で、安全性に課題
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. アセスメント能力と記録</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="assess-s" />
                        <Label htmlFor="assess-s" className="font-normal">
                          <span className="font-semibold">S：</span> 利用者の状態変化を的確に把握し、専門的視点で記録・報告
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="assess-a" />
                        <Label htmlFor="assess-a" className="font-normal">
                          <span className="font-semibold">A：</span> 観察力があり、重要な情報を適切に記録・共有
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="assess-b" />
                        <Label htmlFor="assess-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本的な観察・記録を行い、必要な報告ができる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="assess-c" />
                        <Label htmlFor="assess-c" className="font-normal">
                          <span className="font-semibold">C：</span> 観察・記録が不十分で、重要情報の見落としがある
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="assess-d" />
                        <Label htmlFor="assess-d" className="font-normal">
                          <span className="font-semibold">D：</span> アセスメント能力が不足し、記録の質に課題
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 認知症ケア・個別ケアの実践</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="dementia-s" />
                        <Label htmlFor="dementia-s" className="font-normal">
                          <span className="font-semibold">S：</span> 認知症の理解が深く、個々の特性に応じた創造的なケアを実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="dementia-a" />
                        <Label htmlFor="dementia-a" className="font-normal">
                          <span className="font-semibold">A：</span> 認知症ケアの基本を理解し、個別性を重視したケアを提供
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="dementia-b" />
                        <Label htmlFor="dementia-b" className="font-normal">
                          <span className="font-semibold">B：</span> 指導を受けながら認知症ケアを学び、実践している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="dementia-c" />
                        <Label htmlFor="dementia-c" className="font-normal">
                          <span className="font-semibold">C：</span> 認知症ケアの理解が不足し、画一的な対応になりがち
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="dementia-d" />
                        <Label htmlFor="dementia-d" className="font-normal">
                          <span className="font-semibold">D：</span> 認知症ケアに課題があり、利用者との関係構築が困難
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
                  <Label htmlFor="corporate-comment">専門性の発揮事例・評価コメント</Label>
                  <Textarea
                    id="corporate-comment"
                    placeholder="優れた介護実践例、利用者・家族からの評価、専門知識の活用など"
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
                    <p className="text-sm text-gray-600">多職種連携・在宅復帰支援</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">法人内評価</h4>
                    <p className="text-2xl font-bold text-green-600">B</p>
                    <p className="text-sm text-gray-600">介護専門性・生活支援</p>
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
                        <RadioGroupItem value="future-leader" id="type-leader" />
                        <Label htmlFor="type-leader" className="font-normal">
                          将来のリーダー候補型（両軸でA以上）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="steady" id="type-steady" />
                        <Label htmlFor="type-steady" className="font-normal">
                          着実成長型（両軸でB）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="specialist" id="type-specialist" />
                        <Label htmlFor="type-specialist" className="font-normal">
                          専門性重視型（法人評価が高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="team-focused" id="type-team" />
                        <Label htmlFor="type-team" className="font-normal">
                          チーム貢献型（施設評価が高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="support-needed" id="type-support" />
                        <Label htmlFor="type-support" className="font-normal">
                          継続支援必要型（両軸でC以下）
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="overall-assessment">総合所見</Label>
                  <Textarea
                    id="overall-assessment"
                    placeholder="新人介護福祉士としての成長度、強み、老健での適性など"
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
                    placeholder="多職種連携への積極性、利用者との関係構築、学習意欲など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="growth-areas">今後の成長課題</Label>
                  <Textarea
                    id="growth-areas"
                    placeholder="在宅復帰支援の視点強化、認知症ケアの深化、記録の充実など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="next-goals">次期（3ヶ月後）の目標</Label>
                  <Textarea
                    id="next-goals"
                    placeholder="・基本介護技術の自立実施\n・担当利用者のケアプラン理解\n・多職種カンファレンスへの参加"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="support-plan">必要なサポート・教育計画</Label>
                  <Textarea
                    id="support-plan"
                    placeholder="・認知症ケア研修の受講\n・在宅復帰支援の事例検討参加\n・リハビリ見学実習"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="career-vision">2年目に向けての展望</Label>
                  <Textarea
                    id="career-vision"
                    placeholder="期待される成長、専門性の深化、役割の拡大など"
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