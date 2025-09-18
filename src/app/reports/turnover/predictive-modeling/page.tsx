'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, BarChart3, Activity } from 'lucide-react';
import { exportToPDF } from '@/utils/pdfExport';

function PredictiveModelingContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '蜈ｨ譁ｽ險ｭ';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="莠域ｸｬ繝｢繝・Μ繝ｳ繧ｰ" />
      
      <div id="report-content" className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">讖滓｢ｰ蟄ｦ鄙偵↓繧医ｋ髮｢閨ｷ莠域ｸｬ繝｢繝・Ν</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                蟇ｾ雎｡譁ｽ險ｭ: {facility}
              </span>
              <button
                onClick={() => exportToPDF({
                  title: '莠域ｸｬ繝｢繝・Μ繝ｳ繧ｰ繝ｬ繝昴・繝・,
                  facility: facility,
                  reportType: 'predictive-modeling',
                  elementId: 'report-content',
                  dateRange: new Date().toLocaleDateString('ja-JP')
                })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm pdf-exclude"
              >
                PDF繝繧ｦ繝ｳ繝ｭ繝ｼ繝・              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600">
              隍・焚縺ｮ讖滓｢ｰ蟄ｦ鄙偵い繝ｫ繧ｴ繝ｪ繧ｺ繝繧剃ｽｿ逕ｨ縺励※髮｢閨ｷ莠域ｸｬ繝｢繝・Ν繧呈ｧ狗ｯ峨＠縲∫ｲｾ蠎ｦ隧穂ｾ｡縺ｨ迚ｹ蠕ｴ驥上・驥崎ｦ∝ｺｦ蛻・梵繧定｡後＞縺ｾ縺吶・            </p>
          </div>

          {/* 繝｢繝・Ν諤ｧ閭ｽ謖・ｨ・*/}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  莠域ｸｬ邊ｾ蠎ｦ・・UC・・                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">0.92</div>
                <p className="text-xs text-muted-foreground mt-1">
                  髱槫ｸｸ縺ｫ鬮倥＞邊ｾ蠎ｦ
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  驕ｩ蜷育紫・・recision・・                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">88.5%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  隱､讀懃衍邇・ 11.5%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  蜀咲樟邇・ｼ・ecall・・                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85.2%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  隕矩・＠邇・ 14.8%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  F1繧ｹ繧ｳ繧｢
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0.868</div>
                <p className="text-xs text-muted-foreground mt-1">
                  繝舌Λ繝ｳ繧ｹ縺ｮ蜿悶ｌ縺滓ｧ閭ｽ
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 繝｢繝・Ν豈碑ｼ・*/}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>繧｢繝ｫ繧ｴ繝ｪ繧ｺ繝蛻･諤ｧ閭ｽ豈碑ｼ・/CardTitle>
              <CardDescription>
                3縺､縺ｮ荳ｻ隕√↑讖滓｢ｰ蟄ｦ鄙偵い繝ｫ繧ｴ繝ｪ繧ｺ繝縺ｮ諤ｧ閭ｽ繧呈ｯ碑ｼ・              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">XGBoost</span>
                      <Badge variant="default" className="text-xs">譛鬮俶ｧ閭ｽ</Badge>
                    </div>
                    <span className="text-sm font-semibold">AUC: 0.92</span>
                  </div>
                  <Progress value={92} className="h-2" />
                  <p className="text-xs text-gray-600 mt-1">
                    蜍ｾ驟阪ヶ繝ｼ繧ｹ繝・ぅ繝ｳ繧ｰ豎ｺ螳壽惠縺ｫ繧医ｋ鬮倡ｲｾ蠎ｦ縺ｪ莠域ｸｬ
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Random Forest</span>
                    </div>
                    <span className="text-sm font-semibold">AUC: 0.89</span>
                  </div>
                  <Progress value={89} className="h-2" />
                  <p className="text-xs text-gray-600 mt-1">
                    隍・焚縺ｮ豎ｺ螳壽惠繧堤ｵ・∩蜷医ｏ縺帙◆螳牙ｮ壹＠縺滉ｺ域ｸｬ
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-green-500" />
                      <span className="font-medium">LightGBM</span>
                    </div>
                    <span className="text-sm font-semibold">AUC: 0.91</span>
                  </div>
                  <Progress value={91} className="h-2" />
                  <p className="text-xs text-gray-600 mt-1">
                    鬮倬溘〒蜉ｹ邇・噪縺ｪ蜍ｾ驟阪ヶ繝ｼ繧ｹ繝・ぅ繝ｳ繧ｰ
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 迚ｹ蠕ｴ驥上・驥崎ｦ∝ｺｦ */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>迚ｹ蠕ｴ驥城㍾隕∝ｺｦ TOP 10</CardTitle>
              <CardDescription>
                繝｢繝・Ν縺碁㍾隕悶＠縺ｦ縺・ｋ莠域ｸｬ蝗蟄舌・鬆・ｽ・              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: '髱｢隲・ｻ蠎ｦ', value: 0.182, change: 'up' },
                  { name: '繧ｹ繝医Ξ繧ｹ繝√ぉ繝・け繧ｹ繧ｳ繧｢', value: 0.156, change: 'same' },
                  { name: '繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝医せ繧ｳ繧｢', value: 0.134, change: 'up' },
                  { name: '譛磯俣谿区･ｭ譎る俣', value: 0.098, change: 'down' },
                  { name: '螟懷共蝗樊焚', value: 0.087, change: 'same' },
                  { name: '譛臥ｵｦ蜿門ｾ礼紫', value: 0.076, change: 'up' },
                  { name: '荳雁昇縺ｨ縺ｮ髢｢菫よｧ', value: 0.065, change: 'new' },
                  { name: '遐比ｿｮ蜿ょ刈譎る俣', value: 0.054, change: 'same' },
                  { name: '蜍､邯壼ｹｴ謨ｰ', value: 0.043, change: 'down' },
                  { name: '蟷ｴ鮨｢', value: 0.032, change: 'down' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500 w-6">{index + 1}.</span>
                      <span className="font-medium">{feature.name}</span>
                      {feature.change === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                      {feature.change === 'down' && <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />}
                      {feature.change === 'new' && <Badge variant="secondary" className="text-xs">NEW</Badge>}
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={feature.value * 100 / 0.182} className="w-24 h-2" />
                      <span className="text-sm font-semibold w-12 text-right">{feature.value.toFixed(3)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 繝｢繝・Ν縺ｮ讀懆ｨｼ */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>莠､蟾ｮ讀懆ｨｼ邨先棡</CardTitle>
              <CardDescription>
                5蛻・牡莠､蟾ｮ讀懆ｨｼ縺ｫ繧医ｋ螳牙ｮ壽ｧ縺ｮ遒ｺ隱・              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((fold) => (
                  <div key={fold} className="text-center">
                    <div className="text-sm text-gray-600 mb-1">Fold {fold}</div>
                    <div className="text-xl font-bold">{(0.90 + Math.random() * 0.04).toFixed(3)}</div>
                    <div className="text-xs text-gray-500">AUC</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>讀懆ｨｼ邨先棡・・/strong>縺吶∋縺ｦ縺ｮFold縺ｧ0.90莉･荳翫・AUC繧帝＃謌舌ゅΔ繝・Ν縺ｮ螳牙ｮ壽ｧ縺檎｢ｺ隱阪＆繧後∪縺励◆縲・                </p>
              </div>
            </CardContent>
          </Card>

          {/* 莠域ｸｬ縺ｮ隱ｬ譏主庄閭ｽ諤ｧ */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>SHAP蛟､縺ｫ繧医ｋ莠域ｸｬ縺ｮ隱ｬ譏・/CardTitle>
              <CardDescription>
                蛟句挨縺ｮ莠域ｸｬ縺ｫ蟇ｾ縺吶ｋ蜷・音蠕ｴ驥上・蟇・ｸ主ｺｦ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-3">
                  萓具ｼ壼ｱｱ逕ｰ螟ｪ驛弱＆繧難ｼ磯屬閨ｷ繝ｪ繧ｹ繧ｯ: 85%・峨・蝣ｴ蜷・                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>髱｢隲・↑縺暦ｼ・繝ｶ譛茨ｼ・/span>
                    <span className="text-red-600 font-medium">+25%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>鬮倥せ繝医Ξ繧ｹ・医せ繧ｳ繧｢: 85・・/span>
                    <span className="text-red-600 font-medium">+18%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>谿区･ｭ譎る俣・・5譎る俣/譛茨ｼ・/span>
                    <span className="text-red-600 font-medium">+12%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>蜍､邯壼ｹｴ謨ｰ・・蟷ｴ3繝ｶ譛茨ｼ・/span>
                    <span className="text-green-600 font-medium">-5%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>蝓ｺ貅悶Μ繧ｹ繧ｯ</span>
                    <span className="font-medium">35%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 繧｢繧ｯ繧ｷ繝ｧ繝ｳ繝懊ち繝ｳ */}
          <div className="flex gap-4">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              繝｢繝・Ν隧ｳ邏ｰ繝ｬ繝昴・繝・            </button>
            <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
              莠域ｸｬ邨先棡繝繧ｦ繝ｳ繝ｭ繝ｼ繝・            </button>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
              繝｢繝・Ν蜀榊ｭｦ鄙・            </button>
          </div>
        </div>
      </div><CategoryTopButton categoryPath="/reports?tab=turnover" categoryName="髮｢閨ｷ隕∝屏蛻・梵" /></div>
  );
}

export default function PredictiveModelingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">隱ｭ縺ｿ霎ｼ縺ｿ荳ｭ...</div></div>}>
      <PredictiveModelingContent />
    </Suspense>
  );
}