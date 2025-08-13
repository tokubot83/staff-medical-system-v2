'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MotivationTypeSection, getMotivationTypeQuestions } from './components/MotivationType';

export default function LeaderNurseUnified45MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-amber-50">
          <CardTitle className="text-2xl">リーダー看護師（主任・副師長）定期面談シート V5（45分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>リーダー経験：＿＿年＿＿ヶ月　担当領域：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              45分の詳細面談です。<strong>動機タイプ判定</strong>を活用し、リーダー看護師の統率力開発、管理スキル向上、次世代育成を包括的に支援します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 新規追加: 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. リーダーシップ・チーム運営の詳細評価（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. リーダーシップ・チーム運営の詳細評価（10分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">リーダーシップ・管理能力</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "チーム統率力",
                "意思決定スキル",
                "コミュニケーション",
                "問題解決能力",
                "調整・仲裁力",
                "部下育成力",
                "業務管理能力",
                "変化対応力"
              ].map((item) => (
                <RadioGroup key={item}>
                  <div className="grid grid-cols-6 gap-2 items-center">
                    <span className="text-sm font-medium">{item}</span>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-5`} id={`${item}-5`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-4`} id={`${item}-4`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-3`} id={`${item}-3`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-2`} id={`${item}-2`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-1`} id={`${item}-1`} className="w-4 h-4" />
                    </div>
                  </div>
                </RadioGroup>
              ))}
              <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded">
                <p><strong>評価基準：</strong></p>
                <p><span className="text-green-600 font-medium">5：</span>優秀なリーダー　<span className="text-blue-600 font-medium">4：</span>良好なリーダー　<span className="text-yellow-600 font-medium">3：</span>標準的　<span className="text-orange-600 font-medium">2：</span>要向上　<span className="text-red-600 font-medium">1：</span>要支援</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>現在のリーダー役割・責任範囲</Label>
              <Textarea 
                placeholder="担当チーム規模、主な責任、委員会活動、プロジェクト参加など"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>この半年間の主要な成果・実績</Label>
              <Textarea 
                placeholder="チーム成果、業務改善、部下育成、課題解決などの具体的成果"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>部下・後輩の指導・育成実績</Label>
              <Textarea 
                placeholder="指導人数、育成方法、成長実績、メンタリング活動など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. 職員の現状確認（モチベーション・健康・エンゲージメント）（12分） */}
          <div className="space-y-4 bg-green-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 職員の現状確認（モチベーション・健康・エンゲージメント）（12分）</h3>
            
            {/* 動機タイプ別の追加質問（全ての質問） */}
            {selectedMotivationType && typeSpecificQuestions.length > 0 && (
              <div className="bg-purple-50 p-4 rounded-lg space-y-3 mb-4">
                <Label className="text-base font-semibold text-purple-700">
                  動機タイプに基づく個別質問（リーダー看護師向け）
                </Label>
                {typeSpecificQuestions.map((question, index) => (
                  <div key={index} className="space-y-2">
                    <Label className="text-sm">{question}</Label>
                    <Textarea 
                      placeholder="リーダーとしての視点でお答えください"
                      className="min-h-[60px]"
                    />
                  </div>
                ))}
              </div>
            )}
            
            {/* モチベーションと満足度 */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">モチベーションと満足度</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "現在のモチベーション",
                "給与・待遇",
                "勤務シフト",
                "人間関係",
                "上司のサポート",
                "成長機会",
                "職場環境",
                "仕事のやりがい",
                "評価の公正性"
              ].map((item) => (
                <RadioGroup key={item}>
                  <div className="grid grid-cols-6 gap-2 items-center">
                    <span className="text-sm font-medium">{item}</span>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-5`} id={`${item}-5`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-4`} id={`${item}-4`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-3`} id={`${item}-3`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-2`} id={`${item}-2`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-1`} id={`${item}-1`} className="w-4 h-4" />
                    </div>
                  </div>
                </RadioGroup>
              ))}
              <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded mt-3">
                <p><strong>評価基準：</strong></p>
                <p><span className="text-green-600 font-medium">5：</span>非常に満足　<span className="text-blue-600 font-medium">4：</span>満足　<span className="text-yellow-600 font-medium">3：</span>普通　<span className="text-orange-600 font-medium">2：</span>やや不満　<span className="text-red-600 font-medium">1：</span>不満</p>
              </div>
            </div>

            {/* 健康・ストレス・エンゲージメント */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">健康・ストレス・エンゲージメント</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "健康状態",
                "ストレスレベル",
                "睡眠の質",
                "3年後の継続意向",
                "職場推奨度"
              ].map((item) => (
                <RadioGroup key={item}>
                  <div className="grid grid-cols-6 gap-2 items-center">
                    <span className="text-sm font-medium">{item}</span>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-5`} id={`${item}-5`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-4`} id={`${item}-4`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-3`} id={`${item}-3`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-2`} id={`${item}-2`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-1`} id={`${item}-1`} className="w-4 h-4" />
                    </div>
                  </div>
                </RadioGroup>
              ))}
              <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded mt-3">
                <p><strong>評価基準：</strong></p>
                <p><span className="font-medium">健康状態：</span><span className="text-green-600 font-medium">5：</span>非常に良好　<span className="text-blue-600 font-medium">4：</span>良好　<span className="text-yellow-600 font-medium">3：</span>普通　<span className="text-orange-600 font-medium">2：</span>やや不調　<span className="text-red-600 font-medium">1：</span>不調</p>
                <p><span className="font-medium">ストレス：</span><span className="text-green-600 font-medium">5：</span>非常に低い　<span className="text-blue-600 font-medium">4：</span>低い　<span className="text-yellow-600 font-medium">3：</span>普通　<span className="text-orange-600 font-medium">2：</span>高い　<span className="text-red-600 font-medium">1：</span>非常に高い</p>
                <p><span className="font-medium">睡眠の質：</span><span className="text-green-600 font-medium">5：</span>非常に良い　<span className="text-blue-600 font-medium">4：</span>良い　<span className="text-yellow-600 font-medium">3：</span>普通　<span className="text-orange-600 font-medium">2：</span>悪い　<span className="text-red-600 font-medium">1：</span>非常に悪い</p>
                <p><span className="font-medium">継続意向：</span><span className="text-green-600 font-medium">5：</span>ぜひ続けたい　<span className="text-blue-600 font-medium">4：</span>続けたい　<span className="text-yellow-600 font-medium">3：</span>わからない　<span className="text-orange-600 font-medium">2：</span>転職検討　<span className="text-red-600 font-medium">1：</span>転職活動中</p>
                <p><span className="font-medium">職場推奨度：</span><span className="text-green-600 font-medium">5：</span>積極的に勧める　<span className="text-blue-600 font-medium">4：</span>勧める　<span className="text-yellow-600 font-medium">3：</span>どちらでもない　<span className="text-orange-600 font-medium">2：</span>あまり勧めない　<span className="text-red-600 font-medium">1：</span>勧めない</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="text-base font-semibold">リーダー特有のストレス要因</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-team-management" />
                  <Label htmlFor="stress-team-management" className="ml-2">チーム管理</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-decision" />
                  <Label htmlFor="stress-decision" className="ml-2">意思決定責任</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-conflict" />
                  <Label htmlFor="stress-conflict" className="ml-2">人間関係調整</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-workload" />
                  <Label htmlFor="stress-workload" className="ml-2">業務負荷</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-performance" />
                  <Label htmlFor="stress-performance" className="ml-2">成果責任</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-sandwich" />
                  <Label htmlFor="stress-sandwich" className="ml-2">板挟み状態</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-development" />
                  <Label htmlFor="stress-development" className="ml-2">部下育成</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-time" />
                  <Label htmlFor="stress-time" className="ml-2">時間管理</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-other" />
                  <Label htmlFor="stress-other" className="ml-2">その他</Label>
                </div>
              </div>
              <div className="mt-2">
                <Label className="text-sm">ストレス要因の詳細（自由記述）</Label>
                <Textarea 
                  placeholder="リーダー特有のストレス要因について、具体的な状況を記入"
                  className="min-h-[60px] mt-1"
                />
              </div>
            </div>
          </div>

          {/* 3. 管理スキル・キャリア開発（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 管理スキル・キャリア開発（10分）</h3>
            
            <div className="space-y-2">
              <Label>将来のキャリアビジョン（管理職・専門職）</Label>
              <Textarea 
                placeholder="師長・管理職志向、専門領域の深化、教育職など将来の方向性"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>強化したい管理スキル・能力</Label>
              <Textarea 
                placeholder="リーダーシップ、マネジメント、コーチング、戦略思考など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>現在取り組んでいる自己啓発・学習</Label>
              <Textarea 
                placeholder="管理研修、資格取得、勉強会参加、読書など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>希望する研修・育成支援</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-leadership" />
                  <Label htmlFor="training-leadership" className="ml-2">リーダーシップ研修</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-management" />
                  <Label htmlFor="training-management" className="ml-2">管理職準備研修</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-communication" />
                  <Label htmlFor="training-communication" className="ml-2">コミュニケーション研修</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-coaching" />
                  <Label htmlFor="training-coaching" className="ml-2">コーチング研修</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-project" />
                  <Label htmlFor="training-project" className="ml-2">プロジェクト管理</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-mentoring" />
                  <Label htmlFor="training-mentoring" className="ml-2">メンタリング研修</Label>
                </div>
              </div>
            </div>
          </div>

          {/* 4. チーム運営・組織貢献（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. チーム運営・組織貢献（8分）</h3>
            
            <div className="space-y-2">
              <Label>チーム運営の課題・改善取り組み</Label>
              <Textarea 
                placeholder="チームワーク向上、業務効率化、コミュニケーション改善など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>部下・後輩の育成計画・取り組み</Label>
              <Textarea 
                placeholder="個別指導計画、スキル開発、キャリア支援など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>他部署・他職種との連携状況</Label>
              <Textarea 
                placeholder="連携の頻度、課題、改善提案など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織・部署への改善提案・貢献</Label>
              <Textarea 
                placeholder="業務改善、制度提案、効率化、品質向上など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 5. 今後のアクションプラン（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. 今後のアクションプラン（5分）</h3>
            
            {/* 動機タイプに基づく推奨アクション（リーダー看護師向け） */}
            {selectedMotivationType && (
              <Alert className="bg-purple-50 border-purple-200">
                <AlertDescription>
                  <strong>動機タイプに基づくリーダー看護師向け推奨アクション：</strong>
                  <div className="mt-2">
                    {selectedMotivationType === 'growth' && 'リーダーシップ研修の受講、新規プロジェクトリーダー抜擢、管理職準備研修'}
                    {selectedMotivationType === 'recognition' && 'リーダーシップ成果の表彰、チーム成果の組織内発表、昇進候補者としての評価'}
                    {selectedMotivationType === 'stability' && '段階的な責任拡大、安定したチーム体制でのリーダー役割明確化'}
                    {selectedMotivationType === 'teamwork' && 'チーム間調整役の委任、協働プロジェクトのリーダー、メンター制度での指導役'}
                    {selectedMotivationType === 'efficiency' && 'チーム効率化プロジェクトの推進、業務改善の主導、最適化ツール導入'}
                    {selectedMotivationType === 'compensation' && '昇進機会の明確化、リーダー手当の検討、成果連動報酬の適用'}
                    {selectedMotivationType === 'creativity' && '独自のチーム運営手法の支援、新しいリーダーシップスタイルの試行'}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label>次回面談までの重点目標（2-3個）</Label>
              <Textarea 
                placeholder="チーム運営、部下育成、スキル向上、組織貢献など具体的に"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>必要なサポート・リソース</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-authority" />
                  <Label htmlFor="support-authority" className="ml-2">権限委譲</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-training" />
                  <Label htmlFor="support-training" className="ml-2">管理職研修</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-mentor" />
                  <Label htmlFor="support-mentor" className="ml-2">上級者メンタリング</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-project" />
                  <Label htmlFor="support-project" className="ml-2">プロジェクト参加</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-time" />
                  <Label htmlFor="support-time" className="ml-2">研修時間確保</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-team" />
                  <Label htmlFor="support-team" className="ml-2">チーム体制強化</Label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="next-interview">次回面談予定</Label>
                <Input type="date" id="next-interview" />
              </div>
              <div>
                <Label htmlFor="follow-up">フォローアップ方法</Label>
                <Input type="text" id="follow-up" placeholder="月次1on1、チーム運営進捗確認など" />
              </div>
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            
            {/* 動機タイプの記録 */}
            <div className="bg-purple-50 p-3 rounded-lg">
              <Label>判定された動機タイプ</Label>
              <Input 
                type="text" 
                value={selectedMotivationType ? 
                  `${selectedMotivationType === 'growth' ? '成長・挑戦型' : ''}${selectedMotivationType === 'recognition' ? '評価・承認型' : ''}${selectedMotivationType === 'stability' ? '安定・安心型' : ''}${selectedMotivationType === 'teamwork' ? '関係・調和型' : ''}${selectedMotivationType === 'efficiency' ? '効率・合理型' : ''}${selectedMotivationType === 'compensation' ? '報酬・待遇型' : ''}${selectedMotivationType === 'creativity' ? '自由・創造型' : ''}` 
                  : '未判定'
                } 
                readOnly 
                className="mt-1 bg-white"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>リーダーシップ評価</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="outstanding" id="leadership-o" />
                    <Label htmlFor="leadership-o" className="ml-1 text-sm">卓越したリーダー</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="leadership-e" />
                    <Label htmlFor="leadership-e" className="ml-1 text-sm">優秀なリーダー</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="leadership-g" />
                    <Label htmlFor="leadership-g" className="ml-1 text-sm">良好なリーダー</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="developing" id="leadership-d" />
                    <Label htmlFor="leadership-d" className="ml-1 text-sm">発展途上</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>管理職適性</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="high-readiness" id="mgmt-h" />
                    <Label htmlFor="mgmt-h" className="ml-1 text-sm">高い適性</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="moderate-readiness" id="mgmt-m" />
                    <Label htmlFor="mgmt-m" className="ml-1 text-sm">中程度の適性</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="development-needed" id="mgmt-d" />
                    <Label htmlFor="mgmt-d" className="ml-1 text-sm">育成要</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="specialist-oriented" id="mgmt-s" />
                    <Label htmlFor="mgmt-s" className="ml-1 text-sm">専門職志向</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>組織貢献度</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="contrib-h" />
                    <Label htmlFor="contrib-h" className="ml-1 text-sm">高い</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="moderate" id="contrib-m" />
                    <Label htmlFor="contrib-m" className="ml-1 text-sm">中程度</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="standard" id="contrib-s" />
                    <Label htmlFor="contrib-s" className="ml-1 text-sm">標準的</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="limited" id="contrib-l" />
                    <Label htmlFor="contrib-l" className="ml-1 text-sm">限定的</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>推奨する育成方針</Label>
              <RadioGroup>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="management-prep" id="develop-mgmt" />
                    <Label htmlFor="develop-mgmt" className="ml-2">管理職準備</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="leadership-strengthen" id="develop-lead" />
                    <Label htmlFor="develop-lead" className="ml-2">リーダーシップ強化</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="specialist-leader" id="develop-spec" />
                    <Label htmlFor="develop-spec" className="ml-2">専門性リーダー</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="skill-development" id="develop-skill" />
                    <Label htmlFor="develop-skill" className="ml-2">スキル向上重点</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            <Textarea 
              placeholder="総合所見、リーダーシップの強み・改善点、動機タイプを考慮した具体的な育成計画、管理職候補としての評価、特記事項など詳細に記入"
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