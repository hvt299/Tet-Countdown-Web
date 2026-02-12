import Image from 'next/image';
import TetCountdown from '@/components/TetCountdown';
import TetSound from '@/components/TetSound';

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden font-sans">

      {/* 1. BACKGROUND IMAGE */}
      {/* Bạn có thể tải ảnh về folder public/bg-tet.jpg và đổi src="/bg-tet.jpg" */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg-tet.png"
          alt="Tet Background"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* 2. OVERLAY (Lớp phủ tối màu đỏ mận để làm nổi chữ) */}
      <div className="absolute inset-0 z-10 bg-linear-to-b from-red-900/70 via-black/40 to-red-900/80"></div>

      <TetSound />

      {/* 3. NỘI DUNG CHÍNH */}
      {/* Component đếm ngược đã có z-index cao hơn overlay bên trong nó */}
      <TetCountdown />

      {/* Footer nhỏ */}
      <footer className="absolute bottom-4 z-20 text-white/50 text-xs md:text-sm">
        <p>© {new Date().getFullYear()} Developed by Mr.T • Happy Lunar New Year</p>
      </footer>
    </main>
  );
}