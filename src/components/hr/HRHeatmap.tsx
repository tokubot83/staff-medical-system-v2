'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhaseSelector from './PhaseSelector';
import HeatmapGrid from './HeatmapGrid';
import EvaluationSystemInfo from './EvaluationSystemInfo';
import HiddenTalentsDisplay from './HiddenTalentsDisplay';
import { phaseData, evaluationSystem } from '@/lib/hr/heatmapData';

interface HRHeatmapProps {
  filters: {
    facility: string;
    position: string;
    phase: number;
  };
  onCellClick: (layer: string, course: string, data: any) => void;
  onPhaseChange?: (phase: number) => void;
}

export default function HRHeatmap({ filters, onCellClick, onPhaseChange }: HRHeatmapProps) {
  const [currentPhase, setCurrentPhase] = useState(filters.phase);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (filters.phase !== currentPhase) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentPhase(filters.phase);
        setAnimating(false);
      }, 300);
    }
  }, [filters.phase, currentPhase]);

  const handlePhaseChange = (phase: number) => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentPhase(phase);
      setAnimating(false);
    }, 300);
    // 親コンポーネントにフェーズ変更を伝える
    if (onPhaseChange) {
      onPhaseChange(phase);
    }
  };

  const currentData = phaseData[currentPhase];

  return (
    <div className="space-y-8">
      {/* Phase Selector */}
      <PhaseSelector
        currentPhase={currentPhase}
        onPhaseChange={handlePhaseChange}
      />

      {/* Phase Information */}
      <motion.div
        key={`phase-info-${currentPhase}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 p-6 shadow-md"
      >
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {currentData?.title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {currentData?.description}
          </p>
        </div>

        {/* Course Structure (Phase 2+) */}
        {currentPhase >= 2 && currentData?.courseStructure && (
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(currentData.courseStructure).map(([course, data]) => (
              <div
                key={course}
                className="bg-white rounded-xl border-2 border-gray-200 p-4 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-xl font-bold text-gray-800 mb-1">
                  {course}コース
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  {data.label}
                </div>
                <div className="space-y-2">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                    <div className="text-xs text-gray-600">等級上限</div>
                    <div className="text-lg font-bold text-blue-700">
                      {data.ceiling}級
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
                    <div className="text-xs text-gray-600">給与係数</div>
                    <div className="text-lg font-bold text-amber-700">
                      ×{data.coefficient}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Heatmap Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`heatmap-${currentPhase}-${filters.facility}-${filters.position}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: animating ? 0.5 : 1, scale: animating ? 0.98 : 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl border-2 border-gray-200 shadow-md overflow-hidden"
        >
          <HeatmapGrid
            phaseData={currentData}
            phase={currentPhase}
            filters={filters}
            onCellClick={onCellClick}
          />
        </motion.div>
      </AnimatePresence>

      {/* Evaluation System Info (Phase 3) */}
      {currentPhase === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <EvaluationSystemInfo evaluationSystem={evaluationSystem} />
        </motion.div>
      )}

      {/* Hidden Talents (Phase 3) */}
      {currentPhase === 3 && currentData?.hiddenTalents && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <HiddenTalentsDisplay talents={currentData.hiddenTalents} />
        </motion.div>
      )}

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Status Legend */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">適合度</h4>
          <div className="space-y-3">
            {[
              { key: 'ideal', color: 'bg-green-400', borderColor: 'border-green-400', label: '理想的' },
              { key: 'acceptable', color: 'bg-blue-400', borderColor: 'border-blue-400', label: '許容範囲' },
              { key: 'caution', color: 'bg-amber-400', borderColor: 'border-amber-400', label: '要注意' },
              { key: 'alert', color: 'bg-red-400', borderColor: 'border-red-400', label: '要対応' }
            ].map(({ key, color, borderColor, label }) => (
              <div key={key} className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded ${color} border ${borderColor}`}></div>
                <span className="text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Legend */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">優先度</h4>
          <div className="space-y-3">
            {[
              { key: 'high', color: 'bg-red-100', borderColor: 'border-red-400', textColor: 'text-red-700', label: '高 - 即時対応' },
              { key: 'medium', color: 'bg-amber-100', borderColor: 'border-amber-400', textColor: 'text-amber-700', label: '中 - 計画的対応' },
              { key: 'low', color: 'bg-blue-100', borderColor: 'border-blue-400', textColor: 'text-blue-700', label: '低 - 経過観察' }
            ].map(({ key, color, borderColor, textColor, label }) => (
              <div key={key} className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded ${color} border-2 ${borderColor}`}></div>
                <span className={`text-gray-600`}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}