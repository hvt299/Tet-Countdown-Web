'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { Gift, Home, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function PublicLuckyBudPage() {
    const params = useParams();
    const id = params?.id as string;

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const res = await axios.get(`${API_URL}/lucky-buds/${id}`);
                setData(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchData();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-red-950 text-yellow-500 text-xl font-bold animate-pulse">Đang mở túi lộc...</div>;

    if (!data) return <div className="min-h-screen flex items-center justify-center bg-red-950 text-red-500 font-bold">Không tìm thấy túi lộc này!</div>;

    return (
        <main className="relative min-h-screen flex items-center justify-center font-sans overflow-x-hidden py-10 px-4">
            <div className="inset-0 z-0 fixed"><Image src="/bg-tet.png" alt="Tet Background" fill className="object-cover" priority /></div>
            <div className="inset-0 z-10 bg-linear-to-b from-red-900/80 via-black/60 to-red-900/90 fixed"></div>

            <div className="relative z-20 w-full max-w-md animate-in slide-in-from-bottom-10 fade-in duration-700 flex flex-col items-center">

                {/* Tên người hái */}
                <div className="text-center mb-6 bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                    <h2 className="text-yellow-400 text-sm font-serif mb-1">Túi lộc đầu năm của</h2>
                    <p className="text-white text-xl font-bold uppercase">{data.user?.fullName || data.user?.username}</p>
                </div>

                {/* Bao lì xì khổng lồ */}
                <div className="relative w-full max-w-sm bg-linear-to-b from-red-600 to-red-800 rounded-2xl shadow-2xl border-4 border-yellow-400 p-8 flex flex-col items-center text-center overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

                    <h1 className="relative z-10 text-2xl text-yellow-300 font-bold uppercase mb-4 tracking-wider">Lộc Chữ Đồng Tiền</h1>

                    <div className="relative z-10 bg-yellow-100 p-6 rounded-full w-40 h-40 flex flex-col items-center justify-center shadow-inner border-4 border-yellow-500 mb-6 transform hover:scale-105 transition-transform">
                        <span className="text-5xl font-extrabold text-red-600">{data.coinsReceived}</span>
                        <span className="text-lg font-bold text-red-800 mt-1">Xu Lộc 🪙</span>
                    </div>

                    <div className="relative z-10 w-full text-center bg-black/20 p-4 rounded-xl border border-red-500/30">
                        <Sparkles className="w-5 h-5 text-yellow-500/80 mx-auto mb-2" />
                        <p className="text-white text-base italic font-serif leading-relaxed">
                            "{data.wish?.content}"
                        </p>
                    </div>
                </div>

                {/* CTA Kêu gọi bạn bè vào chơi */}
                <Link href="/hai-loc" className="mt-8 flex items-center gap-2 bg-linear-to-r from-yellow-600 to-yellow-500 text-red-900 font-bold px-8 py-3.5 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:scale-105 transition-transform">
                    <Gift size={20} /> Tự hái lộc cho mình
                </Link>
            </div>
        </main>
    );
}