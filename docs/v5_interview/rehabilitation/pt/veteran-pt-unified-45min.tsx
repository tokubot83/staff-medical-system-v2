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

export default function VeteranPTUnified45MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-emerald-50">
          <CardTitle className="text-2xl">ベテラン理学療法士（11年目以上）定期面談シート V5（45分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年　配属部署：リハビリテーション科</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              45分の詳細面談です。<strong>動機タイプ判定</strong>を活用し、ベテラン理学療法士としての高度な専門性と組織貢献、キャリア発展を包括的に評価・支援します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. 高度専門性・リーダーシップ・組織貢献の総合評価（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 高度専門性・リーダーシップ・組織貢献の総合評価（10分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">ベテランPT総合能力・影響力の評価</Label>
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
                "複雑・困難症例への対応・コンサルテーション",
                "後輩・PTスタッフ・学生の教育・指導",
                "部門内リーダーシップ・統率力",
                "多職種連携・調整・コーディネーション",
                "業務改善・システム構築・イノベーション",
                "学術活動・研究参加・発表・指導",
                "専門知識・EBM・クリニカルリーズニング",
                "組織運営への貢献・意思決定参加",
                "外部機関との連携・ネットワーク構築",
                "新人・後進のメンターシップ",
                "専門分野での社会的影響力・認知度"
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
              <Label>現在の専門分野・リーダーシップ発揮状況と組織貢献</Label>
              <Textarea 
                placeholder="専門領域での貢献、指導実績、部門運営への関与、学術活動、外部での講師・委員活動、社会貢献など詳しく記入"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>長年の経験を活かした独自の強み・専門性</Label>
              <Textarea 
                placeholder="長年の経験で築いた独自のアプローチ、専門技術、治療哲学、組織への独特な貢献など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>後進育成・組織発展への貢献実績</Label>
              <Textarea 
                placeholder="新人・中堅スタッフの指導実績、メンターとしての活動、教育プログラム開発、組織改善への貢献など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. 動機タイプ別詳細確認・エンゲージメント分析（10分） */}
          <div className="space-y-4 bg-emerald-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 動機タイプ別詳細確認・エンゲージメント分析（10分）</h3>
            
            {selectedMotivationType && typeSpecificQuestions.length > 0 && (
              <div className="bg-teal-50 p-3 rounded-lg space-y-2 mb-4">
                <Label className="text-base font-semibold text-teal-700">
                  動機タイプに基づく詳細質問（ベテランレベル）
                </Label>
                <div className="space-y-3">
                  {typeSpecificQuestions.slice(0, 3).map((question, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-sm font-medium">{`質問${index + 1}：${question}`}</Label>
                      <Textarea 
                        placeholder="ベテラン理学療法士としての豊富な経験・視点で詳しくお答えください"
                        className="min-h-[70px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">エンゲージメント・組織コミットメント分析</Label>
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
                "専門性発揮の機会・満足度",
                "組織への貢献実感・必要性認識",
                "長期継続意向・キャリアビジョン",
                "新たな挑戦への意欲",
                "後進指導・メンタリングの意欲",
                "ワークライフバランス",
                "組織ビジョンへの共感・貢献意識"
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
              <Label>ベテランPTとしての使命感・社会的責任</Label>
              <Textarea 
                placeholder="理学療法士としての使命感、後進育成への責任、専門職としての社会的責任、組織ビジョンへの共感など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>今後のキャリアビジョン・人生設計</Label>
              <Textarea 
                placeholder="今後5-10年のキャリアビジョン、理学療法士としての人生設計、家庭とのバランス、引退後の計画など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 3. キャリア発展・役割変化への包括的支援（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. キャリア発展・役割変化への包括的支援（8分）</h3>
            
            <div className="space-y-2">
              <Label>今後発展させたい専門領域・新たな挑戦分野</Label>
              <Textarea 
                placeholder="専門性の深化、新分野開拓、管理職、教育職、研究者、コンサルタント、起業・独立など詳細に記入"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織での役割・ポジションの変化希望</Label>
              <Textarea 
                placeholder="現在の役割からの発展、管理職への道筋、専門家としての独立、教育者としての発展など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">希望するキャリア支援・発展機会（複数選択可）</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "管理職・マネジメント職への道筋",
                  "教育・指導専門職への発展",
                  "研究・学術活動支援・環境整備",
                  "専門認定資格・上級資格取得支援",
                  "外部機関との連携・ネットワーク構築",
                  "新人・学生教育責任者任命",
                  "業務改善プロジェクト統括責任者",
                  "学会・研修会講師・委員活動",
                  "院外コンサルタント・アドバイザー",
                  "起業・独立開業支援",
                  "特別プロジェクト・企画の主導",
                  "特別休暧・サバティカル制度活用"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox id={`career-${item}`} />
                    <Label htmlFor={`career-${item}`} className="text-sm">{item}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>キャリア発展における現在の課題・制約要因</Label>
              <Textarea 
                placeholder="年齢的制約、家庭とのバランス、組織的制約、最新知識・技術へのキャッチアップ、物理的・精神的負担など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織・上司への要望・提案</Label>
              <Textarea 
                placeholder="キャリア発展に必要な支援、制度改善の提案、組織改革への意見、環境整備の要望など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 4. 詳細アクションプラン・ロードマップ作成（9分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 詳細アクションプラン・ロードマップ作成（9分）</h3>
            
            {selectedMotivationType && (
              <Alert className="bg-teal-50 border-teal-200">
                <AlertDescription>
                  <strong>動機タイプに基づく推奨キャリア支援：</strong>
                  <div className="mt-1 text-sm">
                    {selectedMotivationType === 'growth' && '新分野開拓・研究活動推進・外部機関連携・グローバル展開・革新的プロジェクト主導'}
                    {selectedMotivationType === 'recognition' && '専門家地位確立・講師委員推薦・表彰制度・外部評価向上・社会的影響力拡大'}
                    {selectedMotivationType === 'stability' && 'エキスパートポジション・安定した専門性発揮・ワークライフバランス配慮'}
                    {selectedMotivationType === 'teamwork' && '部門統括・メンター制度中心・調整役・多職種連携コーディネーター'}
                    {selectedMotivationType === 'efficiency' && '効率化統括責任者・システム改善リーダー・プロセス最適化・データ活用推進'}
                    {selectedMotivationType === 'compensation' && '管理職昇進・専門手当充実・待遇改善・ストックオプション・退職金制度'}
                    {selectedMotivationType === 'creativity' && 'イノベーション推進・新制度開発・起業支援・自由度拡大・創造的役割'}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label>短期目標（3-6ヶ月）</Label>
              <Textarea 
                placeholder="専門性発展、リーダーシップ発揮、新たな役割への準備など具体的で測定可能な目標"
                className="min-h-[70px]"
              />
            </div>

            <div className="space-y-2">
              <Label>中期目標（1-2年）</Label>
              <Textarea 
                placeholder="キャリア発展、専門分野での位置づけ、組織での役割変化など"
                className="min-h-[70px]"
              />
            </div>

            <div className="space-y-2">
              <Label>長期ビジョン（3-5年）</Label>
              <Textarea 
                placeholder="理学療法士としての人生設計、終目標、社会への貢献ビジョンなど"
                className="min-h-[70px]"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">具体的アクションロードマップ</Label>
              <div className="grid grid-cols-1 gap-3">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="space-y-2">
                    <Label htmlFor={`action${num}`} className="text-sm font-medium">アクション{num}（優先度：{num}）</Label>
                    <Input id={`action${num}`} placeholder="具体的な行動・取り組み" />
                    <div className="grid grid-cols-4 gap-2">
                      <Input placeholder="開始日" type="date" />
                      <Input placeholder="完了予定日" type="date" />
                      <Input placeholder="担当者・支援者" />
                      <Input placeholder="成果指標" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5. 総合評価・継続支援計画・組織への期待（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. 総合評価・継続支援計画・組織への期待（8分）</h3>
            
            <div className="space-y-2">
              <Label>総合的な成長・キャリア支援プラン</Label>
              <Textarea 
                placeholder="専門性支援、リーダーシップ開発、研修計画、メンタリング、キャリアチェンジ支援など包括的な支援計画"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織としての期待・位置づけ</Label>
              <Textarea 
                placeholder="組織が期待する役割、責任範囲、今後の位置づけ、組織貢献への期待、後進育成への期待など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>ワークライフバランス・継続的エンゲージメントのための支援</Label>
              <Textarea 
                placeholder="勤務形態の柔軟性、特別休暧制度、健康管理支援、家庭とのバランス配慮など"
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
                  <option value="quarterly">四半期面談</option>
                  <option value="biannual">半年面談</option>
                  <option value="annual">年次面談</option>
                  <option value="project-based">プロジェクト単位</option>
                </select>
              </div>
              <div>
                <Label htmlFor="development-focus">重点開発領域</Label>
                <select className="w-full p-2 border rounded">
                  <option value="management">マネジメント・管理</option>
                  <option value="expertise">専門性深化</option>
                  <option value="education">教育・指導</option>
                  <option value="research">研究・学術</option>
                  <option value="innovation">イノベーション</option>
                  <option value="leadership">リーダーシップ</option>
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
            
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label>専門性レベル</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="master" id="master-level" />
                    <Label htmlFor="master-level" className="ml-1 text-sm">マスター</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="expert" id="expert-level" />
                    <Label htmlFor="expert-level" className="ml-1 text-sm">エキスパート</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="advanced" id="advanced-level" />
                    <Label htmlFor="advanced-level" className="ml-1 text-sm">上級</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>リーダーシップ</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="exceptional" id="leadership-exceptional" />
                    <Label htmlFor="leadership-exceptional" className="ml-1 text-sm">卓越</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="leadership-excellent" />
                    <Label htmlFor="leadership-excellent" className="ml-1 text-sm">優秀</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="leadership-good" />
                    <Label htmlFor="leadership-good" className="ml-1 text-sm">良好</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>組織貢献度</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="critical" id="contribution-critical" />
                    <Label htmlFor="contribution-critical" className="ml-1 text-sm">極めて重要</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="contribution-high" />
                    <Label htmlFor="contribution-high" className="ml-1 text-sm">高</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="contribution-medium" />
                    <Label htmlFor="contribution-medium" className="ml-1 text-sm">中</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>今後の方向性</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="upward" id="direction-upward" />
                    <Label htmlFor="direction-upward" className="ml-1 text-sm">上位昇進</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="specialist" id="direction-specialist" />
                    <Label htmlFor="direction-specialist" className="ml-1 text-sm">専門性深化</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="maintain" id="direction-maintain" />
                    <Label htmlFor="direction-maintain" className="ml-1 text-sm">現状維持</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <Textarea 
              placeholder="総合評価、専門性・指導力評価、組織貢献度、動機タイプに基づく個別支援計画、長期育成方針、キャリア発展支援、特記事項など詳細に記入"
              className="min-h-[120px]"
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