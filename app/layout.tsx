import type { Metadata, Viewport } from "next";
import { Geist, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Internship Countdown",
  description: "นับถอยหลังสู่วันสุดท้ายของการฝึกงาน 30 ตุลาคม 2026",
  icons: { icon: "/favicon.svg" },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#06070a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${geist.variable} ${notoSansThai.variable}`}>
      <body className="antialiased bg-background text-text-primary min-h-screen">
        {children}
      </body>
    </html>
  );
}
