'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Shield,
  AlertTriangle,
  FileText,
  Users,
  Lock,
  CheckCircle,
  Clock,
  Eye,
  Search,
  Filter,
  BarChart3,
  Bell
} from 'lucide-react';
import CaseList from './CaseList';
import CaseDetails from './CaseDetails';
import IncomingReports from './IncomingReports';
import StatisticsView from './StatisticsView';

const CompliancePortal: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('cases');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  // サマリー統計データ
  const summaryStats = {
    newReports: 3,
    inProgress: 12,
    resolved: 45,
    critical: 2,
    averageResponseTime: '2.5時間',
    complianceRate: 98.5
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            コンプライアンス窓口
          </h1>
          <p className="text-gray-600 mt-2">
            ハラスメント・不正行為通報管理システム（小原病院規定準拠）
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Bell className="h-4 w-4" />
            通知設定
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            レポート出力
          </button>
        </div>
      </div>

      {/* 緊急アラート */}
      {summaryStats.critical > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>緊急対応が必要な案件があります</strong>
            <span className="ml-2">
              {summaryStats.critical}件の重大案件が未対応です。至急確認してください。
            </span>
          </AlertDescription>
        </Alert>
      )}

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              新規通報
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summaryStats.newReports}</div>
            <p className="text-xs text-gray-500 mt-1">要対応</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              調査中
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{summaryStats.inProgress}</div>
            <p className="text-xs text-gray-500 mt-1">処理中</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              解決済み
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summaryStats.resolved}</div>
            <p className="text-xs text-gray-500 mt-1">今月</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              重大案件
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summaryStats.critical}</div>
            <p className="text-xs text-gray-500 mt-1">Critical</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              平均対応時間
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.averageResponseTime}</div>
            <p className="text-xs text-gray-500 mt-1">初動まで</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              コンプライアンス率
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summaryStats.complianceRate}%</div>
            <p className="text-xs text-gray-500 mt-1">目標 95%</p>
          </CardContent>
        </Card>
      </div>

      {/* メインタブコンテンツ */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="incoming" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            新規受信
            {summaryStats.newReports > 0 && (
              <Badge className="ml-1 bg-red-600 text-white">
                {summaryStats.newReports}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="cases" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            ケース管理
          </TabsTrigger>
          <TabsTrigger value="investigation" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            調査管理
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            統計分析
          </TabsTrigger>
        </TabsList>

        <TabsContent value="incoming" className="space-y-4">
          <IncomingReports onSelectCase={setSelectedCaseId} />
        </TabsContent>

        <TabsContent value="cases" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CaseList onSelectCase={setSelectedCaseId} selectedCaseId={selectedCaseId} />
            </div>
            <div className="lg:col-span-1">
              {selectedCaseId ? (
                <CaseDetails caseId={selectedCaseId} />
              ) : (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500">
                    <Eye className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>ケースを選択して詳細を表示</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="investigation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>調査管理</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">調査プロセス管理機能（実装予定）</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <StatisticsView />
        </TabsContent>
      </Tabs>

      {/* セキュリティ情報 */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-blue-900 flex items-center gap-2">
            <Lock className="h-4 w-4" />
            セキュリティ情報
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• すべての通信は暗号化されています（AES-256-GCM）</p>
            <p>• アクセスログは改ざん防止のためハッシュチェーンで保護されています</p>
            <p>• 通報者の匿名性は厳格に保護されています</p>
            <p>• 小原病院ハラスメント防止規程・公益通報規程に準拠</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompliancePortal;