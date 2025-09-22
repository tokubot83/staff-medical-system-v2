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
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-700',
        accent: 'bg-orange-100',
        badge: 'bg-orange-100',
        badgeText: 'text-orange-700',
        countText: 'text-orange-600',
        actionBg: 'bg-orange-50',
        actionText: 'text-orange-700',
        buttonBg: 'bg-orange-100',
        buttonHover: 'hover:bg-orange-200',
        buttonText: 'text-orange-800'
      },
      '専門性突出': {
        bg: 'bg-cyan-50',
        border: 'border-cyan-200',
        text: 'text-cyan-700',
        accent: 'bg-cyan-100',
        badge: 'bg-cyan-100',
        badgeText: 'text-cyan-700',
        countText: 'text-cyan-600',
        actionBg: 'bg-cyan-50',
        actionText: 'text-cyan-700',
        buttonBg: 'bg-cyan-100',
        buttonHover: 'hover:bg-cyan-200',
        buttonText: 'text-cyan-800'
      },
      'ローカル特化': {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-700',
        accent: 'bg-emerald-100',
        badge: 'bg-emerald-100',
        badgeText: 'text-emerald-700',
        countText: 'text-emerald-600',
        actionBg: 'bg-emerald-50',
        actionText: 'text-emerald-700',
        buttonBg: 'bg-emerald-100',
        buttonHover: 'hover:bg-emerald-200',
        buttonText: 'text-emerald-800'
      }
    };
    return typeColors[type as keyof typeof typeColors] || typeColors['専門性突出'];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-amber-50 rounded-2xl border-2 border-amber-200 p-8 shadow-md"
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-amber-100 rounded-full border border-amber-300 mb-4">
          <span className="text-amber-700 mr-2">💎</span>
          <span className="text-amber-700 text-sm font-medium">2軸評価による発見</span>
        </div>
        <h3 className="text-3xl font-bold text-amber-900 mb-2">
          埋もれた人材の可視化
        </h3>
        <p className="text-gray-700 text-lg">
          施設内評価 × 法人内評価の差異から発見された特別な人材パターン
        </p>
      </div>

      {/* Explanation */}
      <div className="mb-8 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          2軸評価システムの発見力
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-cyan-700 font-medium mb-2">施設内評価 vs 法人内評価</h5>
            <p className="text-sm text-gray-600 leading-relaxed">
              同一施設内での相対評価と法人全体での相対評価を比較することで、
              これまで見過ごされてきた人材の特性や可能性を発見します。
            </p>
          </div>
          <div>
            <h5 className="text-purple-700 font-medium mb-2">戦略的活用の可能性</h5>
            <p className="text-sm text-gray-600 leading-relaxed">
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
                ${colorConfig.bg} rounded-xl
                border-2 ${colorConfig.border} p-6 cursor-pointer
                hover:shadow-xl transition-all duration-300 shadow-md
              `}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${colorConfig.accent} rounded-lg flex items-center justify-center`}>
                  <span className="text-2xl">{getTypeIcon(talent.type)}</span>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${colorConfig.countText}`}>
                    {talent.count}名
                  </div>
                  <div className="text-xs text-gray-600">該当者</div>
                </div>
              </div>

              {/* Type */}
              <div className="mb-3">
                <div className={`inline-block px-3 py-1 ${colorConfig.badge} rounded-lg ${colorConfig.badgeText} text-sm font-semibold`}>
                  {talent.type}
                </div>
              </div>

              {/* Pattern */}
              <div className="mb-4">
                <h5 className="text-gray-800 font-semibold mb-2">評価パターン</h5>
                <div className="text-sm text-gray-700 font-mono bg-gray-100 p-2 rounded border border-gray-200">
                  {talent.name}
                </div>
              </div>

              {/* Action */}
              <div className="mb-4">
                <h5 className="text-gray-800 font-semibold mb-2">推奨アクション</h5>
                <div className={`text-sm ${colorConfig.actionText} ${colorConfig.actionBg} p-3 rounded-lg border ${colorConfig.border}`}>
                  📌 {talent.action}
                </div>
              </div>

              {/* View Details Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  w-full py-2 px-4 ${colorConfig.buttonBg} border ${colorConfig.border} rounded-lg
                  ${colorConfig.buttonText} text-sm ${colorConfig.buttonHover} transition-all duration-200 font-medium
                `}
              >
                詳細を見る
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          発見された人材の活用効果
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-600 mb-2">
              {talents.reduce((sum, talent) => sum + talent.count, 0)}名
            </div>
            <div className="text-sm text-gray-600">総発見人材数</div>
            <div className="text-xs text-gray-500 mt-1">
              (全体の{((talents.reduce((sum, talent) => sum + talent.count, 0) / 500) * 100).toFixed(1)}%)
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-2">
              3つ
            </div>
            <div className="text-sm text-gray-600">発見パターン</div>
            <div className="text-xs text-gray-500 mt-1">
              環境・専門性・ローカル特化
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              100%
            </div>
            <div className="text-sm text-gray-600">活用可能率</div>
            <div className="text-xs text-gray-500 mt-1">
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