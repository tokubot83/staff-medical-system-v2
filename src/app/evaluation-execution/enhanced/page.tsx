'use client';

import React, { useState } from 'react';
import CommonHeader from '@/components/CommonHeader';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Users,
  PlayCircle,
  Eye,
  FileText,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import V3ValidationGuard from '@/components/evaluation/V3ValidationGuard';
import PersonalEvaluationPrecheckDialog from '@/components/evaluation/PersonalEvaluationPrecheckDialog';

// サンプル職員データ
const staffList = [
  {
    id: '1',
    name: '山田 花子',
    department: '内科病棟',
    jobCategory: '看護師',
    experienceYears: 3,
    experienceLevel: 'junior',
    facilityType: 'acute',
    evaluationStatus: 'not-started'
  },
  {
    id: '2',
    name: '佐藤 太郎',
    department: '外科病棟',
    jobCategory: '看護師',
    experienceYears: 1,
    experienceLevel: 'new',
    facilityType: 'acute',
    evaluationStatus: 'not-started'
  },
  {
    id: '3',
    name: '鈴木 美咲',
    department: 'ICU',
    jobCategory: '看護師',
    experienceYears: 8,
    experienceLevel: 'midlevel',
    facilityType: 'acute',
    evaluationStatus: 'in-progress'
  }
];

export default function EnhancedEvaluationExecutionPage() {
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [isPrecheckDialogOpen, setIsPrecheckDialogOpen] = useState(false);
  const [isSystemValid, setIsSystemValid] = useState(false);

  // 評価開始ボタンクリック処理
  const handleStartEvaluation = (staffId: string) => {
    setSelectedStaff(staffId);
    setIsPrecheckDialogOpen(true);
  };

  // 前提条件チェック後の確認処理
  const handleConfirmEvaluation = () => {
    setIsPrecheckDialogOpen(false);
    // 実際の評価画面に遷移
    console.log('評価開始:', selectedStaff);
    alert(`${staffList.find(s => s.id === selectedStaff)?.name} の評価を開始します`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">評価完了</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">評価中</Badge>;
      case 'not-started':
        return <Badge className="bg-gray-100 text-gray-800">未着手</Badge>;
      default:
        return <Badge>-</Badge>;
    }
  };

  return (
    <div>
      <CommonHeader title="個人評価実行（V3連携強化版）" />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* V3システム検証ガード */}
        <V3ValidationGuard
          facilityType="acute"
          showValidationDetails={true}
          onValidationComplete={setIsSystemValid}
        >
          <div className="space-y-6">
            {/* ヘッダー情報 */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">個人評価実行</h1>
                <p className="text-gray-600">V3評価システム連携版 - 制度設計完了後のみ実行可能</p>
              </div>
              <div className="flex gap-2">
                <Link href="/evaluation-design">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    制度設計確認
                  </Button>
                </Link>
                <Link href="/evaluation-design/timeline">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    年間スケジュール
                  </Button>
                </Link>
              </div>
            </div>

            {/* システム有効時のメッセージ */}
            {isSystemValid && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">
                      V3評価システム準備完了 - 個人評価を実行できます
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 職員一覧 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {staffList.map((staff) => (
                <Card key={staff.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-lg">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {staff.name}
                      </div>
                      {getStatusBadge(staff.evaluationStatus)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">部署:</span>
                        <span className="font-medium">{staff.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">職種:</span>
                        <span className="font-medium">{staff.jobCategory}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">経験年数:</span>
                        <span className="font-medium">{staff.experienceYears}年</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">レベル:</span>
                        <span className="font-medium">{staff.experienceLevel}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      {staff.evaluationStatus === 'not-started' ? (
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleStartEvaluation(staff.id)}
                          disabled={!isSystemValid}
                        >
                          <PlayCircle className="h-4 w-4 mr-2" />
                          評価開始
                        </Button>
                      ) : staff.evaluationStatus === 'in-progress' ? (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          disabled={!isSystemValid}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          評価継続
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="w-full"
                          disabled
                        >
                          評価完了済み
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </V3ValidationGuard>

        {/* 前提条件チェックダイアログ */}
        <PersonalEvaluationPrecheckDialog
          isOpen={isPrecheckDialogOpen}
          onClose={() => setIsPrecheckDialogOpen(false)}
          staffId={selectedStaff || ''}
          staffName={staffList.find(s => s.id === selectedStaff)?.name || ''}
          onConfirm={handleConfirmEvaluation}
        />
      </div>
    </div>
  );
}