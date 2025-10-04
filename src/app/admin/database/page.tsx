'use client';

import React, { useState } from 'react';
import {
  Database, CheckCircle, XCircle, AlertCircle, RefreshCw,
  Download, Upload, Clock, HardDrive, Activity, Zap,
  Table, FileText, TrendingUp, Settings, TestTube, Shield
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

export default function DatabaseManagementPage() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<any>(null);

  // DB接続設定
  const dbConnections = [
    {
      name: 'Lightsail共通DB（本番）',
      type: 'mysql',
      status: 'pending',
      host: 'lightsail-db.example.com',
      port: 3306,
      database: 'staff_medical_system',
      connections: 0,
      maxConnections: 100,
      version: 'MySQL 8.0.35'
    },
    {
      name: 'ローカル開発DB',
      type: 'postgresql',
      status: 'connected',
      host: 'localhost',
      port: 5432,
      database: 'staff_dev',
      connections: 5,
      maxConnections: 20,
      version: 'PostgreSQL 15.4'
    }
  ];

  // テーブル一覧
  const tables = [
    { name: 'staff', rows: 750, size: '12.3 MB', description: '職員マスター' },
    { name: 'evaluations', rows: 3420, size: '45.8 MB', description: '評価データ' },
    { name: 'interviews', rows: 2150, size: '28.4 MB', description: '面談記録' },
    { name: 'health_checkups', rows: 1890, size: '34.2 MB', description: '健康診断' },
    { name: 'career_courses', rows: 650, size: '5.6 MB', description: 'キャリアコース' },
    { name: 'compliance_reports', rows: 23, size: '892 KB', description: 'コンプライアンス通報' },
    { name: 'audit_logs', rows: 15420, size: '156.7 MB', description: '監査ログ' },
  ];

  // バックアップ履歴
  const backupHistory = [
    {
      id: 'backup_20251004_143000',
      createdAt: '2025-10-04 14:30:00',
      type: 'full',
      size: '285.4 MB',
      status: 'success',
      tables: 7,
      duration: '3分12秒'
    },
    {
      id: 'backup_20251004_020000',
      createdAt: '2025-10-04 02:00:00',
      type: 'auto',
      size: '284.8 MB',
      status: 'success',
      tables: 7,
      duration: '3分05秒'
    },
    {
      id: 'backup_20251003_020000',
      createdAt: '2025-10-03 02:00:00',
      type: 'auto',
      size: '283.2 MB',
      status: 'success',
      tables: 7,
      duration: '3分08秒'
    },
  ];

  // スロークエリ
  const slowQueries = [
    {
      query: 'SELECT * FROM evaluations JOIN staff ON...',
      executionTime: '2.45s',
      calls: 124,
      avgTime: '1.85s',
      timestamp: '2025-10-04 14:25:00'
    },
    {
      query: 'SELECT * FROM audit_logs WHERE...',
      executionTime: '1.92s',
      calls: 89,
      avgTime: '1.45s',
      timestamp: '2025-10-04 14:22:00'
    },
  ];

  const handleTestConnection = async () => {
    setIsConnecting(true);
    setConnectionStatus(null);

    setTimeout(() => {
      const isSuccess = Math.random() > 0.3;
      setConnectionStatus({
        success: isSuccess,
        message: isSuccess
          ? 'データベースへの接続に成功しました'
          : 'データベースへの接続に失敗しました',
        details: isSuccess ? {
          responseTime: `${Math.floor(Math.random() * 50) + 10}ms`,
          version: 'MySQL 8.0.35',
          charset: 'utf8mb4',
        } : null,
      });
      setIsConnecting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ページヘッダー */}
      <div className="bg-white border-b">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Database className="h-7 w-7 text-cyan-600" />
                <h1 className="text-3xl font-bold text-gray-900">共通データベース管理</h1>
                <Badge className="bg-cyan-100 text-cyan-800 border-cyan-300 text-sm">
                  Lightsail統合環境
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                全システム共通のデータベースを一元管理
              </p>
            </div>
            <Button onClick={handleTestConnection} className="gap-2 bg-cyan-600 hover:bg-cyan-700">
              <TestTube className="h-4 w-4" />
              接続テスト
            </Button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* システム担当者向けガイド */}
        <Alert className="mb-6 border-cyan-200 bg-cyan-50">
          <Database className="h-4 w-4 text-cyan-600" />
          <AlertTitle className="text-cyan-800">💡 共通データベースとは？</AlertTitle>
          <AlertDescription className="text-cyan-700 space-y-2">
            <p>Lightsail環境に構築される全システム共通のMySQL/PostgreSQLデータベースです。</p>
            <ul className="list-disc list-inside space-y-1 text-sm ml-2">
              <li>職員カルテ、VoiceDrive、経営企画システムが同じDBを使用</li>
              <li>リアルタイムでデータ同期（遅延なし）</li>
              <li>毎日自動バックアップ（深夜2時実行）</li>
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
                  <div><strong>応答時間:</strong> {connectionStatus.details.responseTime}</div>
                  <div><strong>DBバージョン:</strong> {connectionStatus.details.version}</div>
                  <div><strong>文字セット:</strong> {connectionStatus.details.charset}</div>
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
                  <p className="text-sm text-gray-600">DB接続状態</p>
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
                  <p className="text-sm text-gray-600">テーブル数</p>
                  <p className="text-2xl font-bold text-blue-600">{tables.length}</p>
                </div>
                <Table className="h-10 w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">総データ量</p>
                  <p className="text-2xl font-bold text-purple-600">285 MB</p>
                </div>
                <HardDrive className="h-10 w-10 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">バックアップ</p>
                  <p className="text-2xl font-bold text-orange-600">毎日</p>
                </div>
                <Download className="h-10 w-10 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="connection" className="space-y-6">
          <TabsList>
            <TabsTrigger value="connection" className="gap-2">
              <Database className="h-4 w-4" />
              接続管理
            </TabsTrigger>
            <TabsTrigger value="schema" className="gap-2">
              <Table className="h-4 w-4" />
              スキーマ管理
            </TabsTrigger>
            <TabsTrigger value="performance" className="gap-2">
              <Activity className="h-4 w-4" />
              パフォーマンス
            </TabsTrigger>
            <TabsTrigger value="backup" className="gap-2">
              <Download className="h-4 w-4" />
              バックアップ
            </TabsTrigger>
          </TabsList>

          {/* 接続管理 */}
          <TabsContent value="connection" className="space-y-4">
            {dbConnections.map((db, idx) => (
              <Card key={idx} className={db.status === 'connected' ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-yellow-500'}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{db.name}</CardTitle>
                    <Badge className={db.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {db.status === 'connected' ? '接続中' : '準備中'}
                    </Badge>
                  </div>
                  <CardDescription>{db.version}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">ホスト</span>
                        <p className="font-mono text-sm text-gray-900">{db.host}:{db.port}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">データベース</span>
                        <p className="font-mono text-sm text-gray-900">{db.database}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">現在の接続数</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-cyan-600 h-2 rounded-full"
                              style={{ width: `${(db.connections / db.maxConnections) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            {db.connections}/{db.maxConnections}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {db.status === 'connected' && (
                    <div className="mt-4 pt-4 border-t flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <RefreshCw className="h-3 w-3" />
                        再接続
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <TestTube className="h-3 w-3" />
                        接続テスト
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Settings className="h-3 w-3" />
                        設定変更
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* スキーマ管理 */}
          <TabsContent value="schema" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>テーブル一覧</CardTitle>
                <CardDescription>
                  データベース内の全テーブルとデータ量
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tables.map((table, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Table className="h-5 w-5 text-cyan-600" />
                          <div>
                            <h4 className="font-semibold text-gray-900">{table.name}</h4>
                            <p className="text-xs text-gray-500">{table.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div>
                          <span className="text-gray-500">レコード数:</span>
                          <span className="font-semibold text-gray-900 ml-2">{table.rows.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">サイズ:</span>
                          <span className="font-semibold text-gray-900 ml-2">{table.size}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          詳細
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800">マイグレーション管理</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-900 space-y-3">
                <p className="text-sm">データベーススキーマの変更履歴とマイグレーション管理</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>2025_10_03_career_courses_table - 適用済み</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>2025_10_02_health_checkups_table - 適用済み</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>2025_09_30_compliance_reports_table - 適用済み</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* パフォーマンス */}
          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>クエリ実行統計</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">総クエリ数（24時間）</span>
                    <span className="text-xl font-bold text-gray-900">15,420</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">平均実行時間</span>
                    <span className="text-xl font-bold text-gray-900">45ms</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">最大実行時間</span>
                    <span className="text-xl font-bold text-red-600">2.45s</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>リソース使用状況</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">CPU使用率</span>
                      <span className="text-sm font-semibold">34%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-cyan-600 h-2 rounded-full" style={{ width: '34%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">メモリ使用率</span>
                      <span className="text-sm font-semibold">58%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-cyan-600 h-2 rounded-full" style={{ width: '58%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">ディスク使用率</span>
                      <span className="text-sm font-semibold">23%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '23%' }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>スロークエリログ</CardTitle>
                <CardDescription>
                  実行時間が1秒以上かかったクエリ（直近20件）
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {slowQueries.map((query, idx) => (
                    <div key={idx} className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-red-100 text-red-800">遅い</Badge>
                        <span className="text-xs text-red-600 font-mono">{query.timestamp}</span>
                      </div>
                      <p className="font-mono text-xs text-gray-700 mb-2">{query.query}</p>
                      <div className="flex items-center gap-4 text-xs text-red-700">
                        <span>実行時間: <strong>{query.executionTime}</strong></span>
                        <span>呼び出し回数: <strong>{query.calls}</strong></span>
                        <span>平均時間: <strong>{query.avgTime}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* バックアップ */}
          <TabsContent value="backup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>バックアップ設定</CardTitle>
                <CardDescription>
                  自動バックアップのスケジュールと設定
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">自動バックアップ有効</span>
                  </div>
                  <div className="text-sm text-green-700 space-y-1">
                    <p>• 実行時間: 毎日深夜2:00</p>
                    <p>• 保存期間: 30日間</p>
                    <p>• 保存先: Lightsail Storage</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="gap-2 bg-cyan-600 hover:bg-cyan-700">
                    <Download className="h-4 w-4" />
                    手動バックアップ実行
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    バックアップから復元
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>バックアップ履歴</CardTitle>
                <CardDescription>
                  過去のバックアップ実行履歴（直近30日分）
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {backupHistory.map((backup) => (
                    <div key={backup.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="font-mono text-sm text-gray-900">{backup.createdAt}</span>
                          <Badge variant="outline" className="text-xs">
                            {backup.type === 'auto' ? '自動' : '手動'}
                          </Badge>
                          <Badge className="bg-green-100 text-green-800 text-xs">成功</Badge>
                        </div>
                        <div className="flex items-center gap-6 text-xs text-gray-600 ml-7">
                          <span>ID: {backup.id}</span>
                          <span>サイズ: {backup.size}</span>
                          <span>テーブル: {backup.tables}個</span>
                          <span>所要時間: {backup.duration}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Upload className="h-3 w-3" />
                        復元
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* セキュリティ注意事項 */}
        <Alert className="mt-6 border-red-200 bg-red-50">
          <Shield className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">🔒 データベース管理の重要事項</AlertTitle>
          <AlertDescription className="text-red-700">
            <ul className="list-disc list-inside space-y-1 text-sm mt-2">
              <li>バックアップから復元する際は、必ず事前に現在のデータをバックアップしてください</li>
              <li>本番環境のデータベースを直接操作する際は細心の注意を払ってください</li>
              <li>スロークエリが多発する場合は、インデックスの最適化を検討してください</li>
              <li>DB接続情報（パスワード等）は絶対に外部に漏らさないでください</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
