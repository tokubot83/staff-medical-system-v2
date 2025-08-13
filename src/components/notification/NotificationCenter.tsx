'use client'

import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  Info,
  Trash2,
  Archive,
  MoreVertical,
  Filter,
  Settings,
  BookOpen,
  FileText,
  Users,
  RefreshCw,
  ExternalLink,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import {
  notificationService,
  Notification,
  NotificationType,
  NotificationPriority,
  NotificationStats
} from '@/services/notificationService'

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [stats, setStats] = useState<NotificationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread' | NotificationType>('all')
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set())
  const [filterPriority, setFilterPriority] = useState<NotificationPriority | 'all'>('all')

  // 通知の読み込み
  useEffect(() => {
    loadNotifications()
    // 30秒ごとに自動更新
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  // フィルタリング
  useEffect(() => {
    filterNotifications()
  }, [notifications, selectedTab, filterPriority])

  const loadNotifications = async () => {
    setLoading(true)
    try {
      // 現在のユーザーIDを使用（実際の実装では認証システムから取得）
      const userId = 'current_user'
      
      const data = await notificationService.getNotifications({ userId })
      setNotifications(data)
      
      const statsData = await notificationService.getNotificationStats(userId)
      setStats(statsData)
    } finally {
      setLoading(false)
    }
  }

  const filterNotifications = () => {
    let filtered = [...notifications]

    // タブによるフィルタ
    if (selectedTab === 'unread') {
      filtered = filtered.filter(n => n.status === 'unread')
    } else if (selectedTab !== 'all') {
      filtered = filtered.filter(n => n.type === selectedTab)
    }

    // 優先度によるフィルタ
    if (filterPriority !== 'all') {
      filtered = filtered.filter(n => n.priority === filterPriority)
    }

    // アーカイブ済みは除外
    filtered = filtered.filter(n => n.status !== 'archived')

    setFilteredNotifications(filtered)
  }

  // 通知を既読にする
  const handleMarkAsRead = async (notificationId: string) => {
    await notificationService.markAsRead(notificationId)
    loadNotifications()
  }

  // 複数の通知を既読にする
  const handleMarkSelectedAsRead = async () => {
    await notificationService.markMultipleAsRead(Array.from(selectedNotifications))
    setSelectedNotifications(new Set())
    loadNotifications()
  }

  // すべて既読にする
  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead('current_user')
    loadNotifications()
  }

  // 通知をアーカイブ
  const handleArchive = async (notificationId: string) => {
    await notificationService.archiveNotification(notificationId)
    loadNotifications()
  }

  // 通知を削除
  const handleDelete = async (notificationId: string) => {
    await notificationService.deleteNotification(notificationId)
    loadNotifications()
  }

  // 選択の切り替え
  const toggleSelection = (notificationId: string) => {
    const newSelection = new Set(selectedNotifications)
    if (newSelection.has(notificationId)) {
      newSelection.delete(notificationId)
    } else {
      newSelection.add(notificationId)
    }
    setSelectedNotifications(newSelection)
  }

  // アイコンの取得
  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'training': return <BookOpen className="w-4 h-4" />
      case 'evaluation': return <FileText className="w-4 h-4" />
      case 'approval': return <Users className="w-4 h-4" />
      case 'reminder': return <Clock className="w-4 h-4" />
      case 'system': return <Info className="w-4 h-4" />
      default: return <Bell className="w-4 h-4" />
    }
  }

  // 優先度の色
  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-blue-600 bg-blue-50'
      case 'info': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  // 優先度バッジ
  const getPriorityBadge = (priority: NotificationPriority) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'warning'
      case 'low': return 'secondary'
      case 'info': return 'default'
      default: return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-6 h-6" />
            通知センター
          </h2>
          <p className="text-muted-foreground">
            研修期限、評価期限、承認待ちなどの通知を管理
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadNotifications}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            更新
          </Button>
          <Link href="/settings/notifications">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              通知設定
            </Button>
          </Link>
        </div>
      </div>

      {/* 統計カード */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">未読</p>
                  <p className="text-2xl font-bold">{stats.unread}</p>
                </div>
                <Badge variant="destructive">New</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">高優先度</p>
                  <p className="text-2xl font-bold">{stats.high}</p>
                </div>
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">研修</p>
                  <p className="text-2xl font-bold">{stats.byType.training}</p>
                </div>
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">評価</p>
                  <p className="text-2xl font-bold">{stats.byType.evaluation}</p>
                </div>
                <FileText className="w-5 h-5 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">承認</p>
                  <p className="text-2xl font-bold">{stats.byType.approval}</p>
                </div>
                <Users className="w-5 h-5 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* メインコンテンツ */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>通知一覧</CardTitle>
            <div className="flex items-center gap-2">
              {selectedNotifications.size > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkSelectedAsRead}
                  >
                    <CheckCheck className="w-4 h-4 mr-2" />
                    選択を既読
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedNotifications(new Set())}
                  >
                    選択解除
                  </Button>
                </>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    優先度
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterPriority('all')}>
                    すべて
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterPriority('high')}>
                    高優先度
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterPriority('medium')}>
                    中優先度
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterPriority('low')}>
                    低優先度
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterPriority('info')}>
                    情報
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={stats?.unread === 0}
              >
                <Check className="w-4 h-4 mr-2" />
                すべて既読
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">
                すべて
                {stats && stats.total > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {stats.total}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread">
                未読
                {stats && stats.unread > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {stats.unread}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="training">研修</TabsTrigger>
              <TabsTrigger value="evaluation">評価</TabsTrigger>
              <TabsTrigger value="approval">承認</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[500px]">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  読み込み中...
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  通知はありません
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredNotifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-4 border rounded-lg transition-colors ${
                        notification.status === 'unread' ? 'bg-blue-50/50 border-blue-200' : ''
                      } hover:bg-accent/50`}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedNotifications.has(notification.id)}
                          onCheckedChange={() => toggleSelection(notification.id)}
                        />
                        
                        <div className={`p-2 rounded-lg ${getPriorityColor(notification.priority)}`}>
                          {getTypeIcon(notification.type)}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-sm">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {notification.createdAt.toLocaleString()}
                                </span>
                                
                                {notification.dueDate && (
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    期限: {notification.dueDate.toLocaleDateString()}
                                  </span>
                                )}

                                <Badge variant={getPriorityBadge(notification.priority)}>
                                  {notification.priority === 'high' ? '高' :
                                   notification.priority === 'medium' ? '中' :
                                   notification.priority === 'low' ? '低' : '情報'}
                                </Badge>
                              </div>

                              {notification.actionUrl && (
                                <Link href={notification.actionUrl}>
                                  <Button variant="link" size="sm" className="p-0 h-auto mt-2">
                                    {notification.actionLabel || 'アクションを実行'}
                                    <ExternalLink className="w-3 h-3 ml-1" />
                                  </Button>
                                </Link>
                              )}
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {notification.status === 'unread' && (
                                  <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                                    <Check className="w-4 h-4 mr-2" />
                                    既読にする
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleArchive(notification.id)}>
                                  <Archive className="w-4 h-4 mr-2" />
                                  アーカイブ
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(notification.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  削除
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}