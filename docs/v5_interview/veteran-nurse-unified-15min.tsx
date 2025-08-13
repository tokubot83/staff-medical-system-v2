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

export default function VeteranNurseUnified15MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-purple-50">
          <CardTitle className="text-2xl">ベテラン看護師（6年目以上）定期面談シート V5（15分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              15分の簡潔面談です。<strong>動機タイプ判定</strong>とベテラン看護師としての専門性・リーダーシップを確認します。
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
              <Label>現在の業務での専門性発揮・貢献</Label>
              <Textarea 
                placeholder="専門的ケア、指導、業務改善、チーム運営など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>今後さらに向上・発展させたい領域</Label>
              <Textarea 
                placeholder="専門性の深化、管理スキル、教育能力など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">現在のエンゲージメントレベル</Label>
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="very-high" id="engage-vh" />
                  <Label htmlFor="engage-vh">非常に高い</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="engage-h" />
                  <Label htmlFor="engage-h">高い</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="engage-m" />
                  <Label htmlFor="engage-m">普通</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="engage-l" />
                  <Label htmlFor="engage-l">やや低い</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 2. 動機タイプ別質問（5分） */}
          {selectedMotivationType && typeSpecificQuestions.length > 0 && (
            <div className="space-y-4 bg-purple-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg border-b pb-2">2. 動機タイプ別質問（5分）</h3>
              
              <div className="bg-indigo-50 p-4 rounded-lg space-y-3">
                <Label className="text-base font-semibold text-indigo-700">
                  個別質問（1つ選択して回答）
                </Label>
                <div className="space-y-2">
                  <Label className="text-sm">{typeSpecificQuestions[0]}</Label>
                  <Textarea 
                    placeholder="ベテラン看護師としての経験・視点でお答えください"
                    className="min-h-[60px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. 今後のキャリア・役割（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 今後のキャリア・役割（5分）</h3>
            
            {/* 動機タイプに基づく推奨アクション */}
            {selectedMotivationType && (
              <Alert className="bg-indigo-50 border-indigo-200">
                <AlertDescription>
                  <strong>推奨役割・キャリア支援：</strong>
                  {selectedMotivationType === 'growth' && '新分野への挑戦機会、指導者・教育者としての発展'}
                  {selectedMotivationType === 'recognition' && '専門家としての地位確立、外部講師・委員への推薦'}
                  {selectedMotivationType === 'stability' && '専門性を活かした安定したエキスパートポジション'}
                  {selectedMotivationType === 'teamwork' && 'チーム統括、部署間調整役、メンター制度の中心'}
                  {selectedMotivationType === 'efficiency' && '業務効率化・改善プロジェクトの統括責任者'}
                  {selectedMotivationType === 'compensation' && '管理職昇進、専門手当・役職手当の充実'}
                  {selectedMotivationType === 'creativity' && '新制度・システム設計、イノベーション推進役'}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label>今後の役割・キャリア希望</Label>
              <Textarea 
                placeholder="管理職、専門看護師、教育職、コンサルタントなど"
                className="min-h-[60px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="next-interview">次回面談予定</Label>
                <Input type="date" id="next-interview" />
              </div>
              <div>
                <Label htmlFor="development-focus">重点開発領域</Label>
                <select className="w-full p-2 border rounded">
                  <option value="management">マネジメント</option>
                  <option value="expertise">専門性深化</option>
                  <option value="education">教育・指導</option>
                  <option value="innovation">イノベーション</option>
                </select>
              </div>
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            
            <div className="bg-indigo-50 p-3 rounded-lg">
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
              placeholder="専門性評価、リーダーシップ、キャリア支援方針（簡潔に）"
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