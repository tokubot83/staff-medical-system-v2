'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  ChevronRight,
  Clock,
  User,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Case {
  id: string;
  anonymousId: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'received' | 'triaging' | 'investigating' | 'escalated' | 'resolved' | 'closed';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  summary: string;
  disclosureLevel: 'full_anonymous' | 'conditional' | 'disclosed';
}

interface CaseListProps {
  onSelectCase: (caseId: string) => void;
  selectedCaseId: string | null;
}

const CaseList: React.FC<CaseListProps> = ({ onSelectCase, selectedCaseId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const [cases] = useState<Case[]>([
    {
      id: 'MED-2025-0001',
      anonymousId: 'ANON-5678',
      category: 'ハラスメント',
      severity: 'critical',
      status: 'investigating',
      assignedTo: '竹内看護部長',
      createdAt: '2025-09-24T10:30:00',
      updatedAt: '2025-09-24T11:00:00',
      summary: 'パワーハラスメントに関する重大な通報',
      disclosureLevel: 'conditional'
    },
    {
      id: 'MED-2025-0002',
      anonymousId: 'ANON-5679',
      category: '診療報酬不正',
      severity: 'high',
      status: 'triaging',
      assignedTo: '竹迫事務長',
      createdAt: '2025-09-24T09:15:00',
      updatedAt: '2025-09-24T09:30:00',
      summary: '診療報酬請求に関する不適切な処理の疑い',
      disclosureLevel: 'full_anonymous'
    },
    {
      id: 'MED-2025-0003',
      anonymousId: 'ANON-5680',
      category: '労働条件',
      severity: 'medium',
      status: 'investigating',
      assignedTo: '法人人事部',
      createdAt: '2025-09-24T08:45:00',
      updatedAt: '2025-09-24T10:00:00',
      summary: '時間外労働に関する労働基準法違反の疑い',
      disclosureLevel: 'full_anonymous'
    },
    {
      id: 'MED-2025-0004',
      anonymousId: 'ANON-5681',
      category: '個人情報漏洩',
      severity: 'high',
      status: 'resolved',
      assignedTo: '竹迫事務長',
      createdAt: '2025-09-23T14:30:00',
      updatedAt: '2025-09-24T08:00:00',
      summary: '患者情報の不適切な取り扱い',
      disclosureLevel: 'disclosed'
    },
    {
      id: 'MED-2025-0005',
      anonymousId: 'ANON-5682',
      category: '医療安全',
      severity: 'low',
      status: 'closed',
      assignedTo: '竹内看護部長',
      createdAt: '2025-09-22T11:00:00',
      updatedAt: '2025-09-23T16:00:00',
      summary: '医療機器の管理に関する改善提案',
      disclosureLevel: 'full_anonymous'
    }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-gray-100 text-gray-800';
      case 'triaging': return 'bg-blue-100 text-blue-800';
      case 'investigating': return 'bg-purple-100 text-purple-800';
      case 'escalated': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'received': return '受信済';
      case 'triaging': return 'トリアージ中';
      case 'investigating': return '調査中';
      case 'escalated': return 'エスカレーション';
      case 'resolved': return '解決済';
      case 'closed': return 'クローズ';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <XCircle className="h-4 w-4" />;
      case 'escalated': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getDisclosureLevelLabel = (level: string) => {
    switch (level) {
      case 'full_anonymous': return '完全匿名';
      case 'conditional': return '条件付開示';
      case 'disclosed': return '開示済';
      default: return level;
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

  // フィルタリング処理
  const filteredCases = cases.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || c.severity === filterSeverity;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  return (
    <div className="space-y-4">
      {/* 検索・フィルタ */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">ケース検索</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="ケース番号、カテゴリ、概要で検索..."
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border rounded-lg bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">全ステータス</option>
                <option value="received">受信済</option>
                <option value="triaging">トリアージ中</option>
                <option value="investigating">調査中</option>
                <option value="escalated">エスカレーション</option>
                <option value="resolved">解決済</option>
                <option value="closed">クローズ</option>
              </select>
              <select
                className="px-3 py-2 border rounded-lg bg-white"
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
              >
                <option value="all">全緊急度</option>
                <option value="critical">重大</option>
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ケースリスト */}
      <div className="space-y-2">
        {filteredCases.map((caseItem) => (
          <Card
            key={caseItem.id}
            className={`cursor-pointer hover:shadow-md transition-shadow ${
              selectedCaseId === caseItem.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onSelectCase(caseItem.id)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">{caseItem.id}</span>
                    <Badge className={getSeverityColor(caseItem.severity)}>
                      {caseItem.severity === 'critical' ? '重大' :
                       caseItem.severity === 'high' ? '高' :
                       caseItem.severity === 'medium' ? '中' : '低'}
                    </Badge>
                    <Badge className={getStatusColor(caseItem.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(caseItem.status)}
                        {getStatusLabel(caseItem.status)}
                      </span>
                    </Badge>
                    <Badge className="bg-gray-100 text-gray-700">
                      {getDisclosureLevelLabel(caseItem.disclosureLevel)}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-700">{caseItem.summary}</p>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {caseItem.category}
                    </span>
                    {caseItem.assignedTo && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {caseItem.assignedTo}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      作成: {formatDateTime(caseItem.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      更新: {formatDateTime(caseItem.updatedAt)}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 mt-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 結果サマリー */}
      <div className="text-sm text-gray-600 text-center py-2">
        {filteredCases.length}件のケースを表示中
      </div>
    </div>
  );
};

export default CaseList;