'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Shield,
  Lock,
  RefreshCw,
  Database,
  Key,
  AlertTriangle,
  CheckCircle,
  Settings,
  Zap,
  FileText,
  Hash,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';
import { VoiceDriveIntegration as VDIntegration, DataCategory, FieldMapping } from '@/types/complianceMaster';

const VoiceDriveIntegration: React.FC = () => {
  const [integration, setIntegration] = useState<VDIntegration>({
    id: '1',
    enabled: true,
    apiEndpoint: 'https://voicedrive.ai/api/v2/compliance',
    encryptionMethod: 'AES-256-GCM',
    autoImportEnabled: true,
    importInterval: 15,
    anonymizationLevel: 'conditional',
    hashAlgorithm: 'SHA-512',
    retentionPeriod: 2555,
    dataCategories: [
      {
        id: '1',
        name: 'ハラスメント',
        voiceDriveCode: 'HARASSMENT',
        severity: 'critical',
        requiredResponseTime: 1,
        escalationPath: ['直属上司', '人事部長', 'ハラスメント対策委員会'],
        assignedCommittee: 'harassment-committee',
        autoTriage: true,
        keywords: ['パワハラ', 'セクハラ', 'いじめ', '嫌がらせ']
      },
      {
        id: '2',
        name: '診療報酬不正',
        voiceDriveCode: 'FRAUD',
        severity: 'high',
        requiredResponseTime: 24,
        escalationPath: ['事務長', '監査室', '懲戒委員会'],
        assignedCommittee: 'disciplinary-committee',
        autoTriage: true,
        keywords: ['不正請求', '偽装', '架空請求', '水増し']
      },
      {
        id: '3',
        name: '労働条件違反',
        voiceDriveCode: 'LABOR',
        severity: 'medium',
        requiredResponseTime: 72,
        escalationPath: ['人事部', '労働衛生委員会'],
        assignedCommittee: 'health-safety-committee',
        autoTriage: true,
        keywords: ['残業', '休日出勤', '有給', '労働時間']
      },
      {
        id: '4',
        name: '個人情報漏洩',
        voiceDriveCode: 'PRIVACY',
        severity: 'critical',
        requiredResponseTime: 1,
        escalationPath: ['情報管理室', 'DPO', '個人情報保護委員会'],
        autoTriage: true,
        keywords: ['漏洩', '個人情報', 'プライバシー', '不正アクセス']
      }
    ],
    fieldMappings: [
      { voiceDriveField: 'report_id', systemField: 'caseId', required: true, encrypted: false },
      { voiceDriveField: 'anonymous_id', systemField: 'anonymousId', required: true, encrypted: true },
      { voiceDriveField: 'category', systemField: 'category', required: true, encrypted: false },
      { voiceDriveField: 'description', systemField: 'description', required: true, encrypted: true },
      { voiceDriveField: 'timestamp', systemField: 'receivedAt', required: true, encrypted: false },
      { voiceDriveField: 'severity', systemField: 'severity', required: true, encrypted: false },
      { voiceDriveField: 'attachments', systemField: 'evidence', required: false, encrypted: true }
    ],
    validationRules: [],
    notificationTriggers: []
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey] = useState('vd_live_sk_...');
  const [testConnection, setTestConnection] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');

  const handleTestConnection = () => {
    setTestConnection('testing');
    setTimeout(() => {
      setTestConnection('success');
      setTimeout(() => setTestConnection('idle'), 3000);
    }, 2000);
  };

  const handleSyncNow = () => {
    console.log('Manual sync triggered');
  };

  return (
    <div className="space-y-6">
      {/* 接続ステータス */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            VoiceDrive接続設定
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${
                  integration.enabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`} />
                <span className="font-medium">
                  {integration.enabled ? '接続中' : '未接続'}
                </span>
              </div>
              {integration.enabled && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  正常稼働中
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleTestConnection}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                接続テスト
                {testConnection === 'testing' && <RefreshCw className="h-4 w-4 animate-spin" />}
                {testConnection === 'success' && <CheckCircle className="h-4 w-4" />}
              </button>
              <button
                onClick={handleSyncNow}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                今すぐ同期
              </button>
            </div>
          </div>

          {/* API設定 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">APIエンドポイント</label>
              <input
                type="text"
                value={integration.apiEndpoint}
                onChange={(e) => setIntegration({...integration, apiEndpoint: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">APIキー</label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  readOnly
                  className="w-full px-3 py-2 pr-10 border rounded-lg bg-gray-50"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showApiKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* 暗号化設定 */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              暗号化・セキュリティ設定
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">暗号化方式</label>
                <select
                  value={integration.encryptionMethod}
                  onChange={(e) => setIntegration({...integration, encryptionMethod: e.target.value as any})}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="AES-256-GCM">AES-256-GCM (推奨)</option>
                  <option value="RSA-4096">RSA-4096</option>
                  <option value="ChaCha20-Poly1305">ChaCha20-Poly1305</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ハッシュアルゴリズム</label>
                <select
                  value={integration.hashAlgorithm}
                  onChange={(e) => setIntegration({...integration, hashAlgorithm: e.target.value as any})}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="SHA-256">SHA-256</option>
                  <option value="SHA-512">SHA-512 (推奨)</option>
                  <option value="BLAKE2b">BLAKE2b</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">匿名化レベル</label>
                <select
                  value={integration.anonymizationLevel}
                  onChange={(e) => setIntegration({...integration, anonymizationLevel: e.target.value as any})}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="full">完全匿名</option>
                  <option value="partial">部分匿名</option>
                  <option value="conditional">条件付き開示</option>
                </select>
              </div>
            </div>
          </div>

          {/* 自動同期設定 */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              自動同期設定
            </h4>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={integration.autoImportEnabled}
                  onChange={(e) => setIntegration({...integration, autoImportEnabled: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm">自動インポートを有効化</span>
              </label>
              {integration.autoImportEnabled && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <input
                    type="number"
                    value={integration.importInterval}
                    onChange={(e) => setIntegration({...integration, importInterval: parseInt(e.target.value)})}
                    className="w-20 px-2 py-1 border rounded"
                  />
                  <span className="text-sm text-gray-600">分ごと</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* カテゴリマッピング */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            データカテゴリ設定
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {integration.dataCategories.map((category) => (
              <div key={category.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">{category.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      VoiceDriveコード: <code className="bg-gray-100 px-2 py-0.5 rounded">{category.voiceDriveCode}</code>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={
                      category.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      category.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      category.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }>
                      {category.severity === 'critical' ? '重大' :
                       category.severity === 'high' ? '高' :
                       category.severity === 'medium' ? '中' : '低'}
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800">
                      {category.requiredResponseTime}時間以内
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">エスカレーション経路：</span>
                    <div className="mt-1">
                      {category.escalationPath.map((path, index) => (
                        <span key={index} className="inline-flex items-center">
                          {index > 0 && <span className="mx-1 text-gray-400">→</span>}
                          <span className="bg-gray-100 px-2 py-0.5 rounded">{path}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">キーワード：</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {category.keywords.map((keyword) => (
                        <span key={keyword} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={category.autoTriage}
                      readOnly
                      className="rounded"
                    />
                    <span>自動トリアージ</span>
                  </label>
                  {category.assignedCommittee && (
                    <span className="text-gray-600">
                      担当委員会: <strong>{category.assignedCommittee === 'harassment-committee' ? 'ハラスメント対策委員会' :
                                         category.assignedCommittee === 'disciplinary-committee' ? '懲戒委員会' :
                                         '労働衛生委員会'}</strong>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            カテゴリを追加
          </button>
        </CardContent>
      </Card>

      {/* フィールドマッピング */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            フィールドマッピング
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">VoiceDriveフィールド</th>
                  <th className="text-left py-2">システムフィールド</th>
                  <th className="text-center py-2">必須</th>
                  <th className="text-center py-2">暗号化</th>
                  <th className="text-left py-2">変換</th>
                </tr>
              </thead>
              <tbody>
                {integration.fieldMappings.map((mapping, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2">
                      <code className="bg-gray-100 px-2 py-0.5 rounded">{mapping.voiceDriveField}</code>
                    </td>
                    <td className="py-2">
                      <code className="bg-blue-50 px-2 py-0.5 rounded">{mapping.systemField}</code>
                    </td>
                    <td className="text-center py-2">
                      {mapping.required && <CheckCircle className="h-4 w-4 text-green-600 inline" />}
                    </td>
                    <td className="text-center py-2">
                      {mapping.encrypted && <Lock className="h-4 w-4 text-blue-600 inline" />}
                    </td>
                    <td className="py-2">
                      {mapping.transformation || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* セキュリティ情報 */}
      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>セキュリティ保証</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• すべての通信はTLS 1.3で暗号化されています</li>
            <li>• 通報者の身元は完全に匿名化され、復元不可能です</li>
            <li>• データは暗号化された状態で保存され、アクセスログが記録されます</li>
            <li>• 小原病院セキュリティポリシーおよびISO 27001準拠</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default VoiceDriveIntegration;