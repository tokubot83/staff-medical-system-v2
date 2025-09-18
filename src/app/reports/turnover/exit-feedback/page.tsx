'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import FacilitySelector from '@/components/reports/FacilitySelector';
import CategoryBackButton from '@/components/reports/CategoryBackButton';
import DataComment from '@/components/DataComment';
import { Bar, Radar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// チE��チE�Eタ生�E
const generateFeedbackData = () => {
  return {
    exitReasons: {
      '給与�E征E��': 35,
      'ワークライフバランス': 28,
      '人間関俁E: 22,
      'キャリア機企E: 18,
      '業務負荷': 25,
      '絁E��文匁E: 15,
      '上司との関俁E: 20,
      'そ�E仁E: 12
    },
    satisfactionScores: {
      '給与�E福利厚生': 2.8,
      '労働環墁E: 3.2,
      'チ�Eムワーク': 3.8,
      '成長機企E: 2.5,
      '経営方釁E: 3.0,
      '評価制度': 2.6,
      'コミュニケーション': 3.4
    },
    sentimentAnalysis: {
      positive: 25,
      neutral: 35,
      negative: 40
    },
    keyThemes: [
      { theme: '残業時間の長ぁE, frequency: 68, sentiment: -0.8 },
      { theme: '昁E��機会�E不足', frequency: 52, sentiment: -0.6 },
      { theme: '給与水溁E, frequency: 48, sentiment: -0.7 },
      { theme: 'チ�Eム協力', frequency: 45, sentiment: 0.4 },
      { theme: '研修制度', frequency: 38, sentiment: 0.2 },
      { theme: '有給取得困難', frequency: 35, sentiment: -0.9 }
    ],
    departmentFeedback: {
      '看護部': { positive: 20, neutral: 30, negative: 50 },
      '医療技術部': { positive: 30, neutral: 40, negative: 30 },
      'リハビリ部': { positive: 35, neutral: 35, negative: 30 },
      '事務部': { positive: 25, neutral: 45, negative: 30 }
    },
    recommendations: [
      { category: '給与�E征E��', action: '給与体系の見直ぁE, priority: 'high', impact: 85 },
      { category: 'ワークライフバランス', action: 'フレチE��スタイム導�E', priority: 'high', impact: 78 },
      { category: '人間関俁E, action: 'メンター制度強匁E, priority: 'medium', impact: 65 },
      { category: 'キャリア機企E, action: 'キャリアパス明確匁E, priority: 'medium', impact: 70 }
    ]
  };
};

function ExitFeedbackContent() {
  const searchParams = useSearchParams();
  const selectedFacility = searchParams.get('facility') || '';
  const [feedbackData] = useState(generateFeedbackData());
  const [selectedView, setSelectedView] = useState('reasons');

  // 退職琁E��チャーチE
  const exitReasonsChart = {
    labels: Object.keys(feedbackData.exitReasons),
    datasets: [{
      label: '言及率 (%)',
      data: Object.values(feedbackData.exitReasons),
      backgroundColor: 'rgba(239, 68, 68, 0.6)',
      borderColor: 'rgb(239, 68, 68)',
      borderWidth: 1
    }]
  };

  // 満足度レーダーチャーチE
  const satisfactionRadarChart = {
    labels: Object.keys(feedbackData.satisfactionScores),
    datasets: [{
      label: '満足度スコア',
      data: Object.values(feedbackData.satisfactionScores),
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgb(59, 130, 246)',
      pointBackgroundColor: 'rgb(59, 130, 246)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(59, 130, 246)'
    }]
  };

  // センチメント�E析チャーチE
  const sentimentChart = {
    labels: ['ポジチE��チE, 'ニュートラル', 'ネガチE��チE],
    datasets: [{
      data: [
        feedbackData.sentimentAnalysis.positive,
        feedbackData.sentimentAnalysis.neutral,
        feedbackData.sentimentAnalysis.negative
      ],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(156, 163, 175, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: [
        'rgb(34, 197, 94)',
        'rgb(156, 163, 175)',
        'rgb(239, 68, 68)'
      ],
      borderWidth: 2
    }]
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.3) return 'text-green-600';
    if (sentiment < -0.3) return 'text-red-600';
    return 'text-gray-600';
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return styles[priority as keyof typeof styles] || styles.low;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="退職老E��ィードバチE��刁E��" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">💭</span>
            <h1 className="text-2xl font-bold text-gray-900">退職老E��ィードバチE��刁E��</h1>
          </div>
          <p className="text-gray-600">
            退職老E�E声を�E析し、絁E���E課題を明確化して改喁E��つなげます、E
          </p>
        </div>

        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={() => {}}
          />
        </div>

        {/* サマリーカーチE*/}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="text-sm text-gray-600">回答率</p>
            <p className="text-2xl font-bold text-blue-600">78%</p>
            <p className="text-xs text-gray-500">156/200吁E/p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg">
            <p className="text-sm text-gray-600">ネガチE��ブ評価</p>
            <p className="text-2xl font-bold text-red-600">40%</p>
            <p className="text-xs text-gray-500">前年毁E+5%</p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg">
            <p className="text-sm text-gray-600">最多離職琁E��</p>
            <p className="text-lg font-bold text-yellow-600">給与�E征E��</p>
            <p className="text-xs text-gray-500">35%が言叁E/p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <p className="text-sm text-gray-600">改喁E��能性</p>
            <p className="text-2xl font-bold text-green-600">65%</p>
            <p className="text-xs text-gray-500">対策により防止可能</p>
          </div>
        </div>

        {/* ビュー選択タチE*/}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex space-x-4">
            {[
              { id: 'reasons', label: '退職琁E��' },
              { id: 'satisfaction', label: '満足度刁E��' },
              { id: 'themes', label: 'キーチE�EチE },
              { id: 'recommendations', label: '改喁E��桁E }
            ].map(view => (
              <button
                key={view.id}
                onClick={() => setSelectedView(view.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedView === view.id
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>
        </div>

        {/* メインコンチE��チE*/}
        {selectedView === 'reasons' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">退職琁E��の刁E��E/h3>
              <Bar data={exitReasonsChart} options={{
                indexAxis: 'y',
                plugins: {
                  legend: { display: false }
                }
              }} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">センチメント�E极E/h3>
                <Doughnut data={sentimentChart} />
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">代表皁E��コメンチE/h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4">
                    <p className="text-sm text-gray-600 italic">&ldquo;残業が多く、家族との時間が取れなぁErdquo;</p>
                    <p className="text-xs text-gray-500 mt-1">看護部・30代</p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <p className="text-sm text-gray-600 italic">&ldquo;給与が他院と比輁E��て低い&rdquo;</p>
                    <p className="text-xs text-gray-500 mt-1">医療技術部・20代</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <p className="text-sm text-gray-600 italic">&ldquo;同�Eとの関係�E良好だっぁErdquo;</p>
                    <p className="text-xs text-gray-500 mt-1">リハビリ部・40代</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedView === 'satisfaction' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">満足度スコア�E�E点満点�E�E/h3>
              <div className="max-w-2xl mx-auto">
                <Radar data={satisfactionRadarChart} options={{
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 5,
                      ticks: { stepSize: 1 }
                    }
                  }
                }} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">頁E��</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">スコア</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">前年毁E/th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">業界平坁E/th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(feedbackData.satisfactionScores).map(([item, score]) => (
                    <tr key={item}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={score < 3 ? 'text-red-600 font-semibold' : ''}>{score.toFixed(1)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {score < 3 ? 'ↁE-0.2' : 'ↁE+0.1'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3.5</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedView === 'themes' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">チE�EチE/th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">言及頻度</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">センチメンチE/th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">影響度</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {feedbackData.keyThemes.map((theme, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{theme.theme}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{theme.frequency}囁E/td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={getSentimentColor(theme.sentiment)}>
                        {theme.sentiment > 0 ? '�E' : theme.sentiment < 0 ? '�E' : '�E'} {theme.sentiment.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full" 
                          style={{ width: `${Math.abs(theme.sentiment) * theme.frequency / 68 * 100}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedView === 'recommendations' && (
          <div className="space-y-6">
            {feedbackData.recommendations.map((rec, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold">{rec.action}</h4>
                    <p className="text-sm text-gray-600">{rec.category}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityBadge(rec.priority)}`}>
                    {rec.priority === 'high' ? '髁E : rec.priority === 'medium' ? '中' : '佁E}優先度
                  </span>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">予想される効极E/p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full" 
                      style={{ width: `${rec.impact}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{rec.impact}%の離職防止効极E/p>
                </div>
              </div>
            ))}
          </div>
        )}

        <DataComment
          comment="給与�E征E��とワークライフバランスが主要な離職要因です。これらの改喁E��より65%の離職を防止できる可能性があります、E
          details={[
            '退職老E�E40%がネガチE��ブな印象を持ってぁE��',
            '給与�E福利厚生の満足度が業界平坁E��大きく下回めE,
            '残業時間の改喁E��最も効果的な対策と予測されめE
          ]}
        />
      </div><CategoryBackButton /></div>
  );
}

export default function ExitFeedbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExitFeedbackContent />
    </Suspense>
  );
}