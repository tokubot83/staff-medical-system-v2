'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lightbulb, Target, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { exportToPDF } from '@/utils/pdfExport';

function ImprovementSuggestionsContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '蜈ｨ譁ｽ險ｭ';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="謾ｹ蝟・署譯・ />
      
      <div id="report-content" className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">AI縺ｫ繧医ｋ髮｢閨ｷ髦ｲ豁｢譁ｽ遲悶・謠先｡・/h2>
            <div className="flex items-center gap-2">
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                蟇ｾ雎｡譁ｽ險ｭ: {facility}
              </span>
              <button
                onClick={() => exportToPDF({
                  title: '謾ｹ蝟・署譯医Ξ繝昴・繝・,
                  facility: facility,
                  reportType: 'improvement-suggestions',
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
              繝・・繧ｿ蛻・梵縺ｫ蝓ｺ縺･縺・※縲∵怙繧ょ柑譫懃噪縺ｪ髮｢閨ｷ髦ｲ豁｢譁ｽ遲悶ｒ蜆ｪ蜈亥ｺｦ鬆・↓謠先｡医＠縺ｾ縺吶ょ推譁ｽ遲悶・譛溷ｾ・柑譫懊→螳滓命髮｣譏灘ｺｦ繧定・・縺励◆螳溯ｷｵ逧・↑謾ｹ蝟・｡医〒縺吶・            </p>
          </div>

          {/* 驥崎ｦ∵欠讓吶し繝槭Μ繝ｼ */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  謠先｡域命遲匁焚
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12莉ｶ</div>
                <p className="text-xs text-muted-foreground mt-1">
                  蜆ｪ蜈亥ｺｦ鬆・↓陦ｨ遉ｺ
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  譛溷ｾ・炎貂帷紫
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">-8.5%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  蜈ｨ譁ｽ遲門ｮ滓命譎・                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  蜊ｳ蜉ｹ諤ｧ譁ｽ遲・                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4莉ｶ</div>
                <p className="text-xs text-muted-foreground mt-1">
                  3繝ｶ譛井ｻ･蜀・↓蜉ｹ譫・                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  螳滓命荳ｭ譁ｽ遲・                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2莉ｶ</div>
                <p className="text-xs text-muted-foreground mt-1">
                  蜉ｹ譫懈ｸｬ螳壻ｸｭ
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 蜆ｪ蜈亥ｺｦ1: 譛驥崎ｦ∵命遲・*/}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Target className="h-5 w-5 text-red-500" />
              蜆ｪ蜈亥ｺｦ1: 譛驥崎ｦ∵命遲・            </h3>

            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      螳壽悄逧・↑1on1髱｢隲・・蛻ｶ蠎ｦ蛹・                      <Badge variant="destructive">譛蜆ｪ蜈・/Badge>
                    </CardTitle>
                    <CardDescription>
                      蜈ｨ閨ｷ蜩｡縺ｫ蟇ｾ縺励※譛・蝗樔ｻ･荳翫・荳雁昇縺ｨ縺ｮ1on1髱｢隲・ｒ蠢・亥喧
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">-3.2%</div>
                    <p className="text-xs text-gray-500">髮｢閨ｷ邇・炎貂帛柑譫・/p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">蟇ｾ雎｡閠・/p>
                    <p className="font-medium">蜈ｨ閨ｷ蜩｡・・23蜷搾ｼ・/p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">螳滓命髮｣譏灘ｺｦ</p>
                    <div className="flex items-center gap-2">
                      <Progress value={30} className="w-20 h-2" />
                      <span className="text-sm">菴・/span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">蜉ｹ譫懃匱迴ｾ譎よ悄</p>
                    <p className="font-medium">1繝ｶ譛亥ｾ後・/p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-medium mb-2">蜈ｷ菴鍋噪縺ｪ螳滓命譁ｹ豕・/h5>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>豈取怦隨ｬ1騾ｱ縺ｫ30蛻・・1on1髱｢隲・ｒ險ｭ螳・/li>
                    <li>髱｢隲・ｨ倬鹸繧ｷ繧ｹ繝・Β縺ｮ蟆主・・磯ｲ謐励・隱ｲ鬘後・繧ｭ繝｣繝ｪ繧｢蟶梧悍・・/li>
                    <li>邂｡逅・・蜷代￠髱｢隲・せ繧ｭ繝ｫ遐比ｿｮ縺ｮ螳滓命・域怦1蝗橸ｼ・/li>
                    <li>髱｢隲・ｮ滓命邇・ｒ驛ｨ髢隧穂ｾ｡縺ｫ邨・∩霎ｼ縺ｿ</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-medium mb-2">譛溷ｾ・＆繧後ｋ蜉ｹ譫・/h5>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>譌ｩ譛溘・蝠城｡檎匱隕・/span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>蠢・炊逧・ｮ牙・諤ｧ縺ｮ蜷台ｸ・/span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>繧ｭ繝｣繝ｪ繧｢謾ｯ謠ｴ</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      谿区･ｭ譎る俣邂｡逅・・蠑ｷ蛹・                      <Badge className="bg-orange-500">驥崎ｦ・/Badge>
                    </CardTitle>
                    <CardDescription>
                      譛・5譎る俣繧剃ｸ企剞縺ｨ縺励◆谿区･ｭ邂｡逅・す繧ｹ繝・Β縺ｮ蟆主・
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">-2.1%</div>
                    <p className="text-xs text-gray-500">髮｢閨ｷ邇・炎貂帛柑譫・/p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">蟇ｾ雎｡閠・/p>
                    <p className="font-medium">156蜷搾ｼ域怦45譎る俣雜・ｼ・/p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">螳滓命髮｣譏灘ｺｦ</p>
                    <div className="flex items-center gap-2">
                      <Progress value={60} className="w-20 h-2" />
                      <span className="text-sm">荳ｭ</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">蜉ｹ譫懃匱迴ｾ譎よ悄</p>
                    <p className="font-medium">3繝ｶ譛亥ｾ後・/p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-medium mb-2">蜈ｷ菴鍋噪縺ｪ螳滓命譁ｹ豕・/h5>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>蜍､諤邂｡逅・す繧ｹ繝・Β縺ｧ縺ｮ閾ｪ蜍輔い繝ｩ繝ｼ繝域ｩ溯・</li>
                    <li>譛・5譎る俣蛻ｰ驕疲凾轤ｹ縺ｧ縺ｮ荳雁昇髱｢隲・ｿ・亥喧</li>
                    <li>讌ｭ蜍吝柑邇・喧繝励Ο繧ｸ繧ｧ繧ｯ繝医メ繝ｼ繝縺ｮ險ｭ鄂ｮ</li>
                    <li>莠ｺ蜩｡驟咲ｽｮ縺ｮ譛驕ｩ蛹厄ｼ・I繧ｷ繝輔ヨ邂｡逅・ｰ主・・・/li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 蜆ｪ蜈亥ｺｦ2: 驥崎ｦ∵命遲・*/}
          <div className="space-y-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-yellow-500" />
              蜆ｪ蜈亥ｺｦ2: 驥崎ｦ∵命遲・            </h3>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      繝｡繝ｳ繧ｿ繝ｫ繝倥Ν繧ｹ繧ｱ繧｢繝励Ο繧ｰ繝ｩ繝縺ｮ諡｡蜈・                    </CardTitle>
                    <CardDescription>
                      繧ｹ繝医Ξ繧ｹ邂｡逅・比ｿｮ縺ｨ蛟句挨繧ｫ繧ｦ繝ｳ繧ｻ繝ｪ繝ｳ繧ｰ縺ｮ謠蝉ｾ・                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">-1.5%</div>
                    <p className="text-xs text-gray-500">髮｢閨ｷ邇・炎貂帛柑譫・/p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-sm">
                    <p className="text-gray-600 mb-1">螳滓命蜀・ｮｹ</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>譛・蝗槭・繧ｹ繝医Ξ繧ｹ邂｡逅・比ｿｮ</li>
                      <li>螟夜Κ繧ｫ繧ｦ繝ｳ繧ｻ繝ｩ繝ｼ縺ｫ繧医ｋ逶ｸ隲・ｪ灘哨</li>
                      <li>繝槭う繝ｳ繝峨ヵ繝ｫ繝阪せ繝励Ο繧ｰ繝ｩ繝蟆主・</li>
                    </ul>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-600 mb-1">KPI</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>繧ｹ繝医Ξ繧ｹ繧ｹ繧ｳ繧｢20%謾ｹ蝟・/li>
                      <li>逶ｸ隲・茜逕ｨ邇・0%莉･荳・/li>
                      <li>貅雜ｳ蠎ｦ繧ｹ繧ｳ繧｢4.0莉･荳・/li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      繧ｭ繝｣繝ｪ繧｢髢狗匱謾ｯ謠ｴ蛻ｶ蠎ｦ縺ｮ讒狗ｯ・                    </CardTitle>
                    <CardDescription>
                      蛟句挨繧ｭ繝｣繝ｪ繧｢繝励Λ繝ｳ縺ｮ遲門ｮ壹→遐比ｿｮ讖滉ｼ壹・諡｡蜈・                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">-1.2%</div>
                    <p className="text-xs text-gray-500">髮｢閨ｷ邇・炎貂帛柑譫・/p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-sm">
                    <p className="text-gray-600 mb-1">螳滓命蜀・ｮｹ</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>蟷ｴ2蝗槭・繧ｭ繝｣繝ｪ繧｢髱｢隲・/li>
                      <li>雉・ｼ蜿門ｾ玲髪謠ｴ蛻ｶ蠎ｦ・郁ｲｻ逕ｨ陬懷勧・・/li>
                      <li>髯｢蜀・蕗蟄ｦ繝ｻ驛ｨ鄂ｲ莠､豬∝宛蠎ｦ</li>
                    </ul>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-600 mb-1">蟇ｾ雎｡閠・━蜈磯・ｽ・/p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>蜍､邯・-3蟷ｴ縺ｮ閨ｷ蜩｡</li>
                      <li>繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝井ｽ惹ｸ句ｱ､</li>
                      <li>闍･謇九Μ繝ｼ繝繝ｼ蛟呵｣・/li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 螳滓命繧ｹ繧ｱ繧ｸ繝･繝ｼ繝ｫ */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>螳滓命繧ｹ繧ｱ繧ｸ繝･繝ｼ繝ｫ譯・/CardTitle>
              <CardDescription>
                蜉ｹ譫懃噪縺ｪ蟆主・縺ｮ縺溘ａ縺ｮ谿ｵ髫守噪螳滓命險育判
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                    <span className="font-bold text-blue-600">1M</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium">隨ｬ1譛・/h5>
                    <p className="text-sm text-gray-600">1on1髱｢隲・宛蠎ｦ縺ｮ蟆主・貅門ｙ繝ｻ邂｡逅・・遐比ｿｮ</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                    <span className="font-bold text-blue-600">2M</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium">隨ｬ2譛・/h5>
                    <p className="text-sm text-gray-600">1on1髱｢隲・幕蟋九・谿区･ｭ邂｡逅・す繧ｹ繝・Β蟆主・</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                    <span className="font-bold text-blue-600">3M</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium">隨ｬ3譛・/h5>
                    <p className="text-sm text-gray-600">繝｡繝ｳ繧ｿ繝ｫ繝倥Ν繧ｹ繝励Ο繧ｰ繝ｩ繝髢句ｧ九・蜉ｹ譫懈ｸｬ螳・/p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 繧｢繧ｯ繧ｷ繝ｧ繝ｳ繝懊ち繝ｳ */}
          <div className="flex gap-4 mt-8">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              螳滓命險育判譖ｸ繧剃ｽ懈・
            </button>
            <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
              隧ｳ邏ｰ蛻・梵繝ｬ繝昴・繝・            </button>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
              邨悟霧莨夊ｭｰ逕ｨ雉・侭菴懈・
            </button>
          </div>
        </div>
      </div><CategoryTopButton categoryPath="/reports?tab=turnover" categoryName="髮｢閨ｷ隕∝屏蛻・梵" /></div>
  );
}

export default function ImprovementSuggestionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">隱ｭ縺ｿ霎ｼ縺ｿ荳ｭ...</div></div>}>
      <ImprovementSuggestionsContent />
    </Suspense>
  );
}