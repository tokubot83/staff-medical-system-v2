'use client';

import React, { useState } from 'react';
import FacilitySpecificEvaluationForm from '@/components/evaluation/FacilitySpecificEvaluationForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function FacilitySpecificEvaluationPage() {
  // デモ用のデフォルト値
  const [evaluationData] = useState({
    facilityType: 'acute',
    jobCategory: 'nurse',
    experienceLevel: 'midlevel',
    employeeId: 'EMP001',
    employeeName: '山田 花子',
    evaluationPeriod: '2025年度上期'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ナビゲーション */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/evaluation">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  評価管理に戻る
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">施設特化項目評価</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              Phase 1 実装
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-6xl mx-auto p-6">
        {/* 説明カード */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>施設特化項目評価について</CardTitle>
            <CardDescription>
              技術評価50点のうち20点分を、各施設の特性に応じて選択・評価します
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">評価の構成</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• 法人統一項目: 30点（固定）</li>
                  <li>• 施設特化項目: 20点（選択制）</li>
                  <li>• 合計: 技術評価50点</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">選択のポイント</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• 施設の特性に合った項目を選択</li>
                  <li>• 職種・経験レベルに応じた推奨セット</li>
                  <li>• 合計が20点になるよう調整</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 評価フォーム */}
        <FacilitySpecificEvaluationForm {...evaluationData} />
      </div>
    </div>
  );
}