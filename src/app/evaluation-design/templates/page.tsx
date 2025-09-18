'use client';

import React from 'react';
import EvaluationTemplateManager from '@/components/EvaluationTemplateManager';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Settings, Star, TrendingUp, Users, Zap } from 'lucide-react';
import Link from 'next/link';

export default function EvaluationTemplatesPage() {
  return (
    <div>
      <div className="max-w-7xl mx-auto p-6">
        {/* ヘッダー部分 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href="/evaluation-design">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  評価制度管理に戻る
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  評価テンプレート管理
                </h1>
                <p className="text-gray-600 mt-1">
                  職員属性に応じた最適な評価テンプレートを選択・カスタマイズできます
                </p>
              </div>
            </div>
          </div>

          {/* 機能概要カード */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card className="border-blue-200">
              <CardHeader className="text-center pb-3">
                <Star className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-sm">推奨テンプレート</CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <div className="text-lg font-bold text-blue-600">5種類</div>
                <p className="text-xs text-gray-600">使用実績ベース</p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader className="text-center pb-3">
                <Settings className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-sm">カスタマイズ</CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <div className="text-lg font-bold text-green-600">100%</div>
                <p className="text-xs text-gray-600">柔軟な調整</p>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader className="text-center pb-3">
                <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-sm">成功率</CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <div className="text-lg font-bold text-purple-600">92%</div>
                <p className="text-xs text-gray-600">平均実装成功率</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardHeader className="text-center pb-3">
                <Zap className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <CardTitle className="text-sm">時短効果</CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <div className="text-lg font-bold text-orange-600">80%</div>
                <p className="text-xs text-gray-600">設計時間短縮</p>
              </CardContent>
            </Card>
          </div>

          {/* システム概要 */}
          <Card className="mb-6 border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" />
                新システムv3対応テンプレートバンク
              </CardTitle>
              <CardDescription>
                100点満点システム（技術評価50点 + 組織貢献50点）専用テンプレート
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">50点</div>
                  <div className="text-sm text-gray-600">技術評価</div>
                  <div className="text-xs mt-1">法人統一30点 + 施設特化20点</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">50点</div>
                  <div className="text-sm text-gray-600">組織貢献</div>
                  <div className="text-xs mt-1">施設貢献25点 + 法人貢献25点</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">4軸</div>
                  <div className="text-sm text-gray-600">独立相対評価</div>
                  <div className="text-xs mt-1">職員属性ベース自動選択</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* メインのテンプレート管理UI */}
        <EvaluationTemplateManager 
          onTemplateSelect={(template) => {
            console.log('選択されたテンプレート:', template);
            // ここで選択されたテンプレートを評価制度設計に反映する処理を実装
          }}
        />
      </div>
    </div>
  );
}