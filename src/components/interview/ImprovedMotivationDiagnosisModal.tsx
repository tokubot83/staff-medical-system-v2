'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  CheckCircle, 
  AlertCircle, 
  ChevronRight,
  X,
  Sparkles,
  Target,
  Users,
  Shield,
  TrendingUp
} from 'lucide-react';
import { MotivationQuestion } from '@/services/motivationTypeDiagnosisService';

interface ImprovedMotivationDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffName: string;
  questions: MotivationQuestion[];
  onResponseSave: (questionId: string, value: string) => void;
  responses: Map<string, any>;
}

export default function ImprovedMotivationDiagnosisModal({
  isOpen,
  onClose,
  staffName,
  questions,
  onResponseSave,
  responses
}: ImprovedMotivationDiagnosisModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Map<string, string>>(new Map());
  const [showConfirmation, setShowConfirmation] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = Math.min(3, questions.length); // 最初の3問のみ
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  if (!isOpen) return null;

  // アイコンマップ
  const getOptionIcon = (optionValue: string) => {
    switch (optionValue) {
      case 'a': return <Target className="h-5 w-5 text-blue-500" />;
      case 'b': return <Users className="h-5 w-5 text-green-500" />;
      case 'c': return <Shield className="h-5 w-5 text-purple-500" />;
      case 'd': return <TrendingUp className="h-5 w-5 text-orange-500" />;
      default: return <Sparkles className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleSelectAnswer = (value: string) => {
    const newAnswers = new Map(selectedAnswers);
    newAnswers.set(currentQuestion.id, value);
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    const currentAnswer = selectedAnswers.get(currentQuestion.id);
    if (currentAnswer) {
      onResponseSave(currentQuestion.id, currentAnswer);
      
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setShowConfirmation(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleComplete = () => {
    // すべての回答を保存
    selectedAnswers.forEach((value, questionId) => {
      onResponseSave(questionId, value);
    });
    onClose();
  };

  const isCurrentQuestionAnswered = selectedAnswers.has(currentQuestion?.id);
  const areAllQuestionsAnswered = questions.slice(0, totalQuestions).every(q => 
    selectedAnswers.has(q.id)
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="max-w-3xl w-full max-h-[90vh] overflow-hidden bg-white shadow-2xl">
        {/* ヘッダー */}
        <CardHeader className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Brain className="h-6 w-6" />
                </div>
                動機タイプ診断
              </CardTitle>
              <p className="text-purple-100 mt-2">
                {staffName}さんの働く動機を分析します
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* プログレスバー */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-purple-100">質問 {currentQuestionIndex + 1} / {totalQuestions}</span>
              <span className="text-purple-100">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-white/30" />
          </div>
        </CardHeader>

        {/* コンテンツ */}
        <CardContent className="p-6 overflow-y-auto max-h-[60vh]">
          {!showConfirmation ? (
            <>
              {/* 質問 */}
              <div className="mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                    <span className="text-purple-600 font-bold text-lg">Q{currentQuestionIndex + 1}</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 pt-1">
                    {currentQuestion?.question}
                  </h3>
                </div>

                {/* 選択肢 */}
                <div className="space-y-3">
                  {currentQuestion?.options.map(option => {
                    const isSelected = selectedAnswers.get(currentQuestion.id) === option.value;
                    
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleSelectAnswer(option.value)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left group ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50 shadow-md' 
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* ラジオボタン風のインジケーター */}
                          <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-500' 
                              : 'border-gray-300 bg-white group-hover:border-blue-400'
                          }`}>
                            {isSelected && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>

                          {/* オプションアイコン */}
                          <div className="flex-shrink-0">
                            {getOptionIcon(option.value)}
                          </div>

                          {/* テキスト */}
                          <span className={`text-sm ${
                            isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'
                          }`}>
                            {option.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ヒント */}
              {isCurrentQuestionAnswered && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    回答を選択しました。次の質問に進んでください。
                  </AlertDescription>
                </Alert>
              )}

              {/* ナビゲーションボタン */}
              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center"
                >
                  前の質問
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={!isCurrentQuestionAnswered}
                  className="flex items-center bg-blue-600 hover:bg-blue-700"
                >
                  {currentQuestionIndex < totalQuestions - 1 ? (
                    <>
                      次の質問
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      診断結果を見る
                      <CheckCircle className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            /* 確認画面 */
            <div className="text-center py-8">
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  診断が完了しました！
                </h3>
                <p className="text-gray-600">
                  {staffName}さんの動機タイプを分析しました
                </p>
              </div>

              {/* 回答サマリー */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-medium text-gray-700 mb-3">回答内容</h4>
                <div className="space-y-2">
                  {questions.slice(0, totalQuestions).map((q, index) => {
                    const answer = q.options.find(opt => 
                      opt.value === selectedAnswers.get(q.id)
                    );
                    return (
                      <div key={q.id} className="flex items-start gap-2 text-sm">
                        <span className="text-gray-500">Q{index + 1}:</span>
                        <span className="text-gray-700">{answer?.label || '未回答'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowConfirmation(false);
                    setCurrentQuestionIndex(0);
                  }}
                >
                  回答を修正
                </Button>
                <Button
                  onClick={handleComplete}
                  className="bg-green-600 hover:bg-green-700"
                >
                  面談を開始する
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}