import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Lịch Sử Cược Bầu Cua 🎲 | Tết Countdown',
    description: 'Xem lại lịch sử các ván cược Bầu Cua Tôm Cá, kiểm tra vận may và số xu bạn đã nhận được.',
};

export default function BauCuaHistoryLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}