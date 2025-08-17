'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock, Target, Users, Brain, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  InterviewSheetTemplate,
  InterviewSection,
  generateSheetTitle,
  calculateTimeAllocation
} from '../shared/types';
import {
  createMotivationDiagnosisSection,
  createCoreQuestions,
  createWorkEnvironmentSection,
  createGoalSettingSection
} from '../shared/templates';

export default function NewNurse30MinInterviewSheet() {
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [motivationScores, setMotivationScores] = useState<Record<string, number>>({});

  // 面談シート設定
  const sheetConfig: InterviewSheetTemplate = {
    metadata: {
      version: 'v6',
      professionType: 'nurse',
      experienceLevel: 'new',
      duration: 30,
      includesMotivationDiagnosis: true,
      createdAt: new Date()
    },
    title: generateSheetTitle('nurse', 'new', 30),
    description: '新人看護師（1年目）の定期面談シート。動機タイプ診断を含み、職場適応と基礎スキル習得を重点的に確認します。',
    sections: [
      {
        id: 'opening',
        title: 'オープニング',
        timeAllocation: 3,
        questions: [
          {
            id: 'greeting',
            content: '本日の体調はいかがですか？リラックスして話してくださいね。',
            type: 'open'
          }
        ]
      },
      createMotivationDiagnosisSection(30),
      {
        id: 'skill_acquisition',
        title: '業務習得状況',
        timeAllocation: 8,
        questions: createCoreQuestions('new')
      },
      createWorkEnvironmentSection(30),
      {
        id: 'stress_management',
        title: 'ストレス・メンタルヘルス',
        timeAllocation: 6,
        questions: [
          {
            id: 'stress_level',
            content: '現在のストレスレベルはどの程度ですか？',
            type: 'scale',
            scaleMin: 1,
            scaleMax: 5,
            scaleLabels: ['低い', 'やや低い', '普通', 'やや高い', '高い'],
            required: true
          },
          {
            id: 'stress_factors',
            content: 'ストレスを感じる主な要因は何ですか？',
            type: 'open'
          },
          {
            id: 'coping_methods',
            content: 'ストレス解消法や気分転換の方法はありますか？',
            type: 'open'
          }
        ]
      },
      createGoalSettingSection('new'),
      {
        id: 'closing',
        title: 'クロージング',
        timeAllocation: 3,
        questions: [
          {
            id: 'additional_comments',
            content: '他に相談したいことや伝えたいことはありますか？',
            type: 'open'
          },
          {
            id: 'next_interview',
            content: '次回の面談で重点的に話したいテーマはありますか？',
            type: 'open'
          }
        ]
      }
    ],
    totalDuration: 30
  };

  const timeAllocation = calculateTimeAllocation(30, true);
  const totalSections = sheetConfig.sections.length;

  // 動機タイプ診断の回答を処理
  const handleMotivationResponse = (questionId: string, value: string) => {
    const section = sheetConfig.sections.find(s => s.isMotivationDiagnosis);
    const question = section?.questions.find(q => q.id === questionId);
    const selected = question?.motivationOptions?.find(opt => opt.value === value);
    
    if (selected?.motivationPoints) {
      const newScores = { ...motivationScores };
      Object.entries(selected.motivationPoints).forEach(([type, points]) => {
        newScores[type] = (newScores[type] || 0) + points;
      });
      setMotivationScores(newScores);
    }
    
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  // 通常の回答を保存
  const handleResponse = (questionId: string, value: any) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  // 最も高い動機タイプを取得
  const getTopMotivationType = () => {
    if (Object.keys(motivationScores).length === 0) return null;
    
    const sorted = Object.entries(motivationScores).sort((a, b) => b[1] - a[1]);
    const typeLabels: Record<string, string> = {
      achievement: '達成動機',
      affiliation: '親和動機',
      power: '権力動機',
      autonomy: '自律動機',
      security: '安定動機',
      growth: '成長動機',
      contribution: '貢献動機',
      recognition: '承認動機'
    };
    
    return {
      type: sorted[0][0],
      label: typeLabels[sorted[0][0]],
      score: sorted[0][1]
    };
  };

  const progress = ((currentSection + 1) / totalSections) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                {sheetConfig.title}
                <Badge variant="secondary" className="ml-2">v6</Badge>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">{sheetConfig.description}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{sheetConfig.totalDuration}分</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date().toLocaleDateString('ja-JP')}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4">
          {/* 進捗バー */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>セクション {currentSection + 1} / {totalSections}</span>
              <span>{Math.round(progress)}% 完了</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* 面談者情報 */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label>面談対象者</Label>
              <input 
                type="text" 
                className="w-full mt-1 p-2 border rounded"
                placeholder="氏名を入力"
              />
            </div>
            <div>
              <Label>面談実施者</Label>
              <input 
                type="text" 
                className="w-full mt-1 p-2 border rounded"
                placeholder="氏名を入力"
              />
            </div>
            <div>
              <Label>所属部署</Label>
              <input 
                type="text" 
                className="w-full mt-1 p-2 border rounded"
                placeholder="部署名を入力"
              />
            </div>
            <div>
              <Label>入職年月</Label>
              <input 
                type="month" 
                className="w-full mt-1 p-2 border rounded"
              />
            </div>
          </div>

          {/* 現在のセクション */}
          <Card className="border-l-4 border-blue-500">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {currentSection === 1 && <Brain className="h-5 w-5 text-blue-600" />}
                {currentSection === 2 && <Target className="h-5 w-5 text-green-600" />}
                {currentSection === 3 && <Users className="h-5 w-5 text-purple-600" />}
                {currentSection === 5 && <TrendingUp className="h-5 w-5 text-orange-600" />}
                {sheetConfig.sections[currentSection].title}
                <Badge variant="outline" className="ml-2">
                  {sheetConfig.sections[currentSection].timeAllocation}分
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {sheetConfig.sections[currentSection].questions.map((question, qIndex) => (
                <div key={question.id} className="space-y-3">
                  <Label className="text-base font-medium">
                    {qIndex + 1}. {question.content}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  
                  {/* 動機タイプ診断の質問 */}
                  {question.type === 'motivation' && question.motivationOptions && (
                    <RadioGroup
                      value={responses[question.id] || ''}
                      onValueChange={(value) => handleMotivationResponse(question.id, value)}
                    >
                      {question.motivationOptions.map(option => (
                        <div key={option.value} className="flex items-start space-x-2 p-3 rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value={option.value} id={`${question.id}_${option.value}`} />
                          <Label 
                            htmlFor={`${question.id}_${option.value}`} 
                            className="cursor-pointer flex-1"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                  
                  {/* テキスト入力 */}
                  {question.type === 'open' && (
                    <Textarea
                      value={responses[question.id] || ''}
                      onChange={(e) => handleResponse(question.id, e.target.value)}
                      placeholder="回答を入力してください"
                      className="min-h-[100px]"
                    />
                  )}
                  
                  {/* スケール評価 */}
                  {question.type === 'scale' && (
                    <div>
                      <RadioGroup
                        value={responses[question.id]?.toString() || ''}
                        onValueChange={(value) => handleResponse(question.id, parseInt(value))}
                        className="flex justify-between"
                      >
                        {Array.from(
                          { length: (question.scaleMax || 5) - (question.scaleMin || 1) + 1 },
                          (_, i) => (question.scaleMin || 1) + i
                        ).map((value, index) => (
                          <div key={value} className="flex flex-col items-center">
                            <RadioGroupItem value={value.toString()} id={`${question.id}_${value}`} />
                            <Label 
                              htmlFor={`${question.id}_${value}`} 
                              className="mt-2 text-xs text-center cursor-pointer"
                            >
                              {question.scaleLabels?.[index] || value}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}
                </div>
              ))}
              
              {/* 動機タイプ診断結果（診断セクション完了時） */}
              {currentSection === 1 && getTopMotivationType() && (
                <Alert className="bg-blue-50 border-blue-200">
                  <Brain className="h-4 w-4" />
                  <AlertDescription>
                    <strong>動機タイプ診断結果：</strong>
                    <span className="ml-2 font-semibold text-blue-700">
                      {getTopMotivationType()?.label}型
                    </span>
                    <p className="text-sm mt-2">
                      この結果を参考に、より効果的な育成方針を検討しましょう。
                    </p>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* ナビゲーションボタン */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
              disabled={currentSection === 0}
            >
              前のセクション
            </Button>
            
            {currentSection < totalSections - 1 ? (
              <Button
                onClick={() => setCurrentSection(currentSection + 1)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                次のセクション
              </Button>
            ) : (
              <Button
                onClick={() => {
                  console.log('面談完了', { responses, motivationScores });
                  alert('面談シートが保存されました');
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                面談を完了
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}