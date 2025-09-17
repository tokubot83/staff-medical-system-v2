'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, Clock, Calendar, Users, User, Building2 } from 'lucide-react'

interface Question {
  id: string
  type: 'single' | 'multiple' | 'text' | 'scale'
  title: string
  options?: string[]
  required: boolean
}

interface AnnouncementForm {
  category: string
  title: string
  content: string
  targetType: 'all' | 'departments' | 'individuals' | 'positions'
  targetDepartments: string[]
  targetIndividuals: string[]
  targetPositions: string[]
  priority: 'high' | 'medium' | 'low'
  scheduledDate?: string
  // アンケート固有
  surveyQuestions: Question[]
  surveyEndDate?: string
  surveyAnonymous: boolean
}

const categories = [
  { id: 'urgent', label: '緊急', icon: '🚨', color: 'border-red-500' },
  { id: 'interview', label: '面談', icon: '👥', color: 'border-blue-500' },
  { id: 'training', label: '研修', icon: '📚', color: 'border-purple-500' },
  { id: 'survey', label: 'アンケート', icon: '📝', color: 'border-green-500' },
  { id: 'health', label: '健康管理', icon: '🏥', color: 'border-orange-500' },
  { id: 'other', label: 'その他', icon: '📢', color: 'border-gray-500' }
]

const departments = [
  '看護部', '医師', '薬剤科', 'リハビリテーション科', '放射線科',
  '検査科', '栄養科', '事務部', '医療安全管理室', '感染管理室'
]

const positions = [
  '主任', '師長', '副師長', '科長', '係長', '部長', '課長', '管理職'
]

export default function AnnouncementComposer() {
  const [form, setForm] = useState<AnnouncementForm>({
    category: '',
    title: '',
    content: '',
    targetType: 'all',
    targetDepartments: [],
    targetIndividuals: [],
    targetPositions: [],
    priority: 'medium',
    surveyQuestions: [],
    surveyAnonymous: true
  })

  const [showIndividualSearch, setShowIndividualSearch] = useState(false)
  const [individualSearchTerm, setIndividualSearchTerm] = useState('')

  const handleCategorySelect = (categoryId: string) => {
    setForm(prev => ({ ...prev, category: categoryId }))
  }

  const handleTargetTypeChange = (type: string) => {
    setForm(prev => ({
      ...prev,
      targetType: type as any,
      targetDepartments: [],
      targetIndividuals: [],
      targetPositions: []
    }))
  }

  const handleDepartmentToggle = (dept: string) => {
    setForm(prev => ({
      ...prev,
      targetDepartments: prev.targetDepartments.includes(dept)
        ? prev.targetDepartments.filter(d => d !== dept)
        : [...prev.targetDepartments, dept]
    }))
  }

  const addSurveyQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'single',
      title: '',
      options: ['選択肢1', '選択肢2'],
      required: false
    }
    setForm(prev => ({
      ...prev,
      surveyQuestions: [...prev.surveyQuestions, newQuestion]
    }))
  }

  const updateSurveyQuestion = (id: string, updates: Partial<Question>) => {
    setForm(prev => ({
      ...prev,
      surveyQuestions: prev.surveyQuestions.map(q =>
        q.id === id ? { ...q, ...updates } : q
      )
    }))
  }

  const removeSurveyQuestion = (id: string) => {
    setForm(prev => ({
      ...prev,
      surveyQuestions: prev.surveyQuestions.filter(q => q.id !== id)
    }))
  }

  const handleSubmit = async (action: 'draft' | 'schedule' | 'send') => {
    console.log('Submit:', action, form)

    if (form.category === 'survey' && form.surveyQuestions.length > 0) {
      // アンケート統合配信
      console.log('アンケート配信準備完了')
    }

    // 通知配信処理
    alert(`${action === 'draft' ? '下書き保存' : action === 'schedule' ? '配信予約' : '配信'}が完了しました`)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* メイン作成フォーム */}
      <div className="lg:col-span-2">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center gap-2">
              <span>✏️</span>
              <span>お知らせ作成</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* カテゴリー選択 */}
            <div>
              <Label className="text-base font-semibold mb-4 block">カテゴリー</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map(category => (
                  <div
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                      form.category === category.id
                        ? `${category.color} bg-blue-50`
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{category.icon}</div>
                      <div className="font-medium">{category.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 件名 */}
            <div>
              <Label htmlFor="title" className="text-base font-semibold">件名</Label>
              <Input
                id="title"
                placeholder="お知らせのタイトルを入力"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                className="mt-2"
              />
            </div>

            {/* 本文 */}
            <div>
              <Label htmlFor="content" className="text-base font-semibold">本文</Label>
              <Textarea
                id="content"
                rows={6}
                placeholder="お知らせの内容を入力"
                value={form.content}
                onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                className="mt-2"
              />
            </div>

            {/* アンケート質問（アンケートカテゴリ選択時のみ表示） */}
            {form.category === 'survey' && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-base font-semibold">アンケート質問</Label>
                  <Button onClick={addSurveyQuestion} size="sm" className="flex items-center gap-2">
                    <Plus size={16} />
                    質問を追加
                  </Button>
                </div>

                {form.surveyQuestions.map((question, index) => (
                  <div key={question.id} className="bg-white p-4 rounded-lg border mb-3">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="font-medium">質問 {index + 1}</Label>
                      <Button
                        onClick={() => removeSurveyQuestion(question.id)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>

                    <Input
                      placeholder="質問内容を入力"
                      value={question.title}
                      onChange={(e) => updateSurveyQuestion(question.id, { title: e.target.value })}
                      className="mb-3"
                    />

                    <div className="flex items-center gap-4">
                      <Select
                        value={question.type}
                        onValueChange={(value: any) => updateSurveyQuestion(question.id, { type: value })}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">単一選択</SelectItem>
                          <SelectItem value="multiple">複数選択</SelectItem>
                          <SelectItem value="text">自由記述</SelectItem>
                          <SelectItem value="scale">評価スケール</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`required-${question.id}`}
                          checked={question.required}
                          onCheckedChange={(checked) =>
                            updateSurveyQuestion(question.id, { required: !!checked })
                          }
                        />
                        <Label htmlFor={`required-${question.id}`}>必須</Label>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id="anonymous"
                      checked={form.surveyAnonymous}
                      onCheckedChange={(checked) =>
                        setForm(prev => ({ ...prev, surveyAnonymous: !!checked }))
                      }
                    />
                    <Label htmlFor="anonymous">匿名回答</Label>
                  </div>

                  <div>
                    <Label htmlFor="surveyEndDate" className="text-sm">回答期限</Label>
                    <Input
                      id="surveyEndDate"
                      type="date"
                      value={form.surveyEndDate || ''}
                      onChange={(e) => setForm(prev => ({ ...prev, surveyEndDate: e.target.value }))}
                      className="mt-1 w-40"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 配信対象 */}
            <div>
              <Label className="text-base font-semibold mb-4 block">配信対象</Label>

              <RadioGroup value={form.targetType} onValueChange={handleTargetTypeChange} className="mb-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="target-all" />
                  <Label htmlFor="target-all" className="flex items-center gap-2">
                    <Building2 size={16} />
                    全職員
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="departments" id="target-dept" />
                  <Label htmlFor="target-dept" className="flex items-center gap-2">
                    <Users size={16} />
                    部署選択
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="individuals" id="target-individual" />
                  <Label htmlFor="target-individual" className="flex items-center gap-2">
                    <User size={16} />
                    個人選択
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="positions" id="target-position" />
                  <Label htmlFor="target-position" className="flex items-center gap-2">
                    <Users size={16} />
                    役職選択
                  </Label>
                </div>
              </RadioGroup>

              {/* 部署選択 */}
              {form.targetType === 'departments' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {departments.map(dept => (
                    <div key={dept} className="flex items-center space-x-2">
                      <Checkbox
                        id={`dept-${dept}`}
                        checked={form.targetDepartments.includes(dept)}
                        onCheckedChange={() => handleDepartmentToggle(dept)}
                      />
                      <Label htmlFor={`dept-${dept}`} className="text-sm">{dept}</Label>
                    </div>
                  ))}
                </div>
              )}

              {/* 個人選択 */}
              {form.targetType === 'individuals' && (
                <div>
                  <Button
                    onClick={() => setShowIndividualSearch(!showIndividualSearch)}
                    variant="outline"
                    className="mb-3"
                  >
                    職員を検索・選択
                  </Button>
                  {showIndividualSearch && (
                    <div className="p-3 border rounded">
                      <Input
                        placeholder="職員名で検索..."
                        value={individualSearchTerm}
                        onChange={(e) => setIndividualSearchTerm(e.target.value)}
                      />
                      <div className="text-sm text-gray-500 mt-2">
                        選択された職員: {form.targetIndividuals.length}名
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 役職選択 */}
              {form.targetType === 'positions' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {positions.map(position => (
                    <div key={position} className="flex items-center space-x-2">
                      <Checkbox
                        id={`pos-${position}`}
                        checked={form.targetPositions.includes(position)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setForm(prev => ({
                              ...prev,
                              targetPositions: [...prev.targetPositions, position]
                            }))
                          } else {
                            setForm(prev => ({
                              ...prev,
                              targetPositions: prev.targetPositions.filter(p => p !== position)
                            }))
                          }
                        }}
                      />
                      <Label htmlFor={`pos-${position}`} className="text-sm">{position}</Label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 重要度 */}
            <div>
              <Label className="text-base font-semibold mb-3 block">重要度</Label>
              <RadioGroup value={form.priority} onValueChange={(value: any) => setForm(prev => ({ ...prev, priority: value }))}>
                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="priority-high" />
                    <Label htmlFor="priority-high" className="text-red-600 font-medium">高</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="priority-medium" />
                    <Label htmlFor="priority-medium" className="text-yellow-600 font-medium">中</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="priority-low" />
                    <Label htmlFor="priority-low" className="text-green-600 font-medium">低</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* 配信日時設定 */}
            <div>
              <Label htmlFor="scheduledDate" className="text-base font-semibold">配信日時（任意）</Label>
              <div className="flex items-center gap-2 mt-2">
                <Calendar size={16} className="text-gray-500" />
                <Input
                  id="scheduledDate"
                  type="datetime-local"
                  value={form.scheduledDate || ''}
                  onChange={(e) => setForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  className="w-60"
                />
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => handleSubmit('draft')}>
                下書き保存
              </Button>
              <Button variant="outline" onClick={() => handleSubmit('schedule')}>
                <Clock size={16} className="mr-2" />
                配信予約
              </Button>
              <Button onClick={() => handleSubmit('send')} className="bg-blue-600 hover:bg-blue-700">
                今すぐ配信
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* サイドバー: ヒント */}
      <div>
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50">
            <CardTitle className="flex items-center gap-2">
              <span>💡</span>
              <span>配信のヒント</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-xl">📅</span>
                <div>
                  <div className="font-semibold text-sm">最適な配信タイミング</div>
                  <div className="text-sm text-gray-600">
                    月曜日の午前9時〜10時、火曜日の午前10時〜11時が最も既読率が高い傾向にあります。
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-xl">📝</span>
                <div>
                  <div className="font-semibold text-sm">効果的な件名</div>
                  <div className="text-sm text-gray-600">
                    【重要】【締切あり】などのプレフィックスを使用すると開封率が20%向上します。
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-xl">🎯</span>
                <div>
                  <div className="font-semibold text-sm">ターゲティング</div>
                  <div className="text-sm text-gray-600">
                    部署を限定した配信の方が、全社配信より既読率が15%高くなります。
                  </div>
                </div>
              </div>

              {form.category === 'survey' && (
                <div className="flex gap-3">
                  <span className="text-xl">📊</span>
                  <div>
                    <div className="font-semibold text-sm">アンケート設計</div>
                    <div className="text-sm text-gray-600">
                      質問数は5-10問程度に抑えると回答率が向上します。
                    </div>
                  </div>
                </div>
              )}

              {form.category === 'interview' && (
                <div className="flex gap-3">
                  <span className="text-xl">👥</span>
                  <div>
                    <div className="font-semibold text-sm">面談案内</div>
                    <div className="text-sm text-gray-600">
                      面談日の1週間前に案内すると参加率が最も高くなります。
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}