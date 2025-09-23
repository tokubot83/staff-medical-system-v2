'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// バージョンの型定義
export interface EvaluationVersion {
  id: string;
  name: string;
  version: string;
  description: string;
  status: 'active' | 'preparing' | 'testing' | 'archived';
  effectiveFrom: string;
  effectiveTo?: string;
  features: string[];
  technicalScore?: number;
  contributionScore?: number;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

// コンテキストの型定義
interface EvaluationVersionContextType {
  // バージョンデータ
  versions: EvaluationVersion[];
  currentVersion: EvaluationVersion | null;
  selectedVersionId: string;

  // 操作関数
  setSelectedVersionId: (id: string) => void;
  createVersion: (version: Omit<EvaluationVersion, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateVersion: (id: string, updates: Partial<EvaluationVersion>) => Promise<void>;
  deleteVersion: (id: string) => Promise<void>;
  activateVersion: (id: string) => Promise<void>;
  archiveVersion: (id: string) => Promise<void>;

  // 状態管理
  loading: boolean;
  error: string | null;

  // ユーザー権限
  canEdit: boolean;
  canDelete: boolean;
  canActivate: boolean;
}

// デフォルトのバージョンデータ（初期値）
const defaultVersions: EvaluationVersion[] = [
  {
    id: 'v1',
    name: 'v1.0 基本評価制度',
    version: '1.0',
    description: '初期の評価制度。シンプルな5段階評価',
    status: 'archived',
    effectiveFrom: '2021-04-01',
    effectiveTo: '2022-03-31',
    features: ['5段階評価', '年1回評価', '上司評価のみ'],
    technicalScore: 100,
    contributionScore: 0,
  },
  {
    id: 'v2',
    name: 'v2.0 360度評価導入',
    version: '2.0',
    description: '360度評価を導入し、多面的な評価を実現',
    status: 'archived',
    effectiveFrom: '2022-04-01',
    effectiveTo: '2023-03-31',
    features: ['360度評価', '同僚評価', '部下評価', '自己評価'],
    technicalScore: 80,
    contributionScore: 20,
  },
  {
    id: 'v3',
    name: 'v3.0 貢献度評価追加',
    version: '3.0',
    description: '組織貢献度を評価に追加。技術70点＋貢献度30点',
    status: 'archived',
    effectiveFrom: '2023-04-01',
    effectiveTo: '2024-03-31',
    features: ['技術評価70点', '組織貢献度30点', '年2回評価'],
    technicalScore: 70,
    contributionScore: 30,
  },
  {
    id: 'v4',
    name: 'v4.0 2軸統合評価（現行）',
    version: '4.0',
    description: '技術評価と組織貢献度を統合した2軸評価制度',
    status: 'active',
    effectiveFrom: '2024-04-01',
    features: [
      '技術評価50点',
      '組織貢献度50点',
      '2軸マトリックス評価',
      '7段階最終評価',
      '四半期毎の中間評価'
    ],
    technicalScore: 50,
    contributionScore: 50,
  },
  {
    id: 'v5',
    name: 'v5.0 AI支援評価（準備中）',
    version: '5.0',
    description: 'AI分析を活用した客観的評価支援システム',
    status: 'preparing',
    effectiveFrom: '2025-04-01',
    features: [
      'AI分析支援',
      '行動データ自動収集',
      'リアルタイム評価',
      '予測分析',
      'キャリアパス提案'
    ],
    technicalScore: 40,
    contributionScore: 40,
  },
];

// Context作成
const EvaluationVersionContext = createContext<EvaluationVersionContextType | undefined>(undefined);

// Provider コンポーネント
export function EvaluationVersionProvider({ children }: { children: ReactNode }) {
  const [versions, setVersions] = useState<EvaluationVersion[]>(defaultVersions);
  const [selectedVersionId, setSelectedVersionId] = useState<string>('v4');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 現在のバージョンを取得
  const currentVersion = versions.find(v => v.id === selectedVersionId) || null;

  // ユーザー権限（実際は認証情報から取得）
  const canEdit = true; // 管理者の場合true
  const canDelete = true; // 管理者の場合true
  const canActivate = true; // 管理者の場合true

  // APIからバージョン情報を取得
  useEffect(() => {
    fetchVersions();
  }, []);

  const fetchVersions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/evaluation-versions');
      if (response.ok) {
        const data = await response.json();
        setVersions(data.versions || defaultVersions);
      }
    } catch (err) {
      console.error('Failed to fetch versions:', err);
      // エラー時はデフォルトデータを使用
    } finally {
      setLoading(false);
    }
  };

  // バージョン作成
  const createVersion = async (version: Omit<EvaluationVersion, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const newVersion: EvaluationVersion = {
        ...version,
        id: `v${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch('/api/evaluation-versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVersion),
      });

      if (response.ok) {
        setVersions(prev => [...prev, newVersion]);
      } else {
        // APIが存在しない場合もローカルで追加
        setVersions(prev => [...prev, newVersion]);
      }
    } catch (err) {
      setError('バージョンの作成に失敗しました');
      // エラー時もローカルで追加
      const newVersion: EvaluationVersion = {
        ...version,
        id: `v${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setVersions(prev => [...prev, newVersion]);
    } finally {
      setLoading(false);
    }
  };

  // バージョン更新
  const updateVersion = async (id: string, updates: Partial<EvaluationVersion>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/evaluation-versions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok || true) { // APIがなくても動作
        setVersions(prev => prev.map(v =>
          v.id === id ? { ...v, ...updates, updatedAt: new Date().toISOString() } : v
        ));
      }
    } catch (err) {
      setError('バージョンの更新に失敗しました');
      // エラー時もローカルで更新
      setVersions(prev => prev.map(v =>
        v.id === id ? { ...v, ...updates, updatedAt: new Date().toISOString() } : v
      ));
    } finally {
      setLoading(false);
    }
  };

  // バージョン削除
  const deleteVersion = async (id: string) => {
    if (!window.confirm('このバージョンを削除してもよろしいですか？')) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/evaluation-versions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok || true) { // APIがなくても動作
        setVersions(prev => prev.filter(v => v.id !== id));
        if (selectedVersionId === id) {
          const activeVersion = versions.find(v => v.status === 'active');
          if (activeVersion) {
            setSelectedVersionId(activeVersion.id);
          }
        }
      }
    } catch (err) {
      setError('バージョンの削除に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // バージョンをアクティブ化
  const activateVersion = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      // 他のバージョンを非アクティブ化
      const updatedVersions = versions.map(v => ({
        ...v,
        status: v.id === id ? 'active' as const : (v.status === 'active' ? 'archived' as const : v.status),
        updatedAt: new Date().toISOString(),
      }));

      const response = await fetch(`/api/evaluation-versions/${id}/activate`, {
        method: 'POST',
      });

      if (response.ok || true) { // APIがなくても動作
        setVersions(updatedVersions);
        setSelectedVersionId(id);
      }
    } catch (err) {
      setError('バージョンの有効化に失敗しました');
      // エラー時もローカルで有効化
      const updatedVersions = versions.map(v => ({
        ...v,
        status: v.id === id ? 'active' as const : (v.status === 'active' ? 'archived' as const : v.status),
        updatedAt: new Date().toISOString(),
      }));
      setVersions(updatedVersions);
      setSelectedVersionId(id);
    } finally {
      setLoading(false);
    }
  };

  // バージョンをアーカイブ
  const archiveVersion = async (id: string) => {
    await updateVersion(id, { status: 'archived' });
  };

  const value: EvaluationVersionContextType = {
    versions,
    currentVersion,
    selectedVersionId,
    setSelectedVersionId,
    createVersion,
    updateVersion,
    deleteVersion,
    activateVersion,
    archiveVersion,
    loading,
    error,
    canEdit,
    canDelete,
    canActivate,
  };

  return (
    <EvaluationVersionContext.Provider value={value}>
      {children}
    </EvaluationVersionContext.Provider>
  );
}

// Custom Hook
export function useEvaluationVersion() {
  const context = useContext(EvaluationVersionContext);
  if (context === undefined) {
    throw new Error('useEvaluationVersion must be used within an EvaluationVersionProvider');
  }
  return context;
}