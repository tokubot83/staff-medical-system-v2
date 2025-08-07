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

export default function VeteranNurseUnified45MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-amber-50">
          <CardTitle className="text-2xl">ベテラン看護師（11年目以上）定期面談シート（45分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              45分の詳細面談です。ベテラン看護師の専門性発揮、知識継承、組織貢献を包括的に支援し、長期的なキャリアビジョンも確認してください。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. 専門性・エキスパート実践の詳細評価（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 専門性・エキスパート実践の詳細評価（10分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">現在の専門性・影響力</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "専門知識活用",
                "臨床判断力",
                "問題解決力",
                "組織への影響力",
                "イノベーション創出",
                "品質改善推進",
                "知識継承・教育",
                "院内外での活動"
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
                <p><span className="text-green-600 font-medium">5：</span>卓越　<span className="text-blue-600 font-medium">4：</span>優秀　<span className="text-yellow-600 font-medium">3：</span>良好　<span className="text-orange-600 font-medium">2：</span>標準　<span className="text-red-600 font-medium">1：</span>要向上</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>現在の専門領域・エキスパート分野の詳細</Label>
              <Textarea 
                placeholder="認定・専門看護師分野、得意領域、院内外での専門的活動、学会活動などを詳しく"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>この半年間の主要な成果・実績</Label>
              <Textarea 
                placeholder="患者ケアの向上、業務改善、研究活動、院外発表、表彰などの具体的成果"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>知識・技術の継承活動</Label>
              <Textarea 
                placeholder="院内研修講師、マニュアル作成、技術指導、ノウハウの文書化など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. 職員の現状確認（モチベーション・健康・エンゲージメント）（12分） - 全世代共通セクション */}
          <div className="space-y-4 bg-green-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 職員の現状確認（モチベーション・健康・エンゲージメント）（12分）</h3>
            
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
                  <Checkbox className="border-2 border-gray-400" id="stress-physical" />
                  <Label htmlFor="stress-physical" className="ml-2">体力的な負担</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="stress-career" />
                  <Label htmlFor="stress-career" className="ml-2">キャリアの停滞</Label>
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

          {/* 3. 長期キャリアビジョン・役割転換（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 長期キャリアビジョン・役割転換（10分）</h3>
            
            <div className="space-y-2">
              <Label>今後のキャリアビジョン（定年まで/定年後）</Label>
              <Textarea 
                placeholder="現役での活躍分野、役割転換、後進育成、定年後の計画など"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>現在の役割の見直し・調整希望</Label>
              <Textarea 
                placeholder="業務量、夜勤頻度、責任の範囲、新しい挑戦など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>体力・健康面での配慮事項</Label>
              <Textarea 
                placeholder="体力的な負担、健康上の懸念、必要な配慮など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>経験を活かしたい新しい分野</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="area-education" />
                  <Label htmlFor="area-education" className="ml-2">教育・研修</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="area-consulting" />
                  <Label htmlFor="area-consulting" className="ml-2">コンサルティング</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="area-quality" />
                  <Label htmlFor="area-quality" className="ml-2">品質管理</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="area-research" />
                  <Label htmlFor="area-research" className="ml-2">研究活動</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="area-community" />
                  <Label htmlFor="area-community" className="ml-2">地域連携</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="area-mentor" />
                  <Label htmlFor="area-mentor" className="ml-2">メンタリング</Label>
                </div>
              </div>
            </div>
          </div>

          {/* 4. 組織への貢献・知識継承（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 組織への貢献・知識継承（8分）</h3>
            
            <div className="space-y-2">
              <Label>組織文化・伝統の継承活動</Label>
              <Textarea 
                placeholder="組織の歴史、価値観、ノウハウの伝承など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>若手・中堅への知識・技術伝承</Label>
              <Textarea 
                placeholder="具体的な指導内容、方法、成果など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織改善への提言・アドバイス</Label>
              <Textarea 
                placeholder="長年の経験から見た改善点、アイデアなど"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>後継者育成への関与</Label>
              <Textarea 
                placeholder="次世代リーダーの育成、メンタリング活動など"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 5. 今後のアクションプラン（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. 今後のアクションプラン（5分）</h3>
            
            <div className="space-y-2">
              <Label>次回面談までの重点活動（2-3個）</Label>
              <Textarea 
                placeholder="知識継承、新しい役割への挑戦、健康管理など具体的に"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>必要なサポート・環境整備</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-workload" />
                  <Label htmlFor="support-workload" className="ml-2">業務量調整</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-shift" />
                  <Label htmlFor="support-shift" className="ml-2">勤務形態見直し</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-health" />
                  <Label htmlFor="support-health" className="ml-2">健康管理支援</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-role" />
                  <Label htmlFor="support-role" className="ml-2">役割転換支援</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-succession" />
                  <Label htmlFor="support-succession" className="ml-2">後継者育成環境</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="border-2 border-gray-400" id="support-recognition" />
                  <Label htmlFor="support-recognition" className="ml-2">貢献の見える化</Label>
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
                <Input type="text" id="follow-up" placeholder="定期面談、健康相談など" />
              </div>
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>総合評価</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="eval-e" />
                    <Label htmlFor="eval-e" className="ml-1 text-sm">組織の宝</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="eval-g" />
                    <Label htmlFor="eval-g" className="ml-1 text-sm">重要な戦力</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="meets" id="eval-m" />
                    <Label htmlFor="eval-m" className="ml-1 text-sm">安定的貢献</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="needs-support" id="eval-ns" />
                    <Label htmlFor="eval-ns" className="ml-1 text-sm">要支援</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>今後の活躍領域</Label>
                <RadioGroup className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <RadioGroupItem value="expert" id="role-ex" />
                    <Label htmlFor="role-ex" className="ml-1 text-sm">専門性発揮</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="mentor" id="role-me" />
                    <Label htmlFor="role-me" className="ml-1 text-sm">育成・指導</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="advisor" id="role-ad" />
                    <Label htmlFor="role-ad" className="ml-1 text-sm">相談・助言</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="flexible" id="role-fl" />
                    <Label htmlFor="role-fl" className="ml-1 text-sm">柔軟な役割</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>健康・継続リスク</Label>
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
              <Label>推奨する活用方針</Label>
              <RadioGroup>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="maximize" id="policy-mx" />
                    <Label htmlFor="policy-mx" className="ml-2">専門性最大活用</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="succession" id="policy-sc" />
                    <Label htmlFor="policy-sc" className="ml-2">知識継承重視</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="balance" id="policy-bl" />
                    <Label htmlFor="policy-bl" className="ml-2">バランス型活用</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="transition" id="policy-tr" />
                    <Label htmlFor="policy-tr" className="ml-2">段階的役割移行</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            <Textarea 
              placeholder="総合所見、強み・貢献価値、健康面の配慮、今後の活用方針、特記事項など詳細に記入"
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