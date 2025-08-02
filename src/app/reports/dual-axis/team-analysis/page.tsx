'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import CategoryBackButton from '@/components/reports/CategoryBackButton';

interface TeamData {
  id: string;
  name: string;
  memberCount: number;
  avgSkillScore: number;
  avgResultScore: number;
  skillDistribution: { low: number; medium: number; high: number };
  resultDistribution: { low: number; medium: number; high: number };
  topPerformers: number;
  needsSupport: number;
  leader: string;
}

const mockTeamData: TeamData[] = [
  {
    id: '1',
    name: '看護部A病棟',
    memberCount: 25,
    avgSkillScore: 78,
    avgResultScore: 82,
    skillDistribution: { low: 3, medium: 12, high: 10 },
    resultDistribution: { low: 2, medium: 10, high: 13 },
    topPerformers: 8,
    needsSupport: 3,
    leader: '山田太郎'
  },
  {
    id: '2',
    name: '看護部B病棟',
    memberCount: 22,
    avgSkillScore: 72,
    avgResultScore: 75,
    skillDistribution: { low: 5, medium: 10, high: 7 },
    resultDistribution: { low: 4, medium: 11, high: 7 },
    topPerformers: 5,
    needsSupport: 6,
    leader: '佐藤花子'
  },
  {
    id: '3',
    name: 'リハビリテーション部',
    memberCount: 15,
    avgSkillScore: 85,
    avgResultScore: 83,
    skillDistribution: { low: 1, medium: 4, high: 10 },
    resultDistribution: { low: 1, medium: 5, high: 9 },
    topPerformers: 9,
    needsSupport: 1,
    leader: '鈴木一郎'
  },
  {
    id: '4',
    name: '介護部デイケア',
    memberCount: 18,
    avgSkillScore: 68,
    avgResultScore: 78,
    skillDistribution: { low: 6, medium: 8, high: 4 },
    resultDistribution: { low: 3, medium: 7, high: 8 },
    topPerformers: 4,
    needsSupport: 5,
    leader: '田中美咲'
  },
  {
    id: '5',
    name: '医事課',
    memberCount: 10,
    avgSkillScore: 74,
    avgResultScore: 71,
    skillDistribution: { low: 2, medium: 5, high: 3 },
    resultDistribution: { low: 3, medium: 4, high: 3 },
    topPerformers: 2,
    needsSupport: 3,
    leader: '伊藤健'
  }
];

export default function TeamAnalysisPage() {
  const router = useRouter();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [compareTeams, setCompareTeams] = useState<string[]>([]);

  const handleTeamSelect = (teamId: string) => {
    if (comparisonMode) {
      if (compareTeams.includes(teamId)) {
        setCompareTeams(compareTeams.filter(id => id !== teamId));
      } else if (compareTeams.length < 2) {
        setCompareTeams([...compareTeams, teamId]);
      }
    } else {
      setSelectedTeam(teamId === selectedTeam ? null : teamId);
    }
  };

  const getTeamPerformanceColor = (skillScore: number, resultScore: number) => {
    const avg = (skillScore + resultScore) / 2;
    if (avg >= 80) return 'text-green-600';
    if (avg >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="チーム評価分析" />
      
      <div className="max-w-7xl mx-auto p-6">
        <CategoryBackButton categoryId="dual-axis" />
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">チーム別パフォーマンス分析</h2>
            <button
              onClick={() => {
                setComparisonMode(!comparisonMode);
                setCompareTeams([]);
                setSelectedTeam(null);
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                comparisonMode 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {comparisonMode ? '比較モード中' : '比較モード'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="relative h-[400px] border-2 border-gray-200 rounded-lg p-4">
              <h3 className="font-medium mb-3">チーム配置マトリクス</h3>
              <svg width="100%" height="90%" viewBox="0 0 100 100">
                <line x1="50" y1="0" x2="50" y2="100" stroke="#ccc" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#ccc" strokeWidth="0.5" />
                
                <text x="98" y="98" textAnchor="end" fontSize="3" fill="#666">高</text>
                <text x="2" y="98" textAnchor="start" fontSize="3" fill="#666">低</text>
                <text x="50" y="98" textAnchor="middle" fontSize="3" fill="#666">平均スキル</text>
                
                <text x="2" y="4" textAnchor="start" fontSize="3" fill="#666">高</text>
                <text x="2" y="98" textAnchor="start" fontSize="3" fill="#666" transform="rotate(-90 2 50)">低</text>
                <text x="2" y="50" textAnchor="middle" fontSize="3" fill="#666" transform="rotate(-90 2 50)">平均成果</text>

                {mockTeamData.map(team => {
                  const isSelected = selectedTeam === team.id || compareTeams.includes(team.id);
                  const radius = Math.sqrt(team.memberCount) * 1.5;
                  return (
                    <g key={team.id} opacity={!selectedTeam && !comparisonMode || isSelected ? 1 : 0.3}>
                      <circle
                        cx={team.avgSkillScore}
                        cy={100 - team.avgResultScore}
                        r={radius}
                        fill={getTeamPerformanceColor(team.avgSkillScore, team.avgResultScore)}
                        fillOpacity="0.3"
                        stroke={getTeamPerformanceColor(team.avgSkillScore, team.avgResultScore)}
                        strokeWidth="1"
                        className="cursor-pointer hover:fill-opacity-50 transition-all"
                        onClick={() => handleTeamSelect(team.id)}
                      />
                      <text
                        x={team.avgSkillScore}
                        y={100 - team.avgResultScore}
                        textAnchor="middle"
                        fontSize="2.5"
                        fill="#333"
                        className="pointer-events-none"
                      >
                        {team.name.length > 8 ? team.name.substring(0, 8) + '...' : team.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">チーム一覧</h3>
              {mockTeamData.map(team => (
                <div
                  key={team.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedTeam === team.id || compareTeams.includes(team.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleTeamSelect(team.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{team.name}</h4>
                      <p className="text-sm text-gray-600">リーダー: {team.leader}</p>
                      <p className="text-sm text-gray-600">メンバー数: {team.memberCount}名</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getTeamPerformanceColor(team.avgSkillScore, team.avgResultScore)}`}>
                        {Math.round((team.avgSkillScore + team.avgResultScore) / 2)}
                      </div>
                      <p className="text-xs text-gray-600">総合スコア</p>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-4 text-xs">
                    <span>スキル: {team.avgSkillScore}</span>
                    <span>成果: {team.avgResultScore}</span>
                    <span className="text-green-600">高評価: {team.topPerformers}名</span>
                    <span className="text-red-600">要支援: {team.needsSupport}名</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {(selectedTeam || compareTeams.length > 0) && (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {(selectedTeam ? [selectedTeam] : compareTeams).map(teamId => {
                const team = mockTeamData.find(t => t.id === teamId);
                if (!team) return null;
                
                return (
                  <div key={teamId} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-4">{team.name}の詳細分析</h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-white p-4 rounded">
                        <p className="text-sm text-gray-600">平均スキルスコア</p>
                        <p className="text-2xl font-bold">{team.avgSkillScore}</p>
                      </div>
                      <div className="bg-white p-4 rounded">
                        <p className="text-sm text-gray-600">平均成果スコア</p>
                        <p className="text-2xl font-bold">{team.avgResultScore}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-1">スキル分布</p>
                        <div className="flex gap-2">
                          <div className="flex-1 bg-red-100 p-2 rounded text-center">
                            <p className="text-xs">低</p>
                            <p className="font-bold">{team.skillDistribution.low}</p>
                          </div>
                          <div className="flex-1 bg-yellow-100 p-2 rounded text-center">
                            <p className="text-xs">中</p>
                            <p className="font-bold">{team.skillDistribution.medium}</p>
                          </div>
                          <div className="flex-1 bg-green-100 p-2 rounded text-center">
                            <p className="text-xs">高</p>
                            <p className="font-bold">{team.skillDistribution.high}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-1">成果分布</p>
                        <div className="flex gap-2">
                          <div className="flex-1 bg-red-100 p-2 rounded text-center">
                            <p className="text-xs">低</p>
                            <p className="font-bold">{team.resultDistribution.low}</p>
                          </div>
                          <div className="flex-1 bg-yellow-100 p-2 rounded text-center">
                            <p className="text-xs">中</p>
                            <p className="font-bold">{team.resultDistribution.medium}</p>
                          </div>
                          <div className="flex-1 bg-green-100 p-2 rounded text-center">
                            <p className="text-xs">高</p>
                            <p className="font-bold">{team.resultDistribution.high}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-blue-50 rounded">
                        <p className="text-sm font-medium mb-2">推奨アクション</p>
                        <ul className="text-sm space-y-1">
                          {team.needsSupport > 3 && (
                            <li>• 要支援メンバーへの個別フォローアップ強化</li>
                          )}
                          {team.avgSkillScore < 75 && (
                            <li>• スキルアップ研修の実施</li>
                          )}
                          {team.avgResultScore < 75 && (
                            <li>• 目標設定と成果管理の見直し</li>
                          )}
                          {team.topPerformers >= team.memberCount * 0.3 && (
                            <li>• 高パフォーマーのベストプラクティス共有</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ScrollToTopButton />
      <DashboardButton />
    </div>
  );
}