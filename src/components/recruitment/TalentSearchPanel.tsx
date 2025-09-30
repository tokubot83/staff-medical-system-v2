'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Slider } from '@/components/ui/slider'
import {
  TalentProfile, TalentSearchQuery, DuplicateCheckResult, TalentStatus
} from '@/types/talentPipeline'
import {
  Search, Filter, X, AlertTriangle, Users, Building, Calendar,
  DollarSign, Award, Tag, History, AlertCircle, CheckCircle
} from 'lucide-react'

interface TalentSearchPanelProps {
  onSearch: (query: TalentSearchQuery) => Promise<TalentProfile[]>
  onCheckDuplicate?: (email: string, phone: string) => Promise<DuplicateCheckResult>
  totalRecords: number
}

export default function TalentSearchPanel({
  onSearch,
  onCheckDuplicate,
  totalRecords
}: TalentSearchPanelProps) {
  const [searchResults, setSearchResults] = useState<TalentProfile[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [duplicateResults, setDuplicateResults] = useState<Map<string, DuplicateCheckResult>>(new Map())

  // 検索条件
  const [searchQuery, setSearchQuery] = useState<TalentSearchQuery>({
    keyword: '',
    statuses: [],
    stages: [],
    facilities: [],
    departments: [],
    positions: [],
    tags: [],
    sortBy: 'recent-contact',
    sortOrder: 'desc',
    limit: 50
  })

  // 詳細検索条件
  const [dateRange, setDateRange] = useState({ from: '', to: '', dateType: 'last-contact' as const })
  const [salaryRange, setSalaryRange] = useState({ min: 0, max: 0 })
  const [experienceRange, setExperienceRange] = useState({ min: 0, max: 0 })
  const [minRating, setMinRating] = useState(0)
  const [includeFlags, setIncludeFlags] = useState({
    duplicates: false,
    previousEmployees: false,
    talentPool: false,
    blacklisted: false
  })

  // 退職者検索条件（Phase 4追加）
  const [includeResignedStaff, setIncludeResignedStaff] = useState(false)
  const [resignedDateRange, setResignedDateRange] = useState({ from: '', to: '' })
  const [rehireEligibleOnly, setRehireEligibleOnly] = useState(false)

  const statusOptions: { value: TalentStatus; label: string }[] = [
    { value: 'visitor-scheduled', label: '見学予定' },
    { value: 'visitor-completed', label: '見学済み' },
    { value: 'applicant-new', label: '新規応募' },
    { value: 'applicant-screening', label: '書類選考' },
    { value: 'applicant-interview', label: '面接中' },
    { value: 'offer-pending', label: '内定出し' },
    { value: 'offer-accepted', label: '内定承諾' },
    { value: 'onboarding', label: '入職準備' },
    { value: 'employed', label: '入職済み' },
    { value: 'declined', label: '辞退' },
    { value: 'rejected', label: '不採用' },
    { value: 'talent-pool', label: 'タレントプール' }
  ]

  const handleSearch = async () => {
    setIsSearching(true)
    try {
      const query: TalentSearchQuery = {
        ...searchQuery,
        dateRange: dateRange.from && dateRange.to ? dateRange : undefined,
        salaryRange: salaryRange.min || salaryRange.max ? salaryRange : undefined,
        experienceYears: experienceRange.min || experienceRange.max ? experienceRange : undefined,
        minRating: minRating > 0 ? minRating : undefined,
        includeFlags: Object.values(includeFlags).some(v => v) ? includeFlags : undefined,
        // 退職者検索条件（Phase 4追加）
        includeResignedStaff,
        resignedDateRange: includeResignedStaff && (resignedDateRange.from || resignedDateRange.to) ? resignedDateRange : undefined,
        rehireEligibleOnly: includeResignedStaff && rehireEligibleOnly
      }

      const results = await onSearch(query)
      setSearchResults(results)

      // 重複チェック（最初の10件のみ）
      if (onCheckDuplicate) {
        for (const talent of results.slice(0, 10)) {
          const duplicateCheck = await onCheckDuplicate(talent.basicInfo.email, talent.basicInfo.phone)
          if (duplicateCheck.isDuplicate) {
            setDuplicateResults(prev => new Map(prev).set(talent.id, duplicateCheck))
          }
        }
      }
    } finally {
      setIsSearching(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery({
      keyword: '',
      statuses: [],
      stages: [],
      facilities: [],
      departments: [],
      positions: [],
      tags: [],
      sortBy: 'recent-contact',
      sortOrder: 'desc',
      limit: 50
    })
    setDateRange({ from: '', to: '', dateType: 'last-contact' })
    setSalaryRange({ min: 0, max: 0 })
    setExperienceRange({ min: 0, max: 0 })
    setMinRating(0)
    setIncludeFlags({
      duplicates: false,
      previousEmployees: false,
      talentPool: false,
      blacklisted: false
    })
    // 退職者検索条件もクリア
    setIncludeResignedStaff(false)
    setResignedDateRange({ from: '', to: '' })
    setRehireEligibleOnly(false)
    setSearchResults([])
    setDuplicateResults(new Map())
  }

  return (
    <div className="space-y-6">
      {/* 検索フォーム */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              統合人材検索
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                総レコード数: {totalRecords.toLocaleString()}件
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <Filter className="h-4 w-4 mr-1" />
                {showAdvanced ? '基本検索' : '詳細検索'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* 基本検索 */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="名前、メール、電話番号、タグで検索..."
                  value={searchQuery.keyword}
                  onChange={(e) => setSearchQuery({ ...searchQuery, keyword: e.target.value })}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? '検索中...' : '検索'}
              </Button>
              <Button variant="outline" onClick={clearSearch}>
                クリア
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* ステータスフィルター */}
              <Select
                value={searchQuery.statuses?.[0] || 'all'}
                onValueChange={(value) => setSearchQuery({
                  ...searchQuery,
                  statuses: value === 'all' ? [] : [value as TalentStatus]
                })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="ステータス" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全て</SelectItem>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* ステージフィルター */}
              <Select
                value={searchQuery.stages?.[0] || 'all'}
                onValueChange={(value) => setSearchQuery({
                  ...searchQuery,
                  stages: value === 'all' ? [] : [value as any]
                })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="ステージ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全て</SelectItem>
                  <SelectItem value="visitor">見学者</SelectItem>
                  <SelectItem value="applicant">応募者</SelectItem>
                  <SelectItem value="offer-holder">内定者</SelectItem>
                  <SelectItem value="employee">職員</SelectItem>
                  <SelectItem value="inactive">非アクティブ</SelectItem>
                </SelectContent>
              </Select>

              {/* ソート */}
              <Select
                value={searchQuery.sortBy}
                onValueChange={(value: any) => setSearchQuery({ ...searchQuery, sortBy: value })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="並び順" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent-contact">最終接触日</SelectItem>
                  <SelectItem value="first-contact">初回接触日</SelectItem>
                  <SelectItem value="rating">評価順</SelectItem>
                  <SelectItem value="name">名前順</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 詳細検索オプション */}
            {showAdvanced && (
              <div className="border-t pt-4 space-y-4">
                {/* 日付範囲 */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">期間指定</label>
                    <Select
                      value={dateRange.dateType}
                      onValueChange={(value: any) => setDateRange({ ...dateRange, dateType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="first-contact">初回接触日</SelectItem>
                        <SelectItem value="last-contact">最終接触日</SelectItem>
                        <SelectItem value="visit">見学日</SelectItem>
                        <SelectItem value="application">応募日</SelectItem>
                        <SelectItem value="interview">面接日</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    type="date"
                    placeholder="開始日"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  />
                  <Input
                    type="date"
                    placeholder="終了日"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  />
                </div>

                {/* 給与・経験年数 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      希望給与範囲（万円）
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="最小"
                        value={salaryRange.min || ''}
                        onChange={(e) => setSalaryRange({ ...salaryRange, min: parseInt(e.target.value) || 0 })}
                      />
                      <span>〜</span>
                      <Input
                        type="number"
                        placeholder="最大"
                        value={salaryRange.max || ''}
                        onChange={(e) => setSalaryRange({ ...salaryRange, max: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      経験年数
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="最小"
                        value={experienceRange.min || ''}
                        onChange={(e) => setExperienceRange({ ...experienceRange, min: parseInt(e.target.value) || 0 })}
                      />
                      <span>〜</span>
                      <Input
                        type="number"
                        placeholder="最大"
                        value={experienceRange.max || ''}
                        onChange={(e) => setExperienceRange({ ...experienceRange, max: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </div>

                {/* 評価フィルター */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    最低評価: {minRating > 0 ? `${minRating}以上` : '指定なし'}
                  </label>
                  <Slider
                    value={[minRating]}
                    onValueChange={([value]) => setMinRating(value)}
                    max={5}
                    step={1}
                    className="w-64"
                  />
                </div>

                {/* 特殊フィルター */}
                <div>
                  <label className="text-sm font-medium mb-2 block">特殊条件</label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={includeFlags.duplicates}
                        onCheckedChange={(checked) => setIncludeFlags({
                          ...includeFlags,
                          duplicates: checked as boolean
                        })}
                      />
                      <span className="text-sm">重複候補のみ</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={includeFlags.previousEmployees}
                        onCheckedChange={(checked) => setIncludeFlags({
                          ...includeFlags,
                          previousEmployees: checked as boolean
                        })}
                      />
                      <span className="text-sm">元職員を含む</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={includeFlags.talentPool}
                        onCheckedChange={(checked) => setIncludeFlags({
                          ...includeFlags,
                          talentPool: checked as boolean
                        })}
                      />
                      <span className="text-sm">タレントプールのみ</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={includeFlags.blacklisted}
                        onCheckedChange={(checked) => setIncludeFlags({
                          ...includeFlags,
                          blacklisted: checked as boolean
                        })}
                      />
                      <span className="text-sm">ブラックリストを含む</span>
                    </label>
                  </div>
                </div>

                {/* 退職者検索セクション（Phase 4追加） */}
                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <History className="h-4 w-4" />
                      退職者データベース検索
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={includeResignedStaff}
                        onCheckedChange={(checked) => setIncludeResignedStaff(checked as boolean)}
                      />
                      <span className="text-sm font-medium">退職者を含めて検索</span>
                    </label>

                    {includeResignedStaff && (
                      <div className="pl-6 space-y-3 border-l-2 border-purple-300">
                        <div>
                          <label className="text-sm font-medium mb-2 block">退職日の範囲</label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="date"
                              placeholder="開始日"
                              value={resignedDateRange.from}
                              onChange={(e) => setResignedDateRange({ ...resignedDateRange, from: e.target.value })}
                              className="text-sm"
                            />
                            <span className="text-sm">〜</span>
                            <Input
                              type="date"
                              placeholder="終了日"
                              value={resignedDateRange.to}
                              onChange={(e) => setResignedDateRange({ ...resignedDateRange, to: e.target.value })}
                              className="text-sm"
                            />
                          </div>
                        </div>

                        <label className="flex items-center gap-2">
                          <Checkbox
                            checked={rehireEligibleOnly}
                            onCheckedChange={(checked) => setRehireEligibleOnly(checked as boolean)}
                          />
                          <span className="text-sm">再雇用可能者のみ</span>
                        </label>

                        <Alert className="bg-white border-purple-200">
                          <AlertCircle className="h-4 w-4 text-purple-600" />
                          <AlertDescription className="text-xs text-purple-800">
                            退職者の過去の勤務履歴・評価・退職理由を確認できます
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 検索結果 */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                検索結果: {searchResults.length}件
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  CSVエクスポート
                </Button>
                <Button variant="outline" size="sm">
                  一括操作
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {searchResults.slice(0, 20).map((talent) => {
                const duplicate = duplicateResults.get(talent.id)

                return (
                  <div key={talent.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    {/* 重複アラート */}
                    {duplicate?.isDuplicate && (
                      <Alert className="mb-3 border-orange-500 bg-orange-50">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <AlertDescription>
                          <span className="font-semibold">重複の可能性:</span>
                          {duplicate.matchedProfiles.map(p => (
                            <span key={p.id} className="ml-2">
                              {p.name}（{p.facilities.join(', ')}）
                            </span>
                          ))}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold">
                            {talent.basicInfo.lastName} {talent.basicInfo.firstName}
                          </span>
                          <Badge>{talent.currentStatus}</Badge>
                          {talent.flags.isPreviousEmployee && (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                              元職員（再応募）
                            </Badge>
                          )}
                          {talent.flags.isRehireEligible && (
                            <Badge variant="outline" className="border-green-500 text-green-700">
                              ✓ 再雇用推奨
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 space-x-4">
                          <span>{talent.basicInfo.email}</span>
                          <span>{talent.basicInfo.phone}</span>
                          <span>最終接触: {talent.basicInfo.lastContactDate}</span>
                        </div>

                        {/* 元職員の詳細情報（Phase 4追加） */}
                        {talent.flags.isPreviousEmployee && includeResignedStaff && (
                          <Alert className="mt-3 border-blue-200 bg-blue-50">
                            <AlertCircle className="h-4 w-4 text-blue-600" />
                            <AlertDescription className="text-sm">
                              <div className="font-semibold text-blue-900 mb-2">過去の勤務履歴</div>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-blue-800">
                                <div>
                                  <span className="font-medium">在職期間:</span>
                                  <span className="ml-1">2020-04-01 〜 2023-03-31</span>
                                </div>
                                <div>
                                  <span className="font-medium">最終所属:</span>
                                  <span className="ml-1">小原病院 / 第1病棟</span>
                                </div>
                                <div>
                                  <span className="font-medium">最終職位:</span>
                                  <span className="ml-1">看護師</span>
                                </div>
                                <div>
                                  <span className="font-medium">平均評価:</span>
                                  <span className="ml-1">4.2/5.0</span>
                                </div>
                                <div className="col-span-2">
                                  <span className="font-medium">退職理由:</span>
                                  <span className="ml-1">キャリアアップ（他院へ転職）</span>
                                </div>
                                {talent.flags.isRehireEligible ? (
                                  <div className="col-span-2 text-green-700 font-medium">
                                    ✓ 再雇用推奨 - 優秀な職員として評価されていました
                                  </div>
                                ) : (
                                  <div className="col-span-2 text-gray-600">
                                    再雇用については要検討
                                  </div>
                                )}
                              </div>
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                      <Button size="sm" variant="outline">
                        詳細
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            {searchResults.length > 20 && (
              <div className="mt-4 text-center">
                <Button variant="outline">
                  さらに表示（残り{searchResults.length - 20}件）
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}