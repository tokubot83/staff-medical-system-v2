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

export default function VeteranOTUnified45MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-teal-50">
          <CardTitle className="text-2xl">ベテラン作業療法士（11年目以上）定期面談シート V5（45分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：リハビリテーション科</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              45分の詳細面談です。<strong>動機タイプ判定</strong>を活用し、ベテラン作業療法士の包括的なエキスパート評価と戦略的活用計画を策定します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. エキスパート能力・組織貢献の包括評価（12分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. エキスパート能力・組織貢献の包括評価（12分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">ベテランOTエキスパート能力・組織貢献・社会的影響力の詳細評価</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "専門分野の最高水準の知識・技術・臨床判断力",
                "組織全体への技術指導・知識伝承・メンタリング",
                "若手・中堅スタッフの包括的育成・キャリア支援",
                "研究活動・学術発表・エビデンス構築・論文執筆",
                "院内外研修・講師活動・専門的プレゼンテーション",
                "専門委員会・学会活動・社会貢献・業界リーダーシップ",
                "業務改善・イノベーション・新技術導入・標準化推進",
                "組織ビジョン・戦略への貢献・意思決定参画",
                "外部機関・地域連携・ネットワーク構築・渉外活動",
                "次世代リーダー育成・サクセッションプランニング",
                "危機管理・問題解決・複雑事例への対応・相談対応",
                "新人・学生教育システム構築・臨床教育プログラム開発",
                "多職種連携推進・チーム医療のリーダーシップ",
                "質管理・安全管理・リスクマネジメントの専門的対応",
                "組織文化形成・価値観浸透・専門職アイデンティティ醸成"
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
              <Label>現在のエキスパート活動・組織貢献・社会的活動の詳細</Label>
              <Textarea 
                placeholder="専門知識の活用、若手指導実績、研究活動、外部活動、組織運営への貢献、社会的な影響力、業界での地位等を詳細に記入"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>エキスパートとしての成果・実績・社会的評価</Label>
              <Textarea 
                placeholder="研究成果、指導実績、学会活動、表彰・評価、社会的影響、メディア露出、著作、特許、業界での評価等"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>専門家としての哲学・価値観・使命感</Label>
              <Textarea 
                placeholder="OTとしての哲学、患者・社会に対する使命感、専門職としての価値観、後進育成への思い、組織・業界への責任感等"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. 動機タイプ別詳細分析・継続エンゲージメント戦略（10分） */}
          <div className="space-y-4 bg-teal-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 動機タイプ別詳細分析・継続エンゲージメント戦略（10分）</h3>
            
            {selectedMotivationType && typeSpecificQuestions.length > 0 && (
              <div className="bg-purple-50 p-3 rounded-lg space-y-2 mb-4">
                <Label className="text-base font-semibold text-purple-700">
                  動機タイプに基づく詳細質問（ベテランOTエキスパート版）
                </Label>
                <div className="space-y-3">
                  {typeSpecificQuestions.slice(0, 3).map((question, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-sm font-medium">{`質問${index + 1}：${question}`}</Label>
                      <Textarea 
                        placeholder="ベテラン作業療法士・エキスパートとしての戦略的視点で詳しくお答えください"
                        className="min-h-[70px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>ベテランOTとしてのライフステージ・キャリアビジョン</Label>
              <Textarea 
                placeholder="今後の専門家としての目標、ライフステージに応じたキャリア調整、退職後の活動、レガシー構築等"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織・社会・業界への継続的貢献意識・責任感</Label>
              <Textarea 
                placeholder="エキスパートとしての社会的責任、業界発展への貢献、次世代への知識伝承、組織の持続的発展への責任等"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>継続的モチベーション・エンゲージメント要因分析</Label>
              <Textarea 
                placeholder="現在も高いモチベーションを維持している要因、やりがいの源泉、継続的成長の原動力、組織愛着の要因等"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 3. 包括的継続支援・知識伝承・レガシー構築戦略（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 包括的継続支援・知識伝承・レガシー構築戦略（10分）</h3>
            
            <div className="space-y-2">
              <Label>今後の展望・継続発展への課題・ライフステージ調整</Label>
              <Textarea 
                placeholder="専門性継続発展、次世代育成、知識伝承、新たな挑戦、ワークライフバランス、健康管理、家族との時間等の課題"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>知識・技術・経験の体系的伝承計画・ドキュメント化</Label>
              <Textarea 
                placeholder="専門知識の文書化、技術のマニュアル化、経験・ノウハウの伝承方法、教材・システム開発、知的財産化等"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">必要な継続支援・環境整備（複数選択可）</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "最新技術・知識アップデート継続支援",
                  "指導・メンタリングスキル高度化研修",
                  "知識伝承・ドキュメンテーション支援システム",
                  "研究活動・学術活動継続支援・予算確保",
                  "外部活動・社会貢献活動支援・時間確保",
                  "ワークライフバランス・健康管理プログラム",
                  "キャリアトランジション・段階的責任調整",
                  "退職準備・ポストキャリア・セカンドキャリア相談",
                  "シニア専門家としての活用機会・新役割開発",
                  "経験・知識を活かした新プロジェクト・事業開発",
                  "後継者育成・サクセッションプランニング支援",
                  "専門的相談・アドバイザー・コンサルタント機会",
                  "執筆・講演・メディア活動支援・プラットフォーム",
                  "国際交流・海外専門家との連携・グローバル活動",
                  "顕彰制度・表彰・名誉職・殿堂入り・レガシー顕彰",
                  "フレックス勤務・在宅勤務・柔軟な働き方制度"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox id={`support-${item}`} />
                    <Label htmlFor={`support-${item}`} className="text-sm">{item}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>最優先継続支援・戦略的投資・レガシー構築支援（詳細）</Label>
              <Textarea 
                placeholder="上記選択項目の中で最も重要なもの3つを選び、具体的な支援方法・実施計画・期待する効果・組織へのROI等を詳しく"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織・制度・文化への戦略的要望・改善提案・レガシー継承</Label>
              <Textarea 
                placeholder="エキスパート活用制度、知識伝承システム、評価制度、シニア専門家制度、組織文化改革、後進育成体制等の提案"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 4. 戦略的継続活用・レガシー構築・詳細計画（13分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 戦略的継続活用・レガシー構築・詳細計画（13分）</h3>
            
            {selectedMotivationType && (
              <Alert className="bg-purple-50 border-purple-200">
                <AlertDescription>
                  <strong>動機タイプに基づく戦略的継続活用・レガシー構築：</strong>
                  <div className="mt-1 text-sm">
                    {selectedMotivationType === 'growth' && '最先端技術習得継続・先進的研究リード・国際学会主導・革新技術導入・新分野開拓・イノベーション創出'}
                    {selectedMotivationType === 'recognition' && '学会重鎮・評議員・表彰受賞・メディア出演・著作出版・ブランド構築・殿堂入り・名誉職'}
                    {selectedMotivationType === 'stability' && '安定した指導継続・知識伝承・後進育成・組織の安定性維持・確実な技術継承・長期雇用継続'}
                    {selectedMotivationType === 'teamwork' && 'チーム結束力強化・多世代連携・組織文化伝承・協働環境構築・調和的発展・統合的リーダーシップ'}
                    {selectedMotivationType === 'efficiency' && '効率的指導法開発・システム化推進・生産性向上・業務最適化・コスト効率化・ROI最大化'}
                    {selectedMotivationType === 'compensation' && '専門手当・費用対効果最大化・成果連動待遇・シニア専門家手当・顕彰制度・金銭的レガシー'}
                    {selectedMotivationType === 'creativity' && '独自手法開発・創造的指導・イノベーション・芸術的アプローチ・オリジナル理論・創造的レガシー'}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label>短期継続貢献目標（6ヶ月-1年）</Label>
              <Textarea 
                placeholder="具体的で測定可能な継続貢献・指導・研究・社会活動目標とKPI"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>中期レガシー構築戦略（1-3年）</Label>
              <Textarea 
                placeholder="知識伝承システム、後継者育成、専門分野確立、組織文化構築等の戦略的取り組み"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>長期ビジョン・継続的影響力・永続的レガシー（3-10年）</Label>
              <Textarea 
                placeholder="専門家としての最終的な社会的地位、組織・業界への永続的影響、知識・技術・価値観の継承、歴史的評価等"
                className="min-h-[80px]"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">戦略的レガシー構築アクションプラン（詳細）</Label>
              <div className="grid grid-cols-1 gap-3">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="space-y-2">
                    <Label htmlFor={`legacy-action${num}`} className="text-sm font-medium">レガシーアクション{num}（優先度：{num}）</Label>
                    <Input id={`legacy-action${num}`} placeholder="具体的なレガシー構築・継続貢献プロジェクト" />
                    <div className="grid grid-cols-5 gap-2">
                      <Input placeholder="開始日" type="date" />
                      <Input placeholder="完了予定日" type="date" />
                      <Input placeholder="責任者・協力者" />
                      <Input placeholder="成果指標・評価方法・レガシー測定" />
                      <Input placeholder="必要リソース・投資・支援" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>継続的エキスパート活用・メンタリング体制</Label>
              <Textarea 
                placeholder="継続的な専門的役割、メンタリング方法、相談体制、アドバイザー機能、専門的判断・意思決定への関与等"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>知識伝承・組織記憶・文化継承システム</Label>
              <Textarea 
                placeholder="専門知識のデジタル化、経験のアーカイブ化、組織文化の継承方法、価値観の浸透システム、歴史的記録等"
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
                  <option value="quarterly">四半期戦略面談</option>
                  <option value="biannual">半年総合評価</option>
                  <option value="annual">年次レガシー評価</option>
                  <option value="milestone">レガシーマイルストーン</option>
                </select>
              </div>
              <div>
                <Label htmlFor="priority-focus">重点活用領域</Label>
                <select className="w-full p-2 border rounded">
                  <option value="knowledge-transfer">知識伝承</option>
                  <option value="mentoring">メンタリング</option>
                  <option value="strategic-advisory">戦略的助言</option>
                  <option value="research-leadership">研究リーダーシップ</option>
                  <option value="external-representation">対外的代表</option>
                  <option value="legacy-building">レガシー構築</option>
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
                <Label>エキスパート・マスターレベル</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="legendary" id="expert-legendary" />
                    <Label htmlFor="expert-legendary" className="ml-1 text-sm">レジェンド</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="master" id="expert-master" />
                    <Label htmlFor="expert-master" className="ml-1 text-sm">マスター</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="expert" id="expert-expert" />
                    <Label htmlFor="expert-expert" className="ml-1 text-sm">エキスパート</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="advanced" id="expert-advanced" />
                    <Label htmlFor="expert-advanced" className="ml-1 text-sm">上級</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>組織価値・戦略的重要性</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="irreplaceable" id="value-irreplaceable" />
                    <Label htmlFor="value-irreplaceable" className="ml-1 text-sm">代替不可能</Label>
                  </div>
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
                    <Label htmlFor="value-valuable" className="ml-1 text-sm">価値ある</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>知識伝承・指導力</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="master-teacher" id="teaching-master" />
                    <Label htmlFor="teaching-master" className="ml-1 text-sm">マスター教師</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="teaching-excellent" />
                    <Label htmlFor="teaching-excellent" className="ml-1 text-sm">卓越</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="strong" id="teaching-strong" />
                    <Label htmlFor="teaching-strong" className="ml-1 text-sm">優れた</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="teaching-good" />
                    <Label htmlFor="teaching-good" className="ml-1 text-sm">良好</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>継続活用・レガシー価値</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="historic" id="legacy-historic" />
                    <Label htmlFor="legacy-historic" className="ml-1 text-sm">歴史的価値</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="exceptional" id="legacy-exceptional" />
                    <Label htmlFor="legacy-exceptional" className="ml-1 text-sm">例外的価値</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="legacy-high" />
                    <Label htmlFor="legacy-high" className="ml-1 text-sm">高価値</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="significant" id="legacy-significant" />
                    <Label htmlFor="legacy-significant" className="ml-1 text-sm">重要価値</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <Textarea 
              placeholder="総合評価、エキスパート能力・組織貢献・社会的影響、知識伝承・指導力、継続活用価値、動機タイプを考慮した戦略的レガシー構築計画、組織への永続的価値、特記事項等を詳細に記入"
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