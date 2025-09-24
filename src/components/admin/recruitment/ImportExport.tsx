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
import { Progress } from '@/components/ui/progress'
import { ImportExportConfig } from '@/types/recruitmentMaster'
import {
  Plus, Edit2, Trash2, Upload, Download, FileText,
  Play, Pause, Settings, AlertCircle, CheckCircle,
  RefreshCw, Clock, Mail, Cloud, Database, ArrowUpDown
} from 'lucide-react'

export default function ImportExport() {
  const [configs, setConfigs] = useState<ImportExportConfig[]>([
    {
      id: '1',
      configName: '応募者データインポート',
      type: 'import',
      entity: 'applicant',
      format: 'csv',
      fieldMapping: [
        {
          sourceField: '姓',
          targetField: 'lastName',
          dataType: 'string',
          required: true,
          transformation: { type: 'trim' }
        },
        {
          sourceField: '名',
          targetField: 'firstName',
          dataType: 'string',
          required: true,
          transformation: { type: 'trim' }
        },
        {
          sourceField: 'メールアドレス',
          targetField: 'email',
          dataType: 'string',
          required: true,
          transformation: { type: 'lowercase' }
        },
        {
          sourceField: '電話番号',
          targetField: 'phone',
          dataType: 'string',
          required: false,
          transformation: { type: 'custom', customFunction: 'formatPhoneNumber' }
        }
      ],
      importConfig: {
        duplicateHandling: 'update',
        duplicateCheckFields: ['email'],
        batchSize: 100,
        validateBeforeImport: true,
        rollbackOnError: true,
        dataCleansing: {
          trimWhitespace: true,
          removeEmptyRows: true,
          standardizePhone: true,
          standardizeEmail: true
        },
        notifications: {
          onStart: true,
          onComplete: true,
          onError: true,
          recipients: ['hr@example.com']
        }
      },
      isActive: true,
      isDefault: true,
      lastExecutedAt: '2024-01-15T10:00:00',
      lastExecutedBy: 'admin',
      executionHistory: [
        {
          id: 'h1',
          executedAt: '2024-01-15T10:00:00',
          executedBy: 'admin',
          recordsProcessed: 234,
          recordsSuccess: 230,
          recordsFailed: 4,
          fileName: 'applicants_202401.csv'
        }
      ],
      metadata: {
        createdAt: '2024-01-01',
        createdBy: 'system',
        updatedAt: '2024-01-01',
        updatedBy: 'system'
      }
    },
    {
      id: '2',
      configName: '月次採用レポート',
      type: 'export',
      entity: 'all',
      format: 'excel',
      exportConfig: {
        includeHeaders: true,
        dateFormat: 'yyyy-MM-dd',
        encoding: 'utf-8',
        fields: [
          { field: 'name', header: '氏名', order: 1 },
          { field: 'email', header: 'メールアドレス', order: 2 },
          { field: 'status', header: 'ステータス', order: 3 },
          { field: 'appliedDate', header: '応募日', order: 4, format: 'yyyy-MM-dd' }
        ],
        fileSettings: {
          fileName: '{date}_recruitment_report.xlsx',
          compression: false,
          password: true,
          splitSize: 10
        }
      },
      schedule: {
        enabled: true,
        frequency: 'monthly',
        time: '09:00',
        dayOfMonth: [1],
        destination: {
          type: 'email',
          emailRecipients: ['hr@example.com', 'manager@example.com']
        }
      },
      isActive: true,
      isDefault: false,
      metadata: {
        createdAt: '2024-01-01',
        createdBy: 'system',
        updatedAt: '2024-01-01',
        updatedBy: 'system'
      }
    }
  ])

  const [editingConfig, setEditingConfig] = useState<ImportExportConfig | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('configs')
  const [importProgress, setImportProgress] = useState<{
    isRunning: boolean
    progress: number
    status: string
  }>({
    isRunning: false,
    progress: 0,
    status: ''
  })

  const ConfigEditDialog = () => {
    const [formData, setFormData] = useState<Partial<ImportExportConfig>>(
      editingConfig || {
        configName: '',
        type: 'import',
        entity: 'applicant',
        format: 'csv',
        fieldMapping: [],
        isActive: true,
        isDefault: false
      }
    )

    const [mappingFields, setMappingFields] = useState(formData.fieldMapping || [])

    const addFieldMapping = () => {
      setMappingFields([
        ...mappingFields,
        {
          sourceField: '',
          targetField: '',
          dataType: 'string',
          required: false
        }
      ])
    }

    return (
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingConfig ? '設定編集' : '新規設定'}
          </DialogTitle>
          <DialogDescription>
            インポート/エクスポートの設定を行います
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="mt-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">基本設定</TabsTrigger>
            <TabsTrigger value="mapping">フィールドマッピング</TabsTrigger>
            <TabsTrigger value="options">オプション</TabsTrigger>
            <TabsTrigger value="schedule">スケジュール</TabsTrigger>
            <TabsTrigger value="history">実行履歴</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="configName">設定名*</Label>
                <Input
                  id="configName"
                  value={formData.configName}
                  onChange={(e) => setFormData({ ...formData, configName: e.target.value })}
                  placeholder="例: 応募者データインポート"
                />
              </div>
              <div>
                <Label htmlFor="type">タイプ*</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="import">インポート</SelectItem>
                    <SelectItem value="export">エクスポート</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="entity">対象エンティティ</Label>
                <Select
                  value={formData.entity}
                  onValueChange={(value: any) => setFormData({ ...formData, entity: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="talent">人材（統合）</SelectItem>
                    <SelectItem value="visitor">見学者</SelectItem>
                    <SelectItem value="applicant">応募者</SelectItem>
                    <SelectItem value="all">すべて</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="format">ファイル形式</Label>
                <Select
                  value={formData.format}
                  onValueChange={(value: any) => setFormData({ ...formData, format: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                  id="isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
                />
                <Label htmlFor="isDefault">デフォルト設定</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mapping" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <Label>フィールドマッピング</Label>
              <Button variant="outline" size="sm" onClick={addFieldMapping}>
                <Plus className="h-4 w-4 mr-2" />
                フィールド追加
              </Button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-6 gap-2 text-sm font-medium text-gray-600">
                <div>ソースフィールド</div>
                <div>ターゲットフィールド</div>
                <div>データ型</div>
                <div>変換</div>
                <div>必須</div>
                <div></div>
              </div>

              {mappingFields.map((field, index) => (
                <div key={index} className="grid grid-cols-6 gap-2">
                  <Input
                    value={field.sourceField}
                    onChange={(e) => {
                      const newFields = [...mappingFields]
                      newFields[index] = { ...field, sourceField: e.target.value }
                      setMappingFields(newFields)
                    }}
                    placeholder="CSVヘッダー"
                  />
                  <Input
                    value={field.targetField}
                    onChange={(e) => {
                      const newFields = [...mappingFields]
                      newFields[index] = { ...field, targetField: e.target.value }
                      setMappingFields(newFields)
                    }}
                    placeholder="システムフィールド"
                  />
                  <Select
                    value={field.dataType}
                    onValueChange={(value) => {
                      const newFields = [...mappingFields]
                      newFields[index] = { ...field, dataType: value }
                      setMappingFields(newFields)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">文字列</SelectItem>
                      <SelectItem value="number">数値</SelectItem>
                      <SelectItem value="date">日付</SelectItem>
                      <SelectItem value="boolean">真偽値</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={field.transformation?.type || 'none'}
                    onValueChange={(value) => {
                      const newFields = [...mappingFields]
                      newFields[index] = {
                        ...field,
                        transformation: value === 'none' ? undefined : { type: value as any }
                      }
                      setMappingFields(newFields)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">なし</SelectItem>
                      <SelectItem value="trim">空白削除</SelectItem>
                      <SelectItem value="uppercase">大文字</SelectItem>
                      <SelectItem value="lowercase">小文字</SelectItem>
                      <SelectItem value="date_format">日付形式</SelectItem>
                      <SelectItem value="custom">カスタム</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => {
                        const newFields = [...mappingFields]
                        newFields[index] = { ...field, required: e.target.checked }
                        setMappingFields(newFields)
                      }}
                      className="rounded border-gray-300"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMappingFields(mappingFields.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {formData.type === 'import' && (
              <Card className="p-4">
                <h4 className="font-medium mb-3">サンプルデータプレビュー</h4>
                <div className="bg-gray-50 p-3 rounded text-sm font-mono overflow-x-auto">
                  <div>姓,名,メールアドレス,電話番号,生年月日</div>
                  <div>山田,太郎,yamada@example.com,090-1234-5678,1990-01-01</div>
                  <div>佐藤,花子,sato@example.com,080-2345-6789,1988-05-15</div>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="options" className="space-y-4 mt-4">
            {formData.type === 'import' ? (
              <div className="space-y-4">
                <div>
                  <Label>重複処理</Label>
                  <Select
                    value={formData.importConfig?.duplicateHandling}
                    onValueChange={(value: any) => setFormData({
                      ...formData,
                      importConfig: {
                        ...formData.importConfig!,
                        duplicateHandling: value
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="skip">スキップ</SelectItem>
                      <SelectItem value="update">更新</SelectItem>
                      <SelectItem value="create_new">新規作成</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>重複チェックフィールド</Label>
                  <div className="flex gap-2 mt-2">
                    {['email', 'phone', 'employeeId'].map(field => (
                      <label key={field} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.importConfig?.duplicateCheckFields?.includes(field)}
                          onChange={(e) => {
                            const fields = formData.importConfig?.duplicateCheckFields || []
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                importConfig: {
                                  ...formData.importConfig!,
                                  duplicateCheckFields: [...fields, field]
                                }
                              })
                            } else {
                              setFormData({
                                ...formData,
                                importConfig: {
                                  ...formData.importConfig!,
                                  duplicateCheckFields: fields.filter(f => f !== field)
                                }
                              })
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">
                          {field === 'email' ? 'メール' :
                           field === 'phone' ? '電話番号' : '社員ID'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>バッチサイズ</Label>
                    <Input
                      type="number"
                      value={formData.importConfig?.batchSize}
                      onChange={(e) => setFormData({
                        ...formData,
                        importConfig: {
                          ...formData.importConfig!,
                          batchSize: parseInt(e.target.value)
                        }
                      })}
                      min={1}
                      max={1000}
                    />
                  </div>
                  <div className="flex items-end gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="validateBeforeImport"
                        checked={formData.importConfig?.validateBeforeImport}
                        onCheckedChange={(checked) => setFormData({
                          ...formData,
                          importConfig: {
                            ...formData.importConfig!,
                            validateBeforeImport: checked
                          }
                        })}
                      />
                      <Label htmlFor="validateBeforeImport">事前検証</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="rollbackOnError"
                        checked={formData.importConfig?.rollbackOnError}
                        onCheckedChange={(checked) => setFormData({
                          ...formData,
                          importConfig: {
                            ...formData.importConfig!,
                            rollbackOnError: checked
                          }
                        })}
                      />
                      <Label htmlFor="rollbackOnError">エラー時ロールバック</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>データクレンジング</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2 p-4 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="trimWhitespace"
                        checked={formData.importConfig?.dataCleansing?.trimWhitespace}
                        defaultChecked
                      />
                      <Label htmlFor="trimWhitespace">空白削除</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="removeEmptyRows"
                        checked={formData.importConfig?.dataCleansing?.removeEmptyRows}
                        defaultChecked
                      />
                      <Label htmlFor="removeEmptyRows">空行削除</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="standardizePhone"
                        checked={formData.importConfig?.dataCleansing?.standardizePhone}
                        defaultChecked
                      />
                      <Label htmlFor="standardizePhone">電話番号正規化</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="standardizeEmail"
                        checked={formData.importConfig?.dataCleansing?.standardizeEmail}
                        defaultChecked
                      />
                      <Label htmlFor="standardizeEmail">メール正規化</Label>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>日付フォーマット</Label>
                    <Input
                      value={formData.exportConfig?.dateFormat}
                      onChange={(e) => setFormData({
                        ...formData,
                        exportConfig: {
                          ...formData.exportConfig!,
                          dateFormat: e.target.value
                        }
                      })}
                      placeholder="yyyy-MM-dd"
                    />
                  </div>
                  <div>
                    <Label>エンコーディング</Label>
                    <Select
                      value={formData.exportConfig?.encoding}
                      onValueChange={(value: any) => setFormData({
                        ...formData,
                        exportConfig: {
                          ...formData.exportConfig!,
                          encoding: value
                        }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utf-8">UTF-8</SelectItem>
                        <SelectItem value="shift-jis">Shift-JIS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>ファイル設定</Label>
                  <div className="space-y-3 mt-2 p-4 border rounded-lg">
                    <div>
                      <Label>ファイル名テンプレート</Label>
                      <Input
                        value={formData.exportConfig?.fileSettings?.fileName}
                        onChange={(e) => setFormData({
                          ...formData,
                          exportConfig: {
                            ...formData.exportConfig!,
                            fileSettings: {
                              ...formData.exportConfig?.fileSettings!,
                              fileName: e.target.value
                            }
                          }
                        })}
                        placeholder="{date}_{type}.csv"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="includeHeaders"
                          checked={formData.exportConfig?.includeHeaders}
                          defaultChecked
                        />
                        <Label htmlFor="includeHeaders">ヘッダー含む</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="compression"
                          checked={formData.exportConfig?.fileSettings?.compression}
                        />
                        <Label htmlFor="compression">圧縮</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="password"
                          checked={formData.exportConfig?.fileSettings?.password}
                        />
                        <Label htmlFor="password">パスワード保護</Label>
                      </div>
                    </div>
                    <div>
                      <Label>ファイル分割サイズ (MB)</Label>
                      <Input
                        type="number"
                        value={formData.exportConfig?.fileSettings?.splitSize}
                        onChange={(e) => setFormData({
                          ...formData,
                          exportConfig: {
                            ...formData.exportConfig!,
                            fileSettings: {
                              ...formData.exportConfig?.fileSettings!,
                              splitSize: parseInt(e.target.value)
                            }
                          }
                        })}
                        placeholder="10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label>通知設定</Label>
              <div className="space-y-3 mt-2 p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="onStart"
                      checked={formData.importConfig?.notifications?.onStart}
                      defaultChecked
                    />
                    <Label htmlFor="onStart">開始時</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="onComplete"
                      checked={formData.importConfig?.notifications?.onComplete}
                      defaultChecked
                    />
                    <Label htmlFor="onComplete">完了時</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="onError"
                      checked={formData.importConfig?.notifications?.onError}
                      defaultChecked
                    />
                    <Label htmlFor="onError">エラー時</Label>
                  </div>
                </div>
                <div>
                  <Label>通知先</Label>
                  <Textarea
                    value={formData.importConfig?.notifications?.recipients?.join('\n')}
                    onChange={(e) => setFormData({
                      ...formData,
                      importConfig: {
                        ...formData.importConfig!,
                        notifications: {
                          ...formData.importConfig?.notifications!,
                          recipients: e.target.value.split('\n').filter(s => s.trim())
                        }
                      }
                    })}
                    placeholder="hr@example.com&#10;admin@example.com"
                    rows={2}
                  />
                </div>
              </div>
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
                    frequency: formData.schedule?.frequency || 'daily',
                    time: formData.schedule?.time || '09:00'
                  }
                })}
              />
              <Label htmlFor="scheduleEnabled">スケジュール実行を有効化</Label>
            </div>

            {formData.schedule?.enabled && (
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>実行頻度</Label>
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
                    <Label>実行時刻</Label>
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

                {formData.type === 'import' && (
                  <div>
                    <Label>インポート元</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="ソースタイプを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ftp">FTP</SelectItem>
                        <SelectItem value="sftp">SFTP</SelectItem>
                        <SelectItem value="http">HTTP</SelectItem>
                        <SelectItem value="email">メール</SelectItem>
                        <SelectItem value="cloud">クラウド</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.type === 'export' && (
                  <div>
                    <Label>エクスポート先</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="送信先タイプを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ftp">FTP</SelectItem>
                        <SelectItem value="sftp">SFTP</SelectItem>
                        <SelectItem value="email">メール</SelectItem>
                        <SelectItem value="cloud">クラウド</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-4">
            {editingConfig?.executionHistory && editingConfig.executionHistory.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>実行日時</TableHead>
                    <TableHead>実行者</TableHead>
                    <TableHead>処理件数</TableHead>
                    <TableHead>成功</TableHead>
                    <TableHead>失敗</TableHead>
                    <TableHead>ファイル名</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editingConfig.executionHistory.map(history => (
                    <TableRow key={history.id}>
                      <TableCell>{new Date(history.executedAt).toLocaleString()}</TableCell>
                      <TableCell>{history.executedBy}</TableCell>
                      <TableCell>{history.recordsProcessed}</TableCell>
                      <TableCell className="text-green-600">{history.recordsSuccess}</TableCell>
                      <TableCell className="text-red-600">{history.recordsFailed}</TableCell>
                      <TableCell>{history.fileName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center text-gray-500 py-8">
                まだ実行履歴がありません
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            キャンセル
          </Button>
          <Button onClick={() => {
            const configToSave = { ...formData, fieldMapping: mappingFields } as ImportExportConfig
            if (editingConfig) {
              setConfigs(prev => prev.map(c => c.id === configToSave.id ? configToSave : c))
            } else {
              setConfigs(prev => [...prev, {
                ...configToSave,
                id: Date.now().toString(),
                metadata: {
                  createdAt: new Date().toISOString(),
                  createdBy: 'user',
                  updatedAt: new Date().toISOString(),
                  updatedBy: 'user'
                }
              }])
            }
            setIsDialogOpen(false)
            setEditingConfig(null)
          }}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    )
  }

  const ImportProgress = () => {
    if (!importProgress.isRunning) return null

    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
                <span className="font-medium">インポート処理中...</span>
              </div>
              <Button variant="outline" size="sm">
                <Pause className="h-4 w-4 mr-2" />
                一時停止
              </Button>
            </div>
            <Progress value={importProgress.progress} className="h-2" />
            <div className="text-sm text-gray-500">{importProgress.status}</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <ImportProgress />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="configs">設定一覧</TabsTrigger>
            <TabsTrigger value="manual">手動実行</TabsTrigger>
            <TabsTrigger value="logs">実行ログ</TabsTrigger>
          </TabsList>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Button onClick={() => {
              setEditingConfig(null)
              setIsDialogOpen(true)
            }}>
              <Plus className="h-4 w-4 mr-2" />
              新規設定
            </Button>
            <ConfigEditDialog />
          </Dialog>
        </div>

        <TabsContent value="configs">
          <Card>
            <CardHeader>
              <CardTitle>インポート/エクスポート設定</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>設定名</TableHead>
                    <TableHead>タイプ</TableHead>
                    <TableHead>エンティティ</TableHead>
                    <TableHead>形式</TableHead>
                    <TableHead>スケジュール</TableHead>
                    <TableHead>最終実行</TableHead>
                    <TableHead>状態</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {configs.map(config => (
                    <TableRow key={config.id}>
                      <TableCell>
                        <div className="font-medium flex items-center gap-2">
                          {config.configName}
                          {config.isDefault && (
                            <Badge variant="secondary" className="text-xs">
                              デフォルト
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {config.type === 'import' ? (
                            <Upload className="h-4 w-4" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                          <span>{config.type === 'import' ? 'インポート' : 'エクスポート'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {config.entity === 'talent' ? '人材' :
                         config.entity === 'visitor' ? '見学者' :
                         config.entity === 'applicant' ? '応募者' : 'すべて'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {config.format.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {config.schedule?.enabled ? (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span className="text-sm">
                              {config.schedule.frequency === 'daily' ? '毎日' :
                               config.schedule.frequency === 'weekly' ? '毎週' : '毎月'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {config.lastExecutedAt ? (
                          <span className="text-sm">
                            {new Date(config.lastExecutedAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-gray-400">未実行</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={config.isActive ? 'default' : 'secondary'}>
                          {config.isActive ? '有効' : '無効'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setImportProgress({
                                isRunning: true,
                                progress: 0,
                                status: '処理を開始しています...'
                              })
                              // Simulate progress
                              let progress = 0
                              const interval = setInterval(() => {
                                progress += 10
                                if (progress >= 100) {
                                  clearInterval(interval)
                                  setImportProgress({
                                    isRunning: false,
                                    progress: 100,
                                    status: '完了しました'
                                  })
                                } else {
                                  setImportProgress({
                                    isRunning: true,
                                    progress,
                                    status: `処理中... ${progress}%`
                                  })
                                }
                              }, 500)
                            }}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingConfig(config)
                              setIsDialogOpen(true)
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm('この設定を削除してもよろしいですか？')) {
                                setConfigs(prev => prev.filter(c => c.id !== config.id))
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

        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>手動実行</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>設定を選択</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="実行する設定を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {configs.map(config => (
                      <SelectItem key={config.id} value={config.id}>
                        {config.configName} ({config.type === 'import' ? 'インポート' : 'エクスポート'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="file">ファイルを選択（インポートの場合）</Label>
                <Input id="file" type="file" accept=".csv,.xlsx,.json" />
              </div>

              <div className="flex gap-2">
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  インポート実行
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  エクスポート実行
                </Button>
              </div>
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
                    <TableHead>設定名</TableHead>
                    <TableHead>タイプ</TableHead>
                    <TableHead>処理件数</TableHead>
                    <TableHead>成功</TableHead>
                    <TableHead>失敗</TableHead>
                    <TableHead>実行時間</TableHead>
                    <TableHead>状態</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2024-01-20 10:00:00</TableCell>
                    <TableCell>応募者データインポート</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Upload className="h-3 w-3" />
                        インポート
                      </div>
                    </TableCell>
                    <TableCell>234</TableCell>
                    <TableCell className="text-green-600">230</TableCell>
                    <TableCell className="text-red-600">4</TableCell>
                    <TableCell>2分35秒</TableCell>
                    <TableCell>
                      <Badge variant="default">完了</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2024-01-19 09:00:00</TableCell>
                    <TableCell>月次採用レポート</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        エクスポート
                      </div>
                    </TableCell>
                    <TableCell>156</TableCell>
                    <TableCell className="text-green-600">156</TableCell>
                    <TableCell className="text-red-600">0</TableCell>
                    <TableCell>45秒</TableCell>
                    <TableCell>
                      <Badge variant="default">完了</Badge>
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