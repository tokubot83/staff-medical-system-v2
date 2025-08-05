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

export default function LeaderCareAssistantEvaluationV3() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            老健 介護士リーダー 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            入所・通所サービス両部門対応 チームリーダー評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              介護士チームの統括、介護福祉士との連携、部門運営への貢献を重点評価します
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="facility">施設内評価</TabsTrigger>
              <TabsTrigger value="corporate">法人内評価</TabsTrigger>
              <TagsTrigger value="matrix">総合判定</TabsTrigger>
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
                  <Label htmlFor="leadership-tenure">リーダー在任期間</Label>
                  <Input type="text" id="leadership-tenure" placeholder="例：2年目" />
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
                    <Label htmlFor="team-scope">統括範囲</Label>
                    <select id="team-scope" className="w-full border rounded-md px-3 py-2">
                      <option value="">選択してください</option>
                      <option value="admission">入所サービス介護士チーム</option>
                      <option value="daycare">通所サービス介護士チーム</option>
                      <option value="both">入所・通所介護士統括</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="team-size">管理人数</Label>
                    <Input type="text" id="team-size" placeholder="例：介護士15名" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（介護福祉士主任）</Label>
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
                  チーム統括と部門運営への貢献を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 介護士チームの統括・管理</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="team-mgmt-s" />
                        <Label htmlFor="team-mgmt-s" className="font-normal">
                          <span className="font-semibold">S：</span> 卓越したリーダーシップでチームを統括し、著しい成果を達成
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="team-mgmt-a" />
                        <Label htmlFor="team-mgmt-a" className="font-normal">
                          <span className="font-semibold">A：</span> 効果的にチームをまとめ、目標を達成
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="team-mgmt-b" />
                        <Label htmlFor="team-mgmt-b" className="font-normal">
                          <span className="font-semibold">B：</span> 適切なチーム統括を実施している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="team-mgmt-c" />
                        <Label htmlFor="team-mgmt-c" className="font-normal">
                          <span className="font-semibold">C：</span> チーム統括に課題があり、改善が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="team-mgmt-d" />
                        <Label htmlFor="team-mgmt-d" className="font-normal">
                          <span className="font-semibold">D：</span> リーダーとしての役割を果たしていない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 介護福祉士との連携・協働</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="collab-s" />
                        <Label htmlFor="collab-s" className="font-normal">
                          <span className="font-semibold">S：</span> 介護福祉士と密接に連携し、部門全体の質向上を実現
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="collab-a" />
                        <Label htmlFor="collab-a" className="font-normal">
                          <span className="font-semibold">A：</span> 介護福祉士との良好な協働関係を構築
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="collab-b" />
                        <Label htmlFor="collab-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本的な連携・協働を実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="collab-c" />
                        <Label htmlFor="collab-c" className="font-normal">
                          <span className="font-semibold">C：</span> 連携に課題があり、関係改善が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="collab-d" />
                        <Label htmlFor="collab-d" className="font-normal">
                          <span className="font-semibold">D：</span> 連携を拒み、部門運営に支障
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 部門目標の達成・貢献</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="goals-s" />
                        <Label htmlFor="goals-s" className="font-normal">
                          <span className="font-semibold">S：</span> 目標を大幅に超過達成し、部門の発展に大きく貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="goals-a" />
                        <Label htmlFor="goals-a" className="font-normal">
                          <span className="font-semibold">A：</span> 全ての目標を達成し、部門運営に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="goals-b" />
                        <Label htmlFor="goals-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本的な目標を達成している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="goals-c" />
                        <Label htmlFor="goals-c" className="font-normal">
                          <span className="font-semibold">C：</span> 目標達成に課題があり、改善が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="goals-d" />
                        <Label htmlFor="goals-d" className="font-normal">
                          <span className="font-semibold">D：</span> 目標を達成できず、部門運営に悪影響
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
                  <Label htmlFor="facility-comment">具体的な成果・評価コメント</Label>
                  <Textarea
                    id="facility-comment"
                    placeholder="チーム統括の成果、連携の具体例、目標達成状況など"
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
                  リーダーとしての資質と人材育成能力を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. リーダーシップと人材育成</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="leadership-s" />
                        <Label htmlFor="leadership-s" className="font-normal">
                          <span className="font-semibold">S：</span> 卓越したリーダーシップで多くの優秀な人材を育成
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="leadership-a" />
                        <Label htmlFor="leadership-a" className="font-normal">
                          <span className="font-semibold">A：</span> 効果的なリーダーシップと計画的な人材育成を実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="leadership-b" />
                        <Label htmlFor="leadership-b" className="font-normal">
                          <span className="font-semibold">B：</span> 適切なリーダーシップと人材育成を実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="leadership-c" />
                        <Label htmlFor="leadership-c" className="font-normal">
                          <span className="font-semibold">C：</span> リーダーシップ・育成力に課題があり改善が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="leadership-d" />
                        <Label htmlFor="leadership-d" className="font-normal">
                          <span className="font-semibold">D：</span> リーダーシップが不足し、人材育成を怠っている
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 問題解決能力と判断力</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="problem-s" />
                        <Label htmlFor="problem-s" className="font-normal">
                          <span className="font-semibold">S：</span> 複雑な問題を的確に分析し、創造的な解決策を実行
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="problem-a" />
                        <Label htmlFor="problem-a" className="font-normal">
                          <span className="font-semibold">A：</span> 問題を迅速に把握し、適切な判断で解決
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="problem-b" />
                        <Label htmlFor="problem-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本的な問題解決と判断ができる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="problem-c" />
                        <Label htmlFor="problem-c" className="font-normal">
                          <span className="font-semibold">C：</span> 問題解決・判断に時間がかかり、サポートが必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="problem-d" />
                        <Label htmlFor="problem-d" className="font-normal">
                          <span className="font-semibold">D：</span> 問題解決能力・判断力が不足し、依存的
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. コミュニケーション・調整力</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="comm-s" />
                        <Label htmlFor="comm-s" className="font-normal">
                          <span className="font-semibold">S：</span> 卓越したコミュニケーション力で関係者をまとめ、組織を活性化
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="comm-a" />
                        <Label htmlFor="comm-a" className="font-normal">
                          <span className="font-semibold">A：</span> 効果的なコミュニケーションと調整力を発揮
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="comm-b" />
                        <Label htmlFor="comm-b" className="font-normal">
                          <span className="font-semibold">B：</span> 適切なコミュニケーションと調整を実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="comm-c" />
                        <Label htmlFor="comm-c" className="font-normal">
                          <span className="font-semibold">C：</span> コミュニケーション・調整に課題があり改善が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="comm-d" />
                        <Label htmlFor="comm-d" className="font-normal">
                          <span className="font-semibold">D：</span> コミュニケーション不足で関係に問題
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
                  <Label htmlFor="corporate-comment">リーダーシップ発揮事例・評価コメント</Label>
                  <Textarea
                    id="corporate-comment"
                    placeholder="人材育成の成果、問題解決の実例、調整力の発揮など"
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
                    <p className="text-sm text-gray-600">統括力・連携・目標達成</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">法人内評価</h4>
                    <p className="text-2xl font-bold text-green-600">B</p>
                    <p className="text-sm text-gray-600">リーダーシップ・育成力</p>
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
                  <h4 className="font-semibold mb-3">リーダータイプ評価</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="exceptional" id="type-exceptional" />
                        <Label htmlFor="type-exceptional" className="font-normal">
                          卓越リーダー型（両軸でS・A、上位管理職候補）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="results-oriented" id="type-results" />
                        <Label htmlFor="type-results" className="font-normal">
                          成果重視型（施設評価が特に高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="people-oriented" id="type-people" />
                        <Label htmlFor="type-people" className="font-normal">
                          人材育成型（法人評価が特に高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="balanced-leader" id="type-balanced" />
                        <Label htmlFor="type-balanced" className="font-normal">
                          バランス型（両軸でB、安定したリーダー）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="developing-leader" id="type-developing" />
                        <Label htmlFor="type-developing" className="font-normal">
                          成長型（リーダーとしてさらなる成長が必要）
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="overall-assessment">総合所見</Label>
                  <Textarea
                    id="overall-assessment"
                    placeholder="リーダーとしての適性、チーム統括力、今後の期待など"
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 育成計画タブ */}
            <TabsContent value="development" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">リーダー育成計画</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="leadership-achievements">リーダーとしての主な成果</Label>
                  <Textarea
                    id="leadership-achievements"
                    placeholder="チーム統括の成果、人材育成実績、問題解決の事例など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="leadership-strengths">リーダーシップの強み</Label>
                  <Textarea
                    id="leadership-strengths"
                    placeholder="統率力、コミュニケーション力、決断力、調整力など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="development-areas">成長が必要な領域</Label>
                  <Textarea
                    id="development-areas"
                    placeholder="戦略的思考、経営知識、交渉力、プレゼンテーション力など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="next-goals">次のステップへの目標（1年後）</Label>
                  <Textarea
                    id="next-goals"
                    placeholder="・より大きなチームの統括\n・上位管理職への昇格準備\n・部門全体の質向上への貢献"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="leadership-development">リーダーシップ開発プログラム</Label>
                  <Textarea
                    id="leadership-development"
                    placeholder="・管理職研修の受講\n・他施設リーダーとの交流\n・メンタリング・コーチング研修"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="team-development">チーム育成計画</Label>
                  <Textarea
                    id="team-development"
                    placeholder="後継者候補の特定と育成、チーム全体のスキルアップ計画など"
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