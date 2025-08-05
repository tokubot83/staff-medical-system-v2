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

export default function NewNursingAideEvaluationV3() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            新人看護補助者（1年目） 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            基礎習得と職場適応・チーム貢献を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              新人看護補助者は基礎業務の習得状況に加え、職場への適応とチームへの貢献姿勢を評価します
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
                    <Label htmlFor="department">配属病棟</Label>
                    <Input type="text" id="department" />
                  </div>
                  <div>
                    <Label htmlFor="mentor">指導担当者</Label>
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
                    <Label htmlFor="evaluator2">2次評価者（主任・師長）</Label>
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
                  病棟でのチーム貢献・職場適応を中心に評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 職場適応・チーム貢献</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="adapt-s" />
                        <Label htmlFor="adapt-s" className="font-normal">
                          <span className="font-semibold">S：</span> 病棟の一員として完全に適応し、同期のリーダー的存在
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="adapt-a" />
                        <Label htmlFor="adapt-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的にチームに貢献し、良好な関係を構築
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="adapt-b" />
                        <Label htmlFor="adapt-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的な適応状況で、チームの一員として機能
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
                          <span className="font-semibold">D：</span> 適応困難で、継続的な支援が必要
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 学習姿勢と業務習得</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="learn-s" />
                        <Label htmlFor="learn-s" className="font-normal">
                          <span className="font-semibold">S：</span> 主体的に学習し、習得した内容を同僚と積極的に共有
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="learn-a" />
                        <Label htmlFor="learn-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的な学習姿勢で、期待以上の習得速度
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="learn-b" />
                        <Label htmlFor="learn-b" className="font-normal">
                          <span className="font-semibold">B：</span> 必要な業務を計画通りに習得
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="learn-c" />
                        <Label htmlFor="learn-c" className="font-normal">
                          <span className="font-semibold">C：</span> 受動的な学習姿勢で、習得に時間を要する
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="learn-d" />
                        <Label htmlFor="learn-d" className="font-normal">
                          <span className="font-semibold">D：</span> 学習意欲が低く、基本業務の習得が困難
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 病棟業務への貢献</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="contrib-s" />
                        <Label htmlFor="contrib-s" className="font-normal">
                          <span className="font-semibold">S：</span> 業務改善提案を行い、病棟の効率化に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="contrib-a" />
                        <Label htmlFor="contrib-a" className="font-normal">
                          <span className="font-semibold">A：</span> 与えられた役割以上の貢献をしている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="contrib-b" />
                        <Label htmlFor="contrib-b" className="font-normal">
                          <span className="font-semibold">B：</span> 期待される役割を適切に果たしている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="contrib-c" />
                        <Label htmlFor="contrib-c" className="font-normal">
                          <span className="font-semibold">C：</span> 基本的な業務遂行にとどまる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="contrib-d" />
                        <Label htmlFor="contrib-d" className="font-normal">
                          <span className="font-semibold">D：</span> 業務遂行に課題があり、病棟運営に影響
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
                    placeholder="病棟での具体的な貢献事例、チームへの影響、改善提案など"
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
                  看護補助実践能力と患者サービスを中心に評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 基礎的看護補助業務の習得</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="basic-s" />
                        <Label htmlFor="basic-s" className="font-normal">
                          <span className="font-semibold">S：</span> 全ての基礎業務を完全習得し、他の新人の手本となる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="basic-a" />
                        <Label htmlFor="basic-a" className="font-normal">
                          <span className="font-semibold">A：</span> 予定より早く業務を習得し、独立して実践可能
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="basic-b" />
                        <Label htmlFor="basic-b" className="font-normal">
                          <span className="font-semibold">B：</span> 計画通りに業務を習得し、基本的な実践ができる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="basic-c" />
                        <Label htmlFor="basic-c" className="font-normal">
                          <span className="font-semibold">C：</span> 業務習得に遅れがあり、継続的な指導が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="basic-d" />
                        <Label htmlFor="basic-d" className="font-normal">
                          <span className="font-semibold">D：</span> 基礎業務の習得が著しく遅れ、集中的な支援が必要
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 患者への接遇・サービス</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="service-s" />
                        <Label htmlFor="service-s" className="font-normal">
                          <span className="font-semibold">S：</span> 卓越した接遇で患者・家族から高い評価を得る
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="service-a" />
                        <Label htmlFor="service-a" className="font-normal">
                          <span className="font-semibold">A：</span> 丁寧で心のこもった接遇を実践し、良好な評価
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="service-b" />
                        <Label htmlFor="service-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的な接遇で患者対応ができる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="service-c" />
                        <Label htmlFor="service-c" className="font-normal">
                          <span className="font-semibold">C：</span> 接遇にばらつきがあり、改善が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="service-d" />
                        <Label htmlFor="service-d" className="font-normal">
                          <span className="font-semibold">D：</span> 患者対応に課題があり、苦情が発生
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 環境整備・感染対策への貢献</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="environment-s" />
                        <Label htmlFor="environment-s" className="font-normal">
                          <span className="font-semibold">S：</span> 模範的な環境整備を行い、感染対策の向上に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="environment-a" />
                        <Label htmlFor="environment-a" className="font-normal">
                          <span className="font-semibold">A：</span> 丁寧な環境整備と確実な感染対策を実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="environment-b" />
                        <Label htmlFor="environment-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本的な環境整備・感染対策を遵守
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="environment-c" />
                        <Label htmlFor="environment-c" className="font-normal">
                          <span className="font-semibold">C：</span> 環境整備・感染対策の実践が不十分
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="environment-d" />
                        <Label htmlFor="environment-d" className="font-normal">
                          <span className="font-semibold">D：</span> 環境整備・感染対策に問題があり、リスクが高い
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
                    placeholder="優れた実践例、患者・家族からの評価、環境整備の工夫など"
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
                    <p className="text-sm text-gray-600">チーム貢献・職場適応</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">法人内評価</h4>
                    <p className="text-2xl font-bold text-green-600">B</p>
                    <p className="text-sm text-gray-600">実践能力・サービス品質</p>
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
                        <RadioGroupItem value="practice-focused" id="type-practice" />
                        <Label htmlFor="type-practice" className="font-normal">
                          実践重視型（法人評価が高い）
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
                    placeholder="新人看護補助者としての成長度、強み、今後の可能性など"
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
                    placeholder="積極的な学習姿勢、患者への接遇、環境整備への取り組みなど"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="growth-areas">今後の成長課題</Label>
                  <Textarea 
                    id="growth-areas" 
                    placeholder="業務スピード、コミュニケーション、専門知識など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="next-goals">次期（3ヶ月後）の目標</Label>
                  <Textarea 
                    id="next-goals" 
                    placeholder="独り立ち項目、新たな業務習得、チーム活動への参加など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="support-plan">必要なサポート・教育計画</Label>
                  <Textarea 
                    id="support-plan" 
                    placeholder="指導体制の継続、基礎研修、OJTの強化など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="career-vision">2年目に向けての展望</Label>
                  <Textarea 
                    id="career-vision" 
                    placeholder="期待される成長、役割の変化、専門性の方向性など"
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