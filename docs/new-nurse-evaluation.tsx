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
import { Progress } from "@/components/ui/progress";

export default function NewNurseEvaluation() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            新人看護師 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            入職1年目職員向け成長評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              新人看護師は成長過程を重視し、基礎技術習得度と学習姿勢を中心に評価します
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="facility">施設内評価</TabsTrigger>
              <TabsTrigger value="corporate">法人内評価</TabsTrigger>
              <TabsTrigger value="progress">成長進捗</TabsTrigger>
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
                  <Label htmlFor="eval-period">評価期間</Label>
                  <Input type="text" id="eval-period" placeholder="入職後3ヶ月 / 6ヶ月 / 12ヶ月" />
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
                    <Label htmlFor="department">配属部署</Label>
                    <Input type="text" id="department" />
                  </div>
                  <div>
                    <Label htmlFor="hire-date">入職日</Label>
                    <Input type="date" id="hire-date" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="preceptor">プリセプター名</Label>
                    <Input type="text" id="preceptor" />
                  </div>
                  <div>
                    <Label htmlFor="education-bg">最終学歴</Label>
                    <Input type="text" id="education-bg" placeholder="看護専門学校 / 看護大学" />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 施設内評価タブ */}
            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設内評価（新人同期内での相対評価）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  同期入職者の中での相対的な成長度・適応度を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 職場適応度</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="adapt-s" />
                        <Label htmlFor="adapt-s" className="font-normal">
                          <span className="font-semibold">S：</span> 極めて早い適応力、同期のロールモデル
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="adapt-a" />
                        <Label htmlFor="adapt-a" className="font-normal">
                          <span className="font-semibold">A：</span> 順調に適応し、積極的に職場に馴染んでいる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="adapt-b" />
                        <Label htmlFor="adapt-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的な適応ペース
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="adapt-c" />
                        <Label htmlFor="adapt-c" className="font-normal">
                          <span className="font-semibold">C：</span> 適応にやや時間がかかっている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="adapt-d" />
                        <Label htmlFor="adapt-d" className="font-normal">
                          <span className="font-semibold">D：</span> 適応に困難を抱えている
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 学習意欲・姿勢</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="learn-s" />
                        <Label htmlFor="learn-s" className="font-normal">
                          <span className="font-semibold">S：</span> 極めて高い学習意欲、自主的な学習姿勢
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="learn-a" />
                        <Label htmlFor="learn-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的に学習し、質問も適切
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="learn-b" />
                        <Label htmlFor="learn-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的な学習姿勢
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="learn-c" />
                        <Label htmlFor="learn-c" className="font-normal">
                          <span className="font-semibold">C：</span> 受動的な学習姿勢
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="learn-d" />
                        <Label htmlFor="learn-d" className="font-normal">
                          <span className="font-semibold">D：</span> 学習意欲に課題あり
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. チームワーク</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="team-s" />
                        <Label htmlFor="team-s" className="font-normal">
                          <span className="font-semibold">S：</span> 同期の中でリーダー的存在
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="team-a" />
                        <Label htmlFor="team-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的に協力し、良好な関係構築
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="team-b" />
                        <Label htmlFor="team-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的な協調性
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="team-c" />
                        <Label htmlFor="team-c" className="font-normal">
                          <span className="font-semibold">C：</span> チーム参加が消極的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="team-d" />
                        <Label htmlFor="team-d" className="font-normal">
                          <span className="font-semibold">D：</span> チーム内で孤立傾向
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
              </div>
            </TabsContent>

            {/* 法人内評価タブ */}
            <TabsContent value="corporate" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">法人内評価（基礎技術の習得度）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  新人看護師として必要な基礎技術・知識の絶対的な習得度を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 基礎看護技術</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="basic-s" />
                        <Label htmlFor="basic-s" className="font-normal">
                          <span className="font-semibold">S：</span> 全項目を完璧に習得、指導補助も可能
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="basic-a" />
                        <Label htmlFor="basic-a" className="font-normal">
                          <span className="font-semibold">A：</span> ほぼ全項目を習得、自立して実施可能
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="basic-b" />
                        <Label htmlFor="basic-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本項目は習得、一部指導下で実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="basic-c" />
                        <Label htmlFor="basic-c" className="font-normal">
                          <span className="font-semibold">C：</span> 基本項目の習得が不十分
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="basic-d" />
                        <Label htmlFor="basic-d" className="font-normal">
                          <span className="font-semibold">D：</span> 基礎技術に重大な課題あり
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 安全管理・感染対策</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="safety-s" />
                        <Label htmlFor="safety-s" className="font-normal">
                          <span className="font-semibold">S：</span> 完全に理解し、模範的な実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="safety-a" />
                        <Label htmlFor="safety-a" className="font-normal">
                          <span className="font-semibold">A：</span> 十分理解し、確実に実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="safety-b" />
                        <Label htmlFor="safety-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本を理解し、概ね実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="safety-c" />
                        <Label htmlFor="safety-c" className="font-normal">
                          <span className="font-semibold">C：</span> 理解・実践が不十分
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="safety-d" />
                        <Label htmlFor="safety-d" className="font-normal">
                          <span className="font-semibold">D：</span> 重大なリスクあり
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 記録・報告</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="record-s" />
                        <Label htmlFor="record-s" className="font-normal">
                          <span className="font-semibold">S：</span> 正確で的確な記録・報告
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="record-a" />
                        <Label htmlFor="record-a" className="font-normal">
                          <span className="font-semibold">A：</span> 適切な記録・報告ができる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="record-b" />
                        <Label htmlFor="record-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本的な記録・報告は可能
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="record-c" />
                        <Label htmlFor="record-c" className="font-normal">
                          <span className="font-semibold">C：</span> 記録・報告に改善が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="record-d" />
                        <Label htmlFor="record-d" className="font-normal">
                          <span className="font-semibold">D：</span> 記録・報告が不適切
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
              </div>
            </TabsContent>

            {/* 成長進捗タブ */}
            <TabsContent value="progress" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">新人看護師 技術チェックリスト進捗</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>環境調整技術</Label>
                    <span className="text-sm font-medium">80%</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>食事援助技術</Label>
                    <span className="text-sm font-medium">90%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>排泄援助技術</Label>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>活動・休息援助技術</Label>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>清潔・衣生活援助技術</Label>
                    <span className="text-sm font-medium">88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>呼吸・循環を整える技術</Label>
                    <span className="text-sm font-medium">70%</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>創傷管理技術</Label>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>与薬の技術</Label>
                    <span className="text-sm font-medium">72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>救命救急処置技術</Label>
                    <span className="text-sm font-medium">60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>症状・生体機能管理技術</Label>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <h4 className="font-semibold mb-2">総合進捗率</h4>
                  <p className="text-3xl font-bold text-blue-600">76%</p>
                </div>
              </div>

              <div>
                <Label htmlFor="progress-comment">進捗に関するコメント</Label>
                <Textarea 
                  id="progress-comment" 
                  placeholder="特に優れている技術、重点的に指導が必要な技術など"
                  className="min-h-[100px]"
                />
              </div>
            </TabsContent>

            {/* 育成計画タブ */}
            <TabsContent value="development" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">新人教育プログラム進捗と今後の計画</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-status">現在の状況評価</Label>
                  <Textarea 
                    id="current-status" 
                    placeholder="成長度、強み、課題点など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="next-goals">次期目標（3ヶ月後）</Label>
                  <Textarea 
                    id="next-goals" 
                    placeholder="習得すべき技術、到達すべきレベルなど"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label>重点指導項目</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center">
                      <Input type="checkbox" id="focus-1" className="mr-2" />
                      <Label htmlFor="focus-1">急変時対応</Label>
                    </div>
                    <div className="flex items-center">
                      <Input type="checkbox" id="focus-2" className="mr-2" />
                      <Label htmlFor="focus-2">多重課題への対応</Label>
                    </div>
                    <div className="flex items-center">
                      <Input type="checkbox" id="focus-3" className="mr-2" />
                      <Label htmlFor="focus-3">夜勤業務の自立</Label>
                    </div>
                    <div className="flex items-center">
                      <Input type="checkbox" id="focus-4" className="mr-2" />
                      <Label htmlFor="focus-4">リーダー業務の準備</Label>
                    </div>
                    <div className="flex items-center">
                      <Input type="checkbox" id="focus-5" className="mr-2" />
                      <Label htmlFor="focus-5">専門的看護技術</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="support-plan">サポート体制・計画</Label>
                  <Textarea 
                    id="support-plan" 
                    placeholder="プリセプターとの関わり、研修計画、メンタルサポートなど"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label>2年目に向けての準備</Label>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ready" id="prep-ready" />
                        <Label htmlFor="prep-ready">順調に成長し、2年目への準備ができている</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="partial" id="prep-partial" />
                        <Label htmlFor="prep-partial">一部課題はあるが、概ね準備できている</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="support" id="prep-support" />
                        <Label htmlFor="prep-support">継続的なサポートが必要</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="intensive" id="prep-intensive" />
                        <Label htmlFor="prep-intensive">集中的な指導継続が必要</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="next-evaluation">次回評価予定日</Label>
                  <Input type="date" id="next-evaluation" />
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