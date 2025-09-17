'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  Trash2,
  Copy,
  Save,
  Send,
  Settings,
  Eye,
  MoveUp,
  MoveDown,
  FileText,
  CheckCircle,
  Circle,
  Square,
  Type,
  Hash,
  Calendar,
  Star,
  Grid3X3,
  ChevronDown,
  ChevronUp
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

// 質問タイプ定義
type QuestionType = 'single' | 'multiple' | 'text' | 'scale' | 'date' | 'matrix' | 'number'

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
  conditionalLogic?: {
    showIf: string
    answer: string
  }
}

interface Survey {
  title: string
  description: string
  category: string
  startDate: string
  endDate: string
  targetDepartments: string[]
  anonymous: boolean
  allowMultipleResponses: boolean
  questions: Question[]
  template?: string
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
      case 'scale': return <Star className="w-4 h-4" />
      case 'number': return <Hash className="w-4 h-4" />
      case 'date': return <Calendar className="w-4 h-4" />
      case 'matrix': return <Grid3X3 className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getQuestionTypeName = (type: QuestionType) => {
    switch (type) {
      case 'single': return '単一選択'
      case 'multiple': return '複数選択'
      case 'text': return 'テキスト'
      case 'scale': return '尺度'
      case 'number': return '数値'
      case 'date': return '日付'
      case 'matrix': return 'マトリクス'
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

              {/* 尺度の設定 */}
              {question.type === 'scale' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>最小値</Label>
                    <Input
                      type="number"
                      value={question.scaleMin || 1}
                      onChange={(e) => onUpdate(question.id, { scaleMin: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>最大値</Label>
                    <Input
                      type="number"
                      value={question.scaleMax || 5}
                      onChange={(e) => onUpdate(question.id, { scaleMax: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>最小ラベル</Label>
                    <Input
                      value={question.scaleMinLabel || ''}
                      onChange={(e) => onUpdate(question.id, { scaleMinLabel: e.target.value })}
                      placeholder="例: 全く満足していない"
                    />
                  </div>
                  <div>
                    <Label>最大ラベル</Label>
                    <Input
                      value={question.scaleMaxLabel || ''}
                      onChange={(e) => onUpdate(question.id, { scaleMaxLabel: e.target.value })}
                      placeholder="例: 非常に満足している"
                    />
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

export default function SurveyCreatePage() {
  const router = useRouter()
  const [survey, setSurvey] = useState<Survey>({
    title: '',
    description: '',
    category: 'general',
    startDate: '',
    endDate: '',
    targetDepartments: [],
    anonymous: false,
    allowMultipleResponses: false,
    questions: [],
    template: ''
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  // 質問の追加
  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      type,
      title: '',
      required: false,
      options: type === 'single' || type === 'multiple' ? [''] : undefined,
      scaleMin: type === 'scale' ? 1 : undefined,
      scaleMax: type === 'scale' ? 5 : undefined
    }

    setSurvey({
      ...survey,
      questions: [...survey.questions, newQuestion]
    })
  }

  // 質問の更新
  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setSurvey({
      ...survey,
      questions: survey.questions.map(q =>
        q.id === id ? { ...q, ...updates } : q
      )
    })
  }

  // 質問の削除
  const deleteQuestion = (id: string) => {
    setSurvey({
      ...survey,
      questions: survey.questions.filter(q => q.id !== id)
    })
  }

  // 質問の複製
  const duplicateQuestion = (id: string) => {
    const question = survey.questions.find(q => q.id === id)
    if (question) {
      const newQuestion = {
        ...question,
        id: `q_${Date.now()}`
      }
      setSurvey({
        ...survey,
        questions: [...survey.questions, newQuestion]
      })
    }
  }

  // ドラッグ終了時の処理
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = survey.questions.findIndex(q => q.id === active.id)
      const newIndex = survey.questions.findIndex(q => q.id === over?.id)

      setSurvey({
        ...survey,
        questions: arrayMove(survey.questions, oldIndex, newIndex)
      })
    }
  }

  // テンプレートの適用
  const applyTemplate = (templateName: string) => {
    switch (templateName) {
      case 'satisfaction':
        setSurvey({
          ...survey,
          title: '職員満足度調査',
          description: '職場環境と業務に関する満足度を調査します',
          questions: [
            {
              id: 'q1',
              type: 'scale',
              title: '現在の職場環境に満足していますか？',
              required: true,
              scaleMin: 1,
              scaleMax: 5,
              scaleMinLabel: '非常に不満',
              scaleMaxLabel: '非常に満足'
            },
            {
              id: 'q2',
              type: 'multiple',
              title: '職場環境で改善してほしい点を選んでください（複数選択可）',
              required: false,
              options: ['労働時間', '人間関係', '設備・環境', '評価制度', '研修制度', 'その他']
            },
            {
              id: 'q3',
              type: 'text',
              title: 'その他ご意見があればお聞かせください',
              required: false
            }
          ]
        })
        break
      case 'training':
        setSurvey({
          ...survey,
          title: '研修効果測定アンケート',
          description: '研修の効果と改善点を調査します',
          questions: [
            {
              id: 'q1',
              type: 'single',
              title: '研修の内容は業務に役立ちましたか？',
              required: true,
              options: ['非常に役立った', '役立った', 'どちらともいえない', 'あまり役立たなかった', '全く役立たなかった']
            },
            {
              id: 'q2',
              type: 'scale',
              title: '研修の難易度はどうでしたか？',
              required: true,
              scaleMin: 1,
              scaleMax: 5,
              scaleMinLabel: '簡単すぎた',
              scaleMaxLabel: '難しすぎた'
            },
            {
              id: 'q3',
              type: 'text',
              title: '今後受けたい研修テーマがあれば教えてください',
              required: false
            }
          ]
        })
        break
    }
  }

  // 保存処理
  const handleSave = () => {
    console.log('Saving survey:', survey)
    alert('アンケートを保存しました')
  }

  // 配信処理
  const handleDeploy = () => {
    if (!survey.title) {
      alert('タイトルを入力してください')
      return
    }
    if (survey.questions.length === 0) {
      alert('質問を追加してください')
      return
    }
    console.log('Deploying survey:', survey)
    router.push('/hr-survey/deploy')
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">アンケート作成</h1>
        <p className="text-muted-foreground">
          Googleフォームのような直感的な操作でアンケートを作成できます
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 左サイドバー：質問タイプ */}
        <div className="col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">質問タイプ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => addQuestion('single')}
              >
                <Circle className="w-4 h-4 mr-2" />
                単一選択
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => addQuestion('multiple')}
              >
                <Square className="w-4 h-4 mr-2" />
                複数選択
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => addQuestion('text')}
              >
                <Type className="w-4 h-4 mr-2" />
                テキスト回答
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => addQuestion('scale')}
              >
                <Star className="w-4 h-4 mr-2" />
                尺度（1-5など）
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => addQuestion('number')}
              >
                <Hash className="w-4 h-4 mr-2" />
                数値入力
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => addQuestion('date')}
              >
                <Calendar className="w-4 h-4 mr-2" />
                日付選択
              </Button>
            </CardContent>
          </Card>

          <Card>
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
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => applyTemplate('health')}
              >
                <FileText className="w-4 h-4 mr-2" />
                健康状態調査
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => applyTemplate('workplace')}
              >
                <FileText className="w-4 h-4 mr-2" />
                職場環境改善
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* メインエリア：アンケート編集 */}
        <div className="col-span-2 space-y-4">
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">基本設定</TabsTrigger>
                  <TabsTrigger value="questions">質問</TabsTrigger>
                  <TabsTrigger value="settings">詳細設定</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div>
                    <Label>アンケートタイトル</Label>
                    <Input
                      value={survey.title}
                      onChange={(e) => setSurvey({ ...survey, title: e.target.value })}
                      placeholder="例: 2025年度 職員満足度調査"
                    />
                  </div>

                  <div>
                    <Label>説明文</Label>
                    <Textarea
                      value={survey.description}
                      onChange={(e) => setSurvey({ ...survey, description: e.target.value })}
                      placeholder="アンケートの目的や所要時間などを記載してください"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>カテゴリ</Label>
                    <Select
                      value={survey.category}
                      onValueChange={(value) => setSurvey({ ...survey, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">全般</SelectItem>
                        <SelectItem value="satisfaction">満足度調査</SelectItem>
                        <SelectItem value="health">健康調査</SelectItem>
                        <SelectItem value="training">研修関連</SelectItem>
                        <SelectItem value="workplace">職場環境</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>開始日時</Label>
                      <Input
                        type="datetime-local"
                        value={survey.startDate}
                        onChange={(e) => setSurvey({ ...survey, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>終了日時</Label>
                      <Input
                        type="datetime-local"
                        value={survey.endDate}
                        onChange={(e) => setSurvey({ ...survey, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="questions" className="space-y-4">
                  {survey.questions.length === 0 ? (
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
                        items={survey.questions.map(q => q.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-3">
                          {survey.questions.map((question, index) => (
                            <SortableQuestion
                              key={question.id}
                              question={question}
                              index={index}
                              onUpdate={updateQuestion}
                              onDelete={deleteQuestion}
                              onDuplicate={duplicateQuestion}
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
                        checked={survey.anonymous}
                        onCheckedChange={(checked) => setSurvey({ ...survey, anonymous: checked })}
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
                        checked={survey.allowMultipleResponses}
                        onCheckedChange={(checked) => setSurvey({ ...survey, allowMultipleResponses: checked })}
                      />
                    </div>

                    <div>
                      <Label>対象部署</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary">内科病棟</Badge>
                        <Badge variant="secondary">外科病棟</Badge>
                        <Badge variant="secondary">救急部</Badge>
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-1" />
                          追加
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>完了時メッセージ</Label>
                      <Textarea
                        placeholder="アンケートにご協力いただきありがとうございました。"
                        rows={3}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* アクションボタン */}
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.back()}>
                キャンセル
              </Button>
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                プレビュー
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                下書き保存
              </Button>
              <Button onClick={handleDeploy}>
                <Send className="w-4 h-4 mr-2" />
                配信設定へ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}