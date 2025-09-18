'use client';

import React, { useState } from 'react';
import GenericMasterTable from '@/components/admin/GenericMasterTable';
import DevelopmentMemoTab from '@/components/admin/DevelopmentMemoTab';
import { masterSchemas } from '@/config/masterSchemas';
import { 
  Users, Building2, GraduationCap, ClipboardCheck, 
  Database, ChevronRight, Shield, Settings, BookOpen, Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const masterTypes = [
  { 
    key: 'staff', 
    label: '職員マスター', 
    icon: Users,
    description: '職員情報の管理',
    color: 'blue'
  },
  { 
    key: 'facility', 
    label: '施設マスター', 
    icon: Building2,
    description: '施設・事業所の管理',
    color: 'green'
  },
  { 
    key: 'training', 
    label: '研修マスター', 
    icon: GraduationCap,
    description: '研修プログラムの管理',
    color: 'purple'
  },
  { 
    key: 'evaluationItem', 
    label: '評価項目マスター', 
    icon: ClipboardCheck,
    description: '評価項目の管理',
    color: 'orange'
  },
  {
    key: 'developmentMemo',
    label: '開発メモ',
    icon: BookOpen,
    description: '開発メモ・実装指示の集約',
    color: 'indigo'
  },
  {
    key: 'imageManagement',
    label: '画像管理',
    icon: Image,
    description: '職員画像・ファイル管理',
    color: 'pink'
  },
];

export default function MasterDataPage() {
  const [selectedMaster, setSelectedMaster] = useState<string>('staff');
  const currentSchema = selectedMaster !== 'developmentMemo' && selectedMaster !== 'imageManagement' ? masterSchemas[selectedMaster] : null;

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700',
      green: 'bg-green-50 hover:bg-green-100 border-green-200 text-green-700',
      purple: 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700',
      orange: 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700',
      indigo: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700',
      pink: 'bg-pink-50 hover:bg-pink-100 border-pink-200 text-pink-700',
    };
    return colors[color] || colors.blue;
  };

  const getIconColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
      indigo: 'text-indigo-600',
      pink: 'text-pink-600',
    };
    return colors[color] || colors.blue;
  };

  const getActiveTabColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'border-blue-500 text-blue-600',
      green: 'border-green-500 text-green-600',
      purple: 'border-purple-500 text-purple-600',
      orange: 'border-orange-500 text-orange-600',
      indigo: 'border-indigo-500 text-indigo-600',
      pink: 'border-pink-500 text-pink-600',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* タブメニュー */}
        <div className="bg-white rounded-lg border mb-6">
          <div className="border-b">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {masterTypes.map(master => {
                const Icon = master.icon;
                const isSelected = selectedMaster === master.key;

                return (
                  <button
                    key={master.key}
                    onClick={() => setSelectedMaster(master.key)}
                    className={`
                      flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                      ${isSelected
                        ? getActiveTabColorClasses(master.color)
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {master.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <div className="bg-white rounded-lg border">
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    {(() => {
                      const master = masterTypes.find(m => m.key === selectedMaster);
                      const Icon = master?.icon || Database;
                      return (
                        <>
                          <Icon className={`h-5 w-5 mr-2 ${getIconColorClasses(master?.color || 'blue')}`} />
                          {master?.label}
                        </>
                      );
                    })()}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {masterTypes.find(m => m.key === selectedMaster)?.description}
                  </p>
                </div>

                {selectedMaster === 'developmentMemo' ? (
                  <DevelopmentMemoTab />
                ) : selectedMaster === 'imageManagement' ? (
                  <div className="text-center py-8">
                    <div className="max-w-md mx-auto">
                      <Image className="h-16 w-16 mx-auto text-gray-400 mb-4" aria-hidden="true" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">画像管理</h3>
                      <p className="text-gray-600 mb-6">
                        職員の画像やファイルを管理します。アップロード、削除、ストレージ監視が可能です。
                      </p>
                      <button
                        onClick={() => window.location.href = '/admin/image-management'}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                      >
                        <Image className="h-5 w-5 mr-2" aria-hidden="true" />
                        画像管理ページを開く
                      </button>
                    </div>
                  </div>
                ) : currentSchema ? (
                  <GenericMasterTable
                    masterType={selectedMaster}
                    label={currentSchema.label}
                    fields={currentSchema.fields}
                    searchableFields={currentSchema.searchableFields}
                  />
                ) : null}
              </div>
            </div>
          </div>

          {/* クイックアクション&情報 */}
          <div className="col-span-12 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* クイックアクション */}
              <div className="bg-white rounded-lg border p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  クイックアクション
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = '/admin/backup'}
                  >
                    <Database className="h-3 w-3 mr-2" />
                    バックアップ管理
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = '/admin/audit-log'}
                  >
                    <ClipboardCheck className="h-3 w-3 mr-2" />
                    監査ログ
                  </Button>
                </div>
              </div>

              {/* 情報パネル */}
              {selectedMaster === 'developmentMemo' ? (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <BookOpen className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-indigo-800">
                        開発メモについて
                      </h3>
                      <div className="mt-2 text-sm text-indigo-700">
                        <ul className="list-disc list-inside space-y-1">
                          <li>システム内の開発メモ、TODO、実装指示書を集約表示しています</li>
                          <li>ファイルパスをクリックすると、該当ファイルの場所が確認できます</li>
                          <li>優先度「Critical」の項目は早急な対応が必要です</li>
                          <li>最新の実装指示書: /docs/implementation-resume-guide-v3-20250813.md</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        データ管理に関する注意事項
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <ul className="list-disc list-inside space-y-1">
                          <li>マスターデータの変更は、システム全体に影響を与える可能性があります</li>
                          <li>削除したデータは復元できません。必要に応じてバックアップを取得してください</li>
                          <li>インポート時は、データ形式が正しいことを確認してください</li>
                          <li>変更履歴は自動的に記録されます</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}