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

export default function GeneralAssistantNurseUnified45MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-amber-50">
          <CardTitle className="text-2xl">一般准看護師（2-3年目）定期面談シート（45分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              45分の詳細面談です。一般准看護師の包括的な評価と詳細なキャリア開発支援を行います。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. 業務遂行状況の包括的評価（15分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 業務遂行状況の包括的評価（15分）</h3>
            
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
                "安全管理意識",
                "問題解決能力",
                "学習意欲・向上心"
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
                  placeholder="日常の業務を詳細に記入"
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label>業務の自立度・責任範囲</Label>
                <Textarea 
                  placeholder="どの程度自立して業務を行えるか、責任を持って行っている業務範囲"
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>この1年間での具体的成長・変化</Label>
              <Textarea 
                placeholder="技術面、知識面、精神面での成長を具体的なエピソードを交えて記入"
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>得意分野・強み</Label>
                <Textarea 
                  placeholder="特に優れている技術・業務・特性"
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label>改善が必要な領域</Label>
                <Textarea 
                  placeholder="今後向上させたい技術・知識・能力"
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>患者・家族からの反応・評価</Label>
              <Textarea 
                placeholder="患者や家族からの声、評価、感謝の言葉など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 2. 職員の現状確認（モチベーション・健康・エンゲージメント）（12分） */}
          <div className="space-y-4 bg-green-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 職員の現状確認（モチベーション・健康・エンゲージメント）（12分）</h3>
            
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
                "上司・同僚との関係",
                "評価・承認の実感",
                "成長実感"
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
                "仕事への熱意",
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>職場環境について感じること</Label>
                <Textarea 
                  placeholder="チームワーク、職場の雰囲気、設備・環境、労働条件など"
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label>やりがいを感じる瞬間</Label>
                <Textarea 
                  placeholder="どのような時に仕事の意味や価値を感じるか"
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>現在のストレス要因</Label>
              <Textarea 
                placeholder="業務上、人間関係上、プライベートでのストレス要因"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 3. キャリア開発・スキル向上（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. キャリア開発・スキル向上（10分）</h3>
            
            <div className="space-y-2">
              <Label>看護師資格取得に対する意向と計画</Label>
              <RadioGroup>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="actively-pursuing" id="rn-active" />
                    <Label htmlFor="rn-active" className="ml-2">現在取得に向けて勉強中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="planning-soon" id="rn-planning-soon" />
                    <Label htmlFor="rn-planning-soon" className="ml-2">近い将来取得予定</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="planning-future" id="rn-planning-future" />
                    <Label htmlFor="rn-planning-future" className="ml-2">将来的に取得を検討</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="undecided" id="rn-undecided" />
                    <Label htmlFor="rn-undecided" className="ml-2">迷っている</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="no-plan" id="rn-no" />
                    <Label htmlFor="rn-no" className="ml-2">現在のところ予定なし</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="other-path" id="rn-other" />
                    <Label htmlFor="rn-other" className="ml-2">別のキャリアを検討</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>資格取得に関する具体的計画・課題</Label>
              <Textarea 
                placeholder="勉強方法、スケジュール、障害となっている要因、必要な支援など"
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>向上させたいスキル・知識</Label>
                <Textarea 
                  placeholder="技術面、知識面、ソフトスキル面で特に伸ばしたい領域"
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label>研修・教育への参加希望・経験</Label>
                <Textarea 
                  placeholder="参加したい研修、これまでの研修経験とその評価"
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>5年後のキャリアビジョン</Label>
              <Textarea 
                placeholder="准看護師として、または看護師として、どのような将来を描いているか"
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>後輩指導への関心・経験</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="experienced" id="mentoring-exp" />
                    <Label htmlFor="mentoring-exp">経験があり積極的に参加したい</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="willing" id="mentoring-willing" />
                    <Label htmlFor="mentoring-willing">機会があれば参加したい</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not-ready" id="mentoring-not" />
                    <Label htmlFor="mentoring-not">まだ自信がない</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>専門分野への関心</Label>
                <Textarea 
                  placeholder="特に関心のある診療科や専門分野"
                  className="min-h-[60px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>自己研鑽の取り組み</Label>
              <Textarea 
                placeholder="現在行っている学習活動、読書、研究会参加など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. 現在の課題・必要なサポート（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 現在の課題・必要なサポート（8分）</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>現在困っていること・課題</Label>
                <Textarea 
                  placeholder="技術面、知識面、人間関係、業務量、設備・環境など詳細に記入"
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label>不安に感じていること</Label>
                <Textarea 
                  placeholder="将来のキャリア、スキル不足、職場環境、プライベートとの両立など"
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>過去に困難だった状況とその対処法</Label>
              <Textarea 
                placeholder="これまでに直面した困難な状況とどのように乗り越えたか"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>必要なサポート（複数選択可）</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center">
                  <input type="checkbox" id="support-skill-detail" className="mr-2" />
                  <Label htmlFor="support-skill-detail">技術研修・スキル向上</Label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="support-career-detail" className="mr-2" />
                  <Label htmlFor="support-career-detail">キャリア相談</Label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="support-workload-detail" className="mr-2" />
                  <Label htmlFor="support-workload-detail">業務量調整</Label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="support-mental-detail" className="mr-2" />
                  <Label htmlFor="support-mental-detail">メンタルケア</Label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="support-team-detail" className="mr-2" />
                  <Label htmlFor="support-team-detail">チーム環境改善</Label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="support-certification-detail" className="mr-2" />
                  <Label htmlFor="support-certification-detail">看護師資格取得支援</Label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="support-schedule" className="mr-2" />
                  <Label htmlFor="support-schedule">勤務シフト調整</Label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="support-equipment" className="mr-2" />
                  <Label htmlFor="support-equipment">設備・環境改善</Label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="support-financial" className="mr-2" />
                  <Label htmlFor="support-financial">経済的支援</Label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>上司・同僚に期待すること</Label>
                <Textarea 
                  placeholder="指導方法、コミュニケーション、業務分担、評価方法など"
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label>組織・職場に対する要望</Label>
                <Textarea 
                  placeholder="制度、環境、設備、研修体制などへの要望"
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>自分自身の改善点・努力すべき点</Label>
              <Textarea 
                placeholder="自己認識している改善すべき点と改善に向けた取り組み"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 5. 今後の詳細アクションプラン（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. 今後の詳細アクションプラン（10分）</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>短期目標（1ヶ月以内）</Label>
                <Textarea 
                  placeholder="具体的で測定可能な目標"
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label>中期目標（3ヶ月以内）</Label>
                <Textarea 
                  placeholder="段階的に達成する目標"
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
              <Label>目標達成のための具体的行動計画</Label>
              <Textarea 
                placeholder="研修計画、学習方法、実践計画、期限設定など詳細に記入"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>必要なリソース・支援</Label>
              <Textarea 
                placeholder="目標達成に必要な人的・物的・経済的リソース"
                className="min-h-[60px]"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="next-interview-detail">次回面談予定</Label>
                <Input type="date" id="next-interview-detail" />
              </div>
              <div>
                <Label htmlFor="follow-method-detail">フォロー方法</Label>
                <Input type="text" id="follow-method-detail" placeholder="月次1on1、進捗確認など" />
              </div>
              <div>
                <Label htmlFor="review-period">進捗評価時期</Label>
                <Input type="date" id="review-period" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>成功指標・評価基準</Label>
              <Textarea 
                placeholder="目標達成をどのように測定・評価するか"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 面談者総合所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者総合所見</h3>
            
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label>成長度評価</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="growth-excellent-detail" />
                    <Label htmlFor="growth-excellent-detail" className="ml-1 text-sm">期待以上</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="growth-good-detail" />
                    <Label htmlFor="growth-good-detail" className="ml-1 text-sm">順調</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="needs-support" id="growth-support-detail" />
                    <Label htmlFor="growth-support-detail" className="ml-1 text-sm">要支援</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>ポテンシャル</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="potential-high-detail" />
                    <Label htmlFor="potential-high-detail" className="ml-1 text-sm">高</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="potential-medium-detail" />
                    <Label htmlFor="potential-medium-detail" className="ml-1 text-sm">中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="potential-low-detail" />
                    <Label htmlFor="potential-low-detail" className="ml-1 text-sm">低</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>看護師資格取得適性</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="rn-aptitude-high-detail" />
                    <Label htmlFor="rn-aptitude-high-detail" className="ml-1 text-sm">高い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="rn-aptitude-medium-detail" />
                    <Label htmlFor="rn-aptitude-medium-detail" className="ml-1 text-sm">普通</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="rn-aptitude-low-detail" />
                    <Label htmlFor="rn-aptitude-low-detail" className="ml-1 text-sm">要検討</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>リーダーシップ素養</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="leadership-high" />
                    <Label htmlFor="leadership-high" className="ml-1 text-sm">高い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="leadership-medium" />
                    <Label htmlFor="leadership-medium" className="ml-1 text-sm">普通</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="developing" id="leadership-developing" />
                    <Label htmlFor="leadership-developing" className="ml-1 text-sm">発展途上</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>総合評価・特記事項</Label>
              <Textarea 
                placeholder="成長の程度、強み、改善点、将来性、特筆すべき点など包括的な評価"
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織としての支援計画・人材育成方針</Label>
              <Textarea 
                placeholder="研修計画、メンター配置、業務調整、キャリア支援、役割期待など具体的な支援方針"
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>推奨する次回面談形式</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="15min" id="next-15min" />
                    <Label htmlFor="next-15min">15分面談（フォローアップ）</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="30min" id="next-30min" />
                    <Label htmlFor="next-30min">30分面談（標準）</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="45min" id="next-45min" />
                    <Label htmlFor="next-45min">45分面談（詳細）</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>緊急度・優先度</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="urgent" id="priority-urgent-detail" />
                    <Label htmlFor="priority-urgent-detail" className="text-red-600">緊急対応必要</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="soon" id="priority-soon-detail" />
                    <Label htmlFor="priority-soon-detail" className="text-orange-600">早期対応推奨</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="priority-normal-detail" />
                    <Label htmlFor="priority-normal-detail">通常フォロー</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label>他部門・上級管理者への申し送り事項</Label>
              <Textarea 
                placeholder="人事部、看護部長、院長等に申し送るべき重要事項"
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