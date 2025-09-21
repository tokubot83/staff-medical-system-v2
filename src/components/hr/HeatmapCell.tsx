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
  // ヒートマップカラー配色（元のHTMLのグラデーションを反映）
  const getIntensityClass = (intensity: string, status: string) => {
    // データ形式に基づく配色マッピング
    const intensityMap: { [key: string]: { bg: string; borderColor: string; textColor: string; } } = {
      // 緑系グラデーション（最適な状態）
      'cell-intensity-1': {
        bg: '#e8f5e9',  // 薄い緑
        borderColor: '#c8e6c9',
        textColor: '#2e7d32'
      },
      'cell-intensity-2': {
        bg: '#c8e6c9',  // やや薄い緑
        borderColor: '#a5d6a7',
        textColor: '#2e7d32'
      },
      'cell-intensity-3': {
        bg: '#a5d6a7',  // 中間の緑
        borderColor: '#81c784',
        textColor: '#1b5e20'
      },
      'cell-intensity-4': {
        bg: '#81c784',  // やや濃い緑
        borderColor: '#66bb6a',
        textColor: '#1b5e20'
      },
      'cell-intensity-5': {
        bg: '#66bb6a',  // 濃い緑（最適）
        borderColor: '#4caf50',
        textColor: '#ffffff'
      },

      // オレンジ系グラデーション（要注意）
      'cell-warning-1': {
        bg: '#fff3e0',  // 薄いオレンジ
        borderColor: '#ffe0b2',
        textColor: '#e65100'
      },
      'cell-warning-2': {
        bg: '#ffe0b2',  // 中間のオレンジ
        borderColor: '#ffcc80',
        textColor: '#e65100'
      },
      'cell-warning-3': {
        bg: '#ffcc80',  // 濃いオレンジ
        borderColor: '#ffb74d',
        textColor: '#ffffff'
      },

      // 赤系グラデーション（要対応）
      'cell-alert-1': {
        bg: '#ffebee',  // 薄い赤
        borderColor: '#ffcdd2',
        textColor: '#c62828'
      },
      'cell-alert-2': {
        bg: '#ffcdd2',  // 中間の赤
        borderColor: '#ef9a9a',
        textColor: '#c62828'
      },
      'cell-alert-3': {
        bg: '#ef9a9a',  // 濃い赤（緊急）
        borderColor: '#e57373',
        textColor: '#ffffff'
      }
    };

    // intensityの値に基づいて色を返す
    return intensityMap[intensity] || intensityMap['cell-intensity-3'];
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
      style={{
        backgroundColor: intensityConfig.bg,
        borderColor: intensityConfig.borderColor,
        color: intensityConfig.textColor
      }}
      className={`
        relative w-full p-3 md:p-4 rounded-lg border-2
        hover:shadow-lg hover:scale-105
        transition-all duration-200 cursor-pointer
        min-h-[160px] md:min-h-[180px] flex flex-col
        group
      `}
    >
      {/* Percentage */}
      <div className="mb-2">
        <div className={`text-2xl font-bold mb-1`} style={{ color: intensityConfig.textColor }}>
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