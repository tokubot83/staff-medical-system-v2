'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, TrendingUp, Award, Shield, Users, Zap, DollarSign, Palette, History } from 'lucide-react';

export interface MotivationType {
  id: string;
  type: string;
  label: string;
  optionLabel: string;  // A〜G用の選択肢ラベル
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
    optionLabel: 'A',
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
    optionLabel: 'B',
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
    optionLabel: 'C',
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
    optionLabel: 'D',
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
    optionLabel: 'E',
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
    optionLabel: 'F',
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
    optionLabel: 'G',
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
  staffId?: number;
  showHistory?: boolean;
}

export function MotivationTypeSection({ 
  selectedType, 
  onTypeSelect, 
  staffId,
  showHistory = false 
}: MotivationTypeSectionProps) {
  const [showResult, setShowResult] = useState(false);
  const [hasSelected, setHasSelected] = useState(false);  // 選択済みフラグ
  const [motivationHistory, setMotivationHistory] = useState<any[]>([]);
  const [typeSpecificNotes, setTypeSpecificNotes] = useState('');
  const [confidenceLevel, setConfidenceLevel] = useState<'high' | 'medium' | 'low'>('medium');
  
  const selectedMotivation = motivationTypes.find(type => type.id === selectedType);

  useEffect(() => {
    if (showHistory && staffId) {
      fetchMotivationHistory();
    }
  }, [showHistory, staffId]);

  const fetchMotivationHistory = async () => {
    try {
      const response = await fetch(`/api/motivation/history/${staffId}`);
      if (response.ok) {
        const data = await response.json();
        setMotivationHistory(data.data.history || []);
      }
    } catch (error) {
      console.error('Failed to fetch motivation history:', error);
    }
  };

  const handleTypeChange = (value: string) => {
    onTypeSelect(value);
    setHasSelected(true);
    // 選択後、少し遅延してから結果を表示（アニメーション効果）
    setTimeout(() => {
      setShowResult(true);
    }, 300);
  };

  const getTypeSpecificQuestions = (typeId: string): string[] => {
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
  };

  return (
    <div className="space-y-4">
      <Card className="mb-6">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            動機タイプ判定
            {showHistory && motivationHistory.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowResult(!showResult)}
                className="ml-auto"
              >
                <History className="h-4 w-4 mr-2" />
                履歴表示
              </Button>
            )}
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
                const isSelected = selectedType === type.id;
                
                return (
                  <label
                    key={type.id}
                    className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                      isSelected 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <RadioGroupItem value={type.id} className="mt-1" />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {/* 選択肢ラベル（A〜G）を大きく表示 */}
                        <span className="text-lg font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                          {type.optionLabel}
                        </span>
                        {/* 選択後のみタイプ名とアイコンを表示 */}
                        {hasSelected && isSelected && (
                          <>
                            <Icon className={`h-5 w-5 ${type.color.split(' ')[0]}`} />
                            <span className="font-bold text-base">{type.type}</span>
                          </>
                        )}
                      </div>
                      {/* 選択肢のテキスト */}
                      <div className="font-medium text-base mb-1">{type.label}</div>
                      {/* 選択後のみ詳細説明を表示 */}
                      {hasSelected && isSelected && (
                        <div className="text-sm text-gray-600 mt-2 animate-fade-in">
                          {type.description}
                        </div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </RadioGroup>

          {showResult && selectedMotivation && (
            <>
              {/* 判定結果カード */}
              <Card className={`mt-6 border-2 ${selectedMotivation.color.split(' ')[0].replace('text', 'border')}`}>
                <CardHeader className={`${selectedMotivation.color.split(' ')[1]}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-purple-600 bg-white px-4 py-2 rounded-full">
                        {selectedMotivation.optionLabel}
                      </span>
                      <div>
                        <p className="text-sm text-gray-600">あなたの動機タイプは</p>
                        <h3 className={`text-xl font-bold ${selectedMotivation.color.split(' ')[0]}`}>
                          {selectedMotivation.type}
                        </h3>
                      </div>
                    </div>
                    {selectedMotivation?.icon && React.createElement(selectedMotivation.icon, {
                      className: `h-12 w-12 ${selectedMotivation.color?.split(' ')[0] || ''}`
                    })}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-1">タイプの特徴</h4>
                      <p className="text-gray-600">{selectedMotivation.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-1">推奨されるマネジメント手法</h4>
                      <p className="text-gray-600">{selectedMotivation.approach}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">モチベーションキーワード</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMotivation.keywords.map((keyword, index) => (
                          <span 
                            key={index}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${selectedMotivation.color}`}
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* タイプ別質問セクション */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-base">
                    {selectedMotivation.type}のための詳細質問
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedType && getTypeSpecificQuestions(selectedType).map((question, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-sm font-medium">
                        質問{index + 1}. {question}
                      </Label>
                      <Textarea 
                        placeholder="回答を記入してください..."
                        className="min-h-[60px] text-sm"
                      />
                    </div>
                  ))}

                  <div className="space-y-2 pt-4 border-t">
                    <Label className="text-sm font-medium">判定の信頼度</Label>
                    <RadioGroup value={confidenceLevel} onValueChange={(value: any) => setConfidenceLevel(value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="high" id="conf-high" />
                        <Label htmlFor="conf-high" className="text-sm">高い - 明確に該当</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="conf-medium" />
                        <Label htmlFor="conf-medium" className="text-sm">中程度 - 概ね該当</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="low" id="conf-low" />
                        <Label htmlFor="conf-low" className="text-sm">低い - 暫定的</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">動機タイプに関する所見・備考</Label>
                    <Textarea 
                      value={typeSpecificNotes}
                      onChange={(e) => setTypeSpecificNotes(e.target.value)}
                      placeholder="面談での観察、具体的なエピソード、今後の対応方針など..."
                      className="min-h-[80px] text-sm"
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* 履歴表示 */}
          {showHistory && motivationHistory.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <History className="h-4 w-4" />
                  動機タイプ履歴
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {motivationHistory.map((history, index) => (
                    <div key={history.id} className="border-l-4 border-gray-200 pl-4 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{history.typeName}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          history.confidenceLevel === 'high' ? 'bg-green-100 text-green-700' :
                          history.confidenceLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          信頼度: {history.confidenceLevel}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(history.assessmentDate).toLocaleDateString('ja-JP')} - {history.assessorName}
                      </div>
                      {history.notes && (
                        <div className="text-sm mt-1">{history.notes}</div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}