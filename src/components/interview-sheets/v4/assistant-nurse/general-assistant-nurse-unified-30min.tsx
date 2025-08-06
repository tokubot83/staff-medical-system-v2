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

export default function GeneralAssistantNurseUnified30MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-amber-50">
          <CardTitle className="text-2xl">一般准看護師（2-3年目）定期面談シート（30分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              30分の標準面談です。一般准看護師の業務遂行状況を詳細に確認し、成長支援とキャリア開発を行います。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. 業務遂行状況の詳細確認（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 業務遂行状況の詳細確認（10分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">准看護業務の遂行能力</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "指示理解と実行",
                "基本的な看護技術",
                "患者対応・コミュニケーション",
                "報告・連絡・相談",
                "看護師との連携",
                "記録・情報管理",
                "チームワーク",
                "安全管理意識"
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
                <p><span className="text-green-600 font-medium">5：</span>期待を大きく超える　<span className="text-blue-600 font-medium">4：</span>期待を超える　<span className="text-yellow-600 font-medium">3：</span>期待通り　<span className="text-orange-600 font-medium">2：</span>やや期待以下　<span className="text-red-600 font-medium">1：</span>期待以下</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>現在の主な業務内容</Label>
                <Textarea 
                  placeholder="担当している具体的な業務を記入"
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label>業務の自立度</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="independent" id="auto-independent" />
                    <Label htmlFor="auto-independent">ほぼ自立</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="partial" id="auto-partial" />
                    <Label htmlFor="auto-partial">部分的に指導が必要</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="guided" id="auto-guided" />
                    <Label htmlFor="auto-guided">常に指導が必要</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label>この半年での成長・変化</Label>
              <Textarea 
                placeholder="技術的成長、患者対応力の向上、チームでの役割の変化など具体的に記入"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>得意分野・強み</Label>
              <Textarea 
                placeholder="特に優れている看護技術や業務領域を記入"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 2. 職員の現状確認（モチベーション・健康・エンゲージメント）（8分） */}
          <div className="space-y-4 bg-green-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 職員の現状確認（モチベーション・健康・エンゲージメント）（8分）</h3>
            
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
              
              {[
                "現在のモチベーション",
                "職場満足度",
                "業務内容への満足度",
                "上司・同僚との関係"
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
            </div>

            {/* 健康・ストレス・エンゲージメント */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">健康・ストレス・エンゲージメント</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "健康状態",
                "ストレスレベル",
                "ワークライフバランス",
                "3年後の継続意向"
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
            </div>

            <div className="space-y-2">
              <Label>職場環境について感じること</Label>
              <Textarea 
                placeholder="チームワーク、職場の雰囲気、設備・環境など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 3. キャリア開発・スキル向上（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. キャリア開発・スキル向上（7分）</h3>
            
            <div className="space-y-2">
              <Label>看護師資格取得に対する意向</Label>
              <RadioGroup>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="actively-pursuing" id="rn-active" />
                    <Label htmlFor="rn-active" className="ml-2">現在取得に向けて勉強中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="planning" id="rn-planning" />
                    <Label htmlFor="rn-planning" className="ml-2">今後取得を検討</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="undecided" id="rn-undecided" />
                    <Label htmlFor="rn-undecided" className="ml-2">迷っている</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="no-plan" id="rn-no" />
                    <Label htmlFor="rn-no" className="ml-2">現在のところ予定なし</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>向上させたいスキル・知識</Label>
                <Textarea 
                  placeholder="技術面、知識面で特に伸ばしたい領域"
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label>研修・教育への参加希望</Label>
                <Textarea 
                  placeholder="参加したい研修、勉強会、資格取得支援など"
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>3年後の目標・キャリアビジョン</Label>
              <Textarea 
                placeholder="准看護師として、または看護師として、どのような将来を描いているか"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>後輩指導への関心</Label>
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="very-interested" id="mentoring-high" />
                  <Label htmlFor="mentoring-high">積極的に参加したい</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="somewhat-interested" id="mentoring-some" />
                  <Label htmlFor="mentoring-some">機会があれば参加したい</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-ready" id="mentoring-not" />
                  <Label htmlFor="mentoring-not">まだ自信がない</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 4. 現在の課題・必要なサポート（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 現在の課題・必要なサポート（5分）</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>現在困っていること・課題</Label>
                <Textarea 
                  placeholder="技術面、知識面、人間関係、業務量など"
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label>不安に感じていること</Label>
                <Textarea 
                  placeholder="将来のキャリア、スキル不足、職場環境など"
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>必要なサポート（複数選択可）</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center">
                  <input type="checkbox" id="support-skill" className="mr-2" />
                  <Label htmlFor="support-skill">技術研修・スキル向上</Label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="support-career" className="mr-2" />
                  <Label htmlFor="support-career">キャリア相談</Label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="support-workload" className="mr-2" />
                  <Label htmlFor="support-workload">業務量調整</Label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="support-mental" className="mr-2" />
                  <Label htmlFor="support-mental">メンタルケア</Label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="support-team" className="mr-2" />
                  <Label htmlFor="support-team">チーム環境改善</Label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="support-certification" className="mr-2" />
                  <Label htmlFor="support-certification">看護師資格取得支援</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>上司・同僚に期待すること</Label>
              <Textarea 
                placeholder="指導方法、コミュニケーション、業務分担など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 5. 今後のアクションプラン（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. 今後のアクションプラン（5分）</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>短期目標（3ヶ月以内）</Label>
                <Textarea 
                  placeholder="具体的で達成可能な目標を記入"
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label>長期目標（1年以内）</Label>
                <Textarea 
                  placeholder="中長期的な目標を記入"
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>目標達成のための具体的行動</Label>
              <Textarea 
                placeholder="研修参加、勉強計画、実践方法など"
                className="min-h-[60px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="next-interview">次回面談予定</Label>
                <Input type="date" id="next-interview" />
              </div>
              <div>
                <Label htmlFor="follow-method">フォロー方法</Label>
                <Input type="text" id="follow-method" placeholder="月次1on1、進捗確認など" />
              </div>
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>成長度評価</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="growth-excellent" />
                    <Label htmlFor="growth-excellent" className="ml-1 text-sm">期待以上</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="growth-good" />
                    <Label htmlFor="growth-good" className="ml-1 text-sm">順調</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="needs-support" id="growth-support" />
                    <Label htmlFor="growth-support" className="ml-1 text-sm">要支援</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>ポテンシャル</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="potential-high" />
                    <Label htmlFor="potential-high" className="ml-1 text-sm">高</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="potential-medium" />
                    <Label htmlFor="potential-medium" className="ml-1 text-sm">中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="potential-low" />
                    <Label htmlFor="potential-low" className="ml-1 text-sm">低</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>看護師資格取得適性</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="rn-aptitude-high" />
                    <Label htmlFor="rn-aptitude-high" className="ml-1 text-sm">高い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="rn-aptitude-medium" />
                    <Label htmlFor="rn-aptitude-medium" className="ml-1 text-sm">普通</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="rn-aptitude-low" />
                    <Label htmlFor="rn-aptitude-low" className="ml-1 text-sm">要検討</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>総合評価・特記事項</Label>
              <Textarea 
                placeholder="成長の程度、強み、改善点、支援方針、キャリア開発への提言など"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織としての支援計画</Label>
              <Textarea 
                placeholder="研修計画、メンター配置、業務調整、キャリア支援など"
                className="min-h-[80px]"
              />
            </div>
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