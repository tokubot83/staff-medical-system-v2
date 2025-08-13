'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, TrendingUp, Award, Shield, Users, Zap, DollarSign, Palette } from 'lucide-react';

export interface MotivationType {
  id: string;
  type: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  approach: string;
  keywords: string[];
}

export const motivationTypes: MotivationType[] = [
  {
    id: 'growth',
    type: '成長・挑戦型',
    label: '新しいスキルを身につけた時',
    description: '学習意欲が高く、新しいことへの挑戦を好む。スキルアップや成長実感が主なモチベーション。',
    icon: TrendingUp,
    color: 'text-green-600 bg-green-50',
    approach: '研修機会の提供、新規プロジェクトへの参加、スキルアップ支援、昇進パスの明示',
    keywords: ['スキルアップ', '新規事業', 'チャレンジ', '学習', '成長']
  },
  {
    id: 'recognition',
    type: '評価・承認型',
    label: '上司や同僚に褒められた時',
    description: '他者からの評価や承認を重視。成果を認められることで強いモチベーションを感じる。',
    icon: Award,
    color: 'text-yellow-600 bg-yellow-50',
    approach: '定期的なフィードバック、表彰制度の活用、成果の可視化、昇進基準の明確化',
    keywords: ['評価', '表彰', '昇進', '承認', '認知']
  },
  {
    id: 'stability',
    type: '安定・安心型',
    label: '安定した環境で確実に成果を出せた時',
    description: 'リスクを避け、確実性を重視。予測可能で安定した環境を好む。',
    icon: Shield,
    color: 'text-blue-600 bg-blue-50',
    approach: '段階的な変化、詳細な説明、マニュアル整備、不安要素の事前解消',
    keywords: ['安定', '確実', '段階的', '安心', 'リスク回避']
  },
  {
    id: 'teamwork',
    type: '関係・調和型',
    label: 'チームで協力して目標を達成した時',
    description: '人間関係やチームワークを重視。協力して成果を出すことに喜びを感じる。',
    icon: Users,
    color: 'text-purple-600 bg-purple-50',
    approach: 'チーム業務の機会、メンター制度、コーディネーター役の委任、協調的な環境作り',
    keywords: ['チーム', '協力', '支援', '人間関係', '調和']
  },
  {
    id: 'efficiency',
    type: '効率・合理型',
    label: '無駄な作業を改善・効率化できた時',
    description: '効率性と合理性を追求。プロセス改善や最適化に強い関心を持つ。',
    icon: Zap,
    color: 'text-orange-600 bg-orange-50',
    approach: '業務効率化プロジェクト、DX推進、プロセス改善の機会、最適化ツールの導入',
    keywords: ['効率', '合理的', '最適化', '改善', 'DX']
  },
  {
    id: 'compensation',
    type: '報酬・待遇型',
    label: '良い待遇で働けている時',
    description: '給与や福利厚生などの待遇を重視。実利的なメリットがモチベーションの源泉。',
    icon: DollarSign,
    color: 'text-emerald-600 bg-emerald-50',
    approach: '昇給機会の明示、福利厚生の充実、副業許可、実績に応じた報酬設計',
    keywords: ['給与', '福利厚生', '待遇', '報酬', '実利']
  },
  {
    id: 'creativity',
    type: '自由・創造型',
    label: '自分らしい方法で創造的な成果を出せた時',
    description: '自由度と創造性を重視。独自のアプローチで成果を出すことを好む。',
    icon: Palette,
    color: 'text-pink-600 bg-pink-50',
    approach: 'フレックス制度、クリエイティブ業務の委任、裁量権の拡大、独自アプローチの尊重',
    keywords: ['自由', '創造性', '個性', '独自性', '裁量']
  }
];

interface MotivationTypeSectionProps {
  selectedType?: string;
  onTypeSelect: (typeId: string) => void;
}

export function MotivationTypeSection({ selectedType, onTypeSelect }: MotivationTypeSectionProps) {
  const [showResult, setShowResult] = useState(false);
  const selectedMotivation = motivationTypes.find(type => type.id === selectedType);

  const handleTypeChange = (value: string) => {
    onTypeSelect(value);
    setShowResult(true);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          動機タイプ判定
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <Label className="text-base font-semibold">
            仕事で最もやりがいを感じるのはどのような時ですか？
          </Label>
          <p className="text-sm text-gray-600">
            以下の選択肢から、最も当てはまるものを1つ選んでください。
          </p>
        </div>

        <RadioGroup value={selectedType} onValueChange={handleTypeChange}>
          <div className="space-y-3">
            {motivationTypes.map((type) => {
              const Icon = type.icon;
              return (
                <label
                  key={type.id}
                  className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                    selectedType === type.id 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <RadioGroupItem value={type.id} className="mt-1" />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`h-4 w-4 ${type.color.split(' ')[0]}`} />
                      <span className="font-semibold text-sm">{type.type}</span>
                    </div>
                    <div className="font-medium mb-1">{type.label}</div>
                    <div className="text-sm text-gray-600">{type.description}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </RadioGroup>

        {showResult && selectedMotivation && (
          <Alert className={`mt-4 ${selectedMotivation.color.split(' ')[1]} border-2`}>
            <AlertDescription>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold">判定結果: </span>
                  <span className={`font-bold ${selectedMotivation.color.split(' ')[0]}`}>
                    {selectedMotivation.type}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">特徴: </span>
                  {selectedMotivation.description}
                </div>
                <div>
                  <span className="font-semibold">推奨アプローチ: </span>
                  {selectedMotivation.approach}
                </div>
                <div>
                  <span className="font-semibold">キーワード: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedMotivation.keywords.map((keyword, index) => (
                      <span 
                        key={index}
                        className={`px-2 py-1 rounded text-xs ${selectedMotivation.color}`}
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

export function getMotivationTypeQuestions(typeId: string): string[] {
  const typeSpecificQuestions: Record<string, string[]> = {
    growth: [
      '最近学んだ新しいスキルや知識について教えてください。',
      '今後挑戦したい業務や習得したいスキルはありますか？',
      '自己成長のために取り組んでいることはありますか？'
    ],
    recognition: [
      '最近の業務で評価されたことや褒められたことを教えてください。',
      '自分の成果をもっと認めてもらいたいと感じることはありますか？',
      '評価制度について改善してほしい点はありますか？'
    ],
    stability: [
      '現在の業務環境で安心して働けていますか？',
      '業務の変更や新しい取り組みに対する不安はありますか？',
      'より安定した環境で働くために必要なサポートは何ですか？'
    ],
    teamwork: [
      'チーム内での協力関係はうまくいっていますか？',
      '同僚との関係で改善したい点はありますか？',
      'チームワークを向上させるための提案はありますか？'
    ],
    efficiency: [
      '現在の業務で非効率だと感じる部分はありますか？',
      '業務改善のアイデアがあれば教えてください。',
      'DXやシステム化で解決したい課題はありますか？'
    ],
    compensation: [
      '現在の待遇について満足している点と改善してほしい点を教えてください。',
      '福利厚生で追加してほしいものはありますか？',
      'キャリアアップと報酬の関係について、どのようにお考えですか？'
    ],
    creativity: [
      '自分らしい働き方ができていると感じますか？',
      '業務でもっと創造性を発揮したい部分はありますか？',
      '裁量権を増やしてほしい業務領域はありますか？'
    ]
  };

  return typeSpecificQuestions[typeId] || [];
}