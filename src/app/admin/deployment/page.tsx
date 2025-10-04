'use client';

import React, { useState } from 'react';
import {
  Cloud, CheckCircle, AlertCircle, GitBranch, Upload,
  Server, Database, Lock, Eye, EyeOff, RefreshCw,
  Clock, FileText, ArrowRight, Zap, AlertTriangle, Copy
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

export default function DeploymentPage() {
  const [showEnvVars, setShowEnvVars] = useState<{ [key: string]: boolean }>({});

  // 環境一覧
  const environments = [
    {
      name: '開発環境',
      type: 'development',
      status: 'active',
      url: 'http://localhost:3000',
      server: 'ローカルPC',
      database: 'localhost:5432/staff_dev',
      version: 'v1.2.3-dev',
      lastDeploy: '2025-10-04 14:30:00',
      deployer: '開発チーム',
      color: 'blue'
    },
    {
      name: 'ステージング環境',
      type: 'staging',
      status: 'inactive',
      url: 'https://staging-staff.example.com',
      server: '未設定',
      database: '未設定',
      version: null,
      lastDeploy: null,
      deployer: null,
      color: 'yellow'
    },
    {
      name: '本番環境（Lightsail）',
      type: 'production',
      status: 'pending',
      url: 'https://staff.example.com',
      server: 'AWS Lightsail（準備中）',
      database: 'Lightsail MySQL（準備中）',
      version: null,
      lastDeploy: null,
      deployer: null,
      color: 'green'
    }
  ];

  // 環境変数
  const envVariables = {
    development: [
      { key: 'DATABASE_URL', value: 'postgresql://localhost:5432/staff_dev', sensitive: true },
      { key: 'NEXT_PUBLIC_API_URL', value: 'http://localhost:3000/api', sensitive: false },
      { key: 'MCP_SERVER_URL', value: 'http://localhost:3001', sensitive: false },
      { key: 'JWT_SECRET', value: 'dev_secret_key_xxxxxxxxxxxxx', sensitive: true },
    ],
    staging: [
      { key: 'DATABASE_URL', value: '未設定', sensitive: true },
      { key: 'NEXT_PUBLIC_API_URL', value: '未設定', sensitive: false },
      { key: 'MCP_SERVER_URL', value: '未設定', sensitive: false },
      { key: 'JWT_SECRET', value: '未設定', sensitive: true },
    ],
    production: [
      { key: 'DATABASE_URL', value: 'mysql://lightsail-db:3306/staff_prod', sensitive: true },
      { key: 'NEXT_PUBLIC_API_URL', value: 'https://staff.example.com/api', sensitive: false },
      { key: 'MCP_SERVER_URL', value: 'http://lightsail-mcp:3001', sensitive: false },
      { key: 'JWT_SECRET', value: 'prod_secret_key_xxxxxxxxxxxxx', sensitive: true },
      { key: 'VOICEDRIVE_API_KEY', value: 'vd_prod_xxxxxxxxxxxxxxxx', sensitive: true },
    ]
  };

  // デプロイ履歴
  const deployHistory = [
    {
      version: 'v1.2.3',
      environment: '開発環境',
      status: 'success',
      deployedAt: '2025-10-04 14:30:00',
      deployedBy: '山田開発者',
      changes: ['Phase3完了', 'キャリアコース機能追加', 'バグ修正5件'],
      duration: '2分34秒'
    },
    {
      version: 'v1.2.2',
      environment: '開発環境',
      status: 'success',
      deployedAt: '2025-10-03 16:15:00',
      deployedBy: '山田開発者',
      changes: ['健康管理機能拡張', 'UI改善'],
      duration: '1分58秒'
    },
    {
      version: 'v1.2.1',
      environment: '開発環境',
      status: 'failed',
      deployedAt: '2025-10-02 10:22:00',
      deployedBy: '山田開発者',
      changes: ['テスト実装'],
      duration: '45秒'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
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
                <Cloud className="h-7 w-7 text-indigo-600" />
                <h1 className="text-3xl font-bold text-gray-900">環境・デプロイ管理</h1>
                <Badge className="bg-indigo-100 text-indigo-800 border-indigo-300 text-sm">
                  Lightsail移行準備
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                開発・ステージング・本番環境の設定とデプロイ履歴を管理
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Lightsail移行準備ガイド */}
        <Alert className="mb-6 border-indigo-200 bg-indigo-50">
          <Cloud className="h-4 w-4 text-indigo-600" />
          <AlertTitle className="text-indigo-800">💡 Lightsail移行について</AlertTitle>
          <AlertDescription className="text-indigo-700 space-y-2">
            <p>現在、AWS Lightsail環境への移行準備中です。以下の順序で進行します：</p>
            <ol className="list-decimal list-inside space-y-1 text-sm ml-2">
              <li>Lightsailインスタンス作成・設定</li>
              <li>共通DB（MySQL）セットアップ</li>
              <li>共通MCPサーバーデプロイ</li>
              <li>ステージング環境で統合テスト</li>
              <li>本番環境デプロイ</li>
            </ol>
          </AlertDescription>
        </Alert>

        {/* 環境概要 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {environments.map((env) => (
            <Card key={env.type} className="border-l-4" style={{ borderLeftColor: `var(--${env.color}-500)` }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{env.name}</CardTitle>
                  <Badge className={getStatusColor(env.status)}>
                    {env.status === 'active' && '稼働中'}
                    {env.status === 'pending' && '準備中'}
                    {env.status === 'inactive' && '停止中'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">URL:</span>
                  <p className="font-mono text-xs break-all">{env.url}</p>
                </div>
                <div>
                  <span className="text-gray-500">サーバー:</span>
                  <p className="text-gray-900">{env.server}</p>
                </div>
                <div>
                  <span className="text-gray-500">バージョン:</span>
                  <p className="text-gray-900">{env.version || '未デプロイ'}</p>
                </div>
                {env.lastDeploy && (
                  <div>
                    <span className="text-gray-500">最終デプロイ:</span>
                    <p className="text-gray-900 text-xs">{env.lastDeploy}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="environments" className="space-y-6">
          <TabsList>
            <TabsTrigger value="environments" className="gap-2">
              <Server className="h-4 w-4" />
              環境設定
            </TabsTrigger>
            <TabsTrigger value="env-vars" className="gap-2">
              <Lock className="h-4 w-4" />
              環境変数
            </TabsTrigger>
            <TabsTrigger value="deploy" className="gap-2">
              <Upload className="h-4 w-4" />
              デプロイ
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Clock className="h-4 w-4" />
              履歴
            </TabsTrigger>
          </TabsList>

          {/* 環境設定 */}
          <TabsContent value="environments" className="space-y-4">
            {environments.map((env) => (
              <Card key={env.type}>
                <CardHeader>
                  <CardTitle>{env.name}の設定</CardTitle>
                  <CardDescription>
                    {env.type === 'development' && 'ローカル開発環境の設定'}
                    {env.type === 'staging' && 'ステージング環境の設定（テスト用）'}
                    {env.type === 'production' && 'Lightsail本番環境の設定'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">アプリケーションURL</label>
                      <Input value={env.url} readOnly className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">サーバー</label>
                      <Input value={env.server} readOnly className="mt-1" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">データベース接続</label>
                    <Input value={env.database} readOnly className="mt-1" />
                  </div>

                  {env.type === 'production' && (
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <AlertTitle className="text-yellow-800">Lightsail構築待機中</AlertTitle>
                      <AlertDescription className="text-yellow-700 text-sm">
                        <div className="space-y-2 mt-2">
                          <p>以下の設定が完了次第、本番デプロイが可能になります：</p>
                          <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Lightsailインスタンス作成</li>
                            <li>MySQL共通データベース構築</li>
                            <li>共通MCPサーバー配置</li>
                            <li>SSL証明書設定</li>
                            <li>ドメイン設定</li>
                          </ul>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {env.status === 'active' && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <RefreshCw className="h-3 w-3" />
                        再起動
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <FileText className="h-3 w-3" />
                        ログ確認
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* 環境変数 */}
          <TabsContent value="env-vars" className="space-y-4">
            {Object.entries(envVariables).map(([envType, vars]) => {
              const env = environments.find(e => e.type === envType);
              return (
                <Card key={envType}>
                  <CardHeader>
                    <CardTitle>{env?.name} - 環境変数</CardTitle>
                    <CardDescription>
                      この環境で使用される環境変数の設定
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {vars.map((envVar, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-semibold text-gray-900">
                                {envVar.key}
                              </span>
                              {envVar.sensitive && (
                                <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                                  機密
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setShowEnvVars({ ...showEnvVars, [`${envType}-${idx}`]: !showEnvVars[`${envType}-${idx}`] })}
                                className="p-1 hover:bg-gray-200 rounded"
                              >
                                {showEnvVars[`${envType}-${idx}`] ? (
                                  <EyeOff className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-400" />
                                )}
                              </button>
                              {envVar.value !== '未設定' && (
                                <button
                                  onClick={() => copyToClipboard(envVar.value)}
                                  className="p-1 hover:bg-gray-200 rounded"
                                >
                                  <Copy className="h-4 w-4 text-gray-400" />
                                </button>
                              )}
                            </div>
                          </div>
                          <Input
                            type={showEnvVars[`${envType}-${idx}`] || !envVar.sensitive ? 'text' : 'password'}
                            value={envVar.value}
                            readOnly
                            className="font-mono text-xs"
                          />
                        </div>
                      ))}
                    </div>

                    <Alert className="mt-4 border-blue-200 bg-blue-50">
                      <Lock className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-700 text-sm">
                        環境変数は.env.{envType}ファイルまたはLightsailの環境変数設定で管理されます
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* デプロイ */}
          <TabsContent value="deploy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>新規デプロイ</CardTitle>
                <CardDescription>
                  選択した環境に新しいバージョンをデプロイ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">デプロイ先環境</label>
                  <select className="w-full mt-1 p-2 border rounded-lg">
                    <option value="development">開発環境</option>
                    <option value="staging" disabled>ステージング環境（未設定）</option>
                    <option value="production" disabled>本番環境（未設定）</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">デプロイバージョン</label>
                  <Input placeholder="v1.2.4" className="mt-1" />
                </div>

                <div>
                  <label className="text-sm font-medium">変更内容</label>
                  <Textarea
                    placeholder="このデプロイで追加・変更された機能を記載"
                    className="mt-1"
                    rows={4}
                  />
                </div>

                <div className="flex gap-2">
                  <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                    <Upload className="h-4 w-4" />
                    デプロイ実行
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    ロールバック
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  デプロイ準備チェックリスト
                </CardTitle>
              </CardHeader>
              <CardContent className="text-green-900 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>全てのテストが成功している</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>データベースマイグレーションの準備完了</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>環境変数の設定確認完了</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span>Lightsail環境の構築（待機中）</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span>共通DBの接続確認（待機中）</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* デプロイ履歴 */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>デプロイ履歴</CardTitle>
                <CardDescription>
                  過去のデプロイ実行履歴（直近50件）
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {deployHistory.map((deploy, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <GitBranch className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">{deploy.version}</span>
                              <ArrowRight className="h-3 w-3 text-gray-400" />
                              <Badge variant="outline">{deploy.environment}</Badge>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {deploy.deployedAt} by {deploy.deployedBy}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={deploy.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {deploy.status === 'success' ? '成功' : '失敗'}
                          </Badge>
                          <span className="text-xs text-gray-500">{deploy.duration}</span>
                        </div>
                      </div>

                      <div className="ml-8">
                        <p className="text-sm text-gray-600 mb-2">変更内容:</p>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                          {deploy.changes.map((change, cidx) => (
                            <li key={cidx}>{change}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* セキュリティ注意事項 */}
        <Alert className="mt-6 border-red-200 bg-red-50">
          <Lock className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">🔒 重要な注意事項</AlertTitle>
          <AlertDescription className="text-red-700">
            <ul className="list-disc list-inside space-y-1 text-sm mt-2">
              <li>本番環境へのデプロイは必ず事前にステージング環境でテストしてください</li>
              <li>環境変数（特にAPIキー、シークレットキー）は絶対に外部に漏らさないでください</li>
              <li>デプロイ前に必ずバックアップを取得してください</li>
              <li>本番環境のデータベースマイグレーションは慎重に実行してください</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
