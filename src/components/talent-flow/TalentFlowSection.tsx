'use client';

import React, { useState } from 'react';
import { SummaryCards } from './SummaryCards';
import { NewEmployeeList } from './NewEmployeeList';
import { RiskManagementList } from './RiskManagementList';
import { ActionCenter } from './ActionCenter';

export default function TalentFlowSection() {
  const [activeTab, setActiveTab] = useState<'new-employees' | 'risk-management'>('new-employees');
  const [selectedFacility, setSelectedFacility] = useState<'all' | 'obara' | 'tategami'>('all');

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto p-5">
        <div className="mb-12">
          <div className="bg-gray-50 rounded-2xl p-8 shadow-lg border border-blue-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                🔄
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">人材フロー</h2>
                <p className="text-sm text-gray-600">入退職・リスク管理の一元化</p>
              </div>
            </div>

            {/* サマリーカード */}
            <SummaryCards facility={selectedFacility} />

            {/* 施設フィルター */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setSelectedFacility('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFacility === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                }`}
              >
                全施設
              </button>
              <button
                onClick={() => setSelectedFacility('obara')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFacility === 'obara'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                }`}
              >
                小原病院
              </button>
              <button
                onClick={() => setSelectedFacility('tategami')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFacility === 'tategami'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                }`}
              >
                立神リハビリ
              </button>
            </div>

            {/* タブ切り替え */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="flex bg-gray-200 p-1">
                <button
                  className={`flex-1 py-3 px-4 rounded-md text-sm font-semibold transition-colors ${
                    activeTab === 'new-employees'
                      ? 'bg-white border-2 border-gray-700 text-gray-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setActiveTab('new-employees')}
                >
                  📥 新入職員（過去1年）
                </button>
                <button
                  className={`flex-1 py-3 px-4 rounded-md text-sm font-semibold transition-colors ${
                    activeTab === 'risk-management'
                      ? 'bg-white border-2 border-gray-700 text-gray-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setActiveTab('risk-management')}
                >
                  📤 退職リスク管理
                </button>
              </div>

              {/* タブコンテンツ */}
              <div className="p-6">
                {activeTab === 'new-employees' ? (
                  <NewEmployeeList facility={selectedFacility} />
                ) : (
                  <RiskManagementList facility={selectedFacility} />
                )}
              </div>
            </div>

            {/* アクションセンター */}
            <ActionCenter facility={selectedFacility} />
          </div>
        </div>
      </div>
    </div>
  );
}