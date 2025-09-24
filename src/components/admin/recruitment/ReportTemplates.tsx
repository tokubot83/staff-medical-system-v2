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
import { ReportTemplate } from '@/types/recruitmentMaster'
import {
  Plus, Edit2, Trash2, Download, Eye, Send, Calendar,
  BarChart3, PieChart, LineChart, Table as TableIcon,
  FileText, Settings, Clock, Mail, Lock, Unlock
} from 'lucide-react'

export default function ReportTemplates() {
  const [templates, setTemplates] = useState<ReportTemplate[]>([
    {
      id: '1',
      templateCode: 'pipeline-monthly',
      templateName: '月次パイプラインレポート',
      category: 'pipeline',
      description: '採用パイプラインの月次分析レポート',
      dataSource: {
        entities: ['talent', 'visitor', 'applicant'],
        dateRange: {
          type: 'relative',
          relativePeriod: 'last_month'
        },
        filters: []
      },
      components: [
        {
          id: 'c1',
          type: 'metric',
          title: '新規応募者数',
          order: 1,
          metric: {
            field: 'applicants',
            aggregation: 'count',
            format: '#,##0',
            comparison: {
              enabled: true,
              period: 'previous',
              showPercentage: true
            },
            trend: {
              enabled: true,
              period: 30
            }
          },
          width: 'quarter'
        },
        {
          id: 'c2',
          type: 'chart',
          title: 'ステージ別人数',
          order: 2,
          chart: {
            chartType: 'bar',
            xAxis: 'stage',
            yAxis: 'count',
            showLegend: true,
            showDataLabels: true
          },
          width: 'half'
        },
        {
          id: 'c3',
          type: 'table',
          title: '応募者リスト',
          order: 3,
          table: {
            columns: [
              { field: 'name', header: '氏名', sortable: true },
              { field: 'position', header: '応募職種', sortable: true },
              { field: 'status', header: 'ステータス', sortable: true },
              { field: 'appliedDate', header: '応募日', sortable: true, format: 'yyyy-MM-dd' }
            ],
            pagination: true,
            pageSize: 10,
            exportable: true
          },
          width: 'full'
        }
      ],
      schedule: {
        enabled: true,
        frequency: 'monthly',
        time: '09:00',
        dayOfMonth: [1],
        recipients: ['hr@example.com', 'manager@example.com'],
        format: 'pdf'
      },
      export: {
        formats: ['pdf', 'excel'],
        includeCharts: true,
        includeRawData: false
      },
      permissions: {
        viewRoles: ['admin', 'hr', 'manager'],
        editRoles: ['admin'],
        exportRoles: ['admin', 'hr']
      },
      isActive: true,
      isPublic: false,
      metadata: {
        createdAt: '2024-01-01',
        createdBy: 'system',
        updatedAt: '2024-01-15',
        updatedBy: 'admin',
        lastGeneratedAt: '2024-01-20'
      }
    },
    {
      id: '2',
      templateCode: 'source-effectiveness',
      templateName: '採用ソース効果分析',
      category: 'source',
      description: '採用ソース別の効果を分析するレポート',
      dataSource: {
        entities: ['talent'],
        dateRange: {
          type: 'relative',
          relativePeriod: 'last_quarter'
        }
      },
      components: [
        {
          id: 'c1',
          type: 'chart',
          title: 'ソース別応募者数',
          order: 1,
          chart: {
            chartType: 'pie',
            xAxis: 'source',
            yAxis: 'count',
            showLegend: true,
            showDataLabels: true
          },
          width: 'half'
        },
        {
          id: 'c2',
          type: 'chart',
          title: 'ソース別採用率',
          order: 2,
          chart: {
            chartType: 'bar',
            xAxis: 'source',
            yAxis: 'conversionRate',
            showLegend: false,
            showDataLabels: true
          },
          width: 'half'
        }
      ],
      export: {
        formats: ['pdf', 'excel'],
        includeCharts: true,
        includeRawData: true
      },
      permissions: {
        viewRoles: ['admin', 'hr'],
        editRoles: ['admin'],
        exportRoles: ['admin', 'hr']
      },
      isActive: true,
      isPublic: false,
      metadata: {
        createdAt: '2024-01-05',
        createdBy: 'admin',
        updatedAt: '2024-01-05',
        updatedBy: 'admin'
      }
    }
  ])

  const [editingTemplate, setEditingTemplate] = useState<ReportTemplate | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('list')
  const [previewTemplate, setPreviewTemplate] = useState<ReportTemplate | null>(null)

  const componentTypeIcons = {
    chart: <BarChart3 className="h-4 w-4" />,
    table: <TableIcon className="h-4 w-4" />,
    metric: <PieChart className="h-4 w-4" />,
    text: <FileText className="h-4 w-4" />
  }

  const TemplateEditDialog = () => {
    const [formData, setFormData] = useState<Partial<ReportTemplate>>(
      editingTemplate || {
        templateCode: '',
        templateName: '',
        category: 'pipeline',
        description: '',
        dataSource: {
          entities: ['talent'],
          dateRange: {
            type: 'relative',
            relativePeriod: 'last_month'
          }
        },
        components: [],
        export: {
          formats: ['pdf'],
          includeCharts: true,
          includeRawData: false
        },
        permissions: {
          viewRoles: ['admin', 'hr'],
          editRoles: ['admin'],
          exportRoles: ['admin', 'hr']
        },
        isActive: true,
        isPublic: false
      }
    )

    const [selectedComponentType, setSelectedComponentType] = useState('')

    const addComponent = () => {
      if (!selectedComponentType) return

      const newComponent = {
        id: `c${Date.now()}`,
        type: selectedComponentType as any,
        title: '',
        order: (formData.components?.length || 0) + 1,
        width: 'full' as const,
        ...(selectedComponentType === 'chart' && {
          chart: {
            chartType: 'bar' as const,
            xAxis: '',
            yAxis: '',
            showLegend: true,
            showDataLabels: true
          }
        }),
        ...(selectedComponentType === 'table' && {
          table: {
            columns: [],
            pagination: true,
            pageSize: 10,
            exportable: true
          }
        }),
        ...(selectedComponentType === 'metric' && {
          metric: {
            field: '',
            aggregation: 'count' as const,
            format: '#,##0'
          }
        })
      }

      setFormData({
        ...formData,
        components: [...(formData.components || []), newComponent]
      })
      setSelectedComponentType('')
    }

    return (
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingTemplate ? 'レポートテンプレート編集' : '新規レポートテンプレート'}
          </DialogTitle>
          <DialogDescription>
            カスタムレポートのテンプレートを設定します
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="mt-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">基本設定</TabsTrigger>
            <TabsTrigger value="data">データソース</TabsTrigger>
            <TabsTrigger value="components">コンポーネント</TabsTrigger>
            <TabsTrigger value="schedule">スケジュール</TabsTrigger>
            <TabsTrigger value="permissions">権限</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="templateCode">テンプレートコード*</Label>
                <Input
                  id="templateCode"
                  value={formData.templateCode}
                  onChange={(e) => setFormData({ ...formData, templateCode: e.target.value })}
                  placeholder="例: monthly-pipeline"
                />
              </div>
              <div>
                <Label htmlFor="templateName">テンプレート名*</Label>
                <Input
                  id="templateName"
                  value={formData.templateName}
                  onChange={(e) => setFormData({ ...formData, templateName: e.target.value })}
                  placeholder="例: 月次パイプラインレポート"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">カテゴリー</Label>
              <Select
                value={formData.category}
                onValueChange={(value: any) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pipeline">パイプライン</SelectItem>
                  <SelectItem value="performance">パフォーマンス</SelectItem>
                  <SelectItem value="source">ソース分析</SelectItem>
                  <SelectItem value="facility">施設別</SelectItem>
                  <SelectItem value="custom">カスタム</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">説明</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="レポートの説明を入力"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
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
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                />
                <Label htmlFor="isPublic">公開レポート</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-4 mt-4">
            <div>
              <Label>データエンティティ</Label>
              <div className="flex gap-3 mt-2">
                {['talent', 'visitor', 'applicant', 'employee'].map(entity => (
                  <label key={entity} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.dataSource?.entities.includes(entity as any)}
                      onChange={(e) => {
                        const entities = formData.dataSource?.entities || []
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            dataSource: {
                              ...formData.dataSource!,
                              entities: [...entities, entity as any]
                            }
                          })
                        } else {
                          setFormData({
                            ...formData,
                            dataSource: {
                              ...formData.dataSource!,
                              entities: entities.filter(e => e !== entity)
                            }
                          })
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">
                      {entity === 'talent' ? '人材' :
                       entity === 'visitor' ? '見学者' :
                       entity === 'applicant' ? '応募者' : '従業員'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>期間設定</Label>
              <div className="space-y-3 mt-2">
                <Select
                  value={formData.dataSource?.dateRange.type}
                  onValueChange={(value: any) => setFormData({
                    ...formData,
                    dataSource: {
                      ...formData.dataSource!,
                      dateRange: {
                        ...formData.dataSource?.dateRange!,
                        type: value
                      }
                    }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">固定期間</SelectItem>
                    <SelectItem value="relative">相対期間</SelectItem>
                  </SelectContent>
                </Select>

                {formData.dataSource?.dateRange.type === 'relative' && (
                  <Select
                    value={formData.dataSource?.dateRange.relativePeriod}
                    onValueChange={(value: any) => setFormData({
                      ...formData,
                      dataSource: {
                        ...formData.dataSource!,
                        dateRange: {
                          ...formData.dataSource?.dateRange!,
                          relativePeriod: value
                        }
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last_week">過去1週間</SelectItem>
                      <SelectItem value="last_month">過去1ヶ月</SelectItem>
                      <SelectItem value="last_quarter">過去3ヶ月</SelectItem>
                      <SelectItem value="last_year">過去1年</SelectItem>
                      <SelectItem value="custom">カスタム</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                {formData.dataSource?.dateRange.type === 'fixed' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>開始日</Label>
                      <Input
                        type="date"
                        value={formData.dataSource?.dateRange.fixedStart}
                        onChange={(e) => setFormData({
                          ...formData,
                          dataSource: {
                            ...formData.dataSource!,
                            dateRange: {
                              ...formData.dataSource?.dateRange!,
                              fixedStart: e.target.value
                            }
                          }
                        })}
                      />
                    </div>
                    <div>
                      <Label>終了日</Label>
                      <Input
                        type="date"
                        value={formData.dataSource?.dateRange.fixedEnd}
                        onChange={(e) => setFormData({
                          ...formData,
                          dataSource: {
                            ...formData.dataSource!,
                            dateRange: {
                              ...formData.dataSource?.dateRange!,
                              fixedEnd: e.target.value
                            }
                          }
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="components" className="space-y-4 mt-4">
            <div>
              <Label>コンポーネントを追加</Label>
              <div className="flex gap-2 mt-2">
                <Select value={selectedComponentType} onValueChange={setSelectedComponentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="コンポーネントタイプを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chart">チャート</SelectItem>
                    <SelectItem value="table">テーブル</SelectItem>
                    <SelectItem value="metric">メトリクス</SelectItem>
                    <SelectItem value="text">テキスト</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={addComponent} disabled={!selectedComponentType}>
                  <Plus className="h-4 w-4 mr-2" />
                  追加
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {formData.components?.map((component, index) => (
                <Card key={component.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {componentTypeIcons[component.type as keyof typeof componentTypeIcons]}
                        <Input
                          value={component.title}
                          onChange={(e) => {
                            const newComponents = [...(formData.components || [])]
                            newComponents[index] = { ...component, title: e.target.value }
                            setFormData({ ...formData, components: newComponents })
                          }}
                          placeholder="コンポーネントタイトル"
                          className="w-64"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={component.width}
                          onValueChange={(value: any) => {
                            const newComponents = [...(formData.components || [])]
                            newComponents[index] = { ...component, width: value }
                            setFormData({ ...formData, components: newComponents })
                          }}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full">全幅</SelectItem>
                            <SelectItem value="half">半分</SelectItem>
                            <SelectItem value="third">1/3</SelectItem>
                            <SelectItem value="quarter">1/4</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              components: formData.components?.filter((_, i) => i !== index)
                            })
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {component.type === 'chart' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>チャートタイプ</Label>
                          <Select
                            value={component.chart?.chartType}
                            onValueChange={(value: any) => {
                              const newComponents = [...(formData.components || [])]
                              newComponents[index] = {
                                ...component,
                                chart: { ...component.chart!, chartType: value }
                              }
                              setFormData({ ...formData, components: newComponents })
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bar">棒グラフ</SelectItem>
                              <SelectItem value="line">折れ線グラフ</SelectItem>
                              <SelectItem value="pie">円グラフ</SelectItem>
                              <SelectItem value="donut">ドーナツグラフ</SelectItem>
                              <SelectItem value="area">面グラフ</SelectItem>
                              <SelectItem value="scatter">散布図</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-end gap-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`legend-${index}`}
                              checked={component.chart?.showLegend}
                              onChange={(e) => {
                                const newComponents = [...(formData.components || [])]
                                newComponents[index] = {
                                  ...component,
                                  chart: { ...component.chart!, showLegend: e.target.checked }
                                }
                                setFormData({ ...formData, components: newComponents })
                              }}
                            />
                            <Label htmlFor={`legend-${index}`}>凡例</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`labels-${index}`}
                              checked={component.chart?.showDataLabels}
                              onChange={(e) => {
                                const newComponents = [...(formData.components || [])]
                                newComponents[index] = {
                                  ...component,
                                  chart: { ...component.chart!, showDataLabels: e.target.checked }
                                }
                                setFormData({ ...formData, components: newComponents })
                              }}
                            />
                            <Label htmlFor={`labels-${index}`}>ラベル</Label>
                          </div>
                        </div>
                      </div>
                    )}

                    {component.type === 'metric' && (
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label>フィールド</Label>
                          <Input
                            value={component.metric?.field}
                            onChange={(e) => {
                              const newComponents = [...(formData.components || [])]
                              newComponents[index] = {
                                ...component,
                                metric: { ...component.metric!, field: e.target.value }
                              }
                              setFormData({ ...formData, components: newComponents })
                            }}
                            placeholder="フィールド名"
                          />
                        </div>
                        <div>
                          <Label>集計方法</Label>
                          <Select
                            value={component.metric?.aggregation}
                            onValueChange={(value: any) => {
                              const newComponents = [...(formData.components || [])]
                              newComponents[index] = {
                                ...component,
                                metric: { ...component.metric!, aggregation: value }
                              }
                              setFormData({ ...formData, components: newComponents })
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sum">合計</SelectItem>
                              <SelectItem value="avg">平均</SelectItem>
                              <SelectItem value="count">件数</SelectItem>
                              <SelectItem value="min">最小</SelectItem>
                              <SelectItem value="max">最大</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>フォーマット</Label>
                          <Input
                            value={component.metric?.format}
                            onChange={(e) => {
                              const newComponents = [...(formData.components || [])]
                              newComponents[index] = {
                                ...component,
                                metric: { ...component.metric!, format: e.target.value }
                              }
                              setFormData({ ...formData, components: newComponents })
                            }}
                            placeholder="#,##0"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4 mt-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="scheduleEnabled"
                checked={formData.schedule?.enabled}
                onCheckedChange={(checked) => setFormData({
                  ...formData,
                  schedule: {
                    ...formData.schedule!,
                    enabled: checked,
                    frequency: formData.schedule?.frequency || 'monthly',
                    time: formData.schedule?.time || '09:00',
                    recipients: formData.schedule?.recipients || [],
                    format: formData.schedule?.format || 'pdf'
                  }
                })}
              />
              <Label htmlFor="scheduleEnabled">自動送信を有効化</Label>
            </div>

            {formData.schedule?.enabled && (
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>送信頻度</Label>
                    <Select
                      value={formData.schedule.frequency}
                      onValueChange={(value: any) => setFormData({
                        ...formData,
                        schedule: { ...formData.schedule!, frequency: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">毎日</SelectItem>
                        <SelectItem value="weekly">毎週</SelectItem>
                        <SelectItem value="monthly">毎月</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>送信時刻</Label>
                    <Input
                      type="time"
                      value={formData.schedule.time}
                      onChange={(e) => setFormData({
                        ...formData,
                        schedule: { ...formData.schedule!, time: e.target.value }
                      })}
                    />
                  </div>
                </div>

                {formData.schedule.frequency === 'weekly' && (
                  <div>
                    <Label>曜日</Label>
                    <div className="flex gap-2 mt-2">
                      {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
                        <label key={index} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.schedule?.dayOfWeek?.includes(index)}
                            onChange={(e) => {
                              const days = formData.schedule?.dayOfWeek || []
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  schedule: { ...formData.schedule!, dayOfWeek: [...days, index] }
                                })
                              } else {
                                setFormData({
                                  ...formData,
                                  schedule: { ...formData.schedule!, dayOfWeek: days.filter(d => d !== index) }
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

                {formData.schedule.frequency === 'monthly' && (
                  <div>
                    <Label>送信日（複数選択可）</Label>
                    <Input
                      value={formData.schedule.dayOfMonth?.join(', ')}
                      onChange={(e) => setFormData({
                        ...formData,
                        schedule: {
                          ...formData.schedule!,
                          dayOfMonth: e.target.value.split(',').map(d => parseInt(d.trim()))
                        }
                      })}
                      placeholder="1, 15, 30"
                    />
                  </div>
                )}

                <div>
                  <Label>送信先メールアドレス</Label>
                  <Textarea
                    value={formData.schedule.recipients?.join('\n')}
                    onChange={(e) => setFormData({
                      ...formData,
                      schedule: {
                        ...formData.schedule!,
                        recipients: e.target.value.split('\n').filter(s => s.trim())
                      }
                    })}
                    placeholder="hr@example.com&#10;manager@example.com"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>送信フォーマット</Label>
                  <Select
                    value={formData.schedule.format}
                    onValueChange={(value: any) => setFormData({
                      ...formData,
                      schedule: { ...formData.schedule!, format: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4 mt-4">
            <div>
              <Label>閲覧権限</Label>
              <div className="flex gap-3 mt-2">
                {['admin', 'hr', 'manager', 'staff'].map(role => (
                  <label key={role} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.permissions?.viewRoles.includes(role)}
                      onChange={(e) => {
                        const roles = formData.permissions?.viewRoles || []
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            permissions: { ...formData.permissions!, viewRoles: [...roles, role] }
                          })
                        } else {
                          setFormData({
                            ...formData,
                            permissions: {
                              ...formData.permissions!,
                              viewRoles: roles.filter(r => r !== role)
                            }
                          })
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">
                      {role === 'admin' ? '管理者' :
                       role === 'hr' ? '人事部' :
                       role === 'manager' ? 'マネージャー' : 'スタッフ'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>編集権限</Label>
              <div className="flex gap-3 mt-2">
                {['admin', 'hr', 'manager'].map(role => (
                  <label key={role} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.permissions?.editRoles.includes(role)}
                      onChange={(e) => {
                        const roles = formData.permissions?.editRoles || []
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            permissions: { ...formData.permissions!, editRoles: [...roles, role] }
                          })
                        } else {
                          setFormData({
                            ...formData,
                            permissions: {
                              ...formData.permissions!,
                              editRoles: roles.filter(r => r !== role)
                            }
                          })
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">
                      {role === 'admin' ? '管理者' :
                       role === 'hr' ? '人事部' : 'マネージャー'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>エクスポート権限</Label>
              <div className="flex gap-3 mt-2">
                {['admin', 'hr', 'manager', 'staff'].map(role => (
                  <label key={role} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.permissions?.exportRoles.includes(role)}
                      onChange={(e) => {
                        const roles = formData.permissions?.exportRoles || []
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            permissions: { ...formData.permissions!, exportRoles: [...roles, role] }
                          })
                        } else {
                          setFormData({
                            ...formData,
                            permissions: {
                              ...formData.permissions!,
                              exportRoles: roles.filter(r => r !== role)
                            }
                          })
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">
                      {role === 'admin' ? '管理者' :
                       role === 'hr' ? '人事部' :
                       role === 'manager' ? 'マネージャー' : 'スタッフ'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>エクスポート設定</Label>
              <div className="space-y-3 mt-2 p-4 border rounded-lg">
                <div>
                  <Label>エクスポート形式</Label>
                  <div className="flex gap-3 mt-2">
                    {['pdf', 'excel', 'csv'].map(format => (
                      <label key={format} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.export?.formats.includes(format as any)}
                          onChange={(e) => {
                            const formats = formData.export?.formats || []
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                export: { ...formData.export!, formats: [...formats, format as any] }
                              })
                            } else {
                              setFormData({
                                ...formData,
                                export: {
                                  ...formData.export!,
                                  formats: formats.filter(f => f !== format)
                                }
                              })
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">{format.toUpperCase()}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includeCharts"
                      checked={formData.export?.includeCharts}
                      onChange={(e) => setFormData({
                        ...formData,
                        export: { ...formData.export!, includeCharts: e.target.checked }
                      })}
                    />
                    <Label htmlFor="includeCharts">チャートを含める</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includeRawData"
                      checked={formData.export?.includeRawData}
                      onChange={(e) => setFormData({
                        ...formData,
                        export: { ...formData.export!, includeRawData: e.target.checked }
                      })}
                    />
                    <Label htmlFor="includeRawData">生データを含める</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="passwordProtect"
                      checked={formData.export?.passwordProtect}
                      onChange={(e) => setFormData({
                        ...formData,
                        export: { ...formData.export!, passwordProtect: e.target.checked }
                      })}
                    />
                    <Label htmlFor="passwordProtect">パスワード保護</Label>
                  </div>
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
            if (editingTemplate) {
              setTemplates(prev => prev.map(t => t.id === formData.id ? formData as ReportTemplate : t))
            } else {
              setTemplates(prev => [...prev, {
                ...formData,
                id: Date.now().toString(),
                metadata: {
                  createdAt: new Date().toISOString(),
                  createdBy: 'user',
                  updatedAt: new Date().toISOString(),
                  updatedBy: 'user'
                }
              } as ReportTemplate])
            }
            setIsDialogOpen(false)
            setEditingTemplate(null)
          }}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    )
  }

  const ReportPreview = ({ template }: { template: ReportTemplate }) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              レポートプレビュー: {template.templateName}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {template.components.map(component => {
              const colSpan =
                component.width === 'full' ? 'col-span-4' :
                component.width === 'half' ? 'col-span-2' :
                component.width === 'third' ? 'col-span-1' :
                'col-span-1'

              return (
                <div key={component.id} className={colSpan}>
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        {componentTypeIcons[component.type as keyof typeof componentTypeIcons]}
                        <span className="font-medium">{component.title}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {component.type === 'metric' && (
                        <div>
                          <div className="text-3xl font-bold">12,345</div>
                          <div className="text-sm text-gray-500">
                            {component.metric?.comparison?.enabled && (
                              <span className="text-green-500">+15.3%</span>
                            )}
                          </div>
                        </div>
                      )}
                      {component.type === 'chart' && (
                        <div className="h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                          {component.chart?.chartType === 'bar' && <BarChart3 className="h-16 w-16" />}
                          {component.chart?.chartType === 'line' && <LineChart className="h-16 w-16" />}
                          {component.chart?.chartType === 'pie' && <PieChart className="h-16 w-16" />}
                        </div>
                      )}
                      {component.type === 'table' && (
                        <div className="text-sm text-gray-500">
                          テーブル: {component.table?.columns.length}列
                        </div>
                      )}
                      {component.type === 'text' && (
                        <div className="text-sm">テキストコンテンツ</div>
                      )}
                    </CardContent>
                  </Card>
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
            <TabsTrigger value="list">テンプレート一覧</TabsTrigger>
            <TabsTrigger value="preview">プレビュー</TabsTrigger>
          </TabsList>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Button onClick={() => {
              setEditingTemplate(null)
              setIsDialogOpen(true)
            }}>
              <Plus className="h-4 w-4 mr-2" />
              新規テンプレート
            </Button>
            <TemplateEditDialog />
          </Dialog>
        </div>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>レポートテンプレート</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>テンプレート名</TableHead>
                    <TableHead>カテゴリー</TableHead>
                    <TableHead>コンポーネント</TableHead>
                    <TableHead>スケジュール</TableHead>
                    <TableHead>最終生成</TableHead>
                    <TableHead>状態</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map(template => (
                    <TableRow key={template.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {template.templateName}
                            {template.isPublic ? (
                              <Unlock className="h-3 w-3 text-green-500" />
                            ) : (
                              <Lock className="h-3 w-3 text-gray-400" />
                            )}
                          </div>
                          <div className="text-xs text-gray-500">{template.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {template.category === 'pipeline' ? 'パイプライン' :
                           template.category === 'performance' ? 'パフォーマンス' :
                           template.category === 'source' ? 'ソース分析' :
                           template.category === 'facility' ? '施設別' : 'カスタム'}
                        </Badge>
                      </TableCell>
                      <TableCell>{template.components.length}個</TableCell>
                      <TableCell>
                        {template.schedule?.enabled ? (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span className="text-sm">
                              {template.schedule.frequency === 'daily' ? '毎日' :
                               template.schedule.frequency === 'weekly' ? '毎週' : '毎月'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {template.metadata.lastGeneratedAt ? (
                          <span className="text-sm">
                            {new Date(template.metadata.lastGeneratedAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-gray-400">未生成</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={template.isActive ? 'default' : 'secondary'}>
                          {template.isActive ? '有効' : '無効'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPreviewTemplate(template)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Send className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingTemplate(template)
                              setIsDialogOpen(true)
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm('このテンプレートを削除してもよろしいですか？')) {
                                setTemplates(prev => prev.filter(t => t.id !== template.id))
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

        <TabsContent value="preview">
          {previewTemplate || templates[0] ? (
            <ReportPreview template={previewTemplate || templates[0]} />
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                プレビューするテンプレートを選択してください
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}