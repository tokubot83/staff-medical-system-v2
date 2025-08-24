'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestInterviewSheet() {
  return (
    <Card>
      <CardHeader className="bg-blue-50">
        <CardTitle className="text-blue-800">
          テスト用面談シート
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-bold text-green-800 mb-2">✅ 成功！</h3>
            <p className="text-green-700">
              面談シートコンポーネントが正しく読み込まれました。
              これで前回面談シート比較機能が動作しています！
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">基本情報</h4>
              <div className="space-y-2 text-sm">
                <div>職員名: [動的に設定]</div>
                <div>面談タイプ: [動的に設定]</div>
                <div>実施日: {new Date().toLocaleDateString('ja-JP')}</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">面談内容</h4>
              <div className="space-y-2 text-sm">
                <div>• 業務状況の確認</div>
                <div>• 目標設定・進捗確認</div>
                <div>• 課題・改善点の話し合い</div>
                <div>• 次回面談までのアクションアイテム</div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">比較機能テスト</h4>
            <p className="text-blue-700 text-sm">
              左側に前回の面談データ、右側にこのシートが表示されていれば、
              前回面談シート比較機能は正常に動作しています。
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}