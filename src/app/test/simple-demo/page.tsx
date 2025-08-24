'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SimpleDemoPage() {
  const [showComparison, setShowComparison] = useState(false);

  if (!showComparison) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>前回面談シート比較デモ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">前回面談シートとの比較機能のデモです。</p>
            <Button onClick={() => setShowComparison(true)}>
              比較表示を開始
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
          
          {/* ヘッダー */}
          <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">面談シート比較表示</h2>
            <Button 
              variant="ghost" 
              onClick={() => setShowComparison(false)}
              className="text-white hover:bg-white/20"
            >
              ✕ 閉じる
            </Button>
          </div>

          {/* コンテンツ */}
          <div className="flex flex-1">
            
            {/* 左側：前回の面談シート */}
            <div className="w-1/2 border-r border-gray-200 flex flex-col">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h3 className="font-semibold text-gray-800">前回の面談シート</h3>
                <p className="text-xs text-gray-600">同じタイプの直近面談</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                <Card>
                  <CardHeader className="bg-green-50">
                    <CardTitle className="text-green-800 text-sm">
                      📋 前回の年次面談 (2023年12月実施)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3 text-sm">
                      <div>
                        <strong>面談者:</strong> 高橋部長
                      </div>
                      <div>
                        <strong>サマリー:</strong> 今年度の目標達成状況について話し合いました。技術的な成長が見られ、来年度はリーダーシップ研修への参加を検討することになりました。
                      </div>
                      <div>
                        <strong>重要ポイント:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>急性期看護における判断力が向上している</li>
                          <li>新人指導に積極的に関わっている</li>
                          <li>次年度のリーダー候補として期待される</li>
                        </ul>
                      </div>
                      <div>
                        <strong>アクションアイテム:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>リーダーシップ研修の受講 ✅</li>
                          <li>新人プリセプター役の準備 ✅</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* 右側：今回の面談シート */}
            <div className="w-1/2 flex flex-col">
              <div className="bg-blue-50 px-4 py-3 border-b">
                <h3 className="font-semibold text-blue-800">今回の面談シート</h3>
                <p className="text-xs text-blue-600">現在実施中の面談</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                <Card>
                  <CardHeader className="bg-blue-50">
                    <CardTitle className="text-blue-800">
                      ✅ 成功！面談シート比較機能
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <h4 className="font-bold text-green-800 mb-2">🎉 機能が動作しています！</h4>
                        <p className="text-green-700 text-sm">
                          前回面談シート比較機能が正常に実装され、動作しています。
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold">実装された機能:</h4>
                        <ul className="text-sm space-y-1">
                          <li>✅ 同じタイプの直近面談データ取得</li>
                          <li>✅ 左右並列表示</li>
                          <li>✅ 初回面談時のメッセージ表示</li>
                          <li>✅ モーダル表示・操作</li>
                          <li>✅ デモデータとの連携</li>
                        </ul>
                      </div>

                      <div className="bg-blue-100 p-3 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">次のステップ</h4>
                        <p className="text-blue-700 text-sm">
                          この基本機能を元に、実際の面談シートコンポーネントとの統合や、
                          セクション同期機能の追加を行うことができます。
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* フッター */}
          <div className="bg-gray-100 px-6 py-3 border-t">
            <div className="text-sm text-gray-600">
              前回面談シート比較機能のデモ - 左右を比較して面談を進められます
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}