'use client';

import React, { useState } from 'react';

interface NewEmployeeListProps {
  facility: 'all' | 'obara' | 'tategami';
}

interface NewEmployee {
  id: string;
  name: string;
  photo: string;
  joinDate: string;
  daysElapsed: number;
  department: string;
  position: string;
  employmentType: string;
  recruitmentRoute: string;
  progress: number;
  status: 'good' | 'warning' | 'alert';
  statusText: string;
  trialPeriodEnd: string;
  trialPeriodStatus: 'good' | 'warning' | 'alert';
  onboardingProgress: number;
  requiredTrainingComplete: boolean;
  mentorAssigned: boolean;
  firstInterviewDate?: string;
  nextInterviewDate?: string;
  facility: string;
}

export function NewEmployeeList({ facility }: NewEmployeeListProps) {
  const [sortBy, setSortBy] = useState<'joinDate' | 'progress' | 'status'>('joinDate');
  const [filterPeriod, setFilterPeriod] = useState<'1month' | '3months' | '6months' | '1year'>('1year');

  // サンプルデータ（実際の実装では、APIから取得）
  const allEmployees: NewEmployee[] = [
    {
      id: 'NS-2024-101',
      name: '山田太郎',
      photo: '👤',
      joinDate: '2024/7/1',
      daysElapsed: 20,
      department: '内科',
      position: '研修中',
      employmentType: '正社員',
      recruitmentRoute: '新卒',
      progress: 60,
      status: 'good',
      statusText: '順調',
      trialPeriodEnd: '2024/9/30',
      trialPeriodStatus: 'good',
      onboardingProgress: 60,
      requiredTrainingComplete: false,
      mentorAssigned: true,
      firstInterviewDate: '2024/7/15',
      nextInterviewDate: '2024/8/1',
      facility: '小原病院'
    },
    {
      id: 'NS-2024-102',
      name: '佐藤花子',
      photo: '👤',
      joinDate: '2024/6/15',
      daysElapsed: 35,
      department: '外科',
      position: '看護師',
      employmentType: '正社員',
      recruitmentRoute: '中途',
      progress: 85,
      status: 'good',
      statusText: '順調',
      trialPeriodEnd: '2024/9/14',
      trialPeriodStatus: 'good',
      onboardingProgress: 85,
      requiredTrainingComplete: true,
      mentorAssigned: true,
      firstInterviewDate: '2024/6/30',
      nextInterviewDate: '2024/7/30',
      facility: '小原病院'
    },
    {
      id: 'NS-2024-103',
      name: '田中一郎',
      photo: '👤',
      joinDate: '2024/7/10',
      daysElapsed: 10,
      department: 'リハビリ科',
      position: '理学療法士',
      employmentType: '正社員',
      recruitmentRoute: '紹介',
      progress: 30,
      status: 'warning',
      statusText: '要観察',
      trialPeriodEnd: '2024/10/9',
      trialPeriodStatus: 'warning',
      onboardingProgress: 30,
      requiredTrainingComplete: false,
      mentorAssigned: false,
      firstInterviewDate: undefined,
      nextInterviewDate: '2024/7/25',
      facility: '立神リハビリテーション温泉病院'
    },
    {
      id: 'NS-2024-104',
      name: '鈴木美咲',
      photo: '👤',
      joinDate: '2024/4/1',
      daysElapsed: 110,
      department: '地域包括ケア',
      position: '看護師',
      employmentType: '正社員',
      recruitmentRoute: '新卒',
      progress: 95,
      status: 'good',
      statusText: '優秀',
      trialPeriodEnd: '2024/6/30',
      trialPeriodStatus: 'good',
      onboardingProgress: 95,
      requiredTrainingComplete: true,
      mentorAssigned: true,
      firstInterviewDate: '2024/4/15',
      nextInterviewDate: '2024/8/1',
      facility: '立神リハビリテーション温泉病院'
    },
    {
      id: 'NS-2024-105',
      name: '高橋健太',
      photo: '👤',
      joinDate: '2024/5/15',
      daysElapsed: 66,
      department: '薬剤部',
      position: '薬剤師',
      employmentType: '正社員',
      recruitmentRoute: '中途',
      progress: 70,
      status: 'good',
      statusText: '順調',
      trialPeriodEnd: '2024/8/14',
      trialPeriodStatus: 'good',
      onboardingProgress: 70,
      requiredTrainingComplete: true,
      mentorAssigned: true,
      firstInterviewDate: '2024/5/30',
      nextInterviewDate: '2024/8/15',
      facility: '小原病院'
    }
  ];

  // フィルタリング処理
  const filterByFacility = (employees: NewEmployee[]) => {
    if (facility === 'all') return employees;
    if (facility === 'obara') return employees.filter(e => e.facility === '小原病院');
    if (facility === 'tategami') return employees.filter(e => e.facility === '立神リハビリテーション温泉病院');
    return employees;
  };

  const filterByPeriod = (employees: NewEmployee[]) => {
    const periodDays = {
      '1month': 30,
      '3months': 90,
      '6months': 180,
      '1year': 365
    };
    
    const maxDays = periodDays[filterPeriod];
    return employees.filter(e => e.daysElapsed <= maxDays);
  };

  const sortEmployees = (employees: NewEmployee[]) => {
    return [...employees].sort((a, b) => {
      switch (sortBy) {
        case 'joinDate':
          return b.daysElapsed - a.daysElapsed; // 新しい順
        case 'progress':
          return a.progress - b.progress; // 進捗が低い順
        case 'status':
          const statusOrder = { alert: 0, warning: 1, good: 2 };
          return statusOrder[a.status] - statusOrder[b.status];
        default:
          return 0;
      }
    });
  };

  const filteredEmployees = sortEmployees(filterByPeriod(filterByFacility(allEmployees)));

  const getStatusBadge = (status: 'good' | 'warning' | 'alert') => {
    const styles = {
      good: 'bg-green-100 text-green-800 border-green-300',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      alert: 'bg-red-100 text-red-800 border-red-300'
    };
    
    const icons = {
      good: '🟢',
      warning: '🟡',
      alert: '🔴'
    };
    
    return { style: styles[status], icon: icons[status] };
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div>
      {/* フィルター */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">期間:</span>
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1month">1ヶ月以内</option>
            <option value="3months">3ヶ月以内</option>
            <option value="6months">6ヶ月以内</option>
            <option value="1year">1年以内</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">並び替え:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="joinDate">入職日順</option>
            <option value="progress">進捗率順</option>
            <option value="status">状態順</option>
          </select>
        </div>
      </div>

      {/* 新入職員リスト */}
      <div className="space-y-3">
        {filteredEmployees.map((employee) => {
          const statusBadge = getStatusBadge(employee.status);
          
          return (
            <div
              key={employee.id}
              className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
            >
              <div className="flex items-center gap-4">
                {/* 写真 */}
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {employee.name[0]}
                </div>
                
                {/* 基本情報 */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-800">{employee.name}</h4>
                    <span className="text-xs text-gray-500">#{employee.id}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{employee.department} / {employee.position}</span>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                      {employee.employmentType} / {employee.recruitmentRoute}
                    </span>
                  </div>
                </div>
                
                {/* 入職情報 */}
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-800">{employee.joinDate}</div>
                  <div className="text-xs text-gray-500">({employee.daysElapsed}日目)</div>
                </div>
                
                {/* 進捗 */}
                <div className="w-32">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-full rounded-full ${getProgressColor(employee.progress)}`}
                        style={{ width: `${employee.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-700">{employee.progress}%</span>
                  </div>
                  <div className="text-xs text-gray-500">オンボーディング</div>
                </div>
                
                {/* 状態 */}
                <div className="text-center">
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${statusBadge.style}`}>
                    <span>{statusBadge.icon}</span>
                    <span>{employee.statusText}</span>
                  </div>
                </div>
                
                {/* アクション */}
                <div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    詳細 →
                  </button>
                </div>
              </div>
              
              {/* 追加情報（警告がある場合） */}
              {(employee.status === 'warning' || employee.status === 'alert' || !employee.mentorAssigned || !employee.requiredTrainingComplete) && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex gap-4 text-xs">
                    {!employee.mentorAssigned && (
                      <span className="text-red-600 font-medium">⚠️ メンター未割当</span>
                    )}
                    {!employee.requiredTrainingComplete && (
                      <span className="text-yellow-600 font-medium">📚 必須研修未完了</span>
                    )}
                    {employee.trialPeriodStatus !== 'good' && (
                      <span className="text-yellow-600 font-medium">⏰ 試用期間要観察</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* データがない場合 */}
      {filteredEmployees.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>該当する新入職員がいません</p>
        </div>
      )}
    </div>
  );
}