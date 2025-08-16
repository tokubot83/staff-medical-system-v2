'use client';

import React, { useState, useEffect } from 'react';
import {
  User, Calendar, Clock, Target, Heart, Brain,
  CheckCircle, AlertTriangle, ChevronRight, Star,
  TrendingUp, MessageSquare, FileText, Settings,
  Award, Lightbulb, ArrowRight, Plus, Minus,
  Save, Printer, RefreshCw, Edit3, Building,
  Users, Briefcase, GraduationCap, Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  GeneratedInterviewSheet, 
  InterviewSectionInstance,
  InterviewQuestionInstance,
  StaffProfile,
  MotivationType 
} from '@/lib/interview-bank/types-extended';

interface DynamicInterviewSheetProps {
  sheetData: GeneratedInterviewSheet;
  staffProfile: StaffProfile;
  onSave?: (data: any) => void;
  onPrint?: () => void;
  readOnly?: boolean;
}

export default function DynamicInterviewSheet({ 
  sheetData, 
  staffProfile,
  onSave,
  onPrint,
  readOnly = false 
}: DynamicInterviewSheetProps) {
  const [activeSection, setActiveSection] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [completionStatus, setCompletionStatus] = useState<Record<string, boolean>>({});
  const [motivationType, setMotivationType] = useState<MotivationType | null>(null);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

  // 回答を更新
  const updateResponse = (sectionId: string, questionId: string, value: any) => {
    if (readOnly) return;
    
    setResponses(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [questionId]: value
      }
    }));

    // 自動保存（3秒後）
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    const timer = setTimeout(() => {
      handleAutoSave();
    }, 3000);
    setAutoSaveTimer(timer);
  };

  // 自動保存
  const handleAutoSave = () => {
    if (onSave) {
      onSave({
        responses,
        motivationType,
        status: 'draft',
        timestamp: new Date()
      });
    }
  };

  // セクションの完了状況を確認
  const checkSectionCompletion = (section: InterviewSectionInstance) => {
    const sectionResponses = responses[section.sectionId] || {};
    const requiredQuestions = section.questions.filter(q => q.required);
    const answered = requiredQuestions.filter(q => 
      sectionResponses[q.questionId] !== undefined && 
      sectionResponses[q.questionId] !== ''
    );
    return answered.length === requiredQuestions.length;
  };

  // 全体の進捗率を計算
  const calculateProgress = () => {
    const totalSections = sheetData.sections.length;
    const completedSections = Object.values(completionStatus).filter(Boolean).length;
    return Math.round((completedSections / totalSections) * 100);
  };

  // スケール評価コンポーネント
  const ScaleRating = ({ question, section }: { 
    question: InterviewQuestionInstance, 
    section: InterviewSectionInstance 
  }) => {
    const currentValue = responses[section.sectionId]?.[question.questionId] || 3;
    
    return (
      <div className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
        <Label className="font-medium text-gray-800 mb-3 block">
          {question.content}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-red-600">低い</span>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map(num => (
              <button
                key={num}
                onClick={() => updateResponse(section.sectionId, question.questionId, num)}
                disabled={readOnly}
                className={`w-10 h-10 rounded-full border-2 font-medium transition-all ${
                  currentValue === num
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-blue-300'
                } ${readOnly ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              >
                {num}
              </button>
            ))}
          </div>
          <span className="text-sm text-green-600">高い</span>
        </div>
        <Textarea
          placeholder={question.placeholder || "詳細・具体例・改善提案などを記入..."}
          className="w-full resize-none"
          rows={3}
          disabled={readOnly}
          value={responses[section.sectionId]?.[`${question.questionId}_comment`] || ''}
          onChange={(e) => updateResponse(section.sectionId, `${question.questionId}_comment`, e.target.value)}
        />
      </div>
    );
  };

  // テキストエリア質問コンポーネント
  const TextAreaQuestion = ({ question, section }: { 
    question: InterviewQuestionInstance, 
    section: InterviewSectionInstance 
  }) => {
    return (
      <div className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
        <Label className="font-medium text-gray-800 mb-3 block">
          {question.content}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Textarea
          placeholder={question.placeholder || "回答を入力してください..."}
          className="w-full resize-none"
          rows={4}
          disabled={readOnly}
          value={responses[section.sectionId]?.[question.questionId] || ''}
          onChange={(e) => updateResponse(section.sectionId, question.questionId, e.target.value)}
        />
      </div>
    );
  };

  // ラジオボタン質問コンポーネント
  const RadioQuestion = ({ question, section }: { 
    question: InterviewQuestionInstance, 
    section: InterviewSectionInstance 
  }) => {
    return (
      <div className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
        <Label className="font-medium text-gray-800 mb-3 block">
          {question.content}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <RadioGroup
          disabled={readOnly}
          value={responses[section.sectionId]?.[question.questionId] || ''}
          onValueChange={(value) => updateResponse(section.sectionId, question.questionId, value)}
        >
          {question.options?.map(option => (
            <div key={option.value} className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value={option.value} id={`${question.questionId}-${option.value}`} />
              <Label htmlFor={`${question.questionId}-${option.value}`} className="cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  };

  // チェックボックス質問コンポーネント
  const CheckboxQuestion = ({ question, section }: { 
    question: InterviewQuestionInstance, 
    section: InterviewSectionInstance 
  }) => {
    const selectedValues = responses[section.sectionId]?.[question.questionId] || [];
    
    const handleCheckboxChange = (value: string, checked: boolean) => {
      const newValues = checked 
        ? [...selectedValues, value]
        : selectedValues.filter((v: string) => v !== value);
      updateResponse(section.sectionId, question.questionId, newValues);
    };

    return (
      <div className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
        <Label className="font-medium text-gray-800 mb-3 block">
          {question.content}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <div className="space-y-2">
          {question.options?.map(option => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`${question.questionId}-${option.value}`}
                checked={selectedValues.includes(option.value)}
                onCheckedChange={(checked) => handleCheckboxChange(option.value, checked as boolean)}
                disabled={readOnly}
              />
              <Label 
                htmlFor={`${question.questionId}-${option.value}`} 
                className="cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 質問タイプに応じたコンポーネントを返す
  const renderQuestion = (question: InterviewQuestionInstance, section: InterviewSectionInstance) => {
    switch (question.type) {
      case 'scale':
        return <ScaleRating key={question.questionId} question={question} section={section} />;
      case 'textarea':
        return <TextAreaQuestion key={question.questionId} question={question} section={section} />;
      case 'radio':
        return <RadioQuestion key={question.questionId} question={question} section={section} />;
      case 'checkbox':
        return <CheckboxQuestion key={question.questionId} question={question} section={section} />;
      case 'text':
        return (
          <div key={question.questionId} className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
            <Label className="font-medium text-gray-800 mb-3 block">
              {question.content}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              type="text"
              placeholder={question.placeholder || "回答を入力してください..."}
              disabled={readOnly}
              value={responses[section.sectionId]?.[question.questionId] || ''}
              onChange={(e) => updateResponse(section.sectionId, question.questionId, e.target.value)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  // セクション完了状況の更新
  useEffect(() => {
    const newStatus: Record<string, boolean> = {};
    sheetData.sections.forEach(section => {
      newStatus[section.sectionId] = checkSectionCompletion(section);
    });
    setCompletionStatus(newStatus);
  }, [responses]);

  // セクションアイコンを取得
  const getSectionIcon = (sectionType: string) => {
    const iconMap: Record<string, any> = {
      'motivation_assessment': Brain,
      'current_status': Activity,
      'skill_evaluation': Target,
      'goal_setting': Award,
      'support_planning': Users,
      'career_development': TrendingUp,
      'team_environment': Users,
      'health_wellbeing': Heart,
      'feedback_reflection': MessageSquare,
      'action_plan': ArrowRight
    };
    return iconMap[sectionType] || FileText;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* ヘッダー */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center">
                <FileText className="mr-3 text-blue-600" size={28} />
                定期面談シート - {staffProfile.name}
              </CardTitle>
              <div className="text-sm text-gray-600 mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p><strong>部署:</strong> {staffProfile.department}</p>
                  <p><strong>職種:</strong> {staffProfile.profession}</p>
                  <p><strong>役職:</strong> {staffProfile.position.name}</p>
                </div>
                <div>
                  <p><strong>経験年数:</strong> {staffProfile.experienceYears}年{staffProfile.experienceMonths}ヶ月</p>
                  <p><strong>面談日:</strong> {sheetData.params?.interviewDate ? new Date(sheetData.params.interviewDate).toLocaleDateString('ja-JP') : new Date().toLocaleDateString('ja-JP')}</p>
                  <p><strong>所要時間:</strong> {sheetData.params?.duration || 30}分</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={onSave} disabled={readOnly}>
                <Save className="mr-2" size={16} />
                保存
              </Button>
              <Button onClick={onPrint} variant="outline">
                <Printer className="mr-2" size={16} />
                印刷
              </Button>
            </div>
          </div>
          <Progress value={calculateProgress()} className="mt-4" />
          <p className="text-sm text-gray-600 mt-2">
            進捗: {calculateProgress()}% 完了
          </p>
        </CardHeader>
      </Card>

      <div className="flex gap-6">
        {/* サイドナビゲーション */}
        <div className="w-64">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">面談項目</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1 p-4">
                {sheetData.sections.map((section, index) => {
                  const Icon = getSectionIcon(section.type);
                  const isComplete = completionStatus[section.sectionId];
                  
                  return (
                    <button
                      key={section.sectionId}
                      onClick={() => setActiveSection(index)}
                      className={`w-full flex items-center p-3 rounded-md text-left transition-all ${
                        activeSection === index
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="mr-3 flex-shrink-0" size={18} />
                      <span className="flex-1">{section.name}</span>
                      {isComplete && (
                        <CheckCircle className="text-green-500 flex-shrink-0" size={16} />
                      )}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>

          {/* スタッフ情報サマリー */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <User className="mr-2" size={18} />
                スタッフ情報
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="font-medium">施設:</span>
                <span className="ml-2">{staffProfile.facility}</span>
              </div>
              <div>
                <span className="font-medium">入職日:</span>
                <span className="ml-2">
                  {new Date(staffProfile.hireDate).toLocaleDateString('ja-JP')}
                </span>
              </div>
              <div>
                <span className="font-medium">経験レベル:</span>
                <span className="ml-2">
                  {staffProfile.experienceLevel === 'new' && '新人'}
                  {staffProfile.experienceLevel === 'junior' && '若手'}
                  {staffProfile.experienceLevel === 'midlevel' && '中堅'}
                  {staffProfile.experienceLevel === 'veteran' && 'ベテラン'}
                </span>
              </div>
              {staffProfile.licenses.length > 0 && (
                <div>
                  <span className="font-medium">資格:</span>
                  <div className="ml-2 mt-1">
                    {staffProfile.licenses.map((license, index) => (
                      <span key={index} className="inline-block bg-gray-100 rounded px-2 py-1 text-xs mr-1 mb-1">
                        {license}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {React.createElement(getSectionIcon(sheetData.sections[activeSection].type), {
                  className: "mr-3 text-blue-600",
                  size: 24
                })}
                {sheetData.sections[activeSection].name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* 動機タイプ判定セクションの特別処理 */}
              {sheetData.sections[activeSection].type === 'motivation_assessment' && (
                <Alert className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    この職員の動機タイプを理解することで、より効果的なマネジメントと支援が可能になります。
                  </AlertDescription>
                </Alert>
              )}

              {/* 質問の表示 */}
              <div className="space-y-4">
                {sheetData.sections[activeSection].questions.map(question => 
                  renderQuestion(question, sheetData.sections[activeSection])
                )}
              </div>

              {/* ナビゲーションボタン */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                  disabled={activeSection === 0}
                >
                  <ChevronRight className="mr-2 rotate-180" size={16} />
                  前のセクション
                </Button>
                <Button
                  onClick={() => setActiveSection(Math.min(sheetData.sections.length - 1, activeSection + 1))}
                  disabled={activeSection === sheetData.sections.length - 1}
                >
                  次のセクション
                  <ChevronRight className="ml-2" size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* コンテキストヘルプ */}
          {sheetData.sections[activeSection].type === 'skill_evaluation' && (
            <Alert className="mt-4">
              <AlertDescription>
                <strong>評価のポイント:</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• 具体的な事例を思い出しながら評価してください</li>
                  <li>• 前回面談からの変化に注目してください</li>
                  <li>• 強みと改善点の両方を記録してください</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {sheetData.sections[activeSection].type === 'health_wellbeing' && (
            <Alert className="mt-4" variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>要注意サイン:</strong>
                健康状態やストレスレベルに問題がある場合は、速やかに産業医や専門家への相談を検討してください。
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* フッター */}
      <Card className="mt-8">
        <CardContent className="p-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>
              <p>{staffProfile.facility} 人事部</p>
              <p>定期面談システム v3.0 - 動的生成版</p>
            </div>
            <div className="flex items-center space-x-4">
              <span>質問数: {sheetData.totalQuestions}問</span>
              <span>│</span>
              <span>推定時間: {sheetData.estimatedDuration}分</span>
              <span>│</span>
              <span>最終保存: {new Date().toLocaleTimeString('ja-JP')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}