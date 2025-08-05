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

export default function VeteranNurse45MinInterviewSheet() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-2xl">ベテラン看護師（11年目以上）定期面談シート（45分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年＿＿ヶ月　配属部署：＿＿＿＿＿＿</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              45分の詳細面談です。専門性発揮、知識継承、組織貢献を包括的に支援し、長期的なキャリアビジョンも確認してください。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. 専門性・エキスパート実践（12分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 専門性・エキスパート実践（12分）</h3>
            
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
                "品質改善推進"
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
              <Label>専門性を活かした具体的な成果・実績</Label>
              <Textarea 
                placeholder="患者ケアの向上、業務改善、研究活動、院外発表などの具体的成果"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織・チームへの具体的貢献</Label>
              <Textarea 
                placeholder="質改善、業務効率化、新人育成、研修企画、委員会活動などの実績と影響"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>イノベーション・変革推進の取り組み</Label>
              <Textarea 
                placeholder="新しい取り組みの企画・実施、業務プロセス改善、システム導入支援など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>院外での活動・貢献</Label>
              <Textarea 
                placeholder="学会活動、研究会参加、外部講師、地域活動、執筆活動など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 2. 共通評価項目（12分） - 全世代共通セクション */}
          <div className="space-y-4 bg-green-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 共通評価項目（12分）</h3>
            
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
              
              <RadioGroup>
                <div className="grid grid-cols-6 gap-2 items-center">
                  <span className="text-sm font-medium">現在のモチベーション</span>
                  <div className="flex justify-center">
                    <RadioGroupItem value="motive-5" id="motive-5" className="w-4 h-4" />
                  </div>
                  <div className="flex justify-center">
                    <RadioGroupItem value="motive-4" id="motive-4" className="w-4 h-4" />
                  </div>
                  <div className="flex justify-center">
                    <RadioGroupItem value="motive-3" id="motive-3" className="w-4 h-4" />
                  </div>
                  <div className="flex justify-center">
                    <RadioGroupItem value="motive-2" id="motive-2" className="w-4 h-4" />
                  </div>
                  <div className="flex justify-center">
                    <RadioGroupItem value="motive-1" id="motive-1" className="w-4 h-4" />
                  </div>
                </div>
              </RadioGroup>
              
              {[
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

            {/* 健康・ストレス状況 */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">健康・ストレス状況</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ストレス度（0-100）</Label>
                  <Input type="number" min="0" max="100" placeholder="50" />
                </div>
                <div>
                  <Label>健康状態</Label>
                  <RadioGroup className="flex space-x-2">
                    <div className="flex items-center">
                      <RadioGroupItem value="good" id="health-g" />
                      <Label htmlFor="health-g" className="ml-1">良好</Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="normal" id="health-n" />
                      <Label htmlFor="health-n" className="ml-1">普通</Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="poor" id="health-p" />
                      <Label htmlFor="health-p" className="ml-1">不調</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <div>
                <Label>主なストレス要因（複数選択可）</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center">
                    <Checkbox id="stress-workload" />
                    <Label htmlFor="stress-workload" className="ml-2">業務負荷</Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="stress-relations" />
                    <Label htmlFor="stress-relations" className="ml-2">人間関係</Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="stress-overtime" />
                    <Label htmlFor="stress-overtime" className="ml-2">残業時間</Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="stress-balance" />
                    <Label htmlFor="stress-balance" className="ml-2">家庭との両立</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* エンゲージメント */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">エンゲージメント</Label>
              <RadioGroup className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">この職場を友人に勧めたいか（0-10）</span>
                  <div className="flex space-x-2">
                    {[0,1,2,3,4,5,6,7,8,9,10].map((num) => (
                      <div key={num} className="flex flex-col items-center">
                        <RadioGroupItem value={`nps-${num}`} id={`nps-${num}`} />
                        <Label htmlFor={`nps-${num}`} className="text-xs mt-1">{num}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </RadioGroup>
              
              <RadioGroup>
                <div className="grid grid-cols-6 gap-2 items-center">
                  <span className="text-sm font-medium">1年後の継続意向</span>
                  <div className="flex justify-center">
                    <RadioGroupItem value="continue-5" id="continue-5" className="w-4 h-4" />
                  </div>
                  <div className="flex justify-center">
                    <RadioGroupItem value="continue-4" id="continue-4" className="w-4 h-4" />
                  </div>
                  <div className="flex justify-center">
                    <RadioGroupItem value="continue-3" id="continue-3" className="w-4 h-4" />
                  </div>
                  <div className="flex justify-center">
                    <RadioGroupItem value="continue-2" id="continue-2" className="w-4 h-4" />
                  </div>
                  <div className="flex justify-center">
                    <RadioGroupItem value="continue-1" id="continue-1" className="w-4 h-4" />
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 3. 知識継承・後進育成の詳細（8分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. 知識継承・後進育成の詳細（8分）</h3>
            
            <div className="space-y-2">
              <Label>現在の指導・メンタリング役割の詳細</Label>
              <Textarea 
                placeholder="プリセプター、教育担当、研修講師、委員会活動など具体的な役割と対象者"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>知識・技術継承の具体的取り組み</Label>
              <Textarea 
                placeholder="マニュアル作成、勉強会開催、OJT、ノウハウの文書化、標準化推進など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>後進育成での成果・実績</Label>
              <Textarea 
                placeholder="育成した人材の成長、資格取得支援実績、チーム全体のスキル向上など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>世代間ギャップ・指導上の課題</Label>
              <Textarea 
                placeholder="若い世代との価値観の違い、指導方法の工夫、モチベーション向上の難しさなど"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>効果的な指導・メンタリングの工夫</Label>
              <Textarea 
                placeholder="個別対応、コミュニケーション方法、フィードバック技法、動機づけの工夫など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織全体の人材育成への貢献</Label>
              <Textarea 
                placeholder="研修プログラム開発、評価基準作成、新人研修体系への関与など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. キャリア・ライフステージ（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. キャリア・ライフステージ（5分）</h3>
            
            <div className="space-y-2">
              <Label>現在のライフステージ・生活状況</Label>
              <Textarea 
                placeholder="家庭状況、育児・介護、健康状態、プライベートの充実度など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>今後のキャリア・働き方の希望</Label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="flex items-center">
                  <RadioGroupItem value="continue" id="future-c" />
                  <Label htmlFor="future-c" className="ml-1">現状継続</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="expand" id="future-e" />
                  <Label htmlFor="future-e" className="ml-1">役割拡大</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="balance" id="future-b" />
                  <Label htmlFor="future-b" className="ml-1">バランス重視</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="reduce" id="future-r" />
                  <Label htmlFor="future-r" className="ml-1">負担軽減</Label>
                </div>
              </div>
              <Textarea 
                placeholder="選択した働き方の理由、具体的な希望など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>今後チャレンジしたいこと・関心分野</Label>
              <Textarea 
                placeholder="新しい専門分野、管理職、教育・研究、院外活動、ボランティアなど"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>長期的なキャリアビジョン・人生設計</Label>
              <Textarea 
                placeholder="定年までの目標、定年後の計画、セカンドキャリア、生涯学習など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>組織に対する要望・提案</Label>
              <Textarea 
                placeholder="ベテラン職員の活用方法、研修制度、評価制度、職場環境などへの提案"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 5. 組織への継続的貢献（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. 組織への継続的貢献（5分）</h3>
            
            <div className="space-y-2">
              <Label>現在の組織・社会への貢献実績</Label>
              <Textarea 
                placeholder="品質改善、安全管理、教育システム構築、地域連携、社会活動など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>今後の組織貢献への意欲・計画</Label>
              <Textarea 
                placeholder="新しい取り組み、知識の体系化、次世代リーダー育成、組織文化の継承など"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>看護の未来・後輩へのメッセージ</Label>
              <Textarea 
                placeholder="看護の価値、専門職としての誇り、後輩への期待・アドバイスなど"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 6. 今後の目標·アクションプラン（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">6. 今後の目標・アクションプラン（3分）</h3>
            
            <div className="space-y-2">
              <Label>次回面談までの目標（1ヶ月）</Label>
              <Textarea 
                placeholder="専門性発揮、知識継承、組織貢献など具体的目標"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>今年度内の目標</Label>
              <Textarea 
                placeholder="後進育成、専門性向上、新しい取り組み、研究活動など"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label>中長期目標・ビジョン（3-5年）</Label>
              <Textarea 
                placeholder="組織での役割、専門分野での地位、退職に向けた準備、継承したいレガシーなど"
                className="min-h-[60px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="next-interview">次回面談予定</Label>
                <Input type="date" id="next-interview" />
              </div>
              <div>
                <Label htmlFor="follow-up">フォローアップ方法</Label>
                <Input type="text" id="follow-up" placeholder="定期確認など" />
              </div>
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label>専門性評価</Label>
                <RadioGroup className="flex space-x-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="expert" id="expert-e" />
                    <Label htmlFor="expert-e" className="ml-1">エキスパート</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="advanced" id="expert-a" />
                    <Label htmlFor="expert-a" className="ml-1">上級</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="standard" id="expert-s" />
                    <Label htmlFor="expert-s" className="ml-1">標準</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>継承・育成能力</Label>
                <RadioGroup className="flex space-x-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="excellent" id="teaching-e" />
                    <Label htmlFor="teaching-e" className="ml-1">優秀</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="good" id="teaching-g" />
                    <Label htmlFor="teaching-g" className="ml-1">良好</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="developing" id="teaching-d" />
                    <Label htmlFor="teaching-d" className="ml-1">開発中</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>組織貢献度</Label>
                <RadioGroup className="flex space-x-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="contrib-h" />
                    <Label htmlFor="contrib-h" className="ml-1">高</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="contrib-m" />
                    <Label htmlFor="contrib-m" className="ml-1">中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="contrib-l" />
                    <Label htmlFor="contrib-l" className="ml-1">低</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>継続勤務意欲</Label>
                <RadioGroup className="flex space-x-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="high" id="retention-h" />
                    <Label htmlFor="retention-h" className="ml-1">高</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="medium" id="retention-m" />
                    <Label htmlFor="retention-m" className="ml-1">中</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="low" id="retention-l" />
                    <Label htmlFor="retention-l" className="ml-1">低</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <Textarea 
              placeholder="特記事項、活用方針、今後の期待役割、支援方針、組織としての位置づけなど詳細に記入"
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