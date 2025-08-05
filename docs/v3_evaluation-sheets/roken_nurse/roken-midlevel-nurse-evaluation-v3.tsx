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
import { UserCheck } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";

export default function RokenMidlevelNurseEvaluationV3() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            介護老人保健施設 中堅看護師（4-10年） 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            リーダーシップと在宅復帰支援の専門性を重視した評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <UserCheck className="h-4 w-4" />
            <AlertDescription>
              老健中堅看護師は専門性の発揮、チームリーダーシップ、在宅復帰率向上への貢献を重点的に評価します
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="facility">施設内評価</TabsTrigger>
              <TabsTrigger value="corporate">法人内評価</TabsTrigger>
              <TabsTrigger value="leadership">リーダーシップ</TabsTrigger>
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
                    <Label htmlFor="primary-service">主たる配属サービス</Label>
                    <Input type="text" id="primary-service" placeholder="入所 / 通所リハ / 訪問看護" />
                  </div>
                  <div>
                    <Label htmlFor="experience">経験年数</Label>
                    <Input type="text" id="experience" placeholder="7年" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="role">現在の役割</Label>
                    <Input type="text" id="role" placeholder="チームリーダー / 在宅復帰支援担当" />
                  </div>
                  <div>
                    <Label htmlFor="specialty">専門分野</Label>
                    <Input type="text" id="specialty" placeholder="リハビリテーション看護 / 認知症ケア" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（主任）</Label>
                    <Input type="text" id="evaluator1" />
                  </div>
                  <div>
                    <Label htmlFor="evaluator2">2次評価者（師長）</Label>
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
                  リーダーシップと組織貢献を重視した評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. チームリーダーシップと指導力</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="leadership-s" />
                        <Label htmlFor="leadership-s" className="font-normal">
                          <span className="font-semibold">S：</span> 卓越したリーダーシップで多職種チームを統率し、高い成果を達成
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="leadership-a" />
                        <Label htmlFor="leadership-a" className="font-normal">
                          <span className="font-semibold">A：</span> 効果的なリーダーシップを発揮し、チーム力を向上
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="leadership-b" />
                        <Label htmlFor="leadership-b" className="font-normal">
                          <span className="font-semibold">B：</span> 標準的なリーダーシップでチームを運営
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="leadership-c" />
                        <Label htmlFor="leadership-c" className="font-normal">
                          <span className="font-semibold">C：</span> リーダーシップに課題があり、改善が必要
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="leadership-d" />
                        <Label htmlFor="leadership-d" className="font-normal">
                          <span className="font-semibold">D：</span> リーダーとしての役割を果たせていない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 後輩育成と知識伝承</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="mentoring-s" />
                        <Label htmlFor="mentoring-s" className="font-normal">
                          <span className="font-semibold">S：</span> 組織的な教育プログラムを開発し、多数の優秀な人材を育成
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="mentoring-a" />
                        <Label htmlFor="mentoring-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的に後輩を指導し、老健看護の専門性を伝承
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="mentoring-b" />
                        <Label htmlFor="mentoring-b" className="font-normal">
                          <span className="font-semibold">B：</span> 求められれば適切に後輩をサポート
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="mentoring-c" />
                        <Label htmlFor="mentoring-c" className="font-normal">
                          <span className="font-semibold">C：</span> 後輩育成への関与が消極的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="mentoring-d" />
                        <Label htmlFor="mentoring-d" className="font-normal">
                          <span className="font-semibold">D：</span> 育成活動への貢献がない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 業務改善と組織発展への貢献</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="improvement-s" />
                        <Label htmlFor="improvement-s" className="font-normal">
                          <span className="font-semibold">S：</span> 革新的な改善提案により、施設運営に大きく貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="improvement-a" />
                        <Label htmlFor="improvement-a" className="font-normal">
                          <span className="font-semibold">A：</span> 積極的に業務改善を推進し、効率化・質向上を実現
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="improvement-b" />
                        <Label htmlFor="improvement-b" className="font-normal">
                          <span className="font-semibold">B：</span> 委員会活動等で一定の貢献をしている
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="improvement-c" />
                        <Label htmlFor="improvement-c" className="font-normal">
                          <span className="font-semibold">C：</span> 組織活動への参加が限定的
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="improvement-d" />
                        <Label htmlFor="improvement-d" className="font-normal">
                          <span className="font-semibold">D：</span> 日常業務に終始し、改善への貢献がない
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
                    placeholder="リーダーシップの発揮例、後輩育成の成果、業務改善の実績など"
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
                  老健看護の専門実践力と在宅復帰支援の成果を評価
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. 高度な老健看護実践</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="advanced-practice-s" />
                        <Label htmlFor="advanced-practice-s" className="font-normal">
                          <span className="font-semibold">S：</span> 専門性を活かした卓越した看護実践で、困難事例も解決
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="advanced-practice-a" />
                        <Label htmlFor="advanced-practice-a" className="font-normal">
                          <span className="font-semibold">A：</span> 高度な看護実践により、利用者のQOL向上に大きく貢献
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="advanced-practice-b" />
                        <Label htmlFor="advanced-practice-b" className="font-normal">
                          <span className="font-semibold">B：</span> 安定した看護実践で、期待される成果を達成
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="advanced-practice-c" />
                        <Label htmlFor="advanced-practice-c" className="font-normal">
                          <span className="font-semibold">C：</span> 看護実践の質に改善の余地がある
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="advanced-practice-d" />
                        <Label htmlFor="advanced-practice-d" className="font-normal">
                          <span className="font-semibold">D：</span> 期待される実践レベルに達していない
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 在宅復帰率向上への専門的貢献</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="home-specialist-s" />
                        <Label htmlFor="home-specialist-s" className="font-normal">
                          <span className="font-semibold">S：</span> 在宅復帰困難事例を専門的アプローチで成功に導く実績多数
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="home-specialist-a" />
                        <Label htmlFor="home-specialist-a" className="font-normal">
                          <span className="font-semibold">A：</span> 専門的な家族支援・環境調整により在宅復帰率を大幅に向上
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="home-specialist-b" />
                        <Label htmlFor="home-specialist-b" className="font-normal">
                          <span className="font-semibold">B：</span> 在宅復帰支援に積極的に取り組み、一定の成果を上げる
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="home-specialist-c" />
                        <Label htmlFor="home-specialist-c" className="font-normal">
                          <span className="font-semibold">C：</span> 在宅復帰支援への取り組みが不十分
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="home-specialist-d" />
                        <Label htmlFor="home-specialist-d" className="font-normal">
                          <span className="font-semibold">D：</span> 在宅復帰の視点が欠如している
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 多職種協働とケアマネジメントの推進</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="s" id="care-management-s" />
                        <Label htmlFor="care-management-s" className="font-normal">
                          <span className="font-semibold">S：</span> カンファレンスを主導し、革新的なケアプランで成果を創出
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="a" id="care-management-a" />
                        <Label htmlFor="care-management-a" className="font-normal">
                          <span className="font-semibold">A：</span> 多職種を効果的にコーディネートし、質の高いケアを実現
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id="care-management-b" />
                        <Label htmlFor="care-management-b" className="font-normal">
                          <span className="font-semibold">B：</span> 多職種連携を適切に実践している
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id="care-management-c" />
                        <Label htmlFor="care-management-c" className="font-normal">
                          <span className="font-semibold">C：</span> 連携・調整力に改善の余地がある
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id="care-management-d" />
                        <Label htmlFor="care-management-d" className="font-normal">
                          <span className="font-semibold">D：</span> 協働が不十分でケアの質に影響
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
                    placeholder="専門的看護実践の成果、在宅復帰の成功事例、多職種協働での実績など"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* リーダーシップタブ */}
            <TabsContent value="leadership" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">リーダーシップ詳細評価</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">チームリーダーとしての実績</h4>
                  <div className="space-y-2">
                    <Checkbox id="lead-projects" />
                    <Label htmlFor="lead-projects" className="ml-2">在宅復帰推進プロジェクトのリーダー</Label>
                  </div>
                  <div className="space-y-2 mt-2">
                    <Checkbox id="lead-quality" />
                    <Label htmlFor="lead-quality" className="ml-2">ケア質向上委員会の中心メンバー</Label>
                  </div>
                  <div className="space-y-2 mt-2">
                    <Checkbox id="lead-education" />
                    <Label htmlFor="lead-education" className="ml-2">新人教育プログラムの企画・運営</Label>
                  </div>
                  <div className="space-y-2 mt-2">
                    <Checkbox id="lead-innovation" />
                    <Label htmlFor="lead-innovation" className="ml-2">業務改善・効率化の推進リーダー</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="leadership-examples">リーダーシップ発揮の具体例</Label>
                  <Textarea 
                    id="leadership-examples" 
                    placeholder="チーム運営での成果、困難な状況での対応、メンバーの成長支援など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="influence-scope">影響力の範囲</Label>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="facility-wide" id="scope-facility" />
                        <Label htmlFor="scope-facility">施設全体に影響を与えている</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="multi-service" id="scope-multi" />
                        <Label htmlFor="scope-multi">複数のサービス部門に影響</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="department" id="scope-dept" />
                        <Label htmlFor="scope-dept">所属部門内で影響力を発揮</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="team" id="scope-team" />
                        <Label htmlFor="scope-team">チーム内での影響に留まる</Label>
                      </div>
                    </div>
                  </RadioGroup>
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
                    <p className="text-sm text-gray-600">リーダーシップ・育成・貢献</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">法人内評価</h4>
                    <p className="text-2xl font-bold text-green-600">B</p>
                    <p className="text-sm text-gray-600">専門実践・在宅復帰支援</p>
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
                        <RadioGroupItem value="management-candidate" id="type-management" />
                        <Label htmlFor="type-management" className="font-normal">
                          管理職候補型（両軸でA以上）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="specialist-leader" id="type-specialist" />
                        <Label htmlFor="type-specialist" className="font-normal">
                          専門リーダー型（実践力特化）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="educator" id="type-educator" />
                        <Label htmlFor="type-educator" className="font-normal">
                          教育者型（育成・指導力特化）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="balanced-leader" id="type-balanced" />
                        <Label htmlFor="type-balanced" className="font-normal">
                          バランス型リーダー（両軸でB）
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="developing-leader" id="type-developing" />
                        <Label htmlFor="type-developing" className="font-normal">
                          成長期リーダー（更なる向上が必要）
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="overall-assessment">総合所見</Label>
                  <Textarea 
                    id="overall-assessment" 
                    placeholder="老健中堅看護師としての強み、リーダーシップの特徴、今後の可能性など"
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
                  <Label htmlFor="strengths">強みと優れている点</Label>
                  <Textarea 
                    id="strengths" 
                    placeholder="リーダーシップスタイル、専門性、在宅復帰支援での成果など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="growth-areas">今後の成長課題</Label>
                  <Textarea 
                    id="growth-areas" 
                    placeholder="管理能力の向上、より広範な影響力、新たな専門分野の開拓など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="next-goals">次期の目標</Label>
                  <Textarea 
                    id="next-goals" 
                    placeholder="主任への昇格準備、専門資格の取得、施設全体のプロジェクトリード など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="recommended-training">推奨する研修・資格</Label>
                  <Textarea 
                    id="recommended-training" 
                    placeholder="管理職研修、認知症ケア専門士、在宅ケア認定看護師など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="career-path">キャリアパス提案</Label>
                  <Textarea 
                    id="career-path" 
                    placeholder="主任→師長コース、専門看護師コース、教育専任コースなど"
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