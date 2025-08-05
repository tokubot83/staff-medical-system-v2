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

export default function LeaderNurseUnified45MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-amber-50">
          <CardTitle className="text-2xl">主任看護師定期面談シート（45分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>主任経験：＿＿年＿＿ヶ月　担当部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              45分の詳細面談です。主任看護師のリーダーシップ発揮、チーム運営、スタッフ育成を包括的に支援してください。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. チーム運営と業務管理（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. チーム運営と業務管理（10分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">チーム運営の評価</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "シフト管理・調整",
                "業務配分の適正化",
                "チーム内コミュニケーション",
                "問題解決力",
                "部署間調整"
              ].map((item) => (
                <div key={item} className="grid grid-cols-6 gap-2 items-center">
                  <Label className="text-sm">{item}</Label>
                  <RadioGroup name={item} className="col-span-5 flex flex-row gap-4">
                    {[5, 4, 3, 2, 1].map((value) => (
                      <div key={value} className="flex items-center">
                        <RadioGroupItem value={value.toString()} id={`${item}-${value}`} />
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>

            <div>
              <Label htmlFor="team-management">チーム運営の具体的な取り組みと課題</Label>
              <Textarea 
                id="team-management" 
                placeholder="シフト管理の工夫、業務改善の取り組み、チーム内の課題など" 
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. スタッフ育成と指導（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. スタッフ育成と指導（10分）</h3>
            
            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">育成・指導の実施状況</Label>
              {[
                { label: "新人指導の実施", options: ["積極的に実施", "必要時実施", "あまり実施せず"] },
                { label: "中堅スタッフへの助言", options: ["定期的に実施", "時々実施", "ほとんどなし"] },
                { label: "教育計画の立案", options: ["主体的に立案", "協力して立案", "関与少ない"] }
              ].map(({ label, options }) => (
                <div key={label} className="space-y-2">
                  <Label>{label}</Label>
                  <RadioGroup name={label} className="flex flex-row gap-4">
                    {options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${label}-${option}`} />
                        <Label htmlFor={`${label}-${option}`} className="text-sm font-normal">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>

            <div>
              <Label htmlFor="staff-development">スタッフ育成の成果と今後の計画</Label>
              <Textarea 
                id="staff-development" 
                placeholder="育成の成功事例、困難事例、今後注力したい育成テーマなど" 
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 3. リーダーシップとロールモデル（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. リーダーシップとロールモデル（10分）</h3>
            
            <div className="bg-green-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">リーダーシップの発揮状況</Label>
              <div className="space-y-3">
                {[
                  "緊急時の判断・指示",
                  "スタッフの動機づけ",
                  "看護実践の模範",
                  "倫理的課題への対応"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox id={item} />
                    <Label htmlFor={item} className="text-sm font-normal">{item}で良好な実績あり</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="leadership-challenges">リーダーシップ上の課題と成長目標</Label>
              <Textarea 
                id="leadership-challenges" 
                placeholder="現在直面している課題、強化したいリーダーシップスキル、目指す主任像など" 
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 4. 管理業務への関与と組織貢献（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 管理業務への関与と組織貢献（10分）</h3>
            
            <div className="bg-purple-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">管理業務への参画</Label>
              <div className="space-y-3">
                {[
                  "委員会活動への参加",
                  "業務改善プロジェクト",
                  "マニュアル作成・改訂",
                  "院内研修の企画・実施",
                  "他部署との連携強化"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox id={`management-${item}`} />
                    <Label htmlFor={`management-${item}`} className="text-sm font-normal">{item}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="organizational-contribution">組織への貢献と今後の抱負</Label>
              <Textarea 
                id="organizational-contribution" 
                placeholder="現在の貢献内容、今後取り組みたい課題、キャリアビジョンなど" 
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 5. 総括とアクションプラン（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. 総括とアクションプラン（5分）</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="strengths">強みと成長点</Label>
                <Textarea 
                  id="strengths" 
                  placeholder="主任として発揮している強み、この期間で成長した点"
                  className="min-h-[60px]"
                />
              </div>
              <div>
                <Label htmlFor="development-areas">課題と改善点</Label>
                <Textarea 
                  id="development-areas" 
                  placeholder="認識している課題、改善が必要な領域"
                  className="min-h-[60px]"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="action-plan">今後3ヶ月のアクションプラン</Label>
              <Textarea 
                id="action-plan" 
                placeholder="具体的な行動計画、達成目標、必要なサポートなど" 
                className="min-h-[80px]"
              />
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <Label htmlFor="manager-support">師長からのサポート事項</Label>
              <Textarea 
                id="manager-support" 
                placeholder="主任の成長と活躍のために師長が提供するサポート、環境整備など" 
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 次回面談予定 */}
          <div className="bg-gray-100 p-4 rounded-lg space-y-3">
            <h4 className="font-semibold">次回面談予定</h4>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="next-date">予定日</Label>
                <Input type="date" id="next-date" />
              </div>
              <div className="flex-1">
                <Label htmlFor="next-focus">重点確認事項</Label>
                <Input 
                  id="next-focus" 
                  placeholder="次回特に確認したい内容"
                />
              </div>
            </div>
          </div>

          {/* 提出ボタン */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button variant="outline">一時保存</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">面談記録を提出</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}