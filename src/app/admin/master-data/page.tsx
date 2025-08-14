'use client';

import React, { useState } from 'react';
import GenericMasterTable from '@/components/admin/GenericMasterTable';
import DevelopmentMemoTab from '@/components/admin/DevelopmentMemoTab';
import { masterSchemas } from '@/config/masterSchemas';
import { 
  Users, Building2, GraduationCap, ClipboardCheck, 
  Database, ChevronRight, Shield, Settings, BookOpen
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
];

export default function MasterDataPage() {
  const [selectedMaster, setSelectedMaster] = useState<string>('staff');
  const currentSchema = selectedMaster !== 'developmentMemo' ? masterSchemas[selectedMaster] : null;

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700',
      green: 'bg-green-50 hover:bg-green-100 border-green-200 text-green-700',
      purple: 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700',
      orange: 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700',
      indigo: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700',
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
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Database className="h-6 w-6 text-gray-700" />
              <h1 className="text-2xl font-bold text-gray-900">マスターデータ管理</h1>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                管理者機能
              </Badge>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Shield className="h-4 w-4" />
              <span>管理者権限</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3">
            <div className="bg-white rounded-lg border p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                マスターデータ選択
              </h2>
              <div className="space-y-2">
                {masterTypes.map(master => {
                  const Icon = master.icon;
                  const isSelected = selectedMaster === master.key;
                  
                  return (
                    <button
                      key={master.key}
                      onClick={() => setSelectedMaster(master.key)}
                      className={`
                        w-full text-left p-3 rounded-lg border transition-all
                        ${isSelected 
                          ? getColorClasses(master.color) + ' border-2'
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Icon className={`h-5 w-5 ${
                            isSelected ? getIconColorClasses(master.color) : 'text-gray-500'
                          }`} />
                          <div>
                            <div className="font-medium text-sm">
                              {master.label}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {master.description}
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <ChevronRight className={`h-4 w-4 ${getIconColorClasses(master.color)}`} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  クイックアクション
                </h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => window.location.href = '/admin/backup'}
                  >
                    <Database className="h-3 w-3 mr-2" />
                    バックアップ管理
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => window.location.href = '/admin/audit-log'}
                  >
                    <ClipboardCheck className="h-3 w-3 mr-2" />
                    監査ログ
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-9">
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

            {selectedMaster === 'developmentMemo' ? (
              <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
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
                        <li>最新の実装指示書: /docs/implementation-resume-guide-v3-20250113.md</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
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
  );
}