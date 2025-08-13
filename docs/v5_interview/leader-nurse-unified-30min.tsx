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

export default function LeaderNurseUnified30MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-red-50">
          <CardTitle className="text-2xl">師長・管理職看護師定期面談シート V5（30分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>就任年数：＿＿年　管轄部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              30分の標準面談です。<strong>動機タイプ判定</strong>を活用し、師長・管理職としての戦略的リーダーシップと組織運営を支援します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. 戦略的リーダーシップ評価（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 戦略的リーダーシップ評価（8分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">師長・管理職としての戦略的能力</Label>
              <div className="grid grid-cols-5 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">卓越</div>
                <div className="bg-blue-100 px-2 py-1 rounded">優秀</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">良好</div>
                <div className="bg-red-100 px-2 py-1 rounded">標準</div>
              </div>
              
              {[
                "戦略的思考・計画",
                "組織マネジメント",
                "人材戦略・育成",
                "業績管理・改善",
                "変革リーダーシップ",
                "他部署・外部連携",
                "意思決定・判断力",
                "危機管理・対応"
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
              <Label>最近の組織運営・戦略実行での具体的成果</Label>
              <Textarea 
                placeholder="部署業績向上、組織改革、人材育成、他部署連携、経営貢献など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織運営・戦略推進での課題・困難</Label>
              <Textarea 
                placeholder="人材不足、予算制約、組織間調整、変革抵抗など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. 経営参画・組織貢献（10分） */}
          <div className="space-y-4 bg-red-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 経営参画・組織貢献（10分）</h3>
            
            {/* 動機タイプ別の追加質問（2つ選択） */}
            {selectedMotivationType && typeSpecificQuestions.length > 0 && (
              <div className="bg-rose-50 p-4 rounded-lg space-y-3 mb-4">
                <Label className="text-base font-semibold text-rose-700">
                  動機タイプに基づく個別質問
                </Label>
                {typeSpecificQuestions.slice(0, 2).map((question, index) => (
                  <div key={index} className="space-y-2">
                    <Label className="text-sm">{question}</Label>
                    <Textarea 
                      placeholder="師長・管理職としての組織運営・戦略の視点でお答えください"
                      className="min-h-[60px]"
                    />
                  </div>
                ))}
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">管理職としての満足度・エンゲージメント</Label>
              <div className="grid grid-cols-5 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">非常に高い</div>
                <div className="bg-blue-100 px-2 py-1 rounded">高い</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">普通</div>
                <div className="bg-red-100 px-2 py-1 rounded">低い</div>
              </div>
              
              {[
                "現在のモチベーション",
                "経営参画の実感",
                "戦略的権限・裁量",
                "組織からの信頼・期待",
                "上級管理職との関係",
                "成果に対する評価",
                "報酬・待遇",
                "将来的キャリア展望"
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
              <Label>今後のキャリア・役職志向</Label>
              <Textarea 
                placeholder="副看護部長、看護部長、事務長、理事・役員、外部転職など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 3. 戦略的開発・成長計画（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 戦略的開発・成長計画（8分）</h3>
            
            <div className="space-y-2">
              <Label>さらに強化したい戦略的能力・知識</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="skill-strategy" />
                  <Label htmlFor="skill-strategy" className="ml-2">経営戦略</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="skill-finance" />
                  <Label htmlFor="skill-finance" className="ml-2">財務・予算管理</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="skill-hr" />
                  <Label htmlFor="skill-hr" className="ml-2">人事戦略</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="skill-marketing" />
                  <Label htmlFor="skill-marketing" className="ml-2">マーケティング</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="skill-innovation" />
                  <Label htmlFor="skill-innovation" className="ml-2">イノベーション管理</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="skill-governance" />
                  <Label htmlFor="skill-governance" className="ml-2">ガバナンス</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>参加希望・必要な研修・学習機会</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-executive" />
                  <Label htmlFor="training-executive" className="ml-2">経営幹部研修</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-mba" />
                  <Label htmlFor="training-mba" className="ml-2">MBA・ビジネススクール</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-healthcare" />
                  <Label htmlFor="training-healthcare" className="ml-2">医療経営研修</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-transformation" />
                  <Label htmlFor="training-transformation" className="ml-2">変革リーダーシップ</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>次世代リーダー育成について</Label>
              <Textarea 
                placeholder="後継者育成、管理職候補の発掘・育成、組織の持続可能性など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織・経営陣に期待する支援・権限</Label>
              <Textarea 
                placeholder="予算権限、人事権、戦略決定への参画、外部ネットワーク構築支援など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. 今後のアクションプラン（4分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 今後のアクションプラン（4分）</h3>
            
            {/* 動機タイプに基づく推奨アクション */}
            {selectedMotivationType && (
              <Alert className="bg-rose-50 border-rose-200">
                <AlertDescription>
                  <strong>動機タイプに基づく推奨戦略支援：</strong>
                  <div className="mt-2">
                    {selectedMotivationType === 'growth' && '組織変革リーダーシップ強化、新事業・新制度推進の権限付与'}
                    {selectedMotivationType === 'recognition' && '組織成果の外部発信強化、理事会・経営陣からの評価向上'}
                    {selectedMotivationType === 'stability' && '安定的組織運営体制構築、リスク管理権限の強化'}
                    {selectedMotivationType === 'teamwork' && '組織間連携統括、統合的マネジメント体制の主導'}
                    {selectedMotivationType === 'efficiency' && '全組織効率化推進、戦略的システム導入の統括'}
                    {selectedMotivationType === 'compensation' && '上級管理職報酬充実、経営参画機会の拡大'}
                    {selectedMotivationType === 'creativity' && '独自組織運営手法の導入、イノベーション推進権限の付与'}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label>短期戦略目標（6ヶ月以内）</Label>
              <Textarea 
                placeholder="組織改革、業績向上、人材戦略の具体的目標など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>中長期ビジョン・戦略（1-5年）</Label>
              <Textarea 
                placeholder="組織の将来像、自身のキャリア発展、後継者育成など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織・経営陣に求める戦略的支援</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-authority" />
                  <Label htmlFor="support-authority" className="ml-2">戦略的権限の拡大</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-budget" />
                  <Label htmlFor="support-budget" className="ml-2">予算・投資権限</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-development" />
                  <Label htmlFor="support-development" className="ml-2">経営幹部としての開発</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-network" />
                  <Label htmlFor="support-network" className="ml-2">外部ネットワーク構築</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-succession" />
                  <Label htmlFor="support-succession" className="ml-2">後継者育成支援</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-innovation" />
                  <Label htmlFor="support-innovation" className="ml-2">イノベーション推進支援</Label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="next-interview">次回面談予定</Label>
                <Input type="date" id="next-interview" />
              </div>
              <div>
                <Label htmlFor="strategic-priority">戦略的優先度</Label>
                <select className="w-full p-2 border rounded">
                  <option value="critical">最重要</option>
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
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>戦略的リーダーシップ</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="exceptional" id="leadership-ex" />
                    <Label htmlFor="leadership-ex" className="ml-1 text-sm">卓越</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="leadership-e" />
                    <Label htmlFor="leadership-e" className="ml-1 text-sm">優秀</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="leadership-g" />
                    <Label htmlFor="leadership-g" className="ml-1 text-sm">良好</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="developing" id="leadership-d" />
                    <Label htmlFor="leadership-d" className="ml-1 text-sm">発展中</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>経営貢献度</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="critical" id="contribution-c" />
                    <Label htmlFor="contribution-c" className="ml-1 text-sm">不可欠</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="contribution-h" />
                    <Label htmlFor="contribution-h" className="ml-1 text-sm">高い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="standard" id="contribution-s" />
                    <Label htmlFor="contribution-s" className="ml-1 text-sm">標準</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>後継者育成力</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="succession-e" />
                    <Label htmlFor="succession-e" className="ml-1 text-sm">優秀</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="succession-g" />
                    <Label htmlFor="succession-g" className="ml-1 text-sm">良好</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="developing" id="succession-d" />
                    <Label htmlFor="succession-d" className="ml-1 text-sm">発展中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="needs-development" id="succession-n" />
                    <Label htmlFor="succession-n" className="ml-1 text-sm">要開発</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <Textarea 
              placeholder="総合評価、戦略的リーダーシップの強み・課題、動機タイプに基づく戦略支援方針、組織・経営への長期的影響"
              className="min-h-[120px]"
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