'use client';

import React, { useState, useMemo } from 'react';
import FacilitySelector from '@/components/reports/FacilitySelector';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import BasicMetricsTab from '@/components/reports/tabs/BasicMetricsTab';
import StrategicAnalysisTab from '@/components/reports/tabs/StrategicAnalysisTab';
import RetentionAnalysisTab from '@/components/reports/tabs/RetentionAnalysisTab';
import { TurnoverAnalysisTab } from '@/components/reports/tabs/TurnoverAnalysisTab';
import TalentMappingTab from '@/components/reports/tabs/TalentMappingTab';
import FlowAnalysisTab from '@/components/reports/tabs/FlowAnalysisTab';
import CohortAnalysisTab from '@/components/reports/tabs/CohortAnalysisTab';
import SimulationTab from '@/components/reports/tabs/SimulationTab';
import WellbeingTab from '@/components/reports/tabs/WellbeingTab';
import { obaraStaffDatabase, tachigamiStaffDatabase } from '@/app/data/staffData';
import styles from './Reports.module.css';

const tabs = [
  // 1段目：基本的な分析
  { id: 'basic', label: '基本指標', icon: '📊', row: 1 },
  { id: 'strategic', label: '戦略分析', icon: '📈', row: 1 },
  { id: 'retention', label: '定着分析', icon: '🎯', row: 1 },
  { id: 'analyst', label: '離職分析', icon: '📉', row: 1 },
  // 2段目：高度な分析
  { id: 'talent', label: 'タレントマッピング', icon: '💎', row: 2 },
  { id: 'flow', label: '人材フロー', icon: '🔄', row: 2 },
  { id: 'cohort', label: 'コホート分析', icon: '📊', row: 2 },
  { id: 'simulation', label: 'シミュレーション', icon: '🔮', row: 2 },
  { id: 'wellbeing', label: 'ウェルビーイング', icon: '💚', row: 2 },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('basic');
  const [selectedFacility, setSelectedFacility] = useState('');

  // 施設に応じたスタッフデータを取得
  const staffData = useMemo(() => {
    if (selectedFacility === '小原病院') {
      return Object.values(obaraStaffDatabase);
    } else if (selectedFacility === '立神リハビリテーション温泉病院') {
      return Object.values(tachigamiStaffDatabase);
    } else {
      // 全施設の場合
      return [...Object.values(obaraStaffDatabase), ...Object.values(tachigamiStaffDatabase)];
    }
  }, [selectedFacility]);

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader 
        title="レポートセンター" 
        showBackButton={false}
        backUrl="/"
        backText="ダッシュボードに戻る"
      />
      
      <div className={styles.container}>
        {/* タブナビゲーション - 2段構成 */}
        <div className={styles.tabNavigationWrapper}>
          {/* 1段目 */}
          <div className={styles.tabNavigation}>
            {tabs.filter(tab => tab.row === 1).map((tab) => (
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
          {/* 2段目 */}
          <div className={styles.tabNavigation}>
            {tabs.filter(tab => tab.row === 2).map((tab) => (
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
          {activeTab === 'retention' && (
            <RetentionAnalysisTab selectedFacility={selectedFacility} />
          )}
          {activeTab === 'analyst' && (
            <TurnoverAnalysisTab selectedFacility={selectedFacility} />
          )}
          {activeTab === 'talent' && (
            <TalentMappingTab selectedFacility={selectedFacility} />
          )}
          {activeTab === 'flow' && (
            <FlowAnalysisTab selectedFacility={selectedFacility} />
          )}
          {activeTab === 'cohort' && (
            <CohortAnalysisTab selectedFacility={selectedFacility} />
          )}
          {activeTab === 'simulation' && (
            <SimulationTab selectedFacility={selectedFacility} />
          )}
          {activeTab === 'wellbeing' && (
            <WellbeingTab selectedFacility={selectedFacility} />
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
      <DashboardButton />
    </div>
  );
}