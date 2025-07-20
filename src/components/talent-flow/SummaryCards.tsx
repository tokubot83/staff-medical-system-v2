'use client';

import React from 'react';

interface SummaryCardsProps {
  facility: 'all' | 'obara' | 'tategami';
}

export function SummaryCards({ facility }: SummaryCardsProps) {
  // 施設別のデータ（実際の実装では、APIやデータソースから取得）
  const getData = () => {
    const baseData = {
      all: {
        newEmployees: { count: 15, change: 25, trend: 'up' },
        exitPlanned: { count: 3, change: 1, trend: 'up' },
        highRisk: { count: 8, change: 2, trend: 'up' },
        longAbsence: { count: 5, change: 0, trend: 'neutral' }
      },
      obara: {
        newEmployees: { count: 9, change: 20, trend: 'up' },
        exitPlanned: { count: 2, change: 1, trend: 'up' },
        highRisk: { count: 5, change: 1, trend: 'up' },
        longAbsence: { count: 3, change: 0, trend: 'neutral' }
      },
      tategami: {
        newEmployees: { count: 6, change: 30, trend: 'up' },
        exitPlanned: { count: 1, change: 0, trend: 'neutral' },
        highRisk: { count: 3, change: 1, trend: 'up' },
        longAbsence: { count: 2, change: 0, trend: 'neutral' }
      }
    };

    return baseData[facility];
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