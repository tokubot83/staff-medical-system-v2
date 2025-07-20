import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "職員カルテシステム",
  description: "医療法人厚生会",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {/* タイトルヘッダー */}
        <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center space-x-3">
              <span className="text-4xl">🏥</span>
              <div>
                <h1 className="text-2xl font-bold">職員カルテシステム</h1>
                <p className="text-sm text-blue-100">医療法人厚生会</p>
              </div>
            </div>
          </div>
        </header>

        {/* ナビゲーションバー */}
        <nav className="bg-gray-800 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center h-12">
              <div className="flex space-x-1">
                <Link href="/" className="hover:bg-gray-700 px-4 py-3 text-sm font-medium transition-colors border-b-3 border-transparent hover:border-blue-400">
                  ダッシュボード
                </Link>
                <Link href="/staff" className="hover:bg-gray-700 px-4 py-3 text-sm font-medium transition-colors border-b-3 border-transparent hover:border-blue-400">
                  職員カルテ
                </Link>
                <Link href="/metrics" className="hover:bg-gray-700 px-4 py-3 text-sm font-medium transition-colors border-b-3 border-transparent hover:border-blue-400">
                  メトリクス
                </Link>
                <Link href="/reports" className="hover:bg-gray-700 px-4 py-3 text-sm font-medium transition-colors border-b-3 border-transparent hover:border-blue-400">
                  レポート
                </Link>
                <Link href="/hr-strategy" className="hover:bg-gray-700 px-4 py-3 text-sm font-medium transition-colors border-b-3 border-transparent hover:border-blue-400 flex items-center gap-1">
                  <span>🎯</span>
                  <span>人材戦略</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>
        
        {children}
      </body>
    </html>
  );
}
