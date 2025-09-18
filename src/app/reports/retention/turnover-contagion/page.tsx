'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import FacilitySelector from '@/components/reports/FacilitySelector';
import CategoryBackButton from '@/components/reports/CategoryBackButton';
import DataComment from '@/components/DataComment';
import { Scatter, Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// チE��チE�Eタ生�E
const generateContagionData = () => {
  return {
    networkData: {
      nodes: [
        { id: 1, name: '田中看護師', role: 'リーダー', risk: 85, influence: 90, status: 'left' },
        { id: 2, name: '佐藤看護師', role: 'スタチE��', risk: 70, influence: 60, status: 'at-risk' },
        { id: 3, name: '鈴木看護師', role: 'スタチE��', risk: 65, influence: 55, status: 'at-risk' },
        { id: 4, name: '高橋看護師', role: 'スタチE��', risk: 45, influence: 50, status: 'stable' },
        { id: 5, name: '山田看護師', role: 'リーダー', risk: 30, influence: 85, status: 'stable' }
      ],
      connections: [
        { from: 1, to: 2, strength: 0.9 },
        { from: 1, to: 3, strength: 0.8 },
        { from: 2, to: 4, strength: 0.6 },
        { from: 3, to: 5, strength: 0.5 }
      ]
    },
    contagionPatterns: [
      {
        department: '看護部A痁E��E,
        initialTurnover: 1,
        contagionEffect: 3,
        timeline: [
          { month: 0, turnover: 1, atRisk: 2 },
          { month: 1, turnover: 2, atRisk: 3 },
          { month: 2, turnover: 4, atRisk: 2 },
          { month: 3, turnover: 4, atRisk: 1 }
        ]
      },
      {
        department: '医療技術部',
        initialTurnover: 1,
        contagionEffect: 2,
        timeline: [
          { month: 0, turnover: 1, atRisk: 1 },
          { month: 1, turnover: 2, atRisk: 2 },
          { month: 2, turnover: 3, atRisk: 1 },
          { month: 3, turnover: 3, atRisk: 0 }
        ]
      }
    ],
    riskFactors: [
      { factor: 'キーパ�Eソンの離職', impact: 85, cases: 12 },
      { factor: 'チ�Eム冁E�E不満拡散', impact: 72, cases: 18 },
      { factor: '部署冁E�E業務負荷増加', impact: 68, cases: 15 },
      { factor: '競合他社の雁E��採用', impact: 60, cases: 8 },
      { factor: '絁E��変更への不宁E, impact: 55, cases: 10 }
    ],
    preventionStrategies: [
      { strategy: '早期面諁E��施', effectiveness: 75, timing: '離職意向検知征E週間以冁E },
      { strategy: 'チ�Eム再編戁E, effectiveness: 60, timing: 'キーパ�Eソン離職後即座' },
      { strategy: '業務負荷調整', effectiveness: 65, timing: '離職発生時' },
      { strategy: 'インセンチE��ブ提侁E, effectiveness: 55, timing: 'リスク上�E晁E }
    ]
  };
};

function TurnoverContagionContent() {
  const searchParams = useSearchParams();
  const selectedFacility = searchParams.get('facility') || '';
  const [contagionData] = useState(generateContagionData());
  const [selectedView, setSelectedView] = useState('network');
  const [selectedDepartment, setSelectedDepartment] = useState(0);

  // ネットワーク可視化チE�Eタ
  const networkChartData = {
    datasets: [{
      label: '職員ネットワーク',
      data: contagionData.networkData.nodes.map(node => ({
        x: node.influence,
        y: node.risk,
        label: node.name
      })),
      backgroundColor: contagionData.networkData.nodes.map(node => {
        if (node.status === 'left') return 'rgba(239, 68, 68, 0.8)';
        if (node.status === 'at-risk') return 'rgba(245, 158, 11, 0.8)';
        return 'rgba(34, 197, 94, 0.8)';
      }),
      pointRadius: contagionData.networkData.nodes.map(node => 
        node.role === 'リーダー' ? 15 : 10
      )
    }]
  };

  // 連鎖パターンチャーチE
  const pattern = contagionData.contagionPatterns[selectedDepartment];
  const contagionTimelineChart = {
    labels: pattern.timeline.map(t => `${t.month}ヶ月後`),
    datasets: [
      {
        label: '離職老E���E�累計！E,
        data: pattern.timeline.map(t => t.turnover),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.3
      },
      {
        label: 'リスク老E��',
        data: pattern.timeline.map(t => t.atRisk),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.3
      }
    ]
  };

  // リスク要因チャーチE
  const riskFactorsChart = {
    labels: contagionData.riskFactors.map(f => f.factor),
    datasets: [{
      label: '影響度',
      data: contagionData.riskFactors.map(f => f.impact),
      backgroundColor: 'rgba(239, 68, 68, 0.6)'
    }]
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      left: 'bg-red-100 text-red-800',
      'at-risk': 'bg-yellow-100 text-yellow-800',
      stable: 'bg-green-100 text-green-800'
    };
    const labels = {
      left: '離職渁E,
      'at-risk': 'リスク髁E,
      stable: '安宁E
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="離職連鎖�E极E />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🔗</span>
            <h1 className="text-2xl font-bold text-gray-900">離職連鎖�E极E/h1>
          </div>
          <p className="text-gray-600">
            一人の離職が周囲に与える影響を�E析し、E��鎖的な離職を防止します、E
          </p>
        </div>

        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={() => {}}
          />
        </div>

        {/* ビュー選択タチE*/}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex space-x-4">
            {[
              { id: 'network', label: 'ネットワーク刁E��' },
              { id: 'timeline', label: '連鎖タイムライン' },
              { id: 'factors', label: 'リスク要因' },
              { id: 'prevention', label: '予防戦略' }
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
        {selectedView === 'network' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">職員ネットワークと離職リスク</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  横軸�E�影響力（他�E員への影響度�E�E| 縦軸�E�離職リスク
                </p>
              </div>
              <Scatter data={networkChartData} options={{
                scales: {
                  x: {
                    title: { display: true, text: '影響劁E },
                    min: 0,
                    max: 100
                  },
                  y: {
                    title: { display: true, text: '離職リスク' },
                    min: 0,
                    max: 100
                  }
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const point = context.raw as any;
                        return `${point.label}: 影響劁E{point.x}, リスク${point.y}`;
                      }
                    }
                  }
                }
              }} />
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">氏名</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">役割</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状慁E/th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">離職リスク</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">影響劁E/th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contagionData.networkData.nodes.map(node => (
                    <tr key={node.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{node.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{node.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(node.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className={`h-2 rounded-full ${
                                node.risk > 70 ? 'bg-red-600' : node.risk > 50 ? 'bg-yellow-600' : 'bg-green-600'
                              }`}
                              style={{ width: `${node.risk}%` }}
                            />
                          </div>
                          <span className="text-sm">{node.risk}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{node.influence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedView === 'timeline' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">部署選抁E/label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(Number(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {contagionData.contagionPatterns.map((pattern, i) => (
                    <option key={i} value={i}>{pattern.department}</option>
                  ))}
                </select>
              </div>
              
              <h3 className="text-lg font-semibold mb-4">離職連鎖タイムライン</h3>
              <Line data={contagionTimelineChart} />
              
              <div className="mt-4 bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-800">
                  <span className="font-semibold">連鎖効果！E/span>
                  初期離職老E名から{pattern.contagionEffect}名が影響を受けて離職
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-semibold mb-4">連鎖パターンの特徴</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span>キーパ�Eソンの離職征E-2ヶ月で連鎖が加送E/span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span>同じチ�Eム冁E��の影響が最も大きい</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span>3ヶ月を過ぎると連鎖�E収束傾吁E/span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {selectedView === 'factors' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">離職連鎖�Eリスク要因</h3>
            <Bar data={riskFactorsChart} options={{
              indexAxis: 'y',
              scales: {
                x: {
                  beginAtZero: true,
                  max: 100
                }
              }
            }} />
            
            <div className="mt-6 space-y-4">
              {contagionData.riskFactors.map((factor, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{factor.factor}</h4>
                    <span className="text-sm text-gray-500">過去事侁E {factor.cases}件</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${factor.impact}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedView === 'prevention' && (
          <div className="space-y-6">
            {contagionData.preventionStrategies.map((strategy, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold">{strategy.strategy}</h4>
                    <p className="text-sm text-gray-600 mt-1">実施タイミング: {strategy.timing}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">効极E/p>
                    <p className="text-2xl font-bold text-green-600">{strategy.effectiveness}%</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium mb-2">実施手頁E/h5>
                  <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                    <li>リスクの高い職員を特宁E/li>
                    <li>直属上司による面諁E��施</li>
                    <li>具体的な改喁E���E提示</li>
                    <li>定期皁E��フォローアチE�E</li>
                  </ol>
                </div>
              </div>
            ))}
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-2">予防のポインチE/h4>
              <ul className="list-disc list-inside text-blue-800 space-y-1">
                <li>キーパ�Eソンの離職允E��を早期に察知</li>
                <li>チ�Eム冁E�Eコミュニケーション強匁E/li>
                <li>負荷刁E��と業務�E見直ぁE/li>
                <li>定期皁E��1on1面諁E�E実施</li>
              </ul>
            </div>
          </div>
        )}

        <DataComment
          comment="キーパ�Eソンの離職は平坁E名�E連鎖離職を引き起こします。早期介�Eにより70%は防止可能です、E
          details={[
            '影響力�E高い職員の定着が絁E��安定�E鍵',
            '離職発生征E2時間以冁E�E対応が重要E,
            'チ�Eム再編成により連鎖を最小限に抑制可能'
          ]}
        />
      </div><CategoryBackButton /></div>
  );
}

export default function TurnoverContagionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TurnoverContagionContent />
    </Suspense>
  );
}