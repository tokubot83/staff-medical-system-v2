'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import {
  Plus,
  Edit,
  Copy,
  Trash2,
  MoreVertical,
  Search,
  Filter,
  Eye,
  Download,
  Upload,
  Star,
  Clock
} from 'lucide-react'

type CategoryType = 'announcement' | 'interview' | 'training' | 'survey' | 'other'

interface NotificationTemplate {
  id: string
  name: string
  category: CategoryType
  title: string
  content: string
  variables: string[]
  usageCount: number
  lastUsed?: string
  createdAt: string
  isFavorite: boolean
  tags: string[]
}

const categoryConfig = {
  announcement: { label: 'お知らせ', color: 'bg-cyan-500', icon: '📣' },
  interview: { label: '面談', color: 'bg-blue-500', icon: '👥' },
  training: { label: '研修', color: 'bg-purple-500', icon: '📚' },
  survey: { label: 'アンケート', color: 'bg-green-500', icon: '📊' },
  other: { label: 'その他', color: 'bg-gray-500', icon: '📢' }
}

const mockTemplates: NotificationTemplate[] = [
  {
    id: '1',
    name: '定期面談案内テンプレート',
    category: 'interview',
    title: '定期面談のご案内（{period}分）',
    content: '{name}さん\n\n{period}の定期面談を実施いたします。\n\n■面談日程\n期間：{start_date}〜{end_date}\n所要時間：約30分\n\n■面談シート\n事前に添付の面談シートへご記入をお願いします。\n\n■希望日時\n{deadline}までに希望日時をご回答ください。\n\nご不明な点がございましたら、人事部までお問い合わせください。',
    variables: ['{name}', '{period}', '{start_date}', '{end_date}', '{deadline}'],
    usageCount: 28,
    lastUsed: '2025-01-15',
    createdAt: '2024-12-01',
    isFavorite: true,
    tags: ['定期', '面談', '人事']
  },
  {
    id: '2',
    name: '研修受講期限通知',
    category: 'training',
    title: '【重要】{training_name} 受講期限のお知らせ',
    content: '職員の皆様\n\n{training_name}の受講期限が近づいております。\n\n■受講期限：{deadline}\n■受講方法：{method}\n■所要時間：約{duration}分\n\n未受講の方は期限内に必ず受講してください。\n期限を過ぎた場合は個別対応となりますので、お早めの受講をお願いします。\n\n受講に関するご質問は教育研修課までお問い合わせください。',
    variables: ['{training_name}', '{deadline}', '{method}', '{duration}'],
    usageCount: 45,
    lastUsed: '2025-01-14',
    createdAt: '2024-11-15',
    isFavorite: true,
    tags: ['研修', '期限', '必須']
  },
  {
    id: '3',
    name: 'ストレスチェック実施案内',
    category: 'health',
    title: 'ストレスチェック実施のお知らせ',
    content: '職員の皆様\n\n労働安全衛生法に基づく年次ストレスチェックを実施いたします。\n\n■実施期間：{start_date}〜{end_date}\n■実施方法：{method}\n■所要時間：約{duration}分\n■結果の取扱い：個人情報保護に配慮し、厳重に管理いたします\n\n本検査は義務ではありませんが、ご自身の健康管理のため積極的な受検をお願いします。\n\n受検に関するお問い合わせは産業保健師までご連絡ください。',
    variables: ['{start_date}', '{end_date}', '{method}', '{duration}'],
    usageCount: 12,
    lastUsed: '2025-01-10',
    createdAt: '2024-10-01',
    isFavorite: false,
    tags: ['ストレスチェック', '健康管理', '義務']
  },
  {
    id: '4',
    name: '緊急システム障害通知',
    category: 'announcement',
    title: '【緊急】{system_name}システム障害のお知らせ',
    content: '職員の皆様\n\n現在、{system_name}システムに障害が発生しており、ご利用いただけない状況となっております。\n\n■障害発生時刻：{incident_time}\n■影響範囲：{affected_areas}\n■復旧予定：{estimated_recovery}\n\n復旧まで以下の代替手段をご利用ください：\n{alternative_method}\n\n復旧完了次第、改めてご連絡いたします。\nご迷惑をおかけして申し訳ございません。',
    variables: ['{system_name}', '{incident_time}', '{affected_areas}', '{estimated_recovery}', '{alternative_method}'],
    usageCount: 3,
    lastUsed: '2024-12-20',
    createdAt: '2024-09-01',
    isFavorite: false,
    tags: ['緊急', 'システム', '障害']
  },
  {
    id: '5',
    name: 'アンケート協力依頼',
    category: 'survey',
    title: '{survey_title}へのご協力のお願い',
    content: '職員の皆様\n\n{survey_purpose}を目的とした{survey_title}を実施いたします。\n\n■回答期限：{deadline}\n■所要時間：約{duration}分\n■回答方法：{method}\n■匿名性：{anonymity}\n\n皆様のご意見は{usage_purpose}に活用させていただきます。\nお忙しい中恐縮ですが、ご協力をお願いいたします。\n\nアンケートに関するお問い合わせは人事部までご連絡ください。',
    variables: ['{survey_title}', '{survey_purpose}', '{deadline}', '{duration}', '{method}', '{anonymity}', '{usage_purpose}'],
    usageCount: 8,
    lastUsed: '2025-01-12',
    createdAt: '2024-08-15',
    isFavorite: false,
    tags: ['アンケート', '調査', '協力']
  }
]

export default function TemplateManager() {
  const [templates] = useState<NotificationTemplate[]>(mockTemplates)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null)

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const handleUseTemplate = (template: NotificationTemplate) => {
    console.log('Using template:', template.name)
    alert(`テンプレート「${template.name}」を新規作成タブに適用しました`)
  }

  const handleEditTemplate = (template: NotificationTemplate) => {
    setEditingTemplate(template)
    setShowCreateModal(true)
  }

  const handleCreateTemplate = () => {
    setEditingTemplate(null)
    setShowCreateModal(true)
  }

  const handleSaveTemplate = () => {
    setShowCreateModal(false)
    setEditingTemplate(null)
    alert('テンプレートを保存しました')
  }

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('このテンプレートを削除しますか？')) {
      console.log('Deleting template:', templateId)
      alert('テンプレートを削除しました')
    }
  }

  return (
    <div className="space-y-6">
      {/* ヘッダーエリア */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">テンプレート管理</h2>
          <p className="text-gray-600">定型的な通知のテンプレートを管理します</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            インポート
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            エクスポート
          </Button>
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button onClick={handleCreateTemplate} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                新規テンプレート
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingTemplate ? 'テンプレート編集' : '新規テンプレート作成'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">テンプレート名</label>
                    <Input
                      placeholder="テンプレート名を入力"
                      defaultValue={editingTemplate?.name || ''}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">カテゴリ</label>
                    <Select defaultValue={editingTemplate?.category || 'other'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">緊急</SelectItem>
                        <SelectItem value="interview">面談</SelectItem>
                        <SelectItem value="training">研修</SelectItem>
                        <SelectItem value="survey">アンケート</SelectItem>
                        <SelectItem value="health">健康管理</SelectItem>
                        <SelectItem value="other">その他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">件名テンプレート</label>
                  <Input
                    placeholder="件名テンプレートを入力（変数は{variable_name}で記述）"
                    defaultValue={editingTemplate?.title || ''}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">本文テンプレート</label>
                  <Textarea
                    rows={12}
                    placeholder="本文テンプレートを入力（変数は{variable_name}で記述）"
                    defaultValue={editingTemplate?.content || ''}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">タグ（カンマ区切り）</label>
                  <Input
                    placeholder="例: 定期, 面談, 人事"
                    defaultValue={editingTemplate?.tags.join(', ') || ''}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                    キャンセル
                  </Button>
                  <Button onClick={handleSaveTemplate}>
                    {editingTemplate ? '更新' : '作成'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 検索・フィルタエリア */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="テンプレート名・内容・タグで検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="カテゴリ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="announcement">お知らせ</SelectItem>
                <SelectItem value="interview">面談</SelectItem>
                <SelectItem value="training">研修</SelectItem>
                <SelectItem value="survey">アンケート</SelectItem>
                <SelectItem value="other">その他</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* テンプレート一覧 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg line-clamp-1">
                      {template.name}
                    </CardTitle>
                    {template.isFavorite && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <Badge className={`${categoryConfig[template.category]?.color || 'bg-gray-500'} text-white text-xs`}>
                      <span className="mr-1">{categoryConfig[template.category]?.icon || '📢'}</span>
                      {categoryConfig[template.category]?.label || template.category}
                    </Badge>

                    {template.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {template.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleUseTemplate(template)}>
                      <Eye className="w-4 h-4 mr-2" />
                      使用する
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditTemplate(template)}>
                      <Edit className="w-4 h-4 mr-2" />
                      編集
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="w-4 h-4 mr-2" />
                      複製
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      削除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">件名</p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {template.title}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">本文プレビュー</p>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {template.content}
                  </p>
                </div>

                {template.variables.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">変数</p>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.slice(0, 3).map((variable, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {variable}
                        </Badge>
                      ))}
                      {template.variables.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.variables.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>使用: {template.usageCount}回</span>
                  </div>
                  {template.lastUsed && (
                    <span>最終: {template.lastUsed}</span>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleUseTemplate(template)}
                  >
                    使用する
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditTemplate(template)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">
              <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>該当するテンプレートが見つかりません</p>
              <p className="text-sm mt-2">検索条件を変更するか、新しいテンプレートを作成してください</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}