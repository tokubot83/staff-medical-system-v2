/**
 * 評価設計支援コンポーネント
 * 評価シートの体系的設計知見を活用した項目バンク管理と設計支援機能
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Settings, Lightbulb, CheckCircle2, AlertTriangle, Target, Users,
  Building, Calculator, Zap, FileCheck, BarChart3, Star
} from 'lucide-react';

// 型定義のインポート
import { EvaluationItem, experienceLevels, roles, facilityTypes } from '@/data/evaluationItemBank';

interface EvaluationDesignConfig {
  facilityType: string;
  role: string;
  experienceLevel: string;
  corporateItems: EvaluationItem[];
  facilityItems: EvaluationItem[];
  totalPoints: number;
}

interface BalanceValidation {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
  score: number;
}

interface EvaluationDesignSupportProps {
  onConfigChange?: (config: EvaluationDesignConfig) => void;
}

export default function EvaluationDesignSupport({ onConfigChange }: EvaluationDesignSupportProps) {
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [currentConfig, setCurrentConfig] = useState<EvaluationDesignConfig | null>(null);
  const [balanceValidation, setBalanceValidation] = useState<BalanceValidation | null>(null);

  // 評価シートから抽出した推奨項目マトリックス
  const getRecommendedItems = (facility: string, role: string, level: string): EvaluationItem[] => {
    const recommendedItems: EvaluationItem[] = [];
    
    // 経験レベル別推奨項目（評価シートの知見から）
    const experienceBasedItems: Record<string, EvaluationItem[]> = {
      new: [
        {
          id: 'NEW_001',
          name: '基本技術習得',
          description: '職務遂行に必要な基本的な技術・スキル',
          category: 'facility',
          type: 'required',
          points: 8,
          evaluationCriteria: [
            '基本的な看護技術を安全に実施できる',
            '指導のもとで標準的な手順を実践できる',
            '不明な点を適切に質問・相談できる'
          ],
          targetRoles: [role],
          targetLevels: ['new']
        },
        {
          id: 'NEW_002', 
          name: '安全確認の習慣化',
          description: '医療安全の基本的な確認行動の習得',
          category: 'facility',
          type: 'required',
          points: 6,
          evaluationCriteria: [
            '指差確認・声出し確認を実践している',
            'インシデント予防策を理解している',
            '報連相を適切に行える'
          ],
          targetRoles: [role],
          targetLevels: ['new']
        }
      ],
      junior: [
        {
          id: 'JUN_001',
          name: '応用技術の実践',
          description: '標準的な看護技術の独立実践と応用',
          category: 'facility', 
          type: 'required',
          points: 8,
          evaluationCriteria: [
            '標準的な看護技術を独立して実施できる',
            '状況に応じた技術の応用ができる',
            '効率的な業務遂行ができる'
          ],
          targetRoles: [role],
          targetLevels: ['junior']
        },
        {
          id: 'JUN_002',
          name: '後輩指導への参加',
          description: '新人職員への基本的な指導・サポート',
          category: 'facility',
          type: 'optional',
          points: 6,
          evaluationCriteria: [
            '新人の相談に適切に対応できる',
            '基本技術のデモンストレーションができる',
            'チームワークを意識した行動ができる'
          ],
          targetRoles: [role],
          targetLevels: ['junior']
        }
      ],
      midlevel: [
        {
          id: 'MID_001',
          name: '専門技術の深化',
          description: '高度な専門技術と判断力の発揮',
          category: 'facility',
          type: 'required', 
          points: 10,
          evaluationCriteria: [
            '複雑な症例にも対応できる技術を持つ',
            '適切な臨床判断ができる',
            '専門知識を実践に活かせる'
          ],
          targetRoles: [role],
          targetLevels: ['midlevel']
        },
        {
          id: 'MID_002',
          name: 'チームリーダーシップ',
          description: 'チーム内でのリーダーシップ発揮',
          category: 'facility',
          type: 'required',
          points: 8,
          evaluationCriteria: [
            'チームの調整役として機能できる',
            '後輩指導を積極的に行う',
            '改善提案を積極的に行う'
          ],
          targetRoles: [role],
          targetLevels: ['midlevel']
        }
      ],
      veteran: [
        {
          id: 'VET_001',
          name: '高度実践と指導力',
          description: '高度な実践力と体系的な指導能力',
          category: 'facility',
          type: 'required',
          points: 10,
          evaluationCriteria: [
            '困難な症例のリーダーとして対応できる',
            '体系的な指導プログラムを実践できる',
            '部署全体の質向上に貢献している'
          ],
          targetRoles: [role],
          targetLevels: ['veteran']
        },
        {
          id: 'VET_002',
          name: '組織変革への貢献',
          description: '組織レベルでの改善・変革活動',
          category: 'facility',
          type: 'required',
          points: 8,
          evaluationCriteria: [
            '組織横断的な改善活動をリードできる',
            '他部署との連携を効果的に進められる',
            '後進の育成に体系的に取り組んでいる'
          ],
          targetRoles: [role],
          targetLevels: ['veteran']
        }
      ]
    };

    return experienceBasedItems[level] || [];
  };

  // バランス検証ロジック（評価シートの配点設計知見）
  const validateBalance = (config: EvaluationDesignConfig): BalanceValidation => {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 100;

    // 1. 総合配点チェック（技術評価50点の内訳）
    const corporateTotal = config.corporateItems.reduce((sum, item) => sum + item.points, 0);
    const facilityTotal = config.facilityItems.reduce((sum, item) => sum + item.points, 0);
    const totalPoints = corporateTotal + facilityTotal;

    if (totalPoints !== 50) {
      issues.push(`技術評価の合計は50点である必要があります（現在: ${totalPoints}点）`);
      score -= 20;
    }

    // 2. 法人統一・施設特化の配分チェック
    if (corporateTotal !== 30) {
      issues.push(`法人統一項目は30点である必要があります（現在: ${corporateTotal}点）`);
      score -= 15;
    }

    if (facilityTotal !== 20) {
      issues.push(`施設特化項目は20点である必要があります（現在: ${facilityTotal}点）`);
      score -= 15;
    }

    // 3. 項目数のバランスチェック
    if (config.corporateItems.length < 4) {
      issues.push('法人統一項目は最低4項目必要です');
      suggestions.push('医療安全、感染対策、接遇、コンプライアンスを含めてください');
      score -= 10;
    }

    if (config.facilityItems.length < 2) {
      issues.push('施設特化項目は最低2項目必要です');
      suggestions.push('専門技術、施設固有業務を含めてください');
      score -= 10;
    }

    // 4. 経験レベル別の難易度調整チェック
    const difficultyCheck = checkDifficultyBalance(config);
    if (!difficultyCheck.isValid) {
      issues.push(...difficultyCheck.issues);
      suggestions.push(...difficultyCheck.suggestions);
      score -= 10;
    }

    // 5. 優秀な設計への追加提案
    if (score >= 90) {
      suggestions.push('優秀な配点設計です！');
      suggestions.push('実運用時の職員フィードバックも収集してください');
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions,
      score: Math.max(0, score)
    };
  };

  // 難易度バランスチェック
  const checkDifficultyBalance = (config: EvaluationDesignConfig): { isValid: boolean; issues: string[]; suggestions: string[] } => {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // 経験レベル別の期待水準
    const expectedDifficulty: Record<string, { minHighPoints: number; maxBasicPoints: number }> = {
      new: { minHighPoints: 0, maxBasicPoints: 20 }, // 新人は基礎項目中心
      junior: { minHighPoints: 5, maxBasicPoints: 15 }, // 若手は少し高度項目
      midlevel: { minHighPoints: 10, maxBasicPoints: 10 }, // 中堅はバランス
      veteran: { minHighPoints: 15, maxBasicPoints: 5 } // ベテランは高度項目中心
    };

    const level = config.experienceLevel;
    const expected = expectedDifficulty[level];
    
    if (expected) {
      const highDifficultyPoints = config.facilityItems
        .filter(item => item.points >= 8)
        .reduce((sum, item) => sum + item.points, 0);
      
      if (highDifficultyPoints < expected.minHighPoints) {
        issues.push(`${experienceLevels[level as keyof typeof experienceLevels]}には高度項目が不足しています`);
        suggestions.push('より高度な専門技術項目を追加してください');
      }
    }

    return { isValid: issues.length === 0, issues, suggestions };
  };

  // 設定変更時の処理
  useEffect(() => {
    if (selectedFacility && selectedRole && selectedLevel) {
      const recommendedFacilityItems = getRecommendedItems(selectedFacility, selectedRole, selectedLevel);
      
      // 法人統一項目は固定（30点）
      const corporateItems: EvaluationItem[] = [
        {
          id: 'CORP001',
          name: '医療安全管理',
          description: '医療安全に関する知識と実践',
          category: 'corporate',
          type: 'required',
          points: 6,
          evaluationCriteria: ['医療安全研修受講', 'インシデント報告', 'KYT実践'],
          targetRoles: [selectedRole],
          targetLevels: [selectedLevel]
        },
        {
          id: 'CORP002',
          name: '感染対策',
          description: '感染予防策の理解と実践',
          category: 'corporate', 
          type: 'required',
          points: 6,
          evaluationCriteria: ['感染対策研修受講', '標準予防策実施', '手指衛生遵守'],
          targetRoles: [selectedRole],
          targetLevels: [selectedLevel]
        },
        {
          id: 'CORP003',
          name: '患者対応・接遇',
          description: '患者・家族への適切な接遇',
          category: 'corporate',
          type: 'required', 
          points: 9,
          evaluationCriteria: ['接遇研修受講', '丁寧な言葉遣い', '患者満足度向上'],
          targetRoles: [selectedRole],
          targetLevels: [selectedLevel]
        },
        {
          id: 'CORP004',
          name: 'コンプライアンス',
          description: '法令遵守と倫理的行動',
          category: 'corporate',
          type: 'required',
          points: 9,
          evaluationCriteria: ['法令遵守', '個人情報保護', '職業倫理実践'],
          targetRoles: [selectedRole], 
          targetLevels: [selectedLevel]
        }
      ];

      const config: EvaluationDesignConfig = {
        facilityType: selectedFacility,
        role: selectedRole,
        experienceLevel: selectedLevel,
        corporateItems,
        facilityItems: recommendedFacilityItems,
        totalPoints: corporateItems.reduce((sum, item) => sum + item.points, 0) + 
                    recommendedFacilityItems.reduce((sum, item) => sum + item.points, 0)
      };

      setCurrentConfig(config);
      setBalanceValidation(validateBalance(config));
      onConfigChange?.(config);
    }
  }, [selectedFacility, selectedRole, selectedLevel, onConfigChange]);

  return (
    <div className="space-y-6">
      {/* 設定選択 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            評価設計マトリックス
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">施設種別</label>
              <Select value={selectedFacility} onValueChange={setSelectedFacility}>
                <SelectTrigger>
                  <SelectValue placeholder="施設種別を選択" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(facilityTypes).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">職種</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="職種を選択" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roles).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">経験レベル</label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="経験レベルを選択" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(experienceLevels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* バランス検証結果 */}
      {balanceValidation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              設計バランス検証
              <div className="ml-auto">
                <Badge className={balanceValidation.score >= 90 ? 'bg-green-500' : 
                                balanceValidation.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'}>
                  スコア: {balanceValidation.score}/100
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={balanceValidation.score} className="mb-4" />
            
            {balanceValidation.issues.length > 0 && (
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    {balanceValidation.issues.map((issue, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full" />
                        {issue}
                      </div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {balanceValidation.suggestions.length > 0 && (
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    {balanceValidation.suggestions.map((suggestion, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full" />
                        {suggestion}
                      </div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* 設計詳細 */}
      {currentConfig && (
        <Tabs defaultValue="corporate" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="corporate">法人統一項目 (30点)</TabsTrigger>
            <TabsTrigger value="facility">施設特化項目 (20点)</TabsTrigger>
            <TabsTrigger value="summary">設計サマリー</TabsTrigger>
          </TabsList>

          <TabsContent value="corporate" className="space-y-4">
            <div className="grid gap-4">
              {currentConfig.corporateItems.map((item) => (
                <Card key={item.id} className="border-blue-200">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Building className="h-4 w-4 text-blue-600" />
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        <div className="mt-2 space-y-1">
                          {item.evaluationCriteria.map((criteria, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-gray-500">
                              <CheckCircle2 className="h-3 w-3" />
                              {criteria}
                            </div>
                          ))}
                        </div>
                      </div>
                      <Badge className="ml-4 bg-blue-500">
                        {item.points}点
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="facility" className="space-y-4">
            <div className="grid gap-4">
              {currentConfig.facilityItems.map((item) => (
                <Card key={item.id} className="border-green-200">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Target className="h-4 w-4 text-green-600" />
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        <div className="mt-2 space-y-1">
                          {item.evaluationCriteria.map((criteria, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-gray-500">
                              <CheckCircle2 className="h-3 w-3" />
                              {criteria}
                            </div>
                          ))}
                        </div>
                      </div>
                      <Badge className="ml-4 bg-green-500">
                        {item.points}点
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  設計サマリー
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">配点構成</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>法人統一項目</span>
                        <span className="font-bold text-blue-600">
                          {currentConfig.corporateItems.reduce((sum, item) => sum + item.points, 0)}点
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>施設特化項目</span>
                        <span className="font-bold text-green-600">
                          {currentConfig.facilityItems.reduce((sum, item) => sum + item.points, 0)}点
                        </span>
                      </div>
                      <div className="border-t pt-2 flex justify-between text-lg font-bold">
                        <span>技術評価合計</span>
                        <span>{currentConfig.totalPoints}点</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">評価体系</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>対象:</strong> {facilityTypes[currentConfig.facilityType as keyof typeof facilityTypes]} - {roles[currentConfig.role as keyof typeof roles]}</div>
                      <div><strong>レベル:</strong> {experienceLevels[currentConfig.experienceLevel as keyof typeof experienceLevels]}</div>
                      <div><strong>項目数:</strong> 法人{currentConfig.corporateItems.length}項目 + 施設{currentConfig.facilityItems.length}項目</div>
                      <div><strong>評価構成:</strong> 技術評価50点 + 組織貢献50点 = 100点満点</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}