import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const docsPath = path.join(process.cwd(), 'docs');
    const mcpPath = path.join(process.cwd(), 'mcp-shared', 'docs');

    const [savedLatest, mcpLatest] = await Promise.all([
      getLatestModified(docsPath),
      getLatestModified(mcpPath)
    ]);

    return NextResponse.json({
      saved: savedLatest,
      mcp: mcpLatest
    });
  } catch (error) {
    console.error('Error getting latest dates:', error);
    return NextResponse.json({ error: 'Failed to get latest dates' }, { status: 500 });
  }
}

async function getLatestModified(dirPath: string): Promise<Date | null> {
  let latestDate: Date | null = null;

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // Skip certain directories
        if (['backup-evaluation-sheets', 'interview-sheets', 'v2_interview-sheets', 'v3_interview-sheets', 'v4_interview', 'v3_evaluation-sheets', 'v4_evaluation-sheets'].includes(entry.name)) {
          continue;
        }
        // Recursively check subdirectories
        const subLatest = await getLatestModified(fullPath);
        if (subLatest && (!latestDate || subLatest > latestDate)) {
          latestDate = subLatest;
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (['.md', '.pdf', '.txt', '.json'].includes(ext)) {
          const stats = await fs.stat(fullPath);
          const modifiedDate = new Date(stats.mtime);
          if (!latestDate || modifiedDate > latestDate) {
            latestDate = modifiedDate;
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }

  return latestDate;
}