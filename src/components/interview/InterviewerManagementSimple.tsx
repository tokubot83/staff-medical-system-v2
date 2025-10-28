'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Plus,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  Ban,
  Edit2,
  Trash2,
} from 'lucide-react';

// シンプル化されたNG日設定
interface NGDate {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'full-day' | 'time-range';
  startTime?: string;
  endTime?: string;
  reason?: string;
}

// シンプル化された担当者データ
interface SimpleInterviewer {
  id: string;
  name: string;
  title: string;
  department: string;
  status: 'active' | 'inactive';

  // シンプルな稼働設定
  workingDays: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };

  workingHours: {
    start: string; // "09:00"
    end: string;   // "17:00"
  };

  maxWeeklyCapacity: number;

  // NG日（統合管理）
  ngDates: NGDate[];

  // 表示用情報
  currentWeekLoad: number;
  specialties: string[];
}

interface InterviewerManagementSimpleProps {
  accessLevel: string;
}

export default function InterviewerManagementSimple({ accessLevel }: InterviewerManagementSimpleProps) {
  const [interviewers, setInterviewers] = useState<SimpleInterviewer[]>([]);
  const [selectedInterviewer, setSelectedInterviewer] = useState<SimpleInterviewer | null>(null);
  const [editingInterviewer, setEditingInterviewer] = useState<SimpleInterviewer | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showNGDateForm, setShowNGDateForm] = useState(false);
  const [editingNGDateId, setEditingNGDateId] = useState<string | null>(null);
  const [newNGDate, setNewNGDate] = useState<Partial<NGDate>>({
    type: 'full-day',
    date: '',
    reason: '',
  });

  useEffect(() => {
    loadInterviewers();
  }, []);

  const loadInterviewers = () => {
    // モックデータ
    const mockData: SimpleInterviewer[] = [
      {
        id: 'INT-001',
        name: '田中美香子',
        title: '看護師長',
        department: 'キャリア支援室',
        status: 'active',
        workingDays: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false,
        },
        workingHours: { start: '09:00', end: '17:00' },
        maxWeeklyCapacity: 12,
        currentWeekLoad: 8,
        specialties: ['キャリア開発', '専門分野選択'],
        ngDates: [
          {
            id: 'NG-001',
            date: '2025-10-23',
            type: 'full-day',
            reason: '年次休暇',
          },
          {
            id: 'NG-002',
            date: '2025-10-25',
            type: 'time-range',
            startTime: '14:00',
            endTime: '16:00',
            reason: '部門会議',
          },
          {
            id: 'NG-003',
            date: '2025-11-05',
            type: 'full-day',
            reason: '研修参加',
          },
        ],
      },
      {
        id: 'INT-002',
        name: '佐藤健一',
        title: '看護部主任',
        department: '教育研修部',
        status: 'active',
        workingDays: {
          monday: true,
          tuesday: true,
          wednesday: false,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: false,
        },
        workingHours: { start: '09:00', end: '17:00' },
        maxWeeklyCapacity: 10,
        currentWeekLoad: 5,
        specialties: ['新人指導', '教育プログラム'],
        ngDates: [
          {
            id: 'NG-004',
            date: '2025-10-24',
            type: 'time-range',
            startTime: '09:00',
            endTime: '12:00',
            reason: '研修講師',
          },
        ],
      },
      {
        id: 'INT-003',
        name: '山田花子',
        title: '副看護師長',
        department: 'メンタルヘルス科',
        status: 'inactive',
        workingDays: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: false,
          friday: true,
          saturday: false,
          sunday: false,
        },
        workingHours: { start: '10:00', end: '16:00' },
        maxWeeklyCapacity: 8,
        currentWeekLoad: 0,
        specialties: ['メンタルヘルス', 'ストレス管理'],
        ngDates: [],
      },
    ];

    setInterviewers(mockData);
  };

  // カレンダー生成（月曜始まり）
  const generateCalendar = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    // 日曜=0を月曜始まりに変換: 日曜=6, 月曜=0, 火曜=1...
    const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const calendar: (number | null)[] = [];

    // 月初の空白
    for (let i = 0; i < adjustedStartDay; i++) {
      calendar.push(null);
    }

    // 日付
    for (let day = 1; day <= daysInMonth; day++) {
      calendar.push(day);
    }

    return calendar;
  };

  // 日付のステータスを取得
  const getDateStatus = (year: number, month: number, day: number) => {
    if (!editingInterviewer) return 'none';

    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay(); // 0=日曜, 1=月曜, ...

    // 曜日名マッピング（JavaScriptの標準: 0=日曜）
    const dayNames: { [key: number]: keyof typeof editingInterviewer.workingDays } = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday'
    };

    const isWorkingDay = editingInterviewer.workingDays[dayNames[dayOfWeek]];

    const ngDate = editingInterviewer.ngDates.find(ng => ng.date === dateStr);

    if (ngDate) {
      return ngDate.type === 'full-day' ? 'ng-full' : 'ng-partial';
    }

    return isWorkingDay ? 'working' : 'non-working';
  };

  // NG日追加・更新
  const handleAddNGDate = () => {
    if (!editingInterviewer || !newNGDate.date) {
      alert('日付を選択してください');
      return;
    }

    if (newNGDate.type === 'time-range' && (!newNGDate.startTime || !newNGDate.endTime)) {
      alert('時間を入力してください');
      return;
    }

    if (editingNGDateId) {
      // 編集モード：既存のNG日を更新
      setEditingInterviewer({
        ...editingInterviewer,
        ngDates: editingInterviewer.ngDates.map(ng =>
          ng.id === editingNGDateId
            ? {
                ...ng,
                date: newNGDate.date,
                type: newNGDate.type || 'full-day',
                startTime: newNGDate.startTime,
                endTime: newNGDate.endTime,
                reason: newNGDate.reason || '',
              }
            : ng
        ).sort((a, b) => a.date.localeCompare(b.date)),
      });
    } else {
      // 新規追加モード
      const ng: NGDate = {
        id: `NG-${Date.now()}`,
        date: newNGDate.date,
        type: newNGDate.type || 'full-day',
        startTime: newNGDate.startTime,
        endTime: newNGDate.endTime,
        reason: newNGDate.reason || '',
      };

      setEditingInterviewer({
        ...editingInterviewer,
        ngDates: [...editingInterviewer.ngDates, ng].sort((a, b) => a.date.localeCompare(b.date)),
      });
    }

    // フォームリセット
    setNewNGDate({ type: 'full-day', date: '', reason: '' });
    setEditingNGDateId(null);
    setShowNGDateForm(false);
  };

  // NG日削除
  const handleDeleteNGDate = (ngId: string) => {
    if (!editingInterviewer) return;

    setEditingInterviewer({
      ...editingInterviewer,
      ngDates: editingInterviewer.ngDates.filter(ng => ng.id !== ngId),
    });
  };

  // 保存
  const handleSave = () => {
    if (!editingInterviewer) return;

    setInterviewers(prev =>
      prev.map(i => (i.id === editingInterviewer.id ? editingInterviewer : i))
    );

    setSelectedInterviewer(null);
    setEditingInterviewer(null);
  };

  const activeInterviewers = interviewers.filter(i => i.status === 'active');
  const inactiveInterviewers = interviewers.filter(i => i.status === 'inactive');

  // カレンダーの日付セルのスタイル
  const getDateCellStyle = (status: string) => {
    switch (status) {
      case 'working':
        return 'bg-blue-100 text-blue-900 hover:bg-blue-200 cursor-pointer';
      case 'ng-full':
        return 'bg-red-200 text-red-900 cursor-pointer';
      case 'ng-partial':
        return 'bg-orange-200 text-orange-900 cursor-pointer';
      case 'non-working':
        return 'bg-gray-100 text-gray-400';
      default:
        return '';
    }
  };

  // カレンダーの日付クリック処理
  const handleDateClick = (year: number, month: number, day: number) => {
    if (!editingInterviewer) return;

    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay(); // 0=日曜, 1=月曜, ...

    // 曜日名マッピング
    const dayNames: { [key: number]: keyof typeof editingInterviewer.workingDays } = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday'
    };

    const isWorkingDay = editingInterviewer.workingDays[dayNames[dayOfWeek]];

    // 非稼働日はクリック不可
    if (!isWorkingDay) {
      return;
    }

    // 既存のNG日を探す
    const existingNG = editingInterviewer.ngDates.find(ng => ng.date === dateStr);

    if (existingNG) {
      // NG日を削除（稼働日に戻す）
      setEditingInterviewer({
        ...editingInterviewer,
        ngDates: editingInterviewer.ngDates.filter(ng => ng.id !== existingNG.id),
      });
    } else {
      // NG日として追加
      const newNG: NGDate = {
        id: `NG-${Date.now()}`,
        date: dateStr,
        type: 'full-day',
        reason: '',
      };
      setEditingInterviewer({
        ...editingInterviewer,
        ngDates: [...editingInterviewer.ngDates, newNG].sort((a, b) => a.date.localeCompare(b.date)),
      });
    }
  };

  // 日付フォーマット
  const formatNGDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      weekday: 'short',
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">面談担当者管理</h2>
          <p className="text-gray-600 mt-1">
            稼働中: {activeInterviewers.length}名 / 休止中: {inactiveInterviewers.length}名
          </p>
        </div>
        <Button size="lg">
          <Plus className="h-5 w-5 mr-2" />
          担当者追加
        </Button>
      </div>

      {/* 担当者カード一覧 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {interviewers.map(interviewer => {
          const loadPercentage = (interviewer.currentWeekLoad / interviewer.maxWeeklyCapacity) * 100;
          const workingDayCount = Object.values(interviewer.workingDays).filter(Boolean).length;
          const upcomingNGDates = interviewer.ngDates.filter(
            ng => new Date(ng.date) >= new Date()
          );

          return (
            <Card key={interviewer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="space-y-2">
                  <CardTitle className="text-xl">{interviewer.name}</CardTitle>
                  <p className="text-sm text-gray-600">
                    {interviewer.title} | {interviewer.department}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant={interviewer.status === 'active' ? 'default' : 'secondary'}>
                      {interviewer.status === 'active' ? '●稼働中' : '○休止中'}
                    </Badge>
                    {interviewer.status === 'active' && (
                      <span className="text-sm text-gray-600">
                        {Math.round(loadPercentage)}%
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 負荷状況 */}
                {interviewer.status === 'active' && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">今週の負荷</span>
                      <span className="font-medium">
                        {interviewer.currentWeekLoad}/{interviewer.maxWeeklyCapacity}件
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          loadPercentage >= 80
                            ? 'bg-red-500'
                            : loadPercentage >= 60
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(loadPercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* 稼働日 */}
                <div>
                  <p className="text-xs text-gray-600 mb-2">稼働日</p>
                  <div className="flex gap-1">
                    {Object.entries(interviewer.workingDays).map(([day, isWorking]) => (
                      <div
                        key={day}
                        className={`w-8 h-8 rounded text-xs flex items-center justify-center font-medium ${
                          isWorking
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {day === 'monday' && '月'}
                        {day === 'tuesday' && '火'}
                        {day === 'wednesday' && '水'}
                        {day === 'thursday' && '木'}
                        {day === 'friday' && '金'}
                        {day === 'saturday' && '土'}
                        {day === 'sunday' && '日'}
                      </div>
                    ))}
                  </div>
                </div>

                {/* NG日 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-600">NG日</p>
                    <Badge variant="outline" className="text-xs">
                      {upcomingNGDates.length}件
                    </Badge>
                  </div>
                  {upcomingNGDates.length > 0 && (
                    <div className="text-xs text-gray-700 space-y-1">
                      {upcomingNGDates.slice(0, 2).map(ng => (
                        <div key={ng.id} className="flex items-center gap-1">
                          <Ban className="h-3 w-3 text-red-500" />
                          <span>
                            {formatNGDate(ng.date)}
                            {ng.type === 'time-range' && ` ${ng.startTime}-${ng.endTime}`}
                          </span>
                        </div>
                      ))}
                      {upcomingNGDates.length > 2 && (
                        <p className="text-gray-500 ml-4">他{upcomingNGDates.length - 2}件</p>
                      )}
                    </div>
                  )}
                </div>

                {/* スケジュール編集ボタン */}
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    setSelectedInterviewer(interviewer);
                    setEditingInterviewer(JSON.parse(JSON.stringify(interviewer)));
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  スケジュール管理
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* スケジュール管理モーダル（大きいサイズ） */}
      <Dialog
        open={!!selectedInterviewer}
        onOpenChange={open => {
          if (!open) {
            setSelectedInterviewer(null);
            setEditingInterviewer(null);
            setShowNGDateForm(false);
            setEditingNGDateId(null);
            setNewNGDate({ type: 'full-day', date: '', reason: '' });
          }
        }}
      >
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              📅 {editingInterviewer?.name}のスケジュール管理
            </DialogTitle>
            <div className="text-sm text-gray-600 mt-1">
              {editingInterviewer?.title} | {editingInterviewer?.department}
            </div>
          </DialogHeader>

          {editingInterviewer && (
            <div className="flex-1 overflow-y-auto space-y-6 px-2">
              {/* ステータス表示 */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Badge variant={editingInterviewer.status === 'active' ? 'default' : 'secondary'}>
                  {editingInterviewer.status === 'active' ? '●稼働中' : '○休止中'}
                </Badge>
                {editingInterviewer.status === 'active' && (
                  <span className="text-sm">
                    今週の負荷: {editingInterviewer.currentWeekLoad}/{editingInterviewer.maxWeeklyCapacity}件
                    ({Math.round((editingInterviewer.currentWeekLoad / editingInterviewer.maxWeeklyCapacity) * 100)}%)
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* 左側: 基本稼働パターン */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">基本稼働パターン</h3>

                  {/* 稼働曜日 */}
                  <div>
                    <label className="block text-sm font-medium mb-3">稼働曜日</label>
                    <div className="grid grid-cols-7 gap-2">
                      {Object.entries(editingInterviewer.workingDays).map(([day, isWorking]) => (
                        <Button
                          key={day}
                          variant={isWorking ? 'default' : 'outline'}
                          size="sm"
                          className="h-12 text-sm"
                          onClick={() => {
                            setEditingInterviewer({
                              ...editingInterviewer,
                              workingDays: {
                                ...editingInterviewer.workingDays,
                                [day]: !isWorking,
                              },
                            });
                          }}
                        >
                          {day === 'monday' && '月'}
                          {day === 'tuesday' && '火'}
                          {day === 'wednesday' && '水'}
                          {day === 'thursday' && '木'}
                          {day === 'friday' && '金'}
                          {day === 'saturday' && '土'}
                          {day === 'sunday' && '日'}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* 時間帯 */}
                  <div>
                    <label className="block text-sm font-medium mb-2">勤務時間帯</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">開始</label>
                        <Input
                          type="time"
                          value={editingInterviewer.workingHours.start}
                          onChange={e =>
                            setEditingInterviewer({
                              ...editingInterviewer,
                              workingHours: {
                                ...editingInterviewer.workingHours,
                                start: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">終了</label>
                        <Input
                          type="time"
                          value={editingInterviewer.workingHours.end}
                          onChange={e =>
                            setEditingInterviewer({
                              ...editingInterviewer,
                              workingHours: {
                                ...editingInterviewer.workingHours,
                                end: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* 週の上限 */}
                  <div>
                    <label className="block text-sm font-medium mb-2">週の上限件数</label>
                    <Input
                      type="number"
                      value={editingInterviewer.maxWeeklyCapacity}
                      onChange={e =>
                        setEditingInterviewer({
                          ...editingInterviewer,
                          maxWeeklyCapacity: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-32"
                    />
                    <span className="text-sm text-gray-600 ml-2">件/週</span>
                  </div>

                  {/* ステータス切り替え */}
                  <div>
                    <label className="block text-sm font-medium mb-2">稼働ステータス</label>
                    <div className="flex gap-2">
                      <Button
                        variant={editingInterviewer.status === 'active' ? 'default' : 'outline'}
                        onClick={() =>
                          setEditingInterviewer({
                            ...editingInterviewer,
                            status: 'active',
                          })
                        }
                      >
                        稼働中
                      </Button>
                      <Button
                        variant={editingInterviewer.status === 'inactive' ? 'default' : 'outline'}
                        onClick={() =>
                          setEditingInterviewer({
                            ...editingInterviewer,
                            status: 'inactive',
                          })
                        }
                      >
                        休止中
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 右側: カレンダー */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">カレンダー</h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSelectedMonth(
                            new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1)
                          )
                        }
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="font-medium min-w-[120px] text-center">
                        {selectedMonth.getFullYear()}年{selectedMonth.getMonth() + 1}月
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSelectedMonth(
                            new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1)
                          )
                        }
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* カレンダーグリッド */}
                  <div className="border rounded-lg p-3">
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['月', '火', '水', '木', '金', '土', '日'].map(day => (
                        <div
                          key={day}
                          className="text-xs font-medium text-center text-gray-600 py-1"
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {generateCalendar(
                        selectedMonth.getFullYear(),
                        selectedMonth.getMonth()
                      ).map((day, index) => {
                        if (day === null) {
                          return <div key={`empty-${index}`} className="aspect-square" />;
                        }

                        const status = getDateStatus(
                          selectedMonth.getFullYear(),
                          selectedMonth.getMonth(),
                          day
                        );

                        return (
                          <div
                            key={day}
                            className={`aspect-square flex items-center justify-center text-sm rounded ${getDateCellStyle(
                              status
                            )} transition-all`}
                            onClick={() => handleDateClick(selectedMonth.getFullYear(), selectedMonth.getMonth(), day)}
                          >
                            {day}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 凡例と使い方 */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-blue-100 border rounded" />
                        <span>稼働可能</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-red-200 border rounded" />
                        <span>NG(終日)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-orange-200 border rounded" />
                        <span>NG(時間限定)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-gray-100 border rounded" />
                        <span>非稼働日</span>
                      </div>
                    </div>
                    <div className="p-2 bg-blue-50 rounded text-xs text-blue-800">
                      💡 日付をクリックして、NG日の追加・削除ができます
                    </div>
                  </div>
                </div>
              </div>

              {/* NG日・例外設定 */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">NG日・例外設定</h3>

                {/* NG日一覧 */}
                {editingInterviewer.ngDates.length > 0 ? (
                  <div className="space-y-2">
                    {editingInterviewer.ngDates.map(ng => (
                      <div
                        key={ng.id}
                        className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <Ban className="h-5 w-5 text-red-600" />
                          <div className="flex-1">
                            <div className="font-medium text-red-900">
                              {formatNGDate(ng.date)}
                              {ng.type === 'time-range' && (
                                <span className="ml-2 text-sm">
                                  {ng.startTime}-{ng.endTime}
                                </span>
                              )}
                              {ng.type === 'full-day' && (
                                <Badge variant="destructive" className="ml-2">
                                  終日
                                </Badge>
                              )}
                            </div>
                            {ng.reason && (
                              <p className="text-sm text-red-700 mt-1">{ng.reason}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // NG日を編集用フォームに設定
                              setNewNGDate({
                                date: ng.date,
                                type: ng.type,
                                startTime: ng.startTime,
                                endTime: ng.endTime,
                                reason: ng.reason,
                              });
                              // 編集中のNG日IDを保存
                              setEditingNGDateId(ng.id);
                              // フォームを表示
                              setShowNGDateForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNGDate(ng.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4 border-2 border-dashed rounded-lg">
                    NG日が設定されていません
                  </p>
                )}

                {/* NG日追加フォーム */}
                {!showNGDateForm ? (
                  <Button
                    variant="outline"
                    onClick={() => setShowNGDateForm(true)}
                    className="w-full border-dashed border-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    NG日を追加
                  </Button>
                ) : (
                  <Card className="border-2 border-blue-300">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">NG日を追加</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowNGDateForm(false);
                            setNewNGDate({ type: 'full-day', date: '', reason: '' });
                            setEditingNGDateId(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            日付 <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="date"
                            value={newNGDate.date}
                            onChange={e => setNewNGDate({ ...newNGDate, date: e.target.value })}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">タイプ</label>
                          <div className="flex gap-2">
                            <Button
                              variant={newNGDate.type === 'full-day' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setNewNGDate({ ...newNGDate, type: 'full-day' })}
                            >
                              終日
                            </Button>
                            <Button
                              variant={newNGDate.type === 'time-range' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setNewNGDate({
                                ...newNGDate,
                                type: 'time-range',
                                startTime: newNGDate.startTime || '09:00',
                                endTime: newNGDate.endTime || '17:00'
                              })}
                            >
                              時間指定
                            </Button>
                          </div>
                        </div>
                      </div>

                      {newNGDate.type === 'time-range' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">開始時間</label>
                            <select
                              value={newNGDate.startTime || '09:00'}
                              onChange={e =>
                                setNewNGDate({ ...newNGDate, startTime: e.target.value })
                              }
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              {Array.from({ length: 60 }, (_, i) => {
                                const hour = 8 + Math.floor(i / 6);
                                const minute = (i % 6) * 10;
                                const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                                return <option key={time} value={time}>{time}</option>;
                              })}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">終了時間</label>
                            <select
                              value={newNGDate.endTime || '17:00'}
                              onChange={e =>
                                setNewNGDate({ ...newNGDate, endTime: e.target.value })
                              }
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              {Array.from({ length: 60 }, (_, i) => {
                                const hour = 8 + Math.floor(i / 6);
                                const minute = (i % 6) * 10;
                                const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                                return <option key={time} value={time}>{time}</option>;
                              })}
                            </select>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium mb-1">理由</label>
                        <Input
                          value={newNGDate.reason || ''}
                          onChange={e => setNewNGDate({ ...newNGDate, reason: e.target.value })}
                          placeholder="例: 年次休暇、研修参加"
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setShowNGDateForm(false);
                            setNewNGDate({ type: 'full-day', date: '', reason: '' });
                            setEditingNGDateId(null);
                          }}
                        >
                          キャンセル
                        </Button>
                        <Button onClick={handleAddNGDate} className="flex-1">
                          追加
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* フッター */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                setSelectedInterviewer(null);
                setEditingInterviewer(null);
                setShowNGDateForm(false);
                setEditingNGDateId(null);
                setNewNGDate({ type: 'full-day', date: '', reason: '' });
              }}
            >
              キャンセル
            </Button>
            <Button size="lg" onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              すべて保存する
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
