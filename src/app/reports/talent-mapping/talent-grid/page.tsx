'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Star, TrendingUp, AlertCircle, Target, Award } from 'lucide-react';
import { obaraStaffDatabase, tachigamiStaffDatabase } from '@/app/data/staffData';
import { StaffDetail } from "@/types/staff";
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { exportToPDF } from '@/utils/pdfExport';

function TalentGridContent() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 施設に応じたスタチE��チE�Eタを取征E  const staffData = useMemo(() => {
    if (facilityParam === '小原痁E��') {
      return Object.values(obaraStaffDatabase);
    } else if (facilityParam === '立神リハビリチE�Eション温泉病院') {
      return Object.values(tachigamiStaffDatabase);
    } else {
      return [...Object.values(obaraStaffDatabase), ...Object.values(tachigamiStaffDatabase)];
    }
  }, [facilityParam]);

  // 部署一覧を取征E  const departments = useMemo(() => {
    const deptSet = new Set(staffData.map(staff => staff.department));
    return Array.from(deptSet).sort();
  }, [staffData]);

  // フィルタリングされたスタチE��
  const filteredStaff = useMemo(() => {
    return staffData.filter(staff => 
      selectedDepartment === 'all' || staff.department === selectedDepartment
    );
  }, [staffData, selectedDepartment]);

  // 9ボックスグリチE��の刁E��E  const categorizeStaff = (staff: StaffDetail) => {
    const lastEval = staff.evaluationHistory?.[0] || { performance: 3, growth: 3 };
    const performance = lastEval.performance;
    const potential = lastEval.growth;

    if (performance >= 4.5 && potential >= 4.5) return { box: 1, label: 'スター人杁E, color: 'bg-yellow-500' };
    if (performance >= 4.5 && potential >= 3.5) return { box: 2, label: 'ハイパフォーマ�E', color: 'bg-green-500' };
    if (performance >= 4.5 && potential < 3.5) return { box: 3, label: '専門家', color: 'bg-blue-500' };
    if (performance >= 3.5 && potential >= 4.5) return { box: 4, label: '高�EチE��シャル', color: 'bg-purple-500' };
    if (performance >= 3.5 && potential >= 3.5) return { box: 5, label: '中核人杁E, color: 'bg-indigo-500' };
    if (performance >= 3.5 && potential < 3.5) return { box: 6, label: '堁E��型', color: 'bg-gray-500' };
    if (performance < 3.5 && potential >= 4.5) return { box: 7, label: '要育成（高潜在�E�E, color: 'bg-orange-500' };
    if (performance < 3.5 && potential >= 3.5) return { box: 8, label: '要育戁E, color: 'bg-red-400' };
    return { box: 9, label: '要改喁E, color: 'bg-red-600' };
  };

  // 9ボックスグリチE��のチE�Eタ準備
  const gridData = useMemo(() => {
    const grid: Record<number, StaffDetail[]> = {};
    for (let i = 1; i <= 9; i++) {
      grid[i] = [];
    }

    filteredStaff.forEach(staff => {
      const category = categorizeStaff(staff);
      grid[category.box].push(staff);
    });

    return grid;
  }, [filteredStaff]);

  // 統計情報
  const statistics = useMemo(() => {
    const stats = {
      total: filteredStaff.length,
      starTalent: gridData[1].length,
      highPerformer: gridData[2].length,
      highPotential: gridData[4].length,
      needDevelopment: gridData[7].length + gridData[8].length + gridData[9].length
    };
    return stats;
  }, [filteredStaff, gridData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="9ボックスグリチE��刁E��" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">9ボックスグリチE��刁E��</h1>
                <p className="text-gray-600 mt-2">パフォーマンス×�EチE��シャルによる人材�E可視化</p>
                {facilityParam && (
                  <p className="text-sm text-gray-500 mt-1">対象施設: {facilityParam}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  onClick={() => setViewMode('grid')}
                  size="sm"
                >
                  グリチE��表示
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  onClick={() => setViewMode('list')}
                  size="sm"
                >
                  リスト表示
                </Button>
                <button
                  onClick={() => exportToPDF({
                    title: '9ボックスグリチE��刁E��レポ�EチE,
                    facility: facilityParam,
                    reportType: 'talent-grid',
                    elementId: 'report-content',
                    dateRange: new Date().toLocaleDateString('ja-JP')
                  })}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm pdf-exclude"
                >
                  PDFダウンローチE                </button>
              </div>
            </div>
          </div>

          {/* フィルター */}
          <Card>
            <CardHeader>
              <CardTitle>フィルター設宁E/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">部署</label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部署</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 統計サマリー */}
          <div className="grid grid-cols-5 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">総人数</p>
                    <p className="text-2xl font-bold">{statistics.total}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">スター人杁E/p>
                    <p className="text-2xl font-bold">{statistics.starTalent}</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">ハイパフォーマ�E</p>
                    <p className="text-2xl font-bold">{statistics.highPerformer}</p>
                  </div>
                  <Award className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">高�EチE��シャル</p>
                    <p className="text-2xl font-bold">{statistics.highPotential}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">要育成�E改喁E/p>
                    <p className="text-2xl font-bold">{statistics.needDevelopment}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 9ボックスグリチE��表示 */}
          {viewMode === 'grid' && (
            <Card>
              <CardHeader>
                <CardTitle>9ボックスグリチE��</CardTitle>
                <CardDescription>
                  縦軸�E��EチE��シャル�E��E長性�E�、横軸�E�パフォーマンス�E�現在の実績�E�E                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* 軸ラベル */}
                  <div className="absolute -left-16 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium">
                    ポテンシャル ↁE                  </div>
                  <div className="absolute bottom-[-2rem] left-1/2 -translate-x-1/2 text-sm font-medium">
                    パフォーマンス ↁE                  </div>

                  {/* グリチE�� */}
                  <div className="grid grid-cols-3 gap-2">
                    {[7, 4, 1, 8, 5, 2, 9, 6, 3].map((boxNum) => {
                      const boxDef = {
                        1: { label: 'スター人杁E, color: 'bg-yellow-100 border-yellow-500' },
                        2: { label: 'ハイパフォーマ�E', color: 'bg-green-100 border-green-500' },
                        3: { label: '専門家', color: 'bg-blue-100 border-blue-500' },
                        4: { label: '高�EチE��シャル', color: 'bg-purple-100 border-purple-500' },
                        5: { label: '中核人杁E, color: 'bg-indigo-100 border-indigo-500' },
                        6: { label: '堁E��型', color: 'bg-gray-100 border-gray-500' },
                        7: { label: '要育成（高潜在�E�E, color: 'bg-orange-100 border-orange-500' },
                        8: { label: '要育戁E, color: 'bg-red-100 border-red-400' },
                        9: { label: '要改喁E, color: 'bg-red-200 border-red-600' }
                      }[boxNum];

                      const staffInBox = gridData[boxNum] || [];

                      return (
                        <div
                          key={boxNum}
                          className={`border-2 rounded-lg p-4 min-h-[150px] ${boxDef?.color}`}
                        >
                          <div className="font-semibold text-sm mb-2">{boxDef?.label}</div>
                          <div className="text-2xl font-bold mb-2">{staffInBox.length}吁E/div>
                          <div className="text-xs text-gray-600">
                            {((staffInBox.length / statistics.total) * 100).toFixed(1)}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* リスト表示 */}
          {viewMode === 'list' && (
            <Card>
              <CardHeader>
                <CardTitle>人材リスチE/CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(gridData).map(([boxNum, staffList]) => {
                    if (staffList.length === 0) return null;

                    const boxDef = {
                      '1': { label: 'スター人杁E, color: 'bg-yellow-500' },
                      '2': { label: 'ハイパフォーマ�E', color: 'bg-green-500' },
                      '3': { label: '専門家', color: 'bg-blue-500' },
                      '4': { label: '高�EチE��シャル', color: 'bg-purple-500' },
                      '5': { label: '中核人杁E, color: 'bg-indigo-500' },
                      '6': { label: '堁E��型', color: 'bg-gray-500' },
                      '7': { label: '要育成（高潜在�E�E, color: 'bg-orange-500' },
                      '8': { label: '要育戁E, color: 'bg-red-400' },
                      '9': { label: '要改喁E, color: 'bg-red-600' }
                    }[boxNum];

                    return (
                      <div key={boxNum}>
                        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                          <Badge className={boxDef?.color}>{boxDef?.label}</Badge>
                          <span className="text-gray-500">({staffList.length}吁E</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {staffList.map(staff => (
                            <div
                              key={staff.id}
                              className="border rounded-lg p-3 hover:shadow-md transition-shadow"
                            >
                              <div className="font-medium">{staff.name}</div>
                              <div className="text-sm text-gray-600">{staff.position}</div>
                              <div className="text-sm text-gray-500">{staff.department}</div>
                              <div className="mt-2 flex justify-between text-xs">
                                <span>評価: {(staff.evaluationHistory?.[0]?.performance || 3).toFixed(1)}</span>
                                <span>成長性: {(staff.evaluationHistory?.[0]?.growth || 3).toFixed(1)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* アクション提桁E*/}
          <Card>
            <CardHeader>
              <CardTitle>推奨アクション</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {statistics.starTalent > 0 && (
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium">スター人材�E活用</p>
                      <p className="text-sm text-gray-600">
                        {statistics.starTalent}名�Eスター人材を絁E��変革のリーダーとして活用し、E                        後継老E��成�Eログラムへの参画を検討してください、E                      </p>
                    </div>
                  </div>
                )}
                {statistics.highPotential > 0 && (
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="font-medium">高�EチE��シャル人材�E育戁E/p>
                      <p className="text-sm text-gray-600">
                        {statistics.highPotential}名�E高�EチE��シャル人材に対して、E                        ストレチE��アサインメントやメンタリングプログラムの提供を推奨します、E                      </p>
                    </div>
                  </div>
                )}
                {statistics.needDevelopment > 0 && (
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-medium">要育成�E改喁E��材へのサポ�EチE/p>
                      <p className="text-sm text-gray-600">
                        {statistics.needDevelopment}名�E要育成�E改喁E��材に対して、E                        個別の育成計画策定と定期皁E��フィードバチE��の実施が忁E��です、E                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

        </div>
      </div><CategoryTopButton categoryPath="/reports/talent-mapping" categoryName="タレント�EチE��ング" /></div>
  );
}

export default function TalentGridPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TalentGridContent />
    </Suspense>
  );
}