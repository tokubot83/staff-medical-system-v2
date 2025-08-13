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
import { MotivationTypeSection, getMotivationTypeQuestions } from './components/MotivationType';

export default function ChiefNurseUnified15MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-orange-50">
          <CardTitle className="text-2xl">主任看護師定期面談シート V5（15分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>就任年数：＿＿年　担当部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              15分の簡潔面談です。<strong>動機タイプ判定</strong>と主任看護師としての管理・指導業務を確認します。
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
                placeholder="チーム運営、スタッフ指導、業務改善の成果など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>現在の課題・改善したいこと</Label>
              <Textarea 
                placeholder="管理スキル、スタッフマネジメント、業務効率化など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">現在のマネジメント状況</Label>
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excellent" id="mgmt-excellent" />
                  <Label htmlFor="mgmt-excellent">非常に良好</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="good" id="mgmt-good" />
                  <Label htmlFor="mgmt-good">良好</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="mgmt-normal" />
                  <Label htmlFor="mgmt-normal">標準</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="challenging" id="mgmt-challenging" />
                  <Label htmlFor="mgmt-challenging">課題あり</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 2. 動機タイプ別質問（5分） */}
          {selectedMotivationType && typeSpecificQuestions.length > 0 && (
            <div className="space-y-4 bg-orange-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg border-b pb-2">2. 動機タイプ別質問（5分）</h3>
              
              <div className="bg-amber-50 p-4 rounded-lg space-y-3">
                <Label className="text-base font-semibold text-amber-700">
                  個別質問（1つ選択して回答）
                </Label>
                <div className="space-y-2">
                  <Label className="text-sm">{typeSpecificQuestions[0]}</Label>
                  <Textarea 
                    placeholder="主任看護師としての管理・指導の視点でお答えください"
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
              <Alert className="bg-amber-50 border-amber-200">
                <AlertDescription>
                  <strong>推奨マネジメント支援：</strong>
                  {selectedMotivationType === 'growth' && '管理スキル向上研修、新しいマネジメント手法の導入'}
                  {selectedMotivationType === 'recognition' && '管理成果の可視化、上級管理職からの評価機会'}
                  {selectedMotivationType === 'stability' && '管理体制の安定化、標準的な管理手順の整備'}
                  {selectedMotivationType === 'teamwork' && 'チームビルディング支援、部署間連携の強化'}
                  {selectedMotivationType === 'efficiency' && '管理業務の効率化、システム活用の推進'}
                  {selectedMotivationType === 'compensation' && '管理職手当の充実、昇進機会の明示'}
                  {selectedMotivationType === 'creativity' && '独自の管理アプローチの尊重、革新的取り組みの支援'}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label>今後のマネジメント目標</Label>
              <Textarea 
                placeholder="部署運営、スタッフ育成、業務改善の目標など"
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
                  <option value="performance">業績管理</option>
                  <option value="development">人材育成</option>
                  <option value="innovation">業務革新</option>
                </select>
              </div>
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            
            <div className="bg-amber-50 p-3 rounded-lg">
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
              placeholder="マネジメント能力評価、リーダーシップ、組織貢献度（簡潔に）"
              className="min-h-[80px]"
            />
          </div>

          {/* 保存ボタン */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button variant="outline">一時保存</Button>
            <Button>面談記録を保存</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}