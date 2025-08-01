// 2軸評価システム対応のグラフユーティリティ関数

export const twoAxisColors = {
  facility: {
    main: '#3B82F6', // 青
    light: '#93C5FD',
    dark: '#1E40AF'
  },
  corporate: {
    main: '#10B981', // 緑
    light: '#86EFAC',
    dark: '#047857'
  },
  combined: {
    main: '#8B5CF6', // 紫
    light: '#C4B5FD',
    dark: '#6D28D9'
  }
}

// 2軸評価データの基本構造
export interface TwoAxisData {
  facilityScore: number
  corporateScore: number
  overallScore?: string
  label?: string
}

// 散布図の背景ゾーン定義
export const scatterZones = [
  { x: [80, 100], y: [80, 100], color: 'rgba(16, 185, 129, 0.1)', label: 'S+' },
  { x: [60, 80], y: [80, 100], color: 'rgba(16, 185, 129, 0.08)', label: 'S' },
  { x: [80, 100], y: [60, 80], color: 'rgba(16, 185, 129, 0.08)', label: 'S' },
  { x: [60, 80], y: [60, 80], color: 'rgba(59, 130, 246, 0.1)', label: 'A+' },
  { x: [40, 60], y: [60, 80], color: 'rgba(59, 130, 246, 0.08)', label: 'A' },
  { x: [60, 80], y: [40, 60], color: 'rgba(59, 130, 246, 0.08)', label: 'A' },
  { x: [40, 60], y: [40, 60], color: 'rgba(251, 146, 60, 0.1)', label: 'B+' },
  { x: [20, 40], y: [40, 60], color: 'rgba(251, 146, 60, 0.08)', label: 'B' },
  { x: [40, 60], y: [20, 40], color: 'rgba(251, 146, 60, 0.08)', label: 'B' },
  { x: [0, 40], y: [0, 40], color: 'rgba(239, 68, 68, 0.1)', label: 'C' }
]

// 共通のグラフオプション設定
export const getTwoAxisChartOptions = (type: 'line' | 'bar' | 'scatter' | 'radar' | 'doughnut'): any => {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          afterLabel: (context: any) => {
            if (context.raw?.overallScore) {
              return `総合評価: ${context.raw.overallScore}`
            }
            return ''
          }
        }
      }
    }
  }

  switch (type) {
    case 'line':
    case 'bar':
      return {
        ...baseOptions,
        scales: {
          y: {
            type: 'linear' as const,
            display: true,
            position: 'left' as const,
            title: {
              display: true,
              text: '施設評価',
              color: twoAxisColors.facility.main
            },
            ticks: {
              color: twoAxisColors.facility.main
            },
            grid: {
              color: 'rgba(59, 130, 246, 0.1)'
            }
          },
          y1: {
            type: 'linear' as const,
            display: true,
            position: 'right' as const,
            title: {
              display: true,
              text: '法人評価',
              color: twoAxisColors.corporate.main
            },
            ticks: {
              color: twoAxisColors.corporate.main
            },
            grid: {
              drawOnChartArea: false,
              color: 'rgba(16, 185, 129, 0.1)'
            }
          }
        }
      }

    case 'scatter':
      return {
        ...baseOptions,
        scales: {
          x: {
            type: 'linear' as const,
            position: 'bottom' as const,
            title: {
              display: true,
              text: '施設評価',
              color: twoAxisColors.facility.main
            },
            min: 0,
            max: 100
          },
          y: {
            type: 'linear' as const,
            position: 'left' as const,
            title: {
              display: true,
              text: '法人評価',
              color: twoAxisColors.corporate.main
            },
            min: 0,
            max: 100
          }
        },
        plugins: {
          ...baseOptions.plugins,
          annotation: {
            annotations: scatterZones.map((zone, index) => ({
              type: 'box' as const,
              xMin: zone.x[0],
              xMax: zone.x[1],
              yMin: zone.y[0],
              yMax: zone.y[1],
              backgroundColor: zone.color,
              borderColor: 'transparent',
              label: {
                display: true,
                content: zone.label,
                position: 'center' as const
              }
            }))
          }
        }
      }

    case 'radar':
      return {
        ...baseOptions,
        scales: {
          r: {
            type: 'radialLinear' as const,
            angleLines: {
              display: true
            },
            suggestedMin: 0,
            suggestedMax: 100
          }
        }
      }

    case 'doughnut':
      return {
        ...baseOptions,
        plugins: {
          ...baseOptions.plugins,
          legend: {
            ...baseOptions.plugins.legend,
            position: 'bottom' as const
          }
        }
      }

    default:
      return baseOptions
  }
}

// 単一評価データを2軸評価データに変換
export const convertToTwoAxisData = (
  data: any[],
  facilityKey: string = 'value',
  corporateKey: string = 'value',
  facilityMultiplier: number = 1,
  corporateMultiplier: number = 0.9
): TwoAxisData[] => {
  return data.map(item => ({
    facilityScore: item[facilityKey] * facilityMultiplier,
    corporateScore: item[corporateKey] * corporateMultiplier,
    label: item.label || item.name || ''
  }))
}

// 評価スコアから総合評価を計算
export const calculateOverallGrade = (facilityScore: number, corporateScore: number): string => {
  const avg = (facilityScore + corporateScore) / 2
  
  if (facilityScore >= 80 && corporateScore >= 80) return 'S+'
  if (avg >= 80) return 'S'
  if (avg >= 70) return 'A+'
  if (avg >= 60) return 'A'
  if (avg >= 50) return 'B+'
  if (avg >= 40) return 'B'
  if (avg >= 20) return 'C+'
  return 'C'
}