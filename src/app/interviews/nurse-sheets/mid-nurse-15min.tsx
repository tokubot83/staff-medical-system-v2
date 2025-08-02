'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';

export default function MidNurse15MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-orange-50">
          <CardTitle className="text-2xl">4-10年目中堅看護師 定期面談シート（15分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. 現況とモチベーション（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 現況とモチベーション（3分）</h3>
            
            <div className="space-y-2">
              <Label>仕事へのモチベーション</Label>
              <RadioGroup>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="motivation-high" />
                    <Label htmlFor="motivation-high" className="ml-2">高い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="normal" id="motivation-normal" />
                    <Label htmlFor="motivation-normal" className="ml-2">普通</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="motivation-low" />
                    <Label htmlFor="motivation-low" className="ml-2">低い</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>キャリアの停滞感</Label>
              <RadioGroup>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <RadioGroupItem value="none" id="stagnation-none" />
                    <Label htmlFor="stagnation-none" className="ml-2">感じない</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="some" id="stagnation-some" />
                    <Label htmlFor="stagnation-some" className="ml-2">やや感じる</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="strong" id="stagnation-strong" />
                    <Label htmlFor="stagnation-strong" className="ml-2">強く感じる</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 2. 役割と貢献（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. 役割と貢献（5分）</h3>
            
            <div className="space-y-2">
              <Label>現在の主な役割・責任</Label>
              <Textarea 
                placeholder="リーダー業務、委員会、プロジェクト等"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>チーム・組織への貢献</Label>
              <Textarea 
                placeholder="後輩指導、業務改善、その他の貢献"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>やりがいを感じること</Label>
              <Textarea 
                placeholder="具体的な場面や活動"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 3. 課題とキャリア志向（4分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 課題とキャリア志向（4分）</h3>
            
            <div className="space-y-2">
              <Label>現在の課題・悩み</Label>
              <Textarea 
                placeholder="業務、人間関係、キャリア等"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>今後の方向性</Label>
              <RadioGroup>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="specialist" id="path-specialist" />
                    <Label htmlFor="path-specialist" className="ml-2">スペシャリスト（専門・認定看護師）</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="management" id="path-management" />
                    <Label htmlFor="path-management" className="ml-2">マネジメント（主任・師長）</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="generalist" id="path-generalist" />
                    <Label htmlFor="path-generalist" className="ml-2">ジェネラリスト（現場のエキスパート）</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="undecided" id="path-undecided" />
                    <Label htmlFor="path-undecided" className="ml-2">検討中</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 4. 今後の支援（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 今後の支援（3分）</h3>
            
            <div className="space-y-2">
              <Label>必要な支援・機会</Label>
              <Textarea 
                placeholder="研修、新しい役割、環境調整など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>次回までの行動計画</Label>
              <Textarea 
                placeholder="具体的な取り組み"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <Textarea 
              placeholder="総合評価、強み、今後の育成方針など"
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