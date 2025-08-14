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

export default function ChiefSTUnified30MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-indigo-50">
          <CardTitle className="text-2xl">主任言語聴覚士定期面談シート V5（30分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年　配属部署：リハビリテーション科</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              30分の標準面談です。<strong>動機タイプ判定</strong>を活用し、主任言語聴覚士のマネジメント力とリーダーシップを詳細評価します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. 主任STマネジメント・リーダーシップ評価（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 主任STマネジメント・リーダーシップ評価（8分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">主任STとしてのマネジメント能力評価</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "ST部門の運営・管理・統括",
                "部下・スタッフの指導・育成・評価",
                "業務計画・目標設定・進捗管理",
                "多職種・他部門との調整・連携",
                "品質管理・安全管理・リスク管理",
                "業務効率化・プロセス改善",
                "予算管理・コスト意識・経営参画",
                "組織変革・イノベーション創出",
                "危機管理・問題解決・意思決定",
                "情報共有・コミュニケーション促進"
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
              <Label>現在の主要マネジメント業務と成果</Label>
              <Textarea 
                placeholder="ST部門の管理・運営、スタッフ指導・育成実績、部門目標達成状況、他部門連携成果、業務改善実績等"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>主任としてのリーダーシップ発揮状況</Label>
              <Textarea 
                placeholder="チーム統率力、変革推進力、危機管理対応、部下のモチベーション向上、組織文化形成等の具体例"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. 動機タイプ別詳細確認・マネジメント課題（8分） */}
          <div className="space-y-4 bg-indigo-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 動機タイプ別詳細確認・マネジメント課題（8分）</h3>
            
            {/* 動機タイプ別の質問 */}
            {selectedMotivationType && typeSpecificQuestions.length > 0 && (
              <div className="bg-purple-50 p-3 rounded-lg space-y-2 mb-4">
                <Label className="text-base font-semibold text-purple-700">
                  動機タイプに基づく主任ST向け質問
                </Label>
                <div className="space-y-3">
                  {typeSpecificQuestions.slice(0, 2).map((question, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-sm">{question}</Label>
                      <Textarea 
                        placeholder="主任言語聴覚士としてのマネジメント経験を踏まえてお答えください"
                        className="min-h-[60px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <Label className="text-base font-semibold">現在のマネジメント課題・改善したい点</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "部下・スタッフの指導・育成方法",
                  "業務効率化・プロセス改善",
                  "多職種・他部門との調整・連携",
                  "予算管理・コスト削減",
                  "品質管理・安全管理体制",
                  "人事評価・目標管理",
                  "会議・情報共有の改善",
                  "組織変革・イノベーション推進",
                  "危機管理・リスク対応",
                  "自身のマネジメントスキル向上",
                  "ワークライフバランス・健康管理",
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
              <Label>部下・スタッフとの関係・コミュニケーション状況</Label>
              <Textarea 
                placeholder="部下との信頼関係、コミュニケーション頻度・質、相談・サポート体制、モチベーション管理等"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 3. ST部門戦略・組織発展計画（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. ST部門戦略・組織発展計画（8分）</h3>
            
            <div className="space-y-2">
              <Label>短期戦略（6ヶ月以内）</Label>
              <Input 
                placeholder="例：ST部門の品質向上、業務効率化、スタッフ育成体制強化、新サービス導入"
              />
            </div>

            <div className="space-y-2">
              <Label>中期戦略（1年以内）</Label>
              <Input 
                placeholder="例：部門組織再編、専門性強化、他部門連携拡大、収益性向上"
              />
            </div>

            <div className="space-y-2">
              <Label>長期ビジョン（3年以内）</Label>
              <Input 
                placeholder="例：地域No.1ST部門、新事業展開、後継者育成完了、組織文化確立"
              />
            </div>

            <div className="space-y-2">
              <Label>ST部門の競争力・付加価値向上策</Label>
              <Textarea 
                placeholder="他施設との差別化戦略、専門性強化、サービス品質向上、患者・家族満足度向上等の具体策"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>部門発展に必要なリソース・サポート</Label>
              <Textarea 
                placeholder="人材増員・配置、設備・システム投資、予算増額、組織からの権限委譲、外部連携支援等"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>上層部・組織への提言・要望</Label>
              <Textarea 
                placeholder="組織運営方針、人事制度、評価制度、意思決定プロセス、経営戦略等への提言・改善要望"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. 自己成長・キャリア発展（6分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 自己成長・キャリア発展（6分）</h3>
            
            <div className="space-y-2">
              <Label>マネジメントスキル向上目標</Label>
              <Textarea 
                placeholder="リーダーシップ、コミュニケーション、意思決定、戦略立案、人材育成等のスキル向上計画"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>今後のキャリア目標・昇進意向</Label>
              <Textarea 
                placeholder="部長・管理職昇進希望、専門職としての発展、転職・転身検討、セカンドキャリア構想等"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>必要な研修・学習・サポート</Label>
              <Textarea 
                placeholder="管理職研修、MBA・ビジネス教育、コーチング・メンタリング、外部ネットワーキング機会等"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>その他（自由記述）</Label>
              <Textarea 
                placeholder="上記以外で相談したいこと、提案、要望、悩み等があれば自由にお書きください"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <Textarea 
              placeholder="マネジメント能力、リーダーシップ、部門運営状況、成長ポテンシャル、今後の期待役割、サポート計画等"
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