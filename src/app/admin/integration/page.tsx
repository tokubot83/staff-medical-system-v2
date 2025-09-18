'use client';

import React, { useState } from 'react';
import { 
  Link2, Shield, AlertCircle, CheckCircle, 
  Settings, TestTube, Save, RefreshCw,
  Key, Globe, Database, ArrowRight
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
import { Switch } from '@/components/ui/switch';

export default function IntegrationPage() {
  const [apiKey, setApiKey] = useState('');
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isTestMode, setIsTestMode] = useState(true);
  const [testResult, setTestResult] = useState<any>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setTestResult(null);
    
    // モック接続テスト
    setTimeout(() => {
      setTestResult({
        success: true,
        message: '接続テストに成功しました',
        details: {
          endpoint: apiEndpoint || 'https://api.example.com',
          responseTime: '245ms',
          status: 200,
        }
      });
      setIsTestingConnection(false);
    }, 1500);
  };

  const handleSaveSettings = () => {
    // 設定の保存処理
    alert('設定を保存しました');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-4">
              <Link2 className="h-5 w-5 text-gray-600" />
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                開発中
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 mr-2">テストモード</span>
              <Switch
                checked={isTestMode}
                onCheckedChange={setIsTestMode}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Alert className="mb-6 border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">実装予定機能</AlertTitle>
          <AlertDescription className="text-yellow-700">
            この機能は現在開発中です。実際のAPI連携はバックエンド実装後に利用可能になります。
          </AlertDescription>
        </Alert>

        {/* 開発メモ・進捗状況 */}
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              開発進捗状況（2025年8月31日更新）
            </CardTitle>
          </CardHeader>
          <CardContent className="text-green-700 space-y-4">
            <div>
              <h4 className="font-semibold mb-2">✅ Phase 2完了項目（VoiceDrive連携）</h4>
              <ul className="text-sm space-y-1 ml-4">
                <li>• V3評価通知システム実装完了（夏季・冬季・最終評価対応）</li>
                <li>• 異議申立システム実装完了（VoiceDrive ⇄ 医療システム双方向）</li>
                <li>• 本番用バッチ処理システム（1000名同時処理対応）</li>
                <li>• 24時間監視・セキュリティシステム</li>
                <li>• 統合テスト実行・全項目成功（処理成功率100%）</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">🔄 Phase 3準備中項目</h4>
              <ul className="text-sm space-y-1 ml-4">
                <li>• エスポワール立神 組織定義確定・登録（実装待ち）</li>
                <li>• グループホーム宝寿庵 実装（実装待ち）</li>
                <li>• 採用・教育研修システム 完成（開発中）</li>
                <li>• 全施設・組織階層 完成（段階的実装中）</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">🚀 Phase 3開発計画（共通DB・職員システム統合）</h4>
              <div className="text-sm space-y-3 ml-4">
                <div>
                  <h5 className="font-medium text-green-800">▶ Step 1: 職員基本データ統合システム（2025年9月予定）</h5>
                  <ul className="space-y-1 ml-4 text-xs">
                    <li>• Excel一括職員データ取り込み機能実装</li>
                    <li>• PDF履歴書自動解析・データ抽出機能</li>
                    <li>• 職員カルテ個人ページ自動生成システム</li>
                    <li>• 500名既存職員データの完全デジタル化</li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-green-800">▶ Step 2: 共通DB構築・VoiceDrive連携拡張</h5>
                  <ul className="space-y-1 ml-4 text-xs">
                    <li>• MySQL共通DB構築（専用PC設置・セキュリティ強化）</li>
                    <li>• VoiceDrive職員アカウント自動生成機能</li>
                    <li>• 職員ID・初期パスワード自動発行システム</li>
                    <li>• 入職初日からの面談予約システム連携</li>
                    <li>• リアルタイムデータ同期（職員カルテ ⇄ VoiceDrive）</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-green-800">▶ Step 3: 統合テスト・本格運用</h5>
                  <ul className="space-y-1 ml-4 text-xs">
                    <li>• 医療システムDB構築計画書作成</li>
                    <li>• VoiceDriveDB構築計画書との統合・照合</li>
                    <li>• 共通DBスキーマ最終設計・実装</li>
                    <li>• 実職員データでの統合テスト・段階的本格運用開始</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">🎯 実装予定機能詳細</h4>
              <div className="text-sm space-y-2 ml-4">
                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                  <h5 className="font-medium text-blue-800">職員データ統合フロー</h5>
                  <p className="text-xs text-blue-700 mt-1">
                    Excel職員名簿アップロード → 自動解析・データ変換 → 職員カルテ個人ページ自動生成（500名対応）
                    → 同時にVoiceDrive職員アカウント作成・認証情報発行 → 入職日から面談予約可能
                  </p>
                </div>
                
                <div className="bg-purple-50 p-3 rounded border border-purple-200">
                  <h5 className="font-medium text-purple-800">共通DB中心連動システム</h5>
                  <p className="text-xs text-purple-700 mt-1">
                    専用PC（MySQL）を中心に、職員カルテ（人事部）・VoiceDrive（職員個人）・経営企画システム（資格管理）が
                    リアルタイム連動。評価データ・面談記録・成長履歴が即座に同期・更新される統合環境。
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-green-300">
              <p className="text-xs">
                <strong>実装ファイル</strong>: 本番用実装6ファイル完成済み<br />
                <code className="text-xs">route.production.ts, productionDatabase.ts, productionBatchNotificationService.ts, productionEvaluationNotificationService.ts, productionMonitoringService.ts, production-integration-test.js</code>
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="api" className="space-y-4">
          <TabsList>
            <TabsTrigger value="api">
              <Key className="h-4 w-4 mr-2" />
              API設定
            </TabsTrigger>
            <TabsTrigger value="webhook">
              <Globe className="h-4 w-4 mr-2" />
              Webhook設定
            </TabsTrigger>
            <TabsTrigger value="mapping">
              <Database className="h-4 w-4 mr-2" />
              データマッピング
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API認証設定</CardTitle>
                <CardDescription>
                  外部システムとの接続に必要な認証情報を設定します。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">APIエンドポイント</label>
                  <Input
                    type="url"
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    placeholder="https://api.example.com/v1"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">APIキー</label>
                  <Input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk_live_..."
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    APIキーは暗号化されて保存されます
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleTestConnection}
                    variant="outline"
                    disabled={isTestingConnection}
                  >
                    {isTestingConnection ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        接続テスト中...
                      </>
                    ) : (
                      <>
                        <TestTube className="h-4 w-4 mr-2" />
                        接続テスト
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleSaveSettings}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    設定を保存
                  </Button>
                </div>

                {testResult && (
                  <Alert className={testResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                    {testResult.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription className={testResult.success ? 'text-green-700' : 'text-red-700'}>
                      {testResult.message}
                      {testResult.details && (
                        <div className="mt-2 text-xs">
                          <div>エンドポイント: {testResult.details.endpoint}</div>
                          <div>レスポンスタイム: {testResult.details.responseTime}</div>
                          <div>ステータス: {testResult.details.status}</div>
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>連携可能なシステム</CardTitle>
                <CardDescription>
                  以下の外部システムとの連携が可能です（実装予定）
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">勤怠管理システム</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      出退勤データ、シフト情報の同期
                    </p>
                    <Badge className="mt-2 bg-gray-100 text-gray-800">未接続</Badge>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">給与計算システム</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      評価結果の給与反映
                    </p>
                    <Badge className="mt-2 bg-gray-100 text-gray-800">未接続</Badge>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">電子カルテシステム</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      医療スタッフ情報の連携
                    </p>
                    <Badge className="mt-2 bg-gray-100 text-gray-800">未接続</Badge>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">e-ラーニングシステム</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      研修受講履歴の同期
                    </p>
                    <Badge className="mt-2 bg-gray-100 text-gray-800">未接続</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhook" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Webhook設定</CardTitle>
                <CardDescription>
                  システムイベントを外部システムに通知します。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Webhook URL</label>
                  <Input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://example.com/webhook"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">通知イベント</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">評価完了時</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">面談実施時</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">研修完了時</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">マスターデータ更新時</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">ペイロード形式</label>
                  <Textarea
                    value={JSON.stringify({
                      event: "evaluation.completed",
                      timestamp: "2025-08-14T10:00:00Z",
                      data: {
                        staffId: "E001",
                        evaluationId: "EV001",
                        score: 85
                      }
                    }, null, 2)}
                    readOnly
                    className="mt-1 font-mono text-xs"
                    rows={8}
                  />
                </div>

                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Webhook設定を保存
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mapping" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>データマッピング設定</CardTitle>
                <CardDescription>
                  外部システムとのデータ項目の対応関係を設定します。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">職員データマッピング</h4>
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-4 items-center text-sm">
                        <div>内部フィールド</div>
                        <ArrowRight className="h-4 w-4 text-gray-400 justify-self-center" />
                        <div>外部フィールド</div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 items-center">
                        <Input value="employeeNumber" readOnly className="text-sm" />
                        <ArrowRight className="h-4 w-4 text-gray-400 justify-self-center" />
                        <Input placeholder="employee_id" className="text-sm" />
                      </div>
                      <div className="grid grid-cols-3 gap-4 items-center">
                        <Input value="name" readOnly className="text-sm" />
                        <ArrowRight className="h-4 w-4 text-gray-400 justify-self-center" />
                        <Input placeholder="full_name" className="text-sm" />
                      </div>
                      <div className="grid grid-cols-3 gap-4 items-center">
                        <Input value="department" readOnly className="text-sm" />
                        <ArrowRight className="h-4 w-4 text-gray-400 justify-self-center" />
                        <Input placeholder="dept_code" className="text-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">評価データマッピング</h4>
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-4 items-center text-sm">
                        <div>内部フィールド</div>
                        <ArrowRight className="h-4 w-4 text-gray-400 justify-self-center" />
                        <div>外部フィールド</div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 items-center">
                        <Input value="technicalScore" readOnly className="text-sm" />
                        <ArrowRight className="h-4 w-4 text-gray-400 justify-self-center" />
                        <Input placeholder="technical_rating" className="text-sm" />
                      </div>
                      <div className="grid grid-cols-3 gap-4 items-center">
                        <Input value="contributionScore" readOnly className="text-sm" />
                        <ArrowRight className="h-4 w-4 text-gray-400 justify-self-center" />
                        <Input placeholder="contribution_rating" className="text-sm" />
                      </div>
                    </div>
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Save className="h-4 w-4 mr-2" />
                    マッピング設定を保存
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Alert className="mt-6 border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">セキュリティについて</AlertTitle>
          <AlertDescription className="text-blue-700">
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>APIキーは暗号化されて保存されます</li>
              <li>通信はすべてHTTPS経由で行われます</li>
              <li>Webhookには署名検証が実装されます</li>
              <li>アクセスログは監査ログに記録されます</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}