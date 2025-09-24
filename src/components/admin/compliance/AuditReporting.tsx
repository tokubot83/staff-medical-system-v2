'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  FileText,
  Download,
  Calendar,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  Database,
  Shield,
  Hash,
  Send,
  Archive
} from 'lucide-react';
import { ReportTemplate, ReportSchedule } from '@/types/complianceMaster';

const AuditReporting: React.FC = () => {
  const [reportTemplates] = useState<ReportTemplate[]>([
    {
      id: '1',
      name: '月次コンプライアンスレポート',
      type: 'monthly',
      sections: [
        { id: '1', title: 'サマリー', dataSource: 'cases', visualization: 'summary' },
        { id: '2', title: '新規ケース', dataSource: 'cases', visualization: 'table', columns: ['id', 'category', 'severity', 'status'] },
        { id: '3', title: 'カテゴリ別統計', dataSource: 'statistics', visualization: 'chart' },
        { id: '4', title: '解決率推移', dataSource: 'trends', visualization: 'timeline' }
      ],
      filters: ['dateRange', 'category', 'severity'],
      grouping: ['category', 'department']
    },
    {
      id: '2',
      name: '委員会報告書',
      type: 'committee',
      sections: [
        { id: '1', title: '会議サマリー', dataSource: 'meetings', visualization: 'summary' },
        { id: '2', title: '議決事項', dataSource: 'decisions', visualization: 'table' },
        { id: '3', title: 'アクションアイテム', dataSource: 'actions', visualization: 'table' }
      ],
      filters: ['committee', 'dateRange'],
      grouping: ['committee']
    },
    {
      id: '3',
      name: '監査報告書',
      type: 'audit',
      sections: [
        { id: '1', title: '監査結果', dataSource: 'audit', visualization: 'summary' },
        { id: '2', title: 'コンプライアンス違反', dataSource: 'violations', visualization: 'table' },
        { id: '3', title: '改善勧告', dataSource: 'recommendations', visualization: 'table' },
        { id: '4', title: '証跡', dataSource: 'evidence', visualization: 'table' }
      ],
      filters: ['auditType', 'dateRange', 'department'],
      grouping: ['department', 'violationType']
    }
  ]);

  const [reportSchedules] = useState<ReportSchedule[]>([
    {
      id: '1',
      template: '月次コンプライアンスレポート',
      frequency: '毎月第1営業日',
      recipients: ['コンプライアンス責任者', '経営層', '監査役'],
      filters: { dateRange: 'lastMonth' }
    },
    {
      id: '2',
      template: '委員会報告書',
      frequency: '四半期ごと',
      recipients: ['理事会', '各委員会委員長'],
      filters: { dateRange: 'lastQuarter' }
    },
    {
      id: '3',
      template: '監査報告書',
      frequency: '年次',
      recipients: ['理事長', '監査役', '外部監査人'],
      filters: { dateRange: 'lastYear' }
    }
  ]);

  const [auditSettings] = useState({
    enabledEvents: ['ケース作成', 'ステータス変更', '情報開示', '委員会決定', 'アクセスログ'],
    detailLevel: 'detailed',
    timestampFormat: 'ISO 8601',
    hashChaining: true,
    tamperDetection: true,
    retentionPeriod: 2555,
    archiveLocation: '/secure/audit/archives/',
    compressionEnabled: true,
    encryptionKey: 'AES-256-GCM'
  });

  const [complianceMetrics] = useState({
    currentMonth: {
      totalCases: 45,
      resolved: 38,
      pending: 7,
      complianceRate: 98.5,
      averageResolutionTime: 3.2
    },
    yearToDate: {
      totalCases: 312,
      resolved: 289,
      pending: 23,
      complianceRate: 97.8,
      averageResolutionTime: 4.1
    }
  });

  return (
    <div className="space-y-6">
      {/* コンプライアンスメトリクス */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            コンプライアンスメトリクス
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">今月</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">通報件数</span>
                  <span className="text-2xl font-bold">{complianceMetrics.currentMonth.totalCases}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">解決率</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-green-600">
                      {Math.round((complianceMetrics.currentMonth.resolved / complianceMetrics.currentMonth.totalCases) * 100)}%
                    </span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      目標達成
                    </Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">平均解決日数</span>
                  <span className="text-lg font-medium">{complianceMetrics.currentMonth.averageResolutionTime}日</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">コンプライアンス率</span>
                  <span className="text-lg font-medium text-green-600">{complianceMetrics.currentMonth.complianceRate}%</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">年初来累計</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">通報件数</span>
                  <span className="text-2xl font-bold">{complianceMetrics.yearToDate.totalCases}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">解決率</span>
                  <span className="text-2xl font-bold">
                    {Math.round((complianceMetrics.yearToDate.resolved / complianceMetrics.yearToDate.totalCases) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">平均解決日数</span>
                  <span className="text-lg font-medium">{complianceMetrics.yearToDate.averageResolutionTime}日</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">コンプライアンス率</span>
                  <span className="text-lg font-medium">{complianceMetrics.yearToDate.complianceRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* レポートテンプレート */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            レポートテンプレート
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reportTemplates.map((template) => (
              <div key={template.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">{template.name}</h4>
                    <div className="flex gap-2 mt-2">
                      <Badge className="bg-blue-100 text-blue-800">
                        {template.type === 'monthly' ? '月次' :
                         template.type === 'committee' ? '委員会' : '監査'}
                      </Badge>
                      <Badge className="bg-gray-100 text-gray-700">
                        {template.sections.length}セクション
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      生成
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                      編集
                    </button>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">セクション:</span>
                    {template.sections.map((section) => section.title).join(', ')}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">フィルタ:</span>
                    {template.filters.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            新しいテンプレートを作成
          </button>
        </CardContent>
      </Card>

      {/* スケジュール設定 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            レポートスケジュール
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reportSchedules.map((schedule) => (
              <div key={schedule.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{schedule.template}</h4>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>频度: {schedule.frequency}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        <span>送信先: {schedule.recipients.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    有効
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            スケジュールを追加
          </button>
        </CardContent>
      </Card>

      {/* 監査ログ設定 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            監査ログ設定
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">ログ設定</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">詳細レベル</span>
                  <Badge className="bg-blue-100 text-blue-800">{auditSettings.detailLevel}</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">タイムスタンプ形式</span>
                  <span className="text-sm font-mono">{auditSettings.timestampFormat}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">保存期間</span>
                  <span className="text-sm font-medium">{auditSettings.retentionPeriod}日</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">セキュリティ</h4>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">ハッシュチェーン</span>
                  <input type="checkbox" checked={auditSettings.hashChaining} readOnly className="rounded" />
                </label>
                <label className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">改ざん検知</span>
                  <input type="checkbox" checked={auditSettings.tamperDetection} readOnly className="rounded" />
                </label>
                <label className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">圧縮</span>
                  <input type="checkbox" checked={auditSettings.compressionEnabled} readOnly className="rounded" />
                </label>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">監査ログ対象イベント</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {auditSettings.enabledEvents.map((event) => (
                <Badge key={event} className="bg-white text-blue-800 border border-blue-300">
                  {event}
                </Badge>
              ))}
            </div>
          </div>

          <Alert className="border-green-200 bg-green-50">
            <Hash className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>データ整合性保証</strong>
              <p className="mt-1 text-sm">
                すべての監査ログはSHA-256ハッシュチェーンで保護され、改ざんを検知できます。
                アーカイブは{auditSettings.encryptionKey}で暗号化されています。
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* コンプライアンスチェック */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            コンプライアンスチェック
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">小原病院ハラスメント防止規程</h4>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  準拠
                </Badge>
              </div>
              <p className="text-sm text-gray-600">最終確認: 2025年9月1日</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">公益通報者保護法</h4>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  準拠
                </Badge>
              </div>
              <p className="text-sm text-gray-600">最終確認: 2025年9月1日</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">個人情報保護法</h4>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  準拠
                </Badge>
              </div>
              <p className="text-sm text-gray-600">最終確認: 2025年9月1日</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">ISO 37001 (贈収賄防止マネジメント)</h4>
                <Badge className="bg-yellow-100 text-yellow-800">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  認証更新予定
                </Badge>
              </div>
              <p className="text-sm text-gray-600">次回監査: 2025年12月15日</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditReporting;