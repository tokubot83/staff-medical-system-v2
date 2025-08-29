'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowDown, Database, FileSpreadsheet, Users, TrendingUp, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface DataFlowNode {
  id: string;
  type: 'source' | 'process' | 'output' | 'sync';
  label: string;
  status?: 'completed' | 'in-progress' | 'pending';
  data?: any;
  icon?: React.ReactNode;
}

interface DataFlowEdge {
  from: string;
  to: string;
  label?: string;
  type?: 'data' | 'trigger' | 'dependency';
}

interface IntegrationFlowProps {
  month: number;
  nodes: DataFlowNode[];
  edges: DataFlowEdge[];
  onNodeClick?: (node: DataFlowNode) => void;
}

export default function IntegrationFlowVisualization({ month, nodes, edges, onNodeClick }: IntegrationFlowProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 border-green-500 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 border-blue-500 text-blue-800';
      case 'pending':
        return 'bg-gray-100 border-gray-400 text-gray-600';
      default:
        return 'bg-gray-50 border-gray-300';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600 animate-pulse" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'source':
        return <Database className="h-5 w-5" />;
      case 'process':
        return <FileSpreadsheet className="h-5 w-5" />;
      case 'output':
        return <TrendingUp className="h-5 w-5" />;
      case 'sync':
        return <Users className="h-5 w-5" />;
      default:
        return null;
    }
  };

  // サンプルフロー（実際のデータは月に応じて変更）
  const getMonthlyFlowData = () => {
    switch (month) {
      case 3:
        return {
          title: '3月：技術評価と研修計画の連携フロー',
          description: '評価結果から即座に個別研修計画を生成',
          criticalPath: ['mar-eval-1', 'mar-process-1', 'mar-training-1']
        };
      case 6:
        return {
          title: '6月：夏季貢献度評価と研修効果測定',
          description: '第1四半期の研修効果を貢献度評価に反映',
          criticalPath: ['jun-training-1', 'jun-process-1', 'jun-eval-1']
        };
      case 12:
        return {
          title: '12月：年間ROI分析と冬季評価',
          description: '年間の研修投資効果と評価結果の総合分析',
          criticalPath: ['dec-eval-1', 'dec-process-1', 'dec-training-1']
        };
      default:
        return {
          title: `${month}月の連携フロー`,
          description: '評価と研修の連携状況',
          criticalPath: []
        };
    }
  };

  const flowData = getMonthlyFlowData();

  return (
    <Card className="border-2 border-indigo-200">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">{flowData.title}</span>
          <Badge className="bg-indigo-100 text-indigo-800">
            データフロー可視化
          </Badge>
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">{flowData.description}</p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="relative">
          {/* ノード表示 */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {nodes.map((node, index) => {
              const isCritical = flowData.criticalPath.includes(node.id);
              return (
                <div key={node.id} className="relative">
                  <div
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
                      getStatusColor(node.status)
                    } ${isCritical ? 'ring-2 ring-indigo-400' : ''}`}
                    onClick={() => onNodeClick && onNodeClick(node)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {node.icon || getNodeIcon(node.type)}
                        {getStatusIcon(node.status)}
                      </div>
                      {isCritical && (
                        <Badge className="bg-indigo-100 text-indigo-800 text-xs">
                          重要
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-medium text-sm mb-1">{node.label}</h4>
                    {node.data && (
                      <div className="text-xs text-gray-600">
                        {node.data.impact && (
                          <div>効果: {node.data.impact}</div>
                        )}
                        {node.data.dependency && (
                          <div>依存: {node.data.dependency}</div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* 矢印表示（次のノードへ） */}
                  {index < nodes.length - 1 && (
                    <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-6 w-6 text-indigo-500" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* エッジ情報 */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm mb-3">データフローの詳細</h4>
            <div className="space-y-2">
              {edges.map((edge, index) => {
                const fromNode = nodes.find(n => n.id === edge.from);
                const toNode = nodes.find(n => n.id === edge.to);
                return (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{fromNode?.label}</span>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{toNode?.label}</span>
                    {edge.label && (
                      <Badge variant="outline" className="text-xs ml-2">
                        {edge.label}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 連携効果サマリー */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">+8.5点</div>
              <div className="text-xs text-gray-600">平均スコア向上</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">125%</div>
              <div className="text-xs text-gray-600">研修ROI</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">100%</div>
              <div className="text-xs text-gray-600">連携カバー率</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}