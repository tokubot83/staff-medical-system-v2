'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Calendar, Target, Users, TrendingUp } from 'lucide-react';
import { exportActionPlanToCSV } from '@/lib/hr/exportUtils';

interface ActionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  cellData: {
    layer: string;
    course: string;
    data: any;
  };
  filters: {
    facility: string;
    position: string;
    phase: number;
  };
}

export default function ActionPlanModal({ isOpen, onClose, cellData, filters }: ActionPlanModalProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('3months');
  const [selectedPriority, setSelectedPriority] = useState('high');

  if (!isOpen) return null;

  const layerLabels: Record<string, string> = {
    top: '上位20%',
    middle: '中間60%',
    low: '要支援20%'
  };

  const layerColors: Record<string, { bg: string; border: string; text: string }> = {
    top: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700' },
    middle: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700' },
    low: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700' }
  };

  const actionPlans = {
    top: {
      A: {
        shortTerm: [
          '次世代リーダーシップ研修への参加',
          '法人横断プロジェクトのリーダーアサイン',
          '経営層との定期的な1on1ミーティング設定'
        ],
        midTerm: [
          '法人戦略立案への直接参画',
          '外部エグゼクティブコーチングの導入',
          'サクセッションプラン策定'
        ],
        kpis: ['リーダーシップスコア20%向上', 'プロジェクト成功率90%以上', '部下満足度4.5以上'],
        timeline: '3ヶ月以内着手、1年以内完遂'
      },
      B: {
        shortTerm: [
          '施設内リーダー育成プログラム参加',
          '部門横断タスクフォースへの参加',
          'メンタリング制度の導入'
        ],
        midTerm: [
          '施設内新規プロジェクト立ち上げ',
          'Aコース移行準備プログラム開始',
          '専門資格取得支援'
        ],
        kpis: ['施設内評価上位10%維持', 'プロジェクト参加率100%', 'スキル評価15%向上'],
        timeline: '2ヶ月以内着手、9ヶ月以内完遂'
      }
    },
    middle: {
      A: {
        shortTerm: [
          '個別育成計画の策定と実施',
          '強み分野の特定と強化研修',
          '上位層メンターの配置'
        ],
        midTerm: [
          '専門性向上プログラム参加',
          'クロスファンクショナルプロジェクト参加',
          'リーダーシップ基礎研修'
        ],
        kpis: ['評価ポイント10%向上', '研修受講率100%', 'メンター満足度4.0以上'],
        timeline: '1ヶ月以内着手、6ヶ月以内進捗確認'
      },
      B: {
        shortTerm: [
          '基礎スキル向上研修の実施',
          'OJTプログラムの強化',
          '定期的なフィードバック面談'
        ],
        midTerm: [
          '施設内専門研修参加',
          'チームリーダー候補育成',
          '業務改善プロジェクト参加'
        ],
        kpis: ['基礎スキル評価20%向上', 'OJT完了率100%', '面談実施率100%'],
        timeline: '即時着手、3ヶ月毎レビュー'
      }
    },
    low: {
      A: {
        shortTerm: [
          '基礎能力診断と個別支援計画',
          '集中的なスキルアップ研修',
          '週次1on1フォローアップ'
        ],
        midTerm: [
          '適性再評価と配置転換検討',
          'コース変更オプションの提示',
          'キャリアカウンセリング実施'
        ],
        kpis: ['基礎評価30%向上', '研修完了率100%', '改善計画達成率80%'],
        timeline: '即時着手、月次進捗確認'
      },
      D: {
        shortTerm: [
          '業務負荷の適正化',
          '基本業務スキル研修',
          'バディ制度による支援'
        ],
        midTerm: [
          '限定業務への特化',
          'ワークライフバランス改善',
          '段階的スキルアップ計画'
        ],
        kpis: ['基本業務達成率90%', 'ストレススコア改善', '満足度向上'],
        timeline: '即時対応、2週間毎確認'
      }
    }
  };

  const currentPlan = actionPlans[cellData.layer]?.[cellData.course] || actionPlans[cellData.layer]?.['A'];

  const handleExportPlan = () => {
    const plan = {
      layer: layerLabels[cellData.layer],
      course: cellData.course,
      count: cellData.data.count,
      actions: [...currentPlan.shortTerm, ...currentPlan.midTerm],
      timeline: currentPlan.timeline,
      kpi: currentPlan.kpis
    };

    exportActionPlanToCSV([plan]);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl border-2 border-gray-300 w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b-2 border-indigo-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  アクションプラン策定
                </h2>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-lg border ${layerColors[cellData.layer].bg} ${layerColors[cellData.layer].border} ${layerColors[cellData.layer].text} font-medium`}>
                    {layerLabels[cellData.layer]}
                  </span>
                  <span className="px-3 py-1 rounded-lg border bg-purple-50 border-purple-300 text-purple-700 font-medium">
                    {cellData.course}コース
                  </span>
                  <span className="text-gray-600">
                    対象: {cellData.data.count}名
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportPlan}
                  className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center gap-2 transition-colors border border-blue-300 text-blue-700"
                >
                  <Download className="w-4 h-4" />
                  エクスポート
                </button>
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors border border-gray-300"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="p-6 space-y-6">
              {/* Timeline Selector */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    実施タイムライン
                  </h3>
                  <div className="flex gap-2">
                    {['1month', '3months', '6months', '1year'].map((timeframe) => (
                      <button
                        key={timeframe}
                        onClick={() => setSelectedTimeframe(timeframe)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          selectedTimeframe === timeframe
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {timeframe === '1month' && '1ヶ月'}
                        {timeframe === '3months' && '3ヶ月'}
                        {timeframe === '6months' && '6ヶ月'}
                        {timeframe === '1year' && '1年'}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{currentPlan.timeline}</p>
              </div>

              {/* Short Term Actions */}
              <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  短期アクション（3ヶ月以内）
                </h3>
                <ul className="space-y-3">
                  {currentPlan.shortTerm.map((action, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-green-700 text-xs font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700">{action}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mid Term Actions */}
              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  中期アクション（3-12ヶ月）
                </h3>
                <ul className="space-y-3">
                  {currentPlan.midTerm.map((action, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-700 text-xs font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700">{action}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* KPIs */}
              <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
                <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  成果指標（KPI）
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentPlan.kpis.map((kpi, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-purple-300">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-purple-200 rounded-lg flex items-center justify-center">
                          <span className="text-purple-700 text-sm font-bold">KPI</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 font-medium">{kpi}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority Settings */}
              <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
                <h3 className="text-lg font-semibold text-amber-800 mb-4">実施優先度</h3>
                <div className="flex gap-4">
                  {['high', 'medium', 'low'].map((priority) => (
                    <button
                      key={priority}
                      onClick={() => setSelectedPriority(priority)}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                        selectedPriority === priority
                          ? priority === 'high'
                            ? 'bg-red-100 border-red-400 text-red-700'
                            : priority === 'medium'
                            ? 'bg-amber-100 border-amber-400 text-amber-700'
                            : 'bg-blue-100 border-blue-400 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-semibold mb-1">
                        {priority === 'high' && '高優先度'}
                        {priority === 'medium' && '中優先度'}
                        {priority === 'low' && '低優先度'}
                      </div>
                      <div className="text-xs">
                        {priority === 'high' && '即時対応が必要'}
                        {priority === 'medium' && '計画的に実施'}
                        {priority === 'low' && '状況を見て判断'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}