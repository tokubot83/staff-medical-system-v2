'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Settings,
  Database,
  Download,
  Upload,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users
} from 'lucide-react';

import QuestionBankManager from './components/QuestionBankManager';
import SectionDefinitionEditor from './components/SectionDefinitionEditor';
import FacilityCustomizer from './components/FacilityCustomizer';
import DurationSettings from './components/DurationSettings';
import PreviewMode from './components/PreviewMode';
import DataManagement from './components/DataManagement';

export default function InterviewBankAdminPage() {
  const [activeTab, setActiveTab] = useState('questions');
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  const handleSync = async () => {
    setSyncStatus('syncing');
    try {
      // 同期処理（実装はサービス層で）
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLastSyncTime(new Date());
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 5000);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">面談バンク管理</h1>
          <p className="text-muted-foreground mt-2">
            面談バンクシステムの質問、セクション、設定を管理します
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSync}
            disabled={syncStatus === 'syncing'}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
            {syncStatus === 'syncing' ? '同期中...' : '同期'}
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            詳細設定
          </Button>
        </div>
      </div>

      {/* ステータスカード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">総質問数</p>
                <p className="text-2xl font-bold">247</p>
                <p className="text-xs text-muted-foreground mt-1">
                  アクティブ: 235
                </p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">セクション数</p>
                <p className="text-2xl font-bold">32</p>
                <p className="text-xs text-muted-foreground mt-1">
                  カスタム: 8
                </p>
              </div>
              <Database className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">利用施設</p>
                <p className="text-2xl font-bold">4</p>
                <p className="text-xs text-muted-foreground mt-1">
                  カスタマイズ済: 3
                </p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">最終更新</p>
                <p className="text-lg font-semibold">
                  {lastSyncTime.toLocaleDateString('ja-JP')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {lastSyncTime.toLocaleTimeString('ja-JP')}
                </p>
              </div>
              {syncStatus === 'success' ? (
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              ) : syncStatus === 'error' ? (
                <AlertCircle className="h-8 w-8 text-red-500" />
              ) : (
                <Clock className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* メインコンテンツ */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="questions">質問管理</TabsTrigger>
          <TabsTrigger value="sections">セクション定義</TabsTrigger>
          <TabsTrigger value="facility">施設別設定</TabsTrigger>
          <TabsTrigger value="duration">時間設定</TabsTrigger>
          <TabsTrigger value="preview">プレビュー</TabsTrigger>
          <TabsTrigger value="data">データ管理</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>質問バンク管理</CardTitle>
              <CardDescription>
                面談で使用する質問の追加、編集、削除、分類を行います
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuestionBankManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>セクション定義エディター</CardTitle>
              <CardDescription>
                面談シートのセクション構成と適用条件を設定します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SectionDefinitionEditor />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facility" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>施設別カスタマイズ</CardTitle>
              <CardDescription>
                施設タイプや部署に応じた質問・セクションのカスタマイズを行います
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FacilityCustomizer />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="duration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>面談時間別設定</CardTitle>
              <CardDescription>
                面談時間（15分、30分、45分、60分）に応じた質問数と優先度を設定します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DurationSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>プレビューモード</CardTitle>
              <CardDescription>
                設定した条件で実際に生成される面談シートをプレビューします
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PreviewMode />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>データ管理</CardTitle>
              <CardDescription>
                面談バンクデータのエクスポート、インポート、バックアップを管理します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* アラート表示 */}
      {syncStatus === 'success' && (
        <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <span className="text-green-800">同期が完了しました</span>
        </div>
      )}
      
      {syncStatus === 'error' && (
        <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-red-800">同期に失敗しました</span>
        </div>
      )}
    </div>
  );
}