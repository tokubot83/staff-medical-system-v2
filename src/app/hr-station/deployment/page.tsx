'use client';

import React, { useState, useMemo } from 'react';
import DeploymentTable from '@/components/hr/DeploymentTable';
import DeploymentFilter, { FilterState } from '@/components/hr/DeploymentFilter';
import { generateAllFacilitiesStaff, getFacilitySummary } from '@/lib/hr/deploymentData';
import { FACILITY_ID_MAP } from '@/lib/facility-position-mapping';

export default function DeploymentPage() {
  // サンプルデータ生成
  const allStaff = useMemo(() => generateAllFacilitiesStaff(), []);

  // フィルター状態
  const [filters, setFilters] = useState<FilterState>({
    facility: 'all',
    department: 'all',
    course: 'all',
    leaderCapableOnly: false,
    searchText: ''
  });

  // 施設リスト
  const facilities = useMemo(() => {
    return Object.entries(FACILITY_ID_MAP).map(([id, name]) => ({
      id,
      name
    }));
  }, []);

  // 部署リスト（全施設から抽出）
  const departments = useMemo(() => {
    const deptSet = new Set<string>();
    allStaff.forEach(s => deptSet.add(s.department));
    return Array.from(deptSet).sort();
  }, [allStaff]);

  // フィルター適用後の職員データ
  const filteredStaff = useMemo(() => {
    return allStaff.filter(staff => {
      // 施設フィルター
      if (filters.facility !== 'all' && staff.facilityId !== filters.facility) {
        return false;
      }

      // 部署フィルター
      if (filters.department !== 'all' && staff.department !== filters.department) {
        return false;
      }

      // コースフィルター
      if (filters.course !== 'all' && staff.careerCourse !== filters.course) {
        return false;
      }

      // リーダー可能フィルター
      if (filters.leaderCapableOnly && staff.canPerformLeaderDuty !== true) {
        return false;
      }

      // テキスト検索
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        return (
          staff.name.toLowerCase().includes(searchLower) ||
          staff.department.toLowerCase().includes(searchLower) ||
          staff.position.toLowerCase().includes(searchLower) ||
          staff.employeeId.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [allStaff, filters]);

  // 施設サマリー
  const facilitySummary = useMemo(() => getFacilitySummary(allStaff), [allStaff]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white shadow-xl">
        <div className="max-w-[1800px] mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">👥</span>
                <h1 className="text-3xl font-bold tracking-tight">
                  配置状況ダッシュボード
                </h1>
              </div>
              <p className="text-blue-100 text-sm">
                医療法人厚生会 全5施設・全職員の配置状況を一覧表示
              </p>
            </div>

            {/* サマリーカード */}
            <div className="flex gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/30">
                <div className="text-xs text-blue-100 mb-1">総職員数</div>
                <div className="text-3xl font-bold">{allStaff.length}</div>
                <div className="text-xs text-blue-200">名</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/30">
                <div className="text-xs text-blue-100 mb-1">施設数</div>
                <div className="text-3xl font-bold">{facilitySummary.length}</div>
                <div className="text-xs text-blue-200">施設</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/30">
                <div className="text-xs text-blue-100 mb-1">リーダー可</div>
                <div className="text-3xl font-bold">
                  {allStaff.filter(s => s.canPerformLeaderDuty === true).length}
                </div>
                <div className="text-xs text-blue-200">名</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-[1800px] mx-auto px-6 py-6">
        {/* 施設別サマリーカード */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {facilitySummary.map(fac => (
            <div
              key={fac.facilityId}
              className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg transition-shadow"
            >
              <div className="text-xs font-semibold text-gray-600 mb-1 truncate">
                {fac.facilityName}
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-2">
                {fac.totalCount}
                <span className="text-sm text-gray-500 ml-1">名</span>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded">
                  A:{fac.byCourse.get('A') || 0}
                </span>
                <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                  B:{fac.byCourse.get('B') || 0}
                </span>
                <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                  C:{fac.byCourse.get('C') || 0}
                </span>
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">
                  D:{fac.byCourse.get('D') || 0}
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                ✅ リーダー可: <span className="font-bold">{fac.leaderCapable}名</span>
              </div>
            </div>
          ))}
        </div>

        {/* フィルター */}
        <DeploymentFilter
          filters={filters}
          onFilterChange={setFilters}
          facilities={facilities}
          departments={departments}
        />

        {/* フィルター結果表示 */}
        <div className="mb-3 text-sm text-gray-600">
          {filteredStaff.length < allStaff.length && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md px-4 py-2 flex items-center gap-2">
              <span className="text-yellow-600">🔍</span>
              <span>
                フィルター適用中: <strong className="text-yellow-700">{filteredStaff.length}名</strong>{' '}
                / 全{allStaff.length}名
              </span>
            </div>
          )}
        </div>

        {/* テーブル */}
        <DeploymentTable staff={filteredStaff} />

        {/* 凡例 */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <div className="text-sm font-semibold text-gray-700 mb-3">📖 凡例</div>
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
            <div>
              <div className="font-medium mb-2">キャリアコース</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                    🔴 A
                  </span>
                  <span>法人幹部候補（全施設異動・管理職登用対象）</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">
                    🟠 B
                  </span>
                  <span>施設リーダー（施設内異動・部門リーダー候補）</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">
                    🟡 C
                  </span>
                  <span>専門職（部署固定・専門性重視）</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                    🟢 D
                  </span>
                  <span>安定就労（時短・WLB重視）</span>
                </div>
              </div>
            </div>
            <div>
              <div className="font-medium mb-2">その他アイコン</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>リーダー業務可能（看護師・准看護師のみ）</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">⛔</span>
                  <span>リーダー業務不可</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">-</span>
                  <span>対象外職種</span>
                </div>
              </div>
              <div className="mt-3 font-medium">権限レベル (Lv.1-18)</div>
              <div className="text-gray-600">
                VoiceDrive連携用の権限レベル。数値が高いほど上位職。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
