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

export default function LeaderNurseUnified30MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-emerald-50">
          <CardTitle className="text-2xl">主任看護師 定期面談シート（30分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>主任経験：＿＿年＿＿ヶ月　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              30分の標準面談です。主任看護師の能力発揮状況と成長を総合的に評価します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. リーダー業務の実践（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. リーダー業務の実践（8分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">リーダー業務能力評価</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5:卓越</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4:優秀</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3:良好</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2:要改善</div>
                <div className="bg-red-100 px-2 py-1 rounded">1:不足</div>
              </div>
              
              {[
                "業務全体の把握",
                "優先順位の判断",
                "指示・委譲の適切性",
                "緊急時の対応",
                "多職種連携",
                "問題解決能力"
              ].map((item, index) => (
                <div key={index} className="grid grid-cols-6 gap-2 items-center">
                  <Label className="text-sm">{item}</Label>
                  {[5, 4, 3, 2, 1].map((value) => (
                    <div key={value} className="flex justify-center">
                      <Input type="radio" name={`leader-skill-${index}`} value={value} className="w-4 h-4" />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">リーダー業務実施状況</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "日勤リーダー",
                  "夜勤リーダー",
                  "患者割り振り",
                  "申し送り実施",
                  "医師回診対応",
                  "緊急入院対応",
                  "インシデント対応",
                  "新人・学生指導"
                ].map((task, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox id={`task-${index}`} />
                    <Label htmlFor={`task-${index}`} className="text-sm">{task}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="leadership-examples">リーダーシップ発揮の具体例</Label>
              <Textarea 
                id="leadership-examples" 
                className="min-h-[80px]"
                placeholder="困難な状況での対応、チーム調整の成功例等"
              />
            </div>
          </div>

          {/* 2. チーム運営とコミュニケーション（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. チーム運営とコミュニケーション（7分）</h3>
            
            <div className="bg-green-50 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>チームメンバー数</Label>
                  <Input type="number" placeholder="人" />
                </div>
                <div className="space-y-2">
                  <Label>リーダー頻度</Label>
                  <select className="w-full px-3 py-2 border rounded-md">
                    <option value="">選択</option>
                    <option value="daily">ほぼ毎日</option>
                    <option value="3-4week">週3-4回</option>
                    <option value="1-2week">週1-2回</option>
                    <option value="occasional">時々</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-management">チーム運営の工夫と成果</Label>
              <Textarea 
                id="team-management" 
                className="min-h-[60px]"
                placeholder="業務分担の工夫、チームワーク向上策、効率化等"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="communication-skills">コミュニケーションの課題と対策</Label>
              <Textarea 
                id="communication-skills" 
                className="min-h-[60px]"
                placeholder="スタッフ間調整、医師連携、他部署交渉等"
              />
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">関係部署との連携</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { dept: "医師", name: "doctor" },
                  { dept: "薬剤部", name: "pharmacy" },
                  { dept: "検査部", name: "lab" },
                  { dept: "リハビリ", name: "rehab" },
                  { dept: "栄養部", name: "nutrition" },
                  { dept: "事務部", name: "admin" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <Label className="text-sm">{item.dept}</Label>
                    <select className="w-24 text-sm border rounded px-2 py-1">
                      <option value="">評価</option>
                      <option value="excellent">優秀</option>
                      <option value="good">良好</option>
                      <option value="fair">普通</option>
                      <option value="poor">要改善</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. スタッフ指導と育成（6分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. スタッフ指導と育成（6分）</h3>
            
            <div className="space-y-2">
              <Label htmlFor="mentoring-activities">後輩指導・育成活動</Label>
              <Textarea 
                id="mentoring-activities" 
                className="min-h-[60px]"
                placeholder="新人指導、技術指導、相談対応等"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teaching-style">指導スタイル</Label>
                <RadioGroup defaultValue="">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="supportive" id="style-supportive" />
                    <Label htmlFor="style-supportive">支援的</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="directive" id="style-directive" />
                    <Label htmlFor="style-directive">指示的</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="collaborative" id="style-collaborative" />
                    <Label htmlFor="style-collaborative">協働的</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delegative" id="style-delegative" />
                    <Label htmlFor="style-delegative">委任的</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="teaching-confidence">指導への自信</Label>
                <RadioGroup defaultValue="">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very-confident" id="conf-very" />
                    <Label htmlFor="conf-very">非常に自信あり</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="confident" id="conf-confident" />
                    <Label htmlFor="conf-confident">自信あり</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="somewhat" id="conf-somewhat" />
                    <Label htmlFor="conf-somewhat">やや不安</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lacking" id="conf-lacking" />
                    <Label htmlFor="conf-lacking">自信なし</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="development-needs">指導力向上のニーズ</Label>
              <Textarea 
                id="development-needs" 
                className="min-h-[60px]"
                placeholder="コーチング研修、ファシリテーション技術等"
              />
            </div>
          </div>

          {/* 4. キャリア発展と目標（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. キャリア発展と目標（5分）</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="career-aspiration">今後のキャリア希望</Label>
                <RadioGroup defaultValue="">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="chief" id="career-chief" />
                    <Label htmlFor="career-chief">主任を目指す</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="specialist" id="career-specialist" />
                    <Label htmlFor="career-specialist">専門性を深める</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="educator" id="career-educator" />
                    <Label htmlFor="career-educator">教育分野へ</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="current" id="career-current" />
                    <Label htmlFor="career-current">現状継続</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="readiness">次のステップへの準備</Label>
                <RadioGroup defaultValue="">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ready" id="step-ready" />
                    <Label htmlFor="step-ready">準備できている</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1year" id="step-1year" />
                    <Label htmlFor="step-1year">1年後</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2-3years" id="step-2-3years" />
                    <Label htmlFor="step-2-3years">2-3年後</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not-yet" id="step-not-yet" />
                    <Label htmlFor="step-not-yet">まだ先</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="development-plan">能力開発計画</Label>
              <Textarea 
                id="development-plan" 
                className="min-h-[60px]"
                placeholder="取得したい資格、参加したい研修、経験したい業務等"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goals">短期・中期目標</Label>
              <Textarea 
                id="goals" 
                className="min-h-[60px]"
                placeholder="3ヶ月後、1年後の目標"
              />
            </div>
          </div>

          {/* 5. ワークライフバランス（4分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. ワークライフバランス（4分）</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>残業時間（月）</Label>
                <Input type="text" placeholder="時間" />
              </div>
              <div className="space-y-2">
                <Label>リーダー業務負担</Label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option value="">選択</option>
                  <option value="appropriate">適正</option>
                  <option value="slightly-heavy">やや重い</option>
                  <option value="heavy">重い</option>
                  <option value="excessive">過重</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>健康状態</Label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option value="">選択</option>
                  <option value="excellent">良好</option>
                  <option value="good">概ね良好</option>
                  <option value="tired">疲れ気味</option>
                  <option value="concerning">要注意</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="work-life-balance">プライベートとの両立</Label>
              <Textarea 
                id="work-life-balance" 
                className="min-h-[60px]"
                placeholder="家庭との両立、自己研鑽時間、休息の確保等"
              />
            </div>
          </div>

          {/* 面談者総合所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者総合所見</h3>
            
            <div className="bg-orange-50 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="overall-evaluation">総合評価</Label>
                  <RadioGroup defaultValue="">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="exceptional" id="eval-exceptional" />
                      <Label htmlFor="eval-exceptional">非常に優秀</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="exceeds" id="eval-exceeds" />
                      <Label htmlFor="eval-exceeds">期待以上</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="meets" id="eval-meets" />
                      <Label htmlFor="eval-meets">期待通り</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="developing" id="eval-developing" />
                      <Label htmlFor="eval-developing">成長中</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="promotion-potential">昇進可能性</Label>
                  <RadioGroup defaultValue="">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="immediate" id="promo-immediate" />
                      <Label htmlFor="promo-immediate">すぐに可能</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1year" id="promo-1year" />
                      <Label htmlFor="promo-1year">1年以内</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2-3years" id="promo-2-3years" />
                      <Label htmlFor="promo-2-3years">2-3年後</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not-yet" id="promo-not-yet" />
                      <Label htmlFor="promo-not-yet">まだ時期尚早</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="strengths-weaknesses">強みと改善点</Label>
                <Textarea 
                  id="strengths-weaknesses" 
                  className="min-h-[80px]"
                  placeholder="リーダーとしての強み、さらに伸ばすべき能力"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="support-plan">今後の育成・支援方針</Label>
                <Textarea 
                  id="support-plan" 
                  className="min-h-[60px]"
                  placeholder="研修推奨、役割拡大、メンタリング等"
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
              <Label htmlFor="next-focus">重点テーマ</Label>
              <Input id="next-focus" placeholder="リーダー実践、キャリア等" />
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