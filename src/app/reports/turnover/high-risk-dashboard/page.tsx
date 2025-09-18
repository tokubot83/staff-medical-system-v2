'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, TrendingUp, Clock, Users } from 'lucide-react';
import { exportToPDF } from '@/utils/pdfExport';

function HighRiskDashboardContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '蜈ｨ譁ｽ險ｭ';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="鬮倥Μ繧ｹ繧ｯ閨ｷ蜩｡繝繝・す繝･繝懊・繝・ />
      
      <div id="report-content" className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">髮｢閨ｷ繝ｪ繧ｹ繧ｯ縺碁ｫ倥＞閨ｷ蜩｡縺ｮ荳隕ｧ縺ｨ蟇ｾ蠢懃憾豕・/h2>
            <div className="flex items-center gap-2">
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                蟇ｾ雎｡譁ｽ險ｭ: {facility}
              </span>
              <button
                onClick={() => exportToPDF({
                  title: '鬮倥Μ繧ｹ繧ｯ閨ｷ蜩｡繝繝・す繝･繝懊・繝・,
                  facility: facility,
                  reportType: 'high-risk-dashboard',
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
              AI繝｢繝・Ν縺ｫ繧医ｊ髮｢閨ｷ繝ｪ繧ｹ繧ｯ縺・0%莉･荳翫→蛻､螳壹＆繧後◆閨ｷ蜩｡縺ｮ隧ｳ邏ｰ諠・ｱ縺ｨ縲∝ｮ滓命貂医∩繝ｻ莠亥ｮ壹・蟇ｾ蠢懃ｭ悶ｒ邂｡逅・＠縺ｾ縺吶・            </p>
          </div>

          {/* 繧ｵ繝槭Μ繝ｼ繧ｫ繝ｼ繝・*/}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  鬮倥Μ繧ｹ繧ｯ閨ｷ蜩｡謨ｰ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">42蜷・/div>
                <p className="text-xs text-muted-foreground mt-1">
                  蜑肴怦豈・+3蜷・                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  蟇ｾ蠢懷ｮ滓命邇・                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">73.8%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  31/42蜷阪↓蟇ｾ蠢懈ｸ医∩
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  蟷ｳ蝮・Μ繧ｹ繧ｯ繧ｹ繧ｳ繧｢
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">82.5%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  蜑肴怦豈・+2.3%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  莉企ｱ縺ｮ髱｢隲・ｺ亥ｮ・                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8莉ｶ</div>
                <p className="text-xs text-muted-foreground mt-1">
                  譛ｪ險ｭ螳・ 11蜷・                </p>
              </CardContent>
            </Card>
          </div>

          {/* 鬮倥Μ繧ｹ繧ｯ閨ｷ蜩｡繝ｪ繧ｹ繝・*/}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">鬮倥Μ繧ｹ繧ｯ閨ｷ蜩｡荳隕ｧ・医Μ繧ｹ繧ｯ繧ｹ繧ｳ繧｢鬆・ｼ・/h3>
            
            {/* 閨ｷ蜩｡繧ｫ繝ｼ繝我ｾ・*/}
            <div className="border rounded-lg p-4 bg-red-50 border-red-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">螻ｱ逕ｰ 螟ｪ驛・/h4>
                    <Badge variant="destructive">邱頑･蟇ｾ蠢・/Badge>
                  </div>
                  <p className="text-sm text-gray-600">蜀・ｧ醍羅譽・/ 逵玖ｭｷ蟶ｫ / 蜍､邯・蟷ｴ3繝ｶ譛・/p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">95%</div>
                  <p className="text-xs text-gray-500">髮｢閨ｷ繝ｪ繧ｹ繧ｯ</p>
                </div>
              </div>
              
              <Progress value={95} className="h-2 mb-3" />
              
              <div className="grid gap-2 md:grid-cols-2 mb-3">
                <div className="text-sm">
                  <span className="text-gray-600">荳ｻ隕√Μ繧ｹ繧ｯ隕∝屏・・/span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">髱｢隲・↑縺暦ｼ・繝ｶ譛茨ｼ・/Badge>
                    <Badge variant="outline" className="text-xs">谿区･ｭ60譎る俣雜・/Badge>
                    <Badge variant="outline" className="text-xs">繧ｹ繝医Ξ繧ｹ謖・焚85</Badge>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">譛邨る擇隲・ｼ・/span>
                  <span className="ml-1 font-medium">2024蟷ｴ4譛・5譌･</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span>谺｡蝗樣擇隲・ 譛ｪ險ｭ螳・/span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>諡・ｽ・ 逵玖ｭｷ驛ｨ髟ｷ</span>
                  </div>
                </div>
                <button className="bg-red-600 text-white px-4 py-1 rounded text-sm hover:bg-red-700 transition">
                  髱｢隲・ｨｭ螳・                </button>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">菴占陸 闃ｱ蟄・/h4>
                    <Badge variant="secondary">蟇ｾ蠢應ｸｭ</Badge>
                  </div>
                  <p className="text-sm text-gray-600">螟也ｧ醍羅譽・/ 逵玖ｭｷ蟶ｫ / 蜍､邯・蟷ｴ6繝ｶ譛・/p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">88%</div>
                  <p className="text-xs text-gray-500">髮｢閨ｷ繝ｪ繧ｹ繧ｯ</p>
                </div>
              </div>
              
              <Progress value={88} className="h-2 mb-3" />
              
              <div className="grid gap-2 md:grid-cols-2 mb-3">
                <div className="text-sm">
                  <span className="text-gray-600">荳ｻ隕√Μ繧ｹ繧ｯ隕∝屏・・/span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝井ｽ惹ｸ・/Badge>
                    <Badge variant="outline" className="text-xs">螟懷共12蝗・譛・/Badge>
                    <Badge variant="outline" className="text-xs">譛臥ｵｦ蜿門ｾ礼紫20%</Badge>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">譛邨る擇隲・ｼ・/span>
                  <span className="ml-1 font-medium">2024蟷ｴ7譛・0譌･</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span>谺｡蝗樣擇隲・ 7譛・8譌･</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>諡・ｽ・ 荳ｻ莉ｻ逵玖ｭｷ蟶ｫ</span>
                  </div>
                </div>
                <button className="bg-gray-600 text-white px-4 py-1 rounded text-sm hover:bg-gray-700 transition">
                  蟇ｾ蠢懷ｱ･豁ｴ
                </button>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">驤ｴ譛ｨ 荳驛・/h4>
                    <Badge variant="secondary">蟇ｾ蠢應ｸｭ</Badge>
                  </div>
                  <p className="text-sm text-gray-600">繝ｪ繝上ン繝ｪ繝・・繧ｷ繝ｧ繝ｳ遘・/ 逅・ｭｦ逋よｳ募｣ｫ / 蜍､邯・繝ｶ譛・/p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">85%</div>
                  <p className="text-xs text-gray-500">髮｢閨ｷ繝ｪ繧ｹ繧ｯ</p>
                </div>
              </div>
              
              <Progress value={85} className="h-2 mb-3" />
              
              <div className="grid gap-2 md:grid-cols-2 mb-3">
                <div className="text-sm">
                  <span className="text-gray-600">荳ｻ隕√Μ繧ｹ繧ｯ隕∝屏・・/span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">譁ｰ蜈･閨ｷ蜩｡・・蟷ｴ譛ｪ貅・・/Badge>
                    <Badge variant="outline" className="text-xs">遐比ｿｮ讖滉ｼ壻ｸ崎ｶｳ</Badge>
                    <Badge variant="outline" className="text-xs">繧ｭ繝｣繝ｪ繧｢荳榊ｮ・/Badge>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">譛邨る擇隲・ｼ・/span>
                  <span className="ml-1 font-medium">2024蟷ｴ7譛・譌･</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span>谺｡蝗樣擇隲・ 7譛・6譌･</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>諡・ｽ・ 繝ｪ繝上ン繝ｪ驛ｨ髟ｷ</span>
                  </div>
                </div>
                <button className="bg-gray-600 text-white px-4 py-1 rounded text-sm hover:bg-gray-700 transition">
                  蟇ｾ蠢懷ｱ･豁ｴ
                </button>
              </div>
            </div>
          </div>

          {/* 繝輔ぅ繝ｫ繧ｿ繝ｼ縺ｨ荳ｦ縺ｳ譖ｿ縺・*/}
          <div className="flex gap-4 mt-6">
            <select className="border rounded px-3 py-2 text-sm">
              <option>蜈ｨ驛ｨ鄂ｲ</option>
              <option>蜀・ｧ醍羅譽・/option>
              <option>螟也ｧ醍羅譽・/option>
              <option>ICU</option>
              <option>謨第･驛ｨ</option>
            </select>
            <select className="border rounded px-3 py-2 text-sm">
              <option>繝ｪ繧ｹ繧ｯ繧ｹ繧ｳ繧｢鬆・/option>
              <option>蟇ｾ蠢懃憾豕・・/option>
              <option>驛ｨ鄂ｲ鬆・/option>
              <option>蜍､邯壼ｹｴ謨ｰ鬆・/option>
            </select>
            <button className="bg-blue-600 text-white px-6 py-2 rounded text-sm hover:bg-blue-700 transition ml-auto">
              CSV繧ｨ繧ｯ繧ｹ繝昴・繝・            </button>
          </div>
        </div>
      </div><CategoryTopButton categoryPath="/reports?tab=turnover" categoryName="髮｢閨ｷ隕∝屏蛻・梵" /></div>
  );
}

export default function HighRiskDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">隱ｭ縺ｿ霎ｼ縺ｿ荳ｭ...</div></div>}>
      <HighRiskDashboardContent />
    </Suspense>
  );
}