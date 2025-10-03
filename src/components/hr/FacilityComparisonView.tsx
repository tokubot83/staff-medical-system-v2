'use client';

import React, { useState, useMemo } from 'react';
import { DeploymentStaff } from '@/lib/hr/deploymentData';
import { FACILITY_ID_MAP } from '@/lib/facility-position-mapping';
import { CareerCourseCode } from '@/types/staff';

interface FacilityComparisonViewProps {
  staff: DeploymentStaff[];
}

const COURSE_COLORS: Record<CareerCourseCode, { bg: string; text: string; label: string }> = {
  A: { bg: 'bg-red-100', text: 'text-red-700', label: 'A' },
  B: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'B' },
  C: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'C' },
  D: { bg: 'bg-green-100', text: 'text-green-700', label: 'D' }
};

export default function FacilityComparisonView({ staff }: FacilityComparisonViewProps) {
  const [selectedFacilityIds, setSelectedFacilityIds] = useState<string[]>([]);

  const facilities = useMemo(() => {
    return Object.entries(FACILITY_ID_MAP).map(([id, name]) => ({
      id,
      name
    }));
  }, []);

  const handleFacilityToggle = (facilityId: string) => {
    if (selectedFacilityIds.includes(facilityId)) {
      setSelectedFacilityIds(selectedFacilityIds.filter(id => id !== facilityId));
    } else if (selectedFacilityIds.length < 3) {
      setSelectedFacilityIds([...selectedFacilityIds, facilityId]);
    }
  };

  const colors = ['border-blue-500', 'border-green-500', 'border-purple-500'];
  const gradients = [
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600',
    'from-purple-500 to-purple-600'
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🏥</span>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">施設別比較ビュー</h3>
            <p className="text-sm text-blue-700">
              最大3つの施設を選択して、職員配置状況を並列比較できます。
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>🏥</span>
          <span>比較する施設を選択 (最大3つ)</span>
          <span className="ml-auto text-sm text-gray-500">
            選択中: {selectedFacilityIds.length}/3
          </span>
        </h3>

        <div className="flex flex-wrap gap-2">
          {facilities.map(facility => {
            const isSelected = selectedFacilityIds.includes(facility.id);
            const isDisabled = !isSelected && selectedFacilityIds.length >= 3;

            return (
              <button
                key={facility.id}
                onClick={() => handleFacilityToggle(facility.id)}
                disabled={isDisabled}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md'
                    : isDisabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isSelected && '✓ '}
                {facility.name}
              </button>
            );
          })}
        </div>
      </div>

      {selectedFacilityIds.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <div className="text-gray-600 font-medium">施設を選択してください</div>
          <div className="text-sm text-gray-500 mt-1">
            上記から比較したい施設を選択すると、職員一覧が表示されます
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>👥</span>
            <span>職員一覧（並列比較）</span>
          </h3>
          <div className={`grid gap-4 ${
            selectedFacilityIds.length === 1 ? 'grid-cols-1' :
            selectedFacilityIds.length === 2 ? 'grid-cols-2' :
            'grid-cols-3'
          }`}>
            {selectedFacilityIds.map((facilityId, index) => {
              const facilityStaff = staff.filter(s => s.facilityId === facilityId);
              const facilityName = FACILITY_ID_MAP[facilityId];

              return (
                <div key={facilityId} className="space-y-2">
                  <div className={`bg-gradient-to-r ${gradients[index]} text-white px-4 py-2 rounded-t-lg font-medium text-sm sticky top-0 z-10`}>
                    {facilityName}（{facilityStaff.length}名）
                  </div>
                  <div className="max-h-[600px] overflow-y-auto space-y-1">
                    {facilityStaff.map(s => {
                      const courseColor = COURSE_COLORS[s.careerCourse];
                      return (
                        <div
                          key={s.employeeId}
                          className={`border-l-4 ${colors[index]} bg-gray-50 hover:bg-gray-100 p-3 rounded transition-colors`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-800">{s.name}</span>
                            <span className={`${courseColor.bg} ${courseColor.text} text-xs px-2 py-0.5 rounded-full font-bold`}>
                              {courseColor.label}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 space-y-0.5">
                            <div>{s.department}</div>
                            <div>{s.position}</div>
                            <div className="flex items-center gap-2">
                              <span>権限Lv.{s.accountLevel}</span>
                              <span>
                                {s.canPerformLeaderDuty === true ? '✅ LD可' :
                                 s.canPerformLeaderDuty === false ? '⛔ LD不可' : '-'}
                              </span>
                            </div>
                            <div className="text-gray-400">{s.employeeId}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
