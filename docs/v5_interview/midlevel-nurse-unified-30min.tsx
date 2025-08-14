'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MotivationTypeSection, getMotivationTypeQuestions } from './components/MotivationType';

export default function MidlevelNurseUnified30MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-2xl">中堅看護師（4-10年目）定期面談シート V5（30分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              30分の標準面談です。<strong>動機タイプ判定</strong>を活用し、中堅看護師の専門性向上とキャリア支援を行います。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. 専門性とパフォーマンス評価（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 専門性とパフォーマンス評価（8分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">中堅看護師としての能力評価</Label>
              <div className="grid grid-cols-5 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">優秀</div>
                <div className="bg-blue-100 px-2 py-1 rounded">良好</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">標準</div>
                <div className="bg-red-100 px-2 py-1 rounded">要改善</div>
              </div>
              
              {[
                "専門的看護技術",
                "患者ケアの質",
                "チームワーク",
                "後輩指導",
                "問題解決能力",
                "リーダーシップ",
                "業務効率性"
              ].map((item) => (
                <RadioGroup key={item}>
                  <div className="grid grid-cols-5 gap-2 items-center">
                    <span className="text-sm font-medium">{item}</span>
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
            </div>

            <div className="space-y-2">
              <Label>最近の業務での成果・実績</Label>
              <Textarea 
                placeholder="質の高い看護ケア、業務改善、後輩指導の成果など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>さらなるスキル向上が必要な領域</Label>
              <Textarea 
                placeholder="専門技術、指導力、管理能力など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. モチベーション・キャリア志向（10分） */}
          <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. モチベーション・キャリア志向（10分）</h3>
            
            {/* 動機タイプ別の追加質問（2つ選択） */}
            {selectedMotivationType && typeSpecificQuestions.length > 0 && (
              <div className="bg-purple-50 p-4 rounded-lg space-y-3 mb-4">
                <Label className="text-base font-semibold text-purple-700">
                  動機タイプに基づく個別質問
                </Label>
                {typeSpecificQuestions.slice(0, 2).map((question, index) => (
                  <div key={index} className="space-y-2">
                    <Label className="text-sm">{question}</Label>
                    <Textarea 
                      placeholder="中堅看護師としての視点でお答えください"
                      className="min-h-[60px]"
                    />
                  </div>
                ))}
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">職場満足度・エンゲージメント</Label>
              <div className="grid grid-cols-5 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">非常に満足</div>
                <div className="bg-blue-100 px-2 py-1 rounded">満足</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">普通</div>
                <div className="bg-red-100 px-2 py-1 rounded">不満</div>
              </div>
              
              {[
                "現在のモチベーション",
                "専門性を活かす機会",
                "キャリア成長機会",
                "職場での役割・責任",
                "仕事の裁量権",
                "上司・同僚との関係",
                "待遇・給与"
              ].map((item) => (
                <RadioGroup key={item}>
                  <div className="grid grid-cols-5 gap-2 items-center">
                    <span className="text-sm font-medium">{item}</span>
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
            </div>

            <div className="space-y-2">
              <Label>将来のキャリア目標・志向</Label>
              <Textarea 
                placeholder="専門看護師、認定看護師、管理職、教育職など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 3. 成長支援・開発計画（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 成長支援・開発計画（8分）</h3>
            
            <div className="space-y-2">
              <Label>取得を希望する資格・認定</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="cert-specialist" />
                  <Label htmlFor="cert-specialist" className="ml-2">専門看護師</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="cert-certified" />
                  <Label htmlFor="cert-certified" className="ml-2">認定看護師</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="cert-management" />
                  <Label htmlFor="cert-management" className="ml-2">看護管理者</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="cert-education" />
                  <Label htmlFor="cert-education" className="ml-2">実習指導者</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="cert-other" />
                  <Label htmlFor="cert-other" className="ml-2">その他専門資格</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>参加を希望する研修・学習機会</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-leadership" />
                  <Label htmlFor="training-leadership" className="ml-2">リーダーシップ研修</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-specialty" />
                  <Label htmlFor="training-specialty" className="ml-2">専門分野研修</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-teaching" />
                  <Label htmlFor="training-teaching" className="ml-2">指導技術研修</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-external" />
                  <Label htmlFor="training-external" className="ml-2">外部研修・学会</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>後輩指導・メンターシップについて</Label>
              <Textarea 
                placeholder="現在の指導状況、指導で困っていること、改善したいことなど"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>業務改善・新しい取り組みへの参加意向</Label>
              <Textarea 
                placeholder="委員会活動、プロジェクト参加、業務改善提案など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. 今後のアクションプラン（4分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 今後のアクションプラン（4分）</h3>
            
            {/* 動機タイプに基づく推奨アクション */}
            {selectedMotivationType && (
              <Alert className="bg-purple-50 border-purple-200">
                <AlertDescription>
                  <strong>動機タイプに基づく推奨キャリア支援：</strong>
                  <div className="mt-2">
                    {selectedMotivationType === 'growth' && '専門資格取得支援、新分野チャレンジ機会の提供'}
                    {selectedMotivationType === 'recognition' && 'リーダーシップ機会の拡大、成果の公式評価'}
                    {selectedMotivationType === 'stability' && '専門性を活かした安定ポジションの確保'}
                    {selectedMotivationType === 'teamwork' && 'チームリーダー、後輩指導の機会拡大'}
                    {selectedMotivationType === 'efficiency' && '業務改善プロジェクトリーダーへの任命'}
                    {selectedMotivationType === 'compensation' && '昇進機会の明示、専門手当の検討'}
                    {selectedMotivationType === 'creativity' && '新企画の立案・実施権限の付与'}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label>短期目標（3ヶ月以内）</Label>
              <Textarea 
                placeholder="習得したいスキル、取り組みたい業務など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>中長期キャリア計画（1-3年）</Label>
              <Textarea 
                placeholder="資格取得、役職、専門分野など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>必要な組織的サポート</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-training" />
                  <Label htmlFor="support-training" className="ml-2">研修費用支援</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-time" />
                  <Label htmlFor="support-time" className="ml-2">学習時間の確保</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-mentor" />
                  <Label htmlFor="support-mentor" className="ml-2">上級者によるメンタリング</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-role" />
                  <Label htmlFor="support-role" className="ml-2">新しい役割・責任の付与</Label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="next-interview">次回面談予定</Label>
                <Input type="date" id="next-interview" />
              </div>
              <div>
                <Label htmlFor="development-priority">開発優先度</Label>
                <select className="w-full p-2 border rounded">
                  <option value="high">高</option>
                  <option value="medium">中</option>
                  <option value="standard">標準</option>
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
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>パフォーマンス</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="perf-e" />
                    <Label htmlFor="perf-e" className="ml-1 text-sm">優秀</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="perf-g" />
                    <Label htmlFor="perf-g" className="ml-1 text-sm">良好</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="standard" id="perf-s" />
                    <Label htmlFor="perf-s" className="ml-1 text-sm">標準</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="needs-improvement" id="perf-n" />
                    <Label htmlFor="perf-n" className="ml-1 text-sm">要改善</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>成長ポテンシャル</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="potential-h" />
                    <Label htmlFor="potential-h" className="ml-1 text-sm">高い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="potential-m" />
                    <Label htmlFor="potential-m" className="ml-1 text-sm">中程度</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="standard" id="potential-s" />
                    <Label htmlFor="potential-s" className="ml-1 text-sm">標準</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>キャリア志向</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="management" id="career-m" />
                    <Label htmlFor="career-m" className="ml-1 text-sm">管理職志向</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="specialist" id="career-s" />
                    <Label htmlFor="career-s" className="ml-1 text-sm">専門職志向</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="balance" id="career-b" />
                    <Label htmlFor="career-b" className="ml-1 text-sm">バランス重視</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <Textarea 
              placeholder="総合評価、強み・課題、動機タイプを考慮したキャリア支援計画、特記事項"
              className="min-h-[100px]"
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