'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Eye, FileText, Download, RefreshCw } from 'lucide-react';
import { InterviewBankService } from '@/lib/interview-bank/services/bank-service';
import { StaffBankProfile, BankGenerationParams } from '@/lib/interview-bank/types';

export default function PreviewMode() {
  const [previewParams, setPreviewParams] = useState<BankGenerationParams>({
    interviewType: 'regular',
    duration: 30,
    focusAreas: []
  });

  const [staffProfile] = useState<StaffBankProfile>({
    id: 'preview-001',
    name: 'プレビュー職員',
    email: 'preview@example.com',
    department: '内科',
    position: '看護師',
    experienceLevel: 'mid',
    experienceYears: 5,
    experienceMonths: 6,
    facility: '小原病院',
    facilityType: 'acute',
    hireDate: new Date('2019-03-01'),
    lastInterviewDate: new Date('2024-01-15'),
    nextScheduledDate: null,
    interviewCount: 3,
    motivationType: 'growth'
  });

  const [generatedSheet, setGeneratedSheet] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const bankService = InterviewBankService.getInstance();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await bankService.generateAndStartInterview(staffProfile, previewParams);
      setGeneratedSheet(result.sheet);
    } catch (error) {
      console.error('Failed to generate preview:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!generatedSheet) return;

    const data = JSON.stringify(generatedSheet, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-sheet-preview-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* プレビュー設定 */}
      <Card>
        <CardHeader>
          <CardTitle>プレビュー条件設定</CardTitle>
          <CardDescription>
            実際の面談生成をシミュレートします
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>面談タイプ</Label>
              <Select
                value={previewParams.interviewType}
                onValueChange={(value: any) => 
                  setPreviewParams({ ...previewParams, interviewType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">定期面談</SelectItem>
                  <SelectItem value="special">特別面談</SelectItem>
                  <SelectItem value="support">サポート面談</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>面談時間</Label>
              <Select
                value={String(previewParams.duration)}
                onValueChange={(value) => 
                  setPreviewParams({ ...previewParams, duration: Number(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15分</SelectItem>
                  <SelectItem value="30">30分</SelectItem>
                  <SelectItem value="45">45分</SelectItem>
                  <SelectItem value="60">60分</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>職員プロファイル（プレビュー用）</Label>
            <div className="mt-2 p-3 bg-muted rounded-lg">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">経験レベル: </span>
                  <Badge variant="secondary">中堅（5年6ヶ月）</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">施設: </span>
                  <span>小原病院（急性期）</span>
                </div>
                <div>
                  <span className="text-muted-foreground">部署: </span>
                  <span>内科</span>
                </div>
                <div>
                  <span className="text-muted-foreground">職種: </span>
                  <span>看護師</span>
                </div>
                <div>
                  <span className="text-muted-foreground">動機タイプ: </span>
                  <Badge variant="outline">成長志向</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">前回面談: </span>
                  <span>2024年1月15日</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setGeneratedSheet(null)}
              disabled={!generatedSheet}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              クリア
            </Button>
            <Button onClick={handleGenerate} disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  生成中...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  プレビュー生成
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* プレビュー結果 */}
      {generatedSheet && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>生成された面談シート</CardTitle>
                <CardDescription>
                  {generatedSheet.sections.length}セクション / 全{
                    generatedSheet.sections.reduce((sum: number, s: any) => sum + s.questions.length, 0)
                  }問
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                エクスポート
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedSheet.sections.map((section: any, sectionIndex: number) => (
                <div key={section.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {section.title}
                    </h3>
                    <Badge variant="outline">{section.questions.length}問</Badge>
                  </div>
                  <div className="space-y-2">
                    {section.questions.map((question: any, qIndex: number) => (
                      <div key={question.id} className="flex items-start gap-2 text-sm">
                        <span className="text-muted-foreground mt-0.5">
                          {sectionIndex + 1}.{qIndex + 1}
                        </span>
                        <div className="flex-1">
                          <p>{question.text}</p>
                          {question.guideText && (
                            <p className="text-xs text-muted-foreground mt-1">
                              ガイド: {question.guideText}
                            </p>
                          )}
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {question.type === 'open' ? '自由記述' :
                               question.type === 'choice' ? '選択式' : 'スケール'}
                            </Badge>
                            {question.isRequired && (
                              <Badge variant="destructive" className="text-xs">必須</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* メタデータ */}
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium mb-2">生成メタデータ</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">生成日時: </span>
                  <span>{new Date(generatedSheet.generatedAt).toLocaleString('ja-JP')}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">推定所要時間: </span>
                  <span>{generatedSheet.estimatedDuration}分</span>
                </div>
                <div>
                  <span className="text-muted-foreground">必須質問数: </span>
                  <span>
                    {generatedSheet.sections.reduce((sum: number, s: any) => 
                      sum + s.questions.filter((q: any) => q.isRequired).length, 0
                    )}問
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">生成パラメータ: </span>
                  <span className="font-mono text-xs">
                    {JSON.stringify(generatedSheet.metadata?.params || {}, null, 2).substring(0, 50)}...
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}