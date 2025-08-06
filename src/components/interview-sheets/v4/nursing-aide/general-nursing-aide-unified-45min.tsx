'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Printer, FileText, MessageSquare, Target, Users, Heart, TrendingUp, Briefcase, Award } from 'lucide-react';

interface GeneralNursingAideUnified45MinProps {
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

export default function GeneralNursingAideUnified45Min({ 
  employeeData = {
    name: '',
    employeeId: '',
    department: '',
    position: '看護補助者',
    hireDate: ''
  },
  onSubmit,
  onSaveDraft 
}: GeneralNursingAideUnified45MinProps) {
  const currentDate = new Date().toLocaleDateString('ja-JP');
  
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-gray-50">
      {/* ヘッダー情報 */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            一般看護補助者 統合面談シート（45分版）
          </CardTitle>
          <p className="text-blue-100 text-sm mt-2">
            経験2-7年目の看護補助者向け - 詳細版
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
              一般看護補助者の専門性向上と指導力発展を支援し、キャリア形成と組織貢献を促進するための包括的な面談を実施します。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 1. 業務遂行状況の詳細評価（12分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            1. 業務遂行状況の詳細評価（12分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* 専門技術の熟練度 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">① 専門技術の熟練度</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">複雑な介護技術（移乗、体位変換、褥瘡予防等）</p>
                <RadioGroup className="space-y-2">
                  {['高度な技術で他者指導可能', '確実な技術で自立実施', '概ね自立実施', '一部介助が必要', '頻繁な介助が必要'].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(5-index)} id={`complex-${index}`} />
                      <Label htmlFor={`complex-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">認知症患者・精神症状への対応</p>
                <RadioGroup className="space-y-2">
                  {['専門的対応ができ指導可能', '適切な対応ができる', '基本的対応はできる', '対応に困ることが多い', '対応が困難'].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(5-index)} id={`dementia-${index}`} />
                      <Label htmlFor={`dementia-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">急変時・緊急時の対応</p>
                <RadioGroup className="space-y-2">
                  {['冷静に適切な対応ができる', '概ね適切な対応ができる', '基本的対応はできる', '対応に不安がある', '対応が困難'].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(5-index)} id={`emergency-${index}`} />
                      <Label htmlFor={`emergency-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* 業務効率・時間管理 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">② 業務効率・時間管理・優先順位付け</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '非常に効率的で、優先順位を適切に判断し余裕を持って完了' },
                { value: '4', label: '効率的に業務を遂行し、適切な優先順位付けができる' },
                { value: '3', label: '概ね時間内に業務を完了できる' },
                { value: '2', label: '時々時間管理や優先順位付けに課題がある' },
                { value: '1', label: '時間管理・優先順位付けに継続的な課題がある' }
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
            <h4 className="font-semibold text-gray-700 mb-3">③ 判断力・問題解決能力・提案力</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '的確に判断し、創意工夫のある解決策を提案できる' },
                { value: '4', label: '適切に判断し、解決策を提案できる' },
                { value: '3', label: '基本的な判断・問題解決はできる' },
                { value: '2', label: '判断に迷い、解決策の提案は少ない' },
                { value: '1', label: '判断力・問題解決能力に課題がある' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`judgment-${option.value}`} />
                  <Label htmlFor={`judgment-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 後輩指導・教育能力 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">④ 後輩指導・教育能力</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '体系的な指導ができ、後輩の成長を促進している' },
                { value: '4', label: '適切な指導ができ、後輩から信頼されている' },
                { value: '3', label: '求められれば指導できる' },
                { value: '2', label: '指導に消極的で、スキルも不十分' },
                { value: '1', label: '指導能力に課題があり、自分の業務で精一杯' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`mentor-${option.value}`} />
                  <Label htmlFor={`mentor-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* チームワーク・コミュニケーション */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">⑤ チームワーク・コミュニケーション・協調性</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '積極的に連携し、チームの結束力向上に貢献している' },
                { value: '4', label: '良好な連携・コミュニケーションができる' },
                { value: '3', label: '基本的な連携・コミュニケーションはできる' },
                { value: '2', label: '連携・コミュニケーションに一部課題がある' },
                { value: '1', label: '連携・コミュニケーションに大きな課題がある' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`teamwork-${option.value}`} />
                  <Label htmlFor={`teamwork-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 業務改善への取り組み */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">⑥ 業務改善への取り組み・創意工夫</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '積極的に改善提案し、実行に移している' },
                { value: '4', label: '改善提案を行い、実行に協力している' },
                { value: '3', label: '求められれば改善提案できる' },
                { value: '2', label: '改善提案には消極的' },
                { value: '1', label: '現状維持で改善意識が低い' }
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

      {/* 2. 現状確認・職場適応（12分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="h-5 w-5" />
            2. 現状確認・職場適応（12分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* 仕事への満足度・モチベーション */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">① 現在の仕事への満足度・モチベーション</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '非常に満足し、高いモチベーションを維持している' },
                { value: '4', label: '満足し、前向きに取り組んでいる' },
                { value: '3', label: '普通' },
                { value: '2', label: 'やや不満があり、モチベーション低下' },
                { value: '1', label: '大きな不満があり、モチベーションが低い' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`satisfaction-${option.value}`} />
                  <Label htmlFor={`satisfaction-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
            <div className="mt-3">
              <Textarea 
                placeholder="満足度・モチベーションに影響している具体的要因を記入"
                className="min-h-[80px] resize-none"
              />
            </div>
          </div>

          {/* 成長実感・達成感 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">② 成長実感・達成感</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '大きく成長し、高い達成感を得ている' },
                { value: '4', label: '成長と達成感を感じている' },
                { value: '3', label: 'ある程度成長している' },
                { value: '2', label: 'あまり成長・達成感を感じない' },
                { value: '1', label: '成長・達成感を実感できない' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`growth-${option.value}`} />
                  <Label htmlFor={`growth-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
            <div className="mt-3">
              <Textarea 
                placeholder="具体的な成長実感や達成した事柄を記入"
                className="min-h-[60px] resize-none"
              />
            </div>
          </div>

          {/* 職場環境・人間関係 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">③ 職場環境・人間関係</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">看護師・上司との関係</p>
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
                <p className="text-sm text-gray-600 mb-2">同僚（同世代）との関係</p>
                <RadioGroup className="space-y-1">
                  {['非常に良好', '良好', '普通', 'やや困難', '困難'].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(5-index)} id={`peer-rel-${index}`} />
                      <Label htmlFor={`peer-rel-${index}`}>{label}</Label>
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
              <div>
                <p className="text-sm text-gray-600 mb-2">患者・家族との関係</p>
                <RadioGroup className="space-y-1">
                  {['非常に良好', '良好', '普通', 'やや困難', '困難'].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(5-index)} id={`patient-rel-${index}`} />
                      <Label htmlFor={`patient-rel-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* ワークライフバランス */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">④ ワークライフバランス</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '非常に良好なバランスが取れている' },
                { value: '4', label: '良好なバランスが取れている' },
                { value: '3', label: '普通' },
                { value: '2', label: 'やや仕事が負担になっている' },
                { value: '1', label: 'プライベートに大きく影響している' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`balance-${option.value}`} />
                  <Label htmlFor={`balance-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* ストレス・健康状態 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">⑤ ストレス・健康状態</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '心身ともに健康でストレスは少ない' },
                { value: '4', label: '概ね健康でストレスは軽微' },
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
            <div className="mt-3">
              <Textarea 
                placeholder="ストレスの原因や健康面で気になることがあれば記入"
                className="min-h-[60px] resize-none"
              />
            </div>
          </div>

          {/* 現在の課題・要望 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">⑥ 現在の課題・改善要望</h4>
            <Textarea 
              placeholder="業務上の課題、職場環境の改善要望、人間関係の悩み、制度・システムへの要望など、詳細に記入してください"
              className="min-h-[120px] resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. キャリア開発・成長支援（12分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            3. キャリア開発・成長支援（12分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* スキル向上への意欲・学習姿勢 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">① スキル向上への意欲・学習姿勢</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '非常に高く、自主的に積極的な学習に取り組んでいる' },
                { value: '4', label: '高い意欲を持ち、計画的に学習している' },
                { value: '3', label: '普通の意欲があり、必要な学習は行う' },
                { value: '2', label: 'やや低く、受動的な学習が多い' },
                { value: '1', label: '意欲が低く、学習に消極的' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`skill-motivation-${option.value}`} />
                  <Label htmlFor={`skill-motivation-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 現在の強み・専門性 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">② 現在の強み・専門性</h4>
            <Textarea 
              placeholder="現在特に優れている技術・知識・能力、同僚から評価されている点などを記入"
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* 今後身につけたいスキル・専門性 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">③ 今後身につけたいスキル・専門性</h4>
            <Textarea 
              placeholder="例：リーダーシップスキル、専門的介護技術、コミュニケーション技術、教育指導スキル、問題解決能力など"
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* 希望する研修・教育機会 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">④ 希望する研修・教育機会</h4>
            <div className="space-y-2">
              {[
                '指導者研修・プリセプター研修',
                '専門的介護技術研修',
                'リーダーシップ・マネジメント研修',
                'コミュニケーション・接遇研修',
                '認知症ケア専門研修',
                '感染対策・安全管理研修',
                '業務改善・QC活動研修',
                '外部研修・学会参加',
                '資格取得支援',
                'その他'
              ].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <input type="checkbox" id={item} className="rounded" />
                  <Label htmlFor={item}>{item}</Label>
                </div>
              ))}
            </div>
            <Textarea 
              placeholder="その他、希望する研修や具体的な学習内容があれば記入"
              className="min-h-[60px] resize-none mt-2"
            />
          </div>

          {/* 将来のキャリアビジョン */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">⑤ 将来のキャリアビジョン（2-5年後）</h4>
            <Textarea 
              placeholder="目指すポジション（チームリーダー、主任等）、専門分野、他職種への転向希望、管理職への興味など"
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* キャリア形成上の課題・不安 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">⑥ キャリア形成上の課題・不安</h4>
            <Textarea 
              placeholder="キャリアアップに向けた課題、不安に感じること、必要な支援など"
              className="min-h-[80px] resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* 4. 詳細アクションプラン（6分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            4. 詳細アクションプラン（6分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* 短期目標（3ヶ月） */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">① 短期目標（次回面談・3ヶ月まで）</h4>
            <Textarea 
              placeholder="例：\n1. 新人2名の指導を担当し、基本技術の定着を支援する\n2. 認知症ケア研修を受講し、実践で活用する\n3. 業務改善提案を2つ以上行い、1つは実行に移す"
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* 中期目標（6ヶ月-1年） */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">② 中期目標（6ヶ月-1年）</h4>
            <Textarea 
              placeholder="例：\n1. チームリーダーとしての役割を担う\n2. 専門資格の取得を目指す\n3. 部署の業務改善プロジェクトに参画する"
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* 上司・組織からの支援内容 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">③ 上司・組織からの具体的支援内容</h4>
            <Textarea 
              placeholder="例：指導者研修への参加支援、OJT指導機会の提供、専門研修の受講機会、業務改善活動への参加支援、資格取得のサポートなど"
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* 目標達成のための具体的計画 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">④ 目標達成のための具体的計画</h4>
            <Textarea 
              placeholder="いつまでに、何を、どのように達成するかの具体的な計画を記入"
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* フォローアップ方法 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">⑤ フォローアップ・進捗確認方法</h4>
            <div className="space-y-2">
              {[
                '月次の進捗確認面談',
                '指導実績の定期評価',
                '研修成果の確認・報告',
                '目標達成度の数値測定',
                'チーム内での評価・フィードバック',
                '患者・家族からの評価収集',
                'その他'
              ].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <input type="checkbox" id={`follow-${item}`} className="rounded" />
                  <Label htmlFor={`follow-${item}`}>{item}</Label>
                </div>
              ))}
            </div>
            <Textarea 
              placeholder="その他の具体的なフォローアップ方法があれば記入"
              className="min-h-[60px] resize-none mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* 5. 面談者所見・総合評価（3分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            5. 面談者所見・総合評価（3分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* 総合所見 */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">① 総合所見</h4>
              <Textarea 
                placeholder="職員の総合的な評価、成長状況、強み・課題、今後の育成方針、キャリアサポート方針などを詳細に記入"
                className="min-h-[120px] resize-none"
              />
            </div>

            {/* 重点育成項目 */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">② 重点育成項目</h4>
              <Textarea 
                placeholder="今後重点的に育成すべき項目、優先的に取り組むべき課題を記入"
                className="min-h-[80px] resize-none"
              />
            </div>

            {/* 期待する役割・貢献 */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">③ 期待する役割・組織への貢献</h4>
              <Textarea 
                placeholder="今後期待する役割、チーム・組織への貢献内容を記入"
                className="min-h-[80px] resize-none"
              />
            </div>
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