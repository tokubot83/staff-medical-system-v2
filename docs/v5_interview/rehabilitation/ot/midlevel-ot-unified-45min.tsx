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

export default function MidlevelOTUnified45MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-teal-50">
          <CardTitle className="text-2xl">中堅作業療法士（4-10年目）定期面談シート V5（45分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：リハビリテーション科</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              45分の詳細面談です。<strong>動機タイプ判定</strong>を活用し、中堅作業療法士の包括的な専門性評価と戦略的キャリア開発を支援します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. 専門性・リーダーシップの包括評価（12分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 専門性・リーダーシップの包括評価（12分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">OT専門性・指導力・組織貢献の詳細評価</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "高度なADL評価・訓練技術の習得・実践",
                "認知機能・高次脳機能の専門的評価・アプローチ",
                "複雑症例・難症例への対応・治療技術",
                "専門分野における深い知識・最新技術の活用",
                "作業活動プログラムの開発・実施・評価",
                "環境調整・福祉用具の専門的選定・適合",
                "患者・家族への専門的指導・カウンセリング",
                "後輩OT・新人への技術指導・教育・メンタリング",
                "学生実習指導・臨床教育への貢献",
                "チームリーダーシップ・多職種連携の推進",
                "研究活動・学術発表・論文作成・エビデンス構築",
                "院内外研修・講演・専門委員会活動",
                "業務改善・効率化・標準化への積極的貢献",
                "新技術・新プログラムの導入・普及活動",
                "組織運営・管理業務への参画・貢献"
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
              <Label>現在の専門領域・担当業務・組織での役割の詳細</Label>
              <Textarea 
                placeholder="専門分野、担当患者群、指導・教育役割、委員会・プロジェクト参加、研究テーマ、外部活動等を詳細に記入"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>専門技術・指導力・組織貢献の成長実績・成果</Label>
              <Textarea 
                placeholder="技術習得、資格取得、論文・学会発表、指導実績、プロジェクト成果、業務改善効果、組織への具体的貢献等"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>リーダーシップスタイル・指導哲学・組織への影響</Label>
              <Textarea 
                placeholder="指導・教育に対する考え方、チームリーダーとしてのスタイル、後輩育成への取り組み、組織文化への影響等"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. 動機タイプ別詳細分析・キャリア戦略（10分） */}
          <div className="space-y-4 bg-teal-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 動機タイプ別詳細分析・キャリア戦略（10分）</h3>
            
            {selectedMotivationType && typeSpecificQuestions.length > 0 && (
              <div className="bg-purple-50 p-3 rounded-lg space-y-2 mb-4">
                <Label className="text-base font-semibold text-purple-700">
                  動機タイプに基づく詳細質問（中堅OT戦略版）
                </Label>
                <div className="space-y-3">
                  {typeSpecificQuestions.slice(0, 3).map((question, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-sm font-medium">{`質問${index + 1}：${question}`}</Label>
                      <Textarea 
                        placeholder="中堅作業療法士としての戦略的視点で詳しくお答えください"
                        className="min-h-[70px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>中堅OTとしてのキャリアビジョン・将来戦略</Label>
              <Textarea 
                placeholder="5-10年後の専門性目標、管理職志向、研究・教育活動、独立開業、専門分野の方向性等"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織・社会への貢献意識・使命感</Label>
              <Textarea 
                placeholder="OTとしての社会的使命、組織発展への責任感、専門職としての貢献、次世代育成への思い等"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 3. 包括的発展支援・課題解決戦略（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 包括的発展支援・課題解決戦略（10分）</h3>
            
            <div className="space-y-2">
              <Label>現在の専門的・職業的課題（詳細分析）</Label>
              <Textarea 
                placeholder="高度技術習得、研究活動、指導技術、時間管理、組織運営、専門分野確立、キャリア形成等の具体的課題"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">必要な専門的支援・研修・機会（複数選択可）</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "高度専門技術研修・トレーニング",
                  "認定・専門作業療法士資格取得支援",
                  "大学院進学・博士号取得支援",
                  "国内外学会・研修参加支援",
                  "研究活動・論文作成・統計解析支援",
                  "指導技術・教育法・メンタリング研修",
                  "リーダーシップ・マネジメント研修",
                  "管理職準備・経営管理研修",
                  "専門委員会・学会活動参加支援",
                  "講師・講演活動機会提供",
                  "海外研修・国際交流プログラム",
                  "産学連携・共同研究プロジェクト",
                  "起業・独立開業支援・コンサルティング",
                  "専門分野ネットワーク構築支援",
                  "キャリア戦略・人生設計カウンセリング",
                  "ワークライフバランス・ストレス管理支援"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox id={`support-${item}`} />
                    <Label htmlFor={`support-${item}`} className="text-sm">{item}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>最優先発展支援・戦略的投資（詳細）</Label>
              <Textarea 
                placeholder="上記選択項目の中で最も重要なもの3つを選び、具体的な支援方法・実施計画・期待する効果・ROI等を詳しく"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織・制度・環境への戦略的要望・改善提案</Label>
              <Textarea 
                placeholder="専門性発揮のための制度改革、研究・教育体制整備、評価制度改善、キャリアパス明確化、投資優先度等"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 4. 戦略的発展計画・詳細目標設定（13分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 戦略的発展計画・詳細目標設定（13分）</h3>
            
            {selectedMotivationType && (
              <Alert className="bg-purple-50 border-purple-200">
                <AlertDescription>
                  <strong>動機タイプに基づく戦略的発展支援：</strong>
                  <div className="mt-1 text-sm">
                    {selectedMotivationType === 'growth' && '最先端技術習得・専門資格取得・研究活動・国際学会・新分野開拓・イノベーション・博士号取得'}
                    {selectedMotivationType === 'recognition' && '専門性可視化・学会発表・論文執筆・講師活動・メディア露出・表彰制度・専門委員会・ブランド構築'}
                    {selectedMotivationType === 'stability' && '専門技術安定習得・継続的指導・確実なキャリア形成・安定した責任拡大・長期雇用保障'}
                    {selectedMotivationType === 'teamwork' && 'チーム統括・多職種連携推進・組織調整・後輩育成・協働プロジェクト・調和的発展'}
                    {selectedMotivationType === 'efficiency' && '効率的手法開発・業務改善・システム化・生産性向上・合理化・ROI最大化・時短技術'}
                    {selectedMotivationType === 'compensation' && '専門手当拡充・昇進・管理職・評価制度・成果報酬・ストックオプション・独立支援'}
                    {selectedMotivationType === 'creativity' && '独自手法開発・創造的アプローチ・新プログラム・自由度拡大・イノベーション・芸術的表現'}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label>短期戦略目標（3-6ヶ月）</Label>
              <Textarea 
                placeholder="具体的で測定可能な専門技術・研究・指導・組織貢献目標とKPI"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>中期キャリア戦略（6ヶ月-2年）</Label>
              <Textarea 
                placeholder="専門分野確立、管理職準備、研究・教育活動、組織での地位確立等"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>長期ビジョン・ライフプラン（2-10年）</Label>
              <Textarea 
                placeholder="専門家としての最終目標、社会的地位、独立性、組織への貢献レガシー等"
                className="min-h-[80px]"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">戦略的アクションプラン（詳細）</Label>
              <div className="grid grid-cols-1 gap-3">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="space-y-2">
                    <Label htmlFor={`strategic-action${num}`} className="text-sm font-medium">戦略アクション{num}（優先度：{num}）</Label>
                    <Input id={`strategic-action${num}`} placeholder="具体的な戦略的取り組み・プロジェクト" />
                    <div className="grid grid-cols-5 gap-2">
                      <Input placeholder="開始日" type="date" />
                      <Input placeholder="完了予定日" type="date" />
                      <Input placeholder="責任者・支援者" />
                      <Input placeholder="成果指標・KPI・測定方法" />
                      <Input placeholder="必要リソース・予算" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>専門的メンタリング・指導体制計画</Label>
              <Textarea 
                placeholder="専門分野指導者、外部エキスパート、メンタリング方法、頻度、評価、フィードバック体制等"
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
                  <option value="monthly">月次戦略面談</option>
                  <option value="quarterly">四半期評価</option>
                  <option value="project-based">プロジェクト単位</option>
                  <option value="milestone">戦略マイルストーン</option>
                </select>
              </div>
              <div>
                <Label htmlFor="priority-focus">重点発展領域</Label>
                <select className="w-full p-2 border rounded">
                  <option value="technical-excellence">技術的卓越性</option>
                  <option value="research-academia">研究・学術活動</option>
                  <option value="leadership-management">指導・管理能力</option>
                  <option value="specialization">専門分野確立</option>
                  <option value="organizational-contribution">組織貢献</option>
                  <option value="innovation-creativity">革新・創造性</option>
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
                <Label>専門技術レベル</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="master" id="tech-master" />
                    <Label htmlFor="tech-master" className="ml-1 text-sm">マスター</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="expert" id="tech-expert" />
                    <Label htmlFor="tech-expert" className="ml-1 text-sm">エキスパート</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="advanced" id="tech-advanced" />
                    <Label htmlFor="tech-advanced" className="ml-1 text-sm">上級</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="developing" id="tech-developing" />
                    <Label htmlFor="tech-developing" className="ml-1 text-sm">発展中</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>指導力・リーダーシップ</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="visionary" id="leader-visionary" />
                    <Label htmlFor="leader-visionary" className="ml-1 text-sm">ビジョナリー</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="strong" id="leader-strong" />
                    <Label htmlFor="leader-strong" className="ml-1 text-sm">強力</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="developing" id="leader-developing" />
                    <Label htmlFor="leader-developing" className="ml-1 text-sm">発展中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="emerging" id="leader-emerging" />
                    <Label htmlFor="leader-emerging" className="ml-1 text-sm">新興</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>成長ポテンシャル</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="exceptional" id="potential-exceptional" />
                    <Label htmlFor="potential-exceptional" className="ml-1 text-sm">卓越</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="very-high" id="potential-very-high" />
                    <Label htmlFor="potential-very-high" className="ml-1 text-sm">非常に高い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="potential-high" />
                    <Label htmlFor="potential-high" className="ml-1 text-sm">高い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="moderate" id="potential-moderate" />
                    <Label htmlFor="potential-moderate" className="ml-1 text-sm">中程度</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>組織価値・投資価値</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="strategic-asset" id="value-strategic" />
                    <Label htmlFor="value-strategic" className="ml-1 text-sm">戦略的資産</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="high-value" id="value-high" />
                    <Label htmlFor="value-high" className="ml-1 text-sm">高価値</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="valuable" id="value-valuable" />
                    <Label htmlFor="value-valuable" className="ml-1 text-sm">価値有り</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="developing" id="value-developing" />
                    <Label htmlFor="value-developing" className="ml-1 text-sm">発展中</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <Textarea 
              placeholder="総合評価、専門技術・指導力・ポテンシャル・組織貢献度、動機タイプを考慮した戦略的発展計画、投資価値、期待・活用方針、特記事項等を詳細に記入"
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