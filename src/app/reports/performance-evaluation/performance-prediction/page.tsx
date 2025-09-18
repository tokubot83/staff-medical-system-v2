'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import FacilitySelector from '@/components/reports/FacilitySelector';

interface PredictionData {
  name: string;
  department: string;
  currentScore: number;
  predictedScore: number;
  growthPotential: 'high' | 'medium' | 'low';
  riskLevel: 'high' | 'medium' | 'low';
  keyFactors: string[];
  recommendedActions: string[];
}

function PerformancePredictionContent() {
  const searchParams = useSearchParams();
  const facilityFromUrl = searchParams.get('facility');
  const [selectedFacility, setSelectedFacility] = useState(facilityFromUrl || '');

  // サンプルチE�Eタ
  const predictionData: PredictionData[] = [
    {
      name: '佐藤健一',
      department: '冁E��病棁E,
      currentScore: 72,
      predictedScore: 85,
      growthPotential: 'high',
      riskLevel: 'low',
      keyFactors: ['研修参加玁E��E, '自己学習意欲強', 'メンター制度活用'],
      recommendedActions: ['リーダーシチE�E研修', '上級賁E��取得支援']
    },
    {
      name: '高橋美穁E,
      department: '外科病棁E,
      currentScore: 68,
      predictedScore: 71,
      growthPotential: 'medium',
      riskLevel: 'medium',
      keyFactors: ['業務負荷髁E, 'スキル習得�Eース標溁E, 'チ�Eム貢献度良好'],
      recommendedActions: ['業務効玁E��支援', 'スキルアチE�E研修']
    },
    {
      name: '伊藤次郁E,
      department: '救急私E,
      currentScore: 65,
      predictedScore: 60,
      growthPotential: 'low',
      riskLevel: 'high',
      keyFactors: ['ストレス髁E, '研修参加玁E��E, 'チ�Eム連携課顁E],
      recommendedActions: ['メンタルヘルスケア', '個別面諁E��施', '業務負荷調整']
    }
  ];

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6"></div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            パフォーマンス予測刁E��
          </h1>
          
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={setSelectedFacility}
          />
        </div>

        {/* 予測概要E*/}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">高�E長予測老E/h3>
            <p className="text-3xl font-bold text-green-600">15吁E/p>
            <p className="text-sm text-gray-600 mt-1">次世代リーダー候裁E/p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">要支援老E/h3>
            <p className="text-3xl font-bold text-red-600">8吁E/p>
            <p className="text-sm text-gray-600 mt-1">早期介�E推奨</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">平坁E�E長玁E/h3>
            <p className="text-3xl font-bold text-blue-600">+12.5%</p>
            <p className="text-sm text-gray-600 mt-1">6ヶ月後予測</p>
          </div>
        </div>

        {/* 個別予測リスチE*/}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              個別パフォーマンス予測
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {predictionData.map((person, index) => (
              <div key={index} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-lg font-medium text-gray-900">{person.name}</h3>
                      <span className="text-sm text-gray-500">{person.department}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(person.riskLevel)}`}>
                        リスク: {person.riskLevel === 'high' ? '髁E : person.riskLevel === 'medium' ? '中' : '佁E}
                      </span>
                    </div>
                    
                    {/* スコア予測 */}
                    <div className="flex items-center gap-8 mb-4">
                      <div>
                        <span className="text-sm text-gray-500">現在スコア</span>
                        <p className="text-2xl font-bold text-gray-900">{person.currentScore}</p>
                      </div>
                      <div className="text-2xl text-gray-400">ↁE/div>
                      <div>
                        <span className="text-sm text-gray-500">予測スコア�E�Eヶ月後！E/span>
                        <p className={`text-2xl font-bold ${person.predictedScore > person.currentScore ? 'text-green-600' : 'text-red-600'}`}>
                          {person.predictedScore}
                        </p>
                      </div>
                      <div className="ml-4">
                        <span className={`text-lg font-medium ${getPotentialColor(person.growthPotential)}`}>
                          成長ポテンシャル: {person.growthPotential === 'high' ? '髁E : person.growthPotential === 'medium' ? '中' : '佁E}
                        </span>
                      </div>
                    </div>

                    {/* 要因刁E�� */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">主要要因</h4>
                        <ul className="space-y-1">
                          {person.keyFactors.map((factor, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start">
                              <span className="mr-2">•</span>
                              <span>{factor}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">推奨アクション</h4>
                        <ul className="space-y-1">
                          {person.recommendedActions.map((action, i) => (
                            <li key={i} className="text-sm text-blue-600 flex items-start">
                              <span className="mr-2">ↁE/span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI予測モチE��惁E�� */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            AI予測モチE��詳細
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">予測精度</h3>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">モチE��精度</span>
                  <span className="text-lg font-bold text-green-600">87.3%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '87.3%' }}></div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">老E�E要因</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 過去の評価履歴とトレンチE/li>
                <li>• 研修参加玁E��学習進捁E/li>
                <li>• チ�Eム冁E��の貢献度</li>
                <li>• 勤怠状況と健康持E��E/li>
                <li>• 絁E��風土との適合性</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 絁E���E体�E予測サマリー */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            絁E���E体�E予測サマリー
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <h3 className="font-medium text-green-900">成長トレンチE/h3>
                <p className="text-sm text-green-700">6ヶ月後�E絁E���E体�Eパフォーマンス向上率</p>
              </div>
              <span className="text-2xl font-bold text-green-600">+15.2%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div>
                <h3 className="font-medium text-yellow-900">要注意領域</h3>
                <p className="text-sm text-yellow-700">パフォーマンス低下リスクのある部署数</p>
              </div>
              <span className="text-2xl font-bold text-yellow-600">3部署</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <h3 className="font-medium text-blue-900">育成効极E/h3>
                <p className="text-sm text-blue-700">研修・育成�Eログラムの予測効极E/p>
              </div>
              <span className="text-2xl font-bold text-blue-600">ROI 320%</span>
            </div>
          </div>
        </div>

        {/* 活用ポインチE*/}
        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            💡 パフォーマンス予測の活用ポインチE
          </h2>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• 高�E長予測老E��特定し、次世代リーダー育成�Eログラムへ優先的に参加</li>
            <li>• リスクの高い職員に対して早期介�Eし、E��職防止と成長支援を実施</li>
            <li>• 予測チE�Eタを基にした個別最適な育成計画の立桁E/li>
            <li>• 絁E���E体�Eパフォーマンス向上に向けた戦略皁E��材投賁E�E実現</li>
          </ul>
        </div>
      </div><CategoryTopButton categoryPath="/reports/performance-evaluation" categoryName="人事評価刁E��" /></div>
  );
}

export default function PerformancePredictionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PerformancePredictionContent />
    </Suspense>
  );
}