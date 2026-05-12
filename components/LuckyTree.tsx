'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { ArrowLeft, History, Gift, Sparkles, Info, X } from 'lucide-react';
import { Solar } from 'lunar-javascript';

interface LuckyResult {
    id: string;
    coins: number;
    coinMeaning: string;
    wish: string;
    isGiaoThua: boolean;
}

export default function LuckyTree() {
    const router = useRouter();
    const { width, height } = useWindowSize();

    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<LuckyResult | null>(null);
    const [isFestivalTime, setIsFestivalTime] = useState(false);
    const [isGiaoThua, setIsGiaoThua] = useState(false);
    const [treeImage, setTreeImage] = useState('');
    const [hasPickedToday, setHasPickedToday] = useState(false);
    const [activeBuds, setActiveBuds] = useState<{ top: string, left: string, delay: boolean }[]>([]);

    const currentYear = new Date().getFullYear();

    useEffect(() => {
        setTreeImage(Math.random() > 0.5 ? '/images/mai-tree.png' : '/images/dao-tree.png');

        const allPositions = [
            { top: '15%', left: '35%', delay: false }, { top: '30%', left: '65%', delay: true },
            { top: '45%', left: '20%', delay: true }, { top: '55%', left: '75%', delay: false },
            { top: '70%', left: '40%', delay: true }, { top: '25%', left: '20%', delay: false },
            { top: '40%', left: '80%', delay: true }, { top: '65%', left: '15%', delay: false },
            { top: '80%', left: '60%', delay: true }, { top: '10%', left: '55%', delay: false },
        ];
        setActiveBuds(allPositions.sort(() => 0.5 - Math.random()).slice(0, 6));

        const now = new Date();
        const solar = Solar.fromYmd(now.getFullYear(), now.getMonth() + 1, now.getDate());
        const lunar = solar.getLunar();

        let isHaiLocTime = lunar.getMonth() === 1 && lunar.getDay() >= 1 && lunar.getDay() <= 3;
        let isGiaoThuaTime = lunar.getMonth() === 1 && lunar.getDay() === 1 && now.getHours() === 0;

        setIsFestivalTime(isHaiLocTime);
        setIsGiaoThua(isGiaoThuaTime);
        setMounted(true);
    }, []);

    const handlePickBud = async () => {
        setLoading(true);
        setError('');

        const token = document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
        if (!token) return router.push('/login');

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await axios.post(`${API_URL}/lucky-buds/pick`, {}, { headers: { Authorization: `Bearer ${token}` } });
            setResult(response.data);
        } catch (err: any) {
            const errorMsg = err.response?.data?.message;
            const finalError = Array.isArray(errorMsg) ? errorMsg[0] : errorMsg || 'Cây Lộc đang bận, xin vui lòng thử lại sau!';
            setError(finalError);

            if (finalError.includes('đã hái lộc rồi')) {
                setHasPickedToday(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async () => {
        if (!result) return;
        const websiteUrl = window.location.origin;
        const shareText = `🧧 Khai xuân hái lộc, mình vừa bốc được ${result.coins} Xu Lộc kèm lời chúc: "${result.wish}"\n\nCùng hái lộc và xem chi tiết tại đây nhé:\n👉 ${websiteUrl}/xem-loc/${result.id}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Hái Lộc Đầu Xuân',
                    text: shareText,
                });
            } catch (error) {
                console.log('Hủy chia sẻ');
            }
        } else {
            navigator.clipboard.writeText(shareText);
            alert('Đã copy thông tin Lộc và Link Website! Bạn có thể dán lên Facebook/Zalo.');
        }
    };

    if (!mounted) return <div className="min-h-screen bg-red-900"></div>;

    return (
        <div className="relative min-h-screen flex items-center justify-center font-sans overflow-x-hidden py-10 px-4">
            {/* BACKGROUND CHUNG */}
            <div className="inset-0 z-[-2] fixed">
                <Image src="/images/bg-tet.png" alt="Tet Background" fill className="object-cover" priority />
            </div>
            <div className="inset-0 z-10 bg-linear-to-b from-red-900/80 via-black/50 to-red-900/90 fixed"></div>

            {/* PHÁO GIẤY PHẢI NẰM TRÊN CÙNG */}
            {result && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} className="z-100 fixed top-0 left-0 pointer-events-none" />}

            {/* Mở rộng max-w-6xl để chứa Layout 2 cột trên PC */}
            <div className="relative z-20 w-full max-w-6xl bg-black/40 backdrop-blur-md border border-yellow-500/30 rounded-3xl shadow-2xl p-6 md:p-8 transition-all duration-500">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-red-800/50">
                    <button onClick={() => router.push('/')} className="text-yellow-500 hover:text-yellow-300 flex items-center gap-1 transition-colors text-sm font-medium bg-red-950/50 px-3 py-1.5 rounded-full border border-red-800">
                        <ArrowLeft size={18} strokeWidth={2.5} />
                        <span className="hidden sm:inline">Trang Chủ</span>
                    </button>
                    <h1 className="text-xl md:text-3xl font-bold text-yellow-400 font-serif flex items-center gap-2">
                        <Gift className="text-yellow-500 hidden sm:block" size={24} /> Hái Lộc Đầu Xuân
                    </h1>
                    <button onClick={() => router.push('/lucky-buds-history')} className="text-yellow-500 hover:text-yellow-300 flex items-center gap-1 transition-colors text-sm font-medium bg-red-950/50 px-3 py-1.5 rounded-full border border-red-800">
                        <History size={18} strokeWidth={2.5} />
                        <span className="hidden sm:inline">Lịch Sử</span>
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 max-w-2xl mx-auto bg-red-900/80 border border-red-500/50 rounded-xl text-yellow-300 text-center shadow-inner font-semibold animate-bounce-in">
                        {error}
                    </div>
                )}

                {/* ================= BỐ CỤC 2 CỘT ================= */}
                <div className="flex flex-col lg:flex-row gap-8 items-start w-full">

                    {/* CỘT TRÁI (Cây Lộc) */}
                    <div className="w-full lg:w-7/12 flex flex-col items-center">
                        {!isFestivalTime ? (
                            <div className="w-full mt-8 p-6 bg-red-950/60 border border-yellow-500/30 rounded-2xl text-center shadow-inner">
                                <div className="text-4xl mb-3 opacity-60">🔒</div>
                                <h3 className="text-xl font-bold text-yellow-400 mb-2">Chưa đến giờ khai lộc</h3>
                                <p className="text-red-200 text-sm mb-4 leading-relaxed">
                                    Hội hái lộc chỉ diễn ra vào đúng <strong className="text-yellow-500">3 ngày Tết (Mùng 1, 2, 3)</strong>.<br />
                                    Quý khách vui lòng xem lại <strong className="text-yellow-500">Lịch sử hái lộc</strong> ở góc trên nhé!
                                </p>
                                <div className="inline-block px-4 py-2 bg-red-900/50 border border-red-500/30 rounded-lg text-yellow-300 text-xs shadow-inner">
                                    ✨ <strong className="font-bold">Đặc biệt:</strong> Khung giờ Giao Thừa (00:00 - 00:59 Mùng 1) có tỷ lệ rớt siêu lộc khủng!
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500 w-full">
                                <p className="text-red-200 text-center mb-4 italic">
                                    Nhấp vào một bao lì xì trên cây để rước tài lộc về nhà! <br />
                                    <span className="text-xs text-yellow-500/80 not-italic">(Mỗi ngày chỉ được hái 1 lần)</span>
                                </p>

                                <div className="relative w-70 h-95 md:w-87.5 md:h-112.5 mb-6">
                                    <Image src={treeImage} alt="Cây Hoa Tết" fill className={`object-contain transition-opacity duration-300 ${loading ? 'opacity-50 blur-sm' : 'opacity-100'}`} priority />
                                    {loading && (
                                        <div className="absolute inset-0 flex items-center justify-center z-20">
                                            <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                    {!loading && !hasPickedToday && activeBuds.map((pos, index) => (
                                        <button
                                            key={index} onClick={handlePickBud}
                                            className={`absolute w-10 h-14 md:w-14 md:h-20 transition hover:scale-125 focus:outline-none ${pos.delay ? 'animate-swing-delayed' : 'animate-swing'}`}
                                            style={{ top: pos.top, left: pos.left }}
                                        >
                                            <Image src="/images/lixi.png" alt="Lì xì" fill className="object-contain drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CỘT PHẢI (Bảng Tỷ lệ & Ý nghĩa) */}
                    <div className="w-full lg:w-5/12 flex flex-col gap-6">

                        {/* --- BẢNG TỶ LỆ RƠI LỘC --- */}
                        <div className="bg-red-950/60 border border-yellow-500/30 rounded-2xl p-5 shadow-inner">
                            <h3 className="text-yellow-400 font-bold mb-4 flex items-center gap-2 border-b border-red-800/50 pb-2">
                                <Gift size={20} /> Tỷ Lệ Rơi Lộc Hiện Tại
                            </h3>

                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Ngày Thường */}
                                <div className={`flex-1 rounded-xl p-4 transition-all duration-300 border-2 ${!isGiaoThua ? 'bg-green-900/20 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)] scale-100' : 'bg-black/30 border-gray-700 opacity-50 scale-95'}`}>
                                    <h4 className={`font-bold text-sm uppercase mb-3 ${!isGiaoThua ? 'text-green-400' : 'text-gray-400'}`}>Ngày Thường {!isGiaoThua && '(Đang áp dụng)'}</h4>
                                    <ul className="text-sm space-y-2 text-red-100">
                                        <li className="flex justify-between"><span>🌱 Nhỏ (68, 88)</span> <strong className="text-white">50%</strong></li>
                                        <li className="flex justify-between"><span>🌿 Vừa (168, 288)</span> <strong className="text-white">30%</strong></li>
                                        <li className="flex justify-between"><span>🌳 Lớn (888, 999)</span> <strong className="text-white">15%</strong></li>
                                        <li className="flex justify-between"><span>✨ Siêu Lộc</span> <strong className="text-yellow-400">5%</strong></li>
                                    </ul>
                                </div>

                                {/* Giao Thừa */}
                                <div className={`flex-1 rounded-xl p-4 transition-all duration-300 border-2 ${isGiaoThua ? 'bg-yellow-900/30 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)] scale-100' : 'bg-black/30 border-gray-700 opacity-50 scale-95'}`}>
                                    <h4 className={`font-bold text-sm uppercase mb-3 flex items-center gap-2 ${isGiaoThua ? 'text-yellow-400' : 'text-gray-400'}`}>Giao Thừa 🎇 {isGiaoThua && '(Đang áp dụng)'}</h4>
                                    <ul className="text-sm space-y-2 text-red-100">
                                        <li className="flex justify-between"><span>🌱 Nhỏ (68, 88)</span> <strong className="text-white">40%</strong></li>
                                        <li className="flex justify-between"><span>🌿 Vừa (168, 288)</span> <strong className="text-white">30%</strong></li>
                                        <li className="flex justify-between"><span>🌳 Lớn (888, 999)</span> <strong className="text-white">20%</strong></li>
                                        <li className="flex justify-between text-yellow-300"><span>✨ Siêu Lộc</span> <strong className="text-yellow-400 animate-pulse">10%</strong></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* --- BẢNG Ý NGHĨA CON SỐ --- */}
                        <div className="bg-red-950/60 border border-yellow-500/30 rounded-2xl p-5 shadow-inner">
                            <h3 className="text-yellow-400 font-bold mb-4 flex items-center gap-2 border-b border-red-800/50 pb-2">
                                <Info size={20} /> Ý Nghĩa Con Số Lộc
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-sm text-red-100">
                                <div className="flex gap-2"><span className="w-10 font-bold text-yellow-400 text-right">68:</span> <span>Lộc Phát</span></div>
                                <div className="flex gap-2"><span className="w-10 font-bold text-yellow-400 text-right">88:</span> <span>Phát Phát</span></div>
                                <div className="flex gap-2"><span className="w-10 font-bold text-yellow-400 text-right">168:</span> <span>Mãi Lộc</span></div>
                                <div className="flex gap-2"><span className="w-10 font-bold text-yellow-400 text-right">288:</span> <span>Mãi Phát</span></div>
                                <div className="flex gap-2"><span className="w-10 font-bold text-yellow-400 text-right">888:</span> <span>Phát Phát Phát</span></div>
                                <div className="flex gap-2"><span className="w-10 font-bold text-yellow-400 text-right">999:</span> <span>Vĩnh Cửu trường tồn</span></div>
                                <div className="flex gap-2"><span className="w-10 font-bold text-yellow-400 text-right">1000:</span> <span>Khởi đầu rực rỡ</span></div>
                                <div className="flex gap-2"><span className="w-10 font-bold text-yellow-400 text-right">{currentYear}:</span> <span>Năm mới thăng hoa</span></div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* POPUP MODAL KẾT QUẢ TRÚNG LỘC */}
            {result && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="animate-in zoom-in-90 fade-in duration-300 w-full max-w-md bg-linear-to-b from-red-600 to-red-800 p-8 rounded-2xl shadow-[0_0_50px_rgba(234,179,8,0.3)] border-4 border-yellow-400 text-center relative overflow-hidden">

                        {/* Nút Đóng Modal (Dấu X) */}
                        <button
                            onClick={() => setResult(null)}
                            className="absolute top-3 right-3 text-yellow-400 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-1 transition-colors z-20"
                        >
                            <X size={20} />
                        </button>

                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

                        <h2 className="relative z-10 text-2xl md:text-3xl text-yellow-300 font-bold uppercase mb-2">
                            {result.isGiaoThua ? "🎉 Lộc Vàng Giao Thừa 🎉" : "🧧 Chúc Mừng Năm Mới 🧧"}
                        </h2>
                        <div className="relative z-10 w-full h-1 bg-yellow-400/50 my-4 rounded"></div>

                        <p className="relative z-10 text-white text-lg md:text-xl italic mb-6 leading-relaxed">
                            "{result.wish}"
                        </p>

                        <div className="relative z-10 bg-yellow-100 p-5 rounded-xl shadow-inner mb-6 transform transition hover:scale-105 border-2 border-yellow-500">
                            <p className="text-gray-700 text-sm md:text-base font-semibold uppercase mb-1">Túi bạn vừa nhận được</p>
                            <p className="text-5xl md:text-6xl font-extrabold text-red-600 flex items-center justify-center gap-2 drop-shadow-md py-2">
                                {result.coins} <span className="text-3xl md:text-4xl">🪙</span>
                            </p>
                            <div className="inline-block bg-red-600 px-4 py-1 rounded-full mt-2">
                                <p className="text-yellow-300 font-bold text-lg tracking-wide uppercase">
                                    {result.coinMeaning}
                                </p>
                            </div>
                        </div>

                        <div className="relative z-10 flex gap-4 mt-2">
                            <button onClick={() => router.push('/lucky-buds-history')} className="flex-1 py-3 bg-red-900/50 text-yellow-400 border border-yellow-500 hover:bg-red-900 rounded-xl font-bold transition-colors shadow-lg">
                                Cất vào túi
                            </button>
                            <button
                                onClick={handleShare}
                                className="flex-1 py-3 bg-linear-to-r from-yellow-600 to-yellow-500 text-red-900 rounded-xl font-bold hover:scale-105 transition-transform shadow-[0_0_15px_rgba(234,179,8,0.5)] flex items-center justify-center gap-2"
                            >
                                <Sparkles size={20} /> Khoe ngay
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}