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

export default function VeteranAssistantNurseEvaluationV3() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            ベテラン准看護師（11年目以上） 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            組織への影響力と次世代育成を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              ベテラン准看護師は組織への影響力と知識・技術の継承を評価します
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
                  <Input type="text" id="experience" placeholder="例：15年目" />
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
                    <Label htmlFor="special-roles">特別な役割</Label>
                    <Input type="text" id="special-roles" placeholder="例：教育委員、安全管理者" />
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
                  組織文化の醸成と次世代育成を中心に評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 組織文化への影響力</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="culture-s" />
                        <Label htmlFor="culture-s" className="font-normal">
                          <span className="font-semibold">S：</span> 組織文化の形成に中心的役割を果たし、全体に好影響
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="culture-a" />
                        <Label htmlFor="culture-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的に組織文化の向上に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="culture-b" />
                        <Label htmlFor="culture-b" className="font-normal">
                          <span className="font-semibold">B：</span> 良好な組織文化の維持に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="culture-c" />
                        <Label htmlFor="culture-c" className="font-normal">
                          <span className="font-semibold">C：</span> 組織への影響力が限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="culture-d" />
                        <Label htmlFor="culture-d" className="font-normal">
                          <span className="font-semibold">D：</span> 組織に負の影響を与える場面がある
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 知識・技術の継承</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="succession-s" />
                        <Label htmlFor="succession-s" className="font-normal">
                          <span className="font-semibold">S：</span> 体系的な継承システムを構築し、多くの後継者を育成
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="succession-a" />
                        <Label htmlFor="succession-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的に知識・技術を伝承し、後進の成長に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="succession-b" />
                        <Label htmlFor="succession-b" className="font-normal">
                          <span className="font-semibold">B：</span> 求められれば知識・技術を共有
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="succession-c" />
                        <Label htmlFor="succession-c" className="font-normal">
                          <span className="font-semibold">C：</span> 知識・技術の継承に消極的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="succession-d" />
                        <Label htmlFor="succession-d" className="font-normal">
                          <span className="font-semibold">D：</span> 知識・技術を独占し、継承を拒む
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 組織変革への適応と貢献</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="change-s" />
                        <Label htmlFor="change-s" className="font-normal">
                          <span className="font-semibold">S：</span> 変革をリードし、他職員の適応を支援
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="change-a" />
                        <Label htmlFor="change-a" className="font-normal">
                          <span className="font-semibold">A：</span> 柔軟に変化に対応し、前向きに取り組む
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="change-b" />
                        <Label htmlFor="change-b" className="font-normal">
                          <span className="font-semibold">B：</span> 必要な変化を受け入れ、協力的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="change-c" />
                        <Label htmlFor="change-c" className="font-normal">
                          <span className="font-semibold">C：</span> 変化への適応に時間を要する
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="change-d" />
                        <Label htmlFor="change-d" className="font-normal">
                          <span className="font-semibold">D：</span> 変化に抵抗し、組織の発展を妨げる
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
                    placeholder="組織への影響、知識継承の実績、変革への対応など"
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
                  卓越した実践能力と法人への貢献を中心に評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 卓越した准看護実践</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="mastery-s" />
                        <Label htmlFor="mastery-s" className="font-normal">
                          <span className="font-semibold">S：</span> 准看護実践の最高峰として法人内外で認められる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="mastery-a" />
                        <Label htmlFor="mastery-a" className="font-normal">
                          <span className="font-semibold">A：</span> 卓越した実践能力で他の模範となる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="mastery-b" />
                        <Label htmlFor="mastery-b" className="font-normal">
                          <span className="font-semibold">B：</span> ベテランとして期待される実践能力を維持
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="mastery-c" />
                        <Label htmlFor="mastery-c" className="font-normal">
                          <span className="font-semibold">C：</span> 実践能力の維持に課題がある
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="mastery-d" />
                        <Label htmlFor="mastery-d" className="font-normal">
                          <span className="font-semibold">D：</span> ベテランとして期待される水準に達していない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 法人戦略への貢献</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="strategy-s" />
                        <Label htmlFor="strategy-s" className="font-normal">
                          <span className="font-semibold">S：</span> 法人の戦略立案に参画し、実現に大きく貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="strategy-a" />
                        <Label htmlFor="strategy-a" className="font-normal">
                          <span className="font-semibold">A：</span> 法人の方針を深く理解し、積極的に推進
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="strategy-b" />
                        <Label htmlFor="strategy-b" className="font-normal">
                          <span className="font-semibold">B：</span> 法人の方針に協力的に取り組む
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="strategy-c" />
                        <Label htmlFor="strategy-c" className="font-normal">
                          <span className="font-semibold">C：</span> 法人戦略への関心が低い
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="strategy-d" />
                        <Label htmlFor="strategy-d" className="font-normal">
                          <span className="font-semibold">D：</span> 法人の方針に反する行動をとる
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 外部への影響力</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="external-s" />
                        <Label htmlFor="external-s" className="font-normal">
                          <span className="font-semibold">S：</span> 地域や業界において准看護師の代表として活動
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="external-a" />
                        <Label htmlFor="external-a" className="font-normal">
                          <span className="font-semibold">A：</span> 外部活動に参加し、法人の評価向上に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="external-b" />
                        <Label htmlFor="external-b" className="font-normal">
                          <span className="font-semibold">B：</span> 求められれば外部活動に協力
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="external-c" />
                        <Label htmlFor="external-c" className="font-normal">
                          <span className="font-semibold">C：</span> 外部活動への参加に消極的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="external-d" />
                        <Label htmlFor="external-d" className="font-normal">
                          <span className="font-semibold">D：</span> 外部への影響力がない
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
                    placeholder="卓越した実践例、法人戦略への貢献、外部での活動など"
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
                    <p className="text-sm text-gray-600">組織影響力・知識継承</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">法人内評価</h4>
                    <p className="text-2xl font-bold text-green-600">B</p>
                    <p className="text-sm text-gray-600">卓越した実践・戦略貢献</p>
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
                        <RadioGroupItem value="master-leader" id="type-master" />
                        <Label htmlFor="type-master" className="font-normal">
                          マスター型（両軸でS・A）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="mentor" id="type-mentor" />
                        <Label htmlFor="type-mentor" className="font-normal">
                          メンター型（施設評価が高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="expert" id="type-expert" />
                        <Label htmlFor="type-expert" className="font-normal">
                          エキスパート型（法人評価が高い）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="stable" id="type-stable" />
                        <Label htmlFor="type-stable" className="font-normal">
                          安定貢献型（両軸でB）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="refresh-needed" id="type-refresh" />
                        <Label htmlFor="type-refresh" className="font-normal">
                          再活性化必要型（両軸でC以下）
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="overall-assessment">総合所見</Label>
                  <Textarea 
                    id="overall-assessment" 
                    placeholder="ベテラン准看護師としての総合評価、組織への貢献、今後の活躍など"
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 育成計画タブ */}
            <TabsContent value="development" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">個別活用計画</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="strengths">特に優れている点・活用すべき強み</Label>
                  <Textarea 
                    id="strengths" 
                    placeholder="豊富な経験、専門知識、人脈、組織への影響力など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="activation-areas">活性化・改善が必要な領域</Label>
                  <Textarea 
                    id="activation-areas" 
                    placeholder="新しい取り組みへの適応、モチベーション向上など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="special-mission">特別ミッション・期待する役割</Label>
                  <Textarea 
                    id="special-mission" 
                    placeholder="准看護師教育の体系化、新人教育プログラムの開発、地域連携など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="succession-plan">知識・技術継承計画</Label>
                  <Textarea 
                    id="succession-plan" 
                    placeholder="マニュアル作成、勉強会講師、メンタリング活動など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="career-transition">今後のキャリア展望</Label>
                  <Textarea 
                    id="career-transition" 
                    placeholder="専門アドバイザー、教育専任、管理職への転換など"
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