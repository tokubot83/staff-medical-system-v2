'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Printer, FileText, MessageSquare, Target, Users, Heart, TrendingUp, Briefcase } from 'lucide-react';

interface GeneralNursingAideUnified30MinProps {
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

export default function GeneralNursingAideUnified30Min({ 
  employeeData = {
    name: '',
    employeeId: '',
    department: '',
    position: '看護補助者',
    hireDate: ''
  },
  onSubmit,
  onSaveDraft 
}: GeneralNursingAideUnified30MinProps) {
  const currentDate = new Date().toLocaleDateString('ja-JP');
  
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-gray-50">
      {/* ヘッダー情報 */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            一般看護補助者 統合面談シート（30分版）
          </CardTitle>
          <p className="text-blue-100 text-sm mt-2">
            経験2-7年目の看護補助者向け - 標準版
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
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-800">
              <strong>面談の目的：</strong>
              一般看護補助者の技術習熟度を確認し、キャリア発展と後輩指導力の向上を支援するとともに、必要なサポートを提供します。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 1. 業務遂行状況の評価（8分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            1. 業務遂行状況の評価（8分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* 専門技術の熟練度 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">① 専門技術の熟練度</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">複雑な介護技術（移乗、体位変換等）</p>
                <RadioGroup className="space-y-2">
                  {['高度な技術で指導できる', '確実な技術で自立実施', '概ね自立実施', '一部介助が必要'].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(4-index)} id={`complex-${index}`} />
                      <Label htmlFor={`complex-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">認知症患者への対応</p>
                <RadioGroup className="space-y-2">
                  {['専門的対応ができ指導可能', '適切な対応ができる', '基本的対応はできる', '対応に困ることが多い'].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(4-index)} id={`dementia-${index}`} />
                      <Label htmlFor={`dementia-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* 業務効率・時間管理 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">② 業務効率・時間管理</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '非常に効率的で、時間内に余裕を持って完了できる' },
                { value: '4', label: '効率的に業務を遂行できる' },
                { value: '3', label: '概ね時間内に業務を完了できる' },
                { value: '2', label: '時々時間管理に課題がある' },
                { value: '1', label: '時間管理に継続的な課題がある' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`efficiency-${option.value}`} />
                  <Label htmlFor={`efficiency-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 判断力・問題解決能力 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">③ 判断力・問題解決能力</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '適切に判断し、解決策を提案できる' },
                { value: '4', label: '概ね適切な判断ができる' },
                { value: '3', label: '基本的な判断はできる' },
                { value: '2', label: '判断に迷うことがある' },
                { value: '1', label: '判断力に課題がある' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`judgment-${option.value}`} />
                  <Label htmlFor={`judgment-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 後輩指導・チーム貢献 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">④ 後輩指導・チーム貢献</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '積極的に後輩指導し、チームに大きく貢献している' },
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

      {/* 2. 現状確認（8分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="h-5 w-5" />
            2. 現状確認（8分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* 仕事への満足度・モチベーション */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">① 現在の仕事への満足度・モチベーション</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '非常に満足し、高いモチベーションを維持している' },
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
            <div className="mt-2">
              <Textarea 
                placeholder="満足度・モチベーションに影響している要因があれば記入"
                className="min-h-[60px] resize-none"
              />
            </div>
          </div>

          {/* 成長実感 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">② 成長実感</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '大きく成長していると実感している' },
                { value: '4', label: '成長していると感じる' },
                { value: '3', label: 'ある程度成長している' },
                { value: '2', label: 'あまり成長を感じない' },
                { value: '1', label: '成長を実感できない' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`growth-${option.value}`} />
                  <Label htmlFor={`growth-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 職場環境・人間関係 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">③ 職場環境・人間関係</h4>
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
                <p className="text-sm text-gray-600 mb-2">後輩・新人との関係</p>
                <RadioGroup className="space-y-1">
                  {['非常に良好', '良好', '普通', 'やや困難', '困難'].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(5-index)} id={`junior-rel-${index}`} />
                      <Label htmlFor={`junior-rel-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* ストレス・健康状態 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">④ ストレス・健康状態</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '心身ともに健康でストレスは少ない' },
                { value: '4', label: '概ね健康' },
                { value: '3', label: '軽度の疲労・ストレスあり' },
                { value: '2', label: '中程度の疲労・ストレスあり' },
                { value: '1', label: '強い疲労・ストレスを感じている' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`health-${option.value}`} />
                  <Label htmlFor={`health-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 現在の課題・要望 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">⑤ 現在の課題・要望</h4>
            <Textarea 
              placeholder="業務上の課題、職場環境の改善要望、研修希望など、何でも記入してください"
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
          {/* スキル向上への意欲 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">① スキル向上への意欲</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '非常に高く、自主的に学習に取り組んでいる' },
                { value: '4', label: '高い意欲を持っている' },
                { value: '3', label: '普通の意欲がある' },
                { value: '2', label: 'やや低い' },
                { value: '1', label: '意欲が低い' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`skill-motivation-${option.value}`} />
                  <Label htmlFor={`skill-motivation-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 今後身につけたいスキル */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">② 今後身につけたいスキル・知識</h4>
            <Textarea 
              placeholder="例：リーダーシップスキル、専門的介護技術、コミュニケーション技術、教育指導スキルなど"
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* 希望する研修・教育 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">③ 希望する研修・教育</h4>
            <div className="space-y-2">
              {[
                '指導者研修',
                '専門的介護技術研修',
                'リーダーシップ研修',
                'コミュニケーション研修',
                '認知症ケア研修',
                '感染対策研修',
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

          {/* 将来のキャリアビジョン */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">④ 将来のキャリアビジョン（2-5年後）</h4>
            <Textarea 
              placeholder="目指すポジション、専門分野、チームリーダーへの希望など"
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
          {/* 次回面談までの具体的目標 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">① 次回面談までの具体的目標（2-3個）</h4>
            <Textarea 
              placeholder="例：\n1. 新人1名の指導を担当し、基本技術を教える\n2. 認知症ケア研修を受講し、実践で活用する\n3. 業務効率化の提案を1つ以上行う"
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* 上司・組織からの支援内容 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">② 上司・組織からの支援内容</h4>
            <Textarea 
              placeholder="例：指導者研修への参加支援、OJT指導の機会提供、専門研修の受講機会など"
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* フォローアップ方法 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">③ フォローアップ方法</h4>
            <div className="space-y-2">
              {[
                '月次の進捗確認面談',
                '指導実績の定期評価',
                '研修成果の確認',
                '目標達成度の測定',
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
              placeholder="職員の技術レベル、成長状況、指導力、今後の育成方針、キャリアサポートなどを記入"
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          onClick={() => onSubmit?.({})}
        >
          面談記録を保存
        </Button>
      </div>
    </div>
  );
}