#!/usr/bin/env node
/**
 * Git hooks インストーラー
 * post-commit, pre-push フックを .git/hooks/ にインストール
 *
 * 使い方:
 * node scripts/git-hooks/install.js
 */

const fs = require('fs');
const path = require('path');

// ================================================================================
// 設定
// ================================================================================

const HOOKS_SOURCE_DIR = __dirname;
const HOOKS_TARGET_DIR = path.join(__dirname, '../../.git/hooks');

const HOOKS_TO_INSTALL = [
  {
    source: 'post-commit.js',
    target: 'post-commit',
    description: 'Gitコミット情報を自動記録',
  },
  {
    source: 'pre-push.js',
    target: 'pre-push',
    description: 'Gitプッシュ情報を自動記録（mainブランチ警告付き）',
  },
];

// ================================================================================
// インストール処理
// ================================================================================

function installHook(hookConfig) {
  const sourcePath = path.join(HOOKS_SOURCE_DIR, hookConfig.source);
  const targetPath = path.join(HOOKS_TARGET_DIR, hookConfig.target);

  console.log(`\n📦 ${hookConfig.target} をインストール中...`);
  console.log(`   説明: ${hookConfig.description}`);

  // ソースファイルの存在確認
  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ ソースファイルが見つかりません: ${sourcePath}`);
    return false;
  }

  // .git/hooks/ ディレクトリの存在確認
  if (!fs.existsSync(HOOKS_TARGET_DIR)) {
    console.error('❌ .git/hooks/ ディレクトリが見つかりません');
    console.error('   Gitリポジトリのルートディレクトリで実行してください');
    return false;
  }

  // 既存のフックをバックアップ
  if (fs.existsSync(targetPath)) {
    const backupPath = `${targetPath}.backup`;
    console.log(`   既存のフックをバックアップ: ${backupPath}`);
    fs.copyFileSync(targetPath, backupPath);
  }

  // フックファイルを作成
  const hookContent = `#!/usr/bin/env node
// Auto-generated git hook
// Source: scripts/git-hooks/${hookConfig.source}

require('${sourcePath}');
`;

  fs.writeFileSync(targetPath, hookContent, { mode: 0o755 });

  console.log(`✅ ${hookConfig.target} をインストールしました`);
  return true;
}

// ================================================================================
// メイン処理
// ================================================================================

function main() {
  console.log('================================================================================');
  console.log('Git Hooks インストーラー');
  console.log('Level 99 開発者監査ログ自動記録');
  console.log('================================================================================');

  let successCount = 0;
  let failCount = 0;

  for (const hookConfig of HOOKS_TO_INSTALL) {
    if (installHook(hookConfig)) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log('\n================================================================================');
  console.log(`インストール完了: ${successCount} 成功, ${failCount} 失敗`);
  console.log('================================================================================');

  if (successCount > 0) {
    console.log('\n✅ Git hooksのインストールに成功しました！');
    console.log('\n次回のコミット/プッシュから、自動的に監査ログに記録されます。');
    console.log('\n環境変数の設定:');
    console.log('  SYSTEM_ADMIN_API_KEY: 監査ログAPIキー（必須）');
    console.log('  GIT_OPERATOR_ID: 操作者ID（オプション、デフォルトはGitのメールアドレス）');
    console.log('  DISABLE_GIT_HOOK: true に設定するとフックを無効化（デバッグ用）');
    console.log('\n例:');
    console.log('  export SYSTEM_ADMIN_API_KEY="your-api-key"');
    console.log('  export GIT_OPERATOR_ID="admin_001"');
  }

  if (failCount > 0) {
    console.log('\n⚠️  一部のフックのインストールに失敗しました。');
    console.log('   上記のエラーメッセージを確認してください。');
    process.exit(1);
  }
}

main();
