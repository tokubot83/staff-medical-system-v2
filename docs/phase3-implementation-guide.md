# 第3段階実装指示書 - 面談・評価管理システム

## 概要
この文書は、面談管理システムと評価管理システムの第3段階（バックエンド・データベース連携）実装のための詳細な指示書です。

---

## 1. 面談管理システム - 第3段階実装

### 1.1 VoiceDrive連携の実装

#### API実装
```javascript
// 実装指示（Claude用）:
// 1. docs/interview-api-design.md に基づくAPI実装
// 2. JWT認証の実装（docs/interview-api-design.md 参照）
// 3. Webhook によるイベント駆動型同期
// 4. 同期ステータス監視ダッシュボードの追加
// 参照: docs/INTEGRATION_ARCHITECTURE.md
```

#### 必要な実装項目
1. **VoiceDrive との双方向API連携**
   - REST API エンドポイントの実装
   - GraphQL サブスクリプションの設定
   - リアルタイムデータ同期

2. **共通データベースの同期機能**
   - PostgreSQL データベーススキーマの実装
   - トランザクション管理
   - データ整合性チェック

3. **スマホからの予約対応（VoiceDrive経由）**
   - モバイルAPI の実装
   - プッシュ通知機能
   - オフライン対応

4. **リアルタイム同期ステータス表示**
   - WebSocket 接続の実装
   - ステータス監視ダッシュボード
   - エラーハンドリングとリトライ機構

### 1.2 データベーススキーマ

```sql
-- 面談予約テーブル
CREATE TABLE interview_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id VARCHAR(50) NOT NULL,
    interviewer_id VARCHAR(50) NOT NULL,
    interview_type VARCHAR(50) NOT NULL,
    interview_category VARCHAR(50),
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    voicedrive_sync_status VARCHAR(20) DEFAULT 'pending',
    voicedrive_sync_at TIMESTAMP
);

-- 面談結果テーブル
CREATE TABLE interview_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES interview_bookings(id),
    outcome_summary TEXT,
    action_items JSONB,
    follow_up_required BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_by VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 同期ログテーブル
CREATE TABLE sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50),
    entity_id UUID,
    sync_direction VARCHAR(20),
    sync_status VARCHAR(20),
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 1.3 API エンドポイント

```typescript
// /api/v1/interviews/bookings
interface BookingAPI {
  // 予約作成
  POST: '/bookings' 
  // 予約一覧取得
  GET: '/bookings'
  // 予約詳細取得
  GET: '/bookings/:id'
  // 予約更新
  PUT: '/bookings/:id'
  // 予約削除
  DELETE: '/bookings/:id'
  
  // VoiceDrive同期
  POST: '/bookings/:id/sync'
  GET: '/bookings/sync-status'
}

// JWT認証ミドルウェア
middleware: {
  authentication: 'JWT',
  authorization: 'role-based',
  rateLimit: '100 req/min',
  cors: 'configured'
}
```

---

## 2. 評価管理システム - 第3段階実装

### 2.1 データベース実装

#### 評価データスキーマ
```sql
-- 評価記録テーブル
CREATE TABLE evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id VARCHAR(50) NOT NULL,
    evaluation_period VARCHAR(20) NOT NULL,
    technical_score INTEGER CHECK (technical_score >= 0 AND technical_score <= 50),
    contribution_score INTEGER CHECK (contribution_score >= 0 AND contribution_score <= 50),
    total_score INTEGER GENERATED ALWAYS AS (technical_score + contribution_score) STORED,
    facility_rank INTEGER,
    corporate_rank INTEGER,
    grade VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 評価開示記録テーブル
CREATE TABLE evaluation_disclosures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluation_id UUID REFERENCES evaluations(id),
    disclosure_channel VARCHAR(20) NOT NULL, -- 'paper' or 'voicedrive'
    disclosed_at TIMESTAMP,
    disclosed_by VARCHAR(50),
    employee_confirmed BOOLEAN DEFAULT FALSE,
    confirmed_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending'
);

-- 異議申し立てテーブル
CREATE TABLE evaluation_appeals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluation_id UUID REFERENCES evaluations(id),
    employee_id VARCHAR(50) NOT NULL,
    appeal_reason TEXT NOT NULL,
    appeal_category VARCHAR(50),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending',
    review_committee_notes TEXT,
    resolution TEXT,
    resolved_at TIMESTAMP,
    resolved_by VARCHAR(50)
);

-- 評価履歴テーブル
CREATE TABLE evaluation_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id VARCHAR(50) NOT NULL,
    evaluation_id UUID REFERENCES evaluations(id),
    action_type VARCHAR(50) NOT NULL,
    action_details JSONB,
    performed_by VARCHAR(50),
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2.2 API実装

#### 評価管理API
```typescript
// /api/v1/evaluations
interface EvaluationAPI {
  // 評価CRUD
  POST: '/evaluations'
  GET: '/evaluations'
  GET: '/evaluations/:id'
  PUT: '/evaluations/:id'
  
  // 開示管理
  POST: '/evaluations/:id/disclose'
  GET: '/evaluations/:id/disclosure-status'
  POST: '/evaluations/:id/confirm-disclosure'
  
  // 異議申し立て
  POST: '/evaluations/:id/appeal'
  GET: '/appeals'
  PUT: '/appeals/:id/review'
  POST: '/appeals/:id/resolve'
  
  // 統計・分析
  GET: '/evaluations/statistics'
  GET: '/evaluations/rankings'
  GET: '/evaluations/distribution'
}

// バッチ処理
interface BatchProcessing {
  // 一括評価計算
  POST: '/batch/calculate-scores'
  // ランキング更新
  POST: '/batch/update-rankings'
  // 開示準備
  POST: '/batch/prepare-disclosures'
}
```

### 2.3 VoiceDrive連携

#### 評価データ同期
```javascript
// VoiceDrive API連携
class VoiceDriveEvaluationSync {
  // 評価データをVoiceDriveに送信
  async pushEvaluationData(evaluationId) {
    const evaluation = await getEvaluation(evaluationId);
    const payload = {
      employeeId: evaluation.employee_id,
      scores: {
        technical: evaluation.technical_score,
        contribution: evaluation.contribution_score,
        total: evaluation.total_score
      },
      rankings: {
        facility: evaluation.facility_rank,
        corporate: evaluation.corporate_rank
      },
      grade: evaluation.grade,
      disclosureStatus: 'ready'
    };
    
    return await voicedriveAPI.post('/evaluations', payload);
  }
  
  // 職員の確認状態を受信
  async syncConfirmationStatus() {
    const confirmations = await voicedriveAPI.get('/evaluations/confirmations');
    for (const confirmation of confirmations) {
      await updateDisclosureStatus(confirmation.evaluationId, {
        employee_confirmed: true,
        confirmed_at: confirmation.timestamp
      });
    }
  }
  
  // 異議申し立てを受信
  async syncAppeals() {
    const appeals = await voicedriveAPI.get('/evaluations/appeals');
    for (const appeal of appeals) {
      await createAppeal({
        evaluation_id: appeal.evaluationId,
        employee_id: appeal.employeeId,
        appeal_reason: appeal.reason,
        appeal_category: appeal.category
      });
    }
  }
}
```

---

## 3. 共通実装事項

### 3.1 認証・認可

```typescript
// JWT認証の実装
import jwt from 'jsonwebtoken';

class AuthenticationService {
  // トークン生成
  generateToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        role: user.role,
        facility: user.facility 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }
  
  // トークン検証
  verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
  
  // 権限チェック
  checkPermission(user, resource, action) {
    const permissions = {
      hr_admin: ['*'],
      facility_manager: ['read', 'update'],
      employee: ['read:own']
    };
    
    return permissions[user.role].includes(action) || 
           permissions[user.role].includes('*');
  }
}
```

### 3.2 リアルタイム通知

```typescript
// WebSocket実装
import { Server } from 'socket.io';

class NotificationService {
  constructor(io) {
    this.io = io;
  }
  
  // 面談予約通知
  notifyInterviewBooking(booking) {
    this.io.to(booking.employee_id).emit('interview:booked', {
      type: 'interview_booking',
      data: booking,
      timestamp: new Date()
    });
  }
  
  // 評価開示通知
  notifyEvaluationDisclosure(evaluation) {
    this.io.to(evaluation.employee_id).emit('evaluation:disclosed', {
      type: 'evaluation_disclosure',
      data: evaluation,
      timestamp: new Date()
    });
  }
  
  // 同期ステータス更新
  updateSyncStatus(status) {
    this.io.emit('sync:status', {
      type: 'sync_status',
      data: status,
      timestamp: new Date()
    });
  }
}
```

### 3.3 エラーハンドリング

```typescript
// エラーハンドリングミドルウェア
class ErrorHandler {
  // API エラーハンドリング
  handleAPIError(error, req, res) {
    console.error('API Error:', error);
    
    // エラーログをDBに記録
    logError({
      endpoint: req.path,
      method: req.method,
      error: error.message,
      stack: error.stack,
      user_id: req.user?.id
    });
    
    // クライアントへのレスポンス
    res.status(error.status || 500).json({
      error: {
        message: error.message,
        code: error.code,
        timestamp: new Date()
      }
    });
  }
  
  // 同期エラーハンドリング
  async handleSyncError(entity, error) {
    await saveSyncLog({
      entity_type: entity.type,
      entity_id: entity.id,
      sync_status: 'failed',
      error_message: error.message
    });
    
    // リトライキューに追加
    await addToRetryQueue(entity);
  }
}
```

---

## 4. 実装順序とタイムライン

### Phase 3-A: 基盤構築（2週間）
1. データベーススキーマの実装
2. 基本的なCRUD APIの実装
3. 認証・認可システムの構築
4. エラーハンドリングの実装

### Phase 3-B: 面談システム連携（2週間）
1. 面談予約APIの実装
2. VoiceDrive連携（面談）
3. リアルタイム通知（面談）
4. 同期ステータス管理

### Phase 3-C: 評価システム連携（2週間）
1. 評価管理APIの実装
2. 開示・異議申し立て機能
3. VoiceDrive連携（評価）
4. バッチ処理の実装

### Phase 3-D: 統合テスト（1週間）
1. E2Eテストの実施
2. 負荷テスト
3. セキュリティ監査
4. 本番環境へのデプロイ準備

---

## 5. 参照ドキュメント

- `/docs/interview-system-overview.md` - 面談制度の詳細仕様
- `/docs/interview-api-design.md` - API設計書
- `/docs/INTEGRATION_ARCHITECTURE.md` - VoiceDrive連携アーキテクチャ
- `/src/types/interview.ts` - TypeScript型定義
- `/docs/evaluation-system-design.md` - 評価制度設計書

---

## 6. 実装時の注意事項

1. **セキュリティ**
   - すべてのAPIエンドポイントに認証を実装
   - SQLインジェクション対策
   - XSS対策
   - CORS設定の適切な管理

2. **パフォーマンス**
   - データベースインデックスの最適化
   - APIレスポンスのキャッシング
   - ページネーションの実装
   - N+1問題の回避

3. **可用性**
   - エラーリトライ機構
   - サーキットブレーカーパターン
   - グレースフルシャットダウン
   - ヘルスチェックエンドポイント

4. **監視・ログ**
   - APMツールの導入
   - 構造化ログの実装
   - メトリクス収集
   - アラート設定

---

この指示書に従って実装を進めることで、面談・評価管理システムの完全なバックエンド統合が実現できます。