import React from 'react';
import Link from 'next/link';
import ScrollToTopButton from '@/components/ScrollToTopButton';

interface TurnoverAnalysisTabProps {
  selectedFacility: string;
}

// 離職分析レポート定義
const turnoverReports = [
  {
    id: 'risk-prediction',
    title: '離職リスク予測',
    description: '個別職員の離職リスクを分析し、早期対応を支援します',
    icon: '⚠️',
    color: 'bg-red-500',
    path: '/reports/turnover/risk-prediction'
  },
  {
    id: 'high-risk-dashboard',
    title: '高リスク職員ダッシュボード',
    description: '離職リスクが高い職員の一覧と対応状況を管理します',
    icon: '📊',
    color: 'bg-orange-500',
    path: '/reports/turnover/high-risk-dashboard'
  },
  {
    id: 'correlation-analysis',
    title: '離職要因分析',
    description: '離職に関連する要因を統計的に分析します',
    icon: '📈',
    color: 'bg-purple-500',
    path: '/reports/turnover/correlation-analysis'
  },
  {
    id: 'factor-ranking',
    title: '要因ランキング',
    description: '離職に影響する要因を重要度順に表示します',
    icon: '🏆',
    color: 'bg-green-500',
    path: '/reports/turnover/factor-ranking'
  },
  {
    id: 'predictive-modeling',
    title: '予測モデリング',
    description: '高度な分析手法で離職を予測します',
    icon: '🤖',
    color: 'bg-indigo-500',
    path: '/reports/turnover/predictive-modeling'
  },
  {
    id: 'what-if-simulation',
    title: 'What-ifシミュレーション',
    description: '施策実施時の離職率変化をシミュレーションします',
    icon: '🔮',
    color: 'bg-blue-500',
    path: '/reports/turnover/what-if-simulation'
  },
  {
    id: 'improvement-suggestions',
    title: '改善提案',
    description: '離職防止のための具体的な施策を提案します',
    icon: '💡',
    color: 'bg-yellow-500',
    path: '/reports/turnover/improvement-suggestions'
  },
  {
    id: 'retention-strategies',
    title: '定着戦略レポート',
    description: '部署別・職種別の効果的な定着戦略を策定します',
    icon: '🎯',
    color: 'bg-teal-500',
    path: '/reports/turnover/retention-strategies'
  }
];

export const TurnoverAnalysisTab: React.FC<TurnoverAnalysisTabProps> = ({ selectedFacility }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          離職分析レポート一覧
        </h3>
        <p className="text-gray-600 mb-6">
          職員の離職リスクを予測し、要因を分析することで、効果的な人材定着施策を支援します。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {turnoverReports.map((report) => (
          <Link
            key={report.id}
            href={`${report.path}${selectedFacility ? `?facility=${selectedFacility}` : ''}`}
            className="block"
          >
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 h-full">
              <div className="flex items-center mb-4">
                <div className={`${report.color} text-white rounded-lg p-3 text-2xl`}>
                  {report.icon}
                </div>
                <h3 className="ml-4 text-lg font-semibold text-gray-900">
                  {report.title}
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {report.description}
              </p>
              <div className="mt-auto flex items-center text-blue-600">
                <span className="text-sm">レポートを見る</span>
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <ScrollToTopButton />
    </div>
  );
}