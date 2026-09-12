import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "신포 장보기 지도 — 신포국제시장",
  description:
    "미로 같은 신포국제시장에서 메뉴를 고르면 파는 집과 재료 가게를 지도에 짚어주는 서비스.",
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
