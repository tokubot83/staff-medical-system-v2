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
import { MotivationTypeSection, getMotivationTypeQuestions } from './components/MotivationType';

export default function ChiefNurseUnified45MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-amber-50">
          <CardTitle className="text-2xl">看護師長・管理職定期面談シート V5（45分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>管理職経験：＿＿年＿＿ヶ月　担当部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              45分の詳細面談です。<strong>動機タイプ判定</strong>を活用し、管理職の戦略的思考、組織運営、人材育成を包括的に支援します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 新規追加: 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. 管理業務・組織運営の詳細評価（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 管理業務・組織運営の詳細評価（10分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">管理能力・リーダーシップ</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "チーム運営力",
                "意思決定力",
                "戦略的思考",
                "変革推進力",
                "経営視点",
                "人材育成力",
                "危機管理能力",
                "組織調整力"
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
              <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded">
                <p><strong>評価基準：</strong></p>
                <p><span className="text-green-600 font-medium">5：</span>卓越した能力　<span className="text-blue-600 font-medium">4：</span>優秀　<span className="text-yellow-600 font-medium">3：</span>良好　<span className="text-orange-600 font-medium">2：</span>要向上　<span className="text-red-600 font-medium">1：</span>要支援</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>担当部署の運営状況・成果</Label>
              <Textarea 
                placeholder="スタッフ数、業務効率、患者満足度、安全管理、収益性などの具体的成果"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>この半年間の主要な管理成果・実績</Label>
              <Textarea 
                placeholder="組織改善、人材育成、業務改革、危機管理などの具体的成果"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>部下・スタッフの育成実績</Label>
              <Textarea 
                placeholder="昇進支援、能力開発、キャリア形成支援、リーダー育成など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. 職員の現状確認（モチベーション・健康・エンゲージメント）（12分） */}
          <div className="space-y-4 bg-green-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 職員の現状確認（モチベーション・健康・エンゲージメント）（12分）</h3>
            
            {/* 動機タイプ別の追加質問（全ての質問） */}
            {selectedMotivationType && typeSpecificQuestions.length > 0 && (
              <div className="bg-purple-50 p-4 rounded-lg space-y-3 mb-4">
                <Label className="text-base font-semibold text-purple-700">
                  動機タイプに基づく個別質問（管理職向け）
                </Label>
                {typeSpecificQuestions.map((question, index) => (
                  <div key={index} className="space-y-2">
                    <Label className="text-sm">{question}</Label>
                    <Textarea 
                      placeholder="管理職としての視点でお答えください"
                      className="min-h-[60px]"
                    />
                  </div>
                ))}
              </div>
            )}
            
            {/* モチベーションと満足度 */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">モチベーションと満足度</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "現在のモチベーション",
                "給与・待遇",
                "勤務シフト",
                "人間関係",
                "上司のサポート",
                "成長機会",
                "職場環境",
                "仕事のやりがい",
                "評価の公正性"
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
              <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded mt-3">
                <p><strong>評価基準：</strong></p>
                <p><span className="text-green-600 font-medium">5：</span>非常に満足　<span className="text-blue-600 font-medium">4：</span>満足　<span className="text-yellow-600 font-medium">3：</span>普通　<span className="text-orange-600 font-medium">2：</span>やや不満　<span className="text-red-600 font-medium">1：</span>不満</p>
              </div>
            </div>

            {/* 健康・ストレス・エンゲージメント */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">健康・ストレス・エンゲージメント</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "健康状態",
                "ストレスレベル",
                "睡眠の質",
                "3年後の継続意向",
                "職場推奨度"
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
              <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded mt-3">
                <p><strong>評価基準：</strong></p>
                <p><span className="font-medium">健康状態：</span><span className="text-green-600 font-medium">5：</span>非常に良好　<span className="text-blue-600 font-medium">4：</span>良好　<span className="text-yellow-600 font-medium">3：</span>普通　<span className="text-orange-600 font-medium">2：</span>やや不調　<span className="text-red-600 font-medium">1：</span>不調</p>
                <p><span className="font-medium">ストレス：</span><span className="text-green-600 font-medium">5：</span>非常に低い　<span className="text-blue-600 font-medium">4：</span>低い　<span className="text-yellow-600 font-medium">3：</span>普通　<span className="text-orange-600 font-medium">2：</span>高い　<span className="text-red-600 font-medium">1：</span>非常に高い</p>
                <p><span className="font-medium">睡眠の質：</span><span className="text-green-600 font-medium">5：</span>非常に良い　<span className="text-blue-600 font-medium">4：</span>良い　<span className="text-yellow-600 font-medium">3：</span>普通　<span className="text-orange-600 font-medium">2：</span>悪い　<span className="text-red-600 font-medium">1：</span>非常に悪い</p>
                <p><span className="font-medium">継続意向：</span><span className="text-green-600 font-medium">5：</span>ぜひ続けたい　<span className="text-blue-600 font-medium">4：</span>続けたい　<span className="text-yellow-600 font-medium">3：</span>わからない　<span className="text-orange-600 font-medium">2：</span>転職検討　<span className="text-red-600 font-medium">1：</span>転職活動中</p>
                <p><span className="font-medium">職場推奨度：</span><span className="text-green-600 font-medium">5：</span>積極的に勧める　<span className="text-blue-600 font-medium">4：</span>勧める　<span className="text-yellow-600 font-medium">3：</span>どちらでもない　<span className="text-orange-600 font-medium">2：</span>あまり勧めない　<span className="text-red-600 font-medium">1：</span>勧めない</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="text-base font-semibold">管理職特有のストレス要因</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-staff-management" />
                  <Label htmlFor="stress-staff-management" className="ml-2">スタッフ管理</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-budget" />
                  <Label htmlFor="stress-budget" className="ml-2">予算・経営責任</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-decision" />
                  <Label htmlFor="stress-decision" className="ml-2">意思決定の重圧</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-workload" />
                  <Label htmlFor="stress-workload" className="ml-2">業務負荷</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-conflict" />
                  <Label htmlFor="stress-conflict" className="ml-2">人事・対立処理</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-performance" />
                  <Label htmlFor="stress-performance" className="ml-2">成果責任</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-change" />
                  <Label htmlFor="stress-change" className="ml-2">変革推進</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-isolation" />
                  <Label htmlFor="stress-isolation" className="ml-2">孤独感</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-other" />
                  <Label htmlFor="stress-other" className="ml-2">その他</Label>
                </div>
              </div>
              <div className="mt-2">
                <Label className="text-sm">ストレス要因の詳細（自由記述）</Label>
                <Textarea 
                  placeholder="管理職特有のストレス要因について、具体的な状況を記入"
                  className="min-h-[60px] mt-1"
                />
              </div>
            </div>
          </div>

          {/* 3. 戦略・組織運営・人材育成（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 戦略・組織運営・人材育成（10分）</h3>
            
            <div className="space-y-2">
              <Label>部署・組織の長期戦略・ビジョン</Label>
              <Textarea 
                placeholder="3-5年後の部署目標、戦略的方向性、組織改革計画など"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>人材育成戦略・後継者育成</Label>
              <Textarea 
                placeholder="リーダー育成計画、スキル開発、次世代管理職の育成など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織課題・改善取り組み</Label>
              <Textarea 
                placeholder="現在の組織課題、改善施策、成果指標など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>希望する管理職研修・支援</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-leadership" />
                  <Label htmlFor="training-leadership" className="ml-2">リーダーシップ研修</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-strategy" />
                  <Label htmlFor="training-strategy" className="ml-2">戦略立案研修</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-finance" />
                  <Label htmlFor="training-finance" className="ml-2">財務・経営研修</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-hr" />
                  <Label htmlFor="training-hr" className="ml-2">人事管理研修</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-change" />
                  <Label htmlFor="training-change" className="ml-2">変革管理研修</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-coaching" />
                  <Label htmlFor="training-coaching" className="ml-2">コーチング研修</Label>
                </div>
              </div>
            </div>
          </div>

          {/* 4. 経営参画・組織貢献（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 経営参画・組織貢献（8分）</h3>
            
            <div className="space-y-2">
              <Label>経営課題への見解・提案</Label>
              <Textarea 
                placeholder="病院経営、看護部運営、医療政策などに対する見解と改善提案"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>他部署・多職種との連携・調整</Label>
              <Textarea 
                placeholder="医師、事務、他部署との連携状況、課題、改善策など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織変革・イノベーション推進</Label>
              <Textarea 
                placeholder="DX推進、業務改革、制度改革などの取り組み"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>院外活動・社会貢献・ネットワーク</Label>
              <Textarea 
                placeholder="学会活動、地域貢献、他施設との連携、外部委員など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 5. 今後のアクションプラン（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. 今後のアクションプラン（5分）</h3>
            
            {/* 動機タイプに基づく推奨アクション（管理職向け） */}
            {selectedMotivationType && (
              <Alert className="bg-purple-50 border-purple-200">
                <AlertDescription>
                  <strong>動機タイプに基づく管理職向け推奨アクション：</strong>
                  <div className="mt-2">
                    {selectedMotivationType === 'growth' && '上級管理職研修、MBA・経営学講座の受講、新規事業・プロジェクトの主導'}
                    {selectedMotivationType === 'recognition' && '経営陣での発表機会、成果の対外発表、管理職表彰制度での評価'}
                    {selectedMotivationType === 'stability' && '安定した管理体制の構築、段階的な組織改革、リスク管理体制の強化'}
                    {selectedMotivationType === 'teamwork' && '組織横断的なプロジェクト推進、他部署との連携強化、協働文化の醸成'}
                    {selectedMotivationType === 'efficiency' && '組織全体の効率化推進、DX・システム導入のリーダー、業務プロセス改革'}
                    {selectedMotivationType === 'compensation' && '管理職昇進の機会提供、成果連動型報酬の検討、特別手当の支給'}
                    {selectedMotivationType === 'creativity' && '独自の管理手法の実現支援、新しい組織運営モデルの試行、革新的取り組みの推進'}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label>次回面談までの重点目標（2-3個）</Label>
              <Textarea 
                placeholder="組織運営、人材育成、戦略実行、経営貢献など具体的に"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>必要なサポート・リソース</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-authority" />
                  <Label htmlFor="support-authority" className="ml-2">権限・決裁権拡大</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-budget" />
                  <Label htmlFor="support-budget" className="ml-2">予算・資源配分</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-staff" />
                  <Label htmlFor="support-staff" className="ml-2">人員配置調整</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-executive" />
                  <Label htmlFor="support-executive" className="ml-2">経営陣との連携</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-external" />
                  <Label htmlFor="support-external" className="ml-2">外部研修・視察</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-consultation" />
                  <Label htmlFor="support-consultation" className="ml-2">専門コンサル支援</Label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="next-interview">次回面談予定</Label>
                <Input type="date" id="next-interview" />
              </div>
              <div>
                <Label htmlFor="follow-up">フォローアップ方法</Label>
                <Input type="text" id="follow-up" placeholder="月次経営会議、進捗報告など" />
              </div>
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            
            {/* 動機タイプの記録 */}
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
                <Label>管理能力評価</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="outstanding" id="mgmt-o" />
                    <Label htmlFor="mgmt-o" className="ml-1 text-sm">卓越した管理力</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="mgmt-e" />
                    <Label htmlFor="mgmt-e" className="ml-1 text-sm">優秀な管理力</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="mgmt-g" />
                    <Label htmlFor="mgmt-g" className="ml-1 text-sm">良好な管理力</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="developing" id="mgmt-d" />
                    <Label htmlFor="mgmt-d" className="ml-1 text-sm">発展途上</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>経営貢献度</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="strategic" id="contrib-s" />
                    <Label htmlFor="contrib-s" className="ml-1 text-sm">戦略的貢献</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="operational" id="contrib-o" />
                    <Label htmlFor="contrib-o" className="ml-1 text-sm">運営的貢献</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="functional" id="contrib-f" />
                    <Label htmlFor="contrib-f" className="ml-1 text-sm">機能的貢献</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="limited" id="contrib-l" />
                    <Label htmlFor="contrib-l" className="ml-1 text-sm">限定的</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>後継者ポテンシャル</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="high-potential" id="successor-h" />
                    <Label htmlFor="successor-h" className="ml-1 text-sm">高い可能性</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium-potential" id="successor-m" />
                    <Label htmlFor="successor-m" className="ml-1 text-sm">中程度の可能性</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="development-needed" id="successor-d" />
                    <Label htmlFor="successor-d" className="ml-1 text-sm">開発要</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="specialized-role" id="successor-s" />
                    <Label htmlFor="successor-s" className="ml-1 text-sm">専門職志向</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>推奨する活用・育成方針</Label>
              <RadioGroup>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="executive-track" id="develop-exec" />
                    <Label htmlFor="develop-exec" className="ml-2">上級管理職トラック</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="specialist-manager" id="develop-spec" />
                    <Label htmlFor="develop-spec" className="ml-2">専門管理職トラック</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="operational-focus" id="develop-oper" />
                    <Label htmlFor="develop-oper" className="ml-2">運営重点強化</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="strategic-development" id="develop-strat" />
                    <Label htmlFor="develop-strat" className="ml-2">戦略思考育成</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            <Textarea 
              placeholder="総合所見、管理能力・強み、動機タイプを考慮した具体的な活用・育成計画、組織での役割期待、特記事項など詳細に記入"
              className="min-h-[120px]"
            />
          </div>

          {/* 保存ボタン */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button variant="outline">一時保存</Button>
            <Button>面談記録を保存</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}