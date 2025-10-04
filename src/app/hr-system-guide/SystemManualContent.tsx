'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen, Search, ChevronRight, Users, Shield, FileText,
  Building2, Bell, BarChart3, Settings, HelpCircle,
  CheckCircle, Clock, AlertTriangle, Home, Database,
  UserPlus, Edit3, Download, Upload, Award, Target,
  MessageSquare, Calendar, TrendingUp, Lock, Zap,
  FileCheck, ClipboardList, Briefcase
} from 'lucide-react';

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  subsections?: {
    id: string;
    title: string;
  }[];
}

const sections: Section[] = [
  {
    id: 'quick-start',
    title: 'クイックスタート',
    icon: <Zap className="w-5 h-5" />,
    subsections: [
      { id: 'first-login', title: '初回ログイン' },
      { id: 'basic-navigation', title: '基本操作' },
      { id: '5min-guide', title: '5分で分かる使い方' }
    ]
  },
  {
    id: 'staff-management',
    title: '職員情報管理',
    icon: <Users className="w-5 h-5" />,
    subsections: [
      { id: 'staff-register', title: '新規登録' },
      { id: 'staff-edit', title: '情報編集' },
      { id: 'staff-delete', title: '削除・退職処理' },
      { id: 'staff-import', title: '一括インポート' },
      { id: 'staff-export', title: 'データエクスポート' },
      { id: 'staff-history', title: '経歴・資格管理' }
    ]
  },
  {
    id: 'permission-system',
    title: '権限レベル管理',
    icon: <Shield className="w-5 h-5" />,
    subsections: [
      { id: 'permission-overview', title: '25レベル体系の理解' },
      { id: 'permission-facility', title: '施設別権限マッピング' },
      { id: 'permission-position', title: '役職別レベル設定' },
      { id: 'permission-special', title: '特別権限（97-99）' },
      { id: 'permission-calculation', title: '権限レベル計算ロジック' }
    ]
  },
  {
    id: 'interview-evaluation',
    title: '面談・評価システム',
    icon: <FileText className="w-5 h-5" />,
    subsections: [
      { id: 'interview-create', title: '面談シート作成' },
      { id: 'interview-conduct', title: '面談実施' },
      { id: 'evaluation-sheet', title: '評価シート運用' },
      { id: 'interview-progress', title: '進捗管理・督促' },
      { id: 'interview-analysis', title: 'データ集計・分析' },
      { id: 'motivation-types', title: '動機タイプ判定機能' }
    ]
  },
  {
    id: 'facility-management',
    title: '施設管理',
    icon: <Building2 className="w-5 h-5" />,
    subsections: [
      { id: 'facility-settings', title: '施設別設定' },
      { id: 'facility-master', title: '部署・職種マスタ' },
      { id: 'facility-transfer', title: '施設間異動処理' }
    ]
  },
  {
    id: 'notification-approval',
    title: '通知・承認フロー',
    icon: <Bell className="w-5 h-5" />,
    subsections: [
      { id: 'webhook-settings', title: 'Webhook設定' },
      { id: 'approval-workflow', title: '承認ワークフロー' },
      { id: 'reminder-settings', title: 'リマインダー設定' }
    ]
  },
  {
    id: 'reports-analytics',
    title: 'レポート・分析',
    icon: <BarChart3 className="w-5 h-5" />,
    subsections: [
      { id: 'report-staff-stats', title: '職員統計' },
      { id: 'report-permission', title: '権限分布' },
      { id: 'report-evaluation', title: '評価データ分析' },
      { id: 'report-custom', title: 'カスタムレポート作成' }
    ]
  },
  {
    id: 'system-settings',
    title: 'システム設定',
    icon: <Settings className="w-5 h-5" />,
    subsections: [
      { id: 'master-data', title: 'マスタデータ管理' },
      { id: 'backup-restore', title: 'バックアップ・復元' },
      { id: 'audit-log', title: '監査ログ' },
      { id: 'system-integration', title: 'VoiceDrive連携設定' }
    ]
  },
  {
    id: 'troubleshooting',
    title: 'トラブルシューティング',
    icon: <HelpCircle className="w-5 h-5" />,
    subsections: [
      { id: 'common-issues', title: 'よくある問題' },
      { id: 'error-messages', title: 'エラーメッセージ一覧' },
      { id: 'faq', title: 'FAQ' }
    ]
  }
];

export default function SystemManualContent() {
  const [activeSection, setActiveSection] = useState('quick-start');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['quick-start']);

  const toggleSection = (sectionId: string) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter(id => id !== sectionId));
    } else {
      setExpandedSections([...expandedSections, sectionId]);
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex gap-6 mt-6">
      {/* 左サイドバーナビゲーション */}
      <div className="w-80 flex-shrink-0">
        <div className="sticky top-4 bg-white rounded-xl shadow-lg p-4 max-h-[calc(100vh-100px)] overflow-y-auto">
          {/* 検索ボックス */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="マニュアル内を検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 目次ナビゲーション */}
          <nav className="space-y-1">
            {sections.map((section) => (
              <div key={section.id}>
                <button
                  onClick={() => {
                    toggleSection(section.id);
                    scrollToSection(section.id);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {section.icon}
                    <span className="font-medium">{section.title}</span>
                  </div>
                  {section.subsections && (
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        expandedSections.includes(section.id) ? 'rotate-90' : ''
                      }`}
                    />
                  )}
                </button>

                {/* サブセクション */}
                {section.subsections && expandedSections.includes(section.id) && (
                  <div className="ml-7 mt-1 space-y-1">
                    {section.subsections.map((subsection) => (
                      <button
                        key={subsection.id}
                        onClick={() => scrollToSection(subsection.id)}
                        className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                          activeSection === subsection.id
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {subsection.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* よく見られるページ */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">よく見られるページ</h3>
            <div className="space-y-1 text-sm">
              <button onClick={() => scrollToSection('5min-guide')} className="w-full text-left px-2 py-1 text-blue-600 hover:bg-blue-50 rounded">
                5分で分かる使い方
              </button>
              <button onClick={() => scrollToSection('staff-register')} className="w-full text-left px-2 py-1 text-blue-600 hover:bg-blue-50 rounded">
                職員の新規登録方法
              </button>
              <button onClick={() => scrollToSection('permission-overview')} className="w-full text-left px-2 py-1 text-blue-600 hover:bg-blue-50 rounded">
                権限レベルの理解
              </button>
              <button onClick={() => scrollToSection('interview-create')} className="w-full text-left px-2 py-1 text-blue-600 hover:bg-blue-50 rounded">
                面談シート作成
              </button>
              <button onClick={() => scrollToSection('faq')} className="w-full text-left px-2 py-1 text-blue-600 hover:bg-blue-50 rounded">
                FAQ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツエリア */}
      <div className="flex-1 bg-white rounded-xl shadow-lg p-8 max-w-5xl">
        {/* クイックスタート */}
        <section id="quick-start" className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-8 h-8 text-yellow-500" />
            <h2 className="text-3xl font-bold text-gray-900">クイックスタート</h2>
          </div>

          <div id="first-login" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-blue-500" />
              初回ログイン
            </h3>
            <div className="bg-blue-50 rounded-lg p-6 mb-4">
              <p className="text-gray-700 mb-4">
                システム管理者から発行されたログイン情報を使用して、初回ログインを行います。
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>ブラウザで <code className="bg-white px-2 py-1 rounded">https://staff-medical-system-v2.vercel.app</code> にアクセス</li>
                <li>メールアドレスとパスワードを入力</li>
                <li>初回ログイン時は必ずパスワード変更を実施</li>
                <li>二要素認証（2FA）の設定を推奨</li>
              </ol>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-800">セキュリティ上の注意</p>
                  <p className="text-yellow-700 text-sm mt-1">
                    パスワードは8文字以上で、大文字・小文字・数字・記号を組み合わせてください。
                    他のサービスと同じパスワードは使用しないでください。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div id="basic-navigation" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Home className="w-6 h-6 text-blue-500" />
              基本操作
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">ダッシュボード</h4>
                <p className="text-sm text-gray-600">
                  ログイン後、最初に表示される画面。重要な通知、タスク、統計情報が一覧表示されます。
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">左メニューバー</h4>
                <p className="text-sm text-gray-600">
                  主要な機能へのアクセスポイント。職員管理、面談・評価、レポート、設定などが配置されています。
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">検索機能</h4>
                <p className="text-sm text-gray-600">
                  上部の検索バーから職員名、職員ID、部署名などで素早く検索できます。
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">通知センター</h4>
                <p className="text-sm text-gray-600">
                  ベルアイコンをクリックすると、面談期限、承認待ち、システム更新などの通知が確認できます。
                </p>
              </div>
            </div>
          </div>

          <div id="5min-guide" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-500" />
              5分で分かる使い方
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">職員情報を登録</h4>
                  <p className="text-sm text-gray-600">左メニュー「職員管理」→「新規登録」から、基本情報、所属、役職を入力します。</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">権限レベルを設定</h4>
                  <p className="text-sm text-gray-600">職種・経験年数・役職に基づいて自動計算されますが、手動調整も可能です。</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">面談シートを作成</h4>
                  <p className="text-sm text-gray-600">「面談・評価」→「面談シート作成」から、対象職員と面談種類を選択します。</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">レポートを確認</h4>
                  <p className="text-sm text-gray-600">「レポート」から職員統計、評価データ、権限分布などを可視化できます。</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 職員情報管理 */}
        <section id="staff-management" className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 text-blue-500" />
            <h2 className="text-3xl font-bold text-gray-900">職員情報管理</h2>
          </div>

          <div id="staff-register" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-green-500" />
              新規登録
            </h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-3">登録手順</h4>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li className="ml-2">
                  <span className="font-medium">左メニューから「職員管理」→「新規登録」をクリック</span>
                  <p className="ml-6 mt-1 text-sm text-gray-600">権限レベル15（人事部門長）以上で実行可能</p>
                </li>
                <li className="ml-2">
                  <span className="font-medium">基本情報を入力</span>
                  <ul className="ml-6 mt-1 text-sm text-gray-600 list-disc">
                    <li>氏名（姓・名）</li>
                    <li>フリガナ（セイ・メイ）</li>
                    <li>職員ID（自動採番も可能）</li>
                    <li>メールアドレス（ログイン用）</li>
                    <li>生年月日</li>
                    <li>性別</li>
                  </ul>
                </li>
                <li className="ml-2">
                  <span className="font-medium">所属情報を選択</span>
                  <ul className="ml-6 mt-1 text-sm text-gray-600 list-disc">
                    <li>施設（小原病院、立神リハビリテーション温泉病院など）</li>
                    <li>部署</li>
                    <li>職種（看護師、理学療法士、作業療法士など）</li>
                    <li>役職（一般職員、主任、師長など）</li>
                  </ul>
                </li>
                <li className="ml-2">
                  <span className="font-medium">雇用情報を入力</span>
                  <ul className="ml-6 mt-1 text-sm text-gray-600 list-disc">
                    <li>入職日</li>
                    <li>雇用形態（正職員、パート、契約社員など）</li>
                    <li>勤務パターン</li>
                  </ul>
                </li>
                <li className="ml-2">
                  <span className="font-medium">権限レベルを確認・調整</span>
                  <p className="ml-6 mt-1 text-sm text-gray-600">
                    職種・経験年数・役職に基づいて自動計算されます。必要に応じて手動調整できます。
                  </p>
                </li>
                <li className="ml-2">
                  <span className="font-medium">「登録」ボタンをクリック</span>
                  <p className="ml-6 mt-1 text-sm text-gray-600">
                    登録完了後、本人にログイン情報がメール送信されます。
                  </p>
                </li>
              </ol>

              <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-800">自動入力機能</p>
                    <p className="text-blue-700 text-sm mt-1">
                      職種と経験年数を入力すると、権限レベルが自動計算されます。
                      また、職員IDは施設コード+連番で自動生成することも可能です。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="staff-edit" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Edit3 className="w-6 h-6 text-blue-500" />
              情報編集
            </h3>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">基本情報の変更</h4>
                <p className="text-sm text-gray-600 mb-3">
                  職員一覧から対象職員を選択し、「編集」ボタンをクリックします。
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>連絡先（メール、電話番号）</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>住所</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>緊急連絡先</span>
                  </li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">所属・役職の変更</h4>
                <p className="text-sm text-gray-600 mb-3">
                  異動や昇進時に使用します。変更履歴は自動的に記録されます。
                </p>
                <div className="bg-yellow-50 p-3 rounded">
                  <p className="text-sm text-yellow-800">
                    ⚠️ 役職変更時は権限レベルも自動更新されます。VoiceDriveシステムにも自動連携されます。
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">資格・免許の追加</h4>
                <p className="text-sm text-gray-600">
                  「資格管理」タブから、保有資格、取得日、更新日を登録できます。
                  更新期限が近づくと自動通知されます。
                </p>
              </div>
            </div>
          </div>

          <div id="staff-delete" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              削除・退職処理
            </h3>
            <div className="bg-red-50 border-l-4 border-red-400 p-6">
              <h4 className="font-semibold text-red-800 mb-3">⚠️ 重要な注意事項</h4>
              <p className="text-red-700 mb-4">
                職員データの削除は慎重に行ってください。退職者の場合は「削除」ではなく「退職処理」を推奨します。
              </p>
              <div className="space-y-3">
                <div>
                  <h5 className="font-semibold text-red-800 mb-1">退職処理（推奨）</h5>
                  <p className="text-sm text-red-700">
                    職員情報は残したまま、ステータスを「退職」に変更。過去の面談記録や評価データは保持されます。
                  </p>
                </div>
                <div>
                  <h5 className="font-semibold text-red-800 mb-1">完全削除</h5>
                  <p className="text-sm text-red-700">
                    全ての関連データ（面談記録、評価シート、ログなど）が削除されます。
                    権限レベル18（理事長）以上の承認が必要です。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div id="staff-import" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Upload className="w-6 h-6 text-purple-500" />
              一括インポート
            </h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                CSVファイルから複数職員のデータを一括登録できます。新規開設時や大量データ移行に便利です。
              </p>
              <h4 className="font-semibold text-gray-800 mb-2">手順</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>「職員管理」→「一括インポート」を選択</li>
                <li>CSVテンプレートをダウンロード</li>
                <li>Excelなどで職員データを入力</li>
                <li>CSV形式で保存（UTF-8エンコーディング）</li>
                <li>ファイルをアップロード</li>
                <li>プレビュー画面でデータを確認</li>
                <li>「インポート実行」をクリック</li>
              </ol>

              <div className="mt-4 bg-blue-50 p-4 rounded">
                <h5 className="font-semibold text-blue-800 mb-2">必須項目</h5>
                <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
                  <div>• 氏名（姓・名）</div>
                  <div>• フリガナ</div>
                  <div>• メールアドレス</div>
                  <div>• 施設ID</div>
                  <div>• 部署ID</div>
                  <div>• 職種</div>
                  <div>• 入職日</div>
                  <div>• 雇用形態</div>
                </div>
              </div>
            </div>
          </div>

          <div id="staff-export" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Download className="w-6 h-6 text-teal-500" />
              データエクスポート
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">CSV形式</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Excel等で加工可能な汎用形式。名簿作成や他システムへの移行に最適。
                </p>
                <button className="text-blue-600 text-sm hover:underline">エクスポート手順 →</button>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">PDF形式</h4>
                <p className="text-sm text-gray-600 mb-2">
                  印刷用レポート。職員名簿、組織図などを出力できます。
                </p>
                <button className="text-blue-600 text-sm hover:underline">エクスポート手順 →</button>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">JSON形式</h4>
                <p className="text-sm text-gray-600 mb-2">
                  システム連携用。API経由で他システムとデータ交換する際に使用。
                </p>
                <button className="text-blue-600 text-sm hover:underline">エクスポート手順 →</button>
              </div>
            </div>
          </div>

          <div id="staff-history" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-indigo-500" />
              経歴・資格管理
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">経歴情報の登録</h4>
                <p className="text-sm text-gray-600 mb-3">
                  職員の過去の職歴、院内異動履歴、研修受講歴を時系列で管理できます。
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span><strong>職歴：</strong>前職の病院名、所属部署、期間</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span><strong>院内異動：</strong>部署移動、役職変更の履歴</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span><strong>研修受講歴：</strong>院内外研修の受講記録</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">資格・免許管理</h4>
                <p className="text-sm text-gray-600 mb-3">
                  医療系資格は更新期限管理が重要です。期限の3ヶ月前から自動通知されます。
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-medium text-gray-800">看護師免許</p>
                    <p className="text-gray-600">更新なし / 登録情報確認</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-medium text-gray-800">専門看護師</p>
                    <p className="text-gray-600">5年ごと更新</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-medium text-gray-800">認定看護師</p>
                    <p className="text-gray-600">5年ごと更新</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-medium text-gray-800">理学療法士</p>
                    <p className="text-gray-600">更新なし / 登録情報確認</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 権限レベル管理 */}
        <section id="permission-system" className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-purple-500" />
            <h2 className="text-3xl font-bold text-gray-900">権限レベル管理</h2>
          </div>

          <div id="permission-overview" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">25レベル体系の理解</h3>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
              <p className="text-gray-700 mb-4">
                本システムでは、職員の経験・役職・業務に応じて<strong>1〜99の権限レベル</strong>を割り当てます。
                レベルによって、アクセスできる機能やデータが制限されます。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">基本レベル（1〜4）</h4>
                  <p className="text-sm text-gray-600">
                    経験年数に基づく基本レベル。0.5刻みでリーダー業務を考慮。
                  </p>
                  <ul className="mt-2 text-sm text-gray-600 space-y-1">
                    <li>• レベル1: 新人（0-3年）</li>
                    <li>• レベル2: 一般（4-7年）</li>
                    <li>• レベル3: 中堅（8-12年）</li>
                    <li>• レベル4: ベテラン（13年以上）</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">役職レベル（5〜18）</h4>
                  <p className="text-sm text-gray-600">
                    管理職・役職者の権限レベル。
                  </p>
                  <ul className="mt-2 text-sm text-gray-600 space-y-1">
                    <li>• レベル5: 主任・係長</li>
                    <li>• レベル7: 統括主任</li>
                    <li>• レベル10: 部長・医局長</li>
                    <li>• レベル15: 人事部門長</li>
                    <li>• レベル18: 理事長</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-800">特別権限レベル（97〜99）</p>
                  <p className="text-yellow-700 text-sm mt-1">
                    システム管理者、VoiceDrive連携、外部システム用の特別レベルです。
                    人事部職員には通常付与されません。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div id="permission-facility" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">施設別権限マッピング</h3>
            <p className="text-gray-700 mb-4">
              施設ごとに役職名が異なるため、役職と権限レベルのマッピングテーブルを管理します。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-blue-500 text-white px-4 py-2 font-semibold">
                  小原病院
                </div>
                <div className="p-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">役職</th>
                        <th className="text-right py-2">レベル</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600">
                      <tr className="border-b">
                        <td className="py-2">一般職員</td>
                        <td className="text-right">1-4</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">主任</td>
                        <td className="text-right">5</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">師長</td>
                        <td className="text-right">8</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">部長</td>
                        <td className="text-right">10</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-purple-500 text-white px-4 py-2 font-semibold">
                  立神リハビリテーション温泉病院
                </div>
                <div className="p-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">役職</th>
                        <th className="text-right py-2">レベル</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600">
                      <tr className="border-b">
                        <td className="py-2">一般職員</td>
                        <td className="text-right">1-4</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">統括主任</td>
                        <td className="text-right">7</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">技士長</td>
                        <td className="text-right">8</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">部長</td>
                        <td className="text-right">10</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div id="permission-position" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">役職別レベル設定</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-3">設定手順</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>「システム設定」→「権限管理」→「施設別役職マッピング」を選択</li>
                <li>対象施設を選択</li>
                <li>「役職追加」ボタンをクリック</li>
                <li>役職名と権限レベルを入力</li>
                <li>「保存」をクリック</li>
              </ol>

              <div className="mt-4 bg-blue-50 p-4 rounded">
                <h5 className="font-semibold text-blue-800 mb-2">💡 自動反映</h5>
                <p className="text-sm text-blue-700">
                  役職マッピングを変更すると、該当する全職員の権限レベルが自動的に更新されます。
                  VoiceDriveシステムにも即座に反映されます。
                </p>
              </div>
            </div>
          </div>

          <div id="permission-special" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">特別権限（97-99）</h3>
            <div className="bg-red-50 border-l-4 border-red-400 p-6">
              <h4 className="font-semibold text-red-800 mb-3">⚠️ 特別権限の取り扱い</h4>
              <p className="text-red-700 mb-4">
                特別権限は全機能にアクセス可能な最高権限です。付与は理事長承認が必須です。
              </p>
              <div className="space-y-3 text-sm">
                <div className="bg-white p-3 rounded">
                  <p className="font-semibold text-gray-800">レベル97: システム管理者</p>
                  <p className="text-gray-600">システム設定、マスタデータ管理、監査ログ閲覧</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="font-semibold text-gray-800">レベル98: VoiceDrive連携アカウント</p>
                  <p className="text-gray-600">VoiceDriveシステムとのAPI連携用アカウント</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="font-semibold text-gray-800">レベル99: 外部システム連携</p>
                  <p className="text-gray-600">外部システムからのAPI呼び出し用（最高権限）</p>
                </div>
              </div>
            </div>
          </div>

          <div id="permission-calculation" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">権限レベル計算ロジック</h3>
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-4">計算フロー</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-800">基本レベル判定</h5>
                    <p className="text-sm text-gray-600">経験年数から基本レベル（1-4）を決定</p>
                    <code className="text-xs bg-white px-2 py-1 rounded mt-1 inline-block">
                      0-3年→1, 4-7年→2, 8-12年→3, 13年以上→4
                    </code>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-800">リーダー業務加算</h5>
                    <p className="text-sm text-gray-600">リーダー業務ありの場合、+0.5レベル</p>
                    <code className="text-xs bg-white px-2 py-1 rounded mt-1 inline-block">
                      基本レベル + 0.5
                    </code>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-800">役職レベル適用</h5>
                    <p className="text-sm text-gray-600">役職がある場合、施設別マッピングから取得</p>
                    <code className="text-xs bg-white px-2 py-1 rounded mt-1 inline-block">
                      役職レベルを優先適用（5-18）
                    </code>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-800">最終確認・手動調整</h5>
                    <p className="text-sm text-gray-600">人事部門長が最終確認し、必要に応じて手動調整</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-white p-4 rounded border border-blue-200">
                <h5 className="font-semibold text-gray-800 mb-2">計算例</h5>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between items-center">
                    <span>看護師（経験5年、リーダーなし）</span>
                    <span className="font-semibold text-blue-600">→ レベル2</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>看護師（経験5年、リーダーあり）</span>
                    <span className="font-semibold text-blue-600">→ レベル2.5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>主任看護師（小原病院）</span>
                    <span className="font-semibold text-blue-600">→ レベル5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>統括主任PT（立神病院）</span>
                    <span className="font-semibold text-blue-600">→ レベル7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 面談・評価システム */}
        <section id="interview-evaluation" className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-green-500" />
            <h2 className="text-3xl font-bold text-gray-900">面談・評価システム</h2>
          </div>

          <div id="interview-create" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-green-500" />
              面談シート作成
            </h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-3">作成手順</h4>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li className="ml-2">
                  <span className="font-medium">左メニュー「面談・評価」→「面談シート作成」を選択</span>
                </li>
                <li className="ml-2">
                  <span className="font-medium">対象職員を検索・選択</span>
                  <p className="ml-6 mt-1 text-sm text-gray-600">
                    職員名、職員ID、部署で検索できます
                  </p>
                </li>
                <li className="ml-2">
                  <span className="font-medium">面談種類を選択</span>
                  <ul className="ml-6 mt-1 text-sm text-gray-600 list-disc space-y-1">
                    <li>15分面談: 日常的なショート面談</li>
                    <li>30分面談: 定期面談（月次・四半期）</li>
                    <li>45分面談: 詳細評価面談（半期・年次）</li>
                  </ul>
                </li>
                <li className="ml-2">
                  <span className="font-medium">面談日時を設定</span>
                  <p className="ml-6 mt-1 text-sm text-gray-600">
                    カレンダーから選択。職員と面談者双方のスケジュールを確認
                  </p>
                </li>
                <li className="ml-2">
                  <span className="font-medium">自動生成されたシートを確認</span>
                  <p className="ml-6 mt-1 text-sm text-gray-600">
                    職種・経験年数に応じた最適なテンプレートが自動選択されます
                  </p>
                </li>
                <li className="ml-2">
                  <span className="font-medium">「作成」ボタンをクリック</span>
                  <p className="ml-6 mt-1 text-sm text-gray-600">
                    職員と面談者にメール通知が送信されます
                  </p>
                </li>
              </ol>

              <div className="mt-6 bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-800">自動テンプレート選択</p>
                    <p className="text-green-700 text-sm mt-1">
                      職種（看護師・PT・OT）×経験レベル（新人・一般・中堅・ベテラン・主任）×時間（15/30/45分）で
                      最適な面談シートが自動選択されます。v5シートでは動機タイプ判定機能も搭載。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="interview-conduct" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-blue-500" />
              面談実施
            </h3>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">面談の進め方</h4>
                <p className="text-sm text-blue-700 mb-3">
                  面談シートはデジタル入力に最適化されています。タブレットやPCで入力しながら面談を進められます。
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded">
                    <p className="font-medium text-gray-800 mb-1">📱 タブレット入力</p>
                    <p className="text-xs text-gray-600">
                      面談中にその場で入力。職員も画面を見ながら確認できます。
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="font-medium text-gray-800 mb-1">✍️ 後から入力</p>
                    <p className="text-xs text-gray-600">
                      メモを取って後日入力。じっくり評価したい場合に最適。
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="font-medium text-gray-800 mb-1">🎙️ 音声入力対応</p>
                    <p className="text-xs text-gray-600">
                      VoiceDrive連携で音声からテキスト化。入力時間を大幅短縮。
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="font-medium text-gray-800 mb-1">💾 自動保存</p>
                    <p className="text-xs text-gray-600">
                      入力内容は30秒ごとに自動保存。途中で中断しても安心。
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">評価項目の入力</h4>
                <p className="text-sm text-gray-600 mb-3">
                  各評価項目は5段階評価（S・A・B・C・D）またはテキスト記述式です。
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-green-600">S（優秀）:</span>
                    <span>期待を大きく上回る成果</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-blue-600">A（良好）:</span>
                    <span>期待を上回る成果</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-gray-600">B（標準）:</span>
                    <span>期待通りの成果</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-orange-600">C（要改善）:</span>
                    <span>一部改善が必要</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-red-600">D（不十分）:</span>
                    <span>大幅な改善が必要</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div id="evaluation-sheet" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-purple-500" />
              評価シート運用
            </h3>
            <div className="bg-purple-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                評価シートは面談シートと連動しています。半期・年次評価時に使用します。
              </p>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">📊 自己評価</h4>
                  <p className="text-sm text-gray-600">
                    職員本人が自分の業務遂行度を評価。面談前に提出してもらいます。
                  </p>
                </div>
                <div className="bg-white p-4 rounded border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">👥 上司評価</h4>
                  <p className="text-sm text-gray-600">
                    直属の上司が評価。自己評価との差異を面談で確認します。
                  </p>
                </div>
                <div className="bg-white p-4 rounded border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">🎯 最終評価</h4>
                  <p className="text-sm text-gray-600">
                    面談を経て、上司と職員が合意した最終評価を記録します。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div id="interview-progress" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-orange-500" />
              進捗管理・督促
            </h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-3">進捗ダッシュボード</h4>
              <p className="text-sm text-gray-600 mb-4">
                「面談・評価」→「進捗管理」から、施設・部署別の面談実施状況を確認できます。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">未実施</span>
                    <span className="text-2xl font-bold text-red-500">12</span>
                  </div>
                  <p className="text-xs text-gray-500">面談シート未作成</p>
                </div>
                <div className="bg-white p-4 rounded border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">実施済み</span>
                    <span className="text-2xl font-bold text-green-500">48</span>
                  </div>
                  <p className="text-xs text-gray-500">面談完了・評価入力済み</p>
                </div>
                <div className="bg-white p-4 rounded border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">期限切れ</span>
                    <span className="text-2xl font-bold text-orange-500">3</span>
                  </div>
                  <p className="text-xs text-gray-500">期限超過・要督促</p>
                </div>
              </div>

              <div className="mt-6 bg-orange-50 border-l-4 border-orange-400 p-4">
                <h5 className="font-semibold text-orange-800 mb-2">自動リマインダー機能</h5>
                <p className="text-sm text-orange-700">
                  面談期限の7日前、3日前、当日にメール・Slack通知が自動送信されます。
                  未実施が続く場合、上位管理者にもエスカレーション通知されます。
                </p>
              </div>
            </div>
          </div>

          <div id="interview-analysis" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-teal-500" />
              データ集計・分析
            </h3>
            <div className="space-y-4">
              <div className="bg-teal-50 rounded-lg p-4">
                <h4 className="font-semibold text-teal-800 mb-2">📈 分析レポート自動生成</h4>
                <p className="text-sm text-teal-700 mb-3">
                  面談・評価データから多角的な分析レポートを自動生成します。
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-white p-2 rounded">• 部署別評価平均</div>
                  <div className="bg-white p-2 rounded">• 職種別評価分布</div>
                  <div className="bg-white p-2 rounded">• 経年変化トレンド</div>
                  <div className="bg-white p-2 rounded">• スキルギャップ分析</div>
                  <div className="bg-white p-2 rounded">• 離職リスク予測</div>
                  <div className="bg-white p-2 rounded">• 育成優先度ランキング</div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">カスタムレポート作成</h4>
                <p className="text-sm text-gray-600">
                  条件を指定して独自のレポートを作成できます。
                  Excel・PDF形式でエクスポート可能。
                </p>
              </div>
            </div>
          </div>

          <div id="motivation-types" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-pink-500" />
              動機タイプ判定機能（v5シート）
            </h3>
            <div className="bg-pink-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                v5面談シートには、職員の動機タイプを自動判定する機能が搭載されています。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded border-2 border-pink-200">
                  <div className="text-center mb-2">
                    <div className="inline-block p-3 bg-blue-100 rounded-full">
                      <Award className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-center text-blue-800 mb-2">達成動機型</h4>
                  <p className="text-sm text-gray-600 text-center">
                    目標達成や成果を重視。
                    チャレンジングな業務で力を発揮。
                  </p>
                </div>
                <div className="bg-white p-4 rounded border-2 border-pink-200">
                  <div className="text-center mb-2">
                    <div className="inline-block p-3 bg-green-100 rounded-full">
                      <Users className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-center text-green-800 mb-2">親和動機型</h4>
                  <p className="text-sm text-gray-600 text-center">
                    人間関係や協調性を重視。
                    チーム医療で力を発揮。
                  </p>
                </div>
                <div className="bg-white p-4 rounded border-2 border-pink-200">
                  <div className="text-center mb-2">
                    <div className="inline-block p-3 bg-purple-100 rounded-full">
                      <Shield className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-center text-purple-800 mb-2">権力動機型</h4>
                  <p className="text-sm text-gray-600 text-center">
                    影響力や責任を重視。
                    リーダーシップで力を発揮。
                  </p>
                </div>
              </div>
              <div className="mt-4 bg-white p-4 rounded border border-pink-200">
                <h5 className="font-semibold text-pink-800 mb-2">💡 活用方法</h5>
                <p className="text-sm text-gray-600">
                  判定された動機タイプに応じて、育成計画や業務配置を最適化できます。
                  例：達成動機型には目標管理重視、親和動機型にはチーム配属、権力動機型にはリーダー育成。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 施設管理 */}
        <section id="facility-management" className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-8 h-8 text-indigo-500" />
            <h2 className="text-3xl font-bold text-gray-900">施設管理</h2>
          </div>

          <div id="facility-settings" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">施設別設定</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                各施設ごとに独自の設定を管理できます。
              </p>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">基本情報</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 施設名、施設ID</li>
                    <li>• 所在地、電話番号</li>
                    <li>• 施設コード（職員ID採番用）</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">組織設定</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 部署一覧</li>
                    <li>• 役職マッピング</li>
                    <li>• 権限レベル設定</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">運用設定</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 面談サイクル（月次/四半期/半期）</li>
                    <li>• 評価期間</li>
                    <li>• 通知設定</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div id="facility-master" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">部署・職種マスタ</h3>
            <div className="bg-indigo-50 rounded-lg p-6">
              <h4 className="font-semibold text-indigo-800 mb-3">マスタデータ管理</h4>
              <p className="text-sm text-indigo-700 mb-4">
                「システム設定」→「マスタデータ管理」から、部署・職種の追加・編集・削除が可能です。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded">
                  <h5 className="font-semibold text-gray-800 mb-2">部署マスタ</h5>
                  <p className="text-sm text-gray-600 mb-2">施設ごとの部署を登録</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• 部署コード（一意）</li>
                    <li>• 部署名</li>
                    <li>• 上位部署（階層構造）</li>
                    <li>• 責任者職員ID</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded">
                  <h5 className="font-semibold text-gray-800 mb-2">職種マスタ</h5>
                  <p className="text-sm text-gray-600 mb-2">医療職・事務職の職種を登録</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• 職種コード</li>
                    <li>• 職種名</li>
                    <li>• カテゴリ（医療/コメディカル/事務）</li>
                    <li>• 必要資格</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div id="facility-transfer" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">施設間異動処理</h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
              <h4 className="font-semibold text-yellow-800 mb-3">異動処理の手順</h4>
              <ol className="list-decimal list-inside space-y-2 text-yellow-700">
                <li>対象職員の情報を開く</li>
                <li>「異動処理」ボタンをクリック</li>
                <li>異動先施設・部署を選択</li>
                <li>異動日を設定</li>
                <li>権限レベルを確認（異動先施設の役職マッピングに自動更新）</li>
                <li>「異動実行」をクリック</li>
              </ol>
              <div className="mt-4 bg-white p-3 rounded">
                <p className="text-sm text-gray-600">
                  ✅ 異動履歴は自動記録され、職員の経歴として残ります。
                  <br />
                  ✅ VoiceDriveシステムにも自動連携され、音声認識の施設情報が更新されます。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 通知・承認フロー */}
        <section id="notification-approval" className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-8 h-8 text-yellow-500" />
            <h2 className="text-3xl font-bold text-gray-900">通知・承認フロー</h2>
          </div>

          <div id="webhook-settings" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Webhook設定</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                外部システム（Slack、Teams、メールなど）への自動通知を設定できます。
              </p>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">Slack連携</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    特定のチャンネルに面談期限、評価完了、異動通知などを自動投稿
                  </p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    設定 → 通知設定 → Slack Webhook URL入力
                  </code>
                </div>
                <div className="bg-white p-4 rounded border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">メール通知</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    職員・上司・人事部へのメール通知をカスタマイズ
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• 面談リマインダー</li>
                    <li>• 評価提出依頼</li>
                    <li>• 権限変更通知</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 bg-blue-50 p-4 rounded">
                <h5 className="font-semibold text-blue-800 mb-2">リトライ機構</h5>
                <p className="text-sm text-blue-700">
                  Webhook送信失敗時は自動的に3回までリトライします。
                  それでも失敗する場合は管理者に通知されます。
                </p>
              </div>
            </div>
          </div>

          <div id="approval-workflow" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">承認ワークフロー</h3>
            <div className="bg-purple-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                重要な操作には承認プロセスを設定できます。
              </p>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded border-l-4 border-purple-400">
                  <h4 className="font-semibold text-purple-800 mb-2">1段階承認</h4>
                  <p className="text-sm text-gray-600">直属の上司または部門長が承認</p>
                  <p className="text-xs text-gray-500 mt-1">例：通常の異動、評価シート提出</p>
                </div>
                <div className="bg-white p-4 rounded border-l-4 border-purple-400">
                  <h4 className="font-semibold text-purple-800 mb-2">2段階承認</h4>
                  <p className="text-sm text-gray-600">部門長 → 人事部門長</p>
                  <p className="text-xs text-gray-500 mt-1">例：施設間異動、権限レベル変更</p>
                </div>
                <div className="bg-white p-4 rounded border-l-4 border-purple-400">
                  <h4 className="font-semibold text-purple-800 mb-2">理事長承認</h4>
                  <p className="text-sm text-gray-600">理事長の最終承認が必要</p>
                  <p className="text-xs text-gray-500 mt-1">例：特別権限付与、職員削除</p>
                </div>
              </div>
            </div>
          </div>

          <div id="reminder-settings" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">リマインダー設定</h3>
            <div className="bg-orange-50 rounded-lg p-6">
              <h4 className="font-semibold text-orange-800 mb-3">自動リマインダーのカスタマイズ</h4>
              <p className="text-sm text-orange-700 mb-4">
                「設定」→「通知・リマインダー」から、通知タイミングをカスタマイズできます。
              </p>
              <table className="w-full bg-white rounded border border-orange-200">
                <thead>
                  <tr className="bg-orange-100">
                    <th className="text-left p-3 text-sm font-semibold">イベント</th>
                    <th className="text-left p-3 text-sm font-semibold">デフォルト</th>
                    <th className="text-left p-3 text-sm font-semibold">カスタマイズ例</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-600">
                  <tr className="border-t">
                    <td className="p-3">面談期限</td>
                    <td className="p-3">7日前、3日前、当日</td>
                    <td className="p-3">14日前、7日前、1日前</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">評価提出期限</td>
                    <td className="p-3">3日前、当日</td>
                    <td className="p-3">5日前、2日前</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">資格更新期限</td>
                    <td className="p-3">3ヶ月前、1ヶ月前</td>
                    <td className="p-3">6ヶ月前、3ヶ月前、1ヶ月前</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* レポート・分析 */}
        <section id="reports-analytics" className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-8 h-8 text-teal-500" />
            <h2 className="text-3xl font-bold text-gray-900">レポート・分析</h2>
          </div>

          <div id="report-staff-stats" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">職員統計</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                職員データから多角的な統計レポートを生成できます。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">📊 基本統計</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 総職員数、在職・退職者数</li>
                    <li>• 施設別・部署別人数</li>
                    <li>• 職種別分布</li>
                    <li>• 年齢・性別構成</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">📈 推移分析</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 月次・年次人員推移</li>
                    <li>• 入職・退職率</li>
                    <li>• 離職率トレンド</li>
                    <li>• 平均勤続年数</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">🎓 資格・スキル</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 保有資格一覧</li>
                    <li>• 専門・認定看護師数</li>
                    <li>• 資格更新予定</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">⏰ 勤務形態</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 正職員・パート比率</li>
                    <li>• 勤務パターン分布</li>
                    <li>• 夜勤可能者数</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div id="report-permission" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">権限分布</h3>
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-semibold text-blue-800 mb-3">権限レベル別集計</h4>
              <p className="text-sm text-blue-700 mb-4">
                施設・部署ごとの権限レベル分布を可視化します。
              </p>
              <div className="bg-white p-4 rounded">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-32 text-sm text-gray-600">レベル1-4</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div className="bg-green-500 h-full" style={{ width: '60%' }}></div>
                    </div>
                    <div className="w-16 text-right text-sm font-semibold">60%</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 text-sm text-gray-600">レベル5-9</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: '25%' }}></div>
                    </div>
                    <div className="w-16 text-right text-sm font-semibold">25%</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 text-sm text-gray-600">レベル10-18</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div className="bg-purple-500 h-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="w-16 text-right text-sm font-semibold">15%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="report-evaluation" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">評価データ分析</h3>
            <div className="bg-teal-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                面談・評価データから人材育成に役立つ分析を実施します。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded">
                  <h4 className="font-semibold text-teal-800 mb-2">評価分布</h4>
                  <p className="text-sm text-gray-600">S/A/B/C/D評価の分布をグラフ化</p>
                </div>
                <div className="bg-white p-4 rounded">
                  <h4 className="font-semibold text-teal-800 mb-2">成長トレンド</h4>
                  <p className="text-sm text-gray-600">個人の評価推移を時系列で表示</p>
                </div>
                <div className="bg-white p-4 rounded">
                  <h4 className="font-semibold text-teal-800 mb-2">スキルマップ</h4>
                  <p className="text-sm text-gray-600">部署全体のスキルレベルを可視化</p>
                </div>
              </div>
            </div>
          </div>

          <div id="report-custom" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">カスタムレポート作成</h3>
            <div className="bg-purple-50 rounded-lg p-6">
              <h4 className="font-semibold text-purple-800 mb-3">自由にレポートを設計</h4>
              <p className="text-sm text-purple-700 mb-4">
                「レポート」→「カスタムレポート」から、独自の集計条件でレポートを作成できます。
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-purple-700">
                <li>データソースを選択（職員、面談、評価など）</li>
                <li>抽出条件を設定（施設、部署、職種、期間など）</li>
                <li>表示項目を選択</li>
                <li>グラフ種類を選択（棒グラフ、円グラフ、折れ線など）</li>
                <li>レポート名を付けて保存</li>
              </ol>
              <div className="mt-4 bg-white p-3 rounded">
                <p className="text-sm text-gray-600">
                  💾 保存したレポートは「お気に入りレポート」から即座にアクセスできます。
                  定期実行設定で、毎週・毎月自動生成も可能です。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* システム設定 */}
        <section id="system-settings" className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-8 h-8 text-gray-500" />
            <h2 className="text-3xl font-bold text-gray-900">システム設定</h2>
          </div>

          <div id="master-data" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Database className="w-6 h-6 text-gray-500" />
              マスタデータ管理
            </h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                システムの基盤となるマスタデータを一元管理します。
                権限レベル15（人事部門長）以上で編集可能です。
              </p>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">施設マスタ</h4>
                  <p className="text-sm text-gray-600">施設の追加・編集・無効化</p>
                </div>
                <div className="bg-white p-4 rounded border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">部署マスタ</h4>
                  <p className="text-sm text-gray-600">施設ごとの部署階層を管理</p>
                </div>
                <div className="bg-white p-4 rounded border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">職種マスタ</h4>
                  <p className="text-sm text-gray-600">医療職・コメディカル・事務職の職種登録</p>
                </div>
                <div className="bg-white p-4 rounded border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">役職マスタ</h4>
                  <p className="text-sm text-gray-600">施設別の役職と権限レベルマッピング</p>
                </div>
                <div className="bg-white p-4 rounded border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">評価項目マスタ</h4>
                  <p className="text-sm text-gray-600">職種別の評価項目テンプレート</p>
                </div>
              </div>
            </div>
          </div>

          <div id="backup-restore" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">バックアップ・復元</h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
              <h4 className="font-semibold text-yellow-800 mb-3">⚠️ データ保護の重要性</h4>
              <p className="text-yellow-700 mb-4">
                システムデータは自動的に毎日バックアップされていますが、
                重要な作業前には手動バックアップを推奨します。
              </p>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded">
                  <h5 className="font-semibold text-gray-800 mb-2">自動バックアップ</h5>
                  <p className="text-sm text-gray-600">
                    毎日深夜2時に全データを自動バックアップ。30日分保持。
                  </p>
                </div>
                <div className="bg-white p-4 rounded">
                  <h5 className="font-semibold text-gray-800 mb-2">手動バックアップ</h5>
                  <p className="text-sm text-gray-600 mb-2">
                    「システム設定」→「バックアップ」→「今すぐバックアップ」で即座に実行
                  </p>
                  <p className="text-xs text-gray-500">
                    権限レベル18（理事長）以上で実行可能
                  </p>
                </div>
                <div className="bg-white p-4 rounded">
                  <h5 className="font-semibold text-gray-800 mb-2">データ復元</h5>
                  <p className="text-sm text-gray-600 mb-2">
                    バックアップ一覧から復元ポイントを選択して復元
                  </p>
                  <p className="text-xs text-red-600">
                    ※復元は現在のデータを上書きします。慎重に実施してください。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div id="audit-log" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">監査ログ</h3>
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                全ての操作履歴が記録され、セキュリティ監査に活用できます。
              </p>
              <div className="bg-white p-4 rounded border border-blue-200 mb-4">
                <h4 className="font-semibold text-blue-800 mb-2">記録される情報</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 操作日時</li>
                  <li>• 操作者（ユーザーID、権限レベル）</li>
                  <li>• 操作内容（登録、編集、削除、閲覧）</li>
                  <li>• 対象データ（職員ID、面談ID など）</li>
                  <li>• IPアドレス</li>
                  <li>• 変更前・変更後の値（編集の場合）</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">検索・フィルタ機能</h4>
                <p className="text-sm text-gray-600">
                  期間、操作者、操作種類、対象データで絞り込み可能。
                  CSV形式でエクスポートして外部監査に提出できます。
                </p>
              </div>
            </div>
          </div>

          <div id="system-integration" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">VoiceDrive連携設定</h3>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
              <h4 className="font-semibold text-purple-800 mb-3">🎙️ VoiceDriveシステムとの連携</h4>
              <p className="text-gray-700 mb-4">
                音声入力システム「VoiceDrive」と連携して、面談内容の音声入力が可能です。
              </p>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded border border-purple-200">
                  <h5 className="font-semibold text-gray-800 mb-2">連携機能</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 職員情報の自動同期（権限レベル含む）</li>
                    <li>• 面談内容の音声→テキスト変換</li>
                    <li>• 音声データの自動保存</li>
                    <li>• 施設・部署情報の連携</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded border border-purple-200">
                  <h5 className="font-semibold text-gray-800 mb-2">設定方法</h5>
                  <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                    <li>「システム設定」→「外部連携」→「VoiceDrive」を選択</li>
                    <li>API キーを入力（VoiceDrive側で発行）</li>
                    <li>連携テストを実行</li>
                    <li>「有効化」をクリック</li>
                  </ol>
                </div>
              </div>
              <div className="mt-4 bg-blue-100 p-3 rounded">
                <p className="text-sm text-blue-800">
                  💡 VoiceDrive連携により、面談記録の入力時間が平均70%短縮されます。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* トラブルシューティング */}
        <section id="troubleshooting" className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-8 h-8 text-red-500" />
            <h2 className="text-3xl font-bold text-gray-900">トラブルシューティング</h2>
          </div>

          <div id="common-issues" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">よくある問題</h3>
            <div className="space-y-4">
              <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
                <summary className="font-semibold text-gray-800 cursor-pointer">
                  Q. ログインできない
                </summary>
                <div className="mt-3 pl-4 text-sm text-gray-600 space-y-2">
                  <p><strong>原因と対処法：</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>パスワードが間違っている → 「パスワードを忘れた」から再設定</li>
                    <li>アカウントがロックされている → システム管理者に連絡</li>
                    <li>ブラウザのCookieが無効 → Cookie設定を有効化</li>
                  </ul>
                </div>
              </details>

              <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
                <summary className="font-semibold text-gray-800 cursor-pointer">
                  Q. 職員データが保存できない
                </summary>
                <div className="mt-3 pl-4 text-sm text-gray-600 space-y-2">
                  <p><strong>考えられる原因：</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>必須項目が未入力 → 赤く表示された項目を確認</li>
                    <li>権限が不足 → 権限レベル15以上が必要</li>
                    <li>メールアドレスが重複 → 別のメールアドレスを使用</li>
                  </ul>
                </div>
              </details>

              <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
                <summary className="font-semibold text-gray-800 cursor-pointer">
                  Q. 面談シートが表示されない
                </summary>
                <div className="mt-3 pl-4 text-sm text-gray-600 space-y-2">
                  <p><strong>対処法：</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>ブラウザのキャッシュをクリア（Ctrl+F5）</li>
                    <li>別のブラウザで試す（Chrome推奨）</li>
                    <li>職種・経験年数が正しく設定されているか確認</li>
                  </ul>
                </div>
              </details>

              <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
                <summary className="font-semibold text-gray-800 cursor-pointer">
                  Q. 権限レベルが自動計算されない
                </summary>
                <div className="mt-3 pl-4 text-sm text-gray-600 space-y-2">
                  <p><strong>確認事項：</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>職種が選択されているか</li>
                    <li>入職日が入力されているか（経験年数の計算に必要）</li>
                    <li>施設別役職マッピングが設定されているか</li>
                  </ul>
                  <p className="mt-2">それでも解決しない場合は、手動で権限レベルを設定できます。</p>
                </div>
              </details>

              <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
                <summary className="font-semibold text-gray-800 cursor-pointer">
                  Q. VoiceDrive連携がうまくいかない
                </summary>
                <div className="mt-3 pl-4 text-sm text-gray-600 space-y-2">
                  <p><strong>チェックポイント：</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>APIキーが正しく入力されているか</li>
                    <li>VoiceDrive側でアカウントレベルが設定されているか</li>
                    <li>ネットワーク接続が安定しているか</li>
                    <li>「連携テスト」を実行してエラー内容を確認</li>
                  </ul>
                </div>
              </details>

              <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
                <summary className="font-semibold text-gray-800 cursor-pointer">
                  Q. CSVインポートが失敗する
                </summary>
                <div className="mt-3 pl-4 text-sm text-gray-600 space-y-2">
                  <p><strong>よくある原因：</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>文字コードがUTF-8でない → Excelで保存時にUTF-8を選択</li>
                    <li>列の順番が間違っている → テンプレートの列順を守る</li>
                    <li>日付形式が不正 → YYYY-MM-DD形式で入力</li>
                    <li>必須項目が空欄 → プレビュー画面で確認</li>
                  </ul>
                </div>
              </details>
            </div>
          </div>

          <div id="error-messages" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">エラーメッセージ一覧</h3>
            <div className="bg-red-50 rounded-lg p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-red-200">
                    <th className="text-left p-2 text-sm font-semibold">エラーコード</th>
                    <th className="text-left p-2 text-sm font-semibold">メッセージ</th>
                    <th className="text-left p-2 text-sm font-semibold">対処法</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-600">
                  <tr className="border-b border-red-100">
                    <td className="p-2 font-mono">AUTH_001</td>
                    <td className="p-2">認証に失敗しました</td>
                    <td className="p-2">パスワードを確認してください</td>
                  </tr>
                  <tr className="border-b border-red-100">
                    <td className="p-2 font-mono">PERM_001</td>
                    <td className="p-2">権限が不足しています</td>
                    <td className="p-2">管理者に権限付与を依頼</td>
                  </tr>
                  <tr className="border-b border-red-100">
                    <td className="p-2 font-mono">DATA_001</td>
                    <td className="p-2">必須項目が未入力です</td>
                    <td className="p-2">赤字の項目を入力してください</td>
                  </tr>
                  <tr className="border-b border-red-100">
                    <td className="p-2 font-mono">DATA_002</td>
                    <td className="p-2">データが重複しています</td>
                    <td className="p-2">メールアドレス・職員IDが重複</td>
                  </tr>
                  <tr className="border-b border-red-100">
                    <td className="p-2 font-mono">INTG_001</td>
                    <td className="p-2">VoiceDrive連携エラー</td>
                    <td className="p-2">APIキー・ネットワークを確認</td>
                  </tr>
                  <tr className="border-b border-red-100">
                    <td className="p-2 font-mono">FILE_001</td>
                    <td className="p-2">ファイル形式が不正です</td>
                    <td className="p-2">CSV（UTF-8）形式で保存</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div id="faq" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">FAQ（よくある質問）</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Q. 権限レベルは後から変更できますか？</h4>
                <p className="text-sm text-blue-700">
                  A. はい、可能です。人事部門長（レベル15）以上の権限があれば、職員情報編集画面から変更できます。
                  変更履歴は監査ログに記録されます。
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Q. 退職者のデータはどうなりますか？</h4>
                <p className="text-sm text-blue-700">
                  A. 退職処理を行うと、ステータスが「退職」になりログイン不可になりますが、データは保持されます。
                  過去の面談記録や評価データも閲覧可能です。完全削除する場合は理事長承認が必要です。
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Q. 面談シートのカスタマイズはできますか？</h4>
                <p className="text-sm text-blue-700">
                  A. 評価項目マスタから、職種別・施設別にカスタマイズ可能です。
                  「システム設定」→「評価項目マスタ」から編集してください。
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Q. スマートフォンから操作できますか？</h4>
                <p className="text-sm text-blue-700">
                  A. はい、レスポンシブデザインに対応しているため、スマートフォン・タブレットからも操作可能です。
                  ただし、大量データの入力や管理作業はPCを推奨します。
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Q. データのエクスポートに制限はありますか？</h4>
                <p className="text-sm text-blue-700">
                  A. 権限レベルに応じて制限があります。レベル5以上で自部署、レベル10以上で自施設全体、
                  レベル15以上で全施設のデータをエクスポートできます。
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Q. システムのサポート体制は？</h4>
                <p className="text-sm text-blue-700">
                  A. 平日9:00-18:00にヘルプデスクで対応します（内線: 1234、メール: support@hospital.jp）。
                  緊急時は24時間対応のシステム管理者に連絡してください。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* フッター */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">📞 お問い合わせ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-800">ヘルプデスク</p>
                <p>📞 内線: 1234</p>
                <p>✉️ support@hospital.jp</p>
                <p>🕐 平日 9:00-18:00</p>
              </div>
              <div>
                <p className="font-medium text-gray-800">緊急時（24時間対応）</p>
                <p>📞 緊急: 090-XXXX-XXXX</p>
                <p>システム管理者直通</p>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            <p>医療職員管理システム v2.0 | 最終更新: 2025年10月4日</p>
          </div>
        </div>
      </div>
    </div>
  );
}
