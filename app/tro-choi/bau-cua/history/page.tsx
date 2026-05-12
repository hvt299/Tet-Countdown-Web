'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { ArrowLeft, History, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCoins } from '@/utils/tetHelper';

const ANIMAL_ICONS: Record<string, { icon: string, name: string }> = {
    nai: { icon: '🦌', name: 'Nai' }, bau: { icon: '🥒', name: 'Bầu' },
    ga: { icon: '🐓', name: 'Gà' }, ca: { icon: '🐟', name: 'Cá' },
    cua: { icon: '🦀', name: 'Cua' }, tom: { icon: '🦐', name: 'Tôm' }
};

export default function BauCuaHistoryPage() {
    const router = useRouter();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const token = document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
            if (!token) return router.push('/login');

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            try {
                const response = await axios.get(`${API_URL}/bau-cua/history`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setHistory(response.data);
            } catch (error) {
                console.error('Lỗi lấy lịch sử:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [router]);

    return (
        <main className="relative min-h-screen flex flex-col font-sans overflow-x-hidden py-10 px-4 md:px-8">
            <div className="inset-0 z-[-2] fixed">
                            <Image src="/images/bg-tet.png" alt="Tet Background" fill className="object-cover" priority />
                        </div>
                        <div className="inset-0 z-10 bg-linear-to-b from-red-900/90 via-black/70 to-red-950/90 fixed"></div>

            <div className="relative z-20 w-full max-w-5xl mx-auto">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-red-800/50">
                    <button onClick={() => router.push('/tro-choi/bau-cua')} className="text-yellow-500 hover:text-yellow-300 flex items-center gap-1 transition-colors text-sm font-medium bg-red-950/50 px-4 py-2 rounded-full border border-red-800">
                        <ArrowLeft size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Về Sòng Bạc</span>
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 font-serif flex items-center gap-2">
                        <History className="text-yellow-500" size={28} /> Lịch Sử Cược
                    </h1>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-yellow-500 animate-pulse font-bold text-xl">Đang tải sổ sách...</div>
                ) : history.length === 0 ? (
                    <div className="text-center py-20 bg-black/40 backdrop-blur-md rounded-2xl border border-yellow-500/30">
                        <div className="text-6xl mb-4 opacity-50">🎲</div>
                        <p className="text-red-200 text-lg mb-6">Bạn chưa tham gia ván cược nào.</p>
                        <button onClick={() => router.push('/tro-choi/bau-cua')} className="bg-linear-to-r from-yellow-600 to-yellow-500 text-red-900 px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform">
                            Vào sòng ngay
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {history.map((item) => {
                            const isWin = item.netProfit > 0;
                            const userBets = Object.entries(item.bets).filter(([_, amount]) => (amount as number) > 0);

                            return (
                                <div key={item._id} className="bg-red-950/60 backdrop-blur-md border border-yellow-500/30 rounded-2xl p-5 shadow-xl hover:border-yellow-400 transition-colors flex flex-col relative overflow-hidden">

                                    {/* Dấu watermark Thắng/Thua mờ ở góc */}
                                    <div className="absolute -right-4 -top-4 opacity-10 transform rotate-12 pointer-events-none">
                                        {isWin ? <TrendingUp size={120} className="text-green-500" /> : <TrendingDown size={120} className="text-red-500" />}
                                    </div>

                                    {/* Header Card: Thời gian & Mã phiên */}
                                    <div className="flex justify-between items-center mb-4 border-b border-red-800/50 pb-2 relative z-10">
                                        <div className="text-xs text-red-300">
                                            {new Date(item.createdAt).toLocaleTimeString('vi-VN')} - {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                                        </div>
                                        <div className="text-xs font-mono text-yellow-500 bg-black/50 px-2 py-1 rounded">
                                            #{item.sessionId.slice(-6)}
                                        </div>
                                    </div>

                                    {/* Kết quả Mở Bát */}
                                    <div className="flex flex-col items-center mb-4 relative z-10">
                                        <span className="text-xs text-yellow-500/80 uppercase tracking-widest mb-2 font-bold">Kết quả Mở Bát</span>
                                        <div className="flex gap-3">
                                            {item.result.map((animal: string, idx: number) => (
                                                <div key={idx} className="w-12 h-12 bg-white rounded-lg border-2 border-gray-300 flex items-center justify-center text-3xl shadow-inner">
                                                    {ANIMAL_ICONS[animal]?.icon}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Chi tiết đặt cược của User */}
                                    <div className="bg-black/30 rounded-xl p-3 mb-4 flex-1 relative z-10">
                                        <span className="text-xs text-red-300 block mb-2">Bạn đã đặt:</span>
                                        <div className="flex flex-wrap gap-2">
                                            {userBets.map(([animal, amount]) => (
                                                <div key={animal} className="flex items-center gap-1 bg-red-900/50 border border-red-800 rounded px-2 py-1">
                                                    <span className="text-lg">{ANIMAL_ICONS[animal]?.icon}</span>
                                                    <span className="text-yellow-400 font-mono text-xs font-bold">{formatCoins(amount as number)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Tổng kết Lời/Lỗ */}
                                    <div className={`mt-auto p-3 rounded-xl border relative z-10 flex items-center justify-between
                                        ${isWin ? 'bg-green-900/30 border-green-500/50' : 'bg-red-900/30 border-red-500/50'}
                                    `}>
                                        <span className="text-sm font-bold text-white uppercase">{isWin ? 'Thắng Lớn' : 'Thua Cược'}</span>
                                        <div className={`text-xl font-bold flex items-center gap-1 ${isWin ? 'text-green-400' : 'text-red-400'}`}>
                                            {isWin ? '+' : '-'}{formatCoins(Math.abs(item.netProfit))} <span className="text-sm">🪙</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}