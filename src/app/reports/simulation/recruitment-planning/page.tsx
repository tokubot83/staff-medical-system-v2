'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { exportToPDF } from '@/utils/pdfExport';
import { staffDatabase } from '@/app/data/staffData';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

function Content() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  const [selectedFacility, setSelectedFacility] = useState(facilityParam || '全施設');
  const [selectedDepartment, setSelectedDepartment] = useState('全部署');
  const [selectedPosition, setSelectedPosition] = useState('全職種');
  const [targetYear, setTargetYear] = useState(2025);
  const [recruitmentStrategy, setRecruitmentStrategy] = useState('balanced');

  // スタチE��チE�Eタから退職予測を計箁E
  const retirementPrediction = useMemo(() => {
    const staffList = Object.values(staffDatabase).filter(staff => {
      if (selectedFacility !== '全施設' && staff.facility !== selectedFacility) return false;
      if (selectedDepartment !== '全部署' && staff.department !== selectedDepartment) return false;
      if (selectedPosition !== '全職種' && !staff.position.includes(selectedPosition)) return false;
      return true;
    });

    // 年齢別退職予測
    const predictions = [];
    const currentYear = new Date().getFullYear();
    
    for (let year = currentYear; year <= targetYear; year++) {
      const yearData = {
        year: year,
        定年退職: 0,
        自己都合退職: 0,
        早期退職: 0,
        忁E��採用数: 0
      };

      staffList.forEach(staff => {
        const futureAge = staff.age + (year - currentYear);
        
        // 定年退職�E�E5歳�E�E
        if (futureAge >= 65 && futureAge < 66) {
          yearData.定年退職++;
        }
        
        // 自己都合退職予測�E�年齢・ストレス・エンゲージメントから算�E�E�E
        const turnoverRisk = (staff.stressIndex / 100) * 0.3 + 
                           (1 - staff.engagement / 100) * 0.4 +
                           (staff.overtime > 30 ? 0.3 : 0);
        if (Math.random() < turnoverRisk * 0.1) { // 年閁E0%の確玁E��高リスク老E��退職
          yearData.自己都合退職++;
        }
        
        // 早期退職�E�E5歳以上！E
        if (futureAge >= 55 && futureAge < 65 && Math.random() < 0.02) {
          yearData.早期退職++;
        }
      });
      
      yearData.忁E��採用数 = yearData.定年退職 + yearData.自己都合退職 + yearData.早期退職;
      predictions.push(yearData);
    }
    
    return predictions;
  }, [selectedFacility, selectedDepartment, selectedPosition, targetYear]);

  // 採用コスト計箁E
  const recruitmentCost = useMemo(() => {
    const costPerHire = {
      新十E { 採用費: 300000, 研修費: 500000, 初年度人件費: 3000000 },
      中送E { 採用費: 800000, 研修費: 200000, 初年度人件費: 4000000 },
      パ�EチE { 採用費: 100000, 研修費: 50000, 初年度人件費: 2000000 }
    };

    const strategies = {
      balanced: { 新十E 0.4, 中送E 0.4, パ�EチE 0.2 },
      experienced: { 新十E 0.2, 中送E 0.6, パ�EチE 0.2 },
      newgrad: { 新十E 0.7, 中送E 0.2, パ�EチE 0.1 },
      flexible: { 新十E 0.2, 中送E 0.3, パ�EチE 0.5 }
    };

    const strategy = strategies[recruitmentStrategy as keyof typeof strategies];
    const totalRecruits = retirementPrediction.reduce((sum, year) => sum + year.忁E��採用数, 0);

    return Object.entries(strategy).map(([type, ratio]) => {
      const count = Math.round(totalRecruits * ratio);
      const cost = costPerHire[type as keyof typeof costPerHire];
      return {
        type,
        count,
        採用費: cost.採用費 * count,
        研修費: cost.研修費 * count,
        人件費: cost.初年度人件費 * count,
        合訁E (cost.採用費 + cost.研修費 + cost.初年度人件費) * count
      };
    });
  }, [retirementPrediction, recruitmentStrategy]);

  // 部署別忁E��人員
  const departmentNeeds = useMemo(() => {
    const needs = {};
    const staffList = Object.values(staffDatabase).filter(staff => {
      if (selectedFacility !== '全施設' && staff.facility !== selectedFacility) return false;
      return true;
    });

    // 部署別の現在人数と琁E��人数を計箁E
    const departments = [...new Set(staffList.map(s => s.department))];
    return departments.map(dept => {
      const currentStaff = staffList.filter(s => s.department === dept);
      const avgAge = currentStaff.reduce((sum, s) => sum + s.age, 0) / currentStaff.length;
      const retirementRisk = currentStaff.filter(s => s.age >= 60).length;
      
      return {
        department: dept,
        現在人数: currentStaff.length,
        平坁E��齢: Math.round(avgAge),
        退職リスク人数: retirementRisk,
        推奨採用数: Math.ceil(retirementRisk * 1.2) // 20%の余裕を持たせる
      };
    }).sort((a, b) => b.退職リスク人数 - a.退職リスク人数);
  }, [selectedFacility]);

  // フィルター用のリスト取征E
  const facilities = useMemo(() => {
    const facilitySet = new Set(Object.values(staffDatabase).map(s => s.facility));
    return ['全施設', ...Array.from(facilitySet)];
  }, []);

  const departments = useMemo(() => {
    const staffList = selectedFacility === '全施設' 
      ? Object.values(staffDatabase)
      : Object.values(staffDatabase).filter(s => s.facility === selectedFacility);
    const deptSet = new Set(staffList.map(s => s.department));
    return ['全部署', ...Array.from(deptSet)];
  }, [selectedFacility]);

  const positions = ['全職種', '看護師', '看護補助老E, '介護士', '介護福祉士', '琁E��療法士', '作業療法士', '医師', '薬剤師'];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="採用計画シミュレーション" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">採用計画シミュレーション</h1>
            <p className="text-gray-600 mt-2">退職予測に基づく忁E��人員算�Eと採用コスト�E最適匁E/p>
            {facilityParam && (
              <p className="text-sm text-gray-500 mt-1">対象施設: {facilityParam}</p>
            )}
          </div>

          {/* フィルター */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">施設</label>
                <select
                  value={selectedFacility}
                  onChange={(e) => setSelectedFacility(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {facilities.map(facility => (
                    <option key={facility} value={facility}>{facility}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">部署</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">職種</label>
                <select
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {positions.map(position => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">目標年度</label>
                <select
                  value={targetYear}
                  onChange={(e) => setTargetYear(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={2025}>2025年</option>
                  <option value={2026}>2026年</option>
                  <option value={2027}>2027年</option>
                  <option value={2028}>2028年</option>
                  <option value={2029}>2029年</option>
                  <option value={2030}>2030年</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">採用戦略</label>
                <select
                  value={recruitmentStrategy}
                  onChange={(e) => setRecruitmentStrategy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="balanced">バランス垁E/option>
                  <option value="experienced">経験老E��要E/option>
                  <option value="newgrad">新卒重要E/option>
                  <option value="flexible">柔軟雇用重要E/option>
                </select>
              </div>
            </div>
          </div>

          {/* 退職予測グラチE*/}
          <Card>
            <CardHeader>
              <CardTitle>退職予測推移</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={retirementPrediction}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => `${value}名`}
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '6px',
                        padding: '10px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                      labelFormatter={(label) => `${label}年`}
                      wrapperStyle={{ zIndex: 1000 }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="定年退職" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
                    <Area type="monotone" dataKey="自己都合退職" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
                    <Area type="monotone" dataKey="早期退職" stackId="1" stroke="#10B981" fill="#10B981" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">累計定年退職老E��</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {retirementPrediction.reduce((sum, y) => sum + y.定年退職, 0)}吁E
                  </p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">累計�E己都合退職老E��</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {retirementPrediction.reduce((sum, y) => sum + y.自己都合退職, 0)}吁E
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">累計忁E��採用数</p>
                  <p className="text-2xl font-bold text-green-600">
                    {retirementPrediction.reduce((sum, y) => sum + y.忁E��採用数, 0)}吁E
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 採用コスト�E极E*/}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>採用戦略別コスト�E极E/CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={recruitmentCost}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                      <Tooltip 
                        formatter={(value) => {
                          const numValue = typeof value === 'number' ? value : parseFloat(value as string);
                          return `¥${(numValue ?? 0).toLocaleString()}`;
                        }}
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '6px',
                          padding: '10px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        wrapperStyle={{ zIndex: 1000 }}
                      />
                      <Legend />
                      <Bar dataKey="採用費" fill="#3B82F6" />
                      <Bar dataKey="研修費" fill="#10B981" />
                      <Bar dataKey="人件費" fill="#F59E0B" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>採用構�E毁E/CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={recruitmentCost}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ type, count }) => `${type}: ${count}名`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {recruitmentCost.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => `${value}名`}
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '6px',
                          padding: '10px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        wrapperStyle={{ zIndex: 1000 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">総採用コスチE/p>
                  <p className="text-3xl font-bold text-blue-600">
                    ¥{(recruitmentCost.reduce((sum, c) => sum + (c.合訁E?? 0), 0) ?? 0).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 部署別忁E��人員 */}
          <Card>
            <CardHeader>
              <CardTitle>部署別採用忁E��人員</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        部署
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        現在人数
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        平坁E��齢
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        退職リスク人数
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        推奨採用数
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {departmentNeeds.slice(0, 10).map((dept, index) => (
                      <tr key={dept.department} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {dept.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {dept.現在人数}吁E
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {dept.平坁E��齢}歳
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={dept.退職リスク人数 > 2 ? 'text-red-600 font-semibold' : ''}>
                            {dept.退職リスク人数}吁E
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="text-blue-600 font-semibold">{dept.推奨採用数}吁E/span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* 採用推奨アクション */}
          <Card>
            <CardHeader>
              <CardTitle>採用推奨アクション</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">優先採用部署</h4>
                  <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                    {departmentNeeds.slice(0, 3).map(dept => (
                      <li key={dept.department}>
                        {dept.department}: {dept.推奨採用数}名�E採用を推奨�E�退職リスク{dept.退職リスク人数}名！E
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-2">採用時期の提桁E/h4>
                  <p className="text-sm text-amber-800">
                    定年退職老E�E多い3-4月に向けて、前年10月から採用活動を開始することを推奨します、E
                    特に看護師・介護士の採用は競争が激しいため、早期�E活動開始が重要です、E
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">コスト最適化�E提桁E/h4>
                  <p className="text-sm text-green-800">
                    現在の「{recruitmentStrategy === 'balanced' ? 'バランス垁E : 
                            recruitmentStrategy === 'experienced' ? '経験老E��要E :
                            recruitmentStrategy === 'newgrad' ? '新卒重要E : '柔軟雇用重要E}、E
                    戦略での総コスト�E¥{(recruitmentCost.reduce((sum, c) => sum + (c.合訁E?? 0), 0) ?? 0).toLocaleString()}です、E
                    {recruitmentStrategy !== 'flexible' && '柔軟雇用重視戦略に変更することで、コストを20-30%削減できる可能性があります、E}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* アクションボタン */}
          <div className="flex gap-4">
            <button 
              onClick={() => exportToPDF({
                title: '採用計画シミュレーションレポ�EチE,
                facility: selectedFacility,
                reportType: 'recruitment-planning',
                elementId: 'report-content',
                dateRange: `${new Date().getFullYear()}年 - ${targetYear}年`
              })}
              className="pdf-exclude bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              PDFダウンローチE
            </button>
          </div>

        </div>
      </div><CategoryTopButton categoryPath="/reports/simulation" categoryName="シミュレーション" /></div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  );
}