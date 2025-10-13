# ProjectParticipationRecommendation 医療システム確認結果

**文書番号**: MEDICAL-CONFIRMATION-2025-1013-003
**作成日**: 2025年10月13日
**作成者**: 医療職員管理システムチーム
**対象ページ**: https://voicedrive-v100.vercel.app/project-participation-recommendation
**対象ファイル**: `C:\projects\voicedrive-v100\src\pages\ProjectParticipationRecommendationPage.tsx`
**参照ドキュメント**:
- [project-participation-recommendation暫定マスターリスト_20251012.md](./project-participation-recommendation暫定マスターリスト_20251012.md)（VoiceDriveチーム作成）

---

## 📋 確認結果サマリー

### 🎯 システム構成の確認

**ProjectParticipationRecommendationページは医療システムとVoiceDriveの連携が必要**

```
VoiceDrive側で実装:
- プロジェクト参加統計テーブル（100%）
- プロジェクト多様性分析テーブル（100%）
- スキルサマリキャッシュテーブル（100%）
- マッチングロジック・推奨機能（100%）

医療システム側で実装:
- ✅ SkillMaster、EmployeeSkillテーブル（既存実装予定 - DB構築計画書記載済み）
- 🔴 スキルサマリAPI（新規実装必要）
- 🔴 職員スキル詳細API（新規実装必要）
- 🟡 職員スキル更新Webhook（推奨）
```

### 🎉 良いニュース

**必要なテーブルはDB構築計画書に既に記載されています！**

- ✅ **SkillMaster**テーブル - DB構築計画書Section 15記載済み
- ✅ **EmployeeSkill**テーブル - DB構築計画書Section 15記載済み
- ✅ **SkillRadarAssessment**テーブル - DB構築計画書Section 15記載済み

### ⚠️ 必要な追加実装

**新規API実装が必要（2件）**:
- 🔴 **GET /api/v2/skills/summary** - スキルサマリ取得API（新規）
- 🔴 **GET /api/v2/employees/{employeeId}/skills** - 職員スキル詳細API（新規）
- 🟡 **Webhook: employee.skill.updated** - スキル更新通知（推奨）

---

## 📐 既存計画書との整合性評価

### ✅ データ管理責任分界点定義書との整合性

**結論**: ✅ **完全に整合している**

| データ項目 | VoiceDrive | 医療システム | 提供方法 |
|-----------|-----------|-------------|---------|
| **スキルマスタ** | キャッシュ | ✅ マスタ | **API提供**（新規） |
| **職員スキル評価** | キャッシュ | ✅ マスタ | **API提供**（新規） |
| **プロジェクト管理** | ✅ マスタ | ❌ 管轄外 | VoiceDrive側で管理 |
| **参加統計** | ✅ マスタ | ❌ 管轄外 | VoiceDrive側で管理 |
| **多様性分析** | ✅ マスタ | ❌ 管轄外 | VoiceDrive側で管理 |
| **推奨ロジック** | ✅ マスタ | ❌ 管轄外 | VoiceDrive側で管理 |

**原則に沿った設計**:
- ✅ Single Source of Truth: スキル評価は医療システムが真実の情報源
- ✅ API連携: 新規APIで連携（既存テーブルから）
- ✅ 最小重複: VoiceDrive側はキャッシュのみ（表示・分析用）
- ✅ 明確な境界: プロジェクト推奨はVoiceDrive管轄

### ✅ DB構築計画書前準備との整合性

**結論**: ✅ **完全整合（スキル関連テーブルは既に記載済み）**

既存の[DB構築計画書前準備_不足項目整理_20251008.md](../../docs/DB構築計画書前準備_不足項目整理_20251008.md)の **Section 15** に以下が記載されています：

#### ✅ 既に記載されているテーブル

**1. SkillMaster（スキルマスタ）**
```prisma
model SkillMaster {
  id                String    @id @default(cuid())
  skillCode         String    @unique @map("skill_code")
  skillName         String    @map("skill_name")
  skillCategory     String    @map("skill_category")  // 専門スキル、マネジメント、IT、教育等
  description       String?   @db.Text
  // ... 省略
}
```

**2. EmployeeSkill（職員スキル評価）**
```prisma
model EmployeeSkill {
  id                    String    @id @default(cuid())
  employeeId            String    @map("employee_id")
  skillId               String    @map("skill_id")
  level                 Int       @map("level")  // 1-5
  selfAssessment        Int?      @map("self_assessment")
  supervisorAssessment  Int?      @map("supervisor_assessment")
  lastAssessedDate      DateTime? @map("last_assessed_date")
  // ... 省略
}
```

**3. SkillRadarAssessment（スキルレーダー評価）**
```prisma
model SkillRadarAssessment {
  id              String    @id @default(cuid())
  employeeId      String    @map("employee_id")
  assessmentDate  DateTime  @map("assessment_date")
  // 8軸評価
  // ... 省略
}
```

**影響**: ✅ **テーブル追加不要（既存テーブルから集計）**

理由：
- スキル関連テーブルはDB構築計画書に既に記載
- 新規テーブル追加ではなく、既存テーブルからAPIで提供
- DB構築計画書への追加は**不要**

### 🔴 必要な追加実装

**新規API実装のみが必要**:
1. GET /api/v2/skills/summary（新規）
2. GET /api/v2/employees/{employeeId}/skills（新規）

これらは既存テーブルから集計するAPIなので、DBスキーマ変更は不要です。

---

## 🔍 詳細確認結果

### 1. API提供状況の確認

#### 🔴 API-1: スキルサマリ取得API（新規実装必要）

**VoiceDriveチームの要求**:
```
GET /api/v2/skills/summary
```

**実装状況**: ❌ **未実装（新規実装必要）**

**データソース**:
- ✅ `SkillMaster`テーブル（DB構築計画書Section 15記載済み）
- ✅ `EmployeeSkill`テーブル（DB構築計画書Section 15記載済み）

**期待されるレスポンス形式**:
```json
{
  "skills": [
    {
      "skillId": "SK001",
      "skillName": "システム・IT",
      "category": "専門スキル",
      "totalStaff": 42,
      "staffByLevel": {
        "expert": 8,       // レベル5（エキスパート）
        "advanced": 15,    // レベル4
        "intermediate": 12, // レベル3
        "basic": 7         // レベル1-2
      },
      "averageLevel": 3.2,
      "lastUpdated": "2025-10-13T10:00:00Z"
    }
  ],
  "totalSkills": 25,
  "timestamp": "2025-10-13T10:00:00Z"
}
```

**実装方法**:
```typescript
// src/app/api/v2/skills/summary/route.ts（新規作成）

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // 全スキルマスタを取得
    const skillsMaster = await prisma.skillMaster.findMany({
      select: {
        id: true,
        skillCode: true,
        skillName: true,
        skillCategory: true
      }
    });

    // 各スキルの保有者数とレベル分布を集計
    const skillsWithStats = await Promise.all(
      skillsMaster.map(async (skill) => {
        // スキル保有者のレベル分布を集計
        const skillStats = await prisma.employeeSkill.groupBy({
          by: ['level'],
          where: { skillId: skill.id },
          _count: true
        });

        // レベル別カウント
        const staffByLevel = {
          expert: skillStats.find(s => s.level === 5)?._count || 0,
          advanced: skillStats.find(s => s.level === 4)?._count || 0,
          intermediate: skillStats.find(s => s.level === 3)?._count || 0,
          basic: (skillStats.find(s => s.level === 1)?._count || 0) +
                 (skillStats.find(s => s.level === 2)?._count || 0)
        };

        const totalStaff = Object.values(staffByLevel).reduce((sum, count) => sum + count, 0);

        // 平均レベル計算
        const allLevels = await prisma.employeeSkill.findMany({
          where: { skillId: skill.id },
          select: { level: true }
        });
        const averageLevel = totalStaff > 0
          ? allLevels.reduce((sum, s) => sum + s.level, 0) / totalStaff
          : 0;

        return {
          skillId: skill.skillCode,
          skillName: skill.skillName,
          category: skill.skillCategory,
          totalStaff,
          staffByLevel,
          averageLevel: Math.round(averageLevel * 10) / 10,
          lastUpdated: new Date().toISOString()
        };
      })
    );

    return NextResponse.json({
      skills: skillsWithStats,
      totalSkills: skillsWithStats.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[API] Skills summary error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills summary' },
      { status: 500 }
    );
  }
}
```

**推定工数**: 0.5日（4時間）
**優先度**: 🔴 最高
**依存関係**: SkillMaster、EmployeeSkillテーブル作成後

---

#### 🔴 API-2: 職員スキル詳細取得API（新規実装必要）

**VoiceDriveチームの要求**:
```
GET /api/v2/employees/{employeeId}/skills
```

**実装状況**: ❌ **未実装（新規実装必要）**

**データソース**:
- ✅ `EmployeeSkill`テーブル（DB構築計画書Section 15記載済み）
- ✅ `SkillMaster`テーブル（DB構築計画書Section 15記載済み）
- ✅ `Certification`テーブル（DB構築計画書Section 1記載済み）

**期待されるレスポンス形式**:
```json
{
  "employeeId": "EMP2024001",
  "skills": [
    {
      "skillId": "SK001",
      "skillName": "システム・IT",
      "skillCategory": "専門スキル",
      "level": 4,
      "levelName": "上級",
      "selfAssessment": 4,
      "supervisorAssessment": 4,
      "acquiredDate": "2023-04-01",
      "lastAssessedDate": "2024-09-01",
      "certifications": [
        {
          "certificationName": "ITパスポート",
          "issuedDate": "2023-03-15"
        }
      ]
    }
  ],
  "totalSkills": 8,
  "averageLevel": 3.4,
  "lastUpdated": "2024-09-01T15:30:00Z"
}
```

**実装方法**:
```typescript
// src/app/api/v2/employees/[employeeId]/skills/route.ts（新規作成）

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const LEVEL_NAMES = {
  1: '初級',
  2: '初級-中級',
  3: '中級',
  4: '上級',
  5: 'エキスパート'
};

export async function GET(
  request: NextRequest,
  { params }: { params: { employeeId: string } }
) {
  const { employeeId } = params;

  try {
    // 職員のスキル評価を取得
    const employeeSkills = await prisma.employeeSkill.findMany({
      where: { employeeId },
      include: {
        skill: {
          select: {
            skillCode: true,
            skillName: true,
            skillCategory: true
          }
        }
      },
      orderBy: { level: 'desc' }
    });

    // 関連資格を取得
    const certifications = await prisma.certification.findMany({
      where: { employeeId },
      select: {
        certificationType: true,
        obtainedDate: true
      }
    });

    // スキルごとに資格をマッピング（スキル名と資格名の関連付け）
    const skillsWithCertifications = employeeSkills.map(skill => ({
      skillId: skill.skill.skillCode,
      skillName: skill.skill.skillName,
      skillCategory: skill.skill.skillCategory,
      level: skill.level,
      levelName: LEVEL_NAMES[skill.level] || '不明',
      selfAssessment: skill.selfAssessment,
      supervisorAssessment: skill.supervisorAssessment,
      acquiredDate: skill.acquiredDate?.toISOString().split('T')[0] || null,
      lastAssessedDate: skill.lastAssessedDate?.toISOString().split('T')[0] || null,
      certifications: certifications
        .filter(cert => cert.certificationType.includes(skill.skill.skillName))
        .map(cert => ({
          certificationName: cert.certificationType,
          issuedDate: cert.obtainedDate?.toISOString().split('T')[0] || null
        }))
    }));

    // 平均レベル計算
    const averageLevel = employeeSkills.length > 0
      ? employeeSkills.reduce((sum, s) => sum + s.level, 0) / employeeSkills.length
      : 0;

    // 最終更新日
    const lastUpdated = employeeSkills.reduce((latest, skill) => {
      const assessedDate = skill.lastAssessedDate;
      return assessedDate && (!latest || assessedDate > latest) ? assessedDate : latest;
    }, null as Date | null);

    return NextResponse.json({
      employeeId,
      skills: skillsWithCertifications,
      totalSkills: employeeSkills.length,
      averageLevel: Math.round(averageLevel * 10) / 10,
      lastUpdated: lastUpdated?.toISOString() || new Date().toISOString()
    });

  } catch (error) {
    console.error(`[API] Employee skills error (${employeeId}):`, error);
    return NextResponse.json(
      { error: 'Failed to fetch employee skills' },
      { status: 500 }
    );
  }
}
```

**推定工数**: 0.5日（4時間）
**優先度**: 🔴 最高
**依存関係**: EmployeeSkill、SkillMaster、Certificationテーブル作成後

---

#### 🟡 Webhook-1: 職員スキル更新通知（推奨実装）

**VoiceDriveチームの要求**:
```
POST https://voicedrive.ai/api/webhooks/employee-skill-updated
```

**実装状況**: ❌ **未実装（推奨）**

**トリガー**:
- `EmployeeSkill`テーブル更新時（新規スキル取得、レベル変更）
- `Certification`テーブル更新時（新規資格取得）
- スキル評価実施時（V3評価、スキルレーダー評価）

**ペイロード例**:
```json
{
  "eventType": "employee.skill.updated",
  "timestamp": "2025-10-13T15:30:00Z",
  "employeeId": "EMP2024001",
  "changes": {
    "skillId": "SK001",
    "skillName": "システム・IT",
    "previousLevel": 3,
    "newLevel": 4,
    "assessmentDate": "2025-10-10",
    "assessor": "MGR001"
  },
  "signature": "abc123..."  // HMAC-SHA256署名
}
```

**実装方法**:
```typescript
// src/services/webhooks/EmployeeSkillWebhookService.ts（新規作成）

import crypto from 'crypto';

export async function notifyEmployeeSkillUpdated(
  employeeId: string,
  skillId: string,
  previousLevel: number,
  newLevel: number
) {
  const payload = {
    eventType: 'employee.skill.updated',
    timestamp: new Date().toISOString(),
    employeeId,
    changes: {
      skillId,
      previousLevel,
      newLevel,
      assessmentDate: new Date().toISOString().split('T')[0]
    }
  };

  // HMAC-SHA256署名
  const signature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET!)
    .update(JSON.stringify(payload))
    .digest('hex');

  // VoiceDriveに送信
  try {
    await fetch(process.env.VOICEDRIVE_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature
      },
      body: JSON.stringify({ ...payload, signature })
    });
    console.log(`[Webhook] Skill updated notification sent: ${employeeId}`);
  } catch (error) {
    console.error('[Webhook] Failed to send skill update:', error);
    // リトライロジックを実装（推奨）
  }
}
```

**推奨送信頻度**:
- **Option A**: リアルタイム送信（スキル更新時に即座）
- **Option B**: バッチ送信（日次で前日のスキル更新をまとめて送信） ← **推奨**

**推定工数**: 0.5日（4時間）
**優先度**: 🟡 中（リアルタイム性が不要ならOption B推奨）
**依存関係**: VoiceDriveのWebhook受信エンドポイント実装後

---

### 2. 確認事項への回答

#### 確認-1: SkillMasterとEmployeeSkillテーブルの確認

**質問**:
> DB構築計画書には以下のテーブルが記載されていると認識していますが、確認させてください：
>
> 1. `SkillMaster`テーブルは確実に実装予定ですか？
> 2. `EmployeeSkill`テーブル（職員のスキル評価）は確実に実装予定ですか？
> 3. 以下のフィールドは含まれますか？

**回答**: ✅ **全て実装予定（DB構築計画書Section 15記載済み）**

| 項目 | 状態 | 備考 |
|------|------|------|
| SkillMasterテーブル | ✅ 実装予定 | DB構築計画書Section 15記載 |
| EmployeeSkillテーブル | ✅ 実装予定 | DB構築計画書Section 15記載 |
| 必要フィールド | ✅ 全て含まれる | skillId, skillName, category, level (1-5), selfAssessment, supervisorAssessment, lastAssessedDate |
| API-1実装 | ✅ 実装可能 | 推定工数: 0.5日 |
| API-2実装 | ✅ 実装可能 | 推定工数: 0.5日 |

---

#### 確認-2: スキルデータ更新頻度とWebhook送信方式

**質問**:
> Webhook-1（職員スキル更新通知）について：
>
> 1. リアルタイム送信 vs バッチ送信のどちらを希望しますか？
> 2. VoiceDrive側では**日次バッチ**を推奨

**回答**: ✅ **Option B: 日次バッチ（毎日午前2時）を推奨**

**理由**:
- スキル評価は頻繁に変更されない（年2回の定期評価が主）
- リアルタイム送信は負荷が高い
- VoiceDrive側のキャッシュ更新も日次で十分
- マッチングスコアの再計算も日次で問題なし

**実装方法**:
```typescript
// src/jobs/sendDailySkillUpdates.ts（新規作成）

import cron from 'node-cron';

// 毎日午前2:00に前日のスキル更新をまとめて送信
cron.schedule('0 2 * * *', async () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 前日更新されたスキル評価を取得
  const updatedSkills = await prisma.employeeSkill.findMany({
    where: {
      updatedAt: { gte: yesterday, lt: today }
    },
    include: { skill: true }
  });

  console.log(`[Batch] Sending ${updatedSkills.length} skill updates to VoiceDrive`);

  // バッチでWebhook送信
  for (const skill of updatedSkills) {
    await notifyEmployeeSkillUpdated(
      skill.employeeId,
      skill.skillId,
      skill.previousLevel || 0,
      skill.level
    );
  }

  console.log('[Batch] Skill updates sent successfully');
});
```

---

#### 確認-3: スキル評価のレベル定義

**質問**:
> スキル評価のレベル（1-5）の定義を確認させてください

**回答**: ✅ **定義を確認・調整**

| レベル | 名称 | 定義 | 使用例 |
|--------|------|------|--------|
| 1 | 初級 | 基本的な知識を持っている | 研修を受けた程度 |
| 2 | 初級-中級 | 基本業務を上司の指導下で実行可能 | OJTで経験あり |
| 3 | 中級 | 独力で業務を遂行可能 | 通常業務を一人で担当 |
| 4 | 上級 | 他者への指導が可能 | チームリーダー、教育担当 |
| 5 | エキスパート | 組織の第一人者、専門家 | 施設・法人のエキスパート |

**スキルカテゴリ一覧**（DB構築計画書Section 15より）:
- 専門スキル（医療・介護専門知識）
- マネジメント（リーダーシップ、チーム運営）
- IT・システム
- 教育・研修
- コミュニケーション
- 問題解決
- その他

---

## 📊 医療システム側の対応状況

### ✅ 対応完了（実装予定 - DB構築計画書記載済み）

1. **SkillMasterテーブル**
   - 状態: ✅ DB構築計画書Section 15記載
   - 実装: DB構築Week 5-6で実装予定

2. **EmployeeSkillテーブル**
   - 状態: ✅ DB構築計画書Section 15記載
   - 実装: DB構築Week 5-6で実装予定

3. **Certificationテーブル**
   - 状態: ✅ DB構築計画書Section 1記載
   - 実装: DB構築Week 3-4で実装予定

### 🔴 新規実装必要

| 項目 | 内容 | 推定工数 | 優先度 | 実装時期 |
|------|------|---------|--------|---------|
| **API-1** | スキルサマリ取得API | 0.5日 | 🔴 最高 | DB構築Week 6完了後 |
| **API-2** | 職員スキル詳細API | 0.5日 | 🔴 最高 | DB構築Week 6完了後 |
| **Webhook-1** | スキル更新通知（日次バッチ） | 0.5日 | 🟡 中 | DB構築Week 7 |
| **集計バッチ** | スキルサマリ集計（API-1用） | 0.3日 | 🔴 最高 | DB構築Week 6完了後 |

**合計推定工数**: 1.8日（約14時間）

---

## 🎯 VoiceDriveチームへの推奨事項

### 1. 既存API利用方法（新規API）

#### 1-A. スキルサマリAPI（マッチング分析用）

```typescript
// VoiceDrive: src/services/MedicalSystemClient.ts

export async function fetchSkillsSummary(): Promise<SkillSummary[]> {
  const response = await fetch(
    `${MEDICAL_SYSTEM_API_BASE}/api/v2/skills/summary`,
    {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'X-API-Key': process.env.MEDICAL_SYSTEM_API_KEY
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Skills summary API failed: ${response.status}`);
  }

  const data = await response.json();
  return data.skills;
}

// 日次バッチでキャッシュ更新
async function syncSkillDataFromMedicalSystem() {
  const skillsData = await fetchSkillsSummary();

  for (const skill of skillsData) {
    // SkillSummaryCacheに保存
    await prisma.skillSummaryCache.upsert({
      where: { skillId: skill.skillId },
      create: {
        skillId: skill.skillId,
        skillName: skill.skillName,
        skillCategory: skill.category,
        totalStaff: skill.totalStaff,
        expertCount: skill.staffByLevel.expert,
        advancedCount: skill.staffByLevel.advanced,
        intermediateCount: skill.staffByLevel.intermediate,
        basicCount: skill.staffByLevel.basic,
        averageLevel: skill.averageLevel,
        lastSyncedAt: new Date()
      },
      update: {
        skillName: skill.skillName,
        totalStaff: skill.totalStaff,
        expertCount: skill.staffByLevel.expert,
        advancedCount: skill.staffByLevel.advanced,
        intermediateCount: skill.staffByLevel.intermediate,
        basicCount: skill.staffByLevel.basic,
        averageLevel: skill.averageLevel,
        lastSyncedAt: new Date()
      }
    });
  }

  console.log('[Sync] Skill data synchronized from medical system');
}
```

---

#### 1-B. 職員スキル詳細API（マッチングスコア計算用）

```typescript
// VoiceDrive: src/services/ProjectMatchingService.ts

export async function fetchEmployeeSkills(employeeId: string): Promise<EmployeeSkill[]> {
  // Redisキャッシュチェック
  const cached = await redis.get(`employee:${employeeId}:skills`);
  if (cached) return JSON.parse(cached);

  // 医療システムAPIから取得
  const response = await fetch(
    `${MEDICAL_SYSTEM_API_BASE}/api/v2/employees/${employeeId}/skills`,
    {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'X-API-Key': process.env.MEDICAL_SYSTEM_API_KEY
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Employee skills API failed: ${response.status}`);
  }

  const data = await response.json();

  // 1時間キャッシュ
  await redis.setex(
    `employee:${employeeId}:skills`,
    3600,
    JSON.stringify(data.skills)
  );

  return data.skills;
}

// マッチングスコア計算で使用
export async function calculateMatchScore(
  userId: string,
  projectId: string
): Promise<{ score: number; reasons: string[] }> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const project = await prisma.post.findUnique({ where: { id: projectId } });

  const reasons: string[] = [];
  let score = 0;

  // スキルマッチ（30点）
  const userSkills = await fetchEmployeeSkills(user.employeeId);  // 医療システムAPIから取得
  const requiredSkills = project.requiredSkills as any[];

  if (requiredSkills && userSkills) {
    const matchingSkills = requiredSkills.filter(req =>
      userSkills.some(skill => skill.skillId === req.skillId && skill.level >= req.minLevel)
    );
    if (matchingSkills.length > 0) {
      score += 30;
      reasons.push(`必要スキル保有: ${matchingSkills.map(s => s.skillName).join(', ')}`);
    }
  }

  // 職種マッチ（25点）
  // 部署マッチ（20点）
  // 経験年数マッチ（15点）
  // 関連投稿履歴（10点）
  // ... 省略

  return { score, reasons };
}
```

---

### 2. Webhook受信エンドポイント実装

```typescript
// VoiceDrive: src/app/api/webhooks/employee-skill-updated/route.ts

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const signature = request.headers.get('x-webhook-signature');

    // 署名検証
    const expectedSignature = crypto
      .createHmac('sha256', process.env.WEBHOOK_SECRET!)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const { employeeId, changes } = payload;

    // SkillSummaryCacheを更新
    await updateSkillSummaryCache(changes.skillId);

    // Redisキャッシュを無効化
    await redis.del(`employee:${employeeId}:skills`);

    // マッチングスコアを再計算（影響を受けるプロジェクト推奨）
    await recalculateMatchingScores(employeeId);

    console.log(`[Webhook] Skill updated: ${employeeId}, skill: ${changes.skillName}`);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[Webhook] Employee skill update error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function updateSkillSummaryCache(skillId: string) {
  // 医療システムAPIから最新のスキルサマリを取得して更新
  const skillsData = await fetchSkillsSummary();
  const skill = skillsData.find(s => s.skillId === skillId);

  if (skill) {
    await prisma.skillSummaryCache.upsert({
      where: { skillId },
      create: { /* ... */ },
      update: { /* ... */ }
    });
  }
}
```

---

### 3. キャッシュ戦略の推奨

**スキルサマリキャッシュ**:
```typescript
// 医療システムから取得したスキルデータを24時間キャッシュ
await prisma.skillSummaryCache.upsert({
  where: { skillId },
  create: { /* ... */ },
  update: {
    lastSyncedAt: new Date()  // 24時間キャッシュ
  }
});
```

**職員スキルキャッシュ**:
```typescript
// 職員個別のスキル情報は1時間キャッシュ（Redisで）
await redis.setex(
  `employee:${employeeId}:skills`,
  3600,  // 1時間
  JSON.stringify(skills)
);
```

**理由**:
- スキル評価は頻繁に変更されない
- マッチングスコア計算で大量のAPI呼び出しが発生する可能性
- キャッシュにより医療システムへの負荷を軽減

---

## ✅ 確認完了チェックリスト

### 医療システム側
- [x] SkillMaster、EmployeeSkillテーブル実装予定確認（DB構築計画書記載済み）
- [x] スキル評価レベル定義確認
- [x] スキルカテゴリ一覧確認
- [ ] **API-1実装**: GET /api/v2/skills/summary（推定工数: 0.5日）
- [ ] **API-2実装**: GET /api/v2/employees/{employeeId}/skills（推定工数: 0.5日）
- [ ] **Webhook-1実装（推奨）**: スキル更新通知（日次バッチ、推定工数: 0.5日）
- [ ] スキルデータ集計バッチ実装
- [ ] テスト環境でのAPI動作確認

### VoiceDriveチーム側（推奨アクション）

#### Phase 1: 基本統計機能（3-4日）
- [ ] StaffProjectParticipationStatsテーブル追加
- [ ] User.experienceYears追加（PersonalStationと共通）
- [ ] 参加統計集計バッチ実装
- [ ] 推奨ロジック実装（基本版）
- [ ] 参加率が低い職員タブの実装

#### Phase 2: スキルマッチング機能（3-4日）
- [ ] SkillSummaryCacheテーブル追加
- [ ] Post.requiredSkills, projectComplexity追加
- [ ] スキル同期バッチ実装（API-1呼び出し）
- [ ] マッチングスコア計算サービス実装（API-2呼び出し）
- [ ] スキルマッチングタブの実装

#### Phase 3: 多様性分析機能（2-3日）
- [ ] ProjectDiversityAnalysisテーブル追加
- [ ] 多様性スコア計算サービス実装
- [ ] 多様性分析バッチ実装
- [ ] チーム多様性向上タブの実装

#### Phase 4: 推奨履歴・効果測定（1-2日）
- [ ] ProjectRecommendationLogテーブル追加
- [ ] 推奨送信機能実装
- [ ] Webhook受信エンドポイント実装（Webhook-1用）
- [ ] 効果測定ダッシュボード実装

---

## 📞 次のステップ

### 医療システムチーム
1. ✅ 確認結果をVoiceDriveチームに共有
2. ⏳ DB構築Week 5-6でSkillMaster、EmployeeSkillテーブル実装
3. ⏳ DB構築Week 6完了後、API-1、API-2実装（推定工数: 1日）
4. ⏳ DB構築Week 7でWebhook-1実装（推奨、推定工数: 0.5日）
5. ⏳ VoiceDriveチームと統合テスト（API動作確認）

### VoiceDriveチーム
1. Phase 1実装開始（基本統計機能）
2. 医療システムAPI実装完了後、Phase 2実装（スキルマッチング機能）
3. Phase 3実装（多様性分析機能）
4. 統合テスト実施
5. （オプション）Phase 4実装（推奨履歴・効果測定）

---

## 📝 参考資料

### 医療システム実装予定テーブル
- SkillMasterテーブル - DB構築計画書Section 15記載
- EmployeeSkillテーブル - DB構築計画書Section 15記載
- Certificationテーブル - DB構築計画書Section 1記載

### 今回作成ドキュメント
- [project-participation-recommendation_医療システム確認結果_20251013.md](./project-participation-recommendation_医療システム確認結果_20251013.md)（今回作成）

### VoiceDrive側作成ドキュメント（受領）
- [project-participation-recommendation暫定マスターリスト_20251012.md](./project-participation-recommendation暫定マスターリスト_20251012.md)

### 整合性評価対象ドキュメント
- [データ管理責任分界点定義書_20251008.md](./データ管理責任分界点定義書_20251008.md)
- [DB構築計画書前準備_不足項目整理_20251008.md](../../docs/DB構築計画書前準備_不足項目整理_20251008.md)

### 関連ページ確認結果
- [PersonalStation_医療システム確認結果_20251008.md](./PersonalStation_医療システム確認結果_20251008.md)
- [project-org-development_医療システム確認結果_20251013.md](./project-org-development_医療システム確認結果_20251013.md)

---

## 💡 VoiceDriveチームへのメッセージ

### 実装の容易性

ProjectParticipationRecommendationページは、以下の理由で実装できると考えています：

1. **必要なテーブルは既にDB構築計画書に記載済み**: SkillMaster、EmployeeSkillテーブルはSection 15で既に設計済み
2. **新規API実装のみが必要**: 既存テーブルから集計するだけなので、DBスキーマ変更は不要
3. **PersonalStationと同様のパターン**: 職員情報キャッシュ、API連携のパターンが確立済み
4. **段階的実装が可能**: Phase 1 → Phase 2 → Phase 3と段階的に進められる

### 推奨スケジュール

| Phase | 期間 | 内容 | 依存関係 |
|-------|-----|------|---------|
| **医療システム側** | - | - | - |
| DB構築Week 5-6 | 2週間 | SkillMaster、EmployeeSkillテーブル実装 | DB構築計画書に従う |
| DB構築Week 6完了後 | 1日 | API-1、API-2実装 | SkillMaster、EmployeeSkill完成後 |
| DB構築Week 7 | 0.5日 | Webhook-1実装（推奨） | API実装後 |
| **VoiceDrive側** | - | - | - |
| Phase 1 | 3-4日 | 基本統計機能 | なし |
| Phase 2 | 3-4日 | スキルマッチング機能 | 医療システムAPI実装後 |
| Phase 3 | 2-3日 | 多様性分析機能 | Phase 2完了後 |
| Phase 4（オプション） | 1-2日 | 推奨履歴・効果測定 | Phase 3完了後 |

### サポート体制

医療システムチームは以下のサポートを提供します：

- ✅ スキルテーブル設計の確認（DB構築計画書Section 15参照）
- ✅ API実装（推定工数: 1-1.5日）
- ✅ 既存API利用方法の質問対応（随時）
- ✅ 統合テスト協力（API実装完了後）

---

**文書終了**

**作成者**: 医療職員管理システムチーム
**作成日**: 2025年10月13日
**最終更新**: 2025年10月13日
**バージョン**: 1.0
**次回レビュー**: VoiceDriveチームからのフィードバック受領後、DB構築Week 5-6完了後
