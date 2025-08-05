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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SeniorNurse30MinInterview() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            中堅看護師面談シート（30分版）
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            次世代リーダー育成と組織貢献度評価のための包括的面談
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="leadership">リーダーシップ</TabsTrigger>
              <TabsTrigger value="expertise">専門性</TabsTrigger>
              <TabsTrigger value="contribution">組織貢献</TabsTrigger>
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
                  <Input type="text" id="time" placeholder="14:00-14:30" />
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

            {/* リーダーシップタブ（8分） */}
            <TabsContent value="leadership" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">1. リーダーシップ実践状況（4分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>リーダーシップ発揮場面</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="lead-daily" />
                        <Label htmlFor="lead-daily" className="ml-2">日常業務でのリード</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="lead-emergency" />
                        <Label htmlFor="lead-emergency" className="ml-2">緊急時の指揮</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="lead-project" />
                        <Label htmlFor="lead-project" className="ml-2">プロジェクト推進</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="lead-teaching" />
                        <Label htmlFor="lead-teaching" className="ml-2">教育・指導</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="lead-coordination" />
                        <Label htmlFor="lead-coordination" className="ml-2">部門間調整</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="lead-innovation" />
                        <Label htmlFor="lead-innovation" className="ml-2">改善活動主導</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="leadership-achievements">リーダーシップの成果</Label>
                    <Textarea 
                      id="leadership-achievements" 
                      placeholder="チーム運営での成功事例、後輩育成の実績など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label>リーダーシップスタイル</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="主なスタイルを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="directive">指示型</SelectItem>
                        <SelectItem value="coaching">コーチング型</SelectItem>
                        <SelectItem value="supportive">支援型</SelectItem>
                        <SelectItem value="delegating">委任型</SelectItem>
                        <SelectItem value="situational">状況対応型</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">2. 後輩育成・メンタリング（4分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mentoring-count">現在指導している後輩数</Label>
                    <Input type="number" id="mentoring-count" placeholder="3" />
                  </div>

                  <div>
                    <Label>後輩指導での強み</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="mentor-technical" />
                        <Label htmlFor="mentor-technical" className="ml-2">技術指導</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="mentor-emotional" />
                        <Label htmlFor="mentor-emotional" className="ml-2">精神的サポート</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="mentor-career" />
                        <Label htmlFor="mentor-career" className="ml-2">キャリア相談</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="mentor-assessment" />
                        <Label htmlFor="mentor-assessment" className="ml-2">評価・フィードバック</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="mentoring-challenges">指導上の課題</Label>
                    <Textarea 
                      id="mentoring-challenges" 
                      placeholder="世代間ギャップ、時間確保、指導方法など"
                      className="min-h-[60px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mentoring-needs">指導力向上のためのニーズ</Label>
                    <Textarea 
                      id="mentoring-needs" 
                      placeholder="研修受講、ロールモデル、ツール整備など"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 専門性タブ（7分） */}
            <TabsContent value="expertise" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">3. 専門性の深化（4分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="specialty-area">専門領域</Label>
                    <Input type="text" id="specialty-area" placeholder="救急看護、がん看護、感染管理など" />
                  </div>

                  <div>
                    <Label>専門性のレベル</Label>
                    <RadioGroup className="space-y-2 mt-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="expert" id="level-e" />
                        <Label htmlFor="level-e" className="ml-2">エキスパート（院内で第一人者）</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="advanced" id="level-a" />
                        <Label htmlFor="level-a" className="ml-2">上級（指導可能レベル）</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="intermediate" id="level-i" />
                        <Label htmlFor="level-i" className="ml-2">中級（独立して実践可能）</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="developing" id="level-d" />
                        <Label htmlFor="level-d" className="ml-2">発展途上（学習中）</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="expertise-activities">専門性向上の活動</Label>
                    <Textarea 
                      id="expertise-activities" 
                      placeholder="学会参加、論文執筆、院内勉強会主催など"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">4. 知識・スキルの共有（3分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>知識共有の方法</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="share-presentation" />
                        <Label htmlFor="share-presentation" className="ml-2">勉強会・研修講師</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="share-manual" />
                        <Label htmlFor="share-manual" className="ml-2">マニュアル作成</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="share-case" />
                        <Label htmlFor="share-case" className="ml-2">事例検討会主催</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="share-mentoring" />
                        <Label htmlFor="share-mentoring" className="ml-2">個別指導</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="knowledge-impact">知識共有の影響・成果</Label>
                    <Textarea 
                      id="knowledge-impact" 
                      placeholder="チームのスキル向上、業務改善への貢献など"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 組織貢献タブ（8分） */}
            <TabsContent value="contribution" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">5. 組織への貢献度（4分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>委員会・プロジェクト参加</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="committee-safety" />
                        <Label htmlFor="committee-safety" className="ml-2">医療安全委員会</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="committee-infection" />
                        <Label htmlFor="committee-infection" className="ml-2">感染対策委員会</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="committee-education" />
                        <Label htmlFor="committee-education" className="ml-2">教育委員会</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="committee-quality" />
                        <Label htmlFor="committee-quality" className="ml-2">業務改善委員会</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="committee-research" />
                        <Label htmlFor="committee-research" className="ml-2">看護研究</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="committee-other" />
                        <Label htmlFor="committee-other" className="ml-2">その他</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="contribution-achievements">組織貢献の具体的成果</Label>
                    <Textarea 
                      id="contribution-achievements" 
                      placeholder="導入した改善策、解決した課題、創出した価値など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label>イノベーション・改善提案</Label>
                    <RadioGroup className="flex space-x-3 mt-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="frequent" id="innovation-f" />
                        <Label htmlFor="innovation-f" className="ml-2">積極的</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="occasional" id="innovation-o" />
                        <Label htmlFor="innovation-o" className="ml-2">時々</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="rare" id="innovation-r" />
                        <Label htmlFor="innovation-r" className="ml-2">まれ</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="none" id="innovation-n" />
                        <Label htmlFor="innovation-n" className="ml-2">なし</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">6. 他部門との連携（4分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>連携の質</Label>
                    <RadioGroup className="grid grid-cols-4 gap-2 mt-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="excellent" id="collab-e" />
                        <Label htmlFor="collab-e" className="ml-2">優秀</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="good" id="collab-g" />
                        <Label htmlFor="collab-g" className="ml-2">良好</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="fair" id="collab-f" />
                        <Label htmlFor="collab-f" className="ml-2">普通</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="poor" id="collab-p" />
                        <Label htmlFor="collab-p" className="ml-2">要改善</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="collaboration-examples">効果的な連携事例</Label>
                    <Textarea 
                      id="collaboration-examples" 
                      placeholder="多職種連携、部門間プロジェクトなど"
                      className="min-h-[60px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="external-activities">院外活動・地域貢献</Label>
                    <Textarea 
                      id="external-activities" 
                      placeholder="看護協会活動、地域講演、ボランティアなど"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 育成計画タブ（7分） */}
            <TabsContent value="development" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">7. キャリア開発計画（4分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="career-aspiration">3-5年後のキャリア目標</Label>
                    <Textarea 
                      id="career-aspiration" 
                      placeholder="管理職、専門看護師、教育担当など具体的な目標"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label>推奨キャリアパス</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="適性に基づく推奨パスを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="management">看護管理者路線</SelectItem>
                        <SelectItem value="specialist">スペシャリスト路線</SelectItem>
                        <SelectItem value="educator">教育者路線</SelectItem>
                        <SelectItem value="generalist">ジェネラリスト路線</SelectItem>
                        <SelectItem value="researcher">研究者路線</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="development-actions">必要な育成アクション</Label>
                    <Textarea 
                      id="development-actions" 
                      placeholder="研修計画、ローテーション、メンタリングなど"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">8. サクセッションプラン（3分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>後継者候補としての評価</Label>
                    <RadioGroup className="space-y-2 mt-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="ready-now" id="succession-rn" />
                        <Label htmlFor="succession-rn" className="ml-2">即戦力（準備完了）</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="ready-1year" id="succession-r1" />
                        <Label htmlFor="succession-r1" className="ml-2">1年以内に準備可能</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="ready-3years" id="succession-r3" />
                        <Label htmlFor="succession-r3" className="ml-2">3年以内に準備可能</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="not-suitable" id="succession-ns" />
                        <Label htmlFor="succession-ns" className="ml-2">管理職不適</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="succession-gaps">育成ギャップ</Label>
                    <Textarea 
                      id="succession-gaps" 
                      placeholder="不足しているスキル、経験、知識など"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>

              {/* 面談者総合評価 */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-lg mb-4">面談者総合評価</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>総合パフォーマンス</Label>
                    <RadioGroup className="flex space-x-3 mt-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="outstanding" id="perf-o" />
                        <Label htmlFor="perf-o" className="ml-2">卓越</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="exceeds" id="perf-e" />
                        <Label htmlFor="perf-e" className="ml-2">期待以上</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="meets" id="perf-m" />
                        <Label htmlFor="perf-m" className="ml-2">期待通り</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="below" id="perf-b" />
                        <Label htmlFor="perf-b" className="ml-2">要改善</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="retention-risk">離職リスク</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="リスクレベルを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">低い</SelectItem>
                        <SelectItem value="medium">中程度</SelectItem>
                        <SelectItem value="high">高い</SelectItem>
                        <SelectItem value="critical">危機的</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="final-assessment">面談者所見</Label>
                    <Textarea 
                      id="final-assessment" 
                      placeholder="総合的な評価、強み、課題、推奨事項など"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="action-plan">アクションプラン</Label>
                    <Textarea 
                      id="action-plan" 
                      placeholder="次回面談までの具体的行動計画"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="next-interview">次回面談予定</Label>
                    <Input type="date" id="next-interview" />
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