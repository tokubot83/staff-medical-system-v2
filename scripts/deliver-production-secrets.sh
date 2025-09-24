#!/bin/bash

# ====================================
# 本番環境秘密情報配信スクリプト
# 実行日時: 2025年9月25日 09:00
# ====================================

echo "================================================"
echo "  医療システム 本番環境秘密情報配信"
echo "  配信先: VoiceDriveチーム"
echo "================================================"
echo ""

# 配信IDの生成
DELIVERY_ID="SEC-20250925-MED001"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

echo "配信ID: $DELIVERY_ID"
echo "配信日時: $TIMESTAMP"
echo ""

# 環境変数の確認
echo "1. 環境変数を確認中..."
if [ ! -f ".env.production.local" ]; then
    echo "❌ エラー: .env.production.local ファイルが見つかりません"
    echo "   まず本番環境の秘密情報を設定してください"
    exit 1
fi

# CLIツールの実行
echo "2. 秘密情報を暗号化中..."
echo ""

# medical-cliを使用した配信
npm run medical-cli -- secrets deliver \
  --recipient voicedrive-production \
  --env production \
  --expires 24h \
  --mfa required

echo ""
echo "================================================"
echo "  配信完了チェックリスト"
echo "================================================"
echo ""
echo "✅ 配信ID: $DELIVERY_ID"
echo "✅ 有効期限: 24時間"
echo "✅ MFA認証: 必須"
echo "✅ 暗号化: AES-256-GCM"
echo ""
echo "次のステップ:"
echo "1. VoiceDriveチームへEmail/Slack通知を確認"
echo "2. ワンタイムトークンの安全な共有"
echo "3. MFAコードの別チャネル送信"
echo ""
echo "VoiceDriveチーム側の取得コマンド:"
echo "npm run voicedrive-cli -- secrets retrieve $DELIVERY_ID"
echo ""
echo "================================================"