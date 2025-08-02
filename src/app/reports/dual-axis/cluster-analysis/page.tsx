'use client';

import React, { useState } from 'react';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import CategoryBackButton from '@/components/reports/CategoryBackButton';

interface Cluster {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  memberCount: number;
  avgSkillScore: number;
  avgResultScore: number;
  commonTraits: {
    experience: string;
    education: string;
    trainingHours: number;
    workStyle: string;
  };
  recommendations: string[];
  color: string;
  members?: {
    id: string;
    name: string;
    department: string;
    skillScore: number;
    resultScore: number;
  }[];
}

const clusters: Cluster[] = [
  {
    id: 'cluster1',
    name: '成長期エキスパート',
    description: '高スキル・高成果を維持しながら継続的に成長している職員群',
    characteristics: [
      '勤続5年以上の中堅層',
      '専門資格保有率90%以上',
      '研修参加意欲が高い',
      'メンター経験あり'
    ],
    memberCount: 42,
    avgSkillScore: 85,
    avgResultScore: 88,
    commonTraits: {
      experience: '5-10年',
      education: '専門学校・大学卒',
      trainingHours: 80,
      workStyle: '自律的・協調的'
    },
    recommendations: [
      'リーダーシップ研修の実施',
      '後進育成の役割付与',
      'プロジェクトリーダーへの登用',
      '外部研修への派遣'
    ],
    color: 'green',
    members: [
      { id: '1', name: '山田太郎', department: '看護部', skillScore: 85, resultScore: 90 },
      { id: '3', name: '鈴木一郎', department: 'リハビリ部', skillScore: 90, resultScore: 85 },
      { id: '6', name: '渡辺梨香', department: '栄養課', skillScore: 85, resultScore: 88 }
    ]
  },
  {
    id: 'cluster2',
    name: '潜在力発揮型',
    description: '成果は出ているがスキル面での成長余地がある職員群',
    characteristics: [
      '勤続3年未満の若手層',
      '業務への適応力が高い',
      '成果志向が強い',
      '基礎スキルの習得段階'
    ],
    memberCount: 38,
    avgSkillScore: 68,
    avgResultScore: 80,
    commonTraits: {
      experience: '1-3年',
      education: '専門学校卒',
      trainingHours: 40,
      workStyle: '積極的・柔軟'
    },
    recommendations: [
      '体系的な技術研修の実施',
      'OJTプログラムの強化',
      'メンター制度の活用',
      '資格取得支援'
    ],
    color: 'blue',
    members: [
      { id: '4', name: '田中美咲', department: '介護部', skillScore: 60, resultScore: 80 },
      { id: '7', name: '高橋勇', department: '看護部', skillScore: 55, resultScore: 60 }
    ]
  },
  {
    id: 'cluster3',
    name: 'スキル活用改善型',
    description: '高いスキルを持つが成果に結びついていない職員群',
    characteristics: [
      '専門知識は豊富',
      '環境適応に課題',
      'モチベーション低下傾向',
      '役割の不明確さ'
    ],
    memberCount: 25,
    avgSkillScore: 78,
    avgResultScore: 68,
    commonTraits: {
      experience: '5年以上',
      education: '大学・大学院卒',
      trainingHours: 60,
      workStyle: '慎重・完璧主義'
    },
    recommendations: [
      '役割の明確化と再定義',
      'モチベーション向上施策',
      '業務プロセスの改善',
      'キャリア面談の実施'
    ],
    color: 'yellow',
    members: [
      { id: '5', name: '伊藤健', department: '医事課', skillScore: 75, resultScore: 70 }
    ]
  },
  {
    id: 'cluster4',
    name: '基礎強化必要型',
    description: 'スキル・成果ともに改善が必要な職員群',
    characteristics: [
      '入職1年未満の新人',
      '異業種からの転職者',
      '基礎教育が不十分',
      'サポート体制が必要'
    ],
    memberCount: 20,
    avgSkillScore: 58,
    avgResultScore: 62,
    commonTraits: {
      experience: '1年未満',
      education: '高校・専門学校卒',
      trainingHours: 20,
      workStyle: '学習意欲あり'
    },
    recommendations: [
      '新人教育プログラムの徹底',
      '基礎スキル研修の実施',
      'バディ制度の導入',
      '定期的なフォローアップ'
    ],
    color: 'red',
    members: []
  }
];

export default function ClusterAnalysisPage() {
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'detail'>('overview');

  const selectedClusterData = clusters.find(c => c.id === selectedCluster);

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; border: string; text: string }> = {
      green: { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700' },
      blue: { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-700' },
      yellow: { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-700' },
      red: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-700' }
    };
    return colorMap[color] || colorMap.green;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="クラスター分析" />
      
      <div className="max-w-7xl mx-auto p-6">
        <CategoryBackButton categoryId="dual-axis" />
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">パフォーマンス特性による職員グループ分析</h2>
            <button
              onClick={() => setViewMode(viewMode === 'overview' ? 'detail' : 'overview')}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {viewMode === 'overview' ? '詳細表示' : '概要表示'}
            </button>
          </div>

          {viewMode === 'overview' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">クラスター分布マップ</h3>
                  <div className="relative h-[400px] border-2 border-gray-200 rounded-lg p-4">
                    <svg width="100%" height="100%" viewBox="0 0 100 100">
                      <line x1="50" y1="0" x2="50" y2="100" stroke="#ccc" strokeWidth="0.5" />
                      <line x1="0" y1="50" x2="100" y2="50" stroke="#ccc" strokeWidth="0.5" />
                      
                      <text x="98" y="98" textAnchor="end" fontSize="3" fill="#666">高</text>
                      <text x="2" y="98" textAnchor="start" fontSize="3" fill="#666">低</text>
                      <text x="50" y="98" textAnchor="middle" fontSize="3" fill="#666">スキルレベル</text>
                      
                      <text x="2" y="4" textAnchor="start" fontSize="3" fill="#666">高</text>
                      <text x="2" y="98" textAnchor="start" fontSize="3" fill="#666" transform="rotate(-90 2 50)">低</text>
                      <text x="2" y="50" textAnchor="middle" fontSize="3" fill="#666" transform="rotate(-90 2 50)">成果・業績</text>

                      {clusters.map(cluster => {
                        const colors = getColorClasses(cluster.color);
                        const radius = Math.sqrt(cluster.memberCount) * 2;
                        return (
                          <g 
                            key={cluster.id} 
                            className="cursor-pointer"
                            onClick={() => setSelectedCluster(cluster.id)}
                            opacity={!selectedCluster || selectedCluster === cluster.id ? 1 : 0.3}
                          >
                            <circle
                              cx={cluster.avgSkillScore}
                              cy={100 - cluster.avgResultScore}
                              r={radius}
                              fill={cluster.color}
                              fillOpacity="0.3"
                              stroke={cluster.color}
                              strokeWidth="2"
                              className="hover:fill-opacity-50 transition-all"
                            />
                            <text
                              x={cluster.avgSkillScore}
                              y={100 - cluster.avgResultScore}
                              textAnchor="middle"
                              fontSize="2.5"
                              fill="#333"
                              className="pointer-events-none"
                            >
                              {cluster.name.length > 8 ? cluster.name.substring(0, 8) + '...' : cluster.name}
                            </text>
                            <text
                              x={cluster.avgSkillScore}
                              y={100 - cluster.avgResultScore + 3}
                              textAnchor="middle"
                              fontSize="2"
                              fill="#666"
                              className="pointer-events-none"
                            >
                              ({cluster.memberCount}名)
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">クラスター一覧</h3>
                  {clusters.map(cluster => {
                    const colors = getColorClasses(cluster.color);
                    return (
                      <div
                        key={cluster.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedCluster === cluster.id 
                            ? `${colors.border} ${colors.bg}` 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedCluster(cluster.id === selectedCluster ? null : cluster.id)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`font-semibold ${selectedCluster === cluster.id ? colors.text : ''}`}>
                            {cluster.name}
                          </h4>
                          <span className={`px-2 py-1 rounded text-sm ${colors.bg} ${colors.text}`}>
                            {cluster.memberCount}名
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{cluster.description}</p>
                        <div className="flex gap-4 text-xs">
                          <span>平均スキル: {cluster.avgSkillScore}</span>
                          <span>平均成果: {cluster.avgResultScore}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedClusterData && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-4">{selectedClusterData.name}の詳細分析</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium mb-3">特徴</h4>
                      <ul className="text-sm space-y-1">
                        {selectedClusterData.characteristics.map((char, idx) => (
                          <li key={idx}>• {char}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium mb-3">共通属性</h4>
                      <div className="text-sm space-y-2">
                        <div>
                          <span className="text-gray-600">経験年数:</span>
                          <span className="ml-2 font-medium">{selectedClusterData.commonTraits.experience}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">学歴:</span>
                          <span className="ml-2 font-medium">{selectedClusterData.commonTraits.education}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">研修時間:</span>
                          <span className="ml-2 font-medium">{selectedClusterData.commonTraits.trainingHours}時間/年</span>
                        </div>
                        <div>
                          <span className="text-gray-600">働き方:</span>
                          <span className="ml-2 font-medium">{selectedClusterData.commonTraits.workStyle}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium mb-3">推奨施策</h4>
                      <ul className="text-sm space-y-1">
                        {selectedClusterData.recommendations.map((rec, idx) => (
                          <li key={idx}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {selectedClusterData.members && selectedClusterData.members.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-3">所属メンバー例</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border rounded">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-4 py-2 text-left text-sm">氏名</th>
                              <th className="px-4 py-2 text-left text-sm">部門</th>
                              <th className="px-4 py-2 text-center text-sm">スキル</th>
                              <th className="px-4 py-2 text-center text-sm">成果</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedClusterData.members.map(member => (
                              <tr key={member.id} className="border-t">
                                <td className="px-4 py-2">{member.name}</td>
                                <td className="px-4 py-2">{member.department}</td>
                                <td className="px-4 py-2 text-center">{member.skillScore}</td>
                                <td className="px-4 py-2 text-center">{member.resultScore}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {viewMode === 'detail' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">クラスター間比較</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border rounded-lg">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-3 text-left text-sm font-medium">クラスター</th>
                        <th className="px-4 py-3 text-center text-sm font-medium">人数</th>
                        <th className="px-4 py-3 text-center text-sm font-medium">平均スキル</th>
                        <th className="px-4 py-3 text-center text-sm font-medium">平均成果</th>
                        <th className="px-4 py-3 text-center text-sm font-medium">主な経験年数</th>
                        <th className="px-4 py-3 text-center text-sm font-medium">年間研修時間</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clusters.map(cluster => {
                        const colors = getColorClasses(cluster.color);
                        return (
                          <tr key={cluster.id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <span className={`font-medium ${colors.text}`}>{cluster.name}</span>
                            </td>
                            <td className="px-4 py-3 text-center">{cluster.memberCount}</td>
                            <td className="px-4 py-3 text-center">{cluster.avgSkillScore}</td>
                            <td className="px-4 py-3 text-center">{cluster.avgResultScore}</td>
                            <td className="px-4 py-3 text-center">{cluster.commonTraits.experience}</td>
                            <td className="px-4 py-3 text-center">{cluster.commonTraits.trainingHours}h</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">施策優先度マトリクス</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {clusters.map(cluster => {
                    const colors = getColorClasses(cluster.color);
                    const priority = cluster.avgSkillScore < 70 || cluster.avgResultScore < 70 ? '高' : '中';
                    const impact = cluster.memberCount > 30 ? '大' : '中';
                    
                    return (
                      <div key={cluster.id} className={`p-4 border rounded-lg ${colors.bg} ${colors.border}`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`font-medium ${colors.text}`}>{cluster.name}</h4>
                          <div className="flex gap-2">
                            <span className={`px-2 py-1 rounded text-xs ${priority === '高' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              優先度: {priority}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${impact === '大' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                              影響度: {impact}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm mb-2">主要施策:</p>
                        <ul className="text-xs space-y-1">
                          {cluster.recommendations.slice(0, 2).map((rec, idx) => (
                            <li key={idx}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ScrollToTopButton />
      <DashboardButton />
    </div>
  );
}