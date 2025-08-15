'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function FacilityDesignPage() {
  const params = useParams();
  const router = useRouter();
  const facilityName = decodeURIComponent(params.name as string);

  return (
    <div>
      <CommonHeader title={`${facilityName} - 施設特化項目設計`} />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link href="/evaluation-design">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              評価制度設計に戻る
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{facilityName}</CardTitle>
            <CardDescription>
              施設特化評価項目（20点）の詳細設計
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                {facilityName}の特性に応じた評価項目を設定します。
              </p>
              
              {facilityName === 'エスポワール立神' && (
                <div className="space-y-2">
                  <h3 className="font-medium">老健施設向け評価項目</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    <li>生活支援スキル</li>
                    <li>認知症ケア</li>
                    <li>レクリエーション企画・実施</li>
                    <li>家族とのコミュニケーション</li>
                  </ul>
                </div>
              )}
              
              {facilityName === '小原病院' && (
                <div className="space-y-2">
                  <h3 className="font-medium">急性期病院向け評価項目</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    <li>救急対応スキル</li>
                    <li>高度医療機器操作</li>
                    <li>チーム医療連携</li>
                    <li>緊急時対応力</li>
                  </ul>
                </div>
              )}
              
              {facilityName === '立神リハビリテーション温泉病院' && (
                <div className="space-y-2">
                  <h3 className="font-medium">慢性期病院向け評価項目</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    <li>リハビリテーション支援</li>
                    <li>在宅復帰支援</li>
                    <li>長期療養ケア</li>
                    <li>温泉療法知識</li>
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}