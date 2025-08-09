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

export default function ChiefNurseUnified15MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-indigo-50">
          <CardTitle className="text-2xl">病棟師長 定期面談シート（15分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>役職経験：＿＿年＿＿ヶ月　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              15分の短時間面談です。病棟師長の管理業務状況と緊急課題を確認します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. チーム管理状況（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. チーム管理状況（5分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">管理能力評価</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "チーム運営",
                "スタッフ指導",
                "業務調整",
                "問題解決"
              ].map((item, index) => (
                <div key={index} className="grid grid-cols-6 gap-2 items-center">
                  <Label className="text-sm">{item}</Label>
                  {[5, 4, 3, 2, 1].map((value) => (
                    <div key={value} className="flex justify-center">
                      <Input type="radio" name={`management-${index}`} value={value} className="w-4 h-4" />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-issues">チーム内の緊急課題</Label>
              <Textarea 
                id="team-issues" 
                className="min-h-[60px]"
                placeholder="人員配置、スタッフトラブル、業務上の問題等"
              />
            </div>
          </div>

          {/* 2. 上位管理者との連携（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. 上位管理者との連携（5分）</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="communication-quality">師長との連携状況</Label>
                <RadioGroup defaultValue="">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="comm-excellent" />
                    <Label htmlFor="comm-excellent">非常に良好</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="comm-good" />
                    <Label htmlFor="comm-good">良好</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fair" id="comm-fair" />
                    <Label htmlFor="comm-fair">普通</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="needs-improvement" id="comm-needs" />
                    <Label htmlFor="comm-needs">要改善</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workload">業務負荷</Label>
                <RadioGroup defaultValue="">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="manageable" id="load-manageable" />
                    <Label htmlFor="load-manageable">適正</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="slightly-high" id="load-slightly" />
                    <Label htmlFor="load-slightly">やや多い</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="load-high" />
                    <Label htmlFor="load-high">多い</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excessive" id="load-excessive" />
                    <Label htmlFor="load-excessive">過多</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="support-needs">必要なサポート・権限</Label>
              <Textarea 
                id="support-needs" 
                className="min-h-[60px]"
                placeholder="権限委譲、上位承認、リソース等"
              />
            </div>
          </div>

          {/* 3. 今後の目標とアクション（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 今後の目標とアクション（5分）</h3>
            
            <div className="space-y-2">
              <Label htmlFor="priority-goal">最優先目標（1つ）</Label>
              <Input 
                id="priority-goal" 
                placeholder="今月の最重要達成事項"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="action-plan">具体的アクション</Label>
              <Textarea 
                id="action-plan" 
                className="min-h-[60px]"
                placeholder="目標達成のための具体的行動"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skill-development">管理スキル向上計画</Label>
              <Textarea 
                id="skill-development" 
                className="min-h-[60px]"
                placeholder="研修参加、自己学習、メンタリング等"
              />
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            
            <div className="bg-yellow-50 p-4 rounded-lg space-y-3">
              <div className="space-y-2">
                <Label htmlFor="overall-assessment">主任としての適性評価</Label>
                <RadioGroup defaultValue="">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="assess-excellent" />
                    <Label htmlFor="assess-excellent">非常に高い</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="assess-good" />
                    <Label htmlFor="assess-good">高い</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="developing" id="assess-developing" />
                    <Label htmlFor="assess-developing">成長中</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="needs-support" id="assess-needs" />
                    <Label htmlFor="assess-needs">要支援</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interviewer-notes">面談者コメント</Label>
                <Textarea 
                  id="interviewer-notes" 
                  className="min-h-[80px]"
                  placeholder="管理職としての成長、緊急対応事項、次回確認点等"
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