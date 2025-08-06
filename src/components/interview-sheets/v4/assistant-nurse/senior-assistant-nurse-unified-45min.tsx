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

export default function SeniorAssistantNurseUnified45MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-2xl">シニア准看護師（4-9年目）定期面談シート（45分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              45分の詳細面談です。シニア准看護師の包括的評価と専門性・指導力の詳細な開発支援を行います。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. 専門性と指導力の包括的評価（15分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 専門性と指導力の包括的評価（15分）</h3>
            
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
                "危機管理対応",
                "業務改善への貢献",
                "専門知識の共有"
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
                <Label>現在の主な役割・責任の詳細</Label>
                <Textarea 
                  placeholder="チーム内での具体的な役割、責任範囲を詳細に記入"
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label>指導対象と指導実績</Label>
                <Textarea 
                  placeholder="指導している職員の人数、経験年数、指導成果、成長実績"
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>この1年間で発揮した専門性・リーダーシップの具体例</Label>
              <Textarea 
                placeholder="困難ケースへの対応、指導実績、チーム改善、業務効率化、新人育成成果など具体的なエピソード"
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>得意な専門分野・技術</Label>
                <Textarea 
                  placeholder="特に専門性を発揮できる分野・技術"
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label>指導で特に工夫していること</Label>
                <Textarea 
                  placeholder="効果的な指導方法、コミュニケーション技術"
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>チーム内でのリーダーシップ発揮場面</Label>
                <Textarea 
                  placeholder="チームをまとめた経験、困難な状況での対応"
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label>他職種との連携・協働実績</Label>
                <Textarea 
                  placeholder="医師、看護師、他部門との協働経験"
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>業務改善・効率化への取り組み</Label>
              <Textarea 
                placeholder="改善提案、効率化の工夫、新しい取り組みの実践"
                className="min-h-[80px]"
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
                "指導業務への意欲",
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
                "5年後の継続意向"
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
                <Label>指導業務による負荷・やりがい</Label>
                <Textarea 
                  placeholder="後輩指導に関する負担感とやりがいのバランス"
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label>現在のストレス要因</Label>
                <Textarea 
                  placeholder="業務上、人間関係上のストレス要因"
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>やりがいを感じる瞬間</Label>
                <Textarea 
                  placeholder="どのような時に仕事の価値を感じるか"
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label>職場環境・組織風土について</Label>
                <Textarea 
                  placeholder="チームワーク、職場の雰囲気、組織の方向性など"
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </div>

          {/* 3. キャリア開発・スキル向上（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. キャリア開発・スキル向上（10分）</h3>
            
            <div className="space-y-2">
              <Label>看護師資格取得に対する詳細な意向と計画</Label>
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
                    <RadioGroupItem value="satisfied-current" id="rn-satisfied" />
                    <Label htmlFor="rn-satisfied" className="ml-2">現職種での専門性向上を希望</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="other-path" id="rn-other" />
                    <Label htmlFor="rn-other" className="ml-2">他の専門資格取得を検討</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>資格取得に関する具体的計画・課題・必要な支援</Label>
              <Textarea 
                placeholder="勉強方法、スケジュール、経済的課題、時間確保、家庭との両立など"
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>さらに向上させたい専門スキル</Label>
                <Textarea 
                  placeholder="高度技術、専門知識、指導技術、管理スキル"
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label>参加したい研修・教育プログラム</Label>
                <Textarea 
                  placeholder="専門研修、指導者研修、管理職研修、学会参加など"
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>10年後のキャリアビジョン</Label>
              <Textarea 
                placeholder="准看護師として、看護師として、管理職として、どのような将来像を描いているか"
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>管理職への関心・適性</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very-interested" id="management-high" />
                    <Label htmlFor="management-high">非常に関心があり、準備を進めている</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="interested" id="management-some" />
                    <Label htmlFor="management-some">関心がある</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="uncertain" id="management-uncertain" />
                    <Label htmlFor="management-uncertain">迷っている</Label>
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
                  placeholder="特定診療科、専門技術、認定資格への関心"
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>指導者としての目標・ビジョン</Label>
              <Textarea 
                placeholder="どのような指導者になりたいか、後進育成への貢献方針"
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>自己研鑽の現在の取り組み</Label>
                <Textarea 
                  placeholder="読書、研究会参加、勉強会開催、資格取得など"
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label>組織への貢献アイデア</Label>
                <Textarea 
                  placeholder="業務改善、新人育成、チーム強化への提案"
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </div>

          {/* 4. 現在の課題・必要なサポート（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 現在の課題・必要なサポート（8分）</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>現在困っていること・課題</Label>
                <Textarea 
                  placeholder="専門技術、指導業務、人間関係、業務量、時間管理など詳細に"
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label>指導業務での具体的困難・課題</Label>
                <Textarea 
                  placeholder="指導方法、後輩の成長促進、評価方法、時間確保など"
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>スキル向上の障壁・課題</Label>
                <Textarea 
                  placeholder="時間不足、機会不足、経済的制約、家庭との両立など"
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label>キャリア開発の悩み・不安</Label>
                <Textarea 
                  placeholder="将来の方向性、資格取得、役割拡大への不安"
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>過去に困難を乗り越えた経験とその方法</Label>
              <Textarea 
                placeholder="これまでの課題解決経験、学んだこと、活用できるノウハウ"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>必要なサポート（複数選択可）</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center">
                  <input type="checkbox" id="support-advanced-detail" className="mr-2" />
                  <Label htmlFor="support-advanced-detail">高度技術研修</Label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="support-teaching-detail" className="mr-2" />
                  <Label htmlFor="support-teaching-detail">指導スキル向上</Label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="support-management-detail" className="mr-2" />
                  <Label htmlFor="support-management-detail">管理職研修</Label>
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
                  <input type="checkbox" id="support-certification-detail" className="mr-2" />
                  <Label htmlFor="support-certification-detail">資格取得支援</Label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="support-schedule-detail" className="mr-2" />
                  <Label htmlFor="support-schedule-detail">勤務調整</Label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="support-financial-detail" className="mr-2" />
                  <Label htmlFor="support-financial-detail">経済的支援</Label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>上司・管理者に期待すること</Label>
                <Textarea 
                  placeholder="評価方法、業務配分、成長機会提供、キャリア支援など"
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label>組織・職場に対する要望・提案</Label>
                <Textarea 
                  placeholder="制度改善、環境整備、研修体制、評価システムなど"
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>自分自身の改善すべき点・取り組み方針</Label>
              <Textarea 
                placeholder="自己認識する課題と改善に向けた具体的な取り組み計画"
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
                  placeholder="具体的で測定可能な短期目標"
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label>中期目標（3-6ヶ月以内）</Label>
                <Textarea 
                  placeholder="専門性向上、指導力強化の中期目標"
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label>長期目標（1年以内）</Label>
                <Textarea 
                  placeholder="キャリア発展、役割拡大の長期目標"
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>目標達成のための詳細行動計画</Label>
              <Textarea 
                placeholder="研修参加、勉強計画、指導方法改善、実践計画、期限設定など具体的に"
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>必要なリソース・支援</Label>
                <Textarea 
                  placeholder="人的支援、研修機会、時間確保、経済的支援など"
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label>予想される障壁と対策</Label>
                <Textarea 
                  placeholder="実行時の困難と解決策"
                  className="min-h-[80px]"
                />
              </div>
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
                <Label htmlFor="review-period-detail">進捗評価時期</Label>
                <Input type="date" id="review-period-detail" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>成功指標・評価基準</Label>
              <Textarea 
                placeholder="目標達成をどのように測定・評価するか、具体的な成功指標"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 面談者総合所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者総合所見</h3>
            
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label>専門性発揮度</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="exceptional" id="expertise-exceptional" />
                    <Label htmlFor="expertise-exceptional" className="ml-1 text-sm">卓越</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="expertise-excellent" />
                    <Label htmlFor="expertise-excellent" className="ml-1 text-sm">優秀</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="expertise-good" />
                    <Label htmlFor="expertise-good" className="ml-1 text-sm">良好</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="needs-support" id="expertise-support" />
                    <Label htmlFor="expertise-support" className="ml-1 text-sm">要支援</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>指導力・育成力</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="exceptional" id="teaching-exceptional" />
                    <Label htmlFor="teaching-exceptional" className="ml-1 text-sm">卓越</Label>
                  </div>
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
                    <RadioGroupItem value="exceptional" id="leadership-exceptional" />
                    <Label htmlFor="leadership-exceptional" className="ml-1 text-sm">卓越</Label>
                  </div>
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
                    <Label htmlFor="management-aptitude-high" className="ml-1 text-sm">高い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="management-aptitude-medium" />
                    <Label htmlFor="management-aptitude-medium" className="ml-1 text-sm">普通</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="management-aptitude-low" />
                    <Label htmlFor="management-aptitude-low" className="ml-1 text-sm">要検討</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="not-suitable" id="management-aptitude-not" />
                    <Label htmlFor="management-aptitude-not" className="ml-1 text-sm">不適</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>総合評価・特記事項</Label>
              <Textarea 
                placeholder="シニアとしての総合的な評価、専門性・指導力・リーダーシップの発揮状況、将来性、特筆すべき点"
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織としての活用・支援戦略</Label>
              <Textarea 
                placeholder="指導者研修、管理職候補育成、専門性活用、役割拡大、キャリア支援の具体的方針"
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
              <Label>上級管理者・人事部への申し送り事項</Label>
              <Textarea 
                placeholder="昇進・昇格候補、特別配慮事項、組織的支援が必要な事項、人材活用提案など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>後継者育成・知識継承計画</Label>
              <Textarea 
                placeholder="持っているスキル・ノウハウの継承計画、次世代リーダー候補の推薦など"
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