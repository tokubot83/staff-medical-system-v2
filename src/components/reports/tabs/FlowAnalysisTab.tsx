'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, TrendingUp, TrendingDown, GitBranch, Activity } from 'lucide-react';
import { obaraStaffDatabase, tachigamiStaffDatabase } from '@/app/data/staffData';
import { StaffDetail } from "@/types/staff";
import ScrollToTopButton from '@/components/ScrollToTopButton';

interface FlowAnalysisTabProps {
  selectedFacility: string;
}

interface FlowData {
  from: string;
  to: string;
  count: number;
  percentage: number;
}

interface DepartmentStats {
  name: string;
  inflow: number;
  outflow: number;
  net: number;
  current: number;
}

export default function FlowAnalysisTab({ selectedFacility }: FlowAnalysisTabProps) {
  const [timeRange, setTimeRange] = useState('1year');
  const [viewType, setViewType] = useState<'sankey' | 'matrix' | 'stats'>('sankey');

  // 施設に応じたスタッフデータを取得
  const staffData = useMemo(() => {
    if (selectedFacility === '小原病院') {
      return Object.values(obaraStaffDatabase);
    } else if (selectedFacility === '立神リハビリテーション温泉病院') {
      return Object.values(tachigamiStaffDatabase);
    } else {
      return [...Object.values(obaraStaffDatabase), ...Object.values(tachigamiStaffDatabase)];
    }
  }, [selectedFacility]);

  // 部署間の異動データを生成（シミュレーション）
  const flowData = useMemo(() => {
    const flows: FlowData[] = [];
    const departments = Array.from(new Set(staffData.map(s => s.department)));
    
    // シミュレーションデータの生成
    departments.forEach(from => {
      departments.forEach(to => {
        if (from !== to) {
          const randomCount = Math.floor(Math.random() * 10);
          if (randomCount > 0) {
            flows.push({
              from,
              to,
              count: randomCount,
              percentage: 0
            });
          }
        }
      });
    });

    // パーセンテージ計算
    const totalFlow = flows.reduce((sum, flow) => sum + flow.count, 0);
    flows.forEach(flow => {
      flow.percentage = (flow.count / totalFlow) * 100;
    });

    return flows;
  }, [staffData]);

  // 部署別統計
  const departmentStats = useMemo(() => {
    const stats: Record<string, DepartmentStats> = {};
    const departments = Array.from(new Set(staffData.map(s => s.department)));

    departments.forEach(dept => {
      const inflow = flowData.filter(f => f.to === dept).reduce((sum, f) => sum + f.count, 0);
      const outflow = flowData.filter(f => f.from === dept).reduce((sum, f) => sum + f.count, 0);
      const current = staffData.filter(s => s.department === dept).length;

      stats[dept] = {
        name: dept,
        inflow,
        outflow,
        net: inflow - outflow,
        current
      };
    });

    return Object.values(stats);
  }, [staffData, flowData]);

  // キャリアパスパターンの分析
  const careerPathPatterns = useMemo(() => {
    // 一般的なキャリアパスのパターン（シミュレーション）
    return [
      { path: '看護部 → 師長・主任', count: 15, percentage: 25 },
      { path: '医療技術部 → 専門職', count: 12, percentage: 20 },
      { path: 'リハビリ → 訪問リハビリ', count: 10, percentage: 17 },
      { path: '事務 → 医事課', count: 8, percentage: 13 },
      { path: '看護部 → 訪問看護', count: 7, percentage: 12 },
      { path: '薬剤科 → 管理職', count: 5, percentage: 8 },
      { path: 'その他', count: 3, percentage: 5 }
    ];
  }, []);

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">人材フロー分析</h2>
          <p className="text-gray-600">部署間異動とキャリアパスの可視化</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewType === 'sankey' ? 'default' : 'outline'}
            onClick={() => setViewType('sankey')}
            size="sm"
          >
            フロー図
          </Button>
          <Button
            variant={viewType === 'matrix' ? 'default' : 'outline'}
            onClick={() => setViewType('matrix')}
            size="sm"
          >
            マトリックス
          </Button>
          <Button
            variant={viewType === 'stats' ? 'default' : 'outline'}
            onClick={() => setViewType('stats')}
            size="sm"
          >
            統計
          </Button>
        </div>
      </div>

      {/* 期間選択 */}
      <Card>
        <CardHeader>
          <CardTitle>分析期間</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">過去3ヶ月</SelectItem>
              <SelectItem value="6months">過去6ヶ月</SelectItem>
              <SelectItem value="1year">過去1年</SelectItem>
              <SelectItem value="3years">過去3年</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* サマリー統計 */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">総異動数</p>
                <p className="text-2xl font-bold">
                  {flowData.reduce((sum, f) => sum + f.count, 0)}
                </p>
              </div>
              <GitBranch className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">異動率</p>
                <p className="text-2xl font-bold">
                  {((flowData.reduce((sum, f) => sum + f.count, 0) / staffData.length) * 100).toFixed(1)}%
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">最多流入部署</p>
                <p className="text-lg font-bold">
                  {departmentStats.reduce((max, dept) => 
                    dept.inflow > max.inflow ? dept : max
                  ).name}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">最多流出部署</p>
                <p className="text-lg font-bold">
                  {departmentStats.reduce((max, dept) => 
                    dept.outflow > max.outflow ? dept : max
                  ).name}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* フロー図表示 */}
      {viewType === 'sankey' && (
        <Card>
          <CardHeader>
            <CardTitle>部署間異動フロー</CardTitle>
            <CardDescription>
              Sankeyダイアグラムによる人材移動の可視化
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {flowData.slice(0, 10).map((flow, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="text-right w-32 font-medium">{flow.from}</div>
                  <div className="flex-1 relative">
                    <div 
                      className="h-8 bg-blue-200 rounded flex items-center justify-center text-sm font-medium"
                      style={{ width: `${flow.percentage * 5}%`, minWidth: '80px' }}
                    >
                      {flow.count}名
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                  <div className="text-left w-32 font-medium">{flow.to}</div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              ※ 実際の実装では、D3.jsやRechartsを使用してインタラクティブなSankeyダイアグラムを表示します
            </p>
          </CardContent>
        </Card>
      )}

      {/* マトリックス表示 */}
      {viewType === 'matrix' && (
        <Card>
          <CardHeader>
            <CardTitle>異動マトリックス</CardTitle>
            <CardDescription>
              部署間の異動数を表形式で表示
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">From / To</th>
                    {departmentStats.slice(0, 5).map(dept => (
                      <th key={dept.name} className="px-4 py-2 text-center text-xs font-medium text-gray-500">
                        {dept.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {departmentStats.slice(0, 5).map(fromDept => (
                    <tr key={fromDept.name}>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">{fromDept.name}</td>
                      {departmentStats.slice(0, 5).map(toDept => {
                        const flow = flowData.find(f => f.from === fromDept.name && f.to === toDept.name);
                        return (
                          <td key={toDept.name} className="px-4 py-2 text-center text-sm">
                            {fromDept.name === toDept.name ? '-' : flow?.count || 0}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 統計表示 */}
      {viewType === 'stats' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>部署別人材フロー統計</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentStats.map(dept => (
                  <div key={dept.name} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{dept.name}</h4>
                      <Badge variant={dept.net > 0 ? 'default' : dept.net < 0 ? 'destructive' : 'secondary'}>
                        {dept.net > 0 ? '+' : ''}{dept.net}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">現在人数</p>
                        <p className="font-medium">{dept.current}名</p>
                      </div>
                      <div>
                        <p className="text-gray-600">流入</p>
                        <p className="font-medium text-green-600">+{dept.inflow}名</p>
                      </div>
                      <div>
                        <p className="text-gray-600">流出</p>
                        <p className="font-medium text-red-600">-{dept.outflow}名</p>
                      </div>
                      <div>
                        <p className="text-gray-600">純増減</p>
                        <p className={`font-medium ${dept.net > 0 ? 'text-green-600' : dept.net < 0 ? 'text-red-600' : ''}`}>
                          {dept.net > 0 ? '+' : ''}{dept.net}名
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>キャリアパスパターン分析</CardTitle>
              <CardDescription>
                よく見られる異動パターンと昇進経路
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {careerPathPatterns.map((pattern, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{pattern.path}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${pattern.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-16 text-right">
                        {pattern.count}名 ({pattern.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* インサイトと推奨事項 */}
      <Card>
        <CardHeader>
          <CardTitle>分析結果からのインサイト</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <div>
                <p className="font-medium">人材の偏在が発生</p>
                <p className="text-sm text-gray-600">
                  特定部署への人材集中が見られます。適正配置の見直しを検討してください。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
              <div>
                <p className="font-medium">キャリアパスの明確化が必要</p>
                <p className="text-sm text-gray-600">
                  部署間異動のパターンを基に、明確なキャリアパスの設計を推奨します。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
              <div>
                <p className="font-medium">ローテーション制度の活用</p>
                <p className="text-sm text-gray-600">
                  計画的な人材ローテーションにより、組織全体のスキル向上を図れます。
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <ScrollToTopButton />
    </div>
  );
}