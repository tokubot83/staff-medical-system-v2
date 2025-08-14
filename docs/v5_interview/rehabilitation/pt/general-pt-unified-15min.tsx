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

export default function GeneralPTUnified15MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-emerald-50">
          <CardTitle className="text-2xl">一般理学療法士（2-3年目）定期面談シート V5（15分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：リハビリテーション科</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              15分の簡潔面談です。<strong>動機タイプ判定</strong>と一般理学療法士としての技術習得状況を確認します。
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
                placeholder="評価技術、治療手技、患者コミュニケーション、症例の理解など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>困っていること・改善したいこと</Label>
              <Textarea 
                placeholder="運動療法、ADL指導、記録・報告、治療プログラム立案など"
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
            <div className="space-y-4 bg-emerald-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg border-b pb-2">2. 動機タイプ別質問（5分）</h3>
              
              <div className="bg-purple-50 p-4 rounded-lg space-y-3">
                <Label className="text-base font-semibold text-purple-700">
                  個別質問（1つ選択して回答）
                </Label>
                <div className="space-y-2">
                  <Label className="text-sm">{typeSpecificQuestions[0]}</Label>
                  <Textarea 
                    placeholder="理学療法士としての視点でお答えください"
                    className="min-h-[60px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. 次回までの目標・サポート（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 次回までの目標・サポート（5分）</h3>
            
            {/* 動機タイプに基づく推奨アクション */}
            {selectedMotivationType && (
              <Alert className="bg-purple-50 border-purple-200">
                <AlertDescription>
                  <strong>推奨支援アクション：</strong>
                  <div className="mt-1 text-sm">
                    {selectedMotivationType === 'growth' && '新しい治療技術の研修参加、症例検討会での発表機会'}
                    {selectedMotivationType === 'recognition' && '技術向上の成果を評価・表彰、院内発表の機会提供'}
                    {selectedMotivationType === 'stability' && '基本技術の安定習得、段階的な症例担当'}
                    {selectedMotivationType === 'teamwork' && 'チーム医療での役割拡大、多職種連携業務への参加'}
                    {selectedMotivationType === 'efficiency' && '効率的な治療プロトコール習得、業務改善への参加'}
                    {selectedMotivationType === 'compensation' && '昇進要件の明示、専門資格取得支援'}
                    {selectedMotivationType === 'creativity' && '新しいアプローチの試行、創意工夫の評価'}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label>短期目標（1-2ヶ月）</Label>
              <Input 
                placeholder="例：ROM測定精度向上、歩行分析技術習得、症例報告書作成"
              />
            </div>

            <div className="space-y-2">
              <Label>必要なサポート</Label>
              <Textarea 
                placeholder="先輩PTからの技術指導、症例検討会参加、研修・勉強会受講など"
                className="min-h-[60px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="next-interview">次回面談予定</Label>
                <Input type="date" id="next-interview" />
              </div>
              <div>
                <Label htmlFor="follow-method">フォロー方法</Label>
                <Input type="text" id="follow-method" placeholder="週次指導など" />
              </div>
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg">面談者所見</h3>
            
            <div className="bg-purple-50 p-3 rounded-lg">
              <Label>判定された動機タイプ</Label>
              <Input 
                type="text" 
                value={selectedMotivationType ? 
                  `${selectedMotivationType === 'growth' ? '成長・挑戦型' : ''}${selectedMotivationType === 'recognition' ? '評価・承認型' : ''}${selectedMotivationType === 'stability' ? '安定・安心型' : ''}${selectedMotivationType === 'teamwork' ? '関係・調和型' : ''}${selectedMotivationType === 'efficiency' ? '効率・合理型' : ''}${selectedMotivationType === 'compensation' ? '報酬・待遇型' : ''}${selectedMotivationType === 'creativity' ? '自由・創造型' : ''}` 
                  : '未判定'
                } 
                readOnly 
                className="mt-1 bg-white"
              />
            </div>
            
            <Textarea 
              placeholder="技術習得状況、成長度、課題、今後の指導方針など"
              className="min-h-[80px]"
            />
          </div>

          {/* 提出ボタン */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline">
              一時保存
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              提出
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}