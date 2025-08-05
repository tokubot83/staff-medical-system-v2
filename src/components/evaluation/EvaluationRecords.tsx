'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, FileText, ChevronRight, Award, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'

interface EvaluationRecord {
  id: string
  date: string
  period: string
  facilityScore: number
  corporateScore: number
  overallGrade: string
  evaluator: string
  summary: string
  strengths: string[]
  improvements: string[]
  nextGoals?: string[]
  sheetUrl?: string
}

interface EvaluationRecordsProps {
  records: EvaluationRecord[]
  staffId: string
  onNewEvaluation?: () => void
}

const gradeColors: Record<string, string> = {
  'S': 'bg-purple-100 text-purple-800',
  'A+': 'bg-blue-100 text-blue-800',
  'A': 'bg-green-100 text-green-800',
  'B+': 'bg-yellow-100 text-yellow-800',
  'B': 'bg-orange-100 text-orange-800',
  'C': 'bg-red-100 text-red-800'
}

export function EvaluationRecords({ records, staffId, onNewEvaluation }: EvaluationRecordsProps) {
  const router = useRouter()
  
  const handleViewSheet = (sheetUrl?: string) => {
    if (sheetUrl) {
      router.push(sheetUrl)
    } else {
      // デフォルトの評価シートへ遷移
      router.push(`/evaluation/sheet/${staffId}`)
    }
  }

  const renderEvaluationCard = (evaluation: EvaluationRecord) => (
    <Card key={evaluation.id} className="mb-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewSheet(evaluation.sheetUrl)}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="font-medium">{evaluation.period}</span>
              <Badge className={gradeColors[evaluation.overallGrade] || 'bg-gray-100 text-gray-800'} variant="secondary">
                総合評価: {evaluation.overallGrade}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Award className="w-3 h-3" />
                <span>施設評価: {evaluation.facilityScore}点</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-3 h-3" />
                <span>法人評価: {evaluation.corporateScore}点</span>
              </div>
              <span>評価者: {evaluation.evaluator}</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="mb-3">
          <p className="text-sm text-gray-700 line-clamp-2">{evaluation.summary}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">強み:</p>
            <div className="flex flex-wrap gap-1">
              {evaluation.strengths.slice(0, 3).map((strength, idx) => (
                <Badge key={idx} variant="outline" className="text-xs bg-green-50">
                  {strength}
                </Badge>
              ))}
              {evaluation.strengths.length > 3 && (
                <span className="text-xs text-gray-500">他{evaluation.strengths.length - 3}件</span>
              )}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">改善点:</p>
            <div className="flex flex-wrap gap-1">
              {evaluation.improvements.slice(0, 3).map((improvement, idx) => (
                <Badge key={idx} variant="outline" className="text-xs bg-yellow-50">
                  {improvement}
                </Badge>
              ))}
              {evaluation.improvements.length > 3 && (
                <span className="text-xs text-gray-500">他{evaluation.improvements.length - 3}件</span>
              )}
            </div>
          </div>
        </div>
        
        {evaluation.nextGoals && evaluation.nextGoals.length > 0 && (
          <div className="border-t pt-3 mt-3">
            <div className="flex items-center gap-2 text-xs text-blue-600">
              <TrendingUp className="w-3 h-3" />
              <span>次期目標: {evaluation.nextGoals[0]}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">評価記録</CardTitle>
          <Button onClick={onNewEvaluation} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            評価入力
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          {records.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>評価記録はありません</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={onNewEvaluation}>
                <Plus className="w-4 h-4 mr-1" />
                評価を実施
              </Button>
            </div>
          ) : (
            <div>
              {records
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(renderEvaluationCard)
              }
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}