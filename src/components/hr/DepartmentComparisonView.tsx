'use client';

import React, { useState, useMemo } from 'react';
import { DeploymentStaff } from '@/lib/hr/deploymentData';
import { CareerCourseCode } from '@/types/staff';

interface DepartmentComparisonViewProps {
  staff: DeploymentStaff[];
}

const COURSE_COLORS: Record<CareerCourseCode, { bg: string; text: string; label: string }> = {
  A: { bg: 'bg-red-100', text: 'text-red-700', label: 'A' },
  B: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'B' },
  C: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'C' },
  D: { bg: 'bg-green-100', text: 'text-green-700', label: 'D' }
};

export default function DepartmentComparisonView({ staff }: DepartmentComparisonViewProps) {
  const [selectedDepartments, setSelectedDepartments] = useState<Array<{facilityId: string; department: string}>>([]);

  const departmentList = useMemo(() => {
    const deptMap = new Map<string, {facilityId: string; facilityName: string; department: string; count: number}>();
    staff.forEach(s => {
      const key = `${s.facilityId}_${s.department}`;
      if (!deptMap.has(key)) {
        deptMap.set(key, {
          facilityId: s.facilityId,
          facilityName: s.facilityName,
          department: s.department,
          count: 0
        });
      }
      deptMap.get(key)!.count++;
    });
    return Array.from(deptMap.values()).sort((a, b) =>
      a.facilityName.localeCompare(b.facilityName) || a.department.localeCompare(b.department)
    );
  }, [staff]);

  const facilityGroups = useMemo(() => {
    const groups = new Map<string, typeof departmentList>();
    departmentList.forEach(dept => {
      if (!groups.has(dept.facilityId)) {
        groups.set(dept.facilityId, []);
      }
      groups.get(dept.facilityId)!.push(dept);
    });
    return groups;
  }, [departmentList]);

  const handleDepartmentToggle = (facilityId: string, department: string) => {
    const exists = selectedDepartments.some(d => d.facilityId === facilityId && d.department === department);
    if (exists) {
      setSelectedDepartments(selectedDepartments.filter(d => !(d.facilityId === facilityId && d.department === department)));
    } else if (selectedDepartments.length < 3) {
      setSelectedDepartments([...selectedDepartments, {facilityId, department}]);
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
          <span className="text-2xl">📂</span>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">部署別比較ビュー</h3>
            <p className="text-sm text-blue-700">
              最大3つの部署を選択して、職員配置状況を並列比較できます。
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>📂</span>
          <span>比較する部署を選択 (最大3つ)</span>
          <span className="ml-auto text-sm text-gray-500">
            選択中: {selectedDepartments.length}/3
          </span>
        </h3>

        <div className="space-y-4">
          {Array.from(facilityGroups.entries()).map(([facilityId, depts]) => (
            <div key={facilityId}>
              <div className="text-sm font-medium text-gray-600 mb-2">
                {depts[0].facilityName}
              </div>
              <div className="flex flex-wrap gap-2">
                {depts.map(dept => {
                  const isSelected = selectedDepartments.some(d => d.facilityId === dept.facilityId && d.department === dept.department);
                  const isDisabled = !isSelected && selectedDepartments.length >= 3;

                  return (
                    <button
                      key={`${dept.facilityId}_${dept.department}`}
                      onClick={() => handleDepartmentToggle(dept.facilityId, dept.department)}
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
                      {dept.department} ({dept.count}名)
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedDepartments.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <div className="text-gray-600 font-medium">部署を選択してください</div>
          <div className="text-sm text-gray-500 mt-1">
            上記から比較したい部署を選択すると、職員一覧が表示されます
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>👥</span>
            <span>職員一覧（並列比較）</span>
          </h3>
          <div className={`grid gap-4 ${
            selectedDepartments.length === 1 ? 'grid-cols-1' :
            selectedDepartments.length === 2 ? 'grid-cols-2' :
            'grid-cols-3'
          }`}>
            {selectedDepartments.map((selected, index) => {
              const deptStaff = staff.filter(s => s.facilityId === selected.facilityId && s.department === selected.department);
              const deptInfo = departmentList.find(d => d.facilityId === selected.facilityId && d.department === selected.department);

              return (
                <div key={`${selected.facilityId}_${selected.department}`} className="space-y-2">
                  <div className={`bg-gradient-to-r ${gradients[index]} text-white px-4 py-2 rounded-t-lg font-medium text-sm sticky top-0 z-10`}>
                    {deptInfo?.facilityName} / {selected.department}（{deptStaff.length}名）
                  </div>
                  <div className="max-h-[600px] overflow-y-auto space-y-1">
                    {deptStaff.map(s => {
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
