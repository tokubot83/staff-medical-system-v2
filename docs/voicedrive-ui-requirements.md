# VoiceDrive側UI・機能詳細仕様書

**作成日**: 2025年9月16日
**対象**: VoiceDriveシステムUI開発チーム
**提供元**: 医療職員管理システム開発チーム

## 1. UI実装概要

VoiceDriveシステムで実装が必要なUI・機能は以下の4つの主要フェーズに分かれます：

1. **申込フェーズ**: 職員による面談予約申込
2. **提案表示フェーズ**: AI最適化による3パターン提案の表示・選択
3. **調整フェーズ**: 職員による日程・条件調整
4. **確定・完了フェーズ**: 予約確定とステータス管理

## 2. 詳細UI仕様

### 2-1. 申込フェーズUI

#### 面談予約申込フォーム
```html
<!-- 基本情報（自動入力） -->
<div class="staff-info">
  <h3>職員情報</h3>
  <div class="auto-filled">
    <input type="text" value="田中 花子" readonly>
    <input type="text" value="内科" readonly>
    <input type="text" value="看護師" readonly>
    <span class="experience">経験年数: 3年</span>
  </div>
</div>

<!-- 面談種別選択 -->
<div class="interview-type">
  <h3>相談内容</h3>
  <select name="type" required>
    <option value="support">サポート面談</option>
    <option value="regular">定期面談</option>
    <option value="special">特別面談</option>
  </select>

  <select name="category" required>
    <option value="career_support">キャリア相談</option>
    <option value="work_consultation">業務相談</option>
    <option value="skill_development">スキル向上</option>
    <option value="mental_health">メンタルヘルス</option>
  </select>
</div>

<!-- 希望時間帯 -->
<div class="time-preference">
  <h3>希望時間帯</h3>
  <div class="checkbox-group">
    <label><input type="checkbox" name="morning">午前(9:00-12:00)</label>
    <label><input type="checkbox" name="afternoon">午後(13:00-17:00)</label>
    <label><input type="checkbox" name="evening">夕方(17:00-19:00)</label>
    <label><input type="checkbox" name="anytime">いつでもOK</label>
  </div>
</div>

<!-- 担当者希望 -->
<div class="interviewer-preference">
  <h3>担当者希望</h3>
  <div class="radio-group">
    <label><input type="radio" name="interviewer" value="any" checked>AIにおまかせ</label>
    <label><input type="radio" name="interviewer" value="specific">指名あり</label>
  </div>
  <input type="text" name="preferred-name" placeholder="担当者名（指名ありの場合）">
</div>

<!-- 所要時間 -->
<div class="duration">
  <h3>希望時間</h3>
  <select name="min-duration">
    <option value="15">15分以上</option>
    <option value="30" selected>30分以上</option>
    <option value="45">45分以上</option>
  </select>
  <select name="max-duration">
    <option value="30">30分以内</option>
    <option value="45" selected>45分以内</option>
    <option value="60">60分以内</option>
  </select>
</div>

<!-- 申込ボタン -->
<div class="submit-section">
  <button type="submit" class="ai-booking-btn">
    AI最適化で予約申込
  </button>
  <p class="note">AIが最適な担当者・日程を提案します（約1-2分）</p>
</div>
```

#### 申込送信後の処理中画面
```html
<div class="processing-screen">
  <div class="ai-animation">
    <div class="spinner"></div>
    <h2>AI最適化処理中...</h2>
  </div>

  <div class="processing-status">
    <div class="progress-bar">
      <div class="progress" style="width: 65%"></div>
    </div>
    <p class="status-text">担当者との最適なマッチングを検索中</p>
    <p class="estimate">残り時間: 約30秒</p>
  </div>

  <div class="processing-details">
    <ul class="process-steps">
      <li class="completed">✓ 申込内容確認完了</li>
      <li class="completed">✓ 担当者候補抽出完了</li>
      <li class="active">⚡ スケジュール最適化中</li>
      <li class="pending">⏳ 推薦候補生成中</li>
    </ul>
  </div>

  <div class="emergency-contact">
    <p>緊急の場合: <a href="tel:1234">内線1234</a></p>
  </div>
</div>
```

### 2-2. 提案表示フェーズUI

#### AI提案3パターン表示画面
```html
<div class="proposals-container">
  <div class="proposals-header">
    <h2>🤖 AI最適化結果</h2>
    <p>あなたに最適な面談候補を3つ提案します</p>
    <div class="expires-notice">
      ⏰ 選択期限: 2025年9月17日 23:59まで
    </div>
  </div>

  <!-- 1位提案 -->
  <div class="proposal-card recommended">
    <div class="rank-badge rank-1">最適</div>
    <div class="confidence-score">
      <span class="score">92%</span>
      <span class="label">適合度</span>
    </div>

    <div class="interviewer-info">
      <div class="photo">
        <img src="/photos/tanaka-mikako.jpg" alt="田中美香子">
      </div>
      <div class="details">
        <h3>田中美香子 看護師長</h3>
        <p class="department">キャリア支援室</p>
        <p class="experience">看護師15年、キャリア相談専門5年</p>
        <div class="specialties">
          <span class="tag">キャリア開発</span>
          <span class="tag">専門分野選択</span>
          <span class="tag">資格取得支援</span>
        </div>
      </div>
    </div>

    <div class="schedule-info">
      <div class="datetime">
        <h4>📅 2025年9月20日（金）</h4>
        <h4>🕐 14:30-15:15 (45分)</h4>
      </div>
      <div class="location">
        <p>📍 相談室A</p>
        <p>👥 対面</p>
      </div>
    </div>

    <div class="ai-reasoning">
      <h4>✨ この提案の理由</h4>
      <ul class="highlights">
        <li>同じ内科病棟出身</li>
        <li>キャリア相談専門5年</li>
        <li>希望時間にピッタリ空いている</li>
      </ul>
      <p class="summary">あなたのご希望に最も適しています</p>
    </div>

    <button class="select-btn primary" data-proposal-id="REC-001">
      この提案で予約する
    </button>
  </div>

  <!-- 2位提案 -->
  <div class="proposal-card alternative">
    <div class="rank-badge rank-2">代替</div>
    <div class="confidence-score">
      <span class="score">87%</span>
      <span class="label">適合度</span>
    </div>

    <div class="interviewer-info">
      <div class="photo">
        <img src="/photos/sato-kenichi.jpg" alt="佐藤健一">
      </div>
      <div class="details">
        <h3>佐藤健一 看護部主任</h3>
        <p class="department">教育研修部</p>
        <p class="experience">看護師12年、新人指導専門3年</p>
      </div>
    </div>

    <div class="schedule-info">
      <div class="datetime">
        <h4>📅 2025年9月21日（土）</h4>
        <h4>🕐 16:00-16:30 (30分)</h4>
      </div>
      <div class="location">
        <p>📍 研修室B</p>
        <p>👥 対面</p>
      </div>
    </div>

    <div class="ai-reasoning">
      <h4>✨ この提案の理由</h4>
      <ul class="highlights">
        <li>新人・若手職員のキャリア支援専門</li>
        <li>希望日時に完全一致</li>
        <li>相談しやすい雰囲気</li>
      </ul>
      <p class="summary">代替候補として良い選択肢です</p>
    </div>

    <button class="select-btn secondary" data-proposal-id="REC-002">
      この提案で予約する
    </button>
  </div>

  <!-- 3位提案 -->
  <div class="proposal-card other">
    <div class="rank-badge rank-3">その他</div>
    <div class="confidence-score">
      <span class="score">82%</span>
      <span class="label">適合度</span>
    </div>

    <div class="interviewer-info">
      <div class="photo">
        <img src="/photos/yamada-ryoko.jpg" alt="山田良子">
      </div>
      <div class="details">
        <h3>山田良子 主任看護師</h3>
        <p class="department">人事部</p>
        <p class="experience">看護師10年、人事担当2年</p>
      </div>
    </div>

    <div class="schedule-info">
      <div class="datetime">
        <h4>📅 2025年9月22日（日）</h4>
        <h4>🕐 15:00-15:30 (30分)</h4>
      </div>
      <div class="location">
        <p>📍 人事相談室</p>
        <p>👥 対面</p>
      </div>
    </div>

    <div class="ai-reasoning">
      <h4>✨ この提案の理由</h4>
      <ul class="highlights">
        <li>人事制度に詳しい</li>
        <li>キャリアパス設計サポート</li>
        <li>昇進・異動相談対応</li>
      </ul>
      <p class="summary">その他のご提案です</p>
    </div>

    <button class="select-btn tertiary" data-proposal-id="REC-003">
      この提案で予約する
    </button>
  </div>

  <!-- どれも合わない場合 -->
  <div class="no-match-section">
    <h3>😅 どの提案も都合がつかない場合</h3>
    <button class="edit-request-btn" onclick="openAdjustmentForm()">
      条件を変更して再提案を依頼
    </button>
    <p class="alternative">または <a href="tel:1234">人事部直接相談 (内線1234)</a></p>
  </div>
</div>
```

### 2-3. 調整フェーズUI

#### 条件調整・編集フォーム
```html
<div class="adjustment-form-modal">
  <div class="modal-content">
    <h2>条件変更・再提案依頼</h2>

    <div class="current-proposals">
      <h3>現在の提案</h3>
      <div class="proposal-summary">
        <p>1位: 田中美香子 看護師長 - 9/20 14:30</p>
        <p>2位: 佐藤健一 看護部主任 - 9/21 16:00</p>
        <p>3位: 山田良子 主任看護師 - 9/22 15:00</p>
      </div>
    </div>

    <div class="adjustment-type">
      <h3>どこを変更しますか？</h3>
      <div class="checkbox-group">
        <label>
          <input type="checkbox" name="change-date" checked>
          希望日程を変更
        </label>
        <label>
          <input type="checkbox" name="change-time">
          希望時間帯を変更
        </label>
        <label>
          <input type="checkbox" name="change-interviewer">
          担当者希望を変更
        </label>
        <label>
          <input type="checkbox" name="change-duration">
          所要時間を変更
        </label>
      </div>
    </div>

    <!-- 希望日程変更 -->
    <div class="date-adjustment" style="display: block;">
      <h4>新しい希望日程</h4>
      <div class="date-picker-group">
        <input type="date" name="alt-date-1" value="2025-09-23">
        <input type="date" name="alt-date-2" value="2025-09-24">
        <input type="date" name="alt-date-3" value="2025-09-25">
      </div>
    </div>

    <!-- 希望時間変更 -->
    <div class="time-adjustment" style="display: none;">
      <h4>新しい希望時間帯</h4>
      <div class="time-slots">
        <label><input type="checkbox" name="time-morning">午前(9:00-12:00)</label>
        <label><input type="checkbox" name="time-afternoon" checked>午後(13:00-17:00)</label>
        <label><input type="checkbox" name="time-evening">夕方(17:00-19:00)</label>
      </div>
    </div>

    <!-- 担当者変更 -->
    <div class="interviewer-adjustment" style="display: none;">
      <h4>担当者希望変更</h4>
      <div class="radio-group">
        <label><input type="radio" name="new-interviewer" value="keep-original">元の担当者での別日程</label>
        <label><input type="radio" name="new-interviewer" value="any">担当者変更OK</label>
        <label><input type="radio" name="new-interviewer" value="specific">特定の担当者を指名</label>
      </div>
      <input type="text" name="specific-interviewer" placeholder="担当者名">
    </div>

    <!-- 理由・要望 -->
    <div class="reason-notes">
      <h4>変更理由・ご要望</h4>
      <textarea name="adjustment-reason" placeholder="例：午前中の方が参加しやすいです" rows="3">
提案された時間が都合つかない。午前中の方が参加しやすいです。
      </textarea>
    </div>

    <div class="form-actions">
      <button type="button" class="cancel-btn" onclick="closeAdjustmentForm()">
        キャンセル
      </button>
      <button type="submit" class="submit-adjustment-btn">
        再提案を依頼する
      </button>
    </div>
  </div>
</div>
```

#### 再提案表示画面
```html
<div class="revised-proposals">
  <div class="revision-notice">
    <h2>🔄 調整後の新提案</h2>
    <p>ご要望に合わせて新しい候補を用意しました</p>
    <div class="adjustment-summary">
      <span class="tag">午前中希望</span>
      <span class="tag">同担当者</span>
    </div>
  </div>

  <div class="proposal-card revised-recommendation">
    <div class="rank-badge rank-1">最適</div>
    <div class="revised-label">調整済み</div>

    <div class="interviewer-info">
      <div class="photo">
        <img src="/photos/tanaka-mikako.jpg" alt="田中美香子">
      </div>
      <div class="details">
        <h3>田中美香子 看護師長</h3>
        <p class="department">キャリア支援室</p>
        <div class="change-highlight">
          <p class="original">元: 9/20 14:30</p>
          <p class="new">新: 9/23 10:00</p>
        </div>
      </div>
    </div>

    <div class="schedule-info">
      <div class="datetime">
        <h4>📅 2025年9月23日（月）</h4>
        <h4>🕐 10:00-10:45 (45分)</h4>
      </div>
      <div class="location">
        <p>📍 相談室A</p>
        <p>👥 対面</p>
      </div>
    </div>

    <div class="adjustment-note">
      <p>✨ ご希望の午前中で同じ担当者で調整できました</p>
    </div>

    <button class="select-btn primary" data-proposal-id="REC-001-REV">
      この調整案で予約する
    </button>
  </div>

  <div class="still-not-suitable">
    <button class="further-adjustment-btn">
      まだ都合がつかない場合の再調整
    </button>
  </div>
</div>
```

### 2-4. 確定・完了フェーズUI

#### 選択確認画面
```html
<div class="selection-confirmation">
  <h2>✅ 予約内容確認</h2>

  <div class="selected-proposal">
    <div class="confirmation-details">
      <h3>選択した面談</h3>
      <div class="details-grid">
        <div class="detail-item">
          <span class="label">担当者</span>
          <span class="value">田中美香子 看護師長</span>
        </div>
        <div class="detail-item">
          <span class="label">日時</span>
          <span class="value">2025年9月20日（金） 14:30-15:15</span>
        </div>
        <div class="detail-item">
          <span class="label">場所</span>
          <span class="value">相談室A</span>
        </div>
        <div class="detail-item">
          <span class="label">内容</span>
          <span class="value">キャリア相談</span>
        </div>
      </div>
    </div>
  </div>

  <div class="feedback-section">
    <h4>選択理由・ご感想（任意）</h4>
    <textarea name="selection-feedback" placeholder="例：時間がちょうど良く、専門性も高そうで安心しました" rows="3"></textarea>
  </div>

  <div class="confirmation-actions">
    <button type="button" class="back-btn">
      選択し直す
    </button>
    <button type="submit" class="confirm-booking-btn">
      この内容で予約確定
    </button>
  </div>

  <div class="process-note">
    <p>⚠️ 確定後、人事部による最終承認があります（通常1時間以内）</p>
  </div>
</div>
```

#### 承認待ち画面
```html
<div class="approval-pending">
  <div class="status-header">
    <h2>⏳ 承認待ち</h2>
    <p>人事部による最終確認中です</p>
  </div>

  <div class="booking-summary">
    <h3>申込内容</h3>
    <div class="summary-card">
      <div class="booking-id">予約ID: VD-REQ-2025091601</div>
      <div class="booking-details">
        <p><strong>田中美香子 看護師長</strong></p>
        <p>2025年9月20日（金） 14:30-15:15</p>
        <p>相談室A</p>
      </div>
    </div>
  </div>

  <div class="approval-status">
    <div class="status-indicator">
      <div class="step completed">
        <span class="icon">✓</span>
        <span class="text">予約申込完了</span>
      </div>
      <div class="step completed">
        <span class="icon">✓</span>
        <span class="text">AI最適化完了</span>
      </div>
      <div class="step completed">
        <span class="icon">✓</span>
        <span class="text">職員選択完了</span>
      </div>
      <div class="step active">
        <span class="icon">⏳</span>
        <span class="text">人事部承認中</span>
      </div>
      <div class="step pending">
        <span class="icon">📅</span>
        <span class="text">面談実施</span>
      </div>
    </div>
  </div>

  <div class="estimated-time">
    <p>🕐 承認完了予定時刻: 17:00頃</p>
  </div>

  <div class="contact-info">
    <p>お急ぎの場合: <a href="tel:1234">人事部 内線1234</a></p>
  </div>
</div>
```

#### 確定完了画面
```html
<div class="booking-confirmed">
  <div class="success-header">
    <div class="success-icon">🎉</div>
    <h2>面談予約確定！</h2>
    <p>人事部による承認が完了しました</p>
  </div>

  <div class="confirmed-details">
    <h3>確定した面談予約</h3>
    <div class="final-booking-card">
      <div class="booking-id">
        <span class="label">予約ID:</span>
        <span class="value">AI-BOOK-1726502400-abc123</span>
      </div>

      <div class="interviewer-section">
        <div class="photo">
          <img src="/photos/tanaka-mikako.jpg" alt="田中美香子">
        </div>
        <div class="info">
          <h4>田中美香子 看護師長</h4>
          <p>キャリア支援室</p>
        </div>
      </div>

      <div class="schedule-section">
        <div class="datetime">
          <h4>📅 2025年9月20日（金）</h4>
          <h4>🕐 14:30-15:15 (45分)</h4>
        </div>
        <div class="location">
          <p>📍 相談室A</p>
        </div>
      </div>
    </div>
  </div>

  <div class="confirmation-message">
    <div class="message-box">
      <p>面談が正式に確定しました。2025年9月20日 14:30から田中美香子看護師長との面談を実施します。</p>
    </div>
  </div>

  <div class="next-actions">
    <h4>次のアクション</h4>
    <div class="action-list">
      <div class="action-item">
        <span class="icon">📅</span>
        <span class="text">カレンダーに追加</span>
        <button class="action-btn">追加</button>
      </div>
      <div class="action-item">
        <span class="icon">🔔</span>
        <span class="text">リマインダー設定</span>
        <button class="action-btn">設定</button>
      </div>
      <div class="action-item">
        <span class="icon">📱</span>
        <span class="text">担当者に事前連絡</span>
        <button class="action-btn">連絡</button>
      </div>
    </div>
  </div>

  <div class="notification-status">
    <h4>通知状況</h4>
    <ul class="notification-list">
      <li class="completed">✓ 担当者への通知完了</li>
      <li class="completed">✓ カレンダー更新完了</li>
      <li class="completed">✓ リマインダー設定完了</li>
    </ul>
  </div>

  <div class="help-section">
    <h4>変更・キャンセルについて</h4>
    <p>面談の変更・キャンセルは <a href="tel:1234">人事部 内線1234</a> までご連絡ください。</p>
  </div>
</div>
```

## 3. 状態管理・ナビゲーション

### 3-1. ステータス管理
```javascript
// 状態管理オブジェクト
const bookingState = {
  phase: 'application', // application, processing, proposals, adjustment, confirmation, approval, completed
  requestId: null,
  voicedriveRequestId: null,
  selectedProposal: null,
  adjustmentCount: 0,
  isExpired: false,
  lastUpdate: null
};

// 状態遷移マップ
const stateTransitions = {
  'application': ['processing'],
  'processing': ['proposals', 'error'],
  'proposals': ['confirmation', 'adjustment'],
  'adjustment': ['proposals', 'error'],
  'confirmation': ['approval'],
  'approval': ['completed', 'error'],
  'completed': [],
  'error': ['application']
};
```

### 3-2. エラーハンドリング
```html
<!-- エラー表示画面 -->
<div class="error-screen">
  <div class="error-icon">❌</div>
  <h2>処理エラー</h2>
  <div class="error-message">
    <p>AI最適化処理に失敗しました。</p>
  </div>

  <div class="error-actions">
    <button class="retry-btn">再試行</button>
    <button class="immediate-booking-btn">即時予約に切り替え</button>
    <button class="contact-hr-btn">人事部に相談</button>
  </div>

  <div class="fallback-options">
    <h4>代替案</h4>
    <ul>
      <li>即時予約への切り替え</li>
      <li>人事部直接相談 (内線1234)</li>
    </ul>
  </div>
</div>
```

## 4. レスポンシブ対応

### 4-1. モバイル最適化
- 提案カードのスタック表示
- タッチフレンドリーなボタンサイズ
- スワイプ操作対応
- 縦画面での見やすいレイアウト

### 4-2. タブレット対応
- 2カラムレイアウト
- サイドバーナビゲーション
- 大きなタッチターゲット

## 5. アクセシビリティ

### 5-1. 必須対応
- スクリーンリーダー対応
- キーボードナビゲーション
- 高コントラストモード
- 文字サイズ拡大対応

### 5-2. UX配慮
- 直感的なアイコン使用
- 明確なステータス表示
- エラーメッセージの分かりやすい説明
- 進捗の可視化

## 6. 技術実装メモ

### 6-1. 推奨技術スタック
- フロントエンド: React/Vue.js + TypeScript
- 状態管理: Redux/Vuex
- HTTP通信: Axios
- リアルタイム通信: WebSocket/Server-Sent Events

### 6-2. パフォーマンス要件
- 初期表示: 2秒以内
- 提案表示: 1秒以内
- 状態更新: 0.5秒以内

---

**実装サポート**: 医療職員管理システム開発チーム
**UI/UX相談**: internal-design@hospital.jp