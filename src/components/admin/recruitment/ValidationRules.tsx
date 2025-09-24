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
import { ValidationRule } from '@/types/recruitmentMaster'
import {
  Plus, Edit2, Trash2, Shield, AlertTriangle, CheckCircle,
  Info, Copy, Search, Filter, GitBranch, AlertCircle, Settings
} from 'lucide-react'

export default function ValidationRules() {
  const [rules, setRules] = useState<ValidationRule[]>([
    {
      id: '1',
      ruleCode: 'duplicate-email',
      ruleName: 'メールアドレス重複チェック',
      description: '同一メールアドレスでの重複応募を検出',
      ruleType: 'duplicate',
      target: {
        entity: 'talent',
        fields: ['email'],
        timing: ['create', 'update', 'import']
      },
      validation: {
        duplicate: {
          fields: ['email'],
          scope: 'global',
          caseSensitive: false,
          ignoreSpaces: true,
          fuzzyMatch: {
            enabled: false,
            threshold: 90
          }
        }
      },
      action: {
        type: 'warn',
        notification: {
          enabled: true,
          recipients: ['hr@example.com'],
          includeDetails: true
        }
      },
      severity: 'warning',
      isActive: true,
      statistics: {
        lastRunAt: '2024-01-20T10:00:00',
        totalChecks: 523,
        violations: 12,
        autoCorrections: 0
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
      ruleCode: 'phone-format',
      ruleName: '電話番号フォーマット',
      description: '電話番号の形式を検証し自動修正',
      ruleType: 'format',
      target: {
        entity: 'applicant',
        fields: ['phone'],
        timing: ['create', 'update', 'import']
      },
      validation: {
        format: {
          field: 'phone',
          pattern: '^0\\d{1,4}-\\d{1,4}-\\d{4}$',
          errorMessage: '正しい電話番号形式で入力してください（例: 090-1234-5678）'
        }
      },
      action: {
        type: 'auto_correct',
        autoCorrect: {
          field: 'phone',
          correction: 'format',
          customFunction: 'formatPhoneNumber'
        },
        notification: {
          enabled: false,
          recipients: [],
          includeDetails: false
        }
      },
      severity: 'warning',
      isActive: true,
      statistics: {
        lastRunAt: '2024-01-20T09:30:00',
        totalChecks: 234,
        violations: 45,
        autoCorrections: 45
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
      ruleCode: 'age-requirement',
      ruleName: '年齢要件チェック',
      description: '応募者の年齢が求人要件を満たしているか検証',
      ruleType: 'business',
      target: {
        entity: 'applicant',
        fields: ['birthDate', 'position'],
        timing: ['create', 'update']
      },
      validation: {
        business: {
          expression: 'age >= 18 && age <= 65',
          errorMessage: '応募可能な年齢は18歳以上65歳以下です',
          warningOnly: false
        }
      },
      action: {
        type: 'block',
        notification: {
          enabled: true,
          recipients: ['hr@example.com'],
          includeDetails: true
        }
      },
      exclusions: {
        positions: ['インターン', '学生アルバイト']
      },
      severity: 'error',
      isActive: true,
      metadata: {
        createdAt: '2024-01-05',
        createdBy: 'admin',
        updatedAt: '2024-01-05',
        updatedBy: 'admin'
      }
    }
  ])

  const [editingRule, setEditingRule] = useState<ValidationRule | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('list')

  const ruleTypeColors = {
    duplicate: 'bg-purple-100 text-purple-800',
    format: 'bg-blue-100 text-blue-800',
    business: 'bg-green-100 text-green-800',
    consistency: 'bg-orange-100 text-orange-800'
  }

  const severityIcons = {
    error: <AlertCircle className="h-4 w-4 text-red-500" />,
    warning: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
    info: <Info className="h-4 w-4 text-blue-500" />
  }

  const RuleEditDialog = () => {
    const [formData, setFormData] = useState<Partial<ValidationRule>>(
      editingRule || {
        ruleCode: '',
        ruleName: '',
        description: '',
        ruleType: 'duplicate',
        target: {
          entity: 'talent',
          fields: [],
          timing: ['create', 'update']
        },
        validation: {},
        action: {
          type: 'warn',
          notification: {
            enabled: false,
            recipients: [],
            includeDetails: true
          }
        },
        severity: 'warning',
        isActive: true
      }
    )

    return (
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingRule ? '検証ルール編集' : '新規検証ルール'}
          </DialogTitle>
          <DialogDescription>
            データの整合性と品質を保つための検証ルールを設定します
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">基本設定</TabsTrigger>
            <TabsTrigger value="validation">検証ロジック</TabsTrigger>
            <TabsTrigger value="action">アクション</TabsTrigger>
            <TabsTrigger value="exclusions">除外条件</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ruleCode">ルールコード*</Label>
                <Input
                  id="ruleCode"
                  value={formData.ruleCode}
                  onChange={(e) => setFormData({ ...formData, ruleCode: e.target.value })}
                  placeholder="例: duplicate-email"
                />
              </div>
              <div>
                <Label htmlFor="ruleName">ルール名*</Label>
                <Input
                  id="ruleName"
                  value={formData.ruleName}
                  onChange={(e) => setFormData({ ...formData, ruleName: e.target.value })}
                  placeholder="例: メールアドレス重複チェック"
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ruleType">ルールタイプ*</Label>
                <Select
                  value={formData.ruleType}
                  onValueChange={(value: any) => setFormData({
                    ...formData,
                    ruleType: value,
                    validation: value === 'duplicate' ? {
                      duplicate: {
                        fields: [],
                        scope: 'global',
                        caseSensitive: false,
                        ignoreSpaces: true
                      }
                    } : value === 'format' ? {
                      format: {
                        field: '',
                        pattern: '',
                        errorMessage: ''
                      }
                    } : value === 'business' ? {
                      business: {
                        expression: '',
                        errorMessage: '',
                        warningOnly: false
                      }
                    } : {
                      consistency: {
                        rules: []
                      }
                    }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="duplicate">重複チェック</SelectItem>
                    <SelectItem value="format">フォーマット</SelectItem>
                    <SelectItem value="business">ビジネスルール</SelectItem>
                    <SelectItem value="consistency">整合性</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="severity">重要度</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value: any) => setFormData({ ...formData, severity: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="error">エラー</SelectItem>
                    <SelectItem value="warning">警告</SelectItem>
                    <SelectItem value="info">情報</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>対象エンティティ</Label>
              <Select
                value={formData.target?.entity}
                onValueChange={(value: any) => setFormData({
                  ...formData,
                  target: { ...formData.target!, entity: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="talent">人材（統合）</SelectItem>
                  <SelectItem value="visitor">見学者</SelectItem>
                  <SelectItem value="applicant">応募者</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>検証タイミング</Label>
              <div className="flex gap-3 mt-2">
                {['create', 'update', 'import'].map(timing => (
                  <label key={timing} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.target?.timing.includes(timing as any)}
                      onChange={(e) => {
                        const timings = formData.target?.timing || []
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            target: { ...formData.target!, timing: [...timings, timing as any] }
                          })
                        } else {
                          setFormData({
                            ...formData,
                            target: {
                              ...formData.target!,
                              timing: timings.filter(t => t !== timing)
                            }
                          })
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">
                      {timing === 'create' ? '作成時' :
                       timing === 'update' ? '更新時' : 'インポート時'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">ルールを有効化</Label>
            </div>
          </TabsContent>

          <TabsContent value="validation" className="space-y-4 mt-4">
            {formData.ruleType === 'duplicate' && (
              <div className="space-y-4">
                <div>
                  <Label>チェック対象フィールド</Label>
                  <div className="flex gap-2 mt-2">
                    {['email', 'phone', 'name', 'employeeId'].map(field => (
                      <label key={field} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.validation?.duplicate?.fields.includes(field)}
                          onChange={(e) => {
                            const fields = formData.validation?.duplicate?.fields || []
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                validation: {
                                  duplicate: {
                                    ...formData.validation?.duplicate!,
                                    fields: [...fields, field]
                                  }
                                }
                              })
                            } else {
                              setFormData({
                                ...formData,
                                validation: {
                                  duplicate: {
                                    ...formData.validation?.duplicate!,
                                    fields: fields.filter(f => f !== field)
                                  }
                                }
                              })
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">
                          {field === 'email' ? 'メール' :
                           field === 'phone' ? '電話番号' :
                           field === 'name' ? '氏名' : '社員ID'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>チェック範囲</Label>
                  <Select
                    value={formData.validation?.duplicate?.scope}
                    onValueChange={(value: any) => setFormData({
                      ...formData,
                      validation: {
                        duplicate: {
                          ...formData.validation?.duplicate!,
                          scope: value
                        }
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">全体</SelectItem>
                      <SelectItem value="facility">施設単位</SelectItem>
                      <SelectItem value="department">部署単位</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="caseSensitive"
                      checked={formData.validation?.duplicate?.caseSensitive}
                      onCheckedChange={(checked) => setFormData({
                        ...formData,
                        validation: {
                          duplicate: {
                            ...formData.validation?.duplicate!,
                            caseSensitive: checked
                          }
                        }
                      })}
                    />
                    <Label htmlFor="caseSensitive">大文字小文字を区別</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ignoreSpaces"
                      checked={formData.validation?.duplicate?.ignoreSpaces}
                      onCheckedChange={(checked) => setFormData({
                        ...formData,
                        validation: {
                          duplicate: {
                            ...formData.validation?.duplicate!,
                            ignoreSpaces: checked
                          }
                        }
                      })}
                    />
                    <Label htmlFor="ignoreSpaces">空白を無視</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="fuzzyMatch"
                      checked={formData.validation?.duplicate?.fuzzyMatch?.enabled}
                      onCheckedChange={(checked) => setFormData({
                        ...formData,
                        validation: {
                          duplicate: {
                            ...formData.validation?.duplicate!,
                            fuzzyMatch: {
                              enabled: checked,
                              threshold: formData.validation?.duplicate?.fuzzyMatch?.threshold || 80
                            }
                          }
                        }
                      })}
                    />
                    <Label htmlFor="fuzzyMatch">あいまい一致</Label>
                  </div>

                  {formData.validation?.duplicate?.fuzzyMatch?.enabled && (
                    <div>
                      <Label>類似度しきい値 (%)</Label>
                      <Input
                        type="number"
                        value={formData.validation?.duplicate?.fuzzyMatch?.threshold}
                        onChange={(e) => setFormData({
                          ...formData,
                          validation: {
                            duplicate: {
                              ...formData.validation?.duplicate!,
                              fuzzyMatch: {
                                ...formData.validation?.duplicate?.fuzzyMatch!,
                                threshold: parseInt(e.target.value)
                              }
                            }
                          }
                        })}
                        min={0}
                        max={100}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {formData.ruleType === 'format' && (
              <div className="space-y-4">
                <div>
                  <Label>対象フィールド</Label>
                  <Input
                    value={formData.validation?.format?.field}
                    onChange={(e) => setFormData({
                      ...formData,
                      validation: {
                        format: {
                          ...formData.validation?.format!,
                          field: e.target.value
                        }
                      }
                    })}
                    placeholder="例: phone"
                  />
                </div>

                <div>
                  <Label>検証パターン（正規表現）</Label>
                  <Input
                    value={formData.validation?.format?.pattern}
                    onChange={(e) => setFormData({
                      ...formData,
                      validation: {
                        format: {
                          ...formData.validation?.format!,
                          pattern: e.target.value
                        }
                      }
                    })}
                    placeholder="例: ^0\d{1,4}-\d{1,4}-\d{4}$"
                  />
                </div>

                <div>
                  <Label>エラーメッセージ</Label>
                  <Textarea
                    value={formData.validation?.format?.errorMessage}
                    onChange={(e) => setFormData({
                      ...formData,
                      validation: {
                        format: {
                          ...formData.validation?.format!,
                          errorMessage: e.target.value
                        }
                      }
                    })}
                    placeholder="エラー時に表示するメッセージ"
                    rows={2}
                  />
                </div>
              </div>
            )}

            {formData.ruleType === 'business' && (
              <div className="space-y-4">
                <div>
                  <Label>評価式</Label>
                  <Textarea
                    value={formData.validation?.business?.expression}
                    onChange={(e) => setFormData({
                      ...formData,
                      validation: {
                        business: {
                          ...formData.validation?.business!,
                          expression: e.target.value
                        }
                      }
                    })}
                    placeholder="例: age >= 18 && age <= 65"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>エラーメッセージ</Label>
                  <Textarea
                    value={formData.validation?.business?.errorMessage}
                    onChange={(e) => setFormData({
                      ...formData,
                      validation: {
                        business: {
                          ...formData.validation?.business!,
                          errorMessage: e.target.value
                        }
                      }
                    })}
                    placeholder="条件を満たさない場合のメッセージ"
                    rows={2}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="warningOnly"
                    checked={formData.validation?.business?.warningOnly}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      validation: {
                        business: {
                          ...formData.validation?.business!,
                          warningOnly: checked
                        }
                      }
                    })}
                  />
                  <Label htmlFor="warningOnly">警告のみ（ブロックしない）</Label>
                </div>
              </div>
            )}

            {formData.ruleType === 'consistency' && (
              <div className="space-y-4">
                <Label>整合性ルール</Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input placeholder="フィールド1" className="w-32" />
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="演算子" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">等しい</SelectItem>
                        <SelectItem value="not_equals">等しくない</SelectItem>
                        <SelectItem value="greater_than">より大きい</SelectItem>
                        <SelectItem value="less_than">より小さい</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="フィールド2または値" />
                  </div>
                  <Input placeholder="エラーメッセージ" />
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    ルールを追加
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="action" className="space-y-4 mt-4">
            <div>
              <Label>アクションタイプ</Label>
              <Select
                value={formData.action?.type}
                onValueChange={(value: any) => setFormData({
                  ...formData,
                  action: {
                    ...formData.action!,
                    type: value,
                    autoCorrect: value === 'auto_correct' ? {
                      field: '',
                      correction: 'trim'
                    } : undefined
                  }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="block">ブロック</SelectItem>
                  <SelectItem value="warn">警告</SelectItem>
                  <SelectItem value="auto_correct">自動修正</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.action?.type === 'auto_correct' && (
              <div className="space-y-3">
                <div>
                  <Label>修正対象フィールド</Label>
                  <Input
                    value={formData.action?.autoCorrect?.field}
                    onChange={(e) => setFormData({
                      ...formData,
                      action: {
                        ...formData.action!,
                        autoCorrect: {
                          ...formData.action?.autoCorrect!,
                          field: e.target.value
                        }
                      }
                    })}
                    placeholder="フィールド名"
                  />
                </div>

                <div>
                  <Label>修正方法</Label>
                  <Select
                    value={formData.action?.autoCorrect?.correction}
                    onValueChange={(value: any) => setFormData({
                      ...formData,
                      action: {
                        ...formData.action!,
                        autoCorrect: {
                          ...formData.action?.autoCorrect!,
                          correction: value
                        }
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trim">前後の空白削除</SelectItem>
                      <SelectItem value="uppercase">大文字変換</SelectItem>
                      <SelectItem value="lowercase">小文字変換</SelectItem>
                      <SelectItem value="format">フォーマット</SelectItem>
                      <SelectItem value="custom">カスタム関数</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.action?.autoCorrect?.correction === 'custom' && (
                  <div>
                    <Label>カスタム関数名</Label>
                    <Input
                      value={formData.action?.autoCorrect?.customFunction}
                      onChange={(e) => setFormData({
                        ...formData,
                        action: {
                          ...formData.action!,
                          autoCorrect: {
                            ...formData.action?.autoCorrect!,
                            customFunction: e.target.value
                          }
                        }
                      })}
                      placeholder="例: formatPhoneNumber"
                    />
                  </div>
                )}
              </div>
            )}

            <div>
              <Label>通知設定</Label>
              <div className="space-y-3 mt-2 p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="notificationEnabled"
                    checked={formData.action?.notification?.enabled}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      action: {
                        ...formData.action!,
                        notification: {
                          ...formData.action?.notification!,
                          enabled: checked
                        }
                      }
                    })}
                  />
                  <Label htmlFor="notificationEnabled">違反時に通知</Label>
                </div>

                {formData.action?.notification?.enabled && (
                  <>
                    <div>
                      <Label>通知先メールアドレス</Label>
                      <Textarea
                        value={formData.action?.notification?.recipients?.join('\n')}
                        onChange={(e) => setFormData({
                          ...formData,
                          action: {
                            ...formData.action!,
                            notification: {
                              ...formData.action?.notification!,
                              recipients: e.target.value.split('\n').filter(s => s.trim())
                            }
                          }
                        })}
                        placeholder="hr@example.com&#10;admin@example.com"
                        rows={2}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="includeDetails"
                        checked={formData.action?.notification?.includeDetails}
                        onCheckedChange={(checked) => setFormData({
                          ...formData,
                          action: {
                            ...formData.action!,
                            notification: {
                              ...formData.action?.notification!,
                              includeDetails: checked
                            }
                          }
                        })}
                      />
                      <Label htmlFor="includeDetails">詳細情報を含める</Label>
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="exclusions" className="space-y-4 mt-4">
            <div>
              <Label>除外ステータス</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {['draft', 'rejected', 'withdrawn', 'blacklisted'].map(status => (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.exclusions?.statuses?.includes(status)}
                      onChange={(e) => {
                        const statuses = formData.exclusions?.statuses || []
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            exclusions: { ...formData.exclusions, statuses: [...statuses, status] }
                          })
                        } else {
                          setFormData({
                            ...formData,
                            exclusions: {
                              ...formData.exclusions,
                              statuses: statuses.filter(s => s !== status)
                            }
                          })
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">
                      {status === 'draft' ? '下書き' :
                       status === 'rejected' ? '不採用' :
                       status === 'withdrawn' ? '辞退' : 'ブラックリスト'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>除外タグ</Label>
              <Textarea
                value={formData.exclusions?.tags?.join(', ')}
                onChange={(e) => setFormData({
                  ...formData,
                  exclusions: {
                    ...formData.exclusions,
                    tags: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  }
                })}
                placeholder="テスト, サンプル, 仮登録"
                rows={2}
              />
            </div>

            <div>
              <Label>除外施設</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {['小原病院', '立神リハビリテーション温泉病院', 'エスポワール立神', '宝寿庵'].map(facility => (
                  <label key={facility} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.exclusions?.facilities?.includes(facility)}
                      onChange={(e) => {
                        const facilities = formData.exclusions?.facilities || []
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            exclusions: { ...formData.exclusions, facilities: [...facilities, facility] }
                          })
                        } else {
                          setFormData({
                            ...formData,
                            exclusions: {
                              ...formData.exclusions,
                              facilities: facilities.filter(f => f !== facility)
                            }
                          })
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{facility}</span>
                  </label>
                ))}
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
              setRules(prev => prev.map(r => r.id === formData.id ? formData as ValidationRule : r))
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
              } as ValidationRule])
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

  const RuleStatistics = () => {
    const totalChecks = rules.reduce((sum, rule) => sum + (rule.statistics?.totalChecks || 0), 0)
    const totalViolations = rules.reduce((sum, rule) => sum + (rule.statistics?.violations || 0), 0)
    const totalCorrections = rules.reduce((sum, rule) => sum + (rule.statistics?.autoCorrections || 0), 0)
    const violationRate = totalChecks > 0 ? (totalViolations / totalChecks * 100).toFixed(1) : 0

    return (
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">アクティブルール</p>
                <p className="text-2xl font-bold">{rules.filter(r => r.isActive).length}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">総チェック数</p>
                <p className="text-2xl font-bold">{totalChecks.toLocaleString()}</p>
              </div>
              <Search className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">違反率</p>
                <p className="text-2xl font-bold">{violationRate}%</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">自動修正数</p>
                <p className="text-2xl font-bold">{totalCorrections.toLocaleString()}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <RuleStatistics />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="list">ルール一覧</TabsTrigger>
            <TabsTrigger value="violations">違反ログ</TabsTrigger>
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
              <CardTitle>検証ルール</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ルール名</TableHead>
                    <TableHead>タイプ</TableHead>
                    <TableHead>対象</TableHead>
                    <TableHead>重要度</TableHead>
                    <TableHead>チェック数</TableHead>
                    <TableHead>違反数</TableHead>
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
                        <Badge className={ruleTypeColors[rule.ruleType as keyof typeof ruleTypeColors]}>
                          {rule.ruleType === 'duplicate' ? '重複' :
                           rule.ruleType === 'format' ? 'フォーマット' :
                           rule.ruleType === 'business' ? 'ビジネス' : '整合性'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{rule.target.entity}</div>
                          <div className="text-xs text-gray-500">
                            {rule.target.fields.join(', ')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {severityIcons[rule.severity as keyof typeof severityIcons]}
                          <span className="text-sm">
                            {rule.severity === 'error' ? 'エラー' :
                             rule.severity === 'warning' ? '警告' : '情報'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{rule.statistics?.totalChecks || 0}</TableCell>
                      <TableCell>
                        <div>
                          {rule.statistics?.violations || 0}
                          {rule.action.type === 'auto_correct' && rule.statistics?.autoCorrections && (
                            <div className="text-xs text-green-600">
                              ({rule.statistics.autoCorrections}修正)
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                          {rule.isActive ? '有効' : '無効'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Copy className="h-4 w-4" />
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

        <TabsContent value="violations">
          <Card>
            <CardHeader>
              <CardTitle>違反ログ</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>発生日時</TableHead>
                    <TableHead>ルール</TableHead>
                    <TableHead>エンティティ</TableHead>
                    <TableHead>フィールド</TableHead>
                    <TableHead>値</TableHead>
                    <TableHead>アクション</TableHead>
                    <TableHead>結果</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2024-01-20 10:15:00</TableCell>
                    <TableCell>メールアドレス重複チェック</TableCell>
                    <TableCell>応募者</TableCell>
                    <TableCell>email</TableCell>
                    <TableCell>test@example.com</TableCell>
                    <TableCell>警告</TableCell>
                    <TableCell>
                      <Badge variant="outline">通知済み</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2024-01-20 09:45:00</TableCell>
                    <TableCell>電話番号フォーマット</TableCell>
                    <TableCell>応募者</TableCell>
                    <TableCell>phone</TableCell>
                    <TableCell>09012345678</TableCell>
                    <TableCell>自動修正</TableCell>
                    <TableCell>
                      <Badge variant="default">修正済み</Badge>
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