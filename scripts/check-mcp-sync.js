#!/usr/bin/env node

/**
 * MCPサーバー共有状況確認スクリプト
 * 使用方法: node scripts/check-mcp-sync.js
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

// 色付きコンソール出力
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// MCPサーバーステータス確認
async function checkMCPServer() {
  return new Promise((resolve) => {
    http.get('http://localhost:8080/api/status', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const status = JSON.parse(data);
          resolve(status);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

// 共有ファイルの確認
function checkSharedFiles() {
  const sharedDir = path.join(__dirname, '..', 'mcp-shared');
  const files = {
    config: [],
    interfaces: [],
    api: []
  };

  if (fs.existsSync(sharedDir)) {
    // config フォルダ
    const configDir = path.join(sharedDir, 'config');
    if (fs.existsSync(configDir)) {
      files.config = fs.readdirSync(configDir);
    }

    // interfaces フォルダ
    const interfacesDir = path.join(sharedDir, 'interfaces');
    if (fs.existsSync(interfacesDir)) {
      files.interfaces = fs.readdirSync(interfacesDir);
    }

    // api フォルダ
    const apiDir = path.join(sharedDir, 'api');
    if (fs.existsSync(apiDir)) {
      files.api = fs.readdirSync(apiDir);
    }
  }

  return files;
}

// 同期状態の確認
function checkSyncStatus() {
  const syncStatusPath = path.join(__dirname, '..', 'mcp-shared', 'sync-status.json');
  
  if (fs.existsSync(syncStatusPath)) {
    const content = fs.readFileSync(syncStatusPath, 'utf8');
    return JSON.parse(content);
  }
  
  return null;
}

// VoiceDrive側のファイル確認
function checkVoiceDriveFiles() {
  const voiceDrivePath = path.join(__dirname, '..', '..', 'voicedrive-v100', 'mcp-shared');
  
  if (fs.existsSync(voiceDrivePath)) {
    return {
      exists: true,
      files: fs.readdirSync(voiceDrivePath)
    };
  }
  
  return { exists: false, files: [] };
}

// メイン処理
async function main() {
  console.log(`${colors.cyan}════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}     MCPサーバー共有状況確認ツール${colors.reset}`);
  console.log(`${colors.cyan}════════════════════════════════════════════════════════${colors.reset}\n`);

  // 1. MCPサーバーステータス
  console.log(`${colors.blue}[1] MCPサーバーステータス${colors.reset}`);
  const mcpStatus = await checkMCPServer();
  
  if (mcpStatus) {
    console.log(`  ${colors.green}✓${colors.reset} MCPサーバー: 稼働中`);
    console.log(`  ${colors.green}✓${colors.reset} 医療システム: ${mcpStatus.services.medical.status}`);
    console.log(`  ${colors.green}✓${colors.reset} VoiceDrive: ${mcpStatus.services.voicedrive.status}`);
  } else {
    console.log(`  ${colors.red}✗${colors.reset} MCPサーバー: 接続できません`);
  }
  console.log();

  // 2. 共有ファイルの確認
  console.log(`${colors.blue}[2] 共有ファイル（mcp-shared）${colors.reset}`);
  const sharedFiles = checkSharedFiles();
  
  console.log(`  ${colors.yellow}📁 config/${colors.reset}`);
  sharedFiles.config.forEach(file => {
    console.log(`    ${colors.green}✓${colors.reset} ${file}`);
  });
  
  console.log(`  ${colors.yellow}📁 interfaces/${colors.reset}`);
  sharedFiles.interfaces.forEach(file => {
    console.log(`    ${colors.green}✓${colors.reset} ${file}`);
  });
  
  console.log(`  ${colors.yellow}📁 api/${colors.reset}`);
  sharedFiles.api.forEach(file => {
    console.log(`    ${colors.green}✓${colors.reset} ${file}`);
  });
  console.log();

  // 3. 同期ステータス
  console.log(`${colors.blue}[3] 同期ステータス${colors.reset}`);
  const syncStatus = checkSyncStatus();
  
  if (syncStatus) {
    console.log(`  最終同期: ${syncStatus.lastSync}`);
    console.log(`  成功: ${colors.green}${syncStatus.successfulSyncs}${colors.reset} / 保留: ${colors.yellow}${syncStatus.pendingSyncs}${colors.reset} / 失敗: ${colors.red}${syncStatus.failedSyncs}${colors.reset}`);
    console.log(`  次回同期: ${syncStatus.nextSyncScheduled}`);
  } else {
    console.log(`  ${colors.yellow}⚠${colors.reset} 同期ステータスファイルが見つかりません`);
  }
  console.log();

  // 4. VoiceDrive側の確認
  console.log(`${colors.blue}[4] VoiceDrive側の共有状況${colors.reset}`);
  const voiceDriveFiles = checkVoiceDriveFiles();
  
  if (voiceDriveFiles.exists) {
    console.log(`  ${colors.green}✓${colors.reset} VoiceDrive側にmcp-sharedフォルダが存在`);
    voiceDriveFiles.files.forEach(file => {
      console.log(`    - ${file}`);
    });
  } else {
    console.log(`  ${colors.yellow}⚠${colors.reset} VoiceDrive側にmcp-sharedフォルダが見つかりません`);
    console.log(`  ${colors.cyan}→ MCPサーバー経由で自動作成される予定${colors.reset}`);
  }
  console.log();

  // 5. 推奨アクション
  console.log(`${colors.blue}[5] 推奨アクション${colors.reset}`);
  
  if (!mcpStatus) {
    console.log(`  ${colors.yellow}!${colors.reset} MCPサーバーを起動してください:`);
    console.log(`    ${colors.cyan}cd ../voicedrive-v100/mcp-integration-server && npm run dev${colors.reset}`);
  }
  
  if (sharedFiles.config.length === 0) {
    console.log(`  ${colors.yellow}!${colors.reset} 設定ファイルを共有フォルダにコピーしてください:`);
    console.log(`    ${colors.cyan}npm run sync:config${colors.reset}`);
  }
  
  if (!voiceDriveFiles.exists) {
    console.log(`  ${colors.yellow}!${colors.reset} VoiceDrive側で同期を実行してください:`);
    console.log(`    ${colors.cyan}cd ../voicedrive-v100 && npm run mcp:sync${colors.reset}`);
  }

  console.log(`\n${colors.cyan}════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.green}確認完了！${colors.reset}`);
}

// 実行
main().catch(console.error);