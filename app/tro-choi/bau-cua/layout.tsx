import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Bầu Cua Tôm Cá 🎲 | Tết Countdown',
    description: 'Tham gia sòng Bầu Cua Tôm Cá online, thử vận may đầu năm cùng mọi người!',
};

export default function BauCuaLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}