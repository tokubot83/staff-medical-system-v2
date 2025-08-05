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
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SeniorNurse45MinInterview() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            中堅看護師面談シート（45分版）
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            次世代リーダー育成と組織貢献を促進する戦略的面談
          </p>
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              各項目で選択式評価と詳細記述の両方を記入してください。
              リーダーシップ開発と組織改善の両面で活用されます。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="leadership">リーダーシップ</TabsTrigger>
              <TabsTrigger value="expertise">専門性</TabsTrigger>
              <TabsTrigger value="contribution">組織貢献</TabsTrigger>
              <TabsTrigger value="career">キャリア</TabsTrigger>
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
                    <Label htmlFor="years">勤続年数</Label>
                    <Input type="text" id="years" placeholder="8年3ヶ月" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="qualifications">保有資格</Label>
                    <Textarea 
                      id="qualifications" 
                      placeholder="認定看護師、専門資格など"
                      className="min-h-[60px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="roles">現在の役割</Label>
                    <Textarea 
                      id="roles" 
                      placeholder="チームリーダー、プリセプター、委員会など"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* リーダーシップタブ（10分） */}
            <TabsContent value="leadership" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">1. リーダーシップ発揮状況（5分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">リーダーシップ能力</Label>
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
                        <Label htmlFor="lead-1" className="mt-1 text-sm">要育成</Label>
                      </div>
                    </RadioGroup>
                    <div className="mt-3">
                      <Label htmlFor="lead-examples">リーダーシップ発揮の具体例</Label>
                      <Textarea 
                        id="lead-examples" 
                        placeholder="チーム運営、問題解決、後輩指導などの成功事例"
                        className="min-h-[80px] mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>現在のリーダー業務（複数選択可）</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="lead-team" />
                        <Label htmlFor="lead-team" className="ml-2">チームリーダー</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="lead-preceptor" />
                        <Label htmlFor="lead-preceptor" className="ml-2">プリセプター</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="lead-project" />
                        <Label htmlFor="lead-project" className="ml-2">プロジェクトリーダー</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="lead-committee" />
                        <Label htmlFor="lead-committee" className="ml-2">委員会リーダー</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="lead-education" />
                        <Label htmlFor="lead-education" className="ml-2">教育担当</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="lead-quality" />
                        <Label htmlFor="lead-quality" className="ml-2">業務改善リーダー</Label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">
                      この3ヶ月で最も成長したリーダーシップスキル
                    </Label>
                    <Textarea 
                      id="leadership-growth" 
                      placeholder="コミュニケーション、意思決定、動機付けなど"
                      className="min-h-[80px] mt-2"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">2. 後輩育成・メンタリング（5分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mentoring-count">現在指導している後輩数</Label>
                    <Input type="number" id="mentoring-count" placeholder="3" />
                  </div>

                  <div>
                    <Label htmlFor="mentoring-success">後輩育成での成功体験</Label>
                    <Textarea 
                      id="mentoring-success" 
                      placeholder="効果的だった指導方法、後輩の成長事例など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mentoring-challenges">指導上の課題と改善点</Label>
                    <Textarea 
                      id="mentoring-challenges" 
                      placeholder="難しさを感じる点、必要なスキルなど"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 専門性タブ（8分） */}
            <TabsContent value="expertise" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">3. 専門性の深化と活用（4分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">専門性のレベル</Label>
                    <RadioGroup className="space-y-2 mt-3">
                      <div className="flex items-center">
                        <RadioGroupItem value="expert" id="expert-e" />
                        <Label htmlFor="expert-e" className="ml-2">
                          エキスパート（院内の第一人者）
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="advanced" id="expert-a" />
                        <Label htmlFor="expert-a" className="ml-2">
                          上級（指導可能レベル）
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="intermediate" id="expert-i" />
                        <Label htmlFor="expert-i" className="ml-2">
                          中級（独立して実践可能）
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="developing" id="expert-d" />
                        <Label htmlFor="expert-d" className="ml-2">
                          発展途上（学習中）
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="specialty-area">専門領域と実績</Label>
                    <Textarea 
                      id="specialty-area" 
                      placeholder="専門分野、論文、学会発表、院内勉強会など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="knowledge-sharing">知識共有の実践</Label>
                    <Textarea 
                      id="knowledge-sharing" 
                      placeholder="勉強会開催、マニュアル作成、事例検討会など"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">4. 今後の専門性開発（4分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>目指す資格・認定（複数選択可）</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="cert-specialist" />
                        <Label htmlFor="cert-specialist" className="ml-2">専門看護師</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="cert-certified" />
                        <Label htmlFor="cert-certified" className="ml-2">認定看護師</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="cert-manager" />
                        <Label htmlFor="cert-manager" className="ml-2">認定看護管理者</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="cert-instructor" />
                        <Label htmlFor="cert-instructor" className="ml-2">実習指導者</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="cert-academic" />
                        <Label htmlFor="cert-academic" className="ml-2">大学院進学</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="cert-other" />
                        <Label htmlFor="cert-other" className="ml-2">その他専門資格</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="development-plan">専門性向上の計画</Label>
                    <Textarea 
                      id="development-plan" 
                      placeholder="今後1-3年の学習計画、必要な支援など"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 組織貢献タブ（8分） */}
            <TabsContent value="contribution" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">5. 組織への貢献（4分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">組織貢献度</Label>
                    <RadioGroup className="grid grid-cols-5 gap-3 mt-3">
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="5" id="contrib-5" />
                        <Label htmlFor="contrib-5" className="mt-1 text-sm">非常に高い</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="4" id="contrib-4" />
                        <Label htmlFor="contrib-4" className="mt-1 text-sm">高い</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="3" id="contrib-3" />
                        <Label htmlFor="contrib-3" className="mt-1 text-sm">標準</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="2" id="contrib-2" />
                        <Label htmlFor="contrib-2" className="mt-1 text-sm">やや低い</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="1" id="contrib-1" />
                        <Label htmlFor="contrib-1" className="mt-1 text-sm">低い</Label>
                      </div>
                    </RadioGroup>
                    <div className="mt-3">
                      <Label htmlFor="contrib-examples">具体的な貢献内容</Label>
                      <Textarea 
                        id="contrib-examples" 
                        placeholder="業務改善、新人育成、委員会活動など"
                        className="min-h-[80px] mt-2"
                      />
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">
                      組織改善のための提案（3つまで）
                    </Label>
                    <Textarea 
                      id="improvement-proposals" 
                      placeholder="1. \n2. \n3. "
                      className="min-h-[100px] mt-2"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">6. イノベーション・改革（4分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="innovation-ideas">新しい取り組みのアイデア</Label>
                    <Textarea 
                      id="innovation-ideas" 
                      placeholder="業務効率化、新サービス、教育プログラムなど"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="change-leadership">変革リーダーとしての意欲</Label>
                    <Textarea 
                      id="change-leadership" 
                      placeholder="組織変革にどう関わりたいか"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* キャリアタブ（8分） */}
            <TabsContent value="career" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">7. 働き方とライフプラン（4分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">理想の働き方</Label>
                    <RadioGroup className="space-y-2 mt-3">
                      <div className="flex items-center">
                        <RadioGroupItem value="management" id="work-m" />
                        <Label htmlFor="work-m" className="ml-2">
                          管理職として組織をリード
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="specialist" id="work-s" />
                        <Label htmlFor="work-s" className="ml-2">
                          スペシャリストとして専門性を極める
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="educator" id="work-e" />
                        <Label htmlFor="work-e" className="ml-2">
                          教育者として後進を育成
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="balanced" id="work-b" />
                        <Label htmlFor="work-b" className="ml-2">
                          現場実践とマネジメントの両立
                        </Label>
                      </div>
                    </RadioGroup>
                    <div className="mt-3">
                      <Label htmlFor="work-style-detail">具体的な希望</Label>
                      <Textarea 
                        id="work-style-detail" 
                        placeholder="役職、責任範囲、勤務形態など"
                        className="min-h-[60px] mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="life-events">今後3-5年のライフイベント</Label>
                    <Textarea 
                      id="life-events" 
                      placeholder="家族計画、進学、転居など（プライバシーに配慮し任意）"
                      className="min-h-[60px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="work-life-integration">仕事と人生の統合</Label>
                    <Textarea 
                      id="work-life-integration" 
                      placeholder="仕事を通じて実現したいこと、人生の目標など"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">8. キャリアビジョン（4分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">
                      5年後もこの組織で活躍しているイメージが持てますか？
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
                        placeholder="組織の魅力、課題、外部機会など"
                        className="min-h-[60px] mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="career-aspiration">10年後の理想像</Label>
                    <Textarea 
                      id="career-aspiration" 
                      placeholder="どんな看護師・リーダーになっていたいか"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="succession-readiness">後継者としての準備</Label>
                    <Textarea 
                      id="succession-readiness" 
                      placeholder="管理職への意欲、必要な準備など"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 育成計画タブ（11分） */}
            <TabsContent value="development" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">9. 必要な支援と育成（5分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>優先的に必要な支援（上位3つ）</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="support-leadership" />
                        <Label htmlFor="support-leadership" className="ml-2">リーダーシップ研修</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="support-management" />
                        <Label htmlFor="support-management" className="ml-2">マネジメントスキル</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="support-mentor" />
                        <Label htmlFor="support-mentor" className="ml-2">メンター制度</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="support-project" />
                        <Label htmlFor="support-project" className="ml-2">プロジェクト機会</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="support-network" />
                        <Label htmlFor="support-network" className="ml-2">外部ネットワーク</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="support-authority" />
                        <Label htmlFor="support-authority" className="ml-2">権限委譲</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="development-needs">具体的な育成ニーズ</Label>
                    <Textarea 
                      id="development-needs" 
                      placeholder="スキルギャップ、経験不足の領域など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="stretch-assignments">ストレッチアサインメント</Label>
                    <Textarea 
                      id="stretch-assignments" 
                      placeholder="挑戦したいプロジェクト、新しい役割など"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">10. アクションプラン（6分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="quarterly-goals">今四半期の重点目標</Label>
                    <Textarea 
                      id="quarterly-goals" 
                      placeholder="リーダーシップ、専門性、組織貢献の各領域で1つずつ"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="action-items">合意したアクション</Label>
                    <Textarea 
                      id="action-items" 
                      placeholder="本人：\n上司：\n組織：\nメンター："
                      className="min-h-[120px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="success-metrics">成功指標</Label>
                    <Textarea 
                      id="success-metrics" 
                      placeholder="目標達成の測定方法、期限など"
                      className="min-h-[80px]"
                    />
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
                      <Label className="text-base font-semibold">昇進準備度</Label>
                      <RadioGroup className="space-y-1 mt-2">
                        <div className="flex items-center">
                          <RadioGroupItem value="ready" id="promo-r" />
                          <Label htmlFor="promo-r" className="ml-2 text-sm">準備完了</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="1year" id="promo-1" />
                          <Label htmlFor="promo-1" className="ml-2 text-sm">1年以内</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="2years" id="promo-2" />
                          <Label htmlFor="promo-2" className="ml-2 text-sm">2年以内</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="not-ready" id="promo-n" />
                          <Label htmlFor="promo-n" className="ml-2 text-sm">未準備</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg">
                      <Label className="text-base font-semibold">離職リスク</Label>
                      <RadioGroup className="space-y-1 mt-2">
                        <div className="flex items-center">
                          <RadioGroupItem value="low" id="risk-l" />
                          <Label htmlFor="risk-l" className="ml-2 text-sm">低い</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="medium" id="risk-m" />
                          <Label htmlFor="risk-m" className="ml-2 text-sm">中程度</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="high" id="risk-h" />
                          <Label htmlFor="risk-h" className="ml-2 text-sm">高い</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="critical" id="risk-c" />
                          <Label htmlFor="risk-c" className="ml-2 text-sm">危機的</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="talent-assessment">タレント評価</Label>
                    <Textarea 
                      id="talent-assessment" 
                      placeholder="強み、ポテンシャル、育成ポイントなど"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="succession-recommendation">後継者育成計画</Label>
                    <Textarea 
                      id="succession-recommendation" 
                      placeholder="次のポジション、必要な経験、タイムラインなど"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="executive-report">経営層への報告事項</Label>
                    <Textarea 
                      id="executive-report" 
                      placeholder="特筆すべき人材、重要な提案、リスクなど"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="next-interview">次回面談予定</Label>
                      <Input type="date" id="next-interview" />
                    </div>
                    <div>
                      <Label htmlFor="interim-review">中間レビュー</Label>
                      <Input type="date" id="interim-review" />
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