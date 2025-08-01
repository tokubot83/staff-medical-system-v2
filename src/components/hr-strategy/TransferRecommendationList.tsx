'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TransferRecommendation } from '@/types/hr-strategy';
import { ChevronDown, ChevronUp, User, ArrowRight, Clock, Target } from 'lucide-react';

interface TransferRecommendationListProps {
  recommendations: TransferRecommendation[];
  onActionClick?: (recommendation: TransferRecommendation, action: string) => void;
}

export const TransferRecommendationList: React.FC<TransferRecommendationListProps> = ({
  recommendations,
  onActionClick
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (employeeId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(employeeId)) {
      newExpanded.delete(employeeId);
    } else {
      newExpanded.add(employeeId);
    }
    setExpandedItems(newExpanded);
  };

  const getRecommendationIcon = (type: TransferRecommendation['recommendationType']) => {
    switch (type) {
      case 'transfer': return <ArrowRight className="w-4 h-4" />;
      case 'training': return <Target className="w-4 h-4" />;
      case 'promotion': return <User className="w-4 h-4" />;
      case 'support': return <Clock className="w-4 h-4" />;
    }
  };

  const getRecommendationTypeLabel = (type: TransferRecommendation['recommendationType']) => {
    switch (type) {
      case 'transfer': return '異動推奨';
      case 'training': return '研修推奨';
      case 'promotion': return '昇進検討';
      case 'support': return '支援必要';
    }
  };

  const getPriorityColor = (priority: TransferRecommendation['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
    }
  };

  const getPatternBadgeColor = (pattern: string) => {
    if (pattern.includes('star') || pattern.includes('ace') || pattern.includes('excellence')) {
      return 'bg-purple-100 text-purple-800';
    } else if (pattern.includes('mismatch') || pattern.includes('struggle') || pattern.includes('burnout')) {
      return 'bg-red-100 text-red-800';
    } else if (pattern.includes('specialist') || pattern.includes('leadership')) {
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  // 優先度でソート
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold">異動・育成推奨リスト</h3>
        <p className="text-sm text-gray-600 mt-1">
          2軸評価に基づく人材活用の推奨事項
        </p>
      </div>

      <div className="space-y-4">
        {sortedRecommendations.map((rec) => {
          const isExpanded = expandedItems.has(rec.employeeId);
          
          return (
            <div
              key={rec.employeeId}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-lg">{rec.employeeName}</h4>
                    <Badge className={getPriorityColor(rec.priority)}>
                      優先度: {rec.priority === 'high' ? '高' : rec.priority === 'medium' ? '中' : '低'}
                    </Badge>
                    <Badge className={getPatternBadgeColor(rec.evaluation.evaluationPattern)}>
                      {rec.evaluation.evaluationPattern}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span>{rec.currentDepartment}</span>
                    <span>施設評価: {rec.evaluation.facilityEval}</span>
                    <span>法人評価: {rec.evaluation.corporateEval}</span>
                    <span>総合: {rec.evaluation.finalEval}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {getRecommendationIcon(rec.recommendationType)}
                      <span className="font-medium">
                        {getRecommendationTypeLabel(rec.recommendationType)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">• {rec.timeline}</span>
                  </div>

                  <p className="text-sm text-gray-700">{rec.recommendationDetail}</p>

                  {isExpanded && (
                    <div className="mt-4 space-y-3">
                      <div>
                        <h5 className="font-medium mb-2">推奨アクション:</h5>
                        <ul className="space-y-1">
                          {rec.suggestedActions.map((action, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span>
                              <span className="text-sm">{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          onClick={() => onActionClick?.(rec, 'detail')}
                        >
                          詳細を見る
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onActionClick?.(rec, 'action')}
                        >
                          アクション開始
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpand(rec.employeeId)}
                >
                  {isExpanded ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {recommendations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          現在、推奨事項はありません
        </div>
      )}
    </Card>
  );
};