'use client';

import React, { useState } from 'react';
import GenericMasterTable from '@/components/admin/GenericMasterTable';
import DevelopmentMemoTab from '@/components/admin/DevelopmentMemoTab';
import EvaluationSystemMasterManager from '@/components/admin/EvaluationSystemMasterManager';
import InterviewSystemVersionManager from '@/components/admin/InterviewSystemVersionManager';
import HRPolicyManager from '@/components/admin/HRPolicyManager';
import TrainingSystemManager from '@/components/admin/TrainingSystemManager';
import { masterSchemas } from '@/config/masterSchemas';
import RecruitmentMaster from '@/components/admin/recruitment/RecruitmentMaster';
import ComplianceMasterManager from '@/components/admin/compliance/ComplianceMasterManager';
import {
  Users, Building2, GraduationCap, ClipboardCheck,
  Database, ChevronRight, Shield, Settings, BookOpen, Image, Calculator, MessageSquare, FileText, Briefcase, ShieldCheck
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
    key: 'trainingSystem',
    label: '教育・研修制度マスター',
    icon: GraduationCap,
    description: '試用期間活用プログラムを含む全研修制度の動的管理',
    color: 'teal'
  },
  {
    key: 'evaluationSystem',
    label: '評価制度マスター',
    icon: Calculator,
    description: '2軸評価制度の完全動的管理',
    color: 'cyan'
  },
  {
    key: 'interviewSystem',
    label: '面談制度マスター',
    icon: MessageSquare,
    description: '面談制度バージョンの管理',
    color: 'violet'
  },
  {
    key: 'hrPolicy',
    label: '人事ポリシーマスター',
    icon: FileText,
    description: '19項目の人事ポリシー管理',
    color: 'amber'
  },
  {
    key: 'evaluationItem',
    label: '評価項目（旧）',
    icon: ClipboardCheck,
    description: '旧評価項目の管理',
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
  {
    key: 'recruitment',
    label: '採用管理マスター',
    icon: Briefcase,
    description: '採用ワークフロー・審査基準の管理',
    color: 'emerald'
  },
  {
    key: 'compliance',
    label: 'コンプライアンス窓口',
    icon: ShieldCheck,
    description: 'コンプライアンス通報管理・VoiceDrive連携設定',
    color: 'red'
  },
];

export default function MasterDataPage() {
  const [selectedMaster, setSelectedMaster] = useState<string>('staff');
  const currentSchema = selectedMaster !== 'developmentMemo' && selectedMaster !== 'imageManagement' && selectedMaster !== 'evaluationSystem' && selectedMaster !== 'interviewSystem' && selectedMaster !== 'hrPolicy' && selectedMaster !== 'trainingSystem' && selectedMaster !== 'recruitment' && selectedMaster !== 'compliance' ? masterSchemas[selectedMaster] : null;

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700',
      green: 'bg-green-50 hover:bg-green-100 border-green-200 text-green-700',
      purple: 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700',
      orange: 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700',
      indigo: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700',
      pink: 'bg-pink-50 hover:bg-pink-100 border-pink-200 text-pink-700',
      cyan: 'bg-cyan-50 hover:bg-cyan-100 border-cyan-200 text-cyan-700',
      violet: 'bg-violet-50 hover:bg-violet-100 border-violet-200 text-violet-700',
      amber: 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700',
      teal: 'bg-teal-50 hover:bg-teal-100 border-teal-200 text-teal-700',
      emerald: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700',
      red: 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700',
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
      cyan: 'text-cyan-600',
      violet: 'text-violet-600',
      amber: 'text-amber-600',
      teal: 'text-teal-600',
      emerald: 'text-emerald-600',
      red: 'text-red-600',
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
      cyan: 'border-cyan-500 text-cyan-600',
      violet: 'border-violet-500 text-violet-600',
      amber: 'border-amber-500 text-amber-600',
      teal: 'border-teal-500 text-teal-600',
      emerald: 'border-emerald-500 text-emerald-600',
      red: 'border-red-500 text-red-600',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* タブメニュー - 3行グリッド構成 */}
        <div className="bg-white rounded-lg border mb-6">
          <div className="border-b">
            <div className="grid grid-cols-4 gap-1 p-4">
              {masterTypes.map(master => {
                const Icon = master.icon;
                const isSelected = selectedMaster === master.key;

                return (
                  <button
                    key={master.key}
                    onClick={() => setSelectedMaster(master.key)}
                    className={`
                      flex items-center justify-center py-3 px-4 rounded-lg font-medium text-sm transition-all
                      ${isSelected
                        ? `${getColorClasses(master.color)} border-2`
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 border-2 border-transparent'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{master.label}</span>
                  </button>
                );
              })}
            </div>
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

                {selectedMaster === 'evaluationSystem' ? (
                  <EvaluationSystemMasterManager />
                ) : selectedMaster === 'interviewSystem' ? (
                  <InterviewSystemVersionManager />
                ) : selectedMaster === 'hrPolicy' ? (
                  <HRPolicyManager />
                ) : selectedMaster === 'trainingSystem' ? (
                  <TrainingSystemManager />
                ) : selectedMaster === 'recruitment' ? (
                  <RecruitmentMaster />
                ) : selectedMaster === 'compliance' ? (
                  <ComplianceMasterManager />
                ) : selectedMaster === 'developmentMemo' ? (
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