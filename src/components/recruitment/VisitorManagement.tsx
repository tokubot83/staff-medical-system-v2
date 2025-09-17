'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TalentProfile, VisitReservation } from '@/types/talentPipeline'
import {
  Calendar, User, MapPin, Clock, Users, AlertCircle, CheckCircle,
  Mail, Phone, Building, UserPlus, TrendingUp, Eye, Edit, MessageSquare
} from 'lucide-react'

interface VisitorManagementProps {
  visitors: TalentProfile[]
  reservations: VisitReservation[]
  onCreateReservation?: (reservation: Partial<VisitReservation>) => void
  onUpdateVisitor?: (id: string, updates: Partial<TalentProfile>) => void
  onConvertToApplicant?: (visitorId: string) => void
  onCheckDuplicate?: (email: string, phone: string) => Promise<boolean>
}

export default function VisitorManagement({
  visitors,
  reservations,
  onCreateReservation,
  onUpdateVisitor,
  onConvertToApplicant,
  onCheckDuplicate
}: VisitorManagementProps) {
  const [selectedVisitor, setSelectedVisitor] = useState<TalentProfile | null>(null)
  const [showNewReservation, setShowNewReservation] = useState(false)
  const [duplicateAlert, setDuplicateAlert] = useState<string | null>(null)

  // 見学予定者のみをフィルター
  const scheduledVisitors = visitors.filter(v =>
    v.currentStatus === 'visitor-scheduled' && v.visitorInfo?.scheduledVisitDate
  )

  // 本日の見学者
  const todayVisitors = scheduledVisitors.filter(v => {
    const visitDate = new Date(v.visitorInfo?.scheduledVisitDate || '')
    const today = new Date()
    return visitDate.toDateString() === today.toDateString()
  })

  // 見学済みで応募していない人
  const potentialApplicants = visitors.filter(v =>
    v.currentStatus === 'visitor-completed' &&
    v.visitorInfo?.visitFeedback?.interestLevel === 'high'
  )

  const getInterestLevelColor = (level: string) => {
    switch (level) {
      case 'high': return '#16a34a'
      case 'medium': return '#f59e0b'
      case 'low': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getInterestLevelLabel = (level: string) => {
    switch (level) {
      case 'high': return '高い'
      case 'medium': return '普通'
      case 'low': return '低い'
      default: return '-'
    }
  }

  return (
    <div className="space-y-6">
      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-8 w-8 text-blue-500" />
              <Badge variant="outline">本日</Badge>
            </div>
            <div className="text-2xl font-bold">{todayVisitors.length}名</div>
            <div className="text-sm text-gray-600">本日の見学予定</div>
            {todayVisitors.length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                {todayVisitors[0].basicInfo.lastName} {todayVisitors[0].basicInfo.firstName}
                {todayVisitors.length > 1 && ` 他${todayVisitors.length - 1}名`}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-8 w-8 text-green-500" />
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold">{scheduledVisitors.length}名</div>
            <div className="text-sm text-gray-600">見学予定者</div>
            <div className="mt-2 text-xs text-gray-500">
              今週: {scheduledVisitors.filter(v => {
                const date = new Date(v.visitorInfo?.scheduledVisitDate || '')
                const weekFromNow = new Date()
                weekFromNow.setDate(weekFromNow.getDate() + 7)
                return date <= weekFromNow
              }).length}名
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <UserPlus className="h-8 w-8 text-purple-500" />
              <Badge className="bg-purple-100 text-purple-800">応募可能</Badge>
            </div>
            <div className="text-2xl font-bold">{potentialApplicants.length}名</div>
            <div className="text-sm text-gray-600">応募見込み</div>
            <div className="mt-2 text-xs text-gray-500">
              興味度「高い」の見学済み者
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-8 w-8 text-orange-500" />
              <span className="text-2xl">68%</span>
            </div>
            <div className="text-sm font-medium">見学→応募率</div>
            <div className="text-sm text-gray-600">過去3ヶ月平均</div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '68%' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 重複アラート */}
      {duplicateAlert && (
        <Alert className="border-yellow-500 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            {duplicateAlert}
          </AlertDescription>
        </Alert>
      )}

      {/* メインコンテンツ */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              見学者管理
            </CardTitle>
            <Button onClick={() => setShowNewReservation(true)}>
              新規見学予約
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="scheduled">
            <TabsList>
              <TabsTrigger value="scheduled">見学予定 ({scheduledVisitors.length})</TabsTrigger>
              <TabsTrigger value="completed">見学済み ({visitors.filter(v => v.currentStatus === 'visitor-completed').length})</TabsTrigger>
              <TabsTrigger value="potential">応募見込み ({potentialApplicants.length})</TabsTrigger>
              <TabsTrigger value="calendar">カレンダー</TabsTrigger>
            </TabsList>

            <TabsContent value="scheduled" className="space-y-3">
              {scheduledVisitors.map((visitor) => (
                <div
                  key={visitor.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedVisitor(visitor)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold">
                          {visitor.basicInfo.lastName} {visitor.basicInfo.firstName}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {visitor.visitorInfo?.scheduledVisitDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {visitor.visitorInfo?.interestedDepartments?.join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {visitor.flags.isDuplicate && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          重複確認要
                        </Badge>
                      )}
                      <Badge variant="outline">
                        {visitor.visitorInfo?.visitPurpose || '施設見学'}
                      </Badge>
                      <Button size="sm" variant="outline">
                        詳細
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-3">
              {visitors.filter(v => v.currentStatus === 'visitor-completed').map((visitor) => (
                <div
                  key={visitor.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold">
                          {visitor.basicInfo.lastName} {visitor.basicInfo.firstName}
                        </span>
                        <Badge
                          style={{
                            backgroundColor: getInterestLevelColor(visitor.visitorInfo?.visitFeedback?.interestLevel || ''),
                            color: 'white'
                          }}
                        >
                          興味度: {getInterestLevelLabel(visitor.visitorInfo?.visitFeedback?.interestLevel || '')}
                        </Badge>
                        {visitor.visitorInfo?.visitFeedback?.satisfaction && (
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i < (visitor.visitorInfo?.visitFeedback?.satisfaction || 0)
                                    ? 'bg-yellow-400'
                                    : 'bg-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">見学日:</span> {visitor.visitorInfo?.actualVisitDate}
                        </div>
                        <div>
                          <span className="font-medium">興味部署:</span> {visitor.visitorInfo?.interestedDepartments?.join(', ')}
                        </div>
                        <div>
                          <span className="font-medium">フォロー:</span>
                          <span className={visitor.visitorInfo?.visitFeedback?.followUpRequired ? 'text-orange-600 font-medium' : ''}>
                            {visitor.visitorInfo?.visitFeedback?.followUpRequired ? '要' : '不要'}
                          </span>
                        </div>
                      </div>

                      {visitor.visitorInfo?.visitFeedback?.notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <MessageSquare className="h-3 w-3 inline mr-1" />
                          {visitor.visitorInfo.visitFeedback.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onConvertToApplicant?.(visitor.id)
                        }}
                      >
                        応募へ移行
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedVisitor(visitor)
                        }}
                      >
                        詳細
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="potential" className="space-y-3">
              <div className="mb-4 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-sm text-green-800">
                  見学後に高い興味を示した方々です。フォローアップを行い、応募を促進しましょう。
                </p>
              </div>

              {potentialApplicants.map((visitor) => (
                <div
                  key={visitor.id}
                  className="border rounded-lg p-4 hover:bg-green-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold">
                          {visitor.basicInfo.lastName} {visitor.basicInfo.firstName}
                        </span>
                        <Badge className="bg-green-100 text-green-800">
                          高関心
                        </Badge>
                        <span className="text-sm text-gray-600">
                          見学から{Math.floor((new Date().getTime() - new Date(visitor.visitorInfo?.actualVisitDate || '').getTime()) / (1000 * 60 * 60 * 24))}日経過
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">ポジティブな点:</span>
                          <ul className="list-disc list-inside text-gray-600">
                            {visitor.visitorInfo?.visitFeedback?.positivePoints?.map((point, i) => (
                              <li key={i}>{point}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="font-medium">懸念点:</span>
                          <ul className="list-disc list-inside text-gray-600">
                            {visitor.visitorInfo?.visitFeedback?.concerns?.map((concern, i) => (
                              <li key={i}>{concern}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-3">
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="h-3 w-3" />
                          {visitor.basicInfo.email}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          {visitor.basicInfo.phone}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        フォローアップ
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onConvertToApplicant?.(visitor.id)}
                      >
                        応募へ移行
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="calendar">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-7 gap-2">
                  {['日', '月', '火', '水', '木', '金', '土'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 35 }, (_, i) => {
                    const date = new Date()
                    date.setDate(date.getDate() - date.getDay() + i)
                    const dateStr = date.toISOString().split('T')[0]
                    const dayVisitors = scheduledVisitors.filter(v =>
                      v.visitorInfo?.scheduledVisitDate === dateStr
                    )

                    return (
                      <div
                        key={i}
                        className={`min-h-[80px] border rounded p-2 ${
                          dayVisitors.length > 0 ? 'bg-white' : ''
                        } ${date.toDateString() === new Date().toDateString() ? 'ring-2 ring-blue-500' : ''}`}
                      >
                        <div className="text-xs text-gray-500 mb-1">{date.getDate()}</div>
                        {dayVisitors.map((visitor, idx) => (
                          <div
                            key={visitor.id}
                            className="text-xs p-1 mb-1 bg-blue-100 rounded truncate cursor-pointer hover:bg-blue-200"
                            onClick={() => setSelectedVisitor(visitor)}
                          >
                            {visitor.basicInfo.lastName}
                          </div>
                        ))}
                        {dayVisitors.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayVisitors.length - 2}名
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 見学者詳細モーダル */}
      {selectedVisitor && (
        <Card>
          <CardHeader>
            <CardTitle>
              見学者詳細: {selectedVisitor.basicInfo.lastName} {selectedVisitor.basicInfo.firstName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">基本情報</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">メール:</span>
                    <span>{selectedVisitor.basicInfo.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">電話:</span>
                    <span>{selectedVisitor.basicInfo.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">初回接触日:</span>
                    <span>{selectedVisitor.basicInfo.firstContactDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">接触経路:</span>
                    <span>{selectedVisitor.basicInfo.source}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">見学情報</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">見学日:</span>
                    <span>{selectedVisitor.visitorInfo?.scheduledVisitDate || selectedVisitor.visitorInfo?.actualVisitDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">興味部署:</span>
                    <span>{selectedVisitor.visitorInfo?.interestedDepartments?.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">見学目的:</span>
                    <span>{selectedVisitor.visitorInfo?.visitPurpose}</span>
                  </div>
                </div>
              </div>

              {selectedVisitor.contactHistory.length > 0 && (
                <div className="md:col-span-2">
                  <h4 className="font-semibold mb-3">接触履歴</h4>
                  <div className="space-y-2">
                    {selectedVisitor.contactHistory.map((contact) => (
                      <div key={contact.id} className="border-l-4 border-blue-500 pl-4 py-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">{contact.type}</span>
                            <span className="ml-2 text-sm text-gray-600">{contact.date}</span>
                          </div>
                          <Badge variant={contact.result === 'positive' ? 'default' : 'secondary'}>
                            {contact.result}
                          </Badge>
                        </div>
                        {contact.notes && (
                          <p className="text-sm text-gray-600 mt-1">{contact.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}