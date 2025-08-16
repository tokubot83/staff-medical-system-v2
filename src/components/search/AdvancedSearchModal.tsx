'use client';

import React, { useState } from 'react';
import { 
  Search, X, Calendar, User, Building, Filter, 
  Clock, Star, AlertTriangle, CheckCircle, Plus 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

export interface AdvancedSearchFilters {
  // 基本検索
  keyword: string;
  staffName: string;
  staffId: string;
  
  // 部署・職種
  departments: string[];
  positions: string[];
  experienceYears: {
    min?: number;
    max?: number;
  };
  
  // 面談関連
  interviewTypes: string[];
  interviewSubTypes: string[];
  statuses: string[];
  urgencyLevels: string[];
  
  // 日付関連
  dateRange: {
    from?: Date;
    to?: Date;
  };
  timeSlots: string[];
  
  // その他
  tags: string[];
  notes: string;
  hasFiles: boolean;
  isOverdue: boolean;
  
  // 並び替え
  sortBy: 'date' | 'name' | 'department' | 'urgency' | 'status';
  sortOrder: 'asc' | 'desc';
}

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (filters: AdvancedSearchFilters) => void;
  initialFilters?: Partial<AdvancedSearchFilters>;
}

export default function AdvancedSearchModal({
  isOpen,
  onClose,
  onSearch,
  initialFilters = {}
}: AdvancedSearchModalProps) {
  const [filters, setFilters] = useState<AdvancedSearchFilters>({
    keyword: '',
    staffName: '',
    staffId: '',
    departments: [],
    positions: [],
    experienceYears: {},
    interviewTypes: [],
    interviewSubTypes: [],
    statuses: [],
    urgencyLevels: [],
    dateRange: {},
    timeSlots: [],
    tags: [],
    notes: '',
    hasFiles: false,
    isOverdue: false,
    sortBy: 'date',
    sortOrder: 'desc',
    ...initialFilters
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'staff' | 'interview' | 'date' | 'advanced'>('basic');

  // 検索実行
  const handleSearch = () => {
    onSearch(filters);
    onClose();
  };

  // フィルターリセット
  const handleReset = () => {
    setFilters({
      keyword: '',
      staffName: '',
      staffId: '',
      departments: [],
      positions: [],
      experienceYears: {},
      interviewTypes: [],
      interviewSubTypes: [],
      statuses: [],
      urgencyLevels: [],
      dateRange: {},
      timeSlots: [],
      tags: [],
      notes: '',
      hasFiles: false,
      isOverdue: false,
      sortBy: 'date',
      sortOrder: 'desc'
    });
  };

  // 配列フィルターの切り替え
  const toggleArrayFilter = (key: keyof AdvancedSearchFilters, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    setFilters(prev => ({ ...prev, [key]: newArray }));
  };

  // 日付フィールドの更新
  const updateDateRange = (field: 'from' | 'to', value: string) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: value ? new Date(value) : undefined
      }
    }));
  };

  // 経験年数フィールドの更新
  const updateExperienceYears = (field: 'min' | 'max', value: string) => {
    setFilters(prev => ({
      ...prev,
      experienceYears: {
        ...prev.experienceYears,
        [field]: value ? parseInt(value) : undefined
      }
    }));
  };

  // 部署オプション
  const departmentOptions = [
    '内科病棟', '外科病棟', '救急科', '地域包括ケア', 
    '緩和ケア', '外来', 'リハビリ', '医事課'
  ];

  // 職種オプション
  const positionOptions = [
    '看護師', '准看護師', '看護補助者', '医師', 
    '理学療法士', '作業療法士', '医事課職員', '管理職'
  ];

  // 面談タイプオプション
  const interviewTypeOptions = [
    { value: 'regular', label: '定期面談' },
    { value: 'special', label: '特別面談' },
    { value: 'support', label: 'サポート面談' }
  ];

  // 面談サブタイプオプション
  const interviewSubTypeOptions = [
    '新入職員月次', '一般年次', '管理職半年', '退職面談', 
    'キャリア相談', '職場環境', '個別相談', '復職面談'
  ];

  // ステータスオプション
  const statusOptions = [
    { value: 'pending', label: '予定', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: '確定', color: 'bg-blue-100 text-blue-800' },
    { value: 'in_progress', label: '実施中', color: 'bg-orange-100 text-orange-800' },
    { value: 'completed', label: '完了', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'キャンセル', color: 'bg-gray-100 text-gray-800' }
  ];

  // 緊急度オプション
  const urgencyOptions = [
    { value: 'low', label: '低', color: 'bg-blue-100 text-blue-800' },
    { value: 'medium', label: '中', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: '高', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: '緊急', color: 'bg-red-100 text-red-800' }
  ];

  // 時間帯オプション
  const timeSlotOptions = [
    '09:00-10:00', '10:00-11:00', '11:00-12:00',
    '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Search className="h-6 w-6 text-blue-600" />
            高度な検索
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-full">
          {/* サイドバー - タブ */}
          <div className="w-48 bg-gray-50 border-r p-4">
            <div className="space-y-2">
              {[
                { id: 'basic', label: '基本検索', icon: Search },
                { id: 'staff', label: '職員情報', icon: User },
                { id: 'interview', label: '面談情報', icon: Building },
                { id: 'date', label: '日時', icon: Calendar },
                { id: 'advanced', label: '詳細設定', icon: Filter }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* メインコンテンツ */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* 基本検索タブ */}
            {activeTab === 'basic' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="keyword">キーワード検索</Label>
                  <Input
                    id="keyword"
                    placeholder="名前、部署、備考などを検索..."
                    value={filters.keyword}
                    onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="staffName">職員名</Label>
                  <Input
                    id="staffName"
                    placeholder="職員名で検索"
                    value={filters.staffName}
                    onChange={(e) => setFilters(prev => ({ ...prev, staffName: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="staffId">職員ID</Label>
                  <Input
                    id="staffId"
                    placeholder="職員IDで検索"
                    value={filters.staffId}
                    onChange={(e) => setFilters(prev => ({ ...prev, staffId: e.target.value }))}
                  />
                </div>

                <div>
                  <Label>並び替え</Label>
                  <div className="flex gap-2">
                    <Select
                      value={filters.sortBy}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as any }))}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">日付</SelectItem>
                        <SelectItem value="name">名前</SelectItem>
                        <SelectItem value="department">部署</SelectItem>
                        <SelectItem value="urgency">緊急度</SelectItem>
                        <SelectItem value="status">ステータス</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={filters.sortOrder}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, sortOrder: value as any }))}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">降順</SelectItem>
                        <SelectItem value="asc">昇順</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* 職員情報タブ */}
            {activeTab === 'staff' && (
              <div className="space-y-4">
                <div>
                  <Label>部署</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {departmentOptions.map(dept => (
                      <label key={dept} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.departments.includes(dept)}
                          onChange={() => toggleArrayFilter('departments', dept)}
                          className="rounded"
                        />
                        <span className="text-sm">{dept}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>職種</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {positionOptions.map(pos => (
                      <label key={pos} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.positions.includes(pos)}
                          onChange={() => toggleArrayFilter('positions', pos)}
                          className="rounded"
                        />
                        <span className="text-sm">{pos}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>経験年数</Label>
                  <div className="flex gap-2 items-center mt-2">
                    <Input
                      type="number"
                      placeholder="最小"
                      value={filters.experienceYears.min || ''}
                      onChange={(e) => updateExperienceYears('min', e.target.value)}
                      className="w-20"
                    />
                    <span>〜</span>
                    <Input
                      type="number"
                      placeholder="最大"
                      value={filters.experienceYears.max || ''}
                      onChange={(e) => updateExperienceYears('max', e.target.value)}
                      className="w-20"
                    />
                    <span className="text-sm text-gray-500">年</span>
                  </div>
                </div>
              </div>
            )}

            {/* 面談情報タブ */}
            {activeTab === 'interview' && (
              <div className="space-y-4">
                <div>
                  <Label>面談タイプ</Label>
                  <div className="space-y-2 mt-2">
                    {interviewTypeOptions.map(type => (
                      <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.interviewTypes.includes(type.value)}
                          onChange={() => toggleArrayFilter('interviewTypes', type.value)}
                          className="rounded"
                        />
                        <span className="text-sm">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>面談サブタイプ</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {interviewSubTypeOptions.map(subType => (
                      <label key={subType} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.interviewSubTypes.includes(subType)}
                          onChange={() => toggleArrayFilter('interviewSubTypes', subType)}
                          className="rounded"
                        />
                        <span className="text-sm">{subType}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>ステータス</Label>
                  <div className="space-y-2 mt-2">
                    {statusOptions.map(status => (
                      <label key={status.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.statuses.includes(status.value)}
                          onChange={() => toggleArrayFilter('statuses', status.value)}
                          className="rounded"
                        />
                        <Badge className={status.color}>{status.label}</Badge>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>緊急度</Label>
                  <div className="space-y-2 mt-2">
                    {urgencyOptions.map(urgency => (
                      <label key={urgency.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.urgencyLevels.includes(urgency.value)}
                          onChange={() => toggleArrayFilter('urgencyLevels', urgency.value)}
                          className="rounded"
                        />
                        <Badge className={urgency.color}>{urgency.label}</Badge>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 日時タブ */}
            {activeTab === 'date' && (
              <div className="space-y-4">
                <div>
                  <Label>期間指定</Label>
                  <div className="flex gap-2 items-center mt-2">
                    <Input
                      type="date"
                      value={filters.dateRange.from?.toISOString().split('T')[0] || ''}
                      onChange={(e) => updateDateRange('from', e.target.value)}
                    />
                    <span>〜</span>
                    <Input
                      type="date"
                      value={filters.dateRange.to?.toISOString().split('T')[0] || ''}
                      onChange={(e) => updateDateRange('to', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label>時間帯</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {timeSlotOptions.map(slot => (
                      <label key={slot} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.timeSlots.includes(slot)}
                          onChange={() => toggleArrayFilter('timeSlots', slot)}
                          className="rounded"
                        />
                        <span className="text-sm">{slot}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 詳細設定タブ */}
            {activeTab === 'advanced' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="notes">備考・メモ</Label>
                  <Input
                    id="notes"
                    placeholder="備考やメモの内容を検索"
                    value={filters.notes}
                    onChange={(e) => setFilters(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>添付ファイルあり</Label>
                    <Switch
                      checked={filters.hasFiles}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, hasFiles: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>期限超過のみ</Label>
                    <Switch
                      checked={filters.isOverdue}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, isOverdue: checked }))}
                    />
                  </div>
                </div>

                <div>
                  <Label>タグ</Label>
                  <Input
                    placeholder="タグで検索（カンマ区切り）"
                    value={filters.tags.join(', ')}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                    }))}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* フッター */}
        <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
          <Button variant="outline" onClick={handleReset}>
            <X className="h-4 w-4 mr-2" />
            リセット
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              検索実行
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}