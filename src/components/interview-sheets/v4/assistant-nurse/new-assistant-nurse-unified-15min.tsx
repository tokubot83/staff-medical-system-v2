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

export default function NewAssistantNurseUnified15MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-pink-50">
          <CardTitle className="text-2xl">新人准看護師（1年目）定期面談シート（15分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>入職日：＿＿＿＿年＿＿月＿＿日　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              15分の短時間面談です。新人准看護師の適応状況と緊急サポートが必要な課題を特定することを目的とします。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. 適応状況の確認（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 適応状況の確認（5分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">職場への適応度</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "職場環境への適応",
                "基本的な看護技術",
                "指示理解と実行",
                "報告・連絡・相談",
                "チームワーク"
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
                <p><span className="text-green-600 font-medium">5：</span>非常に良好　<span className="text-blue-600 font-medium">4：</span>良好　<span className="text-yellow-600 font-medium">3：</span>標準的　<span className="text-orange-600 font-medium">2：</span>やや課題あり　<span className="text-red-600 font-medium">1：</span>要支援</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>現在困っていること・不安なこと</Label>
              <Textarea 
                placeholder="業務上の困難、人間関係、体調面など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 2. 健康・メンタル状況（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. 健康・メンタル状況（5分）</h3>
            
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="space-y-2">
              <Label>睡眠・休息は取れているか</Label>
              <Input placeholder="平均睡眠時間、睡眠の質など" />
            </div>
          </div>

          {/* 3. 今後のサポート（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 今後のサポート（5分）</h3>
            
            <div className="space-y-2">
              <Label>必要な支援・フォロー</Label>
              <Textarea 
                placeholder="技術指導、メンタルサポート、業務調整など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>次回面談までの目標</Label>
              <Textarea 
                placeholder="習得すべき技術、改善したい点など（1-2個）"
                className="min-h-[60px]"
              />
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <Label className="text-base font-semibold text-yellow-800">緊急度の確認</Label>
              <RadioGroup className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="urgent" id="priority-urgent" />
                  <Label htmlFor="priority-urgent" className="text-red-600">緊急対応必要</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="soon" id="priority-soon" />
                  <Label htmlFor="priority-soon" className="text-orange-600">早期対応推奨</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="priority-normal" />
                  <Label htmlFor="priority-normal">通常フォロー</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <Textarea 
              placeholder="全体的な印象、特に注意すべき点、申し送り事項など"
              className="min-h-[80px]"
            />
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