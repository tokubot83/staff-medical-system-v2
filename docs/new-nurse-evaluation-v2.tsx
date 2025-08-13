'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, Calculator } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

export default function NewNurseEvaluationV2() {
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
            新人看護師（1年目） 人事評価シート
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
              <TabsTrigger value="progress">成長記録</TabsTrigger>
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
                  <Input type="text" id="eval-period" placeholder="入職後3ヶ月 / 6ヶ月 / 12ヶ月" />
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
                    <Label htmlFor="department">配属部署</Label>
                    <Input type="text" id="department" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="hire-date">入職日</Label>
                    <Input type="date" id="hire-date" />
                  </div>
                  <div>
                    <Label htmlFor="preceptor">プリセプター名</Label>
                    <Input type="text" id="preceptor" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">評価者情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluator1">1次評価者（プリセプター）</Label>
                    <Input type="text" id="evaluator1" />
                  </div>
                  <div>
                    <Label htmlFor="evaluator2">2次評価者（主任・師長）</Label>
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
                  施設での適応度・チーム貢献を中心に評価（各項目1-5点）
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-4">1. 職場適応・勤務態度（20点満点）</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f1-1" className="flex-1">出勤状況・時間厳守</Label>
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
                      <Label htmlFor="f1-2" className="flex-1">職場ルールの遵守</Label>
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
                      <Label htmlFor="f1-3" className="flex-1">報告・連絡・相談の実践</Label>
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
                      <Label htmlFor="f1-4" className="flex-1">積極的な学習姿勢</Label>
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
                  <h4 className="font-semibold mb-4">2. チームワーク・協調性（15点満点）</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f2-1" className="flex-1">先輩・同僚との関係構築</Label>
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
                      <Label htmlFor="f2-2" className="flex-1">チーム活動への参加度</Label>
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
                      <Label htmlFor="f2-3" className="flex-1">協力的な態度</Label>
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
                  <h4 className="font-semibold mb-4">3. 施設への貢献度（15点満点）</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f3-1" className="flex-1">部署の雰囲気向上への貢献</Label>
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
                      <Label htmlFor="f3-2" className="flex-1">施設行事・活動への参加</Label>
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
                    <div className="flex items-center justify-between">
                      <Label htmlFor="f3-3" className="flex-1">同期の中でのリーダーシップ</Label>
                      <RadioGroup 
                        className="flex space-x-2"
                        onValueChange={(value) => setScores({...scores, facility: {...scores.facility, 'f3-3': value}})}
                      >
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="flex items-center">
                            <RadioGroupItem value={n.toString()} id={`f3-3-${n}`} />
                            <Label htmlFor={`f3-3-${n}`} className="ml-1">{n}</Label>
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
                  看護技術・知識の習得度を中心に評価（各項目1-5点）
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-4">1. 基礎看護技術（25点満点）</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="c1-1" className="flex-1">日常生活援助技術</Label>
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
                      <Label htmlFor="c1-2" className="flex-1">診療補助技術</Label>
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
                      <Label htmlFor="c1-3" className="flex-1">与薬・注射技術</Label>
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
                      <Label htmlFor="c1-4" className="flex-1">観察・アセスメント技術</Label>
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
                      <Label htmlFor="c1-5" className="flex-1">記録・報告の正確性</Label>
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
                  <h4 className="font-semibold mb-4">2. 医療安全・感染対策（15点満点）</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="c2-1" className="flex-1">安全確認行動の実践</Label>
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
                      <Label htmlFor="c2-2" className="flex-1">感染対策の実施</Label>
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
                      <Label htmlFor="c2-3" className="flex-1">インシデント防止への取り組み</Label>
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
                  <h4 className="font-semibold mb-4">3. 患者対応・コミュニケーション（10点満点）</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="c3-1" className="flex-1">患者・家族への接遇</Label>
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
                      <Label htmlFor="c3-2" className="flex-1">患者ニーズの把握と対応</Label>
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

            {/* 成長記録タブ */}
            <TabsContent value="progress" className="space-y-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-4">技術チェックリスト進捗</h3>
                <p className="text-sm text-gray-600 mb-4">
                  新人看護師技術チェックリストの習得状況
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { name: '環境調整技術', value: 80 },
                  { name: '食事援助技術', value: 90 },
                  { name: '排泄援助技術', value: 85 },
                  { name: '活動・休息援助技術', value: 75 },
                  { name: '清潔・衣生活援助技術', value: 88 },
                  { name: '呼吸・循環を整える技術', value: 70 },
                  { name: '創傷管理技術', value: 65 },
                  { name: '与薬の技術', value: 72 },
                  { name: '救命救急処置技術', value: 60 },
                  { name: '症状・生体機能管理技術', value: 78 }
                ].map(skill => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <Label>{skill.name}</Label>
                      <span className="text-sm font-medium">{skill.value}%</span>
                    </div>
                    <Progress value={skill.value} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <h4 className="font-semibold mb-2">総合進捗率</h4>
                  <p className="text-3xl font-bold text-blue-600">76%</p>
                </div>
              </div>

              <div>
                <Label htmlFor="progress-comment">進捗に関するコメント</Label>
                <Textarea 
                  id="progress-comment" 
                  placeholder="特に優れている技術、重点的に指導が必要な技術など"
                  className="min-h-[100px]"
                />
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
                      <p className="text-lg font-semibold">新人看護師 8名中 3位</p>
                      <div className="mt-4 p-3 bg-gray-100 rounded">
                        <p className="font-bold text-center text-xl">判定：A</p>
                        <p className="text-xs text-center text-gray-600 mt-1">（上位30%）</p>
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
                      <p className="text-lg font-semibold">新人看護師 42名中 15位</p>
                      <div className="mt-4 p-3 bg-gray-100 rounded">
                        <p className="font-bold text-center text-xl">判定：B</p>
                        <p className="text-xs text-center text-gray-600 mt-1">（上位40%）</p>
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
                      施設内評価 A × 法人内評価 B = 総合評価 A
                    </p>
                    <div className="mt-4 p-4 bg-gray-50 rounded">
                      <p className="font-semibold mb-2">評価の解釈</p>
                      <p className="text-sm text-gray-700">
                        施設への適応は良好で、基礎技術も標準的に習得できています。
                        今後も順調な成長が期待できる新人看護師です。
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
                    placeholder="積極的な学習姿勢、患者対応の丁寧さなど"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="improvements">改善が必要な点</Label>
                  <Textarea 
                    id="improvements" 
                    placeholder="技術面での課題、時間管理など"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="next-goals">次期目標（3ヶ月後）</Label>
                  <Textarea 
                    id="next-goals" 
                    placeholder="習得すべき技術、到達すべきレベルなど"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="support-plan">今後のサポート計画</Label>
                  <Textarea 
                    id="support-plan" 
                    placeholder="プリセプターとの関わり、研修計画など"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="evaluator-comment">評価者総評</Label>
                  <Textarea 
                    id="evaluator-comment" 
                    placeholder="新人看護師としての成長度、今後への期待など"
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