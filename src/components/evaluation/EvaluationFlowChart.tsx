'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight,
  ArrowDown,
  Calculator,
  Users,
  Building,
  Target,
  Award,
  FileText
} from 'lucide-react';

export default function EvaluationFlowChart() {
  return (
    <div className="w-full">
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            評価プロセスフロー
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Step 1: データ入力 */}
            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">データ入力</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">技術評価入力</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        評価基準に基づく採点（絶対基準）
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">貢献度素点入力</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        管理者による活動実績の評価
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ml-5 h-8 border-l-2 border-gray-300"></div>
            </div>

            {/* Step 2: 相対評価計算 */}
            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">相対評価計算</h3>
                  <div className="bg-white rounded-lg p-3">
                    <div className="space-y-2">
                      <div className="text-sm">
                        <strong>4軸独立相対評価</strong>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">夏季施設</Badge>
                          <span className="text-xs">施設内順位→配点</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">夏季法人</Badge>
                          <span className="text-xs">職種内順位→配点</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">冬季施設</Badge>
                          <span className="text-xs">施設内順位→配点</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">冬季法人</Badge>
                          <span className="text-xs">職種内順位→配点</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        各軸12.5点満点（上位10%=12.5点、上位20%=11.25点...）
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ml-5 h-8 border-l-2 border-gray-300"></div>
            </div>

            {/* Step 3: 総合点計算 */}
            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">総合点計算</h3>
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calculator className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium">100点満点集計</span>
                        </div>
                        <div className="text-xs space-y-1">
                          <div>技術評価: 50点（基準評価）</div>
                          <div>+ 組織貢献度: 50点（相対評価後）</div>
                          <div className="font-semibold">= 総合点: 100点</div>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-purple-600">
                        100点
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ml-5 h-8 border-l-2 border-gray-300"></div>
            </div>

            {/* Step 4: 最終評価 */}
            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">最終評価グレード決定</h3>
                  <div className="bg-white rounded-lg p-3">
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Building className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium">2軸相対評価</span>
                          </div>
                          <div className="text-xs space-y-1">
                            <div>• 施設内評価: 同職種内順位</div>
                            <div>• 法人内評価: 同職種内順位</div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Award className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium">マトリクス判定</span>
                          </div>
                          <div className="flex gap-1 flex-wrap">
                            <Badge className="bg-yellow-500">S+</Badge>
                            <Badge className="bg-yellow-600">S</Badge>
                            <Badge className="bg-green-600">A+</Badge>
                            <Badge className="bg-green-700">A</Badge>
                            <Badge className="bg-blue-600">B</Badge>
                            <Badge className="bg-orange-600">C</Badge>
                            <Badge className="bg-red-600">D</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 補足説明 */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                評価方式の特徴
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <strong className="text-blue-700">技術評価</strong>
                  <p className="text-gray-600 mt-1">
                    ルーブリック（評価基準表）による基準評価。
                    個人の達成度を客観的基準で評価。
                  </p>
                </div>
                <div>
                  <strong className="text-green-700">組織貢献度</strong>
                  <p className="text-gray-600 mt-1">
                    所属施設・職種内での相対評価。
                    4軸それぞれ独立して順位付け。
                  </p>
                </div>
                <div>
                  <strong className="text-purple-700">総合評価</strong>
                  <p className="text-gray-600 mt-1">
                    同職種内での2軸相対評価。
                    施設と法人の両視点で総合判定。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}