'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, Calculator } from 'lucide-react';

export default function JuniorNurseEvaluationV2() {
  // 評価点数の状態管理
  const [scores, setScores] = useState({
    facility: {},
    corporate: {}
  });

  // 合計点数の計算
  const calculateTotal = (type: keyof typeof scores) => {
    const typeScores = scores[type];
    return Object.values(typeScores).reduce((sum: number, score: any) => sum + (parseInt(score) || 0), 0);
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            一般看護師（2-3年目） 人事評価シート
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            2軸評価方式による客観的評価
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              評価項目ごとに1-5点で採点し、施設内・法人内での相対順位により最終評価が決定されます
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="facility-items">評価項目（施設）</TabsTrigger>
              <TabsTrigger value="corporate-items">評価項目（法人）</TabsTrigger>
              <TabsTrigger value="result">評価結果</TabsTrigger>
              <TabsTrigger value="feedback">フィードバック</TabsTrigger>
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
                    <Label htmlFor="facility">所属施設</Label>
                    <Input type="text" id="facility" />
                  </div>
                  <div>
                    <Label htmlFor="department">所属部署</Label>
                    <Input type="text" id="department" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="experience">経験年数</Label>
                    <Input type="text" id="experience" placeholder="2年6ヶ月" />
                  </div>
                  <div>
                    <Label htmlFor="position">職位</Label>
                    <Input type="text" id="position" placeholder="一般看護師" />
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

            {/* 評価項目（施設）タブ */}
            <TabsContent value="facility-items" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設内評価項目</h3>
                <p className="text-sm text-gray-600 mb-4">
                  チーム内での役割遂行・協調性を中心に評価（各項目1-5点）
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-4">1. チーム貢献度（25点満点）</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f1-1" className="flex-1">チーム内での役割遂行</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, facility: {...scores.facility, 'f1-1': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`f1-1-${n}`} />
                            <Label htmlFor={`f1-1-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f1-2" className="flex-1">多重課題への対応力</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, facility: {...scores.facility, 'f1-2': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`f1-2-${n}`} />
                            <Label htmlFor={`f1-2-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f1-3" className="flex-1">夜勤業務の自立度</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, facility: {...scores.facility, 'f1-3': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`f1-3-${n}`} />
                            <Label htmlFor={`f1-3-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f1-4" className="flex-1">緊急時の対応力</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, facility: {...scores.facility, 'f1-4': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`f1-4-${n}`} />
                            <Label htmlFor={`f1-4-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f1-5" className="flex-1">チーム内での協調性</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, facility: {...scores.facility, 'f1-5': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`f1-5-${n}`} />
                            <Label htmlFor={`f1-5-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-4">2. 後輩指導・育成（15点満点）</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f2-1" className="flex-1">新人指導への取り組み</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, facility: {...scores.facility, 'f2-1': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`f2-1-${n}`} />
                            <Label htmlFor={`f2-1-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f2-2" className="flex-1">実習生指導への協力</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, facility: {...scores.facility, 'f2-2': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`f2-2-${n}`} />
                            <Label htmlFor={`f2-2-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f2-3" className="flex-1">知識・技術の共有</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, facility: {...scores.facility, 'f2-3': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`f2-3-${n}`} />
                            <Label htmlFor={`f2-3-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-4">3. 施設活動への参画（10点満点）</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f3-1" className="flex-1">委員会活動への参加</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, facility: {...scores.facility, 'f3-1': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`f3-1-${n}`} />
                            <Label htmlFor={`f3-1-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f3-2" className="flex-1">業務改善への取り組み</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, facility: {...scores.facility, 'f3-2': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`f3-2-${n}`} />
                            <Label htmlFor={`f3-2-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-lg">施設内評価 合計点</h4>
                    <div className="flex items-center space-x-2">
                      <Calculator className="h-5 w-5" />
                      <span className="text-2xl font-bold text-blue-600">
                        {calculateTotal('facility')} / 50点
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 評価項目（法人）タブ */}
            <TabsContent value="corporate-items" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">法人内評価項目</h3>
                <p className="text-sm text-gray-600 mb-4">
                  看護実践能力・専門性を中心に評価（各項目1-5点）
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-4">1. 看護実践能力（25点満点）</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="c1-1" className="flex-1">アセスメント能力</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, corporate: {...scores.corporate, 'c1-1': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`c1-1-${n}`} />
                            <Label htmlFor={`c1-1-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="c1-2" className="flex-1">看護計画立案・実施</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, corporate: {...scores.corporate, 'c1-2': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`c1-2-${n}`} />
                            <Label htmlFor={`c1-2-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="c1-3" className="flex-1">看護技術の正確性</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, corporate: {...scores.corporate, 'c1-3': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`c1-3-${n}`} />
                            <Label htmlFor={`c1-3-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="c1-4" className="flex-1">急変時対応能力</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, corporate: {...scores.corporate, 'c1-4': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`c1-4-${n}`} />
                            <Label htmlFor={`c1-4-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="c1-5" className="flex-1">記録の質と適時性</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, corporate: {...scores.corporate, 'c1-5': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`c1-5-${n}`} />
                            <Label htmlFor={`c1-5-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-4">2. 患者ケアの質（15点満点）</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="c2-1" className="flex-1">患者中心のケア実践</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, corporate: {...scores.corporate, 'c2-1': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`c2-1-${n}`} />
                            <Label htmlFor={`c2-1-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="c2-2" className="flex-1">患者・家族とのコミュニケーション</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, corporate: {...scores.corporate, 'c2-2': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`c2-2-${n}`} />
                            <Label htmlFor={`c2-2-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="c2-3" className="flex-1">倫理的配慮</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, corporate: {...scores.corporate, 'c2-3': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`c2-3-${n}`} />
                            <Label htmlFor={`c2-3-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-4">3. 専門性向上への取り組み（10点満点）</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="c3-1" className="flex-1">自己研鑽の実施</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, corporate: {...scores.corporate, 'c3-1': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`c3-1-${n}`} />
                            <Label htmlFor={`c3-1-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="c3-2" className="flex-1">研修参加と知識活用</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, corporate: {...scores.corporate, 'c3-2': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`c3-2-${n}`} />
                            <Label htmlFor={`c3-2-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                <div className="bg-green-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-lg">法人内評価 合計点</h4>
                    <div className="flex items-center space-x-2">
                      <Calculator className="h-5 w-5" />
                      <span className="text-2xl font-bold text-green-600">
                        {calculateTotal('corporate')} / 50点
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 評価結果タブ */}
            <TabsContent value="result" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">評価結果</h3>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="bg-blue-50">
                    <CardTitle className="text-lg">施設内評価</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">合計点数</p>
                      <p className="text-2xl font-bold">{calculateTotal('facility')} / 50点</p>
                      <p className="text-sm text-gray-600 mt-4">施設内順位</p>
                      <p className="text-lg font-semibold">一般看護師（2-3年目） 15名中 6位</p>
                      <div className="mt-4 p-3 bg-gray-100 rounded">
                        <p className="font-bold text-center text-xl">判定：B</p>
                        <p className="text-xs text-center text-gray-600 mt-1">（上位40%）</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="bg-green-50">
                    <CardTitle className="text-lg">法人内評価</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">合計点数</p>
                      <p className="text-2xl font-bold">{calculateTotal('corporate')} / 50点</p>
                      <p className="text-sm text-gray-600 mt-4">法人内順位</p>
                      <p className="text-lg font-semibold">一般看護師（2-3年目） 85名中 22位</p>
                      <div className="mt-4 p-3 bg-gray-100 rounded">
                        <p className="font-bold text-center text-xl">判定：A</p>
                        <p className="text-xs text-center text-gray-600 mt-1">（上位26%）</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-6">
                <CardHeader className="bg-orange-50">
                  <CardTitle className="text-center">総合評価</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-orange-600 mb-2">A</p>
                    <p className="text-sm text-gray-600">
                      施設内評価 B × 法人内評価 A = 総合評価 A
                    </p>
                    <div className="mt-4 p-4 bg-gray-50 rounded">
                      <p className="font-semibold mb-2">評価の解釈</p>
                      <p className="text-sm text-gray-700">
                        看護実践能力は法人内でも高水準にあり、着実に成長しています。
                        施設内でのリーダーシップ発揮に向けて、さらなる成長が期待されます。
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <Label htmlFor="special-adjustments">特別調整事項</Label>
                <Textarea 
                  id="special-adjustments" 
                  placeholder="資格取得（+0.5）、重大インシデント（-0.5）など"
                  className="min-h-[60px]"
                />
              </div>
            </TabsContent>

            {/* フィードバックタブ */}
            <TabsContent value="feedback" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">フィードバック</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="strengths">優れている点・強み</Label>
                  <Textarea 
                    id="strengths" 
                    placeholder="看護実践能力、患者対応、学習意欲など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="improvements">改善・成長が期待される点</Label>
                  <Textarea 
                    id="improvements" 
                    placeholder="リーダーシップ、多重課題対応など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="career-direction">今後のキャリア方向性</Label>
                  <Textarea 
                    id="career-direction" 
                    placeholder="中堅看護師に向けての成長課題、専門性の方向性など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="development-plan">次年度の育成計画</Label>
                  <Textarea 
                    id="development-plan" 
                    placeholder="研修受講、役割付与、プリセプター準備など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="evaluator-comment">評価者総評</Label>
                  <Textarea 
                    id="evaluator-comment" 
                    placeholder="2-3年目看護師としての成長度、今後への期待など"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="border-t pt-4">
                  <Label htmlFor="next-evaluation">次回評価予定日</Label>
                  <Input type="date" id="next-evaluation" />
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