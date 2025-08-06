'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Printer, FileText, MessageSquare, Target, Users, Heart, TrendingUp, Briefcase, Award } from 'lucide-react';

interface NewNursingAideUnified45MinProps {
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

export default function NewNursingAideUnified45Min({ 
  employeeData = {
    name: '',
    employeeId: '',
    department: '',
    position: '看護補助者',
    hireDate: ''
  },
  onSubmit,
  onSaveDraft 
}: NewNursingAideUnified45MinProps) {
  const currentDate = new Date().toLocaleDateString('ja-JP');
  
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-gray-50">
      {/* ヘッダー情報 */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            新人看護補助者 統合面談シート（45分版）
          </CardTitle>
          <p className="text-teal-100 text-sm mt-2">
            入職1年目の看護補助者向け - 詳細版
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
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-600">入職後経過期間</label>
              <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md">
                <option>1ヶ月</option>
                <option>3ヶ月</option>
                <option>6ヶ月</option>
                <option>9ヶ月</option>
                <option>1年</option>
              </select>
            </div>
          </div>
          
          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded">
            <p className="text-sm text-teal-800">
              <strong>面談の目的：</strong>
              新人看護補助者の成長を総合的に評価し、職場適応状況を詳細に確認するとともに、
              個別のキャリア開発計画を策定し、必要な教育・サポートを提供します。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 1. 業務遂行状況の詳細評価（12分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            1. 業務遂行状況の詳細評価（12分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* 基礎的介護技術の習得度 - 詳細版 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">① 基礎的介護技術の習得度（詳細評価）</h4>
            <div className="space-y-4 ml-4">
              {/* 環境整備 */}
              <div className="border-l-2 border-blue-300 pl-4">
                <p className="font-medium text-gray-700 mb-2">A. 環境整備</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">ベッドメイキング</p>
                    <RadioGroup className="flex flex-row space-x-4">
                      {['自立', '概ね自立', '一部介助', '全介助'].map((label, index) => (
                        <div key={index} className="flex items-center space-x-1">
                          <RadioGroupItem value={String(4-index)} id={`bed-${index}`} />
                          <Label htmlFor={`bed-${index}`} className="text-xs">{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">病室清掃・整頓</p>
                    <RadioGroup className="flex flex-row space-x-4">
                      {['自立', '概ね自立', '一部介助', '全介助'].map((label, index) => (
                        <div key={index} className="flex items-center space-x-1">
                          <RadioGroupItem value={String(4-index)} id={`clean-room-${index}`} />
                          <Label htmlFor={`clean-room-${index}`} className="text-xs">{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">医療器具の清掃・消毒</p>
                    <RadioGroup className="flex flex-row space-x-4">
                      {['自立', '概ね自立', '一部介助', '全介助'].map((label, index) => (
                        <div key={index} className="flex items-center space-x-1">
                          <RadioGroupItem value={String(4-index)} id={`equip-${index}`} />
                          <Label htmlFor={`equip-${index}`} className="text-xs">{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* 清潔援助 */}
              <div className="border-l-2 border-blue-300 pl-4">
                <p className="font-medium text-gray-700 mb-2">B. 清潔援助</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">入浴介助（一般浴・機械浴）</p>
                    <RadioGroup className="flex flex-row space-x-4">
                      {['自立', '概ね自立', '一部介助', '全介助'].map((label, index) => (
                        <div key={index} className="flex items-center space-x-1">
                          <RadioGroupItem value={String(4-index)} id={`bath-${index}`} />
                          <Label htmlFor={`bath-${index}`} className="text-xs">{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">清拭・部分清拭</p>
                    <RadioGroup className="flex flex-row space-x-4">
                      {['自立', '概ね自立', '一部介助', '全介助'].map((label, index) => (
                        <div key={index} className="flex items-center space-x-1">
                          <RadioGroupItem value={String(4-index)} id={`wipe-${index}`} />
                          <Label htmlFor={`wipe-${index}`} className="text-xs">{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">寝衣交換・更衣介助</p>
                    <RadioGroup className="flex flex-row space-x-4">
                      {['自立', '概ね自立', '一部介助', '全介助'].map((label, index) => (
                        <div key={index} className="flex items-center space-x-1">
                          <RadioGroupItem value={String(4-index)} id={`clothes-${index}`} />
                          <Label htmlFor={`clothes-${index}`} className="text-xs">{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">口腔ケア</p>
                    <RadioGroup className="flex flex-row space-x-4">
                      {['自立', '概ね自立', '一部介助', '全介助'].map((label, index) => (
                        <div key={index} className="flex items-center space-x-1">
                          <RadioGroupItem value={String(4-index)} id={`oral-${index}`} />
                          <Label htmlFor={`oral-${index}`} className="text-xs">{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* 食事援助 */}
              <div className="border-l-2 border-blue-300 pl-4">
                <p className="font-medium text-gray-700 mb-2">C. 食事援助</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">配膳・下膳</p>
                    <RadioGroup className="flex flex-row space-x-4">
                      {['自立', '概ね自立', '一部介助', '全介助'].map((label, index) => (
                        <div key={index} className="flex items-center space-x-1">
                          <RadioGroupItem value={String(4-index)} id={`serve-${index}`} />
                          <Label htmlFor={`serve-${index}`} className="text-xs">{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">食事介助（全介助・一部介助）</p>
                    <RadioGroup className="flex flex-row space-x-4">
                      {['自立', '概ね自立', '一部介助', '全介助'].map((label, index) => (
                        <div key={index} className="flex items-center space-x-1">
                          <RadioGroupItem value={String(4-index)} id={`feed-${index}`} />
                          <Label htmlFor={`feed-${index}`} className="text-xs">{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">水分補給の介助</p>
                    <RadioGroup className="flex flex-row space-x-4">
                      {['自立', '概ね自立', '一部介助', '全介助'].map((label, index) => (
                        <div key={index} className="flex items-center space-x-1">
                          <RadioGroupItem value={String(4-index)} id={`hydrate-${index}`} />
                          <Label htmlFor={`hydrate-${index}`} className="text-xs">{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* 排泄援助 */}
              <div className="border-l-2 border-blue-300 pl-4">
                <p className="font-medium text-gray-700 mb-2">D. 排泄援助</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">トイレ誘導・介助</p>
                    <RadioGroup className="flex flex-row space-x-4">
                      {['自立', '概ね自立', '一部介助', '全介助'].map((label, index) => (
                        <div key={index} className="flex items-center space-x-1">
                          <RadioGroupItem value={String(4-index)} id={`toilet-${index}`} />
                          <Label htmlFor={`toilet-${index}`} className="text-xs">{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">オムツ交換</p>
                    <RadioGroup className="flex flex-row space-x-4">
                      {['自立', '概ね自立', '一部介助', '全介助'].map((label, index) => (
                        <div key={index} className="flex items-center space-x-1">
                          <RadioGroupItem value={String(4-index)} id={`diaper-${index}`} />
                          <Label htmlFor={`diaper-${index}`} className="text-xs">{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">陰部洗浄</p>
                    <RadioGroup className="flex flex-row space-x-4">
                      {['自立', '概ね自立', '一部介助', '全介助'].map((label, index) => (
                        <div key={index} className="flex items-center space-x-1">
                          <RadioGroupItem value={String(4-index)} id={`perineal-${index}`} />
                          <Label htmlFor={`perineal-${index}`} className="text-xs">{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* 移動・移乗援助 */}
              <div className="border-l-2 border-blue-300 pl-4">
                <p className="font-medium text-gray-700 mb-2">E. 移動・移乗援助</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">車椅子移乗</p>
                    <RadioGroup className="flex flex-row space-x-4">
                      {['自立', '概ね自立', '一部介助', '全介助'].map((label, index) => (
                        <div key={index} className="flex items-center space-x-1">
                          <RadioGroupItem value={String(4-index)} id={`wheelchair-${index}`} />
                          <Label htmlFor={`wheelchair-${index}`} className="text-xs">{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">歩行介助</p>
                    <RadioGroup className="flex flex-row space-x-4">
                      {['自立', '概ね自立', '一部介助', '全介助'].map((label, index) => (
                        <div key={index} className="flex items-center space-x-1">
                          <RadioGroupItem value={String(4-index)} id={`walk-${index}`} />
                          <Label htmlFor={`walk-${index}`} className="text-xs">{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">体位変換</p>
                    <RadioGroup className="flex flex-row space-x-4">
                      {['自立', '概ね自立', '一部介助', '全介助'].map((label, index) => (
                        <div key={index} className="flex items-center space-x-1">
                          <RadioGroupItem value={String(4-index)} id={`position-${index}`} />
                          <Label htmlFor={`position-${index}`} className="text-xs">{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 安全管理・感染対策 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">② 安全管理・感染対策の実践</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">標準予防策の理解と実践</p>
                <RadioGroup className="space-y-2">
                  {[
                    '完全に理解し、常に適切に実践している',
                    '概ね理解し、適切に実践できている',
                    '基本的な理解はあるが、時々指導が必要',
                    '理解が不十分で、頻繁に指導が必要',
                    '基本的な理解が不足している'
                  ].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(5-index)} id={`standard-${index}`} />
                      <Label htmlFor={`standard-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">転倒・転落防止対策</p>
                <RadioGroup className="space-y-2">
                  {[
                    'リスクを適切に評価し、予防策を実践できる',
                    '基本的な予防策を実践できる',
                    '指導のもとで予防策を実践できる',
                    '理解が不十分',
                    '基本的な理解が不足'
                  ].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(5-index)} id={`fall-${index}`} />
                      <Label htmlFor={`fall-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">医療安全への意識</p>
                <Textarea 
                  placeholder="ヒヤリハット報告の提出状況、安全への取り組み姿勢などを記入"
                  className="min-h-[60px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* コミュニケーション・接遇 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">③ コミュニケーション・接遇</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">患者様への対応</p>
                <RadioGroup className="space-y-2">
                  {[
                    '温かく丁寧な対応ができ、信頼関係を築けている',
                    '適切な対応ができている',
                    '基本的な対応はできる',
                    '時々不適切な対応がある',
                    '対応に大きな課題がある'
                  ].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(5-index)} id={`patient-comm-${index}`} />
                      <Label htmlFor={`patient-comm-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">家族への対応</p>
                <RadioGroup className="space-y-2">
                  {[
                    '適切で配慮のある対応ができる',
                    '概ね適切な対応ができる',
                    '基本的な対応はできる',
                    '対応に消極的',
                    '対応に課題がある'
                  ].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(5-index)} id={`family-comm-${index}`} />
                      <Label htmlFor={`family-comm-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">言葉遣い・態度</p>
                <RadioGroup className="space-y-2">
                  {[
                    '常に適切で丁寧',
                    '概ね適切',
                    '基本的には適切',
                    '時々不適切',
                    '改善が必要'
                  ].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(5-index)} id={`manner-${index}`} />
                      <Label htmlFor={`manner-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* チームワーク・連携 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">④ チームワーク・連携</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">看護師への報告・連絡・相談</p>
                <RadioGroup className="space-y-2">
                  {[
                    '適時適切に報告し、積極的に相談できる',
                    '必要な報告・相談ができる',
                    '基本的な報告はできる',
                    '報告が遅れることがある',
                    '報告・相談が不十分'
                  ].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(5-index)} id={`report-${index}`} />
                      <Label htmlFor={`report-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">他職種との連携</p>
                <RadioGroup className="space-y-2">
                  {[
                    '積極的に連携し、良好な関係を築けている',
                    '必要な連携ができている',
                    '基本的な連携はできる',
                    '連携に消極的',
                    '連携が不十分'
                  ].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(5-index)} id={`collaborate-${index}`} />
                      <Label htmlFor={`collaborate-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">チーム内での役割認識</p>
                <Textarea 
                  placeholder="看護補助者としての役割理解、チーム貢献度などを記入"
                  className="min-h-[60px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* 学習姿勢・成長意欲 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">⑤ 学習姿勢・成長意欲</h4>
            <RadioGroup className="space-y-2">
              {[
                '非常に積極的で、自主的に学習し、質問も多い',
                '積極的に学習に取り組んでいる',
                '指示された学習には取り組む',
                '学習への取り組みが消極的',
                '学習意欲が低い'
              ].map((label, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={String(5-index)} id={`learning-${index}`} />
                  <Label htmlFor={`learning-${index}`}>{label}</Label>
                </div>
              ))}
            </RadioGroup>
            <div className="mt-2">
              <Textarea 
                placeholder="具体的な学習への取り組み状況、研修参加状況などを記入"
                className="min-h-[60px] resize-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. 現状確認（12分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="h-5 w-5" />
            2. 現状確認（12分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* モチベーション・エンゲージメント */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">① モチベーション・エンゲージメント</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">現在の仕事へのモチベーション</p>
                <RadioGroup className="space-y-2">
                  {[
                    '非常に高く、仕事に誇りと喜びを感じている',
                    '高く、前向きに取り組んでいる',
                    '普通',
                    'やや低下している',
                    '大きく低下している'
                  ].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(5-index)} id={`motiv-${index}`} />
                      <Label htmlFor={`motiv-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">仕事へのやりがい</p>
                <Textarea 
                  placeholder="どんな時にやりがいを感じるか、具体的なエピソードがあれば記入"
                  className="min-h-[80px] resize-none"
                />
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">職場への愛着（組織コミットメント）</p>
                <RadioGroup className="space-y-2">
                  {[
                    'この職場で長く働きたいと強く思う',
                    '働き続けたいと思う',
                    'どちらとも言えない',
                    'やや迷いがある',
                    '転職を考えている'
                  ].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(5-index)} id={`commit-${index}`} />
                      <Label htmlFor={`commit-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* 職場適応状況 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">② 職場適応状況</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">業務への適応</p>
                <RadioGroup className="space-y-2">
                  {[
                    '完全に適応し、スムーズに業務ができる',
                    'よく適応している',
                    '概ね適応している',
                    '一部適応に困難がある',
                    '適応に大きな困難がある'
                  ].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(5-index)} id={`adapt-work-${index}`} />
                      <Label htmlFor={`adapt-work-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">職場文化への適応</p>
                <RadioGroup className="space-y-2">
                  {[
                    '職場の文化・ルールをよく理解し、適応している',
                    'よく適応している',
                    '概ね適応している',
                    '一部適応に困難がある',
                    '適応に困難がある'
                  ].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(5-index)} id={`adapt-culture-${index}`} />
                      <Label htmlFor={`adapt-culture-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">シフト・勤務体制への適応</p>
                <Textarea 
                  placeholder="夜勤への適応状況、体力的な問題などがあれば記入"
                  className="min-h-[60px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* 人間関係 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">③ 人間関係の詳細</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">上司（主任・師長）との関係</p>
                <RadioGroup className="space-y-1">
                  {['非常に良好', '良好', '普通', 'やや困難', '困難'].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(5-index)} id={`boss-rel-${index}`} />
                      <Label htmlFor={`boss-rel-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">看護師との関係</p>
                <RadioGroup className="space-y-1">
                  {['非常に良好', '良好', '普通', 'やや困難', '困難'].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(5-index)} id={`nurse-relation-${index}`} />
                      <Label htmlFor={`nurse-relation-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">同僚（他の看護補助者）との関係</p>
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
                <p className="text-sm text-gray-600 mb-2">他職種（リハビリ、栄養士等）との関係</p>
                <RadioGroup className="space-y-1">
                  {['非常に良好', '良好', '普通', 'やや困難', '困難'].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(5-index)} id={`other-rel-${index}`} />
                      <Label htmlFor={`other-rel-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">人間関係の具体的な状況</p>
                <Textarea 
                  placeholder="良好な関係、困っている関係などがあれば具体的に記入"
                  className="min-h-[80px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* 健康状態・ストレス */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">④ 健康状態・ストレス管理</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">身体的健康状態</p>
                <RadioGroup className="space-y-2">
                  {[
                    '非常に健康',
                    '健康',
                    'やや疲労感あり',
                    '疲労が蓄積している',
                    '体調不良が続いている'
                  ].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(5-index)} id={`physical-${index}`} />
                      <Label htmlFor={`physical-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">精神的健康状態</p>
                <RadioGroup className="space-y-2">
                  {[
                    '非常に良好',
                    '良好',
                    '軽度のストレスあり',
                    '中程度のストレスあり',
                    '強いストレスを感じている'
                  ].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(5-index)} id={`mental-${index}`} />
                      <Label htmlFor={`mental-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">ストレスの主な要因</p>
                <div className="space-y-2">
                  {[
                    '業務量',
                    '人間関係',
                    '技術的な不安',
                    'シフト・勤務時間',
                    'プライベートとの両立',
                    'その他'
                  ].map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <input type="checkbox" id={`stress-${item}`} className="rounded" />
                      <Label htmlFor={`stress-${item}`}>{item}</Label>
                    </div>
                  ))}
                </div>
                <Textarea 
                  placeholder="具体的なストレス要因があれば記入"
                  className="min-h-[60px] resize-none mt-2"
                />
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">睡眠・休息の状況</p>
                <Textarea 
                  placeholder="睡眠時間、睡眠の質、休日の過ごし方などを記入"
                  className="min-h-[60px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* 現在の課題・悩み */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">⑤ 現在の課題・悩み（詳細）</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">業務上の課題</p>
                <Textarea 
                  placeholder="技術面、知識面、時間管理など、業務上で困っていることを具体的に記入"
                  className="min-h-[80px] resize-none"
                />
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">対人関係の課題</p>
                <Textarea 
                  placeholder="患者様、ご家族、スタッフとの関係で困っていることがあれば記入"
                  className="min-h-[80px] resize-none"
                />
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">個人的な悩み（任意）</p>
                <Textarea 
                  placeholder="プライベートでの悩み、家庭との両立など、共有したいことがあれば記入"
                  className="min-h-[80px] resize-none"
                />
              </div>
            </div>
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
          {/* 成長の振り返り */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">① 入職からの成長の振り返り</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">最も成長したと感じる点（3つ）</p>
                <Textarea 
                  placeholder="例：\n1. オムツ交換が自立してできるようになった\n2. 患者様との会話が自然にできるようになった\n3. 看護師への報告が適切にできるようになった"
                  className="min-h-[100px] resize-none"
                />
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">まだ不安を感じる業務・スキル</p>
                <Textarea 
                  placeholder="例：機械浴の操作、認知症患者様への対応、急変時の対応など"
                  className="min-h-[80px] resize-none"
                />
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">予想外に難しかったこと</p>
                <Textarea 
                  placeholder="入職前のイメージと違って難しかったことを記入"
                  className="min-h-[80px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* 強み・改善点 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">② 強みと改善点の整理</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">あなたの強み（上司から見て）</p>
                <Textarea 
                  placeholder="面談者が感じる本人の強み、良い点を記入"
                  className="min-h-[80px] resize-none"
                />
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">改善が必要な点（具体的に）</p>
                <Textarea 
                  placeholder="技術面、態度面、知識面などで改善が必要な点を具体的に記入"
                  className="min-h-[80px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* 今後の学習計画 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">③ 今後の学習・研修計画</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">必須研修の受講状況</p>
                <div className="space-y-2">
                  {[
                    '新人オリエンテーション',
                    '感染対策基礎研修',
                    '医療安全研修',
                    '接遇マナー研修',
                    'プライバシー保護研修',
                    '緊急時対応研修'
                  ].map((item) => (
                    <div key={item} className="flex items-center justify-between">
                      <Label htmlFor={`required-${item}`}>{item}</Label>
                      <select className="px-2 py-1 border border-gray-300 rounded">
                        <option>未受講</option>
                        <option>受講済</option>
                        <option>受講予定</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">今後受講したい研修・勉強会</p>
                <div className="space-y-2">
                  {[
                    '認知症ケア研修',
                    '移乗介助技術研修',
                    'コミュニケーション研修',
                    '終末期ケア研修',
                    'レクリエーション研修',
                    'その他'
                  ].map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <input type="checkbox" id={`want-${item}`} className="rounded" />
                      <Label htmlFor={`want-${item}`}>{item}</Label>
                    </div>
                  ))}
                </div>
                <Textarea 
                  placeholder="その他、学びたいことがあれば記入"
                  className="min-h-[60px] resize-none mt-2"
                />
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">自己学習の状況</p>
                <Textarea 
                  placeholder="参考書の購入、e-ラーニングの活用、勉強会への参加などを記入"
                  className="min-h-[60px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* キャリアビジョン */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">④ キャリアビジョン</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">1年後の目標</p>
                <Textarea 
                  placeholder="1年後にどのような看護補助者になっていたいか、具体的に記入"
                  className="min-h-[80px] resize-none"
                />
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">3年後の目標</p>
                <Textarea 
                  placeholder="3年後の自分の姿、目指すポジションなどを記入"
                  className="min-h-[80px] resize-none"
                />
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">興味のある分野・領域</p>
                <div className="space-y-2">
                  {[
                    '認知症ケア',
                    'リハビリテーション',
                    '終末期ケア',
                    '急性期ケア',
                    '在宅ケア',
                    'その他'
                  ].map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <input type="checkbox" id={`interest-${item}`} className="rounded" />
                      <Label htmlFor={`interest-${item}`}>{item}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">資格取得への意欲</p>
                <Textarea 
                  placeholder="介護福祉士、介護職員初任者研修など、取得を考えている資格があれば記入"
                  className="min-h-[60px] resize-none"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. アクションプラン（6分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            4. 今後のアクションプラン（6分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* 具体的な目標設定 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">① 次回面談までの具体的目標（SMART目標）</h4>
            <div className="space-y-3">
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-sm text-blue-800 mb-2">
                  SMART目標：Specific（具体的）、Measurable（測定可能）、Achievable（達成可能）、
                  Relevant（関連性）、Time-bound（期限付き）
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">目標1</p>
                <Textarea 
                  placeholder="例：3ヶ月後までに、全ての基礎的介護技術を自立して実施できるようになる"
                  className="min-h-[60px] resize-none"
                />
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">目標2</p>
                <Textarea 
                  placeholder="例：毎月1回以上、院内研修に参加し、学んだことを実践に活かす"
                  className="min-h-[60px] resize-none"
                />
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">目標3</p>
                <Textarea 
                  placeholder="例：患者様一人ひとりの特性を理解し、個別性のある介護を提供する"
                  className="min-h-[60px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* 上司・組織からの支援 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">② 上司・組織からの支援内容</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">技術指導・OJT</p>
                <Textarea 
                  placeholder="例：週1回、30分の技術指導時間を設ける。特に移乗介助を重点的に指導"
                  className="min-h-[60px] resize-none"
                />
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">メンタルサポート</p>
                <Textarea 
                  placeholder="例：月1回の定期面談、随時相談可能な体制の確保"
                  className="min-h-[60px] resize-none"
                />
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">研修・教育機会</p>
                <Textarea 
                  placeholder="例：認知症ケア研修への参加調整、e-ラーニングのID付与"
                  className="min-h-[60px] resize-none"
                />
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">業務調整</p>
                <Textarea 
                  placeholder="例：夜勤開始時期の調整、業務量の段階的な増加"
                  className="min-h-[60px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* フォローアップ計画 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">③ フォローアップ計画</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">フォローアップ方法</p>
                <div className="space-y-2">
                  {[
                    { label: '日々の声かけ・観察', frequency: '毎日' },
                    { label: '週次の振り返り（15分）', frequency: '週1回' },
                    { label: '月次面談（30分）', frequency: '月1回' },
                    { label: 'チェックリスト評価', frequency: '月1回' },
                    { label: '360度評価', frequency: '3ヶ月に1回' }
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id={`followup-${item.label}`} className="rounded" />
                        <Label htmlFor={`followup-${item.label}`}>{item.label}</Label>
                      </div>
                      <span className="text-sm text-gray-500">{item.frequency}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">重点観察項目</p>
                <Textarea 
                  placeholder="特に注意して観察・支援すべき項目を記入"
                  className="min-h-[60px] resize-none"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. 面談者所見（3分） */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            5. 面談者所見（3分）
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* 総合評価 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">① 総合評価</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">成長度合い</p>
                <RadioGroup className="flex flex-row space-x-4">
                  {['期待以上', '期待通り', 'やや遅れ', '大幅に遅れ'].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(4-index)} id={`growth-${index}`} />
                      <Label htmlFor={`growth-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">今後の見通し</p>
                <RadioGroup className="flex flex-row space-x-4">
                  {['非常に期待できる', '期待できる', '標準的', '要支援'].map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(4-index)} id={`outlook-${index}`} />
                      <Label htmlFor={`outlook-${index}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* 詳細所見 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">② 詳細所見</h4>
            <Textarea 
              placeholder="面談を通じて把握した職員の状況、成長度合い、強み・課題、今後の育成方針、特記事項などを詳細に記入"
              className="min-h-[150px] resize-none"
            />
          </div>

          {/* 人事部への申し送り事項 */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">③ 人事部への申し送り事項（任意）</h4>
            <Textarea 
              placeholder="人事部と共有すべき事項、組織的な対応が必要な事項があれば記入"
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* 面談情報 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">面談実施者</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="氏名・役職"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">面談同席者</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="同席者がいる場合は氏名・役職"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">次回面談予定日</label>
              <input 
                type="date" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">面談時間</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="実際の面談時間（分）"
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