'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User,
  Users,
  Save,
  AlertCircle,
  Target,
  BookOpen,
  Heart,
  Shield,
  TrendingUp,
  Star,
  Award,
  ArrowLeft,
  CheckCircle2,
  Search,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import EvaluationNavigation from '@/components/evaluation/EvaluationNavigation';
import DashboardButton from '@/components/DashboardButton';

interface StaffMember {
  id: string;
  name: string;
  department: string;
  position: string;
  selfEvaluationStatus: 'completed' | 'pending' | 'not_started';
  selfEvaluationScore?: number;
}

interface SupervisorScores {
  basicSkills: number;
  expertise: number;
  patientCare: number;
  teamwork: number;
  safety: number;
  problemSolving: number;
  growth: number;
  leadership: number;
}

export default function TechnicalSupervisorEvaluationPage() {
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [evaluationYear, setEvaluationYear] = useState(2024);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  
  const [scores, setScores] = useState<SupervisorScores>({
    basicSkills: 0,
    expertise: 0,
    patientCare: 0,
    teamwork: 0,
    safety: 0,
    problemSolving: 0,
    growth: 0,
    leadership: 0
  });

  const [comments, setComments] = useState({
    strengths: '',
    improvements: '',
    goals: '',
    overall: ''
  });

  const mockStaffList: StaffMember[] = [
    { id: '001', name: '山田太郎', department: '看護部', position: '看護師', selfEvaluationStatus: 'completed', selfEvaluationScore: 42.5 },
    { id: '002', name: '佐藤花子', department: '看護部', position: '主任看護師', selfEvaluationStatus: 'completed', selfEvaluationScore: 45.0 },
    { id: '003', name: '田中一郎', department: 'リハビリ部', position: '理学療法士', selfEvaluationStatus: 'pending', selfEvaluationScore: 38.0 },
    { id: '004', name: '鈴木美咲', department: '薬剤部', position: '薬剤師', selfEvaluationStatus: 'not_started' },
    { id: '005', name: '高橋健太', department: '検査部', position: '臨床検査技師', selfEvaluationStatus: 'completed', selfEvaluationScore: 41.0 },
  ];

  const evaluationItems = [
    { 
      key: 'basicSkills' as keyof SupervisorScores, 
      label: '基本技術', 
      icon: Target, 
      description: '職務遂行に必要な基本的な技術・スキル'
    },
    { 
      key: 'expertise' as keyof SupervisorScores, 
      label: '専門知識', 
      icon: BookOpen, 
      description: '専門分野における知識の深さと応用力'
    },
    { 
      key: 'patientCare' as keyof SupervisorScores, 
      label: '患者対応', 
      icon: Heart, 
      description: '患者・家族への接遇、コミュニケーション'
    },
    { 
      key: 'teamwork' as keyof SupervisorScores, 
      label: 'チームワーク', 
      icon: Users, 
      description: '多職種連携、同僚との協調性'
    },
    { 
      key: 'safety' as keyof SupervisorScores, 
      label: '安全管理', 
      icon: Shield, 
      description: '医療安全、感染対策の実践'
    },
    { 
      key: 'problemSolving' as keyof SupervisorScores, 
      label: '問題解決', 
      icon: TrendingUp, 
      description: '課題発見と改善への取り組み'
    },
    { 
      key: 'growth' as keyof SupervisorScores, 
      label: '成長意欲', 
      icon: Star, 
      description: '学習意欲、自己研鑽への姿勢'
    },
    { 
      key: 'leadership' as keyof SupervisorScores, 
      label: 'リーダーシップ', 
      icon: Award, 
      description: '後輩指導、チームリード能力'
    }
  ];

  const calculateSupervisorScore = (): number => {
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    return (total / 40) * 50;
  };

  const calculateTotalScore = (): number => {
    if (!selectedStaff?.selfEvaluationScore) return calculateSupervisorScore() * 0.6;
    return (calculateSupervisorScore() * 0.6) + (selectedStaff.selfEvaluationScore * 0.4);
  };

  const getCompletionRate = (): number => {
    const filledItems = Object.values(scores).filter(score => score > 0).length;
    return (filledItems / 8) * 100;
  };

  const filteredStaff = mockStaffList.filter(staff => {
    const matchesSearch = staff.name.includes(searchTerm) || staff.id.includes(searchTerm);
    const matchesDepartment = departmentFilter === 'all' || staff.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const handleSave = async (isSubmit: boolean = false) => {
    if (!selectedStaff) {
      alert('評価対象職員を選択してください');
      return;
    }

    setIsSaving(true);
    try {
      console.log('上司評価保存:', {
        staffId: selectedStaff.id,
        year: evaluationYear,
        scores,
        supervisorScore: calculateSupervisorScore(),
        totalScore: calculateTotalScore(),
        comments,
        isSubmit
      });
      
      alert(isSubmit ? '上司評価を確定しました' : '一時保存しました');
    } catch (error) {
      console.error('Save failed:', error);
      alert('保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  const updateScore = (key: keyof SupervisorScores, value: number) => {
    setScores(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <EvaluationNavigation />
      
      <div className="mb-6">
        <Link href="/evaluation/technical" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          技術評価フローへ戻る
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">上司評価入力</h1>
        <p className="text-gray-600">
          部下の技術評価を行います（配点60%）
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                評価対象選択
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>検索</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="氏名または職員番号"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label>部署フィルター</Label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  >
                    <option value="all">全部署</option>
                    <option value="看護部">看護部</option>
                    <option value="リハビリ部">リハビリ部</option>
                    <option value="薬剤部">薬剤部</option>
                    <option value="検査部">検査部</option>
                  </select>
                </div>

                <div className="border rounded-lg max-h-96 overflow-y-auto">
                  {filteredStaff.map((staff) => (
                    <button
                      key={staff.id}
                      onClick={() => setSelectedStaff(staff)}
                      className={`w-full p-3 text-left hover:bg-gray-50 border-b last:border-b-0 ${
                        selectedStaff?.id === staff.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{staff.name}</p>
                          <p className="text-sm text-gray-600">{staff.department} / {staff.position}</p>
                        </div>
                        <Badge variant={
                          staff.selfEvaluationStatus === 'completed' ? 'default' :
                          staff.selfEvaluationStatus === 'pending' ? 'secondary' : 'outline'
                        }>
                          {staff.selfEvaluationStatus === 'completed' ? '自己評価済' :
                           staff.selfEvaluationStatus === 'pending' ? '入力中' : '未開始'}
                        </Badge>
                      </div>
                      {staff.selfEvaluationScore && (
                        <p className="text-xs text-gray-500 mt-1">
                          自己評価: {staff.selfEvaluationScore.toFixed(1)}点
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedStaff ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">上司評価点</p>
                      <p className="text-2xl font-bold">{calculateSupervisorScore().toFixed(1)}</p>
                      <p className="text-sm text-gray-600">/ 50点（配点60%）</p>
                    </div>
                  </CardContent>
                </Card>

                {selectedStaff.selfEvaluationScore && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">自己評価点</p>
                        <p className="text-2xl font-bold">{selectedStaff.selfEvaluationScore.toFixed(1)}</p>
                        <p className="text-sm text-gray-600">/ 50点（配点40%）</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">総合評価点</p>
                      <p className="text-2xl font-bold text-blue-600">{calculateTotalScore().toFixed(1)}</p>
                      <p className="text-sm text-gray-600">/ 50点</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>評価入力 - {selectedStaff.name}</CardTitle>
                  <CardDescription>
                    各項目を5段階で評価してください
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="evaluation">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="evaluation">評価項目</TabsTrigger>
                      <TabsTrigger value="comments">コメント</TabsTrigger>
                    </TabsList>

                    <TabsContent value="evaluation" className="space-y-4 mt-4">
                      {evaluationItems.map((item) => {
                        const Icon = item.icon;
                        
                        return (
                          <div key={item.key} className="border rounded-lg p-4">
                            <div className="flex items-start gap-3 mb-3">
                              <Icon className="h-5 w-5 text-gray-600 mt-1" />
                              <div className="flex-1">
                                <h4 className="font-semibold">{item.label}</h4>
                                <p className="text-sm text-gray-600">{item.description}</p>
                              </div>
                              {scores[item.key] > 0 && (
                                <Badge variant="secondary">
                                  評価: {scores[item.key]}
                                </Badge>
                              )}
                            </div>
                            
                            <RadioGroup
                              value={scores[item.key].toString()}
                              onValueChange={(value) => updateScore(item.key, parseInt(value))}
                              className="flex gap-4"
                            >
                              {[5, 4, 3, 2, 1].map((value) => (
                                <div key={value} className="flex flex-col items-center">
                                  <RadioGroupItem value={value.toString()} id={`${item.key}-${value}`} />
                                  <Label htmlFor={`${item.key}-${value}`} className="mt-1 cursor-pointer text-xs">
                                    {value === 5 ? '卓越' :
                                     value === 4 ? '優秀' :
                                     value === 3 ? '良好' :
                                     value === 2 ? '標準' : '要改善'}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        );
                      })}
                    </TabsContent>

                    <TabsContent value="comments" className="space-y-4 mt-4">
                      <div>
                        <Label>強み・優れている点</Label>
                        <Textarea
                          placeholder="技術面での強みや、特に優れている点を記入"
                          value={comments.strengths}
                          onChange={(e) => setComments(prev => ({ ...prev, strengths: e.target.value }))}
                          className="min-h-[100px]"
                        />
                      </div>
                      
                      <div>
                        <Label>改善が必要な点</Label>
                        <Textarea
                          placeholder="今後改善が必要な技術面での課題を記入"
                          value={comments.improvements}
                          onChange={(e) => setComments(prev => ({ ...prev, improvements: e.target.value }))}
                          className="min-h-[100px]"
                        />
                      </div>
                      
                      <div>
                        <Label>次年度の目標・期待</Label>
                        <Textarea
                          placeholder="次年度に向けた期待や目標を記入"
                          value={comments.goals}
                          onChange={(e) => setComments(prev => ({ ...prev, goals: e.target.value }))}
                          className="min-h-[100px]"
                        />
                      </div>
                      
                      <div>
                        <Label>総合所見</Label>
                        <Textarea
                          placeholder="年間を通じた総合的な評価所見を記入"
                          value={comments.overall}
                          onChange={(e) => setComments(prev => ({ ...prev, overall: e.target.value }))}
                          className="min-h-[120px]"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => handleSave(false)}
                  disabled={isSaving}
                >
                  一時保存
                </Button>
                
                <Button 
                  onClick={() => {
                    if (getCompletionRate() < 100) {
                      alert('すべての評価項目を入力してください');
                      return;
                    }
                    if (window.confirm(`${selectedStaff.name}さんの上司評価を確定します。よろしいですか？`)) {
                      handleSave(true);
                    }
                  }}
                  disabled={isSaving || getCompletionRate() < 100}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  評価を確定
                </Button>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="pt-8 pb-8">
                <div className="text-center text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4" />
                  <p>左側のリストから評価対象職員を選択してください</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Alert className="mt-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>上司評価について</AlertTitle>
        <AlertDescription className="mt-2 space-y-1">
          <p>• 上司評価は技術評価全体の60%の配点となります</p>
          <p>• 自己評価が完了している職員から優先的に評価を行ってください</p>
          <p>• 評価確定後も、最終承認まで修正可能です</p>
        </AlertDescription>
      </Alert>
      
      <DashboardButton />
    </div>
  );
}