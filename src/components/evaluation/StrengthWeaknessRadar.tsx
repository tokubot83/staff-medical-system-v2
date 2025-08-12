'use client'

import React, { useEffect, useRef } from 'react'

interface RadarData {
  categories: string[]
  data: {
    name: string
    values: number[]
    color: string
  }[]
}

interface StrengthWeaknessRadarProps {
  data?: RadarData
}

// デフォルトのモックデータ
const defaultData: RadarData = {
  categories: [
    '専門知識',
    '実務スキル',
    'コミュニケーション',
    'リーダーシップ',
    '問題解決力',
    '協調性',
    '革新性',
    '責任感'
  ],
  data: [
    {
      name: 'あなたの評価',
      values: [85, 90, 75, 60, 80, 95, 55, 88],
      color: '#1976d2'
    },
    {
      name: '部門平均',
      values: [70, 75, 80, 65, 70, 85, 60, 80],
      color: '#ff9800'
    }
  ]
}

export default function StrengthWeaknessRadar({ data = defaultData }: StrengthWeaknessRadarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Canvas設定
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) * 0.35

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // レーダーチャートの背景を描画
    const levels = 5
    const angleStep = (Math.PI * 2) / data.categories.length

    // グリッド線を描画
    for (let level = 1; level <= levels; level++) {
      ctx.beginPath()
      ctx.strokeStyle = '#e0e0e0'
      ctx.lineWidth = 1

      for (let i = 0; i <= data.categories.length; i++) {
        const angle = angleStep * i - Math.PI / 2
        const x = centerX + Math.cos(angle) * radius * (level / levels)
        const y = centerY + Math.sin(angle) * radius * (level / levels)

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()
    }

    // 軸線を描画
    for (let i = 0; i < data.categories.length; i++) {
      const angle = angleStep * i - Math.PI / 2
      ctx.beginPath()
      ctx.strokeStyle = '#e0e0e0'
      ctx.lineWidth = 1
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(
        centerX + Math.cos(angle) * radius,
        centerY + Math.sin(angle) * radius
      )
      ctx.stroke()
    }

    // カテゴリラベルを描画
    ctx.font = '12px sans-serif'
    ctx.fillStyle = '#666'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    for (let i = 0; i < data.categories.length; i++) {
      const angle = angleStep * i - Math.PI / 2
      const labelRadius = radius + 25
      const x = centerX + Math.cos(angle) * labelRadius
      const y = centerY + Math.sin(angle) * labelRadius
      
      // ラベルの位置を調整
      if (Math.abs(x - centerX) < 10) {
        ctx.textAlign = 'center'
      } else if (x > centerX) {
        ctx.textAlign = 'left'
      } else {
        ctx.textAlign = 'right'
      }

      ctx.fillText(data.categories[i], x, y)
    }

    // データをプロット
    data.data.forEach((dataset, dataIndex) => {
      ctx.beginPath()
      ctx.strokeStyle = dataset.color
      ctx.fillStyle = dataset.color + '40' // 透明度を追加
      ctx.lineWidth = 2

      for (let i = 0; i <= data.categories.length; i++) {
        const index = i % data.categories.length
        const angle = angleStep * index - Math.PI / 2
        const value = dataset.values[index] / 100 // 100点満点として正規化
        const x = centerX + Math.cos(angle) * radius * value
        const y = centerY + Math.sin(angle) * radius * value

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.fill()
      ctx.stroke()

      // データポイントを描画
      for (let i = 0; i < data.categories.length; i++) {
        const angle = angleStep * i - Math.PI / 2
        const value = dataset.values[i] / 100
        const x = centerX + Math.cos(angle) * radius * value
        const y = centerY + Math.sin(angle) * radius * value

        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = dataset.color
        ctx.fill()
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 2
        ctx.stroke()
      }
    })

    // スケールラベルを描画
    ctx.font = '10px sans-serif'
    ctx.fillStyle = '#999'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'

    for (let level = 1; level <= levels; level++) {
      const value = (level * 20).toString()
      const y = centerY - radius * (level / levels)
      ctx.fillText(value, centerX - 5, y)
    }

  }, [data])

  // 強み・弱みを分析
  const analyzeStrengthsWeaknesses = () => {
    if (!data.data[0]) return { strengths: [], weaknesses: [] }
    
    const scores = data.data[0].values.map((value, index) => ({
      category: data.categories[index],
      score: value
    }))

    const sorted = [...scores].sort((a, b) => b.score - a.score)
    
    return {
      strengths: sorted.slice(0, 3),
      weaknesses: sorted.slice(-3).reverse()
    }
  }

  const { strengths, weaknesses } = analyzeStrengthsWeaknesses()

  return (
    <div className="radarChartContainer">
      <div className="chartWrapper">
        <canvas 
          ref={canvasRef}
          width={400}
          height={400}
          className="radarCanvas"
        />
        
        {/* 凡例 */}
        <div className="legend">
          {data.data.map((dataset, index) => (
            <div key={index} className="legendItem">
              <div 
                className="legendColor"
                style={{ backgroundColor: dataset.color }}
              />
              <span className="legendLabel">{dataset.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 分析結果 */}
      <div className="analysisPanel">
        <div className="strengthsSection">
          <h4>
            <span className="sectionIcon">💪</span>
            強み TOP3
          </h4>
          <ul className="analysisList">
            {strengths.map((item, index) => (
              <li key={index} className="analysisItem strength">
                <span className="rank">{index + 1}</span>
                <span className="category">{item.category}</span>
                <span className="score">{item.score}点</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="weaknessesSection">
          <h4>
            <span className="sectionIcon">📈</span>
            改善推奨項目
          </h4>
          <ul className="analysisList">
            {weaknesses.map((item, index) => (
              <li key={index} className="analysisItem weakness">
                <span className="rank">{index + 1}</span>
                <span className="category">{item.category}</span>
                <span className="score">{item.score}点</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style jsx>{`
        .radarChartContainer {
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .chartWrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 24px;
        }

        .radarCanvas {
          max-width: 100%;
          height: auto;
        }

        .legend {
          display: flex;
          gap: 24px;
          margin-top: 16px;
        }

        .legendItem {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .legendColor {
          width: 16px;
          height: 16px;
          border-radius: 2px;
        }

        .legendLabel {
          font-size: 14px;
          color: #666;
        }

        .analysisPanel {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          padding-top: 24px;
          border-top: 1px solid #e0e0e0;
        }

        .strengthsSection,
        .weaknessesSection {
          background: #f5f5f5;
          border-radius: 8px;
          padding: 16px;
        }

        .strengthsSection h4,
        .weaknessesSection h4 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 12px;
        }

        .sectionIcon {
          font-size: 20px;
        }

        .analysisList {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .analysisItem {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          margin-bottom: 8px;
          background: white;
          border-radius: 6px;
        }

        .analysisItem:last-child {
          margin-bottom: 0;
        }

        .rank {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
        }

        .strength .rank {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .weakness .rank {
          background: #fff3e0;
          color: #e65100;
        }

        .category {
          flex: 1;
          font-size: 14px;
          color: #333;
        }

        .score {
          font-size: 14px;
          font-weight: 600;
        }

        .strength .score {
          color: #2e7d32;
        }

        .weakness .score {
          color: #e65100;
        }
      `}</style>
    </div>
  )
}