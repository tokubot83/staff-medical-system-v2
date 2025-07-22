'use client';

import React, { useState } from 'react';
import FacilitySelector from '@/components/reports/FacilitySelector';
import CommonHeader from '@/components/CommonHeader';
import BasicMetricsTab from '@/components/reports/tabs/BasicMetricsTab';
import StrategicAnalysisTab from '@/components/reports/tabs/StrategicAnalysisTab';
import styles from './Reports.module.css';

const tabs = [
  { id: 'basic', label: '基本指標', icon: '📊' },
  { id: 'strategic', label: '戦略分析', icon: '📈' },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('basic');
  const [selectedFacility, setSelectedFacility] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader 
        title="レポートセンター" 
        showBackButton={true}
        backUrl="/"
        backText="ダッシュボードに戻る"
      />
      
      <div className={styles.container}>
        {/* タブナビゲーション */}
        <div className={styles.tabNavigation}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 施設選択 */}
        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={setSelectedFacility}
          />
        </div>

        {/* タブコンテンツ */}
        <div className={styles.tabContent}>
          {activeTab === 'basic' && (
            <BasicMetricsTab selectedFacility={selectedFacility} />
          )}
          {activeTab === 'strategic' && (
            <StrategicAnalysisTab selectedFacility={selectedFacility} />
          )}
        </div>

        {/* 注意事項 */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            レポート機能について
          </h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>施設を選択すると、その施設に特化したレポートが生成されます</li>
            <li>全施設を選択した場合は、医療法人全体の統合レポートが生成されます</li>
            <li>各レポートはPDF形式でダウンロード可能です</li>
            <li>レポートは最新のデータに基づいてリアルタイムで生成されます</li>
          </ul>
        </div>
      </div>
    </div>
  );
}