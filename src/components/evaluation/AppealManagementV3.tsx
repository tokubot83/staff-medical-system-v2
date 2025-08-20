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

export default function AppealManagementV3() {
  const [activeTab, setActiveTab] = useState('submit');
  const [appeals, setAppeals] = useState<V3AppealRecord[]>([]);
  const [selectedAppeal, setSelectedAppeal] = useState<V3AppealRecord | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showVoiceDriveDialog, setShowVoiceDriveDialog] = useState(false);
  const [showCaseDetailDialog, setShowCaseDetailDialog] = useState(false);
  const [selectedCase, setSelectedCase] = useState<V3AppealCase | null>(null);
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [voiceDriveMessage, setVoiceDriveMessage] = useState('V3評価システムでの異議申し立てを受け付けました。技術評価50点+組織貢献50点の評価構造を考慮して審査いたします。結果は3週間以内にお知らせします。');
  
  // V3専用フォーム状態
  const [formData, setFormData] = useState<Partial<V3AppealRecord>>({
    employeeId: '',
    employeeName: '',
    evaluationPeriod: '2025年度上期',
    appealCategory: 'other',
    appealReason: '',
    originalScores: {
      technical: { coreItems: 0, facilityItems: 0, total: 0 },
      contribution: { summerFacility: 0, summerCorporate: 0, winterFacility: 0, winterCorporate: 0, total: 0 },
      totalScore: 0
    },
    requestedScores: {
      technical: { coreItems: 0, facilityItems: 0, total: 0 },
      contribution: { summerFacility: 0, summerCorporate: 0, winterFacility: 0, winterCorporate: 0, total: 0 },
      totalScore: 0
    },
    evidenceDocuments: [],
    evaluationPhase: 'final',
    relativeEvaluationDispute: {
      facilityRankingDispute: false,
      corporateRankingDispute: false,
      jobCategoryRankingDispute: false
    }
  });

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
      const response = await fetch('/api/v3/appeals/list?employeeId=current');
      const data = await response.json();
      if (data.success && data.data) {
        setAppeals(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch V3 appeals:', error);
    }
  };

  const handleSubmitV3Appeal = async () => {
    setIsLoading(true);
    try {
      // V3専用バリデーション
      if (!formData.appealReason || formData.appealReason.length < 100) {
        toast.error('申し立て理由は100文字以上入力してください');
        return;
      }

      // スコア検証
      if (formData.originalScores?.totalScore !== 
          (formData.originalScores.technical.total + formData.originalScores.contribution.total)) {
        toast.error('スコア合計が一致しません');
        return;
      }

      const response = await fetch('/api/v3/appeals/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          submittedVia: 'system',
          filedDate: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          status: 'received'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('V3評価システムでの異議申し立てを受け付けました');
        setShowSubmitDialog(false);
        fetchV3Appeals();
        resetForm();
      } else {
        toast.error(data.error?.message || '申し立ての送信に失敗しました');
      }
    } catch (error) {
      toast.error('エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // VoiceDrive SNS送信処理（V2から移植・V3対応）
  const handleVoiceDriveSend = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v3/appeals/voicedrive-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name}は10MBを超えています`);
        return false;
      }
      return true;
    });
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const resetForm = () => {
    setFormData({
      employeeId: '',
      employeeName: '',
      evaluationPeriod: '2025年度上期',
      appealCategory: 'other',
      appealReason: '',
      originalScores: {
        technical: { coreItems: 0, facilityItems: 0, total: 0 },
        contribution: { summerFacility: 0, summerCorporate: 0, winterFacility: 0, winterCorporate: 0, total: 0 },
        totalScore: 0
      },
      requestedScores: {
        technical: { coreItems: 0, facilityItems: 0, total: 0 },
        contribution: { summerFacility: 0, summerCorporate: 0, winterFacility: 0, winterCorporate: 0, total: 0 },
        totalScore: 0
      },
      evidenceDocuments: [],
      evaluationPhase: 'final',
      relativeEvaluationDispute: {
        facilityRankingDispute: false,
        corporateRankingDispute: false,
        jobCategoryRankingDispute: false
      }
    });
    setUploadedFiles([]);
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
            V3評価システム 異議申し立て管理
          </CardTitle>
          <CardDescription>
            技術評価50点+組織貢献50点の100点満点評価システム専用の異議申し立て管理
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
          <TabsTrigger value="submit">新規申し立て</TabsTrigger>
          <TabsTrigger value="list">申し立て一覧</TabsTrigger>
          <TabsTrigger value="timeline">審査状況</TabsTrigger>
          <TabsTrigger value="cases">ケース管理</TabsTrigger>
          <TabsTrigger value="process">V3プロセス</TabsTrigger>
          <TabsTrigger value="guide">V3ガイド</TabsTrigger>
        </TabsList>

        {/* V3新規申し立てタブ */}
        <TabsContent value="submit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>V3評価システム 異議申し立てフォーム</CardTitle>
              <CardDescription>
                技術評価50点+組織貢献50点の100点満点評価に対する異議申し立てを行います
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>V3評価システム対応</AlertTitle>
                <AlertDescription>
                  本フォームはV3評価システム専用です。技術評価・組織貢献・相対評価の詳細な構造を考慮した申し立てが可能です。
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeId">職員ID</Label>
                  <Input
                    id="employeeId"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                    placeholder="E001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeName">職員名</Label>
                  <Input
                    id="employeeName"
                    value={formData.employeeName}
                    onChange={(e) => setFormData({...formData, employeeName: e.target.value})}
                    placeholder="山田 太郎"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="evaluationPeriod">評価期間</Label>
                  <Select 
                    value={formData.evaluationPeriod}
                    onValueChange={(value) => setFormData({...formData, evaluationPeriod: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="評価期間を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025年度上期">2025年度上期</SelectItem>
                      <SelectItem value="2025年度下期">2025年度下期</SelectItem>
                      <SelectItem value="2024年度下期">2024年度下期</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="evaluationPhase">評価フェーズ</Label>
                  <Select 
                    value={formData.evaluationPhase}
                    onValueChange={(value) => setFormData({...formData, evaluationPhase: value as 'summer' | 'winter' | 'final'})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="フェーズを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summer">夏季評価（6月・組織貢献25点）</SelectItem>
                      <SelectItem value="winter">冬季評価（12月・組織貢献50点）</SelectItem>
                      <SelectItem value="final">最終評価（3月・技術+組織貢献100点）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">申し立てカテゴリー（V3対応）</Label>
                <Select 
                  value={formData.appealCategory}
                  onValueChange={(value) => setFormData({...formData, appealCategory: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="カテゴリーを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="criteria-misinterpretation">評価基準の誤解釈</SelectItem>
                    <SelectItem value="achievement-oversight">成果の見落とし</SelectItem>
                    <SelectItem value="calculation-error">点数計算の誤り</SelectItem>
                    <SelectItem value="relative-evaluation-error">相対評価の誤り（V3専用）</SelectItem>
                    <SelectItem value="period-error">評価期間の誤り</SelectItem>
                    <SelectItem value="other">その他</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* V3スコア詳細入力 */}
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="text-lg">現在の評価スコア（V3詳細構造）</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-blue-600">技術評価 (50点満点)</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div>
                        <Label className="text-xs">法人統一項目</Label>
                        <Input
                          type="number"
                          value={formData.originalScores?.technical.coreItems || ''}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            setFormData({
                              ...formData, 
                              originalScores: {
                                ...formData.originalScores!,
                                technical: {
                                  ...formData.originalScores!.technical,
                                  coreItems: value,
                                  total: value + formData.originalScores!.technical.facilityItems
                                }
                              }
                            });
                          }}
                          placeholder="25"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">施設固有項目</Label>
                        <Input
                          type="number"
                          value={formData.originalScores?.technical.facilityItems || ''}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            setFormData({
                              ...formData, 
                              originalScores: {
                                ...formData.originalScores!,
                                technical: {
                                  ...formData.originalScores!.technical,
                                  facilityItems: value,
                                  total: formData.originalScores!.technical.coreItems + value
                                }
                              }
                            });
                          }}
                          placeholder="25"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">技術評価計</Label>
                        <Input
                          type="number"
                          value={formData.originalScores?.technical.total || ''}
                          readOnly
                          className="bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-green-600">組織貢献度 (50点満点)</Label>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      <div>
                        <Label className="text-xs">夏施設貢献</Label>
                        <Input
                          type="number"
                          value={formData.originalScores?.contribution.summerFacility || ''}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            setFormData({
                              ...formData, 
                              originalScores: {
                                ...formData.originalScores!,
                                contribution: {
                                  ...formData.originalScores!.contribution,
                                  summerFacility: value,
                                  total: value + formData.originalScores!.contribution.summerCorporate + 
                                         formData.originalScores!.contribution.winterFacility + 
                                         formData.originalScores!.contribution.winterCorporate
                                }
                              }
                            });
                          }}
                          placeholder="12.5"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">夏法人貢献</Label>
                        <Input
                          type="number"
                          value={formData.originalScores?.contribution.summerCorporate || ''}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            setFormData({
                              ...formData, 
                              originalScores: {
                                ...formData.originalScores!,
                                contribution: {
                                  ...formData.originalScores!.contribution,
                                  summerCorporate: value,
                                  total: formData.originalScores!.contribution.summerFacility + value + 
                                         formData.originalScores!.contribution.winterFacility + 
                                         formData.originalScores!.contribution.winterCorporate
                                }
                              }
                            });
                          }}
                          placeholder="12.5"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">冬施設貢献</Label>
                        <Input
                          type="number"
                          value={formData.originalScores?.contribution.winterFacility || ''}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            setFormData({
                              ...formData, 
                              originalScores: {
                                ...formData.originalScores!,
                                contribution: {
                                  ...formData.originalScores!.contribution,
                                  winterFacility: value,
                                  total: formData.originalScores!.contribution.summerFacility + 
                                         formData.originalScores!.contribution.summerCorporate + value +
                                         formData.originalScores!.contribution.winterCorporate
                                }
                              }
                            });
                          }}
                          placeholder="12.5"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">冬法人貢献</Label>
                        <Input
                          type="number"
                          value={formData.originalScores?.contribution.winterCorporate || ''}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            setFormData({
                              ...formData, 
                              originalScores: {
                                ...formData.originalScores!,
                                contribution: {
                                  ...formData.originalScores!.contribution,
                                  winterCorporate: value,
                                  total: formData.originalScores!.contribution.summerFacility + 
                                         formData.originalScores!.contribution.summerCorporate + 
                                         formData.originalScores!.contribution.winterFacility + value
                                }
                              }
                            });
                          }}
                          placeholder="12.5"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">組織貢献計</Label>
                        <Input
                          type="number"
                          value={formData.originalScores?.contribution.total || ''}
                          readOnly
                          className="bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <Label className="text-lg font-medium">総合スコア (100点満点)</Label>
                      <div className="text-2xl font-bold text-purple-600">
                        {(formData.originalScores?.technical.total || 0) + (formData.originalScores?.contribution.total || 0)}点
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 相対評価異議（V3専用） */}
              <Card className="border-dashed border-purple-200">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-600">相対評価異議（V3専用機能）</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="facility-ranking"
                        checked={formData.relativeEvaluationDispute?.facilityRankingDispute}
                        onCheckedChange={(checked) => setFormData({
                          ...formData,
                          relativeEvaluationDispute: {
                            ...formData.relativeEvaluationDispute!,
                            facilityRankingDispute: checked as boolean
                          }
                        })}
                      />
                      <Label htmlFor="facility-ranking">施設内順位付けに異議あり</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="corporate-ranking"
                        checked={formData.relativeEvaluationDispute?.corporateRankingDispute}
                        onCheckedChange={(checked) => setFormData({
                          ...formData,
                          relativeEvaluationDispute: {
                            ...formData.relativeEvaluationDispute!,
                            corporateRankingDispute: checked as boolean
                          }
                        })}
                      />
                      <Label htmlFor="corporate-ranking">法人内順位付けに異議あり</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="job-category-ranking"
                        checked={formData.relativeEvaluationDispute?.jobCategoryRankingDispute}
                        onCheckedChange={(checked) => setFormData({
                          ...formData,
                          relativeEvaluationDispute: {
                            ...formData.relativeEvaluationDispute!,
                            jobCategoryRankingDispute: checked as boolean
                          }
                        })}
                      />
                      <Label htmlFor="job-category-ranking">同職種内順位付けに異議あり</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label htmlFor="reason">申し立て理由（100文字以上・V3詳細構造を考慮）</Label>
                <Textarea
                  id="reason"
                  value={formData.appealReason}
                  onChange={(e) => setFormData({...formData, appealReason: e.target.value})}
                  placeholder="V3評価システムの技術評価50点+組織貢献50点の構造、または相対評価ランキングに対する異議の詳細な理由を記載してください..."
                  className="min-h-[150px]"
                />
                <p className="text-sm text-gray-600">
                  文字数: {formData.appealReason?.length || 0} / 100文字以上
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="evidence">証拠書類（任意）</Label>
                <div className="border-2 border-dashed rounded-lg p-4">
                  <Input
                    id="evidence"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.xlsx,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="evidence" className="cursor-pointer">
                    <div className="flex flex-col items-center space-y-2">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-600">クリックしてファイルを選択</span>
                      <span className="text-xs text-gray-500">PDF、画像、Excel、Word（最大10MB）</span>
                    </div>
                  </label>
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                          >
                            削除
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={resetForm}>クリア</Button>
                <Button onClick={handleSubmitV3Appeal} disabled={isLoading}>
                  {isLoading ? '送信中...' : 'V3評価 異議申し立てを送信'}
                </Button>
              </div>
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