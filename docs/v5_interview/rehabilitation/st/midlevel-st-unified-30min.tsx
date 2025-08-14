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
import { MotivationTypeSection, getMotivationTypeQuestions } from '../../components/MotivationType';

export default function MidlevelSTUnified30MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-indigo-50">
          <CardTitle className="text-2xl">中堅言語聴覚士（4-10年目）定期面談シート V5（30分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年　配属部署：リハビリテーション科</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              30分の標準面談です。<strong>動機タイプ判定</strong>を活用し、中堅言語聴覚士の専門性とリーダーシップを詳細評価します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. ST専門性・リーダーシップ評価（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. ST専門性・リーダーシップ評価（8分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">中堅STとしての専門能力評価</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "言語聴覚療法技術の専門性",
                "複雑症例への対応能力",
                "後輩指導・教育能力",
                "チームリーダーシップ",
                "研究・学会活動",
                "多職種連携・調整力",
                "業務管理・効率化",
                "問題解決・改善提案能力"
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

            <div className="space-y-2">
              <Label>現在の主要業務と成果</Label>
              <Textarea 
                placeholder="担当症例の複雑度、専門性発揮、チーム貢献、指導実績、研究活動等"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>中堅STとしてのやりがい・成長実感</Label>
              <Textarea 
                placeholder="専門性を生かした貢献、后輩育成の手応え、チーム内での役割等"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. 動機タイプ別詳細確認（8分） */}
          <div className="space-y-4 bg-indigo-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 動機タイプ別詳細確認（8分）</h3>
            
            {/* 動機タイプ別の質問 */}
            {selectedMotivationType && typeSpecificQuestions.length > 0 && (
              <div className="bg-purple-50 p-3 rounded-lg space-y-2 mb-4">
                <Label className="text-base font-semibold text-purple-700">
                  動機タイプに基づく個別質問（中堅ST版）
                </Label>
                <div className="space-y-3">
                  {typeSpecificQuestions.slice(0, 2).map((question, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-sm">{question}</Label>
                      <Textarea 
                        placeholder="中堅言語聴覚士としての経験と専門性を踏まえてお答えください"
                        className="min-h-[60px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <Label className="text-base font-semibold">現在の課題・改善したいこと</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "専門技術のさらなる向上",
                  "後輩指導方法の改善",
                  "チームマネジメントスキル",
                  "研究・学会活動の充実",
                  "業務効率化・時間管理",
                  "新技術・知識の習得",
                  "多職種連携の強化",
                  "ワークライフバランス",
                  "教育・研修体制の整備",
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

          {/* 3. 中長期目標設定とキャリアプラン（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 中長期目標設定とキャリアプラン（8分）</h3>
            
            <div className="space-y-2">
              <Label>短期目標（3ヶ月以内）</Label>
              <Input 
                placeholder="例：専門資格取得、新人教育プログラム構築、症例研究発表"
              />
            </div>

            <div className="space-y-2">
              <Label>中期目標（6ヶ月以内）</Label>
              <Input 
                placeholder="例：チームリーダーとしての役割確立、院内研修講師、専門外来担当"
              />
            </div>

            <div className="space-y-2">
              <Label>長期目標（1年以内）</Label>
              <Input 
                placeholder="例：管理職候補、学会発表・研究活動、地域連携体制構築"
              />
            </div>

            <div className="space-y-2">
              <Label>キャリアビジョン</Label>
              <Textarea 
                placeholder="5年後の目標：管理職、専門分野リーダー、研究者、教育者等の方向性"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>必要なサポート・研修</Label>
              <Textarea 
                placeholder="マネジメント研修、高度な専門技術研修、学会発表支援、研究指導等"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織・上司への要望</Label>
              <Textarea 
                placeholder="役割・責任の明確化、権限委譲、評価・待遇改善、キャリアパス提示等"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. その他・自由記述（6分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. その他・自由記述（6分）</h3>
            
            <div className="space-y-2">
              <Label>職場環境・制度改善提案</Label>
              <Textarea 
                placeholder="中堅STとして感じる組織の課題、改善提案、制度改革の意見等"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>その他（自由記述）</Label>
              <Textarea 
                placeholder="上記以外で相談したいこと、提案、要望等があれば自由にお書きください"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <Textarea 
              placeholder="専門性の発揮度、リーダーシップ、成長ポテンシャル、今後の期待役割、キャリアパス等"
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