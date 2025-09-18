'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Briefcase, Heart, GraduationCap, Target, TrendingUp } from 'lucide-react';
import { exportToPDF } from '@/utils/pdfExport';

function RetentionStrategiesContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '蜈ｨ譁ｽ險ｭ';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="螳夂捩謌ｦ逡･繝ｬ繝昴・繝・ />
      
      <div id="report-content" className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">驛ｨ鄂ｲ蛻･繝ｻ閨ｷ遞ｮ蛻･縺ｮ蜉ｹ譫懃噪縺ｪ螳夂捩謌ｦ逡･</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                蟇ｾ雎｡譁ｽ險ｭ: {facility}
              </span>
              <button
                onClick={() => exportToPDF({
                  title: '螳夂捩謌ｦ逡･繝ｬ繝昴・繝・,
                  facility: facility,
                  reportType: 'retention-strategies',
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
              蜷・Κ鄂ｲ繝ｻ閨ｷ遞ｮ縺ｮ迚ｹ諤ｧ縺ｫ蠢懊§縺滓怙驕ｩ縺ｪ莠ｺ譚仙ｮ夂捩謌ｦ逡･繧偵√ョ繝ｼ繧ｿ蛻・梵縺ｫ蝓ｺ縺･縺・※遲門ｮ壹＠縺ｾ縺吶・            </p>
          </div>

          {/* 蜈ｨ菴捺ｦりｦ・*/}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  蟇ｾ雎｡驛ｨ鄂ｲ謨ｰ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12驛ｨ鄂ｲ</div>
                <p className="text-xs text-muted-foreground mt-1">
                  蜈ｨ驛ｨ鄂ｲ繧ｫ繝舌・
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  驥咲せ蟇ｾ雎｡閨ｷ蜩｡
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">186蜷・/div>
                <p className="text-xs text-muted-foreground mt-1">
                  鬮倥Μ繧ｹ繧ｯ繝ｻ鬮倅ｾ｡蛟､螻､
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  謌ｦ逡･繝代ち繝ｼ繝ｳ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5遞ｮ鬘・/div>
                <p className="text-xs text-muted-foreground mt-1">
                  迚ｹ諤ｧ蛻･繧｢繝励Ο繝ｼ繝・                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  莠域Φ謾ｹ蝟・紫
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">-6.8%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  髮｢閨ｷ邇・炎貂幄ｦ玖ｾｼ縺ｿ
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 驛ｨ鄂ｲ蛻･謌ｦ逡･ */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">驛ｨ鄂ｲ蛻･螳夂捩謌ｦ逡･</h3>

            {/* 逵玖ｭｷ驛ｨ */}
            <Card className="border-blue-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-blue-500" />
                      逵玖ｭｷ驛ｨ
                      <Badge variant="destructive">譛蜆ｪ蜈・/Badge>
                    </CardTitle>
                    <CardDescription>
                      閨ｷ蜩｡謨ｰ: 285蜷・/ 迴ｾ蝨ｨ髮｢閨ｷ邇・ 18.5% / 逶ｮ讓・ 12.0%
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">繝ｪ繧ｹ繧ｯ繝ｬ繝吶Ν</div>
                    <div className="text-xl font-bold text-red-600">鬮・/div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h5 className="font-medium mb-2">荳ｻ隕∬ｪｲ鬘・/h5>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">螟懷共雋諡・ｼ亥ｹｳ蝮・2蝗・譛茨ｼ・/Badge>
                    <Badge variant="outline">譁ｰ莠ｺ謨呵ご菴灘宛荳崎ｶｳ</Badge>
                    <Badge variant="outline">繧ｭ繝｣繝ｪ繧｢繝代せ荳肴・遒ｺ</Badge>
                    <Badge variant="outline">莨第嚊蜿門ｾ怜峅髮｣</Badge>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">謗ｨ螂ｨ謌ｦ逡･: 繝ｯ繝ｼ繧ｯ繝ｩ繧､繝輔ヰ繝ｩ繝ｳ繧ｹ驥崎ｦ門梛</h5>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <span className="text-blue-500 font-bold">1.</span>
                      <div>
                        <p className="font-medium">螟懷共雋諡・ｻｽ貂帙・繝ｭ繧ｰ繝ｩ繝</p>
                        <p className="text-sm text-gray-600">譛・蝗樔ｸ企剞險ｭ螳壹∝､懷共蟆ょｾ鍋恚隴ｷ蟶ｫ縺ｮ謗｡逕ｨ縲∝､懷共謇句ｽ・0%蠅鈴｡・/p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-blue-500 font-bold">2.</span>
                      <div>
                        <p className="font-medium">譁ｰ莠ｺ繝｡繝ｳ繧ｿ繝ｼ蛻ｶ蠎ｦ</p>
                        <p className="text-sm text-gray-600">1蟷ｴ髢薙・蟆ゆｻｻ繝｡繝ｳ繧ｿ繝ｼ驟咲ｽｮ縲・ｱ1蝗槭・謖ｯ繧願ｿ斐ｊ髱｢隲・/p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-blue-500 font-bold">3.</span>
                      <div>
                        <p className="font-medium">繧ｭ繝｣繝ｪ繧｢繝ｩ繝繝ｼ蛻ｶ蠎ｦ蟆主・</p>
                        <p className="text-sm text-gray-600">5谿ｵ髫弱・譏守｢ｺ縺ｪ繧ｭ繝｣繝ｪ繧｢繝代せ縲∝推谿ｵ髫弱〒縺ｮ蠢・ｦ√せ繧ｭ繝ｫ繝ｻ遐比ｿｮ縺ｮ譏守､ｺ</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="text-sm">
                    <span className="text-gray-600">譛溷ｾ・柑譫懶ｼ・/span>
                    <span className="font-medium text-green-600">髮｢閨ｷ邇・-6.5%</span>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition">
                    螳滓命險育判繧剃ｽ懈・
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* 繝ｪ繝上ン繝ｪ繝・・繧ｷ繝ｧ繝ｳ遘・*/}
            <Card className="border-purple-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-500" />
                      繝ｪ繝上ン繝ｪ繝・・繧ｷ繝ｧ繝ｳ遘・                      <Badge className="bg-orange-500">驥崎ｦ・/Badge>
                    </CardTitle>
                    <CardDescription>
                      閨ｷ蜩｡謨ｰ: 48蜷・/ 迴ｾ蝨ｨ髮｢閨ｷ邇・ 22.3% / 逶ｮ讓・ 15.0%
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">繝ｪ繧ｹ繧ｯ繝ｬ繝吶Ν</div>
                    <div className="text-xl font-bold text-orange-600">荳ｭ鬮・/div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-purple-50 rounded-lg p-4">
                  <h5 className="font-medium mb-2">荳ｻ隕∬ｪｲ鬘・/h5>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">闍･謇玖・蜩｡縺ｮ譌ｩ譛滄屬閨ｷ</Badge>
                    <Badge variant="outline">遐比ｿｮ讖滉ｼ壻ｸ崎ｶｳ</Badge>
                    <Badge variant="outline">隧穂ｾ｡蝓ｺ貅悶・荳肴・遒ｺ縺・/Badge>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">謗ｨ螂ｨ謌ｦ逡･: 謌宣聞讖滉ｼ壽署萓帛梛</h5>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <span className="text-purple-500 font-bold">1.</span>
                      <div>
                        <p className="font-medium">繧ｹ繧ｭ繝ｫ繧｢繝・・謾ｯ謠ｴ蛻ｶ蠎ｦ</p>
                        <p className="text-sm text-gray-600">螟夜Κ遐比ｿｮ雋ｻ逕ｨ蜈ｨ鬘崎｣懷勧縲∝ｭｦ莨壼盾蜉謾ｯ謠ｴ縲∬ｳ・ｼ蜿門ｾ怜ｱ螂ｨ驥・/p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-purple-500 font-bold">2.</span>
                      <div>
                        <p className="font-medium">闍･謇玖ご謌舌・繝ｭ繧ｰ繝ｩ繝</p>
                        <p className="text-sm text-gray-600">3蟷ｴ髢薙・谿ｵ髫守噪閧ｲ謌占ｨ育判縲∫裸萓区､懆ｨ惹ｼ壹・螳壽悄髢句ぎ</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-purple-500 font-bold">3.</span>
                      <div>
                        <p className="font-medium">360蠎ｦ隧穂ｾ｡蛻ｶ蠎ｦ</p>
                        <p className="text-sm text-gray-600">螟夐擇逧・↑隧穂ｾ｡縺ｨ繝輔ぅ繝ｼ繝峨ヰ繝・け縲∵・髟ｷ逶ｮ讓吶・蜈ｱ蜷瑚ｨｭ螳・/p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="text-sm">
                    <span className="text-gray-600">譛溷ｾ・柑譫懶ｼ・/span>
                    <span className="font-medium text-green-600">髮｢閨ｷ邇・-7.3%</span>
                  </div>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 transition">
                    螳滓命險育判繧剃ｽ懈・
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* 蛹ｻ莠玖ｪｲ */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-gray-500" />
                      蛹ｻ莠玖ｪｲ
                    </CardTitle>
                    <CardDescription>
                      閨ｷ蜩｡謨ｰ: 32蜷・/ 迴ｾ蝨ｨ髮｢閨ｷ邇・ 12.5% / 逶ｮ讓・ 8.0%
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">繝ｪ繧ｹ繧ｯ繝ｬ繝吶Ν</div>
                    <div className="text-xl font-bold text-yellow-600">荳ｭ</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium mb-2">荳ｻ隕∬ｪｲ鬘・/h5>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">蜊倩ｪｿ縺ｪ讌ｭ蜍吝・螳ｹ</Badge>
                    <Badge variant="outline">繧ｭ繝｣繝ｪ繧｢縺ｮ蛛懈ｻ樊─</Badge>
                    <Badge variant="outline">莉夜Κ鄂ｲ縺ｨ縺ｮ騾｣謳ｺ荳崎ｶｳ</Badge>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">謗ｨ螂ｨ謌ｦ逡･: 繧ｨ繝ｳ繧ｲ繝ｼ繧ｸ繝｡繝ｳ繝亥髄荳雁梛</h5>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <span className="text-gray-500 font-bold">1.</span>
                      <div>
                        <p className="font-medium">繧ｸ繝ｧ繝悶Ο繝ｼ繝・・繧ｷ繝ｧ繝ｳ蛻ｶ蠎ｦ</p>
                        <p className="text-sm text-gray-600">髯｢蜀・ｻ夜Κ鄂ｲ縺ｧ縺ｮ遏ｭ譛溽比ｿｮ縲∵･ｭ蜍吶・螟壽ｧ伜喧</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-gray-500 font-bold">2.</span>
                      <div>
                        <p className="font-medium">繝励Ο繧ｸ繧ｧ繧ｯ繝亥盾蜉讖滉ｼ・/p>
                        <p className="text-sm text-gray-600">讌ｭ蜍呎隼蝟・・繝ｭ繧ｸ繧ｧ繧ｯ繝医∈縺ｮ蜿ら判縲∵署譯亥宛蠎ｦ縺ｮ豢ｻ諤ｧ蛹・/p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="text-sm">
                    <span className="text-gray-600">譛溷ｾ・柑譫懶ｼ・/span>
                    <span className="font-medium text-green-600">髮｢閨ｷ邇・-4.5%</span>
                  </div>
                  <button className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition">
                    螳滓命險育判繧剃ｽ懈・
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 閨ｷ遞ｮ蛻･謌ｦ逡･繧ｵ繝槭Μ繝ｼ */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>閨ｷ遞ｮ蛻･謌ｦ逡･繝代ち繝ｼ繝ｳ</CardTitle>
              <CardDescription>
                閨ｷ遞ｮ迚ｹ諤ｧ縺ｫ蠢懊§縺・縺､縺ｮ蝓ｺ譛ｬ謌ｦ逡･
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <h5 className="font-medium">繝ｯ繝ｼ繧ｯ繝ｩ繧､繝輔ヰ繝ｩ繝ｳ繧ｹ驥崎ｦ門梛</h5>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">蟇ｾ雎｡: 逵玖ｭｷ蟶ｫ縲∽ｻ玖ｭｷ螢ｫ</p>
                  <p className="text-xs text-gray-500">蜍､蜍吩ｽ灘宛縺ｮ謾ｹ蝟・∽ｼ第嚊蜿門ｾ嶺ｿ・ｲ</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <h5 className="font-medium">謌宣聞讖滉ｼ壽署萓帛梛</h5>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">蟇ｾ雎｡: 繝ｪ繝上ン繝ｪ閨ｷ縲∵橿蟶ｫ</p>
                  <p className="text-xs text-gray-500">遐比ｿｮ蜈・ｮ溘√せ繧ｭ繝ｫ繧｢繝・・謾ｯ謠ｴ</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <h5 className="font-medium">繧ｭ繝｣繝ｪ繧｢譏守｢ｺ蛹門梛</h5>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">蟇ｾ雎｡: 闍･謇句・闊ｬ</p>
                  <p className="text-xs text-gray-500">繧ｭ繝｣繝ｪ繧｢繝代せ謠千､ｺ縲∫岼讓呵ｨｭ螳壽髪謠ｴ</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <h5 className="font-medium">謇ｿ隱阪・隧穂ｾ｡蜈・ｮ溷梛</h5>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">蟇ｾ雎｡: 荳ｭ蝣・・蜩｡</p>
                  <p className="text-xs text-gray-500">蜈ｬ豁｣縺ｪ隧穂ｾ｡縲∵・騾ｲ讖滉ｼ壹・謠蝉ｾ・/p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 螳滓命蜆ｪ蜈磯・ｽ・*/}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>螳滓命蜆ｪ蜈磯・ｽ阪・繝医Μ繧ｯ繧ｹ</CardTitle>
              <CardDescription>
                蜉ｹ譫懊→螳滓命髮｣譏灘ｺｦ縺ｫ繧医ｋ蜆ｪ蜈磯・ｽ堺ｻ倥￠
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-4">
                  <h5 className="font-medium text-red-700 mb-2">譛蜆ｪ蜈茨ｼ磯ｫ伜柑譫懊・菴朱屮譏灘ｺｦ・・/h5>
                  <ul className="text-sm space-y-1">
                    <li>窶｢ 逵玖ｭｷ驛ｨ縺ｮ螟懷共雋諡・ｻｽ貂・/li>
                    <li>窶｢ 蜈ｨ驛ｨ鄂ｲ縺ｧ縺ｮ1on1髱｢隲・宛蠎ｦ</li>
                    <li>窶｢ 闍･謇九Γ繝ｳ繧ｿ繝ｼ蛻ｶ蠎ｦ</li>
                  </ul>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h5 className="font-medium text-orange-700 mb-2">蜆ｪ蜈茨ｼ磯ｫ伜柑譫懊・鬮倬屮譏灘ｺｦ・・/h5>
                  <ul className="text-sm space-y-1">
                    <li>窶｢ 繧ｭ繝｣繝ｪ繧｢繝ｩ繝繝ｼ蛻ｶ蠎ｦ讒狗ｯ・/li>
                    <li>窶｢ 邨ｦ荳惹ｽ鍋ｳｻ縺ｮ隕狗峩縺・/li>
                    <li>窶｢ 莠ｺ蜩｡驟咲ｽｮ縺ｮ譛驕ｩ蛹・/li>
                  </ul>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h5 className="font-medium text-yellow-700 mb-2">谺｡轤ｹ・井ｸｭ蜉ｹ譫懊・菴朱屮譏灘ｺｦ・・/h5>
                  <ul className="text-sm space-y-1">
                    <li>窶｢ 遐比ｿｮ繝励Ο繧ｰ繝ｩ繝諡｡蜈・/li>
                    <li>窶｢ 謠先｡亥宛蠎ｦ縺ｮ豢ｻ諤ｧ蛹・/li>
                    <li>窶｢ 驛ｨ鄂ｲ髢謎ｺ､豬∽ｿ・ｲ</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-700 mb-2">讀懆ｨ趣ｼ井ｸｭ蜉ｹ譫懊・鬮倬屮譏灘ｺｦ・・/h5>
                  <ul className="text-sm space-y-1">
                    <li>窶｢ 隧穂ｾ｡蛻ｶ蠎ｦ縺ｮ蜈ｨ髱｢謾ｹ螳・/li>
                    <li>窶｢ 邨・ｹ疲ｧ矩縺ｮ隕狗峩縺・/li>
                    <li>窶｢ 譁ｰ隕乗治逕ｨ謌ｦ逡･螟画峩</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 繧｢繧ｯ繧ｷ繝ｧ繝ｳ繝懊ち繝ｳ */}
          <div className="flex gap-4 mt-8">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              驛ｨ鄂ｲ蛻･螳滓命險育判譖ｸ
            </button>
            <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
              謌ｦ逡･蜉ｹ譫懊す繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ
            </button>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
              邨悟霧螻､蜷代￠繧ｵ繝槭Μ繝ｼ
            </button>
          </div>
        </div>
      </div><CategoryTopButton categoryPath="/reports?tab=turnover" categoryName="髮｢閨ｷ隕∝屏蛻・梵" /></div>
  );
}

export default function RetentionStrategiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">隱ｭ縺ｿ霎ｼ縺ｿ荳ｭ...</div></div>}>
      <RetentionStrategiesContent />
    </Suspense>
  );
}