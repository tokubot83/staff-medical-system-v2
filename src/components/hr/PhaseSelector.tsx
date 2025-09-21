'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PhaseSelectorProps {
  currentPhase: number;
  onPhaseChange: (phase: number) => void;
}

export default function PhaseSelector({ currentPhase, onPhaseChange }: PhaseSelectorProps) {
  const phases = [
    {
      id: 1,
      title: '第1段階',
      subtitle: 'コース制度のみ',
      description: 'キャリアコース制度導入',
      period: '2026年4月〜',
      icon: '🎯',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-800',
      subTextColor: 'text-blue-600',
      dateColor: 'text-blue-500',
      iconBgColor: 'bg-blue-100',
      activeBg: 'bg-blue-100',
      activeBorder: 'border-blue-400',
      progressBar: 'from-blue-400 to-blue-500'
    },
    {
      id: 2,
      title: '第2段階',
      subtitle: '＋等級制度',
      description: '共通50等級制度導入',
      period: '2026年10月〜',
      icon: '📊',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300',
      textColor: 'text-purple-800',
      subTextColor: 'text-purple-600',
      dateColor: 'text-purple-500',
      iconBgColor: 'bg-purple-100',
      activeBg: 'bg-purple-100',
      activeBorder: 'border-purple-400',
      progressBar: 'from-purple-400 to-purple-500'
    },
    {
      id: 3,
      title: '第3段階',
      subtitle: '＋評価制度（完成）',
      description: '100点満点評価制度',
      period: '2027年4月〜',
      icon: '🎖️',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      textColor: 'text-green-800',
      subTextColor: 'text-green-600',
      dateColor: 'text-green-500',
      iconBgColor: 'bg-green-100',
      activeBg: 'bg-green-100',
      activeBorder: 'border-green-400',
      progressBar: 'from-green-400 to-green-500'
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {phases.map((phase) => (
        <motion.button
          key={phase.id}
          onClick={() => onPhaseChange(phase.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            relative flex-1 p-6 rounded-xl border-2 transition-all duration-300
            ${currentPhase === phase.id
              ? `${phase.activeBg} ${phase.activeBorder} shadow-lg`
              : `${phase.bgColor} ${phase.borderColor} hover:shadow-md`
            }
          `}
        >
          {/* Active Background Effect */}
          {currentPhase === phase.id && (
            <motion.div
              layoutId="phase-selector-bg"
              className="absolute inset-0 rounded-xl"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-3">
              <div className={`
                w-12 h-12 rounded-lg flex items-center justify-center
                ${currentPhase === phase.id
                  ? `${phase.iconBgColor} shadow-md`
                  : phase.iconBgColor
                }
              `}>
                <span className="text-2xl">{phase.icon}</span>
              </div>
            </div>

            <div className="text-center">
              <div className={`text-xl font-bold ${phase.textColor} mb-1`}>
                {phase.title}
              </div>
              <div className={`text-sm ${phase.subTextColor} mb-2`}>
                {phase.subtitle}
              </div>
              <div className={`text-xs ${phase.dateColor} mb-3`}>
                {phase.period}
              </div>
              <div className={`text-sm ${phase.subTextColor} leading-relaxed`}>
                {phase.description}
              </div>
            </div>

            {/* Active Indicator */}
            {currentPhase === phase.id && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.3 }}
                className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${phase.progressBar} rounded-full`}
              />
            )}
          </div>

          {/* Hover Effect */}
          <div className={`
            absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300
            ${currentPhase !== phase.id ? 'hover:opacity-5' : ''}
          `} />
        </motion.button>
      ))}
    </div>
  );
}