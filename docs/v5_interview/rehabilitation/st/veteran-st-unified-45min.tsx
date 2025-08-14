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

export default function VeteranSTUnified45MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-indigo-50">
          <CardTitle className="text-2xl">ベテラン言語聴覚士（11年目以上）定期面談シート V5（45分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年　配属部署：リハビリテーション科</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              45分の詳細面談です。<strong>動機タイプ判定</strong>を活用し、ベテラン言語聴覚士の包括的な専門性評価とレガシー構築戦略を策定します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. ベテランST最高レベル専門性・影響力評価（15分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. ベテランST最高レベル専門性・影響力評価（15分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">ベテランST最高水準専門能力・組織影響力</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "専門分野での最先端技術・知識・洞察力",
                "困難症例・希少疾患への卓越した対応力",
                "組織全体の専門技術水準向上への貢献",
                "次世代ST育成・メンタリング・キャリア支援",
                "ST部門・組織マネジメント・戦略立案",
                "多職種・他部門・外部機関との統合調整力",
                "研究活動・エビデンス構築・学術貢献",
                "業務改革・イノベーション創出・変革リーダーシップ",
                "組織文化・価値観・専門職倫理の体現・継承",
                "危機管理・問題解決・組織安定化への貢献",
                "地域医療・社会貢献・専門職界への影響力",
                "教育機関・学会・専門団体での指導的役割"
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
              <Label>現在の最重要業務と組織・社会への影響</Label>
              <Textarea 
                placeholder="最高難度症例への対応実績、組織変革リーダーシップ、業界・地域医療への貢献、研究・教育活動成果、後進育成実績等詳細に記入"
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label>ベテランSTとしての唯一無二の専門性・価値</Label>
              <Textarea 
                placeholder="他では代替不可能な専門技術・経験・洞察力、組織にとって不可欠な存在価値、長年培った独自のノウハウ・判断力等"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織・部門・業界への具体的影響・変革事例</Label>
              <Textarea 
                placeholder="組織改革プロジェクト、新システム・制度導入、業務標準化、人材育成体制構築、外部機関連携強化等の具体的成果"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>専門職としての社会的責任・使命感</Label>
              <Textarea 
                placeholder="ST職種の社会的地位向上、専門職倫理の継承、後進への責任、地域医療・患者・家族への貢献に対する使命感"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. 動機タイプ別深層分析・人生戦略ビジョン（12分） */}
          <div className="space-y-4 bg-indigo-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 動機タイプ別深層分析・人生戦略ビジョン（12分）</h3>
            
            {selectedMotivationType && typeSpecificQuestions.length > 0 && (
              <div className="bg-purple-50 p-3 rounded-lg space-y-2 mb-4">
                <Label className="text-base font-semibold text-purple-700">
                  動機タイプに基づく深層質問（ベテランST最上位版）
                </Label>
                <div className="space-y-3">
                  {typeSpecificQuestions.slice(0, 3).map((question, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-sm font-medium">{`質問${index + 1}：${question}`}</Label>
                      <Textarea 
                        placeholder="ベテラン言語聴覚士として長年培った深い洞察と哲学を込めて詳しくお答えください"
                        className="min-h-[80px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label>人生後半・セカンドキャリア戦略</Label>
              <Textarea 
                placeholder="今後10-20年の人生設計、セカンドキャリア構想、退職後の活動計画、知識・経験の社会還元方法等"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>価値観・人生哲学・仕事観の変遷</Label>
              <Textarea 
                placeholder="長年の経験で培った価値観、仕事に対する哲学、人生で最も大切にしていること、若手への伝えたいメッセージ等"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">現在の関心・今後の挑戦領域（複数選択可）</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "最先端専門技術・知識の探求と応用",
                  "次世代リーダー育成・メンタリング",
                  "組織経営・戦略立案への参画",
                  "研究活動・エビデンス構築・論文執筆",
                  "地域医療・社会貢献・ボランティア活動",
                  "専門職団体・学会での指導的役割",
                  "教育機関での教育・研究・講師活動",
                  "国際交流・海外研修・グローバル活動",
                  "起業・独立・コンサルタント活動",
                  "著書・教材作成・知識の体系化",
                  "ワークライフバランス・健康長寿",
                  "家族・プライベート重視",
                  "セカンドキャリア・転身準備",
                  "社会活動・NPO・地域貢献",
                  "趣味・芸術・文化活動",
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
              <Label>理想的なライフワークバランス・働き方</Label>
              <Textarea 
                placeholder="今後の理想的な働き方、プライベートとの両立、健康管理、家族との時間、趣味・関心事とのバランス等"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 3. レガシー構築・組織継承戦略（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. レガシー構築・組織継承戦略（10分）</h3>
            
            <div className="space-y-2">
              <Label>短期戦略（1年以内）</Label>
              <Input 
                placeholder="例：知識・技術の体系化、後継者育成プログラム、組織改革完成、研究成果公表"
              />
            </div>

            <div className="space-y-2">
              <Label>中期戦略（3年以内）</Label>
              <Input 
                placeholder="例：次世代リーダー完全育成、組織文化継承システム確立、地域ネットワーク完成"
              />
            </div>

            <div className="space-y-2">
              <Label>長期ビジョン（5-10年）</Label>
              <Input 
                placeholder="例：ST業界への永続的貢献、教育システム構築、セカンドキャリアでの社会貢献"
              />
            </div>

            <div className="space-y-2">
              <Label>組織・業界に残したい最重要レガシー</Label>
              <Textarea 
                placeholder="長年の経験・知識の集大成、後進育成システム、組織文化・価値観、専門技術体系、研究・教育成果等の継承計画"
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label>後継者・次世代への期待とメッセージ</Label>
              <Textarea 
                placeholder="後継者に求める資質・能力、次世代STへの期待、専門職として伝えたい価値観・使命感、業界発展への思い等"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>レガシー実現に必要なサポート・環境整備</Label>
              <Textarea 
                placeholder="組織からの権限・リソース・時間、後継者育成支援、知識継承システム、外部連携・ネットワーク活用等"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 4. 組織・業界への提言・イノベーション（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 組織・業界への提言・イノベーション（5分）</h3>
            
            <div className="space-y-2">
              <Label>ST部門・組織運営への戦略的提言</Label>
              <Textarea 
                placeholder="ベテランの視点から見た組織課題、長期戦略提案、人材育成方針、制度・システム改革案等"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>ST業界・地域医療への革新的提案</Label>
              <Textarea 
                placeholder="業界の将来ビジョン、新しいサービス・技術・連携モデル、社会的地位向上策、制度・政策への提言等"
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* 5. 個人的関心・ライフプラン（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. 個人的関心・ライフプラン（3分）</h3>
            
            <div className="space-y-2">
              <Label>個人的な関心・今後のライフプラン</Label>
              <Textarea 
                placeholder="プライベートな関心事、健康管理・健康長寿、家族との時間、趣味・文化活動、セカンドキャリア等"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>その他（自由記述）</Label>
              <Textarea 
                placeholder="上記以外で相談したいこと、伝えたいこと、人生の節目での思い等があれば自由にお書きください"
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <Textarea 
              placeholder="専門性の到達度、組織への影響力、レガシー構築への取り組み、今後の期待役割、サポート計画、特別配慮事項等詳細に記入"
              className="min-h-[150px]"
            />
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">次回面談予定日</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">優先サポート領域</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="legacy" id="support-legacy" />
                      <Label htmlFor="support-legacy" className="text-sm">レガシー構築</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="succession" id="support-succession" />
                      <Label htmlFor="support-succession" className="text-sm">後継者育成</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="innovation" id="support-innovation" />
                      <Label htmlFor="support-innovation" className="text-sm">イノベーション</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">組織貢献度</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="exceptional" id="contrib-exceptional" />
                      <Label htmlFor="contrib-exceptional" className="text-sm">卓越</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="contrib-high" />
                      <Label htmlFor="contrib-high" className="text-sm">高</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="contrib-standard" />
                      <Label htmlFor="contrib-standard" className="text-sm">標準</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
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