'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Save, FileText, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MotivationTypeSection } from '@/components/interview/MotivationTypeSection';

export default function GeneralNurseUnified15MinV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const [formData, setFormData] = useState({
    overallEvaluation: '',
    notes: ''
  });

  const handleSave = async () => {
    try {
      if (selectedMotivationType) {
        await fetch('/api/motivation/assess', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            staffId: 123,
            motivationTypeId: selectedMotivationType,
            confidenceLevel: 'medium',
            notes: '簡易面談での観察',
            assessedBy: 1
          })
        });
      }
      
      alert('面談シートが保存されました');
    } catch (error) {
      console.error('Save error:', error);
      alert('保存に失敗しました');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Clock className="h-6 w-6" />
            一般看護師（2-3年目）簡易面談シート V5（15分版）
          </CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              15分の簡易面談です。<strong>動機タイプ判定</strong>で基本的な傾向を把握し、要点を絞った評価を行います。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. 現状確認と課題把握（8分） */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">1. 現状確認と課題把握（8分）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label className="text-base font-semibold">現在の業務状況はいかがですか？</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very-good" id="status-very-good" />
                    <Label htmlFor="status-very-good">とても順調</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="status-good" />
                    <Label htmlFor="status-good">概ね順調</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="neutral" id="status-neutral" />
                    <Label htmlFor="status-neutral">普通</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="challenging" id="status-challenging" />
                    <Label htmlFor="status-challenging">やや課題がある</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="difficult" id="status-difficult" />
                    <Label htmlFor="status-difficult">困難を感じている</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>最近の業務で気になっていることはありますか？</Label>
                <Textarea 
                  placeholder="課題、不安、改善したいことなど簡潔に..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>職場環境や人間関係について</Label>
                <Textarea 
                  placeholder="現在の状況を簡潔に..."
                  className="min-h-[60px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* 2. 簡易評価とフォローアップ（5分） */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">2. 簡易評価とフォローアップ（5分）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label className="text-base font-semibold">総合的な評価</Label>
                <RadioGroup 
                  value={formData.overallEvaluation}
                  onValueChange={(value) => setFormData({...formData, overallEvaluation: value})}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="eval-excellent" />
                    <Label htmlFor="eval-excellent">優秀 - 期待を上回る</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="eval-good" />
                    <Label htmlFor="eval-good">良好 - 期待どおり</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="eval-standard" />
                    <Label htmlFor="eval-standard">標準 - 概ね期待どおり</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="needs-attention" id="eval-needs" />
                    <Label htmlFor="eval-needs">要注意 - フォローが必要</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>短期的な目標・アクションプラン</Label>
                <Textarea 
                  placeholder="今後1-2ヶ月の具体的な目標..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>面談者所見</Label>
                <Textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="簡潔な所見、今後の対応方針..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>次回面談予定</Label>
                <Input type="date" className="w-48" />
              </div>
            </CardContent>
          </Card>

          {/* 3. クイックアクション（2分） */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">3. クイックアクション（2分）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">すぐに実行できるアクション</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="action1" />
                    <Label htmlFor="action1">定期的な1on1の設定</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="action2" />
                    <Label htmlFor="action2">具体的なフィードバックの提供</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="action3" />
                    <Label htmlFor="action3">学習リソースの紹介</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="action4" />
                    <Label htmlFor="action4">チーム内での役割調整</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>緊急対応が必要な事項</Label>
                <Textarea 
                  placeholder="即座に対応すべき課題があれば記入..."
                  className="min-h-[60px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* 保存ボタン */}
          <div className="flex gap-4 pt-6">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              面談内容を保存
            </Button>
            <Button variant="outline">
              PDFで出力
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}