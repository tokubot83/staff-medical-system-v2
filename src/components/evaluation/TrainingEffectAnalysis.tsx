'use client'

import React, { useState } from 'react'
import { 
  BookOpen, 
  TrendingUp, 
  Award,
  Clock,
  Target,
  BarChart3,
  DollarSign,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Filter
} from 'lucide-react'

// モックデータ
const mockTrainingData = {
  summary: {
    totalTrainings: 24,
    completedTrainings: 18,
    totalHours: 96,
    averageScoreImprovement: 8.5,
    roi: 2.3
  },
  trainingImpact: [
    {
      id: 1,
      name: '感染管理研修',
      category: '専門技術',
      completedDate: '2023-06-15',
      hours: 8,
      evaluationBefore: 65,
      evaluationAfter: 78,
      improvement: 13,
      impactScore: 95
    },
    {
      id: 2,
      name: 'リーダーシップ研修',
      category: 'マネジメント',
      completedDate: '2023-08-20',
      hours: 16,
      evaluationBefore: 70,
      evaluationAfter: 82,
      improvement: 12,
      impactScore: 88
    },
    {
      id: 3,
      name: '医療安全管理',
      category: '法定研修',
      completedDate: '2023-09-10',
      hours: 4,
      evaluationBefore: 75,
      evaluationAfter: 85,
      improvement: 10,
      impactScore: 92
    },
    {
      id: 4,
      name: 'コミュニケーション技法',
      category: 'ソフトスキル',
      completedDate: '2023-10-05',
      hours: 6,
      evaluationBefore: 68,
      evaluationAfter: 75,
      improvement: 7,
      impactScore: 70
    }
  ],
  categoryAnalysis: [
    { category: '専門技術', trainings: 8, avgImprovement: 11.2, contribution: 35 },
    { category: 'マネジメント', trainings: 4, avgImprovement: 9.5, contribution: 25 },
    { category: '法定研修', trainings: 5, avgImprovement: 8.0, contribution: 20 },
    { category: 'ソフトスキル', trainings: 7, avgImprovement: 6.8, contribution: 20 }
  ],
  recommendations: [
    {
      id: 1,
      name: '認知症ケア専門研修',
      reason: '施設特化項目のスコア向上に効果的',
      expectedImprovement: 8,
      priority: 'high',
      hours: 12
    },
    {
      id: 2,
      name: 'プロジェクトマネジメント基礎',
      reason: 'リーダーシップスキルの強化',
      expectedImprovement: 6,
      priority: 'medium',
      hours: 8
    },
    {
      id: 3,
      name: 'データ分析入門',
      reason: '評価分析能力の向上',
      expectedImprovement: 5,
      priority: 'low',
      hours: 6
    }
  ],
  roiAnalysis: {
    totalInvestment: 480000,
    totalBenefit: 1104000,
    roi: 2.3,
    paybackPeriod: 4.5,
    breakdown: [
      { item: '生産性向上', value: 520000 },
      { item: '離職率低下', value: 380000 },
      { item: 'ミス削減', value: 204000 }
    ]
  }
}

export default function TrainingEffectAnalysis() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('impact')
  const data = mockTrainingData

  // カテゴリでフィルタリング
  const filteredTrainings = selectedCategory === 'all' 
    ? data.trainingImpact
    : data.trainingImpact.filter(t => t.category === selectedCategory)

  // ソート
  const sortedTrainings = [...filteredTrainings].sort((a, b) => {
    if (sortBy === 'impact') return b.impactScore - a.impactScore
    if (sortBy === 'improvement') return b.improvement - a.improvement
    if (sortBy === 'date') return new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime()
    return 0
  })

  // 効果レベルの判定
  const getImpactLevel = (score: number) => {
    if (score >= 90) return { text: '非常に高い', color: '#4caf50' }
    if (score >= 70) return { text: '高い', color: '#2196f3' }
    if (score >= 50) return { text: '中程度', color: '#ff9800' }
    return { text: '低い', color: '#f44336' }
  }

  return (
    <div className="trainingEffectAnalysis">
      {/* ヘッダー */}
      <div className="analysisHeader">
        <div className="headerContent">
          <h2>研修効果分析</h2>
          <p className="description">
            研修受講と評価向上の相関を分析し、効果的な育成計画を提案します
          </p>
        </div>
      </div>

      {/* サマリーカード */}
      <div className="summaryGrid">
        <div className="summaryCard">
          <div className="cardIcon">
            <BookOpen size={24} color="#1976d2" />
          </div>
          <div className="cardContent">
            <div className="cardValue">{data.summary.completedTrainings}/{data.summary.totalTrainings}</div>
            <div className="cardLabel">受講済み研修</div>
          </div>
        </div>

        <div className="summaryCard">
          <div className="cardIcon">
            <Clock size={24} color="#9c27b0" />
          </div>
          <div className="cardContent">
            <div className="cardValue">{data.summary.totalHours}時間</div>
            <div className="cardLabel">総研修時間</div>
          </div>
        </div>

        <div className="summaryCard">
          <div className="cardIcon">
            <TrendingUp size={24} color="#4caf50" />
          </div>
          <div className="cardContent">
            <div className="cardValue">+{data.summary.averageScoreImprovement}点</div>
            <div className="cardLabel">平均スコア向上</div>
          </div>
        </div>

        <div className="summaryCard">
          <div className="cardIcon">
            <DollarSign size={24} color="#ff9800" />
          </div>
          <div className="cardContent">
            <div className="cardValue">{data.summary.roi}倍</div>
            <div className="cardLabel">投資対効果(ROI)</div>
          </div>
        </div>
      </div>

      {/* 研修効果一覧 */}
      <div className="trainingImpactSection">
        <div className="sectionHeader">
          <h3>研修別効果分析</h3>
          <div className="filterControls">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="categoryFilter"
            >
              <option value="all">全カテゴリ</option>
              <option value="専門技術">専門技術</option>
              <option value="マネジメント">マネジメント</option>
              <option value="法定研修">法定研修</option>
              <option value="ソフトスキル">ソフトスキル</option>
            </select>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sortFilter"
            >
              <option value="impact">効果順</option>
              <option value="improvement">改善度順</option>
              <option value="date">受講日順</option>
            </select>
          </div>
        </div>

        <div className="trainingList">
          {sortedTrainings.map((training) => {
            const impactLevel = getImpactLevel(training.impactScore)
            return (
              <div key={training.id} className="trainingCard">
                <div className="trainingHeader">
                  <div className="trainingInfo">
                    <h4>{training.name}</h4>
                    <div className="trainingMeta">
                      <span className="category">{training.category}</span>
                      <span className="date">{training.completedDate}</span>
                      <span className="hours">{training.hours}時間</span>
                    </div>
                  </div>
                  <div className="impactIndicator" style={{ color: impactLevel.color }}>
                    <Target size={20} />
                    <span>{impactLevel.text}</span>
                  </div>
                </div>

                <div className="scoreComparison">
                  <div className="scoreItem">
                    <span className="scoreLabel">受講前</span>
                    <span className="scoreValue">{training.evaluationBefore}点</span>
                  </div>
                  <div className="scoreArrow">→</div>
                  <div className="scoreItem">
                    <span className="scoreLabel">受講後</span>
                    <span className="scoreValue">{training.evaluationAfter}点</span>
                  </div>
                  <div className="improvement">
                    <span className="improvementValue">+{training.improvement}点</span>
                    <span className="improvementLabel">向上</span>
                  </div>
                </div>

                <div className="impactBar">
                  <div 
                    className="impactFill"
                    style={{ 
                      width: `${training.impactScore}%`,
                      backgroundColor: impactLevel.color 
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* カテゴリ別分析 */}
      <div className="categoryAnalysisSection">
        <h3>カテゴリ別効果</h3>
        <div className="categoryGrid">
          {data.categoryAnalysis.map((category, index) => (
            <div key={index} className="categoryCard">
              <div className="categoryHeader">
                <h4>{category.category}</h4>
                <span className="trainingCount">{category.trainings}研修</span>
              </div>
              <div className="categoryStats">
                <div className="statItem">
                  <span className="statLabel">平均向上</span>
                  <span className="statValue">+{category.avgImprovement}点</span>
                </div>
                <div className="statItem">
                  <span className="statLabel">貢献度</span>
                  <span className="statValue">{category.contribution}%</span>
                </div>
              </div>
              <div className="contributionBar">
                <div 
                  className="contributionFill"
                  style={{ width: `${category.contribution}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ROI分析 */}
      <div className="roiSection">
        <h3>投資対効果（ROI）分析</h3>
        <div className="roiContent">
          <div className="roiSummary">
            <div className="roiCard main">
              <div className="roiHeader">
                <DollarSign size={32} />
                <h4>総合ROI</h4>
              </div>
              <div className="roiValue">{data.roiAnalysis.roi}倍</div>
              <div className="roiDetail">
                <div className="detailItem">
                  <span className="label">投資額</span>
                  <span className="value">¥{data.roiAnalysis.totalInvestment.toLocaleString()}</span>
                </div>
                <div className="detailItem">
                  <span className="label">効果額</span>
                  <span className="value positive">¥{data.roiAnalysis.totalBenefit.toLocaleString()}</span>
                </div>
                <div className="detailItem">
                  <span className="label">回収期間</span>
                  <span className="value">{data.roiAnalysis.paybackPeriod}ヶ月</span>
                </div>
              </div>
            </div>

            <div className="benefitBreakdown">
              <h4>効果内訳</h4>
              <div className="breakdownList">
                {data.roiAnalysis.breakdown.map((item, index) => (
                  <div key={index} className="breakdownItem">
                    <span className="itemName">{item.item}</span>
                    <div className="itemBar">
                      <div 
                        className="itemFill"
                        style={{ 
                          width: `${(item.value / data.roiAnalysis.totalBenefit) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="itemValue">¥{item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 推奨研修 */}
      <div className="recommendationsSection">
        <h3>推奨研修プログラム</h3>
        <div className="recommendationsList">
          {data.recommendations.map((rec) => (
            <div key={rec.id} className={`recommendationCard priority-${rec.priority}`}>
              <div className="recHeader">
                <div className="recInfo">
                  <h4>{rec.name}</h4>
                  <p className="recReason">{rec.reason}</p>
                </div>
                <div className={`priorityBadge ${rec.priority}`}>
                  {rec.priority === 'high' && '優先度：高'}
                  {rec.priority === 'medium' && '優先度：中'}
                  {rec.priority === 'low' && '優先度：低'}
                </div>
              </div>
              <div className="recDetails">
                <div className="recDetail">
                  <Award size={16} />
                  <span>期待効果: +{rec.expectedImprovement}点</span>
                </div>
                <div className="recDetail">
                  <Clock size={16} />
                  <span>所要時間: {rec.hours}時間</span>
                </div>
              </div>
              <button className="enrollButton">
                受講申込
                <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .trainingEffectAnalysis {
          padding: 20px;
        }

        .analysisHeader {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #e0e0e0;
        }

        .headerContent h2 {
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }

        .description {
          color: #666;
          font-size: 14px;
        }

        .summaryGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .summaryCard {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .cardIcon {
          flex-shrink: 0;
        }

        .cardContent {
          flex: 1;
        }

        .cardValue {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-bottom: 4px;
        }

        .cardLabel {
          font-size: 12px;
          color: #666;
        }

        .trainingImpactSection {
          background: white;
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .sectionHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .sectionHeader h3 {
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }

        .filterControls {
          display: flex;
          gap: 12px;
        }

        .categoryFilter,
        .sortFilter {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          background: white;
          cursor: pointer;
        }

        .trainingList {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .trainingCard {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px;
          background: #fafafa;
        }

        .trainingHeader {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .trainingInfo h4 {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }

        .trainingMeta {
          display: flex;
          gap: 12px;
          font-size: 12px;
          color: #666;
        }

        .category {
          padding: 2px 8px;
          background: #e3f2fd;
          border-radius: 4px;
          color: #1976d2;
        }

        .impactIndicator {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          font-weight: 600;
        }

        .scoreComparison {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px;
          background: white;
          border-radius: 6px;
          margin-bottom: 12px;
        }

        .scoreItem {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .scoreLabel {
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
        }

        .scoreValue {
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }

        .scoreArrow {
          font-size: 20px;
          color: #999;
        }

        .improvement {
          margin-left: auto;
          padding: 8px 16px;
          background: #e8f5e9;
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .improvementValue {
          font-size: 18px;
          font-weight: bold;
          color: #4caf50;
        }

        .improvementLabel {
          font-size: 10px;
          color: #666;
        }

        .impactBar {
          height: 6px;
          background: #e0e0e0;
          border-radius: 3px;
          overflow: hidden;
        }

        .impactFill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .categoryAnalysisSection {
          background: white;
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .categoryAnalysisSection h3 {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 20px;
        }

        .categoryGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .categoryCard {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px;
        }

        .categoryHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .categoryHeader h4 {
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        .trainingCount {
          font-size: 12px;
          color: #666;
          background: #f5f5f5;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .categoryStats {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .statItem {
          display: flex;
          flex-direction: column;
        }

        .statLabel {
          font-size: 11px;
          color: #666;
          margin-bottom: 2px;
        }

        .statValue {
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        .contributionBar {
          height: 4px;
          background: #e0e0e0;
          border-radius: 2px;
          overflow: hidden;
        }

        .contributionFill {
          height: 100%;
          background: linear-gradient(90deg, #4caf50, #8bc34a);
        }

        .roiSection {
          background: white;
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .roiSection h3 {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 20px;
        }

        .roiContent {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        .roiSummary {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .roiCard {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 20px;
        }

        .roiCard.main {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
        }

        .roiHeader {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .roiHeader h4 {
          font-size: 16px;
          font-weight: 600;
        }

        .roiValue {
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 16px;
        }

        .roiDetail {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .detailItem {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-top: 1px solid rgba(255,255,255,0.2);
        }

        .detailItem .label {
          font-size: 14px;
          opacity: 0.9;
        }

        .detailItem .value {
          font-size: 14px;
          font-weight: 600;
        }

        .detailItem .value.positive {
          color: #4caf50;
        }

        .roiCard.main .detailItem .value.positive {
          color: #69f0ae;
        }

        .benefitBreakdown {
          background: #f5f5f5;
          border-radius: 8px;
          padding: 20px;
        }

        .benefitBreakdown h4 {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 16px;
        }

        .breakdownList {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .breakdownItem {
          display: grid;
          grid-template-columns: 120px 1fr 100px;
          align-items: center;
          gap: 12px;
        }

        .itemName {
          font-size: 14px;
          color: #666;
        }

        .itemBar {
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
        }

        .itemFill {
          height: 100%;
          background: linear-gradient(90deg, #ff9800, #ffc107);
        }

        .itemValue {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          text-align: right;
        }

        .recommendationsSection {
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .recommendationsSection h3 {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 20px;
        }

        .recommendationsList {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .recommendationCard {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px;
          background: white;
        }

        .recommendationCard.priority-high {
          border-color: #f44336;
        }

        .recommendationCard.priority-medium {
          border-color: #ff9800;
        }

        .recommendationCard.priority-low {
          border-color: #4caf50;
        }

        .recHeader {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .recInfo h4 {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
        }

        .recReason {
          font-size: 12px;
          color: #666;
        }

        .priorityBadge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
        }

        .priorityBadge.high {
          background: #ffebee;
          color: #c62828;
        }

        .priorityBadge.medium {
          background: #fff3e0;
          color: #e65100;
        }

        .priorityBadge.low {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .recDetails {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .recDetail {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #666;
        }

        .enrollButton {
          width: 100%;
          padding: 10px;
          background: #1976d2;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          transition: background 0.2s;
        }

        .enrollButton:hover {
          background: #1565c0;
        }
      `}</style>
    </div>
  )
}