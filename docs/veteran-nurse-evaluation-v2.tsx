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
import { Checkbox } from "@/components/ui/checkbox";

export default function VeteranNurseEvaluationV2() {
  // 評価点数の状態管理
  const [scores, setScores] = useState({
    facility: {},
    corporate: {}
  });

  // 合計点数の計算
  const calculateTotal = (type) => {
    const typeScores = scores[type];
    return Object.values(typeScores).reduce((sum, score) => sum + (parseInt(score) || 0), 0);
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            ベテラン看護師（11年以上） 人事評価シート
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
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="facility-items">評価項目（施設）</TabsTrigger>
              <TabsTrigger value="corporate-items">評価項目（法人）</TabsTrigger>
              <TabsTrigger value="contribution">組織貢献</TabsTrigger>
              <TabsTrigger value="result">評価結果</TabsTrigger>
              <TabsTrigger value="succession">継承・育成</TabsTrigger>
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
                    <Input type="text" id="experience" placeholder="15年" />
                  </div>
                  <div>
                    <Label htmlFor="certifications">保有資格</Label>
                    <Input type="text" id="certifications" placeholder="認定看護師 / 専門看護師" />
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

            {/* 評価項目（施設）タブ */}
            <TabsContent value="facility-items" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">施設内評価項目</h3>
                <p className="text-sm text-gray-600 mb-4">
                  組織の要としての役割・影響力を中心に評価（各項目1-5点）
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-4">1. 組織への影響力（20点満点）</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f1-1" className="flex-1">組織文化の形成・維持への貢献</Label>
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
                      <Label htmlFor="f1-2" className="flex-1">部署横断的な調整・連携</Label>
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
                      <Label htmlFor="f1-3" className="flex-1">重要案件での相談役機能</Label>
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
                      <Label htmlFor="f1-4" className="flex-1">施設の代表としての活動</Label>
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
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-4">2. 知識・技術の継承（20点満点）</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f2-1" className="flex-1">後進育成の実績・成果</Label>
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
                      <Label htmlFor="f2-2" className="flex-1">暗黙知の形式知化</Label>
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
                      <Label htmlFor="f2-3" className="flex-1">教育プログラムへの貢献</Label>
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
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f2-4" className="flex-1">メンタリング・コーチング</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, facility: {...scores.facility, 'f2-4': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`f2-4-${n}`} />
                            <Label htmlFor={`f2-4-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-4">3. 施設運営への貢献（10点満点）</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f3-1" className="flex-1">重要委員会での中心的役割</Label>
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
                      <Label htmlFor="f3-2" className="flex-1">施設の質向上への貢献</Label>
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
                  エキスパートレベルの実践力・専門性を中心に評価（各項目1-5点）
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-4">1. エキスパート実践（20点満点）</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="c1-1" className="flex-1">最高難度の看護実践</Label>
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
                      <Label htmlFor="c1-2" className="flex-1">複雑事例の解決力</Label>
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
                      <Label htmlFor="c1-3" className="flex-1">イノベーティブな実践</Label>
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
                      <Label htmlFor="c1-4" className="flex-1">他施設からの相談対応</Label>
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
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-4">2. 専門性・学術貢献（20点満点）</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="c2-1" className="flex-1">専門分野での権威性</Label>
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
                      <Label htmlFor="c2-2" className="flex-1">認定・専門資格の活用</Label>
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
                      <Label htmlFor="c2-3" className="flex-1">研究・学会活動</Label>
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
                    <div className="flex items-center justify-between">
                      <Label htmlFor="c2-4" className="flex-1">外部講師・執筆活動</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, corporate: {...scores.corporate, 'c2-4': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`c2-4-${n}`} />
                            <Label htmlFor={`c2-4-${n}`} className="ml-1">{n}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-4">3. 法人への貢献（10点満点）</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="c3-1" className="flex-1">法人看護の質向上への貢献</Label>
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
                      <Label htmlFor="c3-2" className="flex-1">法人ブランド向上への貢献</Label>
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

            {/* 組織貢献タブ */}
            <TabsContent value="contribution" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">組織貢献実績</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">1. 教育・人材育成実績</h4>
                  <Textarea 
                    placeholder="プリセプター実績（延べ人数）、研修講師実績、実習指導実績など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. 委員会・プロジェクト活動</h4>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center">
                      <Checkbox id="committee-chair" />
                      <Label htmlFor="committee-chair" className="ml-2">委員会委員長（委員会名：　　　　）</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="project-leader" />
                      <Label htmlFor="project-leader" className="ml-2">重要プロジェクトリーダー</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="quality-leader" />
                      <Label htmlFor="quality-leader" className="ml-2">医療の質改善活動リーダー</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="safety-leader" />
                      <Label htmlFor="safety-leader" className="ml-2">医療安全推進リーダー</Label>
                    </div>
                  </div>
                  <Textarea 
                    placeholder="具体的な活動内容と成果"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. 専門性による貢献</h4>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center">
                      <Checkbox id="certified-active" />
                      <Label htmlFor="certified-active" className="ml-2">認定看護師として活動</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="specialist-active" />
                      <Label htmlFor="specialist-active" className="ml-2">専門看護師として活動</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="external-activity" />
                      <Label htmlFor="external-activity" className="ml-2">院外講師・学会役員</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="publication" />
                      <Label htmlFor="publication" className="ml-2">論文・著書執筆</Label>
                    </div>
                  </div>
                  <Textarea 
                    placeholder="専門性を活かした具体的な活動と成果"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3">4. 長年の経験による独自の貢献</h4>
                  <Textarea 
                    placeholder="組織の歴史継承、困難事例の解決、若手のメンタルサポートなど"
                    className="min-h-[100px]"
                  />
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
                      <p className="text-lg font-semibold">ベテラン看護師 18名中 2位</p>
                      <div className="mt-4 p-3 bg-gray-100 rounded">
                        <p className="font-bold text-center text-xl">判定：S</p>
                        <p className="text-xs text-center text-gray-600 mt-1">（上位10%）</p>
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
                      <p className="text-lg font-semibold">ベテラン看護師 92名中 12位</p>
                      <div className="mt-4 p-3 bg-gray-100 rounded">
                        <p className="font-bold text-center text-xl">判定：A</p>
                        <p className="text-xs text-center text-gray-600 mt-1">（上位13%）</p>
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
                    <p className="text-4xl font-bold text-orange-600 mb-2">S</p>
                    <p className="text-sm text-gray-600">
                      施設内評価 S × 法人内評価 A = 総合評価 S
                    </p>
                    <div className="mt-4 p-4 bg-gray-50 rounded">
                      <p className="font-semibold mb-2">評価の解釈</p>
                      <p className="text-sm text-gray-700">
                        組織にとって極めて重要な人材です。施設の要として、また法人全体でも
                        高い専門性を持つエキスパートとして、今後も組織の発展に不可欠な存在です。
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

            {/* 継承・育成タブ */}
            <TabsContent value="succession" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">知識・技術継承計画</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="unique-knowledge">保有する独自の知識・技術・ノウハウ</Label>
                  <Textarea 
                    id="unique-knowledge" 
                    placeholder="長年の経験で培った特殊技術、暗黙知、独自の判断基準など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="succession-priority">優先的に継承すべき内容</Label>
                  <Textarea 
                    id="succession-priority" 
                    placeholder="組織として失われると困る知識・技術、特殊な対応方法など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="succession-plan">継承計画（1-2年）</Label>
                  <Textarea 
                    id="succession-plan" 
                    placeholder="マニュアル作成、動画教材、OJT計画、勉強会開催など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="successor">後継者育成状況</Label>
                  <Textarea 
                    id="successor" 
                    placeholder="後継者候補の氏名、現在の育成進捗など"
                    className="min-h-[60px]"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3">今後の働き方・活用方針</h4>
                  <RadioGroup>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="expert" id="future-expert" />
                        <Label htmlFor="future-expert">エキスパートとして専門性を最大活用</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="educator" id="future-educator" />
                        <Label htmlFor="future-educator">教育専任として後進育成に専念</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="advisor" id="future-advisor" />
                        <Label htmlFor="future-advisor">アドバイザー・相談役として活用</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="flexible" id="future-flexible" />
                        <Label htmlFor="future-flexible">柔軟な勤務形態での継続雇用</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="motivation-plan">モチベーション維持・活性化計画</Label>
                  <Textarea 
                    id="motivation-plan" 
                    placeholder="新たなチャレンジ機会、特別プロジェクト、待遇面での配慮など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="evaluator-comment">評価者総評</Label>
                  <Textarea 
                    id="evaluator-comment" 
                    placeholder="ベテラン看護師としての価値、今後の期待、組織への提言など"
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