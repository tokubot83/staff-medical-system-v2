'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Award,
  TrendingUp,
  Users,
  Building,
  Calendar,
  Target,
  Star
} from 'lucide-react';
import {
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface EvaluationData {
  year: number;
  technicalScore: number;
  facilityContributionScore: number;
  corporateContributionScore: number;
  totalScore: number;
  facilityGrade: string;
  corporateGrade: string;
  finalGrade: string;
  facilityRank?: number;
  facilityTotal?: number;
  corporateRank?: number;
  corporateTotal?: number;
}

interface Props {
  currentYear: EvaluationData;
  history?: EvaluationData[];
  staffName: string;
  department: string;
  jobCategory: string;
}

export function AnnualEvaluationSummary({
  currentYear,
  history = [],
  staffName,
  department,
  jobCategory
}: Props) {
  // 評価マトリックスの位置を取得
  const getMatrixPosition = (facilityGrade: string, corporateGrade: string) => {
    const gradeToNum = { 'S': 5, 'A': 4, 'B': 3, 'C': 2, 'D': 1 };
    return {
      x: gradeToNum[facilityGrade as keyof typeof gradeToNum] || 3,
      y: gradeToNum[corporateGrade as keyof typeof gradeToNum] || 3
    };
  };

  const matrixPos = getMatrixPosition(currentYear.facilityGrade, currentYear.corporateGrade);

  // 施設内評価と法人内評価の計算説明
  // 両評価とも同じ計算式：技術50点 + 施設貢献25点 + 法人貢献25点 = 100点
  // 施設内評価：この100点を施設内の同職種で順位化してS〜Dの5段階
  // 法人内評価：この100点を法人内の同職種で順位化してS〜Dの5段階

  // レーダーチャート用データ
  const radarData = [
    { subject: '技術評価', value: (currentYear.technicalScore / 50) * 100, fullMark: 100 },
    { subject: '施設貢献', value: (currentYear.facilityContributionScore / 25) * 100, fullMark: 100 },
    { subject: '法人貢献', value: (currentYear.corporateContributionScore / 25) * 100, fullMark: 100 },
    { subject: '施設内評価', value: currentYear.facilityGrade === 'S' ? 100 : currentYear.facilityGrade === 'A' ? 80 : currentYear.facilityGrade === 'B' ? 60 : currentYear.facilityGrade === 'C' ? 40 : 20, fullMark: 100 },
    { subject: '法人内評価', value: currentYear.corporateGrade === 'S' ? 100 : currentYear.corporateGrade === 'A' ? 80 : currentYear.corporateGrade === 'B' ? 60 : currentYear.corporateGrade === 'C' ? 40 : 20, fullMark: 100 }
  ];

  // 推移グラフ用データ
  const trendData = [...(history || []), currentYear].map(d => ({
    year: d.year,
    技術: d.technicalScore,
    施設貢献: d.facilityContributionScore,
    法人貢献: d.corporateContributionScore,
    総合: d.totalScore
  }));

  // グレードカラー取得
  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      'S+': '#e91e63',
      'S': '#ff5722',
      'A+': '#ff9800',
      'A': '#ffc107',
      'B': '#4caf50',
      'C': '#2196f3',
      'D': '#9e9e9e'
    };
    return colors[grade] || '#9e9e9e';
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー情報 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{currentYear.year}年度 年間評価結果</CardTitle>
              <p className="text-gray-600 mt-1">{staffName} - {department} - {jobCategory}</p>
            </div>
            <Badge 
              className="text-2xl px-4 py-2"
              style={{ backgroundColor: getGradeColor(currentYear.finalGrade) }}
            >
              {currentYear.finalGrade}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* スコアサマリー */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">技術評価</p>
                <p className="text-2xl font-bold">{currentYear.technicalScore}</p>
                <p className="text-xs text-gray-600">/ 50点</p>
                <Progress value={(currentYear.technicalScore / 50) * 100} className="mt-2 h-2" />
              </div>
              <Award className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">施設貢献</p>
                <p className="text-2xl font-bold">{currentYear.facilityContributionScore}</p>
                <p className="text-xs text-gray-600">/ 25点</p>
                <Progress value={(currentYear.facilityContributionScore / 25) * 100} className="mt-2 h-2" />
              </div>
              <Building className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">法人貢献</p>
                <p className="text-2xl font-bold">{currentYear.corporateContributionScore}</p>
                <p className="text-xs text-gray-600">/ 25点</p>
                <Progress value={(currentYear.corporateContributionScore / 25) * 100} className="mt-2 h-2" />
              </div>
              <Users className="h-8 w-8 text-orange-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">総合スコア</p>
                <p className="text-2xl font-bold text-primary">{currentYear.totalScore}</p>
                <p className="text-xs text-gray-600">/ 100点</p>
                <Progress value={currentYear.totalScore} className="mt-2 h-2" />
              </div>
              <Star className="h-8 w-8 text-yellow-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2軸評価 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              2軸評価マトリックス
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">施設内評価</p>
                  <Badge className="text-lg px-3 py-1" variant="outline">
                    {currentYear.facilityGrade}
                  </Badge>
                  {currentYear.facilityRank && (
                    <p className="text-xs text-gray-600 mt-1">
                      {currentYear.facilityRank}位 / {currentYear.facilityTotal}名
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    施設内同職種での相対評価
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">法人内評価</p>
                  <Badge className="text-lg px-3 py-1" variant="outline">
                    {currentYear.corporateGrade}
                  </Badge>
                  {currentYear.corporateRank && (
                    <p className="text-xs text-gray-600 mt-1">
                      {currentYear.corporateRank}位 / {currentYear.corporateTotal}名
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    法人内同職種での相対評価
                  </p>
                </div>
              </div>

              {/* 評価計算式の説明 */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-gray-700">
                  <strong>評価計算式（施設内・法人内共通）:</strong>
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  技術評価 50点 + 施設貢献 25点 + 法人貢献 25点 = 100点
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  この100点を各評価範囲の同職種内で順位化してS〜Dの5段階評価
                </p>
              </div>

              {/* 簡易マトリックス表示 */}
              <div className="border rounded-lg p-4">
                <div className="grid grid-cols-6 gap-1 text-xs">
                  <div></div>
                  {['S', 'A', 'B', 'C', 'D'].map(g => (
                    <div key={g} className="text-center font-semibold">{g}</div>
                  ))}
                  {['S', 'A', 'B', 'C', 'D'].map((corpG, corpIdx) => (
                    <React.Fragment key={corpG}>
                      <div className="text-center font-semibold">{corpG}</div>
                      {['S', 'A', 'B', 'C', 'D'].map((facG, facIdx) => {
                        const isCurrentPosition = 
                          currentYear.corporateGrade === corpG && 
                          currentYear.facilityGrade === facG;
                        
                        return (
                          <div 
                            key={`${corpG}-${facG}`}
                            className={`border p-2 text-center rounded ${
                              isCurrentPosition ? 
                              'bg-blue-500 text-white font-bold' : 
                              'bg-gray-50'
                            }`}
                          >
                            {isCurrentPosition ? '●' : ''}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
                <p className="text-xs text-gray-600 text-center mt-2">
                  縦軸：法人内 / 横軸：施設内
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* レーダーチャート */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              評価バランス
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar 
                  name={staffName} 
                  dataKey="value" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6} 
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 評価推移グラフ */}
      {trendData.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              評価推移
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="技術" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="施設貢献" stroke="#82ca9d" strokeWidth={2} />
                <Line type="monotone" dataKey="法人貢献" stroke="#ffc658" strokeWidth={2} />
                <Line type="monotone" dataKey="総合" stroke="#ff7c7c" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}