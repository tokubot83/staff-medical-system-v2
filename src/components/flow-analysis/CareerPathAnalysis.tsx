'use client';

import React, { useState } from 'react';
import { positionSummary } from '@/app/data/demoTalentFlowData';

interface CareerPathAnalysisProps {
  facility: string;
}

export function CareerPathAnalysis({ facility }: CareerPathAnalysisProps) {
  const [selectedPosition, setSelectedPosition] = useState('看護師');
  
  // 職種別のキャリアパスデータ
  const careerPaths = {
    '看護師': [
      { level: 'レベル1', title: '新人看護師', years: '0-1年', count: 25, percentage: 16.7 },
      { level: 'レベル2', title: '一人前看護師', years: '2-3年', count: 35, percentage: 23.3 },
      { level: 'レベル3', title: '中堅看護師', years: '4-7年', count: 45, percentage: 30.0 },
      { level: 'レベル4', title: '達人看護師', years: '8-15年', count: 30, percentage: 20.0 },
      { level: 'レベル5', title: 'エキスパート', years: '15年以上', count: 15, percentage: 10.0 }
    ],
    '理学療法士': [
      { level: '新人', title: '新人PT', years: '0-2年', count: 8, percentage: 32.0 },
      { level: '中堅', title: '中堅PT', years: '3-7年', count: 10, percentage: 40.0 },
      { level: 'ベテラン', title: 'ベテランPT', years: '8年以上', count: 7, percentage: 28.0 }
    ],
    '作業療法士': [
      { level: '新人', title: '新人OT', years: '0-2年', count: 6, percentage: 30.0 },
      { level: '中堅', title: '中堅OT', years: '3-7年', count: 8, percentage: 40.0 },
      { level: 'ベテラン', title: 'ベテランOT', years: '8年以上', count: 6, percentage: 30.0 }
    ],
    '介護福祉士': [
      { level: '初級', title: '初級介護福祉士', years: '0-2年', count: 10, percentage: 28.6 },
      { level: '中級', title: '中級介護福祉士', years: '3-5年', count: 15, percentage: 42.8 },
      { level: '上級', title: '上級介護福祉士', years: '6年以上', count: 10, percentage: 28.6 }
    ]
  };
  
  const currentPath = careerPaths[selectedPosition as keyof typeof careerPaths] || careerPaths['看護師'];
  
  return (
    <div className="space-y-6">
      {/* 職種選択 */}
      <div className="flex gap-2 flex-wrap">
        {Object.keys(positionSummary).map(position => (
          <button
            key={position}
            onClick={() => setSelectedPosition(position)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedPosition === position
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {position}
          </button>
        ))}
      </div>
      
      {/* キャリアパス図 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">{selectedPosition}のキャリアパス</h4>
        
        <div className="space-y-4">
          {currentPath.map((stage, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-24 text-right">
                <div className="text-sm font-semibold text-gray-700">{stage.level}</div>
                <div className="text-xs text-gray-500">{stage.years}</div>
              </div>
              
              <div className="flex-1">
                <div className="relative">
                  <div className="h-12 bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center px-4"
                      style={{ width: `${stage.percentage}%` }}
                    >
                      <span className="text-white text-sm font-medium">{stage.title}</span>
                    </div>
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-700">
                    {stage.count}名 ({stage.percentage}%)
                  </div>
                </div>
              </div>
              
              {index < currentPath.length - 1 && (
                <div className="text-2xl text-gray-400">↓</div>
              )}
            </div>
          ))}
        </div>
        
        {/* キャリアパスの特徴 */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h5 className="text-sm font-semibold text-gray-700 mb-2">キャリアパスの特徴</h5>
          <ul className="space-y-1 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-500">●</span>
              <span>平均昇進期間: {selectedPosition === '看護師' ? '3-4年' : '2-3年'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">●</span>
              <span>管理職への移行率: {selectedPosition === '看護師' ? '15%' : '10%'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500">●</span>
              <span>専門資格取得率: {selectedPosition === '看護師' ? '35%' : '25%'}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}