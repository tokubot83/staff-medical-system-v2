'use client';

import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Bar, Doughnut, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { JobCategory, TwoAxisEvaluation } from '@/types/hr-strategy';
import { analyzeJobCategoryDistribution } from '@/utils/evaluationPatternAnalyzer';
import { twoAxisColors } from '@/utils/twoAxisChartUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface JobCategoryDistributionProps {
  evaluations: TwoAxisEvaluation[];
  selectedCategory?: JobCategory;
}

export const JobCategoryDistribution: React.FC<JobCategoryDistributionProps> = ({
  evaluations,
  selectedCategory
}) => {
  const jobCategories: JobCategory[] = ['看護師', '介護職', '医師', 'セラピスト', '事務職', 'その他'];

  // カテゴリ別の分析データ
  const categoryAnalysis = useMemo(() => {
    if (selectedCategory) {
      return analyzeJobCategoryDistribution(evaluations, selectedCategory);
    }
    return jobCategories.map(cat => analyzeJobCategoryDistribution(evaluations, cat));
  }, [evaluations, selectedCategory]);

  // 職種別人数グラフデータ
  const categoryCountData = useMemo(() => {
    const analysis = Array.isArray(categoryAnalysis) ? categoryAnalysis : [categoryAnalysis];
    return {
      labels: analysis.map(a => a.jobCategory),
      datasets: [{
        label: '人数',
        data: analysis.map(a => a.totalCount),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(156, 163, 175, 0.8)'
        ]
      }]
    };
  }, [categoryAnalysis]);

  // 評価分布散布図データ
  const scatterData = useMemo(() => {
    if (!selectedCategory) return null;

    const categoryEvals = evaluations.filter(e => e.jobCategory === selectedCategory);
    const gradeToNum = (grade: string) => {
      const map: Record<string, number> = { 'S': 5, 'A': 4, 'B': 3, 'C': 2, 'D': 1 };
      return map[grade] || 3;
    };

    return {
      datasets: [{
        label: selectedCategory,
        data: categoryEvals.map(e => ({
          x: gradeToNum(e.facilityEval),
          y: gradeToNum(e.corporateEval),
          name: e.employeeName
        })),
        backgroundColor: twoAxisColors.combined.main,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    };
  }, [evaluations, selectedCategory]);

  // パターン分布データ
  const patternDistributionData = useMemo(() => {
    if (!selectedCategory || Array.isArray(categoryAnalysis)) return null;

    return {
      labels: categoryAnalysis.dominantPatterns.map(p => p.pattern),
      datasets: [{
        data: categoryAnalysis.dominantPatterns.map(p => p.percentage),
        backgroundColor: [
          'rgba(139, 92, 246, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ]
      }]
    };
  }, [categoryAnalysis, selectedCategory]);

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: '職種別人数分布'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '人数'
        }
      }
    }
  };

  const scatterOptions: ChartOptions<'scatter'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        min: 0.5,
        max: 5.5,
        title: {
          display: true,
          text: '施設内評価'
        },
        ticks: {
          callback: function(value) {
            const labels = ['', 'D', 'C', 'B', 'A', 'S', ''];
            return labels[value as number] || '';
          }
        }
      },
      y: {
        min: 0.5,
        max: 5.5,
        title: {
          display: true,
          text: '法人内評価'
        },
        ticks: {
          callback: function(value) {
            const labels = ['', 'D', 'C', 'B', 'A', 'S', ''];
            return labels[value as number] || '';
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            const data = context.raw as any;
            return data.name || '';
          }
        }
      }
    }
  };

  const doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right'
      },
      title: {
        display: true,
        text: '評価パターン分布'
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 職種別人数分布 */}
      <Card className="p-6">
        <div className="h-64">
          <Bar data={categoryCountData} options={barOptions} />
        </div>
      </Card>

      {/* 選択された職種の詳細分析 */}
      {selectedCategory && (
        <>
          {/* 評価分布散布図 */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">{selectedCategory}の評価分布</h3>
            <div className="h-64">
              {scatterData && <Scatter data={scatterData} options={scatterOptions} />}
            </div>
          </Card>

          {/* パターン分布 */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">{selectedCategory}の評価パターン分布</h3>
            <div className="h-64">
              {patternDistributionData && <Doughnut data={patternDistributionData} options={doughnutOptions} />}
            </div>
          </Card>

          {/* 推奨事項 */}
          {!Array.isArray(categoryAnalysis) && categoryAnalysis.recommendations && (
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">{selectedCategory}向け推奨事項</h3>
              <ul className="space-y-2">
                {categoryAnalysis.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </>
      )}
    </div>
  );
};