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
import { Slider } from "@/components/ui/slider";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function GeneralNurse45MinInterview() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            一般看護師面談シート（45分版）
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            キャリア開発と組織貢献を支援する包括的面談
          </p>
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              各項目で選択式評価と詳細記述の両方を記入してください。
              データ分析と個別支援の両方に活用されます。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="work">業務状況</TabsTrigger>
              <TabsTrigger value="satisfaction">満足度評価</TabsTrigger>
              <TabsTrigger value="career">キャリア開発</TabsTrigger>
              <TabsTrigger value="planning">支援計画</TabsTrigger>
            </TabsList>

            {/* 基本情報タブ */}
            <TabsContent value="basic" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">面談日</Label>
                  <Input type="date" id="date" />
                </div>
                <div>
                  <Label htmlFor="time">面談時間</Label>
                  <Input type="text" id="time" placeholder="14:00-14:45" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="interviewer">面談者</Label>
                  <Input type="text" id="interviewer" />
                </div>
                <div>
                  <Label htmlFor="place">面談場所</Label>
                  <Input type="text" id="place" />
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-3">職員情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">氏名</Label>
                    <Input type="text" id="name" />
                  </div>
                  <div>
                    <Label htmlFor="employee-id">職員番号</Label>
                    <Input type="text" id="employee-id" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="department">所属部署</Label>
                    <Input type="text" id="department" />
                  </div>
                  <div>
                    <Label htmlFor="position">職位</Label>
                    <Input type="text" id="position" placeholder="一般看護師" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="years">勤続年数</Label>
                    <Input type="text" id="years" placeholder="5年6ヶ月" />
                  </div>
                  <div>
                    <Label htmlFor="last-interview">前回面談日</Label>
                    <Input type="date" id="last-interview" />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 業務状況タブ（10分） */}
            <TabsContent value="work" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">1. 現在の業務状況（5分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">業務負担度</Label>
                    <div className="flex items-center space-x-4 mt-3">
                      <span className="text-sm w-16">軽い</span>
                      <Slider 
                        defaultValue={[50]} 
                        max={100} 
                        step={10}
                        className="flex-1"
                      />
                      <span className="text-sm w-16">重い</span>
                    </div>
                    <div className="mt-3">
                      <Label htmlFor="workload-detail">具体的な状況</Label>
                      <Textarea 
                        id="workload-detail" 
                        placeholder="担当患者数、委員会活動、特殊業務など具体的に"
                        className="min-h-[80px] mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="recent-achievements">最近の業務での成果・貢献</Label>
                    <Textarea 
                      id="recent-achievements" 
                      placeholder="プロジェクト参加、改善提案、後輩指導など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">
                      この3ヶ月で最も成長したと感じる点
                    </Label>
                    <Textarea 
                      id="growth-points" 
                      placeholder="新しく習得したスキル、克服した課題など"
                      className="min-h-[80px] mt-2"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">2. 課題と改善（5分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>現在の課題（複数選択可）</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="issue-workload" />
                        <Label htmlFor="issue-workload" className="ml-2">業務量過多</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="issue-skill" />
                        <Label htmlFor="issue-skill" className="ml-2">スキル不足</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="issue-team" />
                        <Label htmlFor="issue-team" className="ml-2">チーム連携</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="issue-motivation" />
                        <Label htmlFor="issue-motivation" className="ml-2">モチベーション</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="issue-health" />
                        <Label htmlFor="issue-health" className="ml-2">健康面</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="issue-balance" />
                        <Label htmlFor="issue-balance" className="ml-2">ワークライフバランス</Label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">
                      職場で改善してほしい具体的な点（3つまで）
                    </Label>
                    <Textarea 
                      id="improvement-requests" 
                      placeholder="1. \n2. \n3. "
                      className="min-h-[100px] mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="innovation-ideas">業務改善のアイデア</Label>
                    <Textarea 
                      id="innovation-ideas" 
                      placeholder="効率化、質向上、新しい取り組みなど"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 満足度評価タブ（10分） */}
            <TabsContent value="satisfaction" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">3. モチベーションと満足度（5分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">現在のモチベーション</Label>
                    <RadioGroup className="grid grid-cols-5 gap-3 mt-3">
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="5" id="motive-5" />
                        <Label htmlFor="motive-5" className="mt-1 text-sm">非常に高い</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="4" id="motive-4" />
                        <Label htmlFor="motive-4" className="mt-1 text-sm">高い</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="3" id="motive-3" />
                        <Label htmlFor="motive-3" className="mt-1 text-sm">普通</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="2" id="motive-2" />
                        <Label htmlFor="motive-2" className="mt-1 text-sm">低い</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="1" id="motive-1" />
                        <Label htmlFor="motive-1" className="mt-1 text-sm">非常に低い</Label>
                      </div>
                    </RadioGroup>
                    <div className="mt-3">
                      <Label htmlFor="motive-factors">モチベーションに影響する要因</Label>
                      <Textarea 
                        id="motive-factors" 
                        placeholder="やりがい、人間関係、評価、待遇など"
                        className="min-h-[80px] mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-3">各項目の満足度（1-5段階）</Label>
                    <div className="space-y-3">
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
                        <div key={item} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm w-32">{item}</span>
                          <RadioGroup className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((value) => (
                              <div key={value} className="flex items-center">
                                <RadioGroupItem 
                                  value={value.toString()} 
                                  id={`${item}-${value}`} 
                                />
                                <Label 
                                  htmlFor={`${item}-${value}`} 
                                  className="ml-1 text-sm"
                                >
                                  {value}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="job-satisfaction">仕事のやりがいを感じる瞬間</Label>
                    <Textarea 
                      id="job-satisfaction" 
                      placeholder="患者さんとの関わり、チームでの達成感など"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">4. 健康とウェルビーイング（5分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">健康・ストレス状況</Label>
                    <RadioGroup className="grid grid-cols-4 gap-3 mt-3">
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="good" id="health-g" />
                        <Label htmlFor="health-g" className="mt-1 text-sm">良好</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="mild" id="health-m" />
                        <Label htmlFor="health-m" className="mt-1 text-sm">軽度懸念</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="moderate" id="health-mo" />
                        <Label htmlFor="health-mo" className="mt-1 text-sm">要観察</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="severe" id="health-s" />
                        <Label htmlFor="health-s" className="mt-1 text-sm">要支援</Label>
                      </div>
                    </RadioGroup>
                    <div className="mt-3">
                      <Label htmlFor="health-detail">具体的な状況</Label>
                      <Textarea 
                        id="health-detail" 
                        placeholder="睡眠、疲労、ストレス症状など"
                        className="min-h-[60px] mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="stress-management">ストレス解消方法</Label>
                    <Textarea 
                      id="stress-management" 
                      placeholder="趣味、運動、リラックス方法など"
                      className="min-h-[60px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="work-life-balance">ワークライフバランスの状況</Label>
                    <Textarea 
                      id="work-life-balance" 
                      placeholder="プライベートの充実度、家族との時間など"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* キャリア開発タブ（10分） */}
            <TabsContent value="career" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">5. 働き方の意向（5分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">理想の働き方</Label>
                    <RadioGroup className="space-y-2 mt-3">
                      <div className="flex items-center">
                        <RadioGroupItem value="career-focused" id="work-cf" />
                        <Label htmlFor="work-cf" className="ml-2">
                          キャリアアップ重視（昇進・資格取得を積極的に）
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="specialist" id="work-s" />
                        <Label htmlFor="work-s" className="ml-2">
                          専門性重視（特定分野のエキスパートを目指す）
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="balanced" id="work-b" />
                        <Label htmlFor="work-b" className="ml-2">
                          バランス重視（仕事もプライベートも充実）
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="stable" id="work-st" />
                        <Label htmlFor="work-st" className="ml-2">
                          安定重視（現状維持で着実に）
                        </Label>
                      </div>
                    </RadioGroup>
                    <div className="mt-3">
                      <Label htmlFor="work-style-detail">具体的な希望</Label>
                      <Textarea 
                        id="work-style-detail" 
                        placeholder="勤務形態、役割、環境など"
                        className="min-h-[60px] mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="life-events">今後3年間のライフイベント予定</Label>
                    <Textarea 
                      id="life-events" 
                      placeholder="結婚、出産、介護、進学など（プライバシーに配慮し任意）"
                      className="min-h-[60px]"
                    />
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">
                      1年後もこの職場で働いているイメージが持てますか？
                    </Label>
                    <RadioGroup className="grid grid-cols-4 gap-3 mt-3">
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="definitely" id="retention-d" />
                        <Label htmlFor="retention-d" className="mt-1 text-sm">強く持てる</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="probably" id="retention-p" />
                        <Label htmlFor="retention-p" className="mt-1 text-sm">持てる</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="uncertain" id="retention-u" />
                        <Label htmlFor="retention-u" className="mt-1 text-sm">わからない</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="unlikely" id="retention-ul" />
                        <Label htmlFor="retention-ul" className="mt-1 text-sm">持てない</Label>
                      </div>
                    </RadioGroup>
                    <div className="mt-3">
                      <Label htmlFor="retention-factors">その理由</Label>
                      <Textarea 
                        id="retention-factors" 
                        placeholder="継続したい理由、不安要素など"
                        className="min-h-[60px] mt-2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">6. キャリアビジョン（5分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="career-vision">5年後の理想の姿</Label>
                    <Textarea 
                      id="career-vision" 
                      placeholder="どんな看護師になりたいか、どんな役割を担いたいか"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label>興味のあるキャリアパス（複数選択可）</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="path-specialist" />
                        <Label htmlFor="path-specialist" className="ml-2">専門看護師</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="path-certified" />
                        <Label htmlFor="path-certified" className="ml-2">認定看護師</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="path-management" />
                        <Label htmlFor="path-management" className="ml-2">看護管理者</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="path-educator" />
                        <Label htmlFor="path-educator" className="ml-2">教育担当者</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="path-preceptor" />
                        <Label htmlFor="path-preceptor" className="ml-2">プリセプター</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="path-researcher" />
                        <Label htmlFor="path-researcher" className="ml-2">研究・学術</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="skill-development">習得したいスキル・知識</Label>
                    <Textarea 
                      id="skill-development" 
                      placeholder="具体的な技術、資格、研修など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="career-support">キャリア実現のために必要なサポート</Label>
                    <Textarea 
                      id="career-support" 
                      placeholder="研修機会、メンター、時間確保など"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 支援計画タブ（15分） */}
            <TabsContent value="planning" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">7. 必要な支援（5分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>優先的に必要な支援（上位3つを選択）</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="support-skill" />
                        <Label htmlFor="support-skill" className="ml-2">スキルアップ支援</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="support-career" />
                        <Label htmlFor="support-career" className="ml-2">キャリア相談</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="support-workload" />
                        <Label htmlFor="support-workload" className="ml-2">業務量調整</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="support-mental" />
                        <Label htmlFor="support-mental" className="ml-2">メンタルサポート</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="support-team" />
                        <Label htmlFor="support-team" className="ml-2">チーム環境改善</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="support-evaluation" />
                        <Label htmlFor="support-evaluation" className="ml-2">評価・フィードバック</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="support-detail">具体的な支援内容の要望</Label>
                    <Textarea 
                      id="support-detail" 
                      placeholder="どのような形でサポートしてほしいか"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mentor-needs">メンター・相談相手の希望</Label>
                    <Textarea 
                      id="mentor-needs" 
                      placeholder="誰に、どんなことを相談したいか"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">8. アクションプラン（5分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="short-term-goals">3ヶ月後までの目標</Label>
                    <Textarea 
                      id="short-term-goals" 
                      placeholder="具体的で達成可能な目標を2-3個"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="action-items">合意したアクション</Label>
                    <Textarea 
                      id="action-items" 
                      placeholder="本人がすること：\n上司がすること：\n組織がすること："
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="success-criteria">成功の指標</Label>
                    <Textarea 
                      id="success-criteria" 
                      placeholder="目標達成をどう測るか"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>

              {/* 面談者記入欄 */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-lg mb-4">面談者記入欄（5分）</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <Label className="text-base font-semibold">総合評価</Label>
                      <RadioGroup className="space-y-2 mt-3">
                        <div className="flex items-center">
                          <RadioGroupItem value="excellent" id="eval-e" />
                          <Label htmlFor="eval-e" className="ml-2">優秀</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="good" id="eval-g" />
                          <Label htmlFor="eval-g" className="ml-2">良好</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="standard" id="eval-s" />
                          <Label htmlFor="eval-s" className="ml-2">標準</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="concern" id="eval-c" />
                          <Label htmlFor="eval-c" className="ml-2">要観察</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg">
                      <Label className="text-base font-semibold">離職リスク</Label>
                      <RadioGroup className="space-y-2 mt-3">
                        <div className="flex items-center">
                          <RadioGroupItem value="low" id="risk-l" />
                          <Label htmlFor="risk-l" className="ml-2">低い</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="medium" id="risk-m" />
                          <Label htmlFor="risk-m" className="ml-2">中程度</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="high" id="risk-h" />
                          <Label htmlFor="risk-h" className="ml-2">高い</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="critical" id="risk-c" />
                          <Label htmlFor="risk-c" className="ml-2">危機的</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="potential-assessment">ポテンシャル評価</Label>
                    <Textarea 
                      id="potential-assessment" 
                      placeholder="強み、成長可能性、将来の活躍イメージなど"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="interviewer-notes">面談者所見</Label>
                    <Textarea 
                      id="interviewer-notes" 
                      placeholder="全体的な印象、特記事項、懸念点など"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="recommendations">推奨事項</Label>
                    <Textarea 
                      id="recommendations" 
                      placeholder="昇進・昇格、研修推薦、配置転換など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="next-interview">次回面談予定</Label>
                      <Input type="date" id="next-interview" />
                    </div>
                    <div>
                      <Label htmlFor="follow-up-method">フォローアップ方法</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="方法を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly-check">月次チェック</SelectItem>
                          <SelectItem value="weekly-meeting">週次ミーティング</SelectItem>
                          <SelectItem value="as-needed">必要時相談</SelectItem>
                          <SelectItem value="mentor-assign">メンター配置</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* 保存ボタン */}
          <div className="flex justify-end space-x-4 pt-6 border-t mt-6">
            <Button variant="outline">一時保存</Button>
            <Button>面談記録を保存</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}