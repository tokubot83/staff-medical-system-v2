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

export default function ChiefPTUnified30MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-emerald-50">
          <CardTitle className="text-2xl">主任理学療法士定期面談シート V5（30分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>就任年数：＿＿年　担当部署：リハビリテーション科</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              30分の標準面談です。<strong>動機タイプ判定</strong>を活用し、主任理学療法士としてのマネジメント能力と部門運営を詳細に評価・支援します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. マネジメント・部門運営の評価（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. マネジメント・部門運営の評価（8分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">主任PT管理能力の評価</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "PT部門の統括・運営管理",
                "スタッフの指導・育成・評価",
                "業務効率化・標準化の推進",
                "多職種連携・調整力",
                "質管理・安全管理体制",
                "予算管理・リソース配分",
                "部門目標達成・成果創出",
                "上級管理職との連携"
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
              <Label>主な管理業務の成果・実績</Label>
              <Textarea 
                placeholder="部門運営成果、スタッフ育成実績、業務改善効果、目標達成状況など詳しく記入"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>現在の管理上の課題・改善取り組み</Label>
              <Textarea 
                placeholder="スタッフマネジメント、業務効率化、質向上、連携強化などの課題と対策"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. 動機タイプ別詳細確認・リーダーシップ（8分） */}
          <div className="space-y-4 bg-emerald-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 動機タイプ別詳細確認・リーダーシップ（8分）</h3>
            
            {selectedMotivationType && typeSpecificQuestions.length > 0 && (
              <div className="bg-green-50 p-3 rounded-lg space-y-2 mb-4">
                <Label className="text-base font-semibold text-green-700">
                  動機タイプに基づく個別質問（管理職レベル）
                </Label>
                <div className="space-y-3">
                  {typeSpecificQuestions.slice(0, 2).map((question, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-sm">{question}</Label>
                      <Textarea 
                        placeholder="主任理学療法士としてのマネジメント・指導の視点でお答えください"
                        className="min-h-[60px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">リーダーシップ・管理満足度</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "管理業務へのやりがい",
                "部門運営の権限・裁量",
                "上司からの支援・評価",
                "管理職としての成長実感"
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

          {/* 3. 部門発展・組織貢献への支援（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 部門発展・組織貢献への支援（7分）</h3>
            
            <div className="space-y-2">
              <Label>今後の部門ビジョン・発展目標</Label>
              <Textarea 
                placeholder="PT部門の将来像、質向上目標、組織への貢献計画など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">必要な組織支援（複数選択可）</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "管理職研修・マネジメント教育",
                  "予算・リソースの拡充",
                  "人員配置・採用支援",
                  "システム・設備の改善",
                  "他部門との連携強化",
                  "上級管理職からの権限委譲",
                  "外部研修・視察機会",
                  "業績評価・報酬制度改善"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox id={`support-${item}`} />
                    <Label htmlFor={`support-${item}`} className="text-sm">{item}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>組織・上司への要望・提案</Label>
              <Textarea 
                placeholder="部門運営に必要な支援、制度改善の提案、組織課題の指摘など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. 次回までの目標・アクション（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 次回までの目標・アクション（7分）</h3>
            
            {selectedMotivationType && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription>
                  <strong>推奨マネジメント支援：</strong>
                  <div className="mt-1 text-sm">
                    {selectedMotivationType === 'growth' && '新マネジメント手法導入、管理職研修参加、部門イノベーション推進'}
                    {selectedMotivationType === 'recognition' && '部門成果の可視化、上級管理職評価、外部表彰・認定支援'}
                    {selectedMotivationType === 'stability' && '管理体制安定化、標準化推進、継続的改善支援'}
                    {selectedMotivationType === 'teamwork' && 'チームビルディング強化、多部門連携促進、調整機能向上'}
                    {selectedMotivationType === 'efficiency' && '効率化システム導入、業務改善推進、データ活用促進'}
                    {selectedMotivationType === 'compensation' && '管理職手当充実、昇進機会明示、評価制度改善'}
                    {selectedMotivationType === 'creativity' && '独自運営手法支援、革新的取り組み推進、自由度拡大'}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label>短期管理目標（3ヶ月）</Label>
              <Textarea 
                placeholder="部門運営改善、スタッフ育成、業務効率化の具体的目標"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>中期部門ビジョン（6ヶ月-1年）</Label>
              <Textarea 
                placeholder="部門発展計画、組織貢献目標、質向上取り組みなど"
                className="min-h-[60px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="next-interview">次回面談予定</Label>
                <Input type="date" id="next-interview" />
              </div>
              <div>
                <Label htmlFor="support-focus">重点支援領域</Label>
                <select className="w-full p-2 border rounded">
                  <option value="staff-management">スタッフマネジメント</option>
                  <option value="quality-improvement">質向上・標準化</option>
                  <option value="efficiency">業務効率化</option>
                  <option value="collaboration">多職種連携</option>
                  <option value="strategic">戦略・企画立案</option>
                </select>
              </div>
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            
            <div className="bg-green-50 p-3 rounded-lg">
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
                <Label>マネジメント評価</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="mgmt-eval-excellent" />
                    <Label htmlFor="mgmt-eval-excellent" className="ml-1 text-sm">優秀</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="mgmt-eval-good" />
                    <Label htmlFor="mgmt-eval-good" className="ml-1 text-sm">良好</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="needs-support" id="mgmt-eval-support" />
                    <Label htmlFor="mgmt-eval-support" className="ml-1 text-sm">要支援</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>部門貢献度</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="contribution-high" />
                    <Label htmlFor="contribution-high" className="ml-1 text-sm">高</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="contribution-medium" />
                    <Label htmlFor="contribution-medium" className="ml-1 text-sm">中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="contribution-low" />
                    <Label htmlFor="contribution-low" className="ml-1 text-sm">低</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>発展可能性</Label>
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
            </div>
            
            <Textarea 
              placeholder="マネジメント評価、部門運営状況、動機タイプに基づく支援方針、組織課題など"
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