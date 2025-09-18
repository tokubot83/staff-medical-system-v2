'use client';

import React from 'react';
import Link from 'next/link';
import {
  Database, Download, Link2, History, Calendar,
  Shield, FileText, Share2, StickyNote, Users,
  Activity, Settings, TrendingUp, AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const adminFeatures = [
    {
      href: '/admin/master-data',
      label: 'マスターデータ管理',
      icon: Database,
      description: '職員、部署、役職などの基本データを管理',
      color: 'bg-blue-500',
      stats: '5種類のマスターデータ'
    },
    {
      href: '/admin/backup',
      label: 'バックアップ・リストア',
      icon: Download,
      description: 'データのバックアップと復元を実行',
      color: 'bg-green-500',
      stats: '毎日自動バックアップ'
    },
    {
      href: '/admin/integration',
      label: '外部システム連携',
      icon: Link2,
      description: 'APIキー管理と連携設定',
      color: 'bg-purple-500',
      stats: '3つの連携システム'
    },
    {
      href: '/admin/audit-log',
      label: '監査ログ',
      icon: History,
      description: 'システム操作履歴の確認',
      color: 'bg-orange-500',
      stats: '過去90日分のログ'
    },
    {
      href: '/admin/scheduler',
      label: 'スケジューラー',
      icon: Calendar,
      description: 'バッチ処理のスケジュール管理',
      color: 'bg-indigo-500',
      stats: '5つのジョブを管理'
    },
    {
      href: '/admin/image-management',
      label: '画像管理',
      icon: FileText,
      description: 'アップロード画像の一覧と管理',
      color: 'bg-pink-500',
      stats: 'ストレージ使用量: 2.3GB'
    }
  ];

  const quickAccessLinks = [
    {
      href: '/admin/documents',
      label: '保存書類',
      icon: FileText,
      description: '面談シート・評価シートなど'
    },
    {
      href: '/admin/mcp-shared',
      label: 'MCP共有',
      icon: Share2,
      description: '連携システムとの共有情報'
    },
    {
      href: '/admin/dev-notes',
      label: '開発メモ',
      icon: StickyNote,
      description: '開発ノートとドキュメント'
    },
    {
      href: '/admin/interview-bank',
      label: '面談質問バンク',
      icon: Users,
      description: '面談用質問の管理'
    }
  ];

  const systemStatus = [
    { label: 'データベース', status: 'online', icon: Database },
    { label: 'バックアップ', status: 'online', icon: Download },
    { label: 'API連携', status: 'online', icon: Link2 },
    { label: 'スケジューラー', status: 'online', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Shield className="h-8 w-8 text-amber-600" />
                管理者ダッシュボード
              </h1>
              <p className="mt-2 text-gray-600">システム全体の管理と設定を行います</p>
            </div>
            <div className="bg-amber-100 px-4 py-2 rounded-lg">
              <p className="text-sm text-amber-800 font-medium">管理者権限でログイン中</p>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            システムステータス
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {systemStatus.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{item.label}:</span>
                  <span className={`text-sm font-medium ${
                    item.status === 'online' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.status === 'online' ? '正常' : 'エラー'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Admin Features */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">管理機能</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.href}
                  href={feature.href}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className={`${feature.color} rounded-lg p-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{feature.label}</h3>
                      <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                      <p className="text-xs text-gray-500">{feature.stats}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Access */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">クイックアクセス</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickAccessLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="h-5 w-5 text-gray-600" />
                    <h3 className="font-medium text-gray-900">{link.label}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{link.description}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            最近のアクティビティ
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">バックアップが正常に完了しました</span>
              </div>
              <span className="text-xs text-gray-500">5分前</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">マスターデータが更新されました</span>
              </div>
              <span className="text-xs text-gray-500">1時間前</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">API連携の設定が変更されました</span>
              </div>
              <span className="text-xs text-gray-500">3時間前</span>
            </div>
          </div>
        </div>

        {/* Info Alert */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 font-medium">管理者向けのお知らせ</p>
              <p className="text-sm text-blue-700 mt-1">
                システムの重要な設定変更を行う際は、必ず事前にバックアップを作成してください。
                不明な点がある場合は、システム管理者にお問い合わせください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;