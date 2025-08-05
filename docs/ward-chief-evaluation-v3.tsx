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
import { InfoIcon, TrendingUp } from 'lucide-react';

export default function WardChiefEvaluationV3() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            病棟主任 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            管理能力と組織運営への貢献を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              病棟主任は現場リーダーとして、スタッフ管理・業務調整・師長補佐の役割を総合的に評価します
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="facility">施設内評価</TabsTrigger>
              <TabsTrigger value="corporate">法人内評価</TabsTrigger>
              <TabsTrigger value="management">管理実績</TabsTrigger>
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
                  <Input type="text" id="eval-period" placeholder="2025年度" />
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
                    <Label htmlFor="department">所属病棟</Label>
                    <Input type="text" id="department" />
                  </div>
                  <div>
                    <Label htmlFor="chief-years">主任経験年数</Label>
                    <Input type="text" id="chief-years" placeholder="3年" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="staff-count">管理スタッフ数</Label>
                    <Input type="text" id="staff-count" placeholder="15名" />
                  </div>
                  <div>
                    <Label htmlFor="certifications">保有資格</Label>
                    <Input type="text" id="certifications" placeholder="認定看護師等" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（師長）</Label>
                    <Input type="text" id="evaluator1" />
                  </div>
                  <div>
                    <Label htmlFor="evaluator2">2次評価者（看護部長）</Label>
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
                  現場管理能力と病棟運営への貢献を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 現場管理・リーダーシップ</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="management-s" />
                        <Label htmlFor="management-s" className="font-normal">
                          <span className="font-semibold">S：</span> 卓越した現場管理で病棟を円滑に運営し、師長不在時も完璧に対応
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="management-a" />
                        <Label htmlFor="management-a" className="font-normal">
                          <span className="font-semibold">A：</span> 優れたリーダーシップでスタッフをまとめ、業務を効率的に調整
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="management-b" />
                        <Label htmlFor="management-b" className="font-normal">
                          <span className="font-semibold">B：</span> 期待される管理業務を適切に遂行している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="management-c" />
                        <Label htmlFor="management-c" className="font-normal">
                          <span className="font-semibold">C：</span> 管理能力に課題があり、サポートが必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="management-d" />
                        <Label htmlFor="management-d" className="font-normal">
                          <span className="font-semibold">D：</span> 主任としての役割を果たせていない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. スタッフ育成・労務管理</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="staff-s" />
                        <Label htmlFor="staff-s" className="font-normal">
                          <span className="font-semibold">S：</span> スタッフの能力を最大限引き出し、離職率低下・満足度向上に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="staff-a" />
                        <Label htmlFor="staff-a" className="font-normal">
                          <span className="font-semibold">A：</span> きめ細かな育成と公平な労務管理で、スタッフから信頼される
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="staff-b" />
                        <Label htmlFor="staff-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本的なスタッフ管理を適切に行っている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="staff-c" />
                        <Label htmlFor="staff-c" className="font-normal">
                          <span className="font-semibold">C：</span> スタッフとのコミュニケーションに課題がある
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="staff-d" />
                        <Label htmlFor="staff-d" className="font-normal">
                          <span className="font-semibold">D：</span> スタッフ管理が不適切で、病棟に悪影響
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 病棟運営・改善活動</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="operation-s" />
                        <Label htmlFor="operation-s" className="font-normal">
                          <span className="font-semibold">S：</span> 革新的な改善を実現し、病棟の業績向上に大きく貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="operation-a" />
                        <Label htmlFor="operation-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的な改善提案と実行で、業務効率化を推進
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="operation-b" />
                        <Label htmlFor="operation-b" className="font-normal">
                          <span className="font-semibold">B：</span> 病棟運営に協力的で、改善活動に参加
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="operation-c" />
                        <Label htmlFor="operation-c" className="font-normal">
                          <span className="font-semibold">C：</span> 改善への取り組みが消極的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="operation-d" />
                        <Label htmlFor="operation-d" className="font-normal">
                          <span className="font-semibold">D：</span> 病棟運営への貢献がほとんどない
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
                  <Label htmlFor="facility-comment">現場管理の具体例・評価コメント</Label>
                  <Textarea 
                    id="facility-comment" 
                    placeholder="リーダーシップの発揮例、スタッフ育成の成果、業務改善の実績など"
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
                  看護管理能力と法人方針への貢献を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 看護管理・実践能力</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="nursing-s" />
                        <Label htmlFor="nursing-s" className="font-normal">
                          <span className="font-semibold">S：</span> 高度な看護管理で法人内のモデル病棟を実現
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="nursing-a" />
                        <Label htmlFor="nursing-a" className="font-normal">
                          <span className="font-semibold">A：</span> 優れた管理能力で看護の質向上に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="nursing-b" />
                        <Label htmlFor="nursing-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的な看護管理を実践している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="nursing-c" />
                        <Label htmlFor="nursing-c" className="font-normal">
                          <span className="font-semibold">C：</span> 管理能力の向上が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="nursing-d" />
                        <Label htmlFor="nursing-d" className="font-normal">
                          <span className="font-semibold">D：</span> 看護管理に重大な課題がある
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 法人方針の理解と実践</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="policy-s" />
                        <Label htmlFor="policy-s" className="font-normal">
                          <span className="font-semibold">S：</span> 法人方針を深く理解し、他部署への波及効果も生み出す
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="policy-a" />
                        <Label htmlFor="policy-a" className="font-normal">
                          <span className="font-semibold">A：</span> 法人方針を的確に現場に落とし込み、成果を上げる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="policy-b" />
                        <Label htmlFor="policy-b" className="font-normal">
                          <span className="font-semibold">B：</span> 法人方針に沿った業務遂行ができている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="policy-c" />
                        <Label htmlFor="policy-c" className="font-normal">
                          <span className="font-semibold">C：</span> 法人方針の理解・実践が不十分
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="policy-d" />
                        <Label htmlFor="policy-d" className="font-normal">
                          <span className="font-semibold">D：</span> 法人方針と現場運営が乖離している
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 経営視点での貢献</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="business-s" />
                        <Label htmlFor="business-s" className="font-normal">
                          <span className="font-semibold">S：</span> 経営的視点で病棟運営を最適化し、収益改善に大きく貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="business-a" />
                        <Label htmlFor="business-a" className="font-normal">
                          <span className="font-semibold">A：</span> コスト意識を持ち、効率的な病棟運営を実践
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="business-b" />
                        <Label htmlFor="business-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本的な経営意識を持って業務にあたる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="business-c" />
                        <Label htmlFor="business-c" className="font-normal">
                          <span className="font-semibold">C：</span> 経営的視点が不足している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="business-d" />
                        <Label htmlFor="business-d" className="font-normal">
                          <span className="font-semibold">D：</span> 経営への意識がほとんどない
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
                  <Label htmlFor="corporate-comment">管理実践の具体例・評価コメント</Label>
                  <Textarea 
                    id="corporate-comment" 
                    placeholder="看護管理の成果、法人方針の実践例、経営貢献の実績など"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 管理実績タブ */}
            <TabsContent value="management" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">管理実績・成果</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">人員管理実績</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="staff-retention">スタッフ定着率</Label>
                      <Input type="text" id="staff-retention" placeholder="92%" />
                    </div>
                    <div>
                      <Label htmlFor="staff-satisfaction">スタッフ満足度</Label>
                      <Input type="text" id="staff-satisfaction" placeholder="4.0/5.0" />
                    </div>
                    <div>
                      <Label htmlFor="overtime">時間外勤務削減率</Label>
                      <Input type="text" id="overtime" placeholder="前年比-15%" />
                    </div>
                    <div>
                      <Label htmlFor="leave-rate">有給取得率</Label>
                      <Input type="text" id="leave-rate" placeholder="72%" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">業務改善実績</h4>
                  <Textarea 
                    placeholder="実施した改善活動、効率化の成果、新たな取り組みなど"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3">教育・育成実績</h4>
                  <Textarea 
                    placeholder="スタッフ教育の取り組み、新人育成の成果、勉強会開催など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3">病棟指標</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Label>インシデント発生率</Label>
                      <Input type="text" placeholder="0.5%" className="w-20" />
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label>患者満足度</Label>
                      <Input type="text" placeholder="4.5/5.0" className="w-20" />
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label>病床稼働率</Label>
                      <Input type="text" placeholder="96%" className="w-20" />
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label>平均在院日数</Label>
                      <Input type="text" placeholder="12.0日" className="w-20" />
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
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
                    <p className="text-2xl font-bold text-blue-600">A</p>
                    <p className="text-sm text-gray-600">現場管理・病棟運営</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">法人内評価</h4>
                    <p className="text-2xl font-bold text-green-600">B</p>
                    <p className="text-sm text-gray-600">看護管理・経営貢献</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <h4 className="font-semibold mb-2">総合評価</h4>
                  <p className="text-3xl font-bold text-orange-600">A</p>
                  <p className="text-sm text-gray-600 mt-2">
                    施設内評価A × 法人内評価B = 総合評価A
                  </p>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">評価タイプ</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="next-leader" id="type-next" />
                        <Label htmlFor="type-next" className="font-normal">
                          次期師長候補型（両軸でA以上）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="site-expert" id="type-site" />
                        <Label htmlFor="type-site" className="font-normal">
                          現場エキスパート型（施設評価S/A）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="management-talent" id="type-management" />
                        <Label htmlFor="type-management" className="font-normal">
                          管理能力優秀型（法人評価S/A）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="steady" id="type-steady" />
                        <Label htmlFor="type-steady" className="font-normal">
                          安定遂行型（両軸でB）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="support" id="type-support" />
                        <Label htmlFor="type-support" className="font-normal">
                          育成支援型（いずれかC以下）
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="overall-assessment">総合所見</Label>
                  <Textarea 
                    id="overall-assessment" 
                    placeholder="主任としての適性、強み、組織への価値、今後の可能性など"
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 育成計画タブ */}
            <TabsContent value="development" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">個別育成・キャリア開発計画</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="strengths">管理者としての強み</Label>
                  <Textarea 
                    id="strengths" 
                    placeholder="リーダーシップ、調整力、スタッフ育成力、経営感覚など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="improvements">さらなる成長が期待される領域</Label>
                  <Textarea 
                    id="improvements" 
                    placeholder="より高度な管理スキル、経営的視点、対外交渉力など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="next-goals">次年度の目標・課題</Label>
                  <Textarea 
                    id="next-goals" 
                    placeholder="師長業務の習得、管理研修への参加、プロジェクトリーダーなど"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="career-path">推奨キャリアパス（3年後）</Label>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nurse-manager" id="path-manager" />
                        <Label htmlFor="path-manager">看護師長への昇進</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="specialist-chief" id="path-specialist" />
                        <Label htmlFor="path-specialist">専門分野での主任継続</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="education" id="path-education" />
                        <Label htmlFor="path-education">教育担当への転向</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="project" id="path-project" />
                        <Label htmlFor="path-project">法人プロジェクト担当</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="support-plan">必要な支援・教育</Label>
                  <Textarea 
                    id="support-plan" 
                    placeholder="管理者研修、メンタリング、他部署研修、外部セミナーなど"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="succession-plan">師長候補としての準備計画</Label>
                  <Textarea 
                    id="succession-plan" 
                    placeholder="師長代行経験、看護部会議参加、経営会議オブザーバーなど"
                    className="min-h-[80px]"
                  />
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