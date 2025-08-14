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

export default function ChiefOTUnified30MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-teal-50">
          <CardTitle className="text-2xl">主任作業療法士定期面談シート V5（30分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>就任年数：＿＿年　担当部署：リハビリテーション科</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              30分の標準面談です。<strong>動機タイプ判定</strong>を活用し、主任作業療法士のマネジメント能力と部門運営を評価支援します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. マネジメント・部門運営評価（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. マネジメント・部門運営評価（8分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">主亻OTマネジメント・リーダーシップ能力評価</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "OT部門の統括・運営管理",
                "スタッフの指導・育成・評価・モチベーション",
                "業務効率化・標準化の推進・管理",
                "多職種連携・調整・コーディネーション",
                "質管理・安全管理体制の構築・管理",
                "予算管理・リソース配分・コスト管理",
                "部門目標達成・成果創出・成果管理",
                "上級管理職との連携・意思決定参加",
                "新人・学生教育システムの管理・運営",
                "危機管理・問題解決・意思決定"
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
              <Label>主な管理業務の成果・実績と部門貢献</Label>
              <Textarea 
                placeholder="OT部門運営成果、スタッフ育成実績、業務改善効果、目標達成状況、質向上取り組み、コスト削減成果など詳しく記入"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>現在のマネジメント上の課題・改善取り組みと解決状況</Label>
              <Textarea 
                placeholder="スタッフマネジメント、業務効率化、質向上、連携強化、人材確保などの課題と具体的な解決策・対策"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. 動機タイプ別確認・リーダーシップ分析（8分） */}
          <div className="space-y-4 bg-teal-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 動機タイプ別確認・リーダーシップ分析（8分）</h3>
            
            {selectedMotivationType && typeSpecificQuestions.length > 0 && (
              <div className="bg-purple-50 p-3 rounded-lg space-y-2 mb-4">
                <Label className="text-base font-semibold text-purple-700">
                  動機タイプに基づく詳細質問（管理職レベル）
                </Label>
                <div className="space-y-3">
                  {typeSpecificQuestions.slice(0, 2).map((question, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-sm">{question}</Label>
                      <Textarea 
                        placeholder="主任作業療法士としてのマネジメント・指導の視点で詳しくお答えください"
                        className="min-h-[60px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">リーダーシップ・マネジメント満足度</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "管理業務へのやりがい・満足度",
                "部門運営の権限・裁量範囲",
                "上司からの支援・信頼・評価",
                "スタッフとの関係性・信頼関係",
                "組織ビジョンへの共感・貢献実感",
                "将来のキャリアビジョンへの期待"
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
              <Label>リーダーシップスタイル・組織への影響力</Label>
              <Textarea 
                placeholder="リーダーシップスタイル、部下や他部門への影響力、意思決定プロセス、コミュニケーション能力など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 3. 部門発展・組織貢献支援（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 部門発展・組織貢献支援（7分）</h3>
            
            <div className="space-y-2">
              <Label>今後のOT部門ビジョン・発展計画</Label>
              <Textarea 
                placeholder="OT部門の3-5年後の将来像、質向上目標、組織への貢献計画、新しい取り組み、イノベーション計画など詳細に記入"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">部門運営・発展に必要な組織支援（複数選択可）</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "管理職研修・マネジメント教育プログラム",
                  "予算・リソースの拡充・柔軟な配分",
                  "人員配置・新規採用の支援・権限",
                  "システム・設備の改善・更新支援",
                  "他部門との連携強化・調整支援",
                  "上級管理職からの権限委譲・裁量範囲拡大",
                  "外部研修・視察機会・ネットワーク構築",
                  "業績評価・報酬制度改善・インセンティブ",
                  "品質管理・安全管理システム導入",
                  "データ分析・意思決定支援システム",
                  "ワークライフバランス支援制度",
                  "次世代リーダー育成プログラム"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox id={`support-${item}`} />
                    <Label htmlFor={`support-${item}`} className="text-sm">{item}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. 目標設定・戦略計画（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 目標設定・戦略計画（7分）</h3>
            
            {selectedMotivationType && (
              <Alert className="bg-purple-50 border-purple-200">
                <AlertDescription>
                  <strong>動機タイプに基づく推奨マネジメント支援：</strong>
                  <div className="mt-1 text-sm">
                    {selectedMotivationType === 'growth' && '新マネジメント手法導入・管理職研修・部門イノベーション・新分野展開・戦略立案主導'}
                    {selectedMotivationType === 'recognition' && '部門成果可視化・上級管理職評価・外部表彰支援・業界リーダーとしての地位確立'}
                    {selectedMotivationType === 'stability' && '管理体制安定化・標準化推進・継続的改善・リスク管理強化・安定長期運営'}
                    {selectedMotivationType === 'teamwork' && 'チームビルディング強化・多部門連携促進・調整機能向上・組織文化造り'}
                    {selectedMotivationType === 'efficiency' && '効率化システム導入・業務改善推進・データ活用促進・KPI管理強化・ROI最大化'}
                    {selectedMotivationType === 'compensation' && '管理職手当充実・昇進機会明示・評価制度改善・成果連動報酬・ストックオプション'}
                    {selectedMotivationType === 'creativity' && '独自運営手法支援・革新的取り組み推進・自由度拡大・創造的環境整備・新事業開発'}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label>短期管理目標（3ヶ月）</Label>
              <Textarea 
                placeholder="部門運営改善、スタッフ育成、業務効率化、品質向上の具体的目標とKPI"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>中期部門ビジョン（6ヶ月-1年）</Label>
              <Textarea 
                placeholder="部門発展計画、組織貢献目標、戦略的取り組み、人材育成計画など"
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
                <Input type="text" id="follow-method" placeholder="月次管理者面談、四半期評価など" />
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
                <Label>マネジメント能力</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="mgmt-excellent" />
                    <Label htmlFor="mgmt-excellent" className="ml-1 text-sm">優秀</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="mgmt-good" />
                    <Label htmlFor="mgmt-good" className="ml-1 text-sm">良好</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="needs-support" id="mgmt-support" />
                    <Label htmlFor="mgmt-support" className="ml-1 text-sm">要支援</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>リーダーシップ</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="strong" id="leadership-strong" />
                    <Label htmlFor="leadership-strong" className="ml-1 text-sm">強い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="developing" id="leadership-developing" />
                    <Label htmlFor="leadership-developing" className="ml-1 text-sm">発展中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="limited" id="leadership-limited" />
                    <Label htmlFor="leadership-limited" className="ml-1 text-sm">限定的</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>組織影響力</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="impact-high" />
                    <Label htmlFor="impact-high" className="ml-1 text-sm">高い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="moderate" id="impact-moderate" />
                    <Label htmlFor="impact-moderate" className="ml-1 text-sm">中程度</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="limited" id="impact-limited" />
                    <Label htmlFor="impact-limited" className="ml-1 text-sm">限定的</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <Textarea 
              placeholder="総合評価、マネジメント能力評価、リーダーシップ評価、組織貢献度、動機タイプに基づく個別支援計画、部門運営支援方針など"
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