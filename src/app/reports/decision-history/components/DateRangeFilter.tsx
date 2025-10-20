'use client';

import React, { useState } from 'react';
import { format, subDays } from 'date-fns';

interface DateRangeFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateRangeChange: (start: Date | null, end: Date | null) => void;
}

interface PresetOption {
  label: string;
  days: number | null;  // null = 全期間
}

const PRESETS: PresetOption[] = [
  { label: '1週間', days: 7 },
  { label: '1ヶ月', days: 30 },
  { label: '3ヶ月', days: 90 },
  { label: '6ヶ月', days: 180 },
  { label: '1年', days: 365 },
  { label: '全期間', days: null },
];

export function DateRangeFilter({
  startDate,
  endDate,
  onDateRangeChange,
}: DateRangeFilterProps) {
  const [customStart, setCustomStart] = useState(
    startDate ? format(startDate, 'yyyy-MM-dd') : ''
  );
  const [customEnd, setCustomEnd] = useState(
    endDate ? format(endDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
  );

  const handlePresetClick = (days: number | null) => {
    if (days === null) {
      // 全期間
      onDateRangeChange(null, null);
      setCustomStart('');
      setCustomEnd(format(new Date(), 'yyyy-MM-dd'));
    } else {
      const end = new Date();
      const start = subDays(end, days);
      onDateRangeChange(start, end);
      setCustomStart(format(start, 'yyyy-MM-dd'));
      setCustomEnd(format(end, 'yyyy-MM-dd'));
    }
  };

  const handleApplyCustomRange = () => {
    if (!customStart || !customEnd) {
      alert('開始日と終了日を両方入力してください');
      return;
    }

    const start = new Date(customStart);
    const end = new Date(customEnd);

    if (start > end) {
      alert('開始日は終了日より前の日付を指定してください');
      return;
    }

    onDateRangeChange(start, end);
  };

  const handleReset = () => {
    onDateRangeChange(null, null);
    setCustomStart('');
    setCustomEnd(format(new Date(), 'yyyy-MM-dd'));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-800">表示期間</h3>
      </div>

      {/* プリセット期間 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          プリセット:
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePresetClick(preset.days)}
              className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* カスタム期間 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          カスタム期間:
        </label>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs text-gray-600 mb-1">開始日</label>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs text-gray-600 mb-1">終了日</label>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 適用/リセットボタン */}
      <div className="flex gap-3">
        <button
          onClick={handleApplyCustomRange}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          適用
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          リセット
        </button>
      </div>

      {/* 現在のフィルタ状態表示 */}
      {(startDate || endDate) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            現在の表示期間:{' '}
            <span className="font-semibold">
              {startDate ? format(startDate, 'yyyy年M月d日') : '全期間の開始'}
              {' 〜 '}
              {endDate ? format(endDate, 'yyyy年M月d日') : '現在'}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
