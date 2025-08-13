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

export default function GeneralNurseUnified15MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-amber-50">
          <CardTitle className="text-2xl">一般看護師（2-3年目）定期面談シート V5（15分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              15分の短時間面談です。<strong>動機タイプ判定</strong>を活用した個別最適化された現状把握と、緊急性の高い課題の特定を行います。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 新規追加: 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. 現在の業務状況（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 現在の業務状況（5分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">業務遂行能力の評価</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "看護技術・スキル",
                "患者対応力",
                "チーム連携",
                "業務遂行能力"
              ].map((item) => (
                <RadioGroup key={item}>
                  <div className="grid grid-cols-6 gap-2 items-center">
                    <span className="text-sm font-medium">{item}</span>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-5`} id={`${item}-5`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-4`} id={`${item}-4`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-3`} id={`${item}-3`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-2`} id={`${item}-2`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-1`} id={`${item}-1`} className="w-4 h-4" />
                    </div>
                  </div>
                </RadioGroup>
              ))}
              <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded">
                <p><strong>評価基準：</strong></p>
                <p><span className="text-green-600 font-medium">5：</span>期待を大きく超える　<span className="text-blue-600 font-medium">4：</span>期待を超える　<span className="text-yellow-600 font-medium">3：</span>期待通り　<span className="text-orange-600 font-medium">2：</span>やや期待以下　<span className="text-red-600 font-medium">1：</span>期待以下</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>現在の業務内容と自己評価</Label>
              <Textarea 
                placeholder="担当業務、役割、自立度、チームへの貢献など簡潔に記入"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>この半年で成長したと感じる点</Label>
              <Textarea 
                placeholder="看護技術、患者対応、リーダーシップなど具体的に"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 2. 職員の現状確認（モチベーション・健康・エンゲージメント）（5分） */}
          <div className="space-y-4 bg-green-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 職員の現状確認（モチベーション・健康・エンゲージメント）（5分）</h3>
            
            {/* 動機タイプ別の簡潔な質問（15分版は1つのみ） */}
            {selectedMotivationType && typeSpecificQuestions.length > 0 && (
              <div className="bg-purple-50 p-3 rounded-lg space-y-2 mb-4">
                <Label className="text-base font-semibold text-purple-700">
                  動機タイプに基づく個別質問（簡潔版）
                </Label>
                <div className="space-y-2">
                  <Label className="text-sm">{typeSpecificQuestions[0]}</Label>
                  <Textarea 
                    placeholder="簡潔にお答えください"
                    className="min-h-[50px]"
                  />
                </div>
              </div>
            )}
            
            {/* モチベーションと満足度 */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">モチベーションと満足度</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "現在のモチベーション",
                "職場満足度"
              ].map((item) => (
                <RadioGroup key={item}>
                  <div className="grid grid-cols-6 gap-2 items-center">
                    <span className="text-sm font-medium">{item}</span>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-5`} id={`${item}-5`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-4`} id={`${item}-4`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-3`} id={`${item}-3`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-2`} id={`${item}-2`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-1`} id={`${item}-1`} className="w-4 h-4" />
                    </div>
                  </div>
                </RadioGroup>
              ))}
              <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded mt-3">
                <p><strong>評価基準：</strong></p>
                <p><span className="text-green-600 font-medium">5：</span>非常に高い/満足　<span className="text-blue-600 font-medium">4：</span>高い/満足　<span className="text-yellow-600 font-medium">3：</span>普通　<span className="text-orange-600 font-medium">2：</span>低い/やや不満　<span className="text-red-600 font-medium">1：</span>非常に低い/不満</p>
              </div>
            </div>

            {/* 健康・ストレス・エンゲージメント */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">健康・ストレス・エンゲージメント</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "健康状態",
                "ストレスレベル",
                "3年後の継続意向"
              ].map((item) => (
                <RadioGroup key={item}>
                  <div className="grid grid-cols-6 gap-2 items-center">
                    <span className="text-sm font-medium">{item}</span>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-5`} id={`${item}-5`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-4`} id={`${item}-4`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-3`} id={`${item}-3`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-2`} id={`${item}-2`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-1`} id={`${item}-1`} className="w-4 h-4" />
                    </div>
                  </div>
                </RadioGroup>
              ))}
              <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded mt-3">
                <p><strong>評価基準：</strong></p>
                <p><span className="font-medium">健康状態：</span><span className="text-green-600 font-medium">5：</span>非常に良好　<span className="text-blue-600 font-medium">4：</span>良好　<span className="text-yellow-600 font-medium">3：</span>普通　<span className="text-orange-600 font-medium">2：</span>やや不調　<span className="text-red-600 font-medium">1：</span>不調</p>
                <p><span className="font-medium">ストレス：</span><span className="text-green-600 font-medium">5：</span>非常に低い　<span className="text-blue-600 font-medium">4：</span>低い　<span className="text-yellow-600 font-medium">3：</span>普通　<span className="text-orange-600 font-medium">2：</span>高い　<span className="text-red-600 font-medium">1：</span>非常に高い</p>
                <p><span className="font-medium">継続意向：</span><span className="text-green-600 font-medium">5：</span>ぜひ続けたい　<span className="text-blue-600 font-medium">4：</span>続けたい　<span className="text-yellow-600 font-medium">3：</span>わからない　<span className="text-orange-600 font-medium">2：</span>転職検討　<span className="text-red-600 font-medium">1：</span>転職活動中</p>
              </div>
            </div>
          </div>

          {/* 3. 現在の課題・必要なサポート（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 現在の課題・必要なサポート（3分）</h3>
            
            <div className="space-y-2">
              <Label>現在困っていること・不安なこと（最重要事項）</Label>
              <Textarea 
                placeholder="最も困っていることや不安な点を1-2つ簡潔に記入"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>必要なサポート（最優先のもの1つ）</Label>
              <RadioGroup>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="skill-training" id="support-skill" />
                    <Label htmlFor="support-skill" className="ml-2">技術研修・スキル向上</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="career" id="support-career" />
                    <Label htmlFor="support-career" className="ml-2">キャリア相談</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="workload" id="support-workload" />
                    <Label htmlFor="support-workload" className="ml-2">業務量調整</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="mental" id="support-mental" />
                    <Label htmlFor="support-mental" className="ml-2">メンタルケア</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="team" id="support-team" />
                    <Label htmlFor="support-team" className="ml-2">チーム環境改善</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="other" id="support-other" />
                    <Label htmlFor="support-other" className="ml-2">その他</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 4. 次回までのアクション（2分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 次回までのアクション（2分）</h3>
            
            {/* 動機タイプに基づく推奨アクション（簡潔版） */}
            {selectedMotivationType && (
              <Alert className="bg-purple-50 border-purple-200">
                <AlertDescription>
                  <strong>動機タイプに基づく推奨アクション：</strong>
                  <div className="mt-1 text-sm">
                    {selectedMotivationType === 'growth' && 'スキルアップ研修への参加を推奨'}
                    {selectedMotivationType === 'recognition' && '成果の可視化・表彰の機会を検討'}
                    {selectedMotivationType === 'stability' && '安定した環境でのスキル定着を支援'}
                    {selectedMotivationType === 'teamwork' && 'チーム業務での活躍機会を提供'}
                    {selectedMotivationType === 'efficiency' && '業務効率化の取り組みに参加'}
                    {selectedMotivationType === 'compensation' && '昇給・昇進の機会について説明'}
                    {selectedMotivationType === 'creativity' && '独自のアプローチを評価・支援'}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label>次回面談までの具体的目標（1つ）</Label>
              <Textarea 
                placeholder="1-2ヶ月で達成可能な具体的目標を記入"
                className="min-h-[60px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="next-interview">次回面談予定</Label>
                <Input type="date" id="next-interview" />
              </div>
              <div>
                <Label htmlFor="follow-method">フォロー方法</Label>
                <Input type="text" id="follow-method" placeholder="月次1on1など" />
              </div>
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            
            {/* 動機タイプの記録 */}
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
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>成長度評価</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="growth-excellent" />
                    <Label htmlFor="growth-excellent" className="ml-1 text-sm">期待以上</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="growth-good" />
                    <Label htmlFor="growth-good" className="ml-1 text-sm">順調</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="needs-support" id="growth-support" />
                    <Label htmlFor="growth-support" className="ml-1 text-sm">要支援</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>ポテンシャル</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="potential-high" />
                    <Label htmlFor="potential-high" className="ml-1 text-sm">高</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="potential-medium" />
                    <Label htmlFor="potential-medium" className="ml-1 text-sm">中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="potential-low" />
                    <Label htmlFor="potential-low" className="ml-1 text-sm">低</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>離職リスク</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="risk-low" />
                    <Label htmlFor="risk-low" className="ml-1 text-sm">低</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="risk-medium" />
                    <Label htmlFor="risk-medium" className="ml-1 text-sm">中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="risk-high" />
                    <Label htmlFor="risk-high" className="ml-1 text-sm">高</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <Textarea 
              placeholder="特記事項、動機タイプを考慮した個別支援方針、緊急対応が必要な事項があれば記入"
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