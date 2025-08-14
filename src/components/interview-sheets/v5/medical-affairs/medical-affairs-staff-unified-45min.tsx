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

export default function MedicalAffairsStaffUnified45MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-2xl">医事課職員定期面談シート（45分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              45分の詳細面談です。医事課職員の包括的な評価と中長期的なキャリア開発計画の策定を目的とします。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. 業務遂行状況の詳細評価（15分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 業務遂行状況の詳細評価（15分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">医事業務の遂行能力評価</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5<br/>優秀</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4<br/>良好</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3<br/>普通</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2<br/>要改善</div>
                <div className="bg-red-100 px-2 py-1 rounded">1<br/>不十分</div>
              </div>
              
              {[
                "窓口業務・患者対応",
                "診療報酬請求業務（外来）",
                "診療報酬請求業務（入院）",
                "レセプト点検・査定対応",
                "返戻・再審査請求対応",
                "電子カルテ・医事システム操作",
                "保険制度・診療報酬制度理解",
                "院内他部署との連携",
                "正確性・ミス防止意識",
                "業務効率・生産性",
                "問題解決能力",
                "指導・教育能力（該当者のみ）"
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

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <Label className="text-base font-semibold">強み・得意分野</Label>
                <Textarea
                  placeholder="最も得意と感じる業務やスキル、他者から評価される点など"
                  className="mt-2"
                  rows={3}
                />
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <Label className="text-base font-semibold">改善が必要な分野</Label>
                <Textarea
                  placeholder="課題と感じる業務やスキル、今後伸ばしたい分野など"
                  className="mt-2"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* 2. 専門知識・資格・継続学習（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. 専門知識・資格・継続学習（10分）</h3>
            
            <div className="space-y-3">
              <div>
                <Label className="text-base font-semibold">保有資格・検定</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    "診療報酬請求事務能力認定試験",
                    "医療事務技能審査試験（メディカルクラーク）",
                    "医療事務管理士技能認定試験",
                    "医師事務作業補助技能認定試験",
                    "医療情報技師",
                    "個人情報保護士"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox id={`qualification-${index}`} />
                      <Label htmlFor={`qualification-${index}`} className="text-sm">{item}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold">最近の学習・研修参加状況</Label>
                <div className="space-y-2">
                  {[
                    "診療報酬改定に関する研修",
                    "電子カルテ・医事システム研修",
                    "接遇・患者対応研修",
                    "医療保険制度研修",
                    "個人情報保護・コンプライアンス研修",
                    "医療安全・感染対策研修",
                    "外部セミナー・勉強会"
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
              </div>
              
              <div>
                <Label htmlFor="learning-goals" className="text-sm font-medium">今後の学習目標・資格取得計画</Label>
                <Textarea
                  id="learning-goals"
                  placeholder="取得したい資格、学びたい分野、参加したい研修など"
                  className="mt-1"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* 3. 課題・困りごと・ストレス要因の詳細分析（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 課題・困りごと・ストレス要因の詳細分析（8分）</h3>
            
            <div className="space-y-3">
              <Label className="text-base font-semibold">現在の課題・ストレス要因（重要度を5段階で評価）</Label>
              <div className="space-y-2">
                {[
                  "業務量・時間圧迫",
                  "システム操作の困難",
                  "複雑な診療報酬制度への対応",
                  "患者対応での困りごと",
                  "同僚・上司との関係",
                  "責任・プレッシャー",
                  "スキル不足の不安",
                  "制度変更への対応",
                  "ミス・査定への不安",
                  "キャリアパスの不明確さ"
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <Label className="text-sm flex-1">{item}</Label>
                    <div className="flex items-center space-x-2">
                      <Label className="text-xs text-gray-500">重要度:</Label>
                      <RadioGroup className="flex space-x-2">
                        {[5, 4, 3, 2, 1].map((score) => (
                          <div key={score} className="flex items-center space-x-1">
                            <RadioGroupItem value={score.toString()} id={`stress-${index}-${score}`} />
                            <Label htmlFor={`stress-${index}-${score}`} className="text-xs">{score}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-3">
                <Label htmlFor="stress-details" className="text-sm font-medium">課題の詳細・改善案</Label>
                <Textarea
                  id="stress-details"
                  placeholder="具体的な課題の背景、原因、ご自身で考える改善案などをお聞かせください"
                  className="mt-1"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="support-needs" className="text-sm font-medium">必要なサポート・支援</Label>
                <Textarea
                  id="support-needs"
                  placeholder="上司や組織に求める支援、環境改善、制度活用など"
                  className="mt-1"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* 4. キャリア開発・目標設定・動機分析（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. キャリア開発・目標設定・動機分析（8分）</h3>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="short-term-goals" className="text-base font-semibold">短期目標（6ヶ月〜1年）</Label>
                  <Textarea
                    id="short-term-goals"
                    placeholder="来年度に向けた具体的な目標"
                    className="mt-2"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="long-term-goals" className="text-base font-semibold">中長期目標（2〜5年）</Label>
                  <Textarea
                    id="long-term-goals"
                    placeholder="将来的なキャリアビジョン"
                    className="mt-2"
                    rows={3}
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-base font-semibold">動機タイプ・やりがいの源泉</Label>
                <div className="space-y-2 mt-2">
                  <Label className="text-sm text-gray-600">どのような時に最もやりがいを感じますか？（複数選択可）</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "患者さんから感謝された時",
                      "新しいスキルを習得した時",
                      "チームで協力して成果を出した時",
                      "責任ある業務を任された時",
                      "業務効率を改善できた時",
                      "同僚に頼りにされた時",
                      "正確な業務処理ができた時",
                      "制度変更に対応できた時",
                      "後輩を指導・育成できた時",
                      "組織の改善に貢献できた時"
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
                <Label htmlFor="career-vision" className="text-sm font-medium">理想の医事職員像・キャリアパス</Label>
                <Textarea
                  id="career-vision"
                  placeholder="将来的にどのような医事職員になりたいか、目指すポジション、専門性など"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-base font-semibold">キャリア開発への関心</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    "管理職・リーダーポジション",
                    "専門性の深化・エキスパート",
                    "他部署との兼務・ジョブローテーション",
                    "教育・指導役割",
                    "システム・DX推進",
                    "外部研修・勉強会の企画"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox id={`career-${index}`} />
                      <Label htmlFor={`career-${index}`} className="text-sm">{item}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 5. 面談者総合所見・育成計画（4分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. 面談者総合所見・育成計画（4分）</h3>
            
            <div className="bg-yellow-50 p-4 rounded-lg space-y-3">
              <div>
                <Label htmlFor="comprehensive-assessment" className="text-base font-semibold">総合評価・成長状況</Label>
                <Textarea
                  id="comprehensive-assessment"
                  placeholder="対象者の成長状況、強み、課題の総合的な評価"
                  className="mt-2"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="development-plan" className="text-base font-semibold">今後の育成計画・支援方針</Label>
                <Textarea
                  id="development-plan"
                  placeholder="具体的な育成方法、研修計画、業務配分、支援内容など"
                  className="mt-2"
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="action-items" className="text-base font-semibold">次回までの具体的アクション項目</Label>
                <Textarea
                  id="action-items"
                  placeholder="期限付きの具体的な改善項目、取り組み内容"
                  className="mt-2"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-4 gap-4">
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
                  <RadioGroup className="flex space-x-2 mt-1">
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="low" id="urgency-low" />
                      <Label htmlFor="urgency-low" className="text-xs">低</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="medium" id="urgency-medium" />
                      <Label htmlFor="urgency-medium" className="text-xs">中</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="high" id="urgency-high" />
                      <Label htmlFor="urgency-high" className="text-xs">高</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="support-level" className="text-sm font-medium">支援必要度</Label>
                  <RadioGroup className="flex space-x-2 mt-1">
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="low" id="support-low" />
                      <Label htmlFor="support-low" className="text-xs">低</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="medium" id="support-medium" />
                      <Label htmlFor="support-medium" className="text-xs">中</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="high" id="support-high" />
                      <Label htmlFor="support-high" className="text-xs">高</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="potential" className="text-sm font-medium">成長ポテンシャル</Label>
                  <RadioGroup className="flex space-x-2 mt-1">
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="low" id="potential-low" />
                      <Label htmlFor="potential-low" className="text-xs">標準</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="medium" id="potential-medium" />
                      <Label htmlFor="potential-medium" className="text-xs">高</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="high" id="potential-high" />
                      <Label htmlFor="potential-high" className="text-xs">非常に高</Label>
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