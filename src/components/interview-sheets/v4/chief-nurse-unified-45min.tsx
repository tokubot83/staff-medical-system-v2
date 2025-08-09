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

export default function ChiefNurseUnified45MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-amber-50">
          <CardTitle className="text-2xl">病棟師長 定期面談シート（45分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>管理職経験：＿＿年＿＿ヶ月　担当部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              45分の詳細面談です。管理職の戦略的思考、組織運営、人材育成を包括的に支援し、経営視点での議論も行ってください。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. 管理業務・組織運営の詳細評価（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 管理業務・組織運営の詳細評価（10分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">管理能力・リーダーシップ</Label>
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
                "コミュニケーション力",
                "問題解決力",
                "戦略企画力",
                "変革推進力",
                "人材育成力",
                "経営感覚"
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
              <Label>部署の運営状況・KPI達成状況</Label>
              <Textarea 
                placeholder="病床稼働率、在院日数、患者満足度、医療安全指標、財務指標など具体的数値と評価"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>この半年間の主要な成果・実績</Label>
              <Textarea 
                placeholder="業務改善、品質向上、コスト削減、新規プロジェクト、表彰など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>リーダーシップスタイル・マネジメント手法</Label>
              <Textarea 
                placeholder="チーム運営方針、意思決定プロセス、コミュニケーション方法など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. 職員の現状確認（モチベーション・健康・エンゲージメント）（12分） - 全世代共通セクション */}
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
                "給与・待遇",
                "勤務時間・ワークライフバランス",
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
                "睡眠の質",
                "3年後の継続意向",
                "職場推奨度"
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
                <p><span className="font-medium">健康状態：</span><span className="text-green-600 font-medium">5：</span>非常に良好　<span className="text-blue-600 font-medium">4：</span>良好　<span className="text-yellow-600 font-medium">3：</span>普通　<span className="text-orange-600 font-medium">2：</span>やや不調　<span className="text-red-600 font-medium">1：</span>不調</p>
                <p><span className="font-medium">ストレス：</span><span className="text-green-600 font-medium">5：</span>非常に低い　<span className="text-blue-600 font-medium">4：</span>低い　<span className="text-yellow-600 font-medium">3：</span>普通　<span className="text-orange-600 font-medium">2：</span>高い　<span className="text-red-600 font-medium">1：</span>非常に高い</p>
                <p><span className="font-medium">睡眠の質：</span><span className="text-green-600 font-medium">5：</span>非常に良い　<span className="text-blue-600 font-medium">4：</span>良い　<span className="text-yellow-600 font-medium">3：</span>普通　<span className="text-orange-600 font-medium">2：</span>悪い　<span className="text-red-600 font-medium">1：</span>非常に悪い</p>
                <p><span className="font-medium">継続意向：</span><span className="text-green-600 font-medium">5：</span>ぜひ続けたい　<span className="text-blue-600 font-medium">4：</span>続けたい　<span className="text-yellow-600 font-medium">3：</span>わからない　<span className="text-orange-600 font-medium">2：</span>転職検討　<span className="text-red-600 font-medium">1：</span>転職活動中</p>
                <p><span className="font-medium">職場推奨度：</span><span className="text-green-600 font-medium">5：</span>積極的に勧める　<span className="text-blue-600 font-medium">4：</span>勧める　<span className="text-yellow-600 font-medium">3：</span>どちらでもない　<span className="text-orange-600 font-medium">2：</span>あまり勧めない　<span className="text-red-600 font-medium">1：</span>勧めない</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="text-base font-semibold">ストレス要因の詳細</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center">
                  <Checkbox id="stress-workload" />
                  <Label htmlFor="stress-workload" className="ml-2">業務過多</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="stress-relations" />
                  <Label htmlFor="stress-relations" className="ml-2">人間関係</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="stress-pressure" />
                  <Label htmlFor="stress-pressure" className="ml-2">経営プレッシャー</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="stress-balance" />
                  <Label htmlFor="stress-balance" className="ml-2">家庭との両立</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="stress-staff" />
                  <Label htmlFor="stress-staff" className="ml-2">部下の問題</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="stress-career" />
                  <Label htmlFor="stress-career" className="ml-2">キャリアの停滞</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="stress-resources" />
                  <Label htmlFor="stress-resources" className="ml-2">リソース不足</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="stress-responsibility" />
                  <Label htmlFor="stress-responsibility" className="ml-2">責任の重さ</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="stress-other" />
                  <Label htmlFor="stress-other" className="ml-2">その他</Label>
                </div>
              </div>
              <div className="mt-2">
                <Label className="text-sm">ストレス要因の詳細（自由記述）</Label>
                <Textarea 
                  placeholder="上記で選択したストレス要因について、具体的な状況を記入"
                  className="min-h-[60px] mt-1"
                />
              </div>
            </div>
          </div>

          {/* 3. 人材育成・組織開発（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 人材育成・組織開発（10分）</h3>
            
            <div className="space-y-2">
              <Label>部署の人材育成戦略・実施状況</Label>
              <Textarea 
                placeholder="スタッフの育成計画、キャリア開発支援、後継者育成など具体的施策と成果"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織文化・チームビルディングの取り組み</Label>
              <Textarea 
                placeholder="組織風土改善、チーム力向上、コミュニケーション活性化などの施策"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>スタッフのエンゲージメント向上策</Label>
              <Textarea 
                placeholder="モチベーション向上、離職防止、働きがい創出などの取り組み"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>今後強化したい人材育成分野</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <Checkbox id="develop-leadership" />
                  <Label htmlFor="develop-leadership" className="ml-2">リーダーシップ開発</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="develop-specialty" />
                  <Label htmlFor="develop-specialty" className="ml-2">専門性向上</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="develop-succession" />
                  <Label htmlFor="develop-succession" className="ml-2">後継者育成</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="develop-innovation" />
                  <Label htmlFor="develop-innovation" className="ml-2">イノベーション人材</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="develop-diversity" />
                  <Label htmlFor="develop-diversity" className="ml-2">ダイバーシティ推進</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="develop-retention" />
                  <Label htmlFor="develop-retention" className="ml-2">定着率向上</Label>
                </div>
              </div>
            </div>
          </div>

          {/* 4. 戦略企画・経営参画（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 戦略企画・経営参画（8分）</h3>
            
            <div className="space-y-2">
              <Label>部署の中期戦略・ビジョン</Label>
              <Textarea 
                placeholder="3-5年後の部署の姿、重点施策、目標など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>病院経営への貢献・提言</Label>
              <Textarea 
                placeholder="収益改善、コスト削減、新規事業、組織改革などへの貢献"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>他部門との連携・協働</Label>
              <Textarea 
                placeholder="医師、コメディカル、事務部門との連携状況と課題"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織の課題と改革提案</Label>
              <Textarea 
                placeholder="システム、プロセス、体制などの改善提案"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 5. 今後のアクションプラン（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. 今後のアクションプラン（5分）</h3>
            
            <div className="space-y-2">
              <Label>次回面談までの重点目標（2-3個）</Label>
              <Textarea 
                placeholder="組織運営、人材育成、業績向上など具体的かつ測定可能な目標"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>必要なサポート・リソース</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <Checkbox id="support-authority" />
                  <Label htmlFor="support-authority" className="ml-2">権限拡大</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="support-budget" />
                  <Label htmlFor="support-budget" className="ml-2">予算増額</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="support-staff" />
                  <Label htmlFor="support-staff" className="ml-2">人員増強</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="support-training" />
                  <Label htmlFor="support-training" className="ml-2">研修機会</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="support-coaching" />
                  <Label htmlFor="support-coaching" className="ml-2">コーチング</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="support-network" />
                  <Label htmlFor="support-network" className="ml-2">外部ネットワーク</Label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="next-interview">次回面談予定</Label>
                <Input type="date" id="next-interview" />
              </div>
              <div>
                <Label htmlFor="follow-up">フォローアップ方法</Label>
                <Input type="text" id="follow-up" placeholder="月次報告、戦略会議など" />
              </div>
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>総合評価</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="eval-e" />
                    <Label htmlFor="eval-e" className="ml-1 text-sm">期待を大きく超える</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="eval-g" />
                    <Label htmlFor="eval-g" className="ml-1 text-sm">期待を超える</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="meets" id="eval-m" />
                    <Label htmlFor="eval-m" className="ml-1 text-sm">期待通り</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="below" id="eval-b" />
                    <Label htmlFor="eval-b" className="ml-1 text-sm">期待以下</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>次期キャリア</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="executive" id="career-ex" />
                    <Label htmlFor="career-ex" className="ml-1 text-sm">上級管理職候補</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="expand" id="career-ep" />
                    <Label htmlFor="career-ep" className="ml-1 text-sm">責任範囲拡大</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="current" id="career-cu" />
                    <Label htmlFor="career-cu" className="ml-1 text-sm">現職継続</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="specialist" id="career-sp" />
                    <Label htmlFor="career-sp" className="ml-1 text-sm">専門職転向</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>組織への重要度</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="critical" id="importance-c" />
                    <Label htmlFor="importance-c" className="ml-1 text-sm">極めて重要</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="importance-h" />
                    <Label htmlFor="importance-h" className="ml-1 text-sm">重要</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="importance-m" />
                    <Label htmlFor="importance-m" className="ml-1 text-sm">標準</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>推奨する育成・活用方針</Label>
              <RadioGroup>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="promote" id="policy-pr" />
                    <Label htmlFor="policy-pr" className="ml-2">昇進・昇格推進</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="develop" id="policy-dv" />
                    <Label htmlFor="policy-dv" className="ml-2">更なる能力開発</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="retain" id="policy-rt" />
                    <Label htmlFor="policy-rt" className="ml-2">定着・継続重視</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="support" id="policy-sp" />
                    <Label htmlFor="policy-sp" className="ml-2">サポート強化</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            <Textarea 
              placeholder="総合所見、経営能力評価、今後の期待、育成計画、特記事項など詳細に記入"
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