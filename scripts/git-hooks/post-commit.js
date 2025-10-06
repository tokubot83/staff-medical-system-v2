#!/usr/bin/env node
/**
 * Git post-commit hook
 * 自動的にコミット情報を開発者監査ログに記録
 *
 * インストール方法:
 * node scripts/git-hooks/install.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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
    // 最新のコミット情報を取得
    const commitHash = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
    const author = execSync('git log -1 --pretty=format:"%an <%ae>"', { encoding: 'utf-8' }).trim();
    const commitMessage = execSync('git log -1 --pretty=format:"%B"', { encoding: 'utf-8' }).trim();

    // 変更ファイル情報を取得
    const stats = execSync('git diff --stat HEAD~1..HEAD', { encoding: 'utf-8' });
    const filesChanged = execSync('git diff --name-only HEAD~1..HEAD', { encoding: 'utf-8' })
      .trim()
      .split('\n')
      .filter(f => f.length > 0);

    // 追加・削除行数を取得
    const numstat = execSync('git diff --numstat HEAD~1..HEAD', { encoding: 'utf-8' });
    let linesAdded = 0;
    let linesDeleted = 0;

    numstat.split('\n').forEach(line => {
      const parts = line.split('\t');
      if (parts.length >= 2) {
        linesAdded += parseInt(parts[0]) || 0;
        linesDeleted += parseInt(parts[1]) || 0;
      }
    });

    return {
      commitHash,
      branch,
      author,
      commitMessage,
      filesChanged,
      linesAdded,
      linesDeleted,
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
  // Git設定から操作者情報を取得
  const gitName = execSync('git config user.name', { encoding: 'utf-8' }).trim();
  const gitEmail = execSync('git config user.email', { encoding: 'utf-8' }).trim();

  // 操作者IDは環境変数またはGitユーザー名
  const operatorId = process.env.GIT_OPERATOR_ID || gitEmail.split('@')[0];

  return {
    operatorId,
    operatorName: gitName,
    operatorEmail: gitEmail,
    operatorLevel: 99, // デフォルトはLevel 99
  };
}

// ================================================================================
// 監査ログ送信
// ================================================================================

async function logCommit(gitInfo, operatorInfo) {
  if (!API_KEY) {
    console.log('⚠️  SYSTEM_ADMIN_API_KEYが設定されていないため、監査ログを記録できません');
    return;
  }

  const payload = {
    operatorId: operatorInfo.operatorId,
    operatorName: operatorInfo.operatorName,
    operatorEmail: operatorInfo.operatorEmail,
    operatorLevel: operatorInfo.operatorLevel,
    operationType: 'git_commit',
    operationCategory: 'development',
    operationSummary: `Git commit: ${gitInfo.commitMessage.split('\n')[0].substring(0, 100)}`,
    operationReason: gitInfo.commitMessage,
    gitCommitHash: gitInfo.commitHash,
    gitBranch: gitInfo.branch,
    gitAuthor: gitInfo.author,
    gitCommitMessage: gitInfo.commitMessage,
    filesChanged: gitInfo.filesChanged,
    linesAdded: gitInfo.linesAdded,
    linesDeleted: gitInfo.linesDeleted,
    riskLevel: 'low',
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
      console.log('✅ コミット情報を監査ログに記録しました');
    } else {
      const error = await response.json();
      console.warn('⚠️  監査ログの記録に失敗しました:', error.message);
    }
  } catch (error) {
    console.warn('⚠️  監査ログAPIへの接続に失敗しました:', error.message);
    // エラーでもコミットは成功させる
  }
}

// ================================================================================
// メイン処理
// ================================================================================

async function main() {
  console.log('📝 Git post-commit hook: コミット情報を記録中...');

  const gitInfo = getGitInfo();
  if (!gitInfo) {
    console.warn('⚠️  Git情報の取得に失敗したため、監査ログを記録できませんでした');
    process.exit(0);
  }

  const operatorInfo = getOperatorInfo();

  await logCommit(gitInfo, operatorInfo);
}

// Node.js 18+ (fetch API available)
if (typeof fetch === 'undefined') {
  console.warn('⚠️  Node.js 18以上が必要です。監査ログを記録できません。');
  process.exit(0);
}

main().catch(error => {
  console.error('❌ post-commit hookでエラーが発生しました:', error);
  // エラーでもコミットは成功させる
  process.exit(0);
});
