'use client';

import React, { useState } from 'react';
import { 
  Calendar, Clock, User, Building, AlertTriangle, 
  CheckCircle, FileText, Star, ChevronRight, Filter,
  Settings, Square, CheckSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UnifiedInterviewReservation } from '@/components/interview/UnifiedInterviewDashboard';
import { AdvancedSearchFilters } from './AdvancedSearchModal';
import BulkOperationsModal, { BulkOperationConfig } from '@/components/bulk/BulkOperationsModal';
import { BulkOperationsService } from '@/utils/bulkOperationsService';

interface SearchResultsProps {
  results: UnifiedInterviewReservation[];
  filters: AdvancedSearchFilters;
  isLoading: boolean;
  onResultClick: (reservation: UnifiedInterviewReservation) => void;
  onStartInterview: (reservation: UnifiedInterviewReservation) => void;
  onUpdateReservations?: (updatedReservations: UnifiedInterviewReservation[]) => void;
}

export default function SearchResults({
  results,
  filters,
  isLoading,
  onResultClick,
  onStartInterview,
  onUpdateReservations
}: SearchResultsProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showBulkOperations, setShowBulkOperations] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);

  // 一括操作関連のメソッド
  const toggleBulkMode = () => {
    setBulkMode(!bulkMode);
    if (!bulkMode) {
      setSelectedItems(new Set());
    }
  };

  const toggleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const selectAllItems = () => {
    if (selectedItems.size === results.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(results.map(r => r.id)));
    }
  };

  const getSelectedReservations = () => {
    return results.filter(r => selectedItems.has(r.id));
  };

  const handleBulkOperation = async (config: BulkOperationConfig) => {
    const selectedReservations = getSelectedReservations();
    if (selectedReservations.length === 0) return;

    try {
      await BulkOperationsService.executeBulkOperation(
        selectedReservations,
        config,
        (updatedReservations) => {
          if (onUpdateReservations) {
            onUpdateReservations(updatedReservations);
          }
          // 選択をクリア
          setSelectedItems(new Set());
          setBulkMode(false);
        }
      );
    } catch (error) {
      console.error('一括操作エラー:', error);
    }
  };

  // ステータスバッジのスタイル
  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };

    const labels = {
      pending: '予定',
      confirmed: '確定',
      in_progress: '実施中',
      completed: '完了',
      cancelled: 'キャンセル'
    };

    return (
      <Badge className={styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  // 緊急度バッジのスタイル
  const getUrgencyBadge = (urgency?: string) => {
    if (!urgency) return null;

    const styles = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };

    const labels = {
      low: '低',
      medium: '中',
      high: '高',
      urgent: '緊急'
    };

    return (
      <Badge className={styles[urgency as keyof typeof styles] || 'bg-gray-100 text-gray-800'}>
        {labels[urgency as keyof typeof labels] || urgency}
      </Badge>
    );
  };

  // 面談タイプラベル
  const getInterviewTypeLabel = (reservation: UnifiedInterviewReservation) => {
    const typeLabels = {
      regular: '定期面談',
      special: '特別面談',
      support: 'サポート面談'
    };

    let label = typeLabels[reservation.type] || reservation.type;

    // サブタイプがある場合は追加
    if (reservation.regularType) {
      const regularLabels = {
        new_employee: '新入職員',
        annual: '年次',
        management: '管理職'
      };
      label += ` (${regularLabels[reservation.regularType] || reservation.regularType})`;
    }

    if (reservation.specialType) {
      const specialLabels = {
        exit: '退職',
        transfer: '異動',
        return: '復職',
        promotion: '昇進',
        disciplinary: '懲戒'
      };
      label += ` (${specialLabels[reservation.specialType] || reservation.specialType})`;
    }

    if (reservation.supportCategory) {
      label += ` (${reservation.supportCategory})`;
    }

    return label;
  };

  // アクティブフィルターの表示
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.keyword) count++;
    if (filters.staffName) count++;
    if (filters.departments.length > 0) count++;
    if (filters.positions.length > 0) count++;
    if (filters.interviewTypes.length > 0) count++;
    if (filters.statuses.length > 0) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.hasFiles) count++;
    if (filters.isOverdue) count++;
    return count;
  };

  // 日付フォーマット
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">検索中...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 検索結果ヘッダー */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600" />
              検索結果: {results.length}件
              {bulkMode && selectedItems.size > 0 && (
                <Badge className="bg-blue-100 text-blue-800">
                  {selectedItems.size}件選択中
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              {getActiveFiltersCount() > 0 && (
                <Badge variant="outline">
                  {getActiveFiltersCount()}個のフィルター適用中
                </Badge>
              )}
              {results.length > 0 && (
                <>
                  <Button
                    variant={bulkMode ? "default" : "outline"}
                    size="sm"
                    onClick={toggleBulkMode}
                  >
                    {bulkMode ? (
                      <CheckSquare className="h-4 w-4 mr-2" />
                    ) : (
                      <Square className="h-4 w-4 mr-2" />
                    )}
                    {bulkMode ? '選択モード終了' : '一括選択'}
                  </Button>
                  {bulkMode && selectedItems.size > 0 && (
                    <Button
                      onClick={() => setShowBulkOperations(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      一括操作
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
          {bulkMode && results.length > 0 && (
            <div className="mt-3 pt-3 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={selectAllItems}
              >
                {selectedItems.size === results.length ? '全選択解除' : '全選択'}
              </Button>
            </div>
          )}
        </CardHeader>
        
        {/* アクティブフィルターの表示 */}
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            {filters.keyword && (
              <Badge variant="secondary">キーワード: {filters.keyword}</Badge>
            )}
            {filters.staffName && (
              <Badge variant="secondary">職員名: {filters.staffName}</Badge>
            )}
            {filters.departments.length > 0 && (
              <Badge variant="secondary">部署: {filters.departments.join(', ')}</Badge>
            )}
            {filters.positions.length > 0 && (
              <Badge variant="secondary">職種: {filters.positions.join(', ')}</Badge>
            )}
            {filters.interviewTypes.length > 0 && (
              <Badge variant="secondary">面談タイプ: {filters.interviewTypes.join(', ')}</Badge>
            )}
            {filters.statuses.length > 0 && (
              <Badge variant="secondary">ステータス: {filters.statuses.join(', ')}</Badge>
            )}
            {(filters.dateRange.from || filters.dateRange.to) && (
              <Badge variant="secondary">
                期間: {filters.dateRange.from?.toLocaleDateString('ja-JP')} - {filters.dateRange.to?.toLocaleDateString('ja-JP')}
              </Badge>
            )}
            {filters.hasFiles && (
              <Badge variant="secondary">添付ファイルあり</Badge>
            )}
            {filters.isOverdue && (
              <Badge variant="secondary">期限超過</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 検索結果リスト */}
      {results.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Filter className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">検索条件に一致する結果が見つかりませんでした</p>
            <p className="text-gray-400 text-sm mt-2">検索条件を変更してお試しください</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {results.map(reservation => (
            <Card 
              key={reservation.id} 
              className={`hover:shadow-md transition-shadow ${
                bulkMode ? 'cursor-default' : 'cursor-pointer'
              } ${selectedItems.has(reservation.id) ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => !bulkMode && onResultClick(reservation)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  {/* 一括選択モード時のチェックボックス */}
                  {bulkMode && (
                    <div className="mr-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(reservation.id)}
                        onChange={() => toggleSelectItem(reservation.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      {/* 日時表示 */}
                      <div className="bg-blue-50 rounded-lg px-3 py-2 text-center min-w-[80px]">
                        <div className="text-sm font-medium text-blue-700">
                          {formatDate(reservation.scheduledDate)}
                        </div>
                        <div className="text-lg font-bold text-blue-900">
                          {reservation.scheduledTime}
                        </div>
                      </div>
                      
                      {/* メイン情報 */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg">{reservation.staffName}</h3>
                          <Badge variant="outline">{getInterviewTypeLabel(reservation)}</Badge>
                          {getUrgencyBadge(reservation.urgency)}
                          {getStatusBadge(reservation.status)}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            {reservation.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {reservation.position}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {reservation.experienceYears}年目
                          </span>
                        </div>

                        {/* サポート面談の場合は相談内容を表示 */}
                        {reservation.supportTopic && (
                          <div className="mt-2 bg-gray-50 rounded p-2">
                            <span className="font-medium text-sm">相談内容:</span>
                            <p className="text-sm text-gray-700 mt-1">{reservation.supportTopic}</p>
                          </div>
                        )}

                        {/* 備考がある場合は表示 */}
                        {reservation.notes && (
                          <div className="mt-2 text-sm text-gray-600">
                            📝 {reservation.notes}
                          </div>
                        )}

                        {/* 作成情報 */}
                        <div className="mt-2 text-xs text-gray-500">
                          作成: {reservation.createdAt.toLocaleDateString('ja-JP')}
                          {reservation.source && ` (${reservation.source})`}
                          {reservation.createdBy && ` - ${reservation.createdBy}`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* アクションボタン */}
                  <div className="flex flex-col gap-2 ml-4">
                    {!bulkMode && (
                      <>
                        {reservation.status === 'confirmed' && (
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onStartInterview(reservation);
                            }}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            面談開始
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onResultClick(reservation);
                          }}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 結果が多い場合のページネーション（将来的に実装） */}
      {results.length > 20 && (
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-gray-500">
              {results.length}件中 20件を表示中
            </p>
            <Button variant="outline" className="mt-2">
              さらに表示
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 一括操作モーダル */}
      <BulkOperationsModal
        isOpen={showBulkOperations}
        onClose={() => setShowBulkOperations(false)}
        selectedReservations={getSelectedReservations()}
        onExecute={handleBulkOperation}
      />
    </div>
  );
}