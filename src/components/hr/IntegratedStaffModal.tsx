'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { facilityData, positionData } from '@/lib/hr/heatmapData';
import { segmentAnalysisData, actionMasterData } from '@/lib/hr/segmentAnalysisData';
import { exportStaffListToCSV } from '@/lib/hr/exportUtils';
import { Download } from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  position: string;
  facility: string;
  course: string;
  grade: number;
  evaluation?: {
    technical: number;
    organizational: number;
    total: number;
    grade: string;
  };
  photo?: string;
  joinDate: string;
  lastUpdate: string;
  actions: string[];
}

interface IntegratedStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  cellData: {
    layer: string;
    course: string;
    data: any;
  };
  filters: {
    facility: string;
    position: string;
    phase: number;
  };
}

export default function IntegratedStaffModal({ isOpen, onClose, cellData, filters }: IntegratedStaffModalProps) {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // セグメント分析データの取得
  const segmentKey = `${cellData.layer}-${cellData.course}`;
  const analysisData = segmentAnalysisData[filters.phase]?.[segmentKey];

  useEffect(() => {
    if (isOpen) {
      generateStaffList();
    }
  }, [isOpen, cellData, filters]);

  const generateStaffList = () => {
    setLoading(true);
    setTimeout(() => {
      const count = parseInt(cellData.data.count.replace('名', ''));
      const staff: StaffMember[] = [];

      for (let i = 0; i < count; i++) {
        staff.push({
          id: `staff_${cellData.layer}_${cellData.course}_${i + 1}`,
          name: generateStaffName(),
          position: getRandomPosition(filters.position),
          facility: getRandomFacility(filters.facility),
          course: cellData.course,
          grade: filters.phase >= 2 ? generateGrade(cellData.layer) : 0,
          joinDate: generateJoinDate(),
          lastUpdate: new Date().toISOString().split('T')[0],
          actions: generateActions(cellData.layer, cellData.course, filters.phase),
          evaluation: filters.phase === 3 ? generateEvaluation(cellData.layer) : undefined
        });
      }

      setStaffList(staff);
      setLoading(false);
    }, 500);
  };

  const generateStaffName = () => {
    const surnames = ['田中', '佐藤', '鈴木', '高橋', '伊藤', '渡辺', '山田', '中村', '小林', '加藤'];
    const firstNames = ['太郎', '花子', '一郎', '美咲', '健太', '由美', '翔', '愛', '大輔', '明美'];
    return surnames[Math.floor(Math.random() * surnames.length)] + ' ' +
           firstNames[Math.floor(Math.random() * firstNames.length)];
  };

  const getRandomPosition = (filter: string) => {
    if (filter !== 'all') {
      return positionData[filter as keyof typeof positionData]?.name || '看護師';
    }
    const positions = Object.values(positionData).filter(p => p.name !== '全職種');
    return positions[Math.floor(Math.random() * positions.length)].name;
  };

  const getRandomFacility = (filter: string) => {
    if (filter !== 'all') {
      return facilityData[filter as keyof typeof facilityData]?.name || '厚生病院';
    }
    const facilities = Object.values(facilityData).filter(f => f.name !== '法人全体');
    return facilities[Math.floor(Math.random() * facilities.length)].name;
  };

  const generateGrade = (layer: string) => {
    const gradeRanges = {
      top: { min: 25, max: 48 },
      middle: { min: 10, max: 35 },
      low: { min: 1, max: 20 }
    };
    const range = gradeRanges[layer as keyof typeof gradeRanges] || gradeRanges.middle;
    return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  };

  const generateJoinDate = () => {
    const start = new Date(2015, 0, 1);
    const end = new Date(2024, 11, 31);
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate.toISOString().split('T')[0];
  };

  const generateEvaluation = (layer: string) => {
    const technical = Math.floor(Math.random() * 20) + 30;
    const organizational = Math.floor(Math.random() * 20) + 30;
    const total = technical + organizational;
    let grade = 'B';
    if (total >= 90) grade = 'S+';
    else if (total >= 85) grade = 'S';
    else if (total >= 80) grade = 'A+';
    else if (total >= 75) grade = 'A';
    else if (total >= 60) grade = 'B';
    else if (total >= 50) grade = 'C';
    else grade = 'D';
    return { technical, organizational, total, grade };
  };

  const generateActions = (layer: string, course: string, phase: number): string[] => {
    const actionMatrix = {
      '1': {
        'top': ['早期育成プログラム', '法人プロジェクト参画'],
        'middle': ['期待値調整面談', 'スキル向上研修'],
        'low': ['基礎研修受講', 'コース変更検討']
      },
      '2': {
        'top': ['幹部候補認定', '戦略会議参加'],
        'middle': ['昇格計画策定', '専門研修受講'],
        'low': ['適正配置検討', '基礎力強化']
      },
      '3': {
        'top': ['経営参画', 'サクセッションプラン'],
        'middle': ['プロジェクトリーダー', '後進指導'],
        'low': ['強み活用配置', '継続就労支援']
      }
    };
    return actionMatrix[phase.toString() as keyof typeof actionMatrix]?.[layer as keyof (typeof actionMatrix)[keyof typeof actionMatrix]] || [];
  };

  const filteredStaff = staffList.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const badges = {
      '理想的': { bg: 'bg-emerald-500', text: 'text-white' },
      '許容範囲': { bg: 'bg-blue-500', text: 'text-white' },
      '要注意': { bg: 'bg-amber-500', text: 'text-white' },
      '要対応': { bg: 'bg-red-500', text: 'text-white' }
    };
    return badges[status as keyof typeof badges] || badges['許容範囲'];
  };

  const getPriorityLabel = (level: string) => {
    const labels = {
      'low': '低',
      'medium': '中',
      'high': '高',
      'critical': '緊急'
    };
    return labels[level as keyof typeof labels] || '中';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl border-2 border-gray-300 w-full max-w-[1600px] h-[95vh] shadow-2xl flex overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Main Content Area (Left Side) */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b-2 border-blue-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    人事アプローチ統合ビュー
                  </h2>
                  <div className="flex items-center space-x-3 mt-2 text-sm">
                    <span className="bg-blue-100 px-2 py-1 rounded border border-blue-300 text-blue-700">
                      {cellData.layer === 'top' ? '上位20%' : cellData.layer === 'middle' ? '中間60%' : '要支援20%'}
                    </span>
                    <span className="bg-purple-100 px-2 py-1 rounded border border-purple-300 text-purple-700">
                      {cellData.course}コース
                    </span>
                    <span className="text-gray-600">{cellData.data.count}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const layerLabel = cellData.layer === 'top' ? '上位20%' : cellData.layer === 'middle' ? '中間60%' : '要支援20%';
                      exportStaffListToCSV(
                        cellData.layer,
                        cellData.course,
                        staffList.map(staff => ({
                          id: staff.id,
                          name: staff.name,
                          department: staff.facility,
                          position: staff.position,
                          points: staff.evaluation?.total,
                          grade: staff.grade,
                          evaluation: staff.evaluation?.grade
                        }))
                      );
                    }}
                    className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center gap-1.5 transition-colors border border-blue-300 text-blue-700 text-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    CSVエクスポート
                  </button>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors border border-gray-300"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Upper 40% - Strategic Information */}
            <div className="h-[40%] min-h-[300px] bg-gradient-to-br from-gray-50 to-blue-50 border-b-2 border-gray-200 overflow-y-auto flex-shrink-0">
              {analysisData ? (
                <div className="p-6 h-full flex flex-col">
                  {/* Status and Priority - Expanded */}
                  <div className="mb-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 mr-4">
                        <h3 className="text-xl font-bold text-blue-800 mb-3">
                          {analysisData.title}
                        </h3>
                        <p className="text-sm text-gray-700 font-medium leading-relaxed mb-3">
                          {analysisData.statusDetail.description}
                        </p>
                        <div className="bg-white rounded-lg p-3 text-sm border border-gray-200">
                          <div className="text-gray-500 mb-1">評価根拠：</div>
                          <div className="text-gray-700">{analysisData.statusDetail.reason}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-3">
                        <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${getStatusBadge(analysisData.statusDetail.label).bg} ${getStatusBadge(analysisData.statusDetail.label).text}`}>
                          {analysisData.statusDetail.label}
                        </span>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">優先度</div>
                          <span className="text-lg font-bold text-amber-400">{getPriorityLabel(analysisData.priorityDetail.level)}</span>
                        </div>
                        <div className="bg-red-50 rounded-lg p-2 border border-red-200">
                          <div className="text-xs text-red-600 text-center">
                            {analysisData.priorityDetail.timeline}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Priority Detail Box */}
                    <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 mb-4">
                      <div className="flex items-start">
                        <span className="text-amber-600 mr-2">⚠️</span>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-amber-700 mb-1">対応の緊急性</div>
                          <div className="text-sm text-gray-700">{analysisData.priorityDetail.reason}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Metrics Grid - Expanded */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-4">
                    <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-4 text-center border border-cyan-300">
                      <div className="text-3xl font-bold text-cyan-700 mb-1">{analysisData.metrics.totalCount}</div>
                      <div className="text-sm text-gray-600">該当人数</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center border border-purple-300">
                      <div className="text-3xl font-bold text-purple-700 mb-1">{analysisData.metrics.percentage}%</div>
                      <div className="text-sm text-gray-600">構成比率</div>
                    </div>
                    {analysisData.metrics.gradeRange && (
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center border border-green-300">
                        <div className="text-lg font-bold text-green-700 mb-1">{analysisData.metrics.gradeRange}</div>
                        <div className="text-sm text-gray-600">等級範囲</div>
                      </div>
                    )}
                    {analysisData.metrics.salaryCoefficient && (
                      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 text-center border border-amber-300">
                        <div className="text-2xl font-bold text-amber-700 mb-1">×{analysisData.metrics.salaryCoefficient}</div>
                        <div className="text-sm text-gray-600">給与係数</div>
                      </div>
                    )}
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 text-center border border-red-300">
                      <div className="text-sm font-bold text-red-700 mb-1">{analysisData.priorityDetail.timeline}</div>
                      <div className="text-sm text-gray-600">対応期限</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center border border-blue-300">
                      <div className="text-lg font-bold text-blue-700 mb-1">{analysisData.metrics.benchmark}</div>
                      <div className="text-sm text-gray-600">ベンチマーク</div>
                    </div>
                  </div>

                  {/* Evaluation Distribution (Phase 3) - Expanded */}
                  {filters.phase === 3 && analysisData.metrics.evaluationDistribution && (
                    <div className="bg-gradient-to-br from-slate-700/30 to-slate-600/30 rounded-xl p-4 border border-slate-600">
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <span className="mr-2">📊</span>
                        評価分布詳細
                      </h4>
                      <div className="space-y-3">
                        <div className="flex space-x-2">
                          {Object.entries(analysisData.metrics.evaluationDistribution).map(([grade, percentage]) => (
                            <div key={grade} className="flex-1">
                              <div
                                className="h-12 rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-lg"
                                style={{
                                  backgroundColor: grade === 'S+' ? '#d32f2f' :
                                                 grade === 'S' ? '#f57c00' :
                                                 grade === 'A+' ? '#fbc02d' :
                                                 grade === 'A' ? '#689f38' :
                                                 grade === 'B' ? '#1976d2' :
                                                 grade === 'C' ? '#757575' : '#b71c1c'
                                }}
                              >
                                <div>
                                  <div className="text-lg">{grade}</div>
                                  <div className="text-xs opacity-90">{percentage}%</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {analysisData.evaluationInsights && (
                          <div className="bg-slate-800/50 rounded-lg p-3 text-sm">
                            <div className="flex items-start mb-2">
                              <span className="text-emerald-400 mr-2">💪</span>
                              <div>
                                <span className="text-gray-500">強み: </span>
                                <span className="text-white">{analysisData.evaluationInsights.strengthPattern}</span>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <span className="text-amber-400 mr-2">📈</span>
                              <div>
                                <span className="text-gray-500">改善点: </span>
                                <span className="text-white">{analysisData.evaluationInsights.developmentArea}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-400">
                  分析データを読み込み中...
                </div>
              )}
            </div>

            {/* Lower 60% - Staff List (残りのスペースを使用) */}
            <div className="flex-1 flex flex-col bg-gray-50 min-h-0">
              {/* Search Bar */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="職員名・職種で検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  />
                  <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Staff Grid */}
              <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-500">職員データを読み込み中...</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredStaff.map((staff) => (
                      <motion.div
                        key={staff.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center text-indigo-700 font-bold text-sm border border-blue-200">
                              {staff.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-gray-800">{staff.name}</h4>
                              <p className="text-xs text-gray-500">{staff.position}</p>
                            </div>
                          </div>
                          {filters.phase === 3 && staff.evaluation && (
                            <span
                              className="px-2 py-1 rounded text-xs font-bold text-white"
                              style={{
                                backgroundColor: staff.evaluation.grade === 'S+' ? '#d32f2f' :
                                               staff.evaluation.grade === 'S' ? '#f57c00' :
                                               staff.evaluation.grade === 'A+' ? '#fbc02d' :
                                               staff.evaluation.grade === 'A' ? '#689f38' :
                                               staff.evaluation.grade === 'B' ? '#1976d2' :
                                               staff.evaluation.grade === 'C' ? '#757575' : '#b71c1c'
                              }}
                            >
                              {staff.evaluation.grade}
                            </span>
                          )}
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-500">施設:</span>
                            <span className="text-gray-700">{staff.facility}</span>
                          </div>
                          {filters.phase >= 2 && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">等級:</span>
                              <span className="text-gray-700">{staff.grade}級</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-500">入社:</span>
                            <span className="text-gray-700">{staff.joinDate}</span>
                          </div>
                        </div>

                        {filters.phase === 3 && staff.evaluation && (
                          <div className="mt-3 pt-3 border-t border-slate-700">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">評価点:</span>
                              <span className="text-cyan-400 font-bold">{staff.evaluation.total}点</span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-200 bg-gray-100 text-xs text-gray-600">
                表示: {filteredStaff.length}名 / 全体: {staffList.length}名
              </div>
            </div>
          </div>

          {/* Side Panel - Concrete Actions (Right Side) */}
          <div className="w-96 bg-gradient-to-b from-indigo-50 to-purple-50 border-l-2 border-indigo-200 flex flex-col min-h-0 flex-shrink-0">
            <div className="p-4 border-b-2 border-indigo-200">
              <h3 className="text-lg font-semibold text-gray-800">
                📋 具体的施策
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                このセグメントへの推奨アクション
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {analysisData?.detailedActions ? (
                <div className="space-y-4">
                  {analysisData.detailedActions.map((category, index) => (
                    <div key={index} className="bg-white rounded-lg overflow-hidden border border-gray-200">
                      <button
                        onClick={() => setExpandedCategory(expandedCategory === category.category ? null : category.category)}
                        className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-cyan-100 rounded flex items-center justify-center text-cyan-700 text-sm font-bold">
                            {index + 1}
                          </div>
                          <span className="text-gray-800 font-medium text-sm">{category.category}</span>
                        </div>
                        <svg
                          className={`w-4 h-4 text-gray-500 transition-transform ${expandedCategory === category.category ? 'rotate-90' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      <AnimatePresence>
                        {expandedCategory === category.category && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-3 space-y-2 border-t border-gray-200">
                              {category.actions.map((action, actionIndex) => {
                                const actionDetail = actionMasterData[action as keyof typeof actionMasterData];
                                return (
                                  <div
                                    key={actionIndex}
                                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                                      selectedAction === action
                                        ? 'bg-cyan-100 border border-cyan-300'
                                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                                    }`}
                                    onClick={() => setSelectedAction(selectedAction === action ? null : action)}
                                  >
                                    <div className="flex items-start">
                                      <span className="text-cyan-400 mr-2 mt-0.5">▸</span>
                                      <div className="flex-1">
                                        <div className="text-sm text-gray-800 mb-1">{action}</div>
                                        {selectedAction === action && actionDetail && (
                                          <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-2 pt-2 border-t border-gray-200 text-xs space-y-1"
                                          >
                                            <div className="text-gray-600">
                                              <span className="text-gray-500">期間:</span> {actionDetail.duration}
                                            </div>
                                            <div className="text-gray-600">
                                              <span className="text-gray-500">頻度:</span> {actionDetail.frequency}
                                            </div>
                                            <div className="text-gray-700 mt-2">
                                              {actionDetail.expectedOutcome}
                                            </div>
                                            <div className="mt-2">
                                              <div className="text-gray-500 mb-1">KPI:</div>
                                              {actionDetail.kpi.map((kpi, kpiIndex) => (
                                                <div key={kpiIndex} className="text-green-600 ml-2">
                                                  ✓ {kpi}
                                                </div>
                                              ))}
                                            </div>
                                          </motion.div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}

                  {/* Risks and Opportunities */}
                  <div className="space-y-3">
                    <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                      <h4 className="text-sm font-semibold text-red-700 mb-2">リスク要因</h4>
                      <div className="space-y-1">
                        {analysisData.risks.slice(0, 3).map((risk, index) => (
                          <div key={index} className="text-xs text-gray-700 flex items-start">
                            <span className="text-red-600 mr-1">•</span>
                            {risk}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <h4 className="text-sm font-semibold text-green-700 mb-2">成長機会</h4>
                      <div className="space-y-1">
                        {analysisData.opportunities.slice(0, 3).map((opportunity, index) => (
                          <div key={index} className="text-xs text-gray-700 flex items-start">
                            <span className="text-green-600 mr-1">•</span>
                            {opportunity}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-3 border border-cyan-200">
                    <h4 className="text-sm font-semibold text-cyan-700 mb-2">実施タイムライン</h4>
                    <div className="text-xs text-gray-700">
                      <div className="font-bold text-amber-700">{analysisData.priorityDetail.timeline}</div>
                      <div className="text-gray-600 mt-1">{analysisData.priorityDetail.reason}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 text-sm">
                  施策データを読み込み中...
                </div>
              )}
            </div>

            {/* Export Actions */}
            <div className="p-4 border-t-2 border-indigo-200 space-y-2">
              <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm rounded-lg hover:shadow-lg transition-all">
                アクションプラン作成
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 border border-gray-300 transition-all">
                CSVエクスポート
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}