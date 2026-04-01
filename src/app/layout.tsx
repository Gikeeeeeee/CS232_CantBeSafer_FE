import type { Metadata } from "next";
import { Inter } from "next/font/google"; // เปลี่ยนเป็น Inter ที่ดู Formal กว่า
import "./globals.css";

// ตั้งค่า Font Inter
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "My Application", // เปลี่ยนชื่อ App ให้ดูดีขึ้น
  description: "Modern Dashboard Solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body 
        className={`${inter.className} min-h-full flex flex-col bg-white text-gray-900`}
        style={{ backgroundColor: '#FFFFFF' }} // ล็อคสีขาวล้วนแบบชัวร์ๆ
      >
        {children}
      </body>
    </html>
  );
}