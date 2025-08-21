'use client';

import React, { useState } from 'react';
import CommonHeader from '@/components/CommonHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft,
  Stethoscope,
  Heart,
  Shield,
  Users,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Settings,
  Save,
  Eye,
  Edit3,
  Plus,
  Trash2,
  Star,
  Award,
  Target,
  Activity,
  Brain,
  UserCheck,
  Clock,
  TrendingUp,
  Sparkles,
  FileText,
  Zap,
  HelpCircle,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

interface NursingCompetency {
  id: string;
  name: string;
  description: string;
  category: 'clinical' | 'interpersonal' | 'management' | 'education' | 'ethics';
  weight: number;
  experienceLevels: string[];
  evaluationCriteria: {
    level: 'S' | 'A' | 'B' | 'C' | 'D';
    description: string;
    points: number;
  }[];
}

interface NursingEvaluationTemplate {
  id: string;
  name: string;
  facilityType: 'acute' | 'chronic' | 'outpatient' | 'icu' | 'er';
  targetRole: 'staff' | 'senior' | 'leader' | 'manager';
  competencies: string[];
  totalPoints: number;
  description: string;
}

export default function NursingEvaluationDesignPage() {
  // 看護職能力評価項目（日本看護協会標準準拠）
  const nursingCompetencies: NursingCompetency[] = [
    {
      id: 'N001',
      name: 'フィジカルアセスメント',
      description: '患者の身体状況を的確に観察・判断する能力',
      category: 'clinical',
      weight: 15,
      experienceLevels: ['new', 'young', 'midlevel', 'veteran'],
      evaluationCriteria: [
        { level: 'S', description: '高度な判断力で複雑な症例も適切にアセスメント', points: 15 },
        { level: 'A', description: '一般的な症例を的確にアセスメント', points: 12 },
        { level: 'B', description: '基本的なアセスメントを実施', points: 9 },
        { level: 'C', description: '指導下でアセスメントを実施', points: 6 },
        { level: 'D', description: 'アセスメント技術の習得が必要', points: 3 }
      ]
    },
    {
      id: 'N002',
      name: '看護技術・ケア提供',
      description: '安全で質の高い看護技術の提供',
      category: 'clinical',
      weight: 20,
      experienceLevels: ['new', 'young', 'midlevel', 'veteran'],
      evaluationCriteria: [
        { level: 'S', description: '高度技術を含む全ての技術を安全に実施', points: 20 },
        { level: 'A', description: '一般的な技術を安全確実に実施', points: 16 },
        { level: 'B', description: '基本的技術を適切に実施', points: 12 },
        { level: 'C', description: '指導下で基本技術を実施', points: 8 },
        { level: 'D', description: '基本技術の習得が必要', points: 4 }
      ]
    },
    {
      id: 'N003',
      name: '患者・家族とのコミュニケーション',
      description: '療養者・家族との効果的な関係構築',
      category: 'interpersonal',
      weight: 15,
      experienceLevels: ['new', 'young', 'midlevel', 'veteran'],
      evaluationCriteria: [
        { level: 'S', description: '困難な状況でも適切な関係性を構築', points: 15 },
        { level: 'A', description: '良好な関係性を築きケアを提供', points: 12 },
        { level: 'B', description: '基本的なコミュニケーションを実施', points: 9 },
        { level: 'C', description: '指導を受けながらコミュニケーション', points: 6 },
        { level: 'D', description: 'コミュニケーション技術の向上が必要', points: 3 }
      ]
    },
    {
      id: 'N004',
      name: 'チームワーク・連携',
      description: '多職種チームでの協働・連携能力',
      category: 'interpersonal',
      weight: 12,
      experienceLevels: ['young', 'midlevel', 'veteran'],
      evaluationCriteria: [
        { level: 'S', description: 'チームリーダーとして調整・統括', points: 12 },
        { level: 'A', description: 'チームの中核として積極的に連携', points: 10 },
        { level: 'B', description: 'チームの一員として適切に連携', points: 8 },
        { level: 'C', description: '指導を受けながらチーム参加', points: 6 },
        { level: 'D', description: 'チームワーク向上が必要', points: 3 }
      ]
    },
    {
      id: 'N005',
      name: '安全管理・リスクマネジメント',
      description: '医療安全の確保と事故防止への取り組み',
      category: 'management',
      weight: 18,
      experienceLevels: ['new', 'young', 'midlevel', 'veteran'],
      evaluationCriteria: [
        { level: 'S', description: '安全管理体制の構築・改善を主導', points: 18 },
        { level: 'A', description: 'リスクを予測し予防的対策を実施', points: 14 },
        { level: 'B', description: 'ルールに従い安全なケアを提供', points: 11 },
        { level: 'C', description: '指導下で安全対策を実践', points: 8 },
        { level: 'D', description: '安全意識の向上が必要', points: 4 }
      ]
    },
    {
      id: 'N006',
      name: '後輩指導・教育',
      description: '後輩看護師の成長支援・教育指導',
      category: 'education',
      weight: 10,
      experienceLevels: ['midlevel', 'veteran'],
      evaluationCriteria: [
        { level: 'S', description: '教育プログラム開発・指導者育成', points: 10 },
        { level: 'A', description: '計画的で効果的な指導を実施', points: 8 },
        { level: 'B', description: '基本的な指導・アドバイスを提供', points: 6 },
        { level: 'C', description: '指導方法を学習中', points: 4 },
        { level: 'D', description: '指導技術の習得が必要', points: 2 }
      ]
    },
    {
      id: 'N007',
      name: '専門性向上・自己研鎖',
      description: '継続的な学習と専門性の向上',
      category: 'education',
      weight: 10,
      experienceLevels: ['new', 'young', 'midlevel', 'veteran'],
      evaluationCriteria: [
        { level: 'S', description: '専門領域のエキスパートとして活動', points: 10 },
        { level: 'A', description: '積極的に学習し専門性を向上', points: 8 },
        { level: 'B', description: '必要な研修・学習に参加', points: 6 },
        { level: 'C', description: '最低限の学習を実施', points: 4 },
        { level: 'D', description: '学習意欲の向上が必要', points: 2 }
      ]
    }
  ];

  // 看護部門用評価テンプレート
  const evaluationTemplates: NursingEvaluationTemplate[] = [
    {
      id: 'NT001',
      name: '急性期病棟スタッフナース',
      facilityType: 'acute',
      targetRole: 'staff',
      competencies: ['N001', 'N002', 'N003', 'N005', 'N007'],
      totalPoints: 100,
      description: '急性期病棟での基本的看護業務を担うスタッフナース向け'
    },
    {
      id: 'NT002',
      name: 'ICU看護師',
      facilityType: 'icu',
      targetRole: 'staff',
      competencies: ['N001', 'N002', 'N005', 'N007'],
      totalPoints: 100,
      description: '集中治療室での高度な看護技術が求められる看護師向け'
    },
    {
      id: 'NT003',
      name: '主任・チームリーダー',
      facilityType: 'acute',
      targetRole: 'leader',
      competencies: ['N001', 'N002', 'N003', 'N004', 'N005', 'N006', 'N007'],
      totalPoints: 100,
      description: 'チームリーダーや主任クラスの管理業務を含む看護師向け'
    },
    {
      id: 'NT004',
      name: '慢性期病棟看護師',
      facilityType: 'chronic',
      targetRole: 'staff',
      competencies: ['N002', 'N003', 'N004', 'N005', 'N007'],
      totalPoints: 100,
      description: '慢性期・回復期での継続的ケア重視の看護師向け'
    }
  ];

  // State定義
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customCompetencies, setCustomCompetencies] = useState<NursingCompetency[]>([]);
  const [newCompetency, setNewCompetency] = useState<Partial<NursingCompetency>>({
    name: '',
    description: '',
    category: 'clinical',
    weight: 10,
    experienceLevels: ['new']
  });
  const [showCustomForm, setShowCustomForm] = useState(false);

  // 統計計算
  const templatesByFacility = evaluationTemplates.reduce((acc, template) => {
    acc[template.facilityType] = (acc[template.facilityType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const competenciesByCategory = nursingCompetencies.reduce((acc, comp) => {
    acc[comp.category] = (acc[comp.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleSaveCustomCompetency = () => {
    if (newCompetency.name && newCompetency.description) {
      const competency: NursingCompetency = {
        id: `NC${Date.now()}`,
        name: newCompetency.name,
        description: newCompetency.description,
        category: newCompetency.category || 'clinical',
        weight: newCompetency.weight || 10,
        experienceLevels: newCompetency.experienceLevels || ['new'],
        evaluationCriteria: [
          { level: 'S', description: '優秀', points: newCompetency.weight || 10 },
          { level: 'A', description: '良好', points: Math.round((newCompetency.weight || 10) * 0.8) },
          { level: 'B', description: '標準', points: Math.round((newCompetency.weight || 10) * 0.6) },
          { level: 'C', description: '要改善', points: Math.round((newCompetency.weight || 10) * 0.4) },
          { level: 'D', description: '不十分', points: Math.round((newCompetency.weight || 10) * 0.2) }
        ]
      };
      
      setCustomCompetencies([...customCompetencies, competency]);
      setNewCompetency({ name: '', description: '', category: 'clinical', weight: 10, experienceLevels: ['new'] });
      setShowCustomForm(false);
      alert('カスタム能力要素が追加されました');
    }
  };

  const getCategoryBadge = (category: string) => {
    const styles = {
      clinical: 'bg-blue-100 text-blue-800',
      interpersonal: 'bg-green-100 text-green-800', 
      management: 'bg-purple-100 text-purple-800',
      education: 'bg-orange-100 text-orange-800',
      ethics: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      clinical: '臨床技術',
      interpersonal: '対人関係',
      management: '管理・運営',
      education: '教育・指導',
      ethics: '倫理・態度'
    };
    
    return (
      <Badge className={styles[category as keyof typeof styles]}>
        {labels[category as keyof typeof labels]}
      </Badge>
    );
  };

  const getFacilityTypeBadge = (facilityType: string) => {
    const styles = {
      acute: 'bg-red-100 text-red-800',
      chronic: 'bg-blue-100 text-blue-800',
      icu: 'bg-purple-100 text-purple-800',
      er: 'bg-orange-100 text-orange-800',
      outpatient: 'bg-green-100 text-green-800'
    };
    
    const labels = {
      acute: '急性期',
      chronic: '慢性期',
      icu: 'ICU',
      er: '救急',
      outpatient: '外来'
    };
    
    return (
      <Badge className={styles[facilityType as keyof typeof styles]}>
        {labels[facilityType as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <div>
      <CommonHeader title="看護部門評価設計" />
      <div className="container mx-auto p-6">
        {/* ヘッダー */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Stethoscope className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">看護職員評価設計システム</h1>
              <p className="text-gray-600">日本看護協会標準準拠の能力評価体系</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Link href="/evaluation-design">
                <ArrowLeft className="h-4 w-4 mr-2" />
                メイン設計に戻る
              </Link>
            </Button>
            <Button variant="outline">
              <HelpCircle className="h-4 w-4 mr-2" />
              使い方ガイド
            </Button>
          </div>
        </div>

        {/* 統計サマリー */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="border-2 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="mx-auto mb-2 p-2 bg-blue-500 rounded-full w-fit">
                <Target className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-blue-900 text-sm">能力要素</h3>
              <p className="text-2xl font-bold text-blue-600">{nursingCompetencies.length}項目</p>
              <p className="text-xs text-blue-700">標準フレームワーク</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="mx-auto mb-2 p-2 bg-green-500 rounded-full w-fit">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-green-900 text-sm">評価テンプレート</h3>
              <p className="text-2xl font-bold text-green-600">{evaluationTemplates.length}種類</p>
              <p className="text-xs text-green-700">部署・役職別</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="mx-auto mb-2 p-2 bg-purple-500 rounded-full w-fit">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-purple-900 text-sm">対象施設</h3>
              <p className="text-2xl font-bold text-purple-600">{Object.keys(templatesByFacility).length}タイプ</p>
              <p className="text-xs text-purple-700">急性期・慢性期等</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200">
            <CardContent className="p-4 text-center">
              <div className="mx-auto mb-2 p-2 bg-orange-500 rounded-full w-fit">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-orange-900 text-sm">カスタム要素</h3>
              <p className="text-2xl font-bold text-orange-600">{customCompetencies.length}項目</p>
              <p className="text-xs text-orange-700">独自追加項目</p>
            </CardContent>
          </Card>
        </div>

        {/* タブナビゲーション */}
        <div className="mb-6">
          <div className="flex gap-2 border-b">
            {[
              { id: 'overview', label: '概要', icon: Eye },
              { id: 'competencies', label: '能力要素', icon: Target },
              { id: 'templates', label: 'テンプレート', icon: FileText },
              { id: 'custom', label: 'カスタム設計', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* タブコンテンツ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 看護評価体系の説明 */}
            <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-6 w-6 text-blue-600" />
                  看護職員評価システムの特徴
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">評価フレームワーク</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        日本看護協会「看護師のクリニカルラダー」準拠
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        経験年数・役職に応じた段階的評価
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        施設特性（急性期・慢性期）に対応
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        多職種連携・チームワーク重視
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">能力カテゴリー</h4>
                    <div className="space-y-2">
                      {Object.entries(competenciesByCategory).map(([category, count]) => (
                        <div key={category} className="flex items-center justify-between">
                          {getCategoryBadge(category)}
                          <span className="text-sm font-medium">{count}項目</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* クイックアクション */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="hover:shadow-lg transition-all cursor-pointer">
                <CardHeader className="text-center">
                  <Sparkles className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">AI推奨設定</CardTitle>
                  <CardDescription>部署・役職に最適な評価項目を自動選定</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Zap className="h-4 w-4 mr-2" />
                    AI設定開始
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all cursor-pointer">
                <CardHeader className="text-center">
                  <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">テンプレート選択</CardTitle>
                  <CardDescription>標準的な評価テンプレートから選択</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActiveTab('templates')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    テンプレート確認
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all cursor-pointer">
                <CardHeader className="text-center">
                  <Settings className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">カスタム設計</CardTitle>
                  <CardDescription>独自の能力要素を追加・設計</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActiveTab('custom')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    カスタム作成
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'competencies' && (
          <div className="space-y-6">
            {/* 能力要素一覧 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  標準能力要素一覧
                </CardTitle>
                <CardDescription>
                  日本看護協会標準に基づく7つの基本能力要素
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {nursingCompetencies.map((competency) => (
                    <Card key={competency.id} className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-bold text-lg">{competency.name}</h4>
                              {getCategoryBadge(competency.category)}
                              <Badge className="bg-gray-100 text-gray-800">{competency.weight}点</Badge>
                            </div>
                            <p className="text-gray-600 mb-3">{competency.description}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">対象レベル:</span>
                              {competency.experienceLevels.map(level => (
                                <Badge key={level} variant="outline" className="text-xs">
                                  {level === 'new' ? '新人' : 
                                   level === 'young' ? '若手' :
                                   level === 'midlevel' ? '中堅' : 'ベテラン'}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-5 gap-2 text-xs">
                          {competency.evaluationCriteria.map((criteria) => (
                            <div key={criteria.level} className="text-center p-2 bg-gray-50 rounded">
                              <div className="font-bold">{criteria.level}</div>
                              <div className="text-gray-600">{criteria.points}pt</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-6">
            {/* テンプレート選択 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  評価テンプレート
                </CardTitle>
                <CardDescription>
                  部署・役職別の標準評価テンプレート
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {evaluationTemplates.map((template) => {
                    const isSelected = selectedTemplate === template.id;
                    return (
                      <Card 
                        key={template.id} 
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          isSelected ? 'border-2 border-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg mb-2">{template.name}</CardTitle>
                              <div className="flex gap-2 mb-2">
                                {getFacilityTypeBadge(template.facilityType)}
                                <Badge variant="outline">
                                  {template.targetRole === 'staff' ? 'スタッフ' :
                                   template.targetRole === 'senior' ? 'シニア' :
                                   template.targetRole === 'leader' ? 'リーダー' : 'マネージャー'}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{template.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600">{template.totalPoints}</div>
                              <div className="text-xs text-gray-500">点満点</div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            <div className="text-sm font-medium">含まれる能力要素:</div>
                            <div className="grid grid-cols-2 gap-1 text-xs">
                              {template.competencies.map(compId => {
                                const comp = nursingCompetencies.find(c => c.id === compId);
                                return comp ? (
                                  <div key={compId} className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3 text-green-600" />
                                    <span>{comp.name}</span>
                                  </div>
                                ) : null;
                              })}
                            </div>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <Button 
                              size="sm" 
                              variant={isSelected ? "default" : "outline"}
                              className={isSelected ? "bg-blue-600 hover:bg-blue-700" : ""}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              {isSelected ? '選択中' : '詳細確認'}
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Download className="h-4 w-4 mr-1" />
                              エクスポート
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* 選択中テンプレートの詳細 */}
            {selectedTemplate && (
              <Card className="border-2 border-blue-500">
                <CardHeader className="bg-blue-50">
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-blue-600" />
                    選択中テンプレート詳細
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {(() => {
                    const template = evaluationTemplates.find(t => t.id === selectedTemplate);
                    if (!template) return null;
                    
                    return (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold">{template.name}</h3>
                          <div className="flex gap-2">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                              <Save className="h-4 w-4 mr-2" />
                              この設定で作成
                            </Button>
                            <Button variant="outline">
                              <Edit3 className="h-4 w-4 mr-2" />
                              カスタマイズ
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label className="text-sm font-medium">施設タイプ</Label>
                            <div className="mt-1">
                              {getFacilityTypeBadge(template.facilityType)}
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">対象役職</Label>
                            <div className="mt-1">
                              <Badge variant="outline">
                                {template.targetRole === 'staff' ? 'スタッフナース' :
                                 template.targetRole === 'senior' ? 'シニアナース' :
                                 template.targetRole === 'leader' ? 'チームリーダー' : 'マネージャー'}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">総配点</Label>
                            <div className="text-2xl font-bold text-blue-600 mt-1">
                              {template.totalPoints}点
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium mb-2 block">能力要素構成</Label>
                          <div className="space-y-2">
                            {template.competencies.map(compId => {
                              const comp = nursingCompetencies.find(c => c.id === compId);
                              return comp ? (
                                <div key={compId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <div>
                                      <span className="font-medium">{comp.name}</span>
                                      <div className="text-sm text-gray-600">{comp.description}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {getCategoryBadge(comp.category)}
                                    <Badge className="bg-blue-100 text-blue-800">{comp.weight}点</Badge>
                                  </div>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'custom' && (
          <div className="space-y-6">
            {/* カスタム能力要素作成 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-green-600" />
                  カスタム能力要素の作成
                </CardTitle>
                <CardDescription>
                  施設独自の能力要素を追加できます
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showCustomForm ? (
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">独自の評価項目を追加</h3>
                      <p className="text-gray-500 mb-4">標準的な能力要素に加えて、施設特有の評価項目を設定できます</p>
                    </div>
                    <Button onClick={() => setShowCustomForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      新しい能力要素を追加
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">能力要素名</Label>
                        <Input
                          id="name"
                          value={newCompetency.name || ''}
                          onChange={(e) => setNewCompetency({...newCompetency, name: e.target.value})}
                          placeholder="例: 地域連携・在宅支援"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">カテゴリー</Label>
                        <Select 
                          value={newCompetency.category} 
                          onValueChange={(value) => setNewCompetency({...newCompetency, category: value as any})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="clinical">臨床技術</SelectItem>
                            <SelectItem value="interpersonal">対人関係</SelectItem>
                            <SelectItem value="management">管理・運営</SelectItem>
                            <SelectItem value="education">教育・指導</SelectItem>
                            <SelectItem value="ethics">倫理・態度</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">詳細説明</Label>
                      <Textarea
                        id="description"
                        value={newCompetency.description || ''}
                        onChange={(e) => setNewCompetency({...newCompetency, description: e.target.value})}
                        placeholder="この能力要素の評価内容と重要性を説明してください"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="weight">配点</Label>
                        <Input
                          id="weight"
                          type="number"
                          min="1"
                          max="30"
                          value={newCompetency.weight || ''}
                          onChange={(e) => setNewCompetency({...newCompetency, weight: parseInt(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label>対象経験レベル</Label>
                        <div className="flex gap-2 mt-2">
                          {[
                            { id: 'new', label: '新人' },
                            { id: 'young', label: '若手' },
                            { id: 'midlevel', label: '中堅' },
                            { id: 'veteran', label: 'ベテラン' }
                          ].map((level) => (
                            <Badge 
                              key={level.id}
                              variant={newCompetency.experienceLevels?.includes(level.id) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => {
                                const levels = newCompetency.experienceLevels || [];
                                const newLevels = levels.includes(level.id) 
                                  ? levels.filter(l => l !== level.id)
                                  : [...levels, level.id];
                                setNewCompetency({...newCompetency, experienceLevels: newLevels});
                              }}
                            >
                              {level.label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={handleSaveCustomCompetency}>
                        <Save className="h-4 w-4 mr-2" />
                        保存
                      </Button>
                      <Button variant="outline" onClick={() => setShowCustomForm(false)}>
                        キャンセル
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* カスタム能力要素一覧 */}
            {customCompetencies.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-orange-600" />
                    カスタム能力要素
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {customCompetencies.map((competency) => (
                      <div key={competency.id} className="flex items-center justify-between p-4 border rounded-lg bg-orange-50">
                        <div className="flex items-center gap-3">
                          <div>
                            <h4 className="font-bold">{competency.name}</h4>
                            <p className="text-sm text-gray-600">{competency.description}</p>
                            <div className="flex gap-2 mt-2">
                              {getCategoryBadge(competency.category)}
                              <Badge className="bg-orange-100 text-orange-800">{competency.weight}点</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              setCustomCompetencies(customCompetencies.filter(c => c.id !== competency.id));
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}