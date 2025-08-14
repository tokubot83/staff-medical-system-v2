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

export default function MidlevelNurseUnified45MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-amber-50">
          <CardTitle className="text-2xl">中堅看護師（4-10年目）定期面談シート V5（45分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              45分の詳細面談です。<strong>動機タイプ判定</strong>を活用し、中堅看護師のリーダーシップ開発、専門性向上、組織貢献を包括的に支援します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 新規追加: 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. リーダーシップ・専門性の詳細評価（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. リーダーシップ・専門性の詳細評価（10分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">現在の役割・能力評価</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "リーダーシップ",
                "メンタリング能力",
                "専門知識・技術",
                "問題解決力",
                "変革推進力",
                "組織理解・貢献",
                "教育・指導力",
                "チーム調整力"
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
                <p><span className="text-green-600 font-medium">5：</span>優秀　<span className="text-blue-600 font-medium">4：</span>良好　<span className="text-yellow-600 font-medium">3：</span>標準　<span className="text-orange-600 font-medium">2：</span>要向上　<span className="text-red-600 font-medium">1：</span>要支援</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>現在のリーダー役割・委員会活動の詳細</Label>
              <Textarea 
                placeholder="チームリーダー、委員会、プロジェクト、研修担当など具体的な役割と成果"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>この半年間の主要な成果・実績</Label>
              <Textarea 
                placeholder="業務改善、後輩育成、専門性発揮、表彰・評価など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>後輩育成・メンタリングの実績</Label>
              <Textarea 
                placeholder="プリセプター経験、指導実績、メンタリングの工夫、育成した人材の成長など"
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
                  動機タイプに基づく個別質問（中堅看護師向け）
                </Label>
                {typeSpecificQuestions.map((question, index) => (
                  <div key={index} className="space-y-2">
                    <Label className="text-sm">{question}</Label>
                    <Textarea 
                      placeholder="中堅看護師としての経験を踏まえてお答えください"
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
              <Label className="text-base font-semibold">ストレス要因の詳細</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-workload" />
                  <Label htmlFor="stress-workload" className="ml-2">業務負荷</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-relations" />
                  <Label htmlFor="stress-relations" className="ml-2">人間関係</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-overtime" />
                  <Label htmlFor="stress-overtime" className="ml-2">残業時間</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-balance" />
                  <Label htmlFor="stress-balance" className="ml-2">家庭との両立</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-skill" />
                  <Label htmlFor="stress-skill" className="ml-2">スキル不足</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-career" />
                  <Label htmlFor="stress-career" className="ml-2">キャリア不安</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-shift" />
                  <Label htmlFor="stress-shift" className="ml-2">シフト勤務</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-responsibility" />
                  <Label htmlFor="stress-responsibility" className="ml-2">責任の重さ</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-other" />
                  <Label htmlFor="stress-other" className="ml-2">その他</Label>
                </div>
              </div>
              <div className="mt-2">
                <Label className="text-sm">ストレス要因の詳細（自由記述）</Label>
                <Textarea 
                  placeholder="上記で選択したストレス要因について、具体的な状況を記入"
                  className="min-h-[60px] mt-1"
                />
              </div>
            </div>
          </div>

          {/* 3. キャリア開発・専門性向上（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. キャリア開発・専門性向上（10分）</h3>
            
            <div className="space-y-2">
              <Label>将来のキャリアビジョン（5-10年後）</Label>
              <Textarea 
                placeholder="認定看護師、専門看護師、管理職、教育職など具体的な目標"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>専門性を高めたい分野・興味のある領域</Label>
              <Textarea 
                placeholder="救急、ICU、緩和ケア、地域連携、看護管理など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>現在取り組んでいる自己研鑽・学習活動</Label>
              <Textarea 
                placeholder="院内外研修、学会参加、資格取得、研究活動など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>希望する研修・キャリア支援</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-certification" />
                  <Label htmlFor="training-certification" className="ml-2">認定・専門資格支援</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-management" />
                  <Label htmlFor="training-management" className="ml-2">管理研修</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-conference" />
                  <Label htmlFor="training-conference" className="ml-2">学会・セミナー参加</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-external" />
                  <Label htmlFor="training-external" className="ml-2">院外派遣研修</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-research" />
                  <Label htmlFor="training-research" className="ml-2">研究活動支援</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="training-rotation" />
                  <Label htmlFor="training-rotation" className="ml-2">部署ローテーション</Label>
                </div>
              </div>
            </div>
          </div>

          {/* 4. 組織貢献・変革推進（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 組織貢献・変革推進（8分）</h3>
            
            <div className="space-y-2">
              <Label>組織・チームへの具体的貢献</Label>
              <Textarea 
                placeholder="業務改善提案、効率化、新人教育、チーム運営など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>実施・推進している改善活動</Label>
              <Textarea 
                placeholder="プロジェクト名、目的、進捗、成果など具体的に"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>他部署・他職種との連携状況</Label>
              <Textarea 
                placeholder="連携内容、頻度、課題、改善提案など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織の課題と改善提案</Label>
              <Textarea 
                placeholder="業務プロセス、教育体制、システム、人員配置など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 5. 今後のアクションプラン（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. 今後のアクションプラン（5分）</h3>
            
            {/* 動機タイプに基づく推奨アクション（中堅看護師向け） */}
            {selectedMotivationType && (
              <Alert className="bg-purple-50 border-purple-200">
                <AlertDescription>
                  <strong>動機タイプに基づく中堅看護師向け推奨アクション：</strong>
                  <div className="mt-2">
                    {selectedMotivationType === 'growth' && 'リーダーシップ研修の受講、新規プロジェクトリーダーへの抜擢、専門資格取得支援'}
                    {selectedMotivationType === 'recognition' && '成果の組織内発表機会、表彰制度への推薦、後輩指導実績の評価'}
                    {selectedMotivationType === 'stability' && '段階的な権限委譲、安定したチーム体制での中核役割の明確化'}
                    {selectedMotivationType === 'teamwork' && 'チーム間の調整役委任、メンター制度での指導者役、組織横断プロジェクト参加'}
                    {selectedMotivationType === 'efficiency' && '業務改善プロジェクトのリーダー、効率化ツール導入の推進役'}
                    {selectedMotivationType === 'compensation' && '昇進機会の明確化、管理職候補としての育成計画、成果連動報酬の検討'}
                    {selectedMotivationType === 'creativity' && '独自の改善提案の実現支援、新しい看護手法の試行機会、裁量権の拡大'}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label>次回面談までの重点目標（2-3個）</Label>
              <Textarea 
                placeholder="リーダーシップ発揮、専門性向上、組織貢献など具体的に"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>必要なサポート・リソース</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-project" />
                  <Label htmlFor="support-project" className="ml-2">プロジェクト参加</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-authority" />
                  <Label htmlFor="support-authority" className="ml-2">権限委譲</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-mentor" />
                  <Label htmlFor="support-mentor" className="ml-2">メンター制度</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-career" />
                  <Label htmlFor="support-career" className="ml-2">キャリア相談</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-time" />
                  <Label htmlFor="support-time" className="ml-2">研修時間確保</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-budget" />
                  <Label htmlFor="support-budget" className="ml-2">研修費用支援</Label>
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
                <Input type="text" id="follow-up" placeholder="月次1on1、プロジェクト進捗確認など" />
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
                <Label>総合評価</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="eval-e" />
                    <Label htmlFor="eval-e" className="ml-1 text-sm">期待を大きく超える</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="eval-g" />
                    <Label htmlFor="eval-g" className="ml-1 text-sm">期待を超える</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="meets" id="eval-m" />
                    <Label htmlFor="eval-m" className="ml-1 text-sm">期待通り</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="below" id="eval-b" />
                    <Label htmlFor="eval-b" className="ml-1 text-sm">期待以下</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>ポテンシャル評価</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="potential-h" />
                    <Label htmlFor="potential-h" className="ml-1 text-sm">高（管理職候補）</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="specialist" id="potential-sp" />
                    <Label htmlFor="potential-sp" className="ml-1 text-sm">高（専門職候補）</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="potential-m" />
                    <Label htmlFor="potential-m" className="ml-1 text-sm">中（着実な成長）</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="needs-support" id="potential-ns" />
                    <Label htmlFor="potential-ns" className="ml-1 text-sm">要支援</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>離職リスク</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="risk-l" />
                    <Label htmlFor="risk-l" className="ml-1 text-sm">低</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="risk-m" />
                    <Label htmlFor="risk-m" className="ml-1 text-sm">中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="risk-h" />
                    <Label htmlFor="risk-h" className="ml-1 text-sm">高</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>推奨する育成方針</Label>
              <RadioGroup>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="management-track" id="develop-mt" />
                    <Label htmlFor="develop-mt" className="ml-2">管理職トラック</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="specialist-track" id="develop-st" />
                    <Label htmlFor="develop-st" className="ml-2">スペシャリストトラック</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="education-track" id="develop-et" />
                    <Label htmlFor="develop-et" className="ml-2">教育者トラック</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="general-track" id="develop-gt" />
                    <Label htmlFor="develop-gt" className="ml-2">ジェネラリストトラック</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            <Textarea 
              placeholder="総合所見、強み・改善点、動機タイプを考慮した具体的な育成計画、特記事項など詳細に記入"
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