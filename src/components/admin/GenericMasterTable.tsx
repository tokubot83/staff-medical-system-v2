'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MasterRecord, FieldDefinition, ImportResult } from '@/types/masterData';
import { masterDataService } from '@/services/masterDataService';
import { 
  Search, Plus, Edit2, Trash2, Download, Upload, 
  History, Filter, X, Check, AlertCircle, FileDown, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import DataExportImport from '@/components/data-management/DataExportImport';
import { evaluationSystemSeeds } from '@/data/evaluationSystemSeeds';
import { professionSeeds } from '@/data/seeds/professionSeeds';

interface GenericMasterTableProps {
  masterType: string;
  label: string;
  fields: FieldDefinition[];
  searchableFields?: string[];
}

export default function GenericMasterTable({ 
  masterType, 
  label, 
  fields,
  searchableFields = []
}: GenericMasterTableProps) {
  const [records, setRecords] = useState<MasterRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MasterRecord[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRecord, setEditingRecord] = useState<MasterRecord | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showDataManagement, setShowDataManagement] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadRecords();
  }, [masterType]);

  useEffect(() => {
    filterRecords();
  }, [records, searchTerm]);

  const loadRecords = async () => {
    // シードデータから初期データを取得
    const seedData = getInitialSeedData(masterType);

    // 実際のデータベース接続時は以下のコードを使用
    // const data = await masterDataService.getAll(masterType);

    // デモ用：シードデータを使用
    setRecords(seedData);
  };

  // マスタータイプに応じた初期データを取得
  const getInitialSeedData = (type: string): MasterRecord[] => {
    switch (type) {
      case 'evaluationSystem':
        return [{
          id: evaluationSystemSeeds.evaluationSystem.id,
          data: {
            id: evaluationSystemSeeds.evaluationSystem.id,
            systemName: evaluationSystemSeeds.evaluationSystem.systemName,
            version: evaluationSystemSeeds.evaluationSystem.version,
            effectiveFrom: evaluationSystemSeeds.evaluationSystem.effectiveFrom,
            totalScore: evaluationSystemSeeds.evaluationSystem.totalScore,
            technicalScore: 50,
            contributionScore: 50,
            status: evaluationSystemSeeds.evaluationSystem.isActive ? '有効' : '無効',
          },
          metadata: {
            createdAt: '2024-04-01',
            updatedAt: '2024-04-01',
            createdBy: 'システム管理者'
          }
        }];

      case 'scoreComponent':
        return evaluationSystemSeeds.evaluationSystem.scoreComponents.map(comp => ({
          id: comp.id,
          data: {
            id: comp.id,
            categoryName: comp.categoryName,
            score: comp.score,
            evaluationType: comp.evaluationType === 'absolute' ? '絶対評価' : '相対評価',
            subComponents: comp.subComponents?.length || 0,
          },
          metadata: {
            createdAt: '2024-04-01',
            updatedAt: '2024-04-01',
          }
        }));

      case 'contributionItem':
        return evaluationSystemSeeds.contributionItems.map(item => ({
          id: item.id,
          data: {
            id: item.id,
            itemName: item.itemName,
            category: item.category === 'facility' ? '施設' : '法人',
            period: item.period,
            baseScore: item.baseScore,
            elementCount: item.evaluationElements.length,
          },
          metadata: {
            createdAt: '2024-04-01',
            updatedAt: '2024-04-01',
          }
        }));

      case 'gradeConversion':
        return evaluationSystemSeeds.evaluationSystem.gradeConversionRules.map(rule => ({
          id: rule.id,
          data: {
            id: rule.id,
            ruleName: rule.ruleName,
            gradeCount: rule.gradeDefinitions.length,
            sThreshold: rule.gradeDefinitions[0].minPercentile,
            description: rule.gradeDefinitions[0].description,
            targetGroup: rule.ruleName.includes('医師') ? '医師職' :
                        rule.ruleName.includes('新入') ? '新入職員' :
                        rule.ruleName.includes('管理') ? '管理職' :
                        rule.ruleName.includes('法人') ? '全法人' : '施設内',
          },
          metadata: {
            createdAt: '2024-04-01',
            updatedAt: '2024-04-01',
          }
        }));

      case 'matrixDefinition':
        return [{
          id: evaluationSystemSeeds.evaluationSystem.matrixDefinition.id,
          data: {
            id: evaluationSystemSeeds.evaluationSystem.matrixDefinition.id,
            dimensions: evaluationSystemSeeds.evaluationSystem.matrixDefinition.dimensions,
            axisCount: evaluationSystemSeeds.evaluationSystem.matrixDefinition.axes.length,
            ruleCount: evaluationSystemSeeds.evaluationSystem.matrixDefinition.conversionTable.length,
          },
          metadata: {
            createdAt: '2024-04-01',
            updatedAt: '2024-04-01',
          }
        }];

      case 'periodAllocation':
        return evaluationSystemSeeds.periodAllocations.map(period => ({
          id: period.id,
          data: {
            id: period.id,
            systemId: period.systemId,
            allocationPattern: period.allocationPattern,
            periodCount: period.periods.length,
            totalScore: period.periods.reduce((sum, p) => sum + p.score, 0),
            description: period.periods.map(p => `${p.periodName}:${p.score}点`).join(', '),
            facilityRatio: Math.round((period.periods[0]?.facilityScore || 0) / (period.periods[0]?.score || 1) * 100),
            corporateRatio: Math.round((period.periods[0]?.corporateScore || 0) / (period.periods[0]?.score || 1) * 100),
          },
          metadata: {
            createdAt: '2024-04-01',
            updatedAt: '2024-04-01',
          }
        }));

      case 'departmentPermission':
        return evaluationSystemSeeds.departmentPermissions.map(perm => ({
          id: perm.id,
          data: {
            id: perm.id,
            departmentName: perm.departmentName,
            facilityName: perm.facilityName,
            status: perm.status === 'active' ? '有効' : '無効',
            scoreAdjustmentAllowed: perm.customizableItems.scoreAdjustment?.allowed || false,
            scoreAdjustmentRange: perm.customizableItems.scoreAdjustment?.range || 0,
            itemAdditionAllowed: perm.customizableItems.itemAddition?.allowed || false,
            maxAdditionalItems: perm.customizableItems.itemAddition?.maxItems || 0,
            primaryManager: perm.managers.primary,
            validFrom: perm.validFrom,
          },
          metadata: {
            createdAt: '2024-04-01',
            updatedAt: perm.lastModified,
            updatedBy: perm.modifiedBy,
          }
        }));

      case 'profession':
        return professionSeeds.map(profession => ({
          id: profession.id,
          data: {
            id: profession.id,
            code: profession.code,
            name: profession.name,
            category: profession.category,
            requiresLicense: profession.requiresLicense,
            displayOrder: profession.displayOrder,
            isActive: profession.isActive,
          },
          metadata: {
            createdAt: '2025-01-13',
            updatedAt: '2025-01-13',
            createdBy: 'システム管理者'
          }
        }));

      default:
        return [];
    }
  };

  const filterRecords = () => {
    if (!searchTerm) {
      setFilteredRecords(records);
      return;
    }

    const filtered = records.filter(record => {
      return searchableFields.some(field => {
        const value = record.data[field];
        if (!value) return false;
        return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
    });

    setFilteredRecords(filtered);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingRecord(null);
    const defaultData: Record<string, any> = {};
    
    fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        defaultData[field.key] = field.defaultValue;
      } else if (field.type === 'boolean') {
        defaultData[field.key] = false;
      } else if (field.type === 'multiselect') {
        defaultData[field.key] = [];
      } else {
        defaultData[field.key] = '';
      }
    });
    
    setFormData(defaultData);
    setShowEditDialog(true);
  };

  const handleEdit = (record: MasterRecord) => {
    setIsCreating(false);
    setEditingRecord(record);
    setFormData({ ...record.data });
    setShowEditDialog(true);
  };

  const handleSave = async () => {
    try {
      if (isCreating) {
        await masterDataService.create(masterType, formData);
      } else if (editingRecord) {
        await masterDataService.update(masterType, editingRecord.id, formData);
      }
      
      await loadRecords();
      setShowEditDialog(false);
      setFormData({});
      setEditingRecord(null);
    } catch (error) {
      console.error('Error saving record:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('このレコードを削除してもよろしいですか？')) {
      await masterDataService.delete(masterType, id);
      await loadRecords();
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRecords.size === 0) return;
    
    if (confirm(`選択した${selectedRecords.size}件のレコードを削除してもよろしいですか？`)) {
      await masterDataService.bulkDelete(masterType, Array.from(selectedRecords));
      setSelectedRecords(new Set());
      await loadRecords();
    }
  };

  const handleExport = async (format: 'json' | 'csv') => {
    const data = await masterDataService.exportData(masterType, format);
    const blob = new Blob([data], { 
      type: format === 'json' ? 'application/json' : 'text/csv' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${masterType}_${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        let data: any[];
        
        if (file.name.endsWith('.json')) {
          data = JSON.parse(content);
        } else if (file.name.endsWith('.csv')) {
          data = parseCSV(content);
        } else {
          alert('JSONまたはCSVファイルを選択してください');
          return;
        }

        const result = await masterDataService.importData(masterType, data, 'append');
        setImportResult(result);
        setShowImportDialog(true);
        
        if (result.successCount > 0) {
          await loadRecords();
        }
      } catch (error) {
        console.error('Import error:', error);
        alert('インポートに失敗しました');
      }
    };
    
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDataImported = async (importedData: any[]) => {
    try {
      // インポートされたデータをサービスに保存
      const result = await masterDataService.importData(masterType, importedData, 'append');
      if (result.successCount > 0) {
        await loadRecords();
        alert(`${result.successCount}件のデータをインポートしました`);
      }
    } catch (error) {
      console.error('Data import error:', error);
      alert('データの保存に失敗しました');
    }
  };

  const parseCSV = (content: string): any[] => {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      data.push(obj);
    }
    
    return data;
  };

  const renderFormField = (field: FieldDefinition) => {
    const value = formData[field.key];

    if (field.readonly && !isCreating) {
      return (
        <div className="text-sm text-gray-600">
          {value}
        </div>
      );
    }

    switch (field.type) {
      case 'select':
        return (
          <Select
            value={value || ''}
            onValueChange={(val) => setFormData({ ...formData, [field.key]: val })}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder={field.placeholder || '選択してください'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <label key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  checked={(value || []).includes(option.value)}
                  onCheckedChange={(checked) => {
                    const current = value || [];
                    const updated = checked
                      ? [...current, option.value]
                      : current.filter((v: string) => v !== option.value);
                    setFormData({ ...formData, [field.key]: updated });
                  }}
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
            placeholder={field.placeholder}
            className="bg-white"
            rows={3}
          />
        );

      case 'boolean':
        return (
          <Checkbox
            checked={value || false}
            onCheckedChange={(checked) => setFormData({ ...formData, [field.key]: checked })}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value ? Number(e.target.value) : '' })}
            placeholder={field.placeholder}
            className="bg-white"
            min={field.validation?.min}
            max={field.validation?.max}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
            className="bg-white"
          />
        );

      default:
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
            placeholder={field.placeholder}
            className="bg-white"
          />
        );
    }
  };

  const renderCellValue = (field: FieldDefinition, value: any) => {
    if (value == null) return '-';

    switch (field.type) {
      case 'boolean':
        return value ? (
          <Badge className="bg-green-100 text-green-800">有効</Badge>
        ) : (
          <Badge className="bg-gray-100 text-gray-800">無効</Badge>
        );

      case 'select':
        const option = field.options?.find(o => o.value === value);
        return option?.label || value;

      case 'multiselect':
        if (!Array.isArray(value)) return '-';
        return (
          <div className="flex flex-wrap gap-1">
            {value.map((v: string) => {
              const option = field.options?.find(o => o.value === v);
              return (
                <Badge key={v} variant="outline" className="text-xs">
                  {option?.label || v}
                </Badge>
              );
            })}
          </div>
        );

      case 'date':
        return new Date(value).toLocaleDateString('ja-JP');

      default:
        return value.toString();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 bg-white"
            />
          </div>
          {selectedRecords.size > 0 && (
            <Button
              onClick={handleBulkDelete}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              選択した{selectedRecords.size}件を削除
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            新規作成
          </Button>
          
          <div className="flex gap-1">
            <Button
              onClick={() => setShowDataManagement(true)}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Settings className="h-4 w-4" />
              データ管理
            </Button>
            
            <Button
              onClick={() => handleExport('csv')}
              variant="outline"
              size="sm"
            >
              <FileDown className="h-4 w-4 mr-1" />
              CSV
            </Button>
            <Button
              onClick={() => handleExport('json')}
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4 mr-1" />
              JSON
            </Button>
          </div>

          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
          >
            <Upload className="h-4 w-4 mr-2" />
            インポート
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.csv"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedRecords.size === filteredRecords.length && filteredRecords.length > 0}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedRecords(new Set(filteredRecords.map(r => r.id)));
                    } else {
                      setSelectedRecords(new Set());
                    }
                  }}
                />
              </TableHead>
              {fields.filter(f => !f.hidden).map(field => (
                <TableHead key={field.key}>{field.label}</TableHead>
              ))}
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map(record => (
              <TableRow key={record.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRecords.has(record.id)}
                    onCheckedChange={(checked) => {
                      const newSelected = new Set(selectedRecords);
                      if (checked) {
                        newSelected.add(record.id);
                      } else {
                        newSelected.delete(record.id);
                      }
                      setSelectedRecords(newSelected);
                    }}
                  />
                </TableCell>
                {fields.filter(f => !f.hidden).map(field => (
                  <TableCell key={field.key}>
                    {renderCellValue(field, record.data[field.key])}
                  </TableCell>
                ))}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      onClick={() => handleEdit(record)}
                      variant="ghost"
                      size="sm"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(record.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredRecords.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            データがありません
          </div>
        )}
      </div>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreating ? `${label}の新規作成` : `${label}の編集`}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {fields.filter(f => !f.hidden).map(field => (
              <div key={field.key} className="space-y-2">
                <label className="text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderFormField(field)}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              onClick={() => setShowEditDialog(false)}
              variant="outline"
            >
              キャンセル
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>インポート結果</DialogTitle>
          </DialogHeader>
          
          {importResult && (
            <div className="space-y-4">
              <Alert className={importResult.success ? 'border-green-200' : 'border-red-200'}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div>総レコード数: {importResult.totalRecords}</div>
                  <div>成功: {importResult.successCount}</div>
                  <div>エラー: {importResult.errorCount}</div>
                </AlertDescription>
              </Alert>

              {importResult.errors && importResult.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">エラー詳細:</h4>
                  <div className="max-h-40 overflow-y-auto border rounded p-2 text-sm">
                    {importResult.errors.map((error, index) => (
                      <div key={index} className="text-red-600">
                        行 {error.row}: {error.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowImportDialog(false)}>
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* データ管理ダイアログ */}
      <Dialog open={showDataManagement} onOpenChange={setShowDataManagement}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{label} - データ管理</DialogTitle>
          </DialogHeader>
          
          <DataExportImport
            masterType={masterType}
            data={records.map(record => record.data)}
            onDataImported={handleDataImported}
            fieldLabels={fields.reduce((acc, field) => {
              acc[field.key] = field.label;
              return acc;
            }, {} as Record<string, string>)}
          />

          <DialogFooter>
            <Button onClick={() => setShowDataManagement(false)}>
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}