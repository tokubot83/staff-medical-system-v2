'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, Clock, Users, Brain, Sparkles, 
  ChevronRight, AlertCircle, CheckCircle2 
} from 'lucide-react';
import {
  ProfessionType,
  ExperienceLevel,
  InterviewDuration,
  ProfessionLabels,
  ExperienceLevelLabels,
  getExperienceLevel
} from './shared/types';
import { generateInterviewSheet } from './generator/sheet-generator';
import dynamic from 'next/dynamic';

// 動的インポート
const NewNurse30MinInterviewSheet = dynamic(() => import('./nurse/new-nurse-30min'), { ssr: false });

interface V6SheetSelectorProps {
  onSelectSheet?: (sheet: any) => void;
  onStartInterview?: (params: any) => void;
}

export default function V6SheetSelector({ onSelectSheet, onStartInterview }: V6SheetSelectorProps) {
  const [selectedProfession, setSelectedProfession] = useState<ProfessionType>('nurse');
  const [experienceYears, setExperienceYears] = useState<number>(1);
  const [isLeader, setIsLeader] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<InterviewDuration>(30);
  const [includeMotivation, setIncludeMotivation] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [generatedSheet, setGeneratedSheet] = useState<any>(null);

  const experienceLevel = getExperienceLevel(experienceYears, isLeader, isManager);

  // 職種別の推奨設定
  const getRecommendations = () => {
    const recommendations = [];
    
    if (experienceYears <= 1) {
      recommendations.push({
        icon: <Brain className="h-4 w-4" />,
        text: '新人には動機タイプ診断を推奨',
        type: 'info'
      });
    }
    
    if (experienceYears <= 3 && selectedDuration === 15) {
      recommendations.push({
        icon: <Clock className="h-4 w-4" />,
        text: '若手職員には30分以上を推奨',
        type: 'warning'
      });
    }
    
    if ((isLeader || isManager) && selectedDuration < 30) {
      recommendations.push({
        icon: <Users className="h-4 w-4" />,
        text: '管理職には30分以上を推奨',
        type: 'warning'
      });
    }
    
    return recommendations;
  };

  // 面談シート生成
  const handleGenerateSheet = () => {
    const sheet = generateInterviewSheet({
      professionType: selectedProfession,
      experienceYears,
      isLeader,
      isManager,
      duration: selectedDuration,
      includeMotivationDiagnosis: includeMotivation
    });
    
    setGeneratedSheet(sheet);
    setShowPreview(true);
    
    if (onSelectSheet) {
      onSelectSheet(sheet);
    }
  };

  // 面談開始
  const handleStartInterview = () => {
    const params = {
      sheet: generatedSheet,
      professionType: selectedProfession,
      experienceLevel,
      duration: selectedDuration,
      includeMotivation
    };
    
    if (onStartInterview) {
      onStartInterview(params);
    }
  };

  const recommendations = getRecommendations();

  return (
    <div className="space-y-6">
      {/* 設定パネル */}
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            v6 面談シート生成システム
            <Badge variant="secondary" className="ml-2">統一版</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* 基本設定 */}
          <div className="grid grid-cols-2 gap-6">
            {/* 職種選択 */}
            <div className="space-y-2">
              <Label>職種</Label>
              <Select value={selectedProfession} onValueChange={(value) => setSelectedProfession(value as ProfessionType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ProfessionLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 経験年数 */}
            <div className="space-y-2">
              <Label>経験年数</Label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Math.max(0, parseInt(e.target.value) || 0))}
                  className="flex-1 p-2 border rounded"
                  min="0"
                  max="50"
                />
                <span className="text-sm text-gray-600">年</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline">
                  {ExperienceLevelLabels[experienceLevel]}
                </Badge>
              </div>
            </div>

            {/* 役職 */}
            <div className="space-y-2">
              <Label>役職</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isLeader}
                    onChange={(e) => {
                      setIsLeader(e.target.checked);
                      if (e.target.checked) setIsManager(false);
                    }}
                  />
                  <span>主任・リーダー</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isManager}
                    onChange={(e) => {
                      setIsManager(e.target.checked);
                      if (e.target.checked) setIsLeader(false);
                    }}
                  />
                  <span>師長・管理職</span>
                </label>
              </div>
            </div>

            {/* 面談時間 */}
            <div className="space-y-2">
              <Label>面談時間</Label>
              <div className="flex gap-2">
                {[15, 30, 45].map((duration) => (
                  <Button
                    key={duration}
                    variant={selectedDuration === duration ? 'default' : 'outline'}
                    onClick={() => setSelectedDuration(duration as InterviewDuration)}
                    className="flex-1"
                  >
                    {duration}分
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* オプション */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeMotivation}
                    onChange={(e) => setIncludeMotivation(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="font-medium">動機タイプ診断を含める</span>
                </label>
                {includeMotivation && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Brain className="h-3 w-3" />
                    {selectedDuration === 15 ? '簡易3問' : '詳細5問'}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* 推奨事項 */}
          {recommendations.length > 0 && (
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <Alert key={index} className={rec.type === 'warning' ? 'border-orange-200 bg-orange-50' : ''}>
                  <div className="flex items-center gap-2">
                    {rec.icon}
                    <AlertDescription>{rec.text}</AlertDescription>
                  </div>
                </Alert>
              ))}
            </div>
          )}

          {/* アクションボタン */}
          <div className="flex gap-3">
            <Button
              onClick={handleGenerateSheet}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              面談シート生成
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* プレビューパネル */}
      {showPreview && generatedSheet && (
        <Card className="border-2 border-green-200">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                生成完了
              </CardTitle>
              <Button
                onClick={handleStartInterview}
                className="bg-green-600 hover:bg-green-700"
              >
                <ChevronRight className="h-4 w-4 mr-1" />
                この設定で面談開始
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">{generatedSheet.title}</h3>
                <p className="text-sm text-gray-600">{generatedSheet.description}</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">セクション構成</h4>
                {generatedSheet.sections.map((section: any, index: number) => (
                  <div key={section.id} className="flex items-center justify-between p-2 bg-white border rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{index + 1}.</span>
                      <span className="text-sm">{section.title}</span>
                      {section.isMotivationDiagnosis && (
                        <Badge variant="secondary" className="text-xs">
                          <Brain className="h-3 w-3 mr-1" />
                          動機診断
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{section.timeAllocation}分</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">合計時間</span>
                <span className="font-semibold">{generatedSheet.totalDuration}分</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* デモ表示（新人看護師30分版のみ） */}
      {showPreview && selectedProfession === 'nurse' && experienceYears <= 1 && selectedDuration === 30 && (
        <div className="mt-8">
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              以下は新人看護師30分版のインタラクティブなプレビューです
            </AlertDescription>
          </Alert>
          <NewNurse30MinInterviewSheet />
        </div>
      )}
    </div>
  );
}