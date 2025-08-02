'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import CategoryBackButton from '@/components/reports/CategoryBackButton';

interface StaffData {
  id: string;
  name: string;
  department: string;
  position: string;
  skillScore: number;
  resultScore: number;
  experience: number;
  age: number;
  leadership: number;
  communication: number;
  adaptability: number;
  cluster: string;
}

interface ClusterInfo {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  developmentPlan: string[];
  color: string;
  memberCount: number;
  avgScore: number;
}

const mockStaffData: StaffData[] = [
  { id: '1', name: '山田太郎', department: '看護部', position: '看護師長', skillScore: 85, resultScore: 90, experience: 15, age: 42, leadership: 88, communication: 85, adaptability: 80, cluster: 'leaders' },
  { id: '2', name: '佐藤花子', department: '看護部', position: '看護師', skillScore: 70, resultScore: 75, experience: 8, age: 32, leadership: 65, communication: 78, adaptability: 72, cluster: 'steady' },
  { id: '3', name: '鈴木一郎', department: 'リハビリ部', position: '理学療法士', skillScore: 90, resultScore: 85, experience: 12, age: 38, leadership: 75, communication: 82, adaptability: 88, cluster: 'specialists' },
  { id: '4', name: '田中美咲', department: '介護部', position: '介護士', skillScore: 60, resultScore: 80, experience: 5, age: 28, leadership: 70, communication: 75, adaptability: 85, cluster: 'potential' },
  { id: '5', name: '伊藤健', department: '医事課', position: '主任', skillScore: 75, resultScore: 70, experience: 10, age: 35, leadership: 72, communication: 68, adaptability: 65, cluster: 'steady' },
  { id: '6', name: '渡辺梨香', department: '栄養課', position: '管理栄養士', skillScore: 85, resultScore: 88, experience: 9, age: 33, leadership: 80, communication: 85, adaptability: 82, cluster: 'specialists' },
  { id: '7', name: '高橋勇', department: '看護部', position: '看護師', skillScore: 55, resultScore: 60, experience: 3, age: 25, leadership: 50, communication: 60, adaptability: 75, cluster: 'developing' },
  { id: '8', name: '小林由美', department: '介護部', position: '介護福祉士', skillScore: 80, resultScore: 82, experience: 7, age: 30, leadership: 78, communication: 80, adaptability: 78, cluster: 'steady' },
  { id: '9', name: '加藤直樹', department: 'リハビリ部', position: '作業療法士', skillScore: 92, resultScore: 88, experience: 14, age: 40, leadership: 85, communication: 88, adaptability: 90, cluster: 'leaders' },
  { id: '10', name: '中村美和', department: '看護部', position: '主任看護師', skillScore: 88, resultScore: 85, experience: 11, age: 36, leadership: 82, communication: 85, adaptability: 80, cluster: 'leaders' },
  { id: '11', name: '松本健二', department: '医事課', position: '医事課員', skillScore: 58, resultScore: 65, experience: 4, age: 27, leadership: 55, communication: 62, adaptability: 70, cluster: 'developing' },
  { id: '12', name: '井上恵子', department: '栄養課', position: '栄養士', skillScore: 72, resultScore: 78, experience: 6, age: 29, leadership: 68, communication: 75, adaptability: 80, cluster: 'potential' }
];

const clusterInfo: Record<string, ClusterInfo> = {
  leaders: {
    id: 'leaders',
    name: 'リーダー群',
    description: '高いスキルと実績を持つリーダー候補',
    characteristics: ['高いスキルレベル', '優れた成果', '強いリーダーシップ', '豊富な経験'],
    developmentPlan: ['リーダーシップ研修の実施', 'メンタリング役の任命', '戦略的プロジェクトへの参画', '後進指導の機会提供'],
    color: '#10B981',
    memberCount: 0,
    avgScore: 0
  },
  specialists: {
    id: 'specialists',
    name: 'エキスパート群',
    description: '専門性が高い技術者グループ',
    characteristics: ['専門技術に長けている', '継続的な成果創出', '高い適応力', '技術革新への関心'],
    developmentPlan: ['専門技術研修の強化', '学会参加支援', '新技術導入プロジェクト参画', '専門資格取得支援'],
    color: '#3B82F6',
    memberCount: 0,
    avgScore: 0
  },
  steady: {
    id: 'steady',
    name: '安定稼働群',
    description: '組織の中核を担う安定したパフォーマー',
    characteristics: ['安定したパフォーマンス', 'チームワーク重視', '継続的な改善意識', '組織への貢献'],
    developmentPlan: ['スキルアップ研修の実施', 'キャリア開発支援', 'チームリーダー経験の提供', '業務効率化支援'],
    color: '#F59E0B',
    memberCount: 0,
    avgScore: 0
  },
  potential: {
    id: 'potential',
    name: '成長期待群',
    description: '今後の成長が期待される若手・中堅',
    characteristics: ['高い成長ポテンシャル', '柔軟性と適応力', '学習意欲が旺盛', '変化への対応力'],
    developmentPlan: ['基礎研修の充実', 'OJT強化', 'ローテーション研修', 'メンター制度の活用'],
    color: '#8B5CF6',
    memberCount: 0,
    avgScore: 0
  },
  developing: {
    id: 'developing',
    name: '育成重点群',
    description: '集中的な育成が必要なグループ',
    characteristics: ['基礎スキルの向上が必要', '経験不足', '個別指導が効果的', '成長の余地が大きい'],
    developmentPlan: ['個別指導の強化', '基礎研修の実施', 'ペアワーク制度', '段階的な業務拡大'],
    color: '#EF4444',
    memberCount: 0,
    avgScore: 0
  }
};

// Calculate cluster statistics
Object.keys(clusterInfo).forEach(clusterId => {
  const members = mockStaffData.filter(staff => staff.cluster === clusterId);
  clusterInfo[clusterId].memberCount = members.length;
  clusterInfo[clusterId].avgScore = members.length > 0 
    ? Math.round(members.reduce((sum, staff) => sum + (staff.skillScore + staff.resultScore) / 2, 0) / members.length)
    : 0;
});

export default function ClusterAnalysisPage() {
  const router = useRouter();
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'scatter' | 'radar'>('scatter');
  const [analysisMode, setAnalysisMode] = useState<'performance' | 'skills'>('performance');

  const filteredStaff = selectedCluster 
    ? mockStaffData.filter(staff => staff.cluster === selectedCluster)
    : mockStaffData;

  const getScatterPosition = (staff: StaffData) => {
    if (analysisMode === 'performance') {
      return {
        x: staff.skillScore,
        y: 100 - staff.resultScore
      };
    } else {
      return {
        x: staff.experience * 2, // Scale experience to 0-30 range
        y: 100 - staff.age * 1.5 // Scale age to fit in chart
      };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="クラスター分析" />
      
      <div className="max-w-7xl mx-auto p-6">
        <CategoryBackButton />
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">職員クラスター分析</h2>
            <div className="flex gap-2">
              <select
                value={analysisMode}
                onChange={(e) => setAnalysisMode(e.target.value as 'performance' | 'skills')}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="performance">パフォーマンス分析</option>
                <option value="skills">スキル・経験分析</option>
              </select>
              <button
                onClick={() => setViewMode(viewMode === 'scatter' ? 'radar' : 'scatter')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {viewMode === 'scatter' ? 'レーダー表示' : '散布図表示'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <div className="lg:col-span-3">
              {viewMode === 'scatter' ? (
                <div className="relative h-[500px] border-2 border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium mb-3">
                    {analysisMode === 'performance' ? 'パフォーマンス散布図' : 'スキル・経験散布図'}
                  </h3>
                  <svg width="100%" height="90%" viewBox="0 0 100 100">
                    <line x1="10" y1="90" x2="90" y2="90" stroke="#ccc" strokeWidth="0.5" />
                    <line x1="10" y1="10" x2="10" y2="90" stroke="#ccc" strokeWidth="0.5" />
                    
                    <text x="50" y="98" textAnchor="middle" fontSize="3" fill="#666">
                      {analysisMode === 'performance' ? 'スキルスコア' : '経験年数'}
                    </text>
                    <text x="2" y="50" textAnchor="middle" fontSize="3" fill="#666" transform="rotate(-90 2 50)">
                      {analysisMode === 'performance' ? '成果スコア' : '年齢'}
                    </text>

                    {filteredStaff.map(staff => {
                      const pos = getScatterPosition(staff);
                      const cluster = clusterInfo[staff.cluster];
                      const isSelected = selectedCluster === null || selectedCluster === staff.cluster;
                      
                      return (
                        <g key={staff.id} opacity={isSelected ? 1 : 0.3}>
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r="3"
                            fill={cluster.color}
                            className="cursor-pointer hover:r-4 transition-all"
                            onClick={() => router.push(`/staff/${staff.id}`)}
                          />
                          <text
                            x={pos.x}
                            y={pos.y - 5}
                            textAnchor="middle"
                            fontSize="2"
                            fill="#333"
                            className="pointer-events-none"
                          >
                            {staff.name.length > 4 ? staff.name.substring(0, 4) : staff.name}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              ) : (
                <div className="relative h-[500px] border-2 border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium mb-3">スキルレーダーチャート (クラスター平均)</h3>
                  <svg width="100%" height="90%" viewBox="0 0 100 100">
                    <g transform="translate(50,50)">
                      {/* Pentagon for 5 skills */}
                      {[0, 1, 2, 3, 4].map(i => {
                        const angle = (i * 72 - 90) * Math.PI / 180;
                        const x = Math.cos(angle) * 35;
                        const y = Math.sin(angle) * 35;
                        return (
                          <line
                            key={i}
                            x1="0"
                            y1="0"
                            x2={x}
                            y2={y}
                            stroke="#ddd"
                            strokeWidth="0.5"
                          />
                        );
                      })}
                      
                      {/* Concentric pentagons */}
                      {[0.2, 0.4, 0.6, 0.8, 1.0].map(scale => (
                        <polygon
                          key={scale}
                          points={[0, 1, 2, 3, 4].map(i => {
                            const angle = (i * 72 - 90) * Math.PI / 180;
                            const x = Math.cos(angle) * 35 * scale;
                            const y = Math.sin(angle) * 35 * scale;
                            return `${x},${y}`;
                          }).join(' ')}
                          fill="none"
                          stroke="#ddd"
                          strokeWidth="0.5"
                        />
                      ))}

                      {/* Labels */}
                      {['スキル', 'リーダーシップ', 'コミュニケーション', '適応力', '成果'].map((label, i) => {
                        const angle = (i * 72 - 90) * Math.PI / 180;
                        const x = Math.cos(angle) * 40;
                        const y = Math.sin(angle) * 40;
                        return (
                          <text
                            key={i}
                            x={x}
                            y={y}
                            textAnchor="middle"
                            fontSize="2.5"
                            fill="#666"
                          >
                            {label}
                          </text>
                        );
                      })}

                      {/* Cluster data */}
                      {Object.entries(clusterInfo).map(([clusterId, cluster]) => {
                        if (selectedCluster && selectedCluster !== clusterId) return null;
                        
                        const members = mockStaffData.filter(s => s.cluster === clusterId);
                        if (members.length === 0) return null;
                        
                        const avgSkill = members.reduce((sum, s) => sum + s.skillScore, 0) / members.length / 100;
                        const avgLeadership = members.reduce((sum, s) => sum + s.leadership, 0) / members.length / 100;
                        const avgCommunication = members.reduce((sum, s) => sum + s.communication, 0) / members.length / 100;
                        const avgAdaptability = members.reduce((sum, s) => sum + s.adaptability, 0) / members.length / 100;
                        const avgResult = members.reduce((sum, s) => sum + s.resultScore, 0) / members.length / 100;
                        
                        const values = [avgSkill, avgLeadership, avgCommunication, avgAdaptability, avgResult];
                        
                        return (
                          <polygon
                            key={clusterId}
                            points={values.map((value, i) => {
                              const angle = (i * 72 - 90) * Math.PI / 180;
                              const x = Math.cos(angle) * 35 * value;
                              const y = Math.sin(angle) * 35 * value;
                              return `${x},${y}`;
                            }).join(' ')}
                            fill={cluster.color}
                            fillOpacity="0.3"
                            stroke={cluster.color}
                            strokeWidth="2"
                          />
                        );
                      })}
                    </g>
                  </svg>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">クラスター選択</h3>
              {Object.entries(clusterInfo).map(([clusterId, cluster]) => (
                <div
                  key={clusterId}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedCluster === clusterId 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedCluster(selectedCluster === clusterId ? null : clusterId)}
                  style={{ borderLeftColor: cluster.color, borderLeftWidth: '4px' }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm">{cluster.name}</h4>
                    <span className="text-lg font-bold">{cluster.memberCount}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{cluster.description}</p>
                  <div className="text-xs">
                    <span>平均スコア: </span>
                    <span className="font-medium">{cluster.avgScore}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedCluster && (
            <div className="mt-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4">
                  {clusterInfo[selectedCluster].name} 詳細分析
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">特徴分析</h4>
                    <ul className="space-y-2">
                      {clusterInfo[selectedCluster].characteristics.map((char, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: clusterInfo[selectedCluster].color }}
                          ></div>
                          {char}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">推奨育成プラン</h4>
                    <ul className="space-y-2">
                      {clusterInfo[selectedCluster].developmentPlan.map((plan, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <span className="text-blue-600">•</span>
                          {plan}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium mb-3">所属メンバー</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-lg">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-3 text-left text-sm font-medium">氏名</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">部門</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">役職</th>
                          <th className="px-4 py-3 text-center text-sm font-medium">経験年数</th>
                          <th className="px-4 py-3 text-center text-sm font-medium">年齢</th>
                          <th className="px-4 py-3 text-center text-sm font-medium">スキル</th>
                          <th className="px-4 py-3 text-center text-sm font-medium">成果</th>
                          <th className="px-4 py-3 text-center text-sm font-medium">総合</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockStaffData
                          .filter(staff => staff.cluster === selectedCluster)
                          .map(staff => (
                            <tr 
                              key={staff.id} 
                              className="border-t hover:bg-gray-50 cursor-pointer"
                              onClick={() => router.push(`/staff/${staff.id}`)}
                            >
                              <td className="px-4 py-3">{staff.name}</td>
                              <td className="px-4 py-3">{staff.department}</td>
                              <td className="px-4 py-3">{staff.position}</td>
                              <td className="px-4 py-3 text-center">{staff.experience}年</td>
                              <td className="px-4 py-3 text-center">{staff.age}歳</td>
                              <td className="px-4 py-3 text-center">{staff.skillScore}</td>
                              <td className="px-4 py-3 text-center">{staff.resultScore}</td>
                              <td className="px-4 py-3 text-center font-medium">
                                {Math.round((staff.skillScore + staff.resultScore) / 2)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">クラスター分析サマリー</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">最大クラスター</p>
                <p className="font-bold text-blue-600">
                  {Object.entries(clusterInfo).reduce((max, [id, cluster]) => 
                    cluster.memberCount > max.count ? { id, count: cluster.memberCount, name: cluster.name } : max,
                    { id: '', count: 0, name: '' }
                  ).name} ({Object.entries(clusterInfo).reduce((max, [id, cluster]) => 
                    cluster.memberCount > max.count ? { id, count: cluster.memberCount, name: cluster.name } : max,
                    { id: '', count: 0, name: '' }
                  ).count}名)
                </p>
              </div>
              <div>
                <p className="text-gray-600">総職員数</p>
                <p className="font-bold">{mockStaffData.length}名</p>
              </div>
              <div>
                <p className="text-gray-600">平均総合スコア</p>
                <p className="font-bold">
                  {Math.round(mockStaffData.reduce((sum, s) => sum + (s.skillScore + s.resultScore) / 2, 0) / mockStaffData.length)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScrollToTopButton />
      <DashboardButton />
    </div>
  );
}