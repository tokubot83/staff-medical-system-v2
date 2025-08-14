'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MotivationTypeSection, getMotivationTypeQuestions } from '@/docs/v5_interview/components/MotivationType';

export default function NewSTUnified30MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-indigo-50">
          <CardTitle className="text-2xl">新人言語聴覚士（1年目）定期面談シート V5（30分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>入職月数：＿＿ヶ月　配属部署：リハビリテーション科</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              30分の標準面談です。<strong>動機タイプ判定</strong>を活用し、新人言語聴覚士の成長状況と適応度を詳しく評価します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. 言語聴覚療法実践能力の評価（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 言語聴覚療法実践能力の評価（8分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">ST技術・専門能力の評価</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "言語機能評価・訓練",
                "嚥下機能評価・訓練",
                "構音障害評価・訓練",
                "失語症評価・訓練",
                "患者・家族対応",
                "多職種連携・チーム医療",
                "記録・報告書作成"
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
                <p><span className="text-green-600 font-medium">5：</span>期待を大きく超える　<span className="text-blue-600 font-medium">4：</span>期待を超える　<span className="text-yellow-600 font-medium">3：</span>期待通り　<span className="text-orange-600 font-medium">2：</span>やや期待以下　<span className="text-red-600 font-medium">1：</span>期待以下</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>現在の主要担当業務と達成状況</Label>
              <Textarea 
                placeholder="担当患者数、疾患領域（失語症、構音障害、嚥下障害など）、症例の複雑度、達成度、貢献内容などを詳しく記入"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>この半年で成長したと感じる点</Label>
              <Textarea 
                placeholder="検査技術向上、評価能力、患者・家族対応、チーム貢献など具体的に"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. 職員の現状確認（モチベーション・健康・エンゲージメント）（8分） */}
          <div className="space-y-4 bg-indigo-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 職員の現状確認（モチベーション・健康・エンゲージメント）（8分）</h3>
            
            {/* 動機タイプ別の質問 */}
            {selectedMotivationType && typeSpecificQuestions.length > 0 && (
              <div className="bg-purple-50 p-3 rounded-lg space-y-2 mb-4">
                <Label className="text-base font-semibold text-purple-700">
                  動機タイプに基づく個別質問（詳細版）
                </Label>
                <div className="space-y-3">
                  {typeSpecificQuestions.slice(0, 2).map((question, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-sm">{question}</Label>
                      <Textarea 
                        placeholder="言語聴覚士としての視点で詳しくお答えください"
                        className="min-h-[60px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* モチベーションと満足度 */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">モチベーションと満足度</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "現在のモチベーション",
                "職場満足度",
                "仕事のやりがい",
                "同僚との関係",
                "上司からのサポート"
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
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">現在の課題・困っていること</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "言語機能評価の判断",
                  "嚥下機能の評価・判定",
                  "失語症の症状理解",
                  "構音訓練の進め方",
                  "検査結果の解釈",
                  "患者・家族への説明",
                  "記録の書き方",
                  "多職種との連携",
                  "時間管理",
                  "その他"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox id={item} />
                    <Label htmlFor={item} className="text-sm">{item}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. 成長目標設定とサポート（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 成長目標設定とサポート（8分）</h3>
            
            <div className="space-y-2">
              <Label>短期目標（1ヶ月以内）</Label>
              <Input 
                placeholder="例：構音検査の正確性向上、失語症スクリーニング手順の習得"
              />
            </div>

            <div className="space-y-2">
              <Label>中期目標（3ヶ月以内）</Label>
              <Input 
                placeholder="例：嚥下内視鏡検査の独立実施、認知症患者へのコミュニケーション支援"
              />
            </div>

            <div className="space-y-2">
              <Label>長期目標（6ヶ月以内）</Label>
              <Input 
                placeholder="例：小児言語発達評価の習得、摂食嚥下リハビリテーション計画立案"
              />
            </div>

            <div className="space-y-2">
              <Label>必要なサポート・研修・学習内容</Label>
              <Textarea 
                placeholder="先輩からの指導内容、参加したい研修、学びたい検査技術、症例検討など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>上司・先輩への要望</Label>
              <Textarea 
                placeholder="指導方法、フィードバック、サポート体制に関する要望など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. その他・自由記述（6分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. その他・自由記述（6分）</h3>
            
            <div className="space-y-2">
              <Label>職場環境・制度に関する意見・要望</Label>
              <Textarea 
                placeholder="勤務体制、設備、研修制度、評価制度などについて"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>その他（自由記述）</Label>
              <Textarea 
                placeholder="上記以外で相談したいこと、伝えたいことがあれば自由にお書きください"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <Textarea 
              placeholder="本人の成長度、適応状況、課題、今後の指導方針、フォロー計画など"
              className="min-h-[120px]"
            />
            <div className="space-y-2">
              <Label className="text-sm font-medium">次回面談予定日</Label>
              <Input type="date" className="w-48" />
            </div>
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