'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Globe,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Link2,
  BarChart3,
  Star,
  AlertCircle,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { ApplicationSourceDefinition } from '@/types/recruitmentMaster';

const ApplicationSourceConfig: React.FC = () => {
  const [sources, setSources] = useState<ApplicationSourceDefinition[]>([
    {
      id: '1',
      code: 'indeed',
      name: 'Indeed',
      category: 'online',
      description: '大手求人サイト Indeed からの応募',
      isActive: true,
      order: 1,
      subCategory: {
        code: 'job_board',
        name: '求人サイト'
      },
      budget: {
        annual: 600000,
        monthly: 50000,
        costPerApplication: 1500,
        costPerHire: 50000,
        currency: 'JPY'
      },
      tracking: {
        utmSource: 'indeed',
        utmMedium: 'job_board',
        utmCampaign: 'nurse_recruitment_2025',
        customParameters: {
          job_id: 'nurse_001'
        }
      },
      kpis: {
        targetApplications: 20,
        targetHires: 3,
        targetConversionRate: 15,
        qualityThreshold: 7
      },
      integration: {
        type: 'api',
        endpoint: 'https://api.indeed.com/v2',
        apiKey: '***',
        autoImport: true,
        importSchedule: '0 */6 * * *'
      },
      evaluation: {
        qualityScore: 8,
        speedScore: 9,
        volumeScore: 8,
        costEffectiveness: 7,
        overallRating: 4,
        notes: '安定した応募者流入があり、質も高い'
      },
      metadata: {
        createdAt: '2025-01-01T00:00:00',
        createdBy: 'system',
        updatedAt: '2025-01-01T00:00:00',
        updatedBy: 'system'
      }
    },
    {
      id: '2',
      code: 'referral',
      name: '職員紹介',
      category: 'referral',
      description: '既存職員からの紹介',
      isActive: true,
      order: 2,
      subCategory: {
        code: 'employee_referral',
        name: '社員紹介'
      },
      budget: {
        annual: 300000,
        monthly: 25000,
        costPerHire: 30000,
        currency: 'JPY'
      },
      tracking: {
        utmSource: 'referral',
        utmMedium: 'employee',
        customParameters: {
          referral_program: 'v2'
        }
      },
      kpis: {
        targetApplications: 5,
        targetHires: 2,
        targetConversionRate: 40,
        qualityThreshold: 9
      },
      evaluation: {
        qualityScore: 10,
        speedScore: 7,
        volumeScore: 4,
        costEffectiveness: 9,
        overallRating: 5,
        notes: '定着率が高く、質の高い人材が集まる'
      },
      metadata: {
        createdAt: '2025-01-01T00:00:00',
        createdBy: 'system',
        updatedAt: '2025-01-01T00:00:00',
        updatedBy: 'system'
      }
    },
    {
      id: '3',
      code: 'nurse_center',
      name: 'ナースセンター',
      category: 'agency',
      description: '都道府県ナースセンターからの紹介',
      isActive: true,
      order: 3,
      budget: {
        annual: 0,
        monthly: 0,
        costPerApplication: 0,
        costPerHire: 0,
        currency: 'JPY'
      },
      tracking: {
        utmSource: 'nurse_center',
        utmMedium: 'public_agency'
      },
      kpis: {
        targetApplications: 3,
        targetHires: 1,
        targetConversionRate: 33,
        qualityThreshold: 8
      },
      evaluation: {
        qualityScore: 8,
        speedScore: 5,
        volumeScore: 3,
        costEffectiveness: 10,
        overallRating: 4,
        notes: 'コストゼロで質の高い看護師を確保'
      },
      metadata: {
        createdAt: '2025-01-01T00:00:00',
        createdBy: 'system',
        updatedAt: '2025-01-01T00:00:00',
        updatedBy: 'system'
      }
    }
  ]);

  const [expandedSource, setExpandedSource] = useState<string | null>(null);

  const categoryColors: Record<string, string> = {
    online: 'bg-blue-100 text-blue-800',
    offline: 'bg-gray-100 text-gray-800',
    referral: 'bg-purple-100 text-purple-800',
    agency: 'bg-green-100 text-green-800',
    internal: 'bg-orange-100 text-orange-800',
    other: 'bg-gray-100 text-gray-800'
  };

  const categoryLabels: Record<string, string> = {
    online: 'オンライン',
    offline: 'オフライン',
    referral: '紹介',
    agency: 'エージェント',
    internal: '社内',
    other: 'その他'
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">応募経路マスター</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          新規経路追加
        </button>
      </div>

      {/* KPI サマリー */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">月間目標応募数</p>
                <p className="text-2xl font-bold">
                  {sources.reduce((sum, s) => sum + (s.kpis.targetApplications || 0), 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">月間予算</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(sources.reduce((sum, s) => sum + (s.budget?.monthly || 0), 0))}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">平均転換率</p>
                <p className="text-2xl font-bold">
                  {Math.round(
                    sources.reduce((sum, s) => sum + (s.kpis.targetConversionRate || 0), 0) /
                    sources.length
                  )}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">アクティブ経路</p>
                <p className="text-2xl font-bold">
                  {sources.filter(s => s.isActive).length} / {sources.length}
                </p>
              </div>
              <Globe className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 応募経路リスト */}
      <div className="space-y-4">
        {sources.map((source) => (
          <Card key={source.id} className="overflow-hidden">
            <CardHeader
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedSource(expandedSource === source.id ? null : source.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    source.category === 'online' ? 'bg-blue-100' :
                    source.category === 'referral' ? 'bg-purple-100' :
                    source.category === 'agency' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Globe className={`h-5 w-5 ${
                      source.category === 'online' ? 'text-blue-600' :
                      source.category === 'referral' ? 'text-purple-600' :
                      source.category === 'agency' ? 'text-green-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-lg">{source.name}</h4>
                      <Badge className={categoryColors[source.category]}>
                        {categoryLabels[source.category]}
                      </Badge>
                      {source.subCategory && (
                        <Badge className="bg-gray-100 text-gray-600">
                          {source.subCategory.name}
                        </Badge>
                      )}
                      {source.integration?.autoImport && (
                        <Badge className="bg-green-100 text-green-600">
                          自動連携
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{source.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        {getRatingStars(source.evaluation.overallRating)}
                      </div>
                      <span className="text-xs text-gray-500">
                        コスト: {source.budget?.costPerHire ? formatCurrency(source.budget.costPerHire) : '¥0'}/採用
                      </span>
                      <span className="text-xs text-gray-500">
                        目標: {source.kpis.targetApplications}件/月
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle edit
                    }}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <Edit2 className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle delete
                    }}
                    className="p-2 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                  {expandedSource === source.id ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
            </CardHeader>

            {expandedSource === source.id && (
              <CardContent className="border-t">
                <div className="space-y-4 pt-4">
                  {/* 予算・コスト */}
                  {source.budget && (
                    <div>
                      <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        予算・コスト
                      </h5>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">年間予算:</span>
                            <p className="font-medium">{formatCurrency(source.budget.annual)}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">月間予算:</span>
                            <p className="font-medium">{formatCurrency(source.budget.monthly)}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">応募単価:</span>
                            <p className="font-medium">
                              {source.budget.costPerApplication ? formatCurrency(source.budget.costPerApplication) : '-'}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">採用単価:</span>
                            <p className="font-medium">
                              {source.budget.costPerHire ? formatCurrency(source.budget.costPerHire) : '-'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* KPI・目標 */}
                  <div>
                    <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      KPI・目標
                    </h5>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">目標応募数:</span>
                          <p className="font-medium">{source.kpis.targetApplications}件/月</p>
                        </div>
                        <div>
                          <span className="text-gray-600">目標採用数:</span>
                          <p className="font-medium">{source.kpis.targetHires}名/月</p>
                        </div>
                        <div>
                          <span className="text-gray-600">目標転換率:</span>
                          <p className="font-medium">{source.kpis.targetConversionRate}%</p>
                        </div>
                        <div>
                          <span className="text-gray-600">品質基準:</span>
                          <p className="font-medium">{source.kpis.qualityThreshold}/10</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* トラッキング */}
                  <div>
                    <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Link2 className="h-4 w-4" />
                      トラッキング設定
                    </h5>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <div>
                            <span className="text-gray-600">UTM Source:</span>
                            <span className="ml-2 font-mono">{source.tracking.utmSource}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">UTM Medium:</span>
                            <span className="ml-2 font-mono">{source.tracking.utmMedium}</span>
                          </div>
                          {source.tracking.utmCampaign && (
                            <div>
                              <span className="text-gray-600">UTM Campaign:</span>
                              <span className="ml-2 font-mono">{source.tracking.utmCampaign}</span>
                            </div>
                          )}
                        </div>
                        {source.tracking.customParameters && (
                          <div>
                            <span className="text-gray-600">カスタムパラメータ:</span>
                            <div className="mt-1">
                              {Object.entries(source.tracking.customParameters).map(([key, value]) => (
                                <div key={key} className="font-mono text-xs">
                                  {key}: {value}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 評価スコア */}
                  <div>
                    <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      評価スコア
                    </h5>
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">品質:</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${source.evaluation.qualityScore * 10}%` }}
                                />
                              </div>
                              <span className="font-medium">{source.evaluation.qualityScore}/10</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">スピード:</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-600 h-2 rounded-full"
                                  style={{ width: `${source.evaluation.speedScore * 10}%` }}
                                />
                              </div>
                              <span className="font-medium">{source.evaluation.speedScore}/10</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">ボリューム:</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-purple-600 h-2 rounded-full"
                                  style={{ width: `${source.evaluation.volumeScore * 10}%` }}
                                />
                              </div>
                              <span className="font-medium">{source.evaluation.volumeScore}/10</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">費用対効果:</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-orange-600 h-2 rounded-full"
                                  style={{ width: `${source.evaluation.costEffectiveness * 10}%` }}
                                />
                              </div>
                              <span className="font-medium">{source.evaluation.costEffectiveness}/10</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {source.evaluation.notes && (
                        <div className="mt-3 pt-3 border-t text-sm text-gray-600">
                          <span className="font-medium">メモ:</span> {source.evaluation.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 連携設定 */}
                  {source.integration && (
                    <div>
                      <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Link2 className="h-4 w-4" />
                        連携設定
                      </h5>
                      <div className="bg-purple-50 rounded-lg p-3 text-sm">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-gray-600">連携タイプ:</span>
                            <span className="ml-2 font-medium">{source.integration.type.toUpperCase()}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">自動インポート:</span>
                            <span className="ml-2">
                              {source.integration.autoImport ? '有効' : '無効'}
                            </span>
                          </div>
                        </div>
                        {source.integration.importSchedule && (
                          <div className="mt-2">
                            <span className="text-gray-600">スケジュール:</span>
                            <span className="ml-2 font-mono text-xs">{source.integration.importSchedule}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">応募経路管理のポイント</p>
            <ul className="space-y-1 text-blue-800">
              <li>• 各経路のROIを定期的に評価し、予算配分を最適化しましょう</li>
              <li>• UTMパラメータを正しく設定することで、効果測定が正確になります</li>
              <li>• 自動連携を活用して、応募者情報の管理を効率化できます</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSourceConfig;