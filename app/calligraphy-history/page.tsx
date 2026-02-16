'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { ArrowLeft, ScrollText, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function CalligraphyHistoryPage() {
    const router = useRouter();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const getCookie = (name: string) => {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) return parts.pop()?.split(';').shift();
                return null;
            };
            const token = getCookie('access_token');

            if (!token) {
                router.push('/login');
                return;
            }

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            try {
                const response = await axios.get(`${API_URL}/calligraphy/history`, {
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
        const shareText = `🧧 Khai bút đầu Xuân, Ông Đồ tặng mình chữ "${item.givenWord}" (${item.vietnameseMeaning})\n\n📜 Thơ tặng:\n${item.poem}\n\nCùng xem chi tiết bức thư pháp tại đây nhé:\n👉 ${websiteUrl}/chu-ong-do/${item._id}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Chữ Ông Đồ - Tết Countdown',
                    text: shareText,
                });
            } catch (error) {
                console.log('Hủy chia sẻ');
            }
        } else {
            navigator.clipboard.writeText(shareText);
            alert('Đã copy lời chúc và Link Website vào khay nhớ tạm! Bạn có thể dán lên Facebook/Zalo.');
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
                    <button
                        onClick={() => router.push('/xin-chu')}
                        className="text-yellow-500 hover:text-yellow-300 flex items-center gap-1 transition-colors text-sm font-medium focus:outline-none bg-red-950/50 px-4 py-2 rounded-full border border-red-800"
                    >
                        <ArrowLeft size={18} strokeWidth={2.5} />
                        Trở về Xin Chữ
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 font-serif flex items-center gap-2">
                        <ScrollText className="text-yellow-500" size={28} />
                        Lịch Sử Xin Chữ
                    </h1>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-yellow-500 animate-pulse font-bold text-xl">
                        Đang mở sổ thư pháp...
                    </div>
                ) : history.length === 0 ? (
                    <div className="text-center py-20 bg-black/40 backdrop-blur-md rounded-2xl border border-yellow-500/30">
                        <div className="text-6xl mb-4 opacity-50">📜</div>
                        <p className="text-red-200 text-lg mb-6">Bạn chưa xin chữ nào từ Ông Đồ.</p>
                        <button
                            onClick={() => router.push('/xin-chu')}
                            className="bg-linear-to-r from-yellow-600 to-yellow-500 text-red-900 px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
                        >
                            Trở về Xin Chữ
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {history.map((item) => (
                            <div key={item._id} className="bg-red-950/60 backdrop-blur-md border border-yellow-500/30 rounded-2xl p-6 shadow-xl hover:border-yellow-400 transition-colors flex flex-col">
                                <div className="text-center mb-4 border-b border-red-800/50 pb-4">
                                    <div className="w-24 h-24 mx-auto bg-linear-to-br from-yellow-400 to-yellow-600 text-red-900 rounded-full flex items-center justify-center text-5xl font-serif font-bold border-4 border-yellow-200/50 shadow-inner mb-3">
                                        {item.givenWord}
                                    </div>
                                    <h3 className="text-yellow-400 font-bold uppercase tracking-widest">{item.vietnameseMeaning}</h3>
                                    <p className="text-xs text-red-300 mt-1">{new Date(item.createdAt).toLocaleDateString('vi-VN')}</p>
                                </div>

                                <div className="grow">
                                    <p className="text-white/80 text-sm mb-3 italic">
                                        <span className="text-yellow-500 font-semibold not-italic">Cầu nguyện:</span> {item.userWish}
                                    </p>
                                    <div className="bg-black/30 p-3 rounded-lg border border-red-900/50">
                                        <p className="text-red-100 text-sm font-serif whitespace-pre-line leading-relaxed italic text-center">
                                            {item.poem}
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    href={`/chu-ong-do/${item._id}`}
                                    className="mt-5 w-full py-2.5 bg-red-900/40 hover:bg-red-800/60 text-yellow-500 border border-yellow-500/30 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                                >
                                    <ScrollText size={18} /> Thưởng lãm thư pháp
                                </Link>

                                <button
                                    onClick={() => handleShare(item)}
                                    className="mt-5 w-full py-2.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Share2 size={18} /> Khoáng đạt sẻ chia
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}