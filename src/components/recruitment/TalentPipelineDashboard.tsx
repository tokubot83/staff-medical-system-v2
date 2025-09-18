'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  TalentProfile, TalentStatus, PipelineMetrics, DuplicateCheckResult
} from '@/types/talentPipeline'
import {
  Users, TrendingUp, AlertTriangle, Search, Filter, ArrowRight,
  UserCheck, UserX, Clock, Building, Mail, Phone, Eye,
  ChevronRight, AlertCircle, CheckCircle2, XCircle, ListTodo,
  Bell, CalendarCheck, FileWarning, UserPlus, Calendar, CheckSquare
} from 'lucide-react'

interface TalentPipelineDashboardProps {
  talents: TalentProfile[]
  metrics: PipelineMetrics
  onStageTransition?: (talentId: string, newStatus: TalentStatus) => void
  onDuplicateCheck?: (email: string, phone: string) => Promise<DuplicateCheckResult>
  onViewProfile?: (talentId: string) => void
}

export default function TalentPipelineDashboard({
  talents,
  metrics,
  onStageTransition,
  onDuplicateCheck,
  onViewProfile
}: TalentPipelineDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStage, setSelectedStage] = useState<string>('all')
  const [duplicateAlerts, setDuplicateAlerts] = useState<{ [key: string]: DuplicateCheckResult }>({})
  const [showDuplicateOnly, setShowDuplicateOnly] = useState(false)
  const [todoCompleted, setTodoCompleted] = useState<string[]>([])

  // 今日の日付を取得
  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  // ステージ別の人数カウント
  const stageCounts = {
    visitor: talents.filter(t => t.currentStage === 'visitor').length,
    applicant: talents.filter(t => t.currentStage === 'applicant').length,
    offerHolder: talents.filter(t => t.currentStage === 'offer-holder').length,
    employee: talents.filter(t => t.currentStage === 'employee').length,
    talentPool: talents.filter(t => t.currentStatus === 'talent-pool').length,
    inactive: talents.filter(t => t.currentStage === 'inactive').length
  }

  // フィルタリング
  const filteredTalents = talents.filter(talent => {
    const matchesSearch = searchQuery === '' ||
      `${talent.basicInfo.lastName}${talent.basicInfo.firstName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talent.basicInfo.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talent.basicInfo.phone.includes(searchQuery)

    const matchesStage = selectedStage === 'all' || talent.currentStage === selectedStage

    const matchesDuplicate = !showDuplicateOnly || talent.flags.isDuplicate

    return matchesSearch && matchesStage && matchesDuplicate
  })

  // ステータスの色取得
  const getStatusColor = (status: TalentStatus) => {
    const colors: { [key: string]: string } = {
      'visitor-scheduled': '#3b82f6',
      'visitor-completed': '#8b5cf6',
      'applicant-new': '#06b6d4',
      'applicant-screening': '#f59e0b',
      'applicant-interview': '#6366f1',
      'offer-pending': '#8b5cf6',
      'offer-accepted': '#10b981',
      'onboarding': '#16a34a',
      'employed': '#059669',
      'declined': '#6b7280',
      'rejected': '#ef4444',
      'talent-pool': '#f97316',
      'blacklist': '#dc2626'
    }
    return colors[status] || '#6b7280'
  }

  // ステータスラベル取得
  const getStatusLabel = (status: TalentStatus) => {
    const labels: { [key: string]: string } = {
      'visitor-scheduled': '見学予定',
      'visitor-completed': '見学済み',
      'applicant-new': '新規応募',
      'applicant-screening': '書類選考',
      'applicant-interview': '面接中',
      'offer-pending': '内定出し',
      'offer-accepted': '内定承諾',
      'onboarding': '入職準備',
      'employed': '入職済み',
      'declined': '辞退',
      'rejected': '不採用',
      'talent-pool': 'タレントプール',
      'blacklist': '採用不可'
    }
    return labels[status] || status
  }

  // パイプラインビジュアライゼーション
  const PipelineFlow = () => {
    const stages = [
      { key: 'visitor', label: '見学者', count: stageCounts.visitor, color: '#3b82f6' },
      { key: 'applicant', label: '応募者', count: stageCounts.applicant, color: '#6366f1' },
      { key: 'offer-holder', label: '内定者', count: stageCounts.offerHolder, color: '#8b5cf6' },
      { key: 'employee', label: '職員', count: stageCounts.employee, color: '#10b981' }
    ]

    return (
      <div className="flex items-center justify-between mb-6">
        {stages.map((stage, index) => (
          <React.Fragment key={stage.key}>
            <div
              className="flex-1 cursor-pointer"
              onClick={() => setSelectedStage(stage.key)}
            >
              <div
                className="relative p-4 rounded-lg text-white text-center"
                style={{ backgroundColor: stage.color }}
              >
                <div className="text-3xl font-bold">{stage.count}</div>
                <div className="text-sm mt-1">{stage.label}</div>
                {index < stages.length - 1 && (
                  <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
              {index < stages.length - 1 && (
                <div className="text-center text-xs text-gray-500 mt-1">
                  {((stages[index + 1].count / stage.count) * 100).toFixed(0)}%
                </div>
              )}
            </div>
            {index < stages.length - 1 && <div className="w-6" />}
          </React.Fragment>
        ))}
      </div>
    )
  }

  // 重複チェック処理
  const checkDuplicate = async (talent: TalentProfile) => {
    if (onDuplicateCheck) {
      const result = await onDuplicateCheck(talent.basicInfo.email, talent.basicInfo.phone)
      setDuplicateAlerts(prev => ({ ...prev, [talent.id]: result }))
      return result
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* 統合ダッシュボードヘッダー */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            人材パイプライン統合ダッシュボード
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PipelineFlow />

          {/* KPIカード */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                  <span className="text-xs text-green-600">+12%</span>
                </div>
                <div className="text-2xl font-bold">
                  {metrics.conversionRates.visitorToApplicant.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">見学→応募率</div>
                <Progress
                  value={metrics.conversionRates.visitorToApplicant}
                  className="h-1 mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <UserCheck className="h-8 w-8 text-blue-500" />
                  <span className="text-xs text-blue-600">目標達成</span>
                </div>
                <div className="text-2xl font-bold">
                  {metrics.conversionRates.offerToEmployee.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">内定→入職率</div>
                <Progress
                  value={metrics.conversionRates.offerToEmployee}
                  className="h-1 mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="h-8 w-8 text-orange-500" />
                  <span className="text-xs text-gray-600">日</span>
                </div>
                <div className="text-2xl font-bold">
                  {metrics.averageDuration.applicationToInterview}
                </div>
                <div className="text-sm text-gray-600">応募→面接</div>
                <div className="text-xs text-gray-500 mt-1">
                  平均所要日数
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-8 w-8 text-purple-500" />
                  <Badge className="bg-purple-100 text-purple-800">
                    人材プール
                  </Badge>
                </div>
                <div className="text-2xl font-bold">{stageCounts.talentPool}</div>
                <div className="text-sm text-gray-600">将来候補</div>
                <div className="text-xs text-gray-500 mt-1">
                  優秀人材ストック
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 検索・フィルター */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="名前、メール、電話番号で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={showDuplicateOnly ? 'default' : 'outline'}
              onClick={() => setShowDuplicateOnly(!showDuplicateOnly)}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              重複のみ
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              詳細フィルター
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 人材リスト */}
      <Card>
        <CardHeader>
          <CardTitle>人材一覧 ({filteredTalents.length}名)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTalents.slice(0, 10).map((talent) => {
              const duplicateInfo = duplicateAlerts[talent.id]

              return (
                <div
                  key={talent.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  {/* 重複アラート */}
                  {(talent.flags.isDuplicate || duplicateInfo?.isDuplicate) && (
                    <Alert className="mb-3 border-yellow-500 bg-yellow-50">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800">
                        <span className="font-semibold">重複の可能性:</span>
                        {duplicateInfo?.matchedProfiles?.[0] && (
                          <span className="ml-2">
                            {duplicateInfo.matchedProfiles[0].name}
                            （{duplicateInfo.matchedProfiles[0].currentStatus}）と
                            {duplicateInfo.matchedProfiles[0].matchReason.join('、')}が一致
                          </span>
                        )}
                        {talent.flags.hasMultipleFacilityApplications && (
                          <span className="ml-2">複数施設に応募履歴あり</span>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: getStatusColor(talent.currentStatus) }}
                      >
                        {talent.basicInfo.lastName[0]}{talent.basicInfo.firstName[0]}
                      </div>

                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-lg">
                            {talent.basicInfo.lastName} {talent.basicInfo.firstName}
                          </span>
                          <Badge
                            style={{
                              backgroundColor: getStatusColor(talent.currentStatus),
                              color: 'white'
                            }}
                          >
                            {getStatusLabel(talent.currentStatus)}
                          </Badge>
                          {talent.flags.isPreviousEmployee && (
                            <Badge className="bg-blue-100 text-blue-800">元職員</Badge>
                          )}
                          {talent.tags.map(tag => (
                            <Badge key={tag} variant="outline">{tag}</Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {talent.basicInfo.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {talent.basicInfo.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {talent.contactHistory[0]?.facility || '-'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            最終接触: {talent.basicInfo.lastContactDate}
                          </span>
                        </div>

                        {/* 接触履歴サマリー */}
                        <div className="flex items-center gap-2 mt-2">
                          {talent.contactHistory.slice(0, 3).map((contact, index) => (
                            <div
                              key={contact.id}
                              className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs"
                            >
                              {contact.type === 'facility-visit' && <Eye className="h-3 w-3" />}
                              {contact.type.includes('interview') && <Users className="h-3 w-3" />}
                              {contact.type === 'offer' && <CheckCircle2 className="h-3 w-3" />}
                              {contact.date}
                            </div>
                          ))}
                          {talent.contactHistory.length > 3 && (
                            <span className="text-xs text-gray-500">
                              他{talent.contactHistory.length - 3}件
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* ステージ遷移ボタン */}
                      {talent.currentStatus === 'visitor-completed' && (
                        <Button
                          size="sm"
                          onClick={() => onStageTransition?.(talent.id, 'applicant-new')}
                        >
                          応募へ
                        </Button>
                      )}
                      {talent.currentStatus === 'applicant-interview' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onStageTransition?.(talent.id, 'offer-pending')}
                        >
                          内定へ
                        </Button>
                      )}
                      {!talent.flags.isDuplicate && talent.currentStage === 'visitor' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => checkDuplicate(talent)}
                        >
                          重複確認
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onViewProfile?.(talent.id)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredTalents.length > 10 && (
            <div className="mt-4 text-center">
              <Button variant="outline">
                さらに表示 ({filteredTalents.length - 10}件)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 施設別状況 */}
      <Card>
        <CardHeader>
          <CardTitle>施設別パイプライン状況</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.facilityMetrics.map((facility) => (
              <div key={facility.facility} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">{facility.facility}</span>
                  <Badge variant="outline">
                    今月採用: {facility.monthlyHires}名
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">見学者</div>
                    <div className="text-xl font-bold text-blue-600">
                      {facility.activeVisitors}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">応募者</div>
                    <div className="text-xl font-bold text-purple-600">
                      {facility.activeApplicants}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">内定者</div>
                    <div className="text-xl font-bold text-green-600">
                      {facility.pendingOffers}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}