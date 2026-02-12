import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin", "vietnamese"], variable: '--font-serif' });

export const metadata: Metadata = {
  title: "Tết Countdown",
  description: "Cùng đếm ngược đến khoảnh khắc giao thừa thiêng liêng",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.className} ${playfair.variable}`}>{children}</body>
    </html>
  );
}