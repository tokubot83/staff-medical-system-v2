'use client';

import React from 'react';
import {
  User, Target, Heart, TrendingUp, Brain, Lightbulb, 
  ArrowRight, FileText, Calendar, Printer, Save,
  CheckCircle, AlertTriangle, Star, MessageSquare, HelpCircle,
  Building, Users, Clock, Award, Activity, Briefcase
} from 'lucide-react';
import { 
  GeneratedInterviewSheet, 
  InterviewSectionInstance,
  InterviewQuestionInstance,
  StaffProfile
} from '@/lib/interview-bank/types-extended';

interface DynamicInterviewSheetPrintProps {
  sheetData: GeneratedInterviewSheet;
  staffProfile: StaffProfile;
  responses?: Record<string, any>;
  motivationType?: string;
}

export default function DynamicInterviewSheetPrint({ 
  sheetData, 
  staffProfile,
  responses = {},
  motivationType
}: DynamicInterviewSheetPrintProps) {

  // スケール評価コンポーネント（印刷用）
  const ScaleSelector = ({ question, section, guide }: { 
    question: InterviewQuestionInstance,
    section: InterviewSectionInstance,
    guide?: string
  }) => {
    const value = responses[section.sectionId]?.[question.questionId] || null;
    const comment = responses[section.sectionId]?.[`${question.questionId}_comment`] || '';

    return (
      <div className="mb-4 p-3 border-l-4 border-blue-300 bg-blue-50 rounded">
        <div className="mb-2">
          <h4 className="text-sm font-bold text-blue-800 mb-1">{question.content}</h4>
          {question.placeholder && (
            <p className="text-xs text-blue-700 italic mb-2">💬 {question.placeholder}</p>
          )}
          {guide && <p className="text-xs text-gray-600 mb-2">📋 {guide}</p>}
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-red-600 font-medium">低い・悪い</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map(num => (
              <div
                key={num}
                className={`w-8 h-8 text-xs rounded border-2 font-bold flex items-center justify-center ${
                  value === num
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                {num}
              </div>
            ))}
          </div>
          <span className="text-xs text-green-600 font-medium">高い・良い</span>
        </div>
        <div className="w-full text-xs p-2 border rounded bg-white min-h-[3rem]">
          {comment || <span className="text-gray-400">未記入</span>}
        </div>
      </div>
    );
  };

  // オープン質問コンポーネント（印刷用）
  const OpenQuestion = ({ question, section }: { 
    question: InterviewQuestionInstance,
    section: InterviewSectionInstance
  }) => {
    const value = responses[section.sectionId]?.[question.questionId] || '';

    return (
      <div className="mb-4 p-3 border-l-4 border-green-300 bg-green-50 rounded">
        <h4 className="text-sm font-bold text-green-800 mb-1">{question.content}</h4>
        {question.placeholder && (
          <p className="text-xs text-green-700 italic mb-2">💬 {question.placeholder}</p>
        )}
        <div className="w-full text-xs p-2 border rounded bg-white min-h-[4rem]">
          {value || <span className="text-gray-400">未記入</span>}
        </div>
      </div>
    );
  };

  // ラジオボタン質問（印刷用）
  const RadioQuestion = ({ question, section }: {
    question: InterviewQuestionInstance,
    section: InterviewSectionInstance
  }) => {
    const value = responses[section.sectionId]?.[question.questionId] || '';

    return (
      <div className="mb-4 p-3 border-l-4 border-purple-300 bg-purple-50 rounded">
        <h4 className="text-sm font-bold text-purple-800 mb-2">{question.content}</h4>
        <div className="space-y-1">
          {question.options?.map(option => (
            <div key={option.value} className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-full border-2 ${
                value === option.value 
                  ? 'bg-purple-600 border-purple-600' 
                  : 'bg-white border-gray-400'
              }`} />
              <span className="text-xs">{option.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // チェックボックス質問（印刷用）
  const CheckboxQuestion = ({ question, section }: {
    question: InterviewQuestionInstance,
    section: InterviewSectionInstance
  }) => {
    const values = responses[section.sectionId]?.[question.questionId] || [];

    return (
      <div className="mb-4 p-3 border-l-4 border-orange-300 bg-orange-50 rounded">
        <h4 className="text-sm font-bold text-orange-800 mb-2">{question.content}</h4>
        <div className="space-y-1">
          {question.options?.map(option => (
            <div key={option.value} className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded border-2 ${
                values.includes(option.value)
                  ? 'bg-orange-600 border-orange-600' 
                  : 'bg-white border-gray-400'
              }`}>
                {values.includes(option.value) && (
                  <CheckCircle className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="text-xs">{option.label}</span>
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
        return <ScaleSelector key={question.questionId} question={question} section={section} />;
      case 'textarea':
        return <OpenQuestion key={question.questionId} question={question} section={section} />;
      case 'radio':
        return <RadioQuestion key={question.questionId} question={question} section={section} />;
      case 'checkbox':
        return <CheckboxQuestion key={question.questionId} question={question} section={section} />;
      case 'text':
        const value = responses[section.sectionId]?.[question.questionId] || '';
        return (
          <div key={question.questionId} className="mb-4 p-3 border-l-4 border-gray-300 bg-gray-50 rounded">
            <h4 className="text-sm font-bold text-gray-800 mb-1">{question.content}</h4>
            <div className="w-full text-xs p-2 border rounded bg-white">
              {value || <span className="text-gray-400">未記入</span>}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

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
    <div className="max-w-5xl mx-auto p-4 bg-white print:p-0" style={{ fontSize: '12px' }}>
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-blue-600">
        <div>
          <h1 className="text-xl font-bold text-blue-800 flex items-center">
            <FileText className="mr-2" size={24} />
            定期面談シート（動的生成版）
          </h1>
          <p className="text-sm text-gray-600">{staffProfile.facility} | 構造化面談による深い対話</p>
        </div>
        <div className="flex items-center space-x-2 print:hidden">
          <button onClick={() => window.print()} className="flex items-center px-3 py-2 bg-gray-600 text-white rounded text-sm">
            <Printer className="mr-1" size={14} />印刷
          </button>
        </div>
      </div>

      {/* 面談開始ガイド */}
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded print:border-gray-300">
        <h3 className="text-sm font-bold text-yellow-800 mb-2 flex items-center">
          <MessageSquare className="mr-2" size={16} />
          面談開始時の説明（必ず読み上げる）
        </h3>
        <div className="text-xs text-yellow-700 space-y-1">
          <p>「今日は貴重なお時間をいただき、ありがとうございます。この面談は約{sheetData.params.duration}分を予定しており、</p>
          <p>あなたの現在の状況や今後の希望を伺い、より良い職場環境づくりに活かすことが目的です。」</p>
          <p>「お話しいただいた内容は守秘義務を守り、適切に管理いたします。リラックスしてお聞かせください。」</p>
        </div>
      </div>

      {/* 基本情報 */}
      <div className="grid grid-cols-4 gap-3 mb-6 p-3 bg-gray-50 rounded border">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">職員名</label>
          <div className="w-full text-sm p-2 border rounded bg-white">{staffProfile.name}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">部署・職種</label>
          <div className="w-full text-sm p-2 border rounded bg-white">
            {staffProfile.department} / {staffProfile.profession}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">面談日</label>
          <div className="w-full text-sm p-2 border rounded bg-white">
            {new Date(sheetData.params.interviewDate).toLocaleDateString('ja-JP')}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">面談者</label>
          <div className="w-full text-sm p-2 border rounded bg-white">
            {sheetData.params.interviewerName}
          </div>
        </div>
      </div>

      {/* 職員詳細情報 */}
      <div className="grid grid-cols-3 gap-3 mb-6 p-3 bg-blue-50 rounded border border-blue-200">
        <div>
          <label className="block text-xs font-medium text-blue-700 mb-1">役職</label>
          <div className="text-sm font-semibold">{staffProfile.position.name}</div>
        </div>
        <div>
          <label className="block text-xs font-medium text-blue-700 mb-1">経験年数</label>
          <div className="text-sm font-semibold">
            {staffProfile.experienceYears}年{staffProfile.experienceMonths}ヶ月
            <span className="ml-2 text-xs bg-blue-100 px-2 py-1 rounded">
              {staffProfile.experienceLevel === 'new' && '新人'}
              {staffProfile.experienceLevel === 'junior' && '若手'}
              {staffProfile.experienceLevel === 'midlevel' && '中堅'}
              {staffProfile.experienceLevel === 'veteran' && 'ベテラン'}
            </span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-blue-700 mb-1">保有資格</label>
          <div className="text-sm">
            {staffProfile.licenses.map((license, idx) => (
              <span key={idx} className="inline-block bg-white rounded px-2 py-1 text-xs mr-1 mb-1">
                {license}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 動機タイプ判定結果（ある場合） */}
      {motivationType && (
        <div className="mb-6 p-3 bg-purple-50 border border-purple-200 rounded">
          <h3 className="text-sm font-bold text-purple-800 mb-2 flex items-center">
            <Brain className="mr-2" size={16} />
            動機タイプ判定結果
          </h3>
          <div className="text-sm">
            <span className="font-semibold">タイプ: </span>
            <span className="bg-purple-200 px-2 py-1 rounded">
              {motivationType === 'growth' && '成長型'}
              {motivationType === 'recognition' && '承認型'}
              {motivationType === 'stability' && '安定型'}
              {motivationType === 'teamwork' && 'チームワーク型'}
              {motivationType === 'efficiency' && '効率型'}
              {motivationType === 'compensation' && '報酬型'}
              {motivationType === 'creativity' && '創造型'}
            </span>
          </div>
        </div>
      )}

      {/* セクションごとの質問 */}
      <div className="space-y-8">
        {sheetData.sections.map((section, sectionIndex) => {
          const Icon = getSectionIcon(section.type);
          return (
            <div key={section.sectionId} className="page-break-inside-avoid">
              <div className="mb-6 p-4 border-2 border-blue-200 rounded-lg bg-blue-25">
                <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
                  <Icon className="mr-2" size={18} />
                  {sectionIndex + 1}. {section.name}
                </h3>
                
                {/* セクション説明 */}
                {section.description && (
                  <div className="mb-3 p-2 bg-white rounded border border-blue-100">
                    <p className="text-xs text-gray-600">{section.description}</p>
                  </div>
                )}

                {/* 質問 */}
                <div className="space-y-2">
                  {section.questions.map(question => 
                    renderQuestion(question, section)
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 総合評価・所見 */}
      <div className="mt-8 p-4 border-2 border-gray-300 rounded-lg bg-gray-50">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
          <MessageSquare className="mr-2" size={18} />
          総合評価・所見
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">面談者所見</label>
            <div className="w-full min-h-[4rem] p-2 border rounded bg-white text-xs">
              {responses.overallAssessment || <span className="text-gray-400">未記入</span>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">次回面談予定</label>
              <div className="w-full p-2 border rounded bg-white text-xs">
                {responses.nextInterviewDate 
                  ? new Date(responses.nextInterviewDate).toLocaleDateString('ja-JP')
                  : <span className="text-gray-400">未設定</span>
                }
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">フォローアップ事項</label>
              <div className="w-full p-2 border rounded bg-white text-xs">
                {responses.followUpItems?.join(', ') || <span className="text-gray-400">なし</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* フッター */}
      <div className="mt-6 pt-4 border-t text-center text-xs text-gray-500">
        <p>面談実施日: {new Date(sheetData.params.interviewDate).toLocaleDateString('ja-JP')} | 
           総質問数: {sheetData.totalQuestions}問 | 
           推定所要時間: {sheetData.estimatedDuration}分</p>
        <p className="mt-1">{staffProfile.facility} 人事部 | 定期面談システム v3.0 - 動的生成版</p>
      </div>

      {/* 印刷用スタイル */}
      <style jsx>{`
        @media print {
          .print\\:hidden {
            display: none;
          }
          .print\\:p-0 {
            padding: 0;
          }
          .page-break-inside-avoid {
            page-break-inside: avoid;
          }
          .bg-blue-25 {
            background-color: #f0f7ff;
          }
        }
        .bg-blue-25 {
          background-color: #f8fbff;
        }
      `}</style>
    </div>
  );
}