import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from 'lucide-react';

interface FacilityProgress {
  facilityId: string;
  facilityName: string;
  totalStaff: number;
  status: 'active' | 'planned' | 'inactive';
  summerFollowup: {
    appealsReceived: number;
    appealsProcessed: number;
    appealsResolved: number;
    voiceDriveNotified: number;
  };
  winterDisclosure: {
    evaluationsCompleted: number;
    disclosuresScheduled: number;
    disclosuresCompleted: number;
    feedbackMeetingsScheduled: number;
    feedbackMeetingsCompleted: number;
  };
  finalEvaluation: {
    technicalEvaluationsCompleted: number;
    disclosuresCompleted: number;
    finalAppealsReceived: number;
    finalAppealsResolved: number;
    yearEndProcessCompleted: boolean;
  };
}

interface FacilityProgressCardProps {
  type: 'summer' | 'winter' | 'final';
  facilityProgressData: FacilityProgress[];
}

export default function FacilityProgressCard({ type, facilityProgressData }: FacilityProgressCardProps) {
  const getProgressData = (facility: FacilityProgress) => {
    switch (type) {
      case 'summer':
        return {
          title: '異議申立状況',
          items: [
            { label: '受付件数', value: facility.summerFollowup.appealsReceived, total: facility.totalStaff, color: 'text-orange-600' },
            { label: '処理済み', value: facility.summerFollowup.appealsProcessed, total: facility.summerFollowup.appealsReceived, color: 'text-blue-600' },
            { label: '解決済み', value: facility.summerFollowup.appealsResolved, total: facility.summerFollowup.appealsReceived, color: 'text-green-600' },
            { label: 'VD通知', value: facility.summerFollowup.voiceDriveNotified, total: facility.summerFollowup.appealsReceived, color: 'text-purple-600' }
          ]
        };
      case 'winter':
        return {
          title: '冬季評価開示状況',
          items: [
            { label: '評価完了', value: facility.winterDisclosure.evaluationsCompleted, total: facility.totalStaff, color: 'text-blue-600' },
            { label: '開示済み', value: facility.winterDisclosure.disclosuresCompleted, total: facility.totalStaff, color: 'text-green-600' },
            { label: '面談予定', value: facility.winterDisclosure.feedbackMeetingsScheduled, total: facility.totalStaff, color: 'text-orange-600' },
            { label: '面談完了', value: facility.winterDisclosure.feedbackMeetingsCompleted, total: facility.winterDisclosure.feedbackMeetingsScheduled, color: 'text-purple-600' }
          ]
        };
      case 'final':
        return {
          title: '最終評価状況',
          items: [
            { label: '技術評価', value: facility.finalEvaluation.technicalEvaluationsCompleted, total: facility.totalStaff, color: 'text-purple-600' },
            { label: '開示完了', value: facility.finalEvaluation.disclosuresCompleted, total: facility.totalStaff, color: 'text-green-600' },
            { label: '最終異議', value: facility.finalEvaluation.finalAppealsReceived, total: facility.totalStaff, color: 'text-red-600' },
            { label: '年度完了', value: facility.finalEvaluation.yearEndProcessCompleted ? 1 : 0, total: 1, color: 'text-indigo-600' }
          ]
        };
    }
  };

  const activeFacilities = facilityProgressData.filter(f => f.status === 'active');
  const plannedFacilities = facilityProgressData.filter(f => f.status === 'planned');

  return (
    <Card className="border-dashed border-gray-300">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5" />
          施設別{getProgressData(facilityProgressData[0]).title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeFacilities.map((facility) => {
            const progressData = getProgressData(facility);
            return (
              <div key={facility.facilityId} className="border rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{facility.facilityName}</h4>
                  <Badge variant="outline" className="text-xs">
                    {facility.totalStaff}名
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {progressData.items.map((item, idx) => {
                    const percentage = item.total > 0 ? Math.round((item.value / item.total) * 100) : 0;
                    return (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item.label}</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${item.color}`}>
                            {item.value}
                            {item.total > 1 && `/${item.total}`}
                          </span>
                          {item.total > 1 && (
                            <div className="w-12 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  percentage >= 80 ? 'bg-green-500' :
                                  percentage >= 60 ? 'bg-yellow-500' :
                                  percentage >= 40 ? 'bg-orange-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              />
                            </div>
                          )}
                          <span className="text-xs text-gray-500 w-10 text-right">
                            {item.total > 1 ? `${percentage}%` : item.value ? '✓' : '-'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          
          {plannedFacilities.length > 0 && (
            <div className="border-t pt-4">
              <h5 className="text-sm font-medium text-gray-600 mb-2">導入予定施設</h5>
              {plannedFacilities.map((facility) => (
                <div key={facility.facilityId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{facility.facilityName}</span>
                  <Badge variant="secondary" className="text-xs">
                    {facility.totalStaff}名・準備中
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}