'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Printer, FileText, MessageSquare, Target, Users, Heart, TrendingUp } from 'lucide-react';

interface VeteranNursingAideUnified15MinProps {
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

export default function VeteranNursingAideUnified15Min({ 
  employeeData = {
    name: '',
    employeeId: '',
    department: '',
    position: '看護補助者',
    hireDate: ''
  },
  onSubmit,
  onSaveDraft 
}: VeteranNursingAideUnified15MinProps) {
  const currentDate = new Date().toLocaleDateString('ja-JP');
  
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-gray-50">
      {/* ヘッダー情報 */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            ベテラン看護補助者 統合面談シート（15分版）
          </CardTitle>
          <p className="text-purple-100 text-sm mt-2">
            経験8年以上の看護補助者向け - 簡易版
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
          
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
            <p className="text-sm text-purple-800">
              <strong>面談の目的：</strong>
              ベテラン看護補助者の専門性と組織貢献を評価し、メンタリング力の向上と継続的なモチベーション維持を支援します。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 1. 業務遂行状況の評価（5分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            1. 業務遂行状況の評価（5分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* 専門性・技術の深化 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">専門性・技術の深化度</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '高度な専門技術を持ち、組織全体の技術向上に貢献' },
                { value: '4', label: '優れた専門技術で複雑なケースにも対応可能' },
                { value: '3', label: '安定した高い技術レベルを維持' },
                { value: '2', label: '従来の技術レベルを維持している' },
                { value: '1', label: '技術面での更新・向上が必要' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`expertise-${option.value}`} />
                  <Label htmlFor={`expertise-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* メンタリング・指導力 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">メンタリング・指導力</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '優れた指導力で後進の成長を大きく促進' },
                { value: '4', label: '効果的な指導で後進から高い信頼を得ている' },
                { value: '3', label: '安定した指導ができている' },
                { value: '2', label: '基本的な指導はできる' },
                { value: '1', label: '指導への関心・積極性が低い' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`mentoring-${option.value}`} />
                  <Label htmlFor={`mentoring-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 組織貢献・リーダーシップ */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">組織貢献・リーダーシップ</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '組織全体の発展に大きく貢献している' },
                { value: '4', label: '部署・チームの中核として貢献している' },
                { value: '3', label: '安定した組織貢献をしている' },
                { value: '2', label: '求められれば貢献する' },
                { value: '1', label: '組織貢献への意識が低い' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`contribution-${option.value}`} />
                  <Label htmlFor={`contribution-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* 2. 現状確認（5分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="h-5 w-5" />
            2. 現状確認（5分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* 仕事への満足度・やりがい */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">現在の仕事への満足度・やりがい</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '非常に高い満足感・やりがいを感じている' },
                { value: '4', label: '満足感・やりがいを感じている' },
                { value: '3', label: '普通' },
                { value: '2', label: 'やや物足りなさを感じている' },
                { value: '1', label: 'やりがいを見出せない状況' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`satisfaction-${option.value}`} />
                  <Label htmlFor={`satisfaction-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 継続勤務への意欲 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">継続勤務への意欲</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '長期的に継続勤務したい' },
                { value: '4', label: '継続勤務したい' },
                { value: '3', label: '現状維持で良い' },
                { value: '2', label: '迷いがある' },
                { value: '1', label: '他の選択肢を考えている' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`continuity-${option.value}`} />
                  <Label htmlFor={`continuity-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 現在の課題・要望 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">現在の課題・要望</h4>
            <Textarea 
              placeholder="業務上の課題、職場環境の改善要望、新たなチャレンジへの希望など、何でも記入してください"
              className="min-h-[80px] resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. アクションプラン（3分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
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
              placeholder="例：新人指導プログラムの改善提案、専門技術の更なる向上、組織改善活動への参画"
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* 必要なサポート */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">組織・上司から必要なサポート</h4>
            <Textarea 
              placeholder="例：新たな役割・責任の付与、専門研修の機会、働き方の調整、処遇改善など"
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
              placeholder="ベテラン職員としての貢献度、今後の活用方針、モチベーション維持策などを記入"
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
          className="bg-purple-600 hover:bg-purple-700 text-white px-8"
          onClick={() => onSubmit?.({})}
        >
          面談記録を保存
        </Button>
      </div>
    </div>
  );
}