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

export default function ChiefNurseUnified30MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-indigo-50">
          <CardTitle className="text-2xl">病棟師長 定期面談シート（30分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>役職経験：＿＿年＿＿ヶ月　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              30分の標準面談です。病棟師長の管理能力と部署運営を総合的に評価します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. チーム管理とリーダーシップ（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. チーム管理とリーダーシップ（8分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">管理能力評価</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5:卓越</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4:優秀</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3:良好</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2:要改善</div>
                <div className="bg-red-100 px-2 py-1 rounded">1:不足</div>
              </div>
              
              {[
                "チーム運営能力",
                "スタッフマネジメント",
                "業務配分・調整",
                "問題解決・意思決定",
                "コミュニケーション",
                "リーダーシップ発揮"
              ].map((item, index) => (
                <div key={index} className="grid grid-cols-6 gap-2 items-center">
                  <Label className="text-sm">{item}</Label>
                  {[5, 4, 3, 2, 1].map((value) => (
                    <div key={value} className="flex justify-center">
                      <Input type="radio" name={`management-${index}`} value={value} className="w-4 h-4" />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-status">チーム状況（人員構成、モラル、課題）</Label>
              <Textarea 
                id="team-status" 
                className="min-h-[80px]"
                placeholder="チーム人数、スキルレベル、雰囲気、問題点等"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">管理業務実施状況</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "勤務表作成",
                  "スタッフ面談実施",
                  "新人教育計画",
                  "業務改善活動",
                  "インシデント対応",
                  "会議・委員会参加",
                  "部署間調整",
                  "師長補佐業務"
                ].map((task, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox id={`task-${index}`} />
                    <Label htmlFor={`task-${index}`} className="text-sm">{task}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. スタッフ育成と指導（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. スタッフ育成と指導（7分）</h3>
            
            <div className="bg-green-50 p-4 rounded-lg space-y-3">
              <div className="space-y-2">
                <Label htmlFor="staff-development">スタッフ個別育成状況</Label>
                <Textarea 
                  id="staff-development" 
                  className="min-h-[60px]"
                  placeholder="問題スタッフ、成長著しいスタッフ、育成計画等"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>個別面談実施数（月）</Label>
                  <Input type="number" placeholder="回" />
                </div>
                <div className="space-y-2">
                  <Label>指導困難ケース数</Label>
                  <Input type="number" placeholder="件" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coaching-approach">指導方針と工夫</Label>
              <Textarea 
                id="coaching-approach" 
                className="min-h-[60px]"
                placeholder="効果的だった指導方法、困難事例への対応等"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="education-initiatives">教育・研修企画</Label>
              <Textarea 
                id="education-initiatives" 
                className="min-h-[60px]"
                placeholder="部署内勉強会、スキルアップ研修等の企画・実施"
              />
            </div>
          </div>

          {/* 3. 業務改善と品質管理（6分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 業務改善と品質管理（6分）</h3>
            
            <div className="space-y-2">
              <Label htmlFor="improvement-projects">実施中の改善プロジェクト</Label>
              <Textarea 
                id="improvement-projects" 
                className="min-h-[60px]"
                placeholder="業務効率化、質向上、コスト削減等の取り組み"
              />
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">品質指標</Label>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>インシデント数（月）</Label>
                  <Input type="number" placeholder="件" />
                </div>
                <div className="space-y-2">
                  <Label>患者満足度</Label>
                  <Input type="text" placeholder="%" />
                </div>
                <div className="space-y-2">
                  <Label>業務効率改善</Label>
                  <select className="w-full px-3 py-2 border rounded-md">
                    <option value="">選択</option>
                    <option value="improved">改善</option>
                    <option value="maintained">維持</option>
                    <option value="declined">低下</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quality-challenges">品質管理上の課題</Label>
              <Textarea 
                id="quality-challenges" 
                className="min-h-[60px]"
                placeholder="リスク要因、改善必要領域、対策案等"
              />
            </div>
          </div>

          {/* 4. 上位管理者との連携（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 上位管理者との連携（5分）</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="upward-communication">師長への報告・相談</Label>
                <RadioGroup defaultValue="">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="proactive" id="up-proactive" />
                    <Label htmlFor="up-proactive">積極的</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="appropriate" id="up-appropriate" />
                    <Label htmlFor="up-appropriate">適切</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="passive" id="up-passive" />
                    <Label htmlFor="up-passive">消極的</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="insufficient" id="up-insufficient" />
                    <Label htmlFor="up-insufficient">不足</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="authority-balance">権限と責任のバランス</Label>
                <RadioGroup defaultValue="">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="appropriate" id="auth-appropriate" />
                    <Label htmlFor="auth-appropriate">適切</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="more-authority" id="auth-more" />
                    <Label htmlFor="auth-more">権限不足</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="more-support" id="auth-support" />
                    <Label htmlFor="auth-support">サポート不足</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="overloaded" id="auth-overloaded" />
                    <Label htmlFor="auth-overloaded">負荷過多</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="management-needs">管理業務上の要望・必要事項</Label>
              <Textarea 
                id="management-needs" 
                className="min-h-[60px]"
                placeholder="権限拡大、研修機会、上位サポート等"
              />
            </div>
          </div>

          {/* 5. キャリア展望と自己成長（4分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. キャリア展望と自己成長（4分）</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="career-goal">今後のキャリア目標</Label>
                <RadioGroup defaultValue="">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nurse-manager" id="career-manager" />
                    <Label htmlFor="career-manager">師長を目指す</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="continue-chief" id="career-chief" />
                    <Label htmlFor="career-chief">主任を極める</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="specialist" id="career-specialist" />
                    <Label htmlFor="career-specialist">専門分野へ</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="undecided" id="career-undecided" />
                    <Label htmlFor="career-undecided">検討中</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>管理者研修受講状況</Label>
                <Textarea 
                  className="min-h-[60px]"
                  placeholder="受講済み研修、予定研修"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skill-gaps">強化すべきスキル・知識</Label>
              <Textarea 
                id="skill-gaps" 
                className="min-h-[60px]"
                placeholder="自己評価による不足スキル、学習計画"
              />
            </div>
          </div>

          {/* 面談者総合所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者総合所見</h3>
            
            <div className="bg-orange-50 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="performance-rating">総合評価</Label>
                  <RadioGroup defaultValue="">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="exceptional" id="perf-exceptional" />
                      <Label htmlFor="perf-exceptional">卓越</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="exceeds" id="perf-exceeds" />
                      <Label htmlFor="perf-exceeds">期待以上</Label>
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
                  <Label htmlFor="promotion-readiness">昇進準備度</Label>
                  <RadioGroup defaultValue="">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ready" id="promo-ready" />
                      <Label htmlFor="promo-ready">準備完了</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1-2years" id="promo-1-2years" />
                      <Label htmlFor="promo-1-2years">1-2年後</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="developing" id="promo-developing" />
                      <Label htmlFor="promo-developing">育成必要</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not-applicable" id="promo-na" />
                      <Label htmlFor="promo-na">該当なし</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="development-plan">育成・支援計画</Label>
                <Textarea 
                  id="development-plan" 
                  className="min-h-[80px]"
                  placeholder="強化領域、研修推奨、メンタリング、次期役割等"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="action-items">フォローアップ事項</Label>
                <Textarea 
                  id="action-items" 
                  className="min-h-[60px]"
                  placeholder="次回までの確認事項、支援内容"
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
              <Input id="next-focus" placeholder="チーム運営、昇進準備等" />
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