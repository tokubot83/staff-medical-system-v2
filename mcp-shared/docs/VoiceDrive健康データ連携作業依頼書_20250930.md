# VoiceDrive健康データ連携作業依頼書

**作成日**: 2025年9月30日
**作成者**: 医療職員管理システム開発チーム
**宛先**: VoiceDriveシステム開発チーム
**優先度**: 高

## 概要

医療職員管理システムにおいて、健康データ分析・予測機能およびVoiceDrive連携機能の実装が完了しました。
VoiceDriveシステム側での対応実装をお願いいたします。

## 実装完了機能

### 1. 健康リスク評価システム
- **ファイル**: `src/lib/health/risk-assessment.ts`
- **機能**:
  - メタボリックシンドローム、糖尿病、心血管疾患、肝機能のリスク評価
  - 総合健康スコア（0-100点）の算出
  - 個人別健康推奨事項の自動生成
  - リスクレベル判定（low/medium/high/very-high）

### 2. 健康データ通知API
- **エンドポイント**: `/api/health/notifications`
- **メソッド**: POST, GET, DELETE
- **通知タイプ**:
  - `health_risk_assessment`: リスク評価完了通知
  - `health_checkup_result`: 健診結果通知
  - `stress_check_result`: ストレスチェック結果通知
  - `reexamination_required`: 要再検査通知

### 3. 自動レポート生成・送信API
- **エンドポイント**: `/api/health/reports/generate`
- **メソッド**: POST, GET, PUT
- **レポート形式**: JSON, Markdown
- **スケジュール設定**: daily/weekly/monthly/quarterly

## MCP共有フォルダ構造

```
mcp-shared/
├── notifications/          # 健康データ通知
│   └── health_notif_*.json
├── reports/
│   └── health/            # 健康レポート
│       ├── *.json
│       └── *.md
├── scheduled/             # スケジュール設定
│   └── health-reports-schedule.json
├── logs/
│   └── health-notifications.log
└── docs/
    ├── health-notifications-summary.md  # 通知サマリー
    └── health-reports-latest.md        # 最新レポート
```

## VoiceDrive側で必要な実装

### 1. 通知受信ハンドラー

```typescript
// 通知データ構造
interface HealthNotification {
  type: 'health_risk_assessment' | 'health_checkup_result' | 'stress_check_result' | 'reexamination_required';
  staffId: string;
  timestamp: string;
  assessment?: {
    overallScore: number;
    overallLevel: string;
    highRiskCategories: Array<{
      category: string;
      score: number;
      level: string;
    }>;
    priorityActions: string[];
    nextCheckup: string;
  };
  recommendations?: {
    lifestyle: string[];
    diet: string[];
    exercise: string[];
    medicalFollowUp: string[];
  };
  metadata: {
    source: string;
    version: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
  };
}
```

### 2. 通知監視機能

**監視対象ファイル**:
- `mcp-shared/notifications/health_notif_*.json`
- `mcp-shared/docs/health-notifications-summary.md`

**推奨実装**:
```typescript
// ファイル監視の例
const watcher = fs.watch('mcp-shared/notifications/', (eventType, filename) => {
  if (filename.startsWith('health_notif_') && eventType === 'rename') {
    // 新規通知を処理
    processHealthNotification(filename);
  }
});
```

### 3. 優先度別処理

| 優先度 | 条件 | 推奨アクション |
|--------|------|----------------|
| urgent | リスクレベル: very-high | 即座に管理者に通知、緊急対応フロー起動 |
| high | リスクレベル: high | 24時間以内に担当者確認、対応計画作成 |
| medium | リスクレベル: medium | 週次レポートに含める、定期フォロー |
| low | リスクレベル: low | 月次レポートに記録、経過観察 |

### 4. レポート表示機能

**レポートアクセス方法**:
```typescript
// JSONフォーマット取得
const jsonReport = fs.readFileSync(`mcp-shared/reports/health/${reportId}.json`);

// Markdownフォーマット取得（人間が読みやすい形式）
const mdReport = fs.readFileSync(`mcp-shared/reports/health/${reportId}.md`);
```

### 5. Webhook設定（オプション）

環境変数で設定可能:
```env
VOICEDRIVE_WEBHOOK_URL=https://voicedrive-system/api/webhooks/health
```

Webhook受信時のヘッダー:
- `X-Source`: staff-medical-system
- `X-Notification-ID`: 通知ID

## テストデータ

テスト用のサンプルデータを以下に配置しています:

```typescript
// テスト用健康データ
const testHealthData = {
  bmi: 26.5,
  bloodPressureSystolic: 145,
  bloodPressureDiastolic: 92,
  ldlCholesterol: 150,
  hdlCholesterol: 38,
  triglycerides: 180,
  bloodGlucose: 115,
  hba1c: 6.2,
  ast: 45,
  alt: 52,
  gammaGtp: 68,
  age: 48,
  gender: 'male',
  smokingStatus: 'current',
  drinkingFrequency: 'regular'
};

// APIテスト例
curl -X POST http://localhost:3000/api/health/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "type": "health_risk_assessment",
    "staffId": "TEST001",
    "assessment": {
      "overallScore": 65,
      "overallLevel": "high",
      "priorityActions": ["禁煙外来の受診", "減塩食の開始"]
    }
  }'
```

## 連携テスト手順

1. **通知テスト**
   - 医療システムから通知APIをコール
   - `mcp-shared/notifications/`に通知ファイルが生成されることを確認
   - VoiceDriveシステムで通知を受信・処理

2. **レポートテスト**
   - レポート生成APIをコール
   - `mcp-shared/reports/health/`にレポートが保存されることを確認
   - VoiceDriveシステムでレポート表示

3. **優先度別処理テスト**
   - 各優先度（urgent/high/medium/low）の通知を送信
   - VoiceDriveシステムで適切な処理が行われることを確認

## サポート情報

### 技術的な質問
- MCP共有フォルダ: `mcp-shared/docs/`に技術文書を配置
- ログファイル: `mcp-shared/logs/`で連携ログを確認可能

### エラーハンドリング
- 通知送信失敗時は自動リトライ（3回まで）
- エラーログは`mcp-shared/logs/health-notifications.log`に記録

### 今後の拡張予定
- リアルタイムアラート機能
- 予測分析の高度化
- AIによる健康アドバイス生成

## 依頼事項

1. **通知受信ハンドラーの実装**（優先度: 高）
   - 新規通知の検知と処理
   - 優先度別のアクション実行

2. **レポート表示UIの実装**（優先度: 中）
   - Markdownレポートの表示
   - 健康トレンドグラフの可視化

3. **管理者通知機能**（優先度: 高）
   - urgent/high優先度の即時通知
   - ダッシュボードへの統計表示

4. **連携テストの実施**（優先度: 高）
   - 通知の送受信確認
   - レポートアクセス確認

## 完了期限

**希望完了日**: 2025年10月7日（月）

段階的な実装も可能です:
- Phase 1（10/3まで）: 通知受信の基本機能
- Phase 2（10/5まで）: レポート表示機能
- Phase 3（10/7まで）: 管理者通知・ダッシュボード

## 連絡先

質問や確認事項がございましたら、以下の方法でご連絡ください:
- MCP共有フォルダ: `mcp-shared/docs/`に質問ファイルを配置
- 技術文書: 本ファイルと同じディレクトリに配置

---

**医療職員管理システム開発チーム**
2025年9月30日