import React from 'react';
import Link from 'next/link';
import { allReports } from '@/types/reports';
import ScrollToTopButton from '@/components/ScrollToTopButton';

interface StrategicAnalysisTabProps {
  selectedFacility: string;
}

export default function StrategicAnalysisTab({ selectedFacility }: StrategicAnalysisTabProps) {
  const strategicReports = allReports.filter(report => report.type === 'strategic');

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          戦略分析レポート一覧
        </h3>
        <p className="text-gray-600 mb-6">
          組織の成長と改善のための戦略的な分析レポートです。中長期的な計画立案や意思決定にご活用ください。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {strategicReports.map((report) => (
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