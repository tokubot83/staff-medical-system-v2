'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { AlertCircle, Save, FileText, Star } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MotivationTypeSection } from '@/components/interview/MotivationTypeSection';

export default function NewNurseUnified45MinV5() {
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
      if (selectedMotivationType) {
        const assessmentResponse = await fetch('/api/motivation/assess', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            staffId: 123,
            motivationTypeId: selectedMotivationType,
            confidenceLevel: 'high',
            notes: '新人面談時の観察に基づく判定',
            assessedBy: 1
          })
        });
        
        if (assessmentResponse.ok) {
          alert('動機タイプが保存されました');
        }
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
        <CardHeader className="bg-green-50">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Star className="h-6 w-6" />
            新人看護師（1年目）定期面談シート V5（45分版）
          </CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>入職年月日：＿＿年＿＿月＿＿日　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              新人看護師向けの詳細面談です。<strong>動機タイプ判定</strong>により、個人に最適化された指導計画と成長支援を行います。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. 看護基礎技術の習得状況評価（12分） */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">1. 看護基礎技術の習得状況評価（12分）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg space-y-3">
                <Label className="text-base font-semibold">新人看護師基本技術チェックリスト</Label>
                <div className="grid grid-cols-5 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                  <div>評価項目</div>
                  <div>習得済み<br/>(4)</div>
                  <div>概ね習得<br/>(3)</div>
                  <div>要指導<br/>(2)</div>
                  <div>未習得<br/>(1)</div>
                </div>
                
                {[
                  'バイタルサイン測定',
                  '注射・点滴の準備と実施',
                  '採血技術',
                  '記録・報告（電子カルテ）',
                  '感染予防対策の実践',
                  '患者コミュニケーション',
                  '緊急時の対応・報告',
                  'チーム内報連相'
                ].map((item, index) => (
                  <div key={index} className="grid grid-cols-5 gap-2 items-center">
                    <div className="text-sm">{item}</div>
                    {[4, 3, 2, 1].map((score) => (
                      <div key={score} className="flex justify-center">
                        <input type="radio" name={`skill_${index}`} value={score} className="w-4 h-4" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label>技術習得で特に良い点・成長した点</Label>
                <Textarea 
                  placeholder="具体的な成長事例やエピソードを記述してください..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>今後重点的に指導が必要な技術・分野</Label>
                <Textarea 
                  placeholder="優先的に習得すべき技術と指導計画..."
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* 2. 職場適応状況と精神的サポート（10分） */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">2. 職場適応状況と精神的サポート（10分）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label className="text-base font-semibold">現在の職場環境への適応状況</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very-good" id="adapt-very-good" />
                    <Label htmlFor="adapt-very-good">とても良く適応している</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="adapt-good" />
                    <Label htmlFor="adapt-good">概ね適応している</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="adjusting" id="adapt-adjusting" />
                    <Label htmlFor="adapt-adjusting">徐々に慣れてきている</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="struggling" id="adapt-struggling" />
                    <Label htmlFor="adapt-struggling">まだ慣れていない部分が多い</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="difficult" id="adapt-difficult" />
                    <Label htmlFor="adapt-difficult">適応に困難を感じている</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>プリセプターや先輩との関係について</Label>
                <Textarea 
                  placeholder="指導を受ける際の状況、質問のしやすさ、困っていることなど..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>ストレスや不安を感じる場面・対処法</Label>
                <Textarea 
                  placeholder="具体的なストレス要因と現在の対処方法、必要なサポート..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">プライベートとの両立状況</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="balanced" id="life-balanced" />
                    <Label htmlFor="life-balanced">うまく両立できている</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="manageable" id="life-manageable" />
                    <Label htmlFor="life-manageable">なんとか両立している</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="difficult" id="life-difficult" />
                    <Label htmlFor="life-difficult">両立が困難</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* 3. 学習意欲と成長目標（8分） */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">3. 学習意欲と成長目標（8分）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>現在積極的に学習していること</Label>
                <Textarea 
                  placeholder="自己学習、研修参加、資格取得の取り組みなど..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>今後身につけたいスキル・知識</Label>
                <Textarea 
                  placeholder="専門分野への興味、習得したい技術、キャリア目標など..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">学習支援として希望するもの（複数選択可）</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    '個別指導時間の増加',
                    'シミュレーション研修',
                    '他部署見学・研修',
                    '外部研修参加',
                    'eラーニング環境',
                    '参考書籍の紹介',
                    '勉強会の開催',
                    'メンター制度'
                  ].map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox id={`learning_${index}`} />
                      <Label htmlFor={`learning_${index}`} className="text-sm">{option}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. 総合評価と指導計画（10分） */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">4. 総合評価と指導計画（10分）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label className="text-base font-semibold">現在の総合評価</Label>
                <RadioGroup 
                  value={formData.overallEvaluation}
                  onValueChange={(value) => setFormData({...formData, overallEvaluation: value})}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="eval-excellent" />
                    <Label htmlFor="eval-excellent">優秀 - 期待を大きく上回る成長</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="eval-good" />
                    <Label htmlFor="eval-good">良好 - 期待を上回る成長</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="eval-standard" />
                    <Label htmlFor="eval-standard">標準 - 期待どおりの成長</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="needs-support" id="eval-needs" />
                    <Label htmlFor="eval-needs">要支援 - 追加指導が必要</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="concerning" id="eval-concerning" />
                    <Label htmlFor="eval-concerning">要注意 - 集中的支援が必要</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">将来性・ポテンシャル評価</Label>
                <RadioGroup 
                  value={formData.potentialEvaluation}
                  onValueChange={(value) => setFormData({...formData, potentialEvaluation: value})}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="potential-high" />
                    <Label htmlFor="potential-high">高い - 将来の成長が大いに期待される</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="potential-moderate" />
                    <Label htmlFor="potential-moderate">中程度 - 着実な成長が期待される</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="needs-guidance" id="potential-needs" />
                    <Label htmlFor="potential-needs">要指導 - 適切な指導により成長可能</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>今後3ヶ月の重点指導計画</Label>
                <Textarea 
                  value={formData.developmentPlan}
                  onChange={(e) => setFormData({...formData, developmentPlan: e.target.value})}
                  placeholder="具体的な指導目標、方法、スケジュール..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>面談者所見・特記事項</Label>
                <Textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="面談での気づき、本人の特性、家族への配慮事項など..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* 5. フォローアップ計画（5分） */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">5. フォローアップ計画（5分）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>短期目標（1ヶ月以内）</Label>
                  <Textarea 
                    placeholder="習得すべき基本技術、克服すべき課題..."
                    className="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>中期目標（3ヶ月以内）</Label>
                  <Textarea 
                    placeholder="独立して実施できる業務範囲の拡大..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>プリセプター・指導者からのサポート内容</Label>
                <Textarea 
                  placeholder="指導方法、フォローアップ頻度、リソース提供..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>次回面談予定日</Label>
                <Input type="date" className="w-48" />
              </div>

              <div className="space-y-2">
                <Label>緊急時連絡先・相談窓口の確認</Label>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  <p>• プリセプター：＿＿＿＿＿（内線：＿＿＿＿）</p>
                  <p>• 主任：＿＿＿＿＿（内線：＿＿＿＿）</p>
                  <p>• 新人サポートセンター：内線＿＿＿＿</p>
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