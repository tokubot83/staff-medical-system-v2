'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Clock,
  Users,
  Plus,
  Edit,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle,
  Info,
  ChevronRight,
  Timer,
  Target,
  FileText,
  Sparkles,
  BarChart3,
  Package,
  Settings,
  Copy,
  Download,
  Upload,
  UserX,
  ArrowRightLeft,
  UserCheck,
  TrendingUp,
  Heart,
  AlertTriangle,
  Search,
} from 'lucide-react';
import { ExperienceLevel, BankQuestion } from '@/lib/interview-bank/types';

interface BankQuestionManagerProps {
  onClose?: () => void;
  interviewType: 'regular' | 'support' | 'special';
}

// 面談タイプの定義
const interviewTypes = [
  { id: 'regular', label: '定期面談', icon: FileText, color: 'blue' },
  { id: 'special', label: '特別面談', icon: AlertCircle, color: 'orange' },
  { id: 'support', label: 'サポート面談', icon: Users, color: 'green' },
];

// 面談時間の定義
const interviewDurations = [
  { value: 15, label: '15分', description: '簡易確認' },
  { value: 30, label: '30分', description: '標準面談' },
  { value: 45, label: '45分', description: '詳細面談' },
];

// 経験レベルの定義
const experienceLevels = [
  { id: 'new', label: '新人', years: '1年未満', color: 'green' },
  { id: 'junior', label: '若手', years: '1-3年', color: 'blue' },
  { id: 'midlevel', label: '中堅', years: '3-10年', color: 'purple' },
  { id: 'veteran', label: 'ベテラン', years: '10年以上', color: 'orange' },
];

// セクションの定義
const interviewSections = [
  { id: 'intro', label: '導入', defaultTime: 3, icon: Info },
  { id: 'current', label: '現状確認', defaultTime: 10, icon: Target },
  { id: 'challenges', label: '課題探索', defaultTime: 10, icon: AlertCircle },
  { id: 'goals', label: '目標設定', defaultTime: 5, icon: Target },
  { id: 'closing', label: 'まとめ', defaultTime: 2, icon: CheckCircle },
];

// サポート面談のカテゴリ
const supportCategories = [
  { id: 'workplace', label: '職場環境の悩み', icon: Users, description: '職場の雰囲気や環境に関する相談' },
  { id: 'relationship', label: '人間関係の相談', icon: Heart, description: '同僚や上司との関係についての相談' },
  { id: 'career', label: 'キャリア相談', icon: Target, description: '今後のキャリアパスについての相談' },
  { id: 'mental', label: 'メンタルヘルス', icon: Heart, description: '心の健康に関する相談' },
  { id: 'workload', label: '業務負荷の調整', icon: BarChart3, description: '業務量や負担に関する相談' },
];

// 特別面談の種別
const specialTypes = [
  { id: 'exit', label: '退職面談', icon: UserX, description: '退職予定者との面談' },
  { id: 'return', label: '復職面談', icon: UserCheck, description: '休職からの復職者との面談' },
  { id: 'promotion', label: '昇進面談', icon: TrendingUp, description: '昇進予定者との面談' },
  { id: 'transfer', label: '異動面談', icon: ArrowRightLeft, description: '部署異動者との面談' },
  { id: 'incident', label: 'インシデント面談', icon: AlertTriangle, description: '問題発生後の面談' },
];

// 質問配分の型定義
interface QuestionAllocation {
  sectionId: string;
  experienceLevel: ExperienceLevel;
  questions: BankQuestion[];
  requiredTime: number;
  priority: 1 | 2 | 3;
}

export default function BankQuestionManager({ onClose, interviewType }: BankQuestionManagerProps) {
  // 面談タイプに応じて初期ステップを設定
  const getInitialStep = () => {
    if (interviewType === 'regular') return 'duration';
    return 'duration'; // support, specialも最初は時間選択から
  };
  
  const [currentStep, setCurrentStep] = useState<'duration' | 'category' | 'special-type' | 'matrix'>(getInitialStep());
  const [selectedDuration, setSelectedDuration] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>(''); // サポート面談用
  const [selectedSpecialType, setSelectedSpecialType] = useState<string>(''); // 特別面談用
  const [allocations, setAllocations] = useState<QuestionAllocation[]>([]);
  const [editingCell, setEditingCell] = useState<{
    section: string;
    level: ExperienceLevel;
  } | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [bulkAddMode, setBulkAddMode] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [timeWarning, setTimeWarning] = useState<string>('');

  // 現在の質問データ（ダミーデータ）
  const [questionBank, setQuestionBank] = useState<BankQuestion[]>([
    {
      id: 'q1',
      content: '現在の業務で最も充実感を感じる瞬間はどんな時ですか？',
      type: 'textarea',
      category: '現状確認',
      sectionId: 'current',
      priority: 1,
      minDuration: 2,
      tags: ['モチベーション', '仕事満足度'],
      experienceLevels: ['new', 'junior', 'midlevel', 'veteran'],
    },
    // ... 実際はもっと多くの質問
  ]);

  // 時間計算
  const totalAllocatedTime = useMemo(() => {
    return allocations.reduce((sum, allocation) => sum + allocation.requiredTime, 0);
  }, [allocations]);

  const remainingTime = selectedDuration - totalAllocatedTime;

  // 時間警告のチェック
  useEffect(() => {
    if (selectedDuration > 0) {
      if (remainingTime < 0) {
        setTimeWarning(`時間が${Math.abs(remainingTime)}分超過しています`);
      } else if (remainingTime > 5) {
        setTimeWarning(`まだ${remainingTime}分の余裕があります`);
      } else {
        setTimeWarning('');
      }
    }
  }, [remainingTime, selectedDuration]);

  // マトリクスセルの質問数を取得
  const getQuestionCount = (sectionId: string, level: ExperienceLevel): number => {
    const allocation = allocations.find(
      a => a.sectionId === sectionId && a.experienceLevel === level
    );
    return allocation?.questions.length || 0;
  };

  // マトリクスセルの推定時間を取得
  const getEstimatedTime = (sectionId: string, level: ExperienceLevel): number => {
    const allocation = allocations.find(
      a => a.sectionId === sectionId && a.experienceLevel === level
    );
    return allocation?.requiredTime || 0;
  };

  // 次のステップを決定する関数
  const getNextStep = () => {
    if (interviewType === 'regular') {
      return 'matrix';
    } else if (interviewType === 'support') {
      return 'category';
    } else if (interviewType === 'special') {
      return 'special-type';
    }
    return 'matrix';
  };

  // Step 1: 面談時間選択
  const DurationSelection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">面談時間を選択</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {interviewType === 'regular' && '定期面談の'}
          {interviewType === 'support' && 'サポート面談の'}
          {interviewType === 'special' && '特別面談の'}
          質問セットを構成する面談時間を選択してください
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {interviewDurations.map(duration => (
          <Card
            key={duration.value}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedDuration === duration.value ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedDuration(duration.value)}
          >
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center mb-3">
                  <Clock className="h-6 w-6 text-muted-foreground mr-2" />
                  <span className="text-2xl font-bold">{duration.label}</span>
                </div>
                <p className="text-sm text-muted-foreground">{duration.description}</p>
                <div className="pt-3">
                  <Badge variant="outline">
                    推奨質問数: {Math.floor(duration.value / 3)}問
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => setCurrentStep(getNextStep() as any)}
          disabled={!selectedDuration}
        >
          次へ
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  // Step 2a: カテゴリ選択（サポート面談用）
  const CategorySelection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">相談カテゴリを選択</h3>
        <p className="text-sm text-muted-foreground mb-4">
          サポート面談の相談内容に応じたカテゴリを選択してください
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {supportCategories.map(category => {
          const Icon = category.icon;
          return (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedCategory === category.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <Icon className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold">{category.label}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep('duration')}>
          戻る
        </Button>
        <Button
          onClick={() => setCurrentStep('matrix')}
          disabled={!selectedCategory}
        >
          次へ
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  // Step 2b: 種別選択（特別面談用）
  const SpecialTypeSelection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">特別面談の種別を選択</h3>
        <p className="text-sm text-muted-foreground mb-4">
          実施する特別面談の種別を選択してください
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {specialTypes.map(type => {
          const Icon = type.icon;
          return (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedSpecialType === type.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedSpecialType(type.id)}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-100">
                      <Icon className="h-6 w-6 text-orange-600" />
                    </div>
                    <h4 className="font-semibold">{type.label}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep('duration')}>
          戻る
        </Button>
        <Button
          onClick={() => setCurrentStep('matrix')}
          disabled={!selectedSpecialType}
        >
          次へ
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  // Step 3: マトリクス管理
  const MatrixManagement = () => {
    // 定期面談用のマトリクス
    if (interviewType === 'regular') {
      return (
        <div className="space-y-6">
          {/* ヘッダー情報 */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">質問配分マトリクス</h3>
              <p className="text-sm text-muted-foreground">
                定期面談 - {selectedDuration}分
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setBulkAddMode(true)}>
                <Upload className="h-4 w-4 mr-2" />
                一括インポート
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                エクスポート
              </Button>
              <Button variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                テンプレート保存
              </Button>
            </div>
          </div>

          {/* 時間配分バー */}
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>時間配分</span>
                  <span className="font-medium">
                    {totalAllocatedTime} / {selectedDuration}分
                  </span>
                </div>
                <div className="relative h-10 bg-gray-100 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex">
                    {interviewSections.map((section, index) => {
                      const width = (section.defaultTime / selectedDuration) * 100;
                      const colors = ['bg-blue-400', 'bg-green-400', 'bg-orange-400', 'bg-purple-400', 'bg-pink-400'];
                      return (
                        <div
                          key={section.id}
                          className={`${colors[index % colors.length]} flex items-center justify-center text-xs text-white font-medium`}
                          style={{ width: `${width}%` }}
                        >
                          {section.label} {Math.floor((section.defaultTime / selectedDuration) * selectedDuration)}分
                        </div>
                      );
                    })}
                  </div>
                </div>
                {timeWarning && (
                  <Alert className={remainingTime < 0 ? 'border-red-500' : 'border-yellow-500'}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{timeWarning}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 定期面談用マトリクステーブル */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-4 text-left font-medium">セクション</th>
                      {experienceLevels.map(level => (
                        <th key={level.id} className="p-4 text-center">
                          <div>
                            <div className="font-medium">{level.label}</div>
                            <div className="text-xs text-muted-foreground">{level.years}</div>
                          </div>
                        </th>
                      ))}
                      <th className="p-4 text-center font-medium">アクション</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interviewSections.map(section => {
                      const Icon = section.icon;
                      return (
                        <tr key={section.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{section.label}</span>
                            </div>
                          </td>
                          {experienceLevels.map(level => (
                            <td key={level.id} className="p-4 text-center">
                              <button
                                className="w-full p-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-all"
                                onClick={() => {
                                  setEditingCell({ section: section.id, level: level.id as ExperienceLevel });
                                  setShowAddDialog(true);
                                }}
                              >
                                <div className="space-y-1">
                                  <div className="font-semibold text-lg">
                                    {getQuestionCount(section.id, level.id as ExperienceLevel)}問
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {getEstimatedTime(section.id, level.id as ExperienceLevel)}分
                                  </div>
                                </div>
                              </button>
                            </td>
                          ))}
                          <td className="p-4 text-center">
                            <div className="flex justify-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  // セクション一括編集
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {/* 合計行 */}
                    <tr className="bg-gray-50 font-semibold">
                      <td className="p-4">合計</td>
                      {experienceLevels.map(level => {
                        const totalQuestions = interviewSections.reduce(
                          (sum, section) => sum + getQuestionCount(section.id, level.id as ExperienceLevel),
                          0
                        );
                        const totalTime = interviewSections.reduce(
                          (sum, section) => sum + getEstimatedTime(section.id, level.id as ExperienceLevel),
                          0
                        );
                        return (
                          <td key={level.id} className="p-4 text-center">
                            <div className="space-y-1">
                              <div>{totalQuestions}問</div>
                              <div className="text-xs text-muted-foreground">{totalTime}分</div>
                            </div>
                          </td>
                        );
                      })}
                      <td className="p-4"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* アクションボタン */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep('duration')}>
              戻る
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                キャンセル
              </Button>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                保存
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // サポート面談用のマトリクス
    if (interviewType === 'support') {
      const urgencyLevels = [
        { id: 'immediate', label: '緊急対応', description: '即座の対応が必要', color: 'red' },
        { id: 'high', label: '高優先度', description: '早期の対応が望ましい', color: 'orange' },
        { id: 'normal', label: '通常対応', description: '計画的な対応', color: 'blue' },
        { id: 'followup', label: 'フォロー', description: '継続的な支援', color: 'green' },
      ];

      const consultationDepths = [
        { id: 'listening', label: '傾聴', icon: Heart, description: '話を聞くことに重点' },
        { id: 'exploration', label: '探索', icon: Search, description: '問題の背景を探る' },
        { id: 'solution', label: '解決', icon: Target, description: '具体的な解決策を検討' },
        { id: 'action', label: '行動', icon: CheckCircle, description: '行動計画を立てる' },
      ];

      return (
        <div className="space-y-6">
          {/* ヘッダー情報 */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">サポート面談 質問配分</h3>
              <p className="text-sm text-muted-foreground">
                {supportCategories.find(c => c.id === selectedCategory)?.label || ''} - {selectedDuration}分
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                テンプレート読込
              </Button>
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                テンプレート保存
              </Button>
            </div>
          </div>

          {/* カテゴリ別の重点事項 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">相談の深度と緊急度による質問配分</CardTitle>
              <CardDescription>
                相談の緊急度と必要な深度に応じて質問を配分します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                <div></div>
                {urgencyLevels.map(level => (
                  <div key={level.id} className="text-center">
                    <Badge variant={level.color === 'red' ? 'destructive' : 'secondary'}>
                      {level.label}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{level.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                {consultationDepths.map(depth => {
                  const Icon = depth.icon;
                  return (
                    <div key={depth.id} className="grid grid-cols-5 gap-4 items-center">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{depth.label}</span>
                      </div>
                      {urgencyLevels.map(level => (
                        <button
                          key={`${depth.id}-${level.id}`}
                          className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all"
                          onClick={() => {
                            // サポート面談用の質問編集
                          }}
                        >
                          <div className="text-center">
                            <div className="font-semibold">0問</div>
                            <div className="text-xs text-muted-foreground">0分</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* サポート面談の重点ポイント */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">このカテゴリの重点ポイント</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">必須確認事項</h4>
                  <div className="space-y-1">
                    <label className="flex items-center gap-2">
                      <Checkbox />
                      <span className="text-sm">現在の状況把握</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Checkbox />
                      <span className="text-sm">本人の希望確認</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Checkbox />
                      <span className="text-sm">支援の必要性評価</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">フォローアップ</h4>
                  <div className="space-y-1">
                    <label className="flex items-center gap-2">
                      <Checkbox />
                      <span className="text-sm">次回面談の設定</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Checkbox />
                      <span className="text-sm">関係部署との連携</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Checkbox />
                      <span className="text-sm">記録の作成</span>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* アクションボタン */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep('category')}>
              戻る
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                キャンセル
              </Button>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                保存
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // 特別面談用のマトリクス
    if (interviewType === 'special') {
      const interviewPhases = [
        { id: 'opening', label: '導入', icon: Info, description: '面談の目的説明' },
        { id: 'context', label: '背景確認', icon: FileText, description: '経緯や状況の確認' },
        { id: 'main', label: 'メイン', icon: Target, description: '中心的な話題' },
        { id: 'planning', label: '計画', icon: BarChart3, description: '今後の計画' },
        { id: 'closing', label: 'クロージング', icon: CheckCircle, description: '確認とまとめ' },
      ];

      const checkpoints = [
        { id: 'mandatory', label: '必須項目', priority: 1, color: 'red' },
        { id: 'important', label: '重要項目', priority: 2, color: 'orange' },
        { id: 'recommended', label: '推奨項目', priority: 3, color: 'blue' },
        { id: 'optional', label: '任意項目', priority: 4, color: 'gray' },
      ];

      return (
        <div className="space-y-6">
          {/* ヘッダー情報 */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">特別面談 質問構成</h3>
              <p className="text-sm text-muted-foreground">
                {specialTypes.find(t => t.id === selectedSpecialType)?.label || ''} - {selectedDuration}分
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                規定フォーマット
              </Button>
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                テンプレート保存
              </Button>
            </div>
          </div>

          {/* 特別面談の種別に応じた確認事項 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {specialTypes.find(t => t.id === selectedSpecialType)?.label || ''} チェックリスト
              </CardTitle>
              <CardDescription>
                この種別の面談で確認すべき項目と質問の配分
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {interviewPhases.map(phase => {
                  const Icon = phase.icon;
                  return (
                    <div key={phase.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <h4 className="font-medium">{phase.label}</h4>
                          <span className="text-sm text-muted-foreground">- {phase.description}</span>
                        </div>
                        <Badge variant="outline">
                          推奨: {Math.floor(selectedDuration * 0.2)}分
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        {checkpoints.map(checkpoint => (
                          <button
                            key={`${phase.id}-${checkpoint.id}`}
                            className={`p-3 rounded-lg border-2 border-dashed transition-all ${
                              checkpoint.priority === 1 
                                ? 'border-red-300 hover:bg-red-50' 
                                : checkpoint.priority === 2
                                ? 'border-orange-300 hover:bg-orange-50'
                                : checkpoint.priority === 3
                                ? 'border-blue-300 hover:bg-blue-50'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                            onClick={() => {
                              // 特別面談用の質問編集
                            }}
                          >
                            <div className="text-center">
                              <Badge 
                                variant={
                                  checkpoint.priority === 1 ? 'destructive' : 
                                  checkpoint.priority === 2 ? 'default' :
                                  checkpoint.priority === 3 ? 'secondary' : 'outline'
                                }
                                className="text-xs mb-1"
                              >
                                {checkpoint.label}
                              </Badge>
                              <div className="font-semibold">0問</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 特別面談の注意事項 */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {selectedSpecialType === 'exit' && '退職面談では、本人の意思を尊重し、建設的な対話を心がけてください。'}
              {selectedSpecialType === 'return' && '復職面談では、無理のないペースでの復帰をサポートすることを重視してください。'}
              {selectedSpecialType === 'promotion' && '昇進面談では、新しい役割への期待と責任について明確に伝えてください。'}
              {selectedSpecialType === 'transfer' && '異動面談では、新しい環境への適応をサポートする姿勢を示してください。'}
              {selectedSpecialType === 'incident' && 'インシデント面談では、事実確認と再発防止に焦点を当ててください。'}
            </AlertDescription>
          </Alert>

          {/* アクションボタン */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep('special-type')}>
              戻る
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                キャンセル
              </Button>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                保存
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // デフォルト（到達しないはず）
    return null;
  };

  // 質問追加・編集ダイアログ
  const QuestionEditDialog = () => {
    if (!editingCell) return null;

    return (
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              質問を管理 - {interviewSections.find(s => s.id === editingCell?.section)?.label || ''} / 
              {experienceLevels.find(l => l.id === editingCell?.level)?.label || ''}
            </DialogTitle>
            <DialogDescription>
              このセクションと経験レベルに適した質問を選択または追加してください
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="select" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="select">既存から選択</TabsTrigger>
              <TabsTrigger value="add">新規追加</TabsTrigger>
              <TabsTrigger value="bulk">一括追加</TabsTrigger>
            </TabsList>

            <TabsContent value="select" className="space-y-4">
              <div className="relative">
                <Input
                  placeholder="質問を検索..."
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {questionBank
                    .filter(q => q.sectionId === editingCell.section)
                    .map(question => (
                      <Card key={question.id} className="p-3">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={selectedQuestions.has(question.id)}
                            onCheckedChange={(checked) => {
                              const newSelected = new Set(selectedQuestions);
                              if (checked) {
                                newSelected.add(question.id);
                              } else {
                                newSelected.delete(question.id);
                              }
                              setSelectedQuestions(newSelected);
                            }}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{question.content}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {question.minDuration}分
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                優先度: {question.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="add" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>質問内容</Label>
                  <Textarea
                    placeholder="質問を入力してください..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>推定時間（分）</Label>
                    <Input type="number" min="1" max="10" defaultValue="3" />
                  </div>
                  <div>
                    <Label>優先度</Label>
                    <Select defaultValue="2">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">必須</SelectItem>
                        <SelectItem value="2">推奨</SelectItem>
                        <SelectItem value="3">任意</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bulk" className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  1行に1つの質問を入力してください。各質問は自動的に3分の推定時間で登録されます。
                </AlertDescription>
              </Alert>
              <Textarea
                placeholder="質問1&#10;質問2&#10;質問3..."
                rows={8}
              />
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              キャンセル
            </Button>
            <Button onClick={() => {
              // 質問を追加する処理
              setShowAddDialog(false);
              setEditingCell(null);
            }}>
              追加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // プログレスステップの定義
  const getProgressSteps = () => {
    if (interviewType === 'regular') {
      return ['duration', 'matrix'];
    } else if (interviewType === 'support') {
      return ['duration', 'category', 'matrix'];
    } else if (interviewType === 'special') {
      return ['duration', 'special-type', 'matrix'];
    }
    return ['duration', 'matrix'];
  };

  const progressSteps = getProgressSteps();
  const currentStepIndex = progressSteps.indexOf(currentStep);
  const progressValue = ((currentStepIndex + 1) / progressSteps.length) * 100;

  const getStepLabel = (step: string) => {
    switch (step) {
      case 'duration': return '時間選択';
      case 'category': return 'カテゴリ選択';
      case 'special-type': return '種別選択';
      case 'matrix': return '質問配分';
      default: return '';
    }
  };

  return (
    <div className="p-6">
      {/* プログレスバー */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-8">
            {progressSteps.map((step, index) => (
              <div
                key={step}
                className={`flex items-center gap-2 ${
                  currentStep === step ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === step
                      ? 'bg-primary text-white'
                      : index < currentStepIndex
                      ? 'bg-primary/20 text-primary'
                      : 'bg-gray-100'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="hidden sm:inline">
                  {getStepLabel(step)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <Progress value={progressValue} className="h-2" />
      </div>

      {/* メインコンテンツ */}
      {currentStep === 'duration' && <DurationSelection />}
      {currentStep === 'category' && <CategorySelection />}
      {currentStep === 'special-type' && <SpecialTypeSelection />}
      {currentStep === 'matrix' && <MatrixManagement />}

      {/* ダイアログ */}
      <QuestionEditDialog />
    </div>
  );
}