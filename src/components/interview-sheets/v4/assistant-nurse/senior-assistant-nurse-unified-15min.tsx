'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SeniorAssistantNurseUnified15MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-2xl">シニア准看護師（4-9年目）定期面談シート（15分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              15分の短時間面談です。シニア准看護師の専門性発揮と後輩指導状況を確認し、重要課題を特定します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. 専門性と指導力の確認（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 専門性と指導力の確認（5分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">シニア准看護師としての能力発揮</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "高度な看護技術",
                "複雑なケースへの対応",
                "後輩への技術指導",
                "チーム内での調整力",
                "看護師との協働"
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
                <p><span className="text-green-600 font-medium">5：</span>期待を大きく超える　<span className="text-blue-600 font-medium">4：</span>期待を超える　<span className="text-yellow-600 font-medium">3：</span>期待通り　<span className="text-orange-600 font-medium">2：</span>やや期待以下　<span className="text-red-600 font-medium">1：</span>期待以下</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>現在の役割・責任範囲</Label>
              <Textarea 
                placeholder="チーム内での役割、後輩指導、専門業務など簡潔に記入"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>この半年で発揮した専門性・リーダーシップ</Label>
              <Textarea 
                placeholder="困難ケースへの対応、指導実績、チーム貢献など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 2. 職員の現状確認（モチベーション・健康・エンゲージメント）（5分） */}
          <div className="space-y-4 bg-green-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 職員の現状確認（モチベーション・健康・エンゲージメント）（5分）</h3>
            
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
                "職場満足度"
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
                <p><span className="text-green-600 font-medium">5：</span>非常に高い/満足　<span className="text-blue-600 font-medium">4：</span>高い/満足　<span className="text-yellow-600 font-medium">3：</span>普通　<span className="text-orange-600 font-medium">2：</span>低い/やや不満　<span className="text-red-600 font-medium">1：</span>非常に低い/不満</p>
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
                "3年後の継続意向"
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
                <p><span className="font-medium">継続意向：</span><span className="text-green-600 font-medium">5：</span>ぜひ続けたい　<span className="text-blue-600 font-medium">4：</span>続けたい　<span className="text-yellow-600 font-medium">3：</span>わからない　<span className="text-orange-600 font-medium">2：</span>転職検討　<span className="text-red-600 font-medium">1：</span>転職活動中</p>
              </div>
            </div>
          </div>

          {/* 3. 現在の課題・必要なサポート（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 現在の課題・必要なサポート（3分）</h3>
            
            <div className="space-y-2">
              <Label>現在困っていること・重要課題（最重要事項）</Label>
              <Textarea 
                placeholder="指導業務、専門性向上、キャリア開発で困っていることを1-2つ簡潔に記入"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>必要なサポート（最優先のもの1つ）</Label>
              <RadioGroup>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="advanced-training" id="support-advanced" />
                    <Label htmlFor="support-advanced" className="ml-2">高度技術研修</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="career" id="support-career" />
                    <Label htmlFor="support-career" className="ml-2">キャリア相談</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="teaching-skill" id="support-teaching" />
                    <Label htmlFor="support-teaching" className="ml-2">指導スキル向上</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="workload" id="support-workload" />
                    <Label htmlFor="support-workload" className="ml-2">業務量調整</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="mental" id="support-mental" />
                    <Label htmlFor="support-mental" className="ml-2">メンタルケア</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="certification" id="support-certification" />
                    <Label htmlFor="support-certification" className="ml-2">看護師資格取得支援</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 4. 次回までのアクション（2分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 次回までのアクション（2分）</h3>
            
            <div className="space-y-2">
              <Label>次回面談までの具体的目標（1つ）</Label>
              <Textarea 
                placeholder="専門性向上や指導力強化に関する具体的目標を記入"
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
                <Input type="text" id="follow-method" placeholder="月次1on1など" />
              </div>
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>専門性発揮度</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="expertise-excellent" />
                    <Label htmlFor="expertise-excellent" className="ml-1 text-sm">期待以上</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="expertise-good" />
                    <Label htmlFor="expertise-good" className="ml-1 text-sm">順調</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="needs-support" id="expertise-support" />
                    <Label htmlFor="expertise-support" className="ml-1 text-sm">要支援</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>指導力</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="teaching-high" />
                    <Label htmlFor="teaching-high" className="ml-1 text-sm">高</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="teaching-medium" />
                    <Label htmlFor="teaching-medium" className="ml-1 text-sm">中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="developing" id="teaching-developing" />
                    <Label htmlFor="teaching-developing" className="ml-1 text-sm">発展途上</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>離職リスク</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="risk-low" />
                    <Label htmlFor="risk-low" className="ml-1 text-sm">低</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="risk-medium" />
                    <Label htmlFor="risk-medium" className="ml-1 text-sm">中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="risk-high" />
                    <Label htmlFor="risk-high" className="ml-1 text-sm">高</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <Textarea 
              placeholder="シニアとしての貢献度、今後の期待、キャリア開発支援、緊急対応が必要な事項があれば記入"
              className="min-h-[80px]"
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