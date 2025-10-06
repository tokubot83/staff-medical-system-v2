/**
 * 詳細ヘルプパネルコンポーネント
 * 開発者設定ページの各項目に対して詳細な説明・トラブルシューティング・関連ドキュメントを表示
 */

import React from 'react';
import {
  HelpCircle, Info, AlertTriangle, BookOpen, ExternalLink,
  CheckCircle, XCircle, Shield, Zap, Database, Server
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type ImpactScope = 'medical' | 'voicedrive' | 'both' | 'all';

export interface DetailedHelpData {
  whatIsThis: string;           // 用語解説
  whyNeeded: string;             // 目的・必要性
  impactScope: ImpactScope[];    // 影響範囲
  recommendedValue: string;      // 推奨値
  troubleshooting?: {            // トラブルシューティング
    problem: string;
    solution: string;
  }[];
  relatedDocs?: {                // 関連ドキュメント
    title: string;
    url: string;
  }[];
  riskLevel?: RiskLevel;         // 変更リスクレベル
  technicalDetails?: string;     // 技術的詳細（任意）
}

interface DetailedHelpPanelProps {
  title: string;
  helpData: DetailedHelpData;
  onClose?: () => void;
}

export const DetailedHelpPanel: React.FC<DetailedHelpPanelProps> = ({
  title,
  helpData,
  onClose
}) => {
  const getRiskLevelColor = (level?: RiskLevel) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
      default:
        return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getRiskLevelIcon = (level?: RiskLevel) => {
    switch (level) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <Info className="h-4 w-4" />;
      case 'low':
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getImpactScopeLabel = (scope: ImpactScope) => {
    switch (scope) {
      case 'medical':
        return '職員カルテ';
      case 'voicedrive':
        return 'VoiceDrive';
      case 'both':
        return '職員カルテ・VoiceDrive';
      case 'all':
        return '全システム';
    }
  };

  const getImpactScopeColor = (scope: ImpactScope) => {
    switch (scope) {
      case 'medical':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'voicedrive':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'both':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'all':
        return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  return (
    <Card className="border-2 border-blue-200 bg-blue-50/50 shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-blue-900">{title} - 詳細ヘルプ</CardTitle>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              閉じる
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 用語解説 */}
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4 text-blue-600" />
            <h4 className="font-semibold text-gray-900">これは何？</h4>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{helpData.whatIsThis}</p>
        </div>

        {/* 目的・必要性 */}
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-purple-600" />
            <h4 className="font-semibold text-gray-900">なぜ必要？</h4>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{helpData.whyNeeded}</p>
        </div>

        {/* 推奨設定 */}
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <h4 className="font-semibold text-gray-900">推奨設定</h4>
          </div>
          <code className="block text-sm bg-gray-100 p-3 rounded border font-mono text-gray-800">
            {helpData.recommendedValue}
          </code>
        </div>

        {/* 影響範囲 */}
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-orange-600" />
            <h4 className="font-semibold text-gray-900">変更の影響範囲</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {helpData.impactScope.map((scope, idx) => (
              <Badge key={idx} className={getImpactScopeColor(scope)}>
                {getImpactScopeLabel(scope)}
              </Badge>
            ))}
          </div>
        </div>

        {/* リスクレベル */}
        {helpData.riskLevel && (
          <Alert className={`border-2 ${getRiskLevelColor(helpData.riskLevel)}`}>
            <div className="flex items-center gap-2">
              {getRiskLevelIcon(helpData.riskLevel)}
              <AlertTitle className="font-semibold">
                変更リスクレベル: {helpData.riskLevel.toUpperCase()}
              </AlertTitle>
            </div>
            <AlertDescription className="text-sm mt-2">
              {helpData.riskLevel === 'critical' && '❗ 変更前に必ずバックアップを取り、影響範囲を十分に確認してください'}
              {helpData.riskLevel === 'high' && '⚠️ 変更前に影響範囲を確認し、テスト環境で検証してください'}
              {helpData.riskLevel === 'medium' && '💡 変更後の動作確認を推奨します'}
              {helpData.riskLevel === 'low' && '✅ 比較的安全に変更できます'}
            </AlertDescription>
          </Alert>
        )}

        {/* トラブルシューティング */}
        {helpData.troubleshooting && helpData.troubleshooting.length > 0 && (
          <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <h4 className="font-semibold text-gray-900">トラブルシューティング</h4>
            </div>
            <div className="space-y-3">
              {helpData.troubleshooting.map((item, idx) => (
                <div key={idx} className="border-l-2 border-yellow-400 pl-3">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    ❌ {item.problem}
                  </p>
                  <p className="text-sm text-gray-700">
                    ✅ {item.solution}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 技術的詳細 */}
        {helpData.technicalDetails && (
          <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <Server className="h-4 w-4 text-gray-600" />
              <h4 className="font-semibold text-gray-900">技術的詳細</h4>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {helpData.technicalDetails}
            </p>
          </div>
        )}

        {/* 関連ドキュメント */}
        {helpData.relatedDocs && helpData.relatedDocs.length > 0 && (
          <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-indigo-600" />
              <h4 className="font-semibold text-gray-900">関連ドキュメント</h4>
            </div>
            <div className="space-y-2">
              {helpData.relatedDocs.map((doc, idx) => (
                <a
                  key={idx}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  {doc.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * 簡易ヘルプアイコンコンポーネント
 * 設定項目のラベル横に表示するアイコンボタン
 */
interface HelpIconButtonProps {
  onClick: () => void;
  tooltipText?: string;
}

export const HelpIconButton: React.FC<HelpIconButtonProps> = ({
  onClick,
  tooltipText = '詳細ヘルプを表示'
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-blue-100 transition-colors group"
      title={tooltipText}
    >
      <HelpCircle className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
    </button>
  );
};
