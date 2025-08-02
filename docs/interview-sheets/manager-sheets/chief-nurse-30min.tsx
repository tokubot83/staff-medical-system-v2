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

export default function ChiefNurse30MinInterview() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            病棟主任面談シート（30分版）
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            役割遂行とチームマネジメントに焦点を当てた定期面談
          </p>
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              時間配分目安：基本情報3分、役割遂行8分、チーム管理8分、師長連携6分、成長計画5分
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="role">役割遂行</TabsTrigger>
              <TabsTrigger value="team">チーム管理</TabsTrigger>
              <TabsTrigger value="collaboration">師長連携</TabsTrigger>
              <TabsTrigger value="growth">成長計画</TabsTrigger>
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
                  <Input type="text" id="interviewer" placeholder="師長名" />
                </div>
                <div>
                  <Label htmlFor="place">面談場所</Label>
                  <Input type="text" id="place" placeholder="面談室" />
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-3">主任情報</h3>
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
                    <Input type="text" id="chief-years" placeholder="3年" />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="team-size">チームメンバー数</Label>
                  <Input type="text" id="team-size" placeholder="15名" />
                </div>
              </div>
            </TabsContent>

            {/* 役割遂行タブ（8分） */}
            <TabsContent value="role" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">1. 主任としての役割理解（4分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">役割遂行状況</Label>
                    <div className="space-y-3 mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">師長の補佐</span>
                        <RadioGroup className="flex space-x-2">
                          {[5, 4, 3, 2, 1].map((value) => (
                            <div key={value} className="flex items-center">
                              <RadioGroupItem value={`assist-${value}`} id={`assist-${value}`} />
                              <Label htmlFor={`assist-${value}`} className="ml-1 text-xs">{value}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">現場リーダーシップ</span>
                        <RadioGroup className="flex space-x-2">
                          {[5, 4, 3, 2, 1].map((value) => (
                            <div key={value} className="flex items-center">
                              <RadioGroupItem value={`lead-${value}`} id={`lead-${value}`} />
                              <Label htmlFor={`lead-${value}`} className="ml-1 text-xs">{value}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">スタッフ育成</span>
                        <RadioGroup className="flex space-x-2">
                          {[5, 4, 3, 2, 1].map((value) => (
                            <div key={value} className="flex items-center">
                              <RadioGroupItem value={`develop-${value}`} id={`develop-${value}`} />
                              <Label htmlFor={`develop-${value}`} className="ml-1 text-xs">{value}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">5:優秀 4:良好 3:標準 2:要改善 1:要指導</p>
                  </div>

                  <div>
                    <Label htmlFor="role-transition">スタッフから主任への役割移行</Label>
                    <Textarea 
                      id="role-transition" 
                      placeholder="立場の変化への適応、同僚との関係性の変化など"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">2. 日常業務の実践（4分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>主な活動内容（複数選択可）</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="shift-manage" />
                        <Label htmlFor="shift-manage" className="ml-2">シフト管理・調整</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="work-assign" />
                        <Label htmlFor="work-assign" className="ml-2">業務割り当て</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="trouble-solve" />
                        <Label htmlFor="trouble-solve" className="ml-2">トラブル対応</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="staff-guide" />
                        <Label htmlFor="staff-guide" className="ml-2">スタッフ指導</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="meeting-lead" />
                        <Label htmlFor="meeting-lead" className="ml-2">カンファレンス運営</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="quality-manage" />
                        <Label htmlFor="quality-manage" className="ml-2">ケアの質管理</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="work-balance">業務バランスと優先順位</Label>
                    <Textarea 
                      id="work-balance" 
                      placeholder="実務と管理業務のバランス、時間配分の工夫など"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* チーム管理タブ（8分） */}
            <TabsContent value="team" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">3. チームマネジメント（4分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">チーム状況</Label>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <Label htmlFor="team-morale">チームモラル</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">高い</SelectItem>
                            <SelectItem value="normal">普通</SelectItem>
                            <SelectItem value="low">低い</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="team-cooperation">協力体制</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excellent">優秀</SelectItem>
                            <SelectItem value="good">良好</SelectItem>
                            <SelectItem value="needs-improvement">要改善</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="team-building">チームビルディング活動</Label>
                    <Textarea 
                      id="team-building" 
                      placeholder="チームワーク向上の取り組み、雰囲気づくりの工夫など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="staff-relationship">スタッフとの関係構築</Label>
                    <Textarea 
                      id="staff-relationship" 
                      placeholder="信頼関係の構築方法、コミュニケーションの工夫など"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">4. 困難事例への対応（4分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="difficult-staff">困難なスタッフへの対応</Label>
                    <Textarea 
                      id="difficult-staff" 
                      placeholder="具体的な事例、対応方法、成果や課題"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="conflict-resolution">トラブル・対立の解決</Label>
                    <Textarea 
                      id="conflict-resolution" 
                      placeholder="スタッフ間の調整、患者クレーム対応など"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 師長連携タブ（6分） */}
            <TabsContent value="collaboration" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">5. 師長との協働（3分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">連携状況</Label>
                    <RadioGroup className="grid grid-cols-3 gap-3 mt-3">
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="excellent" id="collab-e" />
                        <Label htmlFor="collab-e" className="mt-1 text-sm">良好</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="good" id="collab-g" />
                        <Label htmlFor="collab-g" className="mt-1 text-sm">概ね良好</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="needs" id="collab-n" />
                        <Label htmlFor="collab-n" className="mt-1 text-sm">改善要</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="role-division">役割分担の明確さ</Label>
                    <Textarea 
                      id="role-division" 
                      placeholder="明確な部分、グレーゾーン、調整が必要な事項"
                      className="min-h-[60px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="reporting">報告・連絡・相談の状況</Label>
                    <Textarea 
                      id="reporting" 
                      placeholder="タイミング、内容、頻度、改善点など"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">6. 師長不在時の対応（3分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="authority-scope">判断権限の範囲</Label>
                    <Textarea 
                      id="authority-scope" 
                      placeholder="自己判断できる事項、師長確認が必要な事項"
                      className="min-h-[60px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="support-needs">師長への要望・提案</Label>
                    <Textarea 
                      id="support-needs" 
                      placeholder="サポートしてほしいこと、権限委譲の希望など"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 成長計画タブ（5分） */}
            <TabsContent value="growth" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">7. 成長と今後の計画（5分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">自己評価</Label>
                    <Textarea 
                      id="self-assessment" 
                      placeholder="主任としての強み、改善点、成長実感"
                      className="min-h-[80px] mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="improvement-activities">業務改善・教育活動</Label>
                    <Textarea 
                      id="improvement-activities" 
                      placeholder="実施中の改善活動、新人教育、勉強会など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label>今後のキャリアプラン</Label>
                    <RadioGroup className="space-y-2 mt-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="head-nurse" id="career-head" />
                        <Label htmlFor="career-head" className="ml-2">師長を目指す</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="specialist" id="career-spec" />
                        <Label htmlFor="career-spec" className="ml-2">専門性を深める</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="current" id="career-current" />
                        <Label htmlFor="career-current" className="ml-2">主任として極める</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="undecided" id="career-undecided" />
                        <Label htmlFor="career-undecided" className="ml-2">検討中</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="development-needs">必要な研修・支援</Label>
                    <Textarea 
                      id="development-needs" 
                      placeholder="管理研修、リーダーシップ研修、メンタリングなど"
                      className="min-h-[60px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="next-interview">次回面談予定</Label>
                      <Input type="date" id="next-interview" />
                    </div>
                    <div>
                      <Label htmlFor="follow-up">フォローアップ方法</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">月次面談</SelectItem>
                          <SelectItem value="weekly">週次確認</SelectItem>
                          <SelectItem value="as-needed">必要時</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* 面談者記入欄 */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-lg mb-4">面談者記入欄</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <Label className="text-base font-semibold">主任としての評価</Label>
                      <RadioGroup className="space-y-1 mt-2">
                        <div className="flex items-center">
                          <RadioGroupItem value="excellent" id="eval-e" />
                          <Label htmlFor="eval-e" className="ml-2 text-sm">優秀</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="good" id="eval-g" />
                          <Label htmlFor="eval-g" className="ml-2 text-sm">良好</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="standard" id="eval-s" />
                          <Label htmlFor="eval-s" className="ml-2 text-sm">標準</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="developing" id="eval-d" />
                          <Label htmlFor="eval-d" className="ml-2 text-sm">成長途上</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <Label className="text-base font-semibold">次期師長候補</Label>
                      <RadioGroup className="space-y-1 mt-2">
                        <div className="flex items-center">
                          <RadioGroupItem value="ready" id="candidate-r" />
                          <Label htmlFor="candidate-r" className="ml-2 text-sm">準備完了</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="potential" id="candidate-p" />
                          <Label htmlFor="candidate-p" className="ml-2 text-sm">有望</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="developing" id="candidate-d" />
                          <Label htmlFor="candidate-d" className="ml-2 text-sm">育成要</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="not-applicable" id="candidate-n" />
                          <Label htmlFor="candidate-n" className="ml-2 text-sm">該当なし</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="interviewer-notes">所見・今後の育成方針</Label>
                    <Textarea 
                      id="interviewer-notes" 
                      placeholder="成長度、強み、課題、育成計画など"
                      className="min-h-[100px]"
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