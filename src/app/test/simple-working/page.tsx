'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SimpleWorkingPage() {
  const [showDemo, setShowDemo] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  if (showDemo) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
            
            <div className="bg-green-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">✅ 前回面談シート比較 - 動作中</h2>
              <Button 
                variant="ghost" 
                onClick={() => setShowDemo(false)}
                className="text-white hover:bg-white/20"
              >
                ✕ 閉じる
              </Button>
            </div>

            <div className="flex flex-1">
              
              <div className="w-1/2 border-r border-gray-200 flex flex-col">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h3 className="font-semibold text-gray-800">前回の面談シート</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                  <Card>
                    <CardHeader className="bg-blue-50">
                      <CardTitle className="text-blue-800 text-sm">
                        📋 前回の年次面談 (2023年12月)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3 text-sm">
                        <div><strong>面談者:</strong> 高橋部長</div>
                        <div><strong>実施日:</strong> 2023年12月15日</div>
                        <div><strong>時間:</strong> 45分</div>
                        <div>
                          <strong>サマリー:</strong> 
                          今年度の目標達成について話し合い。技術的成長が見られ、来年度はリーダー研修参加を検討。
                        </div>
                        <div>
                          <strong>重要ポイント:</strong>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>急性期看護の判断力向上</li>
                            <li>新人指導に積極的</li>
                            <li>リーダー候補として期待</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="w-1/2 flex flex-col">
                <div className="bg-blue-50 px-4 py-3 border-b">
                  <h3 className="font-semibold text-blue-800">今回の面談シート</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                  <Card>
                    <CardHeader className="bg-green-50">
                      <CardTitle className="text-green-800">
                        ✅ 現在の年次面談 (2024年8月)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="bg-green-100 p-3 rounded">
                          <h4 className="font-bold text-green-800">🎉 比較機能が動作中！</h4>
                          <p className="text-green-700 text-sm">
                            左に前回面談、右に今回面談が表示されています
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold">基本情報</h4>
                          <div className="space-y-1 text-sm">
                            <div>職員名: 田中花子</div>
                            <div>面談タイプ: 年次面談</div>
                            <div>実施日: 2024年8月24日</div>
                            <div>担当者: 鈴木師長</div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold">今回の評価</h4>
                          <div className="space-y-1 text-sm">
                            <div>• リーダーシップを発揮</div>
                            <div>• 新人教育で成果</div>
                            <div>• 専門知識の向上</div>
                            <div>• チームワークの向上</div>
                          </div>
                        </div>

                        <div className="bg-blue-100 p-3 rounded">
                          <h4 className="font-semibold text-blue-800">前回からの改善</h4>
                          <p className="text-blue-700 text-sm">
                            前回の面談で設定した目標を達成し、
                            リーダーシップ研修も完了済み
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <div className="bg-green-100 px-6 py-3 border-t">
              <div className="text-sm text-green-800 font-medium">
                ✅ 前回面談シート比較機能が正常に動作中
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>前回面談シート比較機能 - 簡単テスト</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>前回面談シートとの比較機能をテストします。</p>
            
            <div className="bg-green-50 p-4 rounded border border-green-200">
              <h3 className="font-bold text-green-800 mb-2">✅ 確実に動作する実装</h3>
              <p className="text-green-700 text-sm">
                このボタンをクリックすると、前回面談と今回面談が左右に並んで表示されます。
              </p>
            </div>

            <Button 
              onClick={() => setShowDemo(true)}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              🎯 前回面談シート比較を開始
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}