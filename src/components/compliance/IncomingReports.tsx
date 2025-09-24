'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertTriangle,
  Clock,
  FileText,
  Shield,
  ChevronRight,
  Lock,
  User,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface IncomingReport {
  id: string;
  voicedriveId: string;
  anonymousId: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  receivedAt: string;
  status: 'new' | 'acknowledged' | 'assigned';
  summary: string;
  requiresImmediateAction: boolean;
  encryptionStatus: 'encrypted' | 'decrypted';
}

interface IncomingReportsProps {
  onSelectCase: (caseId: string) => void;
}

const IncomingReports: React.FC<IncomingReportsProps> = ({ onSelectCase }) => {
  const [reports] = useState<IncomingReport[]>([
    {
      id: 'MED-2025-0001',
      voicedriveId: 'VD-2025-1234',
      anonymousId: 'ANON-5678',
      category: 'ハラスメント',
      severity: 'critical',
      receivedAt: '2025-09-24T10:30:00',
      status: 'new',
      summary: 'パワーハラスメントに関する重大な通報',
      requiresImmediateAction: true,
      encryptionStatus: 'decrypted'
    },
    {
      id: 'MED-2025-0002',
      voicedriveId: 'VD-2025-1235',
      anonymousId: 'ANON-5679',
      category: '診療報酬不正',
      severity: 'high',
      receivedAt: '2025-09-24T09:15:00',
      status: 'acknowledged',
      summary: '診療報酬請求に関する不適切な処理の疑い',
      requiresImmediateAction: false,
      encryptionStatus: 'decrypted'
    },
    {
      id: 'MED-2025-0003',
      voicedriveId: 'VD-2025-1236',
      anonymousId: 'ANON-5680',
      category: '労働条件',
      severity: 'medium',
      receivedAt: '2025-09-24T08:45:00',
      status: 'assigned',
      summary: '時間外労働に関する労働基準法違反の疑い',
      requiresImmediateAction: false,
      encryptionStatus: 'decrypted'
    }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'critical': return '重大';
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return severity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-600 text-white';
      case 'acknowledged': return 'bg-blue-600 text-white';
      case 'assigned': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return '新規';
      case 'acknowledged': return '確認済';
      case 'assigned': return '担当者割当済';
      default: return status;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAcknowledge = (reportId: string) => {
    console.log('Acknowledging report:', reportId);
  };

  const handleAssign = (reportId: string) => {
    console.log('Assigning report:', reportId);
  };

  const criticalReports = reports.filter(r => r.severity === 'critical' && r.status === 'new');

  return (
    <div className="space-y-4">
      {/* 緊急対応アラート */}
      {criticalReports.length > 0 && (
        <Alert className="border-red-300 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong className="block mb-2">緊急対応が必要です！</strong>
            {criticalReports.map(report => (
              <div key={report.id} className="mb-1">
                • ケース番号 {report.id}: {report.summary}
              </div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">VoiceDriveからの新規通報</h2>
        <div className="flex gap-2">
          <Badge className="bg-blue-100 text-blue-800">
            自動受信: 有効
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            暗号化: AES-256-GCM
          </Badge>
        </div>
      </div>

      {/* 通報リスト */}
      <div className="space-y-3">
        {reports.map((report) => (
          <Card
            key={report.id}
            className={`cursor-pointer hover:shadow-lg transition-shadow ${
              report.requiresImmediateAction ? 'border-red-300 bg-red-50' : ''
            }`}
            onClick={() => onSelectCase(report.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{report.id}</CardTitle>
                    <Badge className={getSeverityColor(report.severity)}>
                      緊急度: {getSeverityLabel(report.severity)}
                    </Badge>
                    <Badge className={getStatusColor(report.status)}>
                      {getStatusLabel(report.status)}
                    </Badge>
                    {report.requiresImmediateAction && (
                      <Badge className="bg-red-600 text-white animate-pulse">
                        即時対応
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      匿名ID: {report.anonymousId}
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      VoiceDrive ID: {report.voicedriveId}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDateTime(report.receivedAt)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className={`h-4 w-4 ${
                    report.encryptionStatus === 'encrypted' ? 'text-red-600' : 'text-green-600'
                  }`} />
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Badge className="bg-blue-100 text-blue-800">
                    {report.category}
                  </Badge>
                  <p className="text-sm text-gray-700 flex-1">{report.summary}</p>
                </div>

                {/* アクションボタン */}
                {report.status === 'new' && (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcknowledge(report.id);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      受信確認
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAssign(report.id);
                      }}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      担当者割当
                    </button>
                  </div>
                )}

                {/* 対応時間目安 */}
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">
                    対応期限: {
                      report.severity === 'critical' ? '1時間以内' :
                      report.severity === 'high' ? '当日中' :
                      report.severity === 'medium' ? '3営業日以内' :
                      '1週間以内'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 受信プロトコル情報 */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-blue-900 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            受信プロトコル情報
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• VoiceDriveからの通報は自動的に暗号化され、安全に受信されます</p>
            <p>• 受信後、ケース番号（MED-YYYY-XXXX形式）が自動発番されます</p>
            <p>• 緊急度に応じて担当者への通知が自動送信されます</p>
            <p>• すべての受信記録は監査ログに記録されます</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IncomingReports;