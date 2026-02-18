import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Lô Tô Đầu Xuân 🎤 | Tết Countdown',
    description: 'Tham gia sảnh Lô Tô online, mua vé săn Jackpot siêu khủng đầu năm!',
};

export default function LotoLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}