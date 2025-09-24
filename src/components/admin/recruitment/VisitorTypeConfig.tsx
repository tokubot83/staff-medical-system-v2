'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Eye,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Users,
  Clock,
  FileCheck,
  ArrowRight,
  Settings,
  ChevronDown,
  ChevronRight,
  Building,
  UserPlus
} from 'lucide-react';
import { VisitorTypeDefinition } from '@/types/recruitmentMaster';

const VisitorTypeConfig: React.FC = () => {
  const [visitorTypes, setVisitorTypes] = useState<VisitorTypeDefinition[]>([
    {
      id: '1',
      code: 'student_visit',
      name: '学生見学',
      category: 'student',
      description: '看護学生・医療系学生の施設見学',
      color: 'blue',
      icon: 'GraduationCap',
      order: 1,
      isActive: true,
      settings: {
        requiresAppointment: true,
        maxGroupSize: 10,
        defaultDuration: 120,
        availableFacilities: ['小原病院', '小原デイサービス'],
        availableTimeSlots: [
          { dayOfWeek: 2, startTime: '10:00', endTime: '12:00' },
          { dayOfWeek: 4, startTime: '14:00', endTime: '16:00' }
        ]
      },
      requiredInfo: {
        fields: ['name', 'school', 'grade', 'contact'],
        documents: ['学生証'],
        consent: true,
        consentTemplate: 'student_consent'
      },
      conversion: {
        canConvertToApplicant: true,
        conversionFields: ['name', 'school', 'contact'],
        additionalFields: ['graduation_date', 'desired_position']
      },
      followUp: {
        enabled: true,
        daysAfter: [3, 30],
        template: 'student_followup',
        autoConvertAfterDays: 90
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
      code: 'career_change',
      name: '転職希望者見学',
      category: 'career_change',
      description: '中途採用を検討している方の施設見学',
      color: 'green',
      icon: 'Briefcase',
      order: 2,
      isActive: true,
      settings: {
        requiresAppointment: true,
        maxGroupSize: 3,
        defaultDuration: 90,
        availableFacilities: ['小原病院', '小原クリニック'],
        availableTimeSlots: [
          { dayOfWeek: 1, startTime: '16:00', endTime: '18:00' },
          { dayOfWeek: 3, startTime: '16:00', endTime: '18:00' },
          { dayOfWeek: 5, startTime: '16:00', endTime: '18:00' }
        ]
      },
      requiredInfo: {
        fields: ['name', 'current_employer', 'experience_years', 'contact'],
        documents: [],
        consent: false
      },
      conversion: {
        canConvertToApplicant: true,
        conversionFields: ['name', 'contact', 'experience_years'],
        additionalFields: ['resume', 'desired_salary']
      },
      followUp: {
        enabled: true,
        daysAfter: [1, 7],
        template: 'career_followup'
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
      code: 'referral_visit',
      name: 'リファラル見学',
      category: 'referral',
      description: '職員紹介による見学',
      color: 'purple',
      icon: 'UserCheck',
      order: 3,
      isActive: true,
      settings: {
        requiresAppointment: false,
        maxGroupSize: 2,
        defaultDuration: 60,
        availableFacilities: ['小原病院'],
        availableTimeSlots: [
          { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' }
        ]
      },
      requiredInfo: {
        fields: ['name', 'referrer', 'contact'],
        documents: [],
        consent: false
      },
      conversion: {
        canConvertToApplicant: true,
        conversionFields: ['name', 'referrer', 'contact']
      },
      followUp: {
        enabled: true,
        daysAfter: [1],
        template: 'referral_followup'
      },
      metadata: {
        createdAt: '2025-01-01T00:00:00',
        createdBy: 'system',
        updatedAt: '2025-01-01T00:00:00',
        updatedBy: 'system'
      }
    }
  ]);

  const [expandedType, setExpandedType] = useState<string | null>(null);

  const categoryColors: Record<string, string> = {
    student: 'bg-blue-100 text-blue-800',
    career_change: 'bg-green-100 text-green-800',
    referral: 'bg-purple-100 text-purple-800',
    walk_in: 'bg-orange-100 text-orange-800',
    other: 'bg-gray-100 text-gray-800'
  };

  const categoryLabels: Record<string, string> = {
    student: '学生',
    career_change: '転職',
    referral: 'リファラル',
    walk_in: 'ウォークイン',
    other: 'その他'
  };

  const dayOfWeekLabels = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">見学者タイプ設定</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          新規タイプ追加
        </button>
      </div>

      <div className="space-y-4">
        {visitorTypes.map((type) => (
          <Card key={type.id} className="overflow-hidden">
            <CardHeader
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedType(expandedType === type.id ? null : type.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${type.color}-100`}>
                    <Eye className={`h-5 w-5 text-${type.color}-600`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-lg">{type.name}</h4>
                      <Badge className={categoryColors[type.category]}>
                        {categoryLabels[type.category]}
                      </Badge>
                      {type.settings.requiresAppointment && (
                        <Badge className="bg-orange-100 text-orange-600">
                          要予約
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        最大{type.settings.maxGroupSize}名
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {type.settings.defaultDuration}分
                      </span>
                      <span className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {type.settings.availableFacilities.length}施設
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
                  {expandedType === type.id ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
            </CardHeader>

            {expandedType === type.id && (
              <CardContent className="border-t">
                <div className="space-y-4 pt-4">
                  {/* 見学設定 */}
                  <div>
                    <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      見学設定
                    </h5>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">利用可能施設:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {type.settings.availableFacilities.map((facility) => (
                              <Badge key={facility} className="bg-white border">
                                {facility}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">利用可能時間帯:</span>
                          <div className="space-y-1 mt-1">
                            {type.settings.availableTimeSlots.map((slot, idx) => (
                              <div key={idx} className="text-xs">
                                {dayOfWeekLabels[slot.dayOfWeek]}曜日: {slot.startTime} - {slot.endTime}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 必要情報 */}
                  <div>
                    <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <FileCheck className="h-4 w-4" />
                      必要情報
                    </h5>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                      <div className="text-sm">
                        <span className="text-gray-600">必須フィールド:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {type.requiredInfo.fields.map((field) => (
                            <Badge key={field} className="bg-blue-50 text-blue-700">
                              {field}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {type.requiredInfo.documents.length > 0 && (
                        <div className="text-sm">
                          <span className="text-gray-600">必要書類:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {type.requiredInfo.documents.map((doc) => (
                              <Badge key={doc} className="bg-orange-50 text-orange-700">
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {type.requiredInfo.consent && (
                        <div className="text-sm text-orange-600">
                          ✓ 同意書が必要 ({type.requiredInfo.consentTemplate})
                        </div>
                      )}
                    </div>
                  </div>

                  {/* コンバージョン設定 */}
                  {type.conversion.canConvertToApplicant && (
                    <div>
                      <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        応募者への変換設定
                      </h5>
                      <div className="bg-green-50 rounded-lg p-3 space-y-2">
                        <div className="text-sm text-green-800">
                          ✓ 応募者への変換が可能
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">引き継ぎフィールド:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {type.conversion.conversionFields.map((field) => (
                              <Badge key={field} className="bg-white text-green-700 border-green-300">
                                {field}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {type.conversion.additionalFields && (
                          <div className="text-sm">
                            <span className="text-gray-600">追加必要フィールド:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {type.conversion.additionalFields.map((field) => (
                                <Badge key={field} className="bg-yellow-50 text-yellow-700">
                                  {field}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* フォローアップ設定 */}
                  {type.followUp.enabled && (
                    <div>
                      <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        フォローアップ設定
                      </h5>
                      <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                        <div className="text-sm">
                          <span className="text-gray-700">フォローアップ日:</span>
                          <span className="ml-2">
                            見学後 {type.followUp.daysAfter.join(', ')} 日
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-700">テンプレート:</span>
                          <span className="ml-2">{type.followUp.template}</span>
                        </div>
                        {type.followUp.autoConvertAfterDays && (
                          <div className="text-sm text-blue-700">
                            {type.followUp.autoConvertAfterDays}日後に自動的に応募者へ変換
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

      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <div className="flex items-start gap-2">
          <Eye className="h-5 w-5 text-green-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-green-900 mb-1">見学者管理のポイント</p>
            <ul className="space-y-1 text-green-800">
              <li>• 見学者タイプごとに異なる対応フローを設定できます</li>
              <li>• フォローアップを自動化して、応募への転換率を向上させましょう</li>
              <li>• 必要書類や同意書の設定で、コンプライアンスを確保できます</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorTypeConfig;