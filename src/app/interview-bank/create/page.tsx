'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles,
  Calendar,
  MessageCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  User,
  Clock,
  FileText,
  CheckCircle,
  ArrowRight,
  Info,
  Search,
  UserX,
  ArrowRightLeft,
  UserCheck,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

import { UnifiedBankService, UnifiedInterviewParams } from '@/lib/interview-bank/services/unified-bank-service';
import { StaffBankProfile } from '@/lib/interview-bank/types';
import { useRouter } from 'next/navigation';
import DynamicInterviewFlow from '@/components/interview/DynamicInterviewFlow';
import SupportInterviewBankFlow from '@/components/interview/SupportInterviewBankFlow';
import SpecialInterviewBankFlow from '@/components/interview/SpecialInterviewBankFlow';

// ウィザードステップ
type WizardStep = 'type' | 'context' | 'staff' | 'details' | 'confirm';

// バンクタイプカード
interface BankTypeCardProps {
  type: 'regular' | 'support' | 'special';
  selected: boolean;
  onSelect: () => void;
}

function BankTypeCard({ type, selected, onSelect }: BankTypeCardProps) {
  const config = {
    regular: {
      icon: <Calendar className="w-8 h-8" />,
      title: '定期面談',
      description: '定期的な状況確認とキャリア支援',
      features: ['経験年数別の質問', '動機タイプ診断', 'キャリア開発'],
      color: 'blue',
      recommendedFor: '3ヶ月以上面談がない職員'
    },
    support: {
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'サポート面談',
      description: '職員からの相談・悩みへの対応',
      features: ['VoiceDrive連携', 'カテゴリ別対応', '緊急度管理'],
      color: 'green',
      recommendedFor: 'VoiceDriveからの申込対応'
    },
    special: {
      icon: <AlertCircle className="w-8 h-8" />,
      title: '特別面談',
      description: '退職・異動・昇進などの特別な状況',
      features: ['退職面談', '異動・復職面談', '昇進・懲戒面談'],
      color: 'orange',
      recommendedFor: '特別な事情がある職員'
    }
  }[type];

  return (
    <Card 
      className={`cursor-pointer transition-all ${
        selected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className={`w-16 h-16 rounded-lg bg-${config.color}-50 flex items-center justify-center`}>
            <div className={`text-${config.color}-600`}>
              {config.icon}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{config.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{config.description}</p>
          </div>
          <div className="space-y-2">
            {config.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <Alert className="py-2">
            <Info className="w-4 h-4" />
            <AlertDescription className="text-xs">
              推奨: {config.recommendedFor}
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}

// メインコンポーネント
export default function CreateInterviewWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<WizardStep>('type');
  const [formData, setFormData] = useState({
    bankType: null as 'regular' | 'support' | 'special' | null,
    context: '',
    urgency: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    staffId: '',
    staffName: '',
    staffDepartment: '',
    details: '',
    scheduledDate: new Date(),
    useExistingFlow: false
  });
  const [unifiedService] = useState(() => UnifiedBankService.getInstance());

  // ステップ設定
  const steps: WizardStep[] = ['type', 'context', 'staff', 'details', 'confirm'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // 次のステップへ
  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  // 前のステップへ
  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  // 面談作成実行
  const handleCreate = () => {
    if (!formData.bankType) return;

    // 既存フローを使用する場合はリダイレクト
    if (formData.useExistingFlow) {
      switch (formData.bankType) {
        case 'regular':
          router.push('/interviews/regular/create');
          break;
        case 'support':
          router.push('/interviews/support');
          break;
        case 'special':
          router.push('/interviews/special');
          break;
      }
    } else {
      // 統一インターフェースで作成（実装時）
      console.log('Create interview with unified interface:', formData);
      router.push('/interview-bank');
    }
  };

  // バンクタイプの推奨を取得
  const getRecommendation = () => {
    const context = {
      urgency: formData.urgency,
      context: formData.context
    };
    
    return unifiedService.detectBankType(context);
  };

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          面談作成ウィザード
        </h1>
        <p className="text-muted-foreground">適切な面談タイプを選択して面談を作成します</p>
      </div>

      {/* プログレスバー */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>タイプ選択</span>
          <span>状況確認</span>
          <span>職員選択</span>
          <span>詳細設定</span>
          <span>確認</span>
        </div>
      </div>

      {/* ステップ1: タイプ選択 */}
      {currentStep === 'type' && (
        <Card>
          <CardHeader>
            <CardTitle>面談タイプを選択</CardTitle>
            <CardDescription>
              状況に応じた最適な面談バンクを選択してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <BankTypeCard
                type="regular"
                selected={formData.bankType === 'regular'}
                onSelect={() => setFormData(prev => ({ ...prev, bankType: 'regular' }))}
              />
              <BankTypeCard
                type="support"
                selected={formData.bankType === 'support'}
                onSelect={() => setFormData(prev => ({ ...prev, bankType: 'support' }))}
              />
              <BankTypeCard
                type="special"
                selected={formData.bankType === 'special'}
                onSelect={() => setFormData(prev => ({ ...prev, bankType: 'special' }))}
              />
            </div>

            {/* AI推奨 */}
            <Alert>
              <Sparkles className="w-4 h-4" />
              <AlertDescription>
                現在の状況から判断すると、
                <strong className="mx-1">
                  {getRecommendation() === 'regular' ? '定期面談' :
                   getRecommendation() === 'support' ? 'サポート面談' : '特別面談'}
                </strong>
                が推奨されます
              </AlertDescription>
            </Alert>

            <div className="flex justify-end">
              <Button 
                onClick={handleNext}
                disabled={!formData.bankType}
              >
                次へ
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ステップ2: 状況確認 */}
      {currentStep === 'context' && (
        <Card>
          <CardHeader>
            <CardTitle>面談の背景・状況</CardTitle>
            <CardDescription>
              面談が必要な理由や背景を教えてください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>面談の理由・背景</Label>
              <Textarea
                value={formData.context}
                onChange={(e) => setFormData(prev => ({ ...prev, context: e.target.value }))}
                placeholder={
                  formData.bankType === 'regular' ? '定期的な状況確認のため...' :
                  formData.bankType === 'support' ? '職員から相談があり...' :
                  '退職の申し出があり...'
                }
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>緊急度</Label>
              <RadioGroup 
                value={formData.urgency}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, urgency: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low">低（1ヶ月以内）</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">中（2週間以内）</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high">高（1週間以内）</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="urgent" id="urgent" />
                  <Label htmlFor="urgent">緊急（48時間以内）</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                戻る
              </Button>
              <Button onClick={handleNext}>
                次へ
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ステップ3: 職員選択 */}
      {currentStep === 'staff' && (
        <Card>
          <CardHeader>
            <CardTitle>対象職員の選択</CardTitle>
            <CardDescription>
              面談対象の職員を選択または入力してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>職員検索</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="職員名または職員IDで検索..."
                  value={formData.staffName}
                  onChange={(e) => setFormData(prev => ({ ...prev, staffName: e.target.value }))}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>職員ID</Label>
                <Input
                  value={formData.staffId}
                  onChange={(e) => setFormData(prev => ({ ...prev, staffId: e.target.value }))}
                  placeholder="EMP001"
                />
              </div>
              <div className="space-y-2">
                <Label>所属部署</Label>
                <Input
                  value={formData.staffDepartment}
                  onChange={(e) => setFormData(prev => ({ ...prev, staffDepartment: e.target.value }))}
                  placeholder="看護部"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                戻る
              </Button>
              <Button 
                onClick={handleNext}
                disabled={!formData.staffName}
              >
                次へ
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ステップ4: 詳細設定 */}
      {currentStep === 'details' && (
        <Card>
          <CardHeader>
            <CardTitle>詳細設定</CardTitle>
            <CardDescription>
              面談の詳細を設定してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>追加情報・メモ</Label>
              <Textarea
                value={formData.details}
                onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                placeholder="面談で特に確認したい事項など..."
                rows={3}
              />
            </div>

            <Alert>
              <Info className="w-4 h-4" />
              <AlertDescription>
                面談シートは自動的に最適な質問を選択して生成されます
              </AlertDescription>
            </Alert>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                戻る
              </Button>
              <Button onClick={handleNext}>
                次へ
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ステップ5: 確認 */}
      {currentStep === 'confirm' && (
        <Card>
          <CardHeader>
            <CardTitle>面談作成の確認</CardTitle>
            <CardDescription>
              以下の内容で面談を作成します
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 bg-muted p-4 rounded-lg">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">面談タイプ</span>
                <Badge>
                  {formData.bankType === 'regular' ? '定期面談' :
                   formData.bankType === 'support' ? 'サポート面談' : '特別面談'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">対象職員</span>
                <span className="font-medium">{formData.staffName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">緊急度</span>
                <Badge variant={
                  formData.urgency === 'urgent' ? 'destructive' :
                  formData.urgency === 'high' ? 'destructive' :
                  formData.urgency === 'medium' ? 'secondary' : 'outline'
                }>
                  {formData.urgency === 'low' ? '低' :
                   formData.urgency === 'medium' ? '中' :
                   formData.urgency === 'high' ? '高' : '緊急'}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>作成方法を選択</Label>
              <RadioGroup 
                value={formData.useExistingFlow ? 'existing' : 'unified'}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  useExistingFlow: value === 'existing' 
                }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unified" id="unified" />
                  <Label htmlFor="unified">統一インターフェースで作成（推奨）</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="existing" id="existing" />
                  <Label htmlFor="existing">専用画面で詳細設定</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                戻る
              </Button>
              <Button onClick={handleCreate}>
                <CheckCircle className="w-4 h-4 mr-2" />
                面談を作成
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}