'use client';

import React, { useState, useEffect } from 'react';
import {
  User, Calendar, Clock, Target, Heart, Brain,
  CheckCircle, AlertTriangle, ChevronRight, Star,
  TrendingUp, MessageSquare, FileText, Settings,
  Award, Lightbulb, ArrowRight, Plus, Minus,
  Save, Printer, RefreshCw, Edit3, Building,
  Users, Briefcase, GraduationCap, Activity, AlertCircle,
  ArrowRightLeft
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
  sheetData: GeneratedInterviewSheet | any; // GeneratedBankSheetも受け入れる
  staffProfile: StaffProfile;
  onSave?: (data: any) => void;
  onPrint?: () => void;
  readOnly?: boolean;
  // 前回面談比較用
  currentInterviewType?: string;
}

export default function DynamicInterviewSheet({ 
  sheetData, 
  staffProfile,
  onSave,
  onPrint,
  readOnly = false,
  currentInterviewType
}: DynamicInterviewSheetProps) {
  const [activeSection, setActiveSection] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [completionStatus, setCompletionStatus] = useState<Record<string, boolean>>({});
  const [motivationType, setMotivationType] = useState<MotivationType | null>(null);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [previousInterviewData, setPreviousInterviewData] = useState<any>(null);
  const [comparisonActiveSection, setComparisonActiveSection] = useState(0);
  const [isComparisonEnabled, setIsComparisonEnabled] = useState(false);
  
  // GeneratedBankSheetからGeneratedInterviewSheetに変換
  const normalizedSheetData = React.useMemo(() => {
    // GeneratedBankSheetの場合の変換処理
    if (!sheetData.sections?.[0]?.sectionId) {
      return {
        ...sheetData,
        sections: sheetData.sections.map((section: any, index: number) => ({
          sectionId: section.id || `section_${index}`,
          name: section.title || section.name,
          description: section.description,
          type: section.type || 'general',
          questions: section.questions.map((q: any) => ({
            questionId: q.id,
            content: q.text || q.content || q.question,
            type: q.type,
            required: q.isRequired || q.required || false,
            placeholder: q.placeholder,
            options: q.options?.map((opt: any) => 
              typeof opt === 'string' 
                ? { value: opt, label: opt }
                : opt
            ),
            // hybrid質問用の追加フィールド
            scaleLabel: q.scaleLabel,
            textLabel: q.textLabel,
            textPlaceholder: q.textPlaceholder,
            isReadOnly: q.isReadOnly,
            defaultValue: q.defaultValue
          }))
        }))
      };
    }
    return sheetData;
  }, [sheetData]);

  // デモデータのLocalStorage保存
  useEffect(() => {
    const initializeDemoData = () => {
      const storageKey = 'staff_medical_interview_data';
      const existingData = localStorage.getItem(storageKey);
      // 新しいデモデータを強制的に読み込み（開発用）
      const forceRefresh = !existingData || existingData.includes('STAFF_001');
      if (forceRefresh) {
        console.log('🔄 LocalStorageをリフレッシュして新しいデモデータを読み込みます');
        // デモデータをインポートして保存
        import('@/data/demoInterviewData').then(({ demoInterviewData }) => {
          // デモデータをLocalStorage用の形式に変換
          const convertedData = demoInterviewData.map(interview => ({
            id: interview.id,
            staffId: interview.staffId,
            staffName: interview.staffName,
            interviewType: interview.interviewType,
            status: interview.status,
            completedAt: interview.actualDate || interview.metadata?.updatedAt?.toISOString(),
            createdAt: interview.scheduledDate || interview.metadata?.createdAt?.toISOString(),
            duration: interview.duration,
            responses: interview.sheetData,
            summary: interview.summary,
            keyPoints: interview.keyPoints
          }));
          console.log('🎆 デモデータをLocalStorageに保存:', convertedData.length, '件');
          console.log('📄 変換後データ:', convertedData);
          localStorage.setItem(storageKey, JSON.stringify(convertedData));
        });
      }
    };
    initializeDemoData();
  }, []);

  // 前回面談データ取得
  useEffect(() => {
    if (isComparisonEnabled && staffProfile.id && currentInterviewType) {
      fetchPreviousInterviewData();
    }
  }, [isComparisonEnabled, staffProfile.id, currentInterviewType]);

  // セクション同期機能 - 現在のセクションが変わったら前回面談側も同じセクションに移動
  useEffect(() => {
    if (isComparisonEnabled && previousInterviewData) {
      setComparisonActiveSection(activeSection);
      // 前回データに同じセクションがあるか確認
      if (previousInterviewData.sheetStructure?.sections?.[activeSection]) {
        console.log(`セクション同期: ${activeSection} -> ${normalizedSheetData.sections[activeSection]?.name}`);
      }
    }
  }, [activeSection, isComparisonEnabled, previousInterviewData, normalizedSheetData.sections]);

  const fetchPreviousInterviewData = async () => {
    try {
      // LocalStorageから前回の同種面談データを取得
      const storageKey = 'staff_medical_interview_data';
      console.log('🔍 前回面談データ検索開始');
      console.log('Storage Key:', storageKey);
      console.log('Staff ID:', staffProfile.id);
      console.log('Interview Type:', currentInterviewType);
      
      const storedData = localStorage.getItem(storageKey);
      if (!storedData) {
        console.log('⚠️ LocalStorageにデータがありません');
        return;
      }

      const allInterviews = JSON.parse(storedData);
      console.log('📁 LocalStorageから取得した全面談データ:', allInterviews.length, '件');
      console.log('📄 全データ:', allInterviews);
      
      const staffInterviews = allInterviews.filter((interview: any) => {
        const matches = {
          staffId: interview.staffId === staffProfile.id,
          interviewType: interview.interviewType === currentInterviewType ||
                       interview.interviewType?.includes('regular') && currentInterviewType?.includes('regular') ||
                       interview.interviewType?.includes('annual') && currentInterviewType?.includes('annual'),
          status: interview.status === 'completed'
        };
        console.log(`🔍 チェック中: staffId=${interview.staffId}(${matches.staffId}), type=${interview.interviewType}(${matches.interviewType}), status=${interview.status}(${matches.status})`);
        return matches.staffId && matches.interviewType && matches.status;
      });
      
      console.log('🎯 フィルター結果:', staffInterviews.length, '件');
      console.log('📅 マッチしたデータ:', staffInterviews);

      if (staffInterviews.length > 0) {
        // 最新の完了した面談を取得
        const latest = staffInterviews.sort((a: any, b: any) => 
          new Date(b.completedAt || b.createdAt).getTime() - new Date(a.completedAt || a.createdAt).getTime()
        )[0];
        
        console.log('✅ 前回面談データを設定:', latest);
        setPreviousInterviewData(latest);
      } else {
        console.log('❌ 前回面談データが見つかりません');
      }
    } catch (error) {
      console.error('🚨 Failed to fetch previous interview data:', error);
    }
  };

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

  // ハイブリッド質問コンポーネント（5段階評価＋テキスト）
  const HybridQuestion = ({ question, section }: { 
    question: InterviewQuestionInstance, 
    section: InterviewSectionInstance 
  }) => {
    const scaleValue = responses[section.sectionId]?.[question.questionId]?.scale || 3;
    const textValue = responses[section.sectionId]?.[question.questionId]?.text || '';
    
    const updateHybridResponse = (type: 'scale' | 'text', value: any) => {
      const currentResponse = responses[section.sectionId]?.[question.questionId] || {};
      updateResponse(section.sectionId, question.questionId, {
        ...currentResponse,
        [type]: value
      });
    };
    
    return (
      <div className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
        <Label className="font-medium text-gray-800 mb-3 block">
          {question.content || question.text}
          {question.required || question.isRequired && <span className="text-red-500 ml-1">*</span>}
        </Label>
        
        {/* 5段階評価部分 */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            {question.scaleLabel || '評価'}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">1</span>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map(num => (
                <button
                  key={num}
                  onClick={() => updateHybridResponse('scale', num)}
                  disabled={readOnly}
                  className={`w-10 h-10 rounded-full border-2 font-medium transition-all ${
                    scaleValue === num
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-blue-300'
                  } ${readOnly ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                >
                  {num}
                </button>
              ))}
            </div>
            <span className="text-sm text-gray-500">5</span>
          </div>
        </div>
        
        {/* テキスト入力部分 */}
        <div>
          <p className="text-sm text-gray-600 mb-2">
            {question.textLabel || '詳細・理由'}
          </p>
          <Textarea
            placeholder={question.textPlaceholder || question.placeholder || "具体的な内容を記入してください..."}
            className="w-full resize-none"
            rows={3}
            disabled={readOnly}
            value={textValue}
            onChange={(e) => updateHybridResponse('text', e.target.value)}
          />
        </div>
      </div>
    );
  };

  // 質問タイプに応じたコンポーネントを返す
  const renderQuestion = (question: InterviewQuestionInstance, section: InterviewSectionInstance) => {
    // questionIdがない場合はidを使用
    const questionId = question.questionId || question.id;
    if (!questionId) {
      console.warn('Question missing ID:', question);
      return null;
    }
    
    // questionオブジェクトにquestionIdを追加（互換性のため）
    const normalizedQuestion = { ...question, questionId };
    
    switch (question.type) {
      case 'scale':
        return <ScaleRating key={questionId} question={normalizedQuestion} section={section} />;
      case 'textarea':
        return <TextAreaQuestion key={questionId} question={normalizedQuestion} section={section} />;
      case 'radio':
        return <RadioQuestion key={questionId} question={normalizedQuestion} section={section} />;
      case 'checkbox':
        return <CheckboxQuestion key={questionId} question={normalizedQuestion} section={section} />;
      case 'hybrid':
        return <HybridQuestion key={questionId} question={normalizedQuestion} section={section} />;
      case 'text':
        return (
          <div key={questionId} className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
            <Label className="font-medium text-gray-800 mb-3 block">
              {question.content || question.text}
              {question.required || question.isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              type="text"
              placeholder={question.placeholder || "回答を入力してください..."}
              disabled={readOnly}
              value={responses[section.sectionId]?.[questionId] || ''}
              onChange={(e) => updateResponse(section.sectionId, questionId, e.target.value)}
            />
          </div>
        );
      case 'open':  // 開放型質問をtextareaとして処理
        return <TextAreaQuestion key={questionId} question={normalizedQuestion} section={section} />;
      case 'checklist':  // checklistをcheckboxとして処理
        return <CheckboxQuestion key={questionId} question={{ ...normalizedQuestion, type: 'checkbox' }} section={section} />;
      default:
        console.warn('Unknown question type:', question.type);
        // フォールバック：textareaとして表示
        return <TextAreaQuestion key={questionId} question={{ ...normalizedQuestion, type: 'textarea' }} section={section} />;
    }
  };

  // セクション完了状況の更新
  useEffect(() => {
    const newStatus: Record<string, boolean> = {};
    normalizedSheetData.sections.forEach(section => {
      newStatus[section.sectionId] = checkSectionCompletion(section);
    });
    setCompletionStatus(newStatus);
  }, [responses, normalizedSheetData]);

  // セクションアイコンを取得
  const getSectionIcon = (sectionType: string) => {
    const iconMap: Record<string, any> = {
      'motivation_assessment': Brain,
      'current_status': Activity,
      'status_check': Activity,  // 現状確認セクション
      'skill_evaluation': Target,
      'goal_setting': Award,
      'support_planning': Users,
      'career_development': TrendingUp,
      'organization_contribution': Users,  // 組織貢献セクション
      'team_environment': Users,
      'health_wellbeing': Heart,
      'feedback_reflection': MessageSquare,
      'action_planning': ArrowRight,  // アクションプランセクション
      'action_plan': ArrowRight
    };
    const IconComponent = iconMap[sectionType] || FileText;
    return IconComponent && typeof IconComponent === 'function' ? IconComponent : FileText;
  };

  return (
    <div style={{ margin: '-20px' }} className="bg-gray-50 min-h-screen">
      <div className="p-6 space-y-6">
      {/* ヘッダー */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center">
                <FileText className="mr-3 text-blue-600" size={28} />
                定期面談シート - {staffProfile?.name || 'シミュレーション職員'}
              </CardTitle>
              <div className="text-sm text-gray-600 mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p><strong>部署:</strong> {staffProfile?.department || '看護部'}</p>
                  <p><strong>職種:</strong> {staffProfile?.profession || '看護師'}</p>
                  <p><strong>役職:</strong> {staffProfile?.position?.name || staffProfile?.position || '一般職'}</p>
                </div>
                <div>
                  <p><strong>経験年数:</strong> {staffProfile?.experienceYears || 0}年{staffProfile?.experienceMonths || 0}ヶ月</p>
                  <p><strong>面談日:</strong> {sheetData.params?.interviewDate ? new Date(sheetData.params.interviewDate).toLocaleDateString('ja-JP') : new Date().toLocaleDateString('ja-JP')}</p>
                  <p><strong>所要時間:</strong> {sheetData.params?.duration || 30}分</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={() => {
                  setIsComparisonEnabled(!isComparisonEnabled);
                  if (!isComparisonEnabled) {
                    fetchPreviousInterviewData();
                  }
                }}
                variant={isComparisonEnabled ? 'default' : 'outline'}
                title="前回面談シートと比較表示"
              >
                <ArrowRightLeft className="mr-2" size={16} />
                {isComparisonEnabled ? '比較終了' : '前回比較'}
              </Button>
              <Button 
                onClick={() => {
                  const demoData = [{
                    id: 'PREV_001', staffId: 'OH-NS-2021-001', staffName: '田中美咲', 
                    interviewType: 'regular_annual', status: 'completed', createdAt: '2024-12-15T10:00:00Z',
                    sheetStructure: { sections: [
                      { name: '導入・現状確認', questions: [{ id: 'p1', question: '前回以降の状況は？', answer: '夜勤にも慣れました' }] },
                      { name: 'スキル評価・能力確認', questions: [{ id: 'p2', question: 'バイタル測定は？', answer: '正確に測定できます' }] }
                    ]},
                    responses: { sections: { 
                      '導入・現状確認': { 'p1': '夜勤にも慣れました' },
                      'スキル評価・能力確認': { 'p2': '正確に測定できます' }
                    }}
                  }];
                  localStorage.setItem('staff_medical_interview_data', JSON.stringify(demoData));
                  alert('テストデータを追加しました！');
                }}
                variant="outline" 
                size="sm"
                title="テスト用の前回面談データを追加"
              >
                📝 デモ追加
              </Button>
              <Button 
                onClick={() => {
                  localStorage.removeItem('staff_medical_interview_data');
                  window.location.reload();
                }}
                variant="outline"
                size="sm"
                className="text-xs"
                title="デモデータをリセット"
              >
                🗑️ リセット
              </Button>
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
                {normalizedSheetData.sections.map((section, index) => {
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
                <span className="ml-2">{staffProfile?.facility || '未設定'}</span>
              </div>
              {staffProfile?.hireDate && (
                <div>
                  <span className="font-medium">入職日:</span>
                  <span className="ml-2">
                    {new Date(staffProfile.hireDate).toLocaleDateString('ja-JP')}
                  </span>
                </div>
              )}
              {staffProfile?.experienceLevel && (
                <div>
                  <span className="font-medium">経験レベル:</span>
                  <span className="ml-2">
                    {staffProfile.experienceLevel === 'new' && '新人'}
                    {staffProfile.experienceLevel === 'junior' && '若手'}
                    {staffProfile.experienceLevel === 'midlevel' && '中堅'}
                    {staffProfile.experienceLevel === 'veteran' && 'ベテラン'}
                  </span>
                </div>
              )}
              {staffProfile?.licenses && staffProfile.licenses.length > 0 && (
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
        <div className={`flex-1 ${isComparisonEnabled && previousInterviewData ? 'max-w-1/2' : ''}`}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {(() => {
                  const sectionType = normalizedSheetData.sections?.[activeSection]?.type;
                  const IconComponent = sectionType ? getSectionIcon(sectionType) : null;
                  return IconComponent ? React.createElement(IconComponent, {
                    className: "mr-3 text-blue-600",
                    size: 24
                  }) : null;
                })()}
                {normalizedSheetData.sections[activeSection].name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* 動機タイプ判定セクションの特別処理 */}
              {normalizedSheetData.sections[activeSection].type === 'motivation_assessment' && (
                <Alert className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    この職員の動機タイプを理解することで、より効果的なマネジメントと支援が可能になります。
                  </AlertDescription>
                </Alert>
              )}

              {/* 質問の表示 */}
              <div className="space-y-4">
                {normalizedSheetData.sections[activeSection].questions.map(question => 
                  renderQuestion(question, normalizedSheetData.sections[activeSection])
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
                  onClick={() => setActiveSection(Math.min(normalizedSheetData.sections.length - 1, activeSection + 1))}
                  disabled={activeSection === normalizedSheetData.sections.length - 1}
                >
                  次のセクション
                  <ChevronRight className="ml-2" size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* コンテキストヘルプ */}
          {normalizedSheetData.sections[activeSection].type === 'skill_evaluation' && (
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
        
        {/* 前回面談データ比較表示 */}
        {isComparisonEnabled && previousInterviewData && (
          <div className="flex-1 ml-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <FileText className="mr-3" size={24} />
                  前回面談シート - {new Date(previousInterviewData.completedAt || previousInterviewData.createdAt).toLocaleDateString('ja-JP')}
                </CardTitle>
                <div className="text-sm text-gray-600">
                  面談種別: {previousInterviewData.interviewType} | 
                  所要時間: {previousInterviewData.duration || 30}分
                </div>
              </CardHeader>
              <CardContent>
                {/* 同期されたセクションの表示 */}
                {previousInterviewData.responses && (
                  <div className="space-y-4">
                    {/* 現在のセクションに対応する前回データを表示 */}
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-800 mb-3 flex items-center">
                        <ArrowRightLeft className="mr-2" size={16} />
                        同期中: {normalizedSheetData.sections[activeSection]?.name}
                      </h4>
                      
                      {/* 現在のセクションに対応する前回の回答 */}
                      {(() => {
                        const currentSectionName = normalizedSheetData.sections[activeSection]?.name;
                        const matchingSectionResponses = Object.entries(previousInterviewData.responses || {})
                          .find(([sectionId]) => sectionId.includes(currentSectionName) || currentSectionName.includes(sectionId));
                        
                        if (matchingSectionResponses) {
                          const [sectionId, sectionResponses] = matchingSectionResponses;
                          return (
                            <div className="space-y-3">
                              {Object.entries(sectionResponses || {}).map(([questionId, response]: [string, any]) => (
                                <div key={questionId} className="bg-white p-3 rounded border border-green-100">
                                  <p className="text-xs text-green-600 mb-1">前回の回答</p>
                                  <p className="text-sm text-green-800 font-medium">
                                    {typeof response === 'object' ? JSON.stringify(response, null, 2) : String(response)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          );
                        } else {
                          return (
                            <p className="text-sm text-green-600 italic">
                              このセクションに対応する前回データが見つかりません
                            </p>
                          );
                        }
                      })()} 
                    </div>
                    
                    {/* 全セクションの概要表示（折りたたみ可能） */}
                    <details className="mt-4">
                      <summary className="cursor-pointer text-sm font-medium text-green-700 hover:text-green-800">
                        全セクションの前回データを表示
                      </summary>
                      <div className="mt-3 space-y-3">
                        {Object.entries(previousInterviewData.responses).map(([sectionId, sectionResponses]: [string, any]) => (
                          <div key={sectionId} className="border-l-4 border-green-300 pl-4">
                            <h5 className="font-medium text-green-600 mb-2">{sectionId}</h5>
                            {Object.entries(sectionResponses || {}).map(([questionId, response]: [string, any]) => (
                              <div key={questionId} className="mb-2 p-2 bg-green-25 rounded">
                                <p className="text-xs text-gray-500 mb-1">{questionId}</p>
                                <p className="text-sm text-green-700">
                                  {typeof response === 'object' ? JSON.stringify(response) : String(response)}
                                </p>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                )}
                
                {!previousInterviewData.responses && (
                  <div className="text-center py-8 text-gray-500">
                    <p>前回面談の詳細データが見つかりません</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
        
        {isComparisonEnabled && !previousInterviewData && (
          <div className="flex-1 ml-6">
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <FileText className="mx-auto mb-4 text-gray-300" size={48} />
                <p>前回の同種面談データが見つかりません</p>
                <p className="text-sm mt-2">初回面談またはデータが未保存の可能性があります。</p>
              </CardContent>
            </Card>
          </div>
        )}
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
    </div>
  );
}