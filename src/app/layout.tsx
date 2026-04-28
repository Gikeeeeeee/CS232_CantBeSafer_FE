import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { InAppNotification } from "@/components/InAppNotification";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "CantBeSafer | Emergency Reporting System",
  description: "Modern Safety and Incident Reporting Solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
        {/* ส่วนประกอบที่อยู่เหนือเนื้อหาทั้งหมด */}
        <InAppNotification />

        <div className="flex flex-1 flex-col">
          {/* ส่วน Main Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>

        {/* สามารถใส่ Footer หรือ Bottom Navigation ตรงนี้ได้ในอนาคต */}
      </body>
    </html>
  );
}