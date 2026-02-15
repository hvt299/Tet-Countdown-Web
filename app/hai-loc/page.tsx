import { Metadata } from 'next';
import LuckyTree from '@/components/LuckyTree';

export const metadata: Metadata = {
    title: 'Hái Lộc Đầu Xuân 🌳🧧 | Tết Countdown',
    description: 'Cùng hái lộc đầu xuân, rước tài lộc, may mắn và nhận những câu chúc ý nghĩa nhất cho năm mới!',
};

export default function HaiLocPage() {
    return (
        <main className="min-h-screen bg-red-900">
            <LuckyTree />
        </main>
    );
}