'use client'

import React from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
  // Rechartsのレーダーチャート用にデータを変換
  const radarData = data.categories.map((category, index) => {
    const dataPoint: any = { category };
    data.data.forEach((item) => {
      dataPoint[item.name] = item.values[index];
    });
    return dataPoint;
  });

  // 強み・弱みを分析
  const analyzeStrengthsWeaknesses = () => {
    if (!data.data[0]) return { strengths: [], weaknesses: [] }
    
    const scores = data.data[0].values.map((value, index) => ({
      category: data.categories[index],
      score: value
    }))

    const sorted = [...scores].sort((a, b) => b.score - a.score)
    const strengths = sorted.slice(0, 3)
    const weaknesses = sorted.slice(-3).reverse()

    return { strengths, weaknesses }
  }

  const analysis = analyzeStrengthsWeaknesses()

  // カスタムツールチップ
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm">{entry.name}</span>
              </div>
              <span className="font-bold" style={{ color: entry.color }}>
                {entry.value}点
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎯 スキル評価レーダーチャート
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* レーダーチャート */}
            <div className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]}
                    tick={false}
                  />
                  {data.data.map((item, index) => (
                    <Radar
                      key={item.name}
                      name={item.name}
                      dataKey={item.name}
                      stroke={item.color}
                      fill={item.color}
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  ))}
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* 分析結果 */}
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-3">
                  🌟 強み（上位3項目）
                </h3>
                {analysis.strengths.map((item, index) => (
                  <div key={index} className="flex items-center justify-between mb-2">
                    <span className="text-green-700">{item.category}</span>
                    <Badge className="bg-green-100 text-green-800">
                      {item.score}点
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-800 mb-3">
                  💪 改善領域（下位3項目）
                </h3>
                {analysis.weaknesses.map((item, index) => (
                  <div key={index} className="flex items-center justify-between mb-2">
                    <span className="text-orange-700">{item.category}</span>
                    <Badge className="bg-orange-100 text-orange-800">
                      {item.score}点
                    </Badge>
                  </div>
                ))}
              </div>

              {/* 全体平均との比較 */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  📊 部門平均との比較
                </h3>
                {data.data[0] && data.data[1] && (
                  <div className="text-sm text-blue-700">
                    <div className="mb-2">
                      あなたの平均: <span className="font-bold">
                        {(data.data[0].values.reduce((a, b) => a + b, 0) / data.data[0].values.length).toFixed(1)}点
                      </span>
                    </div>
                    <div className="mb-2">
                      部門平均: <span className="font-bold">
                        {(data.data[1].values.reduce((a, b) => a + b, 0) / data.data[1].values.length).toFixed(1)}点
                      </span>
                    </div>
                    <div className="text-lg font-bold">
                      差分: <span className={
                        (data.data[0].values.reduce((a, b) => a + b, 0) / data.data[0].values.length) > 
                        (data.data[1].values.reduce((a, b) => a + b, 0) / data.data[1].values.length) 
                          ? 'text-green-600' : 'text-orange-600'
                      }>
                        {((data.data[0].values.reduce((a, b) => a + b, 0) / data.data[0].values.length) - 
                          (data.data[1].values.reduce((a, b) => a + b, 0) / data.data[1].values.length)).toFixed(1)}点
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}