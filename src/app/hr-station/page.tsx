'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import HRHeatmap from '@/components/hr/HRHeatmap';
import FilterPanel from '@/components/hr/FilterPanel';
import IntegratedStaffModal from '@/components/hr/IntegratedStaffModal';

export default function HRStationPage() {
  const [selectedFilters, setSelectedFilters] = useState({
    facility: 'all',
    position: 'all',
    phase: 1
  });

  const [selectedCell, setSelectedCell] = useState<{
    layer: string;
    course: string;
    data: any;
  } | null>(null);

  const handleFiltersChange = (newFilters: any) => {
    setSelectedFilters(newFilters);
  };

  const handlePhaseChange = (phase: number) => {
    setSelectedFilters({
      ...selectedFilters,
      phase: phase
    });
  };

  const handleCellClick = (layer: string, course: string, data: any) => {
    setSelectedCell({ layer, course, data });
  };

  const handleCloseStaffList = () => {
    setSelectedCell(null);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section - パステルトーン調整 */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl"></div>
          </div>

          <div className="relative px-6 py-16">
            <div className="max-w-7xl mx-auto text-center">
              <div className="mb-8">
                <div className="inline-flex items-center px-6 py-3 bg-white/70 backdrop-blur-sm rounded-full border-2 border-blue-300 mb-6">
                  <span className="text-blue-600 mr-2">🎯</span>
                  <span className="text-blue-700 text-sm font-medium">厚生会人事ステーション</span>
                </div>
                <h1 className="text-5xl font-bold text-gray-800 mb-4 tracking-tight">
                  人事アプローチ戦略
                  <span className="block text-gray-700">
                    ヒートマップダッシュボード
                  </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  フェーズ別 × パフォーマンス層別の最適施策可視化システム
                  <br />
                  <span className="text-gray-700 font-medium">職員500名の戦略的配置と育成を実現</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative px-4 md:px-6 pb-16">
          <div className="max-w-7xl mx-auto">
            {/* Filter Panel */}
            <div className="mb-8">
              <FilterPanel
                selectedFilters={selectedFilters}
                onFiltersChange={handleFiltersChange}
              />
            </div>

            {/* Heatmap Section */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden">
              <div className="p-8 bg-gradient-to-br from-slate-50 to-gray-50">
                <HRHeatmap
                  filters={selectedFilters}
                  onCellClick={handleCellClick}
                  onPhaseChange={handlePhaseChange}
                />
              </div>
            </div>

            {/* Strategic Actions Panel */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-green-50 rounded-2xl border-2 border-green-200 p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-green-700 text-lg">🎯</span>
                  </div>
                  <h3 className="text-xl font-semibold text-green-800">上位20%層</h3>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">▸</span>
                    <span>次世代リーダー育成プログラム</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">▸</span>
                    <span>法人横断プロジェクト参画</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">▸</span>
                    <span>戦略立案への直接参加</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-2xl border-2 border-blue-200 p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-700 text-lg">📊</span>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-800">中間60%層</h3>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">▸</span>
                    <span>個別育成計画の策定</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">▸</span>
                    <span>専門性強化研修</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">▸</span>
                    <span>中核人材への昇格支援</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 rounded-2xl border-2 border-amber-200 p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-amber-700 text-lg">⚠️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-amber-800">要支援20%層</h3>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2 mt-1">▸</span>
                    <span>基礎スキル向上プログラム</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2 mt-1">▸</span>
                    <span>メンター制度による支援</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2 mt-1">▸</span>
                    <span>適正配置の最適化</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Integrated Staff Modal */}
        {selectedCell && (
          <IntegratedStaffModal
            isOpen={true}
            onClose={handleCloseStaffList}
            cellData={selectedCell}
            filters={selectedFilters}
          />
        )}
      </div>
    </MainLayout>
  );
}