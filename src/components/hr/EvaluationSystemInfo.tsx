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
      className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 backdrop-blur-xl rounded-2xl border border-emerald-500/20 p-8"
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30 mb-4">
          <span className="text-emerald-400 mr-2">📊</span>
          <span className="text-emerald-300 text-sm font-medium">Phase 3 完成形</span>
        </div>
        <h3 className="text-3xl font-bold text-white mb-2">
          100点満点評価制度による精密な人材把握
        </h3>
        <p className="text-slate-300 text-lg">
          技術評価 + 組織貢献評価 = 2軸統合評価システム
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Evaluation Components */}
        <div className="space-y-6">
          <h4 className="text-xl font-semibold text-emerald-400 mb-4">
            評価構成要素
          </h4>

          {/* Technical Evaluation */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-400 text-lg">🔧</span>
              </div>
              <div>
                <h5 className="text-lg font-semibold text-white">技術評価（50点）</h5>
                <p className="text-sm text-slate-400">専門技術・知識・技能の評価</p>
              </div>
            </div>
            <div className="space-y-3 ml-13">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">法人統一項目</span>
                <span className="text-blue-400 font-semibold">30点</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">施設特化項目</span>
                <span className="text-blue-400 font-semibold">20点</span>
              </div>
            </div>
          </div>

          {/* Organizational Contribution */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">
                <span className="text-purple-400 text-lg">🤝</span>
              </div>
              <div>
                <h5 className="text-lg font-semibold text-white">組織貢献評価（50点）</h5>
                <p className="text-sm text-slate-400">チームワーク・リーダーシップ・影響力</p>
              </div>
            </div>
            <div className="space-y-3 ml-13">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">施設貢献</span>
                <span className="text-purple-400 font-semibold">25点</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">法人貢献</span>
                <span className="text-purple-400 font-semibold">25点</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grade System */}
        <div className="space-y-6">
          <h4 className="text-xl font-semibold text-emerald-400 mb-4">
            7段階最終評価
          </h4>

          {/* Grade Distribution */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
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
                    className="h-16 rounded-lg flex items-center justify-center text-white font-bold text-lg mb-2"
                    style={{ backgroundColor: info.color }}
                  >
                    {grade}
                  </div>
                  <div className="text-xs text-slate-400 mb-1">
                    {info.label}
                  </div>
                  <div className="text-xs text-slate-300 font-semibold">
                    {info.percentage}%
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Matrix Evaluation Description */}
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-lg p-4">
              <h6 className="text-white font-semibold mb-2">
                2軸マトリックス評価システム
              </h6>
              <p className="text-sm text-slate-300 leading-relaxed">
                <span className="text-cyan-400 font-medium">施設内相対評価</span> ×
                <span className="text-purple-400 font-medium"> 法人内相対評価</span> で最終評価を決定。
                同一施設内での相対的な貢献度と、法人全体での位置づけを統合的に評価します。
              </p>
            </div>
          </div>

          {/* Performance Distribution */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h6 className="text-white font-semibold mb-4">パフォーマンス層分布</h6>
            <div className="space-y-4">
              {Object.entries(evaluationSystem.distribution).map(([layer, grades]) => {
                const layerInfo = {
                  top: { label: '上位20%層', color: 'emerald', percentage: 20 },
                  middle: { label: '中間60%層', color: 'blue', percentage: 60 },
                  low: { label: '要支援20%層', color: 'amber', percentage: 20 }
                };

                const info = layerInfo[layer as keyof typeof layerInfo];
                return (
                  <div key={layer} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded bg-${info.color}-500 mr-3`}></div>
                      <span className="text-slate-300">{info.label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        {grades.map((grade) => (
                          <span
                            key={grade}
                            className="px-2 py-1 rounded text-xs font-semibold text-white"
                            style={{ backgroundColor: evaluationSystem.grades[grade]?.color || '#666' }}
                          >
                            {grade}
                          </span>
                        ))}
                      </div>
                      <span className="text-slate-400 text-sm">({info.percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="mt-8 pt-8 border-t border-emerald-500/20">
        <h4 className="text-xl font-semibold text-emerald-400 mb-6 text-center">
          第3段階で実現される効果
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-cyan-400 text-2xl">🎯</span>
            </div>
            <h5 className="text-white font-semibold mb-2">精密な人材把握</h5>
            <p className="text-sm text-slate-300">
              2軸評価により、隠れた才能や適性不一致を発見
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-400 text-2xl">⚖️</span>
            </div>
            <h5 className="text-white font-semibold mb-2">公正な評価</h5>
            <p className="text-sm text-slate-300">
              施設間格差を排除した統一基準による客観評価
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-emerald-400 text-2xl">📈</span>
            </div>
            <h5 className="text-white font-semibold mb-2">戦略的配置</h5>
            <p className="text-sm text-slate-300">
              データに基づく最適な人材配置と育成計画
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}