'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Calendar, Clock, User, FileText, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface InterviewRecord {
  id: string
  date: string
  type: 'regular' | 'career' | 'stress' | 'evaluation' | 'other'
  duration: 15 | 30 | 45
  interviewer: string
  summary: string
  topics: string[]
  actionItems?: string[]
  nextFollowUp?: string
  careerInfoVersion?: number
}

interface InterviewRecordsProps {
  records: InterviewRecord[]
  careerInfo: any
  onNewInterview?: () => void
  showTypeFilter?: boolean
}

const interviewTypeLabels = {
  regular: '定期面談',
  career: 'キャリア面談',
  stress: 'ストレスチェック面談',
  evaluation: '評価フィードバック',
  other: 'その他'
}

const interviewTypeColors = {
  regular: 'bg-blue-100 text-blue-800',
  career: 'bg-purple-100 text-purple-800',
  stress: 'bg-orange-100 text-orange-800',
  evaluation: 'bg-green-100 text-green-800',
  other: 'bg-gray-100 text-gray-800'
}

export function InterviewRecords({ records, careerInfo, onNewInterview, showTypeFilter = false }: InterviewRecordsProps) {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedType, setSelectedType] = useState<string | null>(null)
  
  const recordsByType = React.useMemo(() => {
    const grouped = {
      regular: [] as InterviewRecord[],
      career: [] as InterviewRecord[],
      stress: [] as InterviewRecord[],
      evaluation: [] as InterviewRecord[],
      other: [] as InterviewRecord[]
    }
    
    records.forEach(record => {
      grouped[record.type].push(record)
    })
    
    return grouped
  }, [records])

  const renderInterviewCard = (interview: InterviewRecord) => (
    <Card key={interview.id} className="mb-4 hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="font-medium">{interview.date}</span>
              <Badge className={interviewTypeColors[interview.type]} variant="secondary">
                {interviewTypeLabels[interview.type]}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="w-3 h-3" />
                <span>{interview.duration}分</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-3 h-3" />
              <span>面談者: {interview.interviewer}</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="mb-3">
          <p className="text-sm text-gray-700 line-clamp-2">{interview.summary}</p>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {interview.topics.map((topic, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {topic}
            </Badge>
          ))}
        </div>
        
        {interview.actionItems && interview.actionItems.length > 0 && (
          <div className="border-t pt-3 mt-3">
            <p className="text-xs font-medium text-gray-600 mb-1">アクション項目:</p>
            <ul className="list-disc list-inside text-xs text-gray-600">
              {interview.actionItems.slice(0, 2).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
              {interview.actionItems.length > 2 && (
                <li className="text-blue-600">他 {interview.actionItems.length - 2} 件</li>
              )}
            </ul>
          </div>
        )}
        
        {interview.nextFollowUp && (
          <div className="mt-3 flex items-center gap-2 text-xs text-orange-600">
            <Calendar className="w-3 h-3" />
            <span>次回フォロー: {interview.nextFollowUp}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">面談記録</CardTitle>
          <Button onClick={onNewInterview} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            新規面談
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showTypeFilter && (
          <div className="flex gap-2 mb-4 flex-wrap">
            <Button
              variant={selectedType === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(null)}
            >
              全て ({records.length})
            </Button>
            {Object.entries(interviewTypeLabels).map(([type, label]) => {
              const count = recordsByType[type as keyof typeof recordsByType].length
              return (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  disabled={count === 0}
                >
                  {label} ({count})
                </Button>
              )
            })}
          </div>
        )}
        
        <div>
          {(() => {
            const filteredRecords = selectedType 
              ? records.filter(r => r.type === selectedType)
              : records
            
            if (filteredRecords.length === 0) {
              return (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>面談記録はありません</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={onNewInterview}>
                    <Plus className="w-4 h-4 mr-1" />
                    面談を予約
                  </Button>
                </div>
              )
            }
            
            return (
              <div>
                {filteredRecords
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(renderInterviewCard)
                }
              </div>
            )
          })()}
        </div>
      </CardContent>
    </Card>
  )
}