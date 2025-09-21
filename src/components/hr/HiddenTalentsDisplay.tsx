'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HiddenTalent {
  name: string;
  count: number;
  type: string;
  action: string;
}

interface HiddenTalentsDisplayProps {
  talents: HiddenTalent[];
}

export default function HiddenTalentsDisplay({ talents }: HiddenTalentsDisplayProps) {
  const getTypeIcon = (type: string) => {
    const typeIcons = {
      '環境不適合': '🔄',
      '専門性突出': '⭐',
      'ローカル特化': '🏆'
    };
    return typeIcons[type as keyof typeof typeIcons] || '💎';
  };

  const getTypeColor = (type: string) => {
    const typeColors = {
      '環境不適合': {
        bg: 'from-orange-500/10 to-amber-500/10',
        border: 'border-orange-500/30',
        text: 'text-orange-400',
        accent: 'bg-orange-500/20'
      },
      '専門性突出': {
        bg: 'from-cyan-500/10 to-blue-500/10',
        border: 'border-cyan-500/30',
        text: 'text-cyan-400',
        accent: 'bg-cyan-500/20'
      },
      'ローカル特化': {
        bg: 'from-emerald-500/10 to-green-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
        accent: 'bg-emerald-500/20'
      }
    };
    return typeColors[type as keyof typeof typeColors] || typeColors['専門性突出'];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl rounded-2xl border border-amber-500/20 p-8"
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-amber-500/20 rounded-full border border-amber-500/30 mb-4">
          <span className="text-amber-400 mr-2">💎</span>
          <span className="text-amber-300 text-sm font-medium">2軸評価による発見</span>
        </div>
        <h3 className="text-3xl font-bold text-white mb-2">
          埋もれた人材の可視化
        </h3>
        <p className="text-slate-300 text-lg">
          施設内評価 × 法人内評価の差異から発見された特別な人材パターン
        </p>
      </div>

      {/* Explanation */}
      <div className="mb-8 bg-white/5 rounded-xl p-6 border border-white/10">
        <h4 className="text-lg font-semibold text-white mb-4">
          2軸評価システムの発見力
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-cyan-400 font-medium mb-2">施設内評価 vs 法人内評価</h5>
            <p className="text-sm text-slate-300 leading-relaxed">
              同一施設内での相対評価と法人全体での相対評価を比較することで、
              これまで見過ごされてきた人材の特性や可能性を発見します。
            </p>
          </div>
          <div>
            <h5 className="text-purple-400 font-medium mb-2">戦略的活用の可能性</h5>
            <p className="text-sm text-slate-300 leading-relaxed">
              評価の差異は弱点ではなく、その人材の独自性を示すシグナル。
              適切な環境や役割を提供することで、組織の競争力向上につながります。
            </p>
          </div>
        </div>
      </div>

      {/* Talents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {talents.map((talent, index) => {
          const colorConfig = getTypeColor(talent.type);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`
                bg-gradient-to-br ${colorConfig.bg} backdrop-blur-sm rounded-xl
                border ${colorConfig.border} p-6 cursor-pointer
                hover:shadow-xl transition-all duration-300
              `}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${colorConfig.accent} rounded-lg flex items-center justify-center`}>
                  <span className="text-2xl">{getTypeIcon(talent.type)}</span>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${colorConfig.text}`}>
                    {talent.count}名
                  </div>
                  <div className="text-xs text-slate-400">該当者</div>
                </div>
              </div>

              {/* Type */}
              <div className="mb-3">
                <div className={`inline-block px-3 py-1 ${colorConfig.accent} rounded-lg ${colorConfig.text} text-sm font-semibold`}>
                  {talent.type}
                </div>
              </div>

              {/* Pattern */}
              <div className="mb-4">
                <h5 className="text-white font-semibold mb-2">評価パターン</h5>
                <div className="text-sm text-slate-300 font-mono bg-black/20 p-2 rounded">
                  {talent.name}
                </div>
              </div>

              {/* Action */}
              <div className="mb-4">
                <h5 className="text-white font-semibold mb-2">推奨アクション</h5>
                <div className={`text-sm ${colorConfig.text} bg-white/5 p-3 rounded-lg`}>
                  📌 {talent.action}
                </div>
              </div>

              {/* View Details Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  w-full py-2 px-4 bg-white/10 border border-white/20 rounded-lg
                  text-white text-sm hover:bg-white/20 transition-all duration-200
                `}
              >
                詳細を見る
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <h4 className="text-lg font-semibold text-white mb-4">
          発見された人材の活用効果
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">
              {talents.reduce((sum, talent) => sum + talent.count, 0)}名
            </div>
            <div className="text-sm text-slate-400">総発見人材数</div>
            <div className="text-xs text-slate-500 mt-1">
              (全体の{((talents.reduce((sum, talent) => sum + talent.count, 0) / 500) * 100).toFixed(1)}%)
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-2">
              3つ
            </div>
            <div className="text-sm text-slate-400">発見パターン</div>
            <div className="text-xs text-slate-500 mt-1">
              環境・専門性・ローカル特化
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              100%
            </div>
            <div className="text-sm text-slate-400">活用可能率</div>
            <div className="text-xs text-slate-500 mt-1">
              全員に最適な活用方法あり
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-8 text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="
            px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500
            text-white font-semibold rounded-lg shadow-lg shadow-amber-500/25
            hover:shadow-xl hover:shadow-amber-500/40 transition-all duration-300
          "
        >
          埋もれた人材活用プラン作成
        </motion.button>
      </div>
    </motion.div>
  );
}