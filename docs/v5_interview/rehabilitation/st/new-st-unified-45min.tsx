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
import { MotivationTypeSection, getMotivationTypeQuestions } from '../../components/MotivationType';

export default function NewSTUnified45MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-indigo-50">
          <CardTitle className="text-2xl">新人言語聴覚士（1年目）定期面談シート V5（45分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>入職月数：＿＿ヶ月　配属部署：リハビリテーション科</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              45分の詳細面談です。<strong>動機タイプ判定</strong>を活用し、新人言語聴覚士の包括的な技術評価と個別最適化された育成計画を策定します。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. 言語聴覚療法専門技術の詳細評価（12分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 言語聴覚療法専門技術の詳細評価（12分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">ST専門技術・能力の詳細評価</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "失語症評価・訓練（SLTA・WAB等）",
                "構音障害評価・訓練（構音検査・訓練法）",
                "嚥下機能評価（VF・VE・水飲みテスト等）",
                "嚥下訓練・摂食機能療法",
                "音声・発声障害評価・訓練",
                "言語発達障害評価・訓練（小児）",
                "高次脳機能評価・訓練（失認・失行等）",
                "コミュニケーション支援・AAC",
                "聴覚検査・補聴器適合・指導",
                "認知症のコミュニケーション支援",
                "患者・家族指導・教育・相談",
                "多職種連携・情報共有・カンファレンス",
                "記録・評価書・報告書作成",
                "安全管理・リスク管理・感染対策"
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
              <Label>現在の担当患者・症例の詳細</Label>
              <Textarea 
                placeholder="担当患者数、主要疾患（脳血管疾患・神経疾患・頭頸部腫瘍・発達障害等）、重症度、言語機能状況、嚥下機能状況、訓練内容、成果等詳細に記入"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>技術的成長・習得状況の詳細分析</Label>
              <Textarea 
                placeholder="検査・評価技術の向上、訓練プログラム立案能力、患者対応力、記録能力、チーム連携能力等の成長度と今後の課題"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>専門性への関心・志向</Label>
              <Textarea 
                placeholder="どの分野（失語症・構音障害・嚥下障害・小児言語発達・聴覚障害等）に興味があるか、将来の専門性の方向性、学習意欲"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. 動機タイプ別詳細確認・キャリア志向分析（10分） */}
          <div className="space-y-4 bg-indigo-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 動機タイプ別詳細確認・キャリア志向分析（10分）</h3>
            
            {selectedMotivationType && typeSpecificQuestions.length > 0 && (
              <div className="bg-purple-50 p-3 rounded-lg space-y-2 mb-4">
                <Label className="text-base font-semibold text-purple-700">
                  動機タイプに基づく詳細質問（新人ST詳細版）
                </Label>
                <div className="space-y-3">
                  {typeSpecificQuestions.slice(0, 3).map((question, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-sm font-medium">{`質問${index + 1}：${question}`}</Label>
                      <Textarea 
                        placeholder="言語聴覚士としての専門的視点で詳しくお答えください"
                        className="min-h-[70px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* モチベーション・満足度・エンゲージメント詳細分析 */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">モチベーション・満足度・エンゲージメント詳細分析</Label>
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
                "仕事のやりがい・達成感",
                "同僚・先輩との関係",
                "上司からのサポート・指導",
                "患者・家族との関係性",
                "自己成長実感",
                "将来への期待・不安",
                "ワークライフバランス",
                "職場環境への満足度"
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

            <div className="space-y-3">
              <Label className="text-base font-semibold">現在の課題・困っていること（詳細確認）</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "失語症の症状理解・判定",
                  "構音障害の評価・訓練方法",
                  "嚥下機能の評価・判断",
                  "VF・VE画像の読影",
                  "小児言語発達の評価",
                  "高次脳機能障害の理解",
                  "コミュニケーション手段の選択",
                  "患者・家族への説明技術",
                  "記録・報告書の書き方",
                  "多職種連携・情報共有",
                  "時間管理・効率化",
                  "検査機器の操作・管理",
                  "感染対策・リスク管理",
                  "学習方法・知識整理",
                  "ストレス・疲労管理",
                  "その他"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox id={item} />
                    <Label htmlFor={item} className="text-sm">{item}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>キャリア志向・将来ビジョン</Label>
              <Textarea 
                placeholder="3年後・5年後のキャリア目標、専門資格取得希望、学会発表・研究興味、転職・昇進希望等"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 3. 成長目標設定とサポートプラン（12分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 成長目標設定とサポートプラン（12分）</h3>
            
            <div className="space-y-2">
              <Label>短期目標（1ヶ月以内）</Label>
              <Input 
                placeholder="例：構音検査の習得、失語症スクリーニング検査の精度向上"
              />
            </div>

            <div className="space-y-2">
              <Label>中期目標（3ヶ月以内）</Label>
              <Input 
                placeholder="例：VE検査の独立実施、小児言語発達評価の基本習得"
              />
            </div>

            <div className="space-y-2">
              <Label>長期目標（6ヶ月以内）</Label>
              <Input 
                placeholder="例：摂食嚥下リハビリテーション計画立案、失語症訓練プログラム作成"
              />
            </div>

            <div className="space-y-2">
              <Label>年間目標</Label>
              <Input 
                placeholder="例：ST専門領域の1つで独立した評価・訓練実施、症例発表準備"
              />
            </div>

            <div className="space-y-2">
              <Label>必要なサポート・研修・学習内容（詳細）</Label>
              <Textarea 
                placeholder="先輩からの指導内容、院内外研修希望、参加したい学会・セミナー、習得したい検査・訓練技術、症例検討の希望等"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>上司・先輩への要望・フィードバック希望</Label>
              <Textarea 
                placeholder="指導方法、頻度、フィードバック内容、サポート体制、相談方法等に関する要望"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">希望する学習・研修機会</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "院内勉強会・症例検討会",
                  "外部研修・セミナー参加",
                  "学会参加・発表準備",
                  "他施設見学・実習",
                  "書籍・論文学習会",
                  "ST専門資格取得支援",
                  "嚥下内視鏡研修",
                  "小児ST研修",
                  "聴覚検査技術研修",
                  "摂食嚥下認定士研修",
                  "失語症訓練技術研修",
                  "その他専門研修"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox id={item} />
                    <Label htmlFor={item} className="text-sm">{item}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. 職場環境・制度改善要望（6分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 職場環境・制度改善要望（6分）</h3>
            
            <div className="space-y-2">
              <Label>勤務体制・働き方に関する要望</Label>
              <Textarea 
                placeholder="勤務時間、休憩時間、当直・残業、有給取得、在宅勤務等"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>設備・機器に関する要望</Label>
              <Textarea 
                placeholder="検査機器、訓練用具、評価用紙、書籍・資料、ITツール等"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>研修制度・キャリア支援に関する要望</Label>
              <Textarea 
                placeholder="新人研修内容、継続教育、資格取得支援、昇進制度、評価制度等"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 5. その他・自由記述（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. その他・自由記述（5分）</h3>
            
            <div className="space-y-2">
              <Label>プライベート・健康状況</Label>
              <Textarea 
                placeholder="体調管理、ストレス状況、趣味・息抜き方法、家族状況等（話したい範囲で）"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>その他（自由記述）</Label>
              <Textarea 
                placeholder="上記以外で相談したいこと、伝えたいこと、提案等があれば自由にお書きください"
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <Textarea 
              placeholder="本人の成長度、適応状況、技術習得度、課題、今後の指導方針、フォロー計画、特記事項など詳細に記入"
              className="min-h-[120px]"
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">次回面談予定日</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">緊急度</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="urgent-low" />
                      <Label htmlFor="urgent-low" className="text-sm">低</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="urgent-medium" />
                      <Label htmlFor="urgent-medium" className="text-sm">中</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="urgent-high" />
                      <Label htmlFor="urgent-high" className="text-sm">高</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* 提出ボタン */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline">
              一時保存
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              提出
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}