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
import { InterviewSchedule } from '@/types/recruitment'
import {
  Calendar, Clock, MapPin, Users, Video, FileText,
  CheckCircle, XCircle, AlertCircle, Plus, Edit, Send,
  PhoneCall, Building, ChevronRight, User, Star
} from 'lucide-react'

interface InterviewSchedulerNewProps {
  interviews: InterviewSchedule[]
  onScheduleInterview?: (interview: Partial<InterviewSchedule>) => void
  onUpdateInterview?: (id: string, updates: Partial<InterviewSchedule>) => void
  onCancelInterview?: (id: string) => void
}

export default function InterviewSchedulerNew({
  interviews,
  onScheduleInterview,
  onUpdateInterview,
  onCancelInterview
}: InterviewSchedulerNewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [selectedInterview, setSelectedInterview] = useState<InterviewSchedule | null>(null)
  const [showEvaluationDialog, setShowEvaluationDialog] = useState(false)

  // 新規面接スケジュール
  const [newInterview, setNewInterview] = useState({
    applicantName: '',
    applicantId: '',
    jobPostingId: '',
    position: '',
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

  // 評価入力
  const [evaluation, setEvaluation] = useState({
    rating: 0,
    strengths: '',
    concerns: '',
    recommendation: '',
    comments: ''
  })

  // 日付別に面接をグループ化
  const todayInterviews = interviews.filter(i =>
    i.scheduledDate === new Date().toISOString().split('T')[0] &&
    i.status === 'scheduled'
  )

  const upcomingInterviews = interviews.filter(i =>
    i.scheduledDate > new Date().toISOString().split('T')[0] &&
    i.status === 'scheduled'
  )

  const completedInterviews = interviews.filter(i =>
    i.status === 'completed'
  ).slice(0, 10) // 最近10件

  // 面接タイプのラベル
  const getInterviewTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'first': '一次面接',
      'second': '二次面接',
      'final': '最終面接'
    }
    return types[type] || type
  }

  // ステータスの色
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'scheduled': 'bg-blue-500',
      'completed': 'bg-green-500',
      'cancelled': 'bg-red-500',
      'no-show': 'bg-gray-500'
    }
    return colors[status] || 'bg-gray-500'
  }

  // 面接カード
  const InterviewCard = ({ interview }: { interview: InterviewSchedule }) => (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold">応募者ID: {interview.applicantId}</h4>
            <Badge className={getStatusColor(interview.status) + ' text-white'}>
              {getInterviewTypeLabel(interview.interviewType)}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(interview.scheduledDate).toLocaleDateString('ja-JP')}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {interview.scheduledTime} ({interview.duration}分)
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm">
          {interview.meetingUrl ? (
            <>
              <Video className="h-3 w-3 text-blue-500" />
              <span className="text-blue-600">オンライン面接</span>
            </>
          ) : (
            <>
              <MapPin className="h-3 w-3" />
              <span>{interview.location}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Users className="h-3 w-3" />
          <span className="text-gray-600">
            面接官: {interview.interviewers.map(i => i.name).join(', ')}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        {interview.status === 'scheduled' && (
          <>
            {interview.meetingUrl && (
              <Button size="sm" className="flex-1">
                <Video className="h-3 w-3 mr-1" />
                会議参加
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedInterview(interview)}
            >
              <Edit className="h-3 w-3 mr-1" />
              編集
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600"
              onClick={() => onCancelInterview?.(interview.id)}
            >
              <XCircle className="h-3 w-3 mr-1" />
              キャンセル
            </Button>
          </>
        )}

        {interview.status === 'completed' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedInterview(interview)
              setShowEvaluationDialog(true)
            }}
          >
            <Star className="h-3 w-3 mr-1" />
            評価確認
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* ダッシュボード */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-2 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-8 w-8 text-blue-500" />
              <Badge className="bg-blue-100 text-blue-700">本日</Badge>
            </div>
            <div className="text-2xl font-bold">{todayInterviews.length}</div>
            <div className="text-sm text-gray-600">本日の面接</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-8 w-8 text-purple-500" />
              <Badge className="bg-purple-100 text-purple-700">今週</Badge>
            </div>
            <div className="text-2xl font-bold">{upcomingInterviews.length}</div>
            <div className="text-sm text-gray-600">予定面接</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <Badge className="bg-green-100 text-green-700">今月</Badge>
            </div>
            <div className="text-2xl font-bold">{completedInterviews.length}</div>
            <div className="text-sm text-gray-600">完了面接</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Video className="h-8 w-8 text-orange-500" />
              <Badge className="bg-orange-100 text-orange-700">オンライン</Badge>
            </div>
            <div className="text-2xl font-bold">
              {interviews.filter(i => i.meetingUrl && i.status === 'scheduled').length}
            </div>
            <div className="text-sm text-gray-600">Web面接</div>
          </CardContent>
        </Card>
      </div>

      {/* 新規面接スケジュール */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            面接スケジュール登録
            <Button onClick={() => setShowScheduleDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              新規面接設定
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* 面接一覧 */}
      <div className="grid grid-cols-3 gap-4">
        {/* 本日の面接 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                本日の面接
              </span>
              <Badge variant="outline">{todayInterviews.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayInterviews.length === 0 ? (
              <p className="text-center text-gray-500 py-8">本日の面接はありません</p>
            ) : (
              todayInterviews.map(interview => (
                <InterviewCard key={interview.id} interview={interview} />
              ))
            )}
          </CardContent>
        </Card>

        {/* 予定面接 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>予定面接</span>
              <Badge variant="outline">{upcomingInterviews.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingInterviews.length === 0 ? (
              <p className="text-center text-gray-500 py-8">予定されている面接はありません</p>
            ) : (
              upcomingInterviews.map(interview => (
                <InterviewCard key={interview.id} interview={interview} />
              ))
            )}
          </CardContent>
        </Card>

        {/* 完了した面接 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>完了した面接</span>
              <Badge variant="outline">{completedInterviews.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedInterviews.length === 0 ? (
              <p className="text-center text-gray-500 py-8">完了した面接はありません</p>
            ) : (
              completedInterviews.map(interview => (
                <InterviewCard key={interview.id} interview={interview} />
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* 新規面接登録ダイアログ */}
      {showScheduleDialog && (
        <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>新規面接スケジュール</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>応募者名 *</Label>
                  <Input
                    placeholder="山田 太郎"
                    value={newInterview.applicantName}
                    onChange={(e) => setNewInterview({...newInterview, applicantName: e.target.value})}
                  />
                </div>
                <div>
                  <Label>応募職種 *</Label>
                  <Input
                    placeholder="看護師"
                    value={newInterview.position}
                    onChange={(e) => setNewInterview({...newInterview, position: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>面接形式</Label>
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
                <div>
                  <Label>所要時間（分）</Label>
                  <Select
                    value={newInterview.duration.toString()}
                    onValueChange={(value) =>
                      setNewInterview({...newInterview, duration: parseInt(value)})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30分</SelectItem>
                      <SelectItem value="45">45分</SelectItem>
                      <SelectItem value="60">60分</SelectItem>
                      <SelectItem value="90">90分</SelectItem>
                    </SelectContent>
                  </Select>
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

              <div>
                <Label>面接官</Label>
                <Input
                  placeholder="人事部長、看護部長（カンマ区切り）"
                  onChange={(e) => setNewInterview({
                    ...newInterview,
                    interviewers: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  })}
                />
              </div>

              <div>
                <Label>備考</Label>
                <Textarea
                  placeholder="面接に関する注意事項など"
                  value={newInterview.notes}
                  onChange={(e) => setNewInterview({...newInterview, notes: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1"
                  onClick={() => {
                    // ここで面接をスケジュール
                    console.log('Schedule interview:', newInterview)
                    setShowScheduleDialog(false)
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  面接を設定
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowScheduleDialog(false)}
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