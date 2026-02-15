import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Bức Thư Pháp May Mắn 📜 | Tết Countdown',
    description: 'Cùng chiêm ngưỡng bức thư pháp đầu Xuân và những dòng thơ mang ý nghĩa sâu sắc được chắp bút bởi Ông Đồ AI.',
};

export default function PublicCalligraphyLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}