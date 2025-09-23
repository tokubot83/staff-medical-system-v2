'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
} from '@/components/ui/alert';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Send,
  FileText,
  User,
  Calendar,
  ChevronRight,
  RotateCcw,
  Eye,
} from 'lucide-react';
import { CustomizationRequest } from '@/types/masterData';

export default function ApprovalWorkflowPanel() {
  const [selectedRequest, setSelectedRequest] = useState<CustomizationRequest | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalDecision, setApprovalDecision] = useState<'approved' | 'rejected' | 'revision_requested'>('approved');
  const [approvalComment, setApprovalComment] = useState('');
  const [conditions, setConditions] = useState<string[]>([]);

  // デモ用の申請データ
  const pendingRequests: CustomizationRequest[] = [
    {
      id: 'REQ_001',
      departmentId: 'DEPT_001',
      departmentName: '小原病院リハビリテーション科',
      requesterId: 'USER_001',
      requesterName: 'リハビリ科長',
      requestDate: '2024-04-15',
      requestType: 'score_adjustment',
      requestDetails: {
        current: { technical: 50, contribution: 50 },
        proposed: { technical: 60, contribution: 40 },
        reason: 'リハビリテーション科の専門技術評価を重視するため',
        impact: '部署内PT/OT/ST計30名に適用',
        testPeriod: '2024年度下期',
      },
      approvalStatus: 'pending',
      approvalLevel: 1,
      approvers: [
        {
          level: 1,
          approverId: 'APPROVER_001',
          approverName: '人事部長',
        },
      ],
    },
    {
      id: 'REQ_002',
      departmentId: 'DEPT_002',
      departmentName: 'ICU',
      requesterId: 'USER_002',
      requesterName: 'ICU師長',
      requestDate: '2024-04-10',
      requestType: 'item_addition',
      requestDetails: {
        current: [],
        proposed: ['緊急対応実績', '機器管理スキル', '教育指導実績'],
        reason: 'ICU特有の業務を評価に反映させるため',
        impact: 'ICU看護師15名に適用',
      },
      approvalStatus: 'pending',
      approvalLevel: 1,
      approvers: [
        {
          level: 1,
          approverId: 'APPROVER_001',
          approverName: '人事部長',
        },
      ],
    },
  ];

  const approvedRequests: CustomizationRequest[] = [
    {
      id: 'REQ_000',
      departmentId: 'DEPT_003',
      departmentName: '外来看護部',
      requesterId: 'USER_003',
      requesterName: '外来看護師長',
      requestDate: '2024-03-01',
      requestType: 'score_adjustment',
      requestDetails: {
        current: { technical: 50, contribution: 50 },
        proposed: { technical: 45, contribution: 55 },
        reason: '患者対応・接遇を重視',
        impact: '外来看護師20名',
      },
      approvalStatus: 'approved',
      approvalLevel: 2,
      approvers: [
        {
          level: 1,
          approverId: 'APPROVER_001',
          approverName: '人事部長',
          decision: 'approved',
          comment: '妥当な調整と判断',
          decidedAt: '2024-03-05',
        },
        {
          level: 2,
          approverId: 'APPROVER_002',
          approverName: '事務長',
          decision: 'approved',
          comment: '承認します',
          decidedAt: '2024-03-08',
        },
      ],
      finalDecision: '2024年度から適用',
      implementationDate: '2024-04-01',
    },
  ];

  const handleApproval = (request: CustomizationRequest) => {
    setSelectedRequest(request);
    setShowApprovalDialog(true);
  };

  const submitApproval = () => {
    console.log('Approval:', {
      request: selectedRequest,
      decision: approvalDecision,
      comment: approvalComment,
      conditions,
    });
    setShowApprovalDialog(false);
    alert(`申請を${approvalDecision === 'approved' ? '承認' : approvalDecision === 'rejected' ? '却下' : '差し戻し'}しました`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'revision_requested':
        return <RotateCcw className="h-4 w-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      approved: 'default',
      rejected: 'destructive',
      pending: 'secondary',
      revision_requested: 'outline',
    };
    const labels: Record<string, string> = {
      approved: '承認済',
      rejected: '却下',
      pending: '承認待ち',
      revision_requested: '修正依頼',
    };
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {labels[status] || status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            承認ワークフロー管理
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">
                承認待ち ({pendingRequests.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                承認済み
              </TabsTrigger>
              <TabsTrigger value="rejected">
                却下・差戻し
              </TabsTrigger>
            </TabsList>

            {/* 承認待ちタブ */}
            <TabsContent value="pending" className="space-y-4">
              {pendingRequests.map(request => (
                <Card key={request.id} className="border-yellow-200">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {getStatusIcon(request.approvalStatus)}
                          {getStatusBadge(request.approvalStatus)}
                          <span className="text-sm text-gray-600">
                            {request.requestDate}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{request.departmentName}</span>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{request.requesterName}</span>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="font-medium text-sm mb-1">
                              申請種別: {request.requestType === 'score_adjustment' ? '配点調整' :
                                      request.requestType === 'item_addition' ? '項目追加' :
                                      request.requestType}
                            </p>
                            <p className="text-sm text-gray-600">{request.requestDetails.reason}</p>
                            <p className="text-xs text-gray-500 mt-1">影響: {request.requestDetails.impact}</p>
                          </div>

                          {request.requestType === 'score_adjustment' && (
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <span className="text-gray-600">現在:</span>
                                <Badge variant="outline">
                                  技術 {request.requestDetails.current.technical}点
                                </Badge>
                                <Badge variant="outline">
                                  貢献 {request.requestDetails.current.contribution}点
                                </Badge>
                              </div>
                              <ChevronRight className="h-4 w-4" />
                              <div className="flex items-center gap-1">
                                <span className="text-gray-600">変更後:</span>
                                <Badge className="bg-blue-100 text-blue-800">
                                  技術 {request.requestDetails.proposed.technical}点
                                </Badge>
                                <Badge className="bg-blue-100 text-blue-800">
                                  貢献 {request.requestDetails.proposed.contribution}点
                                </Badge>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          詳細
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApproval(request)}
                        >
                          承認処理
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {pendingRequests.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  承認待ちの申請はありません
                </div>
              )}
            </TabsContent>

            {/* 承認済みタブ */}
            <TabsContent value="approved" className="space-y-4">
              {approvedRequests.map(request => (
                <Card key={request.id} className="border-green-200">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {getStatusIcon(request.approvalStatus)}
                          {getStatusBadge(request.approvalStatus)}
                          <span className="text-sm text-gray-600">
                            承認日: {request.approvers[request.approvers.length - 1]?.decidedAt}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <p className="font-medium">{request.departmentName}</p>
                          <p className="text-sm text-gray-600">
                            {request.requestType === 'score_adjustment' ? '配点調整' : '項目追加'}
                          </p>
                          <div className="bg-green-50 rounded p-2">
                            <p className="text-sm text-green-800">
                              実施日: {request.implementationDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* 却下・差戻しタブ */}
            <TabsContent value="rejected" className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                却下または差戻しされた申請はありません
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 承認ダイアログ */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>承認処理</DialogTitle>
            <DialogDescription>
              申請内容を確認し、承認・却下・差戻しを選択してください。
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p className="font-medium">{selectedRequest.departmentName}</p>
                    <p className="text-sm">{selectedRequest.requestDetails.reason}</p>
                  </div>
                </AlertDescription>
              </Alert>

              <div>
                <Label>承認判定</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={approvalDecision === 'approved' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setApprovalDecision('approved')}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    承認
                  </Button>
                  <Button
                    variant={approvalDecision === 'rejected' ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => setApprovalDecision('rejected')}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    却下
                  </Button>
                  <Button
                    variant={approvalDecision === 'revision_requested' ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => setApprovalDecision('revision_requested')}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    差戻し
                  </Button>
                </div>
              </div>

              {approvalDecision === 'approved' && (
                <div>
                  <Label>承認条件（任意）</Label>
                  <Textarea
                    placeholder="例：試験運用期間6ヶ月、効果測定を実施すること"
                    rows={2}
                    onChange={(e) => setConditions([e.target.value])}
                  />
                </div>
              )}

              <div>
                <Label>コメント</Label>
                <Textarea
                  placeholder="承認・却下の理由や申請者へのフィードバックを記入"
                  rows={3}
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              キャンセル
            </Button>
            <Button onClick={submitApproval} className={
              approvalDecision === 'approved' ? 'bg-green-600 hover:bg-green-700' :
              approvalDecision === 'rejected' ? 'bg-red-600 hover:bg-red-700' :
              'bg-orange-600 hover:bg-orange-700'
            }>
              {approvalDecision === 'approved' ? '承認する' :
               approvalDecision === 'rejected' ? '却下する' :
               '差戻す'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}