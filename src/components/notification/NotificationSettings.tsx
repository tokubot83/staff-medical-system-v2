'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  AlertTriangle,
  Save,
  RotateCcw,
  Settings,
  Bell,
  Users,
  Clock,
  Mail,
  Shield,
  Database,
  Download,
  Upload,
  Trash2,
  Plus
} from 'lucide-react'

interface NotificationRule {
  id: string
  name: string
  category: string
  condition: string
  action: string
  enabled: boolean
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  header: string
  footer: string
  styling: string
}

export default function NotificationSettings() {
  const [generalSettings, setGeneralSettings] = useState({
    defaultSender: 'hr@hospital.com',
    replyTo: 'noreply@hospital.com',
    maxDailyNotifications: 5,
    quietHours: { start: '18:00', end: '08:00' },
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    enablePushNotifications: true,
    autoRetryFailed: true,
    retryAttempts: 3,
    retryInterval: 30
  })

  const [deliverySettings, setDeliverySettings] = useState({
    batchSize: 100,
    deliveryDelay: 5,
    priorityDelivery: true,
    emergencyBypass: true,
    deliveryWindow: { start: '08:00', end: '18:00' },
    weekendDelivery: false,
    holidayDelivery: false
  })

  const [automationRules] = useState<NotificationRule[]>([
    {
      id: '1',
      name: '研修期限リマインダー',
      category: 'training',
      condition: '期限7日前',
      action: '自動配信',
      enabled: true
    },
    {
      id: '2',
      name: '面談予約確認',
      category: 'interview',
      condition: '予約後24時間以内',
      action: '確認メール送信',
      enabled: true
    },
    {
      id: '3',
      name: '緊急通知エスカレーション',
      category: 'urgent',
      condition: '未読30分経過',
      action: 'SMS配信',
      enabled: false
    }
  ])

  const [emailTemplates] = useState<EmailTemplate[]>([
    {
      id: '1',
      name: 'デフォルトテンプレート',
      subject: '【{category}】{title}',
      header: '医療法人厚生会 職員カルテシステム',
      footer: 'このメールは自動配信されています。',
      styling: 'default'
    }
  ])

  const handleSaveSettings = () => {
    console.log('Settings saved:', { generalSettings, deliverySettings })
    alert('設定を保存しました')
  }

  const handleResetSettings = () => {
    if (confirm('設定をデフォルトに戻しますか？')) {
      console.log('Settings reset to default')
      alert('設定をリセットしました')
    }
  }

  const handleExportSettings = () => {
    const settings = { generalSettings, deliverySettings, automationRules, emailTemplates }
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'notification_settings.json'
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* ヘッダーエリア */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">通知設定</h2>
          <p className="text-gray-600">システム全体の通知配信設定を管理します</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportSettings} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            設定エクスポート
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            設定インポート
          </Button>
          <Button variant="outline" onClick={handleResetSettings} className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            リセット
          </Button>
          <Button onClick={handleSaveSettings} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            保存
          </Button>
        </div>
      </div>

      {/* タブエリア */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">基本設定</TabsTrigger>
          <TabsTrigger value="delivery">配信設定</TabsTrigger>
          <TabsTrigger value="automation">自動化ルール</TabsTrigger>
          <TabsTrigger value="templates">メールテンプレート</TabsTrigger>
          <TabsTrigger value="security">セキュリティ</TabsTrigger>
        </TabsList>

        {/* 基本設定タブ */}
        <TabsContent value="general" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  メール設定
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="defaultSender">送信者アドレス</Label>
                  <Input
                    id="defaultSender"
                    value={generalSettings.defaultSender}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, defaultSender: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="replyTo">返信先アドレス</Label>
                  <Input
                    id="replyTo"
                    value={generalSettings.replyTo}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, replyTo: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxDaily">1日最大配信数</Label>
                  <Input
                    id="maxDaily"
                    type="number"
                    value={generalSettings.maxDailyNotifications}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, maxDailyNotifications: parseInt(e.target.value) }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  通知チャネル
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>メール通知</Label>
                    <p className="text-sm text-gray-600">メールでの通知配信</p>
                  </div>
                  <Switch
                    checked={generalSettings.enableEmailNotifications}
                    onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, enableEmailNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS通知</Label>
                    <p className="text-sm text-gray-600">緊急時のSMS配信</p>
                  </div>
                  <Switch
                    checked={generalSettings.enableSMSNotifications}
                    onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, enableSMSNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>プッシュ通知</Label>
                    <p className="text-sm text-gray-600">アプリ内プッシュ通知</p>
                  </div>
                  <Switch
                    checked={generalSettings.enablePushNotifications}
                    onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, enablePushNotifications: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  配信時間制御
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>静寂時間</Label>
                  <p className="text-sm text-gray-600 mb-2">この時間帯は緊急以外の配信を停止</p>
                  <div className="flex gap-2">
                    <Input
                      type="time"
                      value={generalSettings.quietHours.start}
                      onChange={(e) => setGeneralSettings(prev => ({
                        ...prev,
                        quietHours: { ...prev.quietHours, start: e.target.value }
                      }))}
                    />
                    <span className="py-2">〜</span>
                    <Input
                      type="time"
                      value={generalSettings.quietHours.end}
                      onChange={(e) => setGeneralSettings(prev => ({
                        ...prev,
                        quietHours: { ...prev.quietHours, end: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5" />
                  リトライ設定
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>自動リトライ</Label>
                    <p className="text-sm text-gray-600">配信失敗時の自動再試行</p>
                  </div>
                  <Switch
                    checked={generalSettings.autoRetryFailed}
                    onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, autoRetryFailed: checked }))}
                  />
                </div>
                <div>
                  <Label htmlFor="retryAttempts">リトライ回数</Label>
                  <Input
                    id="retryAttempts"
                    type="number"
                    value={generalSettings.retryAttempts}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, retryAttempts: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="retryInterval">リトライ間隔（分）</Label>
                  <Input
                    id="retryInterval"
                    type="number"
                    value={generalSettings.retryInterval}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, retryInterval: parseInt(e.target.value) }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 配信設定タブ */}
        <TabsContent value="delivery" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>配信パフォーマンス</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="batchSize">バッチサイズ</Label>
                  <p className="text-sm text-gray-600 mb-2">一度に送信する配信数</p>
                  <Input
                    id="batchSize"
                    type="number"
                    value={deliverySettings.batchSize}
                    onChange={(e) => setDeliverySettings(prev => ({ ...prev, batchSize: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryDelay">配信間隔（秒）</Label>
                  <p className="text-sm text-gray-600 mb-2">バッチ間の待機時間</p>
                  <Input
                    id="deliveryDelay"
                    type="number"
                    value={deliverySettings.deliveryDelay}
                    onChange={(e) => setDeliverySettings(prev => ({ ...prev, deliveryDelay: parseInt(e.target.value) }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>優先配信設定</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>優先度別配信</Label>
                    <p className="text-sm text-gray-600">高優先度を先に配信</p>
                  </div>
                  <Switch
                    checked={deliverySettings.priorityDelivery}
                    onCheckedChange={(checked) => setDeliverySettings(prev => ({ ...prev, priorityDelivery: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>緊急通知バイパス</Label>
                    <p className="text-sm text-gray-600">制限を無視して即座に配信</p>
                  </div>
                  <Switch
                    checked={deliverySettings.emergencyBypass}
                    onCheckedChange={(checked) => setDeliverySettings(prev => ({ ...prev, emergencyBypass: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>配信時間帯制御</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>平日配信時間</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="time"
                      value={deliverySettings.deliveryWindow.start}
                      onChange={(e) => setDeliverySettings(prev => ({
                        ...prev,
                        deliveryWindow: { ...prev.deliveryWindow, start: e.target.value }
                      }))}
                    />
                    <span className="py-2">〜</span>
                    <Input
                      type="time"
                      value={deliverySettings.deliveryWindow.end}
                      onChange={(e) => setDeliverySettings(prev => ({
                        ...prev,
                        deliveryWindow: { ...prev.deliveryWindow, end: e.target.value }
                      }))}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>土日配信</Label>
                    <p className="text-sm text-gray-600">週末の配信を許可</p>
                  </div>
                  <Switch
                    checked={deliverySettings.weekendDelivery}
                    onCheckedChange={(checked) => setDeliverySettings(prev => ({ ...prev, weekendDelivery: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>祝日配信</Label>
                    <p className="text-sm text-gray-600">祝日の配信を許可</p>
                  </div>
                  <Switch
                    checked={deliverySettings.holidayDelivery}
                    onCheckedChange={(checked) => setDeliverySettings(prev => ({ ...prev, holidayDelivery: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 自動化ルールタブ */}
        <TabsContent value="automation" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">自動化ルール</h3>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              新規ルール追加
            </Button>
          </div>

          <div className="space-y-4">
            {automationRules.map((rule) => (
              <Card key={rule.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{rule.name}</h4>
                        <Badge variant="outline">{rule.category}</Badge>
                        <Switch checked={rule.enabled} />
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">条件:</span> {rule.condition} →
                        <span className="font-medium ml-2">アクション:</span> {rule.action}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">編集</Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* メールテンプレートタブ */}
        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">メールテンプレート</h3>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              新規テンプレート
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>デフォルトメールテンプレート</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="emailSubject">件名テンプレート</Label>
                <Input
                  id="emailSubject"
                  value="【{category}】{title}"
                  placeholder="件名のテンプレートを入力"
                />
              </div>
              <div>
                <Label htmlFor="emailHeader">ヘッダー</Label>
                <Textarea
                  id="emailHeader"
                  rows={3}
                  value="医療法人厚生会 職員カルテシステム"
                  placeholder="メールヘッダーを入力"
                />
              </div>
              <div>
                <Label htmlFor="emailFooter">フッター</Label>
                <Textarea
                  id="emailFooter"
                  rows={3}
                  value="このメールは自動配信されています。返信はできません。"
                  placeholder="メールフッターを入力"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* セキュリティタブ */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                アクセス制御
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>管理者承認必須</Label>
                  <p className="text-sm text-gray-600">緊急通知の配信に管理者承認を求める</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>配信ログ記録</Label>
                  <p className="text-sm text-gray-600">全ての配信操作をログに記録</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>個人情報マスキング</Label>
                  <p className="text-sm text-gray-600">ログ記録時に個人情報を自動マスキング</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                データ保持設定
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="logRetention">ログ保持期間（日）</Label>
                <Input id="logRetention" type="number" defaultValue="365" />
              </div>
              <div>
                <Label htmlFor="draftRetention">下書き保持期間（日）</Label>
                <Input id="draftRetention" type="number" defaultValue="30" />
              </div>
              <div>
                <Label htmlFor="analyticsRetention">分析データ保持期間（日）</Label>
                <Input id="analyticsRetention" type="number" defaultValue="730" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">セキュリティ注意事項</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• 医療情報の取り扱いには十分注意してください</li>
                    <li>• 定期的にアクセスログを確認してください</li>
                    <li>• 個人情報を含む通知は最小限に抑えてください</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}