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
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { RecruitmentStatusConfig } from '@/types/recruitmentMaster'
import {
  Plus, Edit2, Trash2, Save, X, GitBranch, Bell,
  ChevronRight, Settings, AlertCircle, Clock, Mail
} from 'lucide-react'

export default function StatusFlowConfig() {
  const [statuses, setStatuses] = useState<RecruitmentStatusConfig[]>([
    {
      id: '1',
      code: 'visitor-scheduled',
      name: '見学予定',
      category: 'visitor',
      description: '施設見学の予定が確定している状態',
      color: '#3B82F6',
      icon: 'Eye',
      order: 1,
      isActive: true,
      isDefault: false,
      canDelete: false,
      allowedTransitions: ['visitor-completed', 'visitor-cancelled'],
      notifications: {
        onEnter: {
          enabled: true,
          recipients: ['applicant', 'hr'],
          subject: '施設見学予約確認',
          bodyTemplate: '施設見学の予約が確定しました。',
          attachments: []
        },
        reminder: {
          enabled: true,
          daysBeforeDeadline: [3, 1],
          template: {
            enabled: true,
            recipients: ['applicant'],
            subject: '施設見学リマインダー',
            bodyTemplate: '施設見学日が近づいています。',
            attachments: []
          }
        }
      },
      metadata: {
        createdAt: '2024-01-01',
        createdBy: 'system',
        updatedAt: '2024-01-01',
        updatedBy: 'system'
      }
    },
    {
      id: '2',
      code: 'visitor-completed',
      name: '見学完了',
      category: 'visitor',
      description: '施設見学が完了した状態',
      color: '#10B981',
      icon: 'CheckCircle',
      order: 2,
      isActive: true,
      isDefault: false,
      canDelete: false,
      allowedTransitions: ['applicant-new', 'talent-pool'],
      autoTransition: {
        enabled: true,
        targetStatus: 'talent-pool',
        conditions: [],
        daysAfter: 30
      },
      metadata: {
        createdAt: '2024-01-01',
        createdBy: 'system',
        updatedAt: '2024-01-01',
        updatedBy: 'system'
      }
    },
    {
      id: '3',
      code: 'applicant-new',
      name: '新規応募',
      category: 'applicant',
      description: '応募を受け付けた状態',
      color: '#8B5CF6',
      icon: 'UserPlus',
      order: 3,
      isActive: true,
      isDefault: true,
      canDelete: false,
      allowedTransitions: ['applicant-screening', 'rejected'],
      metadata: {
        createdAt: '2024-01-01',
        createdBy: 'system',
        updatedAt: '2024-01-01',
        updatedBy: 'system'
      }
    },
    {
      id: '4',
      code: 'applicant-screening',
      name: '書類選考中',
      category: 'applicant',
      description: '応募書類を審査している状態',
      color: '#F59E0B',
      icon: 'FileSearch',
      order: 4,
      isActive: true,
      isDefault: false,
      canDelete: false,
      allowedTransitions: ['applicant-interview', 'rejected'],
      metadata: {
        createdAt: '2024-01-01',
        createdBy: 'system',
        updatedAt: '2024-01-01',
        updatedBy: 'system'
      }
    },
    {
      id: '5',
      code: 'applicant-interview',
      name: '面接中',
      category: 'applicant',
      description: '面接を実施している状態',
      color: '#06B6D4',
      icon: 'Users',
      order: 5,
      isActive: true,
      isDefault: false,
      canDelete: false,
      allowedTransitions: ['offer-pending', 'rejected', 'talent-pool'],
      metadata: {
        createdAt: '2024-01-01',
        createdBy: 'system',
        updatedAt: '2024-01-01',
        updatedBy: 'system'
      }
    }
  ])

  const [editingStatus, setEditingStatus] = useState<RecruitmentStatusConfig | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('list')

  const categoryColors = {
    visitor: 'bg-blue-100 text-blue-800',
    applicant: 'bg-purple-100 text-purple-800',
    offer: 'bg-green-100 text-green-800',
    employee: 'bg-emerald-100 text-emerald-800',
    inactive: 'bg-gray-100 text-gray-800'
  }

  const handleSaveStatus = (status: RecruitmentStatusConfig) => {
    if (editingStatus) {
      setStatuses(prev => prev.map(s => s.id === status.id ? status : s))
    } else {
      setStatuses(prev => [...prev, { ...status, id: Date.now().toString() }])
    }
    setIsDialogOpen(false)
    setEditingStatus(null)
  }

  const handleDeleteStatus = (id: string) => {
    const status = statuses.find(s => s.id === id)
    if (status?.canDelete === false) {
      alert('システム標準ステータスは削除できません')
      return
    }
    if (confirm('このステータスを削除してもよろしいですか？')) {
      setStatuses(prev => prev.filter(s => s.id !== id))
    }
  }

  const StatusEditDialog = () => {
    const [formData, setFormData] = useState<Partial<RecruitmentStatusConfig>>(
      editingStatus || {
        code: '',
        name: '',
        category: 'visitor',
        description: '',
        color: '#3B82F6',
        icon: 'Circle',
        order: statuses.length + 1,
        isActive: true,
        isDefault: false,
        canDelete: true,
        allowedTransitions: []
      }
    )

    return (
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingStatus ? 'ステータス編集' : '新規ステータス作成'}
          </DialogTitle>
          <DialogDescription>
            採用プロセスのステータスを設定します
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">基本設定</TabsTrigger>
            <TabsTrigger value="transition">遷移設定</TabsTrigger>
            <TabsTrigger value="notification">通知設定</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">ステータスコード*</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="例: visitor-scheduled"
                  disabled={!editingStatus?.canDelete && editingStatus}
                />
              </div>
              <div>
                <Label htmlFor="name">ステータス名*</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例: 見学予定"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">カテゴリー*</Label>
              <Select
                value={formData.category}
                onValueChange={(value: any) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visitor">見学者</SelectItem>
                  <SelectItem value="applicant">応募者</SelectItem>
                  <SelectItem value="offer">内定者</SelectItem>
                  <SelectItem value="employee">入職者</SelectItem>
                  <SelectItem value="inactive">非アクティブ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">説明</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="このステータスの説明を入力"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="color">カラー</Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-20"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="#3B82F6"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="icon">アイコン</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="例: Eye"
                />
              </div>
              <div>
                <Label htmlFor="order">表示順</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  min={1}
                />
              </div>
            </div>

            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">有効化</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
                />
                <Label htmlFor="isDefault">デフォルトステータス</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transition" className="space-y-4 mt-4">
            <div>
              <Label>遷移可能なステータス</Label>
              <div className="mt-2 space-y-2">
                {statuses
                  .filter(s => s.id !== formData.id)
                  .map(status => (
                    <div key={status.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`transition-${status.id}`}
                        checked={formData.allowedTransitions?.includes(status.code)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              allowedTransitions: [...(formData.allowedTransitions || []), status.code]
                            })
                          } else {
                            setFormData({
                              ...formData,
                              allowedTransitions: formData.allowedTransitions?.filter(t => t !== status.code)
                            })
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={`transition-${status.id}`} className="font-normal">
                        <Badge className={categoryColors[status.category as keyof typeof categoryColors]}>
                          {status.name}
                        </Badge>
                      </Label>
                    </div>
                  ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center space-x-2 mb-4">
                <Switch
                  id="autoTransition"
                  checked={formData.autoTransition?.enabled}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    autoTransition: {
                      ...formData.autoTransition,
                      enabled: checked,
                      targetStatus: formData.autoTransition?.targetStatus || '',
                      conditions: [],
                      daysAfter: formData.autoTransition?.daysAfter || 30
                    }
                  })}
                />
                <Label htmlFor="autoTransition">自動遷移を有効化</Label>
              </div>

              {formData.autoTransition?.enabled && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>遷移先ステータス</Label>
                      <Select
                        value={formData.autoTransition.targetStatus}
                        onValueChange={(value) => setFormData({
                          ...formData,
                          autoTransition: {
                            ...formData.autoTransition!,
                            targetStatus: value
                          }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="ステータスを選択" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.allowedTransitions?.map(code => {
                            const status = statuses.find(s => s.code === code)
                            return status ? (
                              <SelectItem key={code} value={code}>
                                {status.name}
                              </SelectItem>
                            ) : null
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>経過日数</Label>
                      <Input
                        type="number"
                        value={formData.autoTransition.daysAfter}
                        onChange={(e) => setFormData({
                          ...formData,
                          autoTransition: {
                            ...formData.autoTransition!,
                            daysAfter: parseInt(e.target.value)
                          }
                        })}
                        min={1}
                        placeholder="30"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notification" className="space-y-4 mt-4">
            <div>
              <h3 className="text-sm font-medium mb-3">ステータス変更時の通知</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="onEnterEnabled"
                    checked={formData.notifications?.onEnter?.enabled}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      notifications: {
                        ...formData.notifications,
                        onEnter: {
                          ...formData.notifications?.onEnter,
                          enabled: checked,
                          recipients: formData.notifications?.onEnter?.recipients || ['hr'],
                          subject: formData.notifications?.onEnter?.subject || '',
                          bodyTemplate: formData.notifications?.onEnter?.bodyTemplate || '',
                          attachments: []
                        }
                      }
                    })}
                  />
                  <Label htmlFor="onEnterEnabled">ステータス開始時に通知</Label>
                </div>

                {formData.notifications?.onEnter?.enabled && (
                  <div className="ml-8 space-y-3 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label>通知先</Label>
                      <div className="mt-2 space-x-4">
                        {['applicant', 'hr', 'manager'].map(recipient => (
                          <label key={recipient} className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.notifications?.onEnter?.recipients.includes(recipient as any)}
                              onChange={(e) => {
                                const recipients = formData.notifications?.onEnter?.recipients || []
                                if (e.target.checked) {
                                  setFormData({
                                    ...formData,
                                    notifications: {
                                      ...formData.notifications,
                                      onEnter: {
                                        ...formData.notifications?.onEnter!,
                                        recipients: [...recipients, recipient as any]
                                      }
                                    }
                                  })
                                } else {
                                  setFormData({
                                    ...formData,
                                    notifications: {
                                      ...formData.notifications,
                                      onEnter: {
                                        ...formData.notifications?.onEnter!,
                                        recipients: recipients.filter(r => r !== recipient)
                                      }
                                    }
                                  })
                                }
                              }}
                              className="rounded border-gray-300 mr-2"
                            />
                            <span className="text-sm">
                              {recipient === 'applicant' ? '応募者' : recipient === 'hr' ? '人事部' : '管理者'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>件名</Label>
                      <Input
                        value={formData.notifications?.onEnter?.subject}
                        onChange={(e) => setFormData({
                          ...formData,
                          notifications: {
                            ...formData.notifications,
                            onEnter: {
                              ...formData.notifications?.onEnter!,
                              subject: e.target.value
                            }
                          }
                        })}
                        placeholder="メール件名"
                      />
                    </div>
                    <div>
                      <Label>本文テンプレート</Label>
                      <Textarea
                        value={formData.notifications?.onEnter?.bodyTemplate}
                        onChange={(e) => setFormData({
                          ...formData,
                          notifications: {
                            ...formData.notifications,
                            onEnter: {
                              ...formData.notifications?.onEnter!,
                              bodyTemplate: e.target.value
                            }
                          }
                        })}
                        placeholder="変数: {name}, {position}, {status}, {date}"
                        rows={4}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-3">リマインダー設定</h3>
              <div className="flex items-center space-x-2">
                <Switch
                  id="reminderEnabled"
                  checked={formData.notifications?.reminder?.enabled}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    notifications: {
                      ...formData.notifications,
                      reminder: {
                        enabled: checked,
                        daysBeforeDeadline: formData.notifications?.reminder?.daysBeforeDeadline || [3, 1],
                        template: {
                          enabled: true,
                          recipients: ['applicant'],
                          subject: '',
                          bodyTemplate: '',
                          attachments: []
                        }
                      }
                    }
                  })}
                />
                <Label htmlFor="reminderEnabled">リマインダーを有効化</Label>
              </div>

              {formData.notifications?.reminder?.enabled && (
                <div className="mt-4 ml-8 space-y-3 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label>リマインダー送信日（期限前の日数）</Label>
                    <div className="flex gap-2 mt-2">
                      {formData.notifications?.reminder?.daysBeforeDeadline?.map((day, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <Input
                            type="number"
                            value={day}
                            onChange={(e) => {
                              const days = [...(formData.notifications?.reminder?.daysBeforeDeadline || [])]
                              days[index] = parseInt(e.target.value)
                              setFormData({
                                ...formData,
                                notifications: {
                                  ...formData.notifications,
                                  reminder: {
                                    ...formData.notifications?.reminder!,
                                    daysBeforeDeadline: days
                                  }
                                }
                              })
                            }}
                            className="w-20"
                            min={1}
                          />
                          <span className="text-sm">日前</span>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            notifications: {
                              ...formData.notifications,
                              reminder: {
                                ...formData.notifications?.reminder!,
                                daysBeforeDeadline: [
                                  ...(formData.notifications?.reminder?.daysBeforeDeadline || []),
                                  1
                                ]
                              }
                            }
                          })
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            キャンセル
          </Button>
          <Button onClick={() => handleSaveStatus(formData as RecruitmentStatusConfig)}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    )
  }

  const FlowVisualization = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            ステータスフロー図
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {['visitor', 'applicant', 'offer'].map(category => {
              const categoryStatuses = statuses
                .filter(s => s.category === category && s.isActive)
                .sort((a, b) => a.order - b.order)

              if (categoryStatuses.length === 0) return null

              return (
                <div key={category}>
                  <h3 className="text-sm font-medium text-gray-600 mb-4">
                    {category === 'visitor' ? '見学者' : category === 'applicant' ? '応募者' : '内定者'}
                  </h3>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {categoryStatuses.map((status, index) => (
                      <React.Fragment key={status.id}>
                        <div className="flex flex-col items-center min-w-[120px]">
                          <div
                            className="w-full p-3 rounded-lg border-2 text-center"
                            style={{
                              borderColor: status.color,
                              backgroundColor: `${status.color}20`
                            }}
                          >
                            <div className="text-xs font-medium" style={{ color: status.color }}>
                              {status.name}
                            </div>
                          </div>
                          {status.allowedTransitions.length > 0 && (
                            <div className="mt-2 text-xs text-gray-500">
                              → {status.allowedTransitions.length}個の遷移先
                            </div>
                          )}
                        </div>
                        {index < categoryStatuses.length - 1 && (
                          <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="list">ステータス一覧</TabsTrigger>
            <TabsTrigger value="flow">フロー図</TabsTrigger>
          </TabsList>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingStatus(null)}>
                <Plus className="h-4 w-4 mr-2" />
                新規ステータス
              </Button>
            </DialogTrigger>
            <StatusEditDialog />
          </Dialog>
        </div>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>ステータス設定</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">順序</TableHead>
                    <TableHead>コード</TableHead>
                    <TableHead>名称</TableHead>
                    <TableHead>カテゴリー</TableHead>
                    <TableHead>遷移可能数</TableHead>
                    <TableHead>通知</TableHead>
                    <TableHead>状態</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statuses.sort((a, b) => a.order - b.order).map(status => (
                    <TableRow key={status.id}>
                      <TableCell className="font-medium">{status.order}</TableCell>
                      <TableCell className="font-mono text-sm">{status.code}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: status.color }}
                          />
                          {status.name}
                          {status.isDefault && (
                            <Badge variant="secondary" className="text-xs">
                              デフォルト
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={categoryColors[status.category as keyof typeof categoryColors]}>
                          {status.category === 'visitor' ? '見学者' :
                           status.category === 'applicant' ? '応募者' :
                           status.category === 'offer' ? '内定者' :
                           status.category === 'employee' ? '入職者' : '非アクティブ'}
                        </Badge>
                      </TableCell>
                      <TableCell>{status.allowedTransitions.length}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {status.notifications?.onEnter?.enabled && (
                            <Mail className="h-4 w-4 text-blue-500" />
                          )}
                          {status.notifications?.reminder?.enabled && (
                            <Clock className="h-4 w-4 text-orange-500" />
                          )}
                          {status.autoTransition?.enabled && (
                            <Settings className="h-4 w-4 text-purple-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.isActive ? 'default' : 'secondary'}>
                          {status.isActive ? '有効' : '無効'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingStatus(status)
                              setIsDialogOpen(true)
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteStatus(status.id)}
                            disabled={!status.canDelete}
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

        <TabsContent value="flow">
          <FlowVisualization />
        </TabsContent>
      </Tabs>
    </div>
  )
}