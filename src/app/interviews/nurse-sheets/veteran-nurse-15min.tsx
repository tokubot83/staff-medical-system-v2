'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';

export default function VeteranNurse15MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-purple-50">
          <CardTitle className="text-2xl">11年以上ベテラン看護師 定期面談シート（15分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. 現況と満足度（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 現況と満足度（3分）</h3>
            
            <div className="space-y-2">
              <Label>職務満足度</Label>
              <RadioGroup>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="satisfaction-high" />
                    <Label htmlFor="satisfaction-high" className="ml-2">高い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="normal" id="satisfaction-normal" />
                    <Label htmlFor="satisfaction-normal" className="ml-2">普通</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="satisfaction-low" />
                    <Label htmlFor="satisfaction-low" className="ml-2">低い</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>組織への貢献実感</Label>
              <RadioGroup>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <RadioGroupItem value="strong" id="contribution-strong" />
                    <Label htmlFor="contribution-strong" className="ml-2">強く感じる</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="some" id="contribution-some" />
                    <Label htmlFor="contribution-some" className="ml-2">まあ感じる</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="weak" id="contribution-weak" />
                    <Label htmlFor="contribution-weak" className="ml-2">あまり感じない</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 2. 専門性と役割（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. 専門性と役割（5分）</h3>
            
            <div className="space-y-2">
              <Label>現在の専門領域・強み</Label>
              <Textarea 
                placeholder="長年培った専門性、得意分野"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>知識・技術の伝承活動</Label>
              <Textarea 
                placeholder="後輩指導、教育活動、ノウハウ共有"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織への提言・改善活動</Label>
              <Textarea 
                placeholder="業務改善、提案、委員会活動など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 3. 今後の働き方（4分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 今後の働き方（4分）</h3>
            
            <div className="space-y-2">
              <Label>体力・健康面の不安</Label>
              <RadioGroup>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <RadioGroupItem value="none" id="health-none" />
                    <Label htmlFor="health-none" className="ml-2">特になし</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="some" id="health-some" />
                    <Label htmlFor="health-some" className="ml-2">少しある</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="significant" id="health-significant" />
                    <Label htmlFor="health-significant" className="ml-2">かなりある</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>希望する働き方</Label>
              <Textarea 
                placeholder="勤務形態、業務内容、役割の希望"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 4. 今後の支援（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 今後の支援（3分）</h3>
            
            <div className="space-y-2">
              <Label>組織に期待すること</Label>
              <Textarea 
                placeholder="環境整備、役割調整、評価など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>次回までの取り組み</Label>
              <Textarea 
                placeholder="継続すること、新たに始めること"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <Textarea 
              placeholder="健康状態、モチベーション、今後の活用方針など"
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