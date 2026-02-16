'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { ArrowLeft, Gift, Share2, History } from 'lucide-react';
import Link from 'next/link';

export default function LuckyBudsHistoryPage() {
    const router = useRouter();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const token = document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
            if (!token) return router.push('/login');

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            try {
                const response = await axios.get(`${API_URL}/lucky-buds/history`, {
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

    const handleShare = async (item: any) => {
        const websiteUrl = window.location.origin;
        const shareText = `🧧 Khai xuân hái lộc, mình vừa bốc được ${item.coinsReceived} Xu Lộc kèm lời chúc: "${item.wishId?.content}"\n\nCùng hái lộc và xem chi tiết tại đây nhé:\n👉 ${websiteUrl}/xem-loc/${item._id}`;

        if (navigator.share) {
            try { await navigator.share({ title: 'Hái Lộc Đầu Xuân', text: shareText }); } catch (error) { }
        } else {
            navigator.clipboard.writeText(shareText);
            alert('Đã copy thông tin Lộc và Link Website! Bạn có thể dán lên Facebook/Zalo.');
        }
    };

    return (
        <main className="relative min-h-screen flex flex-col font-sans overflow-x-hidden py-10 px-4 md:px-8">
            <div className="inset-0 z-[-2] fixed">
                <Image src="/bg-tet.png" alt="Tet Background" fill className="object-cover" priority />
            </div>
            <div className="inset-0 z-10 bg-linear-to-b from-red-900/90 via-black/70 to-red-950/90 fixed"></div>

            <div className="relative z-20 w-full max-w-5xl mx-auto">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-red-800/50">
                    <button onClick={() => router.push('/hai-loc')} className="text-yellow-500 hover:text-yellow-300 flex items-center gap-1 transition-colors text-sm font-medium bg-red-950/50 px-4 py-2 rounded-full border border-red-800">
                        <ArrowLeft size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Về Cây Lộc</span>
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 font-serif flex items-center gap-2">
                        <History className="text-yellow-500" size={28} /> Lịch Sử Hái Lộc
                    </h1>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-yellow-500 animate-pulse font-bold text-xl">Đang tải sổ lộc...</div>
                ) : history.length === 0 ? (
                    <div className="text-center py-20 bg-black/40 backdrop-blur-md rounded-2xl border border-yellow-500/30">
                        <div className="text-6xl mb-4 opacity-50">🌳</div>
                        <p className="text-red-200 text-lg mb-6">Bạn chưa hái lộc lần nào.</p>
                        <button onClick={() => router.push('/hai-loc')} className="bg-linear-to-r from-yellow-600 to-yellow-500 text-red-900 px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform">
                            Đến Cây Lộc ngay
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {history.map((item) => (
                            <div key={item._id} className="bg-red-950/60 backdrop-blur-md border border-yellow-500/30 rounded-2xl p-6 shadow-xl hover:border-yellow-400 transition-colors flex flex-col items-center text-center">
                                <div className="text-xs text-red-300 mb-3">{new Date(item.pickedAt).toLocaleDateString('vi-VN')} - {new Date(item.pickedAt).toLocaleTimeString('vi-VN')}</div>

                                <div className="w-24 h-24 bg-red-800 rounded-full flex items-center justify-center border-4 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.5)] mb-4">
                                    <span className="text-3xl font-bold text-yellow-400">{item.coinsReceived}</span>
                                    <span className="text-sm text-yellow-400 ml-1">🪙</span>
                                </div>

                                <div className="grow w-full">
                                    <div className="bg-black/30 p-4 rounded-lg border border-red-900/50 mb-4 h-full flex items-center justify-center">
                                        <p className="text-red-100 text-sm italic font-serif leading-relaxed">"{item.wishId?.content}"</p>
                                    </div>
                                </div>

                                <div className="w-full flex gap-3 mt-auto">
                                    <Link href={`/xem-loc/${item._id}`} className="flex-1 py-2.5 bg-red-900/40 hover:bg-red-800/60 text-yellow-500 border border-yellow-500/30 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm">
                                        <Gift size={16} /> Chi tiết
                                    </Link>
                                    <button onClick={() => handleShare(item)} className="flex-1 py-2.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors text-sm">
                                        <Share2 size={16} /> Khoe Lộc
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}