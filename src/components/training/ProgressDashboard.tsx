'use client'

import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Users, 
  Building, 
  Award,
  AlertCircle,
  Clock,
  CheckCircle,
  Activity,
  BarChart3,
  Target,
  Eye,
  RefreshCw
} from 'lucide-react'

// モックデータ（実際の実装ではAPIから取得）
const mockDashboardData = {
  overview: {
    totalEmployees: 1250,
    activeTrainees: 892,
    completionRate: 71.4,
    averageScore: 82.5,
    lastUpdated: new Date().toISOString()
  },
  trainingProgress: {
    mandatory: {
      total: 15,
      completed: 12,
      inProgress: 2,
      notStarted: 1,
      completionRate: 80
    },
    optional: {
      total: 25,
      completed: 15,
      inProgress: 6,
      notStarted: 4,
      completionRate: 60
    }
  },
  evaluationItems: {
    corporate: {
      total: 30,
      achieved: 24,
      achievementRate: 80,
      averageScore: 22.5
    },
    facility: {
      total: 20,
      achieved: 15,
      achievementRate: 75,
      averageScore: 14.2
    }
  },
  facilityComparison: [
    { 
      id: 1, 
      name: '第一病院', 
      employees: 450, 
      completionRate: 85.2,
      averageScore: 88.5,
      rank: 1,
      trend: 'up'
    },
    { 
      id: 2, 
      name: '第二病院', 
      employees: 380, 
      completionRate: 78.5,
      averageScore: 82.3,
      rank: 2,
      trend: 'up'
    },
    { 
      id: 3, 
      name: '介護施設A', 
      employees: 220, 
      completionRate: 72.8,
      averageScore: 79.1,
      rank: 3,
      trend: 'stable'
    },
    { 
      id: 4, 
      name: '介護施設B', 
      employees: 200, 
      completionRate: 68.5,
      averageScore: 75.5,
      rank: 4,
      trend: 'down'
    }
  ],
  realtimeUpdates: [
    {
      id: 1,
      type: 'completion',
      facility: '第一病院',
      department: '看護部',
      message: '感染管理研修を15名が完了',
      timestamp: '5分前'
    },
    {
      id: 2,
      type: 'alert',
      facility: '第二病院',
      department: '薬剤部',
      message: '法定研修の期限が3日後',
      timestamp: '10分前'
    },
    {
      id: 3,
      type: 'achievement',
      facility: '介護施設A',
      department: 'リハビリ科',
      message: '評価目標80%を達成',
      timestamp: '30分前'
    }
  ],
  categoryProgress: [
    { category: '法定研修', required: 100, completed: 92, rate: 92 },
    { category: '専門技術', required: 80, completed: 68, rate: 85 },
    { category: 'マネジメント', required: 60, completed: 45, rate: 75 },
    { category: 'ソフトスキル', required: 40, completed: 28, rate: 70 }
  ]
}

export default function ProgressDashboard() {
  const [data, setData] = useState(mockDashboardData)
  const [selectedFacility, setSelectedFacility] = useState('all')
  const [isAutoRefresh, setIsAutoRefresh] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // 自動更新機能（30秒ごと）
  useEffect(() => {
    if (!isAutoRefresh) return

    const interval = setInterval(() => {
      // 実際の実装ではAPIを呼び出してデータを更新
      setLastRefresh(new Date())
      console.log('Dashboard data refreshed')
    }, 30000)

    return () => clearInterval(interval)
  }, [isAutoRefresh])

  // 手動更新
  const handleManualRefresh = () => {
    setLastRefresh(new Date())
    // 実際の実装ではAPIを呼び出してデータを更新
  }

  // パーセンテージに応じた色を返す
  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return '#10b981'
    if (percentage >= 60) return '#3b82f6'
    if (percentage >= 40) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div className="progressDashboard">
      {/* ヘッダー */}
      <div className="dashboardHeader">
        <div className="headerContent">
          <h2>研修進捗ダッシュボード</h2>
          <p className="description">
            法人全体の研修進捗と評価達成状況をリアルタイムで監視
          </p>
        </div>
        <div className="headerActions">
          <div className="refreshStatus">
            <Clock size={16} />
            <span>最終更新: {lastRefresh.toLocaleTimeString()}</span>
          </div>
          <button 
            className="refreshButton"
            onClick={handleManualRefresh}
          >
            <RefreshCw size={18} />
            更新
          </button>
          <button 
            className={`autoRefreshToggle ${isAutoRefresh ? 'active' : ''}`}
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
          >
            <Activity size={18} />
            {isAutoRefresh ? '自動更新ON' : '自動更新OFF'}
          </button>
        </div>
      </div>

      {/* 概要カード */}
      <div className="overviewGrid">
        <div className="overviewCard">
          <div className="cardIcon">
            <Users size={24} />
          </div>
          <div className="cardContent">
            <div className="cardValue">{data.overview.totalEmployees.toLocaleString()}</div>
            <div className="cardLabel">総職員数</div>
            <div className="cardSubtext">
              研修対象: {data.overview.activeTrainees}名
            </div>
          </div>
        </div>

        <div className="overviewCard">
          <div className="cardIcon">
            <TrendingUp size={24} />
          </div>
          <div className="cardContent">
            <div className="cardValue">{data.overview.completionRate}%</div>
            <div className="cardLabel">全体完了率</div>
            <div className="progressBar">
              <div 
                className="progressFill"
                style={{ 
                  width: `${data.overview.completionRate}%`,
                  backgroundColor: getProgressColor(data.overview.completionRate)
                }}
              />
            </div>
          </div>
        </div>

        <div className="overviewCard">
          <div className="cardIcon">
            <Award size={24} />
          </div>
          <div className="cardContent">
            <div className="cardValue">{data.overview.averageScore}点</div>
            <div className="cardLabel">平均評価スコア</div>
            <div className="cardSubtext">
              前月比: <span className="positive">+2.3点</span>
            </div>
          </div>
        </div>

        <div className="overviewCard">
          <div className="cardIcon">
            <Target size={24} />
          </div>
          <div className="cardContent">
            <div className="cardValue">
              {data.evaluationItems.corporate.achievementRate}%
            </div>
            <div className="cardLabel">評価項目達成率</div>
            <div className="cardSubtext">
              法人: {data.evaluationItems.corporate.achievementRate}% / 
              施設: {data.evaluationItems.facility.achievementRate}%
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="dashboardContent">
        <div className="leftColumn">
          {/* 研修カテゴリ別進捗 */}
          <div className="sectionCard">
            <div className="sectionHeader">
              <h3>
                <BarChart3 size={20} />
                カテゴリ別進捗
              </h3>
            </div>
            <div className="categoryProgressList">
              {data.categoryProgress.map((category, index) => (
                <div key={index} className="categoryItem">
                  <div className="categoryInfo">
                    <span className="categoryName">{category.category}</span>
                    <span className="categoryStats">
                      {category.completed}/{category.required}名
                    </span>
                  </div>
                  <div className="categoryProgress">
                    <div className="progressBar">
                      <div 
                        className="progressFill"
                        style={{ 
                          width: `${category.rate}%`,
                          backgroundColor: getProgressColor(category.rate)
                        }}
                      />
                    </div>
                    <span className="progressText">{category.rate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 評価項目達成状況 */}
          <div className="sectionCard">
            <div className="sectionHeader">
              <h3>
                <Target size={20} />
                評価項目達成状況
              </h3>
            </div>
            <div className="evaluationGrid">
              <div className="evaluationCard">
                <h4>法人統一項目</h4>
                <div className="evaluationScore">
                  <span className="scoreValue">
                    {data.evaluationItems.corporate.averageScore}
                  </span>
                  <span className="scoreMax">/ 30点</span>
                </div>
                <div className="evaluationStats">
                  <div className="statItem">
                    <span className="statLabel">達成項目</span>
                    <span className="statValue">
                      {data.evaluationItems.corporate.achieved}/{data.evaluationItems.corporate.total}
                    </span>
                  </div>
                  <div className="statItem">
                    <span className="statLabel">達成率</span>
                    <span className="statValue">
                      {data.evaluationItems.corporate.achievementRate}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="evaluationCard">
                <h4>施設特化項目</h4>
                <div className="evaluationScore">
                  <span className="scoreValue">
                    {data.evaluationItems.facility.averageScore}
                  </span>
                  <span className="scoreMax">/ 20点</span>
                </div>
                <div className="evaluationStats">
                  <div className="statItem">
                    <span className="statLabel">達成項目</span>
                    <span className="statValue">
                      {data.evaluationItems.facility.achieved}/{data.evaluationItems.facility.total}
                    </span>
                  </div>
                  <div className="statItem">
                    <span className="statLabel">達成率</span>
                    <span className="statValue">
                      {data.evaluationItems.facility.achievementRate}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rightColumn">
          {/* 施設間比較 */}
          <div className="sectionCard">
            <div className="sectionHeader">
              <h3>
                <Building size={20} />
                施設間比較
              </h3>
              <select 
                className="facilityFilter"
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
              >
                <option value="all">全施設</option>
                <option value="hospital">病院のみ</option>
                <option value="care">介護施設のみ</option>
              </select>
            </div>
            <div className="facilityList">
              {data.facilityComparison.map((facility) => (
                <div key={facility.id} className="facilityItem">
                  <div className="facilityRank">
                    <span className="rankNumber">{facility.rank}</span>
                  </div>
                  <div className="facilityInfo">
                    <div className="facilityHeader">
                      <h4>{facility.name}</h4>
                      {facility.trend === 'up' && (
                        <span className="trendIndicator up">↑</span>
                      )}
                      {facility.trend === 'down' && (
                        <span className="trendIndicator down">↓</span>
                      )}
                      {facility.trend === 'stable' && (
                        <span className="trendIndicator stable">→</span>
                      )}
                    </div>
                    <div className="facilityStats">
                      <span className="statItem">
                        <Users size={14} />
                        {facility.employees}名
                      </span>
                      <span className="statItem">
                        完了率: {facility.completionRate}%
                      </span>
                      <span className="statItem">
                        平均: {facility.averageScore}点
                      </span>
                    </div>
                    <div className="facilityProgress">
                      <div 
                        className="progressFill"
                        style={{ 
                          width: `${facility.completionRate}%`,
                          backgroundColor: getProgressColor(facility.completionRate)
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* リアルタイム更新 */}
          <div className="sectionCard">
            <div className="sectionHeader">
              <h3>
                <Eye size={20} />
                リアルタイム更新
              </h3>
              <span className="liveIndicator">
                <span className="liveDot"></span>
                LIVE
              </span>
            </div>
            <div className="updatesList">
              {data.realtimeUpdates.map((update) => (
                <div key={update.id} className="updateItem">
                  <div className="updateIcon">
                    {update.type === 'completion' && (
                      <CheckCircle size={18} color="#10b981" />
                    )}
                    {update.type === 'alert' && (
                      <AlertCircle size={18} color="#f59e0b" />
                    )}
                    {update.type === 'achievement' && (
                      <Award size={18} color="#3b82f6" />
                    )}
                  </div>
                  <div className="updateContent">
                    <div className="updateHeader">
                      <span className="updateFacility">{update.facility}</span>
                      <span className="updateTime">{update.timestamp}</span>
                    </div>
                    <div className="updateMessage">{update.message}</div>
                    <div className="updateDepartment">{update.department}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .progressDashboard {
          padding: 20px;
          background: #f5f5f5;
          min-height: 100vh;
        }

        .dashboardHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .headerContent h2 {
          font-size: 24px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .description {
          color: #64748b;
          font-size: 14px;
        }

        .headerActions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .refreshStatus {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: #f1f5f9;
          border-radius: 6px;
          font-size: 13px;
          color: #64748b;
        }

        .refreshButton,
        .autoRefreshToggle {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 14px;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }

        .refreshButton:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .autoRefreshToggle.active {
          background: #10b981;
          color: white;
          border-color: #10b981;
        }

        .overviewGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .overviewCard {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          display: flex;
          gap: 16px;
        }

        .cardIcon {
          width: 48px;
          height: 48px;
          background: #f1f5f9;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3b82f6;
          flex-shrink: 0;
        }

        .cardContent {
          flex: 1;
        }

        .cardValue {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .cardLabel {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 8px;
        }

        .cardSubtext {
          font-size: 13px;
          color: #94a3b8;
        }

        .positive {
          color: #10b981;
          font-weight: 600;
        }

        .progressBar {
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
          margin-top: 8px;
        }

        .progressFill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .dashboardContent {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .leftColumn,
        .rightColumn {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .sectionCard {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .sectionHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .sectionHeader h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
        }

        .categoryProgressList {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .categoryItem {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .categoryInfo {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .categoryName {
          font-size: 14px;
          font-weight: 500;
          color: #475569;
        }

        .categoryStats {
          font-size: 13px;
          color: #94a3b8;
        }

        .categoryProgress {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .categoryProgress .progressBar {
          flex: 1;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progressText {
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          min-width: 40px;
          text-align: right;
        }

        .evaluationGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .evaluationCard {
          padding: 16px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .evaluationCard h4 {
          font-size: 14px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 12px;
        }

        .evaluationScore {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 12px;
        }

        .scoreValue {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
        }

        .scoreMax {
          font-size: 14px;
          color: #94a3b8;
        }

        .evaluationStats {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .evaluationStats .statItem {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
        }

        .statLabel {
          color: #64748b;
        }

        .statValue {
          font-weight: 600;
          color: #1e293b;
        }

        .facilityFilter {
          padding: 6px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 13px;
          color: #475569;
          background: white;
          cursor: pointer;
        }

        .facilityList {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .facilityItem {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .facilityRank {
          width: 32px;
          height: 32px;
          background: #3b82f6;
          color: white;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          flex-shrink: 0;
        }

        .facilityInfo {
          flex: 1;
        }

        .facilityHeader {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .facilityHeader h4 {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
        }

        .trendIndicator {
          font-size: 12px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .trendIndicator.up {
          color: #10b981;
          background: #d1fae5;
        }

        .trendIndicator.down {
          color: #ef4444;
          background: #fee2e2;
        }

        .trendIndicator.stable {
          color: #6b7280;
          background: #f3f4f6;
        }

        .facilityStats {
          display: flex;
          gap: 12px;
          margin-bottom: 8px;
          font-size: 12px;
          color: #64748b;
        }

        .facilityStats .statItem {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .facilityProgress {
          height: 4px;
          background: #e2e8f0;
          border-radius: 2px;
          overflow: hidden;
        }

        .liveIndicator {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          background: #fee2e2;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          color: #dc2626;
        }

        .liveDot {
          width: 6px;
          height: 6px;
          background: #dc2626;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }

        .updatesList {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 400px;
          overflow-y: auto;
        }

        .updateItem {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
          border-left: 3px solid transparent;
          transition: all 0.2s;
        }

        .updateItem:hover {
          background: #f1f5f9;
        }

        .updateIcon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .updateContent {
          flex: 1;
        }

        .updateHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .updateFacility {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
        }

        .updateTime {
          font-size: 11px;
          color: #94a3b8;
        }

        .updateMessage {
          font-size: 13px;
          color: #475569;
          margin-bottom: 4px;
        }

        .updateDepartment {
          font-size: 11px;
          color: #94a3b8;
        }

        @media (max-width: 1200px) {
          .overviewGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .dashboardContent {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .overviewGrid {
            grid-template-columns: 1fr;
          }

          .evaluationGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}