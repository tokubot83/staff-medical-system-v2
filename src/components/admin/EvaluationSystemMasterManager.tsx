'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GenericMasterTable from './GenericMasterTable';
import { masterSchemas } from '@/config/masterSchemas';
import DepartmentCustomizationPanel from './DepartmentCustomizationPanel';
import ApprovalWorkflowPanel from './ApprovalWorkflowPanel';
import EvaluationSimulationPanel from './EvaluationSimulationPanel';
import ImpactAnalysisPanel from './ImpactAnalysisPanel';
import {
  Calculator,
  Settings,
  TrendingUp,
  Grid3x3,
  Calendar,
  Award,
  Info,
  Shield,
  Send,
  FlaskConical,
  AlertTriangle
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function EvaluationSystemMasterManager() {
  const [activeTab, setActiveTab] = useState('evaluationSystem');
  const [showDepartmentPanel, setShowDepartmentPanel] = useState(false);

  // ユーザー情報（実際はコンテキストやセッションから取得）
  const currentUser = {
    id: 'USER_001',
    name: '部署管理者',
    role: 'department_manager',
    department: '営業部',
    facility: '東京本社',
  };

  // デモ用：複数の部署管理者例
  const sampleUsers = [
    { id: 'USER_001', name: 'リハビリ科長', role: 'department_manager', department: 'リハビリテーション科', facility: '小原病院' },
    { id: 'USER_002', name: '看護部長', role: 'department_manager', department: '看護部', facility: '小原病院' },
    { id: 'USER_003', name: '総務部長', role: 'department_manager', department: '総務部', facility: '本社' },
    { id: 'USER_004', name: '営業部長', role: 'department_manager', department: '営業部', facility: '東京支社' },
    { id: 'USER_005', name: 'システム管理者', role: 'admin', department: 'IT部', facility: '本社' },
  ];

  const tabs = [
    {
      key: 'evaluationSystem',
      label: '評価制度設定',
      icon: Settings,
      description: '評価制度の基本設定（バージョン、有効期間、総点数）',
      adminOnly: false
    },
    {
      key: 'scoreComponent',
      label: '配点構成',
      icon: Calculator,
      description: '技術評価・組織貢献度の配点設定',
      adminOnly: false
    },
    {
      key: 'contributionItem',
      label: '貢献度項目',
      icon: TrendingUp,
      description: '施設貢献・法人貢献の評価項目定義',
      adminOnly: false
    },
    {
      key: 'gradeConversion',
      label: 'グレード変換',
      icon: Award,
      description: '順位からS/A/B/C/Dへの変換ルール',
      adminOnly: false
    },
    {
      key: 'matrixDefinition',
      label: 'マトリックス定義',
      icon: Grid3x3,
      description: '2軸評価から7段階への変換マトリックス',
      adminOnly: false
    },
    {
      key: 'periodAllocation',
      label: '期別配点',
      icon: Calendar,
      description: '夏季・冬季などの期別配点設定',
      adminOnly: false
    },
    {
      key: 'departmentPermission',
      label: '部署別権限',
      icon: Shield,
      description: '部署別カスタマイズ権限の設定',
      adminOnly: true
    },
    {
      key: 'approvalWorkflow',
      label: '承認ワークフロー',
      icon: Send,
      description: 'カスタマイズ申請の承認管理',
      adminOnly: true
    },
    {
      key: 'simulation',
      label: 'シミュレーション',
      icon: FlaskConical,
      description: '評価制度変更のWhat-if分析',
      adminOnly: false
    },
    {
      key: 'impactAnalysis',
      label: '影響分析',
      icon: AlertTriangle,
      description: '制度変更の個人・部署・給与への影響を詳細分析',
      adminOnly: false
    },
  ];

  const currentTab = tabs.find(tab => tab.key === activeTab);
  const Icon = currentTab?.icon || Settings;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            評価制度マスター管理
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              評価制度全体の動的管理システムです。配点、評価基準、マトリックス変換などすべての要素を自由に設定・変更できます。
              制度改定時はここから設定を調整してください。
            </AlertDescription>
          </Alert>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 gap-2 h-auto p-1 bg-gray-100">
              {tabs.filter(tab => !tab.adminOnly || currentUser.role === 'admin').map(tab => {
                const TabIcon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.key}
                    value={tab.key}
                    className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-white"
                  >
                    <TabIcon className="h-4 w-4" />
                    <span className="text-xs">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <div className="mt-6">
              {currentTab && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold">{currentTab.label}</h3>
                    {activeTab === 'evaluationSystem' && (
                      <Badge className="bg-green-100 text-green-800">メイン設定</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{currentTab.description}</p>
                </div>
              )}

              {tabs.map(tab => (
                <TabsContent key={tab.key} value={tab.key}>
                  {tab.key === 'approvalWorkflow' ? (
                    <ApprovalWorkflowPanel />
                  ) : tab.key === 'simulation' ? (
                    <EvaluationSimulationPanel />
                  ) : tab.key === 'impactAnalysis' ? (
                    <ImpactAnalysisPanel />
                  ) : tab.key === 'departmentPermission' && currentUser.role === 'admin' ? (
                    <GenericMasterTable
                      masterType={tab.key}
                      label={masterSchemas[tab.key].label}
                      fields={masterSchemas[tab.key].fields}
                      searchableFields={masterSchemas[tab.key].searchableFields}
                    />
                  ) : masterSchemas[tab.key] ? (
                    <GenericMasterTable
                      masterType={tab.key}
                      label={masterSchemas[tab.key].label}
                      fields={masterSchemas[tab.key].fields}
                      searchableFields={masterSchemas[tab.key].searchableFields}
                    />
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      設定が見つかりません
                    </div>
                  )}
                </TabsContent>
              ))}
            </div>
          </Tabs>

          {/* 部署管理者用パネル */}
          {currentUser.role === 'department_manager' && (
            <div className="mt-6">
              <Button
                onClick={() => setShowDepartmentPanel(!showDepartmentPanel)}
                variant="outline"
                className="w-full"
              >
                <Shield className="h-4 w-4 mr-2" />
                {currentUser.facility} {currentUser.department}のカスタマイズ設定
              </Button>
              {showDepartmentPanel && (
                <div className="mt-4">
                  <DepartmentCustomizationPanel
                    department={currentUser.department}
                    facility={currentUser.facility}
                    currentUser={currentUser}
                  />
                </div>
              )}
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">現在の設定例</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-blue-800 mb-1">基本構成（100点満点）</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• 技術評価: 50点（絶対評価）</li>
                  <li>• 組織貢献度: 50点（相対評価）</li>
                  <li className="ml-4">- 夏季: 25点（施設12.5点 + 法人12.5点）</li>
                  <li className="ml-4">- 冬季: 25点（施設12.5点 + 法人12.5点）</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-blue-800 mb-1">評価フロー</p>
                <ul className="space-y-1 text-blue-700">
                  <li>1. 100点満点で採点</li>
                  <li>2. 施設内・法人内で順位化</li>
                  <li>3. 5段階評価（S/A/B/C/D）に変換</li>
                  <li>4. 2軸マトリックスで7段階最終評価</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}