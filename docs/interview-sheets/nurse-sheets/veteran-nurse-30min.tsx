'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

export default function VeteranNurse30MinInterview() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            ベテラン看護師面談シート（30分版）
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            豊富な経験の活用と継続的な活躍支援のための包括的面談
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="health">健康・体力</TabsTrigger>
              <TabsTrigger value="expertise">専門性活用</TabsTrigger>
              <TabsTrigger value="succession">知識継承</TabsTrigger>
              <TabsTrigger value="future">今後の働き方</TabsTrigger>
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
                    <Input type="text" id="years" placeholder="20年3ヶ月" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="age">年齢</Label>
                    <Input type="number" id="age" placeholder="55" />
                  </div>
                  <div>
                    <Label htmlFor="retirement-age">定年まで</Label>
                    <Input type="text" id="retirement-age" placeholder="5年" />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="career-highlights">主な経歴・実績</Label>
                  <Textarea 
                    id="career-highlights" 
                    placeholder="特殊部門経験、表彰歴、プロジェクト実績など"
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 健康・体力タブ（6分） */}
            <TabsContent value="health" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">1. 健康状態の詳細確認（3分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>全体的な健康状態</Label>
                    <RadioGroup className="flex space-x-4 mt-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="excellent" id="health-e" />
                        <Label htmlFor="health-e" className="ml-2">良好</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="good" id="health-g" />
                        <Label htmlFor="health-g" className="ml-2">概ね良好</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="fair" id="health-f" />
                        <Label htmlFor="health-f" className="ml-2">要観察</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="poor" id="health-p" />
                        <Label htmlFor="health-p" className="ml-2">要配慮</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>健康上の懸念（複数選択可）</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="health-back" />
                        <Label htmlFor="health-back" className="ml-2">腰痛・関節痛</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="health-fatigue" />
                        <Label htmlFor="health-fatigue" className="ml-2">慢性的疲労</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="health-sleep" />
                        <Label htmlFor="health-sleep" className="ml-2">睡眠障害</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="health-stress" />
                        <Label htmlFor="health-stress" className="ml-2">ストレス</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="health-chronic" />
                        <Label htmlFor="health-chronic" className="ml-2">慢性疾患</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="health-other" />
                        <Label htmlFor="health-other" className="ml-2">その他</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="health-detail">健康面の詳細・配慮事項</Label>
                    <Textarea 
                      id="health-detail" 
                      placeholder="通院状況、服薬、必要な配慮など"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">2. 業務遂行上の体力面（3分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>体力的負担度</Label>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm">楽</span>
                      <Slider 
                        defaultValue={[50]} 
                        max={100} 
                        step={10}
                        className="flex-1"
                      />
                      <span className="text-sm">きつい</span>
                    </div>
                  </div>

                  <div>
                    <Label>負担の大きい業務</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="burden-night" />
                        <Label htmlFor="burden-night" className="ml-2">夜勤業務</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="burden-lift" />
                        <Label htmlFor="burden-lift" className="ml-2">患者の移乗・体位変換</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="burden-standing" />
                        <Label htmlFor="burden-standing" className="ml-2">長時間の立ち仕事</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="burden-emergency" />
                        <Label htmlFor="burden-emergency" className="ml-2">救急対応</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="physical-support">必要な体力的サポート</Label>
                    <Textarea 
                      id="physical-support" 
                      placeholder="補助器具、業務分担の見直しなど"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 専門性活用タブ（8分） */}
            <TabsContent value="expertise" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">3. 専門性と強みの棚卸し（4分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="specialties">保有する専門性・スキル</Label>
                    <Textarea 
                      id="specialties" 
                      placeholder="特殊技術、専門分野、希少な経験など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label>現在の専門性活用度</Label>
                    <RadioGroup className="grid grid-cols-5 gap-2 mt-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <div key={value} className="flex items-center">
                          <RadioGroupItem value={value.toString()} id={`utilization-${value}`} />
                          <Label htmlFor={`utilization-${value}`} className="ml-1">{value}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <p className="text-sm text-gray-500 mt-1">1:活用されていない ← → 5:十分活用</p>
                  </div>

                  <div>
                    <Label htmlFor="expertise-contribution">専門性を活かした貢献分野</Label>
                    <Textarea 
                      id="expertise-contribution" 
                      placeholder="現在貢献している領域、今後貢献したい領域"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">4. 組織への価値提供（4分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>現在の役割（複数選択可）</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="role-mentor" />
                        <Label htmlFor="role-mentor" className="ml-2">メンター・相談役</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="role-specialist" />
                        <Label htmlFor="role-specialist" className="ml-2">専門分野アドバイザー</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="role-trainer" />
                        <Label htmlFor="role-trainer" className="ml-2">技術指導者</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="role-culture" />
                        <Label htmlFor="role-culture" className="ml-2">組織文化の守護者</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="role-liaison" />
                        <Label htmlFor="role-liaison" className="ml-2">部門間調整役</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="role-quality" />
                        <Label htmlFor="role-quality" className="ml-2">品質管理責任者</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="unique-value">他者にない独自の価値</Label>
                    <Textarea 
                      id="unique-value" 
                      placeholder="経験、人脈、特殊スキルなど"
                      className="min-h-[60px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="value-enhancement">価値提供を高めるために必要なこと</Label>
                    <Textarea 
                      id="value-enhancement" 
                      placeholder="権限付与、時間確保、環境整備など"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 知識継承タブ（8分） */}
            <TabsContent value="succession" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">5. 知識・技術の継承計画（4分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="critical-knowledge">継承すべき重要な知識・技術</Label>
                    <Textarea 
                      id="critical-knowledge" 
                      placeholder="失われると困る知識、特殊技術、暗黙知など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label>継承方法の希望</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="succession-direct" />
                        <Label htmlFor="succession-direct" className="ml-2">直接指導（OJT）</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="succession-manual" />
                        <Label htmlFor="succession-manual" className="ml-2">マニュアル作成</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="succession-video" />
                        <Label htmlFor="succession-video" className="ml-2">動画記録</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="succession-workshop" />
                        <Label htmlFor="succession-workshop" className="ml-2">研修・講習会</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="succession-mentoring" />
                        <Label htmlFor="succession-mentoring" className="ml-2">メンタリング</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="succession-case" />
                        <Label htmlFor="succession-case" className="ml-2">事例検討会</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="succession-timeline">継承活動の時間確保</Label>
                    <Textarea 
                      id="succession-timeline" 
                      placeholder="週何時間程度、どのような形で実施可能か"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">6. 後進育成への意欲（4分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>後輩育成への関心度</Label>
                    <RadioGroup className="flex space-x-4 mt-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="very-high" id="interest-vh" />
                        <Label htmlFor="interest-vh" className="ml-2">非常に高い</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="high" id="interest-h" />
                        <Label htmlFor="interest-h" className="ml-2">高い</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="moderate" id="interest-m" />
                        <Label htmlFor="interest-m" className="ml-2">普通</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="low" id="interest-l" />
                        <Label htmlFor="interest-l" className="ml-2">低い</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="mentoring-experience">これまでの指導実績</Label>
                    <Textarea 
                      id="mentoring-experience" 
                      placeholder="プリセプター経験、指導した人数、成功事例など"
                      className="min-h-[60px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ideal-mentee">理想的な指導対象</Label>
                    <Textarea 
                      id="ideal-mentee" 
                      placeholder="新人、中堅、専門志向者など"
                      className="min-h-[60px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mentoring-support">指導活動に必要なサポート</Label>
                    <Textarea 
                      id="mentoring-support" 
                      placeholder="時間確保、評価への反映、教材準備支援など"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 今後の働き方タブ（8分） */}
            <TabsContent value="future" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">7. キャリアの最終章設計（4分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="career-vision">定年までの理想的な過ごし方</Label>
                    <Textarea 
                      id="career-vision" 
                      placeholder="どのような役割で、どんな貢献をしたいか"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label>希望する勤務形態の変化</Label>
                    <div className="space-y-3 mt-2">
                      <div>
                        <Label>現在 → 3年後</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="勤務形態を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full-time">フルタイム継続</SelectItem>
                            <SelectItem value="reduced-hours">時間短縮</SelectItem>
                            <SelectItem value="part-time">パートタイム</SelectItem>
                            <SelectItem value="flexible">フレキシブル</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>3年後 → 定年まで</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="勤務形態を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full-time">フルタイム継続</SelectItem>
                            <SelectItem value="reduced-hours">時間短縮</SelectItem>
                            <SelectItem value="part-time">パートタイム</SelectItem>
                            <SelectItem value="advisory">アドバイザー</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="work-life-balance">ワークライフバランスの希望</Label>
                    <Textarea 
                      id="work-life-balance" 
                      placeholder="プライベートの充実、趣味、家族との時間など"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">8. 定年後の展望（4分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>定年後の希望</Label>
                    <RadioGroup className="space-y-2 mt-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="reemployment" id="post-re" />
                        <Label htmlFor="post-re" className="ml-2">再雇用希望（同組織）</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="part-time-continue" id="post-pt" />
                        <Label htmlFor="post-pt" className="ml-2">パートで継続</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="other-facility" id="post-of" />
                        <Label htmlFor="post-of" className="ml-2">他施設で勤務</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="retirement" id="post-ret" />
                        <Label htmlFor="post-ret" className="ml-2">完全退職</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="undecided" id="post-und" />
                        <Label htmlFor="post-und" className="ml-2">未定</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="retirement-preparation">退職準備状況</Label>
                    <Textarea 
                      id="retirement-preparation" 
                      placeholder="経済面、生活設計、第二の人生計画など"
                      className="min-h-[60px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="legacy">組織に残したいレガシー</Label>
                    <Textarea 
                      id="legacy" 
                      placeholder="後輩への遺産、組織文化、改革など"
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
                    <Label>活躍継続可能性</Label>
                    <RadioGroup className="flex space-x-3 mt-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="high" id="continue-h" />
                        <Label htmlFor="continue-h" className="ml-2">高い</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="moderate" id="continue-m" />
                        <Label htmlFor="continue-m" className="ml-2">条件付き可能</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="limited" id="continue-l" />
                        <Label htmlFor="continue-l" className="ml-2">限定的</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="difficult" id="continue-d" />
                        <Label htmlFor="continue-d" className="ml-2">困難</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="optimization-plan">最適配置・活用計画</Label>
                    <Textarea 
                      id="optimization-plan" 
                      placeholder="役割変更、業務調整、特別任務など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="support-plan">必要な支援計画</Label>
                    <Textarea 
                      id="support-plan" 
                      placeholder="健康管理、スキル更新、モチベーション維持など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="interviewer-notes">面談者所見</Label>
                    <Textarea 
                      id="interviewer-notes" 
                      placeholder="強み、懸念事項、推奨事項など"
                      className="min-h-[100px]"
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