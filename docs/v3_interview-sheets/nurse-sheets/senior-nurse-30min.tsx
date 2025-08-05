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

export default function SeniorNurse30MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-2xl">中堅看護師（4-10年目）定期面談シート（30分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              30分の標準面談です。リーダーシップ開発、専門性向上、メンタリング能力を重点的に確認してください。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. リーダーシップ・専門性（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. リーダーシップ・専門性（8分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">現在の役割・能力</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "リーダーシップ",
                "メンタリング能力",
                "専門知識",
                "問題解決力"
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
                <p><span className="text-green-600 font-medium">5：</span>優秀　<span className="text-blue-600 font-medium">4：</span>良好　<span className="text-yellow-600 font-medium">3：</span>標準　<span className="text-orange-600 font-medium">2：</span>要向上　<span className="text-red-600 font-medium">1：</span>要支援</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>現在のリーダー役割・委員会活動</Label>
              <Textarea 
                placeholder="チームリーダー、委員会、プロジェクト、研修担当など具体的に"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>後輩育成・メンタリングの実績</Label>
              <Textarea 
                placeholder="プリセプター経験、指導実績、メンタリングの工夫など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 2. 共通評価項目（10分） - 全世代共通セクション */}
          <div className="space-y-4 bg-green-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 共通評価項目（10分）</h3>
            
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
              
              <RadioGroup>
                <div className="grid grid-cols-6 gap-2 items-center">
                  <span className="text-sm font-medium">現在のモチベーション</span>
                  <div className="flex justify-center">
                    <RadioGroupItem value="motive-5" id="motive-5" className="w-4 h-4" />
                  </div>
                  <div className="flex justify-center">
                    <RadioGroupItem value="motive-4" id="motive-4" className="w-4 h-4" />
                  </div>
                  <div className="flex justify-center">
                    <RadioGroupItem value="motive-3" id="motive-3" className="w-4 h-4" />
                  </div>
                  <div className="flex justify-center">
                    <RadioGroupItem value="motive-2" id="motive-2" className="w-4 h-4" />
                  </div>
                  <div className="flex justify-center">
                    <RadioGroupItem value="motive-1" id="motive-1" className="w-4 h-4" />
                  </div>
                </div>
              </RadioGroup>
              
              {[
                "給与・待遇",
                "勤務シフト",
                "人間関係",
                "上司のサポート",
                "成長機会",
                "職場環境",
                "仕事のやりがい",
                "評価の公正性"
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
                <p><span className="text-green-600 font-medium">5：</span>非常に満足　<span className="text-blue-600 font-medium">4：</span>満足　<span className="text-yellow-600 font-medium">3：</span>普通　<span className="text-orange-600 font-medium">2：</span>やや不満　<span className="text-red-600 font-medium">1：</span>不満</p>
              </div>
            </div>

            {/* 健康・ストレス状況 */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">健康・ストレス状況</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ストレス度（0-100）</Label>
                  <Input type="number" min="0" max="100" placeholder="50" />
                </div>
                <div>
                  <Label>健康状態</Label>
                  <RadioGroup className="flex space-x-2">
                    <div className="flex items-center">
                      <RadioGroupItem value="good" id="health-g" />
                      <Label htmlFor="health-g" className="ml-1">良好</Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="normal" id="health-n" />
                      <Label htmlFor="health-n" className="ml-1">普通</Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="poor" id="health-p" />
                      <Label htmlFor="health-p" className="ml-1">不調</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <div>
                <Label>主なストレス要因（複数選択可）</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center">
                    <Checkbox id="stress-workload" />
                    <Label htmlFor="stress-workload" className="ml-2">業務負荷</Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="stress-relations" />
                    <Label htmlFor="stress-relations" className="ml-2">人間関係</Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="stress-overtime" />
                    <Label htmlFor="stress-overtime" className="ml-2">残業時間</Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="stress-balance" />
                    <Label htmlFor="stress-balance" className="ml-2">家庭との両立</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* エンゲージメント */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">エンゲージメント</Label>
              <RadioGroup className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">この職場を友人に勧めたいか（0-10）</span>
                  <div className="flex space-x-2">
                    {[0,1,2,3,4,5,6,7,8,9,10].map((num) => (
                      <div key={num} className="flex flex-col items-center">
                        <RadioGroupItem value={`nps-${num}`} id={`nps-${num}`} />
                        <Label htmlFor={`nps-${num}`} className="text-xs mt-1">{num}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </RadioGroup>
              
              <RadioGroup>
                <div className="grid grid-cols-6 gap-2 items-center">
                  <span className="text-sm font-medium">1年後の継続意向</span>
                  <div className="flex justify-center">
                    <RadioGroupItem value="continue-5" id="continue-5" className="w-4 h-4" />
                  </div>
                  <div className="flex justify-center">
                    <RadioGroupItem value="continue-4" id="continue-4" className="w-4 h-4" />
                  </div>
                  <div className="flex justify-center">
                    <RadioGroupItem value="continue-3" id="continue-3" className="w-4 h-4" />
                  </div>
                  <div className="flex justify-center">
                    <RadioGroupItem value="continue-2" id="continue-2" className="w-4 h-4" />
                  </div>
                  <div className="flex justify-center">
                    <RadioGroupItem value="continue-1" id="continue-1" className="w-4 h-4" />
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 3. 専門性・キャリア展望（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 専門性・キャリア展望（5分）</h3>
            
            <div className="space-y-2">
              <Label>専門分野での取り組み・資格取得状況</Label>
              <Textarea 
                placeholder="認定看護師、専門看護師、その他資格の取得状況や計画"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>将来のキャリア方向性</Label>
              <RadioGroup className="flex space-x-2">
                <div className="flex items-center">
                  <RadioGroupItem value="management" id="career-m" />
                  <Label htmlFor="career-m" className="ml-1">管理職志向</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="specialist" id="career-s" />
                  <Label htmlFor="career-s" className="ml-1">専門職志向</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="balance" id="career-b" />
                  <Label htmlFor="career-b" className="ml-1">バランス重視</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="education" id="career-e" />
                  <Label htmlFor="career-e" className="ml-1">教育・研究</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>研究・学会活動への関心</Label>
              <Textarea 
                placeholder="研究参加、学会発表、論文執筆などの経験や興味"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. 組織貢献・課題（4分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 組織貢献・課題（4分）</h3>
            
            <div className="space-y-2">
              <Label>現在のチーム・病棟への貢献</Label>
              <Textarea 
                placeholder="質改善、業務効率化、チームワーク向上への取り組み"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>現在直面している課題・困難</Label>
              <Textarea 
                placeholder="リーダーシップ、後輩指導、業務負荷などの課題"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織・制度への改善提案</Label>
              <Textarea 
                placeholder="職場環境、業務プロセス、研修制度などへの提案"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 5. 今後の目標（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. 今後の目標（3分）</h3>
            
            <div className="space-y-2">
              <Label>次回面談までの目標（1ヶ月）</Label>
              <Textarea 
                placeholder="リーダーシップ向上、専門性強化、メンタリングスキル向上など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>今年度内の成長目標</Label>
              <Textarea 
                placeholder="管理的役割、専門資格、研究活動など"
                className="min-h-[60px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="next-interview">次回面談予定</Label>
                <Input type="date" id="next-interview" />
              </div>
              <div>
                <Label htmlFor="follow-up">フォローアップ方法</Label>
                <Input type="text" id="follow-up" placeholder="定期確認など" />
              </div>
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>リーダーシップ評価</Label>
                <RadioGroup className="flex space-x-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="leader-e" />
                    <Label htmlFor="leader-e" className="ml-1">優秀</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="leader-g" />
                    <Label htmlFor="leader-g" className="ml-1">良好</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="developing" id="leader-d" />
                    <Label htmlFor="leader-d" className="ml-1">開発中</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>管理職候補</Label>
                <RadioGroup className="flex space-x-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="ready" id="mgmt-r" />
                    <Label htmlFor="mgmt-r" className="ml-1">準備完了</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="potential" id="mgmt-p" />
                    <Label htmlFor="mgmt-p" className="ml-1">候補</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="specialist" id="mgmt-s" />
                    <Label htmlFor="mgmt-s" className="ml-1">専門志向</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>メンタリング能力</Label>
                <RadioGroup className="flex space-x-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="mentor-h" />
                    <Label htmlFor="mentor-h" className="ml-1">高</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="mentor-m" />
                    <Label htmlFor="mentor-m" className="ml-1">中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="developing" id="mentor-d" />
                    <Label htmlFor="mentor-d" className="ml-1">開発中</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <Textarea 
              placeholder="特記事項、育成方針、キャリア開発支援の方向性など"
              className="min-h-[100px]"
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