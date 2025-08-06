'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function VeteranAssistantNurseUnified45MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-purple-50">
          <CardTitle className="text-2xl">ベテラン准看護師（10年以上）定期面談シート（45分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              45分の詳細面談です。ベテラン准看護師の豊富な経験を組織の財産として活用し、充実したキャリア後期を支援することを目的とします。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. 専門性と組織貢献の詳細評価（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 専門性と組織貢献の詳細評価（10分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">専門的能力と貢献度（詳細評価）</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "高度な看護技術の実践",
                "複雑な状況での判断力",
                "後輩への技術指導",
                "メンタリング能力",
                "チーム調整・仲介役",
                "業務改善の提案・実行",
                "緊急時のリーダーシップ",
                "看護師との協働・補完",
                "多職種との調整能力",
                "患者・家族への説明力",
                "新人教育への貢献",
                "組織文化の継承"
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
                <p><span className="text-green-600 font-medium">5：</span>模範的・卓越　<span className="text-blue-600 font-medium">4：</span>優秀　<span className="text-yellow-600 font-medium">3：</span>期待通り　<span className="text-orange-600 font-medium">2：</span>要改善　<span className="text-red-600 font-medium">1：</span>課題あり</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>現在の役割と責任（具体的に）</Label>
              <Textarea 
                placeholder="プリセプター、委員会メンバー、マニュアル作成担当、勉強会講師など"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>最近の主な成果・貢献</Label>
              <Textarea 
                placeholder="業務改善の成果、後輩育成の実績、患者満足度向上への貢献など"
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* 2. 経験と知識の活用・継承（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. 経験と知識の活用・継承（10分）</h3>
            
            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">専門分野・得意領域</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">看護技術</p>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="skill-basic" />
                      <Label htmlFor="skill-basic" className="text-sm">基礎看護技術</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="skill-emergency" />
                      <Label htmlFor="skill-emergency" className="text-sm">救急対応</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="skill-dementia" />
                      <Label htmlFor="skill-dementia" className="text-sm">認知症ケア</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="skill-terminal" />
                      <Label htmlFor="skill-terminal" className="text-sm">終末期ケア</Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">その他の強み</p>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="strength-communication" />
                      <Label htmlFor="strength-communication" className="text-sm">患者・家族対応</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="strength-education" />
                      <Label htmlFor="strength-education" className="text-sm">教育・指導</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="strength-coordination" />
                      <Label htmlFor="strength-coordination" className="text-sm">チーム調整</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="strength-documentation" />
                      <Label htmlFor="strength-documentation" className="text-sm">記録・文書作成</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>後輩に伝えたい看護の知恵・技術（具体例）</Label>
              <Textarea 
                placeholder="患者観察のポイント、効率的な業務のコツ、困難事例への対応方法など"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>知識・技術の継承方法の提案</Label>
              <Textarea 
                placeholder="勉強会の開催、マニュアル作成、OJTでの指導方法など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織への改善提案</Label>
              <Textarea 
                placeholder="業務効率化、教育体制、職場環境、患者サービス向上など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 3. 健康状態とワークライフバランス（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 健康状態とワークライフバランス（8分）</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label className="font-semibold">身体的健康状態</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="health-fatigue" />
                    <Label htmlFor="health-fatigue">慢性的な疲労</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="health-pain" />
                    <Label htmlFor="health-pain">腰痛・関節痛</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="health-vision" />
                    <Label htmlFor="health-vision">視力の低下</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="health-chronic" />
                    <Label htmlFor="health-chronic">持病の管理</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="font-semibold">精神的健康状態</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="mental-stress" />
                    <Label htmlFor="mental-stress">ストレス</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="mental-burnout" />
                    <Label htmlFor="mental-burnout">燃え尽き感</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="mental-anxiety" />
                    <Label htmlFor="mental-anxiety">将来への不安</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="mental-satisfaction" />
                    <Label htmlFor="mental-satisfaction">仕事の充実感</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>現在の勤務負担と調整希望</Label>
              <Textarea 
                placeholder="夜勤回数、残業時間、体力的に負担な業務、希望する配慮など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>プライベートとの両立</Label>
              <Textarea 
                placeholder="家族の介護、趣味の時間、休息の確保など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. キャリア後期の計画（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. キャリア後期の計画（10分）</h3>
            
            <div className="bg-green-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">今後のキャリアビジョン</Label>
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="frontline" id="vision-frontline" />
                  <Label htmlFor="vision-frontline">現場での実践を継続（業務調整あり）</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="education" id="vision-education" />
                  <Label htmlFor="vision-education">教育・指導役に専念</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="specialist" id="vision-specialist" />
                  <Label htmlFor="vision-specialist">特定分野のスペシャリスト</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nurse" id="vision-nurse" />
                  <Label htmlFor="vision-nurse">看護師資格取得への挑戦</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="parttime" id="vision-parttime" />
                  <Label htmlFor="vision-parttime">パートタイムへの移行</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="retirement" id="vision-retirement" />
                  <Label htmlFor="vision-retirement">定年・退職の準備</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>希望する役割・ポジション</Label>
              <Textarea 
                placeholder="教育担当、相談役、特定業務の専任など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>定年後の働き方の希望</Label>
              <Textarea 
                placeholder="再雇用の希望、勤務条件、引き継ぎ計画など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織に残したいレガシー（遺産）</Label>
              <Textarea 
                placeholder="後輩の育成、マニュアルの整備、職場文化の形成など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 5. 支援計画と目標設定（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. 支援計画と目標設定（7分）</h3>
            
            <div className="space-y-3">
              <Label className="text-base font-semibold">必要な支援・配慮事項</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">業務面</p>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="support-workload" />
                      <Label htmlFor="support-workload" className="text-sm">業務量の調整</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="support-night" />
                      <Label htmlFor="support-night" className="text-sm">夜勤の軽減</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="support-physical" />
                      <Label htmlFor="support-physical" className="text-sm">身体的負担の軽減</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="support-schedule" />
                      <Label htmlFor="support-schedule" className="text-sm">勤務時間の調整</Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">キャリア面</p>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="career-training" />
                      <Label htmlFor="career-training" className="text-sm">研修機会の提供</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="career-role" />
                      <Label htmlFor="career-role" className="text-sm">新しい役割の付与</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="career-mentor" />
                      <Label htmlFor="career-mentor" className="text-sm">メンター役の公式化</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="career-recognition" />
                      <Label htmlFor="career-recognition" className="text-sm">貢献の表彰</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">行動計画（今後6ヶ月）</Label>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <span className="font-medium">1.</span>
                  <Input placeholder="最優先で取り組む項目" className="flex-1" />
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-medium">2.</span>
                  <Input placeholder="2番目に取り組む項目" className="flex-1" />
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-medium">3.</span>
                  <Input placeholder="3番目に取り組む項目" className="flex-1" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>モチベーション向上のための施策</Label>
              <Textarea 
                placeholder="表彰、役割の明確化、働きがいの創出など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 面談のまとめ */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談のまとめ</h3>
            
            <div className="space-y-2">
              <Label>面談者による総合評価</Label>
              <Textarea 
                placeholder="強み、組織への貢献度、配慮事項、今後の活用方針など"
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label>特記事項・申し送り</Label>
              <Textarea 
                placeholder="上司への報告事項、他部門との調整事項など"
                className="min-h-[80px]"
              />
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold text-yellow-800">フォローアップ計画</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>次回面談予定</Label>
                  <Input type="date" className="mt-1" />
                </div>
                <div>
                  <Label>面談頻度</Label>
                  <RadioGroup className="mt-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monthly" id="freq-monthly" />
                      <Label htmlFor="freq-monthly">月1回</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="quarterly" id="freq-quarterly" />
                      <Label htmlFor="freq-quarterly">3ヶ月に1回</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="biannual" id="freq-biannual" />
                      <Label htmlFor="freq-biannual">6ヶ月に1回</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>

          {/* 署名欄 */}
          <div className="flex justify-between items-center border-t pt-4">
            <div className="flex items-center space-x-4">
              <Label>面談者署名：</Label>
              <Input className="w-48" />
            </div>
            <div className="flex items-center space-x-4">
              <Label>対象者署名：</Label>
              <Input className="w-48" />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              面談記録を保存
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}