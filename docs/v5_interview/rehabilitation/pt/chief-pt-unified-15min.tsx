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

export default function ChiefPTUnified15MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-emerald-50">
          <CardTitle className="text-2xl">主任理学療法士定期面談シート V5（15分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>就任年数：＿＿年　担当部署：リハビリテーション科</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              15分の簡潔面談です。<strong>動機タイプ判定</strong>と主任理学療法士としての管理・指導業務を確認します。
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
              <Label>最近の管理業務での成果・やりがい</Label>
              <Textarea 
                placeholder="PT部門運営、スタッフ指導・育成、業務改善・効率化、多職種連携の成果など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>現在の課題・改善したいこと</Label>
              <Textarea 
                placeholder="マネジメントスキル、スタッフ教育体制、業務標準化、部門間連携など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">現在のマネジメント状況</Label>
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excellent" id="mgmt-excellent" />
                  <Label htmlFor="mgmt-excellent">非常に良好（模範的運営）</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="good" id="mgmt-good" />
                  <Label htmlFor="mgmt-good">良好（安定した部門運営）</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="mgmt-standard" />
                  <Label htmlFor="mgmt-standard">標準（基本的な管理業務遂行）</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="challenging" id="mgmt-challenging" />
                  <Label htmlFor="mgmt-challenging">課題あり（改善が必要）</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 2. 動機タイプ別質問（5分） */}
          {selectedMotivationType && typeSpecificQuestions.length > 0 && (
            <div className="space-y-4 bg-emerald-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg border-b pb-2">2. 動機タイプ別質問（5分）</h3>
              
              <div className="bg-green-50 p-4 rounded-lg space-y-3">
                <Label className="text-base font-semibold text-green-700">
                  個別質問（1つ選択して回答）
                </Label>
                <div className="space-y-2">
                  <Label className="text-sm">{typeSpecificQuestions[0]}</Label>
                  <Textarea 
                    placeholder="主任理学療法士としてのマネジメント・指導の視点でお答えください"
                    className="min-h-[60px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. 今後のマネジメント・サポート（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 今後のマネジメント・サポート（5分）</h3>
            
            {/* 動機タイプに基づく推奨アクション */}
            {selectedMotivationType && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription>
                  <strong>推奨マネジメント支援：</strong>
                  <div className="mt-1 text-sm">
                    {selectedMotivationType === 'growth' && 'マネジメント研修参加、新技術・手法の部門導入推進'}
                    {selectedMotivationType === 'recognition' && '部門運営成果の可視化、上級管理職からの評価機会'}
                    {selectedMotivationType === 'stability' && '管理体制の標準化、安定したマネジメント手順の整備'}
                    {selectedMotivationType === 'teamwork' && 'PT部門チームビルディング、他部門との連携強化'}
                    {selectedMotivationType === 'efficiency' && '部門業務の効率化推進、システム・ツール活用促進'}
                    {selectedMotivationType === 'compensation' && '管理職手当の充実、上級管理職への昇進機会明示'}
                    {selectedMotivationType === 'creativity' && '独自のマネジメント手法支援、革新的な部門運営の推進'}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label>今後のマネジメント目標・部門ビジョン</Label>
              <Textarea 
                placeholder="PT部門運営、スタッフ育成体制、質向上、業務効率化の目標など"
                className="min-h-[60px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="next-interview">次回面談予定</Label>
                <Input type="date" id="next-interview" />
              </div>
              <div>
                <Label htmlFor="support-focus">重点支援領域</Label>
                <select className="w-full p-2 border rounded">
                  <option value="staff-management">スタッフマネジメント</option>
                  <option value="quality-improvement">質向上・標準化</option>
                  <option value="education-training">教育・研修体制</option>
                  <option value="efficiency">業務効率化</option>
                  <option value="collaboration">多職種連携</option>
                </select>
              </div>
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg">面談者所見</h3>
            
            <div className="bg-green-50 p-3 rounded-lg">
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
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>マネジメント評価</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="eval-excellent" />
                    <Label htmlFor="eval-excellent" className="ml-1 text-sm">優秀</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="eval-good" />
                    <Label htmlFor="eval-good" className="ml-1 text-sm">良好</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="needs-support" id="eval-support" />
                    <Label htmlFor="eval-support" className="ml-1 text-sm">要支援</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>指導力</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="leadership-high" />
                    <Label htmlFor="leadership-high" className="ml-1 text-sm">高</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="leadership-medium" />
                    <Label htmlFor="leadership-medium" className="ml-1 text-sm">中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="leadership-low" />
                    <Label htmlFor="leadership-low" className="ml-1 text-sm">低</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>組織貢献度</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="contribution-high" />
                    <Label htmlFor="contribution-high" className="ml-1 text-sm">高</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="contribution-medium" />
                    <Label htmlFor="contribution-medium" className="ml-1 text-sm">中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="contribution-low" />
                    <Label htmlFor="contribution-low" className="ml-1 text-sm">低</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <Textarea 
              placeholder="マネジメント評価、部門運営状況、支援方針（簡潔に）"
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