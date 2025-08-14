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

export default function GeneralSTUnified15MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-indigo-50">
          <CardTitle className="text-2xl">一般言語聴覚士（2-3年目）定期面談シート V5（15分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：リハビリテーション科</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              15分の簡潔面談です。<strong>動機タイプ判定</strong>と一般言語聴覚士としての技術習得状況を確認します。
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
              <Label>最近の臨床で成長したこと・できるようになったこと</Label>
              <Textarea 
                placeholder="言語機能評価、嚥下機能評価、失語症訓練、構音訓練、患者コミュニケーション、症例理解など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>困っていること・改善したいこと</Label>
              <Textarea 
                placeholder="高次脳機能評価、摂食嚥下リハビリ、小児言語発達、記録・報告、訓練プログラム立案など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">現在の業務遂行状況</Label>
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excellent" id="perform-excellent" />
                  <Label htmlFor="perform-excellent">優秀（期待以上の成果）</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="good" id="perform-good" />
                  <Label htmlFor="perform-good">良好（安定した業務遂行）</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="perform-normal" />
                  <Label htmlFor="perform-normal">標準（指導下で業務遂行）</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="needs-support" id="perform-support" />
                  <Label htmlFor="perform-support">要支援（密な指導が必要）</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 2. 動機タイプ別質問（5分） */}
          {selectedMotivationType && typeSpecificQuestions.length > 0 && (
            <div className="space-y-4 bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg border-b pb-2">2. 動機タイプ別質問（5分）</h3>
              
              <div className="bg-purple-50 p-4 rounded-lg space-y-3">
                <Label className="text-base font-semibold text-purple-700">
                  個別質問（1つ選択して回答）
                </Label>
                <div className="space-y-2">
                  <Label className="text-sm">{typeSpecificQuestions[0]}</Label>
                  <Textarea 
                    placeholder="言語聴覚士としての視点でお答えください"
                    className="min-h-[60px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. 今後の成長目標（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 今後の成長目標（5分）</h3>
            
            <div className="space-y-2">
              <Label>短期目標（1ヶ月）</Label>
              <Input 
                placeholder="例：VF画像読影精度向上、失語症重症度分類の習得、小児発達検査の実施"
              />
            </div>

            <div className="space-y-2">
              <Label>専門性を伸ばしたい領域</Label>
              <Textarea 
                placeholder="失語症、構音障害、嚥下障害、小児言語発達、聴覚障害、高次脳機能障害など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>必要なサポート</Label>
              <Textarea 
                placeholder="症例検討、技術指導、研修参加、専門書籍、機器操作練習など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <Textarea 
              placeholder="本人の成長度、技術習得状況、課題、今後の指導方針など"
              className="min-h-[80px]"
            />
          </div>

          {/* 提出ボタン */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline">
              一時保存
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              提出
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}