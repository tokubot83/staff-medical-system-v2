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

export default function VeteranNurseUnified45MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-amber-50">
          <CardTitle className="text-2xl">ベテラン看護師（11年目以上）定期面談シート V5（45分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              45分の詳細面談です。<strong>動機タイプ判定</strong>を活用し、ベテラン看護師の専門性発揮、知識継承、組織貢献を包括的に支援します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 新規追加: 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. 専門性・エキスパート実践の詳細評価（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 専門性・エキスパート実践の詳細評価（10分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">現在の専門性・影響力</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "専門知識活用",
                "臨床判断力",
                "問題解決力",
                "組織への影響力",
                "イノベーション創出",
                "品質改善推進",
                "知識継承・教育",
                "院内外での活動"
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
                <p><span className="text-green-600 font-medium">5：</span>卓越　<span className="text-blue-600 font-medium">4：</span>優秀　<span className="text-yellow-600 font-medium">3：</span>良好　<span className="text-orange-600 font-medium">2：</span>標準　<span className="text-red-600 font-medium">1：</span>要向上</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>現在の専門領域・エキスパート分野の詳細</Label>
              <Textarea 
                placeholder="認定・専門看護師分野、得意領域、院内外での専門的活動、学会活動などを詳しく"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>この半年間の主要な成果・実績</Label>
              <Textarea 
                placeholder="患者ケアの向上、業務改善、研究活動、院外発表、表彰などの具体的成果"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>知識継承・後進育成の実績</Label>
              <Textarea 
                placeholder="後進指導、教育プログラム開発、メンタリング、知識の体系化など"
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
                  動機タイプに基づく個別質問（ベテラン看護師向け）
                </Label>
                {typeSpecificQuestions.map((question, index) => (
                  <div key={index} className="space-y-2">
                    <Label className="text-sm">{question}</Label>
                    <Textarea 
                      placeholder="豊富な経験を踏まえてお答えください"
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
              <Label className="text-base font-semibold">ストレス要因の詳細</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-workload" />
                  <Label htmlFor="stress-workload" className="ml-2">業務負荷</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-relations" />
                  <Label htmlFor="stress-relations" className="ml-2">人間関係</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-overtime" />
                  <Label htmlFor="stress-overtime" className="ml-2">残業時間</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-balance" />
                  <Label htmlFor="stress-balance" className="ml-2">家庭との両立</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-skill" />
                  <Label htmlFor="stress-skill" className="ml-2">スキル不足</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-career" />
                  <Label htmlFor="stress-career" className="ml-2">キャリア不安</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-shift" />
                  <Label htmlFor="stress-shift" className="ml-2">シフト勤務</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-responsibility" />
                  <Label htmlFor="stress-responsibility" className="ml-2">責任の重さ</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-other" />
                  <Label htmlFor="stress-other" className="ml-2">その他</Label>
                </div>
              </div>
              <div className="mt-2">
                <Label className="text-sm">ストレス要因の詳細（自由記述）</Label>
                <Textarea 
                  placeholder="上記で選択したストレス要因について、具体的な状況を記入"
                  className="min-h-[60px] mt-1"
                />
              </div>
            </div>
          </div>

          {/* 3. 長期キャリア・継続支援（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 長期キャリア・継続支援（10分）</h3>
            
            <div className="space-y-2">
              <Label>今後の長期キャリアビジョン（退職まで・セカンドキャリア）</Label>
              <Textarea 
                placeholder="組織内での役割拡大、専門性の深化、教育・研究活動、退職後の展望など"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>専門性をさらに深めたい領域・新たな挑戦</Label>
              <Textarea 
                placeholder="専門・認定看護師の更新、新分野への挑戦、研究活動、院外活動など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織・後進への知識継承計画</Label>
              <Textarea 
                placeholder="マニュアル作成、教育プログラム開発、メンタリング体制構築など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>希望する研修・支援制度</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-advanced" />
                  <Label htmlFor="training-advanced" className="ml-2">上級専門研修</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-management" />
                  <Label htmlFor="training-management" className="ml-2">管理職研修</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-research" />
                  <Label htmlFor="training-research" className="ml-2">研究活動支援</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-education" />
                  <Label htmlFor="training-education" className="ml-2">教育研修</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-external" />
                  <Label htmlFor="training-external" className="ml-2">院外活動支援</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-second-career" />
                  <Label htmlFor="training-second-career" className="ml-2">セカンドキャリア支援</Label>
                </div>
              </div>
            </div>
          </div>

          {/* 4. 組織変革・イノベーション（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 組織変革・イノベーション（8分）</h3>
            
            <div className="space-y-2">
              <Label>組織変革への提案・取り組み</Label>
              <Textarea 
                placeholder="業務プロセス改善、システム化提案、文化変革、品質向上活動など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>イノベーション・新しい取り組みの実践</Label>
              <Textarea 
                placeholder="新技術導入、看護手法の開発、教育手法の革新など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>院内外での専門的活動・社会貢献</Label>
              <Textarea 
                placeholder="学会活動、委員会参加、地域貢献、講演活動など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織・看護界への提言・改善提案</Label>
              <Textarea 
                placeholder="制度改善、教育体制、働き方改革、看護の質向上など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 5. 今後のアクションプラン（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. 今後のアクションプラン（5分）</h3>
            
            {/* 動機タイプに基づく推奨アクション（ベテラン看護師向け） */}
            {selectedMotivationType && (
              <Alert className="bg-purple-50 border-purple-200">
                <AlertDescription>
                  <strong>動機タイプに基づくベテラン看護師向け推奨アクション：</strong>
                  <div className="mt-2">
                    {selectedMotivationType === 'growth' && '新しい専門分野への挑戦機会、上級資格取得支援、院外研修への派遣'}
                    {selectedMotivationType === 'recognition' && '専門性の組織内外での発表機会、指導実績の表彰、エキスパートとしての地位確立'}
                    {selectedMotivationType === 'stability' && '安定したエキスパート役割の明確化、継続的な専門性発揮の場の確保'}
                    {selectedMotivationType === 'teamwork' && '組織横断的な調整役、後進育成の責任者、チーム間のナレッジ共有推進'}
                    {selectedMotivationType === 'efficiency' && '組織全体の効率化プロジェクト推進、システム改善の主導、ベストプラクティスの体系化'}
                    {selectedMotivationType === 'compensation' && '専門性に応じた処遇改善、上位職への昇進機会、特別手当の検討'}
                    {selectedMotivationType === 'creativity' && '独自の専門手法の開発支援、革新的な取り組みの実現、新しいアプローチの組織への導入'}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label>次回面談までの重点目標（2-3個）</Label>
              <Textarea 
                placeholder="専門性発揮、組織貢献、知識継承、イノベーション創出など具体的に"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>必要なサポート・リソース</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-authority" />
                  <Label htmlFor="support-authority" className="ml-2">権限・裁量権拡大</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-budget" />
                  <Label htmlFor="support-budget" className="ml-2">研究・活動予算</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-time" />
                  <Label htmlFor="support-time" className="ml-2">専門活動時間確保</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-collaboration" />
                  <Label htmlFor="support-collaboration" className="ml-2">院外連携支援</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-succession" />
                  <Label htmlFor="support-succession" className="ml-2">後継者育成支援</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-recognition" />
                  <Label htmlFor="support-recognition" className="ml-2">成果評価制度</Label>
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
                <Input type="text" id="follow-up" placeholder="月次1on1、専門活動進捗確認など" />
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
                <Label>総合評価</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="outstanding" id="eval-o" />
                    <Label htmlFor="eval-o" className="ml-1 text-sm">卓越した貢献</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="eval-e" />
                    <Label htmlFor="eval-e" className="ml-1 text-sm">優秀な成果</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="eval-g" />
                    <Label htmlFor="eval-g" className="ml-1 text-sm">良好な実績</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="standard" id="eval-s" />
                    <Label htmlFor="eval-s" className="ml-1 text-sm">標準的</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>組織貢献度</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="exceptional" id="contrib-e" />
                    <Label htmlFor="contrib-e" className="ml-1 text-sm">極めて高い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="contrib-h" />
                    <Label htmlFor="contrib-h" className="ml-1 text-sm">高い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="contrib-m" />
                    <Label htmlFor="contrib-m" className="ml-1 text-sm">中程度</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="contrib-l" />
                    <Label htmlFor="contrib-l" className="ml-1 text-sm">低い</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>継続意向</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="strong" id="retention-s" />
                    <Label htmlFor="retention-s" className="ml-1 text-sm">強い継続意向</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="moderate" id="retention-m" />
                    <Label htmlFor="retention-m" className="ml-1 text-sm">継続意向あり</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="uncertain" id="retention-u" />
                    <Label htmlFor="retention-u" className="ml-1 text-sm">不明</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="risk" id="retention-r" />
                    <Label htmlFor="retention-r" className="ml-1 text-sm">離職リスク</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>推奨する活用方針</Label>
              <RadioGroup>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="expert-role" id="role-expert" />
                    <Label htmlFor="role-expert" className="ml-2">エキスパート役割強化</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="management-role" id="role-management" />
                    <Label htmlFor="role-management" className="ml-2">管理職登用</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="educator-role" id="role-educator" />
                    <Label htmlFor="role-educator" className="ml-2">教育者役割拡大</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="innovator-role" id="role-innovator" />
                    <Label htmlFor="role-innovator" className="ml-2">イノベーター支援</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            <Textarea 
              placeholder="総合所見、強み・専門性、動機タイプを考慮した具体的な活用・支援計画、特記事項など詳細に記入"
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