#!/usr/bin/env node
/**
 * Git pre-push hook
 * プッシュ情報を開発者監査ログに記録
 *
 * インストール方法:
 * node scripts/git-hooks/install.js
 */

const { execSync } = require('child_process');

// ================================================================================
// 設定
// ================================================================================

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_KEY = process.env.SYSTEM_ADMIN_API_KEY;

// フックの無効化フラグ（デバッグ用）
const DISABLE_HOOK = process.env.DISABLE_GIT_HOOK === 'true';

if (DISABLE_HOOK) {
  console.log('⚠️  Git hookは無効化されています（DISABLE_GIT_HOOK=true）');
  process.exit(0);
}

// ================================================================================
// Git情報取得
// ================================================================================

function getGitInfo() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();

    // プッシュされるコミット数を取得（origin/branchと比較）
    let commitCount = 0;
    try {
      const log = execSync(`git log origin/${branch}..HEAD --oneline`, { encoding: 'utf-8' });
      commitCount = log.trim().split('\n').filter(l => l.length > 0).length;
    } catch (error) {
      // 新しいブランチの場合は全コミット数を取得
      const log = execSync('git log --oneline', { encoding: 'utf-8' });
      commitCount = log.trim().split('\n').filter(l => l.length > 0).length;
    }

    return {
      branch,
      commitCount,
    };
  } catch (error) {
    console.error('❌ Git情報の取得に失敗しました:', error.message);
    return null;
  }
}

// ================================================================================
// 操作者情報取得
// ================================================================================

function getOperatorInfo() {
  const gitName = execSync('git config user.name', { encoding: 'utf-8' }).trim();
  const gitEmail = execSync('git config user.email', { encoding: 'utf-8' }).trim();

  const operatorId = process.env.GIT_OPERATOR_ID || gitEmail.split('@')[0];

  return {
    operatorId,
    operatorName: gitName,
    operatorEmail: gitEmail,
    operatorLevel: 99,
  };
}

// ================================================================================
// mainブランチへのプッシュ警告
// ================================================================================

function warnMainBranchPush(branch) {
  if (branch === 'main' || branch === 'master') {
    console.log('');
    console.log('⚠️  ========================================');
    console.log('⚠️  WARNING: mainブランチへのプッシュです');
    console.log('⚠️  ========================================');
    console.log('⚠️  本番環境に影響する可能性があります。');
    console.log('⚠️  プッシュを中止する場合は Ctrl+C を押してください。');
    console.log('⚠️  5秒後にプッシュを続行します...');
    console.log('');

    // 5秒待機
    execSync('sleep 5', { stdio: 'inherit' });
  }
}

// ================================================================================
// 監査ログ送信
// ================================================================================

async function logPush(gitInfo, operatorInfo) {
  if (!API_KEY) {
    console.log('⚠️  SYSTEM_ADMIN_API_KEYが設定されていないため、監査ログを記録できません');
    return;
  }

  const riskLevel = (gitInfo.branch === 'main' || gitInfo.branch === 'master') ? 'high' : 'medium';

  const payload = {
    operatorId: operatorInfo.operatorId,
    operatorName: operatorInfo.operatorName,
    operatorEmail: operatorInfo.operatorEmail,
    operatorLevel: operatorInfo.operatorLevel,
    operationType: 'git_push',
    operationCategory: 'development',
    operationSummary: `Git push to ${gitInfo.branch}: ${gitInfo.commitCount} commit(s)`,
    operationReason: `ブランチ ${gitInfo.branch} に ${gitInfo.commitCount} 件のコミットをプッシュ`,
    gitBranch: gitInfo.branch,
    affectedResources: [gitInfo.branch],
    riskLevel,
    executionMethod: 'vscode',
    environment: 'production',
  };

  try {
    const response = await fetch(`${API_ENDPOINT}/api/admin/developer-audit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log('✅ プッシュ情報を監査ログに記録しました');
    } else {
      const error = await response.json();
      console.warn('⚠️  監査ログの記録に失敗しました:', error.message);
    }
  } catch (error) {
    console.warn('⚠️  監査ログAPIへの接続に失敗しました:', error.message);
    // エラーでもプッシュは成功させる
  }
}

// ================================================================================
// メイン処理
// ================================================================================

async function main() {
  console.log('📝 Git pre-push hook: プッシュ情報を記録中...');

  const gitInfo = getGitInfo();
  if (!gitInfo) {
    console.warn('⚠️  Git情報の取得に失敗したため、監査ログを記録できませんでした');
    process.exit(0);
  }

  // mainブランチへのプッシュの場合は警告
  warnMainBranchPush(gitInfo.branch);

  const operatorInfo = getOperatorInfo();

  await logPush(gitInfo, operatorInfo);
}

// Node.js 18+ (fetch API available)
if (typeof fetch === 'undefined') {
  console.warn('⚠️  Node.js 18以上が必要です。監査ログを記録できません。');
  process.exit(0);
}

main().catch(error => {
  console.error('❌ pre-push hookでエラーが発生しました:', error);
  // エラーでもプッシュは成功させる
  process.exit(0);
});
