'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Calendar,
  Users,
  Building,
  Award,
  TrendingUp,
  Save,
  AlertCircle,
  CheckCircle2,
  FileText,
  UserCheck
} from 'lucide-react';
import { evaluationBatchService } from '@/services/evaluationBatchService';

interface ContributionScores {
  committees: number;
  training: number;
  improvements: number;
  mentoring: number;
  overtime: number;
}

interface CorporateScores {
  events: number;
  crossFacilitySupport: number;
  projects: number;
  recruitment: number;
  publicity: number;
}

export default function ContributionAssessmentPage() {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedTerm, setSelectedTerm] = useState<'summer' | 'winter'>('winter');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // 施設貢献スコア
  const [facilityScores, setFacilityScores] = useState<ContributionScores>({
    committees: 0,
    training: 0,
    improvements: 0,
    mentoring: 0,
    overtime: 0
  });
  
  // 法人貢献スコア
  const [corporateScores, setCorporateScores] = useState<CorporateScores>({
    events: 0,
    crossFacilitySupport: 0,
    projects: 0,
    recruitment: 0,
    publicity: 0
  });

  // 小計の計算
  const facilitySubtotal = Object.values(facilityScores).reduce((sum, score) => sum + score, 0);
  const corporateSubtotal = Object.values(corporateScores).reduce((sum, score) => sum + score, 0);
  const totalScore = facilitySubtotal + corporateSubtotal;

  // 保存処理
  const handleSave = async () => {
    if (!selectedStaff) {
      alert('職員を選択してください');
      return;
    }
    
    setIsSaving(true);
    try {
      await evaluationBatchService.inputContributionAssessment(
        selectedStaff,
        selectedYear,
        selectedTerm,
        facilityScores,
        corporateScores
      );
      alert('保存しました');
    } catch (error) {
      console.error('Save failed:', error);
      alert('保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  // スコア更新
  const updateFacilityScore = (key: keyof ContributionScores, value: string) => {
    const numValue = parseInt(value) || 0;
    setFacilityScores(prev => ({ ...prev, [key]: numValue }));
  };

  const updateCorporateScore = (key: keyof CorporateScores, value: string) => {
    const numValue = parseInt(value) || 0;
    setCorporateScores(prev => ({ ...prev, [key]: numValue }));
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">組織貢献度査定入力</h1>
        <p className="text-gray-600">賞与時期（5月・11月）に合わせた半期ごとの貢献度評価</p>
      </div>

      {/* 期間選択 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            査定期間選択
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>査定年度</Label>
              <select 
                className="w-full px-3 py-2 border rounded-md"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                <option value={2024}>2024年度</option>
                <option value={2023}>2023年度</option>
              </select>
            </div>
            
            <div>
              <Label>査定時期</Label>
              <select 
                className="w-full px-3 py-2 border rounded-md"
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value as 'summer' | 'winter')}
              >
                <option value="summer">8月賞与時（12月～5月実績）</option>
                <option value="winter">12月賞与時（6月～11月実績）</option>
              </select>
            </div>
            
            <div>
              <Label>対象職員</Label>
              <Input 
                placeholder="職員番号または氏名"
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* スコアサマリー */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">施設貢献度</p>
                <p className="text-2xl font-bold text-blue-600">{facilitySubtotal}点</p>
              </div>
              <Building className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">法人貢献度</p>
                <p className="text-2xl font-bold text-green-600">{corporateSubtotal}点</p>
              </div>
              <Users className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">合計点数</p>
                <p className="text-2xl font-bold">{totalScore}点</p>
              </div>
              <Award className="h-8 w-8 text-purple-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 評価入力タブ */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="facility" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="facility">
                施設貢献度評価（{facilitySubtotal}点）
              </TabsTrigger>
              <TabsTrigger value="corporate">
                法人貢献度評価（{corporateSubtotal}点）
              </TabsTrigger>
            </TabsList>

            {/* 施設貢献度タブ */}
            <TabsContent value="facility" className="mt-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="committees" className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4" />
                      委員会活動
                    </Label>
                    <Input
                      id="committees"
                      type="number"
                      min="0"
                      max="10"
                      value={facilityScores.committees}
                      onChange={(e) => updateFacilityScore('committees', e.target.value)}
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      感染対策、医療安全、褥瘡対策など（0-10点）
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="training" className="flex items-center gap-2 mb-2">
                      <UserCheck className="h-4 w-4" />
                      研修参加・講師
                    </Label>
                    <Input
                      id="training"
                      type="number"
                      min="0"
                      max="10"
                      value={facilityScores.training}
                      onChange={(e) => updateFacilityScore('training', e.target.value)}
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      院内研修参加、講師担当など（0-10点）
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="improvements" className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4" />
                      改善提案・QC活動
                    </Label>
                    <Input
                      id="improvements"
                      type="number"
                      min="0"
                      max="10"
                      value={facilityScores.improvements}
                      onChange={(e) => updateFacilityScore('improvements', e.target.value)}
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      業務改善提案、QCサークル活動など（0-10点）
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="mentoring" className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4" />
                      新人指導・プリセプター
                    </Label>
                    <Input
                      id="mentoring"
                      type="number"
                      min="0"
                      max="10"
                      value={facilityScores.mentoring}
                      onChange={(e) => updateFacilityScore('mentoring', e.target.value)}
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      新人教育、プリセプター担当など（0-10点）
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="overtime" className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4" />
                      時間外協力
                    </Label>
                    <Input
                      id="overtime"
                      type="number"
                      min="0"
                      max="10"
                      value={facilityScores.overtime}
                      onChange={(e) => updateFacilityScore('overtime', e.target.value)}
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      残業協力、休日出勤対応など（0-10点）
                    </p>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    各項目は0-10点で評価してください。実績に基づいて客観的に評価します。
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            {/* 法人貢献度タブ */}
            <TabsContent value="corporate" className="mt-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="events" className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4" />
                      法人行事参加
                    </Label>
                    <Input
                      id="events"
                      type="number"
                      min="0"
                      max="10"
                      value={corporateScores.events}
                      onChange={(e) => updateCorporateScore('events', e.target.value)}
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      創立記念式典、法人研修など（0-10点）
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="crossFacilitySupport" className="flex items-center gap-2 mb-2">
                      <Building className="h-4 w-4" />
                      他施設応援
                    </Label>
                    <Input
                      id="crossFacilitySupport"
                      type="number"
                      min="0"
                      max="15"
                      value={corporateScores.crossFacilitySupport}
                      onChange={(e) => updateCorporateScore('crossFacilitySupport', e.target.value)}
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      他施設への応援勤務など（0-15点）
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="projects" className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4" />
                      法人プロジェクト参加
                    </Label>
                    <Input
                      id="projects"
                      type="number"
                      min="0"
                      max="15"
                      value={corporateScores.projects}
                      onChange={(e) => updateCorporateScore('projects', e.target.value)}
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      DX推進、業務標準化など（0-15点）
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="recruitment" className="flex items-center gap-2 mb-2">
                      <UserCheck className="h-4 w-4" />
                      採用活動協力
                    </Label>
                    <Input
                      id="recruitment"
                      type="number"
                      min="0"
                      max="10"
                      value={corporateScores.recruitment}
                      onChange={(e) => updateCorporateScore('recruitment', e.target.value)}
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      学校訪問、採用面接など（0-10点）
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="publicity" className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4" />
                      広報活動協力
                    </Label>
                    <Input
                      id="publicity"
                      type="number"
                      min="0"
                      max="10"
                      value={corporateScores.publicity}
                      onChange={(e) => updateCorporateScore('publicity', e.target.value)}
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      広報誌寄稿、SNS発信など（0-10点）
                    </p>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    法人全体への貢献度を評価します。他施設応援とプロジェクト参加は最大15点です。
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>

          {/* 保存ボタン */}
          <div className="mt-6 flex justify-end gap-4">
            <Button variant="outline">
              キャンセル
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving || !selectedStaff}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <>処理中...</>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  保存
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 年間集計の説明 */}
      <Alert className="mt-6">
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>年間評価スケジュール</AlertTitle>
        <AlertDescription className="mt-2 space-y-1">
          <p>1. <strong>8月賞与時</strong>：12月～5月の実績を基に施設・法人貢献度を査定</p>
          <p>2. <strong>12月賞与時</strong>：6月～11月の実績を基に施設・法人貢献度を査定</p>
          <p>3. <strong>3月（年度末）</strong>：技術評価（4月～3月の年間評価）を実施</p>
          <p>4. <strong>3月末</strong>：全評価を統合し最終計算</p>
          <p>   技術評価50点 + 施設貢献25点（相対評価） + 法人貢献25点（相対評価） = 100点満点</p>
        </AlertDescription>
      </Alert>
    </div>
  );
}