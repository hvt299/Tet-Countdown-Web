'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { ScrollText, Home } from 'lucide-react';
import Link from 'next/link';

export default function PublicCalligraphyPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const res = await axios.get(`${API_URL}/calligraphy/public/${id}`);
                setData(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchData();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-yellow-500 text-xl font-bold animate-pulse">Đang mở bức liễn...</div>;

    if (!data) return <div className="min-h-screen flex items-center justify-center bg-black text-red-500 font-bold">Không tìm thấy bức thư pháp này!</div>;

    return (
        <main className="relative min-h-screen flex items-center justify-center font-sans overflow-x-hidden py-10 px-4">
            <div className="inset-0 z-[-2] fixed"><Image src="/bg-tet.png" alt="Tet Background" fill className="object-cover" priority /></div>
            <div className="inset-0 z-10 bg-linear-to-b from-red-900/80 via-black/60 to-red-900/90 fixed"></div>

            <div className="relative z-20 w-full max-w-md animate-in slide-in-from-bottom-10 fade-in duration-700 flex flex-col items-center">
                <div className="text-center mb-6 bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-yellow-500/30">
                    <h2 className="text-yellow-400 text-sm font-serif mb-1">Thư pháp của</h2>
                    <p className="text-white text-xl font-bold">{data.user?.fullName || data.userName}</p>
                </div>

                <div className="relative w-full max-w-sm bg-red-700 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.8)] border-[6px] border-double border-yellow-500/80 p-6 flex flex-col items-center justify-center min-h-100">
                    <div className="absolute inset-0 opacity-10 mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/rice-paper.png")' }}></div>
                    <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-yellow-500/50"></div>

                    <h1 className="relative z-10 text-[8rem] font-serif text-yellow-400 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)] leading-none mb-4">{data.givenWord}</h1>
                    <div className="relative z-10 bg-yellow-500/20 px-4 py-1 rounded border border-yellow-500/50 mb-6 text-center">
                        <span className="text-yellow-300 font-bold text-2xl uppercase tracking-widest">{data.vietnameseMeaning}</span>
                    </div>
                    <div className="relative z-10 w-full text-center">
                        <ScrollText className="w-6 h-6 text-yellow-500/50 mx-auto mb-3" />
                        <div className="text-red-50 text-base italic font-serif leading-relaxed whitespace-pre-line">{data.poem}</div>
                    </div>
                </div>

                <Link href="/" className="mt-8 flex items-center gap-2 bg-linear-to-r from-yellow-600 to-yellow-500 text-red-900 font-bold px-8 py-3.5 rounded-full shadow-lg hover:scale-105 transition-transform">
                    <Home size={20} /> Về Trang Chủ
                </Link>
            </div>
        </main>
    );
}