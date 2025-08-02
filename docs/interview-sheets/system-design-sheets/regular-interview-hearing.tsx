'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RegularInterviewHearingSheet() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            定期面談制度設計ヒアリングシート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            効果的な定期面談制度構築のための現場ニーズ調査
          </p>
          <div className="bg-blue-50 p-4 rounded-lg mt-4">
            <p className="text-sm text-blue-800">
              <strong>目的：</strong>職員の定期面談制度を設計するため、現場の管理者・職員からニーズや課題をヒアリングします。
            </p>
            <p className="text-sm text-blue-800 mt-2">
              <strong>所要時間：</strong>約20分
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="current">現状分析</TabsTrigger>
              <TabsTrigger value="ideal">理想の制度</TabsTrigger>
              <TabsTrigger value="requirements">実施要件</TabsTrigger>
            </TabsList>

            {/* 基本情報タブ */}
            <TabsContent value="basic" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">ヒアリング日</Label>
                  <Input type="date" id="date" />
                </div>
                <div>
                  <Label htmlFor="interviewer">ヒアリング実施者</Label>
                  <Input type="text" id="interviewer" />
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-3">回答者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="respondent-name">氏名</Label>
                    <Input type="text" id="respondent-name" />
                  </div>
                  <div>
                    <Label htmlFor="department">所属部署</Label>
                    <Input type="text" id="department" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="position">職位</Label>
                    <Input type="text" id="position" placeholder="看護師長、主任など" />
                  </div>
                  <div>
                    <Label htmlFor="experience">管理経験年数</Label>
                    <Input type="text" id="experience" placeholder="5年" />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Label>立場</Label>
                <RadioGroup className="space-y-2 mt-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="executive" id="role-e" />
                    <Label htmlFor="role-e" className="ml-2">経営層</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="middle-manager" id="role-mm" />
                    <Label htmlFor="role-mm" className="ml-2">中間管理職（面談実施者）</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="staff" id="role-s" />
                    <Label htmlFor="role-s" className="ml-2">一般職員（面談対象者）</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="hr" id="role-hr" />
                    <Label htmlFor="role-hr" className="ml-2">人事担当者</Label>
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>

            {/* 現状分析タブ（7分） */}
            <TabsContent value="current" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">1. 現在の面談実施状況（3分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>定期面談の実施状況</Label>
                    <RadioGroup className="space-y-2 mt-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="regular" id="status-r" />
                        <Label htmlFor="status-r" className="ml-2">定期的に実施している</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="irregular" id="status-i" />
                        <Label htmlFor="status-i" className="ml-2">不定期に実施している</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="problem-only" id="status-p" />
                        <Label htmlFor="status-p" className="ml-2">問題発生時のみ実施</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="none" id="status-n" />
                        <Label htmlFor="status-n" className="ml-2">ほとんど実施していない</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="frequency">実施頻度（実施している場合）</Label>
                    <Input type="text" id="frequency" placeholder="例：3ヶ月に1回、年2回など" />
                  </div>

                  <div>
                    <Label htmlFor="current-format">現在の面談形式</Label>
                    <Textarea 
                      id="current-format" 
                      placeholder="時間、場所、使用ツール、記録方法など"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">2. 現行制度の課題（4分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>面談実施の障壁（複数選択可）</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="barrier-time" />
                        <Label htmlFor="barrier-time" className="ml-2">時間が取れない</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="barrier-skill" />
                        <Label htmlFor="barrier-skill" className="ml-2">面談スキル不足</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="barrier-purpose" />
                        <Label htmlFor="barrier-purpose" className="ml-2">目的が不明確</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="barrier-format" />
                        <Label htmlFor="barrier-format" className="ml-2">形式が決まっていない</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="barrier-privacy" />
                        <Label htmlFor="barrier-privacy" className="ml-2">プライバシー確保困難</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="barrier-culture" />
                        <Label htmlFor="barrier-culture" className="ml-2">組織文化に合わない</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="current-problems">現在感じている問題点</Label>
                    <Textarea 
                      id="current-problems" 
                      placeholder="形骸化、効果が見えない、負担が大きいなど具体的に"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="missed-opportunities">面談不足による機会損失</Label>
                    <Textarea 
                      id="missed-opportunities" 
                      placeholder="早期離職、問題の見逃し、モチベーション低下など"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 理想の制度タブ（7分） */}
            <TabsContent value="ideal" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">3. 理想の面談制度（4分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ideal-purpose">面談で達成したい目的</Label>
                    <Textarea 
                      id="ideal-purpose" 
                      placeholder="職員の成長支援、問題の早期発見、モチベーション向上など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label>理想的な実施頻度</Label>
                    <RadioGroup className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="monthly" id="freq-m" />
                        <Label htmlFor="freq-m" className="ml-2">月1回</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="bimonthly" id="freq-b" />
                        <Label htmlFor="freq-b" className="ml-2">2ヶ月に1回</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="quarterly" id="freq-q" />
                        <Label htmlFor="freq-q" className="ml-2">3ヶ月に1回</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="biannual" id="freq-ba" />
                        <Label htmlFor="freq-ba" className="ml-2">半年に1回</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="annual" id="freq-a" />
                        <Label htmlFor="freq-a" className="ml-2">年1回</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="flexible" id="freq-f" />
                        <Label htmlFor="freq-f" className="ml-2">職位により変動</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>適切な面談時間</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="time-15" />
                        <Label htmlFor="time-15" className="ml-2">15分（簡易版）</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="time-30" />
                        <Label htmlFor="time-30" className="ml-2">30分（標準版）</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="time-60" />
                        <Label htmlFor="time-60" className="ml-2">60分（詳細版）</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="ideal-content">面談で扱うべき内容</Label>
                    <Textarea 
                      id="ideal-content" 
                      placeholder="業務状況、健康状態、キャリア希望、人間関係など優先順位をつけて"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">4. 職位別の配慮事項（3分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>職位別に異なる対応が必要な項目</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="diff-frequency" />
                        <Label htmlFor="diff-frequency" className="ml-2">実施頻度</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="diff-duration" />
                        <Label htmlFor="diff-duration" className="ml-2">面談時間</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="diff-content" />
                        <Label htmlFor="diff-content" className="ml-2">面談内容</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="diff-interviewer" />
                        <Label htmlFor="diff-interviewer" className="ml-2">面談実施者</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="diff-follow" />
                        <Label htmlFor="diff-follow" className="ml-2">フォローアップ方法</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="position-specific">職位別の具体的な配慮</Label>
                    <Textarea 
                      id="position-specific" 
                      placeholder="新人：月1回・30分、中堅：3ヶ月に1回・15分など"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 実施要件タブ（6分） */}
            <TabsContent value="requirements" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">5. 制度実施の前提条件（3分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>成功のための必須要件（複数選択可）</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="req-time" />
                        <Label htmlFor="req-time" className="ml-2">面談時間の確保</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="req-place" />
                        <Label htmlFor="req-place" className="ml-2">適切な場所の確保</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="req-training" />
                        <Label htmlFor="req-training" className="ml-2">面談スキル研修</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="req-tools" />
                        <Label htmlFor="req-tools" className="ml-2">面談ツールの整備</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="req-system" />
                        <Label htmlFor="req-system" className="ml-2">記録・管理システム</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="req-evaluation" />
                        <Label htmlFor="req-evaluation" className="ml-2">評価への反映</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="resource-needs">必要なリソース</Label>
                    <Textarea 
                      id="resource-needs" 
                      placeholder="人員配置、予算、システム投資など"
                      className="min-h-[60px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="management-support">経営層に求める支援</Label>
                    <Textarea 
                      id="management-support" 
                      placeholder="方針の明確化、時間の保証、評価制度との連動など"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">6. 導入プロセス（3分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>望ましい導入方法</Label>
                    <RadioGroup className="space-y-2 mt-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="pilot" id="intro-p" />
                        <Label htmlFor="intro-p" className="ml-2">パイロット部署から段階的に</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="all-at-once" id="intro-a" />
                        <Label htmlFor="intro-a" className="ml-2">全部署一斉導入</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="voluntary" id="intro-v" />
                        <Label htmlFor="intro-v" className="ml-2">希望部署から順次</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="mandatory" id="intro-m" />
                        <Label htmlFor="intro-m" className="ml-2">特定職位から必須化</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="success-factors">成功のカギとなる要素</Label>
                    <Textarea 
                      id="success-factors" 
                      placeholder="トップのコミットメント、現場の理解、継続的な改善など"
                      className="min-h-[60px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="concerns">懸念事項・リスク</Label>
                    <Textarea 
                      id="concerns" 
                      placeholder="形骸化、負担増、プライバシー問題など"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>

              {/* ヒアリング担当者記入欄 */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-lg mb-4">ヒアリング担当者所見</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="key-insights">重要な気づき</Label>
                    <Textarea 
                      id="key-insights" 
                      placeholder="回答者の本音、潜在的なニーズ、組織特有の事情など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="recommendations">制度設計への提言</Label>
                    <Textarea 
                      id="recommendations" 
                      placeholder="優先すべき要素、避けるべき落とし穴、成功要因など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="next-steps">次のアクション</Label>
                    <Textarea 
                      id="next-steps" 
                      placeholder="追加ヒアリング対象、確認事項、検討課題など"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* 保存ボタン */}
          <div className="flex justify-end space-x-4 pt-6 border-t mt-6">
            <Button variant="outline">一時保存</Button>
            <Button>ヒアリング記録を保存</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}