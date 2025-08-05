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

export default function VeteranNurse45MinInterview() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            ベテラン看護師面談シート（45分版）
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            経験の活用と継続的な活躍を支援する包括的面談
          </p>
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              各項目で選択式評価と詳細記述の両方を記入してください。
              知識継承と働き方の最適化に活用されます。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="health">健康・体力</TabsTrigger>
              <TabsTrigger value="satisfaction">満足度</TabsTrigger>
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
                    <Input type="text" id="years" placeholder="25年3ヶ月" />
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
                  <Label htmlFor="career-highlights">主な経歴・専門分野</Label>
                  <Textarea 
                    id="career-highlights" 
                    placeholder="特殊部門経験、専門資格、表彰歴など"
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 健康・体力タブ（8分） */}
            <TabsContent value="health" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">1. 健康状態の評価（4分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">総合的な健康状態</Label>
                    <RadioGroup className="grid grid-cols-4 gap-3 mt-3">
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="excellent" id="health-e" />
                        <Label htmlFor="health-e" className="mt-1 text-sm">良好</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="good" id="health-g" />
                        <Label htmlFor="health-g" className="mt-1 text-sm">概ね良好</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="fair" id="health-f" />
                        <Label htmlFor="health-f" className="mt-1 text-sm">要観察</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="poor" id="health-p" />
                        <Label htmlFor="health-p" className="mt-1 text-sm">要配慮</Label>
                      </div>
                    </RadioGroup>
                    <div className="mt-3">
                      <Label htmlFor="health-detail">具体的な健康状況</Label>
                      <Textarea 
                        id="health-detail" 
                        placeholder="持病、通院状況、体調の変化など"
                        className="min-h-[80px] mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>健康上の配慮事項（複数選択可）</Label>
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
                        <Checkbox id="health-vision" />
                        <Label htmlFor="health-vision" className="ml-2">視力低下</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="health-management">健康維持の取り組み</Label>
                    <Textarea 
                      id="health-management" 
                      placeholder="運動習慣、食生活、ストレス管理など"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">2. 業務遂行上の体力面（4分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">体力的負担度</Label>
                    <div className="flex items-center space-x-4 mt-3">
                      <span className="text-sm w-20">楽</span>
                      <Slider 
                        defaultValue={[50]} 
                        max={100} 
                        step={10}
                        className="flex-1"
                      />
                      <span className="text-sm w-20">きつい</span>
                    </div>
                    <div className="mt-3">
                      <Label htmlFor="physical-challenges">体力面での課題</Label>
                      <Textarea 
                        id="physical-challenges" 
                        placeholder="夜勤の辛さ、長時間立位、重量物の扱いなど"
                        className="min-h-[60px] mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>業務上の配慮希望（複数選択可）</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="adjust-night" />
                        <Label htmlFor="adjust-night" className="ml-2">夜勤の削減・免除</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="adjust-physical" />
                        <Label htmlFor="adjust-physical" className="ml-2">身体的負担の軽減</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="adjust-hours" />
                        <Label htmlFor="adjust-hours" className="ml-2">勤務時間の短縮</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="adjust-emergency" />
                        <Label htmlFor="adjust-emergency" className="ml-2">救急対応の減少</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="adjust-administrative" />
                        <Label htmlFor="adjust-administrative" className="ml-2">事務的業務へのシフト</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="adjust-support" />
                        <Label htmlFor="adjust-support" className="ml-2">補助器具の活用</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 満足度タブ（8分） */}
            <TabsContent value="satisfaction" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">3. モチベーションと満足度（4分）</h3>
                
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
                      <Label htmlFor="motive-factors">モチベーションの源泉</Label>
                      <Textarea 
                        id="motive-factors" 
                        placeholder="やりがい、使命感、人間関係など"
                        className="min-h-[80px] mt-2"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">
                      仕事を続けて良かったと思う瞬間
                    </Label>
                    <Textarea 
                      id="job-fulfillment" 
                      placeholder="患者さんとの思い出、後輩の成長、達成感など"
                      className="min-h-[100px] mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="workplace-attachment">この職場への愛着</Label>
                    <Textarea 
                      id="workplace-attachment" 
                      placeholder="組織の良い点、誇りに思うこと、守りたい文化など"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">4. ワークライフバランス（4分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>現在のバランス状態</Label>
                    <RadioGroup className="flex space-x-4 mt-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="balanced" id="wlb-b" />
                        <Label htmlFor="wlb-b" className="ml-2">良好</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="work-heavy" id="wlb-w" />
                        <Label htmlFor="wlb-w" className="ml-2">仕事偏重</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="struggling" id="wlb-s" />
                        <Label htmlFor="wlb-s" className="ml-2">両立困難</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="improving" id="wlb-i" />
                        <Label htmlFor="wlb-i" className="ml-2">改善中</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="personal-life">プライベートの充実度</Label>
                    <Textarea 
                      id="personal-life" 
                      placeholder="趣味、家族との時間、社会活動など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="stress-management">ストレス解消方法</Label>
                    <Textarea 
                      id="stress-management" 
                      placeholder="リフレッシュ方法、心の支えなど"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 専門性活用タブ（9分） */}
            <TabsContent value="expertise" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">5. 専門性と経験の棚卸し（5分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">
                      あなたの「強み」は何ですか？
                    </Label>
                    <Textarea 
                      id="strengths" 
                      placeholder="特殊技術、豊富な経験、人脈、判断力など"
                      className="min-h-[100px] mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="unique-value">他の人にはない独自の価値</Label>
                    <Textarea 
                      id="unique-value" 
                      placeholder="希少な経験、特殊な資格、歴史的知識など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label>現在活用できている専門性</Label>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm">0%</span>
                      <Slider 
                        defaultValue={[70]} 
                        max={100} 
                        step={10}
                        className="flex-1"
                      />
                      <span className="text-sm">100%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">6. 経験を活かした貢献（4分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>現在の貢献領域（複数選択可）</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="contrib-mentoring" />
                        <Label htmlFor="contrib-mentoring" className="ml-2">後輩指導・メンタリング</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="contrib-expertise" />
                        <Label htmlFor="contrib-expertise" className="ml-2">専門知識の提供</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="contrib-culture" />
                        <Label htmlFor="contrib-culture" className="ml-2">組織文化の継承</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="contrib-quality" />
                        <Label htmlFor="contrib-quality" className="ml-2">看護の質向上</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="contrib-crisis" />
                        <Label htmlFor="contrib-crisis" className="ml-2">危機管理・判断</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="contrib-innovation" />
                        <Label htmlFor="contrib-innovation" className="ml-2">改善・効率化</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="contribution-examples">具体的な貢献事例</Label>
                    <Textarea 
                      id="contribution-examples" 
                      placeholder="最近の成功事例、問題解決、後輩の成長支援など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">
                      もっと活かしたい経験・スキル
                    </Label>
                    <Textarea 
                      id="underutilized-skills" 
                      placeholder="十分に活用できていない能力、新しい役割への希望など"
                      className="min-h-[80px] mt-2"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 知識継承タブ（10分） */}
            <TabsContent value="succession" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">7. 知識・技術の継承（5分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">継承への意欲</Label>
                    <RadioGroup className="grid grid-cols-4 gap-3 mt-3">
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="very-high" id="succession-vh" />
                        <Label htmlFor="succession-vh" className="mt-1 text-sm">非常に高い</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="high" id="succession-h" />
                        <Label htmlFor="succession-h" className="mt-1 text-sm">高い</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="moderate" id="succession-m" />
                        <Label htmlFor="succession-m" className="mt-1 text-sm">普通</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="low" id="succession-l" />
                        <Label htmlFor="succession-l" className="mt-1 text-sm">低い</Label>
                      </div>
                    </RadioGroup>
                    <div className="mt-3">
                      <Label htmlFor="succession-motivation">継承したい理由・思い</Label>
                      <Textarea 
                        id="succession-motivation" 
                        placeholder="後輩への期待、組織への恩返しなど"
                        className="min-h-[60px] mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="critical-knowledge">絶対に継承すべき知識・技術</Label>
                    <Textarea 
                      id="critical-knowledge" 
                      placeholder="失われると困る暗黙知、特殊技術、判断基準など"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label>希望する継承方法（複数選択可）</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="method-direct" />
                        <Label htmlFor="method-direct" className="ml-2">直接指導（OJT）</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="method-manual" />
                        <Label htmlFor="method-manual" className="ml-2">マニュアル・手順書作成</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="method-video" />
                        <Label htmlFor="method-video" className="ml-2">動画・映像記録</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="method-workshop" />
                        <Label htmlFor="method-workshop" className="ml-2">勉強会・研修会</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="method-mentoring" />
                        <Label htmlFor="method-mentoring" className="ml-2">メンター制度</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="method-storytelling" />
                        <Label htmlFor="method-storytelling" className="ml-2">経験談の共有会</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">8. 後輩育成への関わり（5分）</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ideal-mentee">理想的な指導対象</Label>
                    <Textarea 
                      id="ideal-mentee" 
                      placeholder="どんな後輩に、何を伝えたいか"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mentoring-style">あなたの指導スタイル</Label>
                    <Textarea 
                      id="mentoring-style" 
                      placeholder="見守り型、実践型、理論型など"
                      className="min-h-[60px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="succession-timeline">知識継承に使える時間</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="週あたりの時間を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2hours">週1-2時間</SelectItem>
                        <SelectItem value="3-5hours">週3-5時間</SelectItem>
                        <SelectItem value="6-10hours">週6-10時間</SelectItem>
                        <SelectItem value="flexible">柔軟に対応可能</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 今後の働き方タブ（10分） */}
            <TabsContent value="future" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">9. 理想の働き方（5分）</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">今後の働き方の希望</Label>
                    <RadioGroup className="space-y-2 mt-3">
                      <div className="flex items-center">
                        <RadioGroupItem value="full-time" id="work-ft" />
                        <Label htmlFor="work-ft" className="ml-2">
                          現状維持（フルタイム継続）
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="reduced" id="work-r" />
                        <Label htmlFor="work-r" className="ml-2">
                          段階的に負担軽減
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="part-time" id="work-pt" />
                        <Label htmlFor="work-pt" className="ml-2">
                          パートタイムへ移行
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="advisory" id="work-a" />
                        <Label htmlFor="work-a" className="ml-2">
                          アドバイザー的役割
                        </Label>
                      </div>
                    </RadioGroup>
                    <div className="mt-3">
                      <Label htmlFor="work-style-detail">具体的な希望</Label>
                      <Textarea 
                        id="work-style-detail" 
                        placeholder="勤務日数、時間帯、役割など"
                        className="min-h-[60px] mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="ideal-role">定年までの理想的な役割</Label>
                    <Textarea 
                      id="ideal-role" 
                      placeholder="メンター、相談役、特命担当など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">
                      この職場で最後まで働き続けたいですか？
                    </Label>
                    <RadioGroup className="grid grid-cols-4 gap-3 mt-3">
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="definitely" id="continue-d" />
                        <Label htmlFor="continue-d" className="mt-1 text-sm">強く思う</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="probably" id="continue-p" />
                        <Label htmlFor="continue-p" className="mt-1 text-sm">思う</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="uncertain" id="continue-u" />
                        <Label htmlFor="continue-u" className="mt-1 text-sm">わからない</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="unlikely" id="continue-ul" />
                        <Label htmlFor="continue-ul" className="mt-1 text-sm">考えていない</Label>
                      </div>
                    </RadioGroup>
                    <div className="mt-3">
                      <Label htmlFor="continue-reason">その理由</Label>
                      <Textarea 
                        id="continue-reason" 
                        placeholder="愛着、使命感、不安要素など"
                        className="min-h-[60px] mt-2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">10. 定年後の展望（5分）</h3>
                
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
                        <RadioGroupItem value="volunteer" id="post-v" />
                        <Label htmlFor="post-v" className="ml-2">ボランティア活動</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="complete-retirement" id="post-cr" />
                        <Label htmlFor="post-cr" className="ml-2">完全退職</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="undecided" id="post-u" />
                        <Label htmlFor="post-u" className="ml-2">未定</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="retirement-preparation">退職準備の状況</Label>
                    <Textarea 
                      id="retirement-preparation" 
                      placeholder="経済面、生活設計、趣味活動など"
                      className="min-h-[60px]"
                    />
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <Label className="text-base font-semibold">
                      組織に残したいレガシー（遺産）
                    </Label>
                    <Textarea 
                      id="legacy" 
                      placeholder="後輩への教え、組織文化、看護の心など"
                      className="min-h-[100px] mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* 面談者記入欄 */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-lg mb-4">面談者記入欄</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <Label className="text-base font-semibold">活躍継続可能性</Label>
                      <RadioGroup className="space-y-1 mt-2">
                        <div className="flex items-center">
                          <RadioGroupItem value="high" id="viability-h" />
                          <Label htmlFor="viability-h" className="ml-2 text-sm">高い</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="conditional" id="viability-c" />
                          <Label htmlFor="viability-c" className="ml-2 text-sm">条件付き可能</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="limited" id="viability-l" />
                          <Label htmlFor="viability-l" className="ml-2 text-sm">限定的</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="difficult" id="viability-d" />
                          <Label htmlFor="viability-d" className="ml-2 text-sm">困難</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <Label className="text-base font-semibold">知識継承優先度</Label>
                      <RadioGroup className="space-y-1 mt-2">
                        <div className="flex items-center">
                          <RadioGroupItem value="critical" id="knowledge-c" />
                          <Label htmlFor="knowledge-c" className="ml-2 text-sm">最優先</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="high" id="knowledge-h" />
                          <Label htmlFor="knowledge-h" className="ml-2 text-sm">高い</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="medium" id="knowledge-m" />
                          <Label htmlFor="knowledge-m" className="ml-2 text-sm">中程度</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="low" id="knowledge-l" />
                          <Label htmlFor="knowledge-l" className="ml-2 text-sm">低い</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="value-assessment">価値評価</Label>
                    <Textarea 
                      id="value-assessment" 
                      placeholder="組織への貢献度、保有知識の重要性、人材価値など"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="optimization-plan">最適配置・活用計画</Label>
                    <Textarea 
                      id="optimization-plan" 
                      placeholder="役割変更、業務調整、特命プロジェクトなど"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="support-plan">必要な支援計画</Label>
                    <Textarea 
                      id="support-plan" 
                      placeholder="健康管理、業務軽減、知識継承支援など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="succession-action">知識継承アクションプラン</Label>
                    <Textarea 
                      id="succession-action" 
                      placeholder="具体的な継承計画、スケジュール、対象者など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="next-interview">次回面談予定</Label>
                      <Input type="date" id="next-interview" />
                    </div>
                    <div>
                      <Label htmlFor="health-check">健康チェック予定</Label>
                      <Input type="date" id="health-check" />
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