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
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function WardManager30MinInterview() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            病棟師長面談シート（30分版）
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            部署運営と人材管理に焦点を当てた定期面談
          </p>
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              時間配分目安：基本情報3分、部署運営10分、人材管理10分、経営視点5分、計画2分
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="operations">部署運営</TabsTrigger>
              <TabsTrigger value="hr">人材管理</TabsTrigger>
              <TabsTrigger value="management">経営視点</TabsTrigger>
              <TabsTrigger value="planning">計画策定</TabsTrigger>
            </TabsList>

            {/* 基本情報タブ（3分） */}
            <TabsContent value="basic" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">面談日</Label>
                  <Input type="date" id="date" />
                </div>
                <div>
                  <Label htmlFor="time">面談時間</Label>
                  <Input type="text" id="time" placeholder="14:00-14:30" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="interviewer">面談者</Label>
                  <Input type="text" id="interviewer" placeholder="看護部長名" />
                </div>
                <div>
                  <Label htmlFor="place">面談場所</Label>
                  <Input type="text" id="place" placeholder="看護部長室" />
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-3">師長情報</h3>
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
                    <Label htmlFor="management-years">管理職経験年数</Label>
                    <Input type="text" id="management-years" placeholder="5年" />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="staff-count">管理スタッフ数</Label>
                  <Input type="text" id="staff-count" placeholder="看護師25名、助手5名" />
                </div>
              </div>
            </TabsContent>

            {/* 部署運営タブ（10分） */}
            <TabsContent value="operations" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">1. 病棟運営状況（5分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">運営指標</Label>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <Label htmlFor="bed-rate">病床稼働率（月平均）</Label>
                        <Input type="text" id="bed-rate" placeholder="92%" />
                      </div>
                      <div>
                        <Label htmlFor="avg-stay">平均在院日数</Label>
                        <Input type="text" id="avg-stay" placeholder="12.5日" />
                      </div>
                      <div>
                        <Label htmlFor="incident-count">インシデント件数（月）</Label>
                        <Input type="text" id="incident-count" placeholder="3件" />
                      </div>
                      <div>
                        <Label htmlFor="patient-satisfaction">患者満足度</Label>
                        <Input type="text" id="patient-satisfaction" placeholder="4.2/5.0" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="quality-improvements">医療の質向上への取り組み</Label>
                    <Textarea 
                      id="quality-improvements" 
                      placeholder="実施した改善活動、その成果など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="operational-challenges">運営上の課題</Label>
                    <Textarea 
                      id="operational-challenges" 
                      placeholder="現在直面している問題、懸念事項など"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">2. 業務効率化（5分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>実施中の効率化施策（複数選択可）</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="eff-digital" />
                        <Label htmlFor="eff-digital" className="ml-2">デジタル化推進</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="eff-workflow" />
                        <Label htmlFor="eff-workflow" className="ml-2">業務フロー改善</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="eff-delegation" />
                        <Label htmlFor="eff-delegation" className="ml-2">タスクシフト</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="eff-standardization" />
                        <Label htmlFor="eff-standardization" className="ml-2">標準化推進</Label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">
                      今四半期の重点改善項目
                    </Label>
                    <Textarea 
                      id="quarterly-improvements" 
                      placeholder="具体的な改善目標と実施計画"
                      className="min-h-[80px] mt-2"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 人材管理タブ（10分） */}
            <TabsContent value="hr" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">3. スタッフ管理（5分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">スタッフの状況</Label>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <Label htmlFor="turnover-rate">離職率（年間）</Label>
                        <Input type="text" id="turnover-rate" placeholder="8%" />
                      </div>
                      <div>
                        <Label htmlFor="overtime-avg">平均残業時間</Label>
                        <Input type="text" id="overtime-avg" placeholder="月25時間" />
                      </div>
                      <div>
                        <Label htmlFor="morale">チームモラル</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="選択してください" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">高い</SelectItem>
                            <SelectItem value="normal">普通</SelectItem>
                            <SelectItem value="low">低い</SelectItem>
                            <SelectItem value="critical">危機的</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="education-progress">教育計画進捗</Label>
                        <Input type="text" id="education-progress" placeholder="75%" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>人材面の課題（複数選択可）</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="hr-shortage" />
                        <Label htmlFor="hr-shortage" className="ml-2">人員不足</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="hr-skill" />
                        <Label htmlFor="hr-skill" className="ml-2">スキル不足</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="hr-conflict" />
                        <Label htmlFor="hr-conflict" className="ml-2">人間関係</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="hr-motivation" />
                        <Label htmlFor="hr-motivation" className="ml-2">モチベーション低下</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="staff-development">スタッフ育成の取り組み</Label>
                    <Textarea 
                      id="staff-development" 
                      placeholder="実施中の育成プログラム、成果など"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">4. リーダーシップ（5分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">
                      リーダーシップスタイル
                    </Label>
                    <RadioGroup className="space-y-2 mt-3">
                      <div className="flex items-center">
                        <RadioGroupItem value="directive" id="lead-d" />
                        <Label htmlFor="lead-d" className="ml-2">指示型</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="coaching" id="lead-c" />
                        <Label htmlFor="lead-c" className="ml-2">コーチング型</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="supportive" id="lead-s" />
                        <Label htmlFor="lead-s" className="ml-2">支援型</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="delegating" id="lead-de" />
                        <Label htmlFor="lead-de" className="ml-2">委任型</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="leadership-challenges">リーダーシップ上の課題</Label>
                    <Textarea 
                      id="leadership-challenges" 
                      placeholder="チーム運営での困難、必要なサポートなど"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="succession-planning">後継者育成状況</Label>
                    <Textarea 
                      id="succession-planning" 
                      placeholder="次期リーダー候補、育成計画など"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 経営視点タブ（5分） */}
            <TabsContent value="management" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">5. 経営的視点（5分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">経営指標への貢献</Label>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <Label htmlFor="revenue-contribution">収益貢献度</Label>
                        <Input type="text" id="revenue-contribution" placeholder="目標比105%" />
                      </div>
                      <div>
                        <Label htmlFor="cost-control">コスト管理</Label>
                        <Input type="text" id="cost-control" placeholder="予算内達成" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cost-reduction">コスト削減への取り組み</Label>
                    <Textarea 
                      id="cost-reduction" 
                      placeholder="実施した施策、削減額など"
                      className="min-h-[60px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="revenue-improvement">収益改善アイデア</Label>
                    <Textarea 
                      id="revenue-improvement" 
                      placeholder="新サービス、効率化による収益向上策など"
                      className="min-h-[60px]"
                    />
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">
                      経営層への提言
                    </Label>
                    <Textarea 
                      id="management-proposals" 
                      placeholder="組織改善、投資提案など"
                      className="min-h-[80px] mt-2"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 計画策定タブ（2分） */}
            <TabsContent value="planning" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">6. アクションプラン（2分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="priority-actions">優先取り組み事項（3つ）</Label>
                    <Textarea 
                      id="priority-actions" 
                      placeholder="1. \n2. \n3. "
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="support-needed">必要な支援</Label>
                    <Textarea 
                      id="support-needed" 
                      placeholder="看護部、経営層からの支援内容"
                      className="min-h-[60px]"
                    />
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">師長の健康状態</Label>
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
                        <RadioGroupItem value="tired" id="health-t" />
                        <Label htmlFor="health-t" className="mt-1 text-sm">疲労気味</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="concern" id="health-c" />
                        <Label htmlFor="health-c" className="mt-1 text-sm">要支援</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="next-interview">次回面談予定</Label>
                      <Input type="date" id="next-interview" />
                    </div>
                    <div>
                      <Label htmlFor="interim-check">中間チェック</Label>
                      <Input type="date" id="interim-check" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 面談者記入欄 */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-lg mb-4">面談者記入欄</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="overall-assessment">総合評価</Label>
                    <Textarea 
                      id="overall-assessment" 
                      placeholder="マネジメント能力、成果、課題など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="recommendations">推奨事項</Label>
                    <Textarea 
                      id="recommendations" 
                      placeholder="組織的対応、育成計画など"
                      className="min-h-[60px]"
                    />
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