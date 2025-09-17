'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Applicant } from '@/types/recruitment'
import {
  User, Mail, Phone, Calendar, FileText, Star, MessageSquare,
  ChevronRight, Search, Filter, UserPlus, Eye, Clock, CheckCircle,
  XCircle, Send, AlertCircle, TrendingUp, ArrowRight, Upload, Briefcase
} from 'lucide-react'

interface ApplicantManagementNewProps {
  applicants: Applicant[]
  onUpdateStatus?: (id: string, status: Applicant['status']) => void
  onAddNote?: (applicantId: string, note: string) => void
  onScheduleInterview?: (applicantId: string) => void
  onCreateApplicant?: (applicant: Partial<Applicant>) => void
}

export default function ApplicantManagementNew({
  applicants,
  onUpdateStatus,
  onAddNote,
  onScheduleInterview,
  onCreateApplicant
}: ApplicantManagementNewProps) {
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const [showQuickAction, setShowQuickAction] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewApplicantForm, setShowNewApplicantForm] = useState(false)

  // 新規応募者フォームデータ
  const [newApplicant, setNewApplicant] = useState({
    lastName: '',
    firstName: '',
    lastNameKana: '',
    firstNameKana: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: '男性' as const,
    currentEmployment: '',
    desiredSalary: '',
    availableStartDate: '',
    qualifications: '',
    experience: '',
    education: '',
    coverLetter: '',
    applicationRoute: 'direct' as const,
    applyingPosition: '',
    applyingFacility: ''
  })

  // ステータス別に応募者を分類
  const newApplicants = applicants.filter(a => a.status === 'new')
  const screeningApplicants = applicants.filter(a => a.status === 'screening')
  const interviewApplicants = applicants.filter(a =>
    a.status === 'first-interview' || a.status === 'second-interview' || a.status === 'final-interview'
  )
  const offerApplicants = applicants.filter(a => a.status === 'offer')

  // クイックアクション
  const handleQuickStatusUpdate = (applicantId: string, newStatus: Applicant['status']) => {
    onUpdateStatus?.(applicantId, newStatus)
    setShowQuickAction(null)
  }

  // ステータスラベルと色
  const getStatusInfo = (status: Applicant['status']) => {
    const statusMap = {
      'new': { label: '新規', color: 'bg-gray-500' },
      'screening': { label: '書類選考', color: 'bg-yellow-500' },
      'first-interview': { label: '一次面接', color: 'bg-blue-500' },
      'second-interview': { label: '二次面接', color: 'bg-indigo-500' },
      'final-interview': { label: '最終面接', color: 'bg-purple-500' },
      'offer': { label: '内定', color: 'bg-green-500' },
      'rejected': { label: '不採用', color: 'bg-red-500' },
      'withdrawn': { label: '辞退', color: 'bg-gray-400' }
    }
    return statusMap[status] || { label: status, color: 'bg-gray-500' }
  }

  const ApplicantCard = ({ applicant, showActions = true }: { applicant: Applicant, showActions?: boolean }) => {
    const statusInfo = getStatusInfo(applicant.status)

    return (
      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-lg">
              {applicant.lastName} {applicant.firstName}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={`${statusInfo.color} text-white`}>
                {statusInfo.label}
              </Badge>
              <span className="text-sm text-gray-500">
                応募日: {new Date(applicant.applicationDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedApplicant(applicant)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3" />
            {applicant.email}
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3" />
            {applicant.phone}
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-3 w-3" />
            希望職種: {applicant.qualifications?.[0] || '未設定'}
          </div>
        </div>

        {showActions && (
          <div className="mt-4 flex gap-2">
            {applicant.status === 'new' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleQuickStatusUpdate(applicant.id, 'screening')}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  書類選考へ
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-red-600"
                  onClick={() => handleQuickStatusUpdate(applicant.id, 'rejected')}
                >
                  <XCircle className="h-3 w-3 mr-1" />
                  不採用
                </Button>
              </>
            )}
            {applicant.status === 'screening' && (
              <>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    handleQuickStatusUpdate(applicant.id, 'first-interview')
                    onScheduleInterview?.(applicant.id)
                  }}
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  面接設定
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => onAddNote?.(applicant.id, '')}
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  メモ
                </Button>
              </>
            )}
            {applicant.status.includes('interview') && (
              <>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => onScheduleInterview?.(applicant.id)}
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  次の面接
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  <Star className="h-3 w-3 mr-1" />
                  評価入力
                </Button>
              </>
            )}
            {applicant.status === 'offer' && (
              <Button
                size="sm"
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Send className="h-3 w-3 mr-1" />
                内定通知送信
              </Button>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ダッシュボード */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-2 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <UserPlus className="h-8 w-8 text-blue-500" />
              <Badge className="bg-blue-100 text-blue-700">今週 +3</Badge>
            </div>
            <div className="text-2xl font-bold">{newApplicants.length}</div>
            <div className="text-sm text-gray-600">新規応募</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <FileText className="h-8 w-8 text-yellow-500" />
              <Badge className="bg-yellow-100 text-yellow-700">処理待ち</Badge>
            </div>
            <div className="text-2xl font-bold">{screeningApplicants.length}</div>
            <div className="text-sm text-gray-600">書類選考中</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-8 w-8 text-purple-500" />
              <Badge className="bg-purple-100 text-purple-700">今週 5件</Badge>
            </div>
            <div className="text-2xl font-bold">{interviewApplicants.length}</div>
            <div className="text-sm text-gray-600">面接中</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <Badge className="bg-green-100 text-green-700">承諾待ち</Badge>
            </div>
            <div className="text-2xl font-bold">{offerApplicants.length}</div>
            <div className="text-sm text-gray-600">内定者</div>
          </CardContent>
        </Card>
      </div>

      {/* 検索・フィルター */}
      <Card>
        <CardContent className="p-4">
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
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              フィルター
            </Button>
            <Button
              onClick={() => setShowNewApplicantForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              新規応募者登録
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              CSVインポート
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ステータス別カンバン */}
      <div className="grid grid-cols-4 gap-4">
        {/* 新規応募 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>新規応募</span>
              <Badge variant="outline">{newApplicants.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {newApplicants.length === 0 ? (
              <p className="text-center text-gray-500 py-4">応募者なし</p>
            ) : (
              newApplicants.map(applicant => (
                <ApplicantCard key={applicant.id} applicant={applicant} />
              ))
            )}
          </CardContent>
        </Card>

        {/* 書類選考 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>書類選考</span>
              <Badge variant="outline">{screeningApplicants.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {screeningApplicants.length === 0 ? (
              <p className="text-center text-gray-500 py-4">該当者なし</p>
            ) : (
              screeningApplicants.map(applicant => (
                <ApplicantCard key={applicant.id} applicant={applicant} />
              ))
            )}
          </CardContent>
        </Card>

        {/* 面接中 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>面接中</span>
              <Badge variant="outline">{interviewApplicants.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {interviewApplicants.length === 0 ? (
              <p className="text-center text-gray-500 py-4">該当者なし</p>
            ) : (
              interviewApplicants.map(applicant => (
                <ApplicantCard key={applicant.id} applicant={applicant} />
              ))
            )}
          </CardContent>
        </Card>

        {/* 内定 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>内定</span>
              <Badge variant="outline">{offerApplicants.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {offerApplicants.length === 0 ? (
              <p className="text-center text-gray-500 py-4">該当者なし</p>
            ) : (
              offerApplicants.map(applicant => (
                <ApplicantCard key={applicant.id} applicant={applicant} />
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* 詳細モーダル */}
      {selectedApplicant && (
        <Dialog open={!!selectedApplicant} onOpenChange={() => setSelectedApplicant(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">
                応募者詳細: {selectedApplicant.lastName} {selectedApplicant.firstName}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* 基本情報 */}
              <div>
                <h3 className="font-semibold mb-3">基本情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>氏名</Label>
                    <p>{selectedApplicant.lastName} {selectedApplicant.firstName}</p>
                  </div>
                  <div>
                    <Label>フリガナ</Label>
                    <p>{selectedApplicant.lastNameKana} {selectedApplicant.firstNameKana}</p>
                  </div>
                  <div>
                    <Label>メール</Label>
                    <p>{selectedApplicant.email}</p>
                  </div>
                  <div>
                    <Label>電話</Label>
                    <p>{selectedApplicant.phone}</p>
                  </div>
                  <div>
                    <Label>生年月日</Label>
                    <p>{new Date(selectedApplicant.birthDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label>性別</Label>
                    <p>{selectedApplicant.gender}</p>
                  </div>
                </div>
              </div>

              {/* 希望条件 */}
              <div>
                <h3 className="font-semibold mb-3">希望条件</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>希望給与</Label>
                    <p>{selectedApplicant.desiredSalary?.toLocaleString()}円</p>
                  </div>
                  <div>
                    <Label>入職可能日</Label>
                    <p>{new Date(selectedApplicant.availableStartDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label>現在の勤務先</Label>
                    <p>{selectedApplicant.currentEmployment}</p>
                  </div>
                  <div>
                    <Label>保有資格</Label>
                    <p>{selectedApplicant.qualifications.join(', ')}</p>
                  </div>
                </div>
              </div>

              {/* アクション */}
              <div className="flex gap-2 pt-4 border-t">
                <Select
                  value={selectedApplicant.status}
                  onValueChange={(value) => {
                    onUpdateStatus?.(selectedApplicant.id, value as Applicant['status'])
                    setSelectedApplicant(null)
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">新規</SelectItem>
                    <SelectItem value="screening">書類選考</SelectItem>
                    <SelectItem value="first-interview">一次面接</SelectItem>
                    <SelectItem value="second-interview">二次面接</SelectItem>
                    <SelectItem value="final-interview">最終面接</SelectItem>
                    <SelectItem value="offer">内定</SelectItem>
                    <SelectItem value="rejected">不採用</SelectItem>
                    <SelectItem value="withdrawn">辞退</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => onScheduleInterview?.(selectedApplicant.id)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  面接設定
                </Button>
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  メモ追加
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* 新規応募者登録ダイアログ */}
      {showNewApplicantForm && (
        <Dialog open={showNewApplicantForm} onOpenChange={setShowNewApplicantForm}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                新規応募者登録（直接応募）
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* 応募経路 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <Label className="text-blue-900 font-semibold mb-2 block">応募経路</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={newApplicant.applicationRoute === 'direct' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNewApplicant({...newApplicant, applicationRoute: 'direct'})}
                  >
                    直接応募
                  </Button>
                  <Button
                    variant={newApplicant.applicationRoute === 'website' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNewApplicant({...newApplicant, applicationRoute: 'website' as any})}
                  >
                    求人サイト
                  </Button>
                  <Button
                    variant={newApplicant.applicationRoute === 'referral' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNewApplicant({...newApplicant, applicationRoute: 'referral' as any})}
                  >
                    紹介・推薦
                  </Button>
                </div>
              </div>

              {/* 基本情報 */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  基本情報
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>姓 *</Label>
                    <Input
                      value={newApplicant.lastName}
                      onChange={(e) => setNewApplicant({...newApplicant, lastName: e.target.value})}
                      placeholder="山田"
                    />
                  </div>
                  <div>
                    <Label>名 *</Label>
                    <Input
                      value={newApplicant.firstName}
                      onChange={(e) => setNewApplicant({...newApplicant, firstName: e.target.value})}
                      placeholder="太郎"
                    />
                  </div>
                  <div>
                    <Label>姓（カナ）</Label>
                    <Input
                      value={newApplicant.lastNameKana}
                      onChange={(e) => setNewApplicant({...newApplicant, lastNameKana: e.target.value})}
                      placeholder="ヤマダ"
                    />
                  </div>
                  <div>
                    <Label>名（カナ）</Label>
                    <Input
                      value={newApplicant.firstNameKana}
                      onChange={(e) => setNewApplicant({...newApplicant, firstNameKana: e.target.value})}
                      placeholder="タロウ"
                    />
                  </div>
                </div>
              </div>

              {/* 連絡先 */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  連絡先
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>メールアドレス *</Label>
                    <Input
                      type="email"
                      value={newApplicant.email}
                      onChange={(e) => setNewApplicant({...newApplicant, email: e.target.value})}
                      placeholder="yamada@example.com"
                    />
                  </div>
                  <div>
                    <Label>電話番号 *</Label>
                    <Input
                      value={newApplicant.phone}
                      onChange={(e) => setNewApplicant({...newApplicant, phone: e.target.value})}
                      placeholder="090-1234-5678"
                    />
                  </div>
                </div>
              </div>

              {/* 個人情報 */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>生年月日</Label>
                  <Input
                    type="date"
                    value={newApplicant.birthDate}
                    onChange={(e) => setNewApplicant({...newApplicant, birthDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label>性別</Label>
                  <Select
                    value={newApplicant.gender}
                    onValueChange={(value: '男性' | '女性' | 'その他') =>
                      setNewApplicant({...newApplicant, gender: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="男性">男性</SelectItem>
                      <SelectItem value="女性">女性</SelectItem>
                      <SelectItem value="その他">その他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>現在の勤務先</Label>
                  <Input
                    value={newApplicant.currentEmployment}
                    onChange={(e) => setNewApplicant({...newApplicant, currentEmployment: e.target.value})}
                    placeholder="現職または前職"
                  />
                </div>
              </div>

              {/* 希望条件 */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  希望条件
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>希望職種 *</Label>
                    <Input
                      value={newApplicant.applyingPosition}
                      onChange={(e) => setNewApplicant({...newApplicant, applyingPosition: e.target.value})}
                      placeholder="看護師、理学療法士など"
                    />
                  </div>
                  <div>
                    <Label>希望施設</Label>
                    <Select
                      value={newApplicant.applyingFacility}
                      onValueChange={(value) => setNewApplicant({...newApplicant, applyingFacility: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="小原病院">小原病院</SelectItem>
                        <SelectItem value="立神リハビリテーション温泉病院">立神リハビリテーション温泉病院</SelectItem>
                        <SelectItem value="エスポワール立神">エスポワール立神</SelectItem>
                        <SelectItem value="宝寿庵">宝寿庵</SelectItem>
                        <SelectItem value="未定">未定</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>希望年収（万円）</Label>
                    <Input
                      type="number"
                      value={newApplicant.desiredSalary}
                      onChange={(e) => setNewApplicant({...newApplicant, desiredSalary: e.target.value})}
                      placeholder="400"
                    />
                  </div>
                  <div>
                    <Label>入職可能日</Label>
                    <Input
                      type="date"
                      value={newApplicant.availableStartDate}
                      onChange={(e) => setNewApplicant({...newApplicant, availableStartDate: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* 資格・経験 */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  資格・経験・学歴
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label>保有資格</Label>
                    <Textarea
                      value={newApplicant.qualifications}
                      onChange={(e) => setNewApplicant({...newApplicant, qualifications: e.target.value})}
                      placeholder="正看護師、認定看護師など（複数ある場合は改行で区切ってください）"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>職歴・経験</Label>
                    <Textarea
                      value={newApplicant.experience}
                      onChange={(e) => setNewApplicant({...newApplicant, experience: e.target.value})}
                      placeholder="〇〇病院 看護師 5年&#10;△△クリニック 主任看護師 3年"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>学歴</Label>
                    <Textarea
                      value={newApplicant.education}
                      onChange={(e) => setNewApplicant({...newApplicant, education: e.target.value})}
                      placeholder="〇〇看護専門学校 卒業"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* 志望動機 */}
              <div>
                <Label>志望動機・自己PR</Label>
                <Textarea
                  value={newApplicant.coverLetter}
                  onChange={(e) => setNewApplicant({...newApplicant, coverLetter: e.target.value})}
                  placeholder="志望動機や自己PRを入力してください"
                  rows={4}
                />
              </div>

              {/* アクションボタン */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  className="flex-1"
                  onClick={() => {
                    // ここで応募者を作成
                    console.log('新規応募者登録:', newApplicant)
                    onCreateApplicant?.({
                      ...newApplicant,
                      id: Math.random().toString(),
                      jobPostingId: 'direct-application',
                      desiredSalary: parseInt(newApplicant.desiredSalary) || 0,
                      resume: { fileName: 'direct-application.pdf', uploadedAt: new Date().toISOString() },
                      qualifications: newApplicant.qualifications.split('\n').filter(q => q),
                      experience: [{
                        company: newApplicant.currentEmployment || '未記入',
                        position: newApplicant.applyingPosition || '未記入',
                        duration: '未記入',
                        description: newApplicant.experience
                      }],
                      education: [{
                        school: '未記入',
                        degree: '未記入',
                        graduationYear: '未記入'
                      }],
                      applicationDate: new Date().toISOString(),
                      status: 'new',
                      evaluations: [],
                      notes: []
                    })
                    setShowNewApplicantForm(false)
                    // フォームをリセット
                    setNewApplicant({
                      lastName: '',
                      firstName: '',
                      lastNameKana: '',
                      firstNameKana: '',
                      email: '',
                      phone: '',
                      birthDate: '',
                      gender: '男性',
                      currentEmployment: '',
                      desiredSalary: '',
                      availableStartDate: '',
                      qualifications: '',
                      experience: '',
                      education: '',
                      coverLetter: '',
                      applicationRoute: 'direct',
                      applyingPosition: '',
                      applyingFacility: ''
                    })
                  }}
                  disabled={!newApplicant.lastName || !newApplicant.firstName || !newApplicant.email || !newApplicant.phone || !newApplicant.applyingPosition}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  応募者を登録
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowNewApplicantForm(false)}
                >
                  キャンセル
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}