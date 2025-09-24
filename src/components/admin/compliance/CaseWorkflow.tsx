'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  GitBranch,
  ArrowRight,
  Clock,
  Users,
  CheckCircle,
  AlertTriangle,
  PlayCircle,
  PauseCircle,
  FileText,
  Zap,
  Settings,
  Shield
} from 'lucide-react';
import { CaseWorkflow as Workflow, WorkflowStage } from '@/types/complianceMaster';

const CaseWorkflow: React.FC = () => {
  const [workflow, setWorkflow] = useState<Workflow>({
    id: '1',
    name: '標準コンプライアンスワークフロー',
    description: 'ハラスメント・不正行為通報の標準処理フロー',
    stages: [
      {
        id: '1',
        name: '受信・初期評価',
        type: 'initial',
        requiredActions: [
          { id: '1', name: '通報内容確認', responsible: 'コンプライアンス担当', deadline: 1, mandatory: true },
          { id: '2', name: '緊急度判定', responsible: 'コンプライアンス担当', deadline: 1, mandatory: true },
          { id: '3', name: '初期対応方針決定', responsible: 'コンプライアンス責任者', deadline: 2, mandatory: true }
        ],
        permissions: [
          { role: 'コンプライアンス担当', actions: ['view', 'edit', 'approve'] },
          { role: 'コンプライアンス責任者', actions: ['view', 'edit', 'approve', 'escalate'] }
        ],
        duration: { target: 2, warning: 1, critical: 0.5 },
        checklistItems: [
          { id: '1', text: '通報内容を確認した', required: true, order: 1 },
          { id: '2', text: '緊急度を判定した', required: true, order: 2 },
          { id: '3', text: '関係者に通知した', required: false, order: 3 }
        ],
        requiredDocuments: ['通報受理記録', '初期評価シート']
      },
      {
        id: '2',
        name: 'トリアージ',
        type: 'investigation',
        requiredActions: [
          { id: '1', name: '詳細情報収集', responsible: '調査チーム', deadline: 24, mandatory: true },
          { id: '2', name: '事実確認', responsible: '調査チーム', deadline: 48, mandatory: true },
          { id: '3', name: '対応方針策定', responsible: 'コンプライアンス責任者', deadline: 72, mandatory: true }
        ],
        permissions: [
          { role: '調査チーム', actions: ['view', 'edit'] },
          { role: 'コンプライアンス責任者', actions: ['view', 'edit', 'approve', 'escalate'] }
        ],
        duration: { target: 72, warning: 48, critical: 24 },
        checklistItems: [
          { id: '1', text: '関係者ヒアリング実施', required: true, order: 1 },
          { id: '2', text: '証拠収集完了', required: true, order: 2 },
          { id: '3', text: '事実関係整理', required: true, order: 3 }
        ],
        requiredDocuments: ['調査計画書', 'ヒアリング記録']
      },
      {
        id: '3',
        name: '調査実施',
        type: 'investigation',
        requiredActions: [
          { id: '1', name: '詳細調査', responsible: '調査委員会', deadline: 168, mandatory: true },
          { id: '2', name: '調査報告書作成', responsible: '調査委員会', deadline: 240, mandatory: true },
          { id: '3', name: '勧告作成', responsible: '調査委員会', deadline: 240, mandatory: true }
        ],
        permissions: [
          { role: '調査委員会', actions: ['view', 'edit', 'approve'] },
          { role: '経営層', actions: ['view'] }
        ],
        duration: { target: 240, warning: 168, critical: 120 },
        checklistItems: [
          { id: '1', text: '全関係者ヒアリング完了', required: true, order: 1 },
          { id: '2', text: '証拠分析完了', required: true, order: 2 },
          { id: '3', text: '法的検討完了', required: false, order: 3 },
          { id: '4', text: '調査報告書承認', required: true, order: 4 }
        ],
        requiredDocuments: ['調査報告書', '証拠一覧', '勧告書']
      },
      {
        id: '4',
        name: '対応決定',
        type: 'review',
        requiredActions: [
          { id: '1', name: '対応方針承認', responsible: '懲戒委員会', deadline: 48, mandatory: true },
          { id: '2', name: '処分決定', responsible: '懲戒委員会', deadline: 72, mandatory: false },
          { id: '3', name: '再発防止策策定', responsible: 'コンプライアンス責任者', deadline: 168, mandatory: true }
        ],
        permissions: [
          { role: '懲戒委員会', actions: ['view', 'edit', 'approve', 'reject'] },
          { role: '経営層', actions: ['view', 'approve', 'reject'] }
        ],
        duration: { target: 168, warning: 120, critical: 72 },
        checklistItems: [
          { id: '1', text: '処分内容決定', required: true, order: 1 },
          { id: '2', text: '関係者通知完了', required: true, order: 2 },
          { id: '3', text: '再発防止策承認', required: true, order: 3 }
        ],
        requiredDocuments: ['処分通知書', '再発防止計画書']
      },
      {
        id: '5',
        name: '実施・クローズ',
        type: 'closed',
        requiredActions: [
          { id: '1', name: '対応実施', responsible: '実施担当者', deadline: 720, mandatory: true },
          { id: '2', name: '効果確認', responsible: 'コンプライアンス担当', deadline: 1440, mandatory: true },
          { id: '3', name: 'ケースクローズ', responsible: 'コンプライアンス責任者', deadline: 1440, mandatory: true }
        ],
        permissions: [
          { role: 'コンプライアンス担当', actions: ['view', 'edit'] },
          { role: 'コンプライアンス責任者', actions: ['view', 'edit', 'approve'] }
        ],
        duration: { target: 1440, warning: 1080, critical: 720 },
        checklistItems: [
          { id: '1', text: '全対応完了', required: true, order: 1 },
          { id: '2', text: '効果測定完了', required: true, order: 2 },
          { id: '3', text: '文書アーカイブ', required: true, order: 3 }
        ],
        requiredDocuments: ['完了報告書', '効果測定結果']
      }
    ],
    transitions: [],
    automations: [],
    slaRules: [],
    escalationMatrix: []
  });

  const [selectedStage, setSelectedStage] = useState<WorkflowStage | null>(null);

  const getStageColor = (type: string) => {
    switch (type) {
      case 'initial': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'investigation': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'review': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'resolution': return 'bg-green-100 text-green-800 border-green-300';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStageIcon = (type: string) => {
    switch (type) {
      case 'initial': return <PlayCircle className="h-5 w-5" />;
      case 'investigation': return <FileText className="h-5 w-5" />;
      case 'review': return <Users className="h-5 w-5" />;
      case 'resolution': return <CheckCircle className="h-5 w-5" />;
      case 'closed': return <PauseCircle className="h-5 w-5" />;
      default: return <Settings className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* ワークフロー概要 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            {workflow.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{workflow.description}</p>

          {/* ビジュアルフロー */}
          <div className="overflow-x-auto pb-4">
            <div className="flex items-center gap-2 min-w-max">
              {workflow.stages.map((stage, index) => (
                <React.Fragment key={stage.id}>
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
                      getStageColor(stage.type)
                    } ${selectedStage?.id === stage.id ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => setSelectedStage(stage)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {getStageIcon(stage.type)}
                      <h4 className="font-medium">{stage.name}</h4>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="h-3 w-3" />
                      <span>目標: {stage.duration.target}時間</span>
                    </div>
                    <div className="mt-2">
                      <Badge className="text-xs">
                        {stage.requiredActions.length}アクション
                      </Badge>
                    </div>
                  </div>
                  {index < workflow.stages.length - 1 && (
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 選択されたステージの詳細 */}
      {selectedStage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStageIcon(selectedStage.type)}
              {selectedStage.name}の詳細
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 期限設定 */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                期限設定
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-gray-600">目標</div>
                  <div className="text-lg font-medium text-green-700">{selectedStage.duration.target}時間</div>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="text-sm text-gray-600">警告</div>
                  <div className="text-lg font-medium text-yellow-700">{selectedStage.duration.warning}時間</div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="text-sm text-gray-600">重大</div>
                  <div className="text-lg font-medium text-red-700">{selectedStage.duration.critical}時間</div>
                </div>
              </div>
            </div>

            {/* 必須アクション */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                必須アクション
              </h4>
              <div className="space-y-2">
                {selectedStage.requiredActions.map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{action.name}</div>
                      <div className="text-sm text-gray-600">
                        担当: {action.responsible} | 期限: {action.deadline}時間以内
                      </div>
                    </div>
                    {action.mandatory && (
                      <Badge className="bg-red-100 text-red-800">必須</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* チェックリスト */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                チェックリスト
              </h4>
              <div className="space-y-2">
                {selectedStage.checklistItems
                  .sort((a, b) => a.order - b.order)
                  .map((item) => (
                    <label key={item.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        className="rounded"
                        disabled
                      />
                      <span className={item.required ? 'font-medium' : ''}>
                        {item.text}
                        {item.required && <span className="text-red-500 ml-1">*</span>}
                      </span>
                    </label>
                  ))}
              </div>
            </div>

            {/* 必要書類 */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                必要書類
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedStage.requiredDocuments.map((doc) => (
                  <Badge key={doc} className="bg-blue-100 text-blue-800">
                    {doc}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 権限設定 */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                権限設定
              </h4>
              <div className="space-y-2">
                {selectedStage.permissions.map((perm, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="font-medium">{perm.role}</span>
                    <div className="flex gap-1">
                      {perm.actions.map((action) => (
                        <Badge key={action} className="text-xs">
                          {action === 'view' ? '閲覧' :
                           action === 'edit' ? '編集' :
                           action === 'approve' ? '承認' :
                           action === 'reject' ? '却下' : 'エスカレーション'}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SLAルール */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            SLAルール・エスカレーション
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <h4 className="font-medium text-red-900 mb-2">重大案件 (Critical)</h4>
              <ul className="space-y-1 text-sm text-red-800">
                <li>• 初動対応: 1時間以内</li>
                <li>• 経営層への報告: 2時間以内</li>
                <li>• 調査開始: 24時間以内</li>
                <li>• SLA違反時: 自動でCEOへエスカレーション</li>
              </ul>
            </div>

            <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
              <h4 className="font-medium text-orange-900 mb-2">高優先度案件 (High)</h4>
              <ul className="space-y-1 text-sm text-orange-800">
                <li>• 初動対応: 24時間以内</li>
                <li>• 調査計画: 72時間以内</li>
                <li>• 解決目標: 2週間以内</li>
                <li>• SLA違反時: 部門長へエスカレーション</li>
              </ul>
            </div>

            <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
              <h4 className="font-medium text-yellow-900 mb-2">中優先度案件 (Medium)</h4>
              <ul className="space-y-1 text-sm text-yellow-800">
                <li>• 初動対応: 72時間以内</li>
                <li>• 調査計画: 1週間以内</li>
                <li>• 解決目標: 1ヶ月以内</li>
                <li>• SLA違反時: マネージャーへ通知</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              SLAルールを編集
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              エスカレーションマトリクス設定
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CaseWorkflow;