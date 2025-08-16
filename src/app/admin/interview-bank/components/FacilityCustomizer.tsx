'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Building,
  Users,
  Settings,
  Save,
  Plus,
  Trash2,
  Copy
} from 'lucide-react';

interface FacilityConfig {
  id: string;
  name: string;
  type: 'acute' | 'chronic' | 'elderly' | 'group-home';
  departments: string[];
  customQuestions: {
    category: string;
    questions: string[];
  }[];
  sectionOverrides: {
    sectionId: string;
    minQuestions?: number;
    maxQuestions?: number;
    isRequired?: boolean;
  }[];
  priorityAdjustments: {
    category: string;
    adjustment: number; // -1, 0, +1
  }[];
}

export default function FacilityCustomizer() {
  const [selectedFacility, setSelectedFacility] = useState<string>('小原病院');
  const [facilities] = useState<FacilityConfig[]>([
    {
      id: '1',
      name: '小原病院',
      type: 'acute',
      departments: ['内科', '外科', '救急科', '緩和ケア病棟'],
      customQuestions: [
        {
          category: 'skills_growth',
          questions: [
            '急性期ケアで最も成長したと感じるスキルは何ですか？',
            '救急対応で困難を感じる場面はありますか？'
          ]
        }
      ],
      sectionOverrides: [
        {
          sectionId: 'workplace_environment',
          minQuestions: 2,
          maxQuestions: 4,
          isRequired: true
        }
      ],
      priorityAdjustments: [
        { category: 'skills_growth', adjustment: 1 },
        { category: 'health_wellness', adjustment: 1 }
      ]
    },
    {
      id: '2',
      name: '立神リハビリテーション温泉病院',
      type: 'chronic',
      departments: ['地域包括ケア病棟', 'リハビリテーション科'],
      customQuestions: [
        {
          category: 'work_content',
          questions: [
            'リハビリテーション支援で最もやりがいを感じる瞬間は？',
            '長期療養患者との関わりで大切にしていることは？'
          ]
        }
      ],
      sectionOverrides: [],
      priorityAdjustments: [
        { category: 'relationships', adjustment: 1 }
      ]
    }
  ]);

  const currentFacility = facilities.find(f => f.name === selectedFacility);

  return (
    <div className="space-y-6">
      {/* 施設選択 */}
      <div className="flex justify-between items-center">
        <Select value={selectedFacility} onValueChange={setSelectedFacility}>
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {facilities.map(facility => (
              <SelectItem key={facility.id} value={facility.name}>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {facility.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            設定をコピー
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            保存
          </Button>
        </div>
      </div>

      {currentFacility && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">概要</TabsTrigger>
            <TabsTrigger value="questions">カスタム質問</TabsTrigger>
            <TabsTrigger value="sections">セクション設定</TabsTrigger>
            <TabsTrigger value="priorities">優先度調整</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>施設情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>施設名</Label>
                    <Input value={currentFacility.name} readOnly />
                  </div>
                  <div>
                    <Label>施設タイプ</Label>
                    <Select value={currentFacility.type} disabled>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="acute">急性期</SelectItem>
                        <SelectItem value="chronic">慢性期</SelectItem>
                        <SelectItem value="elderly">老健</SelectItem>
                        <SelectItem value="group-home">グループホーム</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>部署</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentFacility.departments.map(dept => (
                      <Badge key={dept} variant="secondary">
                        {dept}
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>カスタマイズ状況</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">カスタム質問数</span>
                    <Badge>{currentFacility.customQuestions.reduce((sum, cat) => sum + cat.questions.length, 0)}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">セクション調整数</span>
                    <Badge>{currentFacility.sectionOverrides.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">優先度調整数</span>
                    <Badge>{currentFacility.priorityAdjustments.length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>カスタム質問</CardTitle>
                <CardDescription>
                  この施設専用の質問を追加・管理します
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentFacility.customQuestions.map((category, index) => (
                  <div key={index} className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{category.category}</Badge>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2 ml-4">
                      {category.questions.map((question, qIndex) => (
                        <div key={qIndex} className="flex items-start gap-2">
                          <span className="text-sm text-muted-foreground mt-1">{qIndex + 1}.</span>
                          <p className="text-sm flex-1">{question}</p>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="mt-2">
                        <Plus className="h-3 w-3 mr-1" />
                        質問を追加
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  カテゴリを追加
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sections" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>セクション設定</CardTitle>
                <CardDescription>
                  セクションごとの質問数や必須設定を調整します
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['現在の業務について', '職場環境', 'スキル・成長', 'キャリア開発'].map((section) => (
                    <div key={section} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{section}</h4>
                        <Switch />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label className="text-xs">最小質問数</Label>
                          <Input type="number" min="0" defaultValue="1" className="h-8" />
                        </div>
                        <div>
                          <Label className="text-xs">最大質問数</Label>
                          <Input type="number" min="1" defaultValue="5" className="h-8" />
                        </div>
                        <div className="flex items-end">
                          <label className="flex items-center gap-2">
                            <input type="checkbox" />
                            <span className="text-sm">必須</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="priorities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>優先度調整</CardTitle>
                <CardDescription>
                  カテゴリごとの質問優先度を調整します
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    '現在の状況',
                    '業務内容',
                    '職場環境',
                    '人間関係',
                    'スキル・成長',
                    'キャリア開発',
                    'モチベーション',
                    '課題・悩み',
                    '健康・ウェルネス'
                  ].map((category) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm">{category}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          -
                        </Button>
                        <div className="w-16 text-center">
                          <Badge variant="secondary">標準</Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}