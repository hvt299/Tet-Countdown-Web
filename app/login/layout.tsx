import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Đăng Nhập | Tết Countdown',
    description: 'Đăng nhập ngay để tham gia hái lộc, xin chữ Ông Đồ AI và trải nghiệm các trò chơi dân gian mừng Xuân mới!',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}