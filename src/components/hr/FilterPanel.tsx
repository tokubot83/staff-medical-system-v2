'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { facilityData, positionData } from '@/lib/hr/heatmapData';

interface FilterPanelProps {
  selectedFilters: {
    facility: string;
    position: string;
    phase: number;
  };
  onFiltersChange: (filters: any) => void;
}

export default function FilterPanel({ selectedFilters, onFiltersChange }: FilterPanelProps) {
  const handleFilterChange = (filterType: string, value: string | number) => {
    onFiltersChange({
      ...selectedFilters,
      [filterType]: value
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Filters Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Phase Filter */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              フェーズ
            </label>

            <div className="flex gap-2">
              {[1, 2, 3].map((phase) => (
                <button
                  key={phase}
                  type="button"
                  onClick={() => handleFilterChange('phase', phase)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${selectedFilters.phase === phase
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                    }
                  `}
                >
                  第{phase}段階
                </button>
              ))}
            </div>
          </div>

          {/* Facility Filter */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              施設
            </label>
            <div className="relative">
              <select
                value={selectedFilters.facility}
                onChange={(e) => handleFilterChange('facility', e.target.value)}
                className="
                  w-full px-4 py-2 bg-white border border-gray-300 rounded-lg
                  text-gray-700 text-sm focus:outline-none focus:border-blue-500
                  focus:ring-2 focus:ring-blue-500/20 transition-all duration-200
                  appearance-none cursor-pointer
                "
              >
                {Object.entries(facilityData).map(([key, data]) => (
                  <option key={key} value={key} className="bg-white text-gray-700">
                    {data.name} ({data.count}名)
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Position Filter */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              職種
            </label>
            <div className="relative">
              <select
                value={selectedFilters.position}
                onChange={(e) => handleFilterChange('position', e.target.value)}
                className="
                  w-full px-4 py-2 bg-white border border-gray-300 rounded-lg
                  text-gray-700 text-sm focus:outline-none focus:border-blue-500
                  focus:ring-2 focus:ring-blue-500/20 transition-all duration-200
                  appearance-none cursor-pointer
                "
              >
                {Object.entries(positionData).map(([key, data]) => (
                  <option key={key} value={key} className="bg-white text-gray-700">
                    {data.name} ({data.count}名)
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          {/* Reset Filters */}
          <motion.button
            onClick={() => onFiltersChange({ facility: 'all', position: 'all', phase: 1 })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="
              px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg
              text-gray-700 text-sm hover:bg-gray-200 hover:text-gray-900
              transition-all duration-200
            "
          >
            リセット
          </motion.button>

          {/* Export Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="
              px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700
              text-white text-sm rounded-lg shadow-lg shadow-blue-500/25
              hover:shadow-xl hover:shadow-blue-500/40
              transition-all duration-200
            "
          >
            エクスポート
          </motion.button>
        </div>
      </div>

      {/* Filter Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="text-gray-600">
            現在の表示:
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg border border-blue-200">
              第{selectedFilters.phase}段階
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg border border-green-200">
              {facilityData[selectedFilters.facility as keyof typeof facilityData]?.name}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg border border-purple-200">
              {positionData[selectedFilters.position as keyof typeof positionData]?.name}
            </span>
          </div>
          <div className="ml-auto text-gray-600">
            対象職員数: {calculateTargetCount(selectedFilters)}名
          </div>
        </div>
      </div>

      {/* Advanced Filters Toggle (Future Enhancement) */}
      <div className="mt-4 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="
            px-4 py-2 text-sm text-gray-500 hover:text-gray-700
            border border-dashed border-gray-300 hover:border-gray-400
            rounded-lg transition-all duration-200
          "
        >
          高度なフィルター（準備中）
        </motion.button>
      </div>
    </motion.div>
  );
}

// ターゲット職員数を計算する関数
function calculateTargetCount(filters: { facility: string; position: string; phase: number }): number {
  const facilityCount = facilityData[filters.facility as keyof typeof facilityData]?.count || 500;
  const positionCount = positionData[filters.position as keyof typeof positionData]?.count || 500;

  if (filters.facility === 'all' && filters.position === 'all') {
    return 500;
  } else if (filters.facility === 'all') {
    return positionCount;
  } else if (filters.position === 'all') {
    return facilityCount;
  } else {
    // 施設と職種の両方が指定された場合の概算
    const facilityRatio = facilityCount / 500;
    const positionRatio = positionCount / 500;
    return Math.round(500 * facilityRatio * positionRatio);
  }
}