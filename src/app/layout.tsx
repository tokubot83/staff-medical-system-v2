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
        <nav className="bg-gray-800 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link href="/" className="flex items-center space-x-2">
                  <span className="text-2xl">🏥</span>
                  <span className="font-semibold text-lg">職員カルテシステム</span>
                </Link>
                <div className="hidden md:flex space-x-6">
                  <Link href="/" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    ダッシュボード
                  </Link>
                  <Link href="/staff" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    職員カルテ
                  </Link>
                  <Link href="/metrics" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    メトリクス
                  </Link>
                  <Link href="/reports" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    レポート
                  </Link>
                  <Link href="/hr-strategy" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1">
                    <span>🎯</span>
                    <span>人材戦略</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
