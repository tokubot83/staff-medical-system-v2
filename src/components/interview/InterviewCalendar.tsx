'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Users, Clock, Filter, BarChart3 } from 'lucide-react';

interface InterviewEvent {
  id: string;
  date: string;
  time: string;
  staffName: string;
  staffId: string;
  department: string;
  interviewer: string;
  type: 'regular' | 'emergency' | 'followup' | 'career' | 'evaluation';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  duration: number;
  location?: string;
  notes?: string;
}

interface CalendarProps {
  interviews: InterviewEvent[];
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: InterviewEvent) => void;
}

export default function InterviewCalendar({ 
  interviews = [], 
  onDateSelect,
  onEventClick 
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedFilters, setSelectedFilters] = useState({
    department: 'all',
    status: 'all',
    type: 'all',
    interviewer: 'all'
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // カレンダー用のデータ生成
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    while (current <= lastDay || current.getDay() !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  }, [currentDate]);

  // 週表示用のデータ生成
  const weekData = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    
    return days;
  }, [currentDate, viewMode]);

  // 面談データのフィルタリング
  const filteredInterviews = useMemo(() => {
    return interviews.filter(interview => {
      if (selectedFilters.department !== 'all' && interview.department !== selectedFilters.department) return false;
      if (selectedFilters.status !== 'all' && interview.status !== selectedFilters.status) return false;
      if (selectedFilters.type !== 'all' && interview.type !== selectedFilters.type) return false;
      if (selectedFilters.interviewer !== 'all' && interview.interviewer !== selectedFilters.interviewer) return false;
      return true;
    });
  }, [interviews, selectedFilters]);

  // 日付ごとの面談数を取得
  const getInterviewsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredInterviews.filter(interview => interview.date === dateStr);
  };

  // 月間統計データ
  const monthlyStats = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthInterviews = filteredInterviews.filter(interview => {
      const interviewDate = new Date(interview.date);
      return interviewDate.getFullYear() === year && interviewDate.getMonth() === month;
    });

    return {
      total: monthInterviews.length,
      completed: monthInterviews.filter(i => i.status === 'completed').length,
      scheduled: monthInterviews.filter(i => i.status === 'scheduled').length,
      cancelled: monthInterviews.filter(i => i.status === 'cancelled').length,
      completionRate: monthInterviews.length > 0 
        ? Math.round((monthInterviews.filter(i => i.status === 'completed').length / monthInterviews.length) * 100)
        : 0
    };
  }, [currentDate, filteredInterviews]);

  // ナビゲーション
  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else {
      newDate.setDate(newDate.getDate() + (direction * 7));
    }
    setCurrentDate(newDate);
  };

  // 面談タイプのスタイル取得
  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-300';
      case 'regular': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'followup': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'career': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'evaluation': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // ステータスのスタイル取得
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'scheduled': return 'bg-blue-500';
      case 'cancelled': return 'bg-gray-400';
      case 'rescheduled': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = viewMode === 'month' 
      ? { year: 'numeric', month: 'long' }
      : { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ja-JP', options);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* ヘッダー */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-800">面談カレンダー</h2>
          </div>
          
          {/* ビュー切り替え */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'month'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              月表示
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'week'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              週表示
            </button>
          </div>
        </div>

        {/* ナビゲーションと月表示 */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h3 className="text-lg font-medium text-gray-800 min-w-[200px] text-center">
              {formatDate(currentDate)}
            </h3>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              今日
            </button>
          </div>

          {/* 統計情報 */}
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">総面談数:</span>
              <span className="font-semibold text-gray-800">{monthlyStats.total}件</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">実施率:</span>
              <span className="font-semibold text-green-600">{monthlyStats.completionRate}%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-600">予定 {monthlyStats.scheduled}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-600">完了 {monthlyStats.completed}</span>
            </div>
          </div>
        </div>

        {/* フィルター */}
        <div className="flex gap-3">
          <select
            value={selectedFilters.department}
            onChange={(e) => setSelectedFilters({...selectedFilters, department: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部署</option>
            <option value="内科病棟">内科病棟</option>
            <option value="外科病棟">外科病棟</option>
            <option value="小児科病棟">小児科病棟</option>
            <option value="ICU">ICU</option>
            <option value="外来">外来</option>
          </select>

          <select
            value={selectedFilters.status}
            onChange={(e) => setSelectedFilters({...selectedFilters, status: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全ステータス</option>
            <option value="scheduled">予定</option>
            <option value="completed">完了</option>
            <option value="cancelled">キャンセル</option>
            <option value="rescheduled">変更</option>
          </select>

          <select
            value={selectedFilters.type}
            onChange={(e) => setSelectedFilters({...selectedFilters, type: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全種別</option>
            <option value="regular">定期面談</option>
            <option value="emergency">緊急面談</option>
            <option value="followup">フォローアップ</option>
            <option value="career">キャリア面談</option>
            <option value="evaluation">評価面談</option>
          </select>
        </div>
      </div>

      {/* カレンダー本体 */}
      <div className="p-6">
        {viewMode === 'month' ? (
          <div>
            {/* 曜日ヘッダー */}
            <div className="grid grid-cols-7 gap-0 mb-2">
              {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
                <div
                  key={day}
                  className={`text-center text-sm font-medium py-2 ${
                    index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 日付グリッド */}
            <div className="grid grid-cols-7 gap-0 border-t border-l border-gray-200">
              {calendarData.map((date, index) => {
                const dayInterviews = getInterviewsForDate(date);
                const isHoliday = date.getDay() === 0 || date.getDay() === 6;
                
                return (
                  <div
                    key={index}
                    className={`border-r border-b border-gray-200 min-h-[100px] p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                      !isCurrentMonth(date) ? 'bg-gray-50' : ''
                    } ${isToday(date) ? 'bg-blue-50' : ''} ${
                      selectedDate?.toDateString() === date.toDateString() ? 'bg-yellow-50' : ''
                    }`}
                    onClick={() => {
                      setSelectedDate(date);
                      onDateSelect?.(date);
                    }}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      !isCurrentMonth(date) ? 'text-gray-400' : 
                      isHoliday ? (date.getDay() === 0 ? 'text-red-600' : 'text-blue-600') : 
                      'text-gray-700'
                    } ${isToday(date) ? 'font-bold text-blue-600' : ''}`}>
                      {date.getDate()}
                    </div>

                    {/* 面談情報 */}
                    {dayInterviews.length > 0 && (
                      <div className="space-y-1">
                        {dayInterviews.slice(0, 3).map((interview, idx) => (
                          <div
                            key={interview.id}
                            className={`text-xs px-1 py-0.5 rounded cursor-pointer hover:opacity-80 ${getTypeStyle(interview.type)}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onEventClick?.(interview);
                            }}
                          >
                            <div className="flex items-center gap-1">
                              <div className={`w-1.5 h-1.5 rounded-full ${getStatusStyle(interview.status)}`}></div>
                              <span className="truncate">{interview.time} {interview.staffName}</span>
                            </div>
                          </div>
                        ))}
                        {dayInterviews.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">
                            他{dayInterviews.length - 3}件
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* 週表示 */
          <div>
            <div className="grid grid-cols-8 gap-0 border-t border-l border-gray-200">
              {/* 時間軸 */}
              <div className="border-r border-b border-gray-200 bg-gray-50">
                <div className="h-12"></div>
                {Array.from({ length: 10 }, (_, i) => i + 8).map(hour => (
                  <div key={hour} className="h-20 border-t border-gray-200 px-2 py-1">
                    <span className="text-xs text-gray-500">{hour}:00</span>
                  </div>
                ))}
              </div>

              {/* 各曜日 */}
              {weekData.map((date, index) => {
                const dayInterviews = getInterviewsForDate(date);
                const isHoliday = date.getDay() === 0 || date.getDay() === 6;
                
                return (
                  <div key={index} className="border-r border-b border-gray-200">
                    <div className={`h-12 border-b border-gray-200 p-2 text-center ${
                      isToday(date) ? 'bg-blue-50' : ''
                    }`}>
                      <div className={`text-sm font-medium ${
                        isHoliday ? (date.getDay() === 0 ? 'text-red-600' : 'text-blue-600') : 'text-gray-700'
                      }`}>
                        {['日', '月', '火', '水', '木', '金', '土'][date.getDay()]}
                      </div>
                      <div className={`text-lg ${isToday(date) ? 'font-bold text-blue-600' : ''}`}>
                        {date.getDate()}
                      </div>
                    </div>

                    {/* 時間枠 */}
                    <div className="relative">
                      {Array.from({ length: 10 }, (_, i) => i + 8).map(hour => (
                        <div key={hour} className="h-20 border-t border-gray-200"></div>
                      ))}

                      {/* 面談予定 */}
                      {dayInterviews.map(interview => {
                        const [hours, minutes] = interview.time.split(':').map(Number);
                        const top = (hours - 8) * 80 + (minutes / 60) * 80;
                        const height = (interview.duration / 60) * 80;

                        return (
                          <div
                            key={interview.id}
                            className={`absolute left-1 right-1 rounded px-1 py-0.5 cursor-pointer hover:opacity-90 ${
                              getTypeStyle(interview.type)
                            }`}
                            style={{ top: `${top}px`, height: `${height}px` }}
                            onClick={() => onEventClick?.(interview)}
                          >
                            <div className="text-xs font-medium truncate">{interview.time}</div>
                            <div className="text-xs truncate">{interview.staffName}</div>
                            <div className="text-xs truncate opacity-75">{interview.interviewer}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 選択された日付の詳細 */}
      {selectedDate && (
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <h4 className="font-medium text-gray-800 mb-3">
            {selectedDate.toLocaleDateString('ja-JP', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              weekday: 'long'
            })} の面談予定
          </h4>
          
          {getInterviewsForDate(selectedDate).length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {getInterviewsForDate(selectedDate).map(interview => (
                <div
                  key={interview.id}
                  className="bg-white p-3 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow cursor-pointer"
                  onClick={() => onEventClick?.(interview)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-800">{interview.time}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeStyle(interview.type)}`}>
                          {interview.type === 'regular' ? '定期' :
                           interview.type === 'emergency' ? '緊急' :
                           interview.type === 'followup' ? 'フォロー' :
                           interview.type === 'career' ? 'キャリア' : '評価'}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${getStatusStyle(interview.status)}`}></div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{interview.staffName}</span>
                        <span className="mx-2">·</span>
                        <span>{interview.department}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        面談官: {interview.interviewer}
                        {interview.location && ` · 場所: ${interview.location}`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">この日の面談予定はありません</p>
          )}
        </div>
      )}
    </div>
  );
}