'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Activity, TrendingDown, Users, Calculator } from 'lucide-react';
import { exportToPDF } from '@/utils/pdfExport';

function WhatIfSimulationContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '蜈ｨ譁ｽ險ｭ';

  // 繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ繝代Λ繝｡繝ｼ繧ｿ縺ｮ迥ｶ諷狗ｮ｡逅・  const [overtimeReduction, setOvertimeReduction] = useState([30]);
  const [meetingFrequency, setMeetingFrequency] = useState([2]);
  const [stressReduction, setStressReduction] = useState([20]);
  const [salaryIncrease, setSalaryIncrease] = useState([5]);

  // 迴ｾ蝨ｨ縺ｮ髮｢閨ｷ邇・  const currentTurnoverRate = 15.8;
  
  // 繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ邨先棡縺ｮ險育ｮ・  const calculateNewTurnoverRate = () => {
    let reduction = 0;
    reduction += overtimeReduction[0] * 0.08; // 谿区･ｭ蜑頑ｸ帙・蜉ｹ譫・    reduction += meetingFrequency[0] * 1.5; // 髱｢隲・ｻ蠎ｦ縺ｮ蜉ｹ譫・    reduction += stressReduction[0] * 0.05; // 繧ｹ繝医Ξ繧ｹ蜑頑ｸ帙・蜉ｹ譫・    reduction += salaryIncrease[0] * 0.3; // 邨ｦ荳主｢怜刈縺ｮ蜉ｹ譫・    
    return Math.max(5, currentTurnoverRate - reduction).toFixed(1);
  };

  const newTurnoverRate = calculateNewTurnoverRate();
  const improvementValue = currentTurnoverRate - parseFloat(newTurnoverRate);
  const improvement = improvementValue.toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="What-if繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ" />
      
      <div id="report-content" className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">譁ｽ遲門ｮ滓命譎ゅ・髮｢閨ｷ邇・､牙喧繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                蟇ｾ雎｡譁ｽ險ｭ: {facility}
              </span>
              <button
                onClick={() => exportToPDF({
                  title: 'What-if繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ繝ｬ繝昴・繝・,
                  facility: facility,
                  reportType: 'what-if-simulation',
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
              蜷・ｨｮ譁ｽ遲悶ｒ螳滓命縺励◆蝣ｴ蜷医・髮｢閨ｷ邇・・螟牙喧繧偵す繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ縺励∪縺吶ゅせ繝ｩ繧､繝繝ｼ繧貞虚縺九＠縺ｦ譁ｽ遲悶・蠑ｷ蠎ｦ繧定ｪｿ謨ｴ縺励※縺上□縺輔＞縲・            </p>
          </div>

          {/* 迴ｾ蝨ｨ縺ｮ迥ｶ豕√→莠域ｸｬ邨先棡 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  迴ｾ蝨ｨ縺ｮ髮｢閨ｷ邇・                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{currentTurnoverRate}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  驕主悉12繝ｶ譛医・螳溽ｸｾ
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-700">
                  繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ蠕後・髮｢閨ｷ邇・                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{newTurnoverRate}%</div>
                <p className="text-xs text-green-600 mt-1">
                  謾ｹ蝟・ｦ玖ｾｼ縺ｿ: -{improvement}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  蟷ｴ髢灘炎貂帑ｺｺ謨ｰ・域耳螳夲ｼ・                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{Math.round(523 * improvementValue / 100)}蜷・/div>
                <p className="text-xs text-muted-foreground mt-1">
                  邱剰・蜩｡謨ｰ523蜷阪・繝ｼ繧ｹ
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ繝代Λ繝｡繝ｼ繧ｿ */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">譁ｽ遲悶ヱ繝ｩ繝｡繝ｼ繧ｿ險ｭ螳・/h3>

            {/* 谿区･ｭ譎る俣蜑頑ｸ・*/}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  谿区･ｭ譎る俣縺ｮ蜑頑ｸ・                </CardTitle>
                <CardDescription>
                  譛磯俣蟷ｳ蝮・ｮ区･ｭ譎る俣繧貞炎貂帙☆繧句牡蜷医ｒ險ｭ螳・                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>蜑頑ｸ帷紫: {overtimeReduction[0]}%</span>
                    <span className="text-green-600">髮｢閨ｷ邇・-{(overtimeReduction[0] * 0.08).toFixed(1)}%</span>
                  </div>
                  <Slider
                    value={overtimeReduction}
                    onValueChange={setOvertimeReduction}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-600">
                    迴ｾ蝨ｨ縺ｮ蟷ｳ蝮・5譎る俣/譛・竊・{Math.round(45 * (100 - overtimeReduction[0]) / 100)}譎る俣/譛・                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 髱｢隲・ｻ蠎ｦ蠅怜刈 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  1on1髱｢隲・・鬆ｻ蠎ｦ蠅怜刈
                </CardTitle>
                <CardDescription>
                  譛磯俣縺ｮ1on1髱｢隲・ｮ滓命蝗樊焚繧定ｨｭ螳・                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>譛磯俣螳滓命蝗樊焚: {meetingFrequency[0]}蝗・/span>
                    <span className="text-green-600">髮｢閨ｷ邇・-{(meetingFrequency[0] * 1.5).toFixed(1)}%</span>
                  </div>
                  <Slider
                    value={meetingFrequency}
                    onValueChange={setMeetingFrequency}
                    min={0}
                    max={4}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-600">
                    迴ｾ蝨ｨ縺ｮ蟷ｳ蝮・.5蝗・譛・竊・{meetingFrequency[0]}蝗・譛・                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 繧ｹ繝医Ξ繧ｹ蟇ｾ遲・*/}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-orange-500" />
                  繧ｹ繝医Ξ繧ｹ霆ｽ貂帶命遲・                </CardTitle>
                <CardDescription>
                  繧ｹ繝医Ξ繧ｹ繝√ぉ繝・け繧ｹ繧ｳ繧｢縺ｮ謾ｹ蝟・岼讓吶ｒ險ｭ螳・                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>繧ｹ繧ｳ繧｢謾ｹ蝟・紫: {stressReduction[0]}%</span>
                    <span className="text-green-600">髮｢閨ｷ邇・-{(stressReduction[0] * 0.05).toFixed(1)}%</span>
                  </div>
                  <Slider
                    value={stressReduction}
                    onValueChange={setStressReduction}
                    max={40}
                    step={5}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-600">
                    蟷ｳ蝮・せ繝医Ξ繧ｹ繧ｹ繧ｳ繧｢65 竊・{Math.round(65 * (100 - stressReduction[0]) / 100)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 邨ｦ荳取隼蝟・*/}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-green-500" />
                  邨ｦ荳弱・蜃ｦ驕・隼蝟・                </CardTitle>
                <CardDescription>
                  蝓ｺ譛ｬ邨ｦ縺ｾ縺溘・謇句ｽ薙・蠅怜刈邇・ｒ險ｭ螳・                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>邨ｦ荳主｢怜刈邇・ {salaryIncrease[0]}%</span>
                    <span className="text-green-600">髮｢閨ｷ邇・-{(salaryIncrease[0] * 0.3).toFixed(1)}%</span>
                  </div>
                  <Slider
                    value={salaryIncrease}
                    onValueChange={setSalaryIncrease}
                    max={15}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-600">
                    蟷ｴ髢薙さ繧ｹ繝亥｢・ 邏кMath.round(523 * 400000 * salaryIncrease[0] / 100 / 1000000)}逋ｾ荳・・
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 繧ｳ繧ｹ繝亥柑譫懷・譫・*/}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>繧ｳ繧ｹ繝亥柑譫懷・譫・/CardTitle>
              <CardDescription>
                譁ｽ遲門ｮ滓命縺ｫ繧医ｋ謚戊ｳ・ｯｾ蜉ｹ譫懊・隧ｦ邂・              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">譁ｽ遲悶さ繧ｹ繝茨ｼ亥ｹｴ髢難ｼ・/h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>谿区･ｭ蜑頑ｸ帙↓繧医ｋ莠ｺ蜩｡陬懷・</span>
                      <span className="font-medium">{Math.round(overtimeReduction[0] * 0.5)}逋ｾ荳・・</span>
                    </div>
                    <div className="flex justify-between">
                      <span>髱｢隲・ｮ滓命縺ｮ譎る俣繧ｳ繧ｹ繝・/span>
                      <span className="font-medium">{Math.round(meetingFrequency[0] * 10)}逋ｾ荳・・</span>
                    </div>
                    <div className="flex justify-between">
                      <span>繧ｹ繝医Ξ繧ｹ蟇ｾ遲悶・繝ｭ繧ｰ繝ｩ繝</span>
                      <span className="font-medium">{Math.round(stressReduction[0] * 0.3)}逋ｾ荳・・</span>
                    </div>
                    <div className="flex justify-between">
                      <span>邨ｦ荳弱・蜃ｦ驕・隼蝟・/span>
                      <span className="font-medium">{Math.round(523 * 400000 * salaryIncrease[0] / 100 / 1000000)}逋ｾ荳・・</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-semibold">
                      <span>蜷郁ｨ医さ繧ｹ繝・/span>
                      <span>{Math.round(overtimeReduction[0] * 0.5 + meetingFrequency[0] * 10 + stressReduction[0] * 0.3 + 523 * 400000 * salaryIncrease[0] / 100 / 1000000)}逋ｾ荳・・</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">譛溷ｾ・＆繧後ｋ蜉ｹ譫懶ｼ亥ｹｴ髢難ｼ・/h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>謗｡逕ｨ繧ｳ繧ｹ繝亥炎貂・/span>
                      <span className="font-medium text-green-600">{Math.round(523 * improvementValue / 100 * 1.5)}逋ｾ荳・・</span>
                    </div>
                    <div className="flex justify-between">
                      <span>謨呵ご繧ｳ繧ｹ繝亥炎貂・/span>
                      <span className="font-medium text-green-600">{Math.round(523 * improvementValue / 100 * 0.8)}逋ｾ荳・・</span>
                    </div>
                    <div className="flex justify-between">
                      <span>逕溽肇諤ｧ蜷台ｸ・/span>
                      <span className="font-medium text-green-600">{Math.round(improvementValue * 5)}逋ｾ荳・・</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-semibold">
                      <span>蜷郁ｨ亥柑譫・/span>
                      <span className="text-green-600">{Math.round(523 * improvementValue / 100 * 1.5 + 523 * improvementValue / 100 * 0.8 + improvementValue * 5)}逋ｾ荳・・</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-semibold text-blue-900">
                      ROI: {Math.round((523 * improvementValue / 100 * 1.5 + 523 * improvementValue / 100 * 0.8 + improvementValue * 5) / (overtimeReduction[0] * 0.5 + meetingFrequency[0] * 10 + stressReduction[0] * 0.3 + 523 * 400000 * salaryIncrease[0] / 100 / 1000000) * 100)}%
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      謚戊ｳ・蜀・≠縺溘ｊ{((523 * improvementValue / 100 * 1.5 + 523 * improvementValue / 100 * 0.8 + improvementValue * 5) / (overtimeReduction[0] * 0.5 + meetingFrequency[0] * 10 + stressReduction[0] * 0.3 + 523 * 400000 * salaryIncrease[0] / 100 / 1000000)).toFixed(2)}蜀・・繝ｪ繧ｿ繝ｼ繝ｳ
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 繧｢繧ｯ繧ｷ繝ｧ繝ｳ繝懊ち繝ｳ */}
          <div className="flex gap-4 mt-8">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ邨先棡繧剃ｿ晏ｭ・            </button>
            <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
              隧ｳ邏ｰ繝ｬ繝昴・繝育函謌・            </button>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
              譁ｽ遲門ｮ溯｡瑚ｨ育判繧剃ｽ懈・
            </button>
          </div>
        </div>
      </div><CategoryTopButton categoryPath="/reports?tab=turnover" categoryName="髮｢閨ｷ隕∝屏蛻・梵" /></div>
  );
}

export default function WhatIfSimulationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">隱ｭ縺ｿ霎ｼ縺ｿ荳ｭ...</div></div>}>
      <WhatIfSimulationContent />
    </Suspense>
  );
}