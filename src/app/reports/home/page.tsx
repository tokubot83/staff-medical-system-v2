'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import FacilitySelector from '@/components/reports/FacilitySelector';
import styles from '../Reports.module.css';
import homeStyles from './ReportsHome.module.css';

interface ReportCategory {
  id: string;
  label: string;
  icon: string;
  description: string;
  path: string;
  reportsCount?: number;
}

interface RecentReport {
  id: string;
  name: string;
  category: string;
  viewedAt: string;
  path: string;
}

interface QuickStat {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const reportCategories: ReportCategory[] = [
  {
    id: 'basic',
    label: '基本指標',
    icon: '📊',
    description: '職員数、離職率、平均勤続年数などの基本的な人事指標',
    path: '/reports?tab=basic',
    reportsCount: 5
  },
  {
    id: 'strategic',
    label: '戦略分析',
    icon: '📈',
    description: '組織の強み・弱み、人材配置の最適化分析',
    path: '/reports?tab=strategic',
    reportsCount: 4
  },
  {
    id: 'retention',
    label: '定着分析',
    icon: '🎯',
    description: '職員の定着率向上のための詳細分析',
    path: '/reports?tab=retention',
    reportsCount: 6
  },
  {
    id: 'turnover',
    label: '離職分析',
    icon: '📉',
    description: '離職リスク予測と離職要因の分析',
    path: '/reports?tab=analyst',
    reportsCount: 5
  },
  {
    id: 'talent',
    label: 'タレントマッピング',
    icon: '💎',
    description: '人材の能力と潜在力の可視化',
    path: '/reports?tab=talent',
    reportsCount: 3
  },
  {
    id: 'flow',
    label: '人材フロー',
    icon: '🔄',
    description: '採用から退職までの人材の流れを分析',
    path: '/reports?tab=flow',
    reportsCount: 4
  },
  {
    id: 'cohort',
    label: 'コホート分析',
    icon: '📊',
    description: '入職年度別の職員群の追跡分析',
    path: '/reports?tab=cohort',
    reportsCount: 3
  },
  {
    id: 'simulation',
    label: 'シミュレーション',
    icon: '🔮',
    description: '将来予測と施策効果のシミュレーション',
    path: '/reports?tab=simulation',
    reportsCount: 2
  },
  {
    id: 'wellbeing',
    label: 'ウェルビーイング',
    icon: '💚',
    description: '職員の健康と幸福度の総合分析',
    path: '/reports?tab=wellbeing',
    reportsCount: 4
  }
];

export default function ReportsHomePage() {
  const router = useRouter();
  const [selectedFacility, setSelectedFacility] = useState('');
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [favoriteReports, setFavoriteReports] = useState<string[]>([]);

  useEffect(() => {
    // ローカルストレージから最近閲覧したレポートを取得
    const savedRecent = localStorage.getItem('recentReports');
    if (savedRecent) {
      setRecentReports(JSON.parse(savedRecent));
    }

    // お気に入りレポートを取得
    const savedFavorites = localStorage.getItem('favoriteReports');
    if (savedFavorites) {
      setFavoriteReports(JSON.parse(savedFavorites));
    }
  }, []);

  const handleCategoryClick = (category: ReportCategory) => {
    // 施設選択を保持しながらカテゴリーページへ遷移
    const params = new URLSearchParams();
    params.set('tab', category.id);
    if (selectedFacility) {
      params.set('facility', selectedFacility);
    }
    router.push(`/reports?${params.toString()}`);
  };

  const toggleFavorite = (reportId: string) => {
    const newFavorites = favoriteReports.includes(reportId)
      ? favoriteReports.filter(id => id !== reportId)
      : [...favoriteReports, reportId];
    
    setFavoriteReports(newFavorites);
    localStorage.setItem('favoriteReports', JSON.stringify(newFavorites));
  };

  // クイック統計データ（実際のデータに基づいて動的に計算する想定）
  const quickStats: QuickStat[] = [
    { label: '総職員数', value: '1,234名', change: '+5.2%', trend: 'up' },
    { label: '平均離職率', value: '8.3%', change: '-1.5%', trend: 'down' },
    { label: '平均勤続年数', value: '6.8年', change: '+0.3年', trend: 'up' },
    { label: 'エンゲージメント', value: '78%', change: '+2.1%', trend: 'up' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader 
        title="レポートセンター" 
        showBackButton={false}
        backUrl="/"
        backText="ダッシュボードに戻る"
      />
      
      <div className={homeStyles.container}>
        {/* 施設選択 */}
        <div className={homeStyles.facilitySection}>
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={setSelectedFacility}
          />
        </div>

        {/* クイック統計 */}
        <div className={homeStyles.quickStatsSection}>
          <h2 className={homeStyles.sectionTitle}>
            <span className={homeStyles.sectionIcon}>📊</span>
            クイック統計
          </h2>
          <div className={homeStyles.statsGrid}>
            {quickStats.map((stat, index) => (
              <div key={index} className={homeStyles.statCard}>
                <div className={homeStyles.statLabel}>{stat.label}</div>
                <div className={homeStyles.statValue}>{stat.value}</div>
                {stat.change && (
                  <div className={`${homeStyles.statChange} ${homeStyles[stat.trend || 'neutral']}`}>
                    {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '→'} {stat.change}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* カテゴリー別カード表示 */}
        <div className={homeStyles.categoriesSection}>
          <h2 className={homeStyles.sectionTitle}>
            <span className={homeStyles.sectionIcon}>📂</span>
            レポートカテゴリー
          </h2>
          <div className={homeStyles.categoryGrid}>
            {reportCategories.map((category) => (
              <div
                key={category.id}
                className={homeStyles.categoryCard}
                onClick={() => handleCategoryClick(category)}
              >
                <div className={homeStyles.categoryHeader}>
                  <span className={homeStyles.categoryIcon}>{category.icon}</span>
                  <h3 className={homeStyles.categoryLabel}>{category.label}</h3>
                </div>
                <p className={homeStyles.categoryDescription}>
                  {category.description}
                </p>
                <div className={homeStyles.categoryFooter}>
                  <span className={homeStyles.reportsCount}>
                    {category.reportsCount}個のレポート
                  </span>
                  <span className={homeStyles.arrow}>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 最近閲覧したレポート */}
        {recentReports.length > 0 && (
          <div className={homeStyles.recentSection}>
            <h2 className={homeStyles.sectionTitle}>
              <span className={homeStyles.sectionIcon}>🕐</span>
              最近閲覧したレポート
            </h2>
            <div className={homeStyles.recentGrid}>
              {recentReports.slice(0, 6).map((report) => (
                <div
                  key={report.id}
                  className={homeStyles.recentCard}
                  onClick={() => router.push(report.path)}
                >
                  <div className={homeStyles.recentHeader}>
                    <h4 className={homeStyles.recentName}>{report.name}</h4>
                    <button
                      className={`${homeStyles.favoriteButton} ${
                        favoriteReports.includes(report.id) ? homeStyles.favorited : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(report.id);
                      }}
                    >
                      {favoriteReports.includes(report.id) ? '★' : '☆'}
                    </button>
                  </div>
                  <div className={homeStyles.recentMeta}>
                    <span className={homeStyles.recentCategory}>{report.category}</span>
                    <span className={homeStyles.recentDate}>{report.viewedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* お気に入りレポート */}
        {favoriteReports.length > 0 && (
          <div className={homeStyles.favoriteSection}>
            <h2 className={homeStyles.sectionTitle}>
              <span className={homeStyles.sectionIcon}>⭐</span>
              お気に入りレポート
            </h2>
            <div className={homeStyles.favoriteList}>
              <p className={homeStyles.favoriteNote}>
                {favoriteReports.length}個のレポートがお気に入りに登録されています
              </p>
            </div>
          </div>
        )}
      </div>
      <DashboardButton />
    </div>
  );
}