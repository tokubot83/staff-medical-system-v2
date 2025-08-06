'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Printer, FileText, MessageSquare, Target, Users, Heart, TrendingUp } from 'lucide-react';

interface LeaderNursingAideUnified15MinProps {
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

export default function LeaderNursingAideUnified15Min({ 
  employeeData = {
    name: '',
    employeeId: '',
    department: '',
    position: '看護補助者リーダー',
    hireDate: ''
  },
  onSubmit,
  onSaveDraft 
}: LeaderNursingAideUnified15MinProps) {
  const currentDate = new Date().toLocaleDateString('ja-JP');
  
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-gray-50">
      {/* ヘッダー情報 */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            リーダー看護補助者 統合面談シート（15分版）
          </CardTitle>
          <p className="text-red-100 text-sm mt-2">
            チームリーダー・主任級看護補助者向け - 簡易版
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
          
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-sm text-red-800">
              <strong>面談の目的：</strong>
              リーダー看護補助者のマネジメント力とチーム運営状況を確認し、組織運営への貢献と更なるリーダーシップ向上を支援します。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 1. マネジメント・リーダーシップ評価（5分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-700 to-indigo-800 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            1. マネジメント・リーダーシップ評価（5分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* チーム統率力 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">チーム統率力・リーダーシップ</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '優れた統率力でチームを効果的に牽引している' },
                { value: '4', label: 'チームを適切に統率できている' },
                { value: '3', label: '基本的な統率はできている' },
                { value: '2', label: '統率に一部課題がある' },
                { value: '1', label: '統率力に大きな課題がある' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`leadership-${option.value}`} />
                  <Label htmlFor={`leadership-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 部下育成力 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">部下育成・人材開発力</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '部下の成長を効果的に促進し、優秀な人材を育成' },
                { value: '4', label: '部下の育成に積極的に取り組んでいる' },
                { value: '3', label: '基本的な部下育成はできている' },
                { value: '2', label: '部下育成に課題がある' },
                { value: '1', label: '部下育成が不十分' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`development-${option.value}`} />
                  <Label htmlFor={`development-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 業務改善・組織運営 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">業務改善・組織運営貢献</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '継続的に業務改善を推進し、組織運営に大きく貢献' },
                { value: '4', label: '積極的に業務改善・組織運営に貢献している' },
                { value: '3', label: '基本的な貢献はできている' },
                { value: '2', label: '貢献に一部課題がある' },
                { value: '1', label: '組織貢献が不十分' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`improvement-${option.value}`} />
                  <Label htmlFor={`improvement-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* 2. 現状確認（5分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-700 to-green-800 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="h-5 w-5" />
            2. 現状確認（5分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* リーダーとしての満足度 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">リーダーとしての満足度・やりがい</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '非常に高い満足感・やりがいを感じている' },
                { value: '4', label: '満足感・やりがいを感じている' },
                { value: '3', label: '普通' },
                { value: '2', label: 'やや物足りなさを感じている' },
                { value: '1', label: 'やりがいを感じられない' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`satisfaction-${option.value}`} />
                  <Label htmlFor={`satisfaction-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* マネジメント上の課題 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">現在のマネジメント上の課題</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '特に大きな課題はない' },
                { value: '4', label: '軽微な課題がある程度' },
                { value: '3', label: 'いくつかの課題がある' },
                { value: '2', label: '課題が多い' },
                { value: '1', label: '深刻な課題が多数ある' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`challenges-${option.value}`} />
                  <Label htmlFor={`challenges-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 具体的な課題・要望 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">具体的な課題・改善要望</h4>
            <Textarea 
              placeholder="チーム運営の課題、部下育成の悩み、組織運営への要望など、何でも記入してください"
              className="min-h-[80px] resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. アクションプラン（3分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-700 to-orange-800 text-white">
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
              placeholder="例：チーム生産性の向上、部下のスキル向上支援、業務プロセスの改善実施"
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* 必要なサポート */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">上司・組織から必要なサポート</h4>
            <Textarea 
              placeholder="例：マネジメント研修、権限の拡大、リソースの提供、上級職への昇進検討など"
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
              placeholder="リーダーとしての評価、マネジメント能力、今後の育成方針、昇進・昇格の検討などを記入"
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
          className="bg-red-600 hover:bg-red-700 text-white px-8"
          onClick={() => onSubmit?.({})}
        >
          面談記録を保存
        </Button>
      </div>
    </div>
  );
}