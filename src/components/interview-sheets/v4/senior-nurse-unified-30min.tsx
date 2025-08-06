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

export default function SeniorNurseUnified30MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-2xl">シニア看護師（11-15年目）定期面談シート（30分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              30分の標準面談です。シニア看護師のリーダーシップ発揮状況とキャリア発展を総合的に評価します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. リーダーシップと組織貢献（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. リーダーシップと組織貢献（8分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">リーダーシップ能力評価</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5:卓越</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4:優秀</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3:良好</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2:要改善</div>
                <div className="bg-red-100 px-2 py-1 rounded">1:不足</div>
              </div>
              
              {[
                "チームリーダーシップ",
                "問題解決・意思決定",
                "後輩指導・育成",
                "業務改善・効率化",
                "部署間調整・連携",
                "プロジェクト推進力"
              ].map((item, index) => (
                <div key={index} className="grid grid-cols-6 gap-2 items-center">
                  <Label className="text-sm">{item}</Label>
                  {[5, 4, 3, 2, 1].map((value) => (
                    <div key={value} className="flex justify-center">
                      <Input type="radio" name={`leadership-${index}`} value={value} className="w-4 h-4" />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="leadership-examples">リーダーシップ発揮の具体例（過去3ヶ月）</Label>
              <Textarea 
                id="leadership-examples" 
                className="min-h-[80px]"
                placeholder="チーム運営、問題解決、業務改善等の具体的な事例"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">組織貢献活動</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "委員会活動への参画",
                  "院内研修の講師担当",
                  "マニュアル・手順書作成",
                  "新人教育プログラム参加",
                  "QI活動・改善提案",
                  "研究・学会発表",
                  "地域連携活動",
                  "その他特別プロジェクト"
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox id={`activity-${index}`} />
                    <Label htmlFor={`activity-${index}`} className="text-sm">{activity}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. 専門性とスキル発展（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. 専門性とスキル発展（7分）</h3>
            
            <div className="bg-green-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">専門スキル・資格</Label>
              <div className="space-y-2">
                <Label htmlFor="specialties">保有専門資格・認定</Label>
                <Textarea 
                  id="specialties" 
                  className="min-h-[60px]"
                  placeholder="認定看護師、専門看護師、その他資格"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="skill-development">取得予定・希望資格</Label>
                <Textarea 
                  id="skill-development" 
                  className="min-h-[60px]"
                  placeholder="今後取得を目指す資格、必要な研修"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="knowledge-sharing">知識・技術の共有活動</Label>
              <Textarea 
                id="knowledge-sharing" 
                className="min-h-[80px]"
                placeholder="勉強会開催、技術指導、ベストプラクティス共有等"
              />
            </div>
          </div>

          {/* 3. キャリアビジョンと目標（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. キャリアビジョンと目標（7分）</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="career-direction">キャリア志向</Label>
                <RadioGroup defaultValue="">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="management" id="career-management" />
                    <Label htmlFor="career-management">管理職（師長・主任）</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="clinical" id="career-clinical" />
                    <Label htmlFor="career-clinical">臨床スペシャリスト</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="education" id="career-education" />
                    <Label htmlFor="career-education">教育・指導職</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="general" id="career-general" />
                    <Label htmlFor="career-general">ジェネラリスト</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">目標達成時期</Label>
                <RadioGroup defaultValue="">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1year" id="timeline-1year" />
                    <Label htmlFor="timeline-1year">1年以内</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2-3years" id="timeline-2-3years" />
                    <Label htmlFor="timeline-2-3years">2-3年以内</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5years" id="timeline-5years" />
                    <Label htmlFor="timeline-5years">5年以内</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="undecided" id="timeline-undecided" />
                    <Label htmlFor="timeline-undecided">未定</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="career-goals">中長期キャリア目標（3-5年）</Label>
              <Textarea 
                id="career-goals" 
                className="min-h-[80px]"
                placeholder="具体的なポジション、役割、達成したい成果"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="development-plan">能力開発計画</Label>
              <Textarea 
                id="development-plan" 
                className="min-h-[80px]"
                placeholder="必要なスキル、経験、研修、ローテーション希望等"
              />
            </div>
          </div>

          {/* 4. 後輩育成とメンタリング（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 後輩育成とメンタリング（5分）</h3>
            
            <div className="bg-yellow-50 p-4 rounded-lg space-y-3">
              <div className="space-y-2">
                <Label htmlFor="mentoring-activities">現在の指導・育成活動</Label>
                <Textarea 
                  id="mentoring-activities" 
                  className="min-h-[60px]"
                  placeholder="プリセプター、メンター、教育担当等の役割"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>指導対象人数</Label>
                  <Input type="number" placeholder="人数" />
                </div>
                <div className="space-y-2">
                  <Label>指導頻度</Label>
                  <select className="w-full px-3 py-2 border rounded-md">
                    <option value="">選択</option>
                    <option value="daily">毎日</option>
                    <option value="weekly">週数回</option>
                    <option value="monthly">月数回</option>
                    <option value="occasional">随時</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mentoring-challenges">育成上の課題・工夫点</Label>
              <Textarea 
                id="mentoring-challenges" 
                className="min-h-[60px]"
                placeholder="効果的だった指導方法、難しさを感じる点等"
              />
            </div>
          </div>

          {/* 5. ワークライフバランスと健康（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. ワークライフバランスと健康（3分）</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>残業時間（月平均）</Label>
                <Input type="text" placeholder="時間" />
              </div>
              <div className="space-y-2">
                <Label>有給取得率</Label>
                <Input type="text" placeholder="%" />
              </div>
              <div className="space-y-2">
                <Label>健康状態</Label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option value="">選択</option>
                  <option value="excellent">良好</option>
                  <option value="good">概ね良好</option>
                  <option value="fair">普通</option>
                  <option value="poor">要注意</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="work-life-balance">ワークライフバランスの課題と希望</Label>
              <Textarea 
                id="work-life-balance" 
                className="min-h-[60px]"
                placeholder="勤務体制、業務量、プライベートとの両立等"
              />
            </div>
          </div>

          {/* 面談者総合所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者総合所見</h3>
            
            <div className="bg-orange-50 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="performance-rating">総合パフォーマンス評価</Label>
                  <RadioGroup defaultValue="">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="exceptional" id="perf-exceptional" />
                      <Label htmlFor="perf-exceptional">卓越している</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="exceeds" id="perf-exceeds" />
                      <Label htmlFor="perf-exceeds">期待を上回る</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="meets" id="perf-meets" />
                      <Label htmlFor="perf-meets">期待通り</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="developing" id="perf-developing" />
                      <Label htmlFor="perf-developing">成長途上</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="potential">将来性・ポテンシャル</Label>
                  <RadioGroup defaultValue="">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="pot-high" />
                      <Label htmlFor="pot-high">高い</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderate" id="pot-moderate" />
                      <Label htmlFor="pot-moderate">標準的</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="developing" id="pot-developing" />
                      <Label htmlFor="pot-developing">育成が必要</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unclear" id="pot-unclear" />
                      <Label htmlFor="pot-unclear">判断保留</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recommendations">推奨事項・今後の育成方針</Label>
                <Textarea 
                  id="recommendations" 
                  className="min-h-[80px]"
                  placeholder="昇進・昇格推薦、役割拡大、研修推奨等"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="action-items">フォローアップ事項</Label>
                <Textarea 
                  id="action-items" 
                  className="min-h-[60px]"
                  placeholder="次回面談までの確認事項、支援内容"
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
              <Label htmlFor="next-focus">重点確認テーマ</Label>
              <Input id="next-focus" placeholder="キャリア、リーダーシップ等" />
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