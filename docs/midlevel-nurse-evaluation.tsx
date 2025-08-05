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

export default function MidlevelNurseEvaluation() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            中堅看護師（4-10年） 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            リーダーシップと専門性向上を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              中堅看護師はリーダーシップ、後輩指導、専門性の深化を重点的に評価します
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
                    <Label htmlFor="department">所属部署</Label>
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
                    <Label htmlFor="specialty">専門領域</Label>
                    <Input type="text" id="specialty" placeholder="救急看護 / がん看護" />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 施設内評価タブ */}
            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設内評価（中堅層での相対評価）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  中堅看護師としての役割遂行とチームへの影響力を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. チームリーダーシップ</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="leadership-s" />
                        <Label htmlFor="leadership-s" className="font-normal">
                          <span className="font-semibold">S：</span> 卓越したリーダーシップで部署全体に好影響
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="leadership-a" />
                        <Label htmlFor="leadership-a" className="font-normal">
                          <span className="font-semibold">A：</span> 優れたリーダーシップを発揮し、チームを牽引
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="leadership-b" />
                        <Label htmlFor="leadership-b" className="font-normal">
                          <span className="font-semibold">B：</span> 期待されるリーダー役割を適切に遂行
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="leadership-c" />
                        <Label htmlFor="leadership-c" className="font-normal">
                          <span className="font-semibold">C：</span> リーダーシップの発揮が不十分
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="leadership-d" />
                        <Label htmlFor="leadership-d" className="font-normal">
                          <span className="font-semibold">D：</span> リーダー役割の遂行に課題
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 後輩指導・育成</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="mentoring-s" />
                        <Label htmlFor="mentoring-s" className="font-normal">
                          <span className="font-semibold">S：</span> 極めて優れた指導力、多数の優秀な後輩を育成
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="mentoring-a" />
                        <Label htmlFor="mentoring-a" className="font-normal">
                          <span className="font-semibold">A：</span> 効果的な指導で後輩の成長に大きく貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="mentoring-b" />
                        <Label htmlFor="mentoring-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的な後輩指導を実施
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="mentoring-c" />
                        <Label htmlFor="mentoring-c" className="font-normal">
                          <span className="font-semibold">C：</span> 後輩指導に消極的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="mentoring-d" />
                        <Label htmlFor="mentoring-d" className="font-normal">
                          <span className="font-semibold">D：</span> 後輩指導に重大な問題
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 業務改善・提案力</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="improvement-s" />
                        <Label htmlFor="improvement-s" className="font-normal">
                          <span className="font-semibold">S：</span> 革新的な改善提案で部署の発展に大きく貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="improvement-a" />
                        <Label htmlFor="improvement-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的な改善提案と実行力
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="improvement-b" />
                        <Label htmlFor="improvement-b" className="font-normal">
                          <span className="font-semibold">B：</span> 求められる改善活動に参画
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="improvement-c" />
                        <Label htmlFor="improvement-c" className="font-normal">
                          <span className="font-semibold">C：</span> 改善活動への参加が消極的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="improvement-d" />
                        <Label htmlFor="improvement-d" className="font-normal">
                          <span className="font-semibold">D：</span> 改善意識が低い
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
                <h3 className="font-bold text-lg mb-2">法人内評価（専門性・実践力の絶対評価）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  中堅看護師としての専門知識・技術・実践力を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 専門看護技術</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="expertise-s" />
                        <Label htmlFor="expertise-s" className="font-normal">
                          <span className="font-semibold">S：</span> 専門分野で法人内トップレベルの技術
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="expertise-a" />
                        <Label htmlFor="expertise-a" className="font-normal">
                          <span className="font-semibold">A：</span> 高度な専門技術を持ち、困難事例にも対応
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="expertise-b" />
                        <Label htmlFor="expertise-b" className="font-normal">
                          <span className="font-semibold">B：</span> 中堅として期待される技術水準を保持
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="expertise-c" />
                        <Label htmlFor="expertise-c" className="font-normal">
                          <span className="font-semibold">C：</span> 専門技術の向上が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="expertise-d" />
                        <Label htmlFor="expertise-d" className="font-normal">
                          <span className="font-semibold">D：</span> 中堅として技術が不十分
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 臨床判断力・問題解決力</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="judgment-s" />
                        <Label htmlFor="judgment-s" className="font-normal">
                          <span className="font-semibold">S：</span> 極めて優れた判断力、複雑な問題も迅速解決
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="judgment-a" />
                        <Label htmlFor="judgment-a" className="font-normal">
                          <span className="font-semibold">A：</span> 的確な判断と効果的な問題解決
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="judgment-b" />
                        <Label htmlFor="judgment-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的な判断力と問題解決能力
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="judgment-c" />
                        <Label htmlFor="judgment-c" className="font-normal">
                          <span className="font-semibold">C：</span> 判断力・問題解決に改善余地
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="judgment-d" />
                        <Label htmlFor="judgment-d" className="font-normal">
                          <span className="font-semibold">D：</span> 判断ミスや問題解決の遅れが頻発
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 教育・研究活動</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="education-s" />
                        <Label htmlFor="education-s" className="font-normal">
                          <span className="font-semibold">S：</span> 院内外で講師、学会発表など積極的活動
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="education-a" />
                        <Label htmlFor="education-a" className="font-normal">
                          <span className="font-semibold">A：</span> 院内教育への積極的貢献、研究参加
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="education-b" />
                        <Label htmlFor="education-b" className="font-normal">
                          <span className="font-semibold">B：</span> 求められる教育活動に参加
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="education-c" />
                        <Label htmlFor="education-c" className="font-normal">
                          <span className="font-semibold">C：</span> 教育・研究活動への参加が少ない
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="education-d" />
                        <Label htmlFor="education-d" className="font-normal">
                          <span className="font-semibold">D：</span> 教育・研究活動に不参加
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

            {/* リーダーシップタブ */}
            <TabsContent value="leadership" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">リーダーシップ実績・役割遂行</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">現在担っている役割</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox id="role-leader" />
                      <Label htmlFor="role-leader" className="ml-2">チームリーダー</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="role-preceptor" />
                      <Label htmlFor="role-preceptor" className="ml-2">プリセプター</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="role-committee" />
                      <Label htmlFor="role-committee" className="ml-2">委員会メンバー・リーダー</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="role-project" />
                      <Label htmlFor="role-project" className="ml-2">プロジェクトリーダー</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="role-trainer" />
                      <Label htmlFor="role-trainer" className="ml-2">院内研修講師</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="leadership-achievements">リーダーシップ発揮の具体例</Label>
                  <Textarea 
                    id="leadership-achievements" 
                    placeholder="チーム運営、問題解決、後輩育成などの具体的実績"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="mentoring-record">後輩指導実績</Label>
                  <Textarea 
                    id="mentoring-record" 
                    placeholder="指導した後輩の人数、成長度、具体的な指導内容など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="innovation">業務改善・革新的取り組み</Label>
                  <Textarea 
                    id="innovation" 
                    placeholder="提案・実施した改善活動とその成果"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3">専門性向上への取り組み</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox id="cert-prep" />
                      <Label htmlFor="cert-prep" className="ml-2">認定看護師資格取得準備中</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="cert-obtained" />
                      <Label htmlFor="cert-obtained" className="ml-2">認定看護師資格取得済</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="academic" />
                      <Label htmlFor="academic" className="ml-2">大学院進学・学位取得</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="conference" />
                      <Label htmlFor="conference" className="ml-2">学会発表・論文執筆</Label>
                    </div>
                  </div>
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
                    <p className="text-sm text-gray-600">リーダーシップ・影響力</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">法人内評価</h4>
                    <p className="text-2xl font-bold text-green-600">A</p>
                    <p className="text-sm text-gray-600">専門性・実践力</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <h4 className="font-semibold mb-2">総合評価</h4>
                  <p className="text-3xl font-bold text-orange-600">A+</p>
                  <p className="text-sm text-gray-600 mt-2">
                    次期リーダー候補として期待
                  </p>
                </div>

                <div className="mt-6">
                  <Label htmlFor="overall-assessment">総合所見</Label>
                  <Textarea 
                    id="overall-assessment" 
                    placeholder="中堅看護師としての総合的な評価、強み、今後の期待など"
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 育成計画タブ */}
            <TabsContent value="development" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">キャリア開発・育成計画</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="career-vision">本人のキャリアビジョン</Label>
                  <Textarea 
                    id="career-vision" 
                    placeholder="将来目指す姿、希望するキャリアパスなど"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3">推奨キャリアパス</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="management" id="path-management" />
                        <Label htmlFor="path-management">管理職コース（主任→師長）</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="specialist" id="path-specialist" />
                        <Label htmlFor="path-specialist">スペシャリストコース（認定・専門看護師）</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="educator" id="path-educator" />
                        <Label htmlFor="path-educator">教育者コース（教育担当・実習指導者）</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="generalist" id="path-generalist" />
                        <Label htmlFor="path-generalist">ジェネラリストコース（多領域経験）</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="development-plan">今後1-2年の具体的育成計画</Label>
                  <Textarea 
                    id="development-plan" 
                    placeholder="研修参加、資格取得支援、役割付与など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="stretch-assignment">ストレッチアサインメント</Label>
                  <Textarea 
                    id="stretch-assignment" 
                    placeholder="成長を促す挑戦的な役割・プロジェクトなど"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3">必要な支援</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox id="support-time" />
                      <Label htmlFor="support-time" className="ml-2">研修・学習時間の確保</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="support-financial" />
                      <Label htmlFor="support-financial" className="ml-2">資格取得の経済的支援</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="support-mentor" />
                      <Label htmlFor="support-mentor" className="ml-2">上級者によるメンタリング</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="support-opportunity" />
                      <Label htmlFor="support-opportunity" className="ml-2">キャリアアップの機会提供</Label>
                    </div>
                  </div>
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