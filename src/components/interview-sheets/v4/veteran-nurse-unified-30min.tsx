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
import { Checkbox } from '@/components/ui/checkbox';

export default function VeteranNurseUnified30MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-purple-50">
          <CardTitle className="text-2xl">ベテラン看護師（16年目以上）定期面談シート（30分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              30分の標準面談です。ベテラン看護師の豊富な経験を組織に活かし、継続的な貢献を促進します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. 専門性と知識伝承（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 専門性と知識伝承（8分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">専門領域と貢献度評価</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5:卓越</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4:優秀</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3:良好</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2:標準</div>
                <div className="bg-red-100 px-2 py-1 rounded">1:要改善</div>
              </div>
              
              {[
                "専門知識の深さ",
                "臨床判断力",
                "技術指導力",
                "暗黙知の形式知化",
                "ベストプラクティス共有",
                "困難事例への対応力"
              ].map((item, index) => (
                <div key={index} className="grid grid-cols-6 gap-2 items-center">
                  <Label className="text-sm">{item}</Label>
                  {[5, 4, 3, 2, 1].map((value) => (
                    <div key={value} className="flex justify-center">
                      <Input type="radio" name={`expertise-${index}`} value={value} className="w-4 h-4" />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">知識伝承活動</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "マニュアル・手順書作成",
                  "院内研修講師",
                  "事例検討会リード",
                  "OJT指導",
                  "メンタリング活動",
                  "学会・研究発表",
                  "看護研究指導",
                  "ノウハウの文書化"
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox id={`transfer-${index}`} />
                    <Label htmlFor={`transfer-${index}`} className="text-sm">{activity}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="knowledge-legacy">重要な知識・技術の継承計画</Label>
              <Textarea 
                id="knowledge-legacy" 
                className="min-h-[80px]"
                placeholder="後継者への引き継ぎ事項、継承方法、タイムライン等"
              />
            </div>
          </div>

          {/* 2. 組織への貢献と役割（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. 組織への貢献と役割（7分）</h3>
            
            <div className="bg-green-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">現在の特別役割・責任</Label>
              <div className="space-y-2">
                <Textarea 
                  className="min-h-[60px]"
                  placeholder="委員会活動、プロジェクトリーダー、相談役等"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="influence-scope">影響力の範囲</Label>
                <RadioGroup defaultValue="">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="department" id="inf-department" />
                    <Label htmlFor="inf-department">部署内</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cross-dept" id="inf-cross-dept" />
                    <Label htmlFor="inf-cross-dept">複数部署</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hospital" id="inf-hospital" />
                    <Label htmlFor="inf-hospital">病院全体</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="external" id="inf-external" />
                    <Label htmlFor="inf-external">院外含む</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="advisory-role">アドバイザリー機能</Label>
                <RadioGroup defaultValue="">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="active" id="adv-active" />
                    <Label htmlFor="adv-active">積極的に発揮</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="requested" id="adv-requested" />
                    <Label htmlFor="adv-requested">求められれば</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="limited" id="adv-limited" />
                    <Label htmlFor="adv-limited">限定的</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minimal" id="adv-minimal" />
                    <Label htmlFor="adv-minimal">ほとんどなし</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizational-value">組織にとっての価値・強み</Label>
              <Textarea 
                id="organizational-value" 
                className="min-h-[80px]"
                placeholder="組織文化の継承、若手の精神的支柱、専門知識の宝庫等"
              />
            </div>
          </div>

          {/* 3. モチベーションと働きがい（6分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. モチベーションと働きがい（6分）</h3>
            
            <div className="bg-yellow-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">モチベーション要因</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "専門性の発揮",
                  "後輩育成の喜び",
                  "患者からの信頼",
                  "同僚からの尊敬",
                  "新しい学び",
                  "組織への貢献実感",
                  "適切な評価",
                  "ワークライフバランス"
                ].map((factor, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox id={`motivation-${index}`} />
                    <Label htmlFor={`motivation-${index}`} className="text-sm">{factor}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="job-satisfaction">現在の仕事への満足度と理由</Label>
              <Textarea 
                id="job-satisfaction" 
                className="min-h-[60px]"
                placeholder="満足している点、不満な点、改善希望等"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="career-outlook">今後のキャリア展望（定年まで）</Label>
              <Textarea 
                id="career-outlook" 
                className="min-h-[60px]"
                placeholder="継続希望、役割変更、勤務形態変更等"
              />
            </div>
          </div>

          {/* 4. 後進育成と mentoring（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 後進育成とメンタリング（5分）</h3>
            
            <div className="space-y-2">
              <Label htmlFor="mentoring-style">指導・育成スタイル</Label>
              <Textarea 
                id="mentoring-style" 
                className="min-h-[60px]"
                placeholder="指導方針、得意な育成方法、心がけていること"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>現在指導中の人数</Label>
                <Input type="number" placeholder="人数" />
              </div>
              <div className="space-y-2">
                <Label>育成への時間配分</Label>
                <Input type="text" placeholder="週○時間程度" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="succession-candidates">後継者候補と育成状況</Label>
              <Textarea 
                id="succession-candidates" 
                className="min-h-[60px]"
                placeholder="具体的な候補者、育成進捗、課題等"
              />
            </div>
          </div>

          {/* 5. 健康管理と勤務調整（4分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. 健康管理と勤務調整（4分）</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>健康状態</Label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option value="">選択</option>
                  <option value="excellent">良好</option>
                  <option value="good">概ね良好</option>
                  <option value="fair">普通</option>
                  <option value="attention">要注意</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>夜勤対応</Label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option value="">選択</option>
                  <option value="full">通常通り</option>
                  <option value="reduced">軽減中</option>
                  <option value="exempt">免除</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>体力的負担</Label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option value="">選択</option>
                  <option value="no-issue">問題なし</option>
                  <option value="manageable">対応可能</option>
                  <option value="challenging">きつい</option>
                  <option value="difficult">要配慮</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="work-adjustment">勤務形態の調整希望</Label>
              <Textarea 
                id="work-adjustment" 
                className="min-h-[60px]"
                placeholder="時短勤務、日勤専従、専門職としての活動時間確保等"
              />
            </div>
          </div>

          {/* 面談者総合所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者総合所見</h3>
            
            <div className="bg-orange-50 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contribution-assessment">総合貢献度評価</Label>
                  <RadioGroup defaultValue="">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="invaluable" id="cont-invaluable" />
                      <Label htmlFor="cont-invaluable">かけがえのない存在</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="very-high" id="cont-very-high" />
                      <Label htmlFor="cont-very-high">非常に高い</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="cont-high" />
                      <Label htmlFor="cont-high">高い</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderate" id="cont-moderate" />
                      <Label htmlFor="cont-moderate">標準的</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retention-priority">リテンション優先度</Label>
                  <RadioGroup defaultValue="">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="critical" id="ret-critical" />
                      <Label htmlFor="ret-critical">最重要</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="ret-high" />
                      <Label htmlFor="ret-high">重要</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="ret-standard" />
                      <Label htmlFor="ret-standard">標準</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="flexible" id="ret-flexible" />
                      <Label htmlFor="ret-flexible">柔軟対応</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="future-utilization">今後の活用方針・提案</Label>
                <Textarea 
                  id="future-utilization" 
                  className="min-h-[80px]"
                  placeholder="特別アドバイザー、教育専任、プロジェクトリーダー等の役割提案"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="special-considerations">特別配慮事項</Label>
                <Textarea 
                  id="special-considerations" 
                  className="min-h-[60px]"
                  placeholder="健康面、家庭事情、モチベーション維持のための配慮等"
                />
              </div>
            </div>
          </div>

          {/* 次回面談予定 */}
          <div className="grid grid-cols-3 gap-4 border-t pt-4">
            <div className="space-y-2">
              <Label htmlFor="next-interview-date">次回面談予定日</Label>
              <Input id="next-interview-date" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="next-interview-type">次回面談形式</Label>
              <select id="next-interview-type" className="w-full px-3 py-2 border rounded-md">
                <option value="">選択してください</option>
                <option value="15min">15分面談</option>
                <option value="30min">30分面談</option>
                <option value="45min">45分面談</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="next-topics">重点確認事項</Label>
              <Input id="next-topics" placeholder="健康、後継者育成等" />
            </div>
          </div>

          {/* 保存ボタン */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline">一時保存</Button>
            <Button>面談記録を保存</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}