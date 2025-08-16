'use client';

import React, { useState } from 'react';
import CommonHeader from '@/components/CommonHeader';
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
      <CommonHeader title="外部システム連携設定" />
      
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