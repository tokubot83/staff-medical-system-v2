'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import FacilitySelector from '@/components/reports/FacilitySelector';
import CategoryBackButton from '@/components/reports/CategoryBackButton';
import DataComment from '@/components/DataComment';
import { Radar, Scatter, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// 繝・Δ繝・・繧ｿ逕滓・
const generateFactorData = () => {
  return {
    categories: [
      {
        name: '閨ｷ蝣ｴ迺ｰ蠅・,
        factors: [
          { name: '莠ｺ髢馴未菫・, impact: 85, satisfaction: 3.2 },
          { name: '繝√・繝繝ｯ繝ｼ繧ｯ', impact: 78, satisfaction: 3.8 },
          { name: '荳雁昇縺ｮ繧ｵ繝昴・繝・, impact: 82, satisfaction: 3.5 },
          { name: '閨ｷ蝣ｴ縺ｮ髮ｰ蝗ｲ豌・, impact: 70, satisfaction: 3.9 }
        ]
      },
      {
        name: '蠕・∞繝ｻ譚｡莉ｶ',
        factors: [
          { name: '邨ｦ荳取ｰｴ貅・, impact: 88, satisfaction: 2.8 },
          { name: '譏・ｲ讖滉ｼ・, impact: 75, satisfaction: 2.5 },
          { name: '遖丞茜蜴夂函', impact: 65, satisfaction: 3.4 },
          { name: '莨第嚊蜿門ｾ・, impact: 72, satisfaction: 3.0 }
        ]
      },
      {
        name: '謌宣聞繝ｻ繧ｭ繝｣繝ｪ繧｢',
        factors: [
          { name: '遐比ｿｮ讖滉ｼ・, impact: 68, satisfaction: 3.6 },
          { name: '繧ｹ繧ｭ繝ｫ蜷台ｸ・, impact: 73, satisfaction: 3.7 },
          { name: '繧ｭ繝｣繝ｪ繧｢繝代せ', impact: 80, satisfaction: 2.9 },
          { name: '蟆る摩諤ｧ蜷台ｸ・, impact: 71, satisfaction: 3.8 }
        ]
      },
      {
        name: '繝ｯ繝ｼ繧ｯ繝ｩ繧､繝輔ヰ繝ｩ繝ｳ繧ｹ',
        factors: [
          { name: '蜉ｴ蜒肴凾髢・, impact: 83, satisfaction: 2.6 },
          { name: '谿区･ｭ鬆ｻ蠎ｦ', impact: 79, satisfaction: 2.4 },
          { name: '譛臥ｵｦ豸亥喧邇・, impact: 70, satisfaction: 2.8 },
          { name: '繝励Λ繧､繝吶・繝域凾髢・, impact: 77, satisfaction: 2.7 }
        ]
      }
    ],
    correlations: [
      { factor1: '邨ｦ荳取ｰｴ貅・, factor2: '譏・ｲ讖滉ｼ・, strength: 0.72 },
      { factor1: '莠ｺ髢馴未菫・, factor2: '繝√・繝繝ｯ繝ｼ繧ｯ', strength: 0.85 },
      { factor1: '蜉ｴ蜒肴凾髢・, factor2: '谿区･ｭ鬆ｻ蠎ｦ', strength: 0.91 },
      { factor1: '荳雁昇縺ｮ繧ｵ繝昴・繝・, factor2: '閨ｷ蝣ｴ縺ｮ髮ｰ蝗ｲ豌・, strength: 0.68 }
    ],
    priorityMatrix: [
      { factor: '邨ｦ荳取ｰｴ貅・, importance: 88, urgency: 85, category: '閨ｷ蝣ｴ迺ｰ蠅・ },
      { factor: '蜉ｴ蜒肴凾髢・, importance: 83, urgency: 82, category: '繝ｯ繝ｼ繧ｯ繝ｩ繧､繝輔ヰ繝ｩ繝ｳ繧ｹ' },
      { factor: '莠ｺ髢馴未菫・, importance: 85, urgency: 75, category: '閨ｷ蝣ｴ迺ｰ蠅・ },
      { factor: '繧ｭ繝｣繝ｪ繧｢繝代せ', importance: 80, urgency: 70, category: '謌宣聞繝ｻ繧ｭ繝｣繝ｪ繧｢' },
      { factor: '荳雁昇縺ｮ繧ｵ繝昴・繝・, importance: 82, urgency: 78, category: '閨ｷ蝣ｴ迺ｰ蠅・ }
    ]
  };
};

function FactorMappingContent() {
  const searchParams = useSearchParams();
  const selectedFacility = searchParams.get('facility') || '';
  const [factorData] = useState(generateFactorData());
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 繝ｬ繝ｼ繝繝ｼ繝√Ε繝ｼ繝医ョ繝ｼ繧ｿ
  const radarData = {
    labels: factorData.categories.map(cat => cat.name),
    datasets: [
      {
        label: '蠖ｱ髻ｿ蠎ｦ',
        data: factorData.categories.map(cat => 
          cat.factors.reduce((sum, f) => sum + f.impact, 0) / cat.factors.length
        ),
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: 'rgb(239, 68, 68)',
        pointBackgroundColor: 'rgb(239, 68, 68)'
      },
      {
        label: '貅雜ｳ蠎ｦ',
        data: factorData.categories.map(cat => 
          cat.factors.reduce((sum, f) => sum + f.satisfaction * 20, 0) / cat.factors.length
        ),
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        pointBackgroundColor: 'rgb(59, 130, 246)'
      }
    ]
  };

  // 蜆ｪ蜈亥ｺｦ繝槭ヨ繝ｪ繝・け繧ｹ繝・・繧ｿ
  const scatterData = {
    datasets: factorData.categories.map((cat, i) => ({
      label: cat.name,
      data: factorData.priorityMatrix
        .filter(item => item.category === cat.name || selectedCategory === 'all')
        .map(item => ({ x: item.urgency, y: item.importance, label: item.factor })),
      backgroundColor: [
        'rgba(239, 68, 68, 0.6)',
        'rgba(59, 130, 246, 0.6)',
        'rgba(34, 197, 94, 0.6)',
        'rgba(168, 85, 247, 0.6)'
      ][i],
      pointRadius: 8
    }))
  };

  // 蠖ｱ髻ｿ蠎ｦ繝ｩ繝ｳ繧ｭ繝ｳ繧ｰ繝・・繧ｿ
  const allFactors = factorData.categories.flatMap(cat => 
    cat.factors.map(f => ({ ...f, category: cat.name }))
  ).sort((a, b) => b.impact - a.impact);

  const barData = {
    labels: allFactors.slice(0, 10).map(f => f.name),
    datasets: [
      {
        label: '蠖ｱ髻ｿ蠎ｦ繧ｹ繧ｳ繧｢',
        data: allFactors.slice(0, 10).map(f => f.impact),
        backgroundColor: allFactors.slice(0, 10).map(f => {
          const colors: { [key: string]: string } = {
            '閨ｷ蝣ｴ迺ｰ蠅・: 'rgba(239, 68, 68, 0.6)',
            '蠕・∞繝ｻ譚｡莉ｶ': 'rgba(59, 130, 246, 0.6)',
            '謌宣聞繝ｻ繧ｭ繝｣繝ｪ繧｢': 'rgba(34, 197, 94, 0.6)',
            '繝ｯ繝ｼ繧ｯ繝ｩ繧､繝輔ヰ繝ｩ繝ｳ繧ｹ': 'rgba(168, 85, 247, 0.6)'
          };
          return colors[f.category] || 'rgba(156, 163, 175, 0.6)';
        })
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="螳夂捩隕∝屏繝槭ャ繝斐Φ繧ｰ" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">亮・・/span>
            <h1 className="text-2xl font-bold text-gray-900">螳夂捩隕∝屏繝槭ャ繝斐Φ繧ｰ</h1>
          </div>
          <p className="text-gray-600">
            閨ｷ蜩｡縺ｮ螳夂捩縺ｫ蠖ｱ髻ｿ縺吶ｋ隕∝屏繧堤ｶｲ鄒・噪縺ｫ蛻・梵縺励∵隼蝟・━蜈亥ｺｦ繧貞庄隕門喧縺励∪縺吶・
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
              { id: 'overview', label: '邱丞粋蛻・梵' },
              { id: 'priority', label: '蜆ｪ蜈亥ｺｦ繝槭ヨ繝ｪ繝・け繧ｹ' },
              { id: 'ranking', label: '蠖ｱ髻ｿ蠎ｦ繝ｩ繝ｳ繧ｭ繝ｳ繧ｰ' },
              { id: 'correlation', label: '逶ｸ髢｢蛻・梵' }
            ].map(view => (
              <button
                key={view.id}
                onClick={() => setSelectedView(view.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedView === view.id
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>
        </div>

        {/* 繝｡繧､繝ｳ繧ｳ繝ｳ繝・Φ繝・*/}
        {selectedView === 'overview' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">繧ｫ繝・ざ繝ｪ蛻･蠖ｱ髻ｿ蠎ｦ繝ｻ貅雜ｳ蠎ｦ蛻・梵</h3>
              <div className="max-w-2xl mx-auto">
                <Radar data={radarData} options={{
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 100
                    }
                  }
                }} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {factorData.categories.map((category, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <h4 className="font-semibold mb-4">{category.name}</h4>
                  <div className="space-y-3">
                    {category.factors.map((factor, j) => (
                      <div key={j} className="flex items-center justify-between">
                        <span className="text-sm">{factor.name}</span>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xs text-gray-500">蠖ｱ髻ｿ蠎ｦ</p>
                            <p className="font-semibold">{factor.impact}%</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">貅雜ｳ蠎ｦ</p>
                            <p className="font-semibold">{factor.satisfaction.toFixed(1)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedView === 'priority' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">蜆ｪ蜈亥ｺｦ繝槭ヨ繝ｪ繝・け繧ｹ</h3>
            <div className="mb-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="all">蜈ｨ繧ｫ繝・ざ繝ｪ</option>
                {factorData.categories.map(cat => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="aspect-square max-w-3xl mx-auto">
              <Scatter data={scatterData} options={{
                scales: {
                  x: {
                    title: { display: true, text: '邱頑･蠎ｦ' },
                    min: 50,
                    max: 100
                  },
                  y: {
                    title: { display: true, text: '驥崎ｦ∝ｺｦ' },
                    min: 50,
                    max: 100
                  }
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const point = context.raw as any;
                        return `${point.label}: 邱頑･蠎ｦ${point.x}, 驥崎ｦ∝ｺｦ${point.y}`;
                      }
                    }
                  }
                }
              }} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-red-50 p-3 rounded">
                <p className="font-semibold text-red-700">隨ｬ1雎｡髯撰ｼ壽怙蜆ｪ蜈亥ｯｾ蠢・/p>
                <p className="text-red-600">驥崎ｦ∝ｺｦ繝ｻ邱頑･蠎ｦ縺ｨ繧ゅ↓鬮倥＞</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded">
                <p className="font-semibold text-yellow-700">隨ｬ2雎｡髯撰ｼ夊ｨ育判逧・ｯｾ蠢・/p>
                <p className="text-yellow-600">驥崎ｦ∝ｺｦ鬮倥・邱頑･蠎ｦ菴・/p>
              </div>
            </div>
          </div>
        )}

        {selectedView === 'ranking' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">蠖ｱ髻ｿ蠎ｦTOP10隕∝屏</h3>
            <Bar data={barData} options={{
              indexAxis: 'y',
              scales: {
                x: {
                  beginAtZero: true,
                  max: 100
                }
              }
            }} />
          </div>
        )}

        {selectedView === 'correlation' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">隕∝屏髢薙・逶ｸ髢｢髢｢菫・/h3>
            <div className="space-y-4">
              {factorData.correlations.map((corr, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{corr.factor1}</span>
                      <span className="text-gray-400">竊・/span>
                      <span className="font-medium">{corr.factor2}</span>
                    </div>
                    <span className="font-semibold text-lg">{(corr.strength * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full"
                      style={{ width: `${corr.strength * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    縺薙ｌ繧峨・隕∝屏縺ｯ蠑ｷ縺・嶌髢｢髢｢菫ゅ↓縺ゅｊ縲∽ｸ譁ｹ縺ｮ謾ｹ蝟・′莉匁婿縺ｫ繧ょ･ｽ蠖ｱ髻ｿ繧剃ｸ弱∴縺ｾ縺・
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <DataComment
          comment="邨ｦ荳取ｰｴ貅悶→蜉ｴ蜒肴凾髢薙′譛繧ょｽｱ髻ｿ蠎ｦ縺ｮ鬮倥＞隕∝屏縺ｧ縺吶ゅ％繧後ｉ縺ｮ謾ｹ蝟・↓繧医ｊ螳夂捩邇・ｒ螟ｧ蟷・↓蜷台ｸ翫〒縺阪ｋ蜿ｯ閭ｽ諤ｧ縺後≠繧翫∪縺吶・
          details={[
            '閨ｷ蝣ｴ迺ｰ蠅・き繝・ざ繝ｪ縺ｮ貅雜ｳ蠎ｦ縺檎嶌蟇ｾ逧・↓鬮倥＞',
            '繝ｯ繝ｼ繧ｯ繝ｩ繧､繝輔ヰ繝ｩ繝ｳ繧ｹ縺ｮ謾ｹ蝟・′諤･蜍・,
            '邨ｦ荳弱→譏・ｲ讖滉ｼ壹・逶ｸ髢｢縺碁ｫ倥￥縲√そ繝・ヨ縺ｧ縺ｮ謾ｹ蝟・′蜉ｹ譫懃噪'
          ]}
        />
      </div><CategoryBackButton /></div>
  );
}

export default function FactorMappingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FactorMappingContent />
    </Suspense>
  );
}