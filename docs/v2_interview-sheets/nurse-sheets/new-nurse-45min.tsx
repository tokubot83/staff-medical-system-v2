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

export default function NewNurse45MinInterview() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            新人看護師面談シート（45分版）
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            総合的な状況把握と成長支援のための包括的面談
          </p>
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              各項目で選択式評価と詳細記述の両方を記入してください。
              システム分析と個別対応の両方に活用されます。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="current">現在の状況</TabsTrigger>
              <TabsTrigger value="growth">成長と課題</TabsTrigger>
              <TabsTrigger value="career">キャリア意向</TabsTrigger>
              <TabsTrigger value="support">支援計画</TabsTrigger>
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
                  <Input type="text" id="time" placeholder="10:00-10:45" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="interviewer">面談者</Label>
                  <Input type="text" id="interviewer" />
                </div>
                <div>
                  <Label htmlFor="place">面談場所</Label>
                  <Input type="text" id="place" placeholder="会議室A" />
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-3">対象者情報</h3>
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
                    <Label htmlFor="hire-date">入職日</Label>
                    <Input type="date" id="hire-date" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="preceptor">プリセプター名</Label>
                    <Input type="text" id="preceptor" />
                  </div>
                  <div>
                    <Label htmlFor="experience">経験月数</Label>
                    <Input type="text" id="experience" placeholder="3ヶ月" />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 現在の状況タブ（12分） */}
            <TabsContent value="current" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">1. 業務適応状況（6分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">総合的な適応度</Label>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                        <div></div>
                        <div className="bg-green-100 px-2 py-1 rounded">5</div>
                        <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                        <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                        <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                        <div className="bg-red-100 px-2 py-1 rounded">1</div>
                      </div>
                      
                      <RadioGroup>
                        <div className="grid grid-cols-6 gap-2 items-center">
                          <span className="text-sm font-medium">総合的な適応度</span>
                          <div className="flex justify-center">
                            <RadioGroupItem value="adapt-5" id="adapt-5" className="w-4 h-4" />
                          </div>
                          <div className="flex justify-center">
                            <RadioGroupItem value="adapt-4" id="adapt-4" className="w-4 h-4" />
                          </div>
                          <div className="flex justify-center">
                            <RadioGroupItem value="adapt-3" id="adapt-3" className="w-4 h-4" />
                          </div>
                          <div className="flex justify-center">
                            <RadioGroupItem value="adapt-2" id="adapt-2" className="w-4 h-4" />
                          </div>
                          <div className="flex justify-center">
                            <RadioGroupItem value="adapt-1" id="adapt-1" className="w-4 h-4" />
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded mt-3">
                      <p><strong>評価基準：</strong></p>
                      <p><span className="text-green-600 font-medium">5：</span>エキスパート　<span className="text-blue-600 font-medium">4：</span>熟練　<span className="text-yellow-600 font-medium">3：</span>一人前　<span className="text-orange-600 font-medium">2：</span>見習い　<span className="text-red-600 font-medium">1：</span>初心者</p>
                    </div>
                    
                    <div className="mt-3">
                      <Label htmlFor="adapt-detail">具体的な状況（面談者記入）</Label>
                      <Textarea 
                        id="adapt-detail" 
                        placeholder="業務の理解度、チームへの馴染み具合、自立度など具体的に記載"
                        className="min-h-[80px] mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>習得済み看護技術（チェックリスト）</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="skill-vital" />
                        <Label htmlFor="skill-vital" className="ml-2">バイタル測定</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="skill-blood" />
                        <Label htmlFor="skill-blood" className="ml-2">採血</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="skill-iv" />
                        <Label htmlFor="skill-iv" className="ml-2">点滴管理</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="skill-med" />
                        <Label htmlFor="skill-med" className="ml-2">与薬</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="skill-record" />
                        <Label htmlFor="skill-record" className="ml-2">看護記録</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="skill-emergency" />
                        <Label htmlFor="skill-emergency" className="ml-2">急変対応</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="night-shift">夜勤独り立ちの状況</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="状況を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not-started">未開始</SelectItem>
                        <SelectItem value="shadowing">見学中</SelectItem>
                        <SelectItem value="supervised">指導付き実施</SelectItem>
                        <SelectItem value="partial">部分的に独立</SelectItem>
                        <SelectItem value="independent">独立</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">2. 心身の健康とモチベーション（6分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">モチベーション状態</Label>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                        <div></div>
                        <div className="bg-green-100 px-2 py-1 rounded">5</div>
                        <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                        <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                        <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                        <div className="bg-red-100 px-2 py-1 rounded">1</div>
                      </div>
                      
                      <RadioGroup>
                        <div className="grid grid-cols-6 gap-2 items-center">
                          <span className="text-sm font-medium">モチベーション状態</span>
                          <div className="flex justify-center">
                            <RadioGroupItem value="motive-5" id="motive-5" className="w-4 h-4" />
                          </div>
                          <div className="flex justify-center">
                            <RadioGroupItem value="motive-4" id="motive-4" className="w-4 h-4" />
                          </div>
                          <div className="flex justify-center">
                            <RadioGroupItem value="motive-3" id="motive-3" className="w-4 h-4" />
                          </div>
                          <div className="flex justify-center">
                            <RadioGroupItem value="motive-2" id="motive-2" className="w-4 h-4" />
                          </div>
                          <div className="flex justify-center">
                            <RadioGroupItem value="motive-1" id="motive-1" className="w-4 h-4" />
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded mt-3">
                      <p><strong>評価基準：</strong></p>
                      <p><span className="text-green-600 font-medium">5：</span>エキスパート　<span className="text-blue-600 font-medium">4：</span>熟練　<span className="text-yellow-600 font-medium">3：</span>一人前　<span className="text-orange-600 font-medium">2：</span>見習い　<span className="text-red-600 font-medium">1：</span>初心者</p>
                    </div>
                    
                    <div className="mt-3">
                      <Label htmlFor="motive-detail">モチベーションの源泉・阻害要因</Label>
                      <Textarea 
                        id="motive-detail" 
                        placeholder="やりがいを感じる瞬間、不安や悩みなど"
                        className="min-h-[80px] mt-2"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">健康・ストレス状況</Label>
                    <RadioGroup className="grid grid-cols-4 gap-3 mt-3">
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="good" id="health-g" />
                        <Label htmlFor="health-g" className="mt-1 text-sm">良好</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="mild" id="health-m" />
                        <Label htmlFor="health-m" className="mt-1 text-sm">軽度懸念</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="moderate" id="health-mo" />
                        <Label htmlFor="health-mo" className="mt-1 text-sm">要観察</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="severe" id="health-s" />
                        <Label htmlFor="health-s" className="mt-1 text-sm">要支援</Label>
                      </div>
                    </RadioGroup>
                    <div className="mt-3">
                      <Label htmlFor="health-detail">具体的な状況</Label>
                      <Textarea 
                        id="health-detail" 
                        placeholder="睡眠、食事、体調不良、ストレス症状など"
                        className="min-h-[80px] mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="work-life-balance">ワークライフバランス</Label>
                    <Textarea 
                      id="work-life-balance" 
                      placeholder="プライベートの充実度、リフレッシュ方法、趣味など"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 成長と課題タブ（10分） */}
            <TabsContent value="growth" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">3. 成長の実感と自己効力感（5分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">
                      この3ヶ月で最も成長したと感じる点は？
                    </Label>
                    <Textarea 
                      id="growth-achievement" 
                      placeholder="できるようになったこと、自信がついた業務、褒められたことなど"
                      className="min-h-[100px] mt-2"
                    />
                  </div>

                  <div>
                    <Label>看護師として大切にしたい価値観</Label>
                    <Textarea 
                      id="nursing-values" 
                      placeholder="患者への思い、看護観、目指す看護師像など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label>仕事のやりがいを感じる瞬間</Label>
                    <Textarea 
                      id="job-satisfaction" 
                      placeholder="患者さんからの言葉、チームでの達成感など具体的に"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">4. 現在の課題と困難（5分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>主な課題領域（複数選択可）</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="challenge-tech" />
                        <Label htmlFor="challenge-tech" className="ml-2">看護技術</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="challenge-knowledge" />
                        <Label htmlFor="challenge-knowledge" className="ml-2">医学知識</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="challenge-time" />
                        <Label htmlFor="challenge-time" className="ml-2">時間管理</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="challenge-priority" />
                        <Label htmlFor="challenge-priority" className="ml-2">優先順位</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="challenge-communication" />
                        <Label htmlFor="challenge-communication" className="ml-2">コミュニケーション</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="challenge-confidence" />
                        <Label htmlFor="challenge-confidence" className="ml-2">自信不足</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="specific-challenges">最も困っている具体的な状況</Label>
                    <Textarea 
                      id="specific-challenges" 
                      placeholder="例：多重課題への対処、医師への報告、急変時の判断など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">
                      職場で改善してほしい点（3つまで）
                    </Label>
                    <Textarea 
                      id="improvement-requests" 
                      placeholder="1. \n2. \n3. "
                      className="min-h-[100px] mt-2"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* キャリア意向タブ（8分） */}
            <TabsContent value="career" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">5. 働き方への意向（4分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">理想の働き方</Label>
                    <RadioGroup className="space-y-2 mt-3">
                      <div className="flex items-center">
                        <RadioGroupItem value="career-focused" id="work-cf" />
                        <Label htmlFor="work-cf" className="ml-2">
                          キャリアアップ重視（資格取得、昇進を目指す）
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="balanced" id="work-b" />
                        <Label htmlFor="work-b" className="ml-2">
                          ワークライフバランス重視（プライベートも大切に）
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="specialist" id="work-s" />
                        <Label htmlFor="work-s" className="ml-2">
                          専門性重視（特定分野のエキスパートを目指す）
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="flexible" id="work-f" />
                        <Label htmlFor="work-f" className="ml-2">
                          柔軟に対応（状況に応じて変化）
                        </Label>
                      </div>
                    </RadioGroup>
                    <div className="mt-3">
                      <Label htmlFor="work-style-detail">具体的な希望</Label>
                      <Textarea 
                        id="work-style-detail" 
                        placeholder="勤務形態、シフト希望、残業への考えなど"
                        className="min-h-[60px] mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="life-events">今後3年間のライフイベント予定</Label>
                    <Textarea 
                      id="life-events" 
                      placeholder="結婚、出産、進学、資格取得など（プライバシーに配慮し任意）"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">6. キャリアビジョン（4分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">
                      1年後もこの職場で働いているイメージが持てますか？
                    </Label>
                    <RadioGroup className="grid grid-cols-4 gap-3 mt-3">
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="definitely" id="retention-d" />
                        <Label htmlFor="retention-d" className="mt-1 text-sm">強く持てる</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="probably" id="retention-p" />
                        <Label htmlFor="retention-p" className="mt-1 text-sm">持てる</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="uncertain" id="retention-u" />
                        <Label htmlFor="retention-u" className="mt-1 text-sm">わからない</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="unlikely" id="retention-ul" />
                        <Label htmlFor="retention-ul" className="mt-1 text-sm">持てない</Label>
                      </div>
                    </RadioGroup>
                    <div className="mt-3">
                      <Label htmlFor="retention-reason">その理由</Label>
                      <Textarea 
                        id="retention-reason" 
                        placeholder="職場の魅力、不安要素など"
                        className="min-h-[60px] mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="career-goals">1-3年後の目標</Label>
                    <Textarea 
                      id="career-goals" 
                      placeholder="習得したい技術、経験したい部署、取得したい資格など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label>興味のある分野（複数選択可）</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="interest-emergency" />
                        <Label htmlFor="interest-emergency" className="ml-2">救急・ICU</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="interest-surgery" />
                        <Label htmlFor="interest-surgery" className="ml-2">手術室</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="interest-pediatric" />
                        <Label htmlFor="interest-pediatric" className="ml-2">小児看護</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="interest-elderly" />
                        <Label htmlFor="interest-elderly" className="ml-2">高齢者看護</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="interest-mental" />
                        <Label htmlFor="interest-mental" className="ml-2">精神看護</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="interest-community" />
                        <Label htmlFor="interest-community" className="ml-2">地域・在宅</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 支援計画タブ（15分） */}
            <TabsContent value="support" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">7. 必要な支援の明確化（5分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>必要な支援（優先順位順）</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="support-technical" />
                        <Label htmlFor="support-technical" className="ml-2">技術指導の強化</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="support-mental" />
                        <Label htmlFor="support-mental" className="ml-2">メンタルサポート</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="support-workload" />
                        <Label htmlFor="support-workload" className="ml-2">業務量の調整</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="support-education" />
                        <Label htmlFor="support-education" className="ml-2">学習機会の提供</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="support-team" />
                        <Label htmlFor="support-team" className="ml-2">チーム内の関係改善</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="support-preceptor" />
                        <Label htmlFor="support-preceptor" className="ml-2">プリセプター体制の見直し</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="support-detail">具体的な支援内容の要望</Label>
                    <Textarea 
                      id="support-detail" 
                      placeholder="どのような形でサポートしてほしいか具体的に"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">8. アクションプラン（5分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="next-month-goals">次回面談までの目標（1ヶ月）</Label>
                    <Textarea 
                      id="next-month-goals" 
                      placeholder="具体的で達成可能な目標を2-3個設定"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="action-items">合意したアクション</Label>
                    <Textarea 
                      id="action-items" 
                      placeholder="本人がすること：\n上司・プリセプターがすること：\n組織がすること："
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="follow-up">フォローアップ方法</Label>
                    <Textarea 
                      id="follow-up" 
                      placeholder="日々の声かけ、週次ミーティング、メールでの相談など"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>

              {/* 面談者記入欄 */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-lg mb-4">面談者記入欄（5分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">総合評価</Label>
                    <RadioGroup className="grid grid-cols-4 gap-3 mt-3">
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="smooth" id="eval-s" />
                        <Label htmlFor="eval-s" className="mt-1 text-sm">順調</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="mostly-smooth" id="eval-ms" />
                        <Label htmlFor="eval-ms" className="mt-1 text-sm">概ね順調</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="watch" id="eval-w" />
                        <Label htmlFor="eval-w" className="mt-1 text-sm">要観察</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="support" id="eval-su" />
                        <Label htmlFor="eval-su" className="mt-1 text-sm">要支援</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">離職リスク評価</Label>
                    <RadioGroup className="grid grid-cols-4 gap-3 mt-3">
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="low" id="risk-l" />
                        <Label htmlFor="risk-l" className="mt-1 text-sm">低い</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="medium" id="risk-m" />
                        <Label htmlFor="risk-m" className="mt-1 text-sm">中程度</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="high" id="risk-h" />
                        <Label htmlFor="risk-h" className="mt-1 text-sm">高い</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="critical" id="risk-c" />
                        <Label htmlFor="risk-c" className="mt-1 text-sm">危機的</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="interviewer-assessment">面談者所見</Label>
                    <Textarea 
                      id="interviewer-assessment" 
                      placeholder="成長の様子、懸念事項、強み、潜在能力など"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="report-to-manager">上司への報告事項</Label>
                    <Textarea 
                      id="report-to-manager" 
                      placeholder="緊急度の高い事項、組織的対応が必要な事項など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="next-interview">次回面談予定</Label>
                      <Input type="date" id="next-interview" />
                    </div>
                    <div>
                      <Label htmlFor="interim-check">中間チェック予定</Label>
                      <Input type="date" id="interim-check" />
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