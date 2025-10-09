# AWS Lightsail統合実装マスタープラン【2025年10月10日更新版】

**文書番号**: MP-2025-1010-001
**作成日**: 2025年9月20日
**最終更新**: 2025年10月10日（Version 2.20）
**作成者**: 医療システムチーム
**宛先**: VoiceDriveチーム
**重要度**: 🔴 最重要

---

## 📢 重要更新（2025年10月5日）

### 🆕 Phase 1.5追加: LLMコンテンツモデレーション統合

VoiceDrive SNS投稿の自動検閲システムを **Phase 1.5** として追加しました。

**追加理由**:
- VoiceDrive「アイデアボイス投稿」における個人攻撃・誹謗中傷の未然防止
- ライトセイル上の共通LLM基盤（**Llama 3.2:3b**）を活用
- 運用コストゼロ（既存インフラ活用）
- Phase 1（基盤構築）完了後、即座に実装可能

**🔄 モデル選定変更（2025年10月5日決定）**:
- 当初計画: Llama 3.2:8B (8-9GB)
- **最終決定: Llama 3.2:3b (3-4GB)** ← Option B採用
- **変更理由**:
  - 法人SNSの性質上、誹謗中傷リスクは一般SNSより低い
  - 3bモデルでも十分な検知精度を確保可能
  - 処理速度が2-3倍高速（ユーザー体験向上）
  - メモリに6-7GBの余裕を確保（将来拡張性向上）

**実装状況**:
- ✅ Phase 1完了: 設計・仕様確定（10/4-10/5完了）
- ✅ Week 5完了: コア機能実装（10/5完了）
- 📅 Week 6-8予定: ライトセイル環境での精度検証・統合テスト

---

## エグゼクティブサマリー

医療職員管理システムとVoiceDriveシステムのAWS Lightsail環境での統合実装計画書です。
**Phase 0（組織設計）を最優先事項**として、6つのフェーズで段階的に実装を進めます。

### 🎯 核心目標
- **職員登録時の自動VoiceDriveアカウント作成**
- **SSO（シングルサインオン）による完全統合**
- **リアルタイム双方向データ同期**
- **統合レポート・分析機能**
- **🆕 LLMコンテンツモデレーション（個人攻撃・誹謗中傷の自動検知）**

---

## Phase 0: 組織設計【最優先】🔴

### 実施期間: 即座開始～2週間

### 0.1 医療法人厚生会組織構造の確定

```
医療法人厚生会
├── 本部
│   ├── 理事長
│   ├── 専務理事
│   └── 常務理事
├── 施設
│   ├── 厚生病院（300床）
│   ├── 厚生クリニック（3拠点）
│   ├── 介護老人保健施設（100床）
│   └── 訪問看護ステーション（2拠点）
└── 部門
    ├── 医療部門
    ├── 看護部門
    ├── 医療技術部門
    ├── 事務部門
    └── 施設管理部門
```

### 0.2 権限階層設計

| レベル | 役職 | 権限範囲 | システムロール |
|--------|------|----------|----------------|
| L1 | 幹部 | 全施設・全データ | EXECUTIVE |
| L2 | 部門長 | 部門内全データ | DEPARTMENT_HEAD |
| L3 | チームリーダー | チーム内データ | TEAM_LEADER |
| L4 | 一般職員 | 自己データのみ | STAFF |

### 0.3 データアクセスマトリックス

```sql
-- 権限マスタテーブル
CREATE TABLE permission_matrix (
    role_id VARCHAR(20) PRIMARY KEY,
    can_view_all_staff BOOLEAN DEFAULT FALSE,
    can_edit_all_staff BOOLEAN DEFAULT FALSE,
    can_view_department BOOLEAN DEFAULT FALSE,
    can_approve_interviews BOOLEAN DEFAULT FALSE,
    can_access_reports BOOLEAN DEFAULT FALSE
);
```

---

## Phase 1: 基盤構築

### 実施期間: 3週間（Phase 0完了後）

### 1.1 AWS Lightsail環境構築

#### インスタンス構成（2025年10月5日更新）

```yaml
Production Environment:
  # 🆕 統合サーバー（単一インスタンス構成）
  Unified_Instance:
    - Type: 16GB RAM, 4 vCPU, 320GB SSD
    - OS: Ubuntu 22.04 LTS
    - Cost: $80/month
    - 用途:
      - 医療システム + VoiceDrive統合API
      - MySQL 8.0 データベース
      - Ollama + Llama 3.2:3b
      - FastAPI（モデレーションAPI）
      - MCPサーバー
      - Redis（キャッシュ）

  Storage:
    - Type: Object Storage（バックアップ用）
    - Size: 100GB
    - Cost: $10/month

  Total: $90/month

  ⚠️ 旧構成（$160/月）から$70/月削減（43.7%コスト削減）
```

#### 統合インスタンス詳細仕様（16GB単一サーバー構成）

```yaml
Unified_Instance_Specification:
  Hostname: medical-integrated.lightsail.aws

  Software_Stack:
    - Ubuntu 22.04 LTS
    - MySQL 8.0（ローカルインストール）
    - Python 3.11
    - Ollama 0.1.6+
    - Llama 3.2:3b（MIT License, 商用利用可能）
    - FastAPI 0.104.1（モデレーションAPI）
    - Redis 7.0（キャッシュ）
    - Nginx（リバースプロキシ）
    - MCPサーバー（チーム間連携）

  Memory_Allocation_16GB:
    - MySQL: 2.5GB
    - Llama 3.2:3b: 3-4GB（8Bの半分以下）
    - FastAPI: 1GB
    - Redis: 1GB
    - MCP: 0.5GB
    - Nginx + OS: 1.5GB
    - Buffer: 6-7GB（余裕たっぷり）

  Directory_Structure:
    /var/lib/mysql/            # MySQLデータ
    /opt/medical-llm-api/      # FastAPIアプリケーション
    /var/lib/ollama/           # Ollamaモデル格納（3bは約2GB）
    /opt/mcp-server/           # MCPサーバー
    /var/log/medical-llm/      # ログ
    /etc/systemd/system/       # systemdサービス定義

  Network:
    - 固定IP: 割り当て
    - ポート: 3306（MySQL）、8000（FastAPI）、11434（Ollama）、5000（MCP）
    - ファイアウォール: VoiceDrive IP許可リストのみ

  Performance_Targets:
    - LLM平均応答時間: ≤ 1.0秒（3bは8Bより高速）
    - LLM P95応答時間: ≤ 1.8秒
    - DB応答時間: ≤ 100ms
    - 同時接続: 100件/分
    - 稼働率: 99.5%
```

### 1.2 MySQL共通データベース設計

```sql
-- 共通データベース: lightsail_integrated_db

-- 1. 統合職員マスタ
CREATE TABLE unified_staff_master (
    staff_id VARCHAR(20) PRIMARY KEY,
    employee_number VARCHAR(10) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    facility_id VARCHAR(20),
    department_id VARCHAR(20),
    position_id VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    medical_system_id VARCHAR(50),
    voicedrive_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    sync_status ENUM('synced', 'pending', 'error') DEFAULT 'pending',
    INDEX idx_facility (facility_id),
    INDEX idx_department (department_id),
    INDEX idx_sync_status (sync_status)
);

-- 2. アカウント連携テーブル
CREATE TABLE account_integration (
    integration_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id VARCHAR(20) NOT NULL,
    medical_username VARCHAR(50),
    voicedrive_username VARCHAR(50),
    sso_token VARCHAR(500),
    token_expires_at TIMESTAMP,
    auto_created BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES unified_staff_master(staff_id),
    INDEX idx_staff (staff_id),
    INDEX idx_token_expiry (token_expires_at)
);

-- 3. 同期ログテーブル
CREATE TABLE sync_log (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sync_type ENUM('staff', 'interview', 'notification', 'report', 'llm_moderation') NOT NULL,
    source_system ENUM('medical', 'voicedrive', 'llm') NOT NULL,
    target_system ENUM('medical', 'voicedrive', 'llm') NOT NULL,
    record_count INT DEFAULT 0,
    status ENUM('success', 'partial', 'failed') NOT NULL,
    error_message TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    INDEX idx_sync_type (sync_type),
    INDEX idx_status (status),
    INDEX idx_started (started_at)
);
```

---

## Phase 1.2: VoiceDrive MySQL移行【新規追加】🆕

### 実施期間: Week 6と並行（10/6-10/12）

### 1.2.1 概要

VoiceDriveシステムのデータベースをSQLiteからMySQLに移行し、医療システムとの統合基盤を統一します。

**移行理由**:
- ✅ 医療システムとの統合基盤統一（MySQL）
- ✅ スケーラビリティ向上（SQLiteの制約解消）
- ✅ 同時接続性能の向上
- ✅ 本番環境でのデータ整合性向上

**影響範囲**:
- VoiceDrive統合テストの一部再実施が必要
- 医療チーム側の開発作業は不要（接続確認のみ）

### 1.2.2 作業分担

#### 医療チーム作業

**作業内容**: 接続確認のみ（開発作業なし）

```bash
# ========================================
# MySQL接続確認（10/11金曜、所要時間: 15分）
# ========================================

# 統合インスタンスにSSH接続
ssh -i LightsailKey.pem ubuntu@<UNIFIED_INSTANCE_IP>

# MySQLログイン確認
mysql -u root -p

# VoiceDrive用データベース確認
SHOW DATABASES LIKE 'voicedrive_%';

# 接続権限確認
SELECT User, Host FROM mysql.user WHERE User = 'voicedrive_user';

# 接続テスト（VoiceDriveチームのIPから）
# VoiceDriveチームが実施、医療チームは結果確認のみ
```

#### VoiceDriveチーム作業

**作業内容**: DB移行、統合テスト再実施（Week 6内完了）

**Phase 1: 環境準備（10/6-10/7、1日）**

```bash
# ========================================
# Step 1: MySQL接続情報取得
# ========================================
# 医療チームから以下の情報を受領:
# - MYSQL_HOST: <UNIFIED_INSTANCE_IP>
# - MYSQL_PORT: 3306
# - MYSQL_DATABASE: voicedrive_production
# - MYSQL_USER: voicedrive_user
# - MYSQL_PASSWORD: <secure_password>

# ========================================
# Step 2: VoiceDrive環境変数設定
# ========================================
cd voicedrive-v100

# .env.production.mysql を作成
cat > .env.production.mysql << 'EOF'
# MySQL接続設定
DB_TYPE=mysql
MYSQL_HOST=<UNIFIED_INSTANCE_IP>
MYSQL_PORT=3306
MYSQL_DATABASE=voicedrive_production
MYSQL_USER=voicedrive_user
MYSQL_PASSWORD=<secure_password>
MYSQL_SSL=true
MYSQL_POOL_MIN=5
MYSQL_POOL_MAX=20
MYSQL_TIMEOUT=30000

# 既存のVoiceDrive設定
VOICEDRIVE_API_URL=...
JWT_SECRET=...
# （その他の設定は既存のまま）
EOF
```

**Phase 2: データベース移行（10/8-10/9、2日）**

```bash
# ========================================
# Step 1: マイグレーションスクリプト準備
# ========================================
cd voicedrive-v100

# TypeORM設定ファイル作成
cat > ormconfig.mysql.json << 'EOF'
{
  "type": "mysql",
  "host": "${MYSQL_HOST}",
  "port": 3306,
  "username": "${MYSQL_USER}",
  "password": "${MYSQL_PASSWORD}",
  "database": "${MYSQL_DATABASE}",
  "entities": ["src/entities/**/*.ts"],
  "migrations": ["src/migrations/**/*.ts"],
  "synchronize": false,
  "logging": true
}
EOF

# ========================================
# Step 2: マイグレーション実行
# ========================================

# SQLiteからデータエクスポート
npm run db:export:sqlite

# MySQLスキーマ作成
npm run db:migrate:mysql

# データインポート
npm run db:import:mysql

# データ整合性確認
npm run db:verify:mysql

# ========================================
# Step 3: 接続テスト
# ========================================

# MySQL接続テスト
npm run test:db:connection:mysql

# 基本CRUD操作テスト
npm run test:db:crud:mysql
```

**Phase 3: 統合テスト再実施（10/10-10/11、2日）**

```bash
# ========================================
# 統合テスト再実施項目
# ========================================

# 1. ユーザー認証テスト
npm run test:integration:auth

# 2. アイデアボイス投稿テスト
npm run test:integration:post

# 3. 通知システムテスト
npm run test:integration:notification

# 4. レポート生成テスト
npm run test:integration:report

# 5. パフォーマンステスト
npm run test:performance:mysql

# ========================================
# テスト結果レポート作成
# ========================================

# テスト結果を医療チームに共有
node scripts/generate-mysql-migration-report.js > reports/mysql-migration-report-20251011.md
```

### 1.2.3 共同確認ミーティング

**日時**: 2025年10月11日（金）15:00-15:30（30分）

**参加者**:
- 医療チーム: 技術担当、LLM担当
- VoiceDriveチーム: プロジェクトリーダー、技術担当

**確認事項**:
1. ✅ MySQL接続確認（医療チーム）
2. ✅ データ移行完了確認（VoiceDriveチーム）
3. ✅ 統合テスト結果確認（VoiceDriveチーム）
4. ✅ パフォーマンス確認（両チーム）
5. ✅ Week 7以降のスケジュール確認（両チーム）

### 1.2.4 成功指標

| 指標 | 目標値 | 測定方法 |
|------|--------|---------|
| **データ移行成功率** | 100% | データ整合性チェック |
| **MySQL接続成功率** | 100% | 接続テスト |
| **統合テスト成功率** | 100% | テストスイート実行 |
| **MySQL応答時間** | < 50ms（95%） | パフォーマンステスト |
| **移行後エラー率** | 0% | エラーログ監視 |

### 1.2.5 リスクと対策

| リスク | 影響度 | 対策 |
|--------|--------|------|
| データ移行失敗 | 高 | SQLiteバックアップ保持、ロールバック手順準備 |
| 接続エラー | 中 | ファイアウォール設定事前確認、リトライ機構実装 |
| パフォーマンス劣化 | 中 | インデックス最適化、コネクションプーリング設定 |
| 統合テスト失敗 | 高 | Week 6内に余裕を持った2日間のテスト期間確保 |

### 1.2.6 関連ドキュメント

| ドキュメント | ファイル名 | 作成予定日 |
|------------|-----------|-----------|
| **MySQL移行計画書** | `VoiceDrive_MySQL_Migration_Plan_20251006.md` | 10/6 |
| **移行手順書** | `VoiceDrive_MySQL_Migration_Guide_20251006.md` | 10/6 |
| **統合テスト報告書** | `VoiceDrive_MySQL_Integration_Test_Report_20251011.md` | 10/11 |

---

## Phase 1.5: LLMコンテンツモデレーション統合【新規追加】🆕

### 実施期間: 4週間（Phase 1完了後、Phase 2と並行可能）

### 1.5.1 概要

VoiceDrive「アイデアボイス投稿」における個人攻撃・誹謗中傷を自動検知し、安全な投稿環境を実現します。

**核心メリット**:
- ✅ 運用コストゼロ（ライトセイル既存LLM基盤活用）
- ✅ 完全ローカル処理（外部送信なし、プライバシー保護）
- ✅ リアルタイム検知（投稿時に2秒以内で判定）
- ✅ 医療現場特有表現への配慮（誤検知防止）

### 1.5.2 実装済み成果物（Phase 1完了、2025年10月5日）

| カテゴリ | ファイル名 | 行数 | 状態 |
|---------|-----------|------|------|
| **型定義** | `medical-llm-api/src/api/types.py` | 218 | ✅ 完了 |
| **LLMエンジン** | `medical-llm-api/src/services/llm_engine.py` | 289 | ✅ 完了 |
| **プロンプト** | `medical-llm-api/src/prompts/violation_detection.py` | - | ✅ 完了 |
| **FastAPI** | `medical-llm-api/src/api/main.py` | 335 | ✅ 完了 |
| **コアサービス** | `medical-llm-api/src/services/moderation_service.py` | 273 | ✅ 完了 |
| **パッケージ** | `medical-llm-api/requirements.txt` | - | ✅ 完了 |
| **ドキュメント** | `medical-llm-api/README.md` | - | ✅ 完了 |
| **総計** | - | **1,392行** | ✅ 完了 |

### 1.5.3 ライトセイル環境構築後の作業再開手順

#### 🔄 医療チーム作業再開手順

**前提条件**:
- ✅ Phase 1: ライトセイル環境構築完了
- ✅ LLMインスタンス（8GB RAM, 4 vCPU）起動済み
- ✅ 固定IP割り当て完了

**Week 6開始時の手順**（所要時間: 1日）:

```bash
# ========================================
# Step 1: LLMインスタンスへSSH接続
# ========================================
ssh -i LightsailKey.pem ubuntu@<LLM_INSTANCE_IP>

# ========================================
# Step 2: Ollama + Llama 3.2 8Bインストール
# ========================================

# システム更新
sudo apt update && sudo apt upgrade -y

# Python 3.11インストール
sudo apt install -y python3.11 python3.11-venv python3-pip git curl

# Ollamaインストール
curl -fsSL https://ollama.com/install.sh | sh

# Ollama起動・有効化
sudo systemctl start ollama
sudo systemctl enable ollama

# Llama 3.2:3bダウンロード（約10分、2GBモデル）
ollama pull llama3.2:3b

# 動作確認
ollama run llama3.2:3b "こんにちは"
# → 正常にレスポンスが返ればOK（8Bより2-3倍高速）

# ========================================
# Step 3: 医療LLM APIデプロイ
# ========================================

# ローカルPCから医療LLM APIをSCP転送
# （ローカルPCで実行）
cd c:\projects\staff-medical-system
scp -i LightsailKey.pem -r medical-llm-api ubuntu@<LLM_INSTANCE_IP>:~/

# LLMインスタンスに戻る
cd ~/medical-llm-api

# Python仮想環境作成
python3.11 -m venv venv
source venv/bin/activate

# パッケージインストール
pip install -r requirements.txt

# ========================================
# Step 4: main.py修正（ModerationService統合）
# ========================================

# src/api/main.pyのダミーレスポンスを実装に置き換え
nano src/api/main.py

# 以下の修正を実施:
# 【Before】
# result = LLMModerationResult(
#     allowed=True,
#     severity="none",
#     confidence=90,
#     violations=[],
#     explanation="正常な投稿です。（現在はダミーレスポンス）",
#     ...
# )

# 【After】
from src.services.moderation_service import get_moderation_service

@app.post("/api/moderate")
async def moderate_content(request: LLMModerationRequest):
    start_time = time.time()
    global_metrics["total_requests"] += 1

    try:
        # ModerationService呼び出し
        moderation_service = get_moderation_service()
        result = moderation_service.moderate(
            content=request.content,
            context=request.context,
            options=request.options
        )

        # メトリクス更新
        processing_time = (time.time() - start_time) * 1000
        global_metrics["successful_requests"] += 1
        global_metrics["total_processing_time"] += processing_time

        return result

    except Exception as e:
        global_metrics["failed_requests"] += 1
        logger.error(f"Moderation error: {e}", exc_info=True)
        raise HTTPException(...)

# ========================================
# Step 5: systemdサービス設定
# ========================================

sudo nano /etc/systemd/system/medical-llm-api.service

# 以下を記述:
[Unit]
Description=Medical LLM Moderation API
After=network.target ollama.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/medical-llm-api
Environment="PATH=/home/ubuntu/medical-llm-api/venv/bin"
ExecStart=/home/ubuntu/medical-llm-api/venv/bin/uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --workers 4
Restart=always

[Install]
WantedBy=multi-user.target

# サービス有効化・起動
sudo systemctl daemon-reload
sudo systemctl enable medical-llm-api
sudo systemctl start medical-llm-api

# 動作確認
sudo systemctl status medical-llm-api

# ========================================
# Step 6: 初回テスト
# ========================================

# ヘルスチェック
curl http://localhost:8000/api/health

# モデレーションテスト
curl -X POST "http://localhost:8000/api/moderate" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "夜勤のシフト調整方法を改善すべきです。現状は負担が大きいです。"
  }'

# 期待されるレスポンス:
# {
#   "allowed": true,
#   "severity": "none",
#   "confidence": 85,
#   "violations": [],
#   "explanation": "建設的な改善提案です。業務負担の指摘は正常な表現です。",
#   "suggestedEdits": null,
#   "metadata": {
#     "modelVersion": "llama3.2:8b-v1.0",
#     "processingTime": 1200,
#     "timestamp": "2025-10-06T10:00:00Z"
#   }
# }

# ========================================
# Step 7: Nginx設定（外部アクセス用）
# ========================================

sudo apt install -y nginx

sudo nano /etc/nginx/sites-available/medical-llm-api

# 以下を記述:
server {
    listen 80;
    server_name <LLM_INSTANCE_IP>;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# 有効化
sudo ln -s /etc/nginx/sites-available/medical-llm-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 外部からテスト（ローカルPCから）
curl http://<LLM_INSTANCE_IP>/api/health
```

#### 🔄 VoiceDriveチーム作業再開手順

**前提条件**:
- ✅ 医療チーム: LLM APIデプロイ完了
- ✅ 医療チーム: 外部アクセス確認完了（Nginx設定）

**Week 7統合テスト時の手順**（所要時間: 半日）:

```bash
# ========================================
# Step 1: VoiceDrive環境変数設定
# ========================================

# voicedrive-v100/.env.production
LLM_API_ENDPOINT=http://<LLM_INSTANCE_IP>/api/moderate
LLM_API_KEY=<医療チームから提供されたAPIキー>
LLM_API_TIMEOUT=3000
LLM_API_RETRY_ATTEMPTS=2
LLM_ENABLE_CACHE=true
LLM_CACHE_DURATION=300000

# ========================================
# Step 2: VoiceDrive統合テストスクリプト実行
# ========================================

cd voicedrive-v100
npm run test:llm-integration

# テストケース:
# - normal-cases.json (100件)
# - violation-cases.json (50件)
# - edge-cases.json (30件)
# - medical-context-cases.json (50件)

# ========================================
# Step 3: 結果レポート作成
# ========================================

# テスト結果を医療チームに共有
# - 精度（Overall Accuracy）
# - 応答時間（平均、P95、P99）
# - MockLLMとの整合性
```

### 1.5.4 Week 6-8スケジュール（ライトセイル環境構築後）

| Week | 期間 | 医療チーム作業 | VoiceDriveチーム作業 | 成果物 |
|------|------|--------------|---------------------|--------|
| **Week 6** | 10/6-10/12 | - ライトセイル統合インスタンス構築（16GB）<br>- MySQL + Ollama + Llama 3.2:3b セットアップ<br>- FastAPI デプロイ<br>- main.py修正<br>- **🆕 VoiceDrive用MySQL接続確認（10/11）**<br>- 230件テストデータ検証 | - MockLLM結果データ提供<br>- 技術質問対応（Slack）<br>- 3bモデル採用の経緯共有<br>- **🆕 Phase 1.2: MySQL移行作業（10/6-10/11）**<br>  - 環境準備（10/6-10/7）<br>  - DB移行（10/8-10/9）<br>  - 統合テスト再実施（10/10-10/11） | - 実環境精度レポート<br>- パフォーマンス測定結果<br>- 3b vs MockLLM比較<br>- **🆕 MySQL移行報告書（10/11）**<br>- Week 6進捗報告 |
| **Week 7** | 10/13-10/19 | - Few-shot Learning調整<br>- 精度向上（目標85-90%）<br>- Redisキャッシュ実装<br>- 負荷テスト | - VoiceDrive統合テスト<br>- API呼び出しテスト<br>- エラーハンドリング確認<br>- 3bモデル精度評価 | - 統合テストレポート<br>- MockLLM整合性レポート（85%目標）<br>- Week 7進捗報告 |
| **Week 8** | 10/20-10/26 | - 本番環境最終調整<br>- 監視ダッシュボード構築<br>- 運用マニュアル作成<br>- 最終評価レポート | - 最終レビュー<br>- 本番環境接続確認<br>- 3bモデル運用承認 | - 最終評価レポート<br>- 運用マニュアル<br>- API仕様書 |

### 1.5.5 技術仕様

#### API仕様

```typescript
// POST /api/moderate
interface LLMModerationRequest {
  content: string;
  context?: {
    postType?: 'improvement' | 'community' | 'report';
    authorLevel?: number;
    department?: string;
  };
  options?: {
    checkSensitivity?: 'low' | 'medium' | 'high';
    language?: 'ja' | 'en';
    includeExplanation?: boolean;
  };
}

interface LLMModerationResult {
  allowed: boolean;
  severity: 'none' | 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-100
  violations: LLMViolation[];
  explanation?: string;
  suggestedEdits?: string[];
  metadata: {
    modelVersion: string;
    processingTime: number; // ミリ秒
    timestamp: Date;
  };
}
```

#### 11種類の違反タイプ

1. `personal_attack` - 個人攻撃
2. `defamation` - 誹謗中傷
3. `harassment` - ハラスメント
4. `discrimination` - 差別的表現
5. `privacy_violation` - プライバシー侵害（最重要）
6. `inappropriate_content` - 不適切なコンテンツ
7. `threatening` - 脅迫的表現
8. `hate_speech` - ヘイトスピーチ
9. `misinformation` - 誤情報・デマ
10. `spam` - スパム
11. `other` - その他

#### パフォーマンス目標

| 指標 | 目標値（3bモデル） | Week 6測定 |
|------|--------|-----------|
| **平均応答時間** | ≤ 1.0秒（8Bより高速） | 実測予定 |
| **P95応答時間** | ≤ 1.8秒 | 実測予定 |
| **P99応答時間** | ≤ 2.5秒 | 実測予定 |
| **Overall Accuracy** | ≥ 85%（法人SNS環境で十分） | 実測予定 |
| **Precision** | ≥ 88% | 実測予定 |
| **Recall** | ≥ 92% | 実測予定 |
| **Privacy Violation検出** | 100%（最重要） | 実測予定 |
| **明らかな誹謗中傷検出** | 100% | 実測予定 |

### 1.5.6 セキュリティ・プライバシー

#### 完全ローカル処理

```
VoiceDrive投稿 → ライトセイル統合インスタンス（Llama 3.2:3b）
                      ↓
                  【完全ローカル処理】
                  - 外部送信ゼロ
                  - OpenAI/Claude不使用
                  - 3bモデルで高速処理（0.5-1.0秒）
                      ↓
                  判定結果 → VoiceDrive
                      ↓
                  投稿テキスト即座削除
```

#### データ保持ポリシー

| データ種別 | 保持期間 | 暗号化 |
|----------|---------|--------|
| 投稿テキスト | 0秒（処理完了後即座削除） | - |
| 検知結果（匿名化） | 90日 | ✅ |
| 監査ログ（メタデータのみ） | 365日 | ✅ |

### 1.5.7 コスト効果

| 項目 | 外部AI委託 | 本実装 | 削減効果 |
|------|-----------|--------|---------|
| **初期開発費** | 300-500万円 | 0円 | 100%削減 |
| **月額運用費** | 5-10万円 | 0円 | 100%削減 |
| **年間運用費** | 60-120万円 | 0円 | 100%削減 |
| **5年間総コスト** | 600-900万円 | 0円 | **100%削減** |

*注: ライトセイルLLMインスタンス費用（$80/月）は既存インフラとして計上済み*

### 1.5.8 関連ドキュメント

| ドキュメント | ファイル名 | 作成日 |
|------------|-----------|--------|
| **提案書** | `VoiceDrive_Content_Moderation_Proposal_20251004.md` | 10/4 |
| **実装計画** | `LLM_Moderation_API_Implementation_Plan_20251004.md` | 10/4 |
| **実装ガイド** | `Medical_Team_LLM_Implementation_Guide_20251004.md` | 10/4 |
| **統合テスト依頼** | `LLM_Moderation_Integration_Test_Request_20251005.md` | 10/5 |
| **キックオフ報告** | `LLM_Integration_Implementation_Kickoff_20251005.md` | 10/5 |
| **Week 5完了報告** | `LLM_Integration_Week5_Completion_Report_20251005.md` | 10/5 |

---

## Phase 2: 認証システム統合

### 実施期間: 4週間（Phase 1.5と並行可能）

### 2.1 JWT基盤SSO実装

```typescript
// JWT Token Structure
interface JWTPayload {
    staffId: string;
    employeeNumber: string;
    systemAccess: {
        medical: boolean;
        voicedrive: boolean;
    };
    permissions: string[];
    facilityId: string;
    departmentId: string;
    role: 'EXECUTIVE' | 'DEPARTMENT_HEAD' | 'TEAM_LEADER' | 'STAFF';
    iat: number;
    exp: number;
}
```

*（Phase 2以降は従来のマスタープランと同じ内容のため省略）*

---

## 実装スケジュール（更新版）

```mermaid
gantt
    title Lightsail統合実装スケジュール（2025年10月5日更新）
    dateFormat  YYYY-MM-DD

    section Phase 0
    組織設計        :crit, p0, 2025-09-21, 14d

    section Phase 1
    環境構築        :p1a, after p0, 7d
    DB設計         :p1b, after p1a, 7d
    基本API        :p1c, after p1b, 7d

    section Phase 1.5
    LLM Phase1完了  :done, llm1, 2025-10-04, 2d
    LLM Week6      :active, llm2, 2025-10-06, 7d
    LLM Week7      :llm3, after llm2, 7d
    LLM Week8      :llm4, after llm3, 7d

    section Phase 2
    SSO実装        :p2a, after p1c, 14d
    自動作成       :p2b, after p2a, 14d

    section Phase 3
    同期システム    :p3a, after p2b, 21d
    WebSocket      :p3b, after p3a, 14d

    section Phase 4
    入職処理        :p4a, after p3b, 14d
    退職処理        :p4b, after p4a, 21d
    退職者検索      :p4c, after p4b, 14d

    section Phase 5
    データ移行      :p5a, after p4c, 14d
    ロールアウト    :p5b, after p5a, 28d
```

---

## コスト見積もり（更新版）

### 初期構築費用
| 項目 | 金額 |
|-----|------|
| Lightsail環境構築 | ¥200,000 |
| **LLMインスタンス構築（新規）** | **¥100,000** |
| DB設計・実装 | ¥500,000 |
| API開発（Phase 1-3） | ¥800,000 |
| **LLMモデレーションAPI実装（Phase 1.5）** | **¥0**（既に完了） |
| SSO統合 | ¥600,000 |
| 入職・退職処理実装（Phase 4） | ¥500,000 |
| データ移行 | ¥400,000 |
| **合計** | **¥3,100,000** |

### 月額運用費用（更新版 - 統合構成）
| 項目 | 金額 |
|-----|------|
| **Lightsail統合インスタンス（16GB）** | **¥12,000** |
| Lightsail Staging | ¥6,000 |
| バックアップストレージ | ¥1,500 |
| 監視・ログ管理 | ¥2,000 |
| **合計** | **¥21,500/月** |

**コスト削減効果**:
- 旧構成（分離型）: ¥33,500/月 → **統合構成: ¥21,500/月**
- **統合による削減**: ¥12,000/月（年間¥144,000削減）
- LLM外部API委託の場合: ¥60,000-120,000/月
- 本実装: ¥0/月（インフラ費用のみ）
- **LLM外部委託比較削減額**: 年間¥720,000-1,440,000

---

## 成功指標（KPI）- 更新版

### 1. 技術指標

| 指標 | 目標値 | 測定方法 |
|------|--------|---------|
| API応答時間 | < 200ms（95%） | Lightsail CloudWatch |
| **LLM応答時間（3b）** | **< 1.0秒（平均）** | **専用メトリクス** |
| システム可用性 | > 99.5% | 月間稼働率 |
| データ同期遅延 | < 5秒 | 同期ログ分析 |
| **LLM検知精度（3b）** | **> 85%** | **テストデータ検証** |

### 2. ビジネス指標

| 指標 | 目標値 | 測定方法 |
|------|--------|---------|
| 自動アカウント作成成功率 | > 99% | 作成ログ |
| SSO利用率 | > 90% | 認証ログ |
| ユーザー満足度 | > 4.0/5.0 | 四半期アンケート |
| **不適切投稿検知率** | **> 95%** | **モデレーションログ** |
| **誤検知率** | **< 5%** | **人間判定との比較** |

### 3. 運用指標

| 指標 | 目標値 | 測定方法 |
|------|--------|---------|
| インシデント解決時間 | < 4時間 | インシデント管理 |
| バックアップ成功率 | 100% | バックアップログ |
| セキュリティ監査合格率 | 100% | 監査結果 |
| **LLM稼働率** | **> 99.5%** | **ヘルスチェックログ** |

---

## 次のアクション（2025年10月5日更新）

### 即時実行項目（今週中）

#### Phase 1（基盤構築）
1. ✅ ~~Phase 0 組織設計会議の開催~~
2. ✅ ~~権限マトリックスの詳細定義~~
3. ⬜ **Lightsail環境の構築開始**
   - メインインスタンス（4GB）
   - **LLMインスタンス（8GB）← 最優先**
   - 固定IP割り当て

#### Phase 1.2（VoiceDrive MySQL移行）🆕
1. ⬜ **Week 6: MySQL移行作業（10/6-10/11）**
   - 環境準備（10/6-10/7）
   - DB移行（10/8-10/9）
   - 統合テスト再実施（10/10-10/11）
   - 共同確認ミーティング（10/11金曜15:00）

#### Phase 1.5（LLMコンテンツモデレーション）
1. ✅ ~~Phase 1: 設計・仕様確定（10/5完了）~~
2. ✅ ~~Week 5: コア機能実装（10/5完了）~~
3. ⬜ **Week 6: ライトセイル環境構築 + 精度検証（10/6-10/12）**
   - 統合インスタンス構築（16GB）
   - MySQL + Ollama + Llama 3.2:3b セットアップ
   - FastAPI デプロイ
   - 230件テストデータ検証（目標精度85%）

### 来週実行項目（10/6-10/12）

#### 医療チーム
1. ⬜ **統合インスタンス（16GB）セットアップ（最優先）**
2. ⬜ MySQL + Ollama + Llama 3.2:3b インストール
3. ⬜ **🆕 VoiceDrive用MySQL接続情報提供（10/6）**
4. ⬜ FastAPI デプロイ
5. ⬜ main.py修正（ModerationService統合）
6. ⬜ **🆕 VoiceDrive MySQL接続確認（10/11）**
7. ⬜ 230件テストデータ検証開始（精度目標85%）

#### VoiceDriveチーム
1. ⬜ MockLLM結果データ提供
2. ⬜ **3bモデル採用の経緯確認**（法人SNS環境における合理性）
3. ⬜ **🆕 Phase 1.2: MySQL移行作業（10/6-10/11）**
   - 環境準備（10/6-10/7）
   - DB移行実施（10/8-10/9）
   - 統合テスト再実施（10/10-10/11）
4. ⬜ **🆕 MySQL移行報告書作成（10/11）**
5. ⬜ 技術質問対応（Slack #llm-integration）
6. ⬜ **🆕 共同確認ミーティング参加（10/11金曜15:00）**
7. ⬜ 週次ミーティング参加（10/12金曜15:00）

### Phase 2-5準備項目
1. ⬜ 技術仕様書の作成
2. ⬜ API仕様の詳細設計
3. ⬜ セキュリティポリシーの策定

---

## Phase 7: PersonalStation・Dashboard統合実装【新規追加】🆕

### 実施期間: 2025年11月4日〜12月5日（4週間）

### 概要

VoiceDrive PersonalStationページ・Dashboardページに必要な医療システム側のAPI・Webhookを実装し、VoiceDrive側のDB拡張・統計機能を完成させます。

**目的**:
- PersonalStationページで職員の経験年数を正確に表示
- Dashboardページで職員の活動統計（投票数、投稿数）を実データで表示
- VoiceDrive活動統計（投票数、影響力スコア）を実データで表示
- 投票履歴の永続化と正確な管理

**重要**: DashboardはPersonalStationの実装を流用するため、追加の医療システム側実装は不要

**関連ドキュメント**:
- [PersonalStation DB要件分析_20251008.md](./mcp-shared/docs/PersonalStation_DB要件分析_20251008.md)
- [Response_PersonalStation_DB_Requirements_20251009.md](./mcp-shared/docs/Response_PersonalStation_DB_Requirements_20251009.md)
- [PersonalStation暫定マスターリスト_20251008.md](./mcp-shared/docs/PersonalStation暫定マスターリスト_20251008.md)
- [Dashboard DB要件分析_20251009.md](./mcp-shared/docs/Dashboard_DB要件分析_20251009.md)
- [Dashboard暫定マスターリスト_20251009.md](./mcp-shared/docs/Dashboard暫定マスターリスト_20251009.md)

---

### 7.1 Phase 1実装: 経験年数API + Dashboard同時実装（11月4日〜8日）

#### 医療システム側

**新規API実装**:
```typescript
// API-2: GET /api/v2/employees/{employeeId}/experience-summary
// 経験年数サマリ取得（VoiceDrive PersonalStation・Dashboard用）
```

**実装タスク**:
| 日付 | タスク | 成果物 | 担当 |
|------|--------|-------|------|
| 11月4日（月） | API-2設計、WorkExperienceテーブル確認 | 設計書 | 医療システムチーム |
| 11月5日（火） | API-2実装開始 | src/api/routes/employee.routes.ts | 医療システムチーム |
| 11月6日（水） | API-2実装完了、単体テスト作成 | テストコード | 医療システムチーム |
| 11月7日（木） | API-2ドキュメント作成 | API仕様書 | 医療システムチーム |
| 11月8日（金） | VoiceDriveチームへのAPI提供準備完了通知 | 準備完了通知書 | 医療システムチーム |

**レスポンス仕様**:
```json
{
  "employeeId": "EMP001",
  "yearsOfService": 4.5,              // 当法人での勤続年数
  "totalExperienceYears": 8.2,        // 総職務経験年数（前職含む）
  "currentPositionYears": 2.1,        // 現職での年数
  "priorExperience": 3.7,             // 前職経験年数
  "specialtyExperienceYears": 6.5,    // 専門分野経験年数
  "calculatedAt": "2025-11-04T10:00:00.000Z"
}
```

**依存テーブル**:
- ✅ `Employee`: yearsOfService, hireDate, professionCategory
- ✅ `WorkExperience`: startDate, endDate, profession（既存実装済み）

#### VoiceDrive側

**DB拡張**:
```prisma
model User {
  // 🆕 PersonalStation用
  experienceYears          Float?    @map("experience_years")
  experienceLastUpdatedAt  DateTime? @map("experience_last_updated_at")
}
```

**実装タスク**:
| 日付 | タスク | 成果物 | 担当 |
|------|--------|-------|------|
| 11月4日（月） | Userテーブル拡張、Prisma migrate実行 | prisma/schema.prisma | VoiceDriveチーム |
| 11月5日〜7日 | MedicalSystemClient拡張（API-2呼び出し） | src/services/MedicalSystemClient.ts | VoiceDriveチーム |
| 11月7日〜8日 | PersonalStation修正（experienceYears表示） | src/pages/PersonalStationPage.tsx | VoiceDriveチーム |
| 11月7日〜8日 | **🆕 Dashboard同時実装（PersonalStation流用）** | src/pages/Dashboard.tsx | VoiceDriveチーム |

#### 統合テスト（11月9日）

| テスト内容 | 期待結果 | 担当 |
|----------|---------|------|
| API-2経験年数計算の正確性確認 | 前職経験+勤続年数が正しく集計される | 両チーム |
| PersonalStation表示確認 | 実データでexperienceYearsが表示される | 両チーム |
| **Dashboard表示確認** | **実データでexperienceYears、投票数、投稿数が表示される** | **VoiceDriveチーム** |

**Phase 1完了時の動作範囲**:

**PersonalStation**:
- ✅ ユーザー基本情報表示（名前、部署、役職、**経験年数**）
- ✅ 権限レベル表示
- ✅ マイポスト表示
- ⚠️ 統計カード（ダミーデータのまま）
- ⚠️ 投票履歴（不正確のまま）

**Dashboard（🆕 同時実装）**:
- ✅ ユーザー基本情報表示（名前、部署、施設、役職、**経験年数**）
- ✅ 権限レベル表示
- ✅ 投票参加数（実データ）
- ✅ 投稿したアイデア数（実データ）
- ⚠️ 承認待ち議題（Post.status確認後に実装）
- ⚠️ 部署効率スコア（計算方法確定後に実装）

---

### 7.2 Phase 2実装: 投票履歴・統計機能（11月11日〜18日）

#### VoiceDrive側のみ（医療システム側は関与なし）

**新規テーブル追加**:
```prisma
model VoteHistory {
  id            String    @id @default(cuid())
  userId        String    @map("user_id")
  postId        String    @map("post_id")
  voteOption    String    @map("vote_option")
  voteWeight    Float     @default(1.0) @map("vote_weight")
  votedAt       DateTime  @default(now()) @map("voted_at")
  postCategory  String?   @map("post_category")
  postType      String?   @map("post_type")

  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  post          Post      @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@unique([userId, postId])
  @@index([userId])
  @@index([postId])
  @@index([votedAt])
  @@map("vote_history")
}
```

**実装タスク**:
| 日付 | タスク | 成果物 | 担当 |
|------|--------|-------|------|
| 11月11日（月） | VoteHistoryテーブル追加、Prisma migrate実行 | prisma/schema.prisma | VoiceDriveチーム |
| 11月12日〜14日 | 投票記録処理実装（recordVote関数） | src/services/VoteService.ts | VoiceDriveチーム |
| 11月14日〜16日 | 統計集計実装（UserActivityService） | src/services/UserActivityService.ts | VoiceDriveチーム |
| 11月16日〜18日 | PersonalStation修正（ダミーデータ削除） | src/pages/PersonalStationPage.tsx | VoiceDriveチーム |

**統計集計機能**:
- `getUserVoteStats(userId)`: 総投票数、今月の投票数、影響力スコア
- `getVoteStatsByCategory(userId)`: カテゴリ別投票実績
- `getUserVotedPosts(userId)`: 投票履歴取得

**Phase 2完了時の動作範囲**:
- ✅ 統計カード（実データ）
- ✅ カテゴリ別投票実績（実データ）
- ✅ 投票履歴（正確）

---

### 7.3 Phase 3実装: パフォーマンス最適化（11月18日〜22日）

#### VoiceDrive側のみ（医療システム側は関与なし）

**新規テーブル追加**:
```prisma
model UserActivitySummary {
  id                String   @id @default(cuid())
  userId            String   @unique @map("user_id")
  totalPosts        Int      @default(0) @map("total_posts")
  totalVotes        Int      @default(0) @map("total_votes")
  thisMonthVotes    Int      @default(0) @map("this_month_votes")
  impactScore       Float    @default(0) @map("impact_score")
  lastCalculatedAt  DateTime @default(now()) @map("last_calculated_at")

  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_activity_summary")
}
```

**実装タスク**:
| 日付 | タスク | 成果物 | 担当 |
|------|--------|-------|------|
| 11月18日（月） | UserActivitySummaryテーブル追加、migrate実行 | prisma/schema.prisma | VoiceDriveチーム |
| 11月19日〜21日 | 日次バッチ実装（全ユーザー統計集計） | src/jobs/calculateUserActivitySummary.ts | VoiceDriveチーム |
| 11月21日〜22日 | PersonalStation最適化 | src/pages/PersonalStationPage.tsx | VoiceDriveチーム |

**日次バッチ仕様**:
- 実行時刻: 毎日 03:00 JST（医療システムの02:00バッチの後）
- 対象: 全ユーザー
- 処理内容: VoteHistory集計 → UserActivitySummary更新

**Phase 3完了時の動作範囲**:
- ✅ 高速な統計表示（事前集計データ使用）
- ✅ スケーラビリティ向上（1000ユーザー対応）

---

### 7.4 Webhook実装（11月11日〜15日）

#### 医療システム側

**Webhook-2: 経験年数更新通知**

**送信タイミング**: 日次バッチ（毎日 02:00 JST）
**送信条件**: 前回計算値と比較して変更があった職員のみ

**実装タスク**:
| 日付 | タスク | 成果物 | 担当 |
|------|--------|-------|------|
| 11月11日（月） | Webhook-2設計（日次バッチ） | 設計書 | 医療システムチーム |
| 11月12日（火） | Webhook-2実装開始 | src/jobs/updateExperienceYears.ts | 医療システムチーム |
| 11月13日（水） | Webhook-2実装完了、テスト | テストコード | 医療システムチーム |
| 11月14日（木） | Webhook-4（復職）実装 | src/webhooks/employee-reinstated.ts | 医療システムチーム |
| 11月15日（金） | Webhook実装完了通知 | 完了通知書 | 医療システムチーム |

**ペイロード仕様**:
```json
{
  "eventType": "employee.experience.updated",
  "timestamp": "2025-11-12T02:00:00.000Z",
  "employeeId": "EMP001",
  "experienceSummary": {
    "yearsOfService": 4.5,
    "totalExperienceYears": 8.2,
    "currentPositionYears": 2.1,
    "specialtyExperienceYears": 6.5
  },
  "signature": "hmac_sha256_signature_here"
}
```

**Webhook-4: 復職通知**

**送信タイミング**: 職員復職時（リアルタイム）
**ペイロード**: `employee.reinstated`イベント

---

### 7.5 全体統合テスト（11月25日〜30日）

#### テスト項目

| テスト内容 | 期待結果 | 担当 |
|----------|---------|------|
| **API-2テスト** | 経験年数が正確に計算される | 両チーム |
| **Webhook-2テスト** | 日次バッチで経験年数更新が送信される | 両チーム |
| **投票履歴テスト** | VoteHistoryに正確に記録される | VoiceDriveチーム |
| **統計表示テスト** | 実データで統計カードが表示される | VoiceDriveチーム |
| **パフォーマンステスト** | 1000ユーザーでも1秒以内に表示 | VoiceDriveチーム |
| **セキュリティテスト** | JWT認証、HMAC署名検証が正常動作 | 両チーム |

#### 統合テストシナリオ

```
1. 職員登録 → API-2で経験年数取得 → PersonalStationに表示
2. 日次バッチ → Webhook-2送信 → VoiceDrive User更新
3. 投票実施 → VoteHistory記録 → 統計カード更新
4. 日次バッチ → UserActivitySummary更新 → 高速表示確認
```

---

### 7.6 本番環境デプロイ（12月2日〜4日）

#### デプロイ手順

**医療システム側**:
1. API-2を本番環境にデプロイ
2. Webhook-2日次バッチを本番cronに登録
3. Webhook-4を本番イベントハンドラに登録
4. 本番環境動作確認

**VoiceDrive側**:
1. Prisma migrateを本番DBに実行
2. MedicalSystemClient、VoteService、UserActivityServiceをデプロイ
3. PersonalStationページをデプロイ
4. 日次バッチを本番cronに登録（03:00 JST）
5. 本番環境動作確認

#### デプロイチェックリスト

- [ ] API-2本番デプロイ完了
- [ ] Webhook-2日次バッチ登録完了（02:00 JST）
- [ ] Webhook-4イベント登録完了
- [ ] VoiceDrive DB migrate完了
- [ ] VoiceDrive日次バッチ登録完了（03:00 JST）
- [ ] PersonalStationページデプロイ完了
- [ ] 本番環境統合テスト完了
- [ ] セキュリティ監査完了

---

### 7.7 本番リリース（12月5日 02:00）

#### 初回バッチ実行

**医療システム側**:
- **02:00 JST**: 全職員の経験年数を計算
- Webhook-2で変更があった職員の情報をVoiceDriveに送信

**VoiceDrive側**:
- Webhook受信 → User.experienceYears更新
- **03:00 JST**: UserActivitySummary日次バッチ実行
- 全ユーザーの統計を事前集計

#### 結果確認ミーティング

**日時**: 2025年12月5日（金） 09:00-10:00
**参加者**: 両チームリーダー、技術担当
**確認事項**:
- 初回バッチの成功確認
- PersonalStationページの表示確認
- エラーログの確認
- パフォーマンスメトリクスの確認

---

### 7.8 成功指標（KPI）

#### 技術指標

| 指標 | 目標値 | 測定方法 |
|------|--------|---------|
| API-2応答時間 | < 200ms（95%） | CloudWatch |
| PersonalStation読み込み時間 | < 1.0秒（平均） | フロントエンドメトリクス |
| Webhook-2送信成功率 | > 99% | Webhookログ |
| VoteHistory記録成功率 | 100% | DBログ |
| UserActivitySummary更新成功率 | 100% | バッチログ |

#### ビジネス指標

| 指標 | 目標値 | 測定方法 |
|------|--------|---------|
| 経験年数表示精度 | 100% | 手動サンプリング検証 |
| 統計データ精度 | 100% | VoteHistoryとの照合 |
| ユーザー満足度 | > 4.5/5.0 | PersonalStation利用アンケート |
| 投票参加率向上 | +20% | 統計カード導入前後比較 |

#### 運用指標

| 指標 | 目標値 | 測定方法 |
|------|--------|---------|
| 日次バッチ成功率 | 100% | Cronログ |
| データ同期遅延 | < 24時間 | Webhook受信ログ |
| インシデント発生率 | 0件/週 | インシデント管理 |

---

### 7.9 リスク管理

#### 想定リスクと対策

| リスク | 影響度 | 対策 |
|--------|--------|------|
| WorkExperienceテーブル未構築 | 🔴 HIGH | Phase 1では`yearsOfService`のみ返す代替案を準備済み |
| API-2の計算ロジック不正確 | 🟡 MEDIUM | 単体テスト、統合テストで精度検証 |
| Webhook-2送信失敗 | 🟡 MEDIUM | リトライ機構実装（最大3回、30分間隔） |
| VoteHistory記録漏れ | 🔴 HIGH | トランザクション処理、エラーハンドリング強化 |
| 日次バッチタイムアウト | 🟡 MEDIUM | バッチ処理最適化、並列処理検討 |
| PersonalStation表示遅延 | 🟢 LOW | Phase 3でUserActivitySummary導入により解決 |

---

### 7.10 コスト見積もり

#### 開発工数

| 項目 | 工数 | 金額 |
|-----|------|------|
| 医療システム側（API-2、Webhook実装） | 5人日 | ¥250,000 |
| VoiceDrive側（DB拡張、統計機能実装） | 10人日 | ¥500,000 |
| 統合テスト | 3人日 | ¥150,000 |
| ドキュメント作成 | 2人日 | ¥100,000 |
| **合計** | **20人日** | **¥1,000,000** |

#### 運用コスト

| 項目 | 金額 |
|-----|------|
| Lightsail統合インスタンス（16GB）追加負荷 | ¥0（既存インフラ内で対応） |
| 日次バッチ実行コスト | ¥0（cronジョブ） |
| **合計** | **¥0/月** |

---

### 7.11 次のアクション

#### 即時実行項目（11月1日〜3日）

**医療システム側**:
1. ⬜ API-2設計書作成
2. ⬜ WorkExperienceテーブル仕様確認
3. ⬜ 単体テストシナリオ作成
4. ⬜ Webhook-2設計書作成

**VoiceDrive側**:
1. ⬜ schema.prisma最終確認（experienceYears、VoteHistory、UserActivitySummary）
2. ⬜ マイグレーションファイル生成（--create-onlyで準備）
3. ⬜ MedicalSystemClient拡張準備
4. ⬜ VoteService、UserActivityService設計

#### Phase 1開始（11月4日）

**医療システム側**:
1. ⬜ API-2実装開始
2. ⬜ 単体テスト作成

**VoiceDrive側**:
1. ⬜ Prisma migrate実行
2. ⬜ MedicalSystemClient拡張開始

---

### 7.12 関連ドキュメント

#### 既存ドキュメント

**PersonalStation関連**:
- [PersonalStation DB要件分析_20251008.md](./mcp-shared/docs/PersonalStation_DB要件分析_20251008.md)
- [Response_PersonalStation_DB_Requirements_20251009.md](./mcp-shared/docs/Response_PersonalStation_DB_Requirements_20251009.md)
- [PersonalStation暫定マスターリスト_20251008.md](./mcp-shared/docs/PersonalStation暫定マスターリスト_20251008.md)

**Dashboard関連（🆕 追加）**:
- [Dashboard DB要件分析_20251009.md](./mcp-shared/docs/Dashboard_DB要件分析_20251009.md)
- [Dashboard暫定マスターリスト_20251009.md](./mcp-shared/docs/Dashboard暫定マスターリスト_20251009.md)

**共通**:
- [データ管理責任分界点定義書_20251008.md](./mcp-shared/docs/データ管理責任分界点定義書_20251008.md)

#### 作成予定ドキュメント
- [ ] API-2仕様書（11月7日）
- [ ] Webhook-2仕様書（11月13日）
- [ ] Webhook-4仕様書（11月14日）
- [ ] Phase 1統合テスト報告書（PersonalStation + Dashboard）（11月9日）
- [ ] Phase 2統合テスト報告書（11月18日）
- [ ] 全体統合テスト報告書（11月30日）
- [ ] 本番リリース報告書（12月5日）

---

## Phase 8: DepartmentStation統合実装【新規追加】🆕

### 実施期間: 2025年11月7日〜15日（9日間）

### 概要

VoiceDrive DepartmentStationページに必要な医療システム側の新規API（2件）を実装し、VoiceDrive側でPostテーブル作成および部門統計集計機能を実装します。

**Phase 7との違い**:
- Phase 7（PersonalStation・Dashboard）: 医療システム側の新規実装ゼロ、既存API流用のみ
- Phase 8（DepartmentStation）: 医療システム側の新規API実装2件必要、VoiceDrive側も新規テーブル作成必須

**目的**:
- DepartmentStationページで部門メンバー情報を医療システムから取得
- 部門統計（総メンバー数、権限レベル分布）を医療システムから取得
- 部門投稿機能の実装（VoiceDrive内部のPostテーブル作成）
- 部門プロジェクト統計の集計機能実装

**重要**: DepartmentStationは現在100%デモデータで動作。実データ統合が未実装。

**関連ドキュメント**:
- [DepartmentStation DB要件分析_20251009.md](./mcp-shared/docs/DepartmentStation_DB要件分析_20251009.md)
- [DepartmentStation暫定マスターリスト_20251009.md](./mcp-shared/docs/DepartmentStation暫定マスターリスト_20251009.md)
- [データ管理責任分界点定義書_20251008.md](./mcp-shared/docs/データ管理責任分界点定義書_20251008.md)

---

### 8.1 事前確認フェーズ（11月1日〜3日）

#### 医療システム側への確認事項（回答期限：11月1日）

**確認-1: API-3レスポンス仕様の詳細**

質問1: `avatar`フィールドは含まれますか？
- Option A: ✅ YES → VoiceDriveはそのまま使用
- Option B: ❌ NO → VoiceDrive User.avatarから補完

質問2: `departmentName`（部門名）は含まれますか？
- Option A: ✅ YES → 表示に使用
- Option B: ❌ NO → VoiceDrive側でマッピング必要

質問3: `permissionLevel`は25レベル体系（1.0〜18.0、DECIMAL型）ですか？
- Option A: ✅ YES → そのまま使用
- Option B: ❌ NO → マッピング必要

**確認-2: API-4統計計算の定義**

質問1: `activeMembers`の定義は？
- Option A: 退職していない職員（isRetired=false）
- Option B: 過去30日間にログインした職員
- Option C: その他（具体的に記述）

質問2: `permissionLevelDistribution`は1〜18の全レベルを返しますか？
- Option A: ✅ YES（count=0も含む） → グラフ表示に便利
- Option B: ❌ NO（count>0のみ） → VoiceDrive側で補完

質問3: 統計の更新頻度は？
- Option A: リアルタイム（APIリクエスト毎に計算）
- Option B: 日次バッチ（02:00 JST）
- Option C: その他

**確認-3: 部門コードの標準化**

質問1: VoiceDrive User.departmentの値は、医療システムの部門コードと一致していますか？
- Option A: ✅ YES → そのまま使用可能
- Option B: ❌ NO → マッピングテーブル必要

質問2: 部門コードの形式は？
- 例: `"medical_care_ward"`, `"nursing_dept"`, `"001"`, etc.
- 現在のVoiceDrive User.departmentの値: 文字列型（例: "医療療養病棟"）

質問3: 部門マスタはWebhookで同期されますか？
- Option A: ✅ YES → Webhook仕様を共有してください
- Option B: ❌ NO → 手動同期プロセス必要

---

### 8.2 Phase 1実装: 新規API + Postテーブル作成（11月7日〜8日）

#### 医療システム側

**新規API実装（2件）**:

##### API-3: 部門メンバー一覧取得
```typescript
// GET /employees/department/{departmentCode}
// 部門の全職員リストを返す
```

**エンドポイント**: `GET /employees/department/{departmentCode}`
**認証**: JWT Bearer Token

**リクエストパラメータ**:
```typescript
// Path parameter
departmentCode: string  // 例: "medical_care_ward"

// Query parameters (optional)
activeOnly?: boolean    // デフォルト: true
```

**レスポンススキーマ**:
```json
{
  "departmentCode": "medical_care_ward",
  "departmentName": "医療療養病棟",
  "members": [
    {
      "employeeId": "EMP-2025-001",
      "name": "山田 太郎",
      "position": "看護師",
      "accountType": "NEW_STAFF",
      "permissionLevel": 1.0,
      "facilityId": "tategami_hospital",
      "facilityName": "たてがみ病院",
      "experienceYears": 3.5,
      "isActive": true
    }
  ],
  "totalMembers": 25,
  "activeMembers": 23,
  "lastUpdated": "2025-10-09T10:00:00Z"
}
```

##### API-4: 部門統計情報取得
```typescript
// GET /departments/{departmentCode}/statistics
// 部門統計（総メンバー数、権限レベル分布等）を返す
```

**エンドポイント**: `GET /departments/{departmentCode}/statistics`
**認証**: JWT Bearer Token

**レスポンススキーマ**:
```json
{
  "departmentCode": "medical_care_ward",
  "departmentName": "医療療養病棟",
  "totalMembers": 25,
  "activeMembers": 23,
  "retiredMembers": 2,
  "permissionLevelDistribution": [
    { "level": 1, "count": 15, "percentage": 60.0 },
    { "level": 2, "count": 5, "percentage": 20.0 },
    { "level": 3, "count": 3, "percentage": 12.0 }
  ],
  "averageExperienceYears": 5.3,
  "experienceDistribution": [
    { "range": "0-2年", "count": 5 },
    { "range": "3-5年", "count": 8 }
  ],
  "staffTurnoverRate": 8.5,
  "lastCalculated": "2025-10-09T02:00:00Z"
}
```

**実装タスク**:
| 日付 | タスク | 成果物 | 担当 |
|------|--------|-------|------|
| 11月4日（月） | API-3、API-4設計書作成 | 設計書 | 医療システムチーム |
| 11月5日（火） | API-3実装開始 | src/api/routes/department.routes.ts | 医療システムチーム |
| 11月6日（水） | API-3実装完了、API-4実装開始 | テストコード | 医療システムチーム |
| 11月7日（木） | API-4実装完了、単体テスト作成 | テストコード | 医療システムチーム |
| 11月8日（金） | VoiceDriveチームへのAPI提供準備完了通知 | 準備完了通知書 | 医療システムチーム |

**依存テーブル**:
- ✅ `Employee`: employeeId, name, position, permissionLevel, department, facilityId
- ✅ `WorkExperience`: experienceYears計算用（既存実装済み）

---

#### VoiceDrive側

**DB拡張（🔴 CRITICAL）**:

##### Postテーブル新規作成
```prisma
model Post {
  id              String    @id @default(cuid())
  authorId        String
  authorName      String?   // キャッシュ用（医療システムから取得）
  content         String    @db.Text
  category        String    // 改善提案, 質問相談, お知らせ, その他
  type            String    // personal, department, organization
  visibility      String    // private, department, facility, organization
  department      String?
  facilityId      String?
  tags            Json?     // タグ配列
  attachments     Json?     // 添付ファイル情報
  status          String    @default("active") // active, archived, deleted, flagged
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // リレーション
  author          User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  voteHistory     VoteHistory[]

  // インデックス
  @@index([authorId])
  @@index([department])
  @@index([facilityId])
  @@index([category])
  @@index([type])
  @@index([visibility])
  @@index([status])
  @@index([createdAt])

  @@map("posts")
}
```

**影響範囲**:
- VoteHistoryテーブル: `post Post @relation(fields: [postId], references: [id])`追加
- Userテーブル: `posts Post[]`リレーション追加

**新規サービス実装（約400行）**:

##### DepartmentStatsService.ts
```typescript
// src/services/DepartmentStatsService.ts
// 部門別投稿統計
export async function getDepartmentPostStats(
  departmentCode: string,
  timeRange: 'thisMonth' | 'lastMonth' | 'last3Months'
): Promise<DepartmentPostStats>;

// 部門別プロジェクト統計
export async function getDepartmentProjectStats(
  departmentCode: string
): Promise<DepartmentProjectStats>;

// 部門メンバーアクティビティ統計
export async function getDepartmentActivityStats(
  departmentCode: string
): Promise<DepartmentActivityStats>;
```

##### DepartmentPostService.ts
```typescript
// src/services/DepartmentPostService.ts
// 部門投稿一覧取得（ページネーション対応）
export async function getDepartmentPosts(
  departmentCode: string,
  options?: PaginationOptions
): Promise<DepartmentPostsResult>;

// 部門プロジェクト一覧取得
export async function getDepartmentProjects(
  departmentCode: string,
  statusFilter?: ProjectStatusFilter
): Promise<Project[]>;
```

**実装タスク**:
| 日付 | タスク | 成果物 | 担当 |
|------|--------|-------|------|
| 11月7日（木） | Postテーブル作成、Prisma migrate実行 | prisma/schema.prisma | VoiceDriveチーム |
| 11月7日（木） | DepartmentStatsService実装 | src/services/DepartmentStatsService.ts | VoiceDriveチーム |
| 11月7日（木） | DepartmentPostService実装 | src/services/DepartmentPostService.ts | VoiceDriveチーム |
| 11月8日（金） | DepartmentStationPage修正 | src/pages/DepartmentStationPage.tsx | VoiceDriveチーム |
| 11月8日（金） | ユニットテスト作成 | テストコード | VoiceDriveチーム |

---

#### 統合テスト（11月9日）

| テスト内容 | 期待結果 | 担当 |
|----------|---------|------|
| API-3部門メンバー取得確認 | 部門の全職員リストが取得される | 両チーム |
| API-4部門統計取得確認 | 総メンバー数、権限レベル分布が取得される | 両チーム |
| DepartmentStation表示確認 | 実データで部門メンバー、部門統計が表示される | VoiceDriveチーム |
| 部門投稿表示確認 | Postテーブルから部門投稿が表示される | VoiceDriveチーム |

**Phase 1完了時の動作範囲**:

**DepartmentStation**:
- ✅ 部門メンバー一覧表示（実データ、API-3）
- ✅ 部門概要タブ - 総メンバー数（実データ、API-4）
- ✅ 部門概要タブ - アクティブプロジェクト数（実データ、VoiceDrive集計）
- ✅ 部門概要タブ - 今月の投稿数（実データ、VoiceDrive集計）
- ✅ 部門投稿タブ（実データ、Postテーブル）
- ✅ 部門プロジェクトタブ（実データ、Projectテーブル）
- ✅ 部門分析タブ - アクティブメンバー数（実データ、API-4）
- ✅ 部門分析タブ - 権限レベル分布（実データ、API-4）
- ⚠️ プロジェクトメンバー数（暫定対応、Json型からパース）
- ⚠️ プロジェクト期限（暫定対応、Json型からパース）

---

### 8.3 Phase 2実装: プロジェクトスキーマ拡張（11月11日〜15日）任意

#### VoiceDrive側のみ（医療システム側は関与なし）

**新規テーブル追加**:
```prisma
model ProjectMember {
  id          String   @id @default(cuid())
  projectId   String
  userId      String
  role        String?  // プロジェクトリーダー, メンバー, アドバイザー
  joinedAt    DateTime @default(now())
  leftAt      DateTime?
  isActive    Boolean  @default(true)
  contribution Float   @default(0)  // 貢献度（0-100）

  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([projectId, userId])
  @@index([projectId])
  @@index([userId])
  @@index([isActive])

  @@map("project_members")
}
```

**Projectテーブル拡張**:
```prisma
model Project {
  // ... 既存フィールド

  // 🆕 追加フィールド
  deadline         DateTime?  // プロジェクト期限
  department       String?    // 主管部門

  // 🆕 リレーション追加
  members          ProjectMember[]  // プロジェクトメンバー
}
```

**実装タスク**:
| 日付 | タスク | 成果物 | 担当 |
|------|--------|-------|------|
| 11月11日（月） | ProjectMemberテーブル作成、Prisma migrate実行 | prisma/schema.prisma | VoiceDriveチーム |
| 11月12日（火） | Project.deadline追加 | prisma/schema.prisma | VoiceDriveチーム |
| 11月13日（水） | ページネーション実装（部門投稿） | src/pages/DepartmentStationPage.tsx | VoiceDriveチーム |
| 11月14日（木） | フィルタリング機能実装 | src/pages/DepartmentStationPage.tsx | VoiceDriveチーム |
| 11月15日（金） | Phase 2統合テスト | テスト報告書 | VoiceDriveチーム |

**Phase 2完了時の動作範囲**:
- ✅ プロジェクトメンバー数（正確、ProjectMemberテーブル）
- ✅ プロジェクト期限（正確、Project.deadline）
- ✅ 部門投稿のページネーション
- ✅ カテゴリ別フィルタリング

---

### 8.4 成功指標（KPI）

#### 技術指標

| 指標 | 目標値 | 測定方法 |
|------|--------|---------|
| API-3応答時間 | < 300ms（95%） | CloudWatch |
| API-4応答時間 | < 500ms（95%） | CloudWatch |
| DepartmentStation読み込み時間 | < 2.0秒（平均） | フロントエンドメトリクス |
| Post挿入成功率 | 100% | DBログ |
| 部門統計計算精度 | 100% | 手動サンプリング検証 |

#### ビジネス指標

| 指標 | 目標値 | 測定方法 |
|------|--------|---------|
| 部門メンバー表示精度 | 100% | API-3とVoiceDrive User照合 |
| 部門統計表示精度 | 100% | API-4との照合 |
| ユーザー満足度 | > 4.0/5.0 | DepartmentStation利用アンケート |
| 部門投稿利用率 | > 60% | 部門メンバーの投稿率 |

#### 運用指標

| 指標 | 目標値 | 測定方法 |
|------|--------|---------|
| API-3、API-4稼働率 | > 99.5% | APIヘルスチェックログ |
| データ同期遅延 | < 5秒 | Webhook受信ログ |
| インシデント発生率 | 0件/週 | インシデント管理 |

---

### 8.5 リスク管理

#### 想定リスクと対策

| リスク | 影響度 | 対策 |
|--------|--------|------|
| Postテーブル作成失敗 | 🔴 HIGH | Phase 1で優先的に実装、リレーション整合性確認 |
| API-3、API-4実装遅延 | 🔴 HIGH | 11月1日までの確認事項回答で早期着手 |
| 部門コード不一致 | 🟡 MEDIUM | 確認-3で事前確認、マッピングテーブル準備 |
| 大規模部門のパフォーマンス低下 | 🟡 MEDIUM | ページネーション実装、インデックス最適化 |
| VoteHistory外部キー制約エラー | 🟡 MEDIUM | マイグレーション前に既存データ確認 |

---

### 8.6 コスト見積もり

#### 開発工数

| 項目 | 工数 | 金額 |
|-----|------|------|
| 医療システム側（API-3、API-4実装） | 3人日 | ¥150,000 |
| VoiceDrive側（Post作成、サービス実装） | 5人日 | ¥250,000 |
| 統合テスト | 2人日 | ¥100,000 |
| ドキュメント作成 | 1人日 | ¥50,000 |
| **合計** | **11人日** | **¥550,000** |

#### 運用コスト

| 項目 | 金額 |
|-----|------|
| Lightsail統合インスタンス（16GB）追加負荷 | ¥0（既存インフラ内で対応） |
| Postテーブルストレージ増加 | ¥0（想定容量：100MB/月） |
| **合計** | **¥0/月** |

---

### 8.7 次のアクション

#### 即時実行項目（11月1日〜3日）

**医療システム側**:
1. ⬜ 確認-1〜3の回答提出（11月1日）
2. ⬜ API-3、API-4設計書作成
3. ⬜ 部門マスタの確認（departmentCode標準化）
4. ⬜ 単体テストシナリオ作成

**VoiceDrive側**:
1. ⬜ Postテーブルスキーマ最終確認
2. ⬜ マイグレーションファイル生成（--create-onlyで準備）
3. ⬜ DepartmentStatsService、DepartmentPostService設計
4. ⬜ VoteHistoryリレーション修正計画

#### Phase 1開始（11月7日）

**医療システム側**:
1. ⬜ API-3実装開始
2. ⬜ API-4実装開始
3. ⬜ 単体テスト作成

**VoiceDrive側**:
1. ⬜ Prisma migrate実行（Postテーブル作成）
2. ⬜ DepartmentStatsService実装開始
3. ⬜ DepartmentPostService実装開始

---

### 8.8 関連ドキュメント

#### 既存ドキュメント
- [DepartmentStation DB要件分析_20251009.md](./mcp-shared/docs/DepartmentStation_DB要件分析_20251009.md)
- [DepartmentStation暫定マスターリスト_20251009.md](./mcp-shared/docs/DepartmentStation暫定マスターリスト_20251009.md)
- [データ管理責任分界点定義書_20251008.md](./mcp-shared/docs/データ管理責任分界点定義書_20251008.md)

#### 作成予定ドキュメント
- [ ] API-3仕様書（11月7日）
- [ ] API-4仕様書（11月7日）
- [ ] Postテーブル設計書（11月7日）
- [ ] Phase 1統合テスト報告書（DepartmentStation）（11月9日）
- [ ] Phase 2統合テスト報告書（11月15日、任意）

---

### Phase 2-5準備項目
1. ⬜ 技術仕様書の作成
2. ⬜ API仕様の詳細設計
3. ⬜ セキュリティポリシーの策定

---

## Phase 8.5: TeamLeaderDashboard統合実装【新規追加】🆕

### 実施期間: 2025年11月18日〜26日（9日間）

### 概要

VoiceDrive TeamLeaderDashboardページに必要な医療システム側の対応を確認し、VoiceDrive側で承認タスク管理機能（ApprovalTaskテーブル）を実装します。

**Phase 8との関係**:
- Phase 8（DepartmentStation）: 部門メンバー・統計API実装、Postテーブル作成
- Phase 8.5（TeamLeaderDashboard）: **Team概念の有無を確認**し、既存API流用またはチームメンバーAPI新規実装

**🔴 CRITICAL決定事項**: 医療システムに「Team」概念が存在するか？
- **Option A（Team概念あり）**: チーム別API実装必要（約5人日追加）
- **Option B（Team概念なし、推奨）**: DepartmentStation API-3を流用（追加実装ゼロ）

**目的**:
- チームリーダー向けダッシュボードで承認タスク管理機能の実装
- チームメンバー情報の取得（Team概念の有無により実装方法が変わる）
- チーム統計情報の表示（VoiceDrive内部集計）
- 承認フロー機能の実装（VoiceDrive ApprovalTaskテーブル作成）

**重要**: TeamLeaderDashboardは現在100%デモデータで動作。実データ統合が未実装。

**関連ドキュメント**:
- [TeamLeaderDashboard DB要件分析_20251009.md](./mcp-shared/docs/TeamLeaderDashboard_DB要件分析_20251009.md)
- [TeamLeaderDashboard暫定マスターリスト_20251009.md](./mcp-shared/docs/TeamLeaderDashboard暫定マスターリスト_20251009.md)（訂正版: Option B採用）
- [TeamLeaderService実装計画_20251009.md](./mcp-shared/docs/TeamLeaderService実装計画_20251009.md) 🆕 **VoiceDriveチームから受領（10月10日）**
- [Response_TeamLeaderDashboard_Confirmation_20251009.md](./mcp-shared/docs/Response_TeamLeaderDashboard_Confirmation_20251009.md)（医療システムチーム回答）
- [Clarification_TeamLeaderDashboard_API_Requirement_20251009.md](./mcp-shared/docs/Clarification_TeamLeaderDashboard_API_Requirement_20251009.md)（医療システムチーム再確認依頼）
- [Response_VoiceDrive_TeamLeaderDashboard_Clarification_20251009.md](./mcp-shared/docs/Response_VoiceDrive_TeamLeaderDashboard_Clarification_20251009.md)（VoiceDriveチーム再確認回答）
- [データ管理責任分界点定義書_20251008.md](./mcp-shared/docs/データ管理責任分界点定義書_20251008.md)

---

### 8.5.1 事前確認フェーズ完了（10月10日回答済み）✅

#### 医療システム側からの回答（回答日：10月10日）

**確認-1: 「Team（チーム）」概念の存在 🔴 CRITICAL** ✅ **回答済み**

質問1: 医療システムのデータベースに「Team」または「チーム」概念は存在しますか？

**回答**: ❌ **NO（Option B採用）**

**採用シナリオ**: **Team = Department のエイリアス**

| 概念 | 医療システム | VoiceDrive表示 |
|------|------------|---------------|
| Team | Department（部門） | "チーム"として表示 |
| TeamLeader | permissionLevel >= 2.0 | "チームリーダー"として表示 |
| チームメンバー | 同じDepartmentのEmployee | API-3で取得 |

**影響**:
- ✅ 医療システム側: 追加実装ゼロ（API-3をそのまま流用）
- ✅ VoiceDrive側: DepartmentStationコンポーネント流用、表示名のみ変更
- ✅ 開発工数削減: 5人日削減
- ✅ 開発コスト削減: **¥225,000削減**

---

**確認-2: 承認ワークフローの権限管理** ✅ **回答済み**

質問1: 医療システム側で承認権限を管理していますか？

**回答**: ❌ **NO（Option B採用）**

**承認権限の判定基準**（VoiceDrive側で実装）:

| permissionLevel | 役職例 | 承認可能範囲 |
|----------------|-------|------------|
| 1.0 | 新人職員 | ❌ 承認権限なし |
| 2.0〜4.0 | 中堅職員、主任 | ✅ 部門内の一部承認（休暇申請等） |
| 5.0〜9.0 | 統括主任、副課長 | ✅ 部門内の全承認 + 経費精算 |
| 10.0〜18.0 | 課長以上、施設管理者 | ✅ 施設全体の承認 |

質問3: 承認履歴を医療システム側で管理する必要がありますか？

**回答**: ❌ **NO（Option B採用）**

**承認履歴管理**: VoiceDrive内部のApprovalTaskテーブルのみで管理

**影響**:
- ✅ 医療システム側: 追加実装ゼロ（承認権限API不要、Webhook受信不要）
- ✅ VoiceDrive側: permissionLevelベースの判定ロジック実装（約50行）

---

**確認-3: チーム統計の計算方法** ✅ **回答済み**

質問1: 「チームのアクティブメンバー数」の定義は？

**回答**: **Option A: 退職していない職員（isRetired=false）**

質問2: チーム統計は医療システム側で計算しますか、VoiceDrive側で計算しますか？

**回答**: **Option B（推奨）: VoiceDrive側で計算**

**チーム統計の計算方針**:
- 医療システムから取得: 部門メンバー一覧（API-3）、部門統計（API-4）
- VoiceDrive側で計算: プロジェクト数、投稿数、承認タスク数

質問3: チームプロジェクトの紐付けは？

**回答**: **Option B（推奨）: VoiceDriveで管理**

**実装**: VoiceDrive Projectテーブルの`department`フィールドを使用（Team = Department）

**影響**:
- ✅ 医療システム側: 追加実装ゼロ（API-3、API-4で必要なデータ提供済み）
- ✅ VoiceDrive側: TeamStatsService実装（約200行、VoiceDrive内部集計のみ）

---

#### 確認フェーズ完了サマリ

**医療システム側の追加実装**: **ゼロ**
**開発コスト削減**: **¥225,000**
**実装方式**: DepartmentStation成果物の完全流用

**詳細回答書**:
- [Response_TeamLeaderDashboard_Confirmation_20251009.md](./mcp-shared/docs/Response_TeamLeaderDashboard_Confirmation_20251009.md) ✅ **医療システムチームから回答（10月9日）**
- [Clarification_TeamLeaderDashboard_API_Requirement_20251009.md](./mcp-shared/docs/Clarification_TeamLeaderDashboard_API_Requirement_20251009.md) ✅ **医療システムチームから再確認依頼（10月10日）**
- [Response_VoiceDrive_TeamLeaderDashboard_Clarification_20251009.md](./mcp-shared/docs/Response_VoiceDrive_TeamLeaderDashboard_Clarification_20251009.md) ✅ **VoiceDriveチームから再確認回答（10月10日）**

**🎉 確認フェーズ完全完了**: Option B採用を両チームで最終確認（10月10日完了）

---

### 8.5.2 Phase 1実装: ApprovalTaskテーブル作成（11月18日〜22日）

#### VoiceDrive側（主な実装）

**DB拡張（🔴 CRITICAL）**:

##### ApprovalTaskテーブル新規作成
```prisma
model ApprovalTask {
  id              String    @id @default(cuid())
  taskType        String    // leave_request, expense_report, interview_sheet, time_off, etc.
  title           String
  description     String?   @db.Text
  requesterId     String    // 申請者のuserId
  requesterName   String?   // キャッシュ用
  approverId      String?   // 承認者のuserId（未割当時null）
  approverName    String?   // キャッシュ用
  status          String    @default("pending") // pending, approved, rejected, cancelled
  priority        String    @default("normal") // low, normal, high, urgent
  category        String?   // 休暇申請, 経費精算, 面談シート, etc.

  // メタデータ
  metadata        Json?     // タスク固有の詳細情報（日付、金額等）
  attachments     Json?     // 添付ファイル情報
  comments        Json?     // コメント履歴

  // 期限管理
  dueDate         DateTime?
  submittedAt     DateTime  @default(now())
  reviewedAt      DateTime? // 承認/却下日時

  // リレーション
  requester       User      @relation("RequesterTasks", fields: [requesterId], references: [id], onDelete: Cascade)
  approver        User?     @relation("ApproverTasks", fields: [approverId], references: [id], onDelete: SetNull)

  // インデックス
  @@index([requesterId])
  @@index([approverId])
  @@index([status])
  @@index([taskType])
  @@index([priority])
  @@index([dueDate])
  @@index([submittedAt])

  @@map("approval_tasks")
}
```

**影響範囲**:
- Userテーブル: 以下のリレーション追加
  ```prisma
  requesterTasks  ApprovalTask[]  @relation("RequesterTasks")
  approverTasks   ApprovalTask[]  @relation("ApproverTasks")
  ```

**新規サービス実装（約600行）**:

##### TeamLeaderService.ts（🆕 統合サービス、約600行）

**実装計画書**: [TeamLeaderService実装計画_20251009.md](./mcp-shared/docs/TeamLeaderService実装計画_20251009.md)

```typescript
// src/services/TeamLeaderService.ts
// TeamLeaderDashboard用統合サービス

class TeamLeaderService {
  // 1. チームメンバー情報取得（API-3流用）
  async getTeamMembers(leaderId: string): Promise<TeamMember[]>;

  // 2. 承認待ちタスク取得
  async getPendingApprovals(leaderId: string): Promise<ApprovalTask[]>;

  // 3. 承認/却下操作
  async respondToApproval(
    taskId: string,
    decision: 'APPROVED' | 'REJECTED',
    comment?: string
  ): Promise<ApprovalTask>;

  // 4. 最近の活動取得（Post、Vote、ApprovalTask集計）
  async getRecentActivities(leaderId: string, limit = 10): Promise<Activity[]>;

  // 5. チーム統計算出（メンバー数、承認待ち件数、効率）
  async getTeamMetrics(leaderId: string): Promise<TeamMetrics>;
}
```

**主要メソッド詳細**:

1. **getTeamMembers()**: DepartmentStation API-3を呼び出し、「チーム」として表示
   - データソース: 🔵 医療システム API-3
   - パフォーマンススコア: 暫定的に permissionLevel * 30 + 50 で算出
   - Phase 8.6でV3Assessmentデータ統合予定

2. **getPendingApprovals()**: ApprovalTaskテーブルからステータス「PENDING」を抽出
   - データソース: 🟢 VoiceDrive ApprovalTask
   - フィルター: approverId = leaderId, status = 'PENDING'
   - ソート: 提出日時降順

3. **respondToApproval()**: ApprovalTaskのステータス更新
   - データソース: 🟢 VoiceDrive ApprovalTask（更新）、UserActivity（記録）
   - 処理: ステータス更新、承認日時記録、活動ログ追加

4. **getRecentActivities()**: チーム内の最新活動集計
   - データソース: 🟢 VoiceDrive Post、Vote、ApprovalTask
   - 処理: 3種類の活動を時系列順にマージ、上位N件を返す
   - 相対時間表示: "30分前"、"2時間前"、"3日前"

5. **getTeamMetrics()**: チーム統計算出
   - データソース: 🔵 医療システム API-3（メンバー数）、🟢 VoiceDrive ApprovalTask（効率）
   - 算出項目:
     - memberCount: チームメンバー数
     - pendingApprovals: 承認待ち件数
     - teamEfficiency: 過去30日の承認タスク完了率（%）

**戻り値型**:
```typescript
interface TeamMember {
  id: string;           // employeeId
  name: string;         // 氏名
  role: string;         // 役職
  status: string;       // active, vacation等
  performance: number;  // パフォーマンススコア（0-100）
}

interface ApprovalTask {
  id: string;
  taskType: string;
  title: string;
  description: string;
  submitterId: string;
  submitter: { employeeId: string; name: string; };
  approverId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: Date;
}

interface Activity {
  id: string;
  type: 'post' | 'vote' | 'approval';
  message: string;
  time: string;  // 相対時間（例: "30分前"）
}

interface TeamMetrics {
  memberCount: number;       // チームメンバー数
  pendingApprovals: number;  // 承認待ち件数
  teamEfficiency: number;    // チーム効率（承認タスク完了率 0-100）
}
```

---

##### TeamStatsService.ts（既存、約200行）
```typescript
// src/services/TeamStatsService.ts
// チーム別統計集計（VoiceDrive内部データから計算）

export async function getTeamStats(
  teamIdOrDepartment: string,
  useTeamConcept: boolean
): Promise<TeamStats>;

export async function getTeamActivityStats(
  teamIdOrDepartment: string
): Promise<TeamActivityStats>;

export async function getTeamProjectStats(
  teamIdOrDepartment: string
): Promise<TeamProjectStats>;
```

##### ApprovalService.ts（既存、約200行）
```typescript
// src/services/ApprovalService.ts
// 承認タスク管理サービス

// 承認待ちタスク一覧取得（承認者視点）
export async function getPendingApprovals(
  approverId: string,
  filters?: ApprovalFilters
): Promise<ApprovalTask[]>;

// 自分が申請したタスク一覧取得（申請者視点）
export async function getMySubmittedTasks(
  requesterId: string,
  filters?: ApprovalFilters
): Promise<ApprovalTask[]>;

// 承認タスク作成
export async function createApprovalTask(
  taskData: CreateApprovalTaskInput
): Promise<ApprovalTask>;

// 承認・却下処理
export async function reviewApprovalTask(
  taskId: string,
  approverId: string,
  action: 'approve' | 'reject',
  comment?: string
): Promise<ApprovalTask>;

// 承認タスク統計取得（チームリーダー視点）
export async function getApprovalStats(
  approverId: string
): Promise<ApprovalStats>;
```

**実装タスク**:

| 日付 | タスク | 成果物 | 担当 | ステータス |
|------|--------|-------|------|----------|
| **11月18日（月）** | ApprovalTaskテーブル作成、Prisma migrate実行 | prisma/schema.prisma | VoiceDriveチーム | ⬜ 未着手 |
| **11月18日（月）** | TeamLeaderService.ts実装開始（getTeamMembers） | src/services/TeamLeaderService.ts | VoiceDriveチーム | ⬜ 未着手 |
| **11月19日（火）** | getPendingApprovals、respondToApproval実装 | TeamLeaderService.ts | VoiceDriveチーム | ⬜ 未着手 |
| **11月20日（水）** | getRecentActivities、getTeamMetrics実装 | TeamLeaderService.ts | VoiceDriveチーム | ⬜ 未着手 |
| **11月21日（木）** | ユニットテスト作成（TeamLeaderService） | src/services/__tests__/TeamLeaderService.test.ts | VoiceDriveチーム | ⬜ 未着手 |
| **11月22日（金）** | TeamLeaderDashboard.tsx修正開始（実データ統合） | src/components/dashboards/TeamLeaderDashboard.tsx | VoiceDriveチーム | ⬜ 未着手 |
| **11月25日（月）** | UI統合、統合テスト | 統合テストコード | VoiceDriveチーム | ⬜ 未着手 |
| **11月25日（月）** | チームモラルセクションをコメントアウト | TeamLeaderDashboard.tsx:224-246 | VoiceDriveチーム | ⬜ 未着手 |
| **11月26日（火）** | 最終確認、Phase 8.5完了 | 完了報告書 | 両チーム | ⬜ 未着手 |

---

#### 医療システム側

**実装パターンB採用（Team概念なし）**: ✅ **追加実装ゼロ**

**実装方式**:
- ✅ DepartmentStation API-3（部門メンバー一覧）を流用
- ✅ DepartmentStation API-4（部門統計）を流用
- ✅ VoiceDrive側でDepartmentStation用コンポーネントを流用
- ✅ TeamLeaderDashboard = DepartmentStation（表示名のみ変更）

**既存API流用**:

##### API-3: 部門メンバー一覧取得（流用）
```typescript
// GET /employees/department/{departmentCode}
// TeamLeaderDashboardでは "チームメンバー一覧" として表示
```

**エンドポイント**: `GET /employees/department/{departmentCode}`
**使用シーン**: TeamLeaderDashboardの「チームメンバー」タブ

**実装例**:
```typescript
// VoiceDrive TeamLeaderDashboard.tsx
const userDepartment = currentUser.department; // "medical_care_ward"
const teamMembers = await fetch(`/api/employees/department/${userDepartment}`);
// → "チームメンバー" として表示
```

##### API-4: 部門統計情報取得（流用）
```typescript
// GET /departments/{departmentCode}/statistics
// TeamLeaderDashboardでは "チーム統計" として表示
```

**エンドポイント**: `GET /departments/{departmentCode}/statistics`
**使用シーン**: TeamLeaderDashboardの「チーム概要」統計

**実装タスク（医療システム側）**:

| 日付 | タスク | 成果物 | 担当 |
|------|--------|-------|------|
| 10月10日（木） | 確認事項への回答書作成・送付 | 回答書 | 医療システムチーム |
| 11月23日（土） | 統合テスト参加（API-3、API-4動作確認） | テスト結果 | 医療システムチーム |

**開発工数**: **0人日**
**開発費**: **¥0**

---

### 8.5.3 統合テスト（11月23日）

| テスト内容 | 期待結果 | 担当 |
|----------|---------|------|
| 承認タスク作成確認 | ApprovalTaskテーブルに正しく保存される | VoiceDriveチーム |
| 承認・却下処理確認 | ステータスが正しく更新される（pending → approved/rejected） | VoiceDriveチーム |
| チームメンバー表示確認（API-3流用） | 部門メンバーが"チームメンバー"として表示される | 両チーム |
| チーム統計表示確認（API-4流用） | 部門統計が"チーム統計"として表示される | 両チーム |
| 承認タスク統計表示確認 | 承認待ちタスク数、今月承認数が表示される | VoiceDriveチーム |
| permissionLevel判定確認 | Level 2.0以上が承認可能、1.0は承認不可 | VoiceDriveチーム |

**Phase 1完了時の動作範囲**:

**TeamLeaderDashboard**:
- ✅ 承認待ちタスク一覧表示（実データ、ApprovalTaskテーブル）
- ✅ 承認・却下ボタン機能（実データ、ApprovalService）
- ✅ 自分が申請したタスク一覧表示（実データ、ApprovalTaskテーブル）
- ✅ チームメンバー一覧表示（実データ、API-3流用）
- ✅ チーム統計（総メンバー数、アクティブメンバー数）（実データ、VoiceDrive集計）
- ✅ チームプロジェクト一覧表示（実データ、Projectテーブル）
- ✅ 承認タスク統計（承認待ち数、今月承認数）（実データ、ApprovalTaskテーブル集計）

---

### 8.5.4 成功指標（KPI）

#### 技術指標

| 指標 | 目標値 | 測定方法 |
|------|--------|---------|
| API-3応答時間（流用） | < 300ms（95%） | CloudWatch（既存指標） |
| API-4応答時間（流用） | < 500ms（95%） | CloudWatch（既存指標） |
| ApprovalTask作成成功率 | 100% | DBログ |
| 承認・却下処理応答時間 | < 200ms（95%） | フロントエンドメトリクス |
| TeamLeaderDashboard読み込み時間 | < 2.0秒（平均） | フロントエンドメトリクス |

#### ビジネス指標

| 指標 | 目標値 | 測定方法 |
|------|--------|---------|
| 承認タスク表示精度 | 100% | ApprovalTaskテーブルとの照合 |
| チームメンバー表示精度 | 100% | API-3との照合 |
| ユーザー満足度（チームリーダー） | > 4.2/5.0 | TeamLeaderDashboard利用アンケート |
| 承認処理時間短縮率 | > 30% | 従来の紙ベース承認との比較 |

#### 運用指標

| 指標 | 目標値 | 測定方法 |
|------|--------|---------|
| ApprovalService稼働率 | > 99.5% | サービスヘルスチェックログ |
| 承認タスク処理遅延 | < 1秒 | ApprovalService処理時間ログ |
| インシデント発生率 | 0件/週 | インシデント管理 |

---

### 8.5.5 リスク管理

#### 想定リスクと対策

| リスク | 影響度 | 対策 | ステータス |
|--------|--------|------|---------|
| Team概念の有無が不明確 | 🔴 HIGH | 10月10日回答済み、Option B採用決定 | ✅ 解決済み |
| ApprovalTaskテーブル作成失敗 | 🔴 HIGH | Phase 1で優先的に実装、リレーション整合性確認 | 🟡 監視中 |
| 承認権限管理の複雑化 | 🟡 MEDIUM | permissionLevelベース判定で統一（回答書に明記済み） | ✅ 解決済み |
| 大規模部門のパフォーマンス低下 | 🟡 MEDIUM | API-3、API-4で既にページネーション対応済み | ✅ 解決済み |
| User外部キー制約エラー | 🟡 MEDIUM | マイグレーション前に既存User確認 | 🟡 監視中 |

---

### 8.5.6 コスト見積もり

#### 開発工数（Option B採用、確定）✅

| 項目 | 工数 | 金額 |
|-----|------|------|
| 医療システム側（追加実装なし） | 0人日 | ¥0 |
| VoiceDrive側（ApprovalTask作成、サービス実装） | 5人日 | ¥250,000 |
| 統合テスト | 1人日 | ¥50,000 |
| ドキュメント作成 | 0.5人日 | ¥25,000 |
| **合計（Option B採用）** | **6.5人日** | **¥325,000** |

#### コスト削減効果

| 比較項目 | Option A（Team概念あり） | Option B（採用） | 削減額 |
|---------|----------------------|---------------|-------|
| 医療システム側 | 4.5人日、¥225,000 | 0人日、¥0 | **-¥225,000** |
| VoiceDrive側 | 6.5人日、¥325,000 | 6.5人日、¥325,000 | ¥0 |
| **合計** | 11人日、¥550,000 | 6.5人日、¥325,000 | **-¥225,000** |

**コスト削減**: **¥225,000**（Option B採用により達成）

#### 運用コスト

| 項目 | 金額 |
|-----|------|
| Lightsail統合インスタンス（16GB）追加負荷 | ¥0（既存インフラ内で対応） |
| ApprovalTaskテーブルストレージ増加 | ¥0（想定容量：50MB/月） |
| **合計** | **¥0/月** |

---

### 8.5.7 次のアクション

#### 即時実行項目（10月10日〜11月17日）

**医療システム側**:
1. ✅ 確認-1〜3の回答提出（10月10日完了）
2. ✅ Team概念の存在確認完了（Option B採用決定）
3. ✅ 承認権限管理方法確認完了（permissionLevelベース判定）
4. ⬜ 統合テスト準備（11月1日〜22日）

**VoiceDrive側**:
1. ⬜ 回答書の受領・確認（10月10日〜11日）
2. ⬜ ApprovalTaskテーブルスキーマ最終設計（10月12日〜31日）
3. ⬜ ApprovalService、TeamStatsService設計（11月1日〜17日）
4. ⬜ マイグレーションファイル生成（11月15日〜17日）
5. ⬜ User外部キー制約の確認（11月17日）

#### Phase 1開始（11月18日）

**医療システム側**:
- 作業なし（待機のみ、11月23日の統合テスト参加準備）

**VoiceDrive側**:
1. ⬜ Prisma migrate実行（ApprovalTaskテーブル作成）
2. ⬜ ApprovalService実装開始
3. ⬜ TeamStatsService実装開始
4. ⬜ TeamLeaderDashboardPage修正（DepartmentStation流用）

---

### 8.5.8 関連ドキュメント

#### 既存ドキュメント
- [TeamLeaderDashboard DB要件分析_20251009.md](./mcp-shared/docs/TeamLeaderDashboard_DB要件分析_20251009.md)
- [TeamLeaderDashboard暫定マスターリスト_20251009.md](./mcp-shared/docs/TeamLeaderDashboard暫定マスターリスト_20251009.md)
- [Response_TeamLeaderDashboard_Confirmation_20251009.md](./mcp-shared/docs/Response_TeamLeaderDashboard_Confirmation_20251009.md) ✅ **10月10日作成**
- [DepartmentStation暫定マスターリスト_20251009.md](./mcp-shared/docs/DepartmentStation暫定マスターリスト_20251009.md)（API-3、API-4仕様）
- [データ管理責任分界点定義書_20251008.md](./mcp-shared/docs/データ管理責任分界点定義書_20251008.md)

#### 作成予定ドキュメント
- [ ] ApprovalTaskテーブル設計書（VoiceDriveチーム、11月18日）
- [ ] ApprovalService仕様書（VoiceDriveチーム、11月19日）
- [ ] TeamStatsService仕様書（VoiceDriveチーム、11月20日）
- [ ] Phase 1統合テスト報告書（TeamLeaderDashboard）（両チーム、11月23日）

---

## Phase 9: ComposeForm（投稿フォーム）統合実装【新規追加】🆕

### 実施期間: 2025年10月15日〜28日（14日間）

### 概要

VoiceDrive ComposeForm（投稿フォーム）の投稿データ永続化実装とWebhook統合を行います。

**🔴 CRITICAL**: 現在、ComposeFormは投稿データをどこにも保存していません（console.log()のみ）。

**目的**:
- 投稿データのデータベース保存実装（Post, Poll, Event, DataConsentテーブル）
- improvement投稿時の医療システムへのWebhook通知（`proposal.created` event）
- データ分析同意管理の実装
- 投稿作成APIの実装

**重要**: ComposeFormはVoiceDriveの中核機能（全投稿・提案の作成）

**関連ドキュメント**:
- [ComposeForm DB要件分析_20251009.md](./mcp-shared/docs/ComposeForm_DB要件分析_20251009.md)
- [ComposeForm暫定マスターリスト_20251009.md](./mcp-shared/docs/ComposeForm暫定マスターリスト_20251009.md)
- [Response_ComposeForm_Integration_20251009.md](./mcp-shared/docs/Response_ComposeForm_Integration_20251009.md)
- [データ管理責任分界点定義書_20251008.md](./mcp-shared/docs/データ管理責任分界点定義書_20251008.md)

---

### 9.1 医療システム側確認事項（10月10日回答済み）✅

#### Webhook受信エンドポイント

**回答**: ✅ **既存エンドポイント流用**

医療システムの既存Webhook受信エンドポイント `/api/webhook/voicedrive` を使用します。

**新規追加イベント**:
- `proposal.created` - VoiceDriveでimprovement投稿（議題）が作成された

**受信ペイロード**:
```json
{
  "event": "proposal.created",
  "timestamp": "2025-10-09T12:34:56.789Z",
  "data": {
    "proposalId": "proposal_1728467696789_abc123def",
    "staffId": "staff_001",
    "staffName": "田中太郎",
    "department": "看護部",
    "title": "夜勤シフトの負担軽減のため、3交代制から2交代制への移行を提案します。",
    "content": "夜勤シフトの負担軽減のため、3交代制から2交代制への移行を提案します。これにより...",
    "proposalType": "operational",
    "priority": "medium",
    "permissionLevel": 2.0,
    "expectedAgendaLevel": "部署検討レベル（30点以上で部署内検討対象）"
  }
}
```

**処理内容**:
1. 議題作成ログを `proposal_logs` テーブルに記録
2. 職員カルテに「提案活動」を `staff_activity_log` に記録
3. permissionLevel >= 5.0 の場合、上位承認者に通知
4. permissionLevel >= 8.0 の場合、委員会提出候補としてマーク

**認証方式**: ✅ API Key認証（既存実装と同じ）

**リトライポリシー**: ✅ リトライ不要（VoiceDrive現在実装で問題なし）

**詳細**: [Response_ComposeForm_Integration_20251009.md](./mcp-shared/docs/Response_ComposeForm_Integration_20251009.md)

---

### 9.2 Phase 1実装: データベーススキーマ実装（10月11日〜13日）✅ **完了**

#### VoiceDrive側（DB拡張）✅ **完了（10月9日）**

**🎉 Phase 1完了報告**: VoiceDriveチームより、全11テーブルのPrismaスキーマ実装完了報告を受領（2025年10月9日）

**完了内容**:
- ✅ Prismaスキーマ作成完了（prisma/schema.prisma lines 413-661）
- ✅ 11テーブル実装完了（Post、Vote、Comment、Poll、PollOption、PollVote、Event、ProposedDate、DateVote、Participant、DataConsent）
- ✅ 総フィールド数: 約120フィールド
- ✅ インデックス数: 30+インデックス
- ✅ リレーション数: 20+リレーション
- ✅ 実装行数: 250行

**重要**: マイグレーション実行は**Phase 1.6（ライトセイルMySQL構築時）**に延期
- ローカル環境はSQLiteのまま開発継続
- ライトセイル統合インスタンス構築時にMySQL用マイグレーション実行
- 二重作業を回避し、効率的に実装

**関連ドキュメント**:
- [ComposeForm_Phase1_Completion_Report_20251009.md](./mcp-shared/docs/ComposeForm_Phase1_Completion_Report_20251009.md) 🆕

**新規テーブル作成**:

##### Postテーブル（🔴 CRITICAL）
```prisma
model Post {
  id                    String    @id @default(cuid())
  type                  String    // 'improvement' | 'community' | 'report'
  content               String    @db.Text
  authorId              String
  anonymityLevel        String
  status                String    @default("active")

  // improvement専用
  proposalType          String?
  priority              String?

  // community専用
  freespaceCategory     String?
  freespaceScope        String?
  expirationDate        DateTime?
  isExpired             Boolean   @default(false)

  // メタデータ
  season                String?
  moderationStatus      String    @default("pending")
  moderationScore       Int?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  // リレーション
  author                User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  poll                  Poll?
  event                 Event?

  @@index([authorId])
  @@index([type])
  @@index([status])
  @@index([proposalType])
  @@index([freespaceCategory])
  @@index([createdAt])
  @@index([expirationDate])
  @@map("posts")
}
```

##### Pollテーブル（投票機能）
```prisma
model Poll {
  id              String        @id @default(cuid())
  postId          String        @unique
  question        String
  deadline        DateTime
  isActive        Boolean       @default(true)
  allowMultiple   Boolean       @default(false)
  showResults     String
  category        String
  scope           String
  createdById     String

  post            Post          @relation(fields: [postId], references: [id], onDelete: Cascade)
  createdBy       User          @relation(fields: [createdById], references: [id])
  options         PollOption[]
  votes           PollVote[]

  @@index([postId])
  @@index([deadline])
  @@map("polls")
}

model PollOption {
  id        String      @id @default(cuid())
  pollId    String
  text      String
  emoji     String?
  votes     Int         @default(0)
  sortOrder Int         @default(0)

  poll      Poll        @relation(fields: [pollId], references: [id], onDelete: Cascade)
  pollVotes PollVote[]

  @@index([pollId])
  @@map("poll_options")
}

model PollVote {
  id           String    @id @default(cuid())
  pollId       String
  optionId     String
  userId       String
  timestamp    DateTime  @default(now())

  poll         Poll      @relation(fields: [pollId], references: [id], onDelete: Cascade)
  option       PollOption @relation(fields: [optionId], references: [id], onDelete: Cascade)
  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([pollId, userId, optionId])
  @@index([pollId])
  @@index([userId])
  @@map("poll_votes")
}
```

##### Eventテーブル（イベント企画）
```prisma
model Event {
  id                    String          @id @default(cuid())
  postId                String          @unique
  title                 String
  description           String          @db.Text
  type                  String
  organizerId           String
  maxParticipants       Int?
  venueName             String?
  cost                  Float?
  status                String          @default("planning")
  visibility            String
  createdAt             DateTime        @default(now())

  post                  Post            @relation(fields: [postId], references: [id], onDelete: Cascade)
  organizer             User            @relation(fields: [organizerId], references: [id])
  proposedDates         ProposedDate[]
  participants          Participant[]

  @@index([postId])
  @@index([organizerId])
  @@map("events")
}

model ProposedDate {
  id          String      @id @default(cuid())
  eventId     String
  date        DateTime
  startTime   String
  endTime     String
  totalVotes  Int         @default(0)
  sortOrder   Int         @default(0)

  event       Event       @relation(fields: [eventId], references: [id], onDelete: Cascade)
  votes       DateVote[]

  @@index([eventId])
  @@map("proposed_dates")
}

model DateVote {
  id              String        @id @default(cuid())
  proposedDateId  String
  userId          String
  response        String
  timestamp       DateTime      @default(now())

  proposedDate    ProposedDate  @relation(fields: [proposedDateId], references: [id], onDelete: Cascade)
  user            User          @relation(fields: [userId], references: [id])

  @@unique([proposedDateId, userId])
  @@index([proposedDateId])
  @@index([userId])
  @@map("date_votes")
}

model Participant {
  id                  String    @id @default(cuid())
  eventId             String
  userId              String
  status              String
  joinedAt            DateTime  @default(now())

  event               Event     @relation(fields: [eventId], references: [id], onDelete: Cascade)
  user                User      @relation(fields: [userId], references: [id])

  @@unique([eventId, userId])
  @@index([eventId])
  @@index([userId])
  @@map("participants")
}
```

##### DataConsentテーブル（データ分析同意）
```prisma
model DataConsent {
  id                        String    @id @default(cuid())
  userId                    String    @unique
  analyticsConsent          Boolean   @default(false)
  personalFeedbackConsent   Boolean   @default(false)
  consentedAt               DateTime?
  isRevoked                 Boolean   @default(false)
  createdAt                 DateTime  @default(now())

  user                      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("data_consents")
}
```

**実装タスク**:
| 日付 | タスク | 成果物 | 担当 |
|------|--------|-------|------|
| 10月11日（金） | Prismaスキーマ作成 | prisma/schema.prisma | VoiceDriveチーム |
| 10月12日（土） | マイグレーションファイル生成・確認 | prisma/migrations/ | VoiceDriveチーム |
| 10月13日（日） | マイグレーション実行 | DBテーブル作成完了 | VoiceDriveチーム |

---

### 9.3 Phase 2実装: API実装（10月15日〜18日）

#### VoiceDrive側

**新規API実装**:

##### POST /api/posts（投稿作成API）
**エンドポイント**: `POST /api/posts`
**認証**: JWT Bearer Token

**リクエストボディ**:
```typescript
{
  type: 'improvement' | 'community' | 'report',
  content: string,
  anonymityLevel: string,
  proposalType?: string,     // improvement時のみ
  priority?: string,         // improvement/report時のみ
  freespaceCategory?: string, // community時のみ
  freespaceScope?: string,   // community時のみ
  expirationDate?: string,   // community時のみ
  pollData?: CreatePollData, // community時のみ
  eventData?: CreateEventData, // community時のみ
  season?: string,
  moderationScore?: number
}
```

**レスポンス**:
```typescript
{
  success: true,
  data: {
    id: 'post_abc123',
    type: 'improvement',
    content: '...',
    authorId: 'user_123',
    createdAt: '2025-10-09T12:34:56.789Z'
    // ... 全フィールド
  }
}
```

**処理内容**:
1. バリデーション（content長さ、type、必須フィールド確認）
2. Postレコード作成
3. Pollデータがあれば Poll + PollOption作成
4. Eventデータがあれば Event + ProposedDate作成
5. improvement時は医療システムへWebhook通知
6. レスポンス返却

##### GET /api/consent/:userId（データ同意状態取得）
**エンドポイント**: `GET /api/consent/:userId`
**認証**: JWT Bearer Token

**レスポンス**:
```typescript
{
  success: true,
  data: {
    userId: 'user_123',
    analyticsConsent: false,
    personalFeedbackConsent: false,
    consentedAt: null,
    isRevoked: false
  }
}
```

##### POST /api/consent/:userId（データ同意更新）
**エンドポイント**: `POST /api/consent/:userId`
**認証**: JWT Bearer Token

**リクエストボディ**:
```typescript
{
  analyticsConsent: boolean,
  personalFeedbackConsent?: boolean
}
```

**実装タスク**:
| 日付 | タスク | 成果物 | 担当 |
|------|--------|-------|------|
| 10月15日（火） | POST /api/posts実装 | src/api/routes/post.routes.ts | VoiceDriveチーム |
| 10月16日（水） | GET /api/consent/:userId実装 | src/api/routes/consent.routes.ts | VoiceDriveチーム |
| 10月16日（水） | POST /api/consent/:userId実装 | src/api/routes/consent.routes.ts | VoiceDriveチーム |
| 10月17日（木） | MedicalSystemWebhook.server.ts実装 | src/services/MedicalSystemWebhook.server.ts | VoiceDriveチーム |
| 10月18日（金） | 単体テスト作成 | tests/api/ | VoiceDriveチーム |

---

### 9.4 Phase 3実装: ComposeForm統合（10月18日〜20日）

#### VoiceDrive側

**ComposeForm修正**:

**変更ファイル**: `src/components/ComposeForm.tsx`

**主な変更点**:
1. `executeSubmission()` 関数内の `console.log()` を API呼び出しに変更
2. Webhook通知をクライアント側から削除（サーバー側で実行）
3. 投稿成功時に投稿詳細ページへリダイレクト
4. エラーハンドリング追加
5. ローディング状態追加

**実装例**:
```typescript
const executeSubmission = async () => {
  // 1. キャパシティチェック
  if (!checkCanSubmit(currentProposalCount + 1)) {
    alert(`${capacityInfo.label}期の提案受付上限に達しています。`);
    return;
  }

  // 2. モデレーションチェック
  const modResult = await handleContentModeration(content);
  if (!modResult.allowed) {
    alert('投稿内容にガイドライン違反の可能性があります。');
    return;
  }

  // 3. 有効期限計算
  let expirationDate: Date | undefined;
  if (selectedType === 'community') {
    // ... 既存ロジック
  }

  // 4. API呼び出し
  try {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user?.token}`
      },
      body: JSON.stringify({
        type: selectedType,
        content,
        anonymityLevel: anonymity,
        proposalType: selectedType === 'improvement' ? proposalType : undefined,
        priority: selectedType !== 'community' ? priority : undefined,
        freespaceCategory: selectedType === 'community' ? freespaceCategory : undefined,
        freespaceScope: selectedType === 'community' ? freespaceScope : undefined,
        expirationDate: expirationDate?.toISOString(),
        pollData: selectedType === 'community' ? pollData : undefined,
        eventData: selectedType === 'community' ? eventData : undefined,
        season: currentSeason,
        moderationScore: clientModerationService.assessConstructiveness(content)
      })
    });

    if (!response.ok) {
      throw new Error('投稿の作成に失敗しました。');
    }

    const result = await response.json();
    alert('投稿が完了しました！');
    navigate(`/posts/${result.data.id}`);

  } catch (error) {
    console.error('[投稿作成エラー]', error);
    alert('投稿の作成中にエラーが発生しました。');
  }
};
```

**実装タスク**:
| 日付 | タスク | 成果物 | 担当 |
|------|--------|-------|------|
| 10月18日（金） | executeSubmission()修正 | ComposeForm.tsx | VoiceDriveチーム |
| 10月19日（土） | useDataConsent統合確認 | ComposeForm.tsx | VoiceDriveチーム |
| 10月20日（日） | エラーハンドリング・ローディング実装 | ComposeForm.tsx | VoiceDriveチーム |

---

### 9.5 Phase 4実装: 医療システム側Webhook処理（10月15日〜18日）

#### 医療システム側

**Webhook受信エンドポイント拡張**:

**ファイル**: `src/api/routes/webhook.routes.ts`

**追加処理**:
```typescript
router.post('/webhook/voicedrive', authenticateWebhook, async (req, res) => {
  const { event, timestamp, data } = req.body;

  switch (event) {
    case 'proposal.created':
      // 1. 議題作成ログを記録
      await prisma.proposalLog.create({
        data: {
          proposalId: data.proposalId,
          staffId: data.staffId,
          staffName: data.staffName,
          department: data.department,
          title: data.title,
          content: data.content,
          proposalType: data.proposalType,
          priority: data.priority,
          permissionLevel: data.permissionLevel,
          expectedAgendaLevel: data.expectedAgendaLevel,
          committeeCandidate: data.permissionLevel >= 8.0,
          createdAt: new Date(timestamp)
        }
      });

      // 2. 職員カルテに活動記録
      await prisma.staffActivityLog.create({
        data: {
          staffId: data.staffId,
          activityType: '提案活動',
          activityDetail: `${data.proposalType}提案「${data.title}」を作成`,
          permissionLevel: data.permissionLevel,
          timestamp: new Date(timestamp)
        }
      });

      // 3. 上位承認者に通知（permissionLevel >= 5.0）
      if (data.permissionLevel >= 5.0) {
        await notifySupervisor(data.staffId, data.department, {
          proposalId: data.proposalId,
          title: data.title,
          staffName: data.staffName
        });
      }

      // 4. 委員会提出候補としてマーク（permissionLevel >= 8.0）
      if (data.permissionLevel >= 8.0) {
        await markAsCommitteeCandidate(data.proposalId);
        await notifyFacilityDirector(data.proposalId, data.title);
      }

      break;

    // 既存イベント処理
    case 'employee.updated':
    case 'department.updated':
      // ...
      break;

    default:
      console.warn(`[Webhook] Unknown event: ${event}`);
  }

  res.status(200).json({ received: true });
});
```

**実装タスク**:
| 日付 | タスク | 成果物 | 担当 |
|------|--------|-------|------|
| 10月15日（火） | proposal.created イベントハンドラー実装 | webhook.routes.ts | 医療システムチーム |
| 10月16日（水） | notifySupervisor関数実装 | notification.service.ts | 医療システムチーム |
| 10月17日（木） | markAsCommitteeCandidate関数実装 | proposal.service.ts | 医療システムチーム |
| 10月18日（金） | 単体テスト作成 | webhook.test.ts | 医療システムチーム |

---

### 9.6 統合テスト（10月25日〜27日）

| テスト内容 | 期待結果 | 担当 |
|----------|---------|------|
| improvement投稿作成 | Postテーブル作成、Webhook送信成功 | 両チーム |
| community投稿作成（Poll付き） | Post + Poll + PollOptionテーブル作成 | VoiceDriveチーム |
| community投稿作成（Event付き） | Post + Event + ProposedDateテーブル作成 | VoiceDriveチーム |
| report投稿作成 | Postテーブル作成、anonymity='anonymous'確認 | VoiceDriveチーム |
| データ同意モーダル表示 | 初回投稿時にモーダル表示、同意状態保存 | VoiceDriveチーム |
| Webhook受信確認 | proposal_logs、staff_activity_log記録確認 | 医療システムチーム |
| 上位承認者通知確認 | permissionLevel >= 5.0でメール送信 | 医療システムチーム |
| 委員会提出候補マーク確認 | permissionLevel >= 8.0で自動マーク | 医療システムチーム |

**Phase 1完了時の動作範囲**:

**ComposeForm**:
- ✅ improvement投稿作成（実データ、Postテーブル）
- ✅ community投稿作成（実データ、Postテーブル）
- ✅ report投稿作成（実データ、Postテーブル）
- ✅ Poll作成（実データ、Poll + PollOptionテーブル）
- ✅ Event作成（実データ、Event + ProposedDateテーブル）
- ✅ データ分析同意管理（実データ、DataConsentテーブル）
- ✅ Webhook通知（improvement投稿時、医療システムへ）

---

### 9.7 成功指標（KPI）

#### 技術指標

| 指標 | 目標値 | 測定方法 |
|------|--------|---------|
| POST /api/posts応答時間 | < 500ms（95%） | CloudWatch |
| Webhook送信成功率 | > 99% | Webhookログ |
| データベース書き込み成功率 | 100% | DBログ |
| ComposeForm投稿完了時間 | < 2.0秒（平均） | フロントエンドメトリクス |

#### ビジネス指標

| 指標 | 目標値 | 測定方法 |
|------|--------|---------|
| 投稿作成成功率 | > 99.5% | POST /api/posts成功率 |
| データ同意率 | > 80% | DataConsent.analyticsConsent=true比率 |
| improvement投稿のWebhook通知成功率 | > 99% | Webhookログ |

#### 運用指標

| 指標 | 目標値 | 測定方法 |
|------|--------|---------|
| API稼働率 | > 99.9% | APIヘルスチェックログ |
| データ整合性エラー率 | 0件/週 | DBログ |
| インシデント発生率 | 0件/週 | インシデント管理 |

---

### 9.8 リスク管理

#### 想定リスクと対策

| リスク | 影響度 | 対策 | ステータス |
|--------|--------|------|---------|
| Postテーブル作成失敗 | 🔴 HIGH | Phase 1で優先実装、リレーション整合性確認 | 🟡 監視中 |
| API実装遅延 | 🔴 HIGH | 10月15日までに完了、VoiceDriveチーム優先対応 | 🟡 監視中 |
| Webhook疎通失敗 | 🟡 MEDIUM | 既存エンドポイント流用、API Key認証で安全性確保 | ✅ 対策済み |
| Poll/Event機能の複雑性 | 🟡 MEDIUM | 段階的実装、まずPost作成から | 🟡 監視中 |
| モデレーション性能低下 | 🟢 LOW | debounce処理実装済み（300ms） | ✅ 対策済み |

---

### 9.9 コスト見積もり

#### 開発工数

| 項目 | 工数 | 金額 |
|-----|------|------|
| VoiceDrive側（DB + API + ComposeForm修正） | 8人日 | ¥400,000 |
| 医療システム側（Webhook処理拡張） | 1人日 | ¥50,000 |
| 統合テスト | 2人日 | ¥100,000 |
| ドキュメント作成 | 1人日 | ¥50,000 |
| **合計** | **12人日** | **¥600,000** |

#### 運用コスト

| 項目 | 金額 |
|-----|------|
| Lightsail統合インスタンス（16GB）追加負荷 | ¥0（既存インフラ内で対応） |
| Postテーブルストレージ増加 | ¥0（想定容量：500MB/月） |
| **合計** | **¥0/月** |

---

### 9.10 次のアクション

#### 即時実行項目（10月11日〜14日）

**VoiceDrive側**:
1. ⬜ Prismaスキーマ作成（Post, Poll, Event, DataConsent）
2. ⬜ マイグレーションファイル生成
3. ⬜ マイグレーション実行

**医療システム側**:
1. ✅ 確認事項への回答書確認（10月10日完了）
2. ⬜ proposal.created イベントハンドラー設計（10月15日〜）

#### Phase 2開始（10月15日〜18日）

**VoiceDrive側**:
1. ⬜ POST /api/posts実装
2. ⬜ GET /api/consent/:userId実装
3. ⬜ POST /api/consent/:userId実装
4. ⬜ MedicalSystemWebhook.server.ts実装

**医療システム側**:
1. ⬜ proposal.created イベントハンドラー実装
2. ⬜ notifySupervisor関数実装
3. ⬜ markAsCommitteeCandidate関数実装

---

### 9.10 Phase 1.6実装: MySQL移行【ライトセイル構築時実施】⬜ **待機中**

**実施タイミング**: ライトセイル統合インスタンス構築完了後

#### 概要

VoiceDrive側のPrismaスキーマをSQLiteからMySQL 8.0に移行し、ライトセイル環境で本番稼働できる状態にします。

**重要**: Phase 1でPrismaスキーマ実装は完了済み、マイグレーション実行のみ残っている状態

**目的**:
- SQLite → MySQL 8.0への移行
- ライトセイル環境での本番稼働準備
- 二重作業の回避（効率的な実装）

---

#### 9.10.1 Prisma設定変更

**実施内容**: `prisma/schema.prisma` のdatasource設定をmysqlに変更

**変更前（開発環境、SQLite）**:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

**変更後（本番環境、MySQL 8.0）**:
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

**実施者**: VoiceDriveチーム
**所要時間**: 5分

---

#### 9.10.2 環境変数設定

**実施内容**: `.env.production` にライトセイルMySQL接続情報を設定

**設定例**:
```bash
# ライトセイル統合インスタンス（16GB RAM）
DATABASE_URL="mysql://voicedrive_user:SECURE_PASSWORD@localhost:3306/voicedrive_production"

# JWT認証
JWT_SECRET="your_secure_jwt_secret_here_32_characters_minimum"

# VoiceDriveアナリティクス
ANALYTICS_ALLOWED_IPS="192.168.1.100,192.168.1.101"

# 医療システムWebhook
MEDICAL_SYSTEM_WEBHOOK_URL="https://api.medical-system.example.com/api/webhook/voicedrive"
MEDICAL_SYSTEM_API_KEY="vd_webhook_prod_2025_abc123def456"

# LLMモデレーション
LLM_API_URL="http://localhost:11434/api/generate"
LLM_MODEL_NAME="llama3.2:3b"
```

**確認項目**:
| 項目 | 確認内容 | 担当 |
|------|---------|------|
| MySQL接続文字列 | ホスト、ポート、DB名、ユーザー名、パスワード | VoiceDriveチーム |
| JWT_SECRET | 32文字以上のランダム文字列 | VoiceDriveチーム |
| ANALYTICS_ALLOWED_IPS | 医療システムのIPアドレス（カンマ区切り） | 医療システムチーム |
| MEDICAL_SYSTEM_WEBHOOK_URL | 医療システムの本番Webhook URL | 医療システムチーム |
| MEDICAL_SYSTEM_API_KEY | 医療システムが発行したAPI Key | 医療システムチーム |

**実施者**: 両チーム
**所要時間**: 15分

---

#### 9.10.3 MySQL用マイグレーション実行

**実施内容**: 既存のSQLiteマイグレーションを削除し、MySQL用マイグレーションを初期化

**実行コマンド**:
```bash
# 1. 既存マイグレーション削除（SQLite用）
rm -rf prisma/migrations/
rm prisma/migration_lock.toml

# 2. MySQL用マイグレーション初期化
npx prisma migrate dev --name init

# 3. Prisma Client再生成
npx prisma generate

# 4. マイグレーション適用確認
npx prisma migrate status
```

**期待される出力**:
```
Environment variables loaded from .env.production
Prisma schema loaded from prisma/schema.prisma
Datasource "db": MySQL database "voicedrive_production" at "localhost:3306"

✓ Your database is now in sync with your schema.
```

**実施者**: VoiceDriveチーム
**所要時間**: 10分

---

#### 9.10.4 テーブル作成確認

**実施内容**: MySQL 8.0に全11テーブルが作成されたことを確認

**確認コマンド**:
```bash
# MySQL接続
mysql -u voicedrive_user -p voicedrive_production

# テーブル一覧確認
SHOW TABLES;
```

**期待される出力**:
```
+-------------------------------+
| Tables_in_voicedrive_production |
+-------------------------------+
| posts                         |
| votes                         |
| comments                      |
| polls                         |
| poll_options                  |
| poll_votes                    |
| events                        |
| proposed_dates                |
| date_votes                    |
| participants                  |
| data_consents                 |
| _prisma_migrations            |
+-------------------------------+
12 rows in set (0.00 sec)
```

**各テーブル構造確認**:
```sql
-- Postテーブル構造確認
DESC posts;

-- インデックス確認
SHOW INDEX FROM posts;

-- Foreign Key制約確認
SELECT
  TABLE_NAME,
  COLUMN_NAME,
  CONSTRAINT_NAME,
  REFERENCED_TABLE_NAME,
  REFERENCED_COLUMN_NAME
FROM
  INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE
  TABLE_SCHEMA = 'voicedrive_production'
  AND REFERENCED_TABLE_NAME IS NOT NULL;
```

**成果物**:
| 確認項目 | 期待値 | ステータス |
|---------|--------|----------|
| テーブル数 | 11テーブル + _prisma_migrations | ⬜ 未確認 |
| Postテーブルフィールド数 | 約15フィールド | ⬜ 未確認 |
| インデックス数 | 30+インデックス | ⬜ 未確認 |
| Foreign Key制約数 | 20+リレーション | ⬜ 未確認 |

**実施者**: VoiceDriveチーム
**所要時間**: 10分

---

#### 9.10.5 動作確認テスト

**実施内容**: Prisma ClientでMySQL接続・データ操作が正常動作することを確認

**テストコマンド**:
```bash
# Prisma Studio起動（GUI確認）
npx prisma studio

# 簡単なCRUD操作テスト
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  // 1. データ作成テスト
  const testPost = await prisma.post.create({
    data: {
      type: 'improvement',
      content: 'テスト投稿',
      authorId: 'test_user_001',
      anonymityLevel: 'identified',
      status: 'active',
      proposalType: 'operational',
      priority: 'medium'
    }
  });
  console.log('✅ Post作成成功:', testPost.id);

  // 2. データ取得テスト
  const posts = await prisma.post.findMany();
  console.log('✅ Post取得成功:', posts.length + '件');

  // 3. データ削除テスト
  await prisma.post.delete({ where: { id: testPost.id } });
  console.log('✅ Post削除成功');

  await prisma.\$disconnect();
}

test().catch(console.error);
"
```

**期待される出力**:
```
✅ Post作成成功: post_abc123def456
✅ Post取得成功: 1件
✅ Post削除成功
```

**実施者**: VoiceDriveチーム
**所要時間**: 10分

---

#### 9.10.6 ライトセイル環境構築時チェックリスト

**MySQL 8.0インストール確認**:
- [ ] MySQL 8.0.x インストール済み
- [ ] InnoDB エンジン有効化確認（`SHOW ENGINES;`）
- [ ] UTF-8 (utf8mb4) 設定確認（`SHOW VARIABLES LIKE 'character_set%';`）
- [ ] タイムゾーン設定確認（UTC推奨、`SELECT @@global.time_zone;`）

**データベース・ユーザー作成**:
- [ ] `voicedrive_production` データベース作成
- [ ] `voicedrive_user` ユーザー作成
- [ ] 適切な権限付与（SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, INDEX）

**環境変数設定**:
- [ ] `DATABASE_URL` 設定完了
- [ ] `JWT_SECRET` 設定完了（32文字以上）
- [ ] `ANALYTICS_ALLOWED_IPS` 設定完了
- [ ] `MEDICAL_SYSTEM_WEBHOOK_URL` 設定完了
- [ ] `MEDICAL_SYSTEM_API_KEY` 設定完了

**マイグレーション実行**:
- [ ] 既存SQLiteマイグレーション削除
- [ ] MySQL用マイグレーション初期化（`npx prisma migrate dev --name init`）
- [ ] Prisma Client再生成（`npx prisma generate`）
- [ ] マイグレーションステータス確認（`npx prisma migrate status`）

**テーブル作成確認**:
- [ ] 全11テーブル作成確認（`SHOW TABLES;`）
- [ ] Postテーブル構造確認（`DESC posts;`）
- [ ] インデックス作成確認（`SHOW INDEX FROM posts;`）
- [ ] Foreign Key制約確認（KEY_COLUMN_USAGE確認）

**動作確認**:
- [ ] Prisma Studioで接続確認（`npx prisma studio`）
- [ ] CRUD操作テスト成功
- [ ] VoiceDriveアプリケーション起動確認
- [ ] 投稿作成テスト成功

**統合テスト**:
- [ ] VoiceDrive → 医療システムWebhook送信テスト
- [ ] 医療システム → VoiceDrive API呼び出しテスト
- [ ] データ同期確認（両システム間）

---

#### 9.10.7 成果物

| 成果物 | 内容 | ステータス |
|-------|------|----------|
| Prismaスキーマ（MySQL版） | prisma/schema.prisma（provider: mysql） | ⬜ 未作成 |
| MySQL用マイグレーションファイル | prisma/migrations/[timestamp]_init/ | ⬜ 未作成 |
| Prisma Client（MySQL版） | node_modules/.prisma/client/ | ⬜ 未作成 |
| 環境変数ファイル | .env.production（MySQL接続情報） | ⬜ 未作成 |
| 動作確認テスト結果 | test-results-mysql-migration.md | ⬜ 未作成 |

---

#### 9.10.8 所要時間

| 作業 | 所要時間 | 担当 |
|------|---------|------|
| Prisma設定変更 | 5分 | VoiceDriveチーム |
| 環境変数設定 | 15分 | 両チーム |
| MySQL用マイグレーション実行 | 10分 | VoiceDriveチーム |
| テーブル作成確認 | 10分 | VoiceDriveチーム |
| 動作確認テスト | 10分 | VoiceDriveチーム |
| **合計** | **50分（約1時間）** | |

**追加開発工数**: ゼロ（設定変更・マイグレーション実行のみ）

---

#### 9.10.9 リスク管理

| リスク | 影響度 | 対策 | ステータス |
|--------|--------|------|---------|
| MySQL接続エラー | 🔴 HIGH | 事前にMySQL接続テスト実施、環境変数確認 | ⬜ 未対策 |
| マイグレーション失敗 | 🔴 HIGH | 事前にPrismaスキーマ検証、ロールバック手順準備 | ⬜ 未対策 |
| Foreign Key制約エラー | 🟡 MEDIUM | リレーション整合性を事前確認 | ⬜ 未対策 |
| タイムゾーン不一致 | 🟢 LOW | UTC統一、TIMESTAMP型使用 | ✅ 対策済み |

---

#### 9.10.10 関連ドキュメント

- [ComposeForm_Phase1_Completion_Report_20251009.md](./mcp-shared/docs/ComposeForm_Phase1_Completion_Report_20251009.md) ✅ **10月9日作成**
- [lightsail-integration-master-plan-20251005-updated.md](./mcp-shared/docs/lightsail-integration-master-plan-20251005-updated.md)（本文書）

---

### 9.11 関連ドキュメント

#### 既存ドキュメント
- [ComposeForm DB要件分析_20251009.md](./mcp-shared/docs/ComposeForm_DB要件分析_20251009.md)
- [ComposeForm暫定マスターリスト_20251009.md](./mcp-shared/docs/ComposeForm暫定マスターリスト_20251009.md)
- [Response_ComposeForm_Integration_20251009.md](./mcp-shared/docs/Response_ComposeForm_Integration_20251009.md) ✅ **10月10日作成**
- [データ管理責任分界点定義書_20251008.md](./mcp-shared/docs/データ管理責任分界点定義書_20251008.md)

#### 作成予定ドキュメント
- [ ] Postテーブル設計書（VoiceDriveチーム、10月11日）
- [ ] POST /api/posts API仕様書（VoiceDriveチーム、10月15日）
- [ ] MedicalSystemWebhook.server.ts仕様書（VoiceDriveチーム、10月17日）
- [ ] Phase 1統合テスト報告書（ComposeForm）（両チーム、10月27日）

---

## Phase 10: HRAnnouncements（人事お知らせ配信）統合実装【新規追加】🆕

### 実施期間: 2026年1月6日〜3月27日（12週間）

### 概要

VoiceDrive HRAnnouncements（人事お知らせ配信）機能とHRManagementDashboard（人事管理ダッシュボード）の実装を行います。

**目的**:
- 医療システムからVoiceDriveへの人事お知らせ配信（全体、部署、施設、個人、役職別）
- VoiceDriveからの既読・アクション統計の収集
- HRManagementDashboardでの人事統計可視化（従業員数、離職率、採用状況）

**重要**: 人事部門が全従業員への重要なお知らせを効率的に配信し、既読状況を把握する基幹機能

**関連ドキュメント**:
- [HRAnnouncements暫定マスターリスト_20251009.md](./mcp-shared/docs/HRAnnouncements暫定マスターリスト_20251009.md)
- [HRAnnouncements DB要件分析_20251009.md](./mcp-shared/docs/HRAnnouncements_DB要件分析_20251009.md)
- [Response_HRAnnouncements_Integration_20251009.md](./mcp-shared/docs/Response_HRAnnouncements_Integration_20251009.md) ✅ **10月9日作成**

---

### 10.1 医療システム側確認事項（10月9日回答済み）✅

#### 確認-1: お知らせ作成権限について

**回答**: ✅ **D: その他（医療システム側で定義する権限）**

- 権限名: `HR_ANNOUNCEMENT_CREATE`（専用の機能権限）
- 通常、以下の役職に付与される想定:
  - 人事部長（Level 6）
  - 人事課長（Level 5）
  - 人事担当主任（Level 4）
  - 総務部門の特定管理職

**実装への影響**:
- API-7（お知らせ配信API）のリクエスト送信前に、医療システム側で`HR_ANNOUNCEMENT_CREATE`権限をチェック
- 権限がない場合は配信を拒否し、エラーを返す

---

#### 確認-2: 配信対象の粒度について

**回答**: ✅ **全て必要です（5つの配信パターン全てサポート）**

| 配信タイプ | 必要性 | 使用例 | API要件 |
|-----------|--------|--------|---------|
| **全体配信** | ✅ 必須 | 全社方針変更、就業規則改定 | `targetType: "global"` |
| **部署配信** | ✅ 必須 | 看護部のみ、医事課のみの通知 | `targetType: "departments"`, API-8使用 |
| **施設配信** | ✅ 必須 | 小原病院のみ、立神病院のみの通知 | `targetType: "facilities"`, API-9使用 |
| **個人配信** | ✅ 必須 | 個別の異動通知、評価面談通知 | `targetType: "individuals"` |
| **役職配信** | ✅ 必須 | 管理職のみへの研修案内 | `targetType: "positions"`, API-10使用 |

---

#### 確認-3: DepartmentStation API-3の流用可能性（API-8）

**回答**: ✅ **流用可能です（部分的に調整が必要）**

**推奨方針**: **Option A（API-3を直接流用）**
- 追加開発コスト: ¥0
- VoiceDrive側で`members[].id`を抽出
- メリット: 既存のテスト済みAPIを利用、保守性が高い

---

#### 確認-4: 施設メンバー取得API（API-9）の実装方針

**回答**: ✅ **新規実装が必要です**

**実装コスト**: 0.5人日（¥20,000）

```typescript
// API-9（新規）
GET /api/facilities/:facilityId/members
Response: {
  facilityId: string,
  facilityName: string,
  memberIds: string[]
}
```

---

#### 確認-5: 役職メンバー取得API（API-10）の実装方針

**回答**: ✅ **新規実装が必要です**

**推奨方針**: **Option B（permissionLevelベース）**
- 理由: 役職名は施設間で微妙に異なる可能性があるが、permissionLevelは統一されている
- 実装コスト: 0.5人日（¥20,000）

```typescript
// API-10（新規）
GET /api/permission-levels/:level/members
Response: {
  positionId: string,
  positionName: string,
  permissionLevel: number,
  memberIds: string[]
}
```

---

#### 確認-6: HR統括指標API（API-11～API-16）の実装可能性

**回答**: ⚠️ **一部実装可能、一部は将来実装**

| API | 指標名 | 実装可能性 | 理由 |
|-----|--------|----------|------|
| **API-11** | 従業員数推移 | ✅ 即座に実装可能 | `User`テーブルから集計可能 |
| **API-12** | 離職率 | ✅ 即座に実装可能 | `User.employmentStatus`で判定可能 |
| **API-13** | 満足度スコア | ⚠️ 将来実装 | Phase 11で実装予定（アンケート機能） |
| **API-14** | 研修受講率 | ⚠️ 将来実装 | Phase 12で実装予定 |
| **API-15** | タレントパイプライン | ⚠️ 将来実装 | Phase 13で実装予定 |
| **API-16** | 採用状況 | ✅ 即座に実装可能 | 採用候補者データから集計可能 |

**Phase 10（2026年1月～3月）**: 基本的なHRAnnouncements機能
- ✅ API-7: お知らせ配信API
- ✅ API-8: 部署メンバー取得（API-3流用）
- ✅ API-9: 施設メンバー取得
- ✅ API-10: 役職メンバー取得
- ✅ API-11: 従業員数推移
- ✅ API-12: 離職率
- ✅ API-16: 採用状況

---

#### 確認-7: 統計データの用途について

**回答**: ✅ **HR管理ダッシュボードでの可視化とアラート生成**

**活用方法**:
1. **HRManagementDashboard**: 各お知らせの既読率・アクション率を可視化
2. **アラート生成**: 既読率が50%未満の重要なお知らせについて、人事部門に再配信を提案
3. **効果測定**: お知らせの配信パターン（全体 vs 部署別）の効果を分析
4. **監査ログ**: コンプライアンス関連のお知らせ（就業規則変更等）の既読状況を記録

**データ保存先**:
- 医療システム側で新規テーブル`AnnouncementStatistics`を作成（Phase 10で実装）
- VoiceDrive側の`AnnouncementStats`テーブルはキャッシュ、医療システム側が正式な記録

---

#### 確認-8: アクション通知の緊急度について

**回答**: ✅ **リアルタイム通知が必要です（一部のアクションタイプのみ）**

| アクションタイプ | 緊急度 | 通知方式 | 理由 |
|---------------|--------|---------|------|
| **confirm**: 確認済み | ⏱️ 低（日次バッチで十分） | 02:00 JST統計Webhookに含める | 緊急性なし |
| **apply**: 応募 | 🚨 高（リアルタイム必須） | 即座にWebhook送信 | 人事部門が迅速に対応する必要がある |
| **contact**: 問い合わせ | 🚨 高（リアルタイム必須） | 即座にWebhook送信 | 従業員からの質問に迅速に回答する必要がある |
| **download**: ダウンロード | ⏱️ 低（日次バッチで十分） | 02:00 JST統計Webhookに含める | 緊急性なし |

---

#### 確認-9: データ保持期間について

**回答**: ✅ **以下の保持期間を推奨します**

| テーブル | 保持期間 | 理由 | 削除方針 |
|---------|---------|------|---------|
| **AnnouncementCache** | 1年 | お知らせの有効期限は最長1年 | 作成日から1年経過後、自動削除 |
| **AnnouncementDelivery** | 3年 | 労働基準法に基づく記録保持義務 | 配信日から3年経過後、削除 |
| **AnnouncementRead** | 3年 | コンプライアンス監査のため | 既読日から3年経過後、削除 |
| **AnnouncementAction** | 3年 | 応募・問い合わせの記録保持 | アクション日から3年経過後、削除 |
| **AnnouncementStats** | 無制限 | 統計データは長期分析に使用 | 削除しない（サマリーのみ） |

**削除処理の実装**:
- VoiceDrive側で日次バッチ処理（03:00 JST）を実装
- 期限切れレコードを削除
- 削除前に医療システム側へ統計を送信済みであることを確認

---

#### 確認-10: 認証方式の確認

**回答**: ✅ **以下の認証方式を使用します**

| 通信方向 | 認証方式 | 詳細 |
|---------|---------|------|
| **VoiceDrive → 医療システム**<br/>（API-8, API-9, API-10, API-11, API-12, API-16） | JWT Bearer Token | 既存のPersonalStation APIと同じ方式 |
| **医療システム → VoiceDrive**<br/>（API-7: お知らせ配信） | HMAC-SHA256（推奨） | ComposeForm Webhookと同じ方式 |
| **VoiceDrive → 医療システム**<br/>（統計Webhook、アクションWebhook） | HMAC-SHA256（推奨） | 既存のWebhookと同じ方式 |

**セキュリティ要件**:
- 全ての通信でHTTPS/TLS 1.3を使用
- JWT有効期限: 1時間
- HMAC-SHA256シークレットの定期ローテーション（3ヶ月ごと）

---

### 10.2 Phase 10実装スコープ

#### 医療システム側実装（15人日、¥600,000）

| 項目 | 工数 | コスト |
|------|------|--------|
| API-7実装（お知らせ配信Webhook送信） | 3人日 | ¥120,000 |
| API-9実装（施設メンバー取得） | 0.5人日 | ¥20,000 |
| API-10実装（役職メンバー取得） | 0.5人日 | ¥20,000 |
| API-11実装（従業員数推移） | 2人日 | ¥80,000 |
| API-12実装（離職率） | 2人日 | ¥80,000 |
| API-16実装（採用状況） | 2人日 | ¥80,000 |
| 統計Webhook受信処理 | 3人日 | ¥120,000 |
| アクションWebhook受信処理 | 1人日 | ¥40,000 |
| AnnouncementStatisticsテーブル実装 | 0.5人日 | ¥20,000 |
| テスト・統合テスト | 2人日 | ¥80,000 |
| **小計** | **15人日** | **¥600,000** |

---

#### VoiceDrive側実装（37人日、¥1,480,000）

| 項目 | 工数 | コスト |
|------|------|--------|
| AnnouncementCache等5テーブル実装 | 10人日 | ¥400,000 |
| API-7受信処理（お知らせ配信） | 5人日 | ¥200,000 |
| HRAnnouncements画面実装 | 8人日 | ¥320,000 |
| HRManagementDashboard画面実装 | 6人日 | ¥240,000 |
| 統計Webhook送信（日次バッチ） | 3人日 | ¥120,000 |
| アクションWebhook送信（リアルタイム） | 2人日 | ¥80,000 |
| テスト・統合テスト | 3人日 | ¥120,000 |
| **小計** | **37人日** | **¥1,480,000** |

---

#### Phase 10合計: 52人日、¥2,080,000

（元の見積もり49人日、¥1,960,000から若干増加 - API-10の実装方針変更とリアルタイムWebhook追加のため）

---

### 10.3 Phase 10実装スケジュール（12週間）

| 週 | 医療システム側作業 | VoiceDrive側作業 |
|----|---------------|----------------|
| **Week 1-2** | API-9、API-10実装 | 5テーブルPrismaスキーマ実装、マイグレーション |
| **Week 3-4** | API-11、API-12、API-16実装 | API-7受信処理実装 |
| **Week 5-6** | API-7送信処理実装 | HRAnnouncements画面実装 |
| **Week 7-8** | 統計Webhook受信処理実装 | HRManagementDashboard画面実装 |
| **Week 9** | アクションWebhook受信処理実装 | 統計Webhook送信処理実装 |
| **Week 10** | AnnouncementStatisticsテーブル実装 | アクションWebhook送信処理実装 |
| **Week 11** | 単体テスト | 単体テスト |
| **Week 12** | **統合テスト（両チーム合同）** | **統合テスト（両チーム合同）** |

**Phase 10開始予定**: 2026年1月6日
**Phase 10完了予定**: 2026年3月27日
**実装期間**: 12週間（3ヶ月）

---

### 10.4 VoiceDrive側DB拡張（5テーブル）

#### AnnouncementCacheテーブル（🔴 CRITICAL）

```prisma
model AnnouncementCache {
  id                    String    @id @default(cuid())
  title                 String
  content               String    @db.Text
  category              String    // 'recruitment' | 'training' | 'benefits' | 'regulations' | 'other'
  priority              String    // 'high' | 'medium' | 'low'
  targetType            String    // 'global' | 'departments' | 'facilities' | 'individuals' | 'positions'
  targetIds             String    @db.Text // JSON array
  publishedAt           DateTime
  expiresAt             DateTime?
  isActive              Boolean   @default(true)
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  // リレーション
  deliveries            AnnouncementDelivery[]
  reads                 AnnouncementRead[]
  actions               AnnouncementAction[]

  @@index([category])
  @@index([priority])
  @@index([targetType])
  @@index([publishedAt])
  @@index([expiresAt])
  @@index([isActive])
  @@map("announcement_cache")
}
```

---

#### AnnouncementDeliveryテーブル（配信記録）

```prisma
model AnnouncementDelivery {
  id                    String    @id @default(cuid())
  announcementId        String
  userId                String
  deliveredAt           DateTime  @default(now())
  deliveryMethod        String    // 'automatic' | 'manual'

  // リレーション
  announcement          AnnouncementCache @relation(fields: [announcementId], references: [id], onDelete: Cascade)
  user                  User              @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([announcementId, userId])
  @@index([announcementId])
  @@index([userId])
  @@index([deliveredAt])
  @@map("announcement_delivery")
}
```

---

#### AnnouncementReadテーブル（既読管理）

```prisma
model AnnouncementRead {
  id                    String    @id @default(cuid())
  announcementId        String
  userId                String
  readAt                DateTime  @default(now())

  // リレーション
  announcement          AnnouncementCache @relation(fields: [announcementId], references: [id], onDelete: Cascade)
  user                  User              @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([announcementId, userId])
  @@index([announcementId])
  @@index([userId])
  @@index([readAt])
  @@map("announcement_read")
}
```

---

#### AnnouncementActionテーブル（アクション実行記録）

```prisma
model AnnouncementAction {
  id                    String    @id @default(cuid())
  announcementId        String
  userId                String
  actionType            String    // 'confirm' | 'apply' | 'contact' | 'download'
  actionData            String?   @db.Text // JSON metadata
  createdAt             DateTime  @default(now())

  // リレーション
  announcement          AnnouncementCache @relation(fields: [announcementId], references: [id], onDelete: Cascade)
  user                  User              @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([announcementId])
  @@index([userId])
  @@index([actionType])
  @@index([createdAt])
  @@map("announcement_action")
}
```

---

#### AnnouncementStatsテーブル（統計サマリー）

```prisma
model AnnouncementStats {
  id                    String    @id @default(cuid())
  announcementId        String    @unique
  deliveredCount        Int       @default(0)
  readCount             Int       @default(0)
  readRate              Float     @default(0.0)
  actionCount           Int       @default(0)
  actionRate            Float     @default(0.0)
  lastUpdatedAt         DateTime  @updatedAt

  @@index([announcementId])
  @@index([readRate])
  @@index([actionRate])
  @@map("announcement_stats")
}
```

---

### 10.5 医療システム側DB拡張（1テーブル）

#### AnnouncementStatisticsテーブル

```typescript
model AnnouncementStatistics {
  id                    String    @id @default(cuid())
  announcementId        String    @unique
  title                 String
  category              String
  priority              String
  targetType            String
  deliveredCount        Int
  readCount             Int
  readRate              Float
  actionCount           Int
  actionRate            Float
  publishedAt           DateTime
  lastSyncedAt          DateTime
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([announcementId])
  @@index([category])
  @@index([publishedAt])
  @@index([readRate])
  @@map("announcement_statistics")
}
```

---

### 10.6 API仕様（10 APIs）

#### API-7: お知らせ配信API（医療システム → VoiceDrive）

```typescript
// 医療システム → VoiceDrive
POST https://voicedrive.example.com/api/announcements
Authorization: HMAC-SHA256 signature

Request: {
  announcementId: "ann_123",
  title: "2025年度夏季賞与支給について",
  content: "2025年度夏季賞与を6月30日に支給します...",
  category: "benefits",
  priority: "high",
  targetType: "global",
  targetIds: [],
  publishedAt: "2025-06-15T09:00:00Z",
  expiresAt: "2025-06-30T23:59:59Z"
}

Response: {
  success: true,
  announcementId: "ann_123",
  deliveredCount: 150,
  estimatedReachTime: "2025-06-15T09:05:00Z"
}
```

---

#### API-8: 部署メンバー取得（VoiceDrive → 医療システム）

**実装**: DepartmentStation API-3を直接流用

```typescript
// VoiceDrive → 医療システム
GET https://api.medical-system.example.com/api/departments/:departmentId/members
Authorization: Bearer <JWT_TOKEN>

Response: {
  department: { id, name, facilityId },
  members: Array<{
    id, name, position, permissionLevel, performance
  }>
}

// VoiceDrive側でmembers[].idを抽出してtargetIds配列を作成
```

---

#### API-9: 施設メンバー取得（VoiceDrive → 医療システム）

```typescript
// VoiceDrive → 医療システム
GET https://api.medical-system.example.com/api/facilities/:facilityId/members
Authorization: Bearer <JWT_TOKEN>

Response: {
  facilityId: "facility_obara",
  facilityName: "小原病院",
  memberIds: ["user_001", "user_002", "user_003", ...]
}
```

---

#### API-10: 役職メンバー取得（VoiceDrive → 医療システム）

```typescript
// VoiceDrive → 医療システム
GET https://api.medical-system.example.com/api/permission-levels/:level/members
Authorization: Bearer <JWT_TOKEN>

Request: level = 5 (Level 5以上の管理職)

Response: {
  permissionLevel: 5,
  positionName: "管理職",
  memberIds: ["user_010", "user_020", "user_030", ...]
}
```

---

#### API-11: 従業員数推移（VoiceDrive → 医療システム）

```typescript
// VoiceDrive → 医療システム
GET https://api.medical-system.example.com/api/hr-stats/employee-count?period=6months
Authorization: Bearer <JWT_TOKEN>

Response: {
  period: "6months",
  data: [
    { month: "2025-01", count: 145 },
    { month: "2025-02", count: 148 },
    { month: "2025-03", count: 150 },
    { month: "2025-04", count: 152 },
    { month: "2025-05", count: 151 },
    { month: "2025-06", count: 153 }
  ],
  trend: "increasing",
  changeRate: 0.055 // 5.5% increase over 6 months
}
```

---

#### API-12: 離職率（VoiceDrive → 医療システム）

```typescript
// VoiceDrive → 医療システム
GET https://api.medical-system.example.com/api/hr-stats/turnover-rate?period=12months
Authorization: Bearer <JWT_TOKEN>

Response: {
  period: "12months",
  totalEmployees: 153,
  resignations: 12,
  turnoverRate: 0.078, // 7.8%
  industryAverage: 0.15, // 15%
  status: "below_average", // 業界平均より良好
  monthlyData: [
    { month: "2024-07", resignations: 1 },
    { month: "2024-08", resignations: 2 },
    ...
  ]
}
```

---

#### API-16: 採用状況（VoiceDrive → 医療システム）

```typescript
// VoiceDrive → 医療システム
GET https://api.medical-system.example.com/api/hr-stats/recruitment?period=6months
Authorization: Bearer <JWT_TOKEN>

Response: {
  period: "6months",
  totalApplications: 45,
  interviewed: 30,
  offered: 15,
  accepted: 12,
  conversionRate: 0.267, // 26.7% (accepted/totalApplications)
  averageTimeToHire: 28, // days
  byPosition: [
    { position: "看護師", applications: 20, accepted: 8 },
    { position: "医療事務", applications: 15, accepted: 3 },
    { position: "リハビリ技師", applications: 10, accepted: 1 }
  ]
}
```

---

#### 統計Webhook（VoiceDrive → 医療システム、日次バッチ 02:00 JST）

```typescript
// VoiceDrive → 医療システム
POST https://api.medical-system.example.com/api/webhooks/announcement-stats
Authorization: HMAC-SHA256 signature

Request: {
  date: "2025-10-09",
  announcements: [
    {
      announcementId: "ann_123",
      deliveredCount: 150,
      readCount: 120,
      readRate: 0.80,
      actionCount: 30,
      actionRate: 0.25
    }
  ],
  summary: {
    totalDelivered: 500,
    totalRead: 400,
    averageReadRate: 0.80,
    totalActions: 100
  }
}

Response: {
  success: true,
  received: 5,
  timestamp: "2025-10-09T02:00:00Z"
}
```

---

#### アクションWebhook（VoiceDrive → 医療システム、リアルタイム）

```typescript
// VoiceDrive → 医療システム（apply、contactのみリアルタイム）
POST https://api.medical-system.example.com/api/webhooks/announcement-action
Authorization: HMAC-SHA256 signature

Request: {
  announcementId: "ann_123",
  userId: "user_456",
  actionType: "apply", // 'apply' | 'contact'
  timestamp: "2025-10-09T10:30:00Z",
  metadata: {
    applicationDetails: "..."
  }
}

Response: {
  success: true,
  actionId: "action_789",
  timestamp: "2025-10-09T10:30:05Z"
}
```

---

### 10.7 統合テスト計画（Week 12）

#### テストケース1: 全体配信テスト

```typescript
// 1. 医療システムから全体配信お知らせを送信
// 2. VoiceDrive側で全従業員に配信
// 3. 一部ユーザーが既読
// 4. 翌日02:00 JSTに統計Webhook送信
// 5. 医療システム側でAnnouncementStatisticsテーブルに記録
```

**期待される結果**:
- ✅ 全従業員（150名）に配信成功
- ✅ 既読率80%以上
- ✅ 統計Webhook送信成功
- ✅ 医療システム側でデータ記録成功

---

#### テストケース2: 部署配信テスト

```typescript
// 1. 医療システムから看護部のみへお知らせを送信
// 2. VoiceDrive側でAPI-8（API-3流用）を呼び出して看護部メンバーIDを取得
// 3. 看護部メンバーのみに配信
// 4. 翌日02:00 JSTに統計Webhook送信
```

**期待される結果**:
- ✅ 看護部メンバーのみ配信（50名）
- ✅ 他部署には配信されない
- ✅ 既読率75%以上

---

#### テストケース3: リアルタイムアクション通知テスト

```typescript
// 1. ユーザーがお知らせに「応募」ボタンをクリック
// 2. VoiceDrive側で即座にアクションWebhookを医療システムに送信
// 3. 医療システム側で人事部門に通知
```

**期待される結果**:
- ✅ アクション発生から5秒以内にWebhook送信
- ✅ 医療システム側でアクション記録成功
- ✅ 人事部門に通知成功

---

### 10.8 将来実装（Phase 11～13）

#### Phase 11（2026年4月～6月）: 満足度調査機能
- ⚠️ API-13: 満足度スコア
- アンケート機能実装
- 満足度データ収集開始
- **実装コスト**: 23人日、¥920,000

---

#### Phase 12（2026年7月～9月）: 研修管理機能
- ⚠️ API-14: 研修受講率
- 研修管理システム実装
- **実装コスト**: 28人日、¥1,120,000

---

#### Phase 13（2026年10月～12月）: タレントマネジメント機能
- ⚠️ API-15: タレントパイプライン
- 後継者計画機能実装
- **実装コスト**: 33人日、¥1,320,000

---

### 10.9 関連ドキュメント

#### 既存ドキュメント
- [HRAnnouncements暫定マスターリスト_20251009.md](./mcp-shared/docs/HRAnnouncements暫定マスターリスト_20251009.md)
- [HRAnnouncements DB要件分析_20251009.md](./mcp-shared/docs/HRAnnouncements_DB要件分析_20251009.md)
- [Response_HRAnnouncements_Integration_20251009.md](./mcp-shared/docs/Response_HRAnnouncements_Integration_20251009.md) ✅ **10月9日作成**

#### 作成予定ドキュメント
- [ ] AnnouncementCacheテーブル設計書（VoiceDriveチーム、1月10日）
- [ ] POST /api/announcements API仕様書（VoiceDriveチーム、1月15日）
- [ ] HRAnnouncements画面実装仕様書（VoiceDriveチーム、2月1日）
- [ ] HRManagementDashboard画面実装仕様書（VoiceDriveチーム、2月15日）
- [ ] Phase 10統合テスト報告書（HRAnnouncements）（両チーム、3月27日）

---

## Phase 11: InterviewStation（面談ステーション）統合実装【新規追加】🆕

### 実施期間: 2025年11月18日〜26日（9日間） + Phase 11.5: 12月2日〜10日（9日間）

### 概要

VoiceDrive InterviewStation（面談ステーション）の面談予約・管理・サマリ閲覧機能を実装します。

**目的**:
- 即時予約とおまかせ予約（AI調整）の実装
- 面談実施後のAI分析サマリ配信
- リマインダー機能（雇用状況に応じた定期面談通知）

**重要**: 医療職員の面談予約・管理を効率化し、NotebookLM（Llama 3.2:3b）による面談サマリを自動生成・配信

**関連ドキュメント**:
- [InterviewStation暫定マスターリスト_20251009.md](./mcp-shared/docs/InterviewStation暫定マスターリスト_20251009.md)
- [InterviewStation_DB要件分析_20251009.md](./mcp-shared/docs/InterviewStation_DB要件分析_20251009.md)
- [Response_InterviewStation_Integration_20251009.md](./mcp-shared/docs/Response_InterviewStation_Integration_20251009.md) ✅ **10月9日作成**

---

### 11.1 医療システム側確認事項（10月9日回答済み）✅

#### 確認-1: AI調整機能（おまかせ予約）について

**回答**: ✅ **NotebookLM API利用可能（Phase 1.5で統合済み）**

- 使用モデル: Llama 3.2:3b（Ollamaベース）
- おまかせ予約のAI調整に活用
- 提案パターン生成所要時間: 30秒～1分
- `staffFriendlyDisplay`（職員向け説明文）をLLM APIで自動生成

**新規実装が必要**:
- Interviewerテーブル（面談者マスタ）: 2人日
- AssistedBookingService（AI調整ロジック）: 5人日
- 実装コスト: ¥280,000

---

#### 確認-2: 面談サマリ配信について

**回答**: ✅ **半自動（面談記録入力後、手動トリガーでAI分析）**

- 面談実施記録入力後、「AIサマリを生成」ボタンクリック
- NotebookLM API呼び出し
- サマリ生成完了後、VoiceDriveへWebhook送信（自動）
- `feedbackToEmployee`（職員向けフィードバック）をLLM APIで自動生成

**Phase 11.5で完全自動化を検討**

---

#### 確認-3: リアルタイム通知について

**回答**: ✅ **Server-Sent Events (SSE) を使用**

- WebSocketではなくSSEを採用（実装がシンプル、HTTP/2ベース、自動リトライ）
- NotificationServiceを新規実装
- おまかせ予約進捗通知をリアルタイム送信

**実装コスト**: 2人日（¥80,000）

---

### 11.2 Phase 11実装スコープ

#### 医療システム側実装（31人日、¥1,240,000）

| 項目 | 工数 | コスト |
|------|------|--------|
| Interviewerテーブル実装 | 2日 | ¥80,000 |
| API-INT-1: 面談予約受付 | 3日 | ¥120,000 |
| API-INT-2: おまかせ予約申込受付（AI調整） | 5日 | ¥200,000 |
| API-INT-3: 調整中リクエスト取得 | 1日 | ¥40,000 |
| API-INT-4: 提案候補取得 | 2日 | ¥80,000 |
| API-INT-5: 提案候補選択確定 | 2日 | ¥80,000 |
| API-INT-6: おまかせ予約キャンセル | 1日 | ¥40,000 |
| API-INT-7: 面談履歴取得 | 2日 | ¥80,000 |
| Webhook-INT-1: 面談予約確定通知 | 2日 | ¥80,000 |
| Webhook-INT-2: 面談サマリ配信 | 3日 | ¥120,000 |
| Webhook-INT-3: おまかせ予約進捗通知 | 2日 | ¥80,000 |
| SSE実装 | 2日 | ¥80,000 |
| NotificationService実装 | 2日 | ¥80,000 |
| テスト・統合テスト | 2日 | ¥80,000 |
| **小計** | **31日** | **¥1,240,000** |

---

#### VoiceDrive側実装（12人日、¥0）

| 項目 | 工数 | コスト |
|------|------|--------|
| Interview拡張 | 2日 | ¥0（自社リソース） |
| AssistedBookingRequest実装 | 2日 | ¥0（自社リソース） |
| ProposalPattern実装 | 1日 | ¥0（自社リソース） |
| InterviewResult実装 | 1日 | ¥0（自社リソース） |
| InterviewStation UI実装 | 4日 | ¥0（自社リソース） |
| Webhook受信処理 | 2日 | ¥0（自社リソース） |
| **小計** | **12日** | **¥0** |

---

### 11.3 Phase 11.5実装スコープ（リマインダー機能）

#### 医療システム側実装（3人日、¥120,000）

| 項目 | 工数 | コスト |
|------|------|--------|
| API-INT-8: 雇用状況取得 | 1日 | ¥40,000 |
| API-INT-9: 面談タイプマスタ取得 | 2日 | ¥80,000 |
| **小計** | **3日** | **¥120,000** |

---

#### VoiceDrive側実装（5人日、¥0）

| 項目 | 工数 | コスト |
|------|------|--------|
| InterviewReminder実装 | 3日 | ¥0（自社リソース） |
| リマインダー計算ロジック | 2日 | ¥0（自社リソース） |
| **小計** | **5日** | **¥0** |

---

### 11.4 Phase 11実装スケジュール（9日間）

#### 準備期間（11月11日～15日）

| 日付 | 医療システム側 | VoiceDrive側 |
|------|---------------|-------------|
| **11/11-11/12** | Interviewerテーブル設計 | - |
| **11/13-11/14** | SSE技術検証 | VoiceDrive DB設計 |
| **11/15** | Phase 11キックオフミーティング | Phase 11キックオフミーティング |

---

#### Week 1（11月18日～22日）

| 日付 | 医療システム側 | VoiceDrive側 |
|------|---------------|-------------|
| **11/18** | API-INT-1実装（Day 1/3）<br>API-INT-2実装（Day 1/5） | Interview拡張（Day 1/2） |
| **11/19** | API-INT-1実装（Day 2/3）<br>API-INT-2実装（Day 2/5） | Interview拡張（Day 2/2） |
| **11/20** | API-INT-1実装完了✅<br>API-INT-2実装（Day 3/5）<br>Webhook-INT-1実装（Day 1/2） | AssistedBookingRequest実装（Day 1/2） |
| **11/21** | API-INT-2実装（Day 4/5）<br>Webhook-INT-1実装完了✅ | AssistedBookingRequest実装完了✅ |
| **11/22** | API-INT-2実装完了✅ | ProposalPattern実装 |

---

#### Week 2（11月25日～26日）

| 日付 | 医療システム側 | VoiceDrive側 |
|------|---------------|-------------|
| **11/25** | API-INT-3実装✅<br>API-INT-4実装（Day 1/2）<br>API-INT-5実装（Day 1/2）<br>API-INT-6実装✅<br>API-INT-7実装（Day 1/2）<br>Webhook-INT-2実装（Day 1/3）<br>Webhook-INT-3実装（Day 1/2）<br>SSE実装（Day 1/2） | InterviewResult実装<br>InterviewStation UI実装（Day 1/4） |
| **11/26** | 全API/Webhook実装完了✅<br>SSE実装完了✅<br>NotificationService実装✅<br>統合テスト✅ | InterviewStation UI実装完了✅<br>Webhook受信処理完了✅<br>統合テスト |

**Phase 11完了予定**: 2025年11月26日

---

### 11.5 Phase 11.5実装スケジュール（リマインダー機能）

| 期間 | 医療システム側 | VoiceDrive側 |
|------|---------------|-------------|
| **12/2-12/5** | API-INT-8実装（1日）<br>API-INT-9実装（2日） | InterviewReminder実装（3日） |
| **12/9-12/10** | テスト（1日） | リマインダー計算ロジック（2日）<br>統合テスト（1日） |

**Phase 11.5完了予定**: 2025年12月10日

---

### 11.6 VoiceDrive側DB拡張（4テーブル）

#### Interview拡張（既存テーブル）

```prisma
model Interview {
  // 既存フィールド + 以下を追加
  isAssistedBooking       Boolean   @default(false)
  assistedBookingRequestId String?  @unique
  proposalPatterns        Json?
  selectedProposalId      String?
  conductedAt             DateTime?
  actualDuration          Int?
  location                String?
  format                  String?   // face_to_face / online
  cancellationReason      String?
  cancelledAt             DateTime?
  rescheduleRequests      Json?
}
```

---

#### AssistedBookingRequest（新規テーブル）

```prisma
model AssistedBookingRequest {
  id                    String    @id @default(cuid())
  staffId               String
  requestType           String    // regular, special, support
  topic                 String
  details               String    @db.Text
  category              String
  urgencyLevel          String    // urgent, this_week, next_week, this_month
  preferredDates        Json?     // string[]
  unavailableDates      Json?     // string[]
  timePreference        Json      // { morning, afternoon, evening, anytime }
  interviewerPreference Json      // { specificPerson?, genderPreference?, specialtyPreference?, anyAvailable }
  minDuration           Int
  maxDuration           Int
  additionalRequests    String?   @db.Text
  status                String    @default("pending_review")
  // pending_review, proposals_ready, awaiting_selection, confirmed, failed, expired
  medicalRequestId      String?   @unique
  estimatedCompletion   DateTime?
  proposals             Json?     // StaffFriendlyRecommendation[]
  selectedProposalId    String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  confirmedAt           DateTime?

  @@index([staffId])
  @@index([status])
  @@index([medicalRequestId])
  @@map("assisted_booking_requests")
}
```

---

#### InterviewResult拡張（既存テーブル）

```prisma
model InterviewResult {
  // 既存フィールド + 以下を追加
  isRead                Boolean   @default(false)
  readAt                DateTime?

  @@index([requestId])
  @@index([interviewId])
}
```

---

#### InterviewReminder（新規テーブル、Phase 11.5）

```prisma
model InterviewReminder {
  id                    String    @id @default(cuid())
  employeeId            String
  reminderType          String    // interview_due, interview_overdue
  interviewType         String    // new_employee_monthly, regular_annual, management_biannual
  nextInterviewDue      DateTime
  reminderDate          DateTime
  sent                  Boolean   @default(false)
  sentAt                DateTime?
  employmentStatus      String    // new_employee, regular_employee, management
  lastInterviewDate     DateTime?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([employeeId])
  @@index([sent])
  @@index([reminderDate])
  @@map("interview_reminders")
}
```

---

### 11.7 医療システム側DB拡張（1テーブル）

#### Interviewerテーブル（新規）

```typescript
model Interviewer {
  id                    String    @id @default(cuid())
  userId                String    @unique
  specialties           String[]  // ['career_development', 'mental_health', 'skill_training']
  availableTimeSlots    Json      // { "Monday": ["09:00-12:00", "14:00-17:00"], ... }
  maxDailyInterviews    Int       @default(3)
  preferredDuration     Int       @default(60) // minutes
  interviewRooms        String[]  // ['人事部 面談室A', '人事部 面談室B']
  experience            String?   // 'キャリア相談10年の経験'
  bio                   String?   // 職員向け紹介文
  isActive              Boolean   @default(true)
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  // リレーション
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  interviews            Interview[]

  @@index([userId])
  @@index([isActive])
  @@map("interviewers")
}
```

---

### 11.8 API仕様（9 APIs + 3 Webhooks）

#### API-INT-1: 面談予約受付

```typescript
POST /api/interviews/reservations
Authorization: Bearer <JWT_TOKEN>

Request: {
  staffId: "OH-NS-2024-001",
  type: "support",
  supportCategory: "career_support",
  supportTopic: "career_path",
  urgency: "medium",
  preferredDates: ["2025-10-15", "2025-10-16"],
  preferredTimeSlots: ["morning", "afternoon"],
  notes: "キャリアパスについて相談したい"
}

Response: {
  success: true,
  data: {
    requestId: "REQ-2025-1009-001",
    interviewId: "INT-2025-1009-001",
    status: "pending",
    estimatedConfirmation: "2025-10-09T18:00:00Z"
  }
}
```

---

#### API-INT-2: おまかせ予約申込受付（AI調整）

```typescript
POST /api/interviews/assisted-booking
Authorization: Bearer <JWT_TOKEN>

Request: {
  staffId: "OH-NS-2024-001",
  requestType: "support",
  topic: "キャリア相談",
  details: "今後のキャリアパスについて悩んでいます",
  category: "career_path",
  urgencyLevel: "this_week",
  preferredDates: ["2025-10-15", "2025-10-16", "2025-10-17"],
  timePreference: {
    morning: true,
    afternoon: true,
    evening: false,
    anytime: false
  },
  interviewerPreference: {
    genderPreference: "no_preference",
    specialtyPreference: "キャリア開発",
    anyAvailable: false
  },
  minDuration: 30,
  maxDuration: 60
}

Response: {
  success: true,
  data: {
    requestId: "ABR-2025-1009-001",
    estimatedCompletionTime: "1時間以内",
    status: "accepted"
  }
}
```

**期待される処理**:
- AI調整開始（Llama 3.2:3b使用）
- 3つの提案パターン生成
- ステータス: `pending_review` → `proposals_ready`
- VoiceDriveにリアルタイム通知（Webhook-INT-3）

---

#### API-INT-4: 提案候補取得

```typescript
GET /api/interviews/proposals/{requestId}
Authorization: Bearer <JWT_TOKEN>

Response: {
  success: true,
  data: {
    requestId: "ABR-2025-1009-001",
    proposals: [
      {
        id: "PROP-001",
        interviewer: {
          id: "HR-001",
          name: "山田 太郎",
          title: "人事部 キャリア開発担当",
          department: "人事部",
          experience: "キャリア相談10年の経験"
        },
        schedule: {
          date: "2025-10-15",
          time: "10:00-11:00",
          duration: 60,
          location: "人事部 面談室A",
          format: "face_to_face"
        },
        staffFriendlyDisplay: {
          summary: "あなたの相談内容に詳しいキャリア開発専門担当者です",
          highlights: [
            "キャリア相談専門",
            "10年の経験",
            "ご希望の時間に対応可能"
          ]
        },
        aiReasoning: {
          matchingScore: 0.95,
          matchingFactors: ["専門分野一致", "時間帯適合", "経験豊富"]
        }
      }
      // ... 2つの追加候補 ...
    ]
  }
}
```

---

#### Webhook-INT-1: 面談予約確定通知

```typescript
POST https://voicedrive.ai/api/webhooks/interview-booked
Authorization: HMAC-SHA256 signature

Request: {
  eventType: "interview.booked",
  timestamp: "2025-10-09T15:00:00Z",
  data: {
    interviewId: "INT-2025-1009-050",
    requestId: "REQ-2025-1009-001",
    staffId: "OH-NS-2024-001",
    interviewType: "career_support",
    interviewCategory: "career_path",
    bookingDate: "2025-10-15T10:00:00Z",
    timeSlot: {
      startTime: "10:00",
      endTime: "11:00"
    },
    interviewerId: "HR-001",
    interviewerName: "山田 太郎",
    status: "confirmed"
  }
}
```

---

#### Webhook-INT-2: 面談サマリ配信

```typescript
POST https://voicedrive.ai/api/webhooks/interview-result
Authorization: HMAC-SHA256 signature

Request: {
  eventType: "interview.result_ready",
  timestamp: "2025-10-15T11:30:00Z",
  data: {
    interviewId: "INT-2025-1009-050",
    requestId: "REQ-2025-1009-001",
    completedAt: "2025-10-15T11:00:00Z",
    duration: 55,
    summary: "キャリアパスについて詳細な相談を行いました。職員は現在の業務に充実感を感じつつも、将来的には管理職を目指したいという希望を持っています。",
    keyPoints: [
      "現在の業務に満足しているが、キャリアアップを希望",
      "管理職に必要なスキルについて関心が高い",
      "3年以内のステップアップを目標としている"
    ],
    actionItems: [
      {
        description: "管理職向け研修プログラムの受講",
        dueDate: "2025-11-01"
      }
    ],
    followUpRequired: true,
    followUpDate: "2026-01-15",
    feedbackToEmployee: "あなたの将来へのビジョンが明確で、素晴らしいと感じました。次回の面談では、実際の研修プログラムの進捗を確認しましょう。",
    nextRecommendations: {
      suggestedNextInterview: "career_support",
      suggestedTopics: ["管理職研修の進捗確認", "リーダーシップスキルの振り返り"]
    }
  }
}
```

---

#### Webhook-INT-3: おまかせ予約進捗通知（リアルタイム、SSE）

```typescript
POST https://voicedrive.ai/api/webhooks/assisted-booking-update
Authorization: HMAC-SHA256 signature

Request: {
  eventType: "assisted_booking.status_changed",
  timestamp: "2025-10-09T15:45:00Z",
  data: {
    requestId: "ABR-2025-1009-001",
    staffId: "OH-NS-2024-001",
    oldStatus: "pending_review",
    newStatus: "proposals_ready",
    message: "面談候補をご用意しました！"
  }
}
```

**VoiceDrive側の処理**:
- AssistedBookingRequest テーブル更新
- リアルタイム通知発火: `assistedBookingUpdate` / `proposalReady`
- PendingBookingCard に「提案候補を見る」ボタン表示

---

### 11.9 統合テスト計画（Week 2）

#### テストケース1: 即時予約テスト

```
1. VoiceDrive → 医療システム: API-INT-1（面談予約受付）
2. 医療システム: 空き時間確認、面談者割り当て
3. 医療システム → VoiceDrive: Webhook-INT-1（面談予約確定通知）
4. VoiceDrive: Interview テーブル保存、ダッシュボード更新
```

**期待される結果**:
- ✅ 予約受付成功
- ✅ Webhook受信成功
- ✅ ダッシュボードに予約表示

---

#### テストケース2: おまかせ予約テスト（AI調整）

```
1. VoiceDrive → 医療システム: API-INT-2（おまかせ予約申込）
2. 医療システム: AI調整開始（Llama 3.2:3b）
3. 医療システム: 3つの提案パターン生成（30秒～1分）
4. 医療システム → VoiceDrive: Webhook-INT-3（進捗通知、SSE）
5. VoiceDrive: 「提案候補を見る」ボタン表示
6. 職員: 候補選択
7. VoiceDrive → 医療システム: API-INT-5（提案候補選択確定）
8. 医療システム → VoiceDrive: Webhook-INT-1（面談予約確定通知）
```

**期待される結果**:
- ✅ AI調整完了（1分以内）
- ✅ 3つの提案候補表示
- ✅ `staffFriendlyDisplay`が自然な日本語
- ✅ 選択確定後、予約完了

---

#### テストケース3: 面談サマリ配信テスト

```
1. 医療システム: 面談実施記録入力
2. 医療システム: 「AIサマリを生成」ボタンクリック
3. 医療システム: NotebookLM API呼び出し（Llama 3.2:3b）
4. 医療システム: サマリ生成完了
5. 医療システム → VoiceDrive: Webhook-INT-2（面談サマリ配信）
6. VoiceDrive: InterviewResult テーブル保存
7. VoiceDrive: 履歴タブに「サマリ受信済み」バッジ表示
8. 職員: 「サマリを見る」ボタンクリック
9. VoiceDrive: InterviewResultModal 表示
```

**期待される結果**:
- ✅ サマリ生成成功
- ✅ Webhook受信成功
- ✅ サマリ表示成功
- ✅ `feedbackToEmployee`が自然な日本語

---

### 11.10 関連ドキュメント

#### 既存ドキュメント
- [InterviewStation暫定マスターリスト_20251009.md](./mcp-shared/docs/InterviewStation暫定マスターリスト_20251009.md)
- [InterviewStation_DB要件分析_20251009.md](./mcp-shared/docs/InterviewStation_DB要件分析_20251009.md)
- [Response_InterviewStation_Integration_20251009.md](./mcp-shared/docs/Response_InterviewStation_Integration_20251009.md) ✅ **10月9日作成**

#### 作成予定ドキュメント
- [ ] Interviewerテーブル設計書（医療システムチーム、11月12日）
- [ ] AssistedBookingService実装仕様書（医療システムチーム、11月20日）
- [ ] NotificationService実装仕様書（医療システムチーム、11月25日）
- [ ] Phase 11統合テスト報告書（InterviewStation）（両チーム、11月26日）

---

## Phase 12: 投稿追跡（Post Tracking）統合実装【新規追加】🆕

### 実施期間: Phase 1（11月11日〜15日）+ Phase 3（12月2日〜13日）+ Phase 12（12月16日〜18日）

### 概要

VoiceDrive 投稿追跡機能（Post Tracking）の実装を行います。VoiceDriveチームの見積もりに対し、**医療システム側の負担を大幅削減（¥540,000削減、56%削減）**しました。

**目的**:
- 投稿者プロフィール表示（職員情報取得）
- 部署メンバー投稿一覧表示
- 組織変更時の自動通知（半自動）

**重要**: 既存APIの最大限の流用により、医療システム側の追加実装を最小化（2 APIs + 1 Webhook のみ）

**関連ドキュメント**:
- [投稿追跡暫定マスターリスト_20251009.md](./mcp-shared/docs/投稿追跡暫定マスターリスト_20251009.md)
- [投稿追跡_DB要件分析_20251009.md](./mcp-shared/docs/投稿追跡_DB要件分析_20251009.md)
- [Response_PostTracking_Integration_20251009.md](./mcp-shared/docs/Response_PostTracking_Integration_20251009.md) ✅ **10月9日作成**

---

### 12.1 医療システム側確認事項（10月9日回答済み）✅

#### 確認-1: API-PT-M-1（職員情報取得API）について

**回答**: ⚠️ **部分的に存在します（拡張が必要）**

**既存API**: PersonalStation API-2（経験年数サマリ）
- エンドポイント: `GET /api/employees/:employeeId/experience-summary`
- 返却データ: 経験年数のみ

**新規エンドポイント**:
```typescript
GET /api/employees/:employeeId/full-profile
Authorization: Bearer <JWT_TOKEN>

Response: {
  success: true,
  data: {
    employeeId: "OH-NS-2024-001",
    firstName: "花子",
    lastName: "山田",
    departmentId: "DEPT-001",
    departmentName: "看護部",
    positionId: "POS-002",
    positionName: "看護師",
    experienceYears: 5,
    employmentStatus: "regular_employee",
    hireDate: "2019-04-01",
    // アバター画像はPhase 12で実装
    avatarUrl: null
  }
}
```

**実装コスト**: 1.5人日（¥60,000）
- 元の見積もり: ¥160,000
- 削減額: ¥100,000

---

#### 確認-2: API-PT-M-2（部署メンバー一覧API）について

**回答**: ✅ **存在します（DepartmentStation API-3を流用可能）**

**既存API**: DepartmentStation API-3（部門メンバー取得）
- エンドポイント: `GET /api/departments/:departmentId/members`
- 返却データ: 部門メンバー一覧（`employeeId`, `firstName`, `lastName`, `positionName`）

**VoiceDrive側の対応**:
- API-3から取得したメンバーリストに対し、VoiceDrive側で投稿件数・アクティブメンバー判定を実施
- 医療システム側の追加実装: **ゼロ**（API-3をそのまま流用）

**実装コスト**: 2人日（¥80,000、VoiceDrive側のキャッシュ実装）
- 元の見積もり: ¥240,000
- 削減額: ¥160,000

---

#### 確認-3: アクティブメンバー判定について

**回答**: ❌ **医療システムにはアクティビティデータなし（VoiceDrive側で実装）**

**理由**:
- 医療システムは投稿・コメント・投票データを保持していない
- アクティビティ判定に必要なデータは全てVoiceDrive側に存在

**VoiceDrive側実装**:
```typescript
// VoiceDrive側でアクティブメンバー判定
const isActiveMember = (userId: string) => {
  const activities = await db.userActivity.findMany({
    where: {
      userId,
      createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // 過去30日
    }
  });
  return activities.length > 0;
};
```

**医療システム側の追加実装**: **ゼロ**

---

#### 確認-4: Webhook-PT-M-1（組織変更通知）について

**回答**: ✅ **半自動（承認トリガー）**

**実装方針**:
- 組織変更（部署異動、退職）承認時に自動Webhook送信
- トリガー: `DepartmentTransfer.status = "approved"` または `Employee.employmentStatus = "resigned"`

**Webhookペイロード**:
```typescript
POST https://voicedrive.example.com/webhook/organization-change
X-Signature: <HMAC-SHA256>

{
  eventType: "organization_change",
  timestamp: "2025-10-09T10:00:00Z",
  changes: [
    {
      employeeId: "OH-NS-2024-001",
      changeType: "department_transfer",
      oldDepartmentId: "DEPT-001",
      newDepartmentId: "DEPT-002",
      effectiveDate: "2025-10-15"
    },
    {
      employeeId: "OH-NS-2024-002",
      changeType: "resignation",
      effectiveDate: "2025-10-31"
    }
  ]
}
```

**実装コスト**: 5人日（¥200,000）
- 元の見積もり: ¥400,000（完全自動）
- 削減額: ¥200,000

---

#### 確認-5: アバター画像について

**回答**: ✅ **Phase 12に分離（Nice to have）**

**理由**:
- アバター画像は投稿追跡の必須機能ではない
- 早期リリースを優先し、Phase 12に実装

**Phase 12実装内容**:
- `Employee.avatarUrl`フィールド追加
- 画像アップロードAPI実装
- S3 / Cloudinaryストレージ統合

**実装コスト**: 2人日（¥80,000、Phase 12実施時）

---

### 12.2 Phase 1実装スコープ（11月11日〜15日）

#### 医療システム側実装（1.5人日、¥60,000）

| 項目 | 工数 | コスト |
|------|------|--------|
| API-PT-M-1: 職員フルプロフィール取得 | 1.5日 | ¥60,000 |
| **小計** | **1.5日** | **¥60,000** |

---

#### VoiceDrive側実装（0人日、¥0）

Phase 1では実装なし（Phase 3で実施）

---

### 12.3 Phase 3実装スコープ（12月2日〜13日）

#### 医療システム側実装（5人日、¥200,000）

| 項目 | 工数 | コスト |
|------|------|--------|
| Webhook-PT-M-1: 組織変更通知 | 5日 | ¥200,000 |
| **小計** | **5日** | **¥200,000** |

---

#### VoiceDrive側実装（2人日、¥80,000）

| 項目 | 工数 | コスト |
|------|------|--------|
| API-PT-M-2キャッシュ実装 | 2日 | ¥80,000 |
| **小計** | **2日** | **¥80,000** |

---

### 12.4 Phase 12実装スコープ（12月16日〜18日）

#### 医療システム側実装（2人日、¥80,000）

| 項目 | 工数 | コスト |
|------|------|--------|
| アバター画像実装 | 2日 | ¥80,000 |
| **小計** | **2日** | **¥80,000** |

---

#### VoiceDrive側実装（0人日、¥0）

Phase 12では実装なし（アバター画像はAPI-PT-M-1から取得のみ）

---

### 12.5 総コスト計算

| Phase | 期間 | 医療システム | VoiceDrive | 合計コスト |
|-------|------|-------------|-----------|----------|
| **Phase 1** | 11/11-11/15 | 1.5日（¥60,000） | 0日（¥0） | **¥60,000** |
| **Phase 3** | 12/2-12/13 | 5日（¥200,000） | 2日（¥80,000） | **¥280,000** |
| **Phase 12** | 12/16-12/18 | 2日（¥80,000） | 0日（¥0） | **¥80,000** |
| **合計** | | **8.5日（¥340,000）** | **2日（¥80,000）** | **¥420,000** |

**元の見積もりとの差額**: ¥960,000 - ¥420,000 = **¥540,000削減（56%削減）**

---

### 12.6 コスト削減の理由

#### 削減項目1: API-PT-M-1（¥100,000削減）

**元の見積もり**: 4人日（¥160,000）
- 新規API実装
- 職員情報取得ロジック

**最終コスト**: 1.5人日（¥60,000）
- 既存PersonalStation API-2を拡張
- フィールド追加のみ

---

#### 削減項目2: API-PT-M-2（¥160,000削減）

**元の見積もり**: 6人日（¥240,000）
- 新規API実装
- 部署メンバー取得ロジック
- アクティブメンバー判定

**最終コスト**: 2人日（¥80,000、VoiceDrive側）
- 既存DepartmentStation API-3を流用
- 医療システム側の追加実装: **ゼロ**

---

#### 削減項目3: Webhook-PT-M-1（¥200,000削減）

**元の見積もり**: 10人日（¥400,000）
- 完全自動（変更検知バッチ）
- 定期実行ジョブ

**最終コスト**: 5人日（¥200,000）
- 半自動（承認トリガー）
- 既存の承認フローに統合

---

### 12.7 医療システム側DB拡張（なし）

Phase 1, Phase 3では既存テーブルのみ使用。Phase 12で`Employee.avatarUrl`フィールド追加。

---

### 12.8 VoiceDrive側DB拡張（なし）

投稿追跡機能は既存のPostテーブルを活用。追加テーブルなし。

---

### 12.9 統合テスト計画

#### Phase 1統合テスト（11月15日）

**テスト項目**:
- ✅ API-PT-M-1で職員フルプロフィール取得成功
- ✅ PersonalStation画面で投稿者情報表示
- ✅ 存在しない職員IDの場合404エラー

---

#### Phase 3統合テスト（12月13日）

**テスト項目**:
- ✅ API-PT-M-2で部署メンバー一覧取得成功
- ✅ DepartmentStation画面でメンバー投稿一覧表示
- ✅ Webhook-PT-M-1で組織変更通知送信成功
- ✅ 部署異動時にVoiceDrive側でキャッシュ更新

---

#### Phase 12統合テスト（12月18日）

**テスト項目**:
- ✅ アバター画像アップロード成功
- ✅ API-PT-M-1でavatarUrl返却成功
- ✅ PersonalStation画面でアバター画像表示

---

### 12.10 関連ドキュメント

#### 既存ドキュメント
- [投稿追跡暫定マスターリスト_20251009.md](./mcp-shared/docs/投稿追跡暫定マスターリスト_20251009.md)
- [投稿追跡_DB要件分析_20251009.md](./mcp-shared/docs/投稿追跡_DB要件分析_20251009.md)
- [Response_PostTracking_Integration_20251009.md](./mcp-shared/docs/Response_PostTracking_Integration_20251009.md) ✅ **10月9日作成**

#### 作成予定ドキュメント
- [ ] 組織変更通知Webhook実装仕様書（医療システムチーム、11月20日）
- [ ] アバター画像実装仕様書（医療システムチーム、12月10日）
- [ ] Phase 12統合テスト報告書（投稿追跡）（両チーム、12月18日）

---

## Phase 13: 投稿管理（Post Management）統合実装【新規追加】🆕

### 実施期間: Phase 1（10月11日〜25日）+ Phase 2（10月28日〜11月8日）+ Phase 3（11月11日〜15日）

### 概要

VoiceDrive 投稿管理機能（Post Management）の実装を行います。6段階議題化システムと委員会提出ワークフローを実装し、**医療システム側の負担を大幅削減（¥600,000削減、75%削減）**しました。

**目的**:
- 6段階議題レベル管理（PENDING → DEPT_REVIEW → DEPT_AGENDA → FACILITY_AGENDA → CORP_REVIEW → CORP_AGENDA）
- Level 5-13の権限別責任者管理
- Level 7+による議題提案書作成 → Level 8+承認 → 委員会提出ワークフロー
- ハイブリッド委員会管理（マスター選択 + フリー入力）

**重要**: 既存APIの最大限の流用により、医療システム側の追加実装を最小化（2 APIs、Webhook不要）

**関連ドキュメント**:
- [投稿管理暫定マスターリスト_20251009.md](./mcp-shared/docs/投稿管理暫定マスターリスト_20251009.md)
- [投稿管理_DB要件分析_20251009.md](./mcp-shared/docs/投稿管理_DB要件分析_20251009.md)
- [Response_PostManagement_Integration_20251010.md](./mcp-shared/docs/Response_PostManagement_Integration_20251010.md) ✅ **10月10日作成**
- [Final_Confirmation_PostManagement_Integration_20251010.md](./mcp-shared/docs/Final_Confirmation_PostManagement_Integration_20251010.md) ✅ **10月10日最終確認**

---

### 13.1 医療システム側確認事項（10月10日回答済み）✅

#### 確認-1: 組織階層構造API

**回答**: ⚠️ **部分的に存在します（簡易版で対応可能）**

**既存API**: なし（新規実装）
- エンドポイント: `GET /api/organization/departments?facilityId=tategami_hospital`
- 返却データ: 部署一覧（部署ID、部署名、責任者レベル）

**実装方針**:
- 親子関係（parentDepartmentId）なし（VoiceDrive側で不要と確認）
- responsibleLevelは部署マスターに固定値登録
- 施設別部署一覧取得のみ

**実装コスト**: 3日（¥120,000）
- 元の見積もり: ¥240,000（親子関係あり）
- 削減額: ¥120,000

---

#### 確認-2: 委員会マスター

**回答**: ❌ **存在しません（VoiceDrive側で管理）**

**決定内容**:
- 委員会管理システム実態調査を中止（5日削減）
- 委員会管理はVoiceDrive側で完結
- 小原病院の40以上の委員会を初期登録
- ハイブリッド方式（マスター選択 + フリー入力）採用

**医療システム側の追加実装**: **ゼロ**

---

#### 確認-3: 委員会提出Webhook

**回答**: ✅ **実装不要（シナリオB採用）**

**決定内容**:
- 委員会管理システムが存在しないため、Webhook不要
- 委員会提出フローはVoiceDrive側で完結
- Level 7+が提案書作成 → Level 8+が承認 → VoiceDrive側で委員会提出記録

**医療システム側の追加実装**: **ゼロ**
**コスト削減**: ¥400,000

---

#### 確認-4: API-PM-M-1（職員フルプロフィール取得）

**回答**: ✅ **API-PT-M-1拡張で対応**

**既存API**: PersonalStation API-PT-M-1（職員フルプロフィール取得）
- エンドポイント: `GET /api/employees/:employeeId/full-profile`
- 返却データ: employeeId, firstName, lastName, departmentId, departmentName, positionId, positionName, experienceYears, employmentStatus, hireDate, avatarUrl, **permissionLevel**, **facilityId**, **hierarchyLevel**

**実装方針**:
- API-PT-M-1に以下のフィールド追加:
  - `facilityId` (立神病院 / 小原病院)
  - `hierarchyLevel` (Level 5-13)
- 既存のAPI-PT-M-1実装時に同時追加（追加工数なし）

**実装コスト**: ¥0（API-PT-M-1拡張に含まれる）
**コスト削減**: ¥160,000

---

### 13.2 Phase 1実装スコープ（10月11日〜25日）

#### 医療システム側実装（2人日、¥80,000）

| 項目 | 工数 | コスト |
|------|------|--------|
| API-PT-M-1拡張（facilityId, hierarchyLevel追加） | 0.5日 | ¥20,000 |
| 立神病院委員会データ調査 | 1.5日 | ¥60,000 |
| **小計** | **2日** | **¥80,000** |

**成果物**:
- API-PT-M-1にfacilityId、hierarchyLevel追加完了
- 立神病院委員会データ調査結果（キックオフミーティングで共有）

---

#### VoiceDrive側実装（14人日）

| 項目 | 工数 | 内容 |
|------|------|------|
| Post拡張テーブル追加 | 1日 | agendaLevel, agendaStatus, responsibleLevel, isAgenda, deadlineAt 追加 |
| ResponsibilityActionテーブル追加 | 1日 | 責任者アクション記録 |
| Committeeテーブル追加（ハイブリッド対応） | 2日 | マスター選択 + フリー入力対応 |
| 小原病院委員会データ初期登録 | 1日 | 40委員会の初期登録 |
| ProposalManagementPage統合 | 3日 | 権限別フィルタリング実装 |
| 委員会選択UI実装（マスター選択モード） | 2日 | Committee選択機能 |
| 期限管理実装 | 2日 | 投票期限・延長機能 |
| API-PT-M-1拡張連携テスト | 1日 | API連携確認 |
| Phase 1統合テスト・デバッグ | 1日 | Phase 1完了 |
| **小計** | **14日** | |

**成果物**:
- Level 5-13の責任者が投稿を管理可能
- 6段階議題レベル自動判定動作
- 権限別管理画面動作
- 委員会選択機能動作（マスター選択）

---

### 13.3 Phase 2実装スコープ（10月28日〜11月8日）

#### 医療システム側実装（3人日、¥120,000）

| 項目 | 工数 | コスト |
|------|------|--------|
| API-PM-M-2簡易版実装（組織階層API） | 3日 | ¥120,000 |
| **小計** | **3日** | **¥120,000** |

**実装内容**:
```typescript
GET /api/organization/departments?facilityId=obara-hospital

Response: {
  success: true,
  data: {
    facilityId: "obara-hospital",
    facilityName: "小原病院",
    departments: [
      {
        departmentId: "nursing",
        departmentName: "看護部",
        responsibleLevel: 8
      },
      {
        departmentId: "nursing_ward_a",
        departmentName: "看護部A病棟",
        responsibleLevel: 6
      },
      {
        departmentId: "medical_care_ward",
        departmentName: "医療療養病棟",
        responsibleLevel: 8
      }
    ]
  }
}
```

**成果物**:
- API-PM-M-2簡易版実装完了
- 施設別部署一覧取得可能

---

#### VoiceDrive側実装（14人日）

| 項目 | 工数 | 内容 |
|------|------|------|
| ProposalDocumentテーブル追加 | 2日 | 議題提案書データモデル |
| 議題提案書自動生成ロジック実装 | 3日 | Level 7+向け提案書生成 |
| SubmissionRequestテーブル追加 | 1日 | 委員会提出リクエスト |
| CommitteeManagementPage統合 | 3日 | 委員会管理画面 |
| フリー入力モード追加 | 2日 | 自由記入委員会名 |
| 自動マスター登録ロジック実装 | 2日 | フリー入力→Committee自動登録 |
| Phase 2統合テスト・デバッグ | 1日 | Phase 2完了 |
| **小計** | **14日** | |

**成果物**:
- 議題提案書自動生成機能動作
- Level 7+ → Level 8+ 委員会提出フロー動作
- ハイブリッド委員会選択（マスター + フリー入力）

---

### 13.4 Phase 3実装スコープ（11月11日〜15日）

#### 医療システム側実装（0人日、¥0）

結合テスト参加のみ（追加実装なし）

---

#### VoiceDrive側実装（7人日）

| 項目 | 工数 | 内容 |
|------|------|------|
| PostManagementTimelineテーブル追加 | 1日 | タイムライン記録 |
| 統計・分析機能実装 | 3日 | 議題化率、承認率分析 |
| 通知システム統合 | 2日 | 責任者変更通知 |
| Phase 3統合テスト・本番リリース準備 | 1日 | 全機能完成 |
| **小計** | **7日** | |

**成果物**:
- 投稿管理タイムライン動作
- 統計・分析機能動作
- 本番リリース準備完了

---

### 13.5 総コスト計算

| Phase | 期間 | 医療システム | VoiceDrive | 合計コスト |
|-------|------|-------------|-----------|----------|
| **Phase 1** | 10/11-10/25 | 2日（¥80,000） | 14日 | ¥80,000 |
| **Phase 2** | 10/28-11/8 | 3日（¥120,000） | 14日 | ¥120,000 |
| **Phase 3** | 11/11-11/15 | 0日（¥0） | 7日 | ¥0 |
| **合計** | | **5日（¥200,000）** | **35日** | **¥200,000** |

**元の見積もりとの差額**: ¥800,000 - ¥200,000 = **¥600,000削減（75%削減）**

---

### 13.6 コスト削減の理由

#### 削減項目1: API-PM-M-1（¥160,000削減）

**元の見積もり**: 4人日（¥160,000）
- 新規API実装

**最終コスト**: ¥0
- API-PT-M-1拡張で対応（facilityId, hierarchyLevel追加のみ）

---

#### 削減項目2: API-PM-M-2（¥120,000削減）

**元の見積もり**: 6人日（¥240,000）
- 親子関係ありの組織階層API

**最終コスト**: 3人日（¥120,000）
- 簡易版（親子関係なし）

---

#### 削減項目3: WH-PM-M-1（¥400,000削減）

**元の見積もり**: 10人日（¥400,000）
- 委員会提出Webhook実装

**最終コスト**: ¥0
- 委員会管理システム不在により実装不要（シナリオB採用）

---

### 13.7 医療システム側DB拡張（なし）

Phase 1, Phase 2, Phase 3では既存テーブルのみ使用。追加テーブルなし。

---

### 13.8 VoiceDrive側DB拡張（CRITICAL）

#### Committeeテーブル（委員会マスター - ハイブリッド対応）

```prisma
model Committee {
  id          String    @id @default(cuid())

  // 基本情報
  name        String
  facilityId  String?   // null = 全施設共通, "obara-hospital" | "tategami-rehabilitation"

  // 階層構造（オプショナル）
  parentCommitteeId String?
  hierarchyLevel    Int?  // 1: 理事会直下, 2: 病院運営委員会直下, 3: 専門委員会, 4: サブ委員会

  // カテゴリー分類（オプショナル）
  category    String?   // "医療安全・品質" | "業務改善" | "人事・労務" | "経営・運営" | "その他"
  description String?

  // 権限設定
  minSubmissionLevel Int @default(7)
  approvalLevel      Int @default(8)

  // 開催情報（オプショナル）
  meetingFrequency String?   // "月1回" | "隔週" | "随時" | "年4回"
  nextMeetingDate  DateTime?

  // ステータス
  isActive     Boolean @default(true)
  isMasterData Boolean @default(false)  // true: 管理者登録, false: 自動登録（フリー入力から）

  // タイムスタンプ
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  createdBy   String?

  // リレーション
  parentCommittee Committee?  @relation("CommitteeHierarchy", fields: [parentCommitteeId], references: [id])
  childCommittees Committee[] @relation("CommitteeHierarchy")
  members         CommitteeMember[]
  submissions     SubmissionRequest[]

  @@index([facilityId])
  @@index([isActive])
  @@index([isMasterData])
  @@index([parentCommitteeId])
  @@index([hierarchyLevel])
}
```

#### SubmissionRequestテーブル（委員会提出リクエスト - ハイブリッド対応）

```prisma
model SubmissionRequest {
  id              String    @id @default(cuid())
  documentId      String
  postId          String

  // 柔軟な委員会指定（ハイブリッド方式）
  committeeId         String?  // Committeeマスターから選択した場合
  customCommitteeName String?  // フリー入力の場合（自動的にマスター登録される）

  // リクエスト情報
  requestedBy     String
  requestedByName String?
  requestedByLevel Int
  requestedDate   DateTime  @default(now())
  targetCommittee String    // 表示用（committeeId → name または customCommitteeName）

  // 承認情報
  status          String    @default("pending") // 'pending' | 'approved' | 'rejected'
  reviewedBy      String?
  reviewedByName  String?
  reviewedByLevel Int?
  reviewedDate    DateTime?
  reviewNotes     String?

  // リレーション
  document        ProposalDocument @relation(fields: [documentId], references: [id], onDelete: Cascade)
  post            Post             @relation(fields: [postId], references: [id], onDelete: Cascade)
  committee       Committee?       @relation(fields: [committeeId], references: [id])

  @@index([documentId])
  @@index([postId])
  @@index([status])
  @@index([committeeId])
}
```

#### ProposalDocumentテーブル（議題提案書）

```prisma
model ProposalDocument {
  id                String   @id @default(cuid())
  postId            String
  proposalTitle     String
  proposalSummary   String
  proposalReason    String
  expectedOutcome   String
  createdBy         String
  createdByName     String?
  createdByLevel    Int
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // リレーション
  post              Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  submissions       SubmissionRequest[]

  @@index([postId])
  @@index([createdBy])
}
```

#### Post拡張（議題化情報追加）

```prisma
model Post {
  // 既存フィールド...

  // 議題化情報
  agendaLevel       Int?      @default(0)    // 0-29: PENDING, 30-49: DEPT_REVIEW, 50-99: DEPT_AGENDA, 100-299: FACILITY_AGENDA, 300-599: CORP_REVIEW, 600+: CORP_AGENDA
  agendaStatus      String?   @default("pending") // 'pending' | 'under_review' | 'approved' | 'rejected'
  responsibleLevel  Int?                     // Level 5-13（現在の責任者権限レベル）
  isAgenda          Boolean   @default(false) // 議題化されているか
  deadlineAt        DateTime?                // 投票期限・議題検討期限

  // リレーション追加
  proposalDocuments ProposalDocument[]
  submissions       SubmissionRequest[]
  responsibilityActions ResponsibilityAction[]
}
```

#### ResponsibilityActionテーブル（責任者アクション記録）

```prisma
model ResponsibilityAction {
  id              String   @id @default(cuid())
  postId          String
  actionType      String   // 'escalate' | 'approve' | 'reject' | 'extend_deadline' | 'assign_committee'
  performedBy     String
  performedByName String?
  performedByLevel Int
  previousLevel   Int?
  newLevel        Int?
  notes           String?
  createdAt       DateTime @default(now())

  // リレーション
  post            Post @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@index([postId])
  @@index([actionType])
  @@index([performedBy])
}
```

#### PostManagementTimelineテーブル（投稿管理タイムライン）

```prisma
model PostManagementTimeline {
  id              String   @id @default(cuid())
  postId          String
  eventType       String   // 'created' | 'escalated' | 'approved' | 'rejected' | 'committee_submitted' | 'deadline_extended'
  agendaLevel     Int
  responsibleLevel Int
  performedBy     String?
  performedByName String?
  description     String
  createdAt       DateTime @default(now())

  // リレーション
  post            Post @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@index([postId])
  @@index([eventType])
  @@index([createdAt])
}
```

---

### 13.9 統合テスト計画

#### Phase 1統合テスト（10月25日）

**テスト項目**:
- ✅ API-PT-M-1でfacilityId、hierarchyLevel取得成功
- ✅ Level 5-13の責任者が投稿を管理可能
- ✅ 6段階議題レベル自動判定動作
- ✅ 権限別管理画面動作
- ✅ 委員会選択機能動作（マスター選択）

---

#### Phase 2統合テスト（11月8日）

**テスト項目**:
- ✅ API-PM-M-2で施設別部署一覧取得成功
- ✅ 議題提案書自動生成成功
- ✅ Level 7+ → Level 8+ 委員会提出フロー動作
- ✅ ハイブリッド委員会選択（マスター + フリー入力）動作
- ✅ フリー入力→Committee自動登録動作

---

#### Phase 3統合テスト（11月15日）

**テスト項目**:
- ✅ 投稿管理タイムライン動作
- ✅ 統計・分析機能動作
- ✅ 通知システム統合動作
- ✅ 本番リリース準備完了

---

### 13.10 関連ドキュメント

#### 既存ドキュメント
- [投稿管理暫定マスターリスト_20251009.md](./mcp-shared/docs/投稿管理暫定マスターリスト_20251009.md)
- [投稿管理_DB要件分析_20251009.md](./mcp-shared/docs/投稿管理_DB要件分析_20251009.md)
- [Response_PostManagement_Integration_20251010.md](./mcp-shared/docs/Response_PostManagement_Integration_20251010.md) ✅ **10月10日作成**
- [Final_Confirmation_PostManagement_Integration_20251010.md](./mcp-shared/docs/Final_Confirmation_PostManagement_Integration_20251010.md) ✅ **10月10日最終確認**

#### 作成予定ドキュメント
- [ ] API-PM-M-2実装仕様書（医療システムチーム、10月21日）
- [ ] 委員会マスターデータ仕様書（VoiceDriveチーム、10月14日）
- [ ] Phase 3統合テスト報告書（投稿管理）（両チーム、11月15日）

---

## Phase 14: 健康ステーション（HealthStation）統合実装【新規追加】🆕

### 実施期間: Phase 14.0（10月10日〜11日）**準備フェーズ** + Phase 14.1-3（共通DB構築後）**本実装**

### 概要

VoiceDrive 健康ステーション機能の実装を行います。医療職員管理システムから職員の健康データを受信し、職員が自身の健康情報を確認できるパーソナルヘルスダッシュボードを構築します。**医療システム側の開発は完全に不要（¥0）**です。

**目的**:
- 健康データ通知受信（医療システムから健康リスク評価・検診結果をファイル経由で受信）
- ファイル監視（`mcp-shared/notifications/` フォルダを自動監視）
- 優先度判定（リスクレベルに基づいて自動的に優先度を判定）
- 健康ダッシュボード（総合健康スコア、リスクレベル、推奨アクション表示）
- 通知管理（未読/既読管理、優先度別フィルタリング）
- 健康レポート（個人・部署・組織レベルの健康レポート生成）

**重要**: ファイルベースの連携により、医療システム側の追加実装が完全に不要（API開発・Webhook実装不要）

**実装戦略**:
- **Phase 14.0（準備フェーズ）**: JSONサンプルファイル作成・ファイル検知テストのみ（**DB操作なし**）← 今すぐ実施可能 ✅
- **Phase 14.1-3（本実装）**: テーブル作成・通知処理・UI実装（**DB操作あり**）← 共通DB（MySQL）構築完了後に実施

**関連ドキュメント**:
- [健康ステーション暫定マスターリスト_20251009.md](./mcp-shared/docs/健康ステーション暫定マスターリスト_20251009.md)
- [HealthStation_DB要件分析_20251009.md](./mcp-shared/docs/HealthStation_DB要件分析_20251009.md)
- [Response_HealthStation_Integration_20251010.md](./mcp-shared/docs/Response_HealthStation_Integration_20251010.md) ✅ **10月10日作成**
- [Phase14.0_Implementation_Guide_20251010.md](./mcp-shared/docs/Phase14.0_Implementation_Guide_20251010.md) ✅ **10月10日作成**

---

### 14.0 準備フェーズ（Phase 14.0）✅ **実施中**

**実施期間**: 2025年10月10日〜11日（**今すぐ実施可能**）

**実施内容**: JSONサンプルファイル作成・ファイル検知テストのみ（**DB操作なし**）

**目的**:
- ファイルベース連携の動作確認
- JSONフォーマット検証
- 優先度判定ロジック確認
- 共通DB構築前にリスクゼロで検証

#### 14.0.1 医療システムチーム作業

| 項目 | 内容 | 工数 | 担当 | ステータス |
|------|------|------|------|-----------|
| サンプルディレクトリ作成 | `c:\projects\voicedrive-v100\mcp-shared\notifications\samples\` | 0.1日 | 医療システム | ✅ 完了 |
| JSONサンプルファイル作成 | 4種類の通知タイプ × 1サンプル = 4ファイル | 0.4日 | 医療システム | ✅ 完了 |

**作成済みサンプルファイル** ✅:
1. `health_notif_OH-NS-2024-001_20251010100000.json` - health_risk_assessment（優先度: medium）
2. `health_notif_OH-NS-2024-002_20251010100100.json` - health_checkup_result（優先度: low）
3. `health_notif_OH-NS-2024-003_20251010100200.json` - stress_check_result（優先度: high）
4. `health_notif_OH-NS-2024-004_20251010100300.json` - reexamination_required（優先度: urgent）

**医療システム工数**: **0.5日** ✅ 完了

#### 14.0.2 VoiceDriveチーム作業

| 項目 | 内容 | 工数 | 担当 | ステータス |
|------|------|------|------|-----------|
| テストスクリプト作成 | `tests/phase14.0-file-detection-test.ts` | 0.3日 | VoiceDrive | ⏳ 待機中 |
| ファイル検知テスト | 4ファイル全て検知されるか確認 | 0.1日 | VoiceDrive | ⏳ 待機中 |
| JSONパーステスト | 4ファイル全てパース成功するか確認 | 0.1日 | VoiceDrive | ⏳ 待機中 |

**VoiceDrive工数**: **0.5日**

**テスト実行コマンド**:
```bash
cd c:\projects\voicedrive-v100
npx ts-node tests/phase14.0-file-detection-test.ts
```

**期待される結果**:
```
=== Phase 14.0: ファイル検知テスト開始 ===

検知されたファイル数: 4
✅ 優先度判定: 正常（4/4ファイル）
✅ JSONパース: 成功（4/4ファイル）

=== Phase 14.0: ファイル検知テスト完了 ===
```

#### 14.0.3 成功条件

| 項目 | 確認内容 | 担当 | ステータス |
|------|---------|------|-----------|
| ✅ ファイル配置 | 4ファイルがsamples/フォルダに存在 | 医療システム | ✅ 完了 |
| ✅ ファイル検知 | 4ファイル全てが検知される | VoiceDrive | ✅ 完了 (4/4) |
| ✅ JSONパース | 4ファイル全てがパース成功 | VoiceDrive | ✅ 完了 (4/4) |
| ✅ 優先度判定 | 4ファイル全てが正しい優先度判定 | VoiceDrive | ✅ 完了 (4/4) |

**Phase 14.0完了条件**: 上記4項目全て ✅ **達成**

**Phase 14.0のコスト**: **¥0**（既存環境での検証のみ）

**Phase 14.0完了日**: **2025年10月10日** ✅

**Phase 14.0完了報告書**: [Phase14.0_Test_Result_Report_20251010.md](./Phase14.0_Test_Result_Report_20251010.md) ✅

**テスト結果サマリー**:
- サンプルファイル配置: 4件 ✅
- ファイル検知: 4/4成功 ✅
- JSON解析: 4/4成功 ✅
- 優先度判定: 4/4正常 ✅
- エラー発生: 0件 ✅

**⚠️ Phase 14.0では実施しないこと**:
- ❌ データベース操作（テーブル作成・マイグレーション）
- ❌ 通知データのDB保存
- ❌ HealthStation UI実装
- ❌ 本番環境でのテスト

**Phase 14.0完了判定**: 🟢 **全成功条件クリア** - ファイルベース連携が正常に動作することを確認

---

### 14.1 本実装フェーズ（Phase 14.1-3）⏳ **共通DB構築後に実施**

**実施タイミング**: Phase 1.6（ライトセイル構築）完了後

**実施期間**: Phase 1（11月18日〜22日）+ Phase 2（11月25日〜29日）+ Phase 3（12月2日〜6日）

#### 14.1.1 医療システム側確認事項（10月10日回答済み）✅

#### 確認-1: ファイル配置方式

**質問**: `c:\projects\voicedrive-v100\mcp-shared\notifications\` フォルダへのファイル配置方式で問題ありませんか？

**回答**: ✅ **問題ありません**

**実装方針**:
- 医療システム側でファイルコピーのバッチ処理を実装済み
- 月次バッチ処理（毎月1日 02:00 JST）でJSON通知ファイルを配置
- アクセス権限の問題なし

**医療システム側の追加実装**: **ゼロ**

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

**タイムスタンプ形式**: `YYYYMMDDHHmmss`

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

---

#### 確認-4: リスクレベル判定

**質問**: 医療システム側でリスクレベル判定（overallScore, overallLevel）を行い、VoiceDriveは受信するだけで問題ありませんか？

**回答**: ✅ **問題ありません（推奨）**

**リスクレベル定義**:

| レベル | スコア範囲 | 説明 | 対応 |
|--------|-----------|------|------|
| **very-high** | 0-39点 | 要緊急対応 | 即座に医療機関受診・産業医面談 |
| **high** | 40-59点 | 要注意 | 1週間以内に保健指導・面談 |
| **medium** | 60-79点 | 経過観察 | 3ヶ月後フォローアップ |
| **low** | 80-100点 | 良好 | 次回定期健診まで経過観察 |

**VoiceDrive側の役割**:
- 受信した `overallScore` と `overallLevel` をそのまま表示
- 優先度判定（`overallLevel` → `priority`）
- 通知・アクション実行

---

#### 確認-5: 健康診断データ

**質問**: 検査値の生データ（BMI、血圧、コレステロール等）はVoiceDriveに保存する必要がありますか？

**回答**: ⚠️ **医療システム側で保持、VoiceDriveには評価結果のみ送信（推奨）**

**送信するデータ**:
- 総合健康スコア（overallScore）
- 総合リスクレベル（overallLevel）
- 高リスクカテゴリー（highRiskCategories）
- 優先対応事項（priorityActions）
- 推奨事項（recommendations）

**送信しないデータ**:
- 検査値の生データ（BMI、血圧、コレステロール等）
- 医療システム側で保持（5年間）

---

#### 確認-6: 通知配信頻度

**質問**: 健康通知はどのくらいの頻度で配信されますか？

**回答**: ⚠️ **月次 + 随時（要再検査のみ）**

**通知配信スケジュール**:

| 通知タイプ | 配信頻度 | 配信タイミング | 対象職員数 |
|-----------|---------|--------------|-----------|
| `health_risk_assessment` | 年1回 | 10月1日 02:00 JST | 全職員（約300名） |
| `health_checkup_result` | 年1回 | 10月1日 02:00 JST | 全職員（約300名） |
| `stress_check_result` | 年1回 | 12月1日 02:00 JST | 全職員（約300名） |
| `reexamination_required` | 随時 | 判定後即座（営業時間内） | 該当者のみ（約10-20名/年） |

---

#### 確認-7: ファイル削除

**質問**: 処理済み通知ファイルはVoiceDrive側で削除して良いですか？

**回答**: ✅ **VoiceDrive側で削除して良い**

**削除方針**:
- 処理完了直後: VoiceDriveがファイル削除
- 削除前: ログに記録（JSON内容をバックアップ）
- 医療システム側: 元ファイルは `health_notifications/archive/` に移動

**保存期間**:
- 医療システム: 5年間（医療法準拠）
- VoiceDrive: 5年間（データベース内、医療システムと統一）

---

#### 確認-8: 通知遅延

**質問**: ファイル配置からVoiceDriveでの表示まで最大5秒の遅延が発生しますが、問題ありませんか？

**回答**: ✅ **問題ありません**

**実際の遅延時間**: 最大7.5秒
- 0-5秒（ポーリング待機）
- 1-2秒（ファイル安定性確認）
- 0.5秒（データベース保存）

**影響**: 月次配信（深夜2時）のため、実質的に感じられない

---

#### 確認-9: 緊急通知

**質問**: `urgent` 優先度の通知の場合、5秒ポーリングでは遅すぎますか？

**回答**: ⚠️ **5秒ポーリングで十分（Webhook不要）**

**理由**:
- `urgent` = 要緊急対応（2週間以内に医療機関受診）
- 生命の危険が迫っている状況ではない
- 5秒遅延は医療対応に影響しない

---

#### 確認-10: バックアップ

**質問**: 健康通知データのバックアップ体制はどちら側で管理しますか？

**回答**: ⚠️ **両システムで分担管理（二重バックアップ）**

**バックアップ責任分界**:

| データ種別 | 医療システム | VoiceDrive |
|-----------|-------------|-----------|
| **健康診断生データ** | ✅ 完全バックアップ（5年間） | ❌ 保持しない |
| **リスク評価結果** | ✅ アーカイブ（5年間） | ✅ データベースバックアップ（5年間） |
| **通知配信ログ** | ✅ 配信履歴（5年間） | ✅ 処理ログ（3年間） |
| **職員の既読状態** | ❌ 管理しない | ✅ データベースバックアップ（3年間） |

---

#### 確認-11: 職員ID同期

**質問**: employeeIdは医療システムとVoiceDriveで完全一致していますか？

**回答**: ✅ **完全一致しています**

**職員ID形式**:
```
{施設コード}-{職種コード}-{採用年}-{連番}

例:
OH-NS-2024-001   小原病院、看護師、2024年採用、001番
TR-NS-2024-015   立神病院、看護師、2024年採用、015番
OH-DR-2024-003   小原病院、医師、2024年採用、003番
```

---

#### 確認-12: 通知形式変更

**質問**: 将来的に通知データ形式が変更される可能性はありますか？

**回答**: ⚠️ **変更の可能性あり（バージョン管理で対応）**

**バージョン管理戦略**:

| バージョン | リリース予定 | 変更内容 |
|-----------|------------|---------|
| **1.0.0** | 2025年10月 | 初版（4種類の通知タイプ） |
| **1.1.0** | 2026年4月（予定） | 健康診断項目追加 |
| **2.0.0** | 2027年4月（予定） | メンタルヘルス評価追加 |

**後方互換性の保証**:
- マイナーバージョンアップ（1.0.0 → 1.1.0）: 既存フィールドは変更せず、新規フィールド追加のみ
- メジャーバージョンアップ（1.x.x → 2.0.0）: フィールド構造変更あり、移行期間3ヶ月

---

#### 確認-13: 再検査フォロー

**質問**: 要再検査通知後、職員が再検査を受けたかどうかをVoiceDriveから医療システムに通知する必要はありますか？

**回答**: ⚠️ **Phase 4で実装予定（Webhook方式）**

**現状の運用（Phase 1-3）**:
- VoiceDrive → 医療システムへの通知: **なし**
- 再検査受診状況の確認: 医療システム側で管理
- 職員の既読状態: VoiceDrive内部で管理

**Phase 4実装予定（2026年4月以降）**:
- Webhook送信: 職員が「再検査予約済み」ボタンをクリック時
- 実装コスト: ¥160,000（医療システム側2日）

---

#### 確認-14: プライバシー保護

**質問**: 健康データの保存期間やアクセス権限に関する規定はありますか？

**回答**: ✅ **VoiceDriveの想定で問題なし（一部修正あり）**

**保存期間**: 5年（医療システムと統一、労働安全衛生法準拠）

**アクセス権限**:

| 役割 | 健康通知閲覧 | 全職員の健康データ閲覧 | 統計データ閲覧 |
|------|------------|---------------------|--------------|
| **本人** | ✅ 自分のみ | ❌ 不可 | ❌ 不可 |
| **産業医** | ✅ 全職員 | ✅ 全職員 | ✅ 可能 |
| **人事部（健康管理担当）** | ✅ 全職員 | ⚠️ 匿名化データのみ | ✅ 可能 |
| **一般管理職** | ❌ 不可 | ❌ 不可 | ⚠️ 部署統計のみ |

**プライバシー保護措置**:
1. アクセス制御: 本人・産業医・人事部（健康管理担当）のみ
2. 監査ログ: 全てのアクセスを記録（5年保存）
3. データ暗号化: データベース暗号化（AES-256）
4. 匿名化: 統計データは個人特定不可
5. データ削除: 退職後5年経過で自動削除

---

#### 確認-15: Webhook移行

**質問**: 将来的にファイルベースからWebhook方式に移行する予定はありますか？

**回答**: ⚠️ **Phase 4で検討予定（2026年4月以降）**

**現状の評価（Phase 1-3）**: ファイルベース連携で十分

**Webhook移行の検討条件**:
1. 職員数の増加: 500名以上に増加した場合
2. リアルタイム性の要求: urgent通知で1秒未満の配信が必要な場合
3. 双方向通信の必要性: VoiceDrive → 医療システムへの通知が頻繁に必要な場合

**Phase 4実装見積もり（Webhook移行）**: ¥560,000（医療システム側7日）

**現時点の推奨**: ファイルベース連携で開始し、必要に応じてPhase 4でWebhook移行を検討

---

### 14.2 Phase 1実装スコープ（11月18日〜22日）

#### 医療システム側実装（0人日、¥0）

**作業なし**: ファイル配置方式のため、医療システム側の開発は不要

---

#### VoiceDrive側実装（7人日）

| 項目 | 工数 | 内容 |
|------|------|------|
| HealthNotificationテーブル追加 | 1日 | 健康通知データモデル |
| HealthNotificationProcessLogテーブル追加 | 0.5日 | 処理ログ記録 |
| HealthNotificationReadStatusテーブル追加 | 0.5日 | 既読管理 |
| ファイル監視機能統合 | 1日 | healthNotificationWatcher.ts 統合 |
| 通知処理ハンドラー統合 | 1日 | healthNotificationHandler.ts 統合 |
| HealthStation UI統合 | 2日 | 通知表示・フィルタリング実装 |
| Phase 1統合テスト | 1日 | 動作確認 |
| **小計** | **7日** | |

**成果物**:
- ファイル監視システム稼働
- 通知データベース保存動作
- HealthStation表示動作

---

### 14.3 Phase 2実装スコープ（11月25日〜29日）

#### 医療システム側実装（0人日、¥0）

**作業なし**: VoiceDrive内部機能のため、医療システム側の開発は不要

---

#### VoiceDrive側実装（7人日）

| 項目 | 工数 | 内容 |
|------|------|------|
| 既読管理API実装 | 2日 | POST /api/health/notifications/:id/mark-as-read<br>PUT /api/health/notifications/:id/action-taken |
| 統計API実装 | 1日 | GET /api/health/notifications/stats 強化 |
| フィルタリング機能 | 2日 | 優先度別・リスクレベル別・既読/未読フィルタ |
| HealthStation UI改善 | 2日 | 既読/未読切り替え、優先度別タブ |
| **小計** | **7日** | |

**成果物**:
- 既読管理機能動作
- 統計情報表示
- フィルタリング機能

---

### 14.4 Phase 3実装スコープ（12月2日〜6日）

#### 医療システム側実装（0人日、¥0）

**作業なし**: VoiceDrive内部機能のため、医療システム側の開発は不要

---

#### VoiceDrive側実装（7人日）

| 項目 | 工数 | 内容 |
|------|------|------|
| HealthReportテーブル追加 | 0.5日 | レポートデータモデル |
| レポート生成ロジック実装 | 2日 | 個人・部署・組織レポート生成 |
| レポートAPI実装 | 1日 | GET /api/health/reports<br>GET /api/health/reports/:reportId<br>POST /api/health/reports/generate |
| レポートUI実装 | 2.5日 | レポート一覧・詳細表示 |
| PDF/Markdown出力機能 | 0.5日 | ファイル出力 |
| 統合テスト | 0.5日 | 全機能確認 |
| **小計** | **7日** | |

**成果物**:
- レポート生成機能動作
- レポートUI表示
- PDF/Markdown出力

---

### 14.5 総コスト計算

| Phase | 期間 | 医療システム | VoiceDrive | 合計コスト |
|-------|------|-------------|-----------|----------|
| **Phase 1** | 11/18-11/22 | 0日（¥0） | 7日 | ¥0 |
| **Phase 2** | 11/25-11/29 | 0日（¥0） | 7日 | ¥0 |
| **Phase 3** | 12/2-12/6 | 0日（¥0） | 7日 | ¥0 |
| **合計** | | **0日（¥0）** | **21日** | **¥0** |

**元の見積もりとの差額**: 医療システム側の開発が完全に不要（API開発・Webhook実装不要）

---

### 14.6 コスト削減の理由

#### ファイルベース連携の採用

**医療システム側の作業**:
- API開発: **不要**
- Webhook実装: **不要**
- ファイル配置のみ（月次バッチ処理）

**VoiceDrive側の作業**:
- ファイル監視（5秒ポーリング）
- 通知処理（優先度判定・アクション実行）
- データベース保存・UI表示

---

### 14.7 医療システム側DB拡張（なし）

Phase 1, Phase 2, Phase 3では既存テーブルのみ使用。追加テーブルなし。

---

### 14.8 VoiceDrive側DB拡張（CRITICAL）

#### HealthNotificationテーブル（健康通知）

```prisma
model HealthNotification {
  id                    String    @id @default(cuid())

  // 基本情報
  notificationType      String    // 'health_risk_assessment' | 'health_checkup_result' | 'stress_check_result' | 'reexamination_required'
  employeeId            String    // 職員ID
  employeeName          String?   // 職員名（キャッシュ用）

  // 優先度・リスク情報
  priority              String    // 'urgent' | 'high' | 'medium' | 'low'
  riskLevel             String?   // 'very-high' | 'high' | 'medium' | 'low'
  overallScore          Float?    // 総合健康スコア（0-100）

  // 健康評価データ（JSON）
  healthAssessment      Json?     // HealthAssessment型
  recommendations       Json?     // HealthRecommendations型
  highRiskCategories    Json?     // HighRiskCategory[] 型

  // 推奨事項
  priorityActions       Json?     // string[] 優先対応事項
  nextCheckup           DateTime? // 次回検診推奨日

  // 通知メタデータ
  notificationSource    String?   // 'staff-medical-system'
  notificationVersion   String?   // '1.0.0'
  receivedAt            DateTime  @default(now())

  // 処理状態
  processedStatus       String    @default("pending") // 'pending' | 'processed' | 'failed'
  processedAt           DateTime?
  processingActions     Json?     // 実行されたアクション一覧

  // ファイル情報
  sourceFilename        String    // 元のファイル名
  sourceFilePath        String?   // 元のファイルパス

  // 既読管理
  isRead                Boolean   @default(false)
  readAt                DateTime?

  // タイムスタンプ
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  // リレーション
  processLogs           HealthNotificationProcessLog[]
  readStatus            HealthNotificationReadStatus[]

  @@index([employeeId])
  @@index([notificationType])
  @@index([priority])
  @@index([riskLevel])
  @@index([processedStatus])
  @@index([receivedAt])
}
```

#### HealthNotificationProcessLogテーブル（通知処理ログ）

```prisma
model HealthNotificationProcessLog {
  id                    String    @id @default(cuid())
  notificationId        String

  // 処理情報
  processType           String    // 'priority_determination' | 'action_execution' | 'error_handling'
  processStatus         String    // 'success' | 'failed'
  priority              String?   // 判定された優先度

  // 実行アクション
  actionsExecuted       Json?     // string[] 実行されたアクション
  actionResults         Json?     // アクション実行結果

  // エラー情報
  errorMessage          String?
  errorStack            String?

  // タイムスタンプ
  processedAt           DateTime  @default(now())

  // リレーション
  notification          HealthNotification @relation(fields: [notificationId], references: [id], onDelete: Cascade)

  @@index([notificationId])
  @@index([processType])
  @@index([processedAt])
}
```

#### HealthNotificationReadStatusテーブル（通知既読状態）

```prisma
model HealthNotificationReadStatus {
  id                    String    @id @default(cuid())
  notificationId        String
  employeeId            String

  // 既読状態
  isRead                Boolean   @default(false)
  readAt                DateTime?

  // アクション状態
  actionTaken           Boolean   @default(false)
  actionTakenAt         DateTime?
  actionNotes           String?

  // タイムスタンプ
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  // リレーション
  notification          HealthNotification @relation(fields: [notificationId], references: [id], onDelete: Cascade)

  @@unique([notificationId, employeeId])
  @@index([employeeId])
  @@index([isRead])
}
```

#### HealthReportテーブル（健康レポート）

```prisma
model HealthReport {
  id                    String    @id @default(cuid())
  reportId              String    @unique

  // レポート基本情報
  reportType            String    // 'individual' | 'department' | 'organization'
  targetEmployeeId      String?   // 個人レポートの場合
  targetDepartment      String?   // 部署レポートの場合
  targetOrganization    String?   // 組織レポートの場合

  // レポート期間
  periodStart           DateTime
  periodEnd             DateTime

  // サマリー情報
  totalStaff            Int?      // 対象職員数
  averageScore          Float?    // 平均健康スコア
  highRiskCount         Int?      // 高リスク者数
  actionRequiredCount   Int?      // 要対応者数

  // レポートデータ（JSON）
  reportData            Json

  // ファイル情報
  format                String    @default("json")
  filePath              String?

  // 生成情報
  generatedAt           DateTime  @default(now())
  generatedBy           String?

  // タイムスタンプ
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([reportType])
  @@index([targetEmployeeId])
  @@index([targetDepartment])
  @@index([generatedAt])
}
```

---

### 14.9 統合テスト計画

#### Phase 1統合テスト（11月22日）

**テスト項目**:
- ✅ ファイル監視システム稼働確認
- ✅ 新規通知ファイル自動検知
- ✅ 通知データベース保存成功
- ✅ HealthStation表示確認
- ✅ 優先度別表示動作

---

#### Phase 2統合テスト（11月29日）

**テスト項目**:
- ✅ 既読/未読管理動作確認
- ✅ 統計情報表示確認
- ✅ フィルタリング機能動作確認
- ✅ 優先度別タブ切り替え動作

---

#### Phase 3統合テスト（12月6日）

**テスト項目**:
- ✅ レポート生成機能動作確認
- ✅ 個人・部署・組織レポート表示確認
- ✅ PDF/Markdown出力成功
- ✅ 全機能統合テスト

---

### 14.10 関連ドキュメント

#### 既存ドキュメント
- [健康ステーション暫定マスターリスト_20251009.md](./mcp-shared/docs/健康ステーション暫定マスターリスト_20251009.md)
- [HealthStation_DB要件分析_20251009.md](./mcp-shared/docs/HealthStation_DB要件分析_20251009.md)
- [Response_HealthStation_Integration_20251010.md](./mcp-shared/docs/Response_HealthStation_Integration_20251010.md) ✅ **10月10日作成**

#### 作成完了ドキュメント
- [x] **Phase 14.0実装手順書（医療システムチーム、10月10日）** ✅ 完了
  - [Phase14.0_Implementation_Guide_20251010.md](./Phase14.0_Implementation_Guide_20251010.md)
- [x] **健康通知JSONサンプル集（医療システムチーム、10月10日）** ✅ 完了
  - 4ファイル作成済み（mcp-shared/notifications/samples/）
- [x] **Phase 14.0完了報告書（VoiceDriveチーム、10月10日）** ✅ 完了
  - [Phase14.0_Test_Result_Report_20251010.md](./Phase14.0_Test_Result_Report_20251010.md)
  - テスト結果: 全成功条件クリア（4/4ファイル検知成功、エラー0件）

#### 作成予定ドキュメント
- [ ] Phase 14.1実装計画書（VoiceDriveチーム、共通DB構築後）
- [ ] 統合テスト計画書（両チーム、共通DB構築後）
- [ ] Phase 14.3統合テスト報告書（健康ステーション）（両チーム、12月6日）

---

## 連絡先

### 医療システムチーム
- プロジェクトリーダー: medical-lead@example.com
- 技術担当: medical-tech@example.com
- **LLM担当**: medical-ai-team@example.com

### VoiceDriveチーム
- プロジェクトリーダー: voicedrive-lead@example.com
- 技術担当: voicedrive-tech@example.com

### Slack
- **統合プロジェクト**: #lightsail-integration
- **LLMモデレーション**: #llm-integration

---

## 更新履歴

| 日付 | バージョン | 更新者 | 更新内容 |
|------|-----------|--------|---------|
| 2025-09-20 | 1.0 | 医療システムチーム | 初版作成 |
| 2025-09-30 | 1.1 | 医療システムチーム | Phase 4（職員ライフサイクル管理）追加 |
| 2025-10-05 | 2.0 | 医療システムチーム | Phase 1.5（LLMコンテンツモデレーション統合）追加<br>- ライトセイルLLMインスタンス仕様追加<br>- Week 6-8スケジュール詳細化<br>- 両チーム作業再開手順を明記<br>- コスト見積もり更新<br>- KPI更新（LLM関連追加） |
| **2025-10-05** | **2.1** | **医療システムチーム** | **🔄 Option B採用: Llama 3.2:3bモデル統一**<br>- 16GB統合インスタンス構成に変更<br>- 8B → 3b変更（法人SNS環境最適化）<br>- メモリ配分見直し（余裕6-7GB確保）<br>- 月額運用費 ¥33,500 → ¥21,500（¥12,000削減）<br>- 精度目標調整（90% → 85%、法人環境で十分）<br>- 応答速度向上（1.5秒 → 1.0秒目標）<br>- VoiceDriveチームへ経緯説明追加 |
| **2025-10-08** | **2.2** | **医療システムチーム** | **🆕 Phase 1.2追加: VoiceDrive MySQL移行**<br>- VoiceDrive SQLite → MySQL移行計画追加<br>- Week 6スケジュールに移行作業を反映<br>- 共同確認ミーティング設定（10/11金曜15:00）<br>- 医療チーム作業: 接続確認のみ（開発作業なし）<br>- VoiceDriveチーム作業: DB移行、統合テスト再実施<br>- 成功指標・リスク対策を明記<br>- 関連ドキュメント3件追加予定 |
| **2025-10-09** | **2.3** | **医療システムチーム** | **🆕 Phase 7追加: PersonalStation統合実装**<br>- PersonalStationページDB要件分析への回答を反映<br>- API-2（経験年数サマリ）実装計画追加<br>- Webhook-2（経験年数更新）日次バッチ実装計画追加<br>- VoiceDrive側DB拡張（User.experienceYears、VoteHistory、UserActivitySummary）<br>- 3段階実装（Phase 1: 経験年数API、Phase 2: 投票履歴、Phase 3: 最適化）<br>- 実施期間: 11月4日〜12月5日（4週間）<br>- 本番リリース: 12月5日 02:00 JST<br>- 開発工数: 20人日、開発費: ¥1,000,000<br>- 運用コスト追加: ¥0/月（既存インフラ内で対応） |
| **2025-10-09** | **2.4** | **医療システムチーム** | **🆕 Phase 7拡張: Dashboard同時実装追加**<br>- DashboardページをPersonalStationと同時実装<br>- PersonalStationの成果物を流用（API-2、VoteHistory、UserActivitySummary）<br>- 医療システム側の追加実装: ゼロ（流用のみ）<br>- VoiceDrive側の追加工数: 約0.5人日（Dashboard.tsx修正のみ）<br>- 11月7日〜8日に同時実装<br>- Dashboard関連ドキュメント2件追加 |
| **2025-10-09** | **2.5** | **医療システムチーム** | **🆕 Phase 8追加: DepartmentStation統合実装**<br>- DepartmentStationページDB要件分析完了<br>- 医療システム側の新規API実装: 2件（API-3部門メンバー、API-4部門統計）<br>- VoiceDrive側の新規テーブル: 1件（Post、CRITICAL）<br>- VoiceDrive側の新規サービス: 2件（DepartmentStatsService、DepartmentPostService、約400行）<br>- 事前確認フェーズ（11月1日〜3日）: 確認事項3件<br>- Phase 1実装（11月7日〜8日）: API + Postテーブル作成<br>- Phase 2実装（11月11日〜15日）: ProjectMember拡張（任意）<br>- 実施期間: 11月7日〜15日（9日間）<br>- 開発工数: 11人日、開発費: ¥550,000<br>- 運用コスト追加: ¥0/月（既存インフラ内で対応）<br>- DepartmentStation関連ドキュメント2件追加 |
| **2025-10-09** | **2.6** | **医療システムチーム** | **🆕 Phase 8.5追加: TeamLeaderDashboard統合実装**<br>- TeamLeaderDashboardページDB要件分析完了<br>- 🔴 CRITICAL決定事項: Team概念の有無確認（11月15日回答期限）<br>- Option A（Team概念あり）: API-5実装必要、開発工数11人日、¥550,000<br>- Option B（Team概念なし、推奨）: API-3流用、開発工数6.5人日、¥325,000（¥225,000削減）<br>- VoiceDrive側の新規テーブル: 1件（ApprovalTask、CRITICAL）<br>- VoiceDrive側の新規サービス: 2件（ApprovalService、TeamStatsService、約400行）<br>- 事前確認フェーズ（11月15日〜17日）: 確認事項3件<br>- Phase 1実装（11月18日〜22日）: ApprovalTaskテーブル作成<br>- 統合テスト（11月23日）<br>- 実施期間: 11月18日〜26日（9日間）<br>- 運用コスト追加: ¥0/月（既存インフラ内で対応）<br>- TeamLeaderDashboard関連ドキュメント2件追加 |
| **2025-10-10** | **2.7** | **医療システムチーム** | **✅ Phase 8.5確認事項回答完了**<br>- 確認-1回答: Team概念なし（Option B採用決定）<br>- 確認-2回答: 承認権限はpermissionLevelで判定（VoiceDrive側実装）<br>- 確認-3回答: チーム統計はVoiceDrive側で集計、API-3/API-4流用<br>- 医療システム側の追加実装: **ゼロ**<br>- 開発コスト削減: **¥225,000**達成<br>- DepartmentStation成果物の完全流用<br>- Response_TeamLeaderDashboard_Confirmation_20251009.md作成<br>- マスタープランPhase 8.5にOption B採用を反映 |
| **2025-10-10** | **2.8** | **医療システムチーム** | **🆕 Phase 9追加: ComposeForm（投稿フォーム）統合実装**<br>- ComposeForm DB要件分析完了<br>- 🔴 CRITICAL: 現在投稿データはどこにも保存されていない（console.log()のみ）<br>- VoiceDrive側の新規テーブル: 4件（Post、Poll、Event、DataConsent、全てCRITICAL）<br>- VoiceDrive側の新規API: 3件（POST /api/posts、GET/POST /api/consent/:userId）<br>- 医療システム側: Webhook受信エンドポイント拡張（proposal.created イベント追加）<br>- 実施期間: 10月15日〜28日（14日間）<br>- Phase 1（10/11-13）: DBスキーマ実装<br>- Phase 2（10/15-18）: API実装<br>- Phase 3（10/18-20）: ComposeForm統合<br>- Phase 4（10/15-18）: 医療システムWebhook処理<br>- 統合テスト（10/25-27）<br>- 開発工数: 12人日、開発費: ¥600,000<br>- 運用コスト追加: ¥0/月（既存インフラ内で対応）<br>- Response_ComposeForm_Integration_20251009.md作成<br>- ComposeForm関連ドキュメント3件追加 |
| **2025-10-10** | **2.9** | **医療システムチーム** | **✅ ComposeForm Phase 1完了報告受領・Phase 1.6追加**<br>- VoiceDriveチームからPhase 1完了報告受領（10月9日、文書番号: VD-2025-1009-001）<br>- 全11テーブルのPrismaスキーマ実装完了確認（Post、Vote、Comment、Poll、PollOption、PollVote、Event、ProposedDate、DateVote、Participant、DataConsent）<br>- 実装統計: 250行、総フィールド数120、インデックス30+、リレーション20+<br>- スキーマ品質評価: 🟢 優良（リレーション整合性、インデックス設計、命名規則が適切）<br>- マイグレーション実行はPhase 1.6（ライトセイル構築時）に延期（二重作業回避）<br>- **Phase 9.10追加: MySQL移行（ライトセイル構築時実施）**<br>- MySQL移行チェックリスト30項目以上追加（MySQL接続確認、環境変数設定、マイグレーション実行、テーブル作成確認、動作確認、統合テスト）<br>- 所要時間: 約1時間（追加開発工数ゼロ）<br>- ライトセイル構築時に確実に作業再開できる体制を整備<br>- Phase 1受け入れ判定: 🟢 合格（全ての受け入れ基準を満たす）<br>- Acknowledgement_ComposeForm_Phase1_Completion_20251009.md作成（文書番号: MS-2025-1009-001）<br>- マスタープラン Phase 9.2を完了にマーク |
| **2025-10-10** | **2.10** | **医療システムチーム** | **✅ Phase 8.5確認フェーズ完全完了**<br>- VoiceDriveチームから暫定マスターリスト受領（API-5、API-6の新規実装要求）<br>- 医療システムチームが矛盾を発見し、再確認依頼（Clarification_TeamLeaderDashboard_API_Requirement_20251009.md、文書番号: MS-2025-1009-002）<br>- VoiceDriveチームから再確認回答受領（Response_VoiceDrive_TeamLeaderDashboard_Clarification_20251009.md、文書番号: VD-RESPONSE-TEAMLEADER-2025-1009-001）<br>- **Option B（Team = Department、API-3流用）の採用を両チームで最終確認**<br>- API-5、API-6の新規実装要求を撤回（VoiceDriveチーム側で既存API流用に変更）<br>- 医療システム側の追加実装: **ゼロ**（最終確認）<br>- 開発コスト削減: **¥225,000**（最終確認）<br>- VoiceDrive側実装方針確定: TeamLeaderService.ts（承認タスク集計のみ）、API-3流用でチームメンバー表示<br>- チームモラル機能（API-6）はPhase 8.6に延期（12月1日〜15日）<br>- Phase 8.5実装準備完了（11月18日から実装開始可能）<br>- 関連ドキュメント3件追加（確認依頼、VoiceDrive回答、マスタープラン更新） |
| **2025-10-10** | **2.11** | **医療システムチーム** | **🆕 Phase 8.5実装計画確定（TeamLeaderService実装計画受領）**<br>- VoiceDriveチームからTeamLeaderService実装計画受領（TeamLeaderService実装計画_20251009.md、文書番号: VD-IMPL-TEAMLEADER-SERVICE-2025-1009-001）<br>- TeamLeaderService.ts: 5つの主要メソッド実装計画（getTeamMembers、getPendingApprovals、respondToApproval、getRecentActivities、getTeamMetrics）<br>- 実装規模: 約600行（従来の400行から拡張）<br>- データソース明確化: 🔵医療システムAPI-3（チームメンバー）、🟢VoiceDrive（ApprovalTask、Post、Vote、UserActivity）<br>- 実装スケジュール詳細化: 11月18日〜26日（9日間、7タスク）<br>- ユニットテスト計画: TeamLeaderService.test.ts、統合テスト計画<br>- チームモラルセクションコメントアウト箇所明記（TeamLeaderDashboard.tsx:224-246）<br>- Phase 8.5実装詳細をマスタープランに反映<br>- 関連ドキュメント7件（DB要件、暫定マスター訂正版、実装計画、確認書3件、データ管理責任分界点） |
| **2025-10-10** | **2.12** | **医療システムチーム** | **🆕 Phase 10追加: HRAnnouncements（人事お知らせ配信）統合実装**<br>- HRAnnouncements DB要件分析完了<br>- 5つの配信パターン全てサポート（全体、部署、施設、個人、役職）<br>- VoiceDrive側の新規テーブル: 5件（AnnouncementCache、AnnouncementDelivery、AnnouncementRead、AnnouncementAction、AnnouncementStats、全てCRITICAL）<br>- 医療システム側の新規テーブル: 1件（AnnouncementStatistics）<br>- 医療システム側の新規API: 7件（API-7配信、API-9施設メンバー、API-10役職メンバー、API-11従業員数、API-12離職率、API-16採用状況、統計Webhook受信、アクションWebhook受信）<br>- API-8は既存のDepartmentStation API-3を流用（追加コスト¥0）<br>- VoiceDrive側の新規画面: 2件（HRAnnouncements、HRManagementDashboard）<br>- 双方向統合: 医療→VD（お知らせ配信）、VD→医療（統計Webhook 02:00 JST、アクションWebhook リアルタイム）<br>- リアルタイム通知: apply、contactのみ（confirm、downloadは日次バッチ）<br>- データ保持期間: AnnouncementCache（1年）、配信・既読・アクション記録（3年）、統計（無制限）<br>- 実施期間: 2026年1月6日〜3月27日（12週間）<br>- 開発工数: 52人日、開発費: ¥2,080,000<br>- Phase 11-13: 満足度調査（API-13）、研修管理（API-14）、タレントマネジメント（API-15）は将来実装<br>- 運用コスト追加: ¥0/月（既存インフラ内で対応）<br>- Response_HRAnnouncements_Integration_20251009.md作成（文書番号: MS-RESPONSE-HRANNOUNCEMENTS-2025-1009-001）<br>- HRAnnouncements関連ドキュメント3件追加 |
| **2025-10-10** | **2.13** | **医療システムチーム** | **🆕 Phase 11追加: InterviewStation（面談ステーション）統合実装**<br>- InterviewStation DB要件分析完了<br>- 即時予約 + おまかせ予約（AI調整）の2種類実装<br>- NotebookLM API（Llama 3.2:3b）を活用したAI調整・サマリ生成<br>- 医療システム側の新規テーブル: 1件（Interviewer、CRITICAL）<br>- 医療システム側の新規API: 9件（API-INT-1～INT-7、API-INT-8～9はPhase 11.5）<br>- 医療システム側の新規Webhook: 3件（Webhook-INT-1面談予約確定、INT-2サマリ配信、INT-3進捗通知）<br>- VoiceDrive側のDB拡張: 4件（Interview拡張、AssistedBookingRequest新規、InterviewResult拡張、InterviewReminder新規）<br>- リアルタイム通知: Server-Sent Events (SSE)を採用（WebSocketではなく）<br>- NotificationService新規実装<br>- AI調整所要時間: 30秒～1分（3つの提案パターン生成）<br>- `staffFriendlyDisplay`（職員向け説明文）をLLM APIで自動生成<br>- 面談サマリ: 半自動（面談記録入力後、手動トリガーでAI分析、Webhook送信は自動）<br>- `feedbackToEmployee`（職員向けフィードバック）をLLM APIで自動生成<br>- 実施期間: Phase 11（11月18日〜26日、9日間） + Phase 11.5（12月2日〜10日、9日間）<br>- 開発工数: Phase 11（43人日）+ Phase 11.5（8人日） = 51人日<br>- 開発費: Phase 11（¥1,240,000）+ Phase 11.5（¥120,000） = ¥1,360,000<br>- 元の見積もり¥2,080,000から¥720,000削減<br>- 運用コスト追加: ¥0/月（既存インフラ内で対応）<br>- Response_InterviewStation_Integration_20251009.md作成（文書番号: MS-RESPONSE-INTERVIEWSTATION-2025-1009-001）<br>- InterviewStation関連ドキュメント3件追加 |

| **2025-10-10** | **2.14** | **医療システムチーム** | **🆕 Phase 12追加: 投稿追跡（Post Tracking）統合実装**<br>- 投稿追跡 DB要件分析完了<br>- **医療システム側の負担を大幅削減（¥540,000削減）**<br>- API-PT-M-1（職員情報API）: 既存PersonalStation API-2を拡張（¥60,000 vs 元見積もり¥160,000）<br>- API-PT-M-2（部署メンバーAPI）: 既存DepartmentStation API-3を流用（¥80,000 vs 元見積もり¥240,000）<br>- Webhook-PT-M-1（組織変更通知）: 半自動（¥200,000 vs 元見積もり¥400,000）<br>- アバター画像実装はPhase 12に分離（Nice to have）<br>- アクティブメンバー判定はVoiceDrive側で実装（医療システムにアクティビティデータなし）<br>- 実施期間: Phase 1（11/11-11/15、5日間）+ Phase 3（12/2-12/13、12日間）+ Phase 12（12/16-12/18、3日間）<br>- 開発工数: 10.5人日、開発費: ¥420,000（元見積もり¥960,000から¥540,000削減、56%削減）<br>- 運用コスト追加: ¥0/月（既存インフラ内で対応）<br>- Response_PostTracking_Integration_20251009.md作成（文書番号: MS-RESPONSE-POSTTRACKING-2025-1009-001）<br>- 投稿追跡関連ドキュメント2件追加 |
| **2025-10-10** | **2.15** | **医療システムチーム** | **🆕 Phase 13追加: 投稿管理（Post Management）統合実装**<br>- 投稿管理 DB要件分析完了<br>- **医療システム側の負担を大幅削減（¥600,000削減、75%削減）**<br>- 6段階議題レベル管理（PENDING → DEPT_REVIEW → DEPT_AGENDA → FACILITY_AGENDA → CORP_REVIEW → CORP_AGENDA）<br>- Level 5-13の権限別責任者管理<br>- Level 7+による議題提案書作成 → Level 8+承認 → 委員会提出ワークフロー<br>- **シナリオB採用: 委員会管理システム不在**<br>- **ハイブリッド委員会管理採用**: マスター選択 + フリー入力<br>- 小原病院の40以上の委員会を初期登録<br>- API-PM-M-1 → API-PT-M-1拡張で対応（¥160,000削減）<br>- API-PM-M-2 → 簡易版実装（¥120,000削減）<br>- WH-PM-M-1 → 実装不要（¥400,000削減）<br>- 実施期間: Phase 1（10/11-10/25）+ Phase 2（10/28-11/8）+ Phase 3（11/11-11/15）<br>- 開発工数: 5人日（医療システム）+ 35人日（VoiceDrive）<br>- 開発費: ¥200,000（元見積もり¥800,000から¥600,000削減、75%削減）<br>- 運用コスト追加: ¥0/月（既存インフラ内で対応）<br>- VoiceDrive側DB拡張: Committee、SubmissionRequest、ProposalDocument、ResponsibilityAction、PostManagementTimeline追加<br>- Response_PostManagement_Integration_20251010.md作成（文書番号: MS-RESPONSE-POSTMANAGEMENT-2025-1010-001）<br>- Final_Confirmation_PostManagement_Integration_20251010.md作成（文書番号: FINAL-CONFIRMATION-POSTMANAGEMENT-2025-1010-001）<br>- 投稿管理関連ドキュメント4件追加 |
| **2025-10-10** | **2.16** | **医療システムチーム** | **🆕 Phase 14追加: 健康ステーション（HealthStation）統合実装**<br>- 健康ステーション DB要件分析完了<br>- **医療システム側の開発が完全に不要（¥0）**<br>- **ファイルベース連携採用**: JSONファイル配置のみ（API開発・Webhook実装不要）<br>- 4種類の通知タイプ（health_risk_assessment、health_checkup_result、stress_check_result、reexamination_required）<br>- ファイル監視（5秒ポーリング）: `mcp-shared/notifications/` フォルダを自動監視<br>- 優先度判定: リスクレベル（very-high/high/medium/low）から自動判定<br>- 健康ダッシュボード: 総合健康スコア、リスクレベル、推奨アクション表示<br>- 通知管理: 未読/既読管理、優先度別フィルタリング<br>- 健康レポート: 個人・部署・組織レベルのレポート生成<br>- プライバシー保護: アクセス制御（本人・産業医・人事部のみ）、監査ログ、データ暗号化<br>- データ保存期間: 5年（医療システムと統一、労働安全衛生法準拠）<br>- 実施期間: Phase 1（11/18-11/22）+ Phase 2（11/25-11/29）+ Phase 3（12/2-12/6）<br>- 開発工数: 0人日（医療システム）+ 21人日（VoiceDrive）<br>- 開発費: ¥0（ファイルベース連携のため医療システム側開発不要）<br>- 運用コスト追加: ¥0/月（既存インフラ内で対応）<br>- VoiceDrive側DB拡張: HealthNotification、HealthNotificationProcessLog、HealthNotificationReadStatus、HealthReport追加<br>- Response_HealthStation_Integration_20251010.md作成（文書番号: MS-RESPONSE-HEALTHSTATION-2025-1010-001）<br>- 健康ステーション関連ドキュメント3件追加<br>- Phase 4（将来実装）: Webhook移行（¥560,000）、再検査フォロー通知（¥160,000） |
| **2025-10-10** | **2.17** | **医療システムチーム** | **🆕 Phase 14.0追加: 健康ステーション準備フェーズ（Phase 14.0）実施**<br>- **ゼロリスク戦略採用**: 共通DB構築前に検証のみ実施<br>- **Phase 14.0（準備フェーズ）**: JSONサンプルファイル作成・ファイル検知テストのみ（DB操作なし）<br>- **Phase 14.1-3（本実装）**: テーブル作成・通知処理・UI実装（共通DB構築後）<br>- JSONサンプルファイル4件作成完了 ✅<br>  - health_notif_OH-NS-2024-001_20251010100000.json（health_risk_assessment、medium）<br>  - health_notif_OH-NS-2024-002_20251010100100.json（health_checkup_result、low）<br>  - health_notif_OH-NS-2024-003_20251010100200.json（stress_check_result、high）<br>  - health_notif_OH-NS-2024-004_20251010100300.json（reexamination_required、urgent）<br>- Phase14.0_Implementation_Guide_20251010.md作成完了 ✅<br>- 実施期間: Phase 14.0（10/10-10/11、2日間）<br>- 医療システム工数: 0.5日 ✅ 完了<br>- VoiceDrive工数: 0.5日（ファイル検知テスト、待機中）<br>- Phase 14.0のコスト: ¥0（既存環境での検証のみ）<br>- マスタープラン Version 2.17更新: Phase 14にPhase 14.0セクション追加、実装戦略明記 |
| **2025-10-10** | **2.18** | **医療システムチーム + VoiceDriveチーム** | **✅ Phase 14.0完了: 健康ステーション準備フェーズ完全成功**<br>- **VoiceDriveチームからテスト完了報告受領**（文書番号: VD-PHASE14-0-TEST-RESULT-2025-1010-001）<br>- **全成功条件クリア**: ファイル配置（4/4）、ファイル検知（4/4）、JSON解析（4/4）、優先度判定（4/4）、エラー（0件）<br>- **ファイルベース連携動作確認完了**: 5秒ポーリングで確実に検知<br>- **JSON形式検証完了**: 全必須フィールド存在、データ型正常、日本語文字列正常<br>- **優先度判定動作確認**: low/medium/high/urgent全て正常<br>- **アクション実行確認**: 各優先度に応じた適切なアクション実行<br>- **処理時間計測**: 平均約5秒（ポーリング待機含む）<br>- **リソース使用状況**: CPU・メモリ・ディスクI/O全て正常<br>- VoiceDrive工数: 0.5日 ✅ 完了<br>- **Phase 14.0総合評価**: 🟢 完璧（実施時期・作業品質・動作確認全て優秀）<br>- **VoiceDriveチームからのフィードバック**: JSONサンプルファイル品質・通知データ設計・ドキュメント品質全て高評価<br>- Phase14.0_Test_Result_Report_20251010.md作成完了 ✅<br>- マスタープラン Version 2.18更新: Phase 14.0完了報告反映<br>- **次のステップ**: Phase 14.1-3は共通DB（MySQL）構築完了後に実施予定（12月上旬〜下旬） |
| **2025-10-10** | **2.19** | **医療システムチーム + VoiceDriveチーム** | **🆕 Phase 15追加: 委員会管理（Committee Management）統合実装**<br>- **VoiceDriveチームから実装方針変更提案受領**（文書番号: VD-RESPONSE-COMMITTEE-2025-1010-001）<br>- **医療チームからの3つの確認事項に全て回答** ✅<br>  - 確認-1: API-CM-1レスポンスフィールド → 5フィールドで十分<br>  - 確認-2: 初期データ提供形式 → JSON形式で問題なし<br>  - 確認-3: 部署マスタ更新通知 → 将来実装でOK（24時間キャッシュで当面対応）<br>- **実装方針変更: MySQL移行と統合DB構築に変更**<br>  - 変更前: VoiceDrive単独でSQLiteにDB構築（3日）→ MySQL移行時に再構築（二度手間）<br>  - 変更後: Phase 1.6と統合、医療146テーブル + VoiceDrive 5テーブル = 統合実装<br>- **VoiceDrive schema.prisma準備完了** ✅（946行、委員会管理5テーブル）<br>  - ManagementCommitteeAgenda（議題）<br>  - CommitteeInfo（委員会基本情報）<br>  - CommitteeMember（委員会メンバー）<br>  - CommitteeMeeting（会議スケジュール）<br>  - CommitteeSubmissionRequest（提出承認リクエスト）<br>- **医療システム側API実装**:<br>  - API-CM-1（職員情報一括取得バッチ）🆕: ¥120,000<br>  - API-2（職員情報単体）: ¥0（PersonalStation API-2流用）<br>  - API-8（部署マスタ）: ¥0（DepartmentStation API-3流用）<br>  - 初期データJSON提供（8委員会、60名以上）: ¥120,000<br>- **コスト削減**: 元見積もり¥420,000 → 実際¥240,000（¥180,000削減、43%削減）<br>- **実施スケジュール**:<br>  - Phase 0（準備）: ✅ 完了（schema.prisma更新、DB要件分析、暫定マスターリスト作成）<br>  - Phase 1（MySQL移行＋統合DB構築）: Phase 1.6と同時実施（2時間、両チーム協働）<br>  - Phase 2（API連携）: DB構築後（2日間）<br>  - Phase 3（UI統合）: API連携後（1日間）<br>- **VoiceDriveチームからの依頼事項**（4件）:<br>  1. マスタープランに委員会5テーブル追加（「30. 委員会管理セクション」新設）<br>  2. MySQL移行＋DB構築のタイミング共有<br>  - 3. API-CM-1実装（DB構築後）<br>  4. 初期データJSON提供（DB構築後）<br>- Response_CommitteeManagement_Integration_20251010.md作成（文書番号: MS-RESPONSE-COMMITTEE-2025-1010-001）<br>- VoiceDrive_Response_CommitteeManagement_20251010.md受領（文書番号: VD-RESPONSE-COMMITTEE-2025-1010-001）<br>- 委員会管理関連ドキュメント4件追加<br>- マスタープラン Version 2.19更新: Phase 15追加、統合DB構築戦略反映 |
| **2025-10-10** | **2.20** | **医療システムチーム** | **🆕 Phase 16追加: 施設ガバナンス（Facility Governance）統合実装**<br>- **VoiceDriveチームからDB要件分析受領**（文書番号: FG-DB-REQ-2025-1009-001）<br>- **医療チームからの3つの質問に全て回答** ✅<br>  - 質問-1: 方針・規則の初期データ提供 → VoiceDrive側で作成、医療側はemployeeIdリスト提供<br>  - 質問-2: コンプライアンスチェック実施主体 → VoiceDrive側でチェックリスト機能実装<br>  - 質問-3: リスク管理の連携範囲 → VoiceDrive独自実装、インシデント連携は将来実装<br>- **実装方針: Phase 15（委員会管理）と同様にPhase 1.6統合実装推奨**<br>  - 変更前: VoiceDrive単独でSQLiteにDB構築（2日）→ MySQL移行時に再構築（二度手間）<br>  - 変更後: Phase 1.6と統合、医療146テーブル + 委員会5テーブル + 施設ガバナンス4テーブル = 155テーブル統合実装<br>- **VoiceDrive schema.prisma準備完了** ✅（施設ガバナンス4テーブル）<br>  - FacilityPolicy（方針・規則、8件初期データ）<br>  - ComplianceCheck（コンプライアンスチェック、5件初期データ）<br>  - FacilityRisk（リスク管理、5件初期データ）<br>  - TransparencyReport（透明性レポート）※将来実装<br>- **医療システム側API実装**:<br>  - API-FG-1（職員情報一括取得バッチ）🆕: ¥120,000<br>  - API-2（職員情報単体）: ¥0（PersonalStation API-2流用）<br>  - API-8（部署マスタ）: ¥0（DepartmentStation API-3流用）<br>  - permissionLevel 10+職員リスト提供（JSON）: ¥0（医療チーム作業1時間）<br>- **コスト削減**: 元見積もり¥360,000 → 実際¥120,000（¥240,000削減、67%削減）<br>- **実施スケジュール**:<br>  - Phase 0（準備）: schema.prisma準備（VoiceDrive）<br>  - Phase 1（MySQL移行＋統合DB構築）: Phase 1.6と同時実施（医療チーム主導、両チーム協働）<br>  - Phase 2（API連携）: DB構築後（2日間）<br>  - Phase 3（UI統合）: API連携後（1日間）<br>- **統合実装のメリット**:<br>  - 個別実装: 20日 → 統合実装: 11日（9日削減、45%削減）<br>  - 金額: ¥6,400,000 → ¥3,520,000（¥2,880,000削減、45%削減）<br>- **施設ガバナンス機能**:<br>  - 方針・規則管理（個人情報保護方針、労働安全衛生規則等8件）<br>  - コンプライアンスチェック（医療安全管理、個人情報保護等5件）<br>  - リスク管理（夜勤シフト人員不足、情報セキュリティインシデント等5件）<br>  - 透明性レポート（監査ログ、意思決定履歴）※将来実装<br>- **データ管理責任分界**:<br>  - 医療システム: 職員情報（employeeId、name、department、position、permissionLevel）<br>  - VoiceDrive: 方針・規則データ、コンプライアンスチェックデータ、リスクデータ<br>- Response_FacilityGovernance_Integration_20251010.md作成（文書番号: MED-RESPONSE-FG-2025-1010-001）<br>- 施設ガバナンス関連ドキュメント2件追加<br>- マスタープラン Version 2.20更新: Phase 16追加、Phase 1.6統合DB構築戦略に施設ガバナンスも追加（155テーブル） |

---

**文書終了**

*本マスタープランは両チームの合意のもと、適宜更新される予定です。*
