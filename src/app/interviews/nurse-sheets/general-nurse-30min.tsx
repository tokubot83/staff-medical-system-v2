'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export default function GeneralNurse30MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-green-50">
          <CardTitle className="text-2xl">2-3年目一般看護師 定期面談シート（30分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>配属部署：＿＿＿＿＿＿＿＿　経験年数：＿＿年＿＿ヶ月</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. 現況確認（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 現況確認（5分）</h3>
            
            <div className="space-y-2">
              <Label>心身の健康状態</Label>
              <RadioGroup>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="health-excellent" />
                    <Label htmlFor="health-excellent" className="ml-2">良好</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="health-good" />
                    <Label htmlFor="health-good" className="ml-2">普通</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="poor" id="health-poor" />
                    <Label htmlFor="health-poor" className="ml-2">要注意</Label>
                  </div>
                </div>
              </RadioGroup>
              <Textarea 
                placeholder="ストレス要因、睡眠、体調面で気になること"
                className="min-h-[60px] mt-2"
              />
            </div>

            <div className="space-y-2">
              <Label>ワークライフバランス</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">月平均残業時間</Label>
                  <input type="text" className="w-full border rounded px-2 py-1" placeholder="＿＿時間" />
                </div>
                <div>
                  <Label className="text-sm">有給取得率</Label>
                  <input type="text" className="w-full border rounded px-2 py-1" placeholder="＿＿％" />
                </div>
              </div>
              <Textarea 
                placeholder="プライベートの充実度、趣味、リフレッシュ方法"
                className="min-h-[60px] mt-2"
              />
            </div>
          </div>

          {/* 2. 業務遂行状況とスキル評価（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. 業務遂行状況とスキル評価（8分）</h3>
            
            <div className="space-y-2">
              <Label>看護実践能力の自己評価</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">アセスメント能力</span>
                  <RadioGroup className="flex flex-row">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5" id="assess-5" />
                      <Label htmlFor="assess-5" className="text-sm">5</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4" id="assess-4" />
                      <Label htmlFor="assess-4" className="text-sm">4</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="assess-3" />
                      <Label htmlFor="assess-3" className="text-sm">3</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="assess-2" />
                      <Label htmlFor="assess-2" className="text-sm">2</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="assess-1" />
                      <Label htmlFor="assess-1" className="text-sm">1</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">看護技術</span>
                  <RadioGroup className="flex flex-row">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5" id="skill-5" />
                      <Label htmlFor="skill-5" className="text-sm">5</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4" id="skill-4" />
                      <Label htmlFor="skill-4" className="text-sm">4</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="skill-3" />
                      <Label htmlFor="skill-3" className="text-sm">3</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="skill-2" />
                      <Label htmlFor="skill-2" className="text-sm">2</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="skill-1" />
                      <Label htmlFor="skill-1" className="text-sm">1</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">優先順位判断</span>
                  <RadioGroup className="flex flex-row">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5" id="priority-5" />
                      <Label htmlFor="priority-5" className="text-sm">5</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4" id="priority-4" />
                      <Label htmlFor="priority-4" className="text-sm">4</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="priority-3" />
                      <Label htmlFor="priority-3" className="text-sm">3</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="priority-2" />
                      <Label htmlFor="priority-2" className="text-sm">2</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="priority-1" />
                      <Label htmlFor="priority-1" className="text-sm">1</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>最近の成功体験・達成感を感じたこと</Label>
              <Textarea 
                placeholder="具体的なエピソード、患者対応、チーム貢献など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>現在の課題・不安に感じていること</Label>
              <Textarea 
                placeholder="技術面、対人関係、判断に迷うことなど"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>受け持ち患者数と複雑度</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">平均受け持ち数</Label>
                  <input type="text" className="w-full border rounded px-2 py-1" placeholder="＿＿人" />
                </div>
                <div>
                  <Label className="text-sm">重症度</Label>
                  <select className="w-full border rounded px-2 py-1">
                    <option>軽症中心</option>
                    <option>中等症中心</option>
                    <option>重症含む</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 3. チーム内での役割（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. チーム内での役割（7分）</h3>
            
            <div className="space-y-2">
              <Label>後輩指導・プリセプター経験</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="preceptor-exp" />
                  <Label htmlFor="preceptor-exp" className="text-sm">プリセプター経験あり</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="student-guide" />
                  <Label htmlFor="student-guide" className="text-sm">学生指導経験あり</Label>
                </div>
              </div>
              <Textarea 
                placeholder="指導での工夫、困難、学んだこと"
                className="min-h-[60px] mt-2"
              />
            </div>

            <div className="space-y-2">
              <Label>委員会・プロジェクト活動</Label>
              <Textarea 
                placeholder="参加している委員会、役割、貢献内容"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>チーム内でのコミュニケーション</Label>
              <Textarea 
                placeholder="同僚との関係、情報共有、困っていること"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>多職種連携</Label>
              <Textarea 
                placeholder="医師、リハビリ、MSW等との連携状況"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. キャリア開発（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. キャリア開発（5分）</h3>
            
            <div className="space-y-2">
              <Label>興味のある専門分野</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="critical" />
                  <Label htmlFor="critical" className="text-sm">クリティカルケア</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="cancer" />
                  <Label htmlFor="cancer" className="text-sm">がん看護</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="palliative" />
                  <Label htmlFor="palliative" className="text-sm">緩和ケア</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="dementia" />
                  <Label htmlFor="dementia" className="text-sm">認知症ケア</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="infection" />
                  <Label htmlFor="infection" className="text-sm">感染管理</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="other" />
                  <Label htmlFor="other" className="text-sm">その他</Label>
                </div>
              </div>
              <Textarea 
                placeholder="具体的な興味内容、学びたいこと"
                className="min-h-[60px] mt-2"
              />
            </div>

            <div className="space-y-2">
              <Label>今後のキャリアビジョン（3-5年後）</Label>
              <Textarea 
                placeholder="どんな看護師になりたいか、目指す姿"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>必要な研修・教育支援</Label>
              <Textarea 
                placeholder="参加したい研修、資格取得支援など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 5. アクションプラン（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. アクションプラン（5分）</h3>
            
            <div className="space-y-2">
              <Label>次回面談までの個人目標</Label>
              <Textarea 
                placeholder="具体的で測定可能な目標を3つ程度"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>上司・組織からの支援計画</Label>
              <Textarea 
                placeholder="提供する機会、調整事項、フォロー内容"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>次回面談予定</Label>
              <input type="date" className="border rounded px-3 py-2" />
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <div className="space-y-2">
              <Label>総合評価</Label>
              <RadioGroup>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="eval-excellent" />
                    <Label htmlFor="eval-excellent" className="ml-2">期待以上</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="eval-good" />
                    <Label htmlFor="eval-good" className="ml-2">順調</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="normal" id="eval-normal" />
                    <Label htmlFor="eval-normal" className="ml-2">標準的</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="concern" id="eval-concern" />
                    <Label htmlFor="eval-concern" className="ml-2">要観察</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            <Textarea 
              placeholder="成長度、強み、課題、組織への適応、特記事項など"
              className="min-h-[120px]"
            />
          </div>

          {/* 保存ボタン */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button variant="outline">一時保存</Button>
            <Button>面談記録を保存</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}