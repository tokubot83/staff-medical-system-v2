'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function VeteranNurseUnified15MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-purple-50">
          <CardTitle className="text-2xl">ベテラン看護師（16年目以上）定期面談シート（15分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              15分の短時間面談です。ベテラン看護師の知識伝承活動と組織への貢献を確認します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. 専門性発揮と知識伝承（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 専門性発揮と知識伝承（5分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">専門性・経験の活用度</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "専門知識の発揮",
                "技術指導・伝承",
                "組織知の共有",
                "若手育成への貢献"
              ].map((item, index) => (
                <div key={index} className="grid grid-cols-6 gap-2 items-center">
                  <Label className="text-sm">{item}</Label>
                  {[5, 4, 3, 2, 1].map((value) => (
                    <div key={value} className="flex justify-center">
                      <Input type="radio" name={`expertise-${index}`} value={value} className="w-4 h-4" />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="knowledge-transfer">最近の知識伝承・指導活動</Label>
              <Textarea 
                id="knowledge-transfer" 
                className="min-h-[60px]"
                placeholder="技術指導、ノウハウ共有、暗黙知の形式知化等"
              />
            </div>
          </div>

          {/* 2. 組織貢献とモチベーション（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. 組織貢献とモチベーション（5分）</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contribution-areas">現在の主な貢献領域</Label>
                <RadioGroup defaultValue="">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="clinical" id="cont-clinical" />
                    <Label htmlFor="cont-clinical">臨床実践</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="education" id="cont-education" />
                    <Label htmlFor="cont-education">教育・育成</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="management" id="cont-management" />
                    <Label htmlFor="cont-management">管理・運営</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="advisory" id="cont-advisory" />
                    <Label htmlFor="cont-advisory">相談・助言</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="motivation-level">現在のモチベーション</Label>
                <RadioGroup defaultValue="">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="mot-high" />
                    <Label htmlFor="mot-high">高い</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="mot-moderate" />
                    <Label htmlFor="mot-moderate">普通</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="declining" id="mot-declining" />
                    <Label htmlFor="mot-declining">やや低下</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="mot-low" />
                    <Label htmlFor="mot-low">低い</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivation-factors">モチベーション向上に必要なこと</Label>
              <Textarea 
                id="motivation-factors" 
                className="min-h-[60px]"
                placeholder="役割の明確化、評価、新しい挑戦機会等"
              />
            </div>
          </div>

          {/* 3. 今後の活躍領域（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 今後の活躍領域（5分）</h3>
            
            <div className="space-y-2">
              <Label htmlFor="future-role">今後期待される役割・活躍領域</Label>
              <Textarea 
                id="future-role" 
                className="min-h-[60px]"
                placeholder="メンター、専門アドバイザー、プロジェクトリーダー等"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="succession-plan">後継者育成計画</Label>
              <Textarea 
                id="succession-plan" 
                className="min-h-[60px]"
                placeholder="スキル移転対象者、育成方法、スケジュール"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="work-arrangement">勤務形態の希望・調整事項</Label>
              <Textarea 
                id="work-arrangement" 
                className="min-h-[60px]"
                placeholder="勤務時間、夜勤免除、専門職としての活動時間確保等"
              />
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            
            <div className="bg-yellow-50 p-4 rounded-lg space-y-3">
              <div className="space-y-2">
                <Label htmlFor="overall-value">組織への価値貢献度</Label>
                <RadioGroup defaultValue="">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="exceptional" id="value-exceptional" />
                    <Label htmlFor="value-exceptional">極めて高い</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="value-high" />
                    <Label htmlFor="value-high">高い</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="value-moderate" />
                    <Label htmlFor="value-moderate">標準的</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="potential" id="value-potential" />
                    <Label htmlFor="value-potential">さらなる活用余地あり</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interviewer-notes">面談者コメント</Label>
                <Textarea 
                  id="interviewer-notes" 
                  className="min-h-[80px]"
                  placeholder="ベテランとしての価値、今後の活用方針、配慮事項等"
                />
              </div>
            </div>
          </div>

          {/* 次回面談予定 */}
          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div className="space-y-2">
              <Label htmlFor="next-interview-date">次回面談予定日</Label>
              <Input id="next-interview-date" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="next-interview-type">次回面談形式</Label>
              <select id="next-interview-type" className="w-full px-3 py-2 border rounded-md">
                <option value="">選択してください</option>
                <option value="15min">15分面談</option>
                <option value="30min">30分面談</option>
                <option value="45min">45分面談</option>
              </select>
            </div>
          </div>

          {/* 保存ボタン */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline">一時保存</Button>
            <Button>面談記録を保存</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}