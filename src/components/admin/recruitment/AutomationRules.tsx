'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { AutomationRule } from '@/types/recruitmentMaster'
import {
  Plus, Edit2, Trash2, Play, Pause, Settings, Mail,
  Clock, Zap, AlertTriangle, CheckCircle, Calendar,
  RefreshCw, Filter, Bell, Webhook, FileText
} from 'lucide-react'

export default function AutomationRules() {
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: '1',
      ruleCode: 'visitor-reminder',
      ruleName: '見学リマインダー',
      description: '見学予定日の3日前と前日にリマインダーを送信',
      ruleType: 'time_based',
      trigger: {
        type: 'scheduled',
        schedule: {
          frequency: 'daily',
          time: '09:00',
          timezone: 'Asia/Tokyo'
        }
      },
      actions: [
        {
          type: 'send_email',
          config: {
            email: {
              enabled: true,
              recipients: ['applicant'],
              subject: '【リマインダー】施設見学のご案内',
              bodyTemplate: '見学予定日が近づいています。日時：{visitDate} 場所：{facility}',
              attachments: []
            }
          },
          order: 1
        }
      ],
      conditions: {
        statuses: ['visitor-scheduled']
      },
      errorHandling: {
        retryCount: 3,
        retryInterval: 30,
        fallbackAction: 'notify',
        notifyOnError: ['admin@example.com']
      },
      isActive: true,
      priority: 1,
      executionCount: 45,
      successCount: 43,
      failureCount: 2,
      lastExecutedAt: '2024-01-20T09:00:00',
      metadata: {
        createdAt: '2024-01-01',
        createdBy: 'system',
        updatedAt: '2024-01-01',
        updatedBy: 'system'
      }
    },
    {
      id: '2',
      ruleCode: 'application-acknowledge',
      ruleName: '応募受付通知',
      description: '新規応募があった際に自動で受付メールを送信',
      ruleType: 'status_change',
      trigger: {
        type: 'immediate',
        event: {
          type: 'status_changed',
          conditions: [
            {
              field: 'status',
              operator: 'equals',
              value: 'applicant-new'
            }
          ]
        }
      },
      actions: [
        {
          type: 'send_email',
          config: {
            email: {
              enabled: true,
              recipients: ['applicant'],
              subject: '【自動返信】ご応募ありがとうございます',
              bodyTemplate: 'この度は、{position}へのご応募ありがとうございます。書類選考の結果は1週間以内にご連絡いたします。',
              attachments: []
            }
          },
          order: 1
        },
        {
          type: 'assign_task',
          config: {
            task: {
              title: '書類選考タスク',
              description: '新規応募者の書類選考を行ってください',
              assignTo: 'hr-team',
              dueInDays: 3,
              priority: 'high'
            }
          },
          order: 2
        }
      ],
      conditions: {},
      errorHandling: {
        retryCount: 3,
        retryInterval: 10,
        fallbackAction: 'notify',
        notifyOnError: ['hr@example.com']
      },
      isActive: true,
      priority: 2,
      executionCount: 120,
      successCount: 118,
      failureCount: 2,
      metadata: {
        createdAt: '2024-01-01',
        createdBy: 'system',
        updatedAt: '2024-01-01',
        updatedBy: 'system'
      }
    }
  ])

  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('list')

  const ruleTypeIcons = {
    status_change: <Zap className="h-4 w-4" />,
    time_based: <Clock className="h-4 w-4" />,
    data_based: <Filter className="h-4 w-4" />,
    webhook: <Webhook className="h-4 w-4" />
  }

  const actionTypeIcons = {
    send_email: <Mail className="h-4 w-4" />,
    update_status: <RefreshCw className="h-4 w-4" />,
    assign_task: <CheckCircle className="h-4 w-4" />,
    create_reminder: <Bell className="h-4 w-4" />,
    update_field: <Edit2 className="h-4 w-4" />,
    call_webhook: <Webhook className="h-4 w-4" />,
    generate_document: <FileText className="h-4 w-4" />
  }

  const RuleEditDialog = () => {
    const [formData, setFormData] = useState<Partial<AutomationRule>>(
      editingRule || {
        ruleCode: '',
        ruleName: '',
        description: '',
        ruleType: 'status_change',
        trigger: {
          type: 'immediate',
          event: {
            type: 'status_changed',
            conditions: []
          }
        },
        actions: [],
        conditions: {},
        errorHandling: {
          retryCount: 3,
          retryInterval: 30,
          fallbackAction: 'notify',
          notifyOnError: []
        },
        isActive: true,
        priority: 1,
        executionCount: 0,
        successCount: 0,
        failureCount: 0
      }
    )

    const [selectedAction, setSelectedAction] = useState('')

    const addAction = () => {
      if (!selectedAction) return

      const newAction = {
        type: selectedAction as any,
        config: {
          email: selectedAction === 'send_email' ? {
            enabled: true,
            recipients: [],
            subject: '',
            bodyTemplate: '',
            attachments: []
          } : undefined,
          statusUpdate: selectedAction === 'update_status' ? {
            targetStatus: '',
            updateMessage: ''
          } : undefined,
          task: selectedAction === 'assign_task' ? {
            title: '',
            description: '',
            assignTo: '',
            dueInDays: 3,
            priority: 'medium' as const
          } : undefined
        },
        order: (formData.actions?.length || 0) + 1
      }

      setFormData({
        ...formData,
        actions: [...(formData.actions || []), newAction]
      })
      setSelectedAction('')
    }

    return (
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingRule ? 'ルール編集' : '新規ルール作成'}
          </DialogTitle>
          <DialogDescription>
            自動化ルールを設定します
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">基本設定</TabsTrigger>
            <TabsTrigger value="trigger">トリガー</TabsTrigger>
            <TabsTrigger value="actions">アクション</TabsTrigger>
            <TabsTrigger value="conditions">条件</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ruleCode">ルールコード*</Label>
                <Input
                  id="ruleCode"
                  value={formData.ruleCode}
                  onChange={(e) => setFormData({ ...formData, ruleCode: e.target.value })}
                  placeholder="例: visitor-reminder"
                />
              </div>
              <div>
                <Label htmlFor="ruleName">ルール名*</Label>
                <Input
                  id="ruleName"
                  value={formData.ruleName}
                  onChange={(e) => setFormData({ ...formData, ruleName: e.target.value })}
                  placeholder="例: 見学リマインダー"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">説明</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="このルールの説明を入力"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="ruleType">ルールタイプ*</Label>
              <Select
                value={formData.ruleType}
                onValueChange={(value: any) => setFormData({
                  ...formData,
                  ruleType: value,
                  trigger: {
                    type: value === 'time_based' ? 'scheduled' : 'immediate',
                    event: value === 'status_change' ? {
                      type: 'status_changed',
                      conditions: []
                    } : undefined,
                    schedule: value === 'time_based' ? {
                      frequency: 'daily',
                      time: '09:00',
                      timezone: 'Asia/Tokyo'
                    } : undefined
                  }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="status_change">ステータス変更</SelectItem>
                  <SelectItem value="time_based">時間ベース</SelectItem>
                  <SelectItem value="data_based">データベース</SelectItem>
                  <SelectItem value="webhook">Webhook</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">優先度</Label>
                <Input
                  id="priority"
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  min={1}
                  max={10}
                />
              </div>
              <div className="flex items-end">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">有効化</Label>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trigger" className="space-y-4 mt-4">
            {formData.ruleType === 'status_change' && (
              <div className="space-y-4">
                <div>
                  <Label>イベントタイプ</Label>
                  <Select
                    value={formData.trigger?.event?.type}
                    onValueChange={(value) => setFormData({
                      ...formData,
                      trigger: {
                        ...formData.trigger!,
                        event: {
                          ...formData.trigger?.event!,
                          type: value
                        }
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="status_changed">ステータス変更時</SelectItem>
                      <SelectItem value="form_submitted">フォーム送信時</SelectItem>
                      <SelectItem value="interview_scheduled">面接予定時</SelectItem>
                      <SelectItem value="document_uploaded">書類アップロード時</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>条件</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex gap-2">
                      <Select defaultValue="status">
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="status">ステータス</SelectItem>
                          <SelectItem value="facility">施設</SelectItem>
                          <SelectItem value="position">職種</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="equals">
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equals">等しい</SelectItem>
                          <SelectItem value="not_equals">等しくない</SelectItem>
                          <SelectItem value="contains">含む</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input placeholder="値" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {formData.ruleType === 'time_based' && (
              <div className="space-y-4">
                <div>
                  <Label>実行頻度</Label>
                  <Select
                    value={formData.trigger?.schedule?.frequency}
                    onValueChange={(value: any) => setFormData({
                      ...formData,
                      trigger: {
                        ...formData.trigger!,
                        schedule: {
                          ...formData.trigger?.schedule!,
                          frequency: value
                        }
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">一度のみ</SelectItem>
                      <SelectItem value="daily">毎日</SelectItem>
                      <SelectItem value="weekly">毎週</SelectItem>
                      <SelectItem value="monthly">毎月</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>実行時刻</Label>
                  <Input
                    type="time"
                    value={formData.trigger?.schedule?.time}
                    onChange={(e) => setFormData({
                      ...formData,
                      trigger: {
                        ...formData.trigger!,
                        schedule: {
                          ...formData.trigger?.schedule!,
                          time: e.target.value
                        }
                      }
                    })}
                  />
                </div>

                {formData.trigger?.schedule?.frequency === 'weekly' && (
                  <div>
                    <Label>曜日</Label>
                    <div className="flex gap-2 mt-2">
                      {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
                        <label key={index} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.trigger?.schedule?.dayOfWeek?.includes(index)}
                            onChange={(e) => {
                              const days = formData.trigger?.schedule?.dayOfWeek || []
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  trigger: {
                                    ...formData.trigger!,
                                    schedule: {
                                      ...formData.trigger?.schedule!,
                                      dayOfWeek: [...days, index]
                                    }
                                  }
                                })
                              } else {
                                setFormData({
                                  ...formData,
                                  trigger: {
                                    ...formData.trigger!,
                                    schedule: {
                                      ...formData.trigger?.schedule!,
                                      dayOfWeek: days.filter(d => d !== index)
                                    }
                                  }
                                })
                              }
                            }}
                            className="mr-1"
                          />
                          <span className="text-sm">{day}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="actions" className="space-y-4 mt-4">
            <div>
              <Label>アクションを追加</Label>
              <div className="flex gap-2 mt-2">
                <Select value={selectedAction} onValueChange={setSelectedAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="アクションタイプを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="send_email">メール送信</SelectItem>
                    <SelectItem value="update_status">ステータス更新</SelectItem>
                    <SelectItem value="assign_task">タスク割り当て</SelectItem>
                    <SelectItem value="create_reminder">リマインダー作成</SelectItem>
                    <SelectItem value="update_field">フィールド更新</SelectItem>
                    <SelectItem value="call_webhook">Webhook呼び出し</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={addAction} disabled={!selectedAction}>
                  <Plus className="h-4 w-4 mr-2" />
                  追加
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {formData.actions?.map((action, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {actionTypeIcons[action.type as keyof typeof actionTypeIcons]}
                        <span className="font-medium">
                          {action.type === 'send_email' ? 'メール送信' :
                           action.type === 'update_status' ? 'ステータス更新' :
                           action.type === 'assign_task' ? 'タスク割り当て' :
                           action.type === 'create_reminder' ? 'リマインダー作成' :
                           action.type === 'update_field' ? 'フィールド更新' :
                           action.type === 'call_webhook' ? 'Webhook呼び出し' : ''}
                        </span>
                        <Badge variant="secondary">順序: {action.order}</Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            actions: formData.actions?.filter((_, i) => i !== index)
                          })
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {action.type === 'send_email' && (
                      <div className="space-y-3">
                        <div>
                          <Label>宛先</Label>
                          <div className="flex gap-2 mt-1">
                            {['applicant', 'hr', 'manager'].map(recipient => (
                              <label key={recipient} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={action.config.email?.recipients.includes(recipient as any)}
                                  onChange={(e) => {
                                    const newActions = [...(formData.actions || [])]
                                    const recipients = newActions[index].config.email?.recipients || []
                                    if (e.target.checked) {
                                      newActions[index].config.email = {
                                        ...newActions[index].config.email!,
                                        recipients: [...recipients, recipient as any]
                                      }
                                    } else {
                                      newActions[index].config.email = {
                                        ...newActions[index].config.email!,
                                        recipients: recipients.filter(r => r !== recipient)
                                      }
                                    }
                                    setFormData({ ...formData, actions: newActions })
                                  }}
                                  className="mr-1"
                                />
                                <span className="text-sm">
                                  {recipient === 'applicant' ? '応募者' :
                                   recipient === 'hr' ? '人事部' : '管理者'}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label>件名</Label>
                          <Input
                            value={action.config.email?.subject}
                            onChange={(e) => {
                              const newActions = [...(formData.actions || [])]
                              newActions[index].config.email = {
                                ...newActions[index].config.email!,
                                subject: e.target.value
                              }
                              setFormData({ ...formData, actions: newActions })
                            }}
                            placeholder="メール件名"
                          />
                        </div>
                        <div>
                          <Label>本文テンプレート</Label>
                          <Textarea
                            value={action.config.email?.bodyTemplate}
                            onChange={(e) => {
                              const newActions = [...(formData.actions || [])]
                              newActions[index].config.email = {
                                ...newActions[index].config.email!,
                                bodyTemplate: e.target.value
                              }
                              setFormData({ ...formData, actions: newActions })
                            }}
                            placeholder="変数: {name}, {position}, {date}"
                            rows={3}
                          />
                        </div>
                      </div>
                    )}

                    {action.type === 'assign_task' && (
                      <div className="space-y-3">
                        <div>
                          <Label>タスクタイトル</Label>
                          <Input
                            value={action.config.task?.title}
                            onChange={(e) => {
                              const newActions = [...(formData.actions || [])]
                              newActions[index].config.task = {
                                ...newActions[index].config.task!,
                                title: e.target.value
                              }
                              setFormData({ ...formData, actions: newActions })
                            }}
                            placeholder="タスクのタイトル"
                          />
                        </div>
                        <div>
                          <Label>担当者</Label>
                          <Input
                            value={action.config.task?.assignTo}
                            onChange={(e) => {
                              const newActions = [...(formData.actions || [])]
                              newActions[index].config.task = {
                                ...newActions[index].config.task!,
                                assignTo: e.target.value
                              }
                              setFormData({ ...formData, actions: newActions })
                            }}
                            placeholder="担当者またはチーム"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>期限（日数）</Label>
                            <Input
                              type="number"
                              value={action.config.task?.dueInDays}
                              onChange={(e) => {
                                const newActions = [...(formData.actions || [])]
                                newActions[index].config.task = {
                                  ...newActions[index].config.task!,
                                  dueInDays: parseInt(e.target.value)
                                }
                                setFormData({ ...formData, actions: newActions })
                              }}
                              min={1}
                            />
                          </div>
                          <div>
                            <Label>優先度</Label>
                            <Select
                              value={action.config.task?.priority}
                              onValueChange={(value: any) => {
                                const newActions = [...(formData.actions || [])]
                                newActions[index].config.task = {
                                  ...newActions[index].config.task!,
                                  priority: value
                                }
                                setFormData({ ...formData, actions: newActions })
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">低</SelectItem>
                                <SelectItem value="medium">中</SelectItem>
                                <SelectItem value="high">高</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="conditions" className="space-y-4 mt-4">
            <div>
              <Label>適用施設</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {['小原病院', '立神リハビリテーション温泉病院', 'エスポワール立神', '宝寿庵'].map(facility => (
                  <label key={facility} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.conditions?.facilities?.includes(facility)}
                      onChange={(e) => {
                        const facilities = formData.conditions?.facilities || []
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            conditions: { ...formData.conditions, facilities: [...facilities, facility] }
                          })
                        } else {
                          setFormData({
                            ...formData,
                            conditions: {
                              ...formData.conditions,
                              facilities: facilities.filter(f => f !== facility)
                            }
                          })
                        }
                      }}
                      className="mr-1"
                    />
                    <span className="text-sm">{facility}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>エラーハンドリング</Label>
              <div className="space-y-3 mt-2 p-4 border rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>リトライ回数</Label>
                    <Input
                      type="number"
                      value={formData.errorHandling?.retryCount}
                      onChange={(e) => setFormData({
                        ...formData,
                        errorHandling: {
                          ...formData.errorHandling!,
                          retryCount: parseInt(e.target.value)
                        }
                      })}
                      min={0}
                      max={10}
                    />
                  </div>
                  <div>
                    <Label>リトライ間隔（分）</Label>
                    <Input
                      type="number"
                      value={formData.errorHandling?.retryInterval}
                      onChange={(e) => setFormData({
                        ...formData,
                        errorHandling: {
                          ...formData.errorHandling!,
                          retryInterval: parseInt(e.target.value)
                        }
                      })}
                      min={1}
                    />
                  </div>
                </div>
                <div>
                  <Label>エラー時のアクション</Label>
                  <Select
                    value={formData.errorHandling?.fallbackAction}
                    onValueChange={(value: any) => setFormData({
                      ...formData,
                      errorHandling: {
                        ...formData.errorHandling!,
                        fallbackAction: value
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="skip">スキップ</SelectItem>
                      <SelectItem value="notify">通知</SelectItem>
                      <SelectItem value="stop">停止</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>エラー通知先</Label>
                  <Input
                    value={formData.errorHandling?.notifyOnError?.join(', ')}
                    onChange={(e) => setFormData({
                      ...formData,
                      errorHandling: {
                        ...formData.errorHandling!,
                        notifyOnError: e.target.value.split(',').map(s => s.trim())
                      }
                    })}
                    placeholder="admin@example.com, hr@example.com"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            キャンセル
          </Button>
          <Button onClick={() => {
            if (editingRule) {
              setRules(prev => prev.map(r => r.id === formData.id ? formData as AutomationRule : r))
            } else {
              setRules(prev => [...prev, {
                ...formData,
                id: Date.now().toString(),
                metadata: {
                  createdAt: new Date().toISOString(),
                  createdBy: 'user',
                  updatedAt: new Date().toISOString(),
                  updatedBy: 'user'
                }
              } as AutomationRule])
            }
            setIsDialogOpen(false)
            setEditingRule(null)
          }}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    )
  }

  const RuleMetrics = () => {
    const totalExecutions = rules.reduce((sum, rule) => sum + rule.executionCount, 0)
    const totalSuccess = rules.reduce((sum, rule) => sum + rule.successCount, 0)
    const totalFailures = rules.reduce((sum, rule) => sum + rule.failureCount, 0)
    const successRate = totalExecutions > 0 ? (totalSuccess / totalExecutions * 100).toFixed(1) : 0

    return (
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">アクティブルール</p>
                <p className="text-2xl font-bold">{rules.filter(r => r.isActive).length}</p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">総実行回数</p>
                <p className="text-2xl font-bold">{totalExecutions}</p>
              </div>
              <Play className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">成功率</p>
                <p className="text-2xl font-bold">{successRate}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">エラー数</p>
                <p className="text-2xl font-bold">{totalFailures}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <RuleMetrics />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="list">ルール一覧</TabsTrigger>
            <TabsTrigger value="logs">実行ログ</TabsTrigger>
          </TabsList>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Button onClick={() => {
              setEditingRule(null)
              setIsDialogOpen(true)
            }}>
              <Plus className="h-4 w-4 mr-2" />
              新規ルール
            </Button>
            <RuleEditDialog />
          </Dialog>
        </div>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>自動化ルール</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ルール名</TableHead>
                    <TableHead>タイプ</TableHead>
                    <TableHead>トリガー</TableHead>
                    <TableHead>アクション数</TableHead>
                    <TableHead>実行回数</TableHead>
                    <TableHead>成功率</TableHead>
                    <TableHead>状態</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map(rule => (
                    <TableRow key={rule.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{rule.ruleName}</div>
                          <div className="text-xs text-gray-500">{rule.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {ruleTypeIcons[rule.ruleType as keyof typeof ruleTypeIcons]}
                          <span className="text-sm">
                            {rule.ruleType === 'status_change' ? 'ステータス' :
                             rule.ruleType === 'time_based' ? '時間' :
                             rule.ruleType === 'data_based' ? 'データ' : 'Webhook'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {rule.trigger.type === 'immediate' ? '即時' :
                         rule.trigger.type === 'scheduled' ? `${rule.trigger.schedule?.time}` :
                         '繰り返し'}
                      </TableCell>
                      <TableCell>{rule.actions.length}</TableCell>
                      <TableCell>{rule.executionCount}</TableCell>
                      <TableCell>
                        {rule.executionCount > 0
                          ? `${(rule.successCount / rule.executionCount * 100).toFixed(1)}%`
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                          {rule.isActive ? '有効' : '無効'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setRules(prev => prev.map(r =>
                                r.id === rule.id
                                  ? { ...r, isActive: !r.isActive }
                                  : r
                              ))
                            }}
                          >
                            {rule.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingRule(rule)
                              setIsDialogOpen(true)
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm('このルールを削除してもよろしいですか？')) {
                                setRules(prev => prev.filter(r => r.id !== rule.id))
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>実行ログ</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>実行日時</TableHead>
                    <TableHead>ルール名</TableHead>
                    <TableHead>トリガー</TableHead>
                    <TableHead>結果</TableHead>
                    <TableHead>実行時間</TableHead>
                    <TableHead>詳細</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2024-01-20 09:00:00</TableCell>
                    <TableCell>見学リマインダー</TableCell>
                    <TableCell>スケジュール</TableCell>
                    <TableCell>
                      <Badge variant="default">成功</Badge>
                    </TableCell>
                    <TableCell>1.2秒</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2024-01-20 08:45:00</TableCell>
                    <TableCell>応募受付通知</TableCell>
                    <TableCell>ステータス変更</TableCell>
                    <TableCell>
                      <Badge variant="default">成功</Badge>
                    </TableCell>
                    <TableCell>0.8秒</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}