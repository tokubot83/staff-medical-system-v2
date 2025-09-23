'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Save,
  Edit2,
  RotateCcw,
  AlertCircle,
  Check,
  X,
  Settings,
  TrendingUp,
} from 'lucide-react';
import { matrixCorrespondenceTable, type MatrixTableEntry } from '@/data/evaluationMatrixTable';

interface EditableMatrixTableProps {
  department?: string;
  facility?: string;
  isAdmin?: boolean;
}

const getGradeColor = (grade: string): string => {
  const gradeColors: Record<string, string> = {
    'S': '#ff6b6b',
    'A': '#ff9f40',
    'B': '#4ecdc4',
    'C': '#45b7d1',
    'D': '#96ceb4',
    'E': '#dfe6e9',
    '1': '#e74c3c',
    '2': '#e67e22',
    '3': '#f39c12',
    '4': '#f1c40f',
    '5': '#2ecc71',
    '6': '#3498db',
    '7': '#9b59b6',
  };
  return gradeColors[grade] || '#95a5a6';
};

// 給与テーブルマスター
interface SalaryIncreaseMaster {
  [key: string]: {
    rate: number;
    bonus: number;
    description: string;
  };
}

const initialSalaryMaster: SalaryIncreaseMaster = {
  '7': { rate: 1.15, bonus: 1.5, description: 'S+評価：基本給15%増、賞与150%' },
  '6': { rate: 1.10, bonus: 1.3, description: 'S評価：基本給10%増、賞与130%' },
  '5': { rate: 1.05, bonus: 1.1, description: 'A評価：基本給5%増、賞与110%' },
  '4': { rate: 1.02, bonus: 1.0, description: 'B+評価：基本給2%増、賞与100%' },
  '3': { rate: 1.00, bonus: 1.0, description: 'B評価：現状維持、賞与100%' },
  '2': { rate: 0.98, bonus: 0.9, description: 'C評価：基本給2%減、賞与90%' },
  '1': { rate: 0.95, bonus: 0.8, description: 'D評価：基本給5%減、賞与80%' },
};

export const EditableMatrixTable: React.FC<EditableMatrixTableProps> = ({
  department,
  facility,
  isAdmin = false
}) => {
  const [editMode, setEditMode] = useState(false);
  const [matrix, setMatrix] = useState<MatrixTableEntry[]>(matrixCorrespondenceTable);
  const [originalMatrix, setOriginalMatrix] = useState<MatrixTableEntry[]>(matrixCorrespondenceTable);
  const [salaryMaster, setSalaryMaster] = useState<SalaryIncreaseMaster>(initialSalaryMaster);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [selectedTab, setSelectedTab] = useState('matrix');

  // 部署別オーバーライド設定
  const [departmentOverrides, setDepartmentOverrides] = useState<any>({});

  const uniqueFacilityGrades = ['S', 'A', 'B', 'C', 'D'];
  const uniqueCorporateGrades = ['S', 'A', 'B', 'C', 'D'];
  const finalGrades = ['1', '2', '3', '4', '5', '6', '7'];

  // 特定のセルのエントリを取得
  const getEntryForMatrix = (facilityGrade: string, corporateGrade: string): MatrixTableEntry | undefined => {
    // 部署別オーバーライドをチェック
    if (department && departmentOverrides[department]) {
      const override = departmentOverrides[department].find(
        (o: any) => o.facilityGrade === facilityGrade && o.corporateGrade === corporateGrade
      );
      if (override) {
        return override;
      }
    }

    return matrix.find(
      e => e.facilityGrade === facilityGrade && e.corporateGrade === corporateGrade
    );
  };

  // マトリックスのセルを更新
  const handleCellChange = (facilityGrade: string, corporateGrade: string, newGrade: string) => {
    const updated = matrix.map(entry => {
      if (entry.facilityGrade === facilityGrade && entry.corporateGrade === corporateGrade) {
        return {
          ...entry,
          finalGrade: newGrade,
          finalGradeLabel: getFinalGradeLabel(newGrade)
        };
      }
      return entry;
    });
    setMatrix(updated);
    setHasChanges(true);
  };

  // 給与率を更新
  const handleSalaryRateChange = (grade: string, field: 'rate' | 'bonus', value: number) => {
    setSalaryMaster(prev => ({
      ...prev,
      [grade]: {
        ...prev[grade],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  // 部署別オーバーライドを設定
  const handleDepartmentOverride = (facilityGrade: string, corporateGrade: string, newGrade: string) => {
    if (!department) return;

    setDepartmentOverrides(prev => {
      const deptOverrides = prev[department] || [];
      const existingIndex = deptOverrides.findIndex(
        (o: any) => o.facilityGrade === facilityGrade && o.corporateGrade === corporateGrade
      );

      const newOverride = {
        facilityGrade,
        corporateGrade,
        finalGrade: newGrade,
        finalGradeLabel: getFinalGradeLabel(newGrade),
        department,
        facility,
        overrideDate: new Date().toISOString()
      };

      if (existingIndex >= 0) {
        deptOverrides[existingIndex] = newOverride;
      } else {
        deptOverrides.push(newOverride);
      }

      return {
        ...prev,
        [department]: deptOverrides
      };
    });
    setHasChanges(true);
  };

  // 最終評価ラベルを取得
  const getFinalGradeLabel = (grade: string): string => {
    const labels: Record<string, string> = {
      '7': 'S+',
      '6': 'S',
      '5': 'A',
      '4': 'B+',
      '3': 'B',
      '2': 'C',
      '1': 'D'
    };
    return labels[grade] || grade;
  };

  // 保存処理
  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      // ここでAPIコールを実行（実際のDB保存）
      // await saveMatrixDefinition(matrix, salaryMaster, departmentOverrides);

      // デモ用：ローカルストレージに保存
      localStorage.setItem('evaluationMatrix', JSON.stringify(matrix));
      localStorage.setItem('salaryMaster', JSON.stringify(salaryMaster));
      if (department) {
        localStorage.setItem('departmentOverrides', JSON.stringify(departmentOverrides));
      }

      setOriginalMatrix(matrix);
      setSaveStatus('saved');
      setHasChanges(false);
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // リセット処理
  const handleReset = () => {
    setMatrix(originalMatrix);
    setSalaryMaster(initialSalaryMaster);
    setDepartmentOverrides({});
    setHasChanges(false);
  };

  // 初期データロード
  useEffect(() => {
    // ローカルストレージから読み込み（実際はAPIから）
    const savedMatrix = localStorage.getItem('evaluationMatrix');
    const savedSalary = localStorage.getItem('salaryMaster');
    const savedOverrides = localStorage.getItem('departmentOverrides');

    if (savedMatrix) {
      const parsed = JSON.parse(savedMatrix);
      setMatrix(parsed);
      setOriginalMatrix(parsed);
    }
    if (savedSalary) {
      setSalaryMaster(JSON.parse(savedSalary));
    }
    if (savedOverrides) {
      setDepartmentOverrides(JSON.parse(savedOverrides));
    }
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            評価マトリックス編集
            {department && <span className="text-base ml-2">（{department}）</span>}
          </CardTitle>
          <div className="flex items-center gap-2">
            {saveStatus === 'saved' && (
              <Badge className="bg-green-100 text-green-800">
                <Check className="h-3 w-3 mr-1" />
                保存済み
              </Badge>
            )}
            {hasChanges && (
              <Badge className="bg-yellow-100 text-yellow-800">
                <AlertCircle className="h-3 w-3 mr-1" />
                未保存の変更
              </Badge>
            )}
            <Button
              variant={editMode ? 'destructive' : 'outline'}
              size="sm"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? (
                <>
                  <X className="h-4 w-4 mr-1" />
                  編集終了
                </>
              ) : (
                <>
                  <Edit2 className="h-4 w-4 mr-1" />
                  編集開始
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="matrix">マトリックス定義</TabsTrigger>
            <TabsTrigger value="salary">給与連動設定</TabsTrigger>
            <TabsTrigger value="override">部署別カスタマイズ</TabsTrigger>
          </TabsList>

          <TabsContent value="matrix" className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="font-bold text-center">施設\法人</TableHead>
                    {uniqueCorporateGrades.map(grade => (
                      <TableHead key={grade} className="text-center">
                        <Badge style={{ backgroundColor: getGradeColor(grade), color: '#fff' }}>
                          {grade}
                        </Badge>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uniqueFacilityGrades.map(facilityGrade => (
                    <TableRow key={facilityGrade}>
                      <TableCell className="text-center font-bold bg-gray-100">
                        <Badge style={{ backgroundColor: getGradeColor(facilityGrade), color: '#fff' }}>
                          {facilityGrade}
                        </Badge>
                      </TableCell>
                      {uniqueCorporateGrades.map(corporateGrade => {
                        const entry = getEntryForMatrix(facilityGrade, corporateGrade);
                        const isDepartmentOverride = department && departmentOverrides[department]?.some(
                          (o: any) => o.facilityGrade === facilityGrade && o.corporateGrade === corporateGrade
                        );

                        return (
                          <TableCell key={corporateGrade} className="text-center p-2">
                            {editMode ? (
                              <Select
                                value={entry?.finalGrade || ''}
                                onValueChange={(value) =>
                                  department
                                    ? handleDepartmentOverride(facilityGrade, corporateGrade, value)
                                    : handleCellChange(facilityGrade, corporateGrade, value)
                                }
                              >
                                <SelectTrigger className="w-20 mx-auto">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {finalGrades.map(grade => (
                                    <SelectItem key={grade} value={grade}>
                                      <Badge style={{ backgroundColor: getGradeColor(grade), color: '#fff' }}>
                                        {grade} ({getFinalGradeLabel(grade)})
                                      </Badge>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <div className="relative">
                                <Badge
                                  className="text-white font-bold text-base px-3 py-1"
                                  style={{ backgroundColor: getGradeColor(entry?.finalGrade || '') }}
                                >
                                  {entry?.finalGrade}
                                </Badge>
                                {isDepartmentOverride && (
                                  <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs">
                                    部署
                                  </Badge>
                                )}
                              </div>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="salary" className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                各評価グレードに対する給与・賞与の倍率を設定できます。
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              {finalGrades.map(grade => (
                <Card key={grade} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge
                        className="text-white font-bold"
                        style={{ backgroundColor: getGradeColor(grade) }}
                      >
                        {grade} ({getFinalGradeLabel(grade)})
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {salaryMaster[grade]?.description}
                      </span>
                    </div>
                    {editMode && (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`rate-${grade}`}>昇給率</Label>
                          <Input
                            id={`rate-${grade}`}
                            type="number"
                            step="0.01"
                            min="0.5"
                            max="2.0"
                            value={salaryMaster[grade]?.rate || 1}
                            onChange={(e) => handleSalaryRateChange(grade, 'rate', parseFloat(e.target.value))}
                            className="w-20"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`bonus-${grade}`}>賞与率</Label>
                          <Input
                            id={`bonus-${grade}`}
                            type="number"
                            step="0.1"
                            min="0.5"
                            max="2.0"
                            value={salaryMaster[grade]?.bonus || 1}
                            onChange={(e) => handleSalaryRateChange(grade, 'bonus', parseFloat(e.target.value))}
                            className="w-20"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm">
                    <span>
                      基本給: <strong>{((salaryMaster[grade]?.rate - 1) * 100).toFixed(0)}%</strong>
                      {salaryMaster[grade]?.rate >= 1 ? ' 増' : ' 減'}
                    </span>
                    <span>
                      賞与: <strong>{(salaryMaster[grade]?.bonus * 100).toFixed(0)}%</strong>
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="override" className="space-y-4">
            {department ? (
              <>
                <Alert>
                  <Settings className="h-4 w-4" />
                  <AlertDescription>
                    {department}専用のマトリックス設定を行えます。
                    法人標準と異なる評価基準を適用する場合に使用してください。
                  </AlertDescription>
                </Alert>

                {departmentOverrides[department]?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">現在のカスタマイズ</h4>
                    {departmentOverrides[department].map((override: any, index: number) => (
                      <Card key={index} className="p-3">
                        <div className="flex items-center justify-between">
                          <span>
                            施設内: <Badge>{override.facilityGrade}</Badge> ×
                            法人内: <Badge>{override.corporateGrade}</Badge> →
                            <Badge style={{ backgroundColor: getGradeColor(override.finalGrade), color: '#fff' }}>
                              {override.finalGrade}
                            </Badge>
                          </span>
                          {editMode && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setDepartmentOverrides(prev => ({
                                  ...prev,
                                  [department]: prev[department].filter((_: any, i: number) => i !== index)
                                }));
                                setHasChanges(true);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {!departmentOverrides[department]?.length && (
                  <Alert>
                    <AlertDescription>
                      カスタマイズ設定はありません。マトリックス定義タブで編集を開始してください。
                    </AlertDescription>
                  </Alert>
                )}
              </>
            ) : (
              <Alert>
                <AlertDescription>
                  部署別カスタマイズは部署管理者のみ利用可能です。
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>

        {editMode && hasChanges && (
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-1" />
              リセット
            </Button>
            <Button onClick={handleSave} disabled={saveStatus === 'saving'}>
              <Save className="h-4 w-4 mr-1" />
              {saveStatus === 'saving' ? '保存中...' : '変更を保存'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};