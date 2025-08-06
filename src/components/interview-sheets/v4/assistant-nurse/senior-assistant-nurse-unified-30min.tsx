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

export default function SeniorAssistantNurseUnified30MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-2xl">シニア准看護師（4-9年目）定期面談シート（30分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              30分の標準面談です。シニア准看護師の専門性と指導力を詳細に確認し、キャリア開発を支援します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. 専門性と指導力の詳細確認（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 専門性と指導力の詳細確認（10分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">シニア准看護師としての能力発揮</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "高度な看護技術",
                "複雑なケースへの対応",
                "後輩への技術指導",
                "チーム内での調整力",
                "看護師との協働",
                "問題解決能力",
                "リーダーシップ",
                "危機管理対応"
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
                <Label>現在の主な役割・責任</Label>
                <Textarea 
                  placeholder="チーム内での具体的な役割を記入"
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label>指導している後輩の人数・状況</Label>
                <Textarea 
                  placeholder="指導対象者の人数、指導内容、成果など"
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>この半年で発揮した専門性・リーダーシップの具体例</Label>
              <Textarea 
                placeholder="困難ケースへの対応、指導実績、チーム貢献、改善提案など具体的に記入"
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>得意な指導分野・技術</Label>
                <Textarea 
                  placeholder="特に指導に自信のある分野"
                  className="min-h-[60px]"
                />
              </div>
              <div className="space-y-2">
                <Label>指導で工夫していること</Label>
                <Textarea 
                  placeholder="指導方法、コミュニケーションの工夫"
                  className="min-h-[60px]"
                />
              </div>
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
                "指導業務への意欲"
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
              <Label>指導業務による負荷・ストレス</Label>
              <Textarea 
                placeholder="後輩指導に関する負担感、ストレス要因"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 3. キャリア開発・スキル向上（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. キャリア開発・スキル向上（7分）</h3>
            
            <div className="space-y-2">
              <Label>看護師資格取得に対する現在の意向</Label>
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
                    <RadioGroupItem value="satisfied-current" id="rn-satisfied" />
                    <Label htmlFor="rn-satisfied" className="ml-2">現在の職種に満足</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>さらに向上させたいスキル</Label>
                <Textarea 
                  placeholder="高度な技術、指導技術、管理スキルなど"
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label>参加したい研修・教育</Label>
                <Textarea 
                  placeholder="専門研修、指導者研修、資格取得支援など"
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>5年後のキャリアビジョン</Label>
              <Textarea 
                placeholder="准看護師として、または看護師として、どのような将来を描いているか"
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>管理職への関心</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very-interested" id="management-high" />
                    <Label htmlFor="management-high">非常に関心がある</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="interested" id="management-some" />
                    <Label htmlFor="management-some">関心がある</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not-interested" id="management-not" />
                    <Label htmlFor="management-not">関心がない</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>専門分野の深化希望</Label>
                <Textarea 
                  placeholder="特定の診療科や専門技術への集中希望"
                  className="min-h-[60px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>指導者としての成長目標</Label>
              <Textarea 
                placeholder="どのような指導者になりたいか、指導スキル向上の目標"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. 現在の課題・必要なサポート（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 現在の課題・必要なサポート（5分）</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>現在困っていること・課題</Label>
                <Textarea 
                  placeholder="指導業務、専門技術、人間関係、業務量など"
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label>指導業務での困難・課題</Label>
                <Textarea 
                  placeholder="後輩の指導で困っていること、指導方法の悩み"
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>必要なサポート（複数選択可）</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center">
                  <input type="checkbox" id="support-advanced" className="mr-2" />
                  <Label htmlFor="support-advanced">高度技術研修</Label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="support-teaching" className="mr-2" />
                  <Label htmlFor="support-teaching">指導スキル向上</Label>
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
                  <input type="checkbox" id="support-certification" className="mr-2" />
                  <Label htmlFor="support-certification">看護師資格取得支援</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>上司・管理者に期待すること</Label>
              <Textarea 
                placeholder="評価方法、業務配分、キャリア支援など"
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
                  placeholder="専門性向上、指導力強化の具体的目標"
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label>長期目標（1年以内）</Label>
                <Textarea 
                  placeholder="キャリア発展に向けた目標"
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>目標達成のための行動計画</Label>
              <Textarea 
                placeholder="研修参加、勉強計画、指導方法改善など"
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
            
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label>専門性発揮度</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="expertise-excellent" />
                    <Label htmlFor="expertise-excellent" className="ml-1 text-sm">期待以上</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="expertise-good" />
                    <Label htmlFor="expertise-good" className="ml-1 text-sm">順調</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="needs-support" id="expertise-support" />
                    <Label htmlFor="expertise-support" className="ml-1 text-sm">要支援</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>指導力</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="teaching-high" />
                    <Label htmlFor="teaching-high" className="ml-1 text-sm">高</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="teaching-medium" />
                    <Label htmlFor="teaching-medium" className="ml-1 text-sm">中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="developing" id="teaching-developing" />
                    <Label htmlFor="teaching-developing" className="ml-1 text-sm">発展途上</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>リーダーシップ</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="leadership-high" />
                    <Label htmlFor="leadership-high" className="ml-1 text-sm">高</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="leadership-medium" />
                    <Label htmlFor="leadership-medium" className="ml-1 text-sm">中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="developing" id="leadership-developing" />
                    <Label htmlFor="leadership-developing" className="ml-1 text-sm">発展途上</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>管理職適性</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="management-aptitude-high" />
                    <Label htmlFor="management-aptitude-high" className="ml-1 text-sm">高</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="management-aptitude-medium" />
                    <Label htmlFor="management-aptitude-medium" className="ml-1 text-sm">中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="management-aptitude-low" />
                    <Label htmlFor="management-aptitude-low" className="ml-1 text-sm">要検討</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>総合評価・特記事項</Label>
              <Textarea 
                placeholder="シニアとしての成長度、指導者としての評価、今後の期待、支援方針など"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織としての活用・支援計画</Label>
              <Textarea 
                placeholder="指導者研修、管理職候補育成、専門性活用、役割拡大など"
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