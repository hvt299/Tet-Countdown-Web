import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Trò Chơi Dân Gian 🎲 | Tết Countdown',
    description: 'Thử vận may đầu năm với các trò chơi dân gian truyền thống siêu hấp dẫn như Bầu Cua, Lô Tô cùng bạn bè.',
};

export default function GamesHubLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}