'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Bell,
  FileText,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { ApplicantStatusDefinition } from '@/types/recruitmentMaster';

const ApplicantStatusConfig: React.FC = () => {
  const [statuses, setStatuses] = useState<ApplicantStatusDefinition[]>([
    {
      id: '1',
      code: 'document_review',
      name: '書類選考中',
      category: 'screening',
      description: '応募書類を審査中',
      color: 'blue',
      icon: 'FileText',
      order: 1,
      isActive: true,
      isDefault: true,
      isSystem: true,
      transitions: {
        allowedNext: ['first_interview', 'rejected'],
        requiredFields: ['resume', 'cover_letter'],
        requiredDocuments: ['履歴書', '職務経歴書']
      },
      autoActions: {
        onEnter: {
          sendNotification: true,
          notificationTemplate: 'document_received'
        },
        afterDays: {
          days: 7,
          action: 'remind',
          notificationTemplate: 'review_reminder'
        }
      },
      metadata: {
        createdAt: '2025-01-01T00:00:00',
        createdBy: 'system',
        updatedAt: '2025-01-01T00:00:00',
        updatedBy: 'system'
      }
    },
    {
      id: '2',
      code: 'first_interview',
      name: '一次面接',
      category: 'interview',
      description: '一次面接の段階',
      color: 'purple',
      icon: 'Users',
      order: 2,
      isActive: true,
      isDefault: false,
      isSystem: true,
      transitions: {
        allowedNext: ['second_interview', 'final_interview', 'rejected'],
        approvalRequired: true,
        approvers: ['hiring_manager']
      },
      autoActions: {
        onEnter: {
          sendNotification: true,
          notificationTemplate: 'interview_scheduled',
          createTask: true,
          taskTemplate: 'prepare_interview'
        }
      },
      metadata: {
        createdAt: '2025-01-01T00:00:00',
        createdBy: 'system',
        updatedAt: '2025-01-01T00:00:00',
        updatedBy: 'system'
      }
    },
    {
      id: '3',
      code: 'offer_sent',
      name: '内定通知済',
      category: 'offer',
      description: '内定通知を送付済み',
      color: 'green',
      icon: 'CheckCircle',
      order: 5,
      isActive: true,
      isDefault: false,
      isSystem: true,
      transitions: {
        allowedNext: ['hired', 'offer_declined'],
        requiredFields: ['offer_letter', 'start_date', 'salary']
      },
      autoActions: {
        afterDays: {
          days: 14,
          action: 'remind',
          notificationTemplate: 'offer_followup'
        }
      },
      metadata: {
        createdAt: '2025-01-01T00:00:00',
        createdBy: 'system',
        updatedAt: '2025-01-01T00:00:00',
        updatedBy: 'system'
      }
    }
  ]);

  const [expandedStatus, setExpandedStatus] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);

  const categoryColors: Record<string, string> = {
    screening: 'bg-blue-100 text-blue-800',
    interview: 'bg-purple-100 text-purple-800',
    offer: 'bg-green-100 text-green-800',
    hired: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-red-100 text-red-800',
    withdrawn: 'bg-gray-100 text-gray-800'
  };

  const categoryLabels: Record<string, string> = {
    screening: '選考中',
    interview: '面接',
    offer: '内定',
    hired: '採用',
    rejected: '不採用',
    withdrawn: '辞退'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">応募者ステータス定義</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          新規ステータス追加
        </button>
      </div>

      <div className="space-y-4">
        {statuses.map((status) => (
          <Card key={status.id} className="overflow-hidden">
            <CardHeader
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedStatus(expandedStatus === status.id ? null : status.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${status.color}-100`}>
                    <FileText className={`h-5 w-5 text-${status.color}-600`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-lg">{status.name}</h4>
                      <Badge className={categoryColors[status.category]}>
                        {categoryLabels[status.category]}
                      </Badge>
                      {status.isSystem && (
                        <Badge className="bg-gray-100 text-gray-600">
                          システム標準
                        </Badge>
                      )}
                      {status.isDefault && (
                        <Badge className="bg-blue-100 text-blue-600">
                          デフォルト
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{status.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <span>コード: {status.code}</span>
                      <span>•</span>
                      <span>表示順: {status.order}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!status.isSystem && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingStatus(status.id);
                        }}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <Edit2 className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle delete
                        }}
                        className="p-2 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </>
                  )}
                  {expandedStatus === status.id ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
            </CardHeader>

            {expandedStatus === status.id && (
              <CardContent className="border-t">
                <div className="space-y-4 pt-4">
                  {/* ステータス遷移 */}
                  <div>
                    <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <ArrowRight className="h-4 w-4" />
                      ステータス遷移ルール
                    </h5>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                      <div className="text-sm">
                        <span className="text-gray-600">遷移可能な次のステータス:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {status.transitions.allowedNext.map((next) => (
                            <Badge key={next} className="bg-white border">
                              {next}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {status.transitions.requiredFields && (
                        <div className="text-sm">
                          <span className="text-gray-600">必須フィールド:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {status.transitions.requiredFields.map((field) => (
                              <Badge key={field} className="bg-blue-50 text-blue-700">
                                {field}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {status.transitions.approvalRequired && (
                        <div className="text-sm flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                          <span className="text-orange-700">承認が必要</span>
                          {status.transitions.approvers && (
                            <span className="text-gray-600">
                              ({status.transitions.approvers.join(', ')})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 自動アクション */}
                  {status.autoActions && (
                    <div>
                      <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        自動アクション
                      </h5>
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        {status.autoActions.onEnter && (
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">ステータス開始時:</span>
                            <ul className="mt-1 space-y-1 ml-4">
                              {status.autoActions.onEnter.sendNotification && (
                                <li className="flex items-center gap-2">
                                  <Bell className="h-3 w-3 text-blue-500" />
                                  通知を送信 ({status.autoActions.onEnter.notificationTemplate})
                                </li>
                              )}
                              {status.autoActions.onEnter.createTask && (
                                <li className="flex items-center gap-2">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  タスクを作成 ({status.autoActions.onEnter.taskTemplate})
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                        {status.autoActions.afterDays && (
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">
                              {status.autoActions.afterDays.days}日後:
                            </span>
                            <span className="ml-2 text-gray-600">
                              {status.autoActions.afterDays.action === 'remind' && 'リマインド送信'}
                              {status.autoActions.afterDays.action === 'escalate' && 'エスカレーション'}
                              {status.autoActions.afterDays.action === 'auto_reject' && '自動不採用'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* メタデータ */}
                  <div className="text-xs text-gray-500 pt-2 border-t">
                    <div>作成: {new Date(status.metadata.createdAt).toLocaleDateString('ja-JP')} by {status.metadata.createdBy}</div>
                    <div>更新: {new Date(status.metadata.updatedAt).toLocaleDateString('ja-JP')} by {status.metadata.updatedBy}</div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">ステータス管理の注意事項</p>
            <ul className="space-y-1 text-blue-800">
              <li>• システム標準ステータスは削除できません</li>
              <li>• ステータスの順序は応募者の進捗フローに影響します</li>
              <li>• 自動アクションの設定は慎重に行ってください</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantStatusConfig;