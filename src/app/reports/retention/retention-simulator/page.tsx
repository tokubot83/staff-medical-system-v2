'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import FacilitySelector from '@/components/reports/FacilitySelector';
import CategoryBackButton from '@/components/reports/CategoryBackButton';
import DataComment from '@/components/DataComment';
import { Chart, Line, Bar } from 'react-chartjs-2';
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

// 繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ譁ｽ遲・
const interventions = [
  { id: 'salary', name: '邨ｦ荳取隼蝟・ｼ・%繧｢繝・・・・, cost: 50000000, effect: 2.5 },
  { id: 'mentor', name: '繝｡繝ｳ繧ｿ繝ｼ蛻ｶ蠎ｦ蟆主・', cost: 10000000, effect: 3.2 },
  { id: 'wlb', name: '繝ｯ繝ｼ繧ｯ繝ｩ繧､繝輔ヰ繝ｩ繝ｳ繧ｹ謾ｹ蝟・, cost: 15000000, effect: 2.8 },
  { id: 'training', name: '遐比ｿｮ繝励Ο繧ｰ繝ｩ繝諡｡蜈・, cost: 20000000, effect: 2.0 },
  { id: 'flexible', name: '繝輔Ξ繝・け繧ｹ繧ｿ繧､繝蟆主・', cost: 5000000, effect: 1.8 },
  { id: 'career', name: '繧ｭ繝｣繝ｪ繧｢繝代せ譏守｢ｺ蛹・, cost: 8000000, effect: 2.3 }
];

function RetentionSimulatorContent() {
  const searchParams = useSearchParams();
  const selectedFacility = searchParams.get('facility') || '';
  const [selectedInterventions, setSelectedInterventions] = useState<string[]>([]);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  
  const baseRetentionRate = 75; // 蝓ｺ貅門ｮ夂捩邇・
  const currentHeadcount = 500; // 迴ｾ蝨ｨ縺ｮ閨ｷ蜩｡謨ｰ
  const averageSalary = 4500000; // 蟷ｳ蝮・ｹｴ蜿・
  const recruitmentCost = 1500000; // 謗｡逕ｨ繧ｳ繧ｹ繝・莠ｺ

  // 譁ｽ遲夜∈謚槭・蛻・ｊ譖ｿ縺・
  const toggleIntervention = (id: string) => {
    setSelectedInterventions(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // 繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ螳溯｡・
  const runSimulation = () => {
    const selected = interventions.filter(i => selectedInterventions.includes(i.id));
    const totalCost = selected.reduce((sum, i) => sum + i.cost, 0);
    const totalEffect = selected.reduce((sum, i) => sum + i.effect, 0);
    
    // 逶ｸ荵怜柑譫懊ｒ閠・・・郁､・焚譁ｽ遲悶〒蜉ｹ譫懊′蠅怜ｹ・ｼ・
    const synergyBonus = selected.length > 1 ? (selected.length - 1) * 0.5 : 0;
    const adjustedEffect = totalEffect + synergyBonus;
    
    const newRetentionRate = Math.min(95, baseRetentionRate + adjustedEffect);
    const retentionImprovement = newRetentionRate - baseRetentionRate;
    
    // 5蟷ｴ髢薙・莠域ｸｬ
    const projections = [];
    for (let year = 0; year <= 5; year++) {
      const baseAttrition = currentHeadcount * (100 - baseRetentionRate) / 100;
      const newAttrition = currentHeadcount * (100 - newRetentionRate) / 100;
      const savedAttrition = baseAttrition - newAttrition;
      const savedCost = savedAttrition * recruitmentCost;
      
      projections.push({
        year,
        baseRetention: baseRetentionRate,
        newRetention: newRetentionRate,
        savedEmployees: Math.round(savedAttrition * year),
        savedCost: savedCost * year,
        roi: year === 0 ? 0 : ((savedCost * year - totalCost) / totalCost * 100)
      });
    }

    setSimulationResult({
      selected,
      totalCost,
      totalEffect: adjustedEffect,
      newRetentionRate,
      retentionImprovement,
      projections,
      breakEvenYear: projections.find(p => p.roi > 0)?.year || null
    });
  };

  // 莠域ｸｬ繧ｰ繝ｩ繝輔ョ繝ｼ繧ｿ
  const projectionChartData = simulationResult ? {
    labels: simulationResult.projections.map((p: any) => `${p.year}蟷ｴ逶ｮ`),
    datasets: [
      {
        label: '迴ｾ蝨ｨ縺ｮ螳夂捩邇・,
        data: simulationResult.projections.map((p: any) => p.baseRetention),
        borderColor: 'rgb(156, 163, 175)',
        borderDash: [5, 5],
        fill: false
      },
      {
        label: '譁ｽ遲門ｾ後・螳夂捩邇・,
        data: simulationResult.projections.map((p: any) => p.newRetention),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true
      }
    ]
  } : null;

  // ROI繧ｰ繝ｩ繝輔ョ繝ｼ繧ｿ
  const roiChartData = simulationResult ? {
    labels: simulationResult.projections.map((p: any) => `${p.year}蟷ｴ逶ｮ`),
    datasets: [
      {
        label: '遽邏・｡搾ｼ育ｴｯ險茨ｼ・,
        data: simulationResult.projections.map((p: any) => p.savedCost),
        type: 'line' as const,
        borderColor: 'rgb(34, 197, 94)',
        yAxisID: 'y'
      },
      {
        label: '謚戊ｳ・｡・,
        data: simulationResult.projections.map(() => simulationResult.totalCost),
        type: 'line' as const,
        borderColor: 'rgb(239, 68, 68)',
        borderDash: [5, 5],
        yAxisID: 'y'
      },
      {
        label: 'ROI (%)',
        data: simulationResult.projections.map((p: any) => p.roi),
        type: 'bar' as const,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        yAxisID: 'y1'
      }
    ]
  } : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="螳夂捩繧ｷ繝溘Η繝ｬ繝ｼ繧ｿ繝ｼ" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">醗</span>
            <h1 className="text-2xl font-bold text-gray-900">螳夂捩繧ｷ繝溘Η繝ｬ繝ｼ繧ｿ繝ｼ</h1>
          </div>
          <p className="text-gray-600">
            蜷・ｨｮ譁ｽ遲悶・蟆主・縺ｫ繧医ｋ螳夂捩邇・・螟牙喧縺ｨROI繧偵す繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ縺励∪縺吶・
          </p>
        </div>

        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={() => {}}
          />
        </div>

        {/* 迴ｾ迥ｶ繧ｵ繝槭Μ繝ｼ */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">迴ｾ蝨ｨ縺ｮ螳夂捩邇・/p>
            <p className="text-2xl font-bold">{baseRetentionRate}%</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">蟷ｴ髢馴屬閨ｷ閠・焚</p>
            <p className="text-2xl font-bold">{Math.round(currentHeadcount * (100 - baseRetentionRate) / 100)}蜷・/p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">謗｡逕ｨ繧ｳ繧ｹ繝・莠ｺ</p>
            <p className="text-2xl font-bold">ﾂ･{(recruitmentCost ?? 0).toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">蟷ｴ髢捺治逕ｨ繧ｳ繧ｹ繝・/p>
            <p className="text-2xl font-bold">ﾂ･{(Math.round(currentHeadcount * (100 - baseRetentionRate) / 100) * (recruitmentCost ?? 0)).toLocaleString()}</p>
          </div>
        </div>

        {/* 譁ｽ遲夜∈謚・*/}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">譁ｽ遲夜∈謚・/h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interventions.map(intervention => (
              <div
                key={intervention.id}
                onClick={() => toggleIntervention(intervention.id)}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedInterventions.includes(intervention.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{intervention.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      蜉ｹ譫・ +{intervention.effect}% | 謚戊ｳ・｡・ ﾂ･{(intervention.cost ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedInterventions.includes(intervention.id)}
                    onChange={() => {}}
                    className="mt-1"
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">驕ｸ謚槭＠縺滓命遲匁焚: {selectedInterventions.length}</p>
              <p className="text-sm text-gray-600">
                邱乗兜雉・｡・ ﾂ･{interventions
                  .filter(i => selectedInterventions.includes(i.id))
                  .reduce((sum, i) => sum + i.cost, 0)
                  .toLocaleString() ?? '0'}
              </p>
            </div>
            <button
              onClick={runSimulation}
              disabled={selectedInterventions.length === 0}
              className={`px-6 py-2 rounded-lg font-medium ${
                selectedInterventions.length > 0
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ螳溯｡・
            </button>
          </div>
        </div>

        {/* 繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ邨先棡 */}
        {simulationResult && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ邨先棡</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">莠域ｸｬ螳夂捩邇・/p>
                  <p className="text-3xl font-bold text-green-600">
                    {simulationResult.newRetentionRate.toFixed(1)}%
                  </p>
                  <p className="text-sm text-green-600">
                    (+{simulationResult.retentionImprovement.toFixed(1)}%)
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">蟷ｴ髢灘炎貂幃屬閨ｷ閠・焚</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {Math.round(currentHeadcount * simulationResult.retentionImprovement / 100)}蜷・
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">謚戊ｳ・屓蜿取悄髢・/p>
                  <p className="text-3xl font-bold text-purple-600">
                    {simulationResult.breakEvenYear || '---'}蟷ｴ
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">螳夂捩邇・ｺ域ｸｬ</h4>
                  <Line data={projectionChartData!} options={{
                    scales: {
                      y: {
                        min: 70,
                        max: 100,
                        title: { display: true, text: '螳夂捩邇・(%)' }
                      }
                    }
                  }} />
                </div>
                <div>
                  <h4 className="font-medium mb-2">謚戊ｳ・ｯｾ蜉ｹ譫懶ｼ・OI・・/h4>
                  <Chart type='bar' data={roiChartData!} options={{
                    scales: {
                      y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: { display: true, text: '驥鷹｡搾ｼ亥・・・ }
                      },
                      y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: { display: true, text: 'ROI (%)' },
                        grid: { drawOnChartArea: false }
                      }
                    }
                  }} />
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-900 mb-2">謗ｨ螂ｨ繧｢繧ｯ繧ｷ繝ｧ繝ｳ</h4>
              <ul className="list-disc list-inside text-green-800 space-y-1">
                {simulationResult.selected.map((intervention: any) => (
                  <li key={intervention.id}>{intervention.name}繧貞━蜈育噪縺ｫ螳滓命</li>
                ))}
                <li>螳滓命蠕・繝ｶ譛医＃縺ｨ縺ｫ蜉ｹ譫懈ｸｬ螳壹ｒ螳滓命</li>
                <li>蜉ｹ譫懊′菴弱＞譁ｽ遲悶・髫乗凾隕狗峩縺・/li>
              </ul>
            </div>
          </div>
        )}

        <DataComment
          comment="隍・焚譁ｽ遲悶・邨・∩蜷医ｏ縺帙↓繧医ｊ逶ｸ荵怜柑譫懊′譛溷ｾ・〒縺阪∪縺吶ら音縺ｫ繝｡繝ｳ繧ｿ繝ｼ蛻ｶ蠎ｦ縺ｨ邨ｦ荳取隼蝟・・邨・∩蜷医ｏ縺帙′蜉ｹ譫懃噪縺ｧ縺吶・
          details={[
            '謚戊ｳ・屓蜿取悄髢薙・蟷ｳ蝮・-3蟷ｴ',
            '譌ｩ譛溷ｮ滓命縺ｫ繧医ｊ邏ｯ遨榊柑譫懊′螟ｧ縺阪￥縺ｪ繧・,
            '螳壽悄逧・↑蜉ｹ譫懈ｸｬ螳壹↓繧医ｊ譁ｽ遲悶・譛驕ｩ蛹悶′蜿ｯ閭ｽ'
          ]}
        />
      </div><CategoryBackButton /></div>
  );
}

export default function RetentionSimulatorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RetentionSimulatorContent />
    </Suspense>
  );
}