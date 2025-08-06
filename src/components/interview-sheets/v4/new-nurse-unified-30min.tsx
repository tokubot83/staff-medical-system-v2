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

export default function NewNurseUnified30MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-pink-50">
          <CardTitle className="text-2xl">新人看護師（1年目）定期面談シート（30分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>入職日：＿＿＿＿年＿＿月＿＿日　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              30分の標準面談です。新人看護師の成長状況を詳細に把握し、個別の育成計画を立案することを目的とします。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. 職場適応と人間関係（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 職場適応と人間関係（8分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">職場への適応度評価</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5:優秀</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4:良好</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3:標準</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2:要努力</div>
                <div className="bg-red-100 px-2 py-1 rounded">1:要支援</div>
              </div>
              
              {[
                "職場環境への適応",
                "病棟ルールの理解と遵守",
                "勤務シフトへの対応",
                "チームメンバーとの関係",
                "プリセプターとの関係",
                "患者・家族との関係構築"
              ].map((item, index) => (
                <div key={index} className="grid grid-cols-6 gap-2 items-center">
                  <Label className="text-sm">{item}</Label>
                  {[5, 4, 3, 2, 1].map((value) => (
                    <div key={value} className="flex justify-center">
                      <Input type="radio" name={`adaptation-${index}`} value={value} className="w-4 h-4" />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationship-details">人間関係の詳細（プリセプター、同期、先輩との関係）</Label>
              <Textarea 
                id="relationship-details" 
                className="min-h-[80px]"
                placeholder="職場での人間関係の状況、相談できる相手の有無、孤立していないか等を記入"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adaptation-challenges">適応上の課題と対策</Label>
              <Textarea 
                id="adaptation-challenges" 
                className="min-h-[60px]"
                placeholder="現在直面している課題と、それに対する具体的な対策を記入"
              />
            </div>
          </div>

          {/* 2. 看護技術の習得状況（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. 看護技術の習得状況（8分）</h3>
            
            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">基本看護技術チェックリスト</Label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "バイタルサイン測定",
                  "採血・静脈注射",
                  "点滴管理",
                  "服薬管理",
                  "清潔ケア",
                  "排泄ケア",
                  "移動・移乗介助",
                  "記録・報告"
                ].map((skill, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Checkbox id={`skill-${index}`} />
                    <Label htmlFor={`skill-${index}`} className="text-sm flex-1">{skill}</Label>
                    <select className="w-32 text-sm border rounded px-2 py-1">
                      <option value="">習得度</option>
                      <option value="independent">自立</option>
                      <option value="partial">一部介助</option>
                      <option value="supervised">見守り必要</option>
                      <option value="learning">習得中</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skill-priorities">優先的に習得すべき技術（3つまで）</Label>
              <Textarea 
                id="skill-priorities" 
                className="min-h-[60px]"
                placeholder="今後1ヶ月で重点的に習得すべき技術を3つ記入"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="learning-method">効果的な学習方法・研修希望</Label>
              <Textarea 
                id="learning-method" 
                className="min-h-[60px]"
                placeholder="本人に合った学習方法、希望する研修やOJT内容を記入"
              />
            </div>
          </div>

          {/* 3. 心身の健康とワークライフバランス（6分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 心身の健康とワークライフバランス（6分）</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="physical-health">身体的健康状態</Label>
                <RadioGroup defaultValue="">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="phys-excellent" />
                    <Label htmlFor="phys-excellent">非常に良好</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="phys-good" />
                    <Label htmlFor="phys-good">良好</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="average" id="phys-average" />
                    <Label htmlFor="phys-average">普通</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tired" id="phys-tired" />
                    <Label htmlFor="phys-tired">疲れ気味</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="poor" id="phys-poor" />
                    <Label htmlFor="phys-poor">要注意</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mental-health">精神的健康状態</Label>
                <RadioGroup defaultValue="">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="ment-excellent" />
                    <Label htmlFor="ment-excellent">非常に安定</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="ment-good" />
                    <Label htmlFor="ment-good">安定</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="average" id="ment-average" />
                    <Label htmlFor="ment-average">普通</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="stressed" id="ment-stressed" />
                    <Label htmlFor="ment-stressed">ストレスあり</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="poor" id="ment-poor" />
                    <Label htmlFor="ment-poor">要サポート</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">ストレス要因チェック</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "夜勤への適応",
                  "業務量",
                  "時間外勤務",
                  "人間関係",
                  "技術面の不安",
                  "インシデントへの恐れ",
                  "患者対応の困難さ",
                  "プライベートとの両立"
                ].map((factor, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox id={`stress-${index}`} />
                    <Label htmlFor={`stress-${index}`} className="text-sm">{factor}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stress-coping">ストレス対処法・必要なサポート</Label>
              <Textarea 
                id="stress-coping" 
                className="min-h-[60px]"
                placeholder="現在のストレス対処法、必要な支援内容を記入"
              />
            </div>
          </div>

          {/* 4. 目標設定と成長計画（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 目標設定と成長計画（5分）</h3>
            
            <div className="space-y-2">
              <Label htmlFor="month-goal">今後1ヶ月の目標（SMART目標）</Label>
              <Textarea 
                id="month-goal" 
                className="min-h-[60px]"
                placeholder="具体的・測定可能・達成可能・関連性のある・期限付きの目標を記入"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quarter-goal">3ヶ月後の到達目標</Label>
              <Textarea 
                id="quarter-goal" 
                className="min-h-[60px]"
                placeholder="3ヶ月後に期待される成長レベルと具体的な到達目標"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="action-items">具体的なアクションアイテム（箇条書き）</Label>
              <Textarea 
                id="action-items" 
                className="min-h-[80px]"
                placeholder="・目標達成のための具体的な行動
・必要な研修や勉強会
・メンター/プリセプターとの活動
・自己学習計画"
              />
            </div>
          </div>

          {/* 5. フィードバックと励まし（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. フィードバックと励まし（3分）</h3>
            
            <div className="space-y-2">
              <Label htmlFor="positive-feedback">成長が見られた点・褒めるべき点</Label>
              <Textarea 
                id="positive-feedback" 
                className="min-h-[60px]"
                placeholder="具体的な成長ポイント、頑張りが見られた場面を記入"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="encouragement">励ましのメッセージ</Label>
              <Textarea 
                id="encouragement" 
                className="min-h-[60px]"
                placeholder="本人のモチベーション向上につながる前向きなメッセージ"
              />
            </div>
          </div>

          {/* 面談者総合所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者総合所見</h3>
            
            <div className="bg-orange-50 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="overall-progress">総合的な成長度</Label>
                  <RadioGroup defaultValue="">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="excellent" id="prog-excellent" />
                      <Label htmlFor="prog-excellent">期待以上</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="good" id="prog-good" />
                      <Label htmlFor="prog-good">順調</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="average" id="prog-average" />
                      <Label htmlFor="prog-average">標準的</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="slow" id="prog-slow" />
                      <Label htmlFor="prog-slow">やや遅い</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="concern" id="prog-concern" />
                      <Label htmlFor="prog-concern">要注意</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="support-level">必要な支援レベル</Label>
                  <RadioGroup defaultValue="">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="minimal" id="sup-minimal" />
                      <Label htmlFor="sup-minimal">最小限</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="sup-standard" />
                      <Label htmlFor="sup-standard">標準的</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="enhanced" id="sup-enhanced" />
                      <Label htmlFor="sup-enhanced">強化</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="intensive" id="sup-intensive" />
                      <Label htmlFor="sup-intensive">集中的</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="manager-notes">管理者への申し送り事項</Label>
                <Textarea 
                  id="manager-notes" 
                  className="min-h-[80px]"
                  placeholder="看護師長、教育担当者への重要な申し送り事項、配慮事項等"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="follow-up-plan">フォローアップ計画</Label>
                <Textarea 
                  id="follow-up-plan" 
                  className="min-h-[60px]"
                  placeholder="次回面談までのフォロー体制、チェックポイント等"
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
              <Label htmlFor="next-focus">次回の重点確認事項</Label>
              <Input id="next-focus" placeholder="技術習得、メンタル面等" />
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