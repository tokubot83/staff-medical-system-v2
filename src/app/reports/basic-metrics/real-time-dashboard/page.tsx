'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Activity,
  Calendar
} from 'lucide-react'

export default function RealTimeDashboard() {
  const currentStats = {
    totalStaff: 150,
    present: 142,
    absent: 5,
    onLeave: 3,
    shiftCoverage: 94.7,
    overtimeWarnings: 8,
    emergencyCapacity: 12
  }

  const shiftData = [
    { time: '早番 (7:00-15:00)', required: 30, actual: 28, coverage: 93.3 },
    { time: '日勤 (9:00-17:00)', required: 50, actual: 48, coverage: 96.0 },
    { time: '遅番 (13:00-21:00)', required: 35, actual: 35, coverage: 100 },
    { time: '夜勤 (21:00-7:00)', required: 15, actual: 14, coverage: 93.3 }
  ]

  const overtimeAlerts = [
    { name: '山田太郎', department: '内科', hours: 52, limit: 45 },
    { name: '佐藤花子', department: '外科', hours: 48, limit: 45 },
    { name: '鈴木一郎', department: '救急', hours: 50, limit: 45 }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">リアルタイムダッシュボード</h1>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-500 animate-pulse" />
          <span className="text-sm text-gray-600">
            最終更新: {new Date().toLocaleTimeString('ja-JP')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">現在出勤中</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.present}名</div>
            <p className="text-xs text-muted-foreground">
              全体の {((currentStats.present / currentStats.totalStaff) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">欠勤者数</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.absent}名</div>
            <p className="text-xs text-muted-foreground">
              前日比 +2名
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">シフト充足率</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.shiftCoverage}%</div>
            <Progress value={currentStats.shiftCoverage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">緊急対応可能人数</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.emergencyCapacity}名</div>
            <p className="text-xs text-muted-foreground">
              待機・オンコール含む
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="shift" className="w-full">
        <TabsList>
          <TabsTrigger value="shift">シフト充足状況</TabsTrigger>
          <TabsTrigger value="overtime">オーバータイム警告</TabsTrigger>
          <TabsTrigger value="emergency">緊急対応状況</TabsTrigger>
        </TabsList>

        <TabsContent value="shift">
          <Card>
            <CardHeader>
              <CardTitle>時間帯別シフト充足状況</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shiftData.map((shift, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{shift.time}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {shift.actual}/{shift.required}名
                        </span>
                        <Badge variant={shift.coverage === 100 ? 'default' : 'secondary'}>
                          {shift.coverage}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={shift.coverage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overtime">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                労働時間超過警告 ({currentStats.overtimeWarnings}件)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {overtimeAlerts.map((alert, index) => (
                  <Alert key={index} variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex justify-between items-center">
                        <div>
                          <strong>{alert.name}</strong> ({alert.department})
                        </div>
                        <div className="text-sm">
                          週{alert.hours}時間 (上限: {alert.limit}時間)
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency">
          <Card>
            <CardHeader>
              <CardTitle>緊急対応体制</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold">即時対応可能</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>院内待機医師</span>
                      <Badge>3名</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>看護師（フロート）</span>
                      <Badge>5名</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>技師・検査員</span>
                      <Badge>2名</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold">オンコール待機</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>専門医</span>
                      <Badge variant="secondary">4名</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>看護師</span>
                      <Badge variant="secondary">6名</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>その他スタッフ</span>
                      <Badge variant="secondary">2名</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>本日の人員状況サマリー</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">出勤状況</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>定時出勤</span>
                  <span>135名</span>
                </div>
                <div className="flex justify-between">
                  <span>遅刻</span>
                  <span className="text-orange-600">3名</span>
                </div>
                <div className="flex justify-between">
                  <span>早退</span>
                  <span className="text-orange-600">4名</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">休暇取得</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>有給休暇</span>
                  <span>2名</span>
                </div>
                <div className="flex justify-between">
                  <span>病気休暇</span>
                  <span>1名</span>
                </div>
                <div className="flex justify-between">
                  <span>その他</span>
                  <span>0名</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">予定外欠勤</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>体調不良</span>
                  <span className="text-red-600">3名</span>
                </div>
                <div className="flex justify-between">
                  <span>家庭事情</span>
                  <span className="text-red-600">1名</span>
                </div>
                <div className="flex justify-between">
                  <span>連絡なし</span>
                  <span className="text-red-600">1名</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}