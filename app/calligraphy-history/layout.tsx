import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Lịch Sử Xin Chữ 📜 | Tết Countdown',
    description: 'Xem lại cuốn sổ lưu trữ những bức thư pháp và lời chúc an lành bạn đã nhận được trong dịp đầu năm mới.',
};

export default function CalligraphyHistoryLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}