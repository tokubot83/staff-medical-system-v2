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

export default function MidlevelNurseEvaluationV3() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            中堅看護師（4-10年） 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            リーダーシップと組織貢献を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              中堅看護師は専門性の発揮に加え、リーダーシップと部署・組織への貢献度を重点的に評価します
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="facility">施設内評価</TabsTrigger>
              <TabsTrigger value="corporate">法人内評価</TabsTrigger>
              <TabsTrigger value="leadership">リーダーシップ</TabsTrigger>
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
                    <Input type="text" id="experience" placeholder="7年" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="role">現在の役割</Label>
                    <Input type="text" id="role" placeholder="チームリーダー / プリセプター" />
                  </div>
                  <div>
                    <Label htmlFor="specialty">専門分野</Label>
                    <Input type="text" id="specialty" placeholder="急性期看護 / がん看護" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（主任）</Label>
                    <Input type="text" id="evaluator1" />
                  </div>
                  <div>
                    <Label htmlFor="evaluator2">2次評価者（師長）</Label>
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
                  リーダーシップ発揮と部署運営への貢献を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. リーダーシップ・影響力</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="leadership-s" />
                        <Label htmlFor="leadership-s" className="font-normal">
                          <span className="font-semibold">S：</span> 部署の中核として卓越したリーダーシップを発揮し、組織変革を主導
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="leadership-a" />
                        <Label htmlFor="leadership-a" className="font-normal">
                          <span className="font-semibold">A：</span> 優れたリーダーシップで部署に良い影響を与え、主任候補として期待
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="leadership-b" />
                        <Label htmlFor="leadership-b" className="font-normal">
                          <span className="font-semibold">B：</span> 期待される役割を果たし、適切にリーダーシップを発揮
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="leadership-c" />
                        <Label htmlFor="leadership-c" className="font-normal">
                          <span className="font-semibold">C：</span> リーダーシップの発揮が限定的で、影響力が小さい
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="leadership-d" />
                        <Label htmlFor="leadership-d" className="font-normal">
                          <span className="font-semibold">D：</span> リーダーシップが不足し、中堅としての役割を果たせていない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 後輩育成・知識継承</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="mentoring-s" />
                        <Label htmlFor="mentoring-s" className="font-normal">
                          <span className="font-semibold">S：</span> 教育プログラムを開発し、部署全体の育成体制構築に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="mentoring-a" />
                        <Label htmlFor="mentoring-a" className="font-normal">
                          <span className="font-semibold">A：</span> 優秀なプリセプターとして複数の後輩を成功に導いている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="mentoring-b" />
                        <Label htmlFor="mentoring-b" className="font-normal">
                          <span className="font-semibold">B：</span> 適切に後輩指導を行い、知識・技術を共有している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="mentoring-c" />
                        <Label htmlFor="mentoring-c" className="font-normal">
                          <span className="font-semibold">C：</span> 後輩指導は行うが、積極性や工夫が不足
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="mentoring-d" />
                        <Label htmlFor="mentoring-d" className="font-normal">
                          <span className="font-semibold">D：</span> 後輩育成への関与が少なく、知識継承が不十分
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 部署運営・改善への貢献</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="improvement-s" />
                        <Label htmlFor="improvement-s" className="font-normal">
                          <span className="font-semibold">S：</span> 革新的な改善を主導し、部署の効率・質を大幅に向上させた
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="improvement-a" />
                        <Label htmlFor="improvement-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的に改善提案を行い、実現に向けて主体的に行動
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="improvement-b" />
                        <Label htmlFor="improvement-b" className="font-normal">
                          <span className="font-semibold">B：</span> 委員会活動等で適切に貢献し、改善に協力
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="improvement-c" />
                        <Label htmlFor="improvement-c" className="font-normal">
                          <span className="font-semibold">C：</span> 最低限の参加にとどまり、主体的な貢献が少ない
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="improvement-d" />
                        <Label htmlFor="improvement-d" className="font-normal">
                          <span className="font-semibold">D：</span> 部署運営への関心が低く、改善活動への参加が不十分
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
                    placeholder="リーダーシップの発揮例、後輩育成の成果、改善活動の実績など"
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
                  専門性の発揮と法人全体への貢献を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 高度な看護実践・専門性</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="expertise-s" />
                        <Label htmlFor="expertise-s" className="font-normal">
                          <span className="font-semibold">S：</span> 専門分野で法人を代表するレベルの実践を展開し、外部からも評価
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="expertise-a" />
                        <Label htmlFor="expertise-a" className="font-normal">
                          <span className="font-semibold">A：</span> 高度な専門性を発揮し、困難事例の解決に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="expertise-b" />
                        <Label htmlFor="expertise-b" className="font-normal">
                          <span className="font-semibold">B：</span> 期待される専門性を持ち、安定した実践ができる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="expertise-c" />
                        <Label htmlFor="expertise-c" className="font-normal">
                          <span className="font-semibold">C：</span> 専門性の発揮が限定的で、さらなる向上が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="expertise-d" />
                        <Label htmlFor="expertise-d" className="font-normal">
                          <span className="font-semibold">D：</span> 中堅として期待される専門性が不足している
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 医療の質向上への貢献</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="quality-s" />
                        <Label htmlFor="quality-s" className="font-normal">
                          <span className="font-semibold">S：</span> 質向上の取り組みを主導し、法人全体の評価向上に寄与
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="quality-a" />
                        <Label htmlFor="quality-a" className="font-normal">
                          <span className="font-semibold">A：</span> エビデンスに基づく実践で、患者アウトカムを改善
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="quality-b" />
                        <Label htmlFor="quality-b" className="font-normal">
                          <span className="font-semibold">B：</span> 質の高いケアを安定して提供している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="quality-c" />
                        <Label htmlFor="quality-c" className="font-normal">
                          <span className="font-semibold">C：</span> 標準的なケアの提供にとどまる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="quality-d" />
                        <Label htmlFor="quality-d" className="font-normal">
                          <span className="font-semibold">D：</span> ケアの質に課題があり、改善が必要
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 法人活動・外部貢献</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="external-s" />
                        <Label htmlFor="external-s" className="font-normal">
                          <span className="font-semibold">S：</span> 学会発表や外部講師として法人の知名度向上に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="external-a" />
                        <Label htmlFor="external-a" className="font-normal">
                          <span className="font-semibold">A：</span> 法人内プロジェクトで中心的役割を果たし、成果を上げる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="external-b" />
                        <Label htmlFor="external-b" className="font-normal">
                          <span className="font-semibold">B：</span> 法人活動に適切に参加し、求められる役割を果たす
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="external-c" />
                        <Label htmlFor="external-c" className="font-normal">
                          <span className="font-semibold">C：</span> 法人活動への参加が限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="external-d" />
                        <Label htmlFor="external-d" className="font-normal">
                          <span className="font-semibold">D：</span> 法人活動への貢献がほとんどない
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
                    placeholder="専門的実践の成果、質向上への貢献、法人活動での実績など"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* リーダーシップタブ */}
            <TabsContent value="leadership" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">リーダーシップ実績・組織貢献</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">現在担っている役割・責任</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox id="team-leader" />
                      <Label htmlFor="team-leader" className="ml-2">チームリーダー（頻度：　回/月）</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="preceptor" />
                      <Label htmlFor="preceptor" className="ml-2">プリセプター（指導人数：　名）</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="committee" />
                      <Label htmlFor="committee" className="ml-2">委員会メンバー・リーダー</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="project" />
                      <Label htmlFor="project" className="ml-2">プロジェクトリーダー</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="instructor" />
                      <Label htmlFor="instructor" className="ml-2">院内研修講師</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="leadership-examples">リーダーシップ発揮の具体例</Label>
                  <Textarea 
                    id="leadership-examples" 
                    placeholder="チーム運営での成果、困難な状況での対応、組織への影響など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="mentoring-results">後輩育成の実績・成果</Label>
                  <Textarea 
                    id="mentoring-results" 
                    placeholder="プリセプティーの成長、育成プログラムの開発、教育への貢献など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="improvement-results">業務改善・効率化の実績</Label>
                  <Textarea 
                    id="improvement-results" 
                    placeholder="改善提案の内容、実施結果、効果測定など"
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
                    <p className="text-2xl font-bold text-blue-600">A</p>
                    <p className="text-sm text-gray-600">リーダーシップ・部署貢献</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">法人内評価</h4>
                    <p className="text-2xl font-bold text-green-600">A</p>
                    <p className="text-sm text-gray-600">専門性・組織貢献</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <h4 className="font-semibold mb-2">総合評価</h4>
                  <p className="text-3xl font-bold text-orange-600">A+</p>
                  <p className="text-sm text-gray-600 mt-2">
                    施設内評価A × 法人内評価A = 総合評価A+
                  </p>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">評価タイプ</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="management" id="type-management" />
                        <Label htmlFor="type-management" className="font-normal">
                          管理職候補型（両軸でS/A、リーダーシップ突出）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="specialist" id="type-specialist" />
                        <Label htmlFor="type-specialist" className="font-normal">
                          スペシャリスト型（法人評価S、専門性突出）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="balanced-leader" id="type-balanced" />
                        <Label htmlFor="type-balanced" className="font-normal">
                          バランス型リーダー（両軸でA以上）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="site-leader" id="type-site" />
                        <Label htmlFor="type-site" className="font-normal">
                          施設リーダー型（施設評価S/A）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="development" id="type-development" />
                        <Label htmlFor="type-development" className="font-normal">
                          成長支援型（いずれかC以下）
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="overall-assessment">総合所見</Label>
                  <Textarea 
                    id="overall-assessment" 
                    placeholder="中堅看護師としての成熟度、強み、組織への価値、今後の可能性など"
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 育成計画タブ */}
            <TabsContent value="development" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">個別育成・キャリア開発計画</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="strengths">特筆すべき強み・価値</Label>
                  <Textarea 
                    id="strengths" 
                    placeholder="リーダーシップ、専門性、後輩育成力、組織への影響力など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="growth-areas">さらなる成長のための課題</Label>
                  <Textarea 
                    id="growth-areas" 
                    placeholder="管理能力、より高度な専門性、視野の拡大など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="career-direction">推奨キャリアプラン（3-5年）</Label>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="management" id="career-management" />
                        <Label htmlFor="career-management">管理職コース（主任→師長）</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="specialist" id="career-specialist" />
                        <Label htmlFor="career-specialist">専門看護師・認定看護師コース</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="educator" id="career-educator" />
                        <Label htmlFor="career-educator">教育専任・指導者コース</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="generalist" id="career-generalist" />
                        <Label htmlFor="career-generalist">高度ジェネラリストコース</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="development-plan">具体的な育成計画</Label>
                  <Textarea 
                    id="development-plan" 
                    placeholder="管理研修への参加、認定資格取得支援、プロジェクトリーダー任命など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="retention-plan">定着・モチベーション維持策</Label>
                  <Textarea 
                    id="retention-plan" 
                    placeholder="キャリア面談、処遇改善、新たなチャレンジ機会の提供など"
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