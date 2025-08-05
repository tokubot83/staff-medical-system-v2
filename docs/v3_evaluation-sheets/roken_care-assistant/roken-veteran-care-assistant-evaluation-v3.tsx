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

export default function VeteranCareAssistantEvaluationV3() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            老健 ベテラン介護士（11年目以上） 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            入所・通所サービス両部門対応 熟練者評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              豊富な経験の活用、施設への長期貢献、次世代への知識継承を重点評価します
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
                    <Label htmlFor="department">配属部門</Label>
                    <select id="department" className="w-full border rounded-md px-3 py-2">
                      <option value="">選択してください</option>
                      <option value="admission">入所サービス</option>
                      <option value="daycare">通所サービス</option>
                      <option value="both">入所・通所統括</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="expertise">専門分野・特技</Label>
                    <Input type="text" id="expertise" placeholder="例：認知症ケア、終末期ケア" />
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
                  施設全体への影響力と長期的貢献を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 施設全体への影響力・貢献</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="influence-s" />
                        <Label htmlFor="influence-s" className="font-normal">
                          <span className="font-semibold">S：</span> 施設の顔として地域に認知され、組織文化の中核的存在
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="influence-a" />
                        <Label htmlFor="influence-a" className="font-normal">
                          <span className="font-semibold">A：</span> 部門を超えて大きな影響力を持ち、施設の質向上に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="influence-b" />
                        <Label htmlFor="influence-b" className="font-normal">
                          <span className="font-semibold">B：</span> 安定した貢献を続け、施設運営に欠かせない存在
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="influence-c" />
                        <Label htmlFor="influence-c" className="font-normal">
                          <span className="font-semibold">C：</span> 影響力が限定的で、さらなる貢献が期待される
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="influence-d" />
                        <Label htmlFor="influence-d" className="font-normal">
                          <span className="font-semibold">D：</span> ベテランとしての役割を果たしていない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 次世代育成・知識継承</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="succession-s" />
                        <Label htmlFor="succession-s" className="font-normal">
                          <span className="font-semibold">S：</span> 体系的な知識継承システムを構築し、多くの後継者を育成
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="succession-a" />
                        <Label htmlFor="succession-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的に知識を継承し、優秀な人材を育成
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="succession-b" />
                        <Label htmlFor="succession-b" className="font-normal">
                          <span className="font-semibold">B：</span> 適切な知識継承を行っている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="succession-c" />
                        <Label htmlFor="succession-c" className="font-normal">
                          <span className="font-semibold">C：</span> 知識継承に消極的で、後進育成が不十分
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="succession-d" />
                        <Label htmlFor="succession-d" className="font-normal">
                          <span className="font-semibold">D：</span> 知識を抱え込み、継承を拒む
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 地域連携・外部活動</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="external-s" />
                        <Label htmlFor="external-s" className="font-normal">
                          <span className="font-semibold">S：</span> 地域介護の中心的人物として、施設の評判を大きく向上
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="external-a" />
                        <Label htmlFor="external-a" className="font-normal">
                          <span className="font-semibold">A：</span> 地域活動に積極参加し、施設の地位向上に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="external-b" />
                        <Label htmlFor="external-b" className="font-normal">
                          <span className="font-semibold">B：</span> 適切な地域連携を維持している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="external-c" />
                        <Label htmlFor="external-c" className="font-normal">
                          <span className="font-semibold">C：</span> 地域活動への参加が消極的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="external-d" />
                        <Label htmlFor="external-d" className="font-normal">
                          <span className="font-semibold">D：</span> 外部との関わりを避ける
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
                    placeholder="施設への長期貢献、人材育成実績、地域活動の具体例など"
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
                  熟練した専門性と経験の活用度を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 熟練技術と経験の活用</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="mastery-s" />
                        <Label htmlFor="mastery-s" className="font-normal">
                          <span className="font-semibold">S：</span> 卓越した技術と豊富な経験で、どんな困難事例も解決
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="mastery-a" />
                        <Label htmlFor="mastery-a" className="font-normal">
                          <span className="font-semibold">A：</span> 高い技術力と経験を活かし、質の高いケアを提供
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="mastery-b" />
                        <Label htmlFor="mastery-b" className="font-normal">
                          <span className="font-semibold">B：</span> ベテランとして期待される技術と経験を保持
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="mastery-c" />
                        <Label htmlFor="mastery-c" className="font-normal">
                          <span className="font-semibold">C：</span> 技術・経験の活用が不十分
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="mastery-d" />
                        <Label htmlFor="mastery-d" className="font-normal">
                          <span className="font-semibold">D：</span> 技術が時代遅れで、経験を活かしきれていない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 専門分野での深い知見</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="expertise-s" />
                        <Label htmlFor="expertise-s" className="font-normal">
                          <span className="font-semibold">S：</span> 専門分野のエキスパートとして、業界からも認知される
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="expertise-a" />
                        <Label htmlFor="expertise-a" className="font-normal">
                          <span className="font-semibold">A：</span> 専門分野で深い知見を持ち、施設の専門性を向上
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="expertise-b" />
                        <Label htmlFor="expertise-b" className="font-normal">
                          <span className="font-semibold">B：</span> 特定分野で専門性を発揮している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="expertise-c" />
                        <Label htmlFor="expertise-c" className="font-normal">
                          <span className="font-semibold">C：</span> 専門性の深化が不十分
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="expertise-d" />
                        <Label htmlFor="expertise-d" className="font-normal">
                          <span className="font-semibold">D：</span> 専門性が維持できていない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 利用者・家族との信頼関係</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="trust-s" />
                        <Label htmlFor="trust-s" className="font-normal">
                          <span className="font-semibold">S：</span> 利用者・家族から絶大な信頼を得て、施設の信用度を向上
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="trust-a" />
                        <Label htmlFor="trust-a" className="font-normal">
                          <span className="font-semibold">A：</span> 深い信頼関係を築き、安心感を提供
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="trust-b" />
                        <Label htmlFor="trust-b" className="font-normal">
                          <span className="font-semibold">B：</span> 良好な信頼関係を維持している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="trust-c" />
                        <Label htmlFor="trust-c" className="font-normal">
                          <span className="font-semibold">C：</span> 信頼関係の構築に課題がある
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="trust-d" />
                        <Label htmlFor="trust-d" className="font-normal">
                          <span className="font-semibold">D：</span> 利用者・家族からの信頼が低い
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
                    placeholder="熟練技術の活用例、専門知識の発揮、信頼関係の構築事例など"
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
                    <p className="text-sm text-gray-600">影響力・継承力</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">法人内評価</h4>
                    <p className="text-2xl font-bold text-green-600">B</p>
                    <p className="text-sm text-gray-600">熟練性・信頼度</p>
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
                  <h4 className="font-semibold mb-3">ベテラン職員タイプ</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="master" id="type-master" />
                        <Label htmlFor="type-master" className="font-normal">
                          マスター型（両軸でS・A、施設の宝）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="mentor" id="type-mentor" />
                        <Label htmlFor="type-mentor" className="font-normal">
                          指導者型（後進育成に優れる）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="specialist" id="type-specialist" />
                        <Label htmlFor="type-specialist" className="font-normal">
                          専門家型（特定分野での高い専門性）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="stable" id="type-stable" />
                        <Label htmlFor="type-stable" className="font-normal">
                          安定貢献型（両軸でB、堅実な存在）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="revitalize" id="type-revitalize" />
                        <Label htmlFor="type-revitalize" className="font-normal">
                          再活性化型（さらなる貢献の余地あり）
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="overall-assessment">総合所見</Label>
                  <Textarea
                    id="overall-assessment"
                    placeholder="ベテランとしての価値、長期貢献、今後の役割など"
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 育成計画タブ */}
            <TabsContent value="development" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">キャリア後期活用計画</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="legacy">長期貢献の価値・レガシー</Label>
                  <Textarea
                    id="legacy"
                    placeholder="施設への長期貢献、培った技術・知識、築いた関係など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="current-strengths">現在の強み・専門性</Label>
                  <Textarea
                    id="current-strengths"
                    placeholder="熟練技術、豊富な経験、利用者・家族との関係など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="knowledge-transfer">知識・技術の継承計画</Label>
                  <Textarea
                    id="knowledge-transfer"
                    placeholder="・マニュアル化・文書化\n・後進への直接指導\n・研修・勉強会の実施"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="new-roles">新たな役割・活用方法</Label>
                  <Textarea
                    id="new-roles"
                    placeholder="・専門分野のスペシャリスト\n・メンター・相談役\n・地域連携の担当"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="work-style">働き方の調整・配慮</Label>
                  <Textarea
                    id="work-style"
                    placeholder="勤務負荷の調整、得意分野への集中、メンター役への移行など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="motivation">モチベーション維持・向上策</Label>
                  <Textarea
                    id="motivation"
                    placeholder="やりがいのある役割、感謝の表現、成長の機会提供など"
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