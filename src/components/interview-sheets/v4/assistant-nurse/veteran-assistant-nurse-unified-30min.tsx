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

export default function VeteranAssistantNurseUnified30MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-purple-50">
          <CardTitle className="text-2xl">ベテラン准看護師（10年以上）定期面談シート（30分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              30分の標準面談です。ベテラン准看護師の経験を活かした貢献と今後のキャリアを支援することを目的とします。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. 専門性と指導的役割の評価（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 専門性と指導的役割の評価（8分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">専門的能力と貢献度</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "専門的看護技術",
                "後輩への指導・教育",
                "チーム内での調整役",
                "業務改善への貢献",
                "緊急時の対応力",
                "看護師との協働",
                "経験に基づく判断力"
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
                <p><span className="text-green-600 font-medium">5：</span>卓越　<span className="text-blue-600 font-medium">4：</span>優秀　<span className="text-yellow-600 font-medium">3：</span>標準　<span className="text-orange-600 font-medium">2：</span>要改善　<span className="text-red-600 font-medium">1：</span>課題あり</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>現在担っている特別な役割・責任</Label>
              <Textarea 
                placeholder="プリセプター、委員会活動、業務改善リーダーなど"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>後輩指導での成果・工夫</Label>
              <Textarea 
                placeholder="指導した内容、育成の成果、指導方法の工夫など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. 健康・モチベーション・働きがい（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. 健康・モチベーション・働きがい（7分）</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>体調面</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="health-excellent" />
                    <Label htmlFor="health-excellent">良好</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="health-normal" />
                    <Label htmlFor="health-normal">普通</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="concern" id="health-concern" />
                    <Label htmlFor="health-concern">要配慮</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>モチベーション</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="motivation-high" />
                    <Label htmlFor="motivation-high">高い</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="motivation-normal" />
                    <Label htmlFor="motivation-normal">普通</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="motivation-low" />
                    <Label htmlFor="motivation-low">低い</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>働きがい</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="fulfillment-high" />
                    <Label htmlFor="fulfillment-high">感じる</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="fulfillment-normal" />
                    <Label htmlFor="fulfillment-normal">まあまあ</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="fulfillment-low" />
                    <Label htmlFor="fulfillment-low">感じない</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label>体力面での配慮事項</Label>
              <Textarea 
                placeholder="夜勤の負担、腰痛等の症状、必要な業務調整など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>仕事へのやりがい・満足度</Label>
              <Textarea 
                placeholder="やりがいを感じる点、不満な点、改善希望など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 3. 経験の活用と知識継承（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 経験の活用と知識継承（7分）</h3>
            
            <div className="space-y-3">
              <Label className="text-base font-semibold">経験・知識を活かせる場面</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="mentor" />
                  <Label htmlFor="mentor">新人・若手の指導役</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="manual" />
                  <Label htmlFor="manual">マニュアル作成・改訂</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="committee" />
                  <Label htmlFor="committee">委員会活動</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="improvement" />
                  <Label htmlFor="improvement">業務改善活動</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="education" />
                  <Label htmlFor="education">勉強会の講師</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>伝承したい看護の知恵・技術</Label>
              <Textarea 
                placeholder="長年の経験から得た知識、技術、患者対応のコツなど"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>職場への提案・改善アイデア</Label>
              <Textarea 
                placeholder="業務効率化、教育体制、職場環境改善など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. 今後のキャリアと支援（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 今後のキャリアと支援（8分）</h3>
            
            <div className="bg-green-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">今後のキャリア希望</Label>
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="continue" id="career-continue" />
                  <Label htmlFor="career-continue">現場での実践を継続</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="education" id="career-education" />
                  <Label htmlFor="career-education">教育・指導に注力</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nurse" id="career-nurse" />
                  <Label htmlFor="career-nurse">看護師資格取得を検討</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reduce" id="career-reduce" />
                  <Label htmlFor="career-reduce">業務負担を軽減</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="retire" id="career-retire" />
                  <Label htmlFor="career-retire">定年後の働き方を検討</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>希望する働き方・勤務形態</Label>
              <Textarea 
                placeholder="夜勤の有無、勤務時間、業務内容の調整など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>必要な支援・配慮</Label>
              <Textarea 
                placeholder="健康面のサポート、スキルアップ支援、役割の見直しなど"
                className="min-h-[60px]"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <Label className="text-base font-semibold">今後の目標・計画</Label>
              <Textarea 
                className="mt-2 min-h-[80px]"
                placeholder="短期・中期的な目標、取り組みたいこと"
              />
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <Textarea 
              placeholder="総合評価、強み、配慮事項、組織への貢献、申し送り事項など"
              className="min-h-[100px]"
            />
          </div>

          {/* フォローアップ */}
          <div className="bg-yellow-50 p-4 rounded-lg space-y-3">
            <Label className="text-base font-semibold text-yellow-800">次回面談</Label>
            <RadioGroup>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1month" id="followup-1month" />
                <Label htmlFor="followup-1month">1ヶ月後</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3months" id="followup-3months" />
                <Label htmlFor="followup-3months">3ヶ月後</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="6months" id="followup-6months" />
                <Label htmlFor="followup-6months">6ヶ月後</Label>
              </div>
            </RadioGroup>
          </div>

          {/* 署名欄 */}
          <div className="flex justify-between items-center border-t pt-4">
            <div className="flex items-center space-x-4">
              <Label>面談者署名：</Label>
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