'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Settings,
  Download,
  Upload,
  Check,
  AlertCircle,
  FileSpreadsheet,
  Building,
  Users,
  Award,
  BookOpen,
  TrendingUp,
  Target
} from 'lucide-react';
import {
  coreEvaluationItems,
  facilitySpecificItems,
  facilityTypeNames,
  jobCategoryNames,
  experienceLevelNames
} from '@/data/evaluationMasterData';
import type { FacilityType, JobCategory, MajorEvaluationItem, FacilityEvaluationConfig } from '@/types/evaluation-config';
import { EvaluationExcelService } from '@/services/evaluationExcelService';
import { EvaluationConfigStorage } from '@/services/evaluationConfigStorage';

export default function EvaluationConfigPage() {
  const [selectedFacility, setSelectedFacility] = useState<FacilityType>('acute');
  const [selectedItems, setSelectedItems] = useState<{[key: string]: number}>({});
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [facilityName, setFacilityName] = useState('急性期病院A');
  const [savedConfigs, setSavedConfigs] = useState<FacilityEvaluationConfig[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 保存済み設定の読み込み
  React.useEffect(() => {
    setSavedConfigs(EvaluationConfigStorage.getAllConfigs());
  }, []);

  // 選択可能な施設特化項目をフィルタリング
  const availableItems = facilitySpecificItems.filter(item => 
    !item.applicableFacilities || item.applicableFacilities.includes(selectedFacility)
  );

  // 合計点数計算
  const calculateTotalScore = () => {
    const coreTotal = 30; // コア項目固定
    const facilityTotal = Object.values(selectedItems).reduce((sum, score) => sum + score, 0);
    return coreTotal + facilityTotal;
  };

  // 項目選択・配点変更
  const handleItemSelection = (itemId: string, score: number) => {
    setSelectedItems(prev => {
      const newItems = { ...prev };
      if (score === 0) {
        delete newItems[itemId];
      } else {
        newItems[itemId] = score;
      }
      return newItems;
    });
  };

  // Excelエクスポート
  const handleExcelExport = async () => {
    setIsExporting(true);
    try {
      const blob = EvaluationExcelService.generateConfigTemplate({
        facilityType: selectedFacility,
        facilityName,
        configuredBy: '管理者',
        configuredAt: new Date()
      });
      
      // ダウンロード処理
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `評価項目設定_${facilityName}_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('Excelテンプレートをダウンロードしました');
    } catch (error) {
      console.error('Export error:', error);
      alert('エクスポートに失敗しました');
    } finally {
      setIsExporting(false);
    }
  };
  
  // Excelインポート
  const handleExcelImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    try {
      const config = await EvaluationExcelService.parseConfigFile(file);
      
      // インポートされた設定を反映
      setSelectedFacility(config.facilityType);
      setFacilityName(config.facilityName);
      
      // 施設特化項目の配点を反映
      const newItems: {[key: string]: number} = {};
      config.facilityItems.forEach(({ item, allocatedScore }) => {
        newItems[item.id] = allocatedScore;
      });
      setSelectedItems(newItems);
      
      alert('設定をインポートしました');
    } catch (error) {
      console.error('Import error:', error);
      alert('インポートに失敗しました');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      core: <Award className="h-4 w-4" />,
      knowledge: <BookOpen className="h-4 w-4" />,
      education: <Users className="h-4 w-4" />,
      leadership: <TrendingUp className="h-4 w-4" />,
      growth: <Target className="h-4 w-4" />,
      facility: <Building className="h-4 w-4" />
    };
    return icons[category as keyof typeof icons] || null;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      core: 'bg-blue-100 text-blue-800',
      knowledge: 'bg-purple-100 text-purple-800',
      education: 'bg-green-100 text-green-800',
      leadership: 'bg-orange-100 text-orange-800',
      growth: 'bg-yellow-100 text-yellow-800',
      facility: 'bg-red-100 text-red-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">評価項目設定管理</h1>
        <p className="text-gray-600">技術評価の大項目設定と施設別カスタマイズ</p>
      </div>

      {/* アクションバー */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleExcelImport}
            className="hidden"
          />
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
          >
            <Upload className="h-4 w-4" />
            {isImporting ? 'インポート中...' : 'Excelインポート'}
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleExcelExport}
            disabled={isExporting}
          >
            <Download className="h-4 w-4" />
            テンプレートダウンロード
          </Button>
        </div>
        <Badge variant="outline" className="text-lg px-3 py-1">
          バージョン: 2024.1
        </Badge>
      </div>

      <Tabs defaultValue="master" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="master">マスター設定</TabsTrigger>
          <TabsTrigger value="facility">施設別設定</TabsTrigger>
          <TabsTrigger value="mapping">教育研修マッピング</TabsTrigger>
        </TabsList>

        {/* マスター設定タブ */}
        <TabsContent value="master" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                大項目マスター
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* コア項目 */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800">コア項目</Badge>
                    <span className="text-sm text-gray-600">30点固定</span>
                  </h3>
                  <div className="space-y-2">
                    {coreEvaluationItems.map(item => (
                      <div key={item.id} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(item.category)}
                              <span className="font-medium">{item.name}</span>
                              <Badge variant="secondary">{item.maxScore}点</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          </div>
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 施設特化項目 */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Badge className="bg-orange-100 text-orange-800">施設特化項目</Badge>
                    <span className="text-sm text-gray-600">最大20点選択可能</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {facilitySpecificItems.map(item => (
                      <div key={item.id} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(item.category)}
                              <span className="font-medium">{item.name}</span>
                              <Badge className={getCategoryColor(item.category)}>
                                {item.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            <div className="flex gap-1 mt-2">
                              {item.applicableFacilities?.map(facility => (
                                <Badge key={facility} variant="outline" className="text-xs">
                                  {facilityTypeNames[facility]}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Badge variant="secondary">最大{item.maxScore}点</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 施設別設定タブ */}
        <TabsContent value="facility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                施設別項目設定
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 施設選択 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">施設種別</label>
                    <select 
                      className="w-full px-3 py-2 border rounded-md"
                      value={selectedFacility}
                      onChange={(e) => setSelectedFacility(e.target.value as FacilityType)}
                    >
                      {Object.entries(facilityTypeNames).map(([key, name]) => (
                        <option key={key} value={key}>{name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">施設名</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      value={facilityName}
                      onChange={(e) => setFacilityName(e.target.value)}
                      placeholder="施設名を入力"
                    />
                  </div>
                </div>

                {/* 配点状況 */}
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <span>現在の配点: </span>
                      <div className="flex items-center gap-4">
                        <span>コア項目: 30点</span>
                        <span>施設特化: {calculateTotalScore() - 30}点</span>
                        <Badge 
                          variant={calculateTotalScore() === 50 ? "default" : "destructive"}
                          className="font-bold"
                        >
                          合計: {calculateTotalScore()}/50点
                        </Badge>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>

                {/* 項目選択 */}
                <div>
                  <h3 className="font-semibold mb-3">施設特化項目の選択（20点分）</h3>
                  <div className="space-y-3">
                    {availableItems.map(item => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(item.category)}
                              <span className="font-medium">{item.name}</span>
                              <Badge className={getCategoryColor(item.category)}>
                                {item.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            {item.experienceLevels && (
                              <div className="flex gap-1 mt-2">
                                <span className="text-xs text-gray-500">推奨:</span>
                                {item.experienceLevels.map(level => (
                                  <Badge key={level} variant="outline" className="text-xs">
                                    {experienceLevelNames[level]}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-sm">配点:</label>
                            <select
                              className="px-2 py-1 border rounded"
                              value={selectedItems[item.id] || 0}
                              onChange={(e) => handleItemSelection(item.id, parseInt(e.target.value))}
                            >
                              <option value={0}>0点</option>
                              {[...Array(item.maxScore)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}点</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 保存ボタン */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSelectedItems({});
                      setFacilityName('');
                    }}
                  >
                    キャンセル
                  </Button>
                  <Button 
                    disabled={calculateTotalScore() !== 50 || !facilityName}
                    className="flex items-center gap-2"
                    onClick={() => {
                      const config: FacilityEvaluationConfig = {
                        facilityId: `${selectedFacility}-${Date.now()}`,
                        facilityType: selectedFacility,
                        facilityName,
                        coreItems: coreEvaluationItems,
                        facilityItems: Object.entries(selectedItems).map(([itemId, score]) => ({
                          item: facilitySpecificItems.find(item => item.id === itemId)!,
                          allocatedScore: score
                        })),
                        totalScore: calculateTotalScore(),
                        configuredBy: '管理者',
                        configuredAt: new Date()
                      };
                      EvaluationConfigStorage.saveConfig(config);
                      setSavedConfigs(EvaluationConfigStorage.getAllConfigs());
                      alert('設定を保存しました');
                    }}
                  >
                    <Check className="h-4 w-4" />
                    設定を保存
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* 保存済み設定一覧 */}
          {savedConfigs.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  保存済み設定
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {savedConfigs.map(config => (
                    <div key={config.facilityId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{config.facilityName}</div>
                          <div className="text-sm text-gray-600">
                            {facilityTypeNames[config.facilityType]} ・ 
                            設定日: {new Date(config.configuredAt).toLocaleDateString('ja-JP')}
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">コア: 30点</Badge>
                            <Badge variant="outline">
                              施設特化: {config.facilityItems.reduce((sum, item) => sum + item.allocatedScore, 0)}点
                            </Badge>
                            <Badge variant="default">合計: {config.totalScore}点</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              const blob = EvaluationExcelService.generateEvaluationSheet(
                                config, 
                                'nurse', 
                                'EMP001', 
                                'サンプル太郎'
                              );
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `評価シート_${config.facilityName}_${new Date().toISOString().split('T')[0]}.xlsx`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              URL.revokeObjectURL(url);
                            }}
                          >
                            <Download className="h-4 w-4" />
                            評価シート出力
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 教育研修マッピングタブ */}
        <TabsContent value="mapping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                教育研修マッピング
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertDescription>
                  評価項目と教育研修プログラムを連携させることで、評価結果に基づいた育成計画が自動生成されます。
                </AlertDescription>
              </Alert>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">評価項目</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">必要研修</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">研修レベル</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">実施時期</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">時間</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-3 text-sm">専門技術・スキル</td>
                      <td className="px-4 py-3 text-sm">基礎技術研修</td>
                      <td className="px-4 py-3 text-sm text-center">
                        <Badge variant="outline">Level 1</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-center">4月</td>
                      <td className="px-4 py-3 text-sm text-center">40h</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3 text-sm">安全・品質管理</td>
                      <td className="px-4 py-3 text-sm">医療安全研修</td>
                      <td className="px-4 py-3 text-sm text-center">
                        <Badge variant="outline">Level 1</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-center">4月</td>
                      <td className="px-4 py-3 text-sm text-center">8h</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3 text-sm">教育・指導</td>
                      <td className="px-4 py-3 text-sm">プリセプター研修</td>
                      <td className="px-4 py-3 text-sm text-center">
                        <Badge variant="outline">Level 3</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-center">2月</td>
                      <td className="px-4 py-3 text-sm text-center">16h</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-end">
                <Button className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  マッピング表を編集
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}