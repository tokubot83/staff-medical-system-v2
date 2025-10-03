'use client';

import React, { useState, useMemo } from 'react';
import { DeploymentStaff } from '@/lib/hr/deploymentData';
import { getWardsByFacility, compareWards, WardStatistics } from '@/lib/hr/wardUtils';
import { CareerCourseCode } from '@/types/staff';

interface WardComparisonViewProps {
  staff: DeploymentStaff[];
}

// コース別の色定義
const COURSE_COLORS: Record<CareerCourseCode, { bg: string; text: string; label: string }> = {
  A: { bg: 'bg-red-100', text: 'text-red-700', label: 'A' },
  B: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'B' },
  C: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'C' },
  D: { bg: 'bg-green-100', text: 'text-green-700', label: 'D' }
};

export default function WardComparisonView({ staff }: WardComparisonViewProps) {
  // 選択された病棟ID（最大3つ）
  const [selectedWardIds, setSelectedWardIds] = useState<string[]>([]);

  // 病棟リスト
  const wards = useMemo(() => getWardsByFacility(staff), [staff]);

  // 施設別病棟リスト
  const wardsByFacility = useMemo(() => {
    const grouped = new Map<string, typeof wards>();
    wards.forEach(ward => {
      if (!grouped.has(ward.facilityId)) {
        grouped.set(ward.facilityId, []);
      }
      grouped.get(ward.facilityId)!.push(ward);
    });
    return grouped;
  }, [wards]);

  // 比較統計データ
  const comparisonStats = useMemo(
    () => compareWards(staff, selectedWardIds),
    [staff, selectedWardIds]
  );

  // 病棟選択ハンドラー
  const handleWardToggle = (wardId: string) => {
    if (selectedWardIds.includes(wardId)) {
      setSelectedWardIds(selectedWardIds.filter(id => id !== wardId));
    } else if (selectedWardIds.length < 3) {
      setSelectedWardIds([...selectedWardIds, wardId]);
    }
  };

  // 統計カードレンダラー
  const renderStatCard = (stat: WardStatistics, index: number) => {
    const colors = ['border-blue-500', 'border-green-500', 'border-purple-500'];
    const bgColors = ['bg-blue-50', 'bg-green-50', 'bg-purple-50'];

    return (
      <div
        key={stat.wardId}
        className={`bg-white rounded-xl shadow-lg border-t-4 ${colors[index]} p-6`}
      >
        {/* ヘッダー */}
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-1">{stat.facilityName}</div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>🛏️</span>
            <span>{stat.wardName}</span>
          </h3>
        </div>

        {/* 基本統計 */}
        <div className={`${bgColors[index]} rounded-lg p-4 mb-4`}>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-xs text-gray-600 mb-1">総職員数</div>
              <div className="text-2xl font-bold text-gray-800">{stat.totalStaff}</div>
              <div className="text-xs text-gray-500">名</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">リーダー可</div>
              <div className="text-2xl font-bold text-green-600">{stat.leaderCapableStaff}</div>
              <div className="text-xs text-gray-500">名</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">平均権限Lv</div>
              <div className="text-2xl font-bold text-indigo-600">{stat.averageAccountLevel}</div>
              <div className="text-xs text-gray-500">レベル</div>
            </div>
          </div>
        </div>

        {/* キャリアコース分布 */}
        <div className="mb-4">
          <div className="text-sm font-semibold text-gray-700 mb-2">キャリアコース分布</div>
          <div className="space-y-2">
            {stat.careerCourseBreakdown.map(({ course, count, percentage }) => {
              const color = COURSE_COLORS[course];
              return (
                <div key={course} className="flex items-center gap-2">
                  <span className={`${color.bg} ${color.text} px-2 py-1 rounded text-xs font-bold w-8 text-center`}>
                    {color.label}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full ${color.bg.replace('100', '400')}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 w-16 text-right">
                        {count}名 ({percentage}%)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 役職分布 */}
        <div>
          <div className="text-sm font-semibold text-gray-700 mb-2">役職分布（上位5件）</div>
          <div className="space-y-1">
            {stat.positionBreakdown.slice(0, 5).map(({ position, count }) => (
              <div key={position} className="flex items-center justify-between text-xs">
                <span className="text-gray-700">{position}</span>
                <span className="font-medium text-gray-900">{count}名</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 説明 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📊</span>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">病棟比較ビュー</h3>
            <p className="text-sm text-blue-700">
              最大3つの病棟を選択して、人員配置状況を並列比較できます。
              病棟間の配置バランスや人員構成の違いを分析し、最適な人員配置計画を立案する際にご活用ください。
            </p>
          </div>
        </div>
      </div>

      {/* 病棟選択エリア */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>🏥</span>
          <span>比較する病棟を選択 (最大3つ)</span>
          <span className="ml-auto text-sm text-gray-500">
            選択中: {selectedWardIds.length}/3
          </span>
        </h3>

        {/* 施設別病棟リスト */}
        <div className="space-y-4">
          {Array.from(wardsByFacility.entries()).map(([facilityId, facilityWards]) => (
            <div key={facilityId}>
              <div className="text-sm font-medium text-gray-600 mb-2">
                {facilityWards[0].facilityName}
              </div>
              <div className="flex flex-wrap gap-2">
                {facilityWards.map(ward => {
                  const isSelected = selectedWardIds.includes(ward.id);
                  const isDisabled = !isSelected && selectedWardIds.length >= 3;

                  return (
                    <button
                      key={ward.id}
                      onClick={() => handleWardToggle(ward.id)}
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
                      {ward.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 比較結果表示 */}
      {comparisonStats.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <div className="text-gray-600 font-medium">病棟を選択してください</div>
          <div className="text-sm text-gray-500 mt-1">
            上記から比較したい病棟を選択すると、統計情報が表示されます
          </div>
        </div>
      ) : (
        <>
          {/* 統計カード */}
          <div className={`grid gap-6 ${
            comparisonStats.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' :
            comparisonStats.length === 2 ? 'grid-cols-2' :
            'grid-cols-3'
          }`}>
            {comparisonStats.map((stat, index) => renderStatCard(stat, index))}
          </div>

          {/* 職員リスト並列表示 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>👥</span>
              <span>職員一覧（並列比較）</span>
            </h3>
            <div className={`grid gap-4 ${
              comparisonStats.length === 1 ? 'grid-cols-1' :
              comparisonStats.length === 2 ? 'grid-cols-2' :
              'grid-cols-3'
            }`}>
              {selectedWardIds.map((wardId, index) => {
                const wardStaff = staff.filter(s => `${s.facilityId}_${s.department}` === wardId);
                const ward = wards.find(w => w.id === wardId);
                const colors = ['border-blue-500', 'border-green-500', 'border-purple-500'];

                return (
                  <div key={wardId} className="space-y-2">
                    <div className={`bg-gradient-to-r ${
                      index === 0 ? 'from-blue-500 to-blue-600' :
                      index === 1 ? 'from-green-500 to-green-600' :
                      'from-purple-500 to-purple-600'
                    } text-white px-4 py-2 rounded-t-lg font-medium text-sm sticky top-0 z-10`}>
                      {ward?.facilityName} / {ward?.name}（{wardStaff.length}名）
                    </div>
                    <div className="max-h-[600px] overflow-y-auto space-y-1">
                      {wardStaff.map(s => {
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
        </>
      )}

      {/* 比較サマリー */}
      {comparisonStats.length >= 2 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>📈</span>
            <span>比較サマリー</span>
          </h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-xs text-gray-600 mb-1">総職員数</div>
              <div className="font-medium text-gray-800">
                最小: {Math.min(...comparisonStats.map(s => s.totalStaff))}名 ～
                最大: {Math.max(...comparisonStats.map(s => s.totalStaff))}名
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-xs text-gray-600 mb-1">リーダー可能職員</div>
              <div className="font-medium text-gray-800">
                最小: {Math.min(...comparisonStats.map(s => s.leaderCapableStaff))}名 ～
                最大: {Math.max(...comparisonStats.map(s => s.leaderCapableStaff))}名
              </div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4">
              <div className="text-xs text-gray-600 mb-1">平均権限レベル</div>
              <div className="font-medium text-gray-800">
                最小: {Math.min(...comparisonStats.map(s => s.averageAccountLevel))} ～
                最大: {Math.max(...comparisonStats.map(s => s.averageAccountLevel))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
