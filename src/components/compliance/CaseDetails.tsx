'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  User,
  Calendar,
  Clock,
  FileText,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  MessageSquare,
  Paperclip,
  ChevronRight,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface CaseDetailsProps {
  caseId: string;
}

const CaseDetails: React.FC<CaseDetailsProps> = ({ caseId }) => {
  const [showIdentity, setShowIdentity] = useState(false);
  const [accessJustification, setAccessJustification] = useState('');

  // ダミーデータ（実際はAPIから取得）
  const caseData = {
    id: caseId,
    voicedriveId: 'VD-2025-1234',
    anonymousId: 'ANON-5678',
    category: 'ハラスメント',
    subcategory: 'パワーハラスメント',
    severity: 'critical',
    status: 'investigating',
    createdAt: '2025-09-24T10:30:00',
    updatedAt: '2025-09-24T11:00:00',
    assignedTo: '竹内看護部長',
    assignedAt: '2025-09-24T10:45:00',
    disclosureLevel: 'conditional',

    // 事案内容（暗号化されていたものを復号化済み）
    incident: {
      description: '上司による継続的な人格否定的な発言および業務上不必要な叱責',
      occurredAt: '2025-09-20',
      location: '病棟A',
      witnessCount: 3,
      evidenceCount: 2
    },

    // 通報者情報（条件付き開示）
    reporter: {
      isAnonymous: true,
      consentLevel: 'conditional',
      department: '看護部', // 条件付きで開示
      // 実名は特定の条件下でのみ表示
      actualName: null
    },

    // 調査記録
    investigations: [
      {
        id: 'INV-001',
        date: '2025-09-24T11:00:00',
        investigator: '竹内看護部長',
        type: '初期ヒアリング',
        findings: '事実確認のため関係者への聞き取り調査を開始',
        nextAction: 'ハラスメント対策委員会への報告準備'
      }
    ],

    // アクションログ
    actionLogs: [
      {
        id: 'LOG-001',
        timestamp: '2025-09-24T10:30:00',
        action: 'ケース受信',
        user: 'システム',
        detail: 'VoiceDriveより暗号化通報を受信'
      },
      {
        id: 'LOG-002',
        timestamp: '2025-09-24T10:31:00',
        action: '自動トリアージ',
        user: 'システム',
        detail: '緊急度「重大」と判定、即時対応フラグを設定'
      },
      {
        id: 'LOG-003',
        timestamp: '2025-09-24T10:45:00',
        action: '担当者割当',
        user: '竹迫事務長',
        detail: '竹内看護部長を主担当者として割当'
      },
      {
        id: 'LOG-004',
        timestamp: '2025-09-24T11:00:00',
        action: '調査開始',
        user: '竹内看護部長',
        detail: '初期ヒアリングを実施'
      }
    ]
  };

  const handleIdentityAccess = () => {
    if (!accessJustification.trim()) {
      alert('アクセス理由を入力してください');
      return;
    }
    setShowIdentity(true);
    // 監査ログに記録
    console.log('Identity access granted:', { caseId, justification: accessJustification });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            ケース詳細
          </span>
          <Badge className="bg-red-100 text-red-800">
            緊急度: 重大
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 基本情報 */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">ケース番号:</span>
              <span className="ml-2 font-medium">{caseData.id}</span>
            </div>
            <div>
              <span className="text-gray-500">VoiceDrive ID:</span>
              <span className="ml-2 font-medium">{caseData.voicedriveId}</span>
            </div>
            <div>
              <span className="text-gray-500">カテゴリ:</span>
              <span className="ml-2 font-medium">{caseData.category}</span>
            </div>
            <div>
              <span className="text-gray-500">サブカテゴリ:</span>
              <span className="ml-2 font-medium">{caseData.subcategory}</span>
            </div>
            <div>
              <span className="text-gray-500">担当者:</span>
              <span className="ml-2 font-medium">{caseData.assignedTo}</span>
            </div>
            <div>
              <span className="text-gray-500">ステータス:</span>
              <Badge className="ml-2 bg-purple-100 text-purple-800">
                調査中
              </Badge>
            </div>
          </div>
        </div>

        {/* タブコンテンツ */}
        <Tabs defaultValue="incident" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="incident">事案詳細</TabsTrigger>
            <TabsTrigger value="reporter">通報者</TabsTrigger>
            <TabsTrigger value="investigation">調査</TabsTrigger>
            <TabsTrigger value="logs">ログ</TabsTrigger>
          </TabsList>

          <TabsContent value="incident" className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                事案内容
              </h4>
              <p className="text-sm text-gray-700">{caseData.incident.description}</p>
              <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                <div>
                  <span className="text-gray-500">発生日:</span>
                  <span className="ml-2">{caseData.incident.occurredAt}</span>
                </div>
                <div>
                  <span className="text-gray-500">場所:</span>
                  <span className="ml-2">{caseData.incident.location}</span>
                </div>
                <div>
                  <span className="text-gray-500">目撃者:</span>
                  <span className="ml-2">{caseData.incident.witnessCount}名</span>
                </div>
                <div>
                  <span className="text-gray-500">証拠:</span>
                  <span className="ml-2">{caseData.incident.evidenceCount}件</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reporter" className="space-y-3">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Lock className="h-4 w-4" />
                通報者情報（保護対象）
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">匿名ID:</span>
                  <span className="ml-2 font-mono">{caseData.anonymousId}</span>
                </div>
                <div>
                  <span className="text-gray-500">開示レベル:</span>
                  <Badge className="ml-2 bg-yellow-100 text-yellow-800">
                    条件付開示
                  </Badge>
                </div>
                <div>
                  <span className="text-gray-500">部署:</span>
                  <span className="ml-2">{caseData.reporter.department}</span>
                </div>

                {!showIdentity && (
                  <div className="mt-3 p-3 bg-white rounded border border-yellow-300">
                    <p className="text-xs text-yellow-800 mb-2">
                      <AlertCircle className="inline h-3 w-3 mr-1" />
                      実名の開示には正当な理由が必要です
                    </p>
                    <input
                      type="text"
                      placeholder="アクセス理由を入力..."
                      className="w-full px-2 py-1 text-sm border rounded mb-2"
                      value={accessJustification}
                      onChange={(e) => setAccessJustification(e.target.value)}
                    />
                    <button
                      onClick={handleIdentityAccess}
                      className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 flex items-center gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      実名を表示
                    </button>
                  </div>
                )}

                {showIdentity && (
                  <div className="mt-3 p-3 bg-red-50 rounded border border-red-300">
                    <p className="text-xs text-red-800 mb-1">
                      <AlertTriangle className="inline h-3 w-3 mr-1" />
                      機密情報 - アクセスログに記録されました
                    </p>
                    <div>
                      <span className="text-gray-500">実名:</span>
                      <span className="ml-2 font-medium">[権限により表示]</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="investigation" className="space-y-3">
            {caseData.investigations.map((inv) => (
              <div key={inv.id} className="p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{inv.type}</h4>
                  <span className="text-xs text-gray-500">
                    {formatDateTime(inv.date)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{inv.findings}</p>
                <div className="text-xs text-gray-500">
                  <span>調査者: {inv.investigator}</span>
                  {inv.nextAction && (
                    <span className="block mt-1">
                      <ChevronRight className="inline h-3 w-3" />
                      次のアクション: {inv.nextAction}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="logs" className="space-y-2">
            <div className="max-h-64 overflow-y-auto">
              {caseData.actionLogs.map((log) => (
                <div key={log.id} className="flex gap-2 text-sm py-2 border-b">
                  <div className="text-xs text-gray-500 w-32">
                    {formatDateTime(log.timestamp)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{log.action}</div>
                    <div className="text-xs text-gray-600">
                      {log.user} - {log.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* アクションボタン */}
        <div className="pt-4 space-y-2">
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
            <MessageSquare className="h-4 w-4" />
            調査記録を追加
          </button>
          <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
            <Paperclip className="h-4 w-4" />
            証拠を添付
          </button>
          <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            エスカレーション
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseDetails;