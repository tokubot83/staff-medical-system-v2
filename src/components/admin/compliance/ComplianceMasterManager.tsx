'use client';

import React, { useState } from 'react';
import {
  Shield, FileText, Settings, Bell, Lock,
  BarChart3, Plus, Edit2, Trash2, Save,
  AlertCircle, CheckCircle, XCircle, Clock,
  Users, GitBranch, MessageSquare, ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

// 型定義
interface ComplianceCategory {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  workflowId: string;
  notificationTemplateId: string;
  isActive: boolean;
}

interface WorkflowStep {
  id: string;
  name: string;
  order: number;
  assignedRole: string;
  slaHours: number;
  actions: string[];
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'teams' | 'slack' | 'all';
  subject: string;
  body: string;
  variables: string[];
}

interface VoiceDriveSettings {
  apiEndpoint: string;
  apiKey: string;
  webhookUrl: string;
  encryptionEnabled: boolean;
  encryptionMethod: 'AES-256-GCM' | 'RSA-4096';
  syncInterval: number;
  autoSync: boolean;
}

export default function ComplianceMasterManager() {
  const [activeTab, setActiveTab] = useState('categories');

  // カテゴリ管理の状態
  const [categories, setCategories] = useState<ComplianceCategory[]>([
    {
      id: '1',
      name: 'ハラスメント',
      description: 'パワハラ、セクハラ、マタハラ等の通報',
      severity: 'high',
      workflowId: 'wf-1',
      notificationTemplateId: 'nt-1',
      isActive: true
    },
    {
      id: '2',
      name: '安全・衛生違反',
      description: '安全管理、衛生管理に関する違反',
      severity: 'medium',
      workflowId: 'wf-2',
      notificationTemplateId: 'nt-2',
      isActive: true
    },
    {
      id: '3',
      name: '倫理違反',
      description: '職業倫理、行動規範の違反',
      severity: 'high',
      workflowId: 'wf-1',
      notificationTemplateId: 'nt-1',
      isActive: true
    }
  ]);

  // ワークフロー設定の状態
  const [workflows, setWorkflows] = useState([
    {
      id: 'wf-1',
      name: '重大事案処理フロー',
      steps: [
        { id: '1', name: '初期受理', order: 1, assignedRole: 'コンプライアンス担当', slaHours: 2, actions: ['記録', '確認'] },
        { id: '2', name: '調査', order: 2, assignedRole: '調査チーム', slaHours: 48, actions: ['聞き取り', '証拠収集'] },
        { id: '3', name: '判定', order: 3, assignedRole: 'コンプライアンス委員会', slaHours: 72, actions: ['審議', '判定'] },
        { id: '4', name: '対応実施', order: 4, assignedRole: '人事部', slaHours: 168, actions: ['処分', '改善指導'] }
      ]
    }
  ]);

  // 通知テンプレート
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: 'nt-1',
      name: '重大事案通知',
      type: 'all',
      subject: '[緊急] コンプライアンス通報受理: {{caseNumber}}',
      body: '重大なコンプライアンス事案を受理しました。\n\nケース番号: {{caseNumber}}\nカテゴリ: {{category}}\n受理日時: {{receivedAt}}\n\n至急対応をお願いします。',
      variables: ['caseNumber', 'category', 'receivedAt']
    }
  ]);

  // VoiceDrive設定
  const [voiceDriveSettings, setVoiceDriveSettings] = useState<VoiceDriveSettings>({
    apiEndpoint: 'https://api.medical-system.kosei-kai.jp/v2/compliance/voicedrive',
    apiKey: '',
    webhookUrl: 'https://api.medical-system.kosei-kai.jp/v2/compliance/webhook',
    encryptionEnabled: true,
    encryptionMethod: 'AES-256-GCM',
    syncInterval: 15,
    autoSync: true
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="categories">カテゴリ管理</TabsTrigger>
          <TabsTrigger value="workflow">ワークフロー</TabsTrigger>
          <TabsTrigger value="templates">通知テンプレート</TabsTrigger>
          <TabsTrigger value="voicedrive">VoiceDrive連携</TabsTrigger>
          <TabsTrigger value="security">セキュリティ</TabsTrigger>
          <TabsTrigger value="statistics">統計設定</TabsTrigger>
        </TabsList>

        {/* カテゴリ管理タブ */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                通報カテゴリ管理
              </CardTitle>
              <CardDescription>
                コンプライアンス通報のカテゴリと処理フローを管理します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    新規カテゴリ追加
                  </Button>
                </div>

                <div className="border rounded-lg">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">カテゴリ名</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">説明</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">重要度</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ワークフロー</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">状態</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {categories.map(category => (
                        <tr key={category.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium">{category.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{category.description}</td>
                          <td className="px-4 py-3">
                            <Badge className={getSeverityColor(category.severity)}>
                              {category.severity}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {workflows.find(w => w.id === category.workflowId)?.name}
                          </td>
                          <td className="px-4 py-3">
                            <Switch checked={category.isActive} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ワークフロー設定タブ */}
        <TabsContent value="workflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                ワークフロー設定
              </CardTitle>
              <CardDescription>
                通報処理のワークフローとSLA（サービスレベル契約）を設定します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {workflows.map(workflow => (
                  <div key={workflow.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-4">{workflow.name}</h3>
                    <div className="space-y-2">
                      {workflow.steps.map((step, index) => (
                        <div key={step.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-bold">
                            {step.order}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{step.name}</div>
                            <div className="text-sm text-gray-600">
                              担当: {step.assignedRole} | SLA: {step.slaHours}時間
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {step.actions.map(action => (
                              <Badge key={action} variant="outline">{action}</Badge>
                            ))}
                          </div>
                          <Button size="sm" variant="outline">
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm">
                        <Plus className="h-3 w-3 mr-1" />
                        ステップ追加
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 通知テンプレートタブ */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                通知テンプレート管理
              </CardTitle>
              <CardDescription>
                自動送信される通知のテンプレートを管理します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map(template => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold">{template.name}</h3>
                        <div className="flex gap-2 mt-2">
                          <Badge>{template.type}</Badge>
                          {template.variables.map(v => (
                            <Badge key={v} variant="outline">{`{{${v}}}`}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          プレビュー
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <Label>件名</Label>
                        <Input value={template.subject} readOnly className="bg-gray-50" />
                      </div>
                      <div>
                        <Label>本文</Label>
                        <Textarea value={template.body} readOnly className="bg-gray-50 h-24" />
                      </div>
                    </div>
                  </div>
                ))}
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  新規テンプレート作成
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VoiceDrive連携設定タブ */}
        <TabsContent value="voicedrive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                VoiceDrive連携設定
              </CardTitle>
              <CardDescription>
                VoiceDriveとのAPI連携を設定します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>API エンドポイント</Label>
                    <Input
                      value={voiceDriveSettings.apiEndpoint}
                      onChange={(e) => setVoiceDriveSettings({...voiceDriveSettings, apiEndpoint: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>API キー</Label>
                    <Input
                      type="password"
                      placeholder="••••••••••••••••"
                      value={voiceDriveSettings.apiKey}
                      onChange={(e) => setVoiceDriveSettings({...voiceDriveSettings, apiKey: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Webhook URL</Label>
                    <Input
                      value={voiceDriveSettings.webhookUrl}
                      onChange={(e) => setVoiceDriveSettings({...voiceDriveSettings, webhookUrl: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>同期間隔（分）</Label>
                    <Input
                      type="number"
                      value={voiceDriveSettings.syncInterval}
                      onChange={(e) => setVoiceDriveSettings({...voiceDriveSettings, syncInterval: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>暗号化通信</Label>
                      <p className="text-sm text-gray-500">エンドツーエンド暗号化を有効にする</p>
                    </div>
                    <Switch
                      checked={voiceDriveSettings.encryptionEnabled}
                      onCheckedChange={(checked) => setVoiceDriveSettings({...voiceDriveSettings, encryptionEnabled: checked})}
                    />
                  </div>

                  {voiceDriveSettings.encryptionEnabled && (
                    <div>
                      <Label>暗号化方式</Label>
                      <select
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        value={voiceDriveSettings.encryptionMethod}
                        onChange={(e) => setVoiceDriveSettings({...voiceDriveSettings, encryptionMethod: e.target.value as 'AES-256-GCM' | 'RSA-4096'})}
                      >
                        <option value="AES-256-GCM">AES-256-GCM</option>
                        <option value="RSA-4096">RSA-4096</option>
                      </select>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>自動同期</Label>
                      <p className="text-sm text-gray-500">定期的に通報データを自動同期</p>
                    </div>
                    <Switch
                      checked={voiceDriveSettings.autoSync}
                      onCheckedChange={(checked) => setVoiceDriveSettings({...voiceDriveSettings, autoSync: checked})}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">接続テスト</Button>
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    設定を保存
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* セキュリティ設定タブ */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                セキュリティ設定
              </CardTitle>
              <CardDescription>
                データ保護とアクセス制御を設定します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">匿名性レベル</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">完全匿名</div>
                        <div className="text-sm text-gray-500">通報者情報を一切記録しない</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">条件付き開示</div>
                        <div className="text-sm text-gray-500">重大事案の場合のみ開示可能</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">実名通報</div>
                        <div className="text-sm text-gray-500">通報者の実名を記録</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">監査ログ設定</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>ハッシュチェーン監査ログ</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>全アクセス記録</Label>
                      <Switch defaultChecked />
                    </div>
                    <div>
                      <Label>ログ保存期間（年）</Label>
                      <Input type="number" defaultValue="7" className="w-32" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">アクセス権限</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span>コンプライアンス担当者</span>
                      <Badge>全権限</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span>調査チーム</span>
                      <Badge>調査・閲覧</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span>管理職</span>
                      <Badge>閲覧のみ</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 統計設定タブ */}
        <TabsContent value="statistics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                統計・レポート設定
              </CardTitle>
              <CardDescription>
                統計データの集計とレポート生成を設定します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">自動集計設定</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">日次集計</span>
                        <Switch defaultChecked />
                      </div>
                      <p className="text-sm text-gray-500">毎日午前0時に実行</p>
                    </div>
                    <div className="border rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">週次集計</span>
                        <Switch defaultChecked />
                      </div>
                      <p className="text-sm text-gray-500">毎週月曜日に実行</p>
                    </div>
                    <div className="border rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">月次集計</span>
                        <Switch defaultChecked />
                      </div>
                      <p className="text-sm text-gray-500">毎月1日に実行</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">アラート設定</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">長期未解決ケース</div>
                        <div className="text-sm text-gray-500">30日以上未解決のケース</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">重大事案の発生</div>
                        <div className="text-sm text-gray-500">重要度「critical」の通報</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">SLA違反</div>
                        <div className="text-sm text-gray-500">処理期限を超過したケース</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">レポート形式</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>出力形式</Label>
                      <select className="w-full mt-1 px-3 py-2 border rounded-md">
                        <option>PDF</option>
                        <option>Excel</option>
                        <option>CSV</option>
                      </select>
                    </div>
                    <div>
                      <Label>言語</Label>
                      <select className="w-full mt-1 px-3 py-2 border rounded-md">
                        <option>日本語</option>
                        <option>English</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}