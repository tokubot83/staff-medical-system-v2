'use client'

import Link from 'next/link'
import { FiTrendingUp, FiActivity, FiBarChart2, FiPieChart, FiAlertCircle } from 'react-icons/fi'

const metricsCategories = [
  {
    id: 'basic',
    title: '基本指標',
    description: '職員数、平均年齢、男女比などの基本的な統計情報',
    icon: FiBarChart2,
    color: 'from-blue-500 to-blue-600',
    metrics: ['総職員数', '平均年齢', '男女比', '職種別構成']
  },
  {
    id: 'quality',
    title: '品質指標',
    description: '医療サービスの質と職員のパフォーマンスに関する指標',
    icon: FiTrendingUp,
    color: 'from-green-500 to-green-600',
    metrics: ['患者満足度', '医療事故率', '臨床指標', '感染率']
  },
  {
    id: 'growth',
    title: '成長性指標',
    description: '職員の成長と組織の発展に関する指標',
    icon: FiActivity,
    color: 'from-purple-500 to-purple-600',
    metrics: ['研修参加率', '資格取得率', 'スキル向上度', 'キャリア満足度']
  },
  {
    id: 'risk',
    title: 'リスク指標',
    description: '組織運営上のリスクに関する指標',
    icon: FiAlertCircle,
    color: 'from-red-500 to-red-600',
    metrics: ['離職リスク', 'コンプライアンスリスク', 'メンタルヘルスリスク', '労務リスク']
  },
  {
    id: 'efficiency',
    title: '効率性指標',
    description: '業務効率と生産性に関する指標',
    icon: FiPieChart,
    color: 'from-orange-500 to-orange-600',
    metrics: ['労働生産性', '時間外労働率', '有給取得率', 'シフト充足率']
  }
]

export default function MetricsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">メトリクス</h1>
          <p className="text-gray-600">医療機関の各種指標を可視化・分析します</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metricsCategories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.id}
                href={`/metrics/${category.id}`}
                className="group block"
              >
                <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 p-6 border border-gray-100 hover:border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {category.description}
                  </p>
                  
                  <div className="space-y-1">
                    {category.metrics.map((metric, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-500">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                        {metric}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                    詳細を見る
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-12 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">メトリクスの活用方法</h3>
              <p className="text-gray-600 text-sm">
                各カテゴリーのメトリクスを定期的に確認することで、組織の健全性を多角的に把握できます。
                異常値や傾向の変化を早期に発見し、適切な対策を講じることが可能です。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}