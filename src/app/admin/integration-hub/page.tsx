'use client';

import React, { useState } from 'react';
import {
  Link2, CheckCircle, XCircle, AlertCircle, RefreshCw,
  Key, Shield, Clock, Send, Database, ArrowRightLeft,
  Activity, TrendingUp, Users, FileText, Copy, Eye, EyeOff
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
import { Textarea } from '@/components/ui/textarea';

export default function IntegrationHubPage() {
  const [showApiKey, setShowApiKey] = useState<{ [key: string]: boolean }>({});

  // 連携システム一覧
  const integratedSystems = [
    {
      id: 'voicedrive',
      name: 'VoiceDriveシステム',
      description: '職員向け評価・面談・コンプライアンス統合システム',
      status: 'connected',
      endpoint: 'https://voicedrive-api.example.com',
      apiKey: 'vd_live_xxxxxxxxxxxxxxxx',
      lastSync: '2025-10-04 14:30:00',
      syncedData: ['職員情報', '評価データ', '面談記録', 'コンプライアンス通報'],
      monthlyRequests: 15420,
      errorRate: 0.2,
      color: 'green'
    },
    {
      id: 'keiei',
      name: '経営企画システム',
      description: '資格管理・経営分析システム',
      status: 'pending',
      endpoint: 'https://keiei-api.example.com',
      apiKey: null,
      lastSync: null,
      syncedData: ['資格情報', '経営指標'],
      monthlyRequests: 0,
      errorRate: 0,
      color: 'yellow'
    },
    {
      id: 'kintai',
      name: '勤怠管理システム',
      description: '出退勤・シフト管理システム',
      status: 'planned',
      endpoint: null,
      apiKey: null,
      lastSync: null,
      syncedData: ['出退勤データ', 'シフト情報'],
      monthlyRequests: 0,
      errorRate: 0,
      color: 'gray'
    }
  ];

  // 同期履歴
  const syncHistory = [
    { time: '2025-10-04 14:30:00', system: 'VoiceDrive', type: '職員情報', records: 750, status: 'success' },
    { time: '2025-10-04 14:15:00', system: 'VoiceDrive', type: '評価データ', records: 124, status: 'success' },
    { time: '2025-10-04 14:00:00', system: 'VoiceDrive', type: 'コンプライアンス通報', records: 3, status: 'success' },
    { time: '2025-10-04 13:45:00', system: 'VoiceDrive', type: '面談記録', records: 89, status: 'success' },
    { time: '2025-10-04 13:30:00', system: 'VoiceDrive', type: '職員情報', records: 750, status: 'error' },
  ];

  // Webhook設定
  const webhookEvents = [
    { event: 'staff.created', description: '職員が新規登録された時', enabled: true, systems: ['VoiceDrive'] },
    { event: 'staff.updated', description: '職員情報が更新された時', enabled: true, systems: ['VoiceDrive', '経営企画'] },
    { event: 'evaluation.completed', description: '評価が完了した時', enabled: true, systems: ['VoiceDrive'] },
    { event: 'interview.scheduled', description: '面談が予約された時', enabled: true, systems: ['VoiceDrive'] },
    { event: 'compliance.reported', description: 'コンプライアンス通報があった時', enabled: true, systems: ['VoiceDrive'] },
    { event: 'health.checkup', description: '健診データが登録された時', enabled: false, systems: [] },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'planned':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'connected':
        return '接続中';
      case 'pending':
        return '設定待ち';
      case 'error':
        return 'エラー';
      case 'planned':
        return '計画中';
      default:
        return '不明';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('クリップボードにコピーしました');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ページヘッダー */}
      <div className="bg-white border-b">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <ArrowRightLeft className="h-7 w-7 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">システム連携ハブ</h1>
                <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-sm">
                  基幹システム
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                職員カルテシステムと連携する全システムを一元管理
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* システム担当者向けガイド */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Link2 className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">💡 システム連携ハブとは？</AlertTitle>
          <AlertDescription className="text-blue-700 space-y-2">
            <p>職員カルテシステムは基幹システムとして、他の全システムとデータ連携を行います。</p>
            <ul className="list-disc list-inside space-y-1 text-sm ml-2">
              <li>職員情報、評価データ、健康情報などを他システムと共有</li>
              <li>APIキー、Webhook、データ同期設定を一元管理</li>
              <li>連携エラーやデータ不整合を早期発見</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* 統計ダッシュボード */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">接続システム</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {integratedSystems.filter(s => s.status === 'connected').length}/
                    {integratedSystems.length}
                  </p>
                </div>
                <Link2 className="h-10 w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">月間API呼び出し</p>
                  <p className="text-2xl font-bold text-green-600">
                    {integratedSystems.reduce((sum, s) => sum + s.monthlyRequests, 0).toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-10 w-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">同期データ種類</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {Array.from(new Set(integratedSystems.flatMap(s => s.syncedData))).length}
                  </p>
                </div>
                <Database className="h-10 w-10 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">平均エラー率</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {(integratedSystems.reduce((sum, s) => sum + s.errorRate, 0) / integratedSystems.filter(s => s.status === 'connected').length || 0).toFixed(1)}%
                  </p>
                </div>
                <Activity className="h-10 w-10 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="systems" className="space-y-6">
          <TabsList>
            <TabsTrigger value="systems" className="gap-2">
              <Users className="h-4 w-4" />
              連携システム
            </TabsTrigger>
            <TabsTrigger value="api-keys" className="gap-2">
              <Key className="h-4 w-4" />
              APIキー管理
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="gap-2">
              <Send className="h-4 w-4" />
              Webhook設定
            </TabsTrigger>
            <TabsTrigger value="sync" className="gap-2">
              <Database className="h-4 w-4" />
              データ同期
            </TabsTrigger>
          </TabsList>

          {/* 連携システム */}
          <TabsContent value="systems" className="space-y-4">
            {integratedSystems.map((system) => (
              <Card key={system.id} className="border-l-4" style={{ borderLeftColor: `var(--${system.color}-500)` }}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{system.name}</CardTitle>
                        <Badge className={getStatusColor(system.status)}>
                          {getStatusLabel(system.status)}
                        </Badge>
                      </div>
                      <CardDescription>{system.description}</CardDescription>
                    </div>
                    {system.status === 'connected' && (
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    )}
                    {system.status === 'pending' && (
                      <AlertCircle className="h-8 w-8 text-yellow-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">エンドポイント</span>
                        <p className="font-mono text-sm text-gray-900">
                          {system.endpoint || '未設定'}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">最終同期</span>
                        <p className="text-sm text-gray-900 flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          {system.lastSync || '未同期'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">同期データ</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {system.syncedData.map((data, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {data}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-sm text-gray-500">月間リクエスト</span>
                          <p className="text-sm font-semibold text-gray-900">
                            {system.monthlyRequests.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">エラー率</span>
                          <p className="text-sm font-semibold text-gray-900">
                            {system.errorRate}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {system.status === 'connected' && (
                    <div className="mt-4 pt-4 border-t flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <RefreshCw className="h-3 w-3" />
                        手動同期
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Activity className="h-3 w-3" />
                        接続テスト
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <FileText className="h-3 w-3" />
                        ログ確認
                      </Button>
                    </div>
                  )}

                  {system.status === 'pending' && (
                    <div className="mt-4 pt-4 border-t">
                      <Button className="gap-2 bg-yellow-600 hover:bg-yellow-700">
                        <Key className="h-4 w-4" />
                        APIキーを設定
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* APIキー管理 */}
          <TabsContent value="api-keys" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>APIキー管理</CardTitle>
                <CardDescription>
                  各システムとの認証に使用するAPIキーを管理
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {integratedSystems.map((system) => (
                    <div key={system.id} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{system.name}</h4>
                        {system.apiKey && (
                          <Badge className="bg-green-100 text-green-800">設定済み</Badge>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">APIキー</label>
                          <div className="flex gap-2 mt-1">
                            <div className="relative flex-1">
                              <Input
                                type={showApiKey[system.id] ? 'text' : 'password'}
                                value={system.apiKey || ''}
                                readOnly
                                className="pr-20"
                              />
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => setShowApiKey({ ...showApiKey, [system.id]: !showApiKey[system.id] })}
                                  className="p-1 hover:bg-gray-200 rounded"
                                >
                                  {showApiKey[system.id] ? (
                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-gray-400" />
                                  )}
                                </button>
                                {system.apiKey && (
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard(system.apiKey!)}
                                    className="p-1 hover:bg-gray-200 rounded"
                                  >
                                    <Copy className="h-4 w-4 text-gray-400" />
                                  </button>
                                )}
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              再生成
                            </Button>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium">HMAC署名キー</label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              type="password"
                              value={system.apiKey ? 'hmac_secret_xxxxxxxxxxxxx' : ''}
                              readOnly
                            />
                            <Button variant="outline" size="sm">
                              表示
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Alert className="border-yellow-200 bg-yellow-50">
              <Shield className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800">⚠️ セキュリティ注意</AlertTitle>
              <AlertDescription className="text-yellow-700 text-sm">
                APIキーは絶対に外部に公開しないでください。再生成すると既存の連携が切断されるため、事前に連携先システムに通知が必要です。
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Webhook設定 */}
          <TabsContent value="webhooks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Webhook設定</CardTitle>
                <CardDescription>
                  システムイベント発生時に他システムへ通知を送信
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {webhookEvents.map((webhook, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Send className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-gray-900">{webhook.description}</span>
                          <Badge variant="outline" className="text-xs font-mono">
                            {webhook.event}
                          </Badge>
                        </div>
                        {webhook.systems.length > 0 && (
                          <div className="flex items-center gap-2 ml-7">
                            <span className="text-xs text-gray-500">送信先:</span>
                            {webhook.systems.map((system, sidx) => (
                              <Badge key={sidx} variant="outline" className="text-xs">
                                {system}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={webhook.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {webhook.enabled ? '有効' : '無効'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          設定
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Webhookペイロード例</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={JSON.stringify({
                    event: "staff.created",
                    timestamp: "2025-10-04T14:30:00Z",
                    data: {
                      staffId: "S001",
                      name: "山田 太郎",
                      department: "看護部",
                      position: "看護師"
                    },
                    signature: "hmac_sha256_xxxxxxxxxx"
                  }, null, 2)}
                  readOnly
                  className="font-mono text-xs"
                  rows={12}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* データ同期 */}
          <TabsContent value="sync" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>データ同期設定</CardTitle>
                <CardDescription>
                  各システムとのデータ同期頻度と対象データを設定
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">リアルタイム同期（即時）</h4>
                    <div className="space-y-1 text-sm text-blue-800">
                      <p>• 職員情報の新規登録・更新</p>
                      <p>• 評価データの完了</p>
                      <p>• コンプライアンス通報</p>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-900 mb-2">バッチ同期（15分ごと）</h4>
                    <div className="space-y-1 text-sm text-green-800">
                      <p>• 面談記録</p>
                      <p>• 研修受講履歴</p>
                      <p>• 健康診断データ</p>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-900 mb-2">日次同期（毎日深夜2時）</h4>
                    <div className="space-y-1 text-sm text-purple-800">
                      <p>• 勤怠データ（計画中）</p>
                      <p>• 資格情報（計画中）</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>同期履歴</CardTitle>
                <CardDescription>最近の同期実行履歴（直近20件）</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {syncHistory.map((log, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                      <div className="flex items-center gap-4">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 font-mono">{log.time}</span>
                        <Badge variant="outline">{log.system}</Badge>
                        <span className="text-gray-700">{log.type}</span>
                        <span className="text-gray-500">{log.records.toLocaleString()}件</span>
                      </div>
                      <Badge className={log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {log.status === 'success' ? '成功' : '失敗'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
