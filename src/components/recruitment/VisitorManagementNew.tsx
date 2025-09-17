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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { TalentProfile, VisitReservation } from '@/types/talentPipeline'
import {
  Calendar, User, MapPin, Clock, Users, AlertCircle, CheckCircle,
  Mail, Phone, Building, UserPlus, TrendingUp, Eye, Edit, MessageSquare,
  Plus, FileText, Send, CheckCircle2, XCircle, ArrowRight
} from 'lucide-react'

interface VisitorManagementNewProps {
  visitors: TalentProfile[]
  reservations: VisitReservation[]
  onCreateReservation?: (reservation: Partial<VisitReservation>) => void
  onUpdateVisitor?: (id: string, updates: Partial<TalentProfile>) => void
  onConvertToApplicant?: (visitorId: string) => void
  onCheckDuplicate?: (email: string, phone: string) => Promise<boolean>
}

export default function VisitorManagementNew({
  visitors = [],
  reservations = [],
  onCreateReservation,
  onUpdateVisitor,
  onConvertToApplicant,
  onCheckDuplicate
}: VisitorManagementNewProps) {
  const [showNewVisitorForm, setShowNewVisitorForm] = useState(false)
  const [selectedVisitor, setSelectedVisitor] = useState<TalentProfile | null>(null)
  const [activeView, setActiveView] = useState<'today' | 'upcoming' | 'completed'>('today')
  const [displayPeriod, setDisplayPeriod] = useState<'3m' | '6m' | '1y' | 'all'>('6m')
  const [showConversionDialog, setShowConversionDialog] = useState<string | null>(null)
  const [conversionReason, setConversionReason] = useState('')

  // 新規見学者フォーム
  const [newVisitor, setNewVisitor] = useState({
    lastName: '',
    firstName: '',
    lastNameKana: '',
    firstNameKana: '',
    email: '',
    phone: '',
    visitDate: '',
    visitTime: '',
    facility: '',
    interestedDepartments: [] as string[],
    visitPurpose: '',
    memo: ''
  })

  // 今日の見学予定
  const today = new Date().toISOString().split('T')[0]
  const todayVisitors = visitors.filter(v =>
    v.visitorInfo?.scheduledVisitDate === today
  )

  // 今後の見学予定（今日以降）
  const upcomingVisitors = visitors.filter(v => {
    const visitDate = v.visitorInfo?.scheduledVisitDate
    return visitDate && visitDate > today && v.currentStatus === 'visitor-scheduled'
  })

  // 見学済み（表示期間でフィルタリング & 最新順ソート）
  const getFilteredCompletedVisitors = () => {
    const completed = visitors.filter(v => v.currentStatus === 'visitor-completed')

    // 表示期間でフィルタリング
    const now = new Date()
    const filtered = completed.filter(v => {
      if (displayPeriod === 'all') return true
      const visitDate = new Date(v.visitorInfo?.actualVisitDate || v.visitorInfo?.scheduledVisitDate || '')
      const monthsAgo = displayPeriod === '3m' ? 3 : displayPeriod === '6m' ? 6 : 12
      const cutoffDate = new Date()
      cutoffDate.setMonth(cutoffDate.getMonth() - monthsAgo)
      return visitDate >= cutoffDate
    })

    // 最新順でソート
    return filtered.sort((a, b) => {
      const dateA = new Date(a.visitorInfo?.actualVisitDate || a.visitorInfo?.scheduledVisitDate || '')
      const dateB = new Date(b.visitorInfo?.actualVisitDate || b.visitorInfo?.scheduledVisitDate || '')
      return dateB.getTime() - dateA.getTime()
    })
  }

  const completedVisitors = getFilteredCompletedVisitors()
  const totalCompletedCount = visitors.filter(v => v.currentStatus === 'visitor-completed').length

  const handleNewVisitorSubmit = () => {
    // 新規見学者登録処理
    console.log('新規見学者登録:', newVisitor)
    setShowNewVisitorForm(false)
    // リセット
    setNewVisitor({
      lastName: '',
      firstName: '',
      lastNameKana: '',
      firstNameKana: '',
      email: '',
      phone: '',
      visitDate: '',
      visitTime: '',
      facility: '',
      interestedDepartments: [],
      visitPurpose: '',
      memo: ''
    })
  }

  const departments = [
    '看護部', '医事課', 'リハビリテーション科', '薬剤部',
    '栄養課', '総務課', '介護部', '地域連携室'
  ]

  const facilities = [
    '小原病院',
    '立神リハビリテーション温泉病院',
    'エスポワール立神',
    '宝寿庵'
  ]

  return (
    <div className="space-y-6">
            <Dialog open={showNewVisitorForm} onOpenChange={setShowNewVisitorForm}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>新規見学者登録</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  {/* 基本情報 */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">基本情報</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="lastName">姓 *</Label>
                        <Input
                          id="lastName"
                          value={newVisitor.lastName}
                          onChange={(e) => setNewVisitor({...newVisitor, lastName: e.target.value})}
                          placeholder="山田"
                        />
                      </div>
                      <div>
                        <Label htmlFor="firstName">名 *</Label>
                        <Input
                          id="firstName"
                          value={newVisitor.firstName}
                          onChange={(e) => setNewVisitor({...newVisitor, firstName: e.target.value})}
                          placeholder="太郎"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastNameKana">姓（カナ）</Label>
                        <Input
                          id="lastNameKana"
                          value={newVisitor.lastNameKana}
                          onChange={(e) => setNewVisitor({...newVisitor, lastNameKana: e.target.value})}
                          placeholder="ヤマダ"
                        />
                      </div>
                      <div>
                        <Label htmlFor="firstNameKana">名（カナ）</Label>
                        <Input
                          id="firstNameKana"
                          value={newVisitor.firstNameKana}
                          onChange={(e) => setNewVisitor({...newVisitor, firstNameKana: e.target.value})}
                          placeholder="タロウ"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 連絡先 */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">連絡先</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">メールアドレス *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newVisitor.email}
                          onChange={(e) => setNewVisitor({...newVisitor, email: e.target.value})}
                          placeholder="yamada@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">電話番号 *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={newVisitor.phone}
                          onChange={(e) => setNewVisitor({...newVisitor, phone: e.target.value})}
                          placeholder="090-1234-5678"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 見学情報 */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">見学情報</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="visitDate">見学希望日 *</Label>
                        <Input
                          id="visitDate"
                          type="date"
                          value={newVisitor.visitDate}
                          onChange={(e) => setNewVisitor({...newVisitor, visitDate: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="visitTime">見学希望時間 *</Label>
                        <Select
                          value={newVisitor.visitTime}
                          onValueChange={(value) => setNewVisitor({...newVisitor, visitTime: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="時間を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="09:00">09:00</SelectItem>
                            <SelectItem value="10:00">10:00</SelectItem>
                            <SelectItem value="11:00">11:00</SelectItem>
                            <SelectItem value="13:00">13:00</SelectItem>
                            <SelectItem value="14:00">14:00</SelectItem>
                            <SelectItem value="15:00">15:00</SelectItem>
                            <SelectItem value="16:00">16:00</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="facility">見学希望施設 *</Label>
                        <Select
                          value={newVisitor.facility}
                          onValueChange={(value) => setNewVisitor({...newVisitor, facility: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="施設を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            {facilities.map(facility => (
                              <SelectItem key={facility} value={facility}>
                                {facility}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>興味のある部署（複数選択可）</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {departments.map(dept => (
                          <label key={dept} className="flex items-center space-x-2">
                            <Checkbox
                              checked={newVisitor.interestedDepartments.includes(dept)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setNewVisitor({
                                    ...newVisitor,
                                    interestedDepartments: [...newVisitor.interestedDepartments, dept]
                                  })
                                } else {
                                  setNewVisitor({
                                    ...newVisitor,
                                    interestedDepartments: newVisitor.interestedDepartments.filter(d => d !== dept)
                                  })
                                }
                              }}
                            />
                            <span className="text-sm">{dept}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="visitPurpose">見学目的</Label>
                      <Select
                        value={newVisitor.visitPurpose}
                        onValueChange={(value) => setNewVisitor({...newVisitor, visitPurpose: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="目的を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="就職・転職検討">就職・転職検討</SelectItem>
                          <SelectItem value="情報収集">情報収集</SelectItem>
                          <SelectItem value="施設見学のみ">施設見学のみ</SelectItem>
                          <SelectItem value="インターンシップ">インターンシップ</SelectItem>
                          <SelectItem value="その他">その他</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="memo">メモ・特記事項</Label>
                      <Textarea
                        id="memo"
                        value={newVisitor.memo}
                        onChange={(e) => setNewVisitor({...newVisitor, memo: e.target.value})}
                        placeholder="連絡事項、配慮事項などがあれば記入"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setShowNewVisitorForm(false)}>
                      キャンセル
                    </Button>
                    <Button onClick={handleNewVisitorSubmit}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      登録する
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
      {/* メインコンテンツ */}
      <div className="grid grid-cols-3 gap-6">
        {/* 今日の見学 */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                本日の見学
              </div>
              <Badge className="bg-blue-600 text-white">{todayVisitors.length}</Badge>
            </CardTitle>
            <div className="mt-3">
              <Button
                onClick={() => setShowNewVisitorForm(true)}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                新規見学者登録
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {todayVisitors.length === 0 ? (
              <p className="text-gray-500 text-center py-4">本日の見学予定はありません</p>
            ) : (
              <div className="space-y-3">
                {todayVisitors.map(visitor => (
                  <div
                    key={visitor.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedVisitor(visitor)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">
                        {visitor.basicInfo.lastName} {visitor.basicInfo.firstName}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {visitor.visitorInfo?.scheduledVisitDate}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {visitor.visitorInfo?.interestedDepartments?.join(', ')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {visitor.basicInfo.phone}
                      </div>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        受付
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        編集
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 今後の見学予定 */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                今後の予定
              </div>
              <Badge className="bg-green-600 text-white">{upcomingVisitors.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingVisitors.length === 0 ? (
              <p className="text-gray-500 text-center py-4">今後の見学予定はありません</p>
            ) : (
              <div className="space-y-3">
                {upcomingVisitors.slice(0, 5).map(visitor => (
                  <div
                    key={visitor.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedVisitor(visitor)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-sm">
                        {visitor.basicInfo.lastName} {visitor.basicInfo.firstName}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {visitor.visitorInfo?.scheduledVisitDate}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600">
                      {visitor.visitorInfo?.interestedDepartments?.join(', ')}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" variant="outline" className="text-xs py-1">
                        <Send className="h-3 w-3 mr-1" />
                        リマインド送信
                      </Button>
                    </div>
                  </div>
                ))}
                {upcomingVisitors.length > 5 && (
                  <Button variant="outline" className="w-full" size="sm">
                    すべて表示 ({upcomingVisitors.length}件)
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 見学済み・フォロー */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-gray-600" />
                見学済み
              </div>
              <div className="flex items-center gap-2">
                <Select value={displayPeriod} onValueChange={(value: '3m' | '6m' | '1y' | 'all') => setDisplayPeriod(value)}>
                  <SelectTrigger className="w-28 h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3m">3ヶ月</SelectItem>
                    <SelectItem value="6m">6ヶ月</SelectItem>
                    <SelectItem value="1y">1年</SelectItem>
                    <SelectItem value="all">すべて</SelectItem>
                  </SelectContent>
                </Select>
                <Badge className="bg-gray-600 text-white">
                  {completedVisitors.length}
                  {totalCompletedCount > completedVisitors.length && ` / ${totalCompletedCount}`}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {completedVisitors.length === 0 ? (
              <p className="text-gray-500 text-center py-4">見学済みの方はいません</p>
            ) : (
              <div className="space-y-3">
                {completedVisitors.slice(0, 10).map(visitor => {
                  const interestLevel = visitor.visitorInfo?.visitFeedback?.interestLevel
                  return (
                    <div
                      key={visitor.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedVisitor(visitor)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-sm">
                          {visitor.basicInfo.lastName} {visitor.basicInfo.firstName}
                        </div>
                        <Badge
                          variant={interestLevel === 'high' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          興味度: {interestLevel === 'high' ? '高' : interestLevel === 'medium' ? '中' : '低'}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        見学日: {visitor.visitorInfo?.actualVisitDate}
                        {visitor.visitorInfo?.actualVisitDate && (
                          <span className="ml-2 text-gray-400">
                            ({Math.floor((new Date().getTime() - new Date(visitor.visitorInfo.actualVisitDate).getTime()) / (1000 * 60 * 60 * 24))}日前)
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={interestLevel === 'high' ? 'default' : 'outline'}
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowConversionDialog(visitor.id)
                          }}
                        >
                          <ArrowRight className="h-3 w-3 mr-1" />
                          応募へ移行
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          フォロー
                        </Button>
                      </div>
                      {interestLevel === 'high' && (
                        <div className="mt-1 text-xs text-green-600 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          移行推奨
                        </div>
                      )}
                    </div>
                  )
                })}
                {completedVisitors.length > 10 && (
                  <Button variant="outline" className="w-full mt-2" size="sm">
                    さらに表示（残り{completedVisitors.length - 10}件）
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 応募者への移行確認ダイアログ */}
      {showConversionDialog && (
        <Dialog open={!!showConversionDialog} onOpenChange={() => {
          setShowConversionDialog(null)
          setConversionReason('')
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>応募者への移行確認</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {(() => {
                const visitor = visitors.find(v => v.id === showConversionDialog)
                const interestLevel = visitor?.visitorInfo?.visitFeedback?.interestLevel
                return (
                  <>
                    {interestLevel === 'low' && (
                      <Alert className="border-yellow-200 bg-yellow-50">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <AlertDescription>
                          この見学者の興味度は「低」と評価されています。
                          移行理由をメモに記録することを推奨します。
                        </AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <div className="text-sm font-medium">
                        {visitor?.basicInfo.lastName} {visitor?.basicInfo.firstName}さんを応募者として登録します。
                      </div>
                      <div className="text-xs text-gray-600">
                        見学日: {visitor?.visitorInfo?.actualVisitDate}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="reason">移行理由・メモ（任意）</Label>
                      <Textarea
                        id="reason"
                        value={conversionReason}
                        onChange={(e) => setConversionReason(e.target.value)}
                        placeholder="例：後日連絡があり応募意思を示した、人事部からの推薦など"
                        rows={3}
                      />
                    </div>
                  </>
                )
              })()}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setShowConversionDialog(null)
                  setConversionReason('')
                }}>
                  キャンセル
                </Button>
                <Button onClick={() => {
                  onConvertToApplicant?.(showConversionDialog)
                  setShowConversionDialog(null)
                  setConversionReason('')
                }}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  移行する
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* 詳細表示モーダル */}
      {selectedVisitor && (
        <Dialog open={!!selectedVisitor} onOpenChange={() => setSelectedVisitor(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                見学者詳細: {selectedVisitor.basicInfo.lastName} {selectedVisitor.basicInfo.firstName}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>メールアドレス</Label>
                  <p className="text-sm">{selectedVisitor.basicInfo.email}</p>
                </div>
                <div>
                  <Label>電話番号</Label>
                  <p className="text-sm">{selectedVisitor.basicInfo.phone}</p>
                </div>
                <div>
                  <Label>見学日</Label>
                  <p className="text-sm">
                    {selectedVisitor.visitorInfo?.scheduledVisitDate || selectedVisitor.visitorInfo?.actualVisitDate}
                  </p>
                </div>
                <div>
                  <Label>興味のある部署</Label>
                  <p className="text-sm">{selectedVisitor.visitorInfo?.interestedDepartments?.join(', ')}</p>
                </div>
              </div>

              {selectedVisitor.currentStatus === 'visitor-completed' && (
                <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                  <Label>見学後の評価</Label>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>興味度: {selectedVisitor.visitorInfo?.visitFeedback?.interestLevel}</div>
                    <div>満足度: {selectedVisitor.visitorInfo?.visitFeedback?.satisfaction}/5</div>
                  </div>
                  {selectedVisitor.visitorInfo?.visitFeedback?.notes && (
                    <div>
                      <Label>メモ</Label>
                      <p className="text-sm">{selectedVisitor.visitorInfo.visitFeedback.notes}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2">
                {selectedVisitor.currentStatus === 'visitor-scheduled' && (
                  <>
                    <Button variant="outline">
                      <XCircle className="h-4 w-4 mr-2" />
                      キャンセル
                    </Button>
                    <Button>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      見学完了
                    </Button>
                  </>
                )}
                {selectedVisitor.currentStatus === 'visitor-completed' && (
                  <Button onClick={() => onConvertToApplicant?.(selectedVisitor.id)}>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    応募者として登録
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}