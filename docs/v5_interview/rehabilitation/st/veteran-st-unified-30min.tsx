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

export default function VeteranSTUnified30MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-indigo-50">
          <CardTitle className="text-2xl">ベテラン言語聴覚士（11年目以上）定期面談シート V5（30分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年　配属部署：リハビリテーション科</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              30分の標準面談です。<strong>動機タイプ判定</strong>を活用し、ベテラン言語聴覚士の専門性とリーダーシップを詳細評価します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. ベテランST専門性・指導力評価（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. ベテランST専門性・指導力評価（8分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">ベテランSTとしての最高水準専門能力</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "専門分野での卓越した技術・知識",
                "組織全体への専門技術指導力",
                "後輩・中堅STの育成・メンタリング",
                "組織マネジメント・リーダーシップ",
                "研究活動・エビデンス構築",
                "他職種・他部門との調整・統合力",
                "業務改革・イノベーション創出",
                "組織文化・価値観の体現・伝承"
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
              <Label>現在の主要業務と組織への影響</Label>
              <Textarea 
                placeholder="専門性を活かした最高難度症例対応、組織全体への指導・影響、他部門連携リーダーシップ、組織改革への貢献等"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>ベテランSTとしての独自の価値・貢献</Label>
              <Textarea 
                placeholder="他では代替困難な専門性、組織にとって唯一無二の価値、長年の経験で培った洞察力・判断力等"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. 動機タイプ別詳細確認・組織貢献ビジョン（8分） */}
          <div className="space-y-4 bg-indigo-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 動機タイプ別詳細確認・組織貢献ビジョン（8分）</h3>
            
            {/* 動機タイプ別の質問 */}
            {selectedMotivationType && typeSpecificQuestions.length > 0 && (
              <div className="bg-purple-50 p-3 rounded-lg space-y-2 mb-4">
                <Label className="text-base font-semibold text-purple-700">
                  動機タイプに基づく深層質問（ベテランST版）
                </Label>
                <div className="space-y-3">
                  {typeSpecificQuestions.slice(0, 2).map((question, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-sm">{question}</Label>
                      <Textarea 
                        placeholder="ベテラン言語聴覚士としての豊富な経験と深い洞察でお答えください"
                        className="min-h-[60px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <Label className="text-base font-semibold">現在の関心・課題領域</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "新しい専門技術・知識の探求",
                  "後進の育成・キャリア支援",
                  "組織マネジメント・経営参画",
                  "研究活動・エビデンス構築",
                  "地域医療・社会貢献活動",
                  "専門職団体・学会活動",
                  "教育機関との連携・講師活動",
                  "国際交流・グローバル活動",
                  "イノベーション・新サービス開発",
                  "ワークライフバランス・健康管理",
                  "セカンドキャリア・転身準備",
                  "その他"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox id={item} />
                    <Label htmlFor={item} className="text-sm">{item}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>今後の組織貢献ビジョン</Label>
              <Textarea 
                placeholder="ST部門・組織全体への長期的貢献方針、次世代育成への取り組み、組織文化継承・発展への思い等"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 3. 長期戦略・レガシー構築（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 長期戦略・レガシー構築（8分）</h3>
            
            <div className="space-y-2">
              <Label>短期目標（6ヶ月以内）</Label>
              <Input 
                placeholder="例：新しい専門領域開拓、組織改革プロジェクト、次世代リーダー育成システム構築"
              />
            </div>

            <div className="space-y-2">
              <Label>中長期ビジョン（1-3年）</Label>
              <Input 
                placeholder="例：ST部門の抜本的改革、地域医療ネットワーク構築、専門職教育システム確立"
              />
            </div>

            <div className="space-y-2">
              <Label>組織に残したいレガシー・財産</Label>
              <Textarea 
                placeholder="長年の経験で蓄積した知識・技術の体系化、後進育成システム、組織文化・価値観の継承等"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>必要なサポート・環境整備</Label>
              <Textarea 
                placeholder="組織からの権限・リソース、外部ネットワーク活用、設備・システム投資、人材配置等"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織・上司への提言・要望</Label>
              <Textarea 
                placeholder="組織運営への提言、制度・仕組み改善提案、次世代のための環境整備要望等"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. その他・自由記述（6分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. その他・自由記述（6分）</h3>
            
            <div className="space-y-2">
              <Label>個人的な関心・今後のライフプラン</Label>
              <Textarea 
                placeholder="プライベートな関心事、健康管理、家族との時間、セカンドキャリア構想等（話したい範囲で）"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>その他（自由記述）</Label>
              <Textarea 
                placeholder="上記以外で相談したいこと、伝えたいこと、提案等があれば自由にお書きください"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <Textarea 
              placeholder="専門性の極め方、指導力、組織への影響力、今後の期待役割、レガシー構築支援、キャリアパス等"
              className="min-h-[120px]"
            />
            <div className="space-y-2">
              <Label className="text-sm font-medium">次回面談予定日</Label>
              <Input type="date" className="w-48" />
            </div>
          </div>

          {/* 提出ボタン */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline">
              一時保存
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              提出
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}