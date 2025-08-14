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
import { MotivationTypeSection, getMotivationTypeQuestions } from '../../components/MotivationType';

export default function NewSTUnified15MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-indigo-50">
          <CardTitle className="text-2xl">新人言語聴覚士（1年目）定期面談シート V5（15分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>入職月数：＿＿ヶ月　配属部署：リハビリテーション科</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              15分の簡潔面談です。<strong>動機タイプ判定</strong>と新人言語聴覚士の基本的な適応状況を確認します。
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
              <Label>最近の臨床で良かったこと・できるようになったこと</Label>
              <Textarea 
                placeholder="言語機能評価、構音訓練、嚥下評価、失語症評価、患者・家族対応など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>困っていること・不安なこと</Label>
              <Textarea 
                placeholder="言語機能の判断、嚥下機能評価、失語症の評価・訓練プログラム立案、記録など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">現在の適応状況</Label>
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="good" id="adapt-good" />
                  <Label htmlFor="adapt-good">良好（独立して基本業務可能）</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="adapt-normal" />
                  <Label htmlFor="adapt-normal">普通（指導下で業務遂行）</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="concern" id="adapt-concern" />
                  <Label htmlFor="adapt-concern">要支援（密な指導が必要）</Label>
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

          {/* 3. 次回までの目標（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 次回までの目標（5分）</h3>
            
            <div className="space-y-2">
              <Label>短期目標（1ヶ月）</Label>
              <Input 
                placeholder="例：構音検査の習得、嚥下内視鏡検査の介助、失語症スクリーニングの精度向上"
              />
            </div>

            <div className="space-y-2">
              <Label>必要なサポート</Label>
              <Textarea 
                placeholder="先輩からの技術指導、症例検討、検査・評価方法の学習、摂食嚥下リハの見学など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <Textarea 
              placeholder="本人の成長度、課題、今後の指導方針など"
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