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

export default function MidlevelCareWorkerEvaluationV3() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            老健 中堅介護福祉士（4-10年目） 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            入所・通所サービス両部門対応 中核人材評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              チームリーダーとしての実践、在宅復帰支援の中心的役割、後進育成能力を重点評価します
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
                  <Input type="text" id="experience" placeholder="例：7年目" />
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
                    <Label htmlFor="role">役割・担当</Label>
                    <Input type="text" id="role" placeholder="例：フロアリーダー、教育担当" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（介護主任）</Label>
                    <Input type="text" id="evaluator1" />
                  </div>
                  <div>
                    <Label htmlFor="evaluator2">2次評価者（管理者）</Label>
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
                  チームマネジメントと施設運営への貢献度を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. チームリーダーシップ</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="leader-s" />
                        <Label htmlFor="leader-s" className="font-normal">
                          <span className="font-semibold">S：</span> 卓越したリーダーシップでチームを導き、部門全体の質向上を実現
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="leader-a" />
                        <Label htmlFor="leader-a" className="font-normal">
                          <span className="font-semibold">A：</span> チームをまとめ、メンバーの能力を引き出している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="leader-b" />
                        <Label htmlFor="leader-b" className="font-normal">
                          <span className="font-semibold">B：</span> リーダー業務を適切に遂行している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="leader-c" />
                        <Label htmlFor="leader-c" className="font-normal">
                          <span className="font-semibold">C：</span> リーダーシップに課題があり、チーム運営に支障
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="leader-d" />
                        <Label htmlFor="leader-d" className="font-normal">
                          <span className="font-semibold">D：</span> リーダーとしての役割を果たせていない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 在宅復帰支援の推進</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="discharge-s" />
                        <Label htmlFor="discharge-s" className="font-normal">
                          <span className="font-semibold">S：</span> 在宅復帰の中心的役割を担い、復帰率向上に大きく貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="discharge-a" />
                        <Label htmlFor="discharge-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的に在宅復帰を推進し、家族指導も実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="discharge-b" />
                        <Label htmlFor="discharge-b" className="font-normal">
                          <span className="font-semibold">B：</span> 在宅復帰支援に適切に関わっている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="discharge-c" />
                        <Label htmlFor="discharge-c" className="font-normal">
                          <span className="font-semibold">C：</span> 在宅復帰への取り組みが消極的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="discharge-d" />
                        <Label htmlFor="discharge-d" className="font-normal">
                          <span className="font-semibold">D：</span> 在宅復帰支援に関与していない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 施設運営・経営への貢献</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="management-s" />
                        <Label htmlFor="management-s" className="font-normal">
                          <span className="font-semibold">S：</span> 経営的視点を持ち、収益改善や新規事業提案を実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="management-a" />
                        <Label htmlFor="management-a" className="font-normal">
                          <span className="font-semibold">A：</span> コスト意識を持ち、効率的な運営に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="management-b" />
                        <Label htmlFor="management-b" className="font-normal">
                          <span className="font-semibold">B：</span> 施設運営に協力的で、基本的な貢献をしている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="management-c" />
                        <Label htmlFor="management-c" className="font-normal">
                          <span className="font-semibold">C：</span> 運営への関心が低く、貢献が限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="management-d" />
                        <Label htmlFor="management-d" className="font-normal">
                          <span className="font-semibold">D：</span> 施設運営に無関心で、協力的でない
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
                    placeholder="チーム運営の成果、在宅復帰の実績、経営改善への貢献など"
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
                  介護福祉士としての高度な専門性と指導力を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 高度な介護実践と困難事例対応</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="practice-s" />
                        <Label htmlFor="practice-s" className="font-normal">
                          <span className="font-semibold">S：</span> 最高水準の介護技術で、他施設からも相談を受けるレベル
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="practice-a" />
                        <Label htmlFor="practice-a" className="font-normal">
                          <span className="font-semibold">A：</span> 困難事例に的確に対応し、創造的な解決策を実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="practice-b" />
                        <Label htmlFor="practice-b" className="font-normal">
                          <span className="font-semibold">B：</span> 高度な介護技術を持ち、安定した実践ができる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="practice-c" />
                        <Label htmlFor="practice-c" className="font-normal">
                          <span className="font-semibold">C：</span> 中堅として期待される技術レベルに達していない
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="practice-d" />
                        <Label htmlFor="practice-d" className="font-normal">
                          <span className="font-semibold">D：</span> 専門性の向上が見られず、実践に課題
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 後進育成・教育指導力</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="education-s" />
                        <Label htmlFor="education-s" className="font-normal">
                          <span className="font-semibold">S：</span> 体系的な教育プログラムを構築し、多くの優秀な人材を育成
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="education-a" />
                        <Label htmlFor="education-a" className="font-normal">
                          <span className="font-semibold">A：</span> 効果的な指導で後進の成長に大きく貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="education-b" />
                        <Label htmlFor="education-b" className="font-normal">
                          <span className="font-semibold">B：</span> 適切な指導を行い、後進育成に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="education-c" />
                        <Label htmlFor="education-c" className="font-normal">
                          <span className="font-semibold">C：</span> 指導力に課題があり、育成効果が限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="education-d" />
                        <Label htmlFor="education-d" className="font-normal">
                          <span className="font-semibold">D：</span> 後進育成に関心がなく、指導を避ける
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 専門知識の発展と共有</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="knowledge-s" />
                        <Label htmlFor="knowledge-s" className="font-normal">
                          <span className="font-semibold">S：</span> 最新知識を積極的に学び、研究発表や執筆活動も実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="knowledge-a" />
                        <Label htmlFor="knowledge-a" className="font-normal">
                          <span className="font-semibold">A：</span> 専門知識を深め、施設内での勉強会を主導
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="knowledge-b" />
                        <Label htmlFor="knowledge-b" className="font-normal">
                          <span className="font-semibold">B：</span> 必要な知識を習得し、チーム内で共有
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="knowledge-c" />
                        <Label htmlFor="knowledge-c" className="font-normal">
                          <span className="font-semibold">C：</span> 知識更新が不十分で、共有も消極的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="knowledge-d" />
                        <Label htmlFor="knowledge-d" className="font-normal">
                          <span className="font-semibold">D：</span> 専門知識の向上に無関心
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
                    placeholder="困難事例への対応、教育実績、専門知識の活用など"
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
                    <p className="text-sm text-gray-600">リーダーシップ・経営貢献</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">法人内評価</h4>
                    <p className="text-2xl font-bold text-green-600">B</p>
                    <p className="text-sm text-gray-600">専門性・教育力</p>
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
                  <h4 className="font-semibold mb-3">キャリアタイプ評価</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="management" id="type-management" />
                        <Label htmlFor="type-management" className="font-normal">
                          管理職候補型（両軸でA以上、主任昇格候補）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="specialist" id="type-specialist" />
                        <Label htmlFor="type-specialist" className="font-normal">
                          専門職型（法人評価が特に高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="balanced" id="type-balanced" />
                        <Label htmlFor="type-balanced" className="font-normal">
                          バランス型（両軸でB、安定した中核人材）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="operational" id="type-operational" />
                        <Label htmlFor="type-operational" className="font-normal">
                          現場重視型（施設評価が高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="plateau" id="type-plateau" />
                        <Label htmlFor="type-plateau" className="font-normal">
                          成長停滞型（両軸でC以下）
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="overall-assessment">総合所見</Label>
                  <Textarea
                    id="overall-assessment"
                    placeholder="中堅としての役割遂行度、将来性、組織への貢献など"
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 育成計画タブ */}
            <TabsContent value="development" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">キャリア開発計画</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="achievements">主な実績・成果</Label>
                  <Textarea
                    id="achievements"
                    placeholder="チーム運営の成果、在宅復帰実績、教育成果など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="strengths">強み・専門領域</Label>
                  <Textarea
                    id="strengths"
                    placeholder="認知症ケア、ターミナルケア、リハビリテーション等の専門性"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="development-needs">能力開発ニーズ</Label>
                  <Textarea
                    id="development-needs"
                    placeholder="マネジメントスキル、経営知識、教育技法など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="career-goals">今後のキャリア目標（1-3年）</Label>
                  <Textarea
                    id="career-goals"
                    placeholder="・介護主任への昇格\n・認定介護福祉士の取得\n・教育担当者としての専門性確立"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="action-plan">具体的なアクションプラン</Label>
                  <Textarea
                    id="action-plan"
                    placeholder="・マネジメント研修受講\n・他施設見学・交流\n・学会発表・論文執筆"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="succession">後継者育成計画</Label>
                  <Textarea
                    id="succession"
                    placeholder="担当する後輩、育成目標、指導計画など"
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