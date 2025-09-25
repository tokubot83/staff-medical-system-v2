# VoiceDrive × 職員カルテシステム 連携実装返答書

**作成日**: 2025年9月25日
**作成者**: 医療チーム 職員カルテシステム開発担当
**宛先**: VoiceDrive開発チーム 徳留様

## 1. はじめに

貴チームからの「VoiceDrive × 職員カルテシステム 連携実装依頼書」を拝見いたしました。18段階権限レベル体系の導入と両システムの連携について、前向きに対応させていただきます。以下、技術的な実装方針と具体的な提案をお示しします。

## 2. 基本方針への合意

提案いただいた18段階権限レベル体系について、以下の点で合意いたします：

- 職員の経験・役職に応じた細かな権限管理の必要性
- 看護職のリーダー業務を考慮した0.5段階の導入
- 施設ごとの組織実態に即した柔軟な運用

これらの実現に向けて、職員カルテシステム側で必要な機能を実装いたします。

## 3. 実装提案

### 3.1 看護職リーダー業務フラグの管理方法

ご相談いただいた看護職のリーダー業務フラグについて、以下の実装を提案します：

```typescript
interface LeaderDutyManagement {
  staffId: string;
  canPerformLeaderDuty: boolean;
  approvedBy: string;              // 承認した師長のID
  approvedAt: Date;                 // 承認日時
  nextReviewDate: Date;             // 次回レビュー日（3ヶ月後）
  history: LeaderDutyChange[];      // 変更履歴
  notes?: string;                   // 承認理由・特記事項
}

interface LeaderDutyChange {
  changedAt: Date;
  changedBy: string;
  previousStatus: boolean;
  newStatus: boolean;
  reason: string;
}
```

**運用フロー：**
1. 師長による3ヶ月ごとの定期レビュー（システムがリマインド通知）
2. 必要に応じた随時更新（インシデント発生時、スキル向上時等）
3. 変更履歴の完全記録による透明性確保

### 3.2 兼務職員の権限レベル決定ロジック

兼務職員については、コンテキストに応じた権限付与を実装します：

```typescript
class ContextAwareAccountLevelCalculator {

  calculateEffectiveLevel(
    staff: StaffData,
    context?: {
      department?: string;      // 現在の行動部署
      actingAs?: string;        // どの立場での行動か
      purpose?: string;         // 投票、提案、閲覧等の目的
    }
  ): number {

    // コンテキストが指定されている場合
    if (context?.department) {
      const positionInDept = this.getPositionInDepartment(
        staff.staffId,
        context.department
      );
      return this.calculateLevelForPosition(positionInDept);
    }

    // 兼務の全ポジションから最高権限を採用（デフォルト）
    const allLevels = [
      this.calculateLevelForPosition(staff.position),
      ...staff.additionalPositions.map(pos =>
        this.calculateLevelForPosition(pos.position)
      )
    ];

    return Math.max(...allLevels);
  }

  // VoiceDrive向けAPI
  getStaffLevelForVoting(staffId: string, topicDepartment?: string): number {
    const staff = await this.getStaffData(staffId);
    return this.calculateEffectiveLevel(staff, {
      department: topicDepartment,
      purpose: 'voting'
    });
  }
}
```

### 3.3 データ同期アーキテクチャ

**同期方式の組み合わせ：**

| データ種別 | 同期方式 | 頻度 | 備考 |
|------------|----------|------|------|
| 基本情報（氏名、部署等） | バッチ同期 | 15分間隔 | 通常運用 |
| 権限レベル変更 | リアルタイム | 即時 | WebSocket通知 |
| 組織マスター | バッチ同期 | 1日1回 | 深夜実行 |
| 緊急変更 | プッシュ通知 | 即時 | 人事異動等 |

**キャッシュ戦略：**
```typescript
interface CacheStrategy {
  staffDataCache: {
    ttl: 300,        // 5分（秒）
    storage: 'Redis'
  },
  organizationCache: {
    ttl: 3600,       // 1時間（秒）
    storage: 'Redis'
  },
  accountLevelCache: {
    ttl: 600,        // 10分（秒）
    storage: 'Memory + Redis'  // 2層キャッシュ
  }
}
```

### 3.4 エラー処理とFallback機構

```typescript
class RobustAccountLevelService {

  async getStaffLevel(staffId: string): Promise<{
    level: number;
    source: 'realtime' | 'cache' | 'fallback';
    confidence: number;  // 0-100%
  }> {
    try {
      // 1. リアルタイム計算を試行
      const level = await this.calculateAccountLevel(staffId);
      return { level, source: 'realtime', confidence: 100 };

    } catch (primaryError) {
      this.logger.warn(`Primary calculation failed: ${primaryError}`);

      try {
        // 2. キャッシュからの取得を試行
        const cached = await this.getCachedLevel(staffId);
        if (cached && this.isCacheValid(cached)) {
          return {
            level: cached.level,
            source: 'cache',
            confidence: this.calculateCacheConfidence(cached)
          };
        }
      } catch (cacheError) {
        this.logger.warn(`Cache retrieval failed: ${cacheError}`);
      }

      // 3. 最終的なfallback（安全側に倒す）
      const fallbackLevel = await this.getFallbackLevel(staffId);
      return {
        level: fallbackLevel || 1,  // 最低権限
        source: 'fallback',
        confidence: 30
      };
    }
  }

  private calculateCacheConfidence(cached: CachedLevel): number {
    const ageInHours = (Date.now() - cached.timestamp) / 3600000;
    if (ageInHours < 1) return 90;
    if (ageInHours < 24) return 70;
    return 50;
  }
}
```

## 4. 実装スケジュール（修正案）

貴チームご提案のスケジュールを基に、以下の調整を提案いたします：

| フェーズ | 期間 | 医療チーム側作業 | VoiceDrive側作業 | 成果物 |
|----------|------|------------------|------------------|---------|
| **Phase 0** | 2025年9月第4週 | 仕様詳細確認・疑問点解消 | 同左 | 最終仕様書 |
| **Phase 1** | 2025年10月第1週 | DBスキーマ設計・API仕様確定 | 権限システム基盤実装 | API仕様書v1.0 |
| **Phase 2** | 2025年10月第2週 | アカウントレベル計算ロジック実装 | 投票システム改修 | 単体テスト完了 |
| **Phase 3** | 2025年10月第3週 | API開発・リーダー業務管理機能 | 議題提出フロー実装 | 結合テスト開始 |
| **Phase 4** | 2025年10月第4週 | マスターデータ登録画面・同期機能 | UI/UX更新 | α版リリース |
| **Phase 5** | 2025年11月第1週 | 小原病院限定テスト | 同左 | 問題点リスト |
| **Phase 6** | 2025年11月第2週 | 改修・最終調整 | 同左 | β版リリース |
| **Phase 7** | 2025年11月第3週 | 全施設展開準備 | 同左 | 本番移行計画 |
| **Go-Live** | 2025年11月第4週 | 本番稼働・サポート | 同左 | 運用開始 |

## 5. 追加提案事項

### 5.1 段階的導入アプローチ

リスク軽減のため、以下の段階的導入を提案します：

1. **第1段階**：小原病院のみで1ヶ月試験運用
2. **第2段階**：問題点改修後、立神リハビリテーション温泉病院へ展開
3. **第3段階**：全施設展開

### 5.2 モニタリングダッシュボード

両チームで以下の指標を共有監視：

```typescript
interface SystemHealthMetrics {
  syncStatus: {
    lastSuccessfulSync: Date;
    failedSyncCount: number;
    averageSyncTime: number;  // ミリ秒
  };
  dataIntegrity: {
    mismatchedLevels: number;
    orphanedRecords: number;
    validationErrors: number;
  };
  performance: {
    apiResponseTime: number;   // 95パーセンタイル
    cacheHitRate: number;       // パーセント
    errorRate: number;          // 直近1時間
  };
}
```

### 5.3 セキュリティ強化策

```typescript
interface SecurityMeasures {
  encryption: {
    atRest: 'AES-256',
    inTransit: 'TLS 1.3'
  };
  authentication: {
    method: 'JWT with refresh tokens',
    tokenLifetime: 3600,  // 1時間
    refreshTokenLifetime: 604800  // 7日
  };
  authorization: {
    apiKeyRotation: 'monthly',
    ipWhitelisting: true,
    rateLimiting: {
      requestsPerMinute: 100,
      burstSize: 20
    }
  };
  audit: {
    logAllDataAccess: true,
    retentionDays: 90,
    realTimeAlerts: ['unauthorized_access', 'bulk_export']
  };
}
```

## 6. 必要なリソースと体制

### 医療チーム側

- **開発メンバー**：2名（フルタイム1名、サポート1名）
- **インフラ**：
  - MCPサーバーの拡張（CPU、メモリ増強）
  - Redis導入（キャッシュ用）
  - 監視ツール（Datadog or CloudWatch）

### 共同作業

- **定例会議**：週2回（月・木 10:00-11:00）
- **コミュニケーション**：専用Slackチャンネル
- **ドキュメント共有**：MCPサーバー経由

## 7. リスクと対策

| リスク | 影響度 | 発生確率 | 対策 |
|--------|--------|----------|------|
| データ同期の遅延 | 高 | 中 | キャッシュ強化、非同期処理 |
| 権限レベル誤算出 | 高 | 低 | 充分なテスト、監査ログ |
| システム負荷増大 | 中 | 中 | 段階的導入、性能監視 |
| 仕様変更要求 | 中 | 高 | アジャイル開発、週次レビュー |

## 8. 合意事項と次のアクション

### 合意を求める事項

1. 上記実装方針への基本合意
2. 修正スケジュールの承認
3. 段階的導入アプローチの採用
4. リソース配分と体制

### 次のアクション（9月第4週）

1. **技術仕様レビュー会議**（9/26 or 9/27）
2. **API仕様書の詳細すり合わせ**
3. **開発環境の相互接続テスト**
4. **Phase 0キックオフミーティング**

## 9. おわりに

VoiceDriveと職員カルテシステムの連携により、真に職員の声が組織改善につながるシステムが実現できると確信しています。技術的な課題はありますが、段階的かつ着実なアプローチで、確実に実装を進めてまいります。

ご不明な点、追加のご要望がございましたら、お気軽にお問い合わせください。共に素晴らしいシステムを構築できることを楽しみにしております。

---

**連絡先**
医療チーム 職員カルテシステム開発担当
[連絡先情報]

**添付予定資料**
- API仕様書（OpenAPI 3.0形式）ドラフト
- データベーススキーマ設計案
- セキュリティ実装ガイドライン
- テスト計画書テンプレート