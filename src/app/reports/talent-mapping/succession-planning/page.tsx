'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { exportToPDF } from '@/utils/pdfExport';
import { staffDatabase } from '@/app/data/staffData';
import { StaffDetail } from "@/types/staff";

interface SuccessionCandidate extends StaffDetail {
  readiness: string;
  readinessScore: number;
  developmentNeeds: string[];
}

function SuccessionPlanningContent() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  const [selectedFacility, setSelectedFacility] = useState(facilityParam || 'all');
  const [selectedPosition, setSelectedPosition] = useState('');
  
  // キーポジションの定義
  const keyPositions = [
    { title: '看護部長', candidates: ['師長'] },
    { title: '師長', candidates: ['主任看護師'] },
    { title: '主任看護師', candidates: ['看護師'] },
    { title: 'リハビリ科長', candidates: ['主任琁E��療法士', '主任作業療法士'] },
    { title: '主任琁E��療法士', candidates: ['琁E��療法士'] },
    { title: '主任作業療法士', candidates: ['作業療法士'] },
    { title: '主任介護福祉士', candidates: ['介護福祉士'] },
    { title: '介護主任', candidates: ['介護士'] },
    { title: '主任看護補助老E, candidates: ['看護補助老E] }
  ];
  
  // スタチE��をフィルタリング
  const filteredStaff = useMemo(() => {
    return Object.values(staffDatabase).filter(staff => {
      if (selectedFacility === 'all') return true;
      return staff.facility === selectedFacility;
    });
  }, [selectedFacility]);
  
  // 現任老E��取征E  const getCurrentHolders = (positionTitle: string) => {
    return filteredStaff.filter(staff => 
      staff.position.includes(positionTitle)
    );
  };
  
  // 後継老E��補を取征E  const getSuccessionCandidates = (candidatePositions: string[]): SuccessionCandidate[] => {
    return filteredStaff.filter(staff => {
      // 現在の職位が候補�E位に含まれてぁE��
      const isCandidate = candidatePositions.some(pos => staff.position.includes(pos));
      
      // 評価がA以丁E      const hasGoodEvaluation = ['S', 'A'].includes(staff.evaluation);
      
      return isCandidate && hasGoodEvaluation;
    }).map(staff => {
      // 経験年数を取征E      const tenure = parseInt(staff.tenure.match(/(\d+)年/)?.[1] || '0');
      const evaluationScore = staff.evaluation === 'S' ? 5 : staff.evaluation === 'A' ? 4 : 3;
      const skillAverage = staff.skills.reduce((sum, skill) => sum + skill.level, 0) / staff.skills.length;
      
      // 準備度を計箁E      let readiness = 'Ready 3+ Years';
      const developmentNeeds: string[] = [];
      
      if (tenure >= 8 && evaluationScore >= 4 && skillAverage >= 85) {
        readiness = 'Ready Now';
      } else if (tenure >= 5 && evaluationScore >= 4 && skillAverage >= 75) {
        readiness = 'Ready 1-2 Years';
        if (tenure < 8) developmentNeeds.push('経験年数の蓁E��E);
        if (skillAverage < 85) developmentNeeds.push('スキルレベルの向丁E);
      } else {
        if (tenure < 5) developmentNeeds.push('経験年数の蓁E��E);
        if (evaluationScore < 4) developmentNeeds.push('パフォーマンスの改喁E);
        if (skillAverage < 75) developmentNeeds.push('スキルレベルの向丁E);
      }
      
      // リーダーシチE�Eスキルが不足してぁE��場吁E      const hasLeadershipSkill = staff.skills.some(skill => 
        skill.name.includes('リーダーシチE�E') || 
        skill.name.includes('チ�EムマネジメンチE) ||
        skill.name.includes('新人持E��E) ||
        skill.name.includes('新人教育')
      );
      if (!hasLeadershipSkill) {
        developmentNeeds.push('リーダーシチE�Eスキルの習征E);
      }
      
      const readinessScore = (tenure / 20 + evaluationScore / 5 + skillAverage / 100) / 3 * 100;
      
      return {
        ...staff,
        readiness,
        readinessScore,
        developmentNeeds
      } as SuccessionCandidate;
    }).sort((a, b) => b.readinessScore - a.readinessScore);
  };
  
  // 選択されたポジションの惁E��
  const selectedPositionData = useMemo(() => {
    if (!selectedPosition) return null;
    const position = keyPositions.find(p => p.title === selectedPosition);
    if (!position) return null;
    
    return {
      ...position,
      currentHolders: getCurrentHolders(position.title),
      candidates: getSuccessionCandidates(position.candidates)
    };
  }, [selectedPosition, filteredStaff]);
  
  // 統計情報
  const statistics = useMemo(() => {
    const stats = {
      totalKeyPositions: 0,
      positionsWithSuccessors: 0,
      readyNowCandidates: 0,
      ready1to2Years: 0,
      ready3PlusYears: 0
    };
    
    keyPositions.forEach(position => {
      const holders = getCurrentHolders(position.title);
      if (holders.length > 0) {
        stats.totalKeyPositions += holders.length;
        const candidates = getSuccessionCandidates(position.candidates);
        if (candidates.length > 0) {
          stats.positionsWithSuccessors += holders.length;
        }
        candidates.forEach(candidate => {
          if (candidate.readiness === 'Ready Now') stats.readyNowCandidates++;
          else if (candidate.readiness === 'Ready 1-2 Years') stats.ready1to2Years++;
          else stats.ready3PlusYears++;
        });
      }
    });
    
    return stats;
  }, [filteredStaff]);

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="後継老E��画" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">後継老E��画</h1>
                <p className="text-gray-600 mt-2">キーポジションの後継老E��補を特定し、計画皁E��人材育成を支援</p>
                {facilityParam && (
                  <p className="text-sm text-gray-500 mt-1">対象施設: {facilityParam}</p>
                )}
              </div>
              <button
                onClick={() => exportToPDF({
                  title: '後継老E��画レポ�EチE,
                  facility: facilityParam,
                  reportType: 'succession-planning',
                  elementId: 'report-content',
                  dateRange: new Date().toLocaleDateString('ja-JP')
                })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm pdf-exclude"
              >
                PDFダウンローチE              </button>
            </div>
          </div>

          {/* 統計情報 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-blue-600">{statistics.totalKeyPositions}</div>
                <p className="text-sm text-gray-600 mt-1">キーポジション数</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-green-600">{statistics.readyNowCandidates}</div>
                <p className="text-sm text-gray-600 mt-1">即戦力候補老E/p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-yellow-600">{statistics.ready1to2Years}</div>
                <p className="text-sm text-gray-600 mt-1">1-2年冁E��補老E/p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((statistics.positionsWithSuccessors / statistics.totalKeyPositions) * 100) || 0}%
                </div>
                <p className="text-sm text-gray-600 mt-1">後継老E��バ�E玁E/p>
              </CardContent>
            </Card>
          </div>
          
          {/* フィルター */}
          <Card>
            <CardHeader>
              <CardTitle>フィルター</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    施設
                  </label>
                  <select
                    value={selectedFacility}
                    onChange={(e) => setSelectedFacility(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">全施設</option>
                    <option value="小原痁E��">小原痁E��</option>
                    <option value="立神リハビリチE�Eション温泉病院">立神リハビリチE�Eション温泉病院</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    キーポジション
                  </label>
                  <select
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">選択してください</option>
                    {keyPositions.map(pos => (
                      <option key={pos.title} value={pos.title}>{pos.title}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* キーポジション一覧 */}
          <Card>
            <CardHeader>
              <CardTitle>キーポジション一覧</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ポジション
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        現任老E��
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        即戦力候裁E                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        1-2年冁E��裁E                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        3年以上候裁E                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状慁E                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {keyPositions.map((position, index) => {
                      const holders = getCurrentHolders(position.title);
                      const candidates = getSuccessionCandidates(position.candidates);
                      const readyNow = candidates.filter(c => c.readiness === 'Ready Now').length;
                      const ready1to2 = candidates.filter(c => c.readiness === 'Ready 1-2 Years').length;
                      const ready3Plus = candidates.filter(c => c.readiness === 'Ready 3+ Years').length;
                      
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {position.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {holders.length}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {readyNow}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {ready1to2}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {ready3Plus}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              readyNow >= holders.length ? 'bg-green-100 text-green-800' :
                              readyNow + ready1to2 >= holders.length ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {readyNow >= holders.length ? '允E��' :
                               readyNow + ready1to2 >= holders.length ? '準備中' :
                               '不足'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          {/* 選択されたポジションの詳細 */}
          {selectedPositionData && (
            <Card>
              <CardHeader>
                <CardTitle>{selectedPosition}の後継老E��画</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* 現任老E*/}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">現任老E/h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedPositionData.currentHolders.map((holder, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full ${holder.avatar} flex items-center justify-center text-white font-bold`}>
                              {holder.nameInitial}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{holder.name}</p>
                              <p className="text-sm text-gray-500">{holder.department} • {holder.tenure}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 後継老E��裁E*/}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">後継老E��裁E/h4>
                    <div className="space-y-4">
                      {selectedPositionData.candidates.map((candidate, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-12 h-12 rounded-full ${candidate.avatar} flex items-center justify-center text-white font-bold`}>
                                {candidate.nameInitial}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{candidate.name}</p>
                                <p className="text-sm text-gray-500">
                                  {candidate.position} • {candidate.department} • {candidate.tenure}
                                </p>
                                <div className="flex items-center mt-1 space-x-2">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    candidate.readiness === 'Ready Now' ? 'bg-green-100 text-green-800' :
                                    candidate.readiness === 'Ready 1-2 Years' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {candidate.readiness === 'Ready Now' ? '即戦劁E :
                                     candidate.readiness === 'Ready 1-2 Years' ? '1-2年征E :
                                     '3年以丁E}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    評価: {candidate.evaluation}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600">
                                {Math.round(candidate.readinessScore)}%
                              </div>
                              <p className="text-xs text-gray-500">準備度スコア</p>
                            </div>
                          </div>
                          
                          {/* 開発ニ�Eズ */}
                          {candidate.developmentNeeds.length > 0 && (
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-xs font-medium text-gray-700 mb-1">開発ニ�Eズ</p>
                              <div className="flex flex-wrap gap-1">
                                {candidate.developmentNeeds.map((need, idx) => (
                                  <span key={idx} className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded">
                                    {need}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* スキル */}
                          <div className="mt-3">
                            <p className="text-xs font-medium text-gray-700 mb-1">主要スキル</p>
                            <div className="grid grid-cols-2 gap-2">
                              {candidate.skills.slice(0, 4).map((skill, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs">
                                  <span className="text-gray-600">{skill.name}</span>
                                  <div className="flex items-center">
                                    <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-1">
                                      <div
                                        className="bg-blue-600 h-1.5 rounded-full"
                                        style={{ width: `${(skill.level / 100) * 100}%` }}
                                      />
                                    </div>
                                    <span className="text-gray-500">{skill.level}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div><CategoryTopButton categoryPath="/reports/talent-mapping" categoryName="タレント�EチE��ング" /></div>
  );
}

export default function SuccessionPlanningPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessionPlanningContent />
    </Suspense>
  );
}