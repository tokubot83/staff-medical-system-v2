'use client';

import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EvaluationGrade, TwoAxisEvaluation } from '@/types/hr-strategy';
import { scatterZones } from '@/utils/twoAxisChartUtils';

interface TwoAxisMatrixViewProps {
  evaluations: TwoAxisEvaluation[];
  selectedJobCategory?: string;
  onEmployeeSelect?: (employee: TwoAxisEvaluation) => void;
}

export const TwoAxisMatrixView: React.FC<TwoAxisMatrixViewProps> = ({
  evaluations,
  selectedJobCategory,
  onEmployeeSelect
}) => {
  const grades: EvaluationGrade[] = ['S', 'A', 'B', 'C', 'D'];
  
  // フィルタリング
  const filteredEvaluations = useMemo(() => {
    if (!selectedJobCategory || selectedJobCategory === 'all') {
      return evaluations;
    }
    return evaluations.filter(e => e.jobCategory === selectedJobCategory);
  }, [evaluations, selectedJobCategory]);

  // マトリックスデータの作成
  const matrixData = useMemo(() => {
    const matrix: Record<string, TwoAxisEvaluation[]> = {};
    
    grades.forEach(corporate => {
      grades.forEach(facility => {
        const key = `${corporate}-${facility}`;
        matrix[key] = filteredEvaluations.filter(
          e => e.corporateEval === corporate && e.facilityEval === facility
        );
      });
    });
    
    return matrix;
  }, [filteredEvaluations]);

  // 総合評価のマッピング
  const getFinalGrade = (corporate: EvaluationGrade, facility: EvaluationGrade): string => {
    const mapping: Record<string, string> = {
      'S-S': 'S+', 'S-A': 'S', 'S-B': 'A+', 'S-C': 'A', 'S-D': 'A',
      'A-S': 'S', 'A-A': 'A+', 'A-B': 'A', 'A-C': 'A', 'A-D': 'B',
      'B-S': 'A+', 'B-A': 'A', 'B-B': 'B', 'B-C': 'B', 'B-D': 'C',
      'C-S': 'A', 'C-A': 'A', 'C-B': 'B', 'C-C': 'C', 'C-D': 'D',
      'D-S': 'B', 'D-A': 'B', 'D-B': 'C', 'D-C': 'C', 'D-D': 'D'
    };
    return mapping[`${corporate}-${facility}`] || 'B';
  };

  // セルの背景色を取得
  const getCellColor = (finalGrade: string): string => {
    const colorMap: Record<string, string> = {
      'S+': 'bg-yellow-100 hover:bg-yellow-200',
      'S': 'bg-red-100 hover:bg-red-200',
      'A+': 'bg-orange-100 hover:bg-orange-200',
      'A': 'bg-orange-50 hover:bg-orange-100',
      'B': 'bg-green-50 hover:bg-green-100',
      'C': 'bg-blue-50 hover:bg-blue-100',
      'D': 'bg-gray-100 hover:bg-gray-200'
    };
    return colorMap[finalGrade] || 'bg-gray-50';
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold">2軸評価マトリックス</h3>
        <p className="text-sm text-gray-600 mt-1">
          横軸：施設内評価（相対評価）、縦軸：法人内評価（絶対評価）
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border border-gray-300 bg-gray-50 text-sm">
                法人↓/施設→
              </th>
              {grades.map(grade => (
                <th key={grade} className="p-2 border border-gray-300 bg-gray-50 text-center font-bold">
                  {grade}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grades.map(corporateGrade => (
              <tr key={corporateGrade}>
                <td className="p-2 border border-gray-300 bg-gray-50 text-center font-bold">
                  {corporateGrade}
                </td>
                {grades.map(facilityGrade => {
                  const key = `${corporateGrade}-${facilityGrade}`;
                  const employees = matrixData[key] || [];
                  const finalGrade = getFinalGrade(corporateGrade, facilityGrade);
                  const cellColor = getCellColor(finalGrade);
                  
                  return (
                    <td
                      key={key}
                      className={`border border-gray-300 p-2 cursor-pointer transition-colors ${cellColor}`}
                      onClick={() => employees.length > 0 && onEmployeeSelect?.(employees[0])}
                    >
                      <div className="text-center">
                        <div className="font-bold text-lg mb-1">{finalGrade}</div>
                        {employees.length > 0 && (
                          <>
                            <div className="text-sm text-gray-600">
                              {employees.length}名
                            </div>
                            <div className="mt-1 flex flex-wrap gap-1 justify-center">
                              {employees.slice(0, 3).map((emp, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs px-1 py-0"
                                >
                                  {emp.employeeName.split(' ')[0]}
                                </Badge>
                              ))}
                              {employees.length > 3 && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-1 py-0"
                                >
                                  +{employees.length - 3}
                                </Badge>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 凡例 */}
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="text-sm font-semibold">総合評価:</div>
        {['S+', 'S', 'A+', 'A', 'B', 'C', 'D'].map(grade => (
          <div key={grade} className="flex items-center gap-1">
            <div className={`w-4 h-4 rounded ${getCellColor(grade).split(' ')[0]}`} />
            <span className="text-sm">{grade}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};