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

export default function ChiefNurse45MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-2xl">看護師長・管理職定期面談シート（45分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>管理職経験：＿＿年＿＿ヶ月　担当部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              45分の詳細面談です。管理業務、戦略企画、組織運営を包括的に支援してください。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. 管理業務・チーム運営の詳細評価（12分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 管理業務・チーム運営の詳細評価（12分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">管理能力</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "チーム運営力",
                "意思決定力",
                "コミュニケーション",
                "問題解決力",
                "戦略企画力",
                "変革推進力"
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
                <p><span className="text-green-600 font-medium">5：</span>卓越　<span className="text-blue-600 font-medium">4：</span>優秀　<span className="text-yellow-600 font-medium">3：</span>良好　<span className="text-orange-600 font-medium">2：</span>標準　<span className="text-red-600 font-medium">1：</span>要改善</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>現在のチーム状況・パフォーマンスの詳細</Label>
              <Textarea 
                placeholder="スタッフ数、稼働状況、チームの強み・課題、最近の成果、KPI達成状況など詳しく"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>スタッフ育成・人材開発の取り組み</Label>
              <Textarea 
                placeholder="新人指導体制、スキルアップ支援、キャリア開発、離職防止策など具体的施策"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>リーダーシップスタイル・マネジメント手法</Label>
              <Textarea 
                placeholder="自身のマネジメントスタイル、スタッフとのコミュニケーション手法、モチベーション管理"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>困難なケースでの判断・対応事例</Label>
              <Textarea 
                placeholder="最近対応した困難事例、危機管理、スタッフ間トラブル解決など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>管理者としての成長・学び</Label>
              <Textarea 
                placeholder="研修参加、他部門見学、外部勉強会、管理技術の習得など"
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

          {/* 3. 戦略・改善計画の詳細（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 戦略・改善計画の詳細（8分）</h3>
            
            <div className="space-y-2">
              <Label>重点取り組み課題・戦略の詳細</Label>
              <Textarea 
                placeholder="品質向上、効率化、人材育成、チーム力強化などの戦略と具体的計画、KPI設定"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>最近の成果・実績の詳細</Label>
              <Textarea 
                placeholder="KPI改善、プロジェクト成功事例、チーム成果、表彰・評価など具体的数値と事例"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>現在直面している管理上の課題</Label>
              <Textarea 
                placeholder="人員配置、業務効率、スタッフのモチベーション管理、予算制約など具体的課題"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>課題解決のためのアクションプラン</Label>
              <Textarea 
                placeholder="短期・中期の具体的解決策、責任者、スケジュール、期待効果など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>必要な組織サポート</Label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="flex items-center">
                  <Checkbox id="support-budget" />
                  <Label htmlFor="support-budget" className="ml-2">予算確保</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="support-staff" />
                  <Label htmlFor="support-staff" className="ml-2">人員増強</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="support-system" />
                  <Label htmlFor="support-system" className="ml-2">システム導入</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="support-training" />
                  <Label htmlFor="support-training" className="ml-2">研修機会</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="support-authority" />
                  <Label htmlFor="support-authority" className="ml-2">権限拡大</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="support-policy" />
                  <Label htmlFor="support-policy" className="ml-2">制度見直し</Label>
                </div>
              </div>
              <Textarea 
                placeholder="選択したサポートの具体的な内容と期待効果"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>イノベーション・変革推進の取り組み</Label>
              <Textarea 
                placeholder="新しい取り組み、業務プロセス改革、デジタル化推進、文化変革など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. 組織・他部門連携の詳細（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 組織・他部門連携の詳細（5分）</h3>
            
            <div className="space-y-2">
              <Label>他部門との連携状況の詳細</Label>
              <Textarea 
                placeholder="医師、薬剤部、リハビリ、事務部門などとの連携状況、成功事例、課題と改善策"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織全体への貢献・リーダーシップ</Label>
              <Textarea 
                placeholder="病院全体の改善提案、委員会活動、プロジェクトリーダー、他部門への指導・支援"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>外部機関・地域との連携</Label>
              <Textarea 
                placeholder="地域医療連携、学会活動、研修・講師、他院との交流、行政との連携など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織文化・風土への影響</Label>
              <Textarea 
                placeholder="チームワーク向上、安全文化醸成、学習する組織づくりなどへの貢献"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 5. キャリア・ライフステージ（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. キャリア・ライフステージ（5分）</h3>
            
            <div className="space-y-2">
              <Label>管理職としてのキャリアビジョン</Label>
              <Textarea 
                placeholder="今後の管理職キャリア、上位職への意欲、専門性との両立、理想とする管理者像"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>現在のライフステージ・働き方</Label>
              <Textarea 
                placeholder="家庭状況、育児・介護、健康状態、ワークライフバランスの状況"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>管理職としての成長課題・学習ニーズ</Label>
              <Textarea 
                placeholder="身につけたい管理スキル、参加したい研修、必要な経験、メンターシップなど"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織・制度への要望・提案</Label>
              <Textarea 
                placeholder="管理職支援制度、研修体系、評価制度、組織構造、意思決定プロセスなどへの要望"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 6. 今後の目標・アクションプラン（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">6. 今後の目標・アクションプラン（3分）</h3>
            
            <div className="space-y-2">
              <Label>次回面談までの目標（1ヶ月）</Label>
              <Textarea 
                placeholder="具体的な管理目標・チーム改善目標・個人目標と測定指標"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>今年度内の部門目標</Label>
              <Textarea 
                placeholder="部門KPI達成、品質向上、スタッフ育成、組織貢献などの具体的目標"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>中長期キャリア目標（3-5年）</Label>
              <Textarea 
                placeholder="管理職としての成長目標、組織内での役割拡大、専門性向上など"
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
                <Input type="text" id="follow-up" placeholder="定期報告など" />
              </div>
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label>管理能力評価</Label>
                <RadioGroup className="flex space-x-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="mgmt-e" />
                    <Label htmlFor="mgmt-e" className="ml-1">優秀</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="mgmt-g" />
                    <Label htmlFor="mgmt-g" className="ml-1">良好</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="developing" id="mgmt-d" />
                    <Label htmlFor="mgmt-d" className="ml-1">要支援</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>チーム成果</Label>
                <RadioGroup className="flex space-x-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="result-h" />
                    <Label htmlFor="result-h" className="ml-1">高</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="result-m" />
                    <Label htmlFor="result-m" className="ml-1">中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="result-l" />
                    <Label htmlFor="result-l" className="ml-1">低</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>戦略企画力</Label>
                <RadioGroup className="flex space-x-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="strategy-h" />
                    <Label htmlFor="strategy-h" className="ml-1">高</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="strategy-m" />
                    <Label htmlFor="strategy-m" className="ml-1">中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="strategy-l" />
                    <Label htmlFor="strategy-l" className="ml-1">低</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>組織貢献度</Label>
                <RadioGroup className="flex space-x-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="contrib-h" />
                    <Label htmlFor="contrib-h" className="ml-1">高</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="contrib-m" />
                    <Label htmlFor="contrib-m" className="ml-1">中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="contrib-l" />
                    <Label htmlFor="contrib-l" className="ml-1">低</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <Textarea 
              placeholder="特記事項、支援方針、今後の期待役割、昇進・昇格の可能性、組織としての位置づけなど詳細に記入"
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