'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { InterviewType, InterviewCategory } from '@/types/interview';

// 面談制度バージョンの型定義
export interface InterviewSystemVersion {
  id: string;
  name: string;
  version: string;
  description: string;
  status: 'active' | 'preparing' | 'testing' | 'archived';
  effectiveFrom: string;
  effectiveTo?: string;
  linkedEvaluationVersion?: string; // 評価制度バージョンとの連携

  // 面談体系の構造
  structure: {
    // 定期面談の設定
    regularInterviews: {
      newEmployee: {
        frequency: 'weekly' | 'biweekly' | 'monthly';
        duration: number; // 分
        mandatoryMonths: number; // 必須実施期間（月）
      };
      annual: {
        frequency: 'annual' | 'biannual';
        duration: number;
        targetMonths: number[]; // 実施月（例：[4, 10]）
      };
      management: {
        frequency: 'quarterly' | 'biannual';
        duration: number;
        targetMonths: number[];
      };
    };

    // 特別面談の設定
    specialInterviews: {
      returnToWork: boolean;
      incidentFollowup: boolean;
      exitInterview: boolean;
      customTypes?: string[];
    };

    // サポート面談のカテゴリ
    supportCategories: {
      career: string[];        // キャリア系のサブカテゴリ
      workplace: string[];     // 職場環境系のサブカテゴリ
      individual: string[];    // 個別相談のサブカテゴリ
    };

    // 施設別カスタマイズ許可
    facilityCustomization: {
      allowed: boolean;
      maxCustomCategories: number;
      requireApproval: boolean;
    };
  };

  // 評価連携設定
  evaluationIntegration: {
    enabled: boolean;
    autoScheduleFeedback: boolean;      // 評価後の自動面談スケジュール
    feedbackDaysAfterEvaluation: number; // 評価後何日以内に実施
    lowScoreThreshold: number;          // 低評価者への追加面談基準
    highPerformerInterval: number;      // 高評価者の面談間隔（月）
    lowPerformerInterval: number;       // 低評価者の面談間隔（月）
  };

  // 質問バンク設定
  questionBank: {
    totalQuestions: number;
    activeQuestions: number;
    customQuestions: number;
    categories: {
      category: string;
      questionCount: number;
    }[];
  };

  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

// コンテキストの型定義
interface InterviewSystemContextType {
  // バージョンデータ
  versions: InterviewSystemVersion[];
  currentVersion: InterviewSystemVersion | null;
  selectedVersionId: string;

  // 操作関数
  setSelectedVersionId: (id: string) => void;
  createVersion: (version: Omit<InterviewSystemVersion, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateVersion: (id: string, updates: Partial<InterviewSystemVersion>) => Promise<void>;
  deleteVersion: (id: string) => Promise<void>;
  activateVersion: (id: string) => Promise<void>;
  archiveVersion: (id: string) => Promise<void>;
  linkToEvaluation: (interviewVersionId: string, evaluationVersionId: string) => Promise<void>;

  // 状態管理
  loading: boolean;
  error: string | null;

  // ユーザー権限
  canEdit: boolean;
  canDelete: boolean;
  canActivate: boolean;
}

// デフォルトのバージョンデータ
const defaultVersions: InterviewSystemVersion[] = [
  {
    id: 'iv1',
    name: 'v1.0 基本面談制度',
    version: '1.0',
    description: '初期の面談制度。年1回の定期面談のみ',
    status: 'archived',
    effectiveFrom: '2021-04-01',
    effectiveTo: '2022-03-31',
    structure: {
      regularInterviews: {
        newEmployee: {
          frequency: 'monthly',
          duration: 30,
          mandatoryMonths: 3,
        },
        annual: {
          frequency: 'annual',
          duration: 60,
          targetMonths: [4],
        },
        management: {
          frequency: 'biannual',
          duration: 45,
          targetMonths: [4, 10],
        },
      },
      specialInterviews: {
        returnToWork: true,
        incidentFollowup: false,
        exitInterview: true,
      },
      supportCategories: {
        career: ['キャリア相談'],
        workplace: ['職場環境'],
        individual: ['個別相談'],
      },
      facilityCustomization: {
        allowed: false,
        maxCustomCategories: 0,
        requireApproval: true,
      },
    },
    evaluationIntegration: {
      enabled: false,
      autoScheduleFeedback: false,
      feedbackDaysAfterEvaluation: 30,
      lowScoreThreshold: 60,
      highPerformerInterval: 12,
      lowPerformerInterval: 3,
    },
    questionBank: {
      totalQuestions: 50,
      activeQuestions: 50,
      customQuestions: 0,
      categories: [],
    },
  },
  {
    id: 'iv2',
    name: 'v2.0 拡張面談制度',
    version: '2.0',
    description: 'フィードバック面談とキャリア面談を追加',
    status: 'archived',
    effectiveFrom: '2022-04-01',
    effectiveTo: '2023-03-31',
    structure: {
      regularInterviews: {
        newEmployee: {
          frequency: 'biweekly',
          duration: 45,
          mandatoryMonths: 6,
        },
        annual: {
          frequency: 'biannual',
          duration: 60,
          targetMonths: [4, 10],
        },
        management: {
          frequency: 'quarterly',
          duration: 60,
          targetMonths: [1, 4, 7, 10],
        },
      },
      specialInterviews: {
        returnToWork: true,
        incidentFollowup: true,
        exitInterview: true,
      },
      supportCategories: {
        career: ['キャリアパス', 'スキル開発'],
        workplace: ['職場環境', '人間関係'],
        individual: ['パフォーマンス', '給与・待遇'],
      },
      facilityCustomization: {
        allowed: true,
        maxCustomCategories: 3,
        requireApproval: true,
      },
    },
    evaluationIntegration: {
      enabled: true,
      autoScheduleFeedback: false,
      feedbackDaysAfterEvaluation: 30,
      lowScoreThreshold: 60,
      highPerformerInterval: 6,
      lowPerformerInterval: 3,
    },
    questionBank: {
      totalQuestions: 120,
      activeQuestions: 110,
      customQuestions: 10,
      categories: [],
    },
  },
  {
    id: 'iv3',
    name: 'v3.0 10種類体系（現行）',
    version: '3.0',
    description: '定期3種・特別3種・サポート4種の10種類体系',
    status: 'active',
    effectiveFrom: '2023-04-01',
    linkedEvaluationVersion: 'v4', // 評価制度v4.0と連携
    structure: {
      regularInterviews: {
        newEmployee: {
          frequency: 'monthly',
          duration: 30,
          mandatoryMonths: 12,
        },
        annual: {
          frequency: 'annual',
          duration: 60,
          targetMonths: [4],
        },
        management: {
          frequency: 'biannual',
          duration: 45,
          targetMonths: [4, 10],
        },
      },
      specialInterviews: {
        returnToWork: true,
        incidentFollowup: true,
        exitInterview: true,
      },
      supportCategories: {
        career: ['キャリアパス', 'スキル開発', '昇進・昇格', '異動・転勤'],
        workplace: ['職場環境', '人間関係', '業務負荷', '健康・安全'],
        individual: ['パフォーマンス', '給与・待遇', '研修・教育', 'コンプライアンス', 'その他'],
      },
      facilityCustomization: {
        allowed: true,
        maxCustomCategories: 5,
        requireApproval: false,
      },
    },
    evaluationIntegration: {
      enabled: true,
      autoScheduleFeedback: true,
      feedbackDaysAfterEvaluation: 14,
      lowScoreThreshold: 70,
      highPerformerInterval: 6,
      lowPerformerInterval: 2,
    },
    questionBank: {
      totalQuestions: 247,
      activeQuestions: 235,
      customQuestions: 32,
      categories: [
        { category: 'キャリア', questionCount: 45 },
        { category: '職場環境', questionCount: 38 },
        { category: '個別相談', questionCount: 42 },
        { category: '新入職員', questionCount: 35 },
        { category: '管理職', questionCount: 28 },
      ],
    },
  },
  {
    id: 'iv4',
    name: 'v4.0 AI支援面談（準備中）',
    version: '4.0',
    description: 'AI分析による面談推奨とスケジュール最適化',
    status: 'preparing',
    effectiveFrom: '2025-04-01',
    linkedEvaluationVersion: 'v5', // 評価制度v5.0と連携予定
    structure: {
      regularInterviews: {
        newEmployee: {
          frequency: 'weekly',
          duration: 30,
          mandatoryMonths: 3,
        },
        annual: {
          frequency: 'annual',
          duration: 45,
          targetMonths: [4],
        },
        management: {
          frequency: 'quarterly',
          duration: 60,
          targetMonths: [1, 4, 7, 10],
        },
      },
      specialInterviews: {
        returnToWork: true,
        incidentFollowup: true,
        exitInterview: true,
        customTypes: ['AI推奨面談', 'リスク予防面談'],
      },
      supportCategories: {
        career: ['キャリアパス', 'スキル開発', '昇進・昇格', '異動・転勤', 'リスキリング'],
        workplace: ['職場環境', '人間関係', '業務負荷', '健康・安全', 'リモートワーク'],
        individual: ['パフォーマンス', '給与・待遇', '研修・教育', 'コンプライアンス', 'メンタルヘルス', 'その他'],
      },
      facilityCustomization: {
        allowed: true,
        maxCustomCategories: 10,
        requireApproval: false,
      },
    },
    evaluationIntegration: {
      enabled: true,
      autoScheduleFeedback: true,
      feedbackDaysAfterEvaluation: 7,
      lowScoreThreshold: 75,
      highPerformerInterval: 12,
      lowPerformerInterval: 1,
    },
    questionBank: {
      totalQuestions: 350,
      activeQuestions: 320,
      customQuestions: 50,
      categories: [
        { category: 'キャリア', questionCount: 60 },
        { category: '職場環境', questionCount: 55 },
        { category: '個別相談', questionCount: 58 },
        { category: '新入職員', questionCount: 45 },
        { category: '管理職', questionCount: 40 },
        { category: 'AI推奨', questionCount: 30 },
      ],
    },
  },
];

// Context作成
const InterviewSystemContext = createContext<InterviewSystemContextType | undefined>(undefined);

// Provider コンポーネント
export function InterviewSystemProvider({ children }: { children: ReactNode }) {
  const [versions, setVersions] = useState<InterviewSystemVersion[]>(defaultVersions);
  const [selectedVersionId, setSelectedVersionId] = useState<string>('iv3');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 現在のバージョンを取得
  const currentVersion = versions.find(v => v.id === selectedVersionId) || null;

  // ユーザー権限（実際は認証情報から取得）
  const canEdit = true;
  const canDelete = true;
  const canActivate = true;

  // APIからバージョン情報を取得
  useEffect(() => {
    fetchVersions();
  }, []);

  const fetchVersions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/interview-system-versions');
      if (response.ok) {
        const data = await response.json();
        setVersions(data.versions || defaultVersions);
      }
    } catch (err) {
      console.error('Failed to fetch interview system versions:', err);
    } finally {
      setLoading(false);
    }
  };

  // バージョン作成
  const createVersion = async (version: Omit<InterviewSystemVersion, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const newVersion: InterviewSystemVersion = {
        ...version,
        id: `iv${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch('/api/interview-system-versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVersion),
      });

      if (response.ok || true) {
        setVersions(prev => [...prev, newVersion]);
      }
    } catch (err) {
      setError('面談制度バージョンの作成に失敗しました');
      const newVersion: InterviewSystemVersion = {
        ...version,
        id: `iv${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setVersions(prev => [...prev, newVersion]);
    } finally {
      setLoading(false);
    }
  };

  // バージョン更新
  const updateVersion = async (id: string, updates: Partial<InterviewSystemVersion>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/interview-system-versions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok || true) {
        setVersions(prev => prev.map(v =>
          v.id === id ? { ...v, ...updates, updatedAt: new Date().toISOString() } : v
        ));
      }
    } catch (err) {
      setError('バージョンの更新に失敗しました');
      setVersions(prev => prev.map(v =>
        v.id === id ? { ...v, ...updates, updatedAt: new Date().toISOString() } : v
      ));
    } finally {
      setLoading(false);
    }
  };

  // バージョン削除
  const deleteVersion = async (id: string) => {
    if (!window.confirm('この面談制度バージョンを削除してもよろしいですか？')) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/interview-system-versions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok || true) {
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
      const updatedVersions = versions.map(v => ({
        ...v,
        status: v.id === id ? 'active' as const : (v.status === 'active' ? 'archived' as const : v.status),
        updatedAt: new Date().toISOString(),
      }));

      const response = await fetch(`/api/interview-system-versions/${id}/activate`, {
        method: 'POST',
      });

      if (response.ok || true) {
        setVersions(updatedVersions);
        setSelectedVersionId(id);
      }
    } catch (err) {
      setError('バージョンの有効化に失敗しました');
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

  // 評価制度との連携
  const linkToEvaluation = async (interviewVersionId: string, evaluationVersionId: string) => {
    await updateVersion(interviewVersionId, { linkedEvaluationVersion: evaluationVersionId });
  };

  const value: InterviewSystemContextType = {
    versions,
    currentVersion,
    selectedVersionId,
    setSelectedVersionId,
    createVersion,
    updateVersion,
    deleteVersion,
    activateVersion,
    archiveVersion,
    linkToEvaluation,
    loading,
    error,
    canEdit,
    canDelete,
    canActivate,
  };

  return (
    <InterviewSystemContext.Provider value={value}>
      {children}
    </InterviewSystemContext.Provider>
  );
}

// Custom Hook
export function useInterviewSystem() {
  const context = useContext(InterviewSystemContext);
  if (context === undefined) {
    throw new Error('useInterviewSystem must be used within an InterviewSystemProvider');
  }
  return context;
}