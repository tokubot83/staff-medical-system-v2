'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Applicant, ApplicationEvaluation } from '@/types/recruitment'
import { User, Mail, Phone, Calendar, FileText, Star, MessageSquare, ChevronRight, Search, Filter } from 'lucide-react'

interface ApplicantManagementProps {
  applicants: Applicant[]
  onUpdateStatus?: (id: string, status: Applicant['status']) => void
  onAddNote?: (applicantId: string, note: string) => void
  onScheduleInterview?: (applicantId: string) => void
}

export default function ApplicantManagement({
  applicants,
  onUpdateStatus,
  onAddNote,
  onScheduleInterview
}: ApplicantManagementProps) {
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')

  const statusColors = {
    new: '#6b7280',
    screening: '#f59e0b',
    'first-interview': '#8b5cf6',
    'second-interview': '#3b82f6',
    'final-interview': '#2563eb',
    offer: '#16a34a',
    rejected: '#dc2626',
    withdrawn: '#6b7280'
  }

  const statusLabels = {
    new: '新規',
    screening: '書類選考',
    'first-interview': '一次面接',
    'second-interview': '二次面接',
    'final-interview': '最終面接',
    offer: '内定',
    rejected: '不採用',
    withdrawn: '辞退'
  }

  const filteredApplicants = applicants.filter(applicant => {
    if (statusFilter !== 'all' && applicant.status !== statusFilter) return false
    if (searchQuery && !`${applicant.lastName}${applicant.firstName}`.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    return true
  })

  const statusCounts = {
    new: applicants.filter(a => a.status === 'new').length,
    screening: applicants.filter(a => a.status === 'screening').length,
    interview: applicants.filter(a => a.status.includes('interview')).length,
    offer: applicants.filter(a => a.status === 'offer').length
  }

  const getAverageRating = (evaluations: ApplicationEvaluation[]) => {
    if (evaluations.length === 0) return 0
    const sum = evaluations.reduce((acc, evaluation) => acc + evaluation.rating, 0)
    return (sum / evaluations.length).toFixed(1)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              応募者管理
            </CardTitle>
            <div className="flex gap-2">
              <Input
                placeholder="応募者名で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
                icon={<Search className="h-4 w-4" />}
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="ステータス" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全て</SelectItem>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600 mb-1">新規応募</div>
              <div className="text-2xl font-bold text-blue-700">{statusCounts.new}名</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-sm text-orange-600 mb-1">書類選考中</div>
              <div className="text-2xl font-bold text-orange-700">{statusCounts.screening}名</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-purple-600 mb-1">面接中</div>
              <div className="text-2xl font-bold text-purple-700">{statusCounts.interview}名</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600 mb-1">内定者</div>
              <div className="text-2xl font-bold text-green-700">{statusCounts.offer}名</div>
            </div>
          </div>

          <div className="space-y-3">
            {filteredApplicants.map((applicant) => (
              <div
                key={applicant.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedApplicant(applicant)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {applicant.lastName} {applicant.firstName}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {applicant.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {applicant.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          応募日: {applicant.applicationDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {applicant.evaluations.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{getAverageRating(applicant.evaluations)}</span>
                      </div>
                    )}
                    <Badge
                      style={{
                        backgroundColor: statusColors[applicant.status],
                        color: 'white'
                      }}
                    >
                      {statusLabels[applicant.status]}
                    </Badge>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedApplicant && (
        <Card>
          <CardHeader>
            <CardTitle>
              応募者詳細: {selectedApplicant.lastName} {selectedApplicant.firstName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile">
              <TabsList>
                <TabsTrigger value="profile">基本情報</TabsTrigger>
                <TabsTrigger value="experience">職歴・学歴</TabsTrigger>
                <TabsTrigger value="evaluation">評価</TabsTrigger>
                <TabsTrigger value="notes">メモ</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">個人情報</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">氏名:</span>
                        <span>{selectedApplicant.lastName} {selectedApplicant.firstName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">フリガナ:</span>
                        <span>{selectedApplicant.lastNameKana} {selectedApplicant.firstNameKana}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">生年月日:</span>
                        <span>{selectedApplicant.birthDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">性別:</span>
                        <span>{selectedApplicant.gender}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">連絡先</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">メール:</span>
                        <span>{selectedApplicant.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">電話:</span>
                        <span>{selectedApplicant.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">現在の勤務先:</span>
                        <span>{selectedApplicant.currentEmployment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">希望給与:</span>
                        <span>{selectedApplicant.desiredSalary}万円</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <h4 className="font-semibold mb-2">資格</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplicant.qualifications.map((qual, index) => (
                        <Badge key={index} variant="secondary">{qual}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => onScheduleInterview?.(selectedApplicant.id)}>
                    面接をスケジュール
                  </Button>
                  <Select
                    value={selectedApplicant.status}
                    onValueChange={(value) => onUpdateStatus?.(selectedApplicant.id, value as Applicant['status'])}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="experience" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">職歴</h4>
                  <div className="space-y-3">
                    {selectedApplicant.experience.map((exp, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <div className="font-medium">{exp.company}</div>
                        <div className="text-sm text-gray-600">{exp.position}</div>
                        <div className="text-sm text-gray-500">{exp.duration}</div>
                        <div className="text-sm mt-1">{exp.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">学歴</h4>
                  <div className="space-y-3">
                    {selectedApplicant.education.map((edu, index) => (
                      <div key={index} className="border-l-4 border-green-500 pl-4">
                        <div className="font-medium">{edu.school}</div>
                        <div className="text-sm text-gray-600">{edu.degree}</div>
                        <div className="text-sm text-gray-500">卒業年: {edu.graduationYear}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="evaluation" className="space-y-4">
                {selectedApplicant.evaluations.length > 0 ? (
                  selectedApplicant.evaluations.map((evaluation) => (
                    <Card key={evaluation.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{evaluation.evaluatorName}</div>
                            <div className="text-sm text-gray-500">{evaluation.date} - {evaluation.stage}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < evaluation.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <Badge variant={
                              evaluation.recommendation === 'strongly-recommend' ? 'default' :
                              evaluation.recommendation === 'recommend' ? 'secondary' :
                              evaluation.recommendation === 'neutral' ? 'outline' : 'destructive'
                            }>
                              {evaluation.recommendation === 'strongly-recommend' ? '強く推薦' :
                               evaluation.recommendation === 'recommend' ? '推薦' :
                               evaluation.recommendation === 'neutral' ? '中立' : '非推奨'}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <div className="text-sm font-medium text-green-600">強み:</div>
                            <ul className="text-sm list-disc list-inside">
                              {evaluation.strengths.map((strength, i) => (
                                <li key={i}>{strength}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-orange-600">懸念点:</div>
                            <ul className="text-sm list-disc list-inside">
                              {evaluation.concerns.map((concern, i) => (
                                <li key={i}>{concern}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="text-sm font-medium">コメント:</div>
                            <p className="text-sm text-gray-700">{evaluation.comments}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    まだ評価がありません
                  </div>
                )}
              </TabsContent>

              <TabsContent value="notes" className="space-y-4">
                <div className="space-y-3">
                  {selectedApplicant.notes.map((note) => (
                    <div key={note.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-sm">{note.authorName}</div>
                        <div className="text-xs text-gray-500">{note.date}</div>
                      </div>
                      <p className="text-sm">{note.content}</p>
                    </div>
                  ))}
                </div>
                <Button className="w-full" onClick={() => onAddNote?.(selectedApplicant.id, '')}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  メモを追加
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}