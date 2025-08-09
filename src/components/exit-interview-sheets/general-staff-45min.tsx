'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { AlertCircle, LogOut, MessageSquare, Target } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function GeneralStaff45MinExitInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-amber-50">
          <div className="flex items-center gap-2">
            <LogOut className="h-6 w-6 text-amber-600" />
            <CardTitle className="text-2xl">一般職員 退職面談シート（45分版）</CardTitle>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　退職者：＿＿＿＿＿＿＿＿</p>
            <p>所属部署：＿＿＿＿＿＿　在職期間：＿＿年＿＿ヶ月</p>
            <p>退職予定日：＿＿＿＿年＿＿月＿＿日</p>
          </div>
          <Alert className="mt-3 bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              45分の詳細面談です。退職理由の深掘りと、職場環境の詳細な評価を通じて、
              組織の課題を明確化し、改善につなげます。じっくりとお話を伺ってください。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 1. 退職理由の詳細確認（15分） */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-amber-600" />
              <h3 className="font-bold text-lg border-b pb-2 flex-1">1. 退職理由の詳細確認（15分）</h3>
            </div>
            
            <div className="space-y-3">
              <Label>主な退職理由（複数選択可）</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "他社への転職",
                  "キャリアチェンジ",
                  "給与・賞与への不満",
                  "労働時間・残業",
                  "休暇取得の困難",
                  "人間関係のストレス",
                  "上司との関係",
                  "仕事内容への不満",
                  "成長機会の不足",
                  "評価への不満",
                  "職場環境・設備",
                  "通勤の負担",
                  "健康上の理由",
                  "家族の事情",
                  "結婚・出産・育児",
                  "介護",
                  "進学・留学",
                  "その他"
                ].map((reason) => (
                  <div key={reason} className="flex items-center space-x-2">
                    <Checkbox id={reason} />
                    <Label htmlFor={reason} className="text-sm font-normal">{reason}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>最も大きな退職理由（詳細）</Label>
              <Textarea 
                placeholder="退職を決意した最も重要な理由と、その具体的な状況や経緯を教えてください"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>退職を考え始めた時期ときっかけ</Label>
              <Textarea 
                placeholder="いつ頃から退職を考え始めたか、きっかけとなった出来事があれば"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>退職を思い留まる可能性があった条件</Label>
              <Textarea 
                placeholder="どのような改善や条件があれば、継続して働くことを考えられたか"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. 職場環境の詳細評価（12分） */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-lg border-b pb-2 flex-1">2. 職場環境の詳細評価（12分）</h3>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">各項目の満足度評価（5段階）</Label>
              <div className="space-y-2">
                {[
                  { category: "業務関連", items: [
                    "仕事の内容・やりがい",
                    "業務量・負荷",
                    "裁量権・自主性",
                    "スキル向上機会"
                  ]},
                  { category: "待遇・制度", items: [
                    "基本給与",
                    "賞与・手当",
                    "昇給・昇進",
                    "福利厚生"
                  ]},
                  { category: "労働環境", items: [
                    "労働時間",
                    "休暇取得",
                    "職場の設備",
                    "安全・衛生"
                  ]},
                  { category: "人間関係", items: [
                    "上司との関係",
                    "同僚との関係",
                    "チームワーク",
                    "コミュニケーション"
                  ]}
                ].map(({ category, items }) => (
                  <div key={category} className="space-y-1">
                    <p className="text-sm font-semibold text-gray-700">{category}</p>
                    {items.map((item) => (
                      <div key={item} className="grid grid-cols-7 gap-1 items-center">
                        <span className="text-xs col-span-2">{item}</span>
                        <RadioGroup orientation="horizontal" className="col-span-5">
                          <div className="flex gap-2">
                            {[5, 4, 3, 2, 1].map((value) => (
                              <div key={value} className="flex items-center">
                                <RadioGroupItem value={`${item}-${value}`} id={`${item}-${value}`} className="h-3 w-3" />
                                <Label htmlFor={`${item}-${value}`} className="ml-1 text-xs">{value}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-600 mt-2 bg-blue-50 p-2 rounded">
                5: 非常に満足　4: 満足　3: 普通　2: 不満　1: 非常に不満
              </div>
            </div>

            <div className="space-y-2">
              <Label>特に不満だった点（上位3つ）</Label>
              <Textarea 
                placeholder="1.\n2.\n3."
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 3. 良い点と改善提案（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 良い点と改善提案（10分）</h3>
            
            <div className="space-y-2">
              <Label>この職場の良かった点・強み</Label>
              <Textarea 
                placeholder="働いていて良かったこと、組織の強み、継続すべき文化など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>印象に残っている良い経験・思い出</Label>
              <Textarea 
                placeholder="仕事での達成感、チームでの成功体験、感謝されたことなど"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織改善のための具体的提案</Label>
              <Textarea 
                placeholder="こうすればもっと良い職場になる、離職を防げるという具体的なアイデア"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>新入職員へのアドバイス</Label>
              <Textarea 
                placeholder="これから入ってくる人に伝えたいこと、成功するためのコツなど"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. キャリアと成長（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. キャリアと成長（5分）</h3>
            
            <div className="space-y-2">
              <Label>この職場で得られたスキル・経験</Label>
              <Textarea 
                placeholder="身についたスキル、成長できた点、今後に活かせる経験など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>もっと学びたかったこと・経験したかったこと</Label>
              <Textarea 
                placeholder="機会があれば挑戦したかったこと、学びたかったスキルなど"
                className="min-h-[60px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>転職先での役割（差し支えない範囲で）</Label>
                <Input placeholder="職種・ポジション" />
              </div>
              <div className="space-y-2">
                <Label>今後のキャリアプラン</Label>
                <Input placeholder="目指す方向性" />
              </div>
            </div>
          </div>

          {/* 5. 最終確認（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. 最終確認（3分）</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>引き継ぎ状況</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="complete" id="complete" />
                    <Label htmlFor="complete">完了済み</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ongoing" id="ongoing" />
                    <Label htmlFor="ongoing">進行中</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="scheduled" id="scheduled" />
                    <Label htmlFor="scheduled">予定あり</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>この職場を他の人に勧めるか</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes-strongly" id="yes-strongly" />
                    <Label htmlFor="yes-strongly">積極的に勧める</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes" />
                    <Label htmlFor="yes">勧める</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="neutral" id="neutral" />
                    <Label htmlFor="neutral">どちらでもない</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no">勧めない</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label>最後に伝えたいこと</Label>
              <Textarea 
                placeholder="組織や仲間へのメッセージ、感謝の言葉など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 面談者記入欄 */}
          <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg">面談者記入欄</h3>
            
            <div className="space-y-2">
              <Label>退職理由の分析</Label>
              <Textarea 
                placeholder="表面的理由と本質的理由、防げた可能性など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>重要な改善ポイント</Label>
              <Textarea 
                placeholder="組織として早急に対応すべき課題"
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>退職による影響度</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high-impact" id="high-impact" />
                    <Label htmlFor="high-impact">大（業務に大きな影響）</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium-impact" id="medium-impact" />
                    <Label htmlFor="medium-impact">中（一定の影響あり）</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low-impact" id="low-impact" />
                    <Label htmlFor="low-impact">小（影響は限定的）</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>フォローアップ</Label>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="urgent-action" />
                    <Label htmlFor="urgent-action" className="text-sm font-normal">
                      緊急対応要
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="hr-review" />
                    <Label htmlFor="hr-review" className="text-sm font-normal">
                      人事部検討要
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="dept-meeting" />
                    <Label htmlFor="dept-meeting" className="text-sm font-normal">
                      部門会議で共有
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="exit-pattern" />
                    <Label htmlFor="exit-pattern" className="text-sm font-normal">
                      類似退職パターン
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>今後のアクション</Label>
              <Textarea 
                placeholder="具体的な改善施策、予防策など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 送信ボタン */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button variant="outline">一時保存</Button>
            <Button className="bg-amber-600 hover:bg-amber-700">面談記録を提出</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}