'use client';

import React from 'react';
import { demoDepartmentStats } from '@/app/data/demoTalentFlowData';

interface DepartmentStatsProps {
  facility: string;
}

export function DepartmentStats({ facility }: DepartmentStatsProps) {
  const stats = demoDepartmentStats;
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">部署名</th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">現在人数</th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">流入</th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">流出</th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">純増減</th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">増減率</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((dept, index) => {
            const changeRate = ((dept.net / dept.current) * 100).toFixed(1);
            return (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm font-medium text-gray-900">{dept.name}</td>
                <td className="py-3 px-4 text-sm text-center text-gray-700">{dept.current}名</td>
                <td className="py-3 px-4 text-sm text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    +{dept.inflow}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    -{dept.outflow}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-center font-medium">
                  <span className={dept.net >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {dept.net >= 0 ? '+' : ''}{dept.net}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    dept.net >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {dept.net >= 0 ? '+' : ''}{changeRate}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="bg-gray-50">
            <td className="py-3 px-4 text-sm font-semibold text-gray-900">合計</td>
            <td className="py-3 px-4 text-sm text-center font-semibold text-gray-900">
              {stats.reduce((sum, d) => sum + d.current, 0)}名
            </td>
            <td className="py-3 px-4 text-sm text-center font-semibold text-green-600">
              +{stats.reduce((sum, d) => sum + d.inflow, 0)}
            </td>
            <td className="py-3 px-4 text-sm text-center font-semibold text-red-600">
              -{stats.reduce((sum, d) => sum + d.outflow, 0)}
            </td>
            <td className="py-3 px-4 text-sm text-center font-semibold text-gray-600">
              {stats.reduce((sum, d) => sum + d.net, 0)}
            </td>
            <td className="py-3 px-4 text-sm text-center">-</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}