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

export default function LeaderNurseUnified15MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-emerald-50">
          <CardTitle className="text-2xl">リーダー看護師 定期面談シート（15分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>リーダー経験：＿＿年＿＿ヶ月　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              15分の短時間面談です。リーダー看護師の日々の業務状況と緊急課題を確認します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. リーダー業務遂行状況（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. リーダー業務遂行状況（5分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">リーダー能力評価</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "日勤リーダー業務",
                "チーム調整力",
                "優先順位判断",
                "緊急対応力"
              ].map((item, index) => (
                <div key={index} className="grid grid-cols-6 gap-2 items-center">
                  <Label className="text-sm">{item}</Label>
                  {[5, 4, 3, 2, 1].map((value) => (
                    <div key={value} className="flex justify-center">
                      <Input type="radio" name={`leader-${index}`} value={value} className="w-4 h-4" />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="current-challenges">現在の課題・困難事項</Label>
              <Textarea 
                id="current-challenges" 
                className="min-h-[60px]"
                placeholder="リーダー業務での困難、チーム内の問題等"
              />
            </div>
          </div>

          {/* 2. チームワークとコミュニケーション（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. チームワークとコミュニケーション（5分）</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="team-coordination">チーム内調整</Label>
                <RadioGroup defaultValue="">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="team-excellent" />
                    <Label htmlFor="team-excellent">円滑</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="team-good" />
                    <Label htmlFor="team-good">良好</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fair" id="team-fair" />
                    <Label htmlFor="team-fair">普通</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="difficult" id="team-difficult" />
                    <Label htmlFor="team-difficult">困難</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stress-level">業務ストレス</Label>
                <RadioGroup defaultValue="">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="stress-low" />
                    <Label htmlFor="stress-low">低い</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="manageable" id="stress-manageable" />
                    <Label htmlFor="stress-manageable">管理可能</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="stress-high" />
                    <Label htmlFor="stress-high">高い</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excessive" id="stress-excessive" />
                    <Label htmlFor="stress-excessive">過度</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="communication-issues">コミュニケーション上の課題</Label>
              <Textarea 
                id="communication-issues" 
                className="min-h-[60px]"
                placeholder="医師との連携、他部署調整、スタッフ間の問題等"
              />
            </div>
          </div>

          {/* 3. サポートニーズと目標（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. サポートニーズと目標（5分）</h3>
            
            <div className="space-y-2">
              <Label htmlFor="immediate-support">必要な即時サポート</Label>
              <Textarea 
                id="immediate-support" 
                className="min-h-[60px]"
                placeholder="技術指導、権限付与、上司介入等"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="short-term-goal">今月の重点目標</Label>
              <Input 
                id="short-term-goal" 
                placeholder="リーダーとして達成したい目標"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skill-development">スキルアップ希望領域</Label>
              <Textarea 
                id="skill-development" 
                className="min-h-[60px]"
                placeholder="リーダーシップ研修、コミュニケーション技術等"
              />
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            
            <div className="bg-yellow-50 p-4 rounded-lg space-y-3">
              <div className="space-y-2">
                <Label htmlFor="leader-readiness">リーダー適性評価</Label>
                <RadioGroup defaultValue="">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="ready-excellent" />
                    <Label htmlFor="ready-excellent">優秀</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="ready-good" />
                    <Label htmlFor="ready-good">適性あり</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="developing" id="ready-developing" />
                    <Label htmlFor="ready-developing">成長中</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="needs-support" id="ready-needs" />
                    <Label htmlFor="ready-needs">要支援</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interviewer-notes">面談者コメント</Label>
                <Textarea 
                  id="interviewer-notes" 
                  className="min-h-[80px]"
                  placeholder="リーダーとしての成長、支援事項、次回確認点等"
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