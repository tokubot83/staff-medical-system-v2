'use client';

import React from 'react';
import { motion } from 'framer-motion';
import HeatmapCell from './HeatmapCell';

interface HeatmapGridProps {
  phaseData: any;
  phase: number;
  filters: {
    facility: string;
    position: string;
    phase: number;
  };
  onCellClick: (layer: string, course: string, data: any) => void;
}

export default function HeatmapGrid({ phaseData, phase, filters, onCellClick }: HeatmapGridProps) {
  if (!phaseData?.data) {
    return (
      <div className="p-8 text-center text-slate-400">
        データを読み込み中...
      </div>
    );
  }

  const layers = [
    {
      key: 'top',
      label: '上位20%',
      subLabel: '高パフォーマンス層',
      bgColor: 'bg-gradient-to-br from-green-100 to-green-50',
      borderColor: 'border-green-500',
      textColor: 'text-green-800',
      shadow: 'shadow-md shadow-green-200'
    },
    {
      key: 'middle',
      label: '中間60%',
      subLabel: '標準パフォーマンス層',
      bgColor: 'bg-gradient-to-br from-blue-100 to-blue-50',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-800',
      shadow: 'shadow-md shadow-blue-200'
    },
    {
      key: 'low',
      label: '要支援20%',
      subLabel: '育成必要層',
      bgColor: 'bg-gradient-to-br from-amber-100 to-amber-50',
      borderColor: 'border-amber-500',
      textColor: 'text-amber-800',
      shadow: 'shadow-md shadow-amber-200'
    }
  ];

  const courses = [
    {
      key: 'A',
      label: 'Aコース',
      subLabel: 'フルスペック',
      bgColor: 'bg-gradient-to-br from-purple-100 to-purple-50',
      borderColor: 'border-purple-500',
      textColor: 'text-purple-800',
      shadow: 'shadow-md shadow-purple-200'
    },
    {
      key: 'B',
      label: 'Bコース',
      subLabel: '施設内限定',
      bgColor: 'bg-gradient-to-br from-blue-100 to-blue-50',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-800',
      shadow: 'shadow-md shadow-blue-200'
    },
    {
      key: 'C',
      label: 'Cコース',
      subLabel: '部署固定',
      bgColor: 'bg-gradient-to-br from-teal-100 to-teal-50',
      borderColor: 'border-teal-500',
      textColor: 'text-teal-800',
      shadow: 'shadow-md shadow-teal-200'
    },
    {
      key: 'D',
      label: 'Dコース',
      subLabel: '限定勤務',
      bgColor: 'bg-gradient-to-br from-gray-100 to-gray-50',
      borderColor: 'border-gray-500',
      textColor: 'text-gray-700',
      shadow: 'shadow-md shadow-gray-300'
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          人事制度統合ダッシュボード
        </h3>
        <p className="text-gray-600">
          キャリア選択制度導入から人事評価制度導入までの人材マネジメント
        </p>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px] lg:min-w-0">
          {/* Column Headers */}
          <div className="grid grid-cols-5 gap-2 mb-2">
            <div className="p-4 text-center">
              <div className="text-sm font-medium text-gray-600">
                パフォーマンス層
              </div>
            </div>
            {courses.map((course) => (
              <div
                key={course.key}
                className={`p-4 ${course.bgColor} rounded-lg border-2 ${course.borderColor} text-center ${course.shadow || 'shadow-sm'} hover:shadow-lg transition-all duration-200`}
              >
                <div className={`text-sm font-extrabold ${course.textColor} mb-1 tracking-wide`}>
                  {course.label}
                </div>
                <div className={`text-xs ${course.textColor} opacity-80`}>
                  {course.subLabel}
                </div>
              </div>
            ))}
          </div>

          {/* Data Rows */}
          {layers.map((layer, layerIndex) => (
            <motion.div
              key={layer.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: layerIndex * 0.1 }}
              className="grid grid-cols-5 gap-2 mb-2"
            >
              {/* Row Header */}
              <div className={`
                p-4 ${layer.bgColor} rounded-lg border-2 ${layer.borderColor}
                flex flex-col justify-center text-center ${layer.shadow || 'shadow-sm'}
                hover:shadow-lg transition-all duration-200
              `}>
                <div className={`text-base font-extrabold ${layer.textColor} mb-1 tracking-wide`}>
                  {layer.label}
                </div>
                <div className="text-xs text-gray-600">
                  {layer.subLabel}
                </div>
              </div>

              {/* Data Cells */}
              {courses.map((course, courseIndex) => {
                const cellData = phaseData.data[layer.key]?.[course.key];

                if (!cellData) {
                  return (
                    <div
                      key={course.key}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-400"
                    >
                      データなし
                    </div>
                  );
                }

                return (
                  <motion.div
                    key={course.key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: layerIndex * 0.1 + courseIndex * 0.05
                    }}
                  >
                    <HeatmapCell
                      data={cellData}
                      layer={layer.key}
                      course={course.key}
                      phase={phase}
                      onClick={() => onCellClick(layer.key, course.key, cellData)}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Phase-specific Info */}
      {phase >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200 shadow-md"
        >
          <h4 className="text-lg font-semibold text-gray-800 mb-3">
            等級制度による処遇差
          </h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            {courses.map((course) => {
              const courseData = phaseData.courseStructure?.[course.key];
              if (!courseData) return null;

              return (
                <div key={course.key} className="text-center bg-white p-3 rounded-lg border border-gray-200">
                  <div className="text-gray-800 font-medium mb-1">
                    {course.key}コース
                  </div>
                  <div className="text-gray-600">
                    上限{courseData.ceiling}級
                  </div>
                  <div className="text-amber-600 font-semibold">
                    係数×{courseData.coefficient}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}