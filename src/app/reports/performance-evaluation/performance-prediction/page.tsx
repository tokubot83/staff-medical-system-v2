'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { BackToReportsButton } from '@/components/BackToReportsButton';
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
      department: 'ICU',
      currentScore: 65,
      predictedScore: 60,
      growthPotential: 'low',
      riskLevel: 'high',
      keyFactors: ['モチベーション低下', '欠勤率上昇', 'フィードバック評価低'],
      recommendedActions: ['個別面談実施', 'キャリア相談', '配置転換検討']
    }
  ];

  const getPotentialColor = (potential: 'high' | 'medium' | 'low') => {
    switch (potential) {
      case 'high':
        return 'text-green-600 bg-green-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-red-600 bg-red-50';
    }
  };

  const getRiskColor = (risk: 'high' | 'medium' | 'low') => {
    switch (risk) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
    }
  };

  const getScoreChange = (current: number, predicted: number) => {
    const change = predicted - current;
    if (change > 0) {
      return { text: `+${change}`, color: 'text-green-600' };
    } else if (change < 0) {
      return { text: `${change}`, color: 'text-red-600' };
    }
    return { text: '±0', color: 'text-gray-600' };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="パフォーマンス予測" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <BackToReportsButton />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">パフォーマンス予測レポート</h1>
            <p className="text-gray-600">
              過去の評価データとAI分析により、職員の将来パフォーマンスを予測し、
              早期の介入ポイントと成長機会を特定します。
            </p>
          </div>
          
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={setSelectedFacility}
          />
        </div>

        {/* サマリーカード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">高成長予測</h3>
              <span className="text-2xl">🚀</span>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">28名</div>
            <p className="text-sm text-gray-600">全体の35%</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">要注意職員</h3>
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="text-3xl font-bold text-red-600 mb-2">12名</div>
            <p className="text-sm text-gray-600">早期介入推奨</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">平均予測精度</h3>
              <span className="text-2xl">🎯</span>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">89%</div>
            <p className="text-sm text-gray-600">過去データ基準</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">改善可能性</h3>
              <span className="text-2xl">📈</span>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">45名</div>
            <p className="text-sm text-gray-600">介入効果期待大</p>
          </div>
        </div>

        {/* 個人予測詳細 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">個人別パフォーマンス予測</h2>
          <div className="space-y-6">
            {predictionData.map((person, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{person.name}</h3>
                    <p className="text-sm text-gray-600">{person.department}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPotentialColor(person.growthPotential)}`}>
                      成長性: {person.growthPotential === 'high' ? '高' : person.growthPotential === 'medium' ? '中' : '低'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(person.riskLevel)}`}>
                      リスク: {person.riskLevel === 'high' ? '高' : person.riskLevel === 'medium' ? '中' : '低'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">現在のスコア</p>
                    <p className="text-2xl font-bold text-gray-900">{person.currentScore}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">予測スコア（6ヶ月後）</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-gray-900">{person.predictedScore}</p>
                      <span className={`text-sm font-medium ${getScoreChange(person.currentScore, person.predictedScore).color}`}>
                        {getScoreChange(person.currentScore, person.predictedScore).text}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">信頼度</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">85%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">主要予測要因</h4>
                    <ul className="space-y-1">
                      {person.keyFactors.map((factor, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">推奨アクション</h4>
                    <ul className="space-y-1">
                      {person.recommendedActions.map((action, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 予測モデル説明 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">予測モデル概要</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">使用データ</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  過去2年間の評価履歴
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  研修参加記録と成果
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  勤怠データとエンゲージメント指標
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  360度フィードバック結果
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">予測精度向上要因</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  機械学習による継続的な精度改善
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  部門特性を考慮した個別モデル
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  外部環境要因の組み込み
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  定期的なモデル再学習
                </li>
              </ul>
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