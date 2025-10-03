'use client';

import React, { useMemo } from 'react';
import { DeploymentStaff } from '@/lib/hr/deploymentData';
import { CareerCourseCode } from '@/types/staff';

interface DeploymentTableProps {
  staff: DeploymentStaff[];
}

// コース別の色定義
const COURSE_COLORS: Record<CareerCourseCode, { bg: string; text: string; label: string }> = {
  A: { bg: 'bg-red-100', text: 'text-red-700', label: '🔴 A' },
  B: { bg: 'bg-orange-100', text: 'text-orange-700', label: '🟠 B' },
  C: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '🟡 C' },
  D: { bg: 'bg-green-100', text: 'text-green-700', label: '🟢 D' }
};

// 施設別の背景色
const FACILITY_BG_COLORS: Record<string, string> = {
  'obara-hospital': 'bg-red-50',
  'tategami-rehabilitation': 'bg-blue-50',
  'espoir-tategami': 'bg-green-50',
  'group-home-hojuan': 'bg-purple-50',
  'visiting-nurse-station-tategami': 'bg-pink-50'
};

export default function DeploymentTable({ staff }: DeploymentTableProps) {
  // 施設でグループ化
  const groupedStaff = useMemo(() => {
    const groups: { facilityId: string; facilityName: string; staff: DeploymentStaff[] }[] = [];
    const facilityMap = new Map<string, DeploymentStaff[]>();

    staff.forEach(s => {
      if (!facilityMap.has(s.facilityId)) {
        facilityMap.set(s.facilityId, []);
      }
      facilityMap.get(s.facilityId)!.push(s);
    });

    facilityMap.forEach((staffList, facilityId) => {
      groups.push({
        facilityId,
        facilityName: staffList[0].facilityName,
        staff: staffList
      });
    });

    return groups;
  }, [staff]);

  // フラット化されたリスト（施設ヘッダー含む）
  const flattenedRows = useMemo(() => {
    const rows: Array<{ type: 'header' | 'staff'; data: any }> = [];

    groupedStaff.forEach(group => {
      // 施設ヘッダー
      rows.push({
        type: 'header',
        data: {
          facilityId: group.facilityId,
          facilityName: group.facilityName,
          count: group.staff.length
        }
      });

      // 職員データ
      group.staff.forEach(s => {
        rows.push({
          type: 'staff',
          data: s
        });
      });
    });

    return rows;
  }, [groupedStaff]);

  // 行レンダラー
  const renderRow = (row: { type: 'header' | 'staff'; data: any }, index: number) => {
    if (row.type === 'header') {
      const { facilityId, facilityName, count } = row.data;
      return (
        <div
          key={`header-${facilityId}`}
          className={`${FACILITY_BG_COLORS[facilityId] || 'bg-gray-50'} font-bold text-sm border-b-2 border-gray-400 flex items-center px-4 h-9`}
        >
          <span className="text-gray-800">{facilityName}</span>
          <span className="ml-3 text-gray-600 text-xs">（{count}名）</span>
        </div>
      );
    }

    // 職員行
    const s = row.data as DeploymentStaff;
    const courseColor = COURSE_COLORS[s.careerCourse];
    const facilityBg = FACILITY_BG_COLORS[s.facilityId] || 'bg-white';

    return (
      <div
        key={s.id}
        className={`${facilityBg} border-b border-gray-200 hover:bg-gray-100 transition-colors flex items-center text-xs h-9`}
      >
        {/* 施設名（省略） */}
        <div className="w-20 px-2 truncate text-gray-600"></div>

        {/* 部署 */}
        <div className="w-32 px-2 truncate font-medium text-gray-700">
          {s.department}
        </div>

        {/* 氏名 */}
        <div className="w-28 px-2 truncate font-semibold text-gray-800">
          {s.name}
        </div>

        {/* 役職 */}
        <div className="w-36 px-2 truncate text-gray-700">
          {s.position}
        </div>

        {/* コース */}
        <div className="w-16 px-2">
          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${courseColor.bg} ${courseColor.text}`}>
            {courseColor.label}
          </span>
        </div>

        {/* リーダー可否 */}
        <div className="w-16 px-2 text-center">
          {s.canPerformLeaderDuty === true && (
            <span className="text-green-600 font-bold">✅</span>
          )}
          {s.canPerformLeaderDuty === false && (
            <span className="text-gray-400">⛔</span>
          )}
          {s.canPerformLeaderDuty === null && (
            <span className="text-gray-300">-</span>
          )}
        </div>

        {/* 権限レベル */}
        <div className="w-20 px-2 text-gray-600">
          Lv.{s.accountLevel}
        </div>

        {/* 職員ID */}
        <div className="w-24 px-2 truncate text-gray-500 text-xs">
          {s.employeeId}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* テーブルヘッダー（固定） */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-600 text-white font-bold text-xs py-3 px-4 flex items-center sticky top-0 z-20 shadow-md">
        <div className="w-20 px-2">施設</div>
        <div className="w-32 px-2">部署</div>
        <div className="w-28 px-2">氏名</div>
        <div className="w-36 px-2">役職</div>
        <div className="w-16 px-2">コース</div>
        <div className="w-16 px-2 text-center">LD可</div>
        <div className="w-20 px-2">権限Lv</div>
        <div className="w-24 px-2">職員ID</div>
      </div>

      {/* スクロール可能なリスト */}
      <div className="overflow-y-auto" style={{ maxHeight: '700px' }}>
        {flattenedRows.map((row, index) => renderRow(row, index))}
      </div>

      {/* フッター統計 */}
      <div className="bg-slate-100 border-t-2 border-slate-300 px-4 py-3 text-xs text-gray-700">
        <div className="flex items-center gap-6">
          <div>
            <span className="font-semibold">総職員数:</span>{' '}
            <span className="text-lg font-bold text-slate-700">{staff.length}名</span>
          </div>
          <div className="flex gap-3">
            <span className="font-semibold">コース別:</span>
            {(['A', 'B', 'C', 'D'] as CareerCourseCode[]).map(course => {
              const count = staff.filter(s => s.careerCourse === course).length;
              const color = COURSE_COLORS[course];
              return (
                <span key={course} className="flex items-center gap-1">
                  <span className={`inline-block w-3 h-3 rounded-full ${color.bg}`}></span>
                  <span className="font-medium">{course}:</span>
                  <span className="font-bold">{count}名</span>
                </span>
              );
            })}
          </div>
          <div>
            <span className="font-semibold">リーダー可能:</span>{' '}
            <span className="font-bold text-green-600">
              {staff.filter(s => s.canPerformLeaderDuty === true).length}名
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
