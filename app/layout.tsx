import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent Field Trip 2026: Incheon",
  description: "현장에서 발견한 장소 경험을 Agent와 함께 작동하는 서비스로.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
