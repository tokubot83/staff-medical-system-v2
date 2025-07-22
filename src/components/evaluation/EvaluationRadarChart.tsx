import React from 'react'
import dynamic from 'next/dynamic'
import { EvaluationScores } from '@/types/evaluation'

const Radar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Radar), {
  ssr: false,
})

interface EvaluationRadarChartProps {
  currentScores: EvaluationScores
  previousScores?: EvaluationScores
  height?: number
}

export function EvaluationRadarChart({ 
  currentScores, 
  previousScores,
  height = 300
}: EvaluationRadarChartProps) {
  const labels = {
    performance: '業務成果',
    skill: '専門スキル',
    teamwork: 'チームワーク',
    leadership: 'リーダーシップ',
    growth: '成長性'
  }

  const datasets = [{
    label: '現在の評価',
    data: Object.keys(currentScores).map(key => currentScores[key as keyof EvaluationScores]),
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    borderColor: '#4ecdc4',
    borderWidth: 2,
    pointBackgroundColor: '#4ecdc4',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: '#4ecdc4'
  }]

  if (previousScores) {
    datasets.push({
      label: '前回の評価',
      data: Object.keys(previousScores).map(key => previousScores[key as keyof EvaluationScores]),
      backgroundColor: 'rgba(149, 165, 166, 0.2)',
      borderColor: '#95a5a6',
      borderWidth: 1,
      pointBackgroundColor: '#95a5a6',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#95a5a6'
    })
  }

  const data = {
    labels: Object.keys(currentScores).map(key => labels[key as keyof EvaluationScores]),
    datasets
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 11
          }
        }
      }
    },
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(0,0,0,0.1)'
        },
        grid: {
          color: 'rgba(0,0,0,0.1)'
        },
        suggestedMin: 0,
        suggestedMax: 5,
        ticks: {
          stepSize: 1,
          font: {
            size: 10
          }
        },
        pointLabels: {
          font: {
            size: 11
          }
        }
      }
    }
  }

  return (
    <div style={{ height: `${height}px` }}>
      <Radar data={data} options={options} />
    </div>
  )
}