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
import { Alert } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Applicant } from '@/types/recruitment'
import {
  User, Mail, Phone, Calendar, FileText, Star, MessageSquare,
  ChevronRight, Search, Filter, UserPlus, Eye, Clock, CheckCircle,
  XCircle, Send, AlertCircle, TrendingUp, ArrowRight, Upload, Briefcase,
  Plus
} from 'lucide-react'

interface ApplicantManagementNewProps {
  applicants?: Applicant[]
  onUpdateStatus?: (id: string, status: Applicant['status']) => void
  onAddNote?: (applicantId: string, note: string) => void
  onScheduleInterview?: (applicantId: string) => void
  onCreateApplicant?: (applicant: Partial<Applicant>) => void
}

export default function ApplicantManagementNew({
  applicants = [],
  onUpdateStatus,
  onAddNote,
  onScheduleInterview,
  onCreateApplicant
}: ApplicantManagementNewProps) {
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const [showQuickAction, setShowQuickAction] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewApplicantForm, setShowNewApplicantForm] = useState(false)
  const [showDirectInterviewForm, setShowDirectInterviewForm] = useState(false)
  const [directInterviewStep, setDirectInterviewStep] = useState(1)

  // デモデータ
  const demoApplicants: Applicant[] = [
    // 新規応募（見学歴あり）
    {
      id: 'demo1',
      jobPostingId: 'j1',
      firstName: '太郎',
      lastName: '田中',
      firstNameKana: 'タロウ',
      lastNameKana: 'タナカ',
      email: 'tanaka@example.com',
      phone: '090-1234-5678',
      birthDate: '1985-03-15',
      gender: '男性',
      currentEmployment: '無職',
      desiredSalary: 400,
      desiredPosition: '看護師',
      availableStartDate: '2024-03-01',
      applicationDate: '2024-01-28',
      status: 'new',
      visitorHistory: {
        visitDate: '2024-01-20',
        visitFeedback: {
          satisfaction: 4,
          interestLevel: 'high',
          notes: '施設の雰囲気が良かった'
        },
        conversionDate: '2024-01-28',
        conversionReason: '見学後に応募意思を示した'
      },
      qualifications: ['正看護師'],
      experience: [],
      education: [],
      evaluations: [],
      notes: []
    },
    // 新規応募（直接応募）
    {
      id: 'demo2',
      jobPostingId: 'j2',
      firstName: '花子',
      lastName: '鈴木',
      firstNameKana: 'ハナコ',
      lastNameKana: 'スズキ',
      email: 'suzuki@example.com',
      phone: '090-2345-6789',
      birthDate: '1990-08-20',
      gender: '女性',
      currentEmployment: '他院勤務中',
      desiredSalary: 350,
      desiredPosition: '理学療法士',
      availableStartDate: '2024-04-01',
      applicationDate: '2024-01-27',
      status: 'new',
      qualifications: ['理学療法士'],
      experience: [],
      education: [],
      evaluations: [],
      notes: []
    },
    // 書類選考中
    {
      id: 'demo3',
      jobPostingId: 'j3',
      firstName: '健一',
      lastName: '山田',
      firstNameKana: 'ケンイチ',
      lastNameKana: 'ヤマダ',
      email: 'yamada@example.com',
      phone: '090-3456-7890',
      birthDate: '1988-12-10',
      gender: '男性',
      currentEmployment: '無職',
      desiredSalary: 300,
      desiredPosition: '介護職員',
      availableStartDate: '2024-02-15',
      applicationDate: '2024-01-25',
      status: 'screening',
      resume: { fileName: 'yamada_resume.pdf', uploadedAt: '2024-01-26' },
      qualifications: ['介護福祉士'],
      experience: [{
        company: 'X介護施設',
        position: '介護職員',
        duration: '3年',
        description: '特養での介護業務'
      }],
      education: [],
      evaluations: [],
      notes: []
    },
    // 面接中（通常）
    {
      id: 'demo4',
      jobPostingId: 'j1',
      firstName: '美智子',
      lastName: '佐藤',
      firstNameKana: 'ミチコ',
      lastNameKana: 'サトウ',
      email: 'sato@example.com',
      phone: '090-4567-8901',
      birthDate: '1987-05-25',
      gender: '女性',
      currentEmployment: '他院勤務中',
      desiredSalary: 450,
      desiredPosition: '看護師',
      availableStartDate: '2024-03-15',
      applicationDate: '2024-01-20',
      status: 'first-interview',
      interviewDate: '2024-02-05',
      resume: { fileName: 'sato_resume.pdf', uploadedAt: '2024-01-21' },
      qualifications: ['正看護師', '認定看護師'],
      experience: [{
        company: 'Y病院',
        position: '看護師',
        duration: '5年',
        description: '内科病棟勤務'
      }],
      education: [],
      evaluations: [],
      notes: []
    },
    // 面接中（不採用）
    {
      id: 'demo5',
      jobPostingId: 'j2',
      firstName: '次郎',
      lastName: '高橋',
      firstNameKana: 'ジロウ',
      lastNameKana: 'タカハシ',
      email: 'takahashi@example.com',
      phone: '090-5678-9012',
      birthDate: '1992-09-30',
      gender: '男性',
      currentEmployment: '無職',
      desiredSalary: 320,
      desiredPosition: '理学療法士',
      availableStartDate: '2024-02-01',
      applicationDate: '2024-01-15',
      status: 'first-interview',
      interviewDate: '2024-01-25',
      interviewResult: 'rejected',
      rejectedAt: '2024-01-26',
      resume: { fileName: 'takahashi_resume.pdf', uploadedAt: '2024-01-16' },
      qualifications: ['理学療法士'],
      experience: [],
      education: [],
      evaluations: [],
      notes: ['経験不足のため不採用']
    },
    // 内定
    {
      id: 'demo6',
      jobPostingId: 'j3',
      firstName: '優子',
      lastName: '渡辺',
      firstNameKana: 'ユウコ',
      lastNameKana: 'ワタナベ',
      email: 'watanabe@example.com',
      phone: '090-6789-0123',
      birthDate: '1989-11-15',
      gender: '女性',
      currentEmployment: '他施設勤務中',
      desiredSalary: 380,
      desiredPosition: '介護職員',
      availableStartDate: '2024-03-01',
      applicationDate: '2024-01-10',
      status: 'offer',
      resume: { fileName: 'watanabe_resume.pdf', uploadedAt: '2024-01-11' },
      qualifications: ['介護福祉士', 'ケアマネージャー'],
      experience: [{
        company: 'Z介護施設',
        position: '介護主任',
        duration: '7年',
        description: '介護業務およびスタッフ管理'
      }],
      education: [],
      evaluations: [{
        evaluatorId: 'hr1',
        evaluatorName: '人事部長',
        date: '2024-01-25',
        rating: 5,
        comments: '即戦力として期待'
      }],
      notes: []
    }
  ]

  // 実際のデータとデモデータを統合
  const allApplicants = [...demoApplicants, ...applicants]

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

  // 直接面接フォームデータ
  const [directInterviewData, setDirectInterviewData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    position: '',
    resumeOption: 'now' as 'now' | 'later',
    interviewDate: '',
    interviewTime: ''
  })

  // ステータス別に応募者を分類（最新順でソート）
  const newApplicants = allApplicants
    .filter(a => a.status === 'new')
    .sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime())

  const screeningApplicants = allApplicants
    .filter(a => a.status === 'screening')
    .sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime())

  const interviewApplicants = allApplicants
    .filter(a => a.status === 'first-interview' || a.status === 'second-interview' || a.status === 'final-interview')
    .sort((a, b) => {
      // 不採用者を下に、それ以外は日付順
      if (a.interviewResult === 'rejected' && b.interviewResult !== 'rejected') return 1
      if (a.interviewResult !== 'rejected' && b.interviewResult === 'rejected') return -1
      return new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime()
    })

  const offerApplicants = allApplicants
    .filter(a => a.status === 'offer')
    .sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime())

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
    const daysAgo = applicant.applicationDate ?
      Math.floor((new Date().getTime() - new Date(applicant.applicationDate).getTime()) / (1000 * 60 * 60 * 24)) : 0

    return (
      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-lg">
              {applicant.lastName} {applicant.firstName}
            </h4>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge className={`${statusInfo.color} text-white text-xs`}>
                {statusInfo.label}
              </Badge>
              {applicant.status === 'new' && (
                applicant.visitorHistory ? (
                  <Badge variant="outline" className="bg-blue-50 text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    見学歴あり
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-50 text-xs">
                    <UserPlus className="h-3 w-3 mr-1" />
                    新規応募
                  </Badge>
                )
              )}
              {applicant.interviewResult === 'rejected' && (
                <Badge variant="destructive" className="text-xs">
                  <XCircle className="h-3 w-3 mr-1" />
                  不採用
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Briefcase className="h-4 w-4" />
            {applicant.desiredPosition || '未設定'}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            応募日: {applicant.applicationDate}
            <span className="text-gray-400 text-xs">({daysAgo}日前)</span>
          </div>
          {applicant.interviewDate && (
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              面接日: {applicant.interviewDate}
            </div>
          )}
        </div>

        {showActions && (
          <div className="mt-4 space-y-2">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedApplicant(applicant)}
                className="flex-1"
              >
                <Eye className="h-3 w-3 mr-1" />
                詳細
              </Button>
              {applicant.status === 'new' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  履歴書登録
                </Button>
              )}
              {applicant.status === 'screening' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  面接日登録
                </Button>
              )}
            </div>
            {(applicant.status === 'first-interview' || applicant.status === 'second-interview' || applicant.status === 'final-interview') &&
             !applicant.interviewResult && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="default"
                  className="flex-1"
                  onClick={() => handleQuickStatusUpdate(applicant.id, 'offer')}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  内定
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    // 不採用処理（実際の実装では適切な処理を行う）
                    console.log('不採用処理', applicant.id)
                  }}
                >
                  <XCircle className="h-3 w-3 mr-1" />
                  不採用
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ステータス別カンバン */}
      <div className="grid grid-cols-4 gap-4">
        {/* 新規応募 */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-blue-600" />
                新規応募
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-600 text-white">{newApplicants.length}</Badge>
                <Button size="sm" onClick={() => setShowNewApplicantForm(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-3 w-3 mr-1" />
                  追加
                </Button>
              </div>
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
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-b">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-yellow-600" />
                書類選考
              </div>
              <Badge className="bg-yellow-600 text-white">{screeningApplicants.length}</Badge>
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

        {/* 面接 */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                面接
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-600 text-white">{interviewApplicants.length}</Badge>
                <Button size="sm" onClick={() => setShowDirectInterviewForm(true)} className="bg-purple-600 hover:bg-purple-700">
                  <UserPlus className="h-3 w-3 mr-1" />
                  面接から開始
                </Button>
              </div>
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
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                内定
              </div>
              <Badge className="bg-green-600 text-white">{offerApplicants.length}</Badge>
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

      {/* 面接から開始ダイアログ */}
      {showDirectInterviewForm && (
        <Dialog open={showDirectInterviewForm} onOpenChange={setShowDirectInterviewForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>面接から開始する応募者登録</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {directInterviewStep === 1 && (
                <>
                  <h3 className="font-semibold">ステップ1: 基本情報</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>姓</Label>
                      <Input
                        value={directInterviewData.lastName}
                        onChange={(e) => setDirectInterviewData({...directInterviewData, lastName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>名</Label>
                      <Input
                        value={directInterviewData.firstName}
                        onChange={(e) => setDirectInterviewData({...directInterviewData, firstName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>メールアドレス</Label>
                      <Input
                        type="email"
                        value={directInterviewData.email}
                        onChange={(e) => setDirectInterviewData({...directInterviewData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>電話番号</Label>
                      <Input
                        type="tel"
                        value={directInterviewData.phone}
                        onChange={(e) => setDirectInterviewData({...directInterviewData, phone: e.target.value})}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>応募職種</Label>
                      <Input
                        value={directInterviewData.position}
                        onChange={(e) => setDirectInterviewData({...directInterviewData, position: e.target.value})}
                        placeholder="例: 看護師"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowDirectInterviewForm(false)}>
                      キャンセル
                    </Button>
                    <Button onClick={() => setDirectInterviewStep(2)}>
                      次へ
                    </Button>
                  </div>
                </>
              )}

              {directInterviewStep === 2 && (
                <>
                  <h3 className="font-semibold">ステップ2: 履歴書登録</h3>
                  <RadioGroup
                    value={directInterviewData.resumeOption}
                    onValueChange={(value: 'now' | 'later') => setDirectInterviewData({...directInterviewData, resumeOption: value})}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="now" id="now" />
                      <Label htmlFor="now">今すぐ登録する</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="later" id="later" />
                      <Label htmlFor="later">面接日に持参予定</Label>
                    </div>
                  </RadioGroup>
                  {directInterviewData.resumeOption === 'now' && (
                    <div className="p-4 border-2 border-dashed rounded-lg text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">ファイルをドロップまたはクリックしてアップロード</p>
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setDirectInterviewStep(1)}>
                      戻る
                    </Button>
                    <Button onClick={() => setDirectInterviewStep(3)}>
                      次へ
                    </Button>
                  </div>
                </>
              )}

              {directInterviewStep === 3 && (
                <>
                  <h3 className="font-semibold">ステップ3: 面接日設定</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>面接日</Label>
                      <Input
                        type="date"
                        value={directInterviewData.interviewDate}
                        onChange={(e) => setDirectInterviewData({...directInterviewData, interviewDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>面接時間</Label>
                      <Select
                        value={directInterviewData.interviewTime}
                        onValueChange={(value) => setDirectInterviewData({...directInterviewData, interviewTime: value})}
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
                  </div>
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <div className="text-sm">
                      登録完了後、面接カラムに表示されます。
                      {directInterviewData.resumeOption === 'later' && '履歴書は面接日に持参してください。'}
                    </div>
                  </Alert>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setDirectInterviewStep(2)}>
                      戻る
                    </Button>
                    <Button onClick={() => {
                      console.log('登録処理', directInterviewData)
                      setShowDirectInterviewForm(false)
                      setDirectInterviewStep(1)
                    }}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      登録して面接へ
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

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
              {/* 見学履歴がある場合の表示 */}
              {selectedApplicant.visitorHistory && (
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="font-semibold">見学履歴あり</div>
                    <div className="text-sm mt-1 space-y-1">
                      <div>見学日: {selectedApplicant.visitorHistory.visitDate}</div>
                      {selectedApplicant.visitorHistory.visitFeedback && (
                        <>
                          <div>当時の興味度: {
                            selectedApplicant.visitorHistory.visitFeedback.interestLevel === 'high' ? '高' :
                            selectedApplicant.visitorHistory.visitFeedback.interestLevel === 'medium' ? '中' : '低'
                          }</div>
                          <div>満足度: {selectedApplicant.visitorHistory.visitFeedback.satisfaction}/5</div>
                        </>
                      )}
                      {selectedApplicant.visitorHistory.conversionDate && (
                        <div>応募移行日: {selectedApplicant.visitorHistory.conversionDate}</div>
                      )}
                      {selectedApplicant.visitorHistory.conversionReason && (
                        <div className="mt-2 p-2 bg-white rounded">
                          <span className="font-medium">移行理由:</span> {selectedApplicant.visitorHistory.conversionReason}
                        </div>
                      )}
                    </div>
                  </div>
                </Alert>
              )}

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
                    <Label>メールアドレス</Label>
                    <p>{selectedApplicant.email}</p>
                  </div>
                  <div>
                    <Label>電話番号</Label>
                    <p>{selectedApplicant.phone}</p>
                  </div>
                  <div>
                    <Label>生年月日</Label>
                    <p>{selectedApplicant.birthDate}</p>
                  </div>
                  <div>
                    <Label>性別</Label>
                    <p>{selectedApplicant.gender}</p>
                  </div>
                </div>
              </div>

              {/* 応募情報 */}
              <div>
                <h3 className="font-semibold mb-3">応募情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>希望職種</Label>
                    <p>{selectedApplicant.desiredPosition || selectedApplicant.qualifications?.[0] || '未設定'}</p>
                  </div>
                  <div>
                    <Label>希望給与</Label>
                    <p>{selectedApplicant.desiredSalary}万円</p>
                  </div>
                  <div>
                    <Label>勤務開始可能日</Label>
                    <p>{selectedApplicant.availableStartDate}</p>
                  </div>
                  <div>
                    <Label>現在の就業状況</Label>
                    <p>{selectedApplicant.currentEmployment}</p>
                  </div>
                </div>
              </div>

              {/* アクションボタン */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  メモ追加
                </Button>
                <Button variant="outline">
                  <Send className="h-4 w-4 mr-2" />
                  メール送信
                </Button>
                <Button>
                  <Calendar className="h-4 w-4 mr-2" />
                  面接設定
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}