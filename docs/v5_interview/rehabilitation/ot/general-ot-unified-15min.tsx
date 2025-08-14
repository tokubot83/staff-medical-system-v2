'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MotivationTypeSection, getMotivationTypeQuestions } from '@/docs/v5_interview/components/MotivationType';

export default function GeneralOTUnified15MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-teal-50">
          <CardTitle className="text-2xl">一般作業療法士（2-3年目）定期面談シート V5（15分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：リハビリテーション科</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              15分の簡潔面談です。<strong>動機タイプ判定</strong>と一般作業療法士の現状確認と今後の方向性を確認します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. 現状確認（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 現状確認（5分）</h3>
            
            <div className="space-y-2">
              <Label>最近の成果・スキル向上点</Label>
              <Textarea 
                placeholder="ADL評価技術、認知機能訓練、作業活動選択、患者対応等の向上点"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>現在困っていること・課題</Label>
              <Textarea 
                placeholder="複雑症例への対応、高次脳機能評価、環境調整、記録作成等の課題"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">現在の業務遂行状況</Label>
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="independent" id="work-independent" />
                  <Label htmlFor="work-independent">独立して業務遂行可能</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mostly-independent" id="work-mostly" />
                  <Label htmlFor="work-mostly">ほぼ独立（時々相談）</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="needs-guidance" id="work-guidance" />
                  <Label htmlFor="work-guidance">定期的な指導が必要</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 2. 動機タイプ別質問（5分） */}
          {selectedMotivationType && typeSpecificQuestions.length > 0 && (
            <div className="space-y-4 bg-teal-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg border-b pb-2">2. 動機タイプ別質問（5分）</h3>
              
              <div className="bg-purple-50 p-4 rounded-lg space-y-3">
                <Label className="text-base font-semibold text-purple-700">
                  個別質問（1つ選択して回答）
                </Label>
                <div className="space-y-2">
                  <Label className="text-sm">{typeSpecificQuestions[0]}</Label>
                  <Textarea 
                    placeholder="一般作業療法士としての視点でお答えください"
                    className="min-h-[60px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. 今後の目標（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 今後の目標（5分）</h3>
            
            <div className="space-y-2">
              <Label>短期目標（2-3ヶ月）</Label>
              <Input 
                placeholder="例：高次脳機能評価の習得、複雑症例の担当、専門研修参加"
              />
            </div>

            <div className="space-y-2">
              <Label>専門性の方向性</Label>
              <Textarea 
                placeholder="身体障害、精神障害、認知症、発達障害等の専門分野への関心"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <Textarea 
              placeholder="成長度、専門性向上、今後の指導方針など"
              className="min-h-[80px]"
            />
          </div>

          {/* 提出ボタン */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline">
              一時保存
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700">
              提出
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}