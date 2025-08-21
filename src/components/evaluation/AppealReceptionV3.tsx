'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  FileText,
  MessageSquare,
  User,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Download,
  Upload,
  Eye,
  AlertTriangle,
  Shield,
  TrendingUp,
  RefreshCw,
  XCircle,
  FileUp,
  MessageCircle,
  ChevronRight,
  BarChart3,
  FileCheck,
  ClipboardCheck,
  Users,
  Smartphone,
  Mail,
  Bell,
  BookOpen,
  CheckSquare,
  Sparkles,
  Calculator
} from 'lucide-react';
// V3評価システム専用 - CSSは不要（インライン・Tailwindを使用）

// V3評価システム用の型定義
interface V3AppealRecord {
  appealId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  evaluationPeriod: string;
  appealCategory: 'criteria-misinterpretation' | 'achievement-oversight' | 'period-error' | 'calculation-error' | 'relative-evaluation-error' | 'other';
  appealReason: string;
  // V3評価システム専用スコア構造
  originalScores: {
    technical: { coreItems: number; facilityItems: number; total: number; };
    contribution: { summerFacility: number; summerCorporate: number; winterFacility: number; winterCorporate: number; total: number; };
    totalScore: number;
  };
  requestedScores?: {
    technical: { coreItems: number; facilityItems: number; total: number; };
    contribution: { summerFacility: number; summerCorporate: number; winterFacility: number; winterCorporate: number; total: number; };
    totalScore: number;
  };
  finalScores?: {
    technical: { coreItems: number; facilityItems: number; total: number; };
    contribution: { summerFacility: number; summerCorporate: number; winterFacility: number; winterCorporate: number; total: number; };
    totalScore: number;
  };
  // V3相対評価結果
  originalGrades: {
    facilityGrade: 'S' | 'A' | 'B' | 'C' | 'D';
    corporateGrade: 'S' | 'A' | 'B' | 'C' | 'D';
    finalGrade: 'S+' | 'S' | 'A+' | 'A' | 'B' | 'C' | 'D';
  };
  requestedGrades?: {
    facilityGrade: 'S' | 'A' | 'B' | 'C' | 'D';
    corporateGrade: 'S' | 'A' | 'B' | 'C' | 'D';
    finalGrade: 'S+' | 'S' | 'A+' | 'A' | 'B' | 'C' | 'D';
  };
  finalGrades?: {
    facilityGrade: 'S' | 'A' | 'B' | 'C' | 'D';
    corporateGrade: 'S' | 'A' | 'B' | 'C' | 'D';
    finalGrade: 'S+' | 'S' | 'A+' | 'A' | 'B' | 'C' | 'D';
  };
  status: 'received' | 'under-review' | 'additional-info' | 'resolved' | 'withdrawn' | 'rejected';
  priority?: 'high' | 'medium' | 'low';
  filedDate: string;
  lastUpdated: string;
  evidenceDocuments?: string[];
  reviewerComments?: string;
  submittedVia?: 'voicedrive' | 'paper' | 'email' | 'system';
  voiceDriveNotified?: boolean;
  voiceDriveResponseReceived?: boolean;
  voiceDriveConversationId?: string;
  // V3専用フィールド
  evaluationPhase?: 'summer' | 'winter' | 'final';
  relativeEvaluationDispute?: {
    facilityRankingDispute: boolean;
    corporateRankingDispute: boolean;
    jobCategoryRankingDispute: boolean;
  };
}

interface V3AppealCase {
  id: string;
  staffName: string;
  filedDate: string;
  reason: string;
  category: string;
  status: 'filed' | 'reviewing' | 'additional-info' | 'resolved';
  // V3スコア構造
  originalScores: {
    technical: number;
    contribution: number;
    total: number;
  };
  requestedScores?: {
    technical: number;
    contribution: number;
    total: number;
  };
  finalScores?: {
    technical: number;
    contribution: number;
    total: number;
  };
  // V3グレード
  originalGrade: string;
  requestedGrade?: string;
  finalGrade?: string;
  reviewerNotes?: string;
  voiceDriveNotified?: boolean;
  voiceDriveConversationId?: string;
  evaluationPhase?: 'summer' | 'winter' | 'final';
}

// トースト通知（V2から移植）
const toast = {
  success: (message: string) => {
    console.log('✅', message);
    if (typeof window !== 'undefined') {
      const div = document.createElement('div');
      div.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50';
      div.textContent = message;
      document.body.appendChild(div);
      setTimeout(() => div.remove(), 3000);
    }
  },
  error: (message: string) => {
    console.error('❌', message);
    if (typeof window !== 'undefined') {
      const div = document.createElement('div');
      div.className = 'fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50';
      div.textContent = message;
      document.body.appendChild(div);
      setTimeout(() => div.remove(), 3000);
    }
  }
};

export default function AppealReceptionV3() {
  const [activeTab, setActiveTab] = useState('voicedrive-guide');
  const [appeals, setAppeals] = useState<V3AppealRecord[]>([]);
  const [selectedAppeal, setSelectedAppeal] = useState<V3AppealRecord | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showVoiceDriveDialog, setShowVoiceDriveDialog] = useState(false);
  const [showCaseDetailDialog, setShowCaseDetailDialog] = useState(false);
  const [selectedCase, setSelectedCase] = useState<V3AppealCase | null>(null);
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceDriveMessage, setVoiceDriveMessage] = useState('V3評価システムでの異議申し立てを受け付けました。技術評価50点+組織貢献50点の評価構造を考慮して審査いたします。結果は3週間以内にお知らせします。');

  // V3異議申し立てケースデータ（モック）
  const [appealCases, setAppealCases] = useState<V3AppealCase[]>([
    {
      id: 'V3AP001',
      staffName: '田中 次郎',
      filedDate: '2025-04-15',
      reason: '技術評価の法人統一項目で、研修講師実績が適切に評価されていない。50点満点中の配点が不適切。',
      category: '成果の見落とし',
      status: 'reviewing',
      originalScores: { technical: 23, contribution: 22, total: 45 },
      requestedScores: { technical: 27, contribution: 22, total: 49 },
      originalGrade: 'B',
      requestedGrade: 'A',
      evaluationPhase: 'final',
      voiceDriveNotified: true,
      voiceDriveConversationId: 'vd_conv_12345'
    },
    {
      id: 'V3AP002',
      staffName: '佐藤 美咲',
      filedDate: '2025-04-12',
      reason: '組織貢献度評価で、冬季の法人貢献12.5点の相対評価順位に誤りがある。施設内順位が正しく反映されていない。',
      category: '相対評価の誤り',
      status: 'additional-info',
      originalScores: { technical: 25, contribution: 18, total: 43 },
      requestedScores: { technical: 25, contribution: 23, total: 48 },
      originalGrade: 'C',
      requestedGrade: 'B',
      evaluationPhase: 'winter',
      voiceDriveNotified: false
    },
    {
      id: 'V3AP003',
      staffName: '山田 太郎',
      filedDate: '2025-04-10',
      reason: '総合100点評価での2軸マトリックス7段階相対評価において、同職種内での順位計算に誤りがある。',
      category: '相対評価の誤り',
      status: 'resolved',
      originalScores: { technical: 24, contribution: 21, total: 45 },
      requestedScores: { technical: 24, contribution: 21, total: 45 },
      finalScores: { technical: 24, contribution: 21, total: 45 },
      originalGrade: 'B',
      finalGrade: 'A',
      evaluationPhase: 'final',
      voiceDriveNotified: true,
      voiceDriveConversationId: 'vd_conv_67890',
      reviewerNotes: '同職種内順位の再計算により、最終グレードをBからAに修正しました。'
    }
  ]);

  useEffect(() => {
    fetchV3Appeals();
  }, []);

  const fetchV3Appeals = async () => {
    try {
      const response = await fetch('/api/v3/appeals/list?employeeId=current', {
        headers: {
          'Authorization': 'Bearer vd_dev_key_12345',
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success && data.data) {
        setAppeals(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch V3 appeals:', error);
    }
  };


  // VoiceDrive SNS送信処理（V2から移植・V3対応）
  const handleVoiceDriveSend = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v3/appeals/voicedrive-notify', {
        method: 'POST',
        headers: { 
          'Authorization': 'Bearer vd_dev_key_12345',
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          appealIds: selectedCases,
          message: voiceDriveMessage,
          evaluationSystem: 'v3',
          includeScoreBreakdown: true,
          includeRelativeRanking: true
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`${selectedCases.length}件のV3評価 VoiceDrive通知を送信しました`);
        setShowVoiceDriveDialog(false);
        setSelectedCases([]);
        
        // ケースデータを更新（V3用）
        setAppealCases(prev => prev.map(c => 
          selectedCases.includes(c.id) 
            ? { 
                ...c, 
                voiceDriveNotified: true,
                voiceDriveConversationId: data.conversationIds?.[c.id] || `vd_conv_${Date.now()}`
              }
            : c
        ));
      } else {
        toast.error(data.error?.message || 'VoiceDrive送信に失敗しました');
      }
    } catch (error) {
      toast.error('VoiceDrive送信中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // ケース選択切り替え
  const toggleCaseSelection = (caseId: string) => {
    setSelectedCases(prev => 
      prev.includes(caseId) 
        ? prev.filter(id => id !== caseId)
        : [...prev, caseId]
    );
  };

  // ケースステータス更新（V3専用）
  const updateCaseStatus = async (caseId: string, newStatus: string, reviewerNotes?: string) => {
    try {
      const response = await fetch(`/api/v3/appeals/cases/${caseId}/status`, {
        method: 'PATCH',
        headers: { 
          'Authorization': 'Bearer vd_dev_key_12345',
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          status: newStatus, 
          reviewerNotes,
          evaluationSystem: 'v3' 
        })
      });

      const data = await response.json();
      if (data.success) {
        setAppealCases(prev => prev.map(c => 
          c.id === caseId 
            ? { ...c, status: newStatus as any, reviewerNotes }
            : c
        ));
        toast.success('ステータスを更新しました');
      }
    } catch (error) {
      toast.error('ステータス更新に失敗しました');
    }
  };


  const getV3StatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      'received': { color: 'bg-blue-100 text-blue-800', label: '受理済み' },
      'under-review': { color: 'bg-yellow-100 text-yellow-800', label: '審査中' },
      'additional-info': { color: 'bg-orange-100 text-orange-800', label: '追加情報待ち' },
      'resolved': { color: 'bg-green-100 text-green-800', label: '解決済み' },
      'withdrawn': { color: 'bg-gray-100 text-gray-800', label: '取り下げ' },
      'rejected': { color: 'bg-red-100 text-red-800', label: '却下' },
      'filed': { color: 'bg-purple-100 text-purple-800', label: '申請受理' },
      'reviewing': { color: 'bg-orange-100 text-orange-800', label: '審査中' },
    };
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null;
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return <Badge className={colors[priority as keyof typeof colors]}>{priority}</Badge>;
  };

  // V3統計計算
  const statistics = {
    total: appealCases.length,
    pending: appealCases.filter(a => a.status === 'filed').length,
    reviewing: appealCases.filter(a => a.status === 'reviewing').length,
    resolved: appealCases.filter(a => a.status === 'resolved').length,
    rejected: appealCases.filter(a => a.status === 'resolved' && !a.finalScores).length,
    voiceDriveNotified: appealCases.filter(c => c.voiceDriveNotified).length,
    appealsActive: appealCases.filter(c => c.status !== 'resolved').length,
    averageResolutionTime: 18,
    technicalDisputes: appealCases.filter(c => c.reason.includes('技術評価')).length,
    contributionDisputes: appealCases.filter(c => c.reason.includes('組織貢献')).length,
    relativeEvaluationDisputes: appealCases.filter(c => c.reason.includes('相対評価')).length
  };

  return (
    <div className="space-y-6">
      {/* V3評価システム専用ヘッダー */}
      <Card className="border-2 border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            V3評価システム 異議申し立て受信・管理
          </CardTitle>
          <CardDescription>
            VoiceDriveからの異議申し立て受信と評価者による管理（職員は VoiceDrive で申し立て）
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              <span>技術評価: 法人統一25点 + 施設固有25点</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span>組織貢献: 夏季25点 + 冬季25点</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              <span>相対評価: 2軸マトリックス7段階</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ヘッダー統計（V3専用） */}
      <div className="grid grid-cols-8 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">総申立数</p>
                <p className="text-2xl font-bold">{statistics.total}</p>
              </div>
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">審査中</p>
                <p className="text-2xl font-bold text-orange-600">{statistics.reviewing}</p>
              </div>
              <RefreshCw className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">解決済</p>
                <p className="text-2xl font-bold text-green-600">{statistics.resolved}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">技術評価</p>
                <p className="text-2xl font-bold text-blue-600">{statistics.technicalDisputes}</p>
              </div>
              <Calculator className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">組織貢献</p>
                <p className="text-2xl font-bold text-green-600">{statistics.contributionDisputes}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">相対評価</p>
                <p className="text-2xl font-bold text-purple-600">{statistics.relativeEvaluationDisputes}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">VoiceDrive</p>
                <p className="text-2xl font-bold text-indigo-600">{statistics.voiceDriveNotified}</p>
              </div>
              <Smartphone className="w-8 h-8 text-indigo-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">平均処理</p>
                <p className="text-2xl font-bold text-gray-600">{statistics.averageResolutionTime}日</p>
              </div>
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full max-w-4xl">
          <TabsTrigger value="voicedrive-guide">VoiceDrive申し立て</TabsTrigger>
          <TabsTrigger value="list">申し立て一覧</TabsTrigger>
          <TabsTrigger value="timeline">審査状況</TabsTrigger>
          <TabsTrigger value="cases">ケース管理</TabsTrigger>
          <TabsTrigger value="process">V3プロセス</TabsTrigger>
          <TabsTrigger value="guide">V3ガイド</TabsTrigger>
        </TabsList>

        {/* VoiceDrive申し立てガイドタブ */}
        <TabsContent value="voicedrive-guide" className="space-y-6">
          <Card className="border-2 border-indigo-200 bg-indigo-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-6 h-6 text-indigo-600" />
                V3評価システム 異議申し立て - VoiceDriveで申請
              </CardTitle>
              <CardDescription>
                V3評価システムでは、異議申し立てはVoiceDriveアプリから行ってください
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>重要なご案内</AlertTitle>
                <AlertDescription>
                  V3評価システムでは、職員による異議申し立ては <strong>VoiceDriveアプリ</strong> からのみ受け付けております。
                  このページは評価者・人事担当者による管理画面です。
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-6">
                <Card className="border-dashed border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-600 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      職員の方へ
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold text-green-600">1</div>
                        <div>
                          <p className="font-medium">VoiceDriveアプリを開く</p>
                          <p className="text-sm text-gray-600">スマートフォンまたはPCでVoiceDriveにアクセス</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold text-green-600">2</div>
                        <div>
                          <p className="font-medium">評価結果を確認</p>
                          <p className="text-sm text-gray-600">技術評価50点＋組織貢献50点の詳細を確認</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold text-green-600">3</div>
                        <div>
                          <p className="font-medium">異議申し立てを送信</p>
                          <p className="text-sm text-gray-600">VoiceDrive内の異議申し立てフォームから送信</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-700">
                        <strong>VoiceDriveなら:</strong> チャット形式で分かりやすく申し立て可能
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-dashed border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-600 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      評価者・人事の方へ
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold text-blue-600">1</div>
                        <div>
                          <p className="font-medium">VoiceDriveから受信</p>
                          <p className="text-sm text-gray-600">職員からの異議申し立てを自動受信</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold text-blue-600">2</div>
                        <div>
                          <p className="font-medium">ケース管理タブで審査</p>
                          <p className="text-sm text-gray-600">V3詳細スコア構造での審査・対応</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold text-blue-600">3</div>
                        <div>
                          <p className="font-medium">結果をVoiceDriveで通知</p>
                          <p className="text-sm text-gray-600">審査結果を職員にVoiceDrive経由で送信</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <strong>管理画面では:</strong> 受信した申し立ての審査・管理に専念
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-2 border-purple-200 bg-purple-50/50">
                <CardHeader>
                  <CardTitle className="text-purple-600 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    V3評価システムの特徴
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                        <Calculator className="w-6 h-6 text-purple-600" />
                      </div>
                      <p className="font-medium">技術評価 50点</p>
                      <p className="text-sm text-gray-600">法人統一25点＋施設固有25点</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                      </div>
                      <p className="font-medium">組織貢献 50点</p>
                      <p className="text-sm text-gray-600">夏季25点＋冬季25点</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                        <BarChart3 className="w-6 h-6 text-purple-600" />
                      </div>
                      <p className="font-medium">相対評価</p>
                      <p className="text-sm text-gray-600">2軸マトリックス7段階</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card className="border-dashed">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-green-600" />
                      VoiceDriveで申し立て可能な内容
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm">
                      <li>✓ 技術評価項目のスコア異議</li>
                      <li>✓ 組織貢献度の評価異議</li>
                      <li>✓ 施設内・法人内順位の異議</li>
                      <li>✓ 相対評価マトリックスの異議</li>
                      <li>✓ 評価期間・フェーズの誤り</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-dashed">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      処理時間
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>受理通知:</span>
                        <span className="font-medium">即座</span>
                      </div>
                      <div className="flex justify-between">
                        <span>初回回答:</span>
                        <span className="font-medium">3営業日以内</span>
                      </div>
                      <div className="flex justify-between">
                        <span>最終結果:</span>
                        <span className="font-medium">3週間以内</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800">システム移行のお知らせ</AlertTitle>
                <AlertDescription className="text-amber-700">
                  V3評価システムでは、職員と評価者の役割を明確に分離しました。
                  <br />• <strong>職員</strong>: VoiceDriveで異議申し立て・進捗確認
                  <br />• <strong>評価者</strong>: 医療システムで受信・審査・管理
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ケース管理タブ（V3対応） */}
        <TabsContent value="cases" className="space-y-6">
          {/* V3ケース管理テーブル */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>V3異議申し立てケース管理</CardTitle>
                  <CardDescription>
                    V3評価システム専用の異議申し立てケースとVoiceDrive通知
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowVoiceDriveDialog(true)}
                    disabled={selectedCases.length === 0}
                    className="bg-purple-50 border-purple-200 hover:bg-purple-100"
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    V3 VoiceDrive通知 ({selectedCases.length})
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={selectedCases.length === appealCases.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCases(appealCases.map(c => c.id));
                            } else {
                              setSelectedCases([]);
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>申立ID</TableHead>
                      <TableHead>職員名</TableHead>
                      <TableHead>申立日</TableHead>
                      <TableHead>カテゴリー</TableHead>
                      <TableHead>技術評価</TableHead>
                      <TableHead>組織貢献</TableHead>
                      <TableHead>総合</TableHead>
                      <TableHead>フェーズ</TableHead>
                      <TableHead>ステータス</TableHead>
                      <TableHead>VD通知</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appealCases.map((appeal) => (
                      <TableRow key={appeal.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedCases.includes(appeal.id)}
                            onCheckedChange={() => toggleCaseSelection(appeal.id)}
                          />
                        </TableCell>
                        <TableCell className="font-mono text-sm">{appeal.id}</TableCell>
                        <TableCell className="font-medium">{appeal.staffName}</TableCell>
                        <TableCell>{appeal.filedDate}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{appeal.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{appeal.originalScores.technical}</div>
                            {appeal.requestedScores && (
                              <div className="text-blue-600">→{appeal.requestedScores.technical}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{appeal.originalScores.contribution}</div>
                            {appeal.requestedScores && (
                              <div className="text-blue-600">→{appeal.requestedScores.contribution}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-bold">{appeal.originalScores.total}</div>
                            {appeal.requestedScores && (
                              <div className="text-blue-600 font-bold">→{appeal.requestedScores.total}</div>
                            )}
                            {appeal.finalScores && (
                              <div className="text-green-600 font-bold">✓{appeal.finalScores.total}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            appeal.evaluationPhase === 'final' ? 'bg-purple-100 text-purple-800' :
                            appeal.evaluationPhase === 'winter' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }>
                            {appeal.evaluationPhase === 'final' && '最終'}
                            {appeal.evaluationPhase === 'winter' && '冬季'}
                            {appeal.evaluationPhase === 'summer' && '夏季'}
                          </Badge>
                        </TableCell>
                        <TableCell>{getV3StatusBadge(appeal.status)}</TableCell>
                        <TableCell>
                          {appeal.voiceDriveNotified ? (
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                              <span className="text-xs text-green-600">済</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-xs text-gray-400">-</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedCase(appeal);
                                setShowCaseDetailDialog(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 他のタブは省略（実装継続） */}
        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>V3異議申し立て履歴</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500">申し立て履歴の実装は継続中です</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>V3審査プロセス</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500">審査プロセスの実装は継続中です</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="process" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>V3評価システム専用プロセス</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500">V3専用プロセスの実装は継続中です</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guide" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>V3評価システムガイド</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500">V3ガイドの実装は継続中です</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* V3 VoiceDrive送信ダイアログ */}
      <Dialog open={showVoiceDriveDialog} onOpenChange={setShowVoiceDriveDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              V3評価 VoiceDrive SNS送信
            </DialogTitle>
            <DialogDescription>
              {selectedCases.length}件のV3異議申し立てに関する通知を詳細スコア構造と共にVoiceDriveで送信します
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>V3メッセージテンプレート</Label>
              <Textarea
                value={voiceDriveMessage}
                onChange={(e) => setVoiceDriveMessage(e.target.value)}
                rows={4}
                className="mt-2"
              />
            </div>
            <div className="space-y-2">
              <Label>送信対象ケース（V3詳細情報付き）</Label>
              <div className="border rounded-lg p-4 max-h-40 overflow-y-auto">
                {selectedCases.map(caseId => {
                  const appeal = appealCases.find(c => c.id === caseId);
                  return appeal ? (
                    <div key={caseId} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div>
                        <span className="font-medium">{appeal.staffName}</span>
                        <span className="text-sm text-gray-500 ml-2">({appeal.id})</span>
                        <div className="text-xs text-gray-600">
                          技術{appeal.originalScores.technical}+貢献{appeal.originalScores.contribution}={appeal.originalScores.total}点
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge variant="outline">{appeal.category}</Badge>
                        <Badge className="mt-1 text-xs" variant="outline">
                          {appeal.evaluationPhase === 'final' ? '最終評価' :
                           appeal.evaluationPhase === 'winter' ? '冬季評価' : '夏季評価'}
                        </Badge>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Checkbox id="v3-score-breakdown" defaultChecked />
                <Label htmlFor="v3-score-breakdown">スコア詳細構造を含める</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="v3-relative-ranking" defaultChecked />
                <Label htmlFor="v3-relative-ranking">相対評価ランキングを含める</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="enable-replies" defaultChecked />
                <Label htmlFor="enable-replies">返信機能を有効にする</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="v3-grade-matrix" defaultChecked />
                <Label htmlFor="v3-grade-matrix">2軸マトリックス情報を含める</Label>
              </div>
            </div>
            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                V3評価システム専用の詳細スコア構造（技術50点+組織貢献50点）と相対評価情報が含まれます。
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVoiceDriveDialog(false)}>
              キャンセル
            </Button>
            <Button 
              onClick={handleVoiceDriveSend} 
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="w-4 h-4 mr-2" />
              {isLoading ? 'V3通知送信中...' : 'V3通知送信実行'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* V3ケース詳細ダイアログ */}
      <Dialog open={showCaseDetailDialog} onOpenChange={setShowCaseDetailDialog}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              V3異議申し立てケース詳細
            </DialogTitle>
            <DialogDescription>
              ケースID: {selectedCase?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedCase && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>職員名</Label>
                  <p className="font-medium">{selectedCase.staffName}</p>
                </div>
                <div>
                  <Label>申立日</Label>
                  <p className="font-medium">{selectedCase.filedDate}</p>
                </div>
                <div>
                  <Label>評価フェーズ</Label>
                  <Badge className={
                    selectedCase.evaluationPhase === 'final' ? 'bg-purple-100 text-purple-800' :
                    selectedCase.evaluationPhase === 'winter' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }>
                    {selectedCase.evaluationPhase === 'final' && '最終評価（3月）'}
                    {selectedCase.evaluationPhase === 'winter' && '冬季評価（12月）'}
                    {selectedCase.evaluationPhase === 'summer' && '夏季評価（6月）'}
                  </Badge>
                </div>
              </div>

              {/* V3スコア詳細表示 */}
              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="text-lg">V3スコア詳細</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-blue-600">現在のスコア</Label>
                      <div className="mt-2 p-3 bg-blue-50 rounded">
                        <div className="space-y-1 text-sm">
                          <div>技術評価: <span className="font-bold">{selectedCase.originalScores.technical}点</span></div>
                          <div>組織貢献: <span className="font-bold">{selectedCase.originalScores.contribution}点</span></div>
                          <div className="border-t pt-1">
                            <div>総合: <span className="font-bold text-lg">{selectedCase.originalScores.total}点</span></div>
                          </div>
                          <div className="mt-2">
                            <Badge variant="outline">{selectedCase.originalGrade}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {selectedCase.requestedScores && (
                      <div>
                        <Label className="text-orange-600">希望スコア</Label>
                        <div className="mt-2 p-3 bg-orange-50 rounded">
                          <div className="space-y-1 text-sm">
                            <div>技術評価: <span className="font-bold">{selectedCase.requestedScores.technical}点</span></div>
                            <div>組織貢献: <span className="font-bold">{selectedCase.requestedScores.contribution}点</span></div>
                            <div className="border-t pt-1">
                              <div>総合: <span className="font-bold text-lg">{selectedCase.requestedScores.total}点</span></div>
                            </div>
                            <div className="mt-2">
                              <Badge variant="outline">{selectedCase.requestedGrade}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedCase.finalScores && (
                      <div>
                        <Label className="text-green-600">最終スコア</Label>
                        <div className="mt-2 p-3 bg-green-50 rounded">
                          <div className="space-y-1 text-sm">
                            <div>技術評価: <span className="font-bold">{selectedCase.finalScores.technical}点</span></div>
                            <div>組織貢献: <span className="font-bold">{selectedCase.finalScores.contribution}点</span></div>
                            <div className="border-t pt-1">
                              <div>総合: <span className="font-bold text-lg">{selectedCase.finalScores.total}点</span></div>
                            </div>
                            <div className="mt-2">
                              <Badge variant="outline">{selectedCase.finalGrade}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div>
                <Label>申し立て理由</Label>
                <p className="mt-1 p-3 bg-gray-50 rounded">{selectedCase.reason}</p>
              </div>

              {selectedCase.reviewerNotes && (
                <div>
                  <Label>審査コメント</Label>
                  <p className="mt-1 p-3 bg-blue-50 rounded">{selectedCase.reviewerNotes}</p>
                </div>
              )}

              {/* VoiceDrive連携状況 */}
              {selectedCase.voiceDriveNotified && (
                <Card className="border-purple-200 bg-purple-50/50">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-purple-600" />
                      VoiceDrive連携状況
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>通知状況:</span>
                        <Badge className="bg-green-100 text-green-800">送信済み</Badge>
                      </div>
                      {selectedCase.voiceDriveConversationId && (
                        <div className="flex justify-between">
                          <span>会話ID:</span>
                          <span className="font-mono text-xs">{selectedCase.voiceDriveConversationId}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div>
                <Label>ステータス更新</Label>
                <div className="flex gap-2 mt-2">
                  <Select defaultValue={selectedCase.status}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="ステータスを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="filed">申請受理</SelectItem>
                      <SelectItem value="reviewing">審査中</SelectItem>
                      <SelectItem value="additional-info">追加情報要</SelectItem>
                      <SelectItem value="resolved">解決済</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline"
                    onClick={() => updateCaseStatus(selectedCase.id, 'reviewing')}
                  >
                    更新
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCaseDetailDialog(false)}>閉じる</Button>
            <Button 
              onClick={() => {
                if (selectedCase) {
                  setSelectedCases([selectedCase.id]);
                  setShowVoiceDriveDialog(true);
                  setShowCaseDetailDialog(false);
                }
              }}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Smartphone className="w-4 h-4 mr-2" />
              V3 VoiceDrive通知
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}