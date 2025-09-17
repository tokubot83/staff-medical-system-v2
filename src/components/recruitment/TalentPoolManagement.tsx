'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TalentProfile, DuplicateCheckResult } from '@/types/talentPipeline'
import {
  Users, Star, Calendar, Mail, Phone, Building, Filter, Search,
  AlertCircle, TrendingUp, Clock, Target, UserPlus, MessageSquare,
  CheckCircle2, XCircle, RefreshCw, Archive
} from 'lucide-react'

interface TalentPoolManagementProps {
  talentPool: TalentProfile[]
  onReactivate?: (talentId: string) => void
  onUpdateTalent?: (talentId: string, updates: Partial<TalentProfile>) => void
  onSendMessage?: (talentId: string, message: string) => void
  onCheckDuplicate?: (email: string, phone: string) => Promise<DuplicateCheckResult>
}

export default function TalentPoolManagement({
  talentPool,
  onReactivate,
  onUpdateTalent,
  onSendMessage,
  onCheckDuplicate
}: TalentPoolManagementProps) {
  const [selectedTalent, setSelectedTalent] = useState<TalentProfile | null>(null)
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showRecontactOnly, setShowRecontactOnly] = useState(false)

  // カテゴリー別集計
  const categoryCounts = {
    'future-fit': talentPool.filter(t => t.talentPoolInfo?.category === 'future-fit').length,
    'skill-mismatch': talentPool.filter(t => t.talentPoolInfo?.category === 'skill-mismatch').length,
    'timing-mismatch': talentPool.filter(t => t.talentPoolInfo?.category === 'timing-mismatch').length,
    'location-mismatch': talentPool.filter(t => t.talentPoolInfo?.category === 'location-mismatch').length,
    'salary-mismatch': talentPool.filter(t => t.talentPoolInfo?.category === 'salary-mismatch').length
  }

  // フィルタリング
  const filteredTalents = talentPool.filter(talent => {
    const matchesSearch = searchQuery === '' ||
      `${talent.basicInfo.lastName}${talent.basicInfo.firstName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talent.basicInfo.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = filterCategory === 'all' || talent.talentPoolInfo?.category === filterCategory

    const matchesPriority = filterPriority === 'all' || talent.talentPoolInfo?.priority === filterPriority

    const matchesRecontact = !showRecontactOnly || (talent.talentPoolInfo?.recontactDate &&
      new Date(talent.talentPoolInfo.recontactDate) <= new Date())

    return matchesSearch && matchesCategory && matchesPriority && matchesRecontact
  })

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'future-fit': '将来採用候補',
      'skill-mismatch': 'スキル不足',
      'timing-mismatch': 'タイミング不一致',
      'location-mismatch': '勤務地不一致',
      'salary-mismatch': '給与条件不一致'
    }
    return labels[category] || category
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'future-fit': '#10b981',
      'skill-mismatch': '#f59e0b',
      'timing-mismatch': '#3b82f6',
      'location-mismatch': '#8b5cf6',
      'salary-mismatch': '#ef4444'
    }
    return colors[category] || '#6b7280'
  }

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      'high': '#dc2626',
      'medium': '#f59e0b',
      'low': '#6b7280'
    }
    return colors[priority] || '#6b7280'
  }

  // 再コンタクト候補
  const recontactCandidates = talentPool.filter(t => {
    if (!t.talentPoolInfo?.recontactDate) return false
    const recontactDate = new Date(t.talentPoolInfo.recontactDate)
    const today = new Date()
    const daysDiff = Math.floor((recontactDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysDiff <= 7 && daysDiff >= 0
  })

  return (
    <div className="space-y-6">
      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-8 w-8 text-purple-500" />
              <Badge variant="outline">Total</Badge>
            </div>
            <div className="text-2xl font-bold">{talentPool.length}名</div>
            <div className="text-sm text-gray-600">タレントプール総数</div>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${(talentPool.length / 100) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">容量</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Star className="h-8 w-8 text-green-500" />
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold">{categoryCounts['future-fit']}名</div>
            <div className="text-sm text-gray-600">将来採用候補</div>
            <div className="mt-2 text-xs text-green-600">
              優秀人材として保持
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <RefreshCw className="h-8 w-8 text-blue-500" />
              <Badge className="bg-blue-100 text-blue-800">今週</Badge>
            </div>
            <div className="text-2xl font-bold">{recontactCandidates.length}名</div>
            <div className="text-sm text-gray-600">再コンタクト予定</div>
            <div className="mt-2 text-xs text-blue-600">
              フォローアップ対象
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="h-8 w-8 text-orange-500" />
              <span className="text-2xl">32%</span>
            </div>
            <div className="text-sm font-medium">プール→採用率</div>
            <div className="text-sm text-gray-600">過去1年実績</div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '32%' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 再コンタクトアラート */}
      {recontactCandidates.length > 0 && (
        <Alert className="border-blue-500 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <span className="font-semibold text-blue-900">
              {recontactCandidates.length}名の候補者が再コンタクト時期です
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {recontactCandidates.slice(0, 3).map(candidate => (
                <Badge key={candidate.id} variant="outline" className="text-blue-700">
                  {candidate.basicInfo.lastName} {candidate.basicInfo.firstName}
                </Badge>
              ))}
              {recontactCandidates.length > 3 && (
                <Badge variant="outline" className="text-blue-700">
                  他{recontactCandidates.length - 3}名
                </Badge>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* メインコンテンツ */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5" />
              タレントプール管理
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={showRecontactOnly ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowRecontactOnly(!showRecontactOnly)}
              >
                <Clock className="h-4 w-4 mr-1" />
                再コンタクト対象
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* フィルター */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="名前、メールで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="カテゴリー" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全カテゴリー</SelectItem>
                <SelectItem value="future-fit">将来採用候補</SelectItem>
                <SelectItem value="skill-mismatch">スキル不足</SelectItem>
                <SelectItem value="timing-mismatch">タイミング不一致</SelectItem>
                <SelectItem value="location-mismatch">勤務地不一致</SelectItem>
                <SelectItem value="salary-mismatch">給与条件不一致</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="優先度" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全優先度</SelectItem>
                <SelectItem value="high">高</SelectItem>
                <SelectItem value="medium">中</SelectItem>
                <SelectItem value="low">低</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* カテゴリー別サマリー */}
          <div className="grid grid-cols-5 gap-2 mb-6">
            {Object.entries(categoryCounts).map(([category, count]) => (
              <div
                key={category}
                className="p-3 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                style={{
                  borderColor: getCategoryColor(category),
                  backgroundColor: `${getCategoryColor(category)}10`
                }}
                onClick={() => setFilterCategory(category)}
              >
                <div className="text-sm font-medium" style={{ color: getCategoryColor(category) }}>
                  {getCategoryLabel(category)}
                </div>
                <div className="text-2xl font-bold mt-1">{count}</div>
              </div>
            ))}
          </div>

          {/* タレントリスト */}
          <div className="space-y-3">
            {filteredTalents.map((talent) => (
              <div
                key={talent.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-lg">
                        {talent.basicInfo.lastName} {talent.basicInfo.firstName}
                      </span>
                      <Badge
                        style={{
                          backgroundColor: getCategoryColor(talent.talentPoolInfo?.category || ''),
                          color: 'white'
                        }}
                      >
                        {getCategoryLabel(talent.talentPoolInfo?.category || '')}
                      </Badge>
                      <Badge
                        style={{
                          backgroundColor: getPriorityColor(talent.talentPoolInfo?.priority || ''),
                          color: 'white'
                        }}
                      >
                        優先度: {talent.talentPoolInfo?.priority === 'high' ? '高' :
                                talent.talentPoolInfo?.priority === 'medium' ? '中' : '低'}
                      </Badge>
                      {talent.talentPoolInfo?.recontactDate && (
                        <Badge variant="outline" className="text-blue-600">
                          <Clock className="h-3 w-3 mr-1" />
                          再コンタクト: {talent.talentPoolInfo.recontactDate}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex items-center gap-4 text-gray-600">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {talent.basicInfo.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {talent.basicInfo.phone}
                          </span>
                        </div>
                        <div className="mt-2">
                          <span className="text-gray-600">希望ポジション: </span>
                          <span className="font-medium">
                            {talent.talentPoolInfo?.potentialPositions?.join(', ') || '-'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">プール登録理由:</div>
                        <p className="text-sm mt-1">{talent.talentPoolInfo?.notes}</p>
                      </div>
                    </div>

                    {/* 過去の評価サマリー */}
                    {talent.contactHistory.some(c => c.evaluation) && (
                      <div className="mt-3 p-2 bg-gray-50 rounded">
                        <span className="text-xs text-gray-600">過去の評価: </span>
                        {talent.contactHistory
                          .filter(c => c.evaluation)
                          .map(c => (
                            <span key={c.id} className="inline-flex items-center gap-1 ml-2">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    i < (c.evaluation?.overallRating || 0) ? 'bg-yellow-400' : 'bg-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="text-xs text-gray-500">({c.date})</span>
                            </span>
                          ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      size="sm"
                      onClick={() => onReactivate?.(talent.id)}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      再アプローチ
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedTalent(talent)}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      メッセージ
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedTalent(talent)}
                    >
                      詳細
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTalents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              該当する候補者がいません
            </div>
          )}
        </CardContent>
      </Card>

      {/* タレント詳細モーダル */}
      {selectedTalent && (
        <Card>
          <CardHeader>
            <CardTitle>
              タレント詳細: {selectedTalent.basicInfo.lastName} {selectedTalent.basicInfo.firstName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">プール管理情報</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">カテゴリー: </span>
                    <Badge
                      style={{
                        backgroundColor: getCategoryColor(selectedTalent.talentPoolInfo?.category || ''),
                        color: 'white'
                      }}
                    >
                      {getCategoryLabel(selectedTalent.talentPoolInfo?.category || '')}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-600">優先度: </span>
                    <Badge
                      style={{
                        backgroundColor: getPriorityColor(selectedTalent.talentPoolInfo?.priority || ''),
                        color: 'white'
                      }}
                    >
                      {selectedTalent.talentPoolInfo?.priority}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-600">登録日: </span>
                    <span>{selectedTalent.talentPoolInfo?.addedDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">登録者: </span>
                    <span>{selectedTalent.talentPoolInfo?.addedBy}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-gray-600">理由・メモ: </span>
                  <p className="mt-1 p-2 bg-gray-50 rounded text-sm">
                    {selectedTalent.talentPoolInfo?.notes}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">アクション</h4>
                <div className="flex gap-2">
                  <Button onClick={() => onReactivate?.(selectedTalent.id)}>
                    採用プロセスへ復帰
                  </Button>
                  <Button variant="outline">
                    再コンタクト日を設定
                  </Button>
                  <Button variant="outline">
                    優先度を変更
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}