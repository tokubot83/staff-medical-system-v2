'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Clock, Save, RotateCcw } from 'lucide-react';

interface DurationConfig {
  duration: number;
  totalQuestions: number;
  sectionDistribution: {
    sectionName: string;
    minQuestions: number;
    maxQuestions: number;
    priority: 'high' | 'medium' | 'low';
  }[];
}

export default function DurationSettings() {
  const [configs, setConfigs] = useState<DurationConfig[]>([
    {
      duration: 15,
      totalQuestions: 8,
      sectionDistribution: [
        { sectionName: '現在の状況', minQuestions: 2, maxQuestions: 3, priority: 'high' },
        { sectionName: '業務内容', minQuestions: 1, maxQuestions: 2, priority: 'medium' },
        { sectionName: '課題・悩み', minQuestions: 2, maxQuestions: 3, priority: 'high' },
        { sectionName: '今後の目標', minQuestions: 1, maxQuestions: 2, priority: 'medium' }
      ]
    },
    {
      duration: 30,
      totalQuestions: 15,
      sectionDistribution: [
        { sectionName: '現在の状況', minQuestions: 3, maxQuestions: 4, priority: 'high' },
        { sectionName: '業務内容', minQuestions: 2, maxQuestions: 3, priority: 'medium' },
        { sectionName: '職場環境', minQuestions: 2, maxQuestions: 3, priority: 'medium' },
        { sectionName: 'スキル・成長', minQuestions: 2, maxQuestions: 3, priority: 'high' },
        { sectionName: '課題・悩み', minQuestions: 2, maxQuestions: 3, priority: 'high' },
        { sectionName: '今後の目標', minQuestions: 2, maxQuestions: 3, priority: 'medium' }
      ]
    },
    {
      duration: 45,
      totalQuestions: 22,
      sectionDistribution: [
        { sectionName: '現在の状況', minQuestions: 3, maxQuestions: 5, priority: 'high' },
        { sectionName: '業務内容', minQuestions: 3, maxQuestions: 4, priority: 'medium' },
        { sectionName: '職場環境', minQuestions: 3, maxQuestions: 4, priority: 'medium' },
        { sectionName: '人間関係', minQuestions: 2, maxQuestions: 3, priority: 'medium' },
        { sectionName: 'スキル・成長', minQuestions: 3, maxQuestions: 4, priority: 'high' },
        { sectionName: 'キャリア開発', minQuestions: 2, maxQuestions: 3, priority: 'medium' },
        { sectionName: '課題・悩み', minQuestions: 3, maxQuestions: 4, priority: 'high' },
        { sectionName: '今後の目標', minQuestions: 2, maxQuestions: 3, priority: 'high' }
      ]
    },
    {
      duration: 60,
      totalQuestions: 30,
      sectionDistribution: [
        { sectionName: '現在の状況', minQuestions: 4, maxQuestions: 6, priority: 'high' },
        { sectionName: '業務内容', minQuestions: 4, maxQuestions: 5, priority: 'high' },
        { sectionName: '職場環境', minQuestions: 3, maxQuestions: 5, priority: 'medium' },
        { sectionName: '人間関係', minQuestions: 3, maxQuestions: 4, priority: 'medium' },
        { sectionName: 'スキル・成長', minQuestions: 4, maxQuestions: 5, priority: 'high' },
        { sectionName: 'キャリア開発', minQuestions: 3, maxQuestions: 4, priority: 'high' },
        { sectionName: 'モチベーション', minQuestions: 2, maxQuestions: 3, priority: 'medium' },
        { sectionName: '課題・悩み', minQuestions: 4, maxQuestions: 5, priority: 'high' },
        { sectionName: '健康・ウェルネス', minQuestions: 2, maxQuestions: 3, priority: 'medium' },
        { sectionName: '今後の目標', minQuestions: 3, maxQuestions: 4, priority: 'high' }
      ]
    }
  ]);

  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  const currentConfig = configs.find(c => c.duration === selectedDuration);

  const handleQuestionCountChange = (duration: number, newTotal: number) => {
    setConfigs(configs.map(config => 
      config.duration === duration 
        ? { ...config, totalQuestions: newTotal }
        : config
    ));
  };

  const handleSectionChange = (
    duration: number,
    sectionName: string,
    field: 'minQuestions' | 'maxQuestions',
    value: number
  ) => {
    setConfigs(configs.map(config => {
      if (config.duration === duration) {
        return {
          ...config,
          sectionDistribution: config.sectionDistribution.map(section =>
            section.sectionName === sectionName
              ? { ...section, [field]: value }
              : section
          )
        };
      }
      return config;
    }));
  };

  const calculateTimePerQuestion = (duration: number, questions: number) => {
    const setupTime = 2; // 面談開始・終了の時間
    const availableTime = duration - setupTime;
    return (availableTime / questions).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* 時間選択タブ */}
      <div className="flex gap-2">
        {[15, 30, 45, 60].map(duration => (
          <Button
            key={duration}
            variant={selectedDuration === duration ? 'default' : 'outline'}
            onClick={() => setSelectedDuration(duration)}
            className="flex-1"
          >
            <Clock className="h-4 w-4 mr-2" />
            {duration}分
          </Button>
        ))}
      </div>

      {currentConfig && (
        <>
          {/* 基本設定 */}
          <Card>
            <CardHeader>
              <CardTitle>{selectedDuration}分面談の設定</CardTitle>
              <CardDescription>
                面談時間に応じた質問数とセクション配分を設定します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>総質問数</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      type="number"
                      value={currentConfig.totalQuestions}
                      onChange={(e) => handleQuestionCountChange(selectedDuration, Number(e.target.value))}
                      min="5"
                      max="50"
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">問</span>
                  </div>
                </div>
                
                <div>
                  <Label>1問あたりの時間</Label>
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-lg">
                      約{calculateTimePerQuestion(selectedDuration, currentConfig.totalQuestions)}分
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <Label>推奨ペース</Label>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-sm">
                      {selectedDuration <= 15 ? 'テンポ良く' :
                       selectedDuration <= 30 ? '標準的' :
                       selectedDuration <= 45 ? 'じっくり' : '深掘り'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <Label>質問数の目安</Label>
                <div className="mt-2">
                  <Slider
                    value={[currentConfig.totalQuestions]}
                    onValueChange={(value) => handleQuestionCountChange(selectedDuration, value[0])}
                    min={5}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>5問（簡潔）</span>
                    <span>25問（標準）</span>
                    <span>50問（詳細）</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* セクション配分 */}
          <Card>
            <CardHeader>
              <CardTitle>セクション配分</CardTitle>
              <CardDescription>
                各セクションの質問数と優先度を設定します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>セクション</TableHead>
                    <TableHead className="w-32">最小質問数</TableHead>
                    <TableHead className="w-32">最大質問数</TableHead>
                    <TableHead className="w-24">優先度</TableHead>
                    <TableHead className="w-32">時間配分</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentConfig.sectionDistribution.map((section) => {
                    const avgQuestions = (section.minQuestions + section.maxQuestions) / 2;
                    const timeAllocation = ((avgQuestions / currentConfig.totalQuestions) * selectedDuration).toFixed(0);
                    
                    return (
                      <TableRow key={section.sectionName}>
                        <TableCell className="font-medium">{section.sectionName}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={section.minQuestions}
                            onChange={(e) => handleSectionChange(
                              selectedDuration,
                              section.sectionName,
                              'minQuestions',
                              Number(e.target.value)
                            )}
                            min="0"
                            max="10"
                            className="w-16 h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={section.maxQuestions}
                            onChange={(e) => handleSectionChange(
                              selectedDuration,
                              section.sectionName,
                              'maxQuestions',
                              Number(e.target.value)
                            )}
                            min="1"
                            max="15"
                            className="w-16 h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            section.priority === 'high' ? 'destructive' :
                            section.priority === 'medium' ? 'default' : 'secondary'
                          }>
                            {section.priority === 'high' ? '高' :
                             section.priority === 'medium' ? '中' : '低'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            約{timeAllocation}分
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* アクションボタン */}
          <div className="flex justify-end gap-2">
            <Button variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              デフォルトに戻す
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              設定を保存
            </Button>
          </div>
        </>
      )}
    </div>
  );
}