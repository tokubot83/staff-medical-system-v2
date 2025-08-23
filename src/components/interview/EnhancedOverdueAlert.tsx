'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, Clock, Calendar, ChevronDown, ChevronUp, 
  Filter, CheckCircle2, Users, CalendarPlus, X
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OverdueInterview {
  id: string;
  staffName: string;
  interviewType: string;
  category?: string;
  scheduledDate: Date;
  urgency: 'critical' | 'warning' | 'normal';
  daysOverdue: number;
  department: string;
  position: string;
  notes?: string;
}

interface EnhancedOverdueAlertProps {
  overdueInterviews: OverdueInterview[];
  onScheduleInterview?: (interview: OverdueInterview) => void;
  onBulkAction?: (interviews: OverdueInterview[], action: string) => void;
  showInCalendarView?: boolean;
}

export default function EnhancedOverdueAlert({ 
  overdueInterviews = [], 
  onScheduleInterview,
  onBulkAction,
  showInCalendarView = false
}: EnhancedOverdueAlertProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedInterviews, setSelectedInterviews] = useState<Set<string>>(new Set());
  const [filterUrgency, setFilterUrgency] = useState<'all' | 'critical' | 'warning' | 'normal'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // カレンダービューでは非表示
  if (showInCalendarView || overdueInterviews.length === 0) {
    return null;
  }

  // 優先度別の分類
  const criticalInterviews = overdueInterviews.filter(i => i.urgency === 'critical');
  const warningInterviews = overdueInterviews.filter(i => i.urgency === 'warning');
  const normalInterviews = overdueInterviews.filter(i => i.urgency === 'normal');

  // フィルタリング
  const filteredInterviews = overdueInterviews.filter(interview => {
    if (filterUrgency === 'all') return true;
    return interview.urgency === filterUrgency;
  });

  // 優先度に応じたスタイル取得
  const getUrgencyStyle = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return {
          border: 'border-red-200',
          background: 'bg-red-50',
          text: 'text-red-800',
          icon: 'text-red-600',
          badge: 'bg-red-100 text-red-800'
        };
      case 'warning':
        return {
          border: 'border-yellow-200',
          background: 'bg-yellow-50',
          text: 'text-yellow-800',
          icon: 'text-yellow-600',
          badge: 'bg-yellow-100 text-yellow-800'
        };
      default:
        return {
          border: 'border-blue-200',
          background: 'bg-blue-50',
          text: 'text-blue-800',
          icon: 'text-blue-600',
          badge: 'bg-blue-100 text-blue-800'
        };
    }
  };

  // 優先度ラベル取得
  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'critical': return '緊急';
      case 'warning': return '注意';
      default: return '通常';
    }
  };

  // 面談タイプの表示名取得
  const getInterviewTypeLabel = (type: string, category?: string) => {
    switch (type) {
      case 'サポート面談': return `サポート面談${category ? ` - ${category}` : ''}`;
      case '年次面談': return '年次面談';
      case '定期面談': return '定期面談';
      case '緊急面談': return '緊急面談';
      default: return type;
    }
  };

  // チェックボックス処理
  const handleInterviewSelect = (interviewId: string) => {
    const newSelected = new Set(selectedInterviews);
    if (newSelected.has(interviewId)) {
      newSelected.delete(interviewId);
    } else {
      newSelected.add(interviewId);
    }
    setSelectedInterviews(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedInterviews.size === filteredInterviews.length) {
      setSelectedInterviews(new Set());
    } else {
      setSelectedInterviews(new Set(filteredInterviews.map(i => i.id)));
    }
  };

  // 一括処理
  const handleBulkSchedule = () => {
    const selectedItems = filteredInterviews.filter(i => selectedInterviews.has(i.id));
    onBulkAction?.(selectedItems, 'schedule');
    setSelectedInterviews(new Set());
  };

  const handleBulkPostpone = () => {
    const selectedItems = filteredInterviews.filter(i => selectedInterviews.has(i.id));
    onBulkAction?.(selectedItems, 'postpone');
    setSelectedInterviews(new Set());
  };

  // 最も緊急度の高いアラートのスタイルを使用
  const primaryUrgency = criticalInterviews.length > 0 ? 'critical' : 
                         warningInterviews.length > 0 ? 'warning' : 'normal';
  const alertStyle = getUrgencyStyle(primaryUrgency);

  return (
    <Card className={`w-full ${alertStyle.border} ${alertStyle.background} shadow-lg`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className={`h-5 w-5 ${alertStyle.icon}`} />
            <span className={`font-bold ${alertStyle.text}`}>
              未実施の面談が {overdueInterviews.length} 件あります
            </span>
            <div className="flex gap-2">
              {criticalInterviews.length > 0 && (
                <Badge className="bg-red-100 text-red-800 border-red-300">
                  緊急 {criticalInterviews.length}件
                </Badge>
              )}
              {warningInterviews.length > 0 && (
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                  注意 {warningInterviews.length}件
                </Badge>
              )}
              {normalInterviews.length > 0 && (
                <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                  通常 {normalInterviews.length}件
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* フィルターボタン */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="h-8"
            >
              <Filter className="h-4 w-4" />
            </Button>
            
            {/* 展開/折りたたみボタン */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  折りたたみ
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  詳細表示
                </>
              )}
            </Button>
          </div>
        </CardTitle>

        {/* フィルター */}
        {showFilters && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
            <Button
              variant={filterUrgency === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterUrgency('all')}
            >
              すべて ({overdueInterviews.length})
            </Button>
            <Button
              variant={filterUrgency === 'critical' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterUrgency('critical')}
              className="text-red-600 border-red-300"
            >
              緊急 ({criticalInterviews.length})
            </Button>
            <Button
              variant={filterUrgency === 'warning' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterUrgency('warning')}
              className="text-yellow-600 border-yellow-300"
            >
              注意 ({warningInterviews.length})
            </Button>
            <Button
              variant={filterUrgency === 'normal' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterUrgency('normal')}
              className="text-blue-600 border-blue-300"
            >
              通常 ({normalInterviews.length})
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {!isExpanded ? (
          // 簡易表示（最初の3件）
          <div className="space-y-2">
            {filteredInterviews.slice(0, 3).map((interview) => {
              const style = getUrgencyStyle(interview.urgency);
              return (
                <div key={interview.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex items-center gap-3">
                    <Clock className={`h-4 w-4 ${style.icon}`} />
                    <span className="font-medium">{interview.staffName}</span>
                    <span className="text-sm text-gray-600">
                      {getInterviewTypeLabel(interview.interviewType, interview.category)}
                    </span>
                    <Badge variant="outline" className={style.badge}>
                      {interview.daysOverdue}日遅延
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onScheduleInterview?.(interview)}
                    className="h-7"
                  >
                    <CalendarPlus className="h-3 w-3 mr-1" />
                    予約
                  </Button>
                </div>
              );
            })}
            {filteredInterviews.length > 3 && (
              <div className="text-center text-sm text-gray-500 pt-2">
                他 {filteredInterviews.length - 3} 件...
              </div>
            )}
          </div>
        ) : (
          // 詳細表示
          <div className="space-y-4">
            {/* 一括操作ボタン */}
            {selectedInterviews.size > 0 && (
              <div className="flex items-center gap-3 p-3 bg-white rounded border-2 border-blue-200">
                <span className="text-sm font-medium">
                  {selectedInterviews.size} 件選択中
                </span>
                <Button
                  size="sm"
                  onClick={handleBulkSchedule}
                  className="h-7"
                >
                  <CalendarPlus className="h-3 w-3 mr-1" />
                  一括予約
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBulkPostpone}
                  className="h-7"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  一括延期
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedInterviews(new Set())}
                  className="h-7"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            {/* 全選択/全解除 */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedInterviews.size === filteredInterviews.length && filteredInterviews.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium">すべて選択</span>
            </div>

            {/* 面談リスト */}
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {filteredInterviews.map((interview) => {
                const style = getUrgencyStyle(interview.urgency);
                const isSelected = selectedInterviews.has(interview.id);
                
                return (
                  <div 
                    key={interview.id} 
                    className={`p-3 bg-white rounded border-2 transition-all ${
                      isSelected ? 'border-blue-400 shadow-sm' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleInterviewSelect(interview.id)}
                          className="mt-1 rounded border-gray-300"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className={`h-4 w-4 ${style.icon}`} />
                            <span className="font-bold text-lg">{interview.staffName}</span>
                            <Badge variant="outline" className={style.badge}>
                              {getUrgencyLabel(interview.urgency)}
                            </Badge>
                            <Badge variant="outline" className="bg-gray-100">
                              {interview.daysOverdue}日遅延
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-4">
                              <span><strong>種別:</strong> {getInterviewTypeLabel(interview.interviewType, interview.category)}</span>
                              <span><strong>部署:</strong> {interview.department}</span>
                              <span><strong>職種:</strong> {interview.position}</span>
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            予定日: {interview.scheduledDate.toLocaleDateString('ja-JP')}
                            {interview.notes && (
                              <div className="mt-1 italic">📝 {interview.notes}</div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-3">
                        <Button
                          size="sm"
                          onClick={() => onScheduleInterview?.(interview)}
                          className="h-8"
                        >
                          <CalendarPlus className="h-3 w-3 mr-1" />
                          面談予約
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}