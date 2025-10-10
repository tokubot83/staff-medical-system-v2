# 医療職員管理システム サイトマップ

**生成日**: 2025年10月7日
**総ページ数**: 365ページ

---

## 目次

1. [ホーム・ダッシュボード](#ホームダッシュボード)
2. [管理者機能](#管理者機能)
3. [評価システム](#評価システム)
4. [面談システム](#面談システム)
5. [レポート・分析](#レポート分析)
6. [人事戦略](#人事戦略)
7. [健康管理](#健康管理)
8. [職員カード](#職員カード)
9. [マイページ](#マイページ)
10. [その他](#その他)

---

## ホーム・ダッシュボード

| URL | 説明 |
|-----|------|
| `/` | トップページ（アクションセンター） |
| `/dashboard` | メインダッシュボード |
| `/dashboard/admin` | 管理者ダッシュボード |
| `/dashboard/personal` | 個人ダッシュボード |

---

## 管理者機能

### 管理者メニュー

| URL | 説明 |
|-----|------|
| `/admin` | 管理者トップ |
| `/admin/access-control` | アクセス制御 |
| `/admin/ai-settings` | AI設定 |
| `/admin/audit-log` | 監査ログ |
| `/admin/backup` | バックアップ管理 |
| `/admin/career-courses` | キャリアコース管理 |
| `/admin/compliance-master` | コンプライアンスマスター |
| `/admin/database` | データベース管理 |
| `/admin/deployment` | デプロイメント |
| `/admin/developer-audit` | 開発者監査 |
| `/admin/dev-notes` | 開発者ノート |
| `/admin/documents` | ドキュメント管理 |
| `/admin/image-management` | 画像管理 |
| `/admin/integration` | 統合管理 |
| `/admin/integration-hub` | 統合ハブ |
| `/admin/interview-bank` | 面談バンク |
| `/admin/master-data` | マスターデータ |
| `/admin/mcp-server` | MCPサーバー管理 |
| `/admin/mcp-shared` | MCP共有ファイル |
| `/admin/notifications` | 通知管理 |
| `/admin/recruitment-master` | 採用マスター |
| `/admin/scheduler` | スケジューラー |

---

## 評価システム

### 評価設計

| URL | 説明 |
|-----|------|
| `/evaluation-design` | 評価設計トップ |
| `/evaluation-design/contribution` | 貢献度評価設計 |
| `/evaluation-design/facility/[name]` | 施設別評価設計 |
| `/evaluation-design/nursing` | 看護評価設計 |
| `/evaluation-design/questions` | 質問設計 |
| `/evaluation-design/simulation` | シミュレーション |
| `/evaluation-design/technical/corporate` | 法人技術評価 |
| `/evaluation-design/technical/facility` | 施設技術評価 |
| `/evaluation-design/templates` | テンプレート |
| `/evaluation-design/timeline` | タイムライン |
| `/evaluation-design/wizard` | ウィザード |

### 評価実行

| URL | 説明 |
|-----|------|
| `/evaluation-execution` | 評価実行トップ |
| `/evaluation-execution/new` | 新規評価 |
| `/evaluation-execution/enhanced` | 拡張評価 |
| `/evaluation-execution/urgent` | 緊急評価 |
| `/evaluation-execution/dynamic/[id]` | 動的評価（ID指定） |
| `/evaluation-execution/dynamic/[id]/[staffId]` | 動的評価（職員別） |
| `/evaluation-execution/input/[id]` | 評価入力 |

### 評価シート

#### 評価シート - トップ

| URL | 説明 |
|-----|------|
| `/evaluation-sheets` | 評価シートトップ |
| `/evaluation-sheets/v4` | v4評価シート |
| `/evaluation-sheets/[facilityType]/[jobType]/[experienceCategory]` | 動的評価シート |

#### 評価シート - 急性期看護師

| URL | 説明 |
|-----|------|
| `/evaluation-sheets/v4/acute-nurse` | 急性期看護師トップ |
| `/evaluation-sheets/v4/acute-nurse/new-nurse-evaluation-v4-pattern5` | 新人看護師 |
| `/evaluation-sheets/v4/acute-nurse/junior-nurse-evaluation-v4-pattern5` | 初級看護師 |
| `/evaluation-sheets/v4/acute-nurse/midlevel-nurse-evaluation-v4-pattern5` | 中堅看護師 |
| `/evaluation-sheets/v4/acute-nurse/veteran-nurse-evaluation-v4-pattern5` | ベテラン看護師 |
| `/evaluation-sheets/v4/acute-nurse/ward-chief-evaluation-v4-pattern5` | 病棟主任 |
| `/evaluation-sheets/v4/acute-nurse/ward-manager-evaluation-v4-pattern5` | 病棟師長 |

#### 評価シート - 急性期准看護師

| URL | 説明 |
|-----|------|
| `/evaluation-sheets/v4/acute-assistant-nurse/new-assistant-nurse-evaluation-v4-pattern5` | 新人准看護師 |
| `/evaluation-sheets/v4/acute-assistant-nurse/junior-assistant-nurse-evaluation-v4-pattern5` | 初級准看護師 |
| `/evaluation-sheets/v4/acute-assistant-nurse/midlevel-assistant-nurse-evaluation-v4-pattern5` | 中堅准看護師 |
| `/evaluation-sheets/v4/acute-assistant-nurse/veteran-assistant-nurse-evaluation-v4-pattern5` | ベテラン准看護師 |

#### 評価シート - 急性期看護補助者

| URL | 説明 |
|-----|------|
| `/evaluation-sheets/v4/acute-nursing-aide` | 急性期看護補助者トップ |
| `/evaluation-sheets/v4/acute-nursing-aide/new-nursing-aide-evaluation-v4-pattern5` | 新人看護補助者 |
| `/evaluation-sheets/v4/acute-nursing-aide/junior-nursing-aide-evaluation-v4-pattern5` | 初級看護補助者 |
| `/evaluation-sheets/v4/acute-nursing-aide/midlevel-nursing-aide-evaluation-v4-pattern5` | 中堅看護補助者 |
| `/evaluation-sheets/v4/acute-nursing-aide/veteran-nursing-aide-evaluation-v4-pattern5` | ベテラン看護補助者 |
| `/evaluation-sheets/v4/acute-nursing-aide/leader-nursing-aide-evaluation-v4-pattern5` | リーダー看護補助者 |

#### 評価シート - 慢性期看護師

| URL | 説明 |
|-----|------|
| `/evaluation-sheets/v4/chronic-nurse/chronic-new-nurse-evaluation-v4-pattern5` | 慢性期新人看護師 |
| `/evaluation-sheets/v4/chronic-nurse/chronic-junior-nurse-evaluation-v4-pattern5` | 慢性期初級看護師 |
| `/evaluation-sheets/v4/chronic-nurse/chronic-midlevel-nurse-evaluation-v4-pattern5` | 慢性期中堅看護師 |
| `/evaluation-sheets/v4/chronic-nurse/chronic-veteran-nurse-evaluation-v4-pattern5` | 慢性期ベテラン看護師 |
| `/evaluation-sheets/v4/chronic-nurse/chronic-chief-nurse-evaluation-v4-pattern5` | 慢性期主任 |
| `/evaluation-sheets/v4/chronic-nurse/chronic-ward-manager-evaluation-v4-pattern5` | 慢性期師長 |

#### 評価シート - 慢性期准看護師

| URL | 説明 |
|-----|------|
| `/evaluation-sheets/v4/chronic-assistant-nurse/chronic-new-assistant-nurse-evaluation-v4-pattern5` | 慢性期新人准看護師 |
| `/evaluation-sheets/v4/chronic-assistant-nurse/chronic-junior-assistant-nurse-evaluation-v4-pattern5` | 慢性期初級准看護師 |
| `/evaluation-sheets/v4/chronic-assistant-nurse/chronic-midlevel-assistant-nurse-evaluation-v4-pattern5` | 慢性期中堅准看護師 |
| `/evaluation-sheets/v4/chronic-assistant-nurse/chronic-veteran-assistant-nurse-evaluation-v4-pattern5` | 慢性期ベテラン准看護師 |

#### 評価シート - 慢性期看護補助者

| URL | 説明 |
|-----|------|
| `/evaluation-sheets/v4/chronic-nursing-aide/new` | 慢性期新人看護補助者 |
| `/evaluation-sheets/v4/chronic-nursing-aide/junior` | 慢性期初級看護補助者 |
| `/evaluation-sheets/v4/chronic-nursing-aide/midlevel` | 慢性期中堅看護補助者 |
| `/evaluation-sheets/v4/chronic-nursing-aide/veteran` | 慢性期ベテラン看護補助者 |
| `/evaluation-sheets/v4/chronic-nursing-aide/leader` | 慢性期リーダー看護補助者 |
| `/evaluation-sheets/v4/chronic-nursing-aide/chronic-new-nursing-aide-evaluation-v4-pattern5` | 慢性期新人看護補助者（パターン5） |

#### 評価シート - 外来

| URL | 説明 |
|-----|------|
| `/evaluation-sheets/v4/outpatient-nurse/new-outpatient-nurse-evaluation-v4-pattern5` | 外来新人看護師 |
| `/evaluation-sheets/v4/outpatient-nurse/junior-outpatient-nurse-evaluation-v4-pattern5` | 外来初級看護師 |
| `/evaluation-sheets/v4/outpatient-nurse/midlevel-outpatient-nurse-evaluation-v4-pattern5` | 外来中堅看護師 |
| `/evaluation-sheets/v4/outpatient-nurse/veteran-outpatient-nurse-evaluation-v4-pattern5` | 外来ベテラン看護師 |
| `/evaluation-sheets/v4/outpatient-assistant-nurse/[slug]` | 外来准看護師（動的） |
| `/evaluation-sheets/v4/outpatient-chief` | 外来主任 |
| `/evaluation-sheets/v4/outpatient-manager` | 外来師長 |

#### 評価シート - 理学療法士（PT）

| URL | 説明 |
|-----|------|
| `/evaluation-sheets/v4/acute-pt/new-pt-evaluation-v4-pattern5` | 急性期新人PT |
| `/evaluation-sheets/v4/acute-pt/junior-pt-evaluation-v4-pattern5` | 急性期初級PT |
| `/evaluation-sheets/v4/acute-pt/midlevel-pt-evaluation-v4-pattern5` | 急性期中堅PT |
| `/evaluation-sheets/v4/acute-pt/veteran-pt-evaluation-v4-pattern5` | 急性期ベテランPT |
| `/evaluation-sheets/v4/acute-pt/chief-pt-evaluation-v4-pattern5` | 急性期主任PT |
| `/evaluation-sheets/v4/chronic-pt/new-pt-evaluation-v4-pattern5` | 慢性期新人PT |
| `/evaluation-sheets/v4/chronic-pt/junior-pt-evaluation-v4-pattern5` | 慢性期初級PT |
| `/evaluation-sheets/v4/chronic-pt/midlevel-pt-evaluation-v4-pattern5` | 慢性期中堅PT |
| `/evaluation-sheets/v4/chronic-pt/veteran-pt-evaluation-v4-pattern5` | 慢性期ベテランPT |
| `/evaluation-sheets/v4/chronic-pt/chief-pt-evaluation-v4-pattern5` | 慢性期主任PT |
| `/evaluation-sheets/v4/roken-pt/new-pt-evaluation-v4-pattern5` | 老健新人PT |
| `/evaluation-sheets/v4/roken-pt/junior-pt-evaluation-v4-pattern5` | 老健初級PT |
| `/evaluation-sheets/v4/roken-pt/midlevel-pt-evaluation-v4-pattern5` | 老健中堅PT |
| `/evaluation-sheets/v4/roken-pt/veteran-pt-evaluation-v4-pattern5` | 老健ベテランPT |
| `/evaluation-sheets/v4/roken-pt/chief-pt-evaluation-v4-pattern5` | 老健主任PT |

#### 評価シート - 作業療法士（OT）

| URL | 説明 |
|-----|------|
| `/evaluation-sheets/v4/acute-ot/new-ot-evaluation-v4-pattern5` | 急性期新人OT |
| `/evaluation-sheets/v4/acute-ot/junior-ot-evaluation-v4-pattern5` | 急性期初級OT |
| `/evaluation-sheets/v4/acute-ot/midlevel-ot-evaluation-v4-pattern5` | 急性期中堅OT |
| `/evaluation-sheets/v4/acute-ot/veteran-ot-evaluation-v4-pattern5` | 急性期ベテランOT |
| `/evaluation-sheets/v4/acute-ot/chief-ot-evaluation-v4-pattern5` | 急性期主任OT |
| `/evaluation-sheets/v4/chronic-ot/new-ot-evaluation-v4-pattern5` | 慢性期新人OT |
| `/evaluation-sheets/v4/chronic-ot/junior-ot-evaluation-v4-pattern5` | 慢性期初級OT |
| `/evaluation-sheets/v4/chronic-ot/midlevel-ot-evaluation-v4-pattern5` | 慢性期中堅OT |
| `/evaluation-sheets/v4/chronic-ot/veteran-ot-evaluation-v4-pattern5` | 慢性期ベテランOT |
| `/evaluation-sheets/v4/chronic-ot/chief-ot-evaluation-v4-pattern5` | 慢性期主任OT |
| `/evaluation-sheets/v4/roken-ot/new-ot-evaluation-v4-pattern5` | 老健新人OT |
| `/evaluation-sheets/v4/roken-ot/junior-ot-evaluation-v4-pattern5` | 老健初級OT |
| `/evaluation-sheets/v4/roken-ot/midlevel-ot-evaluation-v4-pattern5` | 老健中堅OT |
| `/evaluation-sheets/v4/roken-ot/veteran-ot-evaluation-v4-pattern5` | 老健ベテランOT |
| `/evaluation-sheets/v4/roken-ot/chief-ot-evaluation-v4-pattern5` | 老健主任OT |

#### 評価シート - 言語聴覚士（ST）

| URL | 説明 |
|-----|------|
| `/evaluation-sheets/v4/acute-st/new-st-evaluation-v4-pattern5` | 急性期新人ST |
| `/evaluation-sheets/v4/acute-st/junior-st-evaluation-v4-pattern5` | 急性期初級ST |
| `/evaluation-sheets/v4/acute-st/midlevel-st-evaluation-v4-pattern5` | 急性期中堅ST |
| `/evaluation-sheets/v4/acute-st/veteran-st-evaluation-v4-pattern5` | 急性期ベテランST |
| `/evaluation-sheets/v4/acute-st/chief-st-evaluation-v4-pattern5` | 急性期主任ST |
| `/evaluation-sheets/v4/chronic-st/new-st-evaluation-v4-pattern5` | 慢性期新人ST |
| `/evaluation-sheets/v4/chronic-st/junior-st-evaluation-v4-pattern5` | 慢性期初級ST |
| `/evaluation-sheets/v4/chronic-st/veteran-st-evaluation-v4-pattern5` | 慢性期ベテランST |
| `/evaluation-sheets/v4/chronic-st/chief-st-evaluation-v4-pattern5` | 慢性期主任ST |
| `/evaluation-sheets/v4/roken-st/new-st-evaluation-v4-pattern5` | 老健新人ST |
| `/evaluation-sheets/v4/roken-st/junior-st-evaluation-v4-pattern5` | 老健初級ST |
| `/evaluation-sheets/v4/roken-st/midlevel-st-evaluation-v4-pattern5` | 老健中堅ST |
| `/evaluation-sheets/v4/roken-st/veteran-st-evaluation-v4-pattern5` | 老健ベテランST |
| `/evaluation-sheets/v4/roken-st/chief-st-evaluation-v4-pattern5` | 老健主任ST |

#### 評価シート - 老健（介護職）

| URL | 説明 |
|-----|------|
| `/evaluation-sheets/v4/roken-nurse/new-nurse-evaluation-v4-pattern5` | 老健新人看護師 |
| `/evaluation-sheets/v4/roken-nurse/junior-nurse-evaluation-v4-pattern5` | 老健初級看護師 |
| `/evaluation-sheets/v4/roken-nurse/midlevel-nurse-evaluation-v4-pattern5` | 老健中堅看護師 |
| `/evaluation-sheets/v4/roken-nurse/veteran-nurse-evaluation-v4-pattern5` | 老健ベテラン看護師 |
| `/evaluation-sheets/v4/roken-assistant-nurse/new-assistant-nurse-evaluation-v4-pattern5` | 老健新人准看護師 |
| `/evaluation-sheets/v4/roken-assistant-nurse/junior-assistant-nurse-evaluation-v4-pattern5` | 老健初級准看護師 |
| `/evaluation-sheets/v4/roken-assistant-nurse/midlevel-assistant-nurse-evaluation-v4-pattern5` | 老健中堅准看護師 |
| `/evaluation-sheets/v4/roken-assistant-nurse/veteran-assistant-nurse-evaluation-v4-pattern5` | 老健ベテラン准看護師 |
| `/evaluation-sheets/v4/roken-care-worker/new-care-worker-evaluation-v4-pattern5` | 老健新人介護職 |
| `/evaluation-sheets/v4/roken-care-worker/junior-care-worker-evaluation-v4-pattern5` | 老健初級介護職 |
| `/evaluation-sheets/v4/roken-care-worker/midlevel-care-worker-evaluation-v4-pattern5` | 老健中堅介護職 |
| `/evaluation-sheets/v4/roken-care-worker/veteran-care-worker-evaluation-v4-pattern5` | 老健ベテラン介護職 |
| `/evaluation-sheets/v4/roken-certified-care-worker/new-certified-care-worker-evaluation-v4-pattern5` | 老健新人介護福祉士 |
| `/evaluation-sheets/v4/roken-certified-care-worker/junior-certified-care-worker-evaluation-v4-pattern5` | 老健初級介護福祉士 |
| `/evaluation-sheets/v4/roken-certified-care-worker/midlevel-certified-care-worker-evaluation-v4-pattern5` | 老健中堅介護福祉士 |
| `/evaluation-sheets/v4/roken-certified-care-worker/veteran-certified-care-worker-evaluation-v4-pattern5` | 老健ベテラン介護福祉士 |
| `/evaluation-sheets/v4/roken-certified-care-worker/leader-certified-care-worker-evaluation-v4-pattern5` | 老健リーダー介護福祉士 |

### 評価レビュー・相対評価

| URL | 説明 |
|-----|------|
| `/evaluation-review` | 評価レビュー |
| `/evaluation-relative-grading` | 相対評価 |

---

## 面談システム

### 面談シート - トップ

| URL | 説明 |
|-----|------|
| `/interview-sheets/[experienceCategory]/[duration]` | 動的面談シート |
| `/interview-sheets/v5` | v5面談シートトップ |
| `/interview-sheets-viewer` | 面談シートビューア |

### 面談シート - 看護師

| URL | 説明 |
|-----|------|
| `/interview-sheets/v5/new-nurse-15min` | 新人看護師15分 |
| `/interview-sheets/v5/new-nurse-30min` | 新人看護師30分 |
| `/interview-sheets/v5/new-nurse-45min` | 新人看護師45分 |
| `/interview-sheets/v5/general-nurse-15min` | 一般看護師15分 |
| `/interview-sheets/v5/general-nurse-30min` | 一般看護師30分 |
| `/interview-sheets/v5/general-nurse-45min` | 一般看護師45分 |
| `/interview-sheets/v5/senior-nurse-15min` | 上級看護師15分 |
| `/interview-sheets/v5/senior-nurse-30min` | 上級看護師30分 |
| `/interview-sheets/v5/senior-nurse-45min` | 上級看護師45分 |
| `/interview-sheets/v5/veteran-nurse-15min` | ベテラン看護師15分 |
| `/interview-sheets/v5/veteran-nurse-30min` | ベテラン看護師30分 |
| `/interview-sheets/v5/veteran-nurse-45min` | ベテラン看護師45分 |
| `/interview-sheets/v5/leader-nurse-15min` | リーダー看護師15分 |
| `/interview-sheets/v5/leader-nurse-30min` | リーダー看護師30分 |
| `/interview-sheets/v5/leader-nurse-45min` | リーダー看護師45分 |
| `/interview-sheets/v5/chief-nurse-15min` | 主任看護師15分 |
| `/interview-sheets/v5/chief-nurse-30min` | 主任看護師30分 |
| `/interview-sheets/v5/chief-nurse-45min` | 主任看護師45分 |

### 面談シート - 医療事務

| URL | 説明 |
|-----|------|
| `/interview-sheets/v5/medical-affairs-staff-15min` | 医療事務職員15分 |
| `/interview-sheets/v5/medical-affairs-staff-30min` | 医療事務職員30分 |
| `/interview-sheets/v5/medical-affairs-staff-45min` | 医療事務職員45分 |

### 面談シート - リハビリ（PT）

| URL | 説明 |
|-----|------|
| `/interview-sheets/v5/rehabilitation/pt/new-pt-15min` | 新人PT 15分 |
| `/interview-sheets/v5/rehabilitation/pt/new-pt-30min` | 新人PT 30分 |
| `/interview-sheets/v5/rehabilitation/pt/new-pt-45min` | 新人PT 45分 |
| `/interview-sheets/v5/rehabilitation/pt/general-pt-15min` | 一般PT 15分 |
| `/interview-sheets/v5/rehabilitation/pt/general-pt-30min` | 一般PT 30分 |
| `/interview-sheets/v5/rehabilitation/pt/general-pt-45min` | 一般PT 45分 |
| `/interview-sheets/v5/rehabilitation/pt/midlevel-pt-15min` | 中堅PT 15分 |
| `/interview-sheets/v5/rehabilitation/pt/midlevel-pt-30min` | 中堅PT 30分 |
| `/interview-sheets/v5/rehabilitation/pt/midlevel-pt-45min` | 中堅PT 45分 |
| `/interview-sheets/v5/rehabilitation/pt/veteran-pt-15min` | ベテランPT 15分 |
| `/interview-sheets/v5/rehabilitation/pt/veteran-pt-30min` | ベテランPT 30分 |
| `/interview-sheets/v5/rehabilitation/pt/veteran-pt-45min` | ベテランPT 45分 |
| `/interview-sheets/v5/rehabilitation/pt/chief-pt-15min` | 主任PT 15分 |
| `/interview-sheets/v5/rehabilitation/pt/chief-pt-30min` | 主任PT 30分 |
| `/interview-sheets/v5/rehabilitation/pt/chief-pt-45min` | 主任PT 45分 |

### 面談シート - リハビリ（OT）

| URL | 説明 |
|-----|------|
| `/interview-sheets/v5/rehabilitation/ot/new-ot-15min` | 新人OT 15分 |
| `/interview-sheets/v5/rehabilitation/ot/new-ot-30min` | 新人OT 30分 |
| `/interview-sheets/v5/rehabilitation/ot/new-ot-45min` | 新人OT 45分 |
| `/interview-sheets/v5/rehabilitation/ot/general-ot-15min` | 一般OT 15分 |
| `/interview-sheets/v5/rehabilitation/ot/general-ot-30min` | 一般OT 30分 |
| `/interview-sheets/v5/rehabilitation/ot/general-ot-45min` | 一般OT 45分 |
| `/interview-sheets/v5/rehabilitation/ot/midlevel-ot-15min` | 中堅OT 15分 |
| `/interview-sheets/v5/rehabilitation/ot/midlevel-ot-30min` | 中堅OT 30分 |
| `/interview-sheets/v5/rehabilitation/ot/midlevel-ot-45min` | 中堅OT 45分 |
| `/interview-sheets/v5/rehabilitation/ot/veteran-ot-15min` | ベテランOT 15分 |
| `/interview-sheets/v5/rehabilitation/ot/veteran-ot-30min` | ベテランOT 30分 |
| `/interview-sheets/v5/rehabilitation/ot/veteran-ot-45min` | ベテランOT 45分 |
| `/interview-sheets/v5/rehabilitation/ot/chief-ot-15min` | 主任OT 15分 |
| `/interview-sheets/v5/rehabilitation/ot/chief-ot-30min` | 主任OT 30分 |
| `/interview-sheets/v5/rehabilitation/ot/chief-ot-45min` | 主任OT 45分 |

### 面談シート - リハビリ（ST）

| URL | 説明 |
|-----|------|
| `/interview-sheets/v5/rehabilitation/st/new-st-15min` | 新人ST 15分 |
| `/interview-sheets/v5/rehabilitation/st/new-st-30min` | 新人ST 30分 |
| `/interview-sheets/v5/rehabilitation/st/new-st-45min` | 新人ST 45分 |
| `/interview-sheets/v5/rehabilitation/st/general-st-15min` | 一般ST 15分 |
| `/interview-sheets/v5/rehabilitation/st/general-st-30min` | 一般ST 30分 |
| `/interview-sheets/v5/rehabilitation/st/general-st-45min` | 一般ST 45分 |
| `/interview-sheets/v5/rehabilitation/st/midlevel-st-15min` | 中堅ST 15分 |
| `/interview-sheets/v5/rehabilitation/st/midlevel-st-30min` | 中堅ST 30分 |
| `/interview-sheets/v5/rehabilitation/st/midlevel-st-45min` | 中堅ST 45分 |
| `/interview-sheets/v5/rehabilitation/st/veteran-st-15min` | ベテランST 15分 |
| `/interview-sheets/v5/rehabilitation/st/veteran-st-30min` | ベテランST 30分 |
| `/interview-sheets/v5/rehabilitation/st/veteran-st-45min` | ベテランST 45分 |
| `/interview-sheets/v5/rehabilitation/st/chief-st-15min` | 主任ST 15分 |
| `/interview-sheets/v5/rehabilitation/st/chief-st-30min` | 主任ST 30分 |
| `/interview-sheets/v5/rehabilitation/st/chief-st-45min` | 主任ST 45分 |

### 退職面談シート

| URL | 説明 |
|-----|------|
| `/exit-interview-sheets/probation-staff-15min` | 試用期間職員15分 |
| `/exit-interview-sheets/probation-staff-30min` | 試用期間職員30分 |
| `/exit-interview-sheets/general-staff-30min` | 一般職員30分 |
| `/exit-interview-sheets/general-staff-45min` | 一般職員45分 |
| `/exit-interview-sheets/manager-veteran-45min` | 管理職・ベテラン45分 |
| `/exit-interview-sheets/manager-veteran-60min` | 管理職・ベテラン60分 |

### 面談管理

| URL | 説明 |
|-----|------|
| `/interviews` | 面談管理トップ |
| `/interviews/support/voicedrive` | VoiceDrive連携サポート |
| `/interview-bank` | 面談バンク |
| `/interview-bank/create` | 面談バンク作成 |
| `/interview-phase2` | Phase2面談 |

---

## レポート・分析

### レポート - トップ

| URL | 説明 |
|-----|------|
| `/reports` | レポートトップ |
| `/reports/home` | レポートホーム |
| `/reports/export` | レポートエクスポート |

### 基本指標

| URL | 説明 |
|-----|------|
| `/reports/basic-metrics` | 基本指標トップ |
| `/reports/basic-metrics/basic-statistics` | 基本統計 |
| `/reports/basic-metrics/benchmark` | ベンチマーク |
| `/reports/basic-metrics/compliance` | コンプライアンス |
| `/reports/basic-metrics/cost-analysis` | コスト分析 |
| `/reports/basic-metrics/diversity-inclusion` | 多様性・包摂性 |
| `/reports/basic-metrics/engagement` | エンゲージメント |
| `/reports/basic-metrics/integrated-assessment` | 統合評価 |
| `/reports/basic-metrics/organizational-efficiency` | 組織効率 |
| `/reports/basic-metrics/predictive-analytics` | 予測分析 |
| `/reports/basic-metrics/productivity` | 生産性 |
| `/reports/basic-metrics/real-time-dashboard` | リアルタイムダッシュボード |
| `/reports/basic-metrics/risk-management` | リスク管理 |
| `/reports/basic-metrics/talent-growth` | 人材成長 |
| `/reports/basic-metrics/talent-quality` | 人材品質 |

### 離職分析

| URL | 説明 |
|-----|------|
| `/reports/turnover` | 離職分析トップ |
| `/reports/turnover/benchmark-best-practices` | ベンチマーク・ベストプラクティス |
| `/reports/turnover/correlation-analysis` | 相関分析 |
| `/reports/turnover/cost-impact` | コストインパクト |
| `/reports/turnover/exit-feedback` | 退職フィードバック |
| `/reports/turnover/factor-ranking` | 要因ランキング |
| `/reports/turnover/high-risk-dashboard` | 高リスクダッシュボード |
| `/reports/turnover/improvement-suggestions` | 改善提案 |
| `/reports/turnover/predictive-modeling` | 予測モデリング |
| `/reports/turnover/retention-strategies` | 定着戦略 |
| `/reports/turnover/risk-prediction` | リスク予測 |
| `/reports/turnover/time-series-trend` | 時系列トレンド |
| `/reports/turnover/what-if-simulation` | What-Ifシミュレーション |
| `/reports/turnover-risk` | 離職リスク |

### 定着分析

| URL | 説明 |
|-----|------|
| `/reports/retention` | 定着分析トップ |
| `/reports/retention/cohort-intervention-effect` | コホート介入効果 |
| `/reports/retention/cohort-yearly-tracking` | コホート年次追跡 |
| `/reports/retention/early-turnover-alert` | 早期離職アラート |
| `/reports/retention/early-turnover-pattern` | 早期離職パターン |
| `/reports/retention/factor-mapping` | 要因マッピング |
| `/reports/retention/hazard-cox-regression` | ハザードCox回帰 |
| `/reports/retention/hazard-risk-score` | ハザードリスクスコア |
| `/reports/retention/retention-simulator` | 定着シミュレーター |
| `/reports/retention/segment-generation` | セグメント世代 |
| `/reports/retention/segment-recruitment-type` | セグメント採用タイプ |
| `/reports/retention/survival-curve-department` | 生存曲線（部署別） |
| `/reports/retention/survival-curve-overall` | 生存曲線（全体） |
| `/reports/retention/turnover-contagion` | 離職伝染 |

### コホート分析

| URL | 説明 |
|-----|------|
| `/reports/cohort-analysis` | コホート分析トップ |
| `/reports/cohort-analysis/department-cohort` | 部署コホート |
| `/reports/cohort-analysis/engagement-cohort` | エンゲージメントコホート |
| `/reports/cohort-analysis/entry-year-cohort` | 入職年コホート |
| `/reports/cohort-analysis/generation-analysis` | 世代分析 |
| `/reports/cohort-analysis/intervention-effect` | 介入効果 |
| `/reports/cohort-analysis/learning-cohort` | 学習コホート |
| `/reports/cohort-analysis/life-event-cohort` | ライフイベントコホート |
| `/reports/cohort-analysis/location-cohort` | 拠点コホート |
| `/reports/cohort-analysis/network-cohort` | ネットワークコホート |
| `/reports/cohort-analysis/performance-cohort` | パフォーマンスコホート |
| `/reports/cohort-analysis/wellbeing-cohort` | ウェルビーイングコホート |

### パフォーマンス評価分析

| URL | 説明 |
|-----|------|
| `/reports/performance-evaluation` | パフォーマンス評価トップ |
| `/reports/performance-evaluation/cluster-analysis` | クラスタ分析 |
| `/reports/performance-evaluation/department-comparison` | 部署比較 |
| `/reports/performance-evaluation/evaluation-trend` | 評価トレンド |
| `/reports/performance-evaluation/organization-optimization` | 組織最適化 |
| `/reports/performance-evaluation/performance-matrix` | パフォーマンスマトリックス |
| `/reports/performance-evaluation/performance-prediction` | パフォーマンス予測 |
| `/reports/performance-evaluation/skill-assessment` | スキル評価 |
| `/reports/performance-evaluation/team-analysis` | チーム分析 |

### フロー分析

| URL | 説明 |
|-----|------|
| `/reports/flow-analysis` | フロー分析トップ |
| `/reports/flow-analysis/career-path` | キャリアパス |
| `/reports/flow-analysis/department-flow` | 部署フロー |
| `/reports/flow-analysis/mobility-matrix` | モビリティマトリックス |

### ウェルビーイング分析

| URL | 説明 |
|-----|------|
| `/reports/wellbeing` | ウェルビーイングトップ |
| `/reports/wellbeing/engagement-survey` | エンゲージメント調査 |
| `/reports/wellbeing/intervention-program` | 介入プログラム |
| `/reports/wellbeing/stress-analysis` | ストレス分析 |
| `/reports/wellbeing/wellbeing-index` | ウェルビーイング指数 |
| `/reports/wellbeing/work-life-balance` | ワークライフバランス |

### シミュレーション

| URL | 説明 |
|-----|------|
| `/reports/simulation` | シミュレーショントップ |
| `/reports/simulation/cost-optimization` | コスト最適化 |
| `/reports/simulation/organization-redesign` | 組織再設計 |
| `/reports/simulation/recruitment-planning` | 採用計画 |
| `/reports/simulation/retention-impact` | 定着インパクト |
| `/reports/simulation/scenario-planning` | シナリオプランニング |

### 人材マッピング

| URL | 説明 |
|-----|------|
| `/reports/talent-mapping` | 人材マッピングトップ |
| `/reports/talent-mapping/skill-matrix` | スキルマトリックス |
| `/reports/talent-mapping/succession-planning` | 後継者計画 |
| `/reports/talent-mapping/talent-grid` | タレントグリッド |

### その他のレポート

| URL | 説明 |
|-----|------|
| `/reports/cost-optimization` | コスト最適化 |
| `/reports/department-analysis` | 部署分析 |
| `/reports/hr-strategy` | 人事戦略 |
| `/reports/organization-optimization` | 組織最適化 |
| `/reports/recruitment-effectiveness` | 採用効果 |
| `/reports/skill-qualification` | スキル・資格 |
| `/reports/strategic-analysis` | 戦略分析 |
| `/reports/talent-development` | 人材育成 |
| `/reports/two-axis-evaluation` | 2軸評価 |
| `/reports/voicedrive-analytics` | VoiceDrive分析 |
| `/reports/work-environment` | 職場環境 |
| `/reports/work-life-balance` | ワークライフバランス |

---

## 人事戦略

| URL | 説明 |
|-----|------|
| `/hr-strategy` | 人事戦略トップ |
| `/hr-station` | 人事ステーション |
| `/hr-station/deployment` | 人員配置 |
| `/hr-system-guide` | 人事制度ガイド |
| `/hr-policy` | 人事ポリシー |

---

## 健康管理

| URL | 説明 |
|-----|------|
| `/health/consent-dashboard` | 同意ダッシュボード |
| `/health/management` | 健康管理 |
| `/health/staff/[staffId]` | 職員別健康管理 |
| `/health/stress-check` | ストレスチェック |
| `/hr/stress-check/[staffId]` | 職員別ストレスチェック |
| `/my-stress-check` | マイストレスチェック |
| `/stress-check/test` | ストレスチェックテスト |
| `/stress-check/result` | ストレスチェック結果 |

---

## 職員カード

| URL | 説明 |
|-----|------|
| `/staff-cards` | 職員カードトップ |
| `/staff-cards/[staffId]` | 職員別カード |
| `/staff-cards/management` | 職員カード管理 |

---

## マイページ

| URL | 説明 |
|-----|------|
| `/my-page` | マイページトップ |
| `/my-page/career-course/change-request` | キャリアコース変更申請 |
| `/my-page/career-course/my-requests` | 申請一覧 |

---

## その他

### その他機能

| URL | 説明 |
|-----|------|
| `/annual-integration-summary` | 年次統合サマリー |
| `/attendance-management` | 勤怠管理 |
| `/compliance` | コンプライアンス |
| `/education` | 教育 |
| `/goals` | 目標管理 |
| `/integration-monitor` | 統合モニター |
| `/notifications` | 通知 |
| `/recruitment` | 採用 |
| `/reminders/send` | リマインダー送信 |

### テスト・デモページ

| URL | 説明 |
|-----|------|
| `/test/compare-button-demo` | 比較ボタンデモ |
| `/test/final-demo` | 最終デモ |
| `/test/interview-comparison` | 面談比較 |
| `/test/simple-demo` | シンプルデモ |
| `/test/simple-working` | シンプルワーキング |
| `/test/unified-interview-test` | 統合面談テスト |
| `/test/working-demo` | ワーキングデモ |

### 開発者向け

| URL | 説明 |
|-----|------|
| `/docs/development-notes/evaluation-pattern-designs` | 評価パターン設計ノート |

---

## 動的ルート一覧

以下のルートは動的パラメータを使用します：

| パターン | 説明 | 例 |
|---------|------|-----|
| `/evaluation-sheets/[facilityType]/[jobType]/[experienceCategory]` | 施設・職種・経験別評価シート | `/evaluation-sheets/acute/nurse/new` |
| `/evaluation-design/facility/[name]` | 施設別評価設計 | `/evaluation-design/facility/obara-hospital` |
| `/evaluation-execution/dynamic/[id]` | 動的評価実行 | `/evaluation-execution/dynamic/123` |
| `/evaluation-execution/dynamic/[id]/[staffId]` | 職員別動的評価 | `/evaluation-execution/dynamic/123/NS-001` |
| `/evaluation-execution/input/[id]` | 評価入力 | `/evaluation-execution/input/456` |
| `/evaluation-sheets/v4/outpatient-assistant-nurse/[slug]` | 外来准看護師評価 | `/evaluation-sheets/v4/outpatient-assistant-nurse/new` |
| `/interview-sheets/[experienceCategory]/[duration]` | 経験別・時間別面談シート | `/interview-sheets/new/15min` |
| `/health/staff/[staffId]` | 職員別健康管理 | `/health/staff/NS-001` |
| `/hr/stress-check/[staffId]` | 職員別ストレスチェック | `/hr/stress-check/NS-001` |
| `/staff-cards/[staffId]` | 職員別カード | `/staff-cards/NS-001` |

---

## システム統計

- **総ページ数**: 365ページ
- **管理者ページ**: 22ページ
- **評価関連ページ**: 約180ページ
- **面談関連ページ**: 約80ページ
- **レポート・分析ページ**: 約60ページ
- **動的ルート**: 10パターン

---

## 備考

- このサイトマップはNext.js App Routerの`page.tsx`ファイルから自動生成されています
- `[パラメータ名]`で示されるルートは動的ルートです
- 実際のアクセス権限は役職・権限レベルによって制御されています
- Phase 3実装完了により、施設別権限管理が有効です
