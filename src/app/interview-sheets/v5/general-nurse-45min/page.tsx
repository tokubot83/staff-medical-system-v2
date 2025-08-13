'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { AlertCircle, Save, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MotivationTypeSection } from '@/components/interview/MotivationTypeSection';

export default function GeneralNurseUnified45MinV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const [formData, setFormData] = useState({
    overallEvaluation: '',
    potentialEvaluation: '',
    turnoverRisk: '',
    developmentPlan: '',
    notes: ''
  });

  const handleSave = async () => {
    try {
      // Save motivation type assessment
      if (selectedMotivationType) {
        const assessmentResponse = await fetch('/api/motivation/assess', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            staffId: 123, // This would come from context/props
            motivationTypeId: selectedMotivationType,
            confidenceLevel: 'high',
            notes: '面談時の観察に基づく判定',
            assessedBy: 1 // Current user ID
          })
        });
        
        if (assessmentResponse.ok) {
          alert('動機タイプが保存されました');
        }
      }
      
      // Save interview data
      alert('面談シートが保存されました');
    } catch (error) {
      console.error('Save error:', error);
      alert('保存に失敗しました');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-amber-50">
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileText className="h-6 w-6" />
            一般看護師（2-3年目）定期面談シート V5（45分版）
          </CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              45分の詳細面談です。<strong>動機タイプ判定</strong>を活用し、個別最適化された評価とキャリア開発・成長支援の計画立案を行います。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. 業務遂行状況の詳細評価（10分） */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">1. 業務遂行状況の詳細評価（10分）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <Label className="text-base font-semibold">看護実践能力の詳細評価</Label>
                <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                  <div>評価項目</div>
                  <div>優秀<br/>(5)</div>
                  <div>良好<br/>(4)</div>
                  <div>標準<br/>(3)</div>
                  <div>要改善<br/>(2)</div>
                  <div>不十分<br/>(1)</div>
                </div>
                
                {[
                  '基礎的看護技術の習得状況',
                  '患者アセスメント能力',
                  '看護記録の正確性・適切性',
                  'インシデント発生状況',
                  'チーム内でのコミュニケーション',
                  '後輩指導への参画状況'
                ].map((item, index) => (
                  <div key={index} className="grid grid-cols-6 gap-2 items-center">
                    <div className="text-sm">{item}</div>
                    {[5, 4, 3, 2, 1].map((score) => (
                      <div key={score} className="flex justify-center">
                        <input type="radio" name={`evaluation_${index}`} value={score} className="w-4 h-4" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label>業務上の強みと成長点（具体例を挙げて）</Label>
                <Textarea 
                  placeholder="具体的な事例やエピソードを含めて記述してください..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* 2. 職場適応状況と人間関係（10分） */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">2. 職場適応状況と人間関係（10分）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label className="text-base font-semibold">現在の職場環境についてどう感じていますか？</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very-satisfied" id="very-satisfied" />
                    <Label htmlFor="very-satisfied">とても満足している</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="satisfied" id="satisfied" />
                    <Label htmlFor="satisfied">満足している</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="neutral" id="neutral" />
                    <Label htmlFor="neutral">どちらでもない</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dissatisfied" id="dissatisfied" />
                    <Label htmlFor="dissatisfied">やや不満がある</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very-dissatisfied" id="very-dissatisfied" />
                    <Label htmlFor="very-dissatisfied">不満がある</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>同僚や上司との関係性について教えてください</Label>
                <Textarea 
                  placeholder="人間関係の状況、困っていること、良好な点など..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>ワークライフバランスの状況</Label>
                <Textarea 
                  placeholder="勤務時間、休日の過ごし方、プライベートとの両立状況など..."
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* 3. 学習意欲とキャリア志向（10分） */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">3. 学習意欲とキャリア志向（10分）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>現在取り組んでいる学習や研修について教えてください</Label>
                <Textarea 
                  placeholder="院内研修、外部研修、自己学習、資格取得の取り組みなど..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>今後のキャリア目標や希望について</Label>
                <Textarea 
                  placeholder="3年後、5年後のキャリアビジョン、専門分野の希望など..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">病院で用意してほしい学習支援（複数選択可）</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    '院内研修の充実',
                    '外部研修参加支援',
                    '資格取得支援',
                    'メンター制度',
                    '部署間ローテーション',
                    'eラーニング環境',
                    '専門書籍の充実',
                    '学会参加支援'
                  ].map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox id={`support_${index}`} />
                      <Label htmlFor={`support_${index}`} className="text-sm">{option}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. 総合評価と次期目標設定（10分） */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">4. 総合評価と次期目標設定（10分）</CardTitle>
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
                    <Label htmlFor="eval-excellent">優秀 - 期待を大きく上回る成果</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="eval-good" />
                    <Label htmlFor="eval-good">良好 - 期待を上回る成果</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="eval-standard" />
                    <Label htmlFor="eval-standard">標準 - 期待どおりの成果</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="needs-improvement" id="eval-needs" />
                    <Label htmlFor="eval-needs">要改善 - 期待をやや下回る</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="insufficient" id="eval-insufficient" />
                    <Label htmlFor="eval-insufficient">不十分 - 期待を大きく下回る</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>今期の振り返りと次期に向けた目標設定</Label>
                <Textarea 
                  value={formData.developmentPlan}
                  onChange={(e) => setFormData({...formData, developmentPlan: e.target.value})}
                  placeholder="具体的な目標と達成に向けたアクションプラン..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>面談者所見・コメント</Label>
                <Textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="面談での気づき、推奨事項、フォローアップ計画など..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* 5. アクションプラン（5分） */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">5. アクションプラン（5分）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>短期目標（3ヶ月以内）</Label>
                  <Textarea 
                    placeholder="具体的で測定可能な目標を設定..."
                    className="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>中期目標（6ヶ月以内）</Label>
                  <Textarea 
                    placeholder="キャリア発展に向けた目標..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>病院・上司からのサポート内容</Label>
                <Textarea 
                  placeholder="必要な支援、リソース、フォローアップ計画..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>次回面談予定</Label>
                <Input type="date" className="w-48" />
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