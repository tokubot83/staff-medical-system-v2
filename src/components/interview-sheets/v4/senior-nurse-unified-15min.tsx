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

export default function SeniorNurseUnified15MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-2xl">シニア看護師（11-15年目）定期面談シート（15分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              15分の短時間面談です。シニア看護師の現状確認と重要事項の共有に焦点を当てます。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. リーダーシップと組織貢献（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. リーダーシップと組織貢献（5分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">リーダーシップ発揮状況</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "チーム内リーダーシップ",
                "後輩指導・メンタリング",
                "業務改善への貢献",
                "部署間連携・調整"
              ].map((item, index) => (
                <div key={index} className="grid grid-cols-6 gap-2 items-center">
                  <Label className="text-sm">{item}</Label>
                  {[5, 4, 3, 2, 1].map((value) => (
                    <div key={value} className="flex justify-center">
                      <Input type="radio" name={`leadership-${index}`} value={value} className="w-4 h-4" />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="recent-contributions">最近の主な貢献・成果（簡潔に）</Label>
              <Textarea 
                id="recent-contributions" 
                className="min-h-[60px]"
                placeholder="プロジェクト参画、業務改善、後輩育成等の具体的成果"
              />
            </div>
          </div>

          {/* 2. キャリア発展と今後の方向性（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. キャリア発展と今後の方向性（5分）</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="career-satisfaction">現在のキャリア満足度</Label>
                <RadioGroup defaultValue="">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very-satisfied" id="very-satisfied" />
                    <Label htmlFor="very-satisfied">非常に満足</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="satisfied" id="satisfied" />
                    <Label htmlFor="satisfied">満足</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="neutral" id="neutral" />
                    <Label htmlFor="neutral">どちらでもない</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="considering" id="considering" />
                    <Label htmlFor="considering">変化を検討中</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="next-step">次のキャリアステップ</Label>
                <RadioGroup defaultValue="">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="management" id="management" />
                    <Label htmlFor="management">管理職志向</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="specialist" id="specialist" />
                    <Label htmlFor="specialist">専門性深化</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="educator" id="educator" />
                    <Label htmlFor="educator">教育・指導職</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="current" id="current" />
                    <Label htmlFor="current">現状維持</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="development-needs">スキル開発・研修ニーズ</Label>
              <Textarea 
                id="development-needs" 
                className="min-h-[60px]"
                placeholder="管理スキル、専門資格、研修希望等"
              />
            </div>
          </div>

          {/* 3. 現在の課題とアクション（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 現在の課題とアクション（5分）</h3>
            
            <div className="space-y-2">
              <Label htmlFor="current-challenges">現在直面している主な課題（1-2点）</Label>
              <Textarea 
                id="current-challenges" 
                className="min-h-[60px]"
                placeholder="業務面、人間関係、キャリア等の課題を簡潔に"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="action-plan">次回面談までのアクションプラン</Label>
              <Textarea 
                id="action-plan" 
                className="min-h-[60px]"
                placeholder="具体的な行動計画と期限"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="support-request">組織への要望・必要な支援</Label>
              <Textarea 
                id="support-request" 
                className="min-h-[60px]"
                placeholder="権限委譲、リソース、研修機会等"
              />
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            
            <div className="bg-yellow-50 p-4 rounded-lg space-y-3">
              <div className="space-y-2">
                <Label htmlFor="overall-assessment">総合評価</Label>
                <RadioGroup defaultValue="">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="assess-excellent" />
                    <Label htmlFor="assess-excellent">期待を大きく上回る</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="assess-good" />
                    <Label htmlFor="assess-good">期待を上回る</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="meets" id="assess-meets" />
                    <Label htmlFor="assess-meets">期待通り</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="needs" id="assess-needs" />
                    <Label htmlFor="assess-needs">改善の余地あり</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interviewer-notes">面談者コメント</Label>
                <Textarea 
                  id="interviewer-notes" 
                  className="min-h-[80px]"
                  placeholder="シニア看護師としての成長、今後の期待、キャリア支援方針等"
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