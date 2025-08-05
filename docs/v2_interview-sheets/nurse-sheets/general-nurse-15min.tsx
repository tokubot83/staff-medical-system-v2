'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

export default function GeneralNurse15MinInterview() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            一般看護師面談シート（15分版）
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            定期的な状況確認とモチベーション維持のための短時間面談
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
              <Input type="text" id="years" placeholder="例：3年6ヶ月" />
            </div>
          </div>

          {/* 1. 現在の業務状況（4分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 現在の業務状況（4分）</h3>
            
            <div>
              <Label>業務負担度</Label>
              <RadioGroup className="flex space-x-4 mt-2">
                <div className="flex items-center">
                  <RadioGroupItem value="light" id="workload-l" />
                  <Label htmlFor="workload-l" className="ml-2">適正</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="moderate" id="workload-m" />
                  <Label htmlFor="workload-m" className="ml-2">やや多い</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="heavy" id="workload-h" />
                  <Label htmlFor="workload-h" className="ml-2">過重</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="light" id="workload-li" />
                  <Label htmlFor="workload-li" className="ml-2">余裕あり</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>職場満足度</Label>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                  <div></div>
                  <div className="bg-green-100 px-2 py-1 rounded">5</div>
                  <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                  <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                  <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                  <div className="bg-red-100 px-2 py-1 rounded">1</div>
                </div>
                
                <RadioGroup>
                  <div className="grid grid-cols-6 gap-2 items-center">
                    <span className="text-sm font-medium">職場満足度</span>
                    <div className="flex justify-center">
                      <RadioGroupItem value="satisfaction-5" id="satisfaction-5" className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value="satisfaction-4" id="satisfaction-4" className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value="satisfaction-3" id="satisfaction-3" className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value="satisfaction-2" id="satisfaction-2" className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value="satisfaction-1" id="satisfaction-1" className="w-4 h-4" />
                    </div>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded mt-3">
                <p><strong>評価基準：</strong></p>
                <p><span className="text-green-600 font-medium">5：</span>エキスパート　<span className="text-blue-600 font-medium">4：</span>熟練　<span className="text-yellow-600 font-medium">3：</span>一人前　<span className="text-orange-600 font-medium">2：</span>見習い　<span className="text-red-600 font-medium">1：</span>初心者</p>
              </div>
            </div>

            <div>
              <Label htmlFor="current-issues">現在気になっていること</Label>
              <Textarea 
                id="current-issues" 
                placeholder="業務上の課題、困っていることなど"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 2. キャリア・成長（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. キャリア・成長（5分）</h3>
            
            <div>
              <Label>興味のある分野（複数選択可）</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex items-center">
                  <Checkbox id="interest-emergency" />
                  <Label htmlFor="interest-emergency" className="ml-2">救急・ICU</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="interest-palliative" />
                  <Label htmlFor="interest-palliative" className="ml-2">緩和ケア</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="interest-pediatric" />
                  <Label htmlFor="interest-pediatric" className="ml-2">小児看護</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="interest-management" />
                  <Label htmlFor="interest-management" className="ml-2">看護管理</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="interest-education" />
                  <Label htmlFor="interest-education" className="ml-2">教育・指導</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="interest-specialty" />
                  <Label htmlFor="interest-specialty" className="ml-2">専門・認定看護師</Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="career-goals">今後のキャリア目標</Label>
              <Textarea 
                id="career-goals" 
                placeholder="資格取得、異動希望、スキルアップなど"
                className="min-h-[60px]"
              />
            </div>

            <div>
              <Label>研修・学習ニーズ</Label>
              <RadioGroup className="flex flex-wrap gap-3 mt-2">
                <div className="flex items-center">
                  <RadioGroupItem value="high" id="learning-h" />
                  <Label htmlFor="learning-h" className="ml-2">積極的に参加したい</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="moderate" id="learning-m" />
                  <Label htmlFor="learning-m" className="ml-2">機会があれば</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="low" id="learning-l" />
                  <Label htmlFor="learning-l" className="ml-2">現状維持</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 3. 職場環境・要望（4分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 職場環境・要望（4分）</h3>
            
            <div>
              <Label>チームワーク</Label>
              <RadioGroup className="flex space-x-4 mt-2">
                <div className="flex items-center">
                  <RadioGroupItem value="excellent" id="team-e" />
                  <Label htmlFor="team-e" className="ml-2">非常に良い</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="good" id="team-g" />
                  <Label htmlFor="team-g" className="ml-2">良い</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="fair" id="team-f" />
                  <Label htmlFor="team-f" className="ml-2">普通</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="poor" id="team-p" />
                  <Label htmlFor="team-p" className="ml-2">改善必要</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="requests">職場への要望・提案</Label>
              <Textarea 
                id="requests" 
                placeholder="業務改善、環境整備、制度面など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. 次回までのアクション（2分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 次回までのアクション（2分）</h3>
            
            <div>
              <Label htmlFor="action-plan">合意事項・アクションプラン</Label>
              <Textarea 
                id="action-plan" 
                placeholder="面談で決めた具体的な行動計画"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 面談者記入欄 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者記入欄</h3>
            
            <div>
              <Label>総合評価</Label>
              <RadioGroup className="flex space-x-4 mt-2">
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
                  <RadioGroupItem value="urgent" id="eval-u" />
                  <Label htmlFor="eval-u" className="ml-2">緊急対応</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="notes">特記事項・申し送り</Label>
              <Textarea 
                id="notes" 
                placeholder="上司への報告事項、フォローアップが必要な内容など"
                className="min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="next-date">次回面談予定</Label>
              <Input type="date" id="next-date" />
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