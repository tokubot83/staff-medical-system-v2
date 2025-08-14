'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function MedicalAffairsStaffUnified15MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-2xl">医事課職員定期面談シート（15分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              15分の簡易面談です。医事課職員の基本的な業務状況確認と緊急課題の把握を目的とします。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. 業務遂行状況の確認（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 業務遂行状況の確認（5分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">主要業務の遂行状況</Label>
              <div className="grid grid-cols-4 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">良好</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">普通</div>
                <div className="bg-red-100 px-2 py-1 rounded">要改善</div>
              </div>
              
              {[
                "窓口業務・患者対応",
                "診療報酬請求業務",
                "レセプト点検業務",
                "電子カルテ・医事システム操作"
              ].map((item, index) => (
                <div key={index} className="grid grid-cols-4 gap-2 items-center">
                  <Label className="text-sm">{item}</Label>
                  <RadioGroup className="flex justify-center">
                    <RadioGroupItem value="good" />
                  </RadioGroup>
                  <RadioGroup className="flex justify-center">
                    <RadioGroupItem value="average" />
                  </RadioGroup>
                  <RadioGroup className="flex justify-center">
                    <RadioGroupItem value="needs-improvement" />
                  </RadioGroup>
                </div>
              ))}
            </div>
          </div>

          {/* 2. 課題・困りごとの確認（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. 課題・困りごとの確認（5分）</h3>
            
            <div className="space-y-3">
              <Label className="text-base font-semibold">現在の課題や困りごと</Label>
              <div className="space-y-2">
                {[
                  "業務量・時間に関する課題",
                  "システム操作に関する困りごと",
                  "患者対応での困りごと",
                  "同僚・上司との連携課題",
                  "専門知識の不足感"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox id={`issue-${index}`} />
                    <Label htmlFor={`issue-${index}`} className="text-sm">{item}</Label>
                  </div>
                ))}
              </div>
              
              <div className="mt-3">
                <Label htmlFor="issue-details" className="text-sm font-medium">詳細・その他</Label>
                <Textarea
                  id="issue-details"
                  placeholder="具体的な課題や困りごとをお聞かせください"
                  className="mt-1"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* 3. 今後の目標・希望・動機タイプ（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 今後の目標・希望・動機タイプ（3分）</h3>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="goals" className="text-base font-semibold">スキルアップや業務改善の希望</Label>
                <Textarea
                  id="goals"
                  placeholder="今後取り組みたいことや改善したいことをお聞かせください"
                  className="mt-2"
                  rows={2}
                />
              </div>
              
              <div>
                <Label className="text-base font-semibold">動機タイプの把握</Label>
                <div className="space-y-2 mt-2">
                  <Label className="text-sm text-gray-600">どのような時にやりがいを感じますか？（複数選択可）</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "患者さんから感謝された時",
                      "新しいスキルを習得した時",
                      "チームで協力して成果を出した時",
                      "責任ある業務を任された時",
                      "業務効率を改善できた時",
                      "同僚に頼りにされた時"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox id={`motivation-${index}`} />
                        <Label htmlFor={`motivation-${index}`} className="text-sm">{item}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. 面談者所見・次回までのアクション（2分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 面談者所見・次回までのアクション（2分）</h3>
            
            <div className="bg-yellow-50 p-4 rounded-lg space-y-3">
              <div>
                <Label htmlFor="supervisor-notes" className="text-base font-semibold">面談者所見</Label>
                <Textarea
                  id="supervisor-notes"
                  placeholder="対象者の状況や今後の支援方針など"
                  className="mt-2"
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="action-items" className="text-base font-semibold">次回までのアクション項目</Label>
                <Textarea
                  id="action-items"
                  placeholder="具体的な改善項目や支援内容"
                  className="mt-2"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="next-interview" className="text-sm font-medium">次回面談予定</Label>
                  <Input
                    id="next-interview"
                    type="date"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="urgency" className="text-sm font-medium">緊急度</Label>
                  <RadioGroup className="flex space-x-4 mt-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="urgency-low" />
                      <Label htmlFor="urgency-low" className="text-sm">低</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="urgency-medium" />
                      <Label htmlFor="urgency-medium" className="text-sm">中</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="urgency-high" />
                      <Label htmlFor="urgency-high" className="text-sm">高</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>

          {/* 保存ボタン */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button variant="outline">下書き保存</Button>
            <Button>面談完了</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}