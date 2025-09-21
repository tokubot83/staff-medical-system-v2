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
  // ヒートマップカラー配色（鮮やかさを強化）
  const getIntensityClass = (intensity: string, status: string) => {
    // データ形式に基づく配色マッピング（彩度を上げて鮮やかに）
    const intensityMap: { [key: string]: { bg: string; bgGradient: string; borderColor: string; textColor: string; shadow: string; } } = {
      // 緑系グラデーション（最適な状態）
      'cell-intensity-1': {
        bg: '#e0f7e9',
        bgGradient: 'linear-gradient(135deg, #e0f7e9 0%, #d4f4dd 100%)',
        borderColor: '#a8e6a3',
        textColor: '#2e7d32',
        shadow: '0 2px 4px rgba(76, 175, 80, 0.1)'
      },
      'cell-intensity-2': {
        bg: '#c3efc3',
        bgGradient: 'linear-gradient(135deg, #c3efc3 0%, #b0e8b0 100%)',
        borderColor: '#81d67f',
        textColor: '#2e7d32',
        shadow: '0 2px 6px rgba(76, 175, 80, 0.15)'
      },
      'cell-intensity-3': {
        bg: '#a1e3a1',
        bgGradient: 'linear-gradient(135deg, #a1e3a1 0%, #8dd68d 100%)',
        borderColor: '#66c466',
        textColor: '#1b5e20',
        shadow: '0 3px 8px rgba(76, 175, 80, 0.2)'
      },
      'cell-intensity-4': {
        bg: '#7ed67e',
        bgGradient: 'linear-gradient(135deg, #7ed67e 0%, #69c969 100%)',
        borderColor: '#4caf50',
        textColor: '#ffffff',
        shadow: '0 4px 10px rgba(76, 175, 80, 0.25)'
      },
      'cell-intensity-5': {
        bg: '#5fcf60',
        bgGradient: 'linear-gradient(135deg, #5fcf60 0%, #4caf50 100%)',
        borderColor: '#388e3c',
        textColor: '#ffffff',
        shadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
      },

      // オレンジ系グラデーション（要注意）
      'cell-warning-1': {
        bg: '#fff0d9',
        bgGradient: 'linear-gradient(135deg, #fff0d9 0%, #ffe8c4 100%)',
        borderColor: '#ffc947',
        textColor: '#e65100',
        shadow: '0 2px 4px rgba(255, 152, 0, 0.1)'
      },
      'cell-warning-2': {
        bg: '#ffd8a8',
        bgGradient: 'linear-gradient(135deg, #ffd8a8 0%, #ffc77d 100%)',
        borderColor: '#ffb300',
        textColor: '#d84315',
        shadow: '0 3px 8px rgba(255, 152, 0, 0.2)'
      },
      'cell-warning-3': {
        bg: '#ffb74d',
        bgGradient: 'linear-gradient(135deg, #ffb74d 0%, #ff9800 100%)',
        borderColor: '#f57c00',
        textColor: '#ffffff',
        shadow: '0 4px 10px rgba(255, 152, 0, 0.3)'
      },

      // 赤系グラデーション（要対応）
      'cell-alert-1': {
        bg: '#ffe5e8',
        bgGradient: 'linear-gradient(135deg, #ffe5e8 0%, #ffd5da 100%)',
        borderColor: '#ff8a95',
        textColor: '#c62828',
        shadow: '0 2px 4px rgba(244, 67, 54, 0.1)'
      },
      'cell-alert-2': {
        bg: '#ffb4bc',
        bgGradient: 'linear-gradient(135deg, #ffb4bc 0%, #ff99a3 100%)',
        borderColor: '#f44336',
        textColor: '#b71c1c',
        shadow: '0 3px 8px rgba(244, 67, 54, 0.2)'
      },
      'cell-alert-3': {
        bg: '#ef7b7b',
        bgGradient: 'linear-gradient(135deg, #ef7b7b 0%, #e57373 100%)',
        borderColor: '#d32f2f',
        textColor: '#ffffff',
        shadow: '0 4px 12px rgba(244, 67, 54, 0.35)'
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
        background: intensityConfig.bgGradient || intensityConfig.bg,
        borderColor: intensityConfig.borderColor,
        color: intensityConfig.textColor,
        boxShadow: intensityConfig.shadow,
        borderWidth: '2px'
      }}
      className={`
        relative w-full p-3 md:p-4 rounded-lg
        hover:shadow-xl hover:scale-105 hover:brightness-105
        transition-all duration-200 cursor-pointer
        min-h-[160px] md:min-h-[180px] flex flex-col
        group backdrop-blur-sm
      `}
    >
      {/* Percentage */}
      <div className="mb-2">
        <div className={`text-3xl font-extrabold mb-1 drop-shadow-sm`} style={{ color: intensityConfig.textColor }}>
          {data.percent}
        </div>
        <div className="text-sm font-medium" style={{ color: intensityConfig.textColor, opacity: 0.85 }}>
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