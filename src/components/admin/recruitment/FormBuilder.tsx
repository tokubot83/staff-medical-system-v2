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
import { FormFieldConfig, FormTemplate } from '@/types/recruitmentMaster'
import {
  Plus, Edit2, Trash2, Save, Copy, Eye, Settings,
  GripVertical, ChevronUp, ChevronDown, FileText,
  CheckSquare, Calendar, Mail, Phone, Hash, Type
} from 'lucide-react'

export default function FormBuilder() {
  const [fields, setFields] = useState<FormFieldConfig[]>([
    {
      id: '1',
      fieldCode: 'lastName',
      fieldName: '姓',
      fieldType: 'text',
      category: 'basic',
      display: {
        label: '姓',
        placeholder: '山田',
        order: 1,
        width: 'half'
      },
      validation: {
        required: true,
        maxLength: 50
      },
      scope: {
        facilities: ['all'],
        positions: ['all'],
        formTypes: ['visitor', 'application', 'interview', 'offer']
      },
      isActive: true,
      isSystem: true,
      metadata: {
        createdAt: '2024-01-01',
        createdBy: 'system',
        updatedAt: '2024-01-01',
        updatedBy: 'system'
      }
    },
    {
      id: '2',
      fieldCode: 'firstName',
      fieldName: '名',
      fieldType: 'text',
      category: 'basic',
      display: {
        label: '名',
        placeholder: '太郎',
        order: 2,
        width: 'half'
      },
      validation: {
        required: true,
        maxLength: 50
      },
      scope: {
        facilities: ['all'],
        positions: ['all'],
        formTypes: ['visitor', 'application', 'interview', 'offer']
      },
      isActive: true,
      isSystem: true,
      metadata: {
        createdAt: '2024-01-01',
        createdBy: 'system',
        updatedAt: '2024-01-01',
        updatedBy: 'system'
      }
    },
    {
      id: '3',
      fieldCode: 'email',
      fieldName: 'メールアドレス',
      fieldType: 'email',
      category: 'contact',
      display: {
        label: 'メールアドレス',
        placeholder: 'example@example.com',
        order: 3,
        width: 'full'
      },
      validation: {
        required: true,
        pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
      },
      scope: {
        facilities: ['all'],
        positions: ['all'],
        formTypes: ['visitor', 'application', 'interview', 'offer']
      },
      isActive: true,
      isSystem: true,
      metadata: {
        createdAt: '2024-01-01',
        createdBy: 'system',
        updatedAt: '2024-01-01',
        updatedBy: 'system'
      }
    }
  ])

  const [templates, setTemplates] = useState<FormTemplate[]>([
    {
      id: '1',
      templateCode: 'visitor-basic',
      templateName: '見学申込フォーム（基本）',
      formType: 'visitor',
      description: '施設見学の申込に必要な基本情報を収集するフォーム',
      sections: [
        {
          id: '1',
          title: '基本情報',
          order: 1,
          fields: ['lastName', 'firstName', 'email', 'phone'],
          isCollapsible: false,
          isDefaultOpen: true
        },
        {
          id: '2',
          title: '見学希望',
          order: 2,
          fields: ['visitDate', 'visitDepartment', 'visitPurpose'],
          isCollapsible: false,
          isDefaultOpen: true
        }
      ],
      scope: {
        facilities: ['all'],
        departments: ['all'],
        positions: ['all']
      },
      submission: {
        confirmationMessage: '見学申込を受け付けました。',
        notifications: []
      },
      isActive: true,
      isDefault: true,
      version: 1,
      metadata: {
        createdAt: '2024-01-01',
        createdBy: 'system',
        updatedAt: '2024-01-01',
        updatedBy: 'system'
      }
    }
  ])

  const [editingField, setEditingField] = useState<FormFieldConfig | null>(null)
  const [editingTemplate, setEditingTemplate] = useState<FormTemplate | null>(null)
  const [isFieldDialogOpen, setIsFieldDialogOpen] = useState(false)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('fields')

  const fieldTypeIcons = {
    text: <Type className="h-4 w-4" />,
    email: <Mail className="h-4 w-4" />,
    phone: <Phone className="h-4 w-4" />,
    number: <Hash className="h-4 w-4" />,
    date: <Calendar className="h-4 w-4" />,
    select: <ChevronDown className="h-4 w-4" />,
    checkbox: <CheckSquare className="h-4 w-4" />,
    file: <FileText className="h-4 w-4" />
  }

  const FieldEditDialog = () => {
    const [formData, setFormData] = useState<Partial<FormFieldConfig>>(
      editingField || {
        fieldCode: '',
        fieldName: '',
        fieldType: 'text',
        category: 'basic',
        display: {
          label: '',
          placeholder: '',
          order: fields.length + 1,
          width: 'full'
        },
        validation: {
          required: false
        },
        scope: {
          facilities: ['all'],
          positions: ['all'],
          formTypes: ['visitor', 'application']
        },
        isActive: true,
        isSystem: false
      }
    )

    const [options, setOptions] = useState(formData.options || [])

    return (
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingField ? 'フィールド編集' : '新規フィールド作成'}
          </DialogTitle>
          <DialogDescription>
            フォームフィールドの設定を行います
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">基本設定</TabsTrigger>
            <TabsTrigger value="display">表示設定</TabsTrigger>
            <TabsTrigger value="validation">検証設定</TabsTrigger>
            <TabsTrigger value="scope">適用範囲</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fieldCode">フィールドコード*</Label>
                <Input
                  id="fieldCode"
                  value={formData.fieldCode}
                  onChange={(e) => setFormData({ ...formData, fieldCode: e.target.value })}
                  placeholder="例: firstName"
                  disabled={editingField?.isSystem}
                />
              </div>
              <div>
                <Label htmlFor="fieldName">フィールド名*</Label>
                <Input
                  id="fieldName"
                  value={formData.fieldName}
                  onChange={(e) => setFormData({ ...formData, fieldName: e.target.value })}
                  placeholder="例: 名前"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fieldType">フィールドタイプ*</Label>
                <Select
                  value={formData.fieldType}
                  onValueChange={(value: any) => setFormData({ ...formData, fieldType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">テキスト</SelectItem>
                    <SelectItem value="number">数値</SelectItem>
                    <SelectItem value="email">メール</SelectItem>
                    <SelectItem value="phone">電話番号</SelectItem>
                    <SelectItem value="date">日付</SelectItem>
                    <SelectItem value="datetime">日時</SelectItem>
                    <SelectItem value="select">選択リスト</SelectItem>
                    <SelectItem value="multiselect">複数選択</SelectItem>
                    <SelectItem value="radio">ラジオボタン</SelectItem>
                    <SelectItem value="checkbox">チェックボックス</SelectItem>
                    <SelectItem value="textarea">テキストエリア</SelectItem>
                    <SelectItem value="file">ファイル</SelectItem>
                    <SelectItem value="address">住所</SelectItem>
                  </SelectContent>
                </Select>
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
                    <SelectItem value="basic">基本情報</SelectItem>
                    <SelectItem value="contact">連絡先</SelectItem>
                    <SelectItem value="experience">経歴</SelectItem>
                    <SelectItem value="education">学歴</SelectItem>
                    <SelectItem value="skills">スキル</SelectItem>
                    <SelectItem value="documents">書類</SelectItem>
                    <SelectItem value="custom">カスタム</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {['select', 'multiselect', 'radio', 'checkbox'].includes(formData.fieldType!) && (
              <div>
                <Label>選択肢</Label>
                <div className="space-y-2 mt-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={option.label}
                        onChange={(e) => {
                          const newOptions = [...options]
                          newOptions[index] = { ...option, label: e.target.value }
                          setOptions(newOptions)
                        }}
                        placeholder="ラベル"
                      />
                      <Input
                        value={option.value}
                        onChange={(e) => {
                          const newOptions = [...options]
                          newOptions[index] = { ...option, value: e.target.value }
                          setOptions(newOptions)
                        }}
                        placeholder="値"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setOptions(options.filter((_, i) => i !== index))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOptions([...options, {
                      value: '',
                      label: '',
                      order: options.length + 1,
                      isActive: true
                    }])}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    選択肢を追加
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="display" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="label">表示ラベル*</Label>
              <Input
                id="label"
                value={formData.display?.label}
                onChange={(e) => setFormData({
                  ...formData,
                  display: { ...formData.display!, label: e.target.value }
                })}
                placeholder="フォームに表示されるラベル"
              />
            </div>

            <div>
              <Label htmlFor="placeholder">プレースホルダー</Label>
              <Input
                id="placeholder"
                value={formData.display?.placeholder}
                onChange={(e) => setFormData({
                  ...formData,
                  display: { ...formData.display!, placeholder: e.target.value }
                })}
                placeholder="入力欄に表示されるヒント"
              />
            </div>

            <div>
              <Label htmlFor="helpText">ヘルプテキスト</Label>
              <Textarea
                id="helpText"
                value={formData.display?.helpText}
                onChange={(e) => setFormData({
                  ...formData,
                  display: { ...formData.display!, helpText: e.target.value }
                })}
                placeholder="フィールドの説明文"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="width">表示幅</Label>
                <Select
                  value={formData.display?.width}
                  onValueChange={(value: any) => setFormData({
                    ...formData,
                    display: { ...formData.display!, width: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">全幅</SelectItem>
                    <SelectItem value="half">半分</SelectItem>
                    <SelectItem value="third">1/3</SelectItem>
                    <SelectItem value="quarter">1/4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="order">表示順</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.display?.order}
                  onChange={(e) => setFormData({
                    ...formData,
                    display: { ...formData.display!, order: parseInt(e.target.value) }
                  })}
                  min={1}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="validation" className="space-y-4 mt-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="required"
                checked={formData.validation?.required}
                onCheckedChange={(checked) => setFormData({
                  ...formData,
                  validation: { ...formData.validation!, required: checked }
                })}
              />
              <Label htmlFor="required">必須項目</Label>
            </div>

            {formData.fieldType === 'text' || formData.fieldType === 'textarea' ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minLength">最小文字数</Label>
                    <Input
                      id="minLength"
                      type="number"
                      value={formData.validation?.minLength}
                      onChange={(e) => setFormData({
                        ...formData,
                        validation: { ...formData.validation!, minLength: parseInt(e.target.value) }
                      })}
                      min={0}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxLength">最大文字数</Label>
                    <Input
                      id="maxLength"
                      type="number"
                      value={formData.validation?.maxLength}
                      onChange={(e) => setFormData({
                        ...formData,
                        validation: { ...formData.validation!, maxLength: parseInt(e.target.value) }
                      })}
                      min={1}
                    />
                  </div>
                </div>
              </>
            ) : null}

            {formData.fieldType === 'number' ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="min">最小値</Label>
                    <Input
                      id="min"
                      type="number"
                      value={formData.validation?.min}
                      onChange={(e) => setFormData({
                        ...formData,
                        validation: { ...formData.validation!, min: parseInt(e.target.value) }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max">最大値</Label>
                    <Input
                      id="max"
                      type="number"
                      value={formData.validation?.max}
                      onChange={(e) => setFormData({
                        ...formData,
                        validation: { ...formData.validation!, max: parseInt(e.target.value) }
                      })}
                    />
                  </div>
                </div>
              </>
            ) : null}

            {formData.fieldType === 'file' ? (
              <>
                <div>
                  <Label>許可するファイル形式</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['.pdf', '.doc', '.docx', '.jpg', '.png', '.xlsx'].map(ext => (
                      <label key={ext} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.validation?.fileTypes?.includes(ext)}
                          onChange={(e) => {
                            const fileTypes = formData.validation?.fileTypes || []
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                validation: { ...formData.validation!, fileTypes: [...fileTypes, ext] }
                              })
                            } else {
                              setFormData({
                                ...formData,
                                validation: {
                                  ...formData.validation!,
                                  fileTypes: fileTypes.filter(t => t !== ext)
                                }
                              })
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{ext}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="maxFileSize">最大ファイルサイズ (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={formData.validation?.maxFileSize}
                    onChange={(e) => setFormData({
                      ...formData,
                      validation: { ...formData.validation!, maxFileSize: parseInt(e.target.value) }
                    })}
                    min={1}
                    placeholder="10"
                  />
                </div>
              </>
            ) : null}

            <div>
              <Label htmlFor="pattern">検証パターン（正規表現）</Label>
              <Input
                id="pattern"
                value={formData.validation?.pattern}
                onChange={(e) => setFormData({
                  ...formData,
                  validation: { ...formData.validation!, pattern: e.target.value }
                })}
                placeholder="例: ^[0-9]{3}-[0-9]{4}$"
              />
            </div>
          </TabsContent>

          <TabsContent value="scope" className="space-y-4 mt-4">
            <div>
              <Label>適用フォーム</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {['visitor', 'application', 'interview', 'offer'].map(formType => (
                  <label key={formType} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.scope?.formTypes.includes(formType as any)}
                      onChange={(e) => {
                        const formTypes = formData.scope?.formTypes || []
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            scope: { ...formData.scope!, formTypes: [...formTypes, formType as any] }
                          })
                        } else {
                          setFormData({
                            ...formData,
                            scope: {
                              ...formData.scope!,
                              formTypes: formTypes.filter(t => t !== formType)
                            }
                          })
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">
                      {formType === 'visitor' ? '見学申込' :
                       formType === 'application' ? '応募' :
                       formType === 'interview' ? '面接' : '内定'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>適用施設</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.scope?.facilities.includes('all')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          scope: { ...formData.scope!, facilities: ['all'] }
                        })
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">全施設</span>
                </label>
                {!formData.scope?.facilities.includes('all') && (
                  <>
                    {['小原病院', '立神リハビリテーション温泉病院', 'エスポワール立神', '宝寿庵'].map(facility => (
                      <label key={facility} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.scope?.facilities.includes(facility)}
                          onChange={(e) => {
                            const facilities = formData.scope?.facilities || []
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                scope: { ...formData.scope!, facilities: [...facilities, facility] }
                              })
                            } else {
                              setFormData({
                                ...formData,
                                scope: {
                                  ...formData.scope!,
                                  facilities: facilities.filter(f => f !== facility)
                                }
                              })
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{facility}</span>
                      </label>
                    ))}
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">フィールドを有効化</Label>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsFieldDialogOpen(false)}>
            キャンセル
          </Button>
          <Button onClick={() => {
            const fieldToSave = { ...formData, options } as FormFieldConfig
            if (editingField) {
              setFields(prev => prev.map(f => f.id === fieldToSave.id ? fieldToSave : f))
            } else {
              setFields(prev => [...prev, { ...fieldToSave, id: Date.now().toString() }])
            }
            setIsFieldDialogOpen(false)
            setEditingField(null)
          }}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    )
  }

  const FormPreview = ({ template }: { template: FormTemplate }) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            フォームプレビュー
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {template.sections.map(section => (
              <div key={section.id} className="border rounded-lg p-4">
                <h3 className="font-medium text-lg mb-4">{section.title}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {section.fields.map(fieldCode => {
                    const field = fields.find(f => f.fieldCode === fieldCode)
                    if (!field) return null

                    return (
                      <div
                        key={field.id}
                        className={`${
                          field.display.width === 'full' ? 'col-span-2' :
                          field.display.width === 'half' ? 'col-span-1' :
                          'col-span-1'
                        }`}
                      >
                        <Label>
                          {field.display.label}
                          {field.validation.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </Label>
                        {field.fieldType === 'textarea' ? (
                          <Textarea
                            placeholder={field.display.placeholder}
                            disabled
                            className="mt-1"
                          />
                        ) : field.fieldType === 'select' ? (
                          <Select disabled>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder={field.display.placeholder || '選択してください'} />
                            </SelectTrigger>
                          </Select>
                        ) : (
                          <Input
                            type={field.fieldType}
                            placeholder={field.display.placeholder}
                            disabled
                            className="mt-1"
                          />
                        )}
                        {field.display.helpText && (
                          <p className="text-xs text-gray-500 mt-1">{field.display.helpText}</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
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
            <TabsTrigger value="fields">フィールド管理</TabsTrigger>
            <TabsTrigger value="templates">フォームテンプレート</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="fields">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>フォームフィールド</CardTitle>
                <Dialog open={isFieldDialogOpen} onOpenChange={setIsFieldDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingField(null)}>
                      <Plus className="h-4 w-4 mr-2" />
                      新規フィールド
                    </Button>
                  </DialogTrigger>
                  <FieldEditDialog />
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">順序</TableHead>
                    <TableHead>フィールドコード</TableHead>
                    <TableHead>フィールド名</TableHead>
                    <TableHead>タイプ</TableHead>
                    <TableHead>カテゴリー</TableHead>
                    <TableHead>必須</TableHead>
                    <TableHead>状態</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.sort((a, b) => a.display.order - b.display.order).map(field => (
                    <TableRow key={field.id}>
                      <TableCell>{field.display.order}</TableCell>
                      <TableCell className="font-mono text-sm">{field.fieldCode}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {fieldTypeIcons[field.fieldType as keyof typeof fieldTypeIcons]}
                          {field.fieldName}
                          {field.isSystem && (
                            <Badge variant="secondary" className="text-xs">
                              システム
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{field.fieldType}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {field.category === 'basic' ? '基本情報' :
                           field.category === 'contact' ? '連絡先' :
                           field.category === 'experience' ? '経歴' :
                           field.category === 'education' ? '学歴' :
                           field.category === 'skills' ? 'スキル' :
                           field.category === 'documents' ? '書類' : 'カスタム'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {field.validation.required && (
                          <Badge variant="destructive">必須</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={field.isActive ? 'default' : 'secondary'}>
                          {field.isActive ? '有効' : '無効'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingField(field)
                              setIsFieldDialogOpen(true)
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (field.isSystem) {
                                alert('システムフィールドは削除できません')
                                return
                              }
                              if (confirm('このフィールドを削除してもよろしいですか？')) {
                                setFields(prev => prev.filter(f => f.id !== field.id))
                              }
                            }}
                            disabled={field.isSystem}
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

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>フォームテンプレート</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  新規テンプレート
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {templates.map(template => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-lg flex items-center gap-2">
                          {template.templateName}
                          {template.isDefault && (
                            <Badge variant="secondary">デフォルト</Badge>
                          )}
                          <Badge variant="outline">
                            {template.formType === 'visitor' ? '見学申込' :
                             template.formType === 'application' ? '応募' :
                             template.formType === 'interview' ? '面接' : '内定'}
                          </Badge>
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">セクション数:</span> {template.sections.length}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">フィールド数:</span> {
                          template.sections.reduce((acc, section) => acc + section.fields.length, 0)
                        }
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">適用範囲:</span> {
                          template.scope.facilities.join(', ')
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {templates.length > 0 && <FormPreview template={templates[0]} />}
        </TabsContent>
      </Tabs>
    </div>
  )
}