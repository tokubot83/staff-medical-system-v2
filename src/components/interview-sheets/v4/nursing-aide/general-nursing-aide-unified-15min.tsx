'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Printer, FileText, MessageSquare, Target, Users, Heart, TrendingUp } from 'lucide-react';

interface GeneralNursingAideUnified15MinProps {
  employeeData?: {
    name: string;
    employeeId: string;
    department: string;
    position: string;
    hireDate: string;
  };
  onSubmit?: (data: any) => void;
  onSaveDraft?: (data: any) => void;
}

export default function GeneralNursingAideUnified15Min({ 
  employeeData = {
    name: '',
    employeeId: '',
    department: '',
    position: '看護補助者',
    hireDate: ''
  },
  onSubmit,
  onSaveDraft 
}: GeneralNursingAideUnified15MinProps) {
  const currentDate = new Date().toLocaleDateString('ja-JP');
  
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-gray-50">
      {/* ヘッダー情報 */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            一般看護補助者 統合面談シート（15分版）
          </CardTitle>
          <p className="text-blue-100 text-sm mt-2">
            経験2-7年目の看護補助者向け - 簡易版
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-600">氏名</label>
              <p className="mt-1 font-semibold">{employeeData.name || '___________'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">職員番号</label>
              <p className="mt-1 font-semibold">{employeeData.employeeId || '___________'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">所属部署</label>
              <p className="mt-1 font-semibold">{employeeData.department || '___________'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">面談日</label>
              <p className="mt-1 font-semibold">{currentDate}</p>
            </div>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-800">
              <strong>面談の目的：</strong>
              一般看護補助者の業務遂行状況を確認し、キャリア発展を支援するとともに、必要なサポートを提供します。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 1. 業務遂行状況の評価（5分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            1. 業務遂行状況の評価（5分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* 専門技術の実践 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">専門技術の実践レベル</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '高度な技術を持ち、他者の指導ができる' },
                { value: '4', label: '確実な技術で自立して業務遂行できる' },
                { value: '3', label: '標準的な技術で業務遂行できる' },
                { value: '2', label: '基本的な技術はあるが、時々支援が必要' },
                { value: '1', label: '技術面での課題が多い' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`tech-${option.value}`} />
                  <Label htmlFor={`tech-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 業務効率・時間管理 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">業務効率・時間管理</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '非常に効率的で、時間内に余裕を持って完了' },
                { value: '4', label: '効率的に業務を遂行できる' },
                { value: '3', label: '概ね時間内に業務を完了できる' },
                { value: '2', label: '時々時間管理に課題がある' },
                { value: '1', label: '時間管理に大きな課題がある' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`efficiency-${option.value}`} />
                  <Label htmlFor={`efficiency-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 後輩指導・チーム貢献 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">後輩指導・チーム貢献</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '積極的に後輩指導し、チームに大きく貢献' },
                { value: '4', label: '後輩指導ができ、チームに貢献している' },
                { value: '3', label: '求められれば後輩指導できる' },
                { value: '2', label: '後輩指導に消極的' },
                { value: '1', label: '自分の業務で精一杯' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`mentor-${option.value}`} />
                  <Label htmlFor={`mentor-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* 2. 現状確認（5分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="h-5 w-5" />
            2. 現状確認（5分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* 現在のモチベーション */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">現在の仕事への満足度・モチベーション</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '非常に満足し、高いモチベーションを維持' },
                { value: '4', label: '満足している' },
                { value: '3', label: '普通' },
                { value: '2', label: 'やや不満がある' },
                { value: '1', label: '大きな不満がある' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`satisfaction-${option.value}`} />
                  <Label htmlFor={`satisfaction-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* キャリアへの意識 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">今後のキャリアについて</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '明確な目標があり、積極的に取り組んでいる' },
                { value: '4', label: 'ある程度の目標を持っている' },
                { value: '3', label: '現状維持でよい' },
                { value: '2', label: '迷いがある' },
                { value: '1', label: '転職を考えている' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`career-${option.value}`} />
                  <Label htmlFor={`career-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 現在の課題・要望 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">現在の課題・要望</h4>
            <Textarea 
              placeholder="業務上の課題、職場環境、研修希望など、何でも記入してください"
              className="min-h-[80px] resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. アクションプラン（3分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            3. 今後のアクションプラン（3分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* 次回面談までの目標 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">次回面談までの目標（1-2個）</h4>
            <Textarea 
              placeholder="例：新人指導の質を向上させる、認知症ケアのスキルを深める"
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* 必要なサポート */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">組織・上司から必要なサポート</h4>
            <Textarea 
              placeholder="例：専門研修への参加、業務改善の提案機会、キャリア相談など"
              className="min-h-[80px] resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* 4. 面談者所見（2分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            4. 面談者所見（2分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">総合所見</h4>
            <Textarea 
              placeholder="職員の成長状況、強み、今後の育成方針などを記入"
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">面談実施者</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="氏名・役職"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">次回面談予定</label>
              <input 
                type="date" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* アクションボタン */}
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4" />
            印刷
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => onSaveDraft?.({})}
          >
            <FileText className="h-4 w-4" />
            下書き保存
          </Button>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          onClick={() => onSubmit?.({})}
        >
          面談記録を保存
        </Button>
      </div>
    </div>
  );
}