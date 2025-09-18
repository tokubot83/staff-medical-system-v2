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
  
  // 繧ｭ繝ｼ繝昴ず繧ｷ繝ｧ繝ｳ縺ｮ螳夂ｾｩ
  const keyPositions = [
    { title: '逵玖ｭｷ驛ｨ髟ｷ', candidates: ['蟶ｫ髟ｷ'] },
    { title: '蟶ｫ髟ｷ', candidates: ['荳ｻ莉ｻ逵玖ｭｷ蟶ｫ'] },
    { title: '荳ｻ莉ｻ逵玖ｭｷ蟶ｫ', candidates: ['逵玖ｭｷ蟶ｫ'] },
    { title: '繝ｪ繝上ン繝ｪ遘鷹聞', candidates: ['荳ｻ莉ｻ逅・ｭｦ逋よｳ募｣ｫ', '荳ｻ莉ｻ菴懈･ｭ逋よｳ募｣ｫ'] },
    { title: '荳ｻ莉ｻ逅・ｭｦ逋よｳ募｣ｫ', candidates: ['逅・ｭｦ逋よｳ募｣ｫ'] },
    { title: '荳ｻ莉ｻ菴懈･ｭ逋よｳ募｣ｫ', candidates: ['菴懈･ｭ逋よｳ募｣ｫ'] },
    { title: '荳ｻ莉ｻ莉玖ｭｷ遖冗･牙｣ｫ', candidates: ['莉玖ｭｷ遖冗･牙｣ｫ'] },
    { title: '莉玖ｭｷ荳ｻ莉ｻ', candidates: ['莉玖ｭｷ螢ｫ'] },
    { title: '荳ｻ莉ｻ逵玖ｭｷ陬懷勧閠・, candidates: ['逵玖ｭｷ陬懷勧閠・] }
  ];
  
  // 繧ｹ繧ｿ繝・ヵ繧偵ヵ繧｣繝ｫ繧ｿ繝ｪ繝ｳ繧ｰ
  const filteredStaff = useMemo(() => {
    return Object.values(staffDatabase).filter(staff => {
      if (selectedFacility === 'all') return true;
      return staff.facility === selectedFacility;
    });
  }, [selectedFacility]);
  
  // 迴ｾ莉ｻ閠・ｒ蜿門ｾ・  const getCurrentHolders = (positionTitle: string) => {
    return filteredStaff.filter(staff => 
      staff.position.includes(positionTitle)
    );
  };
  
  // 蠕檎ｶ呵・呵｣懊ｒ蜿門ｾ・  const getSuccessionCandidates = (candidatePositions: string[]): SuccessionCandidate[] => {
    return filteredStaff.filter(staff => {
      // 迴ｾ蝨ｨ縺ｮ閨ｷ菴阪′蛟呵｣懆・菴阪↓蜷ｫ縺ｾ繧後※縺・ｋ
      const isCandidate = candidatePositions.some(pos => staff.position.includes(pos));
      
      // 隧穂ｾ｡縺窟莉･荳・      const hasGoodEvaluation = ['S', 'A'].includes(staff.evaluation);
      
      return isCandidate && hasGoodEvaluation;
    }).map(staff => {
      // 邨碁ｨ灘ｹｴ謨ｰ繧貞叙蠕・      const tenure = parseInt(staff.tenure.match(/(\d+)蟷ｴ/)?.[1] || '0');
      const evaluationScore = staff.evaluation === 'S' ? 5 : staff.evaluation === 'A' ? 4 : 3;
      const skillAverage = staff.skills.reduce((sum, skill) => sum + skill.level, 0) / staff.skills.length;
      
      // 貅門ｙ蠎ｦ繧定ｨ育ｮ・      let readiness = 'Ready 3+ Years';
      const developmentNeeds: string[] = [];
      
      if (tenure >= 8 && evaluationScore >= 4 && skillAverage >= 85) {
        readiness = 'Ready Now';
      } else if (tenure >= 5 && evaluationScore >= 4 && skillAverage >= 75) {
        readiness = 'Ready 1-2 Years';
        if (tenure < 8) developmentNeeds.push('邨碁ｨ灘ｹｴ謨ｰ縺ｮ闢・ｩ・);
        if (skillAverage < 85) developmentNeeds.push('繧ｹ繧ｭ繝ｫ繝ｬ繝吶Ν縺ｮ蜷台ｸ・);
      } else {
        if (tenure < 5) developmentNeeds.push('邨碁ｨ灘ｹｴ謨ｰ縺ｮ闢・ｩ・);
        if (evaluationScore < 4) developmentNeeds.push('繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ縺ｮ謾ｹ蝟・);
        if (skillAverage < 75) developmentNeeds.push('繧ｹ繧ｭ繝ｫ繝ｬ繝吶Ν縺ｮ蜷台ｸ・);
      }
      
      // 繝ｪ繝ｼ繝繝ｼ繧ｷ繝・・繧ｹ繧ｭ繝ｫ縺御ｸ崎ｶｳ縺励※縺・ｋ蝣ｴ蜷・      const hasLeadershipSkill = staff.skills.some(skill => 
        skill.name.includes('繝ｪ繝ｼ繝繝ｼ繧ｷ繝・・') || 
        skill.name.includes('繝√・繝繝槭ロ繧ｸ繝｡繝ｳ繝・) ||
        skill.name.includes('譁ｰ莠ｺ謖・ｰ・) ||
        skill.name.includes('譁ｰ莠ｺ謨呵ご')
      );
      if (!hasLeadershipSkill) {
        developmentNeeds.push('繝ｪ繝ｼ繝繝ｼ繧ｷ繝・・繧ｹ繧ｭ繝ｫ縺ｮ鄙貞ｾ・);
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
  
  // 驕ｸ謚槭＆繧後◆繝昴ず繧ｷ繝ｧ繝ｳ縺ｮ諠・ｱ
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
  
  // 邨ｱ險域ュ蝣ｱ
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
      <CommonHeader title="蠕檎ｶ呵・ｨ育判" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 繝倥ャ繝繝ｼ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">蠕檎ｶ呵・ｨ育判</h1>
                <p className="text-gray-600 mt-2">繧ｭ繝ｼ繝昴ず繧ｷ繝ｧ繝ｳ縺ｮ蠕檎ｶ呵・呵｣懊ｒ迚ｹ螳壹＠縲∬ｨ育判逧・↑莠ｺ譚占ご謌舌ｒ謾ｯ謠ｴ</p>
                {facilityParam && (
                  <p className="text-sm text-gray-500 mt-1">蟇ｾ雎｡譁ｽ險ｭ: {facilityParam}</p>
                )}
              </div>
              <button
                onClick={() => exportToPDF({
                  title: '蠕檎ｶ呵・ｨ育判繝ｬ繝昴・繝・,
                  facility: facilityParam,
                  reportType: 'succession-planning',
                  elementId: 'report-content',
                  dateRange: new Date().toLocaleDateString('ja-JP')
                })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm pdf-exclude"
              >
                PDF繝繧ｦ繝ｳ繝ｭ繝ｼ繝・              </button>
            </div>
          </div>

          {/* 邨ｱ險域ュ蝣ｱ */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-blue-600">{statistics.totalKeyPositions}</div>
                <p className="text-sm text-gray-600 mt-1">繧ｭ繝ｼ繝昴ず繧ｷ繝ｧ繝ｳ謨ｰ</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-green-600">{statistics.readyNowCandidates}</div>
                <p className="text-sm text-gray-600 mt-1">蜊ｳ謌ｦ蜉帛呵｣懆・/p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-yellow-600">{statistics.ready1to2Years}</div>
                <p className="text-sm text-gray-600 mt-1">1-2蟷ｴ蜀・呵｣懆・/p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((statistics.positionsWithSuccessors / statistics.totalKeyPositions) * 100) || 0}%
                </div>
                <p className="text-sm text-gray-600 mt-1">蠕檎ｶ呵・き繝舌・邇・/p>
              </CardContent>
            </Card>
          </div>
          
          {/* 繝輔ぅ繝ｫ繧ｿ繝ｼ */}
          <Card>
            <CardHeader>
              <CardTitle>繝輔ぅ繝ｫ繧ｿ繝ｼ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    譁ｽ險ｭ
                  </label>
                  <select
                    value={selectedFacility}
                    onChange={(e) => setSelectedFacility(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">蜈ｨ譁ｽ險ｭ</option>
                    <option value="蟆丞次逞・劼">蟆丞次逞・劼</option>
                    <option value="遶狗･槭Μ繝上ン繝ｪ繝・・繧ｷ繝ｧ繝ｳ貂ｩ豕臥羅髯｢">遶狗･槭Μ繝上ン繝ｪ繝・・繧ｷ繝ｧ繝ｳ貂ｩ豕臥羅髯｢</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    繧ｭ繝ｼ繝昴ず繧ｷ繝ｧ繝ｳ
                  </label>
                  <select
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">驕ｸ謚槭＠縺ｦ縺上□縺輔＞</option>
                    {keyPositions.map(pos => (
                      <option key={pos.title} value={pos.title}>{pos.title}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* 繧ｭ繝ｼ繝昴ず繧ｷ繝ｧ繝ｳ荳隕ｧ */}
          <Card>
            <CardHeader>
              <CardTitle>繧ｭ繝ｼ繝昴ず繧ｷ繝ｧ繝ｳ荳隕ｧ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        繝昴ず繧ｷ繝ｧ繝ｳ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        迴ｾ莉ｻ閠・焚
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        蜊ｳ謌ｦ蜉帛呵｣・                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        1-2蟷ｴ蜀・呵｣・                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        3蟷ｴ莉･荳雁呵｣・                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        迥ｶ諷・                      </th>
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
                              {readyNow >= holders.length ? '蜈・香' :
                               readyNow + ready1to2 >= holders.length ? '貅門ｙ荳ｭ' :
                               '荳崎ｶｳ'}
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
          
          {/* 驕ｸ謚槭＆繧後◆繝昴ず繧ｷ繝ｧ繝ｳ縺ｮ隧ｳ邏ｰ */}
          {selectedPositionData && (
            <Card>
              <CardHeader>
                <CardTitle>{selectedPosition}縺ｮ蠕檎ｶ呵・ｨ育判</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* 迴ｾ莉ｻ閠・*/}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">迴ｾ莉ｻ閠・/h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedPositionData.currentHolders.map((holder, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full ${holder.avatar} flex items-center justify-center text-white font-bold`}>
                              {holder.nameInitial}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{holder.name}</p>
                              <p className="text-sm text-gray-500">{holder.department} 窶｢ {holder.tenure}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 蠕檎ｶ呵・呵｣・*/}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">蠕檎ｶ呵・呵｣・/h4>
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
                                  {candidate.position} 窶｢ {candidate.department} 窶｢ {candidate.tenure}
                                </p>
                                <div className="flex items-center mt-1 space-x-2">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    candidate.readiness === 'Ready Now' ? 'bg-green-100 text-green-800' :
                                    candidate.readiness === 'Ready 1-2 Years' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {candidate.readiness === 'Ready Now' ? '蜊ｳ謌ｦ蜉・ :
                                     candidate.readiness === 'Ready 1-2 Years' ? '1-2蟷ｴ蠕・ :
                                     '3蟷ｴ莉･荳・}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    隧穂ｾ｡: {candidate.evaluation}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600">
                                {Math.round(candidate.readinessScore)}%
                              </div>
                              <p className="text-xs text-gray-500">貅門ｙ蠎ｦ繧ｹ繧ｳ繧｢</p>
                            </div>
                          </div>
                          
                          {/* 髢狗匱繝九・繧ｺ */}
                          {candidate.developmentNeeds.length > 0 && (
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-xs font-medium text-gray-700 mb-1">髢狗匱繝九・繧ｺ</p>
                              <div className="flex flex-wrap gap-1">
                                {candidate.developmentNeeds.map((need, idx) => (
                                  <span key={idx} className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded">
                                    {need}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* 繧ｹ繧ｭ繝ｫ */}
                          <div className="mt-3">
                            <p className="text-xs font-medium text-gray-700 mb-1">荳ｻ隕√せ繧ｭ繝ｫ</p>
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
      </div><CategoryTopButton categoryPath="/reports/talent-mapping" categoryName="繧ｿ繝ｬ繝ｳ繝医・繝・ヴ繝ｳ繧ｰ" /></div>
  );
}

export default function SuccessionPlanningPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessionPlanningContent />
    </Suspense>
  );
}