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
import { Checkbox } from "@/components/ui/checkbox";

export default function VeteranNurseEvaluationV3() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            ベテラン看護師（11年以上） 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            専門性の活用と組織全体への貢献を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              ベテラン看護師は豊富な経験・専門性を組織のために活用し、知識継承と組織発展への貢献を評価します
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="facility">施設内評価</TabsTrigger>
              <TabsTrigger value="corporate">法人内評価</TabsTrigger>
              <TabsTrigger value="contribution">組織貢献実績</TabsTrigger>
              <TabsTrigger value="matrix">総合判定</TabsTrigger>
              <TabsTrigger value="succession">継承・活用計画</TabsTrigger>
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
                  <Input type="text" id="eval-period" placeholder="2025年度" />
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
                    <Label htmlFor="department">所属病棟</Label>
                    <Input type="text" id="department" />
                  </div>
                  <div>
                    <Label htmlFor="experience">経験年数</Label>
                    <Input type="text" id="experience" placeholder="15年" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="certifications">保有資格</Label>
                    <Input type="text" id="certifications" placeholder="認定看護師 / 専門看護師" />
                  </div>
                  <div>
                    <Label htmlFor="specialty">専門領域</Label>
                    <Input type="text" id="specialty" placeholder="救急看護 / 緩和ケア" />
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
                  組織の要としての役割・影響力を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 組織への影響力・存在価値</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="influence-s" />
                        <Label htmlFor="influence-s" className="font-normal">
                          <span className="font-semibold">S：</span> 組織にとって不可欠な存在で、病院文化の形成に大きく貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="influence-a" />
                        <Label htmlFor="influence-a" className="font-normal">
                          <span className="font-semibold">A：</span> 部署の精神的支柱として、組織に良い影響を与えている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="influence-b" />
                        <Label htmlFor="influence-b" className="font-normal">
                          <span className="font-semibold">B：</span> ベテランとして適切な役割を果たしている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="influence-c" />
                        <Label htmlFor="influence-c" className="font-normal">
                          <span className="font-semibold">C：</span> 経験を活かしきれず、影響力が限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="influence-d" />
                        <Label htmlFor="influence-d" className="font-normal">
                          <span className="font-semibold">D：</span> ベテランとしての役割を果たせていない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 知識・技術の継承活動</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="succession-s" />
                        <Label htmlFor="succession-s" className="font-normal">
                          <span className="font-semibold">S：</span> 組織的な教育体制を構築し、多くの後進を育成
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="succession-a" />
                        <Label htmlFor="succession-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的に知識・技術を共有し、後輩の成長に大きく貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="succession-b" />
                        <Label htmlFor="succession-b" className="font-normal">
                          <span className="font-semibold">B：</span> 求められれば適切に指導・助言を行う
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="succession-c" />
                        <Label htmlFor="succession-c" className="font-normal">
                          <span className="font-semibold">C：</span> 知識継承への関与が消極的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="succession-d" />
                        <Label htmlFor="succession-d" className="font-normal">
                          <span className="font-semibold">D：</span> 知識・技術の抱え込みが見られる
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 組織運営・改革への貢献</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="reform-s" />
                        <Label htmlFor="reform-s" className="font-normal">
                          <span className="font-semibold">S：</span> 長年の経験を活かし、組織改革を主導している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="reform-a" />
                        <Label htmlFor="reform-a" className="font-normal">
                          <span className="font-semibold">A：</span> 建設的な提案を行い、組織の発展に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="reform-b" />
                        <Label htmlFor="reform-b" className="font-normal">
                          <span className="font-semibold">B：</span> 組織活動に協力的に参加している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="reform-c" />
                        <Label htmlFor="reform-c" className="font-normal">
                          <span className="font-semibold">C：</span> 変化への抵抗感があり、消極的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="reform-d" />
                        <Label htmlFor="reform-d" className="font-normal">
                          <span className="font-semibold">D：</span> 組織の停滞要因となっている
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
                  <Label htmlFor="facility-comment">組織への貢献事例・評価コメント</Label>
                  <Textarea 
                    id="facility-comment" 
                    placeholder="組織文化への影響、後進育成の実績、改革への貢献など"
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
                  エキスパートレベルの実践と法人への貢献を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. エキスパート看護実践</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="expert-s" />
                        <Label htmlFor="expert-s" className="font-normal">
                          <span className="font-semibold">S：</span> 法人を代表する看護実践で、外部からも高く評価される
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="expert-a" />
                        <Label htmlFor="expert-a" className="font-normal">
                          <span className="font-semibold">A：</span> 最高難度の事例にも対応でき、他施設の相談にも応じる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="expert-b" />
                        <Label htmlFor="expert-b" className="font-normal">
                          <span className="font-semibold">B：</span> 高度な実践能力を維持し、安定したケアを提供
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="expert-c" />
                        <Label htmlFor="expert-c" className="font-normal">
                          <span className="font-semibold">C：</span> 実践能力は標準的で、特筆すべき成果がない
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="expert-d" />
                        <Label htmlFor="expert-d" className="font-normal">
                          <span className="font-semibold">D：</span> 最新の知識・技術への適応が遅れている
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 専門性による法人貢献</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="specialty-s" />
                        <Label htmlFor="specialty-s" className="font-normal">
                          <span className="font-semibold">S：</span> 専門分野で法人の看護の質を牽引し、ブランド力向上に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="specialty-a" />
                        <Label htmlFor="specialty-a" className="font-normal">
                          <span className="font-semibold">A：</span> 認定・専門資格を活用し、法人内の教育・実践を主導
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="specialty-b" />
                        <Label htmlFor="specialty-b" className="font-normal">
                          <span className="font-semibold">B：</span> 専門性を活かした貢献をしている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="specialty-c" />
                        <Label htmlFor="specialty-c" className="font-normal">
                          <span className="font-semibold">C：</span> 専門性の活用が限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="specialty-d" />
                        <Label htmlFor="specialty-d" className="font-normal">
                          <span className="font-semibold">D：</span> 専門性を組織のために活用できていない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 法人全体への貢献・外部活動</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="external-s" />
                        <Label htmlFor="external-s" className="font-normal">
                          <span className="font-semibold">S：</span> 学会役員や外部講師として法人の評価を高めている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="external-a" />
                        <Label htmlFor="external-a" className="font-normal">
                          <span className="font-semibold">A：</span> 法人横断的なプロジェクトで中心的役割を果たす
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="external-b" />
                        <Label htmlFor="external-b" className="font-normal">
                          <span className="font-semibold">B：</span> 法人活動に積極的に参加している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="external-c" />
                        <Label htmlFor="external-c" className="font-normal">
                          <span className="font-semibold">C：</span> 施設内活動にとどまっている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="external-d" />
                        <Label htmlFor="external-d" className="font-normal">
                          <span className="font-semibold">D：</span> 法人活動への参加がほとんどない
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
                  <Label htmlFor="corporate-comment">専門性発揮の具体例・評価コメント</Label>
                  <Textarea 
                    id="corporate-comment" 
                    placeholder="高度な実践例、専門性による貢献、外部活動での成果など"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 組織貢献実績タブ */}
            <TabsContent value="contribution" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">組織貢献実績（キャリアを通じて）</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">1. 人材育成実績</h4>
                  <Textarea 
                    placeholder="プリセプター実績（延べ人数）、管理職育成への貢献、教育プログラム開発など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 組織改革・業務改善実績</h4>
                  <Textarea 
                    placeholder="主導した改革プロジェクト、業務改善の成果、組織文化への影響など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 専門性による貢献</h4>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center">
                      <Checkbox id="certified" />
                      <Label htmlFor="certified" className="ml-2">認定看護師として活動（分野：　　　　）</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="specialist" />
                      <Label htmlFor="specialist" className="ml-2">専門看護師として活動（分野：　　　　）</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="instructor" />
                      <Label htmlFor="instructor" className="ml-2">外部講師・学会活動（回数：　回）</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="publication" />
                      <Label htmlFor="publication" className="ml-2">論文・書籍執筆（件数：　件）</Label>
                    </div>
                  </div>
                  <Textarea 
                    placeholder="専門性を活かした具体的な活動内容と成果"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3">4. 組織の歴史・文化継承</h4>
                  <Textarea 
                    placeholder="組織の価値観の継承、困難時期の支え、若手のメンタルサポートなど"
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
                    <p className="text-2xl font-bold text-blue-600">S</p>
                    <p className="text-sm text-gray-600">組織の要・影響力</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">法人内評価</h4>
                    <p className="text-2xl font-bold text-green-600">A</p>
                    <p className="text-sm text-gray-600">専門性・法人貢献</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <h4 className="font-semibold mb-2">総合評価</h4>
                  <p className="text-3xl font-bold text-orange-600">S</p>
                  <p className="text-sm text-gray-600 mt-2">
                    施設内評価S × 法人内評価A = 総合評価S
                  </p>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">評価タイプ</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="legend" id="type-legend" />
                        <Label htmlFor="type-legend" className="font-normal">
                          レジェンド型（両軸でS/A、組織の宝）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="master" id="type-master" />
                        <Label htmlFor="type-master" className="font-normal">
                          マスター型（法人評価S、専門性の極み）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="mentor" id="type-mentor" />
                        <Label htmlFor="type-mentor" className="font-normal">
                          メンター型（施設評価S、精神的支柱）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="steady" id="type-steady" />
                        <Label htmlFor="type-steady" className="font-normal">
                          安定貢献型（両軸でB以上）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="revitalize" id="type-revitalize" />
                        <Label htmlFor="type-revitalize" className="font-normal">
                          活性化必要型（いずれかC以下）
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="overall-assessment">総合所見</Label>
                  <Textarea 
                    id="overall-assessment" 
                    placeholder="組織への価値、今後の活用方針、特筆すべき貢献など"
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 継承・活用計画タブ */}
            <TabsContent value="succession" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">知識・技術継承と活用計画</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="unique-value">保有する独自の価値・ノウハウ</Label>
                  <Textarea 
                    id="unique-value" 
                    placeholder="長年の経験で培った特殊技術、判断力、人脈、組織の歴史など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="succession-priority">優先的に継承すべき内容</Label>
                  <Textarea 
                    id="succession-priority" 
                    placeholder="失われると組織に影響する知識・技術、特殊な対応方法など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="succession-method">継承方法・計画</Label>
                  <Textarea 
                    id="succession-method" 
                    placeholder="マニュアル化、動画教材作成、マンツーマン指導、勉強会開催など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="future-role">今後の活用方針</Label>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="expert-advisor" id="role-expert" />
                        <Label htmlFor="role-expert">エキスパート・アドバイザーとして活用</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="educator" id="role-educator" />
                        <Label htmlFor="role-educator">教育専任として後進育成に専念</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="consultant" id="role-consultant" />
                        <Label htmlFor="role-consultant">院内コンサルタントとして活用</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="flexible" id="role-flexible" />
                        <Label htmlFor="role-flexible">柔軟な勤務形態で専門性を活用</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="motivation-plan">モチベーション維持・処遇計画</Label>
                  <Textarea 
                    id="motivation-plan" 
                    placeholder="新たな役割付与、特別手当、勤務配慮、表彰制度など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="retirement-plan">退職までの活用計画（5年スパン）</Label>
                  <Textarea 
                    id="retirement-plan" 
                    placeholder="段階的な役割変更、継承スケジュール、最終的な貢献形態など"
                    className="min-h-[100px]"
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