'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export default function NewNurse30MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-2xl">1年目新人看護師 定期面談シート（30分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>配属部署：＿＿＿＿＿＿＿＿　入職日：＿＿＿＿年＿＿月＿＿日</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. 現在の状況確認（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 現在の状況確認（5分）</h3>
            
            <div className="space-y-2">
              <Label>体調・健康状態</Label>
              <RadioGroup>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="health-excellent" />
                    <Label htmlFor="health-excellent" className="ml-2">良好</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="health-good" />
                    <Label htmlFor="health-good" className="ml-2">普通</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="poor" id="health-poor" />
                    <Label htmlFor="health-poor" className="ml-2">不調</Label>
                  </div>
                </div>
              </RadioGroup>
              <Textarea 
                placeholder="具体的な状況（睡眠時間、食事、運動習慣など）"
                className="min-h-[60px] mt-2"
              />
            </div>

            <div className="space-y-2">
              <Label>勤務状況</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">今月の残業時間</Label>
                  <input type="text" className="w-full border rounded px-2 py-1" placeholder="＿＿時間" />
                </div>
                <div>
                  <Label className="text-sm">休暇取得状況</Label>
                  <input type="text" className="w-full border rounded px-2 py-1" placeholder="＿＿日" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>職場適応度（総合評価）</Label>
              <RadioGroup>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <RadioGroupItem value="5" id="adapt-5" />
                    <Label htmlFor="adapt-5" className="ml-2">5（非常に良い）</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="4" id="adapt-4" />
                    <Label htmlFor="adapt-4" className="ml-2">4</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="3" id="adapt-3" />
                    <Label htmlFor="adapt-3" className="ml-2">3</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="2" id="adapt-2" />
                    <Label htmlFor="adapt-2" className="ml-2">2</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="1" id="adapt-1" />
                    <Label htmlFor="adapt-1" className="ml-2">1（要支援）</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 2. 技術習得状況（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. 技術習得状況（8分）</h3>
            
            <div className="space-y-2">
              <Label>基本看護技術チェック</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="vital" />
                  <Label htmlFor="vital" className="text-sm">バイタルサイン測定</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="blood" />
                  <Label htmlFor="blood" className="text-sm">採血</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="iv" />
                  <Label htmlFor="iv" className="text-sm">点滴管理</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="medication" />
                  <Label htmlFor="medication" className="text-sm">与薬</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="wound" />
                  <Label htmlFor="wound" className="text-sm">創傷処置</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="catheter" />
                  <Label htmlFor="catheter" className="text-sm">カテーテル管理</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="record" />
                  <Label htmlFor="record" className="text-sm">看護記録</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="emergency" />
                  <Label htmlFor="emergency" className="text-sm">急変対応</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>今月新たに習得した技術・知識</Label>
              <Textarea 
                placeholder="具体的な技術名と習得レベルを記入"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>自信を持って実施できる技術</Label>
              <Textarea 
                placeholder="独り立ちできている技術を記入"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>不安・課題を感じている技術</Label>
              <Textarea 
                placeholder="具体的な技術名と不安な点、必要なサポートを記入"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 3. 人間関係・職場環境（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 人間関係・職場環境（7分）</h3>
            
            <div className="space-y-2">
              <Label>プリセプターとの関係性</Label>
              <RadioGroup>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="preceptor-excellent" />
                    <Label htmlFor="preceptor-excellent" className="ml-2">良好</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="preceptor-good" />
                    <Label htmlFor="preceptor-good" className="ml-2">普通</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="difficult" id="preceptor-difficult" />
                    <Label htmlFor="preceptor-difficult" className="ml-2">課題あり</Label>
                  </div>
                </div>
              </RadioGroup>
              <Textarea 
                placeholder="具体的な状況、良い点、改善してほしい点"
                className="min-h-[60px] mt-2"
              />
            </div>

            <div className="space-y-2">
              <Label>チームメンバーとの関係</Label>
              <Textarea 
                placeholder="同僚との関係、チームワークの状況"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>患者・家族とのコミュニケーション</Label>
              <Textarea 
                placeholder="うまくいっている点、困っている点"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>職場環境への要望</Label>
              <Textarea 
                placeholder="勤務体制、教育体制、設備等への要望"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. 目標設定と成長（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 目標設定と成長（5分）</h3>
            
            <div className="space-y-2">
              <Label>短期目標（1ヶ月）</Label>
              <Textarea 
                placeholder="次回面談までに達成したい具体的な目標"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>中期目標（3ヶ月）</Label>
              <Textarea 
                placeholder="3ヶ月後の自分の姿"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>将来のキャリアビジョン</Label>
              <Textarea 
                placeholder="どんな看護師になりたいか、興味のある分野"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 5. アクションプラン（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. アクションプラン（5分）</h3>
            
            <div className="space-y-2">
              <Label>本人の取り組み事項</Label>
              <Textarea 
                placeholder="具体的な行動計画（いつ、何を、どのように）"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>プリセプター・指導者の支援計画</Label>
              <Textarea 
                placeholder="提供する指導・支援内容"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織・管理者からのサポート</Label>
              <Textarea 
                placeholder="研修機会、勤務調整、環境整備など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>次回面談予定日</Label>
              <input type="date" className="border rounded px-3 py-2" />
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <div className="space-y-2">
              <Label>成長度評価</Label>
              <RadioGroup>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="growth-excellent" />
                    <Label htmlFor="growth-excellent" className="ml-2">期待以上</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="growth-good" />
                    <Label htmlFor="growth-good" className="ml-2">順調</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="normal" id="growth-normal" />
                    <Label htmlFor="growth-normal" className="ml-2">標準的</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="slow" id="growth-slow" />
                    <Label htmlFor="growth-slow" className="ml-2">要支援</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            <Textarea 
              placeholder="総合評価、強み、改善点、特記事項、継続観察事項など"
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