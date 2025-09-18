'use client';

import React from 'react';
import EvaluationReviewTab from '@/components/evaluation/EvaluationReviewTab';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, FileCheck, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function EvaluationReviewPage() {
  const handleSave = (data: any) => {
    console.log('評価データ保存:', data);
    // ここで保存処理を実装
  };

  const handleConfirm = (data: any) => {
    console.log('評価確認完了:', data);
    // ここで確認完了処理を実装
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto p-6">
        {/* ヘッダー部分 */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                V3評価ダッシュボードに戻る
              </Button>
            </Link>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FileCheck className="h-8 w-8 text-blue-600" />
              評価確認システム
            </h1>
          </div>
          <p className="text-gray-600">
            上司評価と自己評価を比較し、評価の妥当性を確認します
          </p>
        </div>

        {/* 機能概要カード */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="border-blue-200">
            <CardHeader className="text-center pb-3">
              <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-sm">評価比較</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-xs text-gray-600">上司・自己評価の差異を可視化</p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="text-center pb-3">
              <FileCheck className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-sm">差異分析</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-xs text-gray-600">評価差の大きい項目を特定</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="text-center pb-3">
              <MessageSquare className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-sm">コメント機能</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-xs text-gray-600">評価に関する双方向フィードバック</p>
            </CardContent>
          </Card>
        </div>

        {/* メインコンテンツ */}
        <EvaluationReviewTab 
          onSave={handleSave}
          onConfirm={handleConfirm}
        />
      </div>
    </div>
  );
}