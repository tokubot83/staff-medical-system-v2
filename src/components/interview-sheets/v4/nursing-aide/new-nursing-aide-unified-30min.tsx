'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Printer, FileText, MessageSquare, Target, Users, Heart, TrendingUp, Briefcase } from 'lucide-react';

interface NewNursingAideUnified30MinProps {
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

export default function NewNursingAideUnified30Min({ 
  employeeData = {
    name: '',
    employeeId: '',
    department: '',
    position: '看護補助者',
    hireDate: ''
  },
  onSubmit,
  onSaveDraft 
}: NewNursingAideUnified30MinProps) {
  const currentDate = new Date().toLocaleDateString('ja-JP');
  
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-gray-50">
      {/* ヘッダー情報 */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            新人看護補助者 統合面談シート（30分版）
          </CardTitle>
          <p className="text-teal-100 text-sm mt-2">
            入職1年目の看護補助者向け - 標準版
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
          
          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded">
            <p className="text-sm text-teal-800">
              <strong>面談の目的：</strong>
              新人看護補助者の成長を支援し、業務習得状況を確認するとともに、職場適応を促進し、必要な教育・サポートを提供します。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 1. 業務遂行状況の評価（8分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            1. 業務遂行状況の評価（8分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* 基礎的介護技術の習得度 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">① 基礎的介護技術の習得度</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">環境整備（ベッドメイキング、病室清掃等）</p>
                <RadioGroup className="space-y-2">
                  {['自立して実施可能', '概ね自立', '一部介助が必要', '常に介助が必要'].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(4-index)} id={`env-${index}`} />
                      <Label htmlFor={`env-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">清潔援助（入浴介助、清拭、寝衣交換等）</p>
                <RadioGroup className="space-y-2">
                  {['自立して実施可能', '概ね自立', '一部介助が必要', '常に介助が必要'].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(4-index)} id={`clean-${index}`} />
                      <Label htmlFor={`clean-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">食事援助（配膳、摂取介助、下膳等）</p>
                <RadioGroup className="space-y-2">
                  {['自立して実施可能', '概ね自立', '一部介助が必要', '常に介助が必要'].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(4-index)} id={`meal-${index}`} />
                      <Label htmlFor={`meal-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">排泄援助（オムツ交換、陰部洗浄等）</p>
                <RadioGroup className="space-y-2">
                  {['自立して実施可能', '概ね自立', '一部介助が必要', '常に介助が必要'].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(4-index)} id={`excretion-${index}`} />
                      <Label htmlFor={`excretion-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* 安全管理・感染対策 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">② 安全管理・感染対策の実践</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '標準予防策を完全に理解し、常に適切に実践している' },
                { value: '4', label: '概ね適切に実践できている' },
                { value: '3', label: '基本的な実践はできているが、時々指導が必要' },
                { value: '2', label: '理解が不十分で、頻繁に指導が必要' },
                { value: '1', label: '基本的な理解が不足している' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`safety-${option.value}`} />
                  <Label htmlFor={`safety-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* コミュニケーション */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">③ 患者・家族とのコミュニケーション</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '適切で温かいコミュニケーションができる' },
                { value: '4', label: '概ね適切なコミュニケーションができる' },
                { value: '3', label: '基本的なコミュニケーションはできる' },
                { value: '2', label: 'コミュニケーションに消極的' },
                { value: '1', label: 'コミュニケーションに大きな課題がある' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`comm-${option.value}`} />
                  <Label htmlFor={`comm-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* チームワーク */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">④ チームワーク・報告連絡相談</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '積極的に連携し、適時適切な報告ができる' },
                { value: '4', label: '必要な連携・報告ができる' },
                { value: '3', label: '基本的な連携・報告はできる' },
                { value: '2', label: '報告が遅れることがある' },
                { value: '1', label: '連携・報告が不十分' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`team-${option.value}`} />
                  <Label htmlFor={`team-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 学習姿勢 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">⑤ 学習姿勢・成長意欲</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '非常に積極的で、自主的に学習している' },
                { value: '4', label: '積極的に学習に取り組んでいる' },
                { value: '3', label: '指示された学習には取り組む' },
                { value: '2', label: '学習への取り組みが消極的' },
                { value: '1', label: '学習意欲が低い' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`learn-${option.value}`} />
                  <Label htmlFor={`learn-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* 2. 現状確認（8分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="h-5 w-5" />
            2. 現状確認（8分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* モチベーション */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">① 現在のモチベーション</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '非常に高く、仕事に誇りを感じている' },
                { value: '4', label: '高く、前向きに取り組んでいる' },
                { value: '3', label: '普通' },
                { value: '2', label: 'やや低下している' },
                { value: '1', label: '大きく低下している' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`motivation-${option.value}`} />
                  <Label htmlFor={`motivation-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
            <div className="mt-2">
              <Textarea 
                placeholder="モチベーションに影響している要因があれば記入"
                className="min-h-[60px] resize-none"
              />
            </div>
          </div>

          {/* 職場適応 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">② 職場への適応状況</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '非常によく適応し、職場に馴染んでいる' },
                { value: '4', label: 'よく適応している' },
                { value: '3', label: '概ね適応している' },
                { value: '2', label: '適応に一部困難がある' },
                { value: '1', label: '適応に大きな困難がある' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`adaptation-${option.value}`} />
                  <Label htmlFor={`adaptation-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 人間関係 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">③ 職場の人間関係</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">看護師との関係</p>
                <RadioGroup className="space-y-1">
                  {['非常に良好', '良好', '普通', 'やや困難', '困難'].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(5-index)} id={`nurse-rel-${index}`} />
                      <Label htmlFor={`nurse-rel-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">同僚（他の看護補助者）との関係</p>
                <RadioGroup className="space-y-1">
                  {['非常に良好', '良好', '普通', 'やや困難', '困難'].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(5-index)} id={`colleague-rel-${index}`} />
                      <Label htmlFor={`colleague-rel-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* 健康状態 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">④ 健康状態・ストレス</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '心身ともに健康' },
                { value: '4', label: '概ね健康' },
                { value: '3', label: '軽度の疲労・ストレスあり' },
                { value: '2', label: '中程度の疲労・ストレスあり' },
                { value: '1', label: '強い疲労・ストレスあり' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`health-${option.value}`} />
                  <Label htmlFor={`health-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 現在の課題・悩み */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">⑤ 現在困っていること・相談したいこと</h4>
            <Textarea 
              placeholder="業務上の困りごと、人間関係、体調面、プライベートとの両立など、何でも記入してください"
              className="min-h-[100px] resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. キャリア開発・成長支援（8分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            3. キャリア開発・成長支援（8分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* 成長実感 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">① 入職からの成長実感</h4>
            <Textarea 
              placeholder="入職時と比べて成長したと感じること、できるようになったことを記入"
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* 今後の目標 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">② 今後身につけたいスキル・知識</h4>
            <Textarea 
              placeholder="例：移乗介助の技術向上、認知症ケアの知識、コミュニケーション技術など"
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* 必要な研修・教育 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">③ 希望する研修・教育</h4>
            <div className="space-y-2">
              {[
                '基礎介護技術研修',
                '感染対策研修',
                '安全管理研修',
                'コミュニケーション研修',
                '認知症ケア研修',
                'その他'
              ].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <input type="checkbox" id={item} className="rounded" />
                  <Label htmlFor={item}>{item}</Label>
                </div>
              ))}
            </div>
            <Textarea 
              placeholder="その他、希望する研修があれば記入"
              className="min-h-[60px] resize-none mt-2"
            />
          </div>

          {/* 将来のビジョン */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">④ 将来のキャリアビジョン（1-3年後）</h4>
            <Textarea 
              placeholder="看護補助者として目指す姿、興味のある分野などを記入"
              className="min-h-[80px] resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* 4. アクションプラン（4分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
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
              placeholder="例：\n1. 排泄援助を自立して実施できるようになる\n2. 患者様への声かけを積極的に行う\n3. 感染対策の手順を完全に習得する"
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* 上司からのサポート */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">② 上司・組織からの支援内容</h4>
            <Textarea 
              placeholder="例：週1回の技術指導、OJTの実施、メンター制度の活用など"
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* フォローアップ */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">③ フォローアップ方法</h4>
            <div className="space-y-2">
              {[
                '週次の振り返り面談',
                '月次の進捗確認',
                '日々の声かけ・観察',
                'チェックリストによる評価',
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
              placeholder="面談を通じて把握した職員の状況、成長度合い、強み・課題、今後の育成方針などを記入"
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
          className="bg-teal-600 hover:bg-teal-700 text-white px-8"
          onClick={() => onSubmit?.({})}
        >
          面談記録を保存
        </Button>
      </div>
    </div>
  );
}