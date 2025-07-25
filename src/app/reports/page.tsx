'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FacilitySelector from '@/components/reports/FacilitySelector';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import BasicMetricsTab from '@/components/reports/tabs/BasicMetricsTab';
import StrategicAnalysisTab from '@/components/reports/tabs/StrategicAnalysisTab';
import RetentionAnalysisTab from '@/components/reports/tabs/RetentionAnalysisTab';
import { TurnoverAnalysisTab } from '@/components/reports/tabs/TurnoverAnalysisTab';
import TalentMappingTab from '@/components/reports/tabs/TalentMappingTab';
import FlowAnalysisTab from '@/components/reports/tabs/FlowAnalysisTab';
import CohortAnalysisTab from '@/components/reports/tabs/CohortAnalysisTab';
import SimulationTab from '@/components/reports/tabs/SimulationTab';
import WellbeingTab from '@/components/reports/tabs/WellbeingTab';
import styles from './Reports.module.css';

const categoryInfo = {
  basic: { label: '基本指標', icon: '📊', component: BasicMetricsTab },
  strategic: { label: '戦略分析', icon: '📈', component: StrategicAnalysisTab },
  retention: { label: '定着分析', icon: '🎯', component: RetentionAnalysisTab },
  analyst: { label: '離職分析', icon: '📉', component: TurnoverAnalysisTab },
  talent: { label: 'タレントマッピング', icon: '💎', component: TalentMappingTab },
  flow: { label: '人材フロー', icon: '🔄', component: FlowAnalysisTab },
  cohort: { label: 'コホート分析', icon: '📊', component: CohortAnalysisTab },
  simulation: { label: 'シミュレーション', icon: '🔮', component: SimulationTab },
  wellbeing: { label: 'ウェルビーイング', icon: '💚', component: WellbeingTab },
};

function ReportsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('basic');
  const [selectedFacility, setSelectedFacility] = useState('');

  // URLパラメータからカテゴリーと施設を初期化
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const facilityParam = searchParams.get('facility');
    
    if (tabParam && categoryInfo[tabParam as keyof typeof categoryInfo]) {
      setSelectedCategory(tabParam);
    }
    
    if (facilityParam) {
      setSelectedFacility(facilityParam);
    }
  }, [searchParams]);

  const currentCategory = categoryInfo[selectedCategory as keyof typeof categoryInfo];
  const CategoryComponent = currentCategory?.component;

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader 
        title="レポートセンター" 
        showBackButton={true}
        backUrl="/reports/home"
        backText="レポートセンターに戻る"
      />
      
      <div className={styles.container}>
        {/* カテゴリーヘッダー */}
        <div className={styles.categoryHeader}>
          <div className={styles.categoryInfo}>
            <span className={styles.categoryIcon}>{currentCategory?.icon}</span>
            <h1 className={styles.categoryTitle}>{currentCategory?.label}</h1>
          </div>
          <div className={styles.headerActions}>
            <button 
              onClick={() => router.push('/reports/home')}
              className={styles.backToHomeButton}
            >
              <span>←</span>
              <span>カテゴリー一覧へ</span>
            </button>
          </div>
        </div>

        {/* 施設選択 */}
        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={setSelectedFacility}
          />
        </div>

        {/* レポート一覧 */}
        <div className={styles.reportContent}>
          {CategoryComponent && (
            <CategoryComponent selectedFacility={selectedFacility} />
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
            <ScrollToTopButton />
      <DashboardButton />
    </div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReportsPageContent />
    </Suspense>
  );
}