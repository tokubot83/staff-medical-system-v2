'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';

export default function JuniorNurseEvaluation() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            一般看護師（2-3年目） 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            基礎技術の定着と自立を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              2-3年目は基礎技術の確実な定着と、チームメンバーとしての自立を重点的に評価します
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="facility">施設内評価</TabsTrigger>
              <TabsTrigger value="corporate">法人内評価</TabsTrigger>
              <TabsTrigger value="matrix">総合判定</TabsTrigger>
              <TabsTrigger value="development">育成計画</TabsTrigger>
            </TabsList>

            {/* 基本情報タブ */}
            <TabsContent value="basic" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eval-date">評価日</Label>
                  <Input type="date" id="eval-date" />
                </div>
                <div>
                  <Label htmlFor="eval-period">評価期間</Label>
                  <Input type="text" id="eval-period" placeholder="2025年度上期" />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">職員情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">氏名</Label>
                    <Input type="text" id="name" />
                  </div>
                  <div>
                    <Label htmlFor="employee-id">職員番号</Label>
                    <Input type="text" id="employee-id" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="department">所属施設・部署</Label>
                    <Input type="text" id="department" />
                  </div>
                  <div>
                    <Label htmlFor="position">職位</Label>
                    <Input type="text" id="position" placeholder="一般看護師" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="experience">経験年数</Label>
                    <Input type="text" id="experience" placeholder="5年3ヶ月" />
                  </div>
                  <div>
                    <Label htmlFor="specialty">専門分野</Label>
                    <Input type="text" id="specialty" placeholder="病棟看護" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（直属上司）</Label>
                    <Input type="text" id="evaluator1" />
                  </div>
                  <div>
                    <Label htmlFor="evaluator2">2次評価者（部門長）</Label>
                    <Input type="text" id="evaluator2" />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 施設内評価タブ */}
            <TabsContent value="facility" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設内評価（相対評価）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  所属施設内での相対的な位置づけを評価（リーダーシップ・貢献度を重視）
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. チーム貢献度</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="team-s" />
                        <Label htmlFor="team-s" className="font-normal">
                          <span className="font-semibold">S：</span> チームの中核として卓越したリーダーシップを発揮
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="team-a" />
                        <Label htmlFor="team-a" className="font-normal">
                          <span className="font-semibold">A：</span> チーム運営に積極的に貢献し、良い影響を与えている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="team-b" />
                        <Label htmlFor="team-b" className="font-normal">
                          <span className="font-semibold">B：</span> 期待される役割を適切に果たしている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="team-c" />
                        <Label htmlFor="team-c" className="font-normal">
                          <span className="font-semibold">C：</span> 基本的な役割は果たすが、積極性に欠ける
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="team-d" />
                        <Label htmlFor="team-d" className="font-normal">
                          <span className="font-semibold">D：</span> チーム貢献が不十分で改善が必要
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 業務遂行能力</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="work-s" />
                        <Label htmlFor="work-s" className="font-normal">
                          <span className="font-semibold">S：</span> 施設内でトップクラスの業務遂行能力
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="work-a" />
                        <Label htmlFor="work-a" className="font-normal">
                          <span className="font-semibold">A：</span> 優秀な業務遂行能力を持ち、模範となっている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="work-b" />
                        <Label htmlFor="work-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的な業務遂行能力を持つ
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="work-c" />
                        <Label htmlFor="work-c" className="font-normal">
                          <span className="font-semibold">C：</span> 業務遂行に課題があり、サポートが必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="work-d" />
                        <Label htmlFor="work-d" className="font-normal">
                          <span className="font-semibold">D：</span> 業務遂行能力に重大な問題がある
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 施設への貢献</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="contrib-s" />
                        <Label htmlFor="contrib-s" className="font-normal">
                          <span className="font-semibold">S：</span> 施設の発展に極めて重要な貢献をしている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="contrib-a" />
                        <Label htmlFor="contrib-a" className="font-normal">
                          <span className="font-semibold">A：</span> 委員会活動等で積極的に施設に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="contrib-b" />
                        <Label htmlFor="contrib-b" className="font-normal">
                          <span className="font-semibold">B：</span> 求められる施設活動に適切に参加
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="contrib-c" />
                        <Label htmlFor="contrib-c" className="font-normal">
                          <span className="font-semibold">C：</span> 最低限の施設活動への参加
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="contrib-d" />
                        <Label htmlFor="contrib-d" className="font-normal">
                          <span className="font-semibold">D：</span> 施設活動への参加が不十分
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <Label htmlFor="facility-score" className="text-lg font-semibold">施設内評価スコア</Label>
                  <RadioGroup className="flex space-x-4 mt-2">
                    <div className="flex items-center">
                      <RadioGroupItem value="s" id="facility-s" />
                      <Label htmlFor="facility-s" className="ml-2 font-bold">S</Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="a" id="facility-a" />
                      <Label htmlFor="facility-a" className="ml-2 font-bold">A</Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="b" id="facility-b" />
                      <Label htmlFor="facility-b" className="ml-2 font-bold">B</Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="c" id="facility-c" />
                      <Label htmlFor="facility-c" className="ml-2 font-bold">C</Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="d" id="facility-d" />
                      <Label htmlFor="facility-d" className="ml-2 font-bold">D</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="facility-comment">評価コメント</Label>
                  <Textarea 
                    id="facility-comment" 
                    placeholder="施設内での位置づけ、強み、改善点など"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 法人内評価タブ */}
            <TabsContent value="corporate" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">法人内評価（絶対評価）</h3>
                <p className="text-sm text-gray-600 mb-4">
                  法人全体での絶対的な評価（スキル・業績を重視）
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 看護技術・専門知識</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="skill-s" />
                        <Label htmlFor="skill-s" className="font-normal">
                          <span className="font-semibold">S：</span> 専門看護師レベルの卓越した技術・知識
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="skill-a" />
                        <Label htmlFor="skill-a" className="font-normal">
                          <span className="font-semibold">A：</span> 高度な技術・知識を持ち、指導的立場にある
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="skill-b" />
                        <Label htmlFor="skill-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的な技術・知識を確実に習得
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="skill-c" />
                        <Label htmlFor="skill-c" className="font-normal">
                          <span className="font-semibold">C：</span> 基本的な技術・知識はあるが、向上が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="skill-d" />
                        <Label htmlFor="skill-d" className="font-normal">
                          <span className="font-semibold">D：</span> 技術・知識が不足し、集中的な教育が必要
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 患者対応・ケアの質</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="care-s" />
                        <Label htmlFor="care-s" className="font-normal">
                          <span className="font-semibold">S：</span> 法人内で模範となる卓越した患者ケア
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="care-a" />
                        <Label htmlFor="care-a" className="font-normal">
                          <span className="font-semibold">A：</span> 高品質な患者ケアを一貫して提供
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="care-b" />
                        <Label htmlFor="care-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的な患者ケアを安定して提供
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="care-c" />
                        <Label htmlFor="care-c" className="font-normal">
                          <span className="font-semibold">C：</span> 患者ケアに改善の余地がある
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="care-d" />
                        <Label htmlFor="care-d" className="font-normal">
                          <span className="font-semibold">D：</span> 患者ケアの質に重大な問題がある
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 業務実績・生産性</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="performance-s" />
                        <Label htmlFor="performance-s" className="font-normal">
                          <span className="font-semibold">S：</span> 法人内トップクラスの業務実績
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="performance-a" />
                        <Label htmlFor="performance-a" className="font-normal">
                          <span className="font-semibold">A：</span> 優れた業務実績を安定して達成
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="performance-b" />
                        <Label htmlFor="performance-b" className="font-normal">
                          <span className="font-semibold">B：</span> 期待される業務実績を達成
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="performance-c" />
                        <Label htmlFor="performance-c" className="font-normal">
                          <span className="font-semibold">C：</span> 業務実績が期待を下回る
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="performance-d" />
                        <Label htmlFor="performance-d" className="font-normal">
                          <span className="font-semibold">D：</span> 業務実績が著しく低い
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <Label htmlFor="corporate-score" className="text-lg font-semibold">法人内評価スコア</Label>
                  <RadioGroup className="flex space-x-4 mt-2">
                    <div className="flex items-center">
                      <RadioGroupItem value="s" id="corporate-s" />
                      <Label htmlFor="corporate-s" className="ml-2 font-bold">S</Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="a" id="corporate-a" />
                      <Label htmlFor="corporate-a" className="ml-2 font-bold">A</Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="b" id="corporate-b" />
                      <Label htmlFor="corporate-b" className="ml-2 font-bold">B</Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="c" id="corporate-c" />
                      <Label htmlFor="corporate-c" className="ml-2 font-bold">C</Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="d" id="corporate-d" />
                      <Label htmlFor="corporate-d" className="ml-2 font-bold">D</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="corporate-comment">評価コメント</Label>
                  <Textarea 
                    id="corporate-comment" 
                    placeholder="スキルレベル、実績、法人への貢献など"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 総合判定タブ */}
            <TabsContent value="matrix" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">総合評価マトリックス</h3>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">施設内評価</h4>
                    <p className="text-2xl font-bold text-blue-600">B</p>
                    <p className="text-sm text-gray-600">相対評価スコア</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">法人内評価</h4>
                    <p className="text-2xl font-bold text-green-600">A</p>
                    <p className="text-sm text-gray-600">絶対評価スコア</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <h4 className="font-semibold mb-2">総合評価</h4>
                  <p className="text-3xl font-bold text-orange-600">A</p>
                  <p className="text-sm text-gray-600 mt-2">
                    施設内評価B × 法人内評価A = 総合評価A
                  </p>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">評価タイプ</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="star" id="type-star" />
                        <Label htmlFor="type-star" className="font-normal">
                          病院のスター型（施設内S × 法人内B以上）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="expert" id="type-expert" />
                        <Label htmlFor="type-expert" className="font-normal">
                          大規模病院の実力者型（両軸でA以上）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="mismatch" id="type-mismatch" />
                        <Label htmlFor="type-mismatch" className="font-normal">
                          環境ミスマッチ型（評価に大きな差）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="development" id="type-development" />
                        <Label htmlFor="type-development" className="font-normal">
                          スキル向上必要型（両軸でC以下）
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="overall-assessment">総合所見</Label>
                  <Textarea 
                    id="overall-assessment" 
                    placeholder="強み、課題、今後の方向性など"
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 育成計画タブ */}
            <TabsContent value="development" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">個別育成計画</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="strengths">強み・優れている点</Label>
                  <Textarea 
                    id="strengths" 
                    placeholder="技術面、人間性、リーダーシップなど"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="improvements">改善・育成が必要な点</Label>
                  <Textarea 
                    id="improvements" 
                    placeholder="スキル、知識、行動面など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="development-goals">今後1年間の育成目標</Label>
                  <Textarea 
                    id="development-goals" 
                    placeholder="具体的な目標と達成基準"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="action-plan">具体的なアクションプラン</Label>
                  <Textarea 
                    id="action-plan" 
                    placeholder="研修参加、OJT、メンター制度など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="career-path">推奨キャリアパス</Label>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="specialist" id="path-specialist" />
                        <Label htmlFor="path-specialist">専門看護師・認定看護師路線</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="management" id="path-management" />
                        <Label htmlFor="path-management">看護管理者路線</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="educator" id="path-educator" />
                        <Label htmlFor="path-educator">教育・指導者路線</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="generalist" id="path-generalist" />
                        <Label htmlFor="path-generalist">ジェネラリスト路線</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="next-review">次回評価予定日</Label>
                  <Input type="date" id="next-review" />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* 保存ボタン */}
          <div className="flex justify-end space-x-4 pt-6 border-t mt-6">
            <Button variant="outline">下書き保存</Button>
            <Button>評価を確定</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}