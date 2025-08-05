'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ChiefNurse45MinInterview() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            病棟主任面談シート（45分版）
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            中間管理職としての総合的評価と次世代リーダー育成のための包括的面談
          </p>
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              各項目で選択式評価と詳細記述の両方を記入してください。
              管理能力開発と組織貢献の評価に活用されます。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="leadership">リーダーシップ</TabsTrigger>
              <TabsTrigger value="management">管理実践</TabsTrigger>
              <TabsTrigger value="contribution">組織貢献</TabsTrigger>
              <TabsTrigger value="career">キャリア</TabsTrigger>
              <TabsTrigger value="planning">育成計画</TabsTrigger>
            </TabsList>

            {/* 基本情報タブ */}
            <TabsContent value="basic" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">面談日</Label>
                  <Input type="date" id="date" />
                </div>
                <div>
                  <Label htmlFor="time">面談時間</Label>
                  <Input type="text" id="time" placeholder="14:00-14:45" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="interviewer">面談者</Label>
                  <Input type="text" id="interviewer" />
                </div>
                <div>
                  <Label htmlFor="place">面談場所</Label>
                  <Input type="text" id="place" />
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-3">病棟主任情報</h3>
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
                    <Label htmlFor="ward">担当病棟</Label>
                    <Input type="text" id="ward" />
                  </div>
                  <div>
                    <Label htmlFor="chief-years">主任経験年数</Label>
                    <Input type="text" id="chief-years" placeholder="5年" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="team-size">チーム規模</Label>
                    <Input type="text" id="team-size" placeholder="20名" />
                  </div>
                  <div>
                    <Label htmlFor="nursing-years">看護師経験年数</Label>
                    <Input type="text" id="nursing-years" placeholder="12年" />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="qualifications">保有資格・認定</Label>
                  <Textarea 
                    id="qualifications" 
                    placeholder="専門資格、認定、研修履歴など"
                    className="min-h-[60px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* リーダーシップタブ（10分） */}
            <TabsContent value="leadership" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">1. リーダーシップの発揮（5分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">リーダーシップ能力評価</Label>
                    <div className="space-y-3 mt-3">
                      {[
                        { id: 'vision', label: 'ビジョン提示' },
                        { id: 'motivation', label: 'メンバー動機付け' },
                        { id: 'decision', label: '意思決定力' },
                        { id: 'communication', label: 'コミュニケーション' },
                        { id: 'influence', label: '影響力' }
                      ].map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <span className="text-sm">{item.label}</span>
                          <RadioGroup className="flex space-x-2">
                            {[5, 4, 3, 2, 1].map((value) => (
                              <div key={value} className="flex items-center">
                                <RadioGroupItem value={`${item.id}-${value}`} id={`${item.id}-${value}`} />
                                <Label htmlFor={`${item.id}-${value}`} className="ml-1 text-xs">{value}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 mt-2">5:卓越 4:優秀 3:標準 2:発展途上 1:要改善</p>
                  </div>

                  <div>
                    <Label htmlFor="leadership-style">リーダーシップスタイル</Label>
                    <Textarea 
                      id="leadership-style" 
                      placeholder="自身のリーダーシップの特徴、強み、改善点"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">
                      リーダーシップ発揮の具体例
                    </Label>
                    <Textarea 
                      id="leadership-examples" 
                      placeholder="チーム変革、困難克服、成果達成などの事例"
                      className="min-h-[100px] mt-2"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">2. チームビルディング（5分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="team-culture">チーム文化の醸成</Label>
                    <Textarea 
                      id="team-culture" 
                      placeholder="価値観共有、風土づくり、心理的安全性など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="team-performance">チームパフォーマンス</Label>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm w-16">低い</span>
                      <Slider 
                        defaultValue={[70]} 
                        max={100} 
                        step={10}
                        className="flex-1"
                      />
                      <span className="text-sm w-16">高い</span>
                    </div>
                    <Textarea 
                      id="team-performance-detail" 
                      placeholder="チームの強み、課題、改善の取り組み"
                      className="min-h-[60px] mt-3"
                    />
                  </div>

                  <div>
                    <Label htmlFor="diversity-management">多様性マネジメント</Label>
                    <Textarea 
                      id="diversity-management" 
                      placeholder="世代間ギャップ、価値観の違い、個性の活用など"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 管理実践タブ（8分） */}
            <TabsContent value="management" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">3. 業務管理と効率化（4分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">管理業務の実践</Label>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div className="flex items-center">
                        <Checkbox id="schedule-opt" />
                        <Label htmlFor="schedule-opt" className="ml-2">シフト最適化</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="resource-mgmt" />
                        <Label htmlFor="resource-mgmt" className="ml-2">リソース管理</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="quality-ctrl" />
                        <Label htmlFor="quality-ctrl" className="ml-2">品質管理</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="cost-aware" />
                        <Label htmlFor="cost-aware" className="ml-2">コスト意識</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="data-analysis" />
                        <Label htmlFor="data-analysis" className="ml-2">データ分析</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="process-improve" />
                        <Label htmlFor="process-improve" className="ml-2">プロセス改善</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="efficiency-initiatives">業務効率化の取り組み</Label>
                    <Textarea 
                      id="efficiency-initiatives" 
                      placeholder="実施した改善活動、成果、今後の計画"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="digital-utilization">デジタル化・IT活用</Label>
                    <Textarea 
                      id="digital-utilization" 
                      placeholder="システム活用、デジタル化推進、新技術導入など"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">4. スタッフ育成（4分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="staff-development">育成活動の実績</Label>
                    <Textarea 
                      id="staff-development" 
                      placeholder="新人教育、スキルアップ支援、キャリア相談など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">
                      育成の成功事例
                    </Label>
                    <Textarea 
                      id="development-success" 
                      placeholder="具体的な成長事例、育成の工夫、成果"
                      className="min-h-[80px] mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="education-programs">教育プログラムの企画・実施</Label>
                    <Textarea 
                      id="education-programs" 
                      placeholder="勉強会、研修、OJTプログラムなど"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 組織貢献タブ（8分） */}
            <TabsContent value="contribution" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">5. 師長との協働と補佐（4分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">師長補佐の実践度</Label>
                    <RadioGroup className="grid grid-cols-5 gap-3 mt-3">
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="5" id="support-5" />
                        <Label htmlFor="support-5" className="mt-1 text-sm">卓越</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="4" id="support-4" />
                        <Label htmlFor="support-4" className="mt-1 text-sm">優秀</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="3" id="support-3" />
                        <Label htmlFor="support-3" className="mt-1 text-sm">標準</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="2" id="support-2" />
                        <Label htmlFor="support-2" className="mt-1 text-sm">発展途上</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="1" id="support-1" />
                        <Label htmlFor="support-1" className="mt-1 text-sm">要改善</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="delegation-handling">権限委譲への対応</Label>
                    <Textarea 
                      id="delegation-handling" 
                      placeholder="委譲された業務、判断の適切性、成果"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="absence-management">師長不在時のマネジメント</Label>
                    <Textarea 
                      id="absence-management" 
                      placeholder="対応事例、判断基準、チーム運営など"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">6. 組織への貢献（4分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>委員会・プロジェクト活動</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="committee-safety" />
                        <Label htmlFor="committee-safety" className="ml-2">医療安全委員会</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="committee-quality" />
                        <Label htmlFor="committee-quality" className="ml-2">看護の質委員会</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="committee-education" />
                        <Label htmlFor="committee-education" className="ml-2">教育委員会</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="committee-other" />
                        <Label htmlFor="committee-other" className="ml-2">その他</Label>
                      </div>
                    </div>
                    <Textarea 
                      id="committee-contribution" 
                      placeholder="具体的な活動内容、貢献、成果"
                      className="min-h-[60px] mt-2"
                    />
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">
                      組織改善への提案（3つまで）
                    </Label>
                    <Textarea 
                      id="improvement-proposals" 
                      placeholder="1. \n2. \n3. "
                      className="min-h-[100px] mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="innovation-ideas">イノベーションアイデア</Label>
                    <Textarea 
                      id="innovation-ideas" 
                      placeholder="新しい取り組み、変革案、将来構想など"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* キャリアタブ（9分） */}
            <TabsContent value="career" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">7. 自己評価と成長（4分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">管理者としての成熟度</Label>
                    <div className="flex items-center space-x-4 mt-3">
                      <span className="text-sm w-20">初級</span>
                      <Slider 
                        defaultValue={[60]} 
                        max={100} 
                        step={10}
                        className="flex-1"
                      />
                      <span className="text-sm w-20">熟練</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="strengths-weaknesses">強みと改善点</Label>
                    <Textarea 
                      id="strengths-weaknesses" 
                      placeholder="自己分析：得意分野、苦手分野、成長実感"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="work-life-balance">ワークライフバランス</Label>
                    <Textarea 
                      id="work-life-balance" 
                      placeholder="業務負担、プライベートとの両立、ストレス管理"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">8. キャリアビジョン（5分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">5年後の理想像</Label>
                    <RadioGroup className="space-y-2 mt-3">
                      <div className="flex items-center">
                        <RadioGroupItem value="head-nurse" id="vision-head" />
                        <Label htmlFor="vision-head" className="ml-2">
                          師長として病棟を統括
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="specialist-leader" id="vision-specialist" />
                        <Label htmlFor="vision-specialist" className="ml-2">
                          専門分野のリーダー
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="educator" id="vision-educator" />
                        <Label htmlFor="vision-educator" className="ml-2">
                          教育・育成のスペシャリスト
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="master-chief" id="vision-master" />
                        <Label htmlFor="vision-master" className="ml-2">
                          主任のエキスパート
                        </Label>
                      </div>
                    </RadioGroup>
                    <Textarea 
                      id="vision-detail" 
                      placeholder="具体的な目標、実現への道筋"
                      className="min-h-[60px] mt-3"
                    />
                  </div>

                  <div>
                    <Label htmlFor="career-preparation">キャリア準備状況</Label>
                    <Textarea 
                      id="career-preparation" 
                      placeholder="必要な経験、スキル、資格の取得計画"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mentor-needs">メンタリング・コーチングニーズ</Label>
                    <Textarea 
                      id="mentor-needs" 
                      placeholder="相談したいこと、学びたいことなど"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 育成計画タブ（10分） */}
            <TabsContent value="planning" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">9. 育成計画（5分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>必要な育成支援（優先順位順）</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="train-management" />
                        <Label htmlFor="train-management" className="ml-2">管理者研修（上級）</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="train-leadership" />
                        <Label htmlFor="train-leadership" className="ml-2">リーダーシップ開発</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="train-finance" />
                        <Label htmlFor="train-finance" className="ml-2">経営・財務知識</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="train-strategy" />
                        <Label htmlFor="train-strategy" className="ml-2">戦略的思考</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="train-coaching" />
                        <Label htmlFor="train-coaching" className="ml-2">コーチングスキル</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="train-project" />
                        <Label htmlFor="train-project" className="ml-2">プロジェクト管理</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="development-plan">個別育成計画</Label>
                    <Textarea 
                      id="development-plan" 
                      placeholder="今後1年間の具体的な育成プラン"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="stretch-assignments">ストレッチアサインメント</Label>
                    <Textarea 
                      id="stretch-assignments" 
                      placeholder="挑戦的な課題、新しい責任、プロジェクトリード等"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">10. アクションプラン（5分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="quarterly-goals">四半期目標（SMART）</Label>
                    <Textarea 
                      id="quarterly-goals" 
                      placeholder="1. 具体的な目標\n2. 測定可能な指標\n3. 達成期限"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="support-needs">必要な組織的支援</Label>
                    <Textarea 
                      id="support-needs" 
                      placeholder="権限拡大、研修機会、メンター配置など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">健康・ウェルビーイング</Label>
                    <RadioGroup className="grid grid-cols-4 gap-3 mt-3">
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="excellent" id="health-e" />
                        <Label htmlFor="health-e" className="mt-1 text-sm">良好</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="good" id="health-g" />
                        <Label htmlFor="health-g" className="mt-1 text-sm">概ね良好</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="concern" id="health-c" />
                        <Label htmlFor="health-c" className="mt-1 text-sm">要注意</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="support" id="health-s" />
                        <Label htmlFor="health-s" className="mt-1 text-sm">要支援</Label>
                      </div>
                    </RadioGroup>
                    <Textarea 
                      id="wellness-support" 
                      placeholder="必要な健康支援、業務調整など"
                      className="min-h-[60px] mt-3"
                    />
                  </div>
                </div>
              </div>

              {/* 面談者記入欄 */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-lg mb-4">面談者記入欄</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <Label className="text-base font-semibold">総合評価</Label>
                      <RadioGroup className="space-y-1 mt-2">
                        <div className="flex items-center">
                          <RadioGroupItem value="outstanding" id="eval-o" />
                          <Label htmlFor="eval-o" className="ml-2 text-sm">卓越</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="excellent" id="eval-e" />
                          <Label htmlFor="eval-e" className="ml-2 text-sm">優秀</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="good" id="eval-g" />
                          <Label htmlFor="eval-g" className="ml-2 text-sm">良好</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="developing" id="eval-d" />
                          <Label htmlFor="eval-d" className="ml-2 text-sm">成長途上</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <Label className="text-base font-semibold">師長候補評価</Label>
                      <RadioGroup className="space-y-1 mt-2">
                        <div className="flex items-center">
                          <RadioGroupItem value="ready" id="candidate-r" />
                          <Label htmlFor="candidate-r" className="ml-2 text-sm">準備完了</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="1year" id="candidate-1" />
                          <Label htmlFor="candidate-1" className="ml-2 text-sm">1年以内</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="2years" id="candidate-2" />
                          <Label htmlFor="candidate-2" className="ml-2 text-sm">2年以内</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="potential" id="candidate-p" />
                          <Label htmlFor="candidate-p" className="ml-2 text-sm">将来的に</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <Label className="text-base font-semibold">タレント分類</Label>
                      <RadioGroup className="space-y-1 mt-2">
                        <div className="flex items-center">
                          <RadioGroupItem value="hipo" id="talent-h" />
                          <Label htmlFor="talent-h" className="ml-2 text-sm">HiPo</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="key" id="talent-k" />
                          <Label htmlFor="talent-k" className="ml-2 text-sm">キー人材</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="solid" id="talent-s" />
                          <Label htmlFor="talent-s" className="ml-2 text-sm">堅実人材</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="developing" id="talent-d" />
                          <Label htmlFor="talent-d" className="ml-2 text-sm">育成対象</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="management-assessment">管理能力評価</Label>
                    <Textarea 
                      id="management-assessment" 
                      placeholder="リーダーシップ、マネジメント力、将来性など総合的に評価"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="succession-recommendation">後継者育成の観点</Label>
                    <Textarea 
                      id="succession-recommendation" 
                      placeholder="次のステップ、必要な経験、推奨ポジションなど"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="special-notes">特記事項</Label>
                    <Textarea 
                      id="special-notes" 
                      placeholder="組織への提言、重要な気づき、フォロー事項など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="next-interview">次回面談予定</Label>
                      <Input type="date" id="next-interview" />
                    </div>
                    <div>
                      <Label htmlFor="interim-review">中間レビュー</Label>
                      <Input type="date" id="interim-review" />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* 保存ボタン */}
          <div className="flex justify-end space-x-4 pt-6 border-t mt-6">
            <Button variant="outline">一時保存</Button>
            <Button>面談記録を保存</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}