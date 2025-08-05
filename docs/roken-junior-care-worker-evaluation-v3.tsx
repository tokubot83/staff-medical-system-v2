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

export default function JuniorCareWorkerEvaluationV3() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            老健 2・3年目介護福祉士 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            入所・通所サービス両部門対応 実践力向上期評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              基本技術の定着と応用力、新人指導への関わりと在宅復帰支援の実践力を評価します
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
                  <Input type="text" id="experience" placeholder="2年目 / 3年目" />
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
                    <Label htmlFor="mentor">新人指導担当</Label>
                    <select id="mentor" className="w-full border rounded-md px-3 py-2">
                      <option value="">選択してください</option>
                      <option value="yes">あり</option>
                      <option value="no">なし</option>
                    </select>
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
                  部門内でのリーダーシップと在宅復帰への積極的関与を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 新人指導・後輩育成</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="mentor-s" />
                        <Label htmlFor="mentor-s" className="font-normal">
                          <span className="font-semibold">S：</span> 新人の模範となり、主体的に指導計画を立案・実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="mentor-a" />
                        <Label htmlFor="mentor-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的に新人をサポートし、丁寧な指導を実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="mentor-b" />
                        <Label htmlFor="mentor-b" className="font-normal">
                          <span className="font-semibold">B：</span> 求められれば適切に後輩指導を行う
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="mentor-c" />
                        <Label htmlFor="mentor-c" className="font-normal">
                          <span className="font-semibold">C：</span> 後輩指導に消極的で、サポートが不十分
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="mentor-d" />
                        <Label htmlFor="mentor-d" className="font-normal">
                          <span className="font-semibold">D：</span> 指導力に課題があり、新人育成に支障
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 在宅復帰カンファレンスへの貢献</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="conf-s" />
                        <Label htmlFor="conf-s" className="font-normal">
                          <span className="font-semibold">S：</span> 生活の視点から具体的な提案を行い、復帰計画に大きく貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="conf-a" />
                        <Label htmlFor="conf-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的に発言し、実践的な意見を提供
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="conf-b" />
                        <Label htmlFor="conf-b" className="font-normal">
                          <span className="font-semibold">B：</span> カンファレンスに参加し、基本的な情報共有を行う
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="conf-c" />
                        <Label htmlFor="conf-c" className="font-normal">
                          <span className="font-semibold">C：</span> 参加は消極的で、発言が少ない
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="conf-d" />
                        <Label htmlFor="conf-d" className="font-normal">
                          <span className="font-semibold">D：</span> カンファレンスへの貢献がほとんどない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 業務改善・効率化への取り組み</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="improve-s" />
                        <Label htmlFor="improve-s" className="font-normal">
                          <span className="font-semibold">S：</span> 革新的な改善提案を実施し、部門全体の質向上に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="improve-a" />
                        <Label htmlFor="improve-a" className="font-normal">
                          <span className="font-semibold">A：</span> 問題点を発見し、実践的な改善策を提案・実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="improve-b" />
                        <Label htmlFor="improve-b" className="font-normal">
                          <span className="font-semibold">B：</span> 改善活動に参加し、与えられた役割を果たす
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="improve-c" />
                        <Label htmlFor="improve-c" className="font-normal">
                          <span className="font-semibold">C：</span> 現状維持にとどまり、改善意識が低い
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="improve-d" />
                        <Label htmlFor="improve-d" className="font-normal">
                          <span className="font-semibold">D：</span> 業務改善に否定的で、変化を拒む
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
                    placeholder="新人指導の成果、カンファレンスでの提案例、改善実績など"
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
                  介護福祉士としての専門性向上と実践応用力を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 専門的介護技術の実践</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="tech-s" />
                        <Label htmlFor="tech-s" className="font-normal">
                          <span className="font-semibold">S：</span> 高度な介護技術を習得し、困難事例にも対応可能
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="tech-a" />
                        <Label htmlFor="tech-a" className="font-normal">
                          <span className="font-semibold">A：</span> 応用的な技術を身につけ、個別性の高いケアを実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="tech-b" />
                        <Label htmlFor="tech-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的な介護技術を確実に実施できる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="tech-c" />
                        <Label htmlFor="tech-c" className="font-normal">
                          <span className="font-semibold">C：</span> 基本技術に不安があり、応用が困難
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="tech-d" />
                        <Label htmlFor="tech-d" className="font-normal">
                          <span className="font-semibold">D：</span> 技術習得が不十分で、実践に課題
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. ケアプラン実践と評価</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="plan-s" />
                        <Label htmlFor="plan-s" className="font-normal">
                          <span className="font-semibold">S：</span> ケアプランを深く理解し、創造的な実践と的確な評価を実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="plan-a" />
                        <Label htmlFor="plan-a" className="font-normal">
                          <span className="font-semibold">A：</span> 計画に基づいた実践と適切なモニタリングができる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="plan-b" />
                        <Label htmlFor="plan-b" className="font-normal">
                          <span className="font-semibold">B：</span> ケアプランに沿った基本的な実践ができる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="plan-c" />
                        <Label htmlFor="plan-c" className="font-normal">
                          <span className="font-semibold">C：</span> プラン理解が不十分で、実践にばらつきがある
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="plan-d" />
                        <Label htmlFor="plan-d" className="font-normal">
                          <span className="font-semibold">D：</span> ケアプランの実践・評価に大きな課題
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 家族支援・相談対応</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="family-s" />
                        <Label htmlFor="family-s" className="font-normal">
                          <span className="font-semibold">S：</span> 家族の不安を的確に把握し、専門的な助言と支援を提供
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="family-a" />
                        <Label htmlFor="family-a" className="font-normal">
                          <span className="font-semibold">A：</span> 家族との信頼関係を築き、適切な情報提供と支援を実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="family-b" />
                        <Label htmlFor="family-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本的な家族対応と情報共有ができる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="family-c" />
                        <Label htmlFor="family-c" className="font-normal">
                          <span className="font-semibold">C：</span> 家族対応に不安があり、上司のサポートが必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="family-d" />
                        <Label htmlFor="family-d" className="font-normal">
                          <span className="font-semibold">D：</span> 家族支援の視点が不足し、対応に課題
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
                    placeholder="困難事例への対応、家族支援の成功例、専門技術の活用など"
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
                    <p className="text-sm text-gray-600">指導力・改善貢献</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">法人内評価</h4>
                    <p className="text-2xl font-bold text-green-600">B</p>
                    <p className="text-sm text-gray-600">専門性・応用力</p>
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
                  <h4 className="font-semibold mb-3">成長段階評価</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="exceptional" id="stage-exceptional" />
                        <Label htmlFor="stage-exceptional" className="font-normal">
                          卓越成長型（両軸でA以上、中堅レベルに到達）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="standard" id="stage-standard" />
                        <Label htmlFor="stage-standard" className="font-normal">
                          標準成長型（両軸でB、順調な成長）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="specialized" id="stage-specialized" />
                        <Label htmlFor="stage-specialized" className="font-normal">
                          専門特化型（法人評価が高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="leadership" id="stage-leadership" />
                        <Label htmlFor="stage-leadership" className="font-normal">
                          リーダー素質型（施設評価が高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="developing" id="stage-developing" />
                        <Label htmlFor="stage-developing" className="font-normal">
                          発展途上型（成長に時間が必要）
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="overall-assessment">総合所見</Label>
                  <Textarea
                    id="overall-assessment"
                    placeholder="2・3年目としての成長度、強み、今後の可能性など"
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
                  <Label htmlFor="achievements">この1年間の主な成果</Label>
                  <Textarea
                    id="achievements"
                    placeholder="技術習得、新人指導の成果、改善提案の実現など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="strengths">特に優れている点・強み</Label>
                  <Textarea
                    id="strengths"
                    placeholder="専門技術、コミュニケーション力、問題解決能力など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="growth-areas">今後の成長課題</Label>
                  <Textarea
                    id="growth-areas"
                    placeholder="リーダーシップ、専門知識の深化、家族支援スキルなど"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="next-goals">次期（6ヶ月後）の目標</Label>
                  <Textarea
                    id="next-goals"
                    placeholder="・新人指導の主担当\n・困難事例への対応力向上\n・在宅復帰率向上への貢献"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="support-plan">必要なサポート・教育計画</Label>
                  <Textarea
                    id="support-plan"
                    placeholder="・リーダーシップ研修\n・専門資格取得支援\n・他部門研修"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="career-path">キャリアパスの方向性</Label>
                  <Textarea
                    id="career-path"
                    placeholder="将来的な役割（主任候補、専門職、教育担当など）"
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