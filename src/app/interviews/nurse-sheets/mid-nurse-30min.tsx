'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export default function MidNurse30MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-orange-50">
          <CardTitle className="text-2xl">4-10年目中堅看護師 定期面談シート（30分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>配属部署：＿＿＿＿＿＿＿＿　経験年数：＿＿年＿＿ヶ月</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. 現況確認とモチベーション（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 現況確認とモチベーション（5分）</h3>
            
            <div className="space-y-2">
              <Label>ワークエンゲージメント</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">仕事への熱意</span>
                  <RadioGroup className="flex flex-row">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5" id="vigor-5" />
                      <Label htmlFor="vigor-5" className="text-sm">5</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4" id="vigor-4" />
                      <Label htmlFor="vigor-4" className="text-sm">4</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="vigor-3" />
                      <Label htmlFor="vigor-3" className="text-sm">3</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="vigor-2" />
                      <Label htmlFor="vigor-2" className="text-sm">2</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="vigor-1" />
                      <Label htmlFor="vigor-1" className="text-sm">1</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">仕事への没頭度</span>
                  <RadioGroup className="flex flex-row">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5" id="dedication-5" />
                      <Label htmlFor="dedication-5" className="text-sm">5</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4" id="dedication-4" />
                      <Label htmlFor="dedication-4" className="text-sm">4</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="dedication-3" />
                      <Label htmlFor="dedication-3" className="text-sm">3</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="dedication-2" />
                      <Label htmlFor="dedication-2" className="text-sm">2</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="dedication-1" />
                      <Label htmlFor="dedication-1" className="text-sm">1</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>バーンアウトリスク評価</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="exhaustion" />
                  <Label htmlFor="exhaustion" className="text-sm">情緒的消耗感を感じる</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="cynicism" />
                  <Label htmlFor="cynicism" className="text-sm">仕事への冷めた態度がある</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="achievement" />
                  <Label htmlFor="achievement" className="text-sm">達成感の低下を感じる</Label>
                </div>
              </div>
              <Textarea 
                placeholder="ストレス要因、対処方法、必要な支援"
                className="min-h-[60px] mt-2"
              />
            </div>

            <div className="space-y-2">
              <Label>ワークライフバランス</Label>
              <Textarea 
                placeholder="仕事と私生活の両立状況、家族の状況、今後のライフイベント"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 2. 現在の役割と実績（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. 現在の役割と実績（8分）</h3>
            
            <div className="space-y-2">
              <Label>担当している役割・責任</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="leader" />
                  <Label htmlFor="leader" className="text-sm">チームリーダー</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="preceptor" />
                  <Label htmlFor="preceptor" className="text-sm">プリセプター</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="committee" />
                  <Label htmlFor="committee" className="text-sm">委員会メンバー</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="project" />
                  <Label htmlFor="project" className="text-sm">プロジェクト担当</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="education" />
                  <Label htmlFor="education" className="text-sm">教育担当</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="other-role" />
                  <Label htmlFor="other-role" className="text-sm">その他</Label>
                </div>
              </div>
              <Textarea 
                placeholder="具体的な活動内容と成果"
                className="min-h-[80px] mt-2"
              />
            </div>

            <div className="space-y-2">
              <Label>最近の主な実績・貢献</Label>
              <Textarea 
                placeholder="業務改善、後輩育成、患者ケアでの成果など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>専門性の発揮</Label>
              <Textarea 
                placeholder="得意分野、専門知識の活用、他部署への支援など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>リーダーシップの発揮状況</Label>
              <Textarea 
                placeholder="チーム運営、問題解決、調整役としての活動"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 3. 課題と成長ニーズ（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 課題と成長ニーズ（7分）</h3>
            
            <div className="space-y-2">
              <Label>現在直面している課題</Label>
              <div className="space-y-2">
                <Textarea 
                  placeholder="技術的課題"
                  className="min-h-[50px]"
                />
                <Textarea 
                  placeholder="人間関係の課題"
                  className="min-h-[50px]"
                />
                <Textarea 
                  placeholder="マネジメント上の課題"
                  className="min-h-[50px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>スキルアップが必要な領域</Label>
              <Textarea 
                placeholder="強化したい能力、学びたい分野"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織からの期待とのギャップ</Label>
              <Textarea 
                placeholder="期待されている役割と現実のギャップ"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. キャリアビジョン（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. キャリアビジョン（5分）</h3>
            
            <div className="space-y-2">
              <Label>5年後のキャリアイメージ</Label>
              <RadioGroup>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="specialist" id="career-specialist" />
                    <Label htmlFor="career-specialist" className="ml-2">
                      スペシャリスト志向（認定・専門看護師、特定行為等）
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="management" id="career-management" />
                    <Label htmlFor="career-management" className="ml-2">
                      マネジメント志向（主任・師長・看護部）
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="educator" id="career-educator" />
                    <Label htmlFor="career-educator" className="ml-2">
                      教育者志向（実習指導者・教育担当）
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="generalist" id="career-generalist" />
                    <Label htmlFor="career-generalist" className="ml-2">
                      ジェネラリスト志向（現場のエキスパート）
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="other" id="career-other" />
                    <Label htmlFor="career-other" className="ml-2">その他</Label>
                  </div>
                </div>
              </RadioGroup>
              <Textarea 
                placeholder="具体的なビジョン、必要な準備"
                className="min-h-[60px] mt-2"
              />
            </div>

            <div className="space-y-2">
              <Label>異動・部署変更の希望</Label>
              <RadioGroup>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <RadioGroupItem value="yes" id="transfer-yes" />
                    <Label htmlFor="transfer-yes" className="ml-2">あり</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="no" id="transfer-no" />
                    <Label htmlFor="transfer-no" className="ml-2">なし</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="considering" id="transfer-considering" />
                    <Label htmlFor="transfer-considering" className="ml-2">検討中</Label>
                  </div>
                </div>
              </RadioGroup>
              <Textarea 
                placeholder="希望部署、理由、時期など"
                className="min-h-[50px] mt-2"
              />
            </div>
          </div>

          {/* 5. アクションプラン（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. アクションプラン（5分）</h3>
            
            <div className="space-y-2">
              <Label>短期目標（3ヶ月）</Label>
              <Textarea 
                placeholder="具体的で測定可能な目標"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>中期目標（1年）</Label>
              <Textarea 
                placeholder="達成したい成果、取得したい資格など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織からの支援内容</Label>
              <Textarea 
                placeholder="研修機会、役割付与、環境調整など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>次回面談予定</Label>
              <input type="date" className="border rounded px-3 py-2" />
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <div className="space-y-2">
              <Label>人材評価</Label>
              <RadioGroup>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <RadioGroupItem value="key" id="talent-key" />
                    <Label htmlFor="talent-key" className="ml-2">キーパーソン</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="talent-high" />
                    <Label htmlFor="talent-high" className="ml-2">ハイポテンシャル</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="solid" id="talent-solid" />
                    <Label htmlFor="talent-solid" className="ml-2">堅実な戦力</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="developing" id="talent-developing" />
                    <Label htmlFor="talent-developing" className="ml-2">要育成</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label>リテンション施策の必要性</Label>
              <RadioGroup>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="retention-high" />
                    <Label htmlFor="retention-high" className="ml-2">高（要重点フォロー）</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="retention-medium" />
                    <Label htmlFor="retention-medium" className="ml-2">中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="retention-low" />
                    <Label htmlFor="retention-low" className="ml-2">低</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            <Textarea 
              placeholder="総合評価、育成方針、組織への提言など"
              className="min-h-[120px]"
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