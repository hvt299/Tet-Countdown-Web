'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import FallingFlowers from '@/components/FallingFlowers';
import { ArrowLeft, PenTool, ScrollText, Sparkles, History } from 'lucide-react';

export default function XinChuPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        userName: '',
        userWish: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<any>(null);

    // Lấy tên mặc định từ token nếu có
    useEffect(() => {
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
            return null;
        };

        const token = getCookie('access_token');
        if (token) {
            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                if (decoded && decoded.fullName) {
                    setFormData((prev) => ({ ...prev, userName: decoded.fullName }));
                }
            } catch (e) {
                // Ignore
            }
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

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
            const response = await axios.post(
                `${API_URL}/calligraphy/ask`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setResult(response.data);
        } catch (err: any) {
            const errorMsg = err.response?.data?.message;
            setError(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg || 'Ông Đồ đang bận, xin vui lòng thử lại sau!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen flex items-center justify-center font-sans overflow-x-hidden py-10 px-4">
            {/* BACKGROUND */}
            <div className="inset-0 z-0 fixed">
                <Image src="/bg-tet.png" alt="Tet Background" fill className="object-cover" priority />
            </div>
            <div className="inset-0 z-10 bg-linear-to-b from-red-900/80 via-black/50 to-red-900/90 fixed"></div>

            {/* CONTAINER CHÍNH */}
            <div className="relative z-20 w-full max-w-2xl bg-black/40 backdrop-blur-md border border-yellow-500/30 rounded-3xl shadow-2xl p-6 md:p-10 transition-all duration-500">

                {/* HEADER (Nút Back bên trái, Lịch sử bên phải) */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-red-800/50">
                    <button
                        onClick={() => router.push('/')}
                        className="text-yellow-500 hover:text-yellow-300 flex items-center gap-1 transition-colors text-sm font-medium focus:outline-none bg-red-950/50 px-3 py-1.5 rounded-full border border-red-800"
                    >
                        <ArrowLeft size={18} strokeWidth={2.5} />
                        <span className="hidden sm:inline">Trang Chủ</span>
                    </button>

                    <h1 className="text-xl md:text-3xl font-bold text-yellow-400 font-serif flex items-center gap-2">
                        <PenTool className="text-yellow-500 hidden sm:block" size={24} />
                        Xin Chữ Ông Đồ
                    </h1>

                    <button
                        onClick={() => router.push('/calligraphy-history')}
                        className="text-yellow-500 hover:text-yellow-300 flex items-center gap-1 transition-colors text-sm font-medium focus:outline-none bg-red-950/50 px-3 py-1.5 rounded-full border border-red-800"
                    >
                        <History size={18} strokeWidth={2.5} />
                        <span className="hidden sm:inline">Lịch Sử</span>
                    </button>
                </div>

                {/* FORM XIN CHỮ (Chỉ hiện khi chưa có kết quả và đang không tải) */}
                {!result && !loading && (
                    <div className="animate-in fade-in zoom-in duration-500">
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4 animate-bounce">📜</div>
                            <p className="text-red-200 text-base md:text-lg italic">
                                "Mỗi năm hoa đào nở<br />
                                Lại thấy ông đồ già..."
                            </p>
                            <p className="mt-4 text-sm text-yellow-500/80">
                                Hãy thành tâm viết ra mong cầu, Ông Đồ AI sẽ tặng bạn một chữ mang linh khí đất trời.
                            </p>
                            <div className="mt-3 inline-block px-4 py-1.5 bg-red-900/30 border border-red-800/50 rounded-full">
                                <p className="text-xs text-red-300">
                                    <span className="font-bold text-yellow-500/80">* Lời nhắn:</span> Ông Đồ viết tối đa 3 chữ/ngày, mỗi lần cách nhau 10 phút để mài mực.
                                </p>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-xl text-red-100 text-center shadow-inner leading-relaxed">
                                {error.split('\n').map((line, i) => (
                                    <p key={i}>{line}</p>
                                ))}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-yellow-500 text-sm font-bold mb-2">Tên người nhận chữ</label>
                                <input
                                    type="text" required maxLength={50}
                                    className="w-full px-4 py-3 text-lg rounded-xl bg-red-950/50 border-2 border-red-800/50 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                                    placeholder="Tên của bạn hoặc người thân..."
                                    value={formData.userName}
                                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-yellow-500 text-sm font-bold mb-2">Lời cầu nguyện đầu năm</label>
                                <textarea
                                    required maxLength={200} rows={3}
                                    className="w-full px-4 py-3 text-base rounded-xl bg-red-950/50 border-2 border-red-800/50 text-white focus:outline-none focus:border-yellow-500 transition-colors resize-none placeholder-red-300/30"
                                    placeholder="Ví dụ: Cầu cho gia đình bình an, công việc năm nay hanh thông thuận lợi..."
                                    value={formData.userWish}
                                    onChange={(e) => setFormData({ ...formData, userWish: e.target.value })}
                                />
                                <div className="text-right text-xs text-red-400 mt-1">
                                    {formData.userWish.length}/200
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 mt-2 text-xl bg-linear-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-red-900 font-bold rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.3)] transform transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
                            >
                                <Sparkles size={24} />
                                Xin Chữ Ngay
                            </button>
                        </form>
                    </div>
                )}

                {/* MÀN HÌNH LOADING KHI GỌI GEMINI */}
                {loading && (
                    <div className="py-20 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
                        <div className="relative w-24 h-24 mb-6">
                            <div className="absolute inset-0 border-4 border-yellow-500/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-yellow-500 rounded-full border-t-transparent animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-4xl animate-pulse">🖌️</div>
                        </div>
                        <h2 className="text-2xl font-bold text-yellow-400 font-serif mb-2">Ông Đồ đang mài mực...</h2>
                        <p className="text-red-200 italic">Xin quý khách kiên nhẫn đợi trong giây lát, chữ đang được phóng bút.</p>
                    </div>
                )}

                {/* BỨC LIỄN ĐỎ - KẾT QUẢ AI */}
                {result && !loading && (
                    <div className="animate-in slide-in-from-bottom-10 fade-in duration-700 flex flex-col items-center">

                        <div className="text-center mb-6">
                            <h2 className="text-yellow-400 text-xl font-serif mb-1">Dành tặng cho</h2>
                            <p className="text-white text-2xl font-bold">{result.userName}</p>
                        </div>

                        {/* GIẤY XUYẾN CHỈ */}
                        <div className="relative w-full max-w-sm bg-red-700 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.8)] border-[6px] border-double border-yellow-500/80 p-6 md:p-8 flex flex-col items-center justify-center min-h-100">
                            {/* Texture giấy mờ */}
                            <div className="absolute inset-0 opacity-10 mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/rice-paper.png")' }}></div>

                            {/* Đinh tán 4 góc */}
                            <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-yellow-500/50"></div>
                            <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-yellow-500/50"></div>
                            <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-yellow-500/50"></div>
                            <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-yellow-500/50"></div>

                            {/* CHỮ THƯ PHÁP */}
                            <h1 className="relative z-10 text-[8rem] md:text-[10rem] font-serif text-yellow-400 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)] leading-none mb-4">
                                {result.givenWord}
                            </h1>

                            <div className="relative z-10 bg-yellow-500/20 px-4 py-1 rounded border border-yellow-500/50 mb-6">
                                <span className="text-yellow-300 font-bold text-2xl uppercase tracking-widest">{result.vietnameseMeaning}</span>
                            </div>

                            {/* BÀI THƠ */}
                            <div className="relative z-10 w-full text-center">
                                <ScrollText className="w-6 h-6 text-yellow-500/50 mx-auto mb-3" />
                                <div className="text-red-50 text-base md:text-lg italic font-serif leading-relaxed whitespace-pre-line">
                                    {result.poem}
                                </div>
                            </div>
                        </div>

                        {/* Ý NGHĨA */}
                        <div className="w-full mt-8 p-5 bg-red-950/60 border border-yellow-500/30 rounded-xl text-center shadow-inner">
                            <h3 className="text-yellow-400 font-bold mb-2">Ông Đồ gửi gắm:</h3>
                            <p className="text-red-100 text-sm md:text-base leading-relaxed">
                                {result.content}
                            </p>
                        </div>

                        {/* NÚT ACTION LẠI */}
                        <div className="flex gap-4 mt-8 w-full">
                            <button
                                onClick={() => router.push('/calligraphy-history')}
                                className="flex-1 py-3 text-yellow-500 border border-yellow-500 hover:bg-yellow-500/10 rounded-xl font-bold transition-colors"
                            >
                                Xem sổ Lịch sử
                            </button>
                            <button
                                onClick={() => {
                                    setResult(null);
                                    setFormData({ ...formData, userWish: '' });
                                }}
                                className="flex-1 py-3 bg-linear-to-r from-yellow-600 to-yellow-500 text-red-900 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
                            >
                                Xin chữ mới
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}