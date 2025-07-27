'use client';

import React from 'react';
import { demoFlowData } from '@/app/data/demoTalentFlowData';

interface DepartmentFlowStatsProps {
  facility: string;
}

export function DepartmentFlowStats({ facility }: DepartmentFlowStatsProps) {
  // 統計データの計算
  const totalMoves = demoFlowData.reduce((sum, flow) => sum + flow.count, 0);
  const uniqueFromDepts = new Set(demoFlowData.map(f => f.from)).size;
  const uniqueToDepts = new Set(demoFlowData.map(f => f.to)).size;
  
  // 最も多い異動パターン
  const topFlow = demoFlowData.reduce((max, flow) => 
    flow.count > max.count ? flow : max
  , demoFlowData[0]);
  
  return (
    <div className="space-y-4">
      {/* 統計カード */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-blue-600">{totalMoves}</div>
          <div className="text-xs text-gray-600">総異動数</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-green-600">{uniqueFromDepts}</div>
          <div className="text-xs text-gray-600">異動元部署数</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-purple-600">{uniqueToDepts}</div>
          <div className="text-xs text-gray-600">異動先部署数</div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-orange-600">
            {(totalMoves / 12).toFixed(1)}
          </div>
          <div className="text-xs text-gray-600">月平均異動数</div>
        </div>
      </div>
      
      {/* 最多異動パターン */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">最多異動パターン</h4>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="font-medium">{topFlow.from}</span>
              <span className="mx-2 text-gray-400">→</span>
              <span className="font-medium">{topFlow.to}</span>
            </div>
            <div className="text-sm font-semibold text-blue-600">
              {topFlow.count}名
            </div>
          </div>
        </div>
      </div>
      
      {/* 傾向分析 */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">異動傾向</h4>
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-start gap-2">
            <span className="text-green-500">●</span>
            <span>キャリアアップ異動が全体の30%</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500">●</span>
            <span>施設間異動が増加傾向</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-orange-500">●</span>
            <span>専門職の部署間異動が活発化</span>
          </div>
        </div>
      </div>
    </div>
  );
}