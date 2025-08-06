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

export default function NewAssistantNurseUnified45MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-pink-50">
          <CardTitle className="text-2xl">新人准看護師（1年目）定期面談シート（45分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>入職日：＿＿＿＿年＿＿月＿＿日　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              45分の詳細面談です。新人准看護師の成長を総合的に評価し、詳細な育成計画を立案することを目的とします。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. 業務習得状況の詳細評価（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 業務習得状況の詳細評価（10分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">看護技術の習得度（詳細評価）</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "バイタルサイン測定",
                "日常生活援助技術",
                "医療処置の補助",
                "与薬管理の補助",
                "感染対策の実施",
                "医師・看護師の指示理解",
                "指示の正確な実行",
                "報告・連絡・相談",
                "看護記録の作成",
                "患者・家族への対応",
                "安全管理・事故防止",
                "緊急時の初期対応"
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
                <p><span className="text-green-600 font-medium">5：</span>指導なしで確実に実施　<span className="text-blue-600 font-medium">4：</span>ほぼ自立して実施　<span className="text-yellow-600 font-medium">3：</span>時々指導が必要　<span className="text-orange-600 font-medium">2：</span>常に指導が必要　<span className="text-red-600 font-medium">1：</span>未経験・要指導</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>特に成長が見られた技術・業務（具体例を含む）</Label>
              <Textarea 
                placeholder="具体的なエピソードを交えて記載"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>重点的に指導が必要な技術・業務</Label>
              <Textarea 
                placeholder="具体的な指導計画を含めて記載"
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* 2. チーム内での役割と人間関係（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. チーム内での役割と人間関係（10分）</h3>
            
            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">チーム連携能力の評価</Label>
              {[
                { id: "report", label: "看護師への報告の適切性", desc: "タイミング、内容、優先順位" },
                { id: "instruction", label: "指示受けの確実性", desc: "復唱確認、不明点の質問" },
                { id: "cooperation", label: "チーム内での協調性", desc: "積極的な協力、助け合い" },
                { id: "communication", label: "コミュニケーション能力", desc: "明確な伝達、傾聴" },
                { id: "responsibility", label: "責任感・信頼性", desc: "約束の遵守、業務の完遂" }
              ].map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{item.label}</span>
                      <span className="text-xs text-gray-600 ml-2">（{item.desc}）</span>
                    </div>
                    <RadioGroup className="flex flex-row space-x-2">
                      {[5, 4, 3, 2, 1].map((value) => (
                        <RadioGroupItem key={value} value={`${item.id}-${value}`} id={`${item.id}-${value}`} />
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label>プリセプター・指導者との関係性</Label>
              <Textarea 
                placeholder="指導の受け方、相談のしやすさ、関係性の課題など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>同僚・先輩スタッフとの関係</Label>
              <Textarea 
                placeholder="職場での人間関係、相談できる相手の有無など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>多職種連携の状況</Label>
              <Textarea 
                placeholder="医師、リハビリスタッフ、介護職、事務職等との連携"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 3. 健康状態とワークライフバランス（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 健康状態とワークライフバランス（8分）</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label className="font-semibold">身体的健康</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="physical-fatigue" />
                    <Label htmlFor="physical-fatigue">疲労感がある</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="physical-sleep" />
                    <Label htmlFor="physical-sleep">睡眠不足</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="physical-appetite" />
                    <Label htmlFor="physical-appetite">食欲不振</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="physical-pain" />
                    <Label htmlFor="physical-pain">腰痛・肩こり等</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="font-semibold">精神的健康</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="mental-stress" />
                    <Label htmlFor="mental-stress">ストレスを感じる</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="mental-anxiety" />
                    <Label htmlFor="mental-anxiety">不安感がある</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="mental-motivation" />
                    <Label htmlFor="mental-motivation">やる気が出ない</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="mental-confidence" />
                    <Label htmlFor="mental-confidence">自信がない</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>勤務状況とワークライフバランス</Label>
              <Textarea 
                placeholder="残業時間、休日取得状況、プライベートの時間確保など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>ストレス対処法・リフレッシュ方法</Label>
              <Textarea 
                placeholder="現在のストレス対処法、趣味、リフレッシュ方法など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. キャリア開発と目標設定（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. キャリア開発と目標設定（10分）</h3>
            
            <div className="space-y-2">
              <Label>准看護師としての職業意識・やりがい</Label>
              <Textarea 
                placeholder="仕事への思い、やりがいを感じる瞬間、職業観など"
                className="min-h-[80px]"
              />
            </div>

            <div className="bg-green-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">将来のキャリアプラン</Label>
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nurse" id="career-nurse" />
                  <Label htmlFor="career-nurse">看護師資格取得を目指す</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="specialist" id="career-specialist" />
                  <Label htmlFor="career-specialist">准看護師として専門性を高める</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="undecided" id="career-undecided" />
                  <Label htmlFor="career-undecided">まだ決めていない</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="career-other" />
                  <Label htmlFor="career-other">その他：</Label>
                  <Input className="w-64 ml-2" placeholder="具体的に記載" />
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>興味のある看護分野・学びたいこと</Label>
              <Textarea 
                placeholder="興味のある診療科、専門分野、学びたい技術など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>短期目標（3ヶ月）</Label>
              <Textarea 
                placeholder="具体的で達成可能な目標を2-3つ"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>中期目標（1年）</Label>
              <Textarea 
                placeholder="1年後になりたい姿、達成したいこと"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 5. 教育・研修計画（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. 教育・研修計画（7分）</h3>
            
            <div className="space-y-3">
              <Label className="text-base font-semibold">参加すべき研修・勉強会</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">院内研修</p>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="internal-basic" />
                      <Label htmlFor="internal-basic" className="text-sm">基礎看護技術</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="internal-safety" />
                      <Label htmlFor="internal-safety" className="text-sm">医療安全</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="internal-infection" />
                      <Label htmlFor="internal-infection" className="text-sm">感染対策</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="internal-emergency" />
                      <Label htmlFor="internal-emergency" className="text-sm">救急対応</Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">外部研修</p>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="external-association" />
                      <Label htmlFor="external-association" className="text-sm">准看護師会研修</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="external-skill" />
                      <Label htmlFor="external-skill" className="text-sm">スキルアップ研修</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="external-career" />
                      <Label htmlFor="external-career" className="text-sm">キャリア研修</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>OJTでの重点指導項目</Label>
              <Textarea 
                placeholder="日常業務の中で重点的に指導する項目、方法など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>自己学習の支援</Label>
              <Textarea 
                placeholder="推奨する参考書、e-learning、学習時間の確保など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 面談のまとめ */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談のまとめ</h3>
            
            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">行動計画（アクションプラン）</Label>
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
              <Label>面談者による総合評価・所見</Label>
              <Textarea 
                placeholder="成長の様子、強み、課題、必要な支援、申し送り事項など"
                className="min-h-[120px]"
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
                  <Label>フォロー頻度</Label>
                  <RadioGroup className="mt-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weekly" id="follow-weekly" />
                      <Label htmlFor="follow-weekly">週1回</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="biweekly" id="follow-biweekly" />
                      <Label htmlFor="follow-biweekly">2週に1回</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monthly" id="follow-monthly" />
                      <Label htmlFor="follow-monthly">月1回</Label>
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