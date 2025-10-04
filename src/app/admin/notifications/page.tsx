'use client';

import React, { useState } from 'react';
import {
  Bell, Mail, MessageSquare, AlertTriangle, CheckCircle,
  Settings, Volume2, Clock, Users, Database, Server,
  Activity, Shield, RefreshCw, Send, Eye, TestTube
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

export default function NotificationsPage() {
  // 通知チャンネル設定
  const [channels, setChannels] = useState({
    email: { enabled: true, address: 'admin@example.com' },
    slack: { enabled: false, webhookUrl: '' },
    teams: { enabled: false, webhookUrl: '' },
    voicedrive: { enabled: true, endpoint: 'https://voicedrive-api.example.com/notifications' }
  });

  // アラートルール
  const alertRules = [
    {
      id: 'db_connection_error',
      name: 'DB接続エラー',
      category: 'database',
      severity: 'critical',
      enabled: true,
      condition: 'データベースへの接続が失敗した時',
      channels: ['email', 'voicedrive'],
      cooldown: 5
    },
    {
      id: 'api_error_rate',
      name: 'API異常エラー率',
      category: 'api',
      severity: 'high',
      enabled: true,
      condition: 'APIエラー率が10%を超えた時',
      channels: ['email'],
      cooldown: 15
    },
    {
      id: 'mcp_connection_lost',
      name: 'MCP接続切断',
      category: 'mcp',
      severity: 'high',
      enabled: true,
      condition: 'MCP共通サーバーへの接続が切断された時',
      channels: ['email', 'voicedrive'],
      cooldown: 5
    },
    {
      id: 'disk_space_warning',
      name: 'ディスク容量警告',
      category: 'system',
      severity: 'medium',
      enabled: true,
      condition: 'ディスク使用率が80%を超えた時',
      channels: ['email'],
      cooldown: 60
    },
    {
      id: 'backup_failed',
      name: 'バックアップ失敗',
      category: 'backup',
      severity: 'high',
      enabled: true,
      condition: '自動バックアップが失敗した時',
      channels: ['email', 'voicedrive'],
      cooldown: 0
    },
    {
      id: 'sync_failure',
      name: 'データ同期失敗',
      category: 'integration',
      severity: 'medium',
      enabled: true,
      condition: '外部システムとのデータ同期が失敗した時',
      channels: ['email'],
      cooldown: 30
    },
  ];

  // 通知履歴
  const notificationHistory = [
    {
      id: 'notif_001',
      timestamp: '2025-10-04 14:35:00',
      rule: 'DB接続エラー',
      severity: 'critical',
      message: 'Lightsail共通DBへの接続が失敗しました',
      status: 'sent',
      channels: ['email', 'voicedrive']
    },
    {
      id: 'notif_002',
      timestamp: '2025-10-04 12:20:00',
      rule: 'ディスク容量警告',
      severity: 'medium',
      message: 'ディスク使用率が82%に達しました',
      status: 'sent',
      channels: ['email']
    },
    {
      id: 'notif_003',
      timestamp: '2025-10-03 23:15:00',
      rule: 'データ同期失敗',
      severity: 'medium',
      message: 'VoiceDriveとの職員情報同期に失敗しました',
      status: 'sent',
      channels: ['email']
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'database':
        return Database;
      case 'api':
        return Activity;
      case 'mcp':
        return Server;
      case 'system':
        return Settings;
      case 'backup':
        return Shield;
      case 'integration':
        return RefreshCw;
      default:
        return Bell;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ページヘッダー */}
      <div className="bg-white border-b">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Bell className="h-7 w-7 text-amber-600" />
                <h1 className="text-3xl font-bold text-gray-900">通知・アラート設定</h1>
                <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-sm">
                  運用監視
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                システム障害・エラーの通知設定と履歴管理
              </p>
            </div>
            <Button className="gap-2 bg-amber-600 hover:bg-amber-700">
              <TestTube className="h-4 w-4" />
              テスト通知送信
            </Button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* システム担当者向けガイド */}
        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <Bell className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">💡 通知・アラートとは？</AlertTitle>
          <AlertDescription className="text-amber-700 space-y-2">
            <p>システムに異常が発生した時、自動的に担当者へ通知を送信します。</p>
            <ul className="list-disc list-inside space-y-1 text-sm ml-2">
              <li>DB接続エラー、API障害、MCP切断などを即座に検知</li>
              <li>メール、Slack、VoiceDrive内通知など複数チャンネルに対応</li>
              <li>重大度に応じて通知方法を自動選択</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* 統計ダッシュボード */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">有効なルール</p>
                  <p className="text-2xl font-bold text-green-600">
                    {alertRules.filter(r => r.enabled).length}/{alertRules.length}
                  </p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">24時間の通知</p>
                  <p className="text-2xl font-bold text-orange-600">3</p>
                </div>
                <Bell className="h-10 w-10 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">通知チャンネル</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {Object.values(channels).filter(c => c.enabled).length}
                  </p>
                </div>
                <Send className="h-10 w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">重大なアラート</p>
                  <p className="text-2xl font-bold text-red-600">1</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="channels" className="space-y-6">
          <TabsList>
            <TabsTrigger value="channels" className="gap-2">
              <Send className="h-4 w-4" />
              通知チャンネル
            </TabsTrigger>
            <TabsTrigger value="rules" className="gap-2">
              <Settings className="h-4 w-4" />
              アラートルール
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Clock className="h-4 w-4" />
              通知履歴
            </TabsTrigger>
          </TabsList>

          {/* 通知チャンネル */}
          <TabsContent value="channels" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>メール通知</CardTitle>
                <CardDescription>
                  システムアラートをメールで受信
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">メール通知</p>
                      <p className="text-sm text-gray-500">重要なアラートをメールで即座に通知</p>
                    </div>
                  </div>
                  <Switch
                    checked={channels.email.enabled}
                    onCheckedChange={(checked) =>
                      setChannels({ ...channels, email: { ...channels.email, enabled: checked } })
                    }
                  />
                </div>

                {channels.email.enabled && (
                  <div>
                    <label className="text-sm font-medium">送信先メールアドレス</label>
                    <Input
                      type="email"
                      value={channels.email.address}
                      onChange={(e) =>
                        setChannels({ ...channels, email: { ...channels.email, address: e.target.value } })
                      }
                      placeholder="admin@example.com"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      複数のアドレスを設定する場合はカンマ区切りで入力
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Slack通知</CardTitle>
                <CardDescription>
                  Slackチャンネルに通知を送信
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">Slack通知</p>
                      <p className="text-sm text-gray-500">Slackワークスペースのチャンネルに通知</p>
                    </div>
                  </div>
                  <Switch
                    checked={channels.slack.enabled}
                    onCheckedChange={(checked) =>
                      setChannels({ ...channels, slack: { ...channels.slack, enabled: checked } })
                    }
                  />
                </div>

                {channels.slack.enabled && (
                  <div>
                    <label className="text-sm font-medium">Incoming Webhook URL</label>
                    <Input
                      type="url"
                      value={channels.slack.webhookUrl}
                      onChange={(e) =>
                        setChannels({ ...channels, slack: { ...channels.slack, webhookUrl: e.target.value } })
                      }
                      placeholder="https://hooks.slack.com/services/..."
                      className="mt-1"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>VoiceDrive内通知</CardTitle>
                <CardDescription>
                  VoiceDriveシステム内の通知センターに送信
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Volume2 className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">VoiceDrive通知</p>
                      <p className="text-sm text-gray-500">管理者のVoiceDriveアプリに通知</p>
                    </div>
                  </div>
                  <Switch
                    checked={channels.voicedrive.enabled}
                    onCheckedChange={(checked) =>
                      setChannels({ ...channels, voicedrive: { ...channels.voicedrive, enabled: checked } })
                    }
                  />
                </div>

                {channels.voicedrive.enabled && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      ✅ VoiceDriveシステムと連携済み
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      エンドポイント: {channels.voicedrive.endpoint}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* アラートルール */}
          <TabsContent value="rules" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>アラートルール一覧</CardTitle>
                <CardDescription>
                  システム監視ルールと通知条件の設定
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alertRules.map((rule) => {
                    const Icon = getCategoryIcon(rule.category);
                    return (
                      <div key={rule.id} className="p-4 bg-gray-50 rounded-lg border hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5 text-gray-600" />
                            <div>
                              <h4 className="font-semibold text-gray-900">{rule.name}</h4>
                              <p className="text-xs text-gray-500">{rule.condition}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={getSeverityColor(rule.severity)}>
                              {rule.severity === 'critical' && '緊急'}
                              {rule.severity === 'high' && '高'}
                              {rule.severity === 'medium' && '中'}
                              {rule.severity === 'low' && '低'}
                            </Badge>
                            <Switch checked={rule.enabled} />
                          </div>
                        </div>

                        <div className="ml-8 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">通知先:</span>
                            {rule.channels.map((channel, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {channel === 'email' && 'メール'}
                                {channel === 'slack' && 'Slack'}
                                {channel === 'voicedrive' && 'VoiceDrive'}
                              </Badge>
                            ))}
                          </div>
                          {rule.cooldown > 0 && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="h-3 w-3" />
                              <span>通知間隔: {rule.cooldown}分</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800">アラートルールの説明</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-900 space-y-2 text-sm">
                <p><strong>重大度について:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong className="text-red-700">緊急:</strong> 即座に対応が必要（DB接続エラー等）</li>
                  <li><strong className="text-orange-700">高:</strong> 早急な対応が必要（API障害等）</li>
                  <li><strong className="text-yellow-700">中:</strong> 確認・対応が必要（容量警告等）</li>
                  <li><strong>低:</strong> 情報として通知（軽微な問題）</li>
                </ul>
                <p className="pt-2"><strong>通知間隔:</strong> 同じアラートが連続で発生した場合、指定時間内は通知を抑制します</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 通知履歴 */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>通知履歴</CardTitle>
                <CardDescription>
                  過去に送信された通知の履歴（直近100件）
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {notificationHistory.map((notif) => (
                    <div key={notif.id} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="font-mono text-sm text-gray-900">{notif.timestamp}</span>
                          <Badge className={getSeverityColor(notif.severity)}>
                            {notif.severity === 'critical' && '緊急'}
                            {notif.severity === 'high' && '高'}
                            {notif.severity === 'medium' && '中'}
                          </Badge>
                          <Badge variant="outline">{notif.rule}</Badge>
                        </div>
                        <Badge className="bg-green-100 text-green-800">送信済み</Badge>
                      </div>

                      <p className="text-sm text-gray-700 mb-2 ml-7">{notif.message}</p>

                      <div className="flex items-center gap-2 ml-7">
                        <span className="text-xs text-gray-500">送信先:</span>
                        {notif.channels.map((channel, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {channel === 'email' && 'メール'}
                            {channel === 'voicedrive' && 'VoiceDrive'}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* セキュリティ注意事項 */}
        <Alert className="mt-6 border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">⚠️ 重要な注意事項</AlertTitle>
          <AlertDescription className="text-amber-700">
            <ul className="list-disc list-inside space-y-1 text-sm mt-2">
              <li>緊急アラートは必ずメールまたはVoiceDrive通知を有効にしてください</li>
              <li>通知先のメールアドレス・Webhook URLは定期的に確認してください</li>
              <li>通知が届かない場合は、迷惑メールフォルダやSlack設定を確認してください</li>
              <li>重要なアラートを無効にする場合は、代替の監視手段を用意してください</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
