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

export default function VeteranOTUnified30MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-teal-50">
          <CardTitle className="text-2xl">ベテラン作業療法士（11年目以上）定期面談シート V5（30分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：リハビリテーション科</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              30分の標準面談です。<strong>動機タイプ判定</strong>を活用し、ベテラン作業療法士の組織貢献とエキスパート能力を評価支援します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. エキスパート能力・組織貢献の評価（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. エキスパート能力・組織貢献の評価（8分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">ベテランOTエキスパート能力・組織貢献評価</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "専門分野の最高水準の知識・技術",
                "組織全体への技術指導・知識伝承",
                "若手・中堅スタッフのメンタリング",
                "研究活動・学術発表・エビデンス構築",
                "院内外研修・講師活動・知名度",
                "専門委員会・学会活動・社会貢献",
                "業務改善・イノベーション・新技術導入",
                "組織ビジョン・戦略への貢献",
                "外部機関・地域連携・ネットワーク構築",
                "次世代リーダー育成・サクセッションプラン"
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
              <Label>現在のエキスパート活動・組織貢献</Label>
              <Textarea 
                placeholder="専門知識の活用、若手指導、研究活動、外部活動、組織運営への貢献等詳細に"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>エキスパートとしての成果・実績</Label>
              <Textarea 
                placeholder="研究成果、指導実績、学会活動、表彰・評価、社会的影響等"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. 動機タイプ別確認・エンゲージメント分析（8分） */}
          <div className="space-y-4 bg-teal-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 動機タイプ別確認・エンゲージメント分析（8分）</h3>
            
            {selectedMotivationType && typeSpecificQuestions.length > 0 && (
              <div className="bg-purple-50 p-3 rounded-lg space-y-2 mb-4">
                <Label className="text-base font-semibold text-purple-700">
                  動機タイプに基づく個別質問（ベテランOT向け）
                </Label>
                <div className="space-y-3">
                  {typeSpecificQuestions.slice(0, 2).map((question, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-sm">{question}</Label>
                      <Textarea 
                        placeholder="ベテラン作業療法士としての視点で詳しくお答えください"
                        className="min-h-[60px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">エンゲージメント・継続意向・組織コミットメント</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "現在の仕事への情熱・モチベーション",
                "組織への愛着・貢献意欲",
                "次世代育成への使命感",
                "専門性継続発展への意欲",
                "退職までの継続意向"
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

          {/* 3. 継続支援・知識伝承戦略（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 継続支援・知識伝承戦略（7分）</h3>
            
            <div className="space-y-2">
              <Label>今後の展望・継続発展への課題</Label>
              <Textarea 
                placeholder="専門性継続発展、次世代育成、知識伝承、新たな挑戦、ライフステージの課題等"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">必要な支援（複数選択可）</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "最新技術・知識アップデート支援",
                  "指導・メンタリングスキル向上研修",
                  "知識伝承・ドキュメンテーション支援",
                  "研究活動・学術活動継続支援",
                  "外部活動・社会貢献活動支援",
                  "ワークライフバランス・健康管理",
                  "キャリアトランジション支援",
                  "退職準備・ポストキャリア相談",
                  "シニア専門家としての活用機会",
                  "経験・知識を活かした新役割開発"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox id={`support-${item}`} />
                    <Label htmlFor={`support-${item}`} className="text-sm">{item}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. 継続貢献・レガシー構築（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 継続貢献・レガシー構築（7分）</h3>
            
            {selectedMotivationType && (
              <Alert className="bg-purple-50 border-purple-200">
                <AlertDescription>
                  <strong>動機タイプに基づく推奨継続活動：</strong>
                  <div className="mt-1 text-sm">
                    {selectedMotivationType === 'growth' && '最新技術習得・先進的研究・国際学会・革新技術導入・新分野開拓'}
                    {selectedMotivationType === 'recognition' && '学会講師・評議員・表彰受賞・メディア出演・著作・ブランド構築'}
                    {selectedMotivationType === 'stability' && '安定した指導継続・知識伝承・後進育成・組織の安定性維持'}
                    {selectedMotivationType === 'teamwork' && 'チーム結束力強化・多世代連携・組織文化伝承・協働環境構築'}
                    {selectedMotivationType === 'efficiency' && '効率的指導法開発・システム化推進・生産性向上・業務最適化'}
                    {selectedMotivationType === 'compensation' && '専門手当・費用対効果最大化・成果連動待遇・シニア専門家手当'}
                    {selectedMotivationType === 'creativity' && '独自手法開発・創造的指導・イノベーション・芸術的アプローチ'}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label>短期貢献目標（6ヶ月）</Label>
              <Textarea 
                placeholder="若手育成プログラム、専門技術伝承、外部講師活動等の具体的目標"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>長期的な組織貢献ビジョン</Label>
              <Textarea 
                placeholder="知識・技術の伝承、組織発展への貢献、後進育成、専門分野発展、レガシー構築等"
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
                <Input type="text" id="follow-method" placeholder="四半期面談、プロジェクト単位等" />
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
                <Label>エキスパートレベル</Label>
                <RadioGroup className="flex flex-col space-y-1">
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
                <Label>組織貢献度</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="exceptional" id="contrib-exceptional" />
                    <Label htmlFor="contrib-exceptional" className="ml-1 text-sm">卓越</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="contrib-high" />
                    <Label htmlFor="contrib-high" className="ml-1 text-sm">高い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="contrib-good" />
                    <Label htmlFor="contrib-good" className="ml-1 text-sm">良好</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>継続意向</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="long-term" id="continue-long" />
                    <Label htmlFor="continue-long" className="ml-1 text-sm">長期継続</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium-term" id="continue-medium" />
                    <Label htmlFor="continue-medium" className="ml-1 text-sm">中期継続</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="uncertain" id="continue-uncertain" />
                    <Label htmlFor="continue-uncertain" className="ml-1 text-sm">未定</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <Textarea 
              placeholder="エキスパート機能、組織貢献度、継続発展支援方針、動機タイプを考慮した個別支援計画等"
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