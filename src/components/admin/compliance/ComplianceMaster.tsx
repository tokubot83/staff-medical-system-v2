'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Database,
  GitBranch,
  Users,
  Lock,
  FileText,
  Bell,
  BarChart3,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import VoiceDriveIntegration from './VoiceDriveIntegration';
import CaseWorkflow from './CaseWorkflow';
import CommitteeManager from './CommitteeManager';
import AnonymityProtection from './AnonymityProtection';
import AuditReporting from './AuditReporting';
import NotificationConfig from './NotificationConfig';

const ComplianceMaster: React.FC = () => {
  const [activeTab, setActiveTab] = useState('voicedrive');

  // ダッシュボード統計
  const stats = {
    totalCases: 312,
    activeCases: 23,
    resolvedThisMonth: 38,
    complianceRate: 98.5,
    committees: 3,
    activeInvestigations: 7,
    pendingReports: 4,
    criticalAlerts: 2
  };

  return (
    <div className="p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            コンプライアンスマスター設定
          </h1>
          <p className="text-gray-600 mt-2">
            VoiceDrive統合型コンプライアンス管理システムの設定とカスタマイズ
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-green-100 text-green-800 px-3 py-1">
            <CheckCircle className="h-4 w-4 mr-1" />
            システム正常稼働中
          </Badge>
          {stats.criticalAlerts > 0 && (
            <Badge className="bg-red-100 text-red-800 px-3 py-1 animate-pulse">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {stats.criticalAlerts}件の重大案件
            </Badge>
          )}
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              総ケース数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCases}</div>
            <p className="text-xs text-gray-500 mt-1">年初来累計</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              アクティブケース
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.activeCases}</div>
            <p className="text-xs text-gray-500 mt-1">調査中</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              今月解決
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolvedThisMonth}</div>
            <p className="text-xs text-gray-500 mt-1">前月比 +15%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              コンプライアンス率
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.complianceRate}%</div>
            <p className="text-xs text-gray-500 mt-1">目標 95%</p>
          </CardContent>
        </Card>
      </div>

      {/* メインタブ */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 h-auto">
          <TabsTrigger value="voicedrive" className="flex flex-col items-center gap-1 h-auto py-3">
            <Database className="h-5 w-5" />
            <span className="text-xs">VoiceDrive連携</span>
          </TabsTrigger>
          <TabsTrigger value="workflow" className="flex flex-col items-center gap-1 h-auto py-3">
            <GitBranch className="h-5 w-5" />
            <span className="text-xs">ワークフロー</span>
          </TabsTrigger>
          <TabsTrigger value="committee" className="flex flex-col items-center gap-1 h-auto py-3">
            <Users className="h-5 w-5" />
            <span className="text-xs">委員会管理</span>
          </TabsTrigger>
          <TabsTrigger value="anonymity" className="flex flex-col items-center gap-1 h-auto py-3">
            <Lock className="h-5 w-5" />
            <span className="text-xs">匿名性保護</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex flex-col items-center gap-1 h-auto py-3">
            <FileText className="h-5 w-5" />
            <span className="text-xs">監査・報告</span>
          </TabsTrigger>
          <TabsTrigger value="notification" className="flex flex-col items-center gap-1 h-auto py-3">
            <Bell className="h-5 w-5" />
            <span className="text-xs">通知設定</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="voicedrive" className="mt-6">
          <VoiceDriveIntegration />
        </TabsContent>

        <TabsContent value="workflow" className="mt-6">
          <CaseWorkflow />
        </TabsContent>

        <TabsContent value="committee" className="mt-6">
          <CommitteeManager />
        </TabsContent>

        <TabsContent value="anonymity" className="mt-6">
          <AnonymityProtection />
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <AuditReporting />
        </TabsContent>

        <TabsContent value="notification" className="mt-6">
          <NotificationConfig />
        </TabsContent>
      </Tabs>

      {/* フッター情報 */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium text-blue-900">システム情報</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div>
              <span className="text-blue-600">準拠規程:</span>
              <ul className="mt-1 space-y-0.5 text-xs">
                <li>• 小原病院ハラスメント防止規程</li>
                <li>• 公益通報者保護法</li>
                <li>• 個人情報保護法</li>
              </ul>
            </div>
            <div>
              <span className="text-blue-600">セキュリティ:</span>
              <ul className="mt-1 space-y-0.5 text-xs">
                <li>• エンドツーエンド暗号化 (AES-256-GCM)</li>
                <li>• ハッシュチェーン監査ログ</li>
                <li>• 多要素認証必須</li>
              </ul>
            </div>
            <div>
              <span className="text-blue-600">統合システム:</span>
              <ul className="mt-1 space-y-0.5 text-xs">
                <li>• VoiceDrive AI通報システム</li>
                <li>• Microsoft Teams/Slack</li>
                <li>• 監査レポートシステム</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceMaster;