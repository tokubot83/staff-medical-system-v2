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
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plus,
  Trash2,
  Copy,
  Clock,
  Calendar,
  Users,
  User,
  Building2,
  Circle,
  Square,
  Type,
  Hash,
  Star,
  Grid3X3,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'


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
  surveySubCategory?: string
  surveyQuestions: Question[]
  surveyEndDate?: string
  surveyAnonymous: boolean
  surveyAllowMultipleResponses: boolean
  // 研修固有
  trainingEnableRegistration: boolean
  trainingCapacity?: number
  trainingRegistrationDeadline?: string
  trainingLocation?: string
  trainingDuration?: string
  // アクションボタン用
  hasActionButton?: boolean
  actionButtonType?: 'interview_reservation' | 'survey_response' | 'health_check' | 'training_apply'
  actionButtonLabel?: string
}

const categories = [
  { id: 'announcement', label: 'お知らせ', icon: '📣', color: 'border-cyan-500' },
  { id: 'interview', label: '面談', icon: '👥', color: 'border-blue-500' },
  { id: 'training', label: '研修', icon: '📚', color: 'border-purple-500' },
  { id: 'survey', label: 'アンケート', icon: '📊', color: 'border-green-500' },
  { id: 'other', label: 'その他', icon: '📢', color: 'border-gray-500' }
]

const departments = [
  '看護部', '医師', '薬剤科', 'リハビリテーション科', '放射線科',
  '検査科', '栄養科', '事務部', '医療安全管理室', '感染管理室'
]

const positions = [
  '主任', '師長', '副師長', '科長', '係長', '部長', '課長', '管理職'
]

// アンケートのサブカテゴリ
const surveySubCategories = [
  { id: 'satisfaction', label: '満足度調査', icon: '😊' },
  { id: 'workenv', label: '職場環境', icon: '🏢' },
  { id: 'education', label: '教育・研修', icon: '📚' },
  { id: 'welfare', label: '福利厚生', icon: '🎁' },
  { id: 'system', label: 'システム改善', icon: '💻' },
  { id: 'event', label: 'イベント', icon: '🎉' },
  { id: 'other', label: 'その他', icon: '📝' }
]

// 質問タイプ
type QuestionType = 'single' | 'multiple' | 'text' | 'number' | 'date' | 'scale' | 'matrix'

interface Question {
  id: string
  type: QuestionType
  title: string
  description?: string
  required: boolean
  options?: string[]
  scaleMin?: number
  scaleMax?: number
  scaleMinLabel?: string
  scaleMaxLabel?: string
  matrixRows?: string[]
  matrixColumns?: string[]
}

// ソート可能な質問コンポーネント
function SortableQuestion({
  question,
  index,
  onUpdate,
  onDelete,
  onDuplicate
}: {
  question: Question
  index: number
  onUpdate: (id: string, updates: Partial<Question>) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: question.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const [expanded, setExpanded] = useState(true)

  const getQuestionIcon = (type: QuestionType) => {
    switch (type) {
      case 'single': return <Circle className="w-4 h-4" />
      case 'multiple': return <Square className="w-4 h-4" />
      case 'text': return <Type className="w-4 h-4" />
      case 'number': return <Hash className="w-4 h-4" />
      case 'date': return <Calendar className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getQuestionTypeName = (type: QuestionType) => {
    switch (type) {
      case 'single': return '単一選択'
      case 'multiple': return '複数選択'
      case 'text': return 'テキスト'
      case 'number': return '数値'
      case 'date': return '日付'
      default: return '不明'
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border rounded-lg p-4 mb-3"
    >
      <div className="flex items-start gap-3">
        <div
          {...attributes}
          {...listeners}
          className="mt-1 cursor-move text-gray-400 hover:text-gray-600"
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path
              d="M7 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Q{index + 1}</span>
              {getQuestionIcon(question.type)}
              <Badge variant="outline">{getQuestionTypeName(question.type)}</Badge>
              {question.required && <Badge variant="destructive">必須</Badge>}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDuplicate(question.id)}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(question.id)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {expanded && (
            <div className="space-y-3">
              <div>
                <Label>質問文</Label>
                <Input
                  value={question.title}
                  onChange={(e) => onUpdate(question.id, { title: e.target.value })}
                  placeholder="質問を入力してください"
                />
              </div>

              <div>
                <Label>説明文（任意）</Label>
                <Textarea
                  value={question.description || ''}
                  onChange={(e) => onUpdate(question.id, { description: e.target.value })}
                  placeholder="補足説明を入力"
                  rows={2}
                />
              </div>

              {/* 選択肢の設定（単一選択・複数選択） */}
              {(question.type === 'single' || question.type === 'multiple') && (
                <div>
                  <Label>選択肢</Label>
                  <div className="space-y-2">
                    {question.options?.map((option, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(question.options || [])]
                            newOptions[idx] = e.target.value
                            onUpdate(question.id, { options: newOptions })
                          }}
                          placeholder={`選択肢 ${idx + 1}`}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newOptions = question.options?.filter((_, i) => i !== idx)
                            onUpdate(question.id, { options: newOptions })
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newOptions = [...(question.options || []), '']
                        onUpdate(question.id, { options: newOptions })
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      選択肢を追加
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  checked={question.required}
                  onCheckedChange={(checked) => onUpdate(question.id, { required: checked })}
                />
                <Label>必須回答にする</Label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

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
    surveySubCategory: '',
    surveyQuestions: [],
    surveyAnonymous: true,
    surveyAllowMultipleResponses: false,
    trainingEnableRegistration: false,
    trainingRequiredQuestions: []
  })

  const [showIndividualSearch, setShowIndividualSearch] = useState(false)
  const [individualSearchTerm, setIndividualSearchTerm] = useState('')

  // アンケートサブカテゴリ選択時のテンプレート設定
  const handleSurveySubCategorySelect = (subCategoryId: string) => {
    let templateTitle = ''
    let templateContent = ''

    switch (subCategoryId) {
      case 'satisfaction':
        templateTitle = '【満足度調査】職場環境アンケート'
        templateContent = `お疲れ様です。

職場環境改善のため、満足度調査を実施いたします。

【調査内容】
■現在の職場環境の満足度
■業務内容・負担感
■チームワーク・人間関係
■改善要望

回答期限：〇月〇日（金）
所要時間：約5分

回答は匿名で取り扱います。率直なご意見をお聞かせください。`
        break
      case 'workenv':
        templateTitle = '【職場環境調査】働き方に関するアンケート'
        templateContent = `お疲れ様です。

より良い職場環境づくりのため、アンケートを実施いたします。

【調査項目】
■勤務時間・シフト体制
■休暇取得状況
■職場の設備・環境
■安全管理体制

皆様の声をもとに改善に取り組んでまいります。`
        break
      case 'education':
        templateTitle = '【研修・教育】スキルアップニーズ調査'
        templateContent = `お疲れ様です。

来年度の研修計画策定に向けて、スキルアップニーズ調査を実施いたします。

【調査内容】
■必要としているスキル・知識
■希望する研修分野
■研修参加の障壁
■キャリア開発の希望

皆様のニーズに合った研修を企画してまいります。`
        break
      case 'welfare':
        templateTitle = '【福利厚生】制度利用状況アンケート'
        templateContent = `お疲れ様です。

福利厚生制度の充実のため、利用状況アンケートを実施いたします。

【調査項目】
■現在の福利厚生制度の認知度
■各制度の利用状況
■満足度・改善点
■新たに希望する制度

ご意見を参考に制度の見直しを検討いたします。`
        break
      case 'system':
        templateTitle = '【システム改善】ITツール利用状況調査'
        templateContent = `お疲れ様です。

業務システム改善のため、ITツールの利用状況を調査いたします。

【調査内容】
■現在利用中のシステムの使い勝手
■不便を感じている点
■新たに必要な機能
■システム研修の必要性

使いやすいシステム構築に向けて活用させていただきます。`
        break
      case 'event':
        templateTitle = '【イベント企画】参加希望調査'
        templateContent = `お疲れ様です。

職場交流イベントの企画にあたり、参加希望をお伺いします。

【調査項目】
■希望するイベント内容
■参加しやすい日程・時間帯
■過去のイベントへの感想
■企画アイディア

皆様が楽しめるイベントを企画してまいります。`
        break
      case 'other':
        templateTitle = '【アンケートご協力のお願い】'
        templateContent = `お疲れ様です。

下記のアンケートにご協力をお願いいたします。

【アンケート概要】
■目的：
■回答期限：
■所要時間：約5分
■対象者：

ご回答は今後の改善に活用させていただきます。
ご協力のほど、よろしくお願いいたします。`
        break
    }

    setForm(prev => ({
      ...prev,
      surveySubCategory: subCategoryId,
      title: templateTitle,
      content: templateContent
    }))
  }

  const handleCategorySelect = (categoryId: string) => {
    // カテゴリに応じたテンプレートを自動挿入
    let templateTitle = ''
    let templateContent = ''
    let hasActionButton = false
    let actionButtonType: string | undefined = undefined
    let actionButtonLabel = ''

    if (categoryId === 'interview') {
      // 面談カテゴリ選択時のテンプレート（シンプル版）
      templateTitle = '定期面談のご案内'
      templateContent = `今期の定期面談を実施いたします。
実施期間：${new Date().getMonth() + 1}月15日（水）～ ${new Date().getMonth() + 1}月31日（金）
所要時間：30分程度`
      // アクションボタン設定
      hasActionButton = true
      actionButtonType = 'interview_reservation'
      actionButtonLabel = '面談予約する'
    } else if (categoryId === 'training') {
      templateTitle = '【研修案内】'
      templateContent = `お疲れ様です。

下記の研修を実施いたしますので、ご案内申し上げます。

【研修概要】
■研修名：
■日時：
■場所：
■対象者：
■定員：

【申込方法】

【申込期限】

ご不明な点は人事部までお問い合わせください。`
      // 研修用アクションボタン
      hasActionButton = true
      actionButtonType = 'training_apply'
      actionButtonLabel = '研修に申し込む'
    } else if (categoryId === 'health') {
      templateTitle = '【健康診断のお知らせ】'
      templateContent = `お疲れ様です。

年次健康診断の実施についてご案内いたします。

【実施概要】
■期間：
■場所：
■対象者：全職員

詳細は追ってご連絡いたします。`
    } else if (categoryId === 'survey') {
      // アンケート用アクションボタン
      hasActionButton = true
      actionButtonType = 'survey_response'
      actionButtonLabel = 'アンケートに回答する'
    } else if (categoryId === 'announcement' || categoryId === 'other') {
      // テンプレートがないカテゴリの場合、タイトルと内容をクリア
      templateTitle = ''
      templateContent = ''
    }

    setForm(prev => ({
      ...prev,
      category: categoryId,
      // タイトルと内容を更新（テンプレートがない場合は空文字列でクリア）
      title: templateTitle,
      content: templateContent,
      // アンケートカテゴリでない場合はサブカテゴリをクリア
      surveySubCategory: categoryId === 'survey' ? prev.surveySubCategory : '',
      // アクションボタン設定
      hasActionButton,
      actionButtonType: actionButtonType as any,
      actionButtonLabel
    }))
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addSurveyQuestion = (type: QuestionType = 'single') => {
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      type,
      title: '',
      required: false,
      options: type === 'single' || type === 'multiple' ? [''] : undefined
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

  const duplicateSurveyQuestion = (id: string) => {
    const question = form.surveyQuestions.find(q => q.id === id)
    if (question) {
      const newQuestion = {
        ...question,
        id: `q_${Date.now()}`
      }
      setForm(prev => ({
        ...prev,
        surveyQuestions: [...prev.surveyQuestions, newQuestion]
      }))
    }
  }

  // 研修申込質問管理
  const addTrainingQuestion = (type: QuestionType = 'single') => {
    const newQuestion: Question = {
      id: `tq_${Date.now()}`,
      type,
      title: '',
      required: false,
      options: type === 'single' || type === 'multiple' ? [''] : undefined
    }
    setForm(prev => ({
      ...prev,
      trainingRequiredQuestions: [...prev.trainingRequiredQuestions, newQuestion]
    }))
  }

  const updateTrainingQuestion = (id: string, updates: Partial<Question>) => {
    setForm(prev => ({
      ...prev,
      trainingRequiredQuestions: prev.trainingRequiredQuestions.map(q =>
        q.id === id ? { ...q, ...updates } : q
      )
    }))
  }

  const removeTrainingQuestion = (id: string) => {
    setForm(prev => ({
      ...prev,
      trainingRequiredQuestions: prev.trainingRequiredQuestions.filter(q => q.id !== id)
    }))
  }

  const duplicateTrainingQuestion = (id: string) => {
    const question = form.trainingRequiredQuestions.find(q => q.id === id)
    if (question) {
      const newQuestion = {
        ...question,
        id: `tq_${Date.now()}`
      }
      setForm(prev => ({
        ...prev,
        trainingRequiredQuestions: [...prev.trainingRequiredQuestions, newQuestion]
      }))
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = form.surveyQuestions.findIndex(q => q.id === active.id)
      const newIndex = form.surveyQuestions.findIndex(q => q.id === over?.id)

      setForm(prev => ({
        ...prev,
        surveyQuestions: arrayMove(prev.surveyQuestions, oldIndex, newIndex)
      }))
    }
  }

  const applyTemplate = (templateName: string) => {
    switch (templateName) {
      case 'satisfaction':
        setForm(prev => ({
          ...prev,
          title: '研修申込み用アンケート',
          content: '研修参加に関する事前調査',
          trainingRequiredQuestions: [
            {
              id: 'q1',
              type: 'single',
              title: '研修参加目的を教えてください',
              required: true,
              options: ['スキルアップ', '資格取得', '業務改善', '管理能力向上', 'その他']
            },
            {
              id: 'q2',
              type: 'text',
              title: '研修で学びたい内容',
              required: true
            }
          ]
        }))
        break
      case 'training':
        setForm(prev => ({
          ...prev,
          title: '研修効果測定',
          content: '研修後のフォローアップ',
          trainingRequiredQuestions: [
            {
              id: 'q1',
              type: 'single',
              title: '研修内容は役立ちましたか？',
              required: true,
              options: ['非常に役立った', '役立った', '普通', 'あまり役立たなかった', '全く役立たなかった']
            },
            {
              id: 'q2',
              type: 'text',
              title: '今後受けたい研修テーマ',
              required: false
            }
          ]
        }))
        break
    }
  }

  const handleSubmit = async (action: 'draft' | 'schedule' | 'send') => {
    console.log('Submit:', action, form)

    // 通知配信処理
    alert(`${action === 'draft' ? '下書き保存' : action === 'schedule' ? '配信予約' : '配信'}が完了しました`)
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
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

            {/* アンケートのサブカテゴリ選択 */}
            {form.category === 'survey' && (
              <div>
                <Label className="text-base font-semibold mb-4 block">アンケート種別</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {surveySubCategories.map(subCategory => (
                    <div
                      key={subCategory.id}
                      onClick={() => handleSurveySubCategorySelect(subCategory.id)}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                        form.surveySubCategory === subCategory.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-xl mb-1">{subCategory.icon}</div>
                        <div className="text-sm font-medium">{subCategory.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                rows={22}
                placeholder="お知らせの内容を入力"
                value={form.content}
                onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                className="mt-2"
              />
            </div>

            {/* アンケートセクション */}
            {form.category === 'survey' && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>📊</span>
                    <span>アンケート設計</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 左サイドバー：質問タイプ */}
                    <div className="lg:col-span-1">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">質問タイプ</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => addSurveyQuestion('single')}
                          >
                            <Circle className="w-4 h-4 mr-2" />
                            単一選択
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => addSurveyQuestion('multiple')}
                          >
                            <Square className="w-4 h-4 mr-2" />
                            複数選択
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => addSurveyQuestion('text')}
                          >
                            <Type className="w-4 h-4 mr-2" />
                            テキスト回答
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => addSurveyQuestion('scale')}
                          >
                            <Star className="w-4 h-4 mr-2" />
                            尺度（1-5など）
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => addSurveyQuestion('number')}
                          >
                            <Hash className="w-4 h-4 mr-2" />
                            数値入力
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => addSurveyQuestion('date')}
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            日付選択
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="mt-4">
                        <CardHeader>
                          <CardTitle className="text-lg">テンプレート</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => applyTemplate('satisfaction')}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            職員満足度調査
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => applyTemplate('training')}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            研修効果測定
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    {/* メインエリア：質問編集 */}
                    <div className="lg:col-span-2">
                      <Card>
                        <CardContent className="p-6">
                          <Tabs defaultValue="questions" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="questions">質問</TabsTrigger>
                              <TabsTrigger value="settings">設定</TabsTrigger>
                            </TabsList>

                            <TabsContent value="questions" className="space-y-4">
                              {form.surveyQuestions.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-lg">
                                  <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                  <p className="text-gray-500 mb-4">質問がまだありません</p>
                                  <p className="text-sm text-gray-400 mb-4">
                                    左のパネルから質問タイプを選んで追加してください
                                  </p>
                                </div>
                              ) : (
                                <DndContext
                                  sensors={sensors}
                                  collisionDetection={closestCenter}
                                  onDragEnd={handleDragEnd}
                                >
                                  <SortableContext
                                    items={form.surveyQuestions.map(q => q.id)}
                                    strategy={verticalListSortingStrategy}
                                  >
                                    <div className="space-y-3">
                                      {form.surveyQuestions.map((question, index) => (
                                        <SortableQuestion
                                          key={question.id}
                                          question={question}
                                          index={index}
                                          onUpdate={updateSurveyQuestion}
                                          onDelete={removeSurveyQuestion}
                                          onDuplicate={duplicateSurveyQuestion}
                                        />
                                      ))}
                                    </div>
                                  </SortableContext>
                                </DndContext>
                              )}
                            </TabsContent>

                            <TabsContent value="settings" className="space-y-4">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <Label className="text-base">匿名回答</Label>
                                    <p className="text-sm text-muted-foreground">
                                      回答者の個人情報を記録しません
                                    </p>
                                  </div>
                                  <Switch
                                    checked={form.surveyAnonymous}
                                    onCheckedChange={(checked) => setForm(prev => ({ ...prev, surveyAnonymous: checked }))}
                                  />
                                </div>

                                <div className="flex items-center justify-between">
                                  <div>
                                    <Label className="text-base">複数回答を許可</Label>
                                    <p className="text-sm text-muted-foreground">
                                      同一ユーザーが複数回回答できます
                                    </p>
                                  </div>
                                  <Switch
                                    checked={form.surveyAllowMultipleResponses}
                                    onCheckedChange={(checked) => setForm(prev => ({ ...prev, surveyAllowMultipleResponses: checked }))}
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="surveyEndDate">回答期限</Label>
                                  <Input
                                    id="surveyEndDate"
                                    type="datetime-local"
                                    value={form.surveyEndDate || ''}
                                    onChange={(e) => setForm(prev => ({ ...prev, surveyEndDate: e.target.value }))}
                                    className="mt-2 w-60"
                                  />
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 研修申込設定（研修カテゴリ選択時のみ表示） */}
            {form.category === 'training' && (
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>📚</span>
                    <span>研修申込設定</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-semibold">参加申込機能を有効にする</Label>
                      <p className="text-sm text-muted-foreground">
                        受信者が直接申込みボタンを押して参加申込みができます
                      </p>
                    </div>
                    <Switch
                      checked={form.trainingEnableRegistration}
                      onCheckedChange={(checked) => setForm(prev => ({ ...prev, trainingEnableRegistration: checked }))}
                    />
                  </div>

                  {form.trainingEnableRegistration && (
                    <div className="space-y-4 p-4 bg-white rounded-lg border">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="trainingCapacity">定員（任意）</Label>
                          <Input
                            id="trainingCapacity"
                            type="number"
                            placeholder="例: 30"
                            value={form.trainingCapacity || ''}
                            onChange={(e) => setForm(prev => ({ ...prev, trainingCapacity: parseInt(e.target.value) || undefined }))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="trainingRegistrationDeadline">申込期限</Label>
                          <Input
                            id="trainingRegistrationDeadline"
                            type="datetime-local"
                            value={form.trainingRegistrationDeadline || ''}
                            onChange={(e) => setForm(prev => ({ ...prev, trainingRegistrationDeadline: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="trainingLocation">開催場所</Label>
                          <Input
                            id="trainingLocation"
                            placeholder="例: 第1会議室"
                            value={form.trainingLocation || ''}
                            onChange={(e) => setForm(prev => ({ ...prev, trainingLocation: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="trainingDuration">所要時間</Label>
                          <Input
                            id="trainingDuration"
                            placeholder="例: 2時間"
                            value={form.trainingDuration || ''}
                            onChange={(e) => setForm(prev => ({ ...prev, trainingDuration: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      {/* 申込時の追加質問 */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <Label className="text-base font-semibold">申込時の追加質問（任意）</Label>
                          <Button onClick={() => addTrainingQuestion()} size="sm" variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            質問を追加
                          </Button>
                        </div>

                        {form.trainingRequiredQuestions.length > 0 && (
                          <div className="space-y-3">
                            {form.trainingRequiredQuestions.map((question, index) => (
                              <div key={question.id} className="p-3 bg-gray-50 rounded border">
                                <div className="flex items-center justify-between mb-2">
                                  <Label className="font-medium">質問 {index + 1}</Label>
                                  <div className="flex gap-1">
                                    <Button
                                      onClick={() => duplicateTrainingQuestion(question.id)}
                                      size="sm"
                                      variant="ghost"
                                    >
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      onClick={() => removeTrainingQuestion(question.id)}
                                      size="sm"
                                      variant="ghost"
                                      className="text-destructive"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>

                                <Input
                                  placeholder="例: アレルギーの有無を教えてください"
                                  value={question.title}
                                  onChange={(e) => updateTrainingQuestion(question.id, { title: e.target.value })}
                                  className="mb-2"
                                />

                                <div className="flex items-center gap-4">
                                  <Select
                                    value={question.type}
                                    onValueChange={(value: any) => updateTrainingQuestion(question.id, { type: value })}
                                  >
                                    <SelectTrigger className="w-32">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="single">単一選択</SelectItem>
                                      <SelectItem value="multiple">複数選択</SelectItem>
                                      <SelectItem value="text">テキスト</SelectItem>
                                    </SelectContent>
                                  </Select>

                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`training-required-${question.id}`}
                                      checked={question.required}
                                      onCheckedChange={(checked) =>
                                        updateTrainingQuestion(question.id, { required: !!checked })
                                      }
                                    />
                                    <Label htmlFor={`training-required-${question.id}`}>必須</Label>
                                  </div>
                                </div>

                                {/* 選択肢設定 */}
                                {(question.type === 'single' || question.type === 'multiple') && (
                                  <div className="mt-2">
                                    <Label className="text-sm">選択肢</Label>
                                    <div className="space-y-1 mt-1">
                                      {question.options?.map((option, idx) => (
                                        <div key={idx} className="flex gap-2">
                                          <Input
                                            value={option}
                                            onChange={(e) => {
                                              const newOptions = [...(question.options || [])]
                                              newOptions[idx] = e.target.value
                                              updateTrainingQuestion(question.id, { options: newOptions })
                                            }}
                                            placeholder={`選択肢 ${idx + 1}`}
                                            className="text-sm"
                                          />
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                              const newOptions = question.options?.filter((_, i) => i !== idx)
                                              updateTrainingQuestion(question.id, { options: newOptions })
                                            }}
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </Button>
                                        </div>
                                      ))}
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const newOptions = [...(question.options || []), '']
                                          updateTrainingQuestion(question.id, { options: newOptions })
                                        }}
                                      >
                                        <Plus className="w-3 h-3 mr-1" />
                                        選択肢追加
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {form.trainingRequiredQuestions.length === 0 && (
                          <div className="text-center py-6 text-gray-500 text-sm bg-gray-50 rounded border-dashed border-2">
                            申込時の追加質問はありません
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
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
    </>
  )
}