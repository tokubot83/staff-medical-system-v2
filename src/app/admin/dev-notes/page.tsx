'use client';

import React, { useState, useEffect } from 'react';
import { developmentMemoService, DevelopmentMemo } from '@/services/developmentMemoService';
import {
  FileText, MessageSquare, BookOpen, AlertCircle,
  Info, CheckCircle, Clock, Archive, Search,
  Filter, ChevronRight, ExternalLink, Calendar,
  Tag, FolderOpen, Code, AlertTriangle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function DevNotesPage() {
  const [memos, setMemos] = useState<DevelopmentMemo[]>([]);
  const [filteredMemos, setFilteredMemos] = useState<DevelopmentMemo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statistics, setStatistics] = useState<any>(null);
  const [expandedMemos, setExpandedMemos] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadMemos();
  }, []);

  useEffect(() => {
    filterMemos();
  }, [memos, selectedCategory, selectedStatus, selectedPriority, searchTerm]);

  const loadMemos = () => {
    const allMemos = developmentMemoService.getAllMemos();
    setMemos(allMemos);
    setStatistics(developmentMemoService.getStatistics());
  };

  const filterMemos = () => {
    let filtered = [...memos];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(memo => memo.category === selectedCategory);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(memo => memo.status === selectedStatus);
    }

    if (selectedPriority !== 'all') {
      filtered = filtered.filter(memo => memo.priority === selectedPriority);
    }

    if (searchTerm) {
      filtered = developmentMemoService.searchMemos(searchTerm);
    }

    // 日付順でソート（新しい順）
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredMemos(filtered);
  };

  const toggleMemoExpansion = (memoId: string) => {
    const newExpanded = new Set(expandedMemos);
    if (newExpanded.has(memoId)) {
      newExpanded.delete(memoId);
    } else {
      newExpanded.add(memoId);
    }
    setExpandedMemos(newExpanded);
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'important':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'archived':
        return <Archive className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'file':
        return <Code className="h-4 w-4" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'important':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">開発メモ統合ページ</h1>
          <p className="text-gray-600 mt-1">すべての開発メモとタスクを一元管理</p>
        </div>
      </div>

      {/* 統計情報 */}
      {statistics && (
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">総メモ数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">未着手</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{statistics.byStatus.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">進行中</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{statistics.byStatus.in_progress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">完了</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{statistics.byStatus.completed}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* フィルター */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="メモを検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 bg-white">
              <SelectValue placeholder="カテゴリー" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべてのカテゴリー</SelectItem>
              {developmentMemoService.getCategories().map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-36 bg-white">
              <SelectValue placeholder="ステータス" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="pending">未着手</SelectItem>
              <SelectItem value="in_progress">進行中</SelectItem>
              <SelectItem value="completed">完了</SelectItem>
              <SelectItem value="archived">アーカイブ</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-36 bg-white">
              <SelectValue placeholder="優先度" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="important">Important</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 重要な通知 */}
      {filteredMemos.filter(m => m.priority === 'critical' && m.status !== 'completed').length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">重要な未完了タスク</AlertTitle>
          <AlertDescription className="text-red-700">
            {filteredMemos.filter(m => m.priority === 'critical' && m.status !== 'completed').length}件の重要なタスクが未完了です
          </AlertDescription>
        </Alert>
      )}

      {/* メモリスト */}
      <div className="space-y-4">
        {filteredMemos.map(memo => (
          <Card key={memo.id} className="hover:shadow-md transition-shadow">
            <CardHeader
              className="cursor-pointer"
              onClick={() => toggleMemoExpansion(memo.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getPriorityIcon(memo.priority)}
                    <CardTitle className="text-base">
                      {memo.title}
                    </CardTitle>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FolderOpen className="h-3 w-3" />
                      <span>{memo.category}</span>
                      {memo.subcategory && (
                        <>
                          <ChevronRight className="h-3 w-3" />
                          <span>{memo.subcategory}</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {getSourceIcon(memo.source.type)}
                      <span className="font-mono text-xs">{memo.source.path}</span>
                      {memo.source.line && (
                        <span className="text-xs text-gray-500">:L{memo.source.line}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(memo.date).toLocaleDateString('ja-JP')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={getStatusBadgeColor(memo.status)}>
                    {getStatusIcon(memo.status)}
                    <span className="ml-1">
                      {memo.status === 'pending' && '未着手'}
                      {memo.status === 'in_progress' && '進行中'}
                      {memo.status === 'completed' && '完了'}
                      {memo.status === 'archived' && 'アーカイブ'}
                    </span>
                  </Badge>

                  <Badge className={getPriorityBadgeColor(memo.priority)}>
                    {memo.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            {expandedMemos.has(memo.id) && (
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">
                    {memo.content}
                  </div>

                  {memo.tags && memo.tags.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Tag className="h-3 w-3 text-gray-500" />
                      <div className="flex gap-1">
                        {memo.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Open file:', memo.source.path);
                      }}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      ソースを開く
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {filteredMemos.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>該当する開発メモが見つかりません</p>
        </div>
      )}
    </div>
  );
}
