'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { AlertCircle, LogOut, AlertTriangle, UserX } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ProbationStaff30MinExitInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-teal-50">
          <div className="flex items-center gap-2">
            <LogOut className="h-6 w-6 text-teal-600" />
            <CardTitle className="text-2xl">試用期間中職員 退職面談シート（30分版）</CardTitle>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　退職者：＿＿＿＿＿＿＿＿</p>
            <p>所属部署：＿＿＿＿＿＿　在職期間：＿＿ヶ月＿＿日</p>
            <p>入職日：＿＿＿＿年＿＿月＿＿日　退職予定日：＿＿＿＿年＿＿月＿＿日</p>
          </div>
          <Alert className="mt-3 bg-yellow-50 border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              30分の詳細面談です。試用期間中の早期退職は採用ミスマッチの重要なシグナルです。
              原因を詳しく分析し、採用・教育プロセスの改善につなげてください。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 1. 退職理由の詳細確認（8分） */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <UserX className="h-5 w-5 text-teal-600" />
              <h3 className="font-bold text-lg border-b pb-2 flex-1">1. 退職理由の詳細確認（8分）</h3>
            </div>
            
            <div className="space-y-3">
              <Label>主な退職理由（複数選択可）</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "仕事内容が想定と違った",
                  "業務難易度が高すぎた",
                  "教育・研修が不十分",
                  "OJTサポート不足",
                  "職場の雰囲気が合わない",
                  "人間関係のトラブル",
                  "上司との相性",
                  "労働時間・シフトの問題",
                  "給与・待遇の不満",
                  "通勤の負担",
                  "体力的についていけない",
                  "精神的ストレス",
                  "他の仕事が決まった",
                  "家族・個人的事情",
                  "健康上の問題",
                  "その他"
                ].map((reason) => (
                  <div key={reason} className="flex items-center space-x-2">
                    <Checkbox id={reason} />
                    <Label htmlFor={reason} className="text-sm font-normal">{reason}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>最も大きな退職理由の詳細</Label>
              <Textarea 
                placeholder="退職を決意した決定的な要因と、その具体的な状況を教えてください"
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>退職を考え始めた時期</Label>
                <Input placeholder="例：入職2週間後" />
              </div>
              <div className="space-y-2">
                <Label>相談した相手</Label>
                <Input placeholder="例：教育担当、同僚" />
              </div>
            </div>
          </div>

          {/* 2. 採用・入職時のギャップ（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. 採用・入職時のギャップ（8分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">期待と現実のギャップ評価</Label>
              <div className="space-y-2">
                {[
                  "仕事内容・業務範囲",
                  "必要なスキル・知識",
                  "業務量・忙しさ",
                  "教育・研修内容",
                  "職場の雰囲気・文化",
                  "上司・先輩の指導",
                  "チームワーク・協力体制",
                  "勤務時間・シフト",
                  "給与・手当",
                  "福利厚生・休暇"
                ].map((item) => (
                  <div key={item} className="grid grid-cols-5 gap-2 items-center">
                    <span className="text-sm col-span-2">{item}</span>
                    <RadioGroup orientation="horizontal" className="col-span-3">
                      <div className="flex gap-2">
                        <div className="flex items-center">
                          <RadioGroupItem value={`${item}-better`} id={`${item}-better`} className="h-3 w-3" />
                          <Label htmlFor={`${item}-better`} className="ml-1 text-xs">期待以上</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value={`${item}-same`} id={`${item}-same`} className="h-3 w-3" />
                          <Label htmlFor={`${item}-same`} className="ml-1 text-xs">期待通り</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value={`${item}-worse`} id={`${item}-worse`} className="h-3 w-3" />
                          <Label htmlFor={`${item}-worse`} className="ml-1 text-xs">期待以下</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>面接・説明会で聞いていた内容との相違点</Label>
              <Textarea 
                placeholder="採用時の説明と実際の業務で大きく違っていた点"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>事前に知りたかった情報</Label>
              <Textarea 
                placeholder="採用選考時に詳しく説明してほしかった情報"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 3. 教育・サポート体制の評価（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 教育・サポート体制の評価（7分）</h3>
            
            <div className="space-y-2">
              <Label>入職時研修について</Label>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">内容の適切性</Label>
                  <RadioGroup>
                    <div className="flex gap-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="training-good" id="training-good" className="h-3 w-3" />
                        <Label htmlFor="training-good" className="ml-1 text-xs">良い</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="training-normal" id="training-normal" className="h-3 w-3" />
                        <Label htmlFor="training-normal" className="ml-1 text-xs">普通</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="training-poor" id="training-poor" className="h-3 w-3" />
                        <Label htmlFor="training-poor" className="ml-1 text-xs">不足</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">期間</Label>
                  <RadioGroup>
                    <div className="flex gap-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="period-long" id="period-long" className="h-3 w-3" />
                        <Label htmlFor="period-long" className="ml-1 text-xs">長い</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="period-right" id="period-right" className="h-3 w-3" />
                        <Label htmlFor="period-right" className="ml-1 text-xs">適切</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="period-short" id="period-short" className="h-3 w-3" />
                        <Label htmlFor="period-short" className="ml-1 text-xs">短い</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">理解度確認</Label>
                  <RadioGroup>
                    <div className="flex gap-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="check-yes" id="check-yes" className="h-3 w-3" />
                        <Label htmlFor="check-yes" className="ml-1 text-xs">あり</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="check-no" id="check-no" className="h-3 w-3" />
                        <Label htmlFor="check-no" className="ml-1 text-xs">なし</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>OJT・現場教育について</Label>
              <Textarea 
                placeholder="教育担当者のサポート、質問のしやすさ、フォロー体制など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>最も困ったこと・不安だったこと</Label>
              <Textarea 
                placeholder="業務で困った場面、サポートが欲しかった状況など"
                className="min-h-[60px]"
              />
            </div>

            <div className="bg-amber-50 p-3 rounded-lg">
              <Label className="text-sm font-semibold">改善が必要な教育項目</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  "基礎知識の説明",
                  "実技指導",
                  "安全教育",
                  "接遇・マナー",
                  "システム操作",
                  "業務フロー説明",
                  "チーム連携",
                  "緊急時対応"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox id={`improve-${item}`} />
                    <Label htmlFor={`improve-${item}`} className="text-sm font-normal">{item}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. 改善提案と今後（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 改善提案と今後（5分）</h3>
            
            <div className="space-y-2">
              <Label>採用プロセスへの提案</Label>
              <Textarea 
                placeholder="面接方法、職場見学、採用基準など改善すべき点"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>新人受け入れ体制への提案</Label>
              <Textarea 
                placeholder="オリエンテーション、教育プログラム、サポート体制の改善点"
                className="min-h-[60px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>この職場を勧めるか</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="recommend-yes" id="recommend-yes" />
                    <Label htmlFor="recommend-yes" className="text-sm">勧める</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="recommend-condition" id="recommend-condition" />
                    <Label htmlFor="recommend-condition" className="text-sm">条件付きで勧める</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="recommend-no" id="recommend-no" />
                    <Label htmlFor="recommend-no" className="text-sm">勧めない</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>今後の予定</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="next-decided" id="next-decided" />
                    <Label htmlFor="next-decided" className="text-sm">転職先決定</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="next-searching" id="next-searching" />
                    <Label htmlFor="next-searching" className="text-sm">求職活動中</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="next-rest" id="next-rest" />
                    <Label htmlFor="next-rest" className="text-sm">しばらく休養</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="next-other" id="next-other" />
                    <Label htmlFor="next-other" className="text-sm">その他</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* 5. 手続き確認（2分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. 手続き確認（2分）</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">返却物確認</Label>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="return-uniform" />
                    <Label htmlFor="return-uniform" className="text-xs font-normal">制服・作業着</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="return-id" />
                    <Label htmlFor="return-id" className="text-xs font-normal">社員証・IDカード</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="return-key" />
                    <Label htmlFor="return-key" className="text-xs font-normal">鍵・セキュリティカード</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="return-manual" />
                    <Label htmlFor="return-manual" className="text-xs font-normal">マニュアル・資料</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">引き継ぎ</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="handover-done" id="handover-done" />
                    <Label htmlFor="handover-done" className="text-xs">完了</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="handover-minimal" id="handover-minimal" />
                    <Label htmlFor="handover-minimal" className="text-xs">最小限実施</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="handover-none" id="handover-none" />
                    <Label htmlFor="handover-none" className="text-xs">不要</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">最終出勤日</Label>
                <Input type="date" />
              </div>
            </div>
          </div>

          {/* 面談者記入欄 */}
          <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg">面談者記入欄</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>早期退職の主要因</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cause-mismatch" id="cause-mismatch" />
                    <Label htmlFor="cause-mismatch" className="text-sm">採用ミスマッチ</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cause-education" id="cause-education" />
                    <Label htmlFor="cause-education" className="text-sm">教育不足</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cause-environment" id="cause-environment" />
                    <Label htmlFor="cause-environment" className="text-sm">職場環境</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cause-personal" id="cause-personal" />
                    <Label htmlFor="cause-personal" className="text-sm">本人要因</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>改善優先度</Label>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="priority-recruitment" />
                    <Label htmlFor="priority-recruitment" className="text-sm font-normal">採用方法</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="priority-orientation" />
                    <Label htmlFor="priority-orientation" className="text-sm font-normal">初期研修</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="priority-ojt" />
                    <Label htmlFor="priority-ojt" className="text-sm font-normal">OJT体制</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="priority-support" />
                    <Label htmlFor="priority-support" className="text-sm font-normal">フォロー体制</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>採用・教育部門への具体的提言</Label>
              <Textarea 
                placeholder="早期離職を防ぐための具体的な改善策"
                className="min-h-[80px]"
              />
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <Label className="text-sm font-semibold">類似ケースの有無</Label>
              </div>
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="similar-yes" id="similar-yes" />
                  <Label htmlFor="similar-yes" className="text-sm">
                    あり（過去3ヶ月以内に同様の理由での退職者がいる）
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="similar-no" id="similar-no" />
                  <Label htmlFor="similar-no" className="text-sm">なし</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>フォローアップ事項</Label>
              <Textarea 
                placeholder="人事部・教育部門と共有すべき重要事項"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 送信ボタン */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button variant="outline">一時保存</Button>
            <Button className="bg-teal-600 hover:bg-teal-700">面談記録を提出</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}