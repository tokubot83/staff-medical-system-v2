'use client';

import React, { useState, useEffect } from 'react';
import { Database, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { loadDemoData, clearDemoData, demoStaffProfiles, demoInterviewData } from '@/data/demoInterviewData';

interface DemoDataLoaderProps {
  onDataLoaded?: () => void;
}

export default function DemoDataLoader({ onDataLoaded }: DemoDataLoaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkDataExists();
  }, []);

  const checkDataExists = () => {
    try {
      const exists = localStorage.getItem('interview_INT_001') !== null;
      setHasData(exists);
    } catch (error) {
      console.error('Error checking data:', error);
      setHasData(false);
    }
  };

  const handleLoadData = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      await loadDemoData();
      setHasData(true);
      setMessage('デモデータが正常に読み込まれました！');
      
      if (onDataLoaded) {
        onDataLoaded();
      }
      
      // メッセージを3秒後にクリア
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error loading demo data:', error);
      setMessage('デモデータの読み込みに失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearData = () => {
    setIsClearing(true);
    setMessage('');
    
    try {
      clearDemoData();
      setHasData(false);
      setMessage('デモデータがクリアされました。');
      
      // メッセージを3秒後にクリア
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error clearing demo data:', error);
      setMessage('デモデータのクリアに失敗しました。');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          デモデータ管理
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ステータス表示 */}
        <div className={`flex items-center gap-2 p-3 rounded-lg ${
          hasData 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-gray-50 text-gray-600 border border-gray-200'
        }`}>
          {hasData ? (
            <>
              <CheckCircle className="h-5 w-5" />
              <span>デモデータが読み込まれています</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5" />
              <span>デモデータが読み込まれていません</span>
            </>
          )}
        </div>

        {/* メッセージ表示 */}
        {message && (
          <div className={`p-3 rounded-lg ${
            message.includes('失敗') || message.includes('エラー')
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            {message}
          </div>
        )}

        {/* データの概要 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">デモデータ内容:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 職員: {demoStaffProfiles.length}名（新人、一般、ベテラン、管理職）</li>
            <li>• 面談記録: {demoInterviewData.length}件</li>
            <li>• 面談タイプ: 定期面談、新人月次面談、管理職面談、サポート面談</li>
            <li>• 期間: 2023年5月〜2024年3月</li>
          </ul>
        </div>

        {/* サンプル職員一覧 */}
        <div className="bg-white border rounded-lg">
          <div className="p-3 border-b bg-gray-50">
            <h4 className="font-medium text-gray-900">サンプル職員</h4>
          </div>
          <div className="p-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {demoStaffProfiles.map(staff => (
                <div key={staff.staffId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">{staff.staffName}</span>
                  <span className="text-gray-600">
                    {staff.department} - {staff.experienceYears}年目
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex gap-2">
          <Button
            onClick={handleLoadData}
            disabled={isLoading || isClearing}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                読み込み中...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                {hasData ? 'デモデータを再読み込み' : 'デモデータを読み込み'}
              </>
            )}
          </Button>
          
          {hasData && (
            <Button
              onClick={handleClearData}
              disabled={isLoading || isClearing}
              variant="outline"
              className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
            >
              {isClearing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                  クリア中...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  デモデータをクリア
                </>
              )}
            </Button>
          )}
        </div>

        {/* 注意事項 */}
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>注意:</strong> このデモデータはテスト用です。
            前回面談シート表示機能の動作確認に使用してください。
            本番データには影響しません。
          </p>
        </div>
      </CardContent>
    </Card>
  );
}