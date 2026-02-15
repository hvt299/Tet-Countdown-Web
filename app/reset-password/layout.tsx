import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Đặt Lại Mật Khẩu | Tết Countdown',
    description: 'Thiết lập mật khẩu mới an toàn cho tài khoản của bạn.',
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}