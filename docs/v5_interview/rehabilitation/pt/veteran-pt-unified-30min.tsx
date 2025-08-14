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
import { MotivationTypeSection, getMotivationTypeQuestions } from '../../components/MotivationType';

export default function VeteranPTUnified30MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-emerald-50">
          <CardTitle className="text-2xl">ベテラン理学療法士（11年目以上）定期面談シート V5（30分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年　配属部署：リハビリテーション科</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              30分の標準面談です。<strong>動機タイプ判定</strong>を活用し、ベテラン理学療法士としての専門性とリーダーシップを評価・支援します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. 専門性・指導力・組織貢献の評価（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 専門性・指導力・組織貢献の評価（8分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">ベテランPT総合能力の評価</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "高度な専門技術・治療技術",
                "複雑・困難症例への対応",
                "後輩・学生の指導・教育",
                "部門内リーダーシップ",
                "多職種連携・調整力",
                "業務改善・システム構築",
                "学術活動・研究参加",
                "組織運営への貢献"
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
              <Label>現在の専門分野・リーダーシップ発揮状況</Label>
              <Textarea 
                placeholder="専門領域での貢献、指導実績、部門運営への関与、学術活動など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. 動機タイプ別詳細確認・エンゲージメント（8分） */}
          <div className="space-y-4 bg-emerald-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 動機タイプ別詳細確認・エンゲージメント（8分）</h3>
            
            {selectedMotivationType && typeSpecificQuestions.length > 0 && (
              <div className="bg-teal-50 p-3 rounded-lg space-y-2 mb-4">
                <Label className="text-base font-semibold text-teal-700">
                  動機タイプに基づく個別質問（ベテランレベル）
                </Label>
                <div className="space-y-3">
                  {typeSpecificQuestions.slice(0, 2).map((question, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-sm">{question}</Label>
                      <Textarea 
                        placeholder="ベテラン理学療法士としての豊富な経験・視点でお答えください"
                        className="min-h-[60px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">エンゲージメント・満足度</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "仕事への意欲・やりがい",
                "専門性発揮の機会",
                "組織への貢献実感",
                "長期継続意向"
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

          {/* 3. キャリア・役割発展への支援（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. キャリア・役割発展への支援（7分）</h3>
            
            <div className="space-y-2">
              <Label>今後発展させたい専門領域・新たな挑戦</Label>
              <Textarea 
                placeholder="専門性の深化、新分野開拓、管理職、教育職、研究活動など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">希望する役割・支援（複数選択可）</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "管理職・マネジメント職",
                  "教育・指導専門職",
                  "研究・学術活動支援",
                  "専門認定資格取得",
                  "外部機関との連携",
                  "新人・学生教育責任者",
                  "業務改善プロジェクトリーダー",
                  "学会・研修会講師"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox id={`role-${item}`} />
                    <Label htmlFor={`role-${item}`} className="text-sm">{item}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. 次回までの目標・アクション（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 次回までの目標・アクション（7分）</h3>
            
            {selectedMotivationType && (
              <Alert className="bg-teal-50 border-teal-200">
                <AlertDescription>
                  <strong>推奨役割・キャリア支援：</strong>
                  <div className="mt-1 text-sm">
                    {selectedMotivationType === 'growth' && '新分野開拓、研究活動推進、外部機関連携'}
                    {selectedMotivationType === 'recognition' && '専門家地位確立、講師・委員推薦、表彰制度'}
                    {selectedMotivationType === 'stability' && 'エキスパートポジション、安定した専門性発揮'}
                    {selectedMotivationType === 'teamwork' && '部門統括、メンター制度中心、調整役'}
                    {selectedMotivationType === 'efficiency' && '効率化統括責任者、システム改善リーダー'}
                    {selectedMotivationType === 'compensation' && '管理職昇進、専門手当充実、待遇改善'}
                    {selectedMotivationType === 'creativity' && 'イノベーション推進、新制度開発、創造的役割'}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label>短期目標（3-6ヶ月）</Label>
              <Textarea 
                placeholder="専門性発展、リーダーシップ発揮、新たな役割への準備など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>中長期ビジョン（1-3年）</Label>
              <Textarea 
                placeholder="キャリア目標、組織での役割、専門分野での位置づけなど"
                className="min-h-[60px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="next-interview">次回面談予定</Label>
                <Input type="date" id="next-interview" />
              </div>
              <div>
                <Label htmlFor="development-focus">重点開発領域</Label>
                <select className="w-full p-2 border rounded">
                  <option value="management">マネジメント・管理</option>
                  <option value="expertise">専門性深化</option>
                  <option value="education">教育・指導</option>
                  <option value="research">研究・学術</option>
                  <option value="innovation">イノベーション</option>
                </select>
              </div>
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            
            <div className="bg-teal-50 p-3 rounded-lg">
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
            
            <Textarea 
              placeholder="専門性・指導力評価、組織貢献度、キャリア支援方針、動機タイプに基づく個別支援計画など"
              className="min-h-[80px]"
            />
          </div>

          {/* 保存ボタン */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button variant="outline">一時保存</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">面談記録を保存</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}