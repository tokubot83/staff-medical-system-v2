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
import { Heart } from 'lucide-react';

export default function RokenNewAssistantNurseEvaluationV3() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            介護老人保健施設 新人准看護師（1年目） 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            基礎技術習得と老健ケアへの適応を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Heart className="h-4 w-4" />
            <AlertDescription>
              老健准看護師として基本的なケア技術と多職種連携の基礎習得を評価します
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
                    <Label htmlFor="primary-service">主たる配属サービス</Label>
                    <Input type="text" id="primary-service" placeholder="入所 / 通所リハ" />
                  </div>
                  <div>
                    <Label htmlFor="rotation-experience">ローテーション経験</Label>
                    <Input type="text" id="rotation-experience" placeholder="入所6ヶ月、通所3ヶ月" />
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
                  チームへの適応と基本業務の習得を中心に評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 老健チームへの適応と協調性</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="adapt-s" />
                        <Label htmlFor="adapt-s" className="font-normal">
                          <span className="font-semibold">S：</span> 多職種チームに素早く適応し、積極的に協働
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="adapt-a" />
                        <Label htmlFor="adapt-a" className="font-normal">
                          <span className="font-semibold">A：</span> 介護職・リハ職と良好な関係を構築
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
                          <span className="font-semibold">C：</span> チーム適応に時間を要し、サポートが必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="adapt-d" />
                        <Label htmlFor="adapt-d" className="font-normal">
                          <span className="font-semibold">D：</span> チーム適応に困難があり、継続的な支援が必要
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 学習姿勢と成長意欲</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="learn-s" />
                        <Label htmlFor="learn-s" className="font-normal">
                          <span className="font-semibold">S：</span> 極めて積極的に学習し、予定より早く技術を習得
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="learn-a" />
                        <Label htmlFor="learn-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的に学習し、着実に成長している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="learn-b" />
                        <Label htmlFor="learn-b" className="font-normal">
                          <span className="font-semibold">B：</span> 必要な学習を行い、基本的な成長を示す
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="learn-c" />
                        <Label htmlFor="learn-c" className="font-normal">
                          <span className="font-semibold">C：</span> 受動的な学習姿勢で、成長が遅い
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="learn-d" />
                        <Label htmlFor="learn-d" className="font-normal">
                          <span className="font-semibold">D：</span> 学習意欲が低く、成長が見られない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 業務への取り組みと責任感</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="responsibility-s" />
                        <Label htmlFor="responsibility-s" className="font-normal">
                          <span className="font-semibold">S：</span> 高い責任感を持ち、期待以上の成果を上げる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="responsibility-a" />
                        <Label htmlFor="responsibility-a" className="font-normal">
                          <span className="font-semibold">A：</span> 責任を持って業務に取り組み、信頼できる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="responsibility-b" />
                        <Label htmlFor="responsibility-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本的な責任感を持って業務遂行
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="responsibility-c" />
                        <Label htmlFor="responsibility-c" className="font-normal">
                          <span className="font-semibold">C：</span> 責任感にムラがあり、指導が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="responsibility-d" />
                        <Label htmlFor="responsibility-d" className="font-normal">
                          <span className="font-semibold">D：</span> 責任感が不足し、業務に支障
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
                    placeholder="チーム連携の具体例、学習への取り組み、責任感を示した事例など"
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
                  准看護師としての基礎技術と老健ケアの理解を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 基礎看護技術の習得</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="skill-s" />
                        <Label htmlFor="skill-s" className="font-normal">
                          <span className="font-semibold">S：</span> 准看護師業務を完全習得し、安全・確実に実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="skill-a" />
                        <Label htmlFor="skill-a" className="font-normal">
                          <span className="font-semibold">A：</span> 予定より早く技術を習得し、正確に実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="skill-b" />
                        <Label htmlFor="skill-b" className="font-normal">
                          <span className="font-semibold">B：</span> 計画通りに技術を習得し、基本業務ができる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="skill-c" />
                        <Label htmlFor="skill-c" className="font-normal">
                          <span className="font-semibold">C：</span> 技術習得に遅れがあり、継続的な指導が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="skill-d" />
                        <Label htmlFor="skill-d" className="font-normal">
                          <span className="font-semibold">D：</span> 基礎技術の習得が著しく遅れ、集中的な支援が必要
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 老健ケアの理解と実践</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="care-understanding-s" />
                        <Label htmlFor="care-understanding-s" className="font-normal">
                          <span className="font-semibold">S：</span> 在宅復帰を意識した質の高いケアを実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="care-understanding-a" />
                        <Label htmlFor="care-understanding-a" className="font-normal">
                          <span className="font-semibold">A：</span> 老健の特性を理解し、適切なケアを提供
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="care-understanding-b" />
                        <Label htmlFor="care-understanding-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本的な老健ケアを理解・実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="care-understanding-c" />
                        <Label htmlFor="care-understanding-c" className="font-normal">
                          <span className="font-semibold">C：</span> 老健ケアの理解が不十分
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="care-understanding-d" />
                        <Label htmlFor="care-understanding-d" className="font-normal">
                          <span className="font-semibold">D：</span> 老健の特性を理解できていない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 安全管理とリスク認識</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="safety-s" />
                        <Label htmlFor="safety-s" className="font-normal">
                          <span className="font-semibold">S：</span> 高い安全意識を持ち、リスクを予防的に管理
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="safety-a" />
                        <Label htmlFor="safety-a" className="font-normal">
                          <span className="font-semibold">A：</span> 安全管理を確実に実践し、インシデントなし
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="safety-b" />
                        <Label htmlFor="safety-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本的な安全管理を実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="safety-c" />
                        <Label htmlFor="safety-c" className="font-normal">
                          <span className="font-semibold">C：</span> 安全意識に課題があり、注意が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="safety-d" />
                        <Label htmlFor="safety-d" className="font-normal">
                          <span className="font-semibold">D：</span> 安全管理が不十分で、リスクが高い
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
                    placeholder="習得した技術、老健ケアの実践例、安全管理での取り組みなど"
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
                    <p className="text-sm text-gray-600">チーム適応・学習姿勢</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">法人内評価</h4>
                    <p className="text-2xl font-bold text-green-600">B</p>
                    <p className="text-sm text-gray-600">技術習得・ケア理解</p>
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
                    placeholder="老健新人准看護師としての成長度、強み、今後の可能性など"
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
                    placeholder="協調性、学習への積極性、特定技術への適性など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="growth-areas">今後の成長課題</Label>
                  <Textarea 
                    id="growth-areas" 
                    placeholder="技術面の向上、老健ケアの理解深化、リーダーシップなど"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="next-goals">次期（3ヶ月後）の目標</Label>
                  <Textarea 
                    id="next-goals" 
                    placeholder="基本技術の完全習得、日勤業務の自立、夜勤への参加など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="support-plan">必要なサポート・教育計画</Label>
                  <Textarea 
                    id="support-plan" 
                    placeholder="技術研修、老健ケア研修、多職種連携研修など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="career-vision">2年目に向けての展望</Label>
                  <Textarea 
                    id="career-vision" 
                    placeholder="業務の完全自立、後輩指導への参加、専門分野の発見など"
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