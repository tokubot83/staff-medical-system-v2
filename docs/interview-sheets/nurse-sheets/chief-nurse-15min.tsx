'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

export default function ChiefNurse15MinInterview() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            主任看護師面談シート（15分版）
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            管理業務の状況確認とリーダーシップ支援のための効率的面談
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
              <Label htmlFor="department">担当部署</Label>
              <Input type="text" id="department" />
            </div>
          </div>

          {/* 1. チーム運営状況（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. チーム運営状況（5分）</h3>
            
            <div>
              <Label>チーム状態</Label>
              <RadioGroup className="flex space-x-4 mt-2">
                <div className="flex items-center">
                  <RadioGroupItem value="excellent" id="team-e" />
                  <Label htmlFor="team-e" className="ml-2">良好</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="stable" id="team-s" />
                  <Label htmlFor="team-s" className="ml-2">安定</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="challenging" id="team-c" />
                  <Label htmlFor="team-c" className="ml-2">課題あり</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="difficult" id="team-d" />
                  <Label htmlFor="team-d" className="ml-2">困難</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="team-members">チーム構成（人数）</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div>
                  <Label htmlFor="staff-total" className="text-sm">総数</Label>
                  <Input type="number" id="staff-total" placeholder="15" />
                </div>
                <div>
                  <Label htmlFor="staff-new" className="text-sm">新人</Label>
                  <Input type="number" id="staff-new" placeholder="3" />
                </div>
                <div>
                  <Label htmlFor="staff-veteran" className="text-sm">ベテラン</Label>
                  <Input type="number" id="staff-veteran" placeholder="5" />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="team-challenges">現在のチーム課題</Label>
              <Textarea 
                id="team-challenges" 
                placeholder="人員不足、スキルギャップ、コミュニケーション課題など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 2. 管理業務の負担（4分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. 管理業務の負担（4分）</h3>
            
            <div>
              <Label>管理業務の負担度</Label>
              <RadioGroup className="grid grid-cols-5 gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="flex items-center">
                    <RadioGroupItem value={value.toString()} id={`burden-${value}`} />
                    <Label htmlFor={`burden-${value}`} className="ml-1">{value}</Label>
                  </div>
                ))}
              </RadioGroup>
              <p className="text-sm text-gray-500 mt-1">1:軽い ← → 5:過重</p>
            </div>

            <div>
              <Label>時間配分の課題</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center">
                  <Checkbox id="time-clinical" />
                  <Label htmlFor="time-clinical" className="ml-2">臨床業務との両立困難</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="time-admin" />
                  <Label htmlFor="time-admin" className="ml-2">事務作業が多い</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="time-meeting" />
                  <Label htmlFor="time-meeting" className="ml-2">会議が多い</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="time-staff" />
                  <Label htmlFor="time-staff" className="ml-2">スタッフ対応に追われる</Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="support-needs">必要なサポート</Label>
              <Textarea 
                id="support-needs" 
                placeholder="権限委譲、業務分担、システム化など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 3. 上位管理職との連携（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 上位管理職との連携（3分）</h3>
            
            <div>
              <Label>上司との関係性</Label>
              <RadioGroup className="flex space-x-4 mt-2">
                <div className="flex items-center">
                  <RadioGroupItem value="excellent" id="boss-e" />
                  <Label htmlFor="boss-e" className="ml-2">良好</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="good" id="boss-g" />
                  <Label htmlFor="boss-g" className="ml-2">概ね良好</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="fair" id="boss-f" />
                  <Label htmlFor="boss-f" className="ml-2">普通</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="difficult" id="boss-d" />
                  <Label htmlFor="boss-d" className="ml-2">困難</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="communication-issues">コミュニケーション上の課題</Label>
              <Textarea 
                id="communication-issues" 
                placeholder="情報共有、意思決定プロセス、フィードバックなど"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. 今後の目標（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 今後の目標（3分）</h3>
            
            <div>
              <Label htmlFor="short-term-goals">3ヶ月以内の目標</Label>
              <Textarea 
                id="short-term-goals" 
                placeholder="チーム改善、業務効率化、スタッフ育成など"
                className="min-h-[60px]"
              />
            </div>

            <div>
              <Label>キャリア志向</Label>
              <RadioGroup className="space-y-2 mt-2">
                <div className="flex items-center">
                  <RadioGroupItem value="higher-management" id="career-hm" />
                  <Label htmlFor="career-hm" className="ml-2">上位管理職を目指す</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="current-role" id="career-cr" />
                  <Label htmlFor="career-cr" className="ml-2">現職での専門性向上</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="specialist" id="career-sp" />
                  <Label htmlFor="career-sp" className="ml-2">専門分野への転向</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="undecided" id="career-ud" />
                  <Label htmlFor="career-ud" className="ml-2">検討中</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 面談者記入欄 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者記入欄</h3>
            
            <div>
              <Label>マネジメント能力評価</Label>
              <RadioGroup className="flex space-x-3 mt-2">
                <div className="flex items-center">
                  <RadioGroupItem value="excellent" id="mgmt-e" />
                  <Label htmlFor="mgmt-e" className="ml-2">優秀</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="good" id="mgmt-g" />
                  <Label htmlFor="mgmt-g" className="ml-2">良好</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="developing" id="mgmt-d" />
                  <Label htmlFor="mgmt-d" className="ml-2">成長中</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="needs-support" id="mgmt-ns" />
                  <Label htmlFor="mgmt-ns" className="ml-2">要支援</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="development-areas">育成ポイント</Label>
              <Textarea 
                id="development-areas" 
                placeholder="強化すべきスキル、経験させたい業務など"
                className="min-h-[60px]"
              />
            </div>

            <div>
              <Label htmlFor="action-items">アクションアイテム</Label>
              <Textarea 
                id="action-items" 
                placeholder="次回までの具体的な行動計画"
                className="min-h-[60px]"
              />
            </div>

            <div>
              <Label htmlFor="notes">特記事項</Label>
              <Textarea 
                id="notes" 
                placeholder="上位者への報告事項、懸念点など"
                className="min-h-[60px]"
              />
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