/**
 * VoiceDrive Analytics統合テスト用 JWT トークン生成スクリプト
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = 'jwt_secret_key_for_production';

// テスト用ペイロード（職員カルテシステム用）
const payload = {
  staffId: 'analytics-system-test',
  email: 'analytics@medical-staff-system.test',
  accountLevel: 99, // システム管理者レベル
  facility: 'medical-staff-system',
  department: 'analytics-integration',
};

// 有効期限: 1年間（テスト環境用）
const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '365d' });

console.log('\n============================================================');
console.log('🔐 VoiceDrive Analytics統合テスト用 JWT トークン');
console.log('============================================================\n');
console.log('トークン:');
console.log(token);
console.log('\n有効期限: 365日（2026年10月7日まで）');
console.log('\nペイロード:');
console.log(JSON.stringify(payload, null, 2));
console.log('\n.env.voicedrive.test に以下を設定してください:');
console.log(`VOICEDRIVE_JWT_TOKEN="${token}"`);
console.log('\n============================================================\n');
