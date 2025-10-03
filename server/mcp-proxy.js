/**
 * MCPプロキシサーバー
 * VoiceDrive MCPサーバー(8080) → 医療システムAPI(3002) への転送
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 8080;
const MEDICAL_SYSTEM_API = 'http://localhost:3002';

// ミドルウェア
app.use(cors());
app.use(express.json());

// ログ出力
const log = (level, message, data = null) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
};

/**
 * ヘルスチェック
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MCP Proxy Server',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * フィードバック面談予約受信 → 医療システムAPI転送
 */
app.post('/api/interviews/reservations', async (req, res) => {
  try {
    log('info', 'POST /api/interviews/reservations - Received from VoiceDrive');
    log('info', 'Request body:', req.body);

    // VoiceDrive形式から医療システム形式への変換
    const voicedriveData = req.body;

    // 日程情報の変換（VoiceDriveは timing/timeSlot/weekdays を使用）
    // 医療システムは scheduledDate/scheduledTime を期待
    const scheduledDate = calculateScheduledDate(voicedriveData.timing, voicedriveData.weekdays);
    const scheduledTime = voicedriveData.timeSlot || '14:00';

    const medicalSystemData = {
      staffId: voicedriveData.staffId,
      staffName: voicedriveData.staffName || '職員名未設定',
      department: voicedriveData.department || '部署未設定',
      position: voicedriveData.position || '職位未設定',
      type: voicedriveData.type || 'support',
      supportCategory: voicedriveData.supportCategory || 'feedback',
      supportTopic: voicedriveData.supportTopic || 'フィードバック面談',
      scheduledDate: scheduledDate,
      scheduledTime: scheduledTime,
      urgency: voicedriveData.urgency,
      evaluationDetails: voicedriveData.evaluationDetails,
      notes: voicedriveData.notes,
      duration: 45,
      source: 'voicedrive',
      createdBy: '職員本人（VoiceDrive経由）'
    };

    log('info', 'Converted data for medical system:', medicalSystemData);

    // 医療システムAPIに転送
    const medicalSystemUrl = `${MEDICAL_SYSTEM_API}/api/interviews/reservations`;
    log('info', `Forwarding to medical system: ${medicalSystemUrl}`);

    const response = await axios.post(medicalSystemUrl, medicalSystemData, {
      headers: {
        'Content-Type': 'application/json',
      },
      validateStatus: () => true // すべてのステータスコードを受け入れる
    });

    const responseData = response.data;

    log('info', `Medical system response status: ${response.status}`);
    log('info', 'Medical system response:', responseData);

    if (response.status >= 200 && response.status < 300 && responseData.success) {
      // 医療システムからの成功レスポンスをVoiceDrive形式に変換
      const voicedriveResponse = {
        success: true,
        reservationId: responseData.data.id,
        message: 'フィードバック面談の予約を受け付けました',
        status: 'pending_schedule',
        estimatedResponseDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        nextSteps: [
          '調整担当者が面談日程を確認します',
          '48時間以内に候補日時をご連絡します',
          '日程確定後、正式な予約確認通知を送信します'
        ],
        medicalSystemData: responseData.data
      };

      log('info', 'Feedback interview reservation forwarded successfully');
      res.status(201).json(voicedriveResponse);
    } else {
      // 医療システムからのエラーレスポンス
      log('error', 'Medical system returned error:', responseData);
      res.status(response.status).json({
        success: false,
        error: responseData.error || 'Medical system error',
        details: responseData
      });
    }

  } catch (error) {
    log('error', 'Error forwarding to medical system:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to forward reservation to medical system',
      details: error.message
    });
  }
});

/**
 * 予約一覧取得（医療システムAPIから取得して返す）
 */
app.get('/api/interviews/reservations', async (req, res) => {
  try {
    const staffId = req.query.staffId;
    const status = req.query.status;

    let url = `${MEDICAL_SYSTEM_API}/api/interviews/reservations`;
    const params = new URLSearchParams();
    if (staffId) params.append('staffId', staffId);
    if (status) params.append('status', status);
    if (params.toString()) url += `?${params.toString()}`;

    log('info', `GET ${url}`);

    const response = await axios.get(url, {
      validateStatus: () => true
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    log('error', 'Error fetching reservations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reservations'
    });
  }
});

/**
 * 予約詳細取得
 */
app.get('/api/interviews/reservations/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const url = `${MEDICAL_SYSTEM_API}/api/interviews/reservations/${id}`;

    log('info', `GET ${url}`);

    const response = await axios.get(url, {
      validateStatus: () => true
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    log('error', 'Error fetching reservation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reservation'
    });
  }
});

/**
 * ダッシュボード（簡易）
 */
app.get('/dashboard', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>MCP Proxy Dashboard</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h1 { color: #333; }
        .status { padding: 10px; background: #4CAF50; color: white; border-radius: 4px; margin: 20px 0; }
        .info { background: #f9f9f9; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0; }
        code { background: #e0e0e0; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🔄 MCP Proxy Server Dashboard</h1>
        <div class="status">✅ サーバー稼働中</div>

        <h2>📊 サービス情報</h2>
        <div class="info">
          <p><strong>ポート:</strong> ${PORT}</p>
          <p><strong>医療システムAPI:</strong> ${MEDICAL_SYSTEM_API}</p>
          <p><strong>稼働時間:</strong> ${Math.floor(process.uptime())}秒</p>
        </div>

        <h2>🔗 エンドポイント</h2>
        <div class="info">
          <p><code>POST /api/interviews/reservations</code> - 予約受信・転送</p>
          <p><code>GET /api/interviews/reservations</code> - 予約一覧取得</p>
          <p><code>GET /api/interviews/reservations/:id</code> - 予約詳細取得</p>
          <p><code>GET /health</code> - ヘルスチェック</p>
        </div>

        <h2>📋 動作フロー</h2>
        <div class="info">
          <p>VoiceDrive UI (5173) → MCP Proxy (8080) → 医療システム (3002)</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

/**
 * 日程計算ヘルパー
 */
function calculateScheduledDate(timing, weekdays) {
  const today = new Date();

  if (timing === 'asap') {
    // できるだけ早く → 翌営業日
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  } else if (timing === 'this_week') {
    // 今週中 → 3日後
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() + 3);
    return thisWeek.toISOString().split('T')[0];
  } else if (timing === 'next_week') {
    // 来週 → 7日後
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
  } else {
    // その他 → 5日後
    const later = new Date(today);
    later.setDate(later.getDate() + 5);
    return later.toISOString().split('T')[0];
  }
}

// サーバー起動
app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║   MCP Proxy Server Started                       ║');
  console.log('╚════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`🔗 Listening on: http://localhost:${PORT}`);
  console.log(`📡 Forwarding to: ${MEDICAL_SYSTEM_API}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('Press Ctrl+C to stop');
  console.log('');
});

module.exports = app;
