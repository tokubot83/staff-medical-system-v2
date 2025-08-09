'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { AlertCircle, LogOut } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function GeneralStaff30MinExitInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-orange-50">
          <div className="flex items-center gap-2">
            <LogOut className="h-6 w-6 text-orange-600" />
            <CardTitle className="text-2xl">一般職員 退職面談シート（30分版）</CardTitle>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　退職者：＿＿＿＿＿＿＿＿</p>
            <p>所属部署：＿＿＿＿＿＿　在職期間：＿＿年＿＿ヶ月</p>
            <p>退職予定日：＿＿＿＿年＿＿月＿＿日</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              30分の標準面談です。退職理由と職場環境への率直な意見を伺い、組織改善に活かします。
              リラックスした雰囲気で、本音を話していただけるよう配慮してください。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 1. 退職理由の確認（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 退職理由の確認（10分）</h3>
            
            <div className="space-y-3">
              <Label>主な退職理由（最も当てはまるもの3つまで）</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "転職・キャリアチェンジ",
                  "給与・待遇",
                  "労働時間・シフト",
                  "人間関係",
                  "仕事内容",
                  "職場環境",
                  "通勤・立地",
                  "健康上の理由",
                  "家族の事情",
                  "結婚・出産・育児",
                  "進学・資格取得",
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
              <Label>退職理由の詳細</Label>
              <Textarea 
                placeholder="退職を決めた具体的な理由や背景をお聞かせください"
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>退職後の予定</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="job-change" id="job-change" />
                    <Label htmlFor="job-change" className="text-sm">転職</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="study" id="study" />
                    <Label htmlFor="study" className="text-sm">進学・勉強</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rest" id="rest" />
                    <Label htmlFor="rest" className="text-sm">休養</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="undecided" id="undecided" />
                    <Label htmlFor="undecided" className="text-sm">未定</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="text-sm">その他</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>転職先（差し支えない範囲で）</Label>
                <Input placeholder="業界・職種など" />
              </div>
            </div>
          </div>

          {/* 2. 職場環境の評価（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. 職場環境の評価（10分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">満足度評価（5段階）</Label>
              <div className="space-y-2">
                {[
                  "仕事内容・やりがい",
                  "給与・待遇",
                  "労働時間・休暇",
                  "職場の人間関係",
                  "上司のサポート",
                  "教育・研修制度",
                  "職場環境・設備",
                  "福利厚生"
                ].map((item) => (
                  <div key={item} className="grid grid-cols-6 gap-2 items-center">
                    <span className="text-sm col-span-2">{item}</span>
                    <RadioGroup orientation="horizontal" className="col-span-4">
                      <div className="flex gap-3">
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
              <div className="text-xs text-gray-600 mt-2">
                5: 非常に満足　4: 満足　3: 普通　2: 不満　1: 非常に不満
              </div>
            </div>

            <div className="space-y-2">
              <Label>職場の良かった点</Label>
              <Textarea 
                placeholder="働いていて良かったと感じた点、継続してほしい取り組みなど"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>改善してほしかった点</Label>
              <Textarea 
                placeholder="もっとこうだったら良かったと思う点、改善提案など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 3. 今後へのアドバイス（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 今後へのアドバイス（7分）</h3>
            
            <div className="space-y-2">
              <Label>同じ部署で働く仲間へのメッセージ</Label>
              <Textarea 
                placeholder="後輩や同僚へ伝えたいこと、アドバイスなど"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織をより良くするための提案</Label>
              <Textarea 
                placeholder="職場環境、制度、文化など、改善のアイデアがあれば"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-3">
              <Label>この職場を他の人に勧めますか？</Label>
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="strongly-recommend" id="strongly-recommend" />
                  <Label htmlFor="strongly-recommend">強く勧める</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="recommend" id="recommend" />
                  <Label htmlFor="recommend">勧める</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="neutral" id="neutral" />
                  <Label htmlFor="neutral">どちらとも言えない</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-recommend" id="not-recommend" />
                  <Label htmlFor="not-recommend">勧めない</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 4. 引き継ぎ確認（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 引き継ぎ確認（3分）</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>業務引き継ぎ</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="completed" id="completed" />
                    <Label htmlFor="completed" className="text-sm">完了</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="in-progress" id="in-progress" />
                    <Label htmlFor="in-progress" className="text-sm">進行中</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not-started" id="not-started" />
                    <Label htmlFor="not-started" className="text-sm">未着手</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>引き継ぎ相手</Label>
                <Input placeholder="氏名・部署" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>その他連絡事項</Label>
              <Textarea 
                placeholder="返却物、手続き、その他伝達事項など"
                className="min-h-[50px]"
              />
            </div>
          </div>

          {/* 面談者記入欄 */}
          <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg">面談者記入欄</h3>
            
            <div className="space-y-2">
              <Label>面談の要約</Label>
              <Textarea 
                placeholder="退職理由の要点、重要な指摘事項など"
                className="min-h-[60px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>対応優先度</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high">高（組織的対応要）</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">中（部門内対応）</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low">低（参考情報）</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>共有先</Label>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="hr" />
                    <Label htmlFor="hr" className="text-sm font-normal">人事部</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="manager" />
                    <Label htmlFor="manager" className="text-sm font-normal">部門長</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="team" />
                    <Label htmlFor="team" className="text-sm font-normal">チーム</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>フォローアップ事項</Label>
              <Textarea 
                placeholder="組織として対応すべき課題、改善アクションなど"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 送信ボタン */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button variant="outline">一時保存</Button>
            <Button className="bg-orange-600 hover:bg-orange-700">面談記録を提出</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}