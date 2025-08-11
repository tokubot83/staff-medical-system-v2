'use client';

import React from 'react';
import IntegratedEvaluationV2 from '@/components/evaluation/IntegratedEvaluationV2';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from 'lucide-react';
import Link from 'next/link';

export default function IntegratedEvaluationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ナビゲーション */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/evaluation">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  評価管理に戻る
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">統合評価システム V2</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              Phase 1 - 100点満点化実装
            </div>
          </div>
        </div>
      </div>

      {/* 説明カード */}
      <div className="max-w-7xl mx-auto p-6">
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              統合評価システムについて
            </CardTitle>
            <CardDescription>
              技術評価と貢献度評価を統合した100点満点の総合評価システム
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium mb-2">評価の構成</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• 技術評価: 50点（年1回・3月）</li>
                  <li>• 貢献度評価: 50点（年2回・8月/12月）</li>
                  <li>• 合計: 100点満点</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">評価の特徴</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• 客観性と公平性の確保</li>
                  <li>• 上司評価と本人評価の組み合わせ</li>
                  <li>• 施設特性に応じた柔軟な評価</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">活用方法</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• 昇進・昇格の判定材料</li>
                  <li>• 賞与査定の基準</li>
                  <li>• 人材育成計画の立案</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* メインコンポーネント */}
        <IntegratedEvaluationV2 />
      </div>
    </div>
  );
}