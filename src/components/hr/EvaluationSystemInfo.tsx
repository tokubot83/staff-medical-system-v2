'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface EvaluationSystemInfoProps {
  evaluationSystem: {
    grades: Record<string, { label: string; color: string; percentage: number }>;
    distribution: Record<string, string[]>;
  };
}

export default function EvaluationSystemInfo({ evaluationSystem }: EvaluationSystemInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl border-2 border-gray-200 shadow-md overflow-hidden"
    >
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-br from-emerald-100 to-green-50 border-b-2 border-emerald-200 p-6">
        <div className="text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full shadow-lg shadow-emerald-200 mb-4">
            <span className="text-white text-xl mr-2">📊</span>
            <span className="text-white text-sm font-extrabold tracking-wide">Phase 3 完成形</span>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-800 mb-2 tracking-tight">
            100点満点評価制度による精密な人材把握
          </h3>
          <p className="text-gray-700 text-lg font-medium">
            技術評価 + 組織貢献評価 = 2軸統合評価システム
          </p>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Evaluation Components */}
          <div className="space-y-6">
            <h4 className="text-xl font-extrabold text-emerald-800 mb-4 tracking-wide flex items-center">
              <span className="mr-2">⚡</span>
              評価構成要素
            </h4>

            {/* Technical Evaluation Card */}
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-6 border-2 border-blue-500 shadow-md shadow-blue-200 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg mr-3">
                  <span className="text-white text-xl">🔧</span>
                </div>
                <div>
                  <h5 className="text-lg font-extrabold text-blue-800">技術評価（50点）</h5>
                  <p className="text-sm text-blue-700 opacity-80">専門技術・知識・技能の評価</p>
                </div>
              </div>
              <div className="bg-white/70 rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-800 font-semibold">法人統一項目</span>
                  <span className="text-blue-600 font-extrabold text-lg">30点</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-800 font-semibold">施設特化項目</span>
                  <span className="text-blue-600 font-extrabold text-lg">20点</span>
                </div>
              </div>
            </div>

            {/* Organizational Contribution Card */}
            <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-6 border-2 border-purple-500 shadow-md shadow-purple-200 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg mr-3">
                  <span className="text-white text-xl">🤝</span>
                </div>
                <div>
                  <h5 className="text-lg font-extrabold text-purple-800">組織貢献評価（50点）</h5>
                  <p className="text-sm text-purple-700 opacity-80">チームワーク・リーダーシップ・影響力</p>
                </div>
              </div>
              <div className="bg-white/70 rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-800 font-semibold">施設貢献</span>
                  <span className="text-purple-600 font-extrabold text-lg">25点</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-800 font-semibold">法人貢献</span>
                  <span className="text-purple-600 font-extrabold text-lg">25点</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grade System */}
          <div className="space-y-6">
            <h4 className="text-xl font-extrabold text-emerald-800 mb-4 tracking-wide flex items-center">
              <span className="mr-2">🎯</span>
              7段階最終評価
            </h4>

            {/* Grade Distribution Card */}
            <div className="bg-gradient-to-br from-emerald-100 to-green-50 rounded-xl p-6 border-2 border-emerald-500 shadow-md shadow-emerald-200 hover:shadow-lg transition-all duration-200">
              <div className="grid grid-cols-7 gap-2 mb-6">
                {Object.entries(evaluationSystem.grades).map(([grade, info]) => (
                  <motion.div
                    key={grade}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: Object.keys(evaluationSystem.grades).indexOf(grade) * 0.1 }}
                    className="text-center"
                  >
                    <div
                      className="h-16 rounded-lg flex items-center justify-center text-white font-extrabold text-lg mb-2 shadow-md hover:scale-110 transition-transform duration-200"
                      style={{ backgroundColor: info.color }}
                    >
                      {grade}
                    </div>
                    <div className="text-xs text-gray-700 font-semibold mb-1">
                      {info.label}
                    </div>
                    <div className="text-xs text-emerald-700 font-extrabold">
                      {info.percentage}%
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Matrix Evaluation Description */}
              <div className="bg-gradient-to-r from-emerald-400 to-green-500 rounded-lg p-4 shadow-lg">
                <h6 className="text-white font-extrabold mb-2 text-lg">
                  2軸マトリックス評価システム
                </h6>
                <p className="text-sm text-white leading-relaxed">
                  <span className="font-extrabold bg-white/20 px-1 rounded">施設内相対評価</span> ×
                  <span className="font-extrabold bg-white/20 px-1 rounded ml-1"> 法人内相対評価</span> で最終評価を決定。
                  同一施設内での相対的な貢献度と、法人全体での位置づけを統合的に評価します。
                </p>
              </div>
            </div>

            {/* Performance Distribution Card */}
            <div className="bg-gradient-to-br from-slate-100 to-gray-100 rounded-xl p-6 border-2 border-slate-300 shadow-md hover:shadow-lg transition-all duration-200">
              <h6 className="text-gray-800 font-extrabold mb-4 text-lg tracking-wide">パフォーマンス層分布</h6>
              <div className="space-y-4">
                {Object.entries(evaluationSystem.distribution).map(([layer, grades]) => {
                  const layerInfo = {
                    top: {
                      label: '上位20%層',
                      bgColor: 'from-green-100 to-green-50',
                      borderColor: 'border-green-500',
                      dotColor: 'bg-green-500',
                      textColor: 'text-green-800',
                      percentage: 20
                    },
                    middle: {
                      label: '中間60%層',
                      bgColor: 'from-blue-100 to-blue-50',
                      borderColor: 'border-blue-500',
                      dotColor: 'bg-blue-500',
                      textColor: 'text-blue-800',
                      percentage: 60
                    },
                    low: {
                      label: '要支援20%層',
                      bgColor: 'from-amber-100 to-amber-50',
                      borderColor: 'border-amber-500',
                      dotColor: 'bg-amber-500',
                      textColor: 'text-amber-800',
                      percentage: 20
                    }
                  };

                  const info = layerInfo[layer as keyof typeof layerInfo];
                  return (
                    <div
                      key={layer}
                      className={`bg-gradient-to-r ${info.bgColor} p-3 rounded-lg border-2 ${info.borderColor} shadow-sm`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded ${info.dotColor} mr-3 shadow-sm`}></div>
                          <span className={`font-extrabold ${info.textColor}`}>{info.label}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            {grades.map((grade) => (
                              <span
                                key={grade}
                                className="px-2 py-1 rounded text-xs font-extrabold text-white shadow-sm"
                                style={{ backgroundColor: evaluationSystem.grades[grade]?.color || '#666' }}
                              >
                                {grade}
                              </span>
                            ))}
                          </div>
                          <span className="text-gray-700 text-sm font-extrabold">({info.percentage}%)</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Key Benefits Section */}
        <div className="mt-8 pt-8 border-t-2 border-gray-200">
          <h4 className="text-2xl font-extrabold text-gray-800 mb-6 text-center tracking-wide">
            第3段階で実現される効果
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center bg-gradient-to-br from-cyan-100 to-cyan-50 p-6 rounded-xl border-2 border-cyan-500 shadow-md shadow-cyan-200 hover:shadow-lg transition-all duration-200"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h5 className="text-gray-800 font-extrabold mb-2 text-lg">精密な人材把握</h5>
              <p className="text-sm text-gray-700">
                2軸評価により、隠れた才能や適性不一致を発見
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center bg-gradient-to-br from-purple-100 to-purple-50 p-6 rounded-xl border-2 border-purple-500 shadow-md shadow-purple-200 hover:shadow-lg transition-all duration-200"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-2xl">⚖️</span>
              </div>
              <h5 className="text-gray-800 font-extrabold mb-2 text-lg">公正な評価</h5>
              <p className="text-sm text-gray-700">
                施設間格差を排除した統一基準による客観評価
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center bg-gradient-to-br from-emerald-100 to-green-50 p-6 rounded-xl border-2 border-emerald-500 shadow-md shadow-emerald-200 hover:shadow-lg transition-all duration-200"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-2xl">📈</span>
              </div>
              <h5 className="text-gray-800 font-extrabold mb-2 text-lg">戦略的配置</h5>
              <p className="text-sm text-gray-700">
                データに基づく最適な人材配置と育成計画
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}