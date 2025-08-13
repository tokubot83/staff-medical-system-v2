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

export default function VeteranNurseUnified30MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-purple-50">
          <CardTitle className="text-2xl">ベテラン看護師（6年目以上）定期面談シート V5（30分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              30分の標準面談です。<strong>動機タイプ判定</strong>を活用し、ベテラン看護師の専門性とリーダーシップ発展を支援します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. 専門性・リーダーシップ評価（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 専門性・リーダーシップ評価（8分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">ベテラン看護師としての能力評価</Label>
              <div className="grid grid-cols-5 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">卓越</div>
                <div className="bg-blue-100 px-2 py-1 rounded">優秀</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">良好</div>
                <div className="bg-red-100 px-2 py-1 rounded">標準</div>
              </div>
              
              {[
                "高度専門技術",
                "質の高い患者ケア",
                "リーダーシップ",
                "後輩・新人指導",
                "問題解決・判断力",
                "チーム運営",
                "業務改善・効率化",
                "専門知識の更新"
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
              <Label>最近の専門的貢献・実績</Label>
              <Textarea 
                placeholder="高度なケア提供、指導成果、業務改善、委員会活動など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>今後さらに発展させたい専門領域</Label>
              <Textarea 
                placeholder="専門性の深化、新分野への挑戦、管理能力など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. キャリア・エンゲージメント（10分） */}
          <div className="space-y-4 bg-purple-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. キャリア・エンゲージメント（10分）</h3>
            
            {/* 動機タイプ別の追加質問（2つ選択） */}
            {selectedMotivationType && typeSpecificQuestions.length > 0 && (
              <div className="bg-indigo-50 p-4 rounded-lg space-y-3 mb-4">
                <Label className="text-base font-semibold text-indigo-700">
                  動機タイプに基づく個別質問
                </Label>
                {typeSpecificQuestions.slice(0, 2).map((question, index) => (
                  <div key={index} className="space-y-2">
                    <Label className="text-sm">{question}</Label>
                    <Textarea 
                      placeholder="ベテラン看護師としての経験・視点でお答えください"
                      className="min-h-[60px]"
                    />
                  </div>
                ))}
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">職場満足度・モチベーション</Label>
              <div className="grid grid-cols-5 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">非常に高い</div>
                <div className="bg-blue-100 px-2 py-1 rounded">高い</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">普通</div>
                <div className="bg-red-100 px-2 py-1 rounded">低い</div>
              </div>
              
              {[
                "現在のモチベーション",
                "専門性を活かす機会",
                "リーダーシップ発揮の機会",
                "キャリア成長の可能性",
                "職場での役割・地位",
                "裁量権・決定権",
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
              <Label>今後のキャリア志向・目標</Label>
              <Textarea 
                placeholder="管理職、専門看護師、教育者、コンサルタント、起業など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 3. 成長・発展計画（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 成長・発展計画（8分）</h3>
            
            <div className="space-y-2">
              <Label>目指す資格・認定・ポジション</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="goal-cns" />
                  <Label htmlFor="goal-cns" className="ml-2">専門看護師（CNS）</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="goal-cn" />
                  <Label htmlFor="goal-cn" className="ml-2">認定看護師（CN）</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="goal-manager" />
                  <Label htmlFor="goal-manager" className="ml-2">看護管理者</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="goal-educator" />
                  <Label htmlFor="goal-educator" className="ml-2">看護教育者</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="goal-consultant" />
                  <Label htmlFor="goal-consultant" className="ml-2">専門コンサルタント</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="goal-other" />
                  <Label htmlFor="goal-other" className="ml-2">その他専門職</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>参加・取得を希望する研修・学習</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-management" />
                  <Label htmlFor="training-management" className="ml-2">看護管理研修</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-advanced" />
                  <Label htmlFor="training-advanced" className="ml-2">高度専門研修</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-education" />
                  <Label htmlFor="training-education" className="ml-2">教育指導者研修</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-graduate" />
                  <Label htmlFor="training-graduate" className="ml-2">大学院進学</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-conference" />
                  <Label htmlFor="training-conference" className="ml-2">学会・国際会議</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-research" />
                  <Label htmlFor="training-research" className="ml-2">研究活動</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>指導・メンタリング活動について</Label>
              <Textarea 
                placeholder="現在の指導状況、指導方針、育成したい人材像など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織・業界への貢献意向</Label>
              <Textarea 
                placeholder="委員会活動、学会発表、執筆活動、社会貢献など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. 今後のアクションプラン（4分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 今後のアクションプラン（4分）</h3>
            
            {/* 動機タイプに基づく推奨アクション */}
            {selectedMotivationType && (
              <Alert className="bg-indigo-50 border-indigo-200">
                <AlertDescription>
                  <strong>動機タイプに基づく推奨キャリア支援：</strong>
                  <div className="mt-2">
                    {selectedMotivationType === 'growth' && '新分野への挑戦機会、指導者・教育者としての発展支援'}
                    {selectedMotivationType === 'recognition' && '専門家としての地位確立、外部講師・委員への推薦'}
                    {selectedMotivationType === 'stability' && '専門性を活かした安定したエキスパートポジション確保'}
                    {selectedMotivationType === 'teamwork' && 'チーム統括、部署間調整、メンター制度の中心役'}
                    {selectedMotivationType === 'efficiency' && '業務効率化・改善プロジェクトの統括責任者'}
                    {selectedMotivationType === 'compensation' && '管理職昇進、専門手当・役職手当の充実'}
                    {selectedMotivationType === 'creativity' && '新制度・システム設計、イノベーション推進役'}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label>短期目標（6ヶ月以内）</Label>
              <Textarea 
                placeholder="資格取得、新役割への挑戦、スキル向上など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>中長期キャリア計画（1-5年）</Label>
              <Textarea 
                placeholder="管理職、専門職、教育職への道筋など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織に期待するサポート</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-education" />
                  <Label htmlFor="support-education" className="ml-2">教育費用支援</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-time" />
                  <Label htmlFor="support-time" className="ml-2">学習時間の確保</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-opportunity" />
                  <Label htmlFor="support-opportunity" className="ml-2">新しい役割・機会の提供</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-network" />
                  <Label htmlFor="support-network" className="ml-2">外部ネットワークへの参加</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-autonomy" />
                  <Label htmlFor="support-autonomy" className="ml-2">裁量権の拡大</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-succession" />
                  <Label htmlFor="support-succession" className="ml-2">後継者育成支援</Label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="next-interview">次回面談予定</Label>
                <Input type="date" id="next-interview" />
              </div>
              <div>
                <Label htmlFor="development-priority">キャリア開発優先度</Label>
                <select className="w-full p-2 border rounded">
                  <option value="urgent">緊急</option>
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
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>専門性レベル</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="expert" id="expert-e" />
                    <Label htmlFor="expert-e" className="ml-1 text-sm">エキスパート</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="advanced" id="expert-a" />
                    <Label htmlFor="expert-a" className="ml-1 text-sm">上級者</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="competent" id="expert-c" />
                    <Label htmlFor="expert-c" className="ml-1 text-sm">熟練者</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>リーダーシップ</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="exceptional" id="leader-ex" />
                    <Label htmlFor="leader-ex" className="ml-1 text-sm">卓越</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="strong" id="leader-s" />
                    <Label htmlFor="leader-s" className="ml-1 text-sm">強い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="developing" id="leader-d" />
                    <Label htmlFor="leader-d" className="ml-1 text-sm">発展中</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>キャリア意欲</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="very-high" id="career-vh" />
                    <Label htmlFor="career-vh" className="ml-1 text-sm">非常に高い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="career-h" />
                    <Label htmlFor="career-h" className="ml-1 text-sm">高い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="moderate" id="career-m" />
                    <Label htmlFor="career-m" className="ml-1 text-sm">普通</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="stable" id="career-st" />
                    <Label htmlFor="career-st" className="ml-1 text-sm">安定志向</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <Textarea 
              placeholder="総合評価、専門性・リーダーシップの強み、動機タイプに基づくキャリア支援戦略、組織への貢献可能性"
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