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

export function InterviewRecords({ records, careerInfo, onNewInterview }: InterviewRecordsProps) {
  const [activeTab, setActiveTab] = useState('regular')
  
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="regular">
              定期面談
              {recordsByType.regular.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1">
                  {recordsByType.regular.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="career">
              キャリア
              {recordsByType.career.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1">
                  {recordsByType.career.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="stress">
              ストレス
              {recordsByType.stress.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1">
                  {recordsByType.stress.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="evaluation">
              評価
              {recordsByType.evaluation.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1">
                  {recordsByType.evaluation.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="other">
              その他
              {recordsByType.other.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1">
                  {recordsByType.other.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="regular" className="mt-4">
            {recordsByType.regular.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>定期面談の記録はありません</p>
                <Button variant="outline" size="sm" className="mt-3" onClick={onNewInterview}>
                  <Plus className="w-4 h-4 mr-1" />
                  初回面談を実施
                </Button>
              </div>
            ) : (
              <div>
                {recordsByType.regular.map(renderInterviewCard)}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="career" className="mt-4">
            {recordsByType.career.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>キャリア面談の記録はありません</p>
              </div>
            ) : (
              <div>
                {recordsByType.career.map(renderInterviewCard)}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="stress" className="mt-4">
            {recordsByType.stress.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>ストレスチェック面談の記録はありません</p>
              </div>
            ) : (
              <div>
                {recordsByType.stress.map(renderInterviewCard)}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="evaluation" className="mt-4">
            {recordsByType.evaluation.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>評価フィードバックの記録はありません</p>
              </div>
            ) : (
              <div>
                {recordsByType.evaluation.map(renderInterviewCard)}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="other" className="mt-4">
            {recordsByType.other.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>その他の面談記録はありません</p>
              </div>
            ) : (
              <div>
                {recordsByType.other.map(renderInterviewCard)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}