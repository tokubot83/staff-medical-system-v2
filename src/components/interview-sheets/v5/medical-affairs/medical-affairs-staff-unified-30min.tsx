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

export default function MedicalAffairsStaffUnified30MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-2xl">医事課職員定期面談シート（30分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              30分の標準面談です。医事課職員の詳細な業務評価と今後の育成方針を明確にすることを目的とします。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. 業務遂行状況の評価（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 業務遂行状況の評価（10分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">医事業務の遂行能力評価</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "窓口業務・患者対応",
                "診療報酬請求業務",
                "レセプト点検・査定対応",
                "電子カルテ・医事システム操作",
                "保険制度・診療報酬制度理解",
                "院内他部署との連携",
                "正確性・ミス防止意識"
              ].map((item, index) => (
                <div key={index} className="grid grid-cols-6 gap-2 items-center">
                  <Label className="text-sm">{item}</Label>
                  {[5, 4, 3, 2, 1].map((score) => (
                    <RadioGroup key={score} className="flex justify-center">
                      <RadioGroupItem value={score.toString()} />
                    </RadioGroup>
                  ))}
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <Label className="text-base font-semibold">強みとして感じる業務領域</Label>
              <Textarea
                placeholder="最も得意と感じる業務やスキルについてお聞かせください"
                className="mt-2"
                rows={2}
              />
            </div>
          </div>

          {/* 2. 専門知識・スキルの向上状況（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. 専門知識・スキルの向上状況（8分）</h3>
            
            <div className="space-y-3">
              <Label className="text-base font-semibold">最近の学習・研修参加状況</Label>
              <div className="space-y-2">
                {[
                  "診療報酬改定に関する研修",
                  "電子カルテ・医事システム研修",
                  "接遇・患者対応研修",
                  "医療保険制度研修",
                  "個人情報保護・コンプライアンス研修"
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <Label className="text-sm">{item}</Label>
                    <RadioGroup className="flex space-x-4">
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="participated" id={`training-${index}-participated`} />
                        <Label htmlFor={`training-${index}-participated`} className="text-xs">参加済</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="planned" id={`training-${index}-planned`} />
                        <Label htmlFor={`training-${index}-planned`} className="text-xs">予定有</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="not-participated" id={`training-${index}-not`} />
                        <Label htmlFor={`training-${index}-not`} className="text-xs">未参加</Label>
                      </div>
                    </RadioGroup>
                  </div>
                ))}
              </div>
              
              <div className="mt-3">
                <Label htmlFor="skill-development" className="text-sm font-medium">今後習得したいスキル・知識</Label>
                <Textarea
                  id="skill-development"
                  placeholder="伸ばしたいスキルや学びたい分野をお聞かせください"
                  className="mt-1"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* 3. 課題・困りごと・ストレス要因（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 課題・困りごと・ストレス要因（7分）</h3>
            
            <div className="space-y-3">
              <Label className="text-base font-semibold">現在の課題・ストレス要因</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "業務量・時間圧迫",
                  "システム操作の困難",
                  "複雑な診療報酬制度",
                  "患者対応での困りごと",
                  "同僚・上司との関係",
                  "責任・プレッシャー",
                  "スキル不足の不安",
                  "制度変更への対応"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox id={`stress-${index}`} />
                    <Label htmlFor={`stress-${index}`} className="text-sm">{item}</Label>
                  </div>
                ))}
              </div>
              
              <div className="mt-3">
                <Label htmlFor="stress-details" className="text-sm font-medium">詳細・具体的な困りごと</Label>
                <Textarea
                  id="stress-details"
                  placeholder="具体的な課題や困りごと、改善したい点をお聞かせください"
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* 4. 今後の目標・希望・動機タイプ（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 今後の目標・希望・動機タイプ（3分）</h3>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="goals" className="text-base font-semibold">短期・中期的な目標</Label>
                <Textarea
                  id="goals"
                  placeholder="今後6ヶ月〜1年で取り組みたいことや目標をお聞かせください"
                  className="mt-2"
                  rows={2}
                />
              </div>
              
              <div>
                <Label className="text-base font-semibold">動機タイプ・やりがいの源泉</Label>
                <div className="space-y-2 mt-2">
                  <Label className="text-sm text-gray-600">どのような時にやりがいを感じますか？（複数選択可）</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "患者さんから感謝された時",
                      "新しいスキルを習得した時",
                      "チームで協力して成果を出した時",
                      "責任ある業務を任された時",
                      "業務効率を改善できた時",
                      "同僚に頼りにされた時",
                      "正確な業務処理ができた時",
                      "制度変更に対応できた時"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox id={`motivation-${index}`} />
                        <Label htmlFor={`motivation-${index}`} className="text-sm">{item}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="career-vision" className="text-sm font-medium">将来のキャリアビジョン</Label>
                <Textarea
                  id="career-vision"
                  placeholder="将来的にどのような医事職員になりたいか、キャリアの方向性など"
                  className="mt-1"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* 5. 面談者所見・次回までのアクション（2分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. 面談者所見・次回までのアクション（2分）</h3>
            
            <div className="bg-yellow-50 p-4 rounded-lg space-y-3">
              <div>
                <Label htmlFor="supervisor-notes" className="text-base font-semibold">面談者所見</Label>
                <Textarea
                  id="supervisor-notes"
                  placeholder="対象者の成長状況、課題、今後の支援方針など"
                  className="mt-2"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="action-items" className="text-base font-semibold">次回までのアクション項目</Label>
                <Textarea
                  id="action-items"
                  placeholder="具体的な改善項目、研修計画、支援内容など"
                  className="mt-2"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
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
                <div>
                  <Label htmlFor="support-level" className="text-sm font-medium">支援必要度</Label>
                  <RadioGroup className="flex space-x-4 mt-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="support-low" />
                      <Label htmlFor="support-low" className="text-sm">低</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="support-medium" />
                      <Label htmlFor="support-medium" className="text-sm">中</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="support-high" />
                      <Label htmlFor="support-high" className="text-sm">高</Label>
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