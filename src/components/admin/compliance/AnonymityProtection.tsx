'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Key,
  UserX,
  FileText,
  AlertTriangle,
  CheckCircle,
  Hash,
  RefreshCw,
  Database
} from 'lucide-react';
import { ProtectionLevel, DisclosureRule } from '@/types/complianceMaster';

const AnonymityProtection: React.FC = () => {
  const [protectionLevels] = useState<ProtectionLevel[]>([
    {
      id: '1',
      name: '完全匿名',
      description: '通報者の身元情報は一切開示されません',
      restrictions: ['通報者への直接連絡不可', '身元特定につながる情報の隠匿'],
      allowedDisclosure: [],
      retentionPeriod: 2555,
      destructionMethod: '完全削除（復元不可）'
    },
    {
      id: '2',
      name: '条件付き開示',
      description: '特定条件下でのみ身元情報が開示されます',
      restrictions: ['通常時は匿名', '開示には承認が必要'],
      allowedDisclosure: ['法的手続き', '重大事案', '本人同意'],
      retentionPeriod: 1825,
      destructionMethod: '暗号化保存後削除'
    },
    {
      id: '3',
      name: '部分開示',
      description: '必要最小限の情報のみ開示されます',
      restrictions: ['個人特定情報のマスキング'],
      allowedDisclosure: ['部署名', '職位級'],
      retentionPeriod: 1095,
      destructionMethod: '段階的削除'
    }
  ]);

  const [disclosureRules] = useState<DisclosureRule[]>([
    {
      id: '1',
      condition: '刑事事件に発展',
      level: 'full',
      requiresConsent: false,
      approvalProcess: '法務部承認後CEO承認',
      documentationRequired: ['警察からの照会書', '法務部意見書']
    },
    {
      id: '2',
      condition: '裁判手続き',
      level: 'full',
      requiresConsent: false,
      approvalProcess: '法務部承認',
      documentationRequired: ['裁判所命令', '弁護士意見書']
    },
    {
      id: '3',
      condition: '内部調査必要時',
      level: 'partial',
      requiresConsent: true,
      approvalProcess: 'コンプライアンス委員会承認',
      documentationRequired: ['調査計画書', '開示必要性説明書']
    }
  ]);

  const [identitySettings] = useState({
    anonymousIdFormat: 'ANON-[YEAR]-[RANDOM:8]',
    hashingAlgorithm: 'SHA-512 + SALT',
    saltGeneration: 'CSPRNG (32 bytes)',
    keyRotationPeriod: 90,
    backupEncryption: 'AES-256-GCM'
  });

  const [redactionPatterns] = useState([
    { id: '1', pattern: '氏名', replacement: '[REDACTED]', description: '個人名を隠匿' },
    { id: '2', pattern: 'メールアドレス', replacement: '[EMAIL]', description: 'メールアドレスを隠匿' },
    { id: '3', pattern: '電話番号', replacement: '[PHONE]', description: '電話番号を隠匿' },
    { id: '4', pattern: '住所', replacement: '[ADDRESS]', description: '住所情報を隠匿' },
    { id: '5', pattern: 'ID番号', replacement: '[ID]', description: '識別番号を隠匿' }
  ]);

  return (
    <div className="space-y-6">
      {/* 保護レベル設定 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            匿名性保護レベル
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {protectionLevels.map((level) => (
              <div key={level.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-lg">{level.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                  </div>
                  <Badge className={
                    level.name === '完全匿名' ? 'bg-red-100 text-red-800' :
                    level.name === '条件付き開示' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }>
                    <Lock className="h-3 w-3 mr-1" />
                    {level.name === '完全匿名' ? '最高' :
                     level.name === '条件付き開示' ? '中' : '低'}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">制限事項：</span>
                    <ul className="mt-1 space-y-1">
                      {level.restrictions.map((restriction) => (
                        <li key={restriction} className="flex items-start gap-1">
                          <span className="text-red-500">•</span>
                          <span>{restriction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-gray-600">開示可能情報：</span>
                    {level.allowedDisclosure.length > 0 ? (
                      <ul className="mt-1 space-y-1">
                        {level.allowedDisclosure.map((item) => (
                          <li key={item} className="flex items-start gap-1">
                            <span className="text-green-500">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-gray-500">なし</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-gray-500" />
                    <span>保存期間: {level.retentionPeriod}日</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-gray-500" />
                    <span>削除方法: {level.destructionMethod}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 開示ルール */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            情報開示ルール
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {disclosureRules.map((rule) => (
              <div key={rule.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">条件: {rule.condition}</h4>
                    <div className="flex gap-2 mt-2">
                      <Badge className={
                        rule.level === 'full' ? 'bg-red-100 text-red-800' :
                        rule.level === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }>
                        {rule.level === 'full' ? '完全開示' :
                         rule.level === 'partial' ? '部分開示' : '非開示'}
                      </Badge>
                      {rule.requiresConsent && (
                        <Badge className="bg-blue-100 text-blue-800">
                          本人同意必要
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">承認プロセス：</span>
                    <span className="ml-2 font-medium">{rule.approvalProcess}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">必要書類：</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {rule.documentationRequired.map((doc) => (
                        <Badge key={doc} className="bg-gray-100 text-gray-700 text-xs">
                          <FileText className="h-3 w-3 mr-1" />
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            開示ルールを追加
          </button>
        </CardContent>
      </Card>

      {/* ID管理設定 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            匿名ID管理
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">IDフォーマット</div>
                <code className="text-sm font-mono bg-white px-2 py-1 rounded">
                  {identitySettings.anonymousIdFormat}
                </code>
                <p className="text-xs text-gray-500 mt-1">
                  例: ANON-2025-A3B5C7D9
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">ハッシュアルゴリズム</div>
                <div className="font-medium">{identitySettings.hashingAlgorithm}</div>
                <p className="text-xs text-gray-500 mt-1">
                  衝突耐性: 2^256
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">ソルト生成</div>
                <div className="font-medium">{identitySettings.saltGeneration}</div>
                <p className="text-xs text-gray-500 mt-1">
                  暗号学的に安全な乱数
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">キーローテーション</div>
                <div className="font-medium flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  {identitySettings.keyRotationPeriod}日ごと
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  次回: 2025年12月24日
                </p>
              </div>
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <Lock className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>セキュリティ保護</strong>
                <p className="mt-1 text-sm">
                  匿名IDは不可逆ハッシュ関数で保護され、元の身元情報を復元することは不可能です。
                  バックアップは{identitySettings.backupEncryption}で暗号化されています。
                </p>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* データマスキング */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserX className="h-5 w-5" />
            自動マスキング設定
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked readOnly className="rounded" />
                <span className="font-medium">自動マスキングを有効化</span>
              </label>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                有効
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">パターン</th>
                    <th className="text-left py-2">置換文字</th>
                    <th className="text-left py-2">説明</th>
                    <th className="text-center py-2">状態</th>
                  </tr>
                </thead>
                <tbody>
                  {redactionPatterns.map((pattern) => (
                    <tr key={pattern.id} className="border-b hover:bg-gray-50">
                      <td className="py-2">
                        <code className="bg-gray-100 px-2 py-0.5 rounded">{pattern.pattern}</code>
                      </td>
                      <td className="py-2">
                        <code className="bg-blue-50 px-2 py-0.5 rounded">{pattern.replacement}</code>
                      </td>
                      <td className="py-2">{pattern.description}</td>
                      <td className="text-center py-2">
                        <CheckCircle className="h-4 w-4 text-green-600 inline" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-yellow-900">マスキングポリシー</span>
              </div>
              <ul className="space-y-1 text-sm text-yellow-800">
                <li>• マスキングされたデータは別途暗号化保存されます</li>
                <li>• マスキング解除には特別権限が必要です</li>
                <li>• すべてのマスキング操作は監査ログに記録されます</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* アクセス制御 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            アクセス制御
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium">多要素認証</h4>
              </div>
              <Badge className="bg-green-100 text-green-800 mb-2">
                <CheckCircle className="h-3 w-3 mr-1" />
                必須
              </Badge>
              <p className="text-sm text-gray-600">
                匿名データへのアクセスにはMFAが必要
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <h4 className="font-medium">セッションタイムアウト</h4>
              </div>
              <div className="text-2xl font-bold mb-1">30分</div>
              <p className="text-sm text-gray-600">
                非アクティブ時自動ログアウト
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-5 w-5 text-green-600" />
                <h4 className="font-medium">監査ログ</h4>
              </div>
              <Badge className="bg-green-100 text-green-800 mb-2">
                <CheckCircle className="h-3 w-3 mr-1" />
                完全記録
              </Badge>
              <p className="text-sm text-gray-600">
                すべてのアクセスが記録されます
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnonymityProtection;