import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Lịch Sử Mua Vé Lô Tô 🎟️ | Tết Countdown',
    description: 'Xem lại lịch sử các tờ vé Lô Tô bạn đã mua, tra cứu mã phiên và các con số may mắn.',
};

export default function LotoHistoryLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}