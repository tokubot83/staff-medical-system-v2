import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');
  const filePath = searchParams.get('path');

  if (!type || !['saved', 'mcp'].includes(type)) {
    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  }

  if (!filePath) {
    return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
  }

  const basePath = type === 'saved'
    ? path.join(process.cwd(), 'docs')
    : path.join(process.cwd(), 'mcp-shared', 'docs');

  const fullPath = path.join(basePath, filePath);

  // Security check: ensure the path doesn't escape the base directory
  if (!fullPath.startsWith(basePath)) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 403 });
  }

  try {
    const fileBuffer = await fs.readFile(fullPath);
    const fileName = path.basename(filePath);
    const fileExt = path.extname(filePath).toLowerCase();

    // Determine content type
    let contentType = 'application/octet-stream';
    if (fileExt === '.pdf') contentType = 'application/pdf';
    else if (fileExt === '.md') contentType = 'text/markdown';
    else if (fileExt === '.txt') contentType = 'text/plain';
    else if (fileExt === '.json') contentType = 'application/json';
    else if (fileExt === '.log') contentType = 'text/plain';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
  }
}