'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export default function VeteranNurse30MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-purple-50">
          <CardTitle className="text-2xl">11年以上ベテラン看護師 定期面談シート（30分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>配属部署：＿＿＿＿＿＿＿＿　経験年数：＿＿年＿＿ヶ月</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. 現況確認と満足度（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 現況確認と満足度（5分）</h3>
            
            <div className="space-y-2">
              <Label>健康状態の詳細確認</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="back-pain" />
                  <Label htmlFor="back-pain" className="text-sm">腰痛</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="fatigue" />
                  <Label htmlFor="fatigue" className="text-sm">慢性疲労</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sleep" />
                  <Label htmlFor="sleep" className="text-sm">睡眠障害</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="stress" />
                  <Label htmlFor="stress" className="text-sm">ストレス</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="vision" />
                  <Label htmlFor="vision" className="text-sm">視力低下</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="other-health" />
                  <Label htmlFor="other-health" className="text-sm">その他</Label>
                </div>
              </div>
              <Textarea 
                placeholder="健康面での配慮事項、通院状況など"
                className="min-h-[60px] mt-2"
              />
            </div>

            <div className="space-y-2">
              <Label>職務満足度の詳細</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">仕事のやりがい</span>
                  <RadioGroup className="flex flex-row">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5" id="fulfillment-5" />
                      <Label htmlFor="fulfillment-5" className="text-sm">5</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4" id="fulfillment-4" />
                      <Label htmlFor="fulfillment-4" className="text-sm">4</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="fulfillment-3" />
                      <Label htmlFor="fulfillment-3" className="text-sm">3</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="fulfillment-2" />
                      <Label htmlFor="fulfillment-2" className="text-sm">2</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="fulfillment-1" />
                      <Label htmlFor="fulfillment-1" className="text-sm">1</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">処遇への満足度</span>
                  <RadioGroup className="flex flex-row">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5" id="compensation-5" />
                      <Label htmlFor="compensation-5" className="text-sm">5</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4" id="compensation-4" />
                      <Label htmlFor="compensation-4" className="text-sm">4</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="compensation-3" />
                      <Label htmlFor="compensation-3" className="text-sm">3</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="compensation-2" />
                      <Label htmlFor="compensation-2" className="text-sm">2</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="compensation-1" />
                      <Label htmlFor="compensation-1" className="text-sm">1</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">人間関係</span>
                  <RadioGroup className="flex flex-row">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5" id="relationship-5" />
                      <Label htmlFor="relationship-5" className="text-sm">5</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4" id="relationship-4" />
                      <Label htmlFor="relationship-4" className="text-sm">4</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="relationship-3" />
                      <Label htmlFor="relationship-3" className="text-sm">3</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="relationship-2" />
                      <Label htmlFor="relationship-2" className="text-sm">2</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="relationship-1" />
                      <Label htmlFor="relationship-1" className="text-sm">1</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>

          {/* 2. 専門性の発揮と貢献（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. 専門性の発揮と貢献（8分）</h3>
            
            <div className="space-y-2">
              <Label>保有資格・専門領域</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="certified" />
                  <Label htmlFor="certified" className="text-sm">認定看護師</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="specialist" />
                  <Label htmlFor="specialist" className="text-sm">専門看護師</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="specific-act" />
                  <Label htmlFor="specific-act" className="text-sm">特定行為</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="instructor" />
                  <Label htmlFor="instructor" className="text-sm">実習指導者</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="care-manager" />
                  <Label htmlFor="care-manager" className="text-sm">ケアマネジャー</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="other-cert" />
                  <Label htmlFor="other-cert" className="text-sm">その他</Label>
                </div>
              </div>
              <Textarea 
                placeholder="具体的な資格名、専門分野、活用状況"
                className="min-h-[60px] mt-2"
              />
            </div>

            <div className="space-y-2">
              <Label>組織への知識・技術伝承</Label>
              <Textarea 
                placeholder="マニュアル作成、勉強会開催、OJT、メンタリングなど"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>院内外での活動・貢献</Label>
              <Textarea 
                placeholder="委員会活動、学会発表、地域活動、執筆活動など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>若手・中堅への影響力</Label>
              <Textarea 
                placeholder="ロールモデルとしての活動、相談役、精神的支柱など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 3. 現在の課題と将来への不安（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 現在の課題と将来への不安（7分）</h3>
            
            <div className="space-y-2">
              <Label>業務上の困難・課題</Label>
              <Textarea 
                placeholder="体力的な負担、新しい技術への対応、世代間ギャップなど"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>キャリアの終盤に向けた不安</Label>
              <Textarea 
                placeholder="定年後の生活、退職時期、後継者育成など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織内での立場・評価への思い</Label>
              <Textarea 
                placeholder="承認、尊重、活用のされ方など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>継続就労の意向</Label>
              <RadioGroup>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="full-continue" id="continue-full" />
                    <Label htmlFor="continue-full" className="ml-2">定年まで現状維持で継続</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="reduced" id="continue-reduced" />
                    <Label htmlFor="continue-reduced" className="ml-2">負担軽減しながら継続</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="part-time" id="continue-part" />
                    <Label htmlFor="continue-part" className="ml-2">短時間勤務へ移行希望</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="considering" id="continue-considering" />
                    <Label htmlFor="continue-considering" className="ml-2">退職を検討中</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 4. 今後の働き方とキャリアプラン（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 今後の働き方とキャリアプラン（5分）</h3>
            
            <div className="space-y-2">
              <Label>希望する役割・業務内容</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="direct-care" />
                  <Label htmlFor="direct-care" className="text-sm">直接的な患者ケア</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="education" />
                  <Label htmlFor="education" className="text-sm">教育・指導中心</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="consultation" />
                  <Label htmlFor="consultation" className="text-sm">相談・助言役</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="administration" />
                  <Label htmlFor="administration" className="text-sm">管理業務</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="quality" />
                  <Label htmlFor="quality" className="text-sm">医療の質管理</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="other-role" />
                  <Label htmlFor="other-role" className="text-sm">その他</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>勤務形態の希望</Label>
              <Textarea 
                placeholder="日勤専従、短時間、週○日、夜勤免除など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>定年後の展望</Label>
              <Textarea 
                placeholder="再雇用希望、他施設への転職、完全退職など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 5. アクションプランと組織への提言（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. アクションプランと組織への提言（5分）</h3>
            
            <div className="space-y-2">
              <Label>今後3ヶ月の個人目標</Label>
              <Textarea 
                placeholder="健康維持、スキル維持、後進育成など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織への提言・要望</Label>
              <Textarea 
                placeholder="ベテラン活用、環境整備、制度改善など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>必要な支援・配慮事項</Label>
              <Textarea 
                placeholder="業務調整、健康管理支援、キャリア相談など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>次回面談予定</Label>
              <input type="date" className="border rounded px-3 py-2" />
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <div className="space-y-2">
              <Label>継続雇用の推奨度</Label>
              <RadioGroup>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <RadioGroupItem value="highly" id="recommend-highly" />
                    <Label htmlFor="recommend-highly" className="ml-2">強く推奨</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="recommend" id="recommend-yes" />
                    <Label htmlFor="recommend-yes" className="ml-2">推奨</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="conditional" id="recommend-conditional" />
                    <Label htmlFor="recommend-conditional" className="ml-2">条件付き推奨</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="neutral" id="recommend-neutral" />
                    <Label htmlFor="recommend-neutral" className="ml-2">本人意向次第</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            <Textarea 
              placeholder="健康状態、貢献度、今後の活用方針、必要な配慮、組織への価値など"
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