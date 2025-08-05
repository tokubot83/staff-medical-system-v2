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

export default function GeneralNurse45MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-2xl">一般看護師（2-3年目）定期面談シート（45分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              45分の詳細面談です。スキル向上、キャリア発展、ワークライフバランスを包括的に支援してください。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. スキル・業務状況の詳細確認（12分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. スキル・業務状況の詳細確認（12分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">現在の業務能力</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "独立業務遂行",
                "判断力・応用力",
                "効率性",
                "リーダーシップ",
                "専門知識",
                "問題解決能力"
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
                <p><span className="text-green-600 font-medium">5：</span>優秀　<span className="text-blue-600 font-medium">4：</span>良好　<span className="text-yellow-600 font-medium">3：</span>標準　<span className="text-orange-600 font-medium">2：</span>要改善　<span className="text-red-600 font-medium">1：</span>要支援</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>最近向上したスキル・新しく習得したこと</Label>
              <Textarea 
                placeholder="技術面、知識面での成長を具体例とともに詳しく記入"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>後輩指導・新人サポートの経験</Label>
              <Textarea 
                placeholder="新人指導での気づき、課題、やりがい、指導方法の工夫など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>現在担当している特別業務・委員会活動</Label>
              <Textarea 
                placeholder="委員会、プロジェクト、チームリーダーなどの役割"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>業務効率化・改善の取り組み</Label>
              <Textarea 
                placeholder="自分なりに工夫していること、提案したいこと"
                className="min-h-[60px]"
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

          {/* 3. キャリア・成長意欲の詳細（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. キャリア・成長意欲の詳細（8分）</h3>
            
            <div className="space-y-2">
              <Label>今後挑戦したいこと・興味のある分野</Label>
              <Textarea 
                placeholder="専門分野、委員会活動、資格取得、リーダーシップ開発、研究活動など詳しく"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>現在の課題・改善したいこと</Label>
              <Textarea 
                placeholder="スキル面、業務効率、コミュニケーション、リーダーシップなどの課題"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>5年後のキャリアビジョン</Label>
              <Textarea 
                placeholder="どのような看護師になりたいか、目指す役割、専門性の方向性"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>学習・自己啓発の取り組み</Label>
              <Textarea 
                placeholder="研修参加、資格取得、読書、研究活動など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織・職場への貢献意欲</Label>
              <Textarea 
                placeholder="チーム、病棟、病院全体への貢献について"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. ワークライフバランス・生活面（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. ワークライフバランス・生活面（5分）</h3>
            
            <div className="space-y-2">
              <Label>現在の勤務体制・生活リズムの満足度</Label>
              <RadioGroup className="flex space-x-2">
                <div className="flex items-center">
                  <RadioGroupItem value="satisfied" id="balance-s" />
                  <Label htmlFor="balance-s" className="ml-1">満足</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="normal" id="balance-n" />
                  <Label htmlFor="balance-n" className="ml-1">普通</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="dissatisfied" id="balance-d" />
                  <Label htmlFor="balance-d" className="ml-1">不満</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>プライベートとの両立で困っていること</Label>
              <Textarea 
                placeholder="家庭、育児、介護、趣味、自己啓発、副業など具体的に"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>希望する働き方・勤務形態</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <Checkbox id="work-fulltime" />
                  <Label htmlFor="work-fulltime" className="ml-2">正社員継続</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="work-parttime" />
                  <Label htmlFor="work-parttime" className="ml-2">時短勤務</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="work-shift" />
                  <Label htmlFor="work-shift" className="ml-2">シフト調整</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="work-remote" />
                  <Label htmlFor="work-remote" className="ml-2">在宅業務</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="work-flexible" />
                  <Label htmlFor="work-flexible" className="ml-2">フレックス</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="work-transfer" />
                  <Label htmlFor="work-transfer" className="ml-2">部署異動</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>今後のライフイベント・家庭状況の変化予定</Label>
              <Textarea 
                placeholder="結婚、出産、介護、転居など将来の予定"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 5. 職場環境・人間関係（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. 職場環境・人間関係（5分）</h3>
            
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
              <Label>チームメンバーとのコミュニケーション状況</Label>
              <Textarea 
                placeholder="先輩、同僚、後輩、医師、他職種との関係性"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>職場の雰囲気・働きやすさの実感</Label>
              <Textarea 
                placeholder="職場の雰囲気、相談しやすさ、チームワーク、サポート体制"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織・制度への要望・改善提案</Label>
              <Textarea 
                placeholder="勤務制度、研修制度、評価制度、職場環境などへの提案"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 6. 今後の目標・アクションプラン（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">6. 今後の目標・アクションプラン（3分）</h3>
            
            <div className="space-y-2">
              <Label>次回面談までの目標（1ヶ月）</Label>
              <Textarea 
                placeholder="具体的なスキル向上目標や業務改善目標"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>今年度内の成長目標</Label>
              <Textarea 
                placeholder="資格取得、専門性向上、リーダーシップ開発、委員会活動など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>中長期キャリア目標（3-5年）</Label>
              <Textarea 
                placeholder="専門看護師、認定看護師、管理職など具体的な目標"
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
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label>成長状況評価</Label>
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
                    <Label htmlFor="eval-c" className="ml-1">要支援</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>キャリア意欲</Label>
                <RadioGroup className="flex space-x-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="career-h" />
                    <Label htmlFor="career-h" className="ml-1">高</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="career-m" />
                    <Label htmlFor="career-m" className="ml-1">中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="career-l" />
                    <Label htmlFor="career-l" className="ml-1">低</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>次世代育成能力</Label>
                <RadioGroup className="flex space-x-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="mentoring-h" />
                    <Label htmlFor="mentoring-h" className="ml-1">高</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="mentoring-m" />
                    <Label htmlFor="mentoring-m" className="ml-1">中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="mentoring-l" />
                    <Label htmlFor="mentoring-l" className="ml-1">低</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>リーダー候補</Label>
                <RadioGroup className="flex space-x-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="yes" id="leader-y" />
                    <Label htmlFor="leader-y" className="ml-1">適性あり</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="potential" id="leader-p" />
                    <Label htmlFor="leader-p" className="ml-1">将来性あり</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="no" id="leader-n" />
                    <Label htmlFor="leader-n" className="ml-1">専門志向</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <Textarea 
              placeholder="特記事項、支援方針、キャリア開発の方向性、今後の育成計画など詳細に記入"
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