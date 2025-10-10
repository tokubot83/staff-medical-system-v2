# 健康ステーション統合実装 - 回答書

**文書番号**: MS-RESPONSE-HEALTHSTATION-2025-1010-001
**作成日**: 2025年10月10日
**作成者**: 医療職員管理システムチーム
**宛先**: VoiceDriveチーム
**件名**: 健康ステーション統合実装に関する確認事項への回答

---

## 📢 エグゼクティブサマリー

VoiceDriveチームからの健康ステーション統合実装に関する15項目の確認事項に回答します。

### 重要な決定事項

✅ **ファイルベース連携を承認**
- JSONファイル配置方式で問題なし
- 医療システム側の開発工数: **0日**
- 医療システム側の開発費用: **¥0**

✅ **通知データ形式を承認**
- 4種類の通知タイプで十分
- リスクレベル判定は医療システム側で実施
- 検査値の生データは医療システム側で保持

✅ **運用方針を決定**
- 通知配信頻度: 月次（毎月1日 02:00 JST）
- 処理済みファイルはVoiceDrive側で削除
- 5秒遅延は許容範囲内

---

## 📋 確認事項への回答

### 技術的確認（5項目）

---

#### 確認-1: ファイル配置方式

**質問**: `c:\projects\voicedrive-v100\mcp-shared\notifications\` フォルダへのファイル配置方式で問題ありませんか？

**回答**: ✅ **問題ありません**

**理由**:
- `mcp-shared/` フォルダは両システムで共有されているため、アクセス権限の問題なし
- 医療システム側でファイルコピーのバッチ処理を実装済み
- ファイルベース連携により、API開発・Webhook実装が不要

**実装方針**:
```bash
# 医療システム側のバッチ処理（月次実行）
copy health_notifications\*.json c:\projects\voicedrive-v100\mcp-shared\notifications\
```

---

#### 確認-2: ファイル命名規則

**質問**: `health_notif_{employeeId}_{timestamp}.json` の形式で問題ありませんか？

**回答**: ✅ **問題ありません**

**命名例**:
```
health_notif_OH-NS-2024-001_20251101020000.json
health_notif_TR-NS-2024-015_20251101020001.json
health_notif_OH-DR-2024-003_20251101020002.json
```

**タイムスタンプ形式**: `YYYYMMDDHHmmss`（ISO 8601の簡易版）

**理由**:
- employeeIdが含まれるため、職員の特定が容易
- タイムスタンプにより、通知の順序が保証される
- ファイル名の一意性が確保される

---

#### 確認-3: 通知タイプ

**質問**: 4種類の通知タイプ（health_risk_assessment, health_checkup_result, stress_check_result, reexamination_required）で十分ですか？

**回答**: ✅ **十分です**

**通知タイプの使い分け**:

| 通知タイプ | 使用ケース | 配信タイミング | 優先度 |
|-----------|-----------|--------------|--------|
| `health_risk_assessment` | 総合健康リスク評価完了時 | 年1回（定期健診後） | medium～high |
| `health_checkup_result` | 定期健康診断結果確定時 | 年1回（9月実施） | low～medium |
| `stress_check_result` | ストレスチェック完了時 | 年1回（11月実施） | medium～high |
| `reexamination_required` | 要再検査判定時 | 随時（判定後即座） | high～urgent |

**追加の通知タイプは不要**:
- 4種類で医療法で定められた健康管理項目をカバー
- 将来的に追加が必要な場合は、`metadata.version` を更新して対応

---

#### 確認-4: リスクレベル判定

**質問**: 医療システム側でリスクレベル判定（overallScore, overallLevel）を行い、VoiceDriveは受信するだけで問題ありませんか？

**回答**: ✅ **問題ありません（推奨）**

**理由**:
1. **医療専門性**: リスクレベル判定には医療知識が必要
2. **データソース**: 医療システムが全ての検査データを保持
3. **責任分界**: 医療判断は医療システム側の責任
4. **シンプルな連携**: VoiceDriveは表示・通知のみに専念

**医療システム側の判定ロジック**:
```typescript
// 医療システム側の実装例
function calculateOverallScore(healthData: HealthData): number {
  // BMI、血圧、血糖値、脂質、肝機能などを総合評価
  const bmiScore = calculateBMIScore(healthData.bmi);
  const bloodPressureScore = calculateBloodPressureScore(healthData.bloodPressure);
  const glucoseScore = calculateGlucoseScore(healthData.bloodGlucose);
  const lipidScore = calculateLipidScore(healthData.ldl, healthData.hdl, healthData.triglycerides);
  const liverScore = calculateLiverScore(healthData.ast, healthData.alt, healthData.gammaGtp);

  // 重み付け平均
  return (
    bmiScore * 0.2 +
    bloodPressureScore * 0.25 +
    glucoseScore * 0.2 +
    lipidScore * 0.2 +
    liverScore * 0.15
  );
}

function determineRiskLevel(overallScore: number): RiskLevel {
  if (overallScore <= 39) return 'very-high';
  if (overallScore <= 59) return 'high';
  if (overallScore <= 79) return 'medium';
  return 'low';
}
```

**VoiceDrive側の役割**:
- 受信した `overallScore` と `overallLevel` をそのまま表示
- 優先度判定（`overallLevel` → `priority`）
- 通知・アクション実行

---

#### 確認-5: 健康診断データ

**質問**: 検査値の生データ（BMI、血圧、コレステロール等）はVoiceDriveに保存する必要がありますか？それとも医療システム側で保持し、VoiceDriveには評価結果のみ送信しますか？

**回答**: ⚠️ **医療システム側で保持、VoiceDriveには評価結果のみ送信（推奨）**

**理由**:

| 項目 | 医療システム | VoiceDrive |
|------|-------------|-----------|
| **データ保持** | ✅ 全検査値を保持 | ❌ 評価結果のみ受信 |
| **責任** | 医療データ管理責任 | 表示・通知のみ |
| **セキュリティ** | 医療情報保護法準拠 | 評価結果のみで低リスク |
| **データ量** | 大量の検査データ | 軽量な評価結果 |

**送信するデータ（推奨）**:
```json
{
  "type": "health_risk_assessment",
  "staffId": "OH-NS-2024-001",
  "assessment": {
    "overallScore": 65,
    "overallLevel": "medium",
    "highRiskCategories": [
      {
        "category": "代謝リスク",
        "score": 55,
        "level": "high"
      }
    ],
    "priorityActions": [
      "食事改善指導を受けてください"
    ],
    "nextCheckup": "2026-04-09T00:00:00Z"
  },
  "recommendations": {
    "lifestyle": ["規則正しい生活習慣"],
    "diet": ["塩分控えめ"],
    "exercise": ["週3回30分の有酸素運動"],
    "medicalFollowUp": ["3ヶ月後に再検査"]
  }
}
```

**送信しないデータ**:
```json
// ❌ VoiceDriveには送信しない
{
  "rawData": {
    "height": 165.5,
    "weight": 68.2,
    "bmi": 24.9,
    "bloodPressureSystolic": 135,
    "bloodPressureDiastolic": 88,
    "ldlCholesterol": 145,
    "hdlCholesterol": 48,
    "triglycerides": 180,
    "bloodGlucose": 110,
    "hba1c": 6.1,
    "ast": 28,
    "alt": 35,
    "gammaGtp": 45
  }
}
```

**例外**: 職員本人が詳細データを確認したい場合は、医療システムへのリンクを提供（VoiceDriveは保存しない）

---

### 運用的確認（5項目）

---

#### 確認-6: 通知配信頻度

**質問**: 健康通知はどのくらいの頻度で配信されますか？（日次/週次/月次/随時）

**回答**: ⚠️ **月次 + 随時（要再検査のみ）**

**通知配信スケジュール**:

| 通知タイプ | 配信頻度 | 配信タイミング | 対象職員数 |
|-----------|---------|--------------|-----------|
| `health_risk_assessment` | 年1回 | 10月1日 02:00 JST | 全職員（約300名） |
| `health_checkup_result` | 年1回 | 10月1日 02:00 JST | 全職員（約300名） |
| `stress_check_result` | 年1回 | 12月1日 02:00 JST | 全職員（約300名） |
| `reexamination_required` | 随時 | 判定後即座（営業時間内） | 該当者のみ（約10-20名/年） |

**月次バッチ処理（10月1日 02:00 JST）**:
```bash
# 医療システム側のバッチ処理
# 1. 全職員の健康リスク評価を実行
node scripts/health-risk-assessment.js --all

# 2. JSON通知ファイルを生成
node scripts/generate-health-notifications.js --month 202510

# 3. VoiceDrive共有フォルダにコピー
copy health_notifications\202510\*.json c:\projects\voicedrive-v100\mcp-shared\notifications\

# 4. 処理ログを記録
echo "健康通知配信完了: $(date)" >> logs/health-notification-delivery.log
```

**処理時間見積もり**:
- 職員300名 × 1通知あたり0.5秒 = 約2.5分
- ファイルコピー: 約10秒
- 合計: 約3分

**VoiceDrive側の処理**:
- 5秒ポーリングで自動検知
- 新規ファイル約300件を順次処理
- 処理完了まで約25分（300件 × 5秒）

---

#### 確認-7: ファイル削除

**質問**: 処理済み通知ファイルはVoiceDrive側で削除して良いですか？それとも医療システム側で管理しますか？

**回答**: ✅ **VoiceDrive側で削除して良い**

**削除方針**:

| 段階 | タイミング | 実行者 | アクション |
|------|-----------|--------|-----------|
| **1. 処理完了** | 通知処理完了直後 | VoiceDrive | ファイル削除 |
| **2. バックアップ** | 削除前 | VoiceDrive | ログに記録（JSON内容） |
| **3. 医療システム側** | 月次バッチ後 | 医療システム | 元ファイルは `health_notifications/archive/` に移動 |

**VoiceDrive側の実装**:
```typescript
// healthNotificationHandler.ts
async processNotification(filename: string): Promise<void> {
  const filePath = path.join(this.notificationsPath, filename);

  try {
    // 1. ファイル読み込み
    const content = fs.readFileSync(filePath, 'utf-8');
    const notification = JSON.parse(content);

    // 2. データベース保存
    await this.saveToDatabase(notification);

    // 3. ログに記録（バックアップ）
    this.logger.info('通知処理完了', {
      filename,
      staffId: notification.staffId,
      type: notification.type,
      content: JSON.stringify(notification)
    });

    // 4. ファイル削除
    fs.unlinkSync(filePath);
    this.logger.info('通知ファイル削除', { filename });

  } catch (error) {
    this.logger.error('通知処理失敗', { filename, error });
    // エラーの場合はファイルを残す
  }
}
```

**医療システム側のアーカイブ**:
```bash
# 月次バッチ処理後、元ファイルをアーカイブ
mkdir -p health_notifications/archive/202510
move health_notifications\202510\*.json health_notifications\archive\202510\
```

**保存期間**:
- 医療システム: 5年間（医療法準拠）
- VoiceDrive: 3年間（データベース内）

---

#### 確認-8: 通知遅延

**質問**: ファイル配置からVoiceDriveでの表示まで最大5秒の遅延が発生しますが、問題ありませんか？

**回答**: ✅ **問題ありません**

**理由**:

| 通知タイプ | リアルタイム性の要求 | 5秒遅延の影響 |
|-----------|-------------------|-------------|
| `health_risk_assessment` | 低（年1回配信） | 影響なし |
| `health_checkup_result` | 低（年1回配信） | 影響なし |
| `stress_check_result` | 低（年1回配信） | 影響なし |
| `reexamination_required` | 中（随時配信） | 許容範囲内 |

**実際の遅延時間**:
```
医療システム（ファイル配置）
  ↓ 0-5秒（ポーリング待機）
VoiceDrive（ファイル検知）
  ↓ 1-2秒（ファイル安定性確認）
VoiceDrive（JSONパース・処理）
  ↓ 0.5秒（データベース保存）
VoiceDrive（HealthStation表示）

合計: 最大7.5秒
```

**月次配信の場合**:
- 配信タイミング: 10月1日 02:00 JST（深夜）
- 職員の確認タイミング: 10月1日 09:00以降（出勤後）
- 実質的な遅延: 感じられない

**要再検査通知の場合**:
- 配信タイミング: 判定後即座（営業時間内）
- 遅延: 最大7.5秒
- 影響: 産業医面談・精密検査の予約に影響なし（数日の余裕あり）

---

#### 確認-9: 緊急通知

**質問**: `urgent` 優先度の通知の場合、5秒ポーリングでは遅すぎますか？リアルタイム通知（Webhook方式）が必要ですか？

**回答**: ⚠️ **5秒ポーリングで十分（Webhook不要）**

**理由**:

1. **緊急性の定義**:
   - `urgent` = 要緊急対応（2週間以内に医療機関受診）
   - 生命の危険が迫っている状況ではない
   - 5秒遅延は医療対応に影響しない

2. **通知頻度**:
   - `urgent` 優先度の通知は年間10-20件程度（全職員の3-7%）
   - ほとんどの場合は月次配信タイミングで送信

3. **実運用**:
   - 職員が通知を確認するのは出勤後（9:00以降）
   - 5秒遅延は実質的に感じられない

**Webhook方式との比較**:

| 項目 | ファイルベース | Webhook方式 |
|------|--------------|------------|
| **遅延時間** | 最大7.5秒 | 1秒未満 |
| **医療システム開発** | 0日（¥0） | 5日（¥400,000） |
| **VoiceDrive開発** | 21日 | 25日 |
| **運用負荷** | 低 | 中（エラーハンドリング必要） |
| **障害時の影響** | 最小（ファイル再配置で復旧） | 大（再送処理が複雑） |

**結論**: ファイルベース連携で十分、Webhook方式は不要

**将来的な検討事項**:
- 真に緊急な医療状況（例: 急性症状）が発生した場合は、別システム（救急対応システム）で対応
- 健康ステーションは予防・早期発見のためのシステムであり、緊急医療対応は対象外

---

#### 確認-10: バックアップ

**質問**: 健康通知データのバックアップ体制はどちら側で管理しますか？

**回答**: ⚠️ **両システムで分担管理（二重バックアップ）**

**バックアップ責任分界**:

| データ種別 | 医療システム | VoiceDrive |
|-----------|-------------|-----------|
| **健康診断生データ** | ✅ 完全バックアップ（5年間） | ❌ 保持しない |
| **リスク評価結果** | ✅ アーカイブ（5年間） | ✅ データベースバックアップ（3年間） |
| **通知配信ログ** | ✅ 配信履歴（5年間） | ✅ 処理ログ（3年間） |
| **職員の既読状態** | ❌ 管理しない | ✅ データベースバックアップ（3年間） |

**医療システム側のバックアップ**:
```
health_notifications/
  ├── archive/
  │   ├── 202510/        # 2025年10月配信分
  │   │   ├── health_notif_OH-NS-2024-001_20251001020000.json
  │   │   ├── health_notif_OH-NS-2024-002_20251001020001.json
  │   │   └── ...
  │   ├── 202511/        # 2025年11月配信分
  │   └── ...
  └── backup/
      ├── 2025-10-01_health_notifications.tar.gz
      ├── 2025-11-01_health_notifications.tar.gz
      └── ...
```

**VoiceDrive側のバックアップ**:
```sql
-- データベースバックアップ（日次）
-- HealthNotificationテーブル
SELECT * FROM HealthNotification WHERE createdAt >= '2025-10-01';

-- HealthNotificationProcessLogテーブル
SELECT * FROM HealthNotificationProcessLog WHERE processedAt >= '2025-10-01';

-- HealthNotificationReadStatusテーブル
SELECT * FROM HealthNotificationReadStatus WHERE createdAt >= '2025-10-01';
```

**バックアップスケジュール**:

| システム | 頻度 | 保存先 | 保存期間 |
|---------|------|--------|---------|
| **医療システム** | 月次 | `health_notifications/archive/` | 5年 |
| **医療システム** | 月次 | `health_notifications/backup/` (tar.gz) | 5年 |
| **VoiceDrive** | 日次 | SQLiteバックアップ | 3年 |
| **VoiceDrive** | 週次 | 外部ストレージ（AWS S3等） | 3年 |

**災害復旧（DR）**:
- 医療システム: オンプレミスサーバー + 外部バックアップ
- VoiceDrive: SQLite + AWS S3バックアップ
- 両システムで独立したバックアップにより、一方が障害でも復旧可能

---

### データ連携確認（5項目）

---

#### 確認-11: 職員ID同期

**質問**: employeeIdは医療システムとVoiceDriveで完全一致していますか？（例: `OH-NS-2024-001` 形式）

**回答**: ✅ **完全一致しています**

**職員ID形式**:
```
{施設コード}-{職種コード}-{採用年}-{連番}

例:
OH-NS-2024-001   小原病院、看護師、2024年採用、001番
TR-NS-2024-015   立神病院、看護師、2024年採用、015番
OH-DR-2024-003   小原病院、医師、2024年採用、003番
```

**施設コード**:
- `OH`: 小原病院（Obara Hospital）
- `TR`: 立神リハビリテーション温泉病院（Tategami Rehabilitation）

**職種コード**:
- `NS`: 看護師（Nurse）
- `DR`: 医師（Doctor）
- `PT`: 理学療法士（Physical Therapist）
- `OT`: 作業療法士（Occupational Therapist）
- `ST`: 言語聴覚士（Speech Therapist）
- `AD`: 事務職員（Administrative staff）

**同期確認方法**:
```typescript
// VoiceDrive側での職員ID検証
async validateEmployeeId(employeeId: string): Promise<boolean> {
  // 医療システムから受信したemployeeIdがVoiceDriveに存在するか確認
  const employee = await prisma.user.findUnique({
    where: { employeeId }
  });

  if (!employee) {
    this.logger.warn('職員IDが見つかりません', { employeeId });
    return false;
  }

  return true;
}
```

**不一致が発生した場合**:
- VoiceDrive側で警告ログを記録
- 管理者に通知
- 手動で職員IDマッピングを修正

**職員ID同期の維持**:
- 新規職員登録時: 医療システムで採番 → VoiceDriveに自動同期（既存のWebhook使用）
- 退職時: 医療システムで退職処理 → VoiceDriveに自動同期（既存のWebhook使用）

---

#### 確認-12: 通知形式変更

**質問**: 将来的に通知データ形式が変更される可能性はありますか？バージョン管理（metadata.version）で対応可能ですか？

**回答**: ⚠️ **変更の可能性あり（バージョン管理で対応）**

**バージョン管理戦略**:

| バージョン | リリース予定 | 変更内容 |
|-----------|------------|---------|
| **1.0.0** | 2025年10月 | 初版（4種類の通知タイプ） |
| **1.1.0** | 2026年4月（予定） | 健康診断項目追加（血液検査項目拡充） |
| **2.0.0** | 2027年4月（予定） | メンタルヘルス評価追加 |

**バージョン管理フィールド**:
```json
{
  "metadata": {
    "source": "staff-medical-system",
    "version": "1.0.0",
    "priority": "medium"
  }
}
```

**VoiceDrive側の対応**:
```typescript
// healthNotificationHandler.ts
async processNotification(notification: HealthNotification): Promise<void> {
  const version = notification.metadata?.version || '1.0.0';

  switch (version) {
    case '1.0.0':
      return this.processV1(notification);
    case '1.1.0':
      return this.processV1_1(notification);
    case '2.0.0':
      return this.processV2(notification);
    default:
      this.logger.warn('未対応のバージョン', { version });
      return this.processV1(notification); // フォールバック
  }
}
```

**後方互換性の保証**:
- マイナーバージョンアップ（1.0.0 → 1.1.0）: 既存フィールドは変更せず、新規フィールド追加のみ
- メジャーバージョンアップ（1.x.x → 2.0.0）: フィールド構造変更あり、移行期間3ヶ月

**バージョンアップ通知**:
- 医療システムチームがVoiceDriveチームに3ヶ月前に通知
- VoiceDrive側で新バージョン対応を実装
- 移行期間中は両バージョン並行稼働

---

#### 確認-13: 再検査フォロー

**質問**: 要再検査通知後、職員が再検査を受けたかどうかをVoiceDriveから医療システムに通知する必要はありますか？

**回答**: ⚠️ **Phase 4で実装予定（Webhook方式）**

**現状の運用（Phase 1-3）**:
- VoiceDrive → 医療システムへの通知: **なし**
- 再検査受診状況の確認: 医療システム側で管理
- 職員の既読状態: VoiceDrive内部で管理（医療システムには通知しない）

**Phase 4実装予定（2026年4月以降）**:

#### WH-HS-VD-1: POST /webhook/health-notification-action（健康通知アクション通知）

**目的**: 職員が健康通知に対してアクションを実行したことを医療システムに通知

**送信タイミング**:
- 職員が「再検査予約済み」ボタンをクリック
- 職員が「産業医面談予約済み」ボタンをクリック
- 職員が「健康改善計画作成」ボタンをクリック

**Webhookペイロード**:
```json
{
  "eventType": "health_notification_action",
  "timestamp": "2025-10-10T10:00:00Z",
  "staffId": "OH-NS-2024-001",
  "notificationId": "health_notif_OH-NS-2024-001_20251001020000",
  "notificationType": "reexamination_required",
  "action": {
    "actionType": "reexamination_scheduled",
    "actionDate": "2025-10-10T10:00:00Z",
    "notes": "循環器内科を予約しました（10月15日 14:00）",
    "scheduledDate": "2025-10-15T14:00:00Z"
  },
  "signature": "HMAC-SHA256-SIGNATURE"
}
```

**actionTypeの種類**:
- `reexamination_scheduled`: 再検査予約済み
- `industrial_physician_scheduled`: 産業医面談予約済み
- `health_plan_created`: 健康改善計画作成済み
- `notification_acknowledged`: 通知確認済み（既読）

**Phase 4実装見積もり**:
- **VoiceDrive側**: 3日（¥0、VoiceDrive側の実装）
- **医療システム側**: 2日（¥160,000、Webhook受信エンドポイント実装）
- **合計**: 5日（¥160,000）

**実装優先度**: 中（Phase 1-3完了後に検討）

---

#### 確認-14: プライバシー保護

**質問**: 健康データの保存期間やアクセス権限に関する規定はありますか？VoiceDriveでは以下を想定: 保存期間3年、アクセス権限は本人のみ閲覧可能

**回答**: ✅ **VoiceDriveの想定で問題なし（一部修正あり）**

**保存期間**:

| データ種別 | 医療システム | VoiceDrive | 法的根拠 |
|-----------|-------------|-----------|---------|
| **健康診断生データ** | 5年 | 保存しない | 労働安全衛生法 |
| **健康通知（評価結果）** | 5年 | **5年**（修正） | 労働安全衛生法準拠 |
| **通知処理ログ** | 5年 | 3年 | - |
| **既読状態** | 保存しない | 3年 | - |

**修正理由**: 医療システムと保存期間を統一し、監査対応を容易にする

**アクセス権限**:

| 役割 | 健康通知閲覧 | 全職員の健康データ閲覧 | 統計データ閲覧 |
|------|------------|---------------------|--------------|
| **本人** | ✅ 自分のみ | ❌ 不可 | ❌ 不可 |
| **産業医** | ✅ 全職員 | ✅ 全職員 | ✅ 可能 |
| **人事部（健康管理担当）** | ✅ 全職員 | ⚠️ 匿名化データのみ | ✅ 可能 |
| **一般管理職** | ❌ 不可 | ❌ 不可 | ⚠️ 部署統計のみ |
| **システム管理者** | ⚠️ ログ閲覧のみ | ❌ 不可 | ✅ 可能 |

**VoiceDrive側の実装**:
```typescript
// healthStationAccess.ts
async checkAccess(requestUserId: string, targetUserId: string): Promise<boolean> {
  // 本人確認
  if (requestUserId === targetUserId) {
    return true;
  }

  // 産業医確認
  const requestUser = await prisma.user.findUnique({
    where: { id: requestUserId }
  });

  if (requestUser?.permissionLevel === 14) { // 産業医レベル
    return true;
  }

  // 人事部（健康管理担当）確認
  if (requestUser?.departmentId === 'hr-health' && requestUser?.permissionLevel >= 12) {
    return true;
  }

  // 上記以外はアクセス拒否
  return false;
}
```

**監査ログ**:
```typescript
// healthStationAuditLog.ts
async logAccess(action: string, userId: string, targetUserId: string): Promise<void> {
  await prisma.healthStationAuditLog.create({
    data: {
      action,           // 'view', 'export', 'delete'
      userId,           // アクセスしたユーザー
      targetUserId,     // 対象の職員
      timestamp: new Date(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    }
  });
}
```

**プライバシー保護措置**:
1. **アクセス制御**: 本人・産業医・人事部（健康管理担当）のみ
2. **監査ログ**: 全てのアクセスを記録（5年保存）
3. **データ暗号化**: データベース暗号化（AES-256）
4. **匿名化**: 統計データは個人特定不可
5. **データ削除**: 退職後5年経過で自動削除

---

#### 確認-15: Webhook移行

**質問**: 将来的にファイルベースからWebhook方式に移行する予定はありますか？

**回答**: ⚠️ **Phase 4で検討予定（2026年4月以降）**

**現状の評価（Phase 1-3）**:

| 項目 | ファイルベース | 評価 |
|------|--------------|------|
| **開発コスト** | 医療システム: ¥0 | ✅ 非常に低い |
| **運用負荷** | 低（月次バッチのみ） | ✅ 簡単 |
| **遅延時間** | 最大7.5秒 | ✅ 許容範囲 |
| **信頼性** | ファイル再配置で復旧可能 | ✅ 高い |
| **スケーラビリティ** | 職員300名で問題なし | ✅ 十分 |

**結論**: Phase 1-3ではファイルベース連携で十分

**Webhook移行の検討条件**:
1. **職員数の増加**: 500名以上に増加した場合
2. **リアルタイム性の要求**: urgent通知で1秒未満の配信が必要な場合
3. **双方向通信の必要性**: VoiceDrive → 医療システムへの通知が頻繁に必要な場合

**Phase 4実装見積もり（Webhook移行）**:

| 項目 | 工数 | 金額 |
|------|------|------|
| **医療システム側** | | |
| - Webhook送信エンドポイント実装 | 3日 | ¥240,000 |
| - Webhook受信エンドポイント実装（確認-13対応） | 2日 | ¥160,000 |
| **VoiceDrive側** | | |
| - Webhook受信エンドポイント実装 | 2日 | - |
| - Webhook送信機能実装 | 3日 | - |
| **統合テスト** | 2日 | ¥160,000 |
| **合計** | **12日** | **¥560,000** |

**Phase 4実装時期**: 2026年4月以降（Phase 1-3完了後、運用状況を評価して判断）

**現時点の推奨**: ファイルベース連携で開始し、必要に応じてPhase 4でWebhook移行を検討

---

## 💰 コスト概算

### 医療システムチーム

| Phase | 項目 | 工数 | 金額 |
|-------|------|------|------|
| **Phase 1** | 基本通知受信（ファイル配置のみ） | 0日 | ¥0 |
| **Phase 2** | 既読管理・統計（VoiceDrive内部処理） | 0日 | ¥0 |
| **Phase 3** | レポート機能（VoiceDrive内部処理） | 0日 | ¥0 |
| **Phase 4（将来）** | Webhook移行（検討中） | 7日 | ¥560,000 |
| **合計（Phase 1-3）** | | **0日** | **¥0** |

### VoiceDriveチーム

| Phase | 項目 | 工数 |
|-------|------|------|
| **Phase 1** | 基本通知受信 | 7日 |
| **Phase 2** | 既読管理・統計 | 7日 |
| **Phase 3** | レポート機能 | 7日 |
| **合計** | | **21日** |

---

## 📅 実装スケジュール

### Phase 1: 基本通知受信（1週間）

| 日程 | 作業内容 | 担当 | 医療システム工数 |
|------|----------|------|----------------|
| Day 1 | テーブル設計・マイグレーション | VoiceDrive | 0日 |
| Day 2-3 | ファイル監視・通知処理実装 | VoiceDrive | 0日 |
| Day 4-5 | HealthStation UI統合 | VoiceDrive | 0日 |
| Day 6-7 | テスト・デバッグ | VoiceDrive | 0日 |

**医療システム作業**: なし（ファイル配置方式のため）

### Phase 2: 既読管理・統計（1週間）

| 日程 | 作業内容 | 担当 | 医療システム工数 |
|------|----------|------|----------------|
| Day 8-9 | 既読管理API実装 | VoiceDrive | 0日 |
| Day 10 | 統計API実装 | VoiceDrive | 0日 |
| Day 11-12 | フィルタリング機能実装 | VoiceDrive | 0日 |
| Day 13-14 | HealthStation UI改善 | VoiceDrive | 0日 |

**医療システム作業**: なし（VoiceDrive内部機能のため）

### Phase 3: レポート機能（1週間）

| 日程 | 作業内容 | 担当 | 医療システム工数 |
|------|----------|------|----------------|
| Day 15-16 | レポート生成ロジック実装 | VoiceDrive | 0日 |
| Day 17 | レポートAPI実装 | VoiceDrive | 0日 |
| Day 18-19 | レポートUI実装 | VoiceDrive | 0日 |
| Day 20 | PDF/Markdown出力機能 | VoiceDrive | 0日 |
| Day 21 | 統合テスト | VoiceDrive | 0日 |

**医療システム作業**: なし（VoiceDrive内部機能のため）

---

## 🚀 次のアクション

### 即時対応（10月10日-11日）

#### 医療システムチーム

1. ✅ **確認事項への回答完了**
   - 本回答書の作成完了

2. ⚠️ **JSONサンプルファイル作成**
   - 4種類の通知タイプのサンプルファイルを作成
   - `mcp-shared/notifications/samples/` に配置

3. ⚠️ **月次バッチ処理設計**
   - 健康リスク評価バッチの設計
   - JSON生成スクリプトの設計

#### VoiceDriveチーム

1. ✅ **回答書の確認**
   - 本回答書の内容確認

2. ⚠️ **Phase 1実装開始準備**
   - テーブル設計レビュー
   - ファイル監視実装確認

3. ⚠️ **サンプルファイルテスト**
   - 医療システムチームが作成したサンプルファイルで動作確認

---

## 📎 関連ドキュメント

### 医療システムチーム作成ドキュメント

| ドキュメント | 作成日 | 文書番号 |
|------------|--------|---------|
| Response_HealthStation_Integration_20251010.md | 10月10日 | MS-RESPONSE-HEALTHSTATION-2025-1010-001 |

### VoiceDriveチーム作成ドキュメント

| ドキュメント | 作成日 | 文書番号 |
|------------|--------|---------|
| 健康ステーション暫定マスターリスト_20251009.md | 10月9日 | - |
| HealthStation_DB要件分析_20251009.md | 10月9日 | - |

### 作成予定ドキュメント

| ドキュメント | 作成予定日 | 担当 |
|------------|----------|------|
| 健康通知JSONサンプル集 | 10月11日 | 医療システム |
| Phase 1実装計画書 | 10月11日 | VoiceDrive |
| 統合テスト計画書 | 10月15日 | 両チーム |

---

## 総括

### 医療システムチームの見解

1. ✅ **ファイルベース連携を承認**
   - 医療システム側の開発工数: 0日（¥0）
   - JSON形式のファイルを配置するだけで連携完了
   - API開発・Webhook実装が不要

2. ✅ **通知データ形式を承認**
   - 4種類の通知タイプで十分
   - リスクレベル判定は医療システム側で実施
   - 検査値の生データは医療システム側で保持

3. ✅ **運用方針を決定**
   - 通知配信頻度: 月次（毎月1日 02:00 JST）
   - 処理済みファイルはVoiceDrive側で削除
   - 5秒遅延は許容範囲内

4. ⚠️ **Phase 4で機能拡張検討**
   - Webhook移行（2026年4月以降）
   - 再検査フォロー通知（VoiceDrive → 医療システム）
   - 実装コスト: ¥560,000

### VoiceDriveチームへの期待

1. ✅ **Phase 1-3の実装**
   - 3週間（21日）での実装完了
   - ファイルベース連携の動作確認
   - HealthStation UIの完成

2. ✅ **データ保護の徹底**
   - アクセス権限: 本人・産業医・人事部（健康管理担当）のみ
   - 監査ログの記録
   - データベース暗号化

3. ✅ **バージョン管理の対応**
   - metadata.versionフィールドの実装
   - 将来のバージョンアップに対応

---

## 📝 承認

### 医療システムチーム

- **承認者**: 医療システムプロジェクトリーダー
- **承認日**: 2025年10月10日
- **署名**: _____________________ ✅

---

**文書終了**

**本回答書をもって、健康ステーション統合実装に関する全ての確認事項への回答が完了しました。**

**VoiceDriveチームは本回答書に基づき、Phase 1実装を開始できます。**

*次回更新: Phase 1実装開始後のレビューミーティング（10月15日予定）*
