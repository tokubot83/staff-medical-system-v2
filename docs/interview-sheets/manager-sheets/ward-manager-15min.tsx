'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function WardManager15MinInterview() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            病棟師長面談シート（15分版）
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            業務報告と緊急課題確認のための短時間面談
          </p>
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              時間配分目安：基本確認2分、業務報告5分、課題対応5分、次回確認3分
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent>
          {/* 基本情報（2分） */}
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-4">1. 基本情報（2分）</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">面談日</Label>
                  <Input type="date" id="date" />
                </div>
                <div>
                  <Label htmlFor="interviewer">面談者</Label>
                  <Input type="text" id="interviewer" placeholder="看護部長名" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="name">師長名</Label>
                  <Input type="text" id="name" />
                </div>
                <div>
                  <Label htmlFor="ward">担当病棟</Label>
                  <Input type="text" id="ward" placeholder="例：内科病棟A" />
                </div>
              </div>
            </div>

            {/* 業務報告（5分） */}
            <div className="border-t pt-6">
              <h3 className="font-bold text-lg mb-4">2. 業務報告（5分）</h3>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Label className="text-base font-semibold">現在の病棟稼働状況</Label>
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div>
                      <Label htmlFor="bed-occupancy">病床稼働率</Label>
                      <Input type="text" id="bed-occupancy" placeholder="85%" />
                    </div>
                    <div>
                      <Label htmlFor="staff-fill-rate">スタッフ充足率</Label>
                      <Input type="text" id="staff-fill-rate" placeholder="90%" />
                    </div>
                    <div>
                      <Label htmlFor="overtime-hours">月間残業時間</Label>
                      <Input type="text" id="overtime-hours" placeholder="平均25時間" />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>今週の重要事項（複数選択可）</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center">
                      <Checkbox id="incident" />
                      <Label htmlFor="incident" className="ml-2">インシデント発生</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="staff-issue" />
                      <Label htmlFor="staff-issue" className="ml-2">スタッフトラブル</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="patient-complaint" />
                      <Label htmlFor="patient-complaint" className="ml-2">患者クレーム</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="quality-concern" />
                      <Label htmlFor="quality-concern" className="ml-2">医療の質懸念</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="key-achievements">今週の成果・改善点</Label>
                  <Textarea 
                    id="key-achievements" 
                    placeholder="業務効率化、スタッフ育成、患者満足度向上など"
                    className="min-h-[60px]"
                  />
                </div>
              </div>
            </div>

            {/* 緊急課題と対応（5分） */}
            <div className="border-t pt-6">
              <h3 className="font-bold text-lg mb-4">3. 緊急課題と対応（5分）</h3>
              
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <Label className="text-base font-semibold">最優先課題</Label>
                  <Textarea 
                    id="urgent-issue" 
                    placeholder="即座に対応が必要な問題を記載"
                    className="min-h-[60px] mt-2"
                  />
                </div>

                <div>
                  <Label>必要な支援</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center">
                      <Checkbox id="support-staff" />
                      <Label htmlFor="support-staff" className="ml-2">人員補充</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="support-budget" />
                      <Label htmlFor="support-budget" className="ml-2">予算措置</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="support-authority" />
                      <Label htmlFor="support-authority" className="ml-2">権限委譲</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="support-guidance" />
                      <Label htmlFor="support-guidance" className="ml-2">上層部の指導</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="action-plan">即時対応計画</Label>
                  <Textarea 
                    id="action-plan" 
                    placeholder="誰が、いつまでに、何をするか"
                    className="min-h-[60px]"
                  />
                </div>
              </div>
            </div>

            {/* 次回確認事項（3分） */}
            <div className="border-t pt-6">
              <h3 className="font-bold text-lg mb-4">4. 次回確認事項（3分）</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="follow-up-items">フォローアップ項目</Label>
                  <Textarea 
                    id="follow-up-items" 
                    placeholder="次回面談までに確認・報告すべき事項"
                    className="min-h-[60px]"
                  />
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <Label className="text-base font-semibold">師長の状態</Label>
                  <RadioGroup className="grid grid-cols-4 gap-3 mt-3">
                    <div className="flex flex-col items-center">
                      <RadioGroupItem value="excellent" id="condition-e" />
                      <Label htmlFor="condition-e" className="mt-1 text-sm">良好</Label>
                    </div>
                    <div className="flex flex-col items-center">
                      <RadioGroupItem value="good" id="condition-g" />
                      <Label htmlFor="condition-g" className="mt-1 text-sm">概ね良好</Label>
                    </div>
                    <div className="flex flex-col items-center">
                      <RadioGroupItem value="tired" id="condition-t" />
                      <Label htmlFor="condition-t" className="mt-1 text-sm">疲労気味</Label>
                    </div>
                    <div className="flex flex-col items-center">
                      <RadioGroupItem value="burnout" id="condition-b" />
                      <Label htmlFor="condition-b" className="mt-1 text-sm">要注意</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="next-meeting">次回面談予定</Label>
                    <Input type="date" id="next-meeting" />
                  </div>
                  <div>
                    <Label htmlFor="meeting-type">次回面談形式</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="形式を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15min">15分版</SelectItem>
                        <SelectItem value="30min">30分版</SelectItem>
                        <SelectItem value="45min">45分版</SelectItem>
                        <SelectItem value="emergency">緊急面談</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

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