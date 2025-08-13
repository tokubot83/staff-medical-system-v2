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

export default function ChiefNurseUnified30MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-orange-50">
          <CardTitle className="text-2xl">主任看護師定期面談シート V5（30分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>就任年数：＿＿年　担当部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              30分の標準面談です。<strong>動機タイプ判定</strong>を活用し、主任看護師としての管理能力と組織運営を支援します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. マネジメント能力評価（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. マネジメント能力評価（8分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">主任看護師としての管理能力</Label>
              <div className="grid grid-cols-5 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">優秀</div>
                <div className="bg-blue-100 px-2 py-1 rounded">良好</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">標準</div>
                <div className="bg-red-100 px-2 py-1 rounded">要改善</div>
              </div>
              
              {[
                "スタッフマネジメント",
                "業務調整・采配",
                "人材育成・指導",
                "問題解決・対応",
                "コミュニケーション",
                "業務効率化",
                "チームビルディング",
                "上級管理職との連携"
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
              <Label>最近の管理・運営での具体的成果</Label>
              <Textarea 
                placeholder="スタッフ育成、業務改善、チーム成果、患者満足度向上など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>管理業務で困難を感じること・課題</Label>
              <Textarea 
                placeholder="スタッフ管理、業務量調整、上司・他部署との調整など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. モチベーション・組織エンゲージメント（10分） */}
          <div className="space-y-4 bg-orange-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. モチベーション・組織エンゲージメント（10分）</h3>
            
            {/* 動機タイプ別の追加質問（2つ選択） */}
            {selectedMotivationType && typeSpecificQuestions.length > 0 && (
              <div className="bg-amber-50 p-4 rounded-lg space-y-3 mb-4">
                <Label className="text-base font-semibold text-amber-700">
                  動機タイプに基づく個別質問
                </Label>
                {typeSpecificQuestions.slice(0, 2).map((question, index) => (
                  <div key={index} className="space-y-2">
                    <Label className="text-sm">{question}</Label>
                    <Textarea 
                      placeholder="主任看護師としての管理・指導の視点でお答えください"
                      className="min-h-[60px]"
                    />
                  </div>
                ))}
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">管理職としての満足度・モチベーション</Label>
              <div className="grid grid-cols-5 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">非常に高い</div>
                <div className="bg-blue-100 px-2 py-1 rounded">高い</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">普通</div>
                <div className="bg-red-100 px-2 py-1 rounded">低い</div>
              </div>
              
              {[
                "現在のモチベーション",
                "管理職としてのやりがい",
                "権限・裁量権",
                "組織からのサポート",
                "部署運営の自由度",
                "昇進・キャリア展望",
                "待遇・報酬",
                "ワークライフバランス"
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
              <Label>将来の管理職・キャリア志向</Label>
              <Textarea 
                placeholder="師長昇進、他部署管理、専門分野管理、教育職など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 3. スキル開発・サポートニーズ（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. スキル開発・サポートニーズ（8分）</h3>
            
            <div className="space-y-2">
              <Label>強化したい管理スキル・知識</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="skill-leadership" />
                  <Label htmlFor="skill-leadership" className="ml-2">リーダーシップ</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="skill-communication" />
                  <Label htmlFor="skill-communication" className="ml-2">コミュニケーション</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="skill-conflict" />
                  <Label htmlFor="skill-conflict" className="ml-2">紛争解決</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="skill-performance" />
                  <Label htmlFor="skill-performance" className="ml-2">業績管理</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="skill-coaching" />
                  <Label htmlFor="skill-coaching" className="ml-2">コーチング</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="skill-planning" />
                  <Label htmlFor="skill-planning" className="ml-2">戦略的計画</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>参加したい研修・学習機会</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-management" />
                  <Label htmlFor="training-management" className="ml-2">看護管理研修</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-leadership" />
                  <Label htmlFor="training-leadership" className="ml-2">リーダーシップ研修</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-hr" />
                  <Label htmlFor="training-hr" className="ml-2">人事管理研修</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-quality" />
                  <Label htmlFor="training-quality" className="ml-2">品質管理研修</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>スタッフ育成・指導について</Label>
              <Textarea 
                placeholder="現在の指導方針、育成で困っていること、改善したい点など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織・上級管理職に求めるサポート</Label>
              <Textarea 
                placeholder="権限拡大、リソース提供、教育支援、業務負荷軽減など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. 今後のアクションプラン（4分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 今後のアクションプラン（4分）</h3>
            
            {/* 動機タイプに基づく推奨アクション */}
            {selectedMotivationType && (
              <Alert className="bg-amber-50 border-amber-200">
                <AlertDescription>
                  <strong>動機タイプに基づく推奨管理支援：</strong>
                  <div className="mt-2">
                    {selectedMotivationType === 'growth' && '管理スキル向上研修、新マネジメント手法の導入機会'}
                    {selectedMotivationType === 'recognition' && '管理成果の可視化・評価、上級管理職からの認知向上'}
                    {selectedMotivationType === 'stability' && '管理体制の安定化、標準的管理手順の整備'}
                    {selectedMotivationType === 'teamwork' && 'チームビルディング支援、部署間連携強化'}
                    {selectedMotivationType === 'efficiency' && '管理業務効率化、システム活用推進'}
                    {selectedMotivationType === 'compensation' && '管理職手当充実、昇進機会明示'}
                    {selectedMotivationType === 'creativity' && '独自管理手法の尊重、革新的取り組み支援'}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label>短期目標（3ヶ月以内）</Label>
              <Textarea 
                placeholder="改善したい管理業務、向上させたいチーム成果など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>中長期キャリア計画（1-3年）</Label>
              <Textarea 
                placeholder="師長昇進、専門分野管理、管理スキルの専門化など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>必要な組織的サポート</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-authority" />
                  <Label htmlFor="support-authority" className="ml-2">権限・裁量権の拡大</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-resource" />
                  <Label htmlFor="support-resource" className="ml-2">リソースの充実</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-education" />
                  <Label htmlFor="support-education" className="ml-2">管理教育の機会</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-mentoring" />
                  <Label htmlFor="support-mentoring" className="ml-2">上級管理職からの指導</Label>
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
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>管理能力</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="mgmt-e" />
                    <Label htmlFor="mgmt-e" className="ml-1 text-sm">優秀</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="mgmt-g" />
                    <Label htmlFor="mgmt-g" className="ml-1 text-sm">良好</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="standard" id="mgmt-s" />
                    <Label htmlFor="mgmt-s" className="ml-1 text-sm">標準</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="needs-development" id="mgmt-n" />
                    <Label htmlFor="mgmt-n" className="ml-1 text-sm">要開発</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>昇進可能性</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="promotion-h" />
                    <Label htmlFor="promotion-h" className="ml-1 text-sm">高い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="promotion-m" />
                    <Label htmlFor="promotion-m" className="ml-1 text-sm">中程度</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="standard" id="promotion-s" />
                    <Label htmlFor="promotion-s" className="ml-1 text-sm">標準</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>組織貢献度</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="very-high" id="contrib-vh" />
                    <Label htmlFor="contrib-vh" className="ml-1 text-sm">非常に高い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="contrib-h" />
                    <Label htmlFor="contrib-h" className="ml-1 text-sm">高い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="standard" id="contrib-s" />
                    <Label htmlFor="contrib-s" className="ml-1 text-sm">標準</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <Textarea 
              placeholder="総合評価、管理能力・リーダーシップの強み、動機タイプに基づく管理支援戦略、昇進・発展可能性"
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