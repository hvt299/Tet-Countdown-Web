import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Xin Chữ Ông Đồ AI 📜🖋️ | Tết Countdown',
    description: 'Thành tâm xin chữ đầu năm, nhận ngay bức thư pháp tuyệt đẹp và lời chúc ý nghĩa mang đậm linh khí đất trời từ Ông Đồ AI.',
};

export default function XinChuLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}