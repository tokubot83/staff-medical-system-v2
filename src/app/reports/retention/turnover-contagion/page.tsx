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

// 繝・Δ繝・・繧ｿ逕滓・
const generateContagionData = () => {
  return {
    networkData: {
      nodes: [
        { id: 1, name: '逕ｰ荳ｭ逵玖ｭｷ蟶ｫ', role: '繝ｪ繝ｼ繝繝ｼ', risk: 85, influence: 90, status: 'left' },
        { id: 2, name: '菴占陸逵玖ｭｷ蟶ｫ', role: '繧ｹ繧ｿ繝・ヵ', risk: 70, influence: 60, status: 'at-risk' },
        { id: 3, name: '驤ｴ譛ｨ逵玖ｭｷ蟶ｫ', role: '繧ｹ繧ｿ繝・ヵ', risk: 65, influence: 55, status: 'at-risk' },
        { id: 4, name: '鬮俶ｩ狗恚隴ｷ蟶ｫ', role: '繧ｹ繧ｿ繝・ヵ', risk: 45, influence: 50, status: 'stable' },
        { id: 5, name: '螻ｱ逕ｰ逵玖ｭｷ蟶ｫ', role: '繝ｪ繝ｼ繝繝ｼ', risk: 30, influence: 85, status: 'stable' }
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
        department: '逵玖ｭｷ驛ｨA逞・｣・,
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
        department: '蛹ｻ逋よ橿陦馴Κ',
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
      { factor: '繧ｭ繝ｼ繝代・繧ｽ繝ｳ縺ｮ髮｢閨ｷ', impact: 85, cases: 12 },
      { factor: '繝√・繝蜀・・荳肴ｺ諡｡謨｣', impact: 72, cases: 18 },
      { factor: '驛ｨ鄂ｲ蜀・・讌ｭ蜍呵ｲ闕ｷ蠅怜刈', impact: 68, cases: 15 },
      { factor: '遶ｶ蜷井ｻ也､ｾ縺ｮ髮・屮謗｡逕ｨ', impact: 60, cases: 8 },
      { factor: '邨・ｹ泌､画峩縺ｸ縺ｮ荳榊ｮ・, impact: 55, cases: 10 }
    ],
    preventionStrategies: [
      { strategy: '譌ｩ譛滄擇隲・ｮ滓命', effectiveness: 75, timing: '髮｢閨ｷ諢丞髄讀懃衍蠕・騾ｱ髢謎ｻ･蜀・ },
      { strategy: '繝√・繝蜀咲ｷｨ謌・, effectiveness: 60, timing: '繧ｭ繝ｼ繝代・繧ｽ繝ｳ髮｢閨ｷ蠕悟叉蠎ｧ' },
      { strategy: '讌ｭ蜍呵ｲ闕ｷ隱ｿ謨ｴ', effectiveness: 65, timing: '髮｢閨ｷ逋ｺ逕滓凾' },
      { strategy: '繧､繝ｳ繧ｻ繝ｳ繝・ぅ繝匁署萓・, effectiveness: 55, timing: '繝ｪ繧ｹ繧ｯ荳頑・譎・ }
    ]
  };
};

function TurnoverContagionContent() {
  const searchParams = useSearchParams();
  const selectedFacility = searchParams.get('facility') || '';
  const [contagionData] = useState(generateContagionData());
  const [selectedView, setSelectedView] = useState('network');
  const [selectedDepartment, setSelectedDepartment] = useState(0);

  // 繝阪ャ繝医Ρ繝ｼ繧ｯ蜿ｯ隕門喧繝・・繧ｿ
  const networkChartData = {
    datasets: [{
      label: '閨ｷ蜩｡繝阪ャ繝医Ρ繝ｼ繧ｯ',
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
        node.role === '繝ｪ繝ｼ繝繝ｼ' ? 15 : 10
      )
    }]
  };

  // 騾｣骼悶ヱ繧ｿ繝ｼ繝ｳ繝√Ε繝ｼ繝・
  const pattern = contagionData.contagionPatterns[selectedDepartment];
  const contagionTimelineChart = {
    labels: pattern.timeline.map(t => `${t.month}繝ｶ譛亥ｾ形),
    datasets: [
      {
        label: '髮｢閨ｷ閠・焚・育ｴｯ險茨ｼ・,
        data: pattern.timeline.map(t => t.turnover),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.3
      },
      {
        label: '繝ｪ繧ｹ繧ｯ閠・焚',
        data: pattern.timeline.map(t => t.atRisk),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.3
      }
    ]
  };

  // 繝ｪ繧ｹ繧ｯ隕∝屏繝√Ε繝ｼ繝・
  const riskFactorsChart = {
    labels: contagionData.riskFactors.map(f => f.factor),
    datasets: [{
      label: '蠖ｱ髻ｿ蠎ｦ',
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
      left: '髮｢閨ｷ貂・,
      'at-risk': '繝ｪ繧ｹ繧ｯ鬮・,
      stable: '螳牙ｮ・
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="髮｢閨ｷ騾｣骼門・譫・ />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">迫</span>
            <h1 className="text-2xl font-bold text-gray-900">髮｢閨ｷ騾｣骼門・譫・/h1>
          </div>
          <p className="text-gray-600">
            荳莠ｺ縺ｮ髮｢閨ｷ縺悟捉蝗ｲ縺ｫ荳弱∴繧句ｽｱ髻ｿ繧貞・譫舌＠縲・｣骼也噪縺ｪ髮｢閨ｷ繧帝亟豁｢縺励∪縺吶・
          </p>
        </div>

        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={() => {}}
          />
        </div>

        {/* 繝薙Η繝ｼ驕ｸ謚槭ち繝・*/}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex space-x-4">
            {[
              { id: 'network', label: '繝阪ャ繝医Ρ繝ｼ繧ｯ蛻・梵' },
              { id: 'timeline', label: '騾｣骼悶ち繧､繝繝ｩ繧､繝ｳ' },
              { id: 'factors', label: '繝ｪ繧ｹ繧ｯ隕∝屏' },
              { id: 'prevention', label: '莠磯亟謌ｦ逡･' }
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

        {/* 繝｡繧､繝ｳ繧ｳ繝ｳ繝・Φ繝・*/}
        {selectedView === 'network' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">閨ｷ蜩｡繝阪ャ繝医Ρ繝ｼ繧ｯ縺ｨ髮｢閨ｷ繝ｪ繧ｹ繧ｯ</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  讓ｪ霆ｸ・壼ｽｱ髻ｿ蜉幢ｼ井ｻ冶・蜩｡縺ｸ縺ｮ蠖ｱ髻ｿ蠎ｦ・・| 邵ｦ霆ｸ・夐屬閨ｷ繝ｪ繧ｹ繧ｯ
                </p>
              </div>
              <Scatter data={networkChartData} options={{
                scales: {
                  x: {
                    title: { display: true, text: '蠖ｱ髻ｿ蜉・ },
                    min: 0,
                    max: 100
                  },
                  y: {
                    title: { display: true, text: '髮｢閨ｷ繝ｪ繧ｹ繧ｯ' },
                    min: 0,
                    max: 100
                  }
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const point = context.raw as any;
                        return `${point.label}: 蠖ｱ髻ｿ蜉・{point.x}, 繝ｪ繧ｹ繧ｯ${point.y}`;
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">豌丞錐</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">蠖ｹ蜑ｲ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">迥ｶ諷・/th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">髮｢閨ｷ繝ｪ繧ｹ繧ｯ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">蠖ｱ髻ｿ蜉・/th>
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
                <label className="text-sm font-medium text-gray-700">驛ｨ鄂ｲ驕ｸ謚・/label>
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
              
              <h3 className="text-lg font-semibold mb-4">髮｢閨ｷ騾｣骼悶ち繧､繝繝ｩ繧､繝ｳ</h3>
              <Line data={contagionTimelineChart} />
              
              <div className="mt-4 bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-800">
                  <span className="font-semibold">騾｣骼門柑譫懶ｼ・/span>
                  蛻晄悄髮｢閨ｷ閠・蜷阪°繧閲pattern.contagionEffect}蜷阪′蠖ｱ髻ｿ繧貞女縺代※髮｢閨ｷ
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-semibold mb-4">騾｣骼悶ヱ繧ｿ繝ｼ繝ｳ縺ｮ迚ｹ蠕ｴ</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">窶｢</span>
                  <span>繧ｭ繝ｼ繝代・繧ｽ繝ｳ縺ｮ髮｢閨ｷ蠕・-2繝ｶ譛医〒騾｣骼悶′蜉騾・/span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">窶｢</span>
                  <span>蜷後§繝√・繝蜀・〒縺ｮ蠖ｱ髻ｿ縺梧怙繧ょ､ｧ縺阪＞</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">窶｢</span>
                  <span>3繝ｶ譛医ｒ驕弱℃繧九→騾｣骼悶・蜿取據蛯ｾ蜷・/span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {selectedView === 'factors' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">髮｢閨ｷ騾｣骼悶・繝ｪ繧ｹ繧ｯ隕∝屏</h3>
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
                    <span className="text-sm text-gray-500">驕主悉莠倶ｾ・ {factor.cases}莉ｶ</span>
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
                    <p className="text-sm text-gray-600 mt-1">螳滓命繧ｿ繧､繝溘Φ繧ｰ: {strategy.timing}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">蜉ｹ譫・/p>
                    <p className="text-2xl font-bold text-green-600">{strategy.effectiveness}%</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium mb-2">螳滓命謇矩・/h5>
                  <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                    <li>繝ｪ繧ｹ繧ｯ縺ｮ鬮倥＞閨ｷ蜩｡繧堤音螳・/li>
                    <li>逶ｴ螻樔ｸ雁昇縺ｫ繧医ｋ髱｢隲・ｮ滓命</li>
                    <li>蜈ｷ菴鍋噪縺ｪ謾ｹ蝟・ｭ悶・謠千､ｺ</li>
                    <li>螳壽悄逧・↑繝輔か繝ｭ繝ｼ繧｢繝・・</li>
                  </ol>
                </div>
              </div>
            ))}
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-2">莠磯亟縺ｮ繝昴う繝ｳ繝・/h4>
              <ul className="list-disc list-inside text-blue-800 space-y-1">
                <li>繧ｭ繝ｼ繝代・繧ｽ繝ｳ縺ｮ髮｢閨ｷ蜈・吶ｒ譌ｩ譛溘↓蟇溽衍</li>
                <li>繝√・繝蜀・・繧ｳ繝溘Η繝九こ繝ｼ繧ｷ繝ｧ繝ｳ蠑ｷ蛹・/li>
                <li>雋闕ｷ蛻・淵縺ｨ讌ｭ蜍吶・隕狗峩縺・/li>
                <li>螳壽悄逧・↑1on1髱｢隲・・螳滓命</li>
              </ul>
            </div>
          </div>
        )}

        <DataComment
          comment="繧ｭ繝ｼ繝代・繧ｽ繝ｳ縺ｮ髮｢閨ｷ縺ｯ蟷ｳ蝮・蜷阪・騾｣骼夜屬閨ｷ繧貞ｼ輔″襍ｷ縺薙＠縺ｾ縺吶よ掠譛滉ｻ句・縺ｫ繧医ｊ70%縺ｯ髦ｲ豁｢蜿ｯ閭ｽ縺ｧ縺吶・
          details={[
            '蠖ｱ髻ｿ蜉帙・鬮倥＞閨ｷ蜩｡縺ｮ螳夂捩縺檎ｵ・ｹ泌ｮ牙ｮ壹・骰ｵ',
            '髮｢閨ｷ逋ｺ逕溷ｾ・2譎る俣莉･蜀・・蟇ｾ蠢懊′驥崎ｦ・,
            '繝√・繝蜀咲ｷｨ謌舌↓繧医ｊ騾｣骼悶ｒ譛蟆城剞縺ｫ謚大宛蜿ｯ閭ｽ'
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