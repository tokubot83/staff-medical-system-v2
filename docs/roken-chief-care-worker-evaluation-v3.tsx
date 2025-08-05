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

export default function ChiefCareWorkerEvaluationV3() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            老健 介護福祉士主任 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            入所・通所サービス統括 管理職評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              介護部門の統括管理、施設運営への貢献、戦略的思考と実行力を重点評価します
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
                  <Label htmlFor="tenure">主任在任期間</Label>
                  <Input type="text" id="tenure" placeholder="例：3年目" />
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
                    <Label htmlFor="responsibility">管轄範囲</Label>
                    <select id="responsibility" className="w-full border rounded-md px-3 py-2">
                      <option value="">選択してください</option>
                      <option value="admission">入所サービス主任</option>
                      <option value="daycare">通所サービス主任</option>
                      <option value="both">入所・通所統括主任</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="team-size">管理職員数</Label>
                    <Input type="text" id="team-size" placeholder="例：介護職員25名" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（介護部長）</Label>
                    <Input type="text" id="evaluator1" />
                  </div>
                  <div>
                    <Label htmlFor="evaluator2">2次評価者（施設長）</Label>
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
                  管理職としての成果と施設経営への貢献を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 部門管理と業績達成</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="dept-mgmt-s" />
                        <Label htmlFor="dept-mgmt-s" className="font-normal">
                          <span className="font-semibold">S：</span> 目標を大幅に超過達成し、他部門のモデルとなる運営を実現
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="dept-mgmt-a" />
                        <Label htmlFor="dept-mgmt-a" className="font-normal">
                          <span className="font-semibold">A：</span> 全ての目標を達成し、効率的な部門運営を実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="dept-mgmt-b" />
                        <Label htmlFor="dept-mgmt-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本的な目標を達成し、安定的な運営を維持
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="dept-mgmt-c" />
                        <Label htmlFor="dept-mgmt-c" className="font-normal">
                          <span className="font-semibold">C：</span> 目標達成に課題があり、運営に改善が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="dept-mgmt-d" />
                        <Label htmlFor="dept-mgmt-d" className="font-normal">
                          <span className="font-semibold">D：</span> 管理能力に重大な課題があり、部門運営に支障
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 在宅復帰率の向上と質の管理</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="quality-s" />
                        <Label htmlFor="quality-s" className="font-normal">
                          <span className="font-semibold">S：</span> 革新的な取り組みで復帰率を大幅に向上、地域のモデル施設に
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="quality-a" />
                        <Label htmlFor="quality-a" className="font-normal">
                          <span className="font-semibold">A：</span> 高い復帰率を維持し、ケアの質も向上
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="quality-b" />
                        <Label htmlFor="quality-b" className="font-normal">
                          <span className="font-semibold">B：</span> 目標復帰率を達成し、適切な質管理を実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="quality-c" />
                        <Label htmlFor="quality-c" className="font-normal">
                          <span className="font-semibold">C：</span> 復帰率・質管理に改善の余地がある
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="quality-d" />
                        <Label htmlFor="quality-d" className="font-normal">
                          <span className="font-semibold">D：</span> 目標未達成で、質の低下が見られる
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 経営参画と収益改善</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="revenue-s" />
                        <Label htmlFor="revenue-s" className="font-normal">
                          <span className="font-semibold">S：</span> 新規事業提案や革新的改善で収益を大幅に向上
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="revenue-a" />
                        <Label htmlFor="revenue-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的な経営参画で収益改善に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="revenue-b" />
                        <Label htmlFor="revenue-b" className="font-normal">
                          <span className="font-semibold">B：</span> コスト管理を適切に行い、予算を達成
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="revenue-c" />
                        <Label htmlFor="revenue-c" className="font-normal">
                          <span className="font-semibold">C：</span> 経営意識が不足し、収益改善への貢献が限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="revenue-d" />
                        <Label htmlFor="revenue-d" className="font-normal">
                          <span className="font-semibold">D：</span> 収支管理に問題があり、経営に悪影響
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
                    placeholder="目標達成状況、復帰率改善の実績、収益貢献の具体例など"
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
                  管理職としてのリーダーシップと組織開発力を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 人材育成とチーム構築</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="hr-dev-s" />
                        <Label htmlFor="hr-dev-s" className="font-normal">
                          <span className="font-semibold">S：</span> 卓越した人材育成で、多数の優秀な人材を輩出
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="hr-dev-a" />
                        <Label htmlFor="hr-dev-a" className="font-normal">
                          <span className="font-semibold">A：</span> 体系的な育成プログラムで高いチーム力を実現
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="hr-dev-b" />
                        <Label htmlFor="hr-dev-b" className="font-normal">
                          <span className="font-semibold">B：</span> 適切な人材育成とチーム運営を実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="hr-dev-c" />
                        <Label htmlFor="hr-dev-c" className="font-normal">
                          <span className="font-semibold">C：</span> 育成・チーム構築に課題があり改善が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="hr-dev-d" />
                        <Label htmlFor="hr-dev-d" className="font-normal">
                          <span className="font-semibold">D：</span> 人材育成を怠り、チームが機能不全
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. リーダーシップと組織変革</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="leadership-s" />
                        <Label htmlFor="leadership-s" className="font-normal">
                          <span className="font-semibold">S：</span> 変革型リーダーシップで組織文化を革新
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="leadership-a" />
                        <Label htmlFor="leadership-a" className="font-normal">
                          <span className="font-semibold">A：</span> 強いリーダーシップで組織を前進させる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="leadership-b" />
                        <Label htmlFor="leadership-b" className="font-normal">
                          <span className="font-semibold">B：</span> 安定的なリーダーシップを発揮
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="leadership-c" />
                        <Label htmlFor="leadership-c" className="font-normal">
                          <span className="font-semibold">C：</span> リーダーシップが不安定で組織に混乱
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="leadership-d" />
                        <Label htmlFor="leadership-d" className="font-normal">
                          <span className="font-semibold">D：</span> リーダーシップの欠如で組織が停滞
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 戦略的思考と実行力</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="strategy-s" />
                        <Label htmlFor="strategy-s" className="font-normal">
                          <span className="font-semibold">S：</span> 先見性のある戦略立案と確実な実行で大きな成果
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="strategy-a" />
                        <Label htmlFor="strategy-a" className="font-normal">
                          <span className="font-semibold">A：</span> 戦略的な計画立案と着実な実行力を持つ
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="strategy-b" />
                        <Label htmlFor="strategy-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本的な戦略思考と実行力を有する
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="strategy-c" />
                        <Label htmlFor="strategy-c" className="font-normal">
                          <span className="font-semibold">C：</span> 戦略性に欠け、実行力も不十分
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="strategy-d" />
                        <Label htmlFor="strategy-d" className="font-normal">
                          <span className="font-semibold">D：</span> 場当たり的な対応で計画性がない
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
                    placeholder="人材育成の成果、組織変革の実績、戦略実行の成功例など"
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
                    <p className="text-sm text-gray-600">経営貢献・業績達成</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">法人内評価</h4>
                    <p className="text-2xl font-bold text-green-600">B</p>
                    <p className="text-sm text-gray-600">リーダーシップ・組織開発</p>
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
                  <h4 className="font-semibold mb-3">管理職タイプ評価</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="executive" id="type-executive" />
                        <Label htmlFor="type-executive" className="font-normal">
                          経営幹部候補型（両軸でS・A、次期部長候補）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="results" id="type-results" />
                        <Label htmlFor="type-results" className="font-normal">
                          成果重視型（施設評価が特に高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="people" id="type-people" />
                        <Label htmlFor="type-people" className="font-normal">
                          人材育成型（法人評価が特に高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="balanced-mgr" id="type-balanced" />
                        <Label htmlFor="type-balanced" className="font-normal">
                          バランス型（両軸でB、安定的な管理職）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="development" id="type-development" />
                        <Label htmlFor="type-development" className="font-normal">
                          育成必要型（管理職としてさらなる成長が必要）
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="overall-assessment">総合所見</Label>
                  <Textarea
                    id="overall-assessment"
                    placeholder="管理職としての適性、強み、今後の期待など"
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 育成計画タブ */}
            <TabsContent value="development" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">管理職育成計画</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="management-achievements">管理職としての主な成果</Label>
                  <Textarea
                    id="management-achievements"
                    placeholder="部門業績、人材育成実績、組織改革の成果など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="leadership-strengths">リーダーシップの強み</Label>
                  <Textarea
                    id="leadership-strengths"
                    placeholder="統率力、戦略性、コミュニケーション能力など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="development-areas">管理職として成長が必要な領域</Label>
                  <Textarea
                    id="development-areas"
                    placeholder="経営知識、財務管理、交渉力など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="next-level-goals">次のステップへの目標（1-2年）</Label>
                  <Textarea
                    id="next-level-goals"
                    placeholder="・介護部長への昇格準備\n・新規事業の立ち上げ\n・法人全体の介護戦略策定への参画"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="executive-development">経営幹部育成プログラム</Label>
                  <Textarea
                    id="executive-development"
                    placeholder="・経営管理研修の受講\n・他施設での管理経験\n・外部研修・MBA取得支援"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="succession-planning">後任育成計画</Label>
                  <Textarea
                    id="succession-planning"
                    placeholder="次期主任候補者、育成方法、引き継ぎ計画など"
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