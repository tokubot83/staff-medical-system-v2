'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

export default function VeteranNurse15MinInterview() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            ベテラン看護師面談シート（15分版）
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            経験の活用と働きがい維持のための効率的面談
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 基本情報 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">面談日</Label>
              <Input type="date" id="date" />
            </div>
            <div>
              <Label htmlFor="interviewer">面談者</Label>
              <Input type="text" id="interviewer" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">氏名</Label>
              <Input type="text" id="name" />
            </div>
            <div>
              <Label htmlFor="years">勤続年数</Label>
              <Input type="text" id="years" placeholder="例：15年6ヶ月" />
            </div>
          </div>

          {/* 1. 現在の状況と満足度（4分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 現在の状況と満足度（4分）</h3>
            
            <div>
              <Label>仕事への満足度</Label>
              <RadioGroup className="grid grid-cols-5 gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="flex items-center">
                    <RadioGroupItem value={value.toString()} id={`satisfaction-${value}`} />
                    <Label htmlFor={`satisfaction-${value}`} className="ml-1">{value}</Label>
                  </div>
                ))}
              </RadioGroup>
              <p className="text-sm text-gray-500 mt-1">1:不満 ← → 5:満足</p>
            </div>

            <div>
              <Label>体力・健康面</Label>
              <RadioGroup className="flex space-x-4 mt-2">
                <div className="flex items-center">
                  <RadioGroupItem value="good" id="health-g" />
                  <Label htmlFor="health-g" className="ml-2">良好</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="manageable" id="health-m" />
                  <Label htmlFor="health-m" className="ml-2">管理可能</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="concern" id="health-c" />
                  <Label htmlFor="health-c" className="ml-2">懸念あり</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="difficult" id="health-d" />
                  <Label htmlFor="health-d" className="ml-2">困難</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="current-concerns">現在の懸念事項</Label>
              <Textarea 
                id="current-concerns" 
                placeholder="体力面、技術の変化への対応、世代間ギャップなど"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 2. 経験・知識の活用（4分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. 経験・知識の活用（4分）</h3>
            
            <div>
              <Label>現在の貢献領域</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center">
                  <Checkbox id="contrib-mentoring" />
                  <Label htmlFor="contrib-mentoring" className="ml-2">後輩育成・メンタリング</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="contrib-expertise" />
                  <Label htmlFor="contrib-expertise" className="ml-2">専門知識の共有</Label>
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
                  <Label htmlFor="contrib-crisis" className="ml-2">危機管理・対応</Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="expertise-share">経験を活かしたい分野</Label>
              <Textarea 
                id="expertise-share" 
                placeholder="特に貢献したい領域、伝承したい技術など"
                className="min-h-[60px]"
              />
            </div>

            <div>
              <Label>知識継承の意欲</Label>
              <RadioGroup className="flex space-x-4 mt-2">
                <div className="flex items-center">
                  <RadioGroupItem value="very-high" id="succession-vh" />
                  <Label htmlFor="succession-vh" className="ml-2">非常に高い</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="high" id="succession-h" />
                  <Label htmlFor="succession-h" className="ml-2">高い</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="moderate" id="succession-m" />
                  <Label htmlFor="succession-m" className="ml-2">普通</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="low" id="succession-l" />
                  <Label htmlFor="succession-l" className="ml-2">低い</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 3. 働き方の希望（4分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 働き方の希望（4分）</h3>
            
            <div>
              <Label>今後の勤務形態希望</Label>
              <RadioGroup className="space-y-2 mt-2">
                <div className="flex items-center">
                  <RadioGroupItem value="full-time" id="work-ft" />
                  <Label htmlFor="work-ft" className="ml-2">現状維持（フルタイム）</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="reduced" id="work-r" />
                  <Label htmlFor="work-r" className="ml-2">勤務時間削減希望</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="part-time" id="work-pt" />
                  <Label htmlFor="work-pt" className="ml-2">パートタイム希望</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="flexible" id="work-f" />
                  <Label htmlFor="work-f" className="ml-2">柔軟な勤務体系希望</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>業務負担の配慮</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center">
                  <Checkbox id="reduce-night" />
                  <Label htmlFor="reduce-night" className="ml-2">夜勤の削減・免除</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="reduce-physical" />
                  <Label htmlFor="reduce-physical" className="ml-2">身体的負担の軽減</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="reduce-overtime" />
                  <Label htmlFor="reduce-overtime" className="ml-2">残業の削減</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="reduce-emergency" />
                  <Label htmlFor="reduce-emergency" className="ml-2">救急対応の減少</Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="retirement-plan">定年後の希望</Label>
              <Textarea 
                id="retirement-plan" 
                placeholder="再雇用、継続勤務、完全退職など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. モチベーション維持（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. モチベーション維持（3分）</h3>
            
            <div>
              <Label htmlFor="motivation-factors">やりがいを感じる瞬間</Label>
              <Textarea 
                id="motivation-factors" 
                placeholder="患者との関わり、後輩の成長、チームへの貢献など"
                className="min-h-[60px]"
              />
            </div>

            <div>
              <Label htmlFor="support-needs">必要なサポート</Label>
              <Textarea 
                id="support-needs" 
                placeholder="スキルアップ機会、役割の明確化、評価など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 面談者記入欄 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者記入欄</h3>
            
            <div>
              <Label>総合評価</Label>
              <RadioGroup className="flex space-x-3 mt-2">
                <div className="flex items-center">
                  <RadioGroupItem value="stable" id="eval-s" />
                  <Label htmlFor="eval-s" className="ml-2">安定</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="watch" id="eval-w" />
                  <Label htmlFor="eval-w" className="ml-2">要観察</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="support" id="eval-su" />
                  <Label htmlFor="eval-su" className="ml-2">要支援</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="adjustment" id="eval-a" />
                  <Label htmlFor="eval-a" className="ml-2">業務調整必要</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="recommendations">推奨事項</Label>
              <Textarea 
                id="recommendations" 
                placeholder="役割変更、業務調整、研修機会、表彰推薦など"
                className="min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="notes">特記事項</Label>
              <Textarea 
                id="notes" 
                placeholder="健康面の配慮、知識継承の機会設定など"
                className="min-h-[60px]"
              />
            </div>

            <div>
              <Label htmlFor="next-interview">次回面談予定</Label>
              <Input type="date" id="next-interview" />
            </div>
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