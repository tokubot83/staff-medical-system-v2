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

export default function VeteranNurseEvaluation() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            ベテラン看護師（11年以上） 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            組織貢献と知識継承を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              ベテラン看護師は高度な実践力、組織への貢献、次世代育成を重点的に評価します
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="facility">施設内評価</TabsTrigger>
              <TabsTrigger value="corporate">法人内評価</TabsTrigger>
              <TabsTrigger value="contribution">組織貢献</TabsTrigger>
              <TabsTrigger value="matrix">総合判定</TabsTrigger>
              <TabsTrigger value="succession">継承計画</TabsTrigger>
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
                    <Label htmlFor="department">所属部署</Label>
                    <Input type="text" id="department" />
                  </div>
                  <div>
                    <Label htmlFor="experience">経験年数</Label>
                    <Input type="text" id="experience" placeholder="15年" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="current-role">現在の主な役割</Label>
                    <Input type="text" id="current-role" placeholder="エキスパートナース / 教育担当" />
                  </div>
                  <div>
                    <Label htmlFor="certifications">保有資格</Label>
                    <Input type="text" id="certifications" placeholder="認定看護師 / 専門看護師" />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 施設内評価タブ */}
            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設内評価（ベテラン層での相対評価）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  施設の要としての役割と影響力を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 組織の中核としての役割</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="core-s" />
                        <Label htmlFor="core-s" className="font-normal">
                          <span className="font-semibold">S：</span> 施設の要として不可欠な存在、組織全体に大きな影響
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="core-a" />
                        <Label htmlFor="core-a" className="font-normal">
                          <span className="font-semibold">A：</span> 重要な役割を担い、組織に大きく貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="core-b" />
                        <Label htmlFor="core-b" className="font-normal">
                          <span className="font-semibold">B：</span> ベテランとして期待される役割を遂行
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="core-c" />
                        <Label htmlFor="core-c" className="font-normal">
                          <span className="font-semibold">C：</span> 役割遂行が期待を下回る
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="core-d" />
                        <Label htmlFor="core-d" className="font-normal">
                          <span className="font-semibold">D：</span> ベテランとしての役割が果たせていない
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
                          <span className="font-semibold">S：</span> 卓越した指導力で多数の優秀な人材を育成
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="succession-a" />
                        <Label htmlFor="succession-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的に知識・技術を継承し、後進育成に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="succession-b" />
                        <Label htmlFor="succession-b" className="font-normal">
                          <span className="font-semibold">B：</span> 求められる継承活動を実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="succession-c" />
                        <Label htmlFor="succession-c" className="font-normal">
                          <span className="font-semibold">C：</span> 知識継承への取り組みが不十分
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="succession-d" />
                        <Label htmlFor="succession-d" className="font-normal">
                          <span className="font-semibold">D：</span> 知識・技術の抱え込み
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 組織文化の醸成・維持</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="culture-s" />
                        <Label htmlFor="culture-s" className="font-normal">
                          <span className="font-semibold">S：</span> 組織文化の象徴的存在、職場全体の模範
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="culture-a" />
                        <Label htmlFor="culture-a" className="font-normal">
                          <span className="font-semibold">A：</span> 良い組織文化の形成に大きく貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="culture-b" />
                        <Label htmlFor="culture-b" className="font-normal">
                          <span className="font-semibold">B：</span> 組織文化の維持に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="culture-c" />
                        <Label htmlFor="culture-c" className="font-normal">
                          <span className="font-semibold">C：</span> 組織文化への貢献が限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="culture-d" />
                        <Label htmlFor="culture-d" className="font-normal">
                          <span className="font-semibold">D：</span> 組織文化に悪影響
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
                <h3 className="font-bold text-lg mb-2">法人内評価（エキスパートとしての絶対評価）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  法人全体でのエキスパートレベルの実践力・専門性を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 高度実践能力</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="practice-s" />
                        <Label htmlFor="practice-s" className="font-normal">
                          <span className="font-semibold">S：</span> 法人内最高レベルの実践能力、院外でも認知
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="practice-a" />
                        <Label htmlFor="practice-a" className="font-normal">
                          <span className="font-semibold">A：</span> 極めて高い実践能力、困難事例の最終対応者
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="practice-b" />
                        <Label htmlFor="practice-b" className="font-normal">
                          <span className="font-semibold">B：</span> ベテランとして期待される実践能力
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="practice-c" />
                        <Label htmlFor="practice-c" className="font-normal">
                          <span className="font-semibold">C：</span> 実践能力の維持・向上が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="practice-d" />
                        <Label htmlFor="practice-d" className="font-normal">
                          <span className="font-semibold">D：</span> 実践能力が期待水準を下回る
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 専門知識・エビデンス活用</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="knowledge-s" />
                        <Label htmlFor="knowledge-s" className="font-normal">
                          <span className="font-semibold">S：</span> 学会レベルの専門知識、研究・執筆活動
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="knowledge-a" />
                        <Label htmlFor="knowledge-a" className="font-normal">
                          <span className="font-semibold">A：</span> 深い専門知識とエビデンスに基づく実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="knowledge-b" />
                        <Label htmlFor="knowledge-b" className="font-normal">
                          <span className="font-semibold">B：</span> 十分な専門知識を保持
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="knowledge-c" />
                        <Label htmlFor="knowledge-c" className="font-normal">
                          <span className="font-semibold">C：</span> 知識のアップデートが不足
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="knowledge-d" />
                        <Label htmlFor="knowledge-d" className="font-normal">
                          <span className="font-semibold">D：</span> 専門知識が時代遅れ
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. コンサルテーション能力</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="consultation-s" />
                        <Label htmlFor="consultation-s" className="font-normal">
                          <span className="font-semibold">S：</span> 法人全体から頼られる相談役
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="consultation-a" />
                        <Label htmlFor="consultation-a" className="font-normal">
                          <span className="font-semibold">A：</span> 的確な助言・指導で問題解決に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="consultation-b" />
                        <Label htmlFor="consultation-b" className="font-normal">
                          <span className="font-semibold">B：</span> 適切なコンサルテーション対応
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="consultation-c" />
                        <Label htmlFor="consultation-c" className="font-normal">
                          <span className="font-semibold">C：</span> コンサルテーション能力が限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="consultation-d" />
                        <Label htmlFor="consultation-d" className="font-normal">
                          <span className="font-semibold">D：</span> 相談対応が不適切
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

            {/* 組織貢献タブ */}
            <TabsContent value="contribution" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">組織貢献実績</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">1. 教育・人材育成実績</h4>
                  <Textarea 
                    placeholder="プリセプター実績、研修講師、実習指導者、メンタリングなど具体的な実績"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 委員会・プロジェクト活動</h4>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center">
                      <Checkbox id="committee-leader" />
                      <Label htmlFor="committee-leader" className="ml-2">委員会委員長・リーダー</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="project-leader" />
                      <Label htmlFor="project-leader" className="ml-2">重要プロジェクトのリード</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="quality-improvement" />
                      <Label htmlFor="quality-improvement" className="ml-2">医療の質改善活動</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="safety-management" />
                      <Label htmlFor="safety-management" className="ml-2">医療安全推進活動</Label>
                    </div>
                  </div>
                  <Textarea 
                    placeholder="具体的な活動内容と成果"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 専門性による貢献</h4>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center">
                      <Checkbox id="certified-nurse" />
                      <Label htmlFor="certified-nurse" className="ml-2">認定看護師として活動</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="specialist-nurse" />
                      <Label htmlFor="specialist-nurse" className="ml-2">専門看護師として活動</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="external-lecturer" />
                      <Label htmlFor="external-lecturer" className="ml-2">院外講師・学会発表</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="publication" />
                      <Label htmlFor="publication" className="ml-2">論文執筆・専門誌寄稿</Label>
                    </div>
                  </div>
                  <Textarea 
                    placeholder="専門性を活かした具体的な活動と成果"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3">4. 組織横断的な活動</h4>
                  <Textarea 
                    placeholder="部署を超えた連携、法人全体への貢献など"
                    className="min-h-[80px]"
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
                    <p className="text-sm text-gray-600">エキスパート実践力</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <h4 className="font-semibold mb-2">総合評価</h4>
                  <p className="text-3xl font-bold text-orange-600">S</p>
                  <p className="text-sm text-gray-600 mt-2">
                    組織にとって極めて重要な人材
                  </p>
                </div>

                <div className="mt-6">
                  <Label htmlFor="overall-assessment">総合所見</Label>
                  <Textarea 
                    id="overall-assessment" 
                    placeholder="ベテラン看護師としての価値、組織への貢献度、今後の活用方針など"
                    className="min-h-[120px]"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3">今後の活用方針</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="expert" id="utilize-expert" />
                        <Label htmlFor="utilize-expert">エキスパートとして専門性を最大活用</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="educator" id="utilize-educator" />
                        <Label htmlFor="utilize-educator">教育専任として後進育成に注力</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="advisor" id="utilize-advisor" />
                        <Label htmlFor="utilize-advisor">アドバイザー・相談役として活用</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="flexible" id="utilize-flexible" />
                        <Label htmlFor="utilize-flexible">柔軟な勤務形態で経験を活用</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </TabsContent>

            {/* 継承計画タブ */}
            <TabsContent value="succession" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">知識・技術継承計画</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="unique-skills">保有する独自の知識・技術</Label>
                  <Textarea 
                    id="unique-skills" 
                    placeholder="長年の経験で培った独自のノウハウ、特殊技術、暗黙知など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="succession-priority">優先的に継承すべき内容</Label>
                  <Textarea 
                    id="succession-priority" 
                    placeholder="組織として失われると困る知識・技術を具体的に"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="succession-method">継承方法・計画</Label>
                  <Textarea 
                    id="succession-method" 
                    placeholder="マニュアル化、動画作成、OJT、勉強会など具体的な方法"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="successor-candidate">後継者候補</Label>
                  <Textarea 
                    id="successor-candidate" 
                    placeholder="具体的な後継者の名前と育成計画"
                    className="min-h-[60px]"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3">今後のキャリアプラン</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox id="continue-current" />
                      <Label htmlFor="continue-current" className="ml-2">現在の役割を継続</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="transition-educator" />
                      <Label htmlFor="transition-educator" className="ml-2">教育・指導に特化</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="part-time" />
                      <Label htmlFor="part-time" className="ml-2">勤務形態の見直し（時短等）</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="special-assignment" />
                      <Label htmlFor="special-assignment" className="ml-2">特別任務・プロジェクト担当</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="motivation-support">モチベーション維持のための支援</Label>
                  <Textarea 
                    id="motivation-support" 
                    placeholder="やりがいを感じられる役割付与、待遇面での配慮など"
                    className="min-h-[80px]"
                  />
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