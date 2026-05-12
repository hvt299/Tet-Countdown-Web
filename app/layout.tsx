import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import TetSound from "@/components/TetSound";
import FallingFlowers from "@/components/FallingFlowers";
import { GoogleOAuthProvider } from '@react-oauth/google';

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
      <body className={`${inter.className} ${playfair.variable}`}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          <FallingFlowers />
          <TetSound />
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}