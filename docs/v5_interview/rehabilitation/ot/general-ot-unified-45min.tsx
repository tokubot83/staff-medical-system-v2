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

export default function GeneralOTUnified45MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-teal-50">
          <CardTitle className="text-2xl">一般作業療法士（2-3年目）定期面談シート V5（45分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：リハビリテーション科</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              45分の詳細面談です。<strong>動機タイプ判定</strong>を活用し、一般作業療法士の包括的な能力評価と個別最適化された成長戦略を策定します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. 作業療法専門技術の包括評価（12分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 作業療法専門技術の包括評価（12分）</h3>
            
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
                "基本的ADL評価・訓練（整容・更衣・入浴等）",
                "手段的ADL評価・訓練（調理・掃除・買い物等）",
                "認知機能評価（HDS-R・MMSE・COGNISTAT・FAB等）",
                "高次脳機能評価（注意・記憶・遂行機能・失語・失行等）",
                "上肢機能評価・訓練（可動域・筋力・協調性・巧緻性）",
                "手指機能評価・訓練（握力・ピンチ力・器用性等）",
                "作業活動プログラム（手工芸・園芸・調理・レクリエーション等）",
                "環境調整・住環境評価・改修提案",
                "福祉用具選定・適合・使用指導",
                "精神機能面へのアプローチ・心理的支援",
                "患者・家族教育・指導・カウンセリング",
                "多職種連携・情報共有・カンファレンス参加",
                "記録・評価書・報告書作成・ケアプラン作成",
                "安全管理・リスク管理・事故防止",
                "後輩指導・学生実習指導"
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
                placeholder="担当患者数、主要疾患（脳血管疾患・整形外科疾患・認知症・精神疾患等）、重症度、ADL状況、認知機能レベル、訓練内容、治療成果等詳細に記入"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>専門技術の習得状況・成長分析</Label>
              <Textarea 
                placeholder="評価技術の精度向上、作業活動選択能力、患者対応技術、記録能力、チーム連携能力、後輩指導能力等の成長度と今後の課題"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>専門性の方向性・キャリア志向</Label>
              <Textarea 
                placeholder="身体障害・精神障害・認知症・発達障害等の専門分野への志向、将来の専門性、研究・学術活動への関心等"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. 動機タイプ別詳細確認・職業的成熟度評価（10分） */}
          <div className="space-y-4 bg-teal-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 動機タイプ別詳細確認・職業的成熟度評価（10分）</h3>
            
            {selectedMotivationType && typeSpecificQuestions.length > 0 && (
              <div className="bg-purple-50 p-3 rounded-lg space-y-2 mb-4">
                <Label className="text-base font-semibold text-purple-700">
                  動機タイプに基づく詳細質問（一般OT詳細版）
                </Label>
                <div className="space-y-3">
                  {typeSpecificQuestions.slice(0, 3).map((question, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-sm font-medium">{`質問${index + 1}：${question}`}</Label>
                      <Textarea 
                        placeholder="一般作業療法士としての専門的視点で詳しくお答えください"
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
                "専門性向上への意欲",
                "患者への貢献実感",
                "チームワーク・人間関係",
                "将来への期待・希望",
                "ワークライフバランス",
                "7年後の継続意向"
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
              <Label>作業療法士としての職業的アイデンティティ・価値観</Label>
              <Textarea 
                placeholder="OTとしての職業観、患者に対する思い、社会的使命感、専門職としての誇り等"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>中長期キャリアビジョン・将来目標</Label>
              <Textarea 
                placeholder="5-10年後の目標、目指したい専門分野、取得したい資格、研究・学術活動、管理職志向、独立開業等"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 3. 包括的課題分析・成長支援ニーズ（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 包括的課題分析・成長支援ニーズ（10分）</h3>
            
            <div className="space-y-2">
              <Label>現在の専門的・技術的課題（詳細）</Label>
              <Textarea 
                placeholder="複雑症例への対応、高次脳機能評価の解釈、作業活動選択の根拠、環境調整技術、患者の精神面へのアプローチ等の具体的課題"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>職業的・心理的な課題・ストレス</Label>
              <Textarea 
                placeholder="責任の重さ、判断に対する不安、後輩指導への不安、キャリアへの迷い、ワークライフバランス等"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">必要な教育・研修・支援（複数選択可）</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "高次脳機能障害専門研修",
                  "認知症ケア・BPSDアプローチ研修",
                  "精神障害・うつ病アプローチ研修",
                  "環境調整・住環境評価専門研修",
                  "福祉用具・IT機器活用研修",
                  "作業活動プログラム開発研修",
                  "家族支援・カウンセリング技術研修",
                  "症例検討会・事例研究会",
                  "専門資格取得支援（認定OT・専門OT等）",
                  "学会発表・論文作成支援",
                  "外部研修・視察・ネットワーク構築",
                  "後輩指導・教育スキル研修",
                  "学生実習指導者研修",
                  "リーダーシップ・マネジメント研修",
                  "キャリア相談・進路指導",
                  "メンタルヘルスケア・ストレス管理"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox id={`support-${item}`} />
                    <Label htmlFor={`support-${item}`} className="text-sm">{item}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>最優先で必要な専門的支援・教育プログラム（詳細）</Label>
              <Textarea 
                placeholder="上記選択項目の中で最も重要なもの3つを選び、具体的な支援方法・教育内容・実施方法・期待する効果等を詳しく"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>職場環境・制度・業務体制への要望・改善提案</Label>
              <Textarea 
                placeholder="専門性を活かせる業務体制、教育制度、指導体制、設備・機器、労働条件、評価制度等への要望や改善提案"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 4. 個別最適化成長戦略・詳細目標設定（13分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 個別最適化成長戦略・詳細目標設定（13分）</h3>
            
            {selectedMotivationType && (
              <Alert className="bg-purple-50 border-purple-200">
                <AlertDescription>
                  <strong>動機タイプに基づく個別最適化成長戦略：</strong>
                  <div className="mt-1 text-sm">
                    {selectedMotivationType === 'growth' && '高度専門技術研修・専門資格取得・研究活動参加・学会発表・新技術導入・指導的役割'}
                    {selectedMotivationType === 'recognition' && '専門性の可視化・技術成果発表・院内外表彰・専門委員会参加・リーダー的役割・評価制度活用'}
                    {selectedMotivationType === 'stability' && '専門技術の安定習得・継続的スキルアップ・確実な指導体制・段階的責任拡大・長期キャリア形成'}
                    {selectedMotivationType === 'teamwork' && 'チーム医療リーダー・多職種連携促進・後輩指導・患者家族支援・組織貢献・調整役割'}
                    {selectedMotivationType === 'efficiency' && '効率的治療プロトコール開発・業務改善・時間管理・システム化・生産性向上・コスト意識'}
                    {selectedMotivationType === 'compensation' && '昇進・昇格機会・専門手当・資格手当・成果評価・給与向上・福利厚生・待遇改善'}
                    {selectedMotivationType === 'creativity' && '独自アプローチ開発・創造的治療法・イノベーション・新プログラム開発・自由度拡大・創造的環境'}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label>短期専門目標（1-3ヶ月）</Label>
              <Textarea 
                placeholder="具体的で測定可能な専門技術目標・知識目標・行動目標（例：特定評価法の習得、症例研究、研修参加等）"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>中期キャリア目標（3-6ヶ月）</Label>
              <Textarea 
                placeholder="専門性向上、業務範囲拡大、指導的役割、研修・資格取得、研究活動等の目標"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>長期キャリアビジョン（6ヶ月-3年）</Label>
              <Textarea 
                placeholder="専門分野の確立、認定資格取得、研究・学術活動、指導的・管理的役割、将来的なキャリアパス等"
                className="min-h-[80px]"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">詳細成長アクションプラン</Label>
              <div className="grid grid-cols-1 gap-3">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="space-y-2">
                    <Label htmlFor={`action${num}`} className="text-sm font-medium">成長アクション{num}（優先度：{num}）</Label>
                    <Input id={`action${num}`} placeholder="具体的な専門的取り組み・研修・目標" />
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
              <Label>専門指導・メンタリング計画</Label>
              <Textarea 
                placeholder="専門指導者、外部専門家、メンタリング方法、頻度、指導内容、専門性評価方法等"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>継続的専門性評価・フィードバック計画</Label>
              <Textarea 
                placeholder="専門技術評価時期・方法、フィードバック方法、目標達成度確認、専門性向上度測定等"
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
                  <option value="monthly">月次面談</option>
                  <option value="bimonthly">隔月面談</option>
                  <option value="quarterly">四半期面談</option>
                  <option value="milestone">目標達成マイルストーン</option>
                </select>
              </div>
              <div>
                <Label htmlFor="priority-focus">重点育成領域</Label>
                <select className="w-full p-2 border rounded">
                  <option value="advanced-assessment">高度評価技術</option>
                  <option value="cognitive-rehabilitation">認知機能リハ</option>
                  <option value="environmental-modification">環境調整</option>
                  <option value="leadership-development">指導力開発</option>
                  <option value="specialization">専門分野確立</option>
                  <option value="research-development">研究・学術活動</option>
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
                <Label>専門技術習得度</Label>
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
                <Label>指導力・リーダーシップ</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="leadership-excellent" />
                    <Label htmlFor="leadership-excellent" className="ml-1 text-sm">優秀</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="developing" id="leadership-developing" />
                    <Label htmlFor="leadership-developing" className="ml-1 text-sm">発展中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="emerging" id="leadership-emerging" />
                    <Label htmlFor="leadership-emerging" className="ml-1 text-sm">芽生え</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="limited" id="leadership-limited" />
                    <Label htmlFor="leadership-limited" className="ml-1 text-sm">限定的</Label>
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
              placeholder="総合評価、専門技術習得状況、成長度、ポテンシャル、指導力、動機タイプを考慮した個別成長戦略、特記事項、今後の重点育成方針等を詳細に記入"
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