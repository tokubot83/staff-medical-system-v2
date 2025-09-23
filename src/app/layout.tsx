import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { SmartSuggest } from "@/components/navigation/SmartSuggest";
import MainLayout from "@/components/layout/MainLayout";
import { EvaluationVersionProvider } from "@/contexts/EvaluationVersionContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "職員カルテシステム",
  description: "医療法人厚生会",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "職員カルテシステム",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#0070f3",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <EvaluationVersionProvider>
          <MainLayout>
            {children}
          </MainLayout>
          <SmartSuggest />
        </EvaluationVersionProvider>
      </body>
    </html>
  );
}
