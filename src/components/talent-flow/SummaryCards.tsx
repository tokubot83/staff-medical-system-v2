'use client';

import React from 'react';
import { demoNewEmployees, demoRiskEmployees } from '@/app/data/demoTalentFlowData';

interface SummaryCardsProps {
  facility: 'all' | 'obara' | 'tategami';
}

export function SummaryCards({ facility }: SummaryCardsProps) {
  // デモデータから実際の数値を計算
  const getData = () => {
    // 施設別にフィルタリング
    const filterByFacility = (items: any[], facilityName?: string) => {
      if (facility === 'all') return items;
      if (facility === 'obara') return items.filter(item => item.facility === '小原病院');
      if (facility === 'tategami') return items.filter(item => item.facility === '立神リハビリテーション温泉病院');
      return items;
    };

    // 新入職員数の計算
    const newEmployeesFiltered = filterByFacility(demoNewEmployees);
    const newEmployeesCount = newEmployeesFiltered.length;

    // 退職リスク管理データの計算
    const riskEmployeesFiltered = filterByFacility(demoRiskEmployees);
    const exitPlannedCount = riskEmployeesFiltered.filter(e => e.category === 'exit').length;
    const highRiskCount = riskEmployeesFiltered.filter(e => e.category === 'highRisk').length;
    const longAbsenceCount = riskEmployeesFiltered.filter(e => e.category === 'longAbsence').length;

    // 変化率の計算（デモ用の固定値）
    const getChangeData = () => {
      if (facility === 'all') {
        return {
          newEmployees: { change: 25, trend: 'up' },
          exitPlanned: { change: 2, trend: 'up' },
          highRisk: { change: 3, trend: 'up' },
          longAbsence: { change: 1, trend: 'neutral' }
        };
      } else if (facility === 'obara') {
        return {
          newEmployees: { change: 20, trend: 'up' },
          exitPlanned: { change: 1, trend: 'up' },
          highRisk: { change: 2, trend: 'up' },
          longAbsence: { change: 0, trend: 'neutral' }
        };
      } else {
        return {
          newEmployees: { change: 30, trend: 'up' },
          exitPlanned: { change: 1, trend: 'up' },
          highRisk: { change: 1, trend: 'up' },
          longAbsence: { change: 1, trend: 'neutral' }
        };
      }
    };

    const changeData = getChangeData();

    return {
      newEmployees: { count: newEmployeesCount, ...changeData.newEmployees },
      exitPlanned: { count: exitPlannedCount, ...changeData.exitPlanned },
      highRisk: { count: highRiskCount, ...changeData.highRisk },
      longAbsence: { count: longAbsenceCount, ...changeData.longAbsence }
    };
  };

  const data = getData();

  const cards: Array<{
    icon: string;
    title: string;
    count: number;
    change: string;
    changeType: 'positive' | 'negative' | 'warning' | 'neutral';
    color: 'blue' | 'red' | 'yellow' | 'gray';
  }> = [
    {
      icon: '📥',
      title: '新入職員',
      count: data.newEmployees.count,
      change: `+${data.newEmployees.change}%`,
      changeType: 'positive',
      color: 'blue'
    },
    {
      icon: '📤',
      title: '退職予定',
      count: data.exitPlanned.count,
      change: `前月比+${data.exitPlanned.change}`,
      changeType: 'negative',
      color: 'red'
    },
    {
      icon: '⚠️',
      title: '離職リスク',
      count: data.highRisk.count,
      change: `要注意 +${data.highRisk.change}`,
      changeType: 'warning',
      color: 'yellow'
    },
    {
      icon: '🏥',
      title: '長期休職',
      count: data.longAbsence.count,
      change: `前月比±${data.longAbsence.change}`,
      changeType: 'neutral',
      color: 'gray'
    }
  ];

  const getCardColorClasses = (color: 'blue' | 'red' | 'yellow' | 'gray') => {
    const colorMap: Record<'blue' | 'red' | 'yellow' | 'gray', string> = {
      blue: 'border-t-blue-500 hover:border-blue-300',
      red: 'border-t-red-500 hover:border-red-300',
      yellow: 'border-t-yellow-500 hover:border-yellow-300',
      gray: 'border-t-gray-500 hover:border-gray-300'
    };
    return colorMap[color];
  };

  const getChangeColorClass = (type: 'positive' | 'negative' | 'warning' | 'neutral') => {
    const typeMap: Record<'positive' | 'negative' | 'warning' | 'neutral', string> = {
      positive: 'text-green-600',
      negative: 'text-red-600',
      warning: 'text-yellow-600',
      neutral: 'text-gray-600'
    };
    return typeMap[type];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-white rounded-xl p-5 shadow-md border-t-4 ${getCardColorClasses(
            card.color
          )} hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-3xl">{card.icon}</div>
            <div className={`text-sm font-semibold ${getChangeColorClass(card.changeType)}`}>
              {card.change}
              {card.changeType === 'positive' && ' ↑'}
              {card.changeType === 'negative' && ' ↑'}
              {card.changeType === 'warning' && ' ⚠'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800 mb-1">{card.count}名</div>
            <div className="text-sm text-gray-600 font-medium">{card.title}</div>
          </div>
        </div>
      ))}
    </div>
  );
}