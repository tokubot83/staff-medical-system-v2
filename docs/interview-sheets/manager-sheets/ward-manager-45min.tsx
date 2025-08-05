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

export default function WardManager45MinInterview() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            病棟師長面談シート（45分版）
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            戦略的マネジメントと組織改革を推進する包括的面談
          </p>
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              各項目で選択式評価と詳細記述の両方を記入してください。
              経営戦略と組織変革の推進に活用されます。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="performance">部署実績</TabsTrigger>
              <TabsTrigger value="management">経営貢献</TabsTrigger>
              <TabsTrigger value="leadership">リーダーシップ</TabsTrigger>
              <TabsTrigger value="innovation">変革推進</TabsTrigger>
              <TabsTrigger value="development">育成計画</TabsTrigger>
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
                <h3 className="font-semibold mb-3">病棟師長情報</h3>
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
                    <Label htmlFor="ward">担当病棟</Label>
                    <Input type="text" id="ward" />
                  </div>
                  <div>
                    <Label htmlFor="management-years">管理職経験年数</Label>
                    <Input type="text" id="management-years" placeholder="7年" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="staff-size">管理スタッフ数</Label>
                    <Input type="text" id="staff-size" placeholder="35名" />
                  </div>
                  <div>
                    <Label htmlFor="bed-count">管理病床数</Label>
                    <Input type="text" id="bed-count" placeholder="40床" />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="qualifications">保有資格・認定</Label>
                  <Textarea 
                    id="qualifications" 
                    placeholder="認定看護管理者、専門資格など"
                    className="min-h-[60px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 部署実績タブ（10分） */}
            <TabsContent value="performance" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">1. 部署運営実績（5分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">重要業績指標（KPI）</Label>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <Label htmlFor="bed-occupancy">病床稼働率</Label>
                        <Input type="text" id="bed-occupancy" placeholder="95%" />
                      </div>
                      <div>
                        <Label htmlFor="patient-satisfaction">患者満足度スコア</Label>
                        <Input type="text" id="patient-satisfaction" placeholder="4.5/5.0" />
                      </div>
                      <div>
                        <Label htmlFor="staff-retention">スタッフ定着率</Label>
                        <Input type="text" id="staff-retention" placeholder="92%" />
                      </div>
                      <div>
                        <Label htmlFor="incident-rate">インシデント発生率</Label>
                        <Input type="text" id="incident-rate" placeholder="0.5%" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="achievements">主要な成果（直近3ヶ月）</Label>
                    <Textarea 
                      id="achievements" 
                      placeholder="目標達成状況、特筆すべき成果、表彰など"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">
                      ベンチマーク比較
                    </Label>
                    <div className="flex items-center space-x-4 mt-3">
                      <span className="text-sm w-20">劣位</span>
                      <Slider 
                        defaultValue={[75]} 
                        max={100} 
                        step={5}
                        className="flex-1"
                      />
                      <span className="text-sm w-20">優位</span>
                    </div>
                    <Textarea 
                      id="benchmark-detail" 
                      placeholder="他病棟・他院との比較、強み・弱みなど"
                      className="min-h-[60px] mt-3"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">2. 品質・安全管理（5分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>医療安全の取り組み（複数選択可）</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="safety-rounds" />
                        <Label htmlFor="safety-rounds" className="ml-2">安全ラウンド実施</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="safety-training" />
                        <Label htmlFor="safety-training" className="ml-2">定期研修実施</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="safety-culture" />
                        <Label htmlFor="safety-culture" className="ml-2">安全文化醸成</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="safety-analysis" />
                        <Label htmlFor="safety-analysis" className="ml-2">RCA分析実施</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="quality-initiatives">品質向上プロジェクト</Label>
                    <Textarea 
                      id="quality-initiatives" 
                      placeholder="実施中のQIプロジェクト、改善活動など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="risk-management">リスク管理状況</Label>
                    <Textarea 
                      id="risk-management" 
                      placeholder="特定したリスク、対策、モニタリング状況など"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 経営貢献タブ（8分） */}
            <TabsContent value="management" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">3. 経営への貢献（4分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">財務貢献</Label>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <Label htmlFor="revenue-performance">収益達成率</Label>
                        <Input type="text" id="revenue-performance" placeholder="108%" />
                      </div>
                      <div>
                        <Label htmlFor="cost-performance">コスト管理</Label>
                        <Input type="text" id="cost-performance" placeholder="予算比95%" />
                      </div>
                      <div>
                        <Label htmlFor="profit-contribution">利益貢献額</Label>
                        <Input type="text" id="profit-contribution" placeholder="前年比+15%" />
                      </div>
                      <div>
                        <Label htmlFor="efficiency-gain">効率化による削減額</Label>
                        <Input type="text" id="efficiency-gain" placeholder="年間300万円" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="strategic-initiatives">戦略的取り組み</Label>
                    <Textarea 
                      id="strategic-initiatives" 
                      placeholder="新サービス開発、地域連携強化、差別化戦略など"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">4. コスト意識と改善（4分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">
                      実施したコスト削減策（今期）
                    </Label>
                    <Textarea 
                      id="cost-reduction-actions" 
                      placeholder="1. 材料費削減（在庫最適化）\n2. 人件費効率化（シフト最適化）\n3. "
                      className="min-h-[100px] mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="revenue-ideas">収益向上への提案</Label>
                    <Textarea 
                      id="revenue-ideas" 
                      placeholder="新規患者獲得、単価向上、新サービスなど"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="investment-needs">必要な投資案件</Label>
                    <Textarea 
                      id="investment-needs" 
                      placeholder="設備投資、システム導入、人材投資など（ROI含む）"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* リーダーシップタブ（8分） */}
            <TabsContent value="leadership" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">5. リーダーシップとチーム構築（4分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">リーダーシップ評価</Label>
                    <RadioGroup className="grid grid-cols-5 gap-3 mt-3">
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="5" id="lead-5" />
                        <Label htmlFor="lead-5" className="mt-1 text-sm">卓越</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="4" id="lead-4" />
                        <Label htmlFor="lead-4" className="mt-1 text-sm">優秀</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="3" id="lead-3" />
                        <Label htmlFor="lead-3" className="mt-1 text-sm">標準</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="2" id="lead-2" />
                        <Label htmlFor="lead-2" className="mt-1 text-sm">発展途上</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="1" id="lead-1" />
                        <Label htmlFor="lead-1" className="mt-1 text-sm">要改善</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="team-building">チームビルディングの成果</Label>
                    <Textarea 
                      id="team-building" 
                      placeholder="チーム力向上の取り組み、成果、雰囲気の変化など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="conflict-resolution">困難な状況への対処事例</Label>
                    <Textarea 
                      id="conflict-resolution" 
                      placeholder="人間関係の調整、危機対応、変革の推進など"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">6. 人材育成とサクセッション（4分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="talent-development">優秀人材の育成状況</Label>
                    <Textarea 
                      id="talent-development" 
                      placeholder="次世代リーダー候補、専門性の高い人材など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">
                      後継者準備状況
                    </Label>
                    <RadioGroup className="grid grid-cols-4 gap-3 mt-3">
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="ready" id="successor-r" />
                        <Label htmlFor="successor-r" className="mt-1 text-sm">準備完了</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="1year" id="successor-1" />
                        <Label htmlFor="successor-1" className="mt-1 text-sm">1年以内</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="2years" id="successor-2" />
                        <Label htmlFor="successor-2" className="mt-1 text-sm">2年以内</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="not-ready" id="successor-n" />
                        <Label htmlFor="successor-n" className="mt-1 text-sm">未準備</Label>
                      </div>
                    </RadioGroup>
                    <div className="mt-3">
                      <Label htmlFor="successor-plan">後継者育成計画</Label>
                      <Textarea 
                        id="successor-plan" 
                        placeholder="候補者名、育成方法、タイムラインなど"
                        className="min-h-[60px] mt-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 変革推進タブ（9分） */}
            <TabsContent value="innovation" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">7. イノベーションと変革（5分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">
                      推進中の変革プロジェクト
                    </Label>
                    <Textarea 
                      id="innovation-projects" 
                      placeholder="DX推進、新看護方式導入、業務革新など"
                      className="min-h-[100px] mt-2"
                    />
                  </div>

                  <div>
                    <Label>イノベーション領域（複数選択可）</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="innov-digital" />
                        <Label htmlFor="innov-digital" className="ml-2">デジタル化・IT活用</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="innov-process" />
                        <Label htmlFor="innov-process" className="ml-2">業務プロセス革新</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="innov-service" />
                        <Label htmlFor="innov-service" className="ml-2">新サービス開発</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="innov-culture" />
                        <Label htmlFor="innov-culture" className="ml-2">組織文化変革</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="change-resistance">変革への抵抗と対策</Label>
                    <Textarea 
                      id="change-resistance" 
                      placeholder="抵抗要因、説得方法、段階的導入など"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">8. 組織間連携と影響力（4分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cross-department">部門間連携の実績</Label>
                    <Textarea 
                      id="cross-department" 
                      placeholder="他部署との協働プロジェクト、相互支援など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="external-network">院外ネットワーク</Label>
                    <Textarea 
                      id="external-network" 
                      placeholder="地域連携、学会活動、ベンチマーキングなど"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">
                      組織への影響力
                    </Label>
                    <div className="flex items-center space-x-4 mt-3">
                      <span className="text-sm w-16">低い</span>
                      <Slider 
                        defaultValue={[70]} 
                        max={100} 
                        step={10}
                        className="flex-1"
                      />
                      <span className="text-sm w-16">高い</span>
                    </div>
                    <Textarea 
                      id="influence-examples" 
                      placeholder="政策提言、組織改革への貢献など"
                      className="min-h-[60px] mt-3"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 育成計画タブ（10分） */}
            <TabsContent value="development" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">9. 自己のキャリア開発（5分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">キャリアビジョン</Label>
                    <RadioGroup className="space-y-2 mt-3">
                      <div className="flex items-center">
                        <RadioGroupItem value="executive" id="career-e" />
                        <Label htmlFor="career-e" className="ml-2">
                          看護部長・副院長を目指す
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="specialist" id="career-s" />
                        <Label htmlFor="career-s" className="ml-2">
                          専門性を極めた管理者
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="consultant" id="career-c" />
                        <Label htmlFor="career-c" className="ml-2">
                          コンサルタント・教育者
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="current" id="career-cu" />
                        <Label htmlFor="career-cu" className="ml-2">
                          現職でのさらなる成長
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="development-needs">自己開発ニーズ</Label>
                    <Textarea 
                      id="development-needs" 
                      placeholder="強化したいスキル、学びたい分野など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="learning-plan">学習・成長計画</Label>
                    <Textarea 
                      id="learning-plan" 
                      placeholder="研修参加、資格取得、外部活動など"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">10. アクションプランと支援（5分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="quarterly-goals">今四半期の重点目標（3つ）</Label>
                    <Textarea 
                      id="quarterly-goals" 
                      placeholder="1. 経営目標: \n2. 組織変革: \n3. 人材育成: "
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="required-support">必要な組織的支援</Label>
                    <Textarea 
                      id="required-support" 
                      placeholder="権限委譲、予算配分、経営層の後押しなど"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">師長のワークライフバランス</Label>
                    <RadioGroup className="grid grid-cols-4 gap-3 mt-3">
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="excellent" id="wlb-e" />
                        <Label htmlFor="wlb-e" className="mt-1 text-sm">良好</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="good" id="wlb-g" />
                        <Label htmlFor="wlb-g" className="mt-1 text-sm">概ね良好</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="challenging" id="wlb-c" />
                        <Label htmlFor="wlb-c" className="mt-1 text-sm">課題あり</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="critical" id="wlb-cr" />
                        <Label htmlFor="wlb-cr" className="mt-1 text-sm">要改善</Label>
                      </div>
                    </RadioGroup>
                    <div className="mt-3">
                      <Label htmlFor="wellness-plan">健康・ウェルビーイング支援</Label>
                      <Textarea 
                        id="wellness-plan" 
                        placeholder="業務量調整、休暇取得促進など"
                        className="min-h-[60px] mt-2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 面談者記入欄 */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-lg mb-4">面談者記入欄</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <Label className="text-base font-semibold">総合評価</Label>
                      <RadioGroup className="space-y-1 mt-2">
                        <div className="flex items-center">
                          <RadioGroupItem value="outstanding" id="eval-o" />
                          <Label htmlFor="eval-o" className="ml-2 text-sm">卓越</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="exceeds" id="eval-e" />
                          <Label htmlFor="eval-e" className="ml-2 text-sm">期待以上</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="meets" id="eval-m" />
                          <Label htmlFor="eval-m" className="ml-2 text-sm">期待通り</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="below" id="eval-b" />
                          <Label htmlFor="eval-b" className="ml-2 text-sm">要改善</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <Label className="text-base font-semibold">昇進可能性</Label>
                      <RadioGroup className="space-y-1 mt-2">
                        <div className="flex items-center">
                          <RadioGroupItem value="immediate" id="promo-i" />
                          <Label htmlFor="promo-i" className="ml-2 text-sm">即可能</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="1-2years" id="promo-12" />
                          <Label htmlFor="promo-12" className="ml-2 text-sm">1-2年</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="3years" id="promo-3" />
                          <Label htmlFor="promo-3" className="ml-2 text-sm">3年以上</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="lateral" id="promo-l" />
                          <Label htmlFor="promo-l" className="ml-2 text-sm">横展開</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <Label className="text-base font-semibold">組織貢献度</Label>
                      <RadioGroup className="space-y-1 mt-2">
                        <div className="flex items-center">
                          <RadioGroupItem value="critical" id="contrib-c" />
                          <Label htmlFor="contrib-c" className="ml-2 text-sm">最重要</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="high" id="contrib-h" />
                          <Label htmlFor="contrib-h" className="ml-2 text-sm">重要</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="standard" id="contrib-s" />
                          <Label htmlFor="contrib-s" className="ml-2 text-sm">標準</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="developing" id="contrib-d" />
                          <Label htmlFor="contrib-d" className="ml-2 text-sm">発展途上</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="executive-assessment">経営的観点からの評価</Label>
                    <Textarea 
                      id="executive-assessment" 
                      placeholder="戦略的思考、実行力、リーダーシップ、将来性など"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="development-recommendations">育成・配置の推奨</Label>
                    <Textarea 
                      id="development-recommendations" 
                      placeholder="次のポジション、必要な経験、育成方法など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="board-report">経営会議への報告事項</Label>
                    <Textarea 
                      id="board-report" 
                      placeholder="特筆すべき成果、重要提案、組織課題など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="next-interview">次回面談予定</Label>
                      <Input type="date" id="next-interview" />
                    </div>
                    <div>
                      <Label htmlFor="review-meeting">評価会議日</Label>
                      <Input type="date" id="review-meeting" />
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