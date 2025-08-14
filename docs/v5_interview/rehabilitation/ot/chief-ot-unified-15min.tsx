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

export default function ChiefOTUnified15MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-teal-50">
          <CardTitle className="text-2xl">主任作業療法士定期面談シート V5（15分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>就任年数：＿＿年　担当部署：リハビリテーション科</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              15分の簡潔面談です。<strong>動機タイプ判定</strong>と主任作業療法士のマネジメント状況と部門運営を確認します。
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
              <Label>OT部門の運営成果・管理業務の状況</Label>
              <Textarea 
                placeholder="部門統括、スタッフ管理、業務効率化、質向上、目標達成状況等"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>現在のマネジメント課題・改善点</Label>
              <Textarea 
                placeholder="人材育成、業務改善、多職種連携、リソース管理、組織課題等"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">部門運営の状況</Label>
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excellent" id="mgmt-excellent" />
                  <Label htmlFor="mgmt-excellent">目標を上回る成果</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="good" id="mgmt-good" />
                  <Label htmlFor="mgmt-good">順調に運営</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="challenging" id="mgmt-challenging" />
                  <Label htmlFor="mgmt-challenging">課題に対応中</Label>
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
                    placeholder="主任作業療法士としてのマネジメント視点でお答えください"
                    className="min-h-[60px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. 部門発展・組織戦略（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 部門発展・組織戦略（5分）</h3>
            
            <div className="space-y-2">
              <Label>短期運営目標（3ヶ月）</Label>
              <Input 
                placeholder="例：スタッフ育成、業務改善、質向上、連携強化"
              />
            </div>

            <div className="space-y-2">
              <Label>OT部門の将来ビジョン</Label>
              <Textarea 
                placeholder="部門発展計画、組織貢献、人材育成、専門性向上等の戦略"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <Textarea 
              placeholder="マネジメント能力、リーダーシップ、部門運営、今後の支援方針など"
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