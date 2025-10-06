#!/usr/bin/env node

/**
 * アクセス制御CLI
 * VSCode/Claude Code経由でアクセス制御設定を操作するためのスクリプト
 *
 * 使用方法:
 *   node scripts/access-control-cli.js list
 *   node scripts/access-control-cli.js get evaluation
 *   node scripts/access-control-cli.js update evaluation --minLevel=14 --reason="Level 14に開放"
 *   node scripts/access-control-cli.js history
 *
 * 環境変数:
 *   SYSTEM_ADMIN_API_KEY: システム管理者API Key（必須）
 *   API_BASE_URL: APIベースURL（デフォルト: http://localhost:3000）
 */

const https = require('https');
const http = require('http');

// ================================================================================
// 設定
// ================================================================================

const API_KEY = process.env.SYSTEM_ADMIN_API_KEY;
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

if (!API_KEY) {
  console.error('❌ エラー: 環境変数 SYSTEM_ADMIN_API_KEY が設定されていません');
  console.error('');
  console.error('設定方法:');
  console.error('  export SYSTEM_ADMIN_API_KEY="your-api-key-here"');
  console.error('  または');
  console.error('  .env ファイルに SYSTEM_ADMIN_API_KEY="your-api-key-here" を追加');
  process.exit(1);
}

// ================================================================================
// HTTPリクエストヘルパー
// ================================================================================

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE_URL);
    const client = url.protocol === 'https:' ? https : http;

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
    };

    const req = client.request(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode}: ${jsonData.error || data}`));
          } else {
            resolve(jsonData);
          }
        } catch (error) {
          reject(new Error(`JSON解析エラー: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

// ================================================================================
// コマンド実装
// ================================================================================

async function listConfigs(type = null) {
  console.log('📋 アクセス制御設定一覧を取得中...\n');

  const query = type ? `?type=${type}` : '';
  const response = await request('GET', `/api/admin/access-control${query}`);

  if (!response.success) {
    throw new Error(response.error);
  }

  console.log(`✅ 取得成功: ${response.count}件`);
  console.log(`モード: ${response.mode === 'mock' ? 'モック（DB構築前）' : 'データベース'}\n`);

  // テーブル形式で表示
  console.log('┌────────────────────────┬──────────┬────────────┬──────────┐');
  console.log('│ リソースID              │ カテゴリ │ 最小レベル │ 特別権限 │');
  console.log('├────────────────────────┼──────────┼────────────┼──────────┤');

  for (const config of response.data) {
    const resourceId = config.resourceId.padEnd(24).substring(0, 24);
    const category = (config.category || '-').padEnd(10).substring(0, 10);
    const minLevel = String(config.minLevel).padStart(12);
    const special = config.specialAuthority ? '    ✓   ' : '    -   ';

    console.log(`│ ${resourceId}│ ${category}│ ${minLevel}│ ${special}│`);
  }

  console.log('└────────────────────────┴──────────┴────────────┴──────────┘');
}

async function getConfig(resourceId) {
  console.log(`🔍 リソース "${resourceId}" の設定を取得中...\n`);

  const response = await request('GET', `/api/admin/access-control/${resourceId}`);

  if (!response.success) {
    throw new Error(response.error);
  }

  const config = response.data;

  console.log('✅ 取得成功\n');
  console.log(`リソースID: ${config.resourceId}`);
  console.log(`リソース名: ${config.resourceName}`);
  console.log(`カテゴリ: ${config.category || '-'}`);
  console.log(`最小レベル: ${config.minLevel}`);
  console.log(`特別権限: ${config.specialAuthority ? 'あり（健診・産業医専用）' : 'なし'}`);
  console.log(`担当者制限: ${config.requiresAssignment ? 'あり' : 'なし'}`);
  console.log(`説明: ${config.description || '-'}`);
  console.log(`\n推奨レベル: ${config.recommendedMinLevel || '-'}`);
  console.log(`推奨理由: ${config.recommendedReason || '-'}`);
  console.log(`\n最終更新: ${new Date(config.updatedAt).toLocaleString('ja-JP')}`);
  console.log(`更新者: ${config.updatedBy || '-'}`);
}

async function updateConfig(resourceId, options) {
  console.log(`✏️  リソース "${resourceId}" の設定を更新中...\n`);

  const body = {
    changeReason: options.reason,
    changedBy: options.changedBy || 'CLI_USER',
    changedByName: options.changedByName,
  };

  if (options.minLevel !== undefined) {
    body.minLevel = parseFloat(options.minLevel);
    console.log(`  最小レベル: ${body.minLevel}`);
  }

  if (options.specialAuthority !== undefined) {
    body.specialAuthority = options.specialAuthority === 'true';
    console.log(`  特別権限: ${body.specialAuthority}`);
  }

  if (options.requiresAssignment !== undefined) {
    body.requiresAssignment = options.requiresAssignment === 'true';
    console.log(`  担当者制限: ${body.requiresAssignment}`);
  }

  if (options.description) {
    body.description = options.description;
    console.log(`  説明: ${body.description}`);
  }

  console.log(`  変更理由: ${body.changeReason}\n`);

  const response = await request('PUT', `/api/admin/access-control/${resourceId}`, body);

  if (!response.success) {
    throw new Error(response.error);
  }

  console.log('✅ 更新成功');
  console.log(`モード: ${response.mode === 'mock' ? 'モック（DB構築前）' : 'データベース'}`);

  if (response.warning) {
    console.log(`⚠️  ${response.warning}`);
  }
}

async function showHistory(resourceId = null, limit = 20) {
  console.log('📜 変更履歴を取得中...\n');

  const query = resourceId ? `?resourceId=${resourceId}&limit=${limit}` : `?limit=${limit}`;
  const response = await request('GET', `/api/admin/access-control/change-log${query}`);

  if (!response.success) {
    throw new Error(response.error);
  }

  console.log(`✅ 取得成功: ${response.count}件\n`);

  for (const log of response.data) {
    console.log(`─────────────────────────────────────────────────────────`);
    console.log(`変更日時: ${new Date(log.changedAt).toLocaleString('ja-JP')}`);
    console.log(`リソース: ${log.resourceName} (${log.resourceId})`);
    console.log(`フィールド: ${log.fieldName}`);
    console.log(`変更: ${log.oldValue} → ${log.newValue}`);
    console.log(`理由: ${log.changeReason}`);
    console.log(`変更者: ${log.changedByName || log.changedBy} (Level ${log.changedByLevel || '-'})`);

    if (log.isDeviationFromRecommended) {
      console.log(`⚠️  推奨設定からの逸脱`);
    }
  }

  console.log(`─────────────────────────────────────────────────────────`);
}

// ================================================================================
// コマンドラインパーサー
// ================================================================================

function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    return { command: 'help' };
  }

  const command = args[0];
  const parsed = { command };

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith('--')) {
      const [key, value] = arg.substring(2).split('=');
      parsed[key] = value || true;
    } else {
      parsed.target = arg;
    }
  }

  return parsed;
}

function showHelp() {
  console.log(`
アクセス制御CLI - システム管理者用ツール

使用方法:
  node scripts/access-control-cli.js <command> [options]

コマンド:
  list [type]               全アクセス制御設定を一覧表示
                            type: tab, page, feature, data

  get <resourceId>          特定リソースの設定を表示

  update <resourceId>       リソースの設定を更新
    --minLevel=<number>     最小レベルを変更
    --reason="<text>"       変更理由（必須、10文字以上）
    --changedBy="<name>"    変更者名（オプション）

  history [resourceId]      変更履歴を表示
    --limit=<number>        表示件数（デフォルト: 20）

  help                      このヘルプを表示

例:
  # 全タブ設定を表示
  node scripts/access-control-cli.js list tab

  # 評価履歴タブの設定を表示
  node scripts/access-control-cli.js get evaluation-history

  # 評価タブをLevel 14に開放
  node scripts/access-control-cli.js update evaluation \\
    --minLevel=14 \\
    --reason="Level 14の人数が増えたため、評価タブも開放"

  # 変更履歴を表示
  node scripts/access-control-cli.js history --limit=50

環境変数:
  SYSTEM_ADMIN_API_KEY      システム管理者API Key（必須）
  API_BASE_URL              APIベースURL（デフォルト: http://localhost:3000）
`);
}

// ================================================================================
// メイン処理
// ================================================================================

async function main() {
  const args = parseArgs();

  try {
    switch (args.command) {
      case 'list':
        await listConfigs(args.target);
        break;

      case 'get':
        if (!args.target) {
          console.error('❌ エラー: resourceId を指定してください');
          process.exit(1);
        }
        await getConfig(args.target);
        break;

      case 'update':
        if (!args.target) {
          console.error('❌ エラー: resourceId を指定してください');
          process.exit(1);
        }
        if (!args.reason) {
          console.error('❌ エラー: --reason オプションは必須です');
          process.exit(1);
        }
        await updateConfig(args.target, args);
        break;

      case 'history':
        await showHistory(args.target, parseInt(args.limit || '20'));
        break;

      case 'help':
      default:
        showHelp();
        break;
    }
  } catch (error) {
    console.error(`\n❌ エラー: ${error.message}`);
    process.exit(1);
  }
}

main();
