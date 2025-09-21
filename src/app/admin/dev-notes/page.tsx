'use client';

import React, { useState } from 'react';
import {
  StickyNote, Calendar, Tag, Search, Plus,
  Edit2, Trash2, Clock, User, BookOpen,
  Code, Database, Bug, Lightbulb, CheckCircle
} from 'lucide-react';

interface DevNote {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  status: 'todo' | 'in-progress' | 'done' | 'archived';
  priority: 'low' | 'medium' | 'high';
}

const DevNotesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // サンプルデータ
  const devNotes: DevNote[] = [
    {
      id: '6',
      title: '人事ステーションページ実装状況',
      content: `【実装完了機能】
1. ヒートマップダッシュボード
   - 3段階フェーズ表示（コース制度→等級制度→100点評価）
   - パフォーマンス層別×キャリアコース別マトリックス
   - パステルトーン配色での視認性向上

2. フィルタリング機能
   - 施設別フィルター（全施設/富士宮/富士宮南/フジトピア/フジヤマ）
   - 職種別フィルター（全職種/医師/看護師/介護士/理学療法士/事務職）
   - フェーズ切り替え機能

3. 職員詳細モーダル（IntegratedStaffModal）
   - セグメント別職員リスト表示
   - 個別アクション推奨表示
   - CSVエクスポート機能

4. アクションプラン作成機能（ActionPlanModal）
   - 短期・中期アクション設定
   - KPI指標管理
   - タイムライン設定

【未実装機能（DB連携後）】
1. 実データ連携
   - 職員マスタテーブル連携
   - 評価データテーブル連携
   - リアルタイム集計処理

2. ドリルダウン分析
   - セル単位の詳細分析
   - 時系列推移グラフ
   - 相関分析レポート

3. API実装
   - GET /api/hr-station/heatmap
   - GET /api/hr-station/staff-list
   - POST /api/hr-station/action-plan
   - GET /api/hr-station/export

4. パフォーマンス最適化
   - データキャッシュ機構
   - 仮想スクロール実装
   - 遅延ローディング

【DB構築後の作業指示】
1. lib/hr/heatmapData.tsのダミーデータを実API呼び出しに置換
2. components/hr/IntegratedStaffModal.tsxのgenerateStaffList関数をAPI連携に変更
3. app/api/hr-station/配下にAPIエンドポイント実装
4. Prismaスキーマに以下のテーブル追加：
   - hr_evaluations（評価データ）
   - hr_courses（コース設定）
   - hr_grades（等級設定）
   - hr_action_plans（アクションプラン）

【必要なDBテーブル設計】
- staff_master: 既存の職員マスタ
- hr_evaluations: phase, staff_id, technical_score, organizational_score, total_score, evaluation_date
- hr_courses: course_code, course_name, grade_ceiling, salary_coefficient
- hr_grades: grade_level, grade_name, min_points, max_points
- hr_action_plans: plan_id, layer, course, actions, timeline, kpis, created_by, created_at`,
      category: 'feature',
      tags: ['人事ステーション', 'HR', 'ダッシュボード', 'DB連携待ち'],
      createdAt: '2025-09-21',
      updatedAt: '2025-09-21',
      status: 'in-progress',
      priority: 'high'
    },
    {
      id: '1',
      title: '面談システムの改善点',
      content: '面談シートのUIを改善し、入力しやすくする。特にモバイル対応を強化する必要がある。',
      category: 'feature',
      tags: ['UI/UX', '面談', 'モバイル'],
      createdAt: '2024-03-15',
      updatedAt: '2024-03-18',
      status: 'in-progress',
      priority: 'high'
    },
    {
      id: '2',
      title: 'パフォーマンス最適化',
      content: 'レポート生成時のデータ取得を最適化。現在は全データを取得しているが、必要な範囲のみに限定する。',
      category: 'optimization',
      tags: ['パフォーマンス', 'データベース', 'レポート'],
      createdAt: '2024-03-10',
      updatedAt: '2024-03-12',
      status: 'todo',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'バグ修正: エクスポート機能',
      content: 'CSVエクスポート時に日本語が文字化けする問題を修正。UTF-8 BOMを追加する必要がある。',
      category: 'bug',
      tags: ['バグ', 'エクスポート', 'CSV'],
      createdAt: '2024-03-08',
      updatedAt: '2024-03-08',
      status: 'done',
      priority: 'high'
    },
    {
      id: '4',
      title: 'API設計の見直し',
      content: 'RESTful APIの設計を見直し、GraphQLへの移行を検討。特に複雑なデータ取得において効率化が期待できる。',
      category: 'architecture',
      tags: ['API', 'GraphQL', 'アーキテクチャ'],
      createdAt: '2024-03-05',
      updatedAt: '2024-03-06',
      status: 'todo',
      priority: 'low'
    },
    {
      id: '5',
      title: 'テスト自動化の強化',
      content: 'E2Eテストの追加とCI/CDパイプラインの改善。特に面談フローのテストカバレッジを上げる。',
      category: 'testing',
      tags: ['テスト', 'CI/CD', '自動化'],
      createdAt: '2024-03-01',
      updatedAt: '2024-03-03',
      status: 'in-progress',
      priority: 'medium'
    }
  ];

  const categories = [
    { value: 'all', label: 'すべて', icon: BookOpen, color: 'text-gray-600' },
    { value: 'feature', label: '機能追加', icon: Lightbulb, color: 'text-blue-600' },
    { value: 'bug', label: 'バグ', icon: Bug, color: 'text-red-600' },
    { value: 'optimization', label: '最適化', icon: Code, color: 'text-green-600' },
    { value: 'architecture', label: 'アーキテクチャ', icon: Database, color: 'text-purple-600' },
    { value: 'testing', label: 'テスト', icon: CheckCircle, color: 'text-orange-600' }
  ];

  const statuses = [
    { value: 'all', label: 'すべて' },
    { value: 'todo', label: 'TODO' },
    { value: 'in-progress', label: '進行中' },
    { value: 'done', label: '完了' },
    { value: 'archived', label: 'アーカイブ' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'done': return 'bg-green-100 text-green-700';
      case 'archived': return 'bg-gray-50 text-gray-500';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : BookOpen;
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.color : 'text-gray-600';
  };

  const filteredNotes = devNotes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || note.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <StickyNote className="h-8 w-8 text-amber-600" />
                開発メモ
              </h1>
              <p className="mt-2 text-gray-600">開発に関するメモ、タスク、アイデアを管理</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
              <Plus className="h-5 w-5" />
              新規メモ作成
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="検索..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">総メモ数</p>
                <p className="text-2xl font-bold text-gray-900">{devNotes.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">TODO</p>
                <p className="text-2xl font-bold text-gray-900">
                  {devNotes.filter(n => n.status === 'todo').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">進行中</p>
                <p className="text-2xl font-bold text-gray-900">
                  {devNotes.filter(n => n.status === 'in-progress').length}
                </p>
              </div>
              <Edit2 className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">完了</p>
                <p className="text-2xl font-bold text-gray-900">
                  {devNotes.filter(n => n.status === 'done').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Notes List */}
        <div className="space-y-4">
          {filteredNotes.map((note) => {
            const CategoryIcon = getCategoryIcon(note.category);
            return (
              <div key={note.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CategoryIcon className={`h-5 w-5 ${getCategoryColor(note.category)}`} />
                      <h3 className="text-lg font-semibold text-gray-900">{note.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(note.priority)}`}>
                        {note.priority === 'high' ? '高' : note.priority === 'medium' ? '中' : '低'}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(note.status)}`}>
                        {note.status === 'todo' ? 'TODO' :
                         note.status === 'in-progress' ? '進行中' :
                         note.status === 'done' ? '完了' : 'アーカイブ'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{note.content}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        {note.tags.map(tag => (
                          <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        作成: {note.createdAt}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        更新: {note.updatedAt}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredNotes.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <StickyNote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">該当するメモが見つかりません</p>
            <p className="text-sm text-gray-500 mt-2">検索条件を変更するか、新しいメモを作成してください</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevNotesPage;