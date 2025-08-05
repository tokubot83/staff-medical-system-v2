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

export default function GeneralNurse30MinInterview() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            一般看護師面談シート（30分版）
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            キャリア開発と職場満足度向上のための詳細面談
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="work">業務状況</TabsTrigger>
              <TabsTrigger value="career">キャリア開発</TabsTrigger>
              <TabsTrigger value="environment">職場環境</TabsTrigger>
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
                    <Label htmlFor="position">職位</Label>
                    <Input type="text" id="position" placeholder="一般看護師" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="years">勤続年数</Label>
                    <Input type="text" id="years" placeholder="3年6ヶ月" />
                  </div>
                  <div>
                    <Label htmlFor="last-interview">前回面談日</Label>
                    <Input type="date" id="last-interview" />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 業務状況タブ（8分） */}
            <TabsContent value="work" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">1. 現在の業務状況（4分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>業務量の適正度</Label>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm">少ない</span>
                      <Slider 
                        defaultValue={[50]} 
                        max={100} 
                        step={10}
                        className="flex-1"
                      />
                      <span className="text-sm">多い</span>
                    </div>
                  </div>

                  <div>
                    <Label>業務の難易度</Label>
                    <RadioGroup className="flex space-x-4 mt-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="easy" id="difficulty-e" />
                        <Label htmlFor="difficulty-e" className="ml-2">易しい</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="appropriate" id="difficulty-a" />
                        <Label htmlFor="difficulty-a" className="ml-2">適正</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="challenging" id="difficulty-c" />
                        <Label htmlFor="difficulty-c" className="ml-2">やや難しい</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="difficult" id="difficulty-d" />
                        <Label htmlFor="difficulty-d" className="ml-2">非常に難しい</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="current-tasks">現在の主な担当業務</Label>
                    <Textarea 
                      id="current-tasks" 
                      placeholder="委員会活動、プリセプター業務、特殊業務など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label>得意な業務分野（複数選択可）</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="strength-acute" />
                        <Label htmlFor="strength-acute" className="ml-2">急性期ケア</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="strength-chronic" />
                        <Label htmlFor="strength-chronic" className="ml-2">慢性期ケア</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="strength-emergency" />
                        <Label htmlFor="strength-emergency" className="ml-2">救急対応</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="strength-patient" />
                        <Label htmlFor="strength-patient" className="ml-2">患者対応</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="strength-family" />
                        <Label htmlFor="strength-family" className="ml-2">家族対応</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="strength-teaching" />
                        <Label htmlFor="strength-teaching" className="ml-2">後輩指導</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">2. 業務上の課題と改善（4分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="challenges">現在直面している課題</Label>
                    <Textarea 
                      id="challenges" 
                      placeholder="業務上の困難、改善が必要な点など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="improvement-ideas">業務改善のアイデア</Label>
                    <Textarea 
                      id="improvement-ideas" 
                      placeholder="効率化、質の向上、チーム連携など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label>必要なサポート</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="support-skill" />
                        <Label htmlFor="support-skill" className="ml-2">スキルアップ研修</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="support-mentor" />
                        <Label htmlFor="support-mentor" className="ml-2">メンター制度</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="support-workload" />
                        <Label htmlFor="support-workload" className="ml-2">業務量調整</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="support-resource" />
                        <Label htmlFor="support-resource" className="ml-2">リソース追加</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* キャリア開発タブ（10分） */}
            <TabsContent value="career" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">3. キャリアビジョン（5分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="career-vision">5年後の理想の姿</Label>
                    <Textarea 
                      id="career-vision" 
                      placeholder="どのような看護師になりたいか、どんな役割を担いたいか"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label>興味のあるキャリアパス</Label>
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
                        <Checkbox id="path-researcher" />
                        <Label htmlFor="path-researcher" className="ml-2">研究・学術</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="path-other" />
                        <Label htmlFor="path-other" className="ml-2">その他</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="career-obstacles">キャリア形成の障壁</Label>
                    <Textarea 
                      id="career-obstacles" 
                      placeholder="時間、費用、家庭の事情など"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">4. スキル開発計画（5分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="skill-goals">習得したいスキル・知識</Label>
                    <Textarea 
                      id="skill-goals" 
                      placeholder="具体的な技術、資格、知識領域など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label>希望する学習方法</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="learn-internal" />
                        <Label htmlFor="learn-internal" className="ml-2">院内研修</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="learn-external" />
                        <Label htmlFor="learn-external" className="ml-2">外部研修</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="learn-online" />
                        <Label htmlFor="learn-online" className="ml-2">e-ラーニング</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="learn-conference" />
                        <Label htmlFor="learn-conference" className="ml-2">学会・セミナー</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="development-plan">今後1年間の学習計画</Label>
                    <Textarea 
                      id="development-plan" 
                      placeholder="具体的な目標と期限"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 職場環境タブ（12分） */}
            <TabsContent value="environment" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">5. 職場満足度（6分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <Label className="text-base font-semibold">各項目の満足度</Label>
                    <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                      <div></div>
                      <div className="bg-green-100 px-2 py-1 rounded">5</div>
                      <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                      <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                      <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                      <div className="bg-red-100 px-2 py-1 rounded">1</div>
                    </div>
                    
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

                  <div>
                    <Label htmlFor="satisfaction-detail">特に改善を希望する点</Label>
                    <Textarea 
                      id="satisfaction-detail" 
                      placeholder="具体的な改善要望"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">6. ワークライフバランス（6分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>現在の状態</Label>
                    <RadioGroup className="flex space-x-4 mt-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="balanced" id="wlb-b" />
                        <Label htmlFor="wlb-b" className="ml-2">バランス良好</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="work-heavy" id="wlb-w" />
                        <Label htmlFor="wlb-w" className="ml-2">仕事偏重</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="struggling" id="wlb-s" />
                        <Label htmlFor="wlb-s" className="ml-2">両立困難</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="personal-situation">プライベートの状況</Label>
                    <Textarea 
                      id="personal-situation" 
                      placeholder="家族の状況、介護、育児、その他配慮が必要な事項"
                      className="min-h-[60px]"
                    />
                  </div>

                  <div>
                    <Label>希望する働き方</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="work-style-flexible" />
                        <Label htmlFor="work-style-flexible" className="ml-2">フレックス勤務</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="work-style-part" />
                        <Label htmlFor="work-style-part" className="ml-2">時短勤務</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="work-style-night" />
                        <Label htmlFor="work-style-night" className="ml-2">夜勤免除</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="work-style-remote" />
                        <Label htmlFor="work-style-remote" className="ml-2">在宅勤務（可能な業務）</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="retention">今後の勤続意向</Label>
                    <RadioGroup className="space-y-2 mt-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="long-term" id="retention-l" />
                        <Label htmlFor="retention-l" className="ml-2">長期的に続けたい</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="medium-term" id="retention-m" />
                        <Label htmlFor="retention-m" className="ml-2">当面は続ける予定</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="considering" id="retention-c" />
                        <Label htmlFor="retention-c" className="ml-2">転職を検討中</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="undecided" id="retention-u" />
                        <Label htmlFor="retention-u" className="ml-2">未定</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* 面談者記入欄 */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-lg mb-4">面談者記入欄</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>総合評価</Label>
                    <RadioGroup className="flex space-x-3 mt-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="excellent" id="overall-e" />
                        <Label htmlFor="overall-e" className="ml-2">優秀</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="good" id="overall-g" />
                        <Label htmlFor="overall-g" className="ml-2">良好</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="fair" id="overall-f" />
                        <Label htmlFor="overall-f" className="ml-2">標準</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="concern" id="overall-c" />
                        <Label htmlFor="overall-c" className="ml-2">要観察</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="risk" id="overall-r" />
                        <Label htmlFor="overall-r" className="ml-2">離職リスク</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="interviewer-assessment">面談者所見</Label>
                    <Textarea 
                      id="interviewer-assessment" 
                      placeholder="強み、改善点、懸念事項、今後の方向性など"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="follow-up">フォローアップ事項</Label>
                    <Textarea 
                      id="follow-up" 
                      placeholder="上司への報告、人事への連携、具体的な支援内容など"
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