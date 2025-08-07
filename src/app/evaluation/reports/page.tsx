'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText,
  Download,
  Filter,
  Calendar,
  Users,
  Building,
  FileSpreadsheet,
  Printer,
  Send,
  CheckCircle
} from 'lucide-react';

interface ReportRequest {
  type: 'individual' | 'department' | 'facility' | 'summary';
  format: 'pdf' | 'excel';
  year: number;
  period?: string;
  staffIds?: string[];
  departmentId?: string;
  facilityId?: string;
  includeDetails: boolean;
  includeCharts: boolean;
}

export default function EvaluationReportsPage() {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel'>('pdf');
  const [selectedReportType, setSelectedReportType] = useState<'individual' | 'department' | 'facility' | 'summary'>('individual');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<any[]>([]);

  const handleGenerateReport = async (request: ReportRequest) => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      const newReport = {
        id: Date.now().toString(),
        name: getReportName(request),
        type: request.type,
        format: request.format,
        size: Math.floor(Math.random() * 5000) + 500,
        createdAt: new Date().toISOString(),
        status: 'completed'
      };
      
      setGeneratedReports(prev => [newReport, ...prev]);
      setIsGenerating(false);
    }, 2000);
  };

  const getReportName = (request: ReportRequest) => {
    const typeNames = {
      individual: '個人評価レポート',
      department: '部門別評価レポート',
      facility: '施設別評価レポート',
      summary: '総合評価サマリー'
    };
    
    return `${request.year}年度_${typeNames[request.type]}.${request.format}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">評価レポート出力</h1>
        <p className="text-gray-600">評価結果をPDFまたはExcel形式でダウンロード</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* レポート設定 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>レポート設定</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedReportType} onValueChange={(v: any) => setSelectedReportType(v)}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="individual">個人別</TabsTrigger>
                  <TabsTrigger value="department">部門別</TabsTrigger>
                  <TabsTrigger value="facility">施設別</TabsTrigger>
                  <TabsTrigger value="summary">総合</TabsTrigger>
                </TabsList>

                {/* 個人別レポート */}
                <TabsContent value="individual" className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3">個人評価レポート</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      個々の職員の年間評価結果を詳細にまとめたレポートを生成します。
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">対象職員</label>
                        <select className="w-full px-3 py-2 border rounded-md">
                          <option>全職員</option>
                          <option>選択した職員のみ</option>
                          <option>特定部門の職員</option>
                        </select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked />
                            <span className="text-sm">技術評価詳細を含む</span>
                          </label>
                        </div>
                        <div>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked />
                            <span className="text-sm">組織貢献度詳細を含む</span>
                          </label>
                        </div>
                        <div>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked />
                            <span className="text-sm">評価推移グラフを含む</span>
                          </label>
                        </div>
                        <div>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" />
                            <span className="text-sm">コメントを含む</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* 部門別レポート */}
                <TabsContent value="department" className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3">部門別評価レポート</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      部門ごとの評価分布や傾向を分析したレポートを生成します。
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">対象部門</label>
                        <select className="w-full px-3 py-2 border rounded-md">
                          <option>全部門</option>
                          <option>看護部</option>
                          <option>介護部</option>
                          <option>リハビリテーション科</option>
                          <option>事務部</option>
                        </select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked />
                            <span className="text-sm">評価分布チャート</span>
                          </label>
                        </div>
                        <div>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked />
                            <span className="text-sm">前年度比較</span>
                          </label>
                        </div>
                        <div>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked />
                            <span className="text-sm">職種別分析</span>
                          </label>
                        </div>
                        <div>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" />
                            <span className="text-sm">個人リスト</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* 施設別レポート */}
                <TabsContent value="facility" className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3">施設別評価レポート</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      施設ごとの評価結果を比較分析したレポートを生成します。
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">対象施設</label>
                        <select className="w-full px-3 py-2 border rounded-md">
                          <option>全施設</option>
                          <option>急性期病院</option>
                          <option>慢性期病院</option>
                          <option>老健</option>
                          <option>グループホーム</option>
                        </select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked />
                            <span className="text-sm">施設間比較</span>
                          </label>
                        </div>
                        <div>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked />
                            <span className="text-sm">ベンチマーク分析</span>
                          </label>
                        </div>
                        <div>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked />
                            <span className="text-sm">グレード分布</span>
                          </label>
                        </div>
                        <div>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" />
                            <span className="text-sm">詳細データ</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* 総合レポート */}
                <TabsContent value="summary" className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3">総合評価サマリーレポート</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      法人全体の評価結果を総合的にまとめたエグゼクティブサマリーを生成します。
                    </p>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked />
                            <span className="text-sm">全体統計</span>
                          </label>
                        </div>
                        <div>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked />
                            <span className="text-sm">施設別サマリー</span>
                          </label>
                        </div>
                        <div>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked />
                            <span className="text-sm">職種別サマリー</span>
                          </label>
                        </div>
                        <div>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked />
                            <span className="text-sm">改善提案</span>
                          </label>
                        </div>
                        <div>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked />
                            <span className="text-sm">昇進候補者リスト</span>
                          </label>
                        </div>
                        <div>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" />
                            <span className="text-sm">役員向け要約</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* 共通設定 */}
              <div className="mt-6 pt-6 border-t space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">評価年度</label>
                    <select 
                      className="w-full px-3 py-2 border rounded-md"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    >
                      <option value={2024}>2024年度</option>
                      <option value={2023}>2023年度</option>
                      <option value={2022}>2022年度</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">出力形式</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          name="format" 
                          value="pdf"
                          checked={selectedFormat === 'pdf'}
                          onChange={() => setSelectedFormat('pdf')}
                        />
                        <FileText className="h-4 w-4" />
                        <span>PDF</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          name="format" 
                          value="excel"
                          checked={selectedFormat === 'excel'}
                          onChange={() => setSelectedFormat('excel')}
                        />
                        <FileSpreadsheet className="h-4 w-4" />
                        <span>Excel</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Printer className="h-4 w-4" />
                    印刷プレビュー
                  </Button>
                  <Button 
                    onClick={() => handleGenerateReport({
                      type: selectedReportType,
                      format: selectedFormat,
                      year: selectedYear,
                      includeDetails: true,
                      includeCharts: true
                    })}
                    disabled={isGenerating}
                    className="flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        生成中...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        レポート生成
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 生成済みレポート */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>生成済みレポート</span>
                <Badge variant="secondary">{generatedReports.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedReports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">レポートがまだ生成されていません</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {generatedReports.map(report => (
                    <div key={report.id} className="border rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {report.format === 'pdf' ? (
                              <FileText className="h-4 w-4 text-red-500" />
                            ) : (
                              <FileSpreadsheet className="h-4 w-4 text-green-500" />
                            )}
                            <span className="text-sm font-medium">{report.name}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span>{formatFileSize(report.size)}</span>
                            <span>{new Date(report.createdAt).toLocaleString('ja-JP')}</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {report.status === 'completed' && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            生成完了
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* テンプレート */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">レポートテンプレート</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  年次評価報告書
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  昇進・昇格推薦書
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  部門別分析レポート
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 注意事項 */}
      <Alert className="mt-6">
        <AlertDescription>
          <strong>注意事項：</strong>
          <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
            <li>個人情報を含むレポートの取り扱いには十分注意してください</li>
            <li>レポートの外部送信時は必ずパスワード保護を設定してください</li>
            <li>生成済みレポートは30日後に自動削除されます</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}