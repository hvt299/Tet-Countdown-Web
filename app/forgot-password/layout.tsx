import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Quên Mật Khẩu | Tết Countdown',
    description: 'Khôi phục mật khẩu tài khoản Tết Countdown của bạn để tiếp tục trẩy hội Xuân.',
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}