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

export default function NewNurse30MinInterview() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            新人看護師面談シート（30分版）
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            詳細な状況把握と育成計画のための標準面談
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="current">現在の状況</TabsTrigger>
              <TabsTrigger value="growth">成長・課題</TabsTrigger>
              <TabsTrigger value="plan">今後の計画</TabsTrigger>
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
                  <Input type="text" id="time" placeholder="10:00-10:30" />
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

            {/* 現在の状況タブ（10分） */}
            <TabsContent value="current" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">1. 業務適応状況（5分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>日勤業務の習得度</Label>
                    <RadioGroup className="grid grid-cols-5 gap-3 mt-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="1" id="day-1" />
                        <Label htmlFor="day-1" className="ml-1">20%</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="2" id="day-2" />
                        <Label htmlFor="day-2" className="ml-1">40%</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="3" id="day-3" />
                        <Label htmlFor="day-3" className="ml-1">60%</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="4" id="day-4" />
                        <Label htmlFor="day-4" className="ml-1">80%</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="5" id="day-5" />
                        <Label htmlFor="day-5" className="ml-1">100%</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>夜勤業務の習得度</Label>
                    <RadioGroup className="grid grid-cols-5 gap-3 mt-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="0" id="night-0" />
                        <Label htmlFor="night-0" className="ml-1">未経験</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="1" id="night-1" />
                        <Label htmlFor="night-1" className="ml-1">見学のみ</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="2" id="night-2" />
                        <Label htmlFor="night-2" className="ml-1">指導付</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="3" id="night-3" />
                        <Label htmlFor="night-3" className="ml-1">一部独立</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="4" id="night-4" />
                        <Label htmlFor="night-4" className="ml-1">独立</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="skill-progress">習得済み看護技術</Label>
                    <Textarea 
                      id="skill-progress" 
                      placeholder="採血、点滴、バイタル測定など、独立して実施できる技術を記載"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">2. 心身の健康状態（5分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>身体的健康</Label>
                    <RadioGroup className="flex space-x-4 mt-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="good" id="physical-g" />
                        <Label htmlFor="physical-g" className="ml-2">良好</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="tired" id="physical-t" />
                        <Label htmlFor="physical-t" className="ml-2">疲労あり</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="poor" id="physical-p" />
                        <Label htmlFor="physical-p" className="ml-2">体調不良</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>精神的健康</Label>
                    <RadioGroup className="flex space-x-4 mt-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="stable" id="mental-s" />
                        <Label htmlFor="mental-s" className="ml-2">安定</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="stress" id="mental-st" />
                        <Label htmlFor="mental-st" className="ml-2">ストレスあり</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="concern" id="mental-c" />
                        <Label htmlFor="mental-c" className="ml-2">要サポート</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="health-detail">健康面の詳細・相談事項</Label>
                    <Textarea 
                      id="health-detail" 
                      placeholder="睡眠状況、食事、ストレス要因など"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 成長・課題タブ（10分） */}
            <TabsContent value="growth" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">3. 成長の実感と課題（6分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="growth-points">成長を実感している点</Label>
                    <Textarea 
                      id="growth-points" 
                      placeholder="できるようになったこと、自信がついたことなど"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label>現在の課題（複数選択可）</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="challenge-tech" />
                        <Label htmlFor="challenge-tech" className="ml-2">看護技術の習得</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="challenge-knowledge" />
                        <Label htmlFor="challenge-knowledge" className="ml-2">医学知識の不足</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="challenge-time" />
                        <Label htmlFor="challenge-time" className="ml-2">時間管理</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="challenge-priority" />
                        <Label htmlFor="challenge-priority" className="ml-2">優先順位の判断</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="challenge-communication" />
                        <Label htmlFor="challenge-communication" className="ml-2">コミュニケーション</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="challenge-record" />
                        <Label htmlFor="challenge-record" className="ml-2">記録・報告</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="challenge-detail">課題の具体的内容</Label>
                    <Textarea 
                      id="challenge-detail" 
                      placeholder="特に困っている具体的な状況や場面"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">4. 職場環境・人間関係（4分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>プリセプターとの関係</Label>
                    <RadioGroup className="flex space-x-3 mt-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="excellent" id="preceptor-e" />
                        <Label htmlFor="preceptor-e" className="ml-2">非常に良好</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="good" id="preceptor-g" />
                        <Label htmlFor="preceptor-g" className="ml-2">良好</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="normal" id="preceptor-n" />
                        <Label htmlFor="preceptor-n" className="ml-2">普通</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="difficult" id="preceptor-d" />
                        <Label htmlFor="preceptor-d" className="ml-2">課題あり</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>チーム内での居心地</Label>
                    <RadioGroup className="flex space-x-3 mt-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="very-comfortable" id="team-vc" />
                        <Label htmlFor="team-vc" className="ml-2">とても良い</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="comfortable" id="team-c" />
                        <Label htmlFor="team-c" className="ml-2">良い</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="normal" id="team-n" />
                        <Label htmlFor="team-n" className="ml-2">普通</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="uncomfortable" id="team-u" />
                        <Label htmlFor="team-u" className="ml-2">居づらい</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="relationship-detail">人間関係の詳細</Label>
                    <Textarea 
                      id="relationship-detail" 
                      placeholder="相談しやすい先輩、苦手な状況など"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 今後の計画タブ（10分） */}
            <TabsContent value="plan" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">5. 今後の目標設定（5分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="short-term-goal">1ヶ月後の目標</Label>
                    <Textarea 
                      id="short-term-goal" 
                      placeholder="具体的で達成可能な目標を設定"
                      className="min-h-[60px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="medium-term-goal">3ヶ月後の目標</Label>
                    <Textarea 
                      id="medium-term-goal" 
                      placeholder="中期的な成長目標"
                      className="min-h-[60px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="learning-needs">学習したい領域</Label>
                    <Textarea 
                      id="learning-needs" 
                      placeholder="興味のある分野、深めたい知識・技術"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">6. 必要なサポート（5分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>必要な支援（複数選択可）</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="support-technical" />
                        <Label htmlFor="support-technical" className="ml-2">技術指導の強化</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="support-study" />
                        <Label htmlFor="support-study" className="ml-2">勉強会の実施</Label>
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
                        <Checkbox id="support-shift" />
                        <Label htmlFor="support-shift" className="ml-2">勤務の配慮</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="support-preceptor" />
                        <Label htmlFor="support-preceptor" className="ml-2">プリセプター変更</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="support-detail">具体的な支援内容</Label>
                    <Textarea 
                      id="support-detail" 
                      placeholder="どのような支援が必要か具体的に記載"
                      className="min-h-[60px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="next-interview">次回面談予定</Label>
                    <Input type="date" id="next-interview" />
                  </div>
                </div>
              </div>

              {/* 面談者記入欄 */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-lg mb-4">面談者記入欄</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>総合評価</Label>
                    <RadioGroup className="flex space-x-3 mt-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="excellent" id="eval-e" />
                        <Label htmlFor="eval-e" className="ml-2">順調</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="good" id="eval-g" />
                        <Label htmlFor="eval-g" className="ml-2">概ね順調</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="concern" id="eval-c" />
                        <Label htmlFor="eval-c" className="ml-2">要観察</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="support" id="eval-s" />
                        <Label htmlFor="eval-s" className="ml-2">要支援</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="interviewer-comment">面談者所見</Label>
                    <Textarea 
                      id="interviewer-comment" 
                      placeholder="成長の様子、懸念事項、上司への報告事項など"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="action-items">アクションアイテム</Label>
                    <Textarea 
                      id="action-items" 
                      placeholder="面談後に実施すべき具体的な行動"
                      className="min-h-[80px]"
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