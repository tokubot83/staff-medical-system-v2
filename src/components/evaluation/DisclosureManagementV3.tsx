// V3評価開示管理システム
// 100点満点評価システムと相対評価エンジンに完全対応

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Eye,
  EyeOff,
  Send,
  Calendar,
  Download,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  Mail,
  Printer,
  FileText,
  MessageSquare,
  TrendingUp,
  Target,
  Award,
  ChevronRight,
  Info,
  Shield,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

// V3評価結果データ構造（100点満点システム）
export interface V3EvaluationResult {
  // 基本情報
  staffId: string;
  staffName: string;
  department: string;
  position: string;
  experienceLevel: string;
  evaluationPeriod: string;
  
  // V3評価スコア（100点満点）
  scores: {
    // 技術評価（50点）
    technical: {
      coreItems: number;        // 法人統一項目（30点）
      facilityItems: number;    // 施設特化項目（20点）
      total: number;           // 合計（50点）
    };
    // 組織貢献度（50点）
    contribution: {
      summerFacility: number;   // 夏季施設貢献（12.5点）
      summerCorporate: number;  // 夏季法人貢献（12.5点）
      winterFacility: number;   // 冬季施設貢献（12.5点）
      winterCorporate: number;  // 冬季法人貢献（12.5点）
      total: number;           // 合計（50点）
    };
    // 総合スコア
    totalScore: number;         // 100点満点
  };
  
  // 相対評価結果（2軸評価）
  relativeEvaluation: {
    facilityRank: number;       // 施設内順位
    facilityTotal: number;      // 施設内総数
    facilityGrade: 'S' | 'A' | 'B' | 'C' | 'D';
    facilityPercentile: number;
    
    corporateRank: number;      // 法人内順位
    corporateTotal: number;     // 法人内総数
    corporateGrade: 'S' | 'A' | 'B' | 'C' | 'D';
    corporatePercentile: number;
    
    finalGrade: 'S+' | 'S' | 'A+' | 'A' | 'B' | 'C' | 'D';  // 7段階最終評価
  };
  
  // 評価詳細
  details: {
    strengths: string[];        // 強み・優れた点
    improvements: string[];     // 改善点・課題
    comments: {
      supervisor: string;       // 上司コメント
      hr?: string;             // 人事部コメント
    };
  };
}

// 開示管理データ
export interface V3DisclosureRecord extends V3EvaluationResult {
  // 開示管理情報
  disclosure: {
    status: 'pending' | 'partial' | 'full' | 'completed';
    method: 'paper' | 'digital' | 'meeting' | 'combined';
    partialItems?: string[];   // 部分開示の場合の開示項目
    
    // タイムスタンプ
    scheduledAt?: Date;        // 開示予定日
    disclosedAt?: Date;        // 実際の開示日
    acknowledgedAt?: Date;     // 職員確認日
    
    // 開示設定
    settings: {
      showTechnicalDetails: boolean;
      showContributionDetails: boolean;
      showRelativeRanking: boolean;
      showComments: boolean;
      showImprovements: boolean;
    };
  };
  
  // フィードバック面談
  feedback: {
    status: 'not-scheduled' | 'scheduled' | 'completed' | 'cancelled';
    scheduledDate?: Date;
    completedDate?: Date;
    location?: string;
    attendees?: string[];
    notes?: string;
    nextActions?: string[];
  };
  
  // 職員の反応・確認
  staffResponse: {
    acknowledged: boolean;
    acknowledgedDate?: Date;
    satisfaction?: 1 | 2 | 3 | 4 | 5;
    comments?: string;
    appealIntention?: boolean;
  };
}

export default function DisclosureManagementV3() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDisclosureDialog, setShowDisclosureDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<V3DisclosureRecord | null>(null);
  
  // モックデータ（実際はAPIから取得）
  const [disclosureRecords, setDisclosureRecords] = useState<V3DisclosureRecord[]>([
    {
      staffId: '001',
      staffName: '山田 太郎',
      department: '看護部',
      position: '看護師',
      experienceLevel: '中堅（4-10年）',
      evaluationPeriod: '2025年度',
      scores: {
        technical: {
          coreItems: 26,
          facilityItems: 17,
          total: 43
        },
        contribution: {
          summerFacility: 10.5,
          summerCorporate: 9.0,
          winterFacility: 11.0,
          winterCorporate: 8.5,
          total: 39
        },
        totalScore: 82
      },
      relativeEvaluation: {
        facilityRank: 12,
        facilityTotal: 85,
        facilityGrade: 'A',
        facilityPercentile: 14.1,
        corporateRank: 45,
        corporateTotal: 320,
        corporateGrade: 'A',
        corporatePercentile: 14.1,
        finalGrade: 'A+'
      },
      details: {
        strengths: ['患者対応が丁寧', 'チーム連携が優秀', '技術力が高い'],
        improvements: ['文書作成の迅速化', '新人指導の強化'],
        comments: {
          supervisor: '今年度は特に救急対応で大きな成長が見られました。',
          hr: '法人全体でも上位の評価です。次年度はリーダー役を期待します。'
        }
      },
      disclosure: {
        status: 'pending',
        method: 'meeting',
        settings: {
          showTechnicalDetails: true,
          showContributionDetails: true,
          showRelativeRanking: false,
          showComments: true,
          showImprovements: true
        }
      },
      feedback: {
        status: 'scheduled',
        scheduledDate: new Date('2025-04-10'),
        location: '会議室A'
      },
      staffResponse: {
        acknowledged: false
      }
    },
    {
      staffId: '002',
      staffName: '佐藤 花子',
      department: '看護部',
      position: '主任',
      experienceLevel: 'ベテラン（11年以上）',
      evaluationPeriod: '2025年度',
      scores: {
        technical: {
          coreItems: 28,
          facilityItems: 19,
          total: 47
        },
        contribution: {
          summerFacility: 12.0,
          summerCorporate: 11.5,
          winterFacility: 12.5,
          winterCorporate: 12.0,
          total: 48
        },
        totalScore: 95
      },
      relativeEvaluation: {
        facilityRank: 3,
        facilityTotal: 85,
        facilityGrade: 'S',
        facilityPercentile: 3.5,
        corporateRank: 8,
        corporateTotal: 320,
        corporateGrade: 'S',
        corporatePercentile: 2.5,
        finalGrade: 'S+'
      },
      details: {
        strengths: ['リーダーシップ', '後輩育成', '業務改善提案'],
        improvements: ['法人活動への参加拡大'],
        comments: {
          supervisor: '模範的な主任として部署を牽引しています。',
          hr: '次期師長候補として期待しています。'
        }
      },
      disclosure: {
        status: 'full',
        method: 'combined',
        disclosedAt: new Date('2025-04-05'),
        settings: {
          showTechnicalDetails: true,
          showContributionDetails: true,
          showRelativeRanking: true,
          showComments: true,
          showImprovements: true
        }
      },
      feedback: {
        status: 'completed',
        scheduledDate: new Date('2025-04-05'),
        completedDate: new Date('2025-04-05'),
        location: '会議室B',
        notes: '昇進の可能性について説明。研修計画を策定。'
      },
      staffResponse: {
        acknowledged: true,
        acknowledgedDate: new Date('2025-04-05'),
        satisfaction: 5,
        comments: '評価内容に納得しています。今後も頑張ります。'
      }
    }
  ]);
  
  // フィルタリング処理
  const filteredRecords = disclosureRecords.filter(record => {
    const departmentMatch = filterDepartment === 'all' || record.department === filterDepartment;
    const statusMatch = filterStatus === 'all' || record.disclosure.status === filterStatus;
    return departmentMatch && statusMatch;
  });
  
  // 統計情報の計算
  const statistics = {
    total: disclosureRecords.length,
    pending: disclosureRecords.filter(r => r.disclosure.status === 'pending').length,
    partial: disclosureRecords.filter(r => r.disclosure.status === 'partial').length,
    full: disclosureRecords.filter(r => r.disclosure.status === 'full').length,
    completed: disclosureRecords.filter(r => r.disclosure.status === 'completed').length,
    feedbackScheduled: disclosureRecords.filter(r => r.feedback.status === 'scheduled').length,
    feedbackCompleted: disclosureRecords.filter(r => r.feedback.status === 'completed').length,
    averageScore: disclosureRecords.reduce((sum, r) => sum + r.scores.totalScore, 0) / disclosureRecords.length,
    topPerformers: disclosureRecords.filter(r => r.relativeEvaluation.finalGrade === 'S+' || r.relativeEvaluation.finalGrade === 'S').length
  };
  
  // 開示実行処理
  const executeDisclosure = (records: V3DisclosureRecord[], method: string) => {
    const updatedRecords = disclosureRecords.map(record => {
      if (records.find(r => r.staffId === record.staffId)) {
        return {
          ...record,
          disclosure: {
            ...record.disclosure,
            status: 'full' as const,
            method: method as any,
            disclosedAt: new Date()
          }
        };
      }
      return record;
    });
    setDisclosureRecords(updatedRecords);
    setShowDisclosureDialog(false);
    alert(`${records.length}件の評価を開示しました`);
  };
  
  // ステータスバッジの取得
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: '開示待ち', className: 'bg-yellow-100 text-yellow-800' },
      partial: { label: '部分開示', className: 'bg-blue-100 text-blue-800' },
      full: { label: '全開示', className: 'bg-green-100 text-green-800' },
      completed: { label: '完了', className: 'bg-gray-100 text-gray-800' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config?.className}>{config?.label}</Badge>;
  };
  
  // グレードバッジの取得
  const getGradeBadge = (grade: string) => {
    const gradeColors = {
      'S+': 'bg-purple-600 text-white',
      'S': 'bg-purple-500 text-white',
      'A+': 'bg-blue-600 text-white',
      'A': 'bg-blue-500 text-white',
      'B': 'bg-green-500 text-white',
      'C': 'bg-yellow-500 text-white',
      'D': 'bg-red-500 text-white'
    };
    return (
      <Badge className={gradeColors[grade as keyof typeof gradeColors]}>
        {grade}
      </Badge>
    );
  };
  
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                V3評価開示管理システム
              </CardTitle>
              <CardDescription>
                100点満点評価の開示とフィードバック管理
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-lg px-3 py-1">
                <Sparkles className="h-4 w-4 mr-1" />
                2025年度評価
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 統計サマリー */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">開示待ち</p>
                <p className="text-2xl font-bold text-yellow-600">{statistics.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">開示済み</p>
                <p className="text-2xl font-bold text-green-600">{statistics.full}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">面談予定</p>
                <p className="text-2xl font-bold text-blue-600">{statistics.feedbackScheduled}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">平均スコア</p>
                <p className="text-2xl font-bold text-purple-600">{statistics.averageScore.toFixed(1)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* メインコンテンツ */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">開示管理</TabsTrigger>
          <TabsTrigger value="schedule">面談スケジュール</TabsTrigger>
          <TabsTrigger value="settings">開示設定</TabsTrigger>
          <TabsTrigger value="analytics">分析</TabsTrigger>
        </TabsList>

        {/* 開示管理タブ */}
        <TabsContent value="overview" className="space-y-4">
          {/* フィルター */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="部署" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部署</SelectItem>
                    <SelectItem value="看護部">看護部</SelectItem>
                    <SelectItem value="リハビリ部">リハビリ部</SelectItem>
                    <SelectItem value="事務部">事務部</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="ステータス" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全ステータス</SelectItem>
                    <SelectItem value="pending">開示待ち</SelectItem>
                    <SelectItem value="partial">部分開示</SelectItem>
                    <SelectItem value="full">全開示</SelectItem>
                    <SelectItem value="completed">完了</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex-1" />
                
                <Button 
                  variant="outline"
                  onClick={() => setShowDisclosureDialog(true)}
                  disabled={selectedRecords.length === 0}
                >
                  <Send className="h-4 w-4 mr-2" />
                  一括開示 ({selectedRecords.length})
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 評価リスト */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedRecords.length === filteredRecords.length}
                        onCheckedChange={(checked) => {
                          setSelectedRecords(checked ? filteredRecords.map(r => r.staffId) : []);
                        }}
                      />
                    </TableHead>
                    <TableHead>職員名</TableHead>
                    <TableHead>部署</TableHead>
                    <TableHead>総合スコア</TableHead>
                    <TableHead>技術評価</TableHead>
                    <TableHead>組織貢献</TableHead>
                    <TableHead>最終評価</TableHead>
                    <TableHead>開示状況</TableHead>
                    <TableHead>面談</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.staffId}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedRecords.includes(record.staffId)}
                          onCheckedChange={(checked) => {
                            setSelectedRecords(prev => 
                              checked 
                                ? [...prev, record.staffId]
                                : prev.filter(id => id !== record.staffId)
                            );
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{record.staffName}</TableCell>
                      <TableCell>{record.department}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">{record.scores.totalScore}</span>
                          <span className="text-sm text-gray-500">/ 100</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{record.scores.technical.total} / 50</div>
                          <Progress value={record.scores.technical.total * 2} className="h-1 mt-1" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{record.scores.contribution.total} / 50</div>
                          <Progress value={record.scores.contribution.total * 2} className="h-1 mt-1" />
                        </div>
                      </TableCell>
                      <TableCell>{getGradeBadge(record.relativeEvaluation.finalGrade)}</TableCell>
                      <TableCell>{getStatusBadge(record.disclosure.status)}</TableCell>
                      <TableCell>
                        {record.feedback.status === 'scheduled' && (
                          <Badge variant="outline" className="text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(record.feedback.scheduledDate!, 'M/d', { locale: ja })}
                          </Badge>
                        )}
                        {record.feedback.status === 'completed' && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            完了
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedStaff(record);
                            setShowFeedbackDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 面談スケジュールタブ */}
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>フィードバック面談スケジュール</CardTitle>
              <CardDescription>
                評価開示後の個別面談予定
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {disclosureRecords
                  .filter(r => r.feedback.status === 'scheduled')
                  .sort((a, b) => (a.feedback.scheduledDate?.getTime() || 0) - (b.feedback.scheduledDate?.getTime() || 0))
                  .map((record) => (
                    <Card key={record.staffId} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-lg font-bold text-blue-600">
                            {format(record.feedback.scheduledDate!, 'M月d日(E)', { locale: ja })}
                          </div>
                          <div>
                            <div className="font-medium">{record.staffName}</div>
                            <div className="text-sm text-gray-600">{record.department} - {record.position}</div>
                          </div>
                          <Badge variant="outline">{record.feedback.location}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>{record.scores.totalScore}点</Badge>
                          {getGradeBadge(record.relativeEvaluation.finalGrade)}
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            準備
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 開示設定タブ */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>開示内容設定</CardTitle>
              <CardDescription>
                評価結果の開示範囲をカスタマイズ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">標準開示設定</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Target className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium">技術評価詳細</div>
                          <div className="text-sm text-gray-600">法人統一項目・施設特化項目の内訳</div>
                        </div>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-medium">組織貢献度詳細</div>
                          <div className="text-sm text-gray-600">夏季・冬季の施設/法人貢献内訳</div>
                        </div>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                        <div>
                          <div className="font-medium">相対評価順位</div>
                          <div className="text-sm text-gray-600">施設内・法人内での順位情報</div>
                        </div>
                      </div>
                      <Checkbox />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-5 w-5 text-orange-600" />
                        <div>
                          <div className="font-medium">評価コメント</div>
                          <div className="text-sm text-gray-600">上司・人事部からのコメント</div>
                        </div>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <div>
                          <div className="font-medium">改善点・課題</div>
                          <div className="text-sm text-gray-600">今後の成長課題</div>
                        </div>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button className="w-full">
                    <Shield className="h-4 w-4 mr-2" />
                    設定を保存
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 分析タブ */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>開示進捗状況</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>開示待ち</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(statistics.pending / statistics.total) * 100} className="w-32" />
                      <span className="text-sm font-medium">{statistics.pending}件</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>部分開示</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(statistics.partial / statistics.total) * 100} className="w-32" />
                      <span className="text-sm font-medium">{statistics.partial}件</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>全開示</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(statistics.full / statistics.total) * 100} className="w-32" />
                      <span className="text-sm font-medium">{statistics.full}件</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>完了</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(statistics.completed / statistics.total) * 100} className="w-32" />
                      <span className="text-sm font-medium">{statistics.completed}件</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>評価分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-600 text-white">S+/S</Badge>
                      <span>最優秀層</span>
                    </div>
                    <span className="font-medium">{statistics.topPerformers}名</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>平均スコア</span>
                    <span className="text-2xl font-bold text-blue-600">{statistics.averageScore.toFixed(1)}点</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>面談完了率</span>
                    <span className="font-medium">
                      {((statistics.feedbackCompleted / statistics.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* 開示実行ダイアログ */}
      <Dialog open={showDisclosureDialog} onOpenChange={setShowDisclosureDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>評価開示実行</DialogTitle>
            <DialogDescription>
              選択した{selectedRecords.length}名の評価を開示します
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                開示実行後、対象職員に通知が送信されます。開示内容は設定に従って自動的に調整されます。
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              <Label>開示方法</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  書面配布
                </Button>
                <Button variant="outline" className="justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  メール送信
                </Button>
                <Button variant="outline" className="justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  対面説明
                </Button>
                <Button variant="outline" className="justify-start">
                  <Send className="h-4 w-4 mr-2" />
                  システム通知
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>追加メッセージ（任意）</Label>
              <Textarea 
                placeholder="評価開示にあたってのメッセージを入力..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisclosureDialog(false)}>
              キャンセル
            </Button>
            <Button 
              onClick={() => {
                const records = disclosureRecords.filter(r => selectedRecords.includes(r.staffId));
                executeDisclosure(records, 'digital');
              }}
            >
              <Send className="h-4 w-4 mr-2" />
              開示実行
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* フィードバック詳細ダイアログ */}
      {selectedStaff && (
        <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>評価詳細 - {selectedStaff.staffName}</DialogTitle>
              <DialogDescription>
                {selectedStaff.evaluationPeriod} 総合評価結果
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* スコアサマリー */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {selectedStaff.scores.totalScore}
                    </div>
                    <div className="text-sm text-gray-600">総合スコア / 100</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedStaff.scores.technical.total} / 50
                    </div>
                    <div className="text-sm text-gray-600">技術評価</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {selectedStaff.scores.contribution.total} / 50
                    </div>
                    <div className="text-sm text-gray-600">組織貢献度</div>
                  </CardContent>
                </Card>
              </div>

              {/* 相対評価 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">相対評価結果</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">施設内評価</div>
                      <div className="flex items-center gap-2">
                        {getGradeBadge(selectedStaff.relativeEvaluation.facilityGrade)}
                        <span className="text-sm">
                          {selectedStaff.relativeEvaluation.facilityRank}位 / {selectedStaff.relativeEvaluation.facilityTotal}名
                          （上位{selectedStaff.relativeEvaluation.facilityPercentile.toFixed(1)}%）
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">法人内評価</div>
                      <div className="flex items-center gap-2">
                        {getGradeBadge(selectedStaff.relativeEvaluation.corporateGrade)}
                        <span className="text-sm">
                          {selectedStaff.relativeEvaluation.corporateRank}位 / {selectedStaff.relativeEvaluation.corporateTotal}名
                          （上位{selectedStaff.relativeEvaluation.corporatePercentile.toFixed(1)}%）
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t text-center">
                    <div className="text-sm text-gray-600 mb-1">最終評価</div>
                    {getGradeBadge(selectedStaff.relativeEvaluation.finalGrade)}
                  </div>
                </CardContent>
              </Card>

              {/* 評価詳細 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">評価詳細</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">強み・優れた点</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedStaff.details.strengths.map((strength, idx) => (
                        <li key={idx} className="text-sm">{strength}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">改善点・課題</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedStaff.details.improvements.map((improvement, idx) => (
                        <li key={idx} className="text-sm">{improvement}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {selectedStaff.details.comments.supervisor && (
                    <div>
                      <h4 className="font-medium mb-2">上司コメント</h4>
                      <p className="text-sm bg-gray-50 p-3 rounded">
                        {selectedStaff.details.comments.supervisor}
                      </p>
                    </div>
                  )}
                  
                  {selectedStaff.details.comments.hr && (
                    <div>
                      <h4 className="font-medium mb-2">人事部コメント</h4>
                      <p className="text-sm bg-blue-50 p-3 rounded">
                        {selectedStaff.details.comments.hr}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowFeedbackDialog(false)}>
                閉じる
              </Button>
              <Button>
                <Printer className="h-4 w-4 mr-2" />
                印刷
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}