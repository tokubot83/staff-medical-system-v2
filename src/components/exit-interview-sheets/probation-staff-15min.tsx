'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { AlertCircle, LogOut, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ProbationStaff15MinExitInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-green-50">
          <div className="flex items-center gap-2">
            <LogOut className="h-6 w-6 text-green-600" />
            <CardTitle className="text-2xl">試用期間中職員 退職面談シート（15分版）</CardTitle>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　退職者：＿＿＿＿＿＿＿＿</p>
            <p>所属部署：＿＿＿＿＿＿　在職期間：＿＿ヶ月＿＿日</p>
            <p>入職日：＿＿＿＿年＿＿月＿＿日　退職予定日：＿＿＿＿年＿＿月＿＿日</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <Clock className="h-3 w-3 inline mr-1" />
              15分の簡潔な面談です。試用期間中の早期退職は採用・教育プロセスの改善に重要な情報となります。
              要点を押さえて効率的に聞き取りを行ってください。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 1. 退職理由の確認（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 退職理由の確認（5分）</h3>
            
            <div className="space-y-3">
              <Label>主な退職理由（最も当てはまるもの1つ）</Label>
              <RadioGroup>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="job-mismatch" id="job-mismatch" />
                    <Label htmlFor="job-mismatch" className="text-sm">仕事内容のミスマッチ</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="environment" id="environment" />
                    <Label htmlFor="environment" className="text-sm">職場環境が合わない</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="training" id="training" />
                    <Label htmlFor="training" className="text-sm">教育・サポート不足</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="relationships" id="relationships" />
                    <Label htmlFor="relationships" className="text-sm">人間関係の問題</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="conditions" id="conditions" />
                    <Label htmlFor="conditions" className="text-sm">労働条件の相違</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="health" id="health" />
                    <Label htmlFor="health" className="text-sm">体力・健康上の理由</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="personal" id="personal" />
                    <Label htmlFor="personal" className="text-sm">個人的事情</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="text-sm">その他</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>具体的な理由</Label>
              <Textarea 
                placeholder="退職を決めた具体的な理由を簡潔にお聞かせください"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 2. 入職時とのギャップ（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. 入職時とのギャップ（5分）</h3>
            
            <div className="space-y-2">
              <Label>期待と現実のギャップ</Label>
              <Textarea 
                placeholder="入職前に期待していたことと、実際に働いてみて違っていたこと"
                className="min-h-[60px]"
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <Label className="text-sm font-semibold">特にギャップを感じた項目</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "仕事内容",
                  "業務量",
                  "教育体制",
                  "職場の雰囲気",
                  "上司・先輩の対応",
                  "勤務時間・シフト",
                  "給与・待遇",
                  "施設・設備"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox id={`gap-${item}`} />
                    <Label htmlFor={`gap-${item}`} className="text-sm font-normal">{item}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>採用時の説明で不足していた情報</Label>
              <Textarea 
                placeholder="事前に知っていれば良かった情報があれば"
                className="min-h-[50px]"
              />
            </div>
          </div>

          {/* 3. 改善提案と引き継ぎ（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 改善提案と引き継ぎ（5分）</h3>
            
            <div className="space-y-2">
              <Label>新人受け入れ体制への提案</Label>
              <Textarea 
                placeholder="新人教育や受け入れ体制で改善した方が良い点"
                className="min-h-[50px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>引き継ぎ状況</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="necessary" id="necessary" />
                    <Label htmlFor="necessary" className="text-sm">必要（実施予定）</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unnecessary" id="unnecessary" />
                    <Label htmlFor="unnecessary" className="text-sm">不要</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>返却物</Label>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="uniform" />
                    <Label htmlFor="uniform" className="text-sm font-normal">制服</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="id-card" />
                    <Label htmlFor="id-card" className="text-sm font-normal">IDカード</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="keys" />
                    <Label htmlFor="keys" className="text-sm font-normal">鍵類</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>その他伝えたいこと</Label>
              <Textarea 
                placeholder="組織や同僚へのメッセージなど（任意）"
                className="min-h-[40px]"
              />
            </div>
          </div>

          {/* 面談者記入欄 */}
          <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg">面談者記入欄</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>退職理由の分類</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="preventable" id="preventable" />
                    <Label htmlFor="preventable" className="text-sm">防止可能だった</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="difficult" id="difficult" />
                    <Label htmlFor="difficult" className="text-sm">防止困難</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="inevitable" id="inevitable" />
                    <Label htmlFor="inevitable" className="text-sm">不可避</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>採用プロセスの課題</Label>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="screening" />
                    <Label htmlFor="screening" className="text-sm font-normal">選考基準</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="explanation" />
                    <Label htmlFor="explanation" className="text-sm font-normal">職務説明</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="expectation" />
                    <Label htmlFor="expectation" className="text-sm font-normal">期待値調整</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>早期離職防止のための改善点</Label>
              <Textarea 
                placeholder="採用・教育プロセスで改善すべき点"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>人事部への申し送り事項</Label>
              <Textarea 
                placeholder="採用・教育担当者に共有すべき情報"
                className="min-h-[50px]"
              />
            </div>
          </div>

          {/* 送信ボタン */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button variant="outline">一時保存</Button>
            <Button className="bg-green-600 hover:bg-green-700">面談記録を提出</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}