'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Printer, FileText, MessageSquare, Target, Users, Heart, TrendingUp } from 'lucide-react';

interface NewNursingAideUnified15MinProps {
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

export default function NewNursingAideUnified15Min({ 
  employeeData = {
    name: '',
    employeeId: '',
    department: '',
    position: '看護補助者',
    hireDate: ''
  },
  onSubmit,
  onSaveDraft 
}: NewNursingAideUnified15MinProps) {
  const currentDate = new Date().toLocaleDateString('ja-JP');
  
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-gray-50">
      {/* ヘッダー情報 */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            新人看護補助者 統合面談シート（15分版）
          </CardTitle>
          <p className="text-teal-100 text-sm mt-2">
            入職1年目の看護補助者向け - 簡易版
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
          
          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded">
            <p className="text-sm text-teal-800">
              <strong>面談の目的：</strong>
              新人看護補助者の成長支援と職場適応の確認を行い、必要なサポートを提供します。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 1. 業務遂行状況の評価（5分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            1. 業務遂行状況の評価（5分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* 基礎的介護技術の習得度 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">基礎的介護技術の習得度</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '期待以上に習得している' },
                { value: '4', label: '十分習得している' },
                { value: '3', label: '概ね習得している' },
                { value: '2', label: '一部課題がある' },
                { value: '1', label: '大きな課題がある' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`skills-${option.value}`} />
                  <Label htmlFor={`skills-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 安全管理の実践 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">安全管理・感染対策の実践</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '常に適切に実践している' },
                { value: '4', label: '概ね適切に実践している' },
                { value: '3', label: '基本的な実践はできている' },
                { value: '2', label: '時々不適切な行動がある' },
                { value: '1', label: '指導が必要な場面が多い' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`safety-${option.value}`} />
                  <Label htmlFor={`safety-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* チームワーク */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">チームワーク・報告連絡相談</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '積極的に連携し、適切に報告できる' },
                { value: '4', label: '必要な連携・報告ができる' },
                { value: '3', label: '基本的な連携・報告はできる' },
                { value: '2', label: '連携・報告に不足がある' },
                { value: '1', label: '連携・報告が不十分' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`team-${option.value}`} />
                  <Label htmlFor={`team-${option.value}`}>{option.label}</Label>
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
            <h4 className="font-semibold text-gray-700 mb-3">現在の仕事へのモチベーション</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '非常に高い' },
                { value: '4', label: '高い' },
                { value: '3', label: '普通' },
                { value: '2', label: 'やや低い' },
                { value: '1', label: '低い' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`motivation-${option.value}`} />
                  <Label htmlFor={`motivation-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 職場適応度 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">職場への適応状況</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '非常によく適応している' },
                { value: '4', label: 'よく適応している' },
                { value: '3', label: '概ね適応している' },
                { value: '2', label: 'やや適応に困難がある' },
                { value: '1', label: '適応に大きな困難がある' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`adaptation-${option.value}`} />
                  <Label htmlFor={`adaptation-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 現在の課題・悩み */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">現在困っていること・相談したいこと</h4>
            <Textarea 
              placeholder="業務上の困りごと、人間関係、体調面など、何でも記入してください"
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
              placeholder="例：環境整備の手順を完全に習得する、オムツ交換を自立して実施できるようになる"
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* 必要なサポート */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">組織・上司から必要なサポート</h4>
            <Textarea 
              placeholder="例：特定の介護技術の指導、シフト調整、メンタルサポートなど"
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
              placeholder="面談を通じて把握した職員の状況、成長度合い、今後の育成方針などを記入"
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
          className="bg-teal-600 hover:bg-teal-700 text-white px-8"
          onClick={() => onSubmit?.({})}
        >
          面談記録を保存
        </Button>
      </div>
    </div>
  );
}