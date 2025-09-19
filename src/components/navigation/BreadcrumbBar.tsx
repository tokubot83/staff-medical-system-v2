'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

export default function BreadcrumbBar() {
  const pathname = usePathname()

  // パンくずリストの生成
  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs = []

    // 戦略分析カテゴリに属するページ
    const strategicAnalysisPages = [
      'hr-strategy',
      'talent-development',
      'organization-optimization',
      'work-environment',
      'cost-optimization',
      'recruitment-effectiveness',
      'skill-qualification',
      'department-analysis',
      'work-life-balance',
      'turnover-risk'
    ]

    // 基本指標カテゴリに属するページ
    const basicMetricsPages = [
      'two-axis-evaluation'
    ]

    // ページマッピング
    const pageNames: Record<string, string> = {
      'staff-cards': '職員カルテ',
      'evaluation': '評価管理',
      'interviews': '面談管理',
      'health': '健康管理',
      'recruitment': '採用管理',
      'education': '教育・研修',
      'attendance-management': '勤怠管理',
      'reports': 'レポートセンター',
      'hr-announcements': 'お知らせ配信',
      'stress-check': 'ストレスチェック',
      'goals': '目標管理',
      'notifications': 'お知らせ',
      'dashboard': 'ダッシュボード',
      'hr-system-guide': '人事制度ガイド',
      'admin': '管理者設定',
      'master-data': 'マスターデータ管理',
      'backup': 'バックアップ・リストア',
      'integration': '外部システム連携',
      'audit-log': '監査ログ',
      'scheduler': 'スケジューラー',
      'interview-bank': '面談バンク管理',
      'image-management': '画像管理',
      // レポートカテゴリ
      'basic-metrics': '基本指標',
      'cohort-analysis': 'コホート分析',
      'flow-analysis': 'フロー分析',
      'performance-evaluation': 'パフォーマンス評価',
      'retention': '定着分析',
      'simulation': 'シミュレーション',
      'strategic-analysis': '戦略分析',
      'hr-strategy': '人事管理戦略分析',
      'talent-development': '職種別人材育成戦略',
      'organization-optimization': '組織構造最適化分析',
      'work-environment': '労働環境改善戦略',
      'cost-optimization': 'コスト最適化戦略',
      'recruitment-effectiveness': '採用効率分析',
      'skill-qualification': 'スキル・資格管理',
      'department-analysis': '部門別詳細分析',
      'work-life-balance': 'ワークライフバランス',
      'talent-mapping': 'タレントマッピング',
      'turnover': '離職分析',
      'turnover-risk': '離職リスク予測',
      'wellbeing': 'ウェルビーイング',
      'two-axis-evaluation': '2軸評価分析',
      'home': 'ホーム',
      // 基本指標サブページ
      'basic-statistics': '基本統計',
      'real-time-dashboard': 'リアルタイムダッシュボード',
      'predictive-analytics': '予測的人員分析',
      'diversity-inclusion': 'ダイバーシティ＆インクルージョン',
      'compliance': 'コンプライアンス指標',
      'productivity': '生産性指標',
      'engagement': 'エンゲージメント指標',
      'cost-analysis': 'コスト分析指標',
      'benchmark': 'ベンチマーク指標',
      'integrated-assessment': '統合的指標アセスメント',
      'talent-quality': '人材の質',
      'talent-growth': '人材の成長',
      'risk-management': 'リスク管理',
      'organizational-efficiency': '組織効率',
      // コホート分析サブページ
      'department-cohort': '部門別コホート',
      'engagement-cohort': 'エンゲージメントコホート',
      'entry-year-cohort': '入社年次コホート',
      'generation-analysis': '世代別分析',
      'intervention-effect': '介入効果測定',
      'learning-cohort': '学習進捗コホート',
      'life-event-cohort': 'ライフイベントコホート',
      'location-cohort': '勤務地別コホート',
      'network-cohort': 'ネットワークコホート',
      'performance-cohort': 'パフォーマンスコホート',
      'wellbeing-cohort': 'ウェルビーイングコホート',
      // フロー分析サブページ
      'career-path': 'キャリアパス分析',
      'department-flow': '部門間異動フロー',
      'mobility-matrix': 'モビリティマトリックス',
      // パフォーマンス評価サブページ
      'cluster-analysis': 'クラスター分析',
      'department-comparison': '部門間比較',
      'evaluation-trend': '評価トレンド',
      'organization-optimization': '組織最適化',
      'performance-matrix': 'パフォーマンスマトリックス',
      'performance-prediction': 'パフォーマンス予測',
      'skill-assessment': 'スキル評価',
      'team-analysis': 'チーム分析',
      // 定着分析サブページ
      'cohort-intervention-effect': 'コホート介入効果',
      'cohort-yearly-tracking': '年次コホート追跡',
      'early-turnover-alert': '早期離職アラート',
      'early-turnover-pattern': '早期離職パターン',
      'factor-mapping': '要因マッピング',
      'hazard-cox-regression': 'Cox回帰分析',
      'hazard-risk-score': 'リスクスコア',
      'retention-simulator': '定着率シミュレーター',
      'segment-generation': '世代別セグメント',
      'segment-recruitment-type': '採用形態別セグメント',
      'survival-curve-department': '部門別生存曲線',
      'survival-curve-overall': '全体生存曲線',
      'turnover-contagion': '離職伝播分析',
      // シミュレーションサブページ
      'cost-optimization': 'コスト最適化',
      'organization-redesign': '組織再編成',
      'recruitment-planning': '採用計画',
      'retention-impact': '定着率インパクト',
      'scenario-planning': 'シナリオプランニング',
      // タレントマッピングサブページ
      'skill-matrix': 'スキルマトリックス',
      'succession-planning': '後継者育成計画',
      'talent-grid': 'タレントグリッド',
      // 離職分析サブページ
      'benchmark-best-practices': 'ベンチマーク・ベストプラクティス',
      'correlation-analysis': '相関分析',
      'cost-impact': 'コストインパクト',
      'exit-feedback': '退職者フィードバック',
      'factor-ranking': '要因ランキング',
      'high-risk-dashboard': 'ハイリスクダッシュボード',
      'improvement-suggestions': '改善提案',
      'predictive-modeling': '予測モデリング',
      'retention-strategies': '定着戦略',
      'risk-prediction': 'リスク予測分析',
      'time-series-trend': '時系列トレンド',
      'what-if-simulation': 'What-Ifシミュレーション',
      // ウェルビーイングサブページ
      'engagement-survey': 'エンゲージメント調査',
      'intervention-program': '介入プログラム',
      'stress-analysis': 'ストレス分析',
      'wellbeing-index': 'ウェルビーイング指数',
      'work-life-balance': 'ワークライフバランス'
    }

    if (segments.length === 0) {
      return [{ label: 'ホーム', href: '/', current: true }]
    }

    breadcrumbs.push({ label: 'ホーム', href: '/' })

    segments.forEach((segment, index) => {
      const isLast = index === segments.length - 1
      const href = '/' + segments.slice(0, index + 1).join('/')

      let label = pageNames[segment] || segment

      // 職員IDの場合
      if (segment.match(/^(ST|OH|TA)/)) {
        label = `職員詳細 (${segment})`
      }

      // 戦略分析カテゴリのページの場合、戦略分析を挿入
      if (index === 1 && segments[0] === 'reports' && strategicAnalysisPages.includes(segment)) {
        // レポートセンターの後に戦略分析を挿入
        breadcrumbs.push({
          label: '戦略分析',
          href: '/reports/strategic-analysis',
          current: false
        })
      }

      // 基本指標カテゴリのページの場合、基本指標を挿入
      if (index === 1 && segments[0] === 'reports' && basicMetricsPages.includes(segment)) {
        // レポートセンターの後に基本指標を挿入
        breadcrumbs.push({
          label: '基本指標',
          href: '/reports/basic-metrics',
          current: false
        })
      }

      breadcrumbs.push({
        label,
        href: isLast ? undefined : href,
        current: isLast
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <div className="bg-gray-50 border-t border-gray-600 border-b border-gray-300 px-6 py-2 shadow-inner relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-50 opacity-50"></div>
      <nav aria-label="パンくずリスト" className="relative">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <li className="flex items-center">
                  <ChevronRight className="w-3 h-3 text-gray-500 mx-1" />
                </li>
              )}
              <li className="flex items-center">
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-gray-700 hover:text-blue-700 transition-all duration-200 flex items-center hover:underline font-light tracking-wide"
                  >
                    {index === 0 && <Home className="w-3 h-3 mr-1" />}
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={`flex items-center ${
                    crumb.current
                      ? 'text-gray-900 font-normal tracking-wide'
                      : 'text-gray-700 font-light tracking-wide'
                  }`}>
                    {crumb.label}
                  </span>
                )}
              </li>
            </React.Fragment>
          ))}
        </ol>
      </nav>
    </div>
  )
}