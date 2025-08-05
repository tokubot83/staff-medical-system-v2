'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

export default function NewNurse15MinInterview() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            新人看護師面談シート（15分版）
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            効率的に重要事項を確認する短時間面談用
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
              <Label htmlFor="department">所属部署</Label>
              <Input type="text" id="department" />
            </div>
          </div>

          {/* 1. 現在の状況確認（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 現在の状況確認（3分）</h3>
            
            <div>
              <Label>業務適応度</Label>
              <RadioGroup className="flex space-x-4 mt-2">
                <div className="flex items-center">
                  <RadioGroupItem value="very-good" id="adapt-vg" />
                  <Label htmlFor="adapt-vg" className="ml-2">とても良い</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="good" id="adapt-g" />
                  <Label htmlFor="adapt-g" className="ml-2">良い</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="normal" id="adapt-n" />
                  <Label htmlFor="adapt-n" className="ml-2">普通</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="difficult" id="adapt-d" />
                  <Label htmlFor="adapt-d" className="ml-2">やや困難</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>健康状態</Label>
              <RadioGroup className="flex space-x-4 mt-2">
                <div className="flex items-center">
                  <RadioGroupItem value="good" id="health-g" />
                  <Label htmlFor="health-g" className="ml-2">良好</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="tired" id="health-t" />
                  <Label htmlFor="health-t" className="ml-2">やや疲れ</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="concern" id="health-c" />
                  <Label htmlFor="health-c" className="ml-2">要注意</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 2. 困っていること（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. 困っていること（5分）</h3>
            
            <div>
              <Label>現在困っていることはありますか？</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center">
                  <Checkbox id="concern-tech" />
                  <Label htmlFor="concern-tech" className="ml-2">技術面</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="concern-relation" />
                  <Label htmlFor="concern-relation" className="ml-2">人間関係</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="concern-workload" />
                  <Label htmlFor="concern-workload" className="ml-2">業務量</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="concern-other" />
                  <Label htmlFor="concern-other" className="ml-2">その他</Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="concern-detail">具体的な内容（必要に応じて）</Label>
              <Textarea 
                id="concern-detail" 
                placeholder="困っていることの詳細を記入"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 3. サポート確認（4分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. サポート確認（4分）</h3>
            
            <div>
              <Label>プリセプターとの関係</Label>
              <RadioGroup className="flex space-x-4 mt-2">
                <div className="flex items-center">
                  <RadioGroupItem value="very-good" id="preceptor-vg" />
                  <Label htmlFor="preceptor-vg" className="ml-2">とても良い</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="good" id="preceptor-g" />
                  <Label htmlFor="preceptor-g" className="ml-2">良い</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="normal" id="preceptor-n" />
                  <Label htmlFor="preceptor-n" className="ml-2">普通</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="difficult" id="preceptor-d" />
                  <Label htmlFor="preceptor-d" className="ml-2">要改善</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="support-need">必要なサポート</Label>
              <Textarea 
                id="support-need" 
                placeholder="追加で必要なサポートがあれば記入"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. 次回までの目標（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 次回までの目標（3分）</h3>
            
            <div>
              <Label htmlFor="goal">次回面談までの目標</Label>
              <Textarea 
                id="goal" 
                placeholder="具体的で達成可能な目標を1〜2つ設定"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            
            <div>
              <Label>緊急度</Label>
              <RadioGroup className="flex space-x-4 mt-2">
                <div className="flex items-center">
                  <RadioGroupItem value="urgent" id="urgency-u" />
                  <Label htmlFor="urgency-u" className="ml-2">要緊急対応</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="watch" id="urgency-w" />
                  <Label htmlFor="urgency-w" className="ml-2">要観察</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="normal" id="urgency-n" />
                  <Label htmlFor="urgency-n" className="ml-2">通常</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="notes">特記事項</Label>
              <Textarea 
                id="notes" 
                placeholder="上司への報告事項、次回確認事項など"
                className="min-h-[80px]"
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