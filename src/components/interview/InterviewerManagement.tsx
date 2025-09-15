'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Plus,
  Edit2,
  Trash2,
  Clock,
  Calendar,
  User,
  Award,
  Settings,
  BarChart3,
  Activity,
  Pause,
  Play,
  AlertCircle,
  CheckCircle,
  X,
  CalendarDays,
  MapPin,
  Ban
} from 'lucide-react';
import { InterviewerProfile, TimeSlot } from '@/types/pattern-d-interview';

// NG日・時間設定の型定義
interface NGSchedule {
  id: string;
  date: string; // YYYY-MM-DD format
  type: 'all-day' | 'time-limited';
  startTime?: string; // HH:MM format
  endTime?: string; // HH:MM format
  reason?: string; // 休暇、出張、会議等
}

// 拡張された担当者プロファイル
interface EnhancedInterviewerProfile extends InterviewerProfile {
  workingDays: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  dailySchedule: {
    [day: string]: {
      isAvailable: boolean;
      timeSlots: string[];
      restrictions?: string[];
    };
  };
  unavailableDates: string[];
  specialAvailableDates: string[];
  ngSchedules: NGSchedule[]; // NG日・時間設定
  currentStatus: 'active' | 'on-leave' | 'inactive';
  workloadAnalysis: {
    currentWeekLoad: number;
    maxCapacity: number;
    efficiency: number;
    nextAvailableSlot: string;
  };
}

interface InterviewerManagementProps {
  accessLevel: string;
}

export default function InterviewerManagement({ accessLevel }: InterviewerManagementProps) {
  const [interviewers, setInterviewers] = useState<EnhancedInterviewerProfile[]>([]);
  const [selectedInterviewer, setSelectedInterviewer] = useState<EnhancedInterviewerProfile | null>(null);
  const [isAddingInterviewer, setIsAddingInterviewer] = useState(false);
  const [newInterviewer, setNewInterviewer] = useState<EnhancedInterviewerProfile | null>(null);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [activeView, setActiveView] = useState<'active' | 'management'>('active');
  const [selectedDay, setSelectedDay] = useState<string>('monday');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editedInterviewer, setEditedInterviewer] = useState<EnhancedInterviewerProfile | null>(null);
  const [editingDetails, setEditingDetails] = useState<EnhancedInterviewerProfile | null>(null);

  useEffect(() => {
    loadInterviewers();
  }, []);

  const loadInterviewers = async () => {
    // TODO: API呼び出し
    const mockInterviewers: EnhancedInterviewerProfile[] = [
      {
        id: 'INT-001',
        personalInfo: {
          name: '田中美香子',
          title: '看護師長',
          department: 'キャリア支援室',
          experienceYears: 15,
          gender: 'female'
        },
        specialties: {
          primaryAreas: ['キャリア開発', '専門分野選択', '資格取得支援'],
          secondaryAreas: ['メンタルサポート', '職場環境改善'],
          certifications: ['キャリアコンサルタント', '産業カウンセラー']
        },
        availability: {
          weeklySchedule: [],
          unavailableDates: [],
          preferredDuration: {
            min: 30,
            max: 60,
            default: 45
          }
        },
        performanceMetrics: {
          satisfactionScore: 4.8,
          completionRate: 95,
          averageRating: 4.9,
          totalInterviews: 248
        },
        matchingPreferences: {
          staffLevels: ['新人', '中堅', 'ベテラン'],
          departments: ['内科', '外科', 'ICU'],
          interviewTypes: ['support', 'regular']
        },
        workingDays: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false
        },
        dailySchedule: {
          monday: {
            isAvailable: true,
            timeSlots: ['09:00-12:00', '14:00-17:00'],
            restrictions: []
          },
          tuesday: {
            isAvailable: true,
            timeSlots: ['09:00-12:00', '14:00-16:00'],
            restrictions: ['会議日(16:00-17:00)']
          },
          wednesday: {
            isAvailable: true,
            timeSlots: ['10:00-12:00', '14:00-17:00'],
            restrictions: []
          },
          thursday: {
            isAvailable: true,
            timeSlots: ['09:00-12:00', '13:00-16:00'],
            restrictions: []
          },
          friday: {
            isAvailable: true,
            timeSlots: ['09:00-11:00', '14:00-16:00'],
            restrictions: ['定例会議(11:00-12:00)']
          }
        },
        unavailableDates: ['2024-03-20', '2024-03-25'],
        specialAvailableDates: ['2024-03-23'],
        ngSchedules: [
          {
            id: 'NG-001',
            date: '2025-09-22',
            type: 'all-day',
            reason: '年次休暇'
          },
          {
            id: 'NG-002',
            date: '2025-09-25',
            type: 'time-limited',
            startTime: '14:00',
            endTime: '16:00',
            reason: '部門会議'
          }
        ],
        currentStatus: 'active',
        workloadAnalysis: {
          currentWeekLoad: 8,
          maxCapacity: 12,
          efficiency: 87,
          nextAvailableSlot: '明日 14:00'
        }
      },
      {
        id: 'INT-002',
        personalInfo: {
          name: '佐藤健一',
          title: '看護部主任',
          department: '教育研修部',
          experienceYears: 12,
          gender: 'male'
        },
        specialties: {
          primaryAreas: ['新人指導', '教育プログラム', 'スキル評価'],
          secondaryAreas: ['チームワーク向上', 'コミュニケーション'],
          certifications: ['看護教育専門看護師', '実習指導者']
        },
        availability: {
          weeklySchedule: [],
          unavailableDates: [],
          preferredDuration: {
            min: 20,
            max: 45,
            default: 30
          }
        },
        performanceMetrics: {
          satisfactionScore: 4.6,
          completionRate: 92,
          averageRating: 4.7,
          totalInterviews: 189
        },
        matchingPreferences: {
          staffLevels: ['新人', '中堅'],
          departments: ['全部署'],
          interviewTypes: ['regular', 'special']
        },
        workingDays: {
          monday: true,
          tuesday: true,
          wednesday: false,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: false
        },
        dailySchedule: {
          monday: {
            isAvailable: true,
            timeSlots: ['08:30-12:00', '13:00-17:00'],
            restrictions: []
          },
          tuesday: {
            isAvailable: true,
            timeSlots: ['09:00-12:00', '13:00-15:00'],
            restrictions: ['研修準備(15:00-17:00)']
          },
          thursday: {
            isAvailable: true,
            timeSlots: ['09:00-12:00', '14:00-17:00'],
            restrictions: []
          },
          friday: {
            isAvailable: true,
            timeSlots: ['09:00-11:00', '13:00-16:00'],
            restrictions: []
          },
          saturday: {
            isAvailable: true,
            timeSlots: ['09:00-12:00'],
            restrictions: ['午後不可']
          }
        },
        unavailableDates: ['2024-03-22'],
        specialAvailableDates: [],
        ngSchedules: [
          {
            id: 'NG-003',
            date: '2025-09-24',
            type: 'time-limited',
            startTime: '09:00',
            endTime: '12:00',
            reason: '研修講師'
          }
        ],
        currentStatus: 'active',
        workloadAnalysis: {
          currentWeekLoad: 5,
          maxCapacity: 10,
          efficiency: 92,
          nextAvailableSlot: '今日 15:00'
        }
      },
      {
        id: 'INT-003',
        personalInfo: {
          name: '山田花子',
          title: '副看護師長',
          department: 'メンタルヘルス科',
          experienceYears: 8,
          gender: 'female'
        },
        specialties: {
          primaryAreas: ['メンタルヘルス', 'ストレス管理', 'カウンセリング'],
          secondaryAreas: ['復職支援', '人間関係調整'],
          certifications: ['精神保健福祉士', 'カウンセラー']
        },
        availability: {
          weeklySchedule: [],
          unavailableDates: [],
          preferredDuration: {
            min: 45,
            max: 90,
            default: 60
          }
        },
        performanceMetrics: {
          satisfactionScore: 4.9,
          completionRate: 98,
          averageRating: 4.8,
          totalInterviews: 156
        },
        matchingPreferences: {
          staffLevels: ['全レベル'],
          departments: ['全部署'],
          interviewTypes: ['support', 'special']
        },
        workingDays: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: false,
          friday: true,
          saturday: false,
          sunday: false
        },
        dailySchedule: {
          monday: {
            isAvailable: true,
            timeSlots: ['10:00-12:00', '14:00-16:00'],
            restrictions: []
          },
          tuesday: {
            isAvailable: true,
            timeSlots: ['09:00-12:00', '13:30-17:00'],
            restrictions: []
          },
          wednesday: {
            isAvailable: true,
            timeSlots: ['14:00-17:00'],
            restrictions: ['午前不可(外来対応)']
          },
          friday: {
            isAvailable: true,
            timeSlots: ['09:00-11:00', '14:00-16:00'],
            restrictions: ['グループカウンセリング(11:00-13:00)']
          }
        },
        unavailableDates: ['2024-03-28', '2024-03-29'],
        specialAvailableDates: [],
        ngSchedules: [], // 休止中のため空
        currentStatus: 'on-leave',
        workloadAnalysis: {
          currentWeekLoad: 0,
          maxCapacity: 8,
          efficiency: 0,
          nextAvailableSlot: '復帰予定: 3/25'
        }
      }
    ];

    setInterviewers(mockInterviewers);
  };

  // 稼働中担当者のフィルタリング
  const activeInterviewers = interviewers.filter(i => i.currentStatus === 'active');
  const onLeaveInterviewers = interviewers.filter(i => i.currentStatus === 'on-leave');
  const inactiveInterviewers = interviewers.filter(i => i.currentStatus === 'inactive');

  // ステータス変更関数
  const handleStatusChange = (interviewerId: string, newStatus: 'active' | 'on-leave' | 'inactive') => {
    setInterviewers(prev => prev.map(interviewer =>
      interviewer.id === interviewerId
        ? { ...interviewer, currentStatus: newStatus }
        : interviewer
    ));
  };

  // 新規担当者の初期データ作成
  const createNewInterviewer = (): EnhancedInterviewerProfile => {
    const newId = `INT-${String(interviewers.length + 1).padStart(3, '0')}`;
    return {
      id: newId,
      personalInfo: {
        name: '',
        title: '',
        department: '',
        experienceYears: 0,
        gender: 'female' as const
      },
      specialties: {
        primaryAreas: [''],
        secondaryAreas: [],
        certifications: []
      },
      availability: {
        weeklySchedule: [],
        unavailableDates: [],
        preferredDuration: {
          min: 30,
          max: 60,
          default: 45
        }
      },
      performanceMetrics: {
        satisfactionScore: 0,
        completionRate: 0,
        averageRating: 0,
        totalInterviews: 0
      },
      matchingPreferences: {
        staffLevels: [],
        departments: [],
        interviewTypes: []
      },
      workingDays: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false
      },
      dailySchedule: {
        monday: { isAvailable: true, timeSlots: ['09:00-12:00', '14:00-17:00'], restrictions: [] },
        tuesday: { isAvailable: true, timeSlots: ['09:00-12:00', '14:00-17:00'], restrictions: [] },
        wednesday: { isAvailable: true, timeSlots: ['09:00-12:00', '14:00-17:00'], restrictions: [] },
        thursday: { isAvailable: true, timeSlots: ['09:00-12:00', '14:00-17:00'], restrictions: [] },
        friday: { isAvailable: true, timeSlots: ['09:00-12:00', '14:00-17:00'], restrictions: [] },
        saturday: { isAvailable: false, timeSlots: [], restrictions: [] },
        sunday: { isAvailable: false, timeSlots: [], restrictions: [] }
      },
      unavailableDates: [],
      specialAvailableDates: [],
      ngSchedules: [],
      currentStatus: 'active',
      workloadAnalysis: {
        currentWeekLoad: 0,
        maxCapacity: 10,
        efficiency: 0,
        nextAvailableSlot: '未設定'
      }
    };
  };

  // 新規担当者の追加処理
  const handleAddInterviewer = async () => {
    if (!newInterviewer) return;

    // バリデーション
    if (!newInterviewer.personalInfo.name) {
      alert('氏名は必須です。');
      return;
    }

    try {
      // TODO: 実際のAPI呼び出し
      // await createInterviewer(newInterviewer);

      // ローカル状態に追加
      setInterviewers(prev => [...prev, newInterviewer]);

      // 成功通知
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

      // モーダルを閉じる
      setIsAddingInterviewer(false);
      setNewInterviewer(null);

      console.log('新規担当者追加完了:', newInterviewer);
    } catch (error) {
      console.error('追加エラー:', error);
      alert('追加に失敗しました。もう一度お試しください。');
    }
  };

  // 詳細情報の保存処理
  const handleSaveDetails = async () => {
    if (!editingDetails) return;

    try {
      // TODO: 実際のAPI呼び出し
      // await updateInterviewerDetails(editingDetails);

      // ローカル状態を更新
      setInterviewers(prev => prev.map(interviewer =>
        interviewer.id === editingDetails.id ? editingDetails : interviewer
      ));

      // 選択中の担当者も更新
      setSelectedInterviewer(editingDetails);

      // 成功通知
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

      // モーダルを閉じる
      setEditingDetails(null);
      setSelectedInterviewer(null);

      console.log('担当者詳細保存完了:', editingDetails);
    } catch (error) {
      console.error('保存エラー:', error);
      alert('保存に失敗しました。もう一度お試しください。');
    }
  };

  // 稼働日・時間枠の保存処理
  const handleSaveSchedule = async () => {
    if (!editedInterviewer) return;

    try {
      // TODO: 実際のAPI呼び出し
      // await updateInterviewerSchedule(editedInterviewer);

      // ローカル状態を更新
      setInterviewers(prev => prev.map(interviewer =>
        interviewer.id === editedInterviewer.id ? editedInterviewer : interviewer
      ));

      // 選択中の担当者も更新
      setSelectedInterviewer(editedInterviewer);

      // 成功通知
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

      // モーダルを閉じる
      setIsEditingSchedule(false);
      setEditedInterviewer(null);

      console.log('稼働スケジュール保存完了:', editedInterviewer);
    } catch (error) {
      console.error('保存エラー:', error);
      alert('保存に失敗しました。もう一度お試しください。');
    }
  };

  // 稼働中担当者カード（負荷分析表示付き）
  const ActiveInterviewerCard = ({ interviewer }: { interviewer: EnhancedInterviewerProfile }) => {
    const loadPercentage = (interviewer.workloadAnalysis.currentWeekLoad / interviewer.workloadAnalysis.maxCapacity) * 100;
    const getLoadColor = (percentage: number) => {
      if (percentage >= 90) return 'text-red-600 bg-red-50';
      if (percentage >= 70) return 'text-yellow-600 bg-yellow-50';
      return 'text-green-600 bg-green-50';
    };

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-lg">{interviewer.personalInfo.name}</CardTitle>
                <Badge variant={interviewer.currentStatus === 'active' ? 'default' : 'secondary'}>
                  {interviewer.currentStatus === 'active' ? '稼働中' : '休止中'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                {interviewer.personalInfo.title} | {interviewer.personalInfo.department}
              </p>
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedInterviewer(interviewer);
                  setEditedInterviewer(JSON.parse(JSON.stringify(interviewer))); // Deep copy
                  setIsEditingSchedule(true);
                }}
              >
                <Calendar className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* リアルタイム負荷分析 */}
          <div className={`p-3 rounded-lg ${getLoadColor(loadPercentage)}`}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">今週の負荷状況</span>
              <Badge variant="outline" className="text-xs">
                {interviewer.workloadAnalysis.currentWeekLoad}/{interviewer.workloadAnalysis.maxCapacity}件
              </Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  loadPercentage >= 90 ? 'bg-red-500' :
                  loadPercentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(loadPercentage, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs">
              <span>負荷率: {Math.round(loadPercentage)}%</span>
              <span>効率性: {interviewer.workloadAnalysis.efficiency}%</span>
            </div>
          </div>

          {/* 次回空き時間 */}
          <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700">次回空き</span>
            </div>
            <span className="text-sm font-medium text-blue-900">
              {interviewer.workloadAnalysis.nextAvailableSlot}
            </span>
          </div>

          {/* 専門分野 */}
          <div>
            <p className="text-xs text-gray-600 mb-2">専門分野</p>
            <div className="flex flex-wrap gap-1">
              {interviewer.specialties.primaryAreas.slice(0, 2).map((area, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {area}
                </Badge>
              ))}
            </div>
          </div>

          {/* 稼働日表示 */}
          <div>
            <p className="text-xs text-gray-600 mb-2">稼働日</p>
            <div className="flex gap-1">
              {Object.entries(interviewer.workingDays).map(([day, isWorking]) => (
                <div
                  key={day}
                  className={`w-6 h-6 rounded text-xs flex items-center justify-center ${
                    isWorking ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {day.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
          </div>

          {/* 直近のNG日 */}
          {interviewer.ngSchedules.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded p-2">
              <div className="flex items-center gap-2 mb-1">
                <Ban className="h-3 w-3 text-red-500" />
                <span className="text-xs font-medium text-red-700">直近のNG日</span>
              </div>
              {interviewer.ngSchedules
                .filter(ng => new Date(ng.date) >= new Date())
                .slice(0, 2)
                .map((ng, index) => (
                  <div key={ng.id} className="text-xs text-red-600">
                    {new Date(ng.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                    {ng.type === 'time-limited' ? ` (${ng.startTime}-${ng.endTime})` : ' (終日)'}
                  </div>
                ))}
            </div>
          )}

          {/* パフォーマンス */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t text-center">
            <div>
              <p className="text-xs text-gray-600">満足度</p>
              <p className="font-semibold text-sm">{interviewer.performanceMetrics.satisfactionScore}/5.0</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">総面談数</p>
              <p className="font-semibold text-sm">{interviewer.performanceMetrics.totalInterviews}回</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 管理用担当者カード（ステータス変更機能付き）
  const ManagementInterviewerCard = ({ interviewer }: { interviewer: EnhancedInterviewerProfile }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{interviewer.personalInfo.name}</CardTitle>
              <Select
                value={interviewer.currentStatus}
                onValueChange={(value: 'active' | 'on-leave' | 'inactive') =>
                  handleStatusChange(interviewer.id, value)
                }
              >
                <SelectTrigger className="w-24 h-6 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">稼働中</SelectItem>
                  <SelectItem value="on-leave">休止中</SelectItem>
                  <SelectItem value="inactive">非稼働</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-gray-600">
              {interviewer.personalInfo.title} | {interviewer.personalInfo.department}
            </p>
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => {
              setSelectedInterviewer(interviewer);
              setEditingDetails(JSON.parse(JSON.stringify(interviewer)));
            }}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <span className="text-sm">経験年数: {interviewer.personalInfo.experienceYears}年</span>
        </div>

        <div>
          <p className="text-xs text-gray-600 mb-1">専門分野</p>
          <div className="flex flex-wrap gap-1">
            {interviewer.specialties.primaryAreas.slice(0, 3).map((area, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {area}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div>
            <p className="text-xs text-gray-600">満足度</p>
            <p className="font-semibold">{interviewer.performanceMetrics.satisfactionScore}/5.0</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">面談数</p>
            <p className="font-semibold">{interviewer.performanceMetrics.totalInterviews}回</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const TimeSlotManagement = () => (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">時間枠設定</h3>
        <Button onClick={() => setIsAddingInterviewer(true)}>
          <Plus className="h-4 w-4 mr-2" />
          時間枠追加
        </Button>
      </div>

      {/* 時間枠一覧 */}
      <div className="grid gap-4">
        {['morning', 'afternoon', 'evening'].map((timeType) => (
          <Card key={timeType}>
            <CardHeader>
              <CardTitle className="text-base">
                <Clock className="h-4 w-4 inline mr-2" />
                {timeType === 'morning' && '午前 (9:00-12:00)'}
                {timeType === 'afternoon' && '午後 (13:00-17:00)'}
                {timeType === 'evening' && '夕方 (17:30-19:00)'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {timeSlots
                  .filter(slot => slot.slotType === timeType)
                  .map((slot) => (
                    <div
                      key={slot.id}
                      className="flex justify-between items-center p-3 border rounded-lg"
                    >
                      <div>
                        <span className="font-medium">
                          {slot.startTime} - {slot.endTime}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">
                          ({slot.duration}分)
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={slot.isActive ? "default" : "secondary"}>
                          {slot.isActive ? "有効" : "無効"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const WorkloadAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">負荷分析・最適化</h3>

      {/* 担当者別負荷 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            <BarChart3 className="h-4 w-4 inline mr-2" />
            担当者別予約負荷
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {interviewers.map((interviewer) => {
              const currentLoad = Math.floor(Math.random() * 20) + 5; // モック
              const maxCapacity = 25;
              const loadPercentage = (currentLoad / maxCapacity) * 100;

              return (
                <div key={interviewer.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{interviewer.personalInfo.name}</span>
                    <span className="text-sm text-gray-600">
                      {currentLoad}/{maxCapacity}件
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        loadPercentage > 80 ? 'bg-red-500' :
                        loadPercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${loadPercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 最適化提案 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">最適化提案</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium">負荷分散提案</p>
              <p className="text-xs text-gray-600 mt-1">
                田中師長の負荷が高いため、一部のキャリア相談を佐藤主任に振り分けることを提案します。
              </p>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium">時間枠拡張提案</p>
              <p className="text-xs text-gray-600 mt-1">
                午前の時間枠を1枠追加することで、予約待ちを20%削減できます。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // アクセス制御
  if (!['L5', 'L6', 'L7', 'L8', 'L9', 'L10'].includes(accessLevel)) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-600">担当者管理機能にアクセスする権限がありません。</p>
        </CardContent>
      </Card>
    );
  }

  // NG日追加フォームコンポーネント
  const NGDateAddForm = ({ onAdd }: { onAdd: (ng: NGSchedule) => void }) => {
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [ngType, setNgType] = useState<'all-day' | 'time-limited'>('all-day');
    const [startTime, setStartTime] = useState<string>('09:00');
    const [endTime, setEndTime] = useState<string>('17:00');
    const [reason, setReason] = useState<string>('');
    const [showForm, setShowForm] = useState(false);

    const handleAdd = () => {
      if (!selectedDate) {
        alert('日付を選択してください。');
        return;
      }

      if (ngType === 'time-limited' && startTime >= endTime) {
        alert('終了時間は開始時間より後に設定してください。');
        return;
      }

      const newNG: NGSchedule = {
        id: `NG-${Date.now()}`,
        date: selectedDate,
        type: ngType,
        startTime: ngType === 'time-limited' ? startTime : undefined,
        endTime: ngType === 'time-limited' ? endTime : undefined,
        reason: reason || undefined
      };

      onAdd(newNG);

      // フォームリセット
      setSelectedDate('');
      setNgType('all-day');
      setStartTime('09:00');
      setEndTime('17:00');
      setReason('');
      setShowForm(false);
    };

    const today = new Date().toISOString().split('T')[0];

    return (
      <div className="space-y-3">
        {!showForm ? (
          <Button
            variant="outline"
            onClick={() => setShowForm(true)}
            className="w-full border-dashed border-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            NG日を追加
          </Button>
        ) : (
          <Card className="border-2 border-blue-200">
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">NG日・時間追加</h4>
                <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* 日付選択 */}
              <div>
                <label className="block text-sm font-medium mb-2">日付 <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={today}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* タイプ選択 */}
              <div>
                <label className="block text-sm font-medium mb-2">タイプ</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="all-day"
                      checked={ngType === 'all-day'}
                      onChange={(e) => setNgType(e.target.value as 'all-day')}
                      className="text-blue-600"
                    />
                    <Ban className="h-4 w-4 text-red-500" />
                    <span>終日NG</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="time-limited"
                      checked={ngType === 'time-limited'}
                      onChange={(e) => setNgType(e.target.value as 'time-limited')}
                      className="text-blue-600"
                    />
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span>時間限定NG</span>
                  </label>
                </div>
              </div>

              {/* 時間設定 */}
              {ngType === 'time-limited' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">開始時間</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">終了時間</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* 理由 */}
              <div>
                <label className="block text-sm font-medium mb-2">理由</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">選択してください</option>
                  <option value="年次休暇">年次休暇</option>
                  <option value="特別休暇">特別休暇</option>
                  <option value="出張">出張</option>
                  <option value="会議">会議</option>
                  <option value="研修">研修</option>
                  <option value="健康診断">健康診断</option>
                  <option value="その他">その他</option>
                </select>
              </div>

              {/* ボタン */}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                  キャンセル
                </Button>
                <Button onClick={handleAdd} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                  追加
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">面談担当者管理</h2>
          <p className="text-gray-600">AI最適化システム用の担当者・稼働状況管理</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs">
            稼働中: {activeInterviewers.length}名
          </Badge>
          <Badge variant="secondary" className="text-xs">
            休止中: {onLeaveInterviewers.length}名
          </Badge>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            設定
          </Button>
        </div>
      </div>

      {/* 保存成功通知 */}
      {saveSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in-right">
          <CheckCircle className="h-5 w-5" />
          <span>稼働スケジュールを保存しました</span>
        </div>
      )}

      {/* 2画面タブナビゲーション */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            稼働担当者ダッシュボード
          </TabsTrigger>
          <TabsTrigger value="management" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            担当者マスタ管理
          </TabsTrigger>
        </TabsList>

        {/* 稼働担当者ダッシュボード */}
        <TabsContent value="active" className="space-y-6">
          {/* 全体負荷サマリー */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">稼働中</p>
                    <p className="text-2xl font-bold text-green-600">{activeInterviewers.length}名</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">平均負荷率</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.round(activeInterviewers.reduce((acc, i) => acc + (i.workloadAnalysis.currentWeekLoad / i.workloadAnalysis.maxCapacity * 100), 0) / activeInterviewers.length || 0)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">高負荷担当者</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {activeInterviewers.filter(i => (i.workloadAnalysis.currentWeekLoad / i.workloadAnalysis.maxCapacity) >= 0.8).length}名
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 稼働中担当者一覧 */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">稼働中担当者 ({activeInterviewers.length}名)</h3>
              <div className="text-sm text-gray-600">
                次回空き時間で並び替え済み
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeInterviewers.map((interviewer) => (
                <ActiveInterviewerCard key={interviewer.id} interviewer={interviewer} />
              ))}
            </div>
          </div>

          {/* 休止中担当者 */}
          {onLeaveInterviewers.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">休止中担当者 ({onLeaveInterviewers.length}名)</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {onLeaveInterviewers.map((interviewer) => (
                  <ActiveInterviewerCard key={interviewer.id} interviewer={interviewer} />
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* 担当者マスタ管理 */}
        <TabsContent value="management" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">担当者マスタ管理</h3>
              <p className="text-sm text-gray-600">
                全担当者: {interviewers.length}名 |
                稼働中: {activeInterviewers.length}名 |
                休止中: {onLeaveInterviewers.length}名 |
                非稼働: {inactiveInterviewers.length}名
              </p>
            </div>
            <Button onClick={() => {
              setNewInterviewer(createNewInterviewer());
              setIsAddingInterviewer(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              担当者追加
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {interviewers.map((interviewer) => (
              <ManagementInterviewerCard key={interviewer.id} interviewer={interviewer} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* 稼働日・時間枠設定ダイアログ */}
      <Dialog open={isEditingSchedule} onOpenChange={(open) => {
        if (!open) {
          setIsEditingSchedule(false);
          setEditedInterviewer(null);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              稼働日・時間枠設定: {editedInterviewer?.personalInfo.name}
            </DialogTitle>
          </DialogHeader>
          {editedInterviewer && (
            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              {/* 稼働日設定 */}
              <div>
                <h4 className="font-semibold mb-3">稼働日設定</h4>
                <div className="grid grid-cols-7 gap-2">
                  {Object.entries(editedInterviewer.workingDays).map(([day, isWorking]) => (
                    <Button
                      key={day}
                      variant={isWorking ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        setEditedInterviewer(prev => prev ? {
                          ...prev,
                          workingDays: { ...prev.workingDays, [day]: !isWorking }
                        } : null);
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

              {/* 曜日別時間枠設定 */}
              <div>
                <h4 className="font-semibold mb-3">曜日別時間枠設定</h4>
                <Tabs value={selectedDay} onValueChange={setSelectedDay}>
                  <TabsList className="grid w-full grid-cols-7">
                    <TabsTrigger value="monday">月</TabsTrigger>
                    <TabsTrigger value="tuesday">火</TabsTrigger>
                    <TabsTrigger value="wednesday">水</TabsTrigger>
                    <TabsTrigger value="thursday">木</TabsTrigger>
                    <TabsTrigger value="friday">金</TabsTrigger>
                    <TabsTrigger value="saturday">土</TabsTrigger>
                    <TabsTrigger value="sunday">日</TabsTrigger>
                  </TabsList>

                  {Object.entries(editedInterviewer.dailySchedule).map(([day, schedule]) => (
                    <TabsContent key={day} value={day} className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <input
                            type="checkbox"
                            checked={schedule.isAvailable}
                            onChange={(e) => {
                              const newSchedule = { ...schedule, isAvailable: e.target.checked };
                              setEditedInterviewer(prev => prev ? {
                                ...prev,
                                dailySchedule: { ...prev.dailySchedule, [day]: newSchedule }
                              } : null);
                            }}
                          />
                          <span className="font-medium">この日は面談可能</span>
                        </div>

                        {schedule.isAvailable && (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium mb-2">時間枠</label>
                              <div className="space-y-2">
                                {schedule.timeSlots.map((slot, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <Input
                                      value={slot}
                                      onChange={(e) => {
                                        const newSlots = [...schedule.timeSlots];
                                        newSlots[index] = e.target.value;
                                        const newSchedule = { ...schedule, timeSlots: newSlots };
                                        setEditedInterviewer(prev => prev ? {
                                          ...prev,
                                          dailySchedule: { ...prev.dailySchedule, [day]: newSchedule }
                                        } : null);
                                      }}
                                      placeholder="例: 09:00-12:00"
                                      className="flex-1"
                                    />
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const newSlots = schedule.timeSlots.filter((_, i) => i !== index);
                                        const newSchedule = { ...schedule, timeSlots: newSlots };
                                        setEditedInterviewer(prev => prev ? {
                                          ...prev,
                                          dailySchedule: { ...prev.dailySchedule, [day]: newSchedule }
                                        } : null);
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newSlots = [...schedule.timeSlots, ''];
                                    const newSchedule = { ...schedule, timeSlots: newSlots };
                                    setEditedInterviewer(prev => prev ? {
                                      ...prev,
                                      dailySchedule: { ...prev.dailySchedule, [day]: newSchedule }
                                    } : null);
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  時間枠追加
                                </Button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">制約事項</label>
                              <Input
                                value={schedule.restrictions?.join(', ') || ''}
                                onChange={(e) => {
                                  const restrictions = e.target.value.split(',').map(r => r.trim()).filter(r => r);
                                  const newSchedule = { ...schedule, restrictions };
                                  setEditedInterviewer(prev => prev ? {
                                    ...prev,
                                    dailySchedule: { ...prev.dailySchedule, [day]: newSchedule }
                                  } : null);
                                }}
                                placeholder="例: 会議日(14:00-15:00), 研修対応"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>

            </div>
          )}
          {editedInterviewer && (
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => {
                setIsEditingSchedule(false);
                setEditedInterviewer(null);
              }}>
                キャンセル
              </Button>
              <Button onClick={handleSaveSchedule} className="bg-blue-600 hover:bg-blue-700">
                保存
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 担当者詳細/編集ダイアログ */}
      <Dialog open={!!selectedInterviewer && !isEditingSchedule} onOpenChange={(open) => {
        if (!open) {
          setSelectedInterviewer(null);
          setEditingDetails(null);
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl flex items-center gap-2">
              <Edit2 className="h-5 w-5" />
              担当者詳細編集: {editingDetails?.personalInfo.name}
            </DialogTitle>
          </DialogHeader>
          {editingDetails && (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                {/* 基本情報 */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">基本情報</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">氏名</label>
                      <Input
                        value={editingDetails.personalInfo.name}
                        onChange={(e) => setEditingDetails({
                          ...editingDetails,
                          personalInfo: { ...editingDetails.personalInfo, name: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">役職</label>
                      <Input
                        value={editingDetails.personalInfo.title}
                        onChange={(e) => setEditingDetails({
                          ...editingDetails,
                          personalInfo: { ...editingDetails.personalInfo, title: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">部署</label>
                      <Input
                        value={editingDetails.personalInfo.department}
                        onChange={(e) => setEditingDetails({
                          ...editingDetails,
                          personalInfo: { ...editingDetails.personalInfo, department: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">経験年数</label>
                      <Input
                        type="number"
                        value={editingDetails.personalInfo.experienceYears}
                        onChange={(e) => setEditingDetails({
                          ...editingDetails,
                          personalInfo: { ...editingDetails.personalInfo, experienceYears: parseInt(e.target.value) || 0 }
                        })}
                      />
                    </div>
                  </div>
                </div>

                {/* 専門分野 */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">専門分野</h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">主要専門分野</label>
                    <div className="space-y-2">
                      {editingDetails.specialties.primaryAreas.map((area, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={area}
                            className="flex-1"
                            onChange={(e) => {
                              const newAreas = [...editingDetails.specialties.primaryAreas];
                              newAreas[index] = e.target.value;
                              setEditingDetails({
                                ...editingDetails,
                                specialties: { ...editingDetails.specialties, primaryAreas: newAreas }
                              });
                            }}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newAreas = editingDetails.specialties.primaryAreas.filter((_, i) => i !== index);
                              setEditingDetails({
                                ...editingDetails,
                                specialties: { ...editingDetails.specialties, primaryAreas: newAreas }
                              });
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newAreas = [...editingDetails.specialties.primaryAreas, ''];
                          setEditingDetails({
                            ...editingDetails,
                            specialties: { ...editingDetails.specialties, primaryAreas: newAreas }
                          });
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        分野追加
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 稼働状況 */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">稼働状況</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">現在のステータス</label>
                      <Select
                        value={editingDetails.currentStatus}
                        onValueChange={(value: 'active' | 'on-leave' | 'inactive') => {
                          setEditingDetails({ ...editingDetails, currentStatus: value });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">稼働中</SelectItem>
                          <SelectItem value="on-leave">休止中</SelectItem>
                          <SelectItem value="inactive">非稼働</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">最大処理件数/週</label>
                      <Input
                        type="number"
                        value={editingDetails.workloadAnalysis.maxCapacity}
                        onChange={(e) => setEditingDetails({
                          ...editingDetails,
                          workloadAnalysis: {
                            ...editingDetails.workloadAnalysis,
                            maxCapacity: parseInt(e.target.value) || 0
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>

                {/* NG日・時間設定 */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">NG日・時間設定</h3>

                  {/* 現在のNG日一覧 */}
                  <div>
                    <label className="block text-sm font-medium mb-2">登録済みNG日</label>
                    {editingDetails.ngSchedules.length > 0 ? (
                      <div className="space-y-2">
                        {editingDetails.ngSchedules.map((ng, index) => (
                          <div key={ng.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-red-600" />
                                <span className="font-medium text-red-900">
                                  {new Date(ng.date).toLocaleDateString('ja-JP', {
                                    month: 'long', day: 'numeric', weekday: 'short'
                                  })}
                                </span>
                                <Badge variant={ng.type === 'all-day' ? 'destructive' : 'outline'} className="text-xs">
                                  {ng.type === 'all-day' ? '終日' : `${ng.startTime}-${ng.endTime}`}
                                </Badge>
                              </div>
                              {ng.reason && (
                                <p className="text-sm text-red-700 mt-1 ml-6">{ng.reason}</p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newNgSchedules = editingDetails.ngSchedules.filter((_, i) => i !== index);
                                setEditingDetails({
                                  ...editingDetails,
                                  ngSchedules: newNgSchedules
                                });
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 py-4 text-center border-2 border-dashed border-gray-200 rounded-lg">
                        NG日が設定されていません
                      </p>
                    )}
                  </div>

                  {/* NG日追加フォーム */}
                  <NGDateAddForm
                    onAdd={(newNG) => {
                      setEditingDetails({
                        ...editingDetails,
                        ngSchedules: [...editingDetails.ngSchedules, newNG]
                      });
                    }}
                  />
                </div>

                {/* 稼働スケジュール編集ボタン */}
                <div className="pt-4">
                  <Button
                    onClick={() => {
                      setEditedInterviewer(JSON.parse(JSON.stringify(editingDetails)));
                      setIsEditingSchedule(true);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    稼働日・時間枠を編集
                  </Button>
                </div>
              </div>

              {/* フッター */}
              <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50">
                <Button variant="outline" onClick={() => {
                  setSelectedInterviewer(null);
                  setEditingDetails(null);
                }}>
                  閉じる
                </Button>
                <Button onClick={handleSaveDetails} className="bg-green-600 hover:bg-green-700">
                  変更を保存
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 新規担当者追加ダイアログ */}
      <Dialog open={isAddingInterviewer} onOpenChange={(open) => {
        if (!open) {
          setIsAddingInterviewer(false);
          setNewInterviewer(null);
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl flex items-center gap-2">
              <Plus className="h-5 w-5" />
              新規担当者追加
            </DialogTitle>
          </DialogHeader>
          {newInterviewer && (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                {/* 基本情報 */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">基本情報 <span className="text-red-500">*</span></h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        氏名 <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={newInterviewer.personalInfo.name}
                        onChange={(e) => setNewInterviewer({
                          ...newInterviewer,
                          personalInfo: { ...newInterviewer.personalInfo, name: e.target.value }
                        })}
                        placeholder="例: 山田太郎"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        役職 <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={newInterviewer.personalInfo.title}
                        onChange={(e) => setNewInterviewer({
                          ...newInterviewer,
                          personalInfo: { ...newInterviewer.personalInfo, title: e.target.value }
                        })}
                        placeholder="例: 看護師長"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        部署 <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={newInterviewer.personalInfo.department}
                        onChange={(e) => setNewInterviewer({
                          ...newInterviewer,
                          personalInfo: { ...newInterviewer.personalInfo, department: e.target.value }
                        })}
                        placeholder="例: 人事部"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">経験年数</label>
                      <Input
                        type="number"
                        value={newInterviewer.personalInfo.experienceYears}
                        onChange={(e) => setNewInterviewer({
                          ...newInterviewer,
                          personalInfo: { ...newInterviewer.personalInfo, experienceYears: parseInt(e.target.value) || 0 }
                        })}
                        placeholder="例: 10"
                      />
                    </div>
                  </div>
                </div>

                {/* 専門分野 */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">専門分野</h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">主要専門分野</label>
                    <div className="space-y-2">
                      {newInterviewer.specialties.primaryAreas.map((area, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={area}
                            className="flex-1"
                            onChange={(e) => {
                              const newAreas = [...newInterviewer.specialties.primaryAreas];
                              newAreas[index] = e.target.value;
                              setNewInterviewer({
                                ...newInterviewer,
                                specialties: { ...newInterviewer.specialties, primaryAreas: newAreas }
                              });
                            }}
                            placeholder="例: キャリア開発"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newAreas = newInterviewer.specialties.primaryAreas.filter((_, i) => i !== index);
                              setNewInterviewer({
                                ...newInterviewer,
                                specialties: { ...newInterviewer.specialties, primaryAreas: newAreas }
                              });
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newAreas = [...newInterviewer.specialties.primaryAreas, ''];
                          setNewInterviewer({
                            ...newInterviewer,
                            specialties: { ...newInterviewer.specialties, primaryAreas: newAreas }
                          });
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        分野追加
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 稼働設定 */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">稼働設定</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">初期ステータス</label>
                      <Select
                        value={newInterviewer.currentStatus}
                        onValueChange={(value: 'active' | 'on-leave' | 'inactive') => {
                          setNewInterviewer({ ...newInterviewer, currentStatus: value });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">稼働中</SelectItem>
                          <SelectItem value="on-leave">休止中</SelectItem>
                          <SelectItem value="inactive">非稼働</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">最大処理件数/週</label>
                      <Input
                        type="number"
                        value={newInterviewer.workloadAnalysis.maxCapacity}
                        onChange={(e) => setNewInterviewer({
                          ...newInterviewer,
                          workloadAnalysis: {
                            ...newInterviewer.workloadAnalysis,
                            maxCapacity: parseInt(e.target.value) || 0
                          }
                        })}
                        placeholder="例: 10"
                      />
                    </div>
                  </div>
                </div>

                {/* 稼働日設定 */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">稼働日設定</h3>
                  <div className="grid grid-cols-7 gap-2">
                    {Object.entries(newInterviewer.workingDays).map(([day, isWorking]) => (
                      <Button
                        key={day}
                        variant={isWorking ? "default" : "outline"}
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          setNewInterviewer({
                            ...newInterviewer,
                            workingDays: { ...newInterviewer.workingDays, [day]: !isWorking }
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
              </div>

              {/* フッター */}
              <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50">
                <Button variant="outline" onClick={() => {
                  setIsAddingInterviewer(false);
                  setNewInterviewer(null);
                }}>
                  キャンセル
                </Button>
                <Button onClick={handleAddInterviewer} className="bg-green-600 hover:bg-green-700">
                  追加
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}