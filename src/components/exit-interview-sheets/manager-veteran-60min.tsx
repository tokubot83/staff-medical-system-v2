'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { AlertCircle, LogOut, Users, Target, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ManagerVeteran60MinExitInterviewSheet() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-red-50">
          <div className="flex items-center gap-2">
            <LogOut className="h-6 w-6 text-red-600" />
            <CardTitle className="text-2xl">役職者・ベテラン職員 退職面談シート（60分版）</CardTitle>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　退職者：＿＿＿＿＿＿＿＿</p>
            <p>役職・職種：＿＿＿＿＿＿　在職期間：＿＿年＿＿ヶ月</p>
            <p>退職予定日：＿＿＿＿年＿＿月＿＿日</p>
          </div>
          <Alert className="mt-3 bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>包括的面談（60分）：</strong>役職者・ベテラン職員の豊富な経験と知見を最大限に引き出し、
              組織の持続的改善につなげるための詳細な聞き取りを行います。感謝の気持ちを込めて、丁寧にお話を伺ってください。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          <Tabs defaultValue="reasons" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="reasons">退職理由</TabsTrigger>
              <TabsTrigger value="evaluation">組織評価</TabsTrigger>
              <TabsTrigger value="contribution">貢献と成果</TabsTrigger>
              <TabsTrigger value="knowledge">知識継承</TabsTrigger>
              <TabsTrigger value="improvement">改善提案</TabsTrigger>
              <TabsTrigger value="summary">総括</TabsTrigger>
            </TabsList>

            {/* タブ1: 退職理由の詳細分析（15分） */}
            <TabsContent value="reasons" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-red-600" />
                <h3 className="font-bold text-lg">1. 退職理由の詳細分析（15分）</h3>
              </div>
              
              <div className="space-y-3">
                <Label>主な退職理由（複数選択可）</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "キャリアアップ・新たな挑戦",
                    "専門性を活かせる環境への転職",
                    "給与・待遇面の不満",
                    "ワークライフバランスの改善",
                    "人間関係・職場環境の問題",
                    "組織運営・経営方針への不満",
                    "業務負荷・責任の過重",
                    "評価制度・昇進機会への不満",
                    "健康上の理由",
                    "家族の事情・介護",
                    "定年・早期退職制度利用",
                    "起業・独立",
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
                <Label>退職を決意した決定的な要因</Label>
                <Textarea 
                  placeholder="退職を最終的に決断した具体的な出来事や状況、その時期と背景を詳しくお聞かせください"
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label>退職を思い留まる可能性があった条件</Label>
                <Textarea 
                  placeholder="どのような条件変更や組織改革があれば、継続勤務を検討できたか具体的に"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>退職検討期間と相談状況</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">検討期間</Label>
                    <Input placeholder="例：6ヶ月前から" />
                  </div>
                  <div>
                    <Label className="text-sm">相談した相手</Label>
                    <Input placeholder="例：直属上司、人事部" />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* タブ2: 組織・業務への詳細評価（12分） */}
            <TabsContent value="evaluation" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-lg">2. 組織・業務への詳細評価（12分）</h3>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <Label className="text-base font-semibold">各項目の満足度評価（5段階）</Label>
                <div className="space-y-3">
                  {[
                    { category: "報酬・待遇", items: [
                      "基本給与水準",
                      "賞与・インセンティブ",
                      "福利厚生制度",
                      "退職金制度"
                    ]},
                    { category: "労働環境", items: [
                      "職場の設備・環境",
                      "勤務時間・シフト",
                      "有給取得のしやすさ",
                      "リモートワーク対応"
                    ]},
                    { category: "人間関係", items: [
                      "上司との関係",
                      "同僚との関係",
                      "部下との関係",
                      "他部門との連携"
                    ]},
                    { category: "成長・キャリア", items: [
                      "スキル向上機会",
                      "キャリアパス",
                      "研修・教育制度",
                      "資格取得支援"
                    ]},
                    { category: "組織運営", items: [
                      "経営方針・ビジョン",
                      "意思決定プロセス",
                      "情報共有・透明性",
                      "変革への対応力"
                    ]}
                  ].map(({ category, items }) => (
                    <div key={category} className="border-l-4 border-blue-400 pl-3">
                      <p className="font-semibold text-sm mb-2">{category}</p>
                      {items.map((item) => (
                        <div key={item} className="grid grid-cols-7 gap-1 items-center mb-1">
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
              </div>

              <div className="space-y-2">
                <Label>特に問題と感じた組織課題（上位3つ）</Label>
                <Textarea 
                  placeholder="1. \n2. \n3. "
                  className="min-h-[100px]"
                />
              </div>
            </TabsContent>

            {/* タブ3: 貢献と成果の振り返り（8分） */}
            <TabsContent value="contribution" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-green-600" />
                <h3 className="font-bold text-lg">3. 貢献と成果の振り返り（8分）</h3>
              </div>
              
              <div className="space-y-2">
                <Label>在職中の主要な成果・貢献</Label>
                <Textarea 
                  placeholder="プロジェクトの成功、業務改善、人材育成、売上貢献など具体的な成果を"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>最も誇りに思う仕事・プロジェクト</Label>
                <Textarea 
                  placeholder="達成感を感じた具体的なエピソードと、その成功要因"
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>育成した人材・後進への影響</Label>
                <Textarea 
                  placeholder="指導した部下やメンバーの成長、組織に残した人的資産について"
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>やり残したこと・心残り</Label>
                <Textarea 
                  placeholder="完成させたかったプロジェクト、解決したかった課題など"
                  className="min-h-[80px]"
                />
              </div>
            </TabsContent>

            {/* タブ4: 知識・ノウハウの継承（10分） */}
            <TabsContent value="knowledge" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-purple-600" />
                <h3 className="font-bold text-lg">4. 知識・ノウハウの継承（10分）</h3>
              </div>
              
              <div className="space-y-2">
                <Label>後任者に伝えたい重要な知識・ノウハウ</Label>
                <Textarea 
                  placeholder="業務遂行上の重要なポイント、注意事項、関係者との付き合い方など"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>文書化されていない暗黙知</Label>
                <Textarea 
                  placeholder="マニュアルにない重要な情報、経験から得た知見、トラブル対応のコツなど"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>重要な社内外の人脈・関係性</Label>
                <Textarea 
                  placeholder="キーパーソン、重要な取引先、協力関係にある部門・個人など"
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-3">
                <Label>引き継ぎ資料の状況</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "業務マニュアル作成済",
                    "プロジェクト資料整理済",
                    "顧客情報更新済",
                    "システムアクセス権限リスト作成済",
                    "年間スケジュール共有済",
                    "緊急時対応手順書作成済"
                  ].map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox id={item} />
                      <Label htmlFor={item} className="text-sm font-normal">{item}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* タブ5: 組織改善への提言（10分） */}
            <TabsContent value="improvement" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <h3 className="font-bold text-lg">5. 組織改善への提言（10分）</h3>
              </div>
              
              <div className="space-y-2">
                <Label>離職防止のための具体的提案</Label>
                <Textarea 
                  placeholder="同様の理由での離職を防ぐための制度改革、環境改善などの提案"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>組織文化・風土の改善提案</Label>
                <Textarea 
                  placeholder="コミュニケーション、意思決定、評価制度など組織文化に関する提案"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>業務プロセス・効率化の提案</Label>
                <Textarea 
                  placeholder="無駄な業務、改善可能なプロセス、システム化すべき作業など"
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>経営層へのメッセージ</Label>
                <Textarea 
                  placeholder="経営陣に直接伝えたいこと、戦略的な提言、組織の将来に向けたアドバイス"
                  className="min-h-[100px]"
                />
              </div>

              <div className="bg-amber-50 p-4 rounded-lg">
                <Label className="text-base font-semibold mb-3">改善優先度（最も重要な3つを選択）</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "給与・報酬体系の見直し",
                    "評価制度の改革",
                    "ワークライフバランス改善",
                    "キャリアパスの明確化",
                    "コミュニケーションの活性化",
                    "権限委譲の推進",
                    "教育研修の充実",
                    "DX・システム化推進",
                    "組織構造の見直し",
                    "企業文化の変革"
                  ].map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox id={`priority-${item}`} />
                      <Label htmlFor={`priority-${item}`} className="text-sm font-normal">{item}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* タブ6: 総括とフォローアップ（5分） */}
            <TabsContent value="summary" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-lg">6. 総括とフォローアップ（5分）</h3>
              </div>
              
              <div className="space-y-2">
                <Label>組織に対する総合的な印象・メッセージ</Label>
                <Textarea 
                  placeholder="在職期間を振り返っての率直な感想、組織への感謝、今後への期待など"
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>退職後の連絡先</Label>
                  <Input placeholder="メールアドレス" type="email" />
                  <Input placeholder="電話番号" type="tel" />
                </div>

                <div className="space-y-2">
                  <Label>退職後の協力可能性</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="advisor" />
                      <Label htmlFor="advisor" className="text-sm font-normal">
                        アドバイザー・顧問として
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="project" />
                      <Label htmlFor="project" className="text-sm font-normal">
                        プロジェクト単位での協力
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="training" />
                      <Label htmlFor="training" className="text-sm font-normal">
                        研修・教育での講師
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="recruitment" />
                      <Label htmlFor="recruitment" className="text-sm font-normal">
                        人材紹介・リファラル
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>その他、伝えたいこと</Label>
                <Textarea 
                  placeholder="面談で話しきれなかったこと、追加で伝えたいことなど"
                  className="min-h-[80px]"
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* 面談者記入欄 */}
          <div className="space-y-4 bg-blue-50 p-4 rounded-lg mt-6">
            <h3 className="font-bold text-lg">面談者記入欄</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>退職の真因分析</Label>
                <Textarea 
                  placeholder="表面的理由と本質的理由の分析"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>組織への影響評価</Label>
                <Textarea 
                  placeholder="この退職による業務・組織への影響度"
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>優先対応事項（アクションプラン）</Label>
              <Textarea 
                placeholder="1. 即座に対応すべきこと：\n2. 短期（1ヶ月以内）：\n3. 中期（3ヶ月以内）："
                className="min-h-[120px]"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>経営層への報告</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="urgent" id="urgent" />
                    <Label htmlFor="urgent" className="text-sm">緊急</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="normal" />
                    <Label htmlFor="normal" className="text-sm">通常</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="info" id="info" />
                    <Label htmlFor="info" className="text-sm">情報共有のみ</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>他部門への共有</Label>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="share-hr" />
                    <Label htmlFor="share-hr" className="text-sm font-normal">人事部</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="share-exec" />
                    <Label htmlFor="share-exec" className="text-sm font-normal">経営企画</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="share-dept" />
                    <Label htmlFor="share-dept" className="text-sm font-normal">関連部門</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>フォローアップ</Label>
                <Input type="date" />
                <Input placeholder="担当者" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>面談者所感</Label>
              <Textarea 
                placeholder="面談を通じて感じたこと、組織として学ぶべき点など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 送信ボタン */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button variant="outline">一時保存</Button>
            <Button variant="outline">PDFダウンロード</Button>
            <Button className="bg-red-600 hover:bg-red-700">面談記録を提出</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}