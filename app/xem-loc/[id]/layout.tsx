import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Túi Lộc Đầu Xuân 🧧 | Tết Countdown',
    description: 'Cùng mở túi lộc đầu năm, chia sẻ niềm vui, sự may mắn và rước tài lộc về nhà!',
};

export default function PublicLuckyBudsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}