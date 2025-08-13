'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog'
import { 
  ChevronLeft, ChevronRight, Calendar, Clock, Users, 
  MapPin, Plus, Edit2, Trash2, AlertCircle, Check 
} from 'lucide-react'

interface TrainingEvent {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  type: 'mandatory' | 'optional' | 'external' | 'online'
  instructor: string
  location: string
  capacity: number
  enrolled: number
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
  description?: string
  targetAudience?: string[]
  isDragging?: boolean
}

interface TimeSlot {
  time: string
  available: boolean
}

export default function TrainingCalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [events, setEvents] = useState<TrainingEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<TrainingEvent | null>(null)
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [draggedEvent, setDraggedEvent] = useState<TrainingEvent | null>(null)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])

  useEffect(() => {
    loadEvents()
    findAvailableSlots()
  }, [currentDate, viewMode])

  const loadEvents = () => {
    const mockEvents: TrainingEvent[] = [
      {
        id: '1',
        title: '感染対策基礎研修',
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5).toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '11:00',
        type: 'mandatory',
        instructor: '感染管理認定看護師',
        location: '第1研修室',
        capacity: 30,
        enrolled: 25,
        status: 'scheduled',
        targetAudience: ['看護師', '看護助手']
      },
      {
        id: '2',
        title: 'BLS研修',
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10).toISOString().split('T')[0],
        startTime: '13:00',
        endTime: '17:00',
        type: 'mandatory',
        instructor: '救急認定看護師',
        location: 'シミュレーション室',
        capacity: 20,
        enrolled: 20,
        status: 'scheduled',
        targetAudience: ['全職員']
      },
      {
        id: '3',
        title: 'リーダーシップ研修',
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15).toISOString().split('T')[0],
        startTime: '14:00',
        endTime: '16:00',
        type: 'optional',
        instructor: '看護部長',
        location: 'オンライン',
        capacity: 50,
        enrolled: 35,
        status: 'scheduled',
        targetAudience: ['主任', 'リーダー候補']
      },
      {
        id: '4',
        title: '医療安全研修',
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20).toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '12:00',
        type: 'mandatory',
        instructor: '医療安全管理者',
        location: '大会議室',
        capacity: 100,
        enrolled: 85,
        status: 'scheduled',
        targetAudience: ['全職員']
      },
      {
        id: '5',
        title: '褥瘡ケア研修',
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 25).toISOString().split('T')[0],
        startTime: '15:00',
        endTime: '17:00',
        type: 'optional',
        instructor: '皮膚・排泄ケア認定看護師',
        location: '第2研修室',
        capacity: 25,
        enrolled: 18,
        status: 'scheduled',
        targetAudience: ['看護師']
      }
    ]
    setEvents(mockEvents)
  }

  const findAvailableSlots = () => {
    const slots: TimeSlot[] = []
    const times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']
    
    times.forEach(time => {
      const hasConflict = events.some(event => {
        const eventStart = parseInt(event.startTime.split(':')[0])
        const slotTime = parseInt(time.split(':')[0])
        const eventEnd = parseInt(event.endTime.split(':')[0])
        return slotTime >= eventStart && slotTime < eventEnd
      })
      
      slots.push({
        time,
        available: !hasConflict && (parseInt(time.split(':')[0]) < 17)
      })
    })
    
    setAvailableSlots(slots)
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
    }
    setCurrentDate(newDate)
  }

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    
    return days
  }

  const getEventsForDay = (day: number | null) => {
    if (!day) return []
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0]
    return events.filter(event => event.date === dateStr)
  }

  const getEventTypeColor = (type: TrainingEvent['type']) => {
    switch (type) {
      case 'mandatory': return 'bg-red-100 text-red-800 border-red-300'
      case 'optional': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'external': return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'online': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const handleDragStart = (event: TrainingEvent) => {
    setDraggedEvent(event)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, day: number) => {
    e.preventDefault()
    if (draggedEvent) {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0]
      const updatedEvents = events.map(event => 
        event.id === draggedEvent.id ? { ...event, date: newDate } : event
      )
      setEvents(updatedEvents)
      setDraggedEvent(null)
    }
  }

  const handleEventClick = (event: TrainingEvent) => {
    setSelectedEvent(event)
    setShowEventDialog(true)
  }

  const formatDateHeader = () => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' }
    if (viewMode === 'week') {
      const weekStart = new Date(currentDate)
      weekStart.setDate(currentDate.getDate() - currentDate.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      return `${weekStart.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', year: 'numeric' })}`
    } else if (viewMode === 'day') {
      return currentDate.toLocaleDateString('ja-JP', { ...options, day: 'numeric', weekday: 'long' })
    }
    return currentDate.toLocaleDateString('ja-JP', options)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">研修カレンダー</h2>
          <p className="text-gray-600 mt-1">研修スケジュールの管理と空き時間の自動検出</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setViewMode('day')}>
            日
          </Button>
          <Button variant="outline" size="sm" onClick={() => setViewMode('week')}>
            週
          </Button>
          <Button variant="outline" size="sm" onClick={() => setViewMode('month')}>
            月
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            研修追加
          </Button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="sm" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-xl">
              {formatDateHeader()}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigateDate('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'month' && (
            <div className="grid grid-cols-7 gap-1">
              {['日', '月', '火', '水', '木', '金', '土'].map(day => (
                <div key={day} className="text-center font-semibold p-2 text-sm">
                  {day}
                </div>
              ))}
              {getDaysInMonth().map((day, index) => (
                <div
                  key={index}
                  className={`min-h-[100px] border rounded-lg p-2 ${
                    day ? 'hover:bg-gray-50' : ''
                  }`}
                  onDragOver={day ? handleDragOver : undefined}
                  onDrop={day ? (e) => handleDrop(e, day) : undefined}
                >
                  {day && (
                    <>
                      <div className="font-semibold text-sm mb-1">{day}</div>
                      <div className="space-y-1">
                        {getEventsForDay(day).slice(0, 3).map(event => (
                          <div
                            key={event.id}
                            draggable
                            onDragStart={() => handleDragStart(event)}
                            onClick={() => handleEventClick(event)}
                            className={`text-xs p-1 rounded cursor-pointer border ${getEventTypeColor(event.type)} ${
                              event.isDragging ? 'opacity-50' : ''
                            }`}
                          >
                            <div className="font-medium truncate">{event.title}</div>
                            <div className="text-[10px]">{event.startTime}</div>
                          </div>
                        ))}
                        {getEventsForDay(day).length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{getEventsForDay(day).length - 3} 件
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {viewMode === 'week' && (
            <div className="grid grid-cols-8 gap-1">
              <div className="font-semibold text-sm p-2">時間</div>
              {['日', '月', '火', '水', '木', '金', '土'].map(day => (
                <div key={day} className="text-center font-semibold p-2 text-sm">
                  {day}
                </div>
              ))}
              {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(time => (
                <React.Fragment key={time}>
                  <div className="text-sm p-2 text-gray-600">{time}</div>
                  {[0, 1, 2, 3, 4, 5, 6].map(dayOffset => (
                    <div
                      key={dayOffset}
                      className="border min-h-[60px] p-1 hover:bg-gray-50"
                    >
                      {/* Events would go here */}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          )}

          {viewMode === 'day' && (
            <div className="space-y-4">
              <div className="grid grid-cols-[100px_1fr] gap-4">
                {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(time => (
                  <React.Fragment key={time}>
                    <div className="text-sm text-gray-600 text-right">{time}</div>
                    <div className="border rounded-lg p-3 min-h-[80px] hover:bg-gray-50">
                      {events
                        .filter(event => event.startTime === time)
                        .map(event => (
                          <div
                            key={event.id}
                            onClick={() => handleEventClick(event)}
                            className={`p-3 rounded-lg cursor-pointer ${getEventTypeColor(event.type)}`}
                          >
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm mt-1">
                              <MapPin className="h-3 w-3 inline mr-1" />
                              {event.location}
                            </div>
                          </div>
                        ))}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Slots */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            利用可能な時間帯
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {availableSlots.filter(slot => slot.available).map(slot => (
              <Badge key={slot.time} variant="outline" className="bg-green-50">
                <Check className="h-3 w-3 mr-1" />
                {slot.time}
              </Badge>
            ))}
          </div>
          {availableSlots.filter(slot => slot.available).length === 0 && (
            <div className="text-gray-500 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              本日は空き時間がありません
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event Detail Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">日時</label>
                  <p className="mt-1">
                    {new Date(selectedEvent.date).toLocaleDateString('ja-JP')} {selectedEvent.startTime} - {selectedEvent.endTime}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">場所</label>
                  <p className="mt-1">{selectedEvent.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">講師</label>
                  <p className="mt-1">{selectedEvent.instructor}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">受講状況</label>
                  <p className="mt-1">
                    {selectedEvent.enrolled}/{selectedEvent.capacity}名
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${
                        selectedEvent.enrolled >= selectedEvent.capacity ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(selectedEvent.enrolled / selectedEvent.capacity) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">対象者</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedEvent.targetAudience?.map(audience => (
                    <Badge key={audience} variant="outline">
                      {audience}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">研修タイプ</label>
                <Badge className={`mt-2 ${getEventTypeColor(selectedEvent.type)}`}>
                  {selectedEvent.type === 'mandatory' && '必須研修'}
                  {selectedEvent.type === 'optional' && '選択研修'}
                  {selectedEvent.type === 'external' && '外部研修'}
                  {selectedEvent.type === 'online' && 'オンライン研修'}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEventDialog(false)}>
              閉じる
            </Button>
            <Button variant="outline">
              <Edit2 className="h-4 w-4 mr-2" />
              編集
            </Button>
            <Button>
              <Users className="h-4 w-4 mr-2" />
              受講申込
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}