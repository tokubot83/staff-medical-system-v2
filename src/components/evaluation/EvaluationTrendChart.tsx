import React from 'react'
import dynamic from 'next/dynamic'
import { EvaluationHistory, getGradeColor } from '@/types/evaluation'

const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
  ssr: false,
})

interface EvaluationTrendChartProps {
  history: EvaluationHistory[]
  height?: number
}

export function EvaluationTrendChart({ 
  history, 
  height = 250 
}: EvaluationTrendChartProps) {
  const sortedHistory = [...history].sort((a, b) => 
    new Date(a.period.startDate).getTime() - new Date(b.period.startDate).getTime()
  )

  const labels = sortedHistory.map(h => `${h.period.year} ${h.period.period}`)
  const scores = sortedHistory.map(h => h.totalScore)
  const grades = sortedHistory.map(h => h.grade)

  const data = {
    labels,
    datasets: [{
      label: '総合評価スコア',
      data: scores,
      borderColor: '#4ecdc4',
      backgroundColor: 'rgba(78, 205, 196, 0.1)',
      borderWidth: 2,
      tension: 0.3,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointBackgroundColor: grades.map(grade => getGradeColor(grade)),
      pointBorderColor: '#fff',
      pointBorderWidth: 2
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          afterLabel: (context: any) => {
            const index = context.dataIndex
            return `評価: ${grades[index]}`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1
        },
        grid: {
          color: 'rgba(0,0,0,0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  }

  return (
    <div style={{ height: `${height}px` }}>
      <Line data={data} options={options} />
    </div>
  )
}