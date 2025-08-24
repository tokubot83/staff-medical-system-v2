'use client';

import React, { useState } from 'react';
import { Clock, User, Calendar, FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InterviewData } from '@/services/interview/interviewDataService';
import { usePreviousInterviewSheet } from '@/hooks/usePreviousInterviewSheet';

interface PreviousInterviewViewerProps {
  staffId: string;
  currentInterviewType: string;
  currentInterviewId?: string;
  currentSection?: number;
  onSectionChange?: (section: number) => void;
}

interface PreviousInterviewDisplayProps {
  interview: InterviewData;
  currentSection?: number;
}

// 前回面談データの表示コンポーネント
const PreviousInterviewDisplay: React.FC<PreviousInterviewDisplayProps> = ({ 
  interview, 
  currentSection 
}) => {
  return (
    <div className="space-y-4">
      {/* 面談基本情報 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-blue-600">
            <Clock className="h-4 w-4" />
            前回の{interview.interviewType}面談
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">実施日:</span>
              <span>{new Date(interview.actualDate || interview.scheduledDate).toLocaleDateString('ja-JP')}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">面談者:</span>
              <span>{interview.interviewer.name}</span>
            </div>
            {interview.duration && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">時間:</span>
                <span>{interview.duration}分</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">カテゴリ:</span>
              <span>{interview.interviewCategory}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 面談サマリー */}
      {interview.summary && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-700">前回のサマリー</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-600 leading-relaxed">{interview.summary}</p>
          </CardContent>
        </Card>
      )}

      {/* キーポイント */}
      {interview.keyPoints && interview.keyPoints.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-700">前回の重要ポイント</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {interview.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-600">{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* アクションアイテム */}
      {interview.actionItems && interview.actionItems.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-700">前回のアクションアイテム</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {interview.actionItems.map((item, index) => (
                <div key={index} className="border-l-2 border-blue-200 pl-3">
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-gray-600 flex-1">{item.description}</p>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : item.status === 'in-progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status === 'completed' ? '完了' : 
                       item.status === 'in-progress' ? '進行中' : '未着手'}
                    </span>
                  </div>
                  {item.assignee && (
                    <p className="text-xs text-gray-500 mt-1">担当: {item.assignee}</p>
                  )}
                  {item.dueDate && (
                    <p className="text-xs text-gray-500">期限: {new Date(item.dueDate).toLocaleDateString('ja-JP')}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 面談シートデータ（存在する場合） */}
      {interview.sheetData && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-700">前回の面談シート内容</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="bg-gray-50 p-3 rounded-lg">
              <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                {JSON.stringify(interview.sheetData, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default function PreviousInterviewViewer({
  staffId,
  currentInterviewType,
  currentInterviewId,
  currentSection,
  onSectionChange
}: PreviousInterviewViewerProps) {
  const {
    previousInterview,
    loading,
    error,
    hasHistory,
    isFirstInterview
  } = usePreviousInterviewSheet(staffId, currentInterviewType, currentInterviewId);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            <span className="text-sm text-gray-600">前回の面談データを読み込んでいます...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isFirstInterview) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900">初回の{currentInterviewType}面談です</h3>
            <p className="text-sm text-gray-600">
              同じタイプの過去の面談履歴がないため、前回のシートは表示できません。
            </p>
            {hasHistory && (
              <p className="text-xs text-gray-500 mt-2">
                ※ 他のタイプの面談履歴は存在します
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!previousInterview) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-600">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">前回の面談データが見つかりません</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <PreviousInterviewDisplay interview={previousInterview} currentSection={currentSection} />;
}