'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { InterviewSchedule } from '@/types/recruitment'
import { Calendar, Clock, MapPin, Users, Video, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface InterviewSchedulerProps {
  schedules: InterviewSchedule[]
  onUpdateSchedule?: (id: string, schedule: Partial<InterviewSchedule>) => void
  onCancelSchedule?: (id: string) => void
  onReschedule?: (id: string) => void
}

export default function InterviewScheduler({
  schedules,
  onUpdateSchedule,
  onCancelSchedule,
  onReschedule
}: InterviewSchedulerProps) {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list')
  const [filterDate, setFilterDate] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const statusColors = {
    scheduled: '#2563eb',
    completed: '#16a34a',
    cancelled: '#dc2626',
    'no-show': '#f59e0b'
  }

  const statusLabels = {
    scheduled: '予定',
    completed: '完了',
    cancelled: 'キャンセル',
    'no-show': '欠席'
  }

  const interviewTypeLabels = {
    first: '一次面接',
    second: '二次面接',
    final: '最終面接'
  }

  const filteredSchedules = schedules.filter(schedule => {
    if (filterType !== 'all' && schedule.interviewType !== filterType) return false
    if (filterStatus !== 'all' && schedule.status !== filterStatus) return false
    if (filterDate && !schedule.scheduledDate.includes(filterDate)) return false
    return true
  })

  const todaySchedules = schedules.filter(s => {
    const today = new Date().toISOString().split('T')[0]
    return s.scheduledDate === today && s.status === 'scheduled'
  })

  const weekSchedules = schedules.filter(s => {
    const today = new Date()
    const weekFromNow = new Date()
    weekFromNow.setDate(today.getDate() + 7)
    const scheduleDate = new Date(s.scheduledDate)
    return scheduleDate >= today && scheduleDate <= weekFromNow && s.status === 'scheduled'
  })

  const groupSchedulesByDate = () => {
    const grouped: { [key: string]: InterviewSchedule[] } = {}
    filteredSchedules.forEach(schedule => {
      if (!grouped[schedule.scheduledDate]) {
        grouped[schedule.scheduledDate] = []
      }
      grouped[schedule.scheduledDate].push(schedule)
    })
    return grouped
  }

  const formatTime = (time: string, duration: number) => {
    const endTime = new Date(`2000-01-01T${time}`)
    endTime.setMinutes(endTime.getMinutes() + duration)
    return `${time} - ${endTime.toTimeString().slice(0, 5)}`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              面接スケジュール管理
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                リスト表示
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('calendar')}
              >
                カレンダー表示
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-600">本日の面接</span>
              </div>
              <div className="text-2xl font-bold text-blue-700">{todaySchedules.length}件</div>
              <div className="mt-2 space-y-1">
                {todaySchedules.slice(0, 2).map(schedule => (
                  <div key={schedule.id} className="text-xs text-gray-600">
                    {schedule.scheduledTime} - {interviewTypeLabels[schedule.interviewType]}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">今週の面接</span>
              </div>
              <div className="text-2xl font-bold text-green-700">{weekSchedules.length}件</div>
              <div className="mt-2">
                <div className="text-xs text-gray-600">
                  平均: {(weekSchedules.length / 7).toFixed(1)}件/日
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-orange-600">調整中</span>
              </div>
              <div className="text-2xl font-bold text-orange-700">5件</div>
              <div className="mt-2">
                <div className="text-xs text-gray-600">
                  日程調整が必要な面接
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-40"
            />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="面接種別" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全種別</SelectItem>
                <SelectItem value="first">一次面接</SelectItem>
                <SelectItem value="second">二次面接</SelectItem>
                <SelectItem value="final">最終面接</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="ステータス" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全ステータス</SelectItem>
                <SelectItem value="scheduled">予定</SelectItem>
                <SelectItem value="completed">完了</SelectItem>
                <SelectItem value="cancelled">キャンセル</SelectItem>
                <SelectItem value="no-show">欠席</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {viewMode === 'list' ? (
            <div className="space-y-4">
              {Object.entries(groupSchedulesByDate()).map(([date, daySchedules]) => (
                <div key={date}>
                  <div className="font-semibold text-gray-700 mb-2">
                    {new Date(date).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      weekday: 'short'
                    })}
                  </div>
                  <div className="space-y-2">
                    {daySchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge
                                style={{
                                  backgroundColor: statusColors[schedule.status],
                                  color: 'white'
                                }}
                              >
                                {statusLabels[schedule.status]}
                              </Badge>
                              <Badge variant="outline">
                                {interviewTypeLabels[schedule.interviewType]}
                              </Badge>
                              <span className="font-medium">
                                応募者ID: {schedule.applicantId}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                              <div className="flex items-center gap-1 text-gray-600">
                                <Clock className="h-4 w-4" />
                                {formatTime(schedule.scheduledTime, schedule.duration)}
                              </div>
                              <div className="flex items-center gap-1 text-gray-600">
                                <MapPin className="h-4 w-4" />
                                {schedule.location}
                              </div>
                              {schedule.meetingUrl && (
                                <div className="flex items-center gap-1 text-blue-600">
                                  <Video className="h-4 w-4" />
                                  <a href={schedule.meetingUrl} className="hover:underline">
                                    オンライン面接
                                  </a>
                                </div>
                              )}
                            </div>

                            <div className="mt-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Users className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-600">面接官:</span>
                                <div className="flex flex-wrap gap-2">
                                  {schedule.interviewers.map((interviewer) => (
                                    <Badge key={interviewer.id} variant="secondary">
                                      {interviewer.name} ({interviewer.department})
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {schedule.notes && (
                              <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                                <FileText className="h-3 w-3 inline mr-1" />
                                {schedule.notes}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 ml-4">
                            {schedule.status === 'scheduled' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onUpdateSchedule?.(schedule.id, { status: 'completed' })}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  完了
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onReschedule?.(schedule.id)}
                                >
                                  <Clock className="h-4 w-4 mr-1" />
                                  変更
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600"
                                  onClick={() => onCancelSchedule?.(schedule.id)}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  取消
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
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
                  const daySchedules = filteredSchedules.filter(s => s.scheduledDate === dateStr)

                  return (
                    <div
                      key={i}
                      className={`min-h-[80px] border rounded p-2 ${
                        daySchedules.length > 0 ? 'bg-white' : ''
                      }`}
                    >
                      <div className="text-xs text-gray-500 mb-1">{date.getDate()}</div>
                      {daySchedules.slice(0, 2).map(schedule => (
                        <div
                          key={schedule.id}
                          className="text-xs p-1 mb-1 rounded"
                          style={{
                            backgroundColor: `${statusColors[schedule.status]}20`,
                            borderLeft: `2px solid ${statusColors[schedule.status]}`
                          }}
                        >
                          {schedule.scheduledTime.slice(0, 5)}
                        </div>
                      ))}
                      {daySchedules.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{daySchedules.length - 2}件
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}