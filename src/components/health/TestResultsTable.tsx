'use client';

/**
 * 検査結果テーブルコンポーネント
 * Created: 2025-09-29
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Droplets,
  Heart,
  Activity,
  Beaker,
  Microscope,
  Eye,
  Ear,
  Stethoscope,
  FileX2
} from 'lucide-react';

interface TestDetail {
  category: string;
  itemName: string;
  value: string;
  unit?: string;
  status: string;
  referenceMin?: number;
  referenceMax?: number;
}

interface TestResultsTableProps {
  details: TestDetail[];
}

export function TestResultsTable({ details }: TestResultsTableProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  // カテゴリ別にグループ化
  const groupedDetails = details.reduce((acc, detail) => {
    if (!acc[detail.category]) {
      acc[detail.category] = [];
    }
    acc[detail.category].push(detail);
    return acc;
  }, {} as Record<string, TestDetail[]>);

  // カテゴリ情報
  const categoryInfo = {
    BLOOD: { label: '血液検査', icon: Droplets, color: 'text-red-500' },
    URINE: { label: '尿検査', icon: Beaker, color: 'text-yellow-500' },
    LIVER: { label: '肝機能', icon: Activity, color: 'text-green-500' },
    LIPID: { label: '脂質', icon: Heart, color: 'text-purple-500' },
    KIDNEY: { label: '腎機能', icon: Microscope, color: 'text-blue-500' },
    VISION: { label: '視力', icon: Eye, color: 'text-indigo-500' },
    HEARING: { label: '聴力', icon: Ear, color: 'text-pink-500' },
    CHEST_XRAY: { label: '胸部X線', icon: FileX2, color: 'text-gray-500' },
    ECG: { label: '心電図', icon: Stethoscope, color: 'text-orange-500' },
  };

  // ステータスバッジの色
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NORMAL':
        return <Badge className="bg-green-100 text-green-800">正常</Badge>;
      case 'ATTENTION':
        return <Badge className="bg-yellow-100 text-yellow-800">要注意</Badge>;
      case 'ABNORMAL':
        return <Badge className="bg-red-100 text-red-800">異常</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  // 基準値との比較表示
  const getReferenceDisplay = (detail: TestDetail) => {
    if (!detail.referenceMin && !detail.referenceMax) {
      return '-';
    }

    let range = '';
    if (detail.referenceMin !== undefined && detail.referenceMax !== undefined) {
      range = `${detail.referenceMin} - ${detail.referenceMax}`;
    } else if (detail.referenceMin !== undefined) {
      range = `≥ ${detail.referenceMin}`;
    } else if (detail.referenceMax !== undefined) {
      range = `≤ ${detail.referenceMax}`;
    }

    return range;
  };

  // 値の表示（異常値は強調）
  const getValueDisplay = (detail: TestDetail) => {
    const isAbnormal = detail.status === 'ABNORMAL' || detail.status === 'ATTENTION';
    return (
      <span className={isAbnormal ? 'font-bold text-red-600' : ''}>
        {detail.value} {detail.unit && <span className="text-muted-foreground">{detail.unit}</span>}
      </span>
    );
  };

  // 全検査結果の表示
  const renderAllResults = () => (
    <div className="space-y-6">
      {Object.entries(groupedDetails).map(([category, items]) => {
        const info = categoryInfo[category as keyof typeof categoryInfo];
        if (!info) return null;

        const Icon = info.icon;

        return (
          <Card key={category}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Icon className={`w-5 h-5 ${info.color}`} />
                {info.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>項目</TableHead>
                    <TableHead>結果</TableHead>
                    <TableHead>基準値</TableHead>
                    <TableHead>判定</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.itemName}</TableCell>
                      <TableCell>{getValueDisplay(item)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {getReferenceDisplay(item)}
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  // 異常値のみ表示
  const renderAbnormalResults = () => {
    const abnormalItems = details.filter(d => d.status === 'ABNORMAL' || d.status === 'ATTENTION');

    if (abnormalItems.length === 0) {
      return (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-green-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg font-medium">すべて正常範囲内です</p>
            <p className="text-sm text-muted-foreground mt-1">異常値・要注意項目はありません</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            異常値・要注意項目（{abnormalItems.length}項目）
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>カテゴリ</TableHead>
                <TableHead>項目</TableHead>
                <TableHead>結果</TableHead>
                <TableHead>基準値</TableHead>
                <TableHead>判定</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {abnormalItems.map((item, index) => {
                const info = categoryInfo[item.category as keyof typeof categoryInfo];
                return (
                  <TableRow key={index} className="bg-red-50">
                    <TableCell>
                      {info && (
                        <div className="flex items-center gap-1">
                          <info.icon className={`w-4 h-4 ${info.color}`} />
                          <span className="text-sm">{info.label}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{item.itemName}</TableCell>
                    <TableCell>{getValueDisplay(item)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {getReferenceDisplay(item)}
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="all">全項目</TabsTrigger>
          <TabsTrigger value="abnormal">異常値のみ</TabsTrigger>
          <TabsTrigger value="summary">サマリー</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {renderAllResults()}
        </TabsContent>

        <TabsContent value="abnormal" className="mt-4">
          {renderAbnormalResults()}
        </TabsContent>

        <TabsContent value="summary" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(groupedDetails).map(([category, items]) => {
              const info = categoryInfo[category as keyof typeof categoryInfo];
              if (!info) return null;

              const Icon = info.icon;
              const abnormalCount = items.filter(i => i.status !== 'NORMAL').length;

              return (
                <Card key={category}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gray-50`}>
                          <Icon className={`w-6 h-6 ${info.color}`} />
                        </div>
                        <div>
                          <p className="font-medium">{info.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {items.length}項目中
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {abnormalCount > 0 ? (
                          <>
                            <p className="text-2xl font-bold text-red-600">{abnormalCount}</p>
                            <p className="text-xs text-red-600">異常</p>
                          </>
                        ) : (
                          <>
                            <p className="text-2xl font-bold text-green-600">✓</p>
                            <p className="text-xs text-green-600">正常</p>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}