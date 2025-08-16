'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  User, Clock, Target, Heart, Brain, TrendingUp,
  ChevronRight, Save, Printer, CheckCircle, AlertTriangle,
  MessageSquare, FileText, Lightbulb, ArrowRight,
  Calendar, Settings, Award, BarChart3
} from 'lucide-react';
import { 
  InterviewSection, 
  InterviewResponse, 
  QuestionType,
  QuestionCategory 
} from '@/types/interview-question-master';

// セクションアイコンマップ
const getSectionIcon = (category: QuestionCategory) => {
  switch(category) {
    case 'adaptation': return User;
    case 'skills': return Award;
    case 'performance': return Target;
    case 'health': return Brain;
    case 'growth': return TrendingUp;
    case 'satisfaction': return Heart;
    case 'communication': return MessageSquare;
    case 'leadership': return Settings;
    case 'future': return Lightbulb;
    default: return User;
  }
};

// セクションカラークラスマップ（動的生成を避けるため静的に定義）
const getSectionColorClasses = (category: QuestionCategory, type: 'bg' | 'text' | 'border') => {
  const colorMap = {
    adaptation: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-500' },
    skills: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-500' },
    performance: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-500' },
    health: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-500' },
    growth: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-500' },
    satisfaction: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-500' },
    communication: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-500' },
    leadership: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-500' },
    future: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-500' }
  };
  
  return colorMap[category]?.[type] || { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-500' }[type];
};

interface ImprovedDigitalInterviewUIProps {
  sessionData: {
    staffName: string;
    department: string;
    position: string;
    facilityType: string;
    experienceYears: number;
    interviewDate: Date;
    interviewerName: string;
  };
  sections: InterviewSection[];
  onSave: (responses: InterviewResponse[]) => void;
  onComplete: (responses: InterviewResponse[]) => void;
}

// 5段階評価コンポーネント
const ScaleRating: React.FC<{
  questionId: string;
  label: string;
  lowLabel?: string;
  highLabel?: string;
  placeholder?: string;
  value?: number;
  comment?: string;
  onChange: (value: number, comment?: string) => void;
  required?: boolean;
}> = ({ 
  questionId, 
  label, 
  lowLabel = '低い', 
  highLabel = '高い', 
  placeholder = '詳細・具体例・改善提案などを記入...',
  value = 3,
  comment = '',
  onChange,
  required = false
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [localComment, setLocalComment] = useState(comment);

  const handleValueChange = (newValue: number) => {
    setLocalValue(newValue);
    onChange(newValue, localComment);
  };

  const handleCommentChange = (newComment: string) => {
    setLocalComment(newComment);
    onChange(localValue, newComment);
  };

  return (
    <div className="mb-6 p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      <h4 className="font-medium text-gray-800 mb-3 flex items-center">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </h4>
      
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-red-600 font-medium">{lowLabel}</span>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map(num => (
            <button
              key={num}
              onClick={() => handleValueChange(num)}
              className={`w-12 h-12 rounded-full border-2 font-semibold transition-all transform hover:scale-110 ${
                localValue === num
                  ? 'bg-blue-500 text-white border-blue-500 shadow-lg scale-110'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-300'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
        <span className="text-sm text-green-600 font-medium">{highLabel}</span>
      </div>
      
      <Textarea
        placeholder={placeholder}
        className="w-full p-3 border rounded-md text-sm resize-none focus:ring-2 focus:ring-blue-500"
        rows={3}
        value={localComment}
        onChange={(e) => handleCommentChange(e.target.value)}
      />
      
      {localValue <= 2 && (
        <div className="mt-2 p-2 bg-yellow-50 rounded text-sm text-yellow-800 flex items-start">
          <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
          <span>要サポート: 具体的な改善策を検討してください</span>
        </div>
      )}
      {localValue >= 4 && (
        <div className="mt-2 p-2 bg-green-50 rounded text-sm text-green-800 flex items-start">
          <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
          <span>良好: この調子を維持・向上させましょう</span>
        </div>
      )}
    </div>
  );
};

// オープン質問コンポーネント
const OpenQuestion: React.FC<{
  questionId: string;
  question: string;
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
  minRows?: number;
}> = ({ 
  questionId,
  question, 
  placeholder = '具体的にお答えください...',
  value = '',
  onChange,
  required = false,
  minRows = 4
}) => {
  return (
    <div className="mb-6 p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      <h4 className="font-medium text-gray-800 mb-3 flex items-center">
        {question}
        {required && <span className="text-red-500 ml-1">*</span>}
      </h4>
      <Textarea
        placeholder={placeholder}
        className="w-full p-3 border rounded-md text-sm resize-none focus:ring-2 focus:ring-blue-500"
        rows={minRows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="mt-2 text-xs text-gray-500 text-right">
        {value.length} 文字
      </div>
    </div>
  );
};

// チェックリスト質問コンポーネント（修正版）
const ChecklistQuestion: React.FC<{
  questionId: string;
  question: string;
  items: string[];
  selectedItems?: string[];
  onChange: (items: string[]) => void;
  allowComment?: boolean;
  comment?: string;
  onCommentChange?: (comment: string) => void;
}> = ({ 
  questionId,
  question, 
  items, 
  selectedItems = [],
  onChange,
  allowComment = true,
  comment = '',
  onCommentChange
}) => {
  const [localSelected, setLocalSelected] = useState<string[]>(selectedItems);

  const handleItemToggle = (item: string) => {
    const newItems = localSelected.includes(item)
      ? localSelected.filter(i => i !== item)
      : [...localSelected, item];
    setLocalSelected(newItems);
    onChange(newItems);
  };

  return (
    <div className="mb-6 p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      <h4 className="font-medium text-gray-800 mb-3">{question}</h4>
      <div className="grid grid-cols-2 gap-3 mb-3">
        {items.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50"
          >
            <Checkbox
              id={`${questionId}-${index}`}
              checked={localSelected.includes(item)}
              onCheckedChange={() => handleItemToggle(item)}
            />
            <label 
              htmlFor={`${questionId}-${index}`}
              className="text-sm cursor-pointer select-none flex-1"
            >
              {item}
            </label>
          </div>
        ))}
      </div>
      {allowComment && (
        <Textarea
          placeholder="その他、詳細があれば記入..."
          className="w-full p-3 border rounded-md text-sm resize-none"
          rows={2}
          value={comment}
          onChange={(e) => onCommentChange?.(e.target.value)}
        />
      )}
    </div>
  );
};

// メインコンポーネント
export default function ImprovedDigitalInterviewUIFixed({
  sessionData,
  sections,
  onSave,
  onComplete
}: ImprovedDigitalInterviewUIProps) {
  const [activeSection, setActiveSection] = useState(0);
  const [responses, setResponses] = useState<Map<string, InterviewResponse>>(new Map());
  const [startTime] = useState<Date>(new Date());
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);

  // セクションが存在しない場合のフォールバック
  if (!sections || sections.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-lg font-medium">面談セクションが設定されていません</p>
            <p className="text-sm text-gray-600 mt-2">システム管理者にお問い合わせください</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 自動保存機能
  useEffect(() => {
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    
    const timer = setTimeout(() => {
      handleAutoSave();
    }, 30000); // 30秒ごとに自動保存
    
    setAutoSaveTimer(timer);
    
    return () => {
      if (autoSaveTimer) clearTimeout(autoSaveTimer);
    };
  }, [responses]);

  const handleAutoSave = () => {
    const responseArray = Array.from(responses.values());
    onSave(responseArray);
    setLastSaved(new Date());
    setShowSaveIndicator(true);
    setTimeout(() => setShowSaveIndicator(false), 3000);
  };

  const updateResponse = (questionId: string, response: Partial<InterviewResponse>) => {
    const existing = responses.get(questionId) || {
      questionId,
      questionType: 'text' as QuestionType,
      answeredAt: new Date()
    };
    
    const updated = {
      ...existing,
      ...response,
      answeredAt: new Date()
    };
    
    const newResponses = new Map(responses);
    newResponses.set(questionId, updated as InterviewResponse);
    setResponses(newResponses);
  };

  const calculateProgress = () => {
    const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0);
    const answeredQuestions = responses.size;
    return totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
  };

  const getSectionProgress = (sectionIndex: number) => {
    const section = sections[sectionIndex];
    if (!section || !section.questions) return 0;
    const answeredInSection = section.questions.filter(q => responses.has(q)).length;
    return section.questions.length > 0 ? (answeredInSection / section.questions.length) * 100 : 0;
  };

  const handleComplete = () => {
    const responseArray = Array.from(responses.values());
    onComplete(responseArray);
  };

  const handleSectionChange = (newSection: number) => {
    if (newSection >= 0 && newSection < sections.length) {
      setActiveSection(newSection);
    }
  };

  const currentSection = sections[activeSection];
  if (!currentSection) {
    return null;
  }

  const SectionIcon = getSectionIcon(currentSection.category);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* ヘッダー */}
      <header className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <FileText className="mr-3 text-blue-600" size={28} />
              面談マニュアルシート - デジタル入力モード
            </h1>
            <p className="text-gray-600 mt-2">
              {sessionData.staffName} / {sessionData.department} / {sessionData.position}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {showSaveIndicator && (
              <div className="flex items-center text-green-600 animate-pulse">
                <CheckCircle className="mr-2" size={16} />
                <span className="text-sm">自動保存済み</span>
              </div>
            )}
            
            <div className="flex items-center text-gray-600">
              <Clock className="mr-2" size={16} />
              <span className="text-sm">
                経過時間: {Math.floor((new Date().getTime() - startTime.getTime()) / 60000)}分
              </span>
            </div>
            
            <Button 
              onClick={handleAutoSave}
              variant="outline"
              className="flex items-center"
            >
              <Save className="mr-2" size={16} />
              保存
            </Button>
            
            <Button 
              onClick={() => window.print()}
              variant="outline"
              className="flex items-center"
            >
              <Printer className="mr-2" size={16} />
              印刷
            </Button>
          </div>
        </div>
        
        {/* 全体進捗バー */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">全体進捗</span>
            <span className="text-sm font-medium">{Math.round(calculateProgress())}%</span>
          </div>
          <Progress value={calculateProgress()} className="h-2" />
        </div>
      </header>

      <div className="flex gap-6">
        {/* サイドナビゲーション */}
        <div className="w-72 bg-white rounded-lg shadow-sm h-fit sticky top-6">
          <div className="p-4 border-b">
            <h3 className="font-bold text-gray-800">面談セクション</h3>
            <p className="text-xs text-gray-500 mt-1">
              推定所要時間: {sections.reduce((sum, s) => sum + s.estimatedMinutes, 0)}分
            </p>
          </div>
          
          <ScrollArea className="h-[600px]">
            <nav className="p-2 space-y-1">
              {sections.map((section, index) => {
                const Icon = getSectionIcon(section.category);
                const progress = getSectionProgress(index);
                const isActive = activeSection === index;
                const bgColor = isActive ? getSectionColorClasses(section.category, 'bg') : '';
                const textColor = isActive ? getSectionColorClasses(section.category, 'text') : 'text-gray-600';
                const borderColor = isActive ? getSectionColorClasses(section.category, 'border') : '';
                
                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(index)}
                    className={`w-full flex items-center p-3 rounded-md text-left transition-all group ${
                      isActive
                        ? `${bgColor} ${textColor} border-l-4 ${borderColor}`
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Icon className="mr-3" size={18} />
                        <span className="font-medium text-sm">{section.title}</span>
                      </div>
                      <div className="ml-7 mt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {section.estimatedMinutes}分
                          </span>
                          {progress > 0 && (
                            <Badge 
                              variant={progress === 100 ? "default" : "outline"}
                              className="text-xs"
                            >
                              {Math.round(progress)}%
                            </Badge>
                          )}
                        </div>
                        {progress > 0 && (
                          <Progress value={progress} className="h-1 mt-1" />
                        )}
                      </div>
                    </div>
                    {progress === 100 && (
                      <CheckCircle className="ml-2 text-green-500" size={16} />
                    )}
                  </button>
                );
              })}
            </nav>
          </ScrollArea>
          
          <div className="p-4 border-t">
            <Button 
              onClick={handleComplete}
              className="w-full"
              disabled={calculateProgress() < 100}
            >
              <CheckCircle className="mr-2" size={16} />
              面談完了
            </Button>
          </div>
        </div>

        {/* メインコンテンツエリア */}
        <div className="flex-1">
          <Card>
            <CardHeader className={getSectionColorClasses(currentSection.category, 'bg')}>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <SectionIcon className={`mr-3 ${getSectionColorClasses(currentSection.category, 'text')}`} size={24} />
                  {currentSection.title}
                </div>
                <Badge variant="outline">
                  {activeSection + 1} / {sections.length}
                </Badge>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                {currentSection.description}
              </p>
            </CardHeader>
            
            <CardContent className="p-6">
              {/* セクション導入 */}
              {currentSection.sectionGuidance && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                    <MessageSquare className="mr-2" size={16} />
                    セクション開始時の確認
                  </h3>
                  <p className="text-sm text-blue-700">
                    {currentSection.sectionGuidance.introduction}
                  </p>
                  {currentSection.sectionGuidance.keyPoints && (
                    <ul className="mt-2 space-y-1">
                      {currentSection.sectionGuidance.keyPoints.map((point, index) => (
                        <li key={index} className="text-sm text-blue-600 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* 質問表示エリア */}
              <div className="space-y-6">
                <ScaleRating
                  questionId={`${currentSection.id}-q1`}
                  label="現在の業務へのモチベーションはどの程度ですか？"
                  lowLabel="非常に低い"
                  highLabel="非常に高い"
                  placeholder="モチベーションに影響している要因を具体的に記入してください..."
                  value={responses.get(`${currentSection.id}-q1`)?.scaleValue}
                  comment={responses.get(`${currentSection.id}-q1`)?.textValue}
                  onChange={(value, comment) => {
                    updateResponse(`${currentSection.id}-q1`, {
                      questionType: 'hybrid',
                      scaleValue: value,
                      textValue: comment
                    });
                  }}
                  required={true}
                />
                
                <ChecklistQuestion
                  questionId={`${currentSection.id}-q2`}
                  question="現在直面している課題を選択してください"
                  items={[
                    '業務量の多さ',
                    '人間関係',
                    'スキル不足',
                    'ワークライフバランス',
                    '評価・承認不足',
                    '将来への不安'
                  ]}
                  selectedItems={responses.get(`${currentSection.id}-q2`)?.checklistValues}
                  onChange={(items) => {
                    updateResponse(`${currentSection.id}-q2`, {
                      questionType: 'checklist',
                      checklistValues: items
                    });
                  }}
                  comment={responses.get(`${currentSection.id}-q2-comment`)?.textValue}
                  onCommentChange={(comment) => {
                    updateResponse(`${currentSection.id}-q2-comment`, {
                      questionType: 'text',
                      textValue: comment
                    });
                  }}
                />
                
                <OpenQuestion
                  questionId={`${currentSection.id}-q3`}
                  question="今後のキャリア目標について教えてください"
                  placeholder="3-5年後の理想像、身につけたいスキル、挑戦したい役割などを具体的に..."
                  value={responses.get(`${currentSection.id}-q3`)?.textValue}
                  onChange={(value) => {
                    updateResponse(`${currentSection.id}-q3`, {
                      questionType: 'text',
                      textValue: value
                    });
                  }}
                  required={true}
                />
              </div>

              {/* セクション終了・移行 */}
              {currentSection.sectionGuidance?.transitionPhrase && (
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {currentSection.sectionGuidance.transitionPhrase}
                  </p>
                </div>
              )}

              {/* ナビゲーションボタン */}
              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={() => handleSectionChange(activeSection - 1)}
                  disabled={activeSection === 0}
                >
                  前のセクション
                </Button>
                
                <Button
                  onClick={() => handleSectionChange(activeSection + 1)}
                  disabled={activeSection === sections.length - 1}
                >
                  次のセクション
                  <ChevronRight className="ml-2" size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 面談者用メモエリア */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MessageSquare className="mr-2 text-gray-600" size={20} />
                面談者メモ（内部用）
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="面談中の観察事項、非言語的な反応、フォローアップが必要な事項などを記録..."
                className="w-full"
                rows={4}
                onChange={(e) => {
                  updateResponse('interviewer-memo', {
                    questionType: 'text',
                    textValue: e.target.value
                  });
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* フッター */}
      <footer className="mt-8 bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div>
            <p>面談日: {sessionData.interviewDate.toLocaleDateString('ja-JP')}</p>
            <p>面談者: {sessionData.interviewerName}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span>施設: {sessionData.facilityType}</span>
            <span>│</span>
            <span>経験年数: {sessionData.experienceYears}年</span>
            {lastSaved && (
              <>
                <span>│</span>
                <span>最終保存: {lastSaved.toLocaleTimeString('ja-JP')}</span>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}