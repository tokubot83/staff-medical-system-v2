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
import { MotivationTypeSection, getMotivationTypeQuestions } from '@/docs/v5_interview/components/MotivationType';

export default function GeneralPTUnified45MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-emerald-50">
          <CardTitle className="text-2xl">一般理学療法士（2-3年目）定期面談シート V5（45分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：リハビリテーション科</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              45分の詳細面談です。<strong>動機タイプ判定</strong>を活用し、個別最適化された評価とキャリア開発・成長支援の計画立案を行います。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. 理学療法実践能力の詳細評価（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 理学療法実践能力の詳細評価（10分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">PT技術・専門能力の詳細評価</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "評価技術（ROM・MMT・各種検査）",
                "治療手技（運動療法・物理療法）",
                "ADL指導・生活指導",
                "患者・家族対応・コミュニケーション",
                "多職種連携・チーム医療",
                "記録・報告書作成",
                "症例検討・臨床推論",
                "安全管理・リスク管理"
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
            </div>

            <div className="space-y-2">
              <Label>現在の主要担当業務と達成状況</Label>
              <Textarea 
                placeholder="担当患者数、疾患領域、症例の複雑度、自立度、達成度、チームでの役割、貢献内容などを詳しく記入"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>この1年間での技術・知識の成長</Label>
              <Textarea 
                placeholder="新しく習得した技術、深まった知識、向上した患者対応力、症例理解の進歩など具体的に記入"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>現在の強み・得意分野</Label>
              <Textarea 
                placeholder="得意な疾患・治療法、評価・アプローチ、患者対応で優れている点など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. 動機タイプ別詳細確認・モチベーション分析（10分） */}
          <div className="space-y-4 bg-emerald-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 動機タイプ別詳細確認・モチベーション分析（10分）</h3>
            
            {selectedMotivationType && typeSpecificQuestions.length > 0 && (
              <div className="bg-purple-50 p-3 rounded-lg space-y-2 mb-4">
                <Label className="text-base font-semibold text-purple-700">
                  動機タイプに基づく詳細質問（一般PT向け）
                </Label>
                <div className="space-y-3">
                  {typeSpecificQuestions.slice(0, 3).map((question, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-sm font-medium">{`質問${index + 1}：${question}`}</Label>
                      <Textarea 
                        placeholder="一般理学療法士としての視点で詳しくお答えください"
                        className="min-h-[70px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">詳細モチベーション・満足度分析</Label>
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
                "職場満足度",
                "仕事のやりがい",
                "成長実感",
                "チームワーク満足度",
                "学習・研修機会の充実度"
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
            </div>

            <div className="space-y-2">
              <Label>理学療法士としてのやりがい・魅力</Label>
              <Textarea 
                placeholder="この仕事の魅力、やりがいを感じる瞬間、理学療法士としての誇りなど詳しく記入"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 3. 課題分析・必要なサポートの特定（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 課題分析・必要なサポートの特定（10分）</h3>
            
            <div className="space-y-2">
              <Label>現在困っていること・不安なこと（詳細）</Label>
              <Textarea 
                placeholder="技術面、知識面、患者対応、記録、チーム連携、時間管理、症例理解などの具体的な課題と困り方"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>今後習得・向上させたい技術・知識</Label>
              <Textarea 
                placeholder="特定の疾患への対応、新しい治療技術、評価方法、専門知識など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">必要なサポート・支援（詳細・複数選択可）</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "技術研修・実技指導",
                  "症例検討会・カンファレンス参加",
                  "先輩PTからの個別指導・メンタリング",
                  "専門資格取得支援・情報提供",
                  "学会・研修会参加支援",
                  "文献検索・EBM指導",
                  "記録・報告書作成指導",
                  "患者・家族対応スキル向上",
                  "時間管理・業務効率化指導",
                  "ストレス・メンタルヘルスケア",
                  "キャリア相談・カウンセリング",
                  "業務量調整・負荷軽減"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox id={`support-${item}`} />
                    <Label htmlFor={`support-${item}`} className="text-sm">{item}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>最優先で必要なサポート（詳細）</Label>
              <Textarea 
                placeholder="上記で選択した中で最も重要なもの、具体的な支援方法、頻度、期間など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 4. キャリア開発・目標設定（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. キャリア開発・目標設定（8分）</h3>
            
            {selectedMotivationType && (
              <Alert className="bg-purple-50 border-purple-200">
                <AlertDescription>
                  <strong>動機タイプに基づく推奨キャリア支援：</strong>
                  <div className="mt-1 text-sm">
                    {selectedMotivationType === 'growth' && '新技術研修・認定資格取得・症例発表・研究参加・専門分野開拓'}
                    {selectedMotivationType === 'recognition' && '技術向上成果の評価・表彰制度・院内外発表機会・指導実績の認定'}
                    {selectedMotivationType === 'stability' && '基本技術の確実習得・段階的成長・安定した指導体制・継続支援'}
                    {selectedMotivationType === 'teamwork' && 'チーム医療推進・多職種連携強化・後輩サポート・協調性評価'}
                    {selectedMotivationType === 'efficiency' && '効率的治療法習得・時間管理・業務改善参加・システム活用'}
                    {selectedMotivationType === 'compensation' && '昇進要件明示・資格取得支援・専門手当・評価制度説明'}
                    {selectedMotivationType === 'creativity' && '独自アプローチ支援・研究活動・新治療法開発・創意工夫奨励'}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label>理学療法士としての将来ビジョン・キャリア目標</Label>
              <Textarea 
                placeholder="5年後、10年後の理学療法士としての姿、専門分野、役割、資格取得目標など詳しく記入"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>短期目標（1-3ヶ月）</Label>
              <Textarea 
                placeholder="具体的で測定可能な目標（特定技術習得、症例経験、研修参加など）"
                className="min-h-[70px]"
              />
            </div>

            <div className="space-y-2">
              <Label>中期目標（3-12ヶ月）</Label>
              <Textarea 
                placeholder="専門性向上、業務範囲拡大、資格取得準備、研修・学会参加などの目標"
                className="min-h-[70px]"
              />
            </div>

            <div className="space-y-2">
              <Label>長期目標（1-3年）</Label>
              <Textarea 
                placeholder="専門認定資格取得、専門分野確立、指導力向上、キャリア発展の目標"
                className="min-h-[70px]"
              />
            </div>
          </div>

          {/* 5. 総合アクションプラン・フォローアップ計画（7分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. 総合アクションプラン・フォローアップ計画（7分）</h3>
            
            <div className="space-y-2">
              <Label>総合的な成長支援プラン</Label>
              <Textarea 
                placeholder="技術指導、研修計画、メンタリング、資格取得支援など包括的な支援計画"
                className="min-h-[80px]"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">具体的アクション項目</Label>
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="action1" className="text-sm font-medium">アクション1（最優先）</Label>
                  <Input id="action1" placeholder="具体的な行動・取り組み" />
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="開始日" type="date" />
                    <Input placeholder="完了予定日" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="action2" className="text-sm font-medium">アクション2</Label>
                  <Input id="action2" placeholder="具体的な行動・取り組み" />
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="開始日" type="date" />
                    <Input placeholder="完了予定日" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="action3" className="text-sm font-medium">アクション3</Label>
                  <Input id="action3" placeholder="具体的な行動・取り組み" />
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="開始日" type="date" />
                    <Input placeholder="完了予定日" type="date" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="next-interview">次回面談予定</Label>
                <Input type="date" id="next-interview" />
              </div>
              <div>
                <Label htmlFor="follow-method">フォロー方法</Label>
                <select className="w-full p-2 border rounded">
                  <option value="weekly">週次1on1</option>
                  <option value="biweekly">隔週面談</option>
                  <option value="monthly">月次面談</option>
                  <option value="quarterly">四半期面談</option>
                </select>
              </div>
              <div>
                <Label htmlFor="progress-check">進捗確認方法</Label>
                <select className="w-full p-2 border rounded">
                  <option value="report">進捗レポート</option>
                  <option value="observation">業務観察</option>
                  <option value="self-eval">自己評価</option>
                  <option value="peer-feedback">同僚フィードバック</option>
                </select>
              </div>
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            
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
            
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label>総合成長度</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="growth-excellent" />
                    <Label htmlFor="growth-excellent" className="ml-1 text-sm">優秀</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="growth-good" />
                    <Label htmlFor="growth-good" className="ml-1 text-sm">良好</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="needs-support" id="growth-support" />
                    <Label htmlFor="growth-support" className="ml-1 text-sm">要支援</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>ポテンシャル</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="potential-high" />
                    <Label htmlFor="potential-high" className="ml-1 text-sm">高</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="potential-medium" />
                    <Label htmlFor="potential-medium" className="ml-1 text-sm">中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="potential-low" />
                    <Label htmlFor="potential-low" className="ml-1 text-sm">低</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>学習意欲</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="learning-high" />
                    <Label htmlFor="learning-high" className="ml-1 text-sm">高</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="learning-medium" />
                    <Label htmlFor="learning-medium" className="ml-1 text-sm">中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="learning-low" />
                    <Label htmlFor="learning-low" className="ml-1 text-sm">低</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>離職リスク</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="risk-low" />
                    <Label htmlFor="risk-low" className="ml-1 text-sm">低</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="risk-medium" />
                    <Label htmlFor="risk-medium" className="ml-1 text-sm">中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="risk-high" />
                    <Label htmlFor="risk-high" className="ml-1 text-sm">高</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <Textarea 
              placeholder="総合評価、特記事項、動機タイプを考慮した個別支援方針、長期育成計画、緊急対応事項など詳細に記入"
              className="min-h-[100px]"
            />
          </div>

          {/* 保存ボタン */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button variant="outline">一時保存</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">面談記録を保存</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}