import React from 'react';
import { useRouter } from 'next/navigation';

interface Report {
  id: string;
  title: string;
  path: string;
  description: string;
  icon: string;
  gradient: string;
}

interface ReportNavigationCardProps {
  report: Report;
  selectedFacility: string;
}

export default function ReportNavigationCard({ report, selectedFacility }: ReportNavigationCardProps) {
  const router = useRouter();

  const handleClick = () => {
    const url = selectedFacility 
      ? `${report.path}?facility=${encodeURIComponent(selectedFacility)}`
      : report.path;
    router.push(url);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
    >
      <div className={`h-2 bg-gradient-to-r ${report.gradient}`} />
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{report.icon}</span>
          <h3 className="text-xl font-semibold">{report.title}</h3>
        </div>
        <p className="text-gray-600">{report.description}</p>
      </div>
    </div>
  );
}