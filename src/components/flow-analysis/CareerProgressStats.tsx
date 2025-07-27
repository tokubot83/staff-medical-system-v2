'use client';

import React from 'react';

interface CareerProgressStatsProps {
  facility: string;
}

export function CareerProgressStats({ facility }: CareerProgressStatsProps) {
  // キャリア進捗の統計データ
  const stats = {
    averagePromotionTime: 3.5,
    promotionRate: 68,
    careerStagnation: 12,
    specialization: 35,
    managementTrack: 15,
    expertTrack: 20
  };
  
  return (
    <div className="space-y-6">
      {/* 主要指標 */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">キャリア進捗指標</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600">{stats.averagePromotionTime}年</div>
            <div className="text-xs text-gray-600">平均昇進期間</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600">{stats.promotionRate}%</div>
            <div className="text-xs text-gray-600">昇進達成率</div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-orange-600">{stats.careerStagnation}%</div>
            <div className="text-xs text-gray-600">キャリア停滞率</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-purple-600">{stats.specialization}%</div>
            <div className="text-xs text-gray-600">専門資格取得率</div>
          </div>
        </div>
      </div>
      
      {/* キャリアトラック分布 */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">キャリアトラック選択</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">管理職コース</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${stats.managementTrack}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700 w-10 text-right">{stats.managementTrack}%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">専門職コース</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${stats.expertTrack}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700 w-10 text-right">{stats.expertTrack}%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">一般職継続</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gray-500 h-2 rounded-full"
                  style={{ width: `${100 - stats.managementTrack - stats.expertTrack}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700 w-10 text-right">
                {100 - stats.managementTrack - stats.expertTrack}%
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 推奨アクション */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">推奨アクション</h4>
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-start gap-2">
            <span className="text-yellow-500">⚠️</span>
            <span>キャリア停滞者への面談実施</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500">📈</span>
            <span>昇進候補者の育成計画策定</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500">🎯</span>
            <span>専門資格取得支援の強化</span>
          </div>
        </div>
      </div>
    </div>
  );
}