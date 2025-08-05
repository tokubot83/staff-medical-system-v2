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

export default function ChiefNurse15MinInterview() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            病棟主任面談シート（15分版）
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            現場状況確認と緊急課題対応のための短時間面談
          </p>
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              時間配分目安：基本確認2分、現場状況5分、課題対応5分、フォロー3分
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
                  <Input type="text" id="interviewer" placeholder="師長名" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="name">主任名</Label>
                  <Input type="text" id="name" />
                </div>
                <div>
                  <Label htmlFor="ward">担当病棟</Label>
                  <Input type="text" id="ward" placeholder="例：内科病棟A" />
                </div>
              </div>
            </div>

            {/* 現場状況（5分） */}
            <div className="border-t pt-6">
              <h3 className="font-bold text-lg mb-4">2. 現場状況の確認（5分）</h3>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Label className="text-base font-semibold">今日のチーム状況</Label>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <Label htmlFor="staff-attendance">スタッフ出勤状況</Label>
                      <Input type="text" id="staff-attendance" placeholder="欠員2名" />
                    </div>
                    <div>
                      <Label htmlFor="patient-load">患者負担度</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="heavy">重い</SelectItem>
                          <SelectItem value="normal">通常</SelectItem>
                          <SelectItem value="light">軽い</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>現在の主な活動（複数選択可）</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center">
                      <Checkbox id="shift-adj" />
                      <Label htmlFor="shift-adj" className="ml-2">シフト調整</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="staff-support" />
                      <Label htmlFor="staff-support" className="ml-2">スタッフサポート</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="incident-handle" />
                      <Label htmlFor="incident-handle" className="ml-2">インシデント対応</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="patient-care" />
                      <Label htmlFor="patient-care" className="ml-2">患者対応</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="team-morale">チームの雰囲気・モラル</Label>
                  <Textarea 
                    id="team-morale" 
                    placeholder="スタッフの様子、疲労度、協力体制など"
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
                  <Label className="text-base font-semibold">本日の最優先事項</Label>
                  <Textarea 
                    id="urgent-matter" 
                    placeholder="即対応が必要な問題、師長の判断が必要な事項"
                    className="min-h-[60px] mt-2"
                  />
                </div>

                <div>
                  <Label>必要なサポート</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center">
                      <Checkbox id="need-staff" />
                      <Label htmlFor="need-staff" className="ml-2">応援スタッフ</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="need-decision" />
                      <Label htmlFor="need-decision" className="ml-2">師長の判断・指示</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="need-mediation" />
                      <Label htmlFor="need-mediation" className="ml-2">トラブル仲介</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="need-resources" />
                      <Label htmlFor="need-resources" className="ml-2">物品・設備対応</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="immediate-action">即時対応事項</Label>
                  <Textarea 
                    id="immediate-action" 
                    placeholder="今すぐ実施すること、本日中に完了すべきこと"
                    className="min-h-[60px]"
                  />
                </div>
              </div>
            </div>

            {/* フォローアップ（3分） */}
            <div className="border-t pt-6">
              <h3 className="font-bold text-lg mb-4">4. フォローアップ（3分）</h3>
              
              <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <Label className="text-base font-semibold">主任のコンディション</Label>
                  <RadioGroup className="grid grid-cols-4 gap-3 mt-3">
                    <div className="flex flex-col items-center">
                      <RadioGroupItem value="good" id="condition-g" />
                      <Label htmlFor="condition-g" className="mt-1 text-sm">良好</Label>
                    </div>
                    <div className="flex flex-col items-center">
                      <RadioGroupItem value="normal" id="condition-n" />
                      <Label htmlFor="condition-n" className="mt-1 text-sm">普通</Label>
                    </div>
                    <div className="flex flex-col items-center">
                      <RadioGroupItem value="tired" id="condition-t" />
                      <Label htmlFor="condition-t" className="mt-1 text-sm">疲労</Label>
                    </div>
                    <div className="flex flex-col items-center">
                      <RadioGroupItem value="stressed" id="condition-s" />
                      <Label htmlFor="condition-s" className="mt-1 text-sm">要注意</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="tomorrow-prep">明日への準備事項</Label>
                  <Textarea 
                    id="tomorrow-prep" 
                    placeholder="引き継ぎ事項、準備すべきこと"
                    className="min-h-[50px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="next-check">次回確認時間</Label>
                    <Input type="text" id="next-check" placeholder="17:00" />
                  </div>
                  <div>
                    <Label htmlFor="contact-method">連絡方法</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="direct">直接面談</SelectItem>
                        <SelectItem value="phone">電話</SelectItem>
                        <SelectItem value="phs">PHS</SelectItem>
                        <SelectItem value="report">報告書</SelectItem>
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