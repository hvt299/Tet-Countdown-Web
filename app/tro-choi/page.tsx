'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Gamepad2, Lock } from 'lucide-react';
import { Solar } from 'lunar-javascript';

export default function GamesHubPage() {
    const router = useRouter();

    const [isBauCuaOpen, setIsBauCuaOpen] = useState(false);
    const [isLotoOpen, setIsLotoOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const now = new Date();
        const solar = Solar.fromYmd(now.getFullYear(), now.getMonth() + 1, now.getDate());
        const lunar = solar.getLunar();

        let isTetBauCua = lunar.getMonth() === 1 && lunar.getDay() >= 1 && lunar.getDay() <= 3;
        let isTetLoto = lunar.getMonth() === 1 && lunar.getDay() >= 4 && lunar.getDay() <= 6;

        setIsBauCuaOpen(isTetBauCua);
        setIsLotoOpen(isTetLoto);
        setMounted(true);
    }, []);

    return (
        <main className="relative min-h-screen flex items-center justify-center font-sans overflow-x-hidden py-10 px-4">
            {/* BACKGROUND CHUNG */}
            <div className="inset-0 z-[-2] fixed">
                <Image src="/images/bg-tet.png" alt="Tet Background" fill className="object-cover" priority />
            </div>
            <div className="inset-0 z-10 bg-linear-to-b from-red-900/80 via-black/50 to-red-900/90 fixed"></div>

            {/* CONTAINER CHÍNH */}
            <div className="relative z-20 w-full max-w-3xl bg-black/40 backdrop-blur-md border border-yellow-500/30 rounded-3xl shadow-2xl p-6 md:p-10 transition-all duration-500 animate-in fade-in zoom-in">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-red-800/50">
                    <button
                        onClick={() => router.push('/')}
                        className="text-yellow-500 hover:text-yellow-300 flex items-center gap-1 transition-colors text-sm font-medium focus:outline-none bg-red-950/50 px-3 py-1.5 rounded-full border border-red-800"
                    >
                        <ArrowLeft size={18} strokeWidth={2.5} />
                        <span className="hidden sm:inline">Trang Chủ</span>
                    </button>

                    <h1 className="text-xl md:text-3xl font-bold text-yellow-400 font-serif flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
                        <Gamepad2 className="text-yellow-500 hidden sm:block" size={28} />
                        Trò Chơi Dân Gian
                    </h1>
                </div>

                <div className="text-center mb-10">
                    <p className="text-red-200 text-base md:text-lg italic">
                        "Thử vận may đầu năm, rước tài lộc vào nhà!"
                    </p>
                    <p className="mt-2 text-sm text-yellow-500/80">
                        Chọn một sòng chơi để tham gia cùng hàng trăm người khác nhé.
                    </p>
                </div>

                {/* MENU TRÒ CHƠI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 px-2 md:px-8">

                    {/* BẦU CUA TÔM CÁ */}
                    <Link href="/tro-choi/bau-cua" className="group block">
                        <div className={`h-full backdrop-blur-sm border-2 rounded-2xl p-8 flex flex-col items-center text-center transform transition-all duration-300 
                            ${isBauCuaOpen
                                ? 'bg-red-900/60 border-yellow-500/50 hover:border-yellow-400 hover:-translate-y-2 hover:bg-red-800/80 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                                : 'bg-red-950/80 border-red-800/50 hover:-translate-y-1 hover:bg-red-900/80'}
                        `}>
                            <div className="text-6xl mb-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 drop-shadow-lg">🎲</div>
                            <h3 className={`text-2xl font-bold font-serif mb-2 ${isBauCuaOpen ? 'text-yellow-400' : 'text-yellow-600'}`}>
                                Bầu Cua Tôm Cá
                            </h3>
                            <p className="text-sm text-red-200 leading-relaxed">Sòng chơi náo nhiệt, tung xúc xắc và trả thưởng liên tục!</p>

                            {/* Nút Trạng thái động */}
                            {mounted && (
                                isBauCuaOpen ? (
                                    <div className="mt-5 px-4 py-1.5 bg-green-600/30 text-green-400 border border-green-500/50 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
                                        Đang mở sòng
                                    </div>
                                ) : (
                                    <div className="mt-5 px-4 py-1.5 bg-red-900/80 text-yellow-500/80 border border-red-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                        <Lock size={12} /> Đã đóng sòng
                                    </div>
                                )
                            )}
                        </div>
                    </Link>

                    {/* LÔ TÔ */}
                    <Link href="/tro-choi/loto" className="group block">
                        <div className={`h-full backdrop-blur-sm border-2 rounded-2xl p-8 flex flex-col items-center text-center transform transition-all duration-300 
                            ${isLotoOpen
                                ? 'bg-orange-900/60 border-yellow-500/50 hover:border-yellow-400 hover:-translate-y-2 hover:bg-orange-800/80 shadow-[0_0_15px_rgba(249,115,22,0.2)]'
                                : 'bg-orange-950/80 border-orange-800/50 hover:-translate-y-1 hover:bg-orange-900/80'}
                        `}>
                            <div className="text-6xl mb-4 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300 drop-shadow-lg">🎟️</div>
                            <h3 className={`text-2xl font-bold font-serif mb-2 ${isLotoOpen ? 'text-yellow-400' : 'text-yellow-600'}`}>
                                Lô Tô Đầu Xuân
                            </h3>
                            <p className="text-sm text-orange-200/80 leading-relaxed">Cùng dò số, kinh báo và rinh siêu lộc khủng về nhà!</p>

                            {/* Nút Trạng thái động Lô Tô */}
                            {mounted && (
                                isLotoOpen ? (
                                    <div className="mt-5 px-4 py-1.5 bg-green-600/30 text-green-400 border border-green-500/50 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
                                        Đang mở sòng
                                    </div>
                                ) : (
                                    <div className="mt-5 px-4 py-1.5 bg-orange-900/80 text-orange-400/80 border border-orange-800 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                        <Lock size={12} /> Đã đóng sòng
                                    </div>
                                )
                            )}
                        </div>
                    </Link>

                </div>
            </div>
        </main>
    );
}