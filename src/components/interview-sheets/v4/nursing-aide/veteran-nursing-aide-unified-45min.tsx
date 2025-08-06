'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Printer, FileText, MessageSquare, Target, Users, Heart, TrendingUp, Briefcase, Award, Shield } from 'lucide-react';

interface VeteranNursingAideUnified45MinProps {
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

export default function VeteranNursingAideUnified45Min({ 
  employeeData = {
    name: '',
    employeeId: '',
    department: '',
    position: '看護補助者',
    hireDate: ''
  },
  onSubmit,
  onSaveDraft 
}: VeteranNursingAideUnified45MinProps) {
  const currentDate = new Date().toLocaleDateString('ja-JP');
  
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-gray-50">
      {/* ヘッダー情報 */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            ベテラン看護補助者 統合面談シート（45分版）
          </CardTitle>
          <p className="text-purple-100 text-sm mt-2">
            経験8年以上の看護補助者向け - 詳細版
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
              ベテラン看護補助者の豊富な経験を活かした組織貢献と専門性の更なる発展、そして持続可能なキャリア形成を包括的に支援します。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 1. 専門性・業務遂行の詳細評価（12分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            1. 専門性・業務遂行の詳細評価（12分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* 高度専門技術の習得・指導 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">① 高度専門技術の習得・指導レベル</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">複雑・困難事例への対応技術</p>
                <RadioGroup className="space-y-2">
                  {['エキスパートレベルで他者を指導可能', '高度な技術で確実に対応可能', '標準以上の技術で対応可能', '基本的な対応は可能', '対応に困難を感じる'].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(5-index)} id={`advanced-${index}`} />
                      <Label htmlFor={`advanced-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">専門的認知症・精神症状対応</p>
                <RadioGroup className="space-y-2">
                  {['専門的知識で包括的対応・指導可能', '適切な専門対応ができる', '基本的専門対応はできる', '対応に不安がある', '専門対応が困難'].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(5-index)} id={`dementia-${index}`} />
                      <Label htmlFor={`dementia-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">緊急・危機状況での判断・対応</p>
                <RadioGroup className="space-y-2">
                  {['的確な判断で迅速・適切な対応ができる', '冷静に適切な対応ができる', '概ね適切な対応ができる', '対応に一部不安がある', '対応が困難'].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(5-index)} id={`emergency-${index}`} />
                      <Label htmlFor={`emergency-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* メンタリング・教育能力 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">② メンタリング・教育能力</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '体系的・効果的な教育プログラムを構築し、後進を大きく成長させている' },
                { value: '4', label: '優れた指導力で後進の成長を促進し、高い信頼を得ている' },
                { value: '3', label: '安定した指導ができ、後進から信頼されている' },
                { value: '2', label: '基本的な指導はできるが、体系性に課題' },
                { value: '1', label: '指導への関心・積極性・能力に課題がある' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`mentoring-${option.value}`} />
                  <Label htmlFor={`mentoring-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
            <div className="mt-3">
              <Textarea 
                placeholder="具体的な指導実績や後進育成の成果があれば記入"
                className="min-h-[60px] resize-none"
              />
            </div>
          </div>

          {/* 業務改善・イノベーション */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">③ 業務改善・イノベーション創出</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '革新的な改善案を継続的に提案し、組織変革を推進' },
                { value: '4', label: '効果的な改善提案を定期的に行い、実行に導いている' },
                { value: '3', label: '時々有効な改善提案を行う' },
                { value: '2', label: '求められれば改善提案できる' },
                { value: '1', label: '改善提案には消極的' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`innovation-${option.value}`} />
                  <Label htmlFor={`innovation-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 組織貢献・リーダーシップ */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">④ 組織貢献・リーダーシップ発揮</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '組織全体の発展に大きく貢献し、強いリーダーシップを発揮' },
                { value: '4', label: '部署・チームの中核として積極的に貢献し、リーダーシップを発揮' },
                { value: '3', label: '安定した組織貢献をしている' },
                { value: '2', label: '求められれば貢献するが積極性に欠ける' },
                { value: '1', label: '組織貢献への意識・能力に課題がある' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`leadership-${option.value}`} />
                  <Label htmlFor={`leadership-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 知識・技術の伝承 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">⑤ 知識・技術の伝承・組織的共有</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '豊富な経験・知識を体系化し、組織全体に効果的に伝承' },
                { value: '4', label: '経験・知識を積極的に共有し、組織の財産化に貢献' },
                { value: '3', label: '求められれば経験・知識を共有する' },
                { value: '2', label: '知識共有に消極的' },
                { value: '1', label: '知識伝承への意識が低い' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`knowledge-${option.value}`} />
                  <Label htmlFor={`knowledge-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 品質管理・標準化推進 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">⑥ 品質管理・標準化推進</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: 'ケア品質の標準化を主導し、継続的改善を推進' },
                { value: '4', label: '品質管理に積極的に関与し、標準化に貢献' },
                { value: '3', label: '品質管理の重要性を理解し、協力的' },
                { value: '2', label: '品質管理への関心がやや低い' },
                { value: '1', label: '品質管理・標準化への意識が低い' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`quality-${option.value}`} />
                  <Label htmlFor={`quality-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* 2. 職業的成熟度・満足度（12分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="h-5 w-5" />
            2. 職業的成熟度・満足度（12分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* 職業的アイデンティティ・誇り */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">① 職業的アイデンティティ・誇り</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '強固な職業的誇りを持ち、専門職としての使命感が非常に高い' },
                { value: '4', label: '職業的誇りと使命感を持っている' },
                { value: '3', label: 'ある程度の職業的誇りがある' },
                { value: '2', label: '職業的誇りがやや低下している' },
                { value: '1', label: '職業的誇り・使命感を感じられない' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`identity-${option.value}`} />
                  <Label htmlFor={`identity-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 仕事への満足度・やりがい */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">② 現在の仕事への満足度・やりがい</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '非常に高い満足感・深いやりがいを感じている' },
                { value: '4', label: '満足感・やりがいを感じている' },
                { value: '3', label: '普通' },
                { value: '2', label: 'やや物足りなさ・マンネリ感がある' },
                { value: '1', label: 'やりがいを見出せない・退屈感がある' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`satisfaction-${option.value}`} />
                  <Label htmlFor={`satisfaction-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
            <div className="mt-3">
              <Textarea 
                placeholder="満足感・やりがいの具体的な源泉や変化要因を記入"
                className="min-h-[80px] resize-none"
              />
            </div>
          </div>

          {/* 自己効力感・達成感 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">③ 自己効力感・達成感</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '高い自己効力感を持ち、大きな達成感を得ている' },
                { value: '4', label: '自己効力感・達成感を感じている' },
                { value: '3', label: 'ある程度の自己効力感・達成感がある' },
                { value: '2', label: '自己効力感・達成感がやや低下' },
                { value: '1', label: '自己効力感・達成感を感じられない' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`efficacy-${option.value}`} />
                  <Label htmlFor={`efficacy-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 継続勤務意欲・将来展望 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">④ 継続勤務意欲・将来展望</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '長期的継続勤務を希望し、明確な将来展望がある' },
                { value: '4', label: '継続勤務を希望している' },
                { value: '3', label: '現状維持で良い' },
                { value: '2', label: '将来に迷いがある' },
                { value: '1', label: '他の選択肢を積極的に考えている' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`continuity-${option.value}`} />
                  <Label htmlFor={`continuity-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* ワークライフバランス・健康状態 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">⑤ ワークライフバランス・健康状態</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">ワークライフバランス</p>
                <RadioGroup className="space-y-1">
                  {['非常に良好', '良好', '普通', 'やや困難', '困難'].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(5-index)} id={`balance-${index}`} />
                      <Label htmlFor={`balance-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">心身の健康状態</p>
                <RadioGroup className="space-y-1">
                  {['非常に良好', '良好', '普通', 'やや不調', '不調'].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(5-index)} id={`health-${index}`} />
                      <Label htmlFor={`health-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* 職場環境・待遇への評価 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">⑥ 職場環境・待遇への総合評価</h4>
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
            <div className="mt-3">
              <Textarea 
                placeholder="職場環境・待遇についての具体的な評価や改善要望を記入"
                className="min-h-[80px] resize-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. 継続的成長・専門性発展（12分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            3. 継続的成長・専門性発展（12分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* 学習意欲・自己啓発 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">① 継続学習意欲・自己啓発</h4>
            <RadioGroup className="space-y-2">
              {[
                { value: '5', label: '非常に高い学習意欲で、自主的・継続的に自己啓発している' },
                { value: '4', label: '高い学習意欲を持ち、計画的に自己啓発している' },
                { value: '3', label: '必要に応じて学習・自己啓発している' },
                { value: '2', label: '学習意欲・自己啓発への関心がやや低い' },
                { value: '1', label: '学習・自己啓発に消極的' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`learning-${option.value}`} />
                  <Label htmlFor={`learning-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 現在の専門領域での深化 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">② 現在の専門領域での更なる深化</h4>
            <Textarea 
              placeholder="現在得意としている領域で、さらに極めたい技術・知識、目指したい専門性のレベルを記入"
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* 新しい専門領域への挑戦 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">③ 新しい専門領域・分野への挑戦意欲</h4>
            <Textarea 
              placeholder="新たに挑戦してみたい専門分野、習得したい技術・知識、興味のある領域を記入"
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* 希望する役割・責任の拡大 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">④ 希望する役割・責任の拡大</h4>
            <Textarea 
              placeholder="例：チーム・部署のリーダー、専門委員会委員、新人教育責任者、業務改善プロジェクトリーダーなど"
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* 組織・社会への貢献方法 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">⑤ 今後の組織・社会への貢献方法</h4>
            <Textarea 
              placeholder="ベテランとしての豊富な経験・知識をどのように活かして組織や社会に貢献したいか"
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* 希望する研修・教育機会 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">⑥ 希望する研修・教育機会</h4>
            <div className="space-y-2">
              {[
                '上級指導者・エデュケーター研修',
                '専門認定資格取得支援',
                'マネジメント・リーダーシップ研修',
                '業務改善・QI（品質改善）研修',
                '学会・研究会参加支援',
                '他施設・他職種見学・交流',
                '講師・指導者養成研修',
                'コンサルタント・アドバイザー研修',
                '起業・独立支援プログラム',
                'その他'
              ].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <input type="checkbox" id={item} className="rounded" />
                  <Label htmlFor={item}>{item}</Label>
                </div>
              ))}
            </div>
            <Textarea 
              placeholder="その他、希望する研修・教育機会や具体的な学習内容があれば記入"
              className="min-h-[60px] resize-none mt-2"
            />
          </div>

          {/* キャリアの課題・不安 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">⑦ 今後のキャリア形成上の課題・不安</h4>
            <Textarea 
              placeholder="年齢・体力面での不安、技術の進歩への対応、後進との世代ギャップ、処遇・待遇の不安など"
              className="min-h-[80px] resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* 4. 包括的アクションプラン（6分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            4. 包括的アクションプラン（6分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* 短期目標（3-6ヶ月） */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">① 短期目標（3-6ヶ月）</h4>
            <Textarea 
              placeholder="例：\n1. 新人教育プログラムの抜本的改善と実行\n2. 専門技術の更なる向上（具体的な技術・分野名）\n3. 組織改善プロジェクトのリーダーシップ発揮\n4. 後進育成の成果測定と改善"
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* 中長期目標（1-3年） */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">② 中長期目標（1-3年）</h4>
            <Textarea 
              placeholder="例：\n1. 部署・チームのリーダーとしての役割確立\n2. 専門資格の取得・専門性の確立\n3. 法人内での指導的地位の獲得\n4. 業界・社会への貢献活動の開始"
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* 組織からの包括的支援 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">③ 組織からの包括的支援内容</h4>
            <Textarea 
              placeholder="例：新たな役割・責任の付与、専門研修・資格取得支援、研究・学会活動支援、処遇改善の検討、働き方の柔軟性提供、メンター制度の活用など"
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* 持続可能な成長戦略 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">④ 持続可能な成長・貢献戦略</h4>
            <Textarea 
              placeholder="年齢・体力に配慮した長期的な活躍方法、知識・技術の伝承計画、組織への持続的貢献方法"
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* 多面的フォローアップ */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">⑤ 多面的フォローアップ・評価方法</h4>
            <div className="space-y-2">
              {[
                '月次の詳細進捗確認面談',
                '専門性向上の多面的評価',
                '組織貢献度・影響力の測定',
                '満足度・モチベーションの継続確認',
                '健康状態・ストレスレベルの把握',
                '360度評価による多角的評価',
                '患者・家族からの評価収集',
                '同僚・後輩からの評価収集',
                'その他'
              ].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <input type="checkbox" id={`follow-${item}`} className="rounded" />
                  <Label htmlFor={`follow-${item}`}>{item}</Label>
                </div>
              ))}
            </div>
            <Textarea 
              placeholder="その他の具体的なフォローアップ・評価方法があれば記入"
              className="min-h-[60px] resize-none mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* 5. 面談者総合所見・戦略的評価（3分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            5. 面談者総合所見・戦略的評価（3分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* 総合的評価・位置づけ */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">① 総合的評価・組織内位置づけ</h4>
              <Textarea 
                placeholder="ベテラン職員としての総合評価、組織内での価値・重要性、他職員への影響力などを記入"
                className="min-h-[100px] resize-none"
              />
            </div>

            {/* 戦略的活用方針 */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">② 戦略的活用方針</h4>
              <Textarea 
                placeholder="今後の組織戦略における本職員の活用方針、期待する役割、責任範囲の拡大計画を記入"
                className="min-h-[100px] resize-none"
              />
            </div>

            {/* 長期キャリア支援計画 */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">③ 長期キャリア支援計画</h4>
              <Textarea 
                placeholder="5-10年レンジでの長期的なキャリア支援方針、持続的な成長・貢献のための支援策を記入"
                className="min-h-[100px] resize-none"
              />
            </div>

            {/* 重点課題・改善点 */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">④ 重点課題・優先改善点</h4>
              <Textarea 
                placeholder="今後重点的に取り組むべき課題、優先的に改善すべき点を記入"
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

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">面談同席者（任意）</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="同席者がいる場合は氏名・役職を記入"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">人事部回付の要否</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option>不要</option>
                <option>要</option>
                <option>至急要</option>
              </select>
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