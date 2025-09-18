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

  // 譁ｽ險ｭ縺ｫ蠢懊§縺溘せ繧ｿ繝・ヵ繝・・繧ｿ繧貞叙蠕・  const staffData = useMemo(() => {
    if (facilityParam === '蟆丞次逞・劼') {
      return Object.values(obaraStaffDatabase);
    } else if (facilityParam === '遶狗･槭Μ繝上ン繝ｪ繝・・繧ｷ繝ｧ繝ｳ貂ｩ豕臥羅髯｢') {
      return Object.values(tachigamiStaffDatabase);
    } else {
      return [...Object.values(obaraStaffDatabase), ...Object.values(tachigamiStaffDatabase)];
    }
  }, [facilityParam]);

  // 驛ｨ鄂ｲ荳隕ｧ繧貞叙蠕・  const departments = useMemo(() => {
    const deptSet = new Set(staffData.map(staff => staff.department));
    return Array.from(deptSet).sort();
  }, [staffData]);

  // 繝輔ぅ繝ｫ繧ｿ繝ｪ繝ｳ繧ｰ縺輔ｌ縺溘せ繧ｿ繝・ヵ
  const filteredStaff = useMemo(() => {
    return staffData.filter(staff => 
      selectedDepartment === 'all' || staff.department === selectedDepartment
    );
  }, [staffData, selectedDepartment]);

  // 9繝懊ャ繧ｯ繧ｹ繧ｰ繝ｪ繝・ラ縺ｮ蛻・｡・  const categorizeStaff = (staff: StaffDetail) => {
    const lastEval = staff.evaluationHistory?.[0] || { performance: 3, growth: 3 };
    const performance = lastEval.performance;
    const potential = lastEval.growth;

    if (performance >= 4.5 && potential >= 4.5) return { box: 1, label: '繧ｹ繧ｿ繝ｼ莠ｺ譚・, color: 'bg-yellow-500' };
    if (performance >= 4.5 && potential >= 3.5) return { box: 2, label: '繝上う繝代ヵ繧ｩ繝ｼ繝槭・', color: 'bg-green-500' };
    if (performance >= 4.5 && potential < 3.5) return { box: 3, label: '蟆る摩螳ｶ', color: 'bg-blue-500' };
    if (performance >= 3.5 && potential >= 4.5) return { box: 4, label: '鬮倥・繝・Φ繧ｷ繝｣繝ｫ', color: 'bg-purple-500' };
    if (performance >= 3.5 && potential >= 3.5) return { box: 5, label: '荳ｭ譬ｸ莠ｺ譚・, color: 'bg-indigo-500' };
    if (performance >= 3.5 && potential < 3.5) return { box: 6, label: '蝣・ｮ溷梛', color: 'bg-gray-500' };
    if (performance < 3.5 && potential >= 4.5) return { box: 7, label: '隕∬ご謌撰ｼ磯ｫ俶ｽ懷惠・・, color: 'bg-orange-500' };
    if (performance < 3.5 && potential >= 3.5) return { box: 8, label: '隕∬ご謌・, color: 'bg-red-400' };
    return { box: 9, label: '隕∵隼蝟・, color: 'bg-red-600' };
  };

  // 9繝懊ャ繧ｯ繧ｹ繧ｰ繝ｪ繝・ラ縺ｮ繝・・繧ｿ貅門ｙ
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

  // 邨ｱ險域ュ蝣ｱ
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
      <CommonHeader title="9繝懊ャ繧ｯ繧ｹ繧ｰ繝ｪ繝・ラ蛻・梵" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 繝倥ャ繝繝ｼ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">9繝懊ャ繧ｯ繧ｹ繧ｰ繝ｪ繝・ラ蛻・梵</h1>
                <p className="text-gray-600 mt-2">繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹﾃ励・繝・Φ繧ｷ繝｣繝ｫ縺ｫ繧医ｋ莠ｺ譚舌・蜿ｯ隕門喧</p>
                {facilityParam && (
                  <p className="text-sm text-gray-500 mt-1">蟇ｾ雎｡譁ｽ險ｭ: {facilityParam}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  onClick={() => setViewMode('grid')}
                  size="sm"
                >
                  繧ｰ繝ｪ繝・ラ陦ｨ遉ｺ
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  onClick={() => setViewMode('list')}
                  size="sm"
                >
                  繝ｪ繧ｹ繝郁｡ｨ遉ｺ
                </Button>
                <button
                  onClick={() => exportToPDF({
                    title: '9繝懊ャ繧ｯ繧ｹ繧ｰ繝ｪ繝・ラ蛻・梵繝ｬ繝昴・繝・,
                    facility: facilityParam,
                    reportType: 'talent-grid',
                    elementId: 'report-content',
                    dateRange: new Date().toLocaleDateString('ja-JP')
                  })}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm pdf-exclude"
                >
                  PDF繝繧ｦ繝ｳ繝ｭ繝ｼ繝・                </button>
              </div>
            </div>
          </div>

          {/* 繝輔ぅ繝ｫ繧ｿ繝ｼ */}
          <Card>
            <CardHeader>
              <CardTitle>繝輔ぅ繝ｫ繧ｿ繝ｼ險ｭ螳・/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">驛ｨ鄂ｲ</label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">蜈ｨ驛ｨ鄂ｲ</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 邨ｱ險医し繝槭Μ繝ｼ */}
          <div className="grid grid-cols-5 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">邱丈ｺｺ謨ｰ</p>
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
                    <p className="text-sm text-gray-600">繧ｹ繧ｿ繝ｼ莠ｺ譚・/p>
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
                    <p className="text-sm text-gray-600">繝上う繝代ヵ繧ｩ繝ｼ繝槭・</p>
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
                    <p className="text-sm text-gray-600">鬮倥・繝・Φ繧ｷ繝｣繝ｫ</p>
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
                    <p className="text-sm text-gray-600">隕∬ご謌舌・謾ｹ蝟・/p>
                    <p className="text-2xl font-bold">{statistics.needDevelopment}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 9繝懊ャ繧ｯ繧ｹ繧ｰ繝ｪ繝・ラ陦ｨ遉ｺ */}
          {viewMode === 'grid' && (
            <Card>
              <CardHeader>
                <CardTitle>9繝懊ャ繧ｯ繧ｹ繧ｰ繝ｪ繝・ラ</CardTitle>
                <CardDescription>
                  邵ｦ霆ｸ・壹・繝・Φ繧ｷ繝｣繝ｫ・域・髟ｷ諤ｧ・峨∵ｨｪ霆ｸ・壹ヱ繝輔か繝ｼ繝槭Φ繧ｹ・育樟蝨ｨ縺ｮ螳溽ｸｾ・・                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* 霆ｸ繝ｩ繝吶Ν */}
                  <div className="absolute -left-16 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium">
                    繝昴ユ繝ｳ繧ｷ繝｣繝ｫ 竊・                  </div>
                  <div className="absolute bottom-[-2rem] left-1/2 -translate-x-1/2 text-sm font-medium">
                    繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ 竊・                  </div>

                  {/* 繧ｰ繝ｪ繝・ラ */}
                  <div className="grid grid-cols-3 gap-2">
                    {[7, 4, 1, 8, 5, 2, 9, 6, 3].map((boxNum) => {
                      const boxDef = {
                        1: { label: '繧ｹ繧ｿ繝ｼ莠ｺ譚・, color: 'bg-yellow-100 border-yellow-500' },
                        2: { label: '繝上う繝代ヵ繧ｩ繝ｼ繝槭・', color: 'bg-green-100 border-green-500' },
                        3: { label: '蟆る摩螳ｶ', color: 'bg-blue-100 border-blue-500' },
                        4: { label: '鬮倥・繝・Φ繧ｷ繝｣繝ｫ', color: 'bg-purple-100 border-purple-500' },
                        5: { label: '荳ｭ譬ｸ莠ｺ譚・, color: 'bg-indigo-100 border-indigo-500' },
                        6: { label: '蝣・ｮ溷梛', color: 'bg-gray-100 border-gray-500' },
                        7: { label: '隕∬ご謌撰ｼ磯ｫ俶ｽ懷惠・・, color: 'bg-orange-100 border-orange-500' },
                        8: { label: '隕∬ご謌・, color: 'bg-red-100 border-red-400' },
                        9: { label: '隕∵隼蝟・, color: 'bg-red-200 border-red-600' }
                      }[boxNum];

                      const staffInBox = gridData[boxNum] || [];

                      return (
                        <div
                          key={boxNum}
                          className={`border-2 rounded-lg p-4 min-h-[150px] ${boxDef?.color}`}
                        >
                          <div className="font-semibold text-sm mb-2">{boxDef?.label}</div>
                          <div className="text-2xl font-bold mb-2">{staffInBox.length}蜷・/div>
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

          {/* 繝ｪ繧ｹ繝郁｡ｨ遉ｺ */}
          {viewMode === 'list' && (
            <Card>
              <CardHeader>
                <CardTitle>莠ｺ譚舌Μ繧ｹ繝・/CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(gridData).map(([boxNum, staffList]) => {
                    if (staffList.length === 0) return null;

                    const boxDef = {
                      '1': { label: '繧ｹ繧ｿ繝ｼ莠ｺ譚・, color: 'bg-yellow-500' },
                      '2': { label: '繝上う繝代ヵ繧ｩ繝ｼ繝槭・', color: 'bg-green-500' },
                      '3': { label: '蟆る摩螳ｶ', color: 'bg-blue-500' },
                      '4': { label: '鬮倥・繝・Φ繧ｷ繝｣繝ｫ', color: 'bg-purple-500' },
                      '5': { label: '荳ｭ譬ｸ莠ｺ譚・, color: 'bg-indigo-500' },
                      '6': { label: '蝣・ｮ溷梛', color: 'bg-gray-500' },
                      '7': { label: '隕∬ご謌撰ｼ磯ｫ俶ｽ懷惠・・, color: 'bg-orange-500' },
                      '8': { label: '隕∬ご謌・, color: 'bg-red-400' },
                      '9': { label: '隕∵隼蝟・, color: 'bg-red-600' }
                    }[boxNum];

                    return (
                      <div key={boxNum}>
                        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                          <Badge className={boxDef?.color}>{boxDef?.label}</Badge>
                          <span className="text-gray-500">({staffList.length}蜷・</span>
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
                                <span>隧穂ｾ｡: {(staff.evaluationHistory?.[0]?.performance || 3).toFixed(1)}</span>
                                <span>謌宣聞諤ｧ: {(staff.evaluationHistory?.[0]?.growth || 3).toFixed(1)}</span>
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

          {/* 繧｢繧ｯ繧ｷ繝ｧ繝ｳ謠先｡・*/}
          <Card>
            <CardHeader>
              <CardTitle>謗ｨ螂ｨ繧｢繧ｯ繧ｷ繝ｧ繝ｳ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {statistics.starTalent > 0 && (
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium">繧ｹ繧ｿ繝ｼ莠ｺ譚舌・豢ｻ逕ｨ</p>
                      <p className="text-sm text-gray-600">
                        {statistics.starTalent}蜷阪・繧ｹ繧ｿ繝ｼ莠ｺ譚舌ｒ邨・ｹ泌､蛾擠縺ｮ繝ｪ繝ｼ繝繝ｼ縺ｨ縺励※豢ｻ逕ｨ縺励・                        蠕檎ｶ呵・ご謌舌・繝ｭ繧ｰ繝ｩ繝縺ｸ縺ｮ蜿ら判繧呈､懆ｨ弱＠縺ｦ縺上□縺輔＞縲・                      </p>
                    </div>
                  </div>
                )}
                {statistics.highPotential > 0 && (
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="font-medium">鬮倥・繝・Φ繧ｷ繝｣繝ｫ莠ｺ譚舌・閧ｲ謌・/p>
                      <p className="text-sm text-gray-600">
                        {statistics.highPotential}蜷阪・鬮倥・繝・Φ繧ｷ繝｣繝ｫ莠ｺ譚舌↓蟇ｾ縺励※縲・                        繧ｹ繝医Ξ繝・メ繧｢繧ｵ繧､繝ｳ繝｡繝ｳ繝医ｄ繝｡繝ｳ繧ｿ繝ｪ繝ｳ繧ｰ繝励Ο繧ｰ繝ｩ繝縺ｮ謠蝉ｾ帙ｒ謗ｨ螂ｨ縺励∪縺吶・                      </p>
                    </div>
                  </div>
                )}
                {statistics.needDevelopment > 0 && (
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-medium">隕∬ご謌舌・謾ｹ蝟・ｺｺ譚舌∈縺ｮ繧ｵ繝昴・繝・/p>
                      <p className="text-sm text-gray-600">
                        {statistics.needDevelopment}蜷阪・隕∬ご謌舌・謾ｹ蝟・ｺｺ譚舌↓蟇ｾ縺励※縲・                        蛟句挨縺ｮ閧ｲ謌占ｨ育判遲門ｮ壹→螳壽悄逧・↑繝輔ぅ繝ｼ繝峨ヰ繝・け縺ｮ螳滓命縺悟ｿ・ｦ√〒縺吶・                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

        </div>
      </div><CategoryTopButton categoryPath="/reports/talent-mapping" categoryName="繧ｿ繝ｬ繝ｳ繝医・繝・ヴ繝ｳ繧ｰ" /></div>
  );
}

export default function TalentGridPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TalentGridContent />
    </Suspense>
  );
}