'use client';

import React from 'react';
import { demoFlowData, demoDepartmentStats } from '@/app/data/demoTalentFlowData';

interface DepartmentFlowChartProps {
  facility: string;
}

export function DepartmentFlowChart({ facility }: DepartmentFlowChartProps) {
  // 施設でフィルタリング（今回のデモでは全データを使用）
  const flowData = demoFlowData;
  
  // 最大値を取得（スケーリング用）
  const maxCount = Math.max(...flowData.map(d => d.count));
  
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        過去1年間の部署間異動実績
      </div>
      
      {/* フローの可視化 */}
      <div className="space-y-3">
        {flowData.map((flow, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-32 text-right text-sm font-medium text-gray-700">
              {flow.from}
            </div>
            
            <div className="flex-1 relative">
              <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500 flex items-center justify-center text-white text-xs font-semibold"
                  style={{ width: `${(flow.count / maxCount) * 100}%` }}
                >
                  {flow.count}名
                </div>
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                →
              </div>
            </div>
            
            <div className="w-32 text-left text-sm font-medium text-gray-700">
              {flow.to}
            </div>
            
            <div className="w-16 text-right text-sm text-gray-500">
              {flow.percentage}%
            </div>
          </div>
        ))}
      </div>
      
      {/* 凡例 */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div>※ 矢印の太さは異動人数を表します</div>
          <div>全体の{flowData.reduce((sum, f) => sum + f.percentage, 0).toFixed(1)}%が異動</div>
        </div>
      </div>
    </div>
  );
}