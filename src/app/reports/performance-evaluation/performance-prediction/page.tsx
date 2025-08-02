'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { BackToReportsButton } from '@/components/BackToReportsButton';
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

  // サンプルデータ
  const predictionData: PredictionData[] = [
    {
      name: '佐藤健一',
      department: '内科病棟',
      currentScore: 72,
      predictedScore: 85,
      growthPotential: 'high',
      riskLevel: 'low',
      keyFactors: ['研修参加率高', '自己学習意欲強', 'メンター制度活用'],
      recommendedActions: ['リーダーシップ研修', '上級資格取得支援']
    },
    {
      name: '高橋美穂',
      department: '外科病棟',
      currentScore: 68,
      predictedScore: 71,
      growthPotential: 'medium',
      riskLevel: 'medium',
      keyFactors: ['業務負荷高', 'スキル習得ペース標準', 'チーム貢献度良好'],
      recommendedActions: ['業務効率化支援', 'スキルアップ研修']
    },
    {
      name: '伊藤次郎',
      department: '救急科',
      currentScore: 65,
      predictedScore: 60,
      growthPotential: 'low',
      riskLevel: 'high',
      keyFactors: ['ストレス高', '研修参加率低', 'チーム連携課題'],
      recommendedActions: ['メンタルヘルスケア', '個別面談実施', '業務負荷調整']
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
        <div className="mb-6">
          <BackToReportsButton />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            パフォーマンス予測分析
          </h1>
          
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={setSelectedFacility}
          />
        </div>

        {/* 予測概要 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">高成長予測者</h3>
            <p className="text-3xl font-bold text-green-600">15名</p>
            <p className="text-sm text-gray-600 mt-1">次世代リーダー候補</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">要支援者</h3>
            <p className="text-3xl font-bold text-red-600">8名</p>
            <p className="text-sm text-gray-600 mt-1">早期介入推奨</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">平均成長率</h3>
            <p className="text-3xl font-bold text-blue-600">+12.5%</p>
            <p className="text-sm text-gray-600 mt-1">6ヶ月後予測</p>
          </div>
        </div>

        {/* 個別予測リスト */}
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
                        リスク: {person.riskLevel === 'high' ? '高' : person.riskLevel === 'medium' ? '中' : '低'}
                      </span>
                    </div>
                    
                    {/* スコア予測 */}
                    <div className="flex items-center gap-8 mb-4">
                      <div>
                        <span className="text-sm text-gray-500">現在スコア</span>
                        <p className="text-2xl font-bold text-gray-900">{person.currentScore}</p>
                      </div>
                      <div className="text-2xl text-gray-400">→</div>
                      <div>
                        <span className="text-sm text-gray-500">予測スコア（6ヶ月後）</span>
                        <p className={`text-2xl font-bold ${person.predictedScore > person.currentScore ? 'text-green-600' : 'text-red-600'}`}>
                          {person.predictedScore}
                        </p>
                      </div>
                      <div className="ml-4">
                        <span className={`text-lg font-medium ${getPotentialColor(person.growthPotential)}`}>
                          成長ポテンシャル: {person.growthPotential === 'high' ? '高' : person.growthPotential === 'medium' ? '中' : '低'}
                        </span>
                      </div>
                    </div>

                    {/* 要因分析 */}
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
                              <span className="mr-2">→</span>
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

        {/* AI予測モデル情報 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            AI予測モデル詳細
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">予測精度</h3>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">モデル精度</span>
                  <span className="text-lg font-bold text-green-600">87.3%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '87.3%' }}></div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">考慮要因</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 過去の評価履歴とトレンド</li>
                <li>• 研修参加率と学習進捗</li>
                <li>• チーム内での貢献度</li>
                <li>• 勤怠状況と健康指標</li>
                <li>• 組織風土との適合性</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 組織全体の予測サマリー */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            組織全体の予測サマリー
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <h3 className="font-medium text-green-900">成長トレンド</h3>
                <p className="text-sm text-green-700">6ヶ月後の組織全体のパフォーマンス向上率</p>
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
                <h3 className="font-medium text-blue-900">育成効果</h3>
                <p className="text-sm text-blue-700">研修・育成プログラムの予測効果</p>
              </div>
              <span className="text-2xl font-bold text-blue-600">ROI 320%</span>
            </div>
          </div>
        </div>

        {/* 活用ポイント */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            💡 パフォーマンス予測の活用ポイント
          </h2>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• 高成長予測者を特定し、次世代リーダー育成プログラムへ優先的に参加</li>
            <li>• リスクの高い職員に対して早期介入し、離職防止と成長支援を実施</li>
            <li>• 予測データを基にした個別最適な育成計画の立案</li>
            <li>• 組織全体のパフォーマンス向上に向けた戦略的人材投資の実現</li>
          </ul>
        </div>
      </div>

      <ScrollToTopButton />
      <CategoryTopButton categoryPath="/reports/performance-evaluation" categoryName="人事評価分析" />
      <BackToReportsButton />
      <DashboardButton />
    </div>
  );
}

export default function PerformancePredictionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PerformancePredictionContent />
    </Suspense>
  );
}