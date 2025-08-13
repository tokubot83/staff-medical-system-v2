'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User, Clock, Star, TrendingUp } from 'lucide-react';

export default function V5InterviewSheetsPage() {
  const interviewSheets = [
    {
      id: 'new-nurse-45min',
      title: '新人看護師（45分版）',
      description: '新人看護師向けの詳細面談シート（動機タイプ判定付き）',
      duration: 45,
      icon: Star,
      color: 'bg-green-50 border-green-200'
    },
    {
      id: 'general-nurse-15min',
      title: '一般看護師（15分版）',
      description: '一般看護師向けの簡易面談シート',
      duration: 15,
      icon: User,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'general-nurse-30min',
      title: '一般看護師（30分版）',
      description: '一般看護師向けの標準面談シート',
      duration: 30,
      icon: User,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'general-nurse-45min',
      title: '一般看護師（45分版）',
      description: '一般看護師向けの詳細面談シート（動機タイプ判定付き）',
      duration: 45,
      icon: User,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'senior-nurse-45min',
      title: 'シニア看護師（45分版）',
      description: 'シニア看護師向けの詳細面談シート（動機タイプ判定付き）',
      duration: 45,
      icon: TrendingUp,
      color: 'bg-purple-50 border-purple-200'
    },
    {
      id: 'veteran-nurse-45min',
      title: 'ベテラン看護師（45分版）',
      description: 'ベテラン看護師向けの詳細面談シート（動機タイプ判定付き）',
      duration: 45,
      icon: TrendingUp,
      color: 'bg-indigo-50 border-indigo-200'
    },
    {
      id: 'chief-nurse-45min',
      title: '主任看護師（45分版）',
      description: '主任看護師向けの詳細面談シート（動機タイプ判定付き）',
      duration: 45,
      icon: TrendingUp,
      color: 'bg-amber-50 border-amber-200'
    },
    {
      id: 'leader-nurse-45min',
      title: 'リーダー看護師（45分版）',
      description: 'リーダー看護師向けの詳細面談シート（動機タイプ判定付き）',
      duration: 45,
      icon: TrendingUp,
      color: 'bg-orange-50 border-orange-200'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">V5 面談シート - 動機タイプ判定システム</h1>
        <p className="text-gray-600 mb-4">
          V5面談シートは、7種類の動機タイプ判定機能を統合した次世代の面談システムです。
          職員一人ひとりの内発的動機を理解し、個別最適化されたマネジメントを実現します。
        </p>
        
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">🎯 V5の新機能</h3>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• 7種類の動機タイプ自動判定</li>
            <li>• タイプ別カスタマイズ質問</li>
            <li>• 推奨アクション自動提案</li>
            <li>• チーム相性分析</li>
            <li>• 動機タイプ履歴追跡</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviewSheets.map((sheet) => {
          const Icon = sheet.icon;
          return (
            <Card key={sheet.id} className={`hover:shadow-lg transition-shadow ${sheet.color}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {sheet.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{sheet.description}</p>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{sheet.duration}分</span>
                </div>
                <Link href={`/interview-sheets/v5/${sheet.id}`}>
                  <Button className="w-full" variant="outline">
                    面談シートを開く
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>動機タイプ分析機能</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/motivation/distribution">
                <Button variant="outline" className="w-full">
                  部署別動機タイプ分布
                </Button>
              </Link>
              <Link href="/motivation/team-analysis">
                <Button variant="outline" className="w-full">
                  チーム相性分析
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}