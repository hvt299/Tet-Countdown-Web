import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Hồ Sơ Cá Nhân 🏮 | Tết Countdown',
    description: 'Quản lý thông tin cá nhân, cập nhật mật khẩu và xem lại tổng số Xu Lộc may mắn của bạn.',
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}