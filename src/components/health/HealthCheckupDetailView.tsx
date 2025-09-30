'use client';

/**
 * 健康診断詳細ビューコンポーネント
 * 職員カルテページ内で再利用可能
 * Created: 2025-09-30
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Calendar,
  Activity,
  FileText,
  AlertCircle,
  Download,
  Printer,
  Edit,
  ChevronLeft,
  Brain,
  Clock,
  Building2,
  Stethoscope,
  Pill,
  AlertTriangle,
  CheckCircle,
  Shield,
  ClipboardList,
  UserCheck
} from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { HealthTrendChart } from '@/components/health/HealthTrendChart';
import { TestResultsTable } from '@/components/health/TestResultsTable';

export interface HealthData {
  current: {
    id: string;
    staffId: string;
    checkupDate: string;
    overallResult?: string;
    reexaminationRequired: boolean;
    height?: number;
    weight?: number;
    bmi?: number;
    systolicBp?: number;
    diastolicBp?: number;
    doctorFindings?: string;
    occupationalDoctorFindings?: string;
    workRestrictions?: string;
    workAccommodations?: string;
    staff?: {
      name: string;
      department: string | null;
      position: string | null;
      email?: string;
    };
    details?: Array<{
      category: string;
      itemName: string;
      value: string;
      unit?: string;
      status: string;
    }>;
  };
  abnormalItems: Array<{
    itemName: string;
    value: string;
    unit?: string;
    status: string;
  }>;
  trends: Record<string, Array<{
    date: string;
    value: string;
    status: string;
  }>>;
  summary: {
    hasAbnormal: boolean;
    abnormalCount: number;
    requiresReexamination: boolean;
    overallResult?: string;
    checkupDate: string;
    checkupHistory: Array<{
      date: string;
      result: string;
      reexamination: boolean;
    }>;
    lastCheckupDaysAgo: number;
    nextCheckupDue: string;
    overdue: boolean;
  };
  riskAssessment?: {
    overallRisk: 'low' | 'medium' | 'high';
    riskFactors: Array<{
      category: string;
      description: string;
      severity: 'low' | 'medium' | 'high';
    }>;
    recommendations: string[];
  };
}

interface HealthCheckupDetailViewProps {
  staffId: string;
  showHeader?: boolean;
  onBackClick?: () => void;
}

export default function HealthCheckupDetailView({
  staffId,
  showHeader = true,
  onBackClick
}: HealthCheckupDetailViewProps) {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // データ取得
  useEffect(() => {
    const fetchHealthData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/health/staff/${staffId}/latest`);
        const result = await response.json();

        if (result.success) {
          setHealthData(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch health data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (staffId) {
      fetchHealthData();
    }
  }, [staffId]);

  // 判定バッジの色
  const getResultBadgeColor = (result?: string) => {
    switch (result) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-orange-100 text-orange-800';
      case 'E': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // BMI評価
  const getBmiStatus = (bmi?: number) => {
    if (!bmi) return { label: '-', color: 'text-gray-500' };
    if (bmi < 18.5) return { label: '低体重', color: 'text-blue-600' };
    if (bmi < 25) return { label: '標準', color: 'text-green-600' };
    if (bmi < 30) return { label: '肥満(1度)', color: 'text-yellow-600' };
    if (bmi < 35) return { label: '肥満(2度)', color: 'text-orange-600' };
    return { label: '肥満(3度以上)', color: 'text-red-600' };
  };

  // 血圧評価
  const getBloodPressureStatus = (systolic?: number, diastolic?: number) => {
    if (!systolic || !diastolic) return { label: '-', color: 'text-gray-500' };
    if (systolic < 120 && diastolic < 80) return { label: '正常', color: 'text-green-600' };
    if (systolic < 130 && diastolic < 85) return { label: '正常高値', color: 'text-yellow-600' };
    if (systolic < 140 || diastolic < 90) return { label: '高値', color: 'text-orange-600' };
    return { label: '高血圧', color: 'text-red-600' };
  };

  // リスクレベルの色
  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
    }
  };

  if (loading) {
    return (
      <div className="py-6">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">健康データを読み込んでいます...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!healthData) {
    return (
      <div className="py-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            健康診断データが見つかりません。
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { current, abnormalItems, trends, summary, riskAssessment } = healthData;

  return (
    <div className="space-y-6">
      {/* 健診受診期限アラート */}
      {summary.overdue && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 font-medium">
            健康診断の受診期限を過ぎています。至急、健診の予約・受診をお願いします。
          </AlertDescription>
        </Alert>
      )}

      {/* ヘッダー（オプション） */}
      {showHeader && (
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-4">
            {onBackClick && (
              <Button variant="ghost" size="sm" className="mt-1" onClick={onBackClick}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                戻る
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <User className="w-8 h-8" />
                {current.staff?.name || `職員 ${staffId}`}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {current.staff?.department || '-'}
                </span>
                <span>職位: {current.staff?.position || '-'}</span>
                <span>ID: {staffId}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              PDF出力
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-1" />
              印刷
            </Button>
            <Button size="sm">
              <Edit className="w-4 h-4 mr-1" />
              編集
            </Button>
          </div>
        </div>
      )}

      {/* 健康サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">最終健診日</span>
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-lg font-medium">
              {format(new Date(current.checkupDate), 'yyyy年MM月dd日', { locale: ja })}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.lastCheckupDaysAgo}日前
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">総合判定</span>
              <Activity className="w-4 h-4 text-gray-400" />
            </div>
            <Badge className={`${getResultBadgeColor(current.overallResult)} text-lg px-3 py-1`}>
              {current.overallResult || '-'}
            </Badge>
            {current.reexaminationRequired && (
              <p className="text-xs text-red-600 mt-2 font-medium">要再検査</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">異常項目数</span>
              <AlertCircle className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold">
              <span className={summary.abnormalCount > 0 ? 'text-red-600' : 'text-green-600'}>
                {summary.abnormalCount}
              </span>
              <span className="text-lg text-muted-foreground ml-1">項目</span>
            </p>
            {summary.abnormalCount > 0 && (
              <p className="text-xs text-muted-foreground mt-1">要確認</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">次回健診予定</span>
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
            <p className={`text-lg font-medium ${summary.overdue ? 'text-red-600' : ''}`}>
              {format(new Date(summary.nextCheckupDue), 'yyyy年MM月', { locale: ja })}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.overdue ? '期限超過' : '予定通り'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">健康リスク</span>
              <Shield className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-2">
              <p className={`text-2xl font-bold ${getRiskColor(riskAssessment?.overallRisk || 'low')}`}>
                {riskAssessment?.overallRisk === 'low' ? '低' :
                 riskAssessment?.overallRisk === 'medium' ? '中' : '高'}
              </p>
              <p className="text-xs text-muted-foreground">
                {riskAssessment?.overallRisk === 'low' ? '良好な状態' :
                 riskAssessment?.overallRisk === 'medium' ? '要注意' : '要対応'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 詳細タブ */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="results">検査結果</TabsTrigger>
          <TabsTrigger value="trends">経年変化</TabsTrigger>
          <TabsTrigger value="medical">医療情報</TabsTrigger>
          <TabsTrigger value="stress">ストレス</TabsTrigger>
        </TabsList>

        {/* 概要タブ */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 基本測定値 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">基本測定値</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">身長</dt>
                    <dd className="font-medium">{current.height ? `${current.height} cm` : '-'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">体重</dt>
                    <dd className="font-medium">{current.weight ? `${current.weight} kg` : '-'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">BMI</dt>
                    <dd className="font-medium">
                      {current.bmi ? (
                        <>
                          {current.bmi.toFixed(1)}
                          <span className={`ml-2 text-sm ${getBmiStatus(current.bmi).color}`}>
                            ({getBmiStatus(current.bmi).label})
                          </span>
                        </>
                      ) : '-'}
                    </dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">血圧</dt>
                    <dd className="font-medium">
                      {current.systolicBp && current.diastolicBp ? (
                        <>
                          {current.systolicBp}/{current.diastolicBp} mmHg
                          <span className={`ml-2 text-sm ${getBloodPressureStatus(current.systolicBp, current.diastolicBp).color}`}>
                            ({getBloodPressureStatus(current.systolicBp, current.diastolicBp).label})
                          </span>
                        </>
                      ) : '-'}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* 要注意項目 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  要注意項目
                </CardTitle>
              </CardHeader>
              <CardContent>
                {abnormalItems.length > 0 ? (
                  <div className="space-y-2">
                    {abnormalItems.slice(0, 5).map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-orange-50 rounded">
                        <span className="text-sm font-medium">{item.itemName}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{item.value} {item.unit}</span>
                          <Badge variant="destructive" className="text-xs">
                            {item.status === 'ABNORMAL' ? '異常' : '要注意'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {abnormalItems.length > 5 && (
                      <p className="text-sm text-muted-foreground text-center mt-2">
                        他{abnormalItems.length - 5}項目
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                    <p>異常項目はありません</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 医師所見・産業医所見 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {current.doctorFindings && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Stethoscope className="w-5 h-5" />
                    健診医師所見
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{current.doctorFindings}</p>
                </CardContent>
              </Card>
            )}

            {current.occupationalDoctorFindings && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-blue-600" />
                    産業医所見
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{current.occupationalDoctorFindings}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 就労配慮事項 */}
          {(current.workRestrictions || current.workAccommodations) && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-blue-600" />
                  就労配慮事項（人事部向け）
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {current.workRestrictions && (
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">就労制限</h4>
                    <p className="whitespace-pre-wrap text-blue-800">{current.workRestrictions}</p>
                  </div>
                )}
                {current.workAccommodations && (
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">必要な配慮</h4>
                    <p className="whitespace-pre-wrap text-blue-800">{current.workAccommodations}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* 健診受診履歴 */}
          {summary.checkupHistory && summary.checkupHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  健診受診履歴
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {summary.checkupHistory.map((history, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-4">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">
                          {format(new Date(history.date), 'yyyy年MM月dd日', { locale: ja })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getResultBadgeColor(history.result)}>
                          {history.result}
                        </Badge>
                        {history.reexamination && (
                          <Badge variant="destructive" className="text-xs">要再検査</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 健康リスク評価 */}
          {riskAssessment && (
            <Card className={
              riskAssessment.overallRisk === 'high' ? 'border-red-200 bg-red-50' :
              riskAssessment.overallRisk === 'medium' ? 'border-yellow-200 bg-yellow-50' :
              'border-green-200 bg-green-50'
            }>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  健康リスク評価
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">リスク要因</h4>
                  <div className="space-y-2">
                    {riskAssessment.riskFactors.map((factor, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-white rounded border">
                        <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                          factor.severity === 'high' ? 'text-red-600' :
                          factor.severity === 'medium' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{factor.category}</p>
                          <p className="text-sm text-muted-foreground">{factor.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {riskAssessment.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">推奨事項</h4>
                    <ul className="space-y-1">
                      {riskAssessment.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* 次回アクション */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">推奨アクション</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {current.reexaminationRequired && (
                  <Alert className="border-orange-200 bg-orange-50">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      再検査が必要です。早めに医療機関を受診してください。
                    </AlertDescription>
                  </Alert>
                )}
                <div className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">次回健診予定</span>
                  </div>
                  <span className="text-sm font-medium">
                    {format(
                      new Date(new Date(current.checkupDate).setFullYear(new Date(current.checkupDate).getFullYear() + 1)),
                      'yyyy年MM月',
                      { locale: ja }
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 検査結果タブ */}
        <TabsContent value="results">
          <TestResultsTable details={current.details || []} />
        </TabsContent>

        {/* 経年変化タブ */}
        <TabsContent value="trends">
          <HealthTrendChart trends={trends} />
        </TabsContent>

        {/* 医療情報タブ */}
        <TabsContent value="medical">
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <Pill className="w-12 h-12 mx-auto mb-4" />
              <p>病歴・服薬情報の実装予定</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ストレスタブ */}
        <TabsContent value="stress">
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <Brain className="w-12 h-12 mx-auto mb-4" />
              <p>ストレスチェック結果の実装予定</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}