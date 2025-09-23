'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Settings,
  Lock,
  Unlock,
  Plus,
  Save,
  Send,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Edit3,
  Sliders,
  FileText,
  History,
} from 'lucide-react';
import { DepartmentCustomPermission, CustomizationRequest } from '@/types/masterData';

interface Props {
  department: string;
  currentUser: {
    id: string;
    name: string;
    role: string;
    department: string;
  };
}

export default function DepartmentCustomizationPanel({ department, currentUser }: Props) {
  const [permission, setPermission] = useState<DepartmentCustomPermission | null>(null);
  const [customSettings, setCustomSettings] = useState<any>({});
  const [pendingRequests, setPendingRequests] = useState<CustomizationRequest[]>([]);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [requestType, setRequestType] = useState<string>('');
  const [requestDetails, setRequestDetails] = useState<any>({});

  // デモ用の権限データ
  useEffect(() => {
    // 実際はAPIから取得
    setPermission({
      id: 'PERM_001',
      departmentId: 'DEPT_001',
      departmentName: department,
      facilityName: '小原病院',
      customizableItems: {
        scoreAdjustment: {
          allowed: true,
          range: 10,
          requiresApproval: false,
        },
        itemAddition: {
          allowed: true,
          maxItems: 3,
          requiresApproval: true,
          allowedCategories: ['専門技術', '部署特有'],
        },
        thresholdChange: {
          allowed: false,
          requiresApproval: true,
        },
        gradeConversion: {
          allowed: false,
          requiresApproval: true,
        },
      },
      managers: {
        primary: currentUser.name,
        secondary: '副リハビリ科長',
      },
      status: 'active',
      validFrom: '2024-04-01',
      lastModified: '2024-04-01',
      modifiedBy: '人事部',
    });

    // デモ用の申請データ
    setPendingRequests([
      {
        id: 'REQ_001',
        departmentId: 'DEPT_001',
        departmentName: department,
        requesterId: currentUser.id,
        requesterName: currentUser.name,
        requestDate: '2024-04-15',
        requestType: 'item_addition',
        requestDetails: {
          current: [],
          proposed: ['ADL改善度評価'],
          reason: 'リハビリ成果を適切に評価するため',
          impact: 'PT/OT/ST全員に適用',
        },
        approvalStatus: 'pending',
        approvalLevel: 1,
        approvers: [],
      },
    ]);
  }, [department, currentUser]);

  const handleScoreAdjustment = (value: number[]) => {
    setCustomSettings({
      ...customSettings,
      scoreAdjustment: value[0],
    });
  };

  const handleItemAddition = () => {
    setRequestType('item_addition');
    setShowRequestDialog(true);
  };

  const handleSubmitRequest = () => {
    // 申請処理
    console.log('Submitting request:', requestType, requestDetails);
    setShowRequestDialog(false);
    alert('申請を送信しました。承認をお待ちください。');
  };

  if (!permission) {
    return <div>権限情報を読み込み中...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 権限状態表示 */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {department} カスタマイズ設定
            </div>
            <Badge variant={permission.status === 'active' ? 'default' : 'secondary'}>
              {permission.status === 'active' ? '有効' : '停止中'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">主管理者</p>
              <p className="font-medium">{permission.managers.primary}</p>
            </div>
            <div>
              <p className="text-gray-600">有効期間</p>
              <p className="font-medium">
                {permission.validFrom} 〜 {permission.validUntil || '無期限'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* カスタマイズ設定タブ */}
      <Tabs defaultValue="score" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="score">配点調整</TabsTrigger>
          <TabsTrigger value="items">評価項目</TabsTrigger>
          <TabsTrigger value="requests">申請状況</TabsTrigger>
          <TabsTrigger value="history">変更履歴</TabsTrigger>
        </TabsList>

        {/* 配点調整タブ */}
        <TabsContent value="score">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sliders className="h-4 w-4" />
                配点調整
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {permission.customizableItems.scoreAdjustment?.allowed ? (
                <>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>調整可能範囲</AlertTitle>
                    <AlertDescription>
                      標準配点から±{permission.customizableItems.scoreAdjustment.range}点まで調整可能です。
                      {permission.customizableItems.scoreAdjustment.requiresApproval && '（要承認）'}
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div>
                      <Label>技術評価配点（標準: 50点）</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm w-12">
                          {50 + (customSettings.scoreAdjustment || 0)}点
                        </span>
                        <Slider
                          value={[customSettings.scoreAdjustment || 0]}
                          onValueChange={handleScoreAdjustment}
                          min={-permission.customizableItems.scoreAdjustment.range}
                          max={permission.customizableItems.scoreAdjustment.range}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-600">
                          ({customSettings.scoreAdjustment > 0 ? '+' : ''}{customSettings.scoreAdjustment || 0})
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label>組織貢献度配点（自動調整）</Label>
                      <div className="text-2xl font-semibold mt-2">
                        {50 - (customSettings.scoreAdjustment || 0)}点
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    disabled={!customSettings.scoreAdjustment}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    配点変更を保存
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <Lock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">配点調整権限がありません</p>
                  <p className="text-sm text-gray-500 mt-2">
                    配点変更には本部の承認が必要です
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 評価項目タブ */}
        <TabsContent value="items">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  専門評価項目
                </div>
                {permission.customizableItems.itemAddition?.allowed && (
                  <Button size="sm" onClick={handleItemAddition}>
                    <Plus className="h-4 w-4 mr-2" />
                    項目追加申請
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {permission.customizableItems.itemAddition?.allowed ? (
                <div className="space-y-4">
                  <Alert className="bg-blue-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>追加可能項目</AlertTitle>
                    <AlertDescription>
                      最大{permission.customizableItems.itemAddition.maxItems}項目まで追加可能
                      {permission.customizableItems.itemAddition.requiresApproval && '（要承認）'}
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">ADL改善度</p>
                          <p className="text-sm text-gray-600">リハビリテーション効果測定</p>
                        </div>
                        <Badge>5点</Badge>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">FIM利得</p>
                          <p className="text-sm text-gray-600">機能的自立度評価</p>
                        </div>
                        <Badge>3点</Badge>
                      </div>
                    </div>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      <Button variant="ghost" onClick={handleItemAddition}>
                        <Plus className="h-4 w-4 mr-2" />
                        新規項目を追加（残り1枠）
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Lock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">項目追加権限がありません</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 申請状況タブ */}
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                申請状況
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingRequests.map(request => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={
                            request.approvalStatus === 'approved' ? 'default' :
                            request.approvalStatus === 'rejected' ? 'destructive' :
                            'secondary'
                          }>
                            {request.approvalStatus === 'pending' ? '承認待ち' :
                             request.approvalStatus === 'approved' ? '承認済' :
                             request.approvalStatus === 'rejected' ? '却下' : '修正依頼'}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {request.requestDate}
                          </span>
                        </div>
                        <p className="font-medium">{request.requestType === 'item_addition' ? '評価項目追加' : request.requestType}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {request.requestDetails.reason}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {request.approvalStatus === 'pending' && (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        )}
                        {request.approvalStatus === 'approved' && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                        {request.approvalStatus === 'rejected' && (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {pendingRequests.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    申請中の項目はありません
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 変更履歴タブ */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-4 w-4" />
                変更履歴
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-2 border-blue-500 pl-4">
                  <p className="text-sm text-gray-600">2024-04-15 14:30</p>
                  <p className="font-medium">評価項目追加申請</p>
                  <p className="text-sm">ADL改善度を追加申請</p>
                  <p className="text-xs text-gray-500">申請者: {currentUser.name}</p>
                </div>
                <div className="border-l-2 border-green-500 pl-4">
                  <p className="text-sm text-gray-600">2024-04-01 09:00</p>
                  <p className="font-medium">カスタマイズ権限付与</p>
                  <p className="text-sm">部署別カスタマイズ権限が有効化されました</p>
                  <p className="text-xs text-gray-500">承認者: 人事部長</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 申請ダイアログ */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>評価項目追加申請</DialogTitle>
            <DialogDescription>
              新しい評価項目の追加を申請します。承認後に有効となります。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>項目名</Label>
              <Input
                placeholder="例：在宅復帰率"
                onChange={(e) => setRequestDetails({...requestDetails, name: e.target.value})}
              />
            </div>
            <div>
              <Label>配点</Label>
              <Input
                type="number"
                placeholder="5"
                onChange={(e) => setRequestDetails({...requestDetails, score: e.target.value})}
              />
            </div>
            <div>
              <Label>申請理由</Label>
              <Textarea
                placeholder="この項目が必要な理由を記入してください"
                rows={3}
                onChange={(e) => setRequestDetails({...requestDetails, reason: e.target.value})}
              />
            </div>
            <div>
              <Label>影響範囲</Label>
              <Textarea
                placeholder="対象となる職員や期待される効果を記入してください"
                rows={2}
                onChange={(e) => setRequestDetails({...requestDetails, impact: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
              キャンセル
            </Button>
            <Button onClick={handleSubmitRequest}>
              <Send className="h-4 w-4 mr-2" />
              申請を送信
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}