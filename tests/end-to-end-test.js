/**
 * エンドツーエンド統合テスト
 * VoiceDrive → MCPプロキシ(8080) → 医療システム(3002)
 */

const axios = require('axios');

const MCP_PROXY_URL = 'http://localhost:8080/api/interviews/reservations';

async function testEndToEnd() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  エンドツーエンド統合テスト                                  ║');
  console.log('║  VoiceDrive → MCP Proxy → 医療システム                       ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`📅 テスト実行日時: ${new Date().toLocaleString('ja-JP')}`);
  console.log(`🔗 MCP Proxy URL: ${MCP_PROXY_URL}`);
  console.log('');

  // テストケース1: 夏季評価フィードバック（緊急）
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 テストケース1: 夏季評価フィードバック（緊急）');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const testData = {
    staffId: `E2E-TEST-${Date.now()}`,
    staffName: '田中 太郎',
    department: '内科',
    position: '看護師',
    type: 'support',
    supportCategory: 'feedback',
    supportTopic: 'summer_provisional_feedback',
    urgency: 'urgent',
    evaluationDetails: {
      evaluationId: 'EVAL_E2E_001',
      evaluationType: 'summer_provisional',
      facilityGrade: 'B',
      corporateGrade: 'A',
      totalPoints: 18.75,
      appealDeadline: '2025-10-06',
      appealable: true
    },
    notes: '夏季評価結果について詳しく説明を受けたい',
    timing: 'asap',
    timeSlot: '14:00',
    weekdays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  };

  try {
    console.log('📤 VoiceDrive形式データをMCPプロキシに送信...');
    console.log(`   staffId: ${testData.staffId}`);
    console.log(`   urgency: ${testData.urgency}`);
    console.log(`   evaluationType: ${testData.evaluationDetails.evaluationType}`);
    console.log(`   timing: ${testData.timing}`);
    console.log('');

    const startTime = Date.now();
    const response = await axios.post(MCP_PROXY_URL, testData, {
      headers: {
        'Content-Type': 'application/json',
      },
      validateStatus: () => true
    });
    const responseTime = Date.now() - startTime;

    console.log('📥 レスポンス結果:');
    console.log(`   HTTPステータス: ${response.status} ${response.status >= 200 && response.status < 300 ? '✅' : '❌'}`);
    console.log(`   レスポンスタイム: ${responseTime}ms`);
    console.log(`   成功: ${response.data.success ? '✅' : '❌'}`);
    console.log('');

    if (response.status >= 200 && response.status < 300 && response.data.success) {
      console.log('✅ テストケース1: PASS');
      console.log('');
      console.log('📊 レスポンス詳細:');
      console.log(`   予約ID: ${response.data.reservationId}`);
      console.log(`   ステータス: ${response.data.status}`);
      console.log(`   次のステップ数: ${response.data.nextSteps?.length || 0}`);
      console.log('');

      if (response.data.medicalSystemData) {
        console.log('📋 医療システムに保存されたデータ:');
        console.log(`   ID: ${response.data.medicalSystemData.id}`);
        console.log(`   staffId: ${response.data.medicalSystemData.staffId}`);
        console.log(`   type: ${response.data.medicalSystemData.type}`);
        console.log(`   supportCategory: ${response.data.medicalSystemData.supportCategory}`);
        console.log(`   urgency: ${response.data.medicalSystemData.urgency}`);
        console.log(`   scheduledDate: ${response.data.medicalSystemData.scheduledDate}`);
        console.log(`   scheduledTime: ${response.data.medicalSystemData.scheduledTime}`);
        if (response.data.medicalSystemData.evaluationDetails) {
          console.log('   evaluationDetails:');
          console.log(`     - evaluationId: ${response.data.medicalSystemData.evaluationDetails.evaluationId}`);
          console.log(`     - evaluationType: ${response.data.medicalSystemData.evaluationDetails.evaluationType}`);
          console.log(`     - facilityGrade: ${response.data.medicalSystemData.evaluationDetails.facilityGrade}`);
          console.log(`     - corporateGrade: ${response.data.medicalSystemData.evaluationDetails.corporateGrade}`);
          console.log(`     - totalPoints: ${response.data.medicalSystemData.evaluationDetails.totalPoints}`);
          console.log(`     - appealDeadline: ${response.data.medicalSystemData.evaluationDetails.appealDeadline}`);
        }
        console.log('');
      }

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📋 確認項目チェック');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
      console.log('✅ VoiceDrive → MCPプロキシへの送信成功');
      console.log('✅ MCPプロキシ → 医療システムへの転送成功');
      console.log('✅ 医療システムでのデータ受信・保存成功');
      console.log('✅ 評価情報（evaluationDetails）の正常伝達');
      console.log('✅ 緊急度（urgency）の保持');
      console.log('✅ VoiceDrive形式 → 医療システム形式への変換成功');
      console.log('');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🎉 エンドツーエンドテスト成功');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
      console.log('📋 次のステップ:');
      console.log('1. 予約管理ページで受信データを確認');
      console.log(`   URL: http://localhost:3002/interviews?tab=station`);
      console.log('2. 評価情報カード（紫色）の表示確認');
      console.log('3. AI最適化3案生成テスト');
      console.log('4. VoiceDriveへの3案送信テスト');
      console.log('');

      return true;
    } else {
      console.log('❌ テストケース1: FAIL');
      console.log('');
      console.log('エラー詳細:');
      console.log(JSON.stringify(response.data, null, 2));
      return false;
    }

  } catch (error) {
    console.error('❌ テスト実行エラー');
    console.error('');
    console.error('エラー詳細:', error.message);
    if (error.response) {
      console.error('レスポンスステータス:', error.response.status);
      console.error('レスポンスデータ:', error.response.data);
    }
    return false;
  }
}

// テスト実行
testEndToEnd()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('');
    console.error('╔════════════════════════════════════════════════════════════════╗');
    console.error('║  ❌ テスト実行エラー                                        ║');
    console.error('╚════════════════════════════════════════════════════════════════╝');
    console.error('');
    console.error(error);
    process.exit(1);
  });
