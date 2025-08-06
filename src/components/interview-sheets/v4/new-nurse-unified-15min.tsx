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

export default function NewNurseUnified15MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-pink-50">
          <CardTitle className="text-2xl">新人看護師（1年目）定期面談シート（15分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>入職日：＿＿＿＿年＿＿月＿＿日　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              15分の短時間面談です。新人看護師の適応状況と緊急サポートが必要な課題を特定することを目的とします。
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
                "患者・家族対応",
                "チームメンバーとの関係"
              ].map((item, index) => (
                <div key={index} className="grid grid-cols-6 gap-2 items-center">
                  <Label className="text-sm">{item}</Label>
                  {[5, 4, 3, 2, 1].map((value) => (
                    <div key={value} className="flex justify-center">
                      <Input type="radio" name={`adaptation-${index}`} value={value} className="w-4 h-4" />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="adaptation-concerns">現在特に困っていること・不安に感じていること</Label>
              <Textarea 
                id="adaptation-concerns" 
                className="min-h-[60px]"
                placeholder="職場環境、人間関係、技術面等で困っていることを具体的に記入"
              />
            </div>
          </div>

          {/* 2. 学習進捗と健康状態（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. 学習進捗と健康状態（5分）</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="learning-progress">新人研修・OJTの進捗</Label>
                <RadioGroup defaultValue="">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ahead" id="ahead" />
                    <Label htmlFor="ahead">予定より進んでいる</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ontrack" id="ontrack" />
                    <Label htmlFor="ontrack">予定通り</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="behind" id="behind" />
                    <Label htmlFor="behind">やや遅れている</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delayed" id="delayed" />
                    <Label htmlFor="delayed">大幅に遅れている</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="health-status">心身の健康状態</Label>
                <RadioGroup defaultValue="">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="excellent" />
                    <Label htmlFor="excellent">良好</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="good" />
                    <Label htmlFor="good">概ね良好</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tired" id="tired" />
                    <Label htmlFor="tired">やや疲れている</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="concerning" id="concerning" />
                    <Label htmlFor="concerning">要注意・要サポート</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="immediate-needs">すぐに必要なサポート・フォロー事項</Label>
              <Textarea 
                id="immediate-needs" 
                className="min-h-[60px]"
                placeholder="技術指導、メンタルサポート、業務調整など緊急性の高い事項を記入"
              />
            </div>
          </div>

          {/* 3. 今後の目標とアクションプラン（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 今後の目標とアクションプラン（5分）</h3>
            
            <div className="space-y-2">
              <Label htmlFor="short-term-goal">次回面談までの短期目標（1つ）</Label>
              <Input 
                id="short-term-goal" 
                placeholder="具体的で達成可能な目標を1つ設定"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="action-plan">具体的なアクションプラン</Label>
              <Textarea 
                id="action-plan" 
                className="min-h-[60px]"
                placeholder="目標達成のための具体的な行動計画"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="support-needed">必要な支援・フォロー体制</Label>
              <Textarea 
                id="support-needed" 
                className="min-h-[60px]"
                placeholder="プリセプター、先輩看護師、管理者からの支援内容"
              />
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            
            <div className="bg-yellow-50 p-4 rounded-lg space-y-3">
              <div className="space-y-2">
                <Label htmlFor="overall-assessment">総合評価と緊急対応の必要性</Label>
                <RadioGroup defaultValue="">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="assess-good" />
                    <Label htmlFor="assess-good">順調に適応している</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="watch" id="assess-watch" />
                    <Label htmlFor="assess-watch">経過観察が必要</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="support" id="assess-support" />
                    <Label htmlFor="assess-support">追加サポートが必要</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="urgent" id="assess-urgent" />
                    <Label htmlFor="assess-urgent">緊急介入が必要</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interviewer-notes">面談者コメント</Label>
                <Textarea 
                  id="interviewer-notes" 
                  className="min-h-[80px]"
                  placeholder="新人看護師の状況、必要な支援、次回面談までの注意点など"
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