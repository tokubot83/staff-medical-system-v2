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
  BarChart3
} from 'lucide-react';
import { InterviewerProfile, TimeSlot } from '@/types/pattern-d-interview';

interface InterviewerManagementProps {
  accessLevel: string;
}

export default function InterviewerManagement({ accessLevel }: InterviewerManagementProps) {
  const [interviewers, setInterviewers] = useState<InterviewerProfile[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedInterviewer, setSelectedInterviewer] = useState<InterviewerProfile | null>(null);
  const [isAddingInterviewer, setIsAddingInterviewer] = useState(false);
  const [activeTab, setActiveTab] = useState('interviewers');

  useEffect(() => {
    loadInterviewers();
    loadTimeSlots();
  }, []);

  const loadInterviewers = async () => {
    // TODO: API呼び出し
    const mockInterviewers: InterviewerProfile[] = [
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
        }
      }
    ];

    setInterviewers(mockInterviewers);
  };

  const loadTimeSlots = async () => {
    // TODO: API呼び出し
    const mockTimeSlots: TimeSlot[] = [
      {
        id: 'SLOT-001',
        dayOfWeek: 1, // 月曜日
        startTime: '09:00',
        endTime: '09:45',
        duration: 45,
        maxBookings: 1,
        slotType: 'morning',
        isActive: true
      },
      {
        id: 'SLOT-002',
        dayOfWeek: 1,
        startTime: '14:00',
        endTime: '14:30',
        duration: 30,
        maxBookings: 1,
        slotType: 'afternoon',
        isActive: true
      }
    ];

    setTimeSlots(mockTimeSlots);
  };

  const InterviewerCard = ({ interviewer }: { interviewer: InterviewerProfile }) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{interviewer.personalInfo.name}</CardTitle>
            <p className="text-sm text-gray-600">
              {interviewer.personalInfo.title} | {interviewer.personalInfo.department}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedInterviewer(interviewer)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* 基本情報 */}
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <span className="text-sm">経験年数: {interviewer.personalInfo.experienceYears}年</span>
        </div>

        {/* 専門分野 */}
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

        {/* パフォーマンス指標 */}
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

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">面談担当者・時間枠管理</h2>
          <p className="text-gray-600">Pattern D AI最適化システム用の設定管理</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            設定
          </Button>
        </div>
      </div>

      {/* タブナビゲーション */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="interviewers">面談担当者</TabsTrigger>
          <TabsTrigger value="timeslots">時間枠設定</TabsTrigger>
          <TabsTrigger value="analytics">負荷分析</TabsTrigger>
        </TabsList>

        {/* 面談担当者管理 */}
        <TabsContent value="interviewers" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              登録されている面談担当者: {interviewers.length}名
            </p>
            <Button onClick={() => setIsAddingInterviewer(true)}>
              <Plus className="h-4 w-4 mr-2" />
              担当者追加
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {interviewers.map((interviewer) => (
              <InterviewerCard key={interviewer.id} interviewer={interviewer} />
            ))}
          </div>
        </TabsContent>

        {/* 時間枠設定 */}
        <TabsContent value="timeslots">
          <TimeSlotManagement />
        </TabsContent>

        {/* 負荷分析 */}
        <TabsContent value="analytics">
          <WorkloadAnalytics />
        </TabsContent>
      </Tabs>

      {/* 担当者詳細/編集ダイアログ */}
      <Dialog open={!!selectedInterviewer} onOpenChange={() => setSelectedInterviewer(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              担当者詳細: {selectedInterviewer?.personalInfo.name}
            </DialogTitle>
          </DialogHeader>
          {selectedInterviewer && (
            <div className="space-y-4">
              {/* 詳細情報の表示/編集フォーム */}
              <p className="text-sm text-gray-600">担当者の詳細情報と設定</p>
              {/* TODO: 詳細フォーム実装 */}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}