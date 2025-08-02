'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';

export default function NewNurse15MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-2xl">1年目新人看護師 定期面談シート（15分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. 現在の状況確認（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 現在の状況確認（3分）</h3>
            
            <div className="space-y-2">
              <Label>体調・健康状態</Label>
              <RadioGroup>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="health-excellent" />
                    <Label htmlFor="health-excellent" className="ml-2">良好</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="health-good" />
                    <Label htmlFor="health-good" className="ml-2">普通</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="poor" id="health-poor" />
                    <Label htmlFor="health-poor" className="ml-2">不調</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>業務への適応状況</Label>
              <RadioGroup>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <RadioGroupItem value="well" id="adapt-well" />
                    <Label htmlFor="adapt-well" className="ml-2">順調</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="normal" id="adapt-normal" />
                    <Label htmlFor="adapt-normal" className="ml-2">まあまあ</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="struggling" id="adapt-struggling" />
                    <Label htmlFor="adapt-struggling" className="ml-2">苦戦中</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 2. 技術習得状況（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. 技術習得状況（5分）</h3>
            
            <div className="space-y-2">
              <Label>今月習得した技術・処置</Label>
              <Textarea 
                placeholder="例：採血、点滴管理、バイタルサイン測定など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>不安を感じている技術・処置</Label>
              <Textarea 
                placeholder="具体的な技術名と不安な点を記入"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>次月の学習目標</Label>
              <Textarea 
                placeholder="習得したい技術や知識を記入"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 3. サポート体制（4分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. サポート体制（4分）</h3>
            
            <div className="space-y-2">
              <Label>プリセプターとの関係性</Label>
              <RadioGroup>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="preceptor-excellent" />
                    <Label htmlFor="preceptor-excellent" className="ml-2">良好</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="preceptor-good" />
                    <Label htmlFor="preceptor-good" className="ml-2">普通</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="difficult" id="preceptor-difficult" />
                    <Label htmlFor="preceptor-difficult" className="ml-2">課題あり</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>職場での相談しやすさ</Label>
              <RadioGroup>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <RadioGroupItem value="easy" id="consult-easy" />
                    <Label htmlFor="consult-easy" className="ml-2">相談しやすい</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="normal" id="consult-normal" />
                    <Label htmlFor="consult-normal" className="ml-2">普通</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="difficult" id="consult-difficult" />
                    <Label htmlFor="consult-difficult" className="ml-2">相談しにくい</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>必要なサポート・要望</Label>
              <Textarea 
                placeholder="具体的に必要な支援を記入"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. 次回までのアクションプラン（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 次回までのアクションプラン（3分）</h3>
            
            <div className="space-y-2">
              <Label>本人の取り組み事項</Label>
              <Textarea 
                placeholder="次回面談までに取り組むこと"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>上司・組織からのサポート事項</Label>
              <Textarea 
                placeholder="提供するサポート内容"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <Textarea 
              placeholder="総合的な評価、気になる点、継続観察事項など"
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