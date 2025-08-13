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

export default function SeniorNurseUnified15MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-2xl">中堅看護師（2-5年目）定期面談シート V5（15分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              15分の簡潔面談です。<strong>動機タイプ判定</strong>と中堅看護師としての役割・成長状況を確認します。
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
              <Label>最近の業務での成果・やりがい</Label>
              <Textarea 
                placeholder="専門性を活かした業務や後輩指導など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>現在の課題・改善したいこと</Label>
              <Textarea 
                placeholder="スキルアップ、業務効率、指導力など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">現在のパフォーマンス</Label>
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excellent" id="perf-excellent" />
                  <Label htmlFor="perf-excellent">優秀</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="good" id="perf-good" />
                  <Label htmlFor="perf-good">良好</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="perf-normal" />
                  <Label htmlFor="perf-normal">標準</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="needs-improvement" id="perf-needs" />
                  <Label htmlFor="perf-needs">要改善</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 2. 動機タイプ別質問（5分） */}
          {selectedMotivationType && typeSpecificQuestions.length > 0 && (
            <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg border-b pb-2">2. 動機タイプ別質問（5分）</h3>
              
              <div className="bg-purple-50 p-4 rounded-lg space-y-3">
                <Label className="text-base font-semibold text-purple-700">
                  個別質問（1つ選択して回答）
                </Label>
                <div className="space-y-2">
                  <Label className="text-sm">{typeSpecificQuestions[0]}</Label>
                  <Textarea 
                    placeholder="中堅看護師としての視点でお答えください"
                    className="min-h-[60px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. 今後のキャリア・サポート（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 今後のキャリア・サポート（5分）</h3>
            
            {/* 動機タイプに基づく推奨アクション */}
            {selectedMotivationType && (
              <Alert className="bg-purple-50 border-purple-200">
                <AlertDescription>
                  <strong>推奨キャリア支援：</strong>
                  {selectedMotivationType === 'growth' && '専門資格取得支援、新分野への挑戦機会提供'}
                  {selectedMotivationType === 'recognition' && 'リーダーシップ機会の提供、成果の積極的評価'}
                  {selectedMotivationType === 'stability' && '専門性を活かした安定したポジション確保'}
                  {selectedMotivationType === 'teamwork' && 'チームリーダー役、後輩指導機会の拡大'}
                  {selectedMotivationType === 'efficiency' && '業務改善プロジェクトのリーダー任命'}
                  {selectedMotivationType === 'compensation' && '昇進機会の明示、専門手当の検討'}
                  {selectedMotivationType === 'creativity' && '新しい取り組みの企画・実施権限の付与'}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label>今後のキャリア目標</Label>
              <Textarea 
                placeholder="専門看護師、管理職、特定分野の専門性など"
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
                  <option value="leadership">リーダーシップ</option>
                  <option value="specialty">専門性強化</option>
                  <option value="teaching">指導力</option>
                  <option value="management">管理能力</option>
                </select>
              </div>
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
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
              placeholder="パフォーマンス評価、強み・課題、キャリア支援方針（簡潔に）"
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