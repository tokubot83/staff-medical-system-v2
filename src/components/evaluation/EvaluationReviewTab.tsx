import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  User,
  UserCheck,
  AlertTriangle,
  MessageSquare,
  ChevronRight,
  Eye,
  EyeOff,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  Send,
  Save,
  History
} from 'lucide-react';

interface EvaluationItem {
  id: string;
  category: string;
  name: string;
  description: string;
  maxScore: number;
  supervisorScore: number;
  selfScore: number;
  gap: number;
  status: 'match' | 'minor_gap' | 'major_gap';
}

interface ReviewComment {
  id: string;
  author: 'supervisor' | 'self' | 'hr';
  authorName: string;
  content: string;
  timestamp: string;
  category?: string;
}

interface EvaluationReviewData {
  staffId: string;
  staffName: string;
  department: string;
  position: string;
  evaluationPeriod: string;
  supervisorName: string;
  technicalEvaluation: {
    corporate: EvaluationItem[];
    facility: EvaluationItem[];
  };
  contributionEvaluation: {
    facility: EvaluationItem[];
    corporate: EvaluationItem[];
  };
  totalScores: {
    supervisorTotal: number;
    selfTotal: number;
    gap: number;
  };
  comments: ReviewComment[];
  status: 'draft' | 'under_review' | 'confirmed' | 'finalized';
}

interface EvaluationReviewTabProps {
  evaluationData?: EvaluationReviewData;
  onSave?: (data: any) => void;
  onConfirm?: (data: any) => void;
}

const EvaluationReviewTab: React.FC<EvaluationReviewTabProps> = ({
  evaluationData,
  onSave,
  onConfirm
}) => {
  // サンプルデータ
  const sampleData: EvaluationReviewData = {
    staffId: 'NS001',
    staffName: '田中 花子',
    department: '看護部',
    position: '看護師（中堅）',
    evaluationPeriod: '2025年度',
    supervisorName: '山田 太郎',
    technicalEvaluation: {
      corporate: [
        {
          id: 'CORP001',
          category: '法人統一',
          name: '医療安全管理',
          description: '医療安全に関する知識と実践、インシデント対応能力',
          maxScore: 6,
          supervisorScore: 5,
          selfScore: 4,
          gap: 1,
          status: 'minor_gap'
        },
        {
          id: 'CORP002',
          category: '法人統一',
          name: '感染対策',
          description: '感染予防策の理解と実践、標準予防策の遵守',
          maxScore: 6,
          supervisorScore: 6,
          selfScore: 6,
          gap: 0,
          status: 'match'
        },
        {
          id: 'CORP003',
          category: '法人統一',
          name: '身体拘束適正化',
          description: '身体拘束廃止への取り組み、適切な代替ケアの実施',
          maxScore: 5,
          supervisorScore: 4,
          selfScore: 5,
          gap: -1,
          status: 'minor_gap'
        }
      ],
      facility: [
        {
          id: 'FAC001',
          category: '施設特化',
          name: '救急対応スキル',
          description: '救急患者への初期対応、トリアージ能力',
          maxScore: 5,
          supervisorScore: 4,
          selfScore: 3,
          gap: 1,
          status: 'minor_gap'
        },
        {
          id: 'FAC002',
          category: '施設特化',
          name: '高度医療機器操作',
          description: '人工呼吸器、心電図モニター等の操作・管理',
          maxScore: 5,
          supervisorScore: 3,
          selfScore: 5,
          gap: -2,
          status: 'major_gap'
        }
      ]
    },
    contributionEvaluation: {
      facility: [
        {
          id: 'FC001',
          category: '施設貢献',
          name: '医療・ケアの質向上への取組',
          description: '施設内での医療・ケア品質向上活動への参画・貢献',
          maxScore: 8,
          supervisorScore: 7,
          selfScore: 6,
          gap: 1,
          status: 'minor_gap'
        },
        {
          id: 'FC002',
          category: '施設貢献',
          name: '職員教育・指導への貢献',
          description: '新人・後輩職員の教育指導、OJTでの役割発揮',
          maxScore: 8,
          supervisorScore: 8,
          selfScore: 7,
          gap: 1,
          status: 'minor_gap'
        }
      ],
      corporate: [
        {
          id: 'CC001',
          category: '法人貢献',
          name: '法人理念・方針の実践',
          description: '法人理念の理解と日常業務での実践・体現',
          maxScore: 8,
          supervisorScore: 7,
          selfScore: 7,
          gap: 0,
          status: 'match'
        },
        {
          id: 'CC002',
          category: '法人貢献',
          name: '法人全体への貢献活動',
          description: '施設を越えた法人レベルでの活動・貢献',
          maxScore: 8,
          supervisorScore: 6,
          selfScore: 5,
          gap: 1,
          status: 'minor_gap'
        }
      ]
    },
    totalScores: {
      supervisorTotal: 82,
      selfTotal: 79,
      gap: 3
    },
    comments: [
      {
        id: 'COM001',
        author: 'supervisor',
        authorName: '山田 太郎',
        content: '医療安全管理については、インシデント報告の質が向上しており評価できます。継続的な取り組みを期待します。',
        timestamp: '2025-03-10 14:30',
        category: '医療安全管理'
      },
      {
        id: 'COM002',
        author: 'self',
        authorName: '田中 花子',
        content: '高度医療機器操作については、今年度研修を受講し実践経験を積んできました。自己評価は妥当と考えています。',
        timestamp: '2025-03-11 09:15',
        category: '高度医療機器操作'
      }
    ],
    status: 'under_review'
  };

  const [data] = useState<EvaluationReviewData>(evaluationData || sampleData);
  const [newComment, setNewComment] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showSelfScores, setShowSelfScores] = useState(true);
  const [showGapAnalysis, setShowGapAnalysis] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // 評価差異の分析
  const analyzeGaps = () => {
    const allItems = [
      ...data.technicalEvaluation.corporate,
      ...data.technicalEvaluation.facility,
      ...data.contributionEvaluation.facility,
      ...data.contributionEvaluation.corporate
    ];

    const majorGaps = allItems.filter(item => Math.abs(item.gap) >= 2);
    const minorGaps = allItems.filter(item => Math.abs(item.gap) === 1);
    const matches = allItems.filter(item => item.gap === 0);

    return { majorGaps, minorGaps, matches, total: allItems.length };
  };

  const gapAnalysis = analyzeGaps();

  // 評価項目の表示コンポーネント
  const renderEvaluationItem = (item: EvaluationItem) => {
    const getGapIcon = () => {
      if (item.gap === 0) return <CheckCircle className="h-4 w-4 text-green-600" />;
      if (Math.abs(item.gap) === 1) return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    };

    const getGapBadge = () => {
      if (item.gap === 0) return <Badge className="bg-green-100 text-green-800">一致</Badge>;
      if (item.gap > 0) return <Badge className="bg-blue-100 text-blue-800">上司評価が高い</Badge>;
      return <Badge className="bg-orange-100 text-orange-800">自己評価が高い</Badge>;
    };

    return (
      <Card key={item.id} className="mb-3">
        <CardContent className="pt-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold">{item.name}</h4>
                {getGapIcon()}
                {getGapBadge()}
              </div>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">上司評価</div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-blue-600">
                  {item.supervisorScore}
                </div>
                <div className="text-sm text-gray-500">/ {item.maxScore}</div>
              </div>
              <Progress 
                value={(item.supervisorScore / item.maxScore) * 100} 
                className="h-2 mt-1"
              />
            </div>

            {showSelfScores && (
              <div>
                <div className="text-sm text-gray-500 mb-1">自己評価</div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-green-600">
                    {item.selfScore}
                  </div>
                  <div className="text-sm text-gray-500">/ {item.maxScore}</div>
                </div>
                <Progress 
                  value={(item.selfScore / item.maxScore) * 100} 
                  className="h-2 mt-1"
                />
              </div>
            )}

            {showGapAnalysis && (
              <div>
                <div className="text-sm text-gray-500 mb-1">評価差</div>
                <div className="flex items-center gap-2">
                  <div className={`text-2xl font-bold ${
                    item.gap === 0 ? 'text-green-600' : 
                    Math.abs(item.gap) === 1 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {item.gap > 0 ? '+' : ''}{item.gap}
                  </div>
                  {item.gap > 0 && <TrendingUp className="h-4 w-4 text-blue-600" />}
                  {item.gap < 0 && <TrendingDown className="h-4 w-4 text-orange-600" />}
                  {item.gap === 0 && <Minus className="h-4 w-4 text-green-600" />}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.abs(item.gap)} ポイント差
                </div>
              </div>
            )}
          </div>

          {/* 項目別コメント表示 */}
          {data.comments.filter(c => c.category === item.name).map(comment => (
            <Alert key={comment.id} className="mt-3">
              <MessageSquare className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-sm">
                      {comment.authorName} ({comment.author === 'supervisor' ? '上司' : '本人'})
                    </div>
                    <div className="text-sm mt-1">{comment.content}</div>
                  </div>
                  <div className="text-xs text-gray-500">{comment.timestamp}</div>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー情報 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">評価確認（Review）</CardTitle>
              <CardDescription>上司評価と自己評価の比較・確認</CardDescription>
            </div>
            <Badge className={
              data.status === 'finalized' ? 'bg-green-600' :
              data.status === 'confirmed' ? 'bg-blue-600' :
              data.status === 'under_review' ? 'bg-yellow-600' :
              'bg-gray-600'
            }>
              {data.status === 'finalized' ? '確定済み' :
               data.status === 'confirmed' ? '承認済み' :
               data.status === 'under_review' ? '確認中' :
               '下書き'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-500">職員名</div>
              <div className="font-semibold">{data.staffName}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">部署・職位</div>
              <div className="font-semibold">{data.department} / {data.position}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">評価者</div>
              <div className="font-semibold">{data.supervisorName}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">評価期間</div>
              <div className="font-semibold">{data.evaluationPeriod}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 表示オプション */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant={showSelfScores ? "default" : "outline"}
                size="sm"
                onClick={() => setShowSelfScores(!showSelfScores)}
              >
                {showSelfScores ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                自己評価
              </Button>
              <Button
                variant={showGapAnalysis ? "default" : "outline"}
                size="sm"
                onClick={() => setShowGapAnalysis(!showGapAnalysis)}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                差異分析
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm">
                <span className="text-green-600 font-semibold">{gapAnalysis.matches.length}</span> 一致 /
                <span className="text-yellow-600 font-semibold ml-2">{gapAnalysis.minorGaps.length}</span> 軽微差 /
                <span className="text-red-600 font-semibold ml-2">{gapAnalysis.majorGaps.length}</span> 大幅差
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* メインコンテンツ */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">総合評価</TabsTrigger>
          <TabsTrigger value="technical">技術評価</TabsTrigger>
          <TabsTrigger value="contribution">組織貢献</TabsTrigger>
          <TabsTrigger value="comments">コメント</TabsTrigger>
        </TabsList>

        {/* 総合評価タブ */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>総合評価サマリー</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <Card className="border-blue-200">
                  <CardHeader className="text-center pb-3">
                    <UserCheck className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <CardTitle className="text-lg">上司評価</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {data.totalScores.supervisorTotal}
                    </div>
                    <div className="text-sm text-gray-600">/ 100点</div>
                    <Progress 
                      value={data.totalScores.supervisorTotal} 
                      className="h-3 mt-3"
                    />
                  </CardContent>
                </Card>

                <Card className="border-green-200">
                  <CardHeader className="text-center pb-3">
                    <User className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <CardTitle className="text-lg">自己評価</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {data.totalScores.selfTotal}
                    </div>
                    <div className="text-sm text-gray-600">/ 100点</div>
                    <Progress 
                      value={data.totalScores.selfTotal} 
                      className="h-3 mt-3"
                    />
                  </CardContent>
                </Card>

                <Card className={`border-${Math.abs(data.totalScores.gap) <= 5 ? 'green' : Math.abs(data.totalScores.gap) <= 10 ? 'yellow' : 'red'}-200`}>
                  <CardHeader className="text-center pb-3">
                    <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <CardTitle className="text-lg">評価差</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className={`text-3xl font-bold ${
                      Math.abs(data.totalScores.gap) <= 5 ? 'text-green-600' :
                      Math.abs(data.totalScores.gap) <= 10 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {data.totalScores.gap > 0 ? '+' : ''}{data.totalScores.gap}
                    </div>
                    <div className="text-sm text-gray-600">ポイント差</div>
                    <Badge className={`mt-3 ${
                      Math.abs(data.totalScores.gap) <= 5 ? 'bg-green-100 text-green-800' :
                      Math.abs(data.totalScores.gap) <= 10 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {Math.abs(data.totalScores.gap) <= 5 ? '適正範囲' :
                       Math.abs(data.totalScores.gap) <= 10 ? '要確認' :
                       '要調整'}
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              {/* 差異が大きい項目のアラート */}
              {gapAnalysis.majorGaps.length > 0 && (
                <Alert className="mt-6 border-red-200">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription>
                    <div className="font-semibold text-red-800 mb-2">
                      評価差が大きい項目があります（{gapAnalysis.majorGaps.length}件）
                    </div>
                    <div className="space-y-1">
                      {gapAnalysis.majorGaps.map(item => (
                        <div key={item.id} className="text-sm">
                          • {item.name}（差: {item.gap > 0 ? '+' : ''}{item.gap}点）
                        </div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 技術評価タブ */}
        <TabsContent value="technical">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>法人統一項目（30点）</CardTitle>
              </CardHeader>
              <CardContent>
                {data.technicalEvaluation.corporate.map(renderEvaluationItem)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>施設特化項目（20点）</CardTitle>
              </CardHeader>
              <CardContent>
                {data.technicalEvaluation.facility.map(renderEvaluationItem)}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 組織貢献タブ */}
        <TabsContent value="contribution">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>施設貢献（25点）</CardTitle>
              </CardHeader>
              <CardContent>
                {data.contributionEvaluation.facility.map(renderEvaluationItem)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>法人貢献（25点）</CardTitle>
              </CardHeader>
              <CardContent>
                {data.contributionEvaluation.corporate.map(renderEvaluationItem)}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* コメントタブ */}
        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>評価コメント</CardTitle>
              <CardDescription>評価に関するコメント・フィードバック</CardDescription>
            </CardHeader>
            <CardContent>
              {/* 既存コメント表示 */}
              <div className="space-y-4 mb-6">
                {data.comments.map(comment => (
                  <Card key={comment.id} className={
                    comment.author === 'supervisor' ? 'border-blue-200' :
                    comment.author === 'self' ? 'border-green-200' :
                    'border-gray-200'
                  }>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {comment.author === 'supervisor' ? 
                            <UserCheck className="h-4 w-4 text-blue-600" /> :
                            <User className="h-4 w-4 text-green-600" />
                          }
                          <span className="font-semibold">{comment.authorName}</span>
                          <Badge variant="outline">
                            {comment.author === 'supervisor' ? '上司' :
                             comment.author === 'self' ? '本人' : 'HR'}
                          </Badge>
                          {comment.category && (
                            <Badge className="bg-gray-100">{comment.category}</Badge>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">{comment.timestamp}</span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* 新規コメント入力 */}
              <Card className="border-2 border-dashed">
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>コメント対象</Label>
                        <select 
                          className="w-full p-2 border rounded-md"
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                          <option value="">全体</option>
                          <option value="医療安全管理">医療安全管理</option>
                          <option value="感染対策">感染対策</option>
                          <option value="高度医療機器操作">高度医療機器操作</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <Label>コメント内容</Label>
                      <Textarea
                        placeholder="評価に関するコメントを入力..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline">
                        <Save className="h-4 w-4 mr-2" />
                        下書き保存
                      </Button>
                      <Button>
                        <Send className="h-4 w-4 mr-2" />
                        コメント送信
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* アクションボタン */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <History className="h-4 w-4 mr-2" />
                評価履歴
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                PDF出力
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onSave}>
                <Save className="h-4 w-4 mr-2" />
                保存
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={onConfirm}
                disabled={gapAnalysis.majorGaps.length > 0}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                評価確認完了
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EvaluationReviewTab;