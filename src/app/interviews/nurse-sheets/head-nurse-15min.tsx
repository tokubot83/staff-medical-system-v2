'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';

export default function HeadNurse15MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-red-50">
          <CardTitle className="text-2xl">病棟師長 定期面談シート（15分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. 管理業務の状況（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 管理業務の状況（3分）</h3>
            
            <div className="space-y-2">
              <Label>部署運営の状況</Label>
              <RadioGroup>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <RadioGroupItem value="smooth" id="operation-smooth" />
                    <Label htmlFor="operation-smooth" className="ml-2">順調</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="normal" id="operation-normal" />
                    <Label htmlFor="operation-normal" className="ml-2">概ね順調</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="challenging" id="operation-challenging" />
                    <Label htmlFor="operation-challenging" className="ml-2">課題あり</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>管理業務の負担度</Label>
              <RadioGroup>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <RadioGroupItem value="appropriate" id="burden-appropriate" />
                    <Label htmlFor="burden-appropriate" className="ml-2">適正</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="heavy" id="burden-heavy" />
                    <Label htmlFor="burden-heavy" className="ml-2">やや重い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="excessive" id="burden-excessive" />
                    <Label htmlFor="burden-excessive" className="ml-2">過重</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 2. 部署の課題と対応（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. 部署の課題と対応（5分）</h3>
            
            <div className="space-y-2">
              <Label>現在の主要課題（上位3つ）</Label>
              <Textarea 
                placeholder="人員不足、質の向上、業務効率化など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>取り組んでいる改善活動</Label>
              <Textarea 
                placeholder="具体的な施策と進捗状況"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>スタッフのモラール</Label>
              <RadioGroup>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="morale-high" />
                    <Label htmlFor="morale-high" className="ml-2">高い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="normal" id="morale-normal" />
                    <Label htmlFor="morale-normal" className="ml-2">普通</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="morale-low" />
                    <Label htmlFor="morale-low" className="ml-2">低い</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 3. 上位組織との連携（4分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 上位組織との連携（4分）</h3>
            
            <div className="space-y-2">
              <Label>看護部との連携状況</Label>
              <Textarea 
                placeholder="情報共有、サポート体制、課題など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>必要な組織的支援</Label>
              <Textarea 
                placeholder="人員配置、予算、権限委譲など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. 今後の方針（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 今後の方針（3分）</h3>
            
            <div className="space-y-2">
              <Label>次期の重点目標</Label>
              <Textarea 
                placeholder="具体的な目標と達成指標"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>個人的な成長課題</Label>
              <Textarea 
                placeholder="管理能力、リーダーシップなど"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <Textarea 
              placeholder="マネジメント能力、部署の状況、支援の必要性など"
              className="min-h-[100px]"
            />
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