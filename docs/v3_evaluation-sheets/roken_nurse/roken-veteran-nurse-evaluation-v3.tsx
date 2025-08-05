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
import { Award } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";

export default function RokenVeteranNurseEvaluationV3() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            介護老人保健施設 ベテラン看護師（11年以上） 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            専門性の活用と組織全体への貢献を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Award className="h-4 w-4" />
            <AlertDescription>
              老健ベテラン看護師は豊富な経験・専門性を組織のために活用し、知識継承と老健看護の発展への貢献を評価します
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="facility">施設内評価</TabsTrigger>
              <TabsTrigger value="corporate">法人内評価</TabsTrigger>
              <TabsTrigger value="contribution">組織貢献実績</TabsTrigger>
              <TabsTrigger value="matrix">総合判定</TabsTrigger>
              <TabsTrigger value="succession">継承・活用計画</TabsTrigger>
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
                    <Label htmlFor="primary-service">主たる配属サービス</Label>
                    <Input type="text" id="primary-service" placeholder="入所 / 通所リハ / 訪問看護" />
                  </div>
                  <div>
                    <Label htmlFor="experience">経験年数</Label>
                    <Input type="text" id="experience" placeholder="15年" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="certifications">保有資格</Label>
                    <Input type="text" id="certifications" placeholder="認定看護師 / ケアマネジャー" />
                  </div>
                  <div>
                    <Label htmlFor="specialty">専門領域</Label>
                    <Input type="text" id="specialty" placeholder="リハビリテーション看護 / 認知症ケア" />
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
                  経験を活かした組織貢献と後進育成を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 組織全体への影響力と貢献</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="influence-s" />
                        <Label htmlFor="influence-s" className="font-normal">
                          <span className="font-semibold">S：</span> 施設全体の看護の質向上に決定的な貢献をし、組織変革を主導
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="influence-a" />
                        <Label htmlFor="influence-a" className="font-normal">
                          <span className="font-semibold">A：</span> 複数部門に影響を与え、組織の発展に大きく貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="influence-b" />
                        <Label htmlFor="influence-b" className="font-normal">
                          <span className="font-semibold">B：</span> 所属部門で安定した貢献をしている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="influence-c" />
                        <Label htmlFor="influence-c" className="font-normal">
                          <span className="font-semibold">C：</span> 個人の業務に留まり、組織貢献が限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="influence-d" />
                        <Label htmlFor="influence-d" className="font-normal">
                          <span className="font-semibold">D：</span> 経験を組織に還元できていない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 知識・技術の継承と人材育成</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="succession-s" />
                        <Label htmlFor="succession-s" className="font-normal">
                          <span className="font-semibold">S：</span> 体系的な教育プログラムを構築し、多数の優秀な人材を輩出
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="succession-a" />
                        <Label htmlFor="succession-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的に老健看護の専門性を伝承し、後進の成長に大きく貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="succession-b" />
                        <Label htmlFor="succession-b" className="font-normal">
                          <span className="font-semibold">B：</span> 求められれば適切に知識・技術を共有
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="succession-c" />
                        <Label htmlFor="succession-c" className="font-normal">
                          <span className="font-semibold">C：</span> 知識継承への取り組みが不十分
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="succession-d" />
                        <Label htmlFor="succession-d" className="font-normal">
                          <span className="font-semibold">D：</span> 専門性を個人に留め、組織に還元していない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 組織文化の醸成と模範性</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="culture-s" />
                        <Label htmlFor="culture-s" className="font-normal">
                          <span className="font-semibold">S：</span> 老健の理念を体現し、組織文化のリーダーとして全職員の模範
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="culture-a" />
                        <Label htmlFor="culture-a" className="font-normal">
                          <span className="font-semibold">A：</span> 高い倫理観と専門性で、多くの職員に良い影響を与える
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="culture-b" />
                        <Label htmlFor="culture-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的な模範性を示している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="culture-c" />
                        <Label htmlFor="culture-c" className="font-normal">
                          <span className="font-semibold">C：</span> 模範としての意識が不足
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="culture-d" />
                        <Label htmlFor="culture-d" className="font-normal">
                          <span className="font-semibold">D：</span> ベテランとしての役割を果たしていない
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
                  <Label htmlFor="facility-comment">具体的な貢献事例・評価コメント</Label>
                  <Textarea 
                    id="facility-comment" 
                    placeholder="組織への影響力、人材育成の成果、文化醸成への貢献など"
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
                  老健看護の専門性発揮と在宅復帰支援の革新を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 専門性を活かした高度な実践</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="expertise-s" />
                        <Label htmlFor="expertise-s" className="font-normal">
                          <span className="font-semibold">S：</span> 卓越した専門性で最困難事例も解決し、新たな看護手法を開発
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="expertise-a" />
                        <Label htmlFor="expertise-a" className="font-normal">
                          <span className="font-semibold">A：</span> 高度な専門実践により、他職員では対応困難な事例を解決
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="expertise-b" />
                        <Label htmlFor="expertise-b" className="font-normal">
                          <span className="font-semibold">B：</span> 安定した専門実践を継続している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="expertise-c" />
                        <Label htmlFor="expertise-c" className="font-normal">
                          <span className="font-semibold">C：</span> 専門性の発揮が限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="expertise-d" />
                        <Label htmlFor="expertise-d" className="font-normal">
                          <span className="font-semibold">D：</span> ベテランとしての専門性が発揮されていない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 在宅復帰支援システムの革新</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="innovation-s" />
                        <Label htmlFor="innovation-s" className="font-normal">
                          <span className="font-semibold">S：</span> 革新的なアプローチで在宅復帰率を飛躍的に向上させる仕組みを構築
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="innovation-a" />
                        <Label htmlFor="innovation-a" className="font-normal">
                          <span className="font-semibold">A：</span> 在宅復帰支援の新たな方法論を開発し、施設全体に展開
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="innovation-b" />
                        <Label htmlFor="innovation-b" className="font-normal">
                          <span className="font-semibold">B：</span> 確実な在宅復帰支援を実践している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="innovation-c" />
                        <Label htmlFor="innovation-c" className="font-normal">
                          <span className="font-semibold">C：</span> 在宅復帰支援への貢献が不十分
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="innovation-d" />
                        <Label htmlFor="innovation-d" className="font-normal">
                          <span className="font-semibold">D：</span> 在宅復帰の視点が不足している
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 地域連携と老健看護の発展</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="community-s" />
                        <Label htmlFor="community-s" className="font-normal">
                          <span className="font-semibold">S：</span> 地域の老健看護のリーダーとして、他施設や医療機関と革新的な連携を構築
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="community-a" />
                        <Label htmlFor="community-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的な地域連携により、老健の役割向上に貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="community-b" />
                        <Label htmlFor="community-b" className="font-normal">
                          <span className="font-semibold">B：</span> 基本的な地域連携活動に参加
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="community-c" />
                        <Label htmlFor="community-c" className="font-normal">
                          <span className="font-semibold">C：</span> 地域連携への関与が限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="community-d" />
                        <Label htmlFor="community-d" className="font-normal">
                          <span className="font-semibold">D：</span> 施設内業務に留まり、外部連携がない
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
                  <Label htmlFor="corporate-comment">実践能力の具体例・評価コメント</Label>
                  <Textarea 
                    id="corporate-comment" 
                    placeholder="専門実践の成果、在宅復帰支援の革新、地域連携での貢献など"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 組織貢献実績タブ */}
            <TabsContent value="contribution" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">組織貢献実績</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">主導したプロジェクト・取り組み</h4>
                  <div className="space-y-2">
                    <Checkbox id="project-quality" />
                    <Label htmlFor="project-quality" className="ml-2">ケア質向上プロジェクトの立案・実行</Label>
                  </div>
                  <div className="space-y-2 mt-2">
                    <Checkbox id="project-education" />
                    <Label htmlFor="project-education" className="ml-2">教育体系の構築・改革</Label>
                  </div>
                  <div className="space-y-2 mt-2">
                    <Checkbox id="project-manual" />
                    <Label htmlFor="project-manual" className="ml-2">老健看護マニュアル・手順書の作成</Label>
                  </div>
                  <div className="space-y-2 mt-2">
                    <Checkbox id="project-research" />
                    <Label htmlFor="project-research" className="ml-2">看護研究・事例発表の実施</Label>
                  </div>
                  <div className="space-y-2 mt-2">
                    <Checkbox id="project-community" />
                    <Label htmlFor="project-community" className="ml-2">地域連携システムの構築</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="mentoring-results">育成した人材の実績</Label>
                  <Textarea 
                    id="mentoring-results" 
                    placeholder="指導した職員の成長、昇格者数、資格取得支援の成果など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="external-activities">外部活動・社会貢献</Label>
                  <Textarea 
                    id="external-activities" 
                    placeholder="学会発表、講師活動、地域の委員会活動、老健協会での活動など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="innovation-results">革新的な取り組みとその成果</Label>
                  <Textarea 
                    id="innovation-results" 
                    placeholder="新たな看護手法の開発、在宅復帰率の向上実績、業務効率化の成果など"
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
                    <p className="text-sm text-gray-600">組織貢献・育成・文化醸成</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">法人内評価</h4>
                    <p className="text-2xl font-bold text-green-600">B</p>
                    <p className="text-sm text-gray-600">専門実践・革新・地域連携</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <h4 className="font-semibold mb-2">総合評価</h4>
                  <p className="text-3xl font-bold text-orange-600">B</p>
                  <p className="text-sm text-gray-600 mt-2">
                    施設内評価B × 法人内評価B = 総合評価B
                  </p>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">評価タイプ</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="master" id="type-master" />
                        <Label htmlFor="type-master" className="font-normal">
                          マスター型（両軸でS・組織の要）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="mentor" id="type-mentor" />
                        <Label htmlFor="type-mentor" className="font-normal">
                          メンター型（人材育成・組織文化に特化）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="expert" id="type-expert" />
                        <Label htmlFor="type-expert" className="font-normal">
                          エキスパート型（専門実践・革新に特化）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="advisor" id="type-advisor" />
                        <Label htmlFor="type-advisor" className="font-normal">
                          アドバイザー型（両軸でB・安定した貢献）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="specialist" id="type-specialist" />
                        <Label htmlFor="type-specialist" className="font-normal">
                          スペシャリスト型（特定分野で貢献）
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="overall-assessment">総合所見</Label>
                  <Textarea 
                    id="overall-assessment" 
                    placeholder="老健ベテラン看護師としての価値、組織への貢献度、今後の活用方針など"
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* 継承・活用計画タブ */}
            <TabsContent value="succession" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">知識継承・活用計画</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="unique-expertise">保有する独自の専門性・知識</Label>
                  <Textarea 
                    id="unique-expertise" 
                    placeholder="老健看護の深い経験知、特殊な技術、人脈、歴史的経緯の理解など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="succession-plan">知識・技術の継承計画</Label>
                  <Textarea 
                    id="succession-plan" 
                    placeholder="マニュアル化、研修講師、メンタリング、事例集の作成など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="organizational-role">今後の組織内での役割</Label>
                  <Textarea 
                    id="organizational-role" 
                    placeholder="教育専任、特命プロジェクト、アドバイザー、地域連携担当など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="development-areas">さらなる活躍のための支援</Label>
                  <Textarea 
                    id="development-areas" 
                    placeholder="新たな資格取得支援、外部研修、学会参加支援など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="legacy-building">レガシー構築計画</Label>
                  <Textarea 
                    id="legacy-building" 
                    placeholder="後進に残すべき成果、構築すべきシステム、確立すべき文化など"
                    className="min-h-[100px]"
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