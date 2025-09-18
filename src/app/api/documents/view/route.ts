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
    const fileContent = await fs.readFile(fullPath, 'utf-8');
    const fileExt = path.extname(filePath).toLowerCase();

    // For Markdown files, return as HTML with styling
    if (fileExt === '.md') {
      const html = `
        <!DOCTYPE html>
        <html lang="ja">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${path.basename(filePath)}</title>
          <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 900px;
              margin: 0 auto;
              padding: 20px;
              background: #f5f5f5;
            }
            .container {
              background: white;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            h1, h2, h3, h4, h5, h6 {
              margin-top: 24px;
              margin-bottom: 16px;
              font-weight: 600;
              line-height: 1.25;
            }
            h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
            h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
            h3 { font-size: 1.25em; }
            code {
              background-color: #f6f8fa;
              padding: 0.2em 0.4em;
              border-radius: 3px;
              font-size: 85%;
            }
            pre {
              background-color: #f6f8fa;
              padding: 16px;
              overflow: auto;
              border-radius: 6px;
            }
            pre code {
              background-color: transparent;
              padding: 0;
            }
            blockquote {
              padding: 0 1em;
              color: #6a737d;
              border-left: 0.25em solid #dfe2e5;
              margin: 16px 0;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin: 16px 0;
            }
            table th, table td {
              padding: 6px 13px;
              border: 1px solid #dfe2e5;
            }
            table th {
              background-color: #f6f8fa;
              font-weight: 600;
            }
            ul, ol {
              padding-left: 2em;
              margin: 16px 0;
            }
            li {
              margin: 4px 0;
            }
            a {
              color: #0366d6;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div id="content"></div>
          </div>
          <script>
            const markdown = ${JSON.stringify(fileContent)};
            document.getElementById('content').innerHTML = marked.parse(markdown);
          </script>
        </body>
        </html>
      `;
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }

    // For JSON files, return formatted JSON
    if (fileExt === '.json') {
      try {
        const jsonData = JSON.parse(fileContent);
        const html = `
          <!DOCTYPE html>
          <html lang="ja">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${path.basename(filePath)}</title>
            <style>
              body {
                font-family: 'Courier New', monospace;
                line-height: 1.6;
                color: #333;
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                background: #f5f5f5;
              }
              pre {
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                overflow-x: auto;
              }
            </style>
          </head>
          <body>
            <h1>${path.basename(filePath)}</h1>
            <pre>${JSON.stringify(jsonData, null, 2)}</pre>
          </body>
          </html>
        `;
        return new NextResponse(html, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
          },
        });
      } catch (e) {
        // If JSON is invalid, return as plain text
      }
    }

    // For text files, return as plain text with formatting
    if (fileExt === '.txt' || fileExt === '.log') {
      const html = `
        <!DOCTYPE html>
        <html lang="ja">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${path.basename(filePath)}</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              line-height: 1.6;
              color: #333;
              max-width: 1200px;
              margin: 0 auto;
              padding: 20px;
              background: #f5f5f5;
            }
            pre {
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              overflow-x: auto;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
          </style>
        </head>
        <body>
          <h1>${path.basename(filePath)}</h1>
          <pre>${fileContent}</pre>
        </body>
        </html>
      `;
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }

    // For PDF files, redirect to the file directly
    if (fileExt === '.pdf') {
      const fileBuffer = await fs.readFile(fullPath);
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${path.basename(filePath)}"`,
        },
      });
    }

    // Default: return as plain text
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });

  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 });
  }
}