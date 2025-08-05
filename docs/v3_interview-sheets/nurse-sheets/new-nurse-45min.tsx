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

export default function NewNurse45MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-2xl">新人看護師（1年目）定期面談シート（45分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>入職月数：＿＿ヶ月　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              45分の詳細面談です。新人看護師の包括的な成長支援を目的とし、じっくりと話を聞いてください。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. 適応状況の詳細確認（12分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 適応状況の詳細確認（12分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">総合的な適応度</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "職場適応",
                "業務習得",
                "チームワーク",
                "コミュニケーション",
                "患者対応",
                "時間管理"
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
                <p><span className="text-green-600 font-medium">5：</span>非常に良い　<span className="text-blue-600 font-medium">4：</span>良い　<span className="text-yellow-600 font-medium">3：</span>普通　<span className="text-orange-600 font-medium">2：</span>やや困難　<span className="text-red-600 font-medium">1：</span>困難</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>最近できるようになったこと・成長を感じること</Label>
              <Textarea 
                placeholder="具体的な業務や技術、患者とのエピソードなどを詳しく記入"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>同期との関係性・学習への取り組み</Label>
              <Textarea 
                placeholder="同期とのコミュニケーション、勉強会への参加状況、相互支援など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>プリセプターとの関係・指導体制について</Label>
              <Textarea 
                placeholder="プリセプターからの指導状況、相談しやすさ、改善希望など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. 共通評価項目（12分） - 全世代共通セクション */}
          <div className="space-y-4 bg-green-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 共通評価項目（12分）</h3>
            
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

          {/* 3. 学習・成長状況の詳細（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 学習・成長状況の詳細（8分）</h3>
            
            <div className="space-y-2">
              <Label>新人研修の進捗状況</Label>
              <RadioGroup className="flex space-x-2">
                <div className="flex items-center">
                  <RadioGroupItem value="ahead" id="progress-a" />
                  <Label htmlFor="progress-a" className="ml-1">予定より早い</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="ontrack" id="progress-o" />
                  <Label htmlFor="progress-o" className="ml-1">予定通り</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="behind" id="progress-b" />
                  <Label htmlFor="progress-b" className="ml-1">やや遅れ</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="delayed" id="progress-d" />
                  <Label htmlFor="progress-d" className="ml-1">大幅遅れ</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>具体的な技術習得状況</Label>
              <Textarea 
                placeholder="注射、採血、点滴管理、医療機器操作など、習得できた技術と課題"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>特に興味のある分野・専門領域</Label>
              <Textarea 
                placeholder="将来的に専門性を深めたい分野、キャリアビジョン"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>学習上の困難・課題</Label>
              <Textarea 
                placeholder="技術習得、知識の定着、理論と実践の統合などで困っていること"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>自己学習の取り組み状況</Label>
              <Textarea 
                placeholder="教科書、研修会、オンライン学習など、主体的な学習への取り組み"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. 職場環境・人間関係（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 職場環境・人間関係（5分）</h3>
            
            <div className="space-y-2">
              <Label>職場環境全体の満足度</Label>
              <RadioGroup className="flex space-x-2">
                <div className="flex items-center">
                  <RadioGroupItem value="satisfied" id="workplace-s" />
                  <Label htmlFor="workplace-s" className="ml-1">満足</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="normal" id="workplace-n" />
                  <Label htmlFor="workplace-n" className="ml-1">ふつう</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="dissatisfied" id="workplace-d" />
                  <Label htmlFor="workplace-d" className="ml-1">不満</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>チームメンバーとのコミュニケーション</Label>
              <Textarea 
                placeholder="先輩ナース、医師、他職種との連携状況、コミュニケーションの課題"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>職場の雰囲気・働きやすさ</Label>
              <Textarea 
                placeholder="職場の雰囲気、質問しやすさ、サポート体制の実感"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>患者・家族とのコミュニケーション</Label>
              <Textarea 
                placeholder="患者対応で印象深かったエピソード、難しさを感じること"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 5. 課題・サポート（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. 課題・サポート（5分）</h3>
            
            <div className="space-y-2">
              <Label>現在困っていること・不安なこと</Label>
              <Textarea 
                placeholder="業務面、人間関係、体調面、将来への不安など詳しく"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>必要なサポート</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <Checkbox id="support-skill" />
                  <Label htmlFor="support-skill" className="ml-2">技術指導</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="support-mental" />
                  <Label htmlFor="support-mental" className="ml-2">メンタルケア</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="support-workload" />
                  <Label htmlFor="support-workload" className="ml-2">業務量調整</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="support-education" />
                  <Label htmlFor="support-education" className="ml-2">学習機会</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="support-preceptor" />
                  <Label htmlFor="support-preceptor" className="ml-2">プリセプター相談</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="support-schedule" />
                  <Label htmlFor="support-schedule" className="ml-2">勤務調整</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="support-career" />
                  <Label htmlFor="support-career" className="ml-2">キャリア相談</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="support-counseling" />
                  <Label htmlFor="support-counseling" className="ml-2">カウンセリング</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>組織・制度への要望・提案</Label>
              <Textarea 
                placeholder="新人研修制度、職場環境、働き方などへの要望"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 6. 今後の目標・キャリアプラン（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">6. 今後の目標・キャリアプラン（3分）</h3>
            
            <div className="space-y-2">
              <Label>次回面談までの目標（1ヶ月）</Label>
              <Textarea 
                placeholder="達成可能な具体的目標を1-2個"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>今年度内の成長目標</Label>
              <Textarea 
                placeholder="新人看護師として達成したい目標、身につけたい技術"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>3年後のキャリアビジョン</Label>
              <Textarea 
                placeholder="将来的になりたい看護師像、専門分野への関心"
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
                <Input type="text" id="follow-up" placeholder="週次確認など" />
              </div>
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>適応状況評価</Label>
                <RadioGroup className="flex space-x-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="eval-e" />
                    <Label htmlFor="eval-e" className="ml-1">順調</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="eval-g" />
                    <Label htmlFor="eval-g" className="ml-1">概ね順調</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="concern" id="eval-c" />
                    <Label htmlFor="eval-c" className="ml-1">要観察</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>離職リスク</Label>
                <RadioGroup className="flex space-x-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="risk-l" />
                    <Label htmlFor="risk-l" className="ml-1">低</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="risk-m" />
                    <Label htmlFor="risk-m" className="ml-1">中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="risk-h" />
                    <Label htmlFor="risk-h" className="ml-1">高</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>要フォローアップ</Label>
                <RadioGroup className="flex space-x-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="not-needed" id="follow-n" />
                    <Label htmlFor="follow-n" className="ml-1">不要</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="needed" id="follow-y" />
                    <Label htmlFor="follow-y" className="ml-1">必要</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="urgent" id="follow-u" />
                    <Label htmlFor="follow-u" className="ml-1">緊急</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <Textarea 
              placeholder="特記事項、緊急対応事項、成長の兆候、今後の支援方針など詳細に記入"
              className="min-h-[120px]"
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