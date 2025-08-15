'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Sparkles, FileText, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function DynamicEvaluationPage() {
  const params = useParams();
  const router = useRouter();
  const staffId = params.id as string;

  return (
    <div>
      <CommonHeader title="動的評価シート生成" />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link href="/evaluation-execution">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              評価管理に戻る
            </Button>
          </Link>
        </div>

        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              動的評価シート生成
            </CardTitle>
            <CardDescription>
              研修履歴と経験レベルに基づいて最適な評価項目を自動選定します
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                この機能は、職員の研修受講履歴と経験年数を分析し、
                最も適切な評価項目を自動的に選定・生成します。
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">生成プロセス</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>研修履歴の取得</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>経験レベルの判定</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>評価項目の選定</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>評価シートの生成</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1">
                  <Sparkles className="w-4 h-4 mr-2" />
                  評価シートを生成
                </Button>
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  手動で作成
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}