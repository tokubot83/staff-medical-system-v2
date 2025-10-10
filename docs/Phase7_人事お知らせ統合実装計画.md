# Phase 7: 人事お知らせ統合実装計画

**作成日：2025年10月7日**
**実施予定：Phase 6完了後（共通DB構築後）**
**担当：職員カルテシステム開発チーム**

---

## 1. 概要

### 1.1 目的

VoiceDrive（法人SNS）との人事お知らせ統合機能を実装し、双方向の通知・統計管理を実現する。

### 1.2 スコープ

```
[職員カルテシステム]
  ↓ ① 人事お知らせ送信
[VoiceDrive]
  ↓ ② 職員への通知表示
  ↓ ③ アクション実行
  ↓ ④ 統計集計
  ↓ ⑤ Webhook送信（統計情報）
[職員カルテシステム]
  ↓ ⑥ 統計DB保存
  ↓ ⑦ ダッシュボード表示
```

### 1.3 成果物

| No | 成果物 | 形式 |
|----|--------|------|
| 1 | 人事お知らせ送信機能 | TypeScript Service |
| 2 | 統計受信Webhook API | Next.js API Route |
| 3 | 統計DB設計 | PostgreSQL Schema |
| 4 | 配信効果測定ダッシュボード | React Component |
| 5 | 統合テスト結果報告書 | Markdown |
| 6 | 運用手順書 | Markdown |

---

## 2. 前提条件

### 2.1 Phase 6完了項目

- ✅ 共通DB構築完了
- ✅ PostgreSQL環境構築
- ✅ 認証システム実装
- ✅ 基本API基盤構築

### 2.2 VoiceDrive側の準備

- ✅ 統計情報Webhook送信仕様書（v1.0.0）受領済み
- ✅ **お知らせ受信API実装完了**（`src/api/routes/hr-announcements.routes.ts`）
- ✅ **型定義作成完了**（`src/types/hr-announcements.ts`）
- ⏳ お知らせ送信ペイロード仕様書（作成済み、共有待ち）
- ⏳ 共有秘密鍵・APIトークン発行（Phase 7開始時）
- ⏳ テスト環境での接続確認

### 2.3 技術スタック

| レイヤー | 技術 |
|---------|------|
| フロントエンド | Next.js 14, React, TypeScript, Tailwind CSS |
| バックエンド | Next.js API Routes, TypeScript |
| データベース | PostgreSQL (Supabase) |
| 認証 | HMAC-SHA256署名検証, Bearer Token |
| 通信 | HTTPS, TLS 1.2+ |

---

## 3. 実装タスク

### 3.1 タスク一覧（約1週間）

| No | タスク名 | 工数 | 優先度 | 依存関係 |
|----|---------|------|--------|----------|
| 1 | お知らせ送信ペイロード仕様書の確認 | 0.5日 | 高 | - |
| 2 | DB設計・マイグレーション | 0.5日 | 高 | - |
| 3 | 型定義の作成 | 0.5日 | 高 | 1 |
| 4 | 人事お知らせ送信サービス実装 | 1.5日 | 高 | 1, 3 |
| 5 | 統計受信Webhook API実装 | 1日 | 高 | 2, 3 |
| 6 | 配信効果測定ダッシュボード実装 | 2日 | 中 | 2, 5 |
| 7 | 統合テスト | 1日 | 高 | 4, 5, 6 |
| 8 | ドキュメント作成 | 0.5日 | 中 | 7 |

**合計：約7.5日**

---

## 4. 詳細設計

### 4.1 DB設計

#### 4.1.1 お知らせマスタテーブル

```sql
-- 人事お知らせテーブル
CREATE TABLE hr_announcements (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'announcement' | 'interview' | 'training' | 'survey' | 'other'
  priority VARCHAR(20) NOT NULL DEFAULT 'medium', -- 'low' | 'medium' | 'high'

  -- 配信対象
  target_type VARCHAR(50) NOT NULL, -- 'all' | 'departments' | 'individuals' | 'positions'
  target_departments JSONB, -- ["看護部", "医局"]
  target_individuals JSONB, -- ["staff_001", "staff_002"]
  target_positions JSONB, -- ["主任", "師長"]

  -- アクションボタン設定
  has_action_button BOOLEAN DEFAULT false,
  action_button_type VARCHAR(50), -- 'interview_reservation' | 'survey_response' | 'training_apply'
  action_button_label VARCHAR(100),
  action_button_url VARCHAR(500),

  -- VoiceDrive連携
  voicedrive_announcement_id VARCHAR(255), -- VoiceDrive側のID
  sent_to_voicedrive BOOLEAN DEFAULT false,
  sent_to_voicedrive_at TIMESTAMP,

  -- 日時
  scheduled_publish_at TIMESTAMP,
  published_at TIMESTAMP,
  expires_at TIMESTAMP,

  -- ステータス
  status VARCHAR(50) DEFAULT 'draft', -- 'draft' | 'scheduled' | 'published' | 'expired'

  -- メタデータ
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_category (category),
  INDEX idx_status (status),
  INDEX idx_published_at (published_at),
  INDEX idx_voicedrive_id (voicedrive_announcement_id)
);
```

#### 4.1.2 統計情報テーブル

```sql
-- 統計情報テーブル
CREATE TABLE announcement_stats (
  id SERIAL PRIMARY KEY,
  announcement_id VARCHAR(255) NOT NULL REFERENCES hr_announcements(id) ON DELETE CASCADE,

  -- 基本統計
  delivered INTEGER NOT NULL DEFAULT 0,
  actions INTEGER NOT NULL DEFAULT 0, -- アクションボタンクリック数
  completions INTEGER NOT NULL DEFAULT 0, -- 完了数（アンケート送信、予約完了など）

  -- 詳細統計（オプション）
  view_count INTEGER,
  unique_viewers INTEGER,
  average_read_time INTEGER, -- 秒

  -- メタデータ
  event_type VARCHAR(50) NOT NULL, -- 'stats.updated' | 'stats.hourly' | 'stats.daily'
  received_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_announcement_id (announcement_id),
  INDEX idx_received_at (received_at),
  INDEX idx_event_type (event_type)
);

-- 部門別統計テーブル
CREATE TABLE announcement_stats_by_department (
  id SERIAL PRIMARY KEY,
  announcement_id VARCHAR(255) NOT NULL REFERENCES hr_announcements(id) ON DELETE CASCADE,
  department VARCHAR(255) NOT NULL,
  action_count INTEGER NOT NULL DEFAULT 0,
  received_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_announcement_dept (announcement_id, department),
  UNIQUE (announcement_id, department, received_at)
);
```

### 4.2 型定義

#### 4.2.1 共通インターフェース

```typescript
// mcp-shared/interfaces/hr-announcement.interface.ts

export interface HRAnnouncement {
  id: string;
  title: string;
  content: string;
  category: 'announcement' | 'interview' | 'training' | 'survey' | 'other';
  priority: 'low' | 'medium' | 'high';

  // 配信対象
  targetType: 'all' | 'departments' | 'individuals' | 'positions';
  targetDepartments?: string[];
  targetIndividuals?: string[];
  targetPositions?: string[];

  // アクションボタン
  hasActionButton: boolean;
  actionButtonType?: 'interview_reservation' | 'survey_response' | 'training_apply' | 'health_check';
  actionButtonLabel?: string;
  actionButtonUrl?: string;

  // VoiceDrive連携
  requireResponse: boolean; // VoiceDrive側では false固定
  autoTrackResponse: boolean; // 自動応答記録フラグ

  // 日時
  scheduledPublishAt?: string;
  publishedAt?: string;
  expiresAt?: string;

  // ステータス
  status: 'draft' | 'scheduled' | 'published' | 'expired';

  // メタデータ
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementStats {
  announcementId: string;
  delivered: number;
  actions: number;
  completions: number;
  viewCount?: number;
  uniqueViewers?: number;
  averageReadTime?: number;
  actionsByDepartment?: { [department: string]: number };
  eventType: 'stats.updated' | 'stats.hourly' | 'stats.daily';
  receivedAt: string;
}

export interface StatsWebhookPayload {
  event: 'stats.updated' | 'stats.hourly' | 'stats.daily';
  timestamp: string;
  announcement: {
    id: string;
    title: string;
    category: string;
    priority: string;
    publishedAt: string;
  };
  stats: {
    delivered: number;
    actions: number;
    completions: number;
    details?: {
      viewCount?: number;
      uniqueViewers?: number;
      averageReadTime?: number;
      actionsByDepartment?: { [department: string]: number };
    };
  };
  metadata: {
    source: 'voicedrive';
    version: string;
    environment: 'production' | 'staging' | 'development';
  };
}
```

### 4.3 サービス実装

#### 4.3.1 人事お知らせ送信サービス

```typescript
// src/services/hrAnnouncementService.ts

import { HRAnnouncement } from '@/mcp-shared/interfaces/hr-announcement.interface';

export class HRAnnouncementService {
  private static readonly VOICEDRIVE_API_ENDPOINT =
    process.env.VOICEDRIVE_API_ENDPOINT || 'https://api.voicedrive.example.com';

  /**
   * 人事お知らせをVoiceDriveに送信
   */
  static async sendToVoiceDrive(announcement: HRAnnouncement): Promise<boolean> {
    try {
      const payload = this.buildPayload(announcement);

      const response = await fetch(`${this.VOICEDRIVE_API_ENDPOINT}/hr-announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.VOICEDRIVE_API_TOKEN}`,
          'X-Source-System': 'medical-staff-system'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`VoiceDrive API error: ${response.status}`);
      }

      const result = await response.json();

      // VoiceDrive側のIDを記録
      await this.updateVoiceDriveId(announcement.id, result.voicedriveAnnouncementId);

      return true;

    } catch (error) {
      console.error('VoiceDrive送信エラー:', error);
      return false;
    }
  }

  /**
   * ペイロード構築
   *
   * VoiceDrive側のバリデーションルール：
   * - title: 最大500文字
   * - content: 最大5000文字
   * - requireResponse: false固定
   * - autoTrackResponse: true固定
   * - X-Source-System: 'medical-staff-system' 必須
   */
  private static buildPayload(announcement: HRAnnouncement) {
    // バリデーション
    if (announcement.title.length > 500) {
      throw new Error('タイトルは500文字以内で入力してください');
    }
    if (announcement.content.length > 5000) {
      throw new Error('本文は5000文字以内で入力してください');
    }

    return {
      title: announcement.title,
      content: announcement.content,
      category: announcement.category,
      priority: announcement.priority,
      targetType: announcement.targetType,
      targetDepartments: announcement.targetDepartments,
      targetIndividuals: announcement.targetIndividuals,
      targetPositions: announcement.targetPositions,
      hasActionButton: announcement.hasActionButton,
      actionButton: announcement.hasActionButton ? {
        type: announcement.actionButtonType,
        label: announcement.actionButtonLabel,
        url: announcement.actionButtonUrl
      } : undefined,
      requireResponse: false, // VoiceDrive側の新仕様
      autoTrackResponse: true, // 自動応答記録
      scheduledPublishAt: announcement.scheduledPublishAt,
      expiresAt: announcement.expiresAt,
      metadata: {
        sourceSystem: 'medical-staff-system',
        sourceAnnouncementId: announcement.id,
        createdBy: announcement.createdBy,
        createdAt: announcement.createdAt
      }
    };
  }

  /**
   * VoiceDrive IDを記録
   */
  private static async updateVoiceDriveId(
    announcementId: string,
    voicedriveId: string
  ): Promise<void> {
    // DB更新処理
    // await db.hrAnnouncements.update({
    //   where: { id: announcementId },
    //   data: {
    //     voicedriveAnnouncementId: voicedriveId,
    //     sentToVoicedrive: true,
    //     sentToVoicedriveAt: new Date()
    //   }
    // });
  }

  /**
   * お知らせ作成（下書き保存）
   */
  static async createAnnouncement(
    data: Omit<HRAnnouncement, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<HRAnnouncement> {
    const announcement: HRAnnouncement = {
      ...data,
      id: `ann_${Date.now()}`,
      status: 'draft',
      requireResponse: false,
      autoTrackResponse: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // DB保存
    // await db.hrAnnouncements.create({ data: announcement });

    return announcement;
  }

  /**
   * お知らせ公開
   */
  static async publishAnnouncement(announcementId: string): Promise<boolean> {
    // DB更新
    // const announcement = await db.hrAnnouncements.update({
    //   where: { id: announcementId },
    //   data: {
    //     status: 'published',
    //     publishedAt: new Date()
    //   }
    // });

    // VoiceDriveに送信
    // return await this.sendToVoiceDrive(announcement);

    return true;
  }
}
```

#### 4.3.2 統計受信Webhookサービス

```typescript
// src/app/api/voicedrive/stats/route.ts

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { StatsWebhookPayload } from '@/mcp-shared/interfaces/hr-announcement.interface';

const SHARED_SECRET = process.env.VOICEDRIVE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    // 1. 署名検証
    const body = await request.text();
    const signature = request.headers.get('X-VoiceDrive-Signature');

    if (!verifySignature(body, signature, SHARED_SECRET)) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_SIGNATURE', message: '署名が無効です' } },
        { status: 401 }
      );
    }

    // 2. JSONパース
    const payload: StatsWebhookPayload = JSON.parse(body);

    // 3. バリデーション
    if (!payload.announcement?.id || !payload.stats) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: '必須フィールドが不足しています' } },
        { status: 400 }
      );
    }

    // 4. お知らせIDの検証（当システムで管理しているIDか確認）
    const announcementExists = await checkAnnouncementExists(payload.announcement.id);
    if (!announcementExists) {
      console.warn(`Unknown announcement ID: ${payload.announcement.id}`);
      // エラーにはせず、受信は成功とする（VoiceDrive側のリトライを防ぐ）
    }

    // 5. DB保存
    await saveAnnouncementStats({
      announcementId: payload.announcement.id,
      delivered: payload.stats.delivered,
      actions: payload.stats.actions,
      completions: payload.stats.completions,
      viewCount: payload.stats.details?.viewCount,
      uniqueViewers: payload.stats.details?.uniqueViewers,
      averageReadTime: payload.stats.details?.averageReadTime,
      eventType: payload.event,
      receivedAt: new Date(payload.timestamp)
    });

    // 6. 部門別統計を保存
    if (payload.stats.details?.actionsByDepartment) {
      await saveDepartmentStats(
        payload.announcement.id,
        payload.stats.details.actionsByDepartment,
        new Date(payload.timestamp)
      );
    }

    // 7. 成功レスポンス
    return NextResponse.json({
      success: true,
      receivedAt: new Date().toISOString(),
      processed: true,
      message: '統計情報を正常に受信しました'
    });

  } catch (error) {
    console.error('Webhook処理エラー:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'サーバー内部エラー' } },
      { status: 500 }
    );
  }
}

function verifySignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

async function checkAnnouncementExists(announcementId: string): Promise<boolean> {
  // DB確認
  // const announcement = await db.hrAnnouncements.findUnique({
  //   where: { voicedriveAnnouncementId: announcementId }
  // });
  // return !!announcement;
  return true;
}

async function saveAnnouncementStats(stats: any): Promise<void> {
  // DB保存
  // await db.announcementStats.create({ data: stats });
}

async function saveDepartmentStats(
  announcementId: string,
  departmentStats: { [department: string]: number },
  receivedAt: Date
): Promise<void> {
  // DB保存
  // for (const [department, count] of Object.entries(departmentStats)) {
  //   await db.announcementStatsByDepartment.upsert({
  //     where: {
  //       announcement_department_received: {
  //         announcementId,
  //         department,
  //         receivedAt
  //       }
  //     },
  //     update: { actionCount: count },
  //     create: {
  //       announcementId,
  //       department,
  //       actionCount: count,
  //       receivedAt
  //     }
  //   });
  // }
}
```

### 4.4 ダッシュボード実装

```typescript
// src/app/admin/hr-announcements/stats/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, LineChart, PieChart } from '@/components/charts';

export default function AnnouncementStatsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    // const res = await fetch('/api/hr-announcements');
    // const data = await res.json();
    // setAnnouncements(data);
  };

  const fetchStats = async (announcementId: string) => {
    // const res = await fetch(`/api/hr-announcements/${announcementId}/stats`);
    // const data = await res.json();
    // setStats(data);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">人事お知らせ配信効果測定</h1>

      {/* サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>総配信数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,234</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>アクション率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">68.5%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>完了率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">52.3%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>平均閲覧時間</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">48秒</div>
          </CardContent>
        </Card>
      </div>

      {/* 時系列グラフ */}
      <Card>
        <CardHeader>
          <CardTitle>アクション数推移</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <LineChart data={statsTimeSeries} /> */}
        </CardContent>
      </Card>

      {/* 部門別統計 */}
      <Card>
        <CardHeader>
          <CardTitle>部門別アクション数</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <BarChart data={departmentStats} /> */}
        </CardContent>
      </Card>

      {/* カテゴリ別統計 */}
      <Card>
        <CardHeader>
          <CardTitle>カテゴリ別配信効果</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <PieChart data={categoryStats} /> */}
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 5. テスト計画

### 5.1 単体テスト

| テスト項目 | テスト内容 | 期待結果 |
|-----------|-----------|---------|
| お知らせ作成 | `HRAnnouncementService.createAnnouncement()` | DBに保存される |
| VoiceDrive送信 | `HRAnnouncementService.sendToVoiceDrive()` | 200 OK |
| 署名検証（正常） | 正しい署名でWebhook送信 | 200 OK |
| 署名検証（異常） | 不正な署名でWebhook送信 | 401 Unauthorized |
| バリデーション | 必須フィールド欠損 | 400 Bad Request |
| 統計保存 | Webhook受信後のDB確認 | 統計データが保存される |

### 5.2 統合テスト

#### テストシナリオ1: お知らせ送信〜統計受信

```
1. 職員カルテ: お知らせ作成
2. 職員カルテ: VoiceDriveへ送信
3. VoiceDrive: お知らせ表示（手動確認）
4. VoiceDrive: アクションボタンクリック（手動）
5. VoiceDrive: Webhook送信
6. 職員カルテ: 統計受信・DB保存
7. 職員カルテ: ダッシュボード表示確認
```

#### テストシナリオ2: 署名検証

```
1. VoiceDrive: 正しい署名でWebhook送信
   → 期待: 200 OK

2. VoiceDrive: 不正な署名でWebhook送信
   → 期待: 401 Unauthorized

3. VoiceDrive: 署名なしでWebhook送信
   → 期待: 401 Unauthorized
```

### 5.3 テスト環境

```bash
# ngrokでローカル公開
ngrok http 3000

# Webhook URL（VoiceDrive側に設定）
https://xxxx.ngrok.io/api/voicedrive/stats

# 環境変数
VOICEDRIVE_WEBHOOK_SECRET=test_secret_key_12345
VOICEDRIVE_API_TOKEN=test_api_token_67890
VOICEDRIVE_API_ENDPOINT=https://staging-api.voicedrive.example.com
```

---

## 6. セキュリティ対策

### 6.1 認証・認可

- ✅ Bearer Token認証
- ✅ HMAC-SHA256署名検証
- ✅ IPホワイトリスト（本番環境）
- ✅ HTTPS必須（TLS 1.2+）

### 6.2 データ保護

- ✅ 環境変数で秘密鍵管理
- ✅ `.env.local` を `.gitignore` に追加
- ✅ 本番環境ではVercel Environment Variablesを使用

### 6.3 レート制限

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: /* Redis接続 */,
  limiter: Ratelimit.slidingWindow(100, '1 m') // 100リクエスト/分
});

export async function middleware(request: Request) {
  if (request.url.includes('/api/voicedrive/stats')) {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: 'Too Many Requests' },
        { status: 429 }
      );
    }
  }

  return NextResponse.next();
}
```

---

## 7. 運用計画

### 7.1 モニタリング

**監視項目**：
- Webhook成功率（目標: 99%以上）
- 平均レスポンス時間（目標: 500ms以下）
- エラー率（目標: 1%以下）
- リトライ回数

**アラート設定**：
```yaml
alerts:
  - name: webhook_failure_rate_high
    condition: error_rate > 5%
    duration: 5分
    action: Slack通知

  - name: webhook_response_time_slow
    condition: avg_response_time > 3秒
    duration: 10分
    action: メール通知
```

### 7.2 ログ管理

```typescript
// src/lib/logger.ts
export function logWebhookEvent(event: {
  type: 'received' | 'processed' | 'error';
  announcementId: string;
  eventType: string;
  error?: string;
}) {
  console.log({
    timestamp: new Date().toISOString(),
    service: 'voicedrive-webhook',
    ...event
  });
}
```

### 7.3 バックアップ

- 日次バックアップ（PostgreSQL）
- 統計データの保持期間: 2年

---

## 8. リリース計画

### 8.1 リリース手順

```bash
# 1. DB マイグレーション
npm run db:migrate

# 2. 環境変数設定（Vercel）
vercel env add VOICEDRIVE_WEBHOOK_SECRET
vercel env add VOICEDRIVE_API_TOKEN
vercel env add VOICEDRIVE_API_ENDPOINT

# 3. デプロイ
vercel --prod

# 4. VoiceDrive側にWebhook URL通知
# https://staff-chart.vercel.app/api/voicedrive/stats

# 5. 統合テスト実施
npm run test:integration

# 6. 本番環境で動作確認
```

### 8.2 ロールバック手順

```bash
# 1. 前バージョンにロールバック
vercel rollback

# 2. DBマイグレーションの巻き戻し
npm run db:rollback

# 3. VoiceDriveチームに通知
```

---

## 9. 成功基準

| 指標 | 目標 |
|------|------|
| **統合テスト成功率** | 100% |
| **Webhook受信成功率** | 99%以上 |
| **平均レスポンス時間** | 500ms以下 |
| **エラー率** | 1%以下 |
| **ダッシュボード表示速度** | 3秒以内 |

---

## 10. リスク管理

| リスク | 発生確率 | 影響度 | 対策 |
|-------|---------|-------|------|
| VoiceDrive仕様変更 | 中 | 高 | バージョニングで対応 |
| Webhook受信失敗 | 低 | 中 | リトライ機構、エラー通知 |
| DB負荷増大 | 低 | 中 | インデックス最適化、キャッシュ導入 |
| 秘密鍵漏洩 | 低 | 高 | 定期的なローテーション |

---

## 11. 次のフェーズ

Phase 8以降の拡張予定：
- ページビュートラッキング
- A/Bテスト機能
- AIによる配信最適化
- リアルタイム通知

---

## 12. 参考資料

### 12.1 仕様書

- `mcp-shared/specs/voicedrive-stats-webhook-spec-v1.0.0.md` - 統計Webhook送信仕様
- `mcp-shared/docs/Response_VoiceDrive_Stats_Webhook_Spec_20251007.md` - 当チームからの返信
- VoiceDrive統合ドキュメント（VoiceDriveチーム提供、受領待ち）

### 12.2 VoiceDrive側の実装コード（参考）

VoiceDriveチームから以下の実装コードを受領しました：

**お知らせ受信APIルート**：
```typescript
// VoiceDrive側: src/api/routes/hr-announcements.routes.ts
// 職員カルテシステムからのお知らせを受信するExpressルート

重要なポイント：
1. エンドポイント: POST /api/hr-announcements
2. 必須ヘッダー:
   - Authorization: Bearer <token>
   - X-Source-System: medical-staff-system
3. バリデーション:
   - title: 最大500文字
   - content: 最大5000文字
   - requireResponse: false固定
   - autoTrackResponse: true固定
4. レスポンス:
   - voicedriveAnnouncementId
   - estimatedDelivery（配信予定数）
   - targetedUsers（部門別配信数）
```

このコードから読み取った仕様を、本計画の実装に反映しています。

### 12.3 型定義

- `mcp-shared/interfaces/hr-announcement-api.interface.ts` - API通信用型定義
- `mcp-shared/interfaces/hr-announcement.interface.ts` - 内部用型定義（Phase 7で作成）

---

**承認**

| 役割 | 氏名 | 承認日 |
|------|------|-------|
| プロジェクトマネージャー | | |
| 技術リード | | |
| QAリード | | |

---

**作成者：職員カルテシステム開発チーム**
**最終更新：2025年10月7日**
