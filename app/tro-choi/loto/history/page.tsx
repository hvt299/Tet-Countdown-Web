'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { ArrowLeft, Ticket } from 'lucide-react';
import { formatCoins } from '@/utils/tetHelper';

interface TicketHistory {
    _id: string;
    sessionId: string;
    matrix: number[][];
    price: number;
    createdAt: string;
}

export default function LotoHistoryPage() {
    const router = useRouter();
    const [history, setHistory] = useState<TicketHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const token = document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
            if (!token) return router.push('/login');

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            try {
                const response = await axios.get(`${API_URL}/loto/history`, {
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
            {/* BACKGROUND */}
            <div className="inset-0 z-[-2] fixed">
                <Image src="/bg-tet.png" alt="Tet Background" fill className="object-cover" priority />
            </div>
            <div className="inset-0 z-10 bg-linear-to-b from-red-900/90 via-black/70 to-red-950/90 fixed"></div>

            <div className="relative z-20 w-full max-w-5xl mx-auto">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-red-800/50">
                    <button onClick={() => router.push('/tro-choi/loto')} className="text-yellow-500 hover:text-yellow-300 flex items-center gap-1 transition-colors text-sm font-medium bg-red-950/50 px-4 py-2 rounded-full border border-red-800">
                        <ArrowLeft size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Về Sòng Bạc</span>
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 font-serif flex items-center gap-2">
                        <Ticket className="text-yellow-500" size={28} /> Lịch Sử Mua Vé
                    </h1>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-yellow-500 animate-pulse font-bold text-xl">Đang tải sổ sách...</div>
                ) : history.length === 0 ? (
                    <div className="text-center py-20 bg-black/40 backdrop-blur-md rounded-2xl border border-yellow-500/30">
                        <div className="text-6xl mb-4 opacity-50">🎟️</div>
                        <p className="text-red-200 text-lg mb-6">Bạn chưa mua tờ vé Lô Tô nào.</p>
                        <button onClick={() => router.push('/tro-choi/loto')} className="bg-linear-to-r from-yellow-600 to-yellow-500 text-red-900 px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform">
                            Mua vé ngay
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {history.map((ticket) => (
                            <div key={ticket._id} className="bg-red-950/60 backdrop-blur-md border border-yellow-500/30 rounded-2xl p-5 shadow-xl hover:border-yellow-400 transition-colors flex flex-col relative overflow-hidden">

                                {/* Dấu watermark mờ ở góc (Icon Ticket) */}
                                <div className="absolute -right-4 -top-4 opacity-[0.05] transform rotate-12 pointer-events-none">
                                    <Ticket size={120} className="text-yellow-500" />
                                </div>

                                {/* Header Card: Thời gian & Mã phiên */}
                                <div className="flex justify-between items-center mb-4 border-b border-red-800/50 pb-2 relative z-10">
                                    <div className="text-xs text-red-300">
                                        {new Date(ticket.createdAt).toLocaleTimeString('vi-VN')} - {new Date(ticket.createdAt).toLocaleDateString('vi-VN')}
                                    </div>
                                    <div className="text-xs font-mono text-yellow-500 bg-black/50 px-2 py-1 rounded">
                                        #{ticket.sessionId.slice(-6)}
                                    </div>
                                </div>

                                {/* Ma trận vé 3x9 */}
                                <div className="bg-black/30 rounded-xl p-3 mb-4 flex-1 relative z-10 flex flex-col gap-1 md:gap-1.5 justify-center">
                                    {ticket.matrix.map((row, rIdx) => (
                                        <div key={rIdx} className="grid grid-cols-9 gap-1 md:gap-1.5">
                                            {row.map((num, cIdx) => (
                                                <div
                                                    key={cIdx}
                                                    className={`flex items-center justify-center aspect-square rounded text-[10px] sm:text-xs font-bold transition-colors
                                                        ${num === 0
                                                            ? 'bg-transparent border border-dashed border-gray-500/50'
                                                            : 'bg-yellow-100 text-red-900 border border-yellow-400 shadow-sm'
                                                        }
                                                    `}
                                                >
                                                    {num > 0 ? num : ''}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>

                                {/* Giá vé */}
                                <div className="mt-auto p-3 rounded-xl border relative z-10 flex items-center justify-between bg-yellow-900/30 border-yellow-500/50">
                                    <span className="text-sm font-bold text-yellow-500 uppercase">Giá Vé</span>
                                    <div className="text-xl font-bold flex items-center gap-1 text-yellow-400">
                                        {formatCoins(ticket.price)} <span className="text-sm">🪙</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}