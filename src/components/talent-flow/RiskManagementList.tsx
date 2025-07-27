'use client';

import React, { useState } from 'react';
import { demoRiskEmployees, type RiskEmployee } from '@/app/data/demoTalentFlowData';

interface RiskManagementListProps {
  facility: 'all' | 'obara' | 'tategami';
}

type RiskCategory = 'exit' | 'highRisk' | 'longAbsence' | 'retirement';

export function RiskManagementList({ facility }: RiskManagementListProps) {
  const [activeCategory, setActiveCategory] = useState<RiskCategory | 'all'>('all');

  // デモデータを使用
  const allRiskEmployees: RiskEmployee[] = demoRiskEmployees;

  // フィルタリング処理
  const filterByFacility = (employees: RiskEmployee[]) => {
    if (facility === 'all') return employees;
    if (facility === 'obara') return employees.filter(e => e.facility === '小原病院');
    if (facility === 'tategami') return employees.filter(e => e.facility === '立神リハビリテーション温泉病院');
    return employees;
  };

  const filterByCategory = (employees: RiskEmployee[]) => {
    if (activeCategory === 'all') return employees;
    return employees.filter(e => e.category === activeCategory);
  };

  const filteredEmployees = filterByCategory(filterByFacility(allRiskEmployees));

  const categoryLabels = {
    exit: '退職',
    highRisk: '⚠️',
    longAbsence: '🛏️',
    retirement: '👴'
  };

  const getCategoryColor = (category: RiskCategory) => {
    const colors = {
      exit: 'text-red-600',
      highRisk: 'text-yellow-600',
      longAbsence: 'text-blue-600',
      retirement: 'text-purple-600'
    };
    return colors[category];
  };

  const getRiskScoreColor = (score?: number) => {
    if (!score) return '';
    if (score >= 80) return 'text-red-600 bg-red-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-blue-600 bg-blue-100';
  };

  const getReemploymentText = (intention?: 'yes' | 'no' | 'considering') => {
    const texts = {
      yes: '再雇用〇',
      no: '再雇用×',
      considering: '検討中'
    };
    return texts[intention || 'considering'];
  };

  return (
    <div>
      {/* カテゴリフィルター */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
          }`}
        >
          全て ({allRiskEmployees.length}名)
        </button>
        <button
          onClick={() => setActiveCategory('exit')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeCategory === 'exit'
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
          }`}
        >
          退職予定 ({allRiskEmployees.filter(e => e.category === 'exit').length}名)
        </button>
        <button
          onClick={() => setActiveCategory('highRisk')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeCategory === 'highRisk'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
          }`}
        >
          高リスク ({allRiskEmployees.filter(e => e.category === 'highRisk').length}名)
        </button>
        <button
          onClick={() => setActiveCategory('longAbsence')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeCategory === 'longAbsence'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
          }`}
        >
          長期休職 ({allRiskEmployees.filter(e => e.category === 'longAbsence').length}名)
        </button>
        <button
          onClick={() => setActiveCategory('retirement')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeCategory === 'retirement'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
          }`}
        >
          定年間近 ({allRiskEmployees.filter(e => e.category === 'retirement').length}名)
        </button>
      </div>

      {/* リスク管理リスト */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">区分</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">氏名</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">部署・役職</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">予定日</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">リスク度</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">対応状況</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">アクション</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <span className={`text-2xl ${getCategoryColor(employee.category)}`}>
                    {categoryLabels[employee.category]}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <div className="font-semibold text-gray-800">{employee.name}</div>
                    <div className="text-xs text-gray-500">#{employee.id}</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-gray-600">
                    {employee.department} / {employee.position}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm">
                    {employee.category === 'exit' && employee.exitDate}
                    {employee.category === 'highRisk' && '-'}
                    {employee.category === 'longAbsence' && employee.returnDate}
                    {employee.category === 'retirement' && employee.retirementDate}
                  </div>
                </td>
                <td className="py-3 px-4">
                  {employee.category === 'highRisk' && employee.riskScore && (
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getRiskScoreColor(employee.riskScore)}`}>
                      {employee.riskScore}% 🔴
                    </div>
                  )}
                  {employee.category !== 'highRisk' && '-'}
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm">
                    {employee.category === 'exit' && (
                      <div>
                        <div>引継{employee.handoverProgress}%</div>
                        <div className="text-xs text-gray-500">{employee.successor}</div>
                      </div>
                    )}
                    {employee.category === 'highRisk' && (
                      <div className="text-xs text-gray-600">
                        {employee.riskFactors?.map((factor, idx) => (
                          <div key={idx}>• {factor}</div>
                        ))}
                      </div>
                    )}
                    {employee.category === 'longAbsence' && (
                      <div>
                        <div>{employee.followUpStatus}</div>
                        <div className="text-xs text-gray-500">{employee.absencePeriod}</div>
                      </div>
                    )}
                    {employee.category === 'retirement' && (
                      <div>
                        <div>{getReemploymentText(employee.reemploymentIntention)}</div>
                        <div className="text-xs text-gray-500">知識移転{employee.knowledgeTransferStatus}%</div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    {employee.category === 'exit' && '後任面接中'}
                    {employee.category === 'highRisk' && employee.recommendedAction}
                    {employee.category === 'longAbsence' && '定期確認'}
                    {employee.category === 'retirement' && '知識移転'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* データがない場合 */}
      {filteredEmployees.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>該当する職員がいません</p>
        </div>
      )}
    </div>
  );
}