'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Search,
  X,
  Grid3x3,
  List,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { matrixCorrespondenceTable as defaultMatrixTable, type MatrixTableEntry } from '@/data/evaluationMatrixTable';

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

const getSalaryImpactIcon = (impact?: string) => {
  if (!impact) return <Minus className="h-4 w-4" />;
  if (impact.includes('大幅増') || impact.includes('15%')) return <TrendingUp className="h-4 w-4 text-green-600" />;
  if (impact.includes('増額') || impact.includes('10%') || impact.includes('5%')) return <TrendingUp className="h-4 w-4 text-blue-600" />;
  if (impact.includes('減額') || impact.includes('凍結')) return <TrendingDown className="h-4 w-4 text-red-600" />;
  return <Minus className="h-4 w-4" />;
};

export const MatrixCorrespondenceTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedFacilityGrade, setSelectedFacilityGrade] = useState<string>('');
  const [selectedCorporateGrade, setSelectedCorporateGrade] = useState<string>('');
  const [matrixCorrespondenceTable, setMatrixCorrespondenceTable] = useState<MatrixTableEntry[]>(defaultMatrixTable);
  const [hasCustomMatrix, setHasCustomMatrix] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  // ローカルストレージから編集されたマトリックスを読み込み
  useEffect(() => {
    const loadCustomMatrix = () => {
      const savedMatrix = localStorage.getItem('evaluationMatrix');
      if (savedMatrix) {
        try {
          const parsedMatrix = JSON.parse(savedMatrix);
          setMatrixCorrespondenceTable(parsedMatrix);
          setHasCustomMatrix(true);
          setLastUpdateTime(new Date());
        } catch (error) {
          console.error('Failed to load custom matrix:', error);
        }
      }
    };

    // 初回読み込み
    loadCustomMatrix();

    // ストレージイベントをリッスン（他のタブでの変更を検知）
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'evaluationMatrix') {
        loadCustomMatrix();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // 定期的に更新をチェック（同一タブでの変更用）
    const interval = setInterval(loadCustomMatrix, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const filteredEntries = useMemo(() => {
    return matrixCorrespondenceTable.filter(entry => {
      const matchesSearch = searchTerm === '' ||
        Object.values(entry).some(value =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesFacility = selectedFacilityGrade === '' ||
        entry.facilityGrade === selectedFacilityGrade;

      const matchesCorporate = selectedCorporateGrade === '' ||
        entry.corporateGrade === selectedCorporateGrade;

      return matchesSearch && matchesFacility && matchesCorporate;
    });
  }, [searchTerm, selectedFacilityGrade, selectedCorporateGrade]);

  const uniqueFacilityGrades = ['S', 'A', 'B', 'C', 'D'];
  const uniqueCorporateGrades = ['S', 'A', 'B', 'C', 'D'];
  const finalGrades = ['1', '2', '3', '4', '5', '6', '7'];

  const getEntryForMatrix = (facility: string, corporate: string): MatrixTableEntry | undefined => {
    return matrixCorrespondenceTable.find(
      e => e.facilityGrade === facility && e.corporateGrade === corporate
    );
  };

  // デフォルトに戻す
  const resetToDefault = () => {
    localStorage.removeItem('evaluationMatrix');
    setMatrixCorrespondenceTable(defaultMatrixTable);
    setHasCustomMatrix(false);
    setLastUpdateTime(null);
  };

  return (
    <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-800">
              評価マトリックス対応表
            </CardTitle>
            {hasCustomMatrix && (
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  カスタマイズ済み
                </Badge>
                {lastUpdateTime && (
                  <span className="text-xs text-gray-500">
                    更新: {lastUpdateTime.toLocaleTimeString()}
                  </span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetToDefault}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  デフォルトに戻す
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {hasCustomMatrix && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                このマトリックスは編集されています。「マトリックス編集」タブで変更内容を確認・編集できます。
              </AlertDescription>
            </Alert>
          )}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="検索（評価、説明、従業員タイプなど）"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Tabs value={viewMode} onValueChange={setViewMode} className="w-auto">
              <TabsList>
                <TabsTrigger value="grid" className="flex items-center gap-2">
                  <Grid3x3 className="h-4 w-4" />
                  マトリックス
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  リスト
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {viewMode === 'grid' ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">マトリックスビュー</h3>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="font-bold text-center">
                        施設\法人
                      </TableHead>
                      {uniqueCorporateGrades.map(grade => (
                        <TableHead
                          key={grade}
                          className="text-center cursor-pointer hover:bg-gray-200 transition-colors"
                          onClick={() => setSelectedCorporateGrade(
                            selectedCorporateGrade === grade ? '' : grade
                          )}
                        >
                          <Badge
                            variant={selectedCorporateGrade === grade ? 'default' : 'outline'}
                            style={{
                              backgroundColor: selectedCorporateGrade === grade
                                ? getGradeColor(grade)
                                : 'transparent',
                              color: selectedCorporateGrade === grade ? '#fff' : '#000',
                            }}
                          >
                            {grade}
                          </Badge>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {uniqueFacilityGrades.map(facilityGrade => (
                      <TableRow key={facilityGrade}>
                        <TableCell
                          className="text-center font-bold bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
                          onClick={() => setSelectedFacilityGrade(
                            selectedFacilityGrade === facilityGrade ? '' : facilityGrade
                          )}
                        >
                          <Badge
                            variant={selectedFacilityGrade === facilityGrade ? 'default' : 'outline'}
                            style={{
                              backgroundColor: selectedFacilityGrade === facilityGrade
                                ? getGradeColor(facilityGrade)
                                : 'transparent',
                              color: selectedFacilityGrade === facilityGrade ? '#fff' : '#000',
                            }}
                          >
                            {facilityGrade}
                          </Badge>
                        </TableCell>
                        {uniqueCorporateGrades.map(corporateGrade => {
                          const entry = getEntryForMatrix(facilityGrade, corporateGrade);
                          const isHighlighted =
                            (selectedFacilityGrade === '' || selectedFacilityGrade === facilityGrade) &&
                            (selectedCorporateGrade === '' || selectedCorporateGrade === corporateGrade);

                          return (
                            <TableCell
                              key={corporateGrade}
                              className={`text-center cursor-pointer hover:bg-blue-50 transition-all ${
                                isHighlighted ? 'opacity-100' : 'opacity-50'
                              }`}
                              style={{
                                backgroundColor: isHighlighted ? '#fff' : '#f8f9fa',
                              }}
                            >
                              {entry && (
                                <div
                                  className="inline-flex flex-col items-center"
                                  title={`説明: ${entry.description}\n従業員タイプ: ${entry.employeeType}${entry.actionRequired ? `\n必要な対応: ${entry.actionRequired}` : ''}${entry.salaryImpact ? `\n給与影響: ${entry.salaryImpact}` : ''}`}
                                >
                                  <Badge
                                    className="text-white font-bold text-base px-3 py-1"
                                    style={{
                                      backgroundColor: getGradeColor(entry.finalGrade),
                                    }}
                                  >
                                    {entry.finalGrade}
                                  </Badge>
                                  <div className="mt-1">
                                    {getSalaryImpactIcon(entry.salaryImpact)}
                                  </div>
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
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">凡例</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {finalGrades.map(grade => {
                    const sampleEntry = matrixCorrespondenceTable.find(e => e.finalGrade === grade);
                    return (
                      <div key={grade} className="flex items-center gap-2">
                        <Badge
                          className="text-white font-bold"
                          style={{
                            backgroundColor: getGradeColor(grade),
                          }}
                        >
                          {grade}
                        </Badge>
                        <span className="text-sm">
                          {sampleEntry?.finalGradeLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                リストビュー ({filteredEntries.length}件)
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead>施設内</TableHead>
                      <TableHead>法人内</TableHead>
                      <TableHead>最終</TableHead>
                      <TableHead>優先度</TableHead>
                      <TableHead>従業員タイプ</TableHead>
                      <TableHead>給与影響</TableHead>
                      <TableHead>昇進可能性</TableHead>
                      <TableHead>説明</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.map((entry, index) => (
                      <TableRow
                        key={index}
                        className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                      >
                        <TableCell>
                          <Badge
                            className="text-white"
                            style={{
                              backgroundColor: getGradeColor(entry.facilityGrade),
                            }}
                          >
                            {entry.facilityGrade}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className="text-white"
                            style={{
                              backgroundColor: getGradeColor(entry.corporateGrade),
                            }}
                          >
                            {entry.corporateGrade}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className="text-white font-bold"
                            style={{
                              backgroundColor: getGradeColor(entry.finalGrade),
                            }}
                          >
                            {entry.finalGrade} ({entry.finalGradeLabel})
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold">
                          {entry.priority}
                        </TableCell>
                        <TableCell>{entry.employeeType}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getSalaryImpactIcon(entry.salaryImpact)}
                            <span className="text-sm">{entry.salaryImpact || '-'}</span>
                          </div>
                        </TableCell>
                        <TableCell>{entry.promotionPotential || '-'}</TableCell>
                        <TableCell>
                          <span
                            className="block max-w-[200px] truncate"
                            title={entry.description}
                          >
                            {entry.description}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          <Separator className="my-6" />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">統計サマリー</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {finalGrades.map(grade => {
                const count = matrixCorrespondenceTable.filter(e => e.finalGrade === grade).length;
                const percentage = ((count / matrixCorrespondenceTable.length) * 100).toFixed(1);
                return (
                  <Card key={grade} className="text-center">
                    <CardContent className="py-3">
                      <Badge
                        className="text-white font-bold mb-2"
                        style={{
                          backgroundColor: getGradeColor(grade),
                        }}
                      >
                        {grade}
                      </Badge>
                      <div className="text-lg font-semibold">{count}パターン</div>
                      <div className="text-sm text-gray-500">
                        {percentage}%
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
  );
};