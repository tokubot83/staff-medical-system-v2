'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Printer, FileText, MessageSquare, Target, Users, Heart, TrendingUp, Briefcase } from 'lucide-react';

interface VeteranNursingAideUnified30MinProps {
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

export default function VeteranNursingAideUnified30Min({ 
  employeeData = {
    name: '',
    employeeId: '',
    department: '',
    position: '看護補助者',
    hireDate: ''
  },
  onSubmit,
  onSaveDraft 
}: VeteranNursingAideUnified30MinProps) {
  const currentDate = new Date().toLocaleDateString('ja-JP');
  
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-gray-50">
      {/* ヘッダー情報 */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            ベテラン看護補助者 統合面談シート（30分版）
          </CardTitle>
          <p className="text-purple-100 text-sm mt-2">
            経験8年以上の看護補助者向け - 標準版
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
              <label className="block text-sm font-medium text-gray-600">入職日</label>
              <p className="mt-1 font-semibold">{employeeData.hireDate || '___________'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">面談日</label>
              <p className="mt-1 font-semibold">{currentDate}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">面談種別</label>
              <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md">
                <option>定期面談</option>
                <option>目標設定面談</option>
                <option>中間面談</option>
                <option>評価面談</option>
                <option>随時面談</option>
              </select>
            </div>
          </div>
          
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
            <p className="text-sm text-purple-800">
              <strong>面談の目的：</strong>
              ベテラン看護補助者の専門性深化と組織貢献を評価し、継続的な成長とメンタリング力向上を支援します。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 1. 業務遂行状況の評価（8分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            1. 業務遂行状況の評価（8分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* 専門性・技術の深化 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">① 専門性・技術の深化度</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '高度な専門技術を持ち、組織全体の技術向上に大きく貢献' },
                { value: '4', label: '優れた専門技術で複雑なケースにも確実に対応' },
                { value: '3', label: '安定した高い技術レベルを維持している' },
                { value: '2', label: '従来の技術レベルは維持している' },
                { value: '1', label: '技術面での更新・向上が必要' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`expertise-${option.value}`} />
                  <Label htmlFor={`expertise-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
            <div className="mt-2">
              <Textarea 
                placeholder="特に優れている専門技術や最近習得した技術があれば記入"
                className="min-h-[60px] resize-none"
              />
            </div>
          </div>

          {/* メンタリング・指導力 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">② メンタリング・指導力</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '優れた指導力で後進の成長を大きく促進している' },
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

          {/* 業務改善・提案力 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">③ 業務改善・提案力</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '継続的に有効な改善提案を行い、実行に導いている' },
                { value: '4', label: '定期的に改善提案を行っている' },
                { value: '3', label: '時々改善提案を行う' },
                { value: '2', label: '求められれば改善提案できる' },
                { value: '1', label: '改善提案には消極的' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`improvement-${option.value}`} />
                  <Label htmlFor={`improvement-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 組織貢献・リーダーシップ */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">④ 組織貢献・リーダーシップ</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '組織全体の発展に大きく貢献し、リーダーシップを発揮' },
                { value: '4', label: '部署・チームの中核として積極的に貢献' },
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

          {/* 問題解決・危機管理能力 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">⑤ 問題解決・危機管理能力</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '優れた判断力で的確に問題解決・危機管理ができる' },
                { value: '4', label: '適切な問題解決・危機管理ができる' },
                { value: '3', label: '標準的な問題解決・危機管理はできる' },
                { value: '2', label: '基本的な対応はできる' },
                { value: '1', label: '問題解決・危機管理に課題がある' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`crisis-${option.value}`} />
                  <Label htmlFor={`crisis-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* 2. 現状確認（8分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="h-5 w-5" />
            2. 現状確認（8分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* 仕事への満足度・やりがい */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">① 現在の仕事への満足度・やりがい</h4>
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
            <div className="mt-2">
              <Textarea 
                placeholder="満足感・やりがいの源泉や影響要因を記入"
                className="min-h-[60px] resize-none"
              />
            </div>
          </div>

          {/* 専門職としての誇り・自己効力感 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">② 専門職としての誇り・自己効力感</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '強い職業的誇りと高い自己効力感を持っている' },
                { value: '4', label: '職業的誇りと自己効力感を感じている' },
                { value: '3', label: 'ある程度の誇りと自己効力感がある' },
                { value: '2', label: 'やや誇り・自己効力感が低下している' },
                { value: '1', label: '誇り・自己効力感を感じられない' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`pride-${option.value}`} />
                  <Label htmlFor={`pride-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 継続勤務への意欲 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">③ 継続勤務への意欲・将来展望</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '長期的に継続勤務し、更なる貢献をしたい' },
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

          {/* 職場環境・待遇への評価 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">④ 職場環境・待遇への評価</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '非常に満足している' },
                { value: '4', label: '満足している' },
                { value: '3', label: '普通' },
                { value: '2', label: 'やや不満がある' },
                { value: '1', label: '大きな不満がある' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`environment-${option.value}`} />
                  <Label htmlFor={`environment-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 現在の課題・要望 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">⑤ 現在の課題・改善要望</h4>
            <Textarea 
              placeholder="業務上の課題、職場環境の改善要望、新たなチャレンジへの希望、処遇改善の要望など、詳細に記入してください"
              className="min-h-[100px] resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. キャリア・役割発展（8分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            3. キャリア・役割発展（8分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* 専門性の更なる向上意欲 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">① 専門性の更なる向上意欲</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '非常に高く、積極的に新しい知識・技術を習得したい' },
                { value: '4', label: '高い意欲を持っている' },
                { value: '3', label: '必要に応じて学習したい' },
                { value: '2', label: '現状維持で良い' },
                { value: '1', label: '新しい学習には消極的' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`learning-${option.value}`} />
                  <Label htmlFor={`learning-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 希望する新しい役割・責任 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">② 希望する新しい役割・責任</h4>
            <Textarea 
              placeholder="例：チームリーダー、新人教育担当、業務改善委員、プロジェクトリーダーなど"
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* 専門分野・得意領域の発展 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">③ 専門分野・得意領域の更なる発展</h4>
            <Textarea 
              placeholder="現在の得意分野を活かしてさらに発展させたい領域、新たに挑戦したい分野など"
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* 組織への貢献方法 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">④ 今後の組織への貢献方法</h4>
            <Textarea 
              placeholder="ベテランとしての経験を活かした組織貢献の方法、後進育成への関わり方など"
              className="min-h-[80px] resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* 4. アクションプラン（4分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            4. 今後のアクションプラン（4分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* 次回面談までの目標 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">① 次回面談までの具体的目標（2-3個）</h4>
            <Textarea 
              placeholder="例：\n1. 新人指導プログラムの改善提案と実行\n2. 専門技術の更なる向上（具体的な技術名）\n3. 組織改善活動への積極的参画"
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* 上司・組織からの支援内容 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">② 上司・組織からの支援内容</h4>
            <Textarea 
              placeholder="例：新たな役割・責任の付与、専門研修の機会提供、働き方の調整、処遇改善の検討など"
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* フォローアップ方法 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">③ フォローアップ方法</h4>
            <div className="space-y-2">
              {[
                '月次の進捗確認面談',
                '専門性向上の評価',
                '組織貢献度の測定',
                '満足度・モチベーションの確認',
                'その他'
              ].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <input type="checkbox" id={`follow-${item}`} className="rounded" />
                  <Label htmlFor={`follow-${item}`}>{item}</Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. 面談者所見（2分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            5. 面談者所見（2分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">総合所見</h4>
            <Textarea 
              placeholder="ベテラン職員としての貢献度、今後の活用方針、モチベーション維持策、キャリア支援方針などを記入"
              className="min-h-[120px] resize-none"
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

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">面談同席者（任意）</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="同席者がいる場合は氏名・役職を記入"
            />
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