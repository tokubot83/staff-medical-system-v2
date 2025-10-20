'use client';

/**
 * 健康診断管理画面
 * Created: 2025-09-29
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search,
  Upload,
  Download,
  Calendar,
  Users,
  AlertCircle,
  Activity,
  FileText,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  TrendingUp,
  UserSearch,
  Save,
  Plus,
  X,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { CsvImportDialog } from '@/components/health/CsvImportDialog';
import StressCheckDistribution from '@/features/stress-check/components/StressCheckDistribution';
import FollowUpManagement from '@/features/stress-check/components/FollowUpManagement';
import GroupAnalysis from '@/features/stress-check/components/GroupAnalysis';
import IndividualAnalysis from '@/features/stress-check/components/IndividualAnalysis';

interface HealthCheckup {
  id: string;
  staffId: string;
  checkupDate: string;
  overallResult?: string;
  reexaminationRequired: boolean;
  reexaminationItems?: string;
  staff?: {
    id: string;
    name: string;
    department: string | null;
    position: string | null;
  };
}

interface Statistics {
  totalCheckups: number;
  completionRate: number;
  reexaminationRate: number;
  resultDistribution: Record<string, number>;
}

// 健診項目定義
const CHECKUP_CATEGORIES = {
  basic: {
    name: '基本測定',
    items: [
      { key: 'height', label: '身長', unit: 'cm', type: 'number', min: 100, max: 250 },
      { key: 'weight', label: '体重', unit: 'kg', type: 'number', min: 30, max: 200 },
      { key: 'bmi', label: 'BMI', unit: '', type: 'calculated', formula: 'weight/(height/100)^2' },
      { key: 'waist', label: '腹囲', unit: 'cm', type: 'number', min: 50, max: 200 },
    ]
  },
  vitals: {
    name: 'バイタル',
    items: [
      { key: 'systolicBp', label: '血圧(最高)', unit: 'mmHg', type: 'number', min: 50, max: 250, alert: { min: 90, max: 140 } },
      { key: 'diastolicBp', label: '血圧(最低)', unit: 'mmHg', type: 'number', min: 30, max: 150, alert: { min: 60, max: 90 } },
      { key: 'pulse', label: '脈拍', unit: '回/分', type: 'number', min: 40, max: 200, alert: { min: 50, max: 100 } },
    ]
  },
  blood: {
    name: '血液検査',
    items: [
      { key: 'rbc', label: '赤血球', unit: '万/μL', type: 'number', alert: { min: 400, max: 550 } },
      { key: 'wbc', label: '白血球', unit: '/μL', type: 'number', alert: { min: 3500, max: 9000 } },
      { key: 'hb', label: 'ヘモグロビン', unit: 'g/dL', type: 'number', alert: { min: 12, max: 18 } },
      { key: 'hct', label: 'ヘマトクリット', unit: '%', type: 'number', alert: { min: 35, max: 50 } },
      { key: 'plt', label: '血小板', unit: '万/μL', type: 'number', alert: { min: 15, max: 35 } },
    ]
  },
  biochemical: {
    name: '生化学検査',
    items: [
      { key: 'ast', label: 'AST(GOT)', unit: 'U/L', type: 'number', alert: { max: 30 } },
      { key: 'alt', label: 'ALT(GPT)', unit: 'U/L', type: 'number', alert: { max: 30 } },
      { key: 'gtp', label: 'γ-GTP', unit: 'U/L', type: 'number', alert: { max: 50 } },
      { key: 'ldl', label: 'LDLコレステロール', unit: 'mg/dL', type: 'number', alert: { max: 140 } },
      { key: 'hdl', label: 'HDLコレステロール', unit: 'mg/dL', type: 'number', alert: { min: 40 } },
      { key: 'tg', label: '中性脂肪', unit: 'mg/dL', type: 'number', alert: { max: 150 } },
      { key: 'glucose', label: '血糖値', unit: 'mg/dL', type: 'number', alert: { max: 100 } },
      { key: 'hba1c', label: 'HbA1c', unit: '%', type: 'number', alert: { max: 5.6 } },
      { key: 'creatinine', label: 'クレアチニン', unit: 'mg/dL', type: 'number', alert: { max: 1.0 } },
      { key: 'uricAcid', label: '尿酸', unit: 'mg/dL', type: 'number', alert: { max: 7.0 } },
    ]
  },
  urine: {
    name: '尿検査',
    items: [
      { key: 'urineProtein', label: '尿蛋白', unit: '', type: 'select', options: ['-', '±', '+', '++', '+++'] },
      { key: 'urineGlucose', label: '尿糖', unit: '', type: 'select', options: ['-', '±', '+', '++', '+++'] },
      { key: 'urineOccultBlood', label: '尿潜血', unit: '', type: 'select', options: ['-', '±', '+', '++', '+++'] },
    ]
  }
};

export default function HealthManagementPage() {
  // State
  const [activeTab, setActiveTab] = useState('input');
  const [checkups, setCheckups] = useState<HealthCheckup[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    staffName: '',
    department: '',
    dateFrom: '',
    dateTo: '',
    overallResult: '',
    reexaminationRequired: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0
  });
  const [showImportDialog, setShowImportDialog] = useState(false);

  // 健診データ入力用ステート
  const [inputStaffId, setInputStaffId] = useState('');
  const [inputStaffInfo, setInputStaffInfo] = useState<any>(null);
  const [checkupDate, setCheckupDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [checkupData, setCheckupData] = useState<Record<string, any>>({});
  const [autoAlerts, setAutoAlerts] = useState<Array<{category: string, item: string, value: any, alert: string}>>([]);
  const [saving, setSaving] = useState(false);

  // 産業医診断用ステート
  const [diagnosisCheckups, setDiagnosisCheckups] = useState<HealthCheckup[]>([]);
  const [selectedCheckup, setSelectedCheckup] = useState<any>(null);
  const [diagnosisData, setDiagnosisData] = useState({
    overallResult: '',
    reexaminationRequired: false,
    reexaminationItems: '',
    occupationalDoctorFindings: '',
    workRestrictions: '',
    workAccommodations: '',
    followUpRequired: false,
    followUpDate: '',
    sendToVoiceDrive: false
  });
  const [loadingDiagnosis, setLoadingDiagnosis] = useState(false);

  // データ取得
  const fetchCheckups = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (searchParams.department) queryParams.append('department', searchParams.department);
      if (searchParams.dateFrom) queryParams.append('dateFrom', searchParams.dateFrom);
      if (searchParams.dateTo) queryParams.append('dateTo', searchParams.dateTo);
      if (searchParams.overallResult && searchParams.overallResult !== 'all') queryParams.append('overallResult', searchParams.overallResult);
      if (searchParams.reexaminationRequired && searchParams.reexaminationRequired !== 'all') queryParams.append('reexaminationRequired', searchParams.reexaminationRequired);

      queryParams.append('page', pagination.page.toString());
      queryParams.append('pageSize', pagination.pageSize.toString());

      const response = await fetch(`/api/health/checkups?${queryParams}`);
      const result = await response.json();

      if (result.success) {
        setCheckups(result.data);
        setPagination(prev => ({
          ...prev,
          total: result.pagination.total,
          totalPages: result.pagination.totalPages
        }));
      }
    } catch (error) {
      console.error('Failed to fetch checkups:', error);
    } finally {
      setLoading(false);
    }
  }, [searchParams, pagination.page, pagination.pageSize]);

  // 統計データ取得
  const fetchStatistics = useCallback(async () => {
    try {
      const response = await fetch('/api/health/statistics');
      const result = await response.json();
      if (result.success) {
        setStatistics(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  }, []);

  useEffect(() => {
    fetchCheckups();
    fetchStatistics();
  }, [fetchCheckups, fetchStatistics]);

  // 産業医診断タブがアクティブになったら未診断リストを取得
  useEffect(() => {
    if (activeTab === 'occupational') {
      fetchUndiagnosedCheckups();
    }
  }, [activeTab]);

  // 検索実行
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchCheckups();
  };

  // リセット
  const handleReset = () => {
    setSearchParams({
      staffName: '',
      department: '',
      dateFrom: '',
      dateTo: '',
      overallResult: '',
      reexaminationRequired: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // インポート完了
  const handleImportComplete = () => {
    setShowImportDialog(false);
    fetchCheckups();
    fetchStatistics();
  };

  // 職員検索
  const handleStaffSearch = async () => {
    if (!inputStaffId) return;

    try {
      const response = await fetch(`/api/staff/${inputStaffId}`);
      const result = await response.json();

      if (result.success) {
        setInputStaffInfo(result.data);
      } else {
        alert('職員が見つかりません');
        setInputStaffInfo(null);
      }
    } catch (error) {
      console.error('Failed to fetch staff:', error);
      alert('職員情報の取得に失敗しました');
    }
  };

  // 健診データ入力
  const handleCheckupDataChange = (key: string, value: any) => {
    const newData = { ...checkupData, [key]: value };

    // BMI自動計算
    if (key === 'height' || key === 'weight') {
      const height = newData.height;
      const weight = newData.weight;
      if (height && weight) {
        newData.bmi = (weight / Math.pow(height / 100, 2)).toFixed(1);
      }
    }

    setCheckupData(newData);

    // アラートチェック
    checkAlerts(key, value);
  };

  // アラートチェック
  const checkAlerts = (key: string, value: any) => {
    const alerts: Array<{category: string, item: string, value: any, alert: string}> = [];

    Object.entries(CHECKUP_CATEGORIES).forEach(([catKey, category]) => {
      category.items.forEach(item => {
        if (item.key === key && item.alert) {
          const numValue = parseFloat(value);
          if (isNaN(numValue)) return;

          let alertMsg = '';
          if (item.alert.min !== undefined && numValue < item.alert.min) {
            alertMsg = `基準値下限（${item.alert.min}${item.unit}）を下回っています`;
          }
          if (item.alert.max !== undefined && numValue > item.alert.max) {
            alertMsg = `基準値上限（${item.alert.max}${item.unit}）を超えています`;
          }

          if (alertMsg) {
            alerts.push({
              category: category.name,
              item: item.label,
              value: `${value}${item.unit}`,
              alert: alertMsg
            });
          }
        }
      });
    });

    setAutoAlerts(prev => {
      const filtered = prev.filter(a => a.item !== key);
      return [...filtered, ...alerts];
    });
  };

  // 健診データ保存
  const handleSaveCheckup = async () => {
    if (!inputStaffInfo) {
      alert('職員を選択してください');
      return;
    }

    if (!checkupDate) {
      alert('健診日を入力してください');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/health/checkups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId: inputStaffInfo.id,
          checkupDate,
          ...checkupData
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('健診データを保存しました');
        // リセット
        setInputStaffId('');
        setInputStaffInfo(null);
        setCheckupData({});
        setAutoAlerts([]);
        fetchStatistics();
      } else {
        alert('保存に失敗しました: ' + result.error);
      }
    } catch (error) {
      console.error('Failed to save checkup:', error);
      alert('保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  // 未診断健診データ取得（産業医用）
  const fetchUndiagnosedCheckups = async () => {
    setLoadingDiagnosis(true);
    try {
      const response = await fetch('/api/health/checkups?undiagnosed=true');
      const result = await response.json();
      if (result.success) {
        setDiagnosisCheckups(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch undiagnosed checkups:', error);
    } finally {
      setLoadingDiagnosis(false);
    }
  };

  // 健診データ選択（産業医診断用）
  const handleSelectCheckupForDiagnosis = async (checkup: HealthCheckup) => {
    try {
      const response = await fetch(`/api/health/checkups/${checkup.id}/details`);
      const result = await response.json();

      if (result.success) {
        setSelectedCheckup(result.data);
        // 既存の診断データがあれば復元
        setDiagnosisData({
          overallResult: result.data.overallResult || '',
          reexaminationRequired: result.data.reexaminationRequired || false,
          reexaminationItems: result.data.reexaminationItems || '',
          occupationalDoctorFindings: result.data.occupationalDoctorFindings || '',
          workRestrictions: result.data.workRestrictions || '',
          workAccommodations: result.data.workAccommodations || '',
          followUpRequired: result.data.followUpRequired || false,
          followUpDate: result.data.followUpDate || '',
          sendToVoiceDrive: false
        });
      }
    } catch (error) {
      console.error('Failed to fetch checkup details:', error);
      alert('健診データの取得に失敗しました');
    }
  };

  // 産業医診断保存
  const handleSaveDiagnosis = async () => {
    if (!selectedCheckup) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/health/checkups/${selectedCheckup.id}/diagnosis`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(diagnosisData)
      });

      const result = await response.json();

      if (result.success) {
        alert('診断結果を保存しました');

        // VoiceDrive連携送信
        if (diagnosisData.sendToVoiceDrive) {
          await sendToVoiceDrive(selectedCheckup.id);
        }

        // リセット
        setSelectedCheckup(null);
        setDiagnosisData({
          overallResult: '',
          reexaminationRequired: false,
          reexaminationItems: '',
          occupationalDoctorFindings: '',
          workRestrictions: '',
          workAccommodations: '',
          followUpRequired: false,
          followUpDate: '',
          sendToVoiceDrive: false
        });
        fetchUndiagnosedCheckups();
        fetchStatistics();
      } else {
        alert('保存に失敗しました: ' + result.error);
      }
    } catch (error) {
      console.error('Failed to save diagnosis:', error);
      alert('保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  // VoiceDriveへの送信
  const sendToVoiceDrive = async (checkupId: string) => {
    try {
      const response = await fetch(`/api/health/checkups/${checkupId}/send-voicedrive`, {
        method: 'POST'
      });
      const result = await response.json();

      if (result.success) {
        alert('VoiceDriveに送信しました');
      } else {
        alert('VoiceDrive送信に失敗しました: ' + result.error);
      }
    } catch (error) {
      console.error('Failed to send to VoiceDrive:', error);
      alert('VoiceDrive送信に失敗しました');
    }
  };

  // 結果バッジの色
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

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">健康診断管理</h1>
          <p className="text-muted-foreground mt-1">
            職員の健康診断データを管理します
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowImportDialog(true)}
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            CSVインポート
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            エクスポート
          </Button>
        </div>
      </div>

      {/* 統計カード */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">実施件数</p>
                  <p className="text-2xl font-bold">{statistics.totalCheckups}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">実施率</p>
                  <p className="text-2xl font-bold">{statistics.completionRate.toFixed(1)}%</p>
                </div>
                <Activity className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">要再検査率</p>
                  <p className="text-2xl font-bold">{statistics.reexaminationRate.toFixed(1)}%</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">異常なし</p>
                  <p className="text-2xl font-bold">
                    {statistics.resultDistribution['A'] || 0}名
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* タブ */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="input">健診データ入力</TabsTrigger>
          <TabsTrigger value="occupational">産業医診断</TabsTrigger>
          <TabsTrigger value="list">健診一覧</TabsTrigger>
          <TabsTrigger value="reexamination">要再検査</TabsTrigger>
          <TabsTrigger value="stress">ストレスチェック</TabsTrigger>
          <TabsTrigger value="stress-followup">フォローアップ</TabsTrigger>
          <TabsTrigger value="stress-group">集団分析</TabsTrigger>
          <TabsTrigger value="stress-individual">個別分析</TabsTrigger>
          <TabsTrigger value="analysis">統計分析</TabsTrigger>
        </TabsList>

        {/* 健診データ入力タブ */}
        <TabsContent value="input" className="space-y-4">
          {/* 職員選択 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserSearch className="w-5 h-5" />
                職員選択
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="staffId">職員ID</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="staffId"
                      placeholder="職員IDを入力"
                      value={inputStaffId}
                      onChange={(e) => setInputStaffId(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleStaffSearch()}
                    />
                    <Button onClick={handleStaffSearch}>
                      <Search className="w-4 h-4 mr-1" />
                      検索
                    </Button>
                  </div>
                </div>
                <div className="flex-1">
                  <Label>健診実施日</Label>
                  <Input
                    type="date"
                    value={checkupDate}
                    onChange={(e) => setCheckupDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              {inputStaffInfo && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-lg">{inputStaffInfo.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {inputStaffInfo.department} / {inputStaffInfo.position}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => {
                      setInputStaffInfo(null);
                      setInputStaffId('');
                    }}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {inputStaffInfo && (
            <>
              {/* 健診項目入力フォーム */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(CHECKUP_CATEGORIES).map(([catKey, category]) => (
                  <Card key={catKey}>
                    <CardHeader>
                      <CardTitle className="text-md">{category.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {category.items.map((item) => (
                          <div key={item.key}>
                            <Label htmlFor={item.key} className="text-sm">
                              {item.label}
                              {item.unit && <span className="text-muted-foreground ml-1">({item.unit})</span>}
                            </Label>
                            {item.type === 'number' && (
                              <Input
                                id={item.key}
                                type="number"
                                step="0.1"
                                min={item.min}
                                max={item.max}
                                value={checkupData[item.key] || ''}
                                onChange={(e) => handleCheckupDataChange(item.key, e.target.value)}
                                className="mt-1"
                              />
                            )}
                            {item.type === 'calculated' && (
                              <Input
                                id={item.key}
                                value={checkupData[item.key] || ''}
                                disabled
                                className="mt-1 bg-gray-100"
                              />
                            )}
                            {item.type === 'select' && item.options && (
                              <Select
                                value={checkupData[item.key] || ''}
                                onValueChange={(value) => handleCheckupDataChange(item.key, value)}
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="選択" />
                                </SelectTrigger>
                                <SelectContent>
                                  {item.options.map(opt => (
                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* 自動アラート */}
              {autoAlerts.length > 0 && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      異常値検出
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {autoAlerts.map((alert, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-white rounded border border-orange-200">
                          <AlertTriangle className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{alert.item}: {alert.value}</p>
                            <p className="text-sm text-muted-foreground">{alert.alert}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 保存ボタン */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setInputStaffInfo(null);
                    setInputStaffId('');
                    setCheckupData({});
                    setAutoAlerts([]);
                  }}
                >
                  キャンセル
                </Button>
                <Button
                  onClick={handleSaveCheckup}
                  disabled={saving}
                  className="gap-2"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      保存
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </TabsContent>

        {/* 産業医診断タブ */}
        <TabsContent value="occupational" className="space-y-4">
          {!selectedCheckup ? (
            /* 未診断リスト */
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">産業医診断待ちリスト</CardTitle>
                  <Button
                    onClick={fetchUndiagnosedCheckups}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    更新
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loadingDiagnosis ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : diagnosisCheckups.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                    <p>診断待ちの健診データはありません</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {diagnosisCheckups.map((checkup) => (
                      <div
                        key={checkup.id}
                        className="flex items-center justify-between p-4 border rounded hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleSelectCheckupForDiagnosis(checkup)}
                      >
                        <div>
                          <p className="font-medium">{checkup.staff?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {checkup.staff?.department} / {checkup.staff?.position}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {format(new Date(checkup.checkupDate), 'yyyy年MM月dd日', { locale: ja })}
                            </p>
                            <p className="text-xs text-muted-foreground">健診実施</p>
                          </div>
                          <Button size="sm">
                            診断開始
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            /* 診断画面 */
            <>
              {/* 職員情報・健診データ表示 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {selectedCheckup.staff?.name} の健診結果
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCheckup(null)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      閉じる
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">部署</p>
                      <p className="font-medium">{selectedCheckup.staff?.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">職位</p>
                      <p className="font-medium">{selectedCheckup.staff?.position}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">健診日</p>
                      <p className="font-medium">
                        {format(new Date(selectedCheckup.checkupDate), 'yyyy年MM月dd日', { locale: ja })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">年齢</p>
                      <p className="font-medium">{selectedCheckup.staff?.age || '-'}歳</p>
                    </div>
                  </div>

                  {/* 健診結果データ表示 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCheckup.details && selectedCheckup.details.length > 0 ? (
                      selectedCheckup.details.map((detail: any, index: number) => (
                        <div key={index} className="flex justify-between p-2 border-b">
                          <span className="text-sm">{detail.itemName}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {detail.value} {detail.unit}
                            </span>
                            {detail.status === 'ABNORMAL' && (
                              <Badge variant="destructive" className="text-xs">異常</Badge>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground col-span-2">詳細データなし</p>
                    )}
                  </div>

                  {/* 過去データ比較 */}
                  {selectedCheckup.history && selectedCheckup.history.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">過去データとの比較</h4>
                      <div className="text-sm text-muted-foreground">
                        前回健診: {format(new Date(selectedCheckup.history[0].date), 'yyyy年MM月dd日', { locale: ja })}
                        （判定: {selectedCheckup.history[0].result}）
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 診断フォーム */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-md">総合判定</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>判定区分</Label>
                      <Select
                        value={diagnosisData.overallResult}
                        onValueChange={(value) => setDiagnosisData({ ...diagnosisData, overallResult: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A - 異常なし</SelectItem>
                          <SelectItem value="B">B - 軽度異常</SelectItem>
                          <SelectItem value="C">C - 要経過観察</SelectItem>
                          <SelectItem value="D">D - 要精密検査</SelectItem>
                          <SelectItem value="E">E - 要治療</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="reexamination"
                        checked={diagnosisData.reexaminationRequired}
                        onChange={(e) => setDiagnosisData({ ...diagnosisData, reexaminationRequired: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="reexamination">要再検査</Label>
                    </div>

                    {diagnosisData.reexaminationRequired && (
                      <div>
                        <Label>再検査項目</Label>
                        <Input
                          value={diagnosisData.reexaminationItems}
                          onChange={(e) => setDiagnosisData({ ...diagnosisData, reexaminationItems: e.target.value })}
                          placeholder="例: 血圧、血糖値"
                          className="mt-1"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-md">フォローアップ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="followUp"
                        checked={diagnosisData.followUpRequired}
                        onChange={(e) => setDiagnosisData({ ...diagnosisData, followUpRequired: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="followUp">フォローアップ必要</Label>
                    </div>

                    {diagnosisData.followUpRequired && (
                      <div>
                        <Label>フォローアップ予定日</Label>
                        <Input
                          type="date"
                          value={diagnosisData.followUpDate}
                          onChange={(e) => setDiagnosisData({ ...diagnosisData, followUpDate: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="sendVoiceDrive"
                        checked={diagnosisData.sendToVoiceDrive}
                        onChange={(e) => setDiagnosisData({ ...diagnosisData, sendToVoiceDrive: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="sendVoiceDrive">VoiceDriveに送信</Label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 所見・配慮事項入力 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-md">産業医所見・就労配慮事項</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>産業医所見</Label>
                    <textarea
                      className="w-full mt-1 min-h-[100px] p-2 border rounded"
                      value={diagnosisData.occupationalDoctorFindings}
                      onChange={(e) => setDiagnosisData({ ...diagnosisData, occupationalDoctorFindings: e.target.value })}
                      placeholder="医学的所見を記載してください"
                    />
                  </div>

                  <div>
                    <Label>就労制限</Label>
                    <textarea
                      className="w-full mt-1 min-h-[80px] p-2 border rounded"
                      value={diagnosisData.workRestrictions}
                      onChange={(e) => setDiagnosisData({ ...diagnosisData, workRestrictions: e.target.value })}
                      placeholder="例: 重量物の取り扱い制限、夜勤制限など"
                    />
                  </div>

                  <div>
                    <Label>必要な配慮</Label>
                    <textarea
                      className="w-full mt-1 min-h-[80px] p-2 border rounded"
                      value={diagnosisData.workAccommodations}
                      onChange={(e) => setDiagnosisData({ ...diagnosisData, workAccommodations: e.target.value })}
                      placeholder="例: 定期的な休憩時間の確保、業務量の調整など"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 保存ボタン */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedCheckup(null)}
                >
                  キャンセル
                </Button>
                <Button
                  onClick={handleSaveDiagnosis}
                  disabled={saving || !diagnosisData.overallResult}
                  className="gap-2"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      診断を保存
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </TabsContent>

        {/* 一覧タブ */}
        <TabsContent value="list" className="space-y-4">
          {/* 検索フィルター */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="w-5 h-5" />
                検索フィルター
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="department">部署</Label>
                  <Input
                    id="department"
                    placeholder="部署名"
                    value={searchParams.department}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, department: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="dateFrom">実施日（開始）</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={searchParams.dateFrom}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, dateFrom: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="dateTo">実施日（終了）</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={searchParams.dateTo}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, dateTo: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="overallResult">総合判定</Label>
                  <Select
                    value={searchParams.overallResult}
                    onValueChange={(value) => setSearchParams(prev => ({ ...prev, overallResult: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全て</SelectItem>
                      <SelectItem value="A">A (異常なし)</SelectItem>
                      <SelectItem value="B">B (軽度異常)</SelectItem>
                      <SelectItem value="C">C (要経過観察)</SelectItem>
                      <SelectItem value="D">D (要精密検査)</SelectItem>
                      <SelectItem value="E">E (要治療)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="reexamination">要再検査</Label>
                  <Select
                    value={searchParams.reexaminationRequired}
                    onValueChange={(value) => setSearchParams(prev => ({ ...prev, reexaminationRequired: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全て</SelectItem>
                      <SelectItem value="true">要再検査のみ</SelectItem>
                      <SelectItem value="false">再検査不要のみ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={handleReset}>
                  リセット
                </Button>
                <Button onClick={handleSearch} className="gap-2">
                  <Search className="w-4 h-4" />
                  検索
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* データテーブル */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">健診データ一覧</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>職員ID</TableHead>
                        <TableHead>氏名</TableHead>
                        <TableHead>部署</TableHead>
                        <TableHead>健診日</TableHead>
                        <TableHead>総合判定</TableHead>
                        <TableHead>要再検査</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {checkups.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground">
                            データがありません
                          </TableCell>
                        </TableRow>
                      ) : (
                        checkups.map((checkup) => (
                          <TableRow key={checkup.id}>
                            <TableCell>{checkup.staffId}</TableCell>
                            <TableCell>{checkup.staff?.name || '-'}</TableCell>
                            <TableCell>{checkup.staff?.department || '-'}</TableCell>
                            <TableCell>
                              {format(new Date(checkup.checkupDate), 'yyyy年MM月dd日', { locale: ja })}
                            </TableCell>
                            <TableCell>
                              <Badge className={getResultBadgeColor(checkup.overallResult)}>
                                {checkup.overallResult || '-'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {checkup.reexaminationRequired ? (
                                <Badge variant="destructive">要</Badge>
                              ) : (
                                <Badge variant="secondary">不要</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-red-600">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>

                  {/* ページネーション */}
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      全{pagination.total}件中 {(pagination.page - 1) * pagination.pageSize + 1}-
                      {Math.min(pagination.page * pagination.pageSize, pagination.total)}件を表示
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                        disabled={pagination.page === pagination.totalPages}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 要再検査タブ */}
        <TabsContent value="reexamination">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">要再検査者リスト</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  再検査が必要な職員のリストです。早急な対応をお願いします。
                </AlertDescription>
              </Alert>
              <div className="mt-4">
                {/* 再検査者リストを表示 */}
                <p className="text-muted-foreground">実装予定</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ストレスチェックタブ */}
        <TabsContent value="stress">
          <StressCheckDistribution />
        </TabsContent>

        {/* ストレスチェック - フォローアップタブ */}
        <TabsContent value="stress-followup">
          <FollowUpManagement />
        </TabsContent>

        {/* ストレスチェック - 集団分析タブ */}
        <TabsContent value="stress-group">
          <GroupAnalysis />
        </TabsContent>

        {/* ストレスチェック - 個別分析タブ */}
        <TabsContent value="stress-individual">
          <IndividualAnalysis />
        </TabsContent>

        {/* 統計分析タブ（既存の分析タブ） */}
        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">健診データ分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 結果分布グラフ */}
                <div>
                  <h3 className="font-medium mb-2">総合判定分布</h3>
                  <div className="space-y-2">
                    {statistics && Object.entries(statistics.resultDistribution).map(([result, count]) => (
                      <div key={result} className="flex items-center gap-2">
                        <Badge className={getResultBadgeColor(result)}>{result}</Badge>
                        <div className="flex-1 bg-gray-200 rounded-full h-4">
                          <div
                            className="bg-blue-500 h-4 rounded-full"
                            style={{ width: `${(count / statistics.totalCheckups) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm">{count}名</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* その他の分析 */}
                <div>
                  <h3 className="font-medium mb-2">部署別統計</h3>
                  <p className="text-muted-foreground">実装予定</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* CSVインポートダイアログ */}
      <CsvImportDialog
        open={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onImportComplete={handleImportComplete}
      />
    </div>
  );
}