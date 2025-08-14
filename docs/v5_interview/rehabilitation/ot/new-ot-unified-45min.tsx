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

export default function NewOTUnified45MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-teal-50">
          <CardTitle className="text-2xl">新人作業療法士（1年目）定期面談シート V5（45分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>入職月数：＿＿ヶ月　配属部署：リハビリテーション科</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              45分の詳細面談です。<strong>動機タイプ判定</strong>を活用し、新人作業療法士の包括的な技術評価と個別最適化された育成計画を策定します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. 作業療法専門技術の詳細評価（12分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 作業療法専門技術の詳細評価（12分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">OT専門技術・能力の詳細評価</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "基本的日常生活動作（BADL）評価・訓練",
                "手段的日常生活動作（IADL）評価・訓練",
                "認知機能評価（HDS-R・MMSE・COGNISTAT等）",
                "高次脳機能評価（注意・記憶・遂行機能等）",
                "上肢機能評価・訓練（MMT・ROM・協調性等）",
                "手指機能評価・訓練（巧緻性・握力等）",
                "作業活動プログラム立案・実施",
                "環境調整・住環境評価",
                "福祉用具選定・適合・指導",
                "精神機能面へのアプローチ・対応",
                "患者・家族指導・教育",
                "多職種連携・情報共有・カンファレンス",
                "記録・評価書・報告書作成",
                "安全管理・リスク管理"
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
              <Label>現在の担当患者・症例の詳細</Label>
              <Textarea 
                placeholder="担当患者数、主要疾患（脳血管疾患・整形外科疾患・内科疾患等）、重症度、ADL状況、認知機能レベル、訓練内容、成果等詳細に記入"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>技術的成長・習得状況の詳細分析</Label>
              <Textarea 
                placeholder="評価技術の向上、作業活動選択能力、患者対応力、記録能力、チーム連携能力等の成長度と今後の課題"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>専門性への関心・志向</Label>
              <Textarea 
                placeholder="どの分野（身体障害・精神障害・認知症・発達障害等）に興味があるか、将来の専門性の方向性、学習意欲"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. 動機タイプ別詳細確認・キャリア志向分析（10分） */}
          <div className="space-y-4 bg-teal-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 動機タイプ別詳細確認・キャリア志向分析（10分）</h3>
            
            {selectedMotivationType && typeSpecificQuestions.length > 0 && (
              <div className="bg-purple-50 p-3 rounded-lg space-y-2 mb-4">
                <Label className="text-base font-semibold text-purple-700">
                  動機タイプに基づく詳細質問（新人OT詳細版）
                </Label>
                <div className="space-y-3">
                  {typeSpecificQuestions.slice(0, 3).map((question, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-sm font-medium">{`質問${index + 1}：${question}`}</Label>
                      <Textarea 
                        placeholder="作業療法士としての専門的視点で詳しくお答えください"
                        className="min-h-[70px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* モチベーション・満足度・エンゲージメント詳細分析 */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">モチベーション・満足度・エンゲージメント詳細分析</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "現在のモチベーション・やる気",
                "職場環境への満足度",
                "仕事のやりがい・達成感",
                "学習・成長への意欲",
                "患者への貢献実感",
                "チームワーク・人間関係",
                "将来への期待・希望",
                "ワークライフバランス",
                "5年後の継続意向"
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
              <Label>作業療法士としてのキャリアビジョン・将来目標</Label>
              <Textarea 
                placeholder="5-10年後の目標、目指したい専門分野、取得したい資格、研究への関心、管理職志向等"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>OTとしてのやりがい・価値観</Label>
              <Textarea 
                placeholder="作業療法という職業に対する価値観、患者に対する思い、社会的意義への考え等"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 3. 包括的課題分析・支援ニーズ（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 包括的課題分析・支援ニーズ（10分）</h3>
            
            <div className="space-y-2">
              <Label>現在の技術的・知識的課題（詳細）</Label>
              <Textarea 
                placeholder="ADL評価の精度、認知機能評価の解釈、作業活動の選択基準、患者対応技術、記録・報告技術等の具体的課題"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>精神的・心理的な課題・不安</Label>
              <Textarea 
                placeholder="患者対応への不安、責任感によるプレッシャー、知識不足への不安、職場適応、人間関係等"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">必要な教育・研修・支援（複数選択可）</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "基本的ADL評価・訓練研修",
                  "IADL評価・訓練研修",
                  "認知機能評価研修（HDS-R・MMSE等）",
                  "高次脳機能評価研修",
                  "上肢機能評価・訓練研修",
                  "作業活動プログラム研修",
                  "環境調整・住環境評価研修",
                  "福祉用具研修",
                  "精神機能アプローチ研修",
                  "症例検討会・ケースカンファレンス",
                  "先輩OTからの個別指導・メンタリング",
                  "外部研修・学会参加支援",
                  "専門資格取得支援（認定OT等）",
                  "業務量調整・段階的症例担当",
                  "メンタルヘルスケア・カウンセリング",
                  "キャリア相談・進路指導"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox id={`support-${item}`} />
                    <Label htmlFor={`support-${item}`} className="text-sm">{item}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>最優先で必要な支援・教育プログラム（詳細）</Label>
              <Textarea 
                placeholder="上記選択項目の中で最も重要なもの3つを選び、具体的な支援方法・教育内容・実施方法等を詳しく"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>職場環境・制度への要望・改善提案</Label>
              <Textarea 
                placeholder="教育制度、指導体制、業務環境、設備・機器、労働条件等への要望や改善提案"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 4. 個別最適化育成計画・詳細目標設定（13分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 個別最適化育成計画・詳細目標設定（13分）</h3>
            
            {selectedMotivationType && (
              <Alert className="bg-purple-50 border-purple-200">
                <AlertDescription>
                  <strong>動機タイプに基づく個別最適化支援プラン：</strong>
                  <div className="mt-1 text-sm">
                    {selectedMotivationType === 'growth' && '新技術・評価法研修参加、専門資格取得支援、研究活動参加、症例発表機会提供'}
                    {selectedMotivationType === 'recognition' && '技術習得の可視化評価、症例成果発表、院内外表彰制度活用、技術向上を認める仕組み'}
                    {selectedMotivationType === 'stability' && '段階的技術習得、確実な基礎固め、安定した指導体制、継続的フォローアップ'}
                    {selectedMotivationType === 'teamwork' && 'チーム医療研修、多職種連携強化、患者・家族とのコミュニケーション向上'}
                    {selectedMotivationType === 'efficiency' && '効率的評価・訓練プロトコール習得、時間管理技術、効果的記録方法'}
                    {selectedMotivationType === 'compensation' && '昇進・昇格要件明示、資格取得手当、専門性評価制度、給与体系説明'}
                    {selectedMotivationType === 'creativity' && '独自アプローチ支援、創造的作業活動開発、新しい評価・訓練法学習支援'}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label>短期育成目標（1-3ヶ月）</Label>
              <Textarea 
                placeholder="具体的で測定可能な技術目標・知識目標・行動目標（例：特定評価法の習得、症例数目標、研修参加等）"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>中期育成目標（3-6ヶ月）</Label>
              <Textarea 
                placeholder="専門性向上、業務範囲拡大、独立性向上、研修・資格取得等の目標"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>長期キャリア目標（6ヶ月-2年）</Label>
              <Textarea 
                placeholder="専門分野の方向性、認定資格取得、研究活動、指導的役割、将来的なキャリアパス等"
                className="min-h-[80px]"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">詳細アクションプラン</Label>
              <div className="grid grid-cols-1 gap-3">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="space-y-2">
                    <Label htmlFor={`action${num}`} className="text-sm font-medium">アクション{num}（優先度：{num}）</Label>
                    <Input id={`action${num}`} placeholder="具体的な取り組み・研修・目標" />
                    <div className="grid grid-cols-4 gap-2">
                      <Input placeholder="開始日" type="date" />
                      <Input placeholder="完了予定日" type="date" />
                      <Input placeholder="指導者・支援者" />
                      <Input placeholder="成果指標・評価方法" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>指導体制・メンタリング計画</Label>
              <Textarea 
                placeholder="主指導者、副指導者、メンタリング方法、頻度、指導内容、評価方法等"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>継続的評価・フィードバック計画</Label>
              <Textarea 
                placeholder="評価時期、評価方法、フィードバック方法、目標達成度確認方法等"
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
                  <option value="biweekly">隔週面談</option>
                  <option value="monthly">月次面談</option>
                  <option value="weekly-check">週次チェック</option>
                  <option value="milestone">目標達成マイルストーン</option>
                </select>
              </div>
              <div>
                <Label htmlFor="priority-support">重点支援領域</Label>
                <select className="w-full p-2 border rounded">
                  <option value="technical-skills">技術習得</option>
                  <option value="cognitive-assessment">認知機能評価</option>
                  <option value="adl-training">ADL訓練</option>
                  <option value="patient-communication">患者対応</option>
                  <option value="documentation">記録・報告</option>
                  <option value="team-collaboration">チーム連携</option>
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
                <Label>技術習得度</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="skill-excellent" />
                    <Label htmlFor="skill-excellent" className="ml-1 text-sm">優秀</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="skill-good" />
                    <Label htmlFor="skill-good" className="ml-1 text-sm">良好</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="average" id="skill-average" />
                    <Label htmlFor="skill-average" className="ml-1 text-sm">平均</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="needs-support" id="skill-support" />
                    <Label htmlFor="skill-support" className="ml-1 text-sm">要支援</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>成長ポテンシャル</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="very-high" id="potential-very-high" />
                    <Label htmlFor="potential-very-high" className="ml-1 text-sm">非常に高い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="potential-high" />
                    <Label htmlFor="potential-high" className="ml-1 text-sm">高い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="potential-medium" />
                    <Label htmlFor="potential-medium" className="ml-1 text-sm">中程度</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="potential-low" />
                    <Label htmlFor="potential-low" className="ml-1 text-sm">限定的</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>適応状況</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="adaptation-excellent" />
                    <Label htmlFor="adaptation-excellent" className="ml-1 text-sm">優秀</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="adaptation-good" />
                    <Label htmlFor="adaptation-good" className="ml-1 text-sm">良好</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="adjusting" id="adaptation-adjusting" />
                    <Label htmlFor="adaptation-adjusting" className="ml-1 text-sm">適応中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="difficulty" id="adaptation-difficulty" />
                    <Label htmlFor="adaptation-difficulty" className="ml-1 text-sm">困難</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>離職リスク</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="very-low" id="risk-very-low" />
                    <Label htmlFor="risk-very-low" className="ml-1 text-sm">非常に低い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="risk-low" />
                    <Label htmlFor="risk-low" className="ml-1 text-sm">低い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="risk-medium" />
                    <Label htmlFor="risk-medium" className="ml-1 text-sm">中程度</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="risk-high" />
                    <Label htmlFor="risk-high" className="ml-1 text-sm">高い</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <Textarea 
              placeholder="総合評価、技術習得状況、適応度、ポテンシャル、動機タイプを考慮した個別育成計画、特記事項、今後の重点指導方針等を詳細に記入"
              className="min-h-[120px]"
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