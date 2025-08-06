'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function NewAssistantNurseUnified30MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-pink-50">
          <CardTitle className="text-2xl">新人准看護師（1年目）定期面談シート（30分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>入職日：＿＿＿＿年＿＿月＿＿日　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              30分の標準面談です。新人准看護師の適応状況を詳しく把握し、成長を支援することを目的とします。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. 業務習得状況の評価（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 業務習得状況の評価（8分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">看護技術の習得度</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "基本的な看護技術",
                "医師・看護師の指示理解",
                "指示の正確な実行",
                "報告・連絡・相談",
                "記録の正確性",
                "安全への配慮",
                "患者対応の基本"
              ].map((item) => (
                <RadioGroup key={item}>
                  <div className="grid grid-cols-6 gap-2 items-center">
                    <span className="text-sm font-medium">{item}</span>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-5`} id={`${item}-5`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-4`} id={`${item}-4`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-3`} id={`${item}-3`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-2`} id={`${item}-2`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-1`} id={`${item}-1`} className="w-4 h-4" />
                    </div>
                  </div>
                </RadioGroup>
              ))}
              <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded">
                <p><strong>評価基準：</strong></p>
                <p><span className="text-green-600 font-medium">5：</span>期待を超える習得　<span className="text-blue-600 font-medium">4：</span>順調に習得　<span className="text-yellow-600 font-medium">3：</span>標準的　<span className="text-orange-600 font-medium">2：</span>やや遅れ　<span className="text-red-600 font-medium">1：</span>要支援</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>習得できた技術・業務</Label>
              <Textarea 
                placeholder="この期間で新たに習得した技術、自信を持って実施できるようになった業務など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>課題となっている技術・業務</Label>
              <Textarea 
                placeholder="まだ不安がある技術、追加指導が必要な業務など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. チーム内での役割遂行（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. チーム内での役割遂行（7分）</h3>
            
            <div className="space-y-3">
              <Label className="text-base font-semibold">チームメンバーとの協働</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="team-communication" />
                  <Label htmlFor="team-communication">看護師への適切な報告ができている</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="team-cooperation" />
                  <Label htmlFor="team-cooperation">他のスタッフと協力して業務を行えている</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="team-timing" />
                  <Label htmlFor="team-timing">タイムリーな情報共有ができている</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="team-help" />
                  <Label htmlFor="team-help">必要時に助けを求められている</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>指導者（プリセプター等）との関係</Label>
              <Textarea 
                placeholder="指導の受け方、質問のしやすさ、関係性など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>多職種との連携状況</Label>
              <Textarea 
                placeholder="医師、リハビリスタッフ、介護職等との連携"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 3. 健康・メンタル・モチベーション（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 健康・メンタル・モチベーション（7分）</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>体調面</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="health-excellent" />
                    <Label htmlFor="health-excellent">良好</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="health-normal" />
                    <Label htmlFor="health-normal">普通</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="concern" id="health-concern" />
                    <Label htmlFor="health-concern">要注意</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>精神面</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="mental-excellent" />
                    <Label htmlFor="mental-excellent">良好</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="mental-normal" />
                    <Label htmlFor="mental-normal">普通</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="concern" id="mental-concern" />
                    <Label htmlFor="mental-concern">要注意</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>モチベーション</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="motivation-high" />
                    <Label htmlFor="motivation-high">高い</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="motivation-normal" />
                    <Label htmlFor="motivation-normal">普通</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="motivation-low" />
                    <Label htmlFor="motivation-low">低い</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label>勤務負担・ワークライフバランス</Label>
              <Textarea 
                placeholder="残業状況、休日の確保、プライベートとの両立など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>ストレス要因と対処</Label>
              <Textarea 
                placeholder="主なストレス源、対処方法、必要なサポートなど"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. 今後の成長支援（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 今後の成長支援（8分）</h3>
            
            <div className="space-y-2">
              <Label>今後3ヶ月で習得すべき技術・知識</Label>
              <Textarea 
                placeholder="優先的に身につけるべき技術、学習すべき知識など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>必要な研修・教育</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="training-basic" />
                  <Label htmlFor="training-basic">基礎看護技術研修</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="training-safety" />
                  <Label htmlFor="training-safety">医療安全研修</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="training-infection" />
                  <Label htmlFor="training-infection">感染対策研修</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="training-communication" />
                  <Label htmlFor="training-communication">コミュニケーション研修</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="training-other" />
                  <Label htmlFor="training-other">その他：</Label>
                  <Input className="w-64" placeholder="具体的な研修名" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>キャリアプランの確認</Label>
              <Textarea 
                placeholder="将来の目標、看護師資格取得の意向、興味のある分野など"
                className="min-h-[60px]"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <Label className="text-base font-semibold">次回面談までの行動計画</Label>
              <Textarea 
                className="mt-2 min-h-[80px]"
                placeholder="具体的な目標と行動計画（2-3項目）"
              />
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <Textarea 
              placeholder="全体的な評価、成長の様子、特に注意すべき点、申し送り事項など"
              className="min-h-[100px]"
            />
          </div>

          {/* フォローアップ */}
          <div className="bg-yellow-50 p-4 rounded-lg space-y-3">
            <Label className="text-base font-semibold text-yellow-800">フォローアップの必要性</Label>
            <RadioGroup>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="urgent" id="followup-urgent" />
                <Label htmlFor="followup-urgent" className="text-red-600">緊急（1週間以内）</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="soon" id="followup-soon" />
                <Label htmlFor="followup-soon" className="text-orange-600">早期（2週間以内）</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="regular" id="followup-regular" />
                <Label htmlFor="followup-regular">定期（1ヶ月後）</Label>
              </div>
            </RadioGroup>
          </div>

          {/* 署名欄 */}
          <div className="flex justify-between items-center border-t pt-4">
            <div className="flex items-center space-x-4">
              <Label>面談者署名：</Label>
              <Input className="w-48" />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              面談記録を保存
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}