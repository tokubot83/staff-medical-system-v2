'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import {
  MoreVertical,
  Search,
  Filter,
  Eye,
  Edit,
  Copy,
  Trash2,
  Send,
  BarChart3,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'

type DeliveryStatus = 'draft' | 'scheduled' | 'sending' | 'delivered' | 'failed'
type CategoryType = 'urgent' | 'interview' | 'training' | 'survey' | 'health' | 'other'

interface DeliveryRecord {
  id: string
  title: string
  category: CategoryType
  content: string
  status: DeliveryStatus
  targetType: string
  targetCount: number
  targetDetail: string
  createdAt: string
  scheduledAt?: string
  sentAt?: string
  priority: 'high' | 'medium' | 'low'
  openRate?: number
  clickRate?: number
  responseRate?: number
  errorMessage?: string
}

const statusConfig = {
  draft: { label: '下書き', color: 'bg-gray-100 text-gray-800', icon: '📝' },
  scheduled: { label: '配信予約', color: 'bg-blue-100 text-blue-800', icon: '⏰' },
  sending: { label: '配信中', color: 'bg-yellow-100 text-yellow-800', icon: '📤' },
  delivered: { label: '配信完了', color: 'bg-green-100 text-green-800', icon: '✅' },
  failed: { label: '配信失敗', color: 'bg-red-100 text-red-800', icon: '❌' }
}

const categoryConfig = {
  urgent: { label: '緊急', color: 'bg-red-500', icon: '🚨' },
  interview: { label: '面談', color: 'bg-blue-500', icon: '👥' },
  training: { label: '研修', color: 'bg-purple-500', icon: '📚' },
  survey: { label: 'アンケート', color: 'bg-green-500', icon: '📝' },
  health: { label: '健康管理', color: 'bg-orange-500', icon: '🏥' },
  other: { label: 'その他', color: 'bg-gray-500', icon: '📢' }
}

const priorityConfig = {
  high: { label: '高', color: 'bg-red-100 text-red-800' },
  medium: { label: '中', color: 'bg-yellow-100 text-yellow-800' },
  low: { label: '低', color: 'bg-green-100 text-green-800' }
}

const mockDeliveryData: DeliveryRecord[] = [
  {
    id: '1',
    title: '【緊急】新型コロナ対策強化のお知らせ',
    category: 'urgent',
    content: '新たな変異株の流行に伴い、感染対策を強化いたします。詳細は添付資料をご確認ください。',
    status: 'delivered',
    targetType: 'all',
    targetCount: 1250,
    targetDetail: '全職員',
    createdAt: '2025-01-15 14:30',
    sentAt: '2025-01-15 15:00',
    priority: 'high',
    openRate: 98,
    clickRate: 85
  },
  {
    id: '2',
    title: '定期面談のご案内（2025年2月分）',
    category: 'interview',
    content: '2025年2月の定期面談を実施します。面談希望日をご回答ください。',
    status: 'scheduled',
    targetType: 'departments',
    targetCount: 45,
    targetDetail: '看護部',
    createdAt: '2025-01-14 10:15',
    scheduledAt: '2025-01-20 09:00',
    priority: 'medium',
    responseRate: 67
  },
  {
    id: '3',
    title: '医療安全研修（必須）受講期限のお知らせ',
    category: 'training',
    content: '2025年度医療安全研修の受講期限は1月31日です。未受講の方は至急受講してください。',
    status: 'delivered',
    targetType: 'individuals',
    targetCount: 127,
    targetDetail: '未受講者',
    createdAt: '2025-01-13 16:45',
    sentAt: '2025-01-14 09:00',
    priority: 'high',
    openRate: 94,
    clickRate: 78
  },
  {
    id: '4',
    title: '職場環境改善アンケート実施中',
    category: 'survey',
    content: '働きやすい職場環境を目指し、皆様のご意見をお聞かせください。匿名でご回答いただけます。',
    status: 'sending',
    targetType: 'all',
    targetCount: 1250,
    targetDetail: '全職員',
    createdAt: '2025-01-12 13:20',
    sentAt: '2025-01-15 08:00',
    priority: 'medium',
    openRate: 76,
    responseRate: 45
  },
  {
    id: '5',
    title: 'ストレスチェック実施のお知らせ',
    category: 'health',
    content: '労働安全衛生法に基づくストレスチェックを実施します。期限内に必ず受検してください。',
    status: 'delivered',
    targetType: 'all',
    targetCount: 1250,
    targetDetail: '全職員',
    createdAt: '2025-01-10 11:30',
    sentAt: '2025-01-11 10:00',
    priority: 'high',
    openRate: 89,
    clickRate: 72,
    responseRate: 68
  },
  {
    id: '6',
    title: '年度末業務調整について',
    category: 'other',
    content: '年度末の業務調整に関する重要な連絡事項をお知らせします。',
    status: 'draft',
    targetType: 'positions',
    targetCount: 25,
    targetDetail: '管理職',
    createdAt: '2025-01-09 15:45',
    priority: 'medium'
  },
  {
    id: '7',
    title: '夜勤体制変更のお知らせ',
    category: 'urgent',
    content: '人員配置の都合により、夜勤体制を一部変更いたします。',
    status: 'failed',
    targetType: 'departments',
    targetCount: 89,
    targetDetail: '看護部・技術職',
    createdAt: '2025-01-08 18:20',
    priority: 'high',
    errorMessage: 'メールサーバーエラーにより配信に失敗しました'
  }
]

export default function DeliveryHistory() {
  const [deliveryData] = useState<DeliveryRecord[]>(mockDeliveryData)
  const [selectedRecords, setSelectedRecords] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [showDetailModal, setShowDetailModal] = useState<string | null>(null)

  const filteredData = deliveryData.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || record.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleSelectRecord = (recordId: string) => {
    setSelectedRecords(prev =>
      prev.includes(recordId)
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    )
  }

  const handleSelectAll = () => {
    if (selectedRecords.length === filteredData.length) {
      setSelectedRecords([])
    } else {
      setSelectedRecords(filteredData.map(record => record.id))
    }
  }

  const handleAction = (action: string, recordId?: string) => {
    console.log(`Action: ${action}`, recordId || selectedRecords)

    switch (action) {
      case 'resend':
        alert(`${recordId ? '1件' : selectedRecords.length + '件'}を再配信しました`)
        break
      case 'delete':
        alert(`${recordId ? '1件' : selectedRecords.length + '件'}を削除しました`)
        break
      case 'copy':
        alert('複製しました')
        break
      default:
        console.log('Action:', action)
    }
  }

  const getStatusIcon = (status: DeliveryStatus) => {
    if (status === 'sending') {
      return <Loader2 className="w-4 h-4 animate-spin" />
    }
    return <span className="text-sm">{statusConfig[status].icon}</span>
  }

  return (
    <div className="space-y-6">
      {/* 検索・フィルタエリア */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="件名・内容で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="配信状態" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="draft">下書き</SelectItem>
                  <SelectItem value="scheduled">配信予約</SelectItem>
                  <SelectItem value="sending">配信中</SelectItem>
                  <SelectItem value="delivered">配信完了</SelectItem>
                  <SelectItem value="failed">配信失敗</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="カテゴリ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
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
        </CardContent>
      </Card>

      {/* 一括操作エリア */}
      {selectedRecords.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {selectedRecords.length}件選択中
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction('resend')}
                  className="flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  再配信
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction('delete')}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  削除
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedRecords([])}
              >
                選択解除
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 配信履歴リスト */}
      <div className="space-y-4">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            配信履歴 ({filteredData.length}件)
          </h3>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={selectedRecords.length === filteredData.length && filteredData.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-gray-600">すべて選択</span>
          </div>
        </div>

        {/* リスト */}
        <div className="space-y-3">
          {filteredData.map((record) => (
            <Card key={record.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={selectedRecords.includes(record.id)}
                    onCheckedChange={() => handleSelectRecord(record.id)}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {record.title}
                        </h4>

                        {/* カテゴリバッジ */}
                        <Badge className={`${categoryConfig[record.category].color} text-white text-xs`}>
                          <span className="mr-1">{categoryConfig[record.category].icon}</span>
                          {categoryConfig[record.category].label}
                        </Badge>

                        {/* 優先度バッジ */}
                        <Badge className={`${priorityConfig[record.priority].color} text-xs`}>
                          {priorityConfig[record.priority].label}
                        </Badge>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setShowDetailModal(record.id)}>
                            <Eye className="w-4 h-4 mr-2" />
                            詳細を見る
                          </DropdownMenuItem>
                          {record.status === 'delivered' && (
                            <DropdownMenuItem>
                              <BarChart3 className="w-4 h-4 mr-2" />
                              配信統計
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            編集
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('copy', record.id)}>
                            <Copy className="w-4 h-4 mr-2" />
                            複製
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {(record.status === 'failed' || record.status === 'draft') && (
                            <DropdownMenuItem onClick={() => handleAction('resend', record.id)}>
                              <Send className="w-4 h-4 mr-2" />
                              再配信
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleAction('delete', record.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            削除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {record.content}
                    </p>

                    <div className="flex items-center gap-6 text-sm">
                      {/* 配信状態 */}
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <Badge className={statusConfig[record.status].color}>
                          {statusConfig[record.status].label}
                        </Badge>
                        {record.status === 'failed' && record.errorMessage && (
                          <span className="text-red-600 text-xs">
                            ({record.errorMessage})
                          </span>
                        )}
                      </div>

                      {/* 配信対象 */}
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{record.targetDetail} {record.targetCount}名</span>
                      </div>

                      {/* 日時情報 */}
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {record.status === 'scheduled' && record.scheduledAt ? (
                          <span>予約: {record.scheduledAt}</span>
                        ) : record.sentAt ? (
                          <span>配信: {record.sentAt}</span>
                        ) : (
                          <span>作成: {record.createdAt}</span>
                        )}
                      </div>

                      {/* 配信統計 */}
                      {record.status === 'delivered' && (
                        <div className="flex items-center gap-4 text-xs">
                          {record.openRate && (
                            <span className="text-green-600">
                              開封率: {record.openRate}%
                            </span>
                          )}
                          {record.clickRate && (
                            <span className="text-blue-600">
                              クリック率: {record.clickRate}%
                            </span>
                          )}
                          {record.responseRate && (
                            <span className="text-purple-600">
                              回答率: {record.responseRate}%
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredData.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-500">
                <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>該当する配信履歴が見つかりません</p>
                <p className="text-sm mt-2">検索条件を変更してお試しください</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}