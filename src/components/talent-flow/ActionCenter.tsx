'use client';

import React from 'react';

interface ActionCenterProps {
  facility: 'all' | 'obara' | 'tategami';
}

interface ActionItem {
  id: string;
  type: 'urgent' | 'warning' | 'info';
  title: string;
  description: string;
  targetEmployee?: string;
  dueDate?: string;
  action: string;
}

export function ActionCenter({ facility }: ActionCenterProps) {
  // サンプルデータ（実際の実装では、APIから取得）
  const allActionItems: ActionItem[] = [
    {
      id: '1',
      type: 'urgent',
      title: '新入職員の田中さん：メンター未割当',
      description: '入職2週間経過',
      targetEmployee: '田中一郎',
      dueDate: '即時',
      action: 'メンター割当'
    },
    {
      id: '2',
      type: 'urgent',
      title: '退職リスク高の佐藤さん：緊急面談要請',
      description: '離職リスクスコア85%',
      targetEmployee: '佐藤花子',
      dueDate: '本日中',
      action: '面談実施'
    },
    {
      id: '3',
      type: 'warning',
      title: '定年予定の高橋さん：後継者育成計画未作成',
      description: '退職まで8ヶ月',
      targetEmployee: '高橋三郎',
      dueDate: '今週中',
      action: '計画作成'
    },
    {
      id: '4',
      type: 'info',
      title: '新入職員3名の1ヶ月面談予定',
      description: '山田太郎、佐藤花子、鈴木美咲',
      dueDate: '来週',
      action: '面談予約'
    },
    {
      id: '5',
      type: 'warning',
      title: '長期休職者の伊藤さん：復職準備面談',
      description: '復職予定日まで1ヶ月',
      targetEmployee: '伊藤美咲',
      dueDate: '今週中',
      action: '面談調整'
    }
  ];

  // 施設でのフィルタリング（実際の実装では、職員の所属施設で判断）
  const actionItems = facility === 'all' ? allActionItems : allActionItems.slice(0, 3);

  const getTypeIcon = (type: 'urgent' | 'warning' | 'info') => {
    const icons: Record<'urgent' | 'warning' | 'info', string> = {
      urgent: '🚨',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type];
  };

  const getTypeColor = (type: 'urgent' | 'warning' | 'info') => {
    const colors: Record<'urgent' | 'warning' | 'info', string> = {
      urgent: 'border-l-red-500 bg-red-50',
      warning: 'border-l-yellow-500 bg-yellow-50',
      info: 'border-l-blue-500 bg-blue-50'
    };
    return colors[type];
  };

  const getButtonColor = (type: 'urgent' | 'warning' | 'info') => {
    const colors: Record<'urgent' | 'warning' | 'info', string> = {
      urgent: 'bg-red-500 hover:bg-red-600',
      warning: 'bg-yellow-500 hover:bg-yellow-600',
      info: 'bg-blue-500 hover:bg-blue-600'
    };
    return colors[type];
  };

  const urgentCount = actionItems.filter(item => item.type === 'urgent').length;
  const warningCount = actionItems.filter(item => item.type === 'warning').length;

  return (
    <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          📌 要対応事項
          {urgentCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              緊急 {urgentCount}件
            </span>
          )}
          {warningCount > 0 && (
            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
              要注意 {warningCount}件
            </span>
          )}
        </h3>
        <button className="text-sm text-gray-600 hover:text-gray-800 font-medium">
          すべて表示 →
        </button>
      </div>

      <div className="space-y-3">
        {actionItems.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className={`flex items-start gap-3 p-4 rounded-lg border-l-4 ${getTypeColor(item.type)}`}
          >
            <div className="text-2xl">{getTypeIcon(item.type)}</div>
            <div className="flex-1">
              <div className="font-semibold text-gray-800 mb-1">{item.title}</div>
              <div className="text-sm text-gray-600">
                {item.description}
                {item.dueDate && (
                  <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">
                    期限: {item.dueDate}
                  </span>
                )}
              </div>
            </div>
            <button
              className={`text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors ${getButtonColor(
                item.type
              )}`}
            >
              {item.action}
            </button>
          </div>
        ))}
      </div>

      {actionItems.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          <p>現在、緊急の対応事項はありません</p>
        </div>
      )}

      {actionItems.length > 3 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            他 {actionItems.length - 3} 件の要対応事項を表示
          </button>
        </div>
      )}
    </div>
  );
}