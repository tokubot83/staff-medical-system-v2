'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import FacilitySelector from '@/components/reports/FacilitySelector';
import CategoryBackButton from '@/components/reports/CategoryBackButton';
import DataComment from '@/components/DataComment';
import { Bar, Radar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
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
  Title,
  Tooltip,
  Legend,
  Filler
);

// 繝・Δ繝・・繧ｿ逕滓・
const generateBenchmarkData = () => {
  return {
    industryComparison: {
      facilities: ['閾ｪ譁ｽ險ｭ', '讌ｭ逡悟ｹｳ蝮・, '繝医ャ繝・0%', '蝨ｰ蝓溷ｹｳ蝮・, '蜷瑚ｦ乗ｨ｡蟷ｳ蝮・],
      turnoverRates: [8.7, 10.2, 5.8, 9.5, 9.8],
      voluntaryRates: [6.2, 7.8, 4.2, 7.0, 7.2],
      firstYearRates: [15.2, 18.5, 10.5, 16.8, 17.2]
    },
    departmentBenchmark: {
      '逵玖ｭｷ驛ｨ': { self: 11.2, industry: 12.5, best: 7.8 },
      '蛹ｻ逋よ橿陦馴Κ': { self: 7.8, industry: 8.5, best: 5.2 },
      '繝ｪ繝上ン繝ｪ驛ｨ': { self: 8.5, industry: 9.0, best: 6.0 },
      '莠句漁驛ｨ': { self: 6.5, industry: 7.2, best: 4.5 }
    },
    bestPractices: [
      {
        hospital: '譚ｱ莠ｬ蜆ｪ濶ｯ逞・劼',
        turnoverRate: 4.5,
        practices: ['繝｡繝ｳ繧ｿ繝ｼ蛻ｶ蠎ｦ', '繝輔Ξ繝・け繧ｹ繧ｿ繧､繝', '繧ｭ繝｣繝ｪ繧｢髢狗匱謾ｯ謠ｴ'],
        impact: -45
      },
      {
        hospital: '螟ｧ髦ｪ邱丞粋蛹ｻ逋ゅそ繝ｳ繧ｿ繝ｼ',
        turnoverRate: 5.2,
        practices: ['邨ｦ荳惹ｽ鍋ｳｻ謾ｹ髱ｩ', '繝ｯ繝ｼ繧ｯ繝ｩ繧､繝輔ヰ繝ｩ繝ｳ繧ｹ謗ｨ騾ｲ', '繝√・繝蛹ｻ逋ょｼｷ蛹・],
        impact: -38
      },
      {
        hospital: '蜷榊商螻倶ｸｭ螟ｮ逞・劼',
        turnoverRate: 5.8,
        practices: ['隧穂ｾ｡蛻ｶ蠎ｦ隕狗峩縺・, '遐比ｿｮ繝励Ο繧ｰ繝ｩ繝蜈・ｮ・, '遖丞茜蜴夂函諡｡蜈・],
        impact: -32
      }
    ],
    performanceMetrics: {
      labels: ['髮｢閨ｷ邇・, '螳夂捩邇・, '謗｡逕ｨ蜉ｹ邇・, '蠕捺･ｭ蜩｡貅雜ｳ蠎ｦ', '逕溽肇諤ｧ', '遐比ｿｮ蜈・ｮ溷ｺｦ'],
      self: [7.5, 6.8, 5.5, 6.0, 7.0, 5.8],
      topPerformers: [9.2, 9.0, 8.5, 8.8, 9.0, 9.2]
    },
    interventionSuccess: [
      { name: '繝｡繝ｳ繧ｿ繝ｼ蛻ｶ蠎ｦ蟆主・', successRate: 85, avgReduction: 3.2 },
      { name: '邨ｦ荳惹ｽ鍋ｳｻ隕狗峩縺・, successRate: 78, avgReduction: 2.8 },
      { name: '繝輔Ξ繝・け繧ｹ繧ｿ繧､繝', successRate: 72, avgReduction: 2.5 },
      { name: '繧ｭ繝｣繝ｪ繧｢繝代せ譏守｢ｺ蛹・, successRate: 68, avgReduction: 2.2 },
      { name: '遐比ｿｮ繝励Ο繧ｰ繝ｩ繝諡｡蜈・, successRate: 65, avgReduction: 2.0 }
    ]
  };
};

function BenchmarkBestPracticesContent() {
  const searchParams = useSearchParams();
  const selectedFacility = searchParams.get('facility') || '';
  const [benchmarkData] = useState(generateBenchmarkData());
  const [selectedView, setSelectedView] = useState('comparison');

  // 讌ｭ逡梧ｯ碑ｼ・メ繝｣繝ｼ繝・
  const industryComparisonChart = {
    labels: benchmarkData.industryComparison.facilities,
    datasets: [
      {
        label: '蜈ｨ菴馴屬閨ｷ邇・(%)',
        data: benchmarkData.industryComparison.turnoverRates,
        backgroundColor: 'rgba(239, 68, 68, 0.6)'
      },
      {
        label: '閾ｪ逋ｺ逧・屬閨ｷ邇・(%)',
        data: benchmarkData.industryComparison.voluntaryRates,
        backgroundColor: 'rgba(59, 130, 246, 0.6)'
      },
      {
        label: '1蟷ｴ逶ｮ髮｢閨ｷ邇・(%)',
        data: benchmarkData.industryComparison.firstYearRates,
        backgroundColor: 'rgba(245, 158, 11, 0.6)'
      }
    ]
  };

  // 繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ繝ｬ繝ｼ繝繝ｼ繝√Ε繝ｼ繝・
  const performanceRadarChart = {
    labels: benchmarkData.performanceMetrics.labels,
    datasets: [
      {
        label: '閾ｪ譁ｽ險ｭ',
        data: benchmarkData.performanceMetrics.self,
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: 'rgb(239, 68, 68)',
        pointBackgroundColor: 'rgb(239, 68, 68)'
      },
      {
        label: '繝医ャ繝励ヱ繝輔か繝ｼ繝槭・',
        data: benchmarkData.performanceMetrics.topPerformers,
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgb(34, 197, 94)',
        pointBackgroundColor: 'rgb(34, 197, 94)'
      }
    ]
  };

  // 驛ｨ鄂ｲ蛻･繝吶Φ繝√・繝ｼ繧ｯ繝√Ε繝ｼ繝・
  const departmentBenchmarkChart = {
    labels: Object.keys(benchmarkData.departmentBenchmark),
    datasets: [
      {
        label: '閾ｪ譁ｽ險ｭ',
        data: Object.values(benchmarkData.departmentBenchmark).map(d => d.self),
        backgroundColor: 'rgba(239, 68, 68, 0.6)'
      },
      {
        label: '讌ｭ逡悟ｹｳ蝮・,
        data: Object.values(benchmarkData.departmentBenchmark).map(d => d.industry),
        backgroundColor: 'rgba(156, 163, 175, 0.6)'
      },
      {
        label: '繝吶せ繝医・繝ｩ繧ｯ繝・ぅ繧ｹ',
        data: Object.values(benchmarkData.departmentBenchmark).map(d => d.best),
        backgroundColor: 'rgba(34, 197, 94, 0.6)'
      }
    ]
  };

  const getImpactBadge = (impact: number) => {
    if (impact <= -40) return 'bg-green-100 text-green-800';
    if (impact <= -30) return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="繝吶Φ繝√・繝ｼ繧ｯ繝ｻ繝吶せ繝医・繝ｩ繧ｯ繝・ぅ繧ｹ" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">醇</span>
            <h1 className="text-2xl font-bold text-gray-900">繝吶Φ繝√・繝ｼ繧ｯ繝ｻ繝吶せ繝医・繝ｩ繧ｯ繝・ぅ繧ｹ</h1>
          </div>
          <p className="text-gray-600">
            讌ｭ逡後・繝医ャ繝励ヱ繝輔か繝ｼ繝槭・縺ｨ豈碑ｼ・＠縲∝柑譫懃噪縺ｪ譁ｽ遲悶ｒ蟄ｦ縺ｳ縺ｾ縺吶・
          </p>
        </div>

        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={() => {}}
          />
        </div>

        {/* 繧ｵ繝槭Μ繝ｼ繧ｫ繝ｼ繝・*/}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-red-50 p-6 rounded-lg">
            <p className="text-sm text-gray-600">讌ｭ逡碁・ｽ・/p>
            <p className="text-2xl font-bold text-red-600">68菴・150</p>
            <p className="text-xs text-gray-500">荳ｭ菴阪げ繝ｫ繝ｼ繝・/p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="text-sm text-gray-600">繝医ャ繝励→縺ｮ蟾ｮ</p>
            <p className="text-2xl font-bold text-blue-600">2.9%</p>
            <p className="text-xs text-gray-500">髮｢閨ｷ邇・・蟾ｮ</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <p className="text-sm text-gray-600">謾ｹ蝟・ｽ吝慍</p>
            <p className="text-2xl font-bold text-green-600">33%</p>
            <p className="text-xs text-gray-500">蜑頑ｸ帛庄閭ｽ</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <p className="text-sm text-gray-600">謗ｨ螂ｨ譁ｽ遲匁焚</p>
            <p className="text-2xl font-bold text-purple-600">5縺､</p>
            <p className="text-xs text-gray-500">鬮伜柑譫懈命遲・/p>
          </div>
        </div>

        {/* 繝薙Η繝ｼ驕ｸ謚槭ち繝・*/}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex space-x-4">
            {[
              { id: 'comparison', label: '讌ｭ逡梧ｯ碑ｼ・ },
              { id: 'performance', label: '繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ蛻・梵' },
              { id: 'best-practices', label: '繝吶せ繝医・繝ｩ繧ｯ繝・ぅ繧ｹ' },
              { id: 'interventions', label: '譁ｽ遲門柑譫・ }
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
        {selectedView === 'comparison' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">讌ｭ逡後・繝ｳ繝√・繝ｼ繧ｯ</h3>
              <Bar data={industryComparisonChart} />
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">驛ｨ鄂ｲ蛻･繝吶Φ繝√・繝ｼ繧ｯ</h3>
              <Bar data={departmentBenchmarkChart} />
            </div>
          </div>
        )}

        {selectedView === 'performance' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">邱丞粋繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ豈碑ｼ・/h3>
              <div className="max-w-2xl mx-auto">
                <Radar data={performanceRadarChart} options={{
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 10,
                      ticks: { stepSize: 2 }
                    }
                  }
                }} />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="font-semibold mb-4">蠑ｷ縺ｿ・域･ｭ逡悟ｹｳ蝮・ｻ･荳奇ｼ・/h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">笨・/span>
                    <span>逕溽肇諤ｧ・壽･ｭ逡悟ｹｳ蝮・ｒ10%荳雁屓繧・/span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">笨・/span>
                    <span>螳夂捩邇・ｼ・蟷ｴ逶ｮ莉･髯阪・螳牙ｮ・/span>
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="font-semibold mb-4">謾ｹ蝟・ｩ滉ｼ夲ｼ域･ｭ逡悟ｹｳ蝮・ｻ･荳具ｼ・/h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">笨・/span>
                    <span>謗｡逕ｨ蜉ｹ邇・ｼ壼ｹｳ蝮・ｈ繧・0%菴弱＞</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">笨・/span>
                    <span>遐比ｿｮ蜈・ｮ溷ｺｦ・壽兜雉・ｸ崎ｶｳ</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {selectedView === 'best-practices' && (
          <div className="space-y-6">
            {benchmarkData.bestPractices.map((practice, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold">{practice.hospital}</h4>
                    <p className="text-sm text-gray-600">髮｢閨ｷ邇・ {practice.turnoverRate}%</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getImpactBadge(practice.impact)}`}>
                    {practice.impact}% 蜑頑ｸ・
                  </span>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">螳滓命譁ｽ遲・</p>
                  <div className="flex flex-wrap gap-2">
                    {practice.practices.map((p, j) => (
                      <span key={j} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">謌仙粥隕∝屏・・/span>
                    邨悟霧螻､縺ｮ繧ｳ繝溘ャ繝医Γ繝ｳ繝医∵ｮｵ髫守噪縺ｪ蟆主・縲∝ｾ捺･ｭ蜩｡繝輔ぅ繝ｼ繝峨ヰ繝・け縺ｮ豢ｻ逕ｨ
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedView === 'interventions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">譁ｽ遲・/th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">謌仙粥邇・/th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">蟷ｳ蝮・炎貂帷紫</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">謗ｨ螂ｨ蠎ｦ</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {benchmarkData.interventionSuccess.map((intervention, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {intervention.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {intervention.successRate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        -{intervention.avgReduction}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex">
                          {[...Array(5)].map((_, j) => (
                            <span key={j} className={j < Math.ceil(intervention.successRate / 20) ? 'text-yellow-400' : 'text-gray-300'}>
                              笘・
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-2">謗ｨ螂ｨ螳滓命鬆・ｺ・/h4>
              <ol className="list-decimal list-inside text-blue-800 space-y-1">
                <li>繝｡繝ｳ繧ｿ繝ｼ蛻ｶ蠎ｦ蟆主・・・繝ｶ譛井ｻ･蜀・ｼ・/li>
                <li>邨ｦ荳惹ｽ鍋ｳｻ縺ｮ遶ｶ莠牙鴨蠑ｷ蛹厄ｼ・繝ｶ譛井ｻ･蜀・ｼ・/li>
                <li>繝輔Ξ繝・け繧ｹ繧ｿ繧､繝蛻ｶ蠎ｦ讀懆ｨ趣ｼ・繝ｶ譛井ｻ･蜀・ｼ・/li>
                <li>繧ｭ繝｣繝ｪ繧｢繝代せ譏守｢ｺ蛹厄ｼ・2繝ｶ譛井ｻ･蜀・ｼ・/li>
              </ol>
            </div>
          </div>
        )}

        <DataComment
          comment="繝医ャ繝励ヱ繝輔か繝ｼ繝槭・縺ｨ縺ｮ荳ｻ縺ｪ蟾ｮ縺ｯ縲梧治逕ｨ蜉ｹ邇・阪→縲檎比ｿｮ蜈・ｮ溷ｺｦ縲阪↓縺ゅｊ縺ｾ縺吶ゅΓ繝ｳ繧ｿ繝ｼ蛻ｶ蠎ｦ縺ｮ蟆主・縺梧怙繧ょ柑譫懃噪縺ｧ縺吶・
          details={[
            '繝｡繝ｳ繧ｿ繝ｼ蛻ｶ蠎ｦ蟆主・縺ｫ繧医ｊ譁ｰ莠ｺ髮｢閨ｷ邇・ｒ45%蜑頑ｸ帙＠縺滉ｺ倶ｾ九≠繧・,
            '邨ｦ荳惹ｽ鍋ｳｻ隕狗峩縺励・蛻晄悄謚戊ｳ・′蠢・ｦ√□縺後ヽOI縺梧怙繧るｫ倥＞',
            '谿ｵ髫守噪縺ｪ譁ｽ遲門ｰ主・縺ｫ繧医ｊ縲・蟷ｴ縺ｧ讌ｭ逡悟ｹｳ蝮・∪縺ｧ謾ｹ蝟・庄閭ｽ'
          ]}
        />
      </div><CategoryBackButton /></div>
  );
}

export default function BenchmarkBestPracticesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BenchmarkBestPracticesContent />
    </Suspense>
  );
}