import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Xác Thực Tài Khoản | Tết Countdown',
    description: 'Xác thực email để nhận huy hiệu tích xanh và bảo vệ tài khoản Tết Countdown của bạn.',
};

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}