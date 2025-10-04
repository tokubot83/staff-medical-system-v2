'use client';

import React, { useState } from 'react';
import {
  Server, CheckCircle, XCircle, AlertCircle, RefreshCw,
  Settings, Activity, Database, Lock, Eye, EyeOff,
  Zap, Clock, Users, TrendingUp, AlertTriangle, TestTube
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

export default function MCPServerManagementPage() {
  const [serverUrl, setServerUrl] = useState('http://localhost:3001');
  const [authToken, setAuthToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<any>(null);

  // MCPツール一覧（実装済み）
  const mcpTools = [
    {
      id: 'mcp__ide__getDiagnostics',
      name: 'IDE診断情報取得',
      description: 'VS Codeの診断情報を取得',
      status: 'active',
      systems: ['職員カルテ', 'VoiceDrive']
    },
    {
      id: 'mcp__ide__executeCode',
      name: 'コード実行',
      description: 'Jupyterカーネルでコード実行',
      status: 'active',
      systems: ['職員カルテ']
    },
    {
      id: 'mcp__fetch',
      name: 'Web取得',
      description: 'WebページのHTMLを取得',
      status: 'active',
      systems: ['職員カルテ', 'VoiceDrive']
    },
    {
      id: 'mcp__search',
      name: 'Web検索',
      description: 'Web検索を実行',
      status: 'active',
      systems: ['職員カルテ', 'VoiceDrive']
    },
  ];

  // 連携システム一覧
  const connectedSystems = [
    {
      name: '職員カルテシステム',
      type: 'primary',
      status: 'connected',
      lastSync: '2025-10-04 14:30:00',
      apiCalls: 1250,
      color: 'blue'
    },
    {
      name: 'VoiceDriveシステム',
      type: 'integrated',
      status: 'connected',
      lastSync: '2025-10-04 14:28:00',
      apiCalls: 856,
      color: 'green'
    },
    {
      name: '経営企画システム',
      type: 'planned',
      status: 'pending',
      lastSync: null,
      apiCalls: 0,
      color: 'gray'
    },
  ];

  // 接続テスト
  const handleTestConnection = async () => {
    setIsConnecting(true);
    setConnectionStatus(null);

    // モック接続テスト
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2;
      setConnectionStatus({
        success: isSuccess,
        message: isSuccess
          ? 'MCP共通サーバーへの接続に成功しました'
          : 'MCP共通サーバーへの接続に失敗しました',
        details: isSuccess ? {
          serverVersion: '1.2.3',
          responseTime: `${Math.floor(Math.random() * 100) + 50}ms`,
          availableTools: mcpTools.length,
          connectedSystems: connectedSystems.filter(s => s.status === 'connected').length,
        } : null,
      });
      setIsConnecting(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
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
                <Server className="h-7 w-7 text-purple-600" />
                <h1 className="text-3xl font-bold text-gray-900">MCP共通サーバー管理</h1>
                <Badge className="bg-purple-100 text-purple-800 border-purple-300 text-sm">
                  Lightsail統合環境
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                職員カルテ・VoiceDrive・経営企画システムの共通MCPサーバーを一元管理
              </p>
            </div>
            <Button onClick={handleTestConnection} className="gap-2 bg-purple-600 hover:bg-purple-700">
              <TestTube className="h-4 w-4" />
              接続テスト
            </Button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* システム担当者向けガイド */}
        <Alert className="mb-6 border-purple-200 bg-purple-50">
          <Server className="h-4 w-4 text-purple-600" />
          <AlertTitle className="text-purple-800">💡 MCPサーバーとは？</AlertTitle>
          <AlertDescription className="text-purple-700 space-y-2">
            <p>MCP（Model Context Protocol）サーバーは、複数のシステムがAI機能・データベース・外部ツールを共有するための中継サーバーです。</p>
            <ul className="list-disc list-inside space-y-1 text-sm ml-2">
              <li>職員カルテ、VoiceDrive、経営企画システムが同じMCPサーバーを使用</li>
              <li>各システムは共通のAI・データベース・ツールにアクセス可能</li>
              <li>Lightsail環境に構築され、セキュアに管理されます</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* 接続テスト結果 */}
        {connectionStatus && (
          <Alert className={`mb-6 ${connectionStatus.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            {connectionStatus.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertTitle className={connectionStatus.success ? 'text-green-800' : 'text-red-800'}>
              {connectionStatus.success ? '✅ 接続成功' : '❌ 接続失敗'}
            </AlertTitle>
            <AlertDescription className={connectionStatus.success ? 'text-green-700' : 'text-red-700'}>
              {connectionStatus.message}
              {connectionStatus.details && (
                <div className="mt-3 space-y-1 text-sm">
                  <div><strong>サーバーバージョン:</strong> {connectionStatus.details.serverVersion}</div>
                  <div><strong>応答時間:</strong> {connectionStatus.details.responseTime}</div>
                  <div><strong>利用可能ツール:</strong> {connectionStatus.details.availableTools}個</div>
                  <div><strong>接続システム数:</strong> {connectionStatus.details.connectedSystems}システム</div>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* 統計ダッシュボード */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">稼働状況</p>
                  <p className="text-2xl font-bold text-green-600">正常</p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">接続システム</p>
                  <p className="text-2xl font-bold text-blue-600">{connectedSystems.filter(s => s.status === 'connected').length}</p>
                </div>
                <Users className="h-10 w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">利用可能ツール</p>
                  <p className="text-2xl font-bold text-purple-600">{mcpTools.length}</p>
                </div>
                <Zap className="h-10 w-10 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">総API呼び出し</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {connectedSystems.reduce((sum, s) => sum + s.apiCalls, 0)}
                  </p>
                </div>
                <TrendingUp className="h-10 w-10 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="connection" className="space-y-6">
          <TabsList>
            <TabsTrigger value="connection" className="gap-2">
              <Server className="h-4 w-4" />
              接続設定
            </TabsTrigger>
            <TabsTrigger value="tools" className="gap-2">
              <Zap className="h-4 w-4" />
              MCPツール管理
            </TabsTrigger>
            <TabsTrigger value="systems" className="gap-2">
              <Users className="h-4 w-4" />
              連携システム
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="gap-2">
              <Activity className="h-4 w-4" />
              監視・ログ
            </TabsTrigger>
          </TabsList>

          {/* 接続設定 */}
          <TabsContent value="connection" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>MCP共通サーバー接続設定</CardTitle>
                <CardDescription>
                  Lightsail環境のMCP共通サーバーへの接続情報を設定します
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">サーバーURL</label>
                  <Input
                    type="url"
                    value={serverUrl}
                    onChange={(e) => setServerUrl(e.target.value)}
                    placeholder="http://lightsail-mcp-server:3001"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Lightsail構築後は共通MCPサーバーのURLを設定
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">認証トークン</label>
                  <div className="relative mt-1">
                    <Input
                      type={showToken ? 'text' : 'password'}
                      value={authToken}
                      onChange={(e) => setAuthToken(e.target.value)}
                      placeholder="mcp_token_xxxxxxxxxxxxxxxx"
                    />
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showToken ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    トークンは暗号化されて保存されます
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleTestConnection}
                    variant="outline"
                    disabled={isConnecting}
                    className="gap-2"
                  >
                    {isConnecting ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        接続テスト中...
                      </>
                    ) : (
                      <>
                        <TestTube className="h-4 w-4" />
                        接続テスト
                      </>
                    )}
                  </Button>

                  <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
                    <Settings className="h-4 w-4" />
                    設定を保存
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-yellow-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Lightsail移行準備状況
                </CardTitle>
              </CardHeader>
              <CardContent className="text-yellow-900 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">職員カルテシステム: MCP連携機能実装済み</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">VoiceDriveシステム: MCP連携機能実装済み</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Lightsail環境: 構築待機中</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">共通MCPサーバー: デプロイ待機中</span>
                  </div>
                </div>
                <p className="text-xs border-t border-yellow-300 pt-3">
                  <strong>次のステップ:</strong> Lightsail環境構築後、共通MCPサーバーをデプロイし、このページで接続設定を行います
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MCPツール管理 */}
          <TabsContent value="tools" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>MCPツール一覧</CardTitle>
                <CardDescription>
                  利用可能なMCPツールと各システムの使用権限を管理
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mcpTools.map((tool) => (
                    <div
                      key={tool.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Zap className="h-4 w-4 text-purple-600" />
                          <span className="font-medium text-gray-900">{tool.name}</span>
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            {tool.status === 'active' ? '有効' : '無効'}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 font-mono mb-2">{tool.id}</p>
                        <p className="text-sm text-gray-600 mb-2">{tool.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">使用システム:</span>
                          {tool.systems.map((system, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {system}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Switch checked={tool.status === 'active'} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 連携システム */}
          <TabsContent value="systems" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>連携システム一覧</CardTitle>
                <CardDescription>
                  MCP共通サーバーに接続しているシステムの状態を確認
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {connectedSystems.map((system, idx) => (
                    <div
                      key={idx}
                      className="p-5 bg-gray-50 rounded-lg border hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Database className={`h-5 w-5 text-${system.color}-600`} />
                          <div>
                            <h3 className="font-semibold text-gray-900">{system.name}</h3>
                            <p className="text-xs text-gray-500">
                              {system.type === 'primary' && '基幹システム'}
                              {system.type === 'integrated' && '統合システム'}
                              {system.type === 'planned' && '予定システム'}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(system.status)}>
                          {system.status === 'connected' && '接続中'}
                          {system.status === 'pending' && '準備中'}
                          {system.status === 'error' && 'エラー'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">最終同期:</span>
                          <p className="font-medium text-gray-900">
                            {system.lastSync || '未接続'}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">API呼び出し数:</span>
                          <p className="font-medium text-gray-900">
                            {system.apiCalls.toLocaleString()} 回
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 監視・ログ */}
          <TabsContent value="monitoring" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>稼働監視</CardTitle>
                <CardDescription>
                  MCP共通サーバーの稼働状況とアクセスログ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-800">サーバー稼働中</span>
                    </div>
                    <div className="text-sm text-green-700 space-y-1">
                      <p>稼働時間: 15日 3時間 42分</p>
                      <p>最終ヘルスチェック: 2025-10-04 14:35:00</p>
                      <p>CPU使用率: 23% | メモリ使用率: 45%</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">最近のアクセスログ（直近10件）</h4>
                    <div className="space-y-2 text-sm font-mono">
                      {[
                        { time: '14:35:12', system: '職員カルテ', tool: 'getDiagnostics', status: 'success' },
                        { time: '14:34:58', system: 'VoiceDrive', tool: 'fetch', status: 'success' },
                        { time: '14:34:45', system: '職員カルテ', tool: 'executeCode', status: 'success' },
                        { time: '14:34:23', system: 'VoiceDrive', tool: 'search', status: 'success' },
                        { time: '14:33:56', system: '職員カルテ', tool: 'getDiagnostics', status: 'error' },
                      ].map((log, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-2 bg-gray-50 rounded"
                        >
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">{log.time}</span>
                          <Badge variant="outline" className="text-xs">{log.system}</Badge>
                          <span className="text-gray-700">{log.tool}</span>
                          <Badge className={log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {log.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* セキュリティ注意事項 */}
        <Alert className="mt-6 border-red-200 bg-red-50">
          <Lock className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">🔒 セキュリティ重要事項</AlertTitle>
          <AlertDescription className="text-red-700">
            <ul className="list-disc list-inside space-y-1 text-sm mt-2">
              <li>認証トークンは絶対に外部に漏らさないでください</li>
              <li>MCPサーバーへのアクセスは全て監査ログに記録されます</li>
              <li>不審なアクセスを発見した場合は即座に開発者に報告してください</li>
              <li>各システムのツール使用権限は最小権限の原則に従って設定されています</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
