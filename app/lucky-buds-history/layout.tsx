import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Lịch Sử Hái Lộc 🌳 | Tết Countdown',
    description: 'Kiểm tra túi lộc của bạn, xem lại những đồng xu may mắn và lời chúc tốt đẹp đã hái được từ Cây Lộc đầu Xuân.',
};

export default function LuckyBudsHistoryLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}