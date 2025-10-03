'use client';

import React from 'react';
import { CareerCourseCode } from '@/types/staff';

export interface FilterState {
  facility: string;
  department: string;
  course: CareerCourseCode | 'all';
  leaderCapableOnly: boolean;
  searchText: string;
}

interface DeploymentFilterProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  facilities: { id: string; name: string }[];
  departments: string[];
}

export default function DeploymentFilter({
  filters,
  onFilterChange,
  facilities,
  departments
}: DeploymentFilterProps) {
  const handleChange = (key: keyof FilterState, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex flex-wrap gap-4 items-end">
        {/* 検索ボックス */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            🔍 キーワード検索
          </label>
          <input
            type="text"
            value={filters.searchText}
            onChange={e => handleChange('searchText', e.target.value)}
            placeholder="氏名、部署、役職で検索..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 施設フィルター */}
        <div className="w-48">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            🏥 施設
          </label>
          <select
            value={filters.facility}
            onChange={e => handleChange('facility', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">全施設</option>
            {facilities.map(f => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* 部署フィルター */}
        <div className="w-48">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            🏢 部署
          </label>
          <select
            value={filters.department}
            onChange={e => handleChange('department', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">全部署</option>
            {departments.map(d => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* コースフィルター */}
        <div className="w-40">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            📊 コース
          </label>
          <select
            value={filters.course}
            onChange={e => handleChange('course', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">全コース</option>
            <option value="A">🔴 Aコース</option>
            <option value="B">🟠 Bコース</option>
            <option value="C">🟡 Cコース</option>
            <option value="D">🟢 Dコース</option>
          </select>
        </div>

        {/* リーダー可能のみチェックボックス */}
        <div className="flex items-center gap-2 pb-2">
          <input
            type="checkbox"
            id="leaderCapable"
            checked={filters.leaderCapableOnly}
            onChange={e => handleChange('leaderCapableOnly', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="leaderCapable" className="text-sm font-medium text-gray-700 cursor-pointer">
            ✅ リーダー可のみ
          </label>
        </div>

        {/* クリアボタン */}
        <div className="pb-2">
          <button
            onClick={() =>
              onFilterChange({
                facility: 'all',
                department: 'all',
                course: 'all',
                leaderCapableOnly: false,
                searchText: ''
              })
            }
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-md transition-colors"
          >
            🔄 クリア
          </button>
        </div>
      </div>
    </div>
  );
}
