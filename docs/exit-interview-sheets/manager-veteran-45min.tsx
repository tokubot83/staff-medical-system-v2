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

export default function ManagerVeteran45MinExitInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-red-50">
          <div className="flex items-center gap-2">
            <LogOut className="h-6 w-6 text-red-600" />
            <CardTitle className="text-2xl">役職者・ベテラン職員 退職面談シート（45分版）</CardTitle>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　退職者：＿＿＿＿＿＿＿＿</p>
            <p>役職・職種：＿＿＿＿＿＿　在職期間：＿＿年＿＿ヶ月</p>
            <p>退職予定日：＿＿＿＿年＿＿月＿＿日</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              役職者・ベテラン職員の退職は組織への影響が大きいため、詳細な聞き取りと引き継ぎ確認を行います。
              建設的な雰囲気で、率直な意見を伺い、組織改善につなげてください。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 1. 退職理由の詳細確認（15分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 退職理由の詳細確認（15分）</h3>
            
            <div className="space-y-3">
              <Label>主な退職理由（複数選択可）</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "キャリアアップ・専門性追求",
                  "他施設への転職",
                  "給与・待遇面の不満",
                  "ワークライフバランス",
                  "人間関係・職場環境",
                  "組織運営・経営方針への不満",
                  "業務負荷・責任の重さ",
                  "評価制度への不満",
                  "健康上の理由",
                  "家族の事情",
                  "定年・早期退職",
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
              <Label>最も大きな退職理由の詳細</Label>
              <Textarea 
                placeholder="退職を決意した最も大きな要因と、その背景・経緯を具体的にお聞かせください"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>退職を思い留まる可能性があった条件</Label>
              <Textarea 
                placeholder="どのような条件や改善があれば、継続勤務を検討できたか"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. 組織・業務への評価（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. 組織・業務への評価（10分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">各項目の満足度評価</Label>
              <div className="space-y-2">
                {[
                  { item: "給与・福利厚生", id: "salary" },
                  { item: "労働環境・設備", id: "environment" },
                  { item: "人間関係・チームワーク", id: "teamwork" },
                  { item: "上司のマネジメント", id: "management" },
                  { item: "キャリア開発・成長機会", id: "career" },
                  { item: "組織の経営方針・ビジョン", id: "vision" },
                  { item: "評価制度・昇進機会", id: "evaluation" },
                  { item: "業務内容・やりがい", id: "job" },
                  { item: "ワークライフバランス", id: "balance" },
                  { item: "組織文化・風土", id: "culture" }
                ].map(({ item, id }) => (
                  <div key={id} className="grid grid-cols-6 gap-2 items-center">
                    <span className="text-sm col-span-2">{item}</span>
                    <RadioGroup orientation="horizontal" className="col-span-4">
                      <div className="flex gap-4">
                        <div className="flex items-center">
                          <RadioGroupItem value={`${id}-5`} id={`${id}-5`} />
                          <Label htmlFor={`${id}-5`} className="ml-1 text-xs">非常に満足</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value={`${id}-4`} id={`${id}-4`} />
                          <Label htmlFor={`${id}-4`} className="ml-1 text-xs">満足</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value={`${id}-3`} id={`${id}-3`} />
                          <Label htmlFor={`${id}-3`} className="ml-1 text-xs">普通</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value={`${id}-2`} id={`${id}-2`} />
                          <Label htmlFor={`${id}-2`} className="ml-1 text-xs">不満</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value={`${id}-1`} id={`${id}-1`} />
                          <Label htmlFor={`${id}-1`} className="ml-1 text-xs">非常に不満</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>特に改善が必要と感じた点</Label>
              <Textarea 
                placeholder="組織運営、制度、文化など、改善すべき具体的な課題"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 3. 良かった点・組織の強み（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 良かった点・組織の強み（5分）</h3>
            
            <div className="space-y-2">
              <Label>在職中に良かったと感じた点</Label>
              <Textarea 
                placeholder="組織の強み、良い文化、継続すべき取り組みなど"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>印象に残っている良い思い出・経験</Label>
              <Textarea 
                placeholder="チームでの成功体験、患者さんとのエピソードなど"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. 後任者・組織への提言（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 後任者・組織への提言（10分）</h3>
            
            <div className="space-y-2">
              <Label>後任者へのアドバイス</Label>
              <Textarea 
                placeholder="役職・業務を引き継ぐ方への具体的なアドバイスや注意点"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織への改善提案</Label>
              <Textarea 
                placeholder="離職防止や組織改善のための具体的な提案"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>経営層へのメッセージ</Label>
              <Textarea 
                placeholder="経営陣に伝えたいこと、組織の将来に向けた提言など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 5. 引き継ぎ・今後の関係（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. 引き継ぎ・今後の関係（5分）</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>引き継ぎ状況</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="complete" id="complete" />
                    <Label htmlFor="complete">完了</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="in-progress" id="in-progress" />
                    <Label htmlFor="in-progress">進行中</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="planned" id="planned" />
                    <Label htmlFor="planned">予定</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>退職後の協力</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="consultation" />
                    <Label htmlFor="consultation" className="text-sm font-normal">
                      必要時の相談対応可
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="temporary" />
                    <Label htmlFor="temporary" className="text-sm font-normal">
                      一時的な業務支援可
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>引き継ぎに関する懸念事項</Label>
              <Textarea 
                placeholder="引き継ぎで心配な点、追加サポートが必要な事項など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 面談者記入欄 */}
          <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg">面談者記入欄</h3>
            
            <div className="space-y-2">
              <Label>面談の要点・重要事項</Label>
              <Textarea 
                placeholder="退職理由の本質、組織として対応すべき課題など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織改善へのアクションプラン</Label>
              <Textarea 
                placeholder="この面談から得られた改善点と具体的な対応策"
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>経営層への報告</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="required" id="required" />
                    <Label htmlFor="required">必要</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not-required" id="not-required" />
                    <Label htmlFor="not-required">不要</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>フォローアップ</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hr-action" id="hr-action" />
                    <Label htmlFor="hr-action">人事部対応要</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dept-action" id="dept-action" />
                    <Label htmlFor="dept-action">部門対応要</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no-action" id="no-action" />
                    <Label htmlFor="no-action">対応不要</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* 送信ボタン */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button variant="outline">一時保存</Button>
            <Button className="bg-red-600 hover:bg-red-700">面談記録を提出</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}