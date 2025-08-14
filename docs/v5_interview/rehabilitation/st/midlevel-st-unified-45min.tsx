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

export default function MidlevelSTUnified45MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-indigo-50">
          <CardTitle className="text-2xl">中堅言語聴覚士（4-10年目）定期面談シート V5（45分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年　配属部署：リハビリテーション科</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              45分の詳細面談です。<strong>動機タイプ判定</strong>を活用し、中堅言語聴覚士の包括的なリーダーシップ評価とキャリア開発計画を策定します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. ST専門性・リーダーシップの詳細評価（15分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. ST専門性・リーダーシップの詳細評価（15分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">中堅STとしての高度な専門能力評価</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "失語症高度評価・訓練技術",
                "構音障害専門技術・指導力",
                "嚥下機能評価・VF/VE読影技術",
                "高次脳機能評価・リハビリ技術",
                "小児言語発達評価・指導技術",
                "聴覚検査・補聴器適合技術",
                "コミュニケーション支援・AAC選定",
                "複雑症例への総合的アプローチ",
                "後輩指導・教育プログラム作成",
                "チームリーダーシップ・調整力",
                "研究・学会活動・学術発表",
                "多職種連携・コンサルテーション",
                "業務改善・効率化・管理能力",
                "新技術・知識習得・情報収集力"
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
              <Label>現在の主要業務と高度な成果</Label>
              <Textarea 
                placeholder="担当症例の複雑度、専門性発揮、チームリーダーとしての貢献、指導実績、研究活動、学会発表等詳細に記入"
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label>中堅STとしてのユニークな強み・専門性</Label>
              <Textarea 
                placeholder="他の中堅STとは異なる独自の強み、専門領域での特別な技術や知識、組織への独特な貢献等"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>リーダーシップ発揮の具体例</Label>
              <Textarea 
                placeholder="チーム革新プロジェクト、新人教育システム構築、関係部署との連携強化、トラブル解決事例等"
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* 2. 動機タイプ別詳細分析・キャリアビジョン（12分） */}
          <div className="space-y-4 bg-indigo-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 動機タイプ別詳細分析・キャリアビジョン（12分）</h3>
            
            {selectedMotivationType && typeSpecificQuestions.length > 0 && (
              <div className="bg-purple-50 p-3 rounded-lg space-y-2 mb-4">
                <Label className="text-base font-semibold text-purple-700">
                  動機タイプに基づく詳細質問（中堅ST詳細版）
                </Label>
                <div className="space-y-3">
                  {typeSpecificQuestions.slice(0, 3).map((question, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-sm font-medium">{`質問${index + 1}：${question}`}</Label>
                      <Textarea 
                        placeholder="中堅言語聴覚士としての豊富な経験と深い専門性を踏まえて詳しくお答えください"
                        className="min-h-[80px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label>中長期キャリアビジョン（5年後・10年後）</Label>
              <Textarea 
                placeholder="管理職、専門分野リーダー、研究者、教育者、コンサルタント、起業等の方向性、目指すポジション"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>理想的なワークスタイル・価値観</Label>
              <Textarea 
                placeholder="重視する価値観、理想的な働き方、ワークライフバランス、組織での役割期待等"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">現在の課題・成長したい領域（詳細）</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "管理・マネジメントスキル",
                  "新しい専門技術・知識習得",
                  "研究スキル・統計解析能力",
                  "プレゼンテーション・発表能力",
                  "コーチング・指導技術",
                  "他部門・他施設とのネットワーキング",
                  "ビジネススキル・コスト意識",
                  "イノベーション・新しい取り組み",
                  "メンタリング・キャリア支援",
                  "品質管理・サービス向上",
                  "国際的な視野・グローバルスキル",
                  "その他"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox id={item} />
                    <Label htmlFor={item} className="text-sm">{item}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. 組織貢献・リーダーシップ開発計画（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 組織貢献・リーダーシップ開発計画（10分）</h3>
            
            <div className="space-y-2">
              <Label>短期目標（3ヶ月以内）</Label>
              <Input 
                placeholder="例：新しいプロジェクトリーダー、院内研修講師、専門資格取得"
              />
            </div>

            <div className="space-y-2">
              <Label>中期目標（6ヶ月以内）</Label>
              <Input 
                placeholder="例：チームマネジメント役割、学会発表・研究成果公表、管理職候補"
              />
            </div>

            <div className="space-y-2">
              <Label>長期目標（1年以内）</Label>
              <Input 
                placeholder="例：部長・管理職昇格、地域リーダーとしての活動、新しいSTプログラム開発"
              />
            </div>

            <div className="space-y-2">
              <Label>組織への具体的貢献プラン</Label>
              <Textarea 
                placeholder="ST部門の品質向上、効率化提案、新しいサービス開発、他部門連携強化等の具体的計画"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>必要なサポート・権限・リソース</Label>
              <Textarea 
                placeholder="組織からの権限委譲、予算配分、人員サポート、研修機会、設備投資等"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">希望するリーダーシップ開発機会</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "管理職研修プログラム",
                  "MBA・ビジネススクール",
                  "コーチング・メンタリング研修",
                  "プロジェクトマネジメント研修",
                  "国内外学会・研修参加",
                  "他施設・他業界との交流",
                  "研究プロジェクトリーダー",
                  "委員会・ワーキンググループ参加",
                  "メンター・コーチ担当",
                  "新人教育プログラム開発",
                  "品質改善・プロセス改善プロジェクト",
                  "その他"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox id={item} />
                    <Label htmlFor={item} className="text-sm">{item}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. 組織改善提案・イノベーション（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 組織改善提案・イノベーション（5分）</h3>
            
            <div className="space-y-2">
              <Label>ST部門・組織の改善提案</Label>
              <Textarea 
                placeholder="中堅STの立場から見たST部門の課題、効率化提案、品質向上方法、新しいサービスアイデア等"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>イノベーション・新しい取り組みの提案</Label>
              <Textarea 
                placeholder="AI・ICT活用、新しい評価・訓練方法、地域連携モデル、研究プロジェクト等の新しいアイデア"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>その他（自由記述）</Label>
              <Textarea 
                placeholder="上記以外で相談したいこと、提案、要望、悩み等があれば自由にお書きください"
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <Textarea 
              placeholder="専門性の発揮度、リーダーシップ能力、成長ポテンシャル、今後の期待役割、キャリアパス、組織貢献計画等詳細に記入"
              className="min-h-[140px]"
            />
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">次回面談予定日</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">緊急度</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="urgent-low" />
                      <Label htmlFor="urgent-low" className="text-sm">低</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="urgent-medium" />
                      <Label htmlFor="urgent-medium" className="text-sm">中</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="urgent-high" />
                      <Label htmlFor="urgent-high" className="text-sm">高</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">キャリア開発優先度</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="career-standard" />
                      <Label htmlFor="career-standard" className="text-sm">標準</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="career-high" />
                      <Label htmlFor="career-high" className="text-sm">高</Label>
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