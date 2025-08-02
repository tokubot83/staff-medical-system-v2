'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import CategoryBackButton from '@/components/reports/CategoryBackButton';

interface ReportItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  status: 'available' | 'coming-soon';
}

const dualAxisReports: ReportItem[] = [
  {
    id: 'performance-matrix',
    title: 'パフォーマンスマトリクス',
    description: '個人のスキルと成果を2軸で評価し、4象限で分類・可視化',
    icon: '📊',
    path: '/reports/dual-axis/performance-matrix',
    status: 'available'
  },
  {
    id: 'team-analysis',
    title: 'チーム評価分析',
    description: 'チーム単位での2軸評価の集計と比較分析',
    icon: '👥',
    path: '/reports/dual-axis/team-analysis',
    status: 'available'
  },
  {
    id: 'department-comparison',
    title: '部門別比較',
    description: '部門間の2軸評価スコアと分布の比較分析',
    icon: '🏢',
    path: '/reports/dual-axis/department-comparison',
    status: 'available'
  },
  {
    id: 'organization-optimization',
    title: '組織全体最適化',
    description: '2軸評価に基づく組織改善シナリオのシミュレーション',
    icon: '🎯',
    path: '/reports/dual-axis/organization-optimization',
    status: 'available'
  },
  {
    id: 'evaluation-trend',
    title: '評価推移分析',
    description: '個人・チーム・部門の2軸評価の時系列変化を追跡',
    icon: '📈',
    path: '/reports/dual-axis/evaluation-trend',
    status: 'coming-soon'
  },
  {
    id: 'cluster-analysis',
    title: 'クラスター分析',
    description: '類似パフォーマンス特性を持つ職員グループの特定と分析',
    icon: '🔍',
    path: '/reports/dual-axis/cluster-analysis',
    status: 'coming-soon'
  }
];

export default function DualAxisReportsPage() {
  const router = useRouter();

  const handleReportClick = (report: ReportItem) => {
    if (report.status === 'available') {
      router.push(report.path);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="2軸評価分析" />
      
      <div className="max-w-7xl mx-auto p-6">
        <CategoryBackButton />
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">2軸評価分析レポート</h2>
            <p className="text-gray-600">
              スキルと成果の2軸で職員パフォーマンスを多角的に評価・分析するレポート群です。
              個人からチーム、部門、組織全体まで、様々なレベルでの分析が可能です。
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">2軸評価分析の特徴</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• スキルレベルと成果・業績の2つの軸で総合的に評価</li>
              <li>• 4象限分類による直感的な人材ポートフォリオの把握</li>
              <li>• 個人の成長軌跡や組織の改善ポイントの可視化</li>
              <li>• データに基づく戦略的な人材育成・配置の意思決定支援</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dualAxisReports.map(report => (
              <div
                key={report.id}
                className={`border rounded-lg p-6 transition-all ${
                  report.status === 'available' 
                    ? 'hover:shadow-md cursor-pointer hover:border-blue-300' 
                    : 'opacity-60 cursor-not-allowed bg-gray-50'
                }`}
                onClick={() => handleReportClick(report)}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{report.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{report.title}</h3>
                    {report.status === 'coming-soon' && (
                      <span className="inline-block mt-1 px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                        準備中
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{report.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-3">推奨される分析フロー</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">1</span>
                <span>パフォーマンスマトリクスで個人の現状を把握</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">2</span>
                <span>チーム評価分析でチーム単位の傾向を確認</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">3</span>
                <span>部門別比較で組織全体のバランスを評価</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">4</span>
                <span>組織全体最適化で改善シナリオを検討</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScrollToTopButton />
      <DashboardButton />
    </div>
  );
}