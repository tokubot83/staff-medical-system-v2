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
import { Applicant, InterviewSchedule } from '@/types/recruitment'
import {
  User, Mail, Phone, Calendar, FileText, Star, MessageSquare,
  ChevronRight, Search, Filter, UserPlus, Eye, Clock, CheckCircle,
  XCircle, Send, AlertCircle, TrendingUp, ArrowRight, Upload, Briefcase,
  Users, Video, MapPin, Edit, Plus
} from 'lucide-react'

interface ApplicantInterviewManagementProps {
  applicants: Applicant[]
  interviews: InterviewSchedule[]
  onUpdateStatus?: (id: string, status: Applicant['status']) => void
  onCreateApplicant?: (applicant: Partial<Applicant>) => void
  onScheduleInterview?: (applicantId: string) => void
}

export default function ApplicantInterviewManagement({
  applicants,
  interviews,
  onUpdateStatus,
  onCreateApplicant,
  onScheduleInterview
}: ApplicantInterviewManagementProps) {
  const [showNewApplicantForm, setShowNewApplicantForm] = useState(false)
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const [showInterviewDialog, setShowInterviewDialog] = useState(false)
  const [selectedInterview, setSelectedInterview] = useState<InterviewSchedule | null>(null)

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

  // 新規面接スケジュール
  const [newInterview, setNewInterview] = useState({
    applicantName: '',
    interviewType: 'first' as const,
    scheduledDate: '',
    scheduledTime: '',
    duration: 60,
    location: '',
    isOnline: false,
    meetingUrl: '',
    interviewers: [] as string[],
    notes: ''
  })

  // ステータス別に応募者を分類
  const newApplicants = applicants.filter(a => a.status === 'new')
  const screeningApplicants = applicants.filter(a => a.status === 'screening')
  const interviewApplicants = applicants.filter(a =>
    a.status === 'first-interview' || a.status === 'second-interview' || a.status === 'final-interview'
  )
  const offerApplicants = applicants.filter(a => a.status === 'offer')

  // 面接情報を取得
  const getApplicantInterviews = (applicantId: string) => {
    return interviews.filter(i => i.applicantId === applicantId && i.status === 'scheduled')
  }

  // ステータスラベルと色
  const getStatusInfo = (status: Applicant['status']) => {
    const statusMap = {
      'new': { label: '新規', color: 'bg-blue-500' },
      'screening': { label: '書類選考', color: 'bg-yellow-500' },
      'first-interview': { label: '一次面接', color: 'bg-purple-500' },
      'second-interview': { label: '二次面接', color: 'bg-purple-600' },
      'final-interview': { label: '最終面接', color: 'bg-purple-700' },
      'offer': { label: '内定', color: 'bg-green-500' },
      'rejected': { label: '不採用', color: 'bg-red-500' },
      'withdrawn': { label: '辞退', color: 'bg-gray-400' }
    }
    return statusMap[status] || { label: status, color: 'bg-gray-500' }
  }

  // 応募者カード
  const ApplicantCard = ({ applicant }: { applicant: Applicant }) => {
    const statusInfo = getStatusInfo(applicant.status)
    const applicantInterviews = getApplicantInterviews(applicant.id)

    return (
      <div className="bg-white border rounded-lg p-3 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="font-semibold text-sm">
              {applicant.lastName} {applicant.firstName}
            </h4>
            <p className="text-xs text-gray-600 mt-1">
              {applicant.qualifications?.[0] || '応募職種未設定'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedApplicant(applicant)}
          >
            <Eye className="h-3 w-3" />
          </Button>
        </div>

        {/* 面接情報がある場合 */}
        {applicantInterviews.length > 0 && (
          <div className="mb-2 p-2 bg-purple-50 rounded text-xs">
            {applicantInterviews.map(interview => (
              <div key={interview.id} className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-purple-600" />
                <span className="text-purple-700">
                  {new Date(interview.scheduledDate).toLocaleDateString('ja-JP')} {interview.scheduledTime}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center gap-1">
            <Mail className="h-3 w-3" />
            <span className="truncate">{applicant.email}</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="h-3 w-3" />
            {applicant.phone}
          </div>
        </div>

        <div className="mt-3 flex gap-1">
          {applicant.status === 'new' && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs"
                onClick={() => onUpdateStatus?.(applicant.id, 'screening')}
              >
                書類選考へ
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 text-xs"
                onClick={() => onUpdateStatus?.(applicant.id, 'rejected')}
              >
                <XCircle className="h-3 w-3" />
              </Button>
            </>
          )}
          {applicant.status === 'screening' && (
            <>
              <Button
                size="sm"
                className="flex-1 text-xs"
                onClick={() => {
                  onUpdateStatus?.(applicant.id, 'first-interview')
                  setSelectedApplicant(applicant)
                  setShowInterviewDialog(true)
                }}
              >
                面接へ
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 text-xs"
                onClick={() => onUpdateStatus?.(applicant.id, 'rejected')}
              >
                <XCircle className="h-3 w-3" />
              </Button>
            </>
          )}
          {(applicant.status === 'first-interview' || applicant.status === 'second-interview' || applicant.status === 'final-interview') && (
            <>
              <Button
                size="sm"
                className="flex-1 text-xs"
                onClick={() => {
                  const nextStatus =
                    applicant.status === 'first-interview' ? 'second-interview' :
                    applicant.status === 'second-interview' ? 'final-interview' : 'offer'
                  onUpdateStatus?.(applicant.id, nextStatus)
                }}
              >
                {applicant.status === 'final-interview' ? '内定' : '次へ'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() => setShowInterviewDialog(true)}
              >
                <Calendar className="h-3 w-3" />
              </Button>
            </>
          )}
          {applicant.status === 'offer' && (
            <Button
              size="sm"
              className="w-full bg-green-600 hover:bg-green-700 text-xs"
            >
              <Send className="h-3 w-3 mr-1" />
              通知送信
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 4カラムレイアウト */}
      <div className="grid grid-cols-4 gap-6">
        {/* 新規応募 */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-blue-600" />
                新規応募
              </div>
              <Badge className="bg-blue-600 text-white">{newApplicants.length}</Badge>
            </CardTitle>
            <div className="mt-3">
              <Button
                onClick={() => setShowNewApplicantForm(true)}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                新規応募者登録
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
            {newApplicants.length === 0 ? (
              <p className="text-center text-gray-500 py-8 text-sm">新規応募者はいません</p>
            ) : (
              newApplicants.map(applicant => (
                <ApplicantCard key={applicant.id} applicant={applicant} />
              ))
            )}
          </CardContent>
        </Card>

        {/* 書類選考中 */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-b">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-yellow-600" />
                書類選考中
              </div>
              <Badge className="bg-yellow-600 text-white">{screeningApplicants.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-3 max-h-[650px] overflow-y-auto">
            {screeningApplicants.length === 0 ? (
              <p className="text-center text-gray-500 py-8 text-sm">書類選考中の応募者はいません</p>
            ) : (
              screeningApplicants.map(applicant => (
                <ApplicantCard key={applicant.id} applicant={applicant} />
              ))
            )}
          </CardContent>
        </Card>

        {/* 面接中 */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                面接中
              </div>
              <Badge className="bg-purple-600 text-white">{interviewApplicants.length}</Badge>
            </CardTitle>
            <div className="mt-3">
              <Button
                onClick={() => setShowInterviewDialog(true)}
                className="w-full bg-purple-600 hover:bg-purple-700"
                size="sm"
              >
                <Calendar className="h-4 w-4 mr-2" />
                面接スケジュール設定
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
            {interviewApplicants.length === 0 ? (
              <p className="text-center text-gray-500 py-8 text-sm">面接中の応募者はいません</p>
            ) : (
              interviewApplicants.map(applicant => (
                <ApplicantCard key={applicant.id} applicant={applicant} />
              ))
            )}
          </CardContent>
        </Card>

        {/* 内定 */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                内定
              </div>
              <Badge className="bg-green-600 text-white">{offerApplicants.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-3 max-h-[650px] overflow-y-auto">
            {offerApplicants.length === 0 ? (
              <p className="text-center text-gray-500 py-8 text-sm">内定者はいません</p>
            ) : (
              offerApplicants.map(applicant => (
                <ApplicantCard key={applicant.id} applicant={applicant} />
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* 新規応募者登録ダイアログ */}
      {showNewApplicantForm && (
        <Dialog open={showNewApplicantForm} onOpenChange={setShowNewApplicantForm}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                新規応募者登録
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
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
                </div>
              </div>

              {/* 連絡先 */}
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
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* アクションボタン */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  className="flex-1"
                  onClick={() => {
                    console.log('新規応募者登録:', newApplicant)
                    onCreateApplicant?.({
                      ...newApplicant,
                      id: Math.random().toString(),
                      jobPostingId: 'direct-application',
                      desiredSalary: parseInt(newApplicant.desiredSalary) || 0,
                      resume: { fileName: 'direct-application.pdf', uploadedAt: new Date().toISOString() },
                      qualifications: [newApplicant.applyingPosition],
                      experience: [],
                      education: [],
                      applicationDate: new Date().toISOString(),
                      status: 'new',
                      evaluations: [],
                      notes: []
                    })
                    setShowNewApplicantForm(false)
                    setNewApplicant({
                      lastName: '', firstName: '', lastNameKana: '', firstNameKana: '',
                      email: '', phone: '', birthDate: '', gender: '男性',
                      currentEmployment: '', desiredSalary: '', availableStartDate: '',
                      qualifications: '', experience: '', education: '', coverLetter: '',
                      applicationRoute: 'direct', applyingPosition: '', applyingFacility: ''
                    })
                  }}
                  disabled={!newApplicant.lastName || !newApplicant.firstName || !newApplicant.email || !newApplicant.phone || !newApplicant.applyingPosition}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  登録
                </Button>
                <Button variant="outline" onClick={() => setShowNewApplicantForm(false)}>
                  キャンセル
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* 面接スケジュール設定ダイアログ */}
      {showInterviewDialog && (
        <Dialog open={showInterviewDialog} onOpenChange={setShowInterviewDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                面接スケジュール設定
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>面接種別 *</Label>
                  <Select
                    value={newInterview.interviewType}
                    onValueChange={(value: 'first' | 'second' | 'final') =>
                      setNewInterview({...newInterview, interviewType: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first">一次面接</SelectItem>
                      <SelectItem value="second">二次面接</SelectItem>
                      <SelectItem value="final">最終面接</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>形式</Label>
                  <Select
                    value={newInterview.isOnline ? 'online' : 'offline'}
                    onValueChange={(value) =>
                      setNewInterview({...newInterview, isOnline: value === 'online'})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="offline">対面</SelectItem>
                      <SelectItem value="online">オンライン</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>日付 *</Label>
                  <Input
                    type="date"
                    value={newInterview.scheduledDate}
                    onChange={(e) => setNewInterview({...newInterview, scheduledDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label>時刻 *</Label>
                  <Input
                    type="time"
                    value={newInterview.scheduledTime}
                    onChange={(e) => setNewInterview({...newInterview, scheduledTime: e.target.value})}
                  />
                </div>
              </div>

              {newInterview.isOnline ? (
                <div>
                  <Label>会議URL</Label>
                  <Input
                    placeholder="https://meet.example.com/..."
                    value={newInterview.meetingUrl}
                    onChange={(e) => setNewInterview({...newInterview, meetingUrl: e.target.value})}
                  />
                </div>
              ) : (
                <div>
                  <Label>場所 *</Label>
                  <Input
                    placeholder="本社3F 会議室A"
                    value={newInterview.location}
                    onChange={(e) => setNewInterview({...newInterview, location: e.target.value})}
                  />
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button className="flex-1" onClick={() => setShowInterviewDialog(false)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  面接を設定
                </Button>
                <Button variant="outline" onClick={() => setShowInterviewDialog(false)}>
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