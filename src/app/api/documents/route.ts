import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getFileModifiedDate, shouldUseMappedDates } from '@/lib/file-dates';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');

  if (!type || !['saved', 'mcp'].includes(type)) {
    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  }

  const docsPath = type === 'saved'
    ? path.join(process.cwd(), 'docs')
    : path.join(process.cwd(), 'mcp-shared', 'docs');

  try {
    const files = await getDocumentFiles(docsPath);

    // キャッシュ無効化のためのヘッダーを追加
    return NextResponse.json(
      { files },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  } catch (error) {
    console.error('Error reading documents:', error);
    return NextResponse.json({ error: 'Failed to read documents' }, { status: 500 });
  }
}

async function getDocumentFiles(dirPath: string): Promise<any[]> {
  const files: any[] = [];

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // Skip certain directories
        if (['backup-evaluation-sheets', 'interview-sheets', 'v2_interview-sheets', 'v3_interview-sheets', 'v4_interview', 'v3_evaluation-sheets', 'v4_evaluation-sheets'].includes(entry.name)) {
          continue;
        }

        // Recursively get files from subdirectories
        const subFiles = await getDocumentFiles(fullPath);
        files.push(...subFiles.map(f => ({
          ...f,
          path: path.join(entry.name, f.path || f.name).replace(/\\/g, '/')
        })));
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (['.md', '.pdf', '.txt', '.json'].includes(ext)) {
          const stats = await fs.stat(fullPath);

          // Vercel環境では手動マッピングから日付を取得
          const modifiedDate = shouldUseMappedDates()
            ? getFileModifiedDate(entry.name, stats.mtime)
            : stats.mtime;

          files.push({
            name: entry.name,
            path: entry.name,
            type: ext.substring(1),
            size: stats.size,
            modified: modifiedDate,
            created: stats.ctime
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }

  // Sort by modified date (newest first)
  files.sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());

  return files;
}