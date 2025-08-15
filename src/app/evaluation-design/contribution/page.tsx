'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ContributionDesignPage() {
  const params = useParams();
  const router = useRouter();

  return (
    <div>
      <CommonHeader title="法人貢献度評価設計" />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link href="/evaluation">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              評価管理に戻る
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>法人貢献度評価</CardTitle>
            <CardDescription>
              組織全体への貢献を評価する項目の設計
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">評価カテゴリー（25点）</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>委員会活動・プロジェクト参加</span>
                    <span className="font-medium">10点</span>
                  </li>
                  <li className="flex justify-between">
                    <span>教育・指導活動</span>
                    <span className="font-medium">5点</span>
                  </li>
                  <li className="flex justify-between">
                    <span>改善提案・業務改革</span>
                    <span className="font-medium">5点</span>
                  </li>
                  <li className="flex justify-between">
                    <span>法人イベント・地域貢献</span>
                    <span className="font-medium">5点</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-2">評価基準</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• 活動の頻度と継続性</p>
                  <p>• 成果の具体性と影響範囲</p>
                  <p>• 主体性とリーダーシップ</p>
                  <p>• 他部署・他施設との連携</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}