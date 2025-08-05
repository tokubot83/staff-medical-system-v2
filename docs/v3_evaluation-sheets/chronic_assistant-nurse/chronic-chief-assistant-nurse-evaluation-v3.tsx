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
import { Users } from 'lucide-react';

export default function ChronicChiefAssistantNurseEvaluationV3() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            慢性期医療 准看護師主任 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            療養現場の管理運営と准看護スタッフの統括・育成を評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Users className="h-4 w-4" />
            <AlertDescription>
              慢性期医療における准看護師主任として、チーム管理と療養ケアの質向上への貢献を重視します
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
                    <Label htmlFor="team-size">管理スタッフ数</Label>
                    <Input type="text" id="team-size" placeholder="准看護師5名、看護補助者10名" />
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
                  慢性期医療現場での管理能力と組織貢献を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 療養チームの管理・運営</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="management-s" />
                        <Label htmlFor="management-s" className="font-normal">
                          <span className="font-semibold">S：</span> 卓越した管理能力で、療養チームの生産性とケア品質を大幅に向上
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="management-a" />
                        <Label htmlFor="management-a" className="font-normal">
                          <span className="font-semibold">A：</span> 効果的なチーム運営により、高い成果を継続的に達成
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="management-b" />
                        <Label htmlFor="management-b" className="font-normal">
                          <span className="font-semibold">B：</span> 主任として期待される管理業務を適切に遂行
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="management-c" />
                        <Label htmlFor="management-c" className="font-normal">
                          <span className="font-semibold">C：</span> 管理業務に課題があり、改善が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="management-d" />
                        <Label htmlFor="management-d" className="font-normal">
                          <span className="font-semibold">D：</span> チーム運営に支障があり、抜本的な改善が必要
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 准看護スタッフの育成・指導</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="development-s" />
                        <Label htmlFor="development-s" className="font-normal">
                          <span className="font-semibold">S：</span> 革新的な育成プログラムで、スタッフの能力を飛躍的に向上
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="development-a" />
                        <Label htmlFor="development-a" className="font-normal">
                          <span className="font-semibold">A：</span> 体系的な指導により、スタッフの成長と定着に大きく貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="development-b" />
                        <Label htmlFor="development-b" className="font-normal">
                          <span className="font-semibold">B：</span> 必要な指導・育成を適切に実施している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="development-c" />
                        <Label htmlFor="development-c" className="font-normal">
                          <span className="font-semibold">C：</span> 育成への取り組みが不十分
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="development-d" />
                        <Label htmlFor="development-d" className="font-normal">
                          <span className="font-semibold">D：</span> スタッフ育成が機能していない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 病棟運営への貢献と連携</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="contribution-s" />
                        <Label htmlFor="contribution-s" className="font-normal">
                          <span className="font-semibold">S：</span> 療養病棟の運営改善を主導し、組織全体に波及効果を創出
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="contribution-a" />
                        <Label htmlFor="contribution-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的な提案と実行で、病棟運営の効率化に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="contribution-b" />
                        <Label htmlFor="contribution-b" className="font-normal">
                          <span className="font-semibold">B：</span> 看護師長との適切な連携により病棟運営に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="contribution-c" />
                        <Label htmlFor="contribution-c" className="font-normal">
                          <span className="font-semibold">C：</span> 病棟運営への関与が限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="contribution-d" />
                        <Label htmlFor="contribution-d" className="font-normal">
                          <span className="font-semibold">D：</span> 連携不足により運営に支障
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
                  <Label htmlFor="facility-comment">管理実績・評価コメント</Label>
                  <Textarea 
                    id="facility-comment" 
                    placeholder="チーム管理の成果、スタッフ育成の実績、病棟運営への貢献など"
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
                  慢性期医療における管理能力と専門性を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 療養ケアの品質管理</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="quality-s" />
                        <Label htmlFor="quality-s" className="font-normal">
                          <span className="font-semibold">S：</span> 独自の品質管理システムを構築し、ケア水準を大幅に向上
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="quality-a" />
                        <Label htmlFor="quality-a" className="font-normal">
                          <span className="font-semibold">A：</span> 効果的な品質管理により、高水準の療養ケアを維持
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="quality-b" />
                        <Label htmlFor="quality-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的な品質管理を適切に実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="quality-c" />
                        <Label htmlFor="quality-c" className="font-normal">
                          <span className="font-semibold">C：</span> 品質管理に改善の余地がある
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="quality-d" />
                        <Label htmlFor="quality-d" className="font-normal">
                          <span className="font-semibold">D：</span> 品質管理が不十分でケアに影響
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 慢性期医療の業務改善・効率化</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="improvement-s" />
                        <Label htmlFor="improvement-s" className="font-normal">
                          <span className="font-semibold">S：</span> 画期的な改善により、療養ケアの効率と質を両立
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="improvement-a" />
                        <Label htmlFor="improvement-a" className="font-normal">
                          <span className="font-semibold">A：</span> 継続的な改善活動で、業務効率を大きく向上
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="improvement-b" />
                        <Label htmlFor="improvement-b" className="font-normal">
                          <span className="font-semibold">B：</span> 必要な業務改善を実施している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="improvement-c" />
                        <Label htmlFor="improvement-c" className="font-normal">
                          <span className="font-semibold">C：</span> 改善への取り組みが不足
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="improvement-d" />
                        <Label htmlFor="improvement-d" className="font-normal">
                          <span className="font-semibold">D：</span> 現状維持的で改善が見られない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 療養環境の向上と家族支援</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="environment-s" />
                        <Label htmlFor="environment-s" className="font-normal">
                          <span className="font-semibold">S：</span> 革新的な取り組みで、患者・家族の満足度を飛躍的に向上
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="environment-a" />
                        <Label htmlFor="environment-a" className="font-normal">
                          <span className="font-semibold">A：</span> 療養環境改善と家族支援で高い評価を獲得
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="environment-b" />
                        <Label htmlFor="environment-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的な環境整備と家族対応を実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="environment-c" />
                        <Label htmlFor="environment-c" className="font-normal">
                          <span className="font-semibold">C：</span> 環境改善への取り組みが不十分
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="environment-d" />
                        <Label htmlFor="environment-d" className="font-normal">
                          <span className="font-semibold">D：</span> 療養環境に課題があり改善が急務
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
                  <Label htmlFor="corporate-comment">専門管理能力の具体例・評価コメント</Label>
                  <Textarea 
                    id="corporate-comment" 
                    placeholder="品質管理の成果、業務改善の実績、療養環境向上への取り組みなど"
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
                    <p className="text-sm text-gray-600">管理能力・組織貢献</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">法人内評価</h4>
                    <p className="text-2xl font-bold text-green-600">A</p>
                    <p className="text-sm text-gray-600">専門性・品質管理</p>
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
                        <RadioGroupItem value="executive" id="type-executive" />
                        <Label htmlFor="type-executive" className="font-normal">
                          療養管理エキスパート型（両軸で高評価）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="operations" id="type-operations" />
                        <Label htmlFor="type-operations" className="font-normal">
                          運営重視型（施設評価が特に高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="quality" id="type-quality" />
                        <Label htmlFor="type-quality" className="font-normal">
                          品質管理型（法人評価が特に高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="standard" id="type-standard" />
                        <Label htmlFor="type-standard" className="font-normal">
                          標準管理型（両軸でB評価）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="development" id="type-development" />
                        <Label htmlFor="type-development" className="font-normal">
                          育成必要型（管理能力の向上が必要）
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="overall-assessment">総合所見</Label>
                  <Textarea 
                    id="overall-assessment" 
                    placeholder="慢性期医療における主任としての価値、強み、組織への貢献度など"
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 育成計画タブ */}
            <TabsContent value="development" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">キャリア開発・組織貢献計画</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="strengths">管理職としての強み</Label>
                  <Textarea 
                    id="strengths" 
                    placeholder="チーム管理能力、療養ケアの専門知識、問題解決力など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="challenges">今後の課題・成長領域</Label>
                  <Textarea 
                    id="challenges" 
                    placeholder="より高度な管理スキル、経営視点、組織変革力など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="organizational-goals">組織目標への貢献計画</Label>
                  <Textarea 
                    id="organizational-goals" 
                    placeholder="療養ケアの質向上プロジェクト、スタッフ定着率向上、コスト管理など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="successor-planning">後継者育成計画</Label>
                  <Textarea 
                    id="successor-planning" 
                    placeholder="次期主任候補の育成、管理業務の権限委譲計画など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="career-vision">今後のキャリアビジョン</Label>
                  <Textarea 
                    id="career-vision" 
                    placeholder="看護管理者への道筋、専門分野での更なる活躍など"
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