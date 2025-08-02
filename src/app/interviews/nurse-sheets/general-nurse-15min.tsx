'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';

export default function GeneralNurse15MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-green-50">
          <CardTitle className="text-2xl">2-3年目一般看護師 定期面談シート（15分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. 現況確認（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 現況確認（3分）</h3>
            
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
            </div>

            <div className="space-y-2">
              <Label>業務負荷の状況</Label>
              <RadioGroup>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <RadioGroupItem value="appropriate" id="load-appropriate" />
                    <Label htmlFor="load-appropriate" className="ml-2">適正</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="load-high" />
                    <Label htmlFor="load-high" className="ml-2">やや多い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="overload" id="load-overload" />
                    <Label htmlFor="load-overload" className="ml-2">過重</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 2. 業務遂行状況（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. 業務遂行状況（5分）</h3>
            
            <div className="space-y-2">
              <Label>自立度の評価</Label>
              <RadioGroup>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <RadioGroupItem value="independent" id="auto-independent" />
                    <Label htmlFor="auto-independent" className="ml-2">完全自立</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="mostly" id="auto-mostly" />
                    <Label htmlFor="auto-mostly" className="ml-2">ほぼ自立</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="partial" id="auto-partial" />
                    <Label htmlFor="auto-partial" className="ml-2">部分的支援要</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>最近うまくできたこと・成功体験</Label>
              <Textarea 
                placeholder="具体的な事例を記入"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>課題・困っていること</Label>
              <Textarea 
                placeholder="業務上の課題、改善したい点"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 3. スキルアップ・キャリア（4分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. スキルアップ・キャリア（4分）</h3>
            
            <div className="space-y-2">
              <Label>興味のある分野・取り組みたいこと</Label>
              <Textarea 
                placeholder="専門領域、委員会活動、新たな役割など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>必要な研修・教育機会</Label>
              <Textarea 
                placeholder="参加したい研修、必要な支援"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>後輩指導への関わり</Label>
              <RadioGroup>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <RadioGroupItem value="active" id="mentor-active" />
                    <Label htmlFor="mentor-active" className="ml-2">積極的</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="normal" id="mentor-normal" />
                    <Label htmlFor="mentor-normal" className="ml-2">普通</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="passive" id="mentor-passive" />
                    <Label htmlFor="mentor-passive" className="ml-2">消極的</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 4. 今後の方向性（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 今後の方向性（3分）</h3>
            
            <div className="space-y-2">
              <Label>短期目標（次回面談まで）</Label>
              <Textarea 
                placeholder="具体的な目標を記入"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>必要なサポート・要望</Label>
              <Textarea 
                placeholder="組織・上司に求めること"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <Textarea 
              placeholder="総合評価、成長の様子、継続観察事項など"
              className="min-h-[100px]"
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