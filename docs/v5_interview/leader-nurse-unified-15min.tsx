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

export default function LeaderNurseUnified15MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-red-50">
          <CardTitle className="text-2xl">師長・管理職看護師定期面談シート V5（15分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>就任年数：＿＿年　管轄部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              15分の簡潔面談です。<strong>動機タイプ判定</strong>と師長・管理職としての戦略的マネジメントを確認します。
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
              <Label>最近の部署運営・組織マネジメントでの成果</Label>
              <Textarea 
                placeholder="部署業績、スタッフ育成、組織改革、他部署連携など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>現在の戦略的課題・改善したいこと</Label>
              <Textarea 
                placeholder="組織運営、人事戦略、業績向上、改革推進など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">現在の組織運営状況</Label>
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excellent" id="org-excellent" />
                  <Label htmlFor="org-excellent">非常に良好</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="good" id="org-good" />
                  <Label htmlFor="org-good">良好</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="org-normal" />
                  <Label htmlFor="org-normal">標準</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="challenging" id="org-challenging" />
                  <Label htmlFor="org-challenging">課題あり</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 2. 動機タイプ別質問（5分） */}
          {selectedMotivationType && typeSpecificQuestions.length > 0 && (
            <div className="space-y-4 bg-red-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg border-b pb-2">2. 動機タイプ別質問（5分）</h3>
              
              <div className="bg-rose-50 p-4 rounded-lg space-y-3">
                <Label className="text-base font-semibold text-rose-700">
                  個別質問（1つ選択して回答）
                </Label>
                <div className="space-y-2">
                  <Label className="text-sm">{typeSpecificQuestions[0]}</Label>
                  <Textarea 
                    placeholder="師長・管理職としての組織運営・戦略の視点でお答えください"
                    className="min-h-[60px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. 今後の戦略・組織支援（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 今後の戦略・組織支援（5分）</h3>
            
            {/* 動機タイプに基づく推奨アクション */}
            {selectedMotivationType && (
              <Alert className="bg-rose-50 border-rose-200">
                <AlertDescription>
                  <strong>推奨戦略支援：</strong>
                  {selectedMotivationType === 'growth' && '組織変革リーダーシップ、新事業・新制度の推進権限'}
                  {selectedMotivationType === 'recognition' && '組織成果の外部発信、上級管理職・理事会での評価'}
                  {selectedMotivationType === 'stability' && '安定的組織運営体制の構築、リスク管理の強化'}
                  {selectedMotivationType === 'teamwork' && '組織間連携の強化、統合的マネジメント体制の構築'}
                  {selectedMotivationType === 'efficiency' && '組織全体の効率化推進、戦略的システム導入の主導'}
                  {selectedMotivationType === 'compensation' && '管理職報酬の充実、経営参画機会の拡大'}
                  {selectedMotivationType === 'creativity' && '独自の組織運営手法の導入、イノベーション推進の権限'}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label>今後の組織運営・戦略目標</Label>
              <Textarea 
                placeholder="部署発展、人材戦略、業績向上、組織変革など"
                className="min-h-[60px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="next-interview">次回面談予定</Label>
                <Input type="date" id="next-interview" />
              </div>
              <div>
                <Label htmlFor="strategic-focus">戦略重点領域</Label>
                <select className="w-full p-2 border rounded">
                  <option value="performance">業績向上</option>
                  <option value="transformation">組織変革</option>
                  <option value="talent">人材戦略</option>
                  <option value="innovation">イノベーション</option>
                </select>
              </div>
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            
            <div className="bg-rose-50 p-3 rounded-lg">
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
              placeholder="リーダーシップ評価、戦略的思考、組織への影響力（簡潔に）"
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