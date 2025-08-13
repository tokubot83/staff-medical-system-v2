'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { AlertCircle, Save, FileText, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MotivationTypeSection } from '@/components/interview/MotivationTypeSection';

export default function GeneralNurseUnified30MinV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const [formData, setFormData] = useState({
    overallEvaluation: '',
    potentialEvaluation: '',
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
            confidenceLevel: 'high',
            notes: '標準面談での観察',
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
            一般看護師（2-3年目）標準面談シート V5（30分版）
          </CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              30分の標準面談です。<strong>動機タイプ判定</strong>を活用し、バランスの取れた評価と成長支援を行います。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. 業務評価と成長確認（10分） */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">1. 業務評価と成長確認（10分）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                <Label className="text-base font-semibold">看護実践能力評価</Label>
                <div className="grid grid-cols-5 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                  <div>評価項目</div>
                  <div>優秀<br/>(4)</div>
                  <div>良好<br/>(3)</div>
                  <div>標準<br/>(2)</div>
                  <div>要改善<br/>(1)</div>
                </div>
                
                {[
                  '看護技術の習得・実践',
                  'アセスメント能力',
                  'チームワーク・協調性',
                  '学習意欲・自己啓発'
                ].map((item, index) => (
                  <div key={index} className="grid grid-cols-5 gap-2 items-center">
                    <div className="text-sm">{item}</div>
                    {[4, 3, 2, 1].map((score) => (
                      <div key={score} className="flex justify-center">
                        <input type="radio" name={`eval_${index}`} value={score} className="w-4 h-4" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label>前回面談からの成長・改善点</Label>
                <Textarea 
                  placeholder="具体的な成長事例や改善された点..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>現在の課題・改善が必要な分野</Label>
                <Textarea 
                  placeholder="技術面、知識面、態度面での課題..."
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* 2. 職場適応と将来展望（10分） */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">2. 職場適応と将来展望（10分）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label className="text-base font-semibold">現在の職場環境について</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very-satisfied" id="workplace-very-satisfied" />
                    <Label htmlFor="workplace-very-satisfied">とても満足</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="satisfied" id="workplace-satisfied" />
                    <Label htmlFor="workplace-satisfied">満足</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="neutral" id="workplace-neutral" />
                    <Label htmlFor="workplace-neutral">普通</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dissatisfied" id="workplace-dissatisfied" />
                    <Label htmlFor="workplace-dissatisfied">やや不満</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very-dissatisfied" id="workplace-very-dissatisfied" />
                    <Label htmlFor="workplace-very-dissatisfied">不満</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>今後1年間で達成したい目標</Label>
                <Textarea 
                  placeholder="スキル向上、資格取得、役割拡大など..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">学習・成長支援のニーズ（複数選択可）</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    '専門研修の受講',
                    '他部署での研修',
                    '資格取得支援',
                    'メンタリング制度',
                    '業務効率化ツール',
                    'チームリーダー経験'
                  ].map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox id={`need_${index}`} />
                      <Label htmlFor={`need_${index}`} className="text-sm">{option}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>ワークライフバランスの状況</Label>
                <Textarea 
                  placeholder="現在の勤務状況、プライベートとの両立..."
                  className="min-h-[60px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* 3. 評価とアクションプラン（8分） */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">3. 評価とアクションプラン（8分）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label className="text-base font-semibold">総合評価</Label>
                <RadioGroup 
                  value={formData.overallEvaluation}
                  onValueChange={(value) => setFormData({...formData, overallEvaluation: value})}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="eval-excellent" />
                    <Label htmlFor="eval-excellent">優秀 - 期待を大きく上回る</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="eval-good" />
                    <Label htmlFor="eval-good">良好 - 期待を上回る</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="eval-standard" />
                    <Label htmlFor="eval-standard">標準 - 期待どおり</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="needs-improvement" id="eval-needs" />
                    <Label htmlFor="eval-needs">要改善 - 支援が必要</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">将来性評価</Label>
                <RadioGroup 
                  value={formData.potentialEvaluation}
                  onValueChange={(value) => setFormData({...formData, potentialEvaluation: value})}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="potential-high" />
                    <Label htmlFor="potential-high">高い - リーダー候補</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="potential-moderate" />
                    <Label htmlFor="potential-moderate">中程度 - 安定した成長</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="developing" id="potential-developing" />
                    <Label htmlFor="potential-developing">成長中 - 継続支援必要</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>短期目標（3ヶ月）</Label>
                  <Textarea 
                    placeholder="具体的で測定可能な目標..."
                    className="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>中期目標（6ヶ月）</Label>
                  <Textarea 
                    placeholder="スキル向上、役割拡大など..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>面談者所見・推奨事項</Label>
                <Textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="総合的な所見、推奨アクション、フォローアップ計画..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>次回面談予定</Label>
                <Input type="date" className="w-48" />
              </div>
            </CardContent>
          </Card>

          {/* 4. フォローアップ事項（2分） */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">4. フォローアップ事項（2分）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">重要なフォローアップ</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="follow1" />
                    <Label htmlFor="follow1">1週間以内の個別フォロー</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="follow2" />
                    <Label htmlFor="follow2">学習リソースの提供</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="follow3" />
                    <Label htmlFor="follow3">他部門との連携調整</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="follow4" />
                    <Label htmlFor="follow4">研修プログラムの案内</Label>
                  </div>
                </div>
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