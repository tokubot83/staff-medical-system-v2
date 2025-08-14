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

export default function MidlevelPTUnified45MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-emerald-50">
          <CardTitle className="text-2xl">中堅理学療法士（4-10年目）定期面談シート V5（45分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年　配属部署：リハビリテーション科</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              45分の詳細面談です。<strong>動機タイプ判定</strong>を活用し、中堅理学療法士としての専門性向上とリーダーシップ開発を包括的に支援します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. 専門性・リーダーシップの詳細評価（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 専門性・リーダーシップの詳細評価（10分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">中堅PT総合能力の詳細評価</Label>
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
                "複雑症例への対応・治療プログラム立案",
                "後輩・学生の指導・教育",
                "チームリーダーシップ・調整力",
                "多職種連携・統括能力",
                "業務改善・効率化への貢献",
                "学術活動・研究参加・発表",
                "専門知識・EBMの実践",
                "クリニカルリーズニング",
                "患者・家族教育・指導"
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
              <Label>現在の専門分野・得意領域と具体的成果</Label>
              <Textarea 
                placeholder="専門としている疾患・分野、高度な技術、指導実績、業務改善への貢献、学会発表・論文、症例検討での役割など詳しく記入"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>リーダーシップ・指導力の発揮状況</Label>
              <Textarea 
                placeholder="後輩指導の実績、チーム運営での役割、プロジェクトリーダー経験、問題解決の主導、意思決定への関与など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. 動機タイプ別詳細確認・キャリア志向分析（10分） */}
          <div className="space-y-4 bg-emerald-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 動機タイプ別詳細確認・キャリア志向分析（10分）</h3>
            
            {selectedMotivationType && typeSpecificQuestions.length > 0 && (
              <div className="bg-purple-50 p-3 rounded-lg space-y-2 mb-4">
                <Label className="text-base font-semibold text-purple-700">
                  動機タイプに基づく詳細質問（中堅レベル）
                </Label>
                <div className="space-y-3">
                  {typeSpecificQuestions.slice(0, 3).map((question, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-sm font-medium">{`質問${index + 1}：${question}`}</Label>
                      <Textarea 
                        placeholder="中堅理学療法士としての経験・視点で詳しくお答えください"
                        className="min-h-[70px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">エンゲージメント・職場満足度詳細分析</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "仕事へのやりがい・意欲",
                "職場での役割満足度",
                "専門性発揮の機会",
                "今後の成長可能性",
                "リーダーシップ発揮機会",
                "学習・研修機会の充実度",
                "チームワーク・職場環境",
                "ワークライフバランス"
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
              <Label>中堅PTとしての使命感・組織への貢献意識</Label>
              <Textarea 
                placeholder="後輩育成への責任感、組織への貢献意識、専門職としての使命感、社会への責任など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 3. キャリア発展・専門性向上への詳細支援（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. キャリア発展・専門性向上への詳細支援（8分）</h3>
            
            <div className="space-y-2">
              <Label>今後さらに向上・発展させたい専門領域と具体的計画</Label>
              <Textarea 
                placeholder="深めたい専門分野、習得したい高度技術、取得を目指す認定資格、参加したい研究・学会活動など詳細に記入"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>リーダーシップ・指導力向上への取り組み希望</Label>
              <Textarea 
                placeholder="後輩指導スキル、チーム運営能力、プロジェクト管理、コミュニケーション力向上など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">希望するキャリア支援・発展機会（複数選択可）</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "専門認定資格取得支援・情報提供",
                  "学会・研修会参加支援・派遣",
                  "指導者研修・教育訓練プログラム",
                  "管理・マネジメント研修参加",
                  "学術活動・研究参加・論文指導",
                  "他施設・病院での研修・見学",
                  "リーダーシップ・コミュニケーション研修",
                  "プロジェクトリーダー・委員会責任者任命",
                  "新人・学生指導責任者任命",
                  "院内講師・教育担当任命",
                  "外部講師・研修講師機会",
                  "昇進・昇格機会の明示・準備支援"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox id={`career-${item}`} />
                    <Label htmlFor={`career-${item}`} className="text-sm">{item}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>現在のキャリア発展における課題・障壁</Label>
              <Textarea 
                placeholder="時間的制約、知識・技術不足、機会不足、環境的要因、組織的制約、個人的事情など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 4. 詳細目標設定・アクションプラン策定（9分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 詳細目標設定・アクションプラン策定（9分）</h3>
            
            {selectedMotivationType && (
              <Alert className="bg-purple-50 border-purple-200">
                <AlertDescription>
                  <strong>動機タイプに基づく推奨キャリア支援：</strong>
                  <div className="mt-1 text-sm">
                    {selectedMotivationType === 'growth' && '専門資格取得・新分野挑戦・研究学会活動・院外研修・リーダーシップ開発'}
                    {selectedMotivationType === 'recognition' && 'リーダー任命・専門技術評価・院内外発表・表彰制度・責任ある役職'}
                    {selectedMotivationType === 'stability' && '専門性安定発展・継続的技術向上・安定したポジション・段階的成長'}
                    {selectedMotivationType === 'teamwork' && '後輩指導責任者・多職種連携強化・チーム統括・調整役・メンター'}
                    {selectedMotivationType === 'efficiency' && '業務改善リーダー・効率化推進・システム導入・プロセス最適化'}
                    {selectedMotivationType === 'compensation' && '昇進準備・管理職研修・専門手当・評価制度・待遇改善'}
                    {selectedMotivationType === 'creativity' && '新治療法開発・研究参加・イノベーション・独自アプローチ開発'}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label>短期目標（3ヶ月）</Label>
              <Textarea 
                placeholder="専門技術の向上、指導実績の積み重ね、資格取得準備、研修参加など具体的で測定可能な目標"
                className="min-h-[70px]"
              />
            </div>

            <div className="space-y-2">
              <Label>中期目標（6ヶ月-1年）</Label>
              <Textarea 
                placeholder="キャリア発展、専門分野確立、リーダーシップ向上、認定資格取得、研究活動など"
                className="min-h-[70px]"
              />
            </div>

            <div className="space-y-2">
              <Label>長期目標（1-3年）</Label>
              <Textarea 
                placeholder="専門家としての地位確立、管理職への準備、教育者としての発展、研究者への転身など"
                className="min-h-[70px]"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">具体的アクション項目</Label>
              <div className="grid grid-cols-1 gap-3">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="space-y-2">
                    <Label htmlFor={`action${num}`} className="text-sm font-medium">アクション{num}</Label>
                    <Input id={`action${num}`} placeholder="具体的な行動・取り組み" />
                    <div className="grid grid-cols-3 gap-2">
                      <Input placeholder="開始日" type="date" />
                      <Input placeholder="完了予定日" type="date" />
                      <Input placeholder="担当者・支援者" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5. 総合評価・継続支援計画（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. 総合評価・継続支援計画（8分）</h3>
            
            <div className="space-y-2">
              <Label>総合的な成長支援プラン</Label>
              <Textarea 
                placeholder="技術指導、研修計画、メンタリング、資格取得支援、リーダーシップ開発など包括的な支援計画"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織としての期待・役割</Label>
              <Textarea 
                placeholder="組織が期待する役割、責任範囲、今後の位置づけ、貢献への期待など"
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="next-interview">次回面談予定</Label>
                <Input type="date" id="next-interview" />
              </div>
              <div>
                <Label htmlFor="follow-method">フォロー方法</Label>
                <select className="w-full p-2 border rounded">
                  <option value="monthly">月次1on1</option>
                  <option value="bimonthly">隔月面談</option>
                  <option value="quarterly">四半期面談</option>
                  <option value="project-based">プロジェクト単位</option>
                </select>
              </div>
              <div>
                <Label htmlFor="development-focus">重点開発領域</Label>
                <select className="w-full p-2 border rounded">
                  <option value="specialty">専門性強化</option>
                  <option value="leadership">リーダーシップ</option>
                  <option value="education">指導・教育力</option>
                  <option value="research">研究・学術活動</option>
                  <option value="management">管理・運営</option>
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
            
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label>専門性レベル</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="expert" id="expert-level" />
                    <Label htmlFor="expert-level" className="ml-1 text-sm">エキスパート</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="advanced" id="advanced-level" />
                    <Label htmlFor="advanced-level" className="ml-1 text-sm">上級</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="intermediate" id="intermediate-level" />
                    <Label htmlFor="intermediate-level" className="ml-1 text-sm">中級</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>リーダーシップ</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="leadership-excellent" />
                    <Label htmlFor="leadership-excellent" className="ml-1 text-sm">優秀</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="leadership-good" />
                    <Label htmlFor="leadership-good" className="ml-1 text-sm">良好</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="developing" id="leadership-developing" />
                    <Label htmlFor="leadership-developing" className="ml-1 text-sm">発展途上</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>成長ポテンシャル</Label>
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
                <Label>キャリア意欲</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="motivation-high" />
                    <Label htmlFor="motivation-high" className="ml-1 text-sm">高</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="motivation-medium" />
                    <Label htmlFor="motivation-medium" className="ml-1 text-sm">中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="motivation-low" />
                    <Label htmlFor="motivation-low" className="ml-1 text-sm">低</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <Textarea 
              placeholder="総合評価、専門性・リーダーシップ評価、キャリア支援方針、動機タイプに基づく個別支援計画、長期育成方針、特記事項など詳細に記入"
              className="min-h-[100px]"
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