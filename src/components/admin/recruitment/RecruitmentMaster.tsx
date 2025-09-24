'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import StatusFlowConfig from './StatusFlowConfig'
import FormBuilder from './FormBuilder'
import AutomationRules from './AutomationRules'
import ReportTemplates from './ReportTemplates'
import ValidationRules from './ValidationRules'
import ImportExport from './ImportExport'
import ApplicantStatusConfig from './ApplicantStatusConfig'
import VisitorTypeConfig from './VisitorTypeConfig'
import ApplicationSourceConfig from './ApplicationSourceConfig'
import {
  GitBranch, FileText, Zap, BarChart3, Shield, ArrowUpDown,
  Settings, Users, Building, Briefcase, Eye, Globe, UserCheck
} from 'lucide-react'

export default function RecruitmentMaster() {
  const [activeTab, setActiveTab] = useState('status-flow')

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6" />
          採用管理マスター
        </h2>
        <p className="text-gray-600 mt-1">
          採用プロセス全体の設定とカスタマイズを管理します
        </p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">ステータス数</p>
                <p className="text-2xl font-bold">17</p>
              </div>
              <GitBranch className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">フォームフィールド</p>
                <p className="text-2xl font-bold">45</p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">自動化ルール</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Zap className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">レポート</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* メインタブコンテンツ */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9">
          <TabsTrigger value="status-flow" className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            <span className="hidden xl:inline">ステータス</span>
          </TabsTrigger>
          <TabsTrigger value="applicant-status" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            <span className="hidden xl:inline">応募者</span>
          </TabsTrigger>
          <TabsTrigger value="visitor-type" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="hidden xl:inline">見学者</span>
          </TabsTrigger>
          <TabsTrigger value="app-source" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden xl:inline">経路</span>
          </TabsTrigger>
          <TabsTrigger value="form-builder" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden xl:inline">フォーム</span>
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden xl:inline">自動化</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden xl:inline">レポート</span>
          </TabsTrigger>
          <TabsTrigger value="validation" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden xl:inline">検証</span>
          </TabsTrigger>
          <TabsTrigger value="import-export" className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            <span className="hidden xl:inline">I/E</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="status-flow" className="mt-6">
          <StatusFlowConfig />
        </TabsContent>

        <TabsContent value="applicant-status" className="mt-6">
          <ApplicantStatusConfig />
        </TabsContent>

        <TabsContent value="visitor-type" className="mt-6">
          <VisitorTypeConfig />
        </TabsContent>

        <TabsContent value="app-source" className="mt-6">
          <ApplicationSourceConfig />
        </TabsContent>

        <TabsContent value="form-builder" className="mt-6">
          <FormBuilder />
        </TabsContent>

        <TabsContent value="automation" className="mt-6">
          <AutomationRules />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <ReportTemplates />
        </TabsContent>

        <TabsContent value="validation" className="mt-6">
          <ValidationRules />
        </TabsContent>

        <TabsContent value="import-export" className="mt-6">
          <ImportExport />
        </TabsContent>
      </Tabs>
    </div>
  )
}