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
import { Crown } from 'lucide-react';

export default function ChronicLeaderNursingAideEvaluationV3() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            慢性期医療 看護補助者リーダー 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            療養ケアチームの統括と質向上への貢献を評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Crown className="h-4 w-4" />
            <AlertDescription>
              看護補助者チームのリーダーとして、療養ケアの品質管理とスタッフ育成を重視した評価を行います
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
                    <Input type="text" id="team-size" placeholder="看護補助者10名" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（主任・師長）</Label>
                    <Input type="text" id="evaluator1" />
                  </div>
                  <div>
                    <Label htmlFor="evaluator2">2次評価者（看護部長等）</Label>
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
                  チーム管理能力と組織への貢献を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 看護補助者チームの管理・運営</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="team-management-s" />
                        <Label htmlFor="team-management-s" className="font-normal">
                          <span className="font-semibold">S：</span> 卓越した管理能力で、チームの生産性とモチベーションを最大化
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="team-management-a" />
                        <Label htmlFor="team-management-a" className="font-normal">
                          <span className="font-semibold">A：</span> 効果的なチーム運営により、高い成果を継続的に達成
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="team-management-b" />
                        <Label htmlFor="team-management-b" className="font-normal">
                          <span className="font-semibold">B：</span> リーダーとして期待される管理業務を適切に遂行
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="team-management-c" />
                        <Label htmlFor="team-management-c" className="font-normal">
                          <span className="font-semibold">C：</span> 管理業務に課題があり、改善が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="team-management-d" />
                        <Label htmlFor="team-management-d" className="font-normal">
                          <span className="font-semibold">D：</span> チーム運営に支障があり、抜本的な改善が必要
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. スタッフの育成と能力開発</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="staff-development-s" />
                        <Label htmlFor="staff-development-s" className="font-normal">
                          <span className="font-semibold">S：</span> 革新的な育成プログラムで、スタッフ全体のレベルを飛躍的に向上
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="staff-development-a" />
                        <Label htmlFor="staff-development-a" className="font-normal">
                          <span className="font-semibold">A：</span> 体系的な教育・指導により、多くのスタッフを成長させた
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="staff-development-b" />
                        <Label htmlFor="staff-development-b" className="font-normal">
                          <span className="font-semibold">B：</span> 必要な指導・育成を適切に実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="staff-development-c" />
                        <Label htmlFor="staff-development-c" className="font-normal">
                          <span className="font-semibold">C：</span> 育成への取り組みが不十分
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="staff-development-d" />
                        <Label htmlFor="staff-development-d" className="font-normal">
                          <span className="font-semibold">D：</span> スタッフ育成が機能していない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 他職種との連携と病棟運営への貢献</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="collaboration-s" />
                        <Label htmlFor="collaboration-s" className="font-normal">
                          <span className="font-semibold">S：</span> 多職種連携の要として、療養ケア全体の質向上を主導
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="collaboration-a" />
                        <Label htmlFor="collaboration-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的な連携により、円滑な病棟運営に大きく貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="collaboration-b" />
                        <Label htmlFor="collaboration-b" className="font-normal">
                          <span className="font-semibold">B：</span> 看護チームとの適切な連携を維持
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="collaboration-c" />
                        <Label htmlFor="collaboration-c" className="font-normal">
                          <span className="font-semibold">C：</span> 連携への関与が限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="collaboration-d" />
                        <Label htmlFor="collaboration-d" className="font-normal">
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
                    placeholder="チーム管理の成果、スタッフ育成の実績、連携での貢献など"
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
                  療養ケアの品質管理と専門性を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 療養生活援助の品質管理</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="quality-control-s" />
                        <Label htmlFor="quality-control-s" className="font-normal">
                          <span className="font-semibold">S：</span> 独自の品質管理システムを構築し、ケア水準を大幅に向上
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="quality-control-a" />
                        <Label htmlFor="quality-control-a" className="font-normal">
                          <span className="font-semibold">A：</span> 効果的な品質管理により、高水準の療養ケアを維持
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="quality-control-b" />
                        <Label htmlFor="quality-control-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的な品質管理を適切に実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="quality-control-c" />
                        <Label htmlFor="quality-control-c" className="font-normal">
                          <span className="font-semibold">C：</span> 品質管理に改善の余地がある
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="quality-control-d" />
                        <Label htmlFor="quality-control-d" className="font-normal">
                          <span className="font-semibold">D：</span> 品質管理が不十分でケアに影響
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 療養環境の改善と効率化</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="environment-improvement-s" />
                        <Label htmlFor="environment-improvement-s" className="font-normal">
                          <span className="font-semibold">S：</span> 画期的な改善により、療養環境と業務効率を両立
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="environment-improvement-a" />
                        <Label htmlFor="environment-improvement-a" className="font-normal">
                          <span className="font-semibold">A：</span> 継続的な改善活動で、環境と効率を大きく向上
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="environment-improvement-b" />
                        <Label htmlFor="environment-improvement-b" className="font-normal">
                          <span className="font-semibold">B：</span> 必要な改善活動を実施している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="environment-improvement-c" />
                        <Label htmlFor="environment-improvement-c" className="font-normal">
                          <span className="font-semibold">C：</span> 改善への取り組みが不足
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="environment-improvement-d" />
                        <Label htmlFor="environment-improvement-d" className="font-normal">
                          <span className="font-semibold">D：</span> 現状維持的で改善が見られない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 患者満足度とQOL向上への貢献</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="satisfaction-s" />
                        <Label htmlFor="satisfaction-s" className="font-normal">
                          <span className="font-semibold">S：</span> 革新的な取り組みで、患者満足度を飛躍的に向上
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="satisfaction-a" />
                        <Label htmlFor="satisfaction-a" className="font-normal">
                          <span className="font-semibold">A：</span> QOL向上活動を主導し、高い評価を獲得
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="satisfaction-b" />
                        <Label htmlFor="satisfaction-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的な満足度向上活動を実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="satisfaction-c" />
                        <Label htmlFor="satisfaction-c" className="font-normal">
                          <span className="font-semibold">C：</span> 満足度向上への取り組みが不十分
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="satisfaction-d" />
                        <Label htmlFor="satisfaction-d" className="font-normal">
                          <span className="font-semibold">D：</span> 患者満足度に課題があり改善が急務
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
                  <Label htmlFor="corporate-comment">品質管理能力の具体例・評価コメント</Label>
                  <Textarea 
                    id="corporate-comment" 
                    placeholder="品質管理の成果、環境改善の実績、患者満足度向上への貢献など"
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
                    <p className="text-sm text-gray-600">品質管理・専門性</p>
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
                        <RadioGroupItem value="executive-leader" id="type-executive" />
                        <Label htmlFor="type-executive" className="font-normal">
                          エグゼクティブリーダー型（両軸で高評価）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="management-focused" id="type-management" />
                        <Label htmlFor="type-management" className="font-normal">
                          マネジメント重視型（施設評価が特に高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="quality-focused" id="type-quality" />
                        <Label htmlFor="type-quality" className="font-normal">
                          品質重視型（法人評価が特に高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="standard-leader" id="type-standard" />
                        <Label htmlFor="type-standard" className="font-normal">
                          標準リーダー型（両軸でB）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="development-needed" id="type-development" />
                        <Label htmlFor="type-development" className="font-normal">
                          リーダー育成型（リーダーシップの向上が必要）
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="overall-assessment">総合所見</Label>
                  <Textarea 
                    id="overall-assessment" 
                    placeholder="リーダーとしての価値、組織への貢献度、今後の可能性など"
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 育成計画タブ */}
            <TabsContent value="development" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">リーダーシップ開発計画</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="leadership-strengths">リーダーとしての強み</Label>
                  <Textarea 
                    id="leadership-strengths" 
                    placeholder="チーム統率力、品質管理能力、問題解決力など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="growth-areas">今後の成長課題</Label>
                  <Textarea 
                    id="growth-areas" 
                    placeholder="より高度な管理スキル、戦略的思考、組織変革力など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="organizational-goals">組織目標への貢献計画</Label>
                  <Textarea 
                    id="organizational-goals" 
                    placeholder="療養ケアの標準化、スタッフ定着率向上、新人育成システムの構築など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="successor-development">後継者育成計画</Label>
                  <Textarea 
                    id="successor-development" 
                    placeholder="次期リーダー候補の選定と育成、権限委譲の計画など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="career-advancement">今後のキャリア展望</Label>
                  <Textarea 
                    id="career-advancement" 
                    placeholder="管理職への昇進、専門資格の取得、組織運営への参画など"
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