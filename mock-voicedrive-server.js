// VoiceDrive APIモックサーバー
// 統合テスト用

const express = require('express');
const app = express();
const PORT = 3002;

app.use(express.json());

// ログ記録用
const receivedNotifications = [];

// CORS対応
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-ID, X-Source-System');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// カテゴリマッピング
const categoryMapping = {
  'announcement': 'NOTIFICATION',
  'interview': 'MEETING',
  'training': 'EDUCATION',
  'survey': 'SURVEY',
  'other': 'OTHER'
};

// 優先度マッピング
const priorityMapping = {
  'high': ['URGENT', 'HIGH'],
  'medium': 'NORMAL',
  'low': 'LOW'
};

// 通知受信エンドポイント
app.post('/api/notifications/receive', (req, res) => {
  console.log('\n====================================');
  console.log('📨 通知受信:', new Date().toISOString());
  console.log('====================================');

  // 認証チェック
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ 認証エラー: トークンが不正です');
    return res.status(401).json({
      success: false,
      error: '認証が必要です'
    });
  }

  const token = authHeader.split(' ')[1];
  if (token !== 'test_vd_token_2025_0920') {
    console.log('❌ 認証エラー: 無効なトークン');
    return res.status(401).json({
      success: false,
      error: '無効なトークンです'
    });
  }

  // リクエストデータ
  const notification = req.body;

  console.log('📋 受信内容:');
  console.log('  カテゴリ:', notification.category);
  console.log('  優先度:', notification.priority);
  console.log('  タイトル:', notification.title);
  console.log('  対象:', notification.targetType);

  // カテゴリ変換
  const mappedCategory = categoryMapping[notification.category] || 'OTHER';

  // 優先度変換
  let mappedPriority;
  if (notification.priority === 'high') {
    mappedPriority = 'URGENT';
  } else if (notification.priority === 'medium') {
    mappedPriority = 'NORMAL';
  } else {
    mappedPriority = 'LOW';
  }

  // 通知処理（シミュレーション）
  const processedNotification = {
    id: `vd_notif_${Date.now()}`,
    originalId: req.headers['x-request-id'],
    sourceSystem: req.headers['x-source-system'],
    receivedAt: new Date().toISOString(),
    category: {
      original: notification.category,
      mapped: mappedCategory
    },
    priority: {
      original: notification.priority,
      mapped: mappedPriority
    },
    title: notification.title,
    content: notification.content,
    targetInfo: {
      type: notification.targetType,
      departments: notification.targetDepartments || [],
      individuals: notification.targetIndividuals || [],
      positions: notification.targetPositions || []
    },
    // アンケート情報
    surveyInfo: notification.category === 'survey' ? {
      subCategory: notification.surveySubCategory,
      anonymous: notification.surveyAnonymous,
      endDate: notification.surveyEndDate,
      questions: notification.surveyQuestions
    } : null,
    // 研修情報
    trainingInfo: notification.category === 'training' ? {
      registrationEnabled: notification.trainingEnableRegistration,
      capacity: notification.trainingCapacity,
      deadline: notification.trainingRegistrationDeadline,
      location: notification.trainingLocation,
      duration: notification.trainingDuration
    } : null,
    processingStatus: 'completed',
    deliveryStatus: 'pending'
  };

  // ログに保存
  receivedNotifications.push(processedNotification);

  console.log('✅ 処理成功');
  console.log('  通知ID:', processedNotification.id);
  console.log('  変換後カテゴリ:', mappedCategory);
  console.log('  変換後優先度:', mappedPriority);

  // 成功レスポンス
  res.json({
    success: true,
    notificationId: processedNotification.id,
    message: '通知を正常に受信しました',
    processing: {
      category: mappedCategory,
      priority: mappedPriority,
      targetCount: calculateTargetCount(notification),
      estimatedDeliveryTime: '2025-09-20T10:00:00Z'
    },
    metadata: {
      receivedAt: processedNotification.receivedAt,
      processedBy: 'VoiceDrive Test API v1.0'
    }
  });
});

// 受信済み通知一覧取得
app.get('/api/notifications/received', (req, res) => {
  res.json({
    count: receivedNotifications.length,
    notifications: receivedNotifications
  });
});

// ヘルスチェック
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'VoiceDrive Mock API',
    timestamp: new Date().toISOString(),
    receivedCount: receivedNotifications.length
  });
});

// 対象者数計算（シミュレーション）
function calculateTargetCount(notification) {
  switch(notification.targetType) {
    case 'all':
      return 500; // 全職員想定
    case 'departments':
      return notification.targetDepartments.length * 50; // 部署あたり50人想定
    case 'individuals':
      return notification.targetIndividuals.length;
    case 'positions':
      return notification.targetPositions.length * 20; // 役職あたり20人想定
    default:
      return 0;
  }
}

// サーバー起動
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     VoiceDrive モックサーバー起動      ║
╠════════════════════════════════════════╣
║  ポート: ${PORT}                           ║
║  URL: http://localhost:${PORT}            ║
║                                        ║
║  エンドポイント:                       ║
║  • POST /api/notifications/receive     ║
║  • GET  /api/notifications/received    ║
║  • GET  /health                        ║
╚════════════════════════════════════════╝

📡 通知受信待機中...
  `);
});

// グレースフルシャットダウン
process.on('SIGINT', () => {
  console.log('\n受信通知数:', receivedNotifications.length);
  console.log('サーバーを停止します...');
  process.exit(0);
});