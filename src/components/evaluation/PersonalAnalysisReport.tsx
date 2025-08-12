'use client'

import React, { useState } from 'react'
import { 
  User, 
  Target, 
  TrendingUp, 
  Award, 
  AlertCircle,
  ChevronRight,
  Download,
  Calendar,
  Users
} from 'lucide-react'

// モックデータ（実際の実装時はAPIから取得）
const mockPersonalData = {
  employee: {
    name: '山田 太郎',
    department: '看護部',
    position: '主任看護師',
    employeeId: 'NS-2024-001'
  },
  currentEvaluation: {
    totalScore: 82.5,
    technicalScore: 42.5,
    contributionScore: 40,
    percentile: 85,
    grade: 'A',
    rankInFacility: 45,
    totalInFacility: 450,
    rankInDepartment: 8,
    totalInDepartment: 65
  },
  evaluationHistory: [
    { year: 2021, score: 75, grade: 'B' },
    { year: 2022, score: 78.5, grade: 'B' },
    { year: 2023, score: 82.5, grade: 'A' }
  ],
  strengths: [
    '患者対応力',
    'チーム協調性',
    '緊急対応能力'
  ],
  weaknesses: [
    '文書作成',
    '新技術習得',
    'プレゼンテーション'
  ],
  peerComparison: {
    averageScore: 76.5,
    difference: 6,
    samePositionAverage: 78.2,
    sameExperienceAverage: 77.8
  }
}

export default function PersonalAnalysisReport() {
  const [selectedYear, setSelectedYear] = useState(2023)
  const data = mockPersonalData

  // パーセンタイルから評価テキストを生成
  const getPercentileText = (percentile: number) => {
    if (percentile >= 90) return '優秀'
    if (percentile >= 70) return '良好'
    if (percentile >= 50) return '標準'
    if (percentile >= 30) return '要改善'
    return '要支援'
  }

  // 成長率を計算
  const calculateGrowthRate = () => {
    const history = data.evaluationHistory
    if (history.length < 2) return 0
    const latest = history[history.length - 1].score
    const previous = history[history.length - 2].score
    return ((latest - previous) / previous * 100).toFixed(1)
  }

  return (
    <div className="personalAnalysisReport">
      {/* ヘッダー */}
      <div className="reportHeader">
        <div className="headerContent">
          <h2>個人分析レポート</h2>
          <p className="description">
            あなたの評価データを詳細に分析し、強み・改善点を可視化します
          </p>
        </div>
        <button className="exportButton">
          <Download size={20} />
          レポート出力
        </button>
      </div>

      {/* 基本情報カード */}
      <div className="employeeCard">
        <div className="cardHeader">
          <User size={24} />
          <h3>職員情報</h3>
        </div>
        <div className="employeeInfo">
          <div className="infoItem">
            <span className="label">氏名</span>
            <span className="value">{data.employee.name}</span>
          </div>
          <div className="infoItem">
            <span className="label">所属</span>
            <span className="value">{data.employee.department}</span>
          </div>
          <div className="infoItem">
            <span className="label">役職</span>
            <span className="value">{data.employee.position}</span>
          </div>
          <div className="infoItem">
            <span className="label">職員番号</span>
            <span className="value">{data.employee.employeeId}</span>
          </div>
        </div>
      </div>

      {/* 現在の評価サマリー */}
      <div className="evaluationSummary">
        <h3>2023年度 評価結果</h3>
        <div className="summaryGrid">
          <div className="summaryCard primary">
            <div className="cardIcon">
              <Award size={32} />
            </div>
            <div className="cardContent">
              <div className="scoreValue">{data.currentEvaluation.totalScore}点</div>
              <div className="scoreLabel">総合評価</div>
              <div className="gradeIndicator grade-{data.currentEvaluation.grade.toLowerCase()}">
                {data.currentEvaluation.grade}グレード
              </div>
            </div>
          </div>

          <div className="summaryCard">
            <div className="cardIcon">
              <Target size={24} />
            </div>
            <div className="cardContent">
              <div className="scoreValue">{data.currentEvaluation.technicalScore}点</div>
              <div className="scoreLabel">技術評価</div>
              <div className="scoreMax">/ 50点</div>
            </div>
          </div>

          <div className="summaryCard">
            <div className="cardIcon">
              <Users size={24} />
            </div>
            <div className="cardContent">
              <div className="scoreValue">{data.currentEvaluation.contributionScore}点</div>
              <div className="scoreLabel">貢献度評価</div>
              <div className="scoreMax">/ 50点</div>
            </div>
          </div>
        </div>
      </div>

      {/* 相対位置表示 */}
      <div className="relativePosition">
        <h3>施設内での位置づけ</h3>
        <div className="positionGrid">
          <div className="positionCard">
            <div className="percentileDisplay">
              <div className="percentileValue">上位{100 - data.currentEvaluation.percentile}%</div>
              <div className="percentileLabel">パーセンタイル</div>
            </div>
            <div className="percentileBar">
              <div 
                className="percentileFill"
                style={{ width: `${data.currentEvaluation.percentile}%` }}
              />
            </div>
            <div className="percentileText">
              評価: {getPercentileText(data.currentEvaluation.percentile)}
            </div>
          </div>

          <div className="rankingCard">
            <h4>順位情報</h4>
            <div className="rankingItem">
              <span className="rankLabel">施設内順位</span>
              <span className="rankValue">
                {data.currentEvaluation.rankInFacility}位 / {data.currentEvaluation.totalInFacility}名
              </span>
            </div>
            <div className="rankingItem">
              <span className="rankLabel">部門内順位</span>
              <span className="rankValue">
                {data.currentEvaluation.rankInDepartment}位 / {data.currentEvaluation.totalInDepartment}名
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 強み・弱み分析 */}
      <div className="strengthWeaknessAnalysis">
        <h3>強み・改善点分析</h3>
        <div className="analysisGrid">
          <div className="strengthCard">
            <div className="cardHeader success">
              <TrendingUp size={20} />
              <h4>強み（上位3項目）</h4>
            </div>
            <ul className="itemList">
              {data.strengths.map((item, index) => (
                <li key={index} className="strengthItem">
                  <span className="itemNumber">{index + 1}</span>
                  <span className="itemText">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="weaknessCard">
            <div className="cardHeader warning">
              <AlertCircle size={20} />
              <h4>改善推奨項目</h4>
            </div>
            <ul className="itemList">
              {data.weaknesses.map((item, index) => (
                <li key={index} className="weaknessItem">
                  <span className="itemNumber">{index + 1}</span>
                  <span className="itemText">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 成長トレンド */}
      <div className="growthTrend">
        <h3>評価推移（3年間）</h3>
        <div className="trendContent">
          <div className="trendChart">
            <div className="chartContainer">
              {/* 簡易的な棒グラフ */}
              <div className="barChart">
                {data.evaluationHistory.map((item, index) => (
                  <div key={index} className="barItem">
                    <div className="barContainer">
                      <div 
                        className="bar"
                        style={{ height: `${item.score}%` }}
                      >
                        <span className="barValue">{item.score}</span>
                      </div>
                    </div>
                    <div className="barLabel">{item.year}年</div>
                    <div className="barGrade">{item.grade}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="trendSummary">
            <div className="summaryItem">
              <span className="summaryLabel">成長率</span>
              <span className="summaryValue positive">+{calculateGrowthRate()}%</span>
            </div>
            <div className="summaryItem">
              <span className="summaryLabel">評価トレンド</span>
              <span className="summaryValue">上昇傾向</span>
            </div>
          </div>
        </div>
      </div>

      {/* 同職種・同年代との比較 */}
      <div className="peerComparison">
        <h3>比較分析</h3>
        <div className="comparisonGrid">
          <div className="comparisonItem">
            <div className="comparisonHeader">
              <span className="comparisonLabel">施設平均との差</span>
              <span className="comparisonValue positive">
                +{data.peerComparison.difference}点
              </span>
            </div>
            <div className="comparisonBar">
              <div className="barBackground">
                <div className="averageMark" style={{ left: '50%' }}>
                  <span className="markLabel">平均</span>
                </div>
                <div className="yourMark" style={{ left: '65%' }}>
                  <span className="markLabel">あなた</span>
                </div>
              </div>
            </div>
          </div>

          <div className="comparisonDetails">
            <div className="detailItem">
              <span className="detailLabel">同職種平均</span>
              <span className="detailValue">{data.peerComparison.samePositionAverage}点</span>
            </div>
            <div className="detailItem">
              <span className="detailLabel">同年代平均</span>
              <span className="detailValue">{data.peerComparison.sameExperienceAverage}点</span>
            </div>
          </div>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="reportActions">
        <button className="actionButton primary">
          詳細レポートを見る
          <ChevronRight size={20} />
        </button>
        <button className="actionButton secondary">
          研修プランを確認
          <ChevronRight size={20} />
        </button>
      </div>

      <style jsx>{`
        .personalAnalysisReport {
          padding: 20px;
        }

        .reportHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
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

        .exportButton {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #1976d2;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s;
        }

        .exportButton:hover {
          background: #1565c0;
        }

        .employeeCard {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .cardHeader {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          color: #333;
        }

        .cardHeader h3 {
          font-size: 18px;
          font-weight: 600;
        }

        .employeeInfo {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .infoItem {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .infoItem .label {
          font-size: 12px;
          color: #666;
        }

        .infoItem .value {
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }

        .evaluationSummary {
          margin-bottom: 24px;
        }

        .evaluationSummary h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #333;
        }

        .summaryGrid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 16px;
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

        .summaryCard.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .cardIcon {
          flex-shrink: 0;
        }

        .summaryCard.primary .cardIcon {
          color: white;
        }

        .cardContent {
          flex: 1;
        }

        .scoreValue {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 4px;
        }

        .scoreLabel {
          font-size: 14px;
          opacity: 0.9;
        }

        .scoreMax {
          font-size: 12px;
          opacity: 0.7;
          margin-top: 4px;
        }

        .gradeIndicator {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          background: rgba(255,255,255,0.3);
          font-size: 14px;
          font-weight: 500;
          margin-top: 8px;
        }

        .relativePosition {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .relativePosition h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #333;
        }

        .positionGrid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        .positionCard {
          padding: 16px;
          background: #f5f5f5;
          border-radius: 8px;
        }

        .percentileDisplay {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 12px;
        }

        .percentileValue {
          font-size: 24px;
          font-weight: bold;
          color: #1976d2;
        }

        .percentileLabel {
          font-size: 14px;
          color: #666;
        }

        .percentileBar {
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .percentileFill {
          height: 100%;
          background: linear-gradient(90deg, #4caf50, #1976d2);
          transition: width 0.3s ease;
        }

        .percentileText {
          font-size: 14px;
          color: #666;
          text-align: center;
        }

        .rankingCard {
          padding: 16px;
          background: #f5f5f5;
          border-radius: 8px;
        }

        .rankingCard h4 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #333;
        }

        .rankingItem {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e0e0e0;
        }

        .rankingItem:last-child {
          border-bottom: none;
        }

        .rankLabel {
          font-size: 14px;
          color: #666;
        }

        .rankValue {
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }

        .strengthWeaknessAnalysis {
          margin-bottom: 24px;
        }

        .strengthWeaknessAnalysis h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #333;
        }

        .analysisGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .strengthCard,
        .weaknessCard {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .strengthCard .cardHeader {
          background: #e8f5e9;
          color: #2e7d32;
          padding: 12px 16px;
          margin-bottom: 0;
        }

        .weaknessCard .cardHeader {
          background: #fff3e0;
          color: #e65100;
          padding: 12px 16px;
          margin-bottom: 0;
        }

        .cardHeader h4 {
          font-size: 16px;
          font-weight: 600;
        }

        .itemList {
          padding: 16px;
          list-style: none;
        }

        .strengthItem,
        .weaknessItem {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
        }

        .itemNumber {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
        }

        .strengthItem .itemNumber {
          background: #c8e6c9;
          color: #2e7d32;
        }

        .weaknessItem .itemNumber {
          background: #ffe0b2;
          color: #e65100;
        }

        .itemText {
          flex: 1;
          font-size: 14px;
          color: #333;
        }

        .growthTrend {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .growthTrend h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #333;
        }

        .trendContent {
          display: flex;
          gap: 24px;
        }

        .trendChart {
          flex: 1;
        }

        .chartContainer {
          padding: 20px;
          background: #f5f5f5;
          border-radius: 8px;
        }

        .barChart {
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          height: 200px;
        }

        .barItem {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .barContainer {
          width: 60px;
          height: 150px;
          display: flex;
          align-items: flex-end;
        }

        .bar {
          width: 100%;
          background: linear-gradient(180deg, #1976d2, #42a5f5);
          border-radius: 4px 4px 0 0;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 8px;
          transition: height 0.3s ease;
        }

        .barValue {
          color: white;
          font-size: 12px;
          font-weight: 600;
        }

        .barLabel {
          font-size: 14px;
          color: #666;
        }

        .barGrade {
          font-size: 12px;
          font-weight: 600;
          color: #1976d2;
        }

        .trendSummary {
          width: 200px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 16px;
          background: #f5f5f5;
          border-radius: 8px;
        }

        .summaryItem {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .summaryLabel {
          font-size: 12px;
          color: #666;
        }

        .summaryValue {
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }

        .summaryValue.positive {
          color: #4caf50;
        }

        .peerComparison {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .peerComparison h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #333;
        }

        .comparisonGrid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        .comparisonItem {
          padding: 16px;
          background: #f5f5f5;
          border-radius: 8px;
        }

        .comparisonHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .comparisonLabel {
          font-size: 14px;
          color: #666;
        }

        .comparisonValue {
          font-size: 20px;
          font-weight: 600;
        }

        .comparisonValue.positive {
          color: #4caf50;
        }

        .comparisonBar {
          position: relative;
          height: 40px;
        }

        .barBackground {
          position: relative;
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          margin-top: 16px;
        }

        .averageMark,
        .yourMark {
          position: absolute;
          top: -20px;
          transform: translateX(-50%);
        }

        .markLabel {
          font-size: 12px;
          color: #666;
          white-space: nowrap;
        }

        .yourMark .markLabel {
          color: #1976d2;
          font-weight: 600;
        }

        .comparisonDetails {
          padding: 16px;
          background: #f5f5f5;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .detailItem {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #e0e0e0;
        }

        .detailItem:last-child {
          border-bottom: none;
        }

        .detailLabel {
          font-size: 14px;
          color: #666;
        }

        .detailValue {
          font-size: 16px;
          font-weight: 500;
          color: #333;
        }

        .reportActions {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-top: 32px;
        }

        .actionButton {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .actionButton.primary {
          background: #1976d2;
          color: white;
        }

        .actionButton.primary:hover {
          background: #1565c0;
        }

        .actionButton.secondary {
          background: white;
          color: #1976d2;
          border: 2px solid #1976d2;
        }

        .actionButton.secondary:hover {
          background: #e3f2fd;
        }
      `}</style>
    </div>
  )
}