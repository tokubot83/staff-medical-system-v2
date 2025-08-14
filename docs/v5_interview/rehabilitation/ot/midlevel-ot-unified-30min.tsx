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
import { MotivationTypeSection, getMotivationTypeQuestions } from '@/docs/v5_interview/components/MotivationType';

export default function MidlevelOTUnified30MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-teal-50">
          <CardTitle className="text-2xl">中堅作業療法士（4-10年目）定期面談シート V5（30分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：リハビリテーション科</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              30分の標準面談です。<strong>動機タイプ判定</strong>を活用し、中堅作業療法士の専門性発展とリーダーシップ育成を支援します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. 専門性・指導力の評価（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 専門性・指導力の評価（8分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">OT専門性・指導力の評価</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "高度な評価・治療技術",
                "専門分野の深い知識・技術",
                "複雑症例への対応力",
                "後輩指導・教育能力",
                "チームリーダーシップ",
                "専門プログラム開発・実施",
                "研究・学術活動",
                "多職種連携・調整力",
                "業務改善・効率化への貢献",
                "新人・学生指導"
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
            </div>

            <div className="space-y-2">
              <Label>現在の専門領域・担当業務</Label>
              <Textarea 
                placeholder="専門分野、担当患者、指導役割、委員会活動、研究テーマ等"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>専門性・指導力の成長実績</Label>
              <Textarea 
                placeholder="技術向上、資格取得、論文発表、指導実績、組織貢献等"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. 動機タイプ別確認・リーダーシップ分析（8分） */}
          <div className="space-y-4 bg-teal-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 動機タイプ別確認・リーダーシップ分析（8分）</h3>
            
            {selectedMotivationType && typeSpecificQuestions.length > 0 && (
              <div className="bg-purple-50 p-3 rounded-lg space-y-2 mb-4">
                <Label className="text-base font-semibold text-purple-700">
                  動機タイプに基づく個別質問（中堅OT向け）
                </Label>
                <div className="space-y-3">
                  {typeSpecificQuestions.slice(0, 2).map((question, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-sm">{question}</Label>
                      <Textarea 
                        placeholder="中堅作業療法士としての視点で詳しくお答えください"
                        className="min-h-[60px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* モチベーション・満足度・将来志向 */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">モチベーション・満足度・将来志向</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "専門性向上への意欲",
                "指導・教育への関心",
                "組織貢献・責任感",
                "キャリア発展への期待",
                "10年後の継続意向"
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
            </div>
          </div>

          {/* 3. 発展支援・キャリア戦略（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 発展支援・キャリア戦略（7分）</h3>
            
            <div className="space-y-2">
              <Label>現在の課題・更なる発展への障壁</Label>
              <Textarea 
                placeholder="専門技術、指導技術、時間管理、研究活動、管理業務等の課題"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">必要な支援・研修（複数選択可）</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "高度専門技術研修",
                  "認定・専門資格取得支援",
                  "指導技術・教育法研修",
                  "リーダーシップ研修",
                  "研究・論文作成支援",
                  "学会発表・講演機会",
                  "管理職準備研修",
                  "外部機関との連携支援",
                  "専門委員会活動支援",
                  "国際学会・海外研修",
                  "後輩メンタリング研修",
                  "キャリア相談・カウンセリング"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox id={`support-${item}`} />
                    <Label htmlFor={`support-${item}`} className="text-sm">{item}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. 目標設定・発展計画（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 目標設定・発展計画（7分）</h3>
            
            {selectedMotivationType && (
              <Alert className="bg-purple-50 border-purple-200">
                <AlertDescription>
                  <strong>動機タイプに基づく推奨発展戦略：</strong>
                  <div className="mt-1 text-sm">
                    {selectedMotivationType === 'growth' && '高度専門技術習得、認定資格取得、研究活動、新分野開拓、国際学会参加'}
                    {selectedMotivationType === 'recognition' && '専門性の可視化、学会発表、論文執筆、講師活動、専門委員会参加'}
                    {selectedMotivationType === 'stability' && '専門技術の安定習得、継続的指導、確実なキャリア形成、安定した責任拡大'}
                    {selectedMotivationType === 'teamwork' && 'チーム統括、多職種連携推進、組織調整、後輩育成、協働プロジェクト'}
                    {selectedMotivationType === 'efficiency' && '効率的指導法開発、業務改善推進、システム化、生産性向上、合理化推進'}
                    {selectedMotivationType === 'compensation' && '専門手当拡充、昇進機会、評価制度活用、成果連動報酬、管理職準備'}
                    {selectedMotivationType === 'creativity' && '独自手法開発、創新的アプローチ、新プログラム開発、自由度拡大、イノベーション'}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label>短期専門目標（3-6ヶ月）</Label>
              <Textarea 
                placeholder="専門技術向上、資格取得、指導力向上、研究活動等の具体的目標"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>中長期キャリア戦略（1-3年）</Label>
              <Textarea 
                placeholder="専門分野確立、管理職準備、研究・教育活動、組織貢献等"
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
                <Input type="text" id="follow-method" placeholder="月次面談、プロジェクト単位など" />
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
                <Label>専門性レベル</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="expert" id="spec-expert" />
                    <Label htmlFor="spec-expert" className="ml-1 text-sm">エキスパート</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="advanced" id="spec-advanced" />
                    <Label htmlFor="spec-advanced" className="ml-1 text-sm">上級</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="developing" id="spec-developing" />
                    <Label htmlFor="spec-developing" className="ml-1 text-sm">発展中</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>指導力・リーダーシップ</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="strong" id="lead-strong" />
                    <Label htmlFor="lead-strong" className="ml-1 text-sm">強い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="developing" id="lead-developing" />
                    <Label htmlFor="lead-developing" className="ml-1 text-sm">発展中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="emerging" id="lead-emerging" />
                    <Label htmlFor="lead-emerging" className="ml-1 text-sm">芽生え</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>組織貢献度</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="contrib-high" />
                    <Label htmlFor="contrib-high" className="ml-1 text-sm">高い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="contrib-medium" />
                    <Label htmlFor="contrib-medium" className="ml-1 text-sm">中程度</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="developing" id="contrib-developing" />
                    <Label htmlFor="contrib-developing" className="ml-1 text-sm">発展中</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <Textarea 
              placeholder="専門性、指導力、組織貢献、動機タイプを考慮した個別発展支援方針、今後の期待・活用方針等"
              className="min-h-[80px]"
            />
          </div>

          {/* 保存ボタン */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button variant="outline">一時保存</Button>
            <Button className="bg-teal-600 hover:bg-teal-700">面談記録を保存</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}