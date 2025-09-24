'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Webhook,
  AlertTriangle,
  Clock,
  Users,
  Send,
  Volume2,
  VolumeX,
  Zap
} from 'lucide-react';
import { NotificationChannel, NotificationRule, NotificationTemplate } from '@/types/complianceMaster';

const NotificationConfig: React.FC = () => {
  const [channels] = useState<NotificationChannel[]>([
    {
      id: '1',
      type: 'email',
      configuration: { server: 'smtp.hospital.local', port: 587, tls: true },
      enabled: true,
      priority: 1
    },
    {
      id: '2',
      type: 'teams',
      configuration: { webhookUrl: 'https://outlook.office.com/webhook/...' },
      enabled: true,
      priority: 2
    },
    {
      id: '3',
      type: 'sms',
      configuration: { provider: 'Twilio', apiKey: '***' },
      enabled: false,
      priority: 3
    },
    {
      id: '4',
      type: 'slack',
      configuration: { webhookUrl: 'https://hooks.slack.com/...' },
      enabled: true,
      priority: 4
    }
  ]);

  const [templates] = useState<NotificationTemplate[]>([
    {
      id: '1',
      name: '重大案件通知',
      channel: 'email',
      subject: '【緊急】コンプライアンス通報 - 即時対応必要',
      body: '重大度Criticalの通報がありました。\n\nケース番号: {{caseId}}\nカテゴリ: {{category}}\n概要: {{summary}}\n\n至急対応をお願いします。',
      variables: ['caseId', 'category', 'summary']
    },
    {
      id: '2',
      name: '調査完了通知',
      channel: 'teams',
      body: '調査が完了しました。\nケース: {{caseId}}\n結果: {{result}}\n勧告: {{recommendations}}',
      variables: ['caseId', 'result', 'recommendations']
    },
    {
      id: '3',
      name: 'SLA警告',
      channel: 'email',
      subject: '【警告】SLA期限が近づいています',
      body: 'ケース{{caseId}}のSLA期限が{{hours}}時間後に迫っています。',
      variables: ['caseId', 'hours']
    }
  ]);

  const [rules] = useState<NotificationRule[]>([
    {
      id: '1',
      event: '重大案件受信',
      condition: 'severity == "critical"',
      template: '重大案件通知',
      recipients: [
        { type: 'role', value: 'コンプライアンス責任者' },
        { type: 'role', value: '経営層' },
        { type: 'user', value: '竹迫事務長' }
      ],
      delay: 0,
      repeat: {
        enabled: true,
        interval: 60,
        maxAttempts: 3
      }
    },
    {
      id: '2',
      event: 'SLA警告',
      condition: 'timeToSLA <= 2',
      template: 'SLA警告',
      recipients: [
        { type: 'role', value: '担当者' },
        { type: 'role', value: 'マネージャー' }
      ],
      delay: 0
    },
    {
      id: '3',
      event: '調査完了',
      condition: 'status == "investigation_complete"',
      template: '調査完了通知',
      recipients: [
        { type: 'role', value: '関係委員会' },
        { type: 'dynamic', value: 'case.assignedTo' }
      ]
    }
  ]);

  const [preferences] = useState([
    {
      userId: '竹迫事務長',
      channels: ['email', 'teams'],
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '07:00',
        timezone: 'Asia/Tokyo'
      },
      categories: ['重大', '高']
    },
    {
      userId: 'コンプライアンス担当',
      channels: ['email', 'teams', 'slack'],
      quietHours: {
        enabled: false
      },
      categories: ['すべて']
    }
  ]);

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <Smartphone className="h-4 w-4" />;
      case 'teams': return <MessageSquare className="h-4 w-4" />;
      case 'slack': return <MessageSquare className="h-4 w-4" />;
      case 'webhook': return <Webhook className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 通知チャネル */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            通知チャネル設定
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {channels.map((channel) => (
              <div key={channel.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {getChannelIcon(channel.type)}
                    <div>
                      <h4 className="font-medium capitalize">{channel.type}</h4>
                      <p className="text-sm text-gray-600">
                        優先度: {channel.priority}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {channel.enabled ? (
                      <Badge className="bg-green-100 text-green-800">
                        <Volume2 className="h-3 w-3 mr-1" />
                        有効
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-600">
                        <VolumeX className="h-3 w-3 mr-1" />
                        無効
                      </Badge>
                    )}
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                      設定
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            チャネルを追加
          </button>
        </CardContent>
      </Card>

      {/* 通知テンプレート */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            通知テンプレート
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {templates.map((template) => (
              <div key={template.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{template.name}</h4>
                  <div className="flex items-center gap-2">
                    {getChannelIcon(template.channel)}
                    <Badge className="bg-gray-100 text-gray-700">
                      {template.channel}
                    </Badge>
                  </div>
                </div>
                {template.subject && (
                  <div className="mb-2">
                    <span className="text-sm text-gray-600">件名: </span>
                    <span className="text-sm font-medium">{template.subject}</span>
                  </div>
                )}
                <div className="p-2 bg-gray-50 rounded text-sm font-mono whitespace-pre-wrap">
                  {template.body}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {template.variables.map((variable) => (
                    <Badge key={variable} className="bg-blue-50 text-blue-700 text-xs">
                      {`{{${variable}}}`}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button className="mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            テンプレートを作成
          </button>
        </CardContent>
      </Card>

      {/* 通知ルール */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            通知ルール
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rules.map((rule) => (
              <div key={rule.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">{rule.event}</h4>
                    <code className="text-sm bg-gray-100 px-2 py-0.5 rounded">
                      {rule.condition}
                    </code>
                  </div>
                  {rule.repeat && (
                    <Badge className="bg-orange-100 text-orange-800">
                      <Clock className="h-3 w-3 mr-1" />
                      リトライ{rule.repeat.maxAttempts}回
                    </Badge>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">テンプレート:</span>
                    <span className="font-medium">{rule.template}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 text-gray-500 mt-0.5" />
                    <span className="text-gray-600">受信者:</span>
                    <div className="flex flex-wrap gap-1">
                      {rule.recipients.map((recipient, index) => (
                        <Badge key={index} className="bg-gray-100 text-gray-700 text-xs">
                          {recipient.type === 'role' ? '役割' :
                           recipient.type === 'user' ? 'ユーザー' :
                           recipient.type === 'group' ? 'グループ' : '動的'}: {recipient.value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {rule.delay && rule.delay > 0 && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">遅延: {rule.delay}分</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            ルールを追加
          </button>
        </CardContent>
      </Card>

      {/* 個人設定 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            ユーザー通知設定
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {preferences.map((pref, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="mb-3">
                  <h4 className="font-medium">{pref.userId}</h4>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">通知チャネル:</span>
                    <div className="flex gap-1">
                      {pref.channels.map((channel) => (
                        <Badge key={channel} className="bg-blue-100 text-blue-800 text-xs">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {pref.quietHours?.enabled && (
                    <div className="flex items-center gap-2">
                      <VolumeX className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">
                        通知停止: {pref.quietHours.start} - {pref.quietHours.end}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">通知カテゴリ:</span>
                    <div className="flex gap-1">
                      {pref.categories.map((category) => (
                        <Badge key={category} className="bg-gray-100 text-gray-700 text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* エスカレーション設定 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            エスカレーション設定
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <h4 className="font-medium text-red-900 mb-2">レベル1 (30分)</h4>
              <p className="text-sm text-red-800">担当者 → マネージャー</p>
            </div>
            <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
              <h4 className="font-medium text-orange-900 mb-2">レベル2 (1時間)</h4>
              <p className="text-sm text-orange-800">マネージャー → 部門長</p>
            </div>
            <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
              <h4 className="font-medium text-yellow-900 mb-2">レベル3 (2時間)</h4>
              <p className="text-sm text-yellow-800">部門長 → 経営層</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationConfig;