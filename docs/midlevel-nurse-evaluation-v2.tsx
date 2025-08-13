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

export default function MidlevelNurseEvaluationV2() {
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
            中堅看護師（4-10年） 人事評価シート
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
              <TabsTrigger value="leadership">リーダーシップ</TabsTrigger>
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
                    <Input type="text" id="experience" placeholder="7年" />
                  </div>
                  <div>
                    <Label htmlFor="role">現在の役割</Label>
                    <Input type="text" id="role" placeholder="チームリーダー / プリセプター" />
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
                  リーダーシップ・影響力を中心に評価（各項目1-5点）
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-4">1. リーダーシップ（20点満点）</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f1-1" className="flex-1">チームリーダーとしての統率力</Label>
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
                      <Label htmlFor="f1-2" className="flex-1">問題解決・意思決定力</Label>
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
                      <Label htmlFor="f1-3" className="flex-1">部署内での影響力</Label>
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
                      <Label htmlFor="f1-4" className="flex-1">調整・連携能力</Label>
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
                  <h4 className="font-semibold mb-4">2. 後輩育成・指導力（20点満点）</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f2-1" className="flex-1">プリセプターとしての実績</Label>
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
                      <Label htmlFor="f2-2" className="flex-1">指導計画の立案・実施</Label>
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
                      <Label htmlFor="f2-3" className="flex-1">後輩の成長支援実績</Label>
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
                      <Label htmlFor="f2-4" className="flex-1">教育的視点での関わり</Label>
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
                  <h4 className="font-semibold mb-4">3. 業務改善・施設貢献（10点満点）</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f3-1" className="flex-1">改善提案の質と量</Label>
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
                      <Label htmlFor="f3-2" className="flex-1">委員会・プロジェクト貢献</Label>
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
                  専門性・実践力を中心に評価（各項目1-5点）
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-4">1. 高度看護実践（20点満点）</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="c1-1" className="flex-1">専門領域での実践力</Label>
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
                      <Label htmlFor="c1-2" className="flex-1">困難事例への対応力</Label>
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
                      <Label htmlFor="c1-3" className="flex-1">エビデンスに基づく実践</Label>
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
                      <Label htmlFor="c1-4" className="flex-1">臨床判断の的確性</Label>
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
                  <h4 className="font-semibold mb-4">2. 専門知識・技術（20点満点）</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="c2-1" className="flex-1">専門分野の知識深度</Label>
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
                      <Label htmlFor="c2-2" className="flex-1">最新知識の習得と活用</Label>
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
                      <Label htmlFor="c2-3" className="flex-1">高度技術の習得度</Label>
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
                      <Label htmlFor="c2-4" className="flex-1">資格取得・専門性向上</Label>
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
                  <h4 className="font-semibold mb-4">3. 教育・研究活動（10点満点）</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="c3-1" className="flex-1">院内教育への貢献</Label>
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
                      <Label htmlFor="c3-2" className="flex-1">研究・学会活動</Label>
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

            {/* リーダーシップタブ */}
            <TabsContent value="leadership" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">リーダーシップ実績・役割遂行</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">現在担っている役割</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox id="role-leader" />
                      <Label htmlFor="role-leader" className="ml-2">チームリーダー（頻度：　回/月）</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="role-preceptor" />
                      <Label htmlFor="role-preceptor" className="ml-2">プリセプター（指導人数：　名）</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="role-committee" />
                      <Label htmlFor="role-committee" className="ml-2">委員会メンバー（委員会名：　　　　）</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="role-project" />
                      <Label htmlFor="role-project" className="ml-2">プロジェクトリーダー</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="role-trainer" />
                      <Label htmlFor="role-trainer" className="ml-2">院内研修講師（回数：　回）</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="leadership-achievements">リーダーシップ発揮の具体例</Label>
                  <Textarea 
                    id="leadership-achievements" 
                    placeholder="チーム運営での工夫、問題解決事例、後輩育成の成果など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="mentoring-outcomes">後輩指導の成果</Label>
                  <Textarea 
                    id="mentoring-outcomes" 
                    placeholder="指導した後輩の成長、プリセプティの到達度など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3">専門性向上への取り組み</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox id="cert-prep" />
                      <Label htmlFor="cert-prep" className="ml-2">認定看護師資格取得準備中</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="cert-obtained" />
                      <Label htmlFor="cert-obtained" className="ml-2">認定看護師資格取得済</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="academic" />
                      <Label htmlFor="academic" className="ml-2">大学院進学・学位取得</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="conference" />
                      <Label htmlFor="conference" className="ml-2">学会発表・論文執筆</Label>
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
                      <p className="text-lg font-semibold">中堅看護師 32名中 5位</p>
                      <div className="mt-4 p-3 bg-gray-100 rounded">
                        <p className="font-bold text-center text-xl">判定：A</p>
                        <p className="text-xs text-center text-gray-600 mt-1">（上位16%）</p>
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
                      <p className="text-lg font-semibold">中堅看護師 156名中 28位</p>
                      <div className="mt-4 p-3 bg-gray-100 rounded">
                        <p className="font-bold text-center text-xl">判定：A</p>
                        <p className="text-xs text-center text-gray-600 mt-1">（上位18%）</p>
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
                    <p className="text-4xl font-bold text-orange-600 mb-2">A+</p>
                    <p className="text-sm text-gray-600">
                      施設内評価 A × 法人内評価 A = 総合評価 A+
                    </p>
                    <div className="mt-4 p-4 bg-gray-50 rounded">
                      <p className="font-semibold mb-2">評価の解釈</p>
                      <p className="text-sm text-gray-700">
                        施設内でも法人内でも高い評価を得ており、次期リーダー候補として期待されます。
                        管理職への道筋も視野に入れたキャリア開発が推奨されます。
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
                    placeholder="リーダーシップ、専門性、後輩育成など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="improvements">さらなる成長のための課題</Label>
                  <Textarea 
                    id="improvements" 
                    placeholder="管理能力、より高度な専門性など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="career-plan">推奨キャリアプラン</Label>
                  <Textarea 
                    id="career-plan" 
                    placeholder="管理職コース、専門看護師コース、教育者コースなど"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="development-support">必要な支援・機会</Label>
                  <Textarea 
                    id="development-support" 
                    placeholder="管理研修、認定看護師支援、メンタリングなど"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="evaluator-comment">評価者総評</Label>
                  <Textarea 
                    id="evaluator-comment" 
                    placeholder="中堅看護師としての総合評価、今後への期待など"
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