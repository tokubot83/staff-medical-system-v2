'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HeatmapCellProps {
  data: {
    percent: string;
    count: string;
    status: string;
    intensity: string;
    priority: string;
    action: string;
    gradeRange?: string;
    gradeCeiling?: string;
    evaluation?: Record<string, number>;
  };
  layer: string;
  course: string;
  phase: number;
  onClick: () => void;
}

export default function HeatmapCell({ data, layer, course, phase, onClick }: HeatmapCellProps) {
  // 組織図風パステルカラー配色
  const getIntensityClass = (intensity: string, status: string) => {
    // ステータスに基づく特別な配色
    if (status === 'alert') {
      return {
        bg: 'bg-red-50',
        border: 'border-red-400',
        text: 'text-red-800',
        glow: 'shadow-red-200'
      };
    }
    if (status === 'caution') {
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-400',
        text: 'text-amber-800',
        glow: 'shadow-amber-200'
      };
    }

    // Intensityレベルに基づく配色（組織図風のパステルカラー）
    const intensityLevels = {
      '1': { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-700', glow: 'shadow-gray-200' },
      '2': { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-800', glow: 'shadow-blue-200' },
      '3': { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-800', glow: 'shadow-green-200' },
      '4': { bg: 'bg-indigo-50', border: 'border-indigo-300', text: 'text-indigo-800', glow: 'shadow-indigo-200' },
      '5': { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-800', glow: 'shadow-purple-200' }
    };

    return intensityLevels[intensity as keyof typeof intensityLevels] || intensityLevels['3'];
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      ideal: {
        label: '理想的',
        labelBg: 'bg-emerald-100',
        labelText: 'text-emerald-700',
        labelBorder: 'border-emerald-200'
      },
      acceptable: {
        label: '許容範囲',
        labelBg: 'bg-blue-100',
        labelText: 'text-blue-700',
        labelBorder: 'border-blue-200'
      },
      caution: {
        label: '要注意',
        labelBg: 'bg-amber-100',
        labelText: 'text-amber-700',
        labelBorder: 'border-amber-200'
      },
      alert: {
        label: '要対応',
        labelBg: 'bg-red-100',
        labelText: 'text-red-700',
        labelBorder: 'border-red-200'
      }
    };
    return configs[status as keyof typeof configs] || configs.acceptable;
  };

  const getPriorityConfig = (priority: string) => {
    const configs = {
      high: { bg: 'bg-red-100', border: 'border-red-300', text: '高', textColor: 'text-red-700' },
      medium: { bg: 'bg-amber-100', border: 'border-amber-300', text: '中', textColor: 'text-amber-700' },
      low: { bg: 'bg-blue-100', border: 'border-blue-300', text: '低', textColor: 'text-blue-700' }
    };
    return configs[priority as keyof typeof configs] || configs.low;
  };

  const intensityConfig = getIntensityClass(data.intensity, data.status);
  const statusConfig = getStatusConfig(data.status);
  const priorityConfig = getPriorityConfig(data.priority);

  // 評価分布バーの生成（Phase 3のみ）
  const renderEvaluationBar = () => {
    if (phase !== 3 || !data.evaluation || Object.keys(data.evaluation).length === 0) {
      return null;
    }

    const evaluationColors = {
      'S+': '#d32f2f',
      'S': '#f57c00',
      'A+': '#fbc02d',
      'A': '#689f38',
      'B': '#1976d2',
      'C': '#757575',
      'D': '#b71c1c'
    };

    return (
      <div className="mt-3 mb-2">
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden flex">
          {Object.entries(data.evaluation).map(([grade, percentage]) => {
            if (percentage <= 0) return null;
            return (
              <div
                key={grade}
                style={{
                  width: `${percentage}%`,
                  backgroundColor: evaluationColors[grade as keyof typeof evaluationColors]
                }}
                className="h-full"
                title={`${grade}: ${percentage}%`}
              />
            );
          })}
        </div>
        <div className="flex justify-center mt-1 space-x-1">
          {Object.entries(data.evaluation).map(([grade, percentage]) => {
            if (percentage <= 0) return null;
            return (
              <span
                key={grade}
                className="text-xs text-slate-400"
                style={{ color: evaluationColors[grade as keyof typeof evaluationColors] }}
              >
                {grade}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, z: 10 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative w-full p-3 md:p-4 rounded-lg border-2
        ${intensityConfig.bg} ${intensityConfig.border}
        hover:shadow-md hover:${intensityConfig.glow}
        transition-all duration-200 cursor-pointer
        min-h-[160px] md:min-h-[180px] flex flex-col
        group
      `}
    >
      {/* Percentage */}
      <div className="mb-2">
        <div className={`text-2xl font-bold ${intensityConfig.text} mb-1`}>
          {data.percent}
        </div>
        <div className="text-sm text-gray-600">
          {data.count}
        </div>
      </div>

      {/* Grade Range (Phase 2+) */}
      {phase >= 2 && data.gradeRange && (
        <div className="mb-2 text-xs text-gray-500 italic">
          想定{data.gradeRange}
        </div>
      )}

      {/* Evaluation Distribution (Phase 3) */}
      {renderEvaluationBar()}

      {/* Status Badge */}
      <div className="mb-2">
        <span className={`
          inline-block px-2 py-1 rounded text-xs font-semibold
          ${statusConfig.labelBg} ${statusConfig.labelBorder} ${statusConfig.labelText} border
        `}>
          {statusConfig.label}
        </span>
      </div>

      {/* Action & Priority */}
      <div className="mt-auto">
        <div className="text-xs text-gray-600 leading-tight">
          <span className={`
            inline-block px-2 py-0.5 rounded mr-1 text-xs font-semibold
            ${priorityConfig.bg} ${priorityConfig.border} ${priorityConfig.textColor} border
          `}>
            {priorityConfig.text}
          </span>
          {data.action}
        </div>
      </div>

      {/* Click Indicator */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
      </div>
    </motion.button>
  );
}