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

export default function VeteranSTUnified15MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-indigo-50">
          <CardTitle className="text-2xl">ベテラン言語聴覚士（11年目以上）定期面談シート V5（15分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年　配属部署：リハビリテーション科</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              15分の簡潔面談です。<strong>動機タイプ判定</strong>とベテラン言語聴覚士としての専門性・指導力・組織貢献を確認します。
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
              <Label>最近の業務での主要な成果・組織貢献</Label>
              <Textarea 
                placeholder="高度な専門性発揮、後輩・中堅指導、チームマネジメント、研究・学会活動、組織改善提案など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>現在の課題・今後挑戦したいこと</Label>
              <Textarea 
                placeholder="新たな専門性習得、次世代育成、組織革新、地域連携、研究活動など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">ベテランSTとしての役割発揮</Label>
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="outstanding" id="role-outstanding" />
                  <Label htmlFor="role-outstanding">卓越（組織の核として大きく貢献）</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excellent" id="role-excellent" />
                  <Label htmlFor="role-excellent">優秀（専門性と指導力を充分発揮）</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="good" id="role-good" />
                  <Label htmlFor="role-good">良好（安定して期待役割を遂行）</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="needs-improvement" id="role-improvement" />
                  <Label htmlFor="role-improvement">要改善（さらなる発展が必要）</Label>
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
                    placeholder="ベテラン言語聴覚士としての豊富な経験と洞察でお答えください"
                    className="min-h-[60px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. 今後のビジョン（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 今後のビジョン（5分）</h3>
            
            <div className="space-y-2">
              <Label>短期目標（6ヶ月）</Label>
              <Input 
                placeholder="例：新しい専門領域開拓、組織改革プロジェクト、次世代リーダー育成"
              />
            </div>

            <div className="space-y-2">
              <Label>専門性・指導力のさらなる発展</Label>
              <Textarea 
                placeholder="得意分野での専門性の極め、後進の育成方法、組織全体への影響力向上など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>必要なサポート</Label>
              <Textarea 
                placeholder="組織からの権限委譲、リソース配分、外部ネットワーキング支援など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <Textarea 
              placeholder="専門性の極め方、指導力、組織への影響力、今後の期待役割、キャリアパスなど"
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