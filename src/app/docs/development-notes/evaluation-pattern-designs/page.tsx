'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Users,
  Calculator,
  BookOpen,
  TrendingUp,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

export default function EvaluationPatternDesignsPage() {
  const patterns = [
    {
      id: 1,
      name: '従来型（60:40配分）',
      status: 'alternative',
      distribution: { superior: 18, self: 12 },
      pros: ['上司の客観性を重視', '従来の運用と親和性'],
      cons: ['自己認識との乖離が生じやすい'],
      useCase: '従来の組織文化を重視する場合'
    },
    {
      id: 2,
      name: '項目別差別化型',
      status: 'adopted',
      distribution: {
        C01: { superior: 7, self: 3 },
        C02: { superior: 5, self: 5 },
        C03: { superior: 8, self: 2 }
      },
      pros: ['項目特性に応じた最適配分', '納得感が高い', '記録・報告の客観評価'],
      cons: ['計算がやや複雑'],
      useCase: '精度の高い評価を求める場合'
    },
    {
      id: 3,
      name: '均等配分型（50:50）',
      status: 'alternative',
      distribution: { superior: 15, self: 15 },
      pros: ['公平感が高い', '計算が簡単', '自己評価文化の醸成'],
      cons: ['客観性がやや低下'],
      useCase: '自己評価文化を醸成したい場合'
    },
    {
      id: 4,
      name: '研修連動型',
      status: 'alternative',
      distribution: { base: 10, superior: 12, self: 8 },
      pros: ['研修受講を確実に促進', '法定研修の遵守を担保'],
      cons: ['研修偏重になりやすい', '実践能力の評価が相対的に低下'],
      useCase: '法定研修遵守を最優先する場合'
    },
    {
      id: 5,
      name: '多面評価型（360度）',
      status: 'future',
      distribution: { superior: 12, self: 9, peer: 6, subordinate: 3 },
      pros: ['最も客観的で公平', '多角的な視点での評価'],
      cons: ['運用負荷が高い', '評価者間の調整が必要'],
      useCase: '成熟した組織文化がある場合'
    }
  ];

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      {/* ヘッダー */}
      <div className="mb-6">
        <Link href="/evaluation" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="w-4 h-4" />
          評価管理に戻る
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <FileText className="w-8 h-8" />
              評価配分パターン設計メモ
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              法人統一項目（30点）における上司評価と本人評価の配分パターン検討資料
            </p>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                <strong>開発経緯：</strong>
                2025年1月の検討により、5つの評価配分パターンを設計。
                記録・報告スキルの評価強化と法定研修の統合を重視し、
                パターン2（項目別差別化型）を採用しました。
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* パターン一覧 */}
      <div className="grid gap-6">
        {patterns.map((pattern) => (
          <Card key={pattern.id} className={pattern.status === 'adopted' ? 'border-2 border-green-500' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-muted-foreground">
                    パターン{pattern.id}
                  </span>
                  <span>{pattern.name}</span>
                  {pattern.status === 'adopted' && (
                    <Badge className="bg-green-500">採用</Badge>
                  )}
                  {pattern.status === 'future' && (
                    <Badge variant="outline">将来検討</Badge>
                  )}
                </CardTitle>
                {pattern.status === 'adopted' && (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 配分詳細 */}
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  配分詳細
                </h4>
                {typeof pattern.distribution === 'object' && 'superior' in pattern.distribution ? (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>上司評価: {pattern.distribution.superior}点</div>
                    <div>本人評価: {pattern.distribution.self}点</div>
                  </div>
                ) : pattern.id === 2 ? (
                  <div className="space-y-2 text-sm">
                    <div>C01 専門技術: 上司7点・本人3点</div>
                    <div>C02 対人関係: 上司5点・本人5点</div>
                    <div>C03 安全管理: 上司8点・本人2点</div>
                  </div>
                ) : pattern.id === 4 ? (
                  <div className="space-y-1 text-sm">
                    <div>基礎点（研修）: 10点</div>
                    <div>上司評価: 12点</div>
                    <div>本人評価: 8点</div>
                  </div>
                ) : (
                  <div className="space-y-1 text-sm">
                    <div>上司評価: 12点</div>
                    <div>本人評価: 9点</div>
                    <div>同僚評価: 6点</div>
                    <div>部下評価: 3点</div>
                  </div>
                )}
              </div>

              {/* メリット・デメリット */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 text-green-600">メリット</h4>
                  <ul className="space-y-1 text-sm">
                    {pattern.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-orange-600">デメリット</h4>
                  <ul className="space-y-1 text-sm">
                    {pattern.cons.map((con, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 text-orange-600 flex-shrink-0" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 適用場面 */}
              <div className="border-t pt-3">
                <p className="text-sm text-muted-foreground">
                  <strong>適用場面:</strong> {pattern.useCase}
                </p>
              </div>

              {/* 実装リンク（採用パターンのみ） */}
              {pattern.status === 'adopted' && (
                <div className="border-t pt-3">
                  <Link href="/evaluation/core-v2">
                    <Button className="w-full">
                      実装版を確認 <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 関連資料 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            関連資料
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/evaluation/core-v2" className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted">
              <TrendingUp className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium">新評価システムV2</div>
                <div className="text-sm text-muted-foreground">実装版の確認</div>
              </div>
            </Link>
            <Link href="/evaluation/technical" className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium">従来評価システム</div>
                <div className="text-sm text-muted-foreground">既存版の確認</div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}