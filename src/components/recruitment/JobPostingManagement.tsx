'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { JobPosting } from '@/types/recruitment'
import { Calendar, MapPin, Users, Briefcase, DollarSign, Clock, Edit, Eye, Trash2, Plus } from 'lucide-react'

interface JobPostingManagementProps {
  jobPostings: JobPosting[]
  onCreatePosting?: (posting: Partial<JobPosting>) => void
  onUpdatePosting?: (id: string, posting: Partial<JobPosting>) => void
  onDeletePosting?: (id: string) => void
}

export default function JobPostingManagement({
  jobPostings,
  onCreatePosting,
  onUpdatePosting,
  onDeletePosting
}: JobPostingManagementProps) {
  const [selectedPosting, setSelectedPosting] = useState<JobPosting | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [filter, setFilter] = useState({
    status: 'all',
    facility: 'all',
    department: ''
  })

  const statusColors = {
    draft: '#6b7280',
    active: '#16a34a',
    closed: '#f59e0b',
    filled: '#2563eb'
  }

  const statusLabels = {
    draft: '下書き',
    active: '募集中',
    closed: '締切',
    filled: '採用完了'
  }

  const filteredPostings = jobPostings.filter(posting => {
    if (filter.status !== 'all' && posting.status !== filter.status) return false
    if (filter.facility !== 'all' && posting.facility !== filter.facility) return false
    if (filter.department && !posting.department.toLowerCase().includes(filter.department.toLowerCase())) return false
    return true
  })

  const activeCount = jobPostings.filter(p => p.status === 'active').length
  const totalPositions = jobPostings.reduce((sum, p) => sum + (p.status === 'active' ? p.numberOfPositions : 0), 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              求人票管理
            </CardTitle>
            <Button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              新規求人作成
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600 mb-1">募集中の求人</div>
              <div className="text-2xl font-bold text-blue-700">{activeCount}件</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600 mb-1">総募集人数</div>
              <div className="text-2xl font-bold text-green-700">{totalPositions}名</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-sm text-orange-600 mb-1">今月締切</div>
              <div className="text-2xl font-bold text-orange-700">3件</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-purple-600 mb-1">採用率</div>
              <div className="text-2xl font-bold text-purple-700">82%</div>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <Select value={filter.status} onValueChange={(value) => setFilter({...filter, status: value})}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="ステータス" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全て</SelectItem>
                <SelectItem value="draft">下書き</SelectItem>
                <SelectItem value="active">募集中</SelectItem>
                <SelectItem value="closed">締切</SelectItem>
                <SelectItem value="filled">採用完了</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filter.facility} onValueChange={(value) => setFilter({...filter, facility: value})}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="施設" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全施設</SelectItem>
                <SelectItem value="obara-hospital">桜新町アーバンクリニック</SelectItem>
                <SelectItem value="tachigami-hospital">立神リハビリテーション温泉病院</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="部署で検索..."
              value={filter.department}
              onChange={(e) => setFilter({...filter, department: e.target.value})}
              className="max-w-xs"
            />
          </div>

          <div className="space-y-3">
            {filteredPostings.map((posting) => (
              <div
                key={posting.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedPosting(posting)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{posting.title}</h3>
                      <Badge
                        style={{
                          backgroundColor: statusColors[posting.status],
                          color: 'white'
                        }}
                      >
                        {statusLabels[posting.status]}
                      </Badge>
                      <Badge variant="outline">{posting.employmentType}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {posting.facility === 'obara-hospital' ? '桜新町アーバンクリニック' : '立神リハビリテーション温泉病院'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {posting.department}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        募集人数: {posting.numberOfPositions}名
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {posting.salary.min}〜{posting.salary.max}万円
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        掲載期間: {posting.postingDate}〜{posting.closingDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        更新: {posting.updatedAt}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline" onClick={(e) => {
                      e.stopPropagation()
                    }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={(e) => {
                      e.stopPropagation()
                      onUpdatePosting?.(posting.id, posting)
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={(e) => {
                      e.stopPropagation()
                      onDeletePosting?.(posting.id)
                    }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedPosting && (
        <Card>
          <CardHeader>
            <CardTitle>求人詳細: {selectedPosting.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">基本情報</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">部署:</span>
                    <span>{selectedPosting.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">雇用形態:</span>
                    <span>{selectedPosting.employmentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">勤務地:</span>
                    <span>{selectedPosting.workLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">勤務時間:</span>
                    <span>{selectedPosting.workHours}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">募集要項</h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">必須資格:</div>
                    <ul className="text-sm list-disc list-inside">
                      {selectedPosting.requiredQualifications.map((qual, index) => (
                        <li key={index}>{qual}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">歓迎資格:</div>
                    <ul className="text-sm list-disc list-inside">
                      {selectedPosting.desiredQualifications.map((qual, index) => (
                        <li key={index}>{qual}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <h4 className="font-semibold mb-2">業務内容</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {selectedPosting.jobDescription}
                </p>
              </div>

              <div className="md:col-span-2">
                <h4 className="font-semibold mb-2">福利厚生</h4>
                <ul className="text-sm list-disc list-inside grid grid-cols-2 gap-2">
                  {selectedPosting.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}